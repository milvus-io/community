---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Представляем Milvus SDK v2: Встроенная поддержка Async, унифицированные API и
  повышенная производительность
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Испытайте Milvus SDK v2, переосмысленный для разработчиков! Наслаждайтесь
  унифицированным API, встроенной поддержкой async и повышенной
  производительностью для ваших проектов векторного поиска.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Вы говорили, а мы слушали! Milvus SDK v2 - это полное переосмысление нашего опыта для разработчиков, созданное непосредственно на основе ваших отзывов. Благодаря унифицированному API для Python, Java, Go и Node.js, нативной поддержке async, о которой вы так просили, кэшу схем, повышающему производительность, и упрощенному интерфейсу MilvusClient, Milvus SDK v2 делает разработку <a href="https://zilliz.com/learn/vector-similarity-search">векторного поиска</a> быстрее и интуитивнее, чем когда-либо. Независимо от того, создаете ли вы приложения <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, рекомендательные системы или решения для <a href="https://zilliz.com/learn/what-is-computer-vision">компьютерного зрения</a>, это обновление, разработанное сообществом, изменит вашу работу с Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Почему мы его создали: Устранение болевых точек сообщества<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>За годы работы Milvus стал <a href="https://milvus.io/blog/what-is-a-vector-database.md">векторной базой данных</a>, которую выбирают тысячи приложений искусственного интеллекта. Однако по мере роста нашего сообщества мы постоянно слышали о некоторых ограничениях нашего SDK v1:</p>
<p><strong>"Обработка высокого параллелизма слишком сложна".</strong> Отсутствие встроенной поддержки async в SDK для некоторых языков вынуждало разработчиков полагаться на потоки или обратные вызовы, что усложняло управление и отладку кода, особенно в таких сценариях, как пакетная загрузка данных и параллельные запросы.</p>
<p><strong>"Производительность снижается с ростом масштаба".</strong> Без кэша схем v1 неоднократно проверяла схемы во время выполнения операций, что создавало узкие места при больших объемах работы. В сценариях использования, требующих массивной векторной обработки, эта проблема приводила к увеличению задержек и снижению пропускной способности.</p>
<p><strong>"Несогласованность интерфейсов между языками создает крутую кривую обучения".</strong> SDK для разных языков реализовывали интерфейсы по-своему, что усложняло межъязыковую разработку.</p>
<p><strong>"В RESTful API отсутствуют важные функции".</strong> Такие важные функции, как управление разделами и построение индексов, были недоступны, что вынуждало разработчиков переключаться между различными SDK.</p>
<p>Это были не просто пожелания к функциям - это были реальные препятствия в рабочем процессе разработки. SDK v2 - это наше обещание устранить эти барьеры и позволить вам сосредоточиться на главном: создании потрясающих приложений для искусственного интеллекта.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">Решение: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 - это результат полного редизайна, сфокусированного на удобстве разработчиков, доступный на нескольких языках:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Нативная поддержка асинхронности: От сложного к параллельному</h3><p>Старый способ обработки параллелизма включал в себя громоздкие объекты Future и шаблоны обратного вызова. В SDK v2 появилась настоящая асинхронная/ожидающая функциональность, особенно в Python с <code translate="no">AsyncMilvusClient</code> (начиная с версии 2.5.3). С теми же параметрами, что и в синхронном MilvusClient, вы можете легко выполнять такие операции, как вставка, запрос и поиск параллельно.</p>
<p>Этот упрощенный подход заменяет старые громоздкие шаблоны Future и callback, что приводит к более чистому и эффективному коду. Сложная параллельная логика, например, пакетная вставка векторов или параллельные мультизапросы, теперь может быть легко реализована с помощью таких инструментов, как <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Кэш схем: Повышение производительности там, где это важно</h3><p>В SDK v2 появился кэш схем, который сохраняет схемы коллекций локально после первоначальной выборки, устраняя повторные сетевые запросы и накладные расходы процессора во время операций.</p>
<p>Для сценариев высокочастотной вставки и запросов это обновление означает:</p>
<ul>
<li><p>Сокращение сетевого трафика между клиентом и сервером</p></li>
<li><p>Снижение задержки при выполнении операций</p></li>
<li><p>Снижение нагрузки на процессор на стороне сервера</p></li>
<li><p>Лучшее масштабирование при высоком параллелизме.</p></li>
</ul>
<p>Это особенно важно для таких приложений, как рекомендательные системы реального времени или функции живого поиска, где важны миллисекунды.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Унифицированный и оптимизированный интерфейс API</h3><p>Milvus SDK v2 представляет унифицированный и более полный опыт работы с API на всех поддерживаемых языках программирования. В частности, RESTful API был значительно усовершенствован и теперь практически не уступает по возможностям интерфейсу gRPC.</p>
<p>В предыдущих версиях RESTful API отставал от gRPC, ограничивая возможности разработчиков без смены интерфейсов. Теперь это уже не так. Теперь разработчики могут использовать RESTful API для выполнения практически всех основных операций, таких как создание коллекций, управление разделами, построение индексов и выполнение запросов, не прибегая к gRPC или другим методам.</p>
<p>Такой унифицированный подход обеспечивает согласованность действий разработчиков в различных средах и случаях использования. Он сокращает время обучения, упрощает интеграцию и повышает общее удобство использования.</p>
<p>Примечание: Для большинства пользователей RESTful API - это более быстрый и простой способ начать работу с Milvus. Однако если вашему приложению требуется высокая производительность или расширенные функции, такие как итераторы, клиент gRPC остается лучшим вариантом для максимальной гибкости и контроля.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Согласованный дизайн SDK для всех языков</h3><p>В Milvus SDK v2 мы стандартизировали дизайн наших SDK для всех поддерживаемых языков программирования, чтобы обеспечить более последовательную работу разработчиков.</p>
<p>Независимо от того, создаете ли вы продукт на Python, Java, Go или Node.js, каждый SDK теперь имеет единую структуру, в центре которой находится класс MilvusClient. Этот редизайн обеспечивает согласованное именование методов, форматирование параметров и общие шаблоны использования для всех поддерживаемых нами языков. (См.: <a href="https://github.com/milvus-io/milvus/discussions/33979">Обновление примера кода MilvusClient SDK - обсуждение на GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Теперь, познакомившись с Milvus на одном языке, вы сможете легко перейти на другой без необходимости заново изучать работу SDK. Такое согласование не только упрощает процесс освоения, но и делает мультиязычную разработку гораздо более плавной и интуитивно понятной.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Более простой и умный PyMilvus (Python SDK) с <code translate="no">MilvusClient</code></h3><p>В предыдущей версии PyMilvus опирался на конструкцию в стиле ORM, которая представляла собой смесь объектно-ориентированного и процедурного подходов. Разработчикам приходилось определять объекты <code translate="no">FieldSchema</code>, создавать <code translate="no">CollectionSchema</code>, а затем инстанцировать класс <code translate="no">Collection</code> - и все это только для того, чтобы создать коллекцию. Этот процесс был не только многословным, но и более сложным в освоении для новых пользователей.</p>
<p>С новым интерфейсом <code translate="no">MilvusClient</code> все стало намного проще. Теперь вы можете создать коллекцию за один шаг, используя метод <code translate="no">create_collection()</code>. Он позволяет быстро определить схему, передавая такие параметры, как <code translate="no">dimension</code> и <code translate="no">metric_type</code>, или же вы можете использовать пользовательский объект схемы, если это необходимо.</p>
<p>Что еще лучше, <code translate="no">create_collection()</code> поддерживает создание индекса в рамках того же вызова. Если указаны параметры индекса, Milvus автоматически создаст индекс и загрузит данные в память - нет необходимости в отдельных вызовах <code translate="no">create_index()</code> или <code translate="no">load()</code>. Все делается одним методом: <em>создание коллекции → построение индекса → загрузка коллекции.</em></p>
<p>Такой оптимизированный подход снижает сложность настройки и значительно упрощает начало работы с Milvus, особенно для разработчиков, которым нужен быстрый и эффективный путь к созданию прототипа или производству.</p>
<p>Новый модуль <code translate="no">MilvusClient</code> предлагает очевидные преимущества в удобстве использования, согласованности и производительности. Хотя старый интерфейс ORM пока остается доступным, мы планируем отказаться от него в будущем (см. <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">ссылку</a>). Мы настоятельно рекомендуем перейти на новый SDK, чтобы воспользоваться всеми преимуществами улучшений.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Более понятная и полная документация</h3><p>Мы изменили структуру документации по продукту, чтобы предоставить более полный и понятный <a href="https://milvus.io/docs">справочник по API</a>. Наши руководства пользователя теперь включают примеры кода на разных языках, что позволит вам быстро начать работу и легко понять возможности Milvus. Кроме того, помощник Ask AI, доступный на нашем сайте документации, может рассказать о новых функциях, объяснить внутренние механизмы и даже помочь сгенерировать или модифицировать код примера, делая ваше путешествие по документации более плавным и приятным.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP Server: Создан для будущего интеграции ИИ</h3><p><a href="https://github.com/zilliztech/mcp-server-milvus">Сервер MCP Server</a>, построенный на базе Milvus SDK, - это наш ответ на растущую потребность в экосистеме ИИ: бесшовная интеграция между большими языковыми моделями<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">векторными базами данных</a> и внешними инструментами или источниками данных. Он реализует протокол Model Context Protocol (MCP), обеспечивая единый и интеллектуальный интерфейс для организации работы Milvus и не только.</p>
<p>По мере того как <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">агенты искусственного интеллекта</a> становятся все более способными - не только генерировать код, но и автономно управлять внутренними сервисами, - растет спрос на более интеллектуальную инфраструктуру, управляемую API. Сервер MCP был разработан с учетом этого будущего. Он обеспечивает интеллектуальное и автоматизированное взаимодействие с кластерами Milvus, упрощая такие задачи, как развертывание, обслуживание и управление данными.</p>
<p>Что еще более важно, он закладывает основу для нового вида межмашинного взаимодействия. С помощью MCP Server агенты ИИ могут вызывать API для динамического создания коллекций, выполнения запросов, построения индексов и многого другого - и все это без участия человека.</p>
<p>Одним словом, MCP Server превращает Milvus не просто в базу данных, а в полностью программируемый, готовый к работе с искусственным интеллектом бэкэнд, открывающий путь к созданию интеллектуальных, автономных и масштабируемых приложений.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Начало работы с Milvus SDK v2: Примеры кода<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Приведенные ниже примеры показывают, как использовать новый интерфейс PyMilvus (Python SDK v2) для создания коллекции и выполнения асинхронных операций. По сравнению с подходом в стиле ORM в предыдущей версии, этот код чище, последовательнее и проще в работе.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Создание коллекции, определение схем, построение индексов и загрузка данных с помощью <code translate="no">MilvusClient</code></h3><p>Приведенный ниже фрагмент кода на языке Python демонстрирует, как создать коллекцию, определить ее схему, построить индексы и загрузить данные - и все это за один вызов:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Параметр <code translate="no">index_params</code> метода <code translate="no">create_collection</code> устраняет необходимость в отдельных вызовах <code translate="no">create_index</code> и <code translate="no">load_collection</code>- все происходит автоматически.</p>
<p>Кроме того, <code translate="no">MilvusClient</code> поддерживает режим быстрого создания таблиц. Например, коллекцию можно создать в одной строке кода, указав только необходимые параметры:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Сравнительное замечание: в старом подходе ORM нужно было создать <code translate="no">Collection(schema)</code>, затем отдельно вызвать <code translate="no">collection.create_index()</code> и <code translate="no">collection.load()</code>; теперь MilvusClient упрощает весь процесс).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Выполнение асинхронных вставок с высоким параллелизмом <code translate="no">AsyncMilvusClient</code></h3><p>В следующем примере показано, как использовать <code translate="no">AsyncMilvusClient</code> для выполнения параллельных операций вставки с помощью <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>В этом примере <code translate="no">AsyncMilvusClient</code> используется для одновременной вставки данных путем планирования нескольких задач вставки с помощью <code translate="no">asyncio.gather</code>. Этот подход в полной мере использует возможности бэкенда Milvus по одновременной обработке данных. В отличие от синхронной, построчной вставки в версии 1, эта встроенная асинхронная поддержка значительно увеличивает пропускную способность.</p>
<p>Аналогичным образом можно модифицировать код для выполнения параллельных запросов или поиска - например, заменив вызов insert на <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. Асинхронный интерфейс Milvus SDK v2 гарантирует, что каждый запрос будет выполняться неблокируемым образом, полностью используя ресурсы клиента и сервера.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Легкая миграция<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы знаем, что вы потратили время на SDK v1, поэтому мы разработали SDK v2 с учетом особенностей ваших существующих приложений. SDK v2 включает обратную совместимость, поэтому существующие интерфейсы в стиле v1/ORM будут работать еще некоторое время. Но мы настоятельно рекомендуем перейти на SDK v2 как можно скорее - поддержка v1 закончится с выходом Milvus 3.0 (конец 2025 года).</p>
<p>Переход на SDK v2 открывает более последовательный, современный опыт разработчика с упрощенным синтаксисом, улучшенной поддержкой async и повышенной производительностью. Кроме того, все новые функции и поддержка сообщества будут сосредоточены именно на нем. Обновление сейчас гарантирует, что вы готовы к тому, что будет дальше, и дает вам доступ к лучшему, что может предложить Milvus.</p>
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
    </button></h2><p>Milvus SDK v2 значительно улучшен по сравнению с v1: повышена производительность, унифицирован и согласован интерфейс для различных языков программирования, а также реализована поддержка асинхронных операций, что упрощает выполнение операций с высокой конверсией. Благодаря более понятной документации и интуитивно понятным примерам кода Milvus SDK v2 призван оптимизировать процесс разработки, упрощая и ускоряя создание и развертывание приложений искусственного интеллекта.</p>
<p>Для получения более подробной информации, пожалуйста, обратитесь к нашим последним официальным <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">справочникам и руководствам пользователя по API</a>. Если у вас есть вопросы или предложения по новому SDK, не стесняйтесь оставлять отзывы на <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> и <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Мы с нетерпением ждем вашего вклада в дальнейшее совершенствование Milvus.</p>
