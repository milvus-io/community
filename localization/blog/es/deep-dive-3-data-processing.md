---
id: deep-dive-3-data-processing.md
title: ¿Cómo se procesan los datos en una base de datos vectorial?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  Milvus proporciona una infraestructura de gestión de datos esencial para las
  aplicaciones de IA en producción. Este artículo desvela los entresijos del
  procesamiento de datos en su interior.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/czs007">Zhenshan Cao</a> y transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>En las dos entradas anteriores de esta serie de blogs, ya hemos cubierto la <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">arquitectura del sistema</a> de Milvus, la base de datos vectorial más avanzada del mundo, y su <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">SDK y API de Python</a>.</p>
<p>El objetivo principal de esta entrada es ayudarle a comprender cómo se procesan los datos en Milvus, profundizando en el sistema Milvus y examinando la interacción entre los componentes de procesamiento de datos.</p>
<p><em>A continuación se enumeran algunos recursos útiles antes de empezar. Recomendamos leerlos primero para comprender mejor el tema de este post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Profundización en la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modelo de datos Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">El papel y la función de cada componente de Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Procesamiento de datos en Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Interfaz MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">La interfaz Ms</a> gStream es crucial para el procesamiento de datos en Milvus. Cuando se llama a <code translate="no">Start()</code>, la coroutine en segundo plano escribe datos en el <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">log broker</a> o lee datos de allí. Cuando se llama a <code translate="no">Close()</code>, la coroutine se detiene.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Interfaz MsgStream</span> </span></p>
<p>El MsgStream puede servir como productor y consumidor. La interfaz <code translate="no">AsProducer(channels []string)</code> define el MsgStream como productor, mientras que la <code translate="no">AsConsumer(channels []string, subNamestring)</code>lo define como consumidor. El parámetro <code translate="no">channels</code> se comparte en ambas interfaces y se utiliza para definir en qué canales (físicos) se escriben los datos o de cuáles se leen.</p>
<blockquote>
<p>El número de shards de una colección puede especificarse cuando se crea una colección. Cada shard corresponde a un <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canal virtual (vchannel)</a>. Por lo tanto, una colección puede tener múltiples vcanales. Milvus asigna a cada canal virtual del agente de registro un <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">canal físico (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Cada canal virtual/shard corresponde a un canal físico</span>. </span></p>
<p><code translate="no">Produce()</code> en la interfaz MsgStream encargada de escribir datos en los pchannels del log broker. Los datos pueden escribirse de dos maneras:</p>
<ul>
<li>Escritura única: las entidades se escriben en diferentes shards (vchannel) mediante los valores hash de las claves primarias. A continuación, estas entidades fluyen a los pcanales correspondientes en el log broker.</li>
<li>Broadcast write: las entidades se escriben en todos los pchannels especificados por el parámetro <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> es un tipo de API de bloqueo. Si no hay datos disponibles en el pchannel especificado, la coroutine se bloqueará cuando se llame a <code translate="no">Consume()</code> en la interfaz MsgStream. Por otro lado, <code translate="no">Chan()</code> es una API no bloqueante, lo que significa que la coroutina lee y procesa datos sólo si hay datos existentes en el pchannel especificado. En caso contrario, la coroutina puede procesar otras tareas y no se bloqueará cuando no haya datos disponibles.</p>
<p><code translate="no">Seek()</code> es un método de recuperación de fallos. Cuando se inicia un nuevo nodo, se puede obtener el registro de consumo de datos y reanudar el consumo de datos desde donde se interrumpió llamando a <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Escritura de datos<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Los datos escritos en diferentes canales virtuales (shards) pueden ser mensajes de inserción o mensajes de borrado. Estos vchannels también pueden denominarse DmChannels (canales de manipulación de datos).</p>
<p>Diferentes colecciones pueden compartir los mismos pchannels en el log broker. Una colección puede tener múltiples shards y, por tanto, múltiples vchannels correspondientes. En consecuencia, las entidades de una misma colección fluyen hacia múltiples pchannels correspondientes en el log broker. Como resultado, el beneficio de compartir pchannels es un mayor volumen de rendimiento habilitado por la alta concurrencia del log broker.</p>
<p>Cuando se crea una colección, no sólo se especifica el número de shards, sino que también se decide la asignación entre vchannels y pchannels en el log broker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Ruta de escritura en Milvus</span> </span></p>
<p>Como se muestra en la ilustración anterior, en la ruta de escritura, los proxies escriben datos en el log broker a través de la interfaz <code translate="no">AsProducer()</code> del MsgStream. A continuación, los nodos de datos consumen los datos, luego los convierten y almacenan los datos consumidos en el almacenamiento de objetos. La ruta de almacenamiento es un tipo de meta información que será registrada en etcd por los coordinadores de datos.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagrama de flujo</h3><p>Dado que diferentes colecciones pueden compartir los mismos pchannels en el log broker, al consumir datos, los nodos de datos o los nodos de consulta necesitan juzgar a qué colección pertenecen los datos de un pchannel. Para resolver este problema, hemos introducido flowgraph en Milvus. Se encarga principalmente de filtrar los datos en un pchannel compartido por IDs de colección. Así, podemos decir que cada flowgraph gestiona el flujo de datos en un shard correspondiente (vchannel) en una colección.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Flowgraph en ruta de escritura</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Creación de MsgStream</h3><p>Cuando se escriben datos, el objeto MsgStream se crea en los dos escenarios siguientes:</p>
<ul>
<li>Cuando el proxy recibe una solicitud de inserción de datos, primero intenta obtener el mapeo entre vchannels y pchannels a través del coordinador raíz (root coord). A continuación, el proxy crea un objeto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Escenario 1</span> </span></p>
<ul>
<li>Cuando se inicia el nodo de datos y lee la metainformación de los canales en etcd, se crea el objeto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Escenario 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Lectura de datos<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Ruta de lectura en Milvus</span> </span></p>
<p>El flujo de trabajo general de la lectura de datos se ilustra en la imagen anterior. Las solicitudes de consulta se transmiten a través de DqRequestChannel a los nodos de consulta. Los nodos de consulta ejecutan las tareas de consulta en paralelo. Los resultados de consulta de los nodos de consulta pasan a través de gRPC y el proxy agrega los resultados y los devuelve al cliente.</p>
<p>Para ver más de cerca el proceso de lectura de datos, podemos ver que el proxy escribe peticiones de consulta en DqRequestChannel. A continuación, los nodos de consulta consumen los mensajes suscribiéndose a DqRequestChannel. Cada mensaje del DqRequestChannel se difunde para que todos los nodos de consulta suscritos puedan recibirlo.</p>
<p>Cuando los nodos de consulta reciben solicitudes de consulta, realizan una consulta local tanto de los datos por lotes almacenados en segmentos sellados como de los datos de flujo que se insertan dinámicamente en Milvus y se almacenan en segmentos crecientes. Después, los nodos de consulta tienen que agregar los resultados de la consulta <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">tanto en segmentos sellados como en segmentos crecientes</a>. Estos resultados agregados se transmiten al proxy a través de gRPC.</p>
<p>El proxy recoge todos los resultados de múltiples nodos de consulta y los agrega para obtener los resultados finales. A continuación, el proxy devuelve los resultados finales de la consulta al cliente. Dado que cada solicitud de consulta y sus correspondientes resultados están etiquetados con el mismo requestID único, el proxy puede averiguar qué resultados de consulta corresponden a qué solicitud de consulta.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagrama de flujo</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Diagrama de flujo en la ruta de lectura</span> </span></p>
<p>Al igual que en la ruta de escritura, también se introducen diagramas de flujo en la ruta de lectura. Milvus implementa la arquitectura Lambda unificada, que integra el procesamiento de los datos incrementales e históricos. Por lo tanto, los nodos de consulta también necesitan obtener datos de flujo en tiempo real. Del mismo modo, los flujos en la ruta de lectura filtran y diferencian los datos de diferentes colecciones.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Creación de MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Creación del objeto MsgStream en la ruta de lectura</span> </span></p>
<p>Cuando se leen datos, el objeto MsgStream se crea en el siguiente escenario:</p>
<ul>
<li>En Milvus, los datos no pueden leerse a menos que estén cargados. Cuando el proxy recibe una solicitud de carga de datos, envía la solicitud al coordinador de consultas, que decide la forma de asignar los fragmentos a los distintos nodos de consulta. La información de asignación (es decir, los nombres de los vchannels y la correspondencia entre los vchannels y sus correspondientes pchannels) se envía a los nodos de consulta mediante una llamada a método o RPC (llamada a procedimiento remoto). Posteriormente, los nodos de consulta crean los objetos MsgStream correspondientes para consumir los datos.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Operaciones DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL significa lenguaje de definición de datos. Las operaciones DDL sobre metadatos pueden clasificarse en solicitudes de escritura y solicitudes de lectura. Sin embargo, estos dos tipos de solicitudes se tratan por igual durante el procesamiento de metadatos.</p>
<p>Las solicitudes de lectura de metadatos incluyen</p>
<ul>
<li>Consulta del esquema de recopilación</li>
<li>Información de indexación de consultas Y más</li>
</ul>
<p>Las solicitudes de escritura incluyen:</p>
<ul>
<li>Crear una colección</li>
<li>Dar de baja una colección</li>
<li>Crear un índice</li>
<li>Eliminar un índice Y más</li>
</ul>
<p>Las peticiones DDL se envían al proxy desde el cliente, y el proxy transmite estas peticiones en el orden recibido al coordenador raíz, que asigna una marca de tiempo a cada petición DDL y realiza comprobaciones dinámicas de las peticiones. El proxy gestiona cada solicitud de forma serial, es decir, una solicitud DDL cada vez. El proxy no procesará la siguiente solicitud hasta que termine de procesar la anterior y reciba los resultados del coord raíz.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Operaciones DDL</span>. </span></p>
<p>Como se muestra en la ilustración anterior, hay <code translate="no">K</code> solicitudes DDL en la cola de tareas de Root coord. Las solicitudes DDL en la cola de tareas se ordenan según el orden en que las recibe el coordinador raíz. Así, <code translate="no">ddl1</code> es la primera enviada al coordinador raíz y <code translate="no">ddlK</code> es la última de este lote. El coordinador raíz procesa las peticiones una a una en el orden temporal.</p>
<p>En un sistema distribuido, la comunicación entre los proxies y el coordinador raíz se realiza mediante gRPC. El root coord mantiene un registro del valor máximo de la marca de tiempo de las tareas ejecutadas para asegurar que todas las peticiones DDL se procesan en orden de tiempo.</p>
<p>Supongamos que hay dos proxies independientes, el proxy 1 y el proxy 2. Ambos envían peticiones DDL al servidor. Ambos envían peticiones DDL a la misma coordenada raíz. Sin embargo, uno de los problemas es que las peticiones anteriores no se envían necesariamente al coord raíz antes que las peticiones que recibe otro proxy más tarde. Por ejemplo, en la imagen anterior, cuando <code translate="no">DDL_K-1</code> se envía al coordinador raíz desde el proxy 1, <code translate="no">DDL_K</code> desde el proxy 2 ya ha sido aceptada y ejecutada por el coordinador raíz. Según lo registrado por el coordinador raíz, el valor máximo de la marca de tiempo de las tareas ejecutadas en este punto es <code translate="no">K</code>. Por lo tanto, para no interrumpir el orden temporal, la solicitud <code translate="no">DDL_K-1</code> será rechazada por la cola de tareas del coordinador raíz. Sin embargo, si el proxy 2 envía la solicitud <code translate="no">DDL_K+5</code> al coordenador raíz en este punto, la solicitud será aceptada en la cola de tareas y se ejecutará más tarde de acuerdo con su valor de marca de tiempo.</p>
<h2 id="Indexing" class="common-anchor-header">Indexación<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Creación de un índice</h3><p>Al recibir solicitudes de creación de índices del cliente, el proxy realiza primero comprobaciones estáticas de las solicitudes y las envía al coordenador raíz. A continuación, el coordinador raíz persiste estas solicitudes de creación de índices en el metaalmacenamiento (etcd) y envía las solicitudes al coordinador de índices (coordinador de índices).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Creación de un índice</span>. </span></p>
<p>Como se ilustra más arriba, cuando el coordinador del índice recibe solicitudes de creación de índices del coordinador raíz, primero persiste la tarea en etcd para el metaalmacenamiento. El estado inicial de la tarea de creación de índice es <code translate="no">Unissued</code>. El coordinador del índice mantiene un registro de la carga de tareas de cada nodo del índice y envía las tareas entrantes a un nodo del índice menos cargado. Al finalizar la tarea, el nodo de índice escribe el estado de la tarea, ya sea <code translate="no">Finished</code> o <code translate="no">Failed</code> en el metaalmacenamiento, que es etcd en Milvus. A continuación, el coordinador del índice sabrá si la tarea de creación del índice ha tenido éxito o ha fallado consultando el etcd. Si la tarea falla debido a que los recursos del sistema son limitados o al abandono del nodo de índice, el coordinador del índice volverá a iniciar todo el proceso y asignará la misma tarea a otro nodo de índice.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Abandono de un índice</h3><p>Además, el coordinador de índices también se encarga de las solicitudes de eliminación de índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Baja de un índice</span>. </span></p>
<p>Cuando el nodo raíz recibe una solicitud de eliminación de un índice por parte del cliente, primero marca el índice como &quot;eliminado&quot; y devuelve el resultado al cliente, notificándoselo al nodo índice. A continuación, el coordinador de índices filtra todas las tareas de indexación con <code translate="no">IndexID</code> y se eliminan las tareas que cumplen la condición.</p>
<p>La coroutina en segundo plano del coordinador de índices eliminará gradualmente todas las tareas de indexación marcadas como "descartadas" del almacenamiento de objetos (MinIO y S3). En este proceso interviene la interfaz recycleIndexFiles. Cuando se eliminan todos los archivos de índice correspondientes, la metainformación de las tareas de indexación eliminadas se elimina del metaalmacenamiento (etcd).</p>
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, orquestamos esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consultas en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
