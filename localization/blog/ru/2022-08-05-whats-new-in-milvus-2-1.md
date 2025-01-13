---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Что нового в Milvus 2.1 - На пути к простоте и скорости
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, база данных векторов с открытым исходным кодом, теперь имеет улучшения
  в производительности и удобстве, которых давно ожидали пользователи.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Что нового в Milvus 2.1 - в сторону простоты и скорости</span> </span></p>
<p>Мы очень рады объявить о<a href="https://milvus.io/docs/v2.1.x/release_notes.md">выходе версии</a> Milvus 2.1 после шести месяцев напряженной работы всех участников сообщества Milvus. Эта крупная итерация популярной векторной базы данных подчеркивает <strong>производительность</strong> и <strong>удобство использования</strong>, два наиболее важных ключевых слова нашего фокуса. Мы добавили поддержку строк, очереди сообщений Kafka и встроенного Milvus, а также ряд улучшений в области производительности, масштабируемости, безопасности и наблюдаемости. Milvus 2.1 - это потрясающее обновление, которое позволит преодолеть "последнюю милю" от ноутбука инженера-алгоритмиста до сервисов поиска векторного сходства на производственном уровне.</p>
<custom-h1>Производительность - более чем 3,2-кратное увеличение</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Задержка на уровне 5 мс<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus уже поддерживает приближенный поиск ближайших соседей (ANN), что является существенным скачком по сравнению с традиционным методом KNN. Однако проблемы пропускной способности и задержки по-прежнему стоят перед пользователями, которым приходится иметь дело со сценариями поиска векторных данных миллиардного масштаба.</p>
<p>В Milvus 2.1 появился новый протокол маршрутизации, который больше не полагается на очереди сообщений в канале поиска, что значительно сокращает время поиска для небольших наборов данных. Результаты наших тестов показывают, что теперь Milvus снижает уровень задержки до 5 мс, что соответствует требованиям критически важных онлайн-соединений, таких как поиск по сходству и рекомендации.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Контроль параллелизма<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.1 усовершенствована модель управления параллелизмом за счет внедрения новой модели оценки затрат и планировщика параллелизма. Теперь он обеспечивает контроль параллелизма, что гарантирует отсутствие большого количества одновременных запросов, конкурирующих за ресурсы процессора и кэша, а также недоиспользование процессора из-за недостаточного количества запросов. Новый интеллектуальный уровень планировщика в Milvus 2.1 также объединяет запросы с малым количеством запросов, которые имеют согласованные параметры запроса, обеспечивая удивительный прирост производительности в 3,2 раза в сценариях с малым количеством запросов и высоким параллелизмом запросов.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Реплики в памяти<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.1 появились реплики in-memory, которые улучшают масштабируемость и доступность для небольших наборов данных. Подобно репликам только для чтения в традиционных базах данных, реплики in-memory могут масштабироваться горизонтально путем добавления машин, когда QPS чтения высок. При векторном поиске по небольшим наборам данных рекомендательной системе часто требуется обеспечить QPS, превышающий предел производительности одной машины. В таких сценариях пропускная способность системы может быть значительно повышена за счет загрузки нескольких реплик в память. В будущем мы также внедрим механизм хеджированного чтения на основе реплик in-memory, который будет быстро запрашивать другие функциональные копии в случае необходимости восстановления системы после сбоев и будет полностью использовать избыточность памяти для повышения общей доступности системы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>Реплики in-memory позволяют сервисам запросов основываться на отдельных копиях одних и тех же данных</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Ускоренная загрузка данных<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Последний прирост производительности связан с загрузкой данных. Milvus 2.1 теперь сжимает <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">двоичные журналы</a> с помощью Zstandard (zstd), что значительно уменьшает размер данных в хранилищах объектов и сообщений, а также сетевые накладные расходы при загрузке данных. Кроме того, теперь внедрены пулы хороутинов, благодаря чему Milvus может загружать сегменты одновременно с контролируемым объемом памяти и минимизировать время, необходимое для восстановления после сбоев и загрузки данных.</p>
<p>Полные результаты бенчмарка Milvus 2.1 будут опубликованы на нашем сайте в ближайшее время. Следите за новостями.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Поддержка строковых и скалярных индексов<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>В версии 2.1 Milvus теперь поддерживает строку переменной длины (VARCHAR) в качестве скалярного типа данных. VARCHAR может использоваться в качестве первичного ключа, который возвращается при выводе, а также может выступать в качестве фильтра атрибутов. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">Фильтрация атрибутов</a> - одна из самых популярных функций, необходимых пользователям Milvus. Если вы часто сталкиваетесь с необходимостью &quot;найти наиболее похожие на пользователя товары в ценовом диапазоне <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot; или &quot;найти статьи, содержащие ключевое слово &quot;векторная база данных&quot; и относящиеся к облачно-нативной тематике&quot;, вам понравится Milvus 2.1.</p>
<p>Milvus 2.1 также поддерживает скалярный инвертированный индекс для повышения скорости фильтрации на основе<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">лаконичных</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> в качестве структуры данных. Теперь все данные могут быть загружены в память с очень малой занимаемой площадью, что позволяет значительно ускорить сравнение, фильтрацию и сопоставление префиксов в строках. Результаты наших тестов показывают, что для загрузки всех данных в память и обеспечения возможности запросов MARISA-trie требуется всего 10 % памяти по сравнению со словарями Python.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>В Milvus 2.1 MARISA-Trie сочетается с инвертированным индексом, что значительно повышает скорость фильтрации.</span> </span></p>
<p>В будущем Milvus продолжит фокусироваться на разработках, связанных со скалярными запросами, поддерживать больше типов скалярных индексов и операторов запросов, а также предоставлять возможности скалярных запросов с использованием диска - все это является частью постоянных усилий по снижению стоимости хранения и использования скалярных данных.</p>
<custom-h1>Улучшения удобства использования</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Поддержка Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Наше сообщество давно просило поддержать <a href="https://kafka.apache.org">Apache Kafka</a> в качестве <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">хранилища сообщений</a> в Milvus. Теперь Milvus 2.1 предлагает вам возможность использовать<a href="https://pulsar.apache.org">Pulsar</a> или Kafka в качестве хранилища сообщений в зависимости от пользовательских конфигураций, благодаря абстракции и инкапсуляции Milvus и Go Kafka SDK, предоставленному компанией Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">Готовый к производству Java SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Вместе с Milvus 2.1 официально выпущен наш <a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a>. Java SDK обладает теми же возможностями, что и Python SDK, с еще более высокой производительностью параллелизма. На следующем этапе наши участники сообщества будут постепенно улучшать документацию и примеры использования Java SDK, а также помогут продвинуть Go и RESTful SDK до стадии готовности к производству.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Наблюдаемость и сопровождаемость<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.1 добавлены важные<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">метрики</a> мониторинга, такие как количество вставленных векторов, задержка/пропускная способность поиска, затраты памяти узла и затраты процессора. Кроме того, в новой версии значительно оптимизировано ведение журналов за счет настройки уровней журналов и сокращения бесполезной печати журналов.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Встраиваемый Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus значительно упростил развертывание крупномасштабных сервисов поиска массивных векторных данных, но для ученых, которые хотят проверить алгоритмы в меньших масштабах, Docker или K8s все еще слишком неоправданно сложны. С появлением <a href="https://github.com/milvus-io/embd-milvus">встроенного Milvus</a> вы можете установить Milvus с помощью pip, как и Pyrocksb и Pysqlite. Встроенный Milvus поддерживает все функциональные возможности как кластерной, так и автономной версии, позволяя вам легко переключиться с ноутбука на распределенную производственную среду, не меняя ни строчки кода. Инженеры-алгоритмисты получат гораздо больше удовольствия при создании прототипа с помощью Milvus.</p>
<custom-h1>Попробуйте готовый векторный поиск прямо сейчас</custom-h1><p>Более того, в Milvus 2.1 также есть несколько значительных улучшений в стабильности и масштабируемости, и мы с нетерпением ждем ваших отзывов и комментариев.</p>
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
    </button></h2><ul>
<li>Все изменения в Milvus 2.1 описаны в подробной <a href="https://milvus.io/docs/v2.1.x/release_notes.md">информации о выпуске</a>.</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Установите</a>Milvus 2.1 и попробуйте новые возможности</li>
<li>Присоединяйтесь к нашему <a href="https://slack.milvus.io/">Slack-сообществу</a> и обсуждайте новые функции с тысячами пользователей Milvus по всему миру.</li>
<li>Следите за нами в <a href="https://twitter.com/milvusio">Twitter</a> и<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>, чтобы получать обновления после выхода наших блогов о конкретных новых функциях.</li>
</ul>
<blockquote>
<p>Отредактировано <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
