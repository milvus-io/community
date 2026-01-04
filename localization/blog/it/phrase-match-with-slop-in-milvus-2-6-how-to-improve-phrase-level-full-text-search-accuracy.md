---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Phrase Match con Slop in Milvus 2.6: come migliorare l'accuratezza della
  ricerca full-text a livello di frase
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Scoprite come Phrase Match in Milvus 2.6 supporta la ricerca full-text a
  livello di frase con slop, consentendo un filtraggio delle parole chiave più
  tollerante per la produzione reale.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>Mentre i dati non strutturati continuano a esplodere e i modelli di IA diventano sempre più intelligenti, la ricerca vettoriale è diventata il livello di reperimento predefinito per molti sistemi di IA - pipeline RAG, ricerca IA, agenti, motori di raccomandazione e altro ancora. Funziona perché cattura il significato: non solo le parole digitate dagli utenti, ma anche l'intento che le sottende.</p>
<p>Una volta che queste applicazioni entrano in produzione, tuttavia, i team spesso scoprono che la comprensione semantica è solo un aspetto del problema del reperimento. Molti carichi di lavoro dipendono anche da regole testuali rigorose, come la corrispondenza con la terminologia esatta, la conservazione dell'ordine delle parole o l'identificazione di frasi che hanno un significato tecnico, legale o operativo.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> elimina questa separazione introducendo la ricerca full-text nativa direttamente nel database vettoriale. Grazie agli indici di token e di posizione integrati nel motore principale, Milvus è in grado di interpretare l'intento semantico di una query, rispettando al contempo precisi vincoli a livello di parole chiave e frasi. Il risultato è una pipeline di reperimento unificata in cui il significato e la struttura si rafforzano a vicenda, anziché vivere in sistemi separati.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> è una parte fondamentale di questa funzionalità full-text. Identifica sequenze di termini che appaiono insieme e in ordine, fondamentale per individuare modelli di log, firme di errori, nomi di prodotti e qualsiasi testo in cui l'ordine delle parole definisce il significato. In questo post spiegheremo come funziona <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> in <a href="https://milvus.io/">Milvus</a>, come <code translate="no">slop</code> aggiunge la flessibilità necessaria per i testi del mondo reale e perché queste caratteristiche rendono la ricerca ibrida vettoriale e full-text non solo possibile ma anche pratica all'interno di un unico database.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">Che cos'è Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match è un tipo di query full-text in Milvus che si concentra sulla <em>struttura, in particolare</em>se una sequenza di parole appare nello stesso ordine all'interno di un documento. Quando non è consentita alcuna flessibilità, la query si comporta in modo rigido: i termini devono apparire uno accanto all'altro e in sequenza. Una query come <strong>"robotics machine learning"</strong> corrisponde quindi solo quando queste tre parole si presentano come una frase continua.</p>
<p>La sfida è che il testo reale raramente si comporta in modo così ordinato. Il linguaggio naturale introduce rumore: aggettivi aggiuntivi, i log riordinano i campi, i nomi dei prodotti acquistano modificatori e gli autori umani non scrivono pensando ai motori di ricerca. Una corrispondenza rigorosa di una frase si rompe facilmente: una parola inserita, una riformulazione o un termine scambiato possono causare un errore. E in molti sistemi di intelligenza artificiale, soprattutto quelli rivolti alla produzione, la mancanza di una riga di registro o di una frase che fa scattare una regola non è accettabile.</p>
<p>Milvus 2.6 risolve questo problema con un semplice meccanismo: lo <strong>slop</strong>. Lo slop definisce <em>la quantità di spazio consentito tra i</em> termini <em>della query</em>. Invece di trattare una frase come fragile e inflessibile, lo slop permette di decidere se una parola in più è tollerabile, o due, o anche se un leggero riordino deve essere considerato una corrispondenza. In questo modo, la ricerca per frase si trasforma da un test binario di accettazione-rifiuto in uno strumento di ricerca controllato e regolabile.</p>
<p>Per capire perché questo è importante, immaginate di cercare nei log tutte le varianti del noto errore di rete <strong>"connessione resettata dal peer".</strong> In pratica, i log potrebbero avere l'aspetto seguente:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>A prima vista, tutte queste varianti rappresentano lo stesso evento. Ma i comuni metodi di recupero fanno fatica:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 si scontra con la struttura.</h3><p>Considera la query come un insieme di parole chiave, ignorando l'ordine in cui appaiono. Finché "connessione" e "pari" compaiono da qualche parte, BM25 può classificare il documento in modo elevato, anche se la frase è invertita o non è correlata al concetto che si sta cercando.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">La ricerca vettoriale si scontra con i vincoli.</h3><p>Le incorporazioni eccellono nel catturare il significato e le relazioni semantiche, ma non possono imporre una regola come "queste parole devono apparire in questa sequenza". Potreste recuperare messaggi semanticamente correlati, ma non trovare l'esatto schema strutturale necessario per il debug o la conformità.</p>
<p>Phrase Match colma il divario tra questi due approcci. Utilizzando lo <strong>slop</strong>, è possibile specificare esattamente la variazione accettabile:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Corrispondenza esatta (tutti i termini devono apparire in ordine e in modo contiguo).</p></li>
<li><p><code translate="no">slop = 1</code> - Consenti una parola in più (Copre le varianti più comuni del linguaggio naturale con un solo termine inserito).</p></li>
<li><p><code translate="no">slop = 2</code> - Consenti più parole inserite (Gestisce frasi più descrittive o verbose).</p></li>
<li><p><code translate="no">slop = 3</code> - Consentire il riordino (Supporta frasi invertite o poco ordinate, spesso il caso più difficile nel testo reale).</p></li>
</ul>
<p>Invece di sperare che l'algoritmo di valutazione "faccia centro", si dichiara esplicitamente la tolleranza strutturale richiesta dall'applicazione.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Come funziona la corrispondenza delle frasi in Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Basato sulla libreria del motore di ricerca <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, Phrase Match in Milvus è implementato su un indice invertito con informazioni posizionali. Invece di limitarsi a controllare se i termini compaiono in un documento, verifica che compaiano nell'ordine giusto e a una distanza controllabile.</p>
<p>Il diagramma seguente illustra il processo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokenizzazione del documento (con posizioni)</strong></p>
<p>Quando i documenti vengono inseriti in Milvus, i campi di testo vengono elaborati da un <a href="https://milvus.io/docs/analyzer-overview.md">analizzatore</a>, che divide il testo in token (parole o termini) e registra la posizione di ciascun token all'interno del documento. Ad esempio, <code translate="no">doc_1</code> viene tokenizzato come: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Creazione dell'indice invertito</strong></p>
<p>Successivamente, Milvus costruisce un indice invertito. Invece di mappare i documenti al loro contenuto, l'indice invertito mappa ogni token ai documenti in cui appare, insieme a tutte le posizioni registrate di quel token all'interno di ciascun documento.</p>
<p><strong>3. Corrispondenza delle frasi</strong></p>
<p>Quando viene eseguita una query di frase, Milvus utilizza innanzitutto l'indice invertito per identificare i documenti che contengono tutti i token della query. Poi convalida ogni candidato confrontando le posizioni dei token per assicurarsi che i termini appaiano nell'ordine corretto ed entro la distanza consentita <code translate="no">slop</code>. Solo i documenti che soddisfano entrambe le condizioni vengono restituiti come corrispondenze.</p>
<p>Il diagramma seguente riassume il funzionamento di Phrase Match end-to-end.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Come attivare la corrispondenza per frase in Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match funziona su campi di tipo <strong><code translate="no">VARCHAR</code></strong>il tipo di stringa in Milvus. Per utilizzarla, è necessario configurare lo schema della raccolta in modo che Milvus esegua l'analisi del testo e memorizzi le informazioni posizionali per il campo. Questo si ottiene abilitando due parametri: <code translate="no">enable_analyzer</code> e <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Impostare enable_analyzer e enable_match</h3><p>Per attivare la corrispondenza delle frasi per un campo VARCHAR specifico, impostare entrambi i parametri su <code translate="no">True</code> quando si definisce lo schema del campo. Insieme, indicano a Milvus di:</p>
<ul>
<li><p><strong>tokenizzare</strong> il testo (tramite <code translate="no">enable_analyzer</code>) e</p></li>
<li><p><strong>costruire un indice inverso con offset posizionali</strong> (tramite <code translate="no">enable_match</code>).</p></li>
</ul>
<p>Phrase Match si basa su entrambi i passaggi: l'analizzatore scompone il testo in token e l'indice di corrispondenza memorizza la posizione di questi token, consentendo di effettuare query efficienti basate su frasi e slop.</p>
<p>Di seguito è riportato un esempio di configurazione dello schema che abilita Phrase Match su un campo <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Ricerca con Phrase Match: Come lo slop influisce sull'insieme dei candidati<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta abilitata la corrispondenza per un campo VARCHAR nello schema della raccolta, è possibile eseguire corrispondenze di frase usando l'espressione <code translate="no">PHRASE_MATCH</code>.</p>
<p>Nota: L'espressione <code translate="no">PHRASE_MATCH</code> non fa distinzione tra maiuscole e minuscole. Si può usare sia <code translate="no">PHRASE_MATCH</code> che <code translate="no">phrase_match</code>.</p>
<p>Nelle operazioni di ricerca, la corrispondenza di frase viene comunemente applicata prima della classificazione della somiglianza vettoriale. In primo luogo filtra i documenti in base a vincoli testuali espliciti, restringendo l'insieme dei candidati. I documenti rimanenti vengono quindi riclassificati utilizzando le incorporazioni vettoriali.</p>
<p>L'esempio seguente mostra come diversi valori di <code translate="no">slop</code> influenzino questo processo. Regolando il parametro <code translate="no">slop</code>, si controlla direttamente quali documenti superano il filtro frase e passano alla fase di classificazione vettoriale.</p>
<p>Si supponga di avere una raccolta denominata <code translate="no">tech_articles</code> contenente le seguenti cinque entità:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>testo</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>L'apprendimento automatico aumenta l'efficienza nell'analisi dei dati su larga scala</td></tr>
<tr><td>2</td><td>L'apprendimento di un approccio basato sulle macchine è fondamentale per il progresso dell'IA moderna</td></tr>
<tr><td>3</td><td>Le architetture delle macchine per l'apprendimento profondo ottimizzano i carichi computazionali</td></tr>
<tr><td>4</td><td>La macchina migliora rapidamente le prestazioni del modello per l'apprendimento continuo</td></tr>
<tr><td>5</td><td>L'apprendimento di algoritmi di macchine avanzate espande le capacità dell'IA.</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>In questo caso, si ammette uno slop di 1. Il filtro viene applicato ai documenti che contengono la frase "learning machine" con una leggera flessibilità.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Risultati della corrispondenza:</p>
<table>
<thead>
<tr><th>doc_id</th><th>testo</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>L'apprendimento di un approccio basato sulle macchine è fondamentale per i moderni progressi dell'IA</td></tr>
<tr><td>3</td><td>Le architetture delle macchine per l'apprendimento profondo ottimizzano i carichi computazionali</td></tr>
<tr><td>5</td><td>L'apprendimento di algoritmi automatici avanzati espande le capacità dell'IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>Questo esempio consente uno slop di 2, ovvero sono consentiti fino a due token extra (o termini invertiti) tra le parole "machine" e "learning".</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Risultati della corrispondenza:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>testo</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">L'apprendimento automatico aumenta l'efficienza nell'analisi dei dati su larga scala</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Le architetture delle macchine per l'apprendimento profondo ottimizzano i carichi computazionali</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>In questo esempio, uno slop di 3 offre una flessibilità ancora maggiore. Il filtro cerca "machine learning" con un massimo di tre posizioni di token tra le parole.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Risultati della corrispondenza:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>testo</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">L'apprendimento automatico aumenta l'efficienza nell'analisi dei dati su larga scala</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">L'apprendimento di un approccio basato sulle macchine è fondamentale per il progresso dell'IA moderna</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Le architetture delle macchine per l'apprendimento profondo ottimizzano i carichi computazionali</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">L'apprendimento di algoritmi automatici avanzati espande le capacità dell'IA</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Suggerimenti rapidi: Cosa bisogna sapere prima di abilitare Phrase Match in Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match supporta il filtraggio a livello di frase, ma la sua abilitazione non si limita alla configurazione della query. È utile conoscere le considerazioni associate prima di applicarla in un ambiente di produzione.</p>
<ul>
<li><p>L'abilitazione di Phrase Match su un campo crea un indice invertito, che aumenta l'utilizzo dello storage. Il costo esatto dipende da fattori quali la lunghezza del testo, il numero di token unici e la configurazione dell'analizzatore. Quando si lavora con campi di testo di grandi dimensioni o con dati ad alta cardinalità, questo costo aggiuntivo deve essere considerato in anticipo.</p></li>
<li><p>La configurazione dell'analizzatore è un'altra scelta critica del progetto. Una volta che un analizzatore è definito nello schema della raccolta, non può essere modificato. Per passare a un analizzatore diverso in un secondo momento è necessario eliminare la raccolta esistente e ricrearla con un nuovo schema. Per questo motivo, la scelta dell'analizzatore deve essere considerata una decisione a lungo termine piuttosto che un esperimento.</p></li>
<li><p>Il comportamento di Phrase Match è strettamente legato al modo in cui il testo viene tokenizzato. Prima di applicare un analizzatore a un'intera raccolta, si consiglia di usare il metodo <code translate="no">run_analyzer</code> per ispezionare il risultato della tokenizzazione e confermare che corrisponde alle aspettative. Questo passo può aiutare a evitare sottili discrepanze e risultati di query inaspettati. Per ulteriori informazioni, consultare la sezione <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Panoramica dell'analizzatore</a>.</p></li>
</ul>
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
    </button></h2><p>Phrase Match è un tipo di ricerca full-text di base che consente di applicare vincoli a livello di frase e di posizione oltre alla semplice corrispondenza delle parole chiave. Operando sull'ordine e sulla prossimità dei token, fornisce un modo prevedibile e preciso per filtrare i documenti in base a come i termini appaiono effettivamente nel testo.</p>
<p>Nei moderni sistemi di reperimento, la corrispondenza di frase viene comunemente applicata prima della classificazione basata su vettori. In primo luogo, limita l'insieme dei candidati ai documenti che soddisfano esplicitamente le frasi o le strutture richieste. La ricerca vettoriale viene quindi utilizzata per classificare questi risultati in base alla rilevanza semantica. Questo schema è particolarmente efficace in scenari come l'analisi dei log, la ricerca di documentazione tecnica e le pipeline RAG, dove è necessario applicare vincoli testuali prima di considerare la somiglianza semantica.</p>
<p>Con l'introduzione del parametro <code translate="no">slop</code> in Milvus 2.6, Phrase Match diventa più tollerante nei confronti delle variazioni del linguaggio naturale, pur mantenendo il suo ruolo di meccanismo di filtraggio full-text. Questo rende i vincoli a livello di frase più facili da applicare nei flussi di recupero di produzione.</p>
<p>Provatelo con gli script <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">dimostrativi</a> ed esplorate <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> per vedere come il reperimento consapevole delle frasi si inserisce nel vostro stack.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
