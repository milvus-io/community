---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  El índice vectorial de la FIV: Cómo funciona y cuándo elegirlo en lugar del
  HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_cover_157df122bc.png
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Aprenda cómo funciona el índice vectorial IVF, cómo acelera la búsqueda ANN y
  cuándo supera a HNSW en velocidad, memoria y eficacia de filtrado.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>En una base de datos vectorial, a menudo necesitamos encontrar rápidamente los resultados más similares entre vastas colecciones de vectores de alta dimensión, como características de imágenes, incrustaciones de texto o representaciones de audio. Sin un índice, la única opción es comparar el vector de consulta con cada uno de los vectores del conjunto de datos. Esta <strong>búsqueda de fuerza bruta</strong> puede funcionar con unos pocos miles de vectores, pero cuando se trata de decenas o cientos de millones, se vuelve insoportablemente lenta y costosa desde el punto de vista informático.</p>
<p>Ahí es donde entra en juego la búsqueda <strong>por vecino más próximo aproximado (RNA</strong> ). Es como buscar un libro concreto en una biblioteca enorme. En lugar de consultar todos los libros uno por uno, se empieza por las secciones con más probabilidades de contenerlo. Puede que no obtenga <em>exactamente</em> los mismos resultados que con una búsqueda completa, pero se acercará mucho, y en una fracción del tiempo. En resumen, la RNA supone una ligera pérdida de precisión a cambio de un aumento significativo de la velocidad y la escalabilidad.</p>
<p>Entre las muchas formas de implementar la búsqueda RNA, <strong>IVF (Inverted File)</strong> y <strong>HNSW (Hierarchical Navigable Small World)</strong> son dos de las más utilizadas. Pero IVF destaca por su eficacia y adaptabilidad en la búsqueda vectorial a gran escala. En este artículo, le explicaremos cómo funciona IVF y cómo se compara con HNSW, para que pueda entender sus ventajas y desventajas y elegir el que mejor se adapte a su carga de trabajo.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">¿Qué es un índice vectorial IVF?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>IVF (archivo invertido)</strong> es uno de los algoritmos más utilizados para RNA. Toma prestada su idea central del "índice invertido" utilizado en los sistemas de recuperación de texto, sólo que esta vez, en lugar de palabras y documentos, estamos tratando con vectores en un espacio de alta dimensión.</p>
<p>Es como organizar una gran biblioteca. Si pusiéramos todos los libros (vectores) en una pila gigante, tardaríamos una eternidad en encontrar lo que necesitamos. La FIV resuelve este problema <strong>agrupando</strong> primero todos los vectores en grupos o <em>cubos</em>. Cada cubo representa una "categoría" de vectores similares, definida por un <strong>centroide, una</strong>especie de resumen o "etiqueta" de todo lo que hay dentro de ese grupo.</p>
<p>Cuando llega una consulta, la búsqueda se realiza en dos pasos:</p>
<p><strong>1. 1. Buscar los clusters más cercanos.</strong> El sistema busca los pocos grupos cuyos centroides están más cerca del vector de consulta, como si se dirigiera directamente a las dos o tres secciones de la biblioteca con más probabilidades de tener su libro.</p>
<p><strong>2. 2. Busque dentro de esos grupos.</strong> Una vez que esté en las secciones correctas, sólo tendrá que buscar en un pequeño conjunto de libros en lugar de en toda la biblioteca.</p>
<p>Este método reduce la cantidad de cálculos en varios órdenes de magnitud. Se siguen obteniendo resultados muy precisos, pero mucho más rápidamente.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Cómo construir un índice vectorial FIV<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>El proceso de creación de un índice vectorial FIV consta de tres pasos principales: Agrupación K-means, Asignación de Vectores y Codificación de Compresión (Opcional). El proceso completo es el siguiente</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Paso 1: K-means Clustering</h3><p>En primer lugar, ejecute el clustering de k-means en el conjunto de datos X para dividir el espacio vectorial de alta dimensión en nlist clusters. Cada clúster está representado por un centroide, que se almacena en la tabla de centroides C. El número de centroides, nlist, es un hiperparámetro clave que determina el grado de detalle de la agrupación.</p>
<p>A continuación se explica cómo funciona k-means:</p>
<ul>
<li><p><strong>Inicialización:</strong> Se seleccionan aleatoriamente <em>nlist</em> vectores como centroides iniciales.</p></li>
<li><p><strong>Asignación:</strong> Para cada vector, calcula su distancia a todos los centroides y asígnalo al más cercano.</p></li>
<li><p><strong>Actualización:</strong> Para cada conglomerado, calcular la media de sus vectores y establecerla como nuevo centroide.</p></li>
<li><p><strong>Iteración y convergencia:</strong> Repite la asignación y la actualización hasta que los centroides dejen de cambiar significativamente o se alcance un número máximo de iteraciones.</p></li>
</ul>
<p>Una vez que k-means converge, los centroides resultantes de la n-lista forman el "directorio índice" de IVF. Definen cómo se divide el conjunto de datos, lo que permite reducir rápidamente el espacio de búsqueda.</p>
<p>Volvamos a la analogía de la biblioteca: formar centroides es como decidir cómo agrupar libros por temas:</p>
<ul>
<li><p>Una nlist más grande significa más secciones, cada una con menos libros y más específicos.</p></li>
<li><p>Una nlist más pequeña significa menos secciones, cada una de las cuales abarca una gama más amplia y variada de temas.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Paso 2: Asignación de vectores</h3><p>A continuación, cada vector se asigna al cluster cuyo centroide está más próximo, formando listas invertidas (Lista_i). Cada lista invertida almacena los ID y la información de almacenamiento de todos los vectores que pertenecen a ese cluster.</p>
<p>Este paso es similar a la clasificación de los libros en sus respectivas secciones. Cuando busque un título más adelante, sólo tendrá que comprobar las pocas secciones que tienen más probabilidades de tenerlo, en lugar de recorrer toda la biblioteca.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Paso 3: Codificación de compresión (opcional)</h3><p>Para ahorrar memoria y acelerar el cálculo, los vectores de cada clúster pueden someterse a una codificación de compresión. Existen dos enfoques comunes:</p>
<ul>
<li><p><strong>SQ8 (Cuantización escalar):</strong> Este método cuantiza cada dimensión de un vector en 8 bits. Para un vector estándar de <code translate="no">float32</code>, cada dimensión suele ocupar 4 bytes. Con SQ8, se reduce a sólo 1 byte, con lo que se consigue una relación de compresión de 4:1 y se mantiene prácticamente intacta la geometría del vector.</p></li>
<li><p><strong>PQ (cuantificación del producto):</strong> Divide un vector de alta dimensión en varios subespacios. Por ejemplo, un vector de 128 dimensiones puede dividirse en 8 subvectores de 16 dimensiones cada uno. En cada subespacio, se preentrena un pequeño libro de códigos (normalmente con 256 entradas) y cada subvector se representa mediante un índice de 8 bits que apunta a la entrada del libro de códigos más cercana. Esto significa que el vector original de 128-D <code translate="no">float32</code> (que requiere 512 bytes) puede representarse utilizando sólo 8 bytes (8 subespacios × 1 byte cada uno), con lo que se consigue una relación de compresión de 64:1.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Cómo utilizar el índice de vectores IVF para la búsqueda<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez construidos la tabla de centroides, las listas invertidas, el codificador de compresión y los libros de códigos (opcional), el índice IVF puede utilizarse para acelerar la búsqueda de similitudes. El proceso suele constar de tres pasos principales, como se muestra a continuación:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Paso 1: Calcular las distancias del vector de consulta a todos los centroides</h3><p>Cuando llega un vector de consulta q, el sistema determina primero a qué clusters es más probable que pertenezca. A continuación, calcula la distancia entre q y cada centroide de la tabla de centroides C, normalmente utilizando la distancia euclídea o el producto interno como métrica de similitud. A continuación, los centroides se ordenan según su distancia al vector de consulta, obteniéndose una lista ordenada del más cercano al más lejano.</p>
<p>Por ejemplo, como se muestra en la ilustración, el orden es: C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Paso 2: Seleccionar los clusters nprobe más cercanos</h3><p>Para evitar escanear todo el conjunto de datos, IVF sólo busca dentro de los <em>nprobe</em> clusters más cercanos al vector de consulta.</p>
<p>El parámetro nprobe define el ámbito de búsqueda y afecta directamente al equilibrio entre velocidad y recuperación:</p>
<ul>
<li><p>Un nprobe más pequeño permite realizar búsquedas más rápidas, pero puede reducir la recuperación.</p></li>
<li><p>Una nprobe mayor mejora la recuperación pero aumenta la latencia.</p></li>
</ul>
<p>En los sistemas del mundo real, nprobe puede ajustarse dinámicamente en función del presupuesto de latencia o de los requisitos de precisión. En el ejemplo anterior, si nprobe = 2, el sistema sólo buscará en el clúster 2 y el clúster 4, los dos clústeres más cercanos.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Paso 3: Búsqueda del vecino más cercano en los clusters seleccionados</h3><p>Una vez seleccionados los clusters candidatos, el sistema compara el vector de consulta q con los vectores almacenados dentro de ellos. Existen dos modos principales de comparación:</p>
<ul>
<li><p><strong>Comparación exacta (IVF_FLAT)</strong>: El sistema recupera los vectores originales de los clusters seleccionados y calcula sus distancias a q directamente, devolviendo los resultados más exactos.</p></li>
<li><p><strong>Comparación aproximada (IVF_PQ / IVF_SQ8)</strong>: Cuando se utiliza la compresión PQ o SQ8, el sistema emplea un <strong>método de tabla de consulta</strong> para acelerar el cálculo de distancias. Antes de iniciar la búsqueda, calcula previamente las distancias entre el vector de consulta y cada entrada del libro de códigos. Después, para cada vector, puede simplemente "buscar y sumar" estas distancias precalculadas para estimar la similitud.</p></li>
</ul>
<p>Por último, los resultados candidatos de todos los clusters buscados se fusionan y se vuelven a clasificar, obteniéndose como resultado final el Top-k de vectores más similares.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">IVF en la práctica<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que entienda cómo se <strong>construyen</strong> y <strong>buscan</strong> los índices vectoriales IVF, el siguiente paso es aplicarlos a las cargas de trabajo del mundo real. En la práctica, a menudo tendrá que equilibrar el <strong>rendimiento</strong>, la <strong>precisión</strong> y el <strong>uso de memoria</strong>. A continuación se ofrecen algunas directrices prácticas extraídas de la experiencia en ingeniería.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Cómo elegir la nlist adecuada</h3><p>Como ya se ha mencionado, el parámetro nlist determina el número de clusters en los que se divide el conjunto de datos cuando se construye un índice FIV.</p>
<ul>
<li><p><strong>Nlist más grande</strong>: Crea clusters más finos, lo que significa que cada cluster contiene menos vectores. Esto reduce el número de vectores escaneados durante la búsqueda y, en general, acelera las consultas. Sin embargo, la creación del índice lleva más tiempo y la tabla de centroides consume más memoria.</p></li>
<li><p><strong>Nlist más pequeña</strong>: Acelera la construcción del índice y reduce el consumo de memoria, pero cada cluster se vuelve más "abarrotado". Cada consulta debe escanear más vectores dentro de un cluster, lo que puede provocar cuellos de botella en el rendimiento.</p></li>
</ul>
<p>Basándose en estas compensaciones, he aquí una regla práctica:</p>
<p>Para conjuntos de datos a <strong>escala de millones</strong>, un buen punto de partida es <strong>nlist ≈ √n</strong> (n es el número de vectores en el fragmento de datos que se indexa).</p>
<p>Por ejemplo, si tiene 1 millón de vectores, pruebe con nlist = 1.000. Para conjuntos de datos más grandes -decenas o cientos de millones-, la mayoría de las bases de datos vectoriales dividen los datos de forma que cada fragmento contenga alrededor de un millón de vectores, por lo que esta regla resulta práctica.</p>
<p>Dado que nlist se fija en el momento de crear el índice, cambiarlo más tarde significa reconstruir todo el índice. Así que es mejor experimentar pronto. Pruebe varios valores -idealmente en potencias de dos (por ejemplo, 1024, 2048)- para encontrar el punto óptimo que equilibre velocidad, precisión y memoria para su carga de trabajo.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Cómo ajustar nprobe</h3><p>El parámetro nprobe controla el número de clusters buscados durante la consulta. Afecta directamente al equilibrio entre recuperación y latencia.</p>
<ul>
<li><p><strong>Mayor nprobe</strong>: Abarca más clusters, lo que conlleva una mayor recuperación pero también una mayor latencia. El retraso suele aumentar linealmente con el número de grupos consultados.</p></li>
<li><p><strong>Sonda más pequeña</strong>: Busca en menos conglomerados, lo que reduce la latencia y acelera las consultas. Sin embargo, puede pasar por alto algunos vecinos más cercanos verdaderos, lo que reduce ligeramente la recuperación y la precisión de los resultados.</p></li>
</ul>
<p>Si su aplicación no es extremadamente sensible a la latencia, es una buena idea experimentar con nprobe de forma dinámica, por ejemplo, probando valores de 1 a 16 para observar cómo cambian la recuperación y la latencia. El objetivo es encontrar el punto óptimo en el que la recuperación sea aceptable y la latencia se mantenga dentro del rango objetivo.</p>
<p>Dado que nprobe es un parámetro de búsqueda en tiempo de ejecución, puede ajustarse sobre la marcha sin necesidad de reconstruir el índice. Esto permite un ajuste rápido, de bajo coste y muy flexible entre diferentes cargas de trabajo o escenarios de consulta.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Variantes comunes del índice IVF</h3><p>Al crear un índice IVF, deberá decidir si desea utilizar la codificación de compresión para los vectores de cada clúster y, en caso afirmativo, qué método utilizar.</p>
<p>Esto da lugar a tres variantes comunes del índice FIV:</p>
<table>
<thead>
<tr><th><strong>Variante FIV</strong></th><th><strong>Características principales</strong></th><th><strong>Casos de uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Almacena vectores en bruto dentro de cada clúster sin compresión. Ofrece la mayor precisión, pero también consume más memoria.</td><td>Ideal para conjuntos de datos a mediana escala (hasta cientos de millones de vectores) en los que se requiere una alta capacidad de recuperación (95%+).</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Aplica cuantificación de producto (PQ) para comprimir vectores dentro de clusters. Ajustando el ratio de compresión, el uso de memoria puede reducirse significativamente.</td><td>Adecuado para la búsqueda de vectores a gran escala (cientos de millones o más) donde es aceptable cierta pérdida de precisión. Con una relación de compresión de 64:1, la recuperación suele rondar el 70%, pero puede alcanzar el 90% o más reduciendo la relación de compresión.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Utiliza cuantificación escalar (SQ8) para cuantificar vectores. El uso de memoria se sitúa entre IVF_FLAT e IVF_PQ.</td><td>Ideal para búsquedas vectoriales a gran escala en las que se necesita mantener una recuperación relativamente alta (90%+) a la vez que se mejora la eficiencia.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW: Elija lo que más le convenga<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de IVF, <strong>HNSW (Hierarchical Navigable Small World)</strong> es otro índice vectorial en memoria ampliamente utilizado. La siguiente tabla muestra las principales diferencias entre ambos.</p>
<table>
<thead>
<tr><th></th><th><strong>IVF</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algoritmo Concepto</strong></td><td>Clustering y bucketing</td><td>Navegación gráfica multicapa</td></tr>
<tr><td><strong>Uso de memoria</strong></td><td>Relativamente bajo</td><td>Relativamente alto</td></tr>
<tr><td><strong>Velocidad de creación de índices</strong></td><td>Rápida (sólo requiere agrupación)</td><td>Lenta (requiere la construcción de grafos multicapa)</td></tr>
<tr><td><strong>Velocidad de consulta (sin filtrado)</strong></td><td>Rápida, depende de <em>nprobe</em></td><td>Extremadamente rápida, pero con complejidad logarítmica</td></tr>
<tr><td><strong>Velocidad de consulta (con filtrado)</strong></td><td>Estable - realiza un filtrado grueso en el nivel del centroide para limitar los candidatos</td><td>Inestable - especialmente cuando el ratio de filtrado es alto (90%+), el gráfico se fragmenta y puede degradarse a un recorrido casi completo, incluso más lento que la búsqueda por fuerza bruta.</td></tr>
<tr><td><strong>Tasa de recuperación</strong></td><td>Depende de si se utiliza compresión; sin cuantización, la recuperación puede alcanzar <strong>el 95%+</strong>.</td><td>Suele ser superior, en torno <strong>al 98%+</strong>.</td></tr>
<tr><td><strong>Parámetros clave</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Casos prácticos</strong></td><td>Cuando la memoria es limitada, pero se requiere un alto rendimiento de consulta y recuperación; muy adecuado para búsquedas con condiciones de filtrado.</td><td>Cuando la memoria es suficiente y el objetivo es una recuperación y un rendimiento de la consulta extremadamente altos, pero no se necesita filtrado o el porcentaje de filtrado es bajo.</td></tr>
</tbody>
</table>
<p>En las aplicaciones del mundo real, es muy común incluir condiciones de filtrado; por ejemplo, "buscar sólo vectores de un usuario específico" o "limitar los resultados a un determinado intervalo de tiempo". Debido a las diferencias en sus algoritmos subyacentes, IVF suele gestionar las búsquedas filtradas de forma más eficiente que HNSW.</p>
<p>La fuerza de IVF reside en su proceso de filtrado a dos niveles. En primer lugar, puede realizar un filtro de grano grueso a nivel de centroide (conglomerado) para reducir rápidamente el conjunto de candidatos y, a continuación, realizar cálculos de distancia de grano fino dentro de los conglomerados seleccionados. De este modo se mantiene un rendimiento estable y predecible, incluso cuando se filtra una gran parte de los datos.</p>
<p>En cambio, HNSW se basa en el recorrido de grafos. Debido a su estructura, no puede aprovechar directamente las condiciones de filtrado durante el recorrido. Cuando la proporción de filtrado es baja, esto no causa grandes problemas. Sin embargo, cuando la proporción de filtrado es alta (por ejemplo, se filtra más del 90% de los datos), el grafo restante suele fragmentarse, formando muchos "nodos aislados". En tales casos, la búsqueda puede degradarse hasta convertirse en un recorrido casi completo del grafo, a veces incluso peor que una búsqueda por fuerza bruta.</p>
<p>En la práctica, los índices IVF ya están impulsando muchos casos de uso de gran impacto en distintos ámbitos:</p>
<ul>
<li><p><strong>Búsqueda en comercio electrónico:</strong> Un usuario puede subir una imagen de un producto y encontrar al instante artículos visualmente similares entre millones de listados.</p></li>
<li><p><strong>Recuperación de patentes:</strong> Dada una breve descripción, el sistema puede localizar las patentes más relacionadas semánticamente a partir de una base de datos masiva, mucho más eficiente que la búsqueda tradicional por palabras clave.</p></li>
<li><p><strong>Bases de conocimiento RAG:</strong> IVF ayuda a recuperar el contexto más relevante de millones de documentos de inquilinos, lo que garantiza que los modelos de IA generen respuestas más precisas y fundamentadas.</p></li>
</ul>
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
    </button></h2><p>Para elegir el índice adecuado, todo se reduce a su caso de uso específico. Si trabaja con conjuntos de datos a gran escala o necesita realizar búsquedas filtradas, IVF puede ser la mejor opción. En comparación con los índices basados en gráficos como HNSW, IVF ofrece una construcción de índices más rápida, un menor uso de memoria y un sólido equilibrio entre velocidad y precisión.</p>
<p><a href="https://milvus.io/">Milvus</a>, la base de datos vectorial de código abierto más popular, proporciona soporte completo para toda la familia IVF, incluyendo IVF_FLAT, IVF_PQ e IVF_SQ8. Puede experimentar fácilmente con estos tipos de índices y encontrar la configuración que mejor se adapte a sus necesidades de rendimiento y memoria. Para obtener una lista completa de los índices que soporta Milvus, consulte esta <a href="https://milvus.io/docs/index-explained.md">página Milvus Index doc page</a>.</p>
<p>Si está construyendo una búsqueda de imágenes, sistemas de recomendación o bases de conocimiento RAG, pruebe la indexación IVF en Milvus y vea cómo se siente la búsqueda vectorial eficiente a gran escala en acción.</p>
