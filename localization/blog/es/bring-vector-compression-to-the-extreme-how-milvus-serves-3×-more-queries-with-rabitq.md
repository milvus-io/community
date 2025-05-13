---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más
  consultas con RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Descubra cómo Milvus aprovecha RaBitQ para mejorar la eficiencia de la
  búsqueda vectorial, reduciendo los costes de memoria y manteniendo la
  precisión. ¡Aprenda a optimizar sus soluciones de IA hoy mismo!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> es una base de datos vectorial de código abierto altamente escalable que potencia la búsqueda semántica a escala de mil millones de vectores. A medida que los usuarios despliegan chatbots RAG, servicios de atención al cliente con IA y búsquedas visuales de esta magnitud, surge un reto común: <strong>los costes de infraestructura.</strong> Por el contrario, el crecimiento exponencial del negocio es emocionante, pero no lo es el aumento vertiginoso de las facturas en la nube. La búsqueda vectorial rápida suele requerir el almacenamiento de vectores en memoria, lo que resulta caro. Naturalmente, cabe preguntarse: <em>¿Podemos comprimir los vectores para ahorrar espacio sin sacrificar la calidad de la búsqueda?</em></p>
<p>La respuesta es <strong>SÍ</strong>, y en este blog le mostraremos cómo la implementación de una novedosa técnica llamada <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> permite a Milvus servir 3 veces más tráfico con un menor coste de memoria, manteniendo una precisión comparable. También compartiremos las lecciones prácticas aprendidas al integrar RaBitQ en Milvus de código abierto y en el servicio Milvus totalmente gestionado en <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Comprender la búsqueda vectorial y la compresión<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en RaBitQ, entendamos el reto.</p>
<p>Los algoritmos de búsqueda<a href="https://zilliz.com/glossary/anns"><strong>del vecino más cercano aproximado (RNA</strong></a> ) son el núcleo de una base de datos vectorial, ya que encuentran los k vectores más cercanos a una consulta determinada. Un vector es una coordenada en un espacio de alta dimensión, que a menudo comprende cientos de números en coma flotante. A medida que aumentan los datos vectoriales, también lo hacen las necesidades de almacenamiento y cálculo. Por ejemplo, ejecutar <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (un algoritmo de búsqueda de RNA) con mil millones de vectores de 768 dimensiones en FP32 requiere más de 3 TB de memoria.</p>
<p>Al igual que el MP3 comprime el audio descartando frecuencias imperceptibles para el oído humano, los datos vectoriales pueden comprimirse con un impacto mínimo en la precisión de la búsqueda. Las investigaciones demuestran que la FP32 de precisión completa suele ser innecesaria para las RNA.<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> La cuantificación escalar</a> (SQ), una popular técnica de compresión, asigna valores de coma flotante a intervalos discretos y almacena sólo los índices de los intervalos utilizando enteros de pocos bits. Los métodos de cuantificación reducen significativamente el uso de memoria al representar la misma información con menos bits. La investigación en este campo se esfuerza por conseguir el mayor ahorro con la menor pérdida de precisión.</p>
<p>La técnica de compresión más extrema -la cuantificación escalar de 1 bit, también conocida como <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">cuantificación binaria- representa</a>cada valor flotante con un solo bit. En comparación con FP32 (codificación de 32 bits), esto reduce el uso de memoria en 32×. Dado que la memoria suele ser el principal cuello de botella en la búsqueda vectorial, esta compresión puede aumentar considerablemente el rendimiento. <strong>El reto, sin embargo, reside en preservar la precisión de la búsqueda.</strong> Normalmente, la SQ de 1 bit reduce la recuperación por debajo del 70%, lo que la hace prácticamente inutilizable.</p>
<p>Aquí es donde destaca <strong>RaBitQ</strong>, una excelente técnica de compresión que consigue una cuantificación de 1 bit preservando una alta recuperación. Milvus es ahora compatible con RaBitQ a partir de la versión 2.6, lo que permite a la base de datos vectorial servir 3 veces más QPS manteniendo un nivel de precisión comparable.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Breve introducción a RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> es un método de cuantificación binaria inteligentemente diseñado que aprovecha la propiedad geométrica del espacio de alta dimensión para lograr una compresión vectorial eficiente y precisa.</p>
<p>A primera vista, reducir cada dimensión de un vector a un solo bit puede parecer demasiado agresivo, pero en el espacio de alta dimensión, nuestras intuiciones a menudo nos fallan. Como<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> ilustra</a> Jianyang Gao, autor de RaBitQ, los vectores de alta dimensión presentan la propiedad de que las coordenadas individuales tienden a concentrarse estrechamente en torno al cero, resultado de un fenómeno contraintuitivo explicado en<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentración de la medida</a>. Esto permite descartar gran parte de la precisión original y, al mismo tiempo, conservar la estructura relativa necesaria para una búsqueda precisa del vecino más próximo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: La distribución de valores contraintuitiva en la geometría de alta dimensión. <em>Considere el valor de la primera dimensión para un vector unitario aleatorio muestreado uniformemente de la esfera unitaria; los valores se distribuyen uniformemente en el espacio tridimensional. Sin embargo, para el espacio de alta dimensión (por ejemplo, 1000D), los valores se concentran alrededor de cero, una propiedad poco intuitiva de la geometría de alta dimensión. (Fuente de la imagen: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantization in The Counterintuitive High-Dimensional</a> Space)</em></p>
<p>Inspirándose en esta propiedad del espacio de alta dimensión, <strong>RaBitQ se centra en codificar la información angular en lugar de las coordenadas espaciales exactas</strong>. Para ello, normaliza cada vector de datos en relación con un punto de referencia, como el centroide del conjunto de datos. A continuación, cada vector se asigna a su vértice más cercano en el hipercubo, lo que permite una representación con sólo 1 bit por dimensión. Este enfoque se extiende de forma natural a <code translate="no">IVF_RABITQ</code>, donde la normalización se realiza en relación con el centroide del clúster más cercano, lo que mejora la precisión de la codificación local.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Compresión de un vector encontrando su aproximación más cercana en el hipercubo, de modo que cada dimensión pueda representarse con sólo 1 bit. (Fuente de la imagen:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional</em></a><em> Space)</em></p>
<p>Para garantizar la fiabilidad de la búsqueda incluso con representaciones tan comprimidas, RaBitQ introduce un <strong>estimador insesgado y teóricamente fundamentado</strong> de la distancia entre un vector de consulta y los vectores de documentos cuantificados en binario. Esto ayuda a minimizar el error de reconstrucción y a mantener una alta recuperación.</p>
<p>RaBitQ también es muy compatible con otras técnicas de optimización, como<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> y el<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> preprocesamiento de rotación aleatoria</a>. Además, RaBitQ es <strong>ligero de entrenar y rápido de ejecutar</strong>. El entrenamiento consiste simplemente en determinar el signo de cada componente vectorial, y la búsqueda se acelera mediante rápidas operaciones bit a bit soportadas por las CPU modernas. Juntas, estas optimizaciones permiten a RaBitQ ofrecer una búsqueda de alta velocidad con una pérdida mínima de precisión.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Ingeniería de RaBitQ en Milvus: de la investigación académica a la producción<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque RaBitQ es conceptualmente sencillo y va acompañado de una<a href="https://github.com/gaoj0017/RaBitQ"> implementación de referencia</a>, adaptarlo a una base de datos vectorial distribuida y de producción como Milvus presentó varios retos de ingeniería. Hemos implementado RaBitQ en Knowhere, el núcleo del motor de búsqueda vectorial de Milvus, y también hemos contribuido con una versión optimizada a la biblioteca de búsqueda RNA de código abierto<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Veamos cómo hemos dado vida a este algoritmo en Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Compromisos de implementación</h3><p>Una decisión de diseño importante implicó el manejo de <strong>datos auxiliares por vector</strong>. RaBitQ requiere dos valores de punto flotante por vector precalculados durante el tiempo de indexación, y un tercer valor que puede ser calculado sobre la marcha o precalculado. En Knowhere, optamos por precalcular este valor en el momento de la indexación y almacenarlo para mejorar la eficiencia durante la búsqueda. Por el contrario, la implementación de FAISS conserva la memoria calculándola en el momento de la consulta, lo que supone un compromiso diferente entre el uso de memoria y la velocidad de consulta.</p>
<p>Una decisión de diseño importante fue la gestión de <strong>los datos auxiliares por vector</strong>. RaBitQ requiere dos valores de coma flotante por vector precalculados durante el tiempo de indexación, y un tercer valor que puede calcularse sobre la marcha o precalcularse. En Knowhere, precalculamos este valor en el momento de la indexación y lo almacenamos para mejorar la eficiencia durante la búsqueda. En cambio, la implementación de FAISS conserva la memoria calculándolo en el momento de la consulta, lo que supone un compromiso diferente entre el uso de memoria y la velocidad de consulta.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Aceleración por hardware</h3><p>Las CPU modernas ofrecen instrucciones especializadas que pueden acelerar significativamente las operaciones binarias. Hemos adaptado el núcleo de cálculo de distancias para aprovechar las modernas instrucciones de la CPU. Dado que RaBitQ se basa en operaciones popcount, creamos una ruta especializada en Knowhere que utiliza las instrucciones <code translate="no">VPOPCNTDQ</code> para AVX512 cuando están disponibles. En hardware compatible (por ejemplo, Intel IceLake o AMD Zen 4), esto puede acelerar los cálculos de distancia binaria en varios factores en comparación con las implementaciones predeterminadas.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Optimización de consultas</h3><p>Tanto Knowhere (el motor de búsqueda de Milvus) como nuestra versión FAISS optimizada admiten la cuantificación escalar (SQ1-SQ8) en los vectores de consulta. Esto proporciona una flexibilidad adicional: incluso con una cuantización de consulta de 4 bits, la recuperación sigue siendo alta, mientras que las demandas computacionales disminuyen significativamente, lo que es particularmente útil cuando las consultas deben procesarse a un alto rendimiento.</p>
<p>Vamos un paso más allá en la optimización de nuestro motor propietario Cardinal, que impulsa el Milvus totalmente gestionado en Zilliz Cloud. Más allá de las capacidades del Milvus de código abierto, introducimos mejoras avanzadas, incluida la integración con un índice vectorial basado en gráficos, capas adicionales de optimización y compatibilidad con las instrucciones SVE de Arm.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Aumento del rendimiento: 3 veces más QPS con una precisión comparable<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>A partir de la versión 2.6, Milvus introduce el nuevo tipo de índice <code translate="no">IVF_RABITQ</code>. Este nuevo índice combina RaBitQ con agrupación IVF, transformación de rotación aleatoria y refinamiento opcional para ofrecer un equilibrio óptimo de rendimiento, eficiencia de memoria y precisión.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Uso de IVF_RABITQ en su aplicación</h3><p>He aquí cómo implementar <code translate="no">IVF_RABITQ</code> en su aplicación Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Benchmarking: Los números cuentan la historia</h3><p>Realizamos pruebas comparativas de diferentes configuraciones utilizando<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, una herramienta de pruebas comparativas de código abierto para evaluar bases de datos vectoriales. Tanto el entorno de prueba como el de control utilizan Milvus Standalone desplegado en instancias AWS EC2 <code translate="no">m6id.2xlarge</code>. Estas máquinas cuentan con 8 vCPUs, 32 GB de RAM, y una CPU Intel Xeon 8375C basada en la arquitectura Ice Lake, que soporta el conjunto de instrucciones VPOPCNTDQ AVX-512.</p>
<p>Utilizamos la prueba de rendimiento de búsqueda de vdb-bench, con un conjunto de datos de 1 millón de vectores, cada uno con 768 dimensiones. Dado que el tamaño de segmento predeterminado en Milvus es de 1 GB y que el conjunto de datos en bruto (768 dimensiones × 1M de vectores × 4 bytes por flotante) suma aproximadamente 3 GB, la evaluación comparativa implicó múltiples segmentos por base de datos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Ejemplo de configuración de la prueba en vdb-bench.</p>
<p>A continuación se ofrecen algunos detalles de bajo nivel sobre los botones de configuración de IVF, RaBitQ y el proceso de refinamiento:</p>
<ul>
<li><p><code translate="no">nlist</code> y <code translate="no">nprobe</code> son parámetros estándar para todos los métodos basados en <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> es un número entero no negativo que especifica el número total de cubos IVF para el conjunto de datos.</p></li>
<li><p><code translate="no">nprobe</code> es un número entero no negativo que especifica el número de cubos FIV que se visitan para un único vector de datos durante el proceso de búsqueda. Es un parámetro relacionado con la búsqueda.</p></li>
<li><p><code translate="no">rbq_bits_query</code> especifica el nivel de cuantización de un vector de consulta. Utilice los valores 1...8 para los niveles de cuantificación <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. Utilice el valor 0 para desactivar la cuantificación. Es un parámetro relacionado con la búsqueda.</p></li>
<li><p><code translate="no">refine</code>Los parámetros <code translate="no">refine_type</code> y <code translate="no">refine_k</code> son parámetros estándar para el proceso de refinado.</p></li>
<li><p><code translate="no">refine</code> es un booleano que habilita la estrategia de refinamiento.</p></li>
<li><p><code translate="no">refine_k</code> es un valor fp no negativo. El proceso de refinamiento utiliza un método de cuantificación de mayor calidad para elegir el número necesario de vecinos más cercanos de un conjunto de candidatos <code translate="no">refine_k</code> veces mayor, elegido mediante <code translate="no">IVFRaBitQ</code>. Es un parámetro relacionado con la búsqueda.</p></li>
<li><p><code translate="no">refine_type</code> es una cadena que especifica el tipo de cuantificación para un índice de refinado. Las opciones disponibles son <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> y <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Los resultados revelan aspectos importantes:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Comparación de costes y rendimiento de los índices de referencia (IVF_FLAT), IVF_SQ8 e IVF_RABITQ con distintas estrategias de refinamiento</p>
<p>En comparación con el índice de referencia <code translate="no">IVF_FLAT</code>, que alcanza 236 QPS con una recuperación del 95,2%, <code translate="no">IVF_RABITQ</code> alcanza un rendimiento significativamente superior: 648 QPS con consultas FP32 y 898 QPS cuando se combina con consultas cuantificadas SQ8. Estas cifras demuestran la ventaja de rendimiento de RaBitQ, especialmente cuando se aplica el refinamiento.</p>
<p>Sin embargo, este rendimiento se traduce en una notable pérdida de memoria. Cuando se utiliza <code translate="no">IVF_RABITQ</code> sin refinamiento, la recuperación se sitúa en torno al 76%, lo que puede resultar insuficiente para aplicaciones que requieren una gran precisión. Dicho esto, alcanzar este nivel de recuperación utilizando compresión vectorial de 1 bit sigue siendo impresionante.</p>
<p>El refinamiento es esencial para recuperar la precisión. Cuando se configura con SQ8 query y SQ8 refinement, <code translate="no">IVF_RABITQ</code> ofrece un gran rendimiento y recuperación. Mantiene una alta recuperación del 94,7%, casi igual que IVF_FLAT, y alcanza 864 QPS, más de 3 veces superior a IVF_FLAT. Incluso comparado con otro índice de cuantificación popular <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> con el refinamiento SQ8 consigue más de la mitad del rendimiento con una recuperación similar, sólo que con un coste marginal superior. Esto lo convierte en una opción excelente para escenarios que exigen tanto velocidad como precisión.</p>
<p>En resumen, <code translate="no">IVF_RABITQ</code> por sí solo es excelente para maximizar el rendimiento con una recuperación aceptable, y se vuelve aún más potente cuando se combina con el refinamiento para cerrar la brecha de calidad, utilizando sólo una fracción del espacio de memoria en comparación con <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>RaBitQ supone un avance significativo en la tecnología de cuantificación vectorial. Combinando la cuantificación binaria con estrategias de codificación inteligentes, consigue lo que parecía imposible: una compresión extrema con una pérdida de precisión mínima.</p>
<p>A partir de la próxima versión 2.6, Milvus introducirá IVF_RABITQ, integrando esta potente técnica de compresión con las estrategias de agrupación y refinamiento de IVF para llevar la cuantificación binaria a la producción. Esta combinación crea un equilibrio práctico entre precisión, velocidad y eficiencia de memoria que puede transformar sus cargas de trabajo de búsqueda vectorial.</p>
<p>Estamos comprometidos a traer más innovaciones como esta tanto a Milvus de código abierto como a su servicio totalmente gestionado en Zilliz Cloud, haciendo que la búsqueda vectorial sea más eficiente y accesible para todos.</p>
<p>Esté atento al lanzamiento de Milvus 2.6 con muchas más características potentes, y únase a nuestra comunidad en<a href="https://milvus.io/discord"> milvus.io/discord</a> para obtener más información, compartir sus experiencias o hacer preguntas.</p>
