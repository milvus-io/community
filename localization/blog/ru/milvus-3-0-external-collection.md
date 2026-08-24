---
id: milvus-3-0-external-collection.md
title: >-
  Внешняя коллекция Milvus: индексация и поиск данных в озере данных без их
  перемещения
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 представил External Collection, позволяющий Milvus создавать
  индексы и обеспечивать поиск по данным, которые остаются в озере данных.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>Во многих конвейерах ИИ эмбеддинги и метаданные уже создаются и хранятся в озере данных. Продуктовый конвейер может записывать атрибуты продуктов и мультимодальные эмбеддинги в файлы Parquet в S3. Корпус для поиска или обучения может жить в таблице Iceberg или Lance. Озеро уже является тем местом, где эти наборы данных генерируются, обновляются, версионируются и используются остальной частью стека данных.</p>
<p>Векторные базы данных, однако, традиционно строились вокруг обслуживающей копии, принадлежащей базе данных. Если командам нужен был низколатентный векторный поиск по данным, уже находящимся в озере, у них обычно было два варианта:</p>
<ul>
<li><strong>Скопировать данные в векторную базу данных.</strong> Это обеспечивает ANN-индексы и производственный путь обслуживания, но создает вторую копию набора данных и ETL-пайплайн, который должен оставаться синхронизированным с источником.</li>
<li><strong>Запрашивать озеро напрямую.</strong> Это позволяет избежать дублирования, но без слоя ANN-индексирования и обслуживания векторный поиск откатывается к сканированиям, не предназначенным для производственной задержки.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>Внешняя коллекция</strong></a> <strong>предлагает третий путь.</strong> Исходные данные остаются в Parquet, Iceberg, Lance, Vortex или другом поддерживаемом внешнем формате, а Milvus строит и обслуживает индексы на них. Вы сопоставляете внешние поля со схемой Milvus, определяете необходимые индексы, выполняете Refresh коллекции и используете обычные API поиска и запросов Milvus — без предварительного копирования исходных строк в управляемую коллекцию Milvus.</p>
<p>Архитектурное изменение простое: данные могут оставаться в озере, а Milvus добавляет слой индексирования и поиска.</p>
<p>Это также делает Внешнюю коллекцию важным шагом к <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> единой lake-нативной архитектуре данных для ИИ, которая сочетает обслуживание уровня векторной базы данных с открытым хранением в озере, переиспользуемыми индексами уровня озера и общим семантическим слоем. Онлайн-поиск больше не должен исходить из отдельной обслуживающей копии, пока Spark, пайплайны обучения, задачи оценки и инструменты управления работают с другой версией данных. Они могут работать на одной и той же основе данных, размещенных в озере.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Что такое Внешняя коллекция и что она меняет<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Внешняя коллекция</strong> — это тип коллекции Milvus, исходные данные которой находятся вне управляемого Milvus хранилища.</p>
<p>Без Внешней коллекции размещение этого каталога за производственным векторным поиском обычно означает создание еще одной копии в Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Каждый раз, когда каталог меняется, меняется модель эмбеддингов или выполняется обратная заливка поля, очередной пайплайн должен переносить обновленные данные через эту границу.</p>
<p>С Внешней коллекцией архитектура становится следующей:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>не</strong> делает внешние файлы собственной копией исходных данных. Вместо этого Внешняя коллекция содержит информацию, необходимую Milvus для их интерпретации и поиска по ним:</p>
<ol>
<li><code translate="no">external_source</code>, который идентифицирует внешние файлы или таблицу.</li>
<li><code translate="no">external_spec</code>, описывающий формат источника и доступ к хранилищу.</li>
<li>Сопоставления <code translate="no">external_field</code>, которые связывают поля в схеме Milvus с колонками во внешнем наборе данных.</li>
<li>Индексы, манифесты и обслуживающее состояние, которые Milvus создает для поиска.</li>
</ol>
<p><strong>Отсутствие копирования исходных данных не означает отсутствие состояния внутри Milvus.</strong> Milvus по-прежнему строит индексы. Он по-прежнему использует вычислительные ресурсы. Он по-прежнему кэширует данные. Изменение заключается в том, что эталонные строки больше не нужно копировать в Milvus только потому, что вам нужен поиск по ним через Milvus.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Обычная коллекция Milvus против Внешней коллекции</h3><table>
<thead>
<tr><th><strong>Аспект</strong></th><th><strong>Управляемая коллекция Milvus</strong></th><th><strong>Внешняя коллекция</strong></th></tr>
</thead>
<tbody>
<tr><td>Исходные записи</td><td>Хранятся и управляются Milvus</td><td>Остаются во внешних файлах или таблице</td></tr>
<tr><td>Как данные попадают в Milvus</td><td>Вставка, upsert, импорт или потоковая запись</td><td>Сопоставление внешнего источника + Refresh</td></tr>
<tr><td>Онлайн-мутации</td><td>Поддерживаются</td><td>Только чтение со стороны Milvus</td></tr>
<tr><td>Свежесть</td><td>Следует пути записи и модели согласованности Milvus</td><td>Следует последнему успешно опубликованному Refresh</td></tr>
<tr><td>Состояние, управляемое Milvus</td><td>Исходные данные, метаданные, индексы, кэши</td><td>Сопоставления, манифесты, индексы, кэши</td></tr>
<tr><td>Путь запросов</td><td>API поиска и запросов Milvus</td><td>API поиска и запросов Milvus</td></tr>
<tr><td>Наилучшее применение</td><td>Непрерывно меняющиеся онлайн-данные</td><td>Большие, создаваемые пакетно, данные озера с высокой долей чтения</td></tr>
</tbody>
</table>
<p>Таким образом, Внешняя коллекция дополняет обычные коллекции Milvus, а не заменяет их.</p>
<p>Система может хранить быстро меняющееся онлайн-состояние в обычных коллекциях Milvus, используя Внешние коллекции для больших корпусов, каталогов, исторических наборов данных, признаков моделей или других данных, уже созданных и управляемых в озере.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Почему удаление второй копии имеет значение<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Внешние коллекции легко описать как оптимизацию хранилища: не копируйте несколько терабайт данных в другую базу данных — и вы сэкономите хранилище. Это полезно, но это не главная архитектурная проблема.</p>
<p><strong>Более высокая стоимость возникает из-за необходимости поддерживать согласованность двух систем данных.</strong></p>
<p>Вернемся к каталогу продуктов. Платформа данных создает эталонный набор данных Parquet. Поиск импортирует его в векторную базу данных. Команда рекомендаций может читать те же данные озера через Spark для офлайн-анализа. Затем новая модель эмбеддингов генерирует заменяющий векторный столбец. Запасы и метаданные продолжают меняться одновременно.</p>
<p>Как только онлайн-копия для обслуживания становится независимой от озера, каждое изменение должно пересекать эту границу:</p>
<ul>
<li>данные необходимо копировать;</li>
<li>передачу необходимо планировать и контролировать;</li>
<li>для упавших заданий нужны повторные попытки;</li>
<li>схемы и права доступа, возможно, придется представлять в нескольких системах;</li>
<li>свежесть зависит от того, как быстро синхронизирующий пайплайн догоняет изменения;</li>
<li>команды должны знать, какая копия представляет ту версию, которая им нужна.</li>
</ul>
<p>Хранилище — лишь одна статья расходов.</p>
<table>
<thead>
<tr><th><strong>Стоимость</strong></th><th><strong>Отдельная копия озера + обслуживающая копия</strong></th><th><strong>Внешняя коллекция</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Копии исходных данных</strong></td><td>Копия озера плюс отдельная обслуживающая копия</td><td>Исходные строки остаются в озере</td></tr>
<tr><td><strong>Перемещение данных</strong></td><td>Постоянный ETL/импортный пайплайн</td><td>Refresh по внешнему источнику</td></tr>
<tr><td><strong>Свежесть</strong></td><td>Зависит от ритма экспорта/импорта</td><td>Управляется моментом публикации нового Refresh</td></tr>
<tr><td><strong>Управление данными</strong></td><td>Исходная и обслуживающая копии должны оставаться согласованными</td><td>Владение источником, происхождение и версионирование остаются на платформе озера данных</td></tr>
<tr><td><strong>Офлайн-переиспользование</strong></td><td>Другие потребители могут создавать собственные копии</td><td>Существующие инструменты озера могут продолжать читать тот же источник</td></tr>
<tr><td><strong>Ресурсы обслуживания</strong></td><td>Рассчитываются под копию базы данных и нагрузку запросов</td><td>Индексирование, вычислительные ресурсы запросов и кэши могут управляться отдельно от владения исходными строками</td></tr>
</tbody>
</table>
<p>Это различие становится особенно важным по мере того, как данные ИИ меняются все чаще.</p>
<p>Команды дедуплицируют корпусы. Они кластеризуют данные для анализа. Они генерируют новые эмбеддинги при изменении модели. Они добавляют метки, резюме, извлеченные сущности, оценки качества или сигналы обратной связи. Они запускают задачи оценки и пайплайны очистки данных на том же корпусе, из которого производственные приложения выполняют поиск.</p>
<p>Если каждая система владеет собственной копией, каждое улучшение превращается в еще одну задачу синхронизации.</p>
<p>Внешняя коллекция меняет эту границу: <strong>офлайн-системы могут продолжать работать с набором данных в озере, в то время как Milvus обслуживает поиск на той же основе.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Какие источники данных поддерживает Внешняя коллекция<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>Внешняя коллекция спроектирована вокруг открытых, внешне управляемых данных, а не специфичной для Milvus структуры источника. Она поддерживает несколько форматов внешних источников через <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Внешний формат</strong></th><th><strong>значение format</strong></th><th><strong>Что читает Milvus</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Каталог или префикс объектного хранилища, содержащий файлы Parquet и группы строк</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Файлы Vortex и их метаданные компоновки</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Набор данных Lance и его метаданные фрагментов</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Метаданные Iceberg плюс выбранный снапшот</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>Поддерживаемый снапшот Milvus, представленный как внешний источник</td></tr>
</tbody>
</table>
<p>Сопоставление между источником и Milvus является явным.</p>
<p>Столбец источника с именем <code translate="no">product_id</code> может стать полем Milvus <code translate="no">id</code>; <code translate="no">image_vec</code> может стать <code translate="no">embedding</code>; и широкая исходная таблица не обязана открывать каждый столбец для коллекции. Это значит, что платформе данных не нужно переименовывать или переписывать свой источник только для того, чтобы удовлетворить обслуживающую базу данных.</p>
<p>Версионируемые форматы добавляют еще одно полезное свойство. С таким источником, как Iceberg, коллекция может указывать на конкретный снапшот, а не на то, что актуально на момент выполнения запроса. Фиксированная версия источника полезна для воспроизводимой оценки, регрессионного тестирования, исторического анализа и аудиторских задач.</p>
<p>Базовые файлы также остаются доступными для остальной части стека данных. Spark, фреймворки обучения, системы управления данными и другие совместимые с озером инструменты могут продолжать читать те же открытые данные.</p>
<p>Внешняя коллекция добавляет еще одного потребителя этих данных; она не превращает Milvus в единственного владельца.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Безопасный доступ к внешнему хранилищу</h3><p>Milvus также требуется разрешение на чтение внешнего хранилища.</p>
<p>В зависимости от провайдера хранилища развертывания могут использовать такие механизмы, как идентификатор рабочей нагрузки или экземпляра, принятие роли AWS STS, имперсонацию сервисного аккаунта, доступ на основе SAS или собственные ролевые системы провайдера, вместо встраивания долгоживущих учетных данных в конфигурацию приложения.</p>
<p>Эта идентичность хранилища определяет, как Milvus получает доступ к источнику. Авторизация внутри Milvus остается отдельной границей безопасности.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Как создать, индексировать, обновлять и запрашивать внешнюю коллекцию<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Жизненный цикл Внешней коллекции состоит из четырех основных шагов:</p>
<ol>
<li>Определите внешний источник и сопоставьте его столбцы со схемой Milvus.</li>
<li>Определите индексы, необходимые для рабочей нагрузки.</li>
<li>Запустите Refresh, чтобы Milvus обнаружил исходные данные и подготовил версию, доступную для запросов.</li>
<li>Загрузите коллекцию и используйте обычные API поиска и запросов Milvus.</li>
</ol>
<p>Вот тот же каталог продуктов, представленный в виде Внешней коллекции:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Индексы используют обычный интерфейс Milvus:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Затем обновите внешний источник:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Когда обновленная версия готова, загрузите и выполните поиск по ней, как по обычной коллекции Milvus:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Важное отличие заключается не в поисковом вызове. Оно в том, где начинается жизненный цикл. Управляемая коллекция Milvus начинается с записи или импорта данных в Milvus. Внешняя коллекция начинается со ссылки на данные, которые уже существуют в другом месте.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Как Refresh подхватывает изменения во внешних данных<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Внешняя коллекция доступна только для чтения со стороны Milvus, но базовый набор данных в озере не должен оставаться замороженным навсегда.</p>
<p>Предположим, продуктовый пайплайн добавляет очередной батч, обновляет метаданные или записывает эмбеддинги из новой модели. Milvus не отслеживает непрерывно каждый объект, появляющийся в пути источника. Эти изменения становятся видимыми через <strong>Refresh</strong>.</p>
<p>Refresh читает внешние метаданные, разрешает фрагменты источника, обновляет манифесты, связывающие их с коллекцией Milvus, и подготавливает соответствующее состояние индексов.</p>
<p>Ключевой момент в том, что эта работа может быть инкрементальной.</p>
<p>Milvus определяет фрагменты источника, которые не изменились, и может переиспользовать существующую работу по сегментам и индексам. Новые или измененные фрагменты — это те части, которые требуют новой обработки.</p>
<p>Поэтому небольшое изменение в многотерабайтном наборе данных не должно вызывать еще один полный импорт и полное перестроение индекса.</p>
<p>Refresh также дает обслуживающей системе четкую границу версий. Пока подготавливается новая версия, запросы продолжают использовать ранее опубликованное состояние. После завершения Refresh новое состояние становится доступным как полная версия, а не как смесь старых и частично подготовленных данных.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Эта модель естественно подходит для ежечасных сборок каталога, ночных обновлений базы знаний, периодических обновлений эмбеддингов, пайплайнов признаков, генерируемых моделями, и аналогичных пакетных рабочих нагрузок.</p>
<p>Она <strong>не</strong> заменяет потоковый путь записи. Если каждая вставка или удаление должны немедленно становиться доступными для поиска через Milvus, управляемая коллекция остается лучшей моделью.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Как Lazy Loading снижает использование памяти для широких наборов данных<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Хранение исходных строк в объектном хранилище помогает только в том случае, если обслуживающий слой не должен загружать каждый байт локально, прежде чем сможет отвечать на запросы. С включенным многоуровневым хранилищем Milvus это не требуется.</p>
<p>При загрузке коллекции QueryNodes изначально могут хранить только легковесные метаданные, такие как информация о схеме, определения индексов, карты чанков и ссылки на удаленные объекты. Данные полей подтягиваются на уровне чанков, когда они нужны запросу; индексы могут оставаться удаленными до первого использования, а затем кэшироваться локально. Часто используемые данные остаются горячими, а реже запрашиваемые данные могут вытесняться.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Это особенно полезно для широких наборов данных ИИ.</p>
<p>Строка продукта может содержать несколько эмбеддингов, длинное описание, сырой JSON, метаданные изображений, сгенерированные резюме, запасы, цены, рейтинги и множество других атрибутов. Типичный поиск по сходству может затрагивать только один вектор плюс запасы, цену и рейтинг. Нет причин, по которым каждое другое поле должно постоянно занимать память обслуживания только потому, что принадлежит той же записи.</p>
<p>Внешняя коллекция может сузить объем обслуживания на двух уровнях:</p>
<ul>
<li><strong>Во-первых, проекция на уровне схемы.</strong> С помощью <code translate="no">external_field</code> Внешняя коллекция может открывать только те столбцы источника, которые нужны приложению. Остальные столбцы остаются в наборе данных озера и не включаются в эту обслуживающую схему.</li>
<li><strong>Во-вторых, проекция во время выполнения.</strong> В многоуровневой модели обслуживания QueryNodes подтягивают и кэшируют поля и индексы, реально необходимые рабочей нагрузке, а не загружают весь сопоставленный набор данных заранее.</li>
</ul>
<p>Другими словами, <strong>набор данных может оставаться широким в озере, не вынуждая объем обслуживания быть таким же широким.</strong></p>
<p>Здесь есть очевидный компромисс. Запрос, обращающийся к холодному полю или индексу, может заплатить за удаленное чтение при первом доступе. Политики прогрева могут предварительно загружать критичные к задержке поля или индексы, а политики кэширования и вытеснения не позволяют реже используемым состояниям бесконечно занимать локальные ресурсы.</p>
<p>Дело не в том, что объектное хранилище ведет себя как оперативная память. Дело в том, что память и локальный диск могут следовать за рабочим набором поисковой нагрузки, а не за общим размером и шириной исходного набора данных.</p>
<p>Формат источника также важен здесь. Форматы, предназначенные для широких аналитических сканирований, и форматы, оптимизированные для более узких или случайных чтений, могут демонстрировать разное поведение ввода-вывода при доступе по требованию. Внешняя коллекция не стирает эти компромиссы на уровне хранилища; она позволяет Milvus построить поверх них слой поиска.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Какие возможности поиска и индексирования поддерживает Внешняя коллекция<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>Внешняя коллекция не просто указывает Milvus на каталог эмбеддингов и не сканирует файлы. Milvus строит структуры поиска на внешних данных и выполняет запросы через свой стандартный поисковый движок.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Индексы Milvus, построенные на внешних данных</h3><p>В зависимости от полей и рабочей нагрузки Milvus может строить:</p>
<ul>
<li>векторные индексы для ANN-поиска;</li>
<li>скалярные индексы для фильтрации по метаданным;</li>
<li>JSON-индексы для полуструктурированных атрибутов;</li>
<li>индексы BM25 и полнотекстовые индексы для лексического поиска.</li>
<li>Функционально генерируемые поля, поддерживаемые моделью данных Milvus.</li>
</ul>
<p>ANN-поиск использует эти индексы, чтобы сузить множество кандидатов, а не читать каждый исходный вектор.</p>
<p>Это различие важно, потому что хранение эмбеддинга в озере — это не то же самое, что работа векторной базы данных поверх него. Персистентность дает вам байты. Производственный поиск также требует индексов, планирования запросов, фильтрации, ранжирования, кэширования и низколатентного пути обслуживания.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">За пределами векторного top-K</h3><p>Еще одна распространенная ошибка — читать «Внешнюю коллекцию» как «векторный поиск по Parquet». Это преуменьшает то, что на самом деле требуется для производственного поиска.</p>
<p>Результат производственного поиска редко зависит только от векторного сходства. Он также может зависеть от точных терминов, политики доступа, наличия на складе, временной метки, категории, цены, качества источника или сигналов бизнес-ранжирования.</p>
<p>Рассмотрим запрос, например:</p>
<table>
<thead>
<tr><th>красное цветочное платье на лето, в наличии, сначала с самым высоким рейтингом</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Производственному пути поиска могут потребоваться несколько сигналов:</p>
<ul>
<li><strong>Векторное сходство</strong> для семантического значения фразы «летнее цветочное платье».</li>
<li><strong>Лексический или полнотекстовый поиск</strong> по точному термину, например «красное».</li>
<li><strong>Скалярные фильтры</strong>, чтобы исключить товары, которых нет в наличии или чей рейтинг ниже порога.</li>
<li><strong>Гибридный поиск и ранжирование</strong> для объединения нескольких поисковых сигналов.</li>
</ul>
<p>Milvus 3.0 также расширяет механизм запросов за пределы первоначального поиска ближайших соседей такими возможностями, как <strong>серверная сортировка, агрегация и фасетирование.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Более широкая мысль состоит в том, что Внешняя коллекция дает данным, размещенным в озере, путь к поиску уровня базы данных — а не просто способ чтения векторов из файлов.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Как одни и те же данные озера поддерживают онлайн-обслуживание и офлайн-обработку<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>Самая сильная архитектурная причина хранить источник в открытом формате озера не просто в том, что вторая копия стоит денег. Она в том, что один и тот же набор данных может оставаться доступным системам, которые постоянно его улучшают.</p>
<p>Вернемся к каталогу продуктов.</p>
<p>В течение дня Milvus может обслуживать Внешнюю коллекцию для поиска товаров, рекомендаций или поиска для агентов.</p>
<p>В то же время другие системы могут работать напрямую с набором данных в озере:</p>
<ul>
<li>Spark может выявлять дублирующиеся товары.</li>
<li>Пайплайн обучения может генерировать эмбеддинги из новой модели.</li>
<li>Задача контроля качества данных может обнаруживать некорректные или аномальные записи.</li>
<li>Оценочный пайплайн может сравнивать качество поиска между версиями моделей.</li>
<li>Пакетный процесс может генерировать резюме, метки или дополнительные метаданные.</li>
</ul>
<p>Внешняя коллекция <strong>не</strong> запускает эти задачи сама. Spark остается Spark; обучение остается обучением. Ее роль — убрать лишнюю границу между обслуживанием и данными.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Офлайн-работа может записывать улучшенные данные или новые поля обратно в озеро. Последующий Refresh делает обновленный источник доступным для поискового пути Milvus.</p>
<p>Больше нет отдельного цикла экспорта и импорта, единственная цель которого — воссоздать еще одну эталонную копию для обслуживания.</p>
<p>Управление данными также остается четко разделенным. Версии источника, происхождение и владение источником остаются на платформе озера данных. Milvus поддерживает собственную авторизацию на уровне коллекции и учетные данные, необходимые для чтения источника. Совместное использование единой основы данных не означает сведение всех доменов безопасности в одну систему.</p>
<p>В этом связь с <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: озеро остается общей основой данных, а Milvus предоставляет низколатентный слой поиска поверх него. Внешняя коллекция — одна из частей этой архитектуры, наряду с Storage V3, снапшотами, интеграцией со Spark, эволюцией схем и обратной заливкой.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Где Внешняя коллекция уместна — а где нет<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Внешняя коллекция отлично подходит, когда:</strong></p>
<ul>
<li>Ваши эталонные данные уже находятся в Parquet, Vortex, Lance, Iceberg или другом поддерживаемом внешнем источнике.</li>
<li>Набор данных создается в основном пакетами, а не через высокочастотные транзакционные записи.</li>
<li>Поддержание второй обслуживающей копии создает значительные накладные расходы на ETL, свежесть или управление данными.</li>
<li>Нескольким системам нужно работать с одним и тем же открытым набором данных.</li>
<li>Явная граница Refresh приемлема для свежести обслуживания.</li>
<li>Вы хотите производственный поиск Milvus, не делая Milvus владельцем исходных строк.</li>
</ul>
<p><strong>Обычная коллекция Milvus по-прежнему лучший выбор, когда:</strong></p>
<ul>
<li>приложение непрерывно вставляет или обновляет записи (upsert);</li>
<li>удаления должны становиться видимыми через онлайн-путь записи;</li>
<li>рабочая нагрузка зависит от возможностей коллекции, недоступных для внешних схем;</li>
<li>Архитектура обслуживания намеренно держит все необходимые данные в памяти, избегая промахов удаленного кэша.</li>
</ul>
<p><strong>Стоит помнить о нескольких границах.</strong></p>
<ul>
<li><strong>Внешние коллекции доступны только для чтения.</strong> Изменения источника происходят вне Milvus.</li>
<li><strong>Отсутствие копирования относится к исходным строкам.</strong> Индексы, манифесты, кэши и вычислительные ресурсы по-прежнему требуют затрат.</li>
<li><strong>Refresh выполняется явно.</strong> Это не механизм потоковой синхронизации.</li>
<li><strong>Источник должен оставаться доступным.</strong> Поведение поиска, индексирования и обновления по-прежнему зависит от доступа к хранилищу и учетных данных.</li>
<li><strong>Требуется Storage V3.</strong> В open-source Milvus 3.0 его необходимо включить перед использованием Внешней коллекции.</li>
<li><strong>Внешняя коллекция не заменяет вышестоящую обработку.</strong> Генерация эмбеддингов, кластеризация, дедупликация и очистка данных по-прежнему выполняются в соответствующих вышестоящих системах.</li>
</ul>
<p>Поэтому выбор здесь взаимодополняющий, а не бинарный. Система может использовать обычные коллекции Milvus для быстро меняющегося онлайн-состояния и Внешние коллекции для больших, создаваемых пакетами наборов данных, естественное место которых — озеро.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Попробуйте Внешнюю коллекцию в Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Внешняя коллекция доступна в Milvus 3.0. Начните с репрезентативного набора данных в озере и оцените аспекты, важные для вашей рабочей нагрузки: начальное и инкрементальное обновление, стоимость построения индексов, поведение горячих и холодных запросов, а также интервал свежести, необходимый вашему приложению.</p>
<p>Подробности реализации см. в:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Создание внешней коллекции</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Примечания к выпуску Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Анонс Milvus 3.0 в блоге</a></li>
</ul>
<p>Если вы предпочитаете управляемый путь, Внешняя коллекция также доступна как часть <strong>Zilliz Vector Lakebase</strong> в Zilliz Cloud. См.:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">Внешняя коллекция в Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">От векторной базы данных к Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Почему мы создали Vector Lakebase: переосмысление архитектуры неструктурированных данных для ИИ</a></li>
</ul>
<p>Вы также можете направлять вопросы по реализации и отзывы в <a href="https://github.com/milvus-io/milvus">репозиторий Milvus на GitHub</a> или в <a href="https://discord.com/invite/8uyFbECzPX">сообщество Milvus в Discord</a>.</p>
