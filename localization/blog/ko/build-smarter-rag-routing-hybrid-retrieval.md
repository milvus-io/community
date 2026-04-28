---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >
  Beyond Naive RAG: Build Smarter Systems with Query Routing and Hybrid
  Retrieval
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >
  Learn how modern RAG systems use query routing, hybrid retrieval, and
  stage-by-stage evaluation to deliver better answers at lower cost.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>Your <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> pipeline retrieves documents for every query, regardless of whether retrieval is needed. It runs the same similarity search on code, natural language, and financial reports. And when results are bad, you have no way to tell which stage broke.</p>
<p>These are symptoms of naive RAG—a fixed pipeline that treats every query the same way. Modern RAG systems work differently. They route queries to the right handler, combine multiple retrieval methods, and evaluate each stage independently.</p>
<p>This article walks through a four-node architecture for building smarter RAG systems, explains how to implement <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">hybrid retrieval</a> without maintaining separate indexes, and shows how to evaluate each pipeline stage so you can debug problems faster.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Why Long Context Doesn’t Replace RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>“Just put everything in the prompt” is a common suggestion now that models support 128K+ token windows. It doesn’t hold up in production for two reasons.</p>
<p><strong>Cost scales with your knowledge base, not your query.</strong> Every request sends the full knowledge base through the model. For a 100K-token corpus, that’s 100K input tokens per request—regardless of whether the answer requires one paragraph or ten. Monthly inference costs grow linearly with corpus size.</p>
<p><strong>Attention degrades with context length.</strong> Models struggle to focus on relevant information buried in long contexts. Research on the “lost in the middle” effect (Liu et al., 2023) shows that models are more likely to miss information placed in the middle of long inputs. Larger context windows haven’t solved this—attention quality hasn’t kept pace with window size.</p>
<p>RAG avoids both problems by retrieving only the relevant passages before generation. The question isn’t whether RAG is needed—it’s how to build RAG that actually works.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">What’s Wrong with Traditional RAG?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Traditional RAG follows a fixed pipeline: embed the query, run <a href="https://zilliz.com/learn/what-is-vector-search">vector similarity search</a>, take the top-K results, generate an answer. Every query follows the same path.</p>
<p>This creates two problems:</p>
<ol>
<li><p><strong>Wasted compute on trivial queries.</strong> “What is 2 + 2?” doesn’t need retrieval, but the system runs it anyway—adding latency and cost for no benefit.</p></li>
<li><p><strong>Brittle retrieval on complex queries.</strong> Ambiguous phrasing, synonyms, or mixed-language queries often defeat pure vector similarity. When retrieval misses relevant documents, generation quality drops with no fallback.</p></li>
</ol>
<p>The fix: add decision-making before retrieval. A modern RAG system decides <em>whether</em> to retrieve, <em>what</em> to search for, and <em>how</em> to search—rather than blindly running the same pipeline every time.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">How Modern RAG Systems Work: A Four-Node Architecture<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Instead of a fixed pipeline, a modern RAG system routes each query through four decision nodes. Each node answers one question about how to handle the current query.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Node 1: Query Routing — Does This Query Need Retrieval?</h3><p>Query routing is the first decision in the pipeline. It classifies the incoming query and sends it down the appropriate path:</p>
<table>
<thead>
<tr><th>Query Type</th><th>Example</th><th>Action</th></tr>
</thead>
<tbody>
<tr><td>Common-sense / general knowledge</td><td>“What is 2 + 2?”</td><td>Answer directly with the LLM—skip retrieval</td></tr>
<tr><td>Knowledge-base question</td><td>“What are the specs for Model X?”</td><td>Route to the retrieval pipeline</td></tr>
<tr><td>Real-time information</td><td>“Weather in Paris this weekend”</td><td>Call an external API</td></tr>
</tbody>
</table>
<p>Routing upfront avoids unnecessary retrieval for queries that don’t need it. In systems where a large share of queries are simple or general-knowledge, this alone can cut compute costs significantly.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Node 2: Query Rewriting — What Should the System Search For?</h3><p>User queries are often vague. A question like “the main numbers in LightOn’s Q3 report” doesn’t translate well into a search query.</p>
<p>Query rewriting transforms the original question into structured search conditions:</p>
<ul>
<li><strong>Time range:</strong> July 1 – September 30, 2025 (Q3)</li>
<li><strong>Document type:</strong> Financial report</li>
<li><strong>Entity:</strong> LightOn, Finance department</li>
</ul>
<p>This step bridges the gap between how users ask questions and how retrieval systems index documents. Better queries mean fewer irrelevant results.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Node 3: Retrieval Strategy Selection — How Should the System Search?</h3><p>Different content types need different retrieval strategies. A single method can’t cover everything:</p>
<table>
<thead>
<tr><th>Content Type</th><th>Best Retrieval Method</th><th>Why</th></tr>
</thead>
<tbody>
<tr><td>Code (variable names, function signatures)</td><td>Lexical search (<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>)</td><td>Exact keyword matching works well on structured tokens</td></tr>
<tr><td>Natural language (docs, articles)</td><td>Semantic search (dense vectors)</td><td>Handles synonyms, paraphrases, and intent</td></tr>
<tr><td>Multimodal (charts, diagrams, drawings)</td><td>Multimodal retrieval</td><td>Captures visual structure that text extraction misses</td></tr>
</tbody>
</table>
<p>Documents are tagged with metadata at indexing time. At query time, these tags guide both which documents to search and which retrieval method to use.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Node 4: Minimal-Context Generation — How Much Context Does the Model Need?</h3><p>After retrieval and <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">reranking</a>, the system sends only the most relevant passages to the model—not entire documents.</p>
<p>This matters more than it sounds. Compared with full-document loading, passing only the relevant passages can reduce token usage by over 90%. Lower token counts mean faster responses and lower costs, even when caching is in play.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Why Hybrid Retrieval Matters for Enterprise RAG<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In practice, retrieval strategy selection (Node 3) is where most teams get stuck. No single retrieval method covers all enterprise document types.</p>
<p>Some argue that keyword search is sufficient—after all, Claude Code’s grep-based code search works well. But code is highly structured, with consistent naming conventions. Enterprise documents are a different story.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Enterprise Documents Are Messy</h3><p><strong>Synonyms and varied phrasing.</strong> “Optimize memory usage” and “reduce memory footprint” mean the same thing but use different words. Keyword search matches one and misses the other. In multilingual environments—Chinese with word segmentation, Japanese with mixed scripts, German with compound words—the problem multiplies.</p>
<p><strong>Visual structure matters.</strong> Engineering drawings depend on layout. Financial reports rely on tables. Medical images depend on spatial relationships. OCR extracts text but loses structure. Text-only retrieval can’t handle these documents reliably.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">How to Implement Hybrid Retrieval</h3><p>Hybrid retrieval combines multiple search methods—typically <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 for keyword matching and dense vectors for semantic search</a>—to cover what neither method handles alone.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The traditional approach runs two separate systems: one for BM25, one for vector search. Each query hits both, and results are merged afterward. It works, but it comes with real overhead:</p>
<table>
<thead>
<tr><th></th><th>Traditional (Separate Systems)</th><th>Unified (Single Collection)</th></tr>
</thead>
<tbody>
<tr><td>Storage</td><td>Two separate indexes</td><td>One collection, both vector types</td></tr>
<tr><td>Data sync</td><td>Must keep two systems in sync</td><td>Single write path</td></tr>
<tr><td>Query path</td><td>Two queries + result merging</td><td>One API call, automatic fusion</td></tr>
<tr><td>Tuning</td><td>Adjust merge weights across systems</td><td>Change dense/sparse weight in one query</td></tr>
<tr><td>Operational complexity</td><td>High</td><td>Low</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 supports both dense vectors (for semantic search) and sparse vectors (for BM25-style keyword search) in the same collection. A single API call returns fused results, with retrieval behavior adjustable by changing the weight between vector types. No separate indexes, no sync issues, no merge latency.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">How to Evaluate a RAG Pipeline Stage by Stage<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Checking only the final answer isn’t enough. RAG is a multi-stage pipeline, and a failure at any stage propagates downstream. If you only measure answer quality, you can’t tell whether the problem is in routing, rewriting, retrieval, reranking, or generation.</p>
<p>When users report “inaccurate results,” the root cause could be anywhere: routing may skip retrieval when it shouldn’t; query rewriting may drop key entities; retrieval may miss relevant documents; reranking may bury good results; or the model may ignore the retrieved context entirely.</p>
<p>Evaluate each stage with its own metrics:</p>
<table>
<thead>
<tr><th>Stage</th><th>Metric</th><th>What It Catches</th></tr>
</thead>
<tbody>
<tr><td>Routing</td><td>F1 score</td><td>High false-negative rate = queries needing retrieval are skipped</td></tr>
<tr><td>Query rewriting</td><td>Entity extraction accuracy, synonym coverage</td><td>Rewritten query drops important terms or changes intent</td></tr>
<tr><td>Retrieval</td><td>Recall@K, NDCG@10</td><td>Relevant documents aren’t retrieved, or are ranked too low</td></tr>
<tr><td>Reranking</td><td>Precision@3</td><td>Top results aren’t actually relevant</td></tr>
<tr><td>Generation</td><td>Faithfulness, answer completeness</td><td>Model ignores retrieved context or gives partial answers</td></tr>
</tbody>
</table>
<p><strong>Set up layered monitoring.</strong> Use offline test sets to define baseline metric ranges for each stage. In production, trigger alerts when any stage drops below its baseline. This lets you catch regressions early and trace them to a specific stage—instead of guessing.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">What to Build First<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Three priorities stand out from real-world RAG deployments:</p>
<ol>
<li><p><strong>Add routing early.</strong> Many queries don’t need retrieval at all. Filtering them upfront reduces load and improves response time with minimal engineering effort.</p></li>
<li><p><strong>Use unified hybrid retrieval.</strong> Maintaining separate BM25 and vector search systems doubles storage costs, creates sync complexity, and adds merge latency. A unified system like Milvus 2.6—where dense and sparse vectors live in the same collection—eliminates these issues.</p></li>
<li><p><strong>Evaluate each stage independently.</strong> End-to-end answer quality alone is not a useful signal. Per-stage metrics (F1 for routing, Recall@K and NDCG for retrieval) let you debug faster and avoid breaking one stage while tuning another.</p></li>
</ol>
<p>The real value of a modern RAG system isn’t just retrieval—it’s knowing <em>when</em> to retrieve and <em>how</em> to retrieve. Start with routing and unified hybrid search, and you’ll have a foundation that scales.</p>
<hr>
<p>If you’re building or upgrading a RAG system and running into retrieval quality issues, we’d love to help:</p>
<ul>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to ask questions, share your architecture, and learn from other developers working on similar problems.</li>
<li><a href="https://milvus.io/office-hours">Book a free 20-minute Milvus Office Hours session</a> to walk through your use case—whether it’s routing design, hybrid retrieval setup, or multi-stage evaluation.</li>
<li>If you’d rather skip the infrastructure setup, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) offers a free tier to get started.</li>
</ul>
<hr>
<p>A few questions that come up often when teams start building smarter RAG systems:</p>
<p><strong>Q: Is RAG still necessary now that models support 128K+ context windows?</strong></p>
<p>Yes. Long context windows help when you need to process a single large document, but they don’t replace retrieval for knowledge-base queries. Sending your entire corpus with every request drives up costs linearly, and models lose focus on relevant information in long contexts—a well-documented issue known as the “lost in the middle” effect (Liu et al., 2023). RAG retrieves only what’s relevant, keeping costs and latency predictable.</p>
<p><strong>Q: How do I combine BM25 and vector search without running two separate systems?</strong></p>
<p>Use a vector database that supports both dense and sparse vectors in the same collection. Milvus 2.6 stores both vector types per document and returns fused results from a single query. You adjust the balance between keyword and semantic matching by changing a weight parameter—no separate indexes, no result merging, no sync headaches.</p>
<p><strong>Q: What’s the first thing I should add to improve my existing RAG pipeline?</strong></p>
<p>Query routing. It’s the highest-impact, lowest-effort improvement. Most production systems see a significant share of queries that don’t need retrieval at all—common-sense questions, simple calculations, general knowledge. Routing these directly to the LLM cuts unnecessary retrieval calls and improves response time immediately.</p>
<p><strong>Q: How do I figure out which stage of my RAG pipeline is causing bad results?</strong></p>
<p>Evaluate each stage independently. Use F1 score for routing accuracy, Recall@K and NDCG@10 for retrieval quality, Precision@3 for reranking, and faithfulness metrics for generation. Set baselines from offline test data and monitor each stage in production. When answer quality drops, you can trace it to the specific stage that regressed instead of guessing.</p>
