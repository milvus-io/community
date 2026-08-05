---
id: milvus-3-0-regex-filtering.md
title: 超越 =~：Milvus 3.0 如何將正規表示式轉化為原生資料庫原生篩選器
author: Buqian Zheng
date: 2026-8-5
cover: assets.zilliz.com/regex_optimization_pipeline_with_milvus_57a9037801.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, vector search, regex filtering, full-text search'
meta_title: |
  Beyond =~: How Milvus 3.0 Turns Regex into a Native Database Filter
desc: Milvus 3.0 將 regex 從應用程式端的後處理移入資料庫查詢路徑，使其能與向量搜尋、全文搜尋、純量篩選器和索引化執行結合使用。
origin: 'https://milvus.io/blog/milvus-3-0-regex-filtering.md'
---
<p>Vector search can find logs that are semantically similar to an incident. During an outage, however, similarity is only the first cut. Engineers often need to narrow those results with structural rather than semantic constraints.</p>
<p>Consider a failure in the checkout service. We want logs related to the incident at hand, but only from <code translate="no">checkout</code>. The message must contain an error code in the form of <code translate="no">E</code> followed by four digits, and that code must appear before <code translate="no">timeout</code>.</p>
<pre><code translate="no" class="language-python">results = client.search(
    collection_name=<span class="hljs-string">&quot;logs&quot;</span>,
    data=[incident_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">r&#x27;service == &quot;checkout&quot; and message =~ r&quot;E[0-9]{4}:.*timeout&quot;&#x27;</span>,
    limit=<span class="hljs-number">20</span>,
    output_fields=[<span class="hljs-string">&quot;timestamp&quot;</span>, <span class="hljs-string">&quot;service&quot;</span>, <span class="hljs-string">&quot;message&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Vector search and regex do different jobs in this query. Vector similarity retrieves logs that resemble the incident; the regex filter keeps only those that match the failure signature we care about.</p>
<p>Milvus 3.0 adds the <code translate="no">=~</code> and <code translate="no">!~</code> operators for this type of filter. Supporting those operators in a database involves more than parsing regex syntax: <strong>Milvus must validate user-supplied patterns, preserve null and negation semantics, integrate regex with query planning and indexing, and keep its cost predictable across millions of strings.</strong></p>
<p>With the latest release, Milvus 3.0 moves regex from application-side post-processing into the database query path, where it can be combined with vector search, full-text search, scalar filters, and indexed execution. This article discusses those design choices, from operator semantics and RE2 validation to raw execution, NGRAM candidate generation, and benchmark results.</p>
<h2 id="Where-regex-fits-in-Milvus-filtering" class="common-anchor-header">Where regex fits in Milvus filtering<button data-href="#Where-regex-fits-in-Milvus-filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Before regex support, Milvus could already express simple string patterns with <code translate="no">LIKE</code>:</p>
<pre><code translate="no"><span class="hljs-title class_">Plaintext</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;ERROR%&quot;</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;%timeout%&quot;</span>
message <span class="hljs-variable constant_">LIKE</span> <span class="hljs-string">&quot;node_12_&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">LIKE</code> is simple and readable. For prefix, suffix, and ordinary contains filters, it also gives the execution engine an opportunity to use a more direct path. Its expressive range, however, stops at two wildcard rules: <code translate="no">%</code> for zero or more characters and <code translate="no">_</code> for exactly one character.</p>
<p><code translate="no">Like</code> is not enough for patterns such as:</p>
<ul>
<li>Error codes: <code translate="no">E[0-9]{4}</code></li>
<li>Semantic versions: <code translate="no">v[0-9]+.[0-9]+.[0-9]+</code></li>
<li>Multiple states: <code translate="no">ERROR|WARN</code></li>
<li>URL routes: <code translate="no">^/api/v[0-9]+/users/[0-9]+$</code></li>
<li>Required ordering: <code translate="no">checkout.*timeout</code></li>
<li>Case-insensitive text: <code translate="no">(?i)connection refused</code></li>
</ul>
<p>Decomposing these structures into a large set of <code translate="no">LIKE</code>, range, and Boolean expressions is difficult to maintain and easy to get wrong at the edges. <strong>Regex fills the gap between simple wildcard matching and token-based or semantic retrieval.</strong> It describes string structure; it does not replace full-text relevance or vector similarity.</p>
<p>The clearest operator is usually the best one to use:</p>
<table>
<thead>
<tr><th>Requirement</th><th>Recommended operation</th></tr>
</thead>
<tbody>
<tr><td>Exact value</td><td><code translate="no">==</code> / <code translate="no">IN</code></td></tr>
<tr><td>Simple prefix, suffix, or substring</td><td><code translate="no">LIKE</code></td></tr>
<tr><td>Character classes, repetition, anchors, or structural order</td><td>Regex <code translate="no">=~</code> / <code translate="no">!~</code></td></tr>
<tr><td>Token-level lexical relevance</td><td><code translate="no">text_match</code> / BM25</td></tr>
<tr><td>Ordered phrases</td><td><code translate="no">phrase_match</code></td></tr>
<tr><td>Typographical variation</td><td>Milvus currently has no native fuzzy match; handle it in the application layer</td></tr>
</tbody>
</table>
<p>A pattern such as <code translate="no">^ERROR</code> or <code translate="no">timeout$</code> is a valid regex, and the parser may rewrite it to a cheaper execution path. Even so, choosing the operator that states the intent most directly makes filters easier to read and maintain.</p>
<h2 id="User-facing-semantics---anchors-and-raw-strings" class="common-anchor-header">User-facing semantics: <code translate="no">=~</code>, <code translate="no">!~</code>, anchors, and raw strings<button data-href="#User-facing-semantics---anchors-and-raw-strings" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 uses <code translate="no">=~</code> for a positive regex match and <code translate="no">!~</code> for a negative match:</p>
<ul>
<li><code translate="no">message =~ &quot;E[0-9]{4}&quot;</code> keeps rows whose string contains a matching error code.</li>
<li><code translate="no">message !~ &quot;DEBUG|TRACE&quot;</code> excludes rows whose string matches either alternative.</li>
<li><code translate="no">message =~ &quot;timeout&quot;</code> uses substring semantics and matches any string containing <code translate="no">timeout</code>.</li>
<li><code translate="no">message =~ &quot;^timeout$&quot;</code> uses <code translate="no">^</code> and <code translate="no">$</code> to require a full-string match.</li>
</ul>
<p>Regex can target several kinds of string values. For arrays and StructArray fields, the expression must identify a specific string element or string subfield:</p>
<ul>
<li>A <code translate="no">VARCHAR</code> field: <code translate="no">message =~ r&quot;timeout&quot;</code></li>
<li>A JSON path that resolves to a string: <code translate="no">metadata[&quot;error_message&quot;] =~ r&quot;E[0-9]{4}:.*timeout&quot;</code></li>
<li>One element of an <code translate="no">ARRAY&lt;VARCHAR&gt;</code>: <code translate="no">tags[0] =~ r&quot;release-v[0-9]+&quot;</code></li>
<li>A <code translate="no">VARCHAR</code> subfield inside a StructArray expression: <code translate="no">MATCH_ANY(events, $[name] =~ r&quot;error.*timeout&quot;)</code></li>
</ul>
<h2 id="Raw-strings-keep-escaping-manageable" class="common-anchor-header">Raw strings keep escaping manageable<button data-href="#Raw-strings-keep-escaping-manageable" class="anchor-icon" translate="no">
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
    </button></h2><p>Regex patterns frequently contain backslashes. Milvus 3.0 supports raw string literals in filter expressions. For example:</p>
<pre><code translate="no" class="language-python">filter_expr = <span class="hljs-string">r&#x27;message =~ r&quot;\d+.\d+.\d+&quot;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>The inner <code translate="no">r&quot;...&quot;</code> tells the Milvus expression parser to preserve the backslashes. The outer Python raw string then keeps the application language, Milvus expression, and regex layers from multiplying the escaping rules.</p>
<p>Filter templates work with regex as well:</p>
<pre><code translate="no" class="language-python">client.query(
    collection_name=<span class="hljs-string">&quot;logs&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;message =~ {pattern}&quot;</span>,
    filter_params={<span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">r&quot;E[0-9]{4}:.*timeout&quot;</span>},
    output_fields=[<span class="hljs-string">&quot;message&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Passing the pattern as a template parameter is safer than concatenating an expression string and lets the same query template be reused.</p>
<h2 id="Why-Milvus-uses-RE2-database-regex-must-have-predictable-cost" class="common-anchor-header">Why Milvus uses RE2: database regex must have predictable cost<button data-href="#Why-Milvus-uses-RE2-database-regex-must-have-predictable-cost" class="anchor-icon" translate="no">
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
    </button></h2><p>Many regex engines use backtracking. A carefully constructed pattern can force their execution time to grow exponentially with the input length, a failure mode commonly called catastrophic backtracking or regular expression denial of service (ReDoS).</p>
<p>In a local script, a pathological pattern can stall one process. In a database, the pattern is query input. One request may apply it to millions of rows while many users submit other patterns concurrently. If worst-case execution is unbounded, an ordinary-looking filter can exhaust CPU across the service.</p>
<p>Milvus uses RE2 because it guarantees matching time that is linear in the input length. <strong>The tradeoff is deliberate: RE2 does not support constructs that depend on backtracking, including:</strong></p>
<ul>
<li>Backreferences</li>
<li>Lookahead</li>
<li>Lookbehind</li>
</ul>
<p><strong>Milvus favors predictable execution over the largest possible regex syntax. Before a filter reaches the scan path, the expression parser compiles and validates its pattern. An invalid regex returns an error before Milvus begins scanning the data.</strong></p>
<h2 id="From-syntax-to-execution-a-layered-path" class="common-anchor-header">From syntax to execution: a layered path<button data-href="#From-syntax-to-execution-a-layered-path" class="anchor-icon" translate="no">
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
    </button></h2><p>The simplest implementation would compile a pattern and call RE2 once for every row. That would produce correct matches, but it would ignore structure the database already knows about the pattern, the rest of the filter, and available indexes.</p>
<p>Milvus instead uses a layered execution path. Each layer applies only reductions that preserve correctness. When the engine cannot prove that a shortcut is safe, it falls back to full RE2 verification.</p>
<h3 id="1-Rewrite-regex-that-is-really-a-cheaper-string-operation" class="common-anchor-header">1. Rewrite regex that is really a cheaper string operation</h3><p>Some regex patterns do not need the regex engine at all:</p>
<table>
<thead>
<tr><th>Pattern</th><th>Rewritten operation</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR$</code></td><td>Equality</td></tr>
<tr><td><code translate="no">^ERROR</code></td><td>Prefix match</td></tr>
<tr><td><code translate="no">ERROR$</code></td><td>Suffix match</td></tr>
</tbody>
</table>
<p>The parser recognizes these anchored literals and rewrites them to cheaper operations.</p>
<p>An unanchored literal such as <code translate="no">ERROR</code> has different semantics: it asks whether <code translate="no">ERROR</code> occurs anywhere in the string. In the current implementation, anchored simple patterns become equality, prefix, or suffix operations, while an ordinary unanchored literal remains a <code translate="no">RegexMatch</code> expression.</p>
<h3 id="2-Treat-regex-as-a-heavy-predicate" class="common-anchor-header">2. Treat regex as a heavy predicate</h3><p>Consider a compound filter:</p>
<pre><code translate="no">Plaintext
service_id == <span class="hljs-number">42</span> <span class="hljs-keyword">and</span> message =~ <span class="hljs-string">r&quot;E[0-9]{4}:.*timeout&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>A numeric equality check or an existing indexed filter is usually cheaper than regex. Milvus marks regex as a heavy predicate so the planner can run cheaper conditions first and apply RE2 to the smaller candidate set.</p>
<p>The benchmark later in this article intentionally excludes vector search and compound filters, so it does not mix approximate nearest neighbor (ANN), scalar-index, and regex costs. In production queries, predicate ordering remains part of the complete execution path.</p>
<h3 id="3-On-the-raw-path-compile-once-and-prefilter-required-literals" class="common-anchor-header">3. On the raw path, compile once and prefilter required literals</h3><p>Without an NGRAM index, a sealed segment reads the original strings and evaluates the match. Milvus reuses a compiled RE2 pattern at segment scope instead of compiling it once per row.</p>
<p>For a pattern with stable required literals, such as:</p>
<pre><code translate="no">Plaintext
ERROR.*<span class="hljs-built_in">timeout</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus can first use Volnitsky string search to find rows that may contain the required literals. Only those rows proceed to exact RE2 verification.</p>
<p>Volnitsky is a prefilter, not a substitute for regex. A string that contains both <code translate="no">ERROR</code> and <code translate="no">timeout</code> does not necessarily satisfy their order or the full pattern. The prefilter’s job is only to reduce the number of more expensive RE2 calls.</p>
<h3 id="4-With-NGRAM-generate-candidates-first-and-verify-them-with-RE2" class="common-anchor-header">4. With NGRAM, generate candidates first and verify them with RE2</h3><p>For large sealed datasets, a string field can carry an NGRAM index:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;message&quot;</span>,
    index_type=<span class="hljs-string">&quot;NGRAM&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;min_gram&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;max_gram&quot;</span>: <span class="hljs-number">4</span>},
)
client.create_index(<span class="hljs-string">&quot;logs&quot;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<p>NGRAM does not execute the regex itself. It introduces a two-phase path:</p>
<ol>
<li>Conservatively extract literals that must occur in every match.</li>
<li>Split those literals into n-grams and intersect their posting lists to produce a candidate bitmap.</li>
<li>Read the original strings only for candidate rows.</li>
<li>Run RE2 on those candidates to produce the exact result.</li>
</ol>
<p>For <code translate="no">ERROR.*timeout</code>, suppose only 0.1% of 10 million rows contain the required literals. Phase 1 can remove almost the entire dataset before RE2 runs. The performance gain comes from candidate reduction, not from approximating regex.</p>
<p>This separation also protects correctness. A condition that cannot be extracted safely is not allowed to eliminate rows, and RE2 still decides every final match. The NGRAM coarse filter therefore does not introduce false negatives.</p>
<h3 id="5-Fall-back-when-candidate-reduction-is-not-provably-safe" class="common-anchor-header">5. Fall back when candidate reduction is not provably safe</h3><p>Not every pattern exposes useful fixed literals:</p>
<pre><code translate="no">Plaintext
E[0-9]{4}
ERROR|WARN
(?i)error.*<span class="hljs-built_in">timeout</span>
<button class="copy-code-btn"></button></code></pre>
<p>A character class may leave only a very short literal. Alternation requires reasoning across multiple branches, and case-insensitive matching requires case folding. In the current implementation, alternation and <code translate="no">(?i)</code> patterns bypass the NGRAM coarse filter and fall back to raw verification.</p>
<p>That fallback is the correct boundary for an index optimization. If Milvus cannot prove that a candidate reduction is safe, it does not use it.</p>
<h2 id="-must-preserve-UNKNOWN-not-just-invert-a-bitmap" class="common-anchor-header"><code translate="no">!~</code> must preserve UNKNOWN, not just invert a bitmap<button data-href="#-must-preserve-UNKNOWN-not-just-invert-a-bitmap" class="anchor-icon" translate="no">
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
    </button></h2><p>Once regex enters a database expression language, the difficult cases are not limited to pattern syntax. Nullability matters too.</p>
<p>Consider three JSON records:</p>
<pre><code translate="no" class="language-json">{<span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;request timeout&quot;</span>}
{<span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;request completed&quot;</span>}
{}
<button class="copy-code-btn"></button></code></pre>
<p>The third record has no <code translate="no">message</code>. Under the three-valued logic described by this design, the engine can prove neither that the missing value matches nor that it does not match, so the result is <code translate="no">UNKNOWN</code>:</p>
<table>
<thead>
<tr><th>Input</th><th><code translate="no">message =~ &quot;timeout&quot;</code></th><th><code translate="no">message !~ &quot;timeout&quot;</code></th></tr>
</thead>
<tbody>
<tr><td><code translate="no">&quot;request timeout&quot;</code></td><td>TRUE</td><td>FALSE</td></tr>
<tr><td><code translate="no">&quot;request completed&quot;</code></td><td>FALSE</td><td>TRUE</td></tr>
<tr><td>NULL / missing path / invalid type</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
</tbody>
</table>
<p>A <code translate="no">WHERE</code> or <code translate="no">filter</code> clause returns only rows for which the expression is <code translate="no">TRUE</code>, so the final row is excluded by both operators.</p>
<p>Implementing <code translate="no">!~</code> as ordinary Boolean inversion would be wrong. A missing path represented as <code translate="no">false</code> would become <code translate="no">true</code>, and an entity with no value would unexpectedly appear in a “does not match” query. Milvus represents <code translate="no">!~</code> as <code translate="no">NOT (=~)</code> while preserving the validity bitmap, keeping <code translate="no">UNKNOWN</code> consistent across raw and indexed paths.</p>
<p>This is the difference between attaching a string library to an executor and implementing regex as a database predicate.</p>
<h2 id="Benchmark-NGRAM-helps-when-literals-shrink-the-candidate-set" class="common-anchor-header">Benchmark: NGRAM helps when literals shrink the candidate set<button data-href="#Benchmark-NGRAM-helps-when-literals-shrink-the-candidate-set" class="anchor-icon" translate="no">
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
    </button></h2><p>The benchmark isolates regex filtering over sealed segments so that the results reflect raw string scanning, NGRAM candidate generation, and RE2 verification. It excludes growing segments, vector search, and compound filters.</p>
<h3 id="Dataset-and-controlled-selectivity" class="common-anchor-header">Dataset and controlled selectivity</h3><p>The test uses the public <a href="https://github.com/logpai/loghub/tree/master/HDFS">Loghub HDFS_v1</a> dataset:</p>
<ul>
<li>11,175,629 HDFS system-log rows</li>
<li>1.47 GiB of raw data</li>
<li>38.7 hours of logs</li>
<li>The first 10,000,000 valid rows used in the experiment</li>
</ul>
<p>The original log length, token, and repetition distributions are preserved. To control match rates precisely, the test appends a benchmark marker to a small number of rows selected with a fixed random seed:</p>
<pre><code translate="no">Plaintext
level=ERROR code=E4821 operation=checkout result=request_timeout
<button class="copy-code-btn"></button></code></pre>
<p>The injection targets are 0.01%, 1%, 10%, and 50%. Every dataset variant uses the same seeded row selection and transformation rules, making the marked HDFS_v1 data reproducible. A consistency test also runs on the original, unmodified log fields to confirm that the observed optimization trend is not an artifact of marker injection.</p>
<h3 id="Test-environment" class="common-anchor-header">Test environment</h3><table>
<thead>
<tr><th><strong>Item</strong></th><th><strong>Measured configuration</strong></th></tr>
</thead>
<tbody>
<tr><td>Milvus commit</td><td><code translate="no">03762320e8</code></td></tr>
<tr><td>Deployment</td><td>Standalone, sealed segment, 1 shard</td></tr>
<tr><td>Hardware</td><td>Apple M5 Pro, 48 GiB memory</td></tr>
<tr><td>Collection rows</td><td>10,000,000</td></tr>
<tr><td>Fields</td><td>Five <code translate="no">VARCHAR(max_length=512)</code> fields plus a placeholder <code translate="no">BINARY_VECTOR(dim=8)</code></td></tr>
<tr><td>NGRAM</td><td><code translate="no">min_gram=4</code>, <code translate="no">max_gram=4</code></td></tr>
<tr><td>Concurrency</td><td>1 for latency, 32 for throughput</td></tr>
<tr><td>Repetition</td><td>2 warm-up runs plus 5 measured runs; p50 / p95 / p99 reported</td></tr>
</tbody>
</table>
<p>The raw and NGRAM paths use the same data and query order. Results are measured after warm-up and cover warm-cache behavior only. The test does not support conclusions about cold starts or first-query latency.</p>
<h3 id="Pattern-matrix" class="common-anchor-header">Pattern matrix</h3><table>
<thead>
<tr><th>Pattern</th><th>Main execution path</th><th>What the test isolates</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR</code></td><td>Anchored literal; candidate generation plus prefix verification</td><td>How anchor verification changes as candidate rate rises</td></tr>
<tr><td><code translate="no">ERROR.*timeout</code></td><td>Literal-rich; NGRAM candidates plus RE2</td><td>The range in which NGRAM should provide the clearest gain</td></tr>
<tr><td><code translate="no">E[0-9]{4}</code></td><td>Weak required literal; fixed 4-gram provides little reduction</td><td>Whether weak literals approach raw-scan cost</td></tr>
<tr><td>`ERROR</td><td>WARN`</td><td>Alternation fallback</td><td>The current alternation boundary</td></tr>
<tr><td><code translate="no">(?i)error.*timeout</code></td><td>Case-insensitive fallback</td><td>The current case-insensitive boundary</td></tr>
</tbody>
</table>
<p>Each pattern is run over two sealed-segment paths:</p>
<ul>
<li>No scalar index: raw string scan</li>
<li>NGRAM index: candidate generation plus RE2 verification, with automatic fallback when NGRAM cannot be used</li>
</ul>
<h3 id="Latency-across-selectivity-levels" class="common-anchor-header">Latency across selectivity levels</h3><p>Each cell below reports <code translate="no">raw p50 ms / NGRAM p50 ms / speedup</code>. A value greater than <code translate="no">1x</code> means NGRAM is faster.</p>
<table>
<thead>
<tr><th>Pattern</th><th>0.01%</th><th>1%</th><th>10%</th><th>50%</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">^ERROR</code></td><td>12.65 / 6.99 / 1.81x</td><td>12.98 / 9.63 / 1.35x</td><td>12.73 / 10.98 / 1.16x</td><td>13.96 / 20.27 / 0.69x</td></tr>
<tr><td><code translate="no">ERROR.*timeout</code></td><td>24.31 / 7.47 / 3.26x</td><td>26.06 / 12.65 / 2.06x</td><td>39.86 / 30.44 / 1.31x</td><td>100.24 / 85.73 / 1.17x</td></tr>
<tr><td><code translate="no">E[0-9]{4}</code></td><td>17.24 / 16.43 / 1.05x</td><td>16.77 / 16.91 / 0.99x</td><td>22.14 / 22.18 / 1.00x</td><td>44.90 / 44.73 / 1.00x</td></tr>
<tr><td>`ERROR</td><td>WARN`</td><td>287.31 / 280.79 / 1.02x</td><td>282.81 / 285.40 / 0.99x</td><td>292.34 / 290.07 / 1.01x</td><td>315.69 / 312.57 / 1.01x</td></tr>
<tr><td><code translate="no">(?i)error.*timeout</code></td><td>73.66 / 72.58 / 1.01x</td><td>75.14 / 75.89 / 0.99x</td><td>86.58 / 86.35 / 1.00x</td><td>136.78 / 134.94 / 1.01x</td></tr>
</tbody>
</table>
<p>At 1% selectivity, <code translate="no">ERROR.*timeout</code> also shows improvement beyond median latency: p95 falls from 26.47 ms to 13.03 ms, throughput at concurrency 32 rises from 72.70 to 117.60 QPS (61.77%), and CPU time per query falls by 52.14%.</p>
<p>The literal-rich <code translate="no">ERROR.*timeout</code> pattern benefits most. As selectivity rises from 0.01% to 50%, its speedup falls from 3.26x to 1.17x because more rows survive candidate generation and still require RE2.</p>
<p>Weak-literal, alternation, and case-insensitive patterns remain approximately level with the raw scan. The anchored <code translate="no">^ERROR</code> pattern helps at low candidate rates but falls to 0.69x at 50%. In this dataset, the injected marker puts <code translate="no">ERROR</code> near the end of the row, so the final anchored match count remains zero. Phase 1 still produces a large candidate set, and the extra verification work makes the indexed path slower.</p>
<h3 id="Candidate-reduction-explains-the-gain" class="common-anchor-header">Candidate reduction explains the gain</h3><p>The next table isolates <code translate="no">ERROR.*timeout</code> and places Phase 1 candidate count beside p50 latency:</p>
<table>
<thead>
<tr><th>Injection rate</th><th>Phase 1 candidates</th><th>Candidate reduction</th><th>Raw p50</th><th>NGRAM p50</th><th>Speedup</th></tr>
</thead>
<tbody>
<tr><td>0.01%</td><td>1,000</td><td>99.99%</td><td>24.31 ms</td><td>7.47 ms</td><td>3.26x</td></tr>
<tr><td>1%</td><td>100,000</td><td>99%</td><td>26.06 ms</td><td>12.65 ms</td><td>2.06x</td></tr>
<tr><td>10%</td><td>1,000,000</td><td>90%</td><td>39.86 ms</td><td>30.44 ms</td><td>1.31x</td></tr>
<tr><td>50%</td><td>5,000,000</td><td>50%</td><td>100.24 ms</td><td>85.73 ms</td><td>1.17x</td></tr>
</tbody>
</table>
<p>The relationship is direct. Reducing candidates by 99.99% produces a 3.26x speedup; reducing them by only 50% leaves 1.17x. NGRAM earns its cost when required literals remove a substantial share of rows before RE2 verification.</p>
<p>Data sources and references:</p>
<ul>
<li><a href="https://github.com/logpai/loghub">Loghub repository</a></li>
<li><a href="https://github.com/logpai/loghub/tree/master/HDFS">HDFS_v1 dataset</a></li>
<li><a href="https://doi.org/10.5281/zenodo.8196385">Zenodo dataset record</a></li>
<li>Jieming Zhu, Shilin He, Pinjia He, Jinyang Liu, and Michael R. Lyu. <em>Loghub: A Large Collection of System Log Datasets for AI-driven Log Analytics</em>. ISSRE 2023.</li>
</ul>
<h2 id="Current-boundaries-and-likely-next-steps" class="common-anchor-header">Current boundaries and likely next steps<button data-href="#Current-boundaries-and-likely-next-steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 regex filtering has several explicit boundaries:</p>
<ul>
<li>RE2 does not support backreferences or lookaround.</li>
<li>Regex is a filter operation; it does not provide extract or replace functions.</li>
<li>Case-insensitive <code translate="no">(?i)</code> patterns do not currently use the NGRAM coarse filter.</li>
<li>Alternation is not currently split into separate NGRAM branches.</li>
<li>A pattern with no safely extractable required literal falls back to a raw scan.</li>
<li>The presence of an ordinary inverted index does not mean a regex filter will use it; NGRAM is the primary regex-acceleration path described here.</li>
</ul>
<p>Those boundaries suggest natural extensions: case-folded NGRAM, branch splitting for alternation, and richer multi-pattern execution. Any such optimization must preserve the same contract as the current design: candidate generation may be conservative, but only exact matching can decide the final result.</p>
<h2 id="Regex-as-a-database-capability" class="common-anchor-header">Regex as a database capability<button data-href="#Regex-as-a-database-capability" class="anchor-icon" translate="no">
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
    </button></h2><p>Adding <code translate="no">=~</code> to an expression grammar is the easy part. A database implementation must also answer harder questions:</p>
<ul>
<li>Can users submit arbitrary patterns without creating unbounded work?</li>
<li>Do nulls, missing JSON paths, and negation keep consistent semantics?</li>
<li>Which patterns can be rewritten?</li>
<li>Which rows must reach RE2?</li>
<li>When does the candidate reduction from NGRAM justify the index?</li>
</ul>
<p>Milvus 3.0 answers with a layered execution path. RE2 provides a predictable safety boundary. The parser recognizes simpler operations. The planner runs cheaper predicates first. Volnitsky and NGRAM conservatively reduce candidates. RE2 then verifies the remaining rows.</p>
<p>That makes regex filtering more than a call to a regular expression library inside a vector database. It makes structural patterns part of the same database execution model as vector search, scalar filters, JSON data, and indexed retrieval.</p>
<h2 id="Try-regex-filtering-on-your-own-workload--and-the-rest-of-Milvus-30" class="common-anchor-header">Try regex filtering on your own workload — and the rest of Milvus 3.0<button data-href="#Try-regex-filtering-on-your-own-workload--and-the-rest-of-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Regex filtering is available in Milvus 3.0. The <a href="https://milvus.io/docs/pattern-matching.md">Pattern Matching guide</a> covers operator syntax, supported targets, raw strings, and matching semantics, while the <a href="https://milvus.io/docs/ngram.md">NGRAM guide</a> explains which patterns the index can accelerate and how to configure it.</p>
<p>If you are evaluating the broader release of Milvus 3.0, check out:</p>
<ul>
<li>Milvus 3.0 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">launch blog</a></li>
<li>Milvus 3.0 <a href="https://milvus.io/docs/release_notes.md">release notes</a></li>
<li>Milvus 3.0 feature blog: <a href="https://milvus.io/blog/milvus-snapshots.md">Milvus Snapshots: Point-in-Time Collection Views Without Copying Data</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHub repo</a></li>
</ul>
<h2 id="Come-talk-to-us" class="common-anchor-header">Come talk to us<button data-href="#Come-talk-to-us" class="anchor-icon" translate="no">
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
<li>Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> — the fastest way to get an answer from the people who built this.</li>
<li>Book a 20-minute <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus office hour</a> if you want to walk through your own collection with an engineer.</li>
</ul>
