---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Introducing Milvus 2.5: Full-Text Search, More Powerful Metadata Filtering,
  and Usability Improvements!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Overview<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>We are thrilled to present the latest version of Milvus, 2.5, which introduces a powerful new capability: <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">full-text search</a>, also known as lexical or keyword search. If you are new to search, full-text search allows you to find documents by searching for specific words or phrases within them, similar to how you search in Google. This complements our existing semantic search capabilities, which understand the meaning behind your search rather than just matching exact words.</p>
<p>We use the industry-standard BM25 metric for document similarity, and our implemention is based on sparse vectors, allowing for more efficient storage and retrieval. For those unfamiliar with the term, sparse vectors are a way to represent text where most values are zero, making them very efficient to store and process—imagine a huge spreadsheet where only a few cells contain numbers, and the rest are empty. This approach fits well into Milvus’s product philosophy where the vector is the core search entity.</p>
<p>An additional noteworthy aspect of our implementation is the capability to insert and query text <em>directly</em> rather than having users first manually convert text into sparse vectors. This takes Milvus one step closer towards fully processing unstructured data.</p>
<p>But this is just the beginning. With the release of 2.5, we updated the <a href="https://milvus.io/docs/roadmap.md">Milvus product roadmap</a>. In future product iterations of Milvus, our focus will be on evolving Milvus’s capabilities in four key directions:</p>
<ul>
<li>Streamlined unstructured data processing;</li>
<li>Better search quality and efficiency;</li>
<li>Easier data management;</li>
<li>Lowering costs through algorithmic and design advances</li>
</ul>
<p>Our aim is to build data infrastructure that can both efficiently store and effectively retrieve information in the AI era.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Full-text Search via Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Although semantic search typically has better contexual awareness and intent understanding, when a user needs to search for specific proper nouns, serial numbers, or a completely-matching phrase, full-text retrieval with keyword matching often produces more accurate results.</p>
<p>To illustrate this with an example:</p>
<ul>
<li>Semantic search excels when you ask: “Find documents about renewable energy solutions”</li>
<li>Full-text search is better when you need: &quot;Find documents mentioning <em>Tesla Model 3 2024</em>&quot;</li>
</ul>
<p>In our previous version (Milvus 2.4), users had to pre-process their text using a separate tool (the BM25EmbeddingFunction module to the PyMilvus) on their own machines before they could search it This approach had several limitations: it couldn’t handle growing datasets well, required extra setup steps, and made the whole process more complicated than necessary. For the technically minded, the key limitations were that it could only work on a single machine; the vocabulary and other corpus statistics used for BM25 scoring couldn’t be updated as the corpus changed; and converting text to vectors on the client side is less intuitive working withtext directly.</p>
<p>Milvus 2.5 simplifies everything. Now you can work with your text directly:</p>
<ul>
<li>Store your original text documents as they are</li>
<li>Search using natural language queries</li>
<li>Get results back in readable form</li>
</ul>
<p>Behind the scenes, Milvus handles all the complex vector conversions automatically making it easier to work with text data. This is what we call our “Doc in, Doc out” approach—you work with readable text, and we handle the rest.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Techical Implementation</h3><p>For those interested in the technical details, Milvus 2.5 adds the full-text search capability through its built-in Sparse-BM25 implementation, including:</p>
<ul>
<li><strong>A Tokenizer built on tantivy</strong>: Milvus now integrates with the thriving tantivy ecosystem</li>
<li><strong>Capability to ingest and retrieve raw documents</strong>: Support for direct ingestion and query of text data</li>
<li><strong>BM25 relevance scoring</strong>: Internalize BM25 scoring, implemented based on sparse vector</li>
</ul>
<p>We chose to work with the well-developed tantivy ecosystem and build the Milvus text tokenizer on tantivy. In the future, Milvus will support more tokenizers and expose the tokenization process to help users better understand the retrieval quality. We will also explore deep learning-based tokenizers and stemmer strategies to further optimize the performance of full-text search. Below is sample code for using and configuring the tokenizer:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>After configuring the tokenizer in the collection schema, users can register the text to bm25 function via add_function method. This will run internally in the Milvus server. All subsequent data flows such as additions, deletions, modifications, and queries can be completed by operating on the raw text string, as opposed to the vector representation. See below code example for how to ingest text and conduct full-text search with the new API:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>We have adopted an implementation of BM25 relevance scoring that represents queries and documents as sparse vectors, called <strong>Sparse-BM25</strong>. This unlocks many optimizations based on sparse vector, such as:</p>
<p>Milvus achieves hybrid search capabilities through its cutting-edge <strong>Sparse-BM25 implementation</strong>, which integrates full-text search into the vector database architecture. By representing term frequencies as sparse vectors instead of traditional inverted indexes, Sparse-BM25 enables advanced optimizations, such as <strong>graph indexing</strong>, <strong>product quantization (PQ)</strong>, and <strong>scalar quantization (SQ)</strong>. These optimizations minimize memory usage and accelerate search performance. Similar to inverted index approach, Milvus supports taking raw text as input and generating sparse vectors internally. This make it able to work with any tokenizer and grasp any word shown in the dynamicly changing corpus.</p>
<p>Additionally, heuristic-based pruning discards low-value sparse vectors, further enhancing efficiency without compromising accuracy. Unlike previous approach using sparse vector, it can adapt to a growing corpus, not the accuracy of BM25 scoring.</p>
<ol>
<li>Building graph indexes on the sparse vector, which performs better than inverted index on queries with long text as inverted index needs more steps to finish matching the tokens in the query;</li>
<li>Leveraging approximation techniques to speed up search with only minor impact on retrieval quality, such as vector quantization and heuristic based pruning;</li>
<li>Unifying the interface and data model for performing semantic search and full-text search, thus enhancing the user experience.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>In summary, Milvus 2.5 has expanded its search capability beyond semantic search by introducing full-text retrieval, making it easier for users to build high quality AI applications. These are just initial steps in the space of Sparse-BM25 search and we anticipate that there will be further optimization measures to try in the future.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Text Matching Search Filters<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>A second text search feature released with Milvus 2.5 is <strong>Text Match</strong>, which allows the user to filter the search to entries containing a specific text string. This feature is also built on the basis of tokenization and is activated with <code translate="no">enable_match=True</code>.</p>
<p>It is worth noting that with Text Match, the processing of the query text is based on the logic of OR after tokenization. For example, in the example below, the result will return all documents (using the ‘text’ field) that contain either ‘vector’ or 'database’.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>If your scenario requires matching both ‘vector’ and 'database’, then you need to write two separate Text Matches and overlay them with AND to achieve your goal.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Significant Enhancement in Scalar Filtering Performance<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Our emphasis on scalar filtering performance originates from our discovery that the combination of vector retrieval and metadata filtering can greatly improve query performance and accuracy in various scenarios. These scenarios range from image search applications such as corner case identification in autonomous driving to complex RAG scenarios in enterprise knowledge bases. Thus, it is highly suitable for enterprise users to implement in large-scale data application scenarios.</p>
<p>In practice, many factors like how much data you’re filtering, how your data is organized, and how you’re searching can affect performance. To address this, Milvus 2.5 introduces three new types of indexes—BitMap Index, Array Inverted Index, and the Inverted Index after tokenizing the Varchar text field. These new indexes can significantly improve performance in real-world use cases.</p>
<p>Specifically:</p>
<ol>
<li><strong>BitMap Index</strong> can be used to accelerate tag filtering (common operators include in, array_contains, etc.), and is suitable for scenarios with fewer field category data (data cardinality). The principle is to determine whether a row of data has a certain value on a column, with 1 for yes and 0 for no, and then maintain a BitMap list. The following chart shows the performance test comparison we conducted based on a customer’s business scenario. In this scenario, the data volume is 500 million, the data category is 20, different values have different distribution proportions (1%, 5%, 10%, 50%), and the performance under different filtering amounts also varies. With 50% filtering, we can achieve a 6.8-fold performance gain through BitMap Index. It’s worth noting that as cardinality increases, compared to BitMap Index, Inverted Index will show more balanced performance.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Match</strong> is based on the Inverted Index after the text field is tokenized. Its performance far exceeds the Wildcard Match (i.e., like + %) function we provided in 2.4. According to our internal test results, the advantages of Text Match are very clear, especially in concurrent query scenarios, where it can achieve up to a 400-fold QPS increase.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In terms of JSON data processing, we plan to introduce in subsequent versions of 2.5.x the building of inverted indices for user-specified keys and default location information recording for all keys to speed up parsing. We expect both of these areas to significantly enhance the query performance of JSON and Dynamic Field. We plan to showcase more information in future release notes and technical blogs, so stay tuned!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">New Management Interface<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Managing a database shouldn’t require a computer science degree, but we know database administrators need powerful tools. That’s why we’ve introduced the <strong>Cluster Management WebUI</strong>, a new web-based interface accessible at your cluster’s address on port 9091/webui. This observability tool provides:</p>
<ul>
<li>Real-time monitoring dashboards showing cluster-wide metrics</li>
<li>Detailed memory and performance analytics per node</li>
<li>Segment information and slow query tracking</li>
<li>System health indicators and node status</li>
<li>Easy-to-use troubleshooting tools for complex system issues</li>
</ul>
<p>While this interface is still in beta, we’re actively developing it based on user feedback from database administrators. Future updates will include AI-assisted diagnostics, more interactive management features, and enhanced cluster observability capabilities.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Documentation and Developer Experience<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>We’ve completely revamped our <strong>documentation</strong> and <strong>SDK/API</strong> experience to make Milvus more accessible while maintaining depth for experienced users. The improvements include:</p>
<ul>
<li>A restructured documentation system with clearer progression from basic to advanced concepts</li>
<li>Interactive tutorials and real-world examples that showcase practical implementations</li>
<li>Comprehensive API references with practical code samples</li>
<li>A more user-friendly SDK design that simplifies common operations</li>
<li>Illustrated guides that make complex concepts easier to understand</li>
<li>An AI-powered documentation assistant (ASK AI) for quick answers</li>
</ul>
<p>The updated SDK/API focuses on improving developer experience through more intuitive interfaces and better integration with the documentation. We believe you’ll notice these improvements when working with the 2.5.x series.</p>
<p>However, we know documentation and SDK development is an ongoing process. We’ll continue optimizing both the content structure and SDK design based on community feedback. Join our Discord channel to share your suggestions and help us improve further.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Summary</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 contains 13 new features and several system-level optimizations, contributed not just by Zilliz but the open-source community. We have only touched on a few of them in this post and encourage you to visit our <a href="https://milvus.io/docs/release_notes.md">release note</a> and <a href="https://milvus.io/docs">official documents</a> for more information!</p>
