---
id: claude-code-context-management-tools.md
title: >
  Las 7 mejores herramientas de código abierto para la gestión del contexto del
  código de Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Las sesiones prolongadas de Claude Code pierden la señal rápidamente. Descubre
  siete herramientas para reducir el ruido del terminal, la recuperación de
  código, la salida de herramientas, el uso de la memoria y el uso de tokens.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Puedes proporcionar a Claude Code una ventana de contexto de 1 millón de tokens y, aun así, obtener respuestas cada vez peores con el paso del tiempo. El problema no es solo el tamaño del contexto, sino también su calidad.</p>
<p>Las sesiones de Claude Code se deterioran cuando los registros de la terminal, la salida sin procesar de las herramientas, las lecturas repetidas de archivos, las respuestas prolijas y el historial del proyecto olvidado compiten por la atención. En flujos de trabajo de agentes de larga duración, ese ruido se convierte en un bucle: el modelo pierde el hilo, añades más turnos para corregir la respuesta y esos turnos adicionales añaden aún más ruido.</p>
<p>Esto es lo que se conoce como <strong>«desenfoque del contexto</strong>»: el modelo tiene espacio suficiente para almacenar información, pero la información importante queda sepultada bajo un contexto de baja relevancia. Las ventanas más amplias pueden hacer que esto sea más fácil de ignorar, ya que los desarrolladores dejan de pensar detenidamente en lo que introducen en la solicitud.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Diagrama de almacenamiento en caché de prompts que muestra cómo los prefijos reutilizados pueden seguir añadiendo contexto facturable a lo largo de los turnos</span>
  
 </span></p>
<p>El almacenamiento en caché de las indicaciones puede reducir el coste de los prefijos repetidos, pero no convierte la ventana de contexto en un cajón de sastre. Sigues pagando por los nuevos tokens y sigues necesitando que el modelo razone sobre la información correcta.</p>
<p>Este artículo repasa siete herramientas de código abierto que abordan la pérdida de enfoque del contexto desde diferentes niveles: salida de terminal, salida de herramientas, navegación por el código fuente, lectura de archivos, verbosidad del modelo, recuperación semántica de código y memoria entre sesiones. También explica cómo estas ideas se aplican al diseño <a href="https://zilliz.com/learn/what-is-vector-database">de bases de datos vectoriales</a>, <a href="https://zilliz.com/learn/vector-similarity-search">la búsqueda de similitud vectorial</a> y los sistemas de recuperación como Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">¿Qué provoca la pérdida de contexto en Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>La pérdida de contexto en Claude Code suele deberse a cinco modos de fallo: exceso de texto de instrucciones sin procesar, salida ruidosa de las herramientas, exploración repetida del código fuente, respuestas largas del modelo y lagunas de memoria entre sesiones o agentes.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Cinco causas de la pérdida de contexto en Claude Code: instrucciones redundantes, salida desordenada de las herramientas, recuperación repetida del código fuente, respuestas largas y lagunas de memoria</span>
  
 </span></p>
<table>
<thead>
<tr><th>Modo de fallo del contexto</th><th>Cómo se manifiesta en Claude Code</th><th>Categoría de herramientas que puede ayudar</th></tr>
</thead>
<tbody>
<tr><td>Los registros de la terminal son ruidosos</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, y las CLI en la nube generan más texto del que el modelo necesita.</td><td>Compresión de la salida de la CLI</td></tr>
<tr><td>Las salidas de las herramientas inundan la ventana</td><td>Los registros de pruebas, los volcados de DOM y las salidas de MCP aparecen en el chat como enormes bloques sin procesar.</td><td>Aislamiento de la salida de las herramientas</td></tr>
<tr><td>La navegación por el código base se repite</td><td>Claude enumera directorios, realiza búsquedas con grep, lee archivos y repite la misma exploración en cada sesión.</td><td>Grafo de código o recuperación semántica</td></tr>
<tr><td>La lectura de archivos es demasiado amplia</td><td>El modelo lee un archivo completo cuando solo necesitaba un símbolo o un resumen.</td><td>Lectura progresiva del código</td></tr>
<tr><td>Claude habla demasiado</td><td>La propia respuesta añade contexto innecesario para los turnos posteriores.</td><td>Compresión de la respuesta</td></tr>
<tr><td>La memoria no se conserva</td><td>Vuelves a explicar las decisiones del proyecto cada vez que empiezas una nueva sesión.</td><td>Memoria basada en Markdown</td></tr>
</tbody>
</table>
<p>Una buena pila de gestión del contexto debería hacer tres cosas: mantener a raya la información innecesaria, recuperar el conocimiento adecuado del proyecto cuando se necesite y conservar las decisiones duraderas entre sesiones.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">¿Qué herramienta de contexto de Claude Code deberías usar primero?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Empieza por la capa que genere más ruido en tu flujo de trabajo. Si el problema es la salida de tu terminal, empieza por RTK. Si Claude no deja de deambular por un repositorio grande, empieza por claude-context o code-review-graph. Si lo que realmente te molesta es tener que volver a explicar las mismas decisiones cada día, empieza por memsearch.</p>
<table>
<thead>
<tr><th>Herramienta</th><th>Principal problema que resuelve</th><th>La mejor opción</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Salida de terminal con mucho ruido procedente de comandos habituales de los desarrolladores.</td><td>Desarrolladores que ejecutan muchos comandos de la interfaz de línea de comandos (CLI) dentro de Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Modo de contexto</a></td><td>Gran cantidad de salidas sin procesar de herramientas que se introducen en la conversación principal.</td><td>Usuarios intensivos de Playwright, GitHub, registros o herramientas MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Exploración a ciegas del código fuente en repositorios de gran tamaño.</td><td>Revisiones, análisis de dependencias y preguntas sobre el alcance de los efectos.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Lectura completa de archivos cuando bastaría con un resumen de símbolos.</td><td>Archivos grandes, búsquedas repetidas de símbolos y lectura incremental del código.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Los propios hábitos de Claude de dar respuestas prolijas.</td><td>Usuarios que desean una salida concisa y un contexto futuro más reducido.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Volver a explorar el código en cada sesión.</td><td>Búsqueda semántica de código a través de MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Pérdida de memoria del proyecto entre sesiones, agentes y cambios de modelo.</td><td>Proyectos de larga duración con decisiones y lecciones duraderas.</td></tr>
</tbody>
</table>
<p>Las cinco primeras herramientas reducen lo que entra o permanece en el contexto. Las dos últimas facilitan la recuperación del contexto útil.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK comprime la salida sin procesar de los comandos antes de que Claude la vea<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK es un proxy de CLI que reduce el uso de tokens en los comandos habituales de los desarrolladores. Según su descripción en GitHub, reduce el consumo de tokens de los modelos de lenguaje grande (LLM) entre un 60 % y un 90 % en los comandos habituales de desarrollo, y se distribuye como un único binario en Rust.</p>
<p>En el uso diario de Claude Code, comandos como <code translate="no">git status</code>, <code translate="no">pytest</code> y los listados de directorios suelen volcar toda la información del entorno y las descripciones de estado en la ventana de contexto. El modelo normalmente solo necesita una respuesta más breve: qué archivos han cambiado, qué prueba ha fallado, dónde se ha atascado la solicitud de incorporación de cambios (PR) o qué archivos clave existen en el directorio.</p>
<p>RTK actúa como intermediario entre el shell y Claude. Puede reescribir comandos a través de los hooks de Claude Code y devolver una salida comprimida.</p>
<p>Salida sin procesar de « <code translate="no">git status</code> »:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>Lo que realmente importa:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Lo mismo ocurre con ` <code translate="no">pytest</code>`. La salida sin procesar está llena de casos que han pasado y ruido del entorno:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Una vez comprimida, la señal es inmediata:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK es el punto de partida más sencillo cuando la sobrecarga de contexto proviene de comandos de shell en lugar de la recuperación de código.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">El Modo Contexto aísla en un entorno aislado las salidas de herramientas gigantescas fuera del chat principal<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>El Modo Contexto está diseñado para los bloques sin procesar que devuelven las herramientas: registros de pruebas, instantáneas del DOM del navegador, cargas útiles de GitHub, resultados de herramientas MCP y páginas extraídas. Su descripción en GitHub destaca la optimización de la ventana de contexto para agentes de programación con IA e informa de una reducción del 98 % en la salida de las herramientas.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Ficha del repositorio de GitHub del Modo Contexto que muestra la salida de las herramientas aislada en un entorno de pruebas y el posicionamiento de la optimización del contexto</span>
  
 </span></p>
<p>Su enfoque consiste en aislar las salidas voluminosas de las herramientas en un entorno aislado local y un índice, para luego pasar únicamente resúmenes y identificadores de recuperación a la conversación de Claude.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Flujo de Context Mode que muestra cómo la salida voluminosa de las herramientas pasa por la ejecución en el entorno aislado, los índices SQLite o FTS, los resúmenes y los resultados de la recuperación</span>
  
 </span></p>
<p>Este flujo resulta útil porque un agente de programación suele necesitar el nodo que falla, el selector defectuoso o el rastreo de pila relevante, y no todo el DOM ni cada línea de prueba superada. «Context Mode» mantiene la salida completa disponible localmente, al tiempo que evita que domine la conversación principal.</p>
<p>Esto es similar a cómo los sistemas <a href="https://zilliz.com/blog/hybrid-search-with-milvus">de búsqueda híbridos</a> en producción separan el almacenamiento de la recuperación. Se guardan los datos sin procesar en un lugar duradero y, a continuación, solo se recupera la parte que importa.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph mapea la estructura del código antes de que Claude la explore<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph aborda un problema diferente: Claude no siempre necesita más texto; necesita un mapa mejor.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Imagen del logotipo de code-review-graph utilizada en el artículo original</span>
  
 </span></p>
<p>En un repositorio grande, una simple pregunta puede desencadenar una exploración costosa:</p>
<blockquote>
<p>Tras cambiar esta lógica de inicio de sesión, ¿qué archivos y pruebas se ven afectados?</p>
</blockquote>
<p>Sin un gráfico de código, la estrategia habitual de Claude es:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph genera previamente un mapa estructural del código base. Utiliza Tree-sitter para analizar funciones, clases, importaciones, relaciones de llamada, herencia y dependencias de pruebas, y luego escribe el gráfico en SQLite.</p>
<p>Esto lo hace útil para la revisión de código y el análisis del «radio de impacto». En lugar de pedirle a Claude que vuelva a descubrir el grafo de dependencias mediante lecturas repetidas, se le permite consultar primero la estructura.</p>
<p>Esto es similar a <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">la búsqueda semántica</a>, pero no es lo mismo. Un grafo estructural responde a la pregunta «¿qué depende de qué?», mientras que la recuperación semántica responde a «¿qué código está conceptualmente relacionado con esta pregunta?». En los flujos de trabajo reales de los asistentes de código, a menudo se necesitan ambas cosas.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior proporciona a Claude resúmenes de símbolos antes que los archivos completos<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>La idea central de Token Savior es sencilla: no enviar el archivo completo por defecto. Enviar primero un índice o un resumen de símbolos y, a continuación, ampliarlo solo cuando la tarea requiera más detalles.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Ficha del repositorio de GitHub de Token Savior que muestra la descripción de su servidor MCP y las estadísticas del proyecto</span>
  
 </span></p>
<p>Si preguntas dónde se gestiona un webhook de pago, el modelo a menudo no necesita todas las líneas de todos los archivos relacionados. Primero necesita saber si un archivo o un símbolo es relevante.</p>
<p>Token Savior sirve el código por capas:</p>
<table>
<thead>
<tr><th>Capa</th><th>Lo que recibe Claude</th><th>Cuando se expande</th></tr>
</thead>
<tbody>
<tr><td>Resumen</td><td>Índice, nombres de símbolos y descripciones breves.</td><td>Primera respuesta por defecto.</td></tr>
<tr><td>Fragmento</td><td>Una sección de código más breve en torno al símbolo relevante.</td><td>Cuando es probable que el resumen sea relevante.</td></tr>
<tr><td>Archivo completo</td><td>El contenido completo del archivo.</td><td>Solo cuando la edición o el razonamiento en profundidad lo requieran.</td></tr>
</tbody>
</table>
<p>Esto refleja la forma en que los desarrolladores leen realmente el código. Se echa un vistazo rápido, se confirma la relevancia y, a continuación, se abre el archivo completo solo cuando es necesario. También se asemeja al patrón de recuperación progresiva utilizado en <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">las aplicaciones RAG</a>: recuperar información de forma lo suficientemente amplia como para orientarse y, a continuación, acotar el contexto antes de la generación.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman reduce el exceso de respuestas de Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>La mayoría de las herramientas de contexto se centran en lo que entra en el modelo. Caveman se centra en lo que genera Claude.</p>
<p>Caveman es una habilidad o complemento de Claude Code que elimina el relleno, las fórmulas de cortesía, las frases de relleno, las explicaciones excesivas y las estructuras repetitivas. El objetivo no es eliminar conocimiento, sino hacer que la respuesta sea más concisa.</p>
<p>Sin Caveman:</p>
<blockquote>
<p>La razón por la que tu componente de React se está volviendo a renderizar es probablemente porque…</p>
</blockquote>
<p>Con Caveman:</p>
<blockquote>
<p>Nueva referencia de objeto en cada renderizado. Prop de objeto en línea = nueva referencia = nuevo renderizado. Envuélvelo en useMemo.</p>
</blockquote>
<p>Esto es importante porque las propias respuestas de Claude se convierten en contexto futuro. Si cada respuesta incluye una explicación larga, el siguiente turno comienza con más texto del necesario. Las respuestas más breves pueden mejorar el siguiente turno tanto como mejoran el actual.</p>
<p>Para los equipos que estén pensando en <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">la ingeniería de contexto para agentes de IA</a>, Caveman es un recordatorio de que la política de salida forma parte de la política de contexto.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context añade búsqueda semántica de código a través del MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context resuelve el problema de la exploración repetida del código fuente mediante la recuperación semántica. Indexa un repositorio, almacena fragmentos de código en una base de datos vectorial y permite la búsqueda a través del <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Repositorio de Claude Context mostrado en GitHub Tendencias en el artículo original</span>
  
 </span></p>
<p>En una base de código grande, constantemente le haces preguntas a Claude como:</p>
<blockquote>
<p>Ayúdame a averiguar qué partes del código podrían estar relacionadas con este error.</p>
</blockquote>
<p>Sin una capa de recuperación, el enfoque predeterminado de Claude suele ser:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context traslada ese trabajo a una capa de recuperación. Divide el repositorio en fragmentos, genera representaciones, las almacena en un <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">índice de código basado en Milvus</a> y recupera los fragmentos de código relevantes antes de que el modelo empiece a leer los archivos a ciegas.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>Flujo de claude-context que muestra la segmentación de la base de código, las representaciones, la base de datos vectorial y la búsqueda híbrida, la recuperación de código relevante y la inyección de contexto en Claude</span>
  
 </span></p>
<p>Aquí es donde las herramientas de programación basadas en IA empiezan a parecerse a los sistemas de búsqueda. Se necesitan fragmentación, representaciones, metadatos, coincidencia léxica, clasificación y actualidad. Esos son los mismos componentes básicos que subyacen a <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">la recuperación RAG en producción</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">el enrutamiento de recuperación híbrida</a> y <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">la selección de modelos de representación</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch conserva la memoria útil entre sesiones y agentes<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch aborda el lado opuesto del problema: no qué olvidar, sino cómo recordar lo que importa.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>Imagen del logotipo de memsearch del artículo original</span>
  
 </span></p>
<p>Imagina que el lunes le dices a Claude:</p>
<blockquote>
<p>Nuestro webhook no puede volver a intentarlo en caso de fallo; los eventos fallidos deben ir a una cola de mensajes perdidos.</p>
</blockquote>
<p>El miércoles, abres una nueva sesión y preguntas:</p>
<blockquote>
<p>¿Qué más podemos optimizar en la capa del webhook?</p>
</blockquote>
<p>Sin memoria persistente, Claude trata la decisión del lunes como si nunca hubiera ocurrido. Se lo vuelves a explicar.</p>
<p>memsearch almacena la memoria como archivos Markdown locales y legibles por humanos, y utiliza Milvus como índice de recuperación reconstruible. Ese diseño permite que la memoria sea editable por humanos, al tiempo que sigue siendo consultable para los agentes.</p>
<p>En el momento de la recuperación, memsearch utiliza la recuperación progresiva: primero busca, luego amplía si es necesario y, por último, profundiza en la transcripción original solo cuando es imprescindible.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Flujo de recuperación progresiva de memsearch que muestra la búsqueda, la expansión, la transcripción y el resumen, para volver a la conversación principal</span>
  
 </span></p>
<p>Este patrón que da prioridad al Markdown resulta útil para equipos que trabajan con diferentes sesiones, modelos y agentes. Además, se combina de forma natural con <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">la memoria a largo plazo de los agentes de IA</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">la memoria compartida entre múltiples agentes</a> y el problema más amplio de evitar <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">la pérdida de contexto en los sistemas de agentes</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">¿Cómo funcionan estas herramientas juntas?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>Las siete herramientas son complementarias, no intercambiables. Úsalas como capas.</p>
<table>
<thead>
<tr><th>Capa</th><th>Utiliza estas herramientas</th><th>Por qué</th></tr>
</thead>
<tbody>
<tr><td>Eliminar el ruido de los comandos</td><td>RTK</td><td>Comprimir la salida del terminal de gran volumen antes de que llegue a Claude.</td></tr>
<tr><td>Aislar la salida sin procesar de la herramienta</td><td>Modo de contexto</td><td>Mantener los registros de gran tamaño, los DOM y las cargas útiles de las herramientas fuera de la conversación principal.</td></tr>
<tr><td>Mapeo de la estructura del código</td><td>gráfico-de-revisión-de-código</td><td>Responde a preguntas sobre dependencias y alcance de impacto sin necesidad de leer archivos a ciegas.</td></tr>
<tr><td>Lee el código de forma progresiva</td><td>Token Savior</td><td>Empieza con resúmenes de símbolos y amplía solo cuando sea necesario.</td></tr>
<tr><td>Comprimir las respuestas de Claude</td><td>Caveman</td><td>Evita que la propia salida del modelo se convierta en una sobrecarga del contexto futuro.</td></tr>
<tr><td>Recupera el código relevante</td><td>claude-context</td><td>Utilizar la búsqueda semántica e híbrida de código en lugar de bucles repetitivos de grep.</td></tr>
<tr><td>Reutiliza las decisiones duraderas</td><td>memsearch</td><td>Recupera el historial del proyecto a lo largo de sesiones, agentes y cambios de modelo.</td></tr>
</tbody>
</table>
<p>Un orden de implementación práctico es:</p>
<ol>
<li><strong>Elimina primero el ruido evidente.</strong> Añade RTK o el modo de contexto si la salida del shell y las cargas útiles de las herramientas dominan tu contexto.</li>
<li><strong>Mejora la navegación por el repositorio.</strong> Añade «code-review-graph» para la estructura o «claude-context» para la recuperación semántica de código.</li>
<li><strong>Controla lo que queda.</strong> Utiliza «Token Savior» y «Caveman» para mantener compactas las lecturas de archivos y las respuestas del modelo.</li>
<li><strong>Conserva el conocimiento duradero.</strong> Utiliza memsearch cuando las explicaciones repetidas se conviertan en un cuello de botella.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Mantente en contacto<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Únete a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Milvus en Discord</a> para hacer preguntas y comparar patrones de gestión de contexto con otros desarrolladores.</li>
<li><a href="https://milvus.io/office-hours">Reserva una sesión gratuita de «Office Hours» de Milvus</a> si necesitas ayuda para diseñar una capa de recuperación para código, memoria o cargas de trabajo RAG.</li>
<li>Si prefieres saltarte la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece un plan gratuito para empezar.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>¿Cómo puedo reducir el uso de tokens de Claude Code sin perder contexto útil?</strong></p>
<p>Empieza por comprimir las entradas con más ruido: la salida de la terminal, las cargas útiles sin procesar de las herramientas y las lecturas repetidas de código. A continuación, añade herramientas de recuperación como claude-context o code-review-graph para que Claude pueda extraer el código relevante en lugar de explorar el repositorio desde cero.</p>
<p><strong>¿Debería utilizar claude-context o code-review-graph para un repositorio grande?</strong></p>
<p>Utiliza claude-context cuando necesites una búsqueda semántica de código, especialmente cuando no conozcas el nombre exacto del archivo o del símbolo. Utiliza code-review-graph cuando necesites respuestas estructurales, como relaciones de llamada, importaciones, dependencias de pruebas y el alcance de la revisión.</p>
<p><strong>¿La recuperación de memoria es diferente de la recuperación de código en Claude Code?</strong></p>
<p>Sí. La recuperación de código busca archivos o símbolos relevantes del proyecto. La recuperación de memoria recupera decisiones duraderas, preferencias de usuario, historial de depuración y lecciones entre sesiones. «memsearch» se centra en la memoria; «claude-context» se centra en la recuperación de código.</p>
<p><strong>¿Sustituyen estas herramientas al almacenamiento en caché de las indicaciones o a una ventana de contexto más amplia?</strong></p>
<p>No. El almacenamiento en caché de las indicaciones y las ventanas de contexto amplias ayudan en cuanto a capacidad y coste, pero no determinan qué información merece atención. Las herramientas de gestión del contexto mejoran, ante todo, la calidad y la densidad de lo que se introduce en el modelo. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
