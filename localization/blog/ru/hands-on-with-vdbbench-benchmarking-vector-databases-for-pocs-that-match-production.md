---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Практическая работа с VDBBench: Бенчмаркинг векторных баз данных для
  POC-тестов, которые соответствуют производственным
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Узнайте, как тестировать векторные базы данных на реальных производственных
  данных с помощью VDBBench. Пошаговое руководство по созданию пользовательских
  наборов данных POC, предсказывающих реальную производительность.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>Векторные базы данных сегодня являются основной частью инфраструктуры искусственного интеллекта, обеспечивая работу различных приложений на базе LLM для обслуживания клиентов, создания контента, поиска, рекомендаций и т. д.</p>
<p>На рынке представлено множество вариантов, от специально разработанных векторных баз данных, таких как Milvus и Zilliz Cloud, до традиционных баз данных с векторным поиском в качестве дополнения, и <strong>выбрать подходящий вариант не так просто, как прочитать графики контрольных показателей.</strong></p>
<p>Большинство команд, прежде чем принять решение, проводят пробное тестирование (POC), что в теории разумно, но на практике многие эталоны поставщиков, которые выглядят впечатляюще на бумаге, рушатся в реальных условиях.</p>
<p>Одна из главных причин заключается в том, что большинство заявлений о производительности основаны на устаревших наборах данных 2006-2012 годов (SIFT, GloVe, LAION), которые ведут себя совсем не так, как современные вкрапления. Например, в SIFT используются 128-мерные векторы, в то время как современные модели ИИ имеют гораздо более высокую размерность - 3 072 для последней модели OpenAI и 1 024 для модели Cohere - это серьезный сдвиг, который влияет на производительность, стоимость и масштабируемость.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">Решение: тестируйте на своих данных, а не на готовых бенчмарках<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Самое простое и эффективное решение: проводите POC-оценку с векторами, которые действительно генерирует ваше приложение. Это означает использование ваших моделей встраивания, ваших реальных запросов и вашего реального распределения данных.</p>
<p>Именно для этого создан <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> - инструмент бенчмаркинга векторных баз данных с открытым исходным кодом. Он поддерживает оценку и сравнение любых векторных баз данных, включая Milvus, Elasticsearch, pgvector и другие, и моделирует реальные производственные рабочие нагрузки.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Скачать VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Посмотреть таблицу лидеров →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">Что такое VDBBench</a></p>
<p>VDBbench позволяет вам:</p>
<ul>
<li><p><strong>Проводить тестирование с использованием собственных данных</strong> из ваших моделей встраивания.</p></li>
<li><p>Моделировать <strong>одновременные вставки, запросы и потоковое вхождение</strong></p></li>
<li><p>Измерение <strong>задержек P95/P99, устойчивой пропускной способности и точности запоминания</strong>.</p></li>
<li><p>Проведение бенчмарков для нескольких баз данных в одинаковых условиях.</p></li>
<li><p>Позволяет <strong>тестировать пользовательские наборы данных</strong>, чтобы результаты действительно соответствовали производственным.</p></li>
</ul>
<p>Далее мы расскажем вам о том, как провести POC-тестирование производственного уровня с помощью VDBBench и ваших реальных данных, чтобы вы могли сделать уверенный и надежный выбор.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Как оценить VectorDB с вашими пользовательскими наборами данных с помощью VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем приступить к работе, убедитесь, что у вас установлен Python 3.11 или выше. Вам понадобятся векторные данные в формате CSV или NPY, примерно 2-3 часа на полную настройку и тестирование, а также промежуточные знания Python для устранения неполадок в случае необходимости.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Установка и настройка</h3><p>Если вы оцениваете одну базу данных, выполните эту команду:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Если вы хотите сравнить все поддерживаемые базы данных, выполните эту команду:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Для конкретных клиентов баз данных (например, Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Проверьте эту <a href="https://github.com/zilliztech/VectorDBBench">страницу GitHub</a> для всех поддерживаемых баз данных и команд их установки.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Запуск VDBBench</h3><p>Запустите <strong>VDBBench</strong> с помощью:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Ожидаемый вывод консоли: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Веб-интерфейс будет доступен локально:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Подготовка данных и преобразование формата</h3><p>VDBBench требует структурированных файлов Parquet с определенными схемами для обеспечения последовательного тестирования различных баз данных и наборов данных.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Имя файла</strong></th><th style="text-align:center"><strong>Назначение</strong></th><th style="text-align:center"><strong>Требуемый</strong></th><th style="text-align:center"><strong>Содержание Пример</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Коллекция векторов для вставки в базу данных</td><td style="text-align:center">✅</td><td style="text-align:center">Идентификатор вектора + данные вектора (список[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Коллекция векторов для запросов</td><td style="text-align:center">✅</td><td style="text-align:center">Векторный идентификатор + векторные данные (список[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">Истина для векторов запросов (список идентификаторов ближайших соседей)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k список ID ближайших соседей]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Метки (метаданные, описывающие сущности, отличные от векторов)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; label</td></tr>
</tbody>
</table>
<p>Необходимые спецификации файлов:</p>
<ul>
<li><p><strong>Файл обучающего вектора (train.parquet)</strong> должен содержать колонку ID с инкрементными целыми числами и колонку вектора, содержащую массивы float32. Названия столбцов настраиваются, но столбец ID должен использовать целочисленные типы для правильной индексации.</p></li>
<li><p><strong>Файл тестовых векторов (test.parquet)</strong> имеет ту же структуру, что и обучающие данные. Имя столбца ID должно быть "id", а имена столбцов вектора могут быть настроены в соответствии со схемой данных.</p></li>
<li><p><strong>Файл истины (neighbors.parquet)</strong> содержит эталонные ближайшие соседи для каждого тестового запроса. Он требует столбца ID, соответствующего идентификаторам тестовых векторов, и столбца массива neighbors, содержащего правильные идентификаторы ближайших соседей из обучающего набора.</p></li>
<li><p><strong>Файл скалярных меток (scalar_labels.parquet)</strong> является необязательным и содержит метки метаданных, связанные с обучающими векторами, полезные для тестирования фильтрованного поиска.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Проблемы с форматами данных</h3><p>Большинство производственных векторных данных существует в форматах, которые не соответствуют требованиям VDBBench. Файлы CSV обычно хранят вкрапления в виде строковых представлений массивов, файлы NPY содержат необработанные числовые матрицы без метаданных, а экспорт баз данных часто использует JSON или другие структурированные форматы.</p>
<p>Преобразование этих форматов вручную включает несколько сложных этапов: разбор строковых представлений в числовые массивы, вычисление точных ближайших соседей с помощью библиотек типа FAISS, правильное разбиение наборов данных с сохранением согласованности идентификаторов и обеспечение соответствия всех типов данных спецификациям Parquet.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Автоматизированное преобразование форматов</h3><p>Чтобы упростить процесс преобразования, мы разработали скрипт на Python, который автоматически справляется с преобразованием форматов, вычислением истинности и правильной структуризацией данных.</p>
<p><strong>Входной формат CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Входной формат NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Реализация сценария преобразования</h3><p><strong>Установите необходимые зависимости:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Выполнить преобразование:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ссылка на параметр:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Имя параметра</strong></th><th style="text-align:center"><strong>Требуется</strong></th><th style="text-align:center"><strong>Тип</strong></th><th style="text-align:center"><strong>Описание</strong></th><th style="text-align:center"><strong>Значение по умолчанию</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Да</td><td style="text-align:center">Строка</td><td style="text-align:center">Путь к тренировочным данным, поддерживается формат CSV или NPY. CSV должен содержать столбец emb, если столбец id отсутствует, будет произведена автогенерация</td><td style="text-align:center">Нет</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Да</td><td style="text-align:center">Строка</td><td style="text-align:center">Путь к данным запроса, поддерживает формат CSV или NPY. Формат такой же, как у данных для обучения</td><td style="text-align:center">Нет</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Да</td><td style="text-align:center">Строка</td><td style="text-align:center">Путь к выходному каталогу, сохраняет преобразованные паркетные файлы и файлы индексов соседей</td><td style="text-align:center">Нет</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">Нет</td><td style="text-align:center">Строка</td><td style="text-align:center">Путь к CSV-файлу с метками, должен содержать колонку labels (отформатированную как массив строк), используется для сохранения меток</td><td style="text-align:center">Нет</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">Нет</td><td style="text-align:center">Integer</td><td style="text-align:center">Количество ближайших соседей, которое нужно вернуть при вычислении</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Структура выходного каталога:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Полный сценарий преобразования</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Выходные данные процесса преобразования:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Сгенерированные файлы Проверка:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Конфигурация пользовательских наборов данных</h3><p>Перейдите в раздел конфигурации пользовательских наборов данных в веб-интерфейсе:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Интерфейс конфигурации предоставляет поля для метаданных набора данных и указания пути к файлу:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Параметры конфигурации:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Имя параметра</strong></th><th style="text-align:center"><strong>Значение</strong></th><th style="text-align:center"><strong>Предложения по конфигурации</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Имя</td><td style="text-align:center">Имя набора данных (уникальный идентификатор)</td><td style="text-align:center">Любое имя, например, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Путь к папке</td><td style="text-align:center">Путь к каталогу файлов набора данных</td><td style="text-align:center">например, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Размеры вектора</td><td style="text-align:center">Должны соответствовать файлам данных, например, 768</td></tr>
<tr><td style="text-align:center">размер</td><td style="text-align:center">Количество векторов (необязательно)</td><td style="text-align:center">Можно оставить пустым, система автоматически определит</td></tr>
<tr><td style="text-align:center">тип метрики</td><td style="text-align:center">Метод измерения сходства</td><td style="text-align:center">Обычно используется L2 (евклидово расстояние) или IP (внутреннее произведение).</td></tr>
<tr><td style="text-align:center">имя файла train</td><td style="text-align:center">Имя файла обучающего набора (без расширения .parquet).</td><td style="text-align:center">Если <code translate="no">train.parquet</code>, заполните <code translate="no">train</code>. Для нескольких файлов используйте разделение запятыми, например, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">имя файла test</td><td style="text-align:center">Имя файла набора запросов (без расширения .parquet)</td><td style="text-align:center">Если <code translate="no">test.parquet</code>, заполните <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">имя файла грунтовой истины</td><td style="text-align:center">Имя файла Ground Truth (без расширения .parquet)</td><td style="text-align:center">Если <code translate="no">neighbors.parquet</code>, заполните <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">train id name</td><td style="text-align:center">Имя столбца ID обучающих данных</td><td style="text-align:center">Обычно <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">имя вектора тренировки</td><td style="text-align:center">Имя столбца вектора обучающих данных</td><td style="text-align:center">Если сгенерированное скриптом имя столбца <code translate="no">emb</code>, заполните <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">имя столбца test emb</td><td style="text-align:center">Имя столбца вектора тестовых данных</td><td style="text-align:center">Обычно совпадает с именем столбца train emb, например, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">ground truth emb name</td><td style="text-align:center">Имя столбца ближайших соседей в Ground Truth</td><td style="text-align:center">Если имя столбца <code translate="no">neighbors_id</code>, заполните <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">имя файла скалярных меток</td><td style="text-align:center">(Необязательно) Имя файла меток (без расширения .parquet).</td><td style="text-align:center">Если был сгенерирован файл <code translate="no">scalar_labels.parquet</code>, заполните файл <code translate="no">scalar_labels</code>, в противном случае оставьте пустым</td></tr>
<tr><td style="text-align:center">процентное соотношение меток</td><td style="text-align:center">(Необязательно) Коэффициент фильтрации меток</td><td style="text-align:center">например, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, оставить пустым, если фильтрация меток не требуется</td></tr>
<tr><td style="text-align:center">описание</td><td style="text-align:center">Описание набора данных</td><td style="text-align:center">Нельзя указывать бизнес-контекст или метод генерации</td></tr>
</tbody>
</table>
<p>Сохраните конфигурацию, чтобы продолжить настройку теста.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Выполнение теста и конфигурация базы данных</h3><p>Войдите в интерфейс конфигурации теста:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Выбор и настройка базы данных (на примере Milvus):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Назначение наборов данных:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Тестовые метаданные и маркировка:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Выполнение тестов:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Анализ результатов и оценка производительности<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Интерфейс результатов предоставляет исчерпывающую аналитику производительности:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Сводка тестовой конфигурации</h3><p>В ходе оценки были протестированы уровни параллелизма 1, 5 и 10 одновременных операций (ограниченные доступными аппаратными ресурсами), размер вектора 768, размер набора данных 3 000 обучающих векторов и 3 000 тестовых запросов, при этом фильтрация скалярных меток была отключена в этом тестовом цикле.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Важнейшие соображения по реализации</h3><ul>
<li><p><strong>Согласованность размеров:</strong> Несоответствие размерности векторов в обучающем и тестовом наборах данных приведет к немедленному отказу в тестировании. Чтобы избежать ошибок во время выполнения, проверьте согласованность размеров во время подготовки данных.</p></li>
<li><p><strong>Точность исходных данных:</strong> неправильные расчеты исходных данных приводят к недействительности измерений коэффициента отзыва. Предоставленный сценарий преобразования использует FAISS с расстоянием L2 для точного вычисления ближайших соседей, что обеспечивает точность эталонных результатов.</p></li>
<li><p><strong>Требования к масштабу набора данных:</strong> Небольшие наборы данных (менее 10 000 векторов) могут приводить к несоответствующим измерениям QPS из-за недостаточной генерации нагрузки. Рассмотрите возможность увеличения размера набора данных для более надежного тестирования пропускной способности.</p></li>
<li><p><strong>Распределение ресурсов:</strong> Ограничения памяти и процессора контейнера Docker могут искусственно ограничить производительность базы данных во время тестирования. Следите за использованием ресурсов и при необходимости корректируйте ограничения контейнеров для точного измерения производительности.</p></li>
<li><p><strong>Мониторинг ошибок:</strong> <strong>VDBBench</strong> может записывать ошибки в консольный вывод, которые не отображаются в веб-интерфейсе. Отслеживайте журналы терминала во время выполнения теста для получения полной диагностической информации.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Дополнительные инструменты: Генерация тестовых данных<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Для разработки и стандартных сценариев тестирования можно генерировать синтетические наборы данных с контролируемыми характеристиками:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Эта утилита генерирует наборы данных с заданными размерами и количеством записей для прототипирования и базовых сценариев тестирования.</p>
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
    </button></h2><p>Вы только что узнали, как освободиться от "театра эталонов", который ввел в заблуждение множество решений в области векторных баз данных. С помощью VDBBench и собственного набора данных вы можете генерировать показатели QPS, задержки и запоминания производственного уровня - больше никаких догадок на основе академических данных десятилетней давности.</p>
<p>Перестаньте полагаться на консервированные эталоны, которые не имеют ничего общего с вашими реальными рабочими нагрузками. Всего за несколько часов, а не недель, вы увидите, как именно работает база данных с <em>вашими</em> векторами, запросами и ограничениями. Это значит, что вы можете с уверенностью принимать решения, избегать болезненных переписываний в дальнейшем и создавать системы, которые действительно работают в производстве.</p>
<ul>
<li><p>Попробуйте VDBBench с вашими рабочими нагрузками: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a>.</p></li>
<li><p>Посмотрите результаты тестирования основных векторных баз данных: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench Leaderboard</a></p></li>
</ul>
<p>У вас есть вопросы или вы хотите поделиться своими результатами? Присоединяйтесь к обсуждению на<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> или общайтесь с нашим сообществом в <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Это первый пост в нашей серии VectorDB POC Guide - практические, проверенные разработчиками методы создания инфраструктуры искусственного интеллекта, работающей в условиях реальной нагрузки. Следите за новостями!</em></p>
