---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Primeros pasos con langgraph-up-react: Una plantilla práctica de LangGraph'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  introduciendo langgraph-up-react, una plantilla LangGraph + ReAct lista para
  usar para agentes ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>Los agentes de IA se están convirtiendo en un patrón básico de la IA aplicada. Cada vez son más los proyectos que van más allá de las indicaciones aisladas y los modelos de cableado en bucles de toma de decisiones. Esto es emocionante, pero también implica gestionar el estado, coordinar las herramientas, gestionar las ramificaciones y añadir transferencias humanas, cosas que no son obvias a primera vista.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> es una buena opción para esta capa. Es un marco de IA que proporciona bucles, condicionales, persistencia, controles humanos en el bucle y streaming, suficiente estructura para convertir una idea en una aplicación multiagente real. Sin embargo, LangGraph tiene una pronunciada curva de aprendizaje. Su documentación se mueve rápidamente, las abstracciones toman tiempo para acostumbrarse, y saltar de una simple demostración a algo que se siente como un producto puede ser frustrante.</p>
<p>Recientemente, empecé a usar <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react, una</strong></a>plantilla LangGraph + ReAct lista para usar para agentes ReAct. Recorta la configuración, viene con valores por defecto, y le permite centrarse en el comportamiento en lugar de la repetición. En este post, voy a caminar a través de cómo empezar con LangGraph utilizando esta plantilla.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Entendiendo los Agentes ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en la plantilla en sí, vale la pena echar un vistazo al tipo de agente que vamos a construir. Uno de los patrones más comunes hoy en día es el marco <strong>ReAct (Reason + Act)</strong>, introducido por primera vez en el documento de Google de 2022 <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>La idea es sencilla: en lugar de tratar el razonamiento y la acción por separado, ReAct los combina en un bucle de retroalimentación que se parece mucho a la resolución humana de problemas. El agente <strong>razona</strong> sobre el problema, <strong>actúa</strong> llamando a una herramienta o API y luego <strong>observa</strong> el resultado antes de decidir qué hacer a continuación. Este sencillo ciclo -razonar → actuar → observar- permite a los agentes adaptarse dinámicamente en lugar de seguir un guión fijo.</p>
<p>He aquí cómo encajan las piezas:</p>
<ul>
<li><p><strong>Razonar</strong>: El modelo divide los problemas en pasos, planifica estrategias e incluso puede corregir errores a medio camino.</p></li>
<li><p><strong>Actúa</strong>: Basándose en su razonamiento, el agente llama a herramientas, ya sea un motor de búsqueda, una calculadora o su propia API personalizada.</p></li>
<li><p><strong>Observa</strong>: El agente mira el resultado de la herramienta, filtra los resultados y los introduce en su siguiente ronda de razonamiento.</p></li>
</ul>
<p>Este bucle se ha convertido rápidamente en la columna vertebral de los agentes de IA modernos. Verás rastros de él en plugins ChatGPT, pipelines RAG, asistentes inteligentes e incluso robótica. En nuestro caso, es la base sobre la que se construye la plantilla <code translate="no">langgraph-up-react</code>.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Entendiendo LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que hemos visto el patrón ReAct, la siguiente pregunta es: ¿cómo se implementa algo así en la práctica? La mayoría de los modelos lingüísticos no manejan muy bien el razonamiento en varios pasos. Cada llamada no tiene estado: el modelo genera una respuesta y se olvida de todo en cuanto termina. Esto dificulta la transferencia de los resultados intermedios o el ajuste de los pasos posteriores en función de los anteriores.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> colma esta laguna. En lugar de tratar cada pregunta como algo aislado, permite dividir tareas complejas en pasos, recordar lo que ha ocurrido en cada punto y decidir qué hacer a continuación en función del estado actual. En otras palabras, convierte el proceso de razonamiento de un agente en algo estructurado y repetible, en lugar de una cadena de indicaciones ad hoc.</p>
<p>Es como un <strong>diagrama de flujo del razonamiento de la IA</strong>:</p>
<ul>
<li><p><strong>Analizar</strong> la consulta del usuario</p></li>
<li><p><strong>Seleccionar</strong> la herramienta adecuada para la tarea</p></li>
<li><p><strong>Ejecutar</strong> la tarea llamando a la herramienta</p></li>
<li><p><strong>Procesar</strong> los resultados</p></li>
<li><p><strong>Comprobar</strong> si la tarea se ha completado; si no, volver atrás y continuar el razonamiento</p></li>
<li><p><strong>Obtener</strong> la respuesta final</p></li>
</ul>
<p>A lo largo del proceso, LangGraph gestiona <strong>el almacenamiento en memoria</strong> para que no se pierdan los resultados de los pasos anteriores, y se integra con una <strong>biblioteca de herramientas externas</strong> (API, bases de datos, búsqueda, calculadoras, sistemas de archivos, etc.).</p>
<p>Por eso se llama <em>LangGraph</em>: <strong>Lang (Lenguaje) + Graph, un</strong>marco para organizar cómo piensan y actúan los modelos lingüísticos a lo largo del tiempo.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Entendiendo langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph es potente, pero conlleva una sobrecarga. La configuración de la gestión de estados, el diseño de nodos y aristas, la gestión de errores y la conexión de modelos y herramientas requieren tiempo. La depuración de flujos de múltiples pasos también puede ser dolorosa: cuando algo se rompe, el problema puede estar en cualquier nodo o transición. A medida que los proyectos crecen, incluso los pequeños cambios pueden propagarse por la base de código y ralentizarlo todo.</p>
<p>Aquí es donde una plantilla madura marca una gran diferencia. En lugar de empezar desde cero, una plantilla te da una estructura probada, herramientas pre-construidas y scripts que simplemente funcionan. Te saltas la repetición y te centras directamente en la lógica del agente.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> es una de esas plantillas. Está diseñada para ayudarte a poner en marcha un agente LangGraph ReAct rápidamente, con:</p>
<ul>
<li><p>🔧 <strong>Ecosistema de herramientas incorporado</strong>: adaptadores y utilidades listos para usar out of the box.</p></li>
<li><p>⚡ <strong>Inicio rápido</strong>: configuración sencilla y un agente de trabajo en cuestión de minutos</p></li>
<li><p>🧪 <strong>Pruebas incluidas</strong>: pruebas unitarias y pruebas de integración para tener confianza a medida que se amplía</p></li>
<li><p>📦 <strong>Configuración lista para producción</strong>: patrones de arquitectura y scripts que ahorran tiempo al desplegar</p></li>
</ul>
<p>En resumen, se encarga de la placa de caldera para que pueda centrarse en la construcción de agentes que realmente resuelven sus problemas de negocio.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Primeros pasos con la plantilla langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Poner en marcha la plantilla es sencillo. Aquí está el proceso de configuración paso a paso:</p>
<ol>
<li>Instalar las dependencias del entorno</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Clonar el proyecto</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Instalar dependencias</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Configurar el entorno</li>
</ol>
<p>Copia la configuración de ejemplo y añade tus claves:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Edita .env y configura al menos un proveedor de modelos además de tu clave Tavily API:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Iniciar el proyecto</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Tu servidor de desarrollo estará listo para las pruebas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">¿Qué puedes hacer con langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Entonces, ¿qué puedes hacer una vez que la plantilla está en funcionamiento? Aquí hay dos ejemplos concretos que muestran cómo se puede aplicar en proyectos reales.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Base de conocimiento empresarial de preguntas y respuestas (Agentic RAG)</h3><p>Un caso de uso común es un asistente interno de preguntas y respuestas para el conocimiento de la empresa. Piense en manuales de productos, documentos técnicos, preguntas frecuentes: información útil pero dispersa. Con <code translate="no">langgraph-up-react</code>, puede crear un agente que indexe estos documentos en una base de datos vectorial de <a href="https://milvus.io/"><strong>Milvus</strong></a>, recupere los pasajes más relevantes y genere respuestas precisas basadas en el contexto.</p>
<p>Para el despliegue, Milvus ofrece opciones flexibles: <strong>Lite</strong> para la creación rápida de prototipos, <strong>Standalone</strong> para cargas de trabajo de producción de tamaño medio y <strong>Distributed</strong> para sistemas a escala empresarial. También deberá ajustar los parámetros del índice (por ejemplo, HNSW) para equilibrar la velocidad y la precisión, y configurar la supervisión de la latencia y la recuperación para garantizar que el sistema siga siendo fiable bajo carga.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Colaboración multiagente</h3><p>Otro potente caso de uso es la colaboración entre varios agentes. En lugar de que un agente intente hacerlo todo, se definen varios agentes especializados que trabajan juntos. En un flujo de trabajo de desarrollo de software, por ejemplo, un Agente Gestor de Producto desglosa los requisitos, un Agente Arquitecto redacta el diseño, un Agente Desarrollador escribe el código y un Agente de Pruebas valida los resultados.</p>
<p>Esta orquestación destaca los puntos fuertes de LangGraph: gestión de estados, ramificación y coordinación entre agentes. Cubriremos esta configuración con más detalle en un artículo posterior, pero el punto clave es que <code translate="no">langgraph-up-react</code> hace que sea práctico probar estos patrones sin pasar semanas en andamiaje.</p>
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
    </button></h2><p>Construir agentes fiables no es sólo cuestión de prompts inteligentes, es cuestión de estructurar el razonamiento, gestionar el estado y cablearlo todo en un sistema que realmente puedas mantener. LangGraph te da el marco para hacerlo, y <code translate="no">langgraph-up-react</code> baja la barrera manejando el boilerplate para que puedas centrarte en el comportamiento del agente.</p>
<p>Con esta plantilla, puedes poner en marcha proyectos como sistemas de preguntas y respuestas de bases de conocimiento o flujos de trabajo multiagente sin perderte en la configuración. Es un punto de partida que ahorra tiempo, evita errores comunes y hace que experimentar con LangGraph sea mucho más fácil.</p>
<p>En el próximo post, profundizaré en un tutorial práctico, mostrando paso a paso cómo extender la plantilla y construir un agente funcional para un caso de uso real usando LangGraph, <code translate="no">langgraph-up-react</code>, y la base de datos vectorial Milvus. Permanece atento.</p>
