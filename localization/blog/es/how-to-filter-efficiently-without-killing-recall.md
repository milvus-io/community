---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Búsqueda vectorial en el mundo real: cómo filtrar eficazmente sin matar la
  memoria
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Este blog explora las técnicas de filtrado más populares en la búsqueda
  vectorial, junto con las innovadoras optimizaciones que hemos incorporado a
  Milvus y Zilliz Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Mucha gente piensa que la búsqueda vectorial consiste simplemente en implementar un algoritmo RNA (Vecino más próximo aproximado) y ya está. Pero si se utiliza la búsqueda vectorial en producción, se sabe la verdad: se complica rápidamente.</p>
<p>Imagina que estás creando un motor de búsqueda de productos. Un usuario podría preguntar: "<em>Muéstrame zapatos similares a esta foto, pero sólo en rojo y por menos de 100 dólares</em>". Para responder a esta consulta es necesario aplicar un filtro de metadatos a los resultados de la búsqueda por similitud semántica. ¿Suena tan sencillo como aplicar un filtro a los resultados de la búsqueda vectorial? Pues no del todo.</p>
<p>¿Qué ocurre cuando la condición de filtrado es muy selectiva? Puede que no obtenga suficientes resultados. Y el simple aumento del parámetro <strong>topK</strong> de la búsqueda vectorial puede degradar rápidamente el rendimiento y consumir muchos más recursos para gestionar el mismo volumen de búsqueda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bajo el capó, el filtrado eficaz de metadatos es todo un reto. Su base de datos vectorial necesita escanear el índice gráfico, aplicar filtros de metadatos y responder dentro de un presupuesto de latencia ajustado, digamos, 20 milisegundos. Servir miles de consultas de este tipo por segundo sin arruinarse requiere una ingeniería bien pensada y una optimización cuidadosa.</p>
<p>Este blog explora las técnicas de filtrado más populares en la búsqueda vectorial, junto con las innovadoras optimizaciones que hemos incorporado a la base de datos vectorial <a href="https://milvus.io/docs/overview.md">Milvus</a> y a su servicio en la nube totalmente gestionado<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>). También compartiremos una prueba de referencia que demuestra cuánto más rendimiento puede lograr Milvus totalmente gestionado con un presupuesto de $1000 en la nube en comparación con las otras bases de datos vectoriales.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Optimización de índices gráficos<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales necesitan métodos de indexación eficientes para manejar grandes conjuntos de datos. Sin índices, una base de datos debe comparar su consulta con cada vector del conjunto de datos (escaneo de fuerza bruta), lo que se vuelve extremadamente lento a medida que sus datos crecen.</p>
<p><strong>Milvus</strong> admite varios tipos de índices para resolver este problema de rendimiento. Los más populares son los tipos de índices basados en gráficos: HNSW (se ejecuta completamente en memoria) y DiskANN (utiliza eficientemente tanto la memoria como el SSD). Estos índices organizan los vectores en una estructura de red en la que los vecindarios de vectores están conectados en un mapa, lo que permite que las búsquedas naveguen rápidamente a los resultados relevantes mientras se comprueba sólo una pequeña fracción de todos los vectores. <strong>Zilliz Cloud</strong>, el servicio Milvus totalmente gestionado, va un paso más allá al introducir Cardinal, un avanzado motor de búsqueda de vectores propio, que mejora aún más estos índices para obtener un rendimiento aún mejor.</p>
<p>Sin embargo, cuando añadimos requisitos de filtrado (como "mostrar sólo productos de menos de 100 dólares"), surge un nuevo problema. El método estándar consiste en crear un <em>conjunto de bits</em>, es decir, una lista que marca los vectores que cumplen los criterios de filtrado. Durante la búsqueda, el sistema sólo tiene en cuenta los vectores marcados como válidos en este conjunto de bits. Este enfoque parece lógico, pero crea un grave problema: la <strong>conectividad rota</strong>. Cuando se filtran muchos vectores, los caminos cuidadosamente construidos en nuestro índice de grafos se desbaratan.</p>
<p>He aquí un ejemplo sencillo del problema: en el diagrama siguiente, el punto A conecta con B, C y D, pero B, C y D no se conectan directamente entre sí. Si nuestro filtro elimina el punto A (quizá sea demasiado caro), aunque B, C y D sean relevantes para nuestra búsqueda, el camino entre ellos se rompe. Esto crea "islas" de vectores desconectados que se vuelven inalcanzables durante la búsqueda, perjudicando la calidad de los resultados (recall).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Existen dos enfoques comunes para filtrar durante el recorrido del grafo: excluir todos los puntos filtrados por adelantado, o incluir todo y aplicar el filtro después. Como se ilustra en el diagrama siguiente, ninguno de los dos enfoques es ideal. Omitir por completo los puntos filtrados puede hacer que la recuperación se colapse a medida que la proporción de filtrado se acerca a 1 (línea azul), mientras que visitar todos los puntos independientemente de sus metadatos infla el espacio de búsqueda y ralentiza el rendimiento de forma significativa (línea roja).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los investigadores han propuesto varios enfoques para lograr un equilibrio entre recuperación y rendimiento:</p>
<ol>
<li><strong>Estrategia Alfa:</strong> Introduce un enfoque probabilístico: aunque un vector no coincida con el filtro, es posible que lo visitemos durante la búsqueda con cierta probabilidad. Esta probabilidad (alfa) depende del coeficiente de filtrado, es decir, de lo estricto que sea el filtro. Esto ayuda a mantener las conexiones esenciales en el grafo sin visitar demasiados vectores irrelevantes.</li>
</ol>
<ol start="2">
<li><strong>Método ACORN [1]:</strong> En el HNSW estándar, la poda de aristas se utiliza durante la construcción del índice para crear un grafo disperso y acelerar la búsqueda. El método ACORN omite deliberadamente este paso de poda para conservar más aristas y reforzar la conectividad, algo crucial cuando los filtros pueden excluir muchos nodos. En algunos casos, ACORN también amplía la lista de vecinos de cada nodo reuniendo más vecinos más próximos aproximados, lo que refuerza aún más el grafo. Además, su algoritmo de recorrido va dos pasos por delante (es decir, examina a los vecinos de los vecinos), lo que aumenta las posibilidades de encontrar rutas válidas incluso con altos porcentajes de filtrado.</li>
</ol>
<ol start="3">
<li><strong>Vecinos seleccionados dinámicamente:</strong> Un método que mejora la estrategia Alfa. En lugar de basarse en la omisión probabilística, este enfoque selecciona de forma adaptativa los nodos siguientes durante la búsqueda. Ofrece más control que la estrategia alfa.</li>
</ol>
<p>En Milvus, implementamos la estrategia Alfa junto con otras técnicas de optimización. Por ejemplo, cambia dinámicamente de estrategia cuando detecta filtros extremadamente selectivos: cuando, por ejemplo, aproximadamente el 99% de los datos no coinciden con la expresión de filtrado, la estrategia "incluir todo" haría que las rutas transversales del gráfico se alargaran significativamente, lo que daría lugar a una degradación del rendimiento y a "islas" aisladas de datos. En estos casos, Milvus recurre automáticamente a un escaneo de fuerza bruta, omitiendo por completo el índice de grafos para mejorar la eficiencia. En Cardinal, el motor de búsqueda vectorial que impulsa Milvus totalmente gestionado (Zilliz Cloud), hemos llevado esto más allá mediante la implementación de una combinación dinámica de métodos de recorrido "incluir todo" y "excluir todo" que se adapta de forma inteligente en función de las estadísticas de datos para optimizar el rendimiento de la consulta.</p>
<p>Nuestros experimentos con el conjunto de datos Cohere 1M (dimensión = 768) utilizando una instancia AWS r7gd.4xlarge demuestran la eficacia de este enfoque. En el gráfico siguiente, la línea azul representa nuestra estrategia de combinación dinámica, mientras que la línea roja ilustra el enfoque de referencia que recorre todos los puntos filtrados del gráfico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Indexación basada en metadatos<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Otro reto es la relación entre los metadatos y las incrustaciones vectoriales. En la mayoría de las aplicaciones, las propiedades de metadatos de un elemento (por ejemplo, el precio de un producto) tienen una conexión mínima con lo que el vector representa realmente (el significado semántico o las características visuales). Por ejemplo, un <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">vestido</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">90dressanda90</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">y un</annotation></semantics></math></span></span>cinturón <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>comparten el mismo precio pero presentan características visuales completamente diferentes. Esta desconexión hace que combinar el filtrado con la búsqueda vectorial sea intrínsecamente ineficaz.</p>
<p>Para resolver este problema, hemos desarrollado <strong>índices vectoriales que tienen en cuenta los metadatos</strong>. En lugar de tener un único gráfico para todos los vectores, se construyen "subgráficos" especializados para distintos valores de metadatos. Por ejemplo, si sus datos tienen campos de "color" y "forma", se crean estructuras gráficas separadas para estos campos.</p>
<p>Cuando se realiza una búsqueda con un filtro del tipo "color = azul", se utiliza el subgrafo específico del color en lugar del gráfico principal. Esto es mucho más rápido porque el subgráfico ya está organizado en torno a los metadatos por los que se está filtrando.</p>
<p>En la siguiente figura, el índice del gráfico principal se denomina <strong>gráfico base</strong>, mientras que los gráficos especializados creados para campos de metadatos específicos se denominan <strong>gráficos de columnas</strong>. Para gestionar eficazmente el uso de memoria, limita el número de conexiones que puede tener cada punto (out-degree). Cuando una búsqueda no incluye ningún filtro de metadatos, utiliza por defecto el gráfico base. Cuando se aplican filtros, cambia al gráfico de columnas adecuado, lo que supone una importante ventaja de velocidad.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Filtrado iterativo<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>A veces, el propio filtrado se convierte en el cuello de botella, no la búsqueda vectorial. Esto ocurre especialmente con filtros complejos como las condiciones JSON o las comparaciones detalladas de cadenas. El enfoque tradicional (primero filtrar y luego buscar) puede ser extremadamente lento porque el sistema tiene que evaluar estos costosos filtros en millones de registros potenciales antes incluso de iniciar la búsqueda vectorial.</p>
<p>Usted podría pensar: "¿Por qué no hacer primero la búsqueda vectorial y luego filtrar los resultados más importantes?". Este enfoque funciona a veces, pero tiene un fallo importante: si su filtro es estricto y filtra la mayoría de los resultados, puede acabar con muy pocos (o cero) resultados después del filtrado.</p>
<p>Para resolver este dilema, creamos <strong>el filtrado iterativo</strong> en Milvus y Zilliz Cloud, inspirado en<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. En lugar de un enfoque de todo o nada, el filtrado iterativo funciona por lotes:</p>
<ol>
<li><p>Obtiene un lote de las coincidencias vectoriales más cercanas</p></li>
<li><p>Aplicar filtros a este lote</p></li>
<li><p>Si no tenemos suficientes resultados filtrados, obtenemos otro lote</p></li>
<li><p>Repetir hasta obtener el número necesario de resultados</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este enfoque reduce drásticamente el número de operaciones de filtrado costosas que tenemos que realizar, al tiempo que garantiza que obtenemos suficientes resultados de alta calidad. Para obtener más información sobre la activación del filtrado <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">iterativo</a>, consulte esta <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">página de documentación sobre filtrado iterativo</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">Filtrado externo<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchas aplicaciones del mundo real dividen sus datos en diferentes sistemas: vectores en una base de datos vectorial y metadatos en bases de datos tradicionales. Por ejemplo, muchas organizaciones almacenan descripciones de productos y reseñas de usuarios como vectores en Milvus para la búsqueda semántica, mientras mantienen el estado del inventario, los precios y otros datos estructurados en bases de datos tradicionales como PostgreSQL o MongoDB.</p>
<p>Esta separación tiene sentido desde el punto de vista arquitectónico, pero supone un reto para las búsquedas filtradas. El flujo de trabajo típico es el siguiente</p>
<ul>
<li><p>Consultar la base de datos relacional en busca de registros que coincidan con los criterios de filtrado (por ejemplo, "artículos en stock de menos de 50 dólares").</p></li>
<li><p>Obtener los ID coincidentes y enviarlos a Milvus para filtrar la búsqueda vectorial</p></li>
<li><p>Realice la búsqueda semántica sólo en los vectores que coincidan con estos ID.</p></li>
</ul>
<p>Esto parece sencillo, pero cuando el número de filas supera los millones, se convierte en un cuello de botella. La transferencia de grandes listas de ID consume ancho de banda de la red y la ejecución de expresiones de filtrado masivas en Milvus añade sobrecarga.</p>
<p>Para solucionar esto, introdujimos <strong>el filtrado externo</strong> en Milvus, una solución ligera a nivel de SDK que utiliza la API del iterador de búsqueda e invierte el flujo de trabajo tradicional.</p>
<ul>
<li><p>Realiza primero la búsqueda vectorial, recuperando lotes de los candidatos semánticamente más relevantes.</p></li>
<li><p>Aplica su función de filtro personalizada a cada lote en el lado del cliente.</p></li>
<li><p>Obtiene automáticamente más lotes hasta que tiene suficientes resultados filtrados.</p></li>
</ul>
<p>Este enfoque iterativo por lotes reduce significativamente tanto el tráfico de red como la sobrecarga de procesamiento, ya que sólo se trabaja con los candidatos más prometedores de la búsqueda vectorial.</p>
<p>He aquí un ejemplo de cómo utilizar el filtrado externo en pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>A diferencia del Filtrado Iterativo, que opera sobre iteradores a nivel de segmento, el Filtrado Externo trabaja a nivel de consulta global. Este diseño minimiza la evaluación de metadatos y evita la ejecución de filtros grandes dentro de Milvus, lo que resulta en un rendimiento de extremo a extremo más ligero y rápido.</p>
<h2 id="AutoIndex" class="common-anchor-header">AutoIndex<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda vectorial siempre implica un equilibrio entre precisión y velocidad: cuantos más vectores compruebe, mejores serán sus resultados, pero más lenta será su consulta. Cuando se añaden filtros, este equilibrio se vuelve aún más difícil de conseguir.</p>
<p>En Zilliz Cloud, hemos creado <strong>AutoIndex</strong>, un optimizador basado en ML que ajusta automáticamente este equilibrio por usted. En lugar de configurar manualmente parámetros complejos, AutoIndex utiliza el aprendizaje automático para determinar la configuración óptima para sus datos y patrones de consulta específicos.</p>
<p>Para entender cómo funciona esto, ayuda conocer un poco la arquitectura de Milvus, ya que Zilliz está construido sobre Milvus: Las consultas se distribuyen a través de múltiples instancias de QueryNode. Cada nodo maneja una porción de sus datos (un segmento), realiza su búsqueda y luego los resultados se fusionan.</p>
<p>AutoIndex analiza las estadísticas de estos segmentos y realiza ajustes inteligentes. Si el porcentaje de filtrado es bajo, el intervalo de consulta del índice se amplía para aumentar la recuperación. Si el índice de filtrado es alto, el rango de consulta se reduce para evitar desperdiciar esfuerzos en candidatos poco probables. Estas decisiones se basan en modelos estadísticos que predicen la estrategia de búsqueda más eficaz para cada situación específica de filtrado.</p>
<p>AutoIndex va más allá de los parámetros de indexación. También ayuda a seleccionar la mejor estrategia de evaluación de filtros. Mediante el análisis sintáctico de las expresiones de los filtros y el muestreo de los datos de los segmentos, puede estimar el coste de la evaluación. Si detecta costes de evaluación elevados, cambia automáticamente a técnicas más eficaces, como el filtrado iterativo. Este ajuste dinámico garantiza que siempre se utilice la estrategia más adecuada para cada consulta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Rendimiento con un presupuesto de 1.000 dólares<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque las mejoras teóricas son importantes, el rendimiento en el mundo real es lo que importa a la mayoría de los desarrolladores. Queríamos comprobar cómo se traducen estas optimizaciones en el rendimiento real de las aplicaciones con un presupuesto realista.</p>
<p>Comparamos varias soluciones de bases de datos vectoriales con un presupuesto práctico mensual de 1.000 dólares, una cantidad razonable que muchas empresas destinarían a la infraestructura de búsqueda vectorial. Para cada solución, seleccionamos la configuración de instancia de mayor rendimiento posible dentro de esta limitación presupuestaria.</p>
<p>En nuestras pruebas utilizamos</p>
<ul>
<li><p>El conjunto de datos Cohere 1M con 1 millón de vectores de 768 dimensiones.</p></li>
<li><p>Una combinación de cargas de trabajo de búsqueda reales filtradas y sin filtrar</p></li>
<li><p>La herramienta de referencia de código abierto vdb-bench para realizar comparaciones coherentes.</p></li>
</ul>
<p>Las soluciones competidoras (anónimas como "VDB A", "VDB B" y "VDB C") se configuraron de forma óptima dentro del presupuesto. Los resultados mostraron que Milvus (Zilliz Cloud), totalmente gestionado, alcanzó sistemáticamente el mayor rendimiento tanto en las consultas filtradas como en las no filtradas. Con el mismo presupuesto de 1.000 dólares, nuestras técnicas de optimización ofrecen el mayor rendimiento a un precio competitivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>La búsqueda vectorial con filtrado puede parecer sencilla a primera vista: basta con añadir una cláusula de filtrado a la consulta y listo. Sin embargo, como hemos demostrado en este blog, conseguir un alto rendimiento y resultados precisos a gran escala requiere soluciones de ingeniería sofisticadas. Milvus y Zilliz Cloud abordan estos retos a través de varios enfoques innovadores:</p>
<ul>
<li><p><strong>Optimización de índices gráficos</strong>: Preserva las rutas entre elementos similares incluso cuando los filtros eliminan nodos de conexión, evitando el problema de las "islas" que reduce la calidad de los resultados.</p></li>
<li><p><strong>Indexación basada en metadatos</strong>: Crea rutas especializadas para condiciones de filtrado comunes, lo que agiliza significativamente las búsquedas filtradas sin sacrificar la precisión.</p></li>
<li><p><strong>Filtrado iterativo</strong>: Procesa los resultados por lotes, aplicando filtros complejos sólo a los candidatos más prometedores en lugar de a todo el conjunto de datos.</p></li>
<li><p><strong>Autoíndice</strong>: Utiliza el aprendizaje automático para ajustar automáticamente los parámetros de búsqueda en función de sus datos y consultas, equilibrando la velocidad y la precisión sin necesidad de configuración manual.</p></li>
<li><p><strong>Filtrado externo</strong>: Une la búsqueda vectorial con bases de datos externas de forma eficiente, eliminando los cuellos de botella de la red y manteniendo la calidad de los resultados.</p></li>
</ul>
<p>Milvus y Zilliz Cloud siguen evolucionando con nuevas capacidades que mejoran aún más el rendimiento de la búsqueda filtrada. Funciones como<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> permiten una organización aún más eficiente de los datos basada en patrones de filtrado, y las técnicas avanzadas de enrutamiento de subgrafos están ampliando aún más los límites del rendimiento.</p>
<p>El volumen y la complejidad de los datos no estructurados siguen creciendo exponencialmente, creando nuevos retos para los sistemas de búsqueda de todo el mundo. Nuestro equipo está constantemente ampliando los límites de lo que es posible con las bases de datos vectoriales para ofrecer búsquedas más rápidas y escalables basadas en IA.</p>
<p>Si sus aplicaciones están encontrando cuellos de botella en el rendimiento con la búsqueda vectorial filtrada, le invitamos a unirse a nuestra activa comunidad de desarrolladores en <a href="https://milvus.io/community">milvus.io/community</a>, donde puede compartir retos, acceder a la orientación de expertos y descubrir las mejores prácticas emergentes.</p>
<h2 id="References" class="common-anchor-header">Referencias<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
