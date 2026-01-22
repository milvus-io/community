---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Creación de agentes de inteligencia artificial en 10 minutos utilizando
  lenguaje natural con LangSmith Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Aprenda a crear agentes de IA con memoria en cuestión de minutos utilizando
  LangSmith Agent Builder y Milvus: sin código, en lenguaje natural y listos
  para la producción.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>A medida que se acelera el desarrollo de la IA, cada vez más equipos descubren que crear un asistente de IA no requiere necesariamente una formación en ingeniería de software. Las personas que más necesitan asistentes -equipos de producto, operaciones, soporte, investigadores- suelen saber exactamente lo que debe hacer el agente, pero no cómo implementarlo en código. Las herramientas tradicionales "sin código" intentaban salvar esa distancia con lienzos de arrastrar y soltar, pero se colapsaban en el momento en que se necesitaba un comportamiento real del agente: razonamiento en varios pasos, uso de herramientas o memoria persistente.</p>
<p>El nuevo <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> adopta un enfoque diferente. En lugar de diseñar flujos de trabajo, se describen los objetivos del agente y las herramientas disponibles en lenguaje sencillo, y el tiempo de ejecución se encarga de la toma de decisiones. Sin diagramas de flujo ni secuencias de comandos, sólo con una intención clara.</p>
<p>Pero la intención por sí sola no produce un asistente inteligente. Lo hace <strong>la memoria</strong>. Aquí es donde <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de datos vectorial de código abierto ampliamente adoptada, sienta las bases. Al almacenar documentos e historial de conversaciones como incrustaciones, Milvus permite a su agente recordar el contexto, recuperar información relevante y responder con precisión a escala.</p>
<p>Esta guía explica cómo crear un asistente de IA con memoria listo para producción utilizando <strong>LangSmith Agent Builder + Milvus</strong>, todo ello sin escribir una sola línea de código.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">¿Qué es LangSmith Agent Builder y cómo funciona?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Tal y como revela su nombre, LangSmith <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">Agent Builder</a> es una herramienta sin código de LangChain que le permite crear, implementar y gestionar agentes de IA utilizando un lenguaje sencillo. En lugar de escribir lógica o diseñar flujos visuales, usted explica qué debe hacer el agente, qué herramientas puede utilizar y cómo debe comportarse. A continuación, el sistema se encarga de las partes difíciles: generar instrucciones, seleccionar herramientas, conectar componentes y habilitar la memoria.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A diferencia de las herramientas tradicionales sin código o de flujo de trabajo, el Constructor de agentes no dispone de un lienzo de arrastrar y soltar ni de una biblioteca de nodos. Usted interactúa con él de la misma manera que lo haría con ChatGPT. Describa lo que desea construir, responda a algunas preguntas aclaratorias, y el Constructor produce un agente completamente funcional basado en su intención.</p>
<p>Entre bastidores, ese agente se construye a partir de cuatro bloques de construcción básicos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>El prompt:</strong> El prompt es el cerebro del agente, definiendo sus objetivos, restricciones y lógica de decisión. LangSmith Agent Builder utiliza meta-prompting para construir esto automáticamente: usted describe lo que quiere, le hace preguntas aclaratorias, y sus respuestas se sintetizan en un sistema detallado, listo para la producción. En lugar de escribir a mano la lógica, sólo tiene que expresar su intención.</li>
<li><strong>Herramientas:</strong> Las herramientas permiten al agente actuar: enviar correos electrónicos, publicar en Slack, crear eventos de calendario, buscar datos o llamar a API. Agent Builder integra estas herramientas a través del Protocolo de Contexto de Modelo (MCP), que proporciona una forma segura y extensible de exponer las capacidades. Los usuarios pueden confiar en las integraciones incorporadas o añadir servidores MCP personalizados, incluidos <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">los servidores MCP</a>de Milvus para la búsqueda de vectores y la memoria a largo plazo.</li>
<li><strong>Disparadores:</strong> Los disparadores definen cuándo se ejecuta un agente. Además de la ejecución manual, puede adjuntar agentes a programaciones o eventos externos para que respondan automáticamente a mensajes, correos electrónicos o actividad de webhook. Cuando se activa un disparador, el Generador de agentes inicia un nuevo subproceso de ejecución y ejecuta la lógica del agente, lo que permite un comportamiento continuo basado en eventos.</li>
<li><strong>Subagentes:</strong> Los subagentes dividen las tareas complejas en unidades más pequeñas y especializadas. Un agente principal puede delegar el trabajo en subagentes -cada uno con su propio indicador y conjunto de herramientas-, de modo que tareas como la recuperación de datos, el resumen o el formateo sean gestionadas por ayudantes dedicados. De este modo, se evita la sobrecarga de un único indicador y se crea una arquitectura de agentes más modular y escalable.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">¿Cómo recuerda un agente sus preferencias?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo que hace único al Constructor de Agentes es cómo trata <em>la memoria</em>. En lugar de almacenar las preferencias en el historial de chat, el agente puede actualizar sus propias reglas de comportamiento mientras se ejecuta. Si usted dice: "A partir de ahora, termina cada mensaje de Slack con un poema", el agente no lo trata como una petición única, sino que lo almacena como una preferencia persistente que se aplica en futuras ejecuciones.</p>
<p>Bajo el capó, el agente mantiene un archivo de memoria interna, esencialmente su indicador de sistema en evolución. Cada vez que se inicia, lee este archivo para decidir cómo comportarse. Cuando le das correcciones o restricciones, el agente edita el archivo añadiendo reglas estructuradas como "Cierra siempre la sesión informativa con un breve poema edificante". Este enfoque es mucho más estable que basarse en el historial de conversaciones, porque el agente reescribe activamente sus instrucciones de funcionamiento en lugar de enterrar tus preferencias dentro de una transcripción.</p>
<p>Este diseño proviene del FilesystemMiddleware de DeepAgents, pero está totalmente abstraído en Agent Builder. Nunca tocas los archivos directamente: expresas las actualizaciones en lenguaje natural y el sistema se encarga de las ediciones entre bastidores. Si necesita más control, puede conectar un servidor MCP personalizado o pasar a la capa DeepAgents para una personalización avanzada de la memoria.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Demostración práctica: Construir un Asistente Milvus en 10 minutos utilizando el Constructor de Agentes<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que hemos cubierto la filosofía de diseño detrás del Constructor de agentes, recorramos todo el proceso de construcción con un ejemplo práctico. Nuestro objetivo es crear un asistente inteligente que pueda responder a preguntas técnicas relacionadas con Milvus, buscar en la documentación oficial y recordar las preferencias del usuario a lo largo del tiempo.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Primer paso. Inicie sesión en el sitio web de LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Paso 2. Configure su clave API Anthropic</h3><p><strong>Nota:</strong> Anthropic es compatible por defecto. También puede utilizar un modelo personalizado, siempre que su tipo esté incluido en la lista oficialmente soportada por LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Añadir una clave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Introduzca y guarde la Clave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Paso 3. Crear un nuevo agente Crear un nuevo agente</h3><p><strong>Nota:</strong> Haga clic en <strong>Más información</strong> para ver la documentación de uso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Configurar un Modelo Personalizado (Opcional)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Introducir Parámetros y Guardar</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Paso 4. Describa sus requisitos para crear el agente</h3><p><strong>Nota:</strong> Cree el agente utilizando una descripción en lenguaje natural.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>El Sistema Hace Preguntas de Seguimiento para Afinar los Requerimientos</strong></li>
</ol>
<p>Pregunta 1: Seleccione los tipos de índice Milvus que desea que el agente recuerde</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pregunta 2: Elija cómo el agente debe manejar las preguntas técnicas  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pregunta 3: Especifique si el agente debe centrarse en la orientación para una versión específica de Milvus  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Paso 5: Revise y Confirme el Agente Generado Revise y Confirme el Agente Generado</h3><p><strong>Nota:</strong> El sistema genera automáticamente la configuración del agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Antes de crear el agente, puede revisar sus metadatos, herramientas e indicaciones. Cuando todo parezca correcto, haga clic en <strong>Crear</strong> para continuar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Paso 6. Explorar la interfaz y las áreas de funciones Explore la interfaz y las áreas de funciones</h3><p>Una vez creado el agente, verá tres áreas funcionales en la esquina inferior izquierda de la interfaz:</p>
<p><strong>(1) Disparadores</strong></p>
<p>Los disparadores definen cuándo debe ejecutarse el agente, ya sea en respuesta a eventos externos o según una programación:</p>
<ul>
<li><strong>Slack:</strong> Activar el agente cuando llegue un mensaje a un canal específico</li>
<li><strong>Gmail:</strong> Activar el agente cuando se recibe un nuevo correo electrónico</li>
<li><strong>Cron:</strong> Ejecutar el agente en un intervalo programado</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Caja de herramientas</strong></p>
<p>Es el conjunto de herramientas que el agente puede llamar. En el ejemplo mostrado, las tres herramientas se generan automáticamente durante la creación, y puede añadir más haciendo clic en <strong>Añadir herramienta</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Si su agente necesita capacidades de búsqueda vectorial -como la búsqueda semántica a través de grandes volúmenes de documentación técnica- puede desplegar el Servidor MCP de Milvus</strong> y añadirlo aquí utilizando el botón <strong>MCP</strong>. Asegúrese de que el servidor MCP se ejecuta <strong>en un punto final de red accesible</strong>; de lo contrario, el Generador de agentes no podrá invocarlo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sub-agentes</strong></p>
<p>Cree módulos de agentes independientes dedicados a subtareas específicas, permitiendo un diseño modular del sistema.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Paso 7. Probar el Agente Pruebe el Agente</h3><p>Haga clic en <strong>Probar</strong> en la esquina superior derecha para acceder al modo de prueba. A continuación se muestra una muestra de los resultados de la prueba.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Constructor de Agentes vs. DeepAgents: ¿Cuál elegir?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain ofrece múltiples marcos de agentes, y la elección correcta depende de cuánto control necesite. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> es una herramienta de construcción de agentes. Se utiliza para construir agentes de IA autónomos y de larga duración que manejan tareas complejas de múltiples pasos. Basada en LangGraph, admite planificación avanzada, gestión de contexto basada en archivos y orquestación de subagentes, lo que la hace ideal para proyectos de larga duración o de producción.</p>
<p>Entonces, ¿cómo se compara con el <strong>Agent Builder</strong>, y cuándo se debe utilizar cada uno?</p>
<p><strong>Agent Builder</strong> se centra en la simplicidad y la velocidad. Abstrae la mayoría de los detalles de implementación, permitiéndole describir su agente en lenguaje natural, configurar herramientas y ejecutarlo inmediatamente. La memoria, el uso de herramientas y los flujos de trabajo humanos se gestionan por usted. Esto hace que Agent Builder sea perfecto para la creación rápida de prototipos, herramientas internas y validación en etapas tempranas, donde la facilidad de uso importa más que el control granular.</p>
<p><strong>DeepAgents</strong>, por el contrario, está diseñado para escenarios en los que se necesita un control total sobre la memoria, la ejecución y la infraestructura. Puede personalizar el middleware, integrar cualquier herramienta Python, modificar el backend de almacenamiento (incluida la persistencia de memoria en <a href="https://milvus.io/blog">Milvus</a>) y gestionar explícitamente el gráfico de estado del agente. La contrapartida es el esfuerzo de ingeniería -usted mismo escribe el código, gestiona las dependencias y maneja los modos de fallo-, pero obtiene una pila de agentes totalmente personalizable.</p>
<p>Es importante destacar que <strong>Agent Builder y DeepAgents no son ecosistemas separados, sino que forman un único continuo</strong>. Agent Builder está construido sobre DeepAgents. Esto significa que puede empezar con un prototipo rápido en Agent Builder y luego pasar a DeepAgents cuando necesite más flexibilidad, sin tener que reescribir todo desde cero. Lo contrario también funciona: los patrones construidos en DeepAgents pueden ser empaquetados como plantillas de Agent Builder para que los usuarios no técnicos puedan reutilizarlos.</p>
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
    </button></h2><p>Gracias al desarrollo de la IA, la construcción de agentes de IA ya no requiere flujos de trabajo complejos o ingeniería pesada. Con LangSmith Agent Builder, puede crear asistentes con estado y de larga ejecución utilizando únicamente lenguaje natural. Usted se centra en describir lo que debe hacer el agente, mientras que el sistema se encarga de la planificación, la ejecución de la herramienta y las actualizaciones continuas de la memoria.</p>
<p>Combinados con <a href="https://milvus.io/blog">Milvus</a>, estos agentes obtienen una memoria fiable y persistente para la búsqueda semántica, el seguimiento de preferencias y el contexto a largo plazo entre sesiones. Tanto si está validando una idea como desplegando un sistema escalable, LangSmith Agent Builder y Milvus proporcionan una base sencilla y flexible para agentes que no sólo responden, sino que recuerdan y mejoran con el tiempo.</p>
<p>¿Tiene alguna pregunta o desea una explicación más detallada? Únase a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserve una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a> para obtener orientación personalizada.</p>
