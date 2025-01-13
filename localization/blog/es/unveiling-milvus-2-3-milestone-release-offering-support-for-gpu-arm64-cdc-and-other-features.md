---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Presentación de Milvus 2.3: una versión que marca un hito al ofrecer
  compatibilidad con GPU, Arm64, CDC y muchas otras funciones muy esperadas.
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 es una versión que marca un hito con numerosas características muy
  esperadas, como la compatibilidad con GPU, Arm64, upsert, captura de datos de
  cambios, índice ScaNN y búsqueda por rangos. También introduce mejoras en el
  rendimiento de las consultas, un equilibrio y una programación de la carga más
  robustos y una mayor observabilidad y operabilidad.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¡Noticias emocionantes! Después de ocho meses de esfuerzo concertado, estamos encantados de anunciar el lanzamiento de Milvus 2.3, una versión hito que aporta numerosas características muy esperadas, incluyendo soporte para GPU, Arm64, upsert, captura de datos de cambios, índice ScaNN y tecnología MMap. Milvus 2.3 también introduce mejoras en el rendimiento de las consultas, un equilibrio y una programación de la carga más robustos y una mejor observabilidad y operabilidad.</p>
<p>Acompáñeme a ver estas nuevas funciones y mejoras y descubra cómo puede beneficiarse de esta versión.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Compatibilidad con GPU index que multiplica entre 3 y 10 veces el rendimiento en QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>El índice GPU es una función muy esperada en la comunidad Milvus. Gracias a una gran colaboración con los ingenieros de Nvidia, Milvus 2.3 ha soportado la indexación GPU con el robusto algoritmo RAFT añadido a Knowhere, el motor de indexación de Milvus. Gracias a la compatibilidad con la GPU, Milvus 2.3 es más de tres veces más rápido en QPS que las versiones anteriores que utilizaban el índice HNSW de la CPU y casi diez veces más rápido para conjuntos de datos específicos que requieren cálculos pesados.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Compatibilidad con Arm64 para satisfacer la creciente demanda de los usuarios<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Las CPU Arm son cada vez más populares entre los proveedores de servicios en la nube y los desarrolladores. Para satisfacer esta creciente demanda, Milvus proporciona ahora imágenes Docker para la arquitectura ARM64. Con este nuevo soporte de CPU, los usuarios de MacOS pueden crear sus aplicaciones con Milvus de forma más fluida.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Soporte Upsert para una mejor experiencia de usuario<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 introduce una mejora notable al soportar la operación upsert. Esta nueva funcionalidad permite a los usuarios actualizar o insertar datos sin problemas y les permite realizar ambas operaciones en una sola solicitud a través de la interfaz Upsert. Esta función agiliza la gestión de datos y aporta eficiencia.</p>
<p><strong>Nota</strong>:</p>
<ul>
<li>La función upsert no se aplica a los ID de autoincremento.</li>
<li>Upsert se implementa como una combinación de <code translate="no">delete</code> y <code translate="no">insert</code>, lo que puede provocar cierta pérdida de rendimiento. Recomendamos el uso de <code translate="no">insert</code> si utiliza Milvus en escenarios de escritura intensiva.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Búsqueda por rangos para resultados más precisos<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 permite a los usuarios especificar la distancia entre el vector de entrada y los vectores almacenados en Milvus durante una consulta. Milvus devuelve entonces todos los resultados coincidentes dentro del rango establecido. A continuación se muestra un ejemplo de especificación de la distancia de búsqueda utilizando la función de búsqueda por rango.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>En este ejemplo, el usuario requiere que Milvus devuelva vectores dentro de una distancia de 10 a 20 unidades desde el vector de entrada.</p>
<p><strong>Nota</strong>: Las diferentes métricas de distancia varían en la forma de calcular las distancias, dando lugar a distintos rangos de valores y estrategias de clasificación. Por lo tanto, es esencial conocer sus características antes de utilizar la función de búsqueda por rangos.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Índice ScaNN para una mayor velocidad de consulta<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 es ahora compatible con el índice ScaNN, un índice de <a href="https://zilliz.com/glossary/anns">aproximación al vecino más cercano (RNA</a> ) de código abierto desarrollado por Google. El índice ScaNN ha demostrado un rendimiento superior en varias pruebas comparativas, superando a HNSW en alrededor de un 20% y siendo aproximadamente siete veces más rápido que IVFFlat. Con la compatibilidad con el índice ScaNN, Milvus alcanza una velocidad de consulta mucho mayor en comparación con versiones anteriores.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Índice creciente para un rendimiento de consulta estable y mejor<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus incluye dos categorías de datos: datos indexados y datos en flujo. Milvus puede utilizar índices para buscar rápidamente datos indexados, pero sólo puede buscar brutalmente datos de flujo fila por fila, lo que puede afectar al rendimiento. Milvus 2.3 introduce el Índice Creciente, que crea automáticamente índices en tiempo real para datos en flujo con el fin de mejorar el rendimiento de las consultas.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iterador para la recuperación de datos por lotes<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>En Milvus 2.3, Pymilvus ha introducido una interfaz de iterador que permite a los usuarios recuperar más de 16.384 entidades en una búsqueda o búsqueda de rango. Esta función resulta útil cuando los usuarios necesitan exportar decenas de miles o incluso más vectores en lotes.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Compatibilidad con MMap para aumentar la capacidad<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap es una llamada al sistema UNIX que se utiliza para asignar archivos y otros objetos a la memoria. Milvus 2.3 es compatible con MMap, que permite a los usuarios cargar datos en discos locales y asignarlos a la memoria, aumentando así la capacidad de una sola máquina.</p>
<p>Los resultados de nuestras pruebas indican que utilizando la tecnología MMap, Milvus puede duplicar su capacidad de datos limitando la degradación del rendimiento a un 20%. Este enfoque reduce significativamente los costes totales, por lo que resulta especialmente beneficioso para los usuarios con un presupuesto ajustado a los que no les importa comprometer el rendimiento.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Compatibilidad con CDC para una mayor disponibilidad del sistema<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>La captura de datos de cambios (CDC) es una función de uso común en los sistemas de bases de datos que captura y replica los cambios de datos en un destino designado. Con la función CDC, Milvus 2.3 permite a los usuarios sincronizar datos entre centros de datos, realizar copias de seguridad de datos incrementales y migrar datos sin problemas, haciendo que el sistema esté más disponible.</p>
<p>Además de las características anteriores, Milvus 2.3 introduce una interfaz de recuento para calcular con precisión el número de filas de datos almacenados en una colección en tiempo real, soporta la métrica Coseno para medir la distancia vectorial, y más operaciones en matrices JSON. Para más características e información detallada, consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Mejoras y correcciones de errores<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de las nuevas funciones, Milvus 2.3 incluye muchas mejoras y correcciones de errores de versiones anteriores.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Mejora del rendimiento del filtrado de datos</h3><p>Milvus realiza el filtrado escalar antes de la búsqueda vectorial en las consultas de datos híbridos escalares y vectoriales para obtener resultados más precisos. Sin embargo, el rendimiento de indexación puede disminuir si el usuario ha filtrado demasiados datos después del filtrado escalar. En Milvus 2.3, hemos optimizado la estrategia de filtrado de HNSW para solucionar este problema, lo que ha mejorado el rendimiento de las consultas.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Mayor uso de CPU multinúcleo</h3><p>La búsqueda aproximada más cercana (RNA) es una tarea computacionalmente intensiva que requiere recursos masivos de CPU. En versiones anteriores, Milvus sólo podía utilizar alrededor del 70% de los recursos de CPU multinúcleo disponibles. Sin embargo, con la última versión, Milvus ha superado esta limitación y puede utilizar completamente todos los recursos de CPU multinúcleo disponibles, lo que resulta en un mejor rendimiento de la consulta y un menor desperdicio de recursos.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">QueryNode refactorizado</h3><p>QueryNode es un componente crucial en Milvus que es responsable de la búsqueda vectorial. Sin embargo, en versiones anteriores, QueryNode tenía estados complejos, colas de mensajes duplicadas, una estructura de código desorganizada y mensajes de error no intuitivos.</p>
<p>En Milvus 2.3, hemos actualizado QueryNode introduciendo una estructura de código sin estado y eliminando la cola de mensajes para borrar datos. Estas actualizaciones dan como resultado un menor desperdicio de recursos y una búsqueda de vectores más rápida y estable.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Colas de mensajes mejoradas basadas en NATS</h3><p>Construimos Milvus sobre una arquitectura basada en registros y, en versiones anteriores, utilizamos Pulsar y Kafka como intermediarios centrales de registros. Sin embargo, esta combinación se enfrentaba a tres retos clave:</p>
<ul>
<li>Era inestable en situaciones de múltiples temas.</li>
<li>Consumía recursos cuando estaba inactiva y tenía problemas para deduplicar mensajes.</li>
<li>Pulsar y Kafka están estrechamente ligados al ecosistema Java, por lo que su comunidad rara vez mantiene y actualiza sus SDK para Go.</li>
</ul>
<p>Para solucionar estos problemas, hemos combinado NATS y Bookeeper como nuestro nuevo corredor de registros para Milvus, que se adapta mejor a las necesidades de los usuarios.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Equilibrador de carga optimizado</h3><p>Milvus 2.3 ha adoptado un algoritmo de equilibrio de carga más flexible basado en las cargas reales del sistema. Este algoritmo optimizado permite a los usuarios detectar rápidamente fallos en los nodos y cargas desequilibradas y ajustar la programación en consecuencia. Según los resultados de nuestras pruebas, Milvus 2.3 puede detectar fallos, cargas desequilibradas, estados anormales de los nodos y otros eventos en cuestión de segundos y realizar los ajustes oportunos.</p>
<p>Para más información sobre Milvus 2.3, consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Actualizaciones de herramientas<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>También hemos actualizado Birdwatcher y Attu, dos valiosas herramientas para operar y mantener Milvus, junto con Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Actualización de Birdwatcher</h3><p>Hemos actualizado <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, la herramienta de depuración de Milvus, introduciendo numerosas características y mejoras, incluyendo:</p>
<ul>
<li>API RESTful para una integración perfecta con otros sistemas de diagnóstico.</li>
<li>Compatibilidad con el comando PProf para facilitar la integración con la herramienta Go pprof.</li>
<li>Capacidades de análisis de uso de almacenamiento.</li>
<li>Funcionalidad eficiente de análisis de registros.</li>
<li>Soporte para ver y modificar configuraciones en etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Actualización de Attu</h3><p>Hemos lanzado una nueva interfaz para <a href="https://zilliz.com/attu">Attu</a>, una herramienta de administración de bases de datos vectoriales todo en uno. La nueva interfaz tiene un diseño más sencillo y es más fácil de entender.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión Milvus 2.3</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Sigamos en contacto<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, no dude en ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También puede unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar directamente con nuestros ingenieros y la comunidad, o consultar nuestro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horario de oficina de los martes</a>.</p>
