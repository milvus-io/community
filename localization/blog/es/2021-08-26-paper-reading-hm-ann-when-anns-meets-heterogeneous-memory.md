---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: >-
  Lectura del artículo｜HM-ANN Cuando la ANNS se encuentra con la memoria
  heterogénea
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Búsqueda eficiente del vecino más próximo en miles de millones de
  puntos en memoria heterogénea
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Lectura de artículos ｜ HM-ANN: Cuando la ANNS se encuentra con la memoria heterogénea</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous</a> Memory es un trabajo de investigación que fue aceptado en la 2020 Conference on Neural Information Processing Systems<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>). En este artículo, se propone un nuevo algoritmo para la búsqueda de similitud basada en grafos, denominado HM-ANN. Este algoritmo considera tanto la heterogeneidad de memoria como la heterogeneidad de datos en un entorno de hardware moderno. HM-ANN permite la búsqueda de similitudes a escala de miles de millones en una sola máquina sin tecnologías de compresión. La memoria heterogénea (HM) representa la combinación de una memoria dinámica de acceso aleatorio (DRAM) rápida pero pequeña y una memoria persistente (PMem) lenta pero grande. HM-ANN consigue una latencia de búsqueda baja y una precisión de búsqueda alta, especialmente cuando el conjunto de datos no cabe en la DRAM. El algoritmo tiene una clara ventaja sobre las soluciones de búsqueda aproximada por vecino más cercano (RNA) más avanzadas.</p>
<custom-h1>Motivación</custom-h1><p>Desde sus inicios, los algoritmos de búsqueda RNA han planteado un compromiso fundamental entre la precisión y la latencia de las consultas debido a la capacidad limitada de la DRAM. Para almacenar índices en DRAM que permitan un acceso rápido a las consultas, es necesario limitar el número de puntos de datos o almacenar vectores comprimidos, lo que perjudica la precisión de la búsqueda. Los índices basados en grafos (por ejemplo, Hierarchical Navigable Small World, HNSW) ofrecen un mayor rendimiento y precisión en la ejecución de las consultas. Sin embargo, estos índices también pueden consumir una memoria DRAM de 1 TB cuando se trabaja con conjuntos de datos de miles de millones de bits.</p>
<p>Existen otras soluciones para evitar que la DRAM almacene conjuntos de datos a escala de miles de millones en formato bruto. Cuando un conjunto de datos es demasiado grande para caber en la memoria de una sola máquina, se utilizan enfoques comprimidos, como la cuantificación del producto de los puntos del conjunto de datos. Pero la recuperación de esos índices con el conjunto de datos comprimido suele ser baja debido a la pérdida de precisión durante la cuantización. Subramanya et al. [1] exploran el aprovechamiento de las unidades de estado sólido (SSD) para lograr una búsqueda de RNA a escala de miles de millones utilizando una sola máquina con un enfoque denominado Disk-ANN, en el que el conjunto de datos sin procesar se almacena en SSD y la representación comprimida en DRAM.</p>
<custom-h1>Introducción a la memoria heterogénea</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>La memoria heterogénea (HM) representa la combinación de una DRAM rápida pero pequeña y una PMem lenta pero grande. La DRAM es un hardware normal que puede encontrarse en todos los servidores modernos, y su acceso es relativamente rápido. Las nuevas tecnologías PMem, como los módulos de memoria persistente Intel® Optane™ DC, salvan la distancia entre la memoria flash basada en NAND (SSD) y la DRAM, eliminando el cuello de botella de E/S. La PMem es duradera, como las SSD, y directamente direccionable por la CPU, como la memoria. Renen et al. [2] descubren que el ancho de banda de lectura de PMem es 2,6 veces menor, y el ancho de banda de escritura 7,5 veces menor, que el de DRAM en el entorno experimental configurado.</p>
<custom-h1>Diseño de HM-ANN</custom-h1><p>HM-ANN es un algoritmo de búsqueda de RNA a escala de miles de millones, preciso y rápido, que se ejecuta en una sola máquina sin compresión. El diseño de HM-ANN generaliza la idea de HNSW, cuya estructura jerárquica encaja de forma natural en HM. HNSW consta de varias capas: sólo la capa 0 contiene el conjunto de datos completo, y cada capa restante contiene un subconjunto de elementos de la capa inmediatamente inferior.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Los elementos de las capas superiores, que sólo incluyen subconjuntos del conjunto de datos, consumen una pequeña parte de todo el almacenamiento. Esta observación los convierte en candidatos decentes para ser colocados en DRAM. De este modo, se espera que la mayoría de las búsquedas en HM-ANN se produzcan en las capas superiores, lo que maximiza la utilización de la característica de acceso rápido de la DRAM. Sin embargo, en los casos de HNSW, la mayoría de las búsquedas se producen en la capa inferior.</li>
<li>Dado que el acceso a la capa 0 es más lento, es preferible que cada consulta sólo acceda a una pequeña parte y reducir la frecuencia de acceso.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algoritmo de construcción de gráficos<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>La idea clave de la construcción de HM-ANN es crear capas superiores de alta calidad, con el fin de proporcionar una mejor navegación para la búsqueda en la capa 0. De este modo, la mayor parte del acceso a la memoria se produce en DRAM, y se reduce el acceso en PMem. Para que esto sea posible, el algoritmo de construcción de HM-ANN tiene una fase de inserción descendente y una fase de promoción ascendente.</p>
<p>La fase de inserción descendente construye un grafo navegable de mundo pequeño a medida que la capa inferior se coloca en el PMem.</p>
<p>La fase de promoción ascendente promueve los puntos de pivote de la capa inferior para formar capas superiores que se colocan en la DRAM sin perder mucha precisión. Si se crea una proyección de alta calidad de elementos de la capa 0 en la capa 1, la búsqueda en la capa 0 encuentra los vecinos más cercanos precisos de la consulta con sólo unos pocos saltos.</p>
<ul>
<li>En lugar de utilizar la selección aleatoria de HNSW para la promoción, HM-ANN utiliza una estrategia de promoción de alto grado para promover los elementos con el grado más alto de la capa 0 a la capa 1. Para las capas superiores, HM-ANN utiliza una estrategia de promoción de alto grado. Para las capas superiores, HM-ANN promueve los nodos de alto grado a la capa superior en función de una tasa de promoción.</li>
<li>HM-ANN promueve más nodos de la capa 0 a la capa 1 y establece un mayor número máximo de vecinos para cada elemento en la capa 1. El número de nodos en las capas superiores se decide en función del espacio DRAM disponible. Dado que la capa 0 no se almacena en DRAM, hacer que cada capa almacenada en DRAM sea más densa aumenta la calidad de la búsqueda.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Algoritmo de búsqueda de grafos<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>El algoritmo de búsqueda consta de dos fases: búsqueda rápida en memoria y búsqueda paralela en la capa 0 con prefetching.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Búsqueda rápida en memoria</h3><p>Al igual que en HNSW, la búsqueda en DRAM comienza en el punto de entrada de la capa superior y, a continuación, realiza una búsqueda 1-greedy desde la capa superior hasta la capa 2. Para reducir el espacio de búsqueda en la capa 2, se utiliza un algoritmo de búsqueda rápida. Para reducir el espacio de búsqueda en la capa 0, HM-ANN realiza la búsqueda en la capa 1 con un presupuesto de búsqueda con <code translate="no">efSearchL1</code>, lo que limita el tamaño de la lista de candidatos en la capa 1. Esos candidatos de la lista se utilizan como puntos de entrada múltiples para la búsqueda en la capa 0, para mejorar la calidad de la búsqueda en la capa 0. Mientras que HNSW utiliza sólo un punto de entrada, la brecha entre la capa 0 y la capa 1 se maneja de forma más especial en HM-ANN que las brechas entre cualquier otra dos capas.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Búsqueda paralela en la capa 0 con prefetching</h3><p>En la capa inferior, HM-ANN divide uniformemente los candidatos antes mencionados de la búsqueda de la capa 1 y los considera puntos de entrada para realizar una búsqueda paralela de múltiples inicios 1-greedy con hilos. Los mejores candidatos de cada búsqueda se recopilan para encontrar los mejores candidatos. Como es sabido, bajar de la capa 1 a la capa 0 es exactamente ir a PMem. La búsqueda paralela oculta la latencia de PMem y aprovecha al máximo el ancho de banda de la memoria, para mejorar la calidad de la búsqueda sin aumentar el tiempo de búsqueda.</p>
<p>HM-ANN implementa un búfer gestionado por software en la DRAM para obtener previamente los datos del PMem antes de que se produzca el acceso a la memoria. Cuando se busca en la capa 1, HM-ANN copia asíncronamente los elementos vecinos de los candidatos en <code translate="no">efSearchL1</code> y las conexiones de los elementos vecinos en la capa 1 desde PMem al búfer. Cuando se realiza la búsqueda en la capa 0, una parte de los datos a los que se va a acceder ya están pregrabados en la DRAM, lo que oculta la latencia de acceso a la PMem y reduce el tiempo de consulta. Esto coincide con el objetivo de diseño de HM-ANN, donde la mayoría de los accesos a memoria se producen en DRAM y se reducen los accesos a memoria en PMem.</p>
<custom-h1>Evaluación</custom-h1><p>En este documento se lleva a cabo una evaluación exhaustiva. Todos los experimentos se realizan en una máquina con Intel Xeon Gold 6252 CPU@2.3GHz. Utiliza DDR4 (96 GB) como memoria rápida y Optane DC PMM (1,5 TB) como memoria lenta. Se evalúan cinco conjuntos de datos: BIGANN, DEEP1B, SIFT1M, DEEP1M y GIST1M. Para las pruebas a escala de miles de millones, se incluyen los siguientes esquemas: métodos basados en la cuantización a escala de miles de millones (IMI+OPQ y L&amp;C), los métodos no basados en la compresión (HNSW y NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Comparación de algoritmos a escala de mil millones<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>En la tabla 1 se comparan el tiempo de construcción y el almacenamiento de distintos índices basados en gráficos. HNSW necesita el menor tiempo de construcción y HM-ANN necesita un 8% más de tiempo que HNSW. En términos de uso de almacenamiento total, los índices HM-ANN son entre un 5 y un 13% mayores que HSNW, ya que promueve más nodos de la capa 0 a la capa 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>En la Figura 1, se analiza el rendimiento de consulta de los distintos índices. Las Figuras 1 (a) y (b) muestran que HM-ANN alcanza el top-1 recall de &gt; 95% en 1ms. Las Figuras 1 © y (d) muestran que HM-ANN obtiene una recuperación top-100 de &gt; 90% en 4 ms. HM-ANN proporciona el mejor rendimiento latencia-recuperación que todos los demás enfoques.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Comparación de algoritmos a escala de millones<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>En la Figura 2, se analiza el rendimiento de consulta de diferentes índices en un entorno DRAM puro. HNSW, NSG y HM-ANN se evalúan con los tres conjuntos de datos a escala de millón que se ajustan en DRAM. HM-ANN sigue obteniendo mejores resultados de consulta que HNSW. La razón es que el número total de cálculos de distancia de HM-ANN es menor (una media de 850/consulta) que el de HNSW (una media de 900/consulta) para alcanzar el objetivo de recuperación del 99%.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Eficacia de la promoción de alto grado<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>En la Figura 3, se comparan las estrategias de promoción aleatoria y de promoción de alto grado en la misma configuración. La promoción de alto grado supera a la de referencia. La promoción de alto grado es 1,8 veces, 4,3 veces y 3,9 veces más rápida que la promoción aleatoria para alcanzar los objetivos de recuperación del 95%, 99% y 99,5%, respectivamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Ventajas de rendimiento de las técnicas de gestión de memoria<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>La Figura 5 contiene una serie de pasos entre HNSW y HM-ANN para mostrar cómo cada optimización de HM-ANN contribuye a sus mejoras. BP representa la Promoción ascendente mientras se construye el índice. PL0 representa la búsqueda paralela de capa-0, mientras que DP representa la precarga de datos de PMem a DRAM. Paso a paso, el rendimiento de búsqueda de HM-ANN aumenta.</p>
<custom-h1>Conclusión</custom-h1><p>Un nuevo algoritmo de indexación y búsqueda basado en grafos, denominado HM-ANN, asocia el diseño jerárquico de las RNA basadas en grafos con la heterogeneidad de memoria en HM. Las evaluaciones muestran que HM-ANN pertenece al nuevo estado del arte de los índices en conjuntos de datos de mil millones de puntos.</p>
<p>Observamos una tendencia tanto en el mundo académico como en la industria, que se centra en la creación de índices en dispositivos de almacenamiento persistente. Para descargar la presión de la DRAM, Disk-ANN [1] es un índice construido sobre SSD, cuyo rendimiento es significativamente inferior al de PMem. Sin embargo, la construcción de HM-ANN sigue llevando unos pocos días, en los que no se establecen grandes diferencias en comparación con Disk-ANN. Creemos que es posible optimizar el tiempo de construcción de HM-ANN si utilizamos las características de PMem con más cuidado, por ejemplo, teniendo en cuenta la granularidad de PMem (256 Bytes) y utilizando instrucciones de flujo para evitar las líneas de soltero. También creemos que en el futuro se propondrán más enfoques con dispositivos de almacenamiento duraderos.</p>
<custom-h1>Referencia</custom-h1><p>[1]: Suhas Jayaram Subramanya y Devvrit y Rohan Kadekodi y Ravishankar Krishaswamy y Ravishankar Krishaswamy: DiskANN: búsqueda rápida y precisa del vecino más cercano de mil millones de puntos en un solo nodo, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: búsqueda rápida y precisa de vecinos más cercanos de mil millones de puntos en un solo nodo - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: búsqueda rápida y precisa de vecinos más cercanos de miles de millones de puntos en un único nodo</a></p>
<p>[2]: Alexander van Renen y Lukas Vogel y Viktor Leis y Thomas Neumann y Alfons Kemper: Primitivas de E/S de memoria persistente, CoRR &amp; DaMoN, 2019.</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Primitivas de E/S de memoria persistente</a></p>
