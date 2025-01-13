---
id: inside-milvus-1.1.0.md
title: Новые возможности
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 прибыл! Новые функции, улучшения и исправления ошибок доступны
  уже сейчас.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Внутри Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> - это постоянный проект с открытым исходным кодом (OSS), направленный на создание самой быстрой и надежной в мире базы данных векторов. Новые функции в Milvus v1.1.0 - это первое из множества грядущих обновлений, благодаря долгосрочной поддержке сообщества разработчиков открытого ПО и спонсорству компании Zilliz. В этой статье блога рассказывается о новых функциях, улучшениях и исправлениях ошибок, включенных в Milvus v1.1.0.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#new-features">Новые возможности</a></li>
<li><a href="#improvements">Улучшения</a></li>
<li><a href="#bug-fixes">Исправления ошибок</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Новые возможности<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Как и любой OSS-проект, Milvus - это вечная работа над собой. Мы стараемся прислушиваться к мнению наших пользователей и сообщества разработчиков с открытым исходным кодом, чтобы определить приоритетность наиболее важных функций. Последнее обновление, Milvus v1.1.0, предлагает следующие новые возможности:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Указывать разделы с помощью вызовов методов <code translate="no">get_entity_by_id()</code>.</h3><p>Чтобы еще больше ускорить поиск векторного сходства, Milvus 1.1.0 теперь поддерживает получение векторов из указанного раздела. Как правило, Milvus поддерживает запрос векторов через указанные идентификаторы векторов. В Milvus 1.0 при вызове метода <code translate="no">get_entity_by_id()</code> выполняется поиск по всей коллекции, что может занять много времени при работе с большими наборами данных. Как видно из приведенного ниже кода, <code translate="no">GetVectorsByIdHelper</code> использует структуру <code translate="no">FileHolder</code> для перебора и поиска конкретного вектора.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>Однако эта структура не фильтруется никакими разделами в <code translate="no">FilesByTypeEx()</code>. В Milvus v1.1.0 система может передавать имена разделов в цикл <code translate="no">GetVectorsIdHelper</code>, чтобы <code translate="no">FileHolder</code> содержал только сегменты из указанных разделов. Другими словами, если вы точно знаете, к какому разделу относится искомый вектор, вы можете указать имя раздела в вызове метода <code translate="no">get_entity_by_id()</code>, чтобы ускорить процесс поиска.</p>
<p>Мы не только внесли изменения в код, управляющий системными запросами на уровне сервера Milvus, но и обновили все наши SDK (Python, Go, C++, Java и RESTful), добавив параметр для указания имен разделов. Например, в pymilvus определение <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> изменено на <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Указание разделов с помощью вызовов метода <code translate="no">delete_entity_by_id()</code>.</h3><p>Чтобы сделать управление векторами более эффективным, Milvus v1.1.0 теперь поддерживает указание имен разделов при удалении вектора в коллекции. В Milvus 1.0 векторы в коллекции можно было удалять только по идентификатору. При вызове метода delete Milvus просканирует все векторы в коллекции. Однако при работе с массивными наборами данных, состоящими из миллионов, миллиардов или даже триллионов векторов, гораздо эффективнее сканировать только соответствующие разделы. Аналогично новой возможности указания разделов при вызове метода <code translate="no">get_entity_by_id()</code>, в код Milvus были внесены изменения, использующие ту же логику.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Новый метод <code translate="no">release_collection()</code></h3><p>Чтобы освободить память, которую Milvus использовал для загрузки коллекций во время выполнения, в Milvus v1.1.0 был добавлен новый метод <code translate="no">release_collection()</code> для ручной выгрузки определенных коллекций из кэша.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Улучшения<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Несмотря на то, что новые возможности - это, как правило, все, что нужно, важно также улучшать то, что у нас уже есть. Ниже перечислены обновления и другие общие улучшения по сравнению с Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Улучшена производительность вызова метода <code translate="no">get_entity_by_id()</code>.</h3><p>На диаграмме ниже представлено сравнение производительности векторного поиска между Milvus v1.0 и Milvus v1.1.0:</p>
<blockquote>
<p>ПРОЦЕССОР: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Размер файла сегмента = 1024 MB <br/>Количество строк = 1,000,000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">Идентификатор запроса Num</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 мс</td><td style="text-align:center">2 мс</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 мс</td><td style="text-align:center">19 мс</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib обновлен до версии 0.5.0</h3><p>Milvus использует несколько широко используемых библиотек индексов, включая Faiss, NMSLIB, Hnswlib и Annoy, чтобы упростить процесс выбора подходящего типа индекса для конкретного сценария.</p>
<p>Hnswlib была обновлена с версии 0.3.0 до версии 0.5.0 в Milvus 1.1.0 из-за ошибки, обнаруженной в предыдущей версии. Кроме того, обновление Hnswlib улучшает производительность <code translate="no">addPoint()</code> при построении индексов.</p>
<p>Разработчик Zilliz создал запрос на исправление (PR) для улучшения производительности Hnswlib при построении индексов в Milvus. Подробности см. в <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a>.</p>
<p>На диаграмме ниже представлено сравнение производительности <code translate="no">addPoint()</code> между Hnswlib 0.5.0 и предложенным PR:</p>
<blockquote>
<p>ПРОЦЕССОР: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Набор данных: sift_1M (row count = 1000000, dim = 128, space = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construction = 100</td><td style="text-align:center">274406 мс</td><td style="text-align:center">265631 мс</td></tr>
<tr><td style="text-align:center">M = 16, ef_construction = 200</td><td style="text-align:center">522411 мс</td><td style="text-align:center">499639 мс</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Улучшенная производительность обучения индекса IVF</h3><p>Создание индекса включает в себя обучение, вставку и запись данных на диск. В Milvus 1.1.0 улучшен компонент обучения при создании индекса. На диаграмме ниже представлено сравнение производительности обучения индекса ЭКО между Milvus 1.0 и Milvus 1.1.0:</p>
<blockquote>
<p>ПРОЦЕССОР: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Набор данных: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (мс)</th><th style="text-align:center">v1.1.0 (мс)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Исправления ошибок<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы также исправили несколько ошибок, чтобы сделать Milvus более стабильным и эффективным при работе с векторными наборами данных. Подробнее см. в разделе <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">"Исправленные проблемы"</a>.</p>
