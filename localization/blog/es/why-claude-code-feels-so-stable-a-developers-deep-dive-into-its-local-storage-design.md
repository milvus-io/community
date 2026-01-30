---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Por qué el código de Claude es tan estable: Una inmersión profunda de un
  desarrollador en su diseño de almacenamiento local
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Profundice en el almacenamiento de Claude Code: Registros de sesión JSONL,
  aislamiento de proyectos, configuración por capas e instantáneas de archivos
  que hacen que la codificación asistida por IA sea estable y recuperable.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Últimamente, el código Claude está en todas partes. Los desarrolladores lo utilizan para acelerar el lanzamiento de funcionalidades, automatizar flujos de trabajo y crear prototipos de agentes que funcionan en proyectos reales. Lo que es aún más sorprendente es la cantidad de personas que no son programadores que también se han lanzado a crear herramientas, cablear tareas y obtener resultados útiles sin apenas configuración. Es raro ver que una herramienta de programación de IA se extienda tan rápidamente a tantos niveles de conocimientos.</p>
<p>Pero lo que realmente destaca es su <em>estabilidad</em>. Claude Code recuerda lo que ha ocurrido en las distintas sesiones, sobrevive a los bloqueos sin perder el progreso y se comporta más como una herramienta de desarrollo local que como una interfaz de chat. Esta fiabilidad proviene de cómo gestiona el almacenamiento local.</p>
<p>En lugar de tratar su sesión de codificación como un chat temporal, Claude Code lee y escribe archivos reales, almacena el estado del proyecto en el disco y registra cada paso del trabajo del agente. Las sesiones pueden reanudarse, inspeccionarse o revertirse sin conjeturas, y cada proyecto permanece limpiamente aislado, evitando los problemas de contaminación cruzada con los que tropiezan muchas herramientas de agentes.</p>
<p>En este post, vamos a echar un vistazo más de cerca a la arquitectura de almacenamiento detrás de esa estabilidad, y por qué juega un papel tan importante en hacer Claude Code sentir práctico para el desarrollo diario.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Desafíos a los que se enfrenta todo asistente de codificación de IA local<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de explicar cómo aborda Claude Code el almacenamiento, echemos un vistazo a los problemas comunes con los que suelen encontrarse las herramientas de codificación local de IA. Estos surgen de forma natural cuando un asistente trabaja directamente en tu sistema de archivos y mantiene el estado a lo largo del tiempo.</p>
<p><strong>1. Los datos del proyecto se mezclan a través de los espacios de trabajo.</strong></p>
<p>La mayoría de los desarrolladores cambian entre varios repos a lo largo del día. Si un asistente lleva el estado de un proyecto a otro, se hace más difícil entender su comportamiento y más fácil para él hacer suposiciones incorrectas. Cada proyecto necesita su propio espacio limpio y aislado para el estado y el historial.</p>
<p><strong>2. Las caídas pueden provocar pérdidas de datos.</strong></p>
<p>Durante una sesión de codificación, un asistente produce un flujo constante de datos útiles -ediciones de archivos, llamadas a herramientas, pasos intermedios-. Si estos datos no se guardan inmediatamente, un fallo o un reinicio forzado pueden eliminarlos. Un sistema fiable escribe el estado importante en el disco tan pronto como se crea para que el trabajo no se pierda inesperadamente.</p>
<p><strong>3. No siempre está claro qué ha hecho realmente el agente.</strong></p>
<p>Una sesión típica implica muchas pequeñas acciones. Sin un registro claro y ordenado de esas acciones, es difícil rastrear cómo llegó el asistente a un determinado resultado o localizar el paso en el que algo salió mal. Un historial completo hace que la depuración y la revisión sean mucho más manejables.</p>
<p><strong>4. Deshacer errores requiere demasiado esfuerzo.</strong></p>
<p>A veces, el asistente realiza cambios que no acaban de funcionar. Si no tiene una forma integrada de deshacer esos cambios, acabará buscando manualmente las ediciones en el repositorio. El sistema debería rastrear automáticamente lo que ha cambiado para que puedas deshacerlo limpiamente sin trabajo extra.</p>
<p><strong>5. Diferentes proyectos necesitan diferentes configuraciones.</strong></p>
<p>Los entornos locales varían. Algunos proyectos requieren permisos específicos, herramientas o reglas de directorio; otros tienen scripts o flujos de trabajo personalizados. Un asistente debe respetar estas diferencias y permitir configuraciones por proyecto, manteniendo al mismo tiempo un comportamiento coherente.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Los principios de diseño de almacenamiento detrás de Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>El diseño de almacenamiento de Claude Code se basa en cuatro ideas sencillas. Pueden parecer simples, pero juntas abordan los problemas prácticos que surgen cuando un asistente de IA trabaja directamente en su máquina y en múltiples proyectos.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Cada proyecto tiene su propio almacenamiento.</h3><p>Claude Code vincula todos los datos de sesión al directorio del proyecto al que pertenecen. Esto significa que las conversaciones, ediciones y registros permanecen en el proyecto del que proceden y no se filtran a otros. Mantener el almacenamiento separado hace que el comportamiento del asistente sea más fácil de entender y simplifica la inspección o eliminación de datos de un repositorio específico.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Los datos se guardan en el disco inmediatamente.</h3><p>En lugar de mantener los datos de interacción en memoria, Claude Code los escribe en el disco tan pronto como se crean. Cada evento -mensaje, llamada a una herramienta o actualización de estado- se añade como una nueva entrada. Si el programa se bloquea o se cierra inesperadamente, casi todo sigue ahí. Este enfoque mantiene las sesiones duraderas sin añadir mucha complejidad.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Cada acción tiene un lugar claro en la historia.</h3><p>Claude Code vincula cada mensaje y acción de la herramienta con el anterior, formando una secuencia completa. Este historial ordenado hace posible revisar cómo se desarrolló una sesión y rastrear los pasos que llevaron a un resultado específico. Para los desarrolladores, disponer de este tipo de traza facilita enormemente la depuración y la comprensión del comportamiento del agente.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Las ediciones de código son fáciles de revertir.</h3><p>Antes de que el asistente actualice un archivo, Claude Code guarda una instantánea de su estado anterior. Si el cambio resulta ser erróneo, puede restaurar la versión anterior sin tener que rebuscar en el repositorio o adivinar qué ha cambiado. Esta simple red de seguridad hace que las ediciones basadas en IA sean mucho menos arriesgadas.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Disposición del almacenamiento local de Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code almacena todos sus datos locales en un único lugar: su directorio personal. Esto mantiene el sistema predecible y hace que sea más fácil de inspeccionar, depurar o limpiar cuando sea necesario. La estructura de almacenamiento se construye en torno a dos componentes principales: un pequeño archivo de configuración global y un directorio de datos más grande donde reside todo el estado del proyecto.</p>
<p><strong>Dos componentes principales:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Almacena la configuración global y los accesos directos, incluidas las asignaciones de proyectos, la configuración del servidor MCP y los avisos utilizados recientemente.</p></li>
<li><p><code translate="no">~/.claude/</code>El directorio de datos principal, donde Claude Code almacena conversaciones, sesiones de proyecto, permisos, plugins, habilidades, historial y datos de ejecución relacionados.</p></li>
</ul>
<p>A continuación, vamos a examinar más detenidamente estos dos componentes principales.</p>
<p><strong>(1) Configuración global</strong>: <code translate="no">~/.claude.json</code></p>
<p>Este archivo actúa como un índice más que como un almacén de datos. Registra en qué proyectos has trabajado, qué herramientas están vinculadas a cada proyecto y qué avisos has utilizado recientemente. Los datos de la conversación en sí no se almacenan aquí.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Directorio principal de datos</strong>: <code translate="no">~/.claude/</code></p>
<p>El directorio <code translate="no">~/.claude/</code> es donde reside la mayor parte del estado local de Claude Code. Su estructura refleja algunas ideas centrales de diseño: aislamiento de proyectos, persistencia inmediata y recuperación segura de errores.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Esta disposición es intencionadamente simple: todo lo que genera Claude Code vive bajo un mismo directorio, organizado por proyecto y sesión. No hay ningún estado oculto disperso por su sistema, y es fácil de inspeccionar o limpiar cuando es necesario.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Cómo gestiona Claude Code la configuración<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de configuración de Claude Code está diseñado en torno a una idea simple: mantener el comportamiento por defecto consistente en todas las máquinas, pero permitiendo que los entornos y proyectos individuales personalicen lo que necesiten. Para que esto funcione, Claude Code utiliza un modelo de configuración de tres capas. Cuando la misma configuración aparece en más de un lugar, siempre gana la capa más específica.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Los tres niveles de configuración</h3><p>Claude Code carga la configuración en el siguiente orden, de menor a mayor prioridad:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Puede pensar en esto como si comenzara con valores predeterminados globales, luego aplicara ajustes específicos de la máquina y, finalmente, aplicara reglas específicas del proyecto.</p>
<p>A continuación veremos cada nivel de configuración en detalle.</p>
<p><strong>(1) Configuración global</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>La configuración global define el comportamiento por defecto para Claude Code en todos los proyectos. Aquí es donde se establecen los permisos básicos, se habilitan los plugins y se configura el comportamiento de limpieza.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Configuración local</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>La configuración local es específica para una sola máquina. No está pensada para ser compartida o verificada en el control de versiones. Esto la convierte en un buen lugar para claves API, herramientas locales o permisos específicos del entorno.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Configuración a nivel de proyecto</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>La configuración a nivel de proyecto sólo se aplica a un único proyecto y tiene la máxima prioridad. Aquí es donde se definen las reglas que deben aplicarse siempre que se trabaje en ese repositorio.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Una vez definidas las capas de configuración, la siguiente pregunta es <strong>cómo resuelve Claude Code la configuración y los permisos en tiempo de ejecución.</strong></p>
<p><strong>Claude Code</strong> aplica la configuración en tres capas: comienza con valores por defecto globales, luego aplica anulaciones específicas de la máquina y finalmente aplica reglas específicas del proyecto. Cuando la misma configuración aparece en varios lugares, tiene prioridad la más específica.</p>
<p>Los permisos siguen un orden de evaluación fijo:</p>
<ol>
<li><p><strong>deny</strong> - siempre bloquea</p></li>
<li><p><strong>ask</strong> - requiere confirmación</p></li>
<li><p><strong>allow</strong> - se ejecuta automáticamente</p></li>
<li><p><strong>default</strong> - se aplica sólo cuando ninguna regla coincide</p></li>
</ol>
<p>De este modo, el sistema se mantiene seguro por defecto, sin dejar de ofrecer a los proyectos y máquinas individuales la flexibilidad que necesitan.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Almacenamiento de sesiones: Cómo persiste en Claude Code el núcleo de los datos de interacción<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>En <strong>Claude</strong> Code, las sesiones son la unidad central de datos. Una sesión captura toda la interacción entre el usuario y la IA, incluyendo la conversación en sí, las llamadas a las herramientas, los cambios en los archivos y el contexto relacionado. La forma en que se almacenan las sesiones tiene un impacto directo en la fiabilidad, depurabilidad y seguridad general del sistema.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Mantener los datos de sesión separados para cada proyecto</h3><p>Una vez definidas las sesiones, la siguiente cuestión es cómo las almacena <strong>Claude</strong> Code para mantener los datos organizados y aislados.</p>
<p><strong>Claude Code</strong> aísla los datos de sesión por proyecto. Las sesiones de cada proyecto se almacenan en un directorio derivado de la ruta de archivo del proyecto.</p>
<p>La ruta de almacenamiento sigue este patrón</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Para crear un nombre de directorio válido, los caracteres especiales como <code translate="no">/</code>, espacios y <code translate="no">~</code> se sustituyen por <code translate="no">-</code>.</p>
<p>Por ejemplo:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Este enfoque garantiza que los datos de sesión de diferentes proyectos nunca se mezclen y puedan gestionarse o eliminarse por proyecto.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Por qué las sesiones se almacenan en formato JSONL</h3><p><strong>Claude Code</strong> almacena los datos de sesión utilizando JSONL (Líneas JSON) en lugar de JSON estándar.</p>
<p>En un archivo JSON tradicional, todos los mensajes están agrupados dentro de una gran estructura, lo que significa que todo el archivo tiene que ser leído y reescrito cada vez que cambia. En cambio, JSONL almacena cada mensaje como su propia línea en el archivo. Una línea equivale a un mensaje, sin envoltorio externo.</p>
<table>
<thead>
<tr><th>Aspecto</th><th>JSON estándar</th><th>JSONL (Líneas JSON)</th></tr>
</thead>
<tbody>
<tr><td>Cómo se almacenan los datos</td><td>Una gran estructura</td><td>Un mensaje por línea</td></tr>
<tr><td>Cuándo se guardan los datos</td><td>Normalmente al final</td><td>Inmediatamente, por mensaje</td></tr>
<tr><td>Impacto del fallo</td><td>Puede romperse todo el archivo</td><td>Sólo afecta a la última línea</td></tr>
<tr><td>Escritura de nuevos datos</td><td>Reescribir todo el fichero</td><td>Añadir una línea</td></tr>
<tr><td>Uso de memoria</td><td>Cargar todo</td><td>Leer línea por línea</td></tr>
</tbody>
</table>
<p>JSONL funciona mejor en varios aspectos clave:</p>
<ul>
<li><p><strong>Almacenamiento inmediato:</strong> Cada mensaje se escribe en el disco en cuanto se genera, en lugar de esperar a que termine la sesión.</p></li>
<li><p><strong>Resistente a fallos:</strong> si el programa se bloquea, sólo se pierde el último mensaje inacabado. Todo lo escrito antes permanece intacto.</p></li>
<li><p><strong>Añadidos rápidos:</strong> Los mensajes nuevos se añaden al final del fichero sin leer ni reescribir los datos existentes.</p></li>
<li><p><strong>Bajo consumo de memoria:</strong> Los archivos de sesión pueden leerse línea a línea, por lo que no es necesario cargar todo el archivo en la memoria.</p></li>
</ul>
<p>Un archivo de sesión JSONL simplificado tiene el siguiente aspecto:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Tipos de mensajes de sesión</h3><p>Un archivo de sesión registra todo lo que sucede durante una interacción con Claude Code. Para hacerlo con claridad, utiliza diferentes tipos de mensajes para diferentes tipos de eventos.</p>
<ul>
<li><p><strong>Los mensajes de usuario</strong> representan nuevas entradas en el sistema. Esto incluye no sólo lo que escribe el usuario, sino también los resultados devueltos por las herramientas, como la salida de un comando shell. Desde el punto de vista de la IA, ambas son entradas a las que debe responder.</p></li>
<li><p><strong>Los mensajes del asistente</strong> recogen lo que Claude hace como respuesta. Estos mensajes incluyen el razonamiento de la IA, el texto que genera y las herramientas que decide utilizar. También registran detalles de uso, como el recuento de tokens, para ofrecer una imagen completa de la interacción.</p></li>
<li><p><strong>Las instantáneas del historial de archivos</strong> son puntos de control de seguridad que se crean antes de que Claude modifique cualquier archivo. Al guardar primero el estado original del archivo, Claude Code permite deshacer los cambios si algo sale mal.</p></li>
<li><p><strong>Los resúmenes</strong> ofrecen una visión concisa de la sesión y están vinculados al resultado final. Facilitan la comprensión de la sesión sin necesidad de repetir cada paso.</p></li>
</ul>
<p>Juntos, estos tipos de mensajes registran no sólo la conversación, sino la secuencia completa de acciones y efectos que se producen durante una sesión.</p>
<p>Para concretar, veamos algunos ejemplos de mensajes de usuario y mensajes de asistente.</p>
<p><strong>(1) Ejemplo de mensajes de usuario:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Ejemplo de mensajes del asistente:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Cómo se vinculan los mensajes de sesión</h3><p>Claude Code no almacena los mensajes de sesión como entradas aisladas. En su lugar, los enlaza para formar una clara cadena de acontecimientos. Cada mensaje incluye un identificador único (<code translate="no">uuid</code>) y una referencia al mensaje que le precede (<code translate="no">parentUuid</code>). Esto permite ver no sólo lo que ha ocurrido, sino por qué ha ocurrido.</p>
<p>Una sesión comienza con un mensaje de usuario, que inicia la cadena. Cada respuesta de Claude apunta al mensaje que la causó. Las llamadas a las herramientas y sus resultados se añaden de la misma manera, con cada paso vinculado al anterior. Cuando finaliza la sesión, se adjunta un resumen al mensaje final.</p>
<p>Dado que cada paso está conectado, Claude Code puede reproducir la secuencia completa de acciones y comprender cómo se produjo un resultado, lo que facilita enormemente la depuración y el análisis.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Cambios en el código fáciles de deshacer con instantáneas de archivos<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>Las ediciones generadas por la IA no siempre son correctas, y a veces van en la dirección completamente equivocada. Para que sea seguro experimentar con estos cambios, Claude Code utiliza un sencillo sistema de instantáneas que le permite deshacer las ediciones sin tener que rebuscar en los diffs o limpiar manualmente los archivos.</p>
<p>La idea es sencilla: <strong>antes de que Claude Code modifique un archivo, guarda una copia del contenido original.</strong> Si la edición resulta ser un error, el sistema puede restaurar la versión anterior al instante.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">¿Qué es una <em>instantánea del historial de archivos</em>?</h3><p>Una <em>instantánea del historial de</em> archivos es un punto de control creado antes de que se modifiquen los archivos. Registra el contenido original de cada archivo que <strong>Claude</strong> está a punto de editar. Estas instantáneas sirven como fuente de datos para las operaciones de deshacer y retroceder.</p>
<p>Cuando un usuario envía un mensaje que puede modificar archivos, <strong>Claude Code</strong> crea una instantánea vacía para ese mensaje. Antes de editar, el sistema realiza una copia de seguridad del contenido original de cada archivo de destino en la instantánea y, a continuación, aplica las modificaciones directamente al disco. Si el usuario desencadena la <em>acción de deshacer</em>, <strong>Claude</strong> Code restaura el contenido guardado y sobrescribe los archivos modificados.</p>
<p>En la práctica, el ciclo de vida de una edición que se puede deshacer es el siguiente:</p>
<ol>
<li><p>El<strong>usuario envía un mensajeClaude</strong>Code crea un nuevo registro vacío en <code translate="no">file-history-snapshot</code>.</p></li>
<li><p><strong>Claude se prepara para modificar los archivosEl</strong>sistema identifica qué archivos serán editados y realiza una copia de seguridad de su contenido original en <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude ejecuta la</strong>ediciónSe realizan las operaciones de<strong>edición</strong>y escritura, y el contenido modificado se escribe en el disco.</p></li>
<li><p><strong>El usuario desencadena la acción de deshacerEl</strong>usuario pulsa <strong>Esc + Esc</strong>, indicando que los cambios deben revertirse.</p></li>
<li><p><strong>Se restaura el contenido originalClaude</strong>Code lee el contenido guardado de <code translate="no">trackedFileBackups</code> y sobrescribe los archivos actuales, completando el deshacer.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Por qué funciona Deshacer: Las instantáneas guardan la versión antigua</h3><p>Deshacer en Claude Code funciona porque el sistema guarda el contenido <em>original</em> del archivo antes de que se produzca cualquier edición.</p>
<p>En lugar de intentar revertir los cambios a posteriori, Claude Code adopta un enfoque más sencillo: copia el archivo tal y como existía <em>antes de</em> la modificación y almacena esa copia en <code translate="no">trackedFileBackups</code>. Cuando el usuario activa la acción de deshacer, el sistema restaura esta versión guardada y sobrescribe el archivo editado.</p>
<p>El diagrama siguiente muestra este flujo paso a paso:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">Aspecto interno de una <em>instantánea del historial de archivos</em> </h3><p>La instantánea se almacena como un registro estructurado. Captura metadatos sobre el mensaje del usuario, la hora de la instantánea y, lo que es más importante, un mapa de los archivos con su contenido original.</p>
<p>El ejemplo siguiente muestra un único registro de <code translate="no">file-history-snapshot</code> creado antes de que Claude edite ningún archivo. Cada entrada de <code translate="no">trackedFileBackups</code> almacena el contenido <em>previo a la edición</em> de un archivo, que posteriormente se utiliza para restaurar el archivo durante una operación de deshacer.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Dónde se almacenan las instantáneas y cuánto tiempo se conservan</h3><ul>
<li><p><strong>Dónde se almacenan los metadatos de las instantáneas</strong>: Los registros de instantáneas están vinculados a una sesión específica y se guardan como archivos JSONL en<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Dónde se guarda la copia de seguridad del contenido original de los archivos</strong>: El contenido previo a la edición de cada archivo se almacena por separado por hash de contenido en<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Cuánto tiempo se conservan</strong> las<strong>instantáneas por defecto</strong>: Los datos de las instantáneas se conservan durante 30 días, de acuerdo con la configuración global de <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Cómo cambiar el periodo de retención</strong>: El número de días de retención se puede ajustar a través del campo <code translate="no">cleanupPeriodDays</code> en <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Comandos relacionados</h3><table>
<thead>
<tr><th>Comando / Acción</th><th>Descripción</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Deshacer la ronda más reciente de ediciones de archivos (más utilizado)</td></tr>
<tr><td>/retroceso</td><td>Volver a un punto de control especificado previamente (instantánea)</td></tr>
<tr><td>/diff</td><td>Ver las diferencias entre el archivo actual y la instantánea de copia de seguridad</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Otros directorios importantes<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Gestión de complementos</strong></p>
<p>El directorio <code translate="no">plugins/</code> almacena complementos que proporcionan a Claude Code capacidades adicionales.</p>
<p>Este directorio almacena qué <em>plugins</em> están instalados, de dónde provienen y las habilidades extra que esos plugins proporcionan. También guarda copias locales de los plugins descargados para que no tengan que ser recuperados de nuevo.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - Donde se almacenan y aplican las habilidades</strong></p>
<p>En Claude Code, una habilidad es una pequeña capacidad reutilizable que ayuda a Claude a realizar una tarea específica, como trabajar con PDFs, editar documentos o seguir un flujo de trabajo de codificación.</p>
<p>No todas las habilidades están disponibles en todas partes. Algunas se aplican globalmente, mientras que otras están limitadas a un único proyecto o son proporcionadas por un plugin. Claude Code almacena las habilidades en diferentes ubicaciones para controlar dónde puede utilizarse cada habilidad.</p>
<p>La jerarquía que se muestra a continuación indica cómo se clasifican las habilidades por ámbito, desde las disponibles globalmente hasta las específicas de un proyecto y las proporcionadas por un plugin.</p>
<table>
<thead>
<tr><th>Nivel</th><th>Ubicación de almacenamiento</th><th>Descripción</th></tr>
</thead>
<tbody>
<tr><td>Usuario</td><td>~/.claude/skills/</td><td>Disponible globalmente, accesible por todos los proyectos</td></tr>
<tr><td>Proyecto</td><td>proyecto/.claude/habilidades/</td><td>Disponible sólo para el proyecto actual, personalización específica del proyecto</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/mercados/*/habilidades/</td><td>Instalado con plugins, depende del estado de habilitación del plugin</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Almacenamiento de listas de tareas</strong></p>
<p>El directorio <code translate="no">todos/</code> almacena listas de tareas que Claude crea para realizar un seguimiento del trabajo durante una conversación, como pasos a completar, elementos en curso y tareas completadas.</p>
<p>Las listas de tareas se guardan como archivos JSON en<code translate="no">~/.claude/todos/{session-id}-*.json</code>. Cada nombre de archivo incluye el ID de sesión, que vincula la lista de tareas a una conversación específica.</p>
<p>El contenido de estos archivos procede de la herramienta <code translate="no">TodoWrite</code> e incluye información básica sobre la tarea, como su descripción, estado actual, prioridad y metadatos relacionados.</p>
<p><strong>(4) local/ - Tiempo de ejecución local y herramientas</strong></p>
<p>El directorio <code translate="no">local/</code> contiene los archivos centrales que Claude Code necesita para ejecutarse en su máquina.</p>
<p>Esto incluye el ejecutable de línea de comandos <code translate="no">claude</code> y el directorio <code translate="no">node_modules/</code> que contiene sus dependencias de tiempo de ejecución. Al mantener estos componentes locales, Claude Code puede ejecutarse de forma independiente, sin depender de servicios externos o instalaciones en todo el sistema.</p>
<p><strong>（5）Directorios de apoyo adicionales</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Almacena instantáneas del estado de la sesión de shell (como el directorio actual y las variables de entorno), permitiendo la reversión de operaciones de shell.</p></li>
<li><p><strong>plans/:</strong> Almacena los planes de ejecución generados por el modo Plan (por ejemplo, desgloses paso a paso de tareas de programación de varios pasos).</p></li>
<li><p><strong>statsig/:</strong> Almacena en caché las configuraciones de los indicadores de características (por ejemplo, si las nuevas características están habilitadas) para reducir las solicitudes repetidas.</p></li>
<li><p><strong>telemetry/:</strong> Almacena datos telemétricos anónimos (como la frecuencia de uso de las funciones) para optimizar el producto.</p></li>
<li><p><strong>debug/:</strong> Almacena los registros de depuración (incluidas las pilas de errores y las trazas de ejecución) para facilitar la resolución de problemas.</p></li>
</ul>
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
    </button></h2><p>Después de escarbar en cómo Claude Code almacena y gestiona todo localmente, la imagen se vuelve bastante clara: la herramienta se siente estable porque la base es sólida. Nada del otro mundo, sólo ingeniería bien pensada. Cada proyecto tiene su propio espacio, cada acción se anota y se hace una copia de seguridad de las ediciones de los archivos antes de que nada cambie. Es el tipo de diseño que hace tranquilamente su trabajo y te permite centrarte en el tuyo.</p>
<p>Lo que más me gusta es que aquí no hay nada místico. Claude Code funciona bien porque lo básico está bien hecho. Si alguna vez ha tratado de construir un agente que toca archivos reales, usted sabe lo fácil que es que las cosas se caigan a pedazos - el estado se mezcla, los accidentes borran el progreso, y deshacer se convierte en una conjetura. Claude Code evita todo eso con un modelo de almacenamiento que es simple, consistente y difícil de romper.</p>
<p>Para los equipos que crean agentes de IA locales o locales, especialmente en entornos seguros, este enfoque muestra cómo un almacenamiento y una persistencia sólidos hacen que las herramientas de IA sean fiables y prácticas para el desarrollo diario.</p>
<p>Si está diseñando agentes de IA locales u on-prem y desea hablar sobre la arquitectura de almacenamiento, el diseño de sesiones o la reversión segura con más detalle, no dude en unirse a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a>. También puede reservar una sesión individual de 20 minutos a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para obtener orientación personalizada.</p>
