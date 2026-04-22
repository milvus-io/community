---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Cómo añadir memoria a largo plazo a los agentes gestionados de Anthropic con
  Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Los Agentes Administrados de Anthropic hicieron a los agentes confiables, pero
  cada sesión comienza en blanco. He aquí cómo emparejar Milvus para la
  recuperación semántica dentro de una sesión y la memoria compartida entre
  agentes.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Los <a href="https://www.anthropic.com/engineering/managed-agents">agentes gestionados</a> de Anthropic hacen que la infraestructura de agentes sea resistente. Una tarea de 200 pasos sobrevive ahora a un fallo del arnés, a un tiempo de espera del sandbox o a un cambio de infraestructura a mitad de vuelo sin intervención humana, y Anthropic informa de que el tiempo p50 hasta el primer token se redujo aproximadamente un 60% y el p95 más de un 90% tras la desvinculación.</p>
<p>Lo que la fiabilidad no resuelve es la memoria. Una migración de código de 200 pasos que se encuentra con un nuevo conflicto de dependencia en el paso 201 no puede mirar atrás de forma eficaz para ver cómo gestionó el último. Un agente que ejecuta análisis de vulnerabilidades para un cliente no tiene ni idea de que otro agente ya ha resuelto el mismo caso hace una hora. Cada sesión comienza en una página en blanco, y los cerebros paralelos no tienen acceso a lo que los otros ya han resuelto.</p>
<p>La solución consiste en combinar la <a href="https://milvus.io/">base de datos vectorial de Milvus</a> con los agentes gestionados de Anthropic: memoria semántica dentro de una sesión y una <a href="https://milvus.io/docs/milvus_for_agents.md">capa de memoria vectorial</a> compartida entre sesiones. El contrato de sesión se mantiene intacto, el arnés recibe una nueva capa y las tareas de los agentes de largo plazo obtienen capacidades cualitativamente diferentes.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Qué solucionaron los agentes gestionados (y qué no)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Los agentes gestionados solucionaron la fiabilidad desacoplando el agente en tres módulos independientes. Lo que no resolvieron es la memoria, ya sea como recuerdo semántico dentro de una única sesión o como experiencia compartida a través de sesiones paralelas.</strong> Esto es lo que se desacopló y dónde se encuentra la brecha de memoria dentro de ese diseño desacoplado.</p>
<table>
<thead>
<tr><th>Módulo</th><th>Qué hace</th></tr>
</thead>
<tbody>
<tr><td><strong>Sesión</strong></td><td>Un registro de eventos de todo lo ocurrido. Almacenado fuera del arnés.</td></tr>
<tr><td><strong>Arnés</strong></td><td>El bucle que llama a Claude y dirige las llamadas a las herramientas de Claude a la infraestructura pertinente.</td></tr>
<tr><td><strong>Sandbox</strong></td><td>El entorno de ejecución aislado donde Claude ejecuta código y edita archivos.</td></tr>
</tbody>
</table>
<p>El reencuadre que hace que este diseño funcione se indica explícitamente en el post de Anthropic:</p>
<p><em>"La sesión no es la ventana de contexto de Claude".</em></p>
<p>La ventana de contexto es efímera: delimitada en tokens, reconstruida por cada llamada al modelo y descartada cuando la llamada regresa. La sesión es duradera, se almacena fuera del arnés y representa el sistema de registro de toda la tarea.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cuando un arnés se bloquea, la plataforma inicia uno nuevo con <code translate="no">wake(sessionId)</code>. El nuevo arnés lee el registro de eventos a través de <code translate="no">getSession(id)</code>, y la tarea retoma desde el último paso registrado, sin necesidad de escribir una lógica de recuperación personalizada y sin tener que hacer de niñera a nivel de sesión.</p>
<p>Lo que el post de Agentes Gestionados no aborda, y no pretende hacerlo, es qué hace el agente cuando necesita recordar algo. Dos lagunas aparecen en el momento en que empujas cargas de trabajo reales a través de la arquitectura. Una vive dentro de una única sesión; la otra vive entre sesiones.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problema 1: Por qué los registros de sesión lineales fallan más allá de unos cientos de pasos<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Los registros de sesión lineales fallan después de unos cientos de pasos porque las lecturas secuenciales y la búsqueda semántica son cargas de trabajo fundamentalmente diferentes, y la</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>sólo sirve a la primera.</strong> Cortar por posición o buscar una marca de tiempo es suficiente para responder a la pregunta "dónde terminó esta sesión". No es suficiente para responder a la pregunta que un agente necesitará previsiblemente en cualquier tarea larga: ¿hemos visto este tipo de problema antes, y qué hicimos al respecto?</p>
<p>Consideremos una migración de código en el paso 200 que se topa con un nuevo conflicto de dependencias. El movimiento natural es mirar atrás. ¿Se encontró el agente con algo similar anteriormente en esta misma tarea? ¿Qué enfoque se probó? ¿Se mantuvo, o se retrocedió algo más aguas abajo?</p>
<p>Con <code translate="no">getEvents()</code> hay dos maneras de responder a eso, y ambas son malas:</p>
<table>
<thead>
<tr><th>Opción</th><th>Problema</th></tr>
</thead>
<tbody>
<tr><td>Escanear cada evento secuencialmente</td><td>Lento a 200 pasos. Insostenible a 2.000.</td></tr>
<tr><td>Volcar una gran parte del flujo en la ventana de contexto.</td><td>Caro en tokens, poco fiable a escala, y agota la memoria de trabajo real del agente para el paso actual.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La sesión es buena para recuperación y auditoría, pero no se construyó con un índice que soporte "he visto esto antes". En las tareas de largo alcance es donde esa pregunta deja de ser opcional.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Solución 1: Cómo añadir memoria semántica a la sesión de un agente gestionado<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Añada una colección Milvus junto al registro de sesión y escriba dos veces desde</strong> <code translate="no">**emitEvent**</code>. El contrato de sesión permanece intacto y el arnés obtiene una consulta semántica sobre su propio pasado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El diseño de Anthropic deja margen exactamente para esto. Su post afirma que "cualquier evento recuperado también puede ser transformado en el arnés antes de ser pasado a la ventana de contexto de Claude. Estas transformaciones pueden ser cualquier cosa que codifique el arnés, incluyendo la organización del contexto... y la ingeniería del contexto". La ingeniería del contexto vive en el arnés; la sesión sólo tiene que garantizar la durabilidad y la consulta.</p>
<p>El patrón: cada vez que se dispara <code translate="no">emitEvent</code>, el arnés también calcula una <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">incrustación vectorial</a> de los eventos que merece la pena indexar y los inserta en una colección Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Cuando el agente llega al paso 200 y necesita recordar decisiones anteriores, la consulta es una <a href="https://zilliz.com/glossary/vector-similarity-search">búsqueda vectorial</a> circunscrita a esa sesión:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tres detalles de producción importan antes de que esto se envíe:</p>
<ul>
<li><strong>Elegir qué indexar.</strong> No todos los eventos merecen una incrustación. Los estados intermedios de la llamada a la herramienta, los registros de reintentos y los eventos de estado repetitivos contaminan la calidad de la recuperación más rápido de lo que la mejoran. La política de <code translate="no">INDEXABLE_EVENT_TYPES</code> depende de la tarea, no es global.</li>
<li><strong>Define el límite de consistencia.</strong> Si el arnés se bloquea entre la adición de la sesión y la inserción de Milvus, una capa se adelanta brevemente a la otra. La ventana es pequeña pero real. Elija una ruta de reconciliación (reintento al reiniciar, registro de escritura anticipada o reconciliación eventual) en lugar de esperar.</li>
<li><strong>Controle el gasto de incrustación.</strong> Una sesión de 200 pasos que llama a una API de incrustación externa de forma sincrónica en cada paso produce una factura que nadie había previsto. Ponga en cola las incrustaciones y envíelas de forma asíncrona por lotes.</li>
</ul>
<p>Una vez hecho esto, la recuperación tarda milisegundos en la búsqueda vectorial y menos de 100 ms en la llamada a la incrustación. Los cinco eventos pasados más relevantes aparecen en contexto antes de que el agente note la fricción. La sesión mantiene su función original de registro duradero; el arnés adquiere la capacidad de consultar su propio pasado semánticamente en lugar de secuencialmente. Es un cambio modesto en la superficie de la API y un cambio estructural en lo que el agente puede hacer en tareas de largo horizonte.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problema 2: Por qué los agentes Claude paralelos no pueden compartir experiencia<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Los agentes Claude paralelos no pueden compartir experiencia porque las sesiones de los agentes gestionados están aisladas por diseño. El mismo aislamiento que hace que el escalado horizontal sea limpio también impide que todos los cerebros aprendan de todos los demás.</strong></p>
<p>En un arnés desacoplado, los cerebros no tienen estado y son independientes. Ese aislamiento hace que la latencia gane los informes de Anthropic, y también mantiene cada sesión en funcionamiento sin saber nada de las demás sesiones.</p>
<p>El agente A dedica 40 minutos a diagnosticar un complicado vector de inyección SQL para un cliente. Una hora más tarde, el Agente B recoge el mismo caso para un cliente diferente y pasa sus propios 40 minutos recorriendo los mismos callejones sin salida, ejecutando las mismas llamadas a herramientas y llegando a la misma respuesta.</p>
<p>Para un único usuario que ejecuta un agente ocasional, eso es computación desperdiciada. Para una plataforma que ejecuta docenas de <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a> concurrentes a través de la revisión de código, análisis de vulnerabilidades y generación de documentación para diferentes clientes cada día, el coste se agrava estructuralmente.</p>
<p>Si la experiencia que produce cada sesión se evapora en el momento en que termina, la inteligencia es desechable. Una plataforma construida de este modo se escala linealmente, pero no mejora en nada con el tiempo, como hacen los ingenieros humanos.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Solución 2: Cómo construir una reserva de memoria de agente compartida con Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Construya una colección de vectores de la que cada arnés lea al inicio y escriba al cierre, particionada por arrendatario para que la experiencia se comparta entre sesiones sin fugas entre clientes.</strong></p>
<p>Cuando finaliza una sesión, las decisiones clave, los problemas encontrados y los enfoques que funcionaron se introducen en la colección compartida de Milvus. Cuando se inicializa un nuevo cerebro, el arnés ejecuta una consulta semántica como parte de la configuración e inyecta en la ventana de contexto las experiencias pasadas más coincidentes. El primer paso del nuevo agente hereda las lecciones de todos los agentes anteriores.</p>
<p>Dos decisiones de ingeniería llevan esto del prototipo a la producción.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Aislar a los inquilinos con la clave de partición de Milvus</h3><p><strong>Partición por</strong> <code translate="no">**tenant_id**</code>,<strong> y las experiencias del agente del cliente A no viven físicamente en la misma partición que las del cliente B. Eso es aislamiento en la capa de datos más que una convención de consulta.</strong></p>
<p>El trabajo del Cerebro A en la base de código de la Empresa A nunca debería ser recuperable por los agentes de la Empresa B. La <a href="https://milvus.io/docs/use-partition-key.md">clave de partición</a> de Milvus maneja esto en una sola colección, sin una segunda colección por arrendatario y sin lógica de fragmentación en el código de la aplicación.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Las experiencias de los agentes del cliente A nunca salen a la superficie en las consultas del cliente B, no porque el filtro de consulta esté escrito correctamente (aunque tiene que estarlo), sino porque los datos físicamente no viven en la misma partición que los del cliente B. Una colección para operar, aislamiento lógico aplicado en la capa de consulta, aislamiento físico aplicado en la capa de partición.</p>
<p>Consulte <a href="https://milvus.io/docs/multi_tenancy.md">los documentos de estrategias</a> <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">multi-tenancy</a> para saber cuándo encaja la clave de partición frente a cuándo lo hacen las colecciones o bases de datos separadas, y la <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">guía de patrones RAG multi-tenancy</a> para obtener notas sobre el despliegue de producción.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Por qué la calidad de la memoria del agente necesita un trabajo continuo</h3><p><strong>La calidad de la memoria se erosiona con el tiempo: las soluciones erróneas que tuvieron éxito una vez se reproducen y refuerzan, y las entradas obsoletas vinculadas a dependencias obsoletas siguen engañando a los agentes que las heredan. Las defensas son programas operativos, no características de la base de datos.</strong></p>
<p>Un agente tropieza con una solución defectuosa que tiene éxito una vez. Se escribe en el pool compartido. El siguiente agente lo recupera, lo repite y refuerza el mal patrón con un segundo registro de uso "exitoso".</p>
<p>Las entradas obsoletas siguen una versión más lenta del mismo camino. Una corrección anclada a una versión de dependencia que fue obsoleta hace seis meses sigue siendo recuperada, y sigue engañando a los agentes que la heredan. Cuanto más antigua y utilizada es la reserva, más se acumula.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tres programas operativos defienden contra esto:</p>
<ul>
<li><strong>Puntuación de confianza.</strong> Realiza un seguimiento de la frecuencia con la que una memoria se ha aplicado con éxito en sesiones posteriores. Decaen las entradas que fallan en la repetición. Promover las entradas que tienen éxito repetidamente.</li>
<li><strong>Ponderación temporal.</strong> Preferir experiencias recientes. Retirar las entradas que superen un umbral de caducidad conocido, a menudo vinculado a cambios importantes en la versión de dependencia.</li>
<li><strong>Controles humanos aleatorios.</strong> Las entradas con alta frecuencia de recuperación tienen un alto nivel de apalancamiento. Cuando una de ellas es incorrecta, lo es muchas veces, que es donde la revisión humana se amortiza más rápido.</li>
</ul>
<p>Milvus por sí solo no resuelve esto, y tampoco lo hace Mem0, Zep o cualquier otro producto de memoria. Imponer un pool con muchos inquilinos y cero fugas entre inquilinos es algo que se diseña una vez. Mantener ese pool preciso, fresco y útil es un trabajo operativo continuo que ninguna base de datos entrega preconfigurada.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Para llevar: Lo que Milvus añade a los agentes gestionados de Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus hace que los agentes gestionados dejen de ser una plataforma fiable pero olvidadiza y se conviertan en una plataforma que mejora la experiencia a lo largo del tiempo al añadir memoria semántica dentro de una sesión y memoria compartida entre agentes.</strong></p>
<p>Los Agentes Gestionados responden limpiamente a la cuestión de la fiabilidad: tanto los cerebros como las manos son ganado, y cualquiera de ellos puede morir sin llevarse consigo la tarea. Ese es el problema de la infraestructura, y Anthropic lo resolvió bien.</p>
<p>Lo que quedó pendiente fue el crecimiento. Los ingenieros humanos se componen con el tiempo; años de trabajo se convierten en reconocimiento de patrones, y no razonan a partir de primeros principios en cada tarea. Los agentes gestionados de hoy en día no lo hacen, porque cada sesión comienza en una página en blanco.</p>
<p>Conectar la sesión a Milvus para la recuperación semántica dentro de una tarea y agrupar la experiencia de todos los cerebros en una colección de vectores compartida es lo que proporciona a los agentes un pasado que realmente pueden utilizar. Conectar Milvus es la parte de la infraestructura; podar los recuerdos erróneos, retirar los obsoletos y reforzar los límites de los inquilinos es la parte operativa. Una vez establecidas ambas, la forma de la memoria deja de ser un lastre y empieza a ser un capital compuesto.</p>
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
    </button></h2><ul>
<li><strong>Pruébelo localmente:</strong> cree una instancia Milvus integrada con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Sin Docker, sin clúster, sólo <code translate="no">pip install pymilvus</code>. Las cargas de trabajo de producción se gradúan a <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone o Distributed</a> cuando las necesite.</li>
<li><strong>Lea la justificación del diseño:</strong> El <a href="https://www.anthropic.com/engineering/managed-agents">post de ingeniería de Agentes Gestionados</a> de Anthropic recorre en profundidad el desacoplamiento de sesión, arnés y sandbox.</li>
<li><strong>¿Tiene preguntas?</strong> Únase a la comunidad <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> para debatir sobre el diseño de la memoria del agente o reserve una sesión <a href="https://milvus.io/office-hours">de Milvus Office Hours</a> para que le expliquen su carga de trabajo.</li>
<li><strong>¿Prefieres la gestión?</strong> <a href="https://cloud.zilliz.com/signup">Regístrese en Zilliz Cloud</a> (o <a href="https://cloud.zilliz.com/login">inicie sesión</a>) para alojarse en Milvus con claves de partición, escalado y multi-tenancy integrados. Las cuentas nuevas obtienen créditos gratuitos en un correo electrónico de trabajo.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas más frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>P: ¿Cuál es la diferencia entre una sesión y una ventana de contexto en los Agentes Gestionados de Anthropic?</strong></p>
<p>La ventana de contexto es el conjunto efímero de tokens que ve una sola llamada de Claude. Está limitada y se restablece cada vez que se invoca el modelo. La sesión es el registro de eventos duradero, de sólo apéndice, de todo lo que ha ocurrido a lo largo de toda la tarea, almacenado fuera del arnés. Cuando un arnés se bloquea, <code translate="no">wake(sessionId)</code> genera un nuevo arnés que lee el registro de la sesión y se reanuda. La sesión es el sistema de registro; la ventana de contexto es la memoria de trabajo. La sesión no es la ventana de contexto.</p>
<p><strong>P: ¿Cómo persisto la memoria del agente a través de las sesiones de Claude?</strong></p>
<p>La sesión en sí ya es persistente; eso es lo que recupera <code translate="no">getSession(id)</code>. Lo que suele faltar es una memoria a largo plazo que se pueda consultar. El patrón consiste en incrustar los eventos de alta señal (decisiones, resoluciones, estrategias) en una base de datos vectorial como Milvus durante <code translate="no">emitEvent</code>, y luego consultarlos por similitud semántica en el momento de la recuperación. De este modo se obtiene tanto el registro de sesión duradero que proporciona Anthropic como una capa de recuperación semántica para mirar hacia atrás a través de cientos de pasos.</p>
<p><strong>P: ¿Pueden compartir memoria varios agentes Claude?</strong></p>
<p>De entrada, no. Cada sesión de agentes gestionados está aislada por diseño, lo que les permite escalar horizontalmente. Para compartir memoria entre agentes, añada una colección de vectores compartida (por ejemplo en Milvus) de la que cada arnés lee al iniciarse y escribe al apagarse. Utilice la función de clave de partición de Milvus para aislar a los inquilinos, de modo que las memorias del agente del cliente A nunca se filtren a las sesiones del cliente B.</p>
<p><strong>P: ¿Cuál es la mejor base de datos vectorial para la memoria de agentes de IA?</strong></p>
<p>La respuesta honesta depende de la escala y la forma de despliegue. Para prototipos y cargas de trabajo pequeñas, una opción local integrada como Milvus Lite se ejecuta en proceso sin infraestructura. Para agentes de producción a través de muchos inquilinos, usted quiere una base de datos con multi-tenancy madura (claves de partición, búsqueda filtrada), búsqueda híbrida (vector + escalar + palabra clave), y latencia de milisegundos a millones de vectores. Milvus está diseñado específicamente para cargas de trabajo vectoriales a esa escala, razón por la cual aparece en los sistemas de memoria de agentes de producción creados en LangChain, Google ADK, Deep Agents y OpenAgents.</p>
