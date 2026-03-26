---
id: geo-content-pipeline-openclaw-milvus.md
title: >-
  Contenuti GEO su scala: Come posizionarsi nella ricerca AI senza avvelenare il
  proprio marchio
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
  Il vostro traffico organico sta diminuendo perché le risposte
  dell'intelligenza artificiale sostituiscono i clic. Scoprite come generare
  contenuti GEO su scala senza allucinazioni e danni al marchio.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>Il vostro traffico di ricerca organico è in calo e non perché la vostra SEO sia peggiorata. <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">Secondo SparkToro</a>, circa il 60% delle ricerche su Google si conclude con zero clic: gli utenti ottengono le risposte da sintesi generate dall'intelligenza artificiale invece di cliccare sulla vostra pagina. Perplexity, ChatGPT Search, Google AI Overview: non sono minacce future. Stanno già divorando il vostro traffico.</p>
<p>L<strong>'ottimizzazione generativa dei motori (GEO)</strong> è il modo per reagire. Mentre la SEO tradizionale ottimizza gli algoritmi di posizionamento (parole chiave, backlink, velocità della pagina), la GEO ottimizza i modelli di intelligenza artificiale che compongono le risposte attingendo da più fonti. L'obiettivo: strutturare i contenuti in modo che i motori di ricerca AI citino <em>il vostro marchio</em> nelle loro risposte.</p>
<p>Il problema è che GEO richiede contenuti di dimensioni tali che la maggior parte dei team di marketing non può produrre manualmente. I modelli di intelligenza artificiale non si basano su un'unica fonte, ma sintetizzano decine di fonti. Per apparire in modo coerente, è necessaria una copertura di centinaia di query a coda lunga, ciascuna mirata a una domanda specifica che un utente potrebbe porre a un assistente AI.</p>
<p>La scorciatoia più ovvia, ovvero far generare articoli a un LLM in batch, crea un problema peggiore. Se chiedete a GPT-4 di produrre 50 articoli, otterrete 50 articoli pieni di statistiche inventate, frasi riciclate e affermazioni che il vostro marchio non ha mai fatto. Questo non è GEO. È <strong>spam di contenuti AI con il nome del vostro marchio sopra</strong>.</p>
<p>La soluzione consiste nel fondare ogni chiamata di generazione su documenti di origine verificati: specifiche di prodotto reali, messaggistica del marchio approvata e dati reali a cui l'LLM attinge invece di inventare. Questo tutorial illustra una pipeline di produzione che fa esattamente questo, basata su tre componenti:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong> - un framework open-source di agenti AI che orchestra il flusso di lavoro e si connette a piattaforme di messaggistica come Telegram, WhatsApp e Slack.</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong> - un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> che gestisce l'archiviazione della conoscenza, la deduplicazione semantica e il recupero delle RAG.</li>
<li><strong>LLM (GPT-4o, Claude, Gemini)</strong> - i motori di generazione e valutazione.</li>
</ul>
<p>Alla fine, avrete un sistema funzionante che inserisce documenti di marca in una base di conoscenza supportata da Milvus, espande gli argomenti di partenza in query a coda lunga, li deduplica semanticamente e genera articoli in batch con un punteggio di qualità integrato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>Nota:</strong> questo è un sistema funzionante costruito per un reale flusso di lavoro di marketing, ma il codice è un punto di partenza. È necessario adattare le richieste, le soglie di punteggio e la struttura della knowledge base al proprio caso d'uso.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">Come la pipeline risolve il problema del volume e della qualità<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>Componente</th><th>Ruolo</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Orchestrazione degli agenti, integrazione della messaggistica (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Memorizzazione della conoscenza, deduplicazione semantica, recupero RAG</td></tr>
<tr><td>LLM (GPT-4o, Claude, Gemini)</td><td>Espansione delle query, generazione di articoli, punteggio di qualità</td></tr>
<tr><td>Modello di incorporazione</td><td>Testo in vettori per Milvus (OpenAI, 1536 dimensioni di default)</td></tr>
</tbody>
</table>
<p>La pipeline si svolge in due fasi. <strong>La fase 0</strong> inserisce il materiale di partenza nella base di conoscenza. <strong>La fase 1</strong> genera articoli a partire da esso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ecco cosa accade nella Fase 1:</p>
<ol>
<li>Un utente invia un messaggio tramite Lark, Telegram o WhatsApp. OpenClaw lo riceve e lo indirizza all'abilità di generazione GEO.</li>
<li>L'abilità espande l'argomento dell'utente in query di ricerca a coda lunga utilizzando un LLM - le domande specifiche che gli utenti reali pongono ai motori di ricerca AI.</li>
<li>Ogni query viene incorporata e controllata da Milvus per verificare la presenza di duplicati semantici. Le query troppo simili ai contenuti esistenti (somiglianza coseno &gt; 0,85) vengono eliminate.</li>
<li>Le query sopravvissute attivano il recupero RAG da <strong>due collezioni Milvus contemporaneamente</strong>: la base di conoscenza (documenti del marchio) e l'archivio degli articoli (contenuti generati in precedenza). Questo doppio reperimento permette di mantenere l'output basato sul materiale di partenza reale.</li>
<li>Il LLM genera ogni articolo utilizzando il contesto recuperato, quindi lo valuta in base a una griglia di qualità GEO.</li>
<li>L'articolo finito viene scritto di nuovo a Milvus, arricchendo i pool di dedup e RAG per il lotto successivo.</li>
</ol>
<p>La definizione delle competenze GEO prevede anche delle regole di ottimizzazione: iniziare con una risposta diretta, utilizzare una formattazione strutturata, citare esplicitamente le fonti e includere un'analisi originale. I motori di ricerca AI analizzano i contenuti in base alla loro struttura e deprimono le affermazioni prive di fonti, quindi ogni regola corrisponde a uno specifico comportamento di recupero.</p>
<p>La generazione avviene in lotti. Un primo ciclo viene inviato al cliente per la revisione. Una volta confermata la direzione, la pipeline passa alla produzione completa.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Perché il livello di conoscenza fa la differenza tra GEO e AI Spam<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>Ciò che separa questa pipeline dal "semplice prompt di ChatGPT" è il livello di conoscenza. Senza di esso, l'output di LLM sembra curato ma non dice nulla di verificabile, e i motori di ricerca AI sono sempre più bravi a rilevarlo. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, il database vettoriale che alimenta questa pipeline, offre diverse funzionalità importanti:</p>
<p><strong>La deduplicazione semantica cattura ciò che le parole chiave non colgono.</strong> La corrispondenza delle parole chiave considera "Milvus performance benchmarks" e "Come si confronta Milvus con altri database vettoriali?" come query non correlate. <a href="https://zilliz.com/learn/vector-similarity-search">La similarità vettoriale</a> riconosce che stanno ponendo la stessa domanda, quindi la pipeline salta il duplicato invece di sprecare una chiamata di generazione.</p>
<p><strong>RAG a doppia raccolta mantiene separate le fonti e gli output.</strong> <code translate="no">geo_knowledge</code> memorizza i documenti di marca ingeriti. <code translate="no">geo_articles</code> memorizza i contenuti generati. Ogni query di generazione li tocca entrambi: la base di conoscenza mantiene i fatti accurati e l'archivio degli articoli mantiene il tono coerente in tutto il batch. Le due raccolte sono gestite in modo indipendente, per cui l'aggiornamento dei materiali di partenza non interrompe mai gli articoli esistenti.</p>
<p><strong>Un ciclo di feedback che migliora con la scala.</strong> Ogni articolo generato scrive immediatamente su Milvus. Il lotto successivo ha un pool di dedup più ampio e un contesto RAG più ricco. La qualità aumenta nel tempo.</p>
<p><strong>Opzioni di distribuzione multiple per esigenze diverse.</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>: Una versione leggera di Milvus che funziona sul vostro portatile con una sola riga di codice, senza bisogno di Docker. Ottima per la prototipazione, ed è tutto ciò che richiede questo tutorial.</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a> Standalone e Milvus Distributed: la versione più scalabile per la produzione.</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> è un Milvus gestito senza problemi. Non è necessario preoccuparsi della configurazione tecnica e della manutenzione. È disponibile il livello gratuito.</p></li>
</ul>
<p>Questo tutorial utilizza Milvus Lite: nessun account da creare, nessuna installazione oltre a <code translate="no">pip install pymilvus</code> e tutto viene eseguito localmente in modo da poter provare la pipeline completa prima di impegnarsi.</p>
<p>La differenza nella distribuzione sta nell'URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Esercitazione passo-passo<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>L'intera pipeline è confezionata come OpenClaw Skill, una directory contenente un file di istruzioni <code translate="no">SKILL.MD</code> e l'implementazione del codice.</p>
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
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Passo 1: Definire l'abilità OpenClaw</h3><p><code translate="no">SKILL.md</code> indica a OpenClaw cosa può fare questa skill e come invocarla. Espone due strumenti: <code translate="no">geo_ingest</code> per l'alimentazione della base di conoscenza e <code translate="no">geo_generate</code> per la generazione di articoli in batch. Contiene inoltre le regole di ottimizzazione GEO che determinano i risultati dell'LLM.</p>
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
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Passo 2: registrazione degli strumenti e collegamento a Python</h3><p>OpenClaw funziona su Node.js, ma la pipeline GEO è in Python. <code translate="no">index.js</code> fa da ponte tra i due: registra ogni strumento con OpenClaw e delega l'esecuzione allo script Python corrispondente.</p>
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
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Fase 3: Ingerire il materiale di partenza</h3><p>Prima di generare qualsiasi cosa, è necessaria una base di conoscenza. <code translate="no">ingest.py</code> recupera le pagine web o legge i documenti locali, raggruppa il testo, lo incorpora e lo scrive nella raccolta <code translate="no">geo_knowledge</code> di Milvus. In questo modo i contenuti generati si basano su informazioni reali e non su allucinazioni di LLM.</p>
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
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Passo 4: Espandere le query a coda lunga</h3><p>Dato un argomento come "database vettoriale Milvus", l'LLM genera una serie di query di ricerca specifiche e realistiche, il tipo di domande che gli utenti reali digitano nei motori di ricerca AI. Il prompt copre diversi tipi di intento: informativo, di comparazione, di soluzione dei problemi e di FAQ.</p>
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
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Fase 5: Deduplicazione tramite Milvus</h3><p>È qui che la <a href="https://zilliz.com/learn/vector-similarity-search">ricerca vettoriale</a> si guadagna il suo posto. Ogni query espansa viene incorporata e confrontata con le collezioni <code translate="no">geo_knowledge</code> e <code translate="no">geo_articles</code>. Se la somiglianza del coseno supera 0,85, la query è un duplicato semantico di qualcosa già presente nel sistema e viene eliminata, evitando che la pipeline generi cinque articoli leggermente diversi che rispondono tutti alla stessa domanda.</p>
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
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Fase 6: Generazione di articoli con RAG a doppia fonte</h3><p>Per ogni query sopravvissuta, il generatore recupera il contesto da entrambe le collezioni di Milvus: il materiale di fonte autorevole da <code translate="no">geo_knowledge</code> e gli articoli generati in precedenza da <code translate="no">geo_articles</code>. Questo doppio recupero mantiene i contenuti basati sui fatti (base di conoscenza) e coerenti internamente (storia dell'articolo).</p>
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
<p>Le due collezioni utilizzano la stessa dimensione di incorporamento (1536), ma memorizzano metadati diversi perché svolgono ruoli diversi: <code translate="no">geo_knowledge</code> tiene traccia della provenienza di ogni chunk (per l'attribuzione della fonte), mentre <code translate="no">geo_articles</code> memorizza la query originale e il punteggio GEO (per il dedup matching e il filtro di qualità).</p>
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
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Il modello dei dati Milvus</h3><p>Ecco come appare ogni raccolta se la si crea da zero:</p>
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
<h2 id="Running-the-Pipeline" class="common-anchor-header">Esecuzione della pipeline<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Inserire la cartella <code translate="no">skills/geo-generator/</code> nella cartella delle competenze di OpenClaw, oppure inviare il file zip a Lark e lasciare che OpenClaw lo installi. È necessario configurare la pipeline <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Da qui, interagire con la pipeline attraverso i messaggi di chat:</p>
<p><strong>Esempio 1:</strong> Inserire gli URL delle fonti nella base di conoscenza, quindi generare articoli.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Esempio 2:</strong> caricare un libro (Cime tempestose), quindi generare 3 articoli GEO ed esportarli in un documento Lark.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">Portare questa pipeline in produzione<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Tutto ciò che è stato descritto in questo tutorial viene eseguito su Milvus Lite, cioè sul vostro computer portatile e si ferma quando il vostro computer portatile si ferma. Per una vera pipeline GEO, questo non è sufficiente. Volete che gli articoli vengano generati mentre siete in riunione. Si vuole che la base di conoscenze sia disponibile quando un collega esegue un batch martedì prossimo.</p>
<p>A questo punto, ci sono due soluzioni.</p>
<p><strong>Auto-ospitare Milvus utilizzando la modalità Standalone o Distributed.</strong> Il team di ingegneri installa la versione completa su un server, un computer dedicato, fisico o noleggiato da un provider cloud come AWS. Si tratta di una soluzione molto efficace, che offre il pieno controllo della distribuzione, ma che richiede un team di ingegneri dedicato per la configurazione, la manutenzione e la scalabilità.</p>
<p><strong>Utilizzate</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a><strong>.</strong> Zilliz Cloud è la versione completamente gestita di Milvus con funzionalità più avanzate di livello enterprise, realizzate dallo stesso team.</p>
<ul>
<li><p><strong>Zero problemi di gestione e manutenzione.</strong></p></li>
<li><p><strong>Disponibile il livello gratuito.</strong> Il <a href="https://cloud.zilliz.com/signup">livello gratuito</a> comprende 5 GB di spazio di archiviazione, sufficienti per ingerire tutto <em>Cime tempestose</em> per 360 volte, o 360 libri. È disponibile anche una versione di prova gratuita di 30 giorni per carichi di lavoro maggiori.</p></li>
<li><p><strong>Sempre in prima linea per le nuove funzionalità.</strong> Quando Milvus rilascia dei miglioramenti, Zilliz Cloud li riceve automaticamente, senza dover aspettare che il vostro team programmi un aggiornamento.</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p><a href="https://cloud.zilliz.com/signup">Iscrivetevi a Zilliz Cloud</a> e provatelo.</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">Quando la generazione di contenuti GEO non funziona<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>La generazione di contenuti GEO funziona solo se la base di conoscenze che la sostiene è buona. Alcuni casi in cui questo approccio fa più male che bene:</p>
<p><strong>Assenza di materiale di partenza autorevole.</strong> Senza una solida base di conoscenze, l'LLM si basa sui dati di formazione. L'output finisce per essere generico nel migliore dei casi, allucinato nel peggiore. L'intero scopo della fase RAG è quello di fondare la generazione su informazioni verificate: se si salta questa fase, si fa solo dell'ingegneria di base con dei passaggi in più.</p>
<p><strong>Promuovere qualcosa che non esiste.</strong> Se il prodotto non funziona come descritto, non si tratta di GEO, ma di disinformazione. La fase di autovalutazione individua alcuni problemi di qualità, ma non può verificare le affermazioni che la base di conoscenze non contraddice.</p>
<p><strong>Il vostro pubblico è puramente umano.</strong> L'ottimizzazione GEO (titoli strutturati, risposte dirette nel primo paragrafo, densità di citazioni) è progettata per la scopribilità dell'intelligenza artificiale. Può sembrare una formula se si scrive solo per lettori umani. Conoscere il pubblico a cui ci si rivolge.</p>
<p><strong>Una nota sulla soglia di dedup.</strong> La pipeline elimina le query con somiglianza di coseno superiore a 0,85. Se passano troppe query quasi duplicate, abbassatela. Se la pipeline scarta query che sembrano veramente diverse, aumentatela. 0,85 è un punto di partenza ragionevole, ma il valore giusto dipende dalla ristrettezza dell'argomento.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO è al livello di SEO di dieci anni fa, abbastanza presto perché l'infrastruttura giusta vi dia un vantaggio reale. Questo tutorial costruisce una pipeline che genera articoli che i motori di ricerca citano effettivamente, basati sul materiale di partenza del vostro marchio invece che su allucinazioni di LLM. Lo stack è costituito da <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> per l'orchestrazione, <a href="https://milvus.io/intro">Milvus</a> per l'archiviazione della conoscenza e il recupero <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">delle RAG</a>, e gli LLM per la generazione e lo scoring.</p>
<p>Il codice sorgente completo è disponibile su <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>Se state costruendo una strategia GEO e avete bisogno di un'infrastruttura per supportarla:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">comunità Milvus Slack</a> per vedere come altri team utilizzano la ricerca vettoriale per i contenuti, il dedup e il RAG.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per analizzare il vostro caso d'uso con il team.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) ha un livello gratuito: una modifica dell'URI e siete in produzione.</li>
</ul>
<hr>
<p>Alcune domande che emergono quando i team di marketing iniziano a esplorare il GEO:</p>
<p><strong>Il mio traffico SEO sta calando. GEO è il sostituto?</strong>GEO non sostituisce la SEO, ma la estende a un nuovo canale. La SEO tradizionale continua a generare traffico dagli utenti che cliccano sulle pagine. GEO si rivolge alla quota crescente di domande in cui gli utenti ottengono risposte direttamente dall'intelligenza artificiale (Perplexity, ChatGPT Search, Google AI Overview) senza mai visitare un sito web. Se nei vostri dati analitici vedete aumentare le percentuali di zero click, questo è il traffico che GEO è progettato per recuperare, non attraverso i click, ma attraverso le citazioni del marchio nelle risposte generate dall'IA.</p>
<p><strong>In che modo i contenuti GEO sono diversi dai normali contenuti generati dall'intelligenza artificiale?</strong>La maggior parte dei contenuti generati dall'intelligenza artificiale è generica: l'LLM attinge ai dati di addestramento e produce qualcosa che sembra ragionevole, ma non è basato su fatti, affermazioni o dati reali del vostro marchio. I contenuti GEO si basano su una base di conoscenza di materiale di origine verificato, utilizzando la RAG (retrieval-augmented generation). La differenza si vede nell'output: dettagli specifici sui prodotti invece di vaghe generalizzazioni, numeri reali invece di statistiche inventate e una voce coerente del marchio in decine di articoli.</p>
<p><strong>Di quanti articoli ho bisogno perché GEO funzioni?</strong>Non c'è un numero magico, ma la logica è semplice: I modelli di intelligenza artificiale sintetizzano da più fonti per ogni risposta. Più query a coda lunga sono coperte da contenuti di qualità, più spesso il vostro marchio compare. Iniziate con 20-30 articoli sul vostro argomento principale, misurate quali vengono citati (controllate il tasso di menzioni dell'IA e il traffico di riferimento) e scalate da lì.</p>
<p><strong>I motori di ricerca AI non penalizzeranno i contenuti generati in massa?</strong>Lo faranno se sono di bassa qualità. I motori di ricerca AI sono sempre più bravi a individuare affermazioni prive di fonti, frasi riciclate e contenuti che non aggiungono valore originale. È proprio per questo motivo che questa pipeline include una base di conoscenza per le fondamenta e una fase di autovalutazione per il controllo della qualità. L'obiettivo non è generare più contenuti, ma generare contenuti che siano veramente utili e che i modelli di intelligenza artificiale possano citare.</p>
