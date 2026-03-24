---
id: geo-content-pipeline-openclaw-milvus.md
title: >-
  Contenido GEO a escala: Cómo posicionarse en la búsqueda de IA sin envenenar
  su marca
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: >-
  Su tráfico orgánico está disminuyendo a medida que las respuestas de IA
  sustituyen a los clics. Aprende a generar contenido GEO a escala sin
  alucinaciones ni daños a la marca.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>Su tráfico de búsqueda orgánica está disminuyendo, y no es porque su SEO haya empeorado. <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">Según SparkToro</a>, aproximadamente el 70% de las consultas en Google terminan en cero clics: los usuarios obtienen sus respuestas de los resúmenes generados por la IA en lugar de hacer clic en tu página. Perplexity, ChatGPT Search, Google AI Overview: no son amenazas futuras. Ya se están comiendo tu tráfico.</p>
<p><strong>La Optimización Generativa de Motores (GEO)</strong> es la forma de contraatacar. Mientras que el SEO tradicional optimiza los algoritmos de clasificación (palabras clave, backlinks, velocidad de página), la GEO optimiza los modelos de IA que componen las respuestas a partir de múltiples fuentes. El objetivo: estructurar su contenido de forma que los motores de búsqueda de IA citen <em>su marca</em> en sus respuestas.</p>
<p>El problema es que GEO requiere contenido a una escala que la mayoría de los equipos de marketing no pueden producir manualmente. Los modelos de IA no se basan en una única fuente, sino que sintetizan docenas de ellas. Para aparecer de forma consistente, se necesita cobertura a través de cientos de consultas de cola larga, cada una dirigida a una pregunta específica que un usuario podría hacer a un asistente de IA.</p>
<p>El atajo obvio -que un LLM genere artículos por lotes- crea un problema peor. Pídale a GPT-4 que produzca 50 artículos y obtendrá 50 artículos llenos de estadísticas inventadas, frases recicladas y afirmaciones que su marca nunca hizo. Eso no es GEO. Eso es <strong>spam de contenido AI con el nombre de su marca en él</strong>.</p>
<p>La solución es basar cada llamada de generación en documentos fuente verificados: especificaciones de productos reales, mensajes de marca aprobados y datos reales en los que se basa el LLM en lugar de inventarlos. Este tutorial muestra un proceso de producción que hace exactamente eso, basado en tres componentes:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong>: un marco de agente de IA de código abierto que orquesta el flujo de trabajo y se conecta a plataformas de mensajería como Telegram, WhatsApp y Slack.</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong>: una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> que gestiona el almacenamiento de conocimientos, la deduplicación semántica y la recuperación RAG.</li>
<li><strong>LLMs (GPT-4o, Claude, Gemini)</strong> - los motores de generación y evaluación</li>
</ul>
<p>Al final, dispondrá de un sistema operativo que ingiere documentos de marca en una base de conocimientos respaldada por Milvus, amplía los temas semilla en consultas de cola larga, los deduplica semánticamente y genera artículos por lotes con puntuación de calidad incorporada.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="GEO strategy overview — four pillars: Semantic analysis, Content structuring, Brand authority, and Performance tracking" class="doc-image" id="geo-strategy-overview-—-four-pillars:-semantic-analysis,-content-structuring,-brand-authority,-and-performance-tracking" />
   <span>Visión general de la estrategia GEO: cuatro pilares: Análisis semántico, estructuración de contenidos, autoridad de marca y seguimiento de resultados</span> </span>.</p>
<blockquote>
<p><strong>Nota:</strong> Este es un sistema de trabajo construido para un flujo de trabajo de marketing real, pero el código es un punto de partida. Deberá adaptar las preguntas, los umbrales de puntuación y la estructura de la base de conocimientos a su propio caso de uso.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">Cómo resuelve la canalización el volumen × la calidad<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>Componente</th><th>Función</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Orquestación de agentes, integración de mensajería (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Almacenamiento de conocimientos, deduplicación semántica, recuperación RAG</td></tr>
<tr><td>LLM (GPT-4o, Claude, Gemini)</td><td>Expansión de consultas, generación de artículos, puntuación de la calidad</td></tr>
<tr><td>Modelo de incrustación</td><td>Texto a vectores para Milvus (OpenAI, 1536 dimensiones por defecto)</td></tr>
</tbody>
</table>
<p>El proceso se ejecuta en dos fases. <strong>La fase 0</strong> introduce el material fuente en la base de conocimientos. La <strong>fase 1</strong> genera artículos a partir de él.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="How the OpenClaw GEO Pipeline works — Phase 0 (Ingest: fetch, chunk, embed, store) and Phase 1 (Generate: expand queries, dedup via Milvus, RAG retrieval, generate articles, score, and store)" class="doc-image" id="how-the-openclaw-geo-pipeline-works-—-phase-0-(ingest:-fetch,-chunk,-embed,-store)-and-phase-1-(generate:-expand-queries,-dedup-via-milvus,-rag-retrieval,-generate-articles,-score,-and-store)" />
   </span> <span class="img-wrapper"> <span>Funcionamiento de OpenClaw GEO Pipeline - Fase 0 (Ingesta: fetch, chunk, embed, store) y Fase 1 (Generación: expansión de consultas, dedup vía Milvus, recuperación RAG, generación de artículos, puntuación y almacenamiento).</span> </span></p>
<p>Esto es lo que ocurre en la Fase 1:</p>
<ol>
<li>Un usuario envía un mensaje a través de Lark, Telegram o WhatsApp. OpenClaw lo recibe y lo dirige a la habilidad de generación de GEO.</li>
<li>La habilidad expande el tema del usuario en consultas de búsqueda de cola larga utilizando un LLM: las preguntas específicas que los usuarios reales hacen a los motores de búsqueda de IA.</li>
<li>Cada consulta se incrusta y se compara con Milvus para detectar duplicados semánticos. Las consultas demasiado parecidas a contenidos existentes (similitud coseno &gt; 0,85) se descartan.</li>
<li>Las consultas que sobreviven activan la recuperación RAG a partir de <strong>dos colecciones Milvus a la vez</strong>: la base de conocimientos (documentos de marca) y el archivo de artículos (contenido generado previamente). Esta doble recuperación mantiene el resultado basado en material fuente real.</li>
<li>El LLM genera cada artículo utilizando el contexto recuperado y, a continuación, lo puntúa según una rúbrica de calidad GEO.</li>
<li>El artículo terminado vuelve a escribirse en Milvus, lo que enriquece los grupos de dedup y RAG para el siguiente lote.</li>
</ol>
<p>La definición de las competencias GEO también incluye normas de optimización: empezar con una respuesta directa, utilizar un formato estructurado, citar explícitamente las fuentes e incluir un análisis original. Los motores de búsqueda de IA analizan el contenido según su estructura y restan prioridad a las afirmaciones sin fuente, por lo que cada regla se corresponde con un comportamiento de recuperación específico.</p>
<p>La generación se realiza por lotes. Una primera ronda se envía al cliente para su revisión. Una vez confirmada la dirección, el proceso pasa a producción.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Por qué una capa de conocimiento es la diferencia entre GEO y el spam de IA<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo que separa a este proceso de "sólo preguntar a ChatGPT" es la capa de conocimiento. Sin ella, la salida de LLM parece pulida pero no dice nada verificable, y los motores de búsqueda de IA son cada vez más buenos detectando eso. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, la base de datos vectorial que alimenta este proceso, aporta varias capacidades que son importantes aquí:</p>
<p><strong>La deduplicación semántica capta lo que las palabras clave pasan por alto.</strong> La concordancia de palabras clave considera que "los puntos de referencia del rendimiento de Milvus" y "¿cómo se compara Milvus con otras bases de datos vectoriales?" son consultas no relacionadas. <a href="https://zilliz.com/learn/vector-similarity-search">La similitud vectorial</a> reconoce que se trata de la misma pregunta, por lo que el proceso omite el duplicado en lugar de malgastar una llamada de generación.</p>
<p><strong>La RAG de doble colección mantiene separadas las fuentes y las salidas.</strong> <code translate="no">geo_knowledge</code> almacena los documentos de marca ingeridos. <code translate="no">geo_articles</code> almacena el contenido generado. Cada consulta de generación afecta a ambas: la base de conocimientos mantiene la exactitud de los datos y el archivo de artículos mantiene la coherencia del tono en todo el lote. Las dos colecciones se mantienen de forma independiente, por lo que la actualización de los materiales de origen nunca afecta a los artículos existentes.</p>
<p><strong>Un bucle de retroalimentación que mejora con la escala.</strong> Cada artículo generado se devuelve inmediatamente a Milvus. El siguiente lote dispone de un fondo de deduplicación mayor y un contexto RAG más rico. La calidad aumenta con el tiempo.</p>
<p><strong>Desarrollo local de configuración cero.</strong> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> se ejecuta localmente con una línea de código, sin necesidad de Docker. Para la producción, el cambio a un clúster Milvus o Zilliz Cloud significa cambiar una sola URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Tutorial paso a paso<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>Todo el pipeline se empaqueta como un OpenClaw Skill - un directorio que contiene un archivo de instrucciones <code translate="no">SKILL.MD</code> y la implementación del código.</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Paso 1: Definir la habilidad OpenClaw</h3><p><code translate="no">SKILL.md</code> indica a OpenClaw qué puede hacer esta habilidad y cómo invocarla. Expone dos herramientas: <code translate="no">geo_ingest</code> para alimentar la base de conocimientos y <code translate="no">geo_generate</code> para la generación de artículos por lotes. También contiene las reglas de optimización GEO que dan forma a lo que produce el LLM.</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Paso 2: Registro de herramientas y puente a Python</h3><p>OpenClaw se ejecuta en Node.js, pero el proceso GEO está en Python. <code translate="no">index.js</code> sirve de puente entre ambos: registra cada herramienta en OpenClaw y delega la ejecución en el script Python correspondiente.</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Paso 3: Ingesta de material fuente</h3><p>Antes de generar nada, se necesita una base de conocimientos. <code translate="no">ingest.py</code> obtiene páginas web o lee documentos locales, trocea el texto, lo incrusta y lo escribe en la colección <code translate="no">geo_knowledge</code> de Milvus. Esto es lo que mantiene el contenido generado basado en información real y no en alucinaciones LLM.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Paso 4: Ampliar las consultas de cola larga</h3><p>Dado un tema como "base de datos vectorial Milvus", el LLM genera un conjunto de consultas de búsqueda específicas y realistas, el tipo de preguntas que los usuarios reales escriben en los motores de búsqueda de IA. Las consultas abarcan diferentes tipos de intenciones: informativas, de comparación, de instrucciones, de resolución de problemas y de preguntas frecuentes.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Paso 5: Deduplicar mediante Milvus</h3><p>Aquí es donde <a href="https://zilliz.com/learn/vector-similarity-search">la búsqueda vectorial</a> gana su lugar. Cada consulta ampliada se incrusta y compara con las colecciones <code translate="no">geo_knowledge</code> y <code translate="no">geo_articles</code>. Si la similitud del coseno es superior a 0,85, la consulta es un duplicado semántico de algo que ya está en el sistema y se descarta, lo que evita que el proceso genere cinco artículos ligeramente diferentes que responden a la misma pregunta.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Paso 6: Generación de artículos con RAG de doble fuente</h3><p>Para cada consulta que sobrevive, el generador recupera el contexto de las dos colecciones de Milvus: el material fuente autorizado de <code translate="no">geo_knowledge</code> y los artículos generados previamente de <code translate="no">geo_articles</code>. Esta doble recuperación mantiene el contenido basado en hechos (base de conocimientos) e internamente coherente (historial de artículos).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>Las dos colecciones utilizan la misma dimensión de incrustación (1536), pero almacenan metadatos diferentes porque desempeñan funciones distintas: <code translate="no">geo_knowledge</code> rastrea la procedencia de cada fragmento (para la atribución de fuentes), mientras que <code translate="no">geo_articles</code> almacena la consulta original y la puntuación GEO (para la correspondencia dedup y el filtrado de calidad).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">El modelo de datos de Milvus</h3><p>Este es el aspecto de cada colección si las crea desde cero:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">Ejecutar el proceso<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Coloque el directorio <code translate="no">skills/geo-generator/</code> en su carpeta de habilidades de OpenClaw, o envíe el archivo zip a Lark y deje que OpenClaw lo instale. Tendrás que configurar tu <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="Screenshot showing the OpenClaw skill installation via Lark chat — uploading geo-generator.zip and the bot confirming successful installation with dependency list" class="doc-image" id="screenshot-showing-the-openclaw-skill-installation-via-lark-chat-—-uploading-geo-generator.zip-and-the-bot-confirming-successful-installation-with-dependency-list" />
   </span> <span class="img-wrapper"> <span>Captura de pantalla que muestra la instalación de habilidades OpenClaw a través del chat Lark - subiendo geo-generator.zip y el bot confirmando la instalación exitosa con la lista de dependencias</span> </span>.</p>
<p>A partir de ahí, interactuar con la tubería a través de mensajes de chat:</p>
<p><strong>Ejemplo 1:</strong> Ingerir URLs de origen en la base de conocimientos, luego generar artículos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="Chat screenshot showing the workflow: user ingests 3 Aristotle URLs (245 chunks added), then generates 3 GEO articles with an average score of 81.7/100" class="doc-image" id="chat-screenshot-showing-the-workflow:-user-ingests-3-aristotle-urls-(245-chunks-added),-then-generates-3-geo-articles-with-an-average-score-of-81.7/100" />
   </span> <span class="img-wrapper"> <span>Captura de pantalla del chat que muestra el flujo de trabajo: el usuario ingiere 3 URL de Aristóteles (245 trozos añadidos) y, a continuación, genera 3 artículos GEO con una puntuación media de 81,7/100</span> </span>.</p>
<p><strong>Ejemplo 2:</strong> cargar un libro (Cumbres borrascosas), generar 3 artículos GEO y exportarlos a un documento Lark.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="Chat screenshot showing book ingestion (941 chunks from Wuthering Heights), then 3 generated articles exported to a Lark doc with an average GEO score of 77.3/100" class="doc-image" id="chat-screenshot-showing-book-ingestion-(941-chunks-from-wuthering-heights),-then-3-generated-articles-exported-to-a-lark-doc-with-an-average-geo-score-of-77.3/100" />
   </span> <span class="img-wrapper"> <span>Captura de pantalla del chat que muestra la ingesta del libro (941 fragmentos de Cumbres borrascosas) y los 3 artículos generados exportados a un documento Lark con una puntuación GEO media de 77,3/100</span> </span>.</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">Cuando la generación de contenidos GEO es contraproducente<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>La generación de contenidos GEO sólo funciona tan bien como la base de conocimientos que la sustenta. Algunos casos en los que este enfoque hace más mal que bien:</p>
<p><strong>Ausencia de fuentes fidedignas.</strong> Sin una base de conocimientos sólida, el LLM recurre a los datos de entrenamiento. En el mejor de los casos, el resultado es genérico y, en el peor, alucinado. El objetivo de la etapa RAG es basar la generación en información verificada; si se omite esta etapa, sólo se está haciendo ingeniería con pasos adicionales.</p>
<p><strong>Promocionar algo que no existe.</strong> Si el producto no funciona como se describe, eso no es GEO, es desinformación. El paso de autocalificación detecta algunos problemas de calidad, pero no puede verificar afirmaciones que la base de conocimientos no contradice.</p>
<p><strong>Su público es puramente humano.</strong> La optimización GEO (encabezamientos estructurados, respuestas directas en el primer párrafo, densidad de citas) está diseñada para que la IA pueda descubrir la información. Puede parecer una fórmula si escribes para lectores humanos. Sepa a qué público se dirige.</p>
<p><strong>Nota sobre el umbral de deduplicación.</strong> Las consultas con una similitud coseno superior a 0,85 se eliminan. Si se reciben demasiadas consultas casi duplicadas, redúzcalo. Si el proceso descarta consultas que parecen realmente diferentes, auméntelo. 0,85 es un punto de partida razonable, pero el valor correcto depende de lo limitado que sea el tema.</p>
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
    </button></h2><p>GEO es lo que era SEO hace diez años, lo suficientemente pronto como para que la infraestructura adecuada le dé una ventaja real. Este tutorial construye un canal que genera artículos que los motores de búsqueda de IA citan realmente, basados en el propio material fuente de su marca en lugar de alucinaciones LLM. La pila es <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> para la orquestación, <a href="https://milvus.io/intro">Milvus</a> para el almacenamiento de conocimientos y la recuperación <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, y LLMs para la generación y puntuación.</p>
<p>El código fuente completo está disponible en <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>Si estás construyendo una estrategia GEO y necesitas la infraestructura para apoyarla:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para ver cómo otros equipos están utilizando la búsqueda vectorial de contenido, dedup y RAG.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para analizar su caso de uso con el equipo.</li>
<li>Si prefiere saltarse la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) tiene un nivel gratuito: un cambio de URI y ya está en producción.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los equipos de marketing empiezan a explorar GEO:</p>
<p><strong>Mi tráfico SEO está cayendo.</strong>GEO no<strong>sustituye</strong>al SEO, sino que lo amplía a un nuevo canal. El SEO tradicional sigue generando tráfico a partir de los usuarios que hacen clic en las páginas. GEO se dirige a la creciente proporción de consultas en las que los usuarios obtienen respuestas directamente de la IA (Perplexity, ChatGPT Search, Google AI Overview) sin necesidad de visitar un sitio web. Si observa que los índices de clics nulos aumentan en sus análisis, ese es el tráfico que GEO está diseñado para recuperar, no a través de clics, sino a través de citas de marca en las respuestas generadas por la IA.</p>
<p><strong>¿En qué se diferencia el contenido GEO del contenido normal generado por IA?</strong>La mayor parte del contenido generado por IA es genérico: el LLM se basa en datos de entrenamiento y produce algo que parece razonable, pero que no está basado en hechos, afirmaciones o datos reales de su marca. Los contenidos de GEO se basan en una base de conocimientos de fuentes verificadas mediante RAG (retrieval-augmented generation). La diferencia se nota en el resultado: detalles específicos del producto en lugar de vagas generalizaciones, cifras reales en lugar de estadísticas inventadas y una voz de marca coherente en docenas de artículos.</p>
<p><strong>¿Cuántos artículos necesito para que GEO funcione?</strong>No hay un número mágico, pero la lógica es sencilla: Los modelos de IA sintetizan múltiples fuentes por respuesta. Cuantas más consultas de cola larga cubra con contenido de calidad, más a menudo aparecerá su marca. Empieza con 20-30 artículos sobre tu tema principal, mide cuáles se citan (comprueba tu tasa de menciones de IA y el tráfico de referencia) y amplía a partir de ahí.</p>
<p><strong>¿Los motores de búsqueda de IA no penalizarán el contenido generado en masa?</strong>Lo harán si es de baja calidad. Los motores de búsqueda de IA son cada vez mejores a la hora de detectar afirmaciones sin fuentes, frases recicladas y contenidos que no aportan un valor original. Precisamente por eso, este proceso incluye una base de conocimientos y una fase de autocalificación para controlar la calidad. El objetivo no es generar más contenido, sino generar contenido que sea lo suficientemente útil como para que los modelos de IA lo citen.</p>
