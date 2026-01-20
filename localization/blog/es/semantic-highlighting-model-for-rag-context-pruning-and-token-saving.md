---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Cómo creamos un modelo de resaltado semántico para la depuración de contextos
  de la RAG y el ahorro de tokens
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Descubra cómo Zilliz construyó un modelo de resaltado semántico para el
  filtrado de ruido RAG, la poda de contexto y el ahorro de tokens utilizando
  arquitecturas de sólo codificador, razonamiento LLM y datos de entrenamiento
  bilingües a gran escala.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">El problema: Ruido RAG y desperdicio de tokens<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La búsqueda vectorial</strong> es una base sólida para los sistemas RAG: asistentes empresariales, agentes de IA, bots de atención al cliente, etc. Encuentra de forma fiable los documentos que importan. Pero la recuperación por sí sola no resuelve el problema del contexto. Incluso los índices bien ajustados devuelven fragmentos que son ampliamente relevantes, mientras que sólo una pequeña fracción de las frases dentro de esos fragmentos responden realmente a la consulta.</p>
<p>En los sistemas de producción, esta brecha aparece de inmediato. Una consulta puede contener docenas de documentos, cada uno de ellos con miles de tokens. Sólo un puñado de frases contiene la señal real; el resto es contexto que sobrecarga el uso de tokens, ralentiza la inferencia y a menudo distrae al LLM. El problema se hace aún más evidente en los flujos de trabajo con agentes, en los que las propias consultas son el resultado de un razonamiento de varios pasos y sólo coinciden con pequeñas partes del texto recuperado.</p>
<p>Esto crea una clara necesidad de un modelo que pueda <em><strong>identificar y resaltar</strong></em> <em>las frases útiles e ignorar el resto: básicamente</em>, el filtrado de relevancia a nivel de frase, o lo que muchos equipos denominan <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>poda de contexto</strong></a>. El objetivo es sencillo: conservar las partes que importan y eliminar el ruido antes de que llegue al LLM.</p>
<p>El resaltado tradicional basado en palabras clave no puede resolver este problema. Por ejemplo, si un usuario pregunta: "¿Cómo puedo mejorar la eficiencia de la ejecución del código Python?", un resaltador de palabras clave seleccionará "Python" y "eficiencia", pero pasará por alto la frase que realmente responde a la pregunta - "Utilizar operaciones vectorizadas NumPy en lugar de bucles"- porque no comparte ninguna palabra clave con la consulta. Lo que necesitamos es comprensión semántica, no coincidencia de cadenas.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Un modelo de resaltado semántico para el filtrado de ruido RAG y la poda de contexto<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Para facilitar esta tarea a los creadores de RAG, hemos entrenado y desarrollado un modelo de resaltado <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>semántico</strong></a> que identifica y resalta las frases de los documentos recuperados que están más alineadas semánticamente con la consulta. En la actualidad, el modelo ofrece el rendimiento más avanzado tanto en inglés como en chino y está diseñado para integrarse directamente en los procesos RAG existentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Detalles del modelo</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Licencia:</strong> MIT (para uso comercial)</p></li>
<li><p><strong>Arquitectura:</strong> Modelo de sólo codificación de 0,6B basado en BGE-M3 Reranker v2</p></li>
<li><p><strong>Ventana de contexto:</strong> 8192 tokens</p></li>
<li><p><strong>Idiomas admitidos:</strong> Inglés y chino</p></li>
</ul>
<p>Semantic Highlighting proporciona las señales de relevancia necesarias para seleccionar sólo las partes útiles de documentos largos recuperados. En la práctica, este modelo permite:</p>
<ul>
<li><p><strong>Mejorar la interpretabilidad</strong>, mostrando qué partes de un documento son realmente importantes.</p></li>
<li><p><strong>una reducción del 70-80% en el coste de los tokens</strong> al enviar al LLM sólo las frases resaltadas</p></li>
<li><p><strong>Mejor calidad de respuesta</strong>, ya que el modelo ve menos contexto irrelevante.</p></li>
<li><p><strong>Una depuración más sencilla</strong>, ya que los ingenieros pueden inspeccionar directamente las coincidencias a nivel de frase.</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Resultados de la evaluación: Alcanzar el rendimiento SOTA</h3><p>Hemos evaluado nuestro modelo de Semantic Highlighting en varios conjuntos de datos en inglés y chino, tanto dentro como fuera del dominio.</p>
<p>Los conjuntos de referencia son los siguientes</p>
<ul>
<li><p><strong>Inglés multi-span QA:</strong> multispanqa</p></li>
<li><p><strong>Wikipedia en inglés fuera del dominio:</strong> wikitext2</p></li>
<li><p><strong>Control de calidad multi</strong> panorama<strong>en chino:</strong> multispanqa_zh</p></li>
<li><p><strong>Wikipedia</strong> en<strong>chino fuera del dominio:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los modelos evaluados incluyen:</p>
<ul>
<li><p>Serie Open Provence</p></li>
<li><p>Serie Provence/XProvence de Naver</p></li>
<li><p>Resaltador semántico de OpenSearch</p></li>
<li><p>Nuestro modelo bilingüe entrenado: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>En los cuatro conjuntos de datos, nuestro modelo ocupa el primer puesto. Y lo que es más importante, es el <em>único</em> modelo que obtiene buenos resultados tanto en inglés como en chino. Los modelos de la competencia se centran exclusivamente en el inglés o muestran claros descensos de rendimiento con el texto chino.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Cómo creamos este modelo de resaltado semántico<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Entrenar un modelo para esta tarea no es lo más difícil; entrenar un <em>buen</em> modelo que resuelva los problemas anteriores y ofrezca un rendimiento cercano al SOTA es lo realmente complicado. Nuestro enfoque se centró en dos aspectos:</p>
<ul>
<li><p><strong>Arquitectura del modelo:</strong> utilizar un diseño de sólo codificador para una inferencia rápida.</p></li>
<li><p><strong>Datos de entrenamiento:</strong> generar etiquetas de relevancia de alta calidad utilizando LLM con capacidad de razonamiento y escalar la generación de datos con marcos de inferencia locales.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Arquitectura del modelo</h3><p>Construimos el modelo como una red ligera de <strong>sólo codificador</strong> que trata la poda de contexto como una <strong>tarea de puntuación de relevancia a nivel de token</strong>. Este diseño se inspira en <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, un enfoque de poda de contexto presentado por Naver en el ICLR 2025, que replantea la poda de "elegir el fragmento correcto" a "puntuar cada token". Este planteamiento encaja a la perfección con el resaltado semántico, en el que las señales precisas son esenciales.</p>
<p>Los modelos basados únicamente en codificadores no son la arquitectura más novedosa, pero siguen siendo extremadamente prácticos en este caso: son rápidos, fáciles de escalar y pueden producir puntuaciones de relevancia para todas las posiciones de los tokens en paralelo. Para un sistema RAG de producción, esta ventaja de velocidad es mucho más importante que el uso de un modelo decodificador más grande.</p>
<p>Una vez calculadas las puntuaciones de relevancia a nivel <strong>de</strong> token, las agregamos a las puntuaciones <strong>a nivel de frase</strong>. Este paso convierte las señales ruidosas de los tokens en una métrica de relevancia estable e interpretable. Las frases por encima de un umbral configurable se resaltan; todo lo demás se filtra. Se obtiene así un mecanismo sencillo y fiable para seleccionar las frases que realmente son importantes para la consulta.</p>
<h3 id="Inference-Process" class="common-anchor-header">Proceso de inferencia</h3><p>En tiempo de ejecución, nuestro modelo de resaltado semántico sigue un proceso sencillo:</p>
<ol>
<li><p><strong>Entrada:</strong> el proceso comienza con una consulta del usuario. Los documentos recuperados se tratan como contexto candidato para la evaluación de la relevancia.</p></li>
<li><p><strong>Procesamiento del modelo:</strong> la consulta y el contexto se concatenan en una única secuencia: [BOS] + Consulta + Contexto</p></li>
<li><p><strong>Puntuación de tokens</strong>: a cada token del contexto se le asigna una puntuación de relevancia entre 0 y 1, que refleja su grado de relación con la consulta.</p></li>
<li><p><strong>Agregación de frases</strong>: las puntuaciones de los tokens se agregan a nivel de frase, normalmente promediando, para obtener una puntuación de relevancia para cada frase.</p></li>
<li><p><strong>Filtrado por umbral</strong>: las frases con puntuaciones superiores a un umbral configurable se resaltan y se conservan, mientras que las frases con puntuaciones bajas se filtran antes de pasar al LLM posterior.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Modelo base: BGE-M3 Reranker v2</h3><p>Hemos seleccionado BGE-M3 Reranker v2 como modelo base por varias razones:</p>
<ol>
<li><p>Emplea una arquitectura de codificador adecuada para la puntuación de tokens y frases.</p></li>
<li><p>Admite varios idiomas con optimización para inglés y chino.</p></li>
<li><p>Proporciona una ventana de contexto de 8192 tokens adecuada para documentos RAG más largos.</p></li>
<li><p>Mantiene parámetros de 0,6B, lo suficientemente potentes sin ser pesados desde el punto de vista computacional.</p></li>
<li><p>Garantiza un conocimiento del mundo suficiente en el modelo base.</p></li>
<li><p>Se ha entrenado para la reordenación, lo que coincide con las tareas de juicio de relevancia.</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Datos de entrenamiento: Anotación LLM con razonamiento<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez finalizada la arquitectura del modelo, el siguiente reto era construir un conjunto de datos que realmente entrenara un modelo fiable. Empezamos observando cómo lo hace Open Provence. Su método utiliza conjuntos de datos públicos de control de calidad y un pequeño LLM para etiquetar las frases relevantes. Se adapta bien y es fácil de automatizar, lo que lo convirtió en un buen punto de partida para nosotros.</p>
<p>Pero pronto nos encontramos con el mismo problema que ellos describen: si se pide a un LLM que emita directamente etiquetas a nivel de frase, los resultados no siempre son estables. Algunas etiquetas son correctas, otras son cuestionables, y es difícil limpiar las cosas después. La anotación totalmente manual tampoco era una opción: necesitábamos muchos más datos de los que podíamos etiquetar a mano.</p>
<p>Para mejorar la estabilidad sin sacrificar la escalabilidad, introdujimos un cambio: el LLM debe proporcionar un breve fragmento de razonamiento por cada etiqueta que emita. Cada ejemplo de entrenamiento incluye la consulta, el documento, las frases y una breve explicación de por qué una frase es relevante o irrelevante. Este pequeño ajuste hizo que las anotaciones fueran mucho más coherentes y nos proporcionó algo concreto a lo que remitirnos al validar o depurar el conjunto de datos.</p>
<p>Incluir el razonamiento resultó ser sorprendentemente valioso:</p>
<ul>
<li><p><strong>Mayor calidad de las anotaciones:</strong> Escribir el razonamiento funciona como autocomprobación, lo que reduce las etiquetas aleatorias o incoherentes.</p></li>
<li><p><strong>Mejor observabilidad:</strong> Podemos ver <em>por qué</em> se ha seleccionado una frase en lugar de tratar la etiqueta como una caja negra.</p></li>
<li><p><strong>Depuración más fácil:</strong> Cuando algo parece estar mal, el razonamiento facilita la detección de si el problema es la indicación, el dominio o la lógica de anotación.</p></li>
<li><p><strong>Datos reutilizables:</strong> Aunque en el futuro cambiemos a otro modelo de etiquetado, las trazas de razonamiento siguen siendo útiles para reetiquetar o auditar.</p></li>
</ul>
<p>El flujo de trabajo de anotación tiene este aspecto:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B para la anotación</h3><p>Para la anotación, elegimos Qwen3 8B porque admite de forma nativa un "modo de pensamiento" a través de las salidas, lo que facilita mucho la extracción de trazas de razonamiento coherentes. Los modelos más pequeños no nos proporcionaban etiquetas estables, y los más grandes eran más lentos e innecesariamente caros para este tipo de proceso. Qwen3 8B consiguió el equilibrio perfecto entre calidad, velocidad y coste.</p>
<p>Ejecutamos todas las anotaciones utilizando un <strong>servicio vLLM local</strong> en lugar de las API de la nube. Esto nos proporcionó un alto rendimiento, un rendimiento predecible y un coste mucho menor: básicamente, intercambiamos tiempo de GPU por tarifas de token de API, que es la mejor opción cuando se generan millones de muestras.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Escala del conjunto de datos</h3><p>En total, creamos <strong>más de 5 millones de muestras de entrenamiento bilingües</strong>, divididas a partes iguales entre inglés y chino.</p>
<ul>
<li><p><strong>Fuentes en inglés:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Fuentes en chino:</strong> DuReader, Wikipedia en chino, mmarco_chinese</p></li>
</ul>
<p>Parte del conjunto de datos procede de la reanotación de datos existentes utilizados por proyectos como Open Provence. El resto se generó a partir de corpus sin procesar, creando primero pares de consulta-contexto y etiquetándolos después con nuestro sistema de razonamiento.</p>
<p>Todos los datos de formación anotados están también disponibles en HuggingFace para el desarrollo de la comunidad y como referencia de formación: <a href="https://huggingface.co/zilliz/datasets">Conjuntos de datos de Zilliz</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Método de entrenamiento</h3><p>Una vez que la arquitectura del modelo y el conjunto de datos estuvieron listos, entrenamos el modelo en <strong>GPUs 8× A100</strong> durante tres épocas, lo que nos llevó aproximadamente <strong>9 horas</strong> de principio a fin.</p>
<p><strong>Nota:</strong> el entrenamiento sólo se centró en el <strong>cabezal de poda</strong>, responsable de la tarea de resaltado semántico. No entrenamos el <strong>cabezal de reordenación</strong>, ya que al centrarnos únicamente en el objetivo de poda obtuvimos mejores resultados en la puntuación de relevancia a nivel de frase.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Estudio de casos reales<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Las pruebas comparativas sólo cuentan una parte de la historia, por lo que he aquí un ejemplo real que muestra cómo se comporta el modelo en un caso límite común: cuando el texto recuperado contiene tanto la respuesta correcta como un distractor muy tentador.</p>
<p><strong>Consulta:</strong> <em>¿Quién escribió "La muerte de un ciervo sagrado"?</em></p>
<p><strong>Contexto (5 frases):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Respuesta correcta: Frase 1 (indica explícitamente "guión de Lanthimos y Efthymis Filippou").</p>
<p>Este ejemplo tiene una trampa: la frase 3 menciona que "Eurípides" escribió la obra original. Pero la pregunta se refiere a "quién escribió la película La matanza de un ciervo sagrado", y la respuesta debería ser los guionistas de la película, no el dramaturgo griego de hace miles de años.</p>
<h3 id="Model-results" class="common-anchor-header">Resultados del modelo</h3><table>
<thead>
<tr><th>Modelo</th><th>¿Encuentra la respuesta correcta?</th><th>Predicción</th></tr>
</thead>
<tbody>
<tr><td>Nuestro modelo</td><td>✓</td><td>Frases seleccionadas 1 (correcta) y 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Sólo seleccionó la frase 3, falló la respuesta correcta</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Sólo seleccionó la frase 3, falló la respuesta correcta</td></tr>
</tbody>
</table>
<p><strong>Comparación de puntuaciones de frases clave:</strong></p>
<table>
<thead>
<tr><th>Frase</th><th>Nuestro modelo</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Frase 1 (guión de película, respuesta correcta)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Frase 3 (obra de teatro original, distractor)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>Modelos XProvence:</p>
<ul>
<li><p>Se sienten muy atraídos por "Eurípides" y "obra de teatro", y dan a la frase 3 puntuaciones casi perfectas (0,947 y 0,802).</p></li>
<li><p>Ignora por completo la respuesta real (frase 1), con puntuaciones extremadamente bajas (0,133 y 0,081).</p></li>
<li><p>Incluso reduciendo el umbral de 0,5 a 0,2, sigue sin encontrar la respuesta correcta.</p></li>
</ul>
<p>Nuestro modelo:</p>
<ul>
<li><p>Atribuye correctamente a la frase 1 la puntuación más alta (0,915)</p></li>
<li><p>Sigue asignando a la frase 3 cierta relevancia (0,719) porque está relacionada con el fondo</p></li>
<li><p>Separa claramente las dos con un margen de ~0,2</p></li>
</ul>
<p>Este ejemplo muestra el punto fuerte del modelo: comprender <strong>la intención de la consulta</strong> en lugar de limitarse a coincidir con palabras clave superficiales. En este contexto, "Who wrote <em>The Killing of a Sacred Deer</em>" se refiere a la película, no a la antigua obra griega. Nuestro modelo lo capta, mientras que otros se distraen con fuertes indicios léxicos.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Pruébelo y díganos qué le parece<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestro modelo <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> ya es de código abierto bajo licencia MIT y está listo para su uso. Puede incorporarlo a su proceso RAG, adaptarlo a su propio dominio o crear nuevas herramientas a partir de él. También agradecemos las aportaciones y comentarios de la comunidad.</p>
<ul>
<li><p><strong>Descargar de HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Todos los datos de entrenamiento anotados:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Resaltado semántico disponible en Milvus y Zilliz Cloud</h3><p>El resaltado semántico también está integrado directamente en <a href="https://milvus.io/">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (el Milvus totalmente gestionado), lo que ofrece a los usuarios una visión clara de <em>por qué</em> se ha recuperado cada documento. En lugar de escanear trozos enteros, el usuario ve inmediatamente las frases específicas que se relacionan con su consulta, incluso cuando la redacción no coincide exactamente. Esto hace que la recuperación sea más fácil de entender y mucho más rápida de depurar. Para las canalizaciones RAG, también aclara en qué se espera que se centre el LLM posterior, lo que ayuda con el diseño rápido y las comprobaciones de calidad.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Pruebe gratis Semantic Highlighting en una nube Zilliz totalmente gestionada</strong></a></p>
<p>Nos encantaría saber cómo le funciona: informes de errores, ideas de mejora o cualquier cosa que descubra al integrarlo en su flujo de trabajo.</p>
<p>Si quieres hablar de cualquier cosa con más detalle, no dudes en unirte a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> o reservar una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a>. Siempre estamos encantados de charlar con otros constructores e intercambiar notas.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Agradecimientos<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Este trabajo se basa en un montón de grandes ideas y contribuciones de código abierto, y queremos destacar los proyectos que hicieron posible este modelo.</p>
<ul>
<li><p><strong>Provence</strong> introdujo un marco limpio y práctico para la poda de contexto utilizando modelos de codificador ligeros.</p></li>
<li><p><strong>Open Provence</strong> proporcionó una base de código sólida y bien diseñada -conductos de entrenamiento, procesamiento de datos y cabezales de modelos- bajo una licencia permisiva. Nos proporcionó un sólido punto de partida para la experimentación.</p></li>
</ul>
<p>Sobre esa base, añadimos varias contribuciones propias:</p>
<ul>
<li><p>Uso <strong>del razonamiento LLM</strong> para generar etiquetas de relevancia de mayor calidad.</p></li>
<li><p>Creación de <strong>casi 5 millones de</strong> muestras de entrenamiento bilingües alineadas con cargas de trabajo RAG reales.</p></li>
<li><p>Elección de un modelo base más adecuado para la puntuación de relevancia en contextos largos<strong>(BGE-M3 Reranker v2</strong>).</p></li>
<li><p>Entrenar sólo el <strong>cabezal de poda</strong> para especializar el modelo de resaltado semántico.</p></li>
</ul>
<p>Agradecemos a los equipos de Provence y Open Provence la publicación abierta de sus trabajos. Sus contribuciones han acelerado considerablemente nuestro desarrollo y han hecho posible este proyecto.</p>
