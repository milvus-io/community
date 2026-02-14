---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: >-
  Añadir memoria persistente al código Claude con el complemento ligero
  memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Dale a Claude Code memoria a largo plazo con memsearch ccplugin.
  Almacenamiento Markdown ligero y transparente, recuperación semántica
  automática, sin sobrecarga de tokens.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Recientemente hemos creado y puesto a disposición del público <a href="https://github.com/zilliztech/memsearch">memsearch</a>, una biblioteca de memoria a largo plazo independiente y plug-and-play que proporciona a cualquier agente una memoria persistente, transparente y personalizable. Utiliza la misma arquitectura de memoria subyacente que OpenClaw, pero sin el resto de la pila de OpenClaw. Esto significa que puede instalarla en cualquier estructura de agentes (Claude, GPT, Llama, agentes personalizados, motores de flujo de trabajo) y añadir al instante memoria duradera y consultable. <em>(Si quieres conocer en profundidad cómo funciona memsearch, hemos escrito un</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>post aparte aquí</em></a><em>).</em></p>
<p>En la mayoría de los flujos de trabajo de agentes, memsearch funciona exactamente como se pretende. Pero <strong>la codificación</strong> de <strong>agentes</strong> es otra historia. Las sesiones de codificación son largas, los cambios de contexto son constantes y la información que merece la pena conservar se acumula durante días o semanas. Este volumen y volatilidad ponen de manifiesto los puntos débiles de los sistemas de memoria típicos de los agentes, incluida la búsqueda automática. En los escenarios de codificación, los patrones de recuperación difieren lo suficiente como para no poder reutilizar la herramienta existente tal cual.</p>
<p>Para solucionarlo, hemos creado un <strong>complemento de memoria persistente diseñado específicamente para Claude Code</strong>. Se encuentra en la parte superior de la CLI memsearch, y lo estamos llamando el <strong>ccplugin memsearch</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(código abierto, licencia MIT)</em></li>
</ul>
<p>Con el ligero <strong>ccplugin mem</strong> search gestionando la memoria entre bastidores, Claude Code adquiere la capacidad de recordar cada conversación, cada decisión, cada preferencia de estilo y cada hilo de varios días, indexado automáticamente, con capacidad de búsqueda completa y persistente entre sesiones.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Para mayor claridad a lo largo de este artículo: "ccplugin" se refiere a la capa superior, o al propio plugin Claude Code. "memsearch" se refiere a la capa inferior, la herramienta CLI independiente que se encuentra debajo.</em></p>
<p>Entonces, ¿por qué la codificación necesita su propio plugin, y por qué construimos algo tan ligero? Se reduce a dos problemas con los que casi seguro te has topado: La falta de memoria persistente de Claude Code, y la torpeza y complejidad de las soluciones existentes como claude-mem.</p>
<p>Entonces, ¿por qué crear un plugin dedicado? Porque los agentes de codificación se topan con dos puntos dolorosos que casi con toda seguridad usted mismo ha experimentado:</p>
<ul>
<li><p>Claude Code no tiene memoria persistente.</p></li>
<li><p>Muchas de las soluciones existentes en la comunidad -como <em>claude-mem- son</em>potentes pero pesadas, torpes o demasiado complejas para el trabajo diario de codificación.</p></li>
</ul>
<p>El ccplugin pretende resolver ambos problemas con una capa mínima, transparente y fácil de usar para el desarrollador sobre memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">El problema de memoria de Claude Code: lo olvida todo cuando termina una sesión<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Comencemos con un escenario con el que los usuarios de Claude Code seguramente se han encontrado.</p>
<p>Usted abre Claude Code por la mañana. "Continúa con la refactorización de autenticación de ayer", escribes. Claude responde: "No estoy seguro de en qué estabas trabajando ayer". Así que pasas los siguientes diez minutos copiando y pegando los registros de ayer. No es un gran problema, pero se vuelve molesto rápidamente porque aparece con mucha frecuencia.</p>
<p>Aunque Claude Code tiene sus propios mecanismos de memoria, están lejos de ser satisfactorios. El archivo <code translate="no">CLAUDE.md</code> puede almacenar directivas de proyecto y preferencias, pero funciona mejor para reglas estáticas y comandos cortos, no para acumular conocimientos a largo plazo.</p>
<p>Claude Code ofrece los comandos <code translate="no">resume</code> y <code translate="no">fork</code>, pero están lejos de ser fáciles de usar. Para los comandos de bifurcación, es necesario recordar los identificadores de sesión, escribir los comandos manualmente y gestionar un árbol de historiales de conversaciones ramificadas. Cuando ejecutas <code translate="no">/resume</code>, obtienes un muro de títulos de sesión. Si sólo recuerdas unos pocos detalles sobre lo que hiciste y fue hace más de unos días, buena suerte encontrando la correcta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para acumular conocimientos a largo plazo y entre proyectos, todo este planteamiento es imposible.</p>
<p>Para cumplir esta idea, claude-mem utiliza un sistema de memoria de tres niveles. El primer nivel busca en resúmenes de alto nivel. El segundo nivel busca más detalles en una línea de tiempo. El tercer nivel extrae observaciones completas de la conversación en bruto. Además, incluye etiquetas de privacidad, seguimiento de costes y una interfaz de visualización web.</p>
<p>Así es como funciona:</p>
<ul>
<li><p><strong>Capa de tiempo de ejecución.</strong> Un servicio Node.js Worker se ejecuta en el puerto 37777. Los metadatos de la sesión se almacenan en una base de datos SQLite ligera. Una base de datos vectorial gestiona la recuperación semántica precisa sobre el contenido de la memoria.</p></li>
<li><p><strong>Capa de interacción.</strong> Una interfaz de usuario web basada en React permite ver los recuerdos capturados en tiempo real: resúmenes, líneas de tiempo y registros sin procesar.</p></li>
<li><p><strong>Capa de interfaz.</strong> Un servidor MCP (Model Context Protocol) expone interfaces de herramientas estandarizadas. Claude puede llamar a <code translate="no">search</code> (consultar resúmenes de alto nivel), <code translate="no">timeline</code> (ver líneas de tiempo detalladas) y <code translate="no">get_observations</code> (recuperar registros de interacción sin procesar) para recuperar y utilizar memorias directamente.</p></li>
</ul>
<p>Para ser justos, se trata de un producto sólido que resuelve el problema de memoria de Claude Code. Pero es tosco y complejo en aspectos que importan en el día a día.</p>
<table>
<thead>
<tr><th>Capa</th><th>Tecnología</th></tr>
</thead>
<tbody>
<tr><td>Lenguaje</td><td>TypeScript (ES2022, módulos ESNext)</td></tr>
<tr><td>Tiempo de ejecución</td><td>Node.js 18+</td></tr>
<tr><td>Base de datos</td><td>SQLite 3 con controlador bun:sqlite</td></tr>
<tr><td>Almacén vectorial</td><td>ChromaDB (opcional, para búsqueda semántica)</td></tr>
<tr><td>Servidor HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>En tiempo real</td><td>Eventos enviados por el servidor (SSE)</td></tr>
<tr><td>Marco de interfaz de usuario</td><td>React + TypeScript</td></tr>
<tr><td>SDK DE IA</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Herramienta de construcción</td><td>esbuild (incluye TypeScript)</td></tr>
<tr><td>Gestor de procesos</td><td>Bun</td></tr>
<tr><td>Pruebas</td><td>Ejecutor de pruebas integrado en Node.js</td></tr>
</tbody>
</table>
<p><strong>Para empezar, la configuración es pesada.</strong> Poner en marcha claude-mem significa instalar Node.js, Bun y el tiempo de ejecución MCP, y luego montar un servicio Worker, un servidor Express, React UI, SQLite y un almacén vectorial. Son muchas partes móviles que desplegar, mantener y depurar cuando algo se rompe.</p>
<p><strong>Todos esos componentes también queman tokens que no pediste gastar.</strong> Las definiciones de herramientas MCP se cargan permanentemente en la ventana de contexto de Claude, y cada llamada a una herramienta consume tokens en la petición y en la respuesta. En sesiones largas, esa sobrecarga se acumula rápidamente y puede hacer que el coste de los tokens se descontrole.</p>
<p><strong>La recuperación de memoria no es fiable porque depende totalmente de que Claude decida buscar.</strong> Claude tiene que decidir por sí mismo llamar a herramientas como <code translate="no">search</code> para activar la recuperación. Si no se da cuenta de que necesita una memoria, el contenido relevante nunca aparece. Y cada uno de los tres niveles de memoria requiere su propia invocación explícita a la herramienta, por lo que no hay alternativa si Claude no piensa en buscar.</p>
<p><strong>Por último, el almacenamiento de datos es opaco, lo que dificulta la depuración y la migración.</strong> Las memorias se dividen entre SQLite para los metadatos de sesión y Chroma para los datos vectoriales binarios, sin ningún formato abierto que los una. Migrar significa escribir scripts de exportación. Para ver lo que recuerda la IA, hay que utilizar la interfaz de usuario web o una interfaz de consulta específica. No hay forma de ver los datos en bruto.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">¿Por qué es mejor el plugin memsearch para Claude Code?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Queríamos una capa de memoria que fuera realmente ligera: sin servicios adicionales, sin una arquitectura enmarañada, sin sobrecarga operativa. Eso es lo que nos motivó a construir el <strong>ccplugin memsearch</strong>. En el fondo, se trataba de un experimento: <em>¿podría ser radicalmente más sencillo un sistema de memoria centrado en la codificación?</em></p>
<p>Sí, y lo hemos demostrado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Todo el ccplugin son cuatro hooks de shell más un proceso de vigilancia en segundo plano. Sin Node.js, sin servidor MCP, sin interfaz web. Son sólo scripts de shell que llaman a la CLI de memsearch, lo que reduce drásticamente la barra de configuración y mantenimiento.</p>
<p>El ccplugin puede ser tan delgado debido a los estrictos límites de responsabilidad. No gestiona el almacenamiento en memoria, la recuperación de vectores ni la incrustación de texto. Todo eso se delega a la CLI memsearch. El ccplugin tiene un único trabajo: puentear los eventos del ciclo de vida de Claude Code (inicio de sesión, envío de solicitud, parada de respuesta, fin de sesión) a las correspondientes funciones CLI de memsearch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este diseño desacoplado hace que el sistema sea flexible más allá de Claude Code. La CLI de memsearch funciona independientemente con otros IDEs, otros marcos de agentes, o incluso con una simple invocación manual. No está limitado a un único caso de uso.</p>
<p>En la práctica, este diseño ofrece tres ventajas clave.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. 1. Todas las memorias viven en archivos Markdown planos</h3><p>Cada memoria que crea el ccplugin vive en <code translate="no">.memsearch/memory/</code> como un archivo Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Es un archivo por día. Cada archivo contiene los resúmenes de las sesiones de ese día en texto sin formato, totalmente legibles. Aquí tienes una captura de pantalla de los archivos de memoria diarios del propio proyecto memsearch:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Puedes ver el formato de inmediato: marca de tiempo, ID de sesión, ID de turno y un resumen de la sesión. No hay nada oculto.</p>
<p>¿Quieres saber lo que recuerda la IA? Abre el archivo Markdown. ¿Quieres editar un recuerdo? Utiliza tu editor de texto. ¿Quieres migrar tus datos? Copia la carpeta <code translate="no">.memsearch/memory/</code>.</p>
<p>El índice vectorial <a href="https://milvus.io/">de Milvus</a> es una caché para acelerar la búsqueda semántica. Se reconstruye a partir de Markdown en cualquier momento. Sin bases de datos opacas, sin cajas negras binarias. Todos los datos son trazables y totalmente reconstruibles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. Inyección automática de contexto sin coste adicional de tokens</h3><p>El almacenamiento transparente es la base de este sistema. La verdadera recompensa viene de cómo se utilizan estas memorias, y en ccplugin, la recuperación de memoria es totalmente automática.</p>
<p>Cada vez que se envía una solicitud, el gancho <code translate="no">UserPromptSubmit</code> realiza una búsqueda semántica e inyecta los tres recuerdos más relevantes en el contexto. Claude no decide si buscar o no. Sólo obtiene el contexto.</p>
<p>Durante este proceso, Claude nunca ve definiciones de herramientas MCP, por lo que la ventana de contexto no está ocupada por nada más. El gancho se ejecuta en la capa CLI e inyecta los resultados de la búsqueda en texto plano. Sin sobrecarga IPC, sin costes de token de llamada a herramienta. La sobrecarga de la ventana de contexto que viene con las definiciones de herramientas MCP desaparece por completo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para los casos en los que el top-3 automático no es suficiente, también hemos creado tres niveles de recuperación progresiva. Los tres son comandos CLI, no herramientas MCP.</p>
<ul>
<li><p><strong>L1 (automático):</strong> Cada consulta devuelve los 3 primeros resultados de búsqueda semántica con una vista previa de <code translate="no">chunk_hash</code> y 200 caracteres. Cubre la mayor parte del uso cotidiano.</p></li>
<li><p><strong>L2 (a petición):</strong> Cuando se necesita el contexto completo, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> devuelve la sección Markdown completa más los metadatos.</p></li>
<li><p><strong>L3 (en profundidad):</strong> Cuando se necesita la conversación original, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> extrae el registro JSONL sin procesar de Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Los resúmenes de sesión se generan en segundo plano con un coste casi nulo.</h3><p>La recuperación cubre cómo se utilizan las memorias. Pero primero hay que escribir las memorias. ¿Cómo se crean todos esos archivos Markdown?</p>
<p>El ccplugin los genera a través de una canalización en segundo plano que se ejecuta de forma asíncrona y no cuesta casi nada. Cada vez que detienes una respuesta de Claude, se activa el gancho <code translate="no">Stop</code>: analiza la transcripción de la conversación, llama a Claude Haiku (<code translate="no">claude -p --model haiku</code>) para generar un resumen y lo añade al archivo Markdown del día en curso. Las llamadas a la API de Haiku son extremadamente baratas, casi insignificantes por invocación.</p>
<p>A partir de ahí, el proceso de vigilancia detecta el cambio de archivo e indexa automáticamente el nuevo contenido en Milvus para que esté disponible para su recuperación inmediata. Todo el flujo se ejecuta en segundo plano sin interrumpir su trabajo, y los costes permanecen controlados.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Inicio rápido del plugin memsearch con Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Primero, instálelo desde el mercado de plugins de Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Segundo, reinicie Claude Code.</h3><p>El plugin inicializa su configuración automáticamente.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Tercero, después de una conversación, compruebe el archivo de memoria del día:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Cuarto, disfrute.</h3><p>La próxima vez que se inicie Claude Code, el sistema recuperará e inyectará automáticamente los recuerdos relevantes. No se necesitan pasos adicionales.</p>
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
    </button></h2><p>Volvamos a la pregunta original: ¿cómo dotar a la IA de memoria persistente? claude-mem y memsearch ccplugin adoptan enfoques diferentes, cada uno con puntos fuertes distintos. Resumimos una guía rápida para elegir entre ellos:</p>
<table>
<thead>
<tr><th>Categoría</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Arquitectura</td><td>4 shell hooks + 1 proceso watch</td><td>Trabajador Node.js + Express + React UI</td></tr>
<tr><td>Método de integración</td><td>Ganchos nativos + CLI</td><td>Servidor MCP (stdio)</td></tr>
<tr><td>Recuperar</td><td>Automática (inyección de hooks)</td><td>Dirigido por agente (requiere invocación de herramienta)</td></tr>
<tr><td>Consumo de contexto</td><td>Cero (inyectar sólo texto de resultados)</td><td>Las definiciones de herramientas MCP persisten</td></tr>
<tr><td>Resumen de sesión</td><td>Una llamada asíncrona Haiku CLI</td><td>Múltiples llamadas API + compresión de la observación</td></tr>
<tr><td>Formato de almacenamiento</td><td>Archivos Markdown</td><td>SQLite + incrustaciones Chroma</td></tr>
<tr><td>Migración de datos</td><td>Archivos Markdown planos</td><td>SQLite + incrustaciones Chroma</td></tr>
<tr><td>Método de migración</td><td>Copia de archivos .md</td><td>Exportación desde la base de datos</td></tr>
<tr><td>Tiempo de ejecución</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCP runtime</td></tr>
</tbody>
</table>
<p>claude-mem ofrece características más ricas, una interfaz de usuario pulida y un control más preciso. Para equipos que necesitan colaboración, visualización web o gestión detallada de la memoria, es una buena elección.</p>
<p>memsearch ccplugin ofrece un diseño mínimo, cero sobrecarga de la ventana contextual y almacenamiento totalmente transparente. Para los ingenieros que quieren una capa de memoria ligera sin complejidad adicional, es la mejor opción. Cuál es mejor depende de lo que necesites.</p>
<p>¿Quiere profundizar u obtener ayuda para construir con memsearch o Milvus?</p>
<ul>
<li><p>Únase a la <a href="https://milvus.io/slack">comunidad Milvus Slack</a> t para conectarse con otros desarrolladores y compartir lo que está construyendo.</p></li>
<li><p>Reserve nuestro <a href="https://milvus.io/office-hours">Milvus Office Hourspara</a>preguntas y respuestas en vivo y soporte directo del equipo.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>Documentación de memsearch ccplugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>Proyecto memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código abierto (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de inteligencia artificial de código abierto -</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial de OpenClaw: Conectarse a Slack para el Asistente Local de IA</a></p></li>
</ul>
