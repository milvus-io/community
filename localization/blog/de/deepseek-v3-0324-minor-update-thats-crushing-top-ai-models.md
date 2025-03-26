---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: 'DeepSeek V3-0324: Das "kleine Update", das die Top-KI-Modelle vernichtet'
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 wird mit größeren Parametern trainiert, hat ein längeres
  Kontextfenster und verbesserte Reasoning-, Kodierungs- und
  Mathematikfunktionen.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>DeepSeek hat gestern Abend im Stillen eine Bombe platzen lassen. Ihre neueste Version,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, wurde in der offiziellen Ankündigung als ein <strong>"kleines Upgrade"</strong> ohne API-Änderungen heruntergespielt. Aber unsere umfangreichen Tests bei <a href="https://zilliz.com/">Zilliz</a> haben etwas viel Bedeutsameres enthüllt: Dieses Update stellt einen Quantensprung in der Leistung dar, insbesondere beim logischen Denken, beim Programmieren und beim Lösen mathematischer Probleme.</p>
<p>Was wir sehen, ist nicht nur eine inkrementelle Verbesserung - es ist eine grundlegende Veränderung, die DeepSeek v3-0324 in die Spitzengruppe der Sprachmodelle einreiht. Und es ist Open Source.</p>
<p><strong>Diese Version verdient Ihre sofortige Aufmerksamkeit für Entwickler und Unternehmen, die KI-gestützte Anwendungen erstellen.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">Was ist neu in DeepSeek v3-0324 und wie gut ist es wirklich?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 bietet drei wesentliche Verbesserungen gegenüber seinem Vorgänger, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Größeres Modell, mehr Leistung:</strong> Die Anzahl der Parameter wurde von 671 Milliarden auf 685 Milliarden erhöht, was es dem Modell ermöglicht, komplexere Schlussfolgerungen zu ziehen und differenziertere Antworten zu generieren.</p></li>
<li><p><strong>Ein riesiges Kontextfenster:</strong> Mit einer verbesserten Kontextlänge von 128K Token kann DeepSeek v3-0324 wesentlich mehr Informationen in einer einzigen Abfrage speichern und verarbeiten, was es ideal für lange Konversationen, Dokumentenanalysen und KI-Anwendungen macht, die auf Retrieval basieren.</p></li>
<li><p><strong>Verbessertes Reasoning, Coding und Mathematik:</strong> Dieses Update bringt eine spürbare Steigerung der Logik-, Programmier- und mathematischen Fähigkeiten mit sich, was ihn zu einem starken Konkurrenten für KI-gestützte Codierung, wissenschaftliche Forschung und Problemlösung in Unternehmen macht.</p></li>
</ul>
<p>Aber die reinen Zahlen erzählen nicht die ganze Geschichte. Wirklich beeindruckend ist, wie es DeepSeek gelungen ist, gleichzeitig die Denkfähigkeit und die Generierungseffizienz zu verbessern - etwas, das normalerweise mit technischen Kompromissen verbunden ist.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">Die geheime Soße: Architektonische Innovation</h3><p>Unter der Haube behält DeepSeek v3-0324 seine <a href="https://arxiv.org/abs/2502.07864">Multi-Head Latent Attention (MLA) </a>-Architektur bei - ein effizienter Mechanismus, der Key-Value (KV)-Caches mit latenten Vektoren komprimiert, um die Speichernutzung und den Rechenaufwand während der Inferenz zu reduzieren. Darüber hinaus werden herkömmliche <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">Feed-Forward Networks (FFN)</a> durch Mixture of Experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>)-Schichten ersetzt, die die Recheneffizienz durch die dynamische Aktivierung der leistungsstärksten Experten für jedes Token optimieren.</p>
<p>Die interessanteste Neuerung ist jedoch die <strong>Multi-Token-Vorhersage (MTP),</strong> die es jedem Token ermöglicht, mehrere zukünftige Token gleichzeitig vorherzusagen. Dadurch wird ein erheblicher Engpass in herkömmlichen autoregressiven Modellen überwunden und sowohl die Genauigkeit als auch die Geschwindigkeit der Schlussfolgerungen verbessert.</p>
<p>Zusammen schaffen diese Innovationen ein Modell, das nicht nur gut skaliert - es skaliert intelligent und bringt KI-Fähigkeiten auf professionellem Niveau in die Reichweite von mehr Entwicklungsteams.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Erstellen Sie ein RAG-System mit Milvus und DeepSeek v3-0324 in 5 Minuten<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 ist mit seinen leistungsstarken Reasoning-Fähigkeiten ein idealer Kandidat für Retrieval-Augmented Generation (RAG)-Systeme. In diesem Tutorial zeigen wir Ihnen, wie Sie in nur fünf Minuten eine komplette RAG-Pipeline mit DeepSeek v3-0324 und der <a href="https://zilliz.com/what-is-milvus">Milvus-Vektordatenbank</a> aufbauen. Sie lernen, wie Sie mit minimalem Aufwand effizient Wissen abrufen und synthetisieren können.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Einrichten Ihrer Umgebung</h3><p>Installieren wir zunächst die erforderlichen Abhängigkeiten:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweis:</strong> Wenn Sie Google Colab verwenden, müssen Sie die Laufzeitumgebung nach der Installation dieser Pakete neu starten. Klicken Sie auf das Menü "Runtime" am oberen Rand des Bildschirms und wählen Sie "Restart session" aus dem Dropdown-Menü.</p>
<p>Da DeepSeek eine OpenAI-kompatible API bereitstellt, benötigen Sie einen API-Schlüssel. Diesen erhalten Sie, wenn Sie sich auf der<a href="https://platform.deepseek.com/api_keys"> DeepSeek-Plattform</a> anmelden:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Vorbereiten Ihrer Daten</h3><p>Für dieses Tutorial werden wir die FAQ-Seiten der <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus-Dokumentation 2.4.x</a> als Wissensquelle verwenden:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Lassen Sie uns nun den FAQ-Inhalt aus den Markdown-Dateien laden und vorbereiten:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Einrichten der Sprache und Einbetten der Modelle</h3><p>Wir werden <a href="https://openrouter.ai/">OpenRouter</a> verwenden, um auf DeepSeek v3-0324 zuzugreifen. OpenRouter bietet eine einheitliche API für mehrere KI-Modelle, wie DeepSeek und Claude. Wenn Sie einen kostenlosen DeepSeek V3 API-Schlüssel auf OpenRouter erstellen, können Sie DeepSeek V3 0324 ganz einfach ausprobieren.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Für Texteinbettungen verwenden wir das <a href="https://milvus.io/docs/embeddings.md">integrierte Einbettungsmodell</a> von Milvus, das leicht und effektiv ist:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Erstellen einer Milvus-Sammlung</h3><p>Lassen Sie uns nun unsere Vektordatenbank mit Milvus einrichten:</p>
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
<p><strong>Profi-Tipp</strong>: Für verschiedene Einsatzszenarien können Sie Ihr Milvus-Setup anpassen:</p>
<ul>
<li><p>Für die lokale Entwicklung: Verwenden Sie <code translate="no">uri=&quot;./milvus.db&quot;</code> mit <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Für größere Datenmengen: Richten Sie einen Milvus-Server über <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> ein und verwenden Sie <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Für die Produktion: Verwenden Sie<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> mit Ihrem Cloud-Endpunkt und API-Schlüssel.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Daten in Milvus laden</h3><p>Konvertieren wir unsere Textdaten in Einbettungen und speichern sie in Milvus:</p>
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
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Aufbau der RAG-Pipeline</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Schritt 1: Relevante Informationen abrufen</h4><p>Testen wir unser RAG-System mit einer allgemeinen Frage:</p>
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
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Schritt 2: Erzeugen einer Antwort mit DeepSeek</h4><p>Nun verwenden wir DeepSeek, um eine Antwort auf der Grundlage der abgerufenen Informationen zu generieren:</p>
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
<p>Und da haben Sie es! Sie haben erfolgreich eine komplette RAG-Pipeline mit DeepSeek v3-0324 und Milvus aufgebaut. Dieses System kann nun Fragen auf der Grundlage der Milvus-Dokumentation mit hoher Genauigkeit und kontextbezogenem Bewusstsein beantworten.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Vergleich von DeepSeek-V3-0324: Original vs. RAG-erweiterte Version<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Theorie ist eine Sache, aber was zählt, ist die Leistung in der Praxis. Wir haben sowohl die Standardversion von DeepSeek v3-0324 (mit deaktiviertem "Deep Thinking") als auch unsere RAG-erweiterte Version mit der gleichen Aufforderung getestet: <em>Schreibe HTML-Code, um eine schicke Website über Milvus zu erstellen.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Mit dem Ausgabecode des Standardmodells erstellte Website</h3><p>So sieht die Website aus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der Inhalt ist zwar optisch ansprechend, stützt sich aber stark auf allgemeine Beschreibungen und lässt viele der wichtigsten technischen Merkmale von Milvus außer Acht.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Die Website wurde mit dem Code der RAG-Erweiterung erstellt</h3><p>Als wir Milvus als Wissensdatenbank integriert haben, waren die Ergebnisse völlig anders:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die neue Website sieht nicht nur besser aus - sie zeigt auch ein echtes Verständnis der Architektur, der Anwendungsfälle und der technischen Vorteile von Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">Kann DeepSeek v3-0324 dedizierte Reasoning-Modelle ersetzen?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Die überraschendste Entdeckung machten wir beim Vergleich von DeepSeek v3-0324 mit spezialisierten Reasoning-Modellen wie Claude 3.7 Sonnet und GPT-4 Turbo für mathematische, logische und Code-Reasoning-Aufgaben.</p>
<p>Während spezialisierte Reasoning-Modelle beim Lösen von mehrstufigen Problemen brillieren, geht dies oft auf Kosten der Effizienz. Unsere Benchmarks haben gezeigt, dass schlussfolgernde Modelle einfache Aufforderungen häufig überanalysieren und dabei 2-3x mehr Token als nötig erzeugen und die Latenzzeit und API-Kosten erheblich erhöhen.</p>
<p>DeepSeek v3-0324 verfolgt einen anderen Ansatz. Es weist eine vergleichbare logische Konsistenz auf, ist aber deutlich prägnanter und liefert oft korrekte Lösungen mit 40-60 % weniger Token. Diese Effizienz geht nicht auf Kosten der Genauigkeit; in unseren Tests zur Codegenerierung erreichten oder übertrafen die Lösungen von DeepSeek die Funktionalität der Lösungen von Mitbewerbern, die auf logisches Denken ausgerichtet sind.</p>
<p>Für Entwickler, die Leistung mit Budgetbeschränkungen in Einklang bringen müssen, bedeutet dieser Effizienzvorteil direkt niedrigere API-Kosten und schnellere Reaktionszeiten - entscheidende Faktoren für Produktionsanwendungen, bei denen die Benutzererfahrung von der wahrgenommenen Geschwindigkeit abhängt.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">Die Zukunft der KI-Modelle: Die Grenzen des Verstandes verwischen<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Leistung von DeepSeek v3-0324 stellt eine Grundannahme der KI-Branche in Frage: dass logisches Denken und Effizienz einen unvermeidlichen Kompromiss darstellen. Dies deutet darauf hin, dass wir uns einem Wendepunkt nähern, an dem die Unterscheidung zwischen mitdenkenden und nicht mitdenkenden Modellen zu verschwimmen beginnt.</p>
<p>Führende KI-Anbieter könnten diese Unterscheidung schließlich ganz aufheben und Modelle entwickeln, die ihre Argumentationstiefe dynamisch an die Komplexität der Aufgabe anpassen. Ein solches adaptives Reasoning würde sowohl die Recheneffizienz als auch die Antwortqualität optimieren und könnte die Entwicklung und den Einsatz von KI-Anwendungen revolutionieren.</p>
<p>Für Entwickler, die RAG-Systeme entwickeln, verspricht diese Entwicklung kosteneffizientere Lösungen, die die Argumentationstiefe von Premium-Modellen ohne deren Rechenaufwand bieten - eine Erweiterung der Möglichkeiten von Open-Source-KI.</p>
