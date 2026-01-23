---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Cómo las habilidades antrópicas cambian las herramientas de los agentes - y
  cómo crear una habilidad personalizada para Milvus para hacer girar
  rápidamente la RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Aprenda qué son las Habilidades y cómo crear una Habilidad personalizada en
  Claude Code que construya sistemas RAG respaldados por Milvus a partir de
  instrucciones en lenguaje natural utilizando un flujo de trabajo reutilizable.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>El uso de herramientas es una parte importante para que un agente funcione. El agente tiene que elegir la herramienta adecuada, decidir cuándo llamarla y formatear las entradas correctamente. Sobre el papel parece sencillo, pero una vez que empiezas a construir sistemas reales, te encuentras con un montón de casos extremos y modos de fallo.</p>
<p>Muchos equipos utilizan definiciones de herramientas del estilo de MCP para organizar esto, pero MCP tiene algunas asperezas. El modelo tiene que razonar sobre todas las herramientas a la vez, y no hay mucha estructura para guiar sus decisiones. Además, cada definición de herramienta tiene que vivir en la ventana de contexto. Algunas de ellas son grandes (el MCP de GitHub tiene unos 26.000 tokens), lo que se come el contexto antes incluso de que el agente empiece a trabajar de verdad.</p>
<p>Anthropic introdujo <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>las habilidades</strong></a> para mejorar esta situación. Las habilidades son más pequeñas, más específicas y más fáciles de cargar bajo demanda. En lugar de volcar todo en el contexto, se empaqueta la lógica del dominio, los flujos de trabajo o los scripts en unidades compactas que el agente puede utilizar sólo cuando sea necesario.</p>
<p>En este artículo, explicaré cómo funcionan las competencias antrópicas y, a continuación, explicaré cómo crear una sencilla competencia en Claude Code que convierta el lenguaje natural en una base de conocimientos <a href="https://milvus.io/">respaldada por Milvus</a>: una configuración rápida para RAG sin cableado adicional.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">¿Qué son las Habilidades Antrópicas?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Las Habilidades<a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Antrópicas</a> (o Habilidades de Agente) son carpetas que agrupan las instrucciones, scripts y archivos de referencia que un agente necesita para realizar una tarea específica. Piense en ellas como pequeños paquetes de capacidades autónomas. Una habilidad puede definir cómo generar un informe, ejecutar un análisis o seguir un determinado flujo de trabajo o conjunto de reglas.</p>
<p>La idea clave es que las competencias son modulares y pueden cargarse a demanda. En lugar de introducir enormes definiciones de herramientas en la ventana de contexto, el agente sólo extrae la competencia que necesita. De este modo, se reduce el uso del contexto y se proporciona al modelo una orientación clara sobre qué herramientas existen, cuándo llamarlas y cómo ejecutar cada paso.</p>
<p>El formato es intencionadamente simple, y por eso, ya es compatible o fácilmente adaptable a través de un montón de herramientas para desarrolladores - Claude Code, Cursor, extensiones de VS Code, integraciones de GitHub, configuraciones de estilo Codex, y así sucesivamente.</p>
<p>Una Skill sigue una estructura de carpetas coherente:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Archivo principal)</strong></p>
<p>Es la guía de ejecución para el agente, el documento que le indica exactamente cómo debe realizar la tarea. Define los metadatos de la habilidad (como el nombre, la descripción y las palabras clave de activación), el flujo de ejecución y la configuración predeterminada. En este archivo, debe describir claramente</p>
<ul>
<li><p><strong>Cuándo debe ejecutarse la Skill:</strong> Por ejemplo, desencadenar la Skill cuando la entrada del usuario incluya una frase como "procesar archivos CSV con Python".</p></li>
<li><p><strong>Cómo debe ejecutarse la tarea:</strong> Disponga los pasos de ejecución en orden, como por ejemplo: interpretar la solicitud del usuario → llamar a scripts de preprocesamiento del directorio <code translate="no">scripts/</code> → generar el código requerido → formatear la salida utilizando plantillas de <code translate="no">templates/</code>.</p></li>
<li><p><strong>Reglas y restricciones:</strong> Especifica detalles como convenciones de codificación, formatos de salida y cómo deben tratarse los errores.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Guiones de ejecución)</strong></p>
<p>Este directorio contiene scripts preescritos en lenguajes como Python, Shell o Node.js. El agente puede llamar a estos scripts directamente, en lugar de generar el mismo código repetidamente en tiempo de ejecución. Algunos ejemplos típicos son <code translate="no">create_collection.py</code> y <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Plantillas de documentos)</strong></p>
<p>Archivos de plantillas reutilizables que el agente puede utilizar para generar contenido personalizado. Algunos ejemplos habituales son las plantillas de informes o las plantillas de configuración.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Materiales de referencia)</strong></p>
<p>Documentos de referencia que el agente puede consultar durante la ejecución, como documentación de API, especificaciones técnicas o guías de mejores prácticas.</p>
<p>En general, esta estructura refleja cómo se entrega el trabajo a un nuevo compañero de equipo: <code translate="no">SKILL.md</code> explica el trabajo, <code translate="no">scripts/</code> proporciona herramientas listas para usar, <code translate="no">templates/</code> define formatos estándar y <code translate="no">resources/</code> proporciona información de fondo. Con todo esto en su sitio, el agente puede ejecutar la tarea de forma fiable y con un mínimo de conjeturas.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Tutorial práctico: Creación de una habilidad personalizada para un sistema RAG impulsado por Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>En esta sección, caminaremos a través de la construcción de una Skill personalizada que puede configurar una colección Milvus y ensamblar una tubería RAG completa a partir de instrucciones simples en lenguaje natural. El objetivo es omitir todo el trabajo de configuración habitual: sin diseño manual de esquemas, sin configuración de índices, sin código repetitivo. Usted le dice al agente lo que quiere, y el Skill se encarga de las piezas Milvus por usted.</p>
<h3 id="Design-Overview" class="common-anchor-header">Visión general del diseño</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><table>
<thead>
<tr><th>Componente</th><th>Requisito</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Modelos</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Contenedor</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Plataforma de configuración de modelos</td><td>CC-Switch</td></tr>
<tr><td>Gestor de paquetes</td><td>npm</td></tr>
<tr><td>Lenguaje de desarrollo</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Paso 1: Configuración del entorno</h3><p><strong>Instalar</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Instalar CC-Switch</strong></p>
<p><strong>Nota:</strong> CC-Switch es una herramienta de cambio de modelos que facilita el cambio entre diferentes APIs de modelos cuando se ejecutan modelos de IA localmente.</p>
<p>Repositorio del proyecto: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Seleccione Claude y añada una clave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Compruebe el estado actual</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Despliegue e inicie Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configurar la clave API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Paso 2: Crear la habilidad personalizada para Milvus</h3><p><strong>Crear la Estructura del Directorio</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inicializar</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Nota:</strong> SKILL.md sirve como guía de ejecución del agente. Define lo que hace la Skill y cómo debe ser activada.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Escriba los scripts principales</strong></p>
<table>
<thead>
<tr><th>Tipo de Script</th><th>Nombre del archivo</th><th>Propósito</th></tr>
</thead>
<tbody>
<tr><td>Comprobación del entorno</td><td><code translate="no">check_env.py</code></td><td>Comprueba la versión de Python, las dependencias requeridas y la conexión Milvus</td></tr>
<tr><td>Análisis de intenciones</td><td><code translate="no">intent_parser.py</code></td><td>Convierte peticiones como "construir una base de datos RAG" en una intención estructurada como <code translate="no">scene=rag</code></td></tr>
<tr><td>Creación de colecciones</td><td><code translate="no">milvus_builder.py</code></td><td>El constructor central que genera el esquema de la colección y la configuración del índice.</td></tr>
<tr><td>Ingesta de datos</td><td><code translate="no">insert_milvus_data.py</code></td><td>Carga documentos, los fragmenta, genera incrustaciones y escribe datos en Milvus.</td></tr>
<tr><td>Ejemplo 1</td><td><code translate="no">basic_text_search.py</code></td><td>Demuestra cómo crear un sistema de búsqueda de documentos</td></tr>
<tr><td>Ejemplo 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Demuestra cómo crear una base de conocimientos RAG completa</td></tr>
</tbody>
</table>
<p>Estos scripts muestran cómo convertir una habilidad centrada en Milvus en algo práctico: un sistema de búsqueda de documentos que funciona y una configuración inteligente de preguntas y respuestas (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Paso 3: Habilitar la habilidad y realizar una prueba</h3><p><strong>Describa la solicitud en lenguaje natural</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Creación del sistema RAG</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Insertar datos de muestra</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Ejecutar una consulta</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>En este tutorial, hemos recorrido la construcción de un sistema RAG potenciado por Milvus utilizando una Skill personalizada. El objetivo no era sólo mostrar otra forma de llamar a Milvus, sino mostrar cómo las habilidades pueden convertir lo que normalmente es una configuración de varios pasos y pesada en algo que se puede reutilizar y repetir. En lugar de definir manualmente los esquemas, ajustar los índices o coser el código de flujo de trabajo, la habilidad se encarga de la mayor parte de la repetición de tareas para que pueda centrarse en las partes de RAG que realmente importan.</p>
<p>Esto es sólo el principio. Una canalización RAG completa tiene muchas piezas móviles: preprocesamiento, fragmentación, configuración de búsqueda híbrida, reordenación, evaluación y más. Todas ellas pueden empaquetarse como Skills independientes y componerse en función de su caso de uso. Si su equipo tiene normas internas para las dimensiones de los vectores, los parámetros de los índices, las plantillas de consulta o la lógica de recuperación, las competencias son una forma limpia de codificar ese conocimiento y hacerlo repetible.</p>
<p>Para los nuevos desarrolladores, esto reduce la barrera de entrada - no hay necesidad de aprender cada detalle de Milvus antes de poner algo en marcha. Para los equipos experimentados, reduce la configuración repetida y ayuda a mantener la coherencia de los proyectos en todos los entornos. Las habilidades no reemplazarán el diseño reflexivo del sistema, pero eliminan muchas fricciones innecesarias.</p>
<p>👉 La implementación completa está disponible en el <a href="https://github.com/yinmin2020/open-milvus-skills">repositorio de código abierto</a>, y puedes explorar más ejemplos creados por la comunidad en el <a href="https://skillsmp.com/">mercado de habilidades</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Permanece atento.<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>También estamos trabajando en la introducción de Milvus y Zilliz Cloud Skills oficiales que cubren patrones RAG comunes y mejores prácticas de producción. Si tienes ideas o flujos de trabajo específicos que quieres que sean compatibles, únete a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> y chatea con nuestros ingenieros. Y si desea orientación para su propia configuración, siempre puede reservar una sesión <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a>.</p>
