---
id: what-is-vector-database-and-how-it-works.md
title: ¿Qué es exactamente una base de datos vectorial y cómo funciona?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Una base de datos vectorial almacena, indexa y busca incrustaciones
  vectoriales generadas por modelos de aprendizaje automático para una
  recuperación rápida de información y búsqueda de similitud.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>Una base de datos vectorial indexa y almacena incrustaciones vectoriales para recuperación rápida y búsqueda de similitud, con capacidades como operaciones CRUD, filtrado por metadatos y escalado horizontal diseñadas específicamente para aplicaciones de IA.</p>
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
    </button></h2><p>En los primeros días de ImageNet, se necesitaron 25,000 curadores humanos para etiquetar manualmente el dataset. Este asombroso número resalta un desafío fundamental en la IA: categorizar manualmente datos no estructurados simplemente no escala. Con miles de millones de imágenes, videos, documentos y archivos de audio generados diariamente, se necesitaba un cambio de paradigma en cómo las computadoras entienden e interactúan con el contenido.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">Los sistemas de bases de datos relacionales</a> tradicionales sobresalen en la gestión de datos estructurados con formatos predefinidos y la ejecución de operaciones de búsqueda precisas. En contraste, las bases de datos vectoriales se especializan en almacenar y recuperar <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a>, como imágenes, audio, videos y contenido textual, mediante representaciones numéricas de alta dimensionalidad conocidas como incrustaciones vectoriales. Las bases de datos vectoriales brindan soporte a los <a href="https://zilliz.com/glossary/large-language-models-(llms)">grandes modelos de lenguaje</a> al proporcionar recuperación y gestión eficiente de datos. Las bases de datos vectoriales modernas superan a los sistemas tradicionales entre 2 y 10 veces mediante optimización consciente del hardware (AVX512, SIMD, GPUs, SSD NVMe), algoritmos de búsqueda altamente optimizados (HNSW, IVF, DiskANN) y un diseño de almacenamiento orientado a columnas. Su arquitectura cloud-native y desacoplada permite escalar de forma independiente los componentes de búsqueda, inserción de datos e indexación, lo que permite a los sistemas manejar eficientemente miles de millones de vectores mientras mantienen el rendimiento para aplicaciones empresariales de IA en empresas como Salesforce, PayPal, eBay y NVIDIA.</p>
<p>Esto representa lo que los expertos llaman una "brecha semántica": las bases de datos tradicionales operan con coincidencias exactas y relaciones predefinidas, mientras que la comprensión humana del contenido es matizada, contextual y multidimensional. Esta brecha se vuelve cada vez más problemática a medida que las aplicaciones de IA exigen:</p>
<ul>
<li><p>Encontrar similitudes conceptuales en lugar de coincidencias exactas</p></li>
<li><p>Comprender relaciones contextuales entre diferentes piezas de contenido</p></li>
<li><p>Capturar la esencia semántica de la información más allá de las palabras clave</p></li>
<li><p>Procesar datos multimodales dentro de un marco unificado</p></li>
</ul>
<p>Las bases de datos vectoriales han surgido como la tecnología crítica para cerrar esta brecha, convirtiéndose en un componente esencial de la infraestructura moderna de IA. Mejoran el rendimiento de los modelos de aprendizaje automático al facilitar tareas como la agrupación y la clasificación.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Comprendiendo las incrustaciones vectoriales: Los fundamentos<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Las <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones vectoriales</a> sirven como el puente crítico a través de la brecha semántica. Estas representaciones numéricas de alta dimensionalidad capturan la esencia semántica de los datos no estructurados en una forma que las computadoras pueden procesar eficientemente. Los modelos de incrustación modernos transforman el contenido bruto —ya sea texto, imágenes o audio— en vectores densos donde conceptos similares se agrupan en el espacio vectorial, independientemente de las diferencias superficiales.</p>
<p>Por ejemplo, unas incrustaciones correctamente construidas posicionarían conceptos como "automóvil", "auto" y "vehículo" en proximidad dentro del espacio vectorial, a pesar de tener formas léxicas diferentes. Esta propiedad permite la <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a>, los <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemas de recomendación</a> y las aplicaciones de IA para comprender contenido más allá del simple coincidencia de patrones.</p>
<p>El poder de las incrustaciones se extiende a través de las modalidades. Las bases de datos vectoriales avanzadas admiten varios tipos de datos no estructurados —texto, imágenes, audio— en un sistema unificado, lo que permite búsquedas y relaciones entre modalidades que antes eran imposibles de modelar eficientemente. Estas capacidades de las bases de datos vectoriales son cruciales para tecnologías impulsadas por IA, como los chatbots y los sistemas de reconocimiento de imágenes, que respaldan aplicaciones avanzadas como la búsqueda semántica y los sistemas de recomendación.</p>
<p>Sin embargo, almacenar, indexar y recuperar incrustaciones a escala presenta desafíos computacionales únicos que las bases de datos tradicionales no fueron diseñadas para abordar.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Bases de datos vectoriales: Conceptos fundamentales<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales representan un cambio de paradigma en cómo almacenamos y consultamos datos no estructurados. A diferencia de los sistemas de bases de datos relacionales tradicionales que sobresalen en la gestión de datos estructurados con formatos predefinidos, las bases de datos vectoriales se especializan en manejar datos no estructurados mediante representaciones vectoriales numéricas.</p>
<p>En su núcleo, las bases de datos vectoriales están diseñadas para resolver un problema fundamental: permitir búsquedas de similitud eficientes en conjuntos masivos de datos no estructurados. Logran esto a través de tres componentes clave:</p>
<p><strong>Incrustaciones vectoriales</strong>: Representaciones numéricas de alta dimensionalidad que capturan el significado semántico de datos no estructurados (texto, imágenes, audio, etc.)</p>
<p><strong>Indexación especializada</strong>: Algoritmos optimizados para espacios vectoriales de alta dimensionalidad que permiten búsquedas aproximadas rápidas. La base de datos vectorial indexa vectores para mejorar la velocidad y eficiencia de las búsquedas de similitud, utilizando diversos algoritmos de aprendizaje automático para crear índices sobre incrustaciones vectoriales.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Métricas de distancia</strong></a>: Funciones matemáticas que cuantifican la similitud entre vectores</p>
<p>La operación principal en una base de datos vectorial es la consulta de <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-vecinos más cercanos</a> (KNN), que encuentra los k vectores más similares a un vector de consulta dado. Para aplicaciones a gran escala, estas bases de datos típicamente implementan algoritmos de <a href="https://zilliz.com/glossary/anns">vecino más cercano aproximado</a> (ANN), intercambiando una pequeña cantidad de precisión por ganancias significativas en velocidad de búsqueda.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fundamentos matemáticos de la similitud vectorial</h3><p>Comprender las bases de datos vectoriales requiere dominar los principios matemáticos detrás de la similitud vectorial. Estos son los conceptos fundamentales:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Espacios vectoriales e incrustaciones</h3><p>Una <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">incrustación vectorial</a> es un arreglo de longitud fija de números de punto flotante (¡pueden variar de 100 a 32,768 dimensiones!) que representa datos no estructurados en un formato numérico. Estas incrustaciones posicionan elementos similares más cerca entre sí en un espacio vectorial de alta dimensionalidad.</p>
<p>Por ejemplo, las palabras "rey" y "reina" tendrían representaciones vectoriales más cercanas entre sí que cualquiera de ellas con "automóvil" en un espacio de incrustaciones de palabras bien entrenado.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Métricas de distancia</h3><p>La elección de la métrica de distancia afecta fundamentalmente cómo se calcula la similitud. Las métricas de distancia comunes incluyen:</p>
<ol>
<li><p><strong>Distancia euclidiana</strong>: La distancia en línea recta entre dos puntos en el espacio euclidiano.</p></li>
<li><p><strong>Similitud del coseno</strong>: Mide el coseno del ángulo entre dos vectores, centrándose en la orientación más que en la magnitud</p></li>
<li><p><strong>Producto punto</strong>: Para vectores normalizados, representa qué tan alineados están dos vectores.</p></li>
<li><p><strong>Distancia de Manhattan (Norma L1)</strong>: Suma de las diferencias absolutas entre coordenadas.</p></li>
</ol>
<p>Diferentes casos de uso pueden requerir diferentes métricas de distancia. Por ejemplo, la similitud del coseno suele funcionar bien para incrustaciones de texto, mientras que la distancia euclidiana puede ser más adecuada para ciertos tipos de <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">incrustaciones de imágenes</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Similitud semántica</a> entre vectores en un espacio vectorial</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>Similitud semántica entre vectores en un espacio vectorial</span>
  </span>
</p>
<p>Comprender estos fundamentos matemáticos lleva a una pregunta importante sobre la implementación: Entonces, ¿solo agregamos un índice vectorial a cualquier base de datos, verdad?</p>
<p>Simplemente agregar un índice vectorial a una base de datos relacional no es suficiente, ni tampoco usar una <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de índices vectoriales</a> independiente. Si bien los índices vectoriales proporcionan la capacidad crítica de encontrar vectores similares de manera eficiente, carecen de la infraestructura necesaria para aplicaciones de producción:</p>
<ul>
<li><p>No
