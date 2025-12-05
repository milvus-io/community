---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Sbloccare il vero recupero a livello di entità: Nuove funzionalità
  Array-of-Structs e MAX_SIM in Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_struct_cover_457c5a104b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Scoprite come Array of Structs e MAX_SIM in Milvus consentono una vera ricerca
  a livello di entità per i dati multivettoriali, eliminando la deduplicazione e
  migliorando la precisione del recupero.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Se avete costruito applicazioni di intelligenza artificiale su database vettoriali, probabilmente avete riscontrato lo stesso problema: il database recupera embedding di singoli pezzi, ma la vostra applicazione si interessa alle <strong><em>entità</em>.</strong> Questo disallineamento rende complesso l'intero flusso di lavoro di recupero.</p>
<p>È probabile che questa situazione si ripeta più volte:</p>
<ul>
<li><p><strong>Basi di conoscenza RAG:</strong> Gli articoli sono raggruppati in embedding di paragrafi, quindi il motore di ricerca restituisce frammenti sparsi invece del documento completo.</p></li>
<li><p><strong>Raccomandazioni di e-commerce:</strong> Un prodotto ha più incorporazioni di immagini e il sistema restituisce cinque angolazioni dello stesso articolo anziché cinque prodotti unici.</p></li>
<li><p><strong>Piattaforme video:</strong> I video sono suddivisi in embedding di clip, ma i risultati della ricerca mostrano fette dello stesso video anziché un'unica voce consolidata.</p></li>
<li><p><strong>Recupero in stile ColBERT / ColPali:</strong> I documenti si espandono in centinaia di incorporazioni a livello di token o di patch, e i risultati vengono restituiti come piccoli pezzi che devono ancora essere uniti.</p></li>
</ul>
<p>Tutti questi problemi derivano dalla <em>stessa lacuna architettonica</em>: la maggior parte dei database vettoriali tratta ogni incorporazione come una riga isolata, mentre le applicazioni reali operano su entità di livello superiore: documenti, prodotti, video, oggetti, scene. Di conseguenza, i team di ingegneri sono costretti a ricostruire le entità manualmente, utilizzando logiche di deduplicazione, raggruppamento, separazione e riclassificazione. Funziona, ma è fragile, lento e gonfia il livello dell'applicazione con una logica che non avrebbe mai dovuto essere presente.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> colma questa lacuna con una nuova funzionalità: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> con il tipo metrico <strong>MAX_SIM</strong>. Insieme, consentono di memorizzare tutte le incorporazioni di una singola entità in un unico record e permettono a Milvus di valutare e restituire l'entità in modo olistico. Niente più insiemi di risultati duplicati. Niente più complesse post-elaborazioni come reranking e merging.</p>
<p>In questo articolo spiegheremo come funzionano Array of Structs e MAX_SIM e li dimostreremo attraverso due esempi reali: Il recupero di documenti di Wikipedia e la ricerca di documenti basata su immagini di ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Che cos'è un array di strutture?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>In Milvus, un campo <strong>Array of Structs</strong> consente a un singolo record di contenere un <em>elenco ordinato</em> di elementi Struct, ognuno dei quali segue lo stesso schema predefinito. Una struttura può contenere vettori multipli, campi scalari, stringhe o qualsiasi altro tipo supportato. In altre parole, consente di raggruppare tutti i pezzi che appartengono a un'entità - embedding di paragrafi, viste di immagini, vettori di token, metadati - direttamente in una riga.</p>
<p>Ecco un esempio di entità di una collezione che contiene un campo Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Nell'esempio precedente, il campo <code translate="no">chunks</code> è un campo Array of Structs e ogni elemento Struct contiene i propri campi, ovvero <code translate="no">text</code>, <code translate="no">text_vector</code> e <code translate="no">chapter</code>.</p>
<p>Questo approccio risolve un problema di modellazione di lunga data nei database vettoriali. Tradizionalmente, ogni incorporazione o attributo deve diventare una riga a sé stante, il che costringe le <strong>entità multivettore (documenti, prodotti, video)</strong> a essere suddivise in decine, centinaia o addirittura migliaia di record. Con Array of Structs, Milvus consente di memorizzare l'intera entità multivettore in un unico campo, il che lo rende naturale per gli elenchi di paragrafi, le incorporazioni di token, le sequenze di clip, le immagini multi-view o qualsiasi scenario in cui un elemento logico è composto da molti vettori.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Come funziona un array di strutture con MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Sopra questa nuova struttura ad array di strutture si trova <strong>MAX_SIM</strong>, una nuova strategia di punteggio che rende il reperimento semantico consapevole delle entità. Quando arriva una query, Milvus la confronta con <em>ogni</em> vettore all'interno di ogni array di strutture e prende la <strong>massima somiglianza</strong> come punteggio finale dell'entità. L'entità viene quindi classificata e restituita in base a questo singolo punteggio. In questo modo si evita il classico problema del database vettoriale, che consiste nel recuperare frammenti sparsi, e si sposta l'onere del raggruppamento, della deduplicazione e della riclassificazione nel livello dell'applicazione. Con MAX_SIM, il recupero a livello di entità diventa integrato, coerente ed efficiente.</p>
<p>Per capire come funziona MAX_SIM nella pratica, vediamo un esempio concreto.</p>
<p><strong>Nota:</strong> tutti i vettori di questo esempio sono generati dallo stesso modello di incorporazione e la somiglianza è misurata con la somiglianza del coseno nell'intervallo [0,1].</p>
<p>Supponiamo che un utente cerchi <strong>"Corso di apprendimento automatico per principianti".</strong></p>
<p>La query è stata tokenizzata in tre <strong>token</strong>:</p>
<ul>
<li><p><em>apprendimento automatico</em></p></li>
<li><p><em>principiante</em></p></li>
<li><p><em>corso</em></p></li>
</ul>
<p>Ciascuno di questi token viene poi <strong>convertito in un vettore di incorporamento</strong> dallo stesso modello di incorporamento utilizzato per i documenti.</p>
<p>Immaginiamo che il database dei vettori contenga due documenti:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Guida introduttiva alle reti neurali profonde con Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>Una guida avanzata alla lettura dei documenti di un LLM.</em></p></li>
</ul>
<p>Entrambi i documenti sono stati incorporati in vettori e memorizzati in un array di strutture.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Passo 1: Calcolo di MAX_SIM per doc_1</strong></h3><p>Per ogni vettore di query, Milvus calcola la sua somiglianza di coseno rispetto a ogni vettore di doc_1:</p>
<table>
<thead>
<tr><th></th><th>Introduzione</th><th>guida</th><th>reti neurali profonde</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>apprendimento automatico</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>principiante</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>corso</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Per ogni vettore di query, MAX_SIM seleziona la somiglianza <strong>più alta</strong> dalla sua riga:</p>
<ul>
<li><p>apprendimento automatico → reti neurali profonde (0,9)</p></li>
<li><p>principiante → introduzione (0,8)</p></li>
<li><p>corso → guida (0,7)</p></li>
</ul>
<p>Sommando le migliori corrispondenze si ottiene per doc_1 un <strong>punteggio MAX_SIM di 2,4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Passo 2: Calcolo di MAX_SIM per il documento_2</h3><p>Ora ripetiamo il procedimento per il documento_2:</p>
<table>
<thead>
<tr><th></th><th>avanzato</th><th>guida</th><th>LLM</th><th>carta</th><th>lettura</th></tr>
</thead>
<tbody>
<tr><td>apprendimento automatico</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>principiante</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>corso</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Le migliori corrispondenze per il doc_2 sono:</p>
<ul>
<li><p>"machine learning" → "LLM" (0,9)</p></li>
<li><p>"principiante" → "guida" (0,6)</p></li>
<li><p>"corso" → "guida" (0,8)</p></li>
</ul>
<p>Sommandoli, il doc_2 ottiene un <strong>punteggio MAX_SIM di 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Passo 3: confrontare i punteggi</h3><p>Poiché <strong>2,4 &gt; 2,3</strong>, il <strong>doc_1 si classifica più in alto del doc_2</strong>, il che ha un senso intuitivo, poiché il doc_1 è più vicino a una guida introduttiva all'apprendimento automatico.</p>
<p>Da questo esempio, possiamo evidenziare tre caratteristiche fondamentali di MAX_SIM:</p>
<ul>
<li><p><strong>Prima di tutto semantica, non basata su parole chiave:</strong> MAX_SIM confronta gli embeddings, non i letterali di testo. Anche se <em>"machine learning"</em> e <em>"deep neural networks"</em> hanno zero parole in comune, la loro somiglianza semantica è pari a 0,9. Questo rende MAX_SIM robusto rispetto ai sinonimi. Questo rende MAX_SIM robusto ai sinonimi, alle parafrasi, alle sovrapposizioni concettuali e ai moderni carichi di lavoro ricchi di embedding.</p></li>
<li><p><strong>Insensibile alla lunghezza e all'ordine:</strong> MAX_SIM non richiede che la query e il documento abbiano lo stesso numero di vettori (ad esempio, il documento_1 ha 4 vettori mentre il documento_2 ne ha 5, ed entrambi funzionano bene). Inoltre, non tiene conto dell'ordine dei vettori: "principiante" che compare prima nella query e "introduzione" che compare dopo nel documento non hanno alcun impatto sul punteggio.</p></li>
<li><p><strong>Ogni vettore della query è importante:</strong> MAX_SIM prende la migliore corrispondenza per ogni vettore della query e somma i punteggi migliori. In questo modo si evita che i vettori non abbinati influenzino il risultato e si garantisce che ogni token di query importante contribuisca al punteggio finale. Ad esempio, la corrispondenza di qualità inferiore per "principiante" in doc_2 riduce direttamente il punteggio complessivo.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Perché MAX_SIM + Array di strutture sono importanti nel database vettoriale<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><a href="https://milvus.io/">Milvus</a> è un database vettoriale open-source ad alte prestazioni e ora supporta pienamente MAX_SIM insieme ad Array of Structs, consentendo il reperimento di entità multivettoriali a livello vettoriale:</p>
<ul>
<li><p><strong>Memorizzare entità multivettore in modo nativo:</strong> Array of Structs consente di memorizzare gruppi di vettori correlati in un unico campo senza dividerli in righe separate o tabelle ausiliarie.</p></li>
<li><p><strong>Calcolo efficiente del best-match:</strong> In combinazione con indici vettoriali come IVF e HNSW, MAX_SIM può calcolare le migliori corrispondenze senza scansionare ogni vettore, mantenendo alte le prestazioni anche con documenti di grandi dimensioni.</p></li>
<li><p><strong>Costruito appositamente per carichi di lavoro ad alto contenuto semantico:</strong> Questo approccio eccelle nel reperimento di testi lunghi, nella corrispondenza semantica multi-sfaccettata, nell'allineamento documento-sommario, nelle query con più parole chiave e in altri scenari di intelligenza artificiale che richiedono un ragionamento semantico flessibile e a grana fine.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Quando usare un array di strutture<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Il valore di <strong>Array of Structs</strong> diventa chiaro quando si guarda a ciò che consente. Nel suo nucleo, questa funzione fornisce tre funzionalità fondamentali:</p>
<ul>
<li><p><strong>Riunisce dati eterogenei - vettori</strong>, scalari, stringhe, metadati - in un unico oggetto strutturato.</p></li>
<li><p><strong>Allinea l'archiviazione alle entità del mondo reale</strong>, in modo che ogni riga del database corrisponda perfettamente a un elemento reale, come un articolo, un prodotto o un video.</p></li>
<li><p><strong>Se combinato con funzioni di aggregazione come MAX_SIM</strong>, consente di recuperare un vero e proprio multivettore a livello di entità direttamente dal database, eliminando la deduplicazione, il raggruppamento o il reranking nel livello applicativo.</p></li>
</ul>
<p>Grazie a queste proprietà, Array of Structs è una soluzione naturale ogni volta che una <em>singola entità logica è rappresentata da più vettori</em>. Esempi comuni sono gli articoli suddivisi in paragrafi, i documenti scomposti in token embeddings o i prodotti rappresentati da più immagini. Se i risultati della ricerca soffrono di duplicazioni, frammenti sparsi o la stessa entità appare più volte nei primi risultati, Array of Structs risolve questi problemi a livello di archiviazione e recupero, non attraverso patch a posteriori nel codice dell'applicazione.</p>
<p>Questo pattern è particolarmente potente per i moderni sistemi di intelligenza artificiale che si basano sul <strong>recupero di più vettori</strong>. Ad esempio:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> rappresenta un singolo documento come 100-500 token embeddings per una corrispondenza semantica a grana fine in domini come il testo legale e la ricerca accademica.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> converte </a>ogni pagina PDF in 256-1024 patch di immagini per il recupero cross-modale di bilanci, contratti, fatture e altri documenti scansionati.</p></li>
</ul>
<p>Un array di strutture consente a Milvus di memorizzare tutti questi vettori sotto un'unica entità e di calcolare la somiglianza aggregata (ad esempio, MAX_SIM) in modo efficiente e nativo. Per rendere più chiaro questo concetto, ecco due esempi concreti.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Esempio 1: Ricerca di prodotti di e-commerce</h3><p>In precedenza, i prodotti con più immagini venivano memorizzati in uno schema piatto: un'immagine per riga. Un prodotto con immagini frontali, laterali e angolate produceva tre righe. I risultati della ricerca spesso restituivano più immagini dello stesso prodotto, richiedendo la deduplicazione e la riclassificazione manuale.</p>
<p>Con un array di strutture, ogni prodotto diventa <strong>una riga</strong>. Tutte le incorporazioni delle immagini e i metadati (angolo, is_primary, ecc.) vivono all'interno di un campo <code translate="no">images</code> come array di strutture. Milvus capisce che appartengono allo stesso prodotto e restituisce il prodotto nel suo complesso, non le singole immagini.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Esempio 2: Base di conoscenza o ricerca su Wikipedia</h3><p>In precedenza, un singolo articolo di Wikipedia era suddiviso in <em>N</em> righe di paragrafi. I risultati della ricerca restituivano paragrafi sparsi, costringendo il sistema a raggrupparli e a indovinare a quale articolo appartenessero.</p>
<p>Con un array di strutture, l'intero articolo diventa <strong>una riga</strong>. Tutti i paragrafi e i loro incorporamenti sono raggruppati in un campo paragrafo e il database restituisce l'articolo completo, non pezzi frammentati.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Esercitazioni pratiche: Recupero a livello di documento con l'array di strutture<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Recupero dei documenti di Wikipedia</h3><p>In questa esercitazione vedremo come utilizzare un <strong>Array of Structs</strong> per convertire i dati a livello di paragrafo in record di documenti completi, consentendo a Milvus di eseguire un <strong>vero e proprio recupero a livello di documento</strong>, invece di restituire frammenti isolati.</p>
<p>Molte pipeline di basi di conoscenza memorizzano gli articoli di Wikipedia come pezzi di paragrafo. Questo funziona bene per l'incorporazione e l'indicizzazione, ma non per il recupero: una query dell'utente restituisce tipicamente paragrafi sparsi, costringendo l'utente a raggruppare e ricostruire manualmente l'articolo. Con un array di strutture e MAX_SIM, possiamo riprogettare lo schema di memorizzazione in modo che <strong>ogni articolo diventi una riga</strong> e Milvus possa classificare e restituire l'intero documento in modo nativo.</p>
<p>Nei prossimi passi mostreremo come:</p>
<ol>
<li><p>Caricare e preelaborare i dati dei paragrafi di Wikipedia</p></li>
<li><p>raggruppare tutti i paragrafi appartenenti allo stesso articolo in un array di strutture</p></li>
<li><p>Inserire questi documenti strutturati in Milvus</p></li>
<li><p>Eseguire query MAX_SIM per recuperare gli articoli completi, in modo pulito, senza deduplicazione o reranking.</p></li>
</ol>
<p>Alla fine di questo tutorial, avrete una pipeline funzionante in cui Milvus gestisce direttamente il recupero a livello di entità, esattamente nel modo in cui gli utenti si aspettano.</p>
<p><strong>Modello dei dati:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Passo 1: raggruppare e trasformare i dati</strong></p>
<p>Per questa dimostrazione, utilizziamo il set di dati <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 2: Creare la raccolta Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 3: inserimento dei dati e costruzione dell'indice</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 4: Ricerca dei documenti</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Confronto dei risultati: Recupero tradizionale vs. Array di strutture</strong></p>
<p>L'impatto di Array of Structs diventa chiaro quando si guarda a ciò che il database effettivamente restituisce:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimensione</strong></th><th style="text-align:center"><strong>Approccio tradizionale</strong></th><th style="text-align:center"><strong>Array di strutture</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Output del database</strong></td><td style="text-align:center">Restituisce i <strong>primi 100 paragrafi</strong> (elevata ridondanza)</td><td style="text-align:center">Restituisce i <em>primi 10 documenti completi</em> - puliti e accurati</td></tr>
<tr><td style="text-align:center"><strong>Logica applicativa</strong></td><td style="text-align:center">Richiede il <strong>raggruppamento, la deduplicazione e il reranking</strong> (complesso)</td><td style="text-align:center">Non è necessaria alcuna post-elaborazione - i risultati a livello di entità provengono direttamente da Milvus</td></tr>
</tbody>
</table>
<p>Nell'esempio di Wikipedia, abbiamo dimostrato solo il caso più semplice: la combinazione di vettori di paragrafi in una rappresentazione unificata del documento. Ma il vero punto di forza di Array of Structs è che è generalizzabile a <strong>qualsiasi</strong> modello di dati multivettoriali, sia alle classiche pipeline di recupero che alle moderne architetture di intelligenza artificiale.</p>
<p><strong>Scenari di recupero multivettoriale tradizionali</strong></p>
<p>Molti sistemi di ricerca e raccomandazione consolidati operano naturalmente su entità con più vettori associati. Array of Structs si adatta perfettamente a questi casi d'uso:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Scenario</strong></th><th style="text-align:center"><strong>Modello di dati</strong></th><th style="text-align:center"><strong>Vettori per entità</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Prodotti di e-commerce</strong></td><td style="text-align:center">Un prodotto → più immagini</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Ricerca video</strong></td><td style="text-align:center">Un video → più clip</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Ricerca carta</strong></td><td style="text-align:center">Un documento → più sezioni</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Carichi di lavoro dei modelli di intelligenza artificiale (casi d'uso chiave multivettoriali)</strong></p>
<p>L'array di strutture diventa ancora più critico nei moderni modelli di IA che producono intenzionalmente grandi insiemi di vettori per entità per un ragionamento semantico a grana fine.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modello</strong></th><th style="text-align:center"><strong>Modello di dati</strong></th><th style="text-align:center"><strong>Vettori per entità</strong></th><th style="text-align:center"><strong>Applicazione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Un documento → molte incorporazioni di token</td><td style="text-align:center">100-500</td><td style="text-align:center">Testo legale, documenti accademici, recupero di documenti a grana fine</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Una pagina PDF → molte incorporazioni di patch</td><td style="text-align:center">256-1024</td><td style="text-align:center">Rapporti finanziari, contratti, fatture, ricerca di documenti multimodale</td></tr>
</tbody>
</table>
<p>Questi modelli <em>richiedono</em> uno schema di archiviazione multivettoriale. Prima di Array of Structs, gli sviluppatori dovevano dividere i vettori tra le righe e ricucire manualmente i risultati. Con Milvus, queste entità possono ora essere memorizzate e recuperate in modo nativo, con MAX_SIM che gestisce automaticamente il punteggio a livello di documento.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. Ricerca di documenti basata su immagini ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> è un potente modello per il recupero cross-modale di PDF. Invece di basarsi sul testo, elabora ogni pagina PDF come un'immagine e la suddivide in un massimo di 1024 patch visive, generando un embedding per ogni patch. In uno schema di database tradizionale, ciò richiederebbe la memorizzazione di una singola pagina come centinaia o migliaia di righe separate, rendendo impossibile per il database capire che queste righe appartengono alla stessa pagina. Di conseguenza, la ricerca a livello di entità diventa frammentata e poco pratica.</p>
<p>Array of Structs risolve questo problema in modo pulito, memorizzando tutti i patch embeddings <em>all'interno di un singolo campo</em>, consentendo a Milvus di trattare la pagina come un'entità coesa e multivettoriale.</p>
<p>La ricerca tradizionale nei PDF dipende spesso dall'<strong>OCR</strong>, che converte le immagini delle pagine in testo. Questo funziona per il testo semplice, ma perde grafici, tabelle, layout e altri elementi visivi. ColPali evita questa limitazione lavorando direttamente sulle immagini delle pagine, conservando tutte le informazioni visive e testuali. Il compromesso è la scala: ogni pagina contiene ora centinaia di vettori, il che richiede un database in grado di aggregare molte incorporazioni in un'unica entità, esattamente ciò che fornisce Array of Structs + MAX_SIM.</p>
<p>Il caso d'uso più comune è <strong>Vision RAG</strong>, dove ogni pagina PDF diventa un'entità multivettore. Gli scenari tipici includono:</p>
<ul>
<li><p><strong>Rapporti finanziari:</strong> ricerca in migliaia di PDF di pagine contenenti grafici o tabelle specifiche.</p></li>
<li><p><strong>Contratti:</strong> recupero di clausole da documenti legali scansionati o fotografati.</p></li>
<li><p><strong>Fatture:</strong> ricerca di fatture per fornitore, importo o layout.</p></li>
<li><p><strong>Presentazioni:</strong> individuazione delle diapositive che contengono una particolare figura o diagramma.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modello di dati:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 1: Preparare i dati</strong>Per i dettagli su come ColPali converte le immagini o il testo in rappresentazioni multivettoriali, potete consultare il documento.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 2: Creare la collezione Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 3: Inserire i dati e costruire l'indice</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fase 4: Ricerca intermodale: Interrogazione del testo → Risultati dell'immagine</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Esempio di output:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Qui i risultati restituiscono direttamente le pagine PDF complete. Non è necessario preoccuparsi delle 1024 patch embeddings sottostanti: Milvus gestisce automaticamente l'aggregazione.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>La maggior parte dei database vettoriali memorizza ogni frammento come un record indipendente, il che significa che le applicazioni devono riassemblare i frammenti quando hanno bisogno di un documento, un prodotto o una pagina completa. Un array di strutture cambia questa situazione. Combinando scalari, vettori, testo e altri campi in un unico oggetto strutturato, permette a una riga di database di rappresentare un'entità completa da capo a fondo.</p>
<p>Il risultato è semplice ma potente: il lavoro che prima richiedeva complessi raggruppamenti, deduplicazioni e riordini nel livello applicativo diventa una capacità nativa del database. Il futuro dei database vettoriali è proprio questo: strutture più ricche, recupero più intelligente e pipeline più semplici.</p>
<p>Per ulteriori informazioni su Array of Structs e MAX_SIM, consultate la documentazione qui sotto:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Documentazione Milvus</a></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
