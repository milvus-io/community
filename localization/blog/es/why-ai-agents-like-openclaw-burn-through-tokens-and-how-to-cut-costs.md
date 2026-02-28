---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: Por qué los agentes de IA como OpenClaw queman fichas y cómo reducir costes
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Por qué OpenClaw y otros agentes de Inteligencia Artificial se disparan, y
  cómo solucionarlo con BM25 + recuperación de vectores (index1, QMD, Milvus) y
  memoria Markdown-first (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p>Si has pasado algún tiempo con <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (antes Clawdbot y Moltbot), ya sabes lo bueno que es este agente de IA. Es rápido, local, flexible y capaz de realizar flujos de trabajo sorprendentemente complejos a través de Slack, Discord, tu código base y prácticamente cualquier otra cosa a la que lo conectes. Pero una vez que empiezas a usarlo en serio, surge rápidamente un patrón: <strong>el uso de tokens empieza a aumentar.</strong></p>
<p>Esto no es culpa de OpenClaw en concreto, sino de cómo se comportan la mayoría de los agentes de IA hoy en día. Activan una llamada LLM para casi todo: buscar un archivo, planificar una tarea, escribir una nota, ejecutar una herramienta o hacer una pregunta de seguimiento. Y como los tokens son la moneda universal de estas llamadas, cada acción tiene un coste.</p>
<p>Para entender de dónde viene ese coste, tenemos que mirar bajo el capó a dos grandes contribuyentes:</p>
<ul>
<li><strong>La búsqueda:</strong> Las búsquedas mal construidas arrastran cargas de contexto desbordantes: archivos enteros, registros, mensajes y regiones de código que el modelo no necesitaba realmente.</li>
<li><strong>La memoria:</strong> El almacenamiento de información sin importancia obliga al agente a releerla y volver a procesarla en futuras llamadas, lo que agrava el uso de tokens a lo largo del tiempo.</li>
</ul>
<p>Ambos problemas aumentan silenciosamente los costes operativos sin mejorar la capacidad.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Cómo realizan las búsquedas los agentes de IA como OpenClaw, y por qué eso quema tokens<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando un agente necesita información de su base de código o biblioteca de documentos, normalmente hace el equivalente a un <strong>Ctrl+F</strong> en todo el proyecto. Se devuelven todas las líneas coincidentes, sin clasificar, filtrar ni priorizar. Claude Code implementa esto a través de una herramienta Grep dedicada basada en ripgrep. OpenClaw no tiene una herramienta de búsqueda de código base incorporada, pero su herramienta exec permite al modelo subyacente ejecutar cualquier comando, y las habilidades cargadas pueden guiar al agente para utilizar herramientas como rg. En ambos casos, la búsqueda en el código base devuelve coincidencias de palabras clave sin clasificar y sin filtrar.</p>
<p>Este enfoque de fuerza bruta funciona bien en proyectos pequeños. Pero a medida que los repositorios crecen, también lo hace el precio. Las coincidencias irrelevantes se amontonan en la ventana de contexto del LLM, obligando al modelo a leer y procesar miles de tokens que en realidad no necesita. Una sola búsqueda sin ámbito puede arrastrar archivos completos, enormes bloques de comentarios o registros que comparten una palabra clave pero no la intención subyacente. Si se repite este patrón durante una larga sesión de depuración o investigación, la sobrecarga se acumula rápidamente.</p>
<p>Tanto OpenClaw como Claude Code intentan gestionar este crecimiento. OpenClaw depura las salidas de herramientas sobredimensionadas y compacta los largos historiales de conversaciones, mientras que Claude Code limita la salida de lectura de archivos y soporta la compactación de contextos. Estas medidas funcionan, pero sólo después de que se haya ejecutado la consulta. Los resultados de búsqueda sin clasificar siguen consumiendo tokens, y usted sigue pagando por ellos. La gestión del contexto ayuda a los turnos futuros, no a la llamada original que generó el desperdicio.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Cómo funciona la memoria del agente de IA y por qué también cuesta tokens<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda no es la única fuente de sobrecarga de fichas. Cada fragmento de contexto que un agente recupera de la memoria también debe cargarse en la ventana de contexto del LLM, y eso también cuesta tokens.</p>
<p>Las APIs del LLM en las que confían la mayoría de los agentes son apátridas: La API de mensajes de Anthropic requiere el historial completo de conversaciones en cada petición, y la API de finalización de chat de OpenAI funciona del mismo modo. Incluso la nueva API de respuestas de OpenAI, que gestiona el estado de la conversación en el servidor, sigue exigiendo la ventana de contexto completa en cada llamada. La memoria cargada en el contexto cuesta tokens, independientemente de cómo llegue a él.</p>
<p>Para evitarlo, los marcos de agentes escriben notas en archivos de disco y vuelven a cargar las notas relevantes en la ventana de contexto cuando el agente las necesita. Por ejemplo, OpenClaw almacena notas curadas en MEMORY.md y añade registros diarios a archivos Markdown con marca de tiempo, luego los indexa con BM25 híbrido y búsqueda vectorial para que el agente pueda recuperar el contexto relevante bajo demanda.</p>
<p>El diseño de la memoria de OpenClaw funciona bien, pero requiere todo el ecosistema de OpenClaw: el proceso Gateway, las conexiones de la plataforma de mensajería y el resto de la pila. Lo mismo ocurre con la memoria de Claude Code, que está vinculada a su CLI. Si estás construyendo un agente personalizado fuera de estas plataformas, necesitas una solución independiente. La siguiente sección cubre las herramientas disponibles para ambos problemas.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Cómo evitar que OpenClaw consuma tokens<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Si quieres reducir la cantidad de tokens que consume OpenClaw, puedes utilizar dos palancas.</p>
<ul>
<li>La primera es <strong>mejorar la recuperación</strong>, sustituyendo los volcados de palabras clave al estilo grep por herramientas de búsqueda clasificadas y basadas en la relevancia, de modo que el modelo sólo vea la información que realmente importa.</li>
<li>La segunda es <strong>mejorar la memoria</strong>: pasar de un almacenamiento opaco y dependiente del marco de trabajo a algo que se pueda comprender, inspeccionar y controlar.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Sustituir grep por una mejor recuperación: index1, QMD y Milvus</h3><p>Muchos agentes de codificación de IA buscan en bases de código con grep o ripgrep. Claude Code tiene una herramienta Grep dedicada basada en ripgrep. OpenClaw no tiene una herramienta de búsqueda de bases de código incorporada, pero su herramienta exec permite al modelo subyacente ejecutar cualquier comando, y se pueden cargar habilidades como ripgrep o QMD para guiar cómo busca el agente. Sin una habilidad centrada en la recuperación, el agente recurre al enfoque que elija el modelo subyacente. El problema central es el mismo en todos los agentes: sin una recuperación clasificada, las coincidencias de palabras clave entran en la ventana contextual sin filtrar.</p>
<p>Esto funciona cuando un proyecto es lo suficientemente pequeño como para que todas las coincidencias quepan cómodamente en la ventana de contexto. El problema empieza cuando una base de código o una biblioteca de documentos crece hasta el punto de que una palabra clave devuelve docenas o cientos de resultados y el agente tiene que cargarlos todos en la ventana de contexto. A esa escala, se necesitan resultados ordenados por relevancia, no sólo filtrados por coincidencia.</p>
<p>La solución estándar es la búsqueda híbrida, que combina dos métodos de clasificación complementarios:</p>
<ul>
<li>BM25 puntúa cada resultado en función de la frecuencia y la singularidad con que aparece un término en un documento determinado. Un archivo específico que menciona "autenticación" 15 veces tiene una clasificación más alta que un archivo extenso que lo menciona una vez.</li>
<li>La búsqueda vectorial convierte el texto en representaciones numéricas del significado, de modo que "autenticación" puede coincidir con "flujo de inicio de sesión" o "gestión de sesión" aunque no compartan ninguna palabra clave.</li>
</ul>
<p>Ninguno de los dos métodos es suficiente por sí solo: El BM25 pasa por alto términos parafraseados, y la búsqueda vectorial, términos exactos como códigos de error. La combinación de ambos métodos y la fusión de las listas clasificadas mediante un algoritmo de fusión cubre ambas lagunas.</p>
<p>Las herramientas que se describen a continuación aplican este patrón a diferentes escalas. Grep es la base con la que todo el mundo empieza. index1, QMD y Milvus añaden cada una una búsqueda híbrida con capacidad creciente.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: búsqueda híbrida rápida en una sola máquina</h4><p><a href="https://github.com/gladego/index1">index1</a> es una herramienta CLI que empaqueta la búsqueda híbrida en un único archivo de base de datos SQLite. FTS5 se encarga de BM25, sqlite-vec de la similitud vectorial y RRF de fusionar las listas clasificadas. Las incrustaciones son generadas localmente por Ollama, por lo que nada sale de su máquina.</p>
<p>index1 divide el código por estructura, no por número de líneas: Los archivos Markdown se dividen por encabezados, los archivos Python por AST, JavaScript y TypeScript por patrones regex. Esto significa que los resultados de la búsqueda devuelven unidades coherentes, como una función completa o una sección completa de la documentación, y no intervalos arbitrarios de líneas que se cortan a mitad de bloque. El tiempo de respuesta es de 40 a 180 ms para consultas híbridas. Sin Ollama, se vuelve a BM25-only, que sigue clasificando los resultados en lugar de volcar todas las coincidencias en la ventana contextual.</p>
<p>index1 también incluye un módulo de memoria episódica para almacenar las lecciones aprendidas, las causas de los errores y las decisiones arquitectónicas. Estas memorias viven dentro de la misma base de datos SQLite que el índice de código, en lugar de como archivos independientes.</p>
<p>Nota: index1 es un proyecto en fase inicial (0 estrellas, 4 commits en febrero de 2026). Evalúelo con su propio código base antes de comprometerse.</p>
<ul>
<li><strong>Lo mejor para</strong>: desarrolladores en solitario o equipos pequeños con una base de código que quepa en una máquina, que busquen una mejora rápida sobre grep.</li>
<li><strong>Supéralo cuando</strong>: necesites acceso multiusuario al mismo índice, o tus datos excedan lo que un único archivo SQLite maneja cómodamente.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: mayor precisión gracias a la reclasificación LLM local</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), creado por el fundador de Shopify Tobi Lütke, añade una tercera etapa: La reclasificación LLM. Después de que BM25 y la búsqueda vectorial devuelvan candidatos, un modelo lingüístico local relee los primeros resultados y los reordena según su relevancia real para la consulta. De este modo se detectan los casos en que tanto las coincidencias de palabras clave como las semánticas arrojan resultados plausibles pero erróneos.</p>
<p>QMD se ejecuta íntegramente en su equipo y utiliza tres modelos GGUF que suman alrededor de 2 GB: un modelo de incrustación (embeddinggemma-300M), un reranker de codificación cruzada (Qwen3-Reranker-0.6B) y un modelo de expansión de consultas (qmd-query-expansion-1.7B). Los tres se descargan automáticamente en la primera ejecución. Sin llamadas a la API en la nube, sin claves API.</p>
<p>La contrapartida es el tiempo de arranque en frío: la carga de los tres modelos desde el disco tarda aproximadamente entre 15 y 16 segundos. QMD admite un modo de servidor persistente (qmd mcp) que mantiene los modelos en memoria entre solicitudes, eliminando la penalización por arranque en frío en caso de consultas repetidas.</p>
<ul>
<li><strong>Lo mejor para:</strong> entornos de privacidad crítica en los que ningún dato puede salir de su máquina y en los que la precisión de la recuperación es más importante que el tiempo de respuesta.</li>
<li><strong>Supérelo cuando:</strong> necesite respuestas por debajo del segundo, acceso compartido en equipo o su conjunto de datos supere la capacidad de una sola máquina.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: búsqueda híbrida a escala de equipo y de empresa</h4><p>Las herramientas monomáquina anteriores funcionan bien para desarrolladores individuales, pero alcanzan sus límites cuando varias personas o agentes necesitan acceder a la misma base de conocimientos. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> es una base de datos vectorial de código abierto creada para la siguiente fase: distribuida, multiusuario y capaz de gestionar miles de millones de vectores.</p>
<p>Su característica clave para este caso de uso es Sparse-BM25 incorporado, disponible desde Milvus 2.5 y significativamente más rápido en 2.6. Usted proporciona el texto en bruto, y Milvus lo tokeniza internamente utilizando un analizador construido sobre tantivy, luego convierte el resultado en vectores dispersos que son precalculados y almacenados en el momento del índice.</p>
<p>Como la representación BM25 ya está almacenada, la recuperación no necesita recalcular las puntuaciones sobre la marcha. Estos vectores dispersos conviven con los vectores densos (incrustaciones semánticas) en la misma colección. En el momento de la consulta, se fusionan ambas señales con un clasificador como RRFRanker, que Milvus proporciona de forma inmediata. El mismo patrón de búsqueda híbrida que index1 y QMD, pero ejecutado en una infraestructura que escala horizontalmente.</p>
<p>Milvus también proporciona capacidades que las herramientas de una sola máquina no pueden ofrecer: aislamiento multiusuario (bases de datos o colecciones separadas por equipo), replicación de datos con conmutación por error automática y agrupación de datos en caliente/frío para un almacenamiento rentable. Para los agentes, esto significa que varios desarrolladores o varias instancias de agentes pueden consultar la misma base de conocimientos de forma simultánea sin pisar los datos de los demás.</p>
<ul>
<li><strong>Lo mejor para</strong>: varios desarrolladores o agentes que comparten una base de conocimientos, conjuntos de documentos grandes o en rápido crecimiento, o entornos de producción que necesitan replicación, conmutación por error y control de acceso.</li>
</ul>
<p>En resumen:</p>
<table>
<thead>
<tr><th>Herramienta</th><th>Etapa</th><th>Despliegue</th><th>Señal de migración</th></tr>
</thead>
<tbody>
<tr><td>Claude Grep nativo</td><td>Creación de prototipos</td><td>Integrado, configuración cero</td><td>Las facturas suben o las consultas se ralentizan</td></tr>
<tr><td>índice1</td><td>Una sola máquina (velocidad)</td><td>SQLite local + Ollama</td><td>Necesidad de acceso multiusuario o los datos superan a una sola máquina</td></tr>
<tr><td>QMD</td><td>Una sola máquina (precisión)</td><td>Tres modelos GGUF locales</td><td>Necesidad de índices compartidos por el equipo</td></tr>
<tr><td>Milvus</td><td>Equipo o producción</td><td>Clúster distribuido</td><td>Grandes conjuntos de documentos o requisitos multiusuario</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Reducción de los costes de tokens del agente de IA proporcionándole memoria persistente y editable con memsearch</h3><p>La optimización de la búsqueda reduce el gasto de tokens por consulta, pero no ayuda con lo que el agente retiene entre sesiones.</p>
<p>Cada fragmento de contexto que un agente recupera de la memoria tiene que cargarse en el prompt, y eso también cuesta tokens. La cuestión no es si almacenar memoria, sino cómo. El método de almacenamiento determina si puedes ver lo que el agente recuerda, arreglarlo cuando está mal y llevártelo contigo si cambias de herramienta.</p>
<p>La mayoría de los frameworks fallan en los tres aspectos. Mem0 y Zep almacenan todo en una base de datos vectorial, que funciona para la recuperación, pero hace que la memoria:</p>
<ul>
<li><strong>Opaca.</strong> No se puede ver lo que el agente recuerda sin consultar una API.</li>
<li><strong>Difícil de editar.</strong> Corregir o eliminar una memoria implica llamadas a la API, no abrir un archivo.</li>
<li><strong>Bloqueada.</strong> Cambiar de entorno implica exportar, convertir y volver a importar los datos.</li>
</ul>
<p>OpenClaw adopta un enfoque diferente. Toda la memoria vive en archivos Markdown en el disco. El agente escribe registros diarios automáticamente, y los humanos pueden abrir y editar cualquier archivo de memoria directamente. Esto resuelve los tres problemas: la memoria es legible, editable y portátil por diseño.</p>
<p>La contrapartida es la sobrecarga de despliegue. Ejecutar la memoria de OpenClaw significa ejecutar todo el ecosistema de OpenClaw: el proceso Gateway, las conexiones de la plataforma de mensajería y el resto de la pila. Para los equipos que ya utilizan OpenClaw, está bien. Para todos los demás, la barrera es demasiado alta. <strong>memsearch</strong> se construyó para cerrar esta brecha: extrae el patrón de memoria Markdown-first de OpenClaw en una biblioteca independiente que funciona con cualquier agente.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, creada por Zilliz (el equipo detrás de Milvus), trata los archivos Markdown como la única fuente de verdad. Un MEMORY.md contiene hechos y decisiones a largo plazo que escribes a mano. Los registros diarios (2026-02-26.md) se generan automáticamente a partir de los resúmenes de sesión. El índice vectorial, almacenado en Milvus, es una capa derivada que puede reconstruirse a partir del Markdown en cualquier momento.</p>
<p>En la práctica, esto significa que puede abrir cualquier archivo de memsearch en un editor de texto, leer exactamente lo que sabe el agente y cambiarlo. Guarde el archivo, y el vigilante de archivos de memsearch detectará el cambio y lo reindexará automáticamente. Puede gestionar memorias con Git, revisar memorias generadas por la IA a través de pull requests, o trasladarse a una nueva máquina copiando una carpeta. Si se pierde el índice de Milvus, se reconstruye a partir de los archivos. Los archivos nunca corren peligro.</p>
<p>Bajo el capó, memsearch utiliza el mismo patrón de búsqueda híbrido descrito anteriormente: trozos divididos por la estructura de los encabezados y los límites de los párrafos, recuperación BM25 + vectorial, y un comando compacto impulsado por LLM que resume las memorias antiguas cuando los registros crecen.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lo mejor para: equipos que quieren una visibilidad completa de lo que recuerda el agente, necesitan un control de versiones sobre la memoria o quieren un sistema de memoria que no esté limitado a un único marco de agentes.</p>
<p>En resumen:</p>
<table>
<thead>
<tr><th>Capacidad</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Fuente de verdad</td><td>Base de datos vectorial (única fuente de datos)</td><td>Archivos Markdown (primarios) + Milvus (índice)</td></tr>
<tr><td>Transparencia</td><td>Caja negra, requiere API para inspeccionar</td><td>Abra cualquier archivo .md para leerlo</td></tr>
<tr><td>Editabilidad</td><td>Modificación mediante llamadas a la API</td><td>Edición directa en cualquier editor de texto, con reindexación automática</td></tr>
<tr><td>Control de versiones</td><td>Requiere un registro de auditoría independiente</td><td>Git funciona de forma nativa</td></tr>
<tr><td>Coste de migración</td><td>Exportar → convertir formato → reimportar</td><td>Copiar la carpeta Markdown</td></tr>
<tr><td>Colaboración entre humanos e IA</td><td>La IA escribe, los humanos observan</td><td>Los humanos pueden editar, complementar y revisar</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Qué configuración se adapta a tu escala<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Escenario</th><th>Búsqueda</th><th>Memoria</th><th>Cuándo avanzar</th></tr>
</thead>
<tbody>
<tr><td>Prototipo inicial</td><td>Grep (integrado)</td><td>-</td><td>Las facturas suben o las consultas se ralentizan</td></tr>
<tr><td>Desarrollador único, sólo búsqueda</td><td><a href="https://github.com/gladego/index1">index1</a> (velocidad) o <a href="https://github.com/tobi/qmd">QMD</a> (precisión)</td><td>-</td><td>Necesidad de acceso multiusuario o los datos superan a una sola máquina</td></tr>
<tr><td>Desarrollador único, ambos</td><td><a href="https://github.com/gladego/index1">índice1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Necesidad de acceso multiusuario o los datos superan una máquina</td></tr>
<tr><td>Equipo o producción, ambos</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>Integración rápida, sólo memoria</td><td>-</td><td>Mem0 o Zep</td><td>Necesidad de inspeccionar, editar o migrar memorias</td></tr>
</tbody>
</table>
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
    </button></h2><p>Los costes simbólicos que conllevan los agentes de IA siempre activos no son inevitables. Esta guía cubre dos áreas en las que una mejor herramienta puede reducir los residuos: búsqueda y memoria.</p>
<p>Grep funciona a pequeña escala, pero a medida que las bases de código crecen, las coincidencias de palabras clave no clasificadas inundan la ventana de contexto con contenido que el modelo nunca necesitó. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> y <a href="https://github.com/tobi/qmd"></a> QMD resuelven esto en una sola máquina combinando la puntuación de palabras clave BM25 con la búsqueda vectorial y devolviendo sólo los resultados más relevantes. Para equipos, configuraciones multiagente o cargas de trabajo de producción, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> proporciona el mismo patrón de búsqueda híbrida en una infraestructura que escala horizontalmente.</p>
<p>Para la memoria, la mayoría de los frameworks almacenan todo en una base de datos vectorial: opaca, difícil de editar a mano y bloqueada por el framework que la creó. <a href="https://github.com/zilliztech/memsearch">memsearch</a> adopta un enfoque diferente. La memoria vive en archivos Markdown que puedes leer, editar y controlar con Git. Milvus sirve como un índice derivado que puede reconstruirse a partir de esos archivos en cualquier momento. Tú mantienes el control de lo que sabe el agente.</p>
<p>Tanto <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> como <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Mil</a> vus son de código abierto. Estamos desarrollando activamente memsearch y nos encantaría recibir comentarios de cualquiera que lo utilice en producción. Abre una incidencia, envía un PR, o simplemente dinos qué funciona y qué no.</p>
<p>Proyectos mencionados en esta guía:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Memoria Markdown-first para agentes de IA, respaldada por Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Base de datos vectorial de código abierto para la búsqueda híbrida escalable.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: Búsqueda híbrida BM25 + vectorial para agentes de codificación de IA.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Búsqueda híbrida local con reordenación LLM.</li>
</ul>
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código abierto (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memoria persistente para código Claude: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de IA de código abierto</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial de OpenClaw: Conéctate a Slack para tener un asistente de IA local</a></li>
</ul>
