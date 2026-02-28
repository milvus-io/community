---
id: >-
  tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
title: >
  Tokenize Smarter, Retrieve Better: A Deep Dive into Milvus Analyzer for
  Full-Text Search
author: Jack Li
date: 2025-10-16T00:00:00.000Z
desc: >-
  Explore how Milvus Analyzer powers hybrid AI retrieval with efficient
  tokenization and filtering, enabling faster, smarter full-text search.
cover: assets.zilliz.com/Milvus_Analyzer_2_ccde10876e.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_title: |
  A Deep Dive into Milvus Analyzer for Full-Text Search
meta_keywords: 'Milvus Analyzer, RAG, full-text search, vector database, tokenization'
origin: >-
  https://milvus.io/blog/tokenize-smarter-retrieve-better-a-deep-dive-into-milvus-analyzer-for-full-text-search.md
---
<p>Modern AI applications are complex and rarely one-dimensional. In many cases, a single search method can’t solve real-world problems on its own. Take a recommendation system, for example. It requires <strong>vector search</strong> to comprehend the meaning behind text or images, <strong>metadata filtering</strong> to refine results by price, category, or location, and<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md"> <strong>full-text search</strong></a> to handle direct queries like “Nike Air Max.” Each method solves a different part of the puzzle—and practical systems depend on all of them working together seamlessly.</p>
<p>Milvus excels at vector search and metadata filtering, and starting with version 2.5, it introduced full-text search based on the optimized BM25 algorithm. This upgrade makes AI search both smarter and more accurate, combining semantic understanding with precise keyword intent. With<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> Milvus 2.6</a>, full-text search becomes even faster—up to<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md#Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch"> 4× the performance of Elasticsearch</a>.</p>
<p>At the heart of this capability is the <strong>Milvus Analyzer</strong>, the component that transforms raw text into searchable tokens. It’s what enables Milvus to interpret language efficiently and perform keyword matching at scale. In the rest of this post, we’ll dive into how the Milvus Analyzer works—and why it’s key to unlocking the full potential of hybrid search in Milvus.</p>
<h2 id="What-is-Milvus-Analyzer" class="common-anchor-header">What is Milvus Analyzer？<button data-href="#What-is-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>To power efficient full-text search—whether for keyword matching or semantic retrieval—the first step is always the same: turning raw text into tokens that the system can understand, index, and compare.</p>
<p>The <strong>Milvus Analyzer</strong> handles this step. It’s a built-in text preprocessing and tokenization component that breaks input text into discrete tokens, then normalizes, cleans, and standardizes them to ensure consistent matching across queries and documents. This process lays the foundation for accurate, high-performance full-text search and hybrid retrieval.</p>
<p>Here’s an overview of the Milvus Analyzer architecture:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_5_8e0ec1dbdf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>As the diagram shows, Analyzer has two core components: the <strong>Tokenizer</strong> and the <strong>Filter</strong>. Together, they convert input text into tokens and optimize them for efficient indexing and retrieval.</p>
<ul>
<li><p><strong>Tokenizer</strong>: Splits text into basic tokens using methods like whitespace splitting (Whitespace), Chinese word segmentation (Jieba), or multilingual segmentation (ICU).</p></li>
<li><p><strong>Filter</strong>: Processes tokens through specific transformations. Milvus includes a rich set of built-in filters for operations like case normalization (Lowercase), punctuation removal (Removepunct), stop word filtering (Stop), stemming (Stemmer), and pattern matching (Regex). You can chain multiple filters to handle complex processing needs.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tokenizer_70a57e893c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus offers several Analyzer types: three built-in options (Standard, English, and Chinese), Custom Analyzers where you define your own Tokenizer and Filter combinations, and the Multi-language Analyzer for handling multilingual documents. The processing flow is straightforward: Raw text → Tokenizer → Filter → Tokens.</p>
<h3 id="Tokenizer" class="common-anchor-header">Tokenizer</h3><p>The Tokenizer is the first processing step. It splits raw text into smaller tokens (words or subwords), and the right choice depends on your language and use case.</p>
<p>Milvus currently supports the following types of tokenizers:</p>
<table>
<thead>
<tr><th><strong>Tokenizer</strong></th><th><strong>Use Case</strong></th><th><strong>Description</strong></th></tr>
</thead>
<tbody>
<tr><td>Standard</td><td>English and space-delimited languages</td><td>The most common general-purpose tokenizer; detects word boundaries and splits accordingly.</td></tr>
<tr><td>Whitespace</td><td>Simple text with minimal preprocessing</td><td>Splits only by spaces; does not handle punctuation or casing.</td></tr>
<tr><td>Jieba（Chinese）</td><td>Chinese text</td><td>Dictionary and probability-based tokenizer that splits continuous Chinese characters into meaningful words.</td></tr>
<tr><td>Lindera（JP/KR）</td><td>Japanese and Korean text</td><td>Uses Lindera morphological analysis for effective segmentation.</td></tr>
<tr><td>ICU（Multi-language）</td><td>Complex languages like Arabic, and multilingual scenarios</td><td>Based on the ICU library with support for multilingual tokenization across Unicode.</td></tr>
</tbody>
</table>
<p>You can configure the Tokenizer when creating your Collection’s Schema, specifically when defining <code translate="no">VARCHAR</code> fields through the <code translate="no">analyzer_params</code> parameter. In other words, the Tokenizer is not a standalone object but a field-level configuration. Milvus automatically performs tokenization and preprocessing when inserting data.</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
       <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>   <span class="hljs-comment"># Configure Tokenizer here</span>
    }
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Filter" class="common-anchor-header">Filter</h3><p>If the Tokenizer cuts text apart, the Filter refines what’s left. Filters standardize, clean, or transform your tokens to make them search-ready.</p>
<p>Common Filter operations include normalizing case, removing stop words (like “the” and “and”), stripping punctuation, and applying stemming (reducing “running” to “run”).</p>
<p>Milvus includes many built-in Filters for most language processing needs:</p>
<table>
<thead>
<tr><th><strong>Filter Name</strong></th><th><strong>Function</strong></th><th><strong>Use Case</strong></th></tr>
</thead>
<tbody>
<tr><td>Lowercase</td><td>Converts all tokens to lowercase</td><td>Essential for English search to avoid case mismatches</td></tr>
<tr><td>Asciifolding</td><td>Converts accented characters to ASCII</td><td>Multilingual scenarios (e.g., “café” → “cafe”)</td></tr>
<tr><td>Alphanumonly</td><td>Keeps only letters and numbers</td><td>Strips mixed symbols from text like logs</td></tr>
<tr><td>Cncharonly</td><td>Keeps only Chinese characters</td><td>Chinese corpus cleaning</td></tr>
<tr><td>Cnalphanumonly</td><td>Keeps only Chinese, English, and numbers</td><td>Mixed Chinese-English text</td></tr>
<tr><td>Length</td><td>Filters tokens by length</td><td>Removes excessively short or long tokens</td></tr>
<tr><td>Stop</td><td>Stop word filtering</td><td>Removes high-frequency meaningless words like “is” and “the”</td></tr>
<tr><td>Decompounder</td><td>Splits compound words</td><td>Languages with frequent compounds like German and Dutch</td></tr>
<tr><td>Stemmer</td><td>Word stemming</td><td>English scenarios (e.g.,&quot;studies&quot; and “studying” → “study”</td></tr>
<tr><td>Removepunct</td><td>Removes punctuation</td><td>General text cleaning</td></tr>
<tr><td>Regex</td><td>Filters or replaces with a regex pattern</td><td>Custom needs, like extracting only email addresses</td></tr>
</tbody>
</table>
<p>The power of Filters is in their flexibility—you can mix and match cleaning rules based on your needs. For English search, a typical combination is Lowercase + Stop + Stemmer, ensuring case uniformity, removing filler words, and normalizing word forms to their stem.</p>
<p>For Chinese search, you’ll usually combine Cncharonly + Stop for cleaner, more precise results. Configure Filters the same way as Tokenizers, through <code translate="no">analyzer_params</code> in your FieldSchema:</p>
<pre><code translate="no">FieldSchema(
    name=<span class="hljs-string">&quot;text&quot;</span>,
    dtype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
    analyzer_params={
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
        <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
               <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
               <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
    }
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Analyzer-Types" class="common-anchor-header">Analyzer Types<button data-href="#Analyzer-Types" class="anchor-icon" translate="no">
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
    </button></h2><p>The right Analyzer makes your search both faster and more cost-effective. To fit different needs, Milvus provides three types: Built-in, Multi-language, and Custom Analyzers.</p>
<h3 id="Built-in-Analyzer" class="common-anchor-header">Built-in Analyzer</h3><p>Built-in Analyzers are ready to use out of the box—standard configurations that work for most common scenarios. They come with predefined Tokenizer and Filter combinations:</p>
<table>
<thead>
<tr><th><strong>Name</strong></th><th><strong>Components（Tokenizer+Filters）</strong></th><th><strong>Use Case</strong></th></tr>
</thead>
<tbody>
<tr><td>Standard</td><td>Standard Tokenizer + Lowercase</td><td>General use for English or space-delimited languages</td></tr>
<tr><td>English</td><td>Standard Tokenizer + Lowercase + Stop + Stemmer</td><td>English search with higher precision</td></tr>
<tr><td>Chinese</td><td>Jieba Tokenizer + Cnalphanumonly</td><td>Chinese text search with natural word segmentation</td></tr>
</tbody>
</table>
<p>For straightforward English or Chinese search, these built-in Analyzers work without any extra setup.</p>
<p>One important note: the Standard Analyzer is designed for English by default. If applied to Chinese text, full-text search may return no results.</p>
<h3 id="Multi-language-Analyzer" class="common-anchor-header">Multi-language Analyzer</h3><p>When you deal with multiple languages, a single tokenizer often can’t handle everything. That’s where the Multi-language Analyzer comes in—it automatically picks the right tokenizer based on each text’s language. Here’s how languages map to Tokenizers:</p>
<table>
<thead>
<tr><th><strong>Language Code</strong></th><th><strong>Tokenizer Used</strong></th></tr>
</thead>
<tbody>
<tr><td>en</td><td>English Analyzer</td></tr>
<tr><td>zh</td><td>Jieba</td></tr>
<tr><td>ja / ko</td><td>Lindera</td></tr>
<tr><td>ar</td><td>ICU</td></tr>
</tbody>
</table>
<p>If your dataset mixes English, Chinese, Japanese, Korean, and even Arabic, Milvus can handle them all in the same field. This cuts down dramatically on manual preprocessing.</p>
<h3 id="Custom-Analyzer" class="common-anchor-header">Custom Analyzer</h3><p>When Built-in or Multi-language Analyzers don’t quite fit, Milvus lets you build Custom Analyzers. Mix and match Tokenizers and Filters to create something tailored to your needs. Here’s an example:</p>
<pre><code translate="no">FieldSchema(
        name=<span class="hljs-string">&quot;text&quot;</span>,
        dtype=DataType.VARCHAR,
        max_length=<span class="hljs-number">512</span>,
        analyzer_params={
           <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;jieba&quot;</span>,  
            <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;cncharonly&quot;</span>, <span class="hljs-string">&quot;stop&quot;</span>]  <span class="hljs-comment"># Custom combination for mixed Chinese-English text</span>
        }
    )
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hands-on-Coding-with-Milvus-Analyzer" class="common-anchor-header">Hands-on Coding with Milvus Analyzer<button data-href="#Hands-on-Coding-with-Milvus-Analyzer" class="anchor-icon" translate="no">
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
    </button></h2><p>Theory helps, but nothing beats a full code example. Let’s walk through how to use Analyzers in Milvus with the Python SDK, covering both built-in Analyzers and multi-language Analyzers. These examples use Milvus v2.6.1 and Pymilvus v2.6.1.</p>
<h3 id="How-to-Use-Built-in-Analyzer" class="common-anchor-header">How to Use Built-in Analyzer</h3><p>Say you want to build a Collection for English text search that automatically handles tokenization and preprocessing during data insertion. We’ll use the built-in English Analyzer (equivalent to <code translate="no">standard + lowercase + stop + stemmer</code> ).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

schema = client.create_schema()

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,                  <span class="hljs-comment"># Field name</span>
    datatype=DataType.INT64,          <span class="hljs-comment"># Integer data type</span>
    is_primary=<span class="hljs-literal">True</span>,                  <span class="hljs-comment"># Designate as primary key</span>
    auto_id=<span class="hljs-literal">True</span>                      <span class="hljs-comment"># Auto-generate IDs (recommended)</span>
)

schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">1000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    analyzer_params={
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;standard&quot;</span>,
            <span class="hljs-string">&quot;filter&quot;</span>: [
            <span class="hljs-string">&quot;lowercase&quot;</span>,
            {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>, <span class="hljs-comment"># Specifies the filter type as stop</span>
            <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;of&quot;</span>, <span class="hljs-string">&quot;to&quot;</span>, <span class="hljs-string">&quot;_english_&quot;</span>], <span class="hljs-comment"># Defines custom stop words and includes the English stop word list</span>
            },
            {
                <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stemmer&quot;</span>,  <span class="hljs-comment"># Specifies the filter type as stemmer</span>
                <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>
            }],
        },
    enable_match=<span class="hljs-literal">True</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,                   <span class="hljs-comment"># Field name</span>
    datatype=DataType.SPARSE_FLOAT_VECTOR  <span class="hljs-comment"># Sparse vector data type</span>
)

bm25_function = Function(
    name=<span class="hljs-string">&quot;text_to_vector&quot;</span>,            <span class="hljs-comment"># Descriptive function name</span>
    function_type=FunctionType.BM25,  <span class="hljs-comment"># Use BM25 algorithm</span>
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],       <span class="hljs-comment"># Process text from this field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>]     <span class="hljs-comment"># Store vectors in this field</span>
)

schema.add_function(bm25_function)

index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,        <span class="hljs-comment"># Field to index (our vector field)</span>
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,     <span class="hljs-comment"># Let Milvus choose optimal index type</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>          <span class="hljs-comment"># Must be BM25 for this feature</span>
)

COLLECTION_NAME = <span class="hljs-string">&quot;english_demo&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)  
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

client.create_collection(
    collection_name=COLLECTION_NAME,       <span class="hljs-comment"># Collection name</span>
    schema=schema,                         <span class="hljs-comment"># Our schema</span>
    index_params=index_params              <span class="hljs-comment"># Our search index configuration</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully created collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Prepare sample data</span>
sample_texts = [
    <span class="hljs-string">&quot;The quick brown fox jumps over the lazy dog&quot;</span>,
    <span class="hljs-string">&quot;Machine learning algorithms are revolutionizing artificial intelligence&quot;</span>,  
    <span class="hljs-string">&quot;Python programming language is widely used for data science projects&quot;</span>,
    <span class="hljs-string">&quot;Natural language processing helps computers understand human languages&quot;</span>,
    <span class="hljs-string">&quot;Deep learning models require large amounts of training data&quot;</span>,
    <span class="hljs-string">&quot;Search engines use complex algorithms to rank web pages&quot;</span>,
    <span class="hljs-string">&quot;Text analysis and information retrieval are important NLP tasks&quot;</span>,
    <span class="hljs-string">&quot;Vector databases enable efficient similarity searches&quot;</span>,
    <span class="hljs-string">&quot;Stemming reduces words to their root forms for better searching&quot;</span>,
    <span class="hljs-string">&quot;Stop words like &#x27;the&#x27;, &#x27;and&#x27;, &#x27;of&#x27; are often filtered out&quot;</span>
]

<span class="hljs-comment"># Insert data</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nInserting data...&quot;</span>)
data = [{<span class="hljs-string">&quot;text&quot;</span>: text} <span class="hljs-keyword">for</span> text <span class="hljs-keyword">in</span> sample_texts]

client.insert(
    collection_name=COLLECTION_NAME,
    data=data
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_texts)}</span> records&quot;</span>)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Tokenizer Analysis Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

test_text = <span class="hljs-string">&quot;The running dogs are jumping over the lazy cats&quot;</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nOriginal text: &#x27;<span class="hljs-subst">{test_text}</span>&#x27;&quot;</span>)

<span class="hljs-comment"># Use run_analyzer to show tokenization results</span>
analyzer_result = client.run_analyzer(
    texts=test_text,
    collection_name=COLLECTION_NAME,
    field_name=<span class="hljs-string">&quot;text&quot;</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Tokenization result: <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nBreakdown:&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- lowercase: Converts all letters to lowercase&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stop words: Filtered out [&#x27;of&#x27;, &#x27;to&#x27;] and common English stop words&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)&quot;</span>)

<span class="hljs-comment"># Full-text search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Full-Text Search Demo&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)

<span class="hljs-comment"># Wait for indexing to complete</span>
<span class="hljs-keyword">import</span> time
time.sleep(<span class="hljs-number">2</span>)

<span class="hljs-comment"># Search query examples</span>
search_queries = [
    <span class="hljs-string">&quot;jump&quot;</span>,           <span class="hljs-comment"># Test stem matching (should match &quot;jumps&quot;)</span>
    <span class="hljs-string">&quot;algorithm&quot;</span>,      <span class="hljs-comment"># Test exact matching</span>
    <span class="hljs-string">&quot;python program&quot;</span>, <span class="hljs-comment"># Test multi-word query</span>
    <span class="hljs-string">&quot;learn&quot;</span>          <span class="hljs-comment"># Test stem matching (should match &quot;learning&quot;)</span>
]

<span class="hljs-keyword">for</span> i, query <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_queries, <span class="hljs-number">1</span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery <span class="hljs-subst">{i}</span>: &#x27;<span class="hljs-subst">{query}</span>&#x27;&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
    
    <span class="hljs-comment"># Execute full-text search</span>
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        data=[query],                    <span class="hljs-comment"># Query text</span>
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>],         <span class="hljs-comment"># Return original text</span>
        limit=<span class="hljs-number">3</span>                         <span class="hljs-comment"># Return top 3 results</span>
    )
    
    <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
        <span class="hljs-keyword">for</span> j, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(search_results[<span class="hljs-number">0</span>], <span class="hljs-number">1</span>):
            score = result[<span class="hljs-string">&quot;distance&quot;</span>]
            text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Result <span class="hljs-subst">{j}</span> (relevance: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>): <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No relevant results found&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search complete！&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span>*<span class="hljs-number">60</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Output：</p>
<pre><code translate="no">Dropped existing collection: english_demo
Successfully created collection: english_demo

Inserting data...
Successfully inserted <span class="hljs-number">10</span> records

============================================================
Tokenizer Analysis Demo
============================================================

Original text: <span class="hljs-string">&#x27;The running dogs are jumping over the lazy cats&#x27;</span>
Tokenization result: [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;dog&#x27;</span>, <span class="hljs-string">&#x27;jump&#x27;</span>, <span class="hljs-string">&#x27;over&#x27;</span>, <span class="hljs-string">&#x27;lazi&#x27;</span>, <span class="hljs-string">&#x27;cat&#x27;</span>]

Breakdown:
- lowercase: Converts <span class="hljs-built_in">all</span> letters to lowercase
- stop words: Filtered out [<span class="hljs-string">&#x27;of&#x27;</span>, <span class="hljs-string">&#x27;to&#x27;</span>] <span class="hljs-keyword">and</span> common English stop words
- stemmer: Reduced words to stem form (running -&gt; run, jumping -&gt; jump)

============================================================
Full-Text Search Demo
============================================================

Query <span class="hljs-number">1</span>: <span class="hljs-string">&#x27;jump&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">2.0040</span>): The quick brown fox jumps over the lazy dog

Query <span class="hljs-number">2</span>: <span class="hljs-string">&#x27;algorithm&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Search engines use <span class="hljs-built_in">complex</span> algorithms to rank web pages

Query <span class="hljs-number">3</span>: <span class="hljs-string">&#x27;python program&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">3.7884</span>): Python programming language <span class="hljs-keyword">is</span> widely used <span class="hljs-keyword">for</span> data science projects

Query <span class="hljs-number">4</span>: <span class="hljs-string">&#x27;learn&#x27;</span>
----------------------------------------
  Result <span class="hljs-number">1</span> (relevance: <span class="hljs-number">1.5819</span>): Machine learning algorithms are revolutionizing artificial intelligence
  Result <span class="hljs-number">2</span> (relevance: <span class="hljs-number">1.4086</span>): Deep learning models require large amounts of training data

============================================================
Search complete！
============================================================
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Use-Multi-language-Analyzer" class="common-anchor-header">How to Use Multi-language Analyzer</h3><p>When your dataset contains multiple languages—English, Chinese, and Japanese, for example—you can enable the Multi-language Analyzer. Milvus will automatically pick the right tokenizer based on each text’s language.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-keyword">import</span> time

<span class="hljs-comment"># Configure connection</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)

COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_demo&quot;</span>

<span class="hljs-comment"># Drop existing collection if present</span>
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
    client.drop_collection(COLLECTION_NAME)

<span class="hljs-comment"># Create schema</span>
schema = client.create_schema()

<span class="hljs-comment"># Add primary key field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Add language identifier field</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;language&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">50</span>
)

<span class="hljs-comment"># Add text field with multi-language analyzer configuration</span>
multi_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,  <span class="hljs-comment"># Select analyzer based on language field</span>
    <span class="hljs-string">&quot;analyzers&quot;</span>: {
        <span class="hljs-string">&quot;en&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>  <span class="hljs-comment"># English analyzer</span>
        },
        <span class="hljs-string">&quot;zh&quot;</span>: {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;chinese&quot;</span>  <span class="hljs-comment"># Chinese analyzer</span>
        },
        <span class="hljs-string">&quot;jp&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,  <span class="hljs-comment"># Use ICU tokenizer for Japanese</span>
            <span class="hljs-string">&quot;filter&quot;</span>: [
                <span class="hljs-string">&quot;lowercase&quot;</span>,
                {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stop&quot;</span>,
                    <span class="hljs-string">&quot;stop_words&quot;</span>: [<span class="hljs-string">&quot;は&quot;</span>, <span class="hljs-string">&quot;が&quot;</span>, <span class="hljs-string">&quot;の&quot;</span>, <span class="hljs-string">&quot;に&quot;</span>, <span class="hljs-string">&quot;を&quot;</span>, <span class="hljs-string">&quot;で&quot;</span>, <span class="hljs-string">&quot;と&quot;</span>]
                }
            ]
        },
        <span class="hljs-string">&quot;default&quot;</span>: {
            <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>  <span class="hljs-comment"># Default to ICU general tokenizer</span>
        }
    },
    <span class="hljs-string">&quot;alias&quot;</span>: {
        <span class="hljs-string">&quot;english&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;chinese&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, 
        <span class="hljs-string">&quot;japanese&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>,
        <span class="hljs-string">&quot;中文&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>,
        <span class="hljs-string">&quot;英文&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>,
        <span class="hljs-string">&quot;日文&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>
    }
}

schema.add_field(
    field_name=<span class="hljs-string">&quot;text&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">2000</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    multi_analyzer_params=multi_analyzer_params
)

<span class="hljs-comment"># Add sparse vector field for BM25</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    datatype=DataType.SPARSE_FLOAT_VECTOR
)

<span class="hljs-comment"># Define BM25 function</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>]
)

schema.add_function(bm25_function)

<span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Prepare multilingual test data</span>
multilingual_data = [
    <span class="hljs-comment"># English data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Artificial intelligence is revolutionizing technology industries worldwide&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Machine learning algorithms process large datasets efficiently&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Vector databases provide fast similarity search capabilities&quot;</span>},
    
    <span class="hljs-comment"># Chinese data  </span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工智能正在改变世界各行各业&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;机器学习算法能够高效处理大规模数据集&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;向量数据库提供快速的相似性搜索功能&quot;</span>},
    
    <span class="hljs-comment"># Japanese data</span>
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;人工知能は世界中の技術産業に革命をもたらしています&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;機械学習アルゴリズムは大量のデータセットを効率的に処理します&quot;</span>},
    {<span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;ベクトルデータベースは高速な類似性検索機能を提供します&quot;</span>},
]

client.insert(
    collection_name=COLLECTION_NAME,
    data=multilingual_data
)

<span class="hljs-comment"># Wait for BM25 function to generate vectors</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Waiting for BM25 vector generation...&quot;</span>)
client.flush(COLLECTION_NAME)
time.sleep(<span class="hljs-number">5</span>)
client.load_collection(COLLECTION_NAME)

<span class="hljs-comment"># Demonstrate tokenizer effect</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nTokenizer Analysis:&quot;</span>)

test_texts = {
    <span class="hljs-string">&quot;en&quot;</span>: <span class="hljs-string">&quot;The running algorithms are processing data efficiently&quot;</span>,
    <span class="hljs-string">&quot;zh&quot;</span>: <span class="hljs-string">&quot;这些运行中的算法正在高效地处理数据&quot;</span>, 
    <span class="hljs-string">&quot;jp&quot;</span>: <span class="hljs-string">&quot;これらの実行中のアルゴリズムは効率的にデータを処理しています&quot;</span>
}

<span class="hljs-keyword">for</span> lang, text <span class="hljs-keyword">in</span> test_texts.items():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{lang}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
    <span class="hljs-keyword">try</span>:
        analyzer_result = client.run_analyzer(
            texts=text,
            collection_name=COLLECTION_NAME,
            field_name=<span class="hljs-string">&quot;text&quot;</span>,
            analyzer_names=[lang]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → <span class="hljs-subst">{analyzer_result}</span>&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  → Analysis failed: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-comment"># Multi-language search demo</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch Test:&quot;</span>)

search_cases = [
    (<span class="hljs-string">&quot;zh&quot;</span>, <span class="hljs-string">&quot;人工智能&quot;</span>),
    (<span class="hljs-string">&quot;jp&quot;</span>, <span class="hljs-string">&quot;機械学習&quot;</span>),
    (<span class="hljs-string">&quot;en&quot;</span>, <span class="hljs-string">&quot;algorithm&quot;</span>),
]

<span class="hljs-keyword">for</span> lang, query <span class="hljs-keyword">in</span> search_cases:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n<span class="hljs-subst">{lang}</span> &#x27;<span class="hljs-subst">{query}</span>&#x27;:&quot;</span>)
    <span class="hljs-keyword">try</span>:
        search_results = client.search(
            collection_name=COLLECTION_NAME,
            data=[query],
            search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
            output_fields=[<span class="hljs-string">&quot;language&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>],
            limit=<span class="hljs-number">3</span>,
            <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;language == &quot;<span class="hljs-subst">{lang}</span>&quot;&#x27;</span>
        )
        
        <span class="hljs-keyword">if</span> search_results <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(search_results[<span class="hljs-number">0</span>]) &gt; <span class="hljs-number">0</span>:
            <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> search_results[<span class="hljs-number">0</span>]:
                score = result[<span class="hljs-string">&quot;distance&quot;</span>]
                text = result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>]
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>: <span class="hljs-subst">{text}</span>&quot;</span>)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;  No results&quot;</span>)
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Error: <span class="hljs-subst">{e}</span>&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nComplete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Output：</p>
<pre><code translate="no"><span class="hljs-title class_">Waiting</span> <span class="hljs-keyword">for</span> <span class="hljs-title class_">BM25</span> vector generation...

<span class="hljs-title class_">Tokenizer</span> <span class="hljs-title class_">Analysis</span>:
<span class="hljs-attr">en</span>: <span class="hljs-title class_">The</span> running algorithms are processing data efficiently
  → [<span class="hljs-string">&#x27;run&#x27;</span>, <span class="hljs-string">&#x27;algorithm&#x27;</span>, <span class="hljs-string">&#x27;process&#x27;</span>, <span class="hljs-string">&#x27;data&#x27;</span>, <span class="hljs-string">&#x27;effici&#x27;</span>]
<span class="hljs-attr">zh</span>: 这些运行中的算法正在高效地处理数据
  → [<span class="hljs-string">&#x27;这些&#x27;</span>, <span class="hljs-string">&#x27;运行&#x27;</span>, <span class="hljs-string">&#x27;中&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;算法&#x27;</span>, <span class="hljs-string">&#x27;正在&#x27;</span>, <span class="hljs-string">&#x27;高效&#x27;</span>, <span class="hljs-string">&#x27;地&#x27;</span>, <span class="hljs-string">&#x27;处理&#x27;</span>, <span class="hljs-string">&#x27;数据&#x27;</span>]
<span class="hljs-attr">jp</span>: これらの実行中のアルゴリズムは効率的にデータを処理しています
  → [<span class="hljs-string">&#x27;これらの&#x27;</span>, <span class="hljs-string">&#x27;実行&#x27;</span>, <span class="hljs-string">&#x27;中の&#x27;</span>, <span class="hljs-string">&#x27;アルゴリズム&#x27;</span>, <span class="hljs-string">&#x27;効率&#x27;</span>, <span class="hljs-string">&#x27;的&#x27;</span>, <span class="hljs-string">&#x27;データ&#x27;</span>, <span class="hljs-string">&#x27;処理&#x27;</span>, <span class="hljs-string">&#x27;し&#x27;</span>, <span class="hljs-string">&#x27;てい&#x27;</span>, <span class="hljs-string">&#x27;ます&#x27;</span>]

<span class="hljs-title class_">Search</span> <span class="hljs-title class_">Test</span>:

zh <span class="hljs-string">&#x27;人工智能&#x27;</span>:
  <span class="hljs-number">3.300</span>: 人工智能正在改变世界各行各业

jp <span class="hljs-string">&#x27;機械学習&#x27;</span>:
  <span class="hljs-number">3.649</span>: 機械学習アルゴリズムは大量のデータセットを効率的に処理します

en <span class="hljs-string">&#x27;algorithm&#x27;</span>:
  <span class="hljs-number">2.096</span>: <span class="hljs-title class_">Machine</span> learning algorithms process large datasets efficiently

<span class="hljs-title class_">Complete</span>
<button class="copy-code-btn"></button></code></pre>
<p>Also, Milvus supports the language_identifier tokenizer for search. It automatically detects the languages of a given text, which means the language field is optional. For more details, check out<a href="https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md"> How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale</a>.</p>
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
    </button></h2><p>The Milvus Analyzer turns what used to be a simple preprocessing step into a well-defined, modular system for handling text. Its design—built around tokenization and filtering—gives developers fine-grained control over how language is interpreted, cleaned, and indexed. Whether you’re building a single-language application or a global RAG system that spans multiple languages, the Analyzer provides a consistent foundation for full-text search. It’s the part of Milvus that quietly makes everything else work better.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
