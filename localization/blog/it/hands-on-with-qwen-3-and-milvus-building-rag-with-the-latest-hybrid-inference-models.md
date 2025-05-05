---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Hands-on con Qwen 3 e Milvus: costruire RAG con i più recenti modelli di
  inferenza ibridi
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Condividere le principali funzionalità dei modelli Qwen 3 e guidarvi
  attraverso un processo di accoppiamento di Qwen 3 con Milvus per costruire un
  sistema locale di generazione aumentata del reperimento (RAG) consapevole dei
  costi.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In qualità di sviluppatore alla costante ricerca di strumenti pratici di intelligenza artificiale, non potevo ignorare il fermento che circondava l'ultima release di Alibaba Cloud: la famiglia di modelli<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>, una robusta serie di otto modelli di inferenza ibridi progettati per ridefinire l'equilibrio tra intelligenza ed efficienza. In sole 12 ore, il progetto ha ottenuto <strong>oltre 17.000 stelle su GitHub</strong> e ha raggiunto un picco di <strong>23.000 download</strong> all'ora su Hugging Face.</p>
<p>Cosa c'è di diverso questa volta? In breve, i modelli di Qwen 3 combinano sia il ragionamento (risposte lente e ponderate) che il non ragionamento (risposte veloci ed efficienti) in un'unica architettura, includono diverse opzioni di modello, migliorano la formazione e le prestazioni e offrono più funzionalità di livello aziendale.</p>
<p>In questo post riassumerò le principali funzionalità dei modelli Qwen 3 a cui dovreste prestare attenzione e vi guiderò attraverso un processo di accoppiamento di Qwen 3 con Milvus per costruire un sistema locale di generazione aumentata del reperimento (RAG) consapevole dei costi, con tanto di codice pratico e suggerimenti per ottimizzare le prestazioni rispetto alla latenza.</p>
<p>Entriamo nel vivo.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Cosa c'è di interessante in Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver testato e approfondito Qwen 3, è chiaro che non si tratta solo di numeri più grandi su una scheda tecnica. Si tratta di capire come le scelte progettuali del modello aiutino effettivamente gli sviluppatori a creare applicazioni GenAI migliori, più veloci, più intelligenti e con maggiore controllo. Ecco cosa spicca.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Modalità di pensiero ibride: Intelligente quando serve, veloce quando non serve</h3><p>Una delle caratteristiche più innovative di Qwen 3 è la sua <strong>architettura di inferenza ibrida</strong>. Essa consente di controllare con precisione la quantità di "pensiero" che il modello esegue per ogni singola attività. Dopotutto, non tutti i compiti necessitano di ragionamenti complicati.</p>
<ul>
<li><p>Per i problemi complessi che richiedono un'analisi approfondita, è possibile sfruttare tutta la potenza di ragionamento, anche se è più lenta.</p></li>
<li><p>Per le domande semplici di tutti i giorni, si può passare a una modalità più veloce e leggera.</p></li>
<li><p>È anche possibile impostare un <strong>"budget di pensiero</strong> ", limitando la quantità di calcolo o di token consumati in una sessione.</p></li>
</ul>
<p>Questa non è solo una funzione di laboratorio. Si rivolge direttamente al compromesso quotidiano degli sviluppatori: fornire risposte di alta qualità senza far lievitare i costi dell'infrastruttura o la latenza degli utenti.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Una linea versatile: Modelli MoE e densi per esigenze diverse</h3><p>Qwen 3 offre un'ampia gamma di modelli progettati per soddisfare diverse esigenze operative:</p>
<ul>
<li><p><strong>Due modelli MoE (Mixture of Experts)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 miliardi di parametri totali, 22 miliardi attivi per query</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 miliardi di parametri totali, 3 miliardi di parametri attivi.</p></li>
</ul></li>
<li><p><strong>Sei modelli densi</strong>: da 0,6B di parametri a 32B di parametri.</p></li>
</ul>
<p><em>Rapido background tecnologico: I modelli densi (come GPT-3 o BERT) attivano sempre tutti i parametri, il che li rende più pesanti ma a volte più prevedibili.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>I modelli MoE</em></a> <em>attivano solo una frazione della rete alla volta, rendendoli molto più efficienti in scala.</em></p>
<p>In pratica, questa versatile gamma di modelli consente di:</p>
<ul>
<li><p>utilizzare modelli densi per carichi di lavoro stretti e prevedibili (come i dispositivi embedded)</p></li>
<li><p>Usare i modelli MoE quando si ha bisogno di funzionalità pesanti senza dover pagare il conto del cloud.</p></li>
</ul>
<p>Grazie a questa gamma, è possibile personalizzare l'implementazione, da configurazioni leggere e pronte per l'edge a potenti implementazioni su scala cloud, senza essere vincolati a un singolo tipo di modello.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Concentrati sull'efficienza e sull'implementazione nel mondo reale</h3><p>Invece di concentrarsi esclusivamente sulla scalabilità delle dimensioni del modello, Qwen 3 si concentra sull'efficienza dell'addestramento e sulla praticità della distribuzione:</p>
<ul>
<li><p><strong>Addestrato su 36 trilioni di token</strong> - il doppio di quanto utilizzato da Qwen 2.5.</p></li>
<li><p><strong>Espansione a 235 miliardi di parametri</strong> - ma gestita in modo intelligente attraverso tecniche di MoE, bilanciando la capacità con le richieste di risorse.</p></li>
<li><p><strong>Ottimizzato per la distribuzione</strong>: la quantizzazione dinamica (da FP4 a INT8) consente di eseguire anche il modello Qwen 3 più grande su un'infrastruttura modesta, ad esempio su quattro GPU H20.</p></li>
</ul>
<p>L'obiettivo è chiaro: fornire prestazioni più elevate senza richiedere investimenti sproporzionati in infrastrutture.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Costruito per una reale integrazione: Supporto MCP e funzionalità multilingua</h3><p>Qwen 3 è stato progettato pensando all'integrazione, non solo alle prestazioni isolate dei modelli:</p>
<ul>
<li><p>La<strong>compatibilità con MCP (Model Context Protocol)</strong> consente una perfetta integrazione con database, API e strumenti esterni, riducendo i costi di progettazione per applicazioni complesse.</p></li>
<li><p><strong>Qwen-Agent</strong> migliora il richiamo degli strumenti e l'orchestrazione dei flussi di lavoro, supportando la creazione di sistemi di intelligenza artificiale più dinamici e fruibili.</p></li>
<li><p><strong>Il supporto multilingue per 119 lingue e dialetti</strong> rende Qwen 3 una scelta importante per le applicazioni destinate ai mercati globali e multilingue.</p></li>
</ul>
<p>L'insieme di queste caratteristiche rende più facile per gli sviluppatori costruire sistemi di livello produttivo senza dover ricorrere a un'ampia progettazione personalizzata del modello.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 ora supportato da DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> è un progetto open-source per il deep retrieval e la generazione di report, progettato come alternativa local-first a Deep Research di OpenAI. Aiuta gli sviluppatori a costruire sistemi che fanno emergere informazioni di alta qualità e consapevoli del contesto da fonti di dati private o specifiche del dominio.</p>
<p>DeepSearcher supporta ora l'architettura di inferenza ibrida di Qwen 3, che consente agli sviluppatori di alternare il ragionamento in modo dinamico, applicando l'inferenza più profonda solo quando aggiunge valore e saltandola quando la velocità è più importante.</p>
<p>DeepSearcher si integra con<a href="https://milvus.io"> Milvus</a>, un database vettoriale ad alte prestazioni sviluppato dagli ingegneri di Zilliz, per fornire una ricerca semantica veloce e accurata sui dati locali. La flessibilità del modello consente agli sviluppatori di avere un maggiore controllo sul comportamento del sistema, sui costi e sull'esperienza dell'utente.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Esercitazione pratica: Costruire un sistema RAG con Qwen 3 e Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Mettiamo in pratica i modelli Qwen 3 costruendo un sistema RAG con il database vettoriale Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Configurare l'ambiente.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nota: è necessario ottenere la chiave API da Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Preparazione dei dati</h3><p>Utilizzeremo le pagine di documentazione di Milvus come base di conoscenza principale.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Impostazione dei modelli</h3><p>Utilizzeremo l'API di DashScope compatibile con OpenAI per accedere a Qwen 3:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Generiamo un embedding di prova e stampiamone le dimensioni e i primi elementi:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Creare una collezione Milvus</h3><p>Configuriamo il nostro database vettoriale Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Informazioni sulle impostazioni dei parametri di MilvusClient:</p>
<ul>
<li><p>L'impostazione dell'URI a un file locale (ad esempio, <code translate="no">./milvus.db</code>) è il metodo più comodo, poiché utilizza automaticamente Milvus Lite per memorizzare tutti i dati in quel file.</p></li>
<li><p>Per i dati su larga scala, è possibile impostare un server Milvus più potente su Docker o Kubernetes. In questo caso, utilizzare l'URI del server (ad esempio, <code translate="no">http://localhost:19530</code>) come URI.</p></li>
<li><p>Se si desidera utilizzare <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(il servizio gestito di Milvus), regolare l'URI e il token, che corrispondono all'endpoint pubblico e alla chiave API di Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Aggiunta di documenti alla raccolta</h3><p>Ora creiamo gli embeddings per i nostri pezzi di testo e li aggiungiamo a Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Costruire il sistema di interrogazione RAG</h3><p>Ora la parte più interessante: configuriamo il nostro sistema RAG per rispondere alle domande.</p>
<p>Specifichiamo una domanda comune su Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cercare questa domanda nella raccolta e recuperare i primi 3 risultati semanticamente corrispondenti:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Vediamo i risultati della ricerca per questa domanda:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Usare l'LLM per costruire una risposta RAG</h3><p>Convertire i documenti recuperati in formato stringa:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornire un prompt di sistema e un prompt utente per il modello linguistico di grandi dimensioni:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Utilizzare l'ultimo modello Qwen per generare una risposta basata sul prompt:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Confronto tra modalità di ragionamento e non ragionamento: Un test pratico<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Ho eseguito un test per confrontare le due modalità di inferenza su un problema di matematica:</p>
<p><strong>Problema:</strong> Una persona A e una persona B iniziano a correre dallo stesso luogo. A parte per primo e corre per 2 ore a 5km/h. B lo segue a 15 km/h. Quanto tempo impiegherà B a raggiungerlo?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Con la modalità di ragionamento attivata:</strong></p>
<ul>
<li><p>Tempo di elaborazione: ~74,83 secondi</p></li>
<li><p>Analisi profonda, analisi del problema, percorsi di soluzione multipli</p></li>
<li><p>Output markdown di alta qualità con formule</p></li>
</ul>
<p>(L'immagine sottostante è uno screenshot della visualizzazione della risposta markdown del modello, per comodità del lettore)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modalità non ragionata:</strong></p>
<p>Nel codice, è sufficiente impostare <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Risultati della modalità non ragionata su questo problema:</p>
<ul>
<li>Tempo di elaborazione: ~74,83 secondi</li>
<li>Analisi approfondita, analisi del problema, percorsi di soluzione multipli</li>
<li>Output markdown di alta qualità con formule</li>
</ul>
<p>(L'immagine qui sotto è una schermata della visualizzazione della risposta markdown del modello, per comodità del lettore)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Qwen 3 introduce un'architettura di modelli flessibile che si allinea bene con le esigenze reali dello sviluppo GenAI. Con una gamma di modelli di diverse dimensioni (comprese le varianti dense e MoE), modalità di inferenza ibride, integrazione MCP e supporto multilingue, offre agli sviluppatori più opzioni per regolare le prestazioni, la latenza e i costi, a seconda del caso d'uso.</p>
<p>Piuttosto che enfatizzare la sola scala, Qwen 3 si concentra sull'adattabilità. Questo lo rende una scelta pratica per la creazione di pipeline RAG, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agenti AI</a> e applicazioni di produzione che richiedono sia capacità di ragionamento sia un funzionamento efficiente dal punto di vista dei costi.</p>
<p>Se abbinato a un'infrastruttura come<a href="https://milvus.io"> Milvus</a>, un database vettoriale open source ad alte prestazioni, le capacità di Qwen 3 diventano ancora più utili, consentendo una ricerca semantica veloce e un'integrazione agevole con i sistemi di dati locali. Insieme, offrono una solida base per applicazioni GenAI intelligenti e reattive su scala.</p>
