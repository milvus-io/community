---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: >-
  Come risolvere il loop di apprendimento dell'agente Hermes con la ricerca
  ibrida di Milvus 2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Il Loop di apprendimento dell'agente Hermes scrive le competenze dall'uso, ma
  il suo retriever FTS5 non trova le query riformulate. La ricerca ibrida di
  Milvus 2.6 risolve il richiamo tra le sessioni.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><strong>Ultimamente</strong><a href="https://github.com/NousResearch/hermes-agent"><strong>l'agente Hermes</strong></a> <strong>è stato ovunque.</strong> Costruito da Nous Research, Hermes è un agente di intelligenza artificiale personale in self-hosting che gira sull'hardware dell'utente (un VPS da 5 dollari va bene) e parla con l'utente attraverso i canali di chat esistenti, come Telegram.</p>
<p><strong>Il suo punto di forza è un ciclo di apprendimento integrato:</strong> il ciclo crea le Skill dall'esperienza, le migliora durante l'uso e cerca nelle conversazioni passate per trovare modelli riutilizzabili. Altri framework per agenti codificano a mano le abilità prima di distribuirle. Le competenze di Hermes crescono con l'uso e i flussi di lavoro ripetuti diventano riutilizzabili senza alcuna modifica del codice.</p>
<p><strong>Il problema è che Hermes recupera solo parole chiave.</strong> Corrisponde alle parole esatte, ma non al significato che gli utenti cercano. Quando gli utenti usano parole diverse in sessioni diverse, il ciclo non riesce a collegarle e non viene scritto nessun nuovo Skill. Quando ci sono solo poche centinaia di documenti, il divario è tollerabile. <strong>Oltre questo limite, il ciclo smette di imparare perché non riesce a trovare la propria storia.</strong></p>
<p><strong>Il rimedio è Milvus 2.6.</strong> La sua <a href="https://milvus.io/docs/multi-vector-search.md">ricerca ibrida</a> copre sia il significato che le parole chiave esatte in un'unica query, in modo che il ciclo possa finalmente collegare le informazioni riformulate nelle varie sessioni. È abbastanza leggero da stare su un piccolo server cloud (un VPS da 5 dollari al mese lo fa funzionare). Per sostituirlo non è necessario cambiare Hermes: Milvus si inserisce dietro il livello di recupero, quindi il ciclo di apprendimento rimane intatto. Hermes continua a scegliere quale abilità eseguire e Milvus si occupa di cosa recuperare.</p>
<p>Ma il vantaggio più profondo va al di là di un migliore richiamo: una volta che il recupero funziona, il Loop di apprendimento può memorizzare la strategia di recupero stessa come Abilità, non solo il contenuto che recupera. È così che il lavoro di conoscenza dell'agente si compone nelle varie sessioni.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Architettura dell'agente Hermes: Come la memoria a quattro livelli alimenta il ciclo di apprendimento delle abilità<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>ha quattro livelli di memoria, e L4 Skills è quello che lo distingue.</strong></p>
<ul>
<li><strong>L1</strong> - contesto della sessione, cancellato quando la sessione viene chiusa</li>
<li><strong>L2</strong> - fatti persistenti: stack del progetto, convenzioni del team, decisioni risolte</li>
<li><strong>L3</strong> - ricerca per parole chiave SQLite FTS5 su file locali</li>
<li><strong>L4</strong> - memorizza i flussi di lavoro come file Markdown. A differenza degli strumenti LangChain o dei plugin AutoGPT, che gli sviluppatori scrivono nel codice prima della distribuzione, le competenze L4 sono auto-scritte: si sviluppano a partire da ciò che l'agente esegue effettivamente, senza alcuno sviluppatore.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Perché il recupero delle parole chiave di Hermes FTS5 interrompe il ciclo di apprendimento<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes ha bisogno di recuperare le parole chiave per attivare i flussi di lavoro tra le sessioni.</strong> Ma il suo livello L3 integrato utilizza SQLite FTS5, che corrisponde solo ai token letterali, non al significato.</p>
<p><strong>Quando gli utenti formulano lo stesso intento in modo diverso nelle varie sessioni, FTS5 non trova la corrispondenza.</strong> Il ciclo di apprendimento non si attiva. Non viene scritto nessun nuovo Skill e la prossima volta che l'intento si ripresenta, l'utente torna a fare il routing a mano.</p>
<p>Esempio: la base di conoscenza contiene "asyncio event loop, async task scheduling, non-blocking I/O". Un utente cerca "Python concurrency". FTS5 restituisce zero risultati: nessuna sovrapposizione letterale di parole e FTS5 non ha modo di capire che si tratta della stessa domanda.</p>
<p>Al di sotto di un paio di centinaia di documenti, il divario è tollerabile. Oltre questo limite, la documentazione utilizza un vocabolario e gli utenti fanno domande in un altro, e FTS5 non ha modo di collegarli. <strong>I contenuti non recuperabili potrebbero anche non essere presenti nella base di conoscenza e il ciclo di apprendimento non ha nulla da cui imparare.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Come Milvus 2.6 risolve il gap di recupero con la ricerca ibrida e l'archiviazione a livelli<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 apporta due aggiornamenti che si adattano ai punti deboli di Hermes.</strong> <strong>La ricerca ibrida</strong> sblocca il Learning Loop coprendo sia il recupero semantico che quello delle parole chiave in un'unica chiamata. Lo <strong>storage a livelli</strong> mantiene l'intero backend di ricerca abbastanza piccolo da poter essere eseguito sullo stesso VPS da 5 dollari al mese per cui Hermes è stato costruito.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Cosa risolve la ricerca ibrida: Trovare informazioni rilevanti</h3><p>Milvus 2.6 supporta l'esecuzione sia del recupero vettoriale (semantico) che della <a href="https://milvus.io/docs/full-text-search.md">ricerca full-text BM25</a> (parole chiave) in una singola query, unendo poi i due elenchi classificati con la <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF)</a>.</p>
<p>Ad esempio, se si chiede &quot;qual è il principio di asyncio&quot;, il reperimento vettoriale restituisce contenuti semanticamente correlati. Se si chiede &quot;dove è definita la funzione <code translate="no">find_similar_task</code> &quot;, il BM25 corrisponde esattamente al nome della funzione nel codice. Per le domande che riguardano una funzione all'interno di un particolare tipo di task, la ricerca ibrida restituisce il risultato giusto in un'unica chiamata, senza logica di routing scritta a mano.</p>
<p>Per Hermes, questo è ciò che sblocca il Learning Loop. Quando una seconda sessione riformula l'intento, il recupero vettoriale individua la corrispondenza semantica mancata da FTS5. Il ciclo si attiva e viene scritta una nuova Skill.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Cosa risolve lo storage a livelli: Il costo</h3><p>Un database vettoriale ingenuo vorrebbe l'intero indice di incorporazione nella RAM, il che spinge le implementazioni personali verso infrastrutture più grandi e costose. Milvus 2.6 evita questo problema con uno storage a tre livelli, spostando le voci tra i livelli in base alla frequenza di accesso:</p>
<ul>
<li><strong>Caldo</strong> - in memoria</li>
<li><strong>Caldo</strong> - su SSD</li>
<li><strong>Freddo</strong> - su storage a oggetti</li>
</ul>
<p>Solo i dati caldi rimangono residenti. Una base di conoscenza di 500 documenti sta in 2 GB di RAM. L'intero stack di recupero viene eseguito sullo stesso VPS da 5 dollari al mese a cui Hermes si rivolge, senza bisogno di aggiornare l'infrastruttura.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: architettura di sistema<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes sceglie quali Skill eseguire. Milvus si occupa di cosa recuperare.</strong> I due sistemi rimangono separati e l'interfaccia di Hermes non cambia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Il flusso:</strong></p>
<ol>
<li>Hermes identifica l'intento dell'utente e lo indirizza a una Skill.</li>
<li>La Skill chiama uno script di recupero attraverso lo strumento terminale.</li>
<li>Lo script si rivolge a Milvus, esegue una ricerca ibrida e restituisce i pezzi classificati con i metadati della fonte.</li>
<li>Hermes compone la risposta. La memoria registra il flusso di lavoro.</li>
<li>Quando lo stesso schema si ripete nelle varie sessioni, il Learning Loop scrive una nuova Skill.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Come installare Hermes e Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Installare Hermes e</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, quindi creare una collezione con campi densi e BM25.</strong> Questa è la configurazione completa prima che il Learning Loop possa partire.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Installare Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Eseguire <code translate="no">hermes</code> per accedere alla procedura guidata interattiva:</p>
<ul>
<li><strong>Provider LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter ha dei modelli gratuiti).</li>
<li><strong>Canale</strong> - questa guida utilizza un bot FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Eseguire Milvus 2.6 Standalone</h3><p>Un singolo nodo standalone è sufficiente per un agente personale:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Creare la raccolta</h3><p>La progettazione di uno schema limita ciò che il recupero può fare. Questo schema esegue vettori densi e vettori radi BM25 fianco a fianco:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Script di ricerca ibrido</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>La richiesta densa allarga il pool di candidati di 2×, in modo che RRF abbia abbastanza da classificare.</strong> <code translate="no">text-embedding-3-small</code> è l'incorporamento OpenAI più economico che mantiene ancora la qualità di recupero; sostituirlo con <code translate="no">text-embedding-3-large</code> se il budget lo consente.</p>
<p>Con l'ambiente e la base di conoscenza pronti, la prossima sezione mette alla prova il Learning Loop.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">La generazione automatica di abilità di Hermes in pratica<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Due sessioni mostrano il Learning Loop in azione.</strong> Nella prima, l'utente nomina lo script a mano. Nella seconda, una nuova sessione pone la stessa domanda senza nominare lo script. Hermes riprende lo schema e scrive tre Abilità.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Sessione 1: Chiamare lo script a mano</h3><p>Aprite Hermes in Lark. Dategli il percorso dello script e l'obiettivo del recupero. Hermes richiama lo strumento terminale, esegue lo script e restituisce la risposta con l'attribuzione della fonte. <strong>Non esiste ancora un'abilità. Si tratta di una semplice chiamata allo strumento.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Sessione 2: chiedere senza nominare lo script</h3><p>Cancellare la conversazione. Ricominciare da capo. Fate la stessa categoria di domande senza nominare il copione o il percorso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">La memoria scrive per prima, l'abilità segue</h3><p><strong>Il Learning Loop registra il flusso di lavoro (script, argomenti, forma di ritorno) e restituisce la risposta.</strong> La memoria conserva la traccia; non esiste ancora un'abilità.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>La corrispondenza della seconda sessione indica al ciclo che vale la pena conservare lo schema.</strong> Quando si attiva, vengono scritte tre Abilità:</p>
<table>
<thead>
<tr><th>Abilità</th><th>Ruolo</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Eseguire una ricerca ibrida semantica e per parole chiave nella memoria e comporre la risposta.</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Verifica che i documenti siano stati inseriti nella base di conoscenza</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Esecuzione di comandi di shell: script, configurazione dell'ambiente, ispezione.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Da questo momento in poi, <strong>gli utenti smettono di nominare le competenze.</strong> Hermes deduce l'intento, si dirige verso l'abilità, estrae i pezzi rilevanti dalla memoria e scrive la risposta. Non c'è un selettore di abilità nel prompt.</p>
<p>La maggior parte dei sistemi RAG (retrieval-augmented generation) risolve il problema della memorizzazione e del reperimento, ma la logica di reperimento in sé è codificata nel codice dell'applicazione. Se si chiede in un modo diverso o in un nuovo scenario, il recupero si interrompe. Hermes memorizza la strategia di recupero come Skill, il che significa che <strong>il percorso di recupero diventa un documento che può essere letto, modificato e modificato.</strong> La riga <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> non è un marcatore di configurazione completata. Si tratta dell'<strong>Agente che memorizza un modello di comportamento a lungo termine.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes contro OpenClaw: Accumulazione vs. Orchestrazione<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes e OpenClaw rispondono a problemi diversi.</strong> Hermes è stato costruito per un singolo agente che accumula memoria e abilità attraverso le sessioni. OpenClaw è costruito per suddividere un compito complesso in parti e affidare ogni parte a un agente specializzato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il punto di forza di OpenClaw è l'orchestrazione. Ottimizza la quantità di compiti che vengono svolti automaticamente. Il punto di forza di Hermes è l'accumulo: un singolo agente che ricorda attraverso le sessioni, con competenze che crescono con l'uso. Hermes ottimizza il contesto a lungo termine e l'esperienza del dominio.</p>
<p><strong>I due framework sono sovrapponibili.</strong> Hermes offre un percorso di migrazione in un solo passaggio che porta la memoria e le competenze di <code translate="no">~/.openclaw</code> nei livelli di memoria di Hermes. Uno stack di orchestrazione può essere posizionato sopra, con un agente di accumulo sotto.</p>
<p>Per il lato OpenClaw della divisione, si veda <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente AI open source</a> sul blog di Milvus.</p>
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
    </button></h2><p>Il Learning Loop di Hermes trasforma i flussi di lavoro ripetuti in Skill riutilizzabili, ma solo se il recupero può collegarli tra le varie sessioni. La ricerca per parole chiave di FTS5 non può farlo. La <a href="https://milvus.io/docs/multi-vector-search.md"><strong>ricerca ibrida di Milvus 2.6</strong></a> può farlo: i vettori densi gestiscono i significati, BM25 gestisce le parole chiave esatte, RRF li fonde entrambi e lo <a href="https://milvus.io/docs/tiered-storage-overview.md">storage a livelli</a> mantiene l'intero stack su un VPS da 5 dollari al mese.</p>
<p>Il punto più importante è che, una volta che il recupero funziona, l'agente non si limita a memorizzare risposte migliori: memorizza strategie di recupero migliori come Skills. Il percorso di recupero diventa un documento versionabile che migliora con l'uso. Questo è ciò che separa un agente che accumula competenze nel dominio da uno che inizia da zero ogni sessione. Per un confronto di come altri agenti gestiscono (o non gestiscono) questo problema, si veda <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code's Memory System Explained.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Iniziare<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Provate gli strumenti di questo articolo:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent su GitHub</a> - script di installazione, impostazione del provider e configurazione del canale utilizzati in precedenza.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - distribuzione Docker a singolo nodo per il backend della knowledge-base.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus Hybrid Search Tutorial</a> - esempio completo di ricerca<a href="https://milvus.io/docs/multi-vector-search.md">ibrida</a> + BM25 + RRF che corrisponde allo script in questo post.</li>
</ul>
<p><strong>Avete domande sulla ricerca ibrida Hermes + Milvus?</strong></p>
<ul>
<li>Unitevi al <a href="https://discord.gg/milvus">Milvus Discord</a> per chiedere informazioni sulla ricerca ibrida, sullo storage a livelli o sui modelli di Skill-routing - altri sviluppatori stanno costruendo stack simili.</li>
<li><a href="https://milvus.io/community#office-hours">Prenotate una sessione di Milvus Office Hours</a> per analizzare la configurazione del vostro agente e della knowledge-base con il team di Milvus.</li>
</ul>
<p><strong>Volete evitare il self-host?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Iscriviti</a> o <a href="https://cloud.zilliz.com/login">accedi</a> a Zilliz Cloud - Milvus gestito con ricerca ibrida e storage a livelli. I nuovi account di posta elettronica di lavoro ricevono <strong> 100 dollari di crediti gratuiti</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Ulteriori letture<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Note di rilascio di Milvus 2.6</a>: archiviazione a livelli, ricerca ibrida, modifiche allo schema</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud e Milvus CLI + Competenze ufficiali</a> - strumenti operativi per gli agenti nativi di Milvus</li>
<li><a href="https://zilliz.com/blog">Perché la gestione della conoscenza in stile RAG si rompe per gli agenti</a> - il caso di una progettazione della memoria specifica per l'agente</li>
<li><a href="https://zilliz.com/blog">Il sistema di memoria di Claude Code è più primitivo di quanto ci si aspetterebbe</a> - confronto sullo stack di memoria di un altro agente</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Domande frequenti<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Come funziona il ciclo di apprendimento delle abilità dell'agente Hermes?</h3><p>Hermes registra ogni flusso di lavoro che esegue - lo script chiamato, gli argomenti passati e la forma restituita - come traccia di memoria. Quando lo stesso schema appare in due o più sessioni, il Learning Loop si attiva e scrive una Skill riutilizzabile: un file Markdown che cattura il flusso di lavoro come procedura ripetibile. Da quel momento in poi, Hermes si dirige verso l'abilità solo in base all'intento, senza che l'utente le dia un nome. La dipendenza critica è il recupero: il ciclo si attiva solo se riesce a trovare la traccia della sessione precedente, motivo per cui la ricerca per sola parola chiave diventa un collo di bottiglia in scala.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">Qual è la differenza tra la ricerca ibrida e la ricerca solo vettoriale per la memoria degli agenti?</h3><p>La ricerca solo vettoriale gestisce bene i significati, ma non trova le corrispondenze esatte. Se uno sviluppatore incolla una stringa di errore come ConnectionResetError o un nome di funzione come find_similar_task, una ricerca vettoriale pura potrebbe restituire risultati semanticamente correlati ma sbagliati. La ricerca ibrida combina vettori densi (semantici) con BM25 (parole chiave) e fonde i due set di risultati con Reciprocal Rank Fusion. Per la memoria degli agenti, dove le query vanno da un intento vago ("Python concurrency") a simboli esatti, la ricerca ibrida copre entrambe le estremità in un'unica chiamata senza logica di routing nel livello dell'applicazione.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Posso usare la ricerca ibrida di Milvus con agenti AI diversi da Hermes?</h3><p>Sì. Il modello di integrazione è generico: l'agente chiama uno script di ricerca, lo script interroga Milvus e i risultati vengono restituiti come pezzi classificati con i metadati di origine. Qualsiasi framework di agenti che supporti le chiamate a strumenti o l'esecuzione di shell può utilizzare lo stesso approccio. Hermes è particolarmente adatto perché il suo Learning Loop dipende specificamente dal reperimento di informazioni da una sessione all'altra, ma il lato Milvus è indipendente dagli agenti: non sa o non si preoccupa di quale agente lo stia chiamando.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Quanto costa al mese una configurazione self-hosted di Milvus + Hermes?</h3><p>Un singolo nodo Milvus 2.6 Standalone su un VPS a 2 core / 4 GB con storage a livelli costa circa 5 dollari al mese. OpenAI text-embedding-3-small costa 0,02 dollari per 1M di token - pochi centesimi al mese per una base di conoscenza personale. L'inferenza LLM domina il costo totale e scala con l'uso, non con lo stack di recupero.</p>
