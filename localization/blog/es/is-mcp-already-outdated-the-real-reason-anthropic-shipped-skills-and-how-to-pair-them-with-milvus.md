---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  ¿Está ya anticuado el MCP? La verdadera razón por la que Anthropic envió
  habilidades y cómo combinarlas con Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Descubra cómo funciona Skills para reducir el consumo de tokens y cómo Skills
  y MCP colaboran con Milvus para mejorar los flujos de trabajo de IA.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>En las últimas semanas ha surgido una discusión sorprendentemente acalorada en X y Hacker News: <em>¿Siguen siendo necesarios los servidores MCP?</em> Algunos desarrolladores afirman que MCP está sobredimensionado, hambriento de tokens y fundamentalmente desalineado con la forma en que los agentes deberían usar las herramientas. Otros defienden MCP como la forma más fiable de exponer las capacidades del mundo real a los modelos lingüísticos. Dependiendo del hilo que se lea, MCP es el futuro del uso de herramientas o está muerto nada más llegar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustración es comprensible. MCP ofrece un acceso sólido a sistemas externos, pero también obliga al modelo a cargar esquemas largos, descripciones detalladas y listas de herramientas interminables. Eso añade un coste real. Si se descarga la transcripción de una reunión y luego se introduce en otra herramienta, el modelo puede volver a procesar el mismo texto varias veces, inflando el uso de tokens sin ningún beneficio obvio. Para los equipos que trabajan a gran escala, esto no es un inconveniente, sino una factura.</p>
<p>Pero declarar obsoleto el MCP es prematuro. Anthropic -el mismo equipo que inventó MCP- introdujo silenciosamente algo nuevo: <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Las habilidades son definiciones ligeras de Markdown/YAML que describen <em>cómo</em> y <em>cuándo</em> debe utilizarse una herramienta. En lugar de volcar esquemas completos en la ventana contextual, el modelo lee primero metadatos compactos y los utiliza para planificar. En la práctica, Skills reduce drásticamente la sobrecarga de tokens y ofrece a los desarrolladores un mayor control sobre la orquestación de herramientas.</p>
<p>¿Significa esto que Skills sustituirá a MCP? No del todo. Las Skills agilizan la planificación, pero MCP sigue proporcionando las capacidades reales: lectura de archivos, llamadas a API, interacción con sistemas de almacenamiento o conexión a infraestructuras externas como <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de código abierto que sustenta una rápida recuperación semántica a escala, lo que la convierte en un backend fundamental cuando sus Skills necesitan acceder a datos reales.</p>
<p>En este artículo se explica qué hacen bien las Skills, dónde sigue siendo importante MCP y cómo encajan ambas en la arquitectura de agentes en evolución de Anthropic. Luego veremos cómo construir sus propias habilidades que se integran limpiamente con Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">¿Qué son y cómo funcionan las habilidades de los agentes de Anthropic?<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Uno de los antiguos puntos débiles de los agentes de IA tradicionales es que las instrucciones se pierden a medida que crece la conversación.</p>
<p>Incluso con las instrucciones del sistema más cuidadosamente elaboradas, el comportamiento del modelo puede desviarse gradualmente a lo largo de la conversación. Tras varios turnos, Claude empieza a olvidar o a perder de vista las instrucciones originales.</p>
<p>El problema radica en la estructura de la instrucción del sistema. Se trata de una inyección única y estática que compite por el espacio en la ventana de contexto del modelo, junto con el historial de la conversación, los documentos y cualquier otra entrada. A medida que la ventana de contexto se va llenando, la atención del modelo a la indicación del sistema se diluye cada vez más, lo que provoca una pérdida de coherencia a lo largo del tiempo.</p>
<p>Las competencias se diseñaron para resolver este problema. Las habilidades son carpetas que contienen instrucciones, guiones y recursos. En lugar de depender de un mensaje estático del sistema, las habilidades dividen la experiencia en paquetes de instrucciones modulares, reutilizables y persistentes que Claude puede descubrir y cargar dinámicamente cuando lo necesite para una tarea.</p>
<p>Cuando Claude inicia una tarea, primero realiza un escaneo ligero de todas las habilidades disponibles leyendo sólo sus metadatos YAML (sólo unas pocas docenas de tokens). Estos metadatos proporcionan información suficiente para que Claude determine si una habilidad es relevante para la tarea actual. En caso afirmativo, Claude se expande al conjunto completo de instrucciones (normalmente menos de 5k tokens), y sólo se cargan recursos o scripts adicionales si es necesario.</p>
<p>Esta revelación progresiva permite a Claude inicializar una Skill con sólo 30-50 tokens, mejorando significativamente la eficiencia y reduciendo la sobrecarga innecesaria de contexto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Comparación de Skills con Prompts, Projects, MCP y Subagents<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>El panorama actual de herramientas de modelado puede parecer abarrotado. Incluso dentro del ecosistema de Claude, hay varios componentes distintos: Habilidades, avisos, proyectos, subagentes y MCP.</p>
<p>Ahora que entendemos qué son las Habilidades y cómo funcionan a través de paquetes de instrucciones modulares y carga dinámica, necesitamos saber cómo se relacionan las Habilidades con otras partes del ecosistema Claude, especialmente MCP. He aquí un resumen:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Habilidades</h3><p>Las Skills son carpetas que contienen instrucciones, scripts y recursos. Claude las descubre y las carga dinámicamente utilizando una revelación progresiva: primero los metadatos, luego las instrucciones completas y, por último, los archivos necesarios.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Flujos de trabajo organizativos (directrices de marca, procedimientos de cumplimiento).</p></li>
<li><p>Conocimientos especializados (fórmulas de Excel, análisis de datos)</p></li>
<li><p>Preferencias personales (sistemas para tomar notas, patrones de codificación)</p></li>
<li><p>Tareas profesionales que necesitan ser reutilizadas a través de conversaciones (revisiones de seguridad de código basadas en OWASP)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Indicaciones</h3><p>Las indicaciones son las instrucciones en lenguaje natural que das a Claude en una conversación. Son temporales y sólo existen en la conversación actual.</p>
<p><strong>Lo mejor para:</strong></p>
<ul>
<li><p>Peticiones puntuales (resumir un artículo, dar formato a una lista).</p></li>
<li><p>Perfeccionamiento de la conversación (ajustar el tono, añadir detalles)</p></li>
<li><p>Contexto inmediato (analizar datos concretos, interpretar contenidos)</p></li>
<li><p>Instrucciones ad hoc</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Proyectos</h3><p>Los proyectos son espacios de trabajo autónomos con sus propios historiales de chat y bases de conocimientos. Cada proyecto ofrece una ventana de contexto de 200K. Cuando los conocimientos del proyecto se acercan a los límites del contexto, Claude pasa sin problemas al modo RAG, lo que permite multiplicar por 10 la capacidad efectiva.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Contexto persistente (por ejemplo, todas las conversaciones relacionadas con el lanzamiento de un producto).</p></li>
<li><p>Organización del espacio de trabajo (contextos separados para diferentes iniciativas)</p></li>
<li><p>Colaboración en equipo (en los planes Team y Enterprise)</p></li>
<li><p>Instrucciones personalizadas (tono o perspectiva específicos del proyecto)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Subagentes</h3><p>Los subagentes son asistentes de IA especializados con sus propias ventanas contextuales, instrucciones personalizadas del sistema y permisos específicos para las herramientas. Pueden trabajar de forma independiente y devolver los resultados al agente principal.</p>
<p><strong>Lo mejor para:</strong></p>
<ul>
<li><p>Especialización de tareas (revisión de código, generación de pruebas, auditorías de seguridad).</p></li>
<li><p>Gestión del contexto (mantener centrada la conversación principal)</p></li>
<li><p>Procesamiento paralelo (varios subagentes trabajando simultáneamente en diferentes aspectos)</p></li>
<li><p>Restricción de herramientas (por ejemplo, acceso de sólo lectura)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Protocolo de Contexto de Modelo)</h3><p>El Protocolo de Contexto de Modelo (MCP) es un estándar abierto que conecta modelos de IA con herramientas externas y fuentes de datos.</p>
<p><strong>Lo mejor para:</strong></p>
<ul>
<li><p>Acceder a datos externos (Google Drive, Slack, GitHub, bases de datos).</p></li>
<li><p>Utilizar herramientas empresariales (sistemas CRM, plataformas de gestión de proyectos)</p></li>
<li><p>Conectar con entornos de desarrollo (archivos locales, IDEs, control de versiones)</p></li>
<li><p>Integración con sistemas personalizados (herramientas y fuentes de datos propias)</p></li>
</ul>
<p>En base a lo anterior, podemos ver que Habilidades y MCP abordan diferentes desafíos y trabajan juntos para complementarse.</p>
<table>
<thead>
<tr><th><strong>Dimensión</strong></th><th><strong>MCP</strong></th><th><strong>Habilidades</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Valor fundamental</strong></td><td>Conecta con sistemas externos (bases de datos, API, plataformas SaaS)</td><td>Define especificaciones de comportamiento (cómo procesar y presentar datos)</td></tr>
<tr><td><strong>Preguntas con respuesta</strong></td><td>"¿A qué puede acceder Claude?</td><td>"¿Qué debe hacer Claude?"</td></tr>
<tr><td><strong>Implementación</strong></td><td>Protocolo cliente-servidor + esquema JSON</td><td>Archivo Markdown + metadatos YAML</td></tr>
<tr><td><strong>Consumo de contexto</strong></td><td>Decenas de miles de tokens (acumulaciones en varios servidores)</td><td>30-50 tokens por operación</td></tr>
<tr><td><strong>Casos de uso</strong></td><td>Consulta de grandes bases de datos, llamada a las API de GitHub</td><td>Definición de estrategias de búsqueda, aplicación de reglas de filtrado, formato de salida</td></tr>
</tbody>
</table>
<p>Tomemos como ejemplo la búsqueda de código.</p>
<ul>
<li><p><strong>MCP (por ejemplo, claude-context):</strong> Proporciona la capacidad de acceder a la base de datos de vectores Milvus.</p></li>
<li><p><strong>Habilidades:</strong> Define el flujo de trabajo, como priorizar el código modificado más recientemente, ordenar los resultados por relevancia y presentar los datos en una tabla Markdown.</p></li>
</ul>
<p>MCP proporciona la capacidad, mientras que Skills define el proceso. Juntos, forman una pareja complementaria.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Cómo crear competencias personalizadas con Claude-Context y Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> es un plugin MCP que añade la funcionalidad de búsqueda semántica de código a Claude Code, convirtiendo toda la base de código en el contexto de Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Requisitos previos</h3><p>Requisitos del sistema:</p>
<ul>
<li><p><strong>Node.js</strong>: Versión &gt;= 20.0.0 y &lt; 24.0.0</p></li>
<li><p><strong>OpenAI API Key</strong> (para incrustar modelos)</p></li>
<li><p><strong>Clave API</strong><a href="https://zilliz.com.cn/"><strong>de Zilliz Cloud</strong></a> (servicio Milvus gestionado)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Paso 1: Configurar el servicio MCP (claude-context)</h3><p>Ejecuta el siguiente comando en el terminal:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Compruebe la configuración:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La configuración MCP está completa. Claude ya puede acceder a la base de datos de vectores de Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Paso 2: Crear la Habilidad</h3><p>Cree el directorio Skills:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Cree el archivo SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Paso 3: Reinicie Claude para aplicar las habilidades</h3><p>Ejecute el siguiente comando para reiniciar Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> Una vez completada la configuración, puede utilizar inmediatamente las habilidades para consultar el código base de Milvus.</p>
<p>A continuación se muestra un ejemplo de cómo funciona.</p>
<p>Consulta: ¿Cómo funciona Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>En esencia, las habilidades actúan como un mecanismo para encapsular y transferir conocimientos especializados. Mediante el uso de habilidades, la IA puede heredar la experiencia de un equipo y seguir las mejores prácticas del sector, ya sea una lista de comprobación para la revisión del código o las normas de documentación. Cuando este conocimiento tácito se hace explícito a través de archivos Markdown, la calidad de los resultados generados por la IA puede experimentar una mejora significativa.</p>
<p>De cara al futuro, la capacidad de aprovechar eficazmente las habilidades podría convertirse en un factor diferenciador clave en la forma en que los equipos y las personas utilizan la IA en su beneficio.</p>
<p>A medida que explora el potencial de la IA en su organización, Milvus se erige como una herramienta fundamental para la gestión y búsqueda de datos vectoriales a gran escala. Al combinar la potente base de datos vectorial de Milvus con herramientas de IA como Skills, puede mejorar no solo sus flujos de trabajo, sino también la profundidad y la velocidad de sus conocimientos basados en datos.</p>
<p>¿Tiene alguna pregunta o desea profundizar en alguna función? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> para charlar con nuestros ingenieros y otros ingenieros de IA de la comunidad. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
