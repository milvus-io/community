---
id: diskann-explained.md
title: Explicación de DiskANN
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Descubra cómo DiskANN ofrece búsquedas vectoriales a escala de miles de
  millones utilizando SSD, equilibrando un bajo uso de memoria, una alta
  precisión y un rendimiento escalable.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">¿Qué es DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">DiskANN</a> representa un cambio de paradigma en la <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda de similitudes vectoriales</a>. Anteriormente, la mayoría de los tipos de índices vectoriales, como HNSW, dependían en gran medida de la memoria RAM para lograr una baja latencia y una alta recuperación. Aunque es eficaz para conjuntos de datos de tamaño moderado, este enfoque resulta prohibitivo y menos escalable a medida que crecen los volúmenes de datos. DiskANN ofrece una alternativa rentable aprovechando las unidades SSD para almacenar el índice, lo que reduce significativamente los requisitos de memoria.</p>
<p>DiskANN emplea una estructura gráfica plana optimizada para el acceso a disco, lo que le permite manejar conjuntos de datos a escala de miles de millones con una fracción de la huella de memoria requerida por los métodos en memoria. Por ejemplo, DiskANN puede indexar hasta mil millones de vectores con una precisión de búsqueda del 95% y una latencia de 5 ms, mientras que los algoritmos basados en RAM alcanzan un máximo de 100-200 millones de puntos con un rendimiento similar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Flujo de trabajo de indexación y búsqueda de vectores con DiskANN</em></p>
<p>Aunque DiskANN puede introducir una latencia ligeramente superior en comparación con los enfoques basados en RAM, la compensación suele ser aceptable dado el importante ahorro de costes y las ventajas de escalabilidad. DiskANN es especialmente adecuado para aplicaciones que requieren búsquedas vectoriales a gran escala en hardware básico.</p>
<p>Este artículo explicará los métodos inteligentes que DiskANN tiene para aprovechar el SSD además de la RAM y reducir las costosas lecturas del SSD.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">¿Cómo funciona DiskANN?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>DiskANN es un método de búsqueda vectorial basado en grafos de la misma familia de métodos que HNSW. Primero construimos un grafo de búsqueda en el que los nodos corresponden a vectores (o grupos de vectores), y las aristas denotan que un par de vectores está "relativamente cerca" en algún sentido. Una búsqueda típica elige aleatoriamente un "nodo de entrada" y navega hasta su vecino más cercano a la consulta, repitiendo de forma codiciosa hasta alcanzar un mínimo local.</p>
<p>Los marcos de indexación basados en grafos difieren principalmente en cómo construyen el grafo de búsqueda y realizan la búsqueda. Y en esta sección, haremos una inmersión técnica en las innovaciones de DiskANN para estos pasos y cómo permiten un rendimiento de baja latencia y baja memoria. (Véase un resumen en la figura anterior).</p>
<h3 id="An-Overview" class="common-anchor-header">Una visión general</h3><p>Suponemos que el usuario ha generado un conjunto de incrustaciones de vectores de documentos. El primer paso consiste en agrupar las incrustaciones. Se construye un grafo de búsqueda para cada cluster por separado utilizando el algoritmo Vamana (explicado en la siguiente sección), y los resultados se fusionan en un único grafo. <em>La estrategia de divide y vencerás para crear el gráfico de búsqueda final reduce significativamente el uso de memoria sin afectar demasiado a la latencia de la búsqueda o a la recuperación.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Cómo almacena DiskANN el índice vectorial en RAM y SSD</em></p>
<p>Una vez creado el gráfico de búsqueda global, se almacena en SSD junto con las incrustaciones vectoriales de precisión completa. Uno de los mayores desafíos es finalizar la búsqueda dentro de un número limitado de lecturas de SSD, ya que el acceso a SSD es costoso en relación con el acceso a RAM. Por ello, se utilizan algunos trucos inteligentes para restringir el número de lecturas:</p>
<p>En primer lugar, el algoritmo Vamana incentiva las rutas más cortas entre nodos cercanos al tiempo que limita el número máximo de vecinos de un nodo. En segundo lugar, se utiliza una estructura de datos de tamaño fijo para almacenar la incrustación de cada nodo y sus vecinos (véase la figura anterior). Esto significa que para acceder a los metadatos de un nodo basta con multiplicar el tamaño de la estructura de datos por el índice del nodo y utilizarlo como desplazamiento, al tiempo que se obtiene la incrustación del nodo. En tercer lugar, debido al funcionamiento de los SSD, podemos recuperar varios nodos por cada solicitud de lectura (en nuestro caso, los nodos vecinos), lo que reduce aún más el número de solicitudes de lectura.</p>
<p>Por otra parte, comprimimos las incrustaciones mediante la cuantificación del producto y las almacenamos en la memoria RAM. De este modo, podemos almacenar miles de millones de datos vectoriales en una memoria que es factible en una sola máquina para calcular rápidamente <em>similitudes vectoriales aproximadas</em> sin lecturas de disco. Esto proporciona una guía para reducir el número de nodos vecinos a los que acceder a continuación en el SSD. Sin embargo, es importante destacar que las decisiones de búsqueda se toman utilizando las <em>similitudes vectoriales exactas</em>, con las incrustaciones completas recuperadas del SSD, lo que garantiza una mayor recuperación. Para enfatizar, hay una fase inicial de búsqueda que utiliza las incrustaciones cuantificadas en memoria, y una búsqueda posterior en un subconjunto más pequeño que se lee del SSD.</p>
<p>En esta descripción, hemos pasado por alto dos pasos importantes, aunque complicados: cómo construir el grafo y cómo buscar en él, los dos pasos indicados en los recuadros rojos de arriba. Examinemos cada uno de ellos.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"Construcción del gráfico "Vamana</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: "Construcción del gráfico "Vamana</em></p>
<p>Los autores de DiskANN desarrollan un método novedoso para construir el grafo de búsqueda, que denominan algoritmo Vamana. Inicializa el grafo de búsqueda añadiendo aleatoriamente O(N) aristas. El resultado es un grafo "bien conectado", aunque sin garantías de convergencia de la búsqueda codiciosa. A continuación, poda y reconecta las aristas de forma inteligente para garantizar que haya suficientes conexiones de largo alcance (véase la figura anterior). Permítanos explicarlo con más detalle:</p>
<h4 id="Initialization" class="common-anchor-header">Inicialización</h4><p>El grafo de búsqueda se inicializa con un grafo dirigido aleatorio en el que cada nodo tiene R vecinos externos. También calculamos el medoide del grafo, es decir, el punto que tiene la distancia media mínima a todos los demás puntos. Esto es análogo a un centroide que es miembro del conjunto de nodos.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Búsqueda de candidatos</h4><p>Tras la inicialización, iteramos sobre los nodos, añadiendo y eliminando aristas en cada paso. En primer lugar, ejecutamos un algoritmo de búsqueda en el nodo seleccionado, p, para generar una lista de candidatos. El algoritmo de búsqueda comienza en el medoide y se acerca cada vez más al nodo seleccionado, añadiendo en cada paso los vecinos del nodo más cercano encontrado hasta el momento. Se devuelve la lista de L nodos encontrados más cercanos a p. (Si no está familiarizado con el concepto, el medoide de un grafo es el punto que tiene la distancia media mínima a todos los demás puntos y actúa como un análogo de un centroide para los grafos).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Podar y añadir aristas</h4><p>Los vecinos candidatos del nodo se ordenan por distancia y, para cada candidato, el algoritmo comprueba si está "demasiado cerca" en dirección a un vecino ya elegido. Si es así, se poda. Así se fomenta la diversidad angular entre los vecinos, lo que empíricamente da lugar a mejores propiedades de navegación. En la práctica, esto significa que una búsqueda que parta de un nodo aleatorio puede alcanzar más rápidamente cualquier nodo objetivo explorando un conjunto disperso de enlaces locales y de largo alcance.</p>
<p>Después de podar las aristas, se añaden las aristas a lo largo de la ruta de búsqueda codiciosa hacia p. Se realizan dos pasadas de poda, variando el umbral de distancia para la poda de modo que las aristas de largo alcance se añadan en la segunda pasada.</p>
<h2 id="What’s-Next" class="common-anchor-header">¿Y ahora qué?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Los trabajos posteriores se han basado en DiskANN para introducir mejoras adicionales. Un ejemplo digno de mención, conocido como <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifica el método para permitir la fácil actualización del índice tras su construcción. Este índice de búsqueda, que proporciona un excelente equilibrio entre los criterios de rendimiento, está disponible en la base de datos vectorial <a href="https://milvus.io/docs/overview.md">Milvus</a> como tipo de índice <code translate="no">DISKANN</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Puede incluso ajustar los parámetros de DiskANN, como <code translate="no">MaxDegree</code> y <code translate="no">BeamWidthRatio</code>: consulte <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">la página de documentación</a> para obtener más detalles.</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Documentación de Milvus sobre el uso de DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: Búsqueda rápida y precisa del vecino más próximo en miles de millones de puntos en un único nodo"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: Un índice RNA rápido y preciso basado en gráficos para la búsqueda de similitud en flujo"</a></p></li>
</ul>
