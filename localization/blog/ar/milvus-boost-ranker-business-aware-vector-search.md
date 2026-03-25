---
id: milvus-boost-ranker-business-aware-vector-search.md
title: |
  How to Use Milvus Boost Ranker for Business-Aware Vector Search
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >
  Learn how Milvus Boost Ranker lets you layer business rules on top of vector
  similarity — boost official docs, demote stale content, add diversity.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>Vector search ranks results by embedding similarity — the closer the vectors, the higher the result. Some systems add a model-based reranker (BGE, Voyage, Cohere) to improve ordering. But neither approach handles a fundamental requirement in production: <strong>business context matters as much as semantic relevance, sometimes more.</strong></p>
<p>An e-commerce site needs to surface in-stock products from official stores first. A content platform wants to pin recent announcements. An enterprise knowledge base needs authoritative documents at the top. When ranking relies solely on vector distance, these rules get ignored. The results may be relevant, but they’re not appropriate.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, introduced in <a href="https://milvus.io/intro">Milvus</a> 2.6, solves this. It lets you adjust search result rankings using metadata rules — no index rebuild, no model change. This article covers how it works, when to use it, and how to implement it with code.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">What Is Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker is a lightweight, rule-based reranking feature in Milvus 2.6.2</strong> that adjusts <a href="https://zilliz.com/learn/vector-similarity-search">vector search</a> results using scalar metadata fields. Unlike model-based rerankers that call external LLMs or embedding services, Boost Ranker operates entirely within Milvus using simple filter-and-weight rules. No external dependencies, minimal latency overhead — suitable for real-time use.</p>
<p>You configure it through the <a href="https://milvus.io/docs/manage-functions.md">Function API</a>. After vector search returns a set of candidates, Boost Ranker applies three operations:</p>
<ol>
<li><strong>Filter:</strong> identify results matching specific conditions (e.g., <code translate="no">is_official == true</code>)</li>
<li><strong>Boost:</strong> multiply their scores by a configured weight</li>
<li><strong>Shuffle:</strong> optionally add a small random factor (0–1) to introduce diversity</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">How It Works Under the Hood</h3><p>Boost Ranker runs inside Milvus as a post-processing step:</p>
<ol>
<li><strong>Vector search</strong> — each segment returns candidates with IDs, similarity scores, and metadata.</li>
<li><strong>Apply rules</strong> — the system filters matching records and adjusts their scores using the configured weight and optional <code translate="no">random_score</code>.</li>
<li><strong>Merge and sort</strong> — all candidates are combined and re-sorted by updated scores to produce the final Top-K results.</li>
</ol>
<p>Because Boost Ranker only operates on already-retrieved candidates — not the full dataset — the additional computational cost is negligible.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">When Should You Use Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Boosting Important Results</h3><p>The most common use case: layer simple business rules on top of semantic search.</p>
<ul>
<li><strong>E-commerce:</strong> boost products from flagship stores, official sellers, or paid promotions. Push items with high recent sales or click-through rates higher.</li>
<li><strong>Content platforms:</strong> prioritize recently published content via a <code translate="no">publish_time</code> field, or boost posts from verified accounts.</li>
<li><strong>Enterprise search:</strong> give higher priority to documents where <code translate="no">doctype == &quot;policy&quot;</code> or <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>All configurable with a filter + weight. No embedding model changes, no index rebuilds.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Demoting Without Removing</h3><p>Boost Ranker can also lower ranking for certain results — a softer alternative to hard filtering.</p>
<ul>
<li><strong>Low-stock products:</strong> if <code translate="no">stock &lt; 10</code>, reduce their weight slightly. Still findable, but won’t dominate top positions.</li>
<li><strong>Sensitive content:</strong> lower the weight of flagged content instead of removing it entirely. Limits exposure without hard censorship.</li>
<li><strong>Stale documents:</strong> documents where <code translate="no">year &lt; 2020</code> get ranked lower so newer content surfaces first.</li>
</ul>
<p>Users can still find demoted results by scrolling or searching more precisely, but they won’t crowd out more relevant content.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Adding Diversity with Controlled Randomness</h3><p>When many results have similar scores, the Top-K can look identical across queries. Boost Ranker’s <code translate="no">random_score</code> parameter introduces slight variation:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: controls overall randomness for reproducibility</li>
<li><code translate="no">field</code>: usually the primary key <code translate="no">id</code>, ensures the same record gets the same random value each time</li>
</ul>
<p>This is useful for <strong>diversifying recommendations</strong> (preventing the same items from always appearing first) and <strong>exploration</strong> (combining fixed business weights with small random perturbations).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Combining Boost Ranker with Other Rankers</h3><p>Boost Ranker is set via the Function API with <code translate="no">params.reranker = &quot;boost&quot;</code>. Two things to know about combining it:</p>
<ul>
<li><strong>Limitation:</strong> in hybrid (multi-vector) search, Boost Ranker cannot be the top-level ranker. But it can be used inside each individual <code translate="no">AnnSearchRequest</code> to adjust results before they’re merged.</li>
<li><strong>Common combinations:</strong>
<ul>
<li><strong>RRF + Boost:</strong> use RRF to merge multi-modal results, then apply Boost for metadata-based fine-tuning.</li>
<li><strong>Model ranker + Boost:</strong> use a model-based ranker for semantic quality, then Boost for business rules.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">How to Configure Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker is configured through the Function API. For more complex logic, combine it with <code translate="no">FunctionScore</code> to apply multiple rules together.</p>
<h3 id="Required-Fields" class="common-anchor-header">Required Fields</h3><p>When creating a <code translate="no">Function</code> object:</p>
<ul>
<li><code translate="no">name</code>: any custom name</li>
<li><code translate="no">input_field_names</code>: must be an empty list <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: set to <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: must be <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Key Parameters</h3><p><strong><code translate="no">params.weight</code> (required)</strong></p>
<p>The multiplier applied to matching records’ scores. How you set it depends on the metric:</p>
<table>
<thead>
<tr><th>Metric Type</th><th>To Boost Results</th><th>To Demote Results</th></tr>
</thead>
<tbody>
<tr><td>Higher-is-better (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Lower-is-better (L2/Euclidean)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (optional)</strong></p>
<p>A condition that selects which records get their scores adjusted:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Only matching records are affected. Everything else keeps its original score.</p>
<p><strong><code translate="no">params.random_score</code> (optional)</strong></p>
<p>Adds a random value between 0 and 1 for diversity. See the randomness section above for details.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Single vs. Multiple Rules</h3><p><strong>Single rule</strong> — when you have one business constraint (e.g., boost official docs), pass the ranker directly to <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Multiple rules</strong> — when you need several constraints (prioritize in-stock items + demote low-rated products + add randomness), create multiple <code translate="no">Function</code> objects and combine them with <code translate="no">FunctionScore</code>. You configure:</p>
<ul>
<li><code translate="no">boost_mode</code>: how each rule combines with the original score (<code translate="no">multiply</code> or <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: how multiple rules combine with each other (<code translate="no">multiply</code> or <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Hands-On: Prioritizing Official Documents<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s walk through a concrete example: making official documents rank higher in a document search system.</p>
<h3 id="Schema" class="common-anchor-header">Schema</h3><p>A collection called <code translate="no">milvus_collection</code> with these fields:</p>
<table>
<thead>
<tr><th>Field</th><th>Type</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Primary key</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Document text</td></tr>
<tr><td><code translate="no">embedding</code></td><td>FLOAT_VECTOR (3072)</td><td>Semantic vector</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Origin: &quot;official&quot;, &quot;community&quot;, or “ticket”</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> if <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>The <code translate="no">source</code> and <code translate="no">is_official</code> fields are the metadata Boost Ranker will use to adjust rankings.</p>
<h3 id="Setup-Code" class="common-anchor-header">Setup Code</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Comparing Results: With and Without Boost Ranker</h3><p>First, run a baseline search without Boost Ranker. Then add Boost Ranker with <code translate="no">filter: is_official == true</code> and <code translate="no">weight: 1.2</code>, and compare.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Results</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>The key change: document <code translate="no">id=2</code> (official) jumped from 4th to 2nd place because its score was multiplied by 1.2. Community posts and ticket records aren’t removed — they just rank lower. That’s the point of Boost Ranker: keep semantic search as the foundation, then layer business rules on top.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> gives you a way to inject business logic into vector search results without touching your embeddings or rebuilding indexes. Boost official content, demote stale results, add controlled diversity — all through simple filter + weight configuration in the <a href="https://milvus.io/docs/manage-functions.md">Milvus Function API</a>.</p>
<p>Whether you’re building RAG pipelines, recommendation systems, or enterprise search, Boost Ranker helps bridge the gap between what’s semantically similar and what’s actually useful to your users.</p>
<p>If you’re working on search ranking and want to discuss your use case:</p>
<ul>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to connect with other developers building search and retrieval systems.</li>
<li><a href="https://milvus.io/office-hours">Book a free 20-minute Milvus Office Hours session</a> to walk through your ranking logic with the team.</li>
<li>If you’d rather skip infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) has a free tier to get started.</li>
</ul>
<hr>
<p>A few questions that come up when teams start using Boost Ranker:</p>
<p><strong>Can Boost Ranker replace a model-based reranker like Cohere or BGE?</strong>
They solve different problems. Model-based rerankers re-score results by semantic quality — they’re good at deciding “which document actually answers the question.” Boost Ranker adjusts scores by business rules — it decides “which relevant document should appear first.” In practice, you often want both: a model ranker for semantic relevance, then Boost Ranker for business logic on top.</p>
<p><strong>Does Boost Ranker add significant latency?</strong>
No. It operates on the already-retrieved candidate set (typically the Top-K from vector search), not the full dataset. The operations are simple filter-and-multiply, so the overhead is negligible compared to the vector search itself.</p>
<p><strong>How do I set the weight value?</strong>
Start with small adjustments. For COSINE similarity (higher is better), a weight of 1.1–1.3 is usually enough to noticeably shift rankings without overriding semantic relevance entirely. Test with your actual data — if boosted results with low similarity start dominating, lower the weight.</p>
<p><strong>Can I combine multiple Boost Ranker rules?</strong>
Yes. Create multiple <code translate="no">Function</code> objects and combine them using <code translate="no">FunctionScore</code>. You control how rules interact through <code translate="no">boost_mode</code> (how each rule combines with the original score) and <code translate="no">function_mode</code> (how rules combine with each other) — both support <code translate="no">multiply</code> and <code translate="no">add</code>.</p>
