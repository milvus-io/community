---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: >-
  Comprensión de los mundos pequeños navegables jerárquicos (HNSW) para la
  búsqueda vectorial
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) es un algoritmo eficiente para la
  búsqueda aproximada del vecino más próximo utilizando una estructura de grafos
  en capas.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>La operación clave de las <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de datos vectoriales</a> es la <em>búsqueda de similitudes</em>, que consiste en encontrar los vecinos más próximos en la base de datos a un vector de consulta, por ejemplo, por distancia euclídea. Un método ingenuo calcularía la distancia del vector de consulta a cada vector almacenado en la base de datos y tomaría los K más cercanos. Sin embargo, es evidente que este método no es escalable a medida que aumenta el tamaño de la base de datos. En la práctica, una búsqueda de similitud ingenua sólo es práctica para bases de datos con menos de un millón de vectores. ¿Cómo podemos escalar nuestra búsqueda a decenas o centenas de millones, o incluso a miles de millones de vectores?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Descenso de una jerarquía de índices de búsqueda vectorial</em></p>
<p>Se han desarrollado muchos algoritmos y estructuras de datos para escalar la búsqueda de similitudes en espacios vectoriales de alta dimensión a una complejidad de tiempo sublineal. En este artículo, explicaremos e implementaremos un método popular y eficaz denominado Hierarchical Navigable Small Worlds (HNSW), que suele ser la opción por defecto para conjuntos de datos vectoriales de tamaño medio. Pertenece a la familia de métodos de búsqueda que construyen un grafo sobre los vectores, donde los vértices denotan vectores y las aristas denotan similitud entre ellos. La búsqueda se realiza navegando por el grafo, en el caso más sencillo, recorriendo ávidamente hasta el vecino del nodo actual más cercano a la consulta y repitiendo hasta alcanzar un mínimo local.</p>
<p>Explicaremos con más detalle cómo se construye el grafo de búsqueda, cómo el grafo permite la búsqueda y, al final, enlazaremos con una implementación de HNSW, realizada por un servidor, en Python simple.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Pequeños mundos navegables<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Gráfico NSW creado a partir de 100 puntos 2D situados aleatoriamente.</em></p>
<p>Como ya se ha mencionado, HNSW construye un grafo de búsqueda fuera de línea antes de que podamos realizar una consulta. El algoritmo se basa en un trabajo anterior, un método llamado Navigable Small Worlds (NSW). Explicaremos primero NSW y luego será trivial pasar de ahí a NSW <em>jerárquico</em>. La ilustración anterior muestra un grafo de búsqueda construido para NSW sobre vectores bidimensionales. En todos los ejemplos que siguen, nos limitamos a vectores bidimensionales para poder visualizarlos.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construcción del grafo<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Un NSW es un grafo en el que los vértices representan vectores y las aristas se construyen heurísticamente a partir de la similitud entre vectores, de modo que la mayoría de los vectores son accesibles desde cualquier lugar mediante un pequeño número de saltos. Se trata de la propiedad denominada "mundo pequeño", que permite una navegación rápida. Véase la figura anterior.</p>
<p>El gráfico se inicializa vacío. Se itera a través de los vectores, añadiendo cada uno de ellos al grafo. Para cada vector, comenzando en un nodo de entrada aleatorio, buscamos con avidez los nodos R más cercanos alcanzables desde el punto de entrada <em>en el grafo construido hasta el momento</em>. Estos nodos R se conectan entonces a un nuevo nodo que representa el vector que se inserta, podando opcionalmente cualquier nodo vecino que ahora tenga más de R vecinos. Repitiendo este proceso para todos los vectores se obtendrá el grafo NSW. Consulte la ilustración anterior para visualizar el algoritmo y consulte los recursos al final del artículo para ver un análisis teórico de las propiedades de un grafo construido de este modo.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Búsqueda en el grafo<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Ya hemos visto el algoritmo de búsqueda a partir de su uso en la construcción de grafos. En este caso, sin embargo, el nodo de consulta lo proporciona el usuario, en lugar de ser uno para insertar en el grafo. Partiendo de una nota de entrada aleatoria, navegamos ávidamente hasta su vecino más cercano a la consulta, manteniendo un conjunto dinámico de los vectores más cercanos encontrados hasta el momento. Véase la ilustración anterior. Obsérvese que podemos mejorar la precisión de la búsqueda iniciando búsquedas desde varios puntos de entrada aleatorios y agregando los resultados, además de considerar varios vecinos en cada paso. Sin embargo, estas mejoras se producen a costa de un aumento de la latencia.</p>
<custom-h1>Añadir jerarquía</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hasta ahora hemos descrito el algoritmo NSW y la estructura de datos que pueden ayudarnos a escalar la búsqueda en un espacio de alta dimensión. No obstante, el método adolece de graves deficiencias, como fallos en dimensiones bajas, convergencia lenta de la búsqueda y tendencia a quedar atrapado en mínimos locales.</p>
<p>Los autores de HNSW solucionan estas deficiencias con tres modificaciones de NSW:</p>
<ul>
<li><p>Selección explícita de los nodos de entrada durante la construcción y la búsqueda;</p></li>
<li><p>Separación de aristas por diferentes escalas; y,</p></li>
<li><p>Uso de una heurística avanzada para seleccionar los vecinos.</p></li>
</ul>
<p>Las dos primeras se realizan con una idea sencilla: construir <em>una jerarquía de grafos de búsqueda</em>. En lugar de un único grafo, como en NSW, HNSW construye una jerarquía de grafos. Cada grafo, o capa, se busca individualmente del mismo modo que en NSW. La capa superior, en la que se busca primero, contiene muy pocos nodos, y las capas más profundas incluyen progresivamente más y más nodos, hasta que la capa inferior incluye todos los nodos. Esto significa que las capas superiores contienen saltos más largos a través del espacio vectorial, lo que permite una especie de búsqueda de curso a fin. Véase la ilustración anterior.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construcción del grafo<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>El algoritmo de construcción funciona de la siguiente manera: fijamos un número de capas, <em>L</em>, por adelantado. El valor l=1 corresponderá a la capa más gruesa, donde comienza la búsqueda, y l=L corresponderá a la capa más densa, donde termina la búsqueda. Iteramos por cada vector a insertar y muestreamos una capa de inserción siguiendo una <a href="https://en.wikipedia.org/wiki/Geometric_distribution">distribución geométrica</a> truncada (bien rechazando <em>l &gt; L</em> o bien estableciendo <em>l' =</em> min_(l, L)_). Digamos que muestreamos <em>1 &lt; l &lt; L</em> para el vector actual. Realizamos una búsqueda codiciosa en la capa superior, L, hasta alcanzar su mínimo local. A continuación, seguimos una arista desde el mínimo local en la capa _L_ hasta el vector correspondiente en la capa _(L-1)_ y la utilizamos como punto de entrada para buscar ávidamente en la capa _(L-1)_.</p>
<p>Este proceso se repite hasta llegar a la capa __. Entonces empezamos a crear nodos para el vector que vamos a insertar, conectándolo a sus vecinos más cercanos encontrados por la búsqueda codiciosa en la capa _l_ª construida hasta el momento, navegando hasta la capa _(l-1)_ª y repitiendo hasta que hayamos insertado el vector en la capa _1_ª. La animación anterior lo aclara</p>
<p>Podemos ver que este método de construcción de grafos jerárquicos utiliza una inteligente selección explícita del nodo de inserción para cada vector. Buscamos en las capas por encima de la capa de inserción construida hasta el momento, buscando eficientemente a partir de distancias de curso a fin. En relación con esto, el método separa los enlaces por diferentes escalas en cada capa: la capa superior ofrece saltos a gran escala a través del espacio de búsqueda, y la escala disminuye hasta la capa inferior. Ambas modificaciones ayudan a evitar quedar atrapado en mínimos subóptimos y aceleran la convergencia de la búsqueda a costa de memoria adicional.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Búsqueda en el gráfico<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>El procedimiento de búsqueda funciona de forma muy similar al paso de construcción del grafo interior. Empezando por la capa superior, navegamos ávidamente hasta el nodo o nodos más cercanos a la consulta. A continuación, seguimos ese nodo o nodos hasta la siguiente capa y repetimos el proceso. Nuestra respuesta se obtiene de la lista de <em>R</em> vecinos más cercanos en la capa inferior, como ilustra la animación anterior.</p>
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
    </button></h2><p>Las bases de datos vectoriales como Milvus proporcionan implementaciones altamente optimizadas y ajustadas de HNSW, y a menudo es el mejor índice de búsqueda por defecto para conjuntos de datos que caben en memoria.</p>
<p>Hemos esbozado una visión general de alto nivel de cómo y por qué funciona HNSW, prefiriendo las visualizaciones y la intuición a la teoría y las matemáticas. En consecuencia, hemos omitido una descripción exacta de los algoritmos de construcción y búsqueda<a href="https://arxiv.org/abs/1603.09320">[</a><a href="https://arxiv.org/abs/1603.09320">Malkov y Yashushin,</a><a href="https://arxiv.org/abs/1603.09320">2016</a>; Alg 1-3], el análisis de la complejidad de búsqueda y construcción<a href="https://arxiv.org/abs/1603.09320">[Malkov y Yashushin, 2016</a>; §4.2], y detalles menos esenciales como una heurística para elegir más eficazmente los nodos vecinos durante la construcción<a href="https://arxiv.org/abs/1603.09320">[Malkov y Yashushin, 2016</a>; Alg 5]. Además, hemos omitido la discusión de los hiperparámetros del algoritmo, su significado y cómo afectan al equilibrio latencia/velocidad/memoria<a href="https://arxiv.org/abs/1603.09320">[Malkov y Yashushin, 2016</a>; §4.1]. Comprender esto es importante para utilizar HNSW en la práctica.</p>
<p>Los recursos a continuación contienen lecturas adicionales sobre estos temas y una implementación pedagógica completa en Python (escrita por mí) para NSW y HNSW, incluido el código para producir las animaciones de este artículo.</p>
<custom-h1>Recursos</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Ilustrado: Una pequeña implementación de Hierarchical Navigable Small Worlds (HNSW), un algoritmo de búsqueda vectorial, con fines de aprendizaje</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Documentación de Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Comprender los mundos pequeños navegables jerárquicamente (HNSW) - Zilliz Learn</a></p></li>
<li><p>Documento sobre HNSW: "<a href="https://arxiv.org/abs/1603.09320">Búsqueda aproximada eficiente y robusta del vecino más cercano utilizando grafos Hierarchical Navigable Small Worlds</a>"</p></li>
<li><p>Artículo NSW: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Algoritmo aproximado de vecino más cercano basado en grafos de mundos pequeños navegables</a>"</p></li>
</ul>
