---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Cree una cadena de ventas de bestsellers a imágenes para el comercio
  electrónico con Nano Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Tutorial paso a paso: utilice Nano Banana 2, Milvus hybrid search y Qwen 3.5
  para generar fotos de productos de comercio electrónico a partir de flat-lays
  a 1/3 del coste.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Si construyes herramientas de IA para vendedores de comercio electrónico, probablemente hayas escuchado esta petición miles de veces: "Tengo un nuevo producto. Dame una imagen promocional que parezca que pertenece a una lista de los más vendidos. Sin fotógrafo, sin estudio, y que sea barata".</p>
<p>Ese es el problema en una frase. Los vendedores tienen fotos planas y un catálogo de bestsellers que ya convierten. Quieren tender un puente entre ambos con IA, rápido y a escala.</p>
<p>Cuando Google lanzó Nano Banana 2 (Gemini 3.1 Flash Image) el 26 de febrero de 2026, lo probamos el mismo día y lo integramos en nuestra canalización de recuperación existente basada en Milvus. El resultado: el coste total de generación de imágenes se redujo a aproximadamente un tercio de lo que se gastaba antes, y el rendimiento se duplicó. La reducción del precio por imagen (aproximadamente un 50% más barato que Nano Banana Pro) explica parte de ello, pero el mayor ahorro se debe a la eliminación total de los ciclos de reprocesamiento.</p>
<p>En este artículo se explican los aciertos de Nano Banana 2 en el comercio electrónico, las deficiencias que aún persisten y se ofrece un tutorial práctico sobre el proceso completo: Búsqueda híbrida <strong>Milvus</strong> para encontrar bestsellers visualmente similares, <strong>Qwen</strong> 3.5 para el análisis de estilo y <strong>Nano Banana 2</strong> para la generación final.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Novedades de Nano Banana 2<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) se lanzó el 26 de febrero de 2026. Lleva la mayoría de las capacidades de Nano Banana Pro a la arquitectura Flash, lo que significa una generación más rápida a un precio más bajo. Estas son las principales mejoras:</p>
<ul>
<li><strong>Calidad de nivel profesional a velocidad Flash.</strong> Nano Banana 2 ofrece un conocimiento, un razonamiento y una fidelidad visual de primera clase que antes eran exclusivos de Pro, pero con la latencia y el rendimiento de Flash.</li>
<li><strong>Salida de 512px a 4K.</strong> Cuatro niveles de resolución (512px, 1K, 2K, 4K) con soporte nativo. El nivel de 512px es nuevo y exclusivo de Nano Banana 2.</li>
<li><strong>14 relaciones de aspecto.</strong> Añade 4:1, 1:4, 8:1 y 1:8 al conjunto existente (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Hasta 14 imágenes de referencia.</strong> Mantiene el parecido de hasta 5 caracteres y la fidelidad de hasta 14 objetos en un único flujo de trabajo.</li>
<li><strong>Renderizado de texto mejorado.</strong> Genera texto en imagen legible y preciso en varios idiomas, con soporte para traducción y localización en una única generación.</li>
<li><strong>Base de búsqueda de imágenes.</strong> Utiliza datos web en tiempo real e imágenes de Google Search para generar representaciones más precisas de temas del mundo real.</li>
<li><strong>~50% más barato por imagen.</strong> A 1K de resolución: 0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">067versusPro′s0</span></span></span></span></span></span></span></span></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,067 frente a Pro's</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134.</li>
</ul>
<p><strong>Un caso de uso divertido de Nano Banano 2: Generar un panorama basado en la localización a partir de una simple captura de pantalla de Google Maps</strong></p>
<p>Dada una captura de pantalla de Google Maps y una indicación de estilo, el modelo reconoce el contexto geográfico y genera un panorama que conserva las relaciones espaciales correctas. Resulta útil para producir creatividades publicitarias orientadas a una región (el telón de fondo de una cafetería parisina, un paisaje urbano de Tokio) sin necesidad de recurrir a fotografías de archivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para conocer el conjunto completo de funciones, consulta <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">el blog de anuncios de Google</a> y la <a href="https://ai.google.dev/gemini-api/docs/image-generation">documentación para desarrolladores</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">¿Qué significa esta actualización de Nano Banana para el comercio electrónico?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>El comercio electrónico es uno de los sectores que más imágenes utiliza. Listados de productos, anuncios en marketplaces, creatividades para redes sociales, campañas de banners, escaparates localizados: cada canal exige un flujo constante de activos visuales, cada uno con sus propias especificaciones.</p>
<p>Los requisitos básicos para la generación de imágenes con IA en el comercio electrónico se reducen a:</p>
<ul>
<li><strong>Mantener los costes bajos</strong>: el coste por imagen tiene que funcionar a escala de catálogo.</li>
<li><strong>Coincidir con el aspecto de los productos más vendidos</strong>: las nuevas imágenes deben estar en consonancia con el estilo visual de los anuncios que ya tienen éxito.</li>
<li><strong>Evitar las infracciones</strong>: no copiar las imágenes de la competencia ni reutilizar activos protegidos.</li>
</ul>
<p>Además, los vendedores transfronterizos necesitan:</p>
<ul>
<li><strong>Compatibilidad con formatos multiplataforma</strong>: diferentes relaciones de aspecto y especificaciones para mercados, anuncios y escaparates.</li>
<li><strong>Renderizado de texto multilingüe</strong>: texto en imagen limpio y preciso en varios idiomas.</li>
</ul>
<p>Nano Banana 2 está cerca de marcar todas las casillas. Las secciones siguientes desglosan lo que significa cada mejora en la práctica: dónde resuelve directamente un punto débil del comercio electrónico, dónde se queda corto y cuál es el impacto real en los costes.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Reducción de hasta un 60% de los costes de producción</h3><p>Con una resolución de 1K, Nano Banana 2 cuesta 0 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">067perimageversusPro′s0</span></span></span></span></span></span></span></span></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,067 por imagen frente a los</annotation></semantics></math></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord"></span><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"> </span></span></span></span></span></span></span></span></span><span class="mord mathnormal">′s0</span></span></span></span>,134, lo que supone una reducción directa del 50%. Pero el precio por imagen es sólo la mitad de la historia. Lo que solía acabar con los presupuestos de los usuarios era el retrabajo. Cada mercado impone sus propias especificaciones de imagen (1:1 para Amazon, 3:4 para los escaparates de Shopify, ultrawide para los anuncios de banner), y producir cada variante significaba una pasada de generación separada con sus propios modos de fallo.</p>
<p>Nano Banana 2 reduce esos pasos adicionales a uno solo.</p>
<ul>
<li><p><strong>Cuatro niveles de resolución nativa.</strong></p></li>
<li><p>512px (0,045 $)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>El nivel de 512px es nuevo y exclusivo de Nano Banana 2. Ahora los usuarios pueden generar borradores de 512px de bajo coste para su iteración y generar el activo final a 2K o 4K sin necesidad de un paso de escalado adicional.</p>
<ul>
<li><p><strong>14 relaciones de aspecto soportadas</strong> en total. He aquí algunos ejemplos:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Estas nuevas proporciones ultraanchas y ultraaltas se unen al conjunto ya existente. Una sesión de generación puede producir varios formatos como: <strong>Imagen principal de Amazon</strong> (1:1), <strong>Héroe de escaparate</strong> (3:4) y <strong>Banner publicitario</strong> (ultra-ancho u otras proporciones).</p>
<p>Para estas 4 proporciones no es necesario recortar, ni rellenar, ni volver a preguntar. Las 10 relaciones de aspecto restantes se incluyen en el conjunto completo, lo que hace que el proceso sea más flexible en las distintas plataformas.</p>
<p>Sólo el ahorro de un 50% por imagen reduciría la factura a la mitad. La eliminación de la repetición del trabajo en todas las resoluciones y relaciones de aspecto es lo que ha reducido el coste total a aproximadamente un tercio de lo que se gastaba antes.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Soporte de hasta 14 imágenes de referencia con estilo Bestseller</h3><p>De todas las actualizaciones de Nano Banana 2, la mezcla multirreferencia es la que más ha afectado a nuestro proceso Milvus. Nano Banana 2 acepta hasta 14 imágenes de referencia en una sola solicitud, manteniendo:</p>
<ul>
<li>Semejanza de caracteres para un máximo de <strong>5 caracteres</strong></li>
<li>Fidelidad a los <strong>objetos para un máximo de 14 objetos</strong></li>
</ul>
<p>En la práctica, recuperamos varias imágenes de superventas de Milvus, las pasamos como referencias y la imagen generada heredó su composición de escena, iluminación, pose y colocación de accesorios. No fue necesario recurrir a la ingeniería para reconstruir a mano esos patrones.</p>
<p>Los modelos anteriores sólo admitían una o dos referencias, lo que obligaba a los usuarios a elegir un único éxito de ventas para imitarlo. Con 14 ranuras de referencia, podíamos combinar las características de varios de los listados con mejores resultados y dejar que el modelo sintetizara un estilo compuesto. Esta es la capacidad que hace posible el proceso basado en la recuperación que se describe en el tutorial siguiente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Produzca imágenes de primera calidad listas para el mercado sin los costes de producción ni la logística tradicionales</h3><p>Para obtener una generación de imágenes coherente y fiable, evite volcar todos sus requisitos en una única solicitud. Un enfoque más fiable es trabajar por etapas: generar primero el fondo, luego el modelo por separado y, por último, componerlos juntos.</p>
<p>Hemos probado la generación de fondos en los tres modelos de Nano Banana con la misma imagen: un horizonte de Shanghái ultrapanorámico 4:1 en un día lluvioso visto a través de una ventana, con la Torre de la Perla Oriental visible. Esta imagen pone a prueba la composición, el detalle arquitectónico y el fotorrealismo en una sola pasada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Nano Banana original vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>Nano Banana original.</strong> Textura de lluvia natural con una distribución de gotas creíble, pero detalles de los edificios demasiado suavizados. La Torre de la Perla Oriental apenas era reconocible y la resolución no cumplía los requisitos de producción.</li>
<li><strong>Nano Banana Pro.</strong> Atmósfera cinematográfica: la cálida iluminación interior contrastaba con la fría lluvia de forma convincente. Sin embargo, se omitió por completo el marco de la ventana, aplanando la sensación de profundidad de la imagen. Utilizable como imagen de apoyo, no como protagonista.</li>
<li><strong>Nano Banana 2.</strong> Renderizada la escena completa. El marco de la ventana en primer plano creaba profundidad. La Torre de la Perla Oriental aparece claramente detallada. Aparecen barcos en el río Huangpu. La iluminación por capas distinguía la calidez interior del cielo nublado exterior. Las texturas de la lluvia y las manchas de agua eran casi fotográficas, y la relación 4:1 ultrawide mantenía la perspectiva correcta con sólo una pequeña distorsión en el borde izquierdo de la ventana.</li>
</ul>
<p>Para la mayoría de las tareas de generación de fondos en la fotografía de productos, la Nano Banana 2 se puede utilizar sin necesidad de postprocesado.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Renderizado limpio de texto en imagen en todos los idiomas</h3><p>Etiquetas de precios, banners promocionales y textos multilingües son inevitables en las imágenes de comercio electrónico, e históricamente han sido un punto de ruptura para la generación de IA. Nano Banana 2 los maneja significativamente mejor, soportando el renderizado de texto en la imagen a través de múltiples idiomas con traducción y localización en una sola generación.</p>
<p><strong>Renderizado de texto estándar.</strong> En nuestras pruebas, la salida de texto no contenía errores en ninguno de los formatos de comercio electrónico que probamos: etiquetas de precios, breves eslóganes de marketing y descripciones bilingües de productos.</p>
<p><strong>Continuación de la escritura a mano.</strong> Dado que el comercio electrónico requiere a menudo elementos escritos a mano, como etiquetas de precios y tarjetas personalizadas, probamos si los modelos podían igualar un estilo manuscrito existente y ampliarlo; en concreto, igualar una lista de tareas manuscrita y añadir 5 nuevos elementos con el mismo estilo. Resultados de los tres modelos:</p>
<ul>
<li><strong>Nano Banana original.</strong> Números de secuencia repetidos, estructura mal entendida.</li>
<li><strong>Nano Banana Pro.</strong> Estructura correcta, pero mala reproducción del estilo de letra.</li>
<li><strong>Nano Banana 2.</strong> Sin errores. El grosor de los trazos y el estilo de las letras coinciden lo suficiente como para no distinguirse de la fuente.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Sin embargo,</strong> la propia documentación de Google señala que Nano Banana 2 "aún puede tener problemas con la ortografía precisa y los detalles finos en las imágenes". Nuestros resultados fueron limpios en todos los formatos que probamos, pero cualquier flujo de trabajo de producción debería incluir un paso de verificación del texto antes de publicarlo.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Tutorial paso a paso: Construir una cadena de superventas a imágenes con Milvus, Qwen 3.5 y Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Antes de empezar: Arquitectura y configuración del modelo</h3><p>Para evitar la aleatoriedad de la generación de una sola promesa, dividimos el proceso en tres etapas controlables: recuperar lo que ya funciona con la búsqueda híbrida <strong>Milvus</strong>, analizar por qué funciona con <strong>Qwen 3.5</strong> y, a continuación, generar la imagen final con esas restricciones incorporadas con <strong>Nano Banana 2</strong>.</p>
<p>Una breve introducción a cada herramienta si no has trabajado con ellas antes:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> la base de datos vectorial de código abierto más adoptada. Almacena tu catálogo de productos como vectores y ejecuta búsquedas híbridas (filtros densos + dispersos + escalares) para encontrar las imágenes más vendidas y similares a un nuevo producto.</li>
<li><strong>Qwen 3.5</strong>: un popular LLM multimodal. Toma las imágenes recuperadas de los bestsellers y extrae los patrones visuales que hay detrás de ellas (disposición de la escena, iluminación, pose, estado de ánimo) en un mensaje de estilo estructurado.</li>
<li><strong>Nano Banana 2</strong>: modelo de generación de imágenes de Google (Gemini 3.1 Flash Image). Toma tres datos de entrada: la composición plana del nuevo producto, una referencia de un bestseller y la solicitud de estilo de Qwen 3.5. Produce la foto promocional final.</li>
</ul>
<p>La lógica que subyace a esta arquitectura parte de una observación: el activo visual más valioso de cualquier catálogo de comercio electrónico es la biblioteca de imágenes de bestsellers que ya se han convertido. Las poses, las composiciones y la iluminación de esas fotos se han perfeccionado a través del gasto publicitario real. Recuperar esos patrones directamente es mucho más rápido que aplicarles ingeniería inversa mediante la escritura de avisos, y ese paso de recuperación es exactamente lo que gestiona una base de datos vectorial.</p>
<p>Este es el flujo completo. Llamamos a cada modelo a través de la API de OpenRouter, por lo que no hay necesidad de una GPU local ni de descargar los pesos de los modelos.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Nos apoyamos en tres capacidades de Milvus para hacer funcionar la etapa de recuperación:</p>
<ol>
<li><strong>Búsqueda híbrida densa + dispersa.</strong> Ejecutamos incrustaciones de imágenes y vectores TF-IDF de texto como consultas paralelas y, a continuación, fusionamos los dos conjuntos de resultados con RRF (Reciprocal Rank Fusion).</li>
<li><strong>Filtrado por campos escalares.</strong> Filtramos por campos de metadatos como categoría y recuento_ventas antes de la comparación vectorial, para que los resultados sólo incluyan productos relevantes y de alto rendimiento.</li>
<li><strong>Esquema de campos múltiples.</strong> Almacenamos vectores densos, vectores dispersos y metadatos escalares en una única colección Milvus, lo que mantiene toda la lógica de recuperación en una sola consulta en lugar de dispersa en varios sistemas.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Preparación de datos</h3><p><strong>Catálogo histórico de productos</strong></p>
<p>Comenzamos con dos activos: una carpeta images/ de fotos de productos existentes y un archivo products.csv que contiene sus metadatos.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Datos de nuevos productos</strong></p>
<p>Para los productos de los que queremos generar imágenes promocionales, preparamos una estructura paralela: una carpeta new_products/ y new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Paso 1: Instalar dependencias</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Paso 2: Importar módulos y configuraciones</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurar todos los modelos y rutas:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Funciones de ayuda</strong></p>
<p>Estas funciones de ayuda se encargan de la codificación de imágenes, las llamadas a la API y el análisis sintáctico de las respuestas:</p>
<ul>
<li>image_to_uri(): Convierte una imagen PIL en un URI de datos base64 para el transporte de la API.</li>
<li>get_image_embeddings(): Codifica por lotes imágenes en vectores de 2048 dimensiones a través de la API de incrustación de OpenRouter.</li>
<li>get_text_embedding(): Codifica texto en el mismo espacio vectorial de 2048 dimensiones.</li>
<li>sparse_to_dict(): Convierte una fila de matriz dispersa scipy en el formato {index: value} que Milvus espera para vectores dispersos.</li>
<li>extract_images(): Extrae las imágenes generadas de la respuesta de la API de Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Paso 3: Cargar el catálogo de productos</h3><p>Lee products.csv y carga las imágenes de producto correspondientes:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Ejemplo de salida:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Paso 4: Generar incrustaciones</h3><p>La búsqueda híbrida requiere dos tipos de vectores para cada producto.</p>
<p><strong>4.1 Vectores densos: incrustación de imágenes</strong></p>
<p>El modelo nvidia/llama-nemotron-embed-vl-1b-v2 codifica la imagen de cada producto en un vector denso de 2048 dimensiones. Dado que este modelo admite entradas tanto de imágenes como de texto en un espacio vectorial compartido, las mismas incrustaciones funcionan para la recuperación de imagen a imagen y de texto a imagen.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4,2 Vectores dispersos: Incrustación de texto TF-IDF</strong></p>
<p>Las descripciones de texto de los productos se codifican en vectores dispersos mediante el vectorizador TF-IDF de scikit-learn. Estos vectores capturan las coincidencias a nivel de palabra clave que los vectores densos pueden pasar por alto.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>¿Por qué ambos tipos de vectores?</strong> Los vectores densos y dispersos se complementan. Los vectores densos captan la similitud visual: paleta de colores, silueta de la prenda, estilo general. Los vectores dispersos captan la semántica de las palabras clave: términos como "floral", "midi" o "gasa" que indican atributos del producto. La combinación de ambos produce una calidad de recuperación significativamente mejor que cualquiera de los dos enfoques por separado.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Paso 5: Crear una colección Milvus con un esquema híbrido</h3><p>Este paso crea una única colección Milvus que almacena vectores densos, vectores dispersos y campos de metadatos escalares juntos. Este esquema unificado es lo que permite la búsqueda híbrida en una única consulta.</p>
<table>
<thead>
<tr><th><strong>Campo</strong></th><th><strong>Tipo</strong></th><th><strong>Finalidad</strong></th></tr>
</thead>
<tbody>
<tr><td>vector_denso</td><td>FLOAT_VECTOR (2048d)</td><td>Incrustación de imagen, similitud COSINE</td></tr>
<tr><td>vector_esparcido</td><td>SPARSE_FLOAT_VECTOR</td><td>Vector disperso TF-IDF, producto interno</td></tr>
<tr><td>categoría</td><td>VARCHAR</td><td>Etiqueta de categoría para filtrado</td></tr>
<tr><td>recuento_de_ventas</td><td>INT64</td><td>Volumen histórico de ventas para filtrar</td></tr>
<tr><td>color, estilo, temporada</td><td>VARCHAR</td><td>Etiquetas de metadatos adicionales</td></tr>
<tr><td>precio</td><td>FLOAT</td><td>Precio del producto</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Inserta los datos del producto:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Paso 6: Búsqueda híbrida para encontrar superventas similares</h3><p>Este es el paso central de la recuperación. Para cada nuevo producto, el proceso ejecuta tres operaciones simultáneamente:</p>
<ol>
<li><strong>Búsqueda densa</strong>: encuentra productos con imágenes visualmente similares.</li>
<li><strong>Búsqueda dispersa</strong>: busca productos con palabras clave de texto coincidentes mediante TF-IDF.</li>
<li><strong>Filtrado escalar</strong>: restringe los resultados a la misma categoría y a productos con sales_count &gt; 1500.</li>
<li><strong>RRF reranking</strong>: fusiona las listas de resultados densas y dispersas mediante Reciprocal Rank Fusion.</li>
</ol>
<p>Carga el nuevo producto:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Salida:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Codifica el nuevo producto:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Salida:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ejecutar búsqueda híbrida</strong></p>
<p>Las llamadas clave de la API aquí:</p>
<ul>
<li>AnnSearchRequest crea solicitudes de búsqueda separadas para los campos vectoriales densos y dispersos.</li>
<li>expr=filter_expr aplica el filtrado escalar dentro de cada solicitud de búsqueda.</li>
<li>RRFRanker(k=60) fusiona las dos listas de resultados utilizando el algoritmo Reciprocal Rank Fusion.</li>
<li>hybrid_search ejecuta ambas peticiones y devuelve los resultados fusionados y reordenados.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Salida: los 3 bestsellers más similares, ordenados por puntuación fusionada.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Paso 7: Analizar el estilo de los bestsellers con Qwen 3.5</h3><p>Introducimos las imágenes recuperadas en Qwen 3.5 y le pedimos que extraiga su ADN visual común: composición de la escena, iluminación, pose de la modelo y estado de ánimo general. A partir de este análisis, obtenemos una única generación de imágenes lista para enviar a Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Ejemplo de resultado:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Paso 8: Generación de la imagen promocional con Nano Banana 2</h3><p>Introducimos tres datos en Nano Banana 2: la foto plana del nuevo producto, la imagen del bestseller mejor clasificado y el mensaje de estilo que extrajimos en el paso anterior. El modelo los compone en una foto promocional que combina la nueva prenda con un estilo visual probado.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parámetros clave de la llamada a la API de Nano Banana 2:</p>
<ul>
<li>modalidades: [&quot;text&quot;, &quot;image&quot;]: declara que la respuesta debe incluir una imagen.</li>
<li>image_config.aspect_ratio: controla la relación de aspecto de salida (3:4 funciona bien para retratos/moda).</li>
<li>image_config.image_size: establece la resolución. Nano Banana 2 soporta desde 512px hasta 4K.</li>
</ul>
<p>Extrae la imagen generada:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Salida:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Paso 9: Comparación lado a lado</h3><p>El resultado da en el clavo: la iluminación es suave y uniforme, la pose de la modelo parece natural y el ambiente coincide con la referencia del bestseller.</p>
<p>En lo que falla es en la mezcla de prendas. El cárdigan parece pegado a la modelo en lugar de llevado, y la etiqueta blanca del escote se transparenta. La generación de una sola pasada tiene dificultades con este tipo de integración detallada de la ropa en el cuerpo, por lo que en el resumen se explican las soluciones.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Paso 10. Generación de lotes para todos los productos nuevos Generación de lotes para todos los productos nuevos</h3><p>Envolvemos todo el proceso en una única función y la ejecutamos en el resto de nuevos productos. El código del lote se omite aquí por brevedad; póngase en contacto con nosotros si necesita la implementación completa.</p>
<p>Dos cosas destacan en los resultados por lotes. Las indicaciones de estilo que recibimos de <strong>Qwen 3.5</strong> se ajustan significativamente a cada producto: un vestido de verano y un jersey de invierno reciben descripciones de escena realmente diferentes adaptadas a la estación, el caso de uso y los accesorios. Las imágenes que obtenemos de <strong>Nano Banana 2</strong>, a su vez, están a la altura de la fotografía de estudio real en cuanto a iluminación, textura y composición.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>En este artículo, hemos tratado lo que Nano Banana 2 aporta a la generación de imágenes de comercio electrónico, lo hemos comparado con el Nano Banana original y el Pro en tareas de producción reales, y hemos explicado cómo crear una cadena de producción de bestsellers a imágenes con Milvus, Qwen 3.5 y Nano Banana 2. Esta cadena de producción tiene cuatro ventajas prácticas.</p>
<p>Este pipeline tiene cuatro ventajas prácticas:</p>
<ul>
<li><strong>Coste controlado, presupuestos predecibles.</strong> El modelo de incrustación (Llama Nemotron Embed VL 1B v2) es gratuito en OpenRouter. Nano Banana 2 cuesta aproximadamente la mitad por imagen que Pro, y la salida multiformato nativa elimina los ciclos de retoque que solían duplicar o triplicar la factura efectiva. Para los equipos de comercio electrónico que gestionan miles de referencias por temporada, esta previsibilidad significa que la producción de imágenes se adapta al catálogo en lugar de desbordar el presupuesto.</li>
<li><strong>Automatización de principio a fin, tiempo de publicación más rápido.</strong> El flujo desde la foto plana del producto hasta la imagen promocional acabada se realiza sin intervención manual. Un nuevo producto puede pasar de la foto de almacén a la imagen de anuncio lista para el mercado en cuestión de minutos en lugar de días, lo que es más importante durante las temporadas altas, cuando la rotación del catálogo es mayor.</li>
<li><strong>No requiere GPU local, menor barrera de entrada.</strong> Todos los modelos se ejecutan a través de la API OpenRouter. Un equipo sin infraestructura de ML ni personal de ingeniería dedicado puede ejecutar este proceso desde un portátil. No hay nada que aprovisionar, nada que mantener ni ninguna inversión inicial en hardware.</li>
<li><strong>Mayor precisión de recuperación, mayor coherencia de marca.</strong> Milvus combina el filtrado denso, disperso y escalar en una sola consulta, superando sistemáticamente los enfoques de un solo vector para la correspondencia de productos. En la práctica, esto significa que las imágenes generadas heredan de forma más fiable el lenguaje visual establecido de su marca: la iluminación, la composición y el estilo que sus bestsellers existentes ya han demostrado que convierten. El resultado se ve como si perteneciera a su tienda, no como arte genérico de archivo de IA.</li>
</ul>
<p>También hay limitaciones sobre las que vale la pena ser franco:</p>
<ul>
<li><strong>Mezcla de ropa y cuerpo.</strong> La generación de una sola pasada puede hacer que la ropa parezca compuesta en lugar de desgastada. Los detalles finos, como los accesorios pequeños, a veces se difuminan. Solución: generar por etapas (primero el fondo, luego la pose del modelo y después la composición). Este enfoque multipase da a cada paso un alcance más estrecho y mejora significativamente la calidad de la mezcla.</li>
<li><strong>Fidelidad de detalle en casos extremos.</strong> Los accesorios, los patrones y los diseños con mucho texto pueden perder nitidez. Solución: añada restricciones explícitas a la solicitud de generación ("la ropa se ajusta de forma natural al cuerpo, sin etiquetas expuestas, sin elementos adicionales, los detalles del producto son nítidos"). Si la calidad sigue siendo baja en un producto concreto, cambie a Nano Banana Pro para la versión final.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> es la base de datos vectorial de código abierto que alimenta el paso de búsqueda híbrida, y si quieres echar un vistazo o probar a intercambiar tus propias fotos de producto, el<a href="https://milvus.io/docs">inicio rápido de</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> te llevará unos diez minutos. Tenemos una comunidad muy activa en <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> y Slack, y nos encantaría ver lo que la gente construye con esto. Y si acabas comparando Nano Banana 2 con un producto vertical diferente o con un catálogo mayor, ¡comparte los resultados! Nos encantaría conocerlos.</p>
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: Convertir el bombo publicitario en un RAG multimodal preparado para la empresa</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de IA de código abierto</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial de OpenClaw: Conéctese a Slack para obtener un asistente de IA local</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código abierto (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memoria persistente para código Claude: memsearch ccplugin</a></li>
</ul>
