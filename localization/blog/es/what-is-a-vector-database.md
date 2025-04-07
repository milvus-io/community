---
id: what-is-vector-database-and-how-it-works.md
title: ¿Qué es exactamente una base de datos vectorial y cómo funciona?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Una base de datos vectorial almacena, indexa y busca incrustaciones
  vectoriales generadas por modelos de aprendizaje automático para una rápida
  recuperación de la información y búsqueda de similitudes.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Una base de datos vectorial indexa y almacena incrustaciones vectoriales para una rápida recuperación y búsqueda de similitudes, con capacidades como operaciones CRUD, filtrado de metadatos y escalado horizontal diseñado específicamente para aplicaciones de IA.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introducción: El auge de las bases de datos vectoriales en la era de la IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>En los primeros días de ImageNet, se necesitaron 25.000 conservadores humanos para etiquetar manualmente el conjunto de datos. Esta asombrosa cifra pone de manifiesto un reto fundamental en la IA: la categorización manual de datos no estructurados simplemente no es escalable. Con los miles de millones de imágenes, vídeos, documentos y archivos de audio que se generan a diario, era necesario un cambio de paradigma en la forma en que los ordenadores entienden los contenidos e interactúan con ellos.</p>
<p>Los sistemas<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">tradicionales de bases de datos relacionales</a> destacan en la gestión de datos estructurados con formatos predefinidos y en la ejecución de operaciones de búsqueda precisas. En cambio, las bases de datos vectoriales se especializan en almacenar y recuperar tipos de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados </a>, como imágenes, audio, vídeos y contenidos textuales, a través de representaciones numéricas de alta dimensión conocidas como incrustaciones vectoriales. Las bases de datos vectoriales soportan <a href="https://zilliz.com/glossary/large-language-models-(llms)">grandes modelos lingüísticos</a> al proporcionar una recuperación y gestión de datos eficientes. Las bases de datos vectoriales modernas superan a los sistemas tradicionales entre 2 y 10 veces gracias a la optimización en función del hardware (AVX512, SIMD, GPU, SSD NVMe), los algoritmos de búsqueda altamente optimizados (HNSW, IVF, DiskANN) y el diseño de almacenamiento orientado a columnas. Su arquitectura desacoplada y nativa de la nube permite escalar de forma independiente los componentes de búsqueda, inserción de datos e indexación, lo que permite a los sistemas manejar de forma eficiente miles de millones de vectores manteniendo el rendimiento de las aplicaciones de IA empresariales en compañías como Salesforce, PayPal, eBay y NVIDIA.</p>
<p>Esto representa lo que los expertos denominan una "brecha semántica": las bases de datos tradicionales funcionan con coincidencias exactas y relaciones predefinidas, mientras que la comprensión humana del contenido es matizada, contextual y multidimensional. Esta brecha se hace cada vez más problemática a medida que lo exigen las aplicaciones de IA:</p>
<ul>
<li><p>Encontrar similitudes conceptuales en lugar de coincidencias exactas</p></li>
<li><p>Comprender las relaciones contextuales entre distintos contenidos.</p></li>
<li><p>captar la esencia semántica de la información más allá de las palabras clave</p></li>
<li><p>Procesar datos multimodales en un marco unificado.</p></li>
</ul>
<p>Las bases de datos vectoriales han surgido como la tecnología crítica para salvar esta brecha, convirtiéndose en un componente esencial de la infraestructura moderna de la IA. Mejoran el rendimiento de los modelos de aprendizaje automático facilitando tareas como la agrupación y la clasificación.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Comprender las incrustaciones vectoriales: La base<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Las inc</a> rustaciones vectoriales sirven de puente fundamental para salvar la brecha semántica. Estas representaciones numéricas de alta dimensionalidad capturan la esencia semántica de los datos no estructurados en un formato que los ordenadores pueden procesar con eficacia. Los modelos modernos de incrustación transforman el contenido en bruto -ya sea texto, imágenes o audio- en vectores densos en los que conceptos similares se agrupan en el espacio vectorial, independientemente de las diferencias superficiales.</p>
<p>Por ejemplo, una incrustación bien construida colocaría conceptos como "automóvil", "coche" y "vehículo" en proximidad dentro del espacio vectorial, a pesar de tener formas léxicas diferentes. Esta propiedad permite que <a href="https://zilliz.com/glossary/semantic-search">la búsqueda semántica</a>, los <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemas de recomendación</a> y las aplicaciones de IA comprendan el contenido más allá de la simple coincidencia de patrones.</p>
<p>El poder de las incrustaciones se extiende a todas las modalidades. Las bases de datos vectoriales avanzadas admiten varios tipos de datos no estructurados -texto, imágenes, audio- en un sistema unificado, lo que permite realizar búsquedas y relaciones intermodales que antes eran imposibles de modelar con eficacia. Estas capacidades de las bases de datos vectoriales son cruciales para las tecnologías impulsadas por la IA, como los chatbots y los sistemas de reconocimiento de imágenes, ya que admiten aplicaciones avanzadas como la búsqueda semántica y los sistemas de recomendación.</p>
<p>Sin embargo, almacenar, indexar y recuperar incrustaciones a escala presenta retos computacionales únicos para los que las bases de datos tradicionales no fueron creadas.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bases de datos vectoriales: Conceptos básicos<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales representan un cambio de paradigma en la forma de almacenar y consultar datos no estructurados. A diferencia de los sistemas de bases de datos relacionales tradicionales, que destacan en la gestión de datos estructurados con formatos predefinidos, las bases de datos vectoriales se especializan en la gestión de datos no estructurados mediante representaciones vectoriales numéricas.</p>
<p>En esencia, las bases de datos vectoriales están diseñadas para resolver un problema fundamental: permitir búsquedas eficientes de similitudes en conjuntos masivos de datos no estructurados. Para ello, cuentan con tres componentes clave:</p>
<p><strong>Incrustaciones vectoriales</strong>: Representaciones numéricas de alta dimensión que captan el significado semántico de los datos no estructurados (texto, imágenes, audio, etc.).</p>
<p><strong>Indexación especializada</strong>: Algoritmos optimizados para espacios vectoriales de alta dimensión que permiten búsquedas aproximadas rápidas. La base de datos vectorial indexa vectores para mejorar la velocidad y la eficacia de las búsquedas de similitud, utilizando varios algoritmos de ML para crear índices sobre incrustaciones vectoriales.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Métricas de distancia</strong></a>: Funciones matemáticas que cuantifican la similitud entre vectores.</p>
<p>La principal operación de una base de datos vectorial es la consulta <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-vecinos más cercanos</a> (KNN), que encuentra los k vectores más similares a un vector de consulta dado. Para aplicaciones a gran escala, estas bases de datos suelen utilizar algoritmos <a href="https://zilliz.com/glossary/anns">de aproximación al vecino más</a> próximo (RNA), que permiten reducir la precisión a cambio de un aumento significativo de la velocidad de búsqueda.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fundamentos matemáticos de la similitud vectorial</h3><p>Para entender las bases de datos vectoriales es necesario comprender los principios matemáticos que subyacen a la similitud vectorial. He aquí los conceptos fundamentales:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espacios vectoriales e incrustaciones</h3><p>Una <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">incrustación v</a> ectorial es una matriz de longitud fija de números en coma flotante (¡pueden tener entre 100 y 32.768 dimensiones!) que representa datos no estructurados en un formato numérico. Estas incrustaciones acercan elementos similares en un espacio vectorial de alta dimensión.</p>
<p>Por ejemplo, las palabras "rey" y "reina" tendrían representaciones vectoriales más cercanas entre sí que "automóvil" en un espacio de incrustación de palabras bien entrenado.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métricas de distancia</h3><p>La elección de la métrica de distancia afecta fundamentalmente al cálculo de la similitud. Las métricas de distancia más comunes son</p>
<ol>
<li><p><strong>Distancia euclidiana</strong>: La distancia en línea recta entre dos puntos en el espacio euclídeo.</p></li>
<li><p><strong>Similitud coseno</strong>: Mide el coseno del ángulo entre dos vectores, centrándose en la orientación más que en la magnitud.</p></li>
<li><p><strong>Producto de puntos</strong>: Para vectores normalizados, representa el grado de alineación de dos vectores.</p></li>
<li><p><strong>Distancia Manhattan (Norma L1)</strong>: Suma de las diferencias absolutas entre coordenadas.</p></li>
</ol>
<p>Diferentes casos de uso pueden requerir diferentes métricas de distancia. Por ejemplo, la similitud coseno suele funcionar bien para incrustaciones de texto, mientras que la distancia euclídea puede ser más adecuada para determinados tipos de <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">incrustación de imágenes</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Similitud semántica</a> entre vectores en un espacio vectorial</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>Similitud semántica entre vectores en un espacio vectorial</span> </span></p>
<p>Entender estos fundamentos matemáticos nos lleva a una cuestión importante sobre la aplicación: Basta con añadir un índice vectorial a cualquier base de datos, ¿verdad?</p>
<p>No basta con añadir un índice vectorial a una base de datos relacional, como tampoco lo es utilizar una <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de índices vectoriales</a> independiente. Aunque los índices vectoriales proporcionan la capacidad crítica de encontrar vectores similares de forma eficiente, carecen de la infraestructura necesaria para las aplicaciones de producción:</p>
<ul>
<li><p>No proporcionan operaciones CRUD para gestionar datos vectoriales.</p></li>
<li><p>Carecen de capacidades de almacenamiento y filtrado de metadatos.</p></li>
<li><p>No ofrecen escalado, replicación ni tolerancia a fallos integrados.</p></li>
<li><p>Requieren una infraestructura personalizada para la gestión y persistencia de los datos.</p></li>
</ul>
<p>Las bases de datos vectoriales surgieron para abordar estas limitaciones, proporcionando capacidades completas de gestión de datos diseñadas específicamente para incrustaciones vectoriales. Combinan la potencia semántica de la búsqueda vectorial con las capacidades operativas de los sistemas de bases de datos.</p>
<p>A diferencia de las bases de datos tradicionales, que operan a partir de coincidencias exactas, las bases de datos vectoriales se centran en la búsqueda semántica, es decir, en encontrar los vectores "más similares" a un vector de consulta según una métrica de distancia específica. Esta diferencia fundamental impulsa la arquitectura y los algoritmos exclusivos de estos sistemas especializados.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">Arquitectura de bases de datos vectoriales: Marco técnico<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales modernas implementan una sofisticada arquitectura multicapa que separa las preocupaciones, permite la escalabilidad y garantiza la facilidad de mantenimiento. Este marco técnico va mucho más allá de los simples índices de búsqueda para crear sistemas capaces de gestionar cargas de trabajo de IA en producción. Las bases de datos vectoriales trabajan procesando y recuperando información para aplicaciones de IA y ML, utilizando algoritmos para búsquedas aproximadas de vecinos más cercanos, convirtiendo varios tipos de datos brutos en vectores y gestionando eficientemente diversos tipos de datos mediante búsquedas semánticas.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">Arquitectura de cuatro niveles</h3><p>Una base de datos vectorial de producción suele constar de cuatro capas arquitectónicas principales:</p>
<ol>
<li><p><strong>Capa de almacenamiento</strong>: Gestiona el almacenamiento persistente de datos vectoriales y metadatos, implementa estrategias especializadas de codificación y compresión, y optimiza los patrones de E/S para el acceso específico a vectores.</p></li>
<li><p><strong>Capa</strong> de<strong>índice</strong>: Mantiene múltiples algoritmos de indexación, gestiona su creación y actualización e implementa optimizaciones específicas de hardware para mejorar el rendimiento.</p></li>
<li><p><strong>Capa de consulta</strong>: Procesa las consultas entrantes, determina las estrategias de ejecución, gestiona el procesamiento de los resultados e implementa el almacenamiento en caché para consultas repetidas.</p></li>
<li><p><strong>Capa de servicio</strong>: Gestiona las conexiones de los clientes, se encarga del enrutamiento de las solicitudes, proporciona supervisión y registro, e implementa la seguridad y el multi-tenancy.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">Flujo de trabajo de búsqueda vectorial</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>Flujo de trabajo completo de una operación de búsqueda vectorial.png</span> </span></p>
<p>Una implementación típica de base de datos vectorial sigue este flujo de trabajo:</p>
<ol>
<li><p>Un modelo de aprendizaje automático transforma los datos no estructurados (texto, imágenes, audio) en incrustaciones vectoriales.</p></li>
<li><p>Estas incrustaciones vectoriales se almacenan en la base de datos junto con los metadatos pertinentes.</p></li>
<li><p>Cuando un usuario realiza una consulta, ésta se convierte en una incrustación vectorial utilizando el <em>mismo</em> modelo.</p></li>
<li><p>La base de datos compara el vector consultado con los vectores almacenados mediante un algoritmo de aproximación al vecino más cercano.</p></li>
<li><p>El sistema devuelve los K resultados más relevantes en función de la similitud de los vectores.</p></li>
<li><p>El postprocesamiento opcional puede aplicar filtros adicionales o reordenación.</p></li>
</ol>
<p>Este proceso permite realizar búsquedas semánticas eficientes en colecciones masivas de datos no estructurados, lo que sería imposible con los métodos tradicionales de bases de datos.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">Consistencia en bases de datos vectoriales</h4><p>Garantizar la coherencia en las bases de datos vectoriales distribuidas es un reto debido al equilibrio entre rendimiento y corrección. Mientras que la consistencia eventual es habitual en los sistemas a gran escala, las aplicaciones críticas, como la detección de fraudes y las recomendaciones en tiempo real, requieren modelos de consistencia sólidos. Técnicas como las escrituras basadas en quórum y el consenso distribuido (por ejemplo, <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos) garantizan la integridad de los datos sin excesivas compensaciones de rendimiento.</p>
<p>Las implementaciones de producción adoptan una arquitectura de almacenamiento compartido con desagregación de almacenamiento y computación. Esta separación sigue el principio de desagregación del plano de datos y el plano de control, siendo cada capa escalable de forma independiente para una utilización óptima de los recursos.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">Gestión de conexiones, seguridad y multiarrendamiento</h3><p>Dado que estas bases de datos se utilizan en entornos multiusuario y multiarrendamiento, la seguridad de los datos y la gestión del control de acceso son fundamentales para mantener la confidencialidad.</p>
<p>Medidas de seguridad como el cifrado (tanto en reposo como en tránsito) protegen los datos sensibles, como las incrustaciones y los metadatos. La autenticación y la autorización garantizan que sólo los usuarios autorizados puedan acceder al sistema, con permisos detallados para gestionar el acceso a datos específicos.</p>
<p>El control de acceso define funciones y permisos para restringir el acceso a los datos. Esto es especialmente importante para las bases de datos que almacenan información confidencial, como datos de clientes o modelos de IA patentados.</p>
<p>La multitenencia implica aislar los datos de cada inquilino para evitar accesos no autorizados, al tiempo que permite compartir recursos. Esto se consigue mediante la fragmentación, la partición o la seguridad a nivel de fila para garantizar un acceso escalable y seguro para diferentes equipos o clientes.</p>
<p>Los sistemas externos de gestión de identidades y accesos (IAM) se integran con las bases de datos vectoriales para aplicar las políticas de seguridad y garantizar el cumplimiento de las normas del sector.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">Ventajas de las bases de datos vectoriales<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales ofrecen varias ventajas sobre las bases de datos tradicionales, lo que las convierte en la opción ideal para gestionar datos vectoriales. He aquí algunas de las principales ventajas:</p>
<ol>
<li><p><strong>Búsqueda eficiente por similitud</strong>: Una de las características más destacadas de las bases de datos vectoriales es su capacidad para realizar búsquedas semánticas eficientes. A diferencia de las bases de datos tradicionales, que se basan en coincidencias exactas, las bases de datos vectoriales destacan en la búsqueda de puntos de datos similares a un vector de consulta determinado. Esta capacidad es crucial para aplicaciones como los sistemas de recomendación, en los que encontrar elementos similares a las interacciones anteriores de un usuario puede mejorar significativamente su experiencia.</p></li>
<li><p><strong>Manejo de datos de alta dimensión</strong>: Las bases de datos vectoriales están diseñadas específicamente para gestionar de forma eficiente datos de alta dimensión. Esto las hace especialmente adecuadas para aplicaciones de procesamiento del lenguaje natural, <a href="https://zilliz.com/learn/what-is-computer-vision">visión por ordenador</a> y genómica, en las que los datos suelen existir en espacios de alta dimensión. Aprovechando algoritmos avanzados de indexación y búsqueda, las bases de datos vectoriales pueden recuperar rápidamente puntos de datos relevantes, incluso en conjuntos de datos complejos e incrustados en vectores.</p></li>
<li><p><strong>Escalabilidad</strong>: La escalabilidad es un requisito crítico para las aplicaciones modernas de IA, y las bases de datos vectoriales están construidas para escalar eficientemente. Tanto si se trata de millones como de miles de millones de vectores, las bases de datos vectoriales pueden hacer frente a las crecientes demandas de las aplicaciones de IA mediante el escalado horizontal. Esto garantiza que el rendimiento se mantenga constante incluso a medida que aumentan los volúmenes de datos.</p></li>
<li><p><strong>Flexibilidad</strong>: Las bases de datos vectoriales ofrecen una notable flexibilidad en términos de representación de datos. Pueden almacenar y gestionar diversos tipos de datos, como características numéricas, incrustaciones de texto o imágenes, e incluso datos complejos como estructuras moleculares. Esta versatilidad convierte a las bases de datos vectoriales en una potente herramienta para una amplia gama de aplicaciones, desde el análisis de textos a la investigación científica.</p></li>
<li><p><strong>Aplicaciones en tiempo real</strong>: Muchas bases de datos vectoriales están optimizadas para realizar consultas en tiempo real o casi real. Esto es especialmente importante para aplicaciones que requieren respuestas rápidas, como la detección de fraudes, las recomendaciones en tiempo real y los sistemas interactivos de IA. La capacidad de realizar búsquedas rápidas de similitudes garantiza que estas aplicaciones puedan ofrecer resultados oportunos y relevantes.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">Casos de uso de las bases de datos vectoriales<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales tienen una amplia gama de aplicaciones en diversos sectores, lo que demuestra su versatilidad y potencia. He aquí algunos casos de uso notables:</p>
<ol>
<li><p><strong>Procesamiento del lenguaje natural</strong>: En el ámbito del procesamiento del lenguaje natural (PLN), las bases de datos vectoriales desempeñan un papel crucial. Se utilizan para tareas como la clasificación de textos, el análisis de sentimientos y la traducción de idiomas. Al convertir el texto en incrustaciones vectoriales de alta dimensionalidad, las bases de datos vectoriales permiten búsquedas de similitudes y comprensión semántica eficaces, lo que mejora el rendimiento de los <a href="https://zilliz.com/learn/7-nlp-models">modelos de PLN</a>.</p></li>
<li><p><strong>Visión por ordenador</strong>: Las bases de datos vectoriales también se utilizan mucho en aplicaciones de visión por ordenador. Tareas como el reconocimiento de imágenes, la <a href="https://zilliz.com/learn/what-is-object-detection">detección de objetos</a> y la segmentación de imágenes se benefician de la capacidad de las bases de datos vectoriales para manejar incrustaciones de imágenes de alta dimensión. Esto permite una recuperación rápida y precisa de imágenes visualmente similares, lo que hace que las bases de datos vectoriales sean indispensables en campos como la conducción autónoma, las imágenes médicas y la gestión de activos digitales.</p></li>
<li><p><strong>Genómica</strong>: en genómica, las bases de datos vectoriales se utilizan para almacenar y analizar secuencias genéticas, estructuras de proteínas y otros datos moleculares. La naturaleza altamente dimensional de estos datos hace de las bases de datos vectoriales una opción ideal para gestionar y consultar grandes conjuntos de datos genómicos. Los investigadores pueden realizar búsquedas vectoriales para encontrar secuencias genéticas con patrones similares, lo que contribuye al descubrimiento de marcadores genéticos y a la comprensión de procesos biológicos complejos.</p></li>
<li><p><strong>Sistemas de recomendación</strong>: Las bases de datos vectoriales son la piedra angular de los modernos sistemas de recomendación. Al almacenar las interacciones del usuario y las características de los artículos como incrustaciones vectoriales, estas bases de datos pueden identificar rápidamente los artículos que son similares a aquellos con los que un usuario ha interactuado previamente. Esta capacidad aumenta la precisión y relevancia de las recomendaciones, mejorando la satisfacción y el compromiso del usuario.</p></li>
<li><p><strong>Chatbots y asistentes virtuales</strong>: Las bases de datos vectoriales se utilizan en chatbots y asistentes virtuales para proporcionar respuestas contextuales en tiempo real a las consultas de los usuarios. Al convertir las entradas del usuario en incrustaciones vectoriales, estos sistemas pueden realizar búsquedas de similitud para encontrar las respuestas más relevantes. Esto permite a los chatbots y asistentes virtuales ofrecer respuestas más precisas y adecuadas al contexto, mejorando la experiencia general del usuario.</p></li>
</ol>
<p>Al aprovechar las capacidades únicas de las bases de datos vectoriales, las organizaciones de diversos sectores pueden crear aplicaciones de IA más inteligentes, receptivas y escalables.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">Algoritmos de búsqueda vectorial: De la teoría a la práctica<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales requieren <a href="https://zilliz.com/learn/vector-index">algoritmos de</a> indexación especializados para permitir la búsqueda eficiente de similitudes en espacios de alta dimensión. La selección del algoritmo afecta directamente a la precisión, la velocidad, el uso de memoria y la escalabilidad.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">Enfoques basados en grafos</h3><p><strong>El</strong> algoritmo<strong>HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong> crea estructuras navegables mediante la conexión de vectores similares, lo que permite un recorrido eficiente durante la búsqueda. HNSW limita el número máximo de conexiones por nodo y el alcance de la búsqueda para equilibrar el rendimiento y la precisión, lo que lo convierte en uno de los algoritmos más utilizados para la búsqueda de similitud vectorial.</p>
<p><strong>Cagra</strong> es un índice basado en grafos optimizado específicamente para la aceleración en la GPU. Construye estructuras de grafos navegables que se alinean con los patrones de procesamiento de la GPU, lo que permite realizar comparaciones vectoriales masivamente paralelas. Lo que hace que Cagra sea especialmente eficaz es su capacidad para equilibrar memoria y rendimiento a través de parámetros configurables como el grado del grafo y la amplitud de la búsqueda. El uso de GPU de nivel de inferencia con Cagra puede resultar más rentable que el costoso hardware de nivel de entrenamiento y, al mismo tiempo, proporcionar un alto rendimiento, especialmente para colecciones de vectores a gran escala. Sin embargo, hay que tener en cuenta que los índices de GPU como Cagra no necesariamente reducen la latencia en comparación con los índices de CPU a menos que se trabaje bajo una gran presión de consulta.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">Técnicas de cuantificación</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>La cuantificación de productos (PQ</strong></a> ) descompone los vectores de alta dimensión en subvectores más pequeños, cuantificando cada uno por separado. Esto reduce significativamente las necesidades de almacenamiento (a menudo en más de un 90%), pero introduce cierta pérdida de precisión.</p>
<p><strong>La cuantificación escalar (SQ)</strong> convierte flotantes de 32 bits en enteros de 8 bits, lo que reduce el uso de memoria en un 75% con un impacto mínimo en la precisión.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">Indexación en disco: Escalado rentable</h3><p>Para colecciones de vectores a gran escala (más de 100 millones de vectores), los índices en memoria resultan prohibitivos. Por ejemplo, 100 millones de vectores de 1024 dimensiones requerirían aproximadamente 400 GB de RAM. Es aquí donde los algoritmos de indexación en disco, como DiskANN, ofrecen importantes ventajas económicas.</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, basado en el algoritmo de grafos Vamana, permite una búsqueda vectorial eficiente al tiempo que almacena la mayor parte del índice en unidades SSD NVMe en lugar de RAM. Este enfoque ofrece varias ventajas de costes:</p>
<ul>
<li><p><strong>Reducción de los costes de hardware</strong>: Las organizaciones pueden implementar la búsqueda vectorial a escala utilizando hardware básico con configuraciones de RAM modestas</p></li>
<li><p><strong>Menores gastos operativos</strong>: Menos RAM significa menor consumo de energía y costes de refrigeración en los centros de datos</p></li>
<li><p><strong>Escalado lineal de costes</strong>: Los costes de memoria aumentan linealmente con el volumen de datos, mientras que el rendimiento se mantiene relativamente estable.</p></li>
<li><p><strong>Patrones de E/S optimizados</strong>: El diseño especializado de DiskANN minimiza las lecturas en disco mediante cuidadosas estrategias de recorrido de gráficos.</p></li>
</ul>
<p>La contrapartida suele ser un modesto aumento de la latencia de consulta (a menudo sólo 2-3 ms) en comparación con los enfoques puramente en memoria, lo cual es aceptable para muchos casos de uso en producción.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">Tipos de índices especializados</h3><p><strong>Los índices de incrustación binaria</strong> están especializados en visión por ordenador, huellas dactilares de imágenes y sistemas de recomendación en los que los datos pueden representarse como características binarias. Estos índices responden a diferentes necesidades de aplicación. Para la deduplicación de imágenes, las marcas de agua digitales y la detección de derechos de autor, donde la coincidencia exacta es fundamental, los índices binarios optimizados proporcionan una detección precisa de similitudes. Para los sistemas de recomendación de alto rendimiento, la recuperación de imágenes basada en el contenido y la comparación de características a gran escala, en los que la velocidad es prioritaria frente a la recuperación perfecta, los índices binarios ofrecen ventajas de rendimiento excepcionales.</p>
<p><strong>Los índices de vectores dispersos</strong> están optimizados para vectores en los que la mayoría de los elementos son cero, con sólo unos pocos valores distintos de cero. A diferencia de los vectores densos (en los que la mayoría o todas las dimensiones contienen valores significativos), los vectores dispersos representan eficazmente datos con muchas dimensiones pero pocas características activas. Esta representación es especialmente común en el tratamiento de textos, donde un documento puede utilizar sólo un pequeño subconjunto de todas las palabras posibles de un vocabulario. Los índices de vectores dispersos destacan en tareas de procesamiento del lenguaje natural como la búsqueda semántica de documentos, las consultas de texto completo y el modelado de temas. Estos índices son especialmente valiosos para la búsqueda empresarial en grandes colecciones de documentos, la búsqueda de documentos jurídicos en los que es necesario localizar eficazmente términos y conceptos específicos, y las plataformas de investigación académica que indexan millones de documentos con terminología especializada.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">Funciones de consulta avanzadas<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>El núcleo de las bases de datos vectoriales es su capacidad para realizar búsquedas semánticas eficientes. Las capacidades de búsqueda vectorial abarcan desde la concordancia básica por similitud hasta técnicas avanzadas para mejorar la relevancia y la diversidad.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">Búsqueda RNA básica</h3><p>La búsqueda RNA es el método de búsqueda básico de las bases de datos vectoriales. A diferencia de la búsqueda exacta k-Nearest Neighbors (kNN), que compara un vector de consulta con todos los vectores de la base de datos, la búsqueda RNA utiliza estructuras de indexación para identificar rápidamente un subconjunto de vectores que probablemente sean los más similares, lo que mejora drásticamente el rendimiento.</p>
<p>Los componentes clave de la búsqueda RNA son</p>
<ul>
<li><p><strong>Vectores de consulta</strong>: La representación vectorial de lo que se busca.</p></li>
<li><p><strong>Estructuras de índice</strong>: Estructuras de datos preconstruidas que organizan los vectores para una recuperación eficaz.</p></li>
<li><p><strong>Tipos de métricas</strong>: Funciones matemáticas como la euclídea (L2), el coseno o el producto interior que miden la similitud entre vectores.</p></li>
<li><p><strong>Resultados Top-K</strong>: El número especificado de vectores más similares a devolver</p></li>
</ul>
<p>Las bases de datos vectoriales ofrecen optimizaciones para mejorar la eficiencia de la búsqueda:</p>
<ul>
<li><p><strong>Búsqueda vectorial masiva</strong>: Búsqueda con múltiples vectores de consulta en paralelo</p></li>
<li><p><strong>Búsqueda particionada</strong>: Limitación de la búsqueda a particiones de datos específicas</p></li>
<li><p><strong>Paginación</strong>: Uso de parámetros de límite y desplazamiento para recuperar grandes conjuntos de resultados</p></li>
<li><p><strong>Selección de campos de salida</strong>: Control de los campos de entidad que se devuelven con los resultados</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">Técnicas avanzadas de búsqueda</h3><h4 id="Range-Search" class="common-anchor-header">Búsqueda por rango</h4><p>La búsqueda por rango mejora la relevancia de los resultados al restringirlos a vectores con puntuaciones de similitud dentro de un rango específico. A diferencia de la búsqueda RNA estándar, que devuelve los K vectores más similares, la búsqueda por rango define una "región anular" mediante:</p>
<ul>
<li><p>un límite exterior (radio) que establece la distancia máxima permitida</p></li>
<li><p>Un límite interior (filtro_rango) que puede excluir vectores demasiado similares.</p></li>
</ul>
<p>Este enfoque es especialmente útil cuando se desea encontrar elementos "similares pero no idénticos", como recomendaciones de productos que están relacionados pero no son duplicados exactos de lo que un usuario ya ha visto.</p>
<h4 id="Filtered-Search" class="common-anchor-header">Búsqueda filtrada</h4><p>La búsqueda filtrada combina la similitud de vectores con restricciones de metadatos para limitar los resultados a los vectores que coinciden con criterios específicos. Por ejemplo, en un catálogo de productos, podría encontrar artículos visualmente similares pero restringir los resultados a una marca o rango de precios específicos.</p>
<p>Las bases de datos vectoriales Highly Scalable admiten dos enfoques de filtrado:</p>
<ul>
<li><p><strong>Filtrado estándar</strong>: Aplica filtros de metadatos antes de la búsqueda de vectores, lo que reduce significativamente el conjunto de candidatos.</p></li>
<li><p><strong>Filtrado iterativo</strong>: Primero se realiza la búsqueda vectorial y, a continuación, se aplican filtros a cada resultado hasta alcanzar el número deseado de coincidencias.</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">Comparación de textos</h4><p>La concordancia de texto permite recuperar documentos con precisión a partir de términos específicos, complementando la búsqueda vectorial por similitud con capacidades de concordancia exacta de texto. A diferencia de la búsqueda semántica, que encuentra contenidos conceptualmente similares, la concordancia de texto se centra en encontrar apariciones exactas de los términos de la consulta.</p>
<p>Por ejemplo, una búsqueda de productos podría combinar la concordancia de texto para encontrar productos que mencionen explícitamente "resistente al agua" con la similitud vectorial para encontrar productos visualmente similares, garantizando que se cumplen tanto los requisitos de relevancia semántica como los de características específicas.</p>
<h4 id="Grouping-Search" class="common-anchor-header">Búsqueda por agrupación</h4><p>La búsqueda agrupada agrega resultados por un campo específico para mejorar la diversidad de resultados. Por ejemplo, en una colección de documentos en la que cada párrafo es un vector independiente, la agrupación garantiza que los resultados procedan de documentos diferentes y no de varios párrafos del mismo documento.</p>
<p>Esta técnica es valiosa para:</p>
<ul>
<li><p>Sistemas de recuperación de documentos en los que se desea obtener representación de distintas fuentes.</p></li>
<li><p>Sistemas de recomendación que necesitan presentar diversas opciones</p></li>
<li><p>Sistemas de búsqueda en los que la diversidad de resultados es tan importante como la similitud.</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">Búsqueda híbrida</h4><p>La búsqueda híbrida combina resultados de múltiples campos vectoriales, cada uno de los cuales puede representar diferentes aspectos de los datos o utilizar diferentes modelos de incrustación. Esto permite:</p>
<ul>
<li><p><strong>Combinaciones de vectores dispersos y densos</strong>: Combinar la comprensión semántica (vectores densos) con la concordancia de palabras clave (vectores dispersos) para una búsqueda de texto más exhaustiva.</p></li>
<li><p><strong>Búsqueda multimodal</strong>: Búsqueda de coincidencias entre distintos tipos de datos, como la búsqueda de productos utilizando tanto imágenes como texto.</p></li>
</ul>
<p>Las búsquedas híbridas utilizan sofisticadas estrategias de reordenación para combinar los resultados:</p>
<ul>
<li><p><strong>Clasificación ponderada</strong>: Prioriza los resultados de campos vectoriales específicos</p></li>
<li><p><strong>Fusión de clasificación recíproca</strong>: Equilibra los resultados entre todos los campos vectoriales sin énfasis específico</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">Búsqueda de texto completo</h4><p>Las capacidades de búsqueda de texto completo de las bases de datos vectoriales modernas tienden un puente entre la búsqueda de texto tradicional y la similitud vectorial. Estos sistemas</p>
<ul>
<li><p>Convierten automáticamente las consultas de texto en bruto en incrustaciones dispersas.</p></li>
<li><p>Recuperan documentos que contienen términos o frases específicos</p></li>
<li><p>Clasifican los resultados en función de la relevancia de los términos y la similitud semántica.</p></li>
<li><p>Complementan la búsqueda vectorial detectando coincidencias exactas que la búsqueda semántica podría pasar por alto.</p></li>
</ul>
<p>Este enfoque híbrido es especialmente valioso para los sistemas de <a href="https://zilliz.com/learn/what-is-information-retrieval">recuperación de información</a> completos que necesitan tanto una correspondencia precisa de términos como una comprensión semántica.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">Ingeniería de rendimiento: Métricas importantes<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>La optimización del rendimiento de las bases de datos vectoriales requiere conocer las métricas clave y sus compensaciones.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">El equilibrio entre recuperación y rendimiento</h3><p>La recuperación mide la proporción de verdaderos vecinos más cercanos encontrados entre los resultados devueltos. Una mayor recuperación requiere una búsqueda más exhaustiva, lo que reduce el rendimiento (consultas por segundo). Los sistemas de producción equilibran estas métricas en función de los requisitos de la aplicación, con un objetivo de recuperación del 80-99% en función del caso de uso.</p>
<p>A la hora de evaluar el rendimiento de las bases de datos vectoriales, los entornos de evaluación comparativa estandarizados, como ANN-Benchmarks, proporcionan valiosos datos comparativos. Estas herramientas miden parámetros críticos como</p>
<ul>
<li><p>Recuperación de búsquedas: La proporción de consultas para las que se encuentran verdaderos vecinos más cercanos entre los resultados devueltos.</p></li>
<li><p>Consultas por segundo (QPS): La velocidad a la que la base de datos procesa las consultas en condiciones estandarizadas.</p></li>
<li><p>Rendimiento en diferentes tamaños y dimensiones de conjuntos de datos</p></li>
</ul>
<p>Una alternativa es un sistema de evaluación comparativa de código abierto llamado <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>. VectorDBBench es una <a href="https://github.com/zilliztech/VectorDBBench">herramienta de evaluación comparativa de código</a> abierto diseñada para evaluar y comparar el rendimiento de las principales bases de datos vectoriales, como Milvus y Zilliz Cloud, utilizando sus propios conjuntos de datos. También ayuda a los desarrolladores a elegir la base de datos vectorial más adecuada para sus casos de uso.</p>
<p>Estos puntos de referencia permiten a las organizaciones identificar la implementación de bases de datos vectoriales más adecuada para sus requisitos específicos, teniendo en cuenta el equilibrio entre precisión, velocidad y escalabilidad.</p>
<h3 id="Memory-Management" class="common-anchor-header">Gestión de la memoria</h3><p>Una gestión eficaz de la memoria permite a las bases de datos vectoriales escalar hasta miles de millones de vectores manteniendo el rendimiento:</p>
<ul>
<li><p><strong>La asignación dinámica</strong> ajusta el uso de la memoria en función de las características de la carga de trabajo.</p></li>
<li><p><strong>Las políticas de almacenamiento en caché</strong> retienen en memoria los vectores a los que se accede con más frecuencia.</p></li>
<li><p><strong>Las técnicas de compresión de vectores</strong> reducen significativamente los requisitos de memoria</p></li>
</ul>
<p>Para los conjuntos de datos que superan la capacidad de la memoria, las soluciones basadas en disco proporcionan una capacidad crucial. Estos algoritmos optimizan los patrones de E/S para las SSD NVMe mediante técnicas como la búsqueda de haces y la navegación basada en gráficos.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">Filtrado avanzado y búsqueda híbrida</h3><p>Las bases de datos vectoriales combinan la similitud semántica con el filtrado tradicional para crear potentes capacidades de consulta:</p>
<ul>
<li><p><strong>El prefiltrado</strong> aplica restricciones de metadatos antes de la búsqueda vectorial, reduciendo el conjunto de candidatos para la comparación de similitudes.</p></li>
<li><p><strong>El postfiltrado</strong> ejecuta primero la búsqueda vectorial y luego aplica filtros a los resultados.</p></li>
<li><p><strong>La indexación de metadatos</strong> mejora el rendimiento del filtrado mediante índices especializados para distintos tipos de datos.</p></li>
</ul>
<p>Las bases de datos vectoriales de alto rendimiento admiten patrones de consulta complejos que combinan múltiples campos vectoriales con restricciones escalares. Las consultas multivectoriales encuentran entidades similares a varios puntos de referencia simultáneamente, mientras que las consultas vectoriales negativas excluyen vectores similares a ejemplos especificados.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">Escalado de bases de datos vectoriales en producción<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales requieren estrategias de despliegue bien pensadas para garantizar un rendimiento óptimo a diferentes escalas:</p>
<ul>
<li><p>Los<strong>despliegues a pequeña escala</strong> (millones de vectores) pueden funcionar eficazmente en una sola máquina con suficiente memoria.</p></li>
<li><p>Los despliegues<strong>a mediana escala</strong> (de decenas a cientos de millones) se benefician del escalado vertical con instancias de alta memoria y almacenamiento SSD.</p></li>
<li><p>Los despliegues<strong>a escala de miles de millones</strong> requieren un escalado horizontal a través de múltiples nodos con funciones especializadas.</p></li>
</ul>
<p>La fragmentación y la replicación son la base de una arquitectura de base de datos vectorial escalable:</p>
<ul>
<li><p><strong>La fragmentación horizontal</strong> divide las colecciones en varios nodos.</p></li>
<li><p><strong>La replicación</strong> crea copias redundantes de los datos, mejorando tanto la tolerancia a fallos como el rendimiento de las consultas.</p></li>
</ul>
<p>Los sistemas modernos ajustan los factores de replicación de forma dinámica en función de los patrones de consulta y los requisitos de fiabilidad.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">Impacto en el mundo real<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>La flexibilidad de las bases de datos vectoriales de alto rendimiento queda patente en sus opciones de implantación. Los sistemas pueden funcionar en una amplia gama de entornos, desde instalaciones ligeras en ordenadores portátiles para la creación de prototipos hasta clústeres distribuidos masivos que gestionan decenas de miles de millones de vectores. Esta escalabilidad ha permitido a las organizaciones pasar del concepto a la producción sin cambiar de tecnología de bases de datos.</p>
<p>Empresas como Salesforce, PayPal, eBay, NVIDIA, IBM y Airbnb confían ahora en bases de datos vectoriales como <a href="https://milvus.io/">Milvus</a>, de código abierto, para impulsar aplicaciones de IA a gran escala. Estas implementaciones abarcan diversos casos de uso, desde sofisticados sistemas de recomendación de productos hasta moderación de contenidos, detección de fraudes y automatización de la atención al cliente, todos ellos basados en la búsqueda vectorial.</p>
<p>En los últimos años, las bases de datos vectoriales se han vuelto vitales para abordar los problemas de alucinación habituales en los LLM al proporcionar datos específicos del dominio, actualizados o confidenciales. Por ejemplo, <a href="https://zilliz.com/cloud">Zilliz Cloud</a> almacena datos especializados como incrustaciones vectoriales. Cuando un usuario formula una pregunta, transforma la consulta en vectores, realiza búsquedas RNA de los resultados más relevantes y los combina con la pregunta original para crear un contexto exhaustivo para los grandes modelos lingüísticos. Este marco sirve de base para desarrollar aplicaciones fiables basadas en LLM que produzcan respuestas más precisas y contextualmente relevantes.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>El auge de las bases de datos vectoriales representa algo más que una nueva tecnología: supone un cambio fundamental en la forma de abordar la gestión de datos para aplicaciones de IA. Al tender un puente entre los datos no estructurados y los sistemas computacionales, las bases de datos vectoriales se han convertido en un componente esencial de la infraestructura moderna de la IA, permitiendo aplicaciones que comprenden y procesan la información de forma cada vez más parecida a la humana.</p>
<p>Las principales ventajas de las bases de datos vectoriales frente a los sistemas de bases de datos tradicionales son las siguientes</p>
<ul>
<li><p>Búsqueda en alta dimensión: Búsquedas eficientes de similitudes en vectores de alta dimensión utilizados en aplicaciones de aprendizaje automático e IA generativa.</p></li>
<li><p>Escalabilidad: escalabilidad horizontal para un almacenamiento y recuperación eficientes de grandes colecciones de vectores.</p></li>
<li><p>Flexibilidad con búsqueda híbrida: Manejo de varios tipos de datos vectoriales, incluidos los vectores dispersos y densos</p></li>
<li><p>Rendimiento: Búsquedas de similitud vectorial significativamente más rápidas en comparación con las bases de datos tradicionales</p></li>
<li><p>Indexación personalizable: Compatibilidad con esquemas de indexación personalizados optimizados para casos de uso y tipos de datos específicos</p></li>
</ul>
<p>A medida que las aplicaciones de IA se vuelven más sofisticadas, las exigencias a las bases de datos vectoriales siguen evolucionando. Los sistemas modernos deben equilibrar el rendimiento, la precisión, la escalabilidad y la rentabilidad a la vez que se integran a la perfección con el ecosistema de IA más amplio. Para las organizaciones que buscan implementar la IA a escala, comprender la tecnología de bases de datos vectoriales no es solo una consideración técnica, sino un imperativo estratégico.</p>
