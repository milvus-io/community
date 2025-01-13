---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Búsqueda basada en palabras clave
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia utilizó Milvus para crear un sistema de búsqueda 10 veces más
  inteligente que ha mejorado drásticamente la experiencia del usuario.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Cómo utilizamos la búsqueda semántica para hacer nuestra búsqueda 10 veces más inteligente</custom-h1><p>En Tokopedia, entendemos que el valor de nuestro corpus de productos sólo se desbloquea cuando nuestros compradores pueden encontrar productos que son relevantes para ellos, por lo que nos esforzamos por mejorar la relevancia de los resultados de búsqueda.</p>
<p>Para avanzar en este esfuerzo, estamos introduciendo <strong>la búsqueda por similitud</strong> en Tokopedia. Si va a la página de resultados de búsqueda en dispositivos móviles, encontrará un botón "..." que expone un menú que le da la opción de buscar productos similares al producto.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Búsqueda basada en palabras clave<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search utiliza <strong>Elasticsearch</strong> para la búsqueda y clasificación de productos. Para cada solicitud de búsqueda, primero consultamos a Elasticsearch, que clasifica los productos según la consulta de búsqueda. ElasticSearch almacena cada palabra como una secuencia de números que representan códigos <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (o UTF) para cada letra. Construye un <a href="https://en.wikipedia.org/wiki/Inverted_index">índice invertido</a> para averiguar rápidamente qué documentos contienen palabras de la consulta del usuario y, a continuación, encuentra la mejor coincidencia entre ellos utilizando varios algoritmos de puntuación. Estos algoritmos no tienen en cuenta el significado de las palabras, sino la frecuencia con la que aparecen en el documento, la proximidad entre ellas, etc. Obviamente, la representación ASCII contiene suficiente información para transmitir la semántica (al fin y al cabo, los humanos podemos entenderla). Por desgracia, no existe un buen algoritmo para que el ordenador compare las palabras codificadas en ASCII por su significado.</p>
<h2 id="Vector-representation" class="common-anchor-header">Representación vectorial<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Una solución sería idear una representación alternativa, que nos dijera no sólo las letras que contiene la palabra, sino también algo sobre su significado. Por ejemplo, podríamos codificar <em>con qué otras palabras se utiliza frecuentemente nuestra palabra</em> (representadas por el contexto probable). Entonces supondríamos que contextos similares representan cosas similares, e intentaríamos compararlas utilizando métodos matemáticos. Incluso podríamos encontrar la manera de codificar frases enteras por su significado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Cómo utilizamos la búsqueda semántica para hacer nuestra búsqueda 10 veces más inteligente_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Seleccionar un motor de búsqueda por similitud de incrustación<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que tenemos vectores de características, la cuestión que queda por resolver es cómo recuperar del gran volumen de vectores los que son similares al vector objetivo. Cuando se trata del motor de búsqueda de incrustaciones, hemos probado POC en varios motores disponibles en Github algunos de ellos son FAISS, Vearch, Milvus.</p>
<p>Preferimos Milvus a otros motores basándonos en los resultados de las pruebas de carga. Por un lado, hemos utilizado FAISS antes en otros equipos y por lo tanto nos gustaría probar algo nuevo. En comparación con Milvus, FAISS es más una biblioteca subyacente, por lo que no es muy cómodo de usar. A medida que fuimos aprendiendo más sobre Milvus, finalmente decidimos adoptar Milvus por sus dos características principales:</p>
<ul>
<li><p>Milvus es muy fácil de usar. Todo lo que necesitas hacer es extraer su imagen Docker y actualizar los parámetros basados en tu propio escenario.</p></li>
<li><p>Soporta más índices y tiene una documentación de apoyo detallada.</p></li>
</ul>
<p>En resumen, Milvus es muy fácil de usar y la documentación es bastante detallada. Si se encuentra con algún problema, normalmente puede encontrar soluciones en la documentación; de lo contrario, siempre puede obtener soporte de la comunidad Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Servicio de cluster Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Después de decidir utilizar Milvus como motor de búsqueda vectorial de características, decidimos utilizar Milvus para uno de nuestros casos de uso del servicio Ads en el que queríamos emparejar palabras clave <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">de bajo índice de llenado</a> con palabras clave de alto índice de llenado. Configuramos un nodo independiente en un entorno de desarrollo (DEV) y comenzamos a servir, había estado funcionando bien durante unos días, y nos había proporcionado métricas CTR/CVR mejoradas. Si un nodo independiente se bloquea en producción, todo el servicio dejará de estar disponible. Por lo tanto, necesitamos desplegar un servicio de búsqueda de alta disponibilidad.</p>
<p>Milvus proporciona tanto Mishards, un middleware de fragmentación de clústeres, como Milvus-Helm para la configuración. En Tokopedia utilizamos Ansible playbooks para la configuración de la infraestructura, por lo que creamos un playbook para la orquestación de la infraestructura. El siguiente diagrama de la documentación de Milvus muestra cómo funciona Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Cómo utilizamos la búsqueda semántica para hacer nuestra búsqueda 10 veces más inteligente_3.png</span> </span></p>
<p>Mishards desciende en cascada una solicitud de la línea ascendente a sus submódulos dividiendo la solicitud de la línea ascendente y, a continuación, recopila y devuelve los resultados de los subservicios a la línea ascendente. A continuación se muestra la arquitectura general de la solución de clúster basada en Mishards: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>La documentación oficial proporciona una introducción clara de Mishards. Puede consultar <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> si está interesado.</p>
<p>En nuestro servicio de palabra clave a palabra clave, desplegamos un nodo de escritura, dos nodos de sólo lectura y una instancia de middleware Mishards en GCP, utilizando Milvus ansible. Hasta ahora ha sido estable. La <a href="https://milvus.io/docs/v0.10.5/index.md">indexación</a>, un proceso de organización de datos que acelera drásticamente la búsqueda de grandes volúmenes de datos, es un componente fundamental que permite consultar de forma eficiente los conjuntos de datos de millones, miles de millones o incluso billones de vectores en los que se basan los motores de búsqueda de similitudes.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">¿Cómo acelera la indexación vectorial la búsqueda de similitudes?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Los motores de búsqueda por similitud comparan los datos de entrada con una base de datos para encontrar los objetos más similares. La indexación es el proceso de organización eficiente de los datos y desempeña un papel fundamental en la utilidad de la búsqueda de similitudes, ya que acelera drásticamente las consultas sobre grandes conjuntos de datos, que consumen mucho tiempo. Una vez indexado un gran conjunto de datos vectoriales, las consultas pueden dirigirse a los clusters, o subconjuntos de datos, que tienen más probabilidades de contener vectores similares a una consulta de entrada. En la práctica, esto significa que se sacrifica un cierto grado de precisión para acelerar las consultas sobre datos vectoriales realmente grandes.</p>
<p>Se puede establecer una analogía con un diccionario, en el que las palabras se ordenan alfabéticamente. Al buscar una palabra, es posible navegar rápidamente a una sección que sólo contenga palabras con la misma inicial, lo que acelera drásticamente la búsqueda de la definición de la palabra introducida.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">¿Y ahora qué?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Cómo utilizamos la búsqueda semántica para hacer nuestra búsqueda 10 veces más inteligente_5.jpeg</span> </span></p>
<p>Como hemos visto, no hay una solución que sirva para todo, siempre queremos mejorar el rendimiento del modelo utilizado para obtener las incrustaciones.</p>
<p>Además, desde un punto de vista técnico, queremos ejecutar varios modelos de aprendizaje al mismo tiempo y comparar los resultados de los distintos experimentos. En este espacio encontrarás más información sobre nuestros experimentos, como la búsqueda de imágenes y vídeos.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Referencias:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Este artículo de blog ha sido reproducido de: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Lea otras <a href="https://zilliz.com/user-stories">historias de usuarios</a> para aprender más sobre cómo hacer cosas con Milvus.</p>
