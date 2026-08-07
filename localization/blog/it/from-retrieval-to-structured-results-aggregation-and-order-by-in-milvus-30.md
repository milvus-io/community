---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 'Dal recupero ai risultati strutturati: aggregazione e ORDER BY in Milvus 3.0'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Scopri come Milvus 3.0 aggiunge l’aggregazione delle query, la Search
  Aggregation e ORDER BY lato server per risultati di ricerca vettoriale
  strutturati ed efficienti.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Considera un flusso di ricerca prodotti familiare. Un acquirente carica la foto di un abito e la ricerca vettoriale recupera da un catalogo contenente decine di milioni di prodotti un insieme di candidati rilevanti.</p>
<p>La pagina, però, ha bisogno di più di un elenco ordinato. Ha bisogno di facet per marca. Ha bisogno di un ordinamento per prezzo. Il team di merchandising vuole sapere quali brand dominano questo insieme di risultati, l’intervallo di prezzo all’interno di ciascun brand e alcuni prodotti rappresentativi per ogni gruppo.</p>
<p>Prima di Milvus 3.0, le applicazioni gestivano comunemente da sole questo secondo passaggio: recuperavano righe da Milvus, le raggruppavano e ordinavano in pandas o in un livello di servizio, quindi assemblavano la risposta. Alcuni team mantenevano una pipeline di analytics separata solo per calcolare conteggi e distribuzioni su dati che erano già nel database vettoriale.</p>
<p>Il database vettoriale trovava i candidati; l’applicazione doveva trasformarli in un risultato strutturato.</p>
<p>Milvus 3.0 sposta una parte maggiore di questo lavoro nel motore di recupero. Aggiunge tre funzionalità correlate ma distinte:</p>
<ul>
<li><strong>Aggregazione delle query</strong> calcola <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code> sulle righe filtrate e visibili, con campi <code translate="no">GROUP BY</code> opzionali.</li>
<li><strong>Search Aggregation</strong> organizza i candidati di ricerca approximate nearest neighbor (ANN) mantenuti in bucket, calcola metriche per bucket, costruisce bucket annidati e restituisce hit rappresentative.</li>
<li><strong>Lato server</strong> <code translate="no">**ORDER BY**</code> ordina i risultati delle query o i candidati ANN in base a uno o più campi scalari prima che l’applicazione li riceva.</li>
</ul>
<p>La distinzione tra query e ricerca è importante:</p>
<table>
<thead>
<tr><th>Funzionalità</th><th>Dati riepilogati o ordinati</th><th>Forma principale del risultato</th><th>Confine di esattezza</th></tr>
</thead>
<tbody>
<tr><td>Aggregazione delle query</td><td>Tutte le righe visibili che corrispondono al filtro</td><td>Una riga per gruppo, con valori aggregati</td><td>Esatta sull’insieme di righe visibili della query</td></tr>
<tr><td>Search Aggregation</td><td>Candidati mantenuti dalla ricerca ANN e dalla fase di raggruppamento</td><td>Bucket, metriche, hit rappresentative e bucket figli opzionali</td><td>Approssimativa per progettazione</td></tr>
<tr><td>Query <code translate="no">ORDER BY</code></td><td>Righe visibili che corrispondono al filtro</td><td>Righe ordinate</td><td>Esatta sul risultato della query filtrata</td></tr>
<tr><td>Search <code translate="no">ORDER BY</code></td><td>Candidati ANN</td><td>Hit o gruppi di ricerca ordinati</td><td>Non espande il confine di recall ANN</td></tr>
</tbody>
</table>
<p>Questo articolo spiega perché queste operazioni appartengono al database, come funziona l’aggregazione distribuita, in che modo Search Aggregation differisce da Grouping Search e dove si fermano le nuove semantiche.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Perché il post-processing lato applicazione non regge<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Spostare aggregazione e ordinamento nell’applicazione può sembrare una piccola scelta implementativa. Su larga scala, crea tre problemi più grandi.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">L’applicazione sposta molti più dati di quanti ne contenga la risposta</h3><p>Supponiamo che una dashboard operativa abbia bisogno del conteggio dei prodotti e del prezzo medio per ogni categoria tra due milioni di righe di prodotti disponibili. Anche con un payload approssimativo di soli 100 byte per riga per categoria, prezzo, chiave primaria e overhead di serializzazione, l’applicazione deve ricevere circa 200 MB di dati prima di poter calcolare il risultato.</p>
<p>Se il catalogo ha 200 categorie, la risposta è composta solo da poche centinaia di chiavi e numeri, nell’ordine dei kilobyte. L’applicazione sposta diversi ordini di grandezza più dati di quanti ne restituisca, paga lo stesso costo a ogni aggiornamento e necessita di memoria client sufficiente per mantenere o trasmettere in streaming le righe intermedie.</p>
<p>Un’aggregazione nel motore cambia l’unità di movimento dei dati. Le righe grezze rimangono dove sono. Ciò che attraversa i nodi e alla fine esce da Milvus è l’insieme molto più piccolo degli stati di gruppo parziali e finali.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">L’ordinamento locale alla pagina non è un ordinamento globale</h3><p>Ordinare dopo la paginazione è un bug di correttezza, non semplicemente un’implementazione inefficiente.</p>
<p>Se un’applicazione recupera le righe dalla 11 alla 20 e ordina solo quelle righe per prezzo, ha prodotto l’ordine per prezzo all’interno di quella pagina, non le righe dalla 11 alla 20 del risultato ordinato globalmente per prezzo. Una pagina successiva può contenere prodotti più economici di ogni prodotto presente nella prima pagina.</p>
<p>Lo stesso confine è importante nella ricerca vettoriale. Recuperare un piccolo insieme Top-K e ordinarlo nell’applicazione può riordinare solo quei candidati. Non può recuperare candidati rilevanti che la fase ANN non ha restituito e spesso porta le applicazioni a effettuare over-fetch solo per rendere utile l’ordinamento lato client.</p>
<p>L’ordinamento lato server dà a Milvus il controllo sulla sequenza di ordinamento e paginazione. Per i carichi di lavoro di query, il motore ordina l’insieme di righe filtrato prima di applicare la finestra di pagina. Per i carichi di lavoro di ricerca, ordina entro il confine dei candidati ANN e mantiene esplicita tale limitazione.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">Il client non può riprodurre la visibilità del database</h3><p>L’aggregazione dipende anche da quali righe sono visibili al timestamp della query. Eliminazioni, entità scadute e scritture concorrenti sono governate dal controllo della concorrenza multiversione (MVCC) e dalle semantiche di consistenza di Milvus.</p>
<p>Una volta che le righe grezze lasciano il database, l’applicazione di solito presume che il batch ricevuto rappresenti lo snapshot corretto. Ricostruire le stesse regole di visibilità in un client è impraticabile, soprattutto mentre la collection riceve scritture ed eliminazioni.</p>
<p>La soluzione alternativa comune, un secondo motore di analytics alimentato da export ed ETL, aggiunge un’altra copia dei dati, un altro confine di consistenza e un’altra pipeline da gestire. Conteggi, metriche e ordinamento dovrebbero essere eseguiti dove esistono già sia i dati sia le relative regole di visibilità.</p>
<p>Ora diamo un’occhiata a ciò che offre Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Aggregazione delle query: statistiche esatte sulle righe visibili<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>L’aggregazione delle query risponde a domande come:</p>
<ul>
<li>Quanti prodotti disponibili ci sono in ciascuna categoria?</li>
<li>Qual è il prezzo medio per brand?</li>
<li>Quali sono i timestamp minimi e massimi degli eventi per ciascun host?</li>
<li>Quanti record rimangono dopo l’applicazione di un filtro e della visibilità TTL?</li>
</ul>
<p>L’API risulta familiare a chiunque abbia usato SQL: passa uno o più campi in <code translate="no">group_by_fields</code>, quindi inserisci le espressioni di aggregazione in <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>La sintassi è la parte semplice. Il modello di esecuzione è ciò che rende il risultato utile in un database vettoriale distribuito.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Gli stati locali ai segmenti sostituiscono il movimento delle righe grezze</h3><p>Una collection Milvus può estendersi su centinaia o migliaia di segmenti distribuiti su diversi query node, con i dati scritti di recente ancora nel percorso di streaming. Nessun singolo nodo di esecuzione parte con tutte le righe visibili.</p>
<p>Milvus quindi spinge l’aggregazione verso il basso, fino ai segmenti:</p>
<ol>
<li>Ogni segmento applica localmente il filtro e le regole di visibilità MVCC.</li>
<li>Il segmento emette uno stato parziale per gruppo invece delle righe corrispondenti.</li>
<li>Gli stati parziali vengono fusi all’interno di un query node.</li>
<li>Il proxy esegue la fusione finale tra nodi e restituisce i gruppi completati.</li>
</ol>
<p>La quantità di dati intermedi ora scala con il numero di gruppi e di stati aggregati, anziché direttamente con il numero di righe corrispondenti.</p>
<p>L’operazione di merge dipende dall’aggregato:</p>
<table>
<thead>
<tr><th>Aggregato</th><th>Stato parziale</th><th>Regola di merge</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Conteggio parziale</td><td>Somma i conteggi</td></tr>
<tr><td><code translate="no">sum</code></td><td>Somma parziale</td><td>Somma le somme</td></tr>
<tr><td><code translate="no">min</code></td><td>Minimo parziale</td><td>Prendi il minimo</td></tr>
<tr><td><code translate="no">max</code></td><td>Massimo parziale</td><td>Prendi il massimo</td></tr>
<tr><td><code translate="no">avg</code></td><td>Somma e conteggio parziali</td><td>Somma entrambi gli stati, quindi dividi una sola volta nella fase finale</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> è il caso istruttivo. Fare la media di due medie parziali è errato quando le partizioni contengono numeri diversi di righe. Milvus mantiene <code translate="no">sum</code> e <code translate="no">count</code> separatamente e calcola la media finale solo dopo che entrambi sono stati fusi globalmente.</p>
<p>Questo è uno dei motivi per cui l’aggregazione appartiene al database: l’operazione non è semplicemente “esegui la stessa funzione su diversi batch”. Il motore deve preservare l’algebra di ciascun aggregato attraverso i confini di segmenti e nodi.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">La visibilità viene applicata prima dell’aggregazione</h3><p>Le righe eliminate e scadute vengono rimosse dagli stati parziali a livello di segmento in base al confine di visibilità della query. Non viaggiano verso l’alto per poi essere corrette nell’applicazione.</p>
<p>Il risultato quindi descrive le righe che Milvus considera visibili per quella richiesta, non una raccolta arbitraria di batch estratti in momenti leggermente diversi.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> ora conta i gruppi</h3><p>In una query normale, <code translate="no">limit</code> controlla quante righe di entità vengono restituite. In una query raggruppata, controlla quanti gruppi vengono restituiti. Poiché la cardinalità del risultato è determinata dai gruppi anziché dalle righe corrispondenti, un’aggregazione di query può anche omettere <code translate="no">limit</code> quando ha bisogno di ogni gruppo.</p>
<p>Questo sembra un piccolo dettaglio dell’API, ma riflette un modello di risultato diverso: l’output non è più una pagina di entità. È una relazione le cui righe rappresentano gruppi.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: una vista a bucket dei candidati ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>L’aggregazione delle query risponde a: “Che aspetto hanno le righe visibili che corrispondono a questo filtro?” Search Aggregation pone una domanda diversa: “Che aspetto ha l’insieme di candidati recuperato per questo vettore?”</p>
<p>Questa operazione non ha un equivalente SQL esatto. La ricerca ANN stabilisce prima un confine di candidati guidato dalla similarità. Milvus quindi organizza i candidati mantenuti per chiavi scalari e restituisce un albero di bucket invece di un normale elenco piatto di hit.</p>
<p>Un bucket può contenere:</p>
<ul>
<li>una chiave come <code translate="no">brand</code> o una chiave composita come <code translate="no">(brand, color)</code>;</li>
<li>un conteggio dei candidati mantenuti;</li>
<li>metriche tra cui <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code>;</li>
<li>entità rappresentative selezionate con <code translate="no">top_hits</code>; e</li>
<li>una <code translate="no">sub_aggregation</code> annidata che crea bucket figli.</li>
</ul>
<p>Per la pagina di ricerca prodotti, una richiesta può restituire bucket di brand, il prezzo medio all’interno di ciascun bucket e tre prodotti rappresentativi per brand:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Quando <code translate="no">search_aggregation</code> è impostato, il normale elenco di hit è vuoto. L’applicazione legge la risposta dei bucket da <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">La specifica di aggregazione imposta due limiti diversi</h3><p>Search Aggregation non esegue <code translate="no">GROUP BY</code> su ogni entità della collection e non si limita a prendere una normale risposta Top-K e ad aggregare quell’elenco piatto.</p>
<p>La sua esecuzione ha tre fasi:</p>
<ol>
<li>Milvus esegue la ricerca ANN per recuperare candidati vicini al vettore della query.</li>
<li>La fase di raggruppamento mantiene un numero limitato di candidati per ciascuna chiave completa di bucket.</li>
<li>Milvus costruisce i bucket, calcola le metriche sui candidati mantenuti, ordina i bucket e collega hit rappresentative o bucket figli.</li>
</ol>
<p>Due parametri controllano parti diverse del risultato:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> limita quanti bucket vengono restituiti a quel livello di aggregazione.</li>
<li>Il valore più grande di <code translate="no">TopHits.size</code> ovunque nell’albero di aggregazione imposta il budget di candidati mantenuti per ciascuna chiave composita completa. Se la richiesta non contiene <code translate="no">top_hits</code>, il budget per chiave predefinito è uno.</li>
</ul>
<p>Il <code translate="no">limit</code> della ricerca di livello superiore non controlla questa modalità e viene ignorato quando è presente <code translate="no">search_aggregation</code>.</p>
<p>Questa distinzione è essenziale quando si legge il <code translate="no">count</code> o le metriche di un bucket. Con <code translate="no">TopHits(size=3)</code>, un bucket di brand può riepilogare al massimo tre candidati mantenuti per la sua chiave completa, anche se la collection contiene migliaia di prodotti rilevanti di quel brand. Aumentare <code translate="no">TopHits.size</code> amplia la finestra di metriche per chiave, ma non trasforma la ricerca ANN in una scansione esatta.</p>
<p>Se l’applicazione ha bisogno di statistiche esatte su ogni riga visibile che corrisponde a un filtro, dovrebbe usare l’aggregazione delle query. Search Aggregation serve a descrivere e confrontare i candidati prodotti dal recupero per similarità.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation e Grouping Search risolvono problemi diversi<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta Grouping Search (<code translate="no">group_by</code>) da Milvus 2.4. È facile vedere la parola “grouping” in entrambe le funzionalità e presumere che siano due interfacce per la stessa operazione. I loro contratti di output sono diversi.</p>
<p><strong>Grouping Search</strong> modifica quali entità compaiono in un elenco di risultati ordinato. Un pattern RAG comune memorizza i chunk come entità individuali, li raggruppa per <code translate="no">doc_id</code> e restituisce uno o pochi chunk da ciascun documento. L’output principale rimane costituito da normali hit di ricerca, ma con meno valori ripetuti dal campo di raggruppamento.</p>
<p><strong>Search Aggregation</strong> restituisce una vista statistica. L’output principale è un albero di bucket contenente chiavi, conteggi, metriche, hit rappresentative e bucket figli opzionali.</p>
<table>
<thead>
<tr><th>Esigenza dell’applicazione</th><th>Preferire</th><th>Consumare</th></tr>
</thead>
<tbody>
<tr><td>Un elenco di entità ordinato con maggiore diversità su un campo</td><td>Grouping Search</td><td>Hit di ricerca ordinarie</td></tr>
<tr><td>Conteggi di facet, metriche per gruppo, hit rappresentative o distribuzioni annidate</td><td>Search Aggregation</td><td>Oggetti <code translate="no">AggregationBucket</code> in <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Una regola pratica è partire dalla forma della risposta UI o API. Se l’applicazione renderizza un elenco, Grouping Search è di solito la primitiva giusta. Se renderizza facet, schede di distribuzione o una gerarchia di gruppi, usa Search Aggregation.</p>
<p>Le due modalità si escludono a vicenda in una richiesta perché definiscono forme di risultato principali diverse.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: spostare l’ordinamento prima del confine dell’applicazione<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>L’ordinamento è la funzionalità meno esotica di questa release e una delle più facili da implementare in modo errato fuori dal motore.</p>
<p>Milvus 3.0 espone l’ordinamento sia su query sia su search, ma i due percorsi usano parametri SDK diversi e operano su insiemi di input diversi.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">L’ordinamento delle query ordina l’insieme di righe filtrato</h3><p>La query PyMilvus usa <code translate="no">order_by</code>, espresso come elenco di stringhe <code translate="no">&quot;field:direction&quot;</code>. Il motore applica il filtro, ordina le righe visibili e quindi applica <code translate="no">limit</code> e <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Questo rende la query utile per la navigazione ordinata secondo criteri di business: record ingeriti più di recente, prodotti con il prezzo più alto all’interno di un filtro, inventario più basso o valori estremi per l’ispezione dei dati. Senza ordinamento lato server, le applicazioni dovevano prima recuperare le righe e non potevano definire un ordine di business affidabile tra le pagine.</p>
<p>Per i campi di query nullable, l’ordine crescente posiziona i null alla fine e l’ordine decrescente li posiziona all’inizio. Un campo di ordinamento non deve necessariamente comparire in <code translate="no">output_fields</code>; includilo solo quando l’applicazione ha bisogno del valore nella risposta.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">L’ordinamento della ricerca riordina l’insieme di candidati ANN</h3><p>La search PyMilvus usa <code translate="no">order_by_fields</code>, dove ogni voce indica un campo scalare e una direzione:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN determina ancora quali entità diventano candidati. <code translate="no">order_by_fields</code> cambia il modo in cui questi candidati vengono restituiti; non fa sì che la ricerca scansioni globalmente la collection per trovare i prodotti più economici.</p>
<p>Questo confine assegna ai due API compiti distinti:</p>
<ul>
<li>Usa query più <code translate="no">order_by</code> quando l’ordine scalare stesso definisce il risultato, ad esempio i dieci prodotti disponibili più economici.</li>
<li>Usa search più <code translate="no">order_by_fields</code> quando la rilevanza semantica o vettoriale definisce l’insieme di candidati e un campo scalare determina come questi candidati dovrebbero essere presentati.</li>
</ul>
<p>L’ordinamento multi-campo applica le chiavi nell’ordine dell’elenco. Quando i candidati di ricerca hanno gli stessi valori per ogni chiave scalare specificata, Milvus preserva il loro ordine originale basato sul punteggio di similarità.</p>
<p>L’ordinamento si compone anche con Grouping Search. Milvus ordina i gruppi in base al valore scalare configurato dell’entità principale di ciascun gruppo, mantenendo la forma del risultato raggruppato. Questo è utile quando l’applicazione vuole sia diversità su un campo sia un ordine dei gruppi rilevante per il business.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Cosa rendono possibili queste funzionalità<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>Le API sono primitive generali di database, ma diversi carichi di lavoro di recupero ne beneficiano immediatamente.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG e agenti: ispezionare la concentrazione del recupero</h3><p>Un sistema RAG o agentico può suddividere i chunk recuperati in bucket per documento sorgente, linea di prodotto, tenant o tipo di contenuto. Un risultato concentrato in due documenti porta un segnale di copertura diverso rispetto a uno distribuito su decine di fonti.</p>
<p>Questa distribuzione non è una garanzia di qualità della risposta. È però una diagnostica di recupero utile che un’applicazione o un agente può combinare con punteggi, citazioni e altri controlli quando decide se ampliare la query, recuperare di nuovo o chiedere chiarimenti.</p>
<p>Grouping Search rimane la scelta giusta quando l’obiettivo è semplicemente diversificare i chunk restituiti. Search Aggregation è utile quando il sistema ha bisogno della distribuzione stessa.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce e raccomandazione di contenuti: restituire facet con la ricerca</h3><p>La pagina di ricerca prodotti iniziale può ricevere da Milvus bucket di brand, metriche di prezzo, elementi rappresentativi e un elenco di candidati ordinato scalarmente. L’applicazione controlla ancora la presentazione e la logica di business, ma non deve più ricostruire le semantiche di base dei bucket da hit esportate.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Log e sicurezza: combinare la similarità con la distribuzione degli incidenti</h3><p>La ricerca per similarità può trovare eventi correlati a una riga di log sospetta. Search Aggregation può quindi mostrare quali host dominano quei candidati, il timestamp minimo e massimo in ciascun bucket di host o come i candidati si dividono per severità e servizio.</p>
<p>Il risultato rimane una vista dei candidati recuperati anziché un conteggio globale esatto degli incidenti. Quando l’indagine richiede conteggi esatti su ogni evento che corrisponde a un filtro, l’aggregazione delle query fornisce quel secondo percorso.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operazioni ed esplorazione dei dati: calcolare invece di esportare</h3><p>Dashboard e strumenti amministrativi possono eseguire conteggi e medie esatte su righe filtrate, quindi esplorare le entità sottostanti in un ordine scalare definito. Questo elimina molte utility una tantum di tipo “esporta, calcola e ordina”, senza fingere che Milvus sia diventato un database analitico completo.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Confini: cosa non sostituiscono aggregazione e <code translate="no">ORDER BY</code><button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Queste funzionalità estendono il motore di recupero; non trasformano Milvus in un sistema di online analytical processing (OLAP).</p>
<ul>
<li>L’aggregazione delle query supporta il raggruppamento più <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> e <code translate="no">max</code>. Non aggiunge join, funzioni finestra o sottoquery complesse. I grandi job analitici offline appartengono ancora a sistemi come Spark, che possono lavorare con snapshot di Milvus 3.0 e percorsi di storage condivisi.</li>
<li>Le chiavi di gruppo delle query supportano campi interi, <code translate="no">VARCHAR</code> e <code translate="no">TIMESTAMPTZ</code>. Le chiavi di bucket di Search Aggregation supportano inoltre campi booleani. Valori in virgola mobile, vettoriali, JSON e array non sono chiavi di bucket.</li>
<li>Per Search Aggregation, <code translate="no">count</code> accetta <code translate="no">&quot;*&quot;</code> o una sorgente non JSON e non dinamica; <code translate="no">sum</code> e <code translate="no">avg</code> richiedono sorgenti numeriche; e <code translate="no">min</code> e <code translate="no">max</code> supportano anche sorgenti stringa e <code translate="no">TIMESTAMPTZ</code>. L’aggregazione delle query segue gli stessi confini di tipo aritmetici. Consulta la guida API prima di applicare un aggregato a un tipo di campo complesso.</li>
<li>L’aggregazione delle query può ordinare l’output raggruppato per chiavi di gruppo, mentre l’ordinamento per un aggregato calcolato come <code translate="no">count(*)</code> rimane un confine attuale. Senza un ordine esplicito, l’ordine dei gruppi non è garantito.</li>
<li>Search Aggregation attualmente non può essere combinata con Hybrid Search, Grouping Search, Search Iterators, un offset non nullo o l’evidenziazione nella stessa richiesta.</li>
<li>I conteggi e le metriche di Search Aggregation descrivono i candidati ANN mantenuti, non la collection completa e non ogni entità che potrebbe essere semanticamente rilevante.</li>
<li>Search <code translate="no">ORDER BY</code> cambia la presentazione dei candidati. Non ripara i candidati ANN mancati né converte il recupero per similarità in una query Top-N scalare esatta.</li>
</ul>
<p>Il modo più pulito per scegliere tra le nuove primitive è partire dalla domanda:</p>
<ul>
<li>Per statistiche esatte su righe visibili filtrate, usa l’aggregazione delle query.</li>
<li>Per una distribuzione sui candidati di recupero per similarità, usa Search Aggregation.</li>
<li>Per un elenco ordinato diversificato, usa Grouping Search.</li>
<li>Per un ordine scalare definito, usa query o search <code translate="no">ORDER BY</code> in base al percorso che ha stabilito l’insieme di risultati.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">Dagli elenchi di candidati ai risultati strutturati<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>I database vettoriali hanno tradizionalmente ottimizzato una domanda: quali K entità sono più vicine a questo vettore?</strong></p>
<p>I sistemi di recupero in produzione pongono subito domande successive. Quali gruppi dominano il risultato? Quali sono i loro conteggi e intervalli? Quali esempi rappresentano ciascun gruppo? In quale ordine di business l’applicazione dovrebbe presentare le righe o i candidati?</p>
<p>Milvus 3.0 porta queste operazioni nello stesso motore che possiede i dati, il confine dei candidati ANN e le semantiche di visibilità. L’aggregazione delle query esegue una riduzione distribuita esatta sulle righe visibili. Search Aggregation costruisce una vista a bucket sui candidati ANN mantenuti. <code translate="no">ORDER BY</code> fornisce ai percorsi di query e search un ordine scalare lato server senza chiedere all’applicazione di ricostruirlo pagina per pagina.</p>
<p>Il risultato non è un motore OLAP nascosto dentro un database vettoriale. È un motore di recupero che può restituire una parte maggiore della struttura di cui le applicazioni hanno effettivamente bisogno.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Prova aggregazione e <code translate="no">ORDER BY</code> in Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 è ora disponibile. Usa la <a href="https://milvus.io/docs/get-and-scalar-query.md">guida Query</a> per l’aggregazione esatta e l’ordinamento delle query, la <a href="https://milvus.io/docs/search-aggregation.md">guida Search Aggregation</a> per semantiche e limiti dei bucket, la <a href="https://milvus.io/docs/single-vector-search.md">guida Basic Vector Search</a> per l’ordinamento della ricerca e la <a href="https://milvus.io/docs/grouping-search.md">guida Grouping Search</a> quando il tuo obiettivo principale è la diversità dei risultati.</p>
<p>Per la release più ampia, consulta il <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog di lancio di Milvus 3.0</a>, le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus 3.0</a> e il <a href="https://github.com/milvus-io/milvus">repository milvus-io/milvus</a>.</p>
<p>Se vuoi valutare le stesse API senza gestire il cluster autonomamente, provale su <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. Gli attuali <a href="https://docs.zilliz.com/reference/python/python/Vector-query">riferimento query di Zilliz Cloud</a> e <a href="https://docs.zilliz.com/reference/python/python/Vector-search">riferimento search</a> descrivono disponibilità e parametri per i tipi di cluster gestiti.</p>
<p>Per discutere un carico di lavoro o un caso limite con il team, unisciti alla <a href="https://discord.com/invite/8uyFbECzPX">community Discord di Milvus</a> o prenota una <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">sessione Milvus Office Hours</a>.</p>
