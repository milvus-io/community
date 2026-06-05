---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >-
  Perché abbiamo costruito Loon: un motore di archiviazione per i dati di
  intelligenza artificiale che non smettono di cambiare.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Chat_GPT_Image_Jun_5_2026_04_23_58_PM_716fe391b5.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >-
  Loon è un nuovo motore di archiviazione per Milvus 3.0 e Zilliz Vector
  Lakebase, costruito per gestire insiemi di dati vettoriali in evoluzione con
  ColumnGroups, allineamento degli ID delle righe e Manifest.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Questo blog è stato pubblicato originariamente su zilliz.com ed è stato ripubblicato con autorizzazione.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Punti chiave<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa è un'immersione ingegneristica lunga e approfondita, quindi ecco i punti chiave prima di entrare nei dettagli.</p>
<ul>
<li>I dataset di intelligenza artificiale non sono tabelle statiche. Le stesse righe cambiano continuamente quando i team sostituiscono i modelli di incorporazione, aggiungono vettori sparsi, rivedono le didascalie, riempiono le etichette, ricostruiscono gli indici ed eseguono analisi offline.</li>
<li>I layout di archiviazione tradizionali si rompono in tre modi: le lunghe colonne vettoriali rendono costosi i backfill, un unico formato di file non può servire bene sia le scansioni che le letture puntuali e l'archiviazione in database privati costringe le pipeline esterne a creare copie extra della verità.</li>
<li>Loon è il nuovo motore di archiviazione per Milvus e Zilliz Vector Lakebase. Si basa su formati di file ibridi, sull'allineamento degli ID delle righe e su un Manifest che definisce lo stato di versione del set di dati.</li>
<li>L'obiettivo è quello di consentire a un singolo set di dati vettoriali di supportare la ricerca online, l'analisi offline, i backfill, la compattazione e il calcolo esterno senza dover continuamente copiare, riscrivere o reimportare i dati.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Per un certo periodo, c'è stato un argomento ragionevole contro i database vettoriali.</p>
<p><em>I database tradizionali memorizzano già numeri interi, stringhe, JSON, blob e indici. Perché non aggiungere un</em> <em>tipo</em> <code translate="no">_vector_</code> <em>, costruire un indice ANN accanto ad esso e chiudere la questione?</em></p>
<p>Per la ricerca semantica iniziale, questa soluzione funziona abbastanza bene. Una colonna vettoriale e un indice possono supportare una demo, una piccola applicazione RAG o una funzione di ricerca interna. Il problema si presenta più tardi, quando il dataset inizia a comportarsi meno come una tabella e più come un sistema di dati AI.</p>
<p>Un dataset vettoriale di produzione ha righe, chiavi primarie, campi scalari e colonne interrogabili. In questo senso, assomiglia a una tabella di database. Ma ha anche la scala e la forma del flusso di lavoro di un lago di dati. Può contenere centinaia di milioni di record. Viene letto e riscritto ripetutamente da Spark, Ray, DuckDB, pipeline di formazione, lavori di valutazione e sistemi di qualità dei dati.</p>
<p>Dipende anche dallo storage di oggetti. Gli oggetti di origine sono spesso video, immagini, PDF, file audio o documenti web che rimangono in S3, GCS, OSS o in un altro archivio di oggetti. Il database memorizza riferimenti, metadati, caratteristiche derivate e indici. Poi aggiunge cose che i modelli di archiviazione tradizionali non sono stati costruiti per gestire come oggetti di prima classe: embeddings densi, vettori sparsi, didascalie, indici vettoriali, indici di testo, registri di cancellazione, statistiche, versioni del modello, versioni del parser, riferimenti a blob esterni e le relazioni di versione tra tutti questi elementi.</p>
<p><strong>È qui che l'idea di "aggiungere semplicemente una colonna vettoriale" comincia a non funzionare.</strong> Il problema non è se un database può memorizzare byte vettoriali. Molti sistemi possono farlo. La domanda più difficile è <strong>se il modello di archiviazione sia in grado di gestire le modifiche dei dati vettoriali, le interrogazioni e la loro condivisione nello stack di dati dell'intelligenza artificiale.</strong></p>
<p><strong>Ecco perché abbiamo costruito Loon, il nuovo motore di storage per Milvus e</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(la prossima evoluzione di Zilliz Cloud).</strong></p>
<p>Loon è stato progettato con tre idee:</p>
<ol>
<li>Utilizzare diversi formati fisici per diversi tipi di colonne.</li>
<li>Allineare queste colonne attraverso uno spazio ID di riga condiviso.</li>
<li>Utilizzare un Manifest per definire lo stato di versione del dataset.</li>
</ol>
<p>Per capire perché questi elementi sono importanti, iniziamo con un comune flusso di lavoro multimodale.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Un set di dati vettoriali non è mai veramente finito.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Immaginiamo un team di AI che costruisce un set di dati video per l'addestramento multimodale.</p>
<p>Un lungo video viene caricato sullo storage a oggetti. Una pipeline lo taglia in clip in base ai cambi di scena, ai confini dell'inquadratura o alle finestre temporali. Le clip troppo lunghe o troppo corte, sfocate, duplicate o di bassa qualità vengono filtrate. I clip rimanenti vengono valutati da un modello estetico, sottotitolati da un altro modello, incorporati da un modello di linguaggio visivo e archiviati in un database vettoriale per la ricerca, la deduplicazione e il filtraggio dei dati di addestramento.</p>
<p>Ad alto livello, il flusso di lavoro sembra semplice:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Ma il set di dati non arriva completamente formato.</p>
<ul>
<li>Nella prima settimana, la tabella può contenere solo <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> e <code translate="no">duration</code>.</li>
<li>Nella seconda settimana, il team aggiunge <code translate="no">aesthetic_score</code>.</li>
<li>Nella terza settimana, viene eseguito un modello di didascalia e ogni clip riceve un <code translate="no">caption</code>.</li>
<li>Nella quarta settimana, il primo modello di embedding viene messo online e ogni clip riceve un embedding CLIP a 768 dimensioni.</li>
<li>Un mese dopo, il team cambia modello e riempie nuovamente <code translate="no">embedding_v2</code>, ora con 1024 dimensioni.</li>
<li>Due mesi dopo, la ricerca ibrida diventa un requisito, quindi il team aggiunge una colonna vettoriale rada.</li>
<li>Tre mesi dopo, le didascalie sono sottoposte a revisione umana e devono essere corrette sul posto.</li>
</ul>
<p>Il set di dati non è mai stato completato. Continuava ad accumulare nuove interpretazioni delle stesse righe sottostanti.</p>
<p>Questa è una delle differenze fondamentali tra i dati vettoriali e i dati aziendali tradizionali. La stessa riga viene rielaborata più volte. E la scala trasforma questo inconveniente in un problema di archiviazione: i set di dati multimodali spesso non sono milioni di record, ma centinaia di milioni o miliardi. LAION-5B è un utile riferimento per la forma: miliardi di coppie immagine-testo, ciascuna con metadati, didascalie e incorporazioni. Quindi la parte difficile non è il primo inserimento. La parte difficile è tutto ciò che accade dopo che il set di dati inizia a evolversi. <strong>L'evoluzione espone tre problemi.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Il primo problema: le colonne lunghe rendono costosa l'amplificazione della scrittura.<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati colonnari come Parquet sono eccellenti per molti carichi di lavoro analitici. Funzionano bene quando gli schemi sono abbastanza stabili, i dati vengono letti più spesso che riscritti, le scansioni riguardano solo un sottoinsieme di colonne e la compressione è importante. Questo è il mondo per cui molti formati analitici sono stati ottimizzati.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Le righe vettoriali sono molto più larghe di quelle analitiche</h3><p>TPC-H <code translate="no">lineitem</code> è un buon punto di riferimento. Ha 16 colonne: chiavi intere, valori decimali, date, stringhe brevi e un piccolo campo di commento. Una riga non compressa è di circa 150 byte. Dopo la compressione, può essere molto più piccola. Con un gruppo di righe da 64 MB, un sistema di archiviazione può contenere centinaia di migliaia di righe in un unico gruppo.</p>
<p><strong>I set di dati vettoriali non hanno questo aspetto.</strong></p>
<p>Un set di dati immagine-testo in stile LAION è molto più vicino a ciò che molte pipeline di IA producono oggi. Ogni riga ha ancora i normali metadati: un URL, una didascalia, larghezza, altezza, punteggi di qualità, etichette e così via. Ma una volta aggiunto l'incorporamento, la forma fisica della riga cambia.</p>
<p>Un vettore CLIP a 768 dimensioni occupa circa 1,5 KB in fp16 o 3 KB in fp32. Una sola colonna può essere molto più grande di un'intera riga di TPC-H <code translate="no">lineitem</code>.</p>
<p>E 768 dimensioni non sono insolite o grandi per gli standard odierni. Un embedding a 1024 o 2048 dimensioni è comune nelle pipeline multimodali. <code translate="no">text-embedding-3-large</code> di OpenAI arriva a 3072 dimensioni, pari a circa 12 KB per vettore in fp32.</p>
<p>Il confronto è netto:</p>
<table>
<thead>
<tr><th>Forma del set di dati</th><th>Dimensione approssimativa delle righe</th><th>Cosa domina la riga</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>~150 byte non compressi</td><td>campi scalari e stringhe brevi</td></tr>
<tr><td>Riga in stile LAION con vettore fp16 di 768 dimensioni</td><td>~1,5 KB+</td><td>incorporazione</td></tr>
<tr><td>Riga in stile LAION con vettore fp32 a 768 dimensioni</td><td>~3 KB+</td><td>incorporazione</td></tr>
<tr><td>Riga con vettore fp32 a 3072-dim</td><td>~12 KB+ per il solo vettore</td><td>incorporazione</td></tr>
</tbody>
</table>
<p>In molti set di dati AI, la colonna del vettore non è solo un altro campo. Fisicamente, è la maggior parte della riga. Questo cambia il costo dell'evoluzione dello schema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">L'aggiunta di una colonna vettoriale può significare centinaia di gigabyte.</h3><p>Supponiamo che un set di dati contenga 100 milioni di videoclip. Aggiungere una nuova colonna di incorporazione fp32 a 1024 dimensioni significa scrivere circa 400 GB di dati vettoriali grezzi. Questo dato non include le statistiche, gli indici, gli aggiornamenti dei metadati, l'overhead dello storage degli oggetti, la validazione o l'integrazione del percorso di servizio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Se il team aggiunge ogni mese una o due colonne di tipo vettoriale, come le funzioni <code translate="no">embedding_v2</code>, <code translate="no">sparse_vector</code> o rerank, l'evoluzione dello schema diventa un lavoro di ingegneria daAta ricorrente, misurato in centinaia di gigabyte o terabyte.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Piccoli aggiornamenti logici possono innescare grandi riscritture fisiche</h3><p>Gli aggiornamenti sono altrettanto importanti.</p>
<p>Nei sistemi colonnari, i vecchi dati di solito non vengono aggiornati sul posto. Un registro di cancellazione registra ciò che è cambiato e la compattazione riscrive successivamente le righe vive in nuovi file. Questo modello è gestibile quando le righe sono piccole.</p>
<p>Con i dati vettoriali, un piccolo aggiornamento logico può innescare una grande riscrittura fisica.</p>
<p>Un lavoro di revisione umano può correggere solo poche centinaia di byte in una didascalia. Ma se la didascalia, il vettore denso, il vettore rado e altre caratteristiche derivate condividono lo stesso ciclo di vita del file fisico, il sistema può finire per riscrivere anche i vettori. Il cambiamento logico è piccolo. L'I/O fisico può essere enorme.</p>
<p>Questo è il problema dell'amplificazione della scrittura nell'archiviazione vettoriale. La parte costosa non è solo che i vettori sono grandi. È che i campi derivati di grandi dimensioni e i campi mutabili di piccole dimensioni sono spesso legati insieme da un layout di archiviazione che li tratta come un'unica unità.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Per i dataset di intelligenza artificiale, il backfill è un carico di lavoro di routine.</h3><p>Per le tabelle analitiche tradizionali, l'evoluzione dello schema può avvenire solo occasionalmente. Per gli insiemi di dati di intelligenza artificiale, è un'operazione di routine. I modelli di didascalia vengono aggiornati. I modelli di incorporamento vengono sostituiti. Vettori sparsi vengono aggiunti successivamente. Appaiono caratteristiche di reranking. Le etichette umane vengono corrette. I tag di governance vengono riempiti. Gli indici vengono ricostruiti.</p>
<p>Queste operazioni non sono semplici aggiunte. Spesso modificano o estendono le righe esistenti.</p>
<p>Ecco perché lo storage vettoriale non può limitarsi a ottimizzare la velocità di scansione. Deve anche rendere più economici i backfill e gli aggiornamenti parziali.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Il secondo problema: gli stessi dati devono supportare scansioni e letture puntuali.<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo la scrittura dei dati, il percorso di lettura si divide. Lo stesso set di dati vettoriali ha in genere due modelli di accesso distinti: la <strong>scansione analitica e la lettura puntuale.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">I carichi di lavoro analitici richiedono scansioni ampie e compresse.</h3><p>Una pipeline può eseguire filtri come:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Oppure può eseguire analisi offline, valutazione dell'incorporazione completa, statistiche BM25, costruzione di bitmap, controlli di qualità dei dati, conteggi e group-bys.</p>
<p>Questo schema legge molte righe ma solo poche colonne. Predilige l'I/O sequenziale, i gruppi di righe più grandi, la compressione, la riduzione delle colonne, la decodifica batch e l'esecuzione vettoriale.</p>
<p>I grandi gruppi di righe sono utili in questo caso. Permettono a una singola richiesta di I/O di prelevare una grande quantità di dati utili, migliorano l'efficienza della compressione e forniscono al motore di esecuzione una quantità di dati contigui sufficiente ad ammortizzare l'overhead. Quando più colonne vengono lette insieme, mantenerle organizzate per la velocità di scansione aiuta anche a ridurre le miss della cache durante l'esecuzione vettoriale.</p>
<p>Parquet è forte su questa strada.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">I risultati di ANN necessitano di ricerche ristrette a livello di riga</h3><p>Dopo che la ricerca ANN restituisce gli ID delle righe candidate, il sistema ha spesso bisogno di recuperare campi come:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Questo schema legge un numero inferiore di righe, spesso centinaia o migliaia, ma ha bisogno di un accesso preciso per ID di riga. Vuole individuare una riga e una colonna specifiche, recuperare solo l'intervallo di byte richiesto ed evitare di estrarre un intero gruppo di righe solo per recuperare alcuni record.</p>
<p>La ricerca per punti ha una preferenza quasi opposta rispetto alla scansione. Vuole una granularità di lettura più piccola. Idealmente, il livello di memorizzazione può trovare il segmento o l'intervallo di byte pertinente in base all'ID della riga, leggere solo quell'intervallo e decodificare solo i dati necessari per il risultato.</p>
<p>Anche la compressione ha un diverso compromesso. Per le scansioni, spesso vale la pena di utilizzare una compressione più pesante, perché il sistema legge molti dati e risparmia I/O. Per la ricerca di punti, la compressione può diventare un problema se il recupero di una riga richiede la decodifica di un blocco compresso molto più grande.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Un layout non può essere ottimizzato per entrambi i percorsi</h3><p>Questo è il conflitto principale. Il filtraggio scalare e l'analisi vogliono layout ampi, compressi e facili da scansionare. La ricerca vettoriale vuole layout stretti, precisi e indirizzabili alle righe.</p>
<p>Un singolo formato di file può supportare entrambi in una certa misura, ma non può essere ottimale per entrambi contemporaneamente.</p>
<p>Se tutte le colonne vivono in Parquet, le scansioni scalari sono comode. Ma la ricerca di RNA dopo il richiamo diventa più difficile. Il sistema potrebbe aver bisogno solo di qualche centinaio di vettori, didascalie o record di metadati, mentre il livello di memorizzazione potrebbe dover leggere grandi gruppi di righe che contengono per lo più righe irrilevanti.</p>
<p>Su un'unità SSD locale, cache e mmap possono nascondere parte di questo costo. Una volta che i dati sono archiviati nello storage a oggetti, il costo diventa più visibile. Ogni miss della cache può diventare una lettura di un intervallo remoto. Se le righe candidate sono sparse in molti gruppi di righe, una singola query può innescare più letture, ognuna delle quali estrae più dati di quelli necessari alla query. In un layout mal strutturato, il recupero di 1.000 righe candidate può facilmente comportare decine o centinaia di megabyte di I/O non necessari e, in casi estremi, molto di più.</p>
<p>La riduzione dei gruppi di righe aiuta la ricerca dei punti, ma danneggia le scansioni. Troppi piccoli frammenti riducono l'efficienza della compressione, aumentano l'overhead dei metadati e interrompono le lunghe letture sequenziali da cui dipendono i motori analitici.</p>
<p><strong>Il problema non è quindi trovare una singola dimensione magica per i gruppi di righe. Il problema è che allo stesso set di dati viene chiesto di comportarsi come due sistemi di archiviazione diversi.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">La ricerca ibrida costringe entrambi i percorsi in un'unica query</h3><p>La ricerca ibrida rende il conflitto più difficile da ignorare. Una singola query può prima applicare filtri scalari:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Poi esegue la ricerca ANN.</p>
<p>Poi recupera didascalie, vettori e metadati per ID riga.</p>
<p>Per l'utente, questa è una richiesta di ricerca. Per il livello di archiviazione, si tratta di una scansione analitica e di una ricerca casuale a bassa latenza.</p>
<p>Ecco perché l'archiviazione vettoriale ha bisogno di qualcosa di più di una migliore impostazione di Parquet. Ha bisogno di un modo per posizionare le diverse colonne in base a come vengono effettivamente lette.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Il terzo problema: il set di dati non vive all'interno di un unico motore<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>I primi due problemi si verificano all'interno del database. Il terzo si verifica al confine tra i sistemi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Le pipeline di dati dell'intelligenza artificiale si estendono su più sistemi</h3><p>Nel flusso di lavoro dei video, molto poco avviene all'interno del database vettoriale.</p>
<p>I video grezzi vivono in un archivio di oggetti. La generazione di clip può essere eseguita in Spark o Ray. La valutazione estetica può essere eseguita in un servizio GPU. Le didascalie possono essere eseguite in una pipeline di inferenza LLM. Gli embeddings possono essere generati da un altro lavoro su GPU. I vettori sparsi possono provenire da un servizio SPLADE. La valutazione offline, il filtraggio dei dati di formazione, la revisione umana e i lavori di governance possono essere eseguiti altrove.</p>
<p>Il database dei vettori serve per la ricerca online, ma il set di dati viene prodotto, corretto, valutato ed esteso da molti sistemi.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">I formati di archiviazione privati creano più copie della verità</h3><p>Se il database utilizza un formato fisico privato che solo lui può leggere e scrivere, ogni lavoro esterno necessita di un'esportazione, una conversione, una copia e un'importazione. La stessa collezione può esistere nel database, in una directory temporanea di Spark, in un output di valutazione e in una directory di backfill locale. Allora la vera domanda diventa:</p>
<ul>
<li>Quale copia è la fonte della verità?</li>
<li>Quale contiene il modello di didascalia del mese scorso?</li>
<li>Quali righe sono già state corrette dalla revisione umana?</li>
<li>Quale colonna vettoriale rada è stata generata da quale modello?</li>
<li>Quale indice vettoriale è ancora valido dopo il backfill?</li>
<li>A quale oggetto video originale si riferisce questa riga?</li>
</ul>
<p>Su piccola scala, i team possono talvolta sopravvivere con convenzioni di denominazione e controlli manuali. Con centinaia di milioni di righe e terabyte di incorporazioni, questo diventa un problema di coerenza.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Gli insiemi di dati vettoriali hanno bisogno di uno stato versionato condiviso</h3><p>I sistemi Lakehouse hanno affrontato una versione di questo problema per i dati strutturati. Iceberg, Delta Lake e Hudi non si limitano a memorizzare i file. Il loro contributo principale consiste nel permettere a più motori di coordinarsi intorno allo stesso stato della tabella.</p>
<p>I database vettoriali hanno bisogno di una capacità simile, ma lo stato è più complesso. Deve includere non solo i file delle tabelle e le partizioni, ma anche gli indici vettoriali, gli indici di testo, le caratteristiche sparse, i registri delle cancellazioni, le statistiche, gli intervalli di ID delle righe e i riferimenti a blob esterni.</p>
<p>La domanda non è semplicemente: "Spark può leggere i file Milvus?".</p>
<p>La domanda è: dopo che Spark riempie una colonna vettoriale rada, come fa Milvus a sapere a quale versione appartiene quella colonna, quali righe copre, quale modello l'ha prodotta e quando le query online possono usarla in modo sicuro?</p>
<p>La risposta deve risiedere nel modello di memorizzazione.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Perché le patch non sono sufficienti<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Si è tentati di trattare questi problemi come tre problemi ingegneristici separati.</p>
<ul>
<li>Amplificazione della scrittura? Aggiungere il batching.</li>
<li>Letture puntuali? Aggiungere una cache.</li>
<li>Sistemi esterni? Aggiungere strumenti di esportazione e importazione.</li>
</ul>
<p>Queste patch possono aiutare, ma non risolvono il problema di fondo: un set di dati vettoriali è fisicamente eterogeneo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nell'esempio del video, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> e <code translate="no">aesthetic_score</code> sono campi scalari brevi. Sono utili per il filtraggio e l'analisi.</p>
<ul>
<li><code translate="no">caption</code> è un testo. Può essere usato per BM25, revisione, correzione e riempimento.</li>
<li><code translate="no">embedding</code> è un vettore lungo e denso. Viene utilizzato per il richiamo della RNA e successivamente per il lookup o il reranking a livello di riga.</li>
<li><code translate="no">embedding_v2</code> è un nuovo output del modello, spesso riempito molto tempo dopo l'inserimento dei dati originali.</li>
<li><code translate="no">sparse_vector</code> supporta la ricerca ibrida e ha un proprio modello di accesso.</li>
<li>Il video grezzo deve rimanere nell'archivio oggetti. Il database deve memorizzare un riferimento, un checksum, un tipo MIME, una versione del parser e una relazione a livello di riga.</li>
<li>Gli indici vettoriali, gli indici di testo, le statistiche e i registri delle cancellazioni sono oggetti derivati con una propria semantica di versione.</li>
</ul>
<p>Questi oggetti condividono una riga logica, ma non dovrebbero condividere lo stesso layout fisico o lo stesso ciclo di vita.</p>
<ul>
<li>Se sono costretti in un layout di tabella ordinario, gli aggiornamenti diventano costosi.</li>
<li>Se sono costretti in un unico formato di file colonnare, la lettura dei punti diventa costosa.</li>
<li>Se vengono trattati come file oggetto non correlati, la gestione delle versioni diventa fragile.</li>
</ul>
<p>Il modello di archiviazione deve quindi partire dal fatto che il set di dati è eterogeneo.</p>
<p><strong>Questo porta a tre requisiti di progettazione:</strong></p>
<ul>
<li>Primo, i diversi gruppi di colonne devono essere memorizzati in formati fisici diversi.</li>
<li>In secondo luogo, questi gruppi di colonne hanno bisogno di uno spazio ID riga condiviso, in modo da potersi comportare come un'unica tabella logica.</li>
<li>In terzo luogo, il set di dati ha bisogno di un Manifest versionato che dichiari quali file, indici, log, statistiche e riferimenti agli oggetti appartengono alla vista corrente.</li>
</ul>
<p><strong>Questo è il progetto alla base di Loon, il nostro nuovo motore di archiviazione alla base di Milvus e Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: un motore di archiviazione dietro Milvus e Zilliz Cloud per insiemi di dati vettoriali in evoluzione<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Per risolvere tutti questi problemi, abbiamo creato <strong>Loon</strong>, il nuovo motore di storage per Milvus e <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prossima evoluzione di Zilliz Cloud), progettato per i dataset vettoriali in evoluzione.</p>
<p>Il nome segue la tradizione di Zilliz di dare un nome agli uccelli. Un loon è un uccello subacqueo che vive sui laghi, il che si adatta bene all'obiettivo del sistema: un database vettoriale non deve spostare, scansionare o riscrivere un intero lago di dati ogni volta che esegue una query, riempie una colonna o costruisce un indice. Dovrebbe prima comprendere la versione corrente del dataset, comprese le colonne, gli indici, le statistiche, i registri delle cancellazioni e i riferimenti agli oggetti, quindi leggere solo la parte di cui ha effettivamente bisogno.</p>
<p>I formati di file ibridi, l'allineamento degli ID di riga e il Manifest non sono tre caratteristiche separate. Nascono dallo stesso presupposto progettuale: un set di dati vettoriali è intrinsecamente eterogeneo.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Tre pezzi, un modello di archiviazione</h3><p>I formati di file ibridi riconoscono che colonne diverse hanno modelli di accesso diversi. I campi scalari sono adatti a scansioni e filtri. I campi vettoriali necessitano di una ricerca efficiente a livello di riga. Gli oggetti grezzi come i video, i PDF, le immagini e i file audio devono essere memorizzati negli oggetti, non nei file di dati dei database.</p>
<p>L'allineamento dell'ID riga riconosce che queste colonne possono essere fisicamente separate, ma descrivono comunque le stesse righe logiche. Una didascalia, un incorporamento, un vettore sparso e un URI video possono risiedere in file e formati diversi, ma devono comunque essere riuniti in un unico risultato.</p>
<p>Il Manifesto riconosce che il set di dati non viene scritto una volta sola e lasciato in pace. Sarà modificato da più sistemi, in più versioni e per più compiti. Gli indici, le statistiche, i registri delle cancellazioni, i riferimenti a oggetti esterni e i gruppi di colonne devono apparire tutti nella stessa vista versionata.</p>
<p><strong>Ecco perché Loon non è solo un formato di file vettoriale più veloce.</strong> Un formato più veloce aiuta la ricerca dei punti, ma non risolve l'evoluzione dello schema o il coordinamento tra più motori. L'allineamento dell'ID di riga consente alle colonne divise di comportarsi come una singola tabella, ma non specifica quali file appartengono alla versione corrente. Un Manifest può descrivere lo stato di un set di dati, ma senza gruppi di colonne e allineamento degli ID di riga, non può rappresentare in modo pulito diversi layout fisici all'interno di una raccolta logica.</p>
<p>Il modello di archiviazione ha bisogno di tutte e tre le cose: formati diversi per i diversi gruppi di colonne, uno spazio ID di riga condiviso per ricostruire le righe e un Manifest versionato che indichi a ogni lettore e scrittore qual è il dataset attuale.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Dove si inserisce Loon in Milvus e Zilliz Vector Lakebase</h3><p>In Milvus, sostituisce il vecchio livello di archiviazione binlog a segmenti con un modello costruito intorno a Manifest, ColumnGroup, formato di file e astrazioni di filesystem. In <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prossima evoluzione di Zilliz Cloud)<strong>,</strong> la stessa direzione si applica all'architettura di Vector Lakebase: mantenere il percorso di servizio del database vettoriale veloce e rendere i dati sottostanti più facili da evolvere, analizzare e coordinare con sistemi esterni.</p>
<p>I componenti Milvus di livello superiore mantengono i loro ruoli familiari. Proxy gestisce l'instradamento. QueryCoord e DataCoord gestiscono la programmazione. IndexNode costruisce gli indici. Le API rivolte alle applicazioni per le raccolte, gli inserimenti, le ricerche e le ricerche ibride non hanno bisogno di esporre file Manifest o ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il cambiamento è sotto gli occhi di tutti.</p>
<p>DataNode, QueryNode, segcore, compattazione e connettori esterni possono operare attraverso la stessa astrazione di storage. Questo è importante perché l'insieme di dati non è più scritto e letto solo dal database. Può essere esteso da sistemi di calcolo esterni e consumato simultaneamente dalla ricerca online.</p>
<p>Ad alto livello, i livelli appaiono come segue:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il Manifest descrive lo stato di versione del set di dati. I gruppi di colonne mappano un insieme logico in gruppi fisici di colonne. Il livello del formato dei file consente a ogni ColumnGroup di scegliere un formato appropriato. L'astrazione del filesystem funziona sia con l'archiviazione a oggetti che con l'archiviazione locale.</p>
<p>Il punto importante è che i formati di file ibridi, l'allineamento degli ID di riga e il Manifest non sono caratteristiche separate. Insieme, definiscono il modello di memorizzazione.</p>
<p>Una volta definito questo modello, possiamo esaminare una per una le tre scelte progettuali: come Loon memorizza i diversi gruppi di colonne, come li allinea in righe e come il Manifest trasforma questi file in un set di dati con versioni.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Progettazione 1: utilizzare il formato di file giusto per il gruppo di colonne giusto<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Colonne diverse hanno modelli di accesso diversi. Non devono essere costrette nello stesso formato di file.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon separa una collezione logica in gruppi di colonne.</h3><ul>
<li>I campi scalari, i campi filtro, le business key e i campi statistici vengono spesso scansionati, filtrati, aggregati o utilizzati per la pianificazione delle query. Questi campi beneficiano della compressione, della riduzione delle colonne e della compatibilità con l'ecosistema. Parquet è adatto a queste colonne.</li>
<li>I vettori densi, i vettori radi e le caratteristiche rerank sono spesso letti dopo il richiamo di RNA per ID riga. Hanno bisogno di un accesso casuale a bassa latenza, di una lettura precisa dell'intervallo di byte e di una decodifica selettiva. Un layout orientato ai segmenti è più adatto. Loon utilizza Vortex in questa direzione.</li>
<li>Gli oggetti grezzi come video, PDF, immagini e file audio non devono essere incorporati nei file di dati del database vettoriale. Devono rimanere nella memoria degli oggetti. Il database registra riferimenti, checksum, tipi MIME, versioni del parser e relazioni a livello di riga.</li>
</ul>
<p>Per l'esempio del video, un layout fisico potrebbe apparire come questo:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Per l'applicazione, si tratta ancora di una raccolta. Per il livello di archiviazione, le diverse parti di tale raccolta utilizzano formati fisici diversi. Questo riduce direttamente le riscritture non necessarie. L'aggiunta di <code translate="no">embedding_v2</code> può diventare un nuovo vettore ColumnGroup più un commit di Manifest. Non richiede la riscrittura della colonna caption, dei metadati scalari o della colonna embedding esistente.</p>
<p>La stessa idea si applica ai vettori sparsi, alle caratteristiche rerank o ad altri campi derivati. Se una nuova colonna può essere fisicamente indipendente e allineata in base all'ID della riga, non deve trascinare colonne non correlate nello stesso percorso di riscrittura.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon adatta anche l'uso dei formati di file.</h3><p><strong>Per Parquet, le impostazioni predefinite non sono sempre ideali per i dati vettoriali.</strong> Un gruppo di righe da 64 MB può essere troppo grande per la ricerca di punti, perché una piccola lettura casuale può estrarre molti più dati del necessario. Loon restringe i gruppi di righe a 1 MB nei percorsi rilevanti e disabilita le codifiche, come la codifica a dizionario sulle colonne dei vettori, quando non aiutano i dati vettoriali dall'aspetto casuale.</p>
<p><strong>Per Vortex, il lavoro più importante è il layout.</strong> Loon utilizza un layout che bilancia l'efficienza della scansione e la ricerca dei punti. All'interno di un gruppo di righe, i segmenti di colonne correlate possono essere posizionati vicini per supportare la scansione. Per eseguire le operazioni, la lettura dei sotto-segmenti consente al sistema di recuperare solo i byte rilevanti, anziché estrarre un intero segmento.</p>
<p><strong>Loon supporta anche l'integrazione con Lance in sola lettura</strong>, per cui i dataset Lance esistenti possono essere montati come gruppi di colonne quando la compatibilità è importante.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Cosa mostra il benchmark</h3><p>In un test locale, utilizzando un singolo file con 40.000 righe e lo schema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex ha ottenuto questi risultati rispetto a Parquet con gruppi di righe da 1 MB:</p>
<table>
<thead>
<tr><th>Operazione</th><th>Vortex</th><th>Parquet</th><th>Differenza</th></tr>
</thead>
<tbody>
<tr><td>Take, K=1000 righe casuali</td><td>5,8 ms</td><td>144 ms</td><td>25 volte più veloce</td></tr>
<tr><td>Scansione vettoriale completa delle colonne</td><td>21 ms</td><td>142 ms</td><td>6,76x più veloce</td></tr>
<tr><td>Dimensioni del file, ~21 MB di dati grezzi</td><td>6,62 MB</td><td>7,16 MB</td><td>7% più piccolo</td></tr>
</tbody>
</table>
<p>Il risultato di <code translate="no">take</code> deriva dalla riduzione della quantità di dati irrilevanti che devono essere letti e decodificati. Il risultato della scansione deriva dalle scelte di compressione e di implementazione.</p>
<p>Questi numeri dovrebbero rimanere legati alla loro configurazione: 8 vCPU Ubuntu 22.04 KVM, filesystem locale, un file, 40.000 righe, gruppi di righe da 1 MB e lo schema di cui sopra. Sullo storage a oggetti, l'I/O di rete può dominare, quindi la riduzione dell'amplificazione in lettura può essere ancora più importante. I risultati effettivi dipendono dalla forma del set di dati, dal comportamento dello storage a oggetti, dallo stato della cache e dal modello di query.</p>
<p>Il punto più generale non è che ogni colonna dovrebbe usare Vortex.</p>
<p>Il punto è che i set di dati vettoriali necessitano di una scelta del formato di file a livello di gruppo di colonne.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Progetto 2: allineare i file fisici tramite gli ID di riga<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati di file ibridi risolvono un problema: le diverse colonne possono ora vivere nei formati più adatti a loro.</p>
<p>Ma questo crea un secondo problema. Se i campi scalari vivono in Parquet, i vettori in Vortex e gli oggetti grezzi in Object Storage, come fa il sistema a trattarli come un'unica collezione?</p>
<p><strong>Loon risolve questo problema con l'allineamento dell'ID di riga.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">L'ID riga è il sistema di coordinate del livello di memorizzazione</h3><p>Ogni ColumnGroupFile fisico registra il percorso del file e l'intervallo di ID riga che copre:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>ColumnGroup diversi possono coprire lo stesso spazio ID riga anche se si trovano in file e formati diversi.</p>
<p>Per l'ID riga <code translate="no">12345</code>, i metadati scalari possono trovarsi in un ColumnGroup Parquet, l'embedding in un ColumnGroup Vortex e il video grezzo può essere rappresentato da un riferimento di memorizzazione di oggetti. Logicamente, si tratta sempre di un'unica riga. In questo modo il livello di memorizzazione ha un sistema di coordinate stabile.</p>
<p>L'ID riga non è la chiave primaria dell'azienda. È il sistema di coordinate del livello di archiviazione che consente a Loon di dividere fisicamente una raccolta senza perdere la capacità di ricostruirla logicamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Le nuove colonne non devono riscrivere le vecchie colonne</h3><p>L'aggiunta di <code translate="no">embedding_v2</code> non richiede la riscrittura della didascalia, dei metadati o dei gruppi di colonne <code translate="no">embedding_v1</code> originali. Loon può scrivere un nuovo ColumnGroup vettoriale, registrare l'intervallo di ID di riga che copre e fare il commit di questa modifica attraverso il Manifest.</p>
<p>Lo stesso vale per i vettori sparsi, le caratteristiche rerank o altri campi derivati che arrivano in seguito.</p>
<p>Finché il nuovo ColumnGroup copre il giusto intervallo di ID riga, può unirsi alla stessa collezione logica senza forzare lo spostamento di dati non correlati.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Le cancellazioni e la compattazione possono essere più mirate</h3><p>L'allineamento dell'ID riga è utile anche per le cancellazioni.</p>
<p>Una cancellazione può essere espressa prima attraverso un registro di cancellazione. La riga diventa invisibile a livello logico, mentre la pulizia fisica viene rimandata fino alla compattazione. Quando la compattazione viene eseguita, non è sempre necessario riscrivere tutti i gruppi di colonne legati alle righe interessate. Può concentrarsi sui gruppi di colonne che necessitano di una pulizia.</p>
<p>Questo è importante perché non tutte le colonne hanno lo stesso profilo di costo. Riscrivere un breve gruppo di colonne scalare è molto diverso dal riscrivere centinaia di gigabyte di vettori densi.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">La ricerca ibrida può recuperare solo le colonne di cui ha bisogno</h3><p>L'allineamento dell'ID di riga è anche ciò che rende la ricerca ibrida pratica su formati di file ibridi.</p>
<p>Dopo che la ricerca ANN restituisce gli ID di riga candidati, il sistema può recuperare solo i campi necessari per il risultato finale: didascalie, metadati, vettori, caratteristiche di rerank o riferimenti agli oggetti.</p>
<p>Ad esempio, una query può richiedere:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Questi campi possono trovarsi in diversi gruppi di colonne. Loon può individuare i file pertinenti in base all'intervallo di ID riga, leggere gli intervalli di byte necessari e assemblare il risultato.</p>
<p>Senza l'allineamento dell'ID riga, i formati ibridi sarebbero solo file separati affiancati. Con l'allineamento dell'ID riga, si comportano come un'unica raccolta logica.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader nasconde la suddivisione al livello superiore</h3><p>Il componente di runtime che rende tutto ciò utilizzabile è il Packed Reader.</p>
<p>Il livello superiore vede un flusso unificato Arrow RecordBatch. Al di sotto, i dati possono provenire da più gruppi di colonne in diversi formati di file. Il Packed Reader nasconde queste differenze, allinea i dati per intervalli di ID riga e pianifica l'I/O di più file con un utilizzo controllato della memoria.</p>
<p>Supporta anche <code translate="no">take</code> diretto per ID riga. Dato un insieme di ID riga, individua i ColumnGroupFiles pertinenti, esegue la lettura dell'intervallo e restituisce i campi richiesti.</p>
<p>Per il flusso di lavoro video, una query ANN può richiedere <code translate="no">caption</code>, <code translate="no">embedding</code> e <code translate="no">video_uri</code>. Il Packed Reader può recuperare il ColumnGroup scalare e il ColumnGroup vettoriale senza toccare colonne non correlate.</p>
<p>Questa è la differenza tra "file separati" e "una tabella con più layout fisici".</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Progetto 3: fare del Manifest la fonte della verità<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati di file ibridi definiscono il modo in cui i dati sono fisicamente memorizzati. L'allineamento dell'ID riga determina il modo in cui i gruppi di colonne separati formano ancora un'unica tabella logica. Ma il sistema deve ancora rispondere a una domanda più grande: <strong>quali file, registri, statistiche, indici e riferimenti a oggetti appartengono alla versione corrente del dataset? Questo è il compito del Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Le directory di archiviazione degli oggetti non sono sufficienti</h3><p>L'archiviazione degli oggetti non è un catalogo di database. Una directory può contenere vecchi file, nuovi file, risultati di lavori falliti, file temporanei, registri di cancellazione, file ancora referenziati da vecchie istantanee e file in attesa di pulizia. Il fatto che un file esista non significa che appartenga alla versione corrente del dataset.</p>
<p>Un set di dati Loon può essere organizzato in directory come:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Ma la struttura delle directory non è la fonte della verità. Lo è il Manifesto. I lettori non dovrebbero elencare le directory e dedurre lo stato da qualsiasi file esistente. Dovrebbero leggere il Manifesto corrente e seguire la vista versionata che dichiara.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Il Manifesto definisce una vista versionata dell'insieme di dati</h3><p>Il Manifesto definisce il set di dati in una determinata versione. Registra:</p>
<ul>
<li>quali gruppi di colonne esistono</li>
<li>quali intervalli di ID riga coprono</li>
<li>quale formato fisico utilizza ciascun gruppo di colonne</li>
<li>dove risiedono i file</li>
<li>quali registri di cancellazione sono attivi</li>
<li>quali statistiche sono disponibili</li>
<li>quali indici esistono</li>
<li>a quali blob esterni si fa riferimento</li>
<li>quali colonne e intervalli di righe coprono le statistiche o gli indici.</li>
</ul>
<p>Ogni aggiornamento scrive una nuova versione del Manifest. Un lettore che apre la versione N vede una visione stabile del set di dati alla versione N. Uno scrittore può preparare la versione N+1 senza disturbare i lettori che stanno ancora usando la versione N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Il Manifest non tiene traccia solo dei file di tabella</h3><p>In Loon, il corpo del Manifest è codificato con Apache Avro e organizzato in quattro sezioni principali.</p>
<ul>
<li>ColumnGroups descrive le colonne, i formati, i file e gli intervalli di ID delle righe.</li>
<li>DeltaLogs descrive le cancellazioni. I diversi tipi di cancellazione coprono diverse fonti di cambiamento, come le cancellazioni di chiavi primarie dai client, le cancellazioni posizionali dalla compattazione interna o le cancellazioni di uguaglianza dai motori esterni.</li>
<li>Le statistiche includono metadati di pianificazione come i filtri bloom, le statistiche BM25 e i valori min/max.</li>
<li>Gli indici descrivono il tipo di indice, i parametri, le colonne coperte e gli intervalli di ID riga. Possono includere indici vettoriali come HNSW o IVF, indici di testo, indici invertiti, indici bitmap e strutture correlate.</li>
</ul>
<p>È qui che Loon si differenzia da un manifesto tabellare tradizionale.</p>
<p>Un set di dati vettoriali deve tenere traccia non solo dei file di dati e delle partizioni. Deve anche tenere traccia degli indici vettoriali, degli indici di testo, delle caratteristiche sparse, dei registri di cancellazione, delle statistiche, dei riferimenti a oggetti esterni e degli intervalli di ID riga che li collegano.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Il Manifest deve essere scrivibile da più di un database</h3><p>La parte più importante non è solo ciò che contiene il Manifest. È chi può scriverlo.</p>
<ul>
<li>Se solo il database può scrivere il Manifest, esso rimane un metadato interno. Metadati più puliti, ma comunque privati di un motore.</li>
<li>Se i motori esterni possono generare nuovi ColumnGroup, statistiche e voci del Manifest, quest'ultimo diventa un'interfaccia di coordinamento.</li>
<li>Un lavoro Spark, per esempio, può riempire una colonna vettoriale sparsa. Scrive un nuovo ColumnGroup, registra la copertura delle righe e le statistiche e invia un nuovo Manifest. Le query online possono continuare a leggere la vecchia versione durante il lavoro. Quando il commit ha successo, la nuova versione diventa visibile.</li>
</ul>
<p>Lo spirito è simile a quello di Iceberg e Delta Lake, ma il modello degli oggetti è più ampio. Un set di dati vettoriali deve tenere traccia degli indici vettoriali, degli indici testuali, delle caratteristiche sparse, dei registri di cancellazione, delle statistiche, dei riferimenti ai blob e degli intervalli di ID delle righe, non solo dei file delle tabelle e delle partizioni.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">I commit ottimistici semplificano gli aggiornamenti di versione</h3><p>Ogni commit scrive una nuova versione del Manifest. Uno scrittore può creare nuovi contenuti basati sulla versione N, quindi tentare di scrivere <code translate="no">manifest-{N+1}.avro</code>. Le semantiche di scrittura condizionale dell'Object Storage o di corrispondenza generazionale possono far fallire il commit se la versione esiste già. Lo scrittore può quindi riprovare con la versione più recente.</p>
<p>In questo modo Loon offre una concorrenza ottimistica senza costringere ogni aggiornamento a un percorso di coordinamento pesante e fortemente coerente. Senza un manifesto, l'archiviazione multiformato e multimotore si trasforma in convenzioni di denominazione e riconciliazione manuale. Questo può funzionare per piccoli insiemi di dati. Non funziona per i dati vettoriali su scala TB.</p>
<p>Il Manifest è l'elemento che trasforma i file eterogenei in un set di dati che più sistemi possono leggere e aggiornare in modo sicuro.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Cosa cambia per gli utenti quando lo storage diventa versionato<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Per gli sviluppatori di applicazioni, Loon non dovrebbe diventare un nuovo onere per le API.</p>
<p>Gli utenti dovrebbero continuare a lavorare con i concetti familiari di Milvus: collezioni, inserimenti, ricerca e ricerca ibrida. Non dovranno pensare ai file Manifest, ai gruppi di colonne, agli intervalli di ID delle righe o al layout dei file durante il normale sviluppo delle applicazioni.</p>
<p>Il cambiamento è sotto gli occhi di tutti. L'archiviazione diventa più consapevole di come si evolvono effettivamente i set di dati AI.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">L'aggiunta di un nuovo incorporamento non deve spostare i vecchi dati</h3><p>In precedenza, l'aggiunta di <code translate="no">embedding_v2</code> a una raccolta esistente richiedeva spesso l'esportazione dei dati, l'addestramento di un nuovo modello, la generazione di vettori e quindi la reimportazione o l'aggiornamento della raccolta tramite l'SDK. Questo percorso comporta una grande quantità di lavoro operativo: tracciamento delle versioni, tentativi di lavoro falliti, ricostruzione degli indici, impatto del servizio e controlli di coerenza.</p>
<p><strong>Con Loon, questo può diventare un'evoluzione dello schema più un commit di un nuovo gruppo di colonne.</strong> La nuova colonna embedding può essere scritta come un proprio ColumnGroup fisico, allineato per ID riga e reso visibile attraverso il Manifest. La vecchia colonna caption, la colonna dei metadati scalari e la colonna di incorporamento originale non devono essere spostate.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">I backfill non dovrebbero richiedere un ciclo di aggiornamento lato client</h3><p>Molti aggiornamenti dei dati AI sono backfill. Un team può aggiungere vettori sparsi dopo che la ricerca ibrida diventa importante. Può aggiungere caratteristiche di rerank dopo l'addestramento di un nuovo modello. Può correggere le didascalie dopo la revisione umana. Può aggiungere tag di governance dopo un aggiornamento dei criteri.</p>
<p>In un layout tradizionale, queste modifiche avvengono spesso tramite aggiornamenti dell'SDK del client o percorsi di scrittura solo per il database, anche quando i dati sono prodotti da Spark, Ray o un altro motore esterno.</p>
<p>Con Loon, i sistemi di calcolo esterni possono produrre nuovi ColumnGroup e impegnarli attraverso il Manifest. Il database non deve più essere l'unico punto di ingresso per ogni riscrittura.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">L'analisi offline non deve richiedere un'altra copia della verità</h3><p>In precedenza, i team spesso scaricavano una raccolta online in Parquet per la valutazione o l'analisi offline. Questo crea due versioni dello stesso set di dati: la raccolta online e la copia di analisi. Una volta corrette le didascalie, rigenerate le incorporazioni, applicati i log di cancellazione o ricostruiti gli indici, il team deve chiedersi quale sia la copia corrente.</p>
<p>Con un modello di archiviazione basato su Manifest, i motori di analisi possono leggere la stessa vista versionata del dataset del sistema di distribuzione. Possono proiettare solo le colonne di cui hanno bisogno, scansionare solo gli intervalli di righe rilevanti e lavorare su una versione dichiarata del dataset invece che su un'istantanea esportata manualmente.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Le cancellazioni e le correzioni devono riguardare solo ciò che è stato modificato</h3><p>Le cancellazioni, le correzioni delle didascalie, le correzioni delle etichette e gli aggiornamenti della governance sono operazioni di routine nei dataset AI. Non dovrebbero costringere ogni colonna del vettore lungo a seguire lo stesso percorso di riscrittura.</p>
<p>Con Loon, la cancellazione dei registri può essere trattata prima come una cancellazione logica. La successiva compattazione può ripulire i gruppi di colonne interessati senza riscrivere i dati non correlati. Se un breve campo di testo cambia, il livello di archiviazione non deve riscrivere centinaia di gigabyte di vettori densi solo perché condividono la stessa riga logica.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">I motori esterni diventano parte del flusso di lavoro, non una via di fuga</h3><p>Il cambiamento più importante è che i motori esterni non vengono più trattati come sistemi esterni al database vettoriale.</p>
<p>Spark, Ray, i lavori di valutazione, i sistemi di etichettatura e le pipeline di governance producono e modificano già gran parte dei dati. Il livello di archiviazione dovrebbe consentire loro di collaborare attorno a un'unica fonte di verità, anziché esportare, copiare e reimportare continuamente.</p>
<p>Questo è ciò che rende possibile una versione di Manifest. Fornisce al servizio online, all'analisi offline, ai lavori di backfill e alla compattazione una visione condivisa del set di dati.</p>
<p>Questi possono sembrare dettagli di archiviazione interna, ma influenzano la velocità con cui i team possono iterare sui set di dati AI. Ogni modifica del modello, backfill delle funzionalità, correzione delle didascalie, filtro di qualità e ricostruzione dell'indice dipende dalla stessa domanda: &quot;<strong>Il sistema è in grado di aggiornare il dataset senza spostare i dati di cui non ha bisogno?&quot;.</strong></p>
<p>Questo è il valore pratico del modello di archiviazione.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon è disponibile in Milvus 3.0 beta e Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon è disponibile in <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 beta</a> e fa anche parte del livello di storage di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, la prossima evoluzione di Zilliz Cloud. Questa release si concentra su tre aree principali:</p>
<ul>
<li><strong>Il Manifesto.</strong> L'obiettivo è che le scritture, i backfill, le cancellazioni, le statistiche e gli aggiornamenti dell'indice producano visualizzazioni del dataset in versione che i lettori possano aprire in modo coerente. Per i lettori, ciò significa che una query può aprire una versione specifica del Manifest e vedere una vista stabile del dataset. Per gli autori, questo significa che i nuovi file di dati, i registri delle cancellazioni, le statistiche o i file degli indici possono essere preparati prima e poi resi visibili attraverso un commit con versione.</li>
<li><strong>Il gruppo di colonne e il supporto del formato.</strong> Parquet supporta colonne scalari ed ecosistemiche. Vortex supporta modelli di accesso vettoriali. Lance può essere integrato in modalità di sola lettura per la compatibilità con i set di dati Lance esistenti.</li>
<li><strong>L'indice su Lake.</strong> Gli indici scalari, gli indici di filtraggio e gli indici invertiti di testo possono partecipare alla pianificazione basata su Manifest per intervallo di righe. Gli indici vettoriali nativi di Lake sono più coinvolti. HNSW e IVF hanno un comportamento diverso sullo storage degli oggetti e HNSW in particolare è sensibile all'accesso casuale e alla localizzazione della cache. Non è possibile riutilizzare semplicemente un layout progettato per un SSD locale e aspettarsi lo stesso risultato.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">C'è ancora del lavoro da fare</h3><ul>
<li>I<strong>percorsi di scrittura esterni</strong> sono importanti perché Spark e Ray dovrebbero essere in grado di produrre ColumnGroups e Manifest commits senza forzare ogni backfill attraverso un ciclo SDK client.</li>
<li>L<strong>'interoperabilità di Lakehouse</strong> è importante perché molti team utilizzano già cataloghi e motori di interrogazione come <strong>Iceberg, Delta Lake, Trino, DuckDB e Athena.</strong> I dati vettoriali devono poter partecipare a questo ecosistema senza perdere le prestazioni della ricerca vettoriale.</li>
<li>Il<strong>layout degli indici</strong> è importante perché gli indici a grafo e le strutture invertite hanno schemi di accesso diversi sullo storage degli oggetti.</li>
<li><strong>La semantica degli oggetti di grandi dimensioni</strong> è importante perché i video, i PDF, le immagini e i file audio grezzi richiedono un comportamento di gestione dei riferimenti, di versionamento e di cancellazione che sia in linea con il set di dati vettoriale derivato.</li>
</ul>
<p>L'esatto comportamento di rilascio, le impostazioni predefinite e il percorso di migrazione dovrebbero seguire le <a href="https://docs.zilliz.com/docs/release-notes-2605">note di rilascio di</a> Milvus e <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a>. La direzione dello storage, tuttavia, è chiara: i database vettoriali hanno bisogno di una base versionata e nativa del lago sotto il livello di servizio.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Provate Loon sotto Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Se il vostro stack attuale separa il servizio online, l'analisi offline, i backfill e i flussi di lavoro esterni del data lake in sistemi diversi, vale la pena dare un'occhiata a Zilliz Vector Lakebase. Potete provarlo in <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Le nuove iscrizioni via e-mail ricevono 100 dollari di crediti gratuiti. Siete inoltre invitati a <a href="https://zilliz.com/contact-sales">parlarci</a> del vostro caso d'uso.</p>
<p>Potete anche seguire il <a href="https://milvus.io/docs/release_notes.md">rilascio di Milvus 3.0</a> per vedere come Loon si evolve nel motore open-source.</p>
<p><strong>Zilliz Vector Lakebase riunisce:</strong></p>
<ul>
<li>Servizio a livelli per diversi compromessi in termini di prestazioni e costi in tempo reale</li>
<li>Ricerca on-demand per carichi di lavoro su larga scala o esplorativi senza calcolo continuo</li>
<li>Ricerca esterna al data lake, in modo da poter indicizzare e ricercare direttamente sui dati del lake esistente</li>
<li>Ricerca a tutto campo su vettori, testo, JSON e dati geospaziali, con recupero ibrido e reranking</li>
<li>Storage unificato nativo del lago basato su Vortex, un formato aperto progettato per letture casuali più veloci e a basso costo su dati vettoriali.</li>
</ul>
