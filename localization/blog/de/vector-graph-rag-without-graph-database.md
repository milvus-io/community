---
id: vector-graph-rag-without-graph-database.md
title: |
  We Built Graph RAG Without the Graph Database
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >
  Open-source Vector Graph RAG adds multi-hop reasoning to RAG using only
  Milvus. 87.8% Recall@5, 2 LLM calls per query, no graph database needed.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>Do you actually need a graph database for Graph RAG? No. Put entities, relations, and passages into Milvus. Use subgraph expansion instead of graph traversal, and one LLM rerank instead of multi-round agent loops. That’s</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a><strong><em>,</em></strong> <em>and it’s what we built. This approach hits 87.8% average Recall@5 on three multi-hop QA benchmarks and beats HippoRAG 2 on a single Milvus instance.</em></p>
</blockquote>
<p>Multi-hop questions are the wall that most RAG pipelines hit eventually. The answer is in your corpus, but it spans multiple passages connected by entities the question never names. The common fix is to add a graph database, which means running two systems instead of one.</p>
<p>We kept hitting this wall ourselves and didn’t want to run two databases just to handle it. So we built and open-sourced <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>, a Python library that brings multi-hop reasoning to <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> using only <a href="https://milvus.io/docs">Milvus</a>, the most widely adopted open-source vector database. It provides the same multi-hop capability with one database instead of two.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Why Multi-Hop Questions Break Standard RAG<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Multi-hop questions break standard RAG because the answer depends on entity relationships that vector search can’t see. The bridge entity connecting the question to the answer often isn’t in the question itself.</p>
<p>Simple questions work fine. You chunk documents, embed them, retrieve the closest matches, and feed them to an LLM. “What indexes does Milvus support?” lives in one passage, and vector search finds it.</p>
<p>Multi-hop questions don’t fit that pattern. Take a question like <em>“What side effects should I watch for with first-line diabetes drugs?”</em> in a medical knowledge base.</p>
<p>Answering it takes two reasoning steps. First, the system has to know that metformin is the first-line drug for diabetes. Only then can it look up metformin’s side effects: kidney function monitoring, GI discomfort, vitamin B12 deficiency.</p>
<p>“Metformin” is the bridge entity. It connects the question to the answer, but the question never mentions it.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>That’s where <a href="https://zilliz.com/learn/vector-similarity-search">Vector similarity search</a> stops. It retrieves passages that look like the question, diabetes treatment guides and drug side effect lists, but it can’t follow the entity relationships that link those passages together. Facts like “metformin is the first-line drug for diabetes” live in those relationships, not in the text of any single passage.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Why Graph Databases and Agentic RAG Aren’t the Answer<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>The standard ways to solve multi-hop RAG are graph databases and iterative agent loops. Both work. Both cost more than most teams want to pay for a single feature.</p>
<p>Take the graph-database route first. You extract triples from your documents, store them in a graph database, and traverse edges to find multi-hop connections. That means running a second system alongside your <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a>, learning Cypher or Gremlin, and keeping the graph and vector stores in sync.</p>
<p>Iterative agent loops are the other approach. The LLM retrieves a batch, reasons over it, decides whether it has enough context, and retrieves again if not. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) makes 3-5 LLM calls per query. Agentic RAG can exceed 10 because the agent decides when to stop. Cost per query becomes unpredictable, and P99 latency spikes whenever the agent runs extra rounds.</p>
<p>Neither fits teams that want multi-hop reasoning without rebuilding their stack. So we tried something else.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">What is Vector Graph RAG, a Graph Structure Inside a Vector Database<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> is an open-source Python library that brings multi-hop reasoning to <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> using only <a href="https://milvus.io/docs">Milvus</a>. It stores graph structure as ID references across three Milvus collections. Traversal becomes a chain of primary-key lookups in Milvus instead of Cypher queries against a graph database. One Milvus does both jobs.</p>
<p>It works because relationships in a knowledge graph are just text. The triple <em>(which is metformin, is the first-line drug for type 2 diabetes)</em> is a directed edge in a graph database. It’s also a sentence: “Metformin is the first-line drug for type 2 diabetes.” You can embed that sentence as a vector and store it in <a href="https://milvus.io/docs">Milvus</a>, the same as any other text.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Answering a multi-hop query means following connections from what the query mentions (like “diabetes”) to what it doesn’t (like “metformin”). That only works if the storage preserves those connections: which entity connects to which through which relation. Plain text is searchable, but not followable.</p>
<p>To keep connections followable in Milvus, we give each entity and each relation a unique ID, then store them in separate collections that reference each other by ID. Three collections in total: <strong>entities</strong> (the nodes), <strong>relations</strong> (the edges), and <strong>passages</strong> (the source text, which the LLM needs for answer generation). Every row has a vector embedding, so we can semantic-search any of the three.</p>
<p><strong>Entities</strong> store deduplicated entities. Each has a unique ID, a <a href="https://zilliz.com/glossary/vector-embeddings">vector embedding</a> for <a href="https://zilliz.com/glossary/semantic-search">semantic search</a>, and a list of relation IDs it participates in.</p>
<table>
<thead>
<tr><th>id</th><th>name</th><th>embedding</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformin</td><td>[0.12, …]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>type 2 diabetes</td><td>[0.34, …]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>kidney function</td><td>[0.56, …]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>Relations</strong> store knowledge triples. Each records its subject and object entity IDs, the passage IDs it came from, and an embedding of the full relationship text.</p>
<table>
<thead>
<tr><th>id</th><th>subject_id</th><th>object_id</th><th>text</th><th>embedding</th><th>passage_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>Metformin is the first-line drug for type 2 diabetes</td><td>[0.78, …]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Patients on metformin should have kidney function monitored</td><td>[0.91, …]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Passages</strong> store original document chunks, with references to the entities and relations extracted from them.</p>
<p>The three collections point at each other through ID fields: entities carry the IDs of their relations, relations carry the IDs of their subject and object entities and source passages, and passages carry the IDs of everything extracted from them. That network of ID references is the graph.</p>
<p>Traversal is just a chain of ID lookups. You fetch entity e01 to get its <code translate="no">relation_ids</code>, fetch relations r01 and r02 by those IDs, read r01’s <code translate="no">object_id</code> to discover entity e02, and keep going. Each hop is a standard Milvus <a href="https://milvus.io/docs/get-and-scalar-query.md">primary-key query</a>. No Cypher required.</p>
<p>You might wonder whether the extra round trips to Milvus add up. They don’t. Subgraph expansion costs 2-3 ID-based queries totaling 20-30ms. The LLM call takes 1-3 seconds, which makes the ID lookups invisible next to it.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">How Vector Graph RAG Answers a Multi-Hop Query<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>The retrieval flow takes a multi-hop query to a grounded answer in four steps: <strong>seed retrieval → subgraph expansion → LLM rerank → answer generation.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We’ll walk through the diabetes question: <em>“What side effects should I watch for with first-line diabetes drugs?”</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Step 1: Seed Retrieval</h3><p>An LLM extracts key entities from the question: “diabetes,” “side effects,” “first-line drug.” Vector search in Milvus finds the most relevant entities and relations directly.</p>
<p>But metformin isn’t among them. The question doesn’t mention it, so vector search can’t find it.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Step 2: Subgraph Expansion</h3><p>This is where Vector Graph RAG diverges from standard RAG.</p>
<p>The system follows ID references from the seed entities one hop out. It gets the seed entity IDs, finds all relations containing those IDs, and pulls the new entity IDs into the subgraph. Default: one hop.</p>
<p><strong>Metformin, the bridge entity, enters the subgraph.</strong></p>
<p>“Diabetes” has a relation: <em>“Metformin is the first-line drug for type 2 diabetes.”</em> Following that edge brings metformin in. Once metformin is in the subgraph, its own relations come with it: <em>“Patients on metformin should have kidney function monitored,” “Metformin may cause gastrointestinal discomfort,” “Long-term metformin use may lead to vitamin B12 deficiency.”</em></p>
<p>Two facts that lived in separate passages are now connected through one hop of graph expansion. The bridge entity the question never mentioned is now discoverable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Step 3: LLM Rerank</h3><p>Expansion leaves you with dozens of candidate relations. Most are noise.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>The system sends these candidates and the original question to an LLM: “Which relate to side effects of first-line diabetes drugs?” It’s one call with no iteration.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>The selected relations cover the full chain: diabetes → metformin → kidney monitoring / GI discomfort / B12 deficiency.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Step 4: Answer Generation</h3><p>The system retrieves the original passages for the selected relations and sends them to the LLM.</p>
<p>The LLM generates from full passage text, not the trimmed triples. Triples are compressed summaries. They lack the context, caveats, and specifics the LLM needs to produce a grounded answer.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">See Vector Graph RAG in action</h3><p>We also built an interactive frontend that visualizes each step. Click through the steps panel on the left and the graph updates in real time: orange for seed nodes, blue for expanded nodes, green for selected relations. It makes the retrieval flow concrete instead of abstract.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Why One Rerank Beats Multiple Iterations<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Our pipeline makes two LLM calls per query: one for rerank, one for generation. Iterative systems like IRCoT and Agentic RAG run 3 to 10+ calls because they loop: retrieve, reason, retrieve again. We skip the loop because vector search and subgraph expansion cover both semantic similarity and structural connections in one pass, giving the LLM enough candidates to finish in one rerank.</p>
<table>
<thead>
<tr><th>Approach</th><th>LLM calls per query</th><th>Latency profile</th><th>Relative API cost</th></tr>
</thead>
<tbody>
<tr><td>Vector Graph RAG</td><td>2 (rerank + generate)</td><td>Fixed, predictable</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variable</td><td>~2-3x</td></tr>
<tr><td>Agentic RAG</td><td>5-10+</td><td>Unpredictable</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>In production, that’s roughly 60% lower API cost, 2-3x faster responses, and predictable latency. No surprise spikes when an agent decides to run extra rounds.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Benchmark Results<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG averages 87.8% Recall@5 across three standard multi-hop QA benchmarks, matching or exceeding every method we tested, including HippoRAG 2, with just Milvus and 2 LLM calls.</p>
<p>We evaluated on MuSiQue (2-4 hop, the hardest), HotpotQA (2 hop, the most widely used), and 2WikiMultiHopQA (2 hop, cross-document reasoning). The metric is Recall@5: whether the correct supporting passages appear in the top 5 retrieved results.</p>
<p>We used the exact same pre-extracted triples from the <a href="https://github.com/OSU-NLP-Group/HippoRAG">HippoRAG repository</a> for a fair comparison. No re-extraction, no custom preprocessing. The comparison isolates the retrieval algorithm itself.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> vs Standard (Naive) RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG lifts average Recall@5 from 73.4% to 87.8%, an improvement of 19.6 percentage points.</p>
<ul>
<li>MuSiQue: largest gain (+31.4 pp). 3-4 hop benchmark, the hardest multi-hop questions, and exactly where subgraph expansion has the biggest impact.</li>
<li>2WikiMultiHopQA: sharp improvement (+27.7 pp). Cross-document reasoning, another sweet spot for subgraph expansion.</li>
<li>HotpotQA: smaller gain (+6.1 pp), but standard RAG already scores 90.8% on this dataset. The ceiling is low.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> vs State-of-the-Art Methods (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG takes the highest average score at 87.8% against HippoRAG 2, IRCoT, and NV-Embed-v2.</p>
<p>Benchmark by benchmark:</p>
<ul>
<li>HotpotQA: ties HippoRAG 2 (both 96.3%)</li>
<li>2WikiMultiHopQA: leads by 3.7 points (94.1% vs 90.4%)</li>
<li>MuSiQue (the hardest): trails by 1.7 points (73.0% vs 74.7%)</li>
</ul>
<p>Vector Graph RAG achieves these numbers with only 2 LLM calls per query, no graph database, and no ColBERTv2. It runs on the simplest infrastructure in the comparison and still takes the highest average.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">How <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> Compares to Other Graph RAG Approaches<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Different Graph RAG approaches optimize for different problems. Vector Graph RAG is built for production multi-hop QA with predictable cost and simple infrastructure.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infrastructure</strong></td><td>Graph DB + vector DB</td><td>ColBERTv2 + in-memory graph</td><td>Vector DB + multi-round agents</td><td><strong>Milvus only</strong></td></tr>
<tr><td><strong>LLM calls per query</strong></td><td>Varies</td><td>Moderate</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Best for</strong></td><td>Global corpus summarization</td><td>Fine-grained academic retrieval</td><td>Complex open-ended exploration</td><td><strong>Production multi-hop QA</strong></td></tr>
<tr><td><strong>Scaling concern</strong></td><td>Expensive LLM indexing</td><td>Full graph in memory</td><td>Unpredictable latency and cost</td><td><strong>Scales with Milvus</strong></td></tr>
<tr><td><strong>Setup complexity</strong></td><td>High</td><td>Medium-High</td><td>Medium</td><td><strong>Low (pip install)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> uses hierarchical community clustering to answer global summarization questions like ‘what are the main themes across this corpus?’ That’s a different problem than multi-hop QA.&quot;</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) uses cognitive-inspired retrieval with ColBERTv2 token-level matching. Loading the full graph into memory limits scalability.</p>
<p>Iterative approaches like <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> trade infrastructure simplicity for LLM cost and unpredictable latency.</p>
<p>Vector Graph RAG targets production multi-hop QA: teams that want predictable cost and latency without adding a graph database.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">When to Use Vector Graph RAG and Key Use Cases<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG is built for four kinds of workloads:</p>
<table>
<thead>
<tr><th>Scenario</th><th>Why it fits</th></tr>
</thead>
<tbody>
<tr><td><strong>Knowledge-dense documents</strong></td><td>Legal codes with cross-references, biomedical literature with drug-gene-disease chains, financial filings with company-person-event links, technical docs with API dependency graphs</td></tr>
<tr><td><strong>2-4 hop questions</strong></td><td>One-hop questions work fine with standard RAG. Five or more hops may need iterative methods. The 2-4 hop range is subgraph expansion’s sweet spot.</td></tr>
<tr><td><strong>Simple deployment</strong></td><td>One database, one <code translate="no">pip install</code>, no graph infrastructure to learn</td></tr>
<tr><td><strong>Cost and latency sensitivity</strong></td><td>Two LLM calls per query, fixed and predictable. At thousands of daily queries, the difference adds up.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Get Started with Vector Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> with no arguments defaults to <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. It creates a local <code translate="no">.db</code> file, like SQLite. No server to start, nothing to configure.</p>
<p><code translate="no">add_texts()</code> calls an LLM to extract triples from your text, vectorizes them, and stores everything in Milvus. <code translate="no">query()</code> runs the full four-step retrieval flow: seed, expand, rerank, generate.</p>
<p>For production, swap one URI parameter. The rest of the code stays the same:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>To import PDFs, web pages, or Word files:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG doesn’t need a graph database. Vector Graph RAG stores graph structure as ID references across three Milvus collections, which turns graph traversal into primary-key lookups and keeps every multi-hop query at a fixed two LLM calls.</p>
<p>At a glance:</p>
<ul>
<li>Open-source Python library. Multi-hop reasoning on Milvus alone.</li>
<li>Three collections linked by ID. Entities (nodes), relations (edges), passages (source text). Subgraph expansion follows the IDs to discover bridge entities the query doesn’t mention.</li>
<li>Two LLM calls per query. One rerank, one generation. No iteration.</li>
<li>87.8% average Recall@5 across MuSiQue, HotpotQA, and 2WikiMultiHopQA, matching or beating HippoRAG 2 on two of three.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Try it:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> for the code</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Docs</a> for the full API and examples</li>
<li>Join the <a href="https://slack.milvus.io/">Milvus</a> <a href="https://discord.com/invite/8uyFbECzPX">community</a> <a href="https://slack.milvus.io/">on Discord</a> to ask questions and share feedback</li>
<li><a href="https://milvus.io/office-hours">Book a Milvus Office Hours session</a> to walk through your use case</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> offers a free tier with managed Milvus if you’d rather skip infrastructure setup</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">FAQ<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Can I do Graph RAG with just a vector database?</h3><p>Yes. Vector Graph RAG stores knowledge graph structure (entities, relations, and their connections) inside three Milvus collections linked by ID cross-references. Instead of traversing edges in a graph database, it chains primary-key lookups in Milvus to expand a subgraph around seed entities. This achieves 87.8% average Recall@5 on three standard multi-hop benchmarks without any graph database infrastructure.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">How does Vector Graph RAG compare to Microsoft GraphRAG?</h3><p>They solve different problems. Microsoft GraphRAG uses hierarchical community clustering for global corpus summarization (“What are the main themes across these documents?”). Vector Graph RAG focuses on multi-hop question answering, where the goal is to chain specific facts across passages. Vector Graph RAG needs only Milvus and two LLM calls per query. Microsoft GraphRAG requires a graph database and carries higher indexing costs.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">What types of questions benefit from multi-hop RAG?</h3><p>Multi-hop RAG helps with questions where the answer depends on connecting information scattered across multiple passages, especially when a key entity never appears in the question. Examples include “What side effects does the first-line diabetes drug have?” (requires discovering metformin as the bridge), cross-reference lookups in legal or regulatory text, and dependency chain tracing in technical documentation. Standard RAG handles single-fact lookups well. Multi-hop RAG adds value when the reasoning path is two to four steps long.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Do I need to extract knowledge graph triples manually?</h3><p>No. <code translate="no">add_texts()</code> and <code translate="no">add_documents()</code> automatically call an LLM to extract entities and relationships, vectorize them, and store them in Milvus. You can import documents from URLs, PDFs, and DOCX files using the built-in <code translate="no">DocumentImporter</code>. For benchmarking or migration, the library supports importing pre-extracted triples from other frameworks like HippoRAG.</p>
