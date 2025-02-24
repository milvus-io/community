---
id: what-milvus-taught-us-in-2024.md
title: Lo que nos enseñaron los usuarios de Milvus en 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: Consulta las preguntas más frecuentes sobre Milvus en nuestro Discord.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Visión general<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Mientras Milvus florecía en 2024 con grandes lanzamientos y un próspero ecosistema de código abierto, un tesoro oculto de opiniones de usuarios se formaba silenciosamente en nuestra comunidad en <a href="https://discord.gg/xwqmFDURcz">Discord</a>. Esta recopilación de debates de la comunidad ofrecía una oportunidad única para comprender de primera mano los retos de nuestros usuarios. Intrigado por este recurso sin explotar, me embarqué en un análisis exhaustivo de cada hilo de discusión del año, en busca de patrones que pudieran ayudarnos a compilar un recurso de preguntas frecuentes para los usuarios de Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Mi análisis reveló tres áreas principales en las que los usuarios buscaban constantemente orientación: <strong>Optimización del rendimiento</strong>, <strong>estrategias de despliegue</strong> y <strong>gestión de datos</strong>. Los usuarios discutían con frecuencia cómo ajustar Milvus para entornos de producción y realizar un seguimiento eficaz de las métricas de rendimiento. En cuanto al despliegue, la comunidad se enfrentó a la selección de despliegues adecuados, la elección de índices de búsqueda óptimos y la resolución de problemas en configuraciones distribuidas. Las conversaciones sobre gestión de datos se centraron en las estrategias de migración de datos de servicio a servicio y la selección de modelos de incrustación.</p>
<p>Examinemos cada una de estas áreas con más detalle.</p>
<h2 id="Deployment" class="common-anchor-header">Despliegue<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus proporciona modos de despliegue flexibles para adaptarse a varios casos de uso. Sin embargo, a algunos usuarios les resulta difícil encontrar la opción adecuada y quieren sentirse seguros de que lo están haciendo "correctamente".</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">¿Qué tipo de despliegue debo elegir?</h3><p>Una pregunta muy frecuente es qué despliegue elegir entre Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> y <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. La respuesta depende principalmente del tamaño que necesite su base de datos vectorial y de la cantidad de tráfico que vaya a servir:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Cuando cree prototipos en su sistema local con hasta unos pocos millones de vectores, o busque una base de datos de vectores integrada para pruebas unitarias y CI/CD, puede utilizar Milvus Lite. Tenga en cuenta que algunas características más avanzadas como la búsqueda de texto completo aún no están disponibles en Milvus Lite, pero pronto lo estarán.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Independiente</h4><p>Si su sistema necesita servir tráfico de producción y/o necesita almacenar entre unos pocos millones y cien millones de vectores, debería utilizar Milvus Standalone, que empaqueta todos los componentes de Milvus en una única imagen Docker. Hay una variación que sólo saca sus dependencias de almacenamiento persistente (minio) y de almacenamiento de metadatos (etcd) como imágenes separadas.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus Distribuido</h4><p>Para cualquier despliegue a gran escala que sirva tráfico de producción, como servir miles de millones de vectores a miles de QPS, debería usar Milvus Distributed. Algunos usuarios pueden querer realizar un procesamiento por lotes fuera de línea a escala, por ejemplo, para la deduplicación de datos o la vinculación de registros, y la futura versión de Milvus 3.0 proporcionará una forma más eficiente de hacerlo mediante lo que denominamos un lago de vectores.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Servicio totalmente gestionado</h4><p>Para los desarrolladores que quieren centrarse en el desarrollo de la aplicación sin preocuparse de DevOps, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> es el Milvus totalmente gestionado que ofrece un nivel gratuito.</p>
<p>Consulte <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Descripción general de los despliegues de Milvus"</a> para obtener más información.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">¿Cuánta memoria, almacenamiento y computación necesitaré?</h3><p>Esta pregunta surge a menudo, no sólo para los usuarios existentes de Milvus sino también para aquellos que están considerando si Milvus es apropiado para su aplicación. La combinación exacta de cuánta memoria, almacenamiento y computación requerirá un despliegue depende de una compleja interacción de factores.</p>
<p>Las incrustaciones vectoriales difieren en dimensionalidad debido al modelo que se utiliza. Y algunos índices de búsqueda vectorial se almacenan íntegramente en memoria, mientras que otros almacenan los datos en disco. Además, muchos índices de búsqueda son capaces de almacenar una copia comprimida (cuantizada) de las incrustaciones y requieren memoria adicional para las estructuras de datos de grafos. Estos son sólo algunos factores que afectan a la memoria y al almacenamiento.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Herramienta de dimensionamiento de recursos Milvus</h4><p>Afortunadamente, Zilliz (el equipo que mantiene Milvus) ha construido <a href="https://milvus.io/tools/sizing">una herramienta de dimensionamiento de recursos</a> que hace un trabajo fantástico para responder a esta pregunta. Introduzca la dimensionalidad de su vector, el tipo de índice, las opciones de despliegue, etc. y la herramienta estimará la CPU, la memoria y el almacenamiento necesarios para los distintos tipos de nodos de Milvus y sus dependencias. Su kilometraje puede variar, por lo que una prueba de carga real con sus datos y tráfico de muestra es siempre una buena idea.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">¿Qué índice vectorial o métrica de distancia debo elegir?</h3><p>Muchos usuarios no saben qué índice elegir ni cómo configurar los hiperparámetros. En primer lugar, siempre es posible diferir la elección del tipo de índice a Milvus seleccionando AUTOINDEX. Sin embargo, si desea seleccionar un tipo de índice específico, algunas reglas generales le proporcionarán un punto de partida.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">Índices en memoria</h4><p>¿Desea pagar el coste de colocar su índice enteramente en memoria? Un índice en memoria suele ser el más rápido, pero también el más caro. Consulte <a href="https://milvus.io/docs/index.md?tab=floating">"Índices en memoria"</a> para ver una lista de los que admite Milvus y las ventajas y desventajas en términos de latencia, memoria y recuperación.</p>
<p>Tenga en cuenta que el tamaño de su índice no es simplemente el número de vectores multiplicado por su dimensionalidad y tamaño en coma flotante. La mayoría de los índices cuantifican los vectores para reducir el uso de memoria, pero requieren memoria para estructuras de datos adicionales. Otros datos no vectoriales (escalares) y su índice también ocupan espacio de memoria.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">Índices en disco</h4><p>Cuando su índice no cabe en la memoria, puede utilizar uno de los <a href="https://milvus.io/docs/disk_index.md">"Índices en disco"</a> proporcionados por Milvus. Dos opciones con compensaciones de latencia/recursos muy diferentes son <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> y <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>DiskANN almacena una copia altamente comprimida de los vectores en memoria, y los vectores sin comprimir y las estructuras de búsqueda de gráficos en disco. Utiliza algunas ideas inteligentes para buscar en el espacio vectorial minimizando las lecturas en disco y aprovecha la velocidad de acceso aleatorio de los SSD. Para una latencia mínima, la SSD debe conectarse a través de NVMe en lugar de SATA para obtener el mejor rendimiento de E/S.</p>
<p>Técnicamente hablando, MMap no es un tipo de índice, sino que se refiere al uso de memoria virtual con un índice en memoria. Con la memoria virtual, las páginas se pueden intercambiar entre el disco y la RAM según sea necesario, lo que permite utilizar un índice mucho mayor de forma eficiente si los patrones de acceso son tales que solo se utiliza una pequeña parte de los datos a la vez.</p>
<p>DiskANN tiene una latencia excelente y constante. MMap tiene una latencia aún mejor cuando accede a una página en memoria, pero el cambio frecuente de páginas provocará picos de latencia. Por lo tanto, MMap puede tener una mayor variabilidad en la latencia, dependiendo de los patrones de acceso a la memoria.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">Índices GPU</h4><p>Una tercera opción es construir <a href="https://milvus.io/docs/gpu_index.md">un índice utilizando la memoria y el cálculo de la GPU</a>. El equipo Nvidia <a href="https://rapids.ai/">RAPIDS</a> contribuye a la compatibilidad de Milvus con la GPU. La búsqueda vectorial en la GPU puede tener una latencia menor que la correspondiente búsqueda en la CPU, aunque normalmente se necesitan cientos o miles de QPS de búsqueda para explotar plenamente el paralelismo de la GPU. Además, las GPU suelen tener menos memoria que la RAM de la CPU y su ejecución es más costosa.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Métricas de distancia</h4><p>Una pregunta más fácil de responder es qué métrica de distancia elegir para medir la similitud entre vectores. Se recomienda elegir la misma métrica de distancia con la que se entrenó el modelo de incrustación, que suele ser COSINE (o IP cuando las entradas están normalizadas). La fuente de su modelo (por ejemplo, la página del modelo en HuggingFace) le aclarará qué métrica de distancia se utilizó. Zilliz también ha elaborado una <a href="https://zilliz.com/ai-models">tabla</a> muy útil para averiguarlo.</p>
<p>Para resumir, creo que gran parte de la incertidumbre en torno a la elección del índice gira en torno a la incertidumbre sobre cómo estas opciones afectan a la latencia / uso de recursos / recuperación de su despliegue. Recomiendo utilizar las reglas generales anteriores para decidir entre índices en memoria, en disco o en GPU y, a continuación, utilizar las directrices de compensación dadas en la documentación de Milvus para elegir uno en particular.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">¿Pueden arreglar mi despliegue de Milvus Distributed roto?</h3><p>Muchas preguntas giran en torno a los problemas para poner en marcha una implementación de Milvus Distributed, con preguntas relacionadas con la configuración, las herramientas y los registros de depuración. Es difícil dar una solución única, ya que cada pregunta parece diferente de la anterior, aunque por suerte Milvus tiene <a href="https://milvus.io/discord">un Discord vibrante</a> donde se puede buscar ayuda, y también ofrecemos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">horas de oficina 1-a-1 con un experto</a>.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">¿Cómo despliego Milvus en Windows?</h3><p>Una pregunta que ha surgido varias veces es cómo desplegar Milvus en máquinas Windows. Basándonos en sus comentarios, hemos reescrito la documentación para esto: vea <a href="https://milvus.io/docs/install_standalone-windows.md">Ejecutar Milvus en Docker (Windows)</a> para saber cómo hacerlo, utilizando <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Rendimiento y perfiles<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tras elegir un tipo de despliegue y ponerlo en marcha, los usuarios quieren sentirse seguros de que han tomado las decisiones óptimas y les gustaría perfilar el rendimiento y el estado de su despliegue. Hay muchas preguntas relacionadas con cómo perfilar el rendimiento, observar el estado y obtener una visión de qué y por qué.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">¿Cómo se mide el rendimiento?</h3><p>Los usuarios desean comprobar las métricas relacionadas con el rendimiento de su implantación para poder comprender y solucionar los cuellos de botella. Entre las métricas mencionadas se incluyen la latencia media de las consultas, la distribución de las latencias, el volumen de consultas, el uso de memoria, el almacenamiento en disco, etc. Mientras que obtener estas métricas con <a href="https://milvus.io/docs/monitor_overview.md">el sistema de monitorización heredado</a> ha sido un reto, Milvus 2.5 introduce un nuevo sistema llamado <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (¡se agradecen los comentarios!), que le permite acceder a toda esta información desde una interfaz web fácil de usar.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">¿Qué está pasando dentro de Milvus en este momento (es decir, observar el estado)?</h3><p>En relación con esto, los usuarios quieren observar el estado interno de su despliegue. Las cuestiones planteadas incluyen entender por qué un índice de búsqueda está tardando tanto en construirse, cómo determinar si el clúster está sano y entender cómo se ejecuta una consulta a través de los nodos. Muchas de estas preguntas pueden responderse con la nueva <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>, que da transparencia a lo que el sistema está haciendo internamente.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">¿Cómo funciona algún aspecto (complejo) de las funciones internas?</h3><p>Los usuarios avanzados a menudo quieren tener alguna comprensión de las funciones internas de Milvus, por ejemplo, tener una comprensión del sellado de segmentos o la gestión de memoria. El objetivo subyacente suele ser mejorar el rendimiento y, a veces, depurar problemas. La documentación, particularmente en las secciones &quot;Conceptos&quot; y &quot;Guía de administración&quot; es útil aquí, por ejemplo, vea las páginas <a href="https://milvus.io/docs/architecture_overview.md">&quot;Visión general de la arquitectura de Milvus&quot;</a> y <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Compactación en clúster&quot;.</a> Seguiremos mejorando la documentación sobre los aspectos internos de Milvus, haciéndola más fácil de entender, y agradeceremos cualquier comentario o petición a través de <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">¿Qué modelo de incrustación debo elegir?</h3><p>Una pregunta relacionada con el rendimiento que ha surgido muchas veces en reuniones, horas de oficina y en Discord es cómo elegir un modelo de incrustación. Es difícil dar una respuesta definitiva a esta pregunta, aunque recomendamos empezar con modelos predeterminados como <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Al igual que ocurre con la elección del índice de búsqueda, existe un equilibrio entre computación, almacenamiento y recuperación. Un modelo de incrustación con una dimensión de salida mayor requerirá más almacenamiento, si todo lo demás se mantiene igual, aunque probablemente dará lugar a una mayor recuperación de elementos relevantes. Los modelos de incrustación más grandes, para una dimensión fija, suelen superar a los más pequeños en términos de recuperación, aunque a costa de un aumento de la computación y el tiempo. Las tablas de clasificación del rendimiento de los modelos de incrustación, como <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>, se basan en puntos de referencia que pueden no coincidir con sus datos y tareas específicos.</p>
<p>Por lo tanto, no tiene sentido pensar en un "mejor" modelo de incrustación. Empieza con uno que tenga una recuperación aceptable y que se ajuste a tu presupuesto de tiempo y cálculo para calcular incrustaciones. Otras optimizaciones, como el ajuste fino con los datos o la exploración empírica de la relación entre cálculo y recuperación, pueden aplazarse hasta que se disponga de un sistema operativo en producción.</p>
<h2 id="Data-Management" class="common-anchor-header">Gestión de datos<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cómo mover los datos dentro y fuera de un despliegue Milvus es otro tema principal en las discusiones de Discord, lo cual no es sorprendente dado lo central que es esta tarea para poner una aplicación en producción.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">¿Cómo migro datos de X a Milvus? ¿Cómo migrar datos de Standalone a Distributed? ¿Cómo migro de 2.4.x a 2.5.x?</h3><p>Un nuevo usuario comúnmente desea obtener datos existentes en Milvus desde otra plataforma, incluyendo motores de búsqueda tradicionales como <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> y otras bases de datos vectoriales como <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> o <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Los usuarios existentes también pueden querer migrar sus datos de un despliegue de Milvus a otro, o <a href="https://docs.zilliz.com/docs/migrate-from-milvus">de Milvus autoalojado a Zilliz Cloud totalmente gestionado</a>.</p>
<p>El <a href="https://github.com/zilliztech/vts">Servicio de Transporte Vectorial (VTS)</a> y el servicio gestionado de <a href="https://docs.zilliz.com/docs/migrations">Migración</a> en Zilliz Cloud están diseñados para este propósito.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">¿Cómo guardo y cargo las copias de seguridad de los datos? ¿Cómo puedo exportar datos desde Milvus?</h3><p>Milvus tiene una herramienta dedicada, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, para tomar instantáneas en almacenamiento permanente y restaurarlas.</p>
<h2 id="Next-Steps" class="common-anchor-header">Siguientes pasos<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Espero que esto le haya dado algunas pistas sobre cómo abordar los retos comunes a los que se enfrenta cuando construye con una base de datos vectorial. Esto definitivamente nos ayudó a echar otro vistazo a nuestra documentación y hoja de ruta de características para seguir trabajando en cosas que pueden ayudar a nuestra comunidad a tener más éxito con Milvus. Un aspecto clave que me gustaría destacar es que sus elecciones le sitúan en diferentes puntos de un espacio de compromiso entre computación, almacenamiento, latencia y recuperación. <em>No es posible maximizar todos estos criterios de rendimiento simultáneamente: no existe una implantación "óptima". Sin embargo, si conoce mejor el funcionamiento de los sistemas de búsqueda vectorial y de bases de datos distribuidas, podrá tomar una decisión con conocimiento de causa.</em></p>
<p>Después de hojear el gran número de entradas de 2024, me quedé pensando: ¿por qué debería hacer esto un humano? ¿Acaso la IA Generativa no ha prometido resolver la tarea de procesar grandes cantidades de texto y extraer información? Acompáñenme en la segunda parte de esta entrada del blog (próximamente), en la que investigaré el diseño y la implementación de <em>un sistema multiagente para extraer información de los foros de debate.</em></p>
<p>Gracias de nuevo y espero verte en el <a href="https://milvus.io/discord">Discord</a> de la comunidad y en nuestros próximos encuentros <a href="https://lu.ma/unstructured-data-meetup">sobre datos no estructurados</a>. Para obtener más ayuda práctica, le invitamos a reservar una <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">hora de oficina 1-on-1</a>. <em>Sus comentarios son esenciales para mejorar Milvus.</em></p>
