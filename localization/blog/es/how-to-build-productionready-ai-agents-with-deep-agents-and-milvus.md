---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: Cómo crear agentes de IA listos para la producción con Deep Agents y Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Aprenda a crear agentes de IA escalables utilizando Deep Agents y Milvus para
  tareas de larga duración, menores costes de token y memoria persistente.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Cada vez más equipos crean agentes de IA, y las tareas que les asignan son cada vez más complejas. Muchos flujos de trabajo del mundo real implican trabajos de larga duración con múltiples pasos y muchas llamadas a herramientas. A medida que estas tareas crecen, aparecen rápidamente dos problemas: el aumento de los costes de los tokens y los límites de la ventana contextual del modelo. Los agentes también necesitan a menudo recordar información entre sesiones, como resultados de investigaciones anteriores, preferencias del usuario o conversaciones previas.</p>
<p>Marcos como <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, lanzado por LangChain, ayudan a organizar estos flujos de trabajo. Proporciona una forma estructurada de ejecutar agentes, con soporte para la planificación de tareas, el acceso a archivos y la delegación de subagentes. Esto facilita la creación de agentes capaces de gestionar tareas largas y de varios pasos de forma más fiable.</p>
<p>Pero los flujos de trabajo no bastan por sí solos. Los agentes también necesitan <strong>memoria a largo plazo</strong> para poder recuperar información útil de sesiones anteriores. Aquí es donde entra <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de código abierto. Al almacenar incrustaciones de conversaciones, documentos y resultados de herramientas, Milvus permite a los agentes buscar y recuperar conocimientos anteriores.</p>
<p>En este artículo, explicaremos cómo funciona Deep Agents y mostraremos cómo combinarlo con Milvus para construir agentes de IA con flujos de trabajo estructurados y memoria a largo plazo.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">¿Qué es Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> es un marco de agentes de código abierto construido por el equipo LangChain. Está diseñado para ayudar a los agentes a gestionar tareas de larga duración y múltiples pasos de forma más fiable. Se centra en tres capacidades principales:</p>
<p><strong>1. Planificación de tareas</strong></p>
<p>Deep Agents incluye herramientas integradas como <code translate="no">write_todos</code> y <code translate="no">read_todos</code>. El agente divide una tarea compleja en una lista clara de tareas pendientes y, a continuación, trabaja paso a paso en cada elemento, marcando las tareas como completadas.</p>
<p><strong>2. Acceso al sistema de archivos</strong></p>
<p>Proporciona herramientas como <code translate="no">ls</code>, <code translate="no">read_file</code>, y <code translate="no">write_file</code>, para que el agente pueda ver, leer y escribir archivos. Si una herramienta produce una salida grande, el resultado se guarda automáticamente en un archivo en lugar de permanecer en la ventana de contexto del modelo. Esto ayuda a evitar que la ventana de contexto se llene.</p>
<p><strong>3. Delegación de subagentes</strong></p>
<p>Mediante una herramienta <code translate="no">task</code>, el agente principal puede delegar subtareas a subagentes especializados. Cada sub-agente tiene su propia ventana de contexto y herramientas, lo que ayuda a mantener el trabajo organizado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Técnicamente, un agente creado con <code translate="no">create_deep_agent</code> es un <strong>LangGraph StateGraph</strong> compilado. (LangGraph es la biblioteca de flujo de trabajo desarrollada por el equipo de LangChain, y StateGraph es su estructura de estado central). Gracias a esto, los Agentes Profundos pueden utilizar directamente las características de LangGraph, como el streaming de salida, el checkpointing y la interacción human-in-the-loop.</p>
<p><strong>¿Qué hace que los Agentes Profundos sean útiles en la práctica?</strong></p>
<p>Las tareas de agentes de larga duración suelen enfrentarse a problemas como límites de contexto, altos costes de tokens y ejecución poco fiable. Los Deep Agents ayudan a resolver estos problemas haciendo que los flujos de trabajo de los agentes sean más estructurados y fáciles de gestionar. Al reducir el crecimiento innecesario del contexto, disminuye el uso de tokens y hace que las tareas de larga duración sean más rentables.</p>
<p>También facilita la organización de tareas complejas de varios pasos. Las subtareas pueden ejecutarse de forma independiente sin interferir entre sí, lo que mejora la fiabilidad. Al mismo tiempo, el sistema es flexible, lo que permite a los desarrolladores personalizarlo y ampliarlo a medida que sus agentes pasan de ser simples experimentos a aplicaciones de producción.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Personalización en agentes profundos<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un marco general no puede cubrir todas las necesidades industriales o empresariales. Deep Agents está diseñado para ser flexible, de modo que los desarrolladores puedan ajustarlo a sus propios casos de uso.</p>
<p>Con la personalización, puede:</p>
<ul>
<li><p>Conectar sus propias herramientas internas y API</p></li>
<li><p>Definir flujos de trabajo específicos del sector</p></li>
<li><p>Asegurarse de que el agente sigue las reglas de negocio</p></li>
<li><p>Apoyar la memoria y el intercambio de conocimientos entre sesiones</p></li>
</ul>
<p>Estas son las principales formas de personalizar los Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Personalización del indicador del sistema</h3><p>Puede añadir su propia instrucción del sistema a las instrucciones por defecto proporcionadas por el middleware. Esto es útil para definir reglas de dominio y flujos de trabajo.</p>
<p>Un buen prompt personalizado puede incluir:</p>
<ul>
<li><strong>Reglas de flujo de trabajo de dominio</strong></li>
</ul>
<p>Ejemplo "Para tareas de análisis de datos, ejecute siempre un análisis exploratorio antes de construir un modelo".</p>
<ul>
<li><strong>Ejemplos específicos</strong></li>
</ul>
<p>Ejemplo: "Combinar solicitudes de búsqueda bibliográfica similares en un solo elemento de tareas".</p>
<ul>
<li><strong>Reglas de detención</strong></li>
</ul>
<p>Ejemplo: "Parar si se utilizan más de 100 llamadas a herramientas".</p>
<ul>
<li><strong>Guía de coordinación de herramientas</strong></li>
</ul>
<p>Ejemplo: "Utilice <code translate="no">grep</code> para encontrar ubicaciones de código y, a continuación, utilice <code translate="no">read_file</code> para ver los detalles".</p>
<p>Evite repetir instrucciones que el middleware ya gestiona y evite añadir reglas que entren en conflicto con el comportamiento por defecto.</p>
<h3 id="Tools" class="common-anchor-header">Herramientas</h3><p>Puedes añadir tus propias herramientas al conjunto de herramientas incorporadas. Las herramientas se definen como funciones normales de Python, y sus docstrings describen lo que hacen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents también soporta herramientas que siguen el estándar Model Context Protocol (MCP) a través de <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>Puedes escribir middleware personalizado para</p>
<ul>
<li><p>Añadir o modificar herramientas</p></li>
<li><p>Ajustar avisos</p></li>
<li><p>Engancharse a diferentes etapas de la ejecución del agente</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents también incluye middleware integrado para la planificación, la gestión de subagentes y el control de la ejecución.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Función</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Proporciona herramientas write_todos y read_todos para gestionar listas de tareas</td></tr>
<tr><td>Middleware de sistema de archivos</td><td>Proporciona herramientas de operación de archivos y guarda automáticamente los resultados de herramientas grandes</td></tr>
<tr><td>SubAgentMiddleware</td><td>Proporciona la herramienta de tareas para delegar trabajo a subagentes</td></tr>
<tr><td>SummarizationMiddleware</td><td>Resume automáticamente cuando el contexto supera los 170k tokens</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Habilita el almacenamiento en caché de avisos para modelos antrópicos</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Corrige las llamadas incompletas a herramientas causadas por interrupciones</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Configura herramientas que requieren aprobación humana</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Subagentes</h3><p>El agente principal puede delegar subtareas en subagentes utilizando la herramienta <code translate="no">task</code>. Cada subagente se ejecuta en su propia ventana contextual y dispone de sus propias herramientas e indicador de sistema.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Para casos de uso avanzados, puede incluso pasar un flujo de trabajo LangGraph pre-construido como sub-agente.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Control de aprobación humana)</h3><p>Puede especificar ciertas herramientas que requieren aprobación humana usando el parámetro <code translate="no">interrupt_on</code>. Cuando el agente llama a una de estas herramientas, la ejecución se pausa hasta que una persona la revisa y aprueba.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Personalización del Backend (Almacenamiento)</h3><p>Puede elegir diferentes backends de almacenamiento para controlar cómo se gestionan los archivos. Las opciones actuales incluyen:</p>
<ul>
<li><p><strong>StateBackend</strong> (almacenamiento temporal)</p></li>
<li><p><strong>FilesystemBackend</strong> (almacenamiento en disco local)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Al cambiar el backend, puede ajustar el comportamiento del almacenamiento de archivos sin cambiar el diseño general del sistema.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">¿Por qué utilizar agentes profundos con Milvus para agentes de IA?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>En aplicaciones reales, los agentes a menudo necesitan memoria que dure a través de las sesiones. Por ejemplo, pueden necesitar recordar las preferencias del usuario, construir conocimiento del dominio a lo largo del tiempo, registrar la retroalimentación para ajustar el comportamiento, o realizar un seguimiento de las tareas de investigación a largo plazo.</p>
<p>Por defecto, Deep Agents utiliza <code translate="no">StateBackend</code>, que sólo almacena datos durante una única sesión. Cuando finaliza la sesión, todo se borra. Esto significa que no admite memoria a largo plazo entre sesiones.</p>
<p>Para habilitar la memoria persistente, utilizamos <a href="https://milvus.io/"><strong>Milvus</strong></a> como base de datos vectorial junto con <code translate="no">StoreBackend</code>. Así es como funciona: el contenido importante de las conversaciones y los resultados de las herramientas se convierten en embeddings (vectores numéricos que representan el significado) y se almacenan en Milvus. Cuando se inicia una nueva tarea, el agente realiza una búsqueda semántica para recuperar recuerdos pasados relacionados. Esto permite al agente "recordar" información relevante de sesiones anteriores.</p>
<p>Milvus se adapta bien a este caso de uso gracias a su arquitectura de separación de cálculo y almacenamiento. Soporta:</p>
<ul>
<li><p>Escalado horizontal a decenas de miles de millones de vectores</p></li>
<li><p>Consultas de alta concurrencia</p></li>
<li><p>Actualizaciones de datos en tiempo real</p></li>
<li><p>Despliegue listo para la producción de sistemas a gran escala</p></li>
</ul>
<p>Técnicamente, Deep Agents utiliza <code translate="no">CompositeBackend</code> para enrutar diferentes rutas a diferentes backends de almacenamiento:</p>
<table>
<thead>
<tr><th>Ruta</th><th>Backend</th><th>Propósito</th></tr>
</thead>
<tbody>
<tr><td>/espacio de trabajo/, /temp/</td><td>EstadoBackend</td><td>Datos temporales, borrados después de la sesión</td></tr>
<tr><td>/memorias/, /conocimiento/</td><td>StoreBackend + Milvus</td><td>Datos persistentes, consultables en todas las sesiones</td></tr>
</tbody>
</table>
<p>Con esta configuración, los desarrolladores sólo necesitan guardar los datos a largo plazo en rutas como <code translate="no">/memories/</code>. El sistema gestiona automáticamente la memoria entre sesiones. En la sección siguiente se detallan los pasos de configuración.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Práctica: Construir un agente de IA con memoria a largo plazo utilizando Milvus y Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Este ejemplo muestra cómo dotar a un agente basado en DeepAgents de memoria persistente utilizando Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Paso 1: Instalar dependencias</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Paso 2: Configurar el backend de memoria</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Paso 3: Crear el agente</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Puntos clave</strong></p>
<ul>
<li><strong>Ruta persistente</strong></li>
</ul>
<p>Todos los archivos guardados en <code translate="no">/memories/</code> se almacenarán de forma permanente y se podrá acceder a ellos en diferentes sesiones.</p>
<ul>
<li><strong>Configuración de producción</strong></li>
</ul>
<p>El ejemplo utiliza <code translate="no">InMemoryStore()</code> para las pruebas. En producción, sustitúyalo por un adaptador Milvus para permitir la búsqueda semántica escalable.</p>
<ul>
<li><strong>Memoria automática</strong></li>
</ul>
<p>El agente guarda automáticamente los resultados de la búsqueda y los resultados importantes en la carpeta <code translate="no">/memories/</code>. En tareas posteriores, puede buscar y recuperar información anterior relevante.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Visión general de las herramientas integradas<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents incluye varias herramientas integradas, proporcionadas a través de middleware. Se dividen en tres grupos principales:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Gestión de tareas (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Crea una lista estructurada de tareas pendientes. Cada tarea puede incluir una descripción, prioridad y dependencias.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Muestra la lista actual de tareas, incluidas las completadas y las pendientes.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Herramientas del sistema de archivos (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Lista los archivos de un directorio. Debe utilizar una ruta absoluta (empezando por <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Lee el contenido de los archivos. Admite <code translate="no">offset</code> y <code translate="no">limit</code> para archivos de gran tamaño.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Crea o sobrescribe un archivo.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Reemplaza texto específico dentro de un archivo.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Busca archivos utilizando patrones, como <code translate="no">**/*.py</code> para buscar todos los archivos Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Busca texto dentro de archivos.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Ejecuta comandos shell en un entorno sandbox. Requiere que el backend soporte <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Delegación de subagentes (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Envía una subtarea a un sub-agente específico. Usted proporciona el nombre del subagente y la descripción de la tarea.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Cómo se gestionan los resultados de las herramientas</h3><p>Si una herramienta genera un resultado grande, Deep Agents lo guarda automáticamente en un archivo.</p>
<p>Por ejemplo, si <code translate="no">internet_search</code> devuelve 100 KB de contenido, el sistema lo guarda en algo como <code translate="no">/tool_results/internet_search_1.txt</code>. El agente sólo conserva la ruta del archivo en su contexto. Esto reduce el uso de tokens y mantiene la ventana de contexto pequeña.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Constructor de Agentes: ¿Cuándo usar cada uno?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Dado que este artículo se centra en DeepAgents, también es útil entender cómo se compara con</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, otra opción de construcción de agentes en el ecosistema LangChain.</em></p>
<p>LangChain ofrece varias formas de construir agentes de Inteligencia Artificial, y la mejor opción depende de cuánto control quieras tener sobre el sistema.</p>
<p><strong>DeepAgents</strong> está diseñado para construir agentes autónomos que gestionen tareas de larga duración y múltiples pasos. Ofrece a los desarrolladores un control total sobre cómo el agente planifica las tareas, utiliza las herramientas y gestiona la memoria. Al estar basado en LangGraph, se pueden personalizar los componentes, integrar herramientas de Python y modificar el backend de almacenamiento. Esto hace de DeepAgents una buena opción para flujos de trabajo complejos y sistemas de producción donde la fiabilidad y la flexibilidad son importantes.</p>
<p><strong>Agent Builder</strong>, en cambio, se centra en la facilidad de uso. Oculta la mayoría de los detalles técnicos, para que pueda describir un agente, añadir herramientas y ejecutarlo rápidamente. La memoria, el uso de herramientas y los pasos de aprobación humana se gestionan automáticamente. Esto hace que el Constructor de Agentes sea útil para prototipos rápidos, herramientas internas o experimentos iniciales.</p>
<p><strong>El Constructor de Agentes y DeepAgents no son sistemas separados, sino que forman parte de la misma pila.</strong> Agent Builder está construido sobre DeepAgents. Muchos equipos comienzan con Agent Builder para probar ideas, y luego cambian a DeepAgents cuando necesitan más control. Los flujos de trabajo creados con DeepAgents también pueden convertirse en plantillas de Agent Builder para que otros puedan reutilizarlos fácilmente.</p>
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
    </button></h2><p>Deep Agents facilita la gestión de flujos de trabajo de agentes complejos mediante tres ideas principales: planificación de tareas, almacenamiento de archivos y delegación de subagentes. Estos mecanismos convierten los desordenados procesos de múltiples pasos en flujos de trabajo estructurados. Cuando se combina con Milvus para la búsqueda vectorial, el agente también puede mantener la memoria a largo plazo entre sesiones.</p>
<p>Para los desarrolladores, esto significa menores costes de Token y un sistema más fiable que puede escalar de una simple demostración a un entorno de producción.</p>
<p>Si está creando agentes de IA que necesitan flujos de trabajo estructurados y memoria real a largo plazo, nos encantaría ponernos en contacto con usted.</p>
<p>¿Tiene alguna pregunta sobre Deep Agents o sobre el uso de Milvus como backend de memoria persistente? Únase a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserve una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a> para discutir su caso de uso.</p>
