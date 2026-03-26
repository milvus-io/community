---
id: choose-embedding-model-rag-2026.md
title: >-
  Cómo elegir el mejor modelo de incrustación para la GAR en 2026: 10 modelos
  comparados
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Hemos evaluado 10 modelos de incrustación en tareas de compresión multimodal,
  multilingüe, de documentos largos y de dimensiones. Averigüe cuál se adapta
  mejor a sus necesidades.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> Probamos 10 <a href="https://zilliz.com/ai-models">modelos de incrustación</a> en cuatro escenarios de producción que los parámetros públicos pasan por alto: recuperación multimodal, recuperación multilingüe, recuperación de información clave y compresión dimensional. Ningún modelo lo gana todo. Gemini Embedding 2 es el mejor de todos. Qwen3-VL-2B, de código abierto, supera a las API de código cerrado en tareas intermodales. Si necesita comprimir dimensiones para ahorrar almacenamiento, opte por Voyage Multimodal 3.5 o Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Por qué MTEB no es suficiente para elegir un modelo de incrustación<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>La mayoría de los prototipos <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> empiezan con text-embedding-3-small de OpenAI. Es barato, fácil de integrar y para la recuperación de texto en inglés funciona bastante bien. Pero el RAG de producción lo supera rápidamente. Su canal de producción recoge imágenes, PDF, documentos multilingües... y un <a href="https://zilliz.com/ai-models">modelo de incrustación de</a> sólo texto deja de ser suficiente.</p>
<p>La <a href="https://huggingface.co/spaces/mteb/leaderboard">tabla de clasificación de MTEB</a> te dice que hay mejores opciones. ¿Cuál es el problema? MTEB sólo prueba la recuperación de texto en un único idioma. No cubre la recuperación multimodal (consultas de texto contra colecciones de imágenes), la búsqueda multilingüe (una consulta en chino que encuentra un documento en inglés), la precisión de documentos largos o cuánta calidad se pierde al truncar <a href="https://zilliz.com/glossary/dimension">las dimensiones de incrustación</a> para ahorrar almacenamiento en la <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a>.</p>
<p>¿Qué modelo de incrustación debe utilizar? Depende de los tipos de datos, los idiomas, la longitud de los documentos y de si es necesario comprimir las dimensiones. Hemos creado un modelo de referencia llamado <strong>CCKM</strong> y hemos probado 10 modelos lanzados entre 2025 y 2026 en exactamente esas dimensiones.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">¿Qué es la prueba CCKM?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) pone a prueba cuatro capacidades que los puntos de referencia estándar pasan por alto:</p>
<table>
<thead>
<tr><th>Dimensión</th><th>Qué pone a prueba</th><th>Por qué es importante</th></tr>
</thead>
<tbody>
<tr><td><strong>Recuperación intermodal</strong></td><td>Emparejar descripciones de texto con la imagen correcta cuando hay distractores casi idénticos.</td><td>Los algoritmos<a href="https://zilliz.com/learn/multimodal-rag">RAG multimodales</a> necesitan incrustaciones de texto e imagen en el mismo espacio vectorial.</td></tr>
<tr><td><strong>Recuperación multilingüe</strong></td><td>Encontrar el documento correcto en inglés a partir de una consulta en chino, y viceversa.</td><td>Las bases de conocimientos suelen ser multilingües</td></tr>
<tr><td><strong>Recuperación de información clave</strong></td><td>Localizar un dato concreto en un documento de 4.000-32.000 caracteres (una aguja en un pajar).</td><td>Los sistemas RAG suelen procesar documentos largos, como contratos y trabajos de investigación.</td></tr>
<tr><td><strong>Compresión dimensional MRL</strong></td><td>Mide cuánta calidad pierde el modelo al truncar las incrustaciones a 256 dimensiones</td><td>Menos dimensiones = menor coste de almacenamiento en su base de datos vectorial, pero ¿a qué coste de calidad?</td></tr>
</tbody>
</table>
<p>MTEB no cubre ninguno de estos aspectos. MMEB añade multimodal pero omite los negativos duros, por lo que los modelos obtienen una puntuación alta sin demostrar que manejan distinciones sutiles. CCKM está diseñado para cubrir lo que no cubren.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">¿Qué modelos de incrustación hemos probado? Gemini Embedding 2, Jina Embeddings v4 y otros.<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos probado 10 modelos que abarcan tanto servicios de API como opciones de código abierto, además de CLIP ViT-L-14 como referencia de 2021.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Fuente</th><th>Parámetros</th><th>Dimensiones</th><th>Modalidad</th><th>Rasgo clave</th></tr>
</thead>
<tbody>
<tr><td>Incrustación Gemini 2</td><td>Google</td><td>No revelado</td><td>3072</td><td>Texto / imagen / vídeo / audio / PDF</td><td>Todas las modalidades, máxima cobertura</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Texto / imagen / PDF</td><td>Adaptadores MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Sin desvelar</td><td>1024</td><td>Texto / imagen / vídeo</td><td>Equilibrado entre tareas</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Texto / imagen / vídeo</td><td>Código abierto, multimodal ligero</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Texto / imagen</td><td>Arquitectura CLIP modernizada</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>No revelado</td><td>Fijo</td><td>Texto</td><td>Recuperación empresarial</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>No revelado</td><td>3072</td><td>Texto</td><td>Más utilizados</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Texto</td><td>Código abierto, más de 100 idiomas</td></tr>
<tr><td>mxbai-embed-large</td><td>Mixedbread AI</td><td>335M</td><td>1024</td><td>Texto</td><td>Ligero, centrado en el inglés</td></tr>
<tr><td>nomic-embed-text</td><td>Nomic AI</td><td>137M</td><td>768</td><td>Texto</td><td>Ultraligero</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Texto / imagen</td><td>Línea de base</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Recuperación multimodal: ¿Qué modelos gestionan la búsqueda de texto a imagen?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Si su canal de RAG maneja imágenes junto con texto, el modelo de incrustación debe colocar ambas modalidades en el mismo <a href="https://zilliz.com/glossary/vector-embeddings">espacio vectorial</a>. Piense en la búsqueda de imágenes en el comercio electrónico, en bases de conocimiento mixtas de texto e imagen o en cualquier sistema en el que una consulta de texto necesite encontrar la imagen correcta.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Tomamos 200 pares imagen-texto de COCO val2017. Para cada imagen, GPT-4o-mini generó una descripción detallada. A continuación, escribimos 3 hard negatives por imagen, es decir, descripciones que difieren de la correcta en uno o dos detalles. El modelo tiene que encontrar la coincidencia correcta en un conjunto de 200 imágenes y 600 distractores.</p>
<p>Un ejemplo del conjunto de datos:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Maletas antiguas de cuero marrón con pegatinas de viajes que incluyen California y Cuba, colocadas en un portaequipajes metálico sobre un cielo azul; se utiliza como imagen de prueba en la prueba de recuperación cross-modal.</span> </span></p>
<blockquote>
<p><strong>Descripción correcta:</strong> "La imagen muestra maletas vintage de cuero marrón con varias pegatinas de viaje, entre ellas "California", "Cuba" y "Nueva York", colocadas en un portaequipajes metálico contra un cielo azul despejado."</p>
<p><strong>Duro negativo:</strong> La misma frase, pero "California" se convierte en "Florida" y "cielo azul" en "cielo nublado". El modelo tiene que entender realmente los detalles de la imagen para distinguirlos.</p>
</blockquote>
<p><strong>Puntuación:</strong></p>
<ul>
<li>Generar <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones</a> para todas las imágenes y todos los textos (200 descripciones correctas + 600 negativas duras).</li>
<li><strong>Texto a imagen (t2i):</strong> Cada descripción busca la coincidencia más cercana en 200 imágenes. Se puntúa si el primer resultado es correcto.</li>
<li><strong>Imagen a texto (i2t):</strong> Cada imagen busca la coincidencia más cercana en los 800 textos. Sólo se puntúa si el primer resultado es la descripción correcta y no un resultado negativo.</li>
<li><strong>Puntuación final:</strong> hard_avg_R@1 = (precisión t2i + precisión i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Gráfico de barras horizontales que muestra la clasificación de recuperación multimodal: Qwen3-VL-2B lidera con 0,945, seguido de Gemini Embed 2 con 0,928, Voyage MM-3.5 con 0,900, Jina CLIP v2 con 0,873 y CLIP ViT-L-14 con 0,768</span> </span>.</p>
<p>Qwen3-VL-2B, un modelo de parámetros 2B de código abierto del equipo Qwen de Alibaba, quedó en primer lugar, por delante de todas las API de código cerrado.</p>
<p>La diferencia<strong>de modalidad</strong> explica la mayor parte de la diferencia. Los modelos de incrustación mapean texto e imágenes en el mismo espacio vectorial, pero en la práctica las dos modalidades tienden a agruparse en regiones diferentes. La brecha de modalidad mide la distancia L2 entre esos dos grupos. Una diferencia menor facilita la recuperación intermodal.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualización comparativa entre una brecha de modalidad grande (0,73, los clusters de texto e imagen están muy separados) y una brecha de modalidad pequeña (0,25, los clusters se solapan): una brecha menor facilita la comparación entre modalidades.</span> </span></p>
<table>
<thead>
<tr><th>Modelo</th><th>Puntuación (R@1)</th><th>Brecha entre modalidades</th><th>Parámetros</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (código abierto)</td></tr>
<tr><td>Incrustación Gemini 2</td><td>0.928</td><td>0.73</td><td>Desconocido (cerrado)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Desconocido (cerrado)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>La diferencia de modalidad de Qwen es de 0,25, aproximadamente un tercio de la de Gemini (0,73). En una <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a> como <a href="https://milvus.io/">Milvus</a>, una brecha de modalidad pequeña significa que puede almacenar incrustaciones de texto e imágenes en la misma <a href="https://milvus.io/docs/manage-collections.md">colección</a> y <a href="https://milvus.io/docs/single-vector-search.md">buscar</a> en ambas directamente. Una brecha grande puede hacer que la <a href="https://zilliz.com/glossary/similarity-search">búsqueda de similitud</a> entre modalidades sea menos fiable, y puede que necesite un paso de reordenación para compensar.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Recuperación multilingüe: ¿Qué modelos alinean el significado entre idiomas?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de conocimiento multilingües son habituales en la producción. Un usuario hace una pregunta en chino, pero la respuesta está en un documento en inglés, o al revés. El modelo de incrustación tiene que alinear el significado entre lenguas, no sólo dentro de una.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Construimos 166 pares de frases paralelas en chino e inglés en tres niveles de dificultad:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Niveles de dificultad multilingüe: El nivel fácil asigna traducciones literales como 我爱你 a I love you; el nivel medio asigna frases parafraseadas como 这道菜太咸了 a This dish is too salty con negativos duros; el nivel duro asigna modismos chinos como 画蛇添足 a gilding the lily con negativos duros semánticamente diferentes</span> </span>.</p>
<p>Cada lengua tiene también 152 distractores negativos duros.</p>
<p><strong>Puntuación:</strong></p>
<ul>
<li>Generar incrustaciones para todo el texto chino (166 correctos + 152 distractores) y todo el texto inglés (166 correctos + 152 distractores).</li>
<li><strong>Chino → Inglés:</strong> Cada frase china busca su traducción correcta en 318 textos ingleses.</li>
<li><strong>Inglés → Chino:</strong> Lo mismo a la inversa.</li>
<li><strong>Puntuación final:</strong> hard_avg_R@1 = (zh→en precisión + en→zh precisión) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Gráfico de barras horizontales que muestra la clasificación de recuperación multilingüe: Gemini Embed 2 lidera con 0,997, seguido de Qwen3-VL-2B con 0,988, Jina v4 con 0,985, Voyage MM-3.5 con 0,982, hasta mxbai con 0,120.</span> </span></p>
<p>Gemini Embedding 2 obtuvo una puntuación de 0,997, la más alta de todos los modelos probados. Fue el único modelo que obtuvo una puntuación perfecta de 1,000 en el nivel Difícil, en el que pares como "画蛇添足" → "dorar el lirio" requieren una verdadera comprensión <a href="https://zilliz.com/glossary/semantic-search">semántica</a> en todos los idiomas, no una coincidencia de patrones.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Puntuación (R@1)</th><th>Fácil</th><th>Medio</th><th>Difícil (modismos)</th></tr>
</thead>
<tbody>
<tr><td>Incrustación Gemini 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-grande</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>Los 7 mejores modelos obtienen todos un 0,93 en la puntuación global; la verdadera diferenciación se produce en el nivel difícil (modismos chinos). nomic-embed-text y mxbai-embed-large, ambos modelos ligeros centrados en el inglés, obtienen una puntuación cercana a cero en tareas interlingüísticas.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Recuperación de información clave: ¿Pueden los modelos encontrar una aguja en un documento de 32.000 palabras?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>Los sistemas RAG suelen procesar documentos extensos: contratos legales, trabajos de investigación, informes internos que contienen <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a>. La cuestión es si un modelo de incrustación puede encontrar un dato concreto enterrado en miles de caracteres de texto circundante.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Tomamos como pajar artículos de Wikipedia de longitud variable (de 4.000 a 32.000 caracteres) e insertamos un único hecho inventado -la aguja- en distintas posiciones: inicio, 25%, 50%, 75% y final. El modelo tiene que determinar, basándose en una incrustación de consulta, qué versión del documento contiene la aguja.</p>
<p><strong>Ejemplo:</strong></p>
<ul>
<li><strong>Aguja:</strong> "The Meridian Corporation declaró unos ingresos trimestrales de 847,3 millones de dólares en el tercer trimestre de 2025".</li>
<li><strong>Consulta:</strong> "¿Cuáles fueron los ingresos trimestrales de Meridian Corporation?".</li>
<li><strong>Pajar:</strong> Un artículo de Wikipedia de 32.000 caracteres sobre la fotosíntesis, con la aguja escondida en algún lugar de su interior.</li>
</ul>
<p><strong>Puntuación:</strong></p>
<ul>
<li>Generar incrustaciones para la consulta, el documento con la aguja y el documento sin la aguja.</li>
<li>Si la consulta es más similar al documento que contiene la aguja, se cuenta como un acierto.</li>
<li>Precisión media para todas las longitudes de documento y posiciones de la aguja.</li>
<li><strong>Métricas finales:</strong> precisión_general y tasa_de_degradación (cuánto disminuye la precisión del documento más corto al más largo).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Mapa de calor que muestra la precisión de Needle-in-a-Haystack en función de la longitud del documento: Gemini Embed 2 obtiene una puntuación de 1,000 en todas las longitudes hasta 32K; los 7 modelos principales obtienen una puntuación perfecta dentro de sus ventanas de contexto; mxbai y nomic se degradan bruscamente a partir de 4K</span> </span>.</p>
<p>Gemini Embedding 2 es el único modelo probado en toda la gama 4K-32K, y obtuvo una puntuación perfecta en todas las longitudes. Ningún otro modelo de esta prueba tiene una ventana de contexto que alcance los 32K.</p>
<table>
<thead>
<tr><th>Modelo</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>En general</th><th>Degradación</th></tr>
</thead>
<tbody>
<tr><td>Incrustación Gemini 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-grandes</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage Multimodal 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" significa que la longitud del documento supera la ventana de contexto del modelo.</p>
<p>Los 7 mejores modelos puntúan perfectamente dentro de sus ventanas de contexto. BGE-M3 empieza a resbalar a partir de 8K (0,920). Los modelos ligeros (mxbai y nomic) bajan a 0,4-0,6 a partir de 4K caracteres, es decir, unas 1.000 fichas. En el caso de mxbai, este descenso refleja en parte que su ventana contextual de 512 tokens trunca la mayor parte del documento.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Compresión dimensional MRL: ¿Cuánta calidad se pierde con 256 dimensiones?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>El aprendizaje de representación matrioska (MRL)</strong> es una técnica de entrenamiento que hace que las N primeras dimensiones de un vector tengan sentido por sí mismas. Tome un vector de 3072 dimensiones, trúnquelo a 256 y conservará la mayor parte de su calidad semántica. Menos dimensiones significa menos costes de almacenamiento y memoria en su <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a>: pasar de 3072 a 256 dimensiones supone una reducción del almacenamiento de 12 veces.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Ilustración que muestra el truncamiento de dimensiones de MRL: 3072 dimensiones con la máxima calidad, 1024 con el 95%, 512 con el 90%, 256 con el 85%, con un ahorro de almacenamiento de 12 veces con 256 dimensiones.</span> </span></p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Utilizamos 150 pares de frases de la prueba de referencia STS-B, cada una con una puntuación de similitud anotada por humanos (0-5). Para cada modelo, se generaron incrustaciones en las dimensiones completas y, a continuación, se truncaron a 1024, 512 y 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Ejemplos de datos STS-B que muestran pares de frases con puntuaciones de similitud humanas: Una chica se peina frente a Una chica se cepilla el pelo: 2,5; Un grupo de hombres juega al fútbol en la playa frente a Un grupo de chicos juega al fútbol en la playa: 3,6</span> </span>.</p>
<p><strong>Puntuación:</strong></p>
<ul>
<li>En cada nivel de dimensión, calcule la <a href="https://zilliz.com/glossary/cosine-similarity">similitud coseno</a> entre las incrustaciones de cada par de frases.</li>
<li>Compare la clasificación de similitud del modelo con la clasificación humana utilizando <strong>la ρ de Spearman</strong> (correlación de rangos).</li>
</ul>
<blockquote>
<p><strong>¿Qué es la ρ de Spearman?</strong> Mide la concordancia entre dos clasificaciones. Si los humanos clasifican el par A como el más similar, el B como el segundo y el C como el menos similar -y las similitudes del coseno del modelo producen el mismo orden A &gt; B &gt; C- entonces ρ se aproxima a 1,0. Una ρ de 1,0 significa una concordancia perfecta. Una ρ de 0 significa que no hay correlación.</p>
</blockquote>
<p><strong>Métricas finales:</strong> spearman_rho (cuanto más alta, mejor) y min_viable_dim (la dimensión más pequeña en la que la calidad se mantiene dentro del 5% del rendimiento de la dimensión completa).</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Gráfico de puntos que muestra la calidad de la dimensión completa de MRL frente a la de 256 dimensiones: Voyage MM-3.5 lidera con un cambio del +0,6%, Jina v4 +0,5%, mientras que Gemini Embed 2 muestra un -0,6% en la parte inferior</span> </span>.</p>
<p>Si está pensando en reducir los costes de almacenamiento en <a href="https://milvus.io/">Milvus</a> u otra base de datos vectorial truncando las dimensiones, este resultado es importante.</p>
<table>
<thead>
<tr><th>Modelo</th><th>ρ (dimensión completa)</th><th>ρ (256 dim)</th><th>Decaimiento</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3,5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage y Jina v4 van en cabeza porque ambos se entrenaron explícitamente con la LRM como objetivo. La compresión dimensional tiene poco que ver con el tamaño del modelo: lo que importa es si el modelo fue entrenado para ello.</p>
<p>Nota sobre la puntuación de Gemini: la clasificación MRL refleja lo bien que un modelo conserva la calidad tras el truncamiento, no lo buena que es su recuperación de la dimensión completa. La recuperación de Gemini en toda la dimensión es muy buena: los resultados multilingües y de información clave ya lo han demostrado. Simplemente, no estaba optimizada para la reducción. Si no necesita compresión dimensional, esta métrica no es aplicable a su caso.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">¿Qué modelo de incrustación debe utilizar?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Ningún modelo lo gana todo. Aquí está la tabla de puntuación completa:</p>
<table>
<thead>
<tr><th>Modelo</th><th>Parámetros</th><th>Multimodal</th><th>Multilingüe</th><th>Información clave</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Incrustación Gemini 2</td><td>No revelado</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodal 3,5</td><td>No divulgado</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-grande</td><td>No revelado</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>No revelado</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" significa que el modelo no admite esa modalidad o capacidad. CLIP es una base de referencia de 2021.</p>
<p>Esto es lo que destaca</p>
<ul>
<li><strong>Modalidad cruzada:</strong> Qwen3-VL-2B (0,945) primero, Gemini (0,928) segundo, Voyage (0,900) tercero. Un modelo 2B de código abierto venció a todas las API de código cerrado. El factor decisivo fue la diferencia entre modalidades, no el número de parámetros.</li>
<li><strong>Plurilingüe:</strong> Gemini (0,997), el único modelo que obtiene una puntuación perfecta en la alineación idiomática. Los 8 mejores modelos obtienen todos un 0,93. Los modelos ligeros en inglés obtienen una puntuación cercana a cero.</li>
<li><strong>Información clave:</strong> Los modelos de API y de código abierto de gran tamaño obtienen una puntuación perfecta hasta 8K. Los modelos por debajo de 335M empiezan a degradarse a partir de 4K. Gemini es el único modelo que maneja 32K con una puntuación perfecta.</li>
<li><strong>Compresión de dimensiones MRL:</strong> Voyage (0,880) y Jina v4 (0,833) van en cabeza, perdiendo menos de un 1% a 256 dimensiones. Gemini (0,668) ocupa el último lugar: fuerte en dimensión completa, no optimizado para truncamiento.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Cómo elegir: un diagrama de flujo de decisiones</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Diagrama de flujo de selección de modelos de incrustación: Inicio → ¿Necesita imágenes o vídeo? → Sí: ¿Necesita autoalojarse? → Sí: Qwen3-VL-2B, No: Gemini Embedding 2. Sin imágenes → ¿Necesita ahorrar almacenamiento? → Sí: Jina v4 o Voyage, No: ¿Necesita multilingüe? → Sí: Gemini Embedding 2, No: OpenAI 3-large</span> </span>.</p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">El mejor todoterreno: Gemini Embedding 2</h3><p>En conjunto, Gemini Embedding 2 es el modelo global más fuerte en este benchmark.</p>
<p><strong>Puntos fuertes:</strong> Primer puesto en recuperación de información clave y multilingüe (0,997) (1,000 en todas las longitudes hasta 32K). Segundo en cross-modal (0,928). Amplia cobertura modal: cinco modalidades (texto, imagen, vídeo, audio, PDF), mientras que la mayoría de los modelos se limitan a tres.</p>
<p><strong>Puntos débiles:</strong> Último en compresión LMR (ρ = 0,668). Superado en cross-modal por el modelo de código abierto Qwen3-VL-2B.</p>
<p>Si no necesita compresión dimensional, Gemini no tiene ningún competidor real en la combinación de recuperación multilingüe y de documentos largos. Pero para la precisión intermodal o la optimización del almacenamiento, los modelos especializados son mejores.</p>
<h2 id="Limitations" class="common-anchor-header">Limitaciones<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>No hemos incluido todos los modelos dignos de consideración: NV-Embed-v2 de NVIDIA y v5-text de Jina estaban en la lista, pero no han llegado a esta ronda.</li>
<li>Nos hemos centrado en las modalidades de texto e imagen; no hemos incluido la incrustación de vídeo, audio y PDF (a pesar de que algunos modelos afirman soportarla).</li>
<li>La recuperación de código y otros escenarios específicos del dominio quedaron fuera del alcance.</li>
<li>El tamaño de las muestras era relativamente pequeño, por lo que las diferencias de clasificación entre los modelos pueden deberse al ruido estadístico.</li>
</ul>
<p>Los resultados de este artículo quedarán obsoletos dentro de un año. Constantemente aparecen nuevos modelos y la clasificación cambia con cada lanzamiento. La inversión más duradera es crear su propio proceso de evaluación: defina sus tipos de datos, sus patrones de consulta, la longitud de sus documentos y someta los nuevos modelos a sus propias pruebas cuando salgan. Merece la pena hacer un seguimiento de los puntos de referencia públicos como MTEB, MMTEB y MMEB, pero la decisión final siempre debe venir de sus propios datos.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Nuestro código de referencia es de código abierto en GitHub</a>: bifúrcalo y adáptalo a tu caso de uso.</p>
<hr>
<p>Una vez que haya elegido su modelo de incrustación, necesitará un lugar donde almacenar y buscar esos vectores a escala. <a href="https://milvus.io/">Milvus</a> es la base de datos de vectores de código abierto más adoptada del mundo, con <a href="https://github.com/milvus-io/milvus">más de 43.000 estrellas de GitHub</a> creadas exactamente para esto: admite dimensiones truncadas por MRL, colecciones multimodales mixtas, búsqueda híbrida que combina vectores densos y dispersos, y <a href="https://milvus.io/docs/architecture_overview.md">escala desde un ordenador portátil hasta miles de millones de vectores</a>.</p>
<ul>
<li>Empiece con la <a href="https://milvus.io/docs/quickstart.md">guía de inicio rápido de Milvus</a>, o instálelo con <code translate="no">pip install pymilvus</code>.</li>
<li>Únase a <a href="https://milvusio.slack.com/">Milvus Slack</a> o <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> para hacer preguntas sobre la integración de modelos, estrategias de indexación de vectores o escalado de producción.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de Milvus Office Hours</a> para recorrer su arquitectura RAG: podemos ayudarle con la selección de modelos, el diseño de esquemas de recopilación y el ajuste del rendimiento.</li>
<li>Si prefiere saltarse el trabajo de infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece un nivel gratuito para empezar.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los ingenieros eligen un modelo de incrustación para RAG de producción:</p>
<p><strong>P: ¿Debería utilizar un modelo de incrustación multimodal incluso si sólo tengo datos de texto en este momento?</strong></p>
<p>Depende de su hoja de ruta. Si es probable que su canal de producción añada imágenes, PDF u otras modalidades en los próximos 6 a 12 meses, empezar con un modelo multimodal como Gemini Embedding 2 o Voyage Multimodal 3.5 le evitará una dolorosa migración posterior, ya que no tendrá que volver a incrustar todo su conjunto de datos. Si está seguro de que será sólo texto en un futuro próximo, un modelo centrado en texto como OpenAI 3-large o Cohere Embed v4 le ofrecerá una mejor relación precio/rendimiento.</p>
<p><strong>P: ¿Cuánto almacenamiento ahorra realmente la compresión de dimensiones MRL en una base de datos vectorial?</strong></p>
<p>Pasar de 3072 dimensiones a 256 dimensiones es una reducción de 12 veces en almacenamiento por vector. Para una colección <a href="https://milvus.io/">Milvus</a> con 100 millones de vectores en float32, eso es aproximadamente 1,14 TB → 95 GB. La clave es que no todos los modelos manejan bien el truncamiento: Voyage Multimodal 3.5 y Jina Embeddings v4 pierden menos de un 1% de calidad a 256 dimensiones, mientras que otros se degradan significativamente.</p>
<p><strong>P: ¿Es Qwen3-VL-2B realmente mejor que Gemini Embedding 2 para la búsqueda multimodal?</strong></p>
<p>En nuestra prueba, sí: Qwen3-VL-2B obtuvo una puntuación de 0,945 frente a la de Gemini de 0,928 en la recuperación cross-modal con distractores casi idénticos. La razón principal es que Qwen tiene una diferencia de modalidad mucho menor (0,25 frente a 0,73), lo que significa que <a href="https://zilliz.com/glossary/vector-embeddings">las incrustaciones de</a> texto e imagen se agrupan más cerca en el espacio vectorial. Dicho esto, Gemini cubre cinco modalidades mientras que Qwen cubre tres, por lo que si necesita incrustaciones de audio o PDF, Gemini es la única opción.</p>
<p><strong>P: ¿Puedo utilizar estos modelos de incrustación directamente con Milvus?</strong></p>
<p>Sí. Todos estos modelos producen vectores flotantes estándar, que puede <a href="https://milvus.io/docs/insert-update-delete.md">insertar en Milvus</a> y buscar con <a href="https://zilliz.com/glossary/cosine-similarity">similitud coseno</a>, distancia L2 o producto interno. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> funciona con cualquier modelo de incrustación - genere sus vectores con el SDK del modelo, luego almacénelos y búsquelos en Milvus. Para vectores truncados por MRL, sólo tiene que establecer la dimensión de la colección a su objetivo (por ejemplo, 256) al <a href="https://milvus.io/docs/manage-collections.md">crear la colección</a>.</p>
