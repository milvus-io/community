---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >
  Introducing the Milvus Ngram Index: Faster Keyword Matching and LIKE Queries
  for Agent Workloads
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Learn how the Ngram Index in Milvus accelerates LIKE queries by turning
  substring matching into efficient n-gram lookups, delivering 100× faster
  performance.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>In agent systems, <strong>context retrieval</strong> is a foundational building block across the entire pipeline, providing the basis for downstream reasoning, planning, and action. Vector search helps agents retrieve semantically relevant context that captures intent and meaning across large and unstructured datasets. However, semantic relevance alone is often not enough. Agent pipelines also rely on full-text search to enforce exact keyword constraints—such as product names, function calls, error codes, or legally significant terms. This supporting layer ensures that retrieved context is not only relevant, but also explicitly satisfies hard textual requirements.</p>
<p>Real workloads consistently reflect this need:</p>
<ul>
<li><p>Customer support assistants must find conversations mentioning a specific product or ingredient.</p></li>
<li><p>Coding copilots look for snippets containing an exact function name, API call, or error string.</p></li>
<li><p>Legal, medical, and academic agents filter documents for clauses or citations that must appear verbatim.</p></li>
</ul>
<p>Traditionally, systems have handled this with the SQL <code translate="no">LIKE</code> operator. A query such as <code translate="no">name LIKE '%rod%'</code> is simple and widely supported, but under high concurrency and large data volumes, this simplicity carries major performance costs.</p>
<ul>
<li><p><strong>Without an index</strong>, a <code translate="no">LIKE</code> query scans the entire context store and applies pattern matching row by row. At millions of records, even a single query can take seconds—far too slow for real-time agent interactions.</p></li>
<li><p><strong>Even with a conventional inverted index</strong>, wildcard patterns such as <code translate="no">%rod%</code> remain hard to optimize because the engine must still traverse the entire dictionary and run pattern matching on each entry. The operation avoids row scans but remains fundamentally linear, resulting in only marginal improvements.</p></li>
</ul>
<p>This creates a clear gap in hybrid retrieval systems: vector search handles semantic relevance efficiently, but exact keyword filtering often becomes the slowest step in the pipeline.</p>
<p>Milvus natively supports hybrid vector and full-text search with metadata filtering. To address the limitations of keyword matching, Milvus introduces the <a href="https://milvus.io/docs/ngram.md"><strong>Ngram Index</strong></a>, which improves <code translate="no">LIKE</code> performance by splitting text into small substrings and indexing them for efficient lookup. This dramatically reduces the amount of data examined during query execution, delivering <strong>tens to hundreds of times faster</strong> <code translate="no">LIKE</code> queries in real agentic workloads.</p>
<p>The rest of this post walks through how the Ngram Index works in Milvus and evaluates its performance in real-world scenarios.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">What Is the Ngram Index?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>In databases, text filtering is commonly expressed using <strong>SQL</strong>, the standard query language used to retrieve and manage data. One of its most widely used text operators is <code translate="no">LIKE</code>, which supports pattern-based string matching.</p>
<p>LIKE expressions can be broadly grouped into four common pattern types, depending on how wildcards are used:</p>
<ul>
<li><p><strong>Infix match</strong> (<code translate="no">name LIKE '%rod%'</code>): Matches records where the substring rod appears anywhere in the text.</p></li>
<li><p><strong>Prefix match</strong> (<code translate="no">name LIKE 'rod%'</code>): Matches records whose text starts with rod.</p></li>
<li><p><strong>Suffix match</strong> (<code translate="no">name LIKE '%rod'</code>): Matches records whose text ends with rod.</p></li>
<li><p><strong>Wildcard match</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Combines multiple substring conditions (<code translate="no">%</code>) with single-character wildcards (<code translate="no">_</code>) in a single pattern.</p></li>
</ul>
<p>While these patterns differ in appearance and expressiveness, the <strong>Ngram Index</strong> in Milvus accelerates all of them using the same underlying approach.</p>
<p>Before building the index, Milvus splits each text value into short, overlapping substrings of fixed lengths, known as <em>n-grams</em>. For example, when n = 3, the word <strong>“Milvus”</strong> is decomposed into the following 3-grams: <strong>“Mil”</strong>, <strong>“ilv”</strong>, <strong>“lvu”</strong>, and <strong>“vus”</strong>. Each n-gram is then stored in an inverted index that maps the substring to the set of document IDs in which it appears. At query time, <code translate="no">LIKE</code> conditions are translated into combinations of n-gram lookups, allowing Milvus to quickly filter out most non-matching records and evaluate the pattern against a much smaller candidate set. This is what turns expensive string scans into efficient index-based queries.</p>
<p>Two parameters control how the Ngram Index is constructed: <code translate="no">min_gram</code> and <code translate="no">max_gram</code>. Together, they define the range of substring lengths that Milvus generates and indexes.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: The shortest substring length to index. In practice, this also sets the minimum query substring length that can benefit from the Ngram Index</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: The longest substring length to index. At query time, it additionally determines the maximum window size used when splitting longer query strings into n-grams.</p></li>
</ul>
<p>By indexing all contiguous substrings whose lengths fall between <code translate="no">min_gram</code> and <code translate="no">max_gram</code>, Milvus establishes a consistent and efficient foundation for accelerating all supported <code translate="no">LIKE</code> pattern types.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">How Does the Ngram Index Work?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus implements the Ngram Index in a two-phase process:</p>
<ul>
<li><p><strong>Build the index:</strong> Generate n-grams for each document and build an inverted index during data ingestion.</p></li>
<li><p><strong>Accelerate queries:</strong> Use the index to narrow the search to a small candidate set, then verify exact <code translate="no">LIKE</code> matches on those candidates.</p></li>
</ul>
<p>A concrete example makes this process easier to understand.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Phase 1: Build the index</h3><p><strong>Decompose text into n-grams:</strong></p>
<p>Assume we index the text <strong>“Apple”</strong> with the following settings:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>Under this setting, Milvus generates all contiguous substrings of length 2 and 3:</p>
<ul>
<li><p>2-grams: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-grams: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Build an inverted index:</strong></p>
<p>Now consider a small dataset of five records:</p>
<ul>
<li><p><strong>Document 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Document 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Document 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Document 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Document 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>During ingestion, Milvus generates n-grams for each record and inserts them into an inverted index. In this index:</p>
<ul>
<li><p><strong>Keys</strong> are n-grams (substrings)</p></li>
<li><p><strong>Values</strong> are lists of document IDs where the n-gram appears</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Now the index is fully built.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Phase 2: Accelerate queries</h3><p>When a <code translate="no">LIKE</code> filter is executed, Milvus uses the Ngram Index to speed up query evaluation through the following steps:</p>
<p><strong>1. Extract the query term:</strong> Contiguous substrings without wildcards are extracted from the <code translate="no">LIKE</code> expression (for example, <code translate="no">'%apple%'</code> becomes <code translate="no">apple</code>).</p>
<p><strong>2. Decompose the query term:</strong> The query term is decomposed into n-grams based on its length (<code translate="no">L</code>) and the configured <code translate="no">min_gram</code> and <code translate="no">max_gram</code>.</p>
<p><strong>3. Look for each gram &amp; intersect:</strong> Milvus looks up query n-grams in the inverted index and intersects their document ID lists to produce a small candidate set.</p>
<p><strong>4. Verify and return results:</strong> The original <code translate="no">LIKE</code> condition is applied only to this candidate set to determine the final result.</p>
<p>In practice, the way a query is split into n-grams depends on the shape of the pattern itself. To see how this works, we’ll focus on two common cases: infix matches and wildcard matches. Prefix and suffix matches behave the same as infix matches, so we won’t cover them separately.</p>
<p><strong>Infix match</strong></p>
<p>For an infix match, execution depends on the length of the literal substring (<code translate="no">L</code>) relative to <code translate="no">min_gram</code> and <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (e.g., <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>The literal substring <code translate="no">ppl</code> falls entirely within the configured n-gram range. Milvus directly looks up the n-gram <code translate="no">&quot;ppl&quot;</code> in the inverted index, producing the candidate document IDs <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Because the literal itself is an indexed n-gram, all candidates already satisfy the infix condition. The final verification step does not eliminate any records, and the result remains <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (e.g., <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>The literal substring <code translate="no">pple</code> is longer than <code translate="no">max_gram</code>, so it is decomposed into overlapping n-grams using a window size of <code translate="no">max_gram</code>. With <code translate="no">max_gram = 3</code>, this produces the n-grams <code translate="no">&quot;ppl&quot;</code> and <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus looks up each n-gram in the inverted index:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Intersecting these lists yields the candidate set <code translate="no">[0, 1, 4]</code>. The original <code translate="no">LIKE '%pple%'</code> filter is then applied to these candidates. All three satisfy the condition, so the final result remains <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (e.g., <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>The literal substring is shorter than <code translate="no">min_gram</code> and therefore cannot be decomposed into indexed n-grams. In this case, the Ngram Index cannot be used, and Milvus falls back to the default execution path, evaluating the <code translate="no">LIKE</code> condition through a full scan with pattern matching.</p>
<p><strong>Wildcard match</strong> (e.g., <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>This pattern contains multiple wildcards, so Milvus first splits it into contiguous literals: <code translate="no">&quot;Ap&quot;</code> and <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus then processes each literal independently:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> has length 2 and falls within the n-gram range.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> is longer than <code translate="no">max_gram</code> and is decomposed into <code translate="no">&quot;ppl&quot;</code> and <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>This reduces the query to the following n-grams:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Intersecting these lists produces a single candidate: <code translate="no">[0]</code>.</p>
<p>Finally, the original <code translate="no">LIKE '%Ap%pple%'</code> filter is applied to document 0 (<code translate="no">&quot;Apple&quot;</code>). Since it does not satisfy the full pattern, the final result set is empty.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Limitations and Trade-offs of the Ngram Index<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>While the Ngram Index can significantly improve <code translate="no">LIKE</code> query performance, it introduces trade-offs that should be considered in real-world deployments.</p>
<ul>
<li><strong>Increased index size</strong></li>
</ul>
<p>The primary cost of the Ngram Index is higher storage overhead. Because the index stores all contiguous substrings whose lengths fall between <code translate="no">min_gram</code> and <code translate="no">max_gram</code>, the number of generated n-grams grows quickly as this range expands. Each additional n-gram length effectively adds another full set of overlapping substrings for every text value, increasing both the number of index keys and their posting lists. In practice, expanding the range by just one character can roughly double the index size compared to a standard inverted index.</p>
<ul>
<li><strong>Not effective for all workloads</strong></li>
</ul>
<p>The Ngram Index does not accelerate every workload. If query patterns are highly irregular, contain very short literals, or fail to reduce the dataset to a small candidate set in the filtering phase, the performance benefit may be limited. In such cases, query execution can still approach the cost of a full scan, even though the index is present.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Evaluating Ngram Index Performance on LIKE Queries<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>The goal of this benchmark is to evaluate how effectively the Ngram Index accelerates <code translate="no">LIKE</code> queries in practice.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Test Methodology</h3><p>To put its performance in context, we compare it against two baseline execution modes:</p>
<ul>
<li><p><strong>Master</strong>: Brute-force execution without any index.</p></li>
<li><p><strong>Master-inverted</strong>: Execution using a conventional inverted index.</p></li>
</ul>
<p>We designed two test scenarios to cover different data characteristics:</p>
<ul>
<li><p><strong>Wiki text dataset</strong>: 100,000 rows, with each text field truncated to 1 KB.</p></li>
<li><p><strong>Single-word dataset</strong>: 1,000,000 rows, where each row contains a single word.</p></li>
</ul>
<p>Across both scenarios, the following settings are applied consistently:</p>
<ul>
<li><p>Queries use the <strong>infix match pattern</strong> (<code translate="no">%xxx%</code>)</p></li>
<li><p>The Ngram Index is configured with <code translate="no">min_gram = 2</code> and <code translate="no">max_gram = 4</code></p></li>
<li><p>To isolate query execution cost and avoid result materialization overhead, all queries return <code translate="no">count(*)</code> instead of full result sets.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Results</h3><p><strong>Test for wiki, each line is a wiki text with content length truncated by 1000, 100K rows</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Time(ms)</th><th>Speedup</th><th>Count</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>stadium</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Master-inverted</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngram</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>secondary school</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Master-inverted</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngram</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>is a coeducational, secondary school sponsore</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Master-inverted</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Test for single words, 1M rows</strong></p>
<table>
<thead>
<tr><th></th><th>Literal</th><th>Time(ms)</th><th>Speedup</th><th>Count</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Master-inverted</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Master-inverted</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Master-inverted</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Master-inverted</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nation</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Master-inverted</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> These results are based on benchmarks conducted in May. Since then, the Master branch has undergone additional performance optimizations, so the performance gap observed here is expected to be smaller in current versions.</p>
<p>The benchmark results highlight a clear pattern: the Ngram Index significantly accelerates LIKE queries in all cases, and how much faster the queries run depends strongly on the structure and length of the underlying text data.</p>
<ul>
<li><p>For <strong>long text fields</strong>, such as Wiki-style documents truncated to 1,000 bytes, the performance gains are especially pronounced. Compared to brute-force execution with no index, the Ngram Index achieves speedups of roughly <strong>100–200×</strong>. When compared against a conventional inverted index, the improvement is even more dramatic, reaching <strong>1,200–1,900×</strong>. This is because LIKE queries on long text are particularly expensive for traditional indexing approaches, while n-gram lookups can quickly narrow the search space to a very small set of candidates.</p></li>
<li><p>On datasets consisting of <strong>single-word entries</strong>, the gains are smaller but still substantial. In this scenario, the Ngram Index runs approximately <strong>80–100×</strong> faster than brute-force execution and <strong>45–55×</strong> faster than a conventional inverted index. Although shorter text is inherently cheaper to scan, the n-gram–based approach still avoids unnecessary comparisons and consistently reduces query cost.</p></li>
</ul>
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
    </button></h2><p>The Ngram Index accelerates <code translate="no">LIKE</code> queries by breaking text into fixed-length n-grams and indexing them using an inverted structure. This design turns expensive substring matching into efficient n-gram lookups followed by minimal verification. As a result, full-text scans are avoided while the exact semantics of <code translate="no">LIKE</code> are preserved.</p>
<p>In practice, this approach is effective across a wide range of workloads, with especially strong results for fuzzy matching on long text fields. The Ngram Index is therefore well suited for real-time scenarios such as code search, customer support agents, legal and medical document retrieval, enterprise knowledge bases, and academic search, where precise keyword matching remains essential.</p>
<p>At the same time, the Ngram Index benefits from careful configuration. Choosing appropriate <code translate="no">min_gram</code> and <code translate="no">max_gram</code> values is critical to balancing index size and query performance. When tuned to reflect real query patterns, the Ngram Index provides a practical, scalable solution for high-performance <code translate="no">LIKE</code> queries in production systems.</p>
<p>For more information about the Ngram Index, check the documentation below:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index | Milvus Documentation</a></li>
</ul>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Learn More about Milvus 2.6 Features<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization and Semantic Search</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88.9x Faster JSON Filtering with Flexibility</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM Capabilities in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Bringing Geospatial Filtering and Vector Search Together with Geometry Fields and RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introducing AISAQ in Milvus: Billion-Scale Vector Search Just Got 3,200× Cheaper on Memory</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimizing NVIDIA CAGRA in Milvus: A Hybrid GPU–CPU Approach to Faster Indexing and Cheaper Queries</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries with RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie — Vector DBs Deserve a Real Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">We Replaced Kafka/Pulsar with a Woodpecker for Milvus </a></p></li>
</ul>
