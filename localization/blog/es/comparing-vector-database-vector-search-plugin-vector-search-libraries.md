---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Comparación de bases de datos vectoriales, bibliotecas de búsqueda vectorial y
  plugins de búsqueda vectorial
author: Frank Liu
date: 2023-11-9
desc: >-
  En este post, seguiremos explorando el intrincado reino de la búsqueda
  vectorial, comparando bases de datos vectoriales, plugins de búsqueda
  vectorial y bibliotecas de búsqueda vectorial.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hola - ¡Bienvenido de nuevo a Base de datos vectorial 101!</p>
<p>El auge de <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> y otros grandes modelos lingüísticos (LLM) ha impulsado el crecimiento de las tecnologías de búsqueda vectorial, con bases de datos vectoriales especializadas como <a href="https://zilliz.com/what-is-milvus">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a> junto con bibliotecas como <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> y plugins de búsqueda vectorial integrados en bases de datos convencionales.</p>
<p>En nuestro <a href="https://zilliz.com/learn/what-is-vector-database">anterior post de la serie</a>, profundizamos en los fundamentos de las bases de datos vectoriales. En este post, seguiremos explorando el intrincado reino de la búsqueda vectorial, comparando bases de datos vectoriales, plugins de búsqueda vectorial y bibliotecas de búsqueda vectorial.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">¿Qué es la búsqueda vectorial?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda<a href="https://zilliz.com/learn/vector-similarity-search">vectorial</a>, también conocida como búsqueda de similitud vectorial, es una técnica para recuperar los resultados top-k más similares o semánticamente relacionados con un vector de consulta dado entre una extensa colección de datos vectoriales densos. Antes de realizar búsquedas de similitud, aprovechamos las redes neuronales para transformar <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a>, como texto, imágenes, vídeos y audio, en vectores numéricos de alta dimensión denominados vectores de incrustación. Tras generar los vectores incrustados, los motores de búsqueda vectorial comparan la distancia espacial entre el vector de consulta de entrada y los vectores de los almacenes vectoriales. Cuanto más cerca estén en el espacio, más parecidos serán.</p>
<p>En el mercado existen múltiples tecnologías de búsqueda vectorial, incluidas bibliotecas de aprendizaje automático como NumPy de Python, bibliotecas de búsqueda vectorial como FAISS, plugins de búsqueda vectorial construidos sobre bases de datos tradicionales y bases de datos vectoriales especializadas como Milvus y Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Bases de datos vectoriales frente a bibliotecas de búsqueda vectorial<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p>Las<a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de datos vectoriales especializadas</a> no son la única pila para las búsquedas de similitud. Antes de la aparición de las bases de datos vectoriales, se utilizaban muchas bibliotecas de búsqueda vectorial, como FAISS, ScaNN y HNSW, para la recuperación de vectores.</p>
<p>Las bibliotecas de búsqueda vectorial pueden ayudarle a construir rápidamente un prototipo de sistema de búsqueda vectorial de alto rendimiento. Por ejemplo, FAISS es una librería de código abierto desarrollada por Meta para la búsqueda eficiente de similitudes y la agrupación de vectores densos. FAISS puede manejar colecciones de vectores de cualquier tamaño, incluso aquellas que no pueden cargarse completamente en memoria. Además, FAISS ofrece herramientas de evaluación y ajuste de parámetros. Aunque está escrito en C++, FAISS proporciona una interfaz Python/NumPy.</p>
<p>Sin embargo, las bibliotecas de búsqueda vectorial no son más que bibliotecas RNA ligeras en lugar de soluciones gestionadas, y su funcionalidad es limitada. Si el conjunto de datos es pequeño y limitado, estas bibliotecas pueden ser suficientes para el procesamiento de datos no estructurados, incluso para sistemas que funcionan en producción. Sin embargo, a medida que aumenta el tamaño de los conjuntos de datos y se incorporan más usuarios, el problema de la escala se hace cada vez más difícil de resolver. Además, no permiten modificar sus datos índice y no pueden consultarse durante la importación de datos.</p>
<p>En cambio, las bases de datos vectoriales son una solución más óptima para el almacenamiento y la recuperación de datos no estructurados. Pueden almacenar y consultar millones o incluso miles de millones de vectores al tiempo que proporcionan respuestas en tiempo real; son altamente escalables para satisfacer las crecientes necesidades empresariales de los usuarios.</p>
<p>Además, las bases de datos vectoriales como Milvus tienen características mucho más fáciles de usar para datos estructurados/semi-estructurados: natividad en la nube, multi-tenancy, escalabilidad, etc. Estas características quedarán claras a medida que profundicemos en este tutorial.</p>
<p>También operan en una capa de abstracción totalmente diferente de las bibliotecas de búsqueda vectorial: las bases de datos vectoriales son servicios completos, mientras que las bibliotecas RNA están pensadas para integrarse en la aplicación que estás desarrollando. En este sentido, las bibliotecas RNA son uno de los muchos componentes sobre los que se construyen las bases de datos vectoriales, de forma similar a como Elasticsearch se construye sobre Apache Lucene.</p>
<p>Para dar un ejemplo de por qué esta abstracción es tan importante, veamos cómo insertar un nuevo elemento de datos no estructurados en una base de datos vectorial. Esto es súper fácil en Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>Es realmente tan fácil como eso - 3 líneas de código. Con una biblioteca como FAISS o ScaNN, no hay, por desgracia, ninguna manera fácil de hacer esto sin recrear manualmente todo el índice en ciertos puntos de control. Incluso si se pudiera, las bibliotecas de búsqueda vectorial seguirían careciendo de escalabilidad y multi-tenancy, dos de las características más importantes de las bases de datos vectoriales.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Bases de datos vectoriales frente a complementos de búsqueda vectorial para bases de datos tradicionales<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien, ahora que hemos establecido la diferencia entre las bibliotecas de búsqueda vectorial y las bases de datos vectoriales, veamos en qué se diferencian las bases de datos vectoriales de <strong>los plugins de búsqueda v</strong>ectorial.</p>
<p>Cada vez más bases de datos relacionales tradicionales y sistemas de búsqueda como Clickhouse y <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> incluyen complementos de búsqueda vectorial. Elasticsearch 8.0, por ejemplo, incluye funciones de inserción de vectores y búsqueda RNA que pueden invocarse a través de puntos finales de API restful. El problema con los plugins de búsqueda vectorial debería ser tan claro como la noche y el día: <strong>estas soluciones no adoptan un enfoque de pila completa para integrar la gestión y la búsqueda vectorial</strong>. En su lugar, estos plugins están pensados para ser mejoras sobre arquitecturas existentes, por lo que son limitados y no están optimizados. Desarrollar una aplicación de datos no estructurados sobre una base de datos tradicional sería como intentar colocar baterías de litio y motores eléctricos en el chasis de un coche de gasolina: ¡no es una buena idea!</p>
<p>Para ilustrarlo, volvamos a la lista de características que debería tener una base de datos vectorial (de la primera sección). Los plugins de búsqueda vectorial carecen de dos de estas características: capacidad de ajuste y API/SDK fáciles de usar. Seguiré utilizando el motor RNA de Elasticsearch como ejemplo; otros plugins de búsqueda vectorial funcionan de forma muy similar, por lo que no entraré mucho más en detalles. Elasticsearch admite el almacenamiento vectorial a través del tipo de campo de datos <code translate="no">dense_vector</code> y permite la consulta a través de <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>El plugin ANN de Elasticsearch sólo admite un algoritmo de indexación: Hierarchical Navigable Small Worlds, también conocido como HNSW (me gusta pensar que su creador se adelantó a Marvel a la hora de popularizar el multiverso). Además, sólo se admite la distancia L2/Euclídea como métrica de distancia. Es un buen comienzo, pero comparémoslo con Milvus, una base de datos vectorial en toda regla. Utilizando <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Aunque <a href="https://zilliz.com/comparison/elastic-vs-milvus">tanto Elasticsearch como Milvus</a> tienen métodos para crear índices, insertar vectores incrustados y realizar búsquedas de vecinos más cercanos, está claro a partir de estos ejemplos que Milvus tiene una API de búsqueda vectorial más intuitiva (mejor API de cara al usuario) y un índice vectorial más amplio + soporte de métrica de distancia (mejor capacidad de ajuste). Milvus también planea soportar más índices vectoriales y permitir la consulta a través de sentencias SQL en el futuro, mejorando aún más tanto la capacidad de ajuste como la facilidad de uso.</p>
<p>Acabamos de pasar por alto una gran cantidad de contenido. Es cierto que esta sección era bastante larga, así que para aquellos que la hayan hojeado, aquí va un resumen rápido: Milvus es mejor que los plugins de búsqueda vectorial porque Milvus se construyó desde cero como una base de datos vectorial, lo que permite un conjunto más rico de características y una arquitectura más adecuada para los datos no estructurados.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">¿Cómo elegir entre diferentes tecnologías de búsqueda vectorial?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>No todas las bases de datos vectoriales son iguales; cada una posee características únicas que se adaptan a aplicaciones específicas. Las bibliotecas y plugins de búsqueda vectorial son fáciles de usar e ideales para manejar entornos de producción a pequeña escala con millones de vectores. Si el tamaño de sus datos es pequeño y sólo necesita una funcionalidad básica de búsqueda vectorial, estas tecnologías son suficientes para su negocio.</p>
<p>Sin embargo, una base de datos vectorial especializada debería ser su primera opción para las empresas con un uso intensivo de datos que manejan cientos de millones de vectores y exigen respuestas en tiempo real. Milvus, por ejemplo, gestiona sin esfuerzo miles de millones de vectores, ofreciendo velocidades de consulta ultrarrápidas y una gran funcionalidad. Además, las soluciones totalmente gestionadas como Zilliz resultan aún más ventajosas, ya que le liberan de los retos operativos y le permiten centrarse exclusivamente en sus actividades empresariales principales.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Eche un vistazo a los cursos Vector Database 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Introducción a los datos no estructurados</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">¿Qué es una base de datos vectorial?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Comparación de bases de datos vectoriales, bibliotecas de búsqueda vectorial y complementos de búsqueda vectorial</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Introducción a Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Inicio rápido de Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Introducción a la búsqueda por similitud vectorial</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Conceptos básicos de índices vectoriales e índice de archivos invertido</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Cuantificación escalar y cuantificación de productos</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Pequeños mundos navegables jerárquicos (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Vecinos más próximos aproximados Oh, sí (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Elección del índice vectorial adecuado para su proyecto</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN y el algoritmo Vamana</a></li>
</ol>
