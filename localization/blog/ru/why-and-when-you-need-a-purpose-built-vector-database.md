---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: Зачем и когда вам нужна специально разработанная база данных векторов?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  В этом посте представлен обзор векторного поиска и его функционирования,
  сравнение различных технологий векторного поиска и объяснение того, почему
  выбор специально созданной базы данных векторов имеет решающее значение.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Эта статья была первоначально опубликована на сайте <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> и публикуется здесь с разрешения автора.</em></p>
<p>Растущая популярность <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> и других больших языковых моделей (LLM) способствовала развитию технологий векторного поиска, включая специально созданные векторные базы данных, такие как <a href="https://milvus.io/docs/overview.md">Milvus</a> и <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, библиотеки векторного поиска, такие как <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, и плагины векторного поиска, интегрированные с традиционными базами данных. Однако выбор наилучшего решения для ваших нужд может оказаться непростой задачей. Как при выборе между рестораном высокого класса и сетью ресторанов быстрого питания, выбор правильной технологии векторного поиска зависит от ваших потребностей и ожиданий.</p>
<p>В этой статье я расскажу о векторном поиске и его функционировании, сравню различные технологии векторного поиска и объясню, почему выбор в пользу специально созданной векторной базы данных имеет решающее значение.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">Что такое векторный поиск и как он работает?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">Векторный поиск</a>, также известный как поиск векторного сходства, - это техника извлечения топ-к результатов, которые наиболее похожи или семантически связаны с заданным вектором запроса среди обширной коллекции плотных векторных данных.</p>
<p>Перед проведением поиска по сходству мы используем нейронные сети для преобразования <a href="https://zilliz.com/blog/introduction-to-unstructured-data">неструктурированных данных</a>, таких как текст, изображения, видео и аудио, в высокоразмерные числовые векторы, называемые векторами встраивания. Например, мы можем использовать предварительно обученную конволюционную нейронную сеть ResNet-50 для преобразования изображения птицы в коллекцию вкраплений с 2 048 измерениями. Здесь мы перечислим первые три и последние три элемента вектора: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Изображение птицы от Патриса Бушара</span> </span></p>
<p>После генерации векторов вкраплений векторные поисковые системы сравнивают пространственное расстояние между вектором входного запроса и векторами в векторных хранилищах. Чем ближе они находятся в пространстве, тем более похожи.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Арифметика встраивания</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Популярные технологии векторного поиска<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>На рынке представлено множество технологий векторного поиска, включая библиотеки машинного обучения, такие как NumPy из Python, библиотеки векторного поиска, такие как FAISS, плагины векторного поиска, построенные на традиционных базах данных, и специализированные векторные базы данных, такие как Milvus и Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Библиотеки машинного обучения</h3><p>Использование библиотек машинного обучения - самый простой способ реализовать векторный поиск. Например, мы можем использовать NumPy из Python, чтобы реализовать алгоритм ближайшего соседа менее чем в 20 строках кода.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Мы можем сгенерировать 100 двумерных векторов и найти ближайшего соседа для вектора [0.5, 0.5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Библиотеки машинного обучения, такие как NumPy в Python, предлагают большую гибкость при низкой стоимости. Однако у них есть некоторые ограничения. Например, они могут обрабатывать только небольшой объем данных и не обеспечивают их сохранность.</p>
<p>Я рекомендую использовать NumPy или другие библиотеки машинного обучения для векторного поиска только в том случае, если:</p>
<ul>
<li>Вам нужно быстро создать прототип.</li>
<li>Вы не заботитесь о сохранности данных.</li>
<li>Размер ваших данных меньше миллиона, и вам не требуется скалярная фильтрация.</li>
<li>Вам не нужна высокая производительность.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Библиотеки векторного поиска</h3><p>Библиотеки векторного поиска помогут вам быстро создать высокопроизводительный прототип системы векторного поиска. Типичным примером является FAISS. Она имеет открытый исходный код и разработана компанией Meta для эффективного поиска сходства и плотной кластеризации векторов. FAISS может работать с коллекциями векторов любого размера, даже с теми, которые не могут быть полностью загружены в память. Кроме того, FAISS предлагает инструменты для оценки и настройки параметров. Несмотря на то, что FAISS написан на C++, он имеет интерфейс Python/NumPy.</p>
<p>Ниже приведен код примера векторного поиска на основе FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Библиотеки векторного поиска, такие как FAISS, просты в использовании и достаточно быстры для работы с небольшими производственными средами с миллионами векторов. Вы можете повысить производительность запросов, используя квантование и графические процессоры, а также уменьшив размерность данных.</p>
<p>Однако у этих библиотек есть некоторые ограничения при использовании в производстве. Например, FAISS не поддерживает добавление и удаление данных в реальном времени, удаленные вызовы, несколько языков, скалярную фильтрацию, масштабируемость и аварийное восстановление.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Различные типы векторных баз данных</h3><p>Векторные базы данных появились, чтобы устранить ограничения вышеупомянутых библиотек, обеспечивая более комплексное и практичное решение для производственных приложений.</p>
<p>На поле боя доступны четыре типа векторных баз данных:</p>
<ul>
<li>Существующие реляционные или колоночные базы данных, в которые встроен плагин векторного поиска. Примером может служить PG Vector.</li>
<li>Традиционные поисковые системы с инвертированным индексом и поддержкой плотного векторного индексирования. Примером может служить <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a>.</li>
<li>Легкие векторные базы данных, построенные на основе библиотек векторного поиска. Пример - Chroma.</li>
<li><strong>Целевые векторные базы данных</strong>. Этот тип баз данных специально разработан и оптимизирован для векторного поиска снизу вверх. Векторные базы данных целевого назначения обычно предлагают более продвинутые функции, включая распределенные вычисления, аварийное восстановление и сохранение данных. В качестве примера можно привести <a href="https://zilliz.com/what-is-milvus">Milvus</a>.</li>
</ul>
<p>Не все векторные базы данных созданы одинаковыми. Каждый стек обладает уникальными преимуществами и ограничениями, что делает их более или менее подходящими для различных приложений.</p>
<p>Я предпочитаю специализированные векторные базы данных другим решениям, поскольку они являются наиболее эффективным и удобным вариантом, предлагающим множество уникальных преимуществ. В следующих разделах я использую Milvus в качестве примера, чтобы объяснить причины моего предпочтения.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Ключевые преимущества специально созданных векторных баз данных<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> - это распределенная специализированная векторная база данных с открытым исходным кодом, которая может хранить, индексировать, управлять и извлекать миллиарды векторов встраивания. Это также одна из самых популярных векторных баз данных для <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">расширенной генерации LLM-поиска</a>. Являясь образцовым примером специально созданных векторных баз данных, Milvus обладает многими уникальными преимуществами по сравнению со своими аналогами.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Постоянство данных и экономически эффективное хранение</h3><p>Хотя предотвращение потери данных является минимальным требованием к базе данных, многие одномашинные и легкие векторные базы данных не ставят во главу угла надежность данных. В отличие от них, в специально созданных распределенных векторных базах данных, таких как <a href="https://zilliz.com/what-is-milvus">Milvus</a>, приоритетом является устойчивость системы, масштабируемость и сохранение данных за счет разделения хранения и вычислений.</p>
<p>Более того, большинство векторных баз данных, использующих индексы приближенных ближайших соседей (ANN), нуждаются в большом количестве памяти для выполнения векторного поиска, поскольку они загружают индексы ANN исключительно в память. Однако Milvus поддерживает дисковые индексы, что делает их хранение более чем в десять раз более экономичным, чем индексы в памяти.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Оптимальная производительность запросов</h3><p>Специализированная векторная база данных обеспечивает оптимальную производительность запросов по сравнению с другими вариантами векторного поиска. Например, Milvus в десять раз быстрее обрабатывает запросы, чем плагины векторного поиска. Milvus использует <a href="https://zilliz.com/glossary/anns">алгоритм ANN</a> вместо алгоритма брутального поиска KNN для более быстрого поиска векторов. Кроме того, он разбивает свои индексы на части, сокращая время создания индекса при увеличении объема данных. Такой подход позволяет Milvus легко обрабатывать миллиарды векторов с добавлением и удалением данных в режиме реального времени. В отличие от этого, другие дополнения для векторного поиска подходят только для сценариев с количеством данных менее десятков миллионов и нечастыми добавлениями и удалениями.</p>
<p>Milvus также поддерживает GPU-ускорение. Внутреннее тестирование показало, что векторное индексирование с GPU-ускорением может достигать 10 000+ QPS при поиске десятков миллионов данных, что как минимум в десять раз быстрее традиционного индексирования на CPU при выполнении запросов одной машиной.</p>
<h3 id="System-Reliability" class="common-anchor-header">Надежность системы</h3><p>Многие приложения используют векторные базы данных для онлайн-запросов, требующих низкой задержки запросов и высокой пропускной способности. Эти приложения требуют отказоустойчивости одной машины на минутном уровне, а некоторые даже требуют межрегионального аварийного восстановления для критических сценариев. Традиционные стратегии репликации на основе Raft/Paxos страдают от серьезных потерь ресурсов и нуждаются в помощи для предварительной сортировки данных, что приводит к низкой надежности. В отличие от них, Milvus имеет распределенную архитектуру, использующую очереди сообщений K8s для обеспечения высокой доступности, что сокращает время восстановления и экономит ресурсы.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Работоспособность и наблюдаемость</h3><p>Чтобы лучше обслуживать корпоративных пользователей, векторные базы данных должны предлагать ряд функций корпоративного уровня для лучшей работоспособности и наблюдаемости. Milvus поддерживает различные методы развертывания, включая K8s Operator и Helm chart, docker-compose и pip install, что делает его доступным для пользователей с различными потребностями. Milvus также предоставляет систему мониторинга и оповещения на основе Grafana, Prometheus и Loki, что повышает его наблюдаемость. Благодаря распределенной облачной нативной архитектуре Milvus - первая в отрасли векторная база данных, поддерживающая многопользовательскую изоляцию, RBAC, ограничение квот и скользящие обновления. Все эти подходы значительно упрощают управление и мониторинг Milvus.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Начало работы с Milvus за 3 простых шага в течение 10 минут<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Создание векторной базы данных - сложная задача, но ее использование так же просто, как использование Numpy и FAISS. Даже студенты, не знакомые с искусственным интеллектом, могут реализовать векторный поиск на базе Milvus всего за десять минут. Чтобы воспользоваться высокомасштабируемыми и высокопроизводительными сервисами векторного поиска, выполните следующие три шага:</p>
<ul>
<li>Разверните Milvus на своем сервере с помощью <a href="https://milvus.io/docs/install_standalone-docker.md">документа по развертыванию Milvus</a>.</li>
<li>Реализуйте векторный поиск с помощью всего 50 строк кода, обратившись к <a href="https://milvus.io/docs/example_code.md">документу Hello Milvus</a>.</li>
<li>Изучите <a href="https://github.com/towhee-io/examples/">примеры документов Towhee</a>, чтобы получить представление о популярных <a href="https://zilliz.com/use-cases">случаях использования векторных баз данных</a>.</li>
</ul>
