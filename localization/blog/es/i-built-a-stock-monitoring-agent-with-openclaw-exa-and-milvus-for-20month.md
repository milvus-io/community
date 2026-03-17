---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Construí un Agente de Monitoreo de Acciones con OpenClaw, Exa, y Milvus por
  $20/Mes
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Una guía paso a paso para construir un agente de monitorización de acciones AI
  usando OpenClaw, Exa, y Milvus. Resúmenes matinales, memoria de operaciones y
  alertas por 20 $/mes.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Opero con acciones estadounidenses, lo que es una forma educada de decir que pierdo dinero como hobby. Mis compañeros de trabajo bromean diciendo que mi estrategia es "comprar mucho por entusiasmo, vender poco por miedo, repetir semanalmente".</p>
<p>Lo de repetir es lo que me mata. Cada vez que miro el mercado, acabo haciendo una operación que no había planeado. El petróleo sube, vendo por pánico. Esa acción tecnológica sube un 4%, la persigo. Una semana después, miro mi historial de operaciones y me pregunto: <em>¿no hice exactamente lo mismo el trimestre pasado?</em></p>
<p>Así que construí un agente con OpenClaw que vigila el mercado en mi lugar y me impide cometer los mismos errores. No negocia ni toca mi dinero, porque eso sería un riesgo de seguridad demasiado grande. En lugar de eso, me ahorra tiempo dedicado a vigilar el mercado y evita que yo cometa los mismos errores.</p>
<p>Este agente consta de tres partes, y cuesta unos 20 dólares al mes:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>para ejecutarlo todo en piloto automático.</strong> OpenClaw ejecuta el agente en un latido del corazón de 30 minutos y sólo me hace pings cuando algo realmente importa, lo que alivia el FOMO que solía mantenerme pegado a la pantalla. Antes, cuanto más miraba los precios, más reaccionaba por impulso.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>para búsquedas precisas en tiempo real.</strong> Exa explora y resume fuentes de información seleccionadas a mano de forma programada, de modo que cada mañana recibo un informe limpio. Antes me pasaba una hora al día filtrando spam de SEO y especulaciones para encontrar noticias fiables, y no podía automatizarlo porque los sitios financieros se actualizan a diario para luchar contra los "scrapers".</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>para el historial personal y las preferencias.</strong> Milvus almacena mi historial de operaciones y el agente lo consulta antes de que tome una decisión: si estoy a punto de repetir algo de lo que me he arrepentido, me lo dice. Antes, revisar las operaciones pasadas era tan tedioso que simplemente no lo hacía, por lo que los mismos errores seguían ocurriendo con diferentes tickers. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> es la versión totalmente gestionada de Milvus. Si desea una experiencia sin complicaciones, Zilliz Cloud es una gran opción<a href="https://cloud.zilliz.com/signup">(nivel gratuito disponible</a>).</li>
</ul>
<p>He aquí cómo lo configuré, paso a paso.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Paso 1: Obtenga inteligencia de mercado en tiempo real con Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes, había probado a explorar aplicaciones financieras, escribir scrapers y buscar en terminales de datos profesionales. ¿Mi experiencia? Las aplicaciones enterraban la señal bajo el ruido, los scrapers se rompían constantemente y las API profesionales eran prohibitivamente caras. Exa es una API de búsqueda construida para agentes de IA que resuelve los problemas anteriores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> es una API de búsqueda web que devuelve datos estructurados y listos para los agentes de IA. Funciona con <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (el servicio totalmente gestionado de Milvus). Si Perplexity es un motor de búsqueda utilizado por los humanos, Exa es utilizado por la IA. El agente envía una consulta y Exa devuelve el texto del artículo, las frases clave y los resúmenes en formato JSON, una salida estructurada que el agente puede analizar y sobre la que puede actuar directamente, sin necesidad de hacer scraping.</p>
<p>Exa también utiliza la búsqueda semántica para que el agente pueda realizar consultas en lenguaje natural. Una consulta del tipo "¿Por qué cayeron las acciones de NVIDIA a pesar de los buenos resultados del cuarto trimestre de 2026?" devuelve desgloses de analistas de Reuters y Bloomberg, no una página de SEO clickbait.</p>
<p>Exa tiene un nivel gratuito: 1.000 búsquedas al mes, que es más que suficiente para empezar. Para empezar, instala el SDK e introduce tu propia clave API:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Esta es la llamada principal:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>El parámetro de contenido hace la mayor parte del trabajo pesado aquí: el texto extrae el artículo completo, lo más destacado extrae las frases clave y el resumen genera un resumen específico basado en una pregunta que tú proporcionas. Una llamada a la API sustituye a veinte minutos de saltar pestañas.</p>
<p>Ese patrón básico cubre mucho, pero acabé construyendo cuatro variaciones para manejar diferentes situaciones con las que me encuentro regularmente:</p>
<ul>
<li><strong>Filtrado por credibilidad de la fuente.</strong> Para el análisis de beneficios, sólo quiero Reuters, Bloomberg o el Wall Street Journal, no granjas de contenidos que reescriben sus informes doce horas más tarde.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Encontrar análisis similares.</strong> Cuando leo un buen artículo, quiero más perspectivas sobre el mismo tema sin tener que buscarlas manualmente.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Búsqueda profunda para cuestiones complejas.</strong> Algunas preguntas no pueden responderse con un solo artículo, como la forma en que las tensiones en Oriente Medio afectan a las cadenas de suministro de semiconductores. La búsqueda profunda sintetiza a través de múltiples fuentes y devuelve resúmenes estructurados.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Seguimiento de noticias en tiempo real.</strong> Durante las horas de mercado, necesito noticias de última hora filtradas sólo al día en curso.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>Escribí una docena de plantillas utilizando estos patrones, que cubren la política de la Reserva Federal, los beneficios de las tecnológicas, los precios del petróleo y los indicadores macroeconómicos. Se ejecutan automáticamente cada mañana y envían los resultados a mi teléfono. Lo que antes me llevaba una hora de navegación, ahora me lleva cinco minutos leer los resúmenes mientras me tomo un café.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Paso 2: Almacenar el historial de operaciones en Milvus para tomar decisiones más inteligentes<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa solucionó mi problema de información. Pero seguía repitiendo las mismas operaciones: ventas por pánico durante las caídas que se recuperaban a los pocos días, y persiguiendo el impulso de valores que ya estaban sobrevalorados. Actuaba por emoción, me arrepentía y olvidaba la lección cuando se presentaba una situación similar.</p>
<p>Necesitaba una base de conocimiento personal: algo que pudiera almacenar mis operaciones anteriores, mi razonamiento y mis meteduras de pata. No algo que tuviera que revisar manualmente (lo había intentado y nunca lo conseguí), sino algo en lo que el agente pudiera buscar por sí mismo cada vez que surgiera una situación similar. Si estoy a punto de repetir un error, quiero que el agente me lo diga antes de pulsar el botón. Emparejar la "situación actual" con la "experiencia pasada" es un problema de búsqueda de similitudes que resuelven las bases de datos vectoriales, así que elegí una para almacenar mis datos.</p>
<p>Utilicé <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, una versión ligera de Milvus que se ejecuta localmente. No tiene setu de servidor, y es perfecta para crear prototipos y experimentar. Dividí mis datos en tres colecciones. La dimensión de incrustación es 1536 para que coincida con el modelo text-embedding-3-small de OpenAI, que se puede utilizar directamente:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Las tres colecciones corresponden a tres tipos de datos personales, cada uno con una estrategia de recuperación diferente:</p>
<table>
<thead>
<tr><th><strong>Tipo</strong></th><th><strong>Qué almacena</strong></th><th><strong>Cómo lo utiliza el agente</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Preferencias</strong></td><td>Prejuicios, tolerancia al riesgo, filosofía de inversión ("tiendo a mantener los valores tecnológicos demasiado tiempo").</td><td>Cargadas en el contexto del agente en cada ejecución</td></tr>
<tr><td><strong>Decisiones y patrones</strong></td><td>Operaciones pasadas específicas, lecciones aprendidas, observaciones del mercado</td><td>Se obtienen mediante búsqueda de similitudes sólo cuando se produce una situación relevante.</td></tr>
<tr><td><strong>Conocimientos externos</strong></td><td>Informes de investigación, registros de la SEC, datos públicos</td><td>No se almacenan en Milvus - se pueden buscar a través de Exa</td></tr>
</tbody>
</table>
<p>He creado tres colecciones diferentes porque mezclarlas en una sola significaría llenar cada consulta con un historial de operaciones irrelevante o perder los sesgos principales cuando no coinciden lo suficiente con la consulta actual.</p>
<p>Una vez creadas las colecciones, necesitaba una forma de rellenarlas automáticamente. No quería copiar y pegar información después de cada conversación con el agente, así que construí un extractor de memoria que se ejecuta al final de cada sesión de chat.</p>
<p>El extractor hace dos cosas: extraer y deduplicar. El extractor pide al LLM que extraiga información estructurada de la conversación -decisiones, preferencias, patrones, lecciones- y dirige cada una de ellas a la colección adecuada. Antes de almacenar nada, comprueba la similitud con lo que ya existe. Si una nueva información es más de un 92% similar a otra ya existente, se omite.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Cuando me enfrento a una nueva situación de mercado y me entran ganas de negociar, el agente ejecuta una función de recuperación. Le describo lo que está ocurriendo y busca en las tres colecciones el historial pertinente:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Por ejemplo, cuando las acciones tecnológicas cayeron entre un 3% y un 4% por las tensiones en Oriente Medio a principios de marzo, el agente sacó tres cosas: una lección de octubre de 2024 sobre no vender por pánico durante una caída geopolítica, una nota de preferencia sobre que tiendo a sobreponderar el riesgo geopolítico, y un patrón que había registrado (las ventas tecnológicas impulsadas por la geopolítica suelen recuperarse en una a tres semanas).</p>
<p>Mi compañero de trabajo opina: si tus datos de entrenamiento son un récord perdedor, ¿qué está aprendiendo exactamente la IA? Pero esa es la cuestión: el agente no está copiando mis operaciones, sino memorizándolas para poder convencerme de que no haga la siguiente.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Paso 3: Enseñe a su agente a analizar con OpenClaw Skills<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>En este punto, el agente tiene información fiable<a href="https://exa.ai/">(Exa</a>) y memoria personal<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Pero si le entregas ambos a un LLM y le dices "analiza esto", obtendrás una respuesta genérica, de cobertura de todo. Menciona todos los ángulos posibles y concluye con "los inversores deben sopesar los riesgos". También podría no haber dicho nada.</p>
<p>La solución consiste en escribir tu propio marco analítico y dárselo al agente como instrucciones explícitas. Tienes que decirle qué indicadores te importan, qué situaciones consideras peligrosas y cuándo ser conservador frente a agresivo. Estas reglas son diferentes para cada inversor, así que tiene que definirlas usted mismo.</p>
<p>OpenClaw hace esto a través de Skills - archivos markdown en un directorio skills/. Cuando el agente se encuentra con una situación relevante, carga la habilidad correspondiente y sigue su marco en lugar de ir por libre.</p>
<p>Aquí hay uno que escribí para evaluar las acciones después de un informe de ganancias:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>La última línea es la más importante: "Siempre afloran mis errores pasados. Tengo tendencia a dejar que el miedo anule los datos. Si mi historial de Milvus muestra que me arrepentí de vender después de una caída, dígalo explícitamente". Así le digo al agente exactamente en qué me equivoco, para que sepa cuándo debe rebatirme. Si construyes el tuyo propio, esta es la parte que personalizarías en función de tus prejuicios.</p>
<p>Escribí habilidades similares para el análisis de sentimiento, indicadores macro y señales de rotación sectorial. También escribí Habilidades que simulan cómo los inversores que admiro evaluarían la misma situación: el marco de valor de Buffett, el enfoque macro de Bridgewater. No son tomadores de decisiones; son perspectivas adicionales.</p>
<p>Una advertencia: no dejes que los LLM calculen indicadores técnicos como el RSI o el MACD. Alucinan con los números confiadamente. Calcúlelos usted mismo o llame a una API dedicada, e introduzca los resultados en el Skill como entradas.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Paso 4: Inicie su agente con OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Todo lo anterior aún requiere que lo active manualmente. Si tiene que abrir un terminal cada vez que desee una actualización, prácticamente volverá a tener que hacer doomscrolling en su aplicación de corretaje durante las reuniones.</p>
<p>El mecanismo Heartbeat de OpenClaw lo soluciona. Una pasarela hace un ping al agente cada 30 minutos (configurable), y el agente comprueba un archivo HEARTBEAT.md para decidir qué hacer en ese momento. Es un archivo markdown con reglas basadas en el tiempo:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Resultados: Menos tiempo frente a la pantalla, menos operaciones impulsivas<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Esto es lo que el sistema produce realmente día a día:</p>
<ul>
<li><strong>Resumen matutino (7:00 AM).</strong> El agente ejecuta Exa durante la noche, extrae mis posiciones y el historial relevante de Milvus y envía un resumen personalizado a mi teléfono, de menos de 500 palabras. Lo que ha sucedido durante la noche, cómo se relaciona con mis posiciones y de una a tres acciones. Lo leo mientras me cepillo los dientes.</li>
<li><strong>Alertas intradía (9:30-4:00 ET).</strong> Cada 30 minutos, el agente comprueba mi lista de vigilancia. Si alguna acción se ha movido más de un 3%, recibo una notificación con el contexto: por qué la he comprado, dónde está mi stop-loss y si he estado antes en una situación similar.</li>
<li><strong>Revisión semanal (fines de semana).</strong> El agente recopila toda la semana: los movimientos del mercado, cómo se compararon con mis expectativas matinales y los patrones que merece la pena recordar. Dedico 30 minutos a leerlo el sábado. El resto de la semana, me alejo deliberadamente de la pantalla.</li>
</ul>
<p>Este último punto es el mayor cambio. El agente no sólo me ahorra tiempo, también me libera de vigilar el mercado. No puedes vender en pánico si no estás mirando los precios.</p>
<p>Antes de este sistema, dedicaba entre 10 y 15 horas a la semana a recopilar información, supervisar el mercado y revisar las operaciones, repartidas entre reuniones, desplazamientos y desplazamientos nocturnos. Ahora son unas dos horas: cinco minutos en el resumen de la mañana cada día, más 30 minutos en la revisión del fin de semana.</p>
<p>La calidad de la información también es mejor. Leo resúmenes de Reuters y Bloomberg en lugar de cualquier cosa que se haya hecho viral en Twitter. Y como el agente me recuerda mis errores pasados cada vez que tengo la tentación de actuar, he reducido considerablemente mis operaciones impulsivas. Aún no puedo demostrar que esto me haya convertido en un mejor inversor, pero sí en uno menos imprudente.</p>
<p>El coste total: 10 $/mes por OpenClaw, 10 $/mes por Exa y un poco de electricidad para mantener Milvus Lite en funcionamiento.</p>
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
    </button></h2><p>Seguía haciendo las mismas operaciones impulsivas porque mi información era mala, rara vez revisaba mi propio historial y mirar al mercado todo el día lo empeoraba. Así que construí un agente de IA que resuelve esos problemas haciendo tres cosas:</p>
<ul>
<li><strong>Recopila noticias fiables del mercado</strong> con <strong><a href="https://exa.ai/">Exa</a></strong>, sustituyendo una hora de desplazamiento a través de spam SEO y sitios de pago.</li>
<li><strong>Recuerda mis operaciones anteriores</strong> con <a href="http://milvus.io">Milvus</a> y me avisa cuando estoy a punto de repetir un error del que ya me he arrepentido.</li>
<li><strong>Funciona en piloto automático</strong> con <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> y sólo me avisa cuando algo es realmente importante.</li>
</ul>
<p>Coste total: 20 $/mes. El agente no negocia ni toca mi dinero.</p>
<p>El mayor cambio no fueron los datos ni las alertas. Fue que dejé de vigilar el mercado. El miércoles pasado me olvidé por completo de él, lo que nunca me había pasado en mis años de trading. Sigo perdiendo dinero a veces, pero con mucha menos frecuencia, y vuelvo a disfrutar de mis fines de semana. Mis compañeros aún no han actualizado la broma, pero hay que darle tiempo.</p>
<p>El agente también tardó sólo dos fines de semana en construirse. Hace un año, la misma configuración habría significado escribir programadores, canales de notificación y gestión de memoria desde cero. Con OpenClaw, la mayor parte de ese tiempo se dedicó a aclarar mis propias reglas de negociación, no a escribir la infraestructura.</p>
<p>Y una vez que se ha construido para un caso de uso, la arquitectura es portátil. Intercambie las plantillas de búsqueda de Exa y las habilidades de OpenClaw, y tendrá un agente que supervisa los trabajos de investigación, rastrea a los competidores, vigila los cambios normativos o sigue las interrupciones de la cadena de suministro.</p>
<p>Si quiere probarlo</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> - obtenga una base de datos vectorial funcionando localmente en menos de cinco minutos</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong> - configure su primer agente con Skills y Heartbeat</li>
<li><strong>API</strong><strong><a href="https://exa.ai/">Exa</a></strong> - 1.000 búsquedas gratuitas al mes para empezar</li>
</ul>
<p>¿Tienes preguntas, quieres ayuda para depurar o simplemente quieres mostrar lo que has construido? Únase al canal <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack de Milvus</a>: es la forma más rápida de obtener ayuda tanto de la comunidad como del equipo. Y si prefieres hablar de tu configuración de forma individual, reserva una <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">hora de oficina Milvus</a> de 20 minutos <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">.</a></p>
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Explicación de OpenClaw (antes Clawdbot y Moltbot): Guía completa del agente autónomo de IA</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guía paso a paso para configurar OpenClaw (antes Clawdbot/Moltbot) con Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Por qué los agentes de IA como OpenClaw consumen tokens y cómo reducir costes</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Hemos extraído el sistema de memoria de OpenClaw y lo hemos puesto en código abierto (memsearch)</a></li>
</ul>
