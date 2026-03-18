---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Как использовать гибридный пространственный и векторный поиск с Milvus
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Узнайте, как Milvus 2.6.4 обеспечивает гибридный пространственный и векторный
  поиск с помощью Geometry и R-Tree, а также о производительности и практических
  примерах.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Такой запрос, как "найти романтические рестораны в радиусе 3 км", звучит просто. Но это не так, поскольку он сочетает в себе фильтрацию по местоположению и семантический поиск. Большинству систем приходится разделять этот запрос на две базы данных, что означает синхронизацию данных, объединение результатов в коде и дополнительные задержки.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 устраняет это разделение. Благодаря собственному типу данных <strong>GEOMETRY</strong> и индексу <strong>R-Tree</strong>, Milvus может применять ограничения местоположения и семантические ограничения в одном запросе. Это делает гибридный пространственный и семантический поиск намного проще и эффективнее.</p>
<p>В этой статье рассказывается о том, почему потребовалось такое изменение, как GEOMETRY и R-Tree работают в Milvus, какой прирост производительности можно ожидать и как настроить их с помощью Python SDK.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">Ограничения традиционного гео- и семантического поиска<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Запросы типа "романтические рестораны в радиусе 3 км" трудно обрабатывать по двум причинам:</p>
<ul>
<li><strong>"Романтические" требуют семантического поиска.</strong> Система должна векторизовать отзывы о ресторанах и теги, а затем найти совпадения по сходству в пространстве вложений. Это работает только в векторной базе данных.</li>
<li><strong>"В пределах 3 км" нуждается в пространственной фильтрации.</strong> Результаты должны быть ограничены "в пределах 3 км от пользователя" или иногда "в пределах определенного полигона доставки или административной границы".</li>
</ul>
<p>В традиционной архитектуре удовлетворение обеих потребностей обычно означало работу двух систем бок о бок:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> для геозондирования, расчета расстояний и пространственной фильтрации.</li>
<li><strong>Векторная база данных</strong> для приблизительного поиска ближайших соседей (ANN) по вкраплениям.</li>
</ul>
<p>Такая конструкция "двух баз данных" создает три практические проблемы:</p>
<ul>
<li><strong>Болезненная синхронизация данных.</strong> Если ресторан меняет свой адрес, необходимо обновить и геосистему, и векторную базу данных. Пропуск одного обновления приводит к противоречивым результатам.</li>
<li><strong>Повышенная латентность.</strong> Приложению приходится обращаться к двум системам и объединять их результаты, что увеличивает количество сетевых обходов и время обработки.</li>
<li><strong>Неэффективная фильтрация.</strong> Если система сначала выполняла векторный поиск, она часто возвращала множество результатов, которые находились далеко от пользователя, и их приходилось отбрасывать. Если сначала применялась фильтрация по местоположению, оставшийся набор оставался большим, поэтому этап векторного поиска по-прежнему был дорогостоящим.</li>
</ul>
<p>Milvus 2.6.4 решает эту проблему, добавляя поддержку пространственной геометрии непосредственно в векторную базу данных. Теперь семантический поиск и фильтрация по местоположению выполняются в одном запросе. Благодаря тому, что все находится в одной системе, гибридный поиск стал быстрее и проще в управлении.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Что добавляет GEOMETRY в Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.6 появился скалярный тип поля DataType.GEOMETRY. Вместо того чтобы хранить местоположения в виде отдельных чисел долготы и широты, Milvus теперь хранит геометрические объекты: точки, линии и многоугольники. Запросы типа "находится ли эта точка внутри региона?" или "находится ли она в пределах X метров?" становятся нативными операциями. Нет необходимости создавать обходные пути для работы с сырыми координатами.</p>
<p>Реализация соответствует<strong>стандарту</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access</strong>, поэтому она работает с большинством существующих геопространственных инструментов. Геометрические данные хранятся и запрашиваются с использованием <strong>WKT (Well-Known Text)</strong>, стандартного текстового формата, который читается человеком и разбирается программами.</p>
<p>Поддерживаемые типы геометрии:</p>
<ul>
<li><strong>POINT</strong>: отдельное местоположение, например, адрес магазина или положение транспортного средства в реальном времени.</li>
<li><strong>LINESTRING</strong>: линия, например осевая линия дороги или траектория движения</li>
<li><strong>ПОЛИГОН</strong>: область, например административная граница или геозона.</li>
<li><strong>Типы сбора</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON и GEOMETRYCOLLECTION.</li>
</ul>
<p>Он также поддерживает стандартные пространственные операторы, включая:</p>
<ul>
<li><strong>Пространственные отношения</strong>: сдерживание (ST_CONTAINS, ST_WITHIN), пересечение (ST_INTERSECTS, ST_CROSSES) и контакт (ST_TOUCHES).</li>
<li><strong>Операции с расстояниями</strong>: вычисление расстояний между геометриями (ST_DISTANCE) и фильтрация объектов в пределах заданного расстояния (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Как работает индексирование R-деревьев в Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Поддержка ГЕОМЕТРИИ встроена в механизм запросов Milvus, а не просто представлена в виде функции API. Пространственные данные индексируются и обрабатываются непосредственно в движке с помощью индекса R-Tree (Rectangle Tree).</p>
<p><strong>R-дерево</strong> группирует близлежащие объекты с помощью <strong>минимальных ограничивающих прямоугольников (MBR)</strong>. Во время запроса движок пропускает большие области, которые не пересекаются с геометрией запроса, и выполняет подробную проверку только небольшого набора кандидатов. Это намного быстрее, чем сканирование каждого объекта.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Как Milvus строит R-дерево</h3><p>Построение R-дерева происходит послойно:</p>
<table>
<thead>
<tr><th><strong>Уровень</strong></th><th><strong>Что делает Milvus</strong></th><th><strong>Интуитивная аналогия</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Уровень листьев</strong></td><td>Для каждого геометрического объекта (точки, линии или многоугольника) Milvus вычисляет его минимальный ограничивающий прямоугольник (MBR) и сохраняет его в качестве узла листа.</td><td>Обертывание каждого объекта в прозрачную коробку, которая точно соответствует ему.</td></tr>
<tr><td><strong>Промежуточные уровни</strong></td><td>Близлежащие листовые узлы объединяются в группы (обычно 50-100 за раз), и создается более крупный родительский MBR, чтобы охватить их все.</td><td>Сбор посылок из одного района в один ящик для доставки.</td></tr>
<tr><td><strong>Корневой уровень</strong></td><td>Эта группировка продолжается по возрастающей, пока все данные не будут покрыты одним корневым MBR.</td><td>Погрузка всех ящиков в один грузовик дальнего следования.</td></tr>
</tbody>
</table>
<p>С такой структурой сложность пространственных запросов снижается с полного сканирования <strong>O(n)</strong> до <strong>O(log n)</strong>. На практике запросы к миллионам записей могут выполняться от сотен миллисекунд до нескольких миллисекунд без потери точности.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Как выполняются запросы: Двухфазная фильтрация</h3><p>Чтобы сбалансировать скорость и корректность, Milvus использует <strong>двухфазную</strong> стратегию <strong>фильтрации</strong>:</p>
<ul>
<li><strong>Грубый фильтр:</strong> сначала индекс R-дерева проверяет, не пересекается ли ограничивающий прямоугольник запроса с другими ограничивающими прямоугольниками в индексе. Это позволяет быстро удалить большинство несвязанных данных и оставить только небольшой набор кандидатов. Поскольку прямоугольники имеют простую форму, проверка выполняется очень быстро, но она может включать некоторые результаты, которые на самом деле не совпадают.</li>
<li><strong>Тонкий фильтр</strong>: оставшиеся кандидаты затем проверяются с помощью <strong>GEOS</strong>, той же геометрической библиотеки, которая используется в таких системах, как PostGIS. GEOS выполняет точные геометрические расчеты, например, пересекаются ли фигуры или одна содержит другую, чтобы получить правильные конечные результаты.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus принимает геометрические данные в формате <strong>WKT (Well-Known Text)</strong>, но внутри хранит их в формате <strong>WKB (Well-Known Binary).</strong> WKB более компактен, что сокращает объем памяти и улучшает ввод-вывод. Поля GEOMETRY также поддерживают хранение с отображением в памяти (mmap), поэтому большие наборы пространственных данных не обязательно должны полностью помещаться в оперативной памяти.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Повышение производительности с помощью R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">Задержка запросов остается неизменной при увеличении объема данных.</h3><p>Без индекса R-Tree время запроса линейно зависит от размера данных - 10-кратное увеличение объема данных означает примерно 10-кратное замедление запросов.</p>
<p>С R-Tree время запроса растет логарифмически. На наборах данных с миллионами записей пространственная фильтрация может быть в десятки и сотни раз быстрее, чем полное сканирование.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">Точность не жертвуется ради скорости</h3><p>R-дерево сужает круг кандидатов по ограничительным рамкам, а затем GEOS проверяет каждого из них с помощью точной геометрической математики. Все, что выглядит как совпадение, но на самом деле находится за пределами области запроса, удаляется во время второго прохода.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Повышение производительности гибридного поиска</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Сначала R-дерево удаляет записи за пределами целевой области. Затем Milvus выполняет векторное сходство (L2, IP или косинус) только для оставшихся кандидатов. Меньшее количество кандидатов означает меньшую стоимость поиска и более высокую скорость выполнения запросов в секунду (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Начало работы: ГЕОМЕТРИЯ с Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Определение коллекции и создание индексов</h3><p>Сначала определите поле DataType.GEOMETRY в схеме коллекции. Это позволит Milvus хранить и запрашивать геометрические данные.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">Вставка данных</h3><p>При вставке данных значения геометрии должны быть в формате WKT (Well-Known Text). Каждая запись включает геометрию, вектор и другие поля.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Выполнение гибридного пространственно-векторного запроса (пример)</h3><p><strong>Сценарий:</strong> найти 3 лучшие POI, которые наиболее похожи в векторном пространстве и расположены в пределах 2 км от заданной точки, например местоположения пользователя.</p>
<p>Используйте оператор ST_DWITHIN для применения фильтра расстояния. Значение расстояния указывается в <strong>метрах.</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Советы по использованию в производстве<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Всегда создавайте индекс R-Tree для полей GEOMETRY.</strong> Для наборов данных свыше 10 000 сущностей пространственные фильтры без индекса RTREE возвращаются к полному сканированию, и производительность резко падает.</li>
<li><strong>Используйте согласованную систему координат.</strong> Все данные о местоположении должны использовать одну и ту же систему (например, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). Смешение систем координат нарушает расчеты расстояний и локализации.</li>
<li><strong>Выберите правильный пространственный оператор для запроса.</strong> ST_DWITHIN для поиска "в пределах X метров". ST_CONTAINS или ST_WITHIN для проверки геозон и локализации.</li>
<li><strong>NULL-значения геометрии обрабатываются автоматически.</strong> Если поле GEOMETRY является нулевым (nullable=True), Milvus пропускает NULL-значения при пространственных запросах. Дополнительная логика фильтрации не требуется.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Требования к развертыванию<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы использовать эти функции в производстве, убедитесь, что ваша среда соответствует следующим требованиям.</p>
<p><strong>1. Версия Milvus</strong></p>
<p>Вы должны использовать <strong>Milvus 2.6.4 или более позднюю</strong> версию. Более ранние версии не поддерживают DataType.GEOMETRY или тип индекса <strong>RTREE</strong>.</p>
<p><strong>2. Версии SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: обновитесь до последней версии (рекомендуется серия <strong>2.6.x</strong> ). Это необходимо для правильной сериализации WKT и передачи параметров индекса RTREE.</li>
<li><strong>Java / Go / Node SDKs</strong>: проверьте примечания к выпуску каждого SDK и убедитесь, что они соответствуют определениям <strong>2.6.4</strong> proto.</li>
</ul>
<p><strong>3. Встроенные библиотеки геометрии</strong></p>
<p>Сервер Milvus уже включает Boost.Geometry и GEOS, поэтому вам не нужно устанавливать эти библиотеки самостоятельно.</p>
<p><strong>4. Использование памяти и планирование пропускной способности</strong></p>
<p>Индексы R-Tree используют дополнительную память. При планировании емкости не забудьте выделить бюджет на геометрические индексы, а также на векторные индексы, такие как HNSW или IVF. Поле GEOMETRY поддерживает хранение с привязкой к памяти (mmap), что позволяет снизить потребление памяти за счет хранения части данных на диске.</p>
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
    </button></h2><p>Семантический поиск на основе местоположения требует большего, чем прикручивание геофильтра к векторному запросу. Для него необходимы встроенные типы пространственных данных, соответствующие индексы и механизм запросов, способный работать с местоположением и векторами вместе.</p>
<p><strong>Milvus 2.6.4</strong> решает эту проблему с помощью встроенных полей <strong>GEOMETRY</strong> и индексов <strong>R-Tree</strong>. Пространственная фильтрация и векторный поиск выполняются в одном запросе к одному хранилищу данных. R-дерево быстро справляется с пространственной обрезкой, а GEOS обеспечивает точные результаты.</p>
<p>Для приложений, которым требуется поиск с учетом местоположения, это избавляет от необходимости запускать и синхронизировать две отдельные системы.</p>
<p>Если вы работаете над поиском с учетом местоположения или гибридным пространственно-векторным поиском, мы будем рады услышать ваш опыт.</p>
<p><strong>У вас есть вопросы о Milvus?</strong> Присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу в Slack</a> или запишитесь на 20-минутную сессию <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
