---
id: deep-dive-5-real-time-query.md
title: Utilización de la base de datos vectorial Milvus para consultas en tiempo real
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Conozca el mecanismo subyacente de la consulta en tiempo real en Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo está escrito por <a href="https://github.com/xige-16">Xi Ge</a> y transcreado por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>En el artículo anterior, hemos hablado de la <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">inserción y persistencia de datos</a> en Milvus. En este artículo, continuaremos explicando cómo <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">los diferentes componentes</a> de Milvus interactúan entre sí para completar la consulta de datos en tiempo real.</p>
<p><em>A continuación se enumeran algunos recursos útiles antes de comenzar. Recomendamos leerlos primero para comprender mejor el tema de este post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Profundización en la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modelo de datos Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">El papel y la función de cada componente de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos en Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Inserción y persistencia de datos en Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Carga de datos en el nodo de consulta<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de ejecutar una consulta, los datos deben cargarse en los nodos de consulta.</p>
<p>Hay dos tipos de datos que se cargan en el nodo de consulta: datos en flujo desde <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">el corredor de registro</a> y datos históricos desde <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">el almacenamiento de objetos</a> (también denominado almacenamiento persistente más adelante).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Diagrama de flujo</span> </span></p>
<p>El coordinador de datos se encarga de gestionar los datos en flujo que se insertan continuamente en Milvus. Cuando un usuario de Milvus llama a <code translate="no">collection.load()</code> para cargar una colección, el coordinador de consultas consultará al coordinador de datos para saber qué segmentos se han mantenido en el almacenamiento y sus correspondientes puntos de control. Un punto de control es una marca que indica que los segmentos almacenados antes del punto de control se consumen, mientras que los posteriores no.</p>
<p>A continuación, el coordinador de consultas genera una estrategia de asignación basada en la información del coordinador de datos: por segmento o por canal. El asignador de segmentos es responsable de asignar segmentos en el almacenamiento persistente (datos por lotes) a diferentes nodos de consulta. Por ejemplo, en la imagen anterior, el asignador de segmentos asigna los segmentos 1 y 3 (S1, S3) al nodo de consulta 1, y los segmentos 2 y 4 (S2, S4) al nodo de consulta 2. El asignador de canales asigna diferentes nodos de consulta para ver múltiples <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">canales de</a> manipulación de datos (DMChannels) en el log broker. Por ejemplo, en la imagen anterior, el asignador de canales asigna al nodo de consulta 1 el canal 1 (Ch1) y al nodo de consulta 2 el canal 2 (Ch2).</p>
<p>Con la estrategia de asignación, cada nodo de consulta carga los datos del segmento y vigila los canales en consecuencia. En el nodo de consulta 1 de la imagen, los datos históricos (datos por lotes), se cargan a través de los S1 y S3 asignados desde el almacenamiento persistente. Mientras tanto, el nodo de consulta 1 carga datos incrementales (datos en streaming) suscribiéndose al canal 1 en el log broker.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Gestión de datos en el nodo de consulta<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Un nodo de consulta necesita gestionar tanto datos históricos como incrementales. Los datos históricos se almacenan en <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">segmentos sellados</a> mientras que los datos incrementales se almacenan en <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">segmentos crecientes</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Gestión de datos históricos</h3><p>Existen dos consideraciones principales para la gestión de datos históricos: el equilibrio de carga y la conmutación por error del nodo de consulta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Balance de carga</span> </span></p>
<p>Por ejemplo, como se muestra en la ilustración, al nodo de consulta 4 se le han asignado más segmentos sellados que al resto de los nodos de consulta. Es muy probable que esto convierta al nodo de consulta 4 en el cuello de botella que ralentice todo el proceso de consulta. Para resolver este problema, el sistema debe asignar varios segmentos del nodo de consulta 4 a otros nodos de consulta. Esto se denomina equilibrio de carga.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Conmutación por error del nodo de consulta</span> </span></p>
<p>En la imagen anterior se ilustra otra posible situación. Uno de los nodos, el nodo de consulta 4, se cae repentinamente. En este caso, la carga (segmentos asignados al nodo de consulta 4) debe transferirse a otros nodos de consulta en funcionamiento para garantizar la precisión de los resultados de la consulta.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Gestión incremental de datos</h3><p>El nodo de consulta vigila los DMChannels para recibir datos incrementales. En este proceso se introduce el diagrama de flujo. Primero filtra todos los mensajes de inserción de datos. Esto es para asegurar que sólo se cargan los datos en una partición especificada. Cada colección en Milvus tiene un canal correspondiente, que es compartido por todas las particiones en esa colección. Por lo tanto, se necesita un diagrama de flujo para filtrar los datos insertados si un usuario de Milvus sólo necesita cargar datos en una partición determinada. En caso contrario, los datos de todas las particiones de la colección se cargarán en el nodo de consulta.</p>
<p>Una vez filtrados, los datos incrementales se insertan en segmentos crecientes y se transmiten a los nodos temporales del servidor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Diagrama de flujo</span> </span></p>
<p>Durante la inserción de datos, a cada mensaje de inserción se le asigna una marca de tiempo. En el DMChannel de la imagen anterior, los datos se insertan en orden, de izquierda a derecha. La marca de tiempo del primer mensaje de inserción es 1; la del segundo, 2; y la del tercero, 6. El cuarto mensaje marcado en rojo no es un mensaje de inserción, sino un mensaje de marca de tiempo. Esto significa que los datos insertados cuyas marcas de tiempo son menores que esta marca de tiempo ya están en el corredor de registro. En otras palabras, los datos insertados después de este mensaje de marca de tiempo deben tener marcas de tiempo cuyos valores sean mayores que esta marca de tiempo. Por ejemplo, en la imagen anterior, cuando el nodo de consulta percibe que el timetick actual es 5, significa que todos los mensajes de inserción cuyo valor de timestamp es inferior a 5 se cargan en el nodo de consulta.</p>
<p>El nodo de tiempo del servidor proporciona un valor <code translate="no">tsafe</code> actualizado cada vez que recibe un timetick del nodo de inserción. <code translate="no">tsafe</code> significa tiempo de seguridad, y todos los datos insertados antes de este punto de tiempo pueden ser consultados. Por ejemplo, si <code translate="no">tsafe</code> = 9, todos los datos insertados con marcas de tiempo inferiores a 9 pueden consultarse.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Consulta en tiempo real en Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>La consulta en tiempo real en Milvus se realiza mediante mensajes de consulta. Los mensajes de consulta se insertan en el log broker mediante un proxy. A continuación, los nodos de consulta obtienen los mensajes de consulta observando el canal de consulta en el corredor de registros.</p>
<h3 id="Query-message" class="common-anchor-header">Mensaje de consulta</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Mensaje de consulta</span> </span></p>
<p>Un mensaje de consulta incluye la siguiente información crucial sobre una consulta:</p>
<ul>
<li><code translate="no">msgID</code>: ID de mensaje, el ID del mensaje de consulta asignado por el sistema.</li>
<li><code translate="no">collectionID</code>: El ID de la colección que se va a consultar (si lo especifica el usuario).</li>
<li><code translate="no">execPlan</code>: El plan de ejecución se utiliza principalmente para el filtrado de atributos en una consulta.</li>
<li><code translate="no">service_ts</code>: La fecha y hora del servicio se actualizará junto con <code translate="no">tsafe</code> mencionada anteriormente. La marca de tiempo del servicio indica en qué momento se encuentra el servicio. Todos los datos insertados antes de <code translate="no">service_ts</code> están disponibles para la consulta.</li>
<li><code translate="no">travel_ts</code>: Travel timestamp especifica un rango de tiempo en el pasado. Y la consulta se realizará sobre los datos existentes en el periodo de tiempo especificado por <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: La marca de tiempo de garantía especifica un periodo de tiempo tras el cual debe realizarse la consulta. La consulta sólo se realizará cuando <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Consulta en tiempo real</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Proceso de consulta</span> </span></p>
<p>Cuando se recibe un mensaje de consulta, Milvus comprueba en primer lugar si el tiempo de servicio actual, <code translate="no">service_ts</code>, es mayor que la marca de tiempo de garantía, <code translate="no">guarantee_ts</code>, del mensaje de consulta. En caso afirmativo, se ejecuta la consulta. La consulta se realizará en paralelo tanto sobre los datos históricos como sobre los datos incrementales. Dado que puede haber un solapamiento de datos entre los datos históricos y los datos incrementales, se necesita una acción denominada "reducción local" para filtrar los resultados redundantes de la consulta.</p>
<p>Sin embargo, si el tiempo de servicio actual es inferior a la marca de tiempo de garantía en un mensaje de consulta recién insertado, el mensaje de consulta se convertirá en un mensaje no resuelto y esperará a ser procesado hasta que el tiempo de servicio sea superior a la marca de tiempo de garantía.</p>
<p>Los resultados de la consulta se envían finalmente al canal de resultados. El proxy obtiene los resultados de la consulta de ese canal. Asimismo, el proxy realizará una "reducción global", ya que recibe resultados de varios nodos de consulta y los resultados de la consulta pueden ser repetitivos.</p>
<p>Para garantizar que el proxy ha recibido todos los resultados de la consulta antes de devolverlos al SDK, el mensaje de resultados también mantendrá un registro de información que incluye los segmentos sellados buscados, los DMChannels buscados y los segmentos sellados globales (todos los segmentos en todos los nodos de consulta). El sistema puede concluir que el proxy ha recibido todos los resultados de la consulta sólo si se cumplen las dos condiciones siguientes:</p>
<ul>
<li>La unión de todos los segmentos sellados buscados registrados en todos los mensajes de resultados es mayor que los segmentos sellados globales,</li>
<li>Se han consultado todos los DMChannels de la colección.</li>
</ul>
<p>Por último, el proxy devuelve los resultados finales después de la "reducción global" al SDK de Milvus.</p>
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
