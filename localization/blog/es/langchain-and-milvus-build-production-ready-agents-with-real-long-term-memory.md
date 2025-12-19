---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 y Milvus: cómo crear agentes listos para la producción con
  memoria a largo plazo real
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Descubra cómo LangChain 1.0 simplifica la arquitectura de agentes y cómo
  Milvus añade memoria a largo plazo para aplicaciones de IA escalables y listas
  para la producción.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain es un popular marco de código abierto para el desarrollo de aplicaciones basadas en grandes modelos lingüísticos (LLM). Proporciona un conjunto de herramientas modulares para crear agentes que razonen y utilicen herramientas, conectar modelos a datos externos y gestionar flujos de interacción.</p>
<p>Con el lanzamiento de <strong>LangChain 1.0</strong>, el marco da un paso hacia una arquitectura más fácil de producir. La nueva versión sustituye el diseño anterior basado en cadenas por un bucle ReAct estandarizado (Razonar → Llamar a la herramienta → Observar → Decidir) e introduce middleware para gestionar la ejecución, el control y la seguridad.</p>
<p>Sin embargo, el razonamiento por sí solo no es suficiente. Los agentes también necesitan la capacidad de almacenar, recuperar y reutilizar información. Ahí es donde <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de código abierto, puede desempeñar un papel esencial. Milvus proporciona una capa de memoria escalable y de alto rendimiento que permite a los agentes almacenar, buscar y recuperar información de forma eficiente a través de la similitud semántica.</p>
<p>En este post, exploraremos cómo LangChain 1.0 actualiza la arquitectura de agentes y cómo la integración de Milvus ayuda a los agentes a ir más allá del razonamiento, permitiendo una memoria persistente e inteligente para casos de uso del mundo real.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Por qué el diseño basado en cadenas se queda corto<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>En sus primeros días (versión 0.x), la arquitectura de LangChain se centraba en Cadenas. Cada Cadena definía una secuencia fija y venía con plantillas pre-construidas que hacían la orquestación LLM simple y rápida. Este diseño era genial para construir prototipos rápidamente. Pero a medida que el ecosistema LLM evolucionaba y los casos de uso en el mundo real se hacían más complejos, empezaron a aparecer grietas en esta arquitectura.</p>
<p><strong>1. 1. Falta de flexibilidad</strong></p>
<p>Las primeras versiones de LangChain proporcionaban pipelines modulares como SimpleSequentialChain o LLMChain, cada uno de los cuales seguía un flujo fijo y lineal: creación de la solicitud → llamada al modelo → procesamiento de la salida. Este diseño funcionaba bien para tareas sencillas y predecibles y facilitaba la creación rápida de prototipos.</p>
<p>Sin embargo, a medida que las aplicaciones se volvían más dinámicas, estas plantillas rígidas empezaron a resultar restrictivas. Cuando la lógica de negocio ya no encaja perfectamente en una secuencia predefinida, te quedas con dos opciones insatisfactorias: forzar tu lógica para que se ajuste al framework o eludirlo por completo llamando directamente a la API de LLM.</p>
<p><strong>2. Falta de control de producción</strong></p>
<p>Lo que funcionaba bien en las demos a menudo no funcionaba en producción. Las cadenas no incluían las salvaguardas necesarias para aplicaciones a gran escala, persistentes o sensibles. Algunos de los problemas más comunes son</p>
<ul>
<li><p><strong>Desbordamiento de contexto:</strong> Las conversaciones largas podían superar los límites de tokens, provocando bloqueos o truncamientos silenciosos.</p></li>
<li><p><strong>Fugas de datos sensibles:</strong> La información personal identificable (como correos electrónicos o identificaciones) podría enviarse inadvertidamente a modelos de terceros.</p></li>
<li><p><strong>Operaciones no supervisadas:</strong> Los agentes podrían borrar datos o enviar correos electrónicos sin la aprobación humana.</p></li>
</ul>
<p><strong>3. Falta de compatibilidad entre modelos</strong></p>
<p>Cada proveedor de LLM -OpenAI, Anthropic y muchos modelos chinos- implementa sus propios protocolos de razonamiento y llamada a herramientas. Cada vez que se cambiaba de proveedor, había que reescribir la capa de integración: plantillas de solicitud, adaptadores y analizadores de respuestas. Este trabajo repetitivo ralentizaba el desarrollo y dificultaba la experimentación.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: Agente ReAct todo en uno<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando el equipo de LangChain analizó cientos de implementaciones de agentes en producción, hubo una idea que saltó a la vista: casi todos los agentes de éxito convergían de forma natural en el <strong>patrón ReAct ("Razonamiento + Actuación")</strong>.</p>
<p>Tanto si se trata de un sistema multiagente como de un único agente que realiza un razonamiento profundo, surge el mismo bucle de control: alternar breves pasos de razonamiento con llamadas a herramientas específicas y, a continuación, alimentar las decisiones posteriores con las observaciones resultantes hasta que el agente pueda ofrecer una respuesta final.</p>
<p>Para basarse en esta estructura probada, LangChain 1.0 sitúa el bucle ReAct en el núcleo de su arquitectura, convirtiéndolo en la estructura por defecto para construir agentes fiables, interpretables y listos para la producción.</p>
<p>Para soportar desde agentes sencillos hasta orquestaciones complejas, LangChain 1.0 adopta un diseño en capas que combina la facilidad de uso con un control preciso:</p>
<ul>
<li><p><strong>Escenarios estándar:</strong> Comience con la función create_agent() - un bucle ReAct limpio y estandarizado que maneja el razonamiento y las llamadas a herramientas fuera de la caja.</p></li>
<li><p><strong>Escenarios ampliados:</strong> Añada middleware para obtener un control más preciso. El middleware le permite inspeccionar o modificar lo que ocurre dentro del agente, por ejemplo, añadiendo detección PII, puntos de control de aprobación humana, reintentos automáticos o ganchos de supervisión.</p></li>
<li><p><strong>Escenarios complejos:</strong> Para flujos de trabajo con estados u orquestación multiagente, utilice LangGraph, un motor de ejecución basado en gráficos que proporciona un control preciso sobre el flujo lógico, las dependencias y los estados de ejecución.</p></li>
</ul>
<p>Ahora vamos a desglosar los tres componentes clave que hacen que el desarrollo de agentes sea más sencillo, seguro y coherente en todos los modelos.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. La función create_agent(): Una forma más sencilla de crear agentes</h3><p>Un avance clave en LangChain 1.0 es cómo reduce la complejidad de construir agentes a una única función - create_agent(). Ya no es necesario manejar manualmente la gestión de estados, la gestión de errores o la transmisión de salidas. Estas características de nivel de producción son ahora gestionadas automáticamente por el tiempo de ejecución LangGraph subyacente.</p>
<p>Con sólo tres parámetros, puedes lanzar un agente completamente funcional:</p>
<ul>
<li><p><strong>model</strong> - un identificador de modelo (cadena) o un objeto modelo instanciado.</p></li>
<li><p><strong>tools</strong> - una lista de funciones que dan al agente sus habilidades.</p></li>
<li><p><strong>system_prompt</strong> - la instrucción que define el rol, tono y comportamiento del agente.</p></li>
</ul>
<p>Bajo el capó, create_agent() se ejecuta en el bucle de agente estándar - llamando a un modelo, dejándole elegir las herramientas a ejecutar, y completando una vez que no se necesitan más herramientas:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>También hereda las capacidades incorporadas de LangGraph para la persistencia del estado, la recuperación de interrupciones y el streaming. Las tareas que antes requerían cientos de líneas de código de orquestación ahora se gestionan a través de una única API declarativa.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. El middleware: Una capa componible para un control listo para la producción</h3><p>El middleware es el puente clave que lleva a LangChain del prototipo a la producción. Expone ganchos en puntos estratégicos del bucle de ejecución del agente, lo que permite añadir lógica personalizada sin reescribir el proceso central de ReAct.</p>
<p>El bucle principal de un agente sigue un proceso de decisión de tres pasos - Modelo → Herramienta → Terminación:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 proporciona algunos <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">middlewares preconstruidos</a> para patrones comunes. He aquí cuatro ejemplos.</p>
<ul>
<li><strong>Detección de PII: Cualquier aplicación que maneje datos sensibles del usuario.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Resumir: Resume automáticamente el historial de conversaciones cuando se acerca al límite de tokens.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Reintento de herramientas: Reintento automático de llamadas a herramientas fallidas con un backoff exponencial configurable.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Middleware personalizado</strong></li>
</ul>
<p>Además de las opciones de middleware oficiales y predefinidas, también puedes crear middleware personalizado mediante decoradores o clases.</p>
<p>Por ejemplo, el siguiente fragmento muestra cómo registrar las llamadas al modelo antes de la ejecución:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Salida estructurada: Una forma estandarizada de manejar datos</h3><p>En el desarrollo tradicional de agentes, la salida estructurada siempre ha sido difícil de gestionar. Por ejemplo, OpenAI ofrece una API nativa de salida estructurada, mientras que otros sólo soportan respuestas estructuradas indirectamente a través de llamadas a herramientas. Esto a menudo significaba escribir adaptadores personalizados para cada proveedor, añadiendo trabajo extra y haciendo el mantenimiento más doloroso de lo que debería ser.</p>
<p>En LangChain 1.0, la salida estructurada se gestiona directamente a través del parámetro response_format de create_agent().  Sólo es necesario definir el esquema de datos una vez. LangChain elige automáticamente la mejor estrategia de aplicación en función del modelo que esté utilizando, sin necesidad de configuración adicional ni de código específico del proveedor.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain admite dos estrategias para la salida estructurada:</p>
<p><strong>1. Estrategia del proveedor:</strong> Algunos proveedores de modelos soportan de forma nativa la salida estructurada a través de sus API (por ejemplo, OpenAI y Grok). Cuando este soporte está disponible, LangChain utiliza directamente la aplicación de esquemas incorporada en el proveedor. Este enfoque ofrece el máximo nivel de fiabilidad y coherencia, ya que el propio modelo garantiza el formato de salida.</p>
<p><strong>2. Estrategia de llamada a la herramienta:</strong> Para los modelos que no soportan la salida estructurada nativa, LangChain utiliza la llamada a herramientas para lograr el mismo resultado.</p>
<p>No tiene que preocuparse de qué estrategia se está utilizando: el marco de trabajo detecta las capacidades del modelo y se adapta automáticamente. Esta abstracción le permite cambiar libremente entre diferentes proveedores de modelos sin cambiar su lógica empresarial.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Cómo Milvus mejora la memoria del agente<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Para los agentes de producción, el verdadero cuello de botella del rendimiento no suele ser el motor de razonamiento, sino el sistema de memoria. En LangChain 1.0, las bases de datos vectoriales actúan como memoria externa del agente, proporcionando memoria a largo plazo a través de la recuperación semántica.</p>
<p><a href="https://milvus.io/">Milvus</a> es una de las bases de datos vectoriales de código abierto más maduras disponibles en la actualidad, creada específicamente para la búsqueda vectorial a gran escala en aplicaciones de IA. Se integra de forma nativa con LangChain, por lo que no es necesario gestionar manualmente la vectorización, la gestión de índices o la búsqueda de similitudes. El paquete langchain_milvus envuelve Milvus como una interfaz VectorStore estándar, lo que le permite conectarlo a sus agentes con sólo unas pocas líneas de código.</p>
<p>De este modo, Milvus aborda tres retos clave en la construcción de sistemas de memoria de agentes escalables y fiables:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Recuperación rápida de bases de conocimiento masivas</strong></h4><p>Cuando un agente necesita procesar miles de documentos, conversaciones pasadas o manuales de productos, la simple búsqueda por palabras clave no es suficiente. Milvus utiliza la búsqueda por similitud vectorial para encontrar información semánticamente relevante en milisegundos, incluso si la consulta utiliza una redacción diferente. Esto permite a su agente recuperar conocimientos basándose en el significado, no sólo en coincidencias exactas de texto.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Memoria persistente a largo plazo</strong></h4><p>El SummarizationMiddleware de LangChain puede condensar el historial de la conversación cuando se hace demasiado largo, pero ¿qué ocurre con todos los detalles que se resumen? Milvus los conserva. Cada conversación, llamada a herramientas y paso de razonamiento puede vectorizarse y almacenarse para su consulta a largo plazo. Cuando es necesario, el agente puede recuperar rápidamente los recuerdos relevantes mediante la búsqueda semántica, lo que permite una verdadera continuidad entre sesiones.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Gestión unificada de contenidos multimodales</strong></h4><p>Los agentes modernos manejan más que texto: interactúan con imágenes, audio y vídeo. Milvus admite el almacenamiento multivectorial y el esquema dinámico, lo que le permite gestionar incrustaciones de múltiples modalidades en un único sistema. Esto proporciona una base de memoria unificada para agentes multimodales, permitiendo una recuperación consistente a través de diferentes tipos de datos.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain frente a LangGraph: Cómo elegir el más adecuado para sus agentes<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Actualizarse a LangChain 1.0 es un paso esencial hacia la creación de agentes de producción, pero eso no significa que sea siempre la única o la mejor opción para cada caso de uso. Elegir el marco de trabajo adecuado determina la rapidez con la que se pueden combinar estas capacidades en un sistema funcional y fácil de mantener.</p>
<p>En realidad, LangChain 1.0 y LangGraph 1.0 pueden considerarse parte de la misma pila de capas, diseñadas para trabajar juntas en lugar de sustituirse mutuamente: LangChain te ayuda a construir agentes estándar rápidamente, mientras que LangGraph te da un control detallado para flujos de trabajo complejos. En otras palabras, LangChain le ayuda a moverse rápido, mientras que LangGraph le ayuda a profundizar.</p>
<p>A continuación se muestra una rápida comparación de cómo se diferencian en el posicionamiento técnico:</p>
<table>
<thead>
<tr><th><strong>Dimensión</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Nivel de abstracción</strong></td><td>Abstracción de alto nivel, diseñada para escenarios de agentes estándar</td><td>Marco de orquestación de bajo nivel, diseñado para flujos de trabajo complejos</td></tr>
<tr><td><strong>Capacidad básica</strong></td><td>Bucle ReAct estándar (Razón → Llamada a herramienta → Observación → Respuesta)</td><td>Máquinas de estado personalizadas y lógica de bifurcación compleja (StateGraph + enrutamiento condicional)</td></tr>
<tr><td><strong>Mecanismo de extensión</strong></td><td>Middleware para capacidades de nivel de producción</td><td>Gestión manual de nodos, aristas y transiciones de estado</td></tr>
<tr><td><strong>Implementación subyacente</strong></td><td>Gestión manual de nodos, aristas y transiciones de estado</td><td>Tiempo de ejecución nativo con persistencia y recuperación integradas</td></tr>
<tr><td><strong>Casos de uso típicos</strong></td><td>80% de los escenarios de agentes estándar</td><td>Colaboración multiagente y orquestación de flujos de trabajo de larga duración</td></tr>
<tr><td><strong>Curva de aprendizaje</strong></td><td>Construir un agente en ~10 líneas de código</td><td>Requiere conocimientos de gráficos de estado y orquestación de nodos</td></tr>
</tbody>
</table>
<p>Si es la primera vez que construye agentes o quiere poner en marcha un proyecto rápidamente, empiece con LangChain. Si ya sabes que tu caso de uso requiere una orquestación compleja, colaboración multi-agente, o flujos de trabajo de larga duración, ve directamente a LangGraph.</p>
<p>Ambos frameworks pueden coexistir en el mismo proyecto: puedes empezar de forma sencilla con LangChain e incorporar LangGraph cuando tu sistema necesite más control y flexibilidad. La clave está en elegir la herramienta adecuada para cada parte de tu flujo de trabajo.</p>
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
    </button></h2><p>Hace tres años, LangChain comenzó como una envoltura ligera para llamar a LLMs. Hoy en día, se ha convertido en un completo marco de producción.</p>
<p>En el núcleo, las capas de middleware proporcionan seguridad, conformidad y observabilidad. LangGraph añade ejecución persistente, flujo de control y gestión de estados. Y en la capa de memoria, <a href="https://milvus.io/">Milvus</a> llena un vacío crítico: proporciona una memoria a largo plazo escalable y fiable que permite a los agentes recuperar el contexto, razonar sobre el historial y mejorar con el tiempo.</p>
<p>Juntos, LangChain, LangGraph y Milvus forman una práctica cadena de herramientas para la era moderna de los agentes, que une la creación rápida de prototipos con el despliegue a escala empresarial, sin sacrificar la fiabilidad ni el rendimiento.</p>
<p>🚀 ¿Listo para dotar a su agente de una memoria fiable a largo plazo? Explore <a href="https://milvus.io">Milvus</a> y vea cómo potencia la memoria inteligente a largo plazo para los agentes LangChain en producción.</p>
<p>Tienes preguntas o quieres una inmersión profunda en cualquier característica? Únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> o presente incidencias en <a href="https://github.com/milvus-io/milvus">GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
