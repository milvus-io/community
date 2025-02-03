---
id: multimodal-semantic-search-with-images-and-text.md
title: Búsqueda semántica multimodal con imágenes y texto
author: Stefan Webb
date: 2025-02-3
desc: >-
  Aprenda a crear una aplicación de búsqueda semántica utilizando IA multimodal
  que comprenda las relaciones texto-imagen, más allá de la concordancia básica
  de palabras clave.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como humanos, interpretamos el mundo a través de nuestros sentidos. Oímos sonidos, vemos imágenes, vídeos y textos, a menudo superpuestos. Entendemos el mundo a través de estas múltiples modalidades y de la relación entre ellas. Para que la inteligencia artificial iguale o supere realmente las capacidades humanas, debe desarrollar esta misma capacidad de entender el mundo a través de múltiples lentes simultáneamente.</p>
<p>En este artículo, junto con el vídeo que lo acompaña (próximamente) y el cuaderno, mostraremos los últimos avances en modelos capaces de procesar texto e imágenes a la vez. Lo demostraremos construyendo una aplicación de búsqueda semántica que va más allá de la simple concordancia de palabras clave: entiende la relación entre lo que piden los usuarios y el contenido visual que buscan.</p>
<p>Lo que hace que este proyecto sea especialmente interesante es que se ha construido íntegramente con herramientas de código abierto: la base de datos vectorial Milvus, las bibliotecas de aprendizaje automático de HuggingFace y un conjunto de datos de reseñas de clientes de Amazon. Resulta sorprendente pensar que hace tan solo una década, para construir algo así se habrían necesitado importantes recursos patentados. Hoy en día, estos potentes componentes están disponibles gratuitamente y pueden ser combinados de forma innovadora por cualquiera que tenga la curiosidad de experimentar.</p>
<custom-h1>Visión general</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nuestra aplicación de búsqueda multimodal es del tipo <em>retrieve-and-rerank.</em> Si está familiarizado con <em>la recuperación-aumentada-generación</em> (RAG) es muy similar, sólo que la salida final es una lista de imágenes que fueron reranked por un gran modelo de lenguaje-visión (LLVM). La consulta de búsqueda del usuario contiene texto e imagen, y el objetivo es un conjunto de imágenes indexadas en una base de datos vectorial. La arquitectura consta de tres pasos: <em>indexación</em>, <em>recuperación</em> y <em>renumeración</em> (algo así como "generación"), que resumimos a continuación.</p>
<h2 id="Indexing" class="common-anchor-header">Indexación<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestra aplicación de búsqueda debe tener algo que buscar. En nuestro caso, utilizamos un pequeño subconjunto del conjunto de datos "Amazon Reviews 2023", que contiene texto e imágenes de opiniones de clientes de Amazon sobre todo tipo de productos. Se puede imaginar que una búsqueda semántica como la que estamos construyendo sería un complemento útil para un sitio web de comercio electrónico. Utilizamos 900 imágenes y descartamos el texto, aunque observamos que este cuaderno puede escalar a tamaño de producción con la base de datos y los despliegues de inferencia adecuados.</p>
<p>El primer elemento "mágico" de nuestro proceso es la elección del modelo de incrustación. Utilizamos un modelo multimodal desarrollado recientemente, llamado <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>, capaz de incrustar texto e imágenes conjuntamente, o por separado, en el mismo espacio con un único modelo en el que los puntos cercanos son semánticamente similares. Recientemente se han desarrollado otros modelos de este tipo, por ejemplo <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La figura anterior lo ilustra: la incrustación para [una imagen de un león de perfil] más el texto "vista frontal de esto", se aproxima a una incrustación para [una imagen de un león de frente] sin texto. Se utiliza el mismo modelo para entradas de texto e imagen y para entradas de sólo imagen (así como para entradas de sólo texto). <em>De este modo, el modelo es capaz de comprender la intención del usuario en cuanto a la relación entre el texto y la imagen consultados.</em></p>
<p>Incrustamos nuestras 900 imágenes de productos sin el texto correspondiente y almacenamos las incrustaciones en una base de datos vectorial utilizando <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Recuperación<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez creada la base de datos, podemos realizar una consulta al usuario. Imaginemos que un usuario viene con la consulta "una funda de teléfono con esto" más [una imagen de un Leopardo]. Es decir, busca fundas de teléfono con estampados de leopardo.</p>
<p>Nótese que el texto de la consulta del usuario decía "esto" en lugar de "la piel de un Leopardo". Nuestro modelo de incrustación debe ser capaz de conectar "esto" con aquello a lo que se refiere, lo cual es una hazaña impresionante dado que la iteración anterior de modelos no era capaz de manejar instrucciones tan abiertas. El <a href="https://arxiv.org/abs/2403.19651">artículo MagicLens</a> ofrece más ejemplos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Integramos el texto y la imagen de la consulta y realizamos una búsqueda de similitudes en nuestra base de datos vectorial. Los resultados se muestran en la figura anterior, junto con la imagen del leopardo. Parece que el primer resultado no es el más pertinente para la consulta. El séptimo resultado parece ser el más relevante: se trata de una funda de teléfono con un estampado de piel de leopardo.</p>
<h2 id="Generation" class="common-anchor-header">Generación<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Parece que nuestra búsqueda ha fallado en el sentido de que el resultado superior no es el más relevante. Sin embargo, podemos solucionarlo con un paso de reordenación. Es posible que esté familiarizado con el reordenamiento de los elementos recuperados, ya que es un paso importante en muchos procesos RAG. Utilizamos <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> como modelo de reordenación.</p>
<p>Primero pedimos a un LLVM que genere un pie de foto de la imagen consultada. El LLVM genera:</p>
<p><em>"La imagen muestra un primer plano de la cara de un leopardo, centrándose en su pelaje moteado y sus ojos verdes".</em></p>
<p>A continuación, introducimos este pie de foto, una sola imagen con los nueve resultados y la imagen de consulta, y construimos un mensaje de texto en el que se pide al modelo que vuelva a clasificar los resultados, dando la respuesta en forma de lista y justificando la elección de la mejor coincidencia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El resultado se visualiza en la figura anterior: el elemento más relevante es ahora el que más coincide, y la razón que se da es:</p>
<p><em>"El elemento más adecuado es el que tiene el tema del leopardo, que coincide con la instrucción de consulta del usuario para una funda de teléfono con un tema similar".</em></p>
<p>Nuestro re-ranker LLVM fue capaz de realizar la comprensión a través de imágenes y texto, y mejorar la relevancia de los resultados de búsqueda. <em>Un artefacto interesante es que el re-ranker sólo dio ocho resultados y ha descartado uno, lo que pone de relieve la necesidad de guardrails y salida estructurada.</em></p>
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
    </button></h2><p>En este post y en el vídeo (próximamente) y el <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">cuaderno</a> que lo acompañan, hemos construido una aplicación para la búsqueda semántica multimodal en texto e imágenes. El modelo de incrustación fue capaz de incrustar texto e imágenes conjunta o separadamente en el mismo espacio, y el modelo de fundamentación fue capaz de introducir texto e imagen mientras generaba texto como respuesta. <em>Y lo que es más importante, el modelo de incrustación fue capaz de relacionar la intención del usuario de una instrucción abierta con la imagen de la consulta y, de ese modo, especificar cómo quería el usuario que se relacionaran los resultados con la imagen introducida.</em></p>
<p>Esto es sólo una muestra de lo que nos espera en un futuro próximo. Veremos muchas aplicaciones de búsqueda multimodal, comprensión y razonamiento multimodal, etc. en diversas modalidades: imagen, vídeo, audio, moléculas, redes sociales, datos tabulares, series temporales, el potencial es ilimitado.</p>
<p>Y en el núcleo de estos sistemas se encuentra una base de datos vectorial que contiene la "memoria" externa del sistema. Milvus es una opción excelente para este fin. Es de código abierto, cuenta con todas las funciones (véase <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">este artículo sobre la búsqueda de texto completo en Milvus 2.5</a>) y se escala eficientemente a miles de millones de vectores con tráfico a escala web y latencia inferior a 100 ms. Obtenga más información en <a href="https://milvus.io/docs">la documentación de Milvus</a>, únase a nuestra comunidad de <a href="https://milvus.io/discord">Discord</a> y esperamos verle en nuestro próximo <a href="https://lu.ma/unstructured-data-meetup">encuentro sobre datos no estructurados</a>. Hasta entonces.</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Cuaderno de notas: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Búsqueda multimodal con Amazon Reviews y LLVM Reranking</a>"</p></li>
<li><p>Youtube AWS Developers video (próximamente)</p></li>
<li><p><a href="https://milvus.io/docs">Documentación de Milvus</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Reunión sobre datos no estructurados</a></p></li>
<li><p>Modelo de incrustación: <a href="https://huggingface.co/BAAI/bge-visualized">Tarjeta de modelo BGE visualizada</a></p></li>
<li><p>Modelo de incrustación alt: <a href="https://github.com/google-deepmind/magiclens">MagicLens model repo</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Tarjeta de modelo Phi-3 Vision</a></p></li>
<li><p>Ponencia: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: Recuperación autosupervisada de imágenes con instrucciones abiertas</a>"</p></li>
<li><p>Conjunto de datos: <a href="https://amazon-reviews-2023.github.io/">Reseñas de Amazon 2023</a></p></li>
</ul>
