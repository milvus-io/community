---
id: mishards-distributed-vector-search-milvus.md
title: Visión general de la arquitectura distribuida
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Cómo ampliar
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Búsqueda vectorial distribuida en Milvus</custom-h1><p>El objetivo de Milvus es lograr una búsqueda de similitudes y un análisis eficientes para vectores a gran escala. Una instancia independiente de Milvus puede gestionar fácilmente la búsqueda de vectores a escala de miles de millones de vectores. Sin embargo, para conjuntos de datos de 10.000 millones, 100.000 millones o incluso mayores, se necesita un clúster Milvus. El clúster puede utilizarse como instancia independiente para aplicaciones de nivel superior y puede satisfacer las necesidades empresariales de baja latencia y alta concurrencia para datos a escala masiva. Un clúster Milvus puede reenviar solicitudes, separar la lectura de la escritura, escalar horizontalmente y expandirse dinámicamente, proporcionando así una instancia Milvus que puede expandirse sin límites. Mishards es una solución distribuida para Milvus.</p>
<p>Este artículo presentará brevemente los componentes de la arquitectura de Mishards. En los próximos artículos se presentará información más detallada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Visión general de la arquitectura distribuida<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
<h2 id="Service-tracing" class="common-anchor-header">Rastreo de servicios<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
   </span> <span class="img-wrapper"> <span>3-servicio-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Componentes principales del servicio<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Marco de descubrimiento de servicios, como ZooKeeper, etcd y Consul.</li>
<li>Equilibrador de carga, como Nginx, HAProxy, Ingress Controller.</li>
<li>Nodo Mishards: sin estado, escalable.</li>
<li>Nodo Milvus de sólo escritura: nodo único y no escalable. Es necesario utilizar soluciones de alta disponibilidad para este nodo para evitar un único punto de fallo.</li>
<li>Nodo Milvus de sólo lectura: Nodo con estado y escalable.</li>
<li>Servicio de almacenamiento compartido: Todos los nodos Milvus utilizan un servicio de almacenamiento compartido para compartir datos, como NAS o NFS.</li>
<li>Servicio de metadatos: Todos los nodos Milvus utilizan este servicio para compartir metadatos. Actualmente, sólo es compatible con MySQL. Este servicio requiere una solución MySQL de alta disponibilidad.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Componentes escalables<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Nodos Milvus de sólo lectura</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Introducción de componentes<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Nodos Mishards</strong></p>
<p>Mishards se encarga de dividir las peticiones del flujo ascendente y enrutar las subpeticiones a los subservicios. Los resultados se resumen para devolverlos al flujo ascendente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-nodos-mishards.jpg</span> </span></p>
<p>Como se indica en el gráfico anterior, tras aceptar una solicitud de búsqueda TopK, Mishards primero divide la solicitud en sub-solicitudes y envía las sub-solicitudes al servicio descendente. Cuando se recogen todas las subrespuestas, éstas se fusionan y se devuelven al servicio ascendente.</p>
<p>Como Mishards es un servicio sin estado, no guarda datos ni participa en cálculos complejos. Así, los nodos no tienen grandes requisitos de configuración y la potencia de cálculo se utiliza principalmente en la fusión de subrespuestas. Por lo tanto, es posible aumentar el número de nodos Mishards para una alta concurrencia.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Nodos Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Los nodos Milvus son responsables de las operaciones centrales relacionadas con CRUD, por lo que tienen unos requisitos de configuración relativamente altos. En primer lugar, el tamaño de la memoria debe ser lo suficientemente grande como para evitar demasiadas operaciones de IO de disco. En segundo lugar, la configuración de la CPU también puede afectar al rendimiento. A medida que aumenta el tamaño del clúster, se necesitan más nodos Milvus para aumentar el rendimiento del sistema.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Nodos de sólo lectura y nodos de escritura</h3><ul>
<li>Las operaciones principales de Milvus son la inserción y la búsqueda de vectores. La búsqueda tiene requisitos extremadamente altos en las configuraciones de CPU y GPU, mientras que la inserción u otras operaciones tienen requisitos relativamente bajos. Separar el nodo que ejecuta la búsqueda del nodo que ejecuta otras operaciones permite un despliegue más económico.</li>
<li>En términos de calidad de servicio, cuando un nodo realiza operaciones de búsqueda, el hardware relacionado funciona a plena carga y no puede garantizar la calidad de servicio de otras operaciones. Por lo tanto, se utilizan dos tipos de nodos. Las solicitudes de búsqueda son procesadas por nodos de sólo lectura y las demás solicitudes son procesadas por nodos con capacidad de escritura.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Sólo se permite un nodo de escritura</h3><ul>
<li><p>Actualmente, Milvus no soporta compartir datos para múltiples instancias con capacidad de escritura.</p></li>
<li><p>Durante el despliegue, debe tenerse en cuenta un único punto de fallo de los nodos con capacidad de escritura. Es necesario preparar soluciones de alta disponibilidad para los nodos con capacidad de escritura.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Escalabilidad de los nodos de sólo lectura</h3><p>Cuando el tamaño de los datos es extremadamente grande, o el requisito de latencia es extremadamente alto, puede escalar horizontalmente los nodos de sólo lectura como nodos con estado. Supongamos que hay 4 hosts y cada uno tiene la siguiente configuración: Núcleos CPU: 16, GPU: 1, Memoria: 64 GB. El siguiente gráfico muestra el cluster cuando se escalan horizontalmente los nodos stateful. Tanto la potencia de cálculo como la memoria escalan linealmente. Los datos se dividen en 8 fragmentos y cada nodo procesa solicitudes de 2 fragmentos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-nodo-de-solo-lectura-escalabilidad-milvus.png</span> </span></p>
<p>Cuando el número de peticiones es grande para algunos fragmentos, pueden desplegarse nodos de sólo lectura sin estado para estos fragmentos con el fin de aumentar el rendimiento. Cuando los hosts se combinan en un clúster sin servidor, la potencia de cálculo aumenta linealmente. Dado que los datos a procesar no aumentan, la potencia de procesamiento para el mismo fragmento de datos también aumenta linealmente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-nodo-de-solo-lectura-escalabilidad-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Servicio de metadatos</h3><p>Palabras clave MySQL</p>
<p>Para más información sobre los metadatos de Milvus, consulte Cómo ver metadatos. En un sistema distribuido, los nodos Milvus con capacidad de escritura son los únicos productores de metadatos. Los nodos Mishards, los nodos Milvus con capacidad de escritura y los nodos Milvus de sólo lectura son todos consumidores de metadatos. Actualmente, Milvus sólo admite MySQL y SQLite como backend de almacenamiento de metadatos. En un sistema distribuido, el servicio sólo puede desplegarse como MySQL de alta disponibilidad.</p>
<h3 id="Service-discovery" class="common-anchor-header">Descubrimiento del servicio</h3><p>Palabras clave: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-descubrimiento-de-servicios.png</span> </span></p>
<p>El descubrimiento de servicios proporciona información sobre todos los nodos Milvus. Los nodos Milvus registran su información cuando se conectan y se desconectan cuando se desconectan. Los nodos Milvus también pueden detectar nodos anómalos comprobando periódicamente el estado de salud de los servicios.</p>
<p>El descubrimiento de servicios contiene una gran cantidad de frameworks, incluyendo etcd, Consul, ZooKeeper, etc. Mishards define las interfaces de descubrimiento de servicios y ofrece posibilidades de escalado mediante plugins. Actualmente, Mishards proporciona dos tipos de plugins, que corresponden al clúster Kubernetes y a las configuraciones estáticas. Puedes personalizar tu propio descubrimiento de servicios siguiendo la implementación de estos plugins. Las interfaces son temporales y necesitan un rediseño. En los próximos artículos encontrarás más información sobre cómo escribir tu propio plugin.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Equilibrio de carga y fragmentación de servicios</h3><p>Palabras clave: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-balanceo-de-carga-y-distribución-de-servicios.png</span> </span></p>
<p>El descubrimiento de servicios y el equilibrio de carga se utilizan conjuntamente. El balanceo de carga puede configurarse como polling, hashing o hashing consistente.</p>
<p>El equilibrador de carga se encarga de reenviar las solicitudes de los usuarios al nodo Mishards.</p>
<p>Cada nodo Mishards adquiere la información de todos los nodos Milvus descendentes a través del centro de descubrimiento de servicios. Todos los metadatos relacionados pueden adquirirse mediante el servicio de metadatos. Mishards implementa la fragmentación consumiendo estos recursos. Mishards define las interfaces relacionadas con las estrategias de enrutamiento y proporciona extensiones a través de plugins. Actualmente, Mishards proporciona una estrategia de hashing consistente basada en el nivel de segmento más bajo. Como se muestra en el gráfico, hay 10 segmentos, s1 a s10. Según la estrategia de hashing consistente basada en segmentos, Mishards enruta las peticiones relativas a s1, 24, s6, y s9 al nodo Milvus 1, s2, s3, s5 al nodo Milvus 2, y s7, s8, s10 al nodo Milvus 3.</p>
<p>En función de sus necesidades empresariales, puede personalizar el enrutamiento siguiendo el plugin de enrutamiento hashing consistente predeterminado.</p>
<h3 id="Tracing" class="common-anchor-header">Rastreo</h3><p>Palabras clave: OpenTracing, Jaeger, Zipkin</p>
<p>Dada la complejidad de un sistema distribuido, las peticiones se envían a múltiples invocaciones de servicios internos. Para ayudar a localizar problemas, necesitamos rastrear la cadena de invocación de servicios internos. A medida que aumenta la complejidad, las ventajas de un sistema de rastreo disponible se explican por sí solas. Elegimos el estándar CNCF OpenTracing. OpenTracing proporciona API independientes de la plataforma y del proveedor para que los desarrolladores implementen cómodamente un sistema de rastreo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>El gráfico anterior es un ejemplo de rastreo durante la invocación de una búsqueda. La búsqueda invoca <code translate="no">get_routing</code>, <code translate="no">do_search</code>, y <code translate="no">do_merge</code> consecutivamente. <code translate="no">do_search</code> también invoca <code translate="no">search_127.0.0.1</code>.</p>
<p>Todo el registro de rastreo forma el siguiente árbol:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>El siguiente gráfico muestra ejemplos de información de solicitud/respuesta y etiquetas de cada nodo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing se ha integrado en Milvus. Se ofrecerá más información en los próximos artículos.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Monitorización y alertas</h3><p>Palabras clave: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alert-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Como middleware de servicios, Mishards integra descubrimiento de servicios, solicitud de enrutamiento, fusión de resultados y rastreo. También se proporciona expansión basada en plugins. Actualmente, las soluciones distribuidas basadas en Mishards siguen presentando los siguientes inconvenientes:</p>
<ul>
<li>Mishards utiliza proxy como capa intermedia y tiene costes de latencia.</li>
<li>Los nodos de escritura de Milvus son servicios de punto único.</li>
<li>Depende de un servicio MySQL de alta disponibilidad. -El despliegue es complicado cuando hay múltiples shards y un único shard tiene múltiples copias.</li>
<li>Carece de una capa de caché, como el acceso a metadatos.</li>
</ul>
<p>Arreglaremos estos problemas conocidos en las próximas versiones para que Mishards se pueda aplicar al entorno de producción de forma más cómoda.</p>
