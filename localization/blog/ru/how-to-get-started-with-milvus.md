---
id: how-to-get-started-with-milvus.md
title: Как начать работу с Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Как начать работу с Milvus</span> </span></p>
<p><strong><em>Последнее обновление - январь 2025 года</em></strong></p>
<p>Развитие больших языковых моделей<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>) и растущий объем данных требуют гибкой и масштабируемой инфраструктуры для хранения огромных объемов информации, такой как база данных. Однако <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">традиционные базы данных</a> предназначены для хранения табличных и структурированных данных, в то время как информация, обычно полезная для использования возможностей сложных LLM и алгоритмов поиска информации, является <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированной</a>, такой как текст, изображения, видео или аудио.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">Векторные базы данных</a> - это системы баз данных, специально разработанные для неструктурированных данных. Векторные базы данных позволяют не только хранить огромные объемы неструктурированных данных, но и выполнять в них <a href="https://zilliz.com/learn/vector-similarity-search">векторный поиск</a>. Векторные базы данных используют передовые методы индексирования, такие как Inverted File Index (IVFFlat) или Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>), для быстрого и эффективного векторного поиска и извлечения информации.</p>
<p><strong>Milvus</strong> - это векторная база данных с открытым исходным кодом, которую мы можем использовать, чтобы задействовать все полезные функции, которые может предложить векторная база данных. Вот что мы рассмотрим в этом посте:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Обзор Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Варианты развертывания Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Начало работы с Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Начало работы с Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Полностью управляемый Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Что такое Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> - это </a>векторная база данных с открытым исходным кодом, которая позволяет нам хранить огромные объемы неструктурированных данных и выполнять быстрый и эффективный векторный поиск по ним. Milvus очень полезен для многих популярных приложений GenAI, таких как рекомендательные системы, персонализированные чат-боты, обнаружение аномалий, поиск изображений, обработка естественного языка и поиск с расширенной генерацией<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>Использование Milvus в качестве векторной базы данных дает ряд преимуществ:</p>
<ul>
<li><p>Milvus предлагает несколько вариантов развертывания, которые вы можете выбрать в зависимости от вашего сценария использования и размера приложений, которые вы хотите создать.</p></li>
<li><p>Milvus поддерживает разнообразные методы индексирования для удовлетворения различных потребностей в данных и производительности, включая варианты in-memory, такие как FLAT, IVFFlat, HNSW и <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, квантованные варианты для эффективности использования памяти, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> на диске для больших наборов данных и оптимизированные для GPU индексы, такие как GPU_CAGRA, GPU_IVF_FLAT и GPU_IVF_PQ для ускоренного поиска с экономией памяти.</p></li>
<li><p>Milvus также предлагает гибридный поиск, в котором мы можем использовать комбинацию плотных вкраплений, разреженных вкраплений и фильтрации метаданных во время операций векторного поиска, что приводит к более точным результатам поиска. Кроме того, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> теперь поддерживает гибрид <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">полнотекстового</a> и векторного поиска, что делает поиск еще более точным.</p></li>
<li><p>Milvus можно полностью использовать в облаке через <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, где вы можете оптимизировать эксплуатационные расходы и скорость векторного поиска благодаря четырем передовым функциям: логические кластеры, дезагрегация потоковых и исторических данных, многоуровневое хранение, автомасштабирование и разделение горячей и холодной многопользовательской аренды.</p></li>
</ul>
<p>При использовании Milvus в качестве векторной базы данных вы можете выбрать три варианта развертывания, каждый из которых имеет свои преимущества и достоинства. Мы поговорим о каждом из них в следующем разделе.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Варианты развертывания Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Для начала использования Milvus мы можем выбрать один из четырех вариантов развертывания: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed и Zilliz Cloud (управляемый Milvus).</strong> Каждый вариант развертывания разработан с учетом различных сценариев использования, таких как объем данных, цель приложения и масштаб приложения.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a> - это облегченная версия Milvus и самый простой способ начать работу. В следующем разделе мы увидим, как запустить Milvus Lite в действии, а для начала нам нужно лишь установить библиотеку Pymilvus с помощью pip. После этого мы сможем выполнять большинство основных функций Milvus как векторной базы данных.</p>
<p>Milvus Lite идеально подходит для быстрого создания прототипов или обучения и может быть запущен в Jupyter-блокноте без каких-либо сложных настроек. Что касается хранения векторов, то Milvus Lite подходит для хранения примерно миллиона векторных вкраплений. Благодаря своей легкости и объему памяти Milvus Lite является идеальным вариантом развертывания для работы с пограничными устройствами, такими как система поиска частных документов, обнаружение объектов на устройстве и т. д.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone - это развертывание сервера на одной машине, упакованное в образ Docker. Поэтому все, что нам нужно для начала работы, - это установить Milvus в Docker, а затем запустить Docker-контейнер. Подробную реализацию Milvus Standalone мы также рассмотрим в следующем разделе.</p>
<p>Milvus Standalone идеально подходит для создания и производства приложений малого и среднего масштаба, поскольку он способен хранить до 10 миллионов векторных вкраплений. Кроме того, Milvus Standalone обеспечивает высокую доступность благодаря режиму основного резервного копирования, что делает его очень надежным для использования в готовых к производству приложениях.</p>
<p>Мы также можем использовать Milvus Standalone, например, после быстрого прототипирования и изучения функциональности Milvus с помощью Milvus Lite, поскольку и Milvus Standalone, и Milvus Lite используют один и тот же клиентский API.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Distributed</h3><p>Milvus Distributed - это вариант развертывания, использующий облачную архитектуру, в которой забор и получение данных осуществляются отдельно, что позволяет создать высокомасштабируемое и эффективное приложение.</p>
<p>Для запуска Milvus Distributed обычно используется кластер Kubernetes, позволяющий контейнеру работать на нескольких машинах и в разных средах. Использование кластера Kubernetes обеспечивает масштабируемость и гибкость Milvus Distributed, позволяя настраивать выделенные ресурсы в зависимости от спроса и рабочей нагрузки. Это также означает, что в случае сбоя одной части другие могут взять на себя ее функции, обеспечивая бесперебойную работу всей системы.</p>
<p>Milvus Distributed способна обрабатывать до десятков миллиардов векторных вкраплений и специально разработана для случаев, когда данные слишком велики для хранения на одной серверной машине. Поэтому этот вариант развертывания идеально подходит для корпоративных клиентов, обслуживающих большую базу пользователей.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Возможности хранения векторного встраивания в различных вариантах развертывания Milvus.</em></p>
<p>В этой статье мы покажем вам, как начать работу с Milvus Lite и Milvus Standalone, поскольку вы можете быстро приступить к работе с обоими методами без сложных настроек. Однако Milvus Distributed более сложен в настройке. Как только мы настроим Milvus Distributed, код и логический процесс создания коллекций, получения данных, выполнения векторного поиска и т. д. будут аналогичны Milvus Lite и Milvus Standalone, поскольку они используют один и тот же API на стороне клиента.</p>
<p>Помимо трех вышеупомянутых вариантов развертывания, вы также можете попробовать управляемый Milvus в <a href="https://zilliz.com/cloud">облаке Zilliz Cloud</a>, что позволит вам без лишних хлопот использовать его. О Zilliz Cloud мы также расскажем далее в этой статье.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Начало работы с Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite можно сразу же реализовать на Python, импортировав библиотеку под названием Pymilvus с помощью pip. Перед установкой Pymilvus убедитесь, что ваше окружение соответствует следующим требованиям:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 и arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 и x86_64)</p></li>
<li><p>Python 3.7 или более поздняя версия</p></li>
</ul>
<p>После выполнения этих требований вы можете установить Milvus Lite и необходимые зависимости для демонстрации, используя следующую команду:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Эта команда устанавливает или обновляет библиотеку <code translate="no">pymilvus</code>, Python SDK для Milvus. Milvus Lite поставляется в комплекте с PyMilvus, поэтому для установки Milvus Lite достаточно одной строки кода.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Эта команда добавляет расширенные возможности и дополнительные инструменты, предварительно интегрированные с Milvus, включая модели машинного обучения, такие как Hugging Face Transformers, модели встраивания Jina AI и модели повторного ранжирования.</p></li>
</ul>
<p>Вот шаги, которые мы будем выполнять с Milvus Lite:</p>
<ol>
<li><p>Преобразуйте текстовые данные в их представление с помощью модели встраивания.</p></li>
<li><p>Создайте схему в базе данных Milvus для хранения наших текстовых данных и их встраиваемых представлений.</p></li>
<li><p>Храните и индексируйте наши данные в нашей схеме.</p></li>
<li><p>Выполните простой векторный поиск по сохраненным данным.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Рабочий процесс операции векторного поиска.</em></p>
<p>Для преобразования текстовых данных в векторные вкрапления мы будем использовать <a href="https://zilliz.com/ai-models">модель вкрапления</a> из SentenceTransformers под названием 'all-MiniLM-L6-v2'. Эта модель встраивания преобразует наш текст в 384-мерный векторный эмбеддинг. Давайте загрузим модель, преобразуем наши текстовые данные и упакуем все вместе.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>Затем создадим схему для хранения всех вышеперечисленных данных в Milvus. Как вы можете видеть выше, наши данные состоят из трех полей: ID, вектор и текст. Поэтому мы создадим схему с этими тремя полями.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>С помощью Milvus Lite мы можем легко создать коллекцию в определенной базе данных на основе схемы, определенной выше, а также вставить и проиндексировать данные в коллекцию всего за несколько строк кода.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>В приведенном выше коде мы создаем коллекцию под названием &quot;demo_collection&quot; в базе данных Milvus под названием &quot;milvus_demo&quot;. Затем мы индексируем все наши данные в только что созданную коллекцию "demo_collection".</p>
<p>Теперь, когда наши данные находятся в базе данных, мы можем выполнить векторный поиск по ним для любого запроса. Допустим, у нас есть запрос: &quot;<em>Кто такой Алан Тьюринг?</em>&quot;. Мы можем получить наиболее подходящий ответ на этот запрос, выполнив следующие шаги:</p>
<ol>
<li><p>Преобразуйте наш запрос в векторное вложение с помощью той же модели вложения, которую мы использовали для преобразования данных в базе данных в вложения.</p></li>
<li><p>Вычислить сходство между вложением нашего запроса и вложением каждой записи в базе данных, используя такие метрики, как косинусоидальное сходство или евклидово расстояние.</p></li>
<li><p>Выбираем наиболее похожую запись как подходящий ответ на наш запрос.</p></li>
</ol>
<p>Ниже приведена реализация вышеописанных шагов с помощью Milvus:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Вот и все! Вы также можете узнать больше о других функциональных возможностях Milvus, таких как управление базами данных, вставка и удаление коллекций, выбор правильного метода индексирования и выполнение более сложных векторных поисков с фильтрацией метаданных и гибридным поиском в <a href="https://milvus.io/docs/">документации Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Начало работы с Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone - это вариант развертывания, при котором все упаковывается в контейнер Docker. Поэтому нам нужно установить Milvus в Docker, а затем запустить контейнер Docker, чтобы начать работу с Milvus Standalone.</p>
<p>Перед установкой Milvus Standalone убедитесь, что ваше оборудование и программное обеспечение соответствуют требованиям, описанным на <a href="https://milvus.io/docs/prerequisite-docker.md">этой странице</a>. Кроме того, убедитесь, что вы установили Docker. Чтобы установить Docker, обратитесь к <a href="https://docs.docker.com/get-started/get-docker/">этой странице</a>.</p>
<p>После того как наша система соответствует требованиям и мы установили Docker, мы можем приступить к установке Milvus в Docker с помощью следующей команды:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>В приведенном выше коде мы также запускаем контейнер Docker, и после его запуска вы получите результат, аналогичный приведенному ниже:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Сообщение после успешного запуска контейнера Docker.</em></p>
<p>После выполнения приведенного выше сценария установки "standalone_embed.sh" Docker-контейнер с именем "milvus" запускается на порту 19530. Поэтому мы можем создать новую базу данных, а также получить доступ ко всему, что связано с базой данных Milvus, указав этот порт при инициализации клиента.</p>
<p>Допустим, мы хотим создать базу данных под названием "milvus_demo", аналогично тому, что мы делали в Milvus Lite выше. Мы можем сделать это следующим образом:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Далее вы можете проверить, действительно ли только что созданная база данных под названием "milvus_demo" существует в вашем экземпляре Milvus, обратившись к <a href="https://milvus.io/docs/milvus-webui.md">веб-интерфейсу Milvus</a>. Как следует из названия, Milvus Web UI - это графический пользовательский интерфейс, предоставляемый Milvus для наблюдения за статистикой и метриками компонентов, проверки списка и деталей баз данных, коллекций и конфигураций. Вы можете получить доступ к Milvus Web UI после запуска Docker-контейнера по ссылке http://127.0.0.1:9091/webui/.</p>
<p>Если вы перейдете по указанной выше ссылке, то увидите вот такую целевую страницу:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На вкладке "Коллекции" вы увидите, что наша база данных "milvus_demo" была успешно создана. Как видите, с помощью этого веб-интерфейса можно проверить и другие вещи, такие как список коллекций, конфигураций, выполненных запросов и т. д.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Теперь мы можем выполнить все точно так же, как мы видели в разделе Milvus Lite выше. Создадим коллекцию под названием "demo_collection" в базе данных "milvus_demo", состоящую из трех полей, таких же, как в разделе Milvus Lite. Затем мы вставим наши данные в коллекцию.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Код для выполнения операции векторного поиска также аналогичен Milvus Lite, как вы можете видеть в приведенном ниже коде:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Помимо использования Docker, вы также можете использовать Milvus Standalone с помощью <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (для Linux) и <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (для Windows).</p>
<p>Когда мы больше не используем наш экземпляр Milvus, мы можем остановить Milvus Standalone с помощью следующей команды:</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Fully Managed Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Альтернативным способом начать работу с Milvus является использование собственной облачной инфраструктуры в <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, где вы сможете работать без лишних хлопот и в 10 раз быстрее.</p>
<p>Zilliz Cloud предлагает выделенные кластеры со специальными средами и ресурсами для поддержки вашего приложения искусственного интеллекта. Поскольку это облачная база данных, построенная на Milvus, нам не нужно настраивать и управлять локальной инфраструктурой. Zilliz Cloud также предоставляет более продвинутые функции, такие как разделение векторного хранения и вычислений, резервное копирование данных в популярные системы хранения объектов, такие как S3, и кэширование данных для ускорения операций векторного поиска и извлечения.</p>
<p>Однако при выборе облачных сервисов следует учитывать эксплуатационные расходы. В большинстве случаев нам приходится платить даже тогда, когда кластер простаивает, не принимая данных и не выполняя векторного поиска. Если вы хотите еще больше оптимизировать эксплуатационные расходы и производительность вашего приложения, Zilliz Cloud Serverless станет отличным вариантом.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Основные преимущества использования Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless доступен у основных облачных провайдеров, таких как AWS, Azure и GCP. Он предлагает такие функции, как оплата по факту использования, то есть вы платите только тогда, когда используете кластер.</p>
<p>В Zilliz Cloud Serverless также реализованы такие передовые технологии, как логические кластеры, автомасштабирование, многоуровневое хранение, дезагрегация потоковых и исторических данных, а также разделение данных по принципу "горячий-холодный". Эти функции позволяют Zilliz Cloud Serverless добиться 50-кратной экономии средств и примерно 10-кратного ускорения операций векторного поиска по сравнению с in-memory Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Иллюстрация многоуровневого хранения и разделения данных "горячий-холодный".</em></p>
<p>Если вы хотите начать работу с Zilliz Cloud Serverless, посетите <a href="https://zilliz.com/serverless">эту страницу</a> для получения дополнительной информации.</p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus - это универсальная и мощная векторная база данных, созданная для решения задач управления неструктурированными данными и выполнения быстрых и эффективных операций векторного поиска в современных приложениях искусственного интеллекта. Благодаря таким вариантам развертывания, как Milvus Lite для быстрого создания прототипов, Milvus Standalone для приложений малого и среднего масштаба и Milvus Distributed для масштабирования на уровне предприятия, он обеспечивает гибкость, соответствующую размеру и сложности любого проекта.</p>
<p>Кроме того, Zilliz Cloud Serverless расширяет возможности Milvus в облако и обеспечивает экономически эффективную модель с оплатой по факту использования, которая устраняет необходимость в локальной инфраструктуре. Благодаря таким передовым функциям, как многоуровневое хранение и автоматическое масштабирование, Zilliz Cloud Serverless обеспечивает ускорение операций векторного поиска при оптимизации затрат.</p>
