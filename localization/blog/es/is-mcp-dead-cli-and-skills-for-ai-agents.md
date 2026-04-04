---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: >-
  ¿Ha muerto MCP? Lo que aprendimos Construyendo con MCP, CLI y habilidades de
  agente
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP se come el contexto, se rompe en producción y no puede reutilizar el LLM
  de su agente. Construimos con los tres - aquí es cuando cada uno encaja.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Cuando Denis Yarats, CTO de Perplexity, dijo en ASK 2026 que la compañía estaba quitando prioridad a MCP internamente, se inició el ciclo habitual. El CEO de YC, Garry Tan, arremetió: MCP se come demasiada ventana de contexto, auth está roto, él construyó un reemplazo CLI en 30 minutos. Hacker News se posicionó fuertemente en contra de MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hace un año, este nivel de escepticismo público habría sido inusual. Model Context Protocol (MCP) se posicionaba como el estándar definitivo para la integración de herramientas <a href="https://zilliz.com/glossary/ai-agents">de agentes de IA</a>. El número de servidores se duplicaba cada semana. Desde entonces, el patrón ha seguido un arco familiar: rápido bombo y platillo, amplia adopción y, a continuación, desilusión en la producción.</p>
<p>El sector está reaccionando con rapidez. Lark/Feishu, de Bytedance, puso a disposición pública su CLI oficial: más de 200 comandos en 11 dominios empresariales con 19 habilidades de agente integradas. Google lanzó gws para Google Workspace. El patrón CLI + Skills se está convirtiendo rápidamente en el predeterminado para las herramientas de agentes empresariales, no en una alternativa de nicho.</p>
<p>En Zilliz, hemos lanzado <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>, que le permite operar y gestionar <a href="https://milvus.io/intro">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus totalmente gestionado) directamente desde su terminal sin salir de su entorno de codificación. Además, hemos creado <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> y <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>para que los agentes de codificación de IA como Claude Code y Codex puedan gestionar su <a href="https://zilliz.com/learn/what-is-vector-database">base de datos de vectores</a> a través del lenguaje natural.</p>
<p>También construimos un servidor MCP para Milvus y Zilliz Cloud hace un año. Esa experiencia nos enseñó exactamente dónde se rompe MCP - y donde todavía encaja. Tres limitaciones arquitectónicas nos empujaron hacia CLI y Skills: hinchazón de la ventana de contexto, diseño pasivo de la herramienta, y la incapacidad de reutilizar el propio LLM del agente.</p>
<p>En este post, repasaremos cada problema, mostraremos lo que estamos construyendo en su lugar y estableceremos un marco práctico para elegir entre MCP, CLI y Agent Skills.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP consume el 72% de su ventana de contexto al inicio<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Una configuración estándar de MCP puede consumir alrededor del 72% de su ventana de contexto disponible antes de que el agente realice una sola acción. Conecte tres servidores - GitHub, Playwright, y una integración IDE - en un modelo de 200K tokens, y sólo las definiciones de herramientas ocupan aproximadamente 143K tokens. El agente aún no ha hecho nada. Ya está lleno en tres cuartas partes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El coste no es sólo de tokens. Cuanto más contenido no relacionado se incluya en el contexto, menos se centrará el modelo en lo que realmente importa. Un centenar de esquemas de herramientas en el contexto significa que el agente tiene que vadearlos todos en cada decisión. Los investigadores han documentado lo que denominan <em>"putrefacción del contexto"</em>, es decir, la degradación de la calidad del razonamiento por sobrecarga de contexto. En las pruebas realizadas, la precisión en la selección de herramientas descendió del 43% a menos del 14% a medida que aumentaba el número de herramientas. Más herramientas, paradójicamente, significa peor uso de las mismas.</p>
<p>La causa es arquitectónica. MCP carga todas las descripciones de las herramientas al inicio de la sesión, independientemente de si la conversación actual las utilizará o no. Se trata de una elección de diseño a nivel de protocolo, no de un error, pero el coste aumenta con cada herramienta que se añade.</p>
<p>Las habilidades de los agentes adoptan un enfoque diferente: <strong>la divulgación progresiva</strong>. Al inicio de la sesión, un agente sólo lee los metadatos de cada habilidad: nombre, descripción de una línea, condición desencadenante. Unas pocas docenas de tokens en total. El contenido completo de la habilidad sólo se carga cuando el agente determina que es relevante. Piénselo de este modo: MCP te pone todas las herramientas en la puerta y te obliga a elegir; Skills te ofrece primero un índice y, a continuación, el contenido completo bajo demanda.</p>
<p>Las herramientas CLI ofrecen una ventaja similar. Un agente ejecuta git --help o docker --help para descubrir capacidades bajo demanda, sin precargar cada definición de parámetro. El coste del contexto se paga sobre la marcha, no por adelantado.</p>
<p>A pequeña escala, la diferencia es insignificante. A escala de producción, es la diferencia entre un agente que funciona y otro que se ahoga en sus propias definiciones de herramientas.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">La arquitectura pasiva de MCP limita los flujos de trabajo de los agentes<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP es un protocolo de llamada a herramientas: cómo descubrir herramientas, llamarlas y recibir resultados. Un diseño limpio para casos de uso sencillos. Pero esa limpieza es también una limitación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Espacio de herramientas plano sin jerarquía</h3><p>Una herramienta MCP es una firma de función plana. Sin subcomandos, sin conocimiento del ciclo de vida de la sesión, sin sentido de dónde se encuentra el agente en un flujo de trabajo de múltiples pasos. Espera a ser llamado. Eso es todo lo que hace.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una CLI funciona de forma diferente. git commit, git push y git log son rutas de ejecución completamente diferentes que comparten una única interfaz. Un agente ejecuta --help, explora la superficie disponible incrementalmente, y expande sólo lo que necesita - sin cargar por adelantado toda la documentación de parámetros en contexto.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Las habilidades codifican la lógica del flujo de trabajo - MCP no puede</h3><p>Una habilidad de agente es un archivo Markdown que contiene un procedimiento operativo estándar: qué hacer primero, qué hacer después, cómo gestionar los fallos y cuándo mostrar algo al usuario. El agente no recibe sólo una herramienta, sino todo un flujo de trabajo. Las habilidades configuran activamente cómo se comporta un agente durante una conversación: qué las activa, qué prepara de antemano y cómo se recupera de los errores. Las herramientas MCP sólo pueden esperar.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP no puede acceder al LLM del agente</h3><p>Esta es la limitación que realmente nos detuvo.</p>
<p>Cuando construimos <a href="https://github.com/zilliztech/claude-context">claude-context</a> - un plugin MCP que añade <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a> a Claude Code y a otros agentes de codificación de IA, dándoles un contexto profundo de toda una base de código - queríamos recuperar fragmentos de conversaciones históricas relevantes de Milvus y mostrarlos como contexto. La recuperación <a href="https://zilliz.com/learn/vector-similarity-search">mediante búsqueda vectorial</a> funcionó. El problema era qué hacer con los resultados.</p>
<p>Si recuperamos los 10 primeros resultados, puede que 3 sean útiles. Los otros 7 son ruido. Si se entregan los 10 al agente externo, el ruido interfiere en la respuesta. En las pruebas, vimos que las respuestas se distraían con registros históricos irrelevantes. Necesitábamos filtrar antes de pasar los resultados.</p>
<p>Probamos varios métodos. Añadir un paso de reordenación dentro del servidor MCP utilizando un modelo pequeño: no era lo suficientemente preciso, y el umbral de relevancia necesitaba un ajuste por caso de uso. Utilizar un modelo grande para la reordenación: técnicamente correcto, pero un servidor MCP se ejecuta como un proceso independiente sin acceso al LLM del agente externo. Tendríamos que configurar un cliente LLM separado, gestionar una clave API separada y manejar una ruta de llamada separada.</p>
<p>Lo que queríamos era sencillo: dejar que el LLM del agente externo participara directamente en la decisión de filtrado. Recuperar los 10 primeros, dejar que el propio agente juzgue qué merece la pena conservar y devolver sólo los resultados relevantes. Sin un segundo modelo. Sin claves API adicionales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP no puede hacer esto. El límite del proceso entre el servidor y el agente es también un límite de inteligencia. El servidor no puede usar el LLM del agente; el agente no puede gobernar lo que ocurre dentro del servidor. Bien para herramientas CRUD simples. En el momento en que una herramienta necesita tomar decisiones, ese aislamiento se convierte en una restricción real.</p>
<p>Una Habilidad de Agente resuelve esto directamente. Una habilidad de recuperación puede llamar a la búsqueda vectorial de los 10 primeros, hacer que el propio LLM del agente evalúe la relevancia, y devolver sólo lo que pase. No hay modelo adicional. El agente realiza el filtrado por sí mismo.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">Lo que construimos en su lugar con CLI y Skills<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Vemos CLI + Skills como la dirección para la interacción agente-herramienta, no sólo para la recuperación de memoria, sino en toda la pila. Esta convicción impulsa todo lo que estamos construyendo.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: Una capa de memoria basada en habilidades para agentes de IA</h3><p>Hemos creado <a href="https://github.com/zilliztech/memsearch">memsearch</a>, una capa de memoria de código abierto para Claude Code y otros agentes de IA. La habilidad se ejecuta dentro de un subagente con tres etapas: Milvus se encarga de la búsqueda vectorial inicial para un amplio descubrimiento, el propio LLM del agente evalúa la relevancia y amplía el contexto para obtener resultados prometedores, y un desglose final accede a las conversaciones originales sólo cuando es necesario. El ruido se descarta en cada etapa: la basura intermedia de la recuperación nunca llega a la ventana de contexto principal.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La clave: la inteligencia del agente forma parte de la ejecución de la herramienta. El LLM que ya está en el bucle se encarga del filtrado: no hay un segundo modelo, ni una clave API adicional, ni un frágil ajuste de umbrales. Este es un caso de uso específico -recuperación del contexto de conversación para agentes de codificación-, pero la arquitectura se generaliza a cualquier escenario en el que una herramienta necesite juicio, no sólo ejecución.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills y Plugin para operaciones de bases de datos vectoriales</h3><p>Milvus es la base de datos vectorial de código abierto más adoptada del mundo, con <a href="https://github.com/milvus-io/milvus">más de 43.000 estrellas en GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> es el servicio totalmente gestionado de Milvus con características empresariales avanzadas y es mucho más rápido que Milvus.</p>
<p>La misma arquitectura en capas mencionada anteriormente impulsa nuestras herramientas para desarrolladores:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> es la capa de infraestructura. Gestión de clústeres, <a href="https://milvus.io/docs/manage-collections.md">operaciones de recolección</a>, búsqueda de vectores, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, copias de seguridad, facturación: todo lo que harías en la consola de Zilliz Cloud, disponible desde el terminal. Los humanos y los agentes utilizan los mismos comandos. Zilliz CLI también sirve como base para Milvus Skills y Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> es la capa de conocimiento para Milvus de código abierto. Enseña a los agentes de codificación AI (Claude Code, Cursor, Codex, GitHub Copilot) a operar cualquier despliegue Milvus - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone o Distributed - a través de código Python <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>: conexiones, <a href="https://milvus.io/docs/schema-hands-on.md">diseño de esquemas</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">búsqueda híbrida</a>, <a href="https://milvus.io/docs/full-text-search.md">búsqueda de texto completo</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> hace lo mismo para Zilliz Cloud, enseñando a los agentes a gestionar la infraestructura de la nube a través de Zilliz CLI.</li>
<li>Zilliz<a href="https://github.com/zilliztech/zilliz-plugin">Plugin</a> es la capa de experiencia del desarrollador para Claude Code - envuelve CLI + Skill en una experiencia guiada con comandos de barra como /zilliz:quickstart y /zilliz:status.</li>
</ul>
<p>CLI se encarga de la ejecución, Skills codifica el conocimiento y la lógica del flujo de trabajo, Plugin ofrece la UX. Sin servidor MCP en el bucle.</p>
<p>Para más detalles, consulte estos recursos:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Presentación de Zilliz CLI y Agent Skills para Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud acaba de aterrizar en Claude Code</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI Prompts - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Referencia de Zilliz CLI - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill - Centro de desarrollo de Zilliz Cloud</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus para agentes de IA - Documentación de Milvus</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">¿Está muriendo realmente MCP?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchos desarrolladores y empresas, incluidos nosotros aquí en Zilliz, están recurriendo a CLI y Skills. Pero, ¿está muriendo realmente MCP?</p>
<p>La respuesta corta: no - pero su alcance se está reduciendo a donde realmente cabe.</p>
<p>MCP ha sido donado a la Fundación Linux. Los servidores activos superan los 10.000. Las descargas mensuales del SDK ascienden a 97 millones. Un ecosistema de ese tamaño no desaparece por un comentario en una conferencia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un hilo de Hacker News - <em>"¿Cuándo tiene sentido MCP frente a CLI?"</em> - suscitó respuestas mayoritariamente favorables a la CLI: "Las herramientas CLI son como instrumentos de precisión", "Las CLI también parecen más ágiles que los MCP". Algunos desarrolladores tienen una opinión más equilibrada: Las habilidades son una receta detallada que te ayuda a resolver mejor un problema; MCP es la herramienta que te ayuda a resolver el problema. Ambas tienen su lugar.</p>
<p>Es justo, pero plantea una cuestión práctica. Si la propia receta puede orientar al agente sobre qué herramientas utilizar y cómo, ¿sigue siendo necesario un protocolo independiente de distribución de herramientas?</p>
<p>Depende del caso de uso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>MCP sobre stdio</strong> -la versión que la mayoría de los desarrolladores ejecutan localmente- es donde se acumulan los problemas: comunicación inestable entre procesos, aislamiento desordenado del entorno, elevada sobrecarga de tokens. En ese contexto, existen alternativas mejores para casi todos los casos de uso.</p>
<p><strong>MCP sobre HTTP</strong> es una historia diferente. Las plataformas de herramientas internas de las empresas necesitan una gestión de permisos centralizada, OAuth unificado, telemetría y registro estandarizados. Las herramientas CLI fragmentadas tienen verdaderos problemas para proporcionar todo esto. La arquitectura centralizada de MCP tiene un valor real en ese contexto.</p>
<p>Lo que Perplexity realmente abandonó fue principalmente el caso de uso stdio. Denis Yarats especificó "internamente" y no pidió la adopción de esa opción en toda la industria. Ese matiz se perdió en la transmisión - "Perplexity abandona MCP" se difunde considerablemente más rápido que "Perplexity desprioriza MCP sobre stdio para la integración de herramientas internas".</p>
<p>MCP surgió porque resolvía un problema real: antes de él, cada aplicación de IA escribía su propia lógica de llamada a herramientas, sin un estándar compartido. MCP proporcionó una interfaz unificada en el momento oportuno, y el ecosistema se creó rápidamente. Después, la experiencia de producción hizo aflorar las limitaciones. Se trata de un arco normal para las herramientas de infraestructura, no de una sentencia de muerte.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Cuándo utilizar MCP, CLI o habilidades<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
<tr><th></th><th>MCP sobre stdio (Local)</th><th>MCP sobre HTTP (Empresa)</th></tr>
</thead>
<tbody>
<tr><td><strong>Autenticación</strong></td><td>Ninguna</td><td>OAuth, centralizada</td></tr>
<tr><td><strong>Estabilidad de la conexión</strong></td><td>Problemas de aislamiento de procesos</td><td>HTTPS estable</td></tr>
<tr><td><strong>Registro</strong></td><td>Sin mecanismo estándar</td><td>Telemetría centralizada</td></tr>
<tr><td><strong>Control de acceso</strong></td><td>Ninguno</td><td>Permisos basados en roles</td></tr>
<tr><td><strong>Nuestra opinión</strong></td><td>Sustituir por CLI + Habilidades</td><td>Mantener para herramientas empresariales</td></tr>
</tbody>
</table>
<p>Para los equipos que eligen su pila de herramientas <a href="https://zilliz.com/glossary/ai-agents">de IA agéntica</a>, así es como encajan las capas:</p>
<table>
<thead>
<tr><th>Capa</th><th>Qué hace</th><th>Mejor para</th><th>Ejemplos</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Tareas operativas, gestión de infraestructuras</td><td>Comandos que ejecutan tanto agentes como humanos</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Habilidades</strong></td><td>Lógica de flujo de trabajo del agente, conocimiento codificado</td><td>Tareas que requieren juicio LLM, SOP de varios pasos</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>API REST</strong></td><td>Integraciones externas</td><td>Conexión a servicios de terceros</td><td>API de GitHub, API de Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Plataformas de herramientas empresariales</td><td>Autenticación centralizada, registro de auditoría</td><td>Pasarelas de herramientas internas</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Para empezar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Todo lo que hemos comentado en este artículo está disponible hoy mismo:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - la capa de memoria basada en Skills para agentes de IA. Introdúzcalo en Claude Code o en cualquier agente que soporte Skills.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - gestiona Milvus y Zilliz Cloud desde tu terminal. Instálalo y explora los subcomandos que tus agentes pueden usar.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> y <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> - proporcione a su agente de codificación de IA conocimientos nativos de Milvus y Zilliz Cloud.</li>
</ul>
<p>¿Tienes preguntas sobre la búsqueda vectorial, la arquitectura de agentes o la construcción con CLI y Skills? Únase a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad Milvus Discord</a> o <a href="https://milvus.io/office-hours">reserve una sesión gratuita de Office Hours</a> para hablar sobre su caso de uso.</p>
<p>¿Listo para construir? Regístrese <a href="https://cloud.zilliz.com/signup">en Zilliz Cloud</a>: las cuentas nuevas con una dirección de correo electrónico laboral obtienen 100 $ en créditos gratuitos. ¿Ya tienes una cuenta? <a href="https://cloud.zilliz.com/login">Entra aquí</a>.</p>
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">¿Qué tiene de malo MCP para los agentes de IA?</h3><p>MCP tiene tres limitaciones arquitectónicas principales en producción. En primer lugar, carga todos los esquemas de herramientas en la ventana de contexto al inicio de la sesión: la conexión de sólo tres servidores MCP en un modelo de 200.000 tokens puede consumir más del 70% del contexto disponible antes de que el agente haga nada. En segundo lugar, las herramientas MCP son pasivas: esperan a ser llamadas y no pueden codificar flujos de trabajo de varios pasos, lógica de gestión de errores o procedimientos operativos estándar. En tercer lugar, los servidores MCP se ejecutan como procesos independientes sin acceso al LLM del agente, por lo que cualquier herramienta que necesite juicio (como filtrar los resultados de búsqueda por relevancia) requiere configurar un modelo independiente con su propia clave API. Estos problemas son más graves con MCP sobre stdio; MCP sobre HTTP mitiga algunos de ellos.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">¿Cuál es la diferencia entre MCP y Agent Skills?</h3><p>MCP es un protocolo de llamada a herramientas que define cómo un agente descubre e invoca herramientas externas. Una habilidad de agente es un archivo Markdown que contiene un procedimiento operativo estándar completo: disparadores, instrucciones paso a paso, gestión de errores y reglas de escalado. La diferencia arquitectónica clave: Las habilidades se ejecutan dentro del proceso del agente, por lo que pueden aprovechar el LLM del propio agente para emitir juicios como el filtrado de relevancia o la reevaluación de resultados. Las herramientas MCP se ejecutan en un proceso independiente y no pueden acceder a la inteligencia del agente. Skills también utiliza la divulgación progresiva (sólo se cargan metadatos ligeros al inicio y el contenido completo cuando se solicita), lo que reduce al mínimo el uso de la ventana de contexto en comparación con la carga inicial de esquemas de MCP.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">¿Cuándo debería seguir utilizando MCP en lugar de CLI o Skills?</h3><p>MCP sobre HTTP sigue teniendo sentido para las plataformas de herramientas empresariales en las que se necesita OAuth centralizado, control de acceso basado en roles, telemetría estandarizada y registro de auditoría en muchas herramientas internas. Las herramientas CLI fragmentadas tienen dificultades para proporcionar estos requisitos empresariales de forma coherente. Para los flujos de trabajo de desarrollo local - donde los agentes interactúan con las herramientas en su máquina - CLI + Skills normalmente ofrece un mejor rendimiento, menor sobrecarga de contexto y una lógica de flujo de trabajo más flexible que MCP sobre stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">¿Cómo funcionan juntas las herramientas CLI y las Habilidades de Agente?</h3><p>CLI proporciona la capa de ejecución (los comandos reales), mientras que Skills proporciona la capa de conocimiento (cuándo ejecutar qué comandos, en qué orden y cómo manejar los fallos). Por ejemplo, la CLI de Zilliz se encarga de operaciones de infraestructura como la gestión de clusters, el CRUD de colecciones y la búsqueda de vectores. Milvus Skill enseña al agente los patrones pymilvus adecuados para el diseño de esquemas, la búsqueda híbrida y las canalizaciones RAG. La CLI hace el trabajo; la Skill conoce el flujo de trabajo. Este patrón en capas - CLI para la ejecución, Skills para el conocimiento, un plugin para UX - es como hemos estructurado todas nuestras herramientas para desarrolladores en Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI: ¿cuándo debo usar cada una?</h3><p>Las herramientas CLI como git, docker, o zilliz-cli son mejores para tareas operativas - exponen subcomandos jerárquicos y se cargan bajo demanda. Habilidades como milvus-skill son mejores para la lógica del flujo de trabajo del agente - llevan procedimientos operativos, recuperación de errores y pueden acceder al LLM del agente. MCP sobre HTTP todavía se ajusta a las plataformas de herramientas empresariales que necesitan OAuth centralizado, permisos y registro de auditoría. MCP sobre stdio - la versión local - está siendo reemplazada por CLI + Skills en la mayoría de las configuraciones de producción.</p>
