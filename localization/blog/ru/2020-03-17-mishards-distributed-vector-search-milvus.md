---
id: mishards-distributed-vector-search-milvus.md
title: Обзор распределенной архитектуры
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Как уменьшить масштаб
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - распределенный векторный поиск в Milvus</custom-h1><p>Milvus нацелен на эффективный поиск и аналитику сходства для векторов огромного размера. Автономный экземпляр Milvus может легко справиться с векторным поиском для векторов миллиардного масштаба. Однако для 10, 100 и даже более миллиардных наборов данных необходим кластер Milvus. Кластер может использоваться как отдельный экземпляр для приложений верхнего уровня и удовлетворять бизнес-потребности в низких задержках и высоком параллелизме при работе с массивными данными. Кластер Milvus может повторно отправлять запросы, отделять чтение от записи, горизонтально масштабироваться и динамически расширяться, обеспечивая тем самым неограниченное расширение экземпляра Milvus. Mishards - это распределенное решение для Milvus.</p>
<p>В этой статье мы кратко представим компоненты архитектуры Mishards. Более подробная информация будет представлена в следующих статьях.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Обзор распределенной архитектуры<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-distributed-architecture-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Трассировка сервисов<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Основные компоненты сервисов<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Фреймворк обнаружения сервисов, такой как ZooKeeper, etcd и Consul.</li>
<li>Балансировщик нагрузки, например Nginx, HAProxy, Ingress Controller.</li>
<li>Узел Mishards: нестационарный, масштабируемый.</li>
<li>Узел Milvus, доступный только для записи: единственный узел и не масштабируется. Для этого узла необходимо использовать решения высокой доступности, чтобы избежать единой точки отказа.</li>
<li>Узел Milvus только для чтения: узел с состоянием и масштабируемый.</li>
<li>Служба общего хранилища: Все узлы Milvus используют общую службу хранения для обмена данными, например NAS или NFS.</li>
<li>Служба метаданных: Все узлы Milvus используют этот сервис для обмена метаданными. В настоящее время поддерживается только MySQL. Для работы этой службы требуется решение MySQL с высокой доступностью.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Масштабируемые компоненты<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Mishards</li>
<li>Узлы Milvus только для чтения</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Представление компонентов<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Узлы Mishards</strong></p>
<p>Mishards отвечает за разбиение запросов на части и маршрутизацию подзапросов к подсервисам. Результаты суммируются для возвращения в восходящий поток.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>Как показано на диаграмме выше, после приема запроса на поиск TopK Mishards сначала разбивает запрос на подзапросы и отправляет подзапросы в нижестоящий сервис. Когда все подзапросы будут собраны, они объединяются и возвращаются в верхний поток.</p>
<p>Поскольку Mishards - это сервис без статических данных, он не сохраняет данные и не участвует в сложных вычислениях. Таким образом, узлы не предъявляют высоких требований к конфигурации, а вычислительная мощность используется в основном для объединения подрезультатов. Таким образом, можно увеличить количество узлов Mishards для обеспечения высокого параллелизма.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Узлы Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Узлы Milvus отвечают за основные операции, связанные с CRUD, поэтому у них относительно высокие требования к конфигурации. Во-первых, объем памяти должен быть достаточно большим, чтобы избежать слишком большого количества операций дискового ввода-вывода. Во-вторых, конфигурация процессора также может влиять на производительность. При увеличении размера кластера требуется больше узлов Milvus для повышения пропускной способности системы.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Узлы, доступные только для чтения, и узлы, доступные для записи</h3><ul>
<li>Основными операциями Milvus являются вставка и поиск векторов. Поиск предъявляет чрезвычайно высокие требования к конфигурациям CPU и GPU, в то время как вставка и другие операции имеют относительно низкие требования. Отделение узла, выполняющего поиск, от узла, выполняющего другие операции, приводит к более экономичному развертыванию.</li>
<li>С точки зрения качества обслуживания, когда узел выполняет операции поиска, соответствующее оборудование работает с полной нагрузкой и не может обеспечить качество обслуживания других операций. Поэтому используются два типа узлов. Поисковые запросы обрабатываются узлами, доступными только для чтения, а другие запросы - узлами, доступными для записи.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Допускается только один узел с возможностью записи.</h3><ul>
<li><p>В настоящее время Milvus не поддерживает совместное использование данных для нескольких экземпляров с возможностью записи.</p></li>
<li><p>При развертывании необходимо учитывать возможность отказа одной точки записи. Для узлов с возможностью записи необходимо подготовить решения высокой доступности.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Масштабируемость узлов только для чтения</h3><p>Если объем данных очень велик или требования к задержкам чрезвычайно высоки, можно горизонтально масштабировать узлы только для чтения как узлы с состоянием. Предположим, что имеется 4 узла, и каждый из них имеет следующую конфигурацию: Ядра CPU: 16, GPU: 1, память: 64 ГБ. На следующей диаграмме показан кластер при горизонтальном масштабировании stateful-узлов. Вычислительная мощность и память масштабируются линейно. Данные разбиты на 8 шардов, каждый узел обрабатывает запросы из 2 шардов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>Когда количество запросов для некоторых шардов велико, для этих шардов можно развернуть узлы без права чтения, чтобы увеличить пропускную способность. Возьмем в качестве примера узлы выше. Когда узлы объединяются в бессерверный кластер, вычислительная мощность увеличивается линейно. Поскольку объем обрабатываемых данных не увеличивается, вычислительная мощность для одного и того же осколка данных также увеличивается линейно.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Служба метаданных</h3><p>Ключевые слова: MySQL</p>
<p>Дополнительные сведения о метаданных Milvus см. в разделе Как просматривать метаданные. В распределенной системе узлы Milvus с возможностью записи являются единственным производителем метаданных. Узлы Mishards, узлы Milvus с возможностью записи и узлы Milvus только для чтения являются потребителями метаданных. В настоящее время Milvus поддерживает только MySQL и SQLite в качестве бэкенда для хранения метаданных. В распределенной системе сервис может быть развернут только как высокодоступный MySQL.</p>
<h3 id="Service-discovery" class="common-anchor-header">Обнаружение сервиса</h3><p>Ключевые слова: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-service-discovery.png</span> </span></p>
<p>Сервис discovery предоставляет информацию обо всех узлах Milvus. Узлы Milvus регистрируют свою информацию, когда выходят в сеть, и выходят из системы, когда переходят в автономный режим. Узлы Milvus также могут обнаруживать аномальные узлы, периодически проверяя состояние здоровья сервисов.</p>
<p>Для обнаружения сервисов существует множество фреймворков, включая etcd, Consul, ZooKeeper и т. д. Mishards определяет интерфейсы обнаружения сервисов и предоставляет возможности для масштабирования с помощью плагинов. В настоящее время Mishards предоставляет два вида плагинов, которые соответствуют кластеру Kubernetes и статическим конфигурациям. Вы можете настроить собственное обнаружение сервисов, следуя реализации этих плагинов. Интерфейсы являются временными и нуждаются в переработке. Подробнее о написании собственного плагина будет рассказано в следующих статьях.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Балансировка нагрузки и шардинг сервисов</h3><p>Ключевые слова: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>Обнаружение сервисов и балансировка нагрузки используются вместе. Балансировка нагрузки может быть настроена как опрос, хеширование или последовательное хеширование.</p>
<p>Балансировщик нагрузки отвечает за повторную отправку пользовательских запросов на узел Mishards.</p>
<p>Каждый узел Mishards получает информацию обо всех нижележащих узлах Milvus через центр обнаружения сервисов. Все связанные с ними метаданные могут быть получены с помощью сервиса метаданных. Mishards реализует шардинг, потребляя эти ресурсы. Mishards определяет интерфейсы, связанные со стратегиями маршрутизации, и предоставляет расширения с помощью плагинов. В настоящее время Mishards обеспечивает последовательную стратегию хеширования, основанную на самом низком уровне сегмента. Как показано на диаграмме, имеется 10 сегментов, от s1 до s10. Согласно стратегии последовательного хеширования на основе сегментов, Mishards направляет запросы, касающиеся s1, 24, s6 и s9, на узел Milvus 1, s2, s3, s5 - на узел Milvus 2, а s7, s8, s10 - на узел Milvus 3.</p>
<p>Исходя из потребностей вашего бизнеса, вы можете настроить маршрутизацию, следуя плагину последовательной хэшированной маршрутизации по умолчанию.</p>
<h3 id="Tracing" class="common-anchor-header">Трассировка</h3><p>Ключевые слова: OpenTracing, Jaeger, Zipkin</p>
<p>Учитывая сложность распределенной системы, запросы отправляются на множество внутренних вызовов сервисов. Чтобы выявить проблемы, необходимо отследить цепочку вызовов внутренних сервисов. По мере увеличения сложности преимущества доступной системы трассировки становятся очевидны. Мы выбрали стандарт CNCF OpenTracing. OpenTracing предоставляет платформенно-независимые и независимые от производителя API, позволяющие разработчикам удобно реализовать систему трассировки.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>Предыдущая диаграмма - пример трассировки во время вызова поиска. Поиск последовательно вызывает <code translate="no">get_routing</code>, <code translate="no">do_search</code> и <code translate="no">do_merge</code>. <code translate="no">do_search</code> также вызывает <code translate="no">search_127.0.0.1</code>.</p>
<p>Вся запись трассировки образует следующее дерево:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>На следующей диаграмме показаны примеры информации о запросе/ответе и тегов каждого узла:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing был интегрирован в Milvus. Более подробная информация будет представлена в ближайших статьях.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Мониторинг и оповещение</h3><p>Ключевые слова: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>В качестве промежуточного ПО для сервисов Mishards объединяет обнаружение сервисов, маршрутизацию запросов, объединение результатов и трассировку. Также предусмотрено расширение на основе плагинов. В настоящее время распределенные решения на базе Mishards все еще имеют следующие недостатки:</p>
<ul>
<li>Mishards использует прокси в качестве промежуточного слоя и имеет издержки на задержку.</li>
<li>Записываемые узлы Milvus являются одноточечными сервисами.</li>
<li>Зависимость от высокодоступного сервиса MySQL. -Сложность развертывания при наличии нескольких шардов и нескольких копий одного шарда.</li>
<li>Отсутствует уровень кэширования, например, доступ к метаданным.</li>
</ul>
<p>Мы исправим эти проблемы в следующих версиях, чтобы Mishards было удобнее применять в производственной среде.</p>
