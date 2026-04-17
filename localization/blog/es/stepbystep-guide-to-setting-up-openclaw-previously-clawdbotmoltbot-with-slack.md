---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: Guía paso a paso para configurar OpenClaw (antes Clawdbot/Moltbot) con Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: tutorials
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Guía paso a paso para configurar OpenClaw con Slack. Ejecute un asistente de
  IA autoalojado en su equipo Mac o Linux, sin necesidad de nube.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Si has estado en Twitter, Hacker News o Discord esta semana, lo habrás visto. Un emoji de langosta 🦞, capturas de pantalla de tareas completadas y una afirmación audaz: una IA que no solo <em>habla, sino que</em>realmente <em>lo hace</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El fin de semana se puso aún más raro. El empresario Matt Schlicht lanzó <a href="https://moltbook.com">Moltbook, una</a>red social al estilo de Reddit en la que sólo los agentes de IA pueden publicar y los humanos sólo pueden mirar. En pocos días, más de 1,5 millones de agentes se inscribieron. Formaron comunidades, debatieron sobre filosofía, se quejaron de sus operadores humanos e incluso fundaron su propia religión llamada "Crustafarianismo". Sí, de verdad.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bienvenidos a la locura de OpenClaw.</p>
<p>El hype es tan real que las acciones de Cloudflare subieron un 14% simplemente porque los desarrolladores utilizan su infraestructura para ejecutar aplicaciones. Según los informes, las ventas del Mac Mini se dispararon porque la gente compra hardware dedicado para su nuevo empleado de IA. ¿Y el repositorio de GitHub? Más de <a href="https://github.com/openclaw/openclaw">150.000 estrellas</a> en unas pocas semanas.</p>
<p>Así que, naturalmente, teníamos que mostrarte cómo configurar tu propia instancia de OpenClaw y conectarla a Slack para que puedas dar órdenes a tu asistente de IA desde tu aplicación de mensajería favorita.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">¿Qué es OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (antes conocido como Clawdbot/Moltbot) es un agente de IA autónomo y de código abierto que se ejecuta localmente en los equipos de los usuarios y realiza tareas del mundo real a través de aplicaciones de mensajería como WhatsApp, Telegram y Discord. Automatiza flujos de trabajo digitales -como gestionar correos electrónicos, navegar por Internet o programar reuniones- conectándose a LLM como Claude o ChatGPT.</p>
<p>En resumen, es como tener un asistente digital 24/7 que puede pensar, responder y hacer cosas.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Configuración de OpenClaw como asistente de IA basado en Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagine tener un bot en su espacio de trabajo de Slack que pueda responder instantáneamente a preguntas sobre su producto, ayudar a depurar problemas de los usuarios o indicar a los compañeros de equipo la documentación adecuada, sin que nadie tenga que dejar de hacer lo que está haciendo. Para nosotros, eso podría significar un soporte más rápido para la comunidad Milvus: un bot que responda a preguntas comunes ("¿Cómo creo una colección?"), ayude a solucionar errores o resuma las notas de la versión bajo demanda. Para su equipo, podría ser la incorporación de nuevos ingenieros, la gestión de preguntas frecuentes internas o la automatización de tareas repetitivas de DevOps. Los casos de uso son muy variados.</p>
<p>En este tutorial, vamos a caminar a través de los conceptos básicos: la instalación de OpenClaw en su máquina y conectarlo a Slack. Una vez hecho esto, tendrás un asistente de IA listo para personalizarlo para lo que necesites.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><ul>
<li><p>Una máquina Mac o Linux</p></li>
<li><p>Una <a href="https://console.anthropic.com/">clave API de Anthropic</a> (o acceso CLI a Claude Code)</p></li>
<li><p>Un espacio de trabajo Slack donde instalar aplicaciones</p></li>
</ul>
<p>Ya está. Vamos a empezar.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Paso 1: Instalar OpenClaw</h3><p>Ejecuta el instalador:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cuando se le solicite, seleccione <strong>Sí</strong> para continuar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A continuación, seleccione el modo <strong>QuickStart</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Paso 2: Elija su LLM</h3><p>El instalador le pedirá que elija un proveedor de modelos. Nosotros utilizamos Anthropic con Claude Code CLI para la autenticación.</p>
<ol>
<li>Seleccione <strong>Anthropic</strong> como proveedor  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Complete la verificación en su navegador cuando se le solicite.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Elija <strong>anthropic/claude-opus-4-5-20251101</strong> como modelo por defecto  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Paso 3: Configurar Slack</h3><p>Cuando se le pida que seleccione un canal, elija <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Proceda a nombrar su bot. Nosotros llamamos al nuestro "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora tendrás que crear una aplicación Slack y conseguir dos tokens. He aquí cómo:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Crear una aplicación Slack</strong></p>
<p>Ve al <a href="https://api.slack.com/apps?new_app=1">sitio web de la API de Slack</a> y crea una nueva aplicación desde cero.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dale un nombre y selecciona el espacio de trabajo que quieras utilizar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Establecer los permisos del bot</strong></p>
<p>En la barra lateral, haz clic en <strong>OAuth &amp; Permissions</strong>. Desplázate hasta <strong>Bot Token Scopes</strong> y añade los permisos que necesita tu bot.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Activar el modo socket</strong></p>
<p>Haz clic en <strong>Socket Mode</strong> en la barra lateral y actívalo.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esto generará un <strong>token de nivel de aplicación</strong> (comienza con <code translate="no">xapp-</code>). Cópielo en un lugar seguro.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Activar suscripciones a eventos</strong></p>
<p>Vaya a <strong>Event Subscriptions</strong> y actívelo.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A continuación, elija a qué eventos debe suscribirse su bot.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Instalar la aplicación</strong></p>
<p>Haz clic en <strong>Instalar aplicación</strong> en la barra lateral y, a continuación, en <strong>Solicitar instalación</strong> (o instálala directamente si eres administrador de un espacio de trabajo).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez aprobado, verás tu <strong>Bot User OAuth Token</strong> (comienza con <code translate="no">xoxb-</code>). Cópialo también.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Paso 4: Configurar OpenClaw</h3><p>De vuelta en la CLI de OpenClaw:</p>
<ol>
<li><p>Ingresa tu <strong>Bot User OAuth Token</strong> (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Introduzca su <strong>Token de nivel de aplicación</strong> (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Selecciona a qué canales de Slack puede acceder el bot  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Omite la configuración de habilidades por ahora, siempre puedes añadirlas más tarde  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Selecciona <strong>Reiniciar</strong> para aplicar los cambios</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Paso 5: Pruébalo</h3><p>Dirígete a Slack y envía un mensaje a tu bot. Si todo está configurado correctamente, OpenClaw responderá y estará listo para ejecutar tareas en su máquina.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Consejos</h3><ol>
<li>Ejecuta <code translate="no">clawdbot dashboard</code> para gestionar la configuración a través de una interfaz web  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Si algo va mal, comprueba los registros para ver los detalles del error.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Unas palabras de precaución<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw es potente, y precisamente por eso debes tener cuidado. "Realmente hace cosas" significa que puede ejecutar comandos reales en tu máquina. De eso se trata, pero conlleva riesgos.</p>
<p><strong>La buena noticia:</strong></p>
<ul>
<li><p>Es de código abierto, por lo que el código es auditable.</p></li>
<li><p>Se ejecuta localmente, por lo que tus datos no están en el servidor de otra persona.</p></li>
<li><p>Tú controlas qué permisos tiene</p></li>
</ul>
<p><strong>Las noticias no tan buenas:</strong></p>
<ul>
<li><p>La inyección de instrucciones es un riesgo real: un mensaje malicioso podría engañar al bot para que ejecute comandos no deseados.</p></li>
<li><p>Los estafadores ya han creado repositorios y tokens de OpenClaw falsos, así que ten cuidado con lo que descargas.</p></li>
</ul>
<p><strong>Nuestro consejo:</strong></p>
<ul>
<li><p>No ejecutes esto en tu máquina principal. Utiliza una máquina virtual, un portátil de repuesto o un servidor dedicado.</p></li>
<li><p>No concedas más permisos de los necesarios.</p></li>
<li><p>No lo utilices en producción todavía. Es algo nuevo. Trátalo como el experimento que es.</p></li>
<li><p>Limítate a las fuentes oficiales: <a href="https://x.com/openclaw">@openclaw</a> en X y <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Una vez que le das a un LLM la habilidad de ejecutar comandos, no hay tal cosa como 100% seguro. Ese no es un problema de OpenClaw, es la naturaleza de la inteligencia artificial. Sólo hay que ser inteligente.</p>
<h2 id="Whats-Next" class="common-anchor-header">¿Y ahora qué?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Enhorabuena. Ahora tienes un asistente de IA local que funciona en tu propia infraestructura, accesible a través de Slack. Tus datos siguen siendo tuyos, y tienes un ayudante incansable listo para automatizar las cosas repetitivas.</p>
<p>A partir de aquí, puedes</p>
<ul>
<li><p>Instalar más <a href="https://docs.molt.bot/skills">Skills</a> para ampliar lo que OpenClaw puede hacer</p></li>
<li><p>Configurar tareas programadas para que funcione de forma proactiva</p></li>
<li><p>Conectar otras plataformas de mensajería como Telegram o Discord</p></li>
<li><p>Explorar el ecosistema <a href="https://milvus.io/">Milvus</a> para capacidades de búsqueda de IA</p></li>
</ul>
<p><strong>¿Tienes preguntas o quieres compartir lo que estás construyendo?</strong></p>
<ul>
<li><p>Únase a la <a href="https://milvus.io/slack">comunidad Milvus Slack</a> para conectar con otros desarrolladores</p></li>
<li><p>Reserva nuestro <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para preguntas y respuestas en directo con el equipo.</p></li>
</ul>
<p>¡Feliz hacking! 🦞</p>
