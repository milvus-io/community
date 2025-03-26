---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: >-
  DeepSeek V3-0324: "Незначительное обновление", которое уничтожает лучшие
  модели ИИ
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 обучается с большими параметрами, имеет более длинное
  контекстное окно и расширенные возможности рассуждений, кодирования и
  математики.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>Прошлой ночью компания DeepSeek без лишнего шума раскрыла бомбу. В официальном сообщении о выпуске<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a> было сказано, что это всего лишь <strong>"незначительное обновление"</strong> без изменений в API. Но наше обширное тестирование в <a href="https://zilliz.com/">Zilliz</a> выявило нечто более значительное: это обновление представляет собой квантовый скачок в производительности, особенно в логических рассуждениях, программировании и решении математических задач.</p>
<p>То, что мы видим, - это не просто постепенное улучшение, это фундаментальный сдвиг, который выводит DeepSeek v3-0324 в элитный эшелон языковых моделей. И это с открытым исходным кодом.</p>
<p><strong>Этот релиз заслуживает вашего немедленного внимания для разработчиков и предприятий, создающих приложения на базе ИИ.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">Что нового в DeepSeek v3-0324 и насколько он действительно хорош?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 представляет три основных улучшения по сравнению со своим предшественником, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Более крупная модель, более мощная:</strong> количество параметров увеличилось с 671 миллиарда до 685 миллиардов, что позволяет модели обрабатывать более сложные рассуждения и генерировать более тонкие ответы.</p></li>
<li><p><strong>Массивное контекстное окно:</strong> Благодаря обновленной длине контекста в 128 тыс. маркеров DeepSeek v3-0324 может сохранять и обрабатывать значительно больше информации в одном запросе, что делает его идеальным для длинных разговоров, анализа документов и приложений ИИ на основе поиска.</p></li>
<li><p><strong>Улучшенные рассуждения, кодирование и математика:</strong> Это обновление заметно расширяет возможности логики, программирования и математики, что делает его сильным соперником для кодирования с помощью ИИ, научных исследований и решения задач корпоративного уровня.</p></li>
</ul>
<p>Но сырые цифры не говорят всей истории. По-настоящему впечатляет то, как DeepSeek удалось одновременно повысить способность к рассуждениям и эффективность генерации - то, что обычно связано с инженерными компромиссами.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">Секретный соус: Архитектурные инновации</h3><p>Под капотом DeepSeek v3-0324 сохранил архитектуру <a href="https://arxiv.org/abs/2502.07864">Multi-head Latent Attention (MLA) </a>- эффективный механизм, который сжимает кэши Key-Value (KV) с помощью скрытых векторов, чтобы сократить использование памяти и вычислительные затраты во время умозаключений. Кроме того, она заменяет традиционные <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">сети Feed-Forward Networks (FFN)</a> на слои Mixture of Experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>), оптимизируя эффективность вычислений за счет динамической активации наиболее эффективных экспертов для каждого токена.</p>
<p>Однако наиболее интересным обновлением является <strong>мультитокен-предсказание (MTP),</strong> которое позволяет каждому токену предсказывать несколько будущих токенов одновременно. Это позволяет преодолеть значительное узкое место в традиционных авторегрессионных моделях, повышая точность и скорость прогнозирования.</p>
<p>Вместе эти инновации создают модель, которая не просто хорошо масштабируется - она масштабируется интеллектуально, делая возможности ИИ профессионального уровня доступными для большего числа команд разработчиков.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Построение RAG-системы с помощью Milvus и DeepSeek v3-0324 за 5 минут<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Мощные способности DeepSeek v3-0324 к рассуждениям делают его идеальным кандидатом для систем Retrieval-Augmented Generation (RAG). В этом руководстве мы покажем вам, как построить полный конвейер RAG с использованием DeepSeek v3-0324 и векторной базы данных <a href="https://zilliz.com/what-is-milvus">Milvus</a> всего за пять минут. Вы узнаете, как эффективно извлекать и синтезировать знания при минимальной настройке.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Настройка среды</h3><p>Сначала установим необходимые зависимости:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Примечание:</strong> Если вы используете Google Colab, то после установки этих пакетов вам нужно будет перезапустить среду выполнения. Нажмите на меню "Runtime" в верхней части экрана и выберите "Restart session" из выпадающего меню.</p>
<p>Поскольку DeepSeek предоставляет API, совместимый с OpenAI, вам понадобится API-ключ. Вы можете получить его, зарегистрировавшись на<a href="https://platform.deepseek.com/api_keys"> платформе DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Подготовка данных</h3><p>В этом руководстве мы будем использовать страницы FAQ из <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">документации Milvus 2.4.x</a> в качестве источника знаний:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Итак, давайте загрузим и подготовим содержимое FAQ из файлов в формате markdown:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Настройка языка и встраивание моделей</h3><p>Для доступа к DeepSeek v3-0324 мы будем использовать <a href="https://openrouter.ai/">OpenRouter</a>. OpenRouter предоставляет единый API для нескольких моделей ИИ, таких как DeepSeek и Claude. Создав бесплатный API-ключ DeepSeek V3 на OpenRouter, вы сможете легко опробовать DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Для встраивания текста мы будем использовать <a href="https://milvus.io/docs/embeddings.md">встроенную</a> в Milvus <a href="https://milvus.io/docs/embeddings.md">модель встраивания</a>, которая отличается легкостью и эффективностью:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Создание коллекции Milvus</h3><p>Теперь давайте создадим нашу векторную базу данных с помощью Milvus:</p>
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
<p><strong>Совет профессионала</strong>: Для различных сценариев развертывания вы можете настроить Milvus:</p>
<ul>
<li><p>Для локальной разработки: Используйте <code translate="no">uri=&quot;./milvus.db&quot;</code> с <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>.</p></li>
<li><p>Для больших наборов данных: Установите сервер Milvus через <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> и используйте <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Для производства: Используйте<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> с вашей конечной точкой облака и ключом API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Загрузка данных в Milvus</h3><p>Давайте преобразуем наши текстовые данные во вкрапления и сохраним их в Milvus:</p>
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
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Построение конвейера RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Шаг 1: Получение релевантной информации</h4><p>Давайте протестируем нашу систему RAG с помощью обычного вопроса:</p>
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
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Шаг 2: Генерируем ответ с помощью DeepSeek</h4><p>Теперь давайте воспользуемся DeepSeek, чтобы сгенерировать ответ на основе полученной информации:</p>
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
<p>Вот и все! Вы успешно построили полный конвейер RAG с помощью DeepSeek v3-0324 и Milvus. Теперь эта система может отвечать на вопросы, основанные на документации Milvus, с высокой точностью и контекстной осведомленностью.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Сравнение DeepSeek-V3-0324: Оригинальная версия против версии с улучшенным RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>Теория - это одно, но главное - реальная производительность. Мы протестировали как стандартную версию DeepSeek v3-0324 (с отключенным "Глубоким мышлением"), так и нашу версию с улучшенным RAG, используя один и тот же запрос: <em>Напишите HTML-код для создания фантастического веб-сайта о Милвусе.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Веб-сайт, созданный с помощью выходного кода Стандартной модели</h3><p>Вот как выглядит сайт:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Несмотря на визуальную привлекательность, содержание сайта в значительной степени опирается на общие описания и упускает многие из основных технических характеристик Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Веб-сайт, созданный на основе кода, сгенерированного версией RAG-Enhanced</h3><p>Когда мы интегрировали Milvus в качестве базы знаний, результаты кардинально изменились:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Последний веб-сайт не просто выглядит лучше - он демонстрирует подлинное понимание архитектуры Milvus, примеров использования и технических преимуществ.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">Может ли DeepSeek v3-0324 заменить специализированные модели рассуждений?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Самое удивительное открытие мы сделали, сравнив DeepSeek v3-0324 со специализированными моделями рассуждений, такими как Claude 3.7 Sonnet и GPT-4 Turbo, в задачах математического, логического и кодового рассуждения.</p>
<p>Хотя специализированные модели рассуждений отлично справляются с решением многоэтапных задач, они часто делают это в ущерб эффективности. Наши бенчмарки показали, что модели с большим количеством рассуждений часто чрезмерно анализируют простые запросы, генерируя в 2-3 раза больше токенов, чем нужно, и значительно увеличивая задержку и стоимость API.</p>
<p>DeepSeek v3-0324 использует другой подход. Он демонстрирует сопоставимую логическую последовательность, но при этом отличается удивительно высокой лаконичностью - зачастую он выдает правильные решения, используя на 40-60 % меньше токенов. При этом эффективность не снижается за счет точности: в наших тестах на генерацию кода решения DeepSeek соответствовали или превосходили по функциональности решения конкурентов, ориентированных на рассуждения.</p>
<p>Для разработчиков, балансирующих между производительностью и бюджетными ограничениями, такое преимущество в эффективности напрямую выражается в снижении стоимости API и ускорении времени отклика - важнейшие факторы для производственных приложений, где от скорости работы зависит пользовательский опыт.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">Будущее моделей ИИ: Размывание границы разумного<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>Производительность DeepSeek v3-0324 ставит под сомнение основное предположение индустрии ИИ: рассуждения и эффективность представляют собой неизбежный компромисс. Это говорит о том, что мы приближаемся к точке перелома, когда различие между моделями с рассуждениями и моделями без рассуждений начинает стираться.</p>
<p>Ведущие поставщики ИИ могут в конечном итоге полностью устранить это различие, разработав модели, которые будут динамически регулировать глубину своих рассуждений в зависимости от сложности задачи. Такое адаптивное рассуждение позволит оптимизировать как вычислительную эффективность, так и качество ответа, что потенциально может произвести революцию в создании и развертывании приложений ИИ.</p>
<p>Разработчикам, создающим системы RAG, эта эволюция сулит более экономичные решения, обеспечивающие глубину рассуждений моделей премиум-класса без вычислительных затрат, что расширяет возможности ИИ с открытым исходным кодом.</p>
