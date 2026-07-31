---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Анонс Milvus 3.0: Lake-Native векторный поиск и более мощный механизм
  извлечения
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Откройте для себя lake-native векторный поиск в Milvus 3.0, внешние коллекции
  с нулевым копированием, более быстрый разреженный поиск, снимки, интеграцию со
  Spark и расширенные возможности ранжирования.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Сегодня мы выпускаем Milvus 3.0 — важную архитектурную веху для проекта. Этот релиз меняет как то, где Milvus может строить и обслуживать индексы, так и то, какой объем работы по извлечению можно выполнять непосредственно внутри движка.</p>
<ul>
<li>Milvus 3.0 вводит <strong>lake-native путь</strong> для индексирования векторных данных, которые находятся в объектном хранилище и открытых табличных форматах, включая Parquet, Lance, Iceberg и Vortex. Команды могут сделать данные, находящиеся в lake, доступными для поиска без поддержки еще одной копии в векторной базе данных.</li>
<li><strong>Этот релиз также расширяет Milvus за пределы первичного извлечения кандидатов.</strong> Серверная сортировка, агрегация, фасетный поиск, StructArray для вложенной структуры документ/фрагмент и векторов ColBERT, а также переработанный разреженный индекс переносят больше ранжирования, группировки и обработки результатов из кода приложения в движок извлечения.</li>
</ul>
<p>В совокупности эти улучшения делают Milvus open-source основой для производственного AI-извлечения и архитектур <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, которые объединяют lake-native хранилище с высокопроизводительным векторным извлечением.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Краткий обзор набора возможностей Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Область</strong></th><th><strong>Возможности</strong></th><th><strong>Почему это важно</strong></th></tr>
</thead>
<tbody>
<tr><td>Lake-native извлечение</td><td>External Collections поверх Parquet, Lance, Iceberg и Vortex</td><td>Поиск по данным, находящимся в lake, без поддержки второй обслуживающей копии</td></tr>
<tr><td>Хранилище на базе S3</td><td>Loon (Storage v3)</td><td>Снижает усиление точечных чтений для обслуживающего доступа и поддерживает эволюцию схемы</td></tr>
<tr><td>Офлайн/пакетные рабочие процессы и восстановление</td><td>Snapshots, Spark DataSource V2 и онлайн-эволюция схемы</td><td>Привносит стабильные представления коллекций в пайплайны оценки, дедупликации, кластеризации и признаков</td></tr>
<tr><td>Движок извлечения</td><td>ORDER BY, агрегация, фасеты, StructArray и улучшенное разреженное извлечение</td><td>Переносит больше обработки результатов и multi-vector скоринга в Milvus</td></tr>
<tr><td>Модель данных &amp; операции</td><td>Nullable vectors, TEXT LOB, TTL, MinHash, Woodpecker и ForceMerge</td><td>Поддерживает более богатые модели данных и производственные операционные паттерны</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">Lake-native инфраструктура: индексируйте и обслуживайте данные там, где они уже находятся<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Самое крупное архитектурное изменение в Milvus 3.0 касается того, где система может строить и обслуживать индексы. Векторные данные могут оставаться в открытых форматах в объектном хранилище, а Milvus при этом предоставляет индексирование, извлечение и API производственного уровня.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: индексирование напрямую по данным, находящимся в lake</h3><p>Многие команды уже хранят эмбеддинги в data lake — таблицах Lance, таблицах Iceberg, файлах Parquet или других наборах данных открытого формата в S3, GCS или Azure Blob Storage. До Milvus 3.0 для поиска по этим данным обычно было два варианта.</p>
<ul>
<li>Скопировать эмбеддинги в векторную базу данных. Это обеспечивает поиск с низкой задержкой, но создает вторую копию и ETL-пайплайн, который должен оставаться синхронизированным.</li>
<li>Запрашивать lake напрямую. Это позволяет избежать дублирования, но без ANN-индексов векторный поиск превращается в полный перебор, который не может обеспечить производственные задержки.</li>
</ul>
<p><strong>External Collections вводят третий путь.</strong> Вы определяете коллекцию Milvus поверх данных, которые остаются в объектном хранилище, сопоставляете внешние поля со схемой Milvus и используете те же API поиска и запросов, что и для нативной коллекции. Исходные файлы не перемещаются; Milvus строит и обслуживает векторные, BM25-инвертированные, JSON- и скалярные индексы поверх внешних данных.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections доступны только для чтения и работают без копирования</strong>, что делает их полезными, когда требования управления, границы владения или операционные затраты требуют, чтобы исходный набор данных оставался в lake.</p>
<p>Когда внешний набор данных меняется, Milvus считывает его манифест хранилища и индексирует новые добавленные фрагменты вместо перестроения всей коллекции.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>В регулируемых средах извлечение может выполняться там, где данным разрешено находиться. Для крупных AI-систем набор данных, находящийся в lake, может поддерживать несколько развертываний извлечения без задания миграции между ними.</p>
<p>Внешние коллекции — это дополнительная возможность. Нативные коллекции Milvus остаются основным путем для сценариев обслуживания с интенсивной записью и низкой задержкой, тогда как External Collections предназначены для наборов данных, чья система записи остается вне Milvus.</p>
<p>Подробнее см. <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): эффективные точечные чтения для lake-native извлечения</h3><p>External Collections поднимают очевидный вопрос: объектное хранилище рассчитано на масштаб и надежность, но может ли оно поддерживать узкие точечные чтения, следующие за ANN-поиском?</p>
<p><strong>Проблема заключается в усилении чтения.</strong> Векторный поиск обычно выполняется в два этапа: ANN-индекс возвращает ID кандидатов, а система извлекает выбранные поля для этих кандидатов. Форматы, оптимизированные для аналитических сканирований, могут превращать узкий логический lookup в гораздо более крупное физическое чтение.</p>
<p><strong>Milvus 3.0 решает эту проблему с помощью Loon, также известного как Storage v3, — колоночного движка хранения на основе манифестов для S3-совместимого объектного хранилища.</strong> Loon организует поля в <code translate="no">ColumnGroups</code> с выровненными ID строк, позволяя скалярным полям отдавать приоритет фильтрации и сканированиям, а векторам и полям с интенсивными точечными чтениями использовать макеты, рассчитанные на более узкие lookup-запросы.</p>
<p>Loon хранит векторные и инвертированные индексы отдельно от формата файлов, а не встраивает их в него. Каждая версия набора данных описывается неизменяемым манифестом, который фиксирует ее <code translate="no">ColumnGroups</code>, позволяя одному и тому же движку индексирования работать с Lance, Parquet, Iceberg и Vortex.</p>
<p>Дизайн на основе манифестов также делает эволюцию схемы менее разрушительной. Добавление или удаление поля может обновить метаданные без переписывания существующих колонок. Заполнение нового поля записывает новую <code translate="no">ColumnGroup</code>, оставляя существующие <code translate="no">ColumnGroups</code> без изменений.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> — формат по умолчанию для этого пути. Это открытый, совместимый с Arrow колоночный формат с гибкими макетами и вложенными кодировками, которые лучше соответствуют AI-данным с высокой нагрузкой точечных запросов. В одном внутреннем бенчмарке с 3 миллионами строк, 128-мерными векторами, S3 и 256 параллельными читателями измеренный I/O на одно точечное чтение снизился примерно с 9,4 МБ для базового Parquet до 0,07 МБ для Vortex с Loon, то есть примерно в 135 раз.</p>
<p>Milvus 3.0 не заставляет объектное хранилище вести себя как локальная память. Он снижает усиление чтения, которое иначе делает объектное хранилище непрактичным для обслуживающих точечных lookup-запросов. Predicate pushdown в формат и локальный вариант Vortex — следующие пункты дорожной карты.</p>
<p><em>Подробнее см. наш блог:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>и</em> <a href="https://github.com/vortex-data/vortex"><em>проект Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: представление на момент времени без копирования данных</h3><p>Офлайн-заданиям нужен согласованный вид данных, даже когда производственные коллекции продолжают принимать записи. Snapshot Milvus — это read-only представление на определенный момент времени, которое фиксирует ссылки на существующие файлы данных, индексов и метаданных вместо копирования всего набора данных.</p>
<p>Это делает snapshots достаточно недорогими для создания перед рискованными операциями, такими как замена модели, повторное создание эмбеддингов или миграция схемы. Восстановление snapshot может повторно использовать существующие файлы данных и индексов через серверное копирование в объектном хранилище вместо повторного импорта каждой строки и перестроения каждого индекса. Эта возможность особенно полезна для быстро меняющихся нагрузок, таких как AI-агенты, где данные постоянно меняются и нужны частые, дешевые точки восстановления, а не редкие тяжелые резервные копии.</p>
<p>То же замороженное представление может поддерживать оценку, дедупликацию, проверку backfill и изолированное тестирование, пока живая коллекция продолжает принимать записи. Snapshot стабилизирует логический вход, хотя рабочие нагрузки могут по-прежнему совместно использовать инфраструктуру, такую как объектное хранилище и пропускная способность сети.</p>
<p>Snapshots не заменяют резервные копии. Snapshot ссылается на файлы, принадлежащие live-коллекции, и лучше всего подходит для логического восстановления, клонирования и краткоживущих стабильных представлений. Резервная копия создает независимую копию для долгосрочного хранения и аварийного восстановления.</p>
<p>Дополнительную информацию см. в <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a> и <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark connector: подключение Milvus к пакетным рабочим процессам</h3><p>Стабильный snapshot полезен только в том случае, если пакетные движки могут его прочитать. Milvus 3.0 предоставляет Milvus как Spark DataSource V2, позволяя заданиям Spark, Databricks и EMR читать из Milvus и записывать в Milvus как часть стандартных пакетных пайплайнов.</p>
<p>Эта возможность важна, потому что рабочие процессы AI-данных итеративны: дедупликация питает повторное создание эмбеддингов, кластеризация питает оценку, а оценка создает курируемые наборы для обучения или обслуживания. Стабильный snapshot предоставляет этим заданиям согласованный вход, пока live-коллекция продолжает обслуживать запросы. С коннектором Spark результат одного задания становится источником следующего, без экспорта полной коллекции из Milvus каждый раз.</p>
<p>Milvus 3.0 также вводит vector-native пакетные операторы для задач вроде дедупликации, обнаружения аномалий и кластеризации, удерживая вычислительно тяжелую работу вне онлайн-пути запросов и работая напрямую с векторными данными.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Онлайн-изменения схемы и backfill</h3><p>В производстве схема редко остается статичной — команды со временем добавляют новые модели эмбеддингов, разреженные векторы, метки, поля метаданных и политики хранения. Milvus 3.0 позволяет добавлять, заполнять и удалять колонки, пока обслуживание продолжается, вместо разрушительных перестроений, которые раньше для этого требовались.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Добавление или удаление колонки не требует переписывания существующих данных. <code translate="no">client.add_collection_field(...)</code> добавляет новую nullable-колонку без вывода коллекции из эксплуатации, а <code translate="no">client.drop_collection_field(...)</code> удаляет устаревшее или экспериментальное поле во время выполнения. Ни одна из операций не переписывает существующие данные — каждая является изменением манифеста коллекции, а не файлов данных, поэтому перестроения не требуется.</p>
<p>Milvus 3.0 поддерживает два пути backfill:</p>
<ul>
<li><strong>Inner backfill</strong> (в 3.0) предназначен для значений, производных от существующих полей. Milvus может сгенерировать разреженный BM25-вектор из текстовой колонки внутри ядра, устраняя необходимость в клиентском энкодере при построении гибридного dense-plus-sparse извлечения.</li>
<li><strong>External backfill</strong>(в дорожной карте) будет предназначен для значений, вычисляемых вне Milvus: создать snapshot, запустить Spark по согласованному представлению, вычислить новую колонку, записать значения обратно и позволить Milvus инкрементально обновить индекс. Это предполагаемый путь для крупных задач повторного создания эмбеддингов — например, добавления новой колонки эмбеддингов для сотен миллионов строк, пока записи продолжаются.</li>
</ul>
<p>В совокупности онлайн-изменения схемы и backfill упрощают эволюцию пайплайнов извлечения без перестроения всей коллекции каждый раз, когда меняется модель данных.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Более мощный движок для сквозного извлечения<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus уже давно поддерживает не только плотный ANN-поиск, включая разреженное извлечение на базе BM25 и гибридный поиск. Milvus 3.0 расширяет движок по другой оси: он переносит больше этапов многоступенчатого пайплайна извлечения в сам Milvus, уменьшая избыточное извлечение, дублирование логики приложения и зависимость от отдельных сервисов постобработки.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. Серверный ORDER BY: сортировка внутри движка, по сегментам</h3><p>Раньше сортировка требовала от приложений извлекать избыточное число кандидатов, передавать их клиенту и сортировать там. Это расходовало пропускную способность и делало итоговый результат зависимым от того, где происходило клиентское усечение.</p>
<p><strong>Milvus 3.0 добавляет серверный ORDER BY</strong>, который позволяет query-нагрузкам сортировать отфильтрованные строки по скалярным полям, таким как рейтинг, цена, свежесть, наличие или временная метка.</p>
<ul>
<li>На пути query каждый сегмент сортирует свой отфильтрованный набор результатов, query nodes объединяют эти потоки, а proxy возвращает запрошенный срез.</li>
<li>На пути search ORDER BY сортирует набор ANN-кандидатов внутри Milvus, уменьшая избыточное извлечение на стороне клиента и дублирующую постобработку. Он не меняет границу recall, установленную ANN-кандидатами.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Это особенно полезно для поисков, которые сочетают релевантность с бизнес- или пользовательскими ограничениями, такими как рейтинг, цена, свежесть, наличие или временная метка.</p>
<p>Дополнительную информацию см. в <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> и <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Агрегация и фасетный поиск</h3><p>Milvus 3.0 добавляет агрегацию на стороне query с операциями вроде count, sum, average, minimum и maximum, сгруппированными по одному или нескольким скалярным полям. Это устраняет распространенный паттерн, когда команды вытягивают отфильтрованные строки в клиентский код только для подсчета, группировки или вычисления простой статистики.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 также добавляет <strong>search aggregation</strong> для фасетного поиска. После ANN-поиска Milvus группирует найденные hits по полю и возвращает количества в бакетах, агрегированную статистику и top-N примеров hits на бакет — паттерн, лежащий в основе группировки по бренду, ценовому диапазону, цвету, tenant или типу документа. Один нюанс: search aggregation работает по набору результатов, извлеченных ANN, а не по всей коллекции, поэтому значения фасетов приблизительны. Когда нужны точные подсчеты, используйте агрегацию на стороне query.</p>
<p>Дополнительную информацию см. в <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray для вложенных векторов и модели late-interaction</h3><p>Многие сущности естественно представляются несколькими векторами. Длинный документ — это серия фрагментов; видео — последовательность кадров, которые лучше хранить вместе в одной строке, а не разбрасывать по множеству; у продукта есть несколько изображений или ракурсов. Модели late-interaction развивают это еще дальше — ColBERT выдает один вектор на токен, ColPali — один на визуальный patch. В каждом случае единица, которую вы действительно хотите хранить и искать, — это вся сущность, а не каждый фрагмент сам по себе.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> позволяет строке Milvus содержать массив структурированных элементов переменной длины, включая несколько векторов, сохраняя единый ID сущности и единый набор метаданных. Это позволяет избежать разбиения документа на несколько строк и дублирования меток, разрешений или других полей между фрагментами.</p>
<p>Milvus поддерживает две гранулярности поиска.</p>
<ul>
<li><strong>Поиск на уровне элемента</strong> сопоставляет один вектор запроса с каждым элементом в списке и возвращает конкретный совпавший элемент с его offset. Это полезно, когда нужно знать, какой фрагмент, токен, patch или изображение совпали. Строка может появиться более одного раза, если совпадает несколько элементов.</li>
<li><strong>Поиск на уровне сущности</strong> сравнивает полный список векторов запроса со списком векторов строки, используя <code translate="no">MAX_SIM</code> с метрикой <code translate="no">MAX_SIM_COSINE</code>. Каждый токен запроса берет свое лучшее совпадение в документе, и эти лучшие оценки суммируются. Это дает Milvus нативную поддержку паттернов late-interaction извлечения, таких как ColBERT и ColPali, при сохранении одной строки на документ.</li>
</ul>
<p>Индексирование каждого токен-вектора может быть дорогим; поэтому Milvus 3.0 добавляет несколько путей ускорения, включая TokenANN, Muvera и Lemur, которые обменивают размер индекса, стоимость обучения и recall.</p>
<table>
<thead>
<tr><th>Стратегия</th><th>Представление первого этапа</th><th>Профиль затрат</th><th>Лучше всего для</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Индексируется каждый токен-вектор.</td><td>Самый высокий, точный</td><td>Моделей с высокой дискриминативностью и коротких документов</td></tr>
<tr><td>Muvera</td><td>Один вектор на документ с использованием random-projection FDE.</td><td>Средний, без обучения</td><td>Длинных документов</td></tr>
<tr><td>Lemur</td><td>Один вектор на документ с использованием обучаемого MLP-сжатия</td><td>Самый низкий, требует обучения</td><td>Моделей с низкой дискриминативностью и визуальных или patch-векторов</td></tr>
</tbody>
</table>
<p>В наших бенчмарках Lemur соответствует или превосходит TokenANN по recall на большинстве наборов данных, сводя каждый документ к одному вектору; исключение — корпуса с высокой вариативностью длины, где TokenANN или другая стратегия безопаснее.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для корпусов больше памяти Milvus также поддерживает индекс <code translate="no">DISKANN</code>, который хранит списки эмбеддингов на диске, чтобы снизить нагрузку на RAM.</p>
<p>Поиск на уровне элементов уже появился в Milvus 2.6. Фильтрация для Muvera, Lemur и StructList новая в 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Сжатие индекса BM25 и SINDI</h3><p>Milvus поддерживал поиск по разреженным векторам в более ранних релизах. Milvus 3.0 снижает размер разреженного индекса с помощью блочно-сжатых postings (алгоритмы, связанные с VByte, плюс SIMD-декодирование) и квантизации (fp16 для внутренних произведений, u16 для BM25).</p>
<p>В одном наборе внутренних BM25-бенчмарков новая реализация была примерно в 3 раза меньше, чем разреженный индекс Milvus 2.6 при сопоставимом recall. Меньший индекс снижает нагрузку на память и пропускную способность и может повышать скорость в рабочих нагрузках, ограниченных перемещением данных.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 также вводит <a href="https://arxiv.org/abs/2509.08395">SINDI</a> — новый алгоритм разреженного извлечения, оптимизированный для обученных разреженных эмбеддингов, таких как SPLADE. Поскольку эти эмбеддинги создают более плотные posting lists, чем BM25, алгоритмы поиска с интенсивным pruning могут тратить значительное CPU-время на решение, что пропустить. Вместо этого SINDI организует postings в компактные окна и использует дружественное к SIMD накопление score, чтобы эффективно их обрабатывать, сохраняя точность извлечения за счет lossless pruning.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы также расширили SINDI за пределы исходного дизайна, добавив нативную поддержку BM25, что позволяет Milvus использовать один и тот же оптимизированный путь разреженного извлечения как для обученных разреженных эмбеддингов, так и для традиционного полнотекстового поиска.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В наших бенчмарках на 4 наборах разреженных векторов SPLADE SINDI достигает примерно до 10x QPS по сравнению с MaxScore на learned-sparse векторах, а в худшем случае — около 5x.</p>
<p>SINDI используется по умолчанию для поиска по разреженным векторам с внутренним произведением в Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Другие улучшения<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> Хранит длинный исходный текст рядом с векторами. Текст меньше 64 КБ остается inline; более крупные значения используют ссылку Vortex LOB.</li>
<li><strong>Расширенная поддержка плотных индексов:</strong> Добавляет больше вариантов индексов в семействе Faiss, включая SVS, Panorama, PQ, IVFPQ и ScaNN, для разных требований к масштабу, памяти и recall.</li>
<li><strong>MinHash и поиск почти дубликатов:</strong> Генерирует сигнатуры MinHash на стороне сервера и извлекает кандидатов почти дубликатов с помощью MINHASH_LSH.</li>
<li><strong>Nullable vectors и новые типы:</strong> Позволяет векторным полям быть NULL и добавляет TIMESTAMPTZ для time-aware фильтрации и политик хранения.</li>
<li><strong>Пользовательские полнотекстовые словари:</strong> Регистрирует словари, синонимы и ресурсы стоп-слов в кластере для многоязычной и доменно-специфичной токенизации.</li>
<li><strong>Standalone Woodpecker:</strong> Запускает журнал предварительной записи Milvus как независимо масштабируемый и наблюдаемый сервис.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> Истекает срок действия отдельных записей через поле TIMESTAMPTZ, с MVCC-фильтрацией и последующей сборкой мусора во время compaction.</li>
<li><strong>ForceMerge:</strong> Уплотняет небольшие сегменты до целевого размера и перестраивает индексы, чтобы снизить усиление чтения перед длительным обслуживанием с интенсивным чтением.</li>
<li>И многое другое</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Начните работу с Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 доступен уже сегодня под лицензией Apache 2.0 и остается проектом LF AI &amp; Data. Чтобы начать:</p>
<ul>
<li>Прочитайте <a href="https://milvus.io/docs/release_notes.md">release notes</a> и <a href="https://milvus.io/docs/quickstart.md">quickstart</a>, а исходный код получите на <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX">сообществу Milvus Discord</a> или запишитесь на сессию <a href="https://milvus.io/office-hours">Milvus Office Hours</a>, чтобы обсудить ваш сценарий использования с мейнтейнерами.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 и Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 закладывает open-source основу для производственного AI-извлечения и формирующейся архитектуры <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, которая объединяет lake-native хранилище с высокопроизводительным векторным извлечением на едином источнике истины, каждое — с правильной стоимостью.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> — полностью управляемая Vector Lakebase, созданная командой, стоящей за Milvus. Она использует ту же распределенную lake-native архитектуру, что и Milvus, и полностью совместима с Milvus API. Благодаря собственному движку индексирования Cardinal Zilliz Cloud обеспечивает до 10× лучшую цена/производительность, чем стандартные open-source подходы к индексированию, одновременно устраняя операционную сложность управления инфраструктурой. Корпоративные возможности включают compute с масштабированием до нуля, межрегиональное аварийное восстановление, развертывание BYOC, безопасность и соответствие требованиям корпоративного уровня (SOC 2, HIPAA, ISO 27001 и GDPR), а также SLA до 99,99%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Разработчики могут развернуть Milvus как open-source векторную базу данных или использовать <a href="https://zilliz.com/">Zilliz Cloud</a> как управляемую платформу для множества рабочих нагрузок на протяжении всего жизненного цикла AI-данных.</p>
<h2 id="What-comes-next" class="common-anchor-header">Что дальше<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Дорожная карта Milvus развивает архитектуру 3.0 с predicate pushdown для External Collections, external backfill, дополнительными операторами Spark и поддержкой большего числа табличных форматов, включая Delta Lake и Apache Paimon.</p>
<p>Общее направление ясно: системам AI-данных нужен более тесный цикл между онлайн-извлечением и офлайн-улучшением данных. Векторные данные не должны копироваться в отдельные системы каждый раз, когда команды хотят искать, анализировать, улучшать или обслуживать их.</p>
