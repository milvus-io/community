---
id: milvus-performance-AVX-512-vs-AVX2.md
title: ¿Qué son las extensiones vectoriales avanzadas?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Descubra el rendimiento de Milvus en AVX-512 frente a AVX2 utilizando una
  variedad de índices vectoriales diferentes.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Rendimiento de Milvus en AVX-512 frente a AVX2</custom-h1><p>Las máquinas inteligentes conscientes que quieren apoderarse del mundo son un elemento fijo en la ciencia ficción, pero en realidad los ordenadores modernos son muy obedientes. Si no se les dice nada, rara vez saben qué hacer. Los ordenadores realizan tareas basándose en instrucciones, u órdenes, enviadas desde un programa a un procesador. En su nivel más bajo, cada instrucción es una secuencia de unos y ceros que describe una operación para que la ejecute un ordenador. Normalmente, en los lenguajes ensambladores de los ordenadores cada declaración en lenguaje máquina corresponde a una instrucción del procesador. La unidad central de procesamiento (CPU) se basa en instrucciones para realizar cálculos y controlar sistemas. Además, el rendimiento de la CPU suele medirse en función de la capacidad de ejecución de las instrucciones (por ejemplo, el tiempo de ejecución).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">¿Qué son las extensiones vectoriales avanzadas?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>Las extensiones vectoriales avanzadas (AVX) son un conjunto de instrucciones para microprocesadores que se basan en la familia x86 de arquitecturas de conjuntos de instrucciones. Propuesto por primera vez por Intel en marzo de 2008, AVX obtuvo un amplio apoyo tres años después con el lanzamiento de Sandy Bridge -una microarquitectura utilizada en la segunda generación de procesadores Intel Core (por ejemplo, Core i7, i5, i3)- y la microarquitectura competidora de AMD también lanzada en 2011, Bulldozer.</p>
<p>AVX introdujo un nuevo esquema de codificación, nuevas funciones y nuevas instrucciones. AVX2 amplía la mayoría de las operaciones con enteros a 256 bits e introduce operaciones de multiplicación-acumulación fusionadas (FMA). AVX-512 amplía AVX a operaciones de 512 bits utilizando una nueva codificación de prefijos de extensión vectorial mejorada (EVEX).</p>
<p><a href="https://milvus.io/docs">Milvus</a> es una base de datos vectorial de código abierto diseñada para aplicaciones de búsqueda de similitudes e inteligencia artificial (IA). La plataforma es compatible con el conjunto de instrucciones AVX-512, lo que significa que puede utilizarse con todas las CPU que incluyan las instrucciones AVX-512. Milvus tiene amplias aplicaciones que abarcan, entre otros, los sistemas de recomendación, la visión por ordenador y el procesamiento del lenguaje natural (PLN). Este artículo presenta resultados de rendimiento y análisis de una base de datos vectorial Milvus en AVX-512 y AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Rendimiento de Milvus en AVX-512 frente a AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">Configuración del sistema</h3><ul>
<li>CPU: CPU Intel® Platinum 8163 a 2,50GHz24 núcleos 48 hilos</li>
<li>Número de CPU: 2</li>
<li>Tarjeta gráfica, GeForce RTX 2080Ti 11GB 4 tarjetas</li>
<li>Memoria: 768 GB</li>
<li>Disco: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Parámetros de Milvus</h3><ul>
<li>cahce.cahe_size: 25, El tamaño de la memoria de la CPU utilizada para el almacenamiento en caché de datos para una consulta más rápida.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Nota: <code translate="no">nlist</code> es el parámetro de indexación a crear desde el cliente; <code translate="no">nprobe</code> el parámetro de búsqueda. Tanto IVF_FLAT como IVF_SQ8 utilizan un algoritmo de clustering para particionar un gran número de vectores en buckets, siendo <code translate="no">nlist</code> el número total de buckets a particionar durante el clustering. El primer paso de una consulta es encontrar el número de buckets más cercanos al vector objetivo, y el segundo paso es encontrar los vectores top-k en estos buckets comparando la distancia de los vectores. <code translate="no">nprobe</code> se refiere al número de buckets en el primer paso.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Conjunto de datos: Conjunto de datos SIFT10M</h3><p>Estas pruebas utilizan el <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">conjunto de datos SIFT10M</a>, que contiene un millón de vectores de 128 dimensiones y se utiliza a menudo para analizar el rendimiento de los métodos de búsqueda del vecino más próximo correspondientes. Se comparará el tiempo de búsqueda top-1 para nq = [1, 10, 100, 500, 1000] entre los dos conjuntos de instrucciones.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Resultados por tipo de índice vectorial</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Los índices vectoriales</a> son estructuras de datos eficientes en términos de tiempo y espacio que se construyen sobre el campo vectorial de una colección utilizando diversos modelos matemáticos. La indexación de vectores permite realizar búsquedas eficientes en grandes conjuntos de datos cuando se intenta identificar vectores similares a un vector de entrada. Debido a que la recuperación precisa requiere mucho tiempo, la mayoría de los tipos de índices <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">compatibles con Milvus</a> utilizan la búsqueda aproximada del vecino más próximo (RNA).</p>
<p>Para estas pruebas, se utilizaron tres índices con AVX-512 y AVX2: IVF_FLAT, IVF_SQ8 y HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>El archivo invertido (IVF_FLAT) es un tipo de índice basado en la cuantización. Es el índice IVF más básico, y los datos codificados almacenados en cada unidad son coherentes con los datos originales. El índice divide los datos vectoriales en un número de unidades de clúster (nlist), y luego compara las distancias entre el vector de entrada objetivo y el centro de cada clúster. Dependiendo del número de clusters que el sistema esté configurado para consultar (nprobe), los resultados de la búsqueda de similitud se devuelven basándose en comparaciones entre la entrada objetivo y los vectores en el cluster(s) más similar(es) solamente - reduciendo drásticamente el tiempo de consulta. Ajustando nprobe, se puede encontrar un equilibrio ideal entre precisión y velocidad para un escenario determinado.</p>
<p><strong>Resultados de rendimiento</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT no realiza ninguna compresión, por lo que los archivos de índice que produce tienen aproximadamente el mismo tamaño que los datos vectoriales originales sin indexar. Cuando los recursos de memoria del disco, la CPU o la GPU son limitados, IVF_SQ8 es una mejor opción que IVF_FLAT. Este tipo de índice puede convertir cada dimensión del vector original de un número en coma flotante de cuatro bytes a un entero sin signo de un byte realizando una cuantización escalar. Esto reduce el consumo de memoria del disco, la CPU y la GPU en un 70-75%.</p>
<p><strong>Resultados de rendimiento</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) es un algoritmo de indexación basado en grafos. Las consultas comienzan en la capa superior buscando el nodo más cercano al objetivo, y luego desciende a la siguiente capa para realizar otra ronda de búsqueda. Tras varias iteraciones, puede acercarse rápidamente a la posición del objetivo.</p>
<p><strong>Resultados de rendimiento</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Comparación de índices vectoriales<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>La recuperación de vectores es sistemáticamente más rápida en el juego de instrucciones AVX-512 que en AVX2. Esto se debe a que AVX-512 admite cálculos de 512 bits, frente a los 256 bits de AVX2. En teoría, AVX-512 debería ser el doble de rápido que AVX2, pero Milvus realiza otras tareas que consumen mucho tiempo, además de los cálculos de similitud vectorial. Es poco probable que el tiempo total de recuperación de AVX-512 sea el doble que el de AVX2 en situaciones reales. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>La recuperación es significativamente más rápida en el índice HNSW que en los otros dos índices, mientras que la recuperación IVF_SQ8 es ligeramente más rápida que IVF_FLAT en ambos conjuntos de instrucciones. Esto se debe probablemente a que IVF_SQ8 requiere sólo el 25% de la memoria que necesita IVF_FLAT. IVF_SQ8 carga 1 byte por cada dimensión vectorial, mientras que IVF_FLAT carga 4 bytes por dimensión vectorial. Lo más probable es que el tiempo necesario para el cálculo esté limitado por el ancho de banda de la memoria. Como resultado, IVF_SQ8 no sólo ocupa menos espacio, sino que también requiere menos tiempo para recuperar los vectores.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus es una base de datos vectorial versátil y de alto rendimiento<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Las pruebas presentadas en este artículo demuestran que Milvus ofrece un rendimiento excelente tanto en los conjuntos de instrucciones AVX-512 como AVX2 utilizando diferentes índices. Independientemente del tipo de índice, Milvus rinde mejor en AVX-512.</p>
<p>Milvus es compatible con diversas plataformas de aprendizaje profundo y se utiliza en diversas aplicaciones de IA. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, una versión reimaginada de la base de datos vectorial más popular del mundo, se publicó bajo una licencia de código abierto en julio de 2021. Para más información sobre el proyecto, consulte los siguientes recursos:</p>
<ul>
<li>Encuentre o contribuya a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúe con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
