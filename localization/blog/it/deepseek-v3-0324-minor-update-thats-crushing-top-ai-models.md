---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: >-
  DeepSeek V3-0324: L'"aggiornamento minore" che sta distruggendo i migliori
  modelli di intelligenza artificiale
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 è addestrato con parametri più ampi, ha una finestra
  contestuale più lunga e capacità di ragionamento, codifica e matematica
  migliorate.
cover: >-
  assets.zilliz.com/Deep_Seek_V3_0324_The_Minor_Update_That_s_Crushing_Top_AI_Models_391585994c.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>Ieri sera DeepSeek ha lanciato una notizia bomba. La loro ultima versione,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, è stata minimizzata nell'annuncio ufficiale come un <strong>"aggiornamento minore"</strong> senza modifiche alle API. Ma i nostri test approfonditi presso <a href="https://zilliz.com/">Zilliz</a> hanno rivelato qualcosa di più significativo: questo aggiornamento rappresenta un salto quantico nelle prestazioni, in particolare nel ragionamento logico, nella programmazione e nella risoluzione di problemi matematici.</p>
<p>Non si tratta di un miglioramento incrementale, ma di un cambiamento fondamentale che posiziona DeepSeek v3-0324 nell'élite dei modelli linguistici. Ed è open source.</p>
<p><strong>Questa versione merita l'attenzione immediata degli sviluppatori e delle aziende che realizzano applicazioni basate sull'intelligenza artificiale.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">Cosa c'è di nuovo in DeepSeek v3-0324 e quanto è davvero valido?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 introduce tre importanti miglioramenti rispetto al suo predecessore, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Modello più grande, più potenza:</strong> il numero di parametri è passato da 671 miliardi a 685 miliardi, consentendo al modello di gestire ragionamenti più complessi e di generare risposte più articolate.</p></li>
<li><p><strong>Una finestra di contesto enorme:</strong> Con una lunghezza del contesto aggiornata a 128K token, DeepSeek v3-0324 è in grado di conservare ed elaborare un numero significativamente maggiore di informazioni in una singola query, rendendolo ideale per le conversazioni a lungo termine, l'analisi dei documenti e le applicazioni di intelligenza artificiale basate sul reperimento.</p></li>
<li><p><strong>Ragionamento, codifica e matematica migliorati:</strong> Questo aggiornamento offre un notevole incremento delle capacità logiche, di programmazione e matematiche, rendendolo un forte concorrente per la codifica assistita dall'intelligenza artificiale, la ricerca scientifica e la risoluzione di problemi di livello aziendale.</p></li>
</ul>
<p>Ma i numeri grezzi non raccontano l'intera storia. Ciò che è veramente impressionante è il modo in cui DeepSeek è riuscito a migliorare contemporaneamente la capacità di ragionamento e l'efficienza di generazione, cosa che di solito comporta compromessi ingegneristici.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">La salsa segreta: Innovazione architettonica</h3><p>Sotto il cofano, DeepSeek v3-0324 mantiene la sua architettura <a href="https://arxiv.org/abs/2502.07864">Multi-head Latent Attention (MLA) </a>, un meccanismo efficiente che comprime le cache Key-Value (KV) utilizzando vettori latenti per ridurre l'uso della memoria e l'overhead computazionale durante l'inferenza. Inoltre, sostituisce le tradizionali <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">reti Feed-Forward (FFN)</a> con strati Mixture of Experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>), ottimizzando l'efficienza di calcolo grazie all'attivazione dinamica degli esperti più performanti per ogni token.</p>
<p>Tuttavia, l'aggiornamento più interessante è la <strong>predizione multi-token (MTP),</strong> che consente a ogni token di prevedere simultaneamente più token futuri. In questo modo si supera un importante collo di bottiglia dei modelli autoregressivi tradizionali, migliorando sia l'accuratezza che la velocità di inferenza.</p>
<p>Insieme, queste innovazioni creano un modello che non si limita a scalare bene, ma scala in modo intelligente, portando le capacità di AI di livello professionale alla portata di un maggior numero di team di sviluppo.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Costruire un sistema RAG con Milvus e DeepSeek v3-0324 in 5 minuti<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Le potenti capacità di ragionamento di DeepSeek v3-0324 lo rendono un candidato ideale per i sistemi RAG (Retrieval-Augmented Generation). In questo tutorial vi mostreremo come costruire una pipeline RAG completa utilizzando DeepSeek v3-0324 e il database vettoriale <a href="https://zilliz.com/what-is-milvus">Milvus</a> in soli cinque minuti. Imparerete come recuperare e sintetizzare le conoscenze in modo efficiente con una configurazione minima.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Impostazione dell'ambiente</h3><p>Per prima cosa, installiamo le dipendenze necessarie:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> se si utilizza Google Colab, è necessario riavviare il runtime dopo aver installato questi pacchetti. Fare clic sul menu "Runtime" nella parte superiore dello schermo e selezionare "Riavvia sessione" dal menu a discesa.</p>
<p>Poiché DeepSeek fornisce un'API compatibile con OpenAI, è necessaria una chiave API. È possibile ottenerla iscrivendosi alla<a href="https://platform.deepseek.com/api_keys"> piattaforma DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Preparazione dei dati</h3><p>Per questa esercitazione utilizzeremo come fonte di conoscenza le pagine delle FAQ della <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Documentazione Milvus 2.4.x</a>:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Ora, carichiamo e prepariamo il contenuto delle FAQ dai file markdown:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Impostare il linguaggio e incorporare i modelli</h3><p>Utilizzeremo <a href="https://openrouter.ai/">OpenRouter</a> per accedere a DeepSeek v3-0324. OpenRouter fornisce un'API unificata per diversi modelli di intelligenza artificiale, come DeepSeek e Claude. Creando una chiave API gratuita per DeepSeek V3 su OpenRouter, è possibile provare facilmente DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Per le incorporazioni di testo, utilizzeremo il <a href="https://milvus.io/docs/embeddings.md">modello di incorporamento integrato</a> di Milvus, che è leggero ed efficace:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Creare una raccolta Milvus</h3><p>Ora impostiamo il nostro database vettoriale usando Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Suggerimento</strong>: Per diversi scenari di distribuzione, è possibile modificare la configurazione di Milvus:</p>
<ul>
<li><p>Per lo sviluppo locale: Usare <code translate="no">uri=&quot;./milvus.db&quot;</code> con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Per grandi insiemi di dati: Configurare un server Milvus tramite <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> e usare <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Per la produzione: Utilizzare<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> con il proprio endpoint cloud e la chiave API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Caricare i dati in Milvus</h3><p>Convertiamo i nostri dati testuali in embeddings e memorizziamoli in Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Costruire la pipeline RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Passo 1: Recuperare le informazioni rilevanti</h4><p>Testiamo il nostro sistema RAG con una domanda comune:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
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
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Fase 2: generare una risposta con DeepSeek</h4><p>Ora usiamo DeepSeek per generare una risposta basata sulle informazioni recuperate:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>Ed ecco fatto! Avete costruito con successo una pipeline RAG completa con DeepSeek v3-0324 e Milvus. Questo sistema è ora in grado di rispondere a domande basate sulla documentazione di Milvus con un'elevata precisione e consapevolezza del contesto.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Confronto tra DeepSeek-V3-0324: Versione originale e versione migliorata con RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>La teoria è una cosa, ma le prestazioni nel mondo reale sono quelle che contano. Abbiamo testato sia la versione standard di DeepSeek v3-0324 (con "Deep Thinking" disattivato) sia la nostra versione potenziata con RAG con lo stesso prompt: <em>Scrivi il codice HTML per creare un sito web di fantasia su Milvus.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Sito web costruito con il codice di output del Modello Standard</h3><p>Ecco come appare il sito web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pur essendo visivamente accattivante, il contenuto si basa molto su descrizioni generiche e manca di molte delle caratteristiche tecniche fondamentali di Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Sito web realizzato con il codice generato dalla versione potenziata di RAG</h3><p>Quando abbiamo integrato Milvus come base di conoscenza, i risultati sono stati radicalmente diversi:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il sito web di quest'ultimo non ha solo un aspetto migliore, ma dimostra una reale comprensione dell'architettura, dei casi d'uso e dei vantaggi tecnici di Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">DeepSeek v3-0324 può sostituire i modelli di ragionamento dedicati?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>La scoperta più sorprendente l'abbiamo fatta confrontando DeepSeek v3-0324 con modelli di ragionamento specializzati come Claude 3.7 Sonnet e GPT-4 Turbo in compiti di ragionamento matematico, logico e di codice.</p>
<p>I modelli di ragionamento dedicati eccellono nella risoluzione di problemi in più fasi, ma spesso lo fanno a scapito dell'efficienza. I nostri benchmark hanno dimostrato che i modelli di ragionamento spesso analizzano in modo eccessivo semplici richieste, generando un numero di token 2-3 volte superiore al necessario e aumentando in modo significativo la latenza e i costi delle API.</p>
<p>DeepSeek v3-0324 adotta un approccio diverso. Dimostra una coerenza logica paragonabile, ma con una concisione notevolmente maggiore: spesso produce soluzioni corrette con il 40-60% di token in meno. Questa efficienza non va a scapito dell'accuratezza; nei nostri test di generazione del codice, le soluzioni di DeepSeek hanno eguagliato o superato le funzionalità di quelle dei concorrenti incentrate sul ragionamento.</p>
<p>Per gli sviluppatori che vogliono bilanciare le prestazioni con i vincoli di budget, questo vantaggio in termini di efficienza si traduce direttamente in una riduzione dei costi delle API e in tempi di risposta più rapidi, fattori cruciali per le applicazioni di produzione in cui l'esperienza dell'utente dipende dalla velocità percepita.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">Il futuro dei modelli di intelligenza artificiale: Sfumare il divario di ragionamento<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>Le prestazioni di DeepSeek v3-0324 mettono in discussione un presupposto fondamentale dell'industria dell'IA: il ragionamento e l'efficienza rappresentano un compromesso inevitabile. Ciò suggerisce che forse ci stiamo avvicinando a un punto di inflessione in cui la distinzione tra modelli ragionanti e non ragionanti inizia a sfumare.</p>
<p>I principali fornitori di IA potrebbero eliminare del tutto questa distinzione, sviluppando modelli che regolano dinamicamente la loro profondità di ragionamento in base alla complessità del compito. Questo tipo di ragionamento adattivo ottimizzerebbe sia l'efficienza computazionale che la qualità delle risposte, rivoluzionando potenzialmente il modo in cui costruiamo e distribuiamo le applicazioni di IA.</p>
<p>Per gli sviluppatori che costruiscono sistemi RAG, questa evoluzione promette soluzioni più economiche che offrono la profondità di ragionamento dei modelli premium senza il loro sovraccarico computazionale, ampliando le possibilità dell'IA open-source.</p>
