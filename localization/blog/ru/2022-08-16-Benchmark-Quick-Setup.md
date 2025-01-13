---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: Краткое руководство по бенчмаркингу Milvus 2.1
author: Yanliang Qiao
date: 2022-08-16T00:00:00.000Z
desc: >-
  Следуйте нашему пошаговому руководству, чтобы самостоятельно выполнить
  бенчмарк Milvus 2.1.
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Обложка</span> </span></p>
<p>Недавно мы обновили <a href="https://milvus.io/docs/v2.1.x/benchmark.md">отчет о бенчмарке Milvus 2.1</a>. Тесты с набором данных из 1 миллиона векторов показали, что QPS может быть значительно увеличен за счет объединения запросов с <a href="https://milvus.io/docs/v2.1.x/benchmark.md#Terminology">малым</a> числом.</p>
<p>Ниже приведено несколько простых скриптов, которые помогут вам легко воспроизвести тесты.</p>
<h2 id="Procedures" class="common-anchor-header">Процедуры<button data-href="#Procedures" class="anchor-icon" translate="no">
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
<li><p>Разверните автономную систему Milvus или кластер. В данном случае IP-адрес сервера Milvus - 10.100.31.105.</p></li>
<li><p>Разверните клиент. В данном случае мы используем Ubuntu 18.04 и Python 3.8.13 для развертывания. Выполните следующий код для установки PyMilvus 2.1.1.</p></li>
</ol>
<pre><code translate="no">pip install pymilvus==2.1.1
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Загрузите и скопируйте следующие файлы в ту же рабочую директорию, что и клиент. В данном случае рабочим каталогом является <code translate="no">/go_ben</code>.</p>
<ul>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py"><code translate="no">collection_prepare.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py"><code translate="no">go_benchmark.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark"><code translate="no">benchmark</code></a> (для Ubuntu) или <a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac"><code translate="no">benchmark-mac</code></a> (для macOS)</p></li>
</ul>
<p><strong>Примечание:</strong></p>
<ul>
<li><p><code translate="no">benchmark</code> и <code translate="no">benchmark-mac</code> - это исполняемые файлы, разработанные и скомпилированные с помощью Go SDK 2.1.1. Они используются только для проведения параллельного поиска.</p></li>
<li><p>Для пользователей Ubuntu загрузите <code translate="no">benchmark</code>; для пользователей macOS загрузите <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Для доступа к <code translate="no">benchmark</code> или <code translate="no">benchmark-mac</code> требуются права исполнителя.</p></li>
<li><p>Пользователи Mac должны доверять файлу <code translate="no">benchmark-mac</code>, настроив Security &amp; Privacy в System Preferences.</p></li>
<li><p>Настройки одновременного поиска можно найти и изменить в исходном коде <code translate="no">go_benchmark.py</code>.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Создайте коллекцию и вставьте в нее векторные данные.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-comment"># python collection_prepare.py 10.100.31.105 </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Откройте <code translate="no">/tmp/collection_prepare.log</code>, чтобы проверить результат работы.</li>
</ol>
<pre><code translate="no">...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Вызовите <code translate="no">benchmark</code> (или <code translate="no">benchmark-mac</code> на macOS) для выполнения параллельного поиска.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-meta"># python go_benchmark.py 10.100.31.105 ./benchmark</span>
[<span class="hljs-meta">write_json_file</span>] <span class="hljs-function">Remove <span class="hljs-title">file</span>(<span class="hljs-params">search_vector_file.json</span>).
[write_json_file] Write json <span class="hljs-keyword">file</span>:search_vector_file.json done.
Params of go_benchmark: [&#x27;./benchmark&#x27;, &#x27;locust&#x27;, &#x27;-u&#x27;, &#x27;10.100.31.105:19530&#x27;, &#x27;-q&#x27;, &#x27;search_vector_file.json&#x27;, &#x27;-s&#x27;, &#x27;</span>{\n  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;random_1m&quot;</span>,\n  <span class="hljs-string">&quot;partition_names&quot;</span>: [],\n  <span class="hljs-string">&quot;fieldName&quot;</span>: <span class="hljs-string">&quot;embedding&quot;</span>,\n  <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,\n  <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>,\n  <span class="hljs-string">&quot;params&quot;</span>: {\n    <span class="hljs-string">&quot;sp_value&quot;</span>: <span class="hljs-number">64</span>,\n    <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>\n  },\n  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">1</span>,\n  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-literal">null</span>,\n  <span class="hljs-string">&quot;output_fields&quot;</span>: [],\n  <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">600</span>\n}<span class="hljs-string">&#x27;, &#x27;</span>-p<span class="hljs-string">&#x27;, &#x27;</span><span class="hljs-number">10&#x27;</span>, <span class="hljs-string">&#x27;-f&#x27;</span>, <span class="hljs-string">&#x27;json&#x27;</span>, <span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;60&#x27;</span>, <span class="hljs-string">&#x27;-i&#x27;</span>, <span class="hljs-string">&#x27;20&#x27;</span>, <span class="hljs-string">&#x27;-l&#x27;</span>, <span class="hljs-string">&#x27;go_log_file.log&#x27;</span>]
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - go search     <span class="hljs-number">9665</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.679</span>     <span class="hljs-number">6.499</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">12.810</span>  |    <span class="hljs-number">483.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - go search    <span class="hljs-number">19448</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.443</span>     <span class="hljs-number">6.549</span>    <span class="hljs-number">78.121</span>    <span class="hljs-number">13.401</span>  |    <span class="hljs-number">489.22</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29170</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.568</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">76.887</span>    <span class="hljs-number">12.828</span>  |    <span class="hljs-number">486.15</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][   DEBUG] - go search run finished, parallel: <span class="hljs-number">10</span>(benchmark_run.go:<span class="hljs-number">95</span>:benchmark)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29180</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.560</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">13.014</span>  |    <span class="hljs-number">486.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">160</span>:samplingLoop)
Result of go_benchmark: {<span class="hljs-string">&#x27;response&#x27;</span>: True, <span class="hljs-string">&#x27;err_code&#x27;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&#x27;err_message&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>} 
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Откройте файл <code translate="no">go_log_file.log</code> в текущем каталоге, чтобы проверить подробный журнал поиска. Ниже приведена информация о поиске, которую можно найти в журнале поиска.<ul>
<li><p>reqs: количество запросов на поиск с момента возникновения параллелизма до текущего момента (текущий промежуток времени)</p></li>
<li><p>fails: количество неудачных запросов в процентах от запросов в текущем временном интервале</p></li>
<li><p>Avg: среднее время отклика запроса в текущем временном интервале (единица измерения: миллисекунды)</p></li>
<li><p>Min: минимальное время отклика запроса в текущем временном интервале (единица измерения: миллисекунды)</p></li>
<li><p>Max: максимальное время ответа на запрос в текущем временном интервале (единицы измерения: миллисекунды)</p></li>
<li><p>Median: медианное время ответа на запрос в текущем временном интервале (единицы измерения: миллисекунды)</p></li>
<li><p>req/s: количество запросов в секунду, т.е. QPS</p></li>
<li><p>failures/s: среднее количество неудачных запросов в секунду в текущем временном интервале.</p></li>
</ul></li>
</ol>
<h2 id="Downloading-Scripts-and-Executable-Files" class="common-anchor-header">Загрузка скриптов и исполняемых файлов<button data-href="#Downloading-Scripts-and-Executable-Files" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py">collection_prepare.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py">go_benchmark.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark">benchmark</a> для Ubuntu</p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac">benchmark-mac</a> для macOS</p></li>
</ul>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Читайте подробнее в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
