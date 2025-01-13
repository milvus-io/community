---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Mejores prácticas para el índice FIV
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Cómo seleccionar parámetros de índice para el índice IVF</custom-h1><p>En <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Mejores prácticas para la configuración de Milvus</a>, se introdujeron algunas de las mejores prácticas para la configuración de Milvus 0.6.0. En este artículo, también introduciremos algunas mejores prácticas para configurar parámetros clave en clientes Milvus para operaciones que incluyen la creación de una tabla, la creación de índices y la búsqueda. Estos parámetros pueden afectar al rendimiento de la búsqueda.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Al crear una tabla, el parámetro index_file_size se utiliza para especificar el tamaño, en MB, de un único archivo para el almacenamiento de datos. El valor por defecto es 1024. Cuando se importan datos vectoriales, Milvus combina incrementalmente los datos en archivos. Cuando el tamaño del archivo alcanza index_file_size, este archivo no acepta nuevos datos y Milvus guarda los nuevos datos en otro archivo. Todos estos son archivos de datos sin procesar. Cuando se crea un índice, Milvus genera un fichero índice para cada fichero de datos brutos. Para el tipo de índice IVFLAT, el tamaño del fichero índice es aproximadamente igual al tamaño del fichero de datos brutos correspondiente. Para el índice SQ8, el tamaño de un fichero índice es aproximadamente el 30 por ciento del fichero de datos brutos correspondiente.</p>
<p>Durante una búsqueda, Milvus busca en cada archivo de índice uno por uno. Según nuestra experiencia, cuando index_file_size cambia de 1024 a 2048, el rendimiento de la búsqueda mejora entre un 30 y un 50 por ciento. Sin embargo, si el valor es demasiado grande, es posible que los archivos de gran tamaño no se carguen en la memoria de la GPU (o incluso en la memoria de la CPU). Por ejemplo, si la memoria de la GPU es de 2 GB y index_file_size es de 3 GB, el archivo de índice no podrá cargarse en la memoria de la GPU. Normalmente, fijamos index_file_size en 1024 MB o 2048 MB.</p>
<p>La siguiente tabla muestra una prueba utilizando sift50m para index_file_size. El tipo de índice es SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-resultados-prueba-milvus.png</span> </span></p>
<p>Podemos ver que en modo CPU y modo GPU, cuando index_file_size es 2048 MB en lugar de 1024 MB, el rendimiento de la búsqueda mejora significativamente.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>y</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>El parámetro <code translate="no">nlist</code> se utiliza para crear índices y el parámetro <code translate="no">nprobe</code> para realizar búsquedas. Tanto IVFLAT como SQ8 utilizan algoritmos de clustering para dividir un gran número de vectores en clusters, o buckets. <code translate="no">nlist</code> es el número de buckets durante el clustering.</p>
<p>Cuando la búsqueda se realiza mediante índices, el primer paso consiste en encontrar un cierto número de buckets más cercanos al vector objetivo y el segundo paso consiste en encontrar los k vectores más similares a partir de los buckets por distancia vectorial. <code translate="no">nprobe</code> es el número de buckets en el primer paso.</p>
<p>Generalmente, el aumento de <code translate="no">nlist</code> conduce a más cubos y menos vectores en un cubo durante la agrupación. Como resultado, la carga computacional disminuye y el rendimiento de la búsqueda mejora. Sin embargo, con menos vectores para la comparación de similitudes, es posible que no se obtenga el resultado correcto.</p>
<p>Si se aumenta <code translate="no">nprobe</code>, habrá que buscar en más cubos. Como resultado, la carga computacional aumenta y el rendimiento de la búsqueda se deteriora, pero la precisión de la búsqueda mejora. La situación puede variar en función de los conjuntos de datos con distribuciones diferentes. También debe tener en cuenta el tamaño del conjunto de datos al establecer <code translate="no">nlist</code> y <code translate="no">nprobe</code>. En general, se recomienda que <code translate="no">nlist</code> pueda ser <code translate="no">4 * sqrt(n)</code>, donde n es el número total de vectores. En cuanto a <code translate="no">nprobe</code>, debe hacer un compromiso entre precisión y eficiencia y la mejor manera es determinar el valor mediante prueba y error.</p>
<p>La siguiente tabla muestra una prueba utilizando sift50m para <code translate="no">nlist</code> y <code translate="no">nprobe</code>. El tipo de índice es SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>La tabla compara el rendimiento y la precisión de la búsqueda utilizando distintos valores de <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Sólo se muestran los resultados de GPU porque las pruebas de CPU y GPU tienen resultados similares. En esta prueba, a medida que los valores de <code translate="no">nlist</code>/<code translate="no">nprobe</code> aumentan en el mismo porcentaje, la precisión de la búsqueda también aumenta. Cuando <code translate="no">nlist</code> = 4096 y <code translate="no">nprobe</code> es 128, Milvus tiene el mejor rendimiento de búsqueda. En conclusión, a la hora de determinar los valores de <code translate="no">nlist</code> y <code translate="no">nprobe</code>, hay que buscar un equilibrio entre rendimiento y precisión teniendo en cuenta los distintos conjuntos de datos y requisitos.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Cuando el tamaño de los datos es mayor que <code translate="no">index_file_size</code>, cuanto mayor sea el valor de <code translate="no">index_file_size</code>, mejor será el rendimiento de la búsqueda.<code translate="no">nlist</code> y <code translate="no">nprobe</code>：Debe hacer un compromiso entre rendimiento y precisión.</p>
