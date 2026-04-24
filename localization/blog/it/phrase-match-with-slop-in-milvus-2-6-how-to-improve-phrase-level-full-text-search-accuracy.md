---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >
  Phrase Match with Slop in Milvus 2.6: How to Improve Phrase-Level Full-Text
  Search Accuracy 
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Learn how Phrase Match in Milvus 2.6 supports phrase-level full-text search
  with slop, enabling more tolerant keyword filtering for real-world production.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>As unstructured data continues to explode and AI models keep getting smarter, vector search has become the default retrieval layer for many AI systems—RAG pipelines, AI search, agents, recommendation engines, and more. It works because it captures meaning: not just the words users type, but the intent behind them.</p>
<p>Once these applications move into production, however, teams often discover that semantic understanding is only one side of the retrieval problem. Many workloads also depend on strict textual rules—such as matching exact terminology, preserving word order, or identifying phrases that carry technical, legal, or operational significance.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> removes that split by introducing native full-text search directly into the vector database. With token and positional indexes built into the core engine, Milvus can interpret a query’s semantic intent while enforcing precise keyword and phrase-level constraints. The result is a unified retrieval pipeline in which meaning and structure reinforce each other rather than living in separate systems.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> is a key part of this full-text capability. It identifies sequences of terms that appear together and in order—crucial for detecting log patterns, error signatures, product names, and any text in which word order defines meaning. In this post, we’ll explain how <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> works in <a href="https://milvus.io/">Milvus</a>, how <code translate="no">slop</code> adds flexibility needed for real-world text, and why these features make hybrid vector–full-text search not just possible but practical within a single database.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">What is Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match is a full-text query type in Milvus that focuses on <em>structure</em>—specifically, whether a sequence of words appears in the same order inside a document. When no flexibility is allowed, the query behaves strictly: the terms must appear next to each other and in sequence. A query like <strong>“robotics machine learning”</strong> therefore matches only when those three words occur as a continuous phrase.</p>
<p>The challenge is that real text rarely behaves this neatly. Natural language introduces noise: extra adjectives slip in, logs reorder fields, product names gain modifiers, and human authors don’t write with query engines in mind. A strict phrase match breaks easily—one inserted word, one rephrasing, or one swapped term can cause a miss. And in many AI systems, especially production-facing ones, missing a relevant log line or rule-triggering phrase isn’t acceptable.</p>
<p>Milvus 2.6 addresses this friction with a simple mechanism: <strong>slop</strong>. Slop defines <em>the amount of wiggle room allowed between query</em> terms. Instead of treating a phrase as brittle and inflexible, slop lets you decide whether one extra word is tolerable, or two, or even whether slight reordering should still count as a match. This moves phrase search from a binary pass–fail test to a controlled, tunable retrieval tool.</p>
<p>To see why this matters, imagine searching logs for all variants of the familiar networking error <strong>“connection reset by peer.”</strong> In practice, your logs might look like:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>At a glance, all of these represent the same underlying event. But common retrieval methods struggle:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 struggles with structure.</h3><p>It views the query as a bag of keywords, ignoring the order in which they appear. As long as “connection” and “peer” show up somewhere, BM25 may rank the document highly—even if the phrase is reversed or unrelated to the concept you’re actually searching for.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">Vector search struggles with constraints.</h3><p>Embeddings excel at capturing meaning and semantic relationships, but they cannot enforce a rule like “these words must appear in this sequence.” You might retrieve semantically related messages, but still miss the exact structural pattern required for debugging or compliance.</p>
<p>Phrase Match fills the gap between these two approaches. By using <strong>slop</strong>, you can specify exactly how much variation is acceptable:</p>
<ul>
<li><p><code translate="no">slop = 0</code> — Exact match (All terms must appear contiguously and in order.)</p></li>
<li><p><code translate="no">slop = 1</code> — Allow one extra word (Covers common natural-language variations with a single inserted term.)</p></li>
<li><p><code translate="no">slop = 2</code> — Allow multiple inserted words (Handles more descriptive or verbose phrasing.)</p></li>
<li><p><code translate="no">slop = 3</code> — Allow reordering (Supports reversed or loosely ordered phrases, often the hardest case in real-world text.)</p></li>
</ul>
<p>Instead of hoping the scoring algorithm “gets it right,” you explicitly declare the structural tolerance your application requires.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">How Phrase Match Works in Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Powered by the <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a> search engine library, Phrase Match in Milvus is implemented on top of an inverted index with positional information. Instead of only checking whether terms appear in a document, it verifies that they appear in the right order and within a controllable distance.</p>
<p>The diagram below illustrates the process:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Document Tokenization (with Positions)</strong></p>
<p>When documents are inserted into Milvus, text fields are processed by an <a href="https://milvus.io/docs/analyzer-overview.md">analyzer</a>, which splits the text into tokens (words or terms) and records each token’s position within the document. For example, <code translate="no">doc_1</code> is tokenized as: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Inverted Index Creation</strong></p>
<p>Next, Milvus builds an inverted index. Instead of mapping documents to their contents, the inverted index maps each token to the documents in which it appears, along with all recorded positions of that token within each document.</p>
<p><strong>3. Phrase Matching</strong></p>
<p>When a phrase query is executed, Milvus first uses the inverted index to identify documents that contain all query tokens. It then validates each candidate by comparing token positions to ensure the terms appear in the correct order and within the allowed <code translate="no">slop</code> distance. Only documents that satisfy both conditions are returned as matches.</p>
<p>The diagram below summarizes how Phrase Match works end-to-end.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">How to Enable Phrase Match in Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match works on fields of type <strong><code translate="no">VARCHAR</code></strong>, the string type in Milvus. To use it, you must configure your collection schema so that Milvus performs text analysis and stores positional information for the field. This is done by enabling two parameters: <code translate="no">enable_analyzer</code> and <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Set enable_analyzer and enable_match</h3><p>To turn on Phrase Match for a specific VARCHAR field, set both parameters to <code translate="no">True</code> when defining the field schema. Together, they tell Milvus to:</p>
<ul>
<li><p><strong>tokenize</strong> the text (via <code translate="no">enable_analyzer</code>), and</p></li>
<li><p><strong>build an inverted index with positional offsets</strong> (via <code translate="no">enable_match</code>).</p></li>
</ul>
<p>Phrase Match relies on both steps: the analyzer breaks text into tokens, and the match index stores where those tokens appear, enabling efficient phrase and slop-based queries.</p>
<p>Below is an example schema configuration that enables Phrase Match on a <code translate="no">text</code> field:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Search with Phrase Match: How Slop Affects the Candidate Set<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Once you’ve enabled match for a VARCHAR field in your collection schema, you can perform phrase matches using the <code translate="no">PHRASE_MATCH</code> expression.</p>
<p>Note: The <code translate="no">PHRASE_MATCH</code> expression is case-insensitive. You can use either <code translate="no">PHRASE_MATCH</code> or <code translate="no">phrase_match</code>.</p>
<p>In search operations, Phrase Match is commonly applied before vector similarity ranking. It first filters documents based on explicit textual constraints, narrowing the candidate set. The remaining documents are then re-ranked using vector embeddings.</p>
<p>The example below shows how different <code translate="no">slop</code> values affect this process. By adjusting the <code translate="no">slop</code> parameter, you directly control which documents pass the phrase filter and proceed to the vector ranking stage.</p>
<p>Suppose you have a collection named <code translate="no">tech_articles</code> containing the following five entities:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Machine learning boosts efficiency in large-scale data analysis</td></tr>
<tr><td>2</td><td>Learning a machine-based approach is vital for modern AI progress</td></tr>
<tr><td>3</td><td>Deep learning machine architectures optimize computational loads</td></tr>
<tr><td>4</td><td>Machine swiftly improves model performance for ongoing learning</td></tr>
<tr><td>5</td><td>Learning advanced machine algorithms expands AI capabilities</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Here, we allow a slop of 1. The filter is applied to documents that contain the phrase “learning machine” with slight flexibility.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Match results:</p>
<table>
<thead>
<tr><th>doc_id</th><th>text</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>Learning a machine-based approach is vital for modern AI progress</td></tr>
<tr><td>3</td><td>Deep learning machine architectures optimize computational loads</td></tr>
<tr><td>5</td><td>Learning advanced machine algorithms expands AI capabilities</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>This example allows a slop of 2, meaning that up to two extra tokens (or reversed terms) are allowed between the words “machine” and “learning”.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Match results:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Machine learning boosts efficiency in large-scale data analysis</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Deep learning machine architectures optimize computational loads</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>In this example, a slop of 3 provides even more flexibility. The filter searches for “machine learning” with up to three token positions allowed between the words.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Match results:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>text</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">Machine learning boosts efficiency in large-scale data analysis</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">Learning a machine-based approach is vital for modern AI progress</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Deep learning machine architectures optimize computational loads</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">Learning advanced machine algorithms expands AI capabilities</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Quick Tips: What You Need to Know Before Enabling Phrase Match in Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match provides support for phrase-level filtering, but enabling it involves more than query-time configuration. It is helpful to be aware of the associated considerations before applying it in a production setting.</p>
<ul>
<li><p>Enabling Phrase Match on a field creates an inverted index, which increases storage usage. The exact cost depends on factors such as text length, the number of unique tokens, and the analyzer configuration. When working with large text fields or high-cardinality data, this overhead should be considered upfront.</p></li>
<li><p>Analyzer configuration is another critical design choice. Once an analyzer is defined in the collection schema, it cannot be changed. Switching to a different analyzer later requires dropping the existing collection and recreating it with a new schema. For this reason, analyzer selection should be treated as a long-term decision rather than an experiment.</p></li>
<li><p>Phrase Match behavior is tightly coupled to how text is tokenized. Before applying an analyzer to an entire collection, it is recommended to use the <code translate="no">run_analyzer</code> method to inspect the tokenization output and confirm that it matches your expectations. This step can help avoid subtle mismatches and unexpected query results later. For more information, refer to <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Analyzer Overview</a>.</p></li>
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
    </button></h2><p>Phrase Match is a core full-text search type that enables phrase-level and positional constraints beyond simple keyword matching. By operating on token order and proximity, it provides a predictable and precise way to filter documents based on how terms actually appear in text.</p>
<p>In modern retrieval systems, Phrase Match is commonly applied before vector-based ranking. It first restricts the candidate set to documents that explicitly satisfy required phrases or structures. Vector search is then used to rank these results by semantic relevance. This pattern is especially effective in scenarios such as log analysis, technical documentation search, and RAG pipelines, where textual constraints must be enforced before semantic similarity is considered.</p>
<p>With the introduction of the <code translate="no">slop</code> parameter in Milvus 2.6, Phrase Match becomes more tolerant of natural language variation while retaining its role as a full-text filtering mechanism. This makes phrase-level constraints easier to apply in production retrieval workflows.</p>
<p>👉 Try it out with the <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">demo</a> scripts, and explore <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> to see how phrase-aware retrieval fits into your stack.</p>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
