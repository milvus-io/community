---
id: getting-started-with-hnswlib.md
title: Начало работы с HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, библиотека, реализующая HNSW, отличается высокой эффективностью и
  масштабируемостью и отлично работает даже с миллионами точек. Узнайте, как
  реализовать ее за несколько минут.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">Семантический поиск</a> позволяет машинам понимать язык и выдавать лучшие результаты поиска, что очень важно для ИИ и аналитики данных. После того как язык представлен в виде <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">вкраплений</a>, поиск может осуществляться с помощью точных или приближенных методов. Приблизительный поиск ближайших соседей<a href="https://zilliz.com/glossary/anns">(ANN</a>) - это метод, используемый для быстрого поиска точек в наборе данных, которые наиболее близки к заданной точке запроса, в отличие от <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">точного поиска ближайших соседей</a>, который может быть вычислительно дорогим для высокоразмерных данных. ANN позволяет ускорить поиск, предоставляя результаты, которые приблизительно близки к ближайшим соседям.</p>
<p>Одним из алгоритмов поиска приближенных ближайших соседей (ANN) является <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), реализованный в <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, который и будет предметом сегодняшнего обсуждения. В этом блоге мы:</p>
<ul>
<li><p>Поймем алгоритм HNSW.</p></li>
<li><p>Изучим HNSWlib и его ключевые особенности.</p></li>
<li><p>Настроим HNSWlib, рассмотрим построение индекса и реализацию поиска.</p></li>
<li><p>Сравним его с Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Понимание HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> - это структура данных на основе графов, которая позволяет эффективно искать сходство, особенно в высокоразмерных пространствах, путем построения многослойного графа сетей "малых миров". Представленная в <a href="https://arxiv.org/abs/1603.09320">2016 году</a>, HNSW решает проблемы масштабируемости, связанные с традиционными методами поиска, такими как перебор и поиск на основе деревьев. Он идеально подходит для приложений с большими массивами данных, таких как рекомендательные системы, распознавание образов и <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">поиск с расширением (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Почему HNSW имеет значение</h3><p>HNSW значительно повышает производительность поиска ближайших соседей в высокоразмерных пространствах. Сочетание иерархической структуры с возможностью навигации по малому миру позволяет избежать вычислительной неэффективности старых методов, обеспечивая высокую производительность даже при работе с массивными и сложными наборами данных. Чтобы лучше понять это, давайте посмотрим, как это работает сейчас.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Принцип работы HNSW</h3><ol>
<li><p><strong>Иерархические слои:</strong> HNSW организует данные в иерархию слоев, где каждый слой содержит узлы, соединенные ребрами. Верхние слои более разреженные, что позволяет делать широкие "проходы" по графу, подобно тому, как при уменьшении масштаба карты можно увидеть только основные магистрали между городами. Плотность нижних слоев увеличивается, обеспечивая более тонкую детализацию и больше связей между ближайшими соседями.</p></li>
<li><p><strong>Концепция навигационных малых миров:</strong> Каждый слой в HNSW основан на концепции сети "малого мира", где узлы (точки данных) находятся на расстоянии всего нескольких "хопов" друг от друга. Алгоритм поиска начинает с самого верхнего, самого редкого слоя и работает вниз, переходя к все более плотным слоям для уточнения поиска. Такой подход напоминает переход от глобального обзора к детализации на уровне соседей, постепенно сужая область поиска.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Рис. 1</a>: Пример навигационного графа малого мира</p>
<ol start="3">
<li><strong>Структура, похожая на пропускной список:</strong> Иерархический аспект HNSW напоминает список пропусков - вероятностную структуру данных, в которой более высокие уровни имеют меньшее количество узлов, что позволяет ускорить начальный поиск.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Рис. 2</a>: Пример структуры списка пропусков</p>
<p>Чтобы найти 96 в данном списке пропусков, мы начинаем с верхнего уровня в крайнем левом узле с заголовком. Двигаясь вправо, мы встречаем 31, что меньше 96, поэтому переходим к следующему узлу. Теперь нам нужно спуститься на уровень ниже, где мы снова видим 31; поскольку оно все еще меньше 96, мы спускаемся еще на один уровень. Снова найдя 31, мы двигаемся вправо и достигаем 96 - нашего целевого значения. Таким образом, мы находим 96 без необходимости спускаться на самые нижние уровни списка пропусков.</p>
<ol start="4">
<li><p><strong>Эффективность поиска:</strong> Алгоритм HNSW начинает с узла входа на самом верхнем уровне, с каждым шагом переходя к более близким соседям. Он спускается по слоям, используя каждый из них для грубого и тонкого исследования, пока не достигнет самого нижнего слоя, где, вероятно, будут найдены наиболее похожие узлы. Такая многоуровневая навигация сокращает количество узлов и ребер, которые необходимо исследовать, что делает поиск быстрым и точным.</p></li>
<li><p><strong>Вставка и обслуживание</strong>: При добавлении нового узла алгоритм определяет его входной уровень на основе вероятности и соединяет его с близлежащими узлами с помощью эвристики выбора соседей. Эвристика направлена на оптимизацию связности, создавая связи, которые улучшают навигацию, но при этом уравновешивают плотность графа. Такой подход позволяет сохранить устойчивость структуры и адаптировать ее к новым данным.</p></li>
</ol>
<p>Хотя у нас есть фундаментальное понимание алгоритма HNSW, его реализация с нуля может оказаться непосильной задачей. К счастью, сообщество разработало такие библиотеки, как <a href="https://github.com/nmslib/hnswlib">HNSWlib</a>, чтобы упростить его использование и сделать его доступным, не заставляя вас ломать голову. Итак, давайте рассмотрим HNSWlib поближе.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Обзор HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, популярная библиотека, реализующая HNSW, отличается высокой эффективностью и масштабируемостью, хорошо работая даже с миллионами точек. Она достигает сублинейной временной сложности за счет быстрых переходов между слоями графа и оптимизации поиска для плотных, высокоразмерных данных. Вот ключевые особенности HNSWlib:</p>
<ul>
<li><p><strong>Структура на основе графа:</strong> Многослойный граф представляет точки данных, обеспечивая быстрый поиск ближайших соседей.</p></li>
<li><p><strong>Эффективность работы с высокоразмерными данными:</strong> Оптимизирована для работы с высокоразмерными данными, обеспечивая быстрый и точный приблизительный поиск.</p></li>
<li><p><strong>Сублинейное время поиска:</strong> достигается сублинейная сложность за счет пропуска слоев, что значительно повышает скорость.</p></li>
<li><p><strong>Динамические обновления:</strong> Поддерживает вставку и удаление узлов в режиме реального времени, не требуя полной перестройки графа.</p></li>
<li><p><strong>Эффективность использования памяти:</strong> Эффективное использование памяти, подходящее для больших наборов данных.</p></li>
<li><p><strong>Масштабируемость:</strong> Хорошо масштабируется до миллионов точек данных, что делает его идеальным для приложений среднего масштаба, таких как рекомендательные системы.</p></li>
</ul>
<p><strong>Примечание:</strong> HNSWlib отлично подходит для создания простых прототипов приложений векторного поиска. Однако из-за ограничений по масштабируемости для более сложных сценариев, включающих сотни миллионов или даже миллиарды точек данных, могут быть использованы лучшие варианты, такие как <a href="https://zilliz.com/blog/what-is-a-real-vector-database">специально созданные векторные базы данных</a>. Давайте посмотрим на это в действии.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Начало работы с HNSWlib: Пошаговое руководство<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом разделе мы продемонстрируем использование HNSWlib в качестве <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">библиотеки векторного поиска</a>, создав индекс HNSW, вставив данные и выполнив поиск. Начнем с установки:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Установка и импорт</h3><p>Чтобы начать работу с HNSWlib в Python, сначала установите ее с помощью pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Затем импортируйте необходимые библиотеки:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Подготовка данных</h3><p>В этом примере мы будем использовать <code translate="no">NumPy</code>для генерации случайного набора данных с 10 000 элементов, каждый из которых имеет размерность 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Давайте создадим данные:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Теперь наши данные готовы, давайте создадим индекс.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Построение индекса</h3><p>При построении индекса нам необходимо определить размерность векторов и тип пространства. Создадим индекс:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Этот параметр определяет метрику расстояния, используемую для сходства. Если установить значение <code translate="no">'l2'</code>, то будет использоваться евклидово расстояние (норма L2). Если вместо этого установить значение <code translate="no">'ip'</code>, то будет использоваться внутреннее произведение, что полезно для таких задач, как косинусное сходство.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Этот параметр задает размерность точек данных, с которыми вы будете работать. Она должна соответствовать размерности данных, которые вы планируете добавить в индекс.</li>
</ul>
<p>Вот как инициализировать индекс:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Здесь задается максимальное количество элементов, которые могут быть добавлены в индекс. <code translate="no">Num_elements</code> - это максимальная емкость, поэтому мы задаем значение 10 000, так как мы работаем с 10 000 точками данных.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Этот параметр управляет компромиссом между точностью и скоростью построения при создании индекса. Более высокое значение улучшает запоминание (точность), но увеличивает использование памяти и время построения. Обычные значения варьируются от 100 до 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Этот параметр определяет количество двунаправленных связей, создаваемых для каждой точки данных, что влияет на точность и скорость поиска. Типичные значения находятся в диапазоне от 12 до 48; 16 часто является хорошим балансом для умеренной точности и скорости.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: Параметр <code translate="no">ef</code>, сокращение от "exploration factor", определяет, сколько соседей просматривается во время поиска. При более высоком значении <code translate="no">ef</code> исследуется больше соседей, что, как правило, повышает точность (запоминание) поиска, но также делает его более медленным. И наоборот, более низкое значение <code translate="no">ef</code> ускоряет поиск, но может снизить точность.</li>
</ul>
<p>В данном случае значение <code translate="no">ef</code>, равное 50, означает, что алгоритм поиска будет оценивать до 50 соседей при нахождении наиболее похожих точек данных.</p>
<p>Примечание: <code translate="no">ef_construction</code> задает усилие поиска соседей при создании индекса, повышая точность, но замедляя построение. <code translate="no">ef</code> управляет усилием поиска при выполнении запроса, динамически балансируя скорость и отзыв для каждого запроса.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Выполнение поиска</h3><p>Чтобы выполнить поиск ближайших соседей с помощью HNSWlib, мы сначала создадим случайный вектор запроса. В этом примере размерность вектора соответствует индексированным данным.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Эта строка генерирует случайный вектор с той же размерностью, что и индексированные данные, обеспечивая совместимость для поиска ближайших соседей.</li>
<li><code translate="no">knn_query</code>: Метод ищет ближайших соседей <code translate="no">k</code> для <code translate="no">query_vector</code> в пределах индекса <code translate="no">p</code>. Он возвращает два массива: <code translate="no">labels</code>, которые содержат индексы ближайших соседей, и <code translate="no">distances</code>, которые указывают расстояния от вектора запроса до каждого из этих соседей. Здесь <code translate="no">k=5</code> указывает, что мы хотим найти пять ближайших соседей.</li>
</ul>
<p>Вот результаты после печати меток и расстояний:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Вот и все, простое руководство для начала работы с HNSWlib.</p>
<p>Как уже говорилось, HNSWlib - это отличный векторный поисковый механизм для создания прототипов или экспериментов с наборами данных среднего размера. Если у вас более высокие требования к масштабируемости или вам нужны другие функции корпоративного уровня, возможно, вам придется выбрать специально разработанную векторную базу данных, такую как <a href="https://zilliz.com/what-is-milvus">Milvus</a> с открытым исходным кодом или полностью управляемый сервис на <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Итак, в следующем разделе мы сравним HNSWlib с Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib против специализированных векторных баз данных, таких как Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/what-is-vector-database">Векторная база данных</a> хранит данные в виде математических представлений, что позволяет <a href="https://zilliz.com/ai-models">моделям машинного обучения</a> использовать поиск, рекомендации и генерацию текстов путем идентификации данных с помощью <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">метрик сходства</a> для контекстного понимания.</p>
<p>Библиотеки векторных индексов, такие как HNSWlib, улучшают<a href="https://zilliz.com/learn/vector-similarity-search">поиск</a> и извлечение<a href="https://zilliz.com/learn/vector-similarity-search">векторов</a>, но не обладают функциями управления, присущими полноценным базам данных. С другой стороны, векторные базы данных, такие как <a href="https://milvus.io/">Milvus</a>, предназначены для работы с векторными вкраплениями в масштабе, обеспечивая преимущества в управлении данными, индексировании и запросах, которых обычно не хватает отдельным библиотекам. Вот некоторые другие преимущества использования Milvus:</p>
<ul>
<li><p><strong>Высокоскоростной поиск по векторному сходству</strong>: Milvus обеспечивает производительность поиска на миллисекундном уровне в векторных наборах данных миллиардного масштаба, что идеально подходит для таких приложений, как поиск изображений, рекомендательные системы, обработка естественного языка<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP</a>) и поиск с расширенной генерацией<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>Масштабируемость и высокая доступность:</strong> Созданная для работы с огромными объемами данных, система Milvus масштабируется горизонтально и включает механизмы репликации и обхода отказа для обеспечения надежности.</p></li>
<li><p><strong>Распределенная архитектура:</strong> Milvus использует распределенную, масштабируемую архитектуру, которая разделяет хранение и вычисления на нескольких узлах для гибкости и надежности.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Гибридный поиск</strong></a><strong>:</strong> Milvus поддерживает мультимодальный поиск, гибридный <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">разреженный и плотный поиск</a>, а также гибридный плотный и <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">полнотекстовый поиск</a>, предлагая универсальные и гибкие функции поиска.</p></li>
<li><p><strong>Гибкая поддержка данных</strong>: Milvus поддерживает различные типы данных - векторы, скаляры и структурированные данные - обеспечивая беспрепятственное управление и анализ в рамках одной системы.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Активное сообщество</strong></a> <strong>и поддержка</strong>: Процветающее сообщество регулярно предоставляет обновления, учебные пособия и поддержку, обеспечивая соответствие Milvus потребностям пользователей и достижениям в данной области.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Интеграция с искусственным интеллектом</a>: Milvus интегрирован с различными популярными фреймворками и технологиями искусственного интеллекта, что облегчает разработчикам создание приложений с использованием привычного технологического стека.</p></li>
</ul>
<p>Milvus также предоставляет полностью управляемый сервис в <a href="https://zilliz.com/cloud">облаке Ziliz Cloud</a>, который не доставляет хлопот и работает в 10 раз быстрее, чем Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Сравнение: Milvus против HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Характеристика</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Масштабируемость</td><td style="text-align:center">Легко справляется с миллиардами векторов</td><td style="text-align:center">Подходит для небольших наборов данных из-за экономии оперативной памяти</td></tr>
<tr><td style="text-align:center">Идеально подходит для</td><td style="text-align:center">Прототипирования, экспериментов и приложений корпоративного уровня</td><td style="text-align:center">Ориентирован на прототипы и легкие задачи ANN</td></tr>
<tr><td style="text-align:center">Индексирование</td><td style="text-align:center">Поддерживает 10+ алгоритмов индексирования, включая HNSW, DiskANN, квантование и двоичное индексирование.</td><td style="text-align:center">Используется только HNSW на основе графа</td></tr>
<tr><td style="text-align:center">Интеграция</td><td style="text-align:center">Предлагает API и облачные нативные сервисы</td><td style="text-align:center">Служит в качестве легкой автономной библиотеки</td></tr>
<tr><td style="text-align:center">Производительность</td><td style="text-align:center">Оптимизируется для больших данных, распределенных запросов</td><td style="text-align:center">Предлагает высокую скорость, но ограниченную масштабируемость</td></tr>
</tbody>
</table>
<p>В целом, Milvus предпочтительнее для крупных производственных приложений со сложными потребностями в индексировании, в то время как HNSWlib идеально подходит для прототипирования и более простых случаев использования.</p>
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
    </button></h2><p>Семантический поиск может быть ресурсоемким, поэтому внутренняя структуризация данных, подобная той, которую выполняет HNSW, необходима для более быстрого поиска данных. Библиотеки, подобные HNSWlib, заботятся о реализации, поэтому у разработчиков есть готовые рецепты для прототипирования векторных возможностей. С помощью всего нескольких строк кода мы можем создать собственный индекс и выполнять поиск.</p>
<p>HNSWlib - отличный способ начать. Однако если вы хотите создавать сложные и готовые к производству приложения ИИ, то лучшим вариантом будут специально созданные векторные базы данных. Например, <a href="https://milvus.io/">Milvus</a> - это векторная база данных с открытым исходным кодом, обладающая множеством возможностей для предприятий, таких как высокоскоростной векторный поиск, масштабируемость, доступность, а также гибкость в отношении типов данных и языка программирования.</p>
<h2 id="Further-Reading" class="common-anchor-header">Читать далее<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">Что такое Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">Что такое HNSWlib? Библиотека на основе графиков для быстрого поиска по ANN </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">Что такое ScaNN (масштабируемые ближайшие соседи)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Инструмент для бенчмарков VectorDB с открытым исходным кодом</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Что такое векторные базы данных и как они работают? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Что такое RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Лучшие модели ИИ для ваших приложений GenAI | Zilliz</a></p></li>
</ul>
