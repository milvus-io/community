---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Presentamos AISAQ en Milvus: la búsqueda vectorial a escala de miles de
  millones ahora consume 3.200 veces menos memoria
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
  Descubre cómo Milvus reduce los costes de memoria en 3200 veces gracias a
  AISAQ, lo que permite realizar búsquedas escalables de miles de millones de
  vectores sin la sobrecarga que supone la DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>Las bases de datos vectoriales se han convertido en una infraestructura fundamental para los sistemas de IA de misión crítica, y sus volúmenes de datos están creciendo de forma exponencial, llegando a menudo a miles de millones de vectores. A esa escala, todo se complica: mantener una baja latencia, preservar la precisión, garantizar la fiabilidad y operar a través de réplicas y regiones. Pero hay un reto que suele surgir pronto y que domina las decisiones arquitectónicas:<strong>el COSTE.</strong></p>
<p>Para ofrecer búsquedas rápidas, la mayoría de las bases de datos vectoriales almacenan las estructuras clave de indexación en DRAM (memoria dinámica de acceso aleatorio), el nivel de memoria más rápido y más caro. Este diseño es eficaz en cuanto al rendimiento, pero no escala bien. El uso de la DRAM escala con el tamaño de los datos más que con el tráfico de consultas, e incluso con compresión o descarga parcial a SSD, gran parte del índice debe permanecer en memoria. A medida que crecen los conjuntos de datos, los costes de memoria se convierten rápidamente en un factor limitante.</p>
<p>Milvus ya es compatible con <strong>DISKANN</strong>, un enfoque de red neuronal artificial (ANN) basado en disco que reduce la presión sobre la memoria al trasladar gran parte del índice a un SSD. Sin embargo, DISKANN sigue dependiendo de la DRAM para las representaciones comprimidas que se utilizan durante la búsqueda. <a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> va un paso más allá con <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, un índice vectorial basado en disco inspirado en <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Desarrollada por KIOXIA, la arquitectura de AiSAQ se diseñó con una «arquitectura de huella de DRAM cero», que almacena todos los datos críticos para la búsqueda en el disco y optimiza la ubicación de los datos para minimizar las operaciones de E/S. En una carga de trabajo de mil millones de vectores, esto reduce el uso de memoria de <strong>32 GB a unos 10 MB</strong>—una <strong>reducción de 3.200 veces</strong>— al tiempo que se mantiene un rendimiento práctico.</p>
<p>En las secciones siguientes, explicamos cómo funciona la búsqueda vectorial basada en grafos, de dónde provienen los costes de memoria y cómo AiSAQ redefine la curva de costes para la búsqueda vectorial a escala de mil millones.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Cómo funciona la búsqueda vectorial convencional basada en grafos<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La búsqueda vectorial</strong> es el proceso de encontrar puntos de datos cuyas representaciones numéricas sean las más cercanas a una consulta en un espacio de alta dimensión. «Más cercano» significa simplemente la distancia más pequeña según una función de distancia, como la distancia coseno o la distancia L2. A pequeña escala, esto es sencillo: se calcula la distancia entre la consulta y cada vector y, a continuación, se devuelven los más cercanos. Sin embargo, a gran escala —por ejemplo, a escala de miles de millones—, este enfoque se vuelve rápidamente demasiado lento para ser práctico.</p>
<p>Para evitar comparaciones exhaustivas, los sistemas modernos de búsqueda aproximada del vecino más cercano (ANNS) se basan en <strong>índices basados en grafos</strong>. En lugar de comparar una consulta con cada vector, el índice organiza los vectores en un <strong>grafo</strong>. Cada nodo representa un vector, y las aristas conectan los vectores que están numéricamente próximos. Esta estructura permite al sistema reducir drásticamente el espacio de búsqueda.</p>
<p>El grafo se construye de antemano, basándose únicamente en las relaciones entre los vectores. No depende de las consultas. Cuando llega una consulta, la tarea del sistema consiste en <strong>navegar por el grafo de manera eficiente</strong> e identificar los vectores con la menor distancia a la consulta, sin tener que escanear todo el conjunto de datos.</p>
<p>La búsqueda comienza desde un <strong>punto de entrada</strong> predefinido en el grafo. Este punto de partida puede estar lejos de la consulta, pero el algoritmo mejora su posición paso a paso, desplazándose hacia los vectores que parecen más cercanos a la consulta. Durante este proceso, la búsqueda mantiene dos estructuras de datos internas que funcionan conjuntamente: una <strong>lista de candidatos</strong> y una <strong>lista de resultados</strong>.</p>
<p>Y los dos pasos más importantes durante este proceso son ampliar la lista de candidatos y actualizar la lista de resultados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Ampliación de la lista de candidatos</h3><p><strong>La lista de candidatos</strong> representa hacia dónde puede dirigirse la búsqueda a continuación. Se trata de un conjunto priorizado de nodos del grafo que parecen prometedores en función de su distancia a la consulta.</p>
<p>En cada iteración, el algoritmo:</p>
<ul>
<li><p><strong>Selecciona el candidato más cercano descubierto hasta el momento.</strong> De la lista de candidatos, elige el vector con la menor distancia a la consulta.</p></li>
<li><p><strong>Recupera los vecinos de ese vector del grafo.</strong> Estos vecinos son vectores que se identificaron durante la construcción del índice como cercanos al vector actual.</p></li>
<li><p><strong>Evalúa los vecinos no visitados y los añade a la lista de candidatos.</strong> Para cada vecino que aún no se haya explorado, el algoritmo calcula su distancia a la consulta. Se omiten los vecinos visitados anteriormente, mientras que los nuevos vecinos se insertan en la lista de candidatos si parecen prometedores.</p></li>
</ul>
<p>Al ampliar repetidamente la lista de candidatos, la búsqueda explora regiones cada vez más relevantes del grafo. Esto permite al algoritmo avanzar de forma constante hacia mejores respuestas, al tiempo que examina solo una pequeña fracción de todos los vectores.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Actualización de la lista de resultados</h3><p>Al mismo tiempo, el algoritmo mantiene una <strong>lista de resultados</strong>, que registra los mejores candidatos encontrados hasta el momento para el resultado final. A medida que avanza la búsqueda:</p>
<ul>
<li><p><strong>Realiza un seguimiento de los vectores más cercanos encontrados durante el recorrido.</strong> Entre ellos se incluyen los vectores seleccionados para la expansión, así como otros evaluados a lo largo del proceso.</p></li>
<li><p><strong>Almacena sus distancias con respecto a la consulta.</strong> Esto permite clasificar a los candidatos y mantener los K vecinos más cercanos actuales.</p></li>
</ul>
<p>Con el tiempo, a medida que se evalúan más candidatos y se encuentran menos mejoras, la lista de resultados se estabiliza. Una vez que es poco probable que una mayor exploración del grafo produzca vectores más cercanos, la búsqueda finaliza y devuelve la lista de resultados como respuesta definitiva.</p>
<p>En términos sencillos, la <strong>lista de candidatos controla la exploración</strong>, mientras que la <strong>lista de resultados recoge las mejores respuestas descubiertas hasta el momento</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">La compensación en la búsqueda vectorial basada en grafos<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Este enfoque basado en grafos es lo que hace que la búsqueda vectorial a gran escala sea viable en primer lugar. Al navegar por el grafo en lugar de escanear cada vector, el sistema puede encontrar resultados de alta calidad sin más que examinar una pequeña fracción del conjunto de datos.</p>
<p>Sin embargo, esta eficiencia tiene un precio. La búsqueda basada en grafos plantea una disyuntiva fundamental entre <strong>precisión y coste.</strong></p>
<ul>
<li><p>Explorar más vecinos mejora la precisión al abarcar una mayor parte del grafo y reducir la probabilidad de pasar por alto a los verdaderos vecinos más cercanos.</p></li>
<li><p>Al mismo tiempo, cada expansión adicional supone más trabajo: más cálculos de distancia, más accesos a la estructura del grafo y más lecturas de datos vectoriales. A medida que la búsqueda se adentra más o se amplía, estos costes se acumulan. Dependiendo de cómo esté diseñado el índice, se traducen en un mayor uso de la CPU, una mayor presión sobre la memoria o una E/S de disco adicional.</p></li>
</ul>
<p>Equilibrar estas fuerzas opuestas —alta recuperación frente a un uso eficiente de los recursos— es fundamental para el diseño de la búsqueda basada en grafos.</p>
<p>Tanto <a href="https://milvus.io/blog/diskann-explained.md"><strong>DISKANN</strong></a> como <strong>AISAQ</strong> se basan en esta misma tensión, pero adoptan decisiones arquitectónicas diferentes sobre cómo y dónde se asumen estos costes.</p>
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
<p>DISKANN es la solución de redes neuronales artificiales (ANN) basadas en disco más influyente hasta la fecha y sirve como referencia oficial para la competición NeurIPS Big ANN, un punto de referencia mundial para la búsqueda vectorial a escala de miles de millones. Su importancia no radica solo en el rendimiento, sino en lo que demostró: <strong>la búsqueda con ANN basada en grafos no tiene por qué residir íntegramente en la memoria para ser rápida</strong>.</p>
<p>Al combinar el almacenamiento en SSD con estructuras en memoria cuidadosamente seleccionadas, DISKANN demostró que la búsqueda vectorial a gran escala podía alcanzar una gran precisión y una baja latencia en hardware estándar, sin requerir una gran cantidad de DRAM. Lo consigue replanteándose <em>qué partes de la búsqueda deben ser rápidas</em> y <em>cuáles pueden tolerar un acceso más lento</em>.</p>
<p><strong>A grandes rasgos, DISKANN mantiene en memoria los datos a los que se accede con mayor frecuencia, mientras que traslada al disco las estructuras más grandes y a las que se accede con menos frecuencia.</strong> Este equilibrio se consigue mediante varias decisiones de diseño clave.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Uso de distancias PQ para ampliar la lista de candidatos</h3><p>La ampliación de la lista de candidatos es la operación más frecuente en la búsqueda basada en grafos. Cada ampliación requiere estimar la distancia entre el vector de consulta y los vecinos de un nodo candidato. Realizar estos cálculos utilizando vectores completos y de alta dimensión requeriría frecuentes lecturas aleatorias del disco, una operación costosa tanto desde el punto de vista computacional como en términos de E/S.</p>
<p>DISKANN evita este coste comprimiendo los vectores en <strong>códigos de cuantificación de producto (PQ)</strong> y manteniéndolos en memoria. Los códigos PQ son mucho más pequeños que los vectores completos, pero conservan información suficiente para estimar la distancia de forma aproximada.</p>
<p>Durante la expansión de candidatos, DISKANN calcula las distancias utilizando estos códigos PQ en memoria, en lugar de leer vectores completos desde el SSD. Esto reduce drásticamente la E/S de disco durante el recorrido del grafo, lo que permite que la búsqueda amplíe los candidatos de forma rápida y eficiente, al tiempo que mantiene la mayor parte del tráfico del SSD fuera de la ruta crítica.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Ubicación conjunta de vectores completos y listas de vecinos en el disco</h3><p>No todos los datos pueden comprimirse o consultarse de forma aproximada. Una vez identificados los candidatos prometedores, la búsqueda sigue necesitando acceder a dos tipos de datos para obtener resultados precisos:</p>
<ul>
<li><p><strong>Listas de vecinos</strong>, para continuar el recorrido del grafo</p></li>
<li><p><strong>Vectores completos (sin comprimir)</strong>, para la reclasificación final</p></li>
</ul>
<p>Se accede a estas estructuras con menos frecuencia que a los códigos PQ, por lo que DISKANN las almacena en el SSD. Para minimizar la sobrecarga del disco, DISKANN coloca la lista de vecinos de cada nodo y su vector completo en la misma región física del disco. Esto garantiza que una sola lectura del SSD pueda recuperar ambos.</p>
<p>Al ubicar juntos los datos relacionados, DISKANN reduce el número de accesos aleatorios al disco necesarios durante la búsqueda. Esta optimización mejora tanto la eficiencia de la expansión como la de la reordenación, especialmente a gran escala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansión paralela de nodos para un mejor aprovechamiento del SSD</h3><p>La búsqueda en redes neuronales artificiales (ANN) basadas en grafos es un proceso iterativo. Si cada iteración expande solo un nodo candidato, el sistema emite una única lectura de disco cada vez, dejando sin utilizar la mayor parte del ancho de banda paralelo del SSD. Para evitar esta ineficiencia, DISKANN expande varios candidatos en cada iteración y envía solicitudes de lectura paralelas al SSD. Este enfoque aprovecha mucho mejor el ancho de banda disponible y reduce el número total de iteraciones necesarias.</p>
<p>El parámetro <strong>«beam_width_ratio»</strong> controla cuántos candidatos se expanden en paralelo: <strong>Ancho del haz = número de núcleos de CPU × beam_width_ratio.</strong> Una relación más alta amplía la búsqueda —lo que podría mejorar la precisión—, pero también aumenta la carga computacional y las operaciones de E/S de disco.</p>
<p>Para contrarrestar esto, DISKANN introduce un « <code translate="no">search_cache_budget_gb_ratio</code> » que reserva memoria para almacenar en caché los datos a los que se accede con frecuencia, lo que reduce las lecturas repetidas del SSD. En conjunto, estos mecanismos ayudan a DISKANN a equilibrar la precisión, la latencia y la eficiencia de E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Por qué es importante —y dónde aparecen los límites</h3><p>El diseño de DISKANN supone un gran avance para la búsqueda vectorial basada en disco. Al mantener los códigos PQ en memoria y trasladar las estructuras más grandes al SSD, reduce significativamente el consumo de memoria en comparación con los índices de grafos totalmente en memoria.</p>
<p>Al mismo tiempo, esta arquitectura sigue dependiendo de <strong>una DRAM siempre activa</strong> para los datos críticos para la búsqueda. Los códigos PQ, las cachés y las estructuras de control deben permanecer residentes en memoria para que el recorrido siga siendo eficiente. A medida que los conjuntos de datos crecen hasta alcanzar miles de millones de vectores y las implementaciones añaden réplicas o regiones, ese requisito de memoria puede seguir convirtiéndose en un factor limitante.</p>
<p>Esta es la brecha que <strong>AISAQ</strong> está diseñado para subsanar.</p>
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
    </button></h2><p>AISAQ se basa directamente en las ideas fundamentales de DISKANN, pero introduce un cambio fundamental: elimina <strong>la necesidad de mantener los datos de PQ en la DRAM</strong>. En lugar de tratar los vectores comprimidos como estructuras críticas para la búsqueda que deben permanecer siempre en memoria, AISAQ los traslada a un SSD y rediseña la forma en que se distribuyen los datos del grafo en el disco para preservar la eficiencia del recorrido.</p>
<p>Para que esto funcione, AISAQ reorganiza el almacenamiento de los nodos de modo que los datos necesarios durante la búsqueda en el grafo —vectores completos, listas de vecinos e información PQ— se dispongan en el disco siguiendo patrones optimizados para la localidad de acceso. El objetivo no es solo trasladar más datos al disco, que resulta más económico, sino hacerlo <strong>sin alterar el proceso de búsqueda descrito anteriormente</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para dar respuesta a los distintos requisitos de las aplicaciones, AISAQ ofrece dos modos de almacenamiento en disco: «Rendimiento» y «Escala». Desde un punto de vista técnico, estos modos se diferencian principalmente en cómo se almacenan y se accede a los datos comprimidos mediante PQ durante la búsqueda. Desde el punto de vista de las aplicaciones, estos modos responden a dos tipos distintos de requisitos: los de baja latencia, típicos de la búsqueda semántica en línea y los sistemas de recomendación, y los de escala ultraalta, típicos de RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-rendimiento: optimizado para la velocidad</h3><p>AISAQ-rendimiento mantiene todos los datos en disco, al tiempo que conserva una baja sobrecarga de E/S gracias a la colocalización de datos.</p>
<p>En este modo:</p>
<ul>
<li><p>El vector completo de cada nodo, la lista de aristas y los códigos PQ de sus vecinos se almacenan juntos en el disco.</p></li>
<li><p>Acceder a un nodo sigue requiriendo únicamente una <strong>única lectura del SSD</strong>, ya que todos los datos necesarios para la expansión y evaluación de candidatos están colocados juntos.</p></li>
</ul>
<p>Desde la perspectiva del algoritmo de búsqueda, esto se asemeja mucho al patrón de acceso de DISKANN. La expansión de candidatos sigue siendo eficiente y el rendimiento en tiempo de ejecución es comparable, aunque ahora todos los datos críticos para la búsqueda se encuentren en el disco.</p>
<p>La contrapartida es la sobrecarga de almacenamiento. Dado que los datos PQ de un vecino pueden aparecer en las páginas de disco de varios nodos, esta disposición introduce redundancia y aumenta significativamente el tamaño total del índice.</p>
<p>Por lo tanto, el modo AISAQ-Performance da prioridad a una baja latencia de E/S frente a la eficiencia del disco. Desde el punto de vista de la aplicación, el modo AISAQ-Performance puede ofrecer una latencia del orden de los 10 ms, tal y como requiere la búsqueda semántica en línea.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale: optimizado para la eficiencia de almacenamiento</h3><p>AISAQ-Scale adopta el enfoque contrario. Está diseñado para <strong>minimizar el uso del disco</strong> sin dejar de mantener todos los datos en SSD.</p>
<p>En este modo:</p>
<ul>
<li><p>Los datos PQ se almacenan en el disco por separado, sin redundancia.</p></li>
<li><p>Esto elimina la redundancia y reduce drásticamente el tamaño del índice.</p></li>
</ul>
<p>La contrapartida es que acceder a los códigos PQ de un nodo y de sus vecinos puede requerir <strong>múltiples lecturas del SSD</strong>, lo que aumenta las operaciones de E/S durante la expansión de candidatos. Si no se optimiza, esto ralentizaría significativamente la búsqueda.</p>
<p>Para controlar esta sobrecarga, el modo AISAQ-Scale introduce dos optimizaciones adicionales:</p>
<ul>
<li><p><strong>La reorganización de los datos PQ</strong>, que ordena los vectores PQ por prioridad de acceso para mejorar la localidad y reducir las lecturas aleatorias.</p></li>
<li><p>Una <strong>caché PQ en DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), que almacena los datos PQ a los que se accede con frecuencia y evita lecturas repetidas en el disco para las entradas más solicitadas.</p></li>
</ul>
<p>Con estas optimizaciones, el modo AISAQ-Scale alcanza una eficiencia de almacenamiento mucho mayor que AISAQ-Performance, al tiempo que mantiene un rendimiento de búsqueda práctico. Ese rendimiento sigue siendo inferior al de DISKANN, pero no hay sobrecarga de almacenamiento (el tamaño del índice es similar al de DISKANN) y el consumo de memoria es considerablemente menor. Desde el punto de vista de las aplicaciones, AiSAQ proporciona los medios para cumplir los requisitos de RAG a una escala ultraalta.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Ventajas clave de AISAQ</h3><p>Al trasladar todos los datos críticos para la búsqueda al disco y rediseñar la forma de acceder a ellos, AISAQ cambia radicalmente el perfil de coste y escalabilidad de la búsqueda vectorial basada en grafos. Su diseño ofrece tres ventajas significativas.</p>
<p><strong>1. Hasta 3.200 veces menos uso de DRAM</strong></p>
<p>La cuantificación de productos (Product Quantization) reduce significativamente el tamaño de los vectores de alta dimensión, pero a escala de miles de millones, el consumo de memoria sigue siendo considerable. Incluso tras la compresión, en los diseños convencionales los códigos PQ deben mantenerse en memoria durante la búsqueda.</p>
<p>Por ejemplo, en <strong>SIFT1B</strong>, un banco de pruebas con mil millones de vectores de 128 dimensiones, solo los códigos PQ requieren entre <strong>30 y 120 GB de DRAM</strong>, dependiendo de la configuración. Almacenar los vectores completos sin comprimir requeriría <strong> unos 480 GB</strong> adicionales. Aunque la PQ reduce el uso de memoria entre 4 y 16 veces, el consumo restante sigue siendo lo suficientemente grande como para dominar el coste de la infraestructura.</p>
<p>AISAQ elimina por completo este requisito. Al almacenar los códigos PQ en un SSD en lugar de en DRAM, los datos de índice persistentes ya no consumen memoria. La DRAM se utiliza únicamente para estructuras ligeras y transitorias, como listas de candidatos y metadatos de control. En la práctica, esto reduce el uso de memoria de decenas de gigabytes a <strong>unos 10 MB</strong>. En una configuración representativa a escala de mil millones, la DRAM se reduce de <strong>32 GB a 10 MB</strong>, lo que supone <strong>una reducción de 3.200 veces</strong>.</p>
<p>Dado que el almacenamiento en SSD cuesta aproximadamente <strong>1/30 del precio por unidad de capacidad</strong> en comparación con la DRAM, este cambio tiene un impacto directo y drástico en el coste total del sistema.</p>
<p><strong>2. Sin sobrecarga adicional de E/S</strong></p>
<p>Trasladar los códigos PQ de la memoria al disco normalmente aumentaría el número de operaciones de E/S durante la búsqueda. AISAQ evita esto controlando cuidadosamente <strong>la disposición de los datos y los patrones de acceso</strong>. En lugar de dispersar los datos relacionados por todo el disco, AISAQ agrupa los códigos PQ, los vectores completos y las listas de vecinos para que puedan recuperarse juntos. Esto garantiza que la expansión de candidatos no introduzca lecturas aleatorias adicionales.</p>
<p>Para que los usuarios puedan controlar el equilibrio entre el tamaño del índice y la eficiencia de E/S, AISAQ introduce el parámetro « <code translate="no">inline_pq</code> », que determina la cantidad de datos PQ que se almacenan en línea con cada nodo:</p>
<ul>
<li><p><strong>Un valor bajo de `inline_pq`:</strong> tamaño de índice más pequeño, pero puede requerir E/S adicional</p></li>
<li><p><strong>Un valor más alto de `inline_pq`:</strong> mayor tamaño del índice, pero se mantiene el acceso de lectura única</p></li>
</ul>
<p>Cuando se configura con <strong>`inline_pq = max_degree</strong>`, AISAQ lee el vector completo de un nodo, la lista de vecinos y todos los códigos PQ en una sola operación de disco, lo que se ajusta al patrón de E/S de DISKANN al tiempo que mantiene todos los datos en un SSD.</p>
<p><strong>3. El acceso secuencial a los PQ mejora la eficiencia computacional</strong></p>
<p>En DISKANN, expandir un nodo candidato requiere R accesos aleatorios a la memoria para recuperar los códigos PQ de sus R vecinos. AISAQ elimina esta aleatoriedad recuperando todos los códigos PQ en una única operación de E/S y almacenándolos secuencialmente en el disco.</p>
<p>La disposición secuencial ofrece dos ventajas importantes:</p>
<ul>
<li><p><strong>Las lecturas secuenciales en el SSD son mucho más rápidas</strong> que las lecturas aleatorias dispersas.</p></li>
<li><p><strong>Los datos contiguos se adaptan mejor a la caché</strong>, lo que permite a las CPU calcular las distancias PQ de forma más eficiente.</p></li>
</ul>
<p>Esto mejora tanto la velocidad como la previsibilidad de los cálculos de distancia PQ y ayuda a compensar el coste de rendimiento que supone almacenar los códigos PQ en un SSD en lugar de en la DRAM.</p>
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
    </button></h2><p>Una vez comprendido en qué se diferencia AISAQ de DISKANN desde el punto de vista arquitectónico, la siguiente pregunta es sencilla: <strong>¿cómo afectan estas decisiones de diseño al rendimiento y al uso de recursos en la práctica?</strong> Esta evaluación compara AISAQ y DISKANN en tres dimensiones que son las más importantes a escala de mil millones: <strong>rendimiento de búsqueda, consumo de memoria y uso del disco</strong>.</p>
<p>En concreto, examinamos cómo se comporta AISAQ a medida que varía la cantidad de datos PQ integrados (<code translate="no">INLINE_PQ</code>). Este parámetro controla directamente el equilibrio entre el tamaño del índice, las E/S de disco y la eficiencia en tiempo de ejecución. También evaluamos ambos enfoques en <strong>cargas de trabajo vectoriales de baja y alta dimensionalidad, ya que la dimensionalidad influye considerablemente en el coste del cálculo de distancias y en</strong> los requisitos de almacenamiento.</p>
<h3 id="Setup" class="common-anchor-header">Configuración</h3><p>Todos los experimentos se llevaron a cabo en un sistema de un solo nodo para aislar el comportamiento del índice y evitar interferencias debidas a efectos de la red o de sistemas distribuidos.</p>
<p><strong>Configuración de hardware:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P a 2,70 GHz</p></li>
<li><p>Memoria: velocidad: 3200 MT/s; tipo: DDR4; capacidad: 384 GB</p></li>
<li><p>Disco: SSD<sup>NVMe™</sup> KIOXIA CM7 de 7,68 TB</p></li>
</ul>
<p><h6><em>AMD EPYC es una marca comercial de Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe es una marca registrada o no registrada de NVM Express, Inc. en Estados Unidos y otros países.</em></h6></p>
<p><strong>Parámetros de creación del índice</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parámetros de consulta</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Método de evaluación</h3><p>Tanto DISKANN como AISAQ se probaron utilizando <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, el motor de búsqueda vectorial de código abierto utilizado en Milvus. En esta evaluación se utilizaron dos conjuntos de datos:</p>
<ul>
<li><p><strong>SIFT128D (1 millón de vectores):</strong> un conocido conjunto de datos de referencia de 128 dimensiones que se utiliza habitualmente para la búsqueda de descriptores de imágenes. <em>(Tamaño del conjunto de datos sin procesar ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1 millón de vectores):</strong> un conjunto de incrustaciones de 768 dimensiones típico de la búsqueda semántica basada en transformadores. <em>(Tamaño del conjunto de datos sin procesar ≈ 2930 MB)</em></p></li>
</ul>
<p>Estos conjuntos de datos reflejan dos escenarios distintos del mundo real: características de visión compactas y representaciones semánticas de gran tamaño.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Sift128D1M (vector completo ~488 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Gráfico de recuperación de SIFT frente a latencia</span>
  
 </span></p>
<p><strong>Cohere768D1M (vector completo ~2930 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Gráfico de recuperación frente a latencia de Cohere</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Análisis</h3><p><strong>Conjunto de datos SIFT128D</strong></p>
<p>En el conjunto de datos SIFT128D, AISAQ puede igualar el rendimiento de DISKANN cuando todos los datos PQ se almacenan en línea, de modo que los datos necesarios para cada nodo quepan íntegramente en una sola página de SSD de 4 KB (INLINE_PQ = 48). Con esta configuración, toda la información necesaria durante la búsqueda se encuentra en la misma ubicación:</p>
<ul>
<li><p>Vector completo: 512 B</p></li>
<li><p>Lista de vecinos: 48 × 4 + 4 = 196 B</p></li>
<li><p>Códigos PQ de los vecinos: 48 × (512 B × 0,125) ≈ 3072 B</p></li>
<li><p>Total: 3780 B</p></li>
</ul>
<p>Dado que todo el nodo cabe en una sola página, solo se necesita una operación de E/S por acceso, y AISAQ evita las lecturas aleatorias de datos PQ externos.</p>
<p>Sin embargo, cuando solo una parte de los datos PQ se integra, los códigos PQ restantes deben recuperarse de otra ubicación del disco (el parámetro inline_pq se configuró para optimizar la utilización de las páginas del SSD; por ejemplo, inline_pq = 20 permite que quepan dos nodos en una sola página de 4 KB). Esto introduce operaciones de E/S aleatorias adicionales, lo que aumenta considerablemente la demanda de IOPS y provoca una caída del rendimiento.</p>
<p><strong>Conjunto de datos Cohere768D</strong></p>
<p>En el conjunto de datos Cohere768D, AISAQ ofrece un rendimiento aproximadamente un 8 % inferior al de DISKANN. El motivo es que un vector de 768 dimensiones simplemente no cabe en una sola página de SSD de 4 KB:</p>
<ul>
<li><p>Vector completo: 3072 B</p></li>
<li><p>Lista de vecinos: 48 × 4 + 4 = 196 B</p></li>
<li><p>Códigos PQ de los vecinos: 48 × (3072 B × 0,04167) ≈ 6 144 B</p></li>
<li><p>Total: 9 412 B (≈ 3 páginas)</p></li>
</ul>
<p>En este caso, aunque todos los códigos PQ se incluyan en línea, cada nodo abarca varias páginas. Si bien el número de operaciones de E/S se mantiene constante, cada operación de E/S debe transferir muchos más datos, lo que agota el ancho de banda del SSD mucho más rápido. Una vez que el ancho de banda se convierte en el factor limitante, AISAQ no puede seguir el ritmo de DISKANN, especialmente en cargas de trabajo de alta dimensión, donde el volumen de datos por nodo crece rápidamente.</p>
<p><strong>Nota:</strong></p>
<p>La estructura de almacenamiento de AISAQ suele multiplicar por <strong>3 a 5</strong> el tamaño del índice en disco. Se trata de una compensación deliberada: los vectores completos, las listas de vecinos y los códigos PQ se ubican juntos en el disco para permitir un acceso eficiente a una sola página durante la búsqueda. Aunque esto aumenta el uso del SSD, la capacidad del disco es significativamente más económica que la de la DRAM y se adapta más fácilmente a grandes volúmenes de datos.</p>
<p>En la práctica, los usuarios pueden ajustar esta compensación modificando los ratios de compresión de « <code translate="no">INLINE_PQ</code> » y PQ. Estos parámetros permiten equilibrar el rendimiento de la búsqueda, el espacio ocupado en disco y el coste global del sistema en función de los requisitos de la carga de trabajo, en lugar de verse limitados por restricciones fijas de memoria.</p>
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
    </button></h2><p>La economía del hardware moderno está cambiando. Los precios de la DRAM siguen siendo elevados, mientras que el rendimiento de los SSD ha avanzado rápidamente: las unidades PCIe 5.0 ofrecen ahora un ancho de banda superior a <strong>los 14 GB/s</strong>. Como resultado, las arquitecturas que trasladan los datos críticos para la búsqueda de la costosa DRAM a un almacenamiento SSD mucho más asequible resultan cada vez más atractivas. Dado que la capacidad de los SSD cuesta <strong>menos de 30 veces más por gigabyte que la de</strong> la DRAM, estas diferencias ya no son marginales, sino que influyen de manera significativa en el diseño del sistema.</p>
<p>AISAQ refleja este cambio. Al eliminar la necesidad de grandes asignaciones de memoria siempre activas, permite que los sistemas de búsqueda vectorial se adapten en función del tamaño de los datos y los requisitos de la carga de trabajo, en lugar de los límites de la DRAM. Este enfoque se alinea con una tendencia más amplia hacia las arquitecturas «all-in-storage», en las que los SSD rápidos desempeñan un papel central no solo en la persistencia, sino también en el cálculo activo y la búsqueda. Al ofrecer dos modos de funcionamiento —Rendimiento y Escala—, AiSAQ cumple los requisitos tanto de la búsqueda semántica (que requiere la latencia más baja) como de RAG (que requiere una escala muy alta, pero una latencia moderada).</p>
<p>Es poco probable que este cambio se limite a las bases de datos vectoriales. Ya están surgiendo patrones de diseño similares en el procesamiento de grafos, el análisis de series temporales e incluso en partes de los sistemas relacionales tradicionales, a medida que los desarrolladores se replantean supuestos arraigados sobre dónde deben residir los datos para lograr un rendimiento aceptable. A medida que la economía del hardware siga evolucionando, las arquitecturas de los sistemas harán lo propio.</p>
<p>Para obtener más detalles sobre los diseños aquí comentados, consulta la documentación:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentación de Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentación de Milvus</a></p></li>
</ul>
<p>¿Tienes alguna pregunta o quieres profundizar en alguna de las características de la última versión de Milvus? Únete a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o envía incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puedes reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a tus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentamos Milvus 2.6: búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentamos la función de incrustación: cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Descomposición de JSON en Milvus: filtrado de JSON 88,9 veces más rápido y con mayor flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando la verdadera recuperación a nivel de entidad: nuevas capacidades de «Array-of-Structs» y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: el arma secreta para combatir los duplicados en los datos de entrenamiento de los modelos de lenguaje grandes (LLM) </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevando la compresión vectorial al extremo: cómo Milvus atiende tres veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Las pruebas de rendimiento mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Hemos sustituido Kafka/Pulsar por un «pájaro carpintero» para Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La búsqueda vectorial en el mundo real: cómo filtrar de forma eficiente sin sacrificar la recuperación</a></p></li>
</ul>
