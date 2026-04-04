---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Más allá del debate TurboQuant-RaBitQ: por qué la cuantificación vectorial es
  importante para los costes de infraestructura de la IA
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  El debate TurboQuant-RaBitQ convirtió la cuantificación vectorial en noticia
  de primera plana. Cómo funciona la compresión RaBitQ de 1 bit y cómo Milvus
  ofrece IVF_RABITQ para ahorrar un 97% de memoria.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>El documento TurboQuant de Google (ICLR 2026) muestra una compresión de caché KV 6 veces superior con una pérdida de precisión casi nula, resultados lo suficientemente sorprendentes como para <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> eliminar 90.000 millones de dólares de las acciones de chips de memoria</a> en un solo día. SK Hynix cayó un 12%. Samsung cayó un 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El artículo no tardó en recibir críticas. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, primer autor de <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">planteó dudas</a> sobre la relación entre la metodología de TurboQuant y su trabajo anterior sobre cuantificación vectorial. (Pronto publicaremos una conversación con el Dr. Gao; síguenos si te interesa).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este artículo no trata de tomar partido en esa discusión. Lo que nos llama la atención es algo más grande: el hecho de que un solo artículo sobre <a href="https://milvus.io/docs/index-explained.md">cuantización</a> vectorial pueda mover 90.000 millones de dólares en valor de mercado indica lo crítica que se ha vuelto esta tecnología para la infraestructura de la IA. Ya se trate de la compresión de la caché KV en motores de inferencia o de la compresión de índices en <a href="https://zilliz.com/learn/what-is-vector-database">bases de datos vectoriales</a>, la capacidad de reducir datos de alta dimensión preservando la calidad tiene enormes implicaciones de coste, y es un problema en el que hemos estado trabajando, integrando RaBitQ en la base de datos vectorial <a href="https://milvus.io/">Milvus</a> y convirtiéndola en infraestructura de producción.</p>
<p>Esto es lo que cubriremos: por qué la cuantificación vectorial es tan importante en este momento, cómo se comparan TurboQuant y RaBitQ, qué es RaBitQ y cómo funciona, el trabajo de ingeniería detrás de su distribución dentro de Milvus y cómo se ve el panorama más amplio de optimización de memoria para la infraestructura de IA.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">¿Por qué es importante la cuantificación vectorial para los costes de infraestructura?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>La cuantización vectorial no es nueva. Lo que es nuevo es la urgencia con la que la industria la necesita. En los últimos dos años, los parámetros LLM se han disparado, las ventanas de contexto han pasado de 4K a 128K+ tokens y los datos no estructurados -texto, imágenes, audio, vídeo- se han convertido en una entrada de primera clase para los sistemas de IA. Cada una de estas tendencias crea más vectores de alta dimensión que deben almacenarse, indexarse y buscarse. Más vectores, más memoria, más costes.</p>
<p>Si ejecuta búsquedas vectoriales a gran escala ( <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">canalizaciones RAG</a>, motores de recomendación, recuperación multimodal), es probable que el coste de la memoria sea uno de sus mayores quebraderos de cabeza de infraestructura.</p>
<p>Durante el despliegue del modelo, cada pila de inferencia LLM importante se basa en la <a href="https://zilliz.com/glossary/kv-cache">caché KV</a>, que almacena pares clave-valor previamente calculados para que el mecanismo de atención no los vuelva a calcular para cada nuevo token. Es lo que hace posible la inferencia O(n) en lugar de O(n²). Todos los frameworks, desde <a href="https://github.com/vllm-project/vllm">vLLM</a> hasta <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>, dependen de ella. Pero la caché KV puede consumir más memoria de la GPU que los propios pesos del modelo. Contextos más largos, más usuarios simultáneos, y la espiral se acelera.</p>
<p>La misma presión sufren las bases de datos vectoriales: miles de millones de vectores de alta dimensión almacenados en la memoria, cada uno de ellos un flotante de 32 bits por dimensión. La cuantización vectorial comprime estos vectores de flotantes de 32 bits a representaciones de 4 bits, 2 bits o incluso 1 bit, reduciendo la memoria en un 90% o más. Tanto si se trata de la caché KV de su motor de inferencia como de los índices de su base de datos vectorial, la matemática subyacente es la misma y el ahorro de costes es real. Por eso, un solo artículo en el que se informa de un gran avance en este campo movió 90.000 millones de dólares en bolsa.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant frente a RaBitQ: ¿Cuál es la diferencia?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Tanto TurboQuant como RaBitQ se basan en la misma técnica fundamental: aplicar una rotación aleatoria<a href="https://arxiv.org/abs/2406.03482">(transformación de Johnson-Lindenstrauss</a>) a los vectores de entrada antes de la cuantización. Esta rotación transforma los datos distribuidos irregularmente en una distribución uniforme predecible, lo que facilita la cuantificación con un error bajo.</p>
<p>Más allá de esta base común, los dos se centran en problemas distintos y adoptan enfoques diferentes:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Objetivo</strong></td><td>Caché KV en inferencia LLM (datos efímeros, por solicitud)</td><td>Índices vectoriales persistentes en bases de datos (datos almacenados)</td></tr>
<tr><td><strong>Enfoque</strong></td><td>En dos etapas: PolarQuant (cuantificador escalar Lloyd-Max por coordenada) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (corrección residual de 1 bit)</td><td>Una etapa: proyección hipercubo + estimador de distancia insesgado</td></tr>
<tr><td><strong>Ancho de bits</strong></td><td>Claves de 3 bits, valores de 2 bits (precisión mixta)</td><td>1 bit por dimensión (con variantes multibit disponibles)</td></tr>
<tr><td><strong>Afirmación teórica</strong></td><td>Tasa de distorsión MSE casi óptima</td><td>Error de estimación del producto interno asintóticamente óptimo (coincidente con los límites inferiores de Alon-Klartag)</td></tr>
<tr><td><strong>Estado de producción</strong></td><td>Implementaciones comunitarias; no hay versión oficial de Google</td><td>Incluido en <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, adoptado por Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>La diferencia clave para los profesionales: TurboQuant optimiza la caché KV transitoria dentro de un motor de inferencia, mientras que RaBitQ se centra en los índices persistentes que una base de datos vectorial construye, divide y consulta a través de miles de millones de vectores. En el resto de este artículo, nos centraremos en RaBitQ, el algoritmo que hemos integrado y puesto en producción en Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">¿Qué es RaBitQ y qué ofrece?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo primero es lo esencial: en un conjunto de datos de 10 millones de vectores con 768 dimensiones, RaBitQ comprime cada vector a 1/32 de su tamaño original manteniendo la recuperación por encima del 94%. En Milvus, esto se traduce en un rendimiento de consulta 3,6 veces superior al de un índice de precisión total. No se trata de una proyección teórica, sino de un resultado de referencia de Milvus 2.6.</p>
<p>Ahora, cómo lo consigue.</p>
<p>La cuantificación binaria tradicional comprime los vectores FP32 a 1 bit por dimensión: una compresión 32 veces mayor. La contrapartida es que la memoria se desploma porque se ha desechado demasiada información. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) mantiene la misma compresión 32x pero preserva la información que realmente importa para la búsqueda. Una <a href="https://arxiv.org/abs/2409.09913">versión extendida</a> (Gao &amp; Long, SIGMOD 2025) demuestra que esto es asintóticamente óptimo, igualando los límites inferiores teóricos establecidos por Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">¿Por qué los ángulos importan más que las coordenadas en dimensiones altas?</h3><p>La idea clave: <strong>en dimensiones altas, los ángulos entre vectores son más estables e informativos que los valores de coordenadas individuales.</strong> Esto es consecuencia de la concentración de medidas, el mismo fenómeno que hace que funcionen las proyecciones aleatorias de Johnson-Lindenstrauss.</p>
<p>Lo que esto significa en la práctica: se pueden descartar los valores exactos de las coordenadas de un vector de alta dimensión y conservar sólo su dirección relativa al conjunto de datos. Las relaciones angulares -de las que depende en realidad <a href="https://zilliz.com/glossary/anns">la búsqueda del vecino más próximo-</a> sobreviven a la compresión.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">¿Cómo funciona RaBitQ?</h3><p>RaBitQ convierte este conocimiento geométrico en tres pasos:</p>
<p><strong>Paso 1: Normalizar.</strong> Centra cada vector en relación con el centroide del conjunto de datos y lo escala a la unidad de longitud. Esto convierte el problema en una estimación de producto interno entre vectores unitarios, más fácil de analizar y acotar.</p>
<p><strong>Paso 2: Rotación aleatoria + proyección hipercúbica.</strong> Aplique una matriz ortogonal aleatoria (una rotación tipo Johnson-Lindenstrauss) para eliminar el sesgo hacia cualquier eje. Proyectar cada vector rotado sobre el vértice más cercano de un hipercubo {±1/√D}^D. Cada dimensión se reduce a un solo bit. El resultado: un código binario de D bits por vector.</p>
<p><strong>Paso 3: Estimación insesgada de la distancia.</strong> Construir un estimador del producto interno entre una consulta y el vector original (sin cuantificar). El estimador es insesgado con un error limitado por O(1/√D). Para vectores de 768 dimensiones, mantiene la recuperación por encima del 94%.</p>
<p>El cálculo de distancias entre vectores binarios se reduce a AND + popcount, operaciones que las CPU modernas ejecutan en un solo ciclo. Esto es lo que hace que RaBitQ sea rápido, no sólo pequeño.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">¿Por qué RaBitQ es práctico y no sólo teórico?</h3><ul>
<li><strong>No requiere formación.</strong> Aplique la rotación, compruebe los signos. Sin optimización iterativa, sin aprendizaje del libro de códigos. El tiempo de indexación es comparable a la <a href="https://milvus.io/docs/ivf-pq.md">cuantificación del producto</a>.</li>
<li><strong>Hardware sencillo.</strong> El cálculo de la distancia es bitwise AND + popcount. Las CPU modernas (Intel IceLake+, AMD Zen 4+) tienen instrucciones AVX512VPOPCNTDQ dedicadas. La estimación de un solo vector es 3 veces más rápida que las tablas de búsqueda PQ.</li>
<li><strong>Flexibilidad multibits.</strong> La <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">biblioteca RaBitQ</a> admite variantes de más de 1 bit: La de 4 bits alcanza un ~90% de recuperación, la de 5 bits un ~95% y la de 7 bits un ~99%, todas ellas sin reordenación.</li>
<li><strong>Componible.</strong> Se integra en estructuras de índices existentes, como <a href="https://milvus.io/docs/ivf-flat.md">índices IVF</a> y <a href="https://milvus.io/docs/hnsw.md">gráficos HNSW</a>, y funciona con FastScan para el cálculo de distancias por lotes.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Del papel a la producción: Lo que construimos para distribuir RaBitQ en Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>El código original de RaBitQ es un prototipo de investigación para una sola máquina. Hacerlo funcionar en un <a href="https://milvus.io/docs/architecture_overview.md">clúster distribuido</a> con fragmentación, conmutación por error e ingesta en tiempo real requería resolver cuatro problemas de ingeniería. En <a href="https://zilliz.com/">Zilliz</a>, fuimos más allá de la simple implementación del algoritmo: el trabajo abarcó la integración del motor, la aceleración del hardware, la optimización del índice y el ajuste del tiempo de ejecución para convertir RaBitQ en una capacidad de nivel industrial dentro de Milvus. También puede encontrar más detalles en este blog: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3× más consultas con RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Preparación de RaBitQ para la distribución</h3><p>Integramos RaBitQ directamente en <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, el motor de búsqueda central de Milvus - no como un plugin, sino como un tipo de índice nativo con interfaces unificadas. Funciona con toda la arquitectura distribuida de Milvus: fragmentación, partición, escalado dinámico y <a href="https://milvus.io/docs/manage-collections.md">gestión de colecciones</a>.</p>
<p>El reto clave: hacer que el libro de códigos de cuantificación (matriz de rotación, vectores centroides, parámetros de escalado) sea consciente de los segmentos, de modo que cada fragmento construya y almacene su propio estado de cuantificación. La creación de índices, la compactación y el equilibrio de la carga comprenden el nuevo tipo de índice de forma nativa.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Exprimiendo cada ciclo de Popcount</h3><p>La velocidad de RaBitQ proviene de popcount: el recuento de bits de conjuntos en vectores binarios. El algoritmo es intrínsecamente rápido, pero el rendimiento que se obtiene depende de lo bien que se utilice el hardware. Hemos creado rutas de código SIMD específicas para las dos arquitecturas de servidor dominantes:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> La instrucción VPOPCNTDQ de AVX-512 calcula el popcount a través de múltiples registros de 512 bits en paralelo. Los bucles internos de Knowhere se reestructuran para agrupar los cálculos de distancia binaria en trozos de ancho SIMD, lo que maximiza el rendimiento.</li>
<li><strong>ARM (Graviton, Ampere):</strong> Instrucciones SVE (Scalable Vector Extension) para el mismo patrón de recuento paralelo, algo fundamental ya que las instancias ARM son cada vez más comunes en las implantaciones en la nube con optimización de costes.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Eliminación de la sobrecarga en tiempo de ejecución</h3><p>RaBitQ necesita parámetros auxiliares de coma flotante en el momento de la consulta: el centroide del conjunto de datos, las normas por vector y el producto interno entre cada vector cuantizado y su original (utilizado por el estimador de distancia). El cálculo de estos parámetros en cada consulta añade latencia. Almacenar los vectores originales completos anula el objetivo de la compresión.</p>
<p>Nuestra solución: precalcular y mantener estos parámetros durante la creación del índice, almacenándolos en caché junto con los códigos binarios. La sobrecarga de memoria es pequeña (unos pocos flotadores por vector), pero elimina el cálculo por consulta y mantiene estable la latencia en condiciones de alta concurrencia.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: El índice que realmente se despliega</h3><p>A partir de <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, distribuimos <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Índice de archivos invertido</a> + cuantización RaBitQ. La búsqueda funciona en dos etapas:</p>
<ol>
<li><strong>Búsqueda gruesa (IVF).</strong> K-means divide el espacio vectorial en clusters. En el momento de la consulta, sólo se escanean los clusters nprobe más cercanos.</li>
<li><strong>Puntuación fina (RaBitQ).</strong> Dentro de cada conglomerado, las distancias se estiman utilizando códigos de 1 bit y el estimador insesgado. Popcount hace el trabajo pesado.</li>
</ol>
<p>Los resultados en un conjunto de datos de 768 dimensiones y 10 millones de vectores:</p>
<table>
<thead>
<tr><th>Métrica</th><th>IVF_FLAT (base)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refinar</th></tr>
</thead>
<tbody>
<tr><td>Recall</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Espacio de memoria</td><td>32 bits/dim</td><td>1 bit/dim (~3% del original)</td><td>~25% del original</td></tr>
</tbody>
</table>
<p>Para cargas de trabajo que no pueden tolerar ni siquiera un 0,5% de diferencia en la recuperación, el parámetro refine_type añade una segunda pasada de puntuación: SQ6, SQ8, FP16, BF16 o FP32. SQ8 es la opción más común, ya que restaura la recuperación a los niveles de IVF_FLAT a aproximadamente 1/4 de la memoria original. También puede aplicar <a href="https://milvus.io/docs/ivf-sq8.md">la cuantificación escalar</a> a la parte de consulta (SQ1-SQ8) de forma independiente, lo que le proporciona dos botones para ajustar la compensación latencia-recall-coste por carga de trabajo.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Cómo Milvus optimiza la memoria más allá de la cuantificación<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ es la palanca de compresión más espectacular, pero es una capa de una pila de <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">optimización de memoria</a> más amplia:</p>
<table>
<thead>
<tr><th>Estrategia</th><th>Qué hace</th><th>Impacto</th></tr>
</thead>
<tbody>
<tr><td><strong>Cuantización completa</strong></td><td>SQ8, PQ, RaBitQ con diferentes compensaciones precisión-coste</td><td>Reducción de memoria de 4 a 32 veces</td></tr>
<tr><td><strong>Optimización de la estructura de índices</strong></td><td>Compactación de gráficos HNSW, descarga de SSD de DiskANN, creación de índices a prueba de OOM</td><td>Menos DRAM por índice, conjuntos de datos más grandes por nodo</td></tr>
<tr><td><strong>E/S mapeada en memoria (mmap)</strong></td><td>Asignación de archivos vectoriales al disco, carga de páginas bajo demanda a través de la caché de páginas del sistema operativo.</td><td>Conjuntos de datos a escala TB sin cargar todo en RAM</td></tr>
<tr><td><strong>Almacenamiento por niveles</strong></td><td>Separación de datos calientes/calientes/fríos con programación automática</td><td>Pague precios de memoria sólo por los datos a los que accede con frecuencia</td></tr>
<tr><td><strong>Escalado nativo en la nube</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, Milvus gestionado)</td><td>Asignación elástica de memoria, liberación automática de recursos ociosos</td><td>Pague sólo por lo que utiliza</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Cuantificación completa</h3><p>La compresión extrema de 1 bit de RaBitQ no es adecuada para todas las cargas de trabajo. Milvus ofrece una matriz de cuantización completa: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> y <a href="https://milvus.io/docs/ivf-pq.md">cuantificación de producto (PQ)</a> para cargas de trabajo que necesitan un equilibrio entre precisión y coste, RaBitQ para una compresión máxima en conjuntos de datos ultra grandes y configuraciones híbridas que combinan varios métodos para un control preciso.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Optimización de la estructura de índices</h3><p>Además de la cuantización, Milvus optimiza continuamente la sobrecarga de memoria en sus estructuras de índices centrales. En el caso <a href="https://milvus.io/docs/hnsw.md">de HNSW</a>, hemos reducido la redundancia de las listas de adyacencia para reducir el uso de memoria por gráfico. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> transfiere tanto los datos vectoriales como las estructuras de índice a SSD, reduciendo drásticamente la dependencia de DRAM para grandes conjuntos de datos. También hemos optimizado la asignación de memoria intermedia durante la creación de índices para evitar fallos de OOM al crear índices sobre conjuntos de datos que se acercan a los límites de memoria de los nodos.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Carga de memoria inteligente</h3><p>El soporte <a href="https://milvus.io/docs/mmap.md">mmap</a> (E/S mapeada en memoria) de Milvus asigna datos vectoriales a archivos de disco, confiando en la caché de páginas del sistema operativo para la carga bajo demanda, sin necesidad de cargar todos los datos en la memoria al inicio. Combinado con estrategias de carga lenta y segmentada que evitan los picos repentinos de memoria, esto permite un funcionamiento fluido con conjuntos de datos vectoriales a escala TB a una fracción del coste de memoria.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Almacenamiento por niveles</h3><p>La <a href="https://milvus.io/docs/tiered-storage-overview.md">arquitectura de almacenamiento en tres niveles</a> de Milvus abarca la memoria, las SSD y el almacenamiento de objetos: los datos calientes permanecen en la memoria para reducir la latencia, los datos calientes se almacenan en caché en las SSD para equilibrar el rendimiento y el coste, y los datos fríos se hunden en el almacenamiento de objetos para minimizar la sobrecarga. El sistema gestiona la programación de datos automáticamente, sin necesidad de cambios en la capa de aplicación.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Escalado nativo en la nube</h3><p>Bajo la <a href="https://milvus.io/docs/architecture_overview.md">arquitectura distribuida</a> de Milvus, la fragmentación de datos y el equilibrio de carga evitan la sobrecarga de memoria en un único nodo. La agrupación de memoria reduce la fragmentación y mejora la utilización. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus totalmente gestionado) lleva esto más allá con la programación elástica para el escalado de memoria bajo demanda: en el modo sin servidor, los recursos ociosos se liberan automáticamente, lo que reduce aún más el coste total de propiedad.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Cómo se combinan estas capas</h3><p>Estas optimizaciones no son alternativas, sino que se acumulan. RaBitQ reduce los vectores. DiskANN mantiene el índice en SSD. Mmap evita cargar datos fríos en la memoria. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">El almacenamiento por niveles</a> empuja los datos de archivo al almacenamiento de objetos. El resultado: un despliegue que sirve miles de millones de vectores no necesita miles de millones de vectores de RAM.</p>
<h2 id="Get-Started" class="common-anchor-header">Empezar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que los volúmenes de datos de IA sigan creciendo, la eficiencia y el coste de las bases de datos vectoriales determinarán directamente hasta dónde pueden escalar las aplicaciones de IA. Seguiremos invirtiendo en una infraestructura de vectores de alto rendimiento y bajo coste, para que más aplicaciones de IA puedan pasar del prototipo a la producción.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> es de código abierto. Para probar IVF_RABITQ:</p>
<ul>
<li>Consulte la <a href="https://milvus.io/docs/ivf-rabitq.md">documentación de</a> IVF_RABITQ para obtener orientación sobre la configuración y el ajuste.</li>
<li>Lea la <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">entrada</a> completa <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">del blog sobre la integración de RaBitQ</a> para conocer más detalles sobre los puntos de referencia y la implementación.</li>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para hacer preguntas y aprender de otros desarrolladores.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de Milvus Office Hours</a> para analizar su caso de uso.</li>
</ul>
<p>Si prefiere omitir la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus totalmente gestionado) ofrece un nivel gratuito con soporte IVF_RABITQ.</p>
<p>Próximamente publicaremos una entrevista con el profesor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) y <a href="https://gaoj0017.github.io/">el Dr. Jianyang Gao</a> (ETH Zurich), el primer autor de RaBitQ, en la que profundizaremos en la teoría de la cuantización vectorial y lo que está por venir. Deja tus preguntas en los comentarios.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas más frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">¿Qué son TurboQuant y RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) y RaBitQ (Gao &amp; Long, SIGMOD 2024) son métodos de cuantificación vectorial que utilizan la rotación aleatoria para comprimir vectores de alta dimensión. TurboQuant se centra en la compresión de cachés KV en la inferencia LLM, mientras que RaBitQ se centra en índices vectoriales persistentes en bases de datos. Ambos han contribuido a la actual ola de interés por la cuantización vectorial, aunque resuelven problemas distintos para sistemas diferentes.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">¿Cómo consigue RaBitQ la cuantización de 1 bit sin destruir la recuperación?</h3><p>RaBitQ aprovecha la concentración de medidas en espacios de alta dimensión: los ángulos entre vectores son más estables que los valores de las coordenadas individuales a medida que aumenta la dimensionalidad. Normaliza los vectores en relación con el centroide del conjunto de datos y, a continuación, proyecta cada uno de ellos sobre el vértice más cercano de un hipercubo (reduciendo cada dimensión a un solo bit). Un estimador de distancia insesgado con un límite de error demostrable mantiene la precisión de la búsqueda a pesar de la compresión.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">¿Qué es IVF_RABITQ y cuándo debo utilizarlo?</h3><p>IVF_RABITQ es un tipo de índice vectorial en Milvus (disponible desde la versión 2.6) que combina la agrupación invertida de archivos con la cuantización RaBitQ de 1 bit. Alcanza una recuperación del 94,7% con un rendimiento 3,6 veces superior a IVF_FLAT, con un uso de memoria de aproximadamente 1/32 de los vectores originales. Utilícelo cuando necesite realizar búsquedas vectoriales a gran escala (de millones a miles de millones de vectores) y el coste de memoria sea una preocupación primordial, algo habitual en las cargas de trabajo de RAG, recomendación y búsqueda multimodal.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">¿Qué relación existe entre la cuantificación vectorial y la compresión de caché KV en los LLM?</h3><p>Ambos problemas implican la compresión de vectores de coma flotante de alta dimensión. La caché KV almacena pares clave-valor del mecanismo de atención Transformer; con longitudes de contexto largas, puede superar los pesos del modelo en uso de memoria. Las técnicas de cuantificación vectorial como RaBitQ reducen estos vectores a representaciones de bits inferiores. Los mismos principios matemáticos -concentración de medidas, rotación aleatoria, estimación insesgada de distancias- se aplican tanto si se comprimen vectores en un índice de base de datos como en la caché KV de un motor de inferencia.</p>
