---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Producción de la búsqueda semántica: Cómo creamos y ampliamos la
  infraestructura de vectores en Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Descubra cómo Airtable ha creado una infraestructura vectorial escalable
  basada en Milvus para la búsqueda semántica, la recuperación multiusuario y
  las experiencias de IA de baja latencia.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Este post fue publicado originalmente</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">en el</a></em> <em>canal</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>y se vuelve a publicar aquí con permiso.</em></p>
<p>A medida que la búsqueda semántica en Airtable evolucionó de un concepto a una característica central del producto, el equipo de Infraestructura de Datos se enfrentó al reto de escalarla. Como se detalla en nuestro <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">post anterior sobre la construcción del sistema de incrustación</a>, ya habíamos diseñado una capa de aplicación robusta y coherente para manejar el ciclo de vida de incrustación. Pero aún faltaba una pieza fundamental en nuestro diagrama de arquitectura: la propia base de datos vectorial.</p>
<p>Necesitábamos un motor de almacenamiento capaz de indexar y servir miles de millones de incrustaciones, soportar la multitenencia masiva y mantener los objetivos de rendimiento y disponibilidad en un entorno de nube distribuida. Esta es la historia de cómo diseñamos, reforzamos y evolucionamos nuestra plataforma de búsqueda vectorial para convertirla en un pilar fundamental de la infraestructura de Airtable.</p>
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
    </button></h2><p>En Airtable, nuestro objetivo es ayudar a los clientes a trabajar con sus datos de forma potente e intuitiva. Con la aparición de LLMs cada vez más potentes y precisos, las características que aprovechan el significado semántico de sus datos se han convertido en el núcleo de nuestro producto.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Cómo utilizamos la búsqueda semántica<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (el chat de IA de Airtable) responde a preguntas reales a partir de grandes conjuntos de datos</h3><p>Imagine hacer una pregunta en lenguaje natural a su base (base de datos) con medio millón de filas, y obtener una respuesta correcta y rica en contexto. Por ejemplo:</p>
<p>"¿Qué dicen últimamente los clientes sobre la duración de la batería?".</p>
<p>En conjuntos de datos pequeños, es posible enviar todas las filas directamente a un LLM. A gran escala, esto se convierte rápidamente en inviable. En su lugar, necesitábamos un sistema capaz de</p>
<ul>
<li>Comprender la intención semántica de una consulta.</li>
<li>recuperar las filas más relevantes mediante una búsqueda de similitud vectorial</li>
<li>Proporcionar esas filas como contexto a un LLM.</li>
</ul>
<p>Este requisito determinó casi todas las decisiones de diseño que se tomaron a continuación: Omni debía ser instantáneo e inteligente, incluso en bases muy grandes.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Recomendaciones de registros vinculados: Más sentido que coincidencias exactas</h3><p>La búsqueda semántica también mejora una función básica de Airtable: los registros vinculados. Los usuarios necesitan sugerencias de relaciones basadas en el contexto y no en coincidencias exactas de texto. Por ejemplo, la descripción de un proyecto puede implicar una relación con "Team Infrastructure" sin utilizar nunca esa frase específica.</p>
<p>Ofrecer estas sugerencias a la carta requiere una recuperación semántica de alta calidad con una latencia consistente y predecible.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Nuestras prioridades de diseño<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Para dar soporte a estas funciones y a otras más, anclamos el sistema en torno a 4 objetivos:</p>
<ul>
<li><strong>Consultas de baja latencia (500 ms p99):</strong> un rendimiento predecible es fundamental para la confianza del usuario.</li>
<li><strong>Escrituras de alto rendimiento:</strong> las bases cambian constantemente y las incrustaciones deben estar sincronizadas.</li>
<li><strong>Escalabilidad horizontal:</strong> el sistema debe soportar millones de bases independientes.</li>
<li><strong>Autoalojamiento:</strong> todos los datos de los clientes deben permanecer dentro de la infraestructura controlada por Airtable.</li>
</ul>
<p>Estos objetivos dieron forma a cada decisión arquitectónica que siguió.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Evaluación de proveedores de bases de datos vectoriales<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>A finales de 2024, evaluamos varias opciones de bases de datos vectoriales y finalmente seleccionamos <a href="https://milvus.io/">Milvus</a> basándonos en tres requisitos clave.</p>
<ul>
<li>En primer lugar, dimos prioridad a una solución autoalojada para garantizar la privacidad de los datos y mantener un control detallado de nuestra infraestructura.</li>
<li>En segundo lugar, nuestra gran carga de trabajo de escritura y nuestros patrones de consulta en ráfagas requerían un sistema que pudiera escalar elásticamente manteniendo una latencia baja y predecible.</li>
<li>Por último, nuestra arquitectura requería un fuerte aislamiento entre millones de clientes.</li>
</ul>
<p><strong>Milvus</strong> se reveló como la mejor opción: su naturaleza distribuida admite la multi-tenencia masiva y nos permite escalar la ingesta, la indexación y la ejecución de consultas de forma independiente, ofreciendo rendimiento y manteniendo los costes predecibles.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Diseño de la arquitectura<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Después de elegir una tecnología, tuvimos que determinar una arquitectura para representar la forma única de los datos de Airtable: millones de "bases" distintas propiedad de diferentes clientes.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">El reto de la partición<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Evaluamos dos estrategias principales de partición de datos:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Opción 1: Particiones compartidas</h3><p>Múltiples bases comparten una partición, y las consultas se realizan filtrando el id de la base. Esto mejora la utilización de los recursos, pero introduce una sobrecarga adicional de filtrado y hace más compleja la eliminación de bases.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Opción 2: Una base por partición</h3><p>Cada base de Airtable se asigna a su propia partición física en Milvus. Esto proporciona un fuerte aislamiento, permite la eliminación rápida y sencilla de bases y evita el impacto en el rendimiento del filtrado posterior a la consulta.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Estrategia final</h3><p>Elegimos la opción 2 por su simplicidad y fuerte aislamiento. Sin embargo, las primeras pruebas mostraron que la creación de 100.000 particiones en una única colección Milvus causaba una degradación significativa del rendimiento:</p>
<ul>
<li>La latencia de creación de particiones aumentó de ~20 ms a ~250 ms</li>
<li>Los tiempos de carga de las particiones superaban los 30 segundos.</li>
</ul>
<p>Para solucionar este problema, limitamos el número de particiones por colección. Para cada clúster Milvus, creamos 400 colecciones, cada una con un máximo de 1.000 particiones. Esto limita el número total de bases por clúster a 400.000, y los nuevos clústeres se aprovisionan a medida que se incorporan nuevos clientes.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indexación y recuperación<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>La elección del índice ha resultado ser uno de los compromisos más importantes de nuestro sistema. Cuando se carga una partición, su índice se almacena en memoria o en disco. Para encontrar un equilibrio entre la tasa de recuperación, el tamaño del índice y el rendimiento, hemos comparado varios tipos de índices.</p>
<ul>
<li><strong>IVF-SQ8:</strong> ocupaba poca memoria, pero ofrecía una recuperación menor.</li>
<li><strong>HNSW:</strong> ofrece la mejor recuperación (99%-100%), pero consume mucha memoria.</li>
<li><strong>DiskANN:</strong> ofrece una recuperación similar a HNSW, pero con una latencia de consulta mayor.</li>
</ul>
<p>Finalmente, elegimos HNSW por sus características superiores de recuperación y rendimiento.</p>
<h2 id="The-Application-layer" class="common-anchor-header">La capa de aplicación<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>A grandes rasgos, el proceso de búsqueda semántica de Airtable consta de dos flujos principales:</p>
<ol>
<li><strong>Flujo de ingestión:</strong> Convierte las filas de Airtable en incrustaciones y las almacena en Milvus.</li>
<li><strong>Flujo de consulta:</strong> Incrustar las consultas de los usuarios, recuperar los IDs de las filas relevantes y proporcionar contexto al LLM.</li>
</ol>
<p>Ambos flujos deben funcionar de forma continua y fiable a gran escala. A continuación describimos cada uno de ellos.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Flujo de ingestión: mantener Milvus sincronizado con Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando un usuario abre Omni, Airtable comienza a sincronizar su base con Milvus. Creamos una partición, a continuación, procesamos las filas en trozos, generando incrustaciones y upserting en Milvus. A partir de ese momento, capturamos cualquier cambio realizado en la base y volvemos a incrustar y a insertar esas filas para mantener la coherencia de los datos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Flujo de consultas: cómo utilizamos los datos<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>En cuanto a la consulta, incorporamos la solicitud del usuario y la enviamos a Milvus para recuperar los ID de fila más relevantes. A continuación, obtenemos las últimas versiones de esas filas y las incluimos como contexto en la solicitud al LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Retos operativos y cómo los resolvimos<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir una arquitectura de búsqueda semántica es un reto; ejecutarla de forma fiable para cientos de miles de bases es otro. A continuación se presentan algunas lecciones operativas clave que aprendimos por el camino.</p>
<h3 id="Deployment" class="common-anchor-header">Despliegue</h3><p>Desplegamos Milvus a través de su CRD Kubernetes con el <a href="https://github.com/zilliztech/milvus-operator">operador Milvus</a>, lo que nos permite definir y gestionar clústeres de forma declarativa. Cada cambio, ya sea una actualización de la configuración, una mejora del cliente o una actualización de Milvus, se somete a pruebas unitarias y a una prueba de carga bajo demanda que simula el tráfico de producción antes de distribuirlo a los usuarios.</p>
<p>En la versión 2.5, el cluster de Milvus está formado por estos componentes principales:</p>
<ul>
<li>Los nodos de consulta almacenan los índices vectoriales en memoria y ejecutan las búsquedas vectoriales.</li>
<li>Los nodos de datos gestionan la ingesta y la compactación, y persisten los nuevos datos en el almacenamiento.</li>
<li>Los nodos de índices crean y mantienen índices vectoriales para agilizar las búsquedas a medida que crecen los datos.</li>
<li>El nodo coordinador organiza toda la actividad del clúster y la asignación de fragmentos.</li>
<li>Los nodos proxy enrutan el tráfico API y equilibran la carga entre los nodos.</li>
<li>Kafka proporciona la columna vertebral de registro y flujo para la mensajería interna y el flujo de datos.</li>
<li>Etcd almacena los metadatos del clúster y el estado de coordinación.</li>
</ul>
<p>Gracias a la automatización basada en CRD y a un riguroso proceso de pruebas, podemos lanzar actualizaciones de forma rápida y segura.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Observabilidad: Comprensión del estado del sistema de principio a fin<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Supervisamos el sistema en dos niveles para garantizar que la búsqueda semántica siga siendo rápida y predecible.</p>
<p>A nivel de infraestructura, hacemos un seguimiento de la CPU, el uso de la memoria y el estado de los pods en todos los componentes de Milvus. Estas señales nos indican si el clúster está funcionando dentro de los límites de seguridad y nos ayudan a detectar problemas como la saturación de recursos o los nodos insalubres antes de que afecten a los usuarios.</p>
<p>En la capa de servicios, nos centramos en la capacidad de cada base para hacer frente a nuestras cargas de trabajo de ingestión y consulta. Métricas como el rendimiento de la compactación y la indexación nos dan una idea de la eficacia con la que se ingieren los datos. Las tasas de éxito de las consultas y la latencia nos dan una idea de la experiencia del usuario al consultar los datos, y el crecimiento de las particiones nos permite saber cómo crecen nuestros datos, de modo que se nos avisa si necesitamos escalarlos.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Rotación de nodos<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Por razones de seguridad y cumplimiento, rotamos regularmente los nodos Kubernetes. En un clúster de búsqueda vectorial, esto no es trivial:</p>
<ul>
<li>A medida que se rotan los nodos de consulta, el coordinador reequilibrará los datos en memoria entre los nodos de consulta</li>
<li>Kafka y Etcd almacenan información de estado y requieren quórum y disponibilidad continua.</li>
</ul>
<p>Esto se aborda con presupuestos de interrupción estrictos y una política de rotación de un nodo a la vez. El coordinador Milvus dispone de tiempo para reequilibrarse antes de que se produzca el siguiente ciclo de nodos. Esta cuidadosa orquestación preserva la fiabilidad sin ralentizar nuestra velocidad.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Descarga de particiones en frío<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>Una de nuestras mayores ventajas operativas fue darnos cuenta de que nuestros datos tienen claros patrones de acceso frío/caliente. Analizando el uso, descubrimos que sólo el 25% de los datos de Milvus se escriben o se leen en una semana determinada. Milvus nos permite descargar particiones enteras, liberando memoria en los nodos de consulta. Si esos datos se necesitan más tarde, podemos recargarlos en cuestión de segundos. Esto nos permite mantener los datos calientes en la memoria y descargar el resto, reduciendo costes y permitiéndonos escalar más eficientemente con el tiempo.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Recuperación de datos<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de desplegar Milvus ampliamente, necesitábamos tener la seguridad de que podríamos recuperarnos rápidamente de cualquier situación de fallo. Aunque la mayoría de los problemas están cubiertos por la tolerancia a fallos integrada en el clúster, también hemos previsto casos excepcionales en los que los datos podrían corromperse o el sistema podría entrar en un estado irrecuperable.</p>
<p>En esas situaciones, nuestra ruta de recuperación es sencilla. Primero creamos un clúster Milvus nuevo para poder reanudar el servicio de tráfico casi inmediatamente. Una vez que el nuevo clúster está activo, reincorporamos de forma proactiva las bases más utilizadas y, a continuación, procesamos perezosamente el resto a medida que se accede a ellas. Esto minimiza el tiempo de inactividad de los datos más consultados mientras el sistema reconstruye gradualmente un índice semántico coherente.</p>
<h2 id="What’s-Next" class="common-anchor-header">El futuro<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestro trabajo con <a href="https://milvus.io/">Milvus</a> ha establecido una base sólida para la búsqueda semántica en Airtable: impulsar experiencias de IA rápidas y significativas a escala. Con este sistema en su lugar, ahora estamos explorando tuberías de recuperación más ricas e integraciones de IA más profundas en todo el producto. Hay mucho trabajo emocionante por delante, y sólo estamos empezando.</p>
<p><em>Gracias a todos los miembros pasados y presentes de Airtablets en Data Infrastructure y de toda la organización que han contribuido a este proyecto: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Acerca de Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> es una plataforma líder de operaciones digitales que permite a las organizaciones crear aplicaciones personalizadas, automatizar flujos de trabajo y gestionar datos compartidos a escala empresarial. Diseñada para soportar procesos complejos y multifuncionales, Airtable ayuda a los equipos a construir sistemas flexibles para la planificación, coordinación y ejecución en una fuente compartida de verdad. A medida que Airtable amplía su plataforma impulsada por IA, tecnologías como Milvus desempeñan un papel importante en el fortalecimiento de la infraestructura de recuperación necesaria para ofrecer experiencias de producto más rápidas e inteligentes.</p>
