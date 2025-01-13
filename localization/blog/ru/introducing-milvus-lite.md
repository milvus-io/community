---
id: introducing-milvus-lite.md
title: >-
  Представляем Milvus Lite: Начните создавать приложение GenAI за считанные
  секунды
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы рады представить <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, легковесную векторную базу данных, которая запускается локально в вашем приложении на Python. Основанная на популярной векторной базе данных <a href="https://milvus.io/intro">Milvus</a> с открытым исходным кодом, Milvus Lite повторно использует основные компоненты для индексации векторов и разбора запросов, удаляя при этом элементы, предназначенные для высокой масштабируемости в распределенных системах. Благодаря этому компактное и эффективное решение идеально подходит для сред с ограниченными вычислительными ресурсами, таких как ноутбуки, Jupyter Notebooks, а также мобильные или граничные устройства.</p>
<p>Milvus Lite интегрируется с различными стеками разработки ИИ, такими как LangChain и LlamaIndex, позволяя использовать его в качестве векторного хранилища в конвейерах Retrieval Augmented Generation (RAG) без необходимости настройки сервера. Просто запустите <code translate="no">pip install pymilvus</code> (версия 2.4.3 или выше), чтобы включить его в ваше AI-приложение в качестве библиотеки Python.</p>
<p>Milvus Lite разделяет API Milvus, гарантируя, что ваш клиентский код будет работать как для небольших локальных развертываний, так и для серверов Milvus, развернутых на Docker или Kubernetes с миллиардами векторов.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Почему мы создали Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Многим приложениям искусственного интеллекта требуется векторный поиск неструктурированных данных, включая текст, изображения, голоса и видео, для таких приложений, как чат-боты и торговые ассистенты. Векторные базы данных предназначены для хранения и поиска векторных вкраплений и являются важной частью стека разработки ИИ, особенно для генеративного ИИ, такого как <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Несмотря на наличие множества решений для поиска векторов, не хватало простого в запуске варианта, который также работал бы для крупномасштабных производственных развертываний. Как создатели Milvus, мы разработали Milvus Lite, чтобы помочь разработчикам ИИ быстрее создавать приложения, обеспечивая при этом согласованную работу в различных вариантах развертывания, включая Milvus на Kubernetes, Docker и управляемые облачные сервисы.</p>
<p>Milvus Lite является важным дополнением к нашему набору предложений в экосистеме Milvus. Он предоставляет разработчикам универсальный инструмент, поддерживающий все этапы разработки. От прототипирования до производственных сред, от вычислений на границе до крупномасштабных развертываний - Milvus теперь единственная векторная база данных, которая охватывает сценарии использования любого размера и на всех этапах разработки.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Принцип работы Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite поддерживает все основные операции, доступные в Milvus, такие как создание коллекций, вставка, поиск и удаление векторов. Вскоре он будет поддерживать расширенные возможности, такие как гибридный поиск. Milvus Lite загружает данные в память для эффективного поиска и сохраняет их в виде файла SQLite.</p>
<p>Milvus Lite включен в <a href="https://github.com/milvus-io/pymilvus">Python SDK Milvus</a> и может быть развернут с помощью простого <code translate="no">pip install pymilvus</code>. Следующий фрагмент кода демонстрирует, как настроить векторную базу данных с помощью Milvus Lite, указав имя локального файла и создав новую коллекцию. Для тех, кто знаком с Milvus API, единственное отличие заключается в том, что <code translate="no">uri</code> ссылается на локальное имя файла, а не на конечную точку сети, например, <code translate="no">&quot;milvus_demo.db&quot;</code> вместо <code translate="no">&quot;http://localhost:19530&quot;</code> для сервера Milvus. Все остальное остается неизменным. Milvus Lite также поддерживает хранение необработанного текста и других меток в качестве метаданных, используя динамическую или явно определенную схему, как показано ниже.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Для масштабируемости ИИ-приложение, разработанное с помощью Milvus Lite, может легко перейти к использованию Milvus, развернутого в Docker или Kubernetes, просто указав <code translate="no">uri</code> в качестве конечной точки сервера.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Интеграция со стеком разработки ИИ<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Помимо того, что Milvus Lite упрощает работу с векторным поиском, Milvus также интегрируется со многими фреймворками и поставщиками стека разработки ИИ, включая <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> и <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Благодаря обширному инструментарию и сервисам эти интеграции упрощают разработку приложений ИИ с возможностью векторного поиска.</p>
<p>И это только начало - в скором времени появится еще много интересных интеграций! Следите за новостями!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Другие ресурсы и примеры<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Изучите <a href="https://milvus.io/docs/quickstart.md">документацию Milvus quickstart</a>, чтобы найти подробные руководства и примеры кода по использованию Milvus Lite для создания приложений ИИ, таких как Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) и <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">поиск изображений</a>.</p>
<p>Milvus Lite - это проект с открытым исходным кодом, и мы приветствуем ваш вклад. Ознакомьтесь с нашим <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">руководством по внесению вклада</a>, чтобы начать работу. Вы также можете сообщить об ошибках или запросить возможности, создав проблему в репозитории <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite на GitHub</a>.</p>
