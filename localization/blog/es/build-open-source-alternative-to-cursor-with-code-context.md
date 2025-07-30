---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Construir una alternativa de código abierto a Cursor con Code Context
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context: un complemento de código abierto compatible con MCP que aporta
  una potente búsqueda semántica de código a cualquier agente de codificación de
  AI, Claude Code y Gemini CLI, IDEs como VSCode e incluso entornos como Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">El auge de la codificación de IA y su punto ciego<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Las herramientas de codificación de IA están por todas partes y se están volviendo virales por una buena razón. Desde <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code y Gemini CLI</a> hasta las alternativas de código abierto de Cursor, estos agentes pueden escribir funciones, explicar la dependencia del código y refactorizar archivos enteros con una sola instrucción. Los desarrolladores se apresuran a integrarlos en sus flujos de trabajo y, en muchos sentidos, están cumpliendo lo prometido.</p>
<p><strong>Pero cuando se trata de <em>entender el código base</em>, la mayoría de las herramientas de IA se topan con un muro.</strong></p>
<p>Pídele a Claude Code que busque "dónde este proyecto gestiona la autenticación de usuarios", y vuelve a <code translate="no">grep -r &quot;auth&quot;</code>-escupiendo 87 coincidencias vagamente relacionadas a través de comentarios, nombres de variables y nombres de archivos, probablemente omitiendo muchas funciones con lógica de autenticación pero no llamadas "auth". Prueba Gemini CLI, y buscará palabras clave como "login" o "password", omitiendo por completo funciones como <code translate="no">verifyCredentials()</code>. Estas herramientas son geniales para generar código, pero cuando llega el momento de navegar, depurar o explorar sistemas desconocidos, se vienen abajo. A menos que envíen toda la base de código al LLM para contextualizarla (quemando tokens y tiempo), tienen dificultades para proporcionar respuestas significativas.</p>
<p><em>Esa es la verdadera carencia de las herramientas de IA actuales:</em> <strong><em>el contexto del código.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor lo ha clavado, pero no para todos<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> aborda esto de frente. En lugar de buscar palabras clave, construye un mapa semántico de tu código base utilizando árboles de sintaxis, incrustaciones vectoriales y búsqueda consciente del código. Pregúntale "¿dónde está la lógica de validación del correo electrónico?" y te devolverá <code translate="no">isValidEmailFormat()</code>, no porque el nombre coincida, sino porque entiende lo que <em>hace</em> ese código.</p>
<p>Aunque Cursor es potente, puede que no sea adecuado para todo el mundo. <strong><em>Cursor es de código cerrado, alojado en la nube y basado en suscripción.</em></strong> Eso lo pone fuera del alcance de equipos que trabajan con código sensible, organizaciones preocupadas por la seguridad, desarrolladores independientes, estudiantes y cualquiera que prefiera sistemas abiertos.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">¿Y si pudieras construir tu propio cursor?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Aquí está la cosa: la tecnología central detrás de Cursor no es propietaria. Está construida sobre bases probadas de código abierto - bases de datos vectoriales como <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">modelos de incrustación</a>, analizadores sintácticos con Tree-sitter - todo disponible para cualquiera dispuesto a conectar los puntos.</p>
<p><em>Así que nos preguntamos:</em> <strong><em>¿Qué pasaría si cualquiera pudiera construir su propio Cursor?</em></strong> Se ejecuta en su infraestructura. Sin cuotas de suscripción. Totalmente personalizable. Control total sobre el código y los datos.</p>
<p>Por eso hemos creado <a href="https://github.com/zilliztech/code-context"><strong>Code Context, un</strong></a>complemento de código abierto compatible con MCP que aporta una potente búsqueda semántica de código a cualquier agente de codificación de AI, como Claude Code y Gemini CLI, IDEs como VSCode e incluso entornos como Google Chrome. También te da el poder de construir tu propio agente de codificación como Cursor desde cero, desbloqueando la navegación inteligente en tiempo real de tu base de código.</p>
<p><strong><em>Sin suscripciones. Sin cajas negras. Sólo inteligencia de código, a tu manera.</em></strong></p>
<p>En el resto de este artículo, veremos cómo funciona Code Context y cómo puedes empezar a usarlo hoy mismo.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Contexto de Código: Alternativa de código abierto a la inteligencia de Cursor<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> es un motor de búsqueda semántica de código abierto compatible con MCP. Tanto si está creando un asistente de codificación de IA personalizado desde cero como si está añadiendo conciencia semántica a agentes de codificación de IA como Claude Code y Gemini CLI, Code Context es el motor que lo hace posible.</p>
<p>Se ejecuta localmente, se integra con sus herramientas y entornos favoritos, como VS Code y los navegadores Chrome, y ofrece una sólida comprensión del código sin depender de plataformas de código cerrado que sólo funcionan en la nube.</p>
<p><strong>Entre sus funciones principales se incluyen:</strong></p>
<ul>
<li><p><strong>Búsqueda semántica de código mediante lenguaje natural:</strong> Encuentre código utilizando un lenguaje sencillo. Busque conceptos como "verificación de inicio de sesión de usuario" o "lógica de procesamiento de pagos", y Code Context localizará las funciones relevantes, incluso si no coinciden exactamente con las palabras clave.</p></li>
<li><p><strong>Soporte multilingüe:</strong> Busque sin problemas en más de 15 lenguajes de programación, incluidos JavaScript, Python, Java y Go, con una comprensión semántica coherente en todos ellos.</p></li>
<li><p><strong>Troceado de código basado en AST:</strong> El código se divide automáticamente en unidades lógicas, como funciones y clases, mediante el análisis sintáctico AST, lo que garantiza que los resultados de la búsqueda sean completos, significativos y nunca se interrumpan a mitad de la función.</p></li>
<li><p><strong>Indexación incremental en tiempo real:</strong> Los cambios en el código se indexan en tiempo real. A medida que se editan los archivos, el índice de búsqueda se mantiene actualizado, sin necesidad de actualizaciones manuales o reindexación.</p></li>
<li><p><strong>Despliegue totalmente local y seguro:</strong> Ejecute todo en su propia infraestructura. Code Context admite modelos locales a través de Ollama e indexación a través de <a href="https://milvus.io/">Milvus</a>, para que su código nunca salga de su entorno.</p></li>
<li><p><strong>Integración IDE de primera clase:</strong> La extensión VSCode le permite buscar y saltar a los resultados al instante, directamente desde su editor, sin necesidad de cambiar de contexto.</p></li>
<li><p><strong>Compatibilidad con el protocolo MCP:</strong> Code Context habla MCP, lo que facilita la integración con los asistentes de codificación de IA e introduce la búsqueda semántica directamente en sus flujos de trabajo.</p></li>
<li><p><strong>Compatibilidad con complementos de navegador:</strong> Busca en repositorios directamente desde GitHub en tu navegador, sin pestañas, sin copiar y pegar, solo contexto instantáneo donde sea que estés trabajando.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Cómo funciona Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context utiliza una arquitectura modular con un orquestador central y componentes especializados para la incrustación, el análisis sintáctico, el almacenamiento y la recuperación.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">El módulo central: Núcleo de Code Context</h3><p>El núcleo de Code Context es <strong>Code Context Core</strong>, que coordina el análisis sintáctico, la incrustación, el almacenamiento y la recuperación semántica del código:</p>
<ul>
<li><p><strong>El módulo de procesamiento de texto</strong> divide y analiza el código utilizando Tree-sitter para el análisis AST del lenguaje.</p></li>
<li><p>La<strong>interfaz de incrustación</strong> admite backends conectables -actualmente OpenAI y VoyageAI- que convierten trozos de código en incrustaciones vectoriales que capturan su significado semántico y sus relaciones contextuales.</p></li>
<li><p><strong>La interfaz de base de datos vectorial</strong> almacena estas incrustaciones en una instancia <a href="https://milvus.io/">Milvus</a> autoalojada (por defecto) o en <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, la versión gestionada de Milvus.</p></li>
</ul>
<p>Todo esto se sincroniza con su sistema de archivos de forma programada, asegurando que el índice se mantiene actualizado sin necesidad de intervención manual.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Módulos de extensión sobre el núcleo de Code Context</h3><ul>
<li><p><strong>Extensión VSCode</strong>: Perfecta integración con IDE para una rápida búsqueda semántica en el editor y salto a la definición.</p></li>
<li><p><strong>Extensión de Chrome</strong>: Búsqueda semántica de código en línea mientras se navega por los repositorios de GitHub, sin necesidad de cambiar de pestaña.</p></li>
<li><p><strong>Servidor MCP</strong>: Expone Code Context a cualquier asistente de codificación de IA a través del protocolo MCP, permitiendo asistencia en tiempo real y consciente del contexto.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Primeros pasos con Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context puede conectarse a herramientas de codificación que ya utilices o para crear un asistente de codificación de IA personalizado desde cero. En esta sección, recorreremos ambos escenarios:</p>
<ul>
<li><p>Cómo integrar Code Context con las herramientas existentes</p></li>
<li><p>Cómo configurar el módulo principal para la búsqueda semántica de código independiente cuando construyas tu propio asistente de codificación de IA.</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Integración MCP</h3><p>Code Context soporta <strong>el Protocolo de Contexto de Modelo (MCP)</strong>, permitiendo a los agentes de codificación de IA como Claude Code utilizarlo como backend semántico.</p>
<p>Para integrarse con Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez configurado, Claude Code llamará automáticamente a Code Context para la búsqueda semántica de código cuando sea necesario.</p>
<p>Para integrarlo con otras herramientas o entornos, consulta nuestro<a href="https://github.com/zilliztech/code-context"> repositorio de GitHub</a> para ver más ejemplos y adaptadores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Construir su propio asistente de codificación de IA con Code Context</h3><p>Para crear un asistente de IA personalizado utilizando Code Context, configure el módulo central para la búsqueda semántica de código en sólo tres pasos:</p>
<ol>
<li><p>Configure su modelo de incrustación</p></li>
<li><p>Conéctese a su base de datos vectorial</p></li>
<li><p>Indexe su proyecto y comience a buscar</p></li>
</ol>
<p>Aquí tienes un ejemplo usando <strong>OpenAI Embeddings</strong> y <strong>la base de datos de vectores</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> como backend de vectores:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Extensión VSCode</h3><p>Code Context está disponible como una extensión de VSCode llamada <strong>"Semantic Code Search",</strong> que aporta una búsqueda inteligente de código basada en lenguaje natural directamente en su editor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez instalada:</p>
<ul>
<li><p>Configure su clave API</p></li>
<li><p>Indexe su proyecto</p></li>
<li><p>Utilice consultas en inglés sencillo (no necesita coincidencias exactas)</p></li>
<li><p>Acceda a los resultados de forma instantánea haciendo clic para navegar.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esto convierte la exploración semántica en una parte nativa de su flujo de trabajo de codificación, sin necesidad de terminal o navegador.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Extensión de Chrome (próximamente)</h3><p>Nuestra próxima <strong>extensión de Chrome</strong> llevará Code Context a las páginas web de GitHub, permitiéndote ejecutar búsquedas semánticas de código directamente dentro de cualquier repositorio público, sin necesidad de cambiar de contexto o pestañas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Podrás explorar bases de código desconocidas con las mismas capacidades de búsqueda profunda que tienes localmente. Esté atento: la extensión está en desarrollo y se lanzará en breve.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">¿Por qué usar Code Context?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La configuración básica te permite trabajar rápidamente, pero donde <strong>Code Context</strong> realmente brilla es en entornos de desarrollo profesionales y de alto rendimiento. Sus características avanzadas están diseñadas para soportar flujos de trabajo serios, desde despliegues a escala empresarial hasta herramientas de IA personalizadas.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Despliegue privado para una seguridad de nivel empresarial</h3><p>Code Context admite el despliegue totalmente fuera de línea utilizando el modelo de incrustación local <strong>de Ollama</strong> y <strong>Milvus</strong> como base de datos vectorial autoalojada. Esto permite una canalización de búsqueda de código totalmente privada: sin llamadas API, sin transmisión por Internet y sin que ningún dato salga nunca de su entorno local.</p>
<p>Esta arquitectura es ideal para sectores con requisitos de cumplimiento estrictos, como el financiero, el gubernamental y el de defensa, en los que la confidencialidad del código no es negociable.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Indexación en tiempo real con sincronización inteligente de archivos</h3><p>Mantener actualizado su índice de código no debería ser lento ni manual. Code Context incluye un <strong>sistema de supervisión de archivos basado en Merkle Tree</strong> que detecta los cambios al instante y realiza actualizaciones incrementales en tiempo real.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_0fd958fe81.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Al reindexar únicamente los archivos modificados, reduce el tiempo de actualización de grandes repositorios de minutos a segundos. Esto garantiza que el código que acabas de escribir ya se puede buscar, sin necesidad de hacer clic en "actualizar".</p>
<p>En entornos de desarrollo de ritmo rápido, este tipo de inmediatez es fundamental.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">Análisis AST que entiende el código como usted</h3><p>Las herramientas tradicionales de búsqueda de código dividen el texto por línea o por número de caracteres, rompiendo a menudo las unidades lógicas y devolviendo resultados confusos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context lo hace mejor. Utiliza el análisis sintáctico AST Tree-sitter para comprender la estructura real del código. Identifica funciones, clases, interfaces y módulos completos, proporcionando resultados limpios y semánticamente completos.</p>
<p>Es compatible con los principales lenguajes de programación, incluidos JavaScript/TypeScript, Python, Java, C/C++, Go y Rust, con estrategias específicas de cada lenguaje para una fragmentación precisa. En el caso de los lenguajes no compatibles, se recurre al análisis sintáctico basado en reglas, lo que garantiza una gestión ágil sin fallos ni resultados vacíos.</p>
<p>Estas unidades de código estructurado también alimentan los metadatos para una búsqueda semántica más precisa.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Código abierto y extensible por diseño</h3><p>Code Context es completamente de código abierto bajo la licencia MIT. Todos los módulos principales están disponibles públicamente en GitHub.</p>
<p>Creemos que una infraestructura abierta es la clave para crear herramientas de desarrollo potentes y fiables, e invitamos a los desarrolladores a ampliarla para nuevos modelos, lenguajes o casos de uso.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Resolver el problema de la ventana contextual para los asistentes de IA</h3><p>Los grandes modelos lingüísticos (LLM) tienen un límite: su ventana de contexto. Esto les impide ver una base de código completa, lo que reduce la precisión de las finalizaciones, correcciones y sugerencias.</p>
<p>Code Context ayuda a salvar esa distancia. Su búsqueda semántica de código recupera las piezas <em>correctas</em> de código, proporcionando a su asistente de IA un contexto relevante y centrado con el que razonar. Mejora la calidad de los resultados generados por la IA al permitir que el modelo "se centre" en lo que realmente importa.</p>
<p>Las herramientas de codificación de IA más conocidas, como Claude Code y Gemini CLI, carecen de búsqueda semántica nativa de código, ya que se basan en heurísticas superficiales basadas en palabras clave. Code Context, cuando se integra a través de <strong>MCP</strong>, les proporciona una actualización cerebral.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Creado para desarrolladores, por desarrolladores</h3><p>Code Context está empaquetado para su reutilización modular: cada componente está disponible como un paquete <strong>npm</strong> independiente. Usted puede mezclar, combinar y ampliar según sea necesario para su proyecto.</p>
<ul>
<li><p>¿Sólo necesita una búsqueda semántica de código? Utilice<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>¿Quiere conectarse a un agente de IA? Añada <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>¿Estás construyendo tu propia herramienta IDE/navegador? Bifurca nuestros ejemplos de VSCode y extensión de Chrome</p></li>
</ul>
<p>Algunos ejemplos de aplicaciones del contexto del código:</p>
<ul>
<li><p><strong>Complementos de autocompletado contextual</strong> que extraen fragmentos relevantes para completar mejor el LLM.</p></li>
<li><p><strong>Detectores inteligentes de errores</strong> que recopilan el código circundante para mejorar las sugerencias de corrección.</p></li>
<li><p><strong>Herramientas de refactorización segura del código</strong> que encuentran automáticamente ubicaciones semánticamente relacionadas.</p></li>
<li><p><strong>Visualizadores de arquitectura</strong> que construyen diagramas a partir de las relaciones semánticas del código.</p></li>
<li><p><strong>Asistentes de revisión de código más inteligentes</strong> que muestran implementaciones históricas durante las revisiones de relaciones públicas.</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Bienvenido a unirse a nuestra comunidad<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> es algo más que una herramienta: es una plataforma para explorar cómo <strong>la IA y las bases de datos vectoriales</strong> pueden trabajar juntas para comprender realmente el código. A medida que el desarrollo asistido por IA se convierte en la norma, creemos que la búsqueda semántica de código será una capacidad fundamental.</p>
<p>Agradecemos todo tipo de contribuciones:</p>
<ul>
<li><p>Soporte para nuevos lenguajes</p></li>
<li><p>Nuevos modelos de incrustación</p></li>
<li><p>Flujos de trabajo innovadores asistidos por IA</p></li>
<li><p>Comentarios, informes de errores e ideas de diseño</p></li>
</ul>
<p>Encuéntrenos aquí:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context en GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>Paquete MCP npm</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>Mercado VSCode</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Juntos, podemos construir la infraestructura para la próxima generación de herramientas de desarrollo de IA: transparentes, potentes y orientadas al desarrollador.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
