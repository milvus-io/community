---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >-
  Come utilizzare Milvus Boost Ranker per la ricerca vettoriale consapevole
  delle aziende
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Scoprite come Milvus Boost Ranker vi permette di sovrapporre le regole di
  business alla somiglianza vettoriale, per valorizzare i documenti ufficiali,
  declassare i contenuti obsoleti, aggiungere diversità.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>La ricerca vettoriale classifica i risultati in base alla similarità dell'embedding: più vicini sono i vettori, più alto è il risultato. Alcuni sistemi aggiungono un reranker basato su modelli (BGE, Voyage, Cohere) per migliorare l'ordinamento. Ma nessuno dei due approcci gestisce un requisito fondamentale nella produzione: il <strong>contesto aziendale conta quanto la rilevanza semantica, a volte di più.</strong></p>
<p>Un sito di e-commerce ha bisogno di far emergere prima i prodotti in stock dei negozi ufficiali. Una piattaforma di contenuti vuole individuare gli annunci recenti. Una base di conoscenza aziendale ha bisogno di documenti autorevoli in cima. Quando il ranking si basa esclusivamente sulla distanza vettoriale, queste regole vengono ignorate. I risultati possono essere rilevanti, ma non sono appropriati.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, introdotto in <a href="https://milvus.io/intro">Milvus</a> 2.6, risolve questo problema. Consente di regolare la classificazione dei risultati di ricerca utilizzando le regole dei metadati, senza ricostruire l'indice e senza modificare il modello. Questo articolo spiega come funziona, quando usarlo e come implementarlo con il codice.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Che cos'è Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker è una funzione di reranking leggera e basata su regole in Milvus 2.6.2</strong> che regola i risultati <a href="https://zilliz.com/learn/vector-similarity-search">di ricerca vettoriali</a> usando campi di metadati scalari. A differenza dei reranker basati su modelli che chiamano LLM esterni o servizi di embedding, Boost Ranker opera interamente all'interno di Milvus utilizzando semplici regole di filtro e peso. Nessuna dipendenza esterna, minimo overhead di latenza, adatto all'uso in tempo reale.</p>
<p>Si configura attraverso l'<a href="https://milvus.io/docs/manage-functions.md">API Function</a>. Dopo che la ricerca vettoriale restituisce un insieme di candidati, Boost Ranker applica tre operazioni:</p>
<ol>
<li><strong>Filtro:</strong> identifica i risultati che corrispondono a condizioni specifiche (ad esempio, <code translate="no">is_official == true</code>).</li>
<li><strong>Boost:</strong> moltiplica i loro punteggi per un peso configurato</li>
<li><strong>Shuffle:</strong> aggiunge facoltativamente un piccolo fattore casuale (0-1) per introdurre la diversità.</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Come funziona sotto il cofano</h3><p>Boost Ranker viene eseguito all'interno di Milvus come fase di post-elaborazione:</p>
<ol>
<li><strong>Ricerca vettoriale</strong>: ogni segmento restituisce i candidati con ID, punteggi di somiglianza e metadati.</li>
<li><strong>Applicazione di regole</strong> - il sistema filtra i record corrispondenti e regola i loro punteggi utilizzando il peso configurato e l'opzione <code translate="no">random_score</code>.</li>
<li><strong>Unire e ordinare</strong> - tutti i candidati sono combinati e riordinati in base ai punteggi aggiornati per produrre i risultati finali della Top-K.</li>
</ol>
<p>Poiché Boost Ranker opera solo sui candidati già recuperati e non sull'intero set di dati, il costo computazionale aggiuntivo è trascurabile.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Quando usare Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Incremento di risultati importanti</h3><p>Il caso d'uso più comune: sovrapporre semplici regole aziendali alla ricerca semantica.</p>
<ul>
<li><strong>E-commerce:</strong> potenziare i prodotti provenienti da flagship store, venditori ufficiali o promozioni a pagamento. Spingete in alto gli articoli con un alto tasso di vendite recenti o di click-through.</li>
<li><strong>Piattaforme di contenuti:</strong> dare priorità ai contenuti pubblicati di recente tramite un campo <code translate="no">publish_time</code>, oppure aumentare i post degli account verificati.</li>
<li><strong>Ricerca aziendale:</strong> dare maggiore priorità ai documenti in cui <code translate="no">doctype == &quot;policy&quot;</code> o <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Il tutto configurabile con un filtro e un peso. Nessuna modifica del modello di incorporamento, nessuna ricostruzione dell'indice.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Retrocessione senza rimozione</h3><p>Boost Ranker può anche abbassare il ranking di alcuni risultati - un'alternativa più soft al filtro duro.</p>
<ul>
<li><strong>Prodotti a basso stock:</strong> se <code translate="no">stock &lt; 10</code>, riduce leggermente il loro peso. Sono ancora reperibili, ma non dominano le prime posizioni.</li>
<li><strong>Contenuti sensibili:</strong> ridurre il peso dei contenuti segnalati invece di rimuoverli del tutto. Limita l'esposizione senza censurare in modo rigido.</li>
<li><strong>Documenti obsoleti:</strong> i documenti in cui <code translate="no">year &lt; 2020</code> vengono classificati più in basso, in modo da far emergere prima i contenuti più recenti.</li>
</ul>
<p>Gli utenti possono ancora trovare i risultati retrocessi scorrendo o effettuando una ricerca più precisa, ma non escludono i contenuti più rilevanti.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Aggiungere diversità con la casualità controllata</h3><p>Quando molti risultati hanno punteggi simili, la Top-K può apparire identica per tutte le query. Il parametro <code translate="no">random_score</code> di Boost Ranker introduce una leggera variazione:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: controlla la casualità complessiva per la riproducibilità</li>
<li><code translate="no">field</code>: di solito la chiave primaria <code translate="no">id</code>, assicura che lo stesso record riceva ogni volta lo stesso valore casuale.</li>
</ul>
<p>Questo è utile per <strong>diversificare le raccomandazioni</strong> (evitando che gli stessi elementi compaiano sempre per primi) e per l'<strong>esplorazione</strong> (combinando pesi aziendali fissi con piccole perturbazioni casuali).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Combinazione di Boost Ranker con altri classificatori</h3><p>Boost Ranker si imposta tramite l'API Function con <code translate="no">params.reranker = &quot;boost&quot;</code>. Due cose da sapere sulla sua combinazione:</p>
<ul>
<li><strong>Limitazione:</strong> nella ricerca ibrida (multivettore), Boost Ranker non può essere il ranker di primo livello. Ma può essere usato all'interno di ogni singolo <code translate="no">AnnSearchRequest</code> per regolare i risultati prima che vengano uniti.</li>
<li><strong>Combinazioni comuni:</strong><ul>
<li><strong>RRF + Boost:</strong> utilizzare RRF per unire i risultati multimodali, quindi applicare Boost per la messa a punto basata sui metadati.</li>
<li><strong>Model ranker + Boost:</strong> utilizzare un ranker basato su modelli per la qualità semantica, quindi Boost per le regole aziendali.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Come configurare Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker si configura attraverso l'API Function. Per una logica più complessa, è possibile combinarlo con <code translate="no">FunctionScore</code> per applicare più regole insieme.</p>
<h3 id="Required-Fields" class="common-anchor-header">Campi obbligatori</h3><p>Quando si crea un oggetto <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: qualsiasi nome personalizzato</li>
<li><code translate="no">input_field_names</code>: deve essere un elenco vuoto <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: impostato su <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>deve essere <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Parametri chiave</h3><p><strong><code translate="no">params.weight</code> (richiesto)</strong></p>
<p>Il moltiplicatore applicato ai punteggi dei record corrispondenti. La modalità di impostazione dipende dalla metrica:</p>
<table>
<thead>
<tr><th>Tipo di metrica</th><th>Per aumentare i risultati</th><th>Per degradare i risultati</th></tr>
</thead>
<tbody>
<tr><td>Più alto è meglio (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Inferiore è migliore (L2/Euclidea)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (opzionale)</strong></p>
<p>Una condizione che seleziona i record a cui vengono aggiustati i punteggi:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Sono interessati solo i record corrispondenti. Tutto il resto mantiene il suo punteggio originale.</p>
<p><strong><code translate="no">params.random_score</code> (opzionale)</strong></p>
<p>Aggiunge un valore casuale tra 0 e 1 per la diversità. Si veda la sezione sulla casualità per i dettagli.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Regole singole o multiple</h3><p><strong>Regola singola</strong> - quando si ha un solo vincolo aziendale (ad esempio, aumentare i documenti ufficiali), passare il classificatore direttamente a <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Regole multiple</strong> - quando si ha bisogno di diversi vincoli (dare priorità agli articoli in magazzino + declassare i prodotti a bassa valutazione + aggiungere casualità), si creano più oggetti <code translate="no">Function</code> e li si combina con <code translate="no">FunctionScore</code>. Si configura:</p>
<ul>
<li><code translate="no">boost_mode</code>: come ogni regola si combina con il punteggio originale (<code translate="no">multiply</code> o <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: come più regole si combinano tra loro (<code translate="no">multiply</code> o <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Operazione pratica: dare priorità ai documenti ufficiali<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Vediamo un esempio concreto: dare priorità ai documenti ufficiali in un sistema di ricerca di documenti.</p>
<h3 id="Schema" class="common-anchor-header">Schema</h3><p>Un insieme chiamato <code translate="no">milvus_collection</code> con questi campi:</p>
<table>
<thead>
<tr><th>Campo</th><th>Tipo</th><th>Scopo</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Chiave primaria</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Testo del documento</td></tr>
<tr><td><code translate="no">embedding</code></td><td>VETTORE_FLUIDO (3072)</td><td>Vettore semantico</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Origine: &quot;ufficiale&quot;, &quot;community&quot; o &quot;ticket&quot;.</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> se <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>I campi <code translate="no">source</code> e <code translate="no">is_official</code> sono i metadati che Boost Ranker utilizzerà per regolare le classifiche.</p>
<h3 id="Setup-Code" class="common-anchor-header">Codice di configurazione</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Confronto dei risultati: Con e senza Boost Ranker</h3><p>Per prima cosa, eseguire una ricerca di base senza Boost Ranker. Quindi aggiungere Boost Ranker con <code translate="no">filter: is_official == true</code> e <code translate="no">weight: 1.2</code> e confrontare.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">I risultati</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>Il cambiamento principale: il documento <code translate="no">id=2</code> (ufficiale) è passato dal 4° al 2° posto perché il suo punteggio è stato moltiplicato per 1,2. I post della comunità e i record dei ticket non sono stati rimossi, ma si sono classificati più in basso. Questo è lo scopo di Boost Ranker: mantenere la ricerca semantica come base, quindi sovrapporre le regole aziendali.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> offre un modo per iniettare la logica aziendale nei risultati della ricerca vettoriale senza toccare gli embeddings o ricostruire gli indici. Potenziate i contenuti ufficiali, declassate i risultati obsoleti, aggiungete una diversità controllata, il tutto attraverso una semplice configurazione di filtri e pesi nell'<a href="https://milvus.io/docs/manage-functions.md">API Milvus Function</a>.</p>
<p>Se state costruendo pipeline RAG, sistemi di raccomandazione o ricerche aziendali, Boost Ranker vi aiuta a colmare il divario tra ciò che è semanticamente simile e ciò che è effettivamente utile per i vostri utenti.</p>
<p>Se state lavorando al ranking di ricerca e volete discutere il vostro caso d'uso:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">comunità Slack di Milvus</a> per entrare in contatto con altri sviluppatori che costruiscono sistemi di ricerca e reperimento.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per analizzare la vostra logica di ranking con il team.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) ha un livello gratuito per iniziare.</li>
</ul>
<hr>
<p>Alcune domande che sorgono quando i team iniziano a usare Boost Ranker:</p>
<p><strong>Boost Ranker può sostituire un reranker basato su modelli come Cohere o BGE?</strong>Risolvono problemi diversi. I reranker basati su modelli assegnano un punteggio ai risultati in base alla qualità semantica: sono bravi a decidere "quale documento risponde effettivamente alla domanda". Boost Ranker regola i punteggi in base alle regole aziendali: decide "quale documento pertinente deve apparire per primo". In pratica, spesso si vogliono entrambe le cose: un ranker modello per la rilevanza semantica e Boost Ranker per la logica aziendale.</p>
<p><strong>Boost Ranker aggiunge una latenza significativa?</strong>No. Opera sul set di candidati già recuperati (in genere la Top-K dalla ricerca vettoriale), non sull'intero set di dati. Le operazioni sono semplici filtri e moltiplicazioni, quindi l'overhead è trascurabile rispetto alla ricerca vettoriale stessa.</p>
<p><strong>Come si imposta il valore del peso? Si</strong>inizia con piccoli aggiustamenti. Per la somiglianza COSINE (più alta è meglio), un peso di 1,1-1,3 è di solito sufficiente per modificare sensibilmente le classifiche, senza prevalere del tutto sulla rilevanza semantica. Testate con i vostri dati reali: se i risultati boostati con bassa similarità iniziano a dominare, abbassate il peso.</p>
<p><strong>Posso combinare più regole di Boost Ranker?</strong>Sì. Creare più oggetti <code translate="no">Function</code> e combinarli usando <code translate="no">FunctionScore</code>. È possibile controllare il modo in cui le regole interagiscono attraverso <code translate="no">boost_mode</code> (come ogni regola si combina con il punteggio originale) e <code translate="no">function_mode</code> (come le regole si combinano tra loro) - entrambi supportano <code translate="no">multiply</code> e <code translate="no">add</code>.</p>
