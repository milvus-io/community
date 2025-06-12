---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: >-
  Presentación de Milvus 2.6: búsqueda vectorial asequible a escala de miles de
  millones
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Nos complace anunciar que Milvus 2.6 ya está disponible. Esta versión
  introduce docenas de funciones que abordan directamente los retos más
  acuciantes de la búsqueda vectorial en la actualidad: escalar de forma
  eficiente manteniendo los costes bajo control.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>A medida que la búsqueda impulsada por IA ha pasado de ser un proyecto experimental a convertirse en una infraestructura de misión crítica, las exigencias a las <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de datos vectoriales</a> se han intensificado. Las organizaciones necesitan manejar miles de millones de vectores al tiempo que gestionan los costes de infraestructura, soportan la ingestión de datos en tiempo real y proporcionan una recuperación sofisticada más allá de la <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda</a> básica <a href="https://zilliz.com/learn/vector-similarity-search">por similitud</a>. Para hacer frente a estos retos en constante evolución, hemos trabajado duro en el desarrollo y perfeccionamiento de Milvus. La respuesta de la comunidad ha sido increíblemente alentadora, con valiosos comentarios que han ayudado a dar forma a nuestra dirección.</p>
<p>Tras meses de intenso desarrollo, nos complace anunciar que <strong>Milvus 2.6 ya está disponible</strong>. Esta versión aborda directamente los retos más acuciantes de la búsqueda vectorial en la actualidad: <strong><em>escalar de forma eficiente manteniendo los costes bajo control.</em></strong></p>
<p>Milvus 2.6 ofrece innovaciones revolucionarias en tres áreas críticas: <strong>reducción de costes, capacidades de búsqueda avanzadas y mejoras arquitectónicas para la escalabilidad masiva</strong>. Los resultados hablan por sí solos:</p>
<ul>
<li><p><strong>72% de reducción de memoria</strong> gracias a la cuantización RaBitQ de 1 bit, con consultas 4 veces más rápidas.</p></li>
<li><p><strong>50% de ahorro de costes</strong> gracias al almacenamiento inteligente por niveles</p></li>
<li><p><strong>Búsqueda de texto completo 4 veces más rápida</strong> que Elasticsearch con nuestra implementación BM25 mejorada</p></li>
<li><p>Filtrado JSON<strong>100 veces más rápido</strong> con el recién introducido Path Index</p></li>
<li><p>La<strong>frescura de la búsqueda se consigue de forma económica</strong> con la nueva arquitectura de disco cero</p></li>
<li><p><strong>Flujo de trabajo de incrustación agilizado</strong> con la nueva experiencia de "entrada y salida de datos</p></li>
<li><p><strong>Hasta 100.000 colecciones en un único clúster</strong> para una multitenencia preparada para el futuro</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Innovaciones para la reducción de costes: Búsqueda vectorial asequible<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>El consumo de memoria representa uno de los mayores retos a la hora de escalar la búsqueda vectorial a miles de millones de registros. Milvus 2.6 introduce varias optimizaciones clave que reducen significativamente sus costes de infraestructura a la vez que mejoran el rendimiento.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">Cuantización RaBitQ de 1 bit: 72% de reducción de memoria con un rendimiento 4×</h3><p>Los métodos tradicionales de cuantificación le obligan a sacrificar la calidad de la búsqueda por el ahorro de memoria. Milvus 2.6 cambia esta situación con la cuantización <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ de 1 bit</a> combinada con un mecanismo de refinamiento inteligente.</p>
<p>El nuevo índice IVF_RABITQ comprime el índice principal a 1/32 de su tamaño original mediante la cuantización de 1 bit. Cuando se utiliza junto con un refinamiento SQ8 opcional, este enfoque mantiene una alta calidad de búsqueda (95% de recuperación) utilizando sólo 1/4 de la huella de memoria original.</p>
<p>Nuestras pruebas preliminares arrojan resultados prometedores:</p>
<table>
<thead>
<tr><th><strong>Métrica de rendimiento</strong></th><th><strong>IVF_FLAT tradicional</strong></th><th><strong>Sólo RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1 bit) + SQ8 Refinar</strong></th></tr>
</thead>
<tbody>
<tr><td>Huella de memoria</td><td>100% (línea de base)</td><td>3% (reducción del 97%)</td><td>28% (reducción del 72%)</td></tr>
<tr><td>Recuperación</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Rendimiento de la búsqueda (QPS)</td><td>236</td><td>648 (2,7 veces más rápido)</td><td>946 (4× más rápido)</td></tr>
</tbody>
</table>
<p><em>Tabla: Evaluación de VectorDBBench con 1M de vectores de 768 dimensiones, probado en AWS m6id.2xlarge</em></p>
<p>El verdadero avance aquí no es solo la reducción del 72% de la memoria, sino conseguirlo al mismo tiempo que se proporciona una mejora del rendimiento de 4 veces. Esto significa que puede servir la misma carga de trabajo con un 75% menos de servidores o gestionar 4 veces más tráfico en su infraestructura existente, todo ello sin sacrificar la recuperación.</p>
<p>Para los usuarios empresariales que utilizan Milvus totalmente gestionado en<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, estamos desarrollando una estrategia automatizada que ajusta dinámicamente los parámetros de RaBitQ en función de las características específicas de su carga de trabajo y sus requisitos de precisión. Simplemente disfrutará de una mayor rentabilidad en todos los tipos de CU de Zilliz Cloud.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Almacenamiento por niveles frío-caliente: Reducción de costes del 50% mediante la colocación inteligente de datos</h3><p>Las cargas de trabajo de búsqueda vectorial del mundo real contienen datos con patrones de acceso muy diferentes. Los datos a los que se accede con frecuencia necesitan disponibilidad instantánea, mientras que los datos de archivo pueden tolerar una latencia ligeramente superior a cambio de unos costes de almacenamiento drásticamente inferiores.</p>
<p>Milvus 2.6 introduce una arquitectura de almacenamiento por niveles que clasifica automáticamente los datos en función de los patrones de acceso y los coloca en los niveles de almacenamiento adecuados:</p>
<ul>
<li><p><strong>Clasificación inteligente de datos</strong>: Milvus identifica automáticamente los segmentos de datos calientes (a los que se accede con frecuencia) y fríos (a los que se accede con poca frecuencia) en función de los patrones de acceso.</p></li>
<li><p><strong>Ubicación optimizada del almacenamiento</strong>: Los datos calientes permanecen en la memoria/SSD de alto rendimiento, mientras que los datos fríos se mueven a un almacenamiento de objetos más económico.</p></li>
<li><p><strong>Movimiento dinámico de datos</strong>: A medida que cambian los patrones de uso, los datos migran automáticamente entre niveles.</p></li>
<li><p><strong>Recuperación transparente</strong>: Cuando las consultas afectan a datos fríos, éstos se cargan automáticamente bajo demanda.</p></li>
</ul>
<p>El resultado es una reducción de hasta el 50% en los costes de almacenamiento, al tiempo que se mantiene el rendimiento de las consultas para los datos activos.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Optimizaciones de costes adicionales</h3><p>Milvus 2.6 también introduce soporte de vectores Int8 para índices HNSW, formato Storage v2 para una estructura optimizada que reduce los requisitos de IOPS y memoria, y una instalación más sencilla directamente a través de gestores de paquetes APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Funciones de búsqueda avanzada: Más allá de la similitud vectorial básica<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda vectorial por sí sola no es suficiente para las aplicaciones modernas de IA. Los usuarios exigen la precisión de la recuperación de información tradicional combinada con la comprensión semántica de las incrustaciones vectoriales. Milvus 2.6 introduce un conjunto de funciones de búsqueda avanzada que cubren este vacío.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">Turbocharged BM25: Búsqueda de texto completo 400% más rápida que Elasticsearch</h3><p>La<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">búsqueda de texto completo</a> se ha vuelto esencial para construir sistemas híbridos de recuperación en bases de datos vectoriales. En Milvus 2.6, se han introducido mejoras significativas en el rendimiento de la búsqueda de texto completo, a partir de la implementación de BM25 introducida desde la versión 2.5. Por ejemplo, esta versión introduce nuevos parámetros como <code translate="no">drop_ratio_search</code> y <code translate="no">dim_max_score_ratio</code>, que mejoran la precisión y la velocidad y ofrecen controles de búsqueda más precisos.</p>
<p>Nuestras pruebas comparativas con el conjunto de datos BEIR, estándar del sector, muestran que Milvus 2.6 consigue un rendimiento entre 3 y 4 veces superior al de Elasticsearch con índices de recuperación equivalentes. Para cargas de trabajo específicas, la mejora alcanza 7 veces más QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">Índice de rutas JSON: Filtrado 100 veces más rápido</h3><p>Milvus ha soportado el tipo de datos JSON durante mucho tiempo, pero el filtrado en campos JSON era lento debido a la falta de soporte de índices. Milvus 2.6 añade soporte para el índice de ruta JSON para aumentar el rendimiento de forma significativa.</p>
<p>Consideremos una base de datos de perfiles de usuario en la que cada registro contiene metadatos anidados como:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Para una búsqueda semántica "usuarios interesados en IA" con alcance sólo a San Francisco, Milvus solía analizar y evaluar todo el objeto JSON para cada registro, lo que hacía que la consulta fuera muy cara y lenta.</p>
<p>Ahora, Milvus le permite crear índices en rutas específicas dentro de los campos JSON para acelerar la búsqueda:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>En nuestras pruebas de rendimiento con más de 100M de registros, JSON Path Index redujo la latencia del filtro de <strong>140ms</strong> (P99: 480ms) a sólo <strong>1,5ms</strong> (P99: 10ms)- una reducción de latencia del 99% que hace que estas búsquedas sean prácticas en producción.</p>
<p>Esta característica es especialmente valiosa para:</p>
<ul>
<li><p>Sistemas de recomendación con filtrado complejo de atributos de usuario</p></li>
<li><p>aplicaciones RAG que filtran documentos por metadatos</p></li>
<li><p>Sistemas multiusuario en los que la segmentación de datos es fundamental.</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Procesamiento de texto mejorado y búsqueda consciente del tiempo</h3><p>Milvus 2.6 introduce un proceso de análisis de texto completamente renovado con un sofisticado manejo de idiomas, incluyendo el tokenizador Lindera para japonés y coreano, el tokenizador ICU para un soporte multilingüe completo y Jieba mejorado con integración de diccionario personalizado.</p>
<p><strong>La inteligencia de concordancia de frases</strong> capta el matiz semántico en el orden de las palabras, distinguiendo entre &quot;técnicas de aprendizaje automático&quot; y &quot;técnicas de aprendizaje automático&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Las funciones de decaimiento en función del tiempo</strong> priorizan automáticamente los contenidos nuevos ajustando las puntuaciones de relevancia en función de la antigüedad del documento, con tasas de decaimiento y tipos de función configurables (exponencial, gaussiana o lineal).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Búsqueda optimizada: Experiencia de entrada y salida de datos</h3><p>La desconexión entre los datos brutos y las incrustaciones vectoriales es otro punto problemático para los desarrolladores que utilizan bases de datos vectoriales. Antes de que los datos lleguen a Milvus para su indexación y búsqueda vectorial, a menudo se someten a un preprocesamiento mediante modelos externos que convierten el texto en bruto, las imágenes o el audio en representaciones vectoriales. Tras la recuperación, también es necesario un procesamiento posterior adicional, como la asignación de los ID de resultados al contenido original.</p>
<p>Milvus 2.6 simplifica estos flujos de trabajo de incrustación con la nueva interfaz <strong>Function</strong> que integra modelos de incrustación de terceros directamente en su canal de búsqueda. En lugar de precalcular las incrustaciones, ahora puede:</p>
<ol>
<li><p><strong>Insertar datos sin procesar directamente</strong>: Enviar texto, imágenes u otros contenidos a Milvus.</p></li>
<li><p><strong>Configurar proveedores de incrustación</strong>: Conectarse a los servicios API de incrustación de OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face, etc.</p></li>
<li><p><strong>Consulta mediante lenguaje natural</strong>: Realice búsquedas utilizando directamente consultas de texto sin formato.</p></li>
</ol>
<p>Esto crea una experiencia "Data-In, Data-Out" en la que Milvus agiliza todas las transformaciones vectoriales entre bastidores por usted.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Evolución arquitectónica: Escalado a decenas de miles de millones de vectores<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduce innovaciones arquitectónicas fundamentales que permiten un escalado rentable a decenas de miles de millones de vectores.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Sustitución de Kafka y Pulsar por un nuevo Woodpecker WAL</h3><p>Los despliegues anteriores de Milvus se basaban en colas de mensajes externas, como Kafka o Pulsar, como sistema de registro de escritura en cabeza (WAL). Aunque estos sistemas funcionaban bien al principio, introducían una complejidad operativa y una sobrecarga de recursos significativas.</p>
<p>Milvus 2.6 introduce <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a>, un sistema WAL nativo de la nube y creado específicamente que elimina estas dependencias externas mediante un revolucionario diseño de disco cero:</p>
<ul>
<li><p><strong>Todo en almacenamiento de objetos</strong>: Todos los datos de registro se guardan en almacenamiento de objetos como S3, Google Cloud Storage o MinIO.</p></li>
<li><p><strong>Metadatos distribuidos</strong>: Los metadatos siguen siendo gestionados por el almacén de valores clave etcd</p></li>
<li><p><strong>Sin dependencias de disco local</strong>: Una opción para eliminar la arquitectura compleja y la sobrecarga operativa que implica el estado permanente local distribuido.</p></li>
</ul>
<p>Hemos realizado pruebas comparativas exhaustivas del rendimiento de Woodpecker:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Rendimiento</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latencia</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker alcanza sistemáticamente el 60-80% del rendimiento máximo teórico para cada backend de almacenamiento, con el modo de sistema de archivos local alcanzando 450 MB/s -3,5 veces más rápido que Kafka- y el modo S3 alcanzando 750 MB/s, 5,8 veces más que Kafka.</p>
<p>Para obtener más información sobre Woodpecker, consulte este blog: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Frescura de búsqueda conseguida de forma económica</h3><p>La búsqueda de misión crítica suele requerir que los datos recién ingestados se puedan buscar al instante. Milvus 2.6 sustituye la dependencia de las colas de mensajes para mejorar fundamentalmente la gestión de las actualizaciones recientes y proporcionar frescura de búsqueda con una menor sobrecarga de recursos. La nueva arquitectura añade el nuevo <strong>Streaming N</strong>ode, un componente dedicado que trabaja en estrecha coordinación con otros componentes de Milvus como el Query Node y el Data Node. Streaming Node está construido sobre Woodpecker, nuestro sistema de registro de escritura en cabeza (WAL) ligero y nativo de la nube.</p>
<p>Este nuevo componente permite:</p>
<ul>
<li><p><strong>Gran compatibilidad</strong>: Funciona tanto con el nuevo Woodpecker WAL como con Kafka, Pulsar y otras plataformas de streaming.</p></li>
<li><p><strong>Indexación incremental</strong>: Los nuevos datos se pueden consultar inmediatamente, sin retrasos por lotes</p></li>
<li><p><strong>Servicio continuo de consultas</strong>: Ingesta simultánea de alto rendimiento y consultas de baja latencia.</p></li>
</ul>
<p>Al aislar el flujo del procesamiento por lotes, Streaming Node ayuda a Milvus a mantener un rendimiento estable y la frescura de las búsquedas incluso durante la ingestión de grandes volúmenes de datos. Está diseñado teniendo en cuenta la escalabilidad horizontal, escalando dinámicamente la capacidad del nodo en función del rendimiento de los datos.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Capacidad multi-tenancy mejorada: Escalado a 100.000 colecciones por clúster</h3><p>Los despliegues empresariales a menudo requieren aislamiento a nivel de inquilino. Milvus 2.6 aumenta drásticamente el soporte multi-tenancy al permitir hasta <strong>100.000 colecciones</strong> por clúster. Se trata de una mejora crucial para las organizaciones que ejecutan un clúster monolítico de gran tamaño que da servicio a muchos inquilinos.</p>
<p>Esta mejora es posible gracias a numerosas optimizaciones de ingeniería en la gestión de metadatos, la asignación de recursos y la planificación de consultas. Los usuarios de Milvus pueden disfrutar ahora de un rendimiento estable incluso con decenas de miles de colecciones.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Otras mejoras</h3><p>Milvus 2.6 ofrece más mejoras de arquitectura, como CDC + BulkInsert para una replicación de datos simplificada entre regiones geográficas y Coord Merge para una mejor coordinación de clústeres en despliegues a gran escala.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Primeros pasos con Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 representa un enorme esfuerzo de ingeniería con docenas de nuevas características y optimizaciones de rendimiento, desarrolladas en colaboración por los ingenieros de Zilliz y los increíbles colaboradores de nuestra comunidad. Aunque hemos cubierto las características principales aquí, hay más por descubrir. Le recomendamos encarecidamente que consulte nuestras completas <a href="https://milvus.io/docs/release_notes.md">notas de la</a> versión para descubrir todo lo que esta versión puede ofrecerle.</p>
<p>La documentación completa, las guías de migración y los tutoriales están disponibles en el<a href="https://milvus.io/"> sitio web de Milvus</a>. Si tiene alguna pregunta o necesita ayuda de la comunidad, únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
