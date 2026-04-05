---
id: claude-code-memory-memsearch.md
title: >-
  Hemos leído el código fuente filtrado de Claude Code. Así funciona realmente
  su memoria
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  El código fuente filtrado de Claude Code revela una memoria de 4 capas
  limitada a 200 líneas con búsqueda sólo grep. He aquí cómo funciona cada capa
  y qué arregla memsearch.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>El código fuente de Claude Code se hizo público por accidente. La versión 2.1.88 incluía un archivo de mapa fuente de 59,8 MB que debería haber sido eliminado de la compilación. Ese archivo contenía la base de código TypeScript completa y legible - 512.000 líneas, ahora reflejadas en GitHub.</p>
<p>El <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">sistema de memoria</a> nos llamó la atención. Claude Code es el agente de codificación de IA más popular del mercado, y la memoria es la parte con la que la mayoría de los usuarios interactúan sin entender cómo funciona bajo el capó. Así que nos pusimos manos a la obra.</p>
<p>La versión resumida: La memoria de Claude Code es más básica de lo que parece. Tiene un máximo de 200 líneas de notas. Sólo puede encontrar memorias por coincidencia de palabra clave exacta: si preguntas sobre "conflictos de puertos", pero la nota dice "mapeo docker-compose", no obtienes nada. Y nada de eso sale de Claude Code. Cambia a un agente diferente y empiezas de cero.</p>
<p>Aquí están las cuatro capas:</p>
<ul>
<li><strong>CLAUDE.md</strong> - un archivo que escribes tú mismo con reglas para que Claude las siga. Manual, estático y limitado por lo que se te ocurra escribir de antemano.</li>
<li><strong>Auto Memory</strong> - Claude toma sus propias notas durante las sesiones. Útil, pero limitado a un índice de 200 líneas sin búsqueda por significado.</li>
<li><strong>Sueño</strong> automático: un proceso de limpieza en segundo plano que consolida los recuerdos desordenados mientras estás inactivo. Ayuda con el desorden de hace días, pero no puede abarcar meses.</li>
<li><strong>KAIROS</strong> - un modo daemon siempre activo encontrado en el código filtrado. Aún no está en ninguna versión pública.</li>
</ul>
<p>A continuación, desglosamos cada capa, y luego cubrimos dónde se rompe la arquitectura y lo que construimos para hacer frente a las lagunas.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">¿Cómo funciona CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md es un archivo Markdown que se crea y se coloca en la carpeta del proyecto. Lo rellenas con lo que quieras que Claude recuerde: reglas de estilo de código, estructura del proyecto, comandos de prueba, pasos de despliegue. Claude lo carga al inicio de cada sesión.</p>
<p>Existen tres ámbitos: a nivel de proyecto (en la raíz del repositorio), personal (<code translate="no">~/.claude/CLAUDE.md</code>) y organizativo (configuración de la empresa). Los archivos más cortos se siguen con mayor fiabilidad.</p>
<p>El límite es obvio: CLAUDE.md sólo contiene cosas que escribiste por adelantado. Decisiones de depuración, preferencias que mencionaste en medio de la conversación, casos extremos que descubristeis juntos - nada de eso se captura a menos que te detengas y lo añadas manualmente. La mayoría de la gente no lo hace.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">¿Cómo funciona Auto Memory?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory captura lo que surge durante el trabajo. Claude decide qué vale la pena guardar y lo escribe en una carpeta de memoria en tu máquina, organizada en cuatro categorías: usuario (rol y preferencias), feedback (tus correcciones), proyecto (decisiones y contexto) y referencia (dónde viven las cosas).</p>
<p>Cada nota es un archivo Markdown independiente. El punto de entrada es <code translate="no">MEMORY.md</code> - un índice donde cada línea es una etiqueta corta (menos de 150 caracteres) que apunta a un archivo detallado. Claude lee el índice y extrae archivos específicos cuando le parecen relevantes.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>Las primeras 200 líneas de MEMORY.md se cargan en cada sesión. Todo lo demás es invisible.</p>
<p>Una elección de diseño inteligente: el indicador del sistema filtrado le dice a Claude que trate su propia memoria como una sugerencia, no como un hecho. Comprueba el código real antes de actuar sobre lo recordado, lo que ayuda a reducir las alucinaciones, un patrón que otros <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">marcos de agentes de IA</a> están empezando a adoptar.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">¿Cómo consolida Auto Dream los recuerdos antiguos?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory captura notas, pero después de semanas de uso esas notas se vuelven obsoletas. Una entrada que dice "error de despliegue de ayer" pierde sentido una semana después. Una nota dice que usas PostgreSQL; otra más reciente dice que migraste a MySQL. Los archivos borrados siguen teniendo entradas en la memoria. El índice se llena de contradicciones y referencias obsoletas.</p>
<p>Auto Dream es el proceso de limpieza. Se ejecuta en segundo plano y:</p>
<ul>
<li>Sustituye las referencias temporales vagas por fechas exactas. "Problema de despliegue de ayer" → "Problema de despliegue del 2026-03-28".</li>
<li>Resuelve las contradicciones. Nota PostgreSQL + nota MySQL → mantiene la verdad actual.</li>
<li>Elimina las entradas obsoletas. Las notas que hacen referencia a archivos borrados o tareas completadas se eliminan.</li>
<li>Mantiene <code translate="no">MEMORY.md</code> por debajo de 200 líneas.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Condiciones de activación:</strong> más de 24 horas desde la última limpieza Y al menos 5 sesiones nuevas acumuladas. También puede escribir "dream" para ejecutarlo manualmente. El proceso se ejecuta en un sub-agente de fondo - como el sueño real, no interrumpirá su trabajo activo.</p>
<p>El aviso del sistema del agente de sueño comienza con: <em>"Estás realizando un sueño - una pasada reflexiva sobre tus archivos de memoria".</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">¿Qué es KAIROS? El inédito modo siempre activo de Claude Code<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>Las tres primeras capas están activas o en desarrollo. El código filtrado también contiene algo que no se ha enviado: KAIROS.</p>
<p>KAIROS, que aparentemente debe su nombre a la palabra griega que significa "el momento adecuado", aparece más de 150 veces en el código fuente. Con él, Claude Code dejaría de ser una herramienta de uso activo para convertirse en un asistente en segundo plano que vigila tu proyecto continuamente.</p>
<p>Según el código filtrado, KAIROS:</p>
<ul>
<li>Lleva un registro de observaciones, decisiones y acciones a lo largo del día.</li>
<li>Se controla con un temporizador. A intervalos regulares, recibe una señal y decide: actuar o quedarse quieto.</li>
<li>No se interpone en tu camino. Cualquier acción que te bloquee durante más de 15 segundos se aplaza.</li>
<li>Ejecuta internamente la limpieza de sueños, además de un bucle completo de observar-pensar-actuar en segundo plano.</li>
<li>Tiene herramientas exclusivas que Claude Code no tiene: te envía archivos, notificaciones, monitoriza tus solicitudes de GitHub.</li>
</ul>
<p>KAIROS está detrás de una bandera de características en tiempo de compilación. No está en ninguna compilación pública. Piense en ello como Anthropic explorando lo que sucede cuando <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">la memoria del agente</a> deja de ser sesión por sesión y se convierte en permanente.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">¿Dónde se rompe la arquitectura de memoria de Claude Code?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria de Claude Code funciona de verdad. Pero cinco limitaciones estructurales restringen lo que puede manejar a medida que crecen los proyectos.</p>
<table>
<thead>
<tr><th>Limitación</th><th>Qué ocurre</th></tr>
</thead>
<tbody>
<tr><td><strong>Límite de índice de 200 líneas</strong></td><td><code translate="no">MEMORY.md</code> contiene ~25 KB. Si un proyecto se ejecuta durante meses, las entradas antiguas son desplazadas por las nuevas. "¿Qué configuración de Redis acordamos la semana pasada?" - Desaparecido.</td></tr>
<tr><td><strong>Recuperación sólo Grep</strong></td><td>La búsqueda en memoria utiliza <a href="https://milvus.io/docs/full-text-search.md">la concordancia</a> literal <a href="https://milvus.io/docs/full-text-search.md">de palabras clave</a>. Recuerdas "deploy-time port conflicts", pero la nota dice "docker-compose port mapping". Grep no puede llenar ese vacío.</td></tr>
<tr><td><strong>Sólo resúmenes, sin razonamientos</strong></td><td>Auto Memory guarda notas de alto nivel, pero no los pasos de depuración o el razonamiento que le llevó hasta allí. Se pierde el <em>cómo</em>.</td></tr>
<tr><td><strong>La complejidad se apila sin arreglar los cimientos</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Cada capa existe porque la anterior no fue suficiente. Pero ninguna cantidad de capas cambia lo que hay debajo: una herramienta, archivos locales, captura sesión a sesión.</td></tr>
<tr><td><strong>La memoria está encerrada en Claude Code</strong></td><td>Cambie a OpenCode, Codex CLI o cualquier otro agente y empezará de cero. Sin exportación, sin formato compartido, sin portabilidad.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Estos no son errores. Son los límites naturales de la arquitectura de herramienta única y archivo local. Cada mes aparecen nuevos agentes, los flujos de trabajo cambian, pero el conocimiento que has acumulado en un proyecto no debería desaparecer con ellos. Por eso hemos creado <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">¿Qué es memsearch? Memoria persistente para cualquier agente de codificación de IA<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> extrae la memoria del agente y la coloca en su propia capa. Los agentes van y vienen. La memoria permanece.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Cómo instalar memsearch</h3><p>Los usuarios de Claude Code lo instalan desde el marketplace:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Hecho. No necesita configuración.</p>
<p>Otras plataformas son igual de sencillas. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. API Python a través de uv o pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">¿Qué captura memsearch?</h3><p>Una vez instalado, memsearch se engancha al ciclo de vida del agente. Cada conversación se resume e indexa automáticamente. Cuando haces una pregunta que necesita historial, memsearch se dispara por sí mismo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los archivos de memoria se almacenan como Markdown fechado - un archivo por día:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Puedes abrir, leer y editar los archivos de memoria en cualquier editor de texto. Si quieres migrar, copias la carpeta. Si quieres control de versiones, git funciona de forma nativa.</p>
<p>El <a href="https://milvus.io/docs/index-explained.md">índice vectorial</a> almacenado en <a href="https://milvus.io/docs/overview.md">Milvus</a> es una capa de caché: si alguna vez se pierde, lo reconstruyes a partir de los archivos Markdown. Tus datos viven en los archivos, no en el índice.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">¿Cómo encuentra memsearch las memorias? Búsqueda semántica vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>La recuperación de memoria de Claude Code utiliza grep: búsqueda literal de palabras clave. Eso funciona cuando tienes unas pocas docenas de notas, pero se rompe después de meses de historia cuando no puedes recordar la redacción exacta.</p>
<p>En su lugar, memsearch utiliza <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">la búsqueda híbrida</a>. <a href="https://zilliz.com/glossary/semantic-search">Los vectores semánticos</a> encuentran contenido relacionado con tu consulta incluso cuando la redacción es diferente, mientras que BM25 coincide con las palabras clave exactas. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> fusiona y clasifica ambos conjuntos de resultados.</p>
<p>Digamos que preguntas "¿Cómo solucionamos el tiempo de espera de Redis la semana pasada?". - La búsqueda semántica entiende la intención y la encuentra. Digamos que usted pregunta &quot;buscar <code translate="no">handleTimeout</code>&quot; - BM25 encuentra el nombre exacto de la función. Las dos vías se cubren mutuamente los puntos ciegos.</p>
<p>Cuando se activa la recuperación, el subagente busca en tres etapas, profundizando sólo cuando es necesario:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Búsqueda semántica - Previsualizaciones breves</h3><p>El subagente consulta el índice Milvus en <code translate="no">memsearch search</code> y extrae los resultados más relevantes:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Cada resultado muestra una puntuación de relevancia, el archivo de origen y una vista previa de 200 caracteres. La mayoría de las consultas se detienen aquí.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Contexto completo - Ampliar un resultado específico</h3><p>Si la vista previa de L1 no es suficiente, el subagente ejecuta <code translate="no">memsearch expand a3f8c1</code> para extraer la entrada completa:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Transcripción de la conversación sin procesar</h3><p>En casos excepcionales en los que necesites ver exactamente lo que se ha dicho, el subagente extrae la conversación original:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>La transcripción lo conserva todo: tus palabras exactas, la respuesta exacta del agente y todas las herramientas de llamada. El subagente decide hasta dónde profundizar y devuelve los resultados organizados a la sesión principal.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">¿Cómo comparte memsearch la memoria entre los agentes de codificación de IA?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta es la brecha más fundamental entre memsearch y la memoria de Claude Code.</p>
<p>La memoria de Claude Code está encerrada en una sola herramienta. Si utiliza OpenCode, OpenClaw o Codex CLI, empezará desde cero. MEMORY.md es local, ligado a un usuario y a un agente.</p>
<p>memsearch soporta cuatro agentes de codificación: Claude Code, OpenClaw, OpenCode y Codex CLI. Comparten el mismo formato de memoria Markdown y la misma <a href="https://milvus.io/docs/manage-collections.md">colección Milvus</a>. Las memorias escritas desde cualquier agente se pueden buscar desde cualquier otro agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dos escenarios reales:</strong></p>
<p><strong>Cambio de herramientas.</strong> Te pasas una tarde en Claude Code resolviendo el proceso de despliegue y te encuentras con varios problemas. Las conversaciones se resumen e indexan automáticamente. Al día siguiente cambias a OpenCode y preguntas "¿cómo resolvimos ayer ese conflicto de puertos?". OpenCode busca en memsearch, encuentra los recuerdos de Claude Code de ayer y te da la respuesta correcta.</p>
<p><strong>Colaboración en equipo.</strong> Apunte el backend Milvus a <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> y múltiples desarrolladores en diferentes máquinas, utilizando diferentes agentes, leen y escriben la misma memoria de proyecto. Un nuevo miembro del equipo se une y no necesita escarbar en meses de Slack y documentos - el agente ya lo sabe.</p>
<h2 id="Developer-API" class="common-anchor-header">API para desarrolladores<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Si estás construyendo tu propia <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">herramienta de agente</a>, memsearch proporciona una CLI y Python API.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>API Python:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Bajo el capó, Milvus maneja la búsqueda vectorial. Ejecute localmente con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (configuración cero), colabore a través de <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (nivel gratuito disponible), o autoaloje con Docker. <a href="https://milvus.io/docs/embeddings.md">Embeddings</a> por defecto a ONNX - se ejecuta en la CPU, no se necesita GPU. Cambia a OpenAI u Ollama en cualquier momento.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch: Comparación completa<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>Característica</th><th>Memoria de Claude Code</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Qué se guarda</td><td>Lo que Claude considera importante</td><td>Cada conversación, auto-resumida</td></tr>
<tr><td>Límite de almacenamiento</td><td>Índice de ~200 líneas (~25 KB)</td><td>Ilimitado (archivos diarios + índice vectorial)</td></tr>
<tr><td>Búsqueda de recuerdos antiguos</td><td>Concordancia de palabras clave Grep</td><td>Búsqueda híbrida basada en significados + palabras clave (Milvus)</td></tr>
<tr><td>¿Puede leerlas?</td><td>Comprobar manualmente la carpeta de memorias</td><td>Abrir cualquier archivo .md</td></tr>
<tr><td>¿Puede editarlos?</td><td>Edite los archivos a mano</td><td>Igual - auto reindexa al guardar</td></tr>
<tr><td>Control de versiones</td><td>No está diseñado para ello</td><td>git funciona de forma nativa</td></tr>
<tr><td>Compatibilidad entre herramientas</td><td>Sólo Claude Code</td><td>4 agentes, memoria compartida</td></tr>
<tr><td>Memoria a largo plazo</td><td>Se degrada al cabo de semanas</td><td>Persistente durante meses</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Empezar con memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria de Claude Code tiene verdaderos puntos fuertes: el diseño autoescéptico, el concepto de consolidación de sueños y el presupuesto de bloqueo de 15 segundos en KAIROS. Anthropic está pensando mucho en este problema.</p>
<p>Pero la memoria de una sola herramienta tiene un techo. Una vez que el flujo de trabajo abarca varios agentes, varias personas o más de unas pocas semanas de historia, se necesita una memoria que exista por sí misma.</p>
<ul>
<li>Prueba <a href="https://github.com/zilliztech/memsearch">memsearch</a> - código abierto, con licencia MIT. Se instala en Claude Code con dos comandos.</li>
<li>Lee <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">cómo funciona memsearch bajo el capó</a> o la <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">guía de plugins</a> de <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code</a>.</li>
<li>¿Tienes preguntas? Únete a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad Milvus Discord</a> o <a href="https://milvus.io/office-hours">reserva una sesión gratuita de Office Hours</a> para ver tu caso de uso.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas más frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">¿Cómo funciona el sistema de memoria de Claude Code?</h3><p>Claude Code utiliza una arquitectura de memoria de cuatro capas, todas almacenadas como archivos Markdown locales. CLAUDE.md es un archivo de reglas estáticas que usted escribe manualmente. Auto Memory permite a Claude guardar sus propias notas durante las sesiones, organizadas en cuatro categorías: preferencias del usuario, feedback, contexto del proyecto y punteros de referencia. Auto Dream consolida las memorias obsoletas en segundo plano. KAIROS es un demonio inédito siempre activo que se encuentra en el código fuente filtrado. Todo el sistema está limitado a un índice de 200 líneas y sólo se puede buscar por coincidencia exacta de palabras clave, sin búsqueda semántica ni recuperación basada en el significado.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">¿Pueden los agentes de codificación de IA compartir memoria entre distintas herramientas?</h3><p>No de forma nativa. La memoria de Claude Code está bloqueada en Claude Code: no hay formato de exportación ni protocolo entre agentes. Si cambias a OpenCode, Codex CLI u OpenClaw, empiezas desde cero. memsearch soluciona esto almacenando memorias como archivos Markdown fechados e indexados en una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> (Milvus). Los cuatro agentes compatibles leen y escriben en el mismo almacén de memoria, por lo que el contexto se transfiere automáticamente al cambiar de herramienta.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">¿Cuál es la diferencia entre la búsqueda por palabra clave y la búsqueda semántica en la memoria del agente?</h3><p>La búsqueda por palabra clave (grep) coincide con cadenas exactas - si tu memoria dice "docker-compose port mapping" pero buscas "port conflicts", no devuelve nada. La búsqueda semántica convierte el texto en <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones vectoriales</a> que captan el significado, de modo que los conceptos relacionados coinciden incluso con una redacción diferente. memsearch combina ambos enfoques con una búsqueda híbrida, que ofrece una recuperación basada en el significado y una precisión exacta de las palabras clave en una única consulta.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">¿Qué se filtró en el incidente del código fuente de Claude Code?</h3><p>La versión 2.1.88 de Claude Code se distribuyó con un archivo de mapa de código fuente de 59,8 MB que debería haberse eliminado de la versión de producción. El archivo contenía la base de código TypeScript completa y legible -aproximadamente 512.000 líneas-, incluida la implementación completa del sistema de memoria, el proceso de consolidación Auto Dream y referencias a KAIROS, un modo de agente siempre activo que aún no se ha publicado. El código se replicó rápidamente en GitHub antes de que pudiera ser retirado.</p>
