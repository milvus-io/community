---
id: getting-started-with-hnswlib.md
title: Introducción a HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  HNSWlib, una biblioteca que implementa HNSW, es altamente eficiente y
  escalable, con un buen rendimiento incluso con millones de puntos. Aprenda a
  implementarla en cuestión de minutos.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">La búsqueda semántica</a> permite a las máquinas comprender el lenguaje y obtener mejores resultados de búsqueda, lo que resulta esencial en la IA y el análisis de datos. Una vez representado el lenguaje como <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">incrustaciones</a>, la búsqueda puede realizarse mediante métodos exactos o aproximados. La búsqueda aproximada por <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">vecino</a> más próximo (<a href="https://zilliz.com/glossary/anns">RNA</a>) es un método utilizado para encontrar rápidamente en un conjunto de datos los puntos más cercanos a un punto de consulta dado, a diferencia de <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">la búsqueda exacta por vecino más próximo</a>, que puede ser costosa desde el punto de vista computacional para datos de alta dimensión. La RNA permite una recuperación más rápida al proporcionar resultados aproximadamente próximos a los vecinos más cercanos.</p>
<p>Uno de los algoritmos de búsqueda de vecinos más próximos aproximados (RNA) es <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), implementado en <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, que será el tema central de la discusión de hoy. En este blog:</p>
<ul>
<li><p>Entenderemos el algoritmo HNSW.</p></li>
<li><p>Exploraremos HNSWlib y sus principales características.</p></li>
<li><p>Configurar HNSWlib, incluyendo la creación de índices y la implementación de búsquedas.</p></li>
<li><p>Compararlo con Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Entender HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> es una estructura de datos basada en gráficos que permite búsquedas eficientes de similitud, particularmente en espacios de alta dimensión, mediante la construcción de un gráfico de múltiples capas de redes de "mundo pequeño". Introducido en <a href="https://arxiv.org/abs/1603.09320">2016</a>, HNSW aborda los problemas de escalabilidad asociados con los métodos de búsqueda tradicionales como la fuerza bruta y las búsquedas basadas en árboles. Es ideal para aplicaciones que implican grandes conjuntos de datos, como los sistemas de recomendación, el reconocimiento de imágenes y <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">la generación de recuperación aumentada (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Por qué es importante HNSW</h3><p>HNSW mejora significativamente el rendimiento de la búsqueda del vecino más próximo en espacios de gran dimensión. Al combinar la estructura jerárquica con la navegabilidad en mundos pequeños, se evita la ineficacia computacional de los métodos antiguos, lo que permite obtener buenos resultados incluso con conjuntos de datos masivos y complejos. Para entenderlo mejor, veamos cómo funciona ahora.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Cómo funciona HNSW</h3><ol>
<li><p><strong>Capas jerárquicas:</strong> HNSW organiza los datos en una jerarquía de capas, donde cada capa contiene nodos conectados por aristas. Las capas superiores son más dispersas, lo que permite "saltar" ampliamente por el gráfico, de forma parecida a cuando se aleja el zoom en un mapa para ver sólo las principales autopistas entre ciudades. Las capas inferiores son más densas y ofrecen más detalles y conexiones entre los vecinos más cercanos.</p></li>
<li><p><strong>Concepto de pequeños mundos navegables:</strong> Cada capa de HNSW se basa en el concepto de una red de "mundos pequeños", en la que los nodos (puntos de datos) se encuentran a pocos "saltos" unos de otros. El algoritmo de búsqueda comienza en la capa más alta y dispersa y va descendiendo hacia capas cada vez más densas para refinar la búsqueda. De este modo, se pasa de una visión global a un nivel de vecindad más detallado, reduciendo gradualmente el área de búsqueda.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Fig. 1</a>: Ejemplo de gráfico de mundo pequeño navegable</p>
<ol start="3">
<li><strong>Estructura jerárquica:</strong> El aspecto jerárquico de HNSW se asemeja a una lista de exclusión, una estructura de datos probabilística en la que las capas superiores tienen menos nodos, lo que permite realizar búsquedas iniciales más rápidas.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Fig. 2</a>: Ejemplo de estructura de lista de exclusión</p>
<p>Para buscar 96 en la lista de exclusión dada, empezamos en el nivel superior, en el extremo izquierdo, en el nodo de cabecera. Moviéndonos hacia la derecha, encontramos 31, menos que 96, así que continuamos hasta el siguiente nodo. Ahora, tenemos que bajar un nivel donde volvemos a ver 31; como sigue siendo menor que 96, bajamos otro nivel. Al encontrar 31 una vez más, nos movemos a la derecha y llegamos a 96, nuestro valor objetivo. Así, localizamos 96 sin necesidad de descender a los niveles más bajos de la lista de saltos.</p>
<ol start="4">
<li><p><strong>Eficacia de la búsqueda:</strong> El algoritmo HNSW parte de un nodo de entrada en la capa más alta y avanza hacia los vecinos más cercanos en cada paso. Desciende a través de las capas, utilizando cada una de ellas para una exploración de grano grueso a fino, hasta llegar a la capa más baja, donde probablemente se encuentren los nodos más similares. Esta navegación por capas reduce el número de nodos y aristas que hay que explorar, haciendo que la búsqueda sea rápida y precisa.</p></li>
<li><p><strong>Inserción y mantenimiento</strong>: Al añadir un nuevo nodo, el algoritmo determina su capa de entrada en función de la probabilidad y lo conecta a los nodos cercanos mediante una heurística de selección de vecinos. La heurística pretende optimizar la conectividad, creando enlaces que mejoren la navegabilidad al tiempo que equilibran la densidad del grafo. Este enfoque mantiene la estructura robusta y adaptable a nuevos puntos de datos.</p></li>
</ol>
<p>Aunque tenemos un conocimiento básico del algoritmo HNSW, aplicarlo desde cero puede resultar abrumador. Afortunadamente, la comunidad ha desarrollado bibliotecas como <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> para simplificar su uso, haciéndolo accesible sin tener que rascarse la cabeza. Echemos un vistazo a HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Visión general de HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, una popular librería que implementa HNSW, es altamente eficiente y escalable, funcionando bien incluso con millones de puntos. Alcanza una complejidad temporal sublineal al permitir saltos rápidos entre capas de grafos y optimizar la búsqueda de datos densos y de alta dimensión. Estas son las principales características de HNSWlib</p>
<ul>
<li><p><strong>Estructura basada en grafos:</strong> Un grafo de varias capas representa los puntos de datos, lo que permite realizar búsquedas rápidas por proximidad.</p></li>
<li><p><strong>Eficiencia en altas dimensiones:</strong> Optimizado para datos de alta dimensión, proporciona búsquedas aproximadas rápidas y precisas.</p></li>
<li><p><strong>Tiempo de búsqueda sublineal:</strong> logra una complejidad sublineal saltándose capas, lo que mejora significativamente la velocidad.</p></li>
<li><p><strong>Actualizaciones dinámicas:</strong> Permite insertar y eliminar nodos en tiempo real sin necesidad de reconstruir todo el grafo.</p></li>
<li><p><strong>Eficiencia de memoria:</strong> Uso eficiente de la memoria, adecuado para grandes conjuntos de datos.</p></li>
<li><p><strong>Escalabilidad:</strong> Se adapta bien a millones de puntos de datos, por lo que es ideal para aplicaciones de escala media como los sistemas de recomendación.</p></li>
</ul>
<p><strong>Nota:</strong> HNSWlib es excelente para crear prototipos sencillos de aplicaciones de búsqueda vectorial. Sin embargo, debido a las limitaciones de escalabilidad, puede haber mejores opciones, como <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de datos vectoriales creadas específicamente</a> para escenarios más complejos que impliquen cientos de millones o incluso miles de millones de puntos de datos. Veámoslo en acción.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Primeros pasos con HNSWlib: Guía paso a paso<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta sección demostrará el uso de HNSWlib como <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de búsqueda vectorial</a> mediante la creación de un índice HNSW, la inserción de datos y la realización de búsquedas. Comencemos con la instalación:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Instalación e importaciones</h3><p>Para empezar con HNSWlib en Python, primero instálalo usando pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Luego, importa las librerías necesarias:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Preparación de datos</h3><p>En este ejemplo, vamos a utilizar <code translate="no">NumPy</code>para generar un conjunto de datos aleatorios con 10.000 elementos, cada uno con una dimensión de tamaño 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vamos a crear los datos:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ahora que nuestros datos están listos, vamos a construir un índice.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Creación de un índice</h3><p>Para construir un índice, necesitamos definir la dimensionalidad de los vectores y el tipo de espacio. Creemos un índice:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Este parámetro define la métrica de distancia utilizada para la similitud. Si se establece en <code translate="no">'l2'</code>, se utilizará la distancia euclidiana (norma L2). Si por el contrario lo establecemos en <code translate="no">'ip'</code>, se utilizará el producto interior, que es útil para tareas como la similitud coseno.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Este parámetro especifica la dimensionalidad de los puntos de datos con los que trabajará. Debe coincidir con la dimensión de los datos que planea añadir al índice.</li>
</ul>
<p>Así es como se inicializa un índice:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Establece el número máximo de elementos que se pueden añadir al índice. <code translate="no">Num_elements</code> es la capacidad máxima, así que lo establecemos en 10.000 ya que estamos trabajando con 10.000 puntos de datos.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Este parámetro controla la compensación entre precisión y velocidad de construcción durante la creación del índice. Un valor más alto mejora la recuperación (precisión) pero aumenta el uso de memoria y el tiempo de construcción. Los valores comunes oscilan entre 100 y 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Este parámetro determina el número de enlaces bidireccionales creados para cada punto de datos, lo que influye en la precisión y la velocidad de búsqueda. Los valores típicos están entre 12 y 48; 16 suele ser un buen equilibrio para una precisión y velocidad moderadas.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: El parámetro <code translate="no">ef</code>, abreviatura de "factor de exploración", determina cuántos vecinos se examinan durante una búsqueda. A mayor valor de <code translate="no">ef</code>, más vecinos se exploran, lo que generalmente aumenta la precisión (recall) de la búsqueda, pero también la hace más lenta. Por el contrario, un valor menor de <code translate="no">ef</code> puede hacer que la búsqueda sea más rápida pero puede reducir la precisión.</li>
</ul>
<p>En este caso, establecer <code translate="no">ef</code> a 50 significa que el algoritmo de búsqueda evaluará hasta 50 vecinos cuando encuentre los puntos de datos más similares.</p>
<p>Nota: <code translate="no">ef_construction</code> establece el esfuerzo de búsqueda de vecinos durante la creación del índice, mejorando la precisión pero ralentizando la construcción. <code translate="no">ef</code> controla el esfuerzo de búsqueda durante la consulta, equilibrando la velocidad y la recuperación dinámicamente para cada consulta.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Realización de búsquedas</h3><p>Para realizar una búsqueda de vecinos más cercanos con HNSWlib, primero creamos un vector de consulta aleatorio. En este ejemplo, la dimensionalidad del vector coincide con los datos indexados.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Esta línea genera un vector aleatorio con la misma dimensionalidad que los datos indexados, lo que garantiza la compatibilidad para la búsqueda del vecino más próximo.</li>
<li><code translate="no">knn_query</code>: El método busca los <code translate="no">k</code> vecinos más cercanos de <code translate="no">query_vector</code> dentro del índice <code translate="no">p</code>. Devuelve dos matrices: <code translate="no">labels</code>, que contiene los índices de los vecinos más cercanos, y <code translate="no">distances</code>, que indica las distancias desde el vector de consulta a cada uno de estos vecinos. Aquí, <code translate="no">k=5</code> especifica que queremos encontrar los cinco vecinos más cercanos.</li>
</ul>
<p>Aquí están los resultados después de imprimir las etiquetas y las distancias:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Aquí lo tenemos, una guía sencilla para poner las ruedas en marcha con HNSWlib.</p>
<p>Como ya hemos mencionado, HNSWlib es un gran motor de búsqueda vectorial para crear prototipos o experimentar con conjuntos de datos de tamaño medio. Si tiene requisitos de escalabilidad más altos o necesita otras características de nivel empresarial, es posible que tenga que elegir una base de datos vectorial creada específicamente, como <a href="https://zilliz.com/what-is-milvus">Milvus</a> de código abierto o su servicio totalmente gestionado en <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Por lo tanto, en la siguiente sección, compararemos HNSWlib con Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib frente a bases de datos vectoriales específicas como Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> almacena datos como representaciones matemáticas, lo que permite a <a href="https://zilliz.com/ai-models">los modelos de aprendizaje automático</a> potenciar la búsqueda, las recomendaciones y la generación de texto mediante la identificación de datos a través de <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">métricas de similitud</a> para la comprensión contextual.</p>
<p>Las bibliotecas de índices vectoriales como HNSWlib mejoran la<a href="https://zilliz.com/learn/vector-similarity-search">búsqueda</a> y recuperación de vectores, pero carecen de las funciones de gestión de una base de datos completa. Por otro lado, las bases de datos vectoriales, como <a href="https://milvus.io/">Milvus</a>, están diseñadas para manejar incrustaciones vectoriales a escala, proporcionando ventajas en la gestión de datos, indexación y capacidades de consulta que las bibliotecas independientes suelen carecer. He aquí algunas otras ventajas de utilizar Milvus:</p>
<ul>
<li><p><strong>Búsqueda de similitud vectorial de alta velocidad</strong>: Milvus proporciona un rendimiento de búsqueda a nivel de milisegundos en conjuntos de datos vectoriales a escala de miles de millones, ideal para aplicaciones como la recuperación de imágenes, los sistemas de recomendación, el procesamiento del lenguaje natural<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(PLN</a>) y la generación de recuperación aumentada<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>Escalabilidad y alta disponibilidad:</strong> Diseñado para manejar grandes volúmenes de datos, Milvus se escala horizontalmente e incluye mecanismos de replicación y conmutación por error para mayor fiabilidad.</p></li>
<li><p><strong>Arquitectura distribuida:</strong> Milvus utiliza una arquitectura distribuida y escalable que separa el almacenamiento y la computación en múltiples nodos para mayor flexibilidad y robustez.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Búsqueda híbrida</strong></a><strong>:</strong> Milvus admite la búsqueda multimodal, la <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">búsqueda híbrida dispersa y densa</a>, y la <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">búsqueda</a> híbrida densa y <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">de texto completo</a>, ofreciendo una funcionalidad de búsqueda versátil y flexible.</p></li>
<li><p><strong>Soporte flexible de datos</strong>: Milvus admite varios tipos de datos -vectores, escalares y datos estructurados-, lo que permite una gestión y un análisis sin fisuras dentro de un único sistema.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Comunidad</strong></a> <strong>y soporte</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>activos</strong></a>: Una próspera comunidad proporciona actualizaciones periódicas, tutoriales y soporte, asegurando que Milvus permanezca alineado con las necesidades de los usuarios y los avances en el campo.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Integración de IA</a>: Milvus se ha integrado con varios marcos y tecnologías de IA populares, lo que facilita a los desarrolladores la creación de aplicaciones con sus pilas tecnológicas familiares.</p></li>
</ul>
<p>Milvus también proporciona un servicio totalmente gestionado en <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, que no presenta problemas y es 10 veces más rápido que Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Comparación: Milvus frente a HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Características</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Escalabilidad</td><td style="text-align:center">Maneja miles de millones de vectores con facilidad</td><td style="text-align:center">Adecuado para conjuntos de datos más pequeños debido al uso de RAM</td></tr>
<tr><td style="text-align:center">Ideal para</td><td style="text-align:center">Prototipos, experimentos y aplicaciones empresariales</td><td style="text-align:center">Centrado en prototipos y tareas ligeras de RNA</td></tr>
<tr><td style="text-align:center">Indexación</td><td style="text-align:center">Admite más de 10 algoritmos de indexación, como HNSW, DiskANN, cuantización y binario.</td><td style="text-align:center">Sólo utiliza HNSW basado en grafos</td></tr>
<tr><td style="text-align:center">Integración</td><td style="text-align:center">Ofrece API y servicios nativos en la nube</td><td style="text-align:center">Funciona como una biblioteca ligera e independiente</td></tr>
<tr><td style="text-align:center">Rendimiento</td><td style="text-align:center">Optimizado para grandes volúmenes de datos y consultas distribuidas</td><td style="text-align:center">Ofrece alta velocidad pero escalabilidad limitada</td></tr>
</tbody>
</table>
<p>En general, Milvus es preferible para aplicaciones de producción a gran escala con necesidades de indexación complejas, mientras que HNSWlib es ideal para la creación de prototipos y casos de uso más sencillos.</p>
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
    </button></h2><p>La búsqueda semántica puede consumir muchos recursos, por lo que la estructuración interna de datos, como la que realiza HNSW, es esencial para una recuperación de datos más rápida. Las bibliotecas como HNSWlib se preocupan por la implementación, por lo que los desarrolladores tienen las recetas listas para crear prototipos de capacidades vectoriales. Con unas pocas líneas de código, podemos construir nuestro propio índice y realizar búsquedas.</p>
<p>HNSWlib es una buena forma de empezar. Sin embargo, si queremos crear aplicaciones de IA complejas y listas para la producción, la mejor opción son las bases de datos vectoriales creadas a tal efecto. Por ejemplo, <a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto con muchas características empresariales, como búsqueda vectorial de alta velocidad, escalabilidad, disponibilidad y flexibilidad en cuanto a tipos de datos y lenguaje de programación.</p>
<h2 id="Further-Reading" class="common-anchor-header">Más información<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://zilliz.com/learn/faiss">¿Qué es Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">¿Qué es HNSWlib? Una biblioteca basada en grafos para la búsqueda rápida de RNA </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">¿Qué es ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Una herramienta de evaluación comparativa de VectorDB de código abierto</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">¿Qué son las bases de datos vectoriales y cómo funcionan? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">¿Qué es RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modelos de IA de alto rendimiento para tus aplicaciones de GenAI | Zilliz</a></p></li>
</ul>
