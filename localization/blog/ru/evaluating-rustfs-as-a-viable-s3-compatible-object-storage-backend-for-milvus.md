---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: >-
  MinIO прекращает принимать изменения сообщества: Оценка RustFS как
  жизнеспособного S3-совместимого бэкенда объектного хранилища для Milvus
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/Min_IO_cover_4102d4ef61.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: >-
  Узнайте, как Milvus использует S3-совместимое хранилище объектов, и как
  развернуть RustFS в качестве замены MinIO в Milvus с помощью практического
  руководства.
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>Этот пост написан Минь Инь, одним из самых активных участников сообщества Milvus, и публикуется здесь с разрешения.</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a> - это высокопроизводительная, совместимая с S3 система хранения объектов с открытым исходным кодом, которая широко используется в AI/ML, аналитике и других рабочих нагрузках, связанных с большими объемами данных. Для многих развертываний <a href="https://milvus.io/">Milvus</a> она также была выбором по умолчанию для объектного хранилища. Однако недавно команда MinIO обновила свой <a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a>, сообщив, что <strong><em>этот проект больше не принимает новых изменений</em></strong><em>.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На самом деле, за последние несколько лет MinIO постепенно сместил свое внимание в сторону коммерческих предложений, ужесточил модель лицензирования и распространения, а также сократил активную разработку в репозитории сообщества. Переход проекта с открытым исходным кодом в режим сопровождения является естественным результатом этого более широкого перехода.</p>
<p>Для пользователей Milvus, которые по умолчанию полагаются на MinIO, это изменение трудно игнорировать. Объектное хранилище лежит в основе слоя персистентности Milvus, и его надежность со временем зависит не только от того, что работает сегодня, но и от того, продолжает ли система развиваться вместе с рабочими нагрузками, которые она поддерживает.</p>
<p>На этом фоне в данной статье рассматривается <a href="https://github.com/rustfs/rustfs">RustFS</a> как потенциальная альтернатива. RustFS - это совместимая с S3 объектная система хранения данных на основе Rust, в которой особое внимание уделяется безопасности памяти и современному дизайну систем. Она все еще является экспериментальной, и это обсуждение не является рекомендацией к использованию.</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">Архитектура Milvus и место компонента объектного хранилища<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.6 используется полностью раздельная архитектура хранения и вычислений. В этой модели уровень хранения состоит из трех независимых компонентов, каждый из которых выполняет свою роль.</p>
<p>Etcd хранит метаданные, Pulsar или Kafka обрабатывает потоковые журналы, а объектное хранилище - как правило, MinIO или S3-совместимый сервис - обеспечивает долговременное хранение векторных данных и индексных файлов. Поскольку хранилище и вычисления разделены, Milvus может масштабировать вычислительные узлы независимо друг от друга, полагаясь при этом на общий надежный бэкэнд хранилища.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">Роль объектного хранилища в Milvus</h3><p>Объектное хранилище - это долговременный уровень хранения данных в Milvus. Сырые векторные данные хранятся в виде бинлогов, там же хранятся индексные структуры, такие как HNSW и IVF_FLAT.</p>
<p>Такая конструкция делает вычислительные узлы статичными. Узлы запросов не хранят данные локально; вместо этого они загружают сегменты и индексы из объектного хранилища по требованию. В результате узлы могут свободно увеличиваться или уменьшаться, быстро восстанавливаться после сбоев и поддерживать динамическую балансировку нагрузки в кластере без перебалансировки данных на уровне хранилища.</p>
<pre><code translate="no">my-milvus-bucket/
├── files/                          <span class="hljs-comment"># rootPath (default)</span>
│   ├── insert_log/                 <span class="hljs-comment"># insert binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}     <span class="hljs-comment"># Per-field binlog files</span>
│   │
│   ├── delta_log/                  <span class="hljs-comment"># Delete binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Log_ID}        
│   │
│   ├── stats_log/                  <span class="hljs-comment"># Statistical data (e.g., Bloom filters)</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}
│   │
│   └── index_files/                <span class="hljs-comment"># Index files</span>
│       └── {Build_ID}_{Index_Version}_{Segment_ID}_{Field_ID}/
│           ├── index_file_0
│           ├── index_file_1
│           └── ...
<button class="copy-code-btn"></button></code></pre>
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Почему Milvus использует API S3</h3><p>Вместо того чтобы разрабатывать собственный протокол хранения, Milvus использует S3 API в качестве интерфейса объектного хранилища. S3 стал стандартом де-факто для объектных хранилищ: крупнейшие облачные провайдеры, такие как AWS S3, Alibaba Cloud OSS и Tencent Cloud COS, поддерживают его нативно, а системы с открытым исходным кодом, такие как MinIO, Ceph RGW, SeaweedFS и RustFS, полностью совместимы.</p>
<p>Стандартизировав S3 API, Milvus может полагаться на зрелые, хорошо протестированные Go SDK вместо того, чтобы поддерживать отдельные интеграции для каждого бэкенда хранения. Эта абстракция также дает пользователям гибкость в развертывании: MinIO для локальной разработки, облачное хранилище объектов в производстве или Ceph и RustFS для частных сред. Пока доступна конечная точка, совместимая с S3, Milvus не нужно знать - или заботиться - о том, какая система хранения используется под ней.</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">Оценка RustFS в качестве S3-совместимого бэкенда объектного хранилища для Milvus<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">Обзор проекта</h3><p>RustFS - это распределенная система хранения объектов, написанная на языке Rust. В настоящее время она находится на стадии альфа-версии (версия 1.0.0-alpha.68) и призвана объединить эксплуатационную простоту MinIO с достоинствами Rust в области безопасности памяти и производительности. Более подробная информация доступна на <a href="https://github.com/rustfs/rustfs">GitHub</a>.</p>
<p>RustFS все еще находится в стадии активной разработки, и ее распределенный режим еще не был официально выпущен. Поэтому на данном этапе RustFS не рекомендуется использовать для производственных или критически важных рабочих нагрузок.</p>
<h3 id="Architecture-Design" class="common-anchor-header">Архитектурный дизайн</h3><p>RustFS работает по схеме, концептуально схожей с MinIO. HTTP-сервер предоставляет S3-совместимый API, менеджер объектов обрабатывает метаданные объектов, а движок хранения отвечает за управление блоками данных. На уровне хранения RustFS опирается на стандартные файловые системы, такие как XFS или ext4.</p>
<p>В планируемом распределенном режиме RustFS собирается использовать etcd для координации метаданных, при этом несколько узлов RustFS образуют кластер. Такой дизайн тесно связан с распространенными архитектурами объектных хранилищ, что делает RustFS знакомой пользователям с опытом работы с MinIO.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">Совместимость с Milvus</h3><p>Прежде чем рассматривать RustFS в качестве альтернативного бэкенда объектного хранилища, необходимо оценить, соответствует ли она основным требованиям Milvus к хранилищу.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Требования Milvus</strong></th><th style="text-align:center"><strong>API S3</strong></th><th style="text-align:center"><strong>Поддержка RustFS</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Сохранение векторных данных</td><td style="text-align:center"><code translate="no">PutObject</code>, <code translate="no">GetObject</code></td><td style="text-align:center">✅ Полностью поддерживается</td></tr>
<tr><td style="text-align:center">Управление индексными файлами</td><td style="text-align:center"><code translate="no">ListObjects</code>, <code translate="no">DeleteObject</code></td><td style="text-align:center">✅ Полностью поддерживается</td></tr>
<tr><td style="text-align:center">Операции слияния сегментов</td><td style="text-align:center">Выгрузка нескольких частей</td><td style="text-align:center">✅ Полностью поддерживается</td></tr>
<tr><td style="text-align:center">Гарантии согласованности</td><td style="text-align:center">Сильное чтение после записи</td><td style="text-align:center">✅ Сильная согласованность (один узел)</td></tr>
</tbody>
</table>
<p>Согласно этой оценке, текущая реализация S3 API в RustFS удовлетворяет базовым функциональным требованиям Milvus. Это делает ее пригодной для практического тестирования в непроизводственных средах.</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">Практическая работа: замена MinIO на RustFS в Milvus<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Цель этого упражнения - заменить стандартную службу хранения объектов MinIO и развернуть Milvus 2.6.7, используя RustFS в качестве бэкенда для хранения объектов.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><ol>
<li><p>Установлены Docker и Docker Compose (версия ≥ 20.10), система может извлекать образы и нормально запускать контейнеры.</p></li>
<li><p>Доступен локальный каталог для хранения объектных данных, например <code translate="no">/volume/data/</code> (или собственный путь).</p></li>
<li><p>Порт хоста 9000 открыт для внешнего доступа, либо настроен альтернативный порт.</p></li>
<li><p>Контейнер RustFS запускается от имени пользователя, не являющегося пользователем root (<code translate="no">rustfs</code>). Убедитесь, что каталог данных хоста принадлежит UID 10001.</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">Шаг 1: Создание каталога данных и установка разрешений</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>Загрузите официальный файл Docker Compose</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">Шаг 2: Изменение службы хранения объектов</h3><p><strong>Определите службу RustFS</strong></p>
<p>Примечание: Убедитесь, что ключ доступа и секретный ключ соответствуют учетным данным, настроенным в службе Milvus.</p>
<pre><code translate="no">rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Завершение конфигурации</strong></p>
<p>Примечание: Конфигурация хранилища Milvus в настоящее время предполагает настройки по умолчанию в стиле MinIO и пока не позволяет использовать пользовательские значения ключа доступа и секретного ключа. При использовании RustFS в качестве замены, он должен использовать те же учетные данные по умолчанию, которые ожидает Milvus.</p>
<pre><code translate="no">version: ‘3.5’
services:
 etcd:
 container_name: milvus-etcd
 image: registry.cn-hangzhou.aliyuncs.com/etcd/etcd: v3.5.25
 environment:
 - ETCD_AUTO_COMPACTION_MODE=revision
 - ETCD_AUTO_COMPACTION_RETENTION=1000
 - ETCD_QUOTA_BACKEND_BYTES=4294967296
 - ETCD_SNAPSHOT_COUNT=50000
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
 <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “etcdctl”, “endpoint”, “health”]
 interval: 30s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
 standalone:
 container_name: milvus-standalone
 image: registry.cn-hangzhou.aliyuncs.com/milvus/milvus: v2.6.7
 command: [”milvus“, ”run“, ”standalone“]
 security_opt:
 - seccomp: unconfined
 environment:
 MINIO_REGION: us-east-1
 ETCD_ENDPOINTS: etcd:2379
 MINIO_ADDRESS: rustfs:9000
 MINIO_ACCESS_KEY: minioadmin
 MINIO_SECRET_KEY: minioadmin
 MINIO_USE_SSL: ”false“
 MQ_TYPE: rocksmq
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
 healthcheck:
 test: [”CMD“, ”curl“, ”-f“, ”http://localhost:9091/healthz&quot;</span>]
 interval: 30s
 start_period: 90s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 ports:
 - “19530:19530”
 - “9091:9091”
 depends_on:
 - “etcd”
 - “rustfs”
networks:
 default:
 name: milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>Запуск служб</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>Проверка состояния служб</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Доступ к веб-интерфейсу RustFS</strong></p>
<p>Откройте веб-интерфейс RustFS в браузере: <a href="http://localhost:9001">http://localhost:9001</a>.</p>
<p>Войдите в систему, используя стандартные учетные данные: имя пользователя и пароль - minioadmin.</p>
<p><strong>Протестируйте службу Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-comment"># connect to Milvus</span>
connections.connect(
 alias=<span class="hljs-string">&quot;default&quot;</span>,
 host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
 port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Successfully connected to Milvus!&quot;</span>)
<span class="hljs-comment"># create test collection</span>
fields = [
 FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
 FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;test collection&quot;</span>)
collection = Collection(name=<span class="hljs-string">&quot;test_collection&quot;</span>, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Test collection created!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ RustFS verified as the S3 storage backend!&quot;</span>)

<span class="hljs-comment">### Step 3: Storage Performance Testing (Experimental)</span>

**Test Design**

Two Milvus deployments were <span class="hljs-built_in">set</span> up on identical hardware (<span class="hljs-number">16</span> cores / <span class="hljs-number">32</span> GB memory / NVMe SSD), using RustFS <span class="hljs-keyword">and</span> MinIO respectively <span class="hljs-keyword">as</span> the <span class="hljs-built_in">object</span> storage backend. The test dataset consisted of <span class="hljs-number">1</span>,<span class="hljs-number">000</span>,<span class="hljs-number">000</span> vectors <span class="hljs-keyword">with</span> <span class="hljs-number">768</span> dimensions, using an HNSW index <span class="hljs-keyword">with</span> parameters _M = 16_ <span class="hljs-keyword">and</span> _efConstruction = 200_. Data was inserted <span class="hljs-keyword">in</span> batches of <span class="hljs-number">5</span>,<span class="hljs-number">000.</span>

The following metrics were evaluated: Insert throughput, Index build time, Cold <span class="hljs-keyword">and</span> warm load time, Search latency, Storage footprint.

**Test Code**

Note: Only the core parts of the test code are shown below.

<button class="copy-code-btn"></button></code></pre>
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # Insert test t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # Index build collection.flush() collection.create_index(field_name=&quot;embedding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...}) # Нагрузочный тест (холодный старт + два теплых старта) collection.release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # Query test search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
-index-type HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
<pre><code translate="no">
**Performance Results**

- **RustFS**

<span class="hljs-function">Faster <span class="hljs-title">writes</span> (<span class="hljs-params">+<span class="hljs-number">57</span>%</span>), lower storage <span class="hljs-title">usage</span> (<span class="hljs-params">–<span class="hljs-number">57</span>%</span>), <span class="hljs-keyword">and</span> faster warm <span class="hljs-title">loads</span> (<span class="hljs-params">+<span class="hljs-number">67</span>%</span>), making it suitable <span class="hljs-keyword">for</span> write-heavy, cost-sensitive workloads. 

Much slower <span class="hljs-title">queries</span> (<span class="hljs-params"><span class="hljs-number">7.96</span> ms vs. <span class="hljs-number">1.85</span> ms, ~+<span class="hljs-number">330</span>% latency</span>) <span class="hljs-keyword">with</span> noticeable <span class="hljs-title">variance</span> (<span class="hljs-params">up to <span class="hljs-number">17.14</span> ms</span>), <span class="hljs-keyword">and</span> 43% slower index builds. Not suitable <span class="hljs-keyword">for</span> query-intensive applications.

- **MinIO**

Excellent query <span class="hljs-title">performance</span> (<span class="hljs-params">**<span class="hljs-number">1.85</span> ms** average latency</span>), mature small-<span class="hljs-keyword">file</span> <span class="hljs-keyword">and</span> random I/O optimizations, <span class="hljs-keyword">and</span> a well-established ecosystem.


|     **Metric**    |  **RustFS**  |   **MinIO**  | **Difference** |
| :---------------: | :----------: | :----------: | :------------: |
| Insert Throughput | 4,472 rows/s | 2,845 rows/s |      0.57      |
|  Index Build Time |     803 s    |     562 s    |      -43%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Cold Start</span>) |    22.7 s    |    18.3 s    |      -24%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Warm Start</span>) |    0.009 s   |    0.027 s   |      0.67      |
|   Search Latency  |    7.96 ms   |    1.85 ms   |    **-330%**   |
|   Storage Usage   |    7.8 GB    |    18.0 GB   |      0.57      |

RustFS significantly outperforms MinIO <span class="hljs-keyword">in</span> write performance <span class="hljs-keyword">and</span> storage efficiency, <span class="hljs-keyword">with</span> both showing roughly 57% improvement. This demonstrates the system-level advantages of the Rust ecosystem. However, the 330% gap <span class="hljs-keyword">in</span> query latency limits RustFS’s suitability <span class="hljs-keyword">for</span> query-intensive workloads.

For **production environments**, cloud-managed <span class="hljs-built_in">object</span> storage services like **AWS S3** are recommended first, <span class="hljs-keyword">as</span> they are mature, stable, <span class="hljs-keyword">and</span> require no operational effort. Self-hosted solutions are better suited to specific scenarios: RustFS <span class="hljs-keyword">for</span> cost-sensitive <span class="hljs-keyword">or</span> write-intensive workloads, MinIO <span class="hljs-keyword">for</span> query-intensive use cases, <span class="hljs-keyword">and</span> Ceph <span class="hljs-keyword">for</span> data sovereignty. With further optimization <span class="hljs-keyword">in</span> random read performance, RustFS has the potential to become a strong self-hosted option.


## Conclusion

MinIO’s decision to stop accepting <span class="hljs-keyword">new</span> community contributions <span class="hljs-keyword">is</span> disappointing <span class="hljs-keyword">for</span> many developers, but it won’t disrupt Milvus users. Milvus depends <span class="hljs-keyword">on</span> the S3 API—<span class="hljs-keyword">not</span> any specific vendor implementation—so swapping storage backends <span class="hljs-keyword">is</span> straightforward. This S3-compatibility layer <span class="hljs-keyword">is</span> intentional: it ensures Milvus stays flexible, portable, <span class="hljs-keyword">and</span> decoupled <span class="hljs-keyword">from</span> vendor <span class="hljs-keyword">lock</span>-<span class="hljs-keyword">in</span>.

For production deployments, cloud-managed services such <span class="hljs-keyword">as</span> AWS S3 <span class="hljs-keyword">and</span> Alibaba Cloud OSS remain the most reliable options. They’re mature, highly available, <span class="hljs-keyword">and</span> drastically reduce the operational load compared to running your own <span class="hljs-built_in">object</span> storage. Self-hosted systems like MinIO <span class="hljs-keyword">or</span> Ceph still make sense <span class="hljs-keyword">in</span> cost-sensitive environments <span class="hljs-keyword">or</span> <span class="hljs-keyword">where</span> data sovereignty <span class="hljs-keyword">is</span> non-negotiable, but they require significantly more engineering overhead to operate safely at scale.

RustFS <span class="hljs-keyword">is</span> interesting—Apache 2.0-licensed, Rust-based, <span class="hljs-keyword">and</span> community-driven—but it&#x27;s still early. The performance gap <span class="hljs-keyword">is</span> noticeable, <span class="hljs-keyword">and</span> the distributed mode hasn’t shipped yet. It’s <span class="hljs-keyword">not</span> production-ready today, but it’s a project worth watching <span class="hljs-keyword">as</span> it matures.

If you’re comparing <span class="hljs-built_in">object</span> storage options <span class="hljs-keyword">for</span> Milvus, evaluating MinIO replacements, <span class="hljs-keyword">or</span> weighing the operational trade-offs of different backends, we’d love to hear <span class="hljs-keyword">from</span> you.

Join our[ Discord channel](<span class="hljs-params">https://discord.com/invite/<span class="hljs-number">8u</span>yFbECzPX</span>) <span class="hljs-keyword">and</span> share your thoughts. You can also book a 20-minute one-<span class="hljs-keyword">on</span>-one session to <span class="hljs-keyword">get</span> insights, guidance, <span class="hljs-keyword">and</span> answers to your questions through[ Milvus Office Hours](<span class="hljs-params">https://milvus.io/blog/<span class="hljs-keyword">join</span>-milvus-office-hours-to-<span class="hljs-keyword">get</span>-support-<span class="hljs-keyword">from</span>-vectordb-experts.md</span>).
</span><button class="copy-code-btn"></button></code></pre>
