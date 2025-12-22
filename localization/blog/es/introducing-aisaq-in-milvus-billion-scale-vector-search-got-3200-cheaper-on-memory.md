---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Presentación de AISAQ en Milvus: la búsqueda vectorial a escala de miles de
  millones es 3.200 veces más barata en memoria
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Descubra cómo Milvus reduce los costes de memoria en 3200× con AISAQ,
  permitiendo la búsqueda escalable de miles de millones de vectores sin
  sobrecarga de DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Las bases de datos vectoriales se han convertido en la infraestructura central de los sistemas de IA de misión crítica, y sus volúmenes de datos crecen exponencialmente, alcanzando a menudo los miles de millones de vectores. A esa escala, todo se vuelve más difícil: mantener una baja latencia, preservar la precisión, garantizar la fiabilidad y operar a través de réplicas y regiones. Pero hay un reto que suele aparecer pronto y dominar las decisiones arquitectónicas: EL COSTE<strong>.</strong></p>
<p>Para ofrecer una búsqueda rápida, la mayoría de las bases de datos vectoriales mantienen las estructuras de indexación clave en DRAM (memoria dinámica de acceso aleatorio), el nivel de memoria más rápido y caro. Este diseño es eficaz en términos de rendimiento, pero su escalabilidad es deficiente. El uso de DRAM aumenta con el tamaño de los datos y no con el tráfico de consultas, e incluso con compresión o descarga parcial de SSD, grandes partes del índice deben permanecer en memoria. A medida que crecen los conjuntos de datos, los costes de memoria se convierten rápidamente en un factor limitante.</p>
<p>Milvus ya es compatible con <strong>DISKANN</strong>, un enfoque de RNA basado en disco que reduce la presión de la memoria trasladando gran parte del índice a SSD. Sin embargo, DISKANN sigue dependiendo de la DRAM para las representaciones comprimidas utilizadas durante la búsqueda. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> va más allá con <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un índice vectorial basado en disco inspirado en <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Desarrollada por KIOXIA, la arquitectura de AiSAQ se diseñó con una "arquitectura de huella cero de DRAM", que almacena todos los datos críticos para la búsqueda en disco y optimiza la colocación de los datos para minimizar las operaciones de E/S. En una carga de trabajo de mil millones de vectores, esto reduce el uso de memoria de <strong>32 GB a unos 10 MB (una</strong> <strong>reducción de 3.200 veces),</strong>manteniendo un rendimiento práctico.</p>
<p>En las secciones siguientes, explicamos cómo funciona la búsqueda vectorial basada en grafos, de dónde proceden los costes de memoria y cómo AISAQ modifica la curva de costes de la búsqueda vectorial a escala de miles de millones.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Funcionamiento de la búsqueda vectorial convencional basada en grafos<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>búsqueda vectorial</strong> es el proceso de encontrar puntos de datos cuyas representaciones numéricas sean las más cercanas a una consulta en un espacio de alta dimensión. "Más cercano" significa simplemente la menor distancia según una función de distancia, como la distancia coseno o la distancia L2. A pequeña escala, esto es sencillo: se calcula la distancia entre la consulta y cada vector y se devuelven los más cercanos. Sin embargo, a gran escala (por ejemplo, a escala de miles de millones), este método se vuelve demasiado lento para ser práctico.</p>
<p>Para evitar las comparaciones exhaustivas, los sistemas modernos de búsqueda aproximada por vecino más próximo (ANNS) se basan en <strong>índices gráficos</strong>. En lugar de comparar una consulta con cada vector, el índice organiza los vectores en un <strong>grafo</strong>. Cada nodo representa un vector y las aristas conectan vectores numéricamente próximos. Esta estructura permite reducir drásticamente el espacio de búsqueda.</p>
<p>El grafo se construye de antemano, basándose únicamente en las relaciones entre vectores. No depende de las consultas. Cuando llega una consulta, la tarea del sistema consiste en <strong>navegar por el grafo de manera eficiente</strong> e identificar los vectores con la menor distancia a la consulta, sin escanear todo el conjunto de datos.</p>
<p>La búsqueda parte de un <strong>punto de entrada</strong> predefinido en el grafo. Este punto de partida puede estar lejos de la consulta, pero el algoritmo mejora su posición paso a paso moviéndose hacia vectores que parecen estar más cerca de la consulta. Durante este proceso, la búsqueda mantiene dos estructuras de datos internas que funcionan conjuntamente: una <strong>lista de candidatos</strong> y una <strong>lista de resultados</strong>.</p>
<p>Y los dos pasos más importantes durante este proceso son la expansión de la lista de candidatos y la actualización de la lista de resultados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Ampliar la lista de candidatos</h3><p>La <strong>lista</strong> de <strong>candidatos</strong> representa el siguiente paso de la búsqueda. Se trata de un conjunto priorizado de nodos del grafo que parecen prometedores en función de su distancia a la consulta.</p>
<p>En cada iteración, el algoritmo</p>
<ul>
<li><p><strong>Selecciona el candidato más cercano descubierto hasta el momento.</strong> De la lista de candidatos, elige el vector con la menor distancia a la consulta.</p></li>
<li><p><strong>Recoge los vecinos de ese vector en el gráfico.</strong> Estos vecinos son vectores que se identificaron durante la construcción del índice como cercanos al vector actual.</p></li>
<li><p><strong>Evalúa los vecinos no visitados y los añade a la lista de candidatos.</strong> Para cada vecino que aún no ha sido explorado, el algoritmo calcula su distancia a la consulta. Los vecinos visitados anteriormente se omiten, mientras que los nuevos vecinos se insertan en la lista de candidatos si parecen prometedores.</p></li>
</ul>
<p>Al ampliar repetidamente la lista de candidatos, la búsqueda explora regiones cada vez más relevantes del grafo. De este modo, el algoritmo avanza constantemente hacia mejores respuestas mientras examina sólo una pequeña fracción de todos los vectores.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Actualización de la lista de resultados</h3><p>Al mismo tiempo, el algoritmo mantiene una <strong>lista</strong> de resultados, que registra los mejores candidatos encontrados hasta el momento para la salida final. A medida que avanza la búsqueda</p>
<ul>
<li><p><strong>Rastrea los vectores más cercanos encontrados durante la travesía.</strong> Esto incluye los vectores seleccionados para la expansión, así como otros evaluados a lo largo del camino.</p></li>
<li><p><strong>Almacena sus distancias a la consulta.</strong> Esto permite clasificar a los candidatos y mantener el top-K actual de vecinos más cercanos.</p></li>
</ul>
<p>Con el tiempo, a medida que se evalúan más candidatos y se encuentran menos mejoras, la lista de resultados se estabiliza. Cuando es improbable que una mayor exploración del grafo produzca vectores más cercanos, la búsqueda termina y devuelve la lista de resultados como respuesta final.</p>
<p>En términos sencillos, la <strong>lista de candidatos controla la exploración</strong>, mientras que la <strong>lista de resultados recoge las mejores respuestas descubiertas hasta el momento</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">El compromiso de la búsqueda vectorial basada en grafos<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Este enfoque basado en grafos es lo que hace que la búsqueda vectorial a gran escala sea práctica en primer lugar. Al navegar por el grafo en lugar de escanear cada vector, el sistema puede encontrar resultados de alta calidad tocando sólo una pequeña fracción del conjunto de datos.</p>
<p>Sin embargo, esta eficacia no es gratuita. La búsqueda basada en grafos presenta un equilibrio fundamental <strong>entre precisión y coste.</strong></p>
<ul>
<li><p>Explorar más vecinos mejora la precisión al abarcar una porción mayor del gráfico y reducir la posibilidad de omitir los verdaderos vecinos más cercanos.</p></li>
<li><p>Al mismo tiempo, cada expansión adicional añade trabajo: más cálculos de distancia, más accesos a la estructura del grafo y más lecturas de datos vectoriales. A medida que la búsqueda es más profunda o más amplia, estos costes se acumulan. Dependiendo de cómo esté diseñado el índice, se manifiestan como un mayor uso de la CPU, una mayor presión de la memoria o más E/S de disco.</p></li>
</ul>
<p>Equilibrar estas fuerzas opuestas -alta recuperación frente a uso eficiente de los recursos- es fundamental para el diseño de búsquedas basadas en grafos.</p>
<p>Tanto <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> como <strong>AISAQ</strong> se basan en esta misma tensión, pero toman diferentes decisiones arquitectónicas sobre cómo y dónde se pagan estos costes.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Cómo optimiza DISKANN la búsqueda vectorial basada en disco<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DISKANN es la solución RNA basada en disco más influyente hasta la fecha y sirve como base oficial para la competición NeurIPS Big ANN, una referencia mundial para la búsqueda vectorial a escala de miles de millones. Su importancia no radica sólo en el rendimiento, sino en lo que ha demostrado: la <strong>búsqueda de RNA basada en grafos no tiene por qué vivir enteramente en la memoria para ser rápida</strong>.</p>
<p>Combinando el almacenamiento basado en SSD con estructuras en memoria cuidadosamente seleccionadas, DISKANN demostró que la búsqueda vectorial a gran escala podía alcanzar una gran precisión y una baja latencia en hardware básico, sin necesidad de ocupar grandes espacios de memoria DRAM. Para ello, se replantea <em>qué partes de la búsqueda deben ser rápidas</em> y <em>qué partes pueden tolerar un acceso más lento</em>.</p>
<p><strong>A un alto nivel, DISKANN mantiene en memoria los datos a los que se accede con más frecuencia, mientras que traslada al disco las estructuras más grandes a las que se accede con menos frecuencia.</strong> Este equilibrio se consigue mediante varias opciones de diseño clave.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. 1. Uso de distancias PQ para ampliar la lista de candidatos</h3><p>La ampliación de la lista de candidatos es la operación más frecuente en la búsqueda basada en grafos. Cada expansión requiere estimar la distancia entre el vector de consulta y los vecinos de un nodo candidato. Realizar estos cálculos utilizando vectores completos y de alta dimensión requeriría frecuentes lecturas aleatorias del disco, una operación costosa tanto desde el punto de vista computacional como en términos de entrada/salida.</p>
<p>DISKANN evita este coste comprimiendo los vectores en <strong>códigos Product Quantization (PQ)</strong> y guardándolos en memoria. Los códigos PQ son mucho más pequeños que los vectores completos, pero conservan suficiente información para estimar la distancia de forma aproximada.</p>
<p>Durante la expansión de candidatos, DISKANN calcula las distancias utilizando estos códigos PQ en memoria en lugar de leer los vectores completos del SSD. Esto reduce drásticamente la E/S de disco durante el recorrido del gráfico, lo que permite que la búsqueda amplíe los candidatos de forma rápida y eficiente, manteniendo la mayor parte del tráfico SSD fuera de la ruta crítica.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. 2. Co-localización de vectores completos y listas de vecinos en disco</h3><p>No todos los datos pueden comprimirse o accederse de forma aproximada. Una vez identificados los candidatos prometedores, la búsqueda sigue necesitando acceder a dos tipos de datos para obtener resultados precisos:</p>
<ul>
<li><p><strong>Listas de vecinos</strong>, para seguir recorriendo el gráfico</p></li>
<li><p><strong>Vectores completos (sin comprimir</strong>), para la clasificación final.</p></li>
</ul>
<p>Estas estructuras se acceden con menos frecuencia que los códigos PQ, por lo que DISKANN las almacena en SSD. Para minimizar la sobrecarga del disco, DISKANN coloca la lista de vecinos de cada nodo y su vector completo en la misma región física del disco. Esto garantiza que una única lectura en SSD pueda recuperar ambos datos.</p>
<p>Al ubicar conjuntamente los datos relacionados, DISKANN reduce el número de accesos aleatorios al disco necesarios durante la búsqueda. Esta optimización mejora la eficiencia tanto de la expansión como de la reordenación, especialmente a gran escala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansión paralela de nodos para una mejor utilización del SSD</h3><p>La búsqueda de RNA basada en grafos es un proceso iterativo. Si en cada iteración sólo se expande un nodo candidato, el sistema emite una única lectura de disco cada vez, dejando sin utilizar la mayor parte del ancho de banda paralelo del SSD. Para evitar esta ineficacia, DISKANN expande múltiples candidatos en cada iteración y envía peticiones de lectura paralelas al SSD. Este enfoque aprovecha mucho mejor el ancho de banda disponible y reduce el número total de iteraciones necesarias.</p>
<p>El parámetro <strong>beam_width_ratio</strong> controla cuántos candidatos se expanden en paralelo: <strong>Ancho del haz = número de núcleos de CPU × ratio_ancho_haz.</strong> Una relación más alta amplía la búsqueda, lo que puede mejorar la precisión, pero también aumenta el cálculo y la E/S de disco.</p>
<p>Para compensar esto, DISKANN introduce una función <code translate="no">search_cache_budget_gb_ratio</code> que reserva memoria para almacenar en caché los datos a los que se accede con más frecuencia, reduciendo así las lecturas repetidas de SSD. Juntos, estos mecanismos ayudan a DISKANN a equilibrar la precisión, la latencia y la eficiencia de E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Por qué es importante y dónde están los límites</h3><p>El diseño de DISKANN supone un gran paso adelante en la búsqueda vectorial basada en disco. Al mantener los códigos PQ en memoria y enviar las estructuras más grandes a SSD, se reduce significativamente la huella de memoria en comparación con los índices de grafos totalmente en memoria.</p>
<p>Al mismo tiempo, esta arquitectura sigue dependiendo de <strong>la memoria DRAM permanente</strong> para los datos críticos de la búsqueda. Los códigos PQ, las memorias caché y las estructuras de control deben permanecer residentes en memoria para mantener la eficiencia de la búsqueda. A medida que los conjuntos de datos crecen hasta alcanzar miles de millones de vectores y los despliegues añaden réplicas o regiones, este requisito de memoria puede convertirse en un factor limitante.</p>
<p>Esta es la carencia que <strong>AISAQ</strong> pretende resolver.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Cómo funciona AISAQ y por qué es importante<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>AISAQ se basa directamente en las ideas centrales de DISKANN, pero introduce un cambio fundamental: elimina <strong>la necesidad de mantener los datos PQ en DRAM</strong>. En lugar de tratar los vectores comprimidos como estructuras críticas para la búsqueda, siempre en memoria, AISAQ los traslada a SSD y rediseña la disposición de los datos gráficos en el disco para preservar una navegación eficiente.</p>
<p>Para que esto funcione, AISAQ reorganiza el almacenamiento de nodos de modo que los datos necesarios durante la búsqueda de grafos (vectores completos, listas de vecinos e información PQ) se dispongan en el disco en patrones optimizados para la localidad de acceso. El objetivo no es sólo enviar más datos al disco, más económico, sino hacerlo <strong>sin interrumpir el proceso de búsqueda descrito anteriormente</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para responder a los distintos requisitos de las aplicaciones, AISAQ ofrece dos modos de almacenamiento en disco: Rendimiento y Escala. Desde una perspectiva técnica, estos modos difieren principalmente en cómo se almacenan los datos comprimidos PQ y cómo se accede a ellos durante la búsqueda. Desde el punto de vista de la aplicación, estos modos responden a dos tipos de requisitos distintos: requisitos de baja latencia, típicos de los sistemas de búsqueda semántica y recomendación en línea, y requisitos de escala ultraelevada, típicos de RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">Rendimiento de AISAQ: Optimizado para la velocidad</h3><p>AISAQ-performance mantiene todos los datos en disco y reduce la sobrecarga de E/S mediante la colocación de datos.</p>
<p>En este modo:</p>
<ul>
<li><p>El vector completo de cada nodo, la lista de aristas y los códigos PQ de sus vecinos se almacenan juntos en el disco.</p></li>
<li><p>La visita a un nodo sólo requiere <strong>una única lectura de SSD</strong>, ya que todos los datos necesarios para la expansión y evaluación de candidatos están ubicados en el mismo lugar.</p></li>
</ul>
<p>Desde la perspectiva del algoritmo de búsqueda, esto refleja fielmente el patrón de acceso de DISKANN. La expansión de candidatos sigue siendo eficiente y el rendimiento en tiempo de ejecución es comparable, a pesar de que todos los datos críticos para la búsqueda se encuentran ahora en el disco.</p>
<p>La contrapartida es la sobrecarga de almacenamiento. Dado que los datos PQ de un vecino pueden aparecer en las páginas de disco de varios nodos, esta disposición introduce redundancia y aumenta significativamente el tamaño total del índice.</p>
<p>Por lo tanto, el modo AISAQ-Performance prioriza la baja latencia de E/S sobre la eficiencia del disco. Desde el punto de vista de la aplicación, el modo AiSAQ-Performance puede ofrecer una latencia en el rango de los 10 mSeg, como se requiere para la búsqueda semántica en línea.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">Escala AISAQ: Optimizado para la eficiencia del almacenamiento</h3><p>AISAQ-Scale adopta el enfoque opuesto. Está diseñado para <strong>minimizar el uso del disco</strong> y, al mismo tiempo, mantener todos los datos en SSD.</p>
<p>En este modo</p>
<ul>
<li><p>Los datos PQ se almacenan en disco por separado, sin redundancia.</p></li>
<li><p>Esto elimina la redundancia y reduce drásticamente el tamaño del índice.</p></li>
</ul>
<p>La contrapartida es que el acceso a los códigos PQ de un nodo y sus vecinos puede requerir <strong>múltiples lecturas de SSD</strong>, lo que aumenta las operaciones de E/S durante la expansión de candidatos. Si no se optimiza, la búsqueda se ralentizará considerablemente.</p>
<p>Para controlar esta sobrecarga, el modo AISAQ-Scale introduce dos optimizaciones adicionales:</p>
<ul>
<li><p><strong>Reorganización de datos PQ</strong>, que ordena los vectores PQ por prioridad de acceso para mejorar la localidad y reducir las lecturas aleatorias.</p></li>
<li><p>Una <strong>caché PQ en DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), que almacena los datos PQ a los que se accede con frecuencia y evita lecturas repetidas en disco para las entradas calientes.</p></li>
</ul>
<p>Con estas optimizaciones, el modo AISAQ-Scale logra una eficiencia de almacenamiento mucho mejor que AISAQ-Performance, al tiempo que mantiene un rendimiento de búsqueda práctico. Ese rendimiento sigue siendo inferior al de DISKANN, pero no hay sobrecarga de almacenamiento (el tamaño del índice es similar al de DISKANN) y la huella de memoria es drásticamente menor. Desde el punto de vista de la aplicación, AiSAQ proporciona los medios para cumplir los requisitos de RAG a escala ultraelevada.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Principales ventajas de AISAQ</h3><p>Al trasladar al disco todos los datos críticos para la búsqueda y rediseñar la forma de acceder a ellos, AISAQ cambia radicalmente el perfil de coste y escalabilidad de la búsqueda vectorial basada en grafos. Su diseño ofrece tres ventajas significativas.</p>
<p><strong>1. Uso de DRAM hasta 3.200 veces menor</strong></p>
<p>La cuantificación de productos reduce significativamente el tamaño de los vectores de alta dimensión, pero a escala de miles de millones, la huella de memoria sigue siendo considerable. Incluso después de la compresión, los códigos PQ deben mantenerse en memoria durante la búsqueda en diseños convencionales.</p>
<p>Por ejemplo, en <strong>SIFT1B</strong>, una prueba con mil millones de vectores de 128 dimensiones, los códigos PQ requieren por sí solos <strong>entre 30 y 120 GB de memoria DRAM</strong>, dependiendo de la configuración. Almacenar los vectores completos sin comprimir requeriría <strong> unos 480 GB</strong> adicionales. Aunque PQ reduce el uso de memoria entre 4 y 16 veces, la huella restante sigue siendo lo suficientemente grande como para dominar el coste de la infraestructura.</p>
<p>AISAQ elimina este requisito por completo. Al almacenar los códigos PQ en SSD en lugar de DRAM, la memoria ya no es consumida por datos de índice persistentes. La DRAM sólo se utiliza para estructuras ligeras y transitorias, como las listas de candidatos y los metadatos de control. En la práctica, esto reduce el uso de memoria de decenas de gigabytes a <strong>unos 10 MB</strong>. En una configuración representativa a escala de miles de millones, la DRAM pasa de <strong>32 GB a 10 MB</strong>, lo que supone una <strong>reducción de 3.200 veces</strong>.</p>
<p>Dado que el almacenamiento SSD cuesta aproximadamente <strong>1/30 del precio por unidad de capacidad en</strong> comparación con la DRAM, este cambio tiene un impacto directo y dramático en el coste total del sistema.</p>
<p><strong>2. Sin sobrecarga adicional de E/S</strong></p>
<p>Trasladar los códigos PQ de la memoria al disco normalmente aumentaría el número de operaciones de E/S durante la búsqueda. AISAQ evita esto controlando cuidadosamente <strong>la disposición de los datos y los patrones de acceso</strong>. En lugar de dispersar los datos relacionados por el disco, AISAQ ubica los códigos PQ, los vectores completos y las listas de vecinos de forma que puedan recuperarse juntos. Esto garantiza que la expansión de candidatos no introduzca lecturas aleatorias adicionales.</p>
<p>Para que los usuarios puedan controlar el equilibrio entre el tamaño del índice y la eficiencia de E/S, AISAQ introduce el parámetro <code translate="no">inline_pq</code>, que determina cuántos datos PQ se almacenan en línea con cada nodo:</p>
<ul>
<li><p><strong>menor inline_pq:</strong> menor tamaño del índice, pero puede requerir más E/S</p></li>
<li><p><strong>Mayor inline_pq:</strong> mayor tamaño de índice, pero conserva el acceso de lectura única.</p></li>
</ul>
<p>Cuando se configura con <strong>inline_pq = max_degree</strong>, AISAQ lee el vector completo de un nodo, la lista de vecinos y todos los códigos PQ en una sola operación de disco, coincidiendo con el patrón de E/S de DISKANN y manteniendo todos los datos en SSD.</p>
<p><strong>3. El Acceso PQ Secuencial Mejora la Eficiencia Computacional</strong></p>
<p>En DISKANN, la expansión de un nodo candidato requiere R accesos aleatorios a la memoria para obtener los códigos PQ de sus R vecinos. AISAQ elimina esta aleatoriedad recuperando todos los códigos PQ en una única E/S y almacenándolos secuencialmente en el disco.</p>
<p>La disposición secuencial ofrece dos ventajas importantes:</p>
<ul>
<li><p>Las<strong>lecturas secuenciales en SSD son mucho más rápidas</strong> que las lecturas aleatorias dispersas.</p></li>
<li><p><strong>Los datos contiguos son más fáciles de almacenar en caché</strong>, lo que permite a las CPU calcular las distancias PQ de forma más eficiente.</p></li>
</ul>
<p>Esto mejora tanto la velocidad como la previsibilidad de los cálculos de distancias PQ y ayuda a compensar el coste de rendimiento de almacenar códigos PQ en SSD en lugar de DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ frente a DISKANN: evaluación del rendimiento<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Tras comprender las diferencias arquitectónicas entre AISAQ y DISKANN, la siguiente pregunta es sencilla: <strong>¿cómo afectan estas decisiones de diseño al rendimiento y al uso de recursos en la práctica?</strong> Esta evaluación compara AISAQ y DISKANN en las tres dimensiones más importantes a escala de miles de millones: <strong>rendimiento de búsqueda, consumo de memoria y uso de disco</strong>.</p>
<p>En concreto, examinamos cómo se comporta AISAQ a medida que cambia la cantidad de datos PQ en línea (<code translate="no">INLINE_PQ</code>). Este parámetro controla directamente el equilibrio entre el tamaño del índice, la E/S de disco y la eficiencia en tiempo de ejecución. También evaluamos ambos enfoques en <strong>cargas de trabajo vectoriales de baja y alta dimensión, ya que la dimensionalidad influye mucho en el coste del cálculo de distancias y en</strong> los requisitos de almacenamiento.</p>
<h3 id="Setup" class="common-anchor-header">Configuración</h3><p>Todos los experimentos se realizaron en un sistema de nodo único para aislar el comportamiento del índice y evitar interferencias de efectos de red o de sistemas distribuidos.</p>
<p><strong>Configuración de hardware:</strong></p>
<ul>
<li><p>CPU: CPU Intel® Xeon® Platinum 8375C a 2,90GHz</p></li>
<li><p>Memoria: Velocidad: 3200 MT/s, Tipo: DDR4, Tamaño: 32 GB</p></li>
<li><p>Disco: SSD NVMe de 500 GB</p></li>
</ul>
<p><strong>Parámetros de creación de índices</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parámetros de consulta</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Método de referencia</h3><p>Tanto DISKANN como AISAQ se probaron utilizando <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, el motor de búsqueda vectorial de código abierto utilizado en Milvus. En esta evaluación se utilizaron dos conjuntos de datos:</p>
<ul>
<li><p><strong>SIFT128D (1M de vectores):</strong> una conocida referencia de 128 dimensiones utilizada habitualmente para la búsqueda de descriptores de imágenes. <em>(Tamaño bruto del conjunto de datos ≈ 488 MB).</em></p></li>
<li><p><strong>Cohere768D (1M de vectores)</strong>: un conjunto de incrustación de 768 dimensiones típico de la búsqueda semántica basada en transformadores. <em>(Tamaño bruto del conjunto de datos ≈ 2930 MB)</em></p></li>
</ul>
<p>Estos conjuntos de datos reflejan dos escenarios distintos del mundo real: características de visión compactas e incrustaciones semánticas de gran tamaño.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Sift128D1M (vector completo ~488 MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (vector completo ~2930 MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Análisis</h3><p><strong>Conjunto de datos SIFT128D</strong></p>
<p>En el conjunto de datos SIFT128D, AISAQ puede igualar el rendimiento de DISKANN cuando se alinean todos los datos PQ de forma que los datos necesarios de cada nodo quepan por completo en una única página SSD de 4 KB (INLINE_PQ = 48). Con esta configuración, toda la información necesaria para la búsqueda está colocada:</p>
<ul>
<li><p>Vector completo: 512B</p></li>
<li><p>Lista de vecinos: 48 × 4 + 4 = 196B</p></li>
<li><p>Códigos PQ de vecinos: 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Como todo el nodo cabe en una página, sólo se necesita una E/S por acceso, y AISAQ evita las lecturas aleatorias de datos PQ externos.</p>
<p>Sin embargo, cuando sólo una parte de los datos PQ está en línea, los códigos PQ restantes deben obtenerse de otra parte del disco. Esto introduce operaciones de E/S aleatorias adicionales, que aumentan drásticamente la demanda de IOPS y provocan caídas significativas del rendimiento.</p>
<p><strong>Conjunto de datos Cohere768D</strong></p>
<p>En el conjunto de datos Cohere768D, el rendimiento de AISAQ es peor que el de DISKANN. La razón es que un vector de 768 dimensiones simplemente no cabe en una página SSD de 4 KB:</p>
<ul>
<li><p>Vector completo: 3072B</p></li>
<li><p>Lista de vecinos: 48 × 4 + 4 = 196B</p></li>
<li><p>Códigos PQ de vecinos: 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Total: 21.700 B (≈ 6 páginas)</p></li>
</ul>
<p>En este caso, aunque todos los códigos PQ estén inline, cada nodo abarca varias páginas. Mientras que el número de operaciones de E/S se mantiene constante, cada E/S debe transferir muchos más datos, consumiendo el ancho de banda SSD mucho más rápido. Una vez que el ancho de banda se convierte en el factor limitante, AISAQ no puede seguir el ritmo de DISKANN, especialmente en cargas de trabajo de alta dimensión en las que las huellas de datos por nodo crecen rápidamente.</p>
<p><strong>Nota:</strong></p>
<p>La disposición de almacenamiento de AISAQ suele aumentar el tamaño del índice en disco <strong>entre 4 y 6 veces</strong>. Se trata de una compensación deliberada: los vectores completos, las listas de vecinos y los códigos PQ se colocan en el disco para permitir un acceso eficiente de una sola página durante la búsqueda. Aunque esto incrementa el uso de SSD, la capacidad de disco es significativamente más barata que la DRAM y se escala más fácilmente a grandes volúmenes de datos.</p>
<p>En la práctica, los usuarios pueden ajustar este equilibrio modificando los ratios de compresión de <code translate="no">INLINE_PQ</code> y PQ. Estos parámetros permiten equilibrar el rendimiento de la búsqueda, la huella de disco y el coste global del sistema en función de los requisitos de la carga de trabajo, en lugar de estar constreñidos por límites fijos de memoria.</p>
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
    </button></h2><p>La economía del hardware moderno está cambiando. Los precios de la DRAM siguen siendo elevados, mientras que el rendimiento de las SSD ha avanzado rápidamente: las unidadesCIe 5.0 ofrecen ahora un ancho de banda superior a <strong>14 GB/s</strong>. Como resultado, las arquitecturas que trasladan los datos críticos para la búsqueda de la costosa DRAM a un almacenamiento SSD mucho más asequible son cada vez más atractivas. Con una capacidad SSD que cuesta <strong>menos de 30 veces más por gigabyte</strong> que la DRAM, estas diferencias ya no son marginales, sino que influyen significativamente en el diseño del sistema.</p>
<p>AISAQ refleja este cambio. Al eliminar la necesidad de grandes asignaciones de memoria siempre activas, permite a los sistemas de búsqueda vectorial escalar en función del tamaño de los datos y los requisitos de la carga de trabajo, en lugar de los límites de la DRAM. Este enfoque se alinea con una tendencia más amplia hacia las arquitecturas "todo almacenamiento", en las que las unidades SSD rápidas desempeñan un papel central no sólo en la persistencia, sino también en el cálculo y la búsqueda activos. Al ofrecer dos modos de funcionamiento, Rendimiento y Escala, AiSAQ satisface los requisitos tanto de la búsqueda semántica (que requiere la latencia más baja) como de la RAG (que requiere una escala muy alta, pero una latencia moderada).</p>
<p>Es poco probable que este cambio se limite a las bases de datos vectoriales. Ya están surgiendo patrones de diseño similares en el procesamiento de grafos, el análisis de series temporales e incluso en partes de los sistemas relacionales tradicionales, a medida que los desarrolladores se replantean los antiguos supuestos sobre dónde deben residir los datos para lograr un rendimiento aceptable. A medida que la economía del hardware siga evolucionando, también lo harán las arquitecturas de los sistemas.</p>
<p>Para obtener más detalles sobre los diseños que se analizan aquí, consulte la documentación:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentación Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentación de Milvus</a></p></li>
</ul>
<p>¿Tiene alguna pregunta o desea profundizar en alguna característica del último Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o envíe problemas a<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Más información sobre las características de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: el arma secreta para combatir los duplicados en los datos de formación LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Búsqueda vectorial en el mundo real: cómo filtrar eficazmente sin matar la recuperación</a></p></li>
</ul>
