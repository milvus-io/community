---
id: Milvus-Data-Migration-Tool.md
title: Представляем инструмент для миграции данных Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Узнайте, как использовать инструмент миграции данных Milvus, чтобы значительно
  повысить эффективность управления данными и сократить расходы на DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Представляем инструмент для миграции данных Milvus</custom-h1><p><em><strong>Важное замечание</strong>: инструмент Mivus Data Migration Tool был устаревшим. Для миграции данных из других баз данных в Milvus мы рекомендуем вам использовать более продвинутый инструмент Milvus-migration Tool.</em></p>
<p>В настоящее время инструмент Milvus-migration поддерживает:</p>
<ul>
<li>Elasticsearch в Milvus 2.x</li>
<li>Faiss в Milvus 2.x</li>
<li>Milvus 1.x - Milvus 2.x</li>
<li>Milvus 2.3.x на Milvus 2.3.x или выше.</li>
</ul>
<p>Мы будем поддерживать миграцию с других источников векторных данных, таких как Pinecone, Chroma и Qdrant. Следите за новостями.</p>
<p><strong>Для получения дополнительной информации смотрите <a href="https://milvus.io/docs/migrate_overview.md">документацию по Milvus-migration</a> или ее <a href="https://github.com/zilliztech/milvus-migration">репозиторий на GitHub</a>.</strong></p>
<p>--------------------------------- <strong>Mivus Data Migration Tool был устаревшим</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Обзор</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) - это инструмент с открытым исходным кодом, разработанный специально для импорта и экспорта файлов данных с помощью Milvus. MilvusDM может значительно повысить эффективность управления данными и снизить затраты на DevOps следующими способами:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss в Milvus</a>: Импорт распакованных данных из Faiss в Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 в Milvus</a>: импорт файлов HDF5 в Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus to Milvus</a>: перенос данных из исходного Milvus в другой целевой Milvus.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus to HDF5</a>: сохранение данных в Milvus в виде файлов HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>блог milvusdm 1.png</span> </span></p>
<p>MilvusDM размещен на <a href="https://github.com/milvus-io/milvus-tools">Github</a> и может быть легко установлен путем запуска командной строки <code translate="no">pip3 install pymilvusdm</code>. MilvusDM позволяет переносить данные в определенную коллекцию или раздел. В следующих разделах мы расскажем, как использовать каждый тип миграции данных.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss в Milvus</h3><h4 id="Steps" class="common-anchor-header">Шаги</h4><p>1.Загрузите <strong>файл F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Установите следующие параметры:</p>
<ul>
<li><p><code translate="no">data_path</code>: : Путь к данным (векторы и соответствующие им идентификаторы) в Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: : Адрес сервера Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Порт сервера Milvus.</p></li>
<li><p><code translate="no">mode</code>: Данные можно импортировать в Milvus, используя следующие режимы:</p>
<ul>
<li><p>Пропустить: игнорировать данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Append (Добавить): Добавить данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Перезаписать: Удалить данные перед вставкой, если коллекция или раздел уже существуют.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Имя принимающей коллекции для импорта данных.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Имя принимающего раздела для импорта данных.</p></li>
<li><p><code translate="no">collection_parameter</code>: Информация о конкретной коллекции, такая как размер вектора, размер индексного файла и метрика расстояния.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Запустите <strong>файл F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Код примера</h4><p>1.Считать файлы Faiss для получения векторов и соответствующих им идентификаторов.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Вставить полученные данные в Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 в Milvus</h3><h4 id="Steps" class="common-anchor-header">Шаги</h4><p>1.Загрузите <strong>файл H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Установите следующие параметры:</p>
<ul>
<li><p><code translate="no">data_path</code>: Путь к файлам HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Каталог, содержащий файлы HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Адрес сервера Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Порт сервера Milvus.</p></li>
<li><p><code translate="no">mode</code>: Данные можно импортировать в Milvus, используя следующие режимы:</p>
<ul>
<li><p>Пропустить: игнорировать данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Append (Добавить): Добавить данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Перезаписать: Удалить данные перед вставкой, если коллекция или раздел уже существуют.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Имя принимающей коллекции для импорта данных.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Имя принимающего раздела для импорта данных.</p></li>
<li><p><code translate="no">collection_parameter</code>: Информация о конкретной коллекции, например размер вектора, размер индексного файла и метрика расстояния.</p></li>
</ul>
<blockquote>
<p>Установите либо <code translate="no">data_path</code>, либо <code translate="no">data_dir</code>. <strong>Не</strong> задавайте оба варианта. Используйте <code translate="no">data_path</code>, чтобы указать несколько путей к файлам, или <code translate="no">data_dir</code>, чтобы указать каталог, в котором находится файл данных.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Запустите <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Код примера</h4><p>1.Прочитайте файлы HDF5, чтобы получить векторы и соответствующие им идентификаторы:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Вставьте полученные данные в Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus to Milvus</h3><h4 id="Steps" class="common-anchor-header">Шаги</h4><p>1.Загрузите <strong>файл M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Установите следующие параметры:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Исходный рабочий путь Milvus.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Настройки исходного Milvus MySQL. Если MySQL не используется, задайте параметр mysql_parameter равным ''.</p></li>
<li><p><code translate="no">source_collection</code>: Имена коллекции и ее разделов в исходном Milvus.</p></li>
<li><p><code translate="no">dest_host</code>: Адрес сервера Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: : Порт сервера Milvus.</p></li>
<li><p><code translate="no">mode</code>: Данные можно импортировать в Milvus, используя следующие режимы:</p>
<ul>
<li><p>Пропустить: игнорировать данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Append (Добавить): Добавить данные, если коллекция или раздел уже существуют.</p></li>
<li><p>Перезаписать: Удалить данные перед вставкой, если коллекция или раздел уже существуют.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Запустите <strong>файл M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Пример кода</h4><p>1.В соответствии с указанными метаданными коллекции или раздела, прочитайте файлы в папке <strong>milvus/db</strong> на локальном диске, чтобы получить векторы и соответствующие им идентификаторы из исходного Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Вставьте полученные данные в целевой Milvus.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Преобразование Milvus в HDF5</h3><h4 id="Steps" class="common-anchor-header">Шаги</h4><p>1.Загрузите <strong>файл M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Установите следующие параметры:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Исходный рабочий путь Milvus.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Настройки исходного Milvus MySQL. Если MySQL не используется, задайте параметр mysql_parameter равным ''.</p></li>
<li><p><code translate="no">source_collection</code>: Имена коллекции и ее разделов в исходном Milvus.</p></li>
<li><p><code translate="no">data_dir</code>: Каталог для хранения сохраненных HDF5-файлов.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Запустите <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Пример кода</h4><p>1.В соответствии с указанными метаданными коллекции или раздела, прочитайте файлы в каталоге <strong>milvus/db</strong> на локальном диске, чтобы получить векторы и соответствующие им идентификаторы.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Сохраните полученные данные в виде файлов HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Структура файлов MilvusDM</h3><p>Приведенная ниже блок-схема показывает, как MilvusDM выполняет различные задачи в зависимости от полученного YAML-файла:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Структура файла MilvusDM:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>ядро</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Выполняет клиентские операции в Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Читает файлы данных в формате HDF5 на вашем локальном диске. (Добавьте сюда свой код для поддержки чтения файлов данных в других форматах).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Читает файлы данных в Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Читает файлы данных в формате Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Читает метаданные в Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Создает коллекции или разделы на основе параметров в YAML-файлах и импортирует векторы и соответствующие векторные идентификаторы в Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Сохраняет данные в виде файлов HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Записывает журналы во время выполнения программы.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Импортирует данные из Faiss в Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Импортирует данные в файлах HDF5 в Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Переносит данные из исходного Milvus в целевой Milvus.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Экспортирует данные в Milvus и сохраняет их в виде файлов HDF5.</p></li>
<li><p><strong>main.py</strong>: Выполняет соответствующие задачи в соответствии с полученным YAML-файлом.</p></li>
<li><p><strong>setting.py</strong>: Конфигурации, связанные с запуском кода MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Создает пакеты файлов <strong>pymilvusdm</strong> и загружает их в PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Обзор</h3><p>MilvusDM в первую очередь занимается миграцией данных в Milvus и из него, включая Faiss в Milvus, HDF5 в Milvus, Milvus в Milvus и Milvus в HDF5.</p>
<p>В ближайших выпусках запланированы следующие функции:</p>
<ul>
<li><p>Импорт бинарных данных из Faiss в Milvus.</p></li>
<li><p>Блок-лист и список разрешений для миграции данных между исходным Milvus и целевым Milvus.</p></li>
<li><p>Слияние и импорт данных из нескольких коллекций или разделов в исходном Milvus в новую коллекцию в целевом Milvus.</p></li>
<li><p>Резервное копирование и восстановление данных Milvus.</p></li>
</ul>
<p>Проект MilvusDM является проектом с открытым исходным кодом на <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Любой вклад в проект приветствуется. Дайте ему звезду 🌟, и не стесняйтесь подать <a href="https://github.com/milvus-io/milvus-tools/issues">проблему</a> или представить свой собственный код!</p>
