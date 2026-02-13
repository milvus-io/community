---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: >-
  Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código
  abierto (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Hemos extraído la arquitectura de memoria de IA de OpenClaw en memsearch, una
  biblioteca independiente de Python con registros Markdown, búsqueda vectorial
  híbrida y compatibilidad con Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (antes clawdbot y moltbot) se está volviendo viral: <a href="https://github.com/openclaw/openclaw">más de 189.000 estrellas de GitHub</a> en menos de dos semanas. Es una locura. La mayor parte de la expectación gira en torno a sus capacidades autónomas y ágiles en los canales de chat cotidianos, como iMessages, WhatsApp, Slack, Telegram y otros.</p>
<p>Pero como ingenieros que trabajamos en un sistema de base de datos vectorial, lo que realmente nos llamó la atención fue <strong>el enfoque de OpenClaw sobre la memoria a largo plazo</strong>. A diferencia de la mayoría de los sistemas de memoria que existen, OpenClaw hace que su IA escriba automáticamente registros diarios como archivos Markdown. Esos archivos son la fuente de la verdad, y el modelo sólo "recuerda" lo que se escribe en el disco. Los desarrolladores humanos pueden abrir esos archivos Markdown, editarlos directamente, destilar principios a largo plazo y ver exactamente lo que la IA recuerda en cualquier momento. Sin cajas negras. Sinceramente, es una de las arquitecturas de memoria más limpias y fáciles de desarrollar que hemos visto.</p>
<p>Así que, naturalmente, nos hicimos una pregunta: <strong><em>¿por qué debería funcionar esto sólo dentro de OpenClaw? ¿Y si cualquier agente pudiera tener una memoria como ésta?</em></strong> Tomamos la arquitectura de memoria exacta de OpenClaw y creamos <a href="https://github.com/zilliztech/memsearch">memsearch</a>, una biblioteca de memoria a largo plazo independiente, plug-and-play, que proporciona a cualquier agente una memoria persistente, transparente y editable por humanos. No depende del resto de OpenClaw. Sólo tiene que colocarla y su agente obtendrá una memoria duradera con búsqueda impulsada por Milvus/Zilliz Cloud, además de registros Markdown como fuente canónica de la verdad.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (código abierto, licencia MIT)</p></li>
<li><p><strong>Documentación:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Plugin de código Claude:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Qué hace diferente a la memoria de OpenClaw<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en la arquitectura de memoria de OpenClaw, aclaremos dos conceptos: <strong>contexto</strong> y <strong>memoria</strong>. Suenan similares pero funcionan de forma muy diferente en la práctica.</p>
<ul>
<li><p><strong>Contexto</strong> es todo lo que el agente ve en una única petición - avisos del sistema, archivos de guía a nivel de proyecto como <code translate="no">AGENTS.md</code> y <code translate="no">SOUL.md</code>, historial de conversaciones (mensajes, llamadas a herramientas, resúmenes comprimidos), y el mensaje actual del usuario. Está limitado a una sesión y es relativamente compacto.</p></li>
<li><p><strong>La memoria</strong> es lo que persiste a lo largo de las sesiones. Vive en el disco local: el historial completo de conversaciones anteriores, los archivos con los que ha trabajado el agente y las preferencias del usuario. No está resumida. Sin comprimir. El material en bruto.</p></li>
</ul>
<p>Esta es la decisión de diseño que hace especial el enfoque de OpenClaw: <strong>toda la memoria se almacena como archivos Markdown en el sistema de archivos local.</strong> Después de cada sesión, la IA escribe automáticamente actualizaciones en esos registros Markdown. Usted -y cualquier desarrollador- puede abrirlos, editarlos, reorganizarlos, borrarlos o perfeccionarlos. Mientras tanto, la base de datos vectorial se asienta junto a este sistema, creando y manteniendo un índice para su recuperación. Cada vez que cambia un archivo Markdown, el sistema detecta el cambio y lo vuelve a indexar automáticamente.</p>
<p>Si has utilizado herramientas como Mem0 o Zep, notarás la diferencia de inmediato. Esos sistemas almacenan las memorias como incrustaciones: ésa es la única copia. No puedes leer lo que tu agente recuerda. No puedes arreglar un mal recuerdo editando una fila. El enfoque de OpenClaw te ofrece ambas cosas: la transparencia de los archivos planos <strong>y</strong> la capacidad de recuperación de la búsqueda vectorial mediante una base de datos vectorial. Puedes leerlo, <code translate="no">git diff</code>, grep it - son sólo archivos.</p>
<p>¿El único inconveniente? Ahora mismo este sistema de memoria Markdown-first está estrechamente entrelazado con todo el ecosistema OpenClaw: el proceso Gateway, los conectores de plataforma, la configuración del espacio de trabajo y la infraestructura de mensajería. Si sólo quieres el modelo de memoria, es un montón de maquinaria que arrastrar.</p>
<p>Precisamente por eso hemos creado <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: la misma filosofía -Markdown como fuente de verdad, indexación automática de vectores, totalmente editable por humanos- pero en forma de biblioteca ligera e independiente que puede integrarse en cualquier arquitectura agéntica.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Cómo funciona memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se mencionó anteriormente, <a href="https://github.com/zilliztech/memsearch">memsearch</a> es una biblioteca de memoria a largo plazo totalmente independiente que implementa la misma arquitectura de memoria utilizada en OpenClaw, sin llevar consigo el resto de la pila de OpenClaw. Puede conectarla a cualquier estructura de agentes (Claude, GPT, Llama, agentes personalizados, motores de flujo de trabajo) y dotar instantáneamente a su sistema de una memoria persistente, transparente y editable por el ser humano.</p>
<p>Toda la memoria del agente en memsearch se almacena como texto plano Markdown en un directorio local. La estructura es intencionadamente simple para que los desarrolladores puedan entenderla de un vistazo:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch utiliza <a href="https://milvus.io/"><strong>Milvus</strong></a> como base de datos vectorial para indexar estos archivos Markdown para una rápida recuperación semántica. Pero lo más importante es que el índice vectorial <em>no</em> es la fuente de la verdad, sino los archivos. Si se elimina por completo el índice Milvus, <strong>no se pierde nada.</strong> Memsearch simplemente vuelve a incrustar y a indexar los archivos Markdown, reconstruyendo toda la capa de recuperación en unos minutos. Esto significa que la memoria de su agente es transparente, duradera y totalmente reconstruible.</p>
<p>Estas son las principales capacidades de memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Markdown legible hace que la depuración sea tan sencilla como editar un archivo</h3><p>La depuración de la memoria de la IA suele ser dolorosa. Cuando un agente produce una respuesta errónea, la mayoría de los sistemas de memoria no ofrecen una forma clara de ver <em>lo que</em> realmente almacenó. El flujo de trabajo típico consiste en escribir código personalizado para consultar una API de memoria y, a continuación, escudriñar incrustaciones opacas o ampulosos blobs JSON, ninguno de los cuales dice mucho sobre el estado interno real de la IA.</p>
<p><strong>memsearch elimina toda esa clase de problemas.</strong> Toda la memoria vive en la carpeta memory/ como Markdown plano:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Si la IA hace algo mal, arreglarlo es tan sencillo como editar el archivo. Actualiza la entrada, guarda, y memsearch automáticamente vuelve a indexar el cambio. Cinco segundos. Sin llamadas a la API. Sin herramientas. Ningún misterio. Puede depurar la memoria de IA del mismo modo que depura la documentación: editando un archivo.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">La memoria respaldada por Git permite a los equipos rastrear, revisar y revertir cambios</h3><p>La memoria de IA que vive en una base de datos es difícil de colaborar. Averiguar quién cambió qué y cuándo significa excavar en los registros de auditoría, y muchas soluciones ni siquiera los proporcionan. Los cambios se producen en silencio, y los desacuerdos sobre lo que la IA debe recordar no tienen una vía de resolución clara. Los equipos acaban confiando en los mensajes de Slack y en suposiciones.</p>
<p>Memsearch soluciona este problema convirtiendo la memoria en archivos Markdown, lo que significa que <strong>Git gestiona el versionado automáticamente</strong>. Un solo comando muestra todo el historial:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Ahora la memoria de IA participa en el mismo flujo de trabajo que el código. Las decisiones de arquitectura, las actualizaciones de configuración y los cambios de preferencias aparecen en diffs que cualquiera puede comentar, aprobar o revertir:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">La memoria Plaintext hace que la migración sea casi sin esfuerzo</h3><p>La migración es uno de los mayores costes ocultos de los frameworks de memoria. Pasar de una herramienta a otra suele implicar exportar datos, convertir formatos, volver a importar y esperar que los campos sean compatibles. Ese tipo de trabajo puede consumir fácilmente medio día, y el resultado nunca está garantizado.</p>
<p>memsearch evita el problema por completo porque la memoria es Markdown en texto plano. No hay formato propietario, ni esquema que traducir, ni nada que migrar:</p>
<ul>
<li><p><strong>Cambia de máquina:</strong> <code translate="no">rsync</code> la carpeta de memoria. Hecho.</p></li>
<li><p><strong>Cambia de modelo de incrustación:</strong> Vuelva a ejecutar el comando de índice. Tardará cinco minutos, y los archivos markdown permanecen intactos.</p></li>
<li><p><strong>Cambiar el despliegue de la base de datos vectorial:</strong> Cambie un valor de configuración. Por ejemplo, pasar de Milvus Lite en desarrollo a Zilliz Cloud en producción:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sus archivos de memoria permanecen exactamente igual. La infraestructura que los rodea puede evolucionar libremente. El resultado es la portabilidad a largo plazo, una propiedad poco común en los sistemas de IA.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Los archivos Markdown compartidos permiten a humanos y agentes ser coautores de la memoria</h3><p>En la mayoría de las soluciones de memoria, editar lo que la IA recuerda requiere escribir código en una API. Esto significa que sólo los desarrolladores pueden mantener la memoria de la IA, e incluso para ellos resulta engorroso.</p>
<p>Memsearch permite una división de responsabilidades más natural:</p>
<ul>
<li><p><strong>La IA se encarga:</strong> Registros diarios automáticos (<code translate="no">YYYY-MM-DD.md</code>) con detalles de ejecución como "desplegada v2.3.1, mejora del rendimiento del 12%".</p></li>
<li><p><strong>Los humanos se encargan:</strong> Principios a largo plazo en <code translate="no">MEMORY.md</code>, como "Team stack: Python + FastAPI + PostgreSQL".</p></li>
</ul>
<p>Ambas partes editan los mismos archivos Markdown con las herramientas que ya utilizan. Sin llamadas a API, sin herramientas especiales, sin guardián. Cuando la memoria está bloqueada dentro de una base de datos, este tipo de autoría compartida no es posible. memsearch lo hace por defecto.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Bajo el capó: memsearch funciona con cuatro flujos de trabajo que mantienen la memoria rápida, fresca y ágil<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch tiene cuatro flujos de trabajo principales: <strong>Observar</strong> (monitorizar) → <strong>Indexar</strong> (trocear e incrustar) → <strong>Buscar</strong> (recuperar) → <strong>Compactar</strong> (resumir). Esto es lo que hace cada uno de ellos</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Observar: Vuelve a indexar automáticamente cada vez que se guarda un archivo</h3><p>El flujo de trabajo <strong>Watch</strong> monitoriza todos los archivos Markdown en la memoria/directorio y activa un re-indexado cada vez que un archivo es modificado y guardado. Un <strong>retardo de 1500 ms</strong> garantiza que las actualizaciones se detecten sin malgastar recursos: si se guardan varios archivos en rápida sucesión, el temporizador se reinicia y se activa sólo cuando las ediciones se han estabilizado.</p>
<p>Este retraso se ajusta empíricamente:</p>
<ul>
<li><p><strong>100ms</strong> → demasiado sensible; se dispara en cada pulsación de tecla, quemando llamadas de incrustación.</p></li>
<li><p><strong>10s</strong> → demasiado lento; los desarrolladores notan retraso</p></li>
<li><p><strong>1500ms</strong> → equilibrio ideal entre capacidad de respuesta y eficiencia de recursos.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En la práctica, esto significa que un desarrollador puede escribir código en una ventana y editar <code translate="no">MEMORY.md</code> en otra, añadiendo una URL de API docs o corrigiendo una entrada obsoleta. Guarda el archivo y la siguiente consulta de IA recoge la nueva memoria. Sin reinicios ni reindexación manual.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Índice: Agrupación, deduplicación e incrustación inteligente en función de la versión</h3><p>Index es el flujo de trabajo crítico para el rendimiento. Se encarga de tres cosas: la <strong>fragmentación, la deduplicación y los identificadores de fragmentos versionados.</strong></p>
<p><strong>La fragmentación</strong> divide el texto a lo largo de los límites semánticos -encabezamientos y cuerpos- para que el contenido relacionado permanezca unido. Esto evita casos en los que una frase como "configuración de Redis" se divide en varios chunks.</p>
<p>Por ejemplo, este Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Se convierte en dos trozos:</p>
<ul>
<li><p>Fragmento 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Fragmento 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>La deduplicación</strong> utiliza un hash SHA-256 de cada chunk para evitar incrustar el mismo texto dos veces. Si varios archivos mencionan "PostgreSQL 16", la API de incrustación se llama una vez, no una vez por archivo. Para ~500KB de texto, esto ahorra alrededor de <strong>$0.15/mes.</strong> A escala, eso suma cientos de dólares.</p>
<p><strong>El diseño del Chunk ID</strong> codifica todo lo necesario para saber si un chunk es antiguo. El formato es <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. El campo <code translate="no">model_version</code> es la parte importante: cuando un modelo de incrustación se actualiza de <code translate="no">text-embedding-3-small</code> a <code translate="no">text-embedding-3-large</code>, las antiguas incrustaciones dejan de ser válidas. Dado que la versión del modelo está integrada en el ID, el sistema identifica automáticamente los fragmentos que deben volver a incrustarse. No es necesaria ninguna limpieza manual.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. 3. Búsqueda: Recuperación híbrida de vectores + BM25 para obtener la máxima precisión</h3><p>La recuperación utiliza un enfoque de búsqueda híbrido: búsqueda vectorial ponderada al 70% y búsqueda de palabras clave BM25 ponderada al 30%. De este modo se equilibran dos necesidades diferentes que surgen con frecuencia en la práctica.</p>
<ul>
<li><p>La<strong>búsqueda v</strong> ectorial se encarga de la correspondencia semántica. Una consulta sobre "Redis cache config" devuelve un chunk que contiene "Redis L1 cache with 5min TTL" aunque la redacción sea diferente. Esto es útil cuando el desarrollador recuerda el concepto pero no la formulación exacta.</p></li>
<li><p><strong>BM25</strong> gestiona la correspondencia exacta. Una consulta para "PostgreSQL 16" no devuelve resultados sobre "PostgreSQL 15". Esto es importante para los códigos de error, los nombres de las funciones y el comportamiento específico de la versión, donde lo cercano no es suficiente.</p></li>
</ul>
<p>La división por defecto 70/30 funciona bien para la mayoría de los casos de uso. Para los flujos de trabajo que se inclinan en gran medida hacia las coincidencias exactas, aumentar el peso de BM25 al 50% es un cambio de configuración de una sola línea.</p>
<p>Los resultados se devuelven en trozos top-K (por defecto 3), cada uno truncado a 200 caracteres. Cuando se necesita el contenido completo, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> lo carga. Esta revelación progresiva mantiene el uso reducido de la ventana contextual LLM sin sacrificar el acceso a los detalles.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Compacta: Resumir la memoria histórica para mantener limpio el contexto</h3><p>La memoria acumulada acaba convirtiéndose en un problema. Las entradas antiguas llenan la ventana de contexto, aumentan el coste de los tokens y añaden ruido que degrada la calidad de la respuesta. Compact soluciona este problema llamando a un LLM para que resuma la memoria histórica en un formato condensado y, a continuación, borrando o archivando los originales. Puede activarse manualmente o programarse para que se ejecute a intervalos regulares.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Cómo empezar a utilizar memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch proporciona tanto una <strong>API Python</strong> como una <strong>CLI</strong>, por lo que puedes utilizarlo dentro de frameworks de agentes o como una herramienta de depuración independiente. La configuración es mínima, y el sistema está diseñado para que su entorno de desarrollo local y el despliegue de producción parezcan casi idénticos.</p>
<p>Memsearch soporta tres backends compatibles con Milvus, todos expuestos a través de la <strong>misma API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (por defecto)</strong></a><strong>:</strong> Archivo local <code translate="no">.db</code>, configuración cero, adecuado para uso individual.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Autoalojado, soporta múltiples agentes que comparten datos, adecuado para entornos de equipo.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Totalmente gestionado, con autoescalado, copias de seguridad, alta disponibilidad y aislamiento. Ideal para cargas de trabajo de producción.</p></li>
</ul>
<p>El cambio de desarrollo local a producción suele <strong>ser un cambio de configuración de una sola línea</strong>. Su código sigue siendo el mismo.</p>
<h3 id="Install" class="common-anchor-header">Instalar</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch también soporta múltiples proveedores de incrustación, incluyendo OpenAI, Google, Voyage, Ollama y modelos locales. Esto asegura que su arquitectura de memoria se mantiene portátil y agnóstica.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Opción 1: API Python (integrada en el marco de trabajo del agente)</h3><p>Aquí tienes un ejemplo mínimo de un bucle de agente completo utilizando memsearch. Puedes copiar/pegar y modificar según necesites:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Muestra el bucle central:</p>
<ul>
<li><p><strong>Recuerda</strong>: memsearch realiza una recuperación híbrida de vector + BM25</p></li>
<li><p><strong>Piensa</strong>: tu LLM procesa la entrada del usuario + la memoria recuperada</p></li>
<li><p><strong>Recuerda</strong>: el agente escribe nueva memoria en Markdown, y memsearch actualiza su índice</p></li>
</ul>
<p>Este patrón encaja de forma natural en cualquier sistema de agente: LangChain, AutoGPT, enrutadores semánticos, LangGraph o bucles de agente personalizados. Su diseño es independiente del marco de trabajo.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Opción 2: CLI (operaciones rápidas, bueno para depuración)</h3><p>La CLI es ideal para flujos de trabajo autónomos, comprobaciones rápidas o inspección de memoria durante el desarrollo:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>La CLI refleja las capacidades de la API de Python, pero funciona sin necesidad de escribir ningún código: ideal para depuración, inspecciones, migraciones o validación de la estructura de carpetas de memoria.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Comparación de memsearch con otras soluciones de memoria<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>La pregunta más común que se hacen los desarrolladores es por qué utilizar memsearch cuando ya existen opciones establecidas. La respuesta corta: memsearch cambia características avanzadas como los gráficos de conocimiento temporal por transparencia, portabilidad y simplicidad. Para la mayoría de los casos de uso de la memoria de agentes, es el compromiso correcto.</p>
<table>
<thead>
<tr><th>Solución</th><th>Puntos fuertes</th><th>Limitaciones</th><th>Lo mejor para</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Memoria de texto plano transparente, co-autoría humano-AI, cero fricciones de migración, depuración sencilla, Git-native</td><td>No incorpora grafos temporales ni complejas estructuras de memoria multiagente.</td><td>Equipos que valoran el control, la simplicidad y la portabilidad en la memoria a largo plazo</td></tr>
<tr><td>Mem0</td><td>Totalmente gestionado, sin infraestructura que ejecutar o mantener</td><td>Opaca: no se puede inspeccionar ni editar manualmente la memoria; las incrustaciones son la única representación.</td><td>Equipos que desean un servicio gestionado sin intervención y están de acuerdo con una menor visibilidad</td></tr>
<tr><td>Zep</td><td>Amplio conjunto de funciones: memoria temporal, modelado multipersona, grafos de conocimiento complejos.</td><td>Arquitectura pesada; más piezas móviles; más difícil de aprender y manejar</td><td>Agentes que realmente necesitan estructuras de memoria avanzadas o razonamiento temporal</td></tr>
<tr><td>LangMem / Letta</td><td>Integración profunda y sin fisuras en sus propios ecosistemas.</td><td>Bloqueo del marco; difícil de portar a otras pilas de agentes.</td><td>Equipos ya comprometidos con esos marcos específicos.</td></tr>
</tbody>
</table>
<h2 id="Try-memsearch-and-let-us-know-your-feedback" class="common-anchor-header">Pruebe memsearch y háganos llegar sus comentarios<button data-href="#Try-memsearch-and-let-us-know-your-feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch es completamente de código abierto bajo la licencia MIT, y el repositorio está listo para experimentos de producción hoy mismo.</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Documentación:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Si estás construyendo un agente que necesita recordar cosas entre sesiones y quieres un control total sobre lo que recuerda, merece la pena echar un vistazo a memsearch. La librería se instala con un simple <code translate="no">pip install</code>, funciona con cualquier framework de agente, y almacena todo como Markdown que puedes leer, editar y versionar con Git.</p>
<p>Estamos desarrollando memsearch activamente y nos encantaría recibir aportaciones de la comunidad.</p>
<ul>
<li><p>Abre una incidencia si algo se rompe.</p></li>
<li><p>Envía un PR si quieres extender la librería.</p></li>
<li><p>Haz una estrella en el repositorio si la filosofía de Markdown-como-fuente-de-la-verdad resuena contigo.</p></li>
</ul>
<p>El sistema de memoria de OpenClaw ya no está bloqueado dentro de OpenClaw. Ahora, cualquiera puede usarlo.</p>
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de IA de código abierto</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial de OpenClaw: Conéctate a Slack para un asistente de IA local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construir agentes de IA estilo Clawdbot con LangGraph y Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG vs Agentes de larga duración: ¿Está obsoleta la RAG?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Crear una habilidad antrópica personalizada para Milvus para hacer girar rápidamente RAG</a></p></li>
</ul>
