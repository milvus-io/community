---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Как беспрепятственно перенести данные в Milvus: Исчерпывающее руководство'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Исчерпывающее руководство по переносу данных из Elasticsearch, FAISS и старых
  версий Milvus 1.x в Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> - это надежная векторная база данных с открытым исходным кодом для <a href="https://zilliz.com/learn/vector-similarity-search">поиска сходства</a>, которая может хранить, обрабатывать и извлекать миллиарды и даже триллионы векторных данных с минимальной задержкой. Она также отличается высокой масштабируемостью, надежностью, облачностью и многофункциональностью. В <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">новом выпуске Milvus</a> появилось еще больше интересных функций и улучшений, включая <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">поддержку GPU</a> для более чем 10-кратного повышения производительности и MMap для увеличения емкости хранилища на одной машине.</p>
<p>По состоянию на сентябрь 2023 года Milvus заработал почти 23 000 звезд на GitHub и имеет десятки тысяч пользователей из разных отраслей с различными потребностями. Он становится еще более популярным по мере распространения технологий генеративного ИИ, таких как <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>. Он является неотъемлемым компонентом различных стеков ИИ, особенно фреймворка <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">дополненной генерации для поиска</a>, который решает проблему галлюцинаций в больших языковых моделях.</p>
<p>Чтобы удовлетворить растущий спрос со стороны новых пользователей, которые хотят перейти на Milvus, и существующих пользователей, которые хотят обновиться до последних версий Milvus, мы разработали <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. В этом блоге мы рассмотрим возможности Milvus Migration и расскажем, как быстро перенести данные в Milvus из Milvus 1.x, <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> и последующих версий.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, мощный инструмент для миграции данных<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> - это инструмент для миграции данных, написанный на языке Go. Он позволяет пользователям легко переносить данные из старых версий Milvus (1.x), FAISS, Elasticsearch 7.0 и последующих версий в Milvus 2.x.</p>
<p>На схеме ниже показано, как мы создали Milvus Migration и как она работает.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Как Milvus Migration переносит данные</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Из Milvus 1.x и FAISS в Milvus 2.x</h4><p>Миграция данных из Milvus 1.x и FAISS включает в себя разбор содержимого исходных файлов данных, их преобразование в формат хранения данных Milvus 2.x и запись данных с помощью Milvus SDK <code translate="no">bulkInsert</code>. Весь этот процесс основан на потоке, теоретически ограничен только дисковым пространством и хранит файлы данных на вашем локальном диске, S3, OSS, GCP или Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Переход с Elasticsearch на Milvus 2.x</h4><p>При миграции данных из Elasticsearch получение данных происходит по-другому. Данные не берутся из файлов, а последовательно извлекаются с помощью API прокрутки Elasticsearch. Затем данные разбираются и преобразуются в формат хранения Milvus 2.x, после чего они записываются с помощью <code translate="no">bulkInsert</code>. Помимо переноса векторов типа <code translate="no">dense_vector</code>, хранящихся в Elasticsearch, Milvus Migration также поддерживает перенос других типов полей, включая long, integer, short, boolean, keyword, text и double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Набор функций Milvus Migration</h3><p>Milvus Migration упрощает процесс миграции благодаря широкому набору функций:</p>
<ul>
<li><p><strong>Поддерживаемые источники данных:</strong></p>
<ul>
<li><p>Milvus 1.x - Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 и последующие версии до Milvus 2.x</p></li>
<li><p>FAISS - Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Несколько режимов взаимодействия:</strong></p>
<ul>
<li><p>Интерфейс командной строки (CLI) с использованием фреймворка Cobra</p></li>
<li><p>Restful API со встроенным пользовательским интерфейсом Swagger</p></li>
<li><p>Интеграция в качестве модуля Go в другие инструменты</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Универсальная поддержка форматов файлов:</strong></p>
<ul>
<li><p>Локальные файлы</p></li>
<li><p>Amazon S3</p></li>
<li><p>Служба хранения объектов (OSS)</p></li>
<li><p>Облачная платформа Google (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Гибкая интеграция с Elasticsearch:</strong></p>
<ul>
<li><p>Миграция векторов типа <code translate="no">dense_vector</code> из Elasticsearch.</p></li>
<li><p>Поддержка миграции других типов полей, таких как long, integer, short, boolean, keyword, text и double</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Определения интерфейсов</h3><p>Milvus Migration предоставляет следующие ключевые интерфейсы:</p>
<ul>
<li><p><code translate="no">/start</code>: : Инициирует задание миграции (эквивалентно комбинации дампа и загрузки, в настоящее время поддерживает только миграцию ES).</p></li>
<li><p><code translate="no">/dump</code>: : Инициирует задание дампа (записывает исходные данные на целевой носитель).</p></li>
<li><p><code translate="no">/load</code>: : Инициирует задание загрузки (записывает данные с целевого носителя в Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Позволяет пользователям просматривать результаты выполнения задания. (Для получения более подробной информации обратитесь к <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">файлу server.go проекта</a>).</p></li>
</ul>
<p>Далее давайте на примере данных рассмотрим, как использовать Milvus Migration в этом разделе. Вы можете найти эти примеры <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">здесь,</a> на GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Миграция с Elasticsearch на Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Подготовка данных Elasticsearch</li>
</ol>
<p>Чтобы <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">перенести</a> данные <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a>, вы должны уже настроить свой собственный сервер Elasticsearch. Вы должны хранить векторные данные в поле <code translate="no">dense_vector</code> и индексировать их с другими полями. Сопоставление индексов показано ниже.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Компиляция и сборка</li>
</ol>
<p>Сначала загрузите <a href="https://github.com/zilliztech/milvus-migration">исходный код</a> Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">с GitHub</a>. Затем выполните следующие команды для его компиляции.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>В результате будет создан исполняемый файл с именем <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Настройка <code translate="no">migration.yaml</code></li>
</ol>
<p>Перед началом миграции необходимо подготовить конфигурационный файл с именем <code translate="no">migration.yaml</code>, содержащий информацию об источнике данных, цели и другие необходимые настройки. Вот пример конфигурации:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Для более подробного объяснения конфигурационного файла обратитесь к <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">этой странице</a> на GitHub.</p>
<ol start="4">
<li>Выполнение задания миграции</li>
</ol>
<p>Теперь, когда вы настроили файл <code translate="no">migration.yaml</code>, вы можете запустить задание миграции, выполнив следующую команду:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Проследите за выводом журналов. Если вы увидите журналы, похожие на следующие, это означает, что миграция прошла успешно.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>В дополнение к подходу с использованием командной строки, Milvus Migration также поддерживает миграцию с помощью Restful API.</p>
<p>Чтобы использовать Restful API, запустите сервер API с помощью следующей команды:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>После запуска службы вы можете начать миграцию, вызвав API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>После завершения миграции вы можете использовать <a href="https://zilliz.com/attu">Attu</a>, универсальный инструмент администрирования векторных баз данных, для просмотра общего количества успешно перенесенных строк и выполнения других операций, связанных с коллекцией.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>Интерфейс Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Миграция с Milvus 1.x на Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Подготовка данных Milvus 1.x</li>
</ol>
<p>Чтобы помочь вам быстро освоить процесс миграции, мы поместили 10 000 <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">тестовых</a> записей <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">данных</a> Milvus 1.x в исходный код Milvus Migration. Однако в реальных случаях перед началом процесса миграции необходимо экспортировать собственный файл <code translate="no">meta.json</code> из экземпляра Milvus 1.x.</p>
<ul>
<li>Экспортировать данные можно с помощью следующей команды.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Обязательно выполните ее:</p>
<ul>
<li><p>Замените простановки на реальные учетные данные MySQL.</p></li>
<li><p>Перед выполнением экспорта остановите сервер Milvus 1.x или приостановите запись данных.</p></li>
<li><p>Скопируйте папку Milvus <code translate="no">tables</code> и файл <code translate="no">meta.json</code> в ту же директорию.</p></li>
</ul>
<p><strong>Примечание:</strong> Если вы используете Milvus 2.x на <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (полностью управляемый сервис Milvus), вы можете начать миграцию с помощью Cloud Console.</p>
<ol start="2">
<li>Компиляция и сборка</li>
</ol>
<p>Сначала загрузите <a href="https://github.com/zilliztech/milvus-migration">исходный код</a> Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">с GitHub</a>. Затем выполните следующие команды для его компиляции.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>В результате будет создан исполняемый файл с именем <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Настройте <code translate="no">migration.yaml</code></li>
</ol>
<p>Подготовьте конфигурационный файл <code translate="no">migration.yaml</code>, указав в нем подробные сведения об источнике, цели и другие необходимые настройки. Вот пример конфигурации:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Для более подробного объяснения конфигурационного файла обратитесь к <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">этой странице</a> на GitHub.</p>
<ol start="4">
<li>Выполнение задания миграции</li>
</ol>
<p>Для завершения миграции необходимо отдельно выполнить команды <code translate="no">dump</code> и <code translate="no">load</code>. Эти команды преобразуют данные и импортируют их в Milvus 2.x.</p>
<p><strong>Примечание:</strong> В ближайшее время мы упростим этот шаг и дадим пользователям возможность завершить миграцию с помощью всего одной команды. Следите за новостями.</p>
<p><strong>Команда дампа:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Load Command:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>После миграции созданная коллекция в Milvus 2.x будет содержать два поля: <code translate="no">id</code> и <code translate="no">data</code>. Более подробную информацию можно получить с помощью <a href="https://zilliz.com/attu">Attu</a>, универсального инструмента администрирования векторных баз данных.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Миграция из FAISS в Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
<li>Подготовьте данные FAISS</li>
</ol>
<p>Для миграции данных Elasticsearch вам необходимо подготовить собственные данные FAISS. Чтобы помочь вам быстро освоить процесс миграции, мы поместили некоторые <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">тестовые данные FAISS</a> в исходный код Milvus Migration.</p>
<ol start="2">
<li>Компиляция и сборка</li>
</ol>
<p>Сначала загрузите <a href="https://github.com/zilliztech/milvus-migration">исходный код</a> Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">с GitHub</a>. Затем выполните следующие команды для его компиляции.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>В результате будет создан исполняемый файл с именем <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Настройте <code translate="no">migration.yaml</code></li>
</ol>
<p>Подготовьте конфигурационный файл <code translate="no">migration.yaml</code> для миграции FAISS, указав в нем сведения об источнике, цели и другие необходимые параметры. Здесь приведен пример конфигурации:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Для более подробного объяснения конфигурационного файла обратитесь к <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">этой странице</a> на GitHub.</p>
<ol start="4">
<li>Выполнение задания миграции</li>
</ol>
<p>Как и миграция с Milvus 1.x на Milvus 2.x, миграция FAISS требует выполнения команд <code translate="no">dump</code> и <code translate="no">load</code>. Эти команды преобразуют данные и импортируют их в Milvus 2.x.</p>
<p><strong>Примечание:</strong> В ближайшее время мы упростим этот шаг и дадим пользователям возможность завершить миграцию с помощью одной команды. Следите за новостями.</p>
<p><strong>Команда дампа:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Команда загрузки:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Вы можете просмотреть более подробную информацию с помощью <a href="https://zilliz.com/attu">Attu</a>, универсального инструмента администрирования векторных баз данных.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Следите за будущими планами по миграции<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>В будущем мы будем поддерживать миграцию из большего количества источников данных и добавим больше функций миграции, в том числе:</p>
<ul>
<li><p>Поддержка миграции с Redis на Milvus.</p></li>
<li><p>Поддержка миграции с MongoDB на Milvus.</p></li>
<li><p>Поддержка возобновляемой миграции.</p></li>
<li><p>Упрощение команд миграции за счет объединения процессов дампа и загрузки в один.</p></li>
<li><p>Поддержка миграции с других основных источников данных на Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, последний выпуск Milvus, предлагает новые интересные функции и улучшения производительности, которые отвечают растущим потребностям управления данными. Перенос ваших данных на Milvus 2.x может раскрыть эти преимущества, а проект Milvus Migration делает процесс миграции простым и удобным. Попробуйте, и вы не будете разочарованы.</p>
<p><em><strong>Примечание:</strong> Информация в этом блоге основана на состоянии проектов Milvus и <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> по состоянию на сентябрь 2023 года. Самую свежую информацию и инструкции можно найти в официальной <a href="https://milvus.io/docs">документации Milvus</a>.</em></p>
