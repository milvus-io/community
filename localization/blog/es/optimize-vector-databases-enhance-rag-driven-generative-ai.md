---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: >-
  Optimizar las bases de datos vectoriales y mejorar la IA generativa basada en
  RAG
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  En este artículo, aprenderá más sobre las bases de datos vectoriales y sus
  marcos de evaluación comparativa, conjuntos de datos para abordar diferentes
  aspectos y las herramientas utilizadas para el análisis del rendimiento: todo
  lo que necesita para empezar a optimizar las bases de datos vectoriales.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Este post se publicó originalmente en <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">el canal Medium de Intel</a> y se vuelve a publicar aquí con permiso.</em></p>
<p><br></p>
<p>Dos métodos para optimizar tu base de datos vectorial cuando usas RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Foto de <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> en <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Por Cathy Zhang y la Dra. Malini Bhandaru Colaboradores: Lin Yang y Changyan Liu</p>
<p>Los modelos de IA generativa (GenAI), que se están adoptando de forma exponencial en nuestra vida cotidiana, se están mejorando mediante la <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">generación aumentada por recuperación (RAG)</a>, una técnica utilizada para mejorar la precisión y la fiabilidad de las respuestas mediante la obtención de datos de fuentes externas. La RAG ayuda a un <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">gran modelo lingüístico (LLM)</a> normal a comprender el contexto y reducir <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">las alucinaciones</a> aprovechando una gigantesca base de datos no estructurados almacenados como vectores, una presentación matemática que ayuda a captar el contexto y las relaciones entre los datos.</p>
<p>Las RAG ayudan a recuperar más información contextual y, por tanto, a generar mejores respuestas, pero las bases de datos vectoriales en las que se basan son cada vez más grandes para ofrecer contenidos ricos a los que recurrir. Así como los LLM de billones de parámetros están en el horizonte, las bases de datos vectoriales de miles de millones de vectores no se quedan atrás. Como ingenieros de optimización, teníamos curiosidad por ver si podíamos aumentar el rendimiento de las bases de datos vectoriales, cargar los datos más rápidamente y crear índices más rápidamente para garantizar la velocidad de recuperación incluso cuando se añaden nuevos datos. Esto no sólo reduciría el tiempo de espera de los usuarios, sino que también haría que las soluciones de IA basadas en RAG fueran un poco más sostenibles.</p>
<p>En este artículo, aprenderás más sobre las bases de datos vectoriales y sus marcos de evaluación comparativa, conjuntos de datos para abordar diferentes aspectos y las herramientas utilizadas para el análisis del rendimiento: todo lo que necesitas para empezar a optimizar las bases de datos vectoriales. También compartiremos nuestros logros de optimización en dos soluciones populares de bases de datos vectoriales para inspirarle en su viaje de optimización del rendimiento y el impacto de la sostenibilidad.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Bases de datos vectoriales<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>A diferencia de las bases de datos relacionales o no relacionales tradicionales, en las que los datos se almacenan de forma estructurada, una base de datos vectorial contiene una representación matemática de elementos de datos individuales, denominada vector, construida mediante una función de incrustación o transformación. El vector suele representar características o significados semánticos y puede ser corto o largo. Las bases de datos vectoriales realizan la recuperación de vectores mediante la búsqueda de similitudes utilizando una métrica de distancia (donde más cerca significa que los resultados son más similares) como <a href="https://www.pinecone.io/learn/vector-similarity/">la similitud euclidiana, del producto punto o del coseno</a>.</p>
<p>Para acelerar el proceso de recuperación, los datos vectoriales se organizan mediante un mecanismo de indexación. Algunos ejemplos de estos métodos de organización son las estructuras planas, el <a href="https://arxiv.org/abs/2002.09094">archivo invertido (IVF),</a> <a href="https://arxiv.org/abs/1603.09320">los mundos pequeños navegables jerárquicos (HNSW)</a> y <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">el hashing sensible a la localidad (LSH)</a>, entre otros. Cada uno de estos métodos contribuye a la eficiencia y eficacia de la recuperación de vectores similares cuando es necesario.</p>
<p>Examinemos cómo se utilizaría una base de datos de vectores en un sistema GenAI. La Figura 1 ilustra tanto la carga de datos en una base de datos de vectores como su utilización en el contexto de una aplicación GenAI. Cuando se introduce un indicador, éste se somete a un proceso de transformación idéntico al utilizado para generar vectores en la base de datos. Este vector transformado se utiliza entonces para recuperar vectores similares de la base de datos de vectores. Estos elementos recuperados sirven esencialmente como memoria conversacional, proporcionando un historial contextual para las instrucciones, de forma similar a como funcionan los LLM. Esta función resulta especialmente ventajosa en el procesamiento del lenguaje natural, la visión por ordenador, los sistemas de recomendación y otros ámbitos que requieren comprensión semántica y correspondencia de datos. Su pregunta inicial se "fusiona" posteriormente con los elementos recuperados, proporcionando contexto y ayudando al LLM a formular respuestas basadas en el contexto proporcionado, en lugar de depender únicamente de sus datos de entrenamiento originales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1. Arquitectura de la aplicación RAG. Arquitectura de una aplicación GAR.</p>
<p>Los vectores se almacenan e indexan para su rápida recuperación. Las bases de datos vectoriales son de dos tipos: bases de datos tradicionales que se han ampliado para almacenar vectores y bases de datos vectoriales específicas. Algunos ejemplos de bases de datos tradicionales que proporcionan soporte vectorial son <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> y <a href="https://opensearch.org/">OpenSearch</a>. Ejemplos de bases de datos vectoriales específicas son las soluciones propietarias <a href="https://zilliz.com/">Zilliz</a> y <a href="https://www.pinecone.io/">Pinecone</a>, y los proyectos de código abierto <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a> y <a href="https://www.trychroma.com/">Chroma</a>. Puedes obtener más información sobre bases de datos vectoriales en GitHub a través de <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>y <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>Examinaremos más detenidamente una de cada categoría, Milvus y Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Mejorar el rendimiento<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en las optimizaciones, repasemos cómo se evalúan las bases de datos vectoriales, algunos marcos de evaluación y las herramientas de análisis de rendimiento disponibles.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Métricas de rendimiento</h3><p>Echemos un vistazo a las métricas clave que pueden ayudarle a medir el rendimiento de las bases de datos vectoriales.</p>
<ul>
<li><strong>La latencia de carga</strong> mide el tiempo necesario para cargar datos en la memoria de la base de datos vectorial y crear un índice. Un índice es una estructura de datos utilizada para organizar y recuperar datos vectoriales de forma eficiente basándose en su similitud o distancia. Los tipos de <a href="https://milvus.io/docs/index.md#In-memory-Index">índices en memoria</a> incluyen <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">el índice plano</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">vecinos más cercanos escalables (ScaNN)</a>y <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li>La<strong>recuperación</strong> es la proporción de coincidencias verdaderas, o elementos relevantes, encontrados en los <a href="https://redis.io/docs/data-types/probabilistic/top-k/">K primeros</a> resultados recuperados por el algoritmo de búsqueda. Los valores más altos indican una mejor recuperación de los elementos relevantes.</li>
<li><strong>Consultas por segundo (QPS)</strong> es la velocidad a la que la base de datos vectorial puede procesar las consultas entrantes. Los valores más altos de QPS implican una mayor capacidad de procesamiento de consultas y un mayor rendimiento del sistema.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Marcos de evaluación comparativa</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2. Marco de evaluación comparativa de bases de datos vectoriales Marco de evaluación comparativa de bases de datos vectoriales.</p>
<p>La evaluación comparativa de una base de datos vectorial requiere un servidor de bases de datos vectoriales y clientes. En nuestras pruebas de rendimiento, utilizamos dos conocidas herramientas de código abierto.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Desarrollada y de código abierto por Zilliz, VectorDBBench ayuda a probar diferentes bases de datos vectoriales con diferentes tipos de índices y proporciona una cómoda interfaz web.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> Desarrollado y de código abierto por Qdrant, vector-db-benchmark ayuda a probar varias bases de datos vectoriales típicas para el tipo de índice <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. Ejecuta pruebas a través de la línea de comandos y proporciona un archivo <a href="https://docs.docker.com/compose/">Docker Compose</a> __file para simplificar el inicio de los componentes del servidor.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 3. Ejemplo de vector-db-benchmark Un ejemplo de comando vector-db-benchmark utilizado para ejecutar la prueba de referencia.</p>
<p>Pero el marco de referencia es sólo una parte de la ecuación. Necesitamos datos que ejerciten diferentes aspectos de la propia solución de base de datos vectorial, como su capacidad para manejar grandes volúmenes de datos, varios tamaños de vectores y la velocidad de recuperación.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Conjuntos de datos abiertos para ejercitar bases de datos vectoriales</h3><p>Los grandes conjuntos de datos son buenos candidatos para probar la latencia de carga y la asignación de recursos. Algunos conjuntos de datos tienen datos de gran dimensión y son buenos para probar la velocidad de cálculo de la similitud.</p>
<p>Los conjuntos de datos van desde una dimensión de 25 a una dimensión de 2048. El conjunto de datos <a href="https://laion.ai/">LAION</a>, una colección de imágenes abierta, se ha utilizado para entrenar modelos neuronales profundos visuales y lingüísticos muy grandes, como los modelos generativos de difusión estable. El conjunto de datos de OpenAI de 5 millones de vectores, cada uno con una dimensión de 1536, fue creado por VectorDBBench ejecutando OpenAI en <a href="https://huggingface.co/datasets/allenai/c4">datos sin procesar</a>. Dado que cada elemento del vector es de tipo FLOAT, sólo para guardar los vectores se necesitan aproximadamente 29 GB (5M * 1536 * 4) de memoria, además de una cantidad adicional similar para guardar índices y otros metadatos, lo que supone un total de 58 GB de memoria para las pruebas. Cuando utilice la herramienta vector-db-benchmark, asegúrese de que dispone de suficiente espacio en disco para guardar los resultados.</p>
<p>Para probar la latencia de carga, necesitábamos una gran colección de vectores, que <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a> ofrece. Para probar el rendimiento de la generación de índices y el cálculo de similitudes, los vectores de alta dimensión proporcionan más tensión. Para ello, elegimos el conjunto de datos 500K de vectores de 1536 dimensiones.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Herramientas de rendimiento</h3><p>Ya hemos visto cómo estresar el sistema para identificar métricas de interés, pero examinemos lo que ocurre a un nivel inferior: ¿cuán ocupada está la unidad de cálculo, el consumo de memoria, las esperas en los bloqueos, etc.? Esto nos da pistas sobre el comportamiento de la base de datos, especialmente útiles para identificar áreas problemáticas.</p>
<p>La utilidad <a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a> de Linux proporciona información sobre el rendimiento del sistema. Sin embargo, la herramienta <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> de Linux proporciona un conjunto más profundo de información. Para obtener más información, también recomendamos leer <a href="https://www.brendangregg.com/perf.html">los ejemplos de perf de Linux</a> y el <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">método de análisis de microarquitectura top-down de Intel</a>. Otra herramienta más es <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, que resulta útil a la hora de optimizar no solo las aplicaciones, sino también el rendimiento y la configuración del sistema para una variedad de cargas de trabajo que abarcan HPC, nube, IoT, medios, almacenamiento, etc.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Optimizaciones de bases de datos vectoriales Milvus<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Veamos algunos ejemplos de cómo intentamos mejorar el rendimiento de la base de datos vectorial Milvus.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Reducción de la sobrecarga del movimiento de memoria en la escritura del búfer del datanode</h3><p>Los proxies de la ruta de escritura de Milvus escriben datos en un corredor de registro a través de <em>MsgStream</em>. A continuación, los nodos de datos consumen los datos, convirtiéndolos y almacenándolos en segmentos. Los segmentos fusionarán los datos recién insertados. La lógica de fusión asigna un nuevo búfer para contener/mover tanto los datos antiguos como los nuevos datos que se van a insertar y, a continuación, devuelve el nuevo búfer como datos antiguos para la siguiente fusión de datos. El resultado es que los datos antiguos se hacen cada vez más grandes, lo que a su vez ralentiza el movimiento de los datos. Los perfiles de rendimiento muestran una elevada sobrecarga de esta lógica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 4. Fusión y movimiento de datos en el Fusionar y mover datos en la base de datos vectorial genera una sobrecarga de alto rendimiento.</p>
<p>Cambiamos la lógica <em>del búfer de fusión</em> para añadir directamente los nuevos datos a insertar en los datos antiguos, evitando asignar un nuevo búfer y mover los datos antiguos de gran tamaño. Los perfiles de rendimiento confirman que no hay sobrecarga en esta lógica. Las métricas de microcódigo <em>metric_CPU operating frequency</em> y <em>metric_CPU utilization</em> indican una mejora que es coherente con el hecho de que el sistema ya no tiene que esperar el movimiento largo de la memoria. La latencia de carga mejoró en más de un 60 por ciento. La mejora se recoge en <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 5. Con menos copias vemos una mejora del rendimiento de más del 50 por ciento en la latencia de carga.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Creación de índices invertidos con menor sobrecarga de asignación de memoria</h3><p>El motor de búsqueda de Milvus, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, emplea el <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">algoritmo k-means de Elkan</a> para entrenar datos de clúster para crear <a href="https://milvus.io/docs/v1.1.1/index.md">índices de archivos invertidos (IVF)</a>. Cada ronda de entrenamiento de datos define un recuento de iteraciones. Cuanto mayor sea el recuento, mejores serán los resultados del entrenamiento. Sin embargo, también implica que el algoritmo Elkan se llamará con más frecuencia.</p>
<p>El algoritmo Elkan se encarga de asignar y desasignar memoria cada vez que se ejecuta. En concreto, asigna memoria para almacenar la mitad del tamaño de los datos de la matriz simétrica, excluyendo los elementos diagonales. En Knowhere, la dimensión de la matriz simétrica utilizada por el algoritmo Elkan se establece en 1024, lo que resulta en un tamaño de memoria de aproximadamente 2 MB. Esto significa que para cada ronda de entrenamiento Elkan asigna y desasigna repetidamente 2 MB de memoria.</p>
<p>Los datos de perfiles de rendimiento indicaron una actividad frecuente de asignación de memoria de gran tamaño. De hecho, se activó la asignación <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">del área de memoria virtual (VMA</a>), la asignación de páginas físicas, la configuración del mapa de páginas y la actualización de las estadísticas del cgroup de memoria en el núcleo. Este patrón de gran actividad de asignación/desasignación de memoria puede, en algunas situaciones, agravar también la fragmentación de la memoria. Se trata de un impuesto importante.</p>
<p>La estructura <em>IndexFlatElkan</em> está específicamente diseñada y construida para soportar el algoritmo Elkan. En cada proceso de entrenamiento de datos se inicializará una instancia de <em>IndexFlatElkan</em>. Para mitigar el impacto en el rendimiento derivado de la frecuente asignación y desasignación de memoria en el algoritmo Elkan, hemos refactorizado la lógica del código, trasladando la gestión de memoria fuera de la función del algoritmo Elkan al proceso de construcción de <em>IndexFlatElkan</em>. Esto permite que la asignación de memoria se produzca sólo una vez durante la fase de inicialización, mientras que sirve a todas las llamadas posteriores a la función del algoritmo Elkan desde el proceso de formación de datos actual y ayuda a mejorar la latencia de carga en alrededor de un 3 por ciento. Encuentre el <a href="https://github.com/zilliztech/knowhere/pull/280">parche Knowhere aquí</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Aceleración de la búsqueda vectorial de Redis mediante Software Prefetch<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, un popular almacén tradicional de datos clave-valor en memoria, ha comenzado recientemente a admitir la búsqueda vectorial. Para ir más allá de un almacén típico de clave-valor, ofrece módulos de extensibilidad; el módulo <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> facilita el almacenamiento y la búsqueda de vectores directamente dentro de Redis.</p>
<p>Para la búsqueda de similitud vectorial, Redis admite dos algoritmos: fuerza bruta y HNSW. El algoritmo HNSW está diseñado específicamente para localizar de forma eficiente vecinos más cercanos aproximados en espacios de alta dimensión. Utiliza una cola prioritaria denominada <em>candidate_set</em> para gestionar todos los vectores candidatos para el cálculo de distancias.</p>
<p>Cada vector candidato contiene metadatos sustanciales además de los datos del vector. Como resultado, cuando se carga un candidato desde la memoria, se pueden perder datos de la caché, lo que provoca retrasos en el procesamiento. Nuestra optimización introduce la precarga por software para cargar proactivamente el siguiente candidato mientras se procesa el actual. Esta mejora se ha traducido en una mejora del rendimiento de entre el 2 y el 3 por ciento para búsquedas de similitud vectorial en una configuración de Redis de instancia única. El parche está en proceso de actualización.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">Cambio en el comportamiento predeterminado de GCC para evitar penalizaciones por código ensamblador mixto<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Para obtener el máximo rendimiento, las secciones de código de uso frecuente suelen escribirse a mano en ensamblador. Sin embargo, cuando diferentes segmentos de código son escritos por diferentes personas o en diferentes momentos, las instrucciones utilizadas pueden proceder de conjuntos de instrucciones en ensamblador incompatibles, como <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> y <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. Si no se compila adecuadamente, el código mezclado produce una penalización en el desempeño. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Obtenga más información sobre la mezcla de instrucciones Intel AVX y SSE aquí</a>.</p>
<p>Puede determinar fácilmente si está utilizando código ensamblador de modo mixto y no ha compilado el código con <em>VZEROUPPER</em>, incurriendo en la penalización de rendimiento. Se puede observar a través de un comando perf como <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;.</em> Si su sistema operativo no tiene soporte para el evento, utilice <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>El compilador Clang por defecto inserta <em>VZEROUPPER</em>, evitando cualquier penalización de modo mixto. Sin embargo, el compilador GCC sólo inserta <em>VZEROUPPER</em> cuando se especifican los indicadores de compilador -O2 u -O3. Nos pusimos en contacto con el equipo de GCC y les explicamos el problema, y ahora, por defecto, manejan correctamente el código ensamblador de modo mixto.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Optimice sus bases de datos vectoriales<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales están desempeñando un papel integral en GenAI, y están creciendo cada vez más para generar respuestas de mayor calidad. Con respecto a la optimización, las aplicaciones de IA no difieren de otras aplicaciones de software en que revelan sus secretos cuando se emplean herramientas de análisis de rendimiento estándar junto con marcos de referencia y entradas de estrés.</p>
<p>Con estas herramientas, descubrimos trampas de rendimiento relacionadas con la asignación innecesaria de memoria, la no precarga de instrucciones y el uso de opciones incorrectas del compilador. Basándonos en nuestros hallazgos, hemos introducido mejoras en Milvus, Knowhere, Redis y el compilador GCC para ayudar a que la IA sea un poco más eficiente y sostenible. Las bases de datos vectoriales son una clase importante de aplicaciones que merecen tus esfuerzos de optimización. Esperamos que este artículo te ayude a empezar.</p>
