---
id: the-developers-guide-to-milvus-configuration.md
title: Руководство разработчика по конфигурированию Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Упростите конфигурацию Milvus с помощью нашего руководства. Узнайте о ключевых
  параметрах, которые необходимо настроить для повышения производительности
  приложений векторных баз данных.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Введение<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Как разработчик, работающий с Milvus, вы, вероятно, сталкивались с пугающим конфигурационным файлом <code translate="no">milvus.yaml</code> с его 500+ параметрами. Справиться с этой сложностью может быть непросто, когда все, что вы хотите, - это оптимизировать производительность векторной базы данных.</p>
<p>Хорошая новость: вам не нужно разбираться в каждом параметре. В этом руководстве мы рассмотрим шум и сосредоточимся на критически важных параметрах, которые действительно влияют на производительность, и укажем, какие именно значения следует изменить для вашего конкретного случая использования.</p>
<p>Создаете ли вы рекомендательную систему, которой нужны молниеносные запросы, или оптимизируете приложение векторного поиска с ограничениями по стоимости, я покажу вам, какие именно параметры нужно изменить, используя практические, проверенные значения. К концу этого руководства вы будете знать, как настраивать конфигурации Milvus для достижения максимальной производительности, основываясь на реальных сценариях развертывания.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Категории конфигураций<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем перейти к конкретным параметрам, давайте разберем структуру конфигурационного файла. При работе с <code translate="no">milvus.yaml</code> вы будете иметь дело с тремя категориями параметров:</p>
<ul>
<li><p><strong>Конфигурации компонентов зависимостей</strong>: Внешние сервисы, к которым подключается Milvus (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - критичны для настройки кластера и сохранения данных.</p></li>
<li><p><strong>Конфигурации внутренних компонентов</strong>: Внутренняя архитектура Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, и т.д.) - ключ к настройке производительности</p></li>
<li><p><strong>Функциональные конфигурации</strong>: Безопасность, ведение журналов и ограничения ресурсов - важны для производственных развертываний</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Конфигурации компонентов зависимостей Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Начнем с внешних сервисов, от которых зависит Milvus. Эти конфигурации особенно важны при переходе от разработки к производству.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Хранилище метаданных</h3><p>Milvus полагается на <code translate="no">etcd</code> для хранения метаданных и координации сервисов. Следующие параметры имеют решающее значение:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Указывает адрес кластера etcd. По умолчанию Milvus запускает связанный экземпляр, но в корпоративных средах лучше всего подключаться к управляемому сервису <code translate="no">etcd</code> для повышения доступности и оперативного контроля.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Определяет ключевой префикс для хранения данных, связанных с Milvus, в etcd. Если вы работаете с несколькими кластерами Milvus на одном бэкенде etcd, использование разных корневых путей обеспечивает чистую изоляцию метаданных.</p></li>
<li><p><code translate="no">etcd.auth</code>: Управляет учетными данными аутентификации. По умолчанию Milvus не включает etcd auth, но если ваш управляемый экземпляр etcd требует учетных данных, вы должны указать их здесь.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Хранилище объектов</h3><p>Несмотря на название, этот раздел регулирует работу всех S3-совместимых клиентов службы хранения объектов. Он поддерживает таких провайдеров, как AWS S3, GCS и Aliyun OSS через настройку <code translate="no">cloudProvider</code>.</p>
<p>Обратите внимание на эти четыре ключевые конфигурации:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Используйте их для указания конечной точки вашей службы хранения объектов.</p></li>
<li><p><code translate="no">minio.bucketName</code>: : Назначьте отдельные ведра (или логические префиксы), чтобы избежать столкновений данных при работе нескольких кластеров Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: : Включает внутриведерное пространство имен для изоляции данных.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Идентифицирует бэкэнд OSS. Полный список совместимости см. в <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">документации Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Очередь сообщений</h3><p>Milvus использует очередь сообщений для распространения внутренних событий - либо Pulsar (по умолчанию), либо Kafka. Обратите внимание на следующие три параметра.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Установите эти значения, чтобы использовать внешний кластер Pulsar.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Определяет имя арендатора. Когда несколько кластеров Milvus совместно используют экземпляр Pulsar, это обеспечивает чистое разделение каналов.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Если вы предпочитаете обходиться без модели арендаторов Pulsar, настройте префикс канала, чтобы избежать коллизий.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus также поддерживает Kafka в качестве очереди сообщений. Чтобы использовать Kafka вместо нее, закомментируйте настройки, специфичные для Pulsar, и отмените блок конфигурации Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Конфигурации внутренних компонентов Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Метаданные + временные метки</h3><p>Узел <code translate="no">rootCoord</code> обрабатывает изменения метаданных (DDL/DCL) и управление временными метками.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>：Устанавливает верхнюю границу на количество разделов в коллекции. Хотя жесткий предел составляет 1024, этот параметр служит главным образом для защиты. В многопользовательских системах следует избегать использования разделов в качестве границ изоляции, а вместо этого реализовать стратегию ключей арендаторов, рассчитанную на миллионы логических арендаторов.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Включает высокую доступность путем активации резервного узла. Это очень важно, поскольку узлы координатора Milvus по умолчанию не масштабируются горизонтально.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: API-шлюз + маршрутизатор запросов</h3><p><code translate="no">proxy</code> обрабатывает запросы клиентов, проверяет запросы и агрегирует результаты.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Ограничивает количество полей (скалярных + векторных) в одной коллекции. Не превышайте 64, чтобы минимизировать сложность схемы и уменьшить накладные расходы на ввод-вывод.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Контролирует количество векторных полей в коллекции. Milvus поддерживает мультимодальный поиск, но на практике 10 векторных полей - это безопасный верхний предел.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Определяет количество осколков для всасывания. Как правило:</p>
<ul>
<li><p>&lt; 200M записей → 1 шард</p></li>
<li><p>200-400 М записей → 2 осколка</p></li>
<li><p>Дальше масштабируйте линейно.</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Если эта функция включена, в журнал записывается подробная информация о запросе (пользователь, IP, конечная точка, SDK). Полезно для аудита и отладки.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Выполнение запросов</h3><p>Управляет выполнением векторного поиска и загрузкой сегментов. Обратите внимание на следующий параметр.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Включает отображение ввода-вывода в память для загрузки скалярных полей и сегментов. Включение <code translate="no">mmap</code> помогает уменьшить занимаемую память, но может ухудшить задержку, если дисковый ввод-вывод станет узким местом.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Управление сегментами и индексами</h3><p>Этот параметр управляет сегментацией данных, индексацией, уплотнением и сборкой мусора (GC). Основные параметры конфигурации включают:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Указывает максимальный размер сегмента данных в памяти. Большие сегменты обычно означают меньшее общее количество сегментов в системе, что может повысить производительность запросов за счет снижения накладных расходов на индексирование и поиск. Например, некоторые пользователи, использующие экземпляры <code translate="no">queryNode</code> с 128 ГБ оперативной памяти, сообщили, что увеличение этого параметра с 1 ГБ до 8 ГБ привело к повышению производительности запросов примерно в 4 раза.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Аналогично вышеуказанному, этот параметр управляет максимальным размером <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">дисковых индексов</a> (индекс diskann).</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Определяет, когда растущий сегмент будет закрыт (т. е. завершен и проиндексирован). Сегмент закрывается, когда он достигает <code translate="no">maxSize * sealProportion</code>. По умолчанию, при использовании <code translate="no">maxSize = 1024MB</code> и <code translate="no">sealProportion = 0.12</code>, сегмент будет закрыт при размере около 123 МБ.</p></li>
</ol>
<ul>
<li><p>При меньших значениях (например, 0,12) сегмент запечатывается раньше, что позволяет быстрее создавать индексы, что полезно для рабочих нагрузок с частыми обновлениями.</p></li>
<li><p>Более высокие значения (например, 0,3-0,5) задерживают запечатывание, снижая накладные расходы на индексирование - больше подходит для сценариев автономного или пакетного ввода.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Устанавливает допустимый коэффициент расширения при уплотнении. Milvus рассчитывает максимально допустимый размер сегмента при уплотнении как <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: После уплотнения сегмента или удаления коллекции Milvus не удаляет базовые данные немедленно. Вместо этого он помечает сегменты для удаления и ждет завершения цикла сборки мусора (GC). Этот параметр управляет продолжительностью этой задержки.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Другие функциональные конфигурации<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Наблюдаемость и диагностика</h3><p>Надежное протоколирование является краеугольным камнем любой распределенной системы, и Milvus не исключение. Хорошо настроенная система логирования не только помогает отлаживать проблемы по мере их возникновения, но и обеспечивает лучшую видимость состояния и поведения системы с течением времени.</p>
<p>Для производственных развертываний мы рекомендуем интегрировать журналы Milvus с централизованными инструментами регистрации и мониторинга, такими как <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>, чтобы упростить анализ и оповещение. Основные настройки включают:</p>
<ol>
<li><p><code translate="no">log.level</code>: Управляет степенью подробности вывода журнала. Для производственных сред следует придерживаться уровня <code translate="no">info</code>, чтобы фиксировать важные детали во время выполнения, не перегружая систему. Во время разработки или устранения неполадок можно переключиться на уровень <code translate="no">debug</code>, чтобы получить более подробную информацию о внутренних операциях. ⚠️ Будьте осторожны с уровнем <code translate="no">debug</code> в производстве - он генерирует большой объем журналов, которые могут быстро занимать место на диске и снижать производительность ввода-вывода, если их не контролировать.</p></li>
<li><p><code translate="no">log.file</code>: По умолчанию Milvus пишет журналы в стандартный вывод (stdout), что подходит для контейнерных сред, где журналы собираются через сайдкэры или агенты узлов. Чтобы включить ведение журналов на основе файлов, вы можете настроить:</p></li>
</ol>
<ul>
<li><p>Максимальный размер файла перед ротацией</p></li>
<li><p>Период хранения файлов</p></li>
<li><p>Количество резервных файлов журнала для хранения.</p></li>
</ul>
<p>Это полезно в пустых или локальных средах, где доставка журналов через stdout недоступна.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Аутентификация и контроль доступа</h3><p>Milvus поддерживает <a href="https://milvus.io/docs/authenticate.md?tab=docker">аутентификацию пользователей</a> и <a href="https://milvus.io/docs/rbac.md">контроль доступа на основе ролей (RBAC)</a>, которые настраиваются в модуле <code translate="no">common</code>. Эти параметры необходимы для обеспечения безопасности многопользовательских сред или любых развертываний, открытых для внешних клиентов.</p>
<p>Ключевые параметры включают:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Этот тумблер включает или отключает аутентификацию и RBAC. По умолчанию он выключен, то есть все операции разрешены без проверки личности. Чтобы обеспечить безопасный контроль доступа, установите этот параметр на <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Если аутентификация включена, этот параметр определяет начальный пароль для встроенного пользователя <code translate="no">root</code>.</p></li>
</ol>
<p>Обязательно измените пароль по умолчанию сразу после включения аутентификации, чтобы избежать уязвимостей безопасности в производственных средах.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Ограничение скорости и контроль записи</h3><p>Раздел <code translate="no">quotaAndLimits</code> в <code translate="no">milvus.yaml</code> играет важную роль в управлении потоком данных в системе. Он регулирует ограничения скорости для таких операций, как вставка, удаление, сброс и запросы, обеспечивая стабильность кластера при больших нагрузках и предотвращая снижение производительности из-за усиления записи или чрезмерного уплотнения.</p>
<p>Ключевые параметры включают:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Управляет частотой удаления данных из коллекции в Milvus.</p>
<ul>
<li><p><strong>Значение по умолчанию</strong>: <code translate="no">0.1</code>, что означает, что система разрешает одну операцию смыва каждые 10 секунд.</p></li>
<li><p>Операция flush запечатывает растущий сегмент и переносит его из очереди сообщений в объектное хранилище.</p></li>
<li><p>Слишком частая промывка может привести к появлению множества маленьких запечатанных сегментов, что увеличивает накладные расходы на уплотнение и снижает производительность запросов.</p></li>
</ul>
<p>💡 Лучшая практика: В большинстве случаев позвольте Milvus делать это автоматически. Растущий сегмент закрывается, как только он достигает <code translate="no">maxSize * sealProportion</code>, а закрытые сегменты промываются каждые 10 минут. Ручная очистка рекомендуется только после массовых вставок, когда вы знаете, что данные больше не поступят.</p>
<p>Также следует помнить, что <strong>видимость данных</strong> определяется <em>уровнем согласованности</em> запроса, а не временем промывки, поэтому промывка не делает новые данные сразу доступными для запроса.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Эти параметры определяют максимально допустимую скорость операций upsert и delete.</p>
<ul>
<li><p>Milvus использует архитектуру хранения LSM-Tree, что означает, что частые обновления и удаления вызывают уплотнение. Это может быть ресурсоемким и снижать общую пропускную способность, если не управлять этим процессом тщательно.</p></li>
<li><p>Рекомендуется ограничить скорости <code translate="no">upsertRate</code> и <code translate="no">deleteRate</code> на уровне <strong>0,5 МБ/с</strong>, чтобы не перегружать конвейер уплотнения.</p></li>
</ul>
<p>🚀 Нужно быстро обновить большой набор данных? Используйте стратегию псевдонимов коллекций:</p>
<ul>
<li><p>Вставьте новые данные в новую коллекцию.</p></li>
<li><p>После завершения обновления переназначьте псевдоним на новую коллекцию. Это позволяет избежать штрафа за уплотнение при обновлении на месте и обеспечивает мгновенное переключение.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Примеры конфигурации в реальном мире<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте рассмотрим два распространенных сценария развертывания, чтобы проиллюстрировать, как можно настроить параметры конфигурации Milvus в соответствии с различными операционными целями.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ Пример 1: высокопроизводительная конфигурация</h3><p>Когда задержка запросов критически важна - подумайте о рекомендательных системах, платформах семантического поиска или оценке рисков в режиме реального времени - каждая миллисекунда на счету. В таких случаях вы обычно используете индексы на основе графов, такие как <strong>HNSW</strong> или <strong>DISKANN</strong>, и оптимизируете использование памяти и поведение жизненного цикла сегментов.</p>
<p>Ключевые стратегии настройки:</p>
<ul>
<li><p>Увеличьте <code translate="no">dataCoord.segment.maxSize</code> и <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Увеличьте эти значения до 4 или даже 8 ГБ, в зависимости от доступной оперативной памяти. Увеличение размера сегментов позволяет сократить количество построений индексов и повысить пропускную способность запросов за счет минимизации разлета сегментов. Однако большие сегменты потребляют больше памяти во время запросов, поэтому убедитесь, что у экземпляров <code translate="no">indexNode</code> и <code translate="no">queryNode</code> достаточно свободного места.</p></li>
<li><p>Более низкий уровень <code translate="no">dataCoord.segment.sealProportion</code> и <code translate="no">dataCoord.segment.expansionRate</code>: установите размер растущего сегмента около 200 МБ перед уплотнением. Это позволяет сделать использование памяти сегмента предсказуемым и снизить нагрузку на делегатора (лидер узла запроса, координирующий распределенный поиск).</p></li>
</ul>
<p>Правило большого пальца: Отдавайте предпочтение меньшим и большим сегментам, если памяти много, а задержка является приоритетом. Будьте консервативны с пороговыми значениями уплотнений, если важна свежесть индекса.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 Пример 2: Оптимизированная по стоимости конфигурация</h3><p>Если для вас приоритетом является экономическая эффективность, а не сырая производительность, что часто встречается в конвейерах обучения моделей, внутренних инструментах с низким QPS или поиске изображений с длинным хвостом, вы можете отказаться от запоминания или задержки, чтобы значительно снизить требования к инфраструктуре.</p>
<p>Рекомендуемые стратегии:</p>
<ul>
<li><p><strong>Используйте квантование индексов:</strong> Такие типы индексов, как <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code> или <code translate="no">HNSW_PQ/PRQ/SQ</code> (появились в Milvus 2.5), значительно уменьшают размер индекса и занимаемую память. Они идеально подходят для рабочих нагрузок, где точность не так важна, как масштаб или бюджет.</p></li>
<li><p><strong>Примите стратегию индексирования с поддержкой диска:</strong> Установите для типа индекса значение <code translate="no">DISKANN</code>, чтобы обеспечить поиск с опорой на диск. <strong>Включите</strong> <code translate="no">mmap</code> для выборочной разгрузки памяти.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Для экстремальной экономии памяти включите <code translate="no">mmap</code> для следующих вариантов: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code> и <code translate="no">scalarIndex</code>. Это позволяет выгружать большие фрагменты данных в виртуальную память, значительно сокращая использование резидентной оперативной памяти.</p>
<p>⚠️ Предупреждение: Если скалярная фильтрация является основной частью рабочей нагрузки запросов, подумайте об отключении <code translate="no">mmap</code> для <code translate="no">vectorIndex</code> и <code translate="no">scalarIndex</code>. Картирование памяти может снизить производительность скалярных запросов в средах с ограниченным вводом-выводом.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Совет по использованию диска</h4><ul>
<li><p>Индексы HNSW, построенные с помощью <code translate="no">mmap</code>, могут увеличить общий размер данных до <strong>1,8×</strong>.</p></li>
<li><p>Физический диск объемом 100 ГБ может реально вместить только ~50 ГБ эффективных данных, если учесть накладные расходы на индексы и кэширование.</p></li>
<li><p>При работе с <code translate="no">mmap</code> всегда выделяйте дополнительное хранилище, особенно если вы также локально кэшируете исходные векторы.</p></li>
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
    </button></h2><p>Настройка Milvus - это не погоня за идеальными цифрами, а формирование системы в соответствии с реальным поведением вашей рабочей нагрузки. Самые эффективные оптимизации часто приходят от понимания того, как Milvus обрабатывает ввод-вывод, жизненный цикл сегментов и индексирование под давлением. Это те пути, где неправильная конфигурация вредит больше всего - и где продуманная настройка приносит наибольшую отдачу.</p>
<p>Если вы новичок в Milvus, рассмотренные нами параметры конфигурации покроют 80-90 % ваших потребностей в производительности и стабильности. Начните с этого. После того как вы наработаете интуицию, углубитесь в полную спецификацию <code translate="no">milvus.yaml</code> и официальную документацию - вы обнаружите тонкие элементы управления, которые могут превратить ваше развертывание из функционального в исключительное.</p>
<p>При наличии правильных конфигураций вы будете готовы к созданию масштабируемых, высокопроизводительных систем векторного поиска, соответствующих вашим операционным приоритетам - будь то обслуживание с низкой задержкой, экономичное хранение или аналитические нагрузки с высокой точностью.</p>
