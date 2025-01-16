---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Сравнение векторных баз данных, библиотек векторного поиска и плагинов
  векторного поиска
author: Frank Liu
date: 2023-11-9
desc: >-
  В этом посте мы продолжим исследовать запутанную сферу векторного поиска,
  сравнивая векторные базы данных, плагины для векторного поиска и библиотеки
  векторного поиска.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Привет - добро пожаловать на "Векторные базы данных 101"!</p>
<p>Всплеск популярности <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> и других больших языковых моделей (LLM) привел к росту технологий векторного поиска, включающих специализированные векторные базы данных, такие как <a href="https://zilliz.com/what-is-milvus">Milvus</a> и <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, наряду с библиотеками, такими как <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, и интегрированными плагинами векторного поиска в обычных базах данных.</p>
<p>В <a href="https://zilliz.com/learn/what-is-vector-database">предыдущей статье</a> мы рассмотрели основы векторных баз данных. В этом посте мы продолжим исследовать сложную сферу векторного поиска, сравнивая векторные базы данных, плагины векторного поиска и библиотеки векторного поиска.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">Что такое векторный поиск?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">Векторный поиск</a>, также известный как поиск векторного сходства, - это техника извлечения топ-к результатов, которые наиболее похожи или семантически связаны с заданным вектором запроса среди обширной коллекции плотных векторных данных. Перед проведением поиска по сходству мы используем нейронные сети для преобразования <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированных данных</a>, таких как текст, изображения, видео и аудио, в высокоразмерные числовые векторы, называемые векторами встраивания. После создания векторов встраивания векторные поисковые системы сравнивают пространственное расстояние между вектором запроса и векторами в векторных хранилищах. Чем ближе они находятся в пространстве, тем более похожи.</p>
<p>На рынке представлено множество технологий векторного поиска, включая библиотеки машинного обучения, такие как NumPy в Python, библиотеки векторного поиска, такие как FAISS, плагины векторного поиска, построенные на традиционных базах данных, и специализированные векторные базы данных, такие как Milvus и Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Векторные базы данных и библиотеки векторного поиска<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">Специализированные векторные базы данных</a> - не единственный способ поиска сходства. До появления векторных баз данных для векторного поиска использовалось множество библиотек векторного поиска, таких как FAISS, ScaNN и HNSW.</p>
<p>Библиотеки векторного поиска могут помочь вам быстро создать высокопроизводительный прототип системы векторного поиска. В качестве примера можно привести FAISS, разработанную компанией Meta с открытым исходным кодом и предназначенную для эффективного поиска сходства и плотной кластеризации векторов. FAISS может работать с коллекциями векторов любого размера, даже с теми, которые не могут быть полностью загружены в память. Кроме того, FAISS предлагает инструменты для оценки и настройки параметров. Несмотря на то, что FAISS написана на C++, она имеет интерфейс Python/NumPy.</p>
<p>Однако библиотеки векторного поиска - это всего лишь облегченные библиотеки ANN, а не управляемые решения, и они имеют ограниченную функциональность. Если ваш набор данных невелик и ограничен, этих библиотек может быть достаточно для обработки неструктурированных данных, даже для систем, работающих в производстве. Однако по мере увеличения объема массива данных и привлечения большего числа пользователей проблему масштабирования становится все сложнее решить. Кроме того, они не позволяют вносить изменения в индексные данные и не могут быть запрошены при импорте данных.</p>
<p>Векторные базы данных, напротив, являются более оптимальным решением для хранения и поиска неструктурированных данных. Они могут хранить и запрашивать миллионы и даже миллиарды векторов, одновременно предоставляя ответы в режиме реального времени, и обладают высокой масштабируемостью для удовлетворения растущих бизнес-потребностей пользователей.</p>
<p>Кроме того, векторные базы данных, такие как Milvus, обладают гораздо более удобными функциями для структурированных/полуструктурированных данных: облачность, многопользовательскость, масштабируемость и т. д. Эти особенности станут понятны по мере углубления в этот учебник.</p>
<p>Кроме того, они работают на совершенно другом уровне абстракции, чем библиотеки векторного поиска - векторные базы данных являются полноценными сервисами, в то время как библиотеки ANN предназначены для интеграции в разрабатываемое вами приложение. В этом смысле библиотеки ANN - это один из многих компонентов, на которых строятся векторные базы данных, подобно тому, как Elasticsearch строится на Apache Lucene.</p>
<p>В качестве примера того, почему эта абстракция так важна, давайте рассмотрим вставку нового элемента неструктурированных данных в векторную базу данных. Это очень просто в Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>Это действительно так просто - 3 строки кода. В таких библиотеках, как FAISS или ScaNN, к сожалению, нет простого способа сделать это, не пересоздавая вручную весь индекс в определенные контрольные точки. Даже если бы это было возможно, библиотекам векторного поиска все равно не хватает масштабируемости и многопользовательскости - двух наиболее важных характеристик векторных баз данных.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Векторные базы данных в сравнении с плагинами векторного поиска для традиционных баз данных<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Отлично, теперь, когда мы определили разницу между библиотеками векторного поиска и векторными базами данных, давайте рассмотрим, чем векторные базы данных отличаются от <strong>плагинов векторного поиска</strong>.</p>
<p>Все большее количество традиционных реляционных баз данных и поисковых систем, таких как Clickhouse и <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>, включают в себя встроенные плагины векторного поиска. Elasticsearch 8.0, например, включает функции вставки векторов и поиска ANN, которые можно вызывать через конечные точки restful API. Проблема с плагинами векторного поиска должна быть ясна как день и ночь - <strong>эти решения не используют полностековый подход к управлению встраиванием и векторному поиску</strong>. Вместо этого плагины предназначены для расширения существующих архитектур, что делает их ограниченными и неоптимизированными. Разработка приложения для работы с неструктурированными данными на базе традиционной базы данных похожа на попытку вместить литиевые батареи и электромоторы в раму автомобиля, работающего на бензине, - не самая лучшая идея!</p>
<p>Чтобы проиллюстрировать, почему это так, давайте вернемся к списку функций, которые должны быть реализованы в векторной базе данных (из первого раздела). Плагинам для векторного поиска не хватает двух из этих функций - настраиваемости и удобных API/SDK. Я продолжу использовать движок ANN от Elasticsearch в качестве примера; другие плагины для векторного поиска работают очень похоже, поэтому я не буду слишком углубляться в детали. Elasticsearch поддерживает хранение векторов через тип поля данных <code translate="no">dense_vector</code> и позволяет выполнять запросы через <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Плагин ANN в Elasticsearch поддерживает только один алгоритм индексирования: Hierarchical Navigable Small Worlds, также известный как HNSW (мне нравится думать, что его создатель опередил Marvel, когда речь зашла о популяризации мультивселенной). Кроме того, в качестве метрики расстояния поддерживается только L2/евклидово расстояние. Это неплохое начало, но давайте сравним его с Milvus, полноценной векторной базой данных. Использование <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Хотя и <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch, и Milvus</a> имеют методы для создания индексов, вставки векторов встраивания и поиска ближайших соседей, из этих примеров ясно, что Milvus имеет более интуитивный API для векторного поиска (лучший пользовательский API) и более широкую поддержку векторных индексов + метрик расстояния (лучшая настраиваемость). В будущем Milvus также планирует поддерживать больше векторных индексов и разрешить запросы с помощью SQL-подобных операторов, что еще больше улучшит как настраиваемость, так и удобство использования.</p>
<p>Мы только что пропустили через себя довольно много контента. Этот раздел получился довольно длинным, поэтому для тех, кто пропустил его, вот краткое содержание: Milvus лучше плагинов для векторного поиска, потому что Milvus был создан с нуля как векторная база данных, что позволяет использовать более богатый набор функций и архитектуру, более подходящую для неструктурированных данных.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Как выбрать из различных технологий векторного поиска?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Не все векторные базы данных созданы одинаковыми; каждая из них обладает уникальными характеристиками, которые подходят для конкретных приложений. Библиотеки и плагины для векторного поиска удобны в использовании и идеально подходят для работы с небольшими производственными средами с миллионами векторов. Если объем ваших данных невелик и вам требуется лишь базовая функциональность векторного поиска, этих технологий вполне достаточно для вашего бизнеса.</p>
<p>Однако для предприятий с большим объемом данных, работающих с сотнями миллионов векторов и требующих отклика в режиме реального времени, лучше использовать специализированную векторную базу данных. Например, Milvus легко управляет миллиардами векторов, обеспечивая молниеносную скорость запросов и богатую функциональность. Более того, полностью управляемые решения, такие как Zilliz, оказываются еще более выгодными, освобождая вас от операционных проблем и позволяя сосредоточиться исключительно на основной деятельности.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Ознакомьтесь еще раз с курсами Vector Database 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Введение в неструктурированные данные</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">Что такое векторная база данных?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Сравнение векторных баз данных, библиотек векторного поиска и плагинов векторного поиска</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Введение в Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Быстрый старт Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Введение в векторный поиск по сходству</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Основы векторного индекса и инвертированный файловый индекс</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Скалярное квантование и квантование по продукту</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Иерархические перемещаемые малые миры (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Приближенные ближайшие соседи О да (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Выбор правильного векторного индекса для вашего проекта</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN и алгоритм Вамана</a></li>
</ol>
