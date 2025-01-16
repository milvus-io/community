---
id: building-a-milvus-cluster-based-on-juicefs.md
title: Что такое JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Узнайте, как создать кластер Milvus на базе JuiceFS - общей файловой системы,
  предназначенной для облачных нативных сред.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Создание кластера Milvus на базе JuiceFS</custom-h1><p>Сотрудничество между сообществами разработчиков открытого кода - волшебная вещь. Увлеченные, умные и творческие добровольцы не только поддерживают инновационные решения с открытым исходным кодом, но и работают над тем, чтобы объединить различные инструменты интересными и полезными способами. <a href="https://milvus.io/">Milvus</a>, самая популярная в мире векторная база данных, и <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, общая файловая система, разработанная для облачных сред, были объединены в этом духе их соответствующими сообществами с открытым исходным кодом. В этой статье мы расскажем о том, что такое JuiceFS, как построить кластер Milvus на базе общей файловой системы JuiceFS, а также о производительности, которую могут ожидать пользователи от этого решения.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>Что такое JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS - это высокопроизводительная распределенная POSIX-файловая система с открытым исходным кодом, которая может быть построена поверх Redis и S3. Она была разработана для облачных нативных сред и поддерживает управление, анализ, архивирование и резервное копирование данных любого типа. JuiceFS обычно используется для решения задач, связанных с большими данными, создания приложений искусственного интеллекта (ИИ) и сбора логов. Система также поддерживает совместное использование данных несколькими клиентами и может быть использована непосредственно в качестве общего хранилища в Milvus.</p>
<p>После того как данные и соответствующие им метаданные сохраняются в объектном хранилище и <a href="https://redis.io/">Redis</a> соответственно, JuiceFS выступает в качестве промежуточного ПО без статических данных. Совместное использование данных реализуется за счет того, что различные приложения могут беспрепятственно взаимодействовать друг с другом через стандартный интерфейс файловой системы. Для хранения метаданных JuiceFS опирается на Redis, хранилище данных in-memory с открытым исходным кодом. Redis используется потому, что он гарантирует атомарность и обеспечивает высокую производительность операций с метаданными. Все данные хранятся в объектном хранилище через клиент JuiceFS. Схема архитектуры выглядит следующим образом:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Построение кластера Milvus на базе JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Кластер Milvus, построенный на основе JuiceFS (см. схему архитектуры ниже), работает путем разделения запросов на восходящие потоки с помощью Mishards, промежуточного ПО для шардинга кластеров, чтобы каскадировать запросы вниз к своим субмодулям. При вставке данных Mishards распределяет восходящие запросы на узел записи Milvus, который хранит новые вставленные данные в JuiceFS. При чтении данных Mishards загружает их из JuiceFS через узел чтения Milvus в память для обработки, а затем собирает и возвращает результаты от подсервисов выше по потоку.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Шаг 1: Запуск службы MySQL</strong></h3><p>Запустите службу MySQL на <strong>любом</strong> узле кластера. Подробнее см. в разделе <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Управление метаданными с помощью MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Шаг 2: Создайте файловую систему JuiceFS</strong></h3><p>В демонстрационных целях используется предварительно скомпилированная двоичная программа JuiceFS. Загрузите подходящий для вашей системы <a href="https://github.com/juicedata/juicefs/releases">установочный пакет</a> и следуйте <a href="https://github.com/juicedata/juicefs-quickstart">краткому руководству</a> по установке JuiceFS для получения подробных инструкций. Чтобы создать файловую систему JuiceFS, сначала настройте базу данных Redis для хранения метаданных. Для развертывания в публичном облаке рекомендуется размещать службу Redis в том же облаке, что и приложение. Кроме того, настройте объектное хранилище для JuiceFS. В этом примере используется Azure Blob Storage, однако JuiceFS поддерживает почти все объектные сервисы. Выберите службу хранения объектов, которая лучше всего соответствует требованиям вашего сценария.</p>
<p>После настройки службы Redis и объектного хранилища отформатируйте новую файловую систему и смонтируйте JuiceFS в локальный каталог:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Если сервер Redis запущен не локально, замените localhost на следующий адрес: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Когда установка пройдет успешно, JuiceFS вернет страницу общего хранилища <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Шаг 3: Запустите Milvus</strong></h3><p>На всех узлах кластера должен быть установлен Milvus, и каждый узел Milvus должен быть настроен с правами чтения или записи. Только один узел Milvus может быть настроен как узел записи, остальные должны быть узлами чтения. Сначала задайте параметры секций <code translate="no">cluster</code> и <code translate="no">general</code> в файле конфигурации системы Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Секция</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Параметр</strong></th><th style="text-align:left"><strong>Описание</strong></th><th style="text-align:left"><strong>Конфигурация</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Включать ли режим кластера</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Роль развертывания Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Раздел</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Во время установки настроенный путь к общему хранилищу JuiceFS установлен как <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>После завершения установки запустите Milvus и убедитесь, что он запустился должным образом. Наконец, запустите службу Mishards на <strong>любом</strong> из узлов кластера. На изображении ниже показан успешный запуск Mishards. Для получения дополнительной информации обратитесь к <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">руководству</a> на GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Контрольные показатели производительности</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Решения для совместного хранения данных обычно реализуются с помощью сетевых систем хранения (NAS). Обычно используются такие типы систем NAS, как сетевая файловая система (NFS) и блок серверных сообщений (SMB). Публичные облачные платформы обычно предоставляют управляемые сервисы хранения, совместимые с этими протоколами, например Amazon Elastic File System (EFS).</p>
<p>В отличие от традиционных NAS-систем, JuiceFS реализована на базе Filesystem in Userspace (FUSE), где все операции чтения и записи данных происходят непосредственно на стороне приложения, что еще больше снижает задержки доступа. Кроме того, JuiceFS обладает уникальными функциями, которые не встречаются в других NAS-системах, например, сжатие и кэширование данных.</p>
<p>Бенчмарк-тестирование показало, что JuiceFS имеет значительные преимущества перед EFS. В бенчмарке метаданных (рис. 1) количество операций ввода-вывода в секунду (IOPS) в JuiceFS в десять раз выше, чем в EFS. Кроме того, в бенчмарке I/O throughput (рисунок 2) JuiceFS превосходит EFS как в однозадачном, так и в многозадачном сценарии.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-2.png</span> </span></p>
<p>Кроме того, тестирование показало, что время получения первого запроса, или время загрузки новых данных с диска в память, для кластера Milvus на базе JuiceFS составляет в среднем всего 0,032 секунды, что говорит о том, что данные загружаются с диска в память практически мгновенно. В этом тесте время поиска по первому запросу измерялось с использованием одного миллиона строк 128-мерных векторных данных, вставляемых партиями по 100 тыс. с интервалом от 1 до 8 секунд.</p>
<p>JuiceFS - это стабильная и надежная файловая система хранения данных общего доступа, а кластер Milvus, построенный на JuiceFS, обеспечивает высокую производительность и гибкие возможности хранения данных.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Узнайте больше о Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus - это мощный инструмент, способный обеспечить работу огромного количества приложений искусственного интеллекта и векторного поиска сходства. Чтобы узнать больше о проекте, ознакомьтесь со следующими ресурсами:</p>
<ul>
<li>Читайте наш <a href="https://zilliz.com/blog">блог</a>.</li>
<li>Общайтесь с нашим сообществом разработчиков открытого кода в <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Используйте самую популярную в мире базу данных векторов на <a href="https://github.com/milvus-io/milvus/">GitHub</a> и вносите в нее свой вклад.</li>
<li>Быстро протестируйте и разверните приложения ИИ с помощью нашего нового <a href="https://github.com/milvus-io/bootcamp">буткемпа</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>биография писателя чанцзянь гао.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>биография писателя цзинцзин цзя.png</span> </span></p>
