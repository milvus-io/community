---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Векторное сжатие в экстремальных условиях: как Milvus обслуживает в 3 раза
  больше запросов с помощью RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Узнайте, как Milvus использует RaBitQ для повышения эффективности векторного
  поиска, сокращения затрат памяти при сохранении точности. Научитесь
  оптимизировать свои решения в области искусственного интеллекта уже сегодня!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> - это высокомасштабируемая векторная база данных с открытым исходным кодом, обеспечивающая семантический поиск в масштабе миллиарда векторов. По мере того как пользователи внедряют чат-боты RAG, искусственный интеллект для обслуживания клиентов и визуальный поиск в таких масштабах, возникает общая проблема: <strong>затраты на инфраструктуру.</strong> Экспоненциальный рост бизнеса, напротив, захватывает, а стремительно растущие счета за облачные услуги - нет. Быстрый векторный поиск обычно требует хранения векторов в памяти, а это дорого. Естественно, возникает вопрос: <em>можно ли сжать векторы, чтобы сэкономить место без ущерба для качества поиска?</em></p>
<p>Ответ - <strong>ДА</strong>, и в этом блоге мы покажем вам, как применение новой техники под названием <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> позволяет Milvus обслуживать в 3 раза больше трафика при меньших затратах памяти, сохраняя при этом сопоставимую точность. Мы также поделимся практическими уроками, полученными при интеграции RaBitQ в Milvus с открытым исходным кодом и в полностью управляемый сервис Milvus на <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Понимание векторного поиска и сжатия<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем погрузиться в RaBitQ, давайте разберемся в сути проблемы.</p>
<p>Алгоритмы поиска<a href="https://zilliz.com/glossary/anns"><strong>ближайших соседей (ANN)</strong></a> лежат в основе векторной базы данных, находя топ-к векторов, наиболее близких к заданному запросу. Вектор - это координата в высокоразмерном пространстве, часто состоящая из сотен чисел с плавающей точкой. При увеличении объема векторных данных возрастают требования к хранению и вычислениям. Например, для работы <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (алгоритма поиска ANN) с одним миллиардом 768-мерных векторов в FP32 требуется более 3 ТБ памяти!</p>
<p>Как MP3 сжимает звук, отбрасывая частоты, незаметные для человеческого уха, так и векторные данные могут быть сжаты с минимальным влиянием на точность поиска. Исследования показывают, что для ANN часто нет необходимости использовать FP32 с полной точностью.<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> Скалярная квантование (SQ</a> ), популярная техника сжатия, отображает значения с плавающей точкой в дискретные бины и сохраняет только индексы бинов, используя целые числа с низким битным значением. Методы квантования значительно сокращают потребление памяти за счет представления той же информации меньшим количеством битов. Исследования в этой области направлены на достижение наибольшей экономии при наименьшей потере точности.</p>
<p>Самая экстремальная техника сжатия - 1-битная скалярная квантизация, также известная как <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">двоичная квантизация - представляет</a>каждый поплавок одним битом. По сравнению с FP32 (32-битное кодирование) это сокращает использование памяти на 32×. Поскольку память часто является основным узким местом в векторном поиске, такое сжатие может значительно повысить производительность. <strong>Однако проблема заключается в сохранении точности поиска.</strong> Как правило, 1-битный SQ снижает точность поиска до уровня менее 70 %, что делает его практически непригодным для использования.</p>
<p>Именно здесь и проявляет себя <strong>RaBitQ</strong> - превосходная техника сжатия, позволяющая достичь 1-битного квантования при сохранении высокой точности поиска. Milvus теперь поддерживает RaBitQ, начиная с версии 2.6, что позволяет векторной базе данных обслуживать в 3 раза больше QPS при сохранении сопоставимого уровня точности.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Краткое введение в RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> - это интеллектуально разработанный метод двоичного квантования, который использует геометрические свойства высокоразмерного пространства для достижения эффективного и точного сжатия векторов.</p>
<p>На первый взгляд, сокращение каждого измерения вектора до одного бита может показаться слишком агрессивным, но в высокоразмерном пространстве наша интуиция часто нас подводит. Как<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> показал</a> Цзяньян Гао, автор RaBitQ, высокоразмерные векторы обладают тем свойством, что отдельные координаты имеют тенденцию быть плотно сконцентрированными вокруг нуля, что является результатом контринтуитивного явления, описанного в книге<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> "Концентрация меры"</a>. Это позволяет отказаться от большей части исходной точности, сохранив при этом относительную структуру, необходимую для точного поиска ближайших соседей.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: Контринтуитивное распределение значений в высокоразмерной геометрии. <em>Рассмотрим значение первого измерения для случайного единичного вектора, равномерно отобранного из единичной сферы; значения равномерно распределены в трехмерном пространстве. Однако в высокоразмерном пространстве (например, 1000D) значения концентрируются вокруг нуля, что является неинтуитивным свойством высокоразмерной геометрии. (Источник изображения: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Квантование в контринтуитивном высокоразмерном пространстве</a>)</em></p>
<p>Вдохновленный этим свойством высокоразмерного пространства, <strong>RaBitQ фокусируется на кодировании угловой информации, а не точных пространственных координат</strong>. Для этого он нормирует каждый вектор данных относительно опорной точки, например центроида набора данных. Затем каждый вектор сопоставляется с ближайшей к нему вершиной гиперкуба, что позволяет представлять данные всего с 1 битом на измерение. Этот подход естественным образом распространяется на <code translate="no">IVF_RABITQ</code>, где нормализация выполняется относительно ближайшего центроида кластера, что повышает точность локального кодирования.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Сжатие вектора путем нахождения его ближайшего приближения на гиперкубе, так что каждое измерение может быть представлено всего 1 битом. (Источник изображения:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional Space</em></a><em>)</em></p>
<p>Чтобы поиск оставался надежным даже при таком сжатом представлении, RaBitQ вводит <strong>теоретически обоснованный несмещенный оценщик</strong> расстояния между вектором запроса и двоично квантованными векторами документов. Это позволяет минимизировать ошибку реконструкции и поддерживать высокий уровень запоминания.</p>
<p>RaBitQ также хорошо совместим с другими методами оптимизации, такими как<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> и<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> препроцессинг случайного вращения</a>. Кроме того, RaBitQ <strong>легко обучается и быстро выполняется</strong>. Обучение заключается в простом определении знака каждого компонента вектора, а поиск ускоряется за счет быстрых побитовых операций, поддерживаемых современными процессорами. В совокупности эти оптимизации позволяют RaBitQ обеспечить высокую скорость поиска с минимальной потерей точности.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Разработка RaBitQ в Milvus: от академических исследований к производству<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Несмотря на то что RaBitQ концептуально прост и сопровождается<a href="https://github.com/gaoj0017/RaBitQ"> эталонной реализацией</a>, его адаптация в распределенной векторной базе данных производственного уровня, такой как Milvus, сопряжена с рядом инженерных проблем. Мы реализовали RaBitQ в Knowhere, основной векторной поисковой системе Milvus, а также внесли оптимизированную версию в библиотеку открытого поиска ANN<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Давайте посмотрим, как мы воплотили этот алгоритм в жизнь в Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Компромиссы в реализации</h3><p>Одно из важных проектных решений связано с обработкой вспомогательных данных для каждого вектора. RaBitQ требует два значения с плавающей точкой на вектор, предварительно вычисляемых во время индексации, и третье значение, которое может быть либо вычислено на лету, либо предварительно вычислено. В Knowhere мы предварительно вычисляем это значение во время индексации и сохраняем его для повышения эффективности поиска. В отличие от этого, реализация FAISS экономит память, вычисляя его во время запроса, что позволяет найти другой компромисс между использованием памяти и скоростью запроса.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Аппаратное ускорение</h3><p>Современные процессоры предлагают специализированные инструкции, которые могут значительно ускорить двоичные операции. Мы адаптировали ядро для вычисления расстояний, чтобы использовать преимущества современных инструкций процессора. Поскольку RaBitQ опирается на операции popcount, мы создали специализированный путь в Knowhere, который использует инструкции <code translate="no">VPOPCNTDQ</code> для AVX512, когда они доступны. На поддерживаемом оборудовании (например, Intel IceLake или AMD Zen 4) это может ускорить вычисления двоичного расстояния в несколько раз по сравнению с реализацией по умолчанию.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Оптимизация запросов</h3><p>Как Knowhere (поисковая система Milvus), так и наша оптимизированная версия FAISS поддерживают скалярное квантование (SQ1-SQ8) для векторов запросов. Это обеспечивает дополнительную гибкость: даже при 4-битовом квантовании запросов запоминание остается высоким, а вычислительные требования значительно снижаются, что особенно полезно, когда запросы должны обрабатываться с высокой пропускной способностью.</p>
<p>Мы сделали еще один шаг вперед в оптимизации нашего собственного движка Cardinal, на котором работает полностью управляемый Milvus на Zilliz Cloud. Выходя за рамки возможностей Milvus с открытым исходным кодом, мы внедряем дополнительные усовершенствования, включая интеграцию с векторным индексом на основе графов, дополнительные уровни оптимизации и поддержку инструкций Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Прирост производительности: 3× больше QPS при сопоставимой точности<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>Начиная с версии 2.6, Milvus представляет новый тип индекса <code translate="no">IVF_RABITQ</code>. Этот новый индекс сочетает RaBitQ с кластеризацией IVF, случайным вращательным преобразованием и дополнительным уточнением для обеспечения оптимального баланса производительности, эффективности использования памяти и точности.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Использование IVF_RABITQ в вашем приложении</h3><p>Вот как реализовать <code translate="no">IVF_RABITQ</code> в вашем приложении Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Бенчмаркинг: Цифры рассказывают историю</h3><p>Мы провели бенчмаркинг различных конфигураций с помощью<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, инструмента бенчмаркинга с открытым исходным кодом для оценки векторных баз данных. Как в тестовой, так и в контрольной среде использовался Milvus Standalone, развернутый на экземплярах AWS EC2 <code translate="no">m6id.2xlarge</code>. Эти машины имеют 8 vCPU, 32 ГБ оперативной памяти и процессор Intel Xeon 8375C на базе архитектуры Ice Lake, который поддерживает набор инструкций VPOPCNTDQ AVX-512.</p>
<p>Мы использовали тест Search Performance Test из vdb-bench с набором данных из 1 миллиона векторов, каждый из которых имеет размерность 768. Поскольку размер сегмента по умолчанию в Milvus составляет 1 ГБ, а исходный набор данных (768 размерностей × 1 млн векторов × 4 байта на плавающий вектор) составляет около 3 ГБ, в бенчмарке использовалось несколько сегментов для каждой базы данных.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: Пример конфигурации теста в vdb-bench.</p>
<p>Ниже приведены некоторые детали конфигурации для IVF, RaBitQ и процесса уточнения:</p>
<ul>
<li><p><code translate="no">nlist</code> и <code translate="no">nprobe</code> - стандартные параметры для всех <code translate="no">IVF</code>-методов.</p></li>
<li><p><code translate="no">nlist</code> неотрицательное целое число, задающее общее количество бакетов ЭКО для набора данных.</p></li>
<li><p><code translate="no">nprobe</code> это неотрицательное целое число, определяющее количество ЭКО-бакетов, которые посещаются для одного вектора данных в процессе поиска. Это параметр, связанный с поиском.</p></li>
<li><p><code translate="no">rbq_bits_query</code> задает уровень квантования вектора запроса. Используйте значения 1...8 для уровней квантования <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. Для отключения квантования используйте значение 0. Это параметр, связанный с поиском.</p></li>
<li><p><code translate="no">refine</code>Параметры <code translate="no">refine_type</code> и <code translate="no">refine_k</code> являются стандартными параметрами для процесса уточнения.</p></li>
<li><p><code translate="no">refine</code> булево значение, включающее стратегию уточнения.</p></li>
<li><p><code translate="no">refine_k</code> является неотрицательным значением fp. В процессе уточнения используется более качественный метод квантования для выбора необходимого количества ближайших соседей из <code translate="no">refine_k</code> раз большего пула кандидатов, выбранных с помощью <code translate="no">IVFRaBitQ</code>. Это параметр, связанный с поиском.</p></li>
<li><p><code translate="no">refine_type</code> строка, задающая тип квантования для уточняющего индекса. Доступны следующие варианты: <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> и <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Результаты позволяют сделать важные выводы:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: Сравнение стоимости и производительности базового варианта (IVF_FLAT), IVF_SQ8 и IVF_RABITQ с различными стратегиями уточнения</p>
<p>По сравнению с базовым индексом <code translate="no">IVF_FLAT</code>, который достигает 236 QPS с 95,2% отзыва, <code translate="no">IVF_RABITQ</code> достигает значительно большей производительности - 648 QPS с FP32-запросами и 898 QPS в паре с SQ8-квантованными запросами. Эти цифры демонстрируют преимущество RaBitQ в производительности, особенно когда применяется уточнение.</p>
<p>Однако эта производительность связана с заметным компромиссом в запоминании. Когда <code translate="no">IVF_RABITQ</code> используется без уточнения, запоминание составляет около 76 %, что может оказаться недостаточным для приложений, требующих высокой точности. Тем не менее, достижение такого уровня запоминания при использовании 1-битного векторного сжатия все равно впечатляет.</p>
<p>Уточнение необходимо для восстановления точности. При конфигурации с запросами SQ8 и уточнениями SQ8 <code translate="no">IVF_RABITQ</code> обеспечивает высокую производительность и запоминание. Он сохраняет высокий отзыв 94,7 %, почти совпадающий с IVF_FLAT, и при этом достигает 864 QPS, что более чем в 3 раза выше, чем у IVF_FLAT. Даже по сравнению с другим популярным индексом квантования <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> с уточнением SQ8 достигает более половины пропускной способности при аналогичном отзыве, только с незначительно большей стоимостью. Это делает его отличным вариантом для сценариев, требующих одновременно скорости и точности.</p>
<p>Короче говоря, <code translate="no">IVF_RABITQ</code> сам по себе отлично подходит для максимизации пропускной способности при приемлемом отзыве, и становится еще более мощным в паре с уточнением для устранения разрыва в качестве, используя лишь часть пространства памяти по сравнению с <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>RaBitQ - это значительный прогресс в технологии векторного квантования. Сочетание двоичного квантования с интеллектуальными стратегиями кодирования позволяет достичь того, что казалось невозможным: экстремального сжатия с минимальной потерей точности.</p>
<p>Начиная с версии 2.6, Milvus представит IVF_RABITQ, объединив эту мощную технику сжатия с кластеризацией и стратегиями уточнения IVF, чтобы внедрить двоичное квантование в производство. Эта комбинация создает практический баланс между точностью, скоростью и эффективностью памяти, который может изменить ваши рабочие нагрузки векторного поиска.</p>
<p>Мы стремимся привнести больше подобных инноваций как в Milvus с открытым исходным кодом, так и в его полностью управляемый сервис на Zilliz Cloud, делая векторный поиск более эффективным и доступным для всех.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Начало работы с Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 доступен уже сейчас. Помимо RabitQ, в нем представлены десятки новых функций и оптимизаций производительности, таких как многоуровневое хранение, Meanhash LSH, расширенный полнотекстовый поиск и многопользовательская лицензия, что напрямую решает самые актуальные проблемы векторного поиска: эффективное масштабирование при сохранении контроля над расходами.</p>
<p>Готовы изучить все, что предлагает Milvus 2.6? Погрузитесь в наши<a href="https://milvus.io/docs/release_notes.md"> заметки о выпуске</a>, просмотрите<a href="https://milvus.io/docs"> полную документацию</a> или загляните в наши<a href="https://milvus.io/blog"> тематические блоги</a>.</p>
<p>Если у вас возникли вопросы или у вас есть похожий случай использования, обращайтесь к нам через наше <a href="https://discord.com/invite/8uyFbECzPX">сообщество Discord</a> или создайте проблему на<a href="https://github.com/milvus-io/milvus"> GitHub</a> - мы здесь, чтобы помочь вам максимально использовать Milvus 2.6.</p>
