---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Представляем функцию встраивания: Как Milvus 2.6 оптимизирует векторизацию и
  семантический поиск
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
  Узнайте, как Milvus 2.6 упрощает процесс встраивания и векторный поиск с
  помощью функции Data-in, Data-out. Автоматическое встраивание и повторное
  ранжирование - внешняя предварительная обработка не требуется.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Если вы когда-либо создавали приложение для векторного поиска, вы уже слишком хорошо знаете этот рабочий процесс. Прежде чем хранить данные, их необходимо преобразовать в векторы с помощью модели встраивания, очистить и отформатировать, а затем поместить в векторную базу данных. Каждый запрос также проходит через тот же процесс: встраивание входных данных, поиск по сходству, а затем сопоставление полученных идентификаторов с исходными документами или записями. Это работает, но создает распределенный клубок скриптов предварительной обработки, конвейеров встраивания и "клеящегося" кода, который вам приходится поддерживать.</p>
<p><a href="https://milvus.io/">Milvus</a>, высокопроизводительная векторная база данных с открытым исходным кодом, теперь делает большой шаг к упрощению всего этого. В <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> появилась <strong>функция Data-in, Data-out (также известная как</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Embedding Function</strong></a><strong>)</strong>- встроенная возможность встраивания, которая напрямую подключается к основным поставщикам моделей, таким как OpenAI, AWS Bedrock, Google Vertex AI и Hugging Face. Вместо того чтобы управлять собственной инфраструктурой встраивания, Milvus теперь может вызывать эти модели за вас. Вы также можете вставлять и запрашивать необработанный текст - а вскоре и другие типы данных, - в то время как Milvus автоматически обрабатывает векторизацию во время записи и запроса.</p>
<p>В этой статье мы подробнее рассмотрим, как Data-in, Data-out работает под капотом, как настраивать провайдеров и функции встраивания, а также как использовать его для оптимизации рабочих процессов векторного поиска из конца в конец.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">Что такое Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out в Milvus 2.6 построен на новом модуле Function - фреймворке, который позволяет Milvus обрабатывать преобразование данных и генерировать вставки внутри, без каких-либо внешних сервисов предварительной обработки. (Вы можете следить за предложением по разработке в <a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a>.) С помощью этого модуля Milvus может принимать необработанные входные данные, напрямую вызывать провайдера встраивания и автоматически записывать полученные векторы в вашу коллекцию.</p>
<p>На высоком уровне модуль <strong>Function</strong> превращает генерацию встраивания в нативную возможность базы данных. Вместо того чтобы запускать отдельные конвейеры встраивания, фоновые рабочие или реранкерные службы, Milvus теперь отправляет запросы к настроенному провайдеру, получает встраивания и хранит их вместе с данными - все это внутри пути ввода. Это избавляет вас от необходимости управлять собственной инфраструктурой встраивания.</p>
<p>Data-in, Data-out представляет три основных улучшения в рабочем процессе Milvus:</p>
<ul>
<li><p><strong>Вставка необработанных данных напрямую</strong> - теперь вы можете вставлять необработанный текст, изображения или другие типы данных непосредственно в Milvus. Нет необходимости предварительно преобразовывать их в векторы.</p></li>
<li><p><strong>Настройте одну функцию встраивания</strong> - после настройки модели встраивания в Milvus она автоматически управляет всем процессом встраивания. Milvus легко интегрируется с целым рядом поставщиков моделей, включая OpenAI, AWS Bedrock, Google Vertex AI, Cohere и Hugging Face.</p></li>
<li><p><strong>Запросы с необработанными данными</strong> - теперь вы можете выполнять семантический поиск с использованием необработанного текста или других запросов на основе контента. Milvus использует ту же настроенную модель для генерации вкраплений на лету, выполнения поиска по сходству и возврата релевантных результатов.</p></li>
</ul>
<p>Короче говоря, Milvus теперь автоматически встраивает - и, по желанию, перестраивает - ваши данные. Векторизация становится встроенной функцией базы данных, устраняя необходимость во внешних сервисах встраивания или пользовательской логике предварительной обработки.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Принцип работы Data-in, Data-out<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Приведенная ниже схема иллюстрирует работу Data-in, Data-out в Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рабочий процесс Data-in, Data-out можно разбить на шесть основных этапов:</p>
<ol>
<li><p><strong>Ввод данных</strong> - пользователь вводит необработанные данные - текст, изображения или другие типы контента - непосредственно в Milvus, не выполняя никакой внешней предварительной обработки.</p></li>
<li><p><strong>Генерация вкраплений</strong> - модуль Function автоматически вызывает настроенную модель вкраплений через свой сторонний API, преобразуя исходные данные в векторные вкрапления в режиме реального времени.</p></li>
<li><p><strong>Хранение вкраплений</strong> - Milvus записывает сгенерированные вкрапления в указанное векторное поле в вашей коллекции, где они становятся доступны для операций поиска по сходству.</p></li>
<li><p><strong>Отправить запрос</strong> - пользователь отправляет Milvus запрос в виде текста или контента, как и на этапе ввода.</p></li>
<li><p><strong>Семантический поиск</strong> - Milvus встраивает запрос, используя ту же настроенную модель, выполняет поиск сходства по сохраненным векторам и определяет ближайшие семантические совпадения.</p></li>
<li><p><strong>Возврат результатов</strong> - Milvus возвращает топ-к наиболее схожих результатов - с привязкой к исходным данным - непосредственно в приложение.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Как настроить ввод и вывод данных<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><ul>
<li><p>Установите последнюю версию <strong>Milvus 2.6</strong>.</p></li>
<li><p>Подготовьте ключ API для встраивания от поддерживаемого провайдера (например, OpenAI, AWS Bedrock или Cohere). В этом примере мы будем использовать <strong>Cohere</strong> в качестве провайдера встраивания.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Измените конфигурацию <code translate="no">milvus.yaml</code>.</h3><p>Если вы используете Milvus с <strong>Docker Compose</strong>, вам нужно будет изменить файл <code translate="no">milvus.yaml</code>, чтобы включить модуль Function. За руководством вы можете обратиться к официальной документации: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configure Milvus with Docker Compose</a> (инструкции для других методов развертывания также можно найти здесь).</p>
<p>В конфигурационном файле найдите разделы <code translate="no">credential</code> и <code translate="no">function</code>.</p>
<p>Затем обновите поля <code translate="no">apikey1.apikey</code> и <code translate="no">providers.cohere</code>.</p>
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
<p>После внесения этих изменений перезапустите Milvus, чтобы применить обновленную конфигурацию.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Как использовать функцию ввода и вывода данных<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Определите схему для коллекции</h3><p>Чтобы включить функцию встраивания, <strong>схема</strong> вашей <strong>коллекции</strong> должна включать как минимум три поля:</p>
<ul>
<li><p><strong>Поле первичного ключа (</strong><code translate="no">id</code> ) - уникально идентифицирует каждую сущность в коллекции.</p></li>
<li><p><strong>Скалярное поле (</strong><code translate="no">document</code> ) - хранит исходные данные.</p></li>
<li><p><strong>Поле Vector (</strong><code translate="no">dense</code> ) - хранит сгенерированные векторные вкрапления.</p></li>
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
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Определение функции встраивания</h3><p>Далее определите <strong>функцию встраивания</strong> в схему.</p>
<ul>
<li><p><code translate="no">name</code> - Уникальный идентификатор для функции.</p></li>
<li><p><code translate="no">function_type</code> - Установите значение <code translate="no">FunctionType.TEXTEMBEDDING</code> для текстовых вкраплений. Milvus также поддерживает другие типы функций, такие как <code translate="no">FunctionType.BM25</code> и <code translate="no">FunctionType.RERANK</code>. Дополнительные сведения см. в разделе <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Обзор</a> <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">полнотекстового поиска</a> и <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">ранжирования по распаду</a>.</p></li>
<li><p><code translate="no">input_field_names</code> - Определяет поле ввода для исходных данных (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Определяет выходное поле, в котором будут храниться векторные вкрапления (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Содержит параметры конфигурации для функции встраивания. Значения для <code translate="no">provider</code> и <code translate="no">model_name</code> должны совпадать с соответствующими записями в конфигурационном файле <code translate="no">milvus.yaml</code>.</p></li>
</ul>
<p><strong>Примечание:</strong> Каждая функция должна иметь уникальные <code translate="no">name</code> и <code translate="no">output_field_names</code>, чтобы различать разные логики преобразования и предотвращать конфликты.</p>
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
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Настройка индекса</h3><p>После того как поля и функции определены, создайте индекс для коллекции. Для простоты мы используем здесь в качестве примера тип AUTOINDEX.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Создайте коллекцию</h3><p>Используйте определенную схему и индекс для создания новой коллекции. В этом примере мы создадим коллекцию с именем Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Вставка данных</h3><p>Теперь вы можете вставлять необработанные данные непосредственно в Milvus - нет необходимости генерировать вставки вручную.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Выполнить векторный поиск</h3><p>После вставки данных вы можете выполнять поиск непосредственно по необработанным текстовым запросам. Milvus автоматически преобразует ваш запрос во вставку, выполнит поиск сходства по хранящимся векторам и вернет наиболее подходящие варианты.</p>
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
<p>Подробнее о векторном поиске см: <a href="https://milvus.io/docs/single-vector-search.md">Основы векторного поиска </a>и <a href="https://milvus.io/docs/get-and-scalar-query.md">API запросов</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Начало работы с Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Благодаря функции Data-in, Data-out, Milvus 2.6 простота векторного поиска выходит на новый уровень. Благодаря интеграции функций встраивания и повторного ранжирования непосредственно в Milvus, вам больше не нужно управлять внешней предварительной обработкой или поддерживать отдельные службы встраивания.</p>
<p>Готовы попробовать? Установите <a href="https://milvus.io/docs">Milvus</a> 2.6 сегодня и испытайте силу Data-in, Data-out на себе.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете забронировать 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Подробнее о возможностях Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Представляем Milvus 2.6: доступный векторный поиск в миллиардных масштабах</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Измельчение JSON в Milvus: 88,9-кратное ускорение фильтрации JSON с гибкостью</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Разблокирование истинного поиска на уровне сущностей: Новые возможности Array-of-Structs и MAX_SIM в Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH в Milvus: секретное оружие для борьбы с дубликатами в обучающих данных LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Доведите векторное сжатие до крайности: как Milvus обслуживает в 3 раза больше запросов с помощью RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Бенчмарки лгут - векторные БД заслуживают реальной проверки </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Мы заменили Kafka/Pulsar на Woodpecker для Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Векторный поиск в реальном мире: как эффективно фильтровать, не убивая отзыв </a></p></li>
</ul>
