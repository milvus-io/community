---
id: deep-dive-8-knowhere.md
title: ¿Qué potencia la búsqueda de similitudes en la base de datos vectorial Milvus?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'Y no, no es Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/cydrain">Yudong Cai</a> y traducido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Como motor central de ejecución vectorial, Knowhere es para Milvus lo que un motor es para un coche deportivo. Este artículo presenta qué es Knowhere, en qué se diferencia de Faiss y cómo está estructurado el código de Knowhere.</p>
<p><strong>Saltar a:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">El concepto de Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere en la arquitectura Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere vs Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Entendiendo el código de Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Añadir índices a Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">El concepto de Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Estrechamente hablando, Knowhere es una interfaz de operación para acceder a los servicios en las capas superiores del sistema y las bibliotecas de búsqueda de similitud vectorial como <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> en las capas inferiores del sistema. Además, Knowhere también se encarga de la computación heterogénea. Más concretamente, Knowhere controla en qué hardware (por ejemplo, CPU o GPU) se ejecutan las solicitudes de creación y búsqueda de índices. Así es como Knowhere obtiene su nombre - sabiendo dónde ejecutar las operaciones. Más tipos de hardware incluyendo DPU y TPU serán soportados en futuras versiones.</p>
<p>En un sentido más amplio, Knowhere también incorpora otras bibliotecas de índices de terceros como Faiss. Por lo tanto, en su conjunto, Knowhere es reconocido como el motor central de computación vectorial en la base de datos vectorial Milvus.</p>
<p>Desde el concepto de Knowhere, podemos ver que sólo procesa tareas de computación de datos, mientras que aquellas tareas como sharding, balance de carga, recuperación de desastres están más allá del ámbito de trabajo de Knowhere.</p>
<p>A partir de Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (en sentido amplio) se independiza del proyecto Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere en la arquitectura Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>arquitectura de knowhere</span> </span></p>
<p>La computación en Milvus involucra principalmente operaciones vectoriales y escalares. Knowhere sólo maneja las operaciones sobre vectores en Milvus. La figura anterior ilustra la arquitectura Knowhere en Milvus.</p>
<p>La capa inferior es el hardware del sistema. Las bibliotecas de índices de terceros están sobre el hardware. Luego Knowhere interactúa con el nodo de índice y el nodo de consulta en la parte superior a través de CGO.</p>
<p>Este artículo habla de Knowhere en su sentido más amplio, como se marca dentro del marco azul en la ilustración de la arquitectura.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere Vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere no sólo amplía las funciones de Faiss sino que también optimiza el rendimiento. Más específicamente, Knowhere tiene las siguientes ventajas.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Soporte para BitsetView</h3><p>Inicialmente, bitset fue introducido en Milvus con el propósito de &quot;borrado suave&quot;. Un vector borrado suavemente aún existe en la base de datos pero no será computado durante una búsqueda o consulta de similitud de vectores. Cada bit del conjunto de bits corresponde a un vector indexado. Si un vector está marcado como "1" en el conjunto de bits, significa que se ha eliminado de forma suave y que no participará en la búsqueda de vectores.</p>
<p>Los parámetros del conjunto de bits se agregan a todas las API de consulta de índice Faiss expuestas en Knowhere, incluidos los índices de CPU y GPU.</p>
<p>Obtenga más información sobre <a href="https://milvus.io/blog/2022-2-14-bitset.md">cómo bitset permite la versatilidad de la búsqueda vectorial</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Soporte para más métricas de similitud para indexar vectores binarios</h3><p>Además de <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, Knowhere también soporta <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superestructura</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Subestructura</a>. Jaccard y Tanimoto pueden utilizarse para medir la similitud entre dos conjuntos de muestras mientras que Superestructura y Subestructura pueden utilizarse para medir la similitud de estructuras químicas.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Soporte para el conjunto de instrucciones AVX512</h3><p>Faiss soporta múltiples conjuntos de instrucciones incluyendo <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere amplía los conjuntos de instrucciones soportados añadiendo <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, que puede <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">mejorar el rendimiento de la creación de índices y consultas entre un 20% y un 30%</a> en comparación con AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Selección automática de instrucciones SIMD</h3><p>Knowhere está diseñado para funcionar bien en un amplio espectro de procesadores CPU (tanto en plataformas locales como en la nube) con diferentes instrucciones SIMD (por ejemplo, SIMD SSE, AVX, AVX2 y AVX512). Por lo tanto, el reto es, dada una única pieza de software binario (es decir, Milvus), ¿cómo hacer que invoque automáticamente las instrucciones SIMD adecuadas en cualquier procesador de CPU? Faiss no admite la selección automática de instrucciones SIMD y los usuarios deben especificar manualmente la bandera SIMD (por ejemplo, "-msse4") durante la compilación. Sin embargo, Knowhere se construye mediante la refactorización del código base de Faiss. Las funciones comunes (por ejemplo, el cálculo de similitudes) que dependen de las aceleraciones SIMD se eliminan. Luego, para cada función, se implementan cuatro versiones (es decir, SSE, AVX, AVX2, AVX512) y cada una se coloca en un archivo fuente separado. A continuación, los archivos fuente se compilan individualmente con el indicador SIMD correspondiente. Por lo tanto, en tiempo de ejecución, Knowhere puede elegir automáticamente las instrucciones SIMD más adecuadas basándose en las banderas actuales de la CPU y luego enlazar los punteros de función correctos utilizando hooking.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Otras optimizaciones de rendimiento</h3><p>Lea <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a> para más información sobre la optimización del rendimiento de Knowhere.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Entendiendo el código Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se mencionó en la primera sección, Knowhere sólo maneja operaciones de búsqueda de vectores. Por lo tanto, Knowhere sólo procesa el campo vectorial de una entidad (actualmente, sólo se admite un campo vectorial para entidades en una colección). La construcción de índices y la búsqueda de similitud vectorial también se dirigen al campo vectorial de un segmento. Para tener una mejor comprensión del modelo de datos, lea el blog <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">aquí</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>campos de entidad</span> </span></p>
<h3 id="Index" class="common-anchor-header">Índice</h3><p>El índice es un tipo de estructura de datos independiente de los datos vectoriales originales. La indexación requiere cuatro pasos: crear un índice, entrenar datos, insertar datos y construir un índice.</p>
<p>Para algunas de las aplicaciones de IA, el entrenamiento del conjunto de datos es un proceso independiente de la búsqueda de vectores. En este tipo de aplicaciones, los datos de los conjuntos de datos se entrenan primero y luego se insertan en una base de datos vectorial como Milvus para la búsqueda de similitudes. Los conjuntos de datos abiertos como sift1M y sift1B proporcionan datos para el entrenamiento y las pruebas. Sin embargo, en Knowhere, los datos para el entrenamiento y la búsqueda se mezclan. Es decir, Knowhere entrena todos los datos en un segmento y luego inserta todos los datos entrenados y construye un índice para ellos.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Estructura del código Knowhere</h3><p>DataObj es la clase base de todas las estructuras de datos en Knowhere. <code translate="no">Size()</code> es el único método virtual en DataObj. La clase Index hereda de DataObj con un campo llamado &quot;size_&quot;. La clase Index también tiene dos métodos virtuales - <code translate="no">Serialize()</code> y <code translate="no">Load()</code>. La clase VecIndex derivada de Index es la clase base virtual para todos los índices vectoriales. VecIndex proporciona métodos como <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, y <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>clase base</span> </span></p>
<p>Otros tipos de índices se enumeran a la derecha en la figura anterior.</p>
<ul>
<li>El índice Faiss tiene dos subclases: FaissBaseIndex para todos los índices sobre vectores en coma flotante, y FaissBaseBinaryIndex para todos los índices sobre vectores binarios.</li>
<li>GPUIndex es la clase base para todos los índices Faiss GPU.</li>
<li>OffsetBaseIndex es la clase base para todos los índices de desarrollo propio. En el archivo de índice sólo se almacena el ID del vector. Como resultado, el tamaño de un fichero de índices para vectores de 128 dimensiones puede reducirse en 2 órdenes de magnitud. Recomendamos tener en cuenta también los vectores originales cuando se utilice este tipo de índice para la búsqueda de similitud vectorial.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Técnicamente hablando, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> no es un índice, sino que se utiliza para la búsqueda por fuerza bruta. Cuando se insertan vectores en la base de datos de vectores, no es necesario entrenar los datos ni construir el índice. Las búsquedas se realizarán directamente sobre los datos vectoriales insertados.</p>
<p>Sin embargo, en aras de la coherencia del código, IDMAP también hereda de la clase VecIndex con todas sus interfaces virtuales. El uso de IDMAP es el mismo que el de otros índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Los índices IVF (archivo invertido) son los más utilizados. La clase IVF deriva de VecIndex y FaissBaseIndex, y se extiende a IVFSQ e IVFPQ. GPUIVF deriva de GPUIndex e IVF. GPUIVF se extiende a GPUIVFSQ y GPUIVFPQ.</p>
<p>IVFSQHybrid es una clase de índice híbrido de desarrollo propio que se ejecuta mediante cuantificación gruesa en la GPU. Y la búsqueda en el cubo se ejecuta en la CPU. Este tipo de índice puede reducir la aparición de copias de memoria entre CPU y GPU aprovechando la potencia de cálculo de la GPU. IVFSQHybrid tiene la misma tasa de recuperación que GPUIVFSQ, pero presenta un mejor rendimiento.</p>
<p>La estructura de clases base de los índices binarios es relativamente más sencilla. BinaryIDMAP y BinaryIVF derivan de FaissBaseBinaryIndex y VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>índice de terceros</span> </span></p>
<p>Actualmente, sólo se soportan dos tipos de índices de terceros aparte de Faiss: el índice basado en árbol Annoy, y el índice basado en grafo HNSW. Estos dos índices de terceros comunes y de uso frecuente se derivan de VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Añadir índices a Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Si desea añadir nuevos índices a Knowhere, puede referirse primero a los índices existentes:</p>
<ul>
<li>Para añadir un índice basado en cuantización, consulte IVF_FLAT.</li>
<li>Para añadir un índice basado en gráficos, consulte HNSW.</li>
<li>Para añadir un índice basado en árboles, consulte Annoy.</li>
</ul>
<p>Después de referirse al índice existente, puede seguir los siguientes pasos para agregar un nuevo índice a Knowhere.</p>
<ol>
<li>Añada el nombre del nuevo índice en <code translate="no">IndexEnum</code>. El tipo de datos es cadena.</li>
<li>Agregue la comprobación de validación de datos en el nuevo índice en el archivo <code translate="no">ConfAdapter.cpp</code>. La comprobación de validación es principalmente para validar los parámetros para la formación de datos y consulta.</li>
<li>Cree un nuevo archivo para el nuevo índice. La clase base del nuevo índice debe incluir <code translate="no">VecIndex</code>, y la interfaz virtual necesaria de <code translate="no">VecIndex</code>.</li>
<li>Añade la lógica de construcción del nuevo índice en <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Añada la prueba unitaria en el directorio <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, orquestamos esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consultas en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
