---
id: milvus-supports-apache-parquet-file-supports.md
title: >-
  Milvus поддерживает импорт файлов Apache Parquet для повышения эффективности
  обработки данных
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: >-
  Благодаря использованию Apache Parquet пользователи могут оптимизировать
  процессы импорта данных и получить значительную экономию средств на хранение и
  вычисления.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>, высокомасштабируемая векторная база данных, известная своей способностью обрабатывать огромные массивы данных, делает значительный шаг вперед, представляя поддержку файлов Parquet в <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">версии 2.3.4</a>. Благодаря поддержке Apache Parquet пользователи смогут оптимизировать процессы импорта данных и получить значительную экономию средств на хранение и вычисления.</p>
<p>В нашей последней заметке мы рассказываем о преимуществах Parquet и о том, какие выгоды он дает пользователям Milvus. Мы обсуждаем мотивы интеграции этой функции и предоставляем пошаговое руководство по беспрепятственному импорту файлов Parquet в Milvus, открывая новые возможности для эффективного управления данными и их анализа.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">Что такое Apache Parquet?<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet</a> - это популярный формат файлов данных с открытым исходным кодом, ориентированный на столбцы и предназначенный для повышения эффективности хранения и обработки больших массивов данных. В отличие от традиционных форматов данных, ориентированных на строки, таких как CSV или JSON, Parquet хранит данные по столбцам, предлагая более эффективные схемы сжатия и кодирования данных. Такой подход позволяет повысить производительность, снизить требования к хранению и увеличить вычислительную мощность, что делает его идеальным для работы со сложными массивами данных.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">Как пользователи Milvus получают преимущества от поддержки импорта файлов Parquet<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus расширяет поддержку импорта файлов Parquet, предоставляя пользователям оптимизированный опыт и различные преимущества, включая снижение затрат на хранение и вычисления, оптимизацию управления данными и упрощение процесса импорта.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">Оптимизация эффективности хранения и оптимизация управления данными</h3><p>Parquet предоставляет гибкие возможности сжатия и эффективные схемы кодирования для различных типов данных, обеспечивая оптимальную эффективность хранения. Такая гибкость особенно ценна в облачных средах, где каждая унция экономии на хранении напрямую связана с ощутимым снижением затрат. Благодаря этой новой функции в Milvus пользователи могут без труда объединить все свои разнообразные данные в один файл, упростив управление данными и повысив общий уровень удобства работы. Эта функция особенно полезна для пользователей, работающих с типами данных Array переменной длины, которые теперь могут наслаждаться упрощенным процессом импорта данных.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">Улучшенная производительность запросов</h3><p>Столбцовая структура хранения данных Parquet и передовые методы сжатия значительно повышают производительность запросов. При выполнении запросов пользователи могут сосредоточиться исключительно на нужных данных, не сканируя нерелевантные данные. Такое выборочное чтение столбцов минимизирует нагрузку на процессор, что приводит к ускорению выполнения запросов.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">Широкая языковая совместимость</h3><p>Parquet доступен на многих языках, таких как Java, C++ и Python, и совместим с большим количеством инструментов обработки данных. Благодаря поддержке файлов Parquet пользователи Milvus, использующие различные SDK, могут легко генерировать файлы Parquet для разбора в базе данных.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">Как импортировать файлы Parquet в Milvus<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Если ваши данные уже представлены в формате файлов Parquet, импортировать их очень просто. Загрузите файл Parquet в систему хранения объектов, например MinIO, и вы готовы к импорту.</p>
<p>Приведенный ниже фрагмент кода является примером импорта файлов Parquet в Milvus.</p>
<pre><code translate="no">remote_files = []
<span class="hljs-keyword">try</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Prepare upload files&quot;</span>)
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=<span class="hljs-literal">False</span>)
    found = minio_client.bucket_exists(bucket_name)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> found:
        minio_client.make_bucket(bucket_name)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;MinIO bucket &#x27;{}&#x27; doesn&#x27;t exist&quot;</span>.<span class="hljs-built_in">format</span>(bucket_name))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

    <span class="hljs-comment"># set your remote data path</span>
    remote_data_path = <span class="hljs-string">&quot;milvus_bulkinsert&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file</span>(<span class="hljs-params">f: <span class="hljs-built_in">str</span></span>):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, <span class="hljs-string">&quot;parquet&quot;</span>, file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Upload file &#x27;{}&#x27; to &#x27;{}&#x27;&quot;</span>.<span class="hljs-built_in">format</span>(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

<span class="hljs-keyword">except</span> S3Error <span class="hljs-keyword">as</span> e:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Failed to connect MinIO server {}, error: {}&quot;</span>.<span class="hljs-built_in">format</span>(MINIO_ADDRESS, e))
    <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Successfully upload files: {}&quot;</span>.<span class="hljs-built_in">format</span>(remote_files))
<span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>, remote_files
<button class="copy-code-btn"></button></code></pre>
<p>Если ваши данные не являются файлами Parquet или имеют динамические поля, вы можете воспользоваться BulkWriter, нашим инструментом преобразования форматов данных, чтобы помочь вам создать файлы Parquet. BulkWriter теперь использует Parquet в качестве формата выходных данных по умолчанию, обеспечивая более интуитивный опыт для разработчиков.</p>
<p>Приведенный ниже фрагмент кода - это пример использования BulkWriter для создания файлов Parquet.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> json

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path=<span class="hljs-string">&quot;your_remote_data_path&quot;</span>,
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name=<span class="hljs-string">&quot;a-bucket&quot;</span>,
        ),
        file_type=BulkFileType.PARQUET,
)

<span class="hljs-comment"># append your data</span>
batch_count = <span class="hljs-number">10000</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    row = {
        <span class="hljs-string">&quot;id&quot;</span>: i,
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: i % <span class="hljs-number">128</span>,
        <span class="hljs-string">&quot;int16&quot;</span>: i % <span class="hljs-number">1000</span>,
        <span class="hljs-string">&quot;int32&quot;</span>: i % <span class="hljs-number">100000</span>,
        <span class="hljs-string">&quot;int64&quot;</span>: i,
        <span class="hljs-string">&quot;float&quot;</span>: i / <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;double&quot;</span>: i / <span class="hljs-number">7</span>,
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: {<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>},
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    }
    remote_writer.append_row(row)

<span class="hljs-comment"># append rows by numpy type</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    remote_writer.append_row({
        <span class="hljs-string">&quot;id&quot;</span>: np.int64(i + batch_count),
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: np.int8(i % <span class="hljs-number">128</span>),
        <span class="hljs-string">&quot;int16&quot;</span>: np.int16(i % <span class="hljs-number">1000</span>),
        <span class="hljs-string">&quot;int32&quot;</span>: np.int32(i % <span class="hljs-number">100000</span>),
        <span class="hljs-string">&quot;int64&quot;</span>: np.int64(i),
        <span class="hljs-string">&quot;float&quot;</span>: np.float32(i / <span class="hljs-number">3</span>),
        <span class="hljs-string">&quot;double&quot;</span>: np.float64(i / <span class="hljs-number">7</span>),
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: json.dumps({<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>}),
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    })

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.total_row_count}</span> rows appends&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.buffer_row_count}</span> rows in buffer not flushed&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generate data files...&quot;</span>)
remote_writer.commit()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Data files have been uploaded: <span class="hljs-subst">{remote_writer.batch_files}</span>&quot;</span>)
remote_files = remote_writer.batch_files
<button class="copy-code-btn"></button></code></pre>
<p>Затем вы можете начать импортировать файлы Parquet в Milvus.</p>
<pre><code translate="no">remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
<button class="copy-code-btn"></button></code></pre>
<p>Теперь ваши данные легко интегрируются в Milvus.</p>
<h2 id="Whats-Next" class="common-anchor-header">Что дальше?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Поскольку Milvus продолжает поддерживать постоянно растущие объемы данных, возникает проблема управления импортом больших объемов, особенно когда файлы Parquet превышают 10 ГБ. Чтобы решить эту проблему, мы планируем разделить импортируемые данные на скалярные и векторные колонки, создавая два файла Parquet на один импорт, чтобы снизить нагрузку на ввод-вывод. Для наборов данных, превышающих несколько сотен гигабайт, мы рекомендуем импортировать данные несколько раз.</p>
