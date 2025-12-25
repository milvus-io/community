---
id: building-a-search-pipeline-that-understands-what-users-want.md
title: 'Aufbau von KI-Suchpipelines, die verstehen, was Nutzer wollen, mit Milvus'
author: Sudhanshu Prajapati
date: 2025-12-22T00:00:00.000Z
cover: assets.zilliz.com/semantic_search_325a0b5597.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, semantic search, filtered search, hybrid search'
meta_title: |
  How to Build AI Search Pipelines That Understand User Intent with Milvus
desc: >-
  Entdecken Sie, wie Milvus eine einzige Suchpipeline ermöglicht, die
  semantische Suche mit strukturierten Einschränkungen für konsistente,
  qualitativ hochwertige Abfragen kombiniert.
origin: >-
  https://github.com/sudhanshu456/milvus-rag-semantic-search/blob/main/search_pipeline_demo.ipynb
---
<p><em>This post was originally published on</em> <a href="https://github.com/sudhanshu456/milvus-rag-semantic-search/blob/main/search_pipeline_demo.ipynb"><em>GitHub</em></a> <em>and is reposted here with permission.</em></p>
<p>When you search on most e-commerce sites, you rarely use natural language—not because you don’t want to, but because the search engine isn’t built to understand it. If you type _“comfortable running shoes under <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>100</mn><msub><mtext>”</mtext><mo separator="true">,</mo></msub><mi>t</mi><mi>h</mi><mi>e</mi><mi>r</mi><mi>e</mi><mi>s</mi><mi>u</mi><mi>l</mi><mi>t</mi><mi>s</mi><mi>o</mi><mi>f</mi><mi>t</mi><mi>e</mi><mi>n</mi><mi>i</mi><mi>n</mi><mi>c</mi><mi>l</mi><mi>u</mi><mi>d</mi><mi>e</mi><mi>s</mi><mi>h</mi><mi>o</mi><mi>e</mi><mi>s</mi><mi>p</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mi>d</mi><mi>o</mi><mi>v</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">100”_, the results often include shoes priced over</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9805em;vertical-align:-0.2861em;"></span><span class="mord">100</span><span class="mord"><span class="mord">”</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:-0.0761em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mpunct mtight">,</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord mathnormal">eres</span><span class="mord mathnormal">u</span><span class="mord mathnormal">lt</span><span class="mord mathnormal">so</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal">nin</span><span class="mord mathnormal">c</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">u</span><span class="mord mathnormal">d</span><span class="mord mathnormal">es</span><span class="mord mathnormal">h</span><span class="mord mathnormal">oes</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mord mathnormal">d</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span></span></span></span>200, products that aren’t even designed for running, and items that ignore the idea of comfort altogether. Keyword-based systems treat your query as a handful of unrelated terms rather than a meaningful request. They can’t infer that “comfortable” implies cushioning and support or that “under $100” is a strict constraint.</p>
<p>When this happens, you either assume the platform doesn’t carry what you need or you abandon the search entirely. This leads to what’s often called the <strong>Null Result Fallacy</strong>—the system avoids returning zero results and instead displays anything loosely matching the keywords. The results are technically correct, but practically useless.</p>
<p>This is where <a href="https://zilliz.com/glossary/semantic-search"><strong>semantic search</strong> </a>helps!</p>
<h2 id="Why-Semantic-Search" class="common-anchor-header">Why Semantic Search?<button data-href="#Why-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>To understand semantic search, imagine how you look for things in real life. If you ask a friend, <em>“Where can I find good coffee nearby?”</em> you’re not expecting them to look for shop names that literally contain the words “good coffee.” You want recommendations for cafes that serve quality coffee and are close to you. Your friend interprets the meaning of your question—not just the keywords.</p>
<p>Semantic search works the same way. A model understands that “comfortable running shoes” relates to ideas like cushioning, support, and softness, even when those words never appear in the text. But semantic understanding alone isn’t enough. In practice, users also expect the system to honor structured filters such as price range, category, or availability.</p>
<p>A <strong>filtered search</strong> combines semantic vectors with strict filters in a single retrieval step, ensuring results are both relevant and constrained by the rules you set. Before we dive into how those filters work, let’s take a closer look at the difference between matching keywords and matching vectors.</p>
<h3 id="From-Words-to-Vectors" class="common-anchor-header">From Words to Vectors</h3><p>Traditional search used to rely on matching words. Today, we match <strong>vectors</strong>—and that shift is what embedding models make possible. Earlier approaches, such as <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">TF-IDF</a>, <a href="https://zilliz.com/glossary/word2vec">Word2Vec</a>, and <a href="https://zilliz.com/glossary/glove">GloVe</a>, operate at the word level. They can tell you that “dog” is similar to “puppy,” but they struggle to capture the meaning of an entire sentence or phrase. If someone searches for “comfortable running shoes,” simply matching individual words isn’t enough—you need to understand the intent behind the whole phrase.</p>
<p>Modern embedding models, such as <a href="https://zilliz.com/ai-models/text-embedding-3-small">text-embedding-3-small</a>, address this by converting entire sentences or phrases into dense vector representations. These vectors encode semantic meaning, allowing the system to recognize that <em>“comfortable running shoes”</em> and <em>“cushioned athletic footwear”</em> refer to essentially the same concept, even though they share no overlapping words.</p>
<p>In this blog, we’ll use <strong>gemini-embedding-001</strong>, Google’s latest embedding model. It transforms text into <strong>3072-dimensional vectors</strong>, with each dimension capturing a subtle aspect of meaning. Texts with similar meanings end up close together in this high-dimensional space, while unrelated texts are far apart. The higher dimensionality enables the model to represent fine-grained semantic relationships, enabling far more accurate, context-aware search.</p>
<h3 id="Vector-Databases" class="common-anchor-header">Vector Databases</h3><p>A search pipeline needs more than a vector index. It needs a database that supports vector search and structured filtering in one place. Vector databases like <a href="https://milvus.io/">Milvus</a> provide this by running vector similarity search with scalar filters such as price and category. It also performs pre-filtering so that items outside constraints do not enter the vector search step. Helps improve accuracy and latency.</p>
<h3 id="When-Semantic-Search-Needs-Structure" class="common-anchor-header">When Semantic Search Needs Structure</h3><p>Users often search with layered intent. A query like “wireless headphones with noise cancellation” implies:</p>
<ul>
<li><p>category: headphones</p></li>
<li><p>wireless capability</p></li>
<li><p>noise cancellation</p></li>
<li><p>expected price range</p></li>
<li><p>brand considerations</p></li>
<li><p>in stock items only</p></li>
</ul>
<p>Traditional keyword search treats these as isolated words. Users expect a system that recognizes how these elements work together.</p>
<h3 id="Traditional-Search-vs-What-Users-Want" class="common-anchor-header">Traditional Search vs What Users Want</h3><pre><code translate="no">Traditional Keyword Search:
┌─────────────────────────────────────────────────────────┐
│ Query: &quot;comfortable running shoes under $100&quot;           │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Results:                                                │
│ Running shoes - $150 (over budget)                      │
│ Comfortable slippers - $80 (not running shoes)          │
│ Running shoes - $90 (out of stock)                      │
│ Running shoes - $95 (only one relevant match)           │
└─────────────────────────────────────────────────────────┘

Hybrid Approach:
┌─────────────────────────────────────────────────────────┐
│ Query: &quot;comfortable running shoes under $100&quot;           │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────────────────────┬───────────────────────────────┐
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│ Semantic Search  │          │ Label Filters    │
│ (interprets      │    +     │ price &lt; $100     │
│ &quot;comfortable&quot;)   │          │ category         │
└──────────────────┘          │ stock            │
                              └──────────────────┘
        │                               │
        └───────────────────────────────┬───────────────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────┐
│ Results:                                                │
│ Running shoes - $95 (in stock, comfortable)             │
│ Running shoes - $89 (in stock, cushioned)               │
│ Running shoes - $75 (in stock, supportive)              │
└─────────────────────────────────────────────────────────┘
</code></pre>
<p>ANN search with filtering aligns user phrasing with product meaning and applies filters at the same time.</p>
<h2 id="Building-the-Intent-Aware-Search-Pipeline" class="common-anchor-header">Building the Intent Aware Search Pipeline<button data-href="#Building-the-Intent-Aware-Search-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>The pipeline augments the retrieval layer with components that interpret language, apply filters, and optionally generate explanations. It does not replace existing databases. It enhances how information is retrieved.</p>
<p><strong>Full Workflow</strong></p>
<pre><code translate="no">┌─────────────────────────────────────────────────────────────────┐
│                    User Query                                   │
│         &quot;Navy blue joggers for men cheap&quot;                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  1. The Parser (LLM Layer)         │
        │     Extracts structured metadata   │
        │     from natural language          │
        │                                    │
        │     Input: &quot;Navy blue joggers      │
        │             for men cheap&quot;         │
        │                                    │
        │     Output: {                      │
        │       &quot;category&quot;: &quot;pants&quot;,         │
        │       &quot;style&quot;: &quot;joggers&quot;,          │
        │       &quot;gender&quot;: &quot;male&quot;,            │
        │       &quot;color&quot;: &quot;blue&quot;,             │
        │       &quot;price_tier&quot;: &quot;low&quot;          │
        │     }                              │
        └────────────┬───────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────┐
        │  2. The Retriever (Milvus Layer)   │
        │     Combines semantic search       │
        │     with extracted constraints     │
        │                                    │
        │     • Semantic: Vector embedding   │
        │       for &quot;joggers&quot;                │
        │     • Filters: price &lt;= $X,        │
        │       category=&quot;pants&quot;,            │
        │       gender=&quot;male&quot;                │
        │                                    │
        │     Milvus performs ANN search     │
        │     WITHIN the filtered subset     │
        │     (pre-filtering for speed)      │
        └────────────┬───────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────┐
        │  3. The Synthesizer (RAG Layer)    │
        │     Optional: For complex queries  │
        │     like &quot;Which of these is best   │
        │     for winter?&quot;                   │
        │                                    │
        │     LLM takes retrieved products   │
        │     and generates natural language │
        │     answer (RAG)                   │
        └────────────┬───────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────┐
        │        Filtered Results            │
        │   + Natural Language Answer        │
        │                                    │
        │   Result: Search experience that   │
        │   feels like a conversation with   │
        │   a knowledgeable salesperson      │
        └────────────────────────────────────┘
</code></pre>
<p>This pipeline supports a search experience that responds to user intent and business constraints. Next, we’ll implement these layers step-by-step in code. Let’s begin!</p>
<h2 id="Setting-Up-Search-Pipeline" class="common-anchor-header">Setting Up Search Pipeline<button data-href="#Setting-Up-Search-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Before we start building, we need to set up our environment. We’ll use uv for environment management, uv make the evironment setup easy!</p>
<h3 id="Environment-Setup-Run-Once-in-Terminal" class="common-anchor-header">Environment Setup (Run Once in Terminal)</h3><p><strong>Before opening this notebook</strong>, make sure you’ve set up your Python environment in your terminal:</p>
<p><em># Create virtual environment and install dependencies</em></p>
<p>uv venv</p>
<p>source .venv/bin/activate</p>
<p>uv pip install -r requirements.txt</p>
<p><em># Create Jupyter kernel for this environment</em></p>
<p>python -m ipykernel install --user --name zilliz-demo --display-name &quot;Python (zilliz-demo)&quot;</p>
<p>Then open this notebook in Jupyter and select the zilliz-demo kernel from the kernel selector.</p>
<h3 id="Verify-Environment" class="common-anchor-header">Verify Environment</h3><p>Let’s verify that the environment is set up correctly:</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Python environment</span>
<span class="hljs-keyword">import</span> sys
<span class="hljs-keyword">import</span> os

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Python version: <span class="hljs-subst">{sys.version}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Python executable: <span class="hljs-subst">{sys.executable}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Virtual environment: <span class="hljs-subst">{os.environ.get(<span class="hljs-string">&#x27;VIRTUAL_ENV&#x27;</span>, <span class="hljs-string">&#x27;Not detected&#x27;</span>)}</span>&quot;</span>)

<span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(sys, <span class="hljs-string">&#x27;real_prefix&#x27;</span>) <span class="hljs-keyword">or</span> (<span class="hljs-built_in">hasattr</span>(sys, <span class="hljs-string">&#x27;base_prefix&#x27;</span>) <span class="hljs-keyword">and</span> sys.base_prefix != sys.prefix):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Running in a virtual environment&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠ Warning: Not running in a virtual environment. Consider using uv or venv.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Python version: 3.13.1 (main, Dec  3 2024, 17:59:52) [Clang 16.0.0 (clang-1600.0.26.4)]</p>
<p>Python executable: /Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv/bin/python</p>
<p>Virtual environment: /Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv</p>
<p>✓ Running in a virtual environment</p>
<pre><code translate="no"><span class="hljs-comment"># Install required packages (only if you haven&#x27;t used uv setup)</span>
<span class="hljs-comment"># If you&#x27;ve already created the environment using &#x27;uv&#x27; as shown above, you can skip this cell.</span>
%pip install -q pymilvus langextract google-genai pandas numpy python-dotenv pydantic jupyter ipykernel
<button class="copy-code-btn"></button></code></pre>
<p><strong>[</strong>notice<strong>]</strong> A new release of pip is available: 24.3.1 -&gt; 25.3</p>
<p><strong>[</strong>notice<strong>]</strong> To update, run: pip3 install --upgrade pip</p>
<p>Note: you may need to restart the kernel to use updated packages.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> random
<span class="hljs-keyword">import</span> textwrap
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime

<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># Google GenAI for embeddings</span>
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai.types <span class="hljs-keyword">import</span> EmbedContentConfig

<span class="hljs-comment"># LangExtract for structured label extraction</span>
<span class="hljs-keyword">import</span> langextract <span class="hljs-keyword">as</span> lx

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All imports successful!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>All imports successful!</p>
<h2 id="Connecting-to-Milvus-Vector-database" class="common-anchor-header">Connecting to Milvus: Vector database<button data-href="#Connecting-to-Milvus-Vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Now, that we have our environment ready, we need to connect to Milvus, our vector database.</p>
<p>For this demo, we’ll run Milvus standalone using Docker. It’s the simplest way to get started, and it’s perfect for development and testing. In production, you might want to use Milvus Cluster for better scalability and reliability.</p>
<p>Ensure Milvus is running via Docker, Start it with:</p>
<p>docker-compose up -d</p>
<p>Once it’s running, we can connect to it and start building our search pipeline. For more information refer to <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Milvus Standalone Docker docs</a>.</p>
<pre><code translate="no"><span class="hljs-comment"># Connect to Milvus (running in Docker)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Connected to Milvus successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Connected to Milvus successfully!</p>
<h2 id="Creating-Real-World-Product-Dataset" class="common-anchor-header">Creating Real World Product Dataset<button data-href="#Creating-Real-World-Product-Dataset" class="anchor-icon" translate="no">
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
    </button></h2><p>To demonstrate our search pipeline, we need realistic product descriptions data that mirror what you’d find in a real e-commerce system. Each product needs both unstructured text (the description) and structured labels (category, brand, price, rating, stock status).</p>
<h3 id="Data-Model" class="common-anchor-header">Data Model</h3><p>When a customer searches for “comfortable running shoes,” they’re not just looking at the text description. They’re also considering the price, checking if it’s in stock, looking at the brand reputation, and seeing the rating. Our data model needs to capture all of this, which later on make the filtering and search more effective.</p>
<pre><code translate="no">Product Data Structure:
┌─────────────────────────────────────────────────────────────┐
│ Unstructured Text (for semantic search):                    │
│ &quot;TechPro Wireless Bluetooth headphones with active noise    │
│  cancellation, 30-hour battery life, premium sound quality. │
│  Price: $149. Rating: 4.5/5. In Stock.&quot;                     │
├─────────────────────────────────────────────────────────────┤
│ Structured Labels (extracted by LangExtract):               │
│ • category: &quot;Electronics&quot;      (VARCHAR/enum)               │
│ • brand: &quot;TechPro&quot;             (VARCHAR/enum)               │
│ • price: 149.0                 (DOUBLE)                     │
│ • rating: 4.5                  (DOUBLE)                     │
│ • stock_status: &quot;In Stock&quot;     (VARCHAR/enum)               │
└─────────────────────────────────────────────────────────────┘
</code></pre>
<p>This filtered ANN search approach allows us to:</p>
<ul>
<li><p><strong>Search semantically</strong> using the text description</p></li>
<li><p><strong>Filter precisely</strong> using structured attributes</p></li>
<li><p><strong>Combine both</strong> for the best results</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># List of product descriptions </span>
<span class="hljs-comment"># LangExtract will extract category, brand, price, rating, and stock_status from these</span>
PRODUCT_DESCRIPTIONS = [<span class="hljs-string">&quot;TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: <span class="hljs-variable">$149</span>. Rating: 4.5/5. In Stock.&quot;</span>, 
                        <span class="hljs-string">&quot;SmartGadget Smartwatch with fitness tracking, heart rate monitor, GPS, and water resistance up to 50 meters. Currently <span class="hljs-variable">$199</span>. Customer rating: 4.8 stars. Available now.&quot;</span>,
                        <span class="hljs-string">&quot;ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in. On sale for <span class="hljs-variable">$299</span>. Rated 4.2/5. Low Stock - only 3 left!&quot;</span>,
                        <span class="hljs-string">&quot;DigitalPlus Laptop computer with fast processor, 16GB RAM, SSD storage, perfect for work and gaming. Price: <span class="hljs-variable">$899</span>. Rating: 4.7/5. In Stock.&quot;</span>, 
                        <span class="hljs-string">&quot;TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just <span class="hljs-variable">$29</span>.99. 4.0 star rating. In Stock.&quot;</span>, 
                        <span class="hljs-string">&quot;StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: <span class="hljs-variable">$24</span>.99. Rating: 4.3/5. In Stock.&quot;</span>,
                        <span class="hljs-string">&quot;FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. <span class="hljs-variable">$89</span>. Customer rating: 4.6 stars. In Stock.&quot;</span>, 
                        <span class="hljs-string">&quot;StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. <span class="hljs-variable">$39</span>.99. Rating: 4.5/5. In Stock.&quot;</span>,  
                        <span class="hljs-string">&quot;LiteraryPress Mystery thriller novel, bestselling author, paperback edition. <span class="hljs-variable">$12</span>.99. 4.3 star rating. In Stock.&quot;</span>,  
                       ]

<span class="hljs-built_in">print</span>(f<span class="hljs-string">&quot;Loaded {len(PRODUCT_DESCRIPTIONS)} product descriptions&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSample product description:&quot;</span>)
<span class="hljs-built_in">print</span>(PRODUCT_DESCRIPTIONS[0])
<button class="copy-code-btn"></button></code></pre>
<p>Loaded 9 product descriptions</p>
<p>Sample product description:
TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.</p>
<h2 id="Extracting-Structure-from-Chaos" class="common-anchor-header">Extracting Structure from Chaos<button data-href="#Extracting-Structure-from-Chaos" class="anchor-icon" translate="no">
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
    </button></h2><p>In a real-world scenario, you might have product descriptions that are completely unstructured. A product listing might say “Premium wireless headphones with active noise cancellation, 30-hour battery, perfect for travel” without explicitly listing category, price range, or warranty information.</p>
<h3 id="Label-Extraction-with-LangExtract" class="common-anchor-header">Label Extraction with LangExtract</h3><p>Label extraction is the process of automatically pulling structured information from unstructured text which might not be provided by the seller. This will help us read through product descriptions and fill out the key features which we might need for semantic search.</p>
<p><strong>Example: From Unstructured to Structured</strong></p>
<pre><code translate="no">Input (Unstructured Text):
┌─────────────────────────────────────────────────────────────┐
│ &quot;TechPro Wireless Bluetooth headphones with active noise    │
│  cancellation, 30-hour battery life, premium sound quality. │
│  Price: $149. Rating: 4.5/5. In Stock.&quot;                     │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
            [LangExtract Processing]
                        │
                        ▼
Output (Structured Labels):
┌─────────────────────────────────────────────────────────────┐
│ {                                                           │
│   &quot;category&quot;: &quot;Electronics&quot;,                                │
│   &quot;brand&quot;: &quot;TechPro&quot;,                                       │
│   &quot;price&quot;: 149.0,                                           │
│   &quot;rating&quot;: 4.5,                                            │
│   &quot;stock_status&quot;: &quot;In Stock&quot;                                │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
</code></pre>
<p>We’ll use <strong>LangExtract</strong> from Google to extract labels from product descriptions. LangExtract is specifically designed for extracting structured information from unstructured text using LLMs, with precise source grounding and reliable structured outputs.</p>
<p><strong>API Key Setup:</strong></p>
<p>For cloud models like Gemini, you’ll need to set up an API key. This same key is used for embeddings, LangExtract, and RAG:</p>
<p><em>#Environment variable</em></p>
<p>export GEMINI_API_KEY<strong>=</strong>“your-api-key-here”</p>
<p>Get your API key from <a href="https://aistudio.google.com/app/apikey">AI Studio</a> for Gemini models. This single API key works across all components of our pipeline.</p>
<h3 id="Preparing-for-Label-Extraction" class="common-anchor-header">Preparing for Label Extraction</h3><p>Before we start extracting labels from our product descriptions, let’s suppress some non-critical warning messages from LangExtract. These warnings are about fuzzy text matching in prompts and don’t affect functionality, but they can clutter our output.</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Gemini embedding model</span>
genai_client = genai.Client()

EMBEDDING_MODEL = <span class="hljs-string">&quot;gemini-embedding-001&quot;</span>
EMBEDDING_DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># Dimension for gemini-embedding-001</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Gemini embedding model configured!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Gemini embedding model configured!</p>
<pre><code translate="no"><span class="hljs-comment"># Define the extraction prompt </span>
EXTRACTION_PROMPT = textwrap.dedent(
    <span class="hljs-string">&quot;&quot;&quot;\
    Extract structured information from product descriptions.
    Extract: category type, brand name, price value, rating value, stock status, features list, warranty info, and price range.

    For the brand: Extract the brand name that appears at the beginning of the description.
    For price: Extract just the numeric value (e.g., 149 from &quot;$149&quot;)
    For rating: Extract just the numeric value (e.g., 4.5 from &quot;4.5/5&quot;)
    For category: Identify the general product type (Electronics, Clothing, Books, etc.)
    For stock: Extract &quot;In Stock&quot;, &quot;Low Stock&quot;, or &quot;Out of Stock&quot;
    For features: Extract key product features as a comma-separated list (e.g., &quot;wireless, noise_cancellation, long_battery&quot;)
    For has_warranty: Determine if product has warranty (true/false based on context or price - electronics &gt;$100 likely have warranty)
    For price_range: Categorize as &quot;budget&quot; (&lt;$50), &quot;mid&quot; ($50-$150), or &quot;premium&quot; (&gt;$150)
    &quot;&quot;&quot;</span>
    )

<span class="hljs-comment"># Provide examples with text span matching</span>
EXTRACTION_EXAMPLES = [
    lx.data.ExampleData(
        text=(
            <span class="hljs-string">&quot;TechPro Wireless Bluetooth headphones with active noise cancellation, &quot;</span>
            <span class="hljs-string">&quot;30-hour battery life, premium sound quality. Price: $149.7 &quot;</span>
            <span class="hljs-string">&quot;Rating: 4.5/5. In Stock.&quot;</span>
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;category&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;headphones&quot;</span>,
                attributes={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;Electronics&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;brand&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality&quot;</span>,
                attributes={<span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;TechPro&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;149.7&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">149.7</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;rating&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;4.5&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">4.5</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;stock_status&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;In Stock&quot;</span>,
                attributes={<span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;In Stock&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;features&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality&quot;</span>,
                attributes={<span class="hljs-string">&quot;list&quot;</span>: <span class="hljs-string">&quot;wireless, bluetooth, noise_cancellation, long_battery, premium_sound&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;has_warranty&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;TechPro Wireless Bluetooth headphones&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-literal">True</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price_range&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;149.7&quot;</span>,
                attributes={<span class="hljs-string">&quot;range&quot;</span>: <span class="hljs-string">&quot;mid&quot;</span>}
            ),
        ]
    ),
    lx.data.ExampleData(
        text=(
            <span class="hljs-string">&quot;StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors &quot;</span>
            <span class="hljs-string">&quot;and sizes. Price: $24.99. Rating: 4.3/5. In Stock.&quot;</span>
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;category&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;t-shirt&quot;</span>,
                attributes={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;Clothing&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;brand&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes&quot;</span>,
                attributes={<span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;StyleCo&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;24.99&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">24.99</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;rating&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;4.3&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">4.3</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;stock_status&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;In Stock&quot;</span>,
                attributes={<span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;In Stock&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;features&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes&quot;</span>,
                attributes={<span class="hljs-string">&quot;list&quot;</span>: <span class="hljs-string">&quot;comfortable, cotton, breathable, multiple_colors&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;has_warranty&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;t-shirt&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-literal">False</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price_range&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;24.99&quot;</span>,
                attributes={<span class="hljs-string">&quot;range&quot;</span>: <span class="hljs-string">&quot;budget&quot;</span>}
            ),
        ]
    ),
    lx.data.ExampleData(
        text=(
            <span class="hljs-string">&quot;ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in. &quot;</span>
            <span class="hljs-string">&quot;On sale for $299. Rated 4.2/5. Low Stock - only 3 left!&quot;</span>
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;category&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;Smart TV&quot;</span>,
                attributes={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;Electronics&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;brand&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in&quot;</span>,
                attributes={<span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;ElectroMax&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;299&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">299</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;rating&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;4.2&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-number">4.2</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;stock_status&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;Low Stock&quot;</span>,
                attributes={<span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;Low Stock&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;features&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in&quot;</span>,
                attributes={<span class="hljs-string">&quot;list&quot;</span>: <span class="hljs-string">&quot;4k, hd, hdr, voice_control, streaming, smart_tv&quot;</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;has_warranty&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;Smart TV&quot;</span>,
                attributes={<span class="hljs-string">&quot;value&quot;</span>: <span class="hljs-literal">True</span>}
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;price_range&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;299&quot;</span>,
                attributes={<span class="hljs-string">&quot;range&quot;</span>: <span class="hljs-string">&quot;premium&quot;</span>}
            ),
        ]
    ),
]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_labels_with_langextract</span>(<span class="hljs-params">
    text: <span class="hljs-built_in">str</span>, 
    model_id: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span> 
</span>) -&gt; <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]:
    <span class="hljs-string">&quot;&quot;&quot;
    Extract structured labels from product text using LangExtract.

    Args:
        text: Product description text.
        model_id: LangExtract model to use (default: &quot;gemini-2.5-flash-lite&quot;).

    Returns:
        Dictionary with extracted labels: category, brand, price, rating, stock_status.
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if API key is set</span>
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> os.environ <span class="hljs-keyword">and</span> <span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> os.environ:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️  Warning: GEMINI_API_KEY not found in environment.&quot;</span>)
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   Get your API key from https://aistudio.google.com/app/apikey&quot;</span>)
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   Falling back to default values.&quot;</span>)

            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
                <span class="hljs-string">&quot;brand&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
                <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-number">0</span>,
                <span class="hljs-string">&quot;rating&quot;</span>: <span class="hljs-number">0</span>,
                <span class="hljs-string">&quot;stock_status&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
                <span class="hljs-string">&quot;features&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
                <span class="hljs-string">&quot;has_warranty&quot;</span>: <span class="hljs-literal">False</span>,
                <span class="hljs-string">&quot;price_range&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>
            }

        <span class="hljs-comment"># Run LangExtract extraction</span>
        result = lx.extract(
            text_or_documents=text,
            prompt_description=EXTRACTION_PROMPT,
            examples=EXTRACTION_EXAMPLES,
            model_id=model_id,
        )

        <span class="hljs-comment"># Defaults</span>
        category = <span class="hljs-string">&quot;Unknown&quot;</span>
        brand = <span class="hljs-string">&quot;Unknown&quot;</span>
        price = <span class="hljs-number">0</span>
        rating = <span class="hljs-number">0</span>
        stock_status = <span class="hljs-string">&quot;Unknown&quot;</span>
        features = <span class="hljs-string">&quot;&quot;</span>
        has_warranty = <span class="hljs-literal">False</span>
        price_range = <span class="hljs-string">&quot;Unknown&quot;</span>

        <span class="hljs-comment"># Parse extraction results</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(result, <span class="hljs-string">&quot;extractions&quot;</span>) <span class="hljs-keyword">and</span> result.extractions:
            <span class="hljs-keyword">for</span> extraction <span class="hljs-keyword">in</span> result.extractions:
                <span class="hljs-keyword">if</span> extraction.extraction_class == <span class="hljs-string">&quot;category&quot;</span>:
                    category = extraction.attributes.get(<span class="hljs-string">&quot;type&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>)

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;brand&quot;</span>:
                    brand = extraction.attributes.get(<span class="hljs-string">&quot;name&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>)

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;price&quot;</span>:
                    price_value = extraction.attributes.get(<span class="hljs-string">&quot;value&quot;</span>, <span class="hljs-number">0</span>)
                    <span class="hljs-comment"># Handle both numeric and string values, keep as float for decimal prices</span>
                    <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(price_value, (<span class="hljs-built_in">int</span>, <span class="hljs-built_in">float</span>)):
                        price = <span class="hljs-built_in">float</span>(price_value)
                    <span class="hljs-keyword">elif</span> <span class="hljs-built_in">isinstance</span>(price_value, <span class="hljs-built_in">str</span>):
                        <span class="hljs-keyword">try</span>:
                            <span class="hljs-comment"># Remove $ and commas, then convert</span>
                            clean_price = price_value.replace(<span class="hljs-string">&#x27;$&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>).replace(<span class="hljs-string">&#x27;,&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
                            price = <span class="hljs-built_in">float</span>(clean_price)
                        <span class="hljs-keyword">except</span>:
                            price = <span class="hljs-number">0.0</span>

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;rating&quot;</span>:
                    rating_value = extraction.attributes.get(<span class="hljs-string">&quot;value&quot;</span>, <span class="hljs-number">0</span>)
                    <span class="hljs-comment"># Handle both numeric and string values, keep as float for decimal ratings</span>
                    <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(rating_value, (<span class="hljs-built_in">int</span>, <span class="hljs-built_in">float</span>)):
                        rating = <span class="hljs-built_in">float</span>(rating_value)
                    <span class="hljs-keyword">elif</span> <span class="hljs-built_in">isinstance</span>(rating_value, <span class="hljs-built_in">str</span>):
                        <span class="hljs-keyword">try</span>:
                            rating = <span class="hljs-built_in">float</span>(rating_value)
                        <span class="hljs-keyword">except</span>:
                            rating = <span class="hljs-number">0.0</span>

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;stock_status&quot;</span>:
                    stock_status = extraction.attributes.get(<span class="hljs-string">&quot;status&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>)

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;features&quot;</span>:
                    features = extraction.attributes.get(<span class="hljs-string">&quot;list&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;has_warranty&quot;</span>:
                    warranty_value = extraction.attributes.get(<span class="hljs-string">&quot;value&quot;</span>, <span class="hljs-literal">False</span>)
                    <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(warranty_value, <span class="hljs-built_in">bool</span>):
                        has_warranty = warranty_value
                    <span class="hljs-keyword">elif</span> <span class="hljs-built_in">isinstance</span>(warranty_value, <span class="hljs-built_in">str</span>):
                        has_warranty = warranty_value.lower() <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;true&quot;</span>, <span class="hljs-string">&quot;yes&quot;</span>, <span class="hljs-string">&quot;1&quot;</span>]

                <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;price_range&quot;</span>:
                    price_range = extraction.attributes.get(<span class="hljs-string">&quot;range&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>)

        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;category&quot;</span>: category,
            <span class="hljs-string">&quot;brand&quot;</span>: brand,
            <span class="hljs-string">&quot;price&quot;</span>: price,
            <span class="hljs-string">&quot;rating&quot;</span>: rating,
            <span class="hljs-string">&quot;stock_status&quot;</span>: stock_status,
            <span class="hljs-string">&quot;features&quot;</span>: features,
            <span class="hljs-string">&quot;has_warranty&quot;</span>: has_warranty,
            <span class="hljs-string">&quot;price_range&quot;</span>: price_range,
        }

    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️  Error extracting labels with LangExtract: <span class="hljs-subst">{e}</span>&quot;</span>)

        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
            <span class="hljs-string">&quot;brand&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
            <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-number">0</span>,
            <span class="hljs-string">&quot;rating&quot;</span>: <span class="hljs-number">0</span>,
            <span class="hljs-string">&quot;stock_status&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>,
            <span class="hljs-string">&quot;features&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
            <span class="hljs-string">&quot;has_warranty&quot;</span>: <span class="hljs-literal">False</span>,
            <span class="hljs-string">&quot;price_range&quot;</span>: <span class="hljs-string">&quot;Unknown&quot;</span>
        }


<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Label extraction function with LangExtract defined!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Label extraction function with LangExtract defined!</p>
<h2 id="Building-Our-Search-Index-Creating-the-Milvus-Collection" class="common-anchor-header">Building Our Search Index: Creating the Milvus Collection<button data-href="#Building-Our-Search-Index-Creating-the-Milvus-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Now we’ll create a Milvus collection that stores both vector embeddings and structured metadata (labels). It will act as a warehouse building where items are organized both by types (semantic similarity) and by specific attributes like price, manufacturing date , and brands (structured labels). You can search by semantic similarity and filter by structured attributes in a single query. This is what makes our filtered ANN approach possible in Milvus.</p>
<pre><code translate="no">Milvus Collection Structure:
┌─────────────────────────────────────────────────────────────┐
│ Collection: &quot;product_search&quot;                                │
├─────────────────────────────────────────────────────────────┤
│ Fields:                                                     │
│                                                             │
│  📝 id (INT64) - Primary key                                │
│  📄 text (VARCHAR) - Product description                    │
│  🔢 embedding (FLOAT_VECTOR[3072]) - Semantic vector        │
│  🏷️  category (VARCHAR) - Product category                  │
│  🏷️  brand (VARCHAR) - Brand name                           │
│  🏷️  price (DOUBLE) - Price in dollars                      │
│  🏷️  rating (DOUBLE) - Rating (1-5)                         │
│  🏷️  stock_status (VARCHAR) - Stock availability            │
└─────────────────────────────────────────────────────────────┘
</code></pre>
<pre><code translate="no"><span class="hljs-comment"># Collection name</span>
COLLECTION_NAME = <span class="hljs-string">&quot;product_search&quot;</span>

<span class="hljs-comment"># Drop collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Create the collection schema</span>
schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Define the schema fields</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)  <span class="hljs-comment"># gemini-embedding-001</span>
schema.add_field(field_name=<span class="hljs-string">&quot;category&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;brand&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;price&quot;</span>, datatype=DataType.DOUBLE)
schema.add_field(field_name=<span class="hljs-string">&quot;rating&quot;</span>, datatype=DataType.DOUBLE)  <span class="hljs-comment"># supports decimal ratings like 4.5</span>
schema.add_field(field_name=<span class="hljs-string">&quot;stock_status&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;features&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)  <span class="hljs-comment"># comma-separated feature list</span>
schema.add_field(field_name=<span class="hljs-string">&quot;has_warranty&quot;</span>, datatype=DataType.BOOL)
schema.add_field(field_name=<span class="hljs-string">&quot;price_range&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)  <span class="hljs-comment"># budget, mid, premium</span>

<span class="hljs-comment"># Create the collection</span>
collection = Collection(
    name=COLLECTION_NAME,
    schema=schema
)

<span class="hljs-comment"># Create index on the embedding field for faster searches</span>
index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>},
)
milvus_client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Dropped existing collection: product_search
Collection ‘product_search’ created successfully!</p>
<pre><code translate="no"><span class="hljs-comment"># Suppress absl prompt alignment warnings (non-critical fuzzy match warnings)</span>
<span class="hljs-keyword">import</span> warnings
<span class="hljs-keyword">import</span> logging
warnings.filterwarnings(<span class="hljs-string">&quot;ignore&quot;</span>, message=<span class="hljs-string">&quot;.*Prompt alignment: non-exact match.*&quot;</span>, category=UserWarning)
logging.getLogger(<span class="hljs-string">&quot;absl&quot;</span>).setLevel(logging.ERROR)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Extract structured labels from descriptions using LangExtract</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">prepare_data_for_insertion</span>(<span class="hljs-params">
    product_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    genai_client,
    embedding_model: <span class="hljs-built_in">str</span>,
    embedding_dim: <span class="hljs-built_in">int</span>
</span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-type">List</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Prepares products for insertion into Milvus by extracting labels from descriptions.&quot;&quot;&quot;</span>
    
    ids = []
    texts = []
    embeddings = []
    categories = []
    brands = []
    prices = []
    ratings = []
    stock_statuses = []
    features_list = []
    warranties = []
    price_ranges = []

    <span class="hljs-comment"># Extract structured labels from each description using LangExtract</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Extracting structured labels from product descriptions using LangExtract...&quot;</span>)

    products = []
    <span class="hljs-keyword">for</span> idx, description <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(product_descriptions):

        <span class="hljs-comment"># Extract labels using LangExtract</span>
        labels = extract_labels_with_langextract(description)

        <span class="hljs-comment"># Create product dict with extracted labels</span>
        product = {
            <span class="hljs-string">&quot;id&quot;</span>: idx + <span class="hljs-number">1</span>,
            <span class="hljs-string">&quot;text&quot;</span>: description,
            <span class="hljs-string">&quot;category&quot;</span>: labels.get(<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>),
            <span class="hljs-string">&quot;brand&quot;</span>: labels.get(<span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>),
            <span class="hljs-string">&quot;price&quot;</span>: labels.get(<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-number">0</span>),
            <span class="hljs-string">&quot;rating&quot;</span>: labels.get(<span class="hljs-string">&quot;rating&quot;</span>, <span class="hljs-number">0</span>),
            <span class="hljs-string">&quot;stock_status&quot;</span>: labels.get(<span class="hljs-string">&quot;stock_status&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>),
            <span class="hljs-string">&quot;features&quot;</span>: labels.get(<span class="hljs-string">&quot;features&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
            <span class="hljs-string">&quot;has_warranty&quot;</span>: labels.get(<span class="hljs-string">&quot;has_warranty&quot;</span>, <span class="hljs-literal">False</span>),
            <span class="hljs-string">&quot;price_range&quot;</span>: labels.get(<span class="hljs-string">&quot;price_range&quot;</span>, <span class="hljs-string">&quot;Unknown&quot;</span>)
        }
        products.append(product)

        <span class="hljs-keyword">if</span> (idx + <span class="hljs-number">1</span>) % <span class="hljs-number">10</span> == <span class="hljs-number">0</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Processed <span class="hljs-subst">{idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(product_descriptions)}</span> products...&quot;</span>)

    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nExtracted labels from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSample extracted product:&quot;</span>)
    <span class="hljs-built_in">print</span>(json.dumps(products[<span class="hljs-number">0</span>], indent=<span class="hljs-number">2</span>))

    <span class="hljs-comment"># Get all the text descriptions for embedding generation</span>
    product_texts = [p[<span class="hljs-string">&quot;text&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]

    <span class="hljs-comment"># Generate embeddings using Gemini API</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nGenerating embeddings...&quot;</span>)
    embedding_response = genai_client.models.embed_content(
        model=embedding_model,
        contents=product_texts,
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>,
            output_dimensionality=embedding_dim,
        ),
    )

    <span class="hljs-comment"># Extract embeddings from response</span>
    product_embeddings = [emb.values <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> embedding_response.embeddings]

    <span class="hljs-comment"># Build arrays</span>
    <span class="hljs-keyword">for</span> i, product <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
        ids.append(product[<span class="hljs-string">&quot;id&quot;</span>])
        texts.append(product[<span class="hljs-string">&quot;text&quot;</span>])
        embeddings.append(product_embeddings[i])
        categories.append(product[<span class="hljs-string">&quot;category&quot;</span>])
        brands.append(product[<span class="hljs-string">&quot;brand&quot;</span>])
        prices.append(product[<span class="hljs-string">&quot;price&quot;</span>])
        ratings.append(product[<span class="hljs-string">&quot;rating&quot;</span>])
        stock_statuses.append(product[<span class="hljs-string">&quot;stock_status&quot;</span>])
        features_list.append(product[<span class="hljs-string">&quot;features&quot;</span>])
        warranties.append(product[<span class="hljs-string">&quot;has_warranty&quot;</span>])
        price_ranges.append(product[<span class="hljs-string">&quot;price_range&quot;</span>])

    <span class="hljs-keyword">return</span> [
        ids,
        texts,
        embeddings,
        categories,
        brands,
        prices,
        ratings,
        stock_statuses,
        features_list,
        warranties,
        price_ranges
    ]


<span class="hljs-comment"># Prepare the data by extracting labels from descriptions</span>
milvus_client.insert(collection_name=COLLECTION_NAME, data=rows_to_insert)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nInserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(PRODUCT_DESCRIPTIONS)}</span> products into Milvus!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>/Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv/lib/python3.13/site-packages/langextract/factory.py:129: UserWarning: Multiple API keys detected in environment: GEMINI_API_KEY, LANGEXTRACT_API_KEY. Using GEMINI_API_KEY and ignoring others.
model = _create_model_with_schema(</p>
<p>Extracting structured labels from product descriptions using LangExtract…</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=152 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=167 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=141 chars, processed=0 chars:  [00:03]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=138 chars, processed=0 chars:  [00:01]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=125 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=134 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=135 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=114 chars, processed=0 chars:  [00:02]</p>
<p><strong>LangExtract</strong>: model=gemini-2.5-flash-lite, current=111 chars, processed=0 chars:  [00:02]</p>
<p>Extracted labels from 9 products</p>
<p>Sample extracted product:
{
&quot;id&quot;: 1,
&quot;text&quot;: &quot;TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.&quot;,
&quot;category&quot;: &quot;Electronics&quot;,
&quot;brand&quot;: &quot;TechPro&quot;,
&quot;price&quot;: 149.0,
&quot;rating&quot;: 4.5,
&quot;stock_status&quot;: &quot;In Stock&quot;,
&quot;features&quot;: &quot;wireless, bluetooth, noise_cancellation, long_battery, premium_sound&quot;,
&quot;has_warranty&quot;: true,
&quot;price_range&quot;: “mid”
}</p>
<p>Generating embeddings…</p>
<p>Inserted 9 products into Milvus!</p>
<h2 id="Semantic-+-Structured-Filtering" class="common-anchor-header">Semantic + Structured Filtering<button data-href="#Semantic-+-Structured-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>This is where semantic + structured filtering comes together. We’ve set up our data, created our embeddings, and stored everything in Milvus. Now we need to build the search function that combines semantic understanding with label filtering.</p>
<h3 id="How-Our-Search-Function-Works" class="common-anchor-header">How Our Search Function Works</h3><p>Think of this like asking a knowledgeable salesperson: “Show me comfortable running shoes under $100 that are in stock.” They understand what “comfortable” means (semantic), and they can check the price and stock status (structured filters). Our search function does the same thing, but at scale.</p>
<pre><code translate="no">Search Flow:
┌─────────────────────────────────────────────────────────────┐
│ User Query: &quot;comfortable running shoes under $100&quot;          │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ Step 1: Generate Query   │  │ Step 2: Build Filters    │
│ Embedding                │  │                          │
│                          │  │ • price &lt;= 100           │
│ &quot;comfortable running     │  │ • category = &quot;Clothing&quot;  │
│  shoes&quot; → [0.23, 0.45,   │  │ • stock_status = &quot;In     │
│           0.12, ...]     │  │   Stock&quot;                 │
└────────────┬─────────────┘  └────────────┬─────────────┘
             │                              │
             └──────────────┬───────────────┘
                            ▼
            ┌───────────────────────────────┐
            │ Step 3: Milvus Hybrid Search  │
            │                               │
            │ • Semantic similarity search  │
            │ • Apply structured filters    │
            │ • Return top-k results        │
            └───────────────┬───────────────┘
                            ▼
            ┌───────────────────────────────┐
            │ Filtered, Relevant Results    │
            └───────────────────────────────┘
</code></pre>
<p><strong>Example Query Breakdown:</strong></p>
<p>Query: “wireless headphones with noise cancellation”</p>
<p>Filters: max_price=150, min_rating=4, stock_status=&quot;In Stock&quot;</p>
<p>Processing:</p>
<ol>
<li><p>Convert query to embedding vector</p></li>
<li><p>Build filter expression: price &lt;= 150 AND rating &gt;= 4 AND stock_status == “In Stock”</p></li>
<li><p>Search Milvus with both semantic similarity and filters</p></li>
<li><p>Return ranked results that match both criteria</p></li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Main search function - combines semantic search with filters</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">semantic_search_with_filters</span>(<span class="hljs-params">
    query: <span class="hljs-built_in">str</span>,
    milvus_client: MilvusClient,
    collection_name: <span class="hljs-built_in">str</span>,
    genai_client,
    embedding_model: <span class="hljs-built_in">str</span>,
    embedding_dim: <span class="hljs-built_in">int</span>,
    top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>,
    category: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    brand: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    max_price: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    min_price: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    min_rating: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    stock_status: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>
</span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;
    Does semantic search with optional filters on structured fields.
    Returns list of products matching the query.
    &quot;&quot;&quot;</span>
    
    <span class="hljs-comment"># First, convert the query to an embedding vector using Gemini</span>
    query_embedding_response = genai_client.models.embed_content(
        model=embedding_model,
        contents=[query],
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
            output_dimensionality=embedding_dim,
        ),
    )
    query_vec = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values
    
    <span class="hljs-comment"># Build up the filter expression piece by piece</span>
    filters = []
    
    <span class="hljs-keyword">if</span> category:
        filters.append(<span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{category}</span>&quot;&#x27;</span>)
    
    <span class="hljs-keyword">if</span> brand:
        filters.append(<span class="hljs-string">f&#x27;brand == &quot;<span class="hljs-subst">{brand}</span>&quot;&#x27;</span>)
    
    <span class="hljs-comment"># Handle price range filters</span>
    <span class="hljs-keyword">if</span> min_price <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        filters.append(<span class="hljs-string">f&quot;price &gt;= <span class="hljs-subst">{min_price}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_price <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        filters.append(<span class="hljs-string">f&quot;price &lt;= <span class="hljs-subst">{max_price}</span>&quot;</span>)
    
    <span class="hljs-keyword">if</span> min_rating <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        filters.append(<span class="hljs-string">f&quot;rating &gt;= <span class="hljs-subst">{min_rating}</span>&quot;</span>)
    
    <span class="hljs-keyword">if</span> stock_status:
        filters.append(<span class="hljs-string">f&#x27;stock_status == &quot;<span class="hljs-subst">{stock_status}</span>&quot;&#x27;</span>)
    
    <span class="hljs-comment"># Join all filters with AND - could also do OR if needed</span>
    filter_str = <span class="hljs-string">&quot; and &quot;</span>.join(filters) <span class="hljs-keyword">if</span> filters <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>
    
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Try search with output_fields first</span>
        search_results = milvus_client.search(
            data=[query_vec],
            anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
            param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
            limit=top_k,
            <span class="hljs-built_in">filter</span>=filter_str,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>, <span class="hljs-string">&quot;stock_status&quot;</span>, <span class="hljs-string">&quot;features&quot;</span>, <span class="hljs-string">&quot;has_warranty&quot;</span>, <span class="hljs-string">&quot;price_range&quot;</span>]
        )
        
        <span class="hljs-comment"># Format the results into a nicer structure</span>
        output = []
        <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_results:
            <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:
                output.append({
                    <span class="hljs-string">&quot;id&quot;</span>: hit.<span class="hljs-built_in">id</span>,
                    <span class="hljs-string">&quot;score&quot;</span>: hit.distance,
                    <span class="hljs-string">&quot;text&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
                    <span class="hljs-string">&quot;category&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;category&quot;</span>),
                    <span class="hljs-string">&quot;brand&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;brand&quot;</span>),
                    <span class="hljs-string">&quot;price&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;price&quot;</span>),
                    <span class="hljs-string">&quot;rating&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;rating&quot;</span>),
                    <span class="hljs-string">&quot;stock_status&quot;</span>: hit.entity.get(<span class="hljs-string">&quot;stock_status&quot;</span>)
                })
        
        <span class="hljs-keyword">return</span> output
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-comment"># Handle Milvus compatibility issue: &quot;Unsupported field type: 0&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;Unsupported field type&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;field type: 0&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e):
            <span class="hljs-comment"># Fallback: search without output_fields, then query entities separately</span>
            search_results = client.search(
                data=[query_vec],
                anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
                param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
                limit=top_k,
                <span class="hljs-built_in">filter</span>=filter_str
            )
            
            <span class="hljs-comment"># Extract entity IDs from search results</span>
            entity_ids = []
            scores_map = {}
            <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_results:
                <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:
                    entity_ids.append(hit.<span class="hljs-built_in">id</span>)
                    scores_map[hit.<span class="hljs-built_in">id</span>] = hit.distance
            
            <span class="hljs-comment"># Query entities by IDs to get the field data</span>
            <span class="hljs-keyword">if</span> entity_ids:
                <span class="hljs-comment"># Format IDs for the query expression (Milvus uses parentheses for &#x27;in&#x27;)</span>
                ids_str = <span class="hljs-string">&quot;(&quot;</span> + <span class="hljs-string">&quot;,&quot;</span>.join(<span class="hljs-built_in">str</span>(<span class="hljs-built_in">id</span>) <span class="hljs-keyword">for</span> <span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> entity_ids) + <span class="hljs-string">&quot;)&quot;</span>
                entities = client.query(
                    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&quot;id in <span class="hljs-subst">{ids_str}</span>&quot;</span>,
                    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>, <span class="hljs-string">&quot;stock_status&quot;</span>, <span class="hljs-string">&quot;features&quot;</span>, <span class="hljs-string">&quot;has_warranty&quot;</span>, <span class="hljs-string">&quot;price_range&quot;</span>]
                )
                
                <span class="hljs-comment"># Create a mapping of id to entity data</span>
                entity_map = {e[<span class="hljs-string">&quot;id&quot;</span>]: e <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> entities}
                
                <span class="hljs-comment"># Format results with entity data, preserving search order</span>
                output = []
                <span class="hljs-keyword">for</span> entity_id <span class="hljs-keyword">in</span> entity_ids:
                    <span class="hljs-keyword">if</span> entity_id <span class="hljs-keyword">in</span> entity_map:
                        entity_data = entity_map[entity_id]
                        output.append({
                            <span class="hljs-string">&quot;id&quot;</span>: entity_id,
                            <span class="hljs-string">&quot;score&quot;</span>: scores_map.get(entity_id, <span class="hljs-number">0.0</span>),
                            <span class="hljs-string">&quot;text&quot;</span>: entity_data.get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
                            <span class="hljs-string">&quot;category&quot;</span>: entity_data.get(<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
                            <span class="hljs-string">&quot;brand&quot;</span>: entity_data.get(<span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
                            <span class="hljs-string">&quot;price&quot;</span>: entity_data.get(<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-number">0</span>),
                            <span class="hljs-string">&quot;rating&quot;</span>: entity_data.get(<span class="hljs-string">&quot;rating&quot;</span>, <span class="hljs-number">0</span>),
                            <span class="hljs-string">&quot;stock_status&quot;</span>: entity_data.get(<span class="hljs-string">&quot;stock_status&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
                            <span class="hljs-string">&quot;features&quot;</span>: entity_data.get(<span class="hljs-string">&quot;features&quot;</span>, <span class="hljs-string">&quot;&quot;</span>),
                            <span class="hljs-string">&quot;has_warranty&quot;</span>: entity_data.get(<span class="hljs-string">&quot;has_warranty&quot;</span>, <span class="hljs-literal">False</span>),
                            <span class="hljs-string">&quot;price_range&quot;</span>: entity_data.get(<span class="hljs-string">&quot;price_range&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                        })
                
                <span class="hljs-keyword">return</span> output
            <span class="hljs-keyword">else</span>:
                <span class="hljs-keyword">return</span> []
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Re-raise if it&#x27;s a different error</span>
            <span class="hljs-keyword">raise</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search function defined!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Search function defined!</p>
<h2 id="Putting-It-to-the-Test-Real-World-Search-Scenarios" class="common-anchor-header">Putting It to the Test: Real-World Search Scenarios<button data-href="#Putting-It-to-the-Test-Real-World-Search-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s test it with various queries that real customers might use. We’ll see how semantic search handles natural language, and how our filters ensure we get exactly what we’re looking for.</p>
<h3 id="Test-Scenarios-Well-Cover" class="common-anchor-header">Test Scenarios We’ll Cover</h3><p>Scenario 1: Simple Semantic Search</p>
<p>Query: “comfortable running shoes”</p>
<p>Filters: None</p>
<p>Expected: Find running shoes that are comfortable, regardless of price/brand</p>
<p>Scenario 2: Semantic + Price Filter</p>
<p>Query: “wireless headphones”</p>
<p>Filters: max_price=150</p>
<p>Expected: Wireless headphones under $150, ranked by relevance</p>
<p>Scenario 3: Complex Multi-Filter Search</p>
<p>Query: “smartwatch fitness tracking”</p>
<p>Filters: category=&quot;Electronics&quot;, min_rating=4, stock_status=&quot;In Stock&quot;</p>
<p>Expected: High-rated, in-stock electronics smartwatches with fitness features</p>
<pre><code translate="no"><span class="hljs-comment"># Example 1: Simple semantic search</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Example 1: Simple Semantic Search&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)

<span class="hljs-comment"># Try a simple query without any filters</span>
query1 = <span class="hljs-string">&quot;comfortable running shoes&quot;</span>
results1 = semantic_search_with_filters(query1, milvus_client, COLLECTION_NAME, genai_client, EMBEDDING_MODEL, EMBEDDING_DIM, top_k=<span class="hljs-number">5</span>)

<span class="hljs-comment"># Print out the results</span>
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results1, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{i}</span>. Score: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;score&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Product: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Category: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Brand: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;brand&#x27;</span>]}</span> | Price: $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | Rating: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>*&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Example 1: Simple Semantic Search</strong></p>
<ol>
<li><p>Score: 0.5381
Product: FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>89.</mn><mi>C</mi><mi>u</mi><mi>s</mi><mi>t</mi><mi>o</mi><mi>m</mi><mi>e</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.6</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>s</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>F</mi><mi>o</mi><mi>o</mi><mi>t</mi><mi>w</mi><mi>e</mi><mi>a</mi><mi>r</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>F</mi><mi>a</mi><mi>s</mi><mi>h</mi><mi>i</mi><mi>o</mi><mi>n</mi><mi>H</mi><mi>u</mi><mi>b</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">89. Customer rating: 4.6 stars. In Stock. Category: Footwear | Brand: FashionHub | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">89.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">u</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal">m</span><span class="mord mathnormal" style="margin-right:0.02778em;">err</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">4.6</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal">rs</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mord mathnormal">oo</span><span class="mord mathnormal" style="margin-right:0.02691em;">tw</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mord mathnormal">a</span><span class="mord mathnormal">s</span><span class="mord mathnormal">hi</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.08125em;">H</span><span class="mord mathnormal">u</span><span class="mord mathnormal">b</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>89.0 | Rating: 4.6*</p></li>
<li><p>Score: 0.7244
Product: StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>24.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.3</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>C</mi><mi>l</mi><mi>o</mi><mi>t</mi><mi>h</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>S</mi><mi>t</mi><mi>y</mi><mi>l</mi><mi>e</mi><mi>C</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">24.99. Rating: 4.3/5. In Stock. Category: Clothing | Brand: StyleCo | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">24.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.3/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">Cl</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal">hin</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">St</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">o</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>24.99 | Rating: 4.3*</p></li>
<li><p>Score: 0.7625
Product: StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>39.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>C</mi><mi>l</mi><mi>o</mi><mi>t</mi><mi>h</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>S</mi><mi>t</mi><mi>y</mi><mi>l</mi><mi>e</mi><mi>C</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">39.99. Rating: 4.5/5. In Stock. Category: Clothing | Brand: StyleCo | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">39.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">Cl</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal">hin</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">St</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">o</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>39.99 | Rating: 4.5*</p></li>
<li><p>Score: 0.8121
Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>29.99.4.0</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">29.99. 4.0 star rating. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">29.99.4.0</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">rr</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>29.99 | Rating: 4.0*</p></li>
<li><p>Score: 0.8175
Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>149.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">149. Rating: 4.5/5. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">149.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>149.0 | Rating: 4.5*</p></li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Example 2: Add a price filter</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Example 2: Semantic Search with Price Filter&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)

query2 = <span class="hljs-string">&quot;wireless headphones&quot;</span>
<span class="hljs-comment"># Only show results under $150</span>
results2 = semantic_search_with_filters(
    query2, 
    milvus_client,
    COLLECTION_NAME,
    genai_client, 
    EMBEDDING_MODEL, 
    EMBEDDING_DIM,
    top_k=<span class="hljs-number">5</span>,
    max_price=<span class="hljs-number">150</span>
)

<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results2, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{i}</span>. Score: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;score&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Product: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Category: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Brand: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;brand&#x27;</span>]}</span> | Price: $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | Rating: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>*&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Example 2: Semantic Search with Price Filter</strong></p>
<ol>
<li><p>Score: 0.6223
Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>149.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">149. Rating: 4.5/5. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">149.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>149.0 | Rating: 4.5*</p></li>
<li><p>Score: 0.7464
Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>29.99.4.0</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">29.99. 4.0 star rating. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">29.99.4.0</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">rr</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>29.99 | Rating: 4.0*</p></li>
<li><p>Score: 0.8313
Product: FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>89.</mn><mi>C</mi><mi>u</mi><mi>s</mi><mi>t</mi><mi>o</mi><mi>m</mi><mi>e</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.6</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>s</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>F</mi><mi>o</mi><mi>o</mi><mi>t</mi><mi>w</mi><mi>e</mi><mi>a</mi><mi>r</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>F</mi><mi>a</mi><mi>s</mi><mi>h</mi><mi>i</mi><mi>o</mi><mi>n</mi><mi>H</mi><mi>u</mi><mi>b</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">89. Customer rating: 4.6 stars. In Stock. Category: Footwear | Brand: FashionHub | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">89.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">u</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal">m</span><span class="mord mathnormal" style="margin-right:0.02778em;">err</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">4.6</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal">rs</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mord mathnormal">oo</span><span class="mord mathnormal" style="margin-right:0.02691em;">tw</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mord mathnormal">a</span><span class="mord mathnormal">s</span><span class="mord mathnormal">hi</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.08125em;">H</span><span class="mord mathnormal">u</span><span class="mord mathnormal">b</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>89.0 | Rating: 4.6*</p></li>
<li><p>Score: 0.8601
Product: StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>39.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>C</mi><mi>l</mi><mi>o</mi><mi>t</mi><mi>h</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>S</mi><mi>t</mi><mi>y</mi><mi>l</mi><mi>e</mi><mi>C</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">39.99. Rating: 4.5/5. In Stock. Category: Clothing | Brand: StyleCo | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">39.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">Cl</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal">hin</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">St</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">o</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>39.99 | Rating: 4.5*</p></li>
<li><p>Score: 0.8707
Product: StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>24.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.3</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>C</mi><mi>l</mi><mi>o</mi><mi>t</mi><mi>h</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>S</mi><mi>t</mi><mi>y</mi><mi>l</mi><mi>e</mi><mi>C</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">24.99. Rating: 4.3/5. In Stock. Category: Clothing | Brand: StyleCo | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">24.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.3/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">Cl</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal">hin</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">St</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">o</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>24.99 | Rating: 4.3*</p></li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Example 3: Multiple filters at once</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Example 3: Semantic Search with Multiple Filters&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)

query3 = <span class="hljs-string">&quot;smartwatch fitness tracking&quot;</span>
<span class="hljs-comment"># Combine multiple filters: category, rating, and stock status</span>
results3 = semantic_search_with_filters(
    query3, 
    milvus_client,
    COLLECTION_NAME,
    genai_client, 
    EMBEDDING_MODEL, 
    EMBEDDING_DIM,
    top_k=<span class="hljs-number">5</span>,
    category=<span class="hljs-string">&quot;Electronics&quot;</span>,
    min_rating=<span class="hljs-number">4</span>,
    stock_status=<span class="hljs-string">&quot;In Stock&quot;</span>
)

<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results3, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{i}</span>. Score: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;score&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Product: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Category: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Brand: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;brand&#x27;</span>]}</span> | Price: $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | Rating: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>* | Stock: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;stock_status&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Example 3: Semantic Search with Multiple Filters</strong></p>
<ol>
<li><p>Score: 0.5786
Product: SmartGadget Smartwatch with fitness tracking, heart rate monitor, GPS, and water resistance up to 50 meters. Currently <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>199.</mn><mi>C</mi><mi>u</mi><mi>s</mi><mi>t</mi><mi>o</mi><mi>m</mi><mi>e</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.8</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>s</mi><mi mathvariant="normal">.</mi><mi>A</mi><mi>v</mi><mi>a</mi><mi>i</mi><mi>l</mi><mi>a</mi><mi>b</mi><mi>l</mi><mi>e</mi><mi>n</mi><mi>o</mi><mi>w</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>S</mi><mi>m</mi><mi>a</mi><mi>r</mi><mi>t</mi><mi>G</mi><mi>a</mi><mi>d</mi><mi>g</mi><mi>e</mi><mi>t</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">199. Customer rating: 4.8 stars. Available now. Category: Electronics | Brand: SmartGadget | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">199.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">u</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal">m</span><span class="mord mathnormal" style="margin-right:0.02778em;">err</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">4.8</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal">rs</span><span class="mord">.</span><span class="mord mathnormal">A</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mord mathnormal">ai</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">ab</span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">S</span><span class="mord mathnormal">ma</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">tG</span><span class="mord mathnormal">a</span><span class="mord mathnormal">d</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">e</span><span class="mord mathnormal">t</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>199.0 | Rating: 4.8* | Stock: In Stock</p></li>
<li><p>Score: 0.8532
Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>29.99.4.0</mn><mi>s</mi><mi>t</mi><mi>a</mi><mi>r</mi><mi>r</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi mathvariant="normal">.</mi><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">29.99. 4.0 star rating. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">29.99.4.0</span><span class="mord mathnormal">s</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">rr</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>29.99 | Rating: 4.0* | Stock: In Stock</p></li>
<li><p>Score: 0.8657
Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>149.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>T</mi><mi>e</mi><mi>c</mi><mi>h</mi><mi>P</mi><mi>r</mi><mi>o</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">149. Rating: 4.5/5. In Stock. Category: Electronics | Brand: TechPro | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">149.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">T</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal">ro</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>149.0 | Rating: 4.5* | Stock: In Stock</p></li>
<li><p>Score: 0.8821
Product: DigitalPlus Laptop computer with fast processor, 16GB RAM, SSD storage, perfect for work and gaming. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>899.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.7</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi><mi>C</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>g</mi><mi>o</mi><mi>r</mi><mi>y</mi><mo>:</mo><mi>E</mi><mi>l</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>r</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>c</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>B</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mo>:</mo><mi>D</mi><mi>i</mi><mi>g</mi><mi>i</mi><mi>t</mi><mi>a</mi><mi>l</mi><mi>P</mi><mi>l</mi><mi>u</mi><mi>s</mi><mi mathvariant="normal">∣</mi><mi>P</mi><mi>r</mi><mi>i</mi><mi>c</mi><mi>e</mi><mo>:</mo></mrow><annotation encoding="application/x-tex">899. Rating: 4.7/5. In Stock. Category: Electronics | Brand: DigitalPlus | Price:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">899.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.7/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal" style="margin-right:0.03588em;">ory</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">El</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">ro</span><span class="mord mathnormal">ni</span><span class="mord mathnormal">cs</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">D</span><span class="mord mathnormal">i</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">i</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.01968em;">lPl</span><span class="mord mathnormal">u</span><span class="mord mathnormal">s</span><span class="mord">∣</span><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">i</span><span class="mord mathnormal">ce</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span></span></span></span>899.0 | Rating: 4.7* | Stock: In Stock</p></li>
</ol>
<h2 id="RAG-Powered-Answer-Generation" class="common-anchor-header">RAG-Powered Answer Generation<button data-href="#RAG-Powered-Answer-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>So far, we’ve built a search system that returns relevant products. But what if we want to go one step further? What if, instead of just showing a list of products, we want to generate a natural language answer that summarizes the results? This is where RAG (Retrieval-Augmented Generation) comes in.</p>
<p>RAG combines the retrieval (semantic search) with generation (an LLM that can create natural language responses). Instead of list of results, it can talk to you and provide a response like a qualified salesperson and also explain what’s the best product for you!</p>
<pre><code translate="no">RAG Pipeline Flow:
┌─────────────────────────────────────────────────────────────┐
│ User Query: &quot;affordable fitness equipment&quot;                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
            ┌────────────────────────────┐
            │ 1. Semantic Search         │
            │    (Retrieval)             │
            │    → Find relevant products│
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │ 2. Format Results          │
            │    → Create context from   │
            │      search results        │
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │ 3. LLM Generation          │
            │    → Generate natural      │
            │      language answer       │
            └────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Natural Language Answer:                                    │
│ &quot;For affordable fitness equipment, I found several great    │
│  options. The TechPro Smartwatch at $34 offers fitness      │
│  tracking, heart rate monitoring, and GPS. For yoga, the    │
│  OutdoorGear Yoga Mat at $66 features a non-slip surface    │
│  and extra padding...&quot;                                      │
└─────────────────────────────────────────────────────────────┘
</code></pre>
<p>For complex queries, we can add a RAG step that uses an LLM to generate natural language answers based on the search results. This makes the search experience more conversational and user-friendly.</p>
<p><strong>Implementation Details:</strong></p>
<p>Our RAG implementation uses Google’s Gemini API to generate natural language answers. It:</p>
<ul>
<li><p>Formats search results as context for the LLM</p></li>
<li><p>Uses the same API key as our embedding model and LangExtract (GEMINI_API_KEY)</p></li>
<li><p>Provides informative, conversational answers that summarize the search results</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># RAG (Retrieval-Augmented Generation) for natural language answer generation</span>
<span class="hljs-keyword">try</span>:
    <span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
    GEMINI_AVAILABLE = <span class="hljs-literal">True</span>
<span class="hljs-keyword">except</span> ImportError:
    GEMINI_AVAILABLE = <span class="hljs-literal">False</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️  Note: google-generativeai not installed. Install with: pip install google-generativeai&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   RAG will use template-based generation. For LLM-powered RAG, install the package.&quot;</span>)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">rag_answer_generation</span>(<span class="hljs-params">
    query: <span class="hljs-built_in">str</span>,
    search_results: <span class="hljs-type">List</span>[<span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]],
    use_llm: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">True</span>,
    model: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>
</span>) -&gt; <span class="hljs-built_in">tuple</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Generate a natural language answer from search results using RAG.
    
    Uses Gemini API for LLM-powered generation when available, falls back to template-based.
    
    Args:
        query: User&#x27;s search query
        search_results: Results from semantic search
        use_llm: Whether to use LLM (default: True, falls back to template if unavailable)
        model: Gemini model identifier (default: &quot;gemini-2.5-flash-lite&quot;)
    
    Returns:
        Tuple of (answer, llm_used) where llm_used indicates if LLM was actually used
    &quot;&quot;&quot;</span>
    
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> search_results:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;I couldn&#x27;t find any products matching your search.&quot;</span>, <span class="hljs-literal">False</span>
    
    <span class="hljs-comment"># Try LLM-based generation if requested and available</span>
    <span class="hljs-keyword">if</span> use_llm <span class="hljs-keyword">and</span> GEMINI_AVAILABLE:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Check for API key (can use GEMINI_API_KEY or GOOGLE_API_KEY)</span>
            api_key = os.environ.get(<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>) <span class="hljs-keyword">or</span> os.environ.get(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)
            
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> api_key:
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️  Warning: No API key found. Set GEMINI_API_KEY or GOOGLE_API_KEY for LLM-powered RAG.&quot;</span>)
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   Falling back to template-based generation.&quot;</span>)
                use_llm = <span class="hljs-literal">False</span>
            <span class="hljs-keyword">else</span>:
                <span class="hljs-comment"># Configure Gemini</span>
                genai.configure(api_key=api_key)
                
                <span class="hljs-comment"># Format search results as context</span>
                context_items = []
                <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[:<span class="hljs-number">5</span>], <span class="hljs-number">1</span>):
                    context_items.append(
                        <span class="hljs-string">f&quot;Product <span class="hljs-subst">{i}</span>: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>\n&quot;</span>
                        <span class="hljs-string">f&quot;  Category: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Brand: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;brand&#x27;</span>]}</span>\n&quot;</span>
                        <span class="hljs-string">f&quot;  Price: $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | Rating: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>/5 | Stock: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;stock_status&#x27;</span>]}</span>&quot;</span>
                    )
                
                context = <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_items)
                
                <span class="hljs-comment"># Create the prompt</span>
                prompt = <span class="hljs-string">f&quot;&quot;&quot;You are a helpful e-commerce assistant. Based on the following product search results, 
provide a natural, conversational answer to the user&#x27;s query. Be concise but informative.

User Query: <span class="hljs-subst">{query}</span>

Search Results:
<span class="hljs-subst">{context}</span>

Provide a helpful answer that summarizes the best matching products. Highlight key features, prices, and ratings. 
If there are multiple good options, mention a few. Keep the tone friendly and helpful.&quot;&quot;&quot;</span>

                <span class="hljs-comment"># Generate answer using Gemini</span>
                gemini_model = genai.GenerativeModel(model)
                response = gemini_model.generate_content(prompt)
                
                <span class="hljs-keyword">if</span> response <span class="hljs-keyword">and</span> response.text:
                    <span class="hljs-keyword">return</span> response.text.strip(), <span class="hljs-literal">True</span>
                <span class="hljs-keyword">else</span>:
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️  Warning: Empty response from LLM. Falling back to template-based generation.&quot;</span>)
                    use_llm = <span class="hljs-literal">False</span>
                    
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️  Error generating RAG answer with LLM: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   Falling back to template-based generation.&quot;</span>)
            use_llm = <span class="hljs-literal">False</span>
    
    <span class="hljs-comment"># Template-based answer generation (fallback)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(search_results) == <span class="hljs-number">1</span>:
        result = search_results[<span class="hljs-number">0</span>]
        answer = <span class="hljs-string">f&quot;I found a great match for &#x27;<span class="hljs-subst">{query}</span>&#x27;:\n\n&quot;</span>
        answer += <span class="hljs-string">f&quot;<span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>\n&quot;</span>
        answer += <span class="hljs-string">f&quot;Price: $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | Rating: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>/5 | Stock: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;stock_status&#x27;</span>]}</span>&quot;</span>
    <span class="hljs-keyword">else</span>:
        answer = <span class="hljs-string">f&quot;Based on your search for &#x27;<span class="hljs-subst">{query}</span>&#x27;, I found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(search_results)}</span> relevant products:\n\n&quot;</span>
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[:<span class="hljs-number">3</span>], <span class="hljs-number">1</span>):
            answer += <span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{result[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>\n&quot;</span>
            answer += <span class="hljs-string">f&quot;   $<span class="hljs-subst">{result[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>/5 stars | <span class="hljs-subst">{result[<span class="hljs-string">&#x27;stock_status&#x27;</span>]}</span>\n\n&quot;</span>
        
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(search_results) &gt; <span class="hljs-number">3</span>:
            answer += <span class="hljs-string">f&quot;... and <span class="hljs-subst">{<span class="hljs-built_in">len</span>(search_results) - <span class="hljs-number">3</span>}</span> more results available.&quot;</span>
    
    <span class="hljs-keyword">return</span> answer, <span class="hljs-literal">False</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;RAG function with LLM support defined!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>RAG function with LLM support defined!</p>
<pre><code translate="no"><span class="hljs-comment"># Wrapper function that combines search + RAG</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">complete_search_pipeline</span>(<span class="hljs-params">
    query: <span class="hljs-built_in">str</span>,
    milvus_client,
    COLLECTION_NAME,
    genai_client,
    embedding_model: <span class="hljs-built_in">str</span>,
    embedding_dim: <span class="hljs-built_in">int</span>,
    top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>,
    category: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    brand: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    max_price: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    min_price: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    min_rating: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">int</span>] = <span class="hljs-literal">None</span>,
    stock_status: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
    use_rag: <span class="hljs-built_in">bool</span> = <span class="hljs-literal">False</span>
</span>) -&gt; <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]:
    <span class="hljs-string">&quot;&quot;&quot;
    Full pipeline: search + optional RAG answer generation.
    Combines semantic_search_with_filters and rag_answer_generation in one function.
    &quot;&quot;&quot;</span>
    
    <span class="hljs-comment"># Do the actual search first</span>
    search_results = semantic_search_with_filters(
        query=query,
        milvus_client,
        COLLECTION_NAME,
        genai_client=genai_client,
        embedding_model=embedding_model,
        embedding_dim=embedding_dim,
        top_k=top_k,
        category=category,
        brand=brand,
        max_price=max_price,
        min_price=min_price,
        min_rating=min_rating,
        stock_status=stock_status
    )
    
    <span class="hljs-comment"># Generate a natural language answer</span>
    rag_answer = <span class="hljs-literal">None</span>
    used_llm = <span class="hljs-literal">False</span>
    
    <span class="hljs-keyword">if</span> use_rag:
        <span class="hljs-comment"># Try to use LLM, falls back to template if API key missing</span>
        rag_answer, used_llm = rag_answer_generation(
            query, 
            search_results, 
            use_llm=<span class="hljs-literal">True</span>, 
            model=<span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>
        )
    
    <span class="hljs-comment"># Return everything in a dict</span>
    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;results&quot;</span>: search_results,
        <span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-built_in">len</span>(search_results),
        <span class="hljs-string">&quot;answer&quot;</span>: rag_answer,
        <span class="hljs-string">&quot;rag_used&quot;</span>: use_rag,
        <span class="hljs-string">&quot;rag_llm_used&quot;</span>: used_llm
    }

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Complete pipeline function defined!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Complete pipeline function defined!</p>
<pre><code translate="no"><span class="hljs-comment"># Test the complete pipeline</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Complete Search Pipeline Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">80</span>)
<span class="hljs-comment"># Run the full pipeline with RAG enabled</span>
result = complete_search_pipeline(
        query=<span class="hljs-string">&quot;affordable fitness equipment&quot;</span>,
        milvus_client,
        COLLECTION_NAME,
        genai_client=genai_client,
        embedding_model=EMBEDDING_MODEL,
        embedding_dim=EMBEDDING_DIM,
        top_k=<span class="hljs-number">5</span>,
        category=<span class="hljs-string">&quot;Clothing&quot;</span>,
        max_price=<span class="hljs-number">80</span>,
        min_rating=<span class="hljs-number">3</span>,
        use_rag=<span class="hljs-literal">True</span>
    )
<span class="hljs-comment"># Display the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;query&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{result[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> results&quot;</span>)
<span class="hljs-comment"># print(f&quot;RAG used: {result[&#x27;rag_used&#x27;]}&quot;)</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;RAG LLM used: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;rag_llm_used&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nResults:\n&quot;</span>)

<span class="hljs-keyword">for</span> i, product <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(result[<span class="hljs-string">&#x27;results&#x27;</span>], <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{product[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   $<span class="hljs-subst">{product[<span class="hljs-string">&#x27;price&#x27;</span>]}</span> | <span class="hljs-subst">{product[<span class="hljs-string">&#x27;rating&#x27;</span>]}</span>* | <span class="hljs-subst">{product[<span class="hljs-string">&#x27;stock_status&#x27;</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> result[<span class="hljs-string">&#x27;answer&#x27;</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nRAG Answer:\n<span class="hljs-subst">{result[<span class="hljs-string">&#x27;answer&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Complete Search Pipeline Demo</strong></p>
<p>Query: affordable fitness equipment
Found 2 results
RAG LLM used: True</p>
<p>Results:</p>
<ol>
<li><p>StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>39.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.5</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi></mrow><annotation encoding="application/x-tex">39.99. Rating: 4.5/5. In Stock.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">39.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.5/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span></span></span></span>39.99 | 4.5* | In Stock</p></li>
<li><p>StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>24.99.</mn><mi>R</mi><mi>a</mi><mi>t</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo>:</mo><mn>4.3</mn><mi mathvariant="normal">/</mi><mn>5.</mn><mi>I</mi><mi>n</mi><mi>S</mi><mi>t</mi><mi>o</mi><mi>c</mi><mi>k</mi><mi mathvariant="normal">.</mi></mrow><annotation encoding="application/x-tex">24.99. Rating: 4.3/5. In Stock.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8778em;vertical-align:-0.1944em;"></span><span class="mord">24.99.</span><span class="mord mathnormal" style="margin-right:0.00773em;">R</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">4.3/5.</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">n</span><span class="mord mathnormal">St</span><span class="mord mathnormal">oc</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord">.</span></span></span></span>24.99 | 4.3* | In Stock</p></li>
</ol>
<p>RAG Answer:
I found some great affordable fitness clothing options for you!</p>
<p>For ultimate comfort and flexibility during your workouts, check out the <strong>StyleCo Yoga Pants</strong> for just $39.99. They’re made with moisture-wicking material and have a great 4.5/5 rating!</p>
<p>If you’re looking for a breathable basic, the <strong>StyleCo Comfortable Cotton T-shirt</strong> is a fantastic choice at $24.99. It also has a good rating of 4.3/5 and comes in various colors and sizes.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Wrapping Up<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>In this blog, we have seen that the combination of semantic search and structured filtering can solve the traditional keyword search problem, which is too rigid, requiring exact word matches and manual synonym maintenance. Semantic search can bring more value if we combine structured filters, such as price ranges, stock status, or features, and we can achieve the best of both worlds.</p>
<p>The search landscape is evolving rapidly, and the combination of semantic search with structured filtering is becoming essential for modern applications. Whether you’re building an e-commerce platform, a content discovery system, or an internal knowledge base, this approach gives you the flexibility and efficiency to deliver great search experiences.</p>
<p>If you found this valuable, I’d love to hear about your use cases and how you’re implementing search in your applications. The future of search is intent-aware, and we’re just getting started.</p>
