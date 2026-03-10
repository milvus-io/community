---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: |
  How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 introduces a completely overhauled text analysis pipeline with
  comprehensive multi-language support for full text search.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Modern AI applications are becoming increasingly complex. You can’t just throw one search method at a problem and call it done.</p>
<p>Take recommendation systems, for example—they require <strong>vector search</strong> to understand the meaning of text and images, <strong>metadata filtering</strong> to narrow results by price, category, or location, and <strong>keyword search</strong> for direct queries like “Nike Air Max.” Each method solves a different part of the problem, and real-world systems need all of them working together.</p>
<p>The future of search isn’t about choosing between vector and keyword. It’s about combining vector AND keyword AND filtering, along with other search types—all in one place. That’s why we started building <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">hybrid search</a> into Milvus a year ago, with the release of Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">But Full-Text Search Works Differently<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Bringing full-text search into a vector-native system isn’t easy. Full-text search has its own set of challenges.</p>
<p>While vector search captures the <em>semantic</em> meaning of text—turning it into high-dimensional vectors—full-text search depends on understanding <strong>the structure of language</strong>: how words are formed, where they begin and end, and how they relate to one another. For instance, when a user searches for “running shoes” in English, the text goes through several processing steps:</p>
<p><em>Split on whitespace → lowercase → remove stopwords → stem “running” to &quot;run&quot;.</em></p>
<p>To handle this correctly, we need a robust <strong>language analyzer</strong>—one that handles splitting, stemming, filtering, and more.</p>
<p>When we introduced <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25 full-text search</a> in Milvus 2.5, we included a customizable analyzer, and it worked well for what it was designed to do. You could define a pipeline using tokenizers, token filters, and character filters to prepare text for indexing and search.</p>
<p>For English, this setup was relatively straightforward. But things become more complex when you deal with multiple languages.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">The Challenge of Multilingual Full-Text Search<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Multilingual full-text search introduces a range of challenges:</p>
<ul>
<li><p><strong>Complex languages need special treatment</strong>: Languages like Chinese, Japanese, and Korean don’t use spaces between words. They need advanced tokenizers to segment characters into meaningful words. These tools may work well for a single language but rarely support multiple complex languages simultaneously.</p></li>
<li><p><strong>Even similar languages can conflict</strong>: English and French might both use whitespace to separate words, but once you apply language-specific processing like stemming or lemmatization, one language’s rules can interfere with the other’s. What improves accuracy for English might distort French queries—and vice versa.</p></li>
</ul>
<p>In short, <strong>different languages require different analyzers</strong>. Trying to process Chinese text with an English analyzer leads to failure—there are no spaces to split on, and English stemming rules can corrupt Chinese characters.</p>
<p>The bottom line? Relying on a single tokenizer and analyzer for multilingual datasets makes it nearly impossible to ensure consistent, high-quality tokenization across all languages. And that leads directly to degraded search performance.</p>
<p>As teams began adopting full-text search in Milvus 2.5, we started hearing the same feedback:</p>
<p><em>“This is perfect for our searches in English, but what about our multilingual customer support tickets?” “We love having both vector and BM25 search, but our dataset includes Chinese, Japanese, and English content.” “Can we get the same search precision across all our languages?”</em></p>
<p>These questions confirmed what we had already seen in practice: full-text search fundamentally differs from vector search. Semantic similarity works well across languages, but accurate text search requires a deep understanding of each language’s structure.</p>
<p>That’s why <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduces a completely overhauled text analysis pipeline with comprehensive multi-language support. This new system automatically applies the correct analyzer for each language, enabling accurate and scalable full-text search across multilingual datasets, without manual configuration or compromise in quality.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">How Milvus 2.6 Enables Robust Multilingual Full-Text Search<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>After extensive research and development, we’ve built a suite of features that address different multilingual scenarios. Each approach solves the language-dependency problem in its own way.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Multi-Language Analyzer: Precision Through Control</h3><p>The <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Multi-Language Analyzer</strong></a> allows you to define different text processing rules for different languages within the same collection, instead of forcing all languages through the same analysis pipeline.</p>
<p><strong>Here’s how it works:</strong> you configure language-specific analyzers and tag each document with its language during insertion. When performing a BM25 search, you specify which language analyzer to use for query processing. This ensures that both your indexed content and search queries are processed with the optimal rules for their respective languages.</p>
<p><strong>Perfect for:</strong> Applications where you know the language of your content and want maximum search precision. Think multinational knowledge bases, localized product catalogs, or region-specific content management systems.</p>
<p><strong>The requirement:</strong> You need to provide language metadata for each document. Currently only available for BM25 search operations.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Language Identifier Tokenizer: Automatic Language Detection</h3><p>We know that manually tagging every piece of content isn’t always practical. The <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a> brings automatic language detection directly into the text analysis pipeline.</p>
<p><strong>Here’s how it works:</strong> This intelligent tokenizer analyzes incoming text, detects its language using sophisticated detection algorithms, and automatically applies the appropriate language-specific processing rules. You configure it with multiple analyzer definitions - one for each language you want to support, plus a default fallback analyzer.</p>
<p>We support two detection engines: <code translate="no">whatlang</code> for faster processing and <code translate="no">lingua</code> for higher accuracy. The system supports 71-75 languages, depending on your chosen detector. During both indexing and search, the tokenizer automatically selects the right analyzer based on detected language, falling back to your default configuration when detection is uncertain.</p>
<p><strong>Perfect for:</strong> Dynamic environments with unpredictable language mixing, user-generated content platforms, or applications where manual language tagging isn’t feasible.</p>
<p><strong>The trade-off:</strong> Automatic detection adds processing latency and may struggle with very short text or mixed-language content. But for most real-world applications, the convenience significantly outweighs these limitations.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU Tokenizer: Universal Foundation</h3><p>If the first two options feel like overkill, we’ve got something simpler for you. We’ve newly integrated the<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU (International Components for Unicode) tokenizer</a> into Milvus 2.6. ICU has been around forever - it’s a mature, widely-used set of libraries that handles text processing for tons of languages and scripts. The cool thing is that it can handle various complex and simple languages all at once.</p>
<p>The ICU tokenizer is honestly a great default choice. It uses Unicode-standard rules for breaking up words, which makes it reliable for dozens of languages that don’t have their own specialized tokenizers. If you just need something powerful and general-purpose that works well across multiple languages, ICU does the job.</p>
<p><strong>Limitation:</strong> ICU still works within a single analyzer, so all your languages end up sharing the same filters. Want to do language-specific stuff like stemming or lemmatization? You’ll run into the same conflicts we talked about earlier.</p>
<p><strong>Where it really shines:</strong> We built ICU to work as the default analyzer within the multi-language or language identifier setups. It’s basically your intelligent safety net for handling languages you haven’t explicitly configured.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">See It in Action: Hands-On Demo<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Enough theory—let’s dive into some code! Here’s how to use the new multilingual features in <strong>pymilvus</strong> to build a multilingual search collection.</p>
<p>We’ll start by defining some reusable analyzer configurations, then walk through <strong>two complete examples</strong>:</p>
<ul>
<li><p>Using the <strong>Multi-Language Analyzer</strong></p></li>
<li><p>Using the <strong>Language Identifier Tokenizer</strong></p></li>
</ul>
<p>👉 For the complete demo code, check out <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">this GitHub page</a>.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Step 1: Set up the Milvus Client</h3><p><em>First, we connect to Milvus, set a collection name, and clean up any existing collections to start fresh.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Step 2: Define Analyzers for Multiple Languages</h3><p>Next, we define an <code translate="no">analyzers</code> dictionary with language-specific configurations. These will be used in both multilingual search methods shown later.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Option A: Using The Multi-Language Analyzer</h3><p>This approach is best when you <strong>know the language of each document ahead of time</strong>. You’ll pass that information through a dedicated <code translate="no">language</code> field during data insertion.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Create a Collection with Multi-Language Analyzer</h4><p>We’ll create a collection where the <code translate="no">&quot;text&quot;</code> field uses different analyzers depending on the <code translate="no">language</code> field value.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Insert Multilingual Data and Load Collection</h4><p>Now insert documents in English and Japanese. The <code translate="no">language</code> field tells Milvus which analyzer to use.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Run Full-Text Search</h4><p>To search, specify which analyzer to use for the query based on its language.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Results:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Option B: Using the Language Identifier Tokenizer</h3><p>This approach takes the manual language handling out of your hands. The <strong>Language Identifier Tokenizer</strong> automatically detects the language of each document and applies the correct analyzer—no need to specify a <code translate="no">language</code> field.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Create a Collection with Language Identifier Tokenizer</h4><p>Here, we create a collection where the <code translate="no">&quot;text&quot;</code> field uses automatic language detection to choose the right analyzer.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Insert Data and Load Collection</h4><p>Insert text in different languages—no need to label them. Milvus detects and applies the correct analyzer automatically.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Run Full-Text Search</h4><p>Here’s the best part: <strong>no need to specify an analyzer</strong> when searching. The tokenizer automatically detects the query language and applies the right logic.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Results</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6 takes a big step forward in making <strong>hybrid search</strong> more powerful and accessible, combining vector search with keyword search, now across multiple languages. With the enhanced multilingual support, you can build apps that understand <em>what users mean</em> and <em>what they say</em>, no matter what language they’re using.</p>
<p>But that’s just one part of the update. Milvus 2.6 also brings several other features that make search faster, smarter, and easier to work with:</p>
<ul>
<li><p><strong>Better Query Matching</strong> – Use <code translate="no">phrase_match</code> and <code translate="no">multi_match</code> for more accurate searches</p></li>
<li><p><strong>Faster JSON Filtering</strong> – Thanks to a new, dedicated index for JSON fields</p></li>
<li><p><strong>Scalar-Based Sorting</strong> – Sort results by any numeric field</p></li>
<li><p><strong>Advanced Reranking</strong> – Reorder results using models or custom scoring logic</p></li>
</ul>
<p>Want the complete breakdown of Milvus 2.6? Check out our latest post: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</strong></a><strong>.</strong></p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
