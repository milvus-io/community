---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Introduzione alla funzione di incorporazione: Come Milvus 2.6 semplifica la
  vettorizzazione e la ricerca semantica
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Scoprite come Milvus 2.6 semplifica il processo di incorporazione e la ricerca
  vettoriale con Data-in, Data-out. Gestione automatica dell'incorporazione e
  del reranking, senza necessità di preelaborazione esterna.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Se avete mai costruito un'applicazione di ricerca vettoriale, conoscete già un po' troppo bene il flusso di lavoro. Prima che i dati possano essere memorizzati, devono essere trasformati in vettori utilizzando un modello di incorporamento, puliti e formattati e infine inseriti nel database vettoriale. Anche ogni query passa attraverso lo stesso processo: incorporare l'input, eseguire una ricerca di somiglianza, quindi mappare gli ID risultanti ai documenti o ai record originali. Funziona, ma crea un groviglio distribuito di script di preelaborazione, pipeline di incorporamento e codice collante da mantenere.</p>
<p><a href="https://milvus.io/">Milvus</a>, un database vettoriale open-source ad alte prestazioni, compie ora un importante passo avanti verso la semplificazione di tutto questo. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduce la <strong>funzione Data-in, Data-out (nota anche come</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Embedding Function</strong></a><strong>)</strong>, una funzionalità di embedding integrata che si collega direttamente ai principali fornitori di modelli come OpenAI, AWS Bedrock, Google Vertex AI e Hugging Face. Invece di gestire la vostra infrastruttura di incorporamento, Milvus può ora chiamare questi modelli per voi. È inoltre possibile inserire e interrogare il testo grezzo - e presto anche altri tipi di dati - mentre Milvus gestisce automaticamente la vettorizzazione in fase di scrittura e di interrogazione.</p>
<p>Nel resto del post, vedremo più da vicino come funziona Data-in, Data-out, come configurare i provider e le funzioni di incorporamento e come utilizzarli per ottimizzare i flussi di lavoro di ricerca vettoriale end-to-end.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">Che cos'è Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out in Milvus 2.6 si basa sul nuovo modulo Function, un framework che consente a Milvus di gestire la trasformazione dei dati e la generazione di incorporazioni internamente, senza servizi di preelaborazione esterni. (Con questo modulo, Milvus può prendere i dati di input grezzi, chiamare direttamente un fornitore di incorporazioni e scrivere automaticamente i vettori risultanti nella collezione.</p>
<p>Ad alto livello, il modulo <strong>Function</strong> trasforma la generazione di incorporazioni in una funzionalità nativa del database. Invece di eseguire pipeline di incorporamento separate, lavoratori in background o servizi di reranker, Milvus invia ora le richieste al provider configurato, recupera gli embedding e li memorizza insieme ai dati, il tutto all'interno del percorso di ingestione. In questo modo si elimina l'onere operativo di gestire la propria infrastruttura di incorporamento.</p>
<p>Data-in, Data-out introduce tre importanti miglioramenti al flusso di lavoro di Milvus:</p>
<ul>
<li><p><strong>Inserimento diretto di dati grezzi</strong> - È ora possibile inserire testi, immagini o altri tipi di dati non elaborati direttamente in Milvus. Non è necessario convertirli in vettori in anticipo.</p></li>
<li><p><strong>Configurazione di una funzione di incorporazione</strong> - Una volta configurato un modello di incorporazione in Milvus, questo gestisce automaticamente l'intero processo di incorporazione. Milvus si integra perfettamente con una serie di fornitori di modelli, tra cui OpenAI, AWS Bedrock, Google Vertex AI, Cohere e Hugging Face.</p></li>
<li><p><strong>Interrogazione con input grezzi</strong> - È ora possibile eseguire ricerche semantiche utilizzando testo grezzo o altre query basate sul contenuto. Milvus utilizza lo stesso modello configurato per generare embeddings al volo, eseguire ricerche di similarità e restituire risultati pertinenti.</p></li>
</ul>
<p>In breve, Milvus ora incorpora automaticamente i dati e, facoltativamente, li riorganizza. La vettorizzazione diventa una funzione integrata del database, eliminando la necessità di servizi di embedding esterni o di logiche di preelaborazione personalizzate.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Come funziona Data-in, Data-out<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Il diagramma seguente illustra il funzionamento di Data-in, Data-out all'interno di Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il flusso di lavoro Data-in, Data-out può essere suddiviso in sei fasi principali:</p>
<ol>
<li><p><strong>Dati in ingresso</strong> - L'utente inserisce i dati grezzi - come testo, immagini o altri tipi di contenuto - direttamente in Milvus senza eseguire alcuna pre-elaborazione esterna.</p></li>
<li><p><strong>Generare embeddings</strong> - Il modulo Function richiama automaticamente il modello di embedding configurato attraverso la sua API di terze parti, convertendo l'input grezzo in embeddings vettoriali in tempo reale.</p></li>
<li><p><strong>Memorizza gli embeddings</strong> - Milvus scrive gli embeddings generati nel campo vettoriale designato all'interno della collezione, dove diventano disponibili per le operazioni di ricerca per similarità.</p></li>
<li><p><strong>Invia una query</strong> - L'utente invia a Milvus una query di testo grezzo o basata sul contenuto, proprio come nella fase di input.</p></li>
<li><p><strong>Ricerca semantica</strong> - Milvus incorpora la query utilizzando lo stesso modello configurato, esegue una ricerca di similarità sui vettori memorizzati e determina le corrispondenze semantiche più vicine.</p></li>
<li><p><strong>Restituzione dei risultati</strong> - Milvus restituisce direttamente all'applicazione i risultati top-k più simili, mappati ai dati originali.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Come configurare Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><ul>
<li><p>Installare l'ultima versione di <strong>Milvus 2.6</strong>.</p></li>
<li><p>Preparare la chiave API di incorporamento da un provider supportato (ad esempio, OpenAI, AWS Bedrock o Cohere). In questo esempio, utilizzeremo <strong>Cohere</strong> come fornitore di embedding.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Modificare la configurazione di <code translate="no">milvus.yaml</code> </h3><p>Se si esegue Milvus con <strong>Docker Compose</strong>, è necessario modificare il file <code translate="no">milvus.yaml</code> per abilitare il modulo Function. Per una guida si può fare riferimento alla documentazione ufficiale: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configurazione di Milvus con Docker Compose</a> (qui si trovano anche le istruzioni per altri metodi di distribuzione).</p>
<p>Nel file di configurazione, individuare le sezioni <code translate="no">credential</code> e <code translate="no">function</code>.</p>
<p>Quindi, aggiornare i campi <code translate="no">apikey1.apikey</code> e <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Una volta apportate queste modifiche, riavviare Milvus per applicare la configurazione aggiornata.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Come utilizzare la funzione Data-in, Data-out<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Definire lo schema della raccolta</h3><p>Per abilitare la funzione di incorporamento, lo <strong>schema della raccolta</strong> deve includere almeno tre campi:</p>
<ul>
<li><p><strong>Campo chiave primaria (</strong><code translate="no">id</code> ) - Identifica in modo univoco ogni entità della raccolta.</p></li>
<li><p><strong>Campo scalare (</strong><code translate="no">document</code> ) - Memorizza i dati grezzi originali.</p></li>
<li><p><strong>Campo vettore (</strong><code translate="no">dense</code> ) - Memorizza le incorporazioni vettoriali generate.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Definire la funzione di incorporazione</h3><p>Definire quindi la <strong>funzione di incorporamento</strong> nello schema.</p>
<ul>
<li><p><code translate="no">name</code> - Un identificatore unico per la funzione.</p></li>
<li><p><code translate="no">function_type</code> - Impostare <code translate="no">FunctionType.TEXTEMBEDDING</code> per le incorporazioni di testo. Milvus supporta anche altri tipi di funzione, come <code translate="no">FunctionType.BM25</code> e <code translate="no">FunctionType.RERANK</code>. Per maggiori dettagli, si veda la sezione <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Ricerca di testi completi</a> e <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Panoramica del Decay Ranker</a>.</p></li>
<li><p><code translate="no">input_field_names</code> - Definisce il campo di ingresso per i dati grezzi (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Definisce il campo di uscita in cui saranno memorizzate le incorporazioni vettoriali (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Contiene i parametri di configurazione della funzione di embedding. I valori di <code translate="no">provider</code> e <code translate="no">model_name</code> devono corrispondere alle voci corrispondenti nel file di configurazione <code translate="no">milvus.yaml</code>.</p></li>
</ul>
<p><strong>Nota:</strong> Ogni funzione deve avere un unico <code translate="no">name</code> e <code translate="no">output_field_names</code> per distinguere le diverse logiche di trasformazione ed evitare conflitti.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Configurare l'indice</h3><p>Una volta definiti i campi e le funzioni, creare un indice per la collezione. Per semplicità, si utilizza il tipo AUTOINDEX come esempio.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Creare la raccolta</h3><p>Utilizzare lo schema e l'indice definiti per creare una nuova collezione. In questo esempio, creeremo una collezione chiamata Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Inserire i dati</h3><p>Ora è possibile inserire i dati grezzi direttamente in Milvus, senza dover generare embeddings manualmente.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Eseguire la ricerca vettoriale</h3><p>Dopo aver inserito i dati, è possibile eseguire ricerche direttamente con query di testo grezzo. Milvus converte automaticamente la query in un embedding, esegue una ricerca di somiglianza con i vettori memorizzati e restituisce le migliori corrispondenze.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Per maggiori dettagli sulla ricerca vettoriale, vedere: <a href="https://milvus.io/docs/single-vector-search.md">Ricerca vettoriale di base </a>e <a href="https://milvus.io/docs/get-and-scalar-query.md">Query API</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Iniziare con Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Data-in, Data-out, Milvus 2.6 porta la semplicità della ricerca vettoriale a un livello superiore. Integrando le funzioni di embedding e reranking direttamente all'interno di Milvus, non è più necessario gestire una preelaborazione esterna o mantenere servizi di embedding separati.</p>
<p>Pronti a provarlo? Installate oggi stesso <a href="https://milvus.io/docs">Milvus</a> 2.6 e sperimentate voi stessi la potenza di Data-in, Data-out.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Per saperne di più sulle caratteristiche di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale a prezzi accessibili su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove funzionalità Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un picchio per Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza uccidere il richiamo </a></p></li>
</ul>
