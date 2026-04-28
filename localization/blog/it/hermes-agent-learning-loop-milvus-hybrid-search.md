---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >
  Hermes Agent's Learning Loop writes Skills from use, but its FTS5 retriever
  misses rephrased queries. Milvus 2.6 hybrid search fixes cross-session recall.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes Agent</strong></a> <strong>has been everywhere lately.</strong> Built by Nous Research, Hermes is a self-hosted personal AI agent that runs on your own hardware (a $5 VPS works) and talks to you through existing chat channels like Telegram.</p>
<p><strong>Its biggest highlight is a built-in learning loop:</strong> the loop creates Skills from experience, improves them during use, and searches past conversations to find reusable patterns. Other agent frameworks hand-code Skills before deployment. Hermes’s Skills grow from use, and repeated workflows become reusable with zero code change.</p>
<p><strong>The catch is that Hermes’s retrieval is keyword-only.</strong> It matches exact words, but not the meaning users are after. When users use different wording across different sessions, the loop can’t connect them, and no new Skill gets written. When there are only a few hundred documents, the gap is tolerable. <strong>Past that, the loop stops learning because it can’t find its own history.</strong></p>
<p><strong>The fix is Milvus 2.6.</strong> Its <a href="https://milvus.io/docs/multi-vector-search.md">hybrid search</a> covers both meaning and exact keywords in a single query, so the loop can finally connect rephrased information across sessions. It’s light enough to fit on a small cloud server (a $5/month VPS runs it). Swapping it in doesn’t require changing Hermes — Milvus slots behind the retrieval layer, so the Learning Loop stays intact. Hermes still picks which Skill to run, and Milvus handles what to retrieve.</p>
<p>But the deeper payoff goes beyond better recall: once retrieval works, the Learning Loop can store the retrieval strategy itself as a Skill – not just the content it retrieves. That’s how the agent’s knowledge work compounds across sessions.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Hermes Agent Architecture: How Four-Layer Memory Powers the Skill Learning Loop<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>has four memory layers, and L4 Skills is the one that sets it apart.</strong></p>
<ul>
<li><strong>L1</strong> — session context, cleared when the session closes</li>
<li><strong>L2</strong> — persisted facts: project stack, team conventions, resolved decisions</li>
<li><strong>L3</strong> — SQLite FTS5 keyword search over local files</li>
<li><strong>L4</strong> — stores workflows as Markdown files. Unlike LangChain tools or AutoGPT plugins, which developers author in code before deployment, L4 Skills are self-written: they grow from what the agent actually runs, with zero developer authoring.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Why Hermes’s FTS5 Keyword Retrieval Breaks the Learning Loop<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes needs retrieval to trigger cross-session workflows in the first place.</strong> But its built-in L3 layer uses SQLite FTS5, which only matches literal tokens, not meaning.</p>
<p><strong>When users phrase the same intent differently across sessions, FTS5 misses the match.</strong> The Learning Loop doesn’t fire. No new Skill gets written, and next time the intent comes around, the user is back to routing by hand.</p>
<p>Example: the knowledge base stores “asyncio event loop, async task scheduling, non-blocking I/O.” A user searches “Python concurrency.” FTS5 returns zero hits — no literal word overlap, and FTS5 has no way to see that they’re the same question.</p>
<p>Under a couple hundred documents, the gap is tolerable. Past that, documentation uses one vocabulary, and users ask in another, and FTS5 has no bridge between them. <strong>Unretrievable content might as well not be in the knowledge base, and the Learning Loop has nothing to learn from.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">How Milvus 2.6 Fixes the Retrieval Gap with Hybrid Search and Tiered Storage<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 brings two upgrades that fit Hermes’s failure points.</strong> <strong>Hybrid search</strong> unblocks the Learning Loop by covering both semantic and keyword retrieval in one call. <strong>Tiered storage</strong> keeps the whole retrieval backend small enough to run on the same $5/month VPS Hermes was built for.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">What Hybrid Search Solves: Finding Relevant Information</h3><p>Milvus 2.6 supports running both vector retrieval (semantic) and <a href="https://milvus.io/docs/full-text-search.md">BM25 full-text search</a> (keyword) in a single query, then merging the two ranked lists with <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF)</a>.</p>
<p>For example: ask &quot;what is the principle of asyncio&quot;, and vector retrieval hits semantically related content. Ask &quot;where is the <code translate="no">find_similar_task</code> function defined&quot;, and BM25 precisely matches the function name in code. For questions that involve a function inside a particular type of task, hybrid search returns the right result in one call, with no hand-written routing logic.</p>
<p>For Hermes, this is what unblocks the Learning Loop. When a second session rephrases the intent, vector retrieval catches the semantic match FTS5 missed. The loop fires, and a new Skill gets written.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">What Tiered Storage Solves: Cost</h3><p>A naive vector database would want the full embedding index in RAM, which pushes personal deployments toward bigger, more expensive infrastructure. Milvus 2.6 avoids that with three-tier storage, moving entries between tiers based on access frequency:</p>
<ul>
<li><strong>Hot</strong> — in memory</li>
<li><strong>Warm</strong> — on SSD</li>
<li><strong>Cold</strong> — on object storage</li>
</ul>
<p>Only hot data stays resident. A 500-document knowledge base fits under 2 GB of RAM. The whole retrieval stack runs on the same $5/month VPS Hermes targets, with no infrastructure upgrade needed.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: System Architecture<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes picks which Skill to run. Milvus handles what to retrieve.</strong> The two systems stay separate, and Hermes’s interface doesn’t change.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>The flow:</strong></p>
<ol>
<li>Hermes identifies the user’s intent and routes to a Skill.</li>
<li>The Skill calls a retrieval script through the terminal tool.</li>
<li>The script hits Milvus, runs hybrid search, and returns ranked chunks with source metadata.</li>
<li>Hermes composes the answer. Memory records the workflow.</li>
<li>When the same pattern repeats across sessions, the Learning Loop writes a new Skill.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">How to Install Hermes and Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Install Hermes and</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, then create a collection with dense and BM25 fields.</strong> That’s the full setup before the Learning Loop can fire.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Install Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Run <code translate="no">hermes</code> to enter the interactive init wizard:</p>
<ul>
<li><strong>LLM provider</strong> — OpenAI, Anthropic, OpenRouter (OpenRouter has free models)</li>
<li><strong>Channel</strong> — this walkthrough uses a FLark bot</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Run Milvus 2.6 Standalone</h3><p>Single-node standalone is enough for a personal agent:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Create the Collection</h3><p>Schema design caps what retrieval can do. This schema runs dense vectors and BM25 sparse vectors side by side:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Hybrid Search Script</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>The dense request widens the candidate pool by 2× so RRF has enough to rank from.</strong> <code translate="no">text-embedding-3-small</code> is the cheapest OpenAI embedding that still holds retrieval quality; swap in <code translate="no">text-embedding-3-large</code> if the budget allows.</p>
<p>With the environment and knowledge base ready, the next section puts the Learning Loop to the test.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">Hermes Skill Auto-Generation in Practice<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Two sessions show the Learning Loop in action.</strong> In the first, the user names the script by hand. In the second, a new session asks the same question without naming the script. Hermes picks up the pattern and writes three Skills.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Session 1: Call the Script by Hand</h3><p>Open Hermes in Lark. Give it the script path and the retrieval target. Hermes invokes the terminal tool, runs the script, and returns the answer with source attribution. <strong>No Skill exists yet. This is a plain tool call.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Session 2: Ask Without Naming the Script</h3><p>Clear the conversation. Start fresh. Ask the same category of question without mentioning the script or path.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">Memory Writes First, Skill Follows</h3><p><strong>The Learning Loop records the workflow (script, arguments, return shape) and returns the answer.</strong> Memory holds the trace; no Skill exists yet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>The second session’s match tells the loop the pattern is worth keeping.</strong> When it fires, three Skills get written:</p>
<table>
<thead>
<tr><th>Skill</th><th>Role</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Run hybrid semantic + keyword search over Memory and compose the answer</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Verify documents have been ingested into the knowledge base</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Run shell commands: scripts, environment setup, inspection</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>From this point on, <strong>users stop naming Skills.</strong> Hermes infers intent, routes to the Skill, pulls the relevant chunks from Memory, and writes the answer. There’s no Skill selector in the prompt.</p>
<p>Most RAG (retrieval-augmented generation) systems solve the storing-and-fetching problem, but the fetch logic itself is hard-coded in application code. Ask in a different way or in a new scenario, and retrieval breaks. Hermes stores the fetch strategy as a Skill, which means <strong>the fetch path becomes a document you can read, edit, and version.</strong> The line <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> isn’t a setup-complete marker. It’s <strong>the Agent committing a behavior pattern to long-term memory.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw: Accumulation vs. Orchestration<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes and OpenClaw answer different problems.</strong> Hermes is built for a single agent that accumulates memory and skills across sessions. OpenClaw is built for breaking a complex task into pieces and handing each piece to a specialized agent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw’s strength is orchestration. It optimizes for how much of a task gets done automatically. Hermes’s strength is accumulation: a single agent that remembers across sessions, with skills that grow from use. Hermes optimizes for long-term context and domain experience.</p>
<p><strong>The two frameworks stack.</strong> Hermes ships a one-step migration path that pulls <code translate="no">~/.openclaw</code> memory and skills into Hermes’s memory layers. An orchestration stack can sit on top, with an accumulation agent underneath.</p>
<p>For the OpenClaw side of the split, see <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw? Complete Guide to the Open-Source AI Agent</a> on the Milvus blog.</p>
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
    </button></h2><p>Hermes’s Learning Loop turns repeated workflows into reusable Skills, but only if retrieval can connect them across sessions. FTS5 keyword search can’t. <a href="https://milvus.io/docs/multi-vector-search.md"><strong>Milvus 2.6 hybrid search</strong></a> can: dense vectors handle meaning, BM25 handles exact keywords, RRF merges both, and <a href="https://milvus.io/docs/tiered-storage-overview.md">tiered storage</a> keeps the whole stack on a $5/month VPS.</p>
<p>The bigger point: once retrieval works, the agent doesn’t just store better answers: it stores better retrieval strategies as Skills. The fetch path becomes a versionable document that improves with use. That’s what separates an agent that accumulates domain expertise from one that starts fresh every session. For a comparison of how other agents handle (or fail to handle) this problem, see <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code’s Memory System Explained.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Try the tools in this article:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent on GitHub</a> — install script, provider setup, and channel configuration used above.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> — single-node Docker deploy for the knowledge-base backend.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus Hybrid Search Tutorial</a> — full dense + BM25 + RRF example matching the script in this post.</li>
</ul>
<p><strong>Got questions about Hermes + Milvus hybrid search?</strong></p>
<ul>
<li>Join the <a href="https://discord.gg/milvus">Milvus Discord</a> to ask about hybrid search, tiered storage, or Skill-routing patterns — other developers are building similar stacks.</li>
<li><a href="https://milvus.io/community#office-hours">Book a Milvus Office Hours session</a> to walk through your own agent + knowledge-base setup with the Milvus team.</li>
</ul>
<p><strong>Want to skip the self-host?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Sign up</a> or <a href="https://cloud.zilliz.com/login">sign in</a> to Zilliz Cloud — managed Milvus with hybrid search and tiered storage out of the box. New work-email accounts get <strong>$100 in free credits</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Further Reading<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 release notes</a> — tiered storage, hybrid search, schema changes</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> — operational tooling for Milvus-native agents</li>
<li><a href="https://zilliz.com/blog">Why RAG-Style Knowledge Management Breaks for Agents</a> — the case for agent-specific memory design</li>
<li><a href="https://zilliz.com/blog">Claude Code’s Memory System Is More Primitive Than You’d Expect</a> — comparison piece on another agent’s memory stack</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Frequently Asked Questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">How does Hermes Agent’s Skill Learning Loop actually work?</h3><p>Hermes records every workflow it runs – the script called, arguments passed, and return shape – as a memory trace. When the same pattern appears across two or more sessions, the Learning Loop fires and writes a reusable Skill: a Markdown file that captures the workflow as a repeatable procedure. From that point on, Hermes routes to the Skill by intent alone, without the user naming it. The critical dependency is retrieval – the loop only fires if it can find the earlier session’s trace, which is why keyword-only search becomes a bottleneck at scale.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">What’s the difference between hybrid search and vector-only search for agent memory?</h3><p>Vector-only search handles meaning well but misses exact matches. If a developer pastes an error string like ConnectionResetError or a function name like find_similar_task, a pure vector search might return semantically related but wrong results. Hybrid search combines dense vectors (semantic) with BM25 (keyword) and merges the two result sets with Reciprocal Rank Fusion. For agent memory – where queries range from vague intent (“Python concurrency”) to exact symbols – hybrid search covers both ends in a single call without routing logic in your application layer.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Can I use Milvus hybrid search with AI agents other than Hermes?</h3><p>Yes. The integration pattern is generic: the agent calls a retrieval script, the script queries Milvus, and results return as ranked chunks with source metadata. Any agent framework that supports tool calls or shell execution can use the same approach. Hermes happens to be a strong fit because its Learning Loop specifically depends on cross-session retrieval to fire, but the Milvus side is agent-agnostic – it doesn’t know or care which agent is calling it.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">How much does a self-hosted Milvus + Hermes setup cost per month?</h3><p>A single-node Milvus 2.6 Standalone on a 2-core / 4 GB VPS with tiered storage runs about $5/month. OpenAI text-embedding-3-small costs $0.02 per 1M tokens – a few cents per month for a personal knowledge base. LLM inference dominates total cost and scales with usage, not with the retrieval stack.</p>
