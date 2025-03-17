---
id: a-day-in-the-life-of-milvus-datum.md
title: Un día en la vida de un Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 'Demos un paseo por un día en la vida de Dave, el dato de Milvus.'
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Construir una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> de alto rendimiento como Milvus, capaz de escalar a miles de millones de vectores y de gestionar el tráfico a escala web, no es tarea fácil. Requiere el diseño cuidadoso e inteligente de un sistema distribuido. Necesariamente, habrá un equilibrio entre rendimiento y simplicidad en el interior de un sistema como éste.</p>
<p>Aunque hemos intentado equilibrar esta balanza, algunos aspectos internos han permanecido opacos. Este artículo pretende disipar cualquier misterio sobre cómo Milvus descompone la inserción de datos, la indexación y el servicio a través de los nodos. Comprender estos procesos a alto nivel es esencial para optimizar eficazmente el rendimiento de las consultas, la estabilidad del sistema y los problemas relacionados con la depuración.</p>
<p>Así pues, demos un paseo en un día en la vida de Dave, el dato de Milvus. Imagine que inserta a Dave en su colección en un <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">despliegue distribuido</a> de <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus</a> (véase el diagrama siguiente). Por lo que a usted respecta, él entra directamente en la colección. Entre bastidores, sin embargo, se producen muchos pasos a través de subsistemas independientes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Nodos proxy y la cola de mensajes<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inicialmente, usted llama al objeto MilvusClient, por ejemplo, a través de la biblioteca PyMilvus, y envía una petición <code translate="no">_insert()</code>_ a un <em>nodo</em> proxy. Los nodos proxy son la pasarela entre el usuario y el sistema de base de datos, realizando operaciones como el equilibrio de carga en el tráfico entrante y cotejando múltiples salidas antes de que se devuelvan al usuario.</p>
<p>Se aplica una función hash a la clave principal del elemento para determinar a qué <em>canal</em> enviarlo. Los canales, implementados con temas Pulsar o Kafka, representan una base de almacenamiento para el flujo de datos, que luego pueden enviarse a los suscriptores del canal.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Nodos, segmentos y trozos de datos<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez enviados los datos al canal adecuado, éste los envía al segmento correspondiente en el <em>nodo</em> de <em>datos</em>. Los nodos de datos se encargan de almacenar y gestionar los búferes de datos denominados <em>segmentos crecientes</em>. Hay un segmento creciente por fragmento.</p>
<p>A medida que se insertan datos en un segmento, éste crece hasta alcanzar un tamaño máximo, que por defecto es de 122 MB. Durante este tiempo, partes más pequeñas del segmento, por defecto de 16MB y conocidas como <em>chunks</em>, son empujadas al almacenamiento persistente, por ejemplo, usando S3 de AWS u otro almacenamiento compatible como MinIO. Cada chunk es un archivo físico en el almacenamiento de objetos y hay un archivo separado por campo. Véase la figura anterior que ilustra la jerarquía de archivos en el almacenamiento de objetos.</p>
<p>En resumen, los datos de una colección se dividen en nodos de datos, dentro de los cuales se dividen en segmentos para el almacenamiento en búfer, que a su vez se dividen en trozos por campo para el almacenamiento persistente. Los dos diagramas anteriores lo explican mejor. Al dividir los datos entrantes de este modo, aprovechamos al máximo el paralelismo del clúster en cuanto a ancho de banda de red, cálculo y almacenamiento.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Sellado, fusión y compactación de segmentos<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hasta ahora hemos contado la historia de cómo nuestro simpático dato Dave pasa de una consulta a <code translate="no">_insert()</code>_ a un almacenamiento persistente. Por supuesto, su historia no termina ahí. Hay otros pasos para hacer más eficiente el proceso de búsqueda e indexación. Al gestionar el tamaño y el número de segmentos, el sistema aprovecha al máximo el paralelismo del clúster.</p>
<p>Una vez que un segmento alcanza su tamaño máximo en un nodo de datos, por defecto 122 MB, se dice que está <em>sellado</em>. Esto significa que el búfer del nodo de datos se vacía para dar paso a un nuevo segmento, y los trozos correspondientes en el almacenamiento persistente se marcan como pertenecientes a un segmento cerrado.</p>
<p>Los nodos de datos buscan periódicamente segmentos cerrados más pequeños y los fusionan en otros más grandes hasta alcanzar un tamaño máximo de 1 GB (por defecto) por segmento. Recordemos que cuando se borra un elemento en Milvus, simplemente se marca con una bandera de borrado - piense en ello como el corredor de la muerte para Dave. Cuando el número de elementos borrados en un segmento supera un umbral determinado, por defecto el 20%, el segmento se reduce de tamaño, una operación que llamamos <em>compactación</em>.</p>
<p>Indexación y búsqueda en segmentos</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Existe un tipo de nodo adicional, el <em>nodo índice</em>, que se encarga de crear índices para los segmentos sellados. Cuando el segmento está sellado, el nodo de datos envía una petición a un nodo de índice para que construya un índice. A continuación, el nodo de índice envía el índice completo al almacenamiento de objetos. Cada segmento sellado tiene su propio índice almacenado en un archivo separado. Puede examinar este archivo manualmente accediendo al bucket - consulte la figura anterior para ver la jerarquía de archivos.</p>
<p>Los nodos de consulta -no sólo los de datos- se suscriben a los temas de la cola de mensajes para los shards correspondientes. Los segmentos crecientes se replican en los nodos de consulta, y el nodo carga en memoria segmentos sellados pertenecientes a la colección según sea necesario. Construye un índice para cada segmento creciente a medida que llegan los datos, y carga los índices finalizados para los segmentos sellados desde el almacén de datos.</p>
<p>Imagine ahora que llama al objeto MilvusClient con una petición <em>search()</em> que engloba a Dave. Después de ser enrutada a todos los nodos de consulta a través del nodo proxy, cada nodo de consulta realiza una búsqueda de similitud vectorial (u otro de los métodos de búsqueda como consulta, búsqueda de rango o búsqueda de agrupación), iterando sobre los segmentos uno por uno. Los resultados se cotejan entre los nodos de forma similar a MapReduce y se envían de vuelta al usuario, Dave contento de encontrarse por fin reunido contigo.</p>
<h2 id="Discussion" class="common-anchor-header">Debate<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos cubierto un día en la vida de Dave el dato, tanto para las operaciones <code translate="no">_insert()</code>_ como <code translate="no">_search()</code>_. Otras operaciones como <code translate="no">_delete()</code>_ y <code translate="no">_upsert()</code>_ funcionan de forma similar. Inevitablemente, hemos tenido que simplificar nuestra discusión y omitir detalles más finos. En general, sin embargo, ahora debería tener una imagen suficiente de cómo Milvus está diseñado para el paralelismo a través de nodos en un sistema distribuido para ser robusto y eficiente, y cómo puede utilizar esto para la optimización y depuración.</p>
<p><em>Un punto importante de este artículo: Milvus está diseñado con una separación de preocupaciones entre los tipos de nodos. Cada tipo de nodo tiene una función específica y mutuamente excluyente, y existe una separación entre almacenamiento y computación.</em> El resultado es que cada componente puede escalarse independientemente con parámetros ajustables según el caso de uso y los patrones de tráfico. Por ejemplo, se puede escalar el número de nodos de consulta para dar servicio a un mayor tráfico sin escalar los nodos de datos e índice. Con esa flexibilidad, hay usuarios de Milvus que manejan miles de millones de vectores y sirven tráfico a escala web, con una latencia de consulta inferior a 100 ms.</p>
<p>También puede disfrutar de los beneficios del diseño distribuido de Milvus sin ni siquiera desplegar un clúster distribuido a través de <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un servicio totalmente gestionado de Milvus. <a href="https://cloud.zilliz.com/signup">Suscríbase hoy mismo a la versión gratuita de Zilliz Cloud y ponga a Dave en acción.</a></p>
