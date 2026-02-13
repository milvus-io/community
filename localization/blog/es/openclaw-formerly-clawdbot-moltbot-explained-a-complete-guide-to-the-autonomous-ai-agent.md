---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >-
  Explicación de OpenClaw (antes Clawdbot y Moltbot): Guía completa del agente
  autónomo de IA
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  Guía completa de OpenClaw (Clawdbot/Moltbot): cómo funciona, configuración,
  casos de uso, Moltbook y advertencias de seguridad.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (antes conocido como Moltbot y Clawdbot) es un agente de IA de código abierto que se ejecuta en tu máquina, se conecta a través de las aplicaciones de mensajería que ya utilizas (WhatsApp, Telegram, Slack, Signal y otras) y realiza acciones en tu nombre: comandos de shell, automatización del navegador, correo electrónico, calendario y operaciones con archivos. Un programador de latidos lo despierta en un intervalo configurable para que pueda ejecutarse sin que se le solicite. Consiguió más de <a href="https://github.com/openclaw/openclaw">100.000</a> estrellas de GitHub en menos de una semana tras su lanzamiento a finales de enero de 2026, convirtiéndose en uno de los repositorios de código abierto de más rápido crecimiento en la historia de GitHub.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lo que distingue a OpenClaw es su combinación: Licencia MIT, código abierto, local-first (memoria y datos almacenados como archivos Markdown en tu disco) y extensible a la comunidad a través de un formato de habilidades portátil. También es donde se están llevando a cabo algunos de los experimentos más interesantes en IA agéntica: el agente de un desarrollador negoció por correo electrónico un descuento de 4.200 dólares en la compra de un coche mientras dormía; otro presentó una refutación legal a la denegación de un seguro sin que nadie se lo pidiera; y otro usuario creó <a href="https://moltbook.com/">Moltbook</a>, una red social en la que más de un millón de agentes de IA interactúan de forma autónoma mientras los humanos observan.</p>
<p>Esta guía desglosa todo lo que necesitas saber: qué es OpenClaw, cómo funciona, qué puede hacer en la vida real, cómo se relaciona con Moltbook y los riesgos de seguridad que conlleva.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">¿Qué es OpenClaw?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a> (antes Clawdbot y Moltbot) es un asistente de IA autónomo y de código abierto que se ejecuta en tu máquina y vive en tus aplicaciones de chat. Hablas con él a través de WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage o Signal -lo que ya utilices- y él te responde. Pero a diferencia de ChatGPT o la interfaz web de Claude, OpenClaw no se limita a responder preguntas. Puede ejecutar comandos shell, controlar tu navegador, leer y escribir archivos, gestionar tu calendario y enviar correos electrónicos, todo ello activado por un mensaje de texto.</p>
<p>Está pensado para desarrolladores y usuarios avanzados que desean un asistente personal de inteligencia artificial con el que puedan comunicarse desde cualquier lugar, sin renunciar al control de sus datos ni depender de un servicio alojado.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Principales funciones de OpenClaw</h3><ul>
<li><p><strong>Pasarela multicanal</strong>: WhatsApp, Telegram, Discord e iMessage con un único proceso de pasarela. Añade Mattermost y más con paquetes de extensión.</p></li>
<li><p><strong>Enrutamiento multiagente</strong> - sesiones aisladas por agente, espacio de trabajo o remitente.</p></li>
<li><p><strong>Soporte multimedia</strong>: envíe y reciba imágenes, audio y documentos.</p></li>
<li><p><strong>Interfaz de control web</strong>: panel de control del navegador para chat, configuración, sesiones y nodos.</p></li>
<li><p><strong>Nodos móviles</strong>: empareje nodos iOS y Android compatibles con Canvas.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">¿Qué hace diferente a OpenClaw?</h3><p><strong>OpenClaw es autoalojado.</strong></p>
<p>El gateway, las herramientas y la memoria de OpenClaw viven en su máquina, no en un SaaS alojado por un proveedor. OpenClaw almacena las conversaciones, la memoria a largo plazo y las habilidades como archivos Markdown y YAML en tu espacio de trabajo y en <code translate="no">~/.openclaw</code>. Puedes inspeccionarlos en cualquier editor de texto, hacer copias de seguridad con Git, buscar en ellos o eliminarlos. Los modelos de IA pueden estar alojados en la nube (Anthropic, OpenAI, Google) o localmente (a través de Ollama, LM Studio u otros servidores compatibles con OpenAI), dependiendo de cómo configures el bloque de modelos. Si quieres que toda la inferencia permanezca en tu hardware, dirige OpenClaw sólo a modelos locales.</p>
<p><strong>OpenClaw es totalmente autónomo</strong></p>
<p>La pasarela se ejecuta como un demonio en segundo plano (<code translate="no">systemd</code> en Linux, <code translate="no">LaunchAgent</code> en macOS) con un latido configurable - cada 30 minutos por defecto, cada hora con Anthropic OAuth. En cada latido, el agente lee una lista de comprobación de <code translate="no">HEARTBEAT.md</code> en el espacio de trabajo, decide si algún elemento requiere acción y le envía un mensaje o responde <code translate="no">HEARTBEAT_OK</code> (que la pasarela deja caer silenciosamente). Los eventos externos (webhooks, cron jobs, mensajes de compañeros de equipo) también activan el bucle del agente.</p>
<p>El grado de autonomía del agente depende de la configuración. Las políticas de herramientas y las aprobaciones de ejecución rigen las acciones de alto riesgo: puede permitir la lectura de correos electrónicos pero exigir aprobación antes de enviarlos, permitir la lectura de archivos pero bloquear las eliminaciones. Si se desactivan estas barreras, el agente ejecuta sin preguntar.</p>
<p><strong>OpenClaw es de código abierto.</strong></p>
<p>El núcleo de Gateway tiene licencia MIT. Es totalmente legible, bifurcable y auditable. Esto es importante en contexto: Anthropic presentó una DMCA contra un desarrollador que desofuscó el cliente de Claude Code; Codex CLI de OpenAI es Apache 2.0 pero la interfaz web y los modelos son cerrados; Manus es completamente cerrado.</p>
<p>El ecosistema refleja la apertura. <a href="https://github.com/openclaw/openclaw">Cientos de colaboradores</a> han creado habilidades (archivos modulares de <code translate="no">SKILL.md</code> con material frontal YAML e instrucciones en lenguaje natural) compartidas a través de ClawHub (un registro de habilidades en el que el agente puede buscar automáticamente), repositorios comunitarios o URL directas. El formato es portátil, compatible con las convenciones Claude Code y Cursor. Si no existe una habilidad, puedes describir la tarea a tu agente y hacer que redacte una.</p>
<p>Esta combinación de propiedad local, evolución impulsada por la comunidad y funcionamiento autónomo es la razón por la que los desarrolladores están entusiasmados. Para los desarrolladores que quieren un control total sobre sus herramientas de IA, eso es importante.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">Cómo funciona OpenClaw bajo el capó<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Un proceso, todo dentro</strong></p>
<p>Cuando se ejecuta <code translate="no">openclaw gateway</code>, se inicia un único proceso Node.js de larga duración llamado Gateway. Ese proceso es todo el sistema: las conexiones de canal, el estado de la sesión, el bucle del agente, las llamadas al modelo, la ejecución de herramientas y la persistencia en memoria. No hay ningún servicio separado que gestionar.</p>
<p>Cinco subsistemas dentro de un proceso:</p>
<ol>
<li><p><strong>Adaptadores de canal</strong> - uno por plataforma (Baileys para WhatsApp, grammY para Telegram, etc.). Normalizan los mensajes entrantes en un formato común y serializan las respuestas.</p></li>
<li><p><strong>Gestor de sesiones</strong>: resuelve la identidad del remitente y el contexto de la conversación. Los mensajes de texto se agrupan en una sesión principal; los chats de grupo tienen su propia sesión.</p></li>
<li><p><strong>Cola</strong>: serializa las ejecuciones por sesión. Si llega un mensaje a mitad de la ejecución, lo retiene, lo inyecta o lo recoge para un turno posterior.</p></li>
<li><p><strong>Tiempo de ejecución del agente</strong>: reúne el contexto (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, registro diario, historial de conversaciones) y, a continuación, ejecuta el bucle del agente: llama al modelo → ejecuta las llamadas a las herramientas → devuelve los resultados → repite hasta que termina.</p></li>
<li><p><strong>Plano de control</strong> - API WebSocket en <code translate="no">:18789</code>. La CLI, la aplicación macOS, la interfaz web y los nodos iOS/Android se conectan aquí.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El modelo es una llamada a una API externa que puede o no ejecutarse localmente. Todo lo demás -enrutamiento, herramientas, memoria, estado- vive dentro de ese único proceso en tu máquina.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para una solicitud simple, ese bucle se completa en segundos. Las cadenas de herramientas de varios pasos tardan más. El modelo es una llamada a una API externa que puede o no ejecutarse localmente, pero todo lo demás -enrutamiento, herramientas, memoria, estado- vive dentro de ese único proceso en tu máquina.</p>
<p><strong>El mismo bucle que el código Claude, pero con un shell diferente</strong></p>
<p>El bucle del agente -entrada → contexto → modelo → herramientas → repetición → respuesta- es el mismo patrón que utiliza Claude Code. Todo framework de agentes serio ejecuta alguna versión del mismo. Lo que difiere es lo que lo envuelve.</p>
<p>Claude Code lo envuelve en una <strong>CLI</strong>: tecleas, se ejecuta, sale. OpenClaw lo envuelve en un <strong>demonio persistente</strong> conectado a más de 12 plataformas de mensajería, con un programador de latidos, gestión de sesiones a través de canales y memoria que persiste entre ejecuciones, incluso cuando no estás en tu escritorio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Enrutamiento de modelos y conmutación por error</strong></p>
<p>OpenClaw es independiente del modelo. Los proveedores se configuran en <code translate="no">openclaw.json</code>, y la pasarela enruta en consecuencia, con rotación de perfiles de autenticación y una cadena de reserva que utiliza un backoff exponencial cuando se cae un proveedor. Pero la elección del modelo importa, porque OpenClaw ensambla grandes indicaciones: instrucciones del sistema, historial de conversaciones, esquemas de herramientas, habilidades y memoria. Esa carga de contexto es la razón por la que la mayoría de las implantaciones utilizan un modelo de frontera como orquestador principal, con modelos más baratos que gestionan los latidos del corazón y las tareas de los subagentes.</p>
<p><strong>Compromisos entre nube y local</strong></p>
<p>Desde la perspectiva de la pasarela, los modelos local y en la nube parecen idénticos: ambos son puntos finales compatibles con OpenAI. Lo que difiere son las compensaciones.</p>
<p>Los modelos en la nube (Anthropic, OpenAI, Google) ofrecen un razonamiento sólido, grandes ventanas de contexto y un uso fiable de las herramientas. Son la opción por defecto para el orquestador principal. El coste varía con el uso: los usuarios poco exigentes gastan entre 5 y 20 dólares al mes, los agentes activos con latidos frecuentes y grandes avisos suelen costar entre 50 y 150 dólares al mes, y los usuarios avanzados no optimizados han informado de facturas de miles de dólares.</p>
<p>Los modelos locales a través de Ollama u otros servidores compatibles con OpenAI eliminan el coste por token, pero requieren hardware, y OpenClaw necesita al menos 64.000 tokens de contexto, lo que reduce las opciones viables. Con 14B de parámetros, los modelos pueden manejar automatizaciones sencillas, pero son marginales para tareas de agentes de múltiples pasos; la experiencia de la comunidad sitúa el umbral fiable en 32B+, necesitando al menos 24GB de VRAM. No podrá igualar a un modelo de nube fronteriza en razonamiento o contexto ampliado, pero obtendrá una localización de datos completa y costes predecibles.</p>
<p><strong>Qué le aporta esta arquitectura</strong></p>
<p>Dado que todo se ejecuta a través de un único proceso, el Gateway es una única superficie de control. Qué modelo llamar, qué herramientas permitir, cuánto contexto incluir, cuánta autonomía conceder... todo se configura en un solo lugar. Los canales están desacoplados del modelo: cambia Telegram por Slack o Claude por Gemini y nada más cambia. El cableado de los canales, las herramientas y la memoria permanecen en tu infra; el modelo es la única dependencia a la que apuntas.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">¿Qué hardware se necesita realmente para ejecutar OpenClaw?</h3><p>A finales de enero, circularon publicaciones que mostraban a desarrolladores sacando de la caja varios Mac Mini; un usuario publicó 40 unidades en un escritorio. Incluso Logan Kilpatrick, de Google DeepMind, anunció que había pedido uno, aunque los requisitos reales de hardware son mucho más modestos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La documentación oficial indica que los requisitos mínimos son 2 GB de RAM y 2 núcleos de CPU para el chat básico, o 4 GB si quieres automatizar el navegador. Un VPS de 5 dólares al mes es suficiente. También puede implementar en AWS o Hetzner con Pulumi, ejecutarlo en Docker en un pequeño VPS, o utilizar un viejo ordenador portátil acumulando polvo. La tendencia del Mac Mini fue impulsada por la prueba social, no por requisitos técnicos.</p>
<p><strong>Entonces, ¿por qué la gente compró hardware dedicado? Dos razones: aislamiento y persistencia.</strong> Cuando das a un agente autónomo acceso shell, quieres una máquina que puedas desconectar físicamente si algo va mal. Y como OpenClaw funciona con un latido (despertándose en un horario configurable para actuar en su nombre), un dispositivo dedicado significa que siempre está encendido, siempre listo. El atractivo es el aislamiento físico en un ordenador que puede desconectar y el tiempo de actividad sin depender de la disponibilidad de un servicio en la nube.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">Cómo instalar OpenClaw y empezar rápidamente<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Necesitas <strong>Node 22+</strong>. Consulte con <code translate="no">node --version</code> si no está seguro.</p>
<p><strong>Instala la CLI:</strong></p>
<p>En macOS/Linux:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>En Windows (PowerShell):</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ejecuta el asistente de onboarding:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>Te guiará a través de la autenticación, la configuración de la pasarela y, opcionalmente, la conexión de un canal de mensajería (WhatsApp, Telegram, etc.). El indicador <code translate="no">--install-daemon</code> registra la pasarela como un servicio en segundo plano para que se inicie automáticamente.</p>
<p><strong>Comprueba que la pasarela se está ejecutando:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Abre el panel de control:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>Esto abre la interfaz de control en <code translate="no">http://127.0.0.1:18789/</code>. Puedes empezar a chatear con tu agente aquí mismo, sin necesidad de configurar ningún canal si sólo quieres probar las cosas.</p>
<p><strong>Un par de cosas que vale la pena saber desde el principio.</strong> Si desea ejecutar la pasarela en primer plano en lugar de como un demonio (útil para la depuración), puede hacerlo:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>Y si necesita personalizar donde OpenClaw almacena su configuración y estado - digamos que lo está ejecutando como una cuenta de servicio o en un contenedor - hay tres env vars que importan:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - directorio base para la resolución de rutas internas</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - anula la ubicación de los archivos de estado</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - apunta a un archivo de configuración específico</p></li>
</ul>
<p>Una vez que tengas la pasarela funcionando y el panel de control cargando, estás listo. A partir de ahí, es probable que desee conectar un canal de mensajería y configurar las aprobaciones de habilidades - vamos a cubrir ambos en las próximas secciones.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">¿Cómo se compara OpenClaw con otros agentes de IA?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>La comunidad tecnológica llama a OpenClaw "Claude, pero con manos". Es una descripción vívida, pero pasa por alto las diferencias arquitectónicas. Varios productos de IA ya tienen "manos": Anthropic tiene <a href="https://claude.com/blog/claude-code">Claude Code</a> y <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, OpenAI tiene <a href="https://openai.com/codex/">Codex</a> y <a href="https://openai.com/index/introducing-chatgpt-agent/">el agente ChatGPT</a>, y existe <a href="https://manus.im/">Manus</a>. Las distinciones que importan en la práctica son:</p>
<ul>
<li><p><strong>Dónde se ejecuta el agente</strong> (tu máquina frente a la nube del proveedor).</p></li>
<li><p><strong>Cómo interactúas con él</strong> (aplicación de mensajería, terminal, IDE, interfaz de usuario web)</p></li>
<li><p><strong>A quién pertenece el estado y la memoria a largo plazo</strong> (archivos locales frente a la cuenta del proveedor).</p></li>
</ul>
<p>A un alto nivel, OpenClaw es una puerta de enlace local que vive en tu hardware y habla a través de aplicaciones de chat, mientras que los otros son en su mayoría agentes alojados que manejas desde un terminal, IDE o aplicación web/escritorio.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Código Claude</th><th>Códice OpenAI</th><th>Agente ChatGPT</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Código abierto</td><td>Sí. Core gateway bajo licencia MIT;</td><td>No.</td><td>No.</td><td>No.</td><td>No. SaaS de código cerrado</td></tr>
<tr><td>Interfaz</td><td>Aplicaciones de mensajería (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.)</td><td>Terminal, integraciones IDE, web y aplicación móvil</td><td>Terminal CLI, integraciones IDE, Codex Web UI</td><td>ChatGPT web y aplicaciones de escritorio (incluido el modo de agente macOS)</td><td>Panel web, operador de navegador, Slack e integraciones de aplicaciones</td></tr>
<tr><td>Enfoque principal</td><td>Automatización personal y del desarrollador a través de herramientas y servicios</td><td>Desarrollo de software y flujos de trabajo DevOps</td><td>Desarrollo de software y edición de código</td><td>Tareas web de uso general, investigación y flujos de trabajo de productividad</td><td>Investigación, contenidos y automatización web para usuarios empresariales</td></tr>
<tr><td>Memoria de sesión</td><td>Memoria basada en archivos (Markdown + logs) en disco; los plugins opcionales añaden memoria semántica / a largo plazo</td><td>Sesiones por proyecto con historial, más memoria Claude opcional en la cuenta</td><td>Estado por sesión en CLI / editor; no hay memoria de usuario a largo plazo incorporada</td><td>Ejecución de agente por tarea respaldada por las funciones de memoria a nivel de cuenta de ChatGPT (si están activadas)</td><td>Memoria en la nube, a nivel de cuenta, en todas las ejecuciones, ajustada para flujos de trabajo recurrentes</td></tr>
<tr><td>Despliegue</td><td>Pasarela/demonio siempre en ejecución en su máquina o VPS; llamadas a proveedores LLM</td><td>Se ejecuta en la máquina del desarrollador como plugin CLI/IDE; todas las llamadas a los modelos van a la API de Anthropic</td><td>La CLI se ejecuta localmente; los modelos se ejecutan a través de la API de OpenAI o Codex Web</td><td>Totalmente alojado por OpenAI; el modo Agente crea un espacio de trabajo virtual desde el cliente ChatGPT</td><td>Totalmente alojado por Manus; los agentes se ejecutan en el entorno de nube de Manus</td></tr>
<tr><td>Público objetivo</td><td>Desarrolladores y usuarios avanzados que se sienten cómodos ejecutando su propia infraestructura</td><td>Desarrolladores e ingenieros DevOps que trabajan en terminales e IDEs</td><td>Desarrolladores que desean un agente de codificación en terminal/IDE</td><td>Trabajadores del conocimiento y equipos que utilizan ChatGPT para tareas de usuario final</td><td>Usuarios empresariales y equipos que automatizan flujos de trabajo centrados en la web</td></tr>
<tr><td>Coste</td><td>Gratuito + llamada a la API en función de su uso</td><td>20-200 $/mes</td><td>20-200 $/mes</td><td>20-200 $/mes</td><td>39-199 $/mes (créditos)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Aplicaciones reales de OpenClaw<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>El valor práctico de OpenClaw proviene de su alcance. Aquí están algunas de las cosas más interesantes que la gente ha construido con él, comenzando con un bot de soporte que desplegamos para la comunidad Milvus.</p>
<p><strong>El equipo de soporte de Zilliz creó un robot de soporte de IA para la comunidad Milvus en Slack</strong></p>
<p>El equipo de Zilliz conectó OpenClaw a su espacio de trabajo Slack como <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">asistente de la comunidad Milvus</a>. La instalación duró 20 minutos. Ahora responde a preguntas comunes sobre Milvus, ayuda a solucionar errores y remite a los usuarios a la documentación pertinente. Si desea probar algo similar, hemos escrito un <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">tutorial</a> completo <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">paso a paso</a> sobre cómo conectar OpenClaw a Slack.</p>
<ul>
<li><strong>Tutorial de OpenClaw:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guía paso a paso para configurar OpenClaw con Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg creó un agente que le ayudó a negociar un descuento de 4.200 dólares en la compra de un coche mientras dormía</strong></p>
<p>El ingeniero de software AJ Stuyvenberg encargó a su agente OpenClaw la compra de un Hyundai Palisade 2026. El agente buscó en los inventarios de los concesionarios locales, rellenó formularios de contacto con su número de teléfono y correo electrónico y se pasó varios días enfrentando a los concesionarios entre sí, enviándoles presupuestos en PDF y pidiéndoles que superaran el precio del otro. Resultado final: <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4.200 dólares</a> por debajo del precio de etiqueta, y Stuyvenberg sólo se presentó para firmar el papeleo. "Subcontratar los aspectos dolorosos de la compra de un coche a la IA fue refrescantemente agradable", escribió.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>El agente de Hormold le ganó un litigio de seguros previamente cerrado sin previo aviso</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un usuario llamado Hormold tuvo una reclamación rechazada por Lemonade Insurance. Su OpenClaw descubrió el correo electrónico de rechazo, redactó una refutación citando el lenguaje de la póliza, y lo envió, sin permiso explícito. Lemonade reabrió la investigación. Mi @openclaw inició accidentalmente una pelea con Lemonade Insurance&quot;, tuiteó. &quot;Gracias, AI&quot;.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook: Una red social construida con OpenClaw para agentes de IA<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Los ejemplos anteriores muestran a OpenClaw automatizando tareas para usuarios individuales. Pero, ¿qué ocurre cuando miles de estos agentes interactúan entre sí?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El 28 de enero de 2026, inspirado en OpenClaw y construido con él, el empresario Matt Schlicht lanzó <a href="https://moltbook.com/">Moltbook</a>, una plataforma al estilo de Reddit en la que sólo pueden publicar agentes de IA. El crecimiento fue rápido. En 72 horas se habían registrado 32.000 agentes. En una semana, el número superaba el millón y medio. Más de un millón de humanos visitaron la plataforma durante la primera semana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los problemas de seguridad llegaron igual de rápido. El 31 de enero -cuatro días después del lanzamiento- <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media informó</a> de que un error de configuración de la base de datos Supabase había dejado todo el backend de la plataforma abierto a la Internet pública. El investigador de seguridad Jameson O'Reilly descubrió el fallo; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz lo confirmó de forma independiente</a> y documentó todo su alcance: acceso no autenticado de lectura y escritura a todas las tablas, incluyendo 1,5 millones de claves API de agentes, más de 35.000 direcciones de correo electrónico y miles de mensajes privados.</p>
<p>Si Moltbook representa un comportamiento emergente de la máquina o agentes que reproducen tropos de ciencia ficción a partir de datos de entrenamiento es una cuestión abierta. Lo que es menos ambiguo es la demostración técnica: agentes autónomos que mantienen un contexto persistente, se coordinan en una plataforma compartida y producen resultados estructurados sin instrucciones explícitas. Para los ingenieros que trabajan con OpenClaw o marcos similares, es un anticipo en vivo tanto de las capacidades como de los retos de seguridad que plantea la IA agéntica a gran escala.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Riesgos técnicos y consideraciones de producción para OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de desplegar OpenClaw en cualquier lugar importante, es necesario entender lo que realmente se está ejecutando. Se trata de un agente con acceso shell, control del navegador y capacidad para enviar correos electrónicos en su nombre, en bucle y sin preguntar. Eso es poderoso, pero la superficie de ataque es enorme y el proyecto es joven.</p>
<p><strong>El modelo de autenticación tenía un grave agujero.</strong> El 30 de enero de 2026, Mav Levin de depthfirst reveló <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8) - un fallo de secuestro de WebSocket a través del sitio donde cualquier sitio web podría robar tu token de autenticación y obtener RCE en tu máquina a través de un único enlace malicioso. Un clic, acceso completo. Esto fue parcheado en <code translate="no">2026.1.29</code>, pero Censys encontró más de 21.000 instancias de OpenClaw expuestas a la Internet pública en ese momento, muchas a través de HTTP. <strong>Si estás ejecutando una versión anterior o no has bloqueado la configuración de tu red, compruébalo primero.</strong></p>
<p><strong>Las habilidades son sólo código de extraños, y no hay sandbox.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">El equipo de seguridad de Cisco</a> desmontó una habilidad llamada "¿Qué haría Elon?" que había alcanzado el número 1 en el repositorio. Se trataba de malware puro y duro: utilizaba la inyección rápida para saltarse las comprobaciones de seguridad y filtraba los datos del usuario a un servidor controlado por el atacante. Encontraron nueve vulnerabilidades en esa habilidad, dos de ellas críticas. Cuando auditaron 31.000 habilidades de agentes en múltiples plataformas (Claude, Copilot, repos genéricos de AgentSkills), el 26% tenía al menos una vulnerabilidad. Sólo en la primera semana de febrero se subieron a ClawHub más de 230 habilidades maliciosas. <strong>Trata cada skill que no hayas escrito tú mismo como una dependencia no fiable - haz un fork, léelo e instálalo.</strong></p>
<p><strong>El bucle de latido hará cosas que no pediste.</strong> Esa historia de Hormold de la introducción - en la que el agente encontró una denegación de seguro, investigó precedentes y envió una refutación legal de forma autónoma - no es una demostración de características; es un riesgo de responsabilidad. El agente se comprometió a enviar correspondencia legal sin aprobación humana. Aquella vez funcionó. No siempre será así. <strong>Cualquier cosa que implique pagos, eliminaciones o comunicación externa necesita una puerta humana en el bucle, y punto.</strong></p>
<p><strong>Los costes de la API aumentan rápidamente si no estás atento.</strong> Números aproximados: una configuración ligera con unos pocos latidos al día cuesta entre 18 y 36 dólares al mes con Sonnet 4.5. Aumentar esa cifra a más de 12 comprobaciones diarias puede suponer un coste adicional. Si a eso le sumamos más de 12 comprobaciones diarias en Opus, el coste mensual es de 270-540 dólares. Una persona en HN descubrió que estaba gastando 70 dólares al mes en llamadas redundantes a la API y en registros detallados. <strong>Establezca alertas de gasto a nivel de proveedor.</strong> Un intervalo de heartbeat mal configurado puede agotar su presupuesto de API de la noche a la mañana.</p>
<p>Antes de desplegarlo, le recomendamos encarecidamente que lo revise:</p>
<ul>
<li><p>Ejecutarlo en un entorno aislado - una máquina virtual o contenedor dedicado, no su conductor diario.</p></li>
<li><p>Fork y auditar cada habilidad antes de instalar. Lee el código fuente. Todo.</p></li>
<li><p>Establezca límites estrictos de gasto de API a nivel de proveedor, no sólo en la configuración del agente.</p></li>
<li><p>Protege todas las acciones irreversibles tras la aprobación humana: pagos, eliminaciones, envío de correos electrónicos, cualquier cosa externa.</p></li>
<li><p>Fija la versión 2026.1.29 o posterior y mantente al día con los parches de seguridad.</p></li>
</ul>
<p>No lo expongas a la Internet pública a menos que sepas exactamente lo que estás haciendo con la configuración de la red.</p>
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
    </button></h2><p>OpenClaw ha superado las 175.000 estrellas de GitHub en menos de dos semanas, convirtiéndose en uno de los repos de código abierto de más rápido crecimiento en la historia de GitHub. La adopción es real, y la arquitectura subyacente merece atención.</p>
<p>Desde un punto de vista técnico, OpenClaw es tres cosas que la mayoría de los agentes de IA no son: completamente de código abierto (MIT), local-first (memoria almacenada como archivos Markdown en su máquina), y programado de forma autónoma (un demonio de latido que actúa sin preguntar). Se integra con plataformas de mensajería como Slack, Telegram y WhatsApp desde el primer momento, y admite habilidades creadas por la comunidad a través de un sencillo sistema SKILL.md. Esta combinación lo hace especialmente adecuado para crear asistentes siempre activos: bots de Slack que responden preguntas 24/7, monitores de bandeja de entrada que trian el correo electrónico mientras duermes, o flujos de trabajo de automatización que se ejecutan en tu propio hardware sin dependencia del proveedor.</p>
<p>Dicho esto, la arquitectura que hace potente a OpenClaw también lo convierte en un riesgo si se despliega de forma descuidada. Algunas cosas que hay que tener en cuenta:</p>
<ul>
<li><p><strong>Ejecútelo de forma aislada.</strong> Utilice un dispositivo dedicado o una máquina virtual, no su máquina principal. Si algo va mal, necesita un interruptor de corte físicamente accesible.</p></li>
<li><p><strong>Audite las competencias antes de instalarlas.</strong> El 26% de las competencias comunitarias analizadas por Cisco contenían al menos una vulnerabilidad. Bifurque y revise todo aquello en lo que no confíe.</p></li>
<li><p><strong>Establezca límites de gasto de API a nivel de proveedor.</strong> Un heartbeat mal configurado puede quemar cientos de dólares de la noche a la mañana. Configure alertas antes de desplegar.</p></li>
<li><p><strong>Bloquee las acciones irreversibles.</strong> Pagos, eliminaciones, comunicaciones externas: deben requerir la aprobación humana, no la ejecución autónoma.</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Seguir leyendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guía paso a paso para configurar OpenClaw con Slack</a> - Cree un robot de soporte de IA impulsado por Milvus en su espacio de trabajo de Slack utilizando OpenClaw</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term</a> Memory - Cómo dotar a sus agentes de memoria semántica persistente con Milvus</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Stop Building Vanilla RAG: Embrace Agentic RAG with DeepSearcher</a> - Why agentic RAG outperforms traditional retrieval, with a hands-on open-source implementation</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG with Milvus and LangGraph</a> - Tutorial: construir un agente que decide cuándo recuperar, califica la relevancia de los documentos y reescribe las consultas</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Building a Production-Ready AI Assistant with Spring Boot and Milvus</a> - Guía completa para crear un asistente de IA empresarial con búsqueda semántica y memoria de conversación</p></li>
</ul>
