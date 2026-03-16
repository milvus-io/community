---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  ¿Acabará Gemini Embedding 2 con la búsqueda multivectorial en bases de datos
  vectoriales?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  Gemini Embedding 2 de Google agrupa texto, imágenes, vídeo y audio en un solo
  vector. ¿Hará esto que la búsqueda multivectorial quede obsoleta? No, y he
  aquí por qué.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google ha lanzado <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a>, el primer modelo de incrustación multimodal que mapea texto, imágenes, vídeo, audio y documentos en un único espacio vectorial.</p>
<p>Puedes incrustar un videoclip, una foto de un producto y un párrafo de texto con una sola llamada a la API, y todos ellos aterrizarán en el mismo vecindario semántico.</p>
<p>Antes de utilizar modelos como éste, había que pasar cada modalidad por su propio modelo especializado y almacenar cada resultado en una columna vectorial independiente. Las columnas multivectoriales de las bases de datos vectoriales como <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> se crearon precisamente para este tipo de situaciones.</p>
<p>Con Gemini Embedding 2 mapeando múltiples modalidades al mismo tiempo, surge una pregunta: ¿qué parte de las columnas multivectoriales puede sustituir Gemini Embedding 2, y dónde se queda corto? En este artículo se explica en qué consiste cada enfoque y cómo funcionan juntos.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Diferencias entre Gemini Embedding 2 y CLIP/CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Los modelos de incrustación convierten los datos no estructurados en vectores densos, de modo que los elementos semánticamente similares se agrupan en el espacio vectorial. Lo que diferencia a Gemini Embedding 2 es que lo hace de forma nativa en todas las modalidades, sin modelos separados ni procesos de unión.</p>
<p>Hasta ahora, las incrustaciones multimodales implicaban modelos de doble codificador entrenados con aprendizaje contrastivo: <a href="https://openai.com/index/clip/">CLIP</a> para imagen-texto, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> para audio-texto, cada uno de los cuales maneja exactamente dos modalidades. Si se necesitaban las tres, había que ejecutar varios modelos y coordinar sus espacios de incrustación.</p>
<p>Por ejemplo, para indexar un podcast con carátula había que ejecutar CLIP para la imagen, CLAP para el audio y un codificador de texto para la transcripción: tres modelos, tres espacios vectoriales y una lógica de fusión personalizada para que sus puntuaciones fueran comparables en el momento de la consulta.</p>
<p>En cambio, según <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">el anuncio oficial de Google</a>, esto es lo que admite Gemini Embedding 2</p>
<ul>
<li><strong>Texto</strong>: hasta 8.192 tokens por solicitud.</li>
<li><strong>Imágenes</strong> hasta 6 por solicitud (PNG, JPEG)</li>
<li><strong>Vídeo</strong> de hasta 120 segundos (MP4, MOV)</li>
<li><strong>Audio</strong> de hasta 80 segundos, incrustado de forma nativa sin transcripción ASR</li>
<li>Entrada de<strong>documentos</strong> PDF, hasta 6 páginas</li>
</ul>
<p><strong>Entrada mixta</strong> de imagen + texto en una sola llamada de incrustación</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 frente a CLIP/CLAP Un modelo frente a muchos para incrustaciones multimodales</h3><table>
<thead>
<tr><th></th><th><strong>Codificador doble (CLIP, CLAP)</strong></th><th><strong>Incrustación Gemini 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalidades por modelo</strong></td><td>2 (por ejemplo, imagen + texto)</td><td>5 (texto, imagen, vídeo, audio, PDF)</td></tr>
<tr><td><strong>Añadir una nueva modalidad</strong></td><td>Trae otro modelo y alinea los espacios manualmente</td><td>Ya está incluido: una llamada a la API</td></tr>
<tr><td><strong>Entrada multimodal</strong></td><td>Codificadores separados, llamadas separadas</td><td>Entrada intercalada (por ejemplo, imagen + texto en una solicitud)</td></tr>
<tr><td><strong>Arquitectura</strong></td><td>Codificadores separados de visión y texto alineados mediante pérdida contrastiva</td><td>Modelo único que hereda la comprensión multimodal de Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Ventajas de Gemini Embedding 2: Simplificación del proceso<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomemos un escenario común: construir un motor de búsqueda semántica sobre una videoteca corta. Cada clip tiene fotogramas visuales, audio hablado y texto de subtítulos, todos ellos describiendo el mismo contenido.</p>
<p><strong>Antes de Gemini Embedding 2</strong>, se necesitaban tres modelos de incrustación distintos (imagen, audio y texto), tres columnas vectoriales y un proceso de recuperación que realizara la recuperación multidireccional, la fusión de resultados y la deduplicación. Son muchas piezas móviles que construir y mantener.</p>
<p><strong>Ahora</strong>, puedes introducir los fotogramas, el audio y los subtítulos del vídeo en una única llamada a la API y obtener un vector unificado que capture la imagen semántica completa.</p>
<p>Naturalmente, es tentador concluir que las columnas multivectoriales están muertas. Pero esa conclusión confunde "representación unificada multimodal" con "recuperación vectorial multidimensional". Resuelven problemas diferentes, y entender la diferencia es importante para elegir el enfoque adecuado.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">¿Qué es la búsqueda multivectorial en Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>En <a href="http://milvus.io">Milvus</a>, la búsqueda multivectorial significa buscar el mismo elemento a través de múltiples campos vectoriales a la vez y luego combinar esos resultados con reranking.</p>
<p>La idea central: un mismo objeto suele tener más de un tipo de significado. Un producto tiene un título <em>y una</em> descripción. Una publicación en las redes sociales tiene un pie de foto <em>y</em> una imagen. Cada ángulo dice algo diferente, así que cada uno tiene su propio campo vectorial.</p>
<p>Milvus busca en cada campo vectorial de forma independiente y, a continuación, fusiona los conjuntos candidatos mediante un reranker. En la API, cada solicitud corresponde a un campo y una configuración de búsqueda diferentes, y hybrid_search() devuelve el resultado combinado.</p>
<p>Dos patrones comunes dependen de esto:</p>
<ul>
<li><strong>Búsqueda vectorial dispersa+Densa.</strong> Usted tiene un catálogo de productos donde los usuarios escriben consultas como "Nike Air Max rojas talla 10". Los vectores densos captan la intención semántica ("zapatillas de correr, rojas, Nike"), pero no la talla exacta. Los vectores dispersos mediante <a href="https://milvus.io/docs/full-text-search.md">BM25</a> o modelos como <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> aciertan con la palabra clave. Es necesario que ambos funcionen en paralelo y se vuelvan a clasificar, porque ninguno de los dos por sí solo ofrece buenos resultados para consultas que combinan lenguaje natural con identificadores específicos como SKU, nombres de archivo o códigos de error.</li>
<li><strong>Búsqueda vectorial multimodal.</strong> Un usuario sube una foto de un vestido y escribe "algo así pero en azul". Usted busca simultáneamente la similitud visual en la columna de incrustación de imágenes y la restricción de color en la columna de incrustación de texto. Cada columna tiene su propio índice y modelo - <a href="https://openai.com/index/clip/">CLIP</a> para la imagen, un codificador de texto para la descripción - y los resultados se fusionan.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> ejecuta ambos modelos como <a href="https://milvus.io/docs/multi-vector-search.md">búsquedas ANN</a> paralelas con reranking nativo mediante RRFRanker. La definición del esquema, la configuración multiíndice y el BM25 integrado se gestionan en un solo sistema.</p>
<p>Por ejemplo, considere un catálogo de productos en el que cada artículo incluye una descripción de texto y una imagen. Puede realizar tres búsquedas en paralelo sobre estos datos:</p>
<ul>
<li><strong>Búsqueda semántica de texto.</strong> Consulta la descripción del texto con vectores densos generados por modelos como <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> o la API de incrustación de <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>.</li>
<li><strong>Búsqueda de texto completo.</strong> Consulta de la descripción del texto con vectores dispersos mediante <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> o modelos de incrustación dispersos como <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> o <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Búsqueda multimodal de imágenes.</strong> Consulta sobre imágenes de productos utilizando una consulta de texto, con vectores densos de un modelo como <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Con Gemini Embedding 2, ¿seguirá siendo importante la búsqueda multivectorial?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 gestiona más modalidades en una sola llamada, lo que simplifica considerablemente los procesos. Pero una incrustación multimodal unificada no es lo mismo que la recuperación multivectorial. En otras palabras, sí, la búsqueda multivectorial seguirá siendo importante.</p>
<p>Gemini Embedding 2 mapea texto, imágenes, vídeo, audio y documentos en un espacio vectorial compartido. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">lo posiciona</a> para la búsqueda semántica multimodal, la recuperación de documentos y la recomendación, escenarios en los que todas las modalidades describen el mismo contenido y el elevado solapamiento entre ellas hace viable un único vector.</p>
<p>La búsqueda multivectorial<a href="https://milvus.io/docs/multi-vector-search.md">de Milvus</a> resuelve un problema diferente. Es una forma de buscar el mismo objeto a través de <strong>múltiples campos vectoriales -por</strong>ejemplo, un título más una descripción, o un texto más una imagen- y luego combinar esas señales durante la recuperación. En otras palabras, se trata de preservar y consultar <strong>múltiples visiones semánticas</strong> del mismo elemento, no sólo de comprimirlo todo en una sola representación.</p>
<p>Pero los datos del mundo real rara vez encajan en una única incrustación. Los sistemas biométricos, la recuperación de herramientas agénticas y el comercio electrónico mixto dependen de vectores que viven en espacios semánticos completamente distintos. Ahí es exactamente donde una incrustación unificada deja de funcionar.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Por qué no basta con una incrustación: La recuperación multivectorial en la práctica</h3><p>Gemini Embedding 2 se ocupa del caso en que todas las modalidades describen lo mismo. La búsqueda multivectorial se ocupa de todo lo demás, y "todo lo demás" abarca la mayoría de los sistemas de recuperación en producción.</p>
<p><strong>Biometría.</strong> Un mismo usuario tiene vectores de cara, voz, huella dactilar e iris. Éstos describen características biológicas completamente independientes con cero solapamiento semántico. No se pueden agrupar en un vector: cada uno necesita su propia columna, índice y métrica de similitud.</p>
<p><strong>Herramientas genéticas.</strong> Un asistente de codificación como OpenClaw almacena vectores semánticos densos para el historial de conversaciones ("ese problema de despliegue de la semana pasada") junto con vectores BM25 dispersos para la coincidencia exacta de nombres de archivos, comandos CLI y parámetros de configuración. Diferentes objetivos de recuperación, diferentes tipos de vectores, rutas de búsqueda independientes y, a continuación, nueva clasificación.</p>
<p><strong>Comercio electrónico con intención mixta.</strong> El vídeo promocional y las imágenes detalladas de un producto funcionan bien como una incrustación Gemini unificada. Pero cuando un usuario quiere "vestidos parecidos a éste" <em>y</em> "mismo tejido, talla M", se necesita una columna de similitud visual y una columna de atributos estructurados con índices separados y una capa de recuperación híbrida.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Cuándo utilizar la incrustación Gemini 2 frente a columnas multivectoriales<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Escenario</strong></th><th><strong>Qué utilizar</strong></th><th><strong>Por qué</strong></th></tr>
</thead>
<tbody>
<tr><td>Todas las modalidades describen el mismo contenido (fotogramas de vídeo + audio + subtítulos)</td><td>Gemini Embedding 2 vector unificado</td><td>El elevado solapamiento semántico significa que un vector capta la imagen completa, sin necesidad de fusión.</td></tr>
<tr><td>Necesita precisión de palabras clave junto con recuperación semántica (BM25 + denso)</td><td>Columnas multivectoriales con hybrid_search()</td><td>Los vectores dispersos y densos sirven para diferentes objetivos de recuperación que no pueden concentrarse en una sola incrustación.</td></tr>
<tr><td>La búsqueda multimodal es el principal caso de uso (consulta de texto → resultados de imágenes)</td><td>Gemini Embedding 2 vector unificado</td><td>Un único espacio compartido hace que la similitud intermodal sea nativa</td></tr>
<tr><td>Los vectores viven en espacios semánticos fundamentalmente diferentes (biometría, atributos estructurados)</td><td>Columnas multivectoriales con índices por campo</td><td>Métricas de similitud y tipos de índices independientes por campo vectorial</td></tr>
<tr><td>Desea simplicidad de canalización <em>y</em> recuperación detallada</td><td>Ambos - vector Gemini unificado + columnas adicionales dispersas o de atributos en la misma colección</td><td>Gemini gestiona la columna multimodal; Milvus gestiona la capa de recuperación híbrida que la rodea.</td></tr>
</tbody>
</table>
<p>Estos dos enfoques no se excluyen mutuamente. Puede utilizar Gemini Embedding 2 para la columna multimodal unificada y seguir almacenando vectores adicionales dispersos o específicos de atributos en columnas separadas dentro de la misma colección <a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Inicio rápido: Configuración de Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Aquí tiene una demostración práctica. Necesita una <a href="https://milvus.io/docs/install-overview.md">instancia Milvus o Zilliz Cloud</a> en ejecución y una GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Configurar</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Ejemplo completo</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Para incrustaciones de imagen y audio, utilice embed_image() y embed_audio() de la misma manera - los vectores aterrizan en la misma colección y el mismo espacio vectorial, permitiendo una verdadera búsqueda cross-modal.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 estará pronto disponible en Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> ofrece una profunda integración con Gemini Embedding 2 a través de su <a href="https://milvus.io/docs/embeddings.md">función Embedding Function</a>. Una vez que esté disponible, no tendrá que llamar manualmente a las API de incrustación. Milvus invocará automáticamente el modelo (compatible con OpenAI, AWS Bedrock, Google Vertex AI, etc.) para vectorizar los datos sin procesar en la inserción y las consultas en la búsqueda.</p>
<p>Esto significa que obtendrá una incrustación multimodal unificada de Gemini cuando sea necesario, y todo el conjunto de herramientas multivectoriales de Milvus (búsqueda híbrida dispersa-densa, esquemas multiíndice, reordenación) cuando necesite un control detallado.</p>
<p>¿Quiere probarlo? Empieza con el <a href="https://milvus.io/docs/quickstart.md">inicio rápido de Milvus</a> y ejecuta la demo de arriba, o consulta la <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">guía de búsqueda híbrida</a> para la configuración multivectorial completa con BGE-M3. Trae tus preguntas a <a href="https://milvus.io/discord">Discord</a> o a <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus Office Hours</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Seguir leyendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Búsqueda híbrida multivectorial</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Documentación de la función de incrustación de Milvus</a></li>
</ul>
