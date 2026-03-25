---
id: geo-content-pipeline-openclaw-milvus.md
title: |
  GEO Content at Scale: How to Rank in AI Search Without Poisoning Your Brand
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
desc: >
  Your organic traffic is declining as AI answers replace clicks. Learn how to
  generate GEO content at scale without the hallucinations and brand damage.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>Your organic search traffic is declining, and it’s not because your SEO got worse. Roughly 70% of Google queries now end in zero clicks <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">according to SparkToro</a> — users get their answers from AI-generated summaries instead of clicking through to your page. Perplexity, ChatGPT Search, Google AI Overview — these aren’t future threats. They’re already eating your traffic.</p>
<p><strong>Generative Engine Optimization (GEO)</strong> is how you fight back. Where traditional SEO optimizes for ranking algorithms (keywords, backlinks, page speed), GEO optimizes for AI models that compose answers by pulling from multiple sources. The goal: structure your content so that AI search engines cite <em>your brand</em> in their responses.</p>
<p>The problem is that GEO requires content at a scale most marketing teams can’t produce manually. AI models don’t rely on a single source — they synthesize across dozens. To show up consistently, you need coverage across hundreds of long-tail queries, each targeting a specific question a user might ask an AI assistant.</p>
<p>The obvious shortcut — having an LLM batch-generate articles — creates a worse problem. Ask GPT-4 to produce 50 articles and you’ll get 50 articles full of fabricated statistics, recycled phrasing, and claims your brand never made. That’s not GEO. That’s <strong>AI content spam with your brand name on it</strong>.</p>
<p>The fix is grounding every generation call in verified source documents — real product specs, approved brand messaging, and actual data that the LLM draws on instead of inventing. This tutorial walks through a production pipeline that does exactly that, built on three components:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong> — an open-source AI agent framework that orchestrates the workflow and connects to messaging platforms like Telegram, WhatsApp, and Slack</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong> — a <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> that handles knowledge storage, semantic deduplication, and RAG retrieval</li>
<li><strong>LLMs (GPT-4o, Claude, Gemini)</strong> — the generation and evaluation engines</li>
</ul>
<p>By the end, you’ll have a working system that ingests brand documents into a Milvus-backed knowledge base, expands seed topics into long-tail queries, deduplicates them semantically, and batch-generates articles with built-in quality scoring.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="GEO strategy overview — four pillars: Semantic analysis, Content structuring, Brand authority, and Performance tracking" class="doc-image" id="geo-strategy-overview-—-four-pillars:-semantic-analysis,-content-structuring,-brand-authority,-and-performance-tracking" />
    <span>GEO strategy overview — four pillars: Semantic analysis, Content structuring, Brand authority, and Performance tracking</span>
  </span>
</p>
<blockquote>
<p><strong>Note:</strong> This is a working system built for a real marketing workflow, but the code is a starting point. You’ll want to adapt the prompts, scoring thresholds, and knowledge base structure to your own use case.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">How the Pipeline Solves Volume × Quality<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>Component</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Agent orchestration, messaging integration (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Knowledge storage, semantic deduplication, RAG retrieval</td></tr>
<tr><td>LLMs (GPT-4o, Claude, Gemini)</td><td>Query expansion, article generation, quality scoring</td></tr>
<tr><td>Embedding model</td><td>Text to vectors for Milvus (OpenAI, 1536 dimensions by default)</td></tr>
</tbody>
</table>
<p>The pipeline runs in two phases. <strong>Phase 0</strong> ingests source material into the knowledge base. <strong>Phase 1</strong> generates articles from it.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="How the OpenClaw GEO Pipeline works — Phase 0 (Ingest: fetch, chunk, embed, store) and Phase 1 (Generate: expand queries, dedup via Milvus, RAG retrieval, generate articles, score, and store)" class="doc-image" id="how-the-openclaw-geo-pipeline-works-—-phase-0-(ingest:-fetch,-chunk,-embed,-store)-and-phase-1-(generate:-expand-queries,-dedup-via-milvus,-rag-retrieval,-generate-articles,-score,-and-store)" />
    <span>How the OpenClaw GEO Pipeline works — Phase 0 (Ingest: fetch, chunk, embed, store) and Phase 1 (Generate: expand queries, dedup via Milvus, RAG retrieval, generate articles, score, and store)</span>
  </span>
</p>
<p>Here’s what happens inside Phase 1:</p>
<ol>
<li>A user sends a message through Lark, Telegram, or WhatsApp. OpenClaw receives it and routes it to the GEO generation skill.</li>
<li>The skill expands the user’s topic into long-tail search queries using an LLM — the specific questions real users ask AI search engines.</li>
<li>Each query is embedded and checked against Milvus for semantic duplicates. Queries too similar to existing content (cosine similarity &gt; 0.85) are dropped.</li>
<li>Surviving queries trigger RAG retrieval from <strong>two Milvus collections at once</strong>: the knowledge base (brand documents) and the article archive (previously generated content). This dual retrieval keeps output grounded in real source material.</li>
<li>The LLM generates each article using the retrieved context, then scores it against a GEO quality rubric.</li>
<li>The finished article writes back to Milvus, enriching the dedup and RAG pools for the next batch.</li>
</ol>
<p>The GEO skill definition also bakes in optimization rules: lead with a direct answer, use structured formatting, cite sources explicitly, and include original analysis. AI search engines parse content by structure and deprioritize unsourced claims, so each rule maps to a specific retrieval behavior.</p>
<p>Generation runs in batches. A first round goes to the client for review. Once the direction is confirmed, the pipeline scales to full production.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Why a Knowledge Layer Is the Difference Between GEO and AI Spam<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>What separates this pipeline from “just prompting ChatGPT” is the knowledge layer. Without it, LLM output looks polished but says nothing verifiable — and AI search engines are increasingly good at detecting that. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, the vector database powering this pipeline, brings several capabilities that matter here:</p>
<p><strong>Semantic deduplication catches what keywords miss.</strong> Keyword matching treats “Milvus performance benchmarks” and “How does Milvus compare to other vector databases?” as unrelated queries. <a href="https://zilliz.com/learn/vector-similarity-search">Vector similarity</a> recognizes they’re asking the same question, so the pipeline skips the duplicate instead of wasting a generation call.</p>
<p><strong>Dual-collection RAG keeps sources and outputs separate.</strong> <code translate="no">geo_knowledge</code> stores ingested brand documents. <code translate="no">geo_articles</code> stores generated content. Every generation query hits both — the knowledge base keeps facts accurate, and the article archive keeps tone consistent across the batch. The two collections are maintained independently, so updating source materials never disrupts existing articles.</p>
<p><strong>A feedback loop that improves with scale.</strong> Each generated article writes back to Milvus immediately. The next batch has a larger dedup pool and richer RAG context. Quality compounds over time.</p>
<p><strong>Zero-setup local development.</strong> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> runs locally with one line of code — no Docker needed. For production, switching to a Milvus cluster or Zilliz Cloud means changing a single URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Step-by-Step Tutorial<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>The entire pipeline is packaged as an OpenClaw Skill — a directory containing a <code translate="no">SKILL.MD</code> instruction file and the code implementation.</p>
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
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Step 1: Define the OpenClaw Skill</h3><p><code translate="no">SKILL.md</code> tells OpenClaw what this skill can do and how to invoke it. It exposes two tools: <code translate="no">geo_ingest</code> for feeding the knowledge base and <code translate="no">geo_generate</code> for batch article generation. It also contains the GEO optimization rules that shape what the LLM produces.</p>
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
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Step 2: Register Tools and Bridge to Python</h3><p>OpenClaw runs on Node.js, but the GEO pipeline is in Python. <code translate="no">index.js</code> bridges the two — it registers each tool with OpenClaw and delegates execution to the corresponding Python script.</p>
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
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Step 3: Ingest Source Material</h3><p>Before generating anything, you need a knowledge base. <code translate="no">ingest.py</code> fetches web pages or reads local documents, chunks the text, embeds it, and writes it to the <code translate="no">geo_knowledge</code> collection in Milvus. This is what keeps generated content grounded in real information rather than LLM hallucinations.</p>
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
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Step 4: Expand Long-Tail Queries</h3><p>Given a topic like “Milvus vector database,” the LLM generates a set of specific, realistic search queries — the kind of questions real users type into AI search engines. The prompt covers different intent types: informational, comparison, how-to, problem-solving, and FAQ.</p>
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
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Step 5: Deduplicate via Milvus</h3><p>This is where <a href="https://zilliz.com/learn/vector-similarity-search">vector search</a> earns its place. Each expanded query is embedded and compared against both the <code translate="no">geo_knowledge</code> and <code translate="no">geo_articles</code> collections. If cosine similarity exceeds 0.85, the query is a semantic duplicate of something already in the system and gets dropped — preventing the pipeline from generating five slightly different articles that all answer the same question.</p>
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
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Step 6: Generate Articles with Dual-Source RAG</h3><p>For each surviving query, the generator retrieves context from both Milvus collections: authoritative source material from <code translate="no">geo_knowledge</code> and previously generated articles from <code translate="no">geo_articles</code>. This dual retrieval keeps content factually grounded (knowledge base) and internally consistent (article history).</p>
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
<p>The two collections use the same embedding dimension (1536) but store different metadata because they serve different roles: <code translate="no">geo_knowledge</code> tracks where each chunk came from (for source attribution), while <code translate="no">geo_articles</code> stores the original query and GEO score (for dedup matching and quality filtering).</p>
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
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">The Milvus Data Model</h3><p>Here’s what each collection looks like if you’re creating them from scratch:</p>
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
<h2 id="Running-the-Pipeline" class="common-anchor-header">Running the Pipeline<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Drop the <code translate="no">skills/geo-generator/</code> directory into your OpenClaw skills folder, or send the zip file to Lark and let OpenClaw install it. You’ll need to configure your <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="Screenshot showing the OpenClaw skill installation via Lark chat — uploading geo-generator.zip and the bot confirming successful installation with dependency list" class="doc-image" id="screenshot-showing-the-openclaw-skill-installation-via-lark-chat-—-uploading-geo-generator.zip-and-the-bot-confirming-successful-installation-with-dependency-list" />
    <span>Screenshot showing the OpenClaw skill installation via Lark chat — uploading geo-generator.zip and the bot confirming successful installation with dependency list</span>
  </span>
</p>
<p>From there, interact with the pipeline through chat messages:</p>
<p><strong>Example 1:</strong> Ingest source URLs into the knowledge base, then generate articles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="Chat screenshot showing the workflow: user ingests 3 Aristotle URLs (245 chunks added), then generates 3 GEO articles with an average score of 81.7/100" class="doc-image" id="chat-screenshot-showing-the-workflow:-user-ingests-3-aristotle-urls-(245-chunks-added),-then-generates-3-geo-articles-with-an-average-score-of-81.7/100" />
    <span>Chat screenshot showing the workflow: user ingests 3 Aristotle URLs (245 chunks added), then generates 3 GEO articles with an average score of 81.7/100</span>
  </span>
</p>
<p><strong>Example 2:</strong> Upload a book (Wuthering Heights), then generate 3 GEO articles and export them to a Lark doc.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="Chat screenshot showing book ingestion (941 chunks from Wuthering Heights), then 3 generated articles exported to a Lark doc with an average GEO score of 77.3/100" class="doc-image" id="chat-screenshot-showing-book-ingestion-(941-chunks-from-wuthering-heights),-then-3-generated-articles-exported-to-a-lark-doc-with-an-average-geo-score-of-77.3/100" />
    <span>Chat screenshot showing book ingestion (941 chunks from Wuthering Heights), then 3 generated articles exported to a Lark doc with an average GEO score of 77.3/100</span>
  </span>
</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">When GEO Content Generation Backfires<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO content generation only works as well as the knowledge base behind it. A few cases where this approach does more harm than good:</p>
<p><strong>No authoritative source material.</strong> Without a solid knowledge base, the LLM falls back on training data. The output ends up generic at best, hallucinated at worst. The entire point of the RAG step is to ground generation in verified information — skip that, and you’re just doing prompt engineering with extra steps.</p>
<p><strong>Promoting something that doesn’t exist.</strong> If the product doesn’t work as described, that’s not GEO — that’s misinformation. The self-scoring step catches some quality issues, but it can’t verify claims the knowledge base doesn’t contradict.</p>
<p><strong>Your audience is purely human.</strong> GEO optimization (structured headings, direct first-paragraph answers, citation density) is designed for AI discoverability. It can feel formulaic if you’re writing purely for human readers. Know which audience you’re targeting.</p>
<p><strong>A note on the dedup threshold.</strong> The pipeline drops queries with cosine similarity above 0.85. If too many near-duplicates are getting through, lower it. If the pipeline discards queries that seem genuinely different, raise it. 0.85 is a reasonable starting point, but the right value depends on how narrow your topic is.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO is where SEO was ten years ago — early enough that the right infrastructure gives you a real edge. This tutorial builds a pipeline that generates articles AI search engines actually cite, grounded in your brand’s own source material instead of LLM hallucinations. The stack is <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> for orchestration, <a href="https://milvus.io/intro">Milvus</a> for knowledge storage and <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> retrieval, and LLMs for generation and scoring.</p>
<p>The full source code is available at <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>If you’re building a GEO strategy and need the infrastructure to support it:</p>
<ul>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to see how other teams are using vector search for content, dedup, and RAG.</li>
<li><a href="https://milvus.io/office-hours">Book a free 20-minute Milvus Office Hours session</a> to walk through your use case with the team.</li>
<li>If you’d rather skip infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) has a free tier — one URI change and you’re in production.</li>
</ul>
<hr>
<p>A few questions that come up when marketing teams start exploring GEO:</p>
<p><strong>My SEO traffic is dropping. Is GEO the replacement?</strong>
GEO doesn’t replace SEO — it extends it to a new channel. Traditional SEO still drives traffic from users who click through to pages. GEO targets the growing share of queries where users get answers directly from AI (Perplexity, ChatGPT Search, Google AI Overview) without ever visiting a website. If you’re seeing zero-click rates climb in your analytics, that’s the traffic GEO is designed to recapture — not through clicks, but through brand citations in AI-generated answers.</p>
<p><strong>How is GEO content different from regular AI-generated content?</strong>
Most AI-generated content is generic — the LLM draws from training data and produces something that sounds reasonable but isn’t grounded in your brand’s actual facts, claims, or data. GEO content is grounded in a knowledge base of verified source material using RAG (retrieval-augmented generation). The difference shows in the output: specific product details instead of vague generalizations, real numbers instead of fabricated stats, and consistent brand voice across dozens of articles.</p>
<p><strong>How many articles do I need for GEO to work?</strong>
There’s no magic number, but the logic is straightforward: AI models synthesize from multiple sources per answer. The more long-tail queries you cover with quality content, the more often your brand shows up. Start with 20-30 articles around your core topic, measure which ones get cited (check your AI mention rate and referral traffic), and scale from there.</p>
<p><strong>Won’t AI search engines penalize mass-generated content?</strong>
They will if it’s low-quality. AI search engines are getting better at detecting unsourced claims, recycled phrasing, and content that doesn’t add original value. That’s exactly why this pipeline includes a knowledge base for grounding and a self-scoring step for quality control. The goal isn’t to generate more content — it’s to generate content that’s genuinely useful enough for AI models to cite.</p>
