---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Inserción y persistencia de datos en una base de datos vectorial
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Conozca el mecanismo de inserción y persistencia de datos en la base de datos
  vectorial Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/sunby">Bingyi Sun</a> y transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>En el post anterior de la serie Deep Dive, hemos presentado <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">cómo se procesan los datos en Milvus</a>, la base de datos vectorial más avanzada del mundo. En este artículo, continuaremos examinando los componentes que intervienen en la inserción de datos, ilustraremos el modelo de datos en detalle y explicaremos cómo se logra la persistencia de datos en Milvus.</p>
<p>Ir a:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Recapitulación de la arquitectura de Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">El portal de solicitudes de inserción de datos</a></li>
<li><a href="#Data-coord-and-data-node">Coordenada de datos y nodo de datos</a></li>
<li><a href="#Root-coord-and-Time-Tick">Coordenada raíz y marca de tiempo</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Organización de datos: colección, partición, fragmento (canal), segmento</a></li>
<li><a href="#Data-allocation-when-and-how">Asignación de datos: cuándo y cómo</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Estructura de archivos Binlog y persistencia de datos</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Recapitulación de la arquitectura Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Arquitectura de Milvus</span>. </span></p>
<p>El SDK envía solicitudes de datos al proxy, el portal, a través del equilibrador de carga. A continuación, el proxy interactúa con el servicio coordinador para escribir solicitudes DDL (lenguaje de definición de datos) y DML (lenguaje de manipulación de datos) en el almacenamiento de mensajes.</p>
<p>Los nodos de trabajo, incluidos el nodo de consulta, el nodo de datos y el nodo de índice, consumen las solicitudes del almacenamiento de mensajes. Más concretamente, el nodo de consulta se encarga de la consulta de datos; el nodo de datos es responsable de la inserción y persistencia de datos; y el nodo de índice se ocupa principalmente de la creación de índices y la aceleración de consultas.</p>
<p>La capa inferior es el almacenamiento de objetos, que aprovecha principalmente MinIO, S3 y AzureBlob para almacenar registros, binlogs delta y archivos de índice.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">El portal de solicitudes de inserción de datos<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy en Milvus</span>. </span></p>
<p>Proxy sirve como portal de solicitudes de inserción de datos.</p>
<ol>
<li>Inicialmente, el proxy acepta solicitudes de inserción de datos de los SDK y asigna esas solicitudes en varios buckets utilizando un algoritmo hash.</li>
<li>A continuación, el proxy solicita al coordinador de datos que asigne segmentos, la unidad más pequeña de Milvus para el almacenamiento de datos.</li>
<li>A continuación, el proxy inserta la información de los segmentos solicitados en el almacén de mensajes para que dicha información no se pierda.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Coordinación de datos y nodo de datos<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>La función principal del coordinador de datos es gestionar la asignación de canales y segmentos, mientras que la función principal del nodo de datos es consumir y persistir los datos insertados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Coordinación de datos y nodo de datos en Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Función</h3><p>La función de la coordinación de datos es la siguiente</p>
<ul>
<li><p><strong>Asignar espacio</strong>en segmentos Data coord asigna espacio en segmentos crecientes al proxy para que éste pueda utilizar el espacio libre en segmentos para insertar datos.</p></li>
<li><p><strong>Registrar la asignación de segmento y el</strong>tiempo de expiración<strong>del espacio asignado en el</strong>segmento El espacio dentro de cada segmento asignado por el data coord no es permanente, por lo tanto, el data coord también necesita mantener un registro del tiempo de expiración de cada asignación de segmento.</p></li>
<li><p><strong>Descarga automática</strong>de datos del segmento Si el segmento está lleno, el coordinador de datos activa automáticamente la descarga de datos.</p></li>
<li><p><strong>Asignación de canales a nodos de datos</strong>Una colección puede tener varios <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canales variables</a>. El coordenador de datos determina qué vcanales son consumidos por qué nodos de datos.</p></li>
</ul>
<p>El nodo de datos sirve en los siguientes aspectos:</p>
<ul>
<li><p>Consumir<strong>datos</strong>El nodo de datos consume datos de los canales asignados por data coord y crea una secuencia para los datos.</p></li>
<li><p><strong>Persistencia de</strong>datos Almacena en caché los datos insertados en la memoria y los vuelca automáticamente en el disco cuando el volumen de datos alcanza un determinado umbral.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Flujo de trabajo</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Un vchannel sólo puede ser asignado a un nodo de datos</span>. </span></p>
<p>Como se muestra en la imagen anterior, la colección tiene cuatro vcanales (V1, V2, V3 y V4) y hay dos nodos de datos. Es muy probable que la coordenada de datos asigne un nodo de datos para consumir datos de V1 y V2, y el otro nodo de datos de V3 y V4. No se puede asignar un mismo vchannel a varios nodos de datos y esto es para evitar la repetición del consumo de datos, que de lo contrario provocaría que el mismo lote de datos se insertara en el mismo segmento repetidamente.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Root coord y Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>Root coord gestiona TSO (timestamp Oracle) y publica mensajes de marca de tiempo a nivel global. Cada solicitud de inserción de datos tiene una marca de tiempo asignada por root coord. Time Tick es la piedra angular de Milvus que actúa como un reloj en Milvus y significa en qué punto del tiempo se encuentra el sistema Milvus.</p>
<p>Cuando se escriben datos en Milvus, cada solicitud de inserción de datos lleva una marca de tiempo. Durante el consumo de datos, cada nodo de datos de tiempo consume datos cuyas marcas de tiempo están dentro de un rango determinado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Ejemplo de inserción y consumo de datos basado en la marca de tiempo</span>. </span></p>
<p>La imagen anterior muestra el proceso de inserción de datos. El valor de las marcas de tiempo está representado por los números 1,2,6,5,7,8. Los datos se escriben en el sistema mediante dos proxies: p1 y p2. Durante el consumo de datos, si la hora actual de la marca de tiempo es 5, los nodos de datos sólo pueden leer los datos 1 y 2. Luego, durante la segunda lectura, si el tiempo actual del Time Tick es 9, los datos 6,7,8 pueden ser leídos por el nodo de datos.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Organización de datos: colección, partición, shard (canal), segmento<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Organización de datos en Milvus</span>. </span></p>
<p>Lea este <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">artículo</a> primero para entender el modelo de datos en Milvus y los conceptos de colección, fragmento, partición y segmento.</p>
<p>En resumen, la unidad de datos más grande en Milvus es una colección que puede compararse a una tabla en una base de datos relacional. Una colección puede tener múltiples fragmentos (cada uno correspondiente a un canal) y múltiples particiones dentro de cada fragmento. Como se muestra en la ilustración anterior, los canales (shards) son las barras verticales, mientras que las particiones son las horizontales. En cada intersección se encuentra el concepto de segmento, la unidad más pequeña para la asignación de datos. En Milvus, los índices se construyen sobre segmentos. Durante una consulta, el sistema Milvus también equilibra las cargas de consulta en diferentes nodos de consulta y este proceso se lleva a cabo basándose en la unidad de segmentos. Los segmentos contienen varios <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlogs</a>, y cuando se consumen los datos del segmento, se genera un archivo binlog.</p>
<h3 id="Segment" class="common-anchor-header">Segmento</h3><p>Existen tres tipos de segmentos con diferentes estados en Milvus: segmento creciente, segmento sellado y segmento vaciado.</p>
<h4 id="Growing-segment" class="common-anchor-header">Segmento creciente</h4><p>Un segmento creciente es un segmento recién creado que puede asignarse al proxy para la inserción de datos. El espacio interno de un segmento puede ser utilizado, asignado o libre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Hay tres estados en un segmento en crecimiento</span> </span></p>
<ul>
<li>Utilizado: esta parte del espacio de un segmento en crecimiento ha sido consumida por el nodo de datos.</li>
<li>Asignado: esta parte del espacio de un segmento en crecimiento ha sido solicitada por el proxy y asignada por el nodo de datos. El espacio asignado caducará al cabo de cierto tiempo.</li>
<li>Libre: esta parte del espacio de un segmento en crecimiento no se ha utilizado. El valor del espacio libre es igual al espacio total del segmento restado por el valor del espacio utilizado y asignado. Por lo tanto, el espacio libre de un segmento aumenta a medida que el espacio asignado caduca.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Segmento sellado</h4><p>Un segmento sellado es un segmento cerrado que ya no puede ser asignado al proxy para la inserción de datos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento sellado en Milvus</span> </span></p>
<p>Un segmento en crecimiento se sella en las siguientes circunstancias:</p>
<ul>
<li>Si el espacio utilizado en un segmento en crecimiento alcanza el 75% del espacio total, el segmento se sellará.</li>
<li>Flush() es llamada manualmente por un usuario de Milvus para persistir todos los datos en una colección.</li>
<li>Los segmentos crecientes que no se sellen después de un largo período de tiempo se sellarán, ya que demasiados segmentos crecientes hacen que los nodos de datos consuman demasiada memoria.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Segmento vaciado</h4><p>Un segmento vaciado es un segmento que ya se ha escrito en el disco. Flush se refiere a almacenar los datos del segmento en el almacenamiento de objetos para la persistencia de los datos. Un segmento sólo puede ser vaciado cuando expira el espacio asignado en un segmento sellado. Cuando se descarga, el segmento sellado se convierte en un segmento descargado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento vaciado en Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Canal</h3><p>Un canal se asigna :</p>
<ul>
<li>Cuando el nodo de datos se inicia o se cierra; o</li>
<li>Cuando el espacio del segmento asignado es solicitado por el proxy.</li>
</ul>
<p>Existen varias estrategias de asignación de canales. Milvus soporta 2 de las estrategias:</p>
<ol>
<li>Hashing consistente</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Hashing consistente en Milvus</span> </span></p>
<p>La estrategia por defecto en Milvus. Esta estrategia aprovecha la técnica hashing para asignar a cada canal una posición en el anillo, y luego busca en el sentido de las agujas del reloj para encontrar el nodo de datos más cercano a un canal. Así, en la ilustración anterior, el canal 1 se asigna al nodo de datos 2, mientras que el canal 2 se asigna al nodo de datos 3.</p>
<p>Sin embargo, uno de los problemas de esta estrategia es que el aumento o la disminución del número de nodos de datos (por ejemplo, el inicio de un nuevo nodo de datos o el cierre repentino de un nodo de datos) puede afectar al proceso de asignación de canales. Para resolver este problema, data coord supervisa el estado de los nodos de datos a través de etcd, de modo que data coord pueda ser notificado inmediatamente si se produce algún cambio en el estado de los nodos de datos. A continuación, el coordinador de datos determina a qué nodo de datos asignar los canales correctamente.</p>
<ol start="2">
<li>Equilibrio de la carga</li>
</ol>
<p>La segunda estrategia consiste en asignar canales de la misma colección a diferentes nodos de datos, garantizando que los canales se asignen de forma equitativa. El objetivo de esta estrategia es lograr el equilibrio de carga.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Asignación de datos: cuándo y cómo<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>El proceso de asignación de datos en Milvus</span> </span></p>
<p>El proceso de asignación de datos parte del cliente. Primero envía solicitudes de inserción de datos con una marca de tiempo <code translate="no">t1</code> al proxy. A continuación, el proxy envía una solicitud de asignación de segmentos al coordinador de datos.</p>
<p>Al recibir la solicitud de asignación de segmento, el coordinador de datos comprueba el estado del segmento y lo asigna. Si el espacio actual de los segmentos creados es suficiente para las nuevas filas de datos insertadas, el coordinador de datos asigna los segmentos creados. Sin embargo, si el espacio disponible en los segmentos actuales no es suficiente, el coordenador de datos asignará un nuevo segmento. El coordinador de datos puede devolver uno o más segmentos en cada solicitud. Mientras tanto, el coordinador de datos también guarda el segmento asignado en el metiservidor para la persistencia de los datos.</p>
<p>Posteriormente, el coordinador de datos devuelve la información del segmento asignado (incluido el ID del segmento, el número de filas, el tiempo de expiración <code translate="no">t2</code>, etc.) al proxy. El proxy envía dicha información del segmento asignado al almacén de mensajes para que dicha información quede debidamente registrada. Tenga en cuenta que el valor de <code translate="no">t1</code> debe ser menor que el de <code translate="no">t2</code>. El valor por defecto de <code translate="no">t2</code> es de 2.000 milisegundos y puede cambiarse configurando el parámetro <code translate="no">segment.assignmentExpiration</code> en el archivo <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Estructura del archivo Binlog y persistencia de datos<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Descarga del nodo de datos</span> </span></p>
<p>El nodo de datos se suscribe al almacén de mensajes porque las solicitudes de inserción de datos se guardan en el almacén de mensajes y los nodos de datos pueden así consumir mensajes de inserción. Los nodos de datos colocan primero las solicitudes de inserción en un búfer de inserción y, a medida que las solicitudes se acumulan, se vaciarán en el almacenamiento de objetos tras alcanzar un umbral.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Estructura del archivo Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Estructura del archivo binlog</span>. </span></p>
<p>La estructura del archivo binlog en Milvus es similar a la de MySQL. Binlog se utiliza para dos funciones: recuperación de datos y creación de índices.</p>
<p>Un binlog contiene muchos <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">eventos</a>. Cada evento tiene un encabezado y datos de evento.</p>
<p>Los metadatos, como la hora de creación del binlog, el ID del nodo de escritura, la longitud del evento y NextPosition (desplazamiento del siguiente evento), etc., se escriben en la cabecera del evento.</p>
<p>Los datos del evento pueden dividirse en dos partes: fijos y variables.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Estructura del archivo de un evento de inserción</span>. </span></p>
<p>La parte fija en los datos de evento de un <code translate="no">INSERT_EVENT</code> contiene <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code>, y <code translate="no">reserved</code>.</p>
<p>La parte variable, de hecho, almacena los datos insertados. Los datos de inserción se secuencian en el formato de parquet y se almacenan en este archivo.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistencia de los datos</h3><p>Si hay varias columnas en el esquema, Milvus almacenará los binlogs en columnas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistencia de datos binlog</span>. </span></p>
<p>Como se ilustra en la imagen anterior, la primera columna es binlog clave primaria. La segunda es la columna timestamp. El resto son las columnas definidas en el esquema. La ruta del archivo de binlogs en MinIO también se indica en la imagen anterior.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, hemos organizado esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
