---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Por qué Clawdbot se hizo viral - Y cómo crear agentes de larga duración listos
  para la producción con LangGraph y Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot demostró que la gente quiere IA que actúe. Aprenda a crear agentes de
  larga duración listos para la producción con arquitectura de dos agentes,
  Milvus y LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (ahora OpenClaw) se hizo viral<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, ahora rebautizado como OpenClaw, arrasó en Internet la semana pasada. El asistente de inteligencia artificial de código abierto creado por Peter Steinberger alcanzó <a href="https://github.com/openclaw/openclaw">más de 110.000 estrellas en GitHub</a> en pocos días. Los usuarios publicaron vídeos en los que aparecía registrando vuelos, gestionando correos electrónicos y controlando dispositivos domésticos inteligentes de forma autónoma. Andrej Karpathy, ingeniero fundador de OpenAI, lo elogió. David Sacks, fundador e inversor de Tech, tuiteó sobre él. La gente lo llamó "Jarvis, pero real".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Luego llegaron las advertencias de seguridad.</p>
<p>Los investigadores encontraron cientos de paneles de administración expuestos. El bot se ejecuta con acceso root por defecto. No hay sandboxing. Las vulnerabilidades de inyección de prompt podrían permitir a los atacantes secuestrar el agente. Una pesadilla para la seguridad.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot se hizo viral por una razón<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot se hizo viral por una razón.</strong> Se ejecuta localmente o en tu propio servidor. Se conecta a aplicaciones de mensajería que la gente ya utiliza: WhatsApp, Slack, Telegram, iMessage. Recuerda el contexto a lo largo del tiempo en lugar de olvidarlo todo después de cada respuesta. Gestiona calendarios, resume correos electrónicos y automatiza tareas entre aplicaciones.</p>
<p>Los usuarios tienen la sensación de que se trata de una IA personal que no interviene y está siempre activa, no solo de una herramienta de respuesta inmediata. Su modelo de código abierto y autoalojamiento atrae a los desarrolladores que desean control y personalización. Y la facilidad de integración con los flujos de trabajo existentes hace que sea fácil de compartir y recomendar.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Dos retos para crear agentes de larga duración<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La popularidad de Clawdbot demuestra que la gente quiere IA que</strong> <em>actúe</em><strong>, no sólo que responda.</strong> Pero cualquier agente que funcione durante largos periodos de tiempo y realice tareas reales, ya sea Clawdbot o algo creado por uno mismo, tiene que resolver dos problemas técnicos: la <strong>memoria</strong> y la <strong>verificación</strong>.</p>
<p><strong>El problema de la memoria</strong> se manifiesta de múltiples formas:</p>
<ul>
<li><p>Los agentes agotan su ventana de contexto a mitad de la tarea y dejan el trabajo a medias.</p></li>
<li><p>Pierden de vista la lista completa de tareas y declaran "terminado" demasiado pronto.</p></li>
<li><p>No pueden transferir el contexto entre sesiones, por lo que cada nueva sesión empieza de cero.</p></li>
</ul>
<p>Todos estos problemas tienen la misma raíz: los agentes no tienen memoria persistente. Las ventanas de contexto son finitas, la recuperación entre sesiones es limitada y el progreso no se controla de forma que los agentes puedan acceder a él.</p>
<p><strong>El problema de la verificación</strong> es diferente. Incluso cuando la memoria funciona, los agentes marcan las tareas como completadas tras una rápida prueba unitaria, sin comprobar si la función funciona realmente de extremo a extremo.</p>
<p>Clawdbot aborda ambos problemas. Almacena la memoria localmente en todas las sesiones y utiliza "habilidades" modulares para automatizar navegadores, archivos y servicios externos. El planteamiento funciona. Pero no está listo para la producción. Para uso empresarial, se necesita una estructura, capacidad de auditoría y seguridad que Clawdbot no proporciona.</p>
<p>Este artículo cubre los mismos problemas con soluciones listas para producción.</p>
<p>Para la memoria, utilizamos una <strong>arquitectura de dos agentes</strong> basada en <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">la investigación de Anthropic</a>: un agente inicializador que divide los proyectos en características verificables, y un agente de codificación que trabaja a través de ellos de uno en uno con traspasos limpios. Para la recuperación semántica entre sesiones, utilizamos <a href="https://milvus.io/">Milvus</a>, una base de datos vectorial que permite a los agentes buscar por significado, no por palabras clave.</p>
<p>Para la verificación, utilizamos <strong>la automatización del navegador</strong>. En lugar de confiar en las pruebas unitarias, el agente prueba las funciones como lo haría un usuario real.</p>
<p>Repasaremos los conceptos y mostraremos una implementación práctica utilizando <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> y Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Cómo la arquitectura de dos agentes previene el agotamiento del contexto<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada LLM tiene una ventana de contexto: un límite sobre la cantidad de texto que puede procesar a la vez. Cuando un agente trabaja en una tarea compleja, esta ventana se llena de código, mensajes de error, historial de conversaciones y documentación. Cuando la ventana está llena, el agente se detiene o empieza a olvidar el contexto anterior. En el caso de las tareas de larga duración, esto es inevitable.</p>
<p>Pensemos en un agente al que se le pide lo siguiente "Construye un clon de claude.ai". El proyecto requiere autenticación, interfaces de chat, historial de conversaciones, transmisión de respuestas y docenas de funciones más. Un solo agente intentará abordarlo todo a la vez. A mitad de la implementación de la interfaz de chat, la ventana de contexto se llena. La sesión termina con código a medio escribir, sin documentación de lo que se intentó, y sin indicación de lo que funciona y lo que no. La siguiente sesión hereda un desastre. Incluso con la compactación del contexto, el nuevo agente tiene que adivinar lo que estaba haciendo la sesión anterior, depurar el código que no escribió y averiguar dónde reanudar. Se pierden horas antes de que se produzca ningún nuevo progreso.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">La solución del agente doble</h3><p>La solución de Anthropic, descrita en su post de ingeniería <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents",</a> consiste en utilizar dos modos diferentes de avisos: <strong>un aviso de inicialización</strong> para la primera sesión y <strong>un aviso de codificación</strong> para las sesiones posteriores.</p>
<p>Técnicamente, ambos modos utilizan el mismo agente subyacente, el mismo prompt de sistema, las mismas herramientas y el mismo arnés. La única diferencia es el aviso inicial al usuario. Sin embargo, dado que desempeñan funciones distintas, resulta útil pensar en ellos como dos agentes separados. A esto lo llamamos arquitectura de dos agentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>El inicializador prepara el entorno para un progreso incremental.</strong> Toma una petición vaga y hace tres cosas:</p>
<ul>
<li><p><strong>Divide el proyecto en características específicas y verificables.</strong> No requisitos vagos como "crear una interfaz de chat", sino pasos concretos y comprobables: "el usuario hace clic en el botón Nuevo chat → aparece una nueva conversación en la barra lateral → el área de chat muestra el estado de bienvenida". El ejemplo del clon de claude.ai de Anthropic tenía más de 200 de estas características.</p></li>
<li><p><strong>Crea un archivo de seguimiento del progreso.</strong> Este archivo registra el estado de finalización de cada característica, por lo que cualquier sesión puede ver lo que está hecho y lo que queda.</p></li>
<li><p><strong>Escribe scripts de configuración y realiza un commit git inicial.</strong> Scripts como <code translate="no">init.sh</code> permiten a las futuras sesiones poner en marcha rápidamente el entorno de desarrollo. El git commit establece una línea de base limpia.</p></li>
</ul>
<p>El inicializador no sólo planifica. Crea una infraestructura que permite a las futuras sesiones empezar a trabajar inmediatamente.</p>
<p><strong>El agente de codificación</strong> se encarga de cada sesión posterior. Lo hace:</p>
<ul>
<li><p>Lee el archivo de progreso y los registros de git para comprender el estado actual.</p></li>
<li><p>Ejecuta una prueba básica de extremo a extremo para confirmar que la aplicación sigue funcionando.</p></li>
<li><p>Elige una característica en la que trabajar</p></li>
<li><p>Implementa la función, la prueba a fondo, la envía a git con un mensaje descriptivo y actualiza el archivo de progreso.</p></li>
</ul>
<p>Cuando la sesión termina, el código base está en un estado fusionable: sin errores importantes, código ordenado, documentación clara. No hay trabajo a medio terminar ni ningún misterio sobre lo que se ha hecho. La siguiente sesión continúa exactamente donde se detuvo la anterior.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Utilice JSON para el seguimiento de características, no Markdown</h3><p><strong>Un detalle de implementación digno de mención: la lista de características debe ser JSON, no Markdown.</strong></p>
<p>Al editar JSON, los modelos de IA tienden a modificar quirúrgicamente campos específicos. Al editar Markdown, suelen reescribir secciones enteras. Con una lista de más de 200 características, las ediciones Markdown pueden corromper accidentalmente su seguimiento del progreso.</p>
<p>Una entrada JSON tiene este aspecto:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Cada característica tiene pasos de verificación claros. El campo <code translate="no">passes</code> registra la finalización. También se recomiendan instrucciones enérgicas como "Es inaceptable eliminar o editar pruebas, ya que esto podría dar lugar a una funcionalidad ausente o defectuosa" para evitar que el agente juegue con el sistema eliminando funciones difíciles.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Cómo Milvus proporciona a los agentes memoria semántica entre sesiones<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La arquitectura de dos agentes resuelve el agotamiento del contexto, pero no el olvido.</strong> Incluso con traspasos limpios entre sesiones, el agente pierde la pista de lo que ha aprendido. No puede recordar que "JWT refresh tokens" está relacionado con "user authentication" a menos que esas palabras exactas aparezcan en el archivo de progreso. A medida que el proyecto crece, la búsqueda a través de cientos de commits de git se vuelve lenta. La concordancia de palabras clave pasa por alto conexiones que serían obvias para un humano.</p>
<p><strong>Aquí es donde entran en juego las bases de datos vectoriales.</strong> En lugar de almacenar texto y buscar palabras clave, una base de datos vectorial convierte el texto en representaciones numéricas del significado. Cuando buscas "autenticación de usuario", encuentra entradas sobre "tokens de actualización JWT" y "gestión de sesiones de inicio de sesión". No porque las palabras coincidan, sino porque los conceptos son semánticamente cercanos. El agente puede preguntar "¿he visto algo así antes?" y obtener una respuesta útil.</p>
<p><strong>En la práctica, esto funciona incrustando registros de progreso y commits de git en la base de datos como vectores.</strong> Cuando comienza una sesión de codificación, el agente consulta la base de datos con su tarea actual. La base de datos devuelve la historia relevante en milisegundos: qué se intentó antes, qué funcionó, qué falló. El agente no parte de cero. Empieza con el contexto.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>se adapta bien a este caso de uso.</strong> Es de código abierto y está diseñado para la búsqueda de vectores a escala de producción, manejando miles de millones de vectores sin sudar la gota gorda. Para proyectos más pequeños o desarrollo local, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> puede integrarse directamente en una aplicación como SQLite. No requiere configuración de clúster. Cuando el proyecto crece, puede migrar a Milvus distribuido sin cambiar su código. Para generar incrustaciones, puede utilizar modelos externos como <a href="https://www.sbert.net/">SentenceTransformer</a> para un control preciso, o hacer referencia a estas <a href="https://milvus.io/docs/embeddings.md">funciones de incrustación incorporadas</a> para configuraciones más sencillas. Milvus también admite la <a href="https://milvus.io/docs/hybridsearch.md">búsqueda híbrida</a>, que combina la similitud vectorial con el filtrado tradicional, por lo que puede consultar "encontrar problemas de autenticación similares de la última semana" en una sola llamada.</p>
<p><strong>Esto también resuelve el problema de la transferencia.</strong> La base de datos vectorial persiste fuera de cualquier sesión, por lo que el conocimiento se acumula con el tiempo. La sesión 50 tiene acceso a todo lo aprendido en las sesiones 1 a 49. El proyecto desarrolla la memoria institucional.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Verificación de la finalización con pruebas automatizadas<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Incluso con la arquitectura de dos agentes y la memoria a largo plazo, los agentes pueden declarar la victoria demasiado pronto. Éste es el problema de la verificación.</strong></p>
<p>He aquí un modo de fallo común: Una sesión de codificación termina una característica, ejecuta una prueba de unidad rápida, ve que pasa, y cambia <code translate="no">&quot;passes&quot;: false</code> a <code translate="no">&quot;passes&quot;: true</code>. Pero una prueba de unidad que pasa no significa que la característica funcione realmente. La API puede devolver datos correctos mientras que la interfaz de usuario no muestra nada debido a un error de CSS. El archivo de progreso dice "completo" mientras que los usuarios no ven nada.</p>
<p><strong>La solución es hacer que el agente pruebe como un usuario real.</strong> Cada función de la lista de funciones tiene pasos de verificación concretos: "el usuario hace clic en el botón Nuevo chat → aparece una nueva conversación en la barra lateral → el área de chat muestra el estado de bienvenida". El agente debe verificar estos pasos literalmente. En lugar de ejecutar únicamente pruebas a nivel de código, utiliza herramientas de automatización del navegador como Puppeteer para simular el uso real. Abre la página, pulsa botones, rellena formularios y comprueba que aparecen en pantalla los elementos correctos. Sólo cuando el flujo completo pasa, el agente marca la función como completa.</p>
<p><strong>Así se detectan problemas que las pruebas unitarias pasan por alto</strong>. Una función de chat puede tener una lógica backend perfecta y respuestas API correctas. Pero si el frontend no muestra la respuesta, los usuarios no ven nada. La automatización del navegador puede capturar el resultado y verificar que lo que aparece en pantalla coincide con lo que debería aparecer. El campo <code translate="no">passes</code> sólo se convierte en <code translate="no">true</code> cuando la función funciona realmente de extremo a extremo.</p>
<p><strong>Sin embargo, existen limitaciones.</strong> Algunas funciones nativas del navegador no pueden automatizarse con herramientas como Puppeteer. Los selectores de archivos y los diálogos de confirmación del sistema son ejemplos comunes. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic observó</a> que las características que dependen de los modales de alerta nativos del navegador tienden a tener más errores porque el agente no puede verlos a través de Puppeteer. La solución práctica es diseñar teniendo en cuenta estas limitaciones. Utilice componentes de interfaz de usuario personalizados en lugar de diálogos nativos siempre que sea posible, para que el agente pueda probar cada paso de verificación en la lista de características.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Poniéndolo todo junto: LangGraph para el estado de sesión, Milvus para la memoria a largo plazo<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Los conceptos anteriores se unen en un sistema de trabajo utilizando dos herramientas: LangGraph para el estado de sesión y Milvus para la memoria a largo plazo.</strong> LangGraph gestiona lo que ocurre dentro de una sesión: en qué función se está trabajando, qué se ha completado, qué es lo siguiente. Milvus almacena el historial de búsqueda entre sesiones: qué se ha hecho antes, qué problemas se han encontrado y qué soluciones han funcionado. Juntos, proporcionan a los agentes memoria a corto y largo plazo.</p>
<p><strong>Una nota sobre esta implementación:</strong> El código que sigue es una demostración simplificada. Muestra los patrones básicos en un único script, pero no reproduce completamente la separación de sesiones descrita anteriormente. En una configuración de producción, cada sesión de codificación sería una invocación separada, potencialmente en diferentes máquinas o en diferentes momentos. <code translate="no">MemorySaver</code> y <code translate="no">thread_id</code> en LangGraph permiten esto persistiendo el estado entre invocaciones. Para ver claramente el comportamiento de reanudación, ejecute el script una vez, deténgalo y vuelva a ejecutarlo con el mismo <code translate="no">thread_id</code>. La segunda ejecución continuaría donde la primera lo dejó.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Conclusión</h3><p>Los agentes de IA fracasan en tareas de larga duración porque carecen de memoria persistente y verificación adecuada. Clawdbot se hizo viral por resolver estos problemas, pero su enfoque no está listo para la producción.</p>
<p>Este artículo cubre tres soluciones que sí lo están:</p>
<ul>
<li><p><strong>Arquitectura de dos agentes:</strong> Un inicializador divide los proyectos en características verificables; un agente de codificación trabaja en ellas de una en una con traspasos limpios. Así se evita el agotamiento del contexto y se hace un seguimiento del progreso.</p></li>
<li><p><strong>Base de datos vectorial para la memoria semántica:</strong> <a href="https://milvus.io/">Milvus</a> almacena los registros de progreso y los commits de git como incrustaciones, de modo que los agentes pueden buscar por significado, no por palabras clave. La sesión 50 recuerda lo que aprendió la sesión 1.</p></li>
<li><p><strong>Automatización del navegador para una verificación real:</strong> Las pruebas unitarias verifican que el código se ejecuta. Puppeteer comprueba si las características funcionan realmente probando lo que los usuarios ven en pantalla.</p></li>
</ul>
<p>Estos patrones no se limitan al desarrollo de software. La investigación científica, la modelización financiera, la revisión de documentos jurídicos... cualquier tarea que abarque varias sesiones y requiera transferencias fiables puede beneficiarse de ello.</p>
<p>Principios básicos:</p>
<ul>
<li><p>Utilizar un inicializador para dividir el trabajo en partes verificables.</p></li>
<li><p>Seguimiento del progreso en un formato estructurado y legible por máquina.</p></li>
<li><p>Almacenar la experiencia en una base de datos vectorial para su recuperación semántica.</p></li>
<li><p>Verificar la finalización con pruebas reales, no sólo pruebas unitarias.</p></li>
<li><p>Diseñe límites de sesión claros para que el trabajo pueda detenerse y reanudarse de forma segura.</p></li>
</ul>
<p>Las herramientas existen. Los patrones están probados. Lo que falta es aplicarlos.</p>
<p><strong>¿Listo para empezar?</strong></p>
<ul>
<li><p>Explore <a href="https://milvus.io/">Milvus</a> y <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> para añadir memoria semántica a sus agentes.</p></li>
<li><p>Eche un vistazo a LangGraph para gestionar el estado de la sesión</p></li>
<li><p>Lee <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">la investigación completa de Anthropic</a> sobre arneses de agentes de larga duración</p></li>
</ul>
<p><strong>¿Tiene preguntas o quiere compartir lo que está construyendo?</strong></p>
<ul>
<li><p>Únase a la <a href="https://milvus.io/slack">comunidad Milvus Slack</a> para conectarse con otros desarrolladores</p></li>
<li><p>Asista a <a href="https://milvus.io/office-hours">las horas de oficina de Milvus</a> para preguntas y respuestas en directo con el equipo</p></li>
</ul>
