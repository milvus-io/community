---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Высокая доступность базы данных Vector: как построить резервный кластер Milvus
  с CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Узнайте, как построить векторную базу данных высокой доступности с помощью
  Milvus CDC. Пошаговое руководство по первичной и резервной репликации, обходу
  отказа и производственному DR.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Каждой производственной базе данных необходим план действий на случай, если что-то пойдет не так. Реляционные базы данных уже несколько десятилетий имеют WAL shipping, binlog replication и автоматическое восстановление после сбоев. Но <a href="https://zilliz.com/learn/what-is-a-vector-database">векторные базы данных</a> - несмотря на то, что они стали основной инфраструктурой для приложений искусственного интеллекта - все еще находятся в процессе становления. Большинство из них в лучшем случае предлагают избыточность на уровне узлов. Если весь кластер выходит из строя, вы восстанавливаетесь из резервных копий и перестраиваете <a href="https://zilliz.com/learn/vector-index">векторные индексы</a> с нуля - процесс, который может занять несколько часов и обойтись в тысячи вычислений, поскольку регенерация <a href="https://zilliz.com/glossary/vector-embeddings">вкраплений</a> с помощью ML-конвейера стоит недешево.</p>
<p><a href="https://milvus.io/">Milvus</a> использует другой подход. Он предлагает многоуровневую высокую доступность: реплики на уровне узлов для быстрого восстановления после сбоев внутри кластера, репликацию на основе CDC для защиты на уровне кластера и между регионами, а также резервное копирование для восстановления сети безопасности. Такая многоуровневая модель является стандартной практикой для традиционных баз данных - Milvus стала первой крупной векторной базой данных, которая применила ее к векторным рабочим нагрузкам.</p>
<p>В этом руководстве рассматриваются две вещи: стратегии высокой доступности, доступные для векторных баз данных (чтобы вы могли оценить, что на самом деле означает "готовность к производству"), и практическое руководство по настройке первичной и резервной репликации Milvus CDC с нуля.</p>
<blockquote>
<p>Это <strong>первая часть</strong> цикла:</p>
<ul>
<li><strong>Часть 1</strong> (эта статья): Настройка первичной и резервной репликации на новых кластерах</li>
<li><strong>Часть 2</strong>: Добавление CDC в существующий кластер, в котором уже есть данные, с помощью <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Часть 3</strong>: Управление обходом отказа - продвижение резервного кластера, когда основной выходит из строя</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Почему высокая доступность важнее для векторных баз данных?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Когда традиционная база данных SQL выходит из строя, вы теряете доступ к структурированным записям - но сами данные обычно можно повторно импортировать из предыдущих источников. Когда выходит из строя векторная база данных, восстановить ее принципиально сложнее.</p>
<p>Векторные базы данных хранят <a href="https://zilliz.com/glossary/vector-embeddings">вкрапления</a> - плотные числовые представления, генерируемые ML-моделями. Их восстановление означает повторное прохождение всего набора данных через конвейер встраивания: загрузка сырых документов, их разбивка на части, вызов <a href="https://zilliz.com/ai-models">модели встраивания</a> и повторная индексация. Для набора данных с сотнями миллионов векторов это может занять несколько дней и обойтись в тысячи долларов на вычислениях на GPU.</p>
<p>Тем временем системы, зависящие от <a href="https://zilliz.com/learn/what-is-vector-search">векторного поиска</a>, часто оказываются на критическом пути:</p>
<ul>
<li><strong>Конвейеры<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong>, обеспечивающие работу чат-ботов и поиска для клиентов - если база данных векторов не работает, поиск останавливается, и ИИ возвращает общие или галлюцинаторные ответы.</li>
<li><strong>Системы рекомендаций</strong>, которые в режиме реального времени предлагают продукты или контент - простой означает упущенную выгоду.</li>
<li>Системы<strong>обнаружения мошенничества и мониторинга аномалий</strong>, которые используют <a href="https://zilliz.com/glossary/similarity-search">поиск по сходству</a> для выявления подозрительной активности - пробел в покрытии создает окно уязвимости.</li>
<li><strong>Автономные агентские системы</strong>, использующие векторные хранилища для запоминания и поиска инструментов - без своей базы знаний агенты не справляются или зацикливаются.</li>
</ul>
<p>Если вы оцениваете векторные базы данных для любого из этих сценариев использования, высокая доступность - это не просто приятная функция, которую можно проверить позже. Она должна быть одной из первых, на которую вы обращаете внимание.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">Как выглядит высокая доступность производственного уровня для векторной базы данных?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Не все средства высокой доступности одинаковы. Векторная база данных, которая справляется с отказами узлов только в рамках одного кластера, не является "высокодоступной" в том смысле, который требуется производственной системе. Настоящая HA должна охватывать три уровня:</p>
<table>
<thead>
<tr><th>Слой</th><th>От чего защищает</th><th>Как работает</th><th>Время восстановления</th><th>Потеря данных</th></tr>
</thead>
<tbody>
<tr><td><strong>Уровень узла</strong> (мультирепликация)</td><td>Авария одного узла, аппаратный сбой, повреждение OOM, отказ AZ.</td><td>Копирование одних и тех же <a href="https://milvus.io/docs/glossary.md">сегментов данных</a> на нескольких узлах; другие узлы принимают нагрузку на себя</td><td>Мгновенно</td><td>Ноль</td></tr>
<tr><td><strong>Уровень кластера</strong> (репликация CDC)</td><td>Весь кластер выходит из строя - неудачное развертывание K8s, удаление пространства имен, повреждение хранилища</td><td>Потоковая передача каждой записи на резервный кластер через <a href="https://milvus.io/docs/four_layers.md">журнал Write-Ahead Log</a>; резервный кластер всегда отстает на несколько секунд</td><td>Минуты</td><td>Секунды</td></tr>
<tr><td><strong>Подстраховка</strong> (периодическое резервное копирование)</td><td>Катастрофическое повреждение данных, выкупное ПО, человеческая ошибка, распространяющаяся через репликацию.</td><td>Периодически делает моментальные снимки и хранит их в отдельном месте</td><td>Часы</td><td>Часы (с момента последнего резервного копирования)</td></tr>
</tbody>
</table>
<p>Эти уровни дополняют друг друга, а не являются альтернативой. В производственном развертывании они должны сочетаться:</p>
<ol>
<li><strong>Сначала<a href="https://milvus.io/docs/replica.md">мультирепликатор</a></strong> - он справляется с наиболее распространенными отказами (сбои узлов, отказы AZ) с нулевым временем простоя и нулевой потерей данных.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a></strong> - защищает от сбоев, которые не под силу мультиреплике: перебои в работе всего кластера, катастрофические человеческие ошибки. Резервный кластер находится в другом домене отказов.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">Периодическое резервное копирование</a> всегда</strong> - ваш последний способ защиты. Даже CDC не спасет вас, если поврежденные данные будут реплицированы на резервный кластер до того, как вы их поймаете.</li>
</ol>
<p>Оценивая векторные базы данных, спросите: какие из этих трех уровней продукт действительно поддерживает? Большинство векторных баз данных сегодня предлагают только первый. Milvus поддерживает все три, причем CDC является встроенной функцией, а не сторонним дополнением.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Что такое Milvus CDC и как он работает?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong> - это встроенная функция репликации, которая считывает <a href="https://milvus.io/docs/four_layers.md">журнал записи-восстановления (WAL)</a> основного кластера и передает каждую запись на отдельный резервный кластер. Резервный кластер воспроизводит записи и в итоге получает те же самые данные, обычно на несколько секунд позже.</p>
<p>Эта схема хорошо известна в мире баз данных. В MySQL есть репликация binlog. В PostgreSQL есть доставка WAL. В MongoDB используется репликация на основе oplog. Это проверенные методы, которые поддерживают реляционные и документальные базы данных в рабочем состоянии на протяжении десятилетий. Milvus предлагает тот же подход к векторным рабочим нагрузкам - это первая крупная <a href="https://zilliz.com/learn/what-is-a-vector-database">векторная база данных</a>, предлагающая репликацию на основе WAL в качестве встроенной функции.</p>
<p>Три свойства делают CDC подходящей для аварийного восстановления:</p>
<ul>
<li><strong>Синхронизация с низкой задержкой.</strong> CDC передает операции по мере их выполнения, а не запланированными партиями. В нормальных условиях резервная копия отстает от основной на несколько секунд.</li>
<li><strong>Упорядоченное воспроизведение.</strong> Операции поступают в резервную систему в том же порядке, в каком они были записаны. Данные остаются неизменными без выверки.</li>
<li><strong>Восстановление контрольной точки.</strong> Если процесс CDC терпит крах или падает сеть, он возобновляет работу с того места, на котором остановился. Данные не пропускаются и не дублируются.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Как работает архитектура CDC?</h3><p>Развертывание CDC состоит из трех компонентов:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>Архитектура CDC, показывающая исходный кластер с потоковыми узлами и узлами CDC, потребляющими WAL, реплицирующими данные на прокси-уровень целевого кластера, который передает операции DDL/DCL/DML потоковым узлам и добавляет их в WAL</span> </span></p>
<table>
<thead>
<tr><th>Компонент</th><th>Роль</th></tr>
</thead>
<tbody>
<tr><td><strong>Основной кластер</strong></td><td>Производственный <a href="https://milvus.io/docs/architecture_overview.md">экземпляр Milvus</a>. Все чтения и записи происходят здесь. Каждая запись записывается в WAL.</td></tr>
<tr><td><strong>Узел CDC</strong></td><td>Фоновый процесс рядом с основным. Считывает записи WAL и пересылает их резервному. Работает независимо от пути чтения/записи - не влияет на производительность запросов и вставок.</td></tr>
<tr><td><strong>Резервный кластер</strong></td><td>Отдельный экземпляр Milvus, который воспроизводит переданные записи WAL. Хранит те же данные, что и основной, с секундной задержкой. Может обслуживать запросы на чтение, но не принимает записи.</td></tr>
</tbody>
</table>
<p>Поток: записи попадают на основной → CDC-узел копирует их на резервный → резервный воспроизводит их. Ничто другое не обращается к пути записи резервного сервера. Если основной узел выходит из строя, резервный уже имеет почти все данные и может быть переведен на новый уровень.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Учебное пособие: Настройка резервного кластера Milvus CDC<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Остальная часть этой статьи представляет собой практическое руководство. К концу статьи у вас будет два работающих кластера Milvus с репликацией между ними в режиме реального времени.</p>
<h3 id="Prerequisites" class="common-anchor-header">Предварительные условия</h3><p>Перед началом работы:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 или более поздняя версия.</strong> CDC требует эту версию. Рекомендуется последняя версия патча 2.6.x.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 или более поздней версии.</strong> В этом руководстве Оператор используется для управления кластером Kubernetes.</li>
<li><strong>Работающий кластер Kubernetes</strong> с настроенными <code translate="no">kubectl</code> и <code translate="no">helm</code>.</li>
<li><strong>Python с <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> для шага настройки репликации.</li>
</ul>
<p>Два ограничения в текущем выпуске:</p>
<table>
<thead>
<tr><th>Ограничение</th><th>Подробности</th></tr>
</thead>
<tbody>
<tr><td>Одна реплика CDC</td><td>Одна реплика CDC на кластер. Распределенный CDC планируется в будущем выпуске.</td></tr>
<tr><td>Нет BulkInsert</td><td><a href="https://milvus.io/docs/import-data.md">BulkInsert</a> не поддерживается при включенном CDC. Также планируется к выпуску в будущем.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Шаг 1: Обновление Milvus Operator</h3><p>Обновите Milvus Operator до версии 1.3.4 или более поздней:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Убедитесь, что операторская капсула запущена:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Шаг 2: Развертывание первичного кластера</h3><p>Создайте YAML-файл для первичного (исходного) кластера. Раздел <code translate="no">cdc</code> в разделе <code translate="no">components</code> указывает оператору развернуть CDC-узел рядом с кластером:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Настройка <code translate="no">msgStreamType: woodpecker</code> использует встроенный в Milvus <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a> вместо внешней очереди сообщений, такой как Kafka или Pulsar. Woodpecker - это облачный нативный журнал с опережающей записью, представленный в Milvus 2.6, который устраняет необходимость во внешней инфраструктуре обмена сообщениями.</p>
<p>Примените конфигурацию:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Дождитесь, пока все стручки достигнут статуса Running. Убедитесь, что стручок CDC работает:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Шаг 3: Развертывание резервного кластера</h3><p>Резервный (целевой) кластер использует ту же версию Milvus, но не включает компонент CDC - он только получает реплицированные данные:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Применить:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Убедитесь, что все стручки запущены:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Шаг 4: Настройте отношения репликации</h3><p>Когда оба кластера запущены, настройте топологию репликации с помощью Python с <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Определите детали соединения кластеров и имена физических каналов (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Создайте конфигурацию репликации:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Примените к обоим кластерам:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>После этого инкрементные изменения на основном кластере начнут автоматически реплицироваться на резервный.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Шаг 5: Убедитесь, что репликация работает</h3><ol>
<li>Подключитесь к основному кластеру, <a href="https://milvus.io/docs/manage-collections.md">создайте коллекцию</a>, <a href="https://milvus.io/docs/insert-update-delete.md">вставьте несколько векторов</a> и <a href="https://milvus.io/docs/load-and-release.md">загрузите ее</a>.</li>
<li>Запустите поиск на основном сервере, чтобы убедиться, что данные там есть.</li>
<li>Подключитесь к резервному серверу и выполните тот же поиск.</li>
<li>Если резервная копия выдает те же результаты, значит, репликация работает.</li>
</ol>
<p>В <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> рассказывается о создании, вставке и поиске коллекций, если вам нужна справочная информация.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Запуск CDC в производстве<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Настройка CDC - это самая простая часть. Для поддержания его надежности в течение длительного времени требуется внимание к нескольким операционным областям.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Отслеживайте отставание репликации</h3><p>Резервный сервер всегда немного отстает от основного - это свойственно асинхронной репликации. При нормальной нагрузке это отставание составляет несколько секунд. Но скачки записи, перегрузка сети или нехватка ресурсов на резервном сервере могут привести к его увеличению.</p>
<p>Отслеживайте отставание как метрику и предупреждайте о нем. Задержка, которая растет без восстановления, обычно означает, что узел CDC не справляется с пропускной способностью записи. Сначала проверьте пропускную способность сети между кластерами, а затем подумайте, нужны ли резервному узлу дополнительные ресурсы.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Используйте резервный узел для масштабирования чтения</h3><p>Резервный узел - это не просто холодная резервная копия, простаивающая до тех пор, пока не произойдет катастрофа. Он принимает <a href="https://milvus.io/docs/single-vector-search.md">запросы на поиск и запросы</a> при активной репликации - блокируется только запись. Это открывает возможности для практического использования:</p>
<ul>
<li>Перенаправить на резервную копию пакетные <a href="https://zilliz.com/glossary/similarity-search">поисковые</a> или аналитические нагрузки.</li>
<li>Разделение трафика чтения в часы пик для снижения нагрузки на основную систему.</li>
<li>Выполнять дорогостоящие запросы (большие top-K, фильтрованный поиск по большим коллекциям), не влияя на задержку записи на производстве.</li>
</ul>
<p>Таким образом, инфраструктура DR превращается в актив производительности. Резервная система зарабатывает даже тогда, когда ничего не сломано.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Правильно определяйте размер резервного хранилища</h3><p>Резервный сервер воспроизводит все записи с основного, поэтому ему требуются аналогичные ресурсы вычислительной техники и памяти. Если вы также направляете на него чтение, учитывайте эту дополнительную нагрузку. Требования к хранилищу идентичны - на нем хранятся те же данные.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Тестируйте отказоустойчивость до того, как она понадобится</h3><p>Не ждите реального сбоя, чтобы обнаружить, что ваш процесс обхода отказа не работает. Периодически проводите испытания:</p>
<ol>
<li>Остановите запись на основной сервер.</li>
<li>Подождите, пока резервный накопитель догонит основной (отставание → 0)</li>
<li>Перевести резервный сервер в другую категорию</li>
<li>Убедитесь, что запросы возвращают ожидаемые результаты</li>
<li>Обратный процесс</li>
</ol>
<p>Измерьте, сколько времени занимает каждый шаг, и задокументируйте его. Цель состоит в том, чтобы сделать обход отказа рутинной процедурой с известными сроками - а не стрессовой импровизацией в 3 часа ночи. В третьей части этой серии мы подробно рассмотрим процесс обхода отказа.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Не хотите сами управлять CDC? Zilliz Cloud справится с этим<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Настройка и эксплуатация CDC-репликации Milvus - это мощный инструмент, но он сопряжен с операционными расходами: вы управляете двумя кластерами, следите за состоянием репликации, обрабатываете учебники обхода отказа и поддерживаете инфраструктуру в разных регионах. Для команд, которым нужна HA производственного уровня без операционной нагрузки, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемая Milvus) предоставляет такую возможность из коробки.</p>
<p><strong>Глобальный кластер</strong> - главная особенность Zilliz Cloud. Он позволяет запускать развертывание Milvus, охватывающее несколько регионов - Северную Америку, Европу, Азиатско-Тихоокеанский регион и другие - в виде единого логического кластера. Под капотом используется та же технология репликации CDC/WAL, о которой говорилось в этой статье, но с полным управлением:</p>
<table>
<thead>
<tr><th>Возможности</th><th>Самоуправляемый CDC (эта статья)</th><th>Глобальный кластер Zilliz Cloud</th></tr>
</thead>
<tbody>
<tr><td><strong>Репликация</strong></td><td>Вы настраиваете и контролируете</td><td>Автоматизированный, асинхронный конвейер CDC</td></tr>
<tr><td><strong>Отказоустойчивость</strong></td><td>Руководство по выполнению вручную</td><td>Автоматизированный - без изменений кода, без обновления строк соединений</td></tr>
<tr><td><strong>Самовосстановление</strong></td><td>Вы сами перепрофилируете отказавший кластер.</td><td>Автоматически: обнаруживает устаревшее состояние, перезагружается и перестраивается как свежая вторичная система.</td></tr>
<tr><td><strong>Межрегиональный</strong></td><td>Вы развертываете и управляете обоими кластерами</td><td>Встроенная многорегиональность с локальным доступом для чтения</td></tr>
<tr><td><strong>RPO</strong></td><td>Секунды (зависит от мониторинга)</td><td>Секунды (незапланированное) / Ноль (запланированное переключение)</td></tr>
<tr><td><strong>RTO</strong></td><td>Минуты (зависит от вашего runbook)</td><td>Минуты (автоматически)</td></tr>
</tbody>
</table>
<p>Помимо Global Cluster, план Business Critical включает дополнительные функции DR:</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR)</strong> - откат коллекции к любому моменту в пределах окна сохранения, что полезно для восстановления после случайного удаления или повреждения данных, которые реплицируются на резервную копию.</li>
<li><strong>Межрегиональное резервное копирование</strong> - автоматическая непрерывная репликация резервных копий в регион назначения. Восстановление на новых кластерах занимает считанные минуты.</li>
<li><strong>Гарантия безотказной работы 99,99 %</strong> - поддерживается развертыванием нескольких кластеров с множеством реплик.</li>
</ul>
<p>Если вы используете векторный поиск в производстве и DR является обязательным требованием, стоит оценить Zilliz Cloud наряду с самоуправляемым подходом Milvus. <a href="https://zilliz.com/contact-sales">Свяжитесь с командой Zilliz</a> для получения подробной информации.</p>
<h2 id="Whats-Next" class="common-anchor-header">Что дальше<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье мы рассмотрели ландшафт HA для векторных баз данных и рассказали о создании пары "основной- резервный" с нуля. Далее:</p>
<ul>
<li><strong>Часть 2</strong>: Добавление CDC в существующий кластер Milvus, в котором уже есть данные, использование <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> для создания резервной копии перед включением репликации.</li>
<li><strong>Часть 3</strong>: Управление обходом отказа - продвижение резервного сервера, перенаправление трафика и восстановление исходного основного сервера.</li>
</ul>
<p>Оставайтесь с нами.</p>
<hr>
<p>Если вы используете <a href="https://milvus.io/">Milvus</a> в производстве и думаете о восстановлении после сбоев, мы будем рады вам помочь:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">сообществу Milvus Slack</a>, чтобы задавать вопросы, делиться своей архитектурой HA и учиться у других команд, работающих с Milvus в масштабе.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы узнать о настройках DR - будь то конфигурация CDC, планирование обхода отказа или развертывание в нескольких регионах.</li>
<li>Если вы предпочитаете пропустить настройку инфраструктуры и сразу перейти к готовой к производству HA, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемая Milvus) предлагает межрегиональную высокую доступность благодаря функции Global Cluster - ручная настройка CDC не требуется.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают, когда команды начинают настраивать высокую доступность векторных баз данных:</p>
<p><strong>В: Замедляет ли CDC работу основного кластера?</strong></p>
<p>Нет. Узел CDC читает журналы WAL асинхронно, независимо от пути чтения/записи. Он не конкурирует с запросами или вставками за ресурсы на основном кластере. Вы не увидите разницы в производительности при включенном CDC.</p>
<p><strong>Вопрос: Может ли CDC реплицировать данные, существовавшие до его включения?</strong></p>
<p>Нет - CDC фиксирует изменения только с момента включения. Чтобы перенести существующие данные в резервную копию, используйте <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> для посева резервной копии, а затем включите CDC для текущей репликации. Во второй части этой серии рассказывается об этом рабочем процессе.</p>
<p><strong>Вопрос: Нужен ли мне CDC, если у меня уже включена мультирепликация?</strong></p>
<p>Они защищают от разных режимов сбоя. <a href="https://milvus.io/docs/replica.md">Мультирепликация</a> хранит копии одних и тех же <a href="https://milvus.io/docs/glossary.md">сегментов</a> на узлах одного кластера - отлично подходит при сбоях узлов, но бесполезна, когда весь кластер не работает (неудачное развертывание, отключение AZ, удаление пространства имен). CDC хранит отдельный кластер в другой области отказов с данными практически в режиме реального времени. Для любых задач, выходящих за рамки среды разработки, вам нужны оба варианта.</p>
<p><strong>В: Как Milvus CDC сопоставляется с репликацией в других векторных базах данных?</strong></p>
<p>Большинство векторных баз данных сегодня предлагают избыточность на уровне узлов (эквивалент мультирепликации), но не имеют репликации на уровне кластера. В настоящее время Milvus - единственная крупная векторная база данных со встроенной репликацией CDC на основе WAL - та же проверенная схема, которая используется в реляционных базах данных, таких как PostgreSQL и MySQL, уже несколько десятилетий. Если требуется кросс-кластерная или кросс-региональная отказоустойчивость, это важный фактор, который следует оценить.</p>
