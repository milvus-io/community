---
id: milvus-3-0-structarray.md
title: >-
  Одна сущность, много векторов: поиск на уровне сущности и элемента с Milvus
  3.0 StructArray
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Одна сущность может содержать несколько согласованных векторов и полей
  метаданных, и Milvus может выполнять поиск как по всей сущности, так и по
  отдельному элементу, не разворачивая данные в отдельные строки.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>Большинство схем векторных баз данных начинаются с простого предположения: одна сущность — одно векторное представление (embedding). Продукт получает один вектор, как и документ. Пользовательский запрос преобразуется в вектор и сравнивается с этими векторами через поиск приблизительных ближайших соседей (ANN). Эта модель работает для первого поколения сценариев использования векторного поиска, включая RAG, семантический поиск и рекомендательные системы.</p>
<p><strong>Однако реальные данные ИИ редко соответствуют этому предположению.</strong> Видео содержит клипы, кадры или ключевые кадры, каждый из которых имеет собственное векторное представление, временной диапазон, подпись, метку сцены и оценку уверенности. Продукт может иметь несколько изображений и углов обзора. Длинный документ содержит отрывки или разделы, локальное значение которых важнее, чем одно векторное представление всего документа. Популярные модели позднего взаимодействия (late-interaction) проявляют то же ограничение на ещё более мелком уровне: ColBERT создаёт один вектор на токен, а ColPali — один вектор на визуальный патч.</p>
<p>В каждом случае родительская сущность остаётся той единицей, которую приложение хранит, отображает, защищает и возвращает. Однако релевантность, фильтрация и объяснение результатов часто зависят от элементов внутри этой сущности.</p>
<p><strong>Новая функция StructArray предоставляет Milvus нативную модель данных для такой структуры: одна сущность содержит упорядоченный массив элементов Struct, определённых схемой, и каждый элемент может содержать скалярные метаданные, векторные представления или и то и другое.</strong> Milvus может фильтровать поля, принадлежащие одному и тому же элементу, сравнивать два списка векторных представлений на уровне сущности или искать отдельные элементы и возвращать соответствующий смещение (offset).</p>
<p>В этой статье на примере поиска по видео объясняется модель данных, а затем рассматриваются проектирование схемы, фильтрация, гранулярности векторного поиска, стратегии индексации EmbeddingList, схлопывание результатов гибридного поиска и физическое расположение данных, которое делает эту функцию реализуемой.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Почему модели «один вектор» и «одна плоская строка» больше недостаточно<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Рассмотрим пользователя, который ищет в видеокаталоге «человек нарезает овощи на кухне». Релевантный сигнал может находиться в одном восьмисекундном клипе, а не в векторном представлении всего видео. <strong>Сжатие каждого клипа, объекта и действия в один вектор может сохранить общую тему, но при этом смазать локальные детали.</strong></p>
<p>Такое же несоответствие проявляется и в других сценариях:</p>
<ul>
<li>Релевантность продукта может определяться одним из нескольких изображений или ракурсов.</li>
<li>Документ может совпадать благодаря одному отрывку, а не своей общей теме.</li>
<li>Память агента может содержать несколько наблюдений, из которых только одно важно для текущей задачи.</li>
<li>Запись ColBERT или ColPali содержит список векторов токенов или патчей переменной длины, а не один плотный вектор.</li>
</ul>
<p>Одна из альтернатив — разделить каждый клип, изображение или отрывок на отдельную строку базы данных. Это обеспечивает локальный поиск, но также отделяет каждый фрагмент от его родительской сущности. Метаданные родительской сущности могут повторяться в строках, а поиск на уровне сущностей после этого требует группировки, дедупликации и повторного ранжирования после поиска по фрагментам.</p>
<p>Само по себе вложенное хранение не решает проблему запросов. JSON может хранить объекты, но не даёт Milvus предопределённую схему подполей для индексации векторов и скаляров. Параллельные массивы могут хранить подписи, метки сцен и значения уверенности, но приложение должно поддерживать выравнивание смещений. База данных не может безопасно определить, что <code translate="no">scene_type[3]</code> и <code translate="no">label_confidence[3]</code> описывают один и тот же клип, если эта связь не является частью модели данных.</p>
<p>StructArray кодирует эту связь напрямую. Он сохраняет локальные элементы внутри родительской сущности, одновременно предоставляя их выровненные подполя для проверки схемы, индексации, фильтрации и векторного поиска.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">Что такое StructArray и его модель данных?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray, также известный как массив структур, хранит упорядоченный набор элементов Struct в каждой сущности. Поле StructArray — это <code translate="no">Array</code>, все элементы которого соответствуют одной предопределённой схеме <code translate="no">Struct</code>. Для коллекции видео логическая структура может выглядеть так:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Здесь:</p>
<ul>
<li><code translate="no">clips</code> — родительское поле StructArray.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> и другие атрибуты — подполя.</li>
<li><code translate="no">clips[0]</code> — первый клип.</li>
<li>Каждое подполе со смещением <code translate="no">0</code> принадлежит этому же клипу.</li>
<li>Каждое подполе со смещением <code translate="no">3</code> принадлежит другому клипу.</li>
</ul>
<p>Два векторных подполя служат для разных режимов поиска. <code translate="no">clips[clip_embedding_list]</code> индексируется с метрикой <code translate="no">MAX_SIM*</code> для поиска EmbeddingList на уровне сущностей, а <code translate="no">clips[clip_embedding]</code> индексируется с обычной векторной метрикой для поиска на уровне элементов. Поскольку векторное поле или векторное подполе принимает только один индекс, коллекция, которой нужны оба режима, должна определять и индексировать два подполя отдельно.</p>
<p>Эта модель поддерживает три различные семантики запросов.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. Поиск EmbeddingList возвращает родительские сущности</h3><p>Векторы в <code translate="no">clips[clip_embedding_list]</code> образуют один список векторных представлений для видео. Запрос также является <code translate="no">EmbeddingList</code>. Milvus сравнивает список запроса с каждым сохранённым списком, используя метрику <code translate="no">MAX_SIM*</code>, и возвращает результат на уровне сущности.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. Семейство <code translate="no">MATCH_*</code> фильтрует родительские сущности</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> и <code translate="no">MATCH_EXACT</code> вычисляют предикат для элементов Struct, подсчитывают, сколько элементов удовлетворяют условию, и определяют, проходит ли родительская сущность фильтр.</p>
<p>Например:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Оба скалярных условия должны быть истинны для одного и того же смещения клипа. Milvus не комбинирует метку «кухня» из одного клипа с высоким значением уверенности из другого.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. Поиск на уровне элементов возвращает смещение совпавшего элемента</h3><p>Обычный вектор запроса может искать по всем векторам в <code translate="no">clips[clip_embedding]</code> независимо. Каждое совпадение идентифицирует родительскую сущность и смещение (с нуля) совпавшего элемента Struct. <code translate="no">element_filter</code> может ограничить, какие элементы участвуют в этом векторном поиске.</p>
<p>Эти операции объединяет одна предпосылка: Milvus знает, какие векторные и скалярные значения принадлежат одному элементу и какие элементы принадлежат одной сущности.</p>
<p>StructArray — это не универсальная система произвольной вложенности. Его текущая модель — один <code translate="no">Array</code> элементов <code translate="no">Struct</code> с поддерживаемыми скалярными и векторными подполями. Такая граница делает индексацию подполей и выполнение с учётом элементов выполнимыми на практике.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Создание схемы, индексов и пути вставки<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>Следующий упрощённый пример на PyMilvus создаёт коллекцию видео с одним векторным полем верхнего уровня и StructArray для клипов. В нём используются отдельные векторные подполя клипов, чтобы одна и та же коллекция могла демонстрировать оба режима поиска.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>Векторные подполя должны быть проиндексированы до поиска. Поскольку семейство метрик определяет режим поиска, каждое векторное подполе получает собственный индекс:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Скалярные индексы необязательны, но подполя, которые часто используются в фильтрах при больших масштабах данных, должны использовать совместимый скалярный индекс. Например, <code translate="no">clips[scene_type]</code> может использовать инвертированный индекс, а числовое подполе, такое как <code translate="no">clips[label_confidence]</code>, может использовать индекс, подходящий для числовой фильтрации.</p>
<p>Вставляйте данные в их естественной форме сущности: одна строка видео с массивом объектов клипов. Чтобы пример был компактным, в оба векторных подполя записывается один и тот же вектор клипа.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>На границе API <code translate="no">clips</code> остаётся массивом структурированных объектов. Внутри Milvus каждое подполе следует типизированному пути, требуемому для его собственного индекса, фильтра и поведения при выводе. Это различие прозрачно при вставке, но фундаментально для всего, что следует далее.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">Фильтрация по одному элементу — это разница между структурой и параллельными массивами<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Основное преимущество фильтрации — не более короткий синтаксис для вложенных полей. Это корректная корреляция между скалярными подполями.</p>
<p>Предположим, приложению нужны видео, содержащие кухонный клип с уверенностью метки выше <code translate="no">0.8</code>. Недостаточно, чтобы видео содержало какой-то кухонный клип и какой-то клип с высокой уверенностью; один и тот же клип должен удовлетворять обоим условиям.</p>
<p>Семейство <code translate="no">MATCH_*</code> StructArray выражает это напрямую:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus вычисляет предикат для каждого смещения элемента, а затем применяет квантор оператора, чтобы определить, проходит ли родительская сущность:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: Хотя бы один элемент совпадает.</li>
<li><code translate="no">MATCH_ALL</code>: Каждый элемент совпадает.</li>
<li><code translate="no">MATCH_LEAST</code>: Как минимум <code translate="no">threshold</code> элементов совпадает.</li>
<li><code translate="no">MATCH_MOST</code>: Не более <code translate="no">threshold</code> элементов совпадает.</li>
<li><code translate="no">MATCH_EXACT</code>: Ровно <code translate="no">threshold</code> элементов совпадает.</li>
</ul>
<p>Если бы те же данные хранились в виде двух независимых массивов, следующее выражение не сохранило бы эту корреляцию:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Два значения могут находиться по разным смещениям. Это может быть допустимо для несвязанных атрибутов, но некорректно, когда оба условия описывают один и тот же клип, изображение продукта или отрывок документа.</p>
<p>StructArray делает идентичность элемента частью предиката базы данных, а не соглашением, которое приложение должно обеспечивать самостоятельно.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Две гранулярности векторного поиска, две идентичности результатов<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда сущность хранит несколько векторов, поиск должен решить модельный вопрос до начала ANN-поиска:</p>
<p><strong>Должны ли векторы оцениваться вместе как одно представление родительской сущности, или каждый вектор элемента должен конкурировать независимо?</strong></p>
<p>StructArray поддерживает обе модели, но они используют разные формы запросов, семейства метрик, векторные подполя и идентичности результатов.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Поиск EmbeddingList: список векторов запроса находит сущность</h3><p>Запрос <code translate="no">EmbeddingList</code> содержит несколько векторов. Видео запроса может быть разделено на несколько клипов; товарный запрос может содержать несколько эталонных изображений; запрос ColBERT содержит по одному вектору на токен запроса.</p>
<p>Для каждой сущности Milvus сравнивает список запроса с сохранённым списком векторных представлений сущности. При оценке в стиле MaxSim каждый вектор запроса выбирает своё наилучшее совпадение в списке сущности, и Milvus агрегирует эти оценки наилучших совпадений в оценку сущности. Итоговое совпадение представляет родительскую сущность, а не конкретный элемент Struct.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Этот поиск отвечает на вопрос: <strong>Какие видео являются наилучшим общим совпадением для этого набора клипов запроса?</strong></p>
<p>Он подходит для поиска «видео-по-видео», мультиизображенческого поиска товаров, поиска в стиле ColBERT и ColPali и других случаев, когда и запрос, и сохранённая сущность представлены несколькими векторами.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Поиск на уровне элементов: один вектор запроса находит клип внутри сущности</h3><p>Поиск на уровне элементов использует обычный вектор запроса. Каждый вектор в <code translate="no">clips[clip_embedding]</code> участвует в ANN-поиске как независимый кандидат. Каждое совпадение идентифицирует родительскую сущность и смещение совпавшего элемента.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Чтобы искать только по выбранным клипам, добавьте <code translate="no">element_filter</code>, скалярные условия которого применяются к одному и тому же клипу:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Фильтр не выбирает сначала кухонный клип, а затем ищет другой клип с высокой уверенностью. И предикаты, и векторный кандидат относятся к одному и тому же элементу Struct.</p>
<p>Несгруппированный ответ может выглядеть так:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>Одна и та же сущность может появляться несколько раз, потому что несколько клипов могут совпадать. Это полезно, когда приложению нужно показать не только то, какое видео или документ релевантно, но и какой клип или отрывок дал совпадение.</p>
<table>
<thead>
<tr><th>Аспект</th><th>Поиск EmbeddingList</th><th>Поиск на уровне элементов</th></tr>
</thead>
<tbody>
<tr><td>Входные данные запроса</td><td>Один или несколько векторов запроса в <code translate="no">EmbeddingList</code></td><td>Один обычный вектор запроса</td></tr>
<tr><td>Пример цели</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Семейство метрик</td><td><code translate="no">MAX_SIM*</code></td><td>Обычные метрики, такие как <code translate="no">COSINE</code>, <code translate="no">IP</code> или <code translate="no">L2</code></td></tr>
<tr><td>Единица ANN-кандидата</td><td>Список векторных представлений родительской сущности</td><td>Каждый вектор элемента Struct</td></tr>
<tr><td>Идентичность результата</td><td>Родительская сущность</td><td>Родительская сущность плюс смещение элемента</td></tr>
<tr><td>Типичный сценарий использования</td><td>Сопоставление многовекторного запроса с многовекторной сущностью</td><td>Поиск наиболее релевантного клипа, изображения, отрывка, патча или факта</td></tr>
</tbody>
</table>
<p>Чтобы поддерживать оба режима в одной коллекции, определите и индексируйте отдельные векторные подполя. Форма запроса, семейство метрик и целевой индекс должны совпадать.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">Индексация EmbeddingList — это решение о качестве и стоимости<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>При одном векторном представлении на сущность ANN-индекс находит сущности, близкие к вектору запроса. Поиск EmbeddingList более затратен, поскольку релевантность зависит от попарных взаимодействий между двумя списками векторов.</p>
<p>Вычисление точного MaxSim для каждого вектора в каждой сущности даёт наиболее чистый эталонный рейтинг, но полное сканирование обычно слишком дорого для онлайн-поиска. Поэтому Milvus использует двухэтапную модель:</p>
<ol>
<li>Стратегия приближённого поиска извлекает кандидатов — родительские сущности.</li>
<li>Когда <code translate="no">emb_list_rerank</code> включён, Milvus пересчитывает MaxSim по этим кандидатам для построения итогового рейтинга.</li>
</ol>
<p>Извлечение большего числа кандидатов на первом этапе обычно повышает шанс, что истинные лучшие результаты достигнут повторного ранжировщика, но также увеличивает задержку и вычислительные затраты. Три стратегии различаются в основном тем, как они формируют этот набор кандидатов.</p>
<table>
<thead>
<tr><th>Стратегия</th><th>Представление кандидатов на первом этапе</th><th>Хорошая отправная точка, когда</th><th>Основной компромисс</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Индексирует каждый вектор в каждом списке векторных представлений. Векторы запроса выполняют ANN независимо; совпадения агрегируются обратно в родительские сущности перед повторным ранжированием MaxSim.</td><td>Качество является приоритетом, списки короткие или средние, а отдельные векторы обладают высокой различительной способностью.</td><td>Размер индекса и работа по поиску на первом этапе растут с длиной списка и количеством векторов запроса.</td></tr>
<tr><td>MUVERA</td><td>Кодирует каждый список векторных представлений в один вектор фиксированной размерности с помощью случайных проекций, затем выполняет обычный ANN.</td><td>TokenANN слишком тяжёл, и предпочтительно сжатие без конвейера обучения.</td><td>Кодирование теряет информацию; более сильные настройки проекций увеличивают размерность кодирования и стоимость ANN.</td></tr>
<tr><td>LEMUR</td><td>Обучает модель, которая отображает список векторных представлений в вектор родительской сущности фиксированной размерности.</td><td>Векторные представления менее различительны, списки велики, или рабочая нагрузка является визуальной или мультимодальной.</td><td>Требуется обучение, и модель может быть чувствительна к распределению корпуса и смещению длины документов.</td></tr>
</tbody>
</table>
<p>Ни одна стратегия не является лучшей для всех рабочих нагрузок. Начните с целевых данных и распределения запросов:</p>
<ul>
<li>Используйте TokenANN как базовый вариант, ориентированный на качество, когда размер набора данных позволяет.</li>
<li>Попробуйте MUVERA, когда индекс TokenANN или извлечение кандидатов становятся слишком дорогими по мере роста длины списка, и вы хотите избежать конвейера обучения.</li>
<li>Оцените LEMUR, когда пространство векторных представлений зашумлено или слабо различимо, или когда рабочая нагрузка является визуальной или мультимодальной.</li>
<li>Измеряйте recall или nDCG наряду с задержкой и размером индекса. Стратегия, которая работает для коротких текстов, может вести себя иначе с длиннохвостыми длинами документов или тысячами визуальных патчей.</li>
</ul>
<p>StructArray решает одну проблему: как представить выровненные, фильтруемые элементы с векторными представлениями внутри одной сущности. Стратегия EmbeddingList решает другую: как аппроксимировать MaxSim с приемлемой стоимостью для конкретной модели и корпуса.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">Гибридный поиск делает идентичность результатов явной<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>Продакшн-поиск редко следует одному векторному пути. Видеозапрос может комбинировать векторное представление видео верхнего уровня, одно или несколько векторных представлений на уровне клипов, сигнал подписи или транскрипта и повторный ранжировщик.</p>
<p>Когда кандидаты на уровне элементов попадают в этот конвейер, движок должен решить, что идентифицирует итогового кандидата.</p>
<table>
<thead>
<tr><th>Состав гибридного запроса</th><th>Область итогового кандидата</th><th>Идентичность результата</th></tr>
</thead>
<tbody>
<tr><td>Все подзапросы являются запросами на уровне элементов и нацелены на векторные подполя в одном и том же StructArray</td><td>Уровень элемента</td><td>Первичный ключ плюс поле StructArray плюс смещение элемента</td></tr>
<tr><td>Включено векторное поле верхнего уровня</td><td>Уровень сущности</td><td>Первичный ключ</td></tr>
<tr><td>Включён запрос EmbeddingList</td><td>Уровень сущности</td><td>Первичный ключ</td></tr>
<tr><td>Запросы на уровне элементов нацелены на разные поля StructArray</td><td>Уровень сущности</td><td>Первичный ключ</td></tr>
</tbody>
</table>
<p>Первая конфигурация сохраняет идентичность элемента, поскольку смещение <code translate="no">3</code> относится к одному и тому же элементу Struct для каждого подзапроса в рамках данного родительского StructArray. Это подходит для приложения, которое хочет вернуть наиболее релевантный клип или отрывок после объединения нескольких сигналов на уровне элементов.</p>
<p>Остальные конфигурации смешивают гранулярности кандидатов или пространства имён элементов. Поэтому совпадение на уровне элемента должно быть схлопнуто в оценку на уровне сущности перед итоговым повторным ранжированием. Milvus поддерживает несколько стратегий схлопывания:</p>
<table>
<thead>
<tr><th>Стратегия схлопывания</th><th>Оценка сущности из возвращённых совпадений элементов</th><th>Важное условие</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Лучшая оценка элемента</td><td>Работает с поддерживаемыми обычными векторными метриками</td></tr>
<tr><td><code translate="no">sum</code></td><td>Сумма всех возвращённых оценок элементов</td><td>Используйте с метриками положительной корреляции, такими как <code translate="no">IP</code> или <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Среднее возвращённых оценок элементов</td><td>Работает с поддерживаемыми обычными векторными метриками</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Сумма лучших <code translate="no">K</code> возвращённых оценок элементов</td><td>Требуется положительный <code translate="no">topk</code>; используйте с <code translate="no">IP</code> или <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Среднее лучших <code translate="no">K</code> возвращённых оценок элементов</td><td>Требуется положительный <code translate="no">topk</code></td></tr>
</tbody>
</table>
<p>Схлопывание работает только с теми совпадениями элементов, которые возвращены данным ANN-подзапросом; оно не сканирует каждый элемент сущности после поиска. Поэтому <code translate="no">limit</code> запроса определяет, какие совпадения элементов доступны функции схлопывания.</p>
<p>Этот выбор формирует семантику поиска, а не только форматирование вывода. Если приложение показывает клип или отрывок, сохранение смещения при объединении естественно. Если оно показывает видео, продукт или документ, схлопывание на уровне сущности естественно. Когда сигналы работают на разных гранулярностях, системе нужно явное правило оценки «элемент-в-сущность».</p>
<p>StructArray переносит проблему идентичности и схлопывания из специальной постобработки в модель выполнения поиска.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Как Milvus выполняет StructArray, не рассматривая его как единый блок данных<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>Пользовательская модель — это <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Однако хранение всего значения как одного непрозрачного блока сделало бы индексы подполей, фильтры и выборочный вывод неэффективными.</p>
<p>Milvus использует схему «логический родитель, физические дочерние колонки».</p>
<p>На уровне схемы <code translate="no">clips</code> — это логическое родительское поле. Оно определяет такие свойства, как схема Struct, максимальная ёмкость и допустимость NULL. Его подполя нормализуются в пути, такие как <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> и <code translate="no">clips[label_confidence]</code>.</p>
<p>Скалярные подполя следуют путям хранения скалярных массивов для каждой сущности, а векторные подполя — путям векторных массивов. Каждое подполе затем может использовать путь данных, соответствующий его типу: скалярную фильтрацию и скалярные индексы для метаданных, векторные индексы и ANN-поиск для векторных представлений.</p>
<p>При приёме данных Proxy разворачивает вложенный список Struct в типизированные дочерние колонки. Во время выполнения Milvus поддерживает связь между каждым физическим элементом и его родительской сущностью. Концептуально эта связь выглядит так:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Когда поиск на уровне элементов возвращает физический идентификатор элемента, Milvus сопоставляет его обратно с родительской сущностью и смещением элемента. Когда <code translate="no">element_filter</code> создаёт битовую карту на уровне элементов, движок согласует её с видимостью родительской сущности, удалениями и другими фильтрами.</p>
<p>При возврате результатов Milvus использует логическую схему и общие смещения для восстановления формы StructArray, которую вставило приложение. Система может выполнять операции над типизированными дочерними колонками, пока пользователь продолжает читать и записывать естественные вложенные объекты. Такое физическое расположение делает StructArray чем-то большим, чем типизированный JSON: вложенная связь участвует в модели индексации и выполнения.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Где StructArray уместен, а где нет<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray отлично подходит, когда выполняются все следующие условия:</p>
<ul>
<li>У приложения есть значимая родительская сущность, такая как видео, продукт, документ, визуальная страница или запись памяти.</li>
<li>Каждая родительская сущность содержит упорядоченный набор локальных элементов переменной длины.</li>
<li>Этим элементам нужны собственные скалярные метаданные, векторные представления или и то и другое.</li>
<li>Поиск или фильтрация должны сохранять связь между подполями при одном и том же смещении элемента.</li>
<li>Приложению нужен многовекторный поиск на уровне сущностей, совпадения на уровне элементов или и то и другое.</li>
</ul>
<p>StructArray не автоматически лучше для каждой коллекции. Короткому документу или простому запросу может вполне подойти одно плотное векторное представление. Многовекторная индексация добавляет затраты на хранение и поиск, поэтому дополнительное представление должно оправдывать своё место за счёт улучшенного качества поиска или более полезной гранулярности результатов.</p>
<p>Текущие границы схемы и выполнения также важны:</p>
<ul>
<li><code translate="no">Struct</code> поддерживается как тип элемента <code translate="no">Array</code>, а не как поле коллекции верхнего уровня.</li>
<li>Все элементы в одном StructArray используют одну предопределённую схему.</li>
<li><code translate="no">max_capacity</code> обязателен и ограничивает количество элементов на сущность.</li>
<li>Вложенные подполя <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code> и <code translate="no">JSON</code> не поддерживаются внутри StructArray.</li>
<li>Векторное подполе принимает один индекс. Используйте отдельные векторные подполя для поиска EmbeddingList и поиска на уровне элементов, когда требуются оба режима.</li>
<li>Векторные подполя должны быть проиндексированы до поиска. Скалярные подполя, активно используемые в фильтрах, должны быть соответствующим образом проиндексированы.</li>
<li>Схема подполей фиксируется после создания поля StructArray, поэтому планируйте атрибуты элементов до производственного развёртывания.</li>
</ul>
<p>Эти ограничения делают модель более узкой, чем произвольная вложенность документо-ориентированных баз данных, но они также дают Milvus достаточно структуры, чтобы рассуждать об идентичности элементов, индексировать каждое подполе и выполнять поиск на двух гранулярностях.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray сохраняет локальные свидетельства как первостепенные, не теряя сущность<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray даёт Milvus объект поиска, который плоские схемы с трудом представляют: родительскую сущность с упорядоченным набором структурированных элементов. Связи между этими элементами участвуют в фильтрации, индексации и поиске, а не существуют только в хранилище.</p>
<p>Каждый элемент сохраняет собственные метаданные и векторные представления. Элементы могут удовлетворять скалярным предикатам одного элемента, участвовать вместе в поиске EmbeddingList на уровне сущностей или независимо конкурировать в поиске на уровне элементов. В то же время они остаются привязанными к родительской сущности, чьи метаданные, разрешения и идентичность в приложении дают им контекст.</p>
<p>Для видеоклипов, изображений продуктов, отрывков документов, визуальных патчей и фрагментов памяти локальные свидетельства можно искать и фильтровать, не теряя сущность, которой они принадлежат. Оставшиеся проектные решения явны: выберите гранулярность поиска, задайте каждому векторному подполю соответствующую метрику и индекс и решите, должны ли гибридные результаты сохранять смещения элементов или схлопываться обратно в сущности.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Попробуйте StructArray в Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray доступен в Milvus 3.0. Начните с <a href="https://milvus.io/docs/array-of-structs.md">обзора StructArray</a>. Если вы оцениваете многовекторный поиск на уровне сущностей, прочитайте <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">руководство по стратегиям EmbeddingList</a>. О гранулярности результатов и поведении схлопывания см. <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Гибридный поиск со StructArray</a>.</p>
<p>Для более широкого контекста релиза см. <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">анонс запуска Milvus 3.0</a>, <a href="https://milvus.io/docs/release_notes.md">примечания к выпуску</a> и <a href="https://github.com/milvus-io/milvus">репозиторий milvus-io/milvus</a>.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> также поддерживает StructArray и поиск EmbeddingList для управляемых развёртываний. Ознакомьтесь с <a href="https://docs.zilliz.com/docs/use-array-of-structs">руководством Zilliz Cloud по StructArray</a> для ограничений, специфичных для сервиса. В Zilliz Cloud скалярные операторы для StructArray в настоящее время документированы для кластеров On-Demand.</p>
<p>Чтобы обсудить схему или дизайн поиска с командой, присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX">сообществу Milvus в Discord</a> или запишитесь на сессию <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Office Hours Milvus</a>.</p>
