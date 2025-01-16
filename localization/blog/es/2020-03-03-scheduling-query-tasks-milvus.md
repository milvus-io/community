---
id: scheduling-query-tasks-milvus.md
title: Antecedentes
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: El trabajo entre bastidores
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Cómo programa Milvus las tareas de consulta</custom-h1><p>n este artículo, discutiremos cómo Milvus programa las tareas de consulta. También hablaremos de problemas, soluciones y orientaciones futuras para implementar la programación de Milvus.</p>
<h2 id="Background" class="common-anchor-header">Antecedentes<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Sabemos por Managing Data in Massive-Scale Vector Search Engine que la búsqueda de similitud vectorial se implementa por la distancia entre dos vectores en un espacio de alta dimensión. El objetivo de la búsqueda vectorial es encontrar los K vectores más cercanos al vector objetivo.</p>
<p>Hay muchas formas de medir la distancia vectorial, como la distancia euclidiana:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-distancia-euclídea.png</span> </span></p>
<p>donde x e y son dos vectores. n es la dimensión de los vectores.</p>
<p>Para encontrar los K vectores más cercanos en un conjunto de datos, hay que calcular la distancia euclídea entre el vector objetivo y todos los vectores del conjunto de datos que se van a buscar. A continuación, los vectores se ordenan por distancia para obtener los K vectores más cercanos. El trabajo de cálculo es directamente proporcional al tamaño del conjunto de datos. Cuanto mayor sea el conjunto de datos, más trabajo de cálculo requerirá la consulta. Las GPU, especializadas en el procesamiento de grafos, disponen de muchos núcleos para proporcionar la potencia de cálculo necesaria. Por lo tanto, durante la implementación de Milvus también se tiene en cuenta la compatibilidad con múltiples GPU.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Conceptos básicos<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Bloque de datos（Archivo de tabla）</h3><p>Para mejorar el soporte de la búsqueda de datos a escala masiva, optimizamos el almacenamiento de datos de Milvus. Milvus divide los datos de una tabla por tamaño en múltiples bloques de datos. Durante la búsqueda vectorial, Milvus busca vectores en cada bloque de datos y fusiona los resultados. Una operación de búsqueda vectorial consta de N operaciones de búsqueda vectorial independientes (N es el número de bloques de datos) y N-1 operaciones de fusión de resultados.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Cola de tareas（TaskTable）</h3><p>Cada Recurso tiene una matriz de tareas, que registra las tareas que pertenecen al Recurso. Cada tarea tiene diferentes estados, incluyendo Inicio, Cargando, Cargado, Ejecutando y Ejecutado. El cargador y el ejecutor de un dispositivo informático comparten la misma cola de tareas.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Programación de consultas</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-programación-de-consultas.png</span> </span></p>
<ol>
<li>Cuando se inicia el servidor Milvus, Milvus lanza el GpuResource correspondiente a través de los parámetros <code translate="no">gpu_resource_config</code> en el archivo de configuración <code translate="no">server_config.yaml</code>. DiskResource y CpuResource todavía no pueden editarse en <code translate="no">server_config.yaml</code>. GpuResource es la combinación de <code translate="no">search_resources</code> y <code translate="no">build_index_resources</code> y se denomina <code translate="no">{gpu0, gpu1}</code> en el siguiente ejemplo:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-ejemplo.png</span> </span></p>
<ol start="2">
<li>Milvus recibe una solicitud. Los metadatos de la tabla se almacenan en una base de datos externa, que es SQLite o MySQl para un solo host y MySQL para distribuida. Tras recibir una petición de búsqueda, Milvus valida si la tabla existe y la dimensión es coherente. A continuación, Milvus lee la lista TableFile de la tabla.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-lee-la-lista-de-archivos-de-tabla.png</span> </span></p>
<ol start="3">
<li>Milvus crea una SearchTask. Como el cálculo de cada FicheroTabla se realiza independientemente, Milvus crea una TareaDeBúsqueda para cada FicheroTabla. Como unidad básica de programación de tareas, una SearchTask contiene los vectores objetivo, los parámetros de búsqueda y los nombres de archivo de TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus elige un dispositivo informático. El dispositivo en el que una SearchTask realiza el cómputo depende del tiempo de <strong>finalización estimado</strong> para cada dispositivo. El tiempo estimado de <strong>finalización</strong> especifica el intervalo estimado entre el momento actual y el momento estimado en que finaliza el cómputo.</li>
</ol>
<p>Por ejemplo, cuando un bloque de datos de una SearchTask se carga en la memoria de la CPU, la siguiente SearchTask está esperando en la cola de tareas de cálculo de la CPU y la cola de tareas de cálculo de la GPU está inactiva. El tiempo de <strong>finalización</strong> estimado para la CPU es igual a la suma del coste de tiempo estimado de la SearchTask anterior y de la SearchTask actual. El tiempo estimado de <strong>finalización</strong> para una GPU es igual a la suma del tiempo de carga de los bloques de datos en la GPU y el coste estimado de tiempo de la SearchTask actual. El tiempo de ejecución <strong>estimado</strong> para una tarea de búsqueda en un recurso es igual al tiempo medio de ejecución de todas las tareas de búsqueda en el recurso. Milvus elige entonces un dispositivo con el menor <strong>tiempo de ejecución</strong> estimado y le asigna la tarea de búsqueda.</p>
<p>Aquí suponemos que el <strong>tiempo de ejecución estimado</strong> para la GPU1 es menor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-tiempo-estimado-de-terminación-más-corto.png</span> </span></p>
<ol start="5">
<li><p>Milvus añade SearchTask a la cola de tareas de DiskResource.</p></li>
<li><p>Milvus mueve SearchTask a la cola de tareas de CpuResource. El subproceso de carga en CpuResource carga cada tarea de la cola de tareas secuencialmente. CpuResource lee los bloques de datos correspondientes en la memoria de la CPU.</p></li>
<li><p>Milvus mueve SearchTask a GpuResource. El subproceso de carga en GpuResource copia los datos de la memoria de la CPU a la memoria de la GPU. GpuResource lee los bloques de datos correspondientes en la memoria de la GPU.</p></li>
<li><p>Milvus ejecuta SearchTask en GpuResource. Dado que el resultado de una SearchTask es relativamente pequeño, el resultado se devuelve directamente a la memoria de la CPU.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus fusiona el resultado de SearchTask con el resultado de búsqueda completo.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>Una vez completadas todas las tareas de búsqueda, Milvus devuelve al cliente el resultado completo de la búsqueda.</p>
<h2 id="Index-building" class="common-anchor-header">Creación de índices<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>La creación de índices es básicamente lo mismo que el proceso de búsqueda sin el proceso de fusión. No hablaremos de esto en detalle.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimización del rendimiento<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Caché</h3><p>Como ya se ha mencionado, los bloques de datos deben cargarse en los dispositivos de almacenamiento correspondientes, como la memoria de la CPU o la memoria de la GPU, antes del cálculo. Para evitar la carga repetitiva de datos, Milvus introduce la caché LRU (Least Recently Used). Cuando la caché está llena, los nuevos bloques de datos desplazan a los antiguos. Puede personalizar el tamaño de la caché mediante el archivo de configuración basándose en el tamaño actual de la memoria. Se recomienda una caché grande para almacenar los datos de búsqueda para ahorrar tiempo de carga de datos y mejorar el rendimiento de la búsqueda.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Solapamiento de la carga de datos y el cálculo</h3><p>La caché no puede satisfacer nuestras necesidades para mejorar el rendimiento de la búsqueda. Es necesario volver a cargar los datos cuando la memoria es insuficiente o el tamaño del conjunto de datos es demasiado grande. Tenemos que reducir el efecto de la carga de datos en el rendimiento de la búsqueda. La carga de datos, ya sea del disco a la memoria de la CPU o de la memoria de la CPU a la memoria de la GPU, pertenece a las operaciones de E/S y apenas necesita trabajo computacional por parte de los procesadores. Por tanto, consideramos la posibilidad de realizar la carga de datos y el cálculo en paralelo para un mejor uso de los recursos.</p>
<p>Dividimos el cálculo de un bloque de datos en 3 etapas (carga del disco en la memoria de la CPU, cálculo en la CPU, fusión de resultados) o 4 etapas (carga del disco en la memoria de la CPU, carga de la memoria de la CPU en la memoria de la GPU, cálculo en la GPU y recuperación de resultados, y fusión de resultados). Si tomamos como ejemplo el cálculo en 3 etapas, podemos lanzar 3 subprocesos responsables de las 3 etapas para que funcionen como canalización de instrucciones. Dado que los conjuntos de resultados son en su mayoría pequeños, la fusión de resultados no requiere mucho tiempo. En algunos casos, el solapamiento de la carga de datos y el cálculo puede reducir el tiempo de búsqueda a la mitad.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-secuencial-solapamiento-carga-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Problemas y soluciones<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Diferentes velocidades de transmisión</h3><p>Anteriormente, Milvus utilizaba la estrategia Round Robin para la programación de tareas multi-GPU. Esta estrategia funcionó perfectamente en nuestro servidor de 4-GPU y el rendimiento de búsqueda fue 4 veces mejor. Sin embargo, para nuestros hosts de 2 GPU, el rendimiento no era 2 veces mejor. Hicimos algunos experimentos y descubrimos que la velocidad de copia de datos para una GPU era de 11 GB/s. Sin embargo, para otra GPU, era de 3 GB/s. Tras consultar la documentación de la placa base, confirmamos que ésta estaba conectada a una GPU a través de PCIe x16 y a otra GPU a través de PCIe x4. Es decir, estas GPU tienen velocidades de copia diferentes. Posteriormente, añadimos el tiempo de copia para medir el dispositivo óptimo para cada SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Trabajo futuro<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Entorno de hardware con mayor complejidad</h3><p>En condiciones reales, el entorno de hardware puede ser más complicado. Para entornos de hardware con múltiples CPU, memoria con arquitectura NUMA, NVLink y NVSwitch, la comunicación entre CPU/GPU ofrece muchas oportunidades de optimización.</p>
<p>Optimización de consultas</p>
<p>Durante la experimentación, descubrimos algunas oportunidades de mejora del rendimiento. Por ejemplo, cuando el servidor recibe varias consultas para la misma tabla, las consultas pueden fusionarse en determinadas condiciones. Utilizando la localidad de los datos, podemos mejorar el rendimiento. Estas optimizaciones se implementarán en nuestro desarrollo futuro. Ahora ya sabemos cómo se programan y realizan las consultas para el escenario de un único host y múltiples GPU. Seguiremos introduciendo más mecanismos internos para Milvus en los próximos artículos.</p>
