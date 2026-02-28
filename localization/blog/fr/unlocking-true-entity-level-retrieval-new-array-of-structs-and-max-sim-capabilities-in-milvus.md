---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >
  Unlocking True Entity-Level Retrieval: New Array-of-Structs and MAX_SIM
  Capabilities in Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Learn how Array of Structs and MAX_SIM in Milvus enable true entity-level
  search for multi-vector data, eliminating deduping and improving retrieval
  accuracy.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>If you’ve built AI applications on top of vector databases, you’ve probably hit the same pain point: the database retrieves embeddings of individual chunks, but your application cares about <strong><em>entities</em>.</strong> The mismatch makes the entire retrieval workflow complex.</p>
<p>You’ve likely seen this play out again and again:</p>
<ul>
<li><p><strong>RAG knowledge bases:</strong> Articles are chunked into paragraph embeddings, so the search engine returns scattered fragments instead of the complete document.</p></li>
<li><p><strong>E-commerce recommendation:</strong> A product has multiple image embeddings, and your system returns five angles of the same item rather than five unique products.</p></li>
<li><p><strong>Video platforms:</strong> Videos are split into clip embeddings, but search results surface slices of the same video rather than a single consolidated entry.</p></li>
<li><p><strong>ColBERT / ColPali–style retrieval:</strong> Documents expand into hundreds of token or patch-level embeddings, and your results come back as tiny pieces that still require merging.</p></li>
</ul>
<p>All of these issues stem from the <em>same architectural gap</em>: most vector databases treat each embedding as an isolated row, while real applications operate on higher-level entities — documents, products, videos, items, scenes. As a result, engineering teams are forced to reconstruct entities manually using deduplication, grouping, bucketing, and reranking logic. It works, but it’s fragile, slow, and bloats your application layer with logic that should never have lived there in the first place.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> closes this gap with a new feature: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> with the <strong>MAX_SIM</strong> metric type. Together, they allow all embeddings for a single entity to be stored in a single record and enable Milvus to score and return the entity holistically. No more duplicate-filled result sets. No more complex post-processing like reranking and merging</p>
<p>In this article, we’ll walk through how Array of Structs and MAX_SIM work—and demonstrate them through two real examples: Wikipedia document retrieval and ColPali image-based document search.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">What is an Array of Structs?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus, an <strong>Array of Structs</strong> field allows a single record to contain an <em>ordered list</em> of Struct elements, each following the same predefined schema. A Struct can hold multiple vectors as well as scalar fields, strings, or any other supported types. In other words, it lets you bundle all the pieces that belong to one entity—paragraph embeddings, image views, token vectors, metadata—directly inside one row.</p>
<p>Here’s an example of an entity from a collection that contains an Array of Structs field.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>In the example above, the <code translate="no">chunks</code> field is an Array of Structs field, and each Struct element contains its own fields, namely <code translate="no">text</code>, <code translate="no">text_vector</code>, and <code translate="no">chapter</code>.</p>
<p>This approach solves a long-standing modeling issue in vector databases. Traditionally, every embedding or attribute has to become its own row, which forces <strong>multi-vector entities (documents, products, videos)</strong> to be split into dozens, hundreds, or even thousands of records. With Array of Structs, Milvus lets you store the entire multi-vector entity in a single field, making it a natural fit for paragraph lists, token embeddings, clip sequences, multi-view images, or any scenario where one logical item is composed of many vectors.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">How Does an Array of Structs Work with MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Layered on top of this new array of structs structure is <strong>MAX_SIM</strong>, a new scoring strategy that makes semantic retrieval entity-aware. When a query comes in, Milvus compares it against <em>every</em> vector inside each Array of Structs and takes the <strong>maximum similarity</strong> as the entity’s final score. The entity is then ranked—and returned—based on that single score. This avoids the classic vector-database problem of retrieving scattered fragments and pushing the burden of grouping, deduping, and reranking into the application layer. With MAX_SIM, entity-level retrieval becomes built-in, consistent, and efficient.</p>
<p>To understand how MAX_SIM works in practice, let’s walk through a concrete example.</p>
<p><strong>Note:</strong> All vectors in this example are generated by the same embedding model, and similarity is measured with cosine similarity in the [0,1] range.</p>
<p>Suppose a user searches for <strong>“Machine Learning Beginner Course.”</strong></p>
<p>The query is tokenized into three <strong>tokens</strong>:</p>
<ul>
<li><p><em>Machine learning</em></p></li>
<li><p><em>beginner</em></p></li>
<li><p><em>course</em></p></li>
</ul>
<p>Each of these tokens is then <strong>converted into an embedding vector</strong> by the same embedding model used for the documents.</p>
<p>Now, imagine the vector database contains two documents:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>An Introduction Guide to Deep Neural Networks with Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>An Advanced Guide to LLM Paper Reading</em></p></li>
</ul>
<p>Both documents have been embedded into vectors and stored inside an Array of Structs.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Step 1: Compute MAX_SIM for doc_1</strong></h3><p>For each query vector, Milvus computes its cosine similarity against every vector in doc_1:</p>
<table>
<thead>
<tr><th></th><th>Introduction</th><th>guide</th><th>deep neural networks</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>machine learning</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>beginner</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>course</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>For each query vector, MAX_SIM selects the <strong>highest</strong> similarity from its row:</p>
<ul>
<li><p>machine learning → deep neural networks (0.9)</p></li>
<li><p>beginner → introduction (0.8)</p></li>
<li><p>course → guide (0.7)</p></li>
</ul>
<p>Summing the best matches gives doc_1 a <strong>MAX_SIM score of 2.4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Step 2: Compute MAX_SIM for doc_2</h3><p>Now we repeat the process for doc_2:</p>
<table>
<thead>
<tr><th></th><th>advanced</th><th>guide</th><th>LLM</th><th>paper</th><th>reading</th></tr>
</thead>
<tbody>
<tr><td>machine learning</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>beginner</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>course</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>The best matches for doc_2 are:</p>
<ul>
<li><p>“machine learning” → “LLM” (0.9)</p></li>
<li><p>“beginner” → “guide” (0.6)</p></li>
<li><p>“course” → “guide” (0.8)</p></li>
</ul>
<p>Summing them gives doc_2 a <strong>MAX_SIM score of 2.3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Step 3: Compare the Scores</h3><p>Because <strong>2.4 &gt; 2.3</strong>, <strong>doc_1 ranks higher than doc_2</strong>, which makes intuitive sense, since doc_1 is closer to an introductory machine learning guide.</p>
<p>From this example, we can highlight three core characteristics of MAX_SIM:</p>
<ul>
<li><p><strong>Semantic first, not keyword-based:</strong> MAX_SIM compares embeddings, not text literals. Even though <em>“machine learning”</em> and <em>“deep neural networks”</em> share zero overlapping words, their semantic similarity is 0.9. This makes MAX_SIM robust to synonyms, paraphrases, conceptual overlap, and modern embedding-rich workloads.</p></li>
<li><p><strong>Insensitive to length and order:</strong> MAX_SIM does not require the query and document to have the same number of vectors (e.g., doc_1 has 4 vectors while doc_2 has 5, and both work fine). It also ignores vector order—“beginner” appearing earlier in the query and “introduction” appearing later in the document has no impact on the score.</p></li>
<li><p><strong>Every query vector matters:</strong> MAX_SIM takes the best match for each query vector and sums those best scores. This prevents unmatched vectors from skewing the result and ensures that every important query token contributes to the final score. For example, the lower-quality match for “beginner” in doc_2 directly reduces its overall score.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Why MAX_SIM + Array of Structs Matter in Vector Database<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> is an open-source, high-performance vector database and it now fully supports MAX_SIM together with Array of Structs, enabling vector-native, entity-level multi-vector retrieval:</p>
<ul>
<li><p><strong>Store multi-vector entities natively:</strong> Array of Structs allows you to store groups of related vectors in a single field without splitting them into separate rows or auxiliary tables.</p></li>
<li><p><strong>Efficient best-match computation:</strong> Combined with vector indexes such as IVF and HNSW, MAX_SIM can compute the best matches without scanning every vector, keeping performance high even with large documents.</p></li>
<li><p><strong>Purpose-built for semantic-heavy workloads:</strong> This approach excels in long-text retrieval, multi-facet semantic matching, document–summary alignment, multi-keyword queries, and other AI scenarios that require flexible, fine-grained semantic reasoning.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">When to Use an Array of Structs<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>The value of <strong>Array of Structs</strong> becomes clear when you look at what it enables. At its core, this feature provides three foundational capabilities:</p>
<ul>
<li><p><strong>It bundles heterogeneous data</strong>—vectors, scalars, strings, metadata—into a single structured object.</p></li>
<li><p><strong>It aligns storage with real-world entities</strong>, so each database row maps cleanly to an actual item such as an article, a product, or a video.</p></li>
<li><p><strong>When combined with aggregate functions like MAX_SIM</strong>, it enables true entity-level multi-vector retrieval directly from the database, eliminating deduplication, grouping, or reranking in the application layer.</p></li>
</ul>
<p>Because of these properties, Array of Structs is a natural fit whenever a <em>single logical entity is represented by multiple vectors</em>. Common examples include articles split into paragraphs, documents decomposed into token embeddings, or products represented by multiple images. If your search results suffer from duplicate hits, scattered fragments, or the same entity appearing multiple times in the top results, Array of Structs solves these issues at the storage and retrieval layer—not through after-the-fact patching in application code.</p>
<p>This pattern is especially powerful for modern AI systems that rely on <strong>multi-vector retrieval</strong>.
For instance:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> represents a single document as 100–500 token embeddings for fine-grained semantic matching across domains such as legal text and academic research.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> </a>converts each PDF page into 256–1024 image patches for cross-modal retrieval across financial statements, contracts, invoices, and other scanned documents.</p></li>
</ul>
<p>An array of Structs lets Milvus store all these vectors under a single entity and compute aggregate similarity (e.g., MAX_SIM) efficiently and natively. To make this clearer, here are two concrete examples.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Example 1: E-commerce Product Search</h3><p>Previously, products with multiple images were stored in a flat schema—one image per row. A product with front, side, and angled shots produced three rows. Search results often returned multiple images of the same product, requiring manual deduplication and reranking.</p>
<p>With an Array of Structs, each product becomes <strong>one row</strong>. All image embeddings and metadata (angle, is_primary, etc.) live inside an <code translate="no">images</code> field as an array of structs. Milvus understands they belong to the same product and returns the product as a whole—not its individual images.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Example 2: Knowledge Base or Wikipedia Search</h3><p>Previously, a single Wikipedia article was split into <em>N</em> paragraph rows. Search results returned scattered paragraphs, forcing the system to group them and guess which article they belonged to.</p>
<p>With an Array of Structs, the entire article becomes <strong>one row</strong>. All paragraphs and their embeddings are grouped under a paragraphs field, and the database returns the full article, not fragmented pieces.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Hands-on Tutorials: Document-Level Retrieval with the Array of Structs<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Wikipedia Document Retrieval</h3><p>In this tutorial, we’ll walk through how to use an <strong>Array of Structs</strong> to convert paragraph-level data into full document records—allowing Milvus to perform <strong>true document-level retrieval</strong> rather than returning isolated fragments.</p>
<p>Many knowledge base pipelines store Wikipedia articles as paragraph chunks. This works well for embedding and indexing, but it breaks retrieval: a user query typically returns scattered paragraphs, forcing you to manually group and reconstruct the article. With an Array of Structs and MAX_SIM, we can redesign the storage schema so that <strong>each article becomes one row</strong>, and Milvus can rank and return the entire document natively.</p>
<p>In the next steps, we’ll show how to:</p>
<ol>
<li><p>Load and preprocess Wikipedia paragraph data</p></li>
<li><p>Bundle all paragraphs belonging to the same article into an Array of Structs</p></li>
<li><p>Insert these structured documents into Milvus</p></li>
<li><p>Run MAX_SIM queries to retrieve full articles—cleanly, without deduping or reranking</p></li>
</ol>
<p>By the end of this tutorial, you’ll have a working pipeline where Milvus handles entity-level retrieval directly, exactly the way users expect.</p>
<p><strong>Data Model:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 1: Group and Transform the Data</strong></p>
<p>For this demo, we use the <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a> dataset.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 2: Create the Milvus Collection</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 3: Insert Data and Build Index</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 4: Search Documents</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comparing Outputs: Traditional Retrieval vs. Array of Structs</strong></p>
<p>The impact of Array of Structs becomes clear when we look at what the database actually returns:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimension</strong></th><th style="text-align:center"><strong>Traditional Approach</strong></th><th style="text-align:center"><strong>Array of Structs</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Database Output</strong></td><td style="text-align:center">Returns <strong>Top 100 paragraphs</strong> (high redundancy)</td><td style="text-align:center">Returns the <em>top 10 full documents</em> — clean and accurate</td></tr>
<tr><td style="text-align:center"><strong>Application Logic</strong></td><td style="text-align:center">Requires <strong>grouping, deduplication, and reranking</strong> (complex)</td><td style="text-align:center">No post-processing needed — entity-level results come directly from Milvus</td></tr>
</tbody>
</table>
<p>In the Wikipedia example, we demonstrated only the simplest case: combining paragraph vectors into a unified document representation. But the real strength of Array of Structs is that it generalizes to <strong>any</strong> multi-vector data model—both classic retrieval pipelines and modern AI architectures.</p>
<p><strong>Traditional Multi-Vector Retrieval Scenarios</strong></p>
<p>Many well-established search and recommendation systems naturally operate on entities with multiple associated vectors. Array of Structs maps to these use cases cleanly:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Scenario</strong></th><th style="text-align:center"><strong>Data Model</strong></th><th style="text-align:center"><strong>Vectors per Entity</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>E-commerce products</strong></td><td style="text-align:center">One product → multiple images</td><td style="text-align:center">5–20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Video search</strong></td><td style="text-align:center">One video → multiple clips</td><td style="text-align:center">20–100</td></tr>
<tr><td style="text-align:center">📖 <strong>Paper retrieval</strong></td><td style="text-align:center">One paper → multiple sections</td><td style="text-align:center">5–15</td></tr>
</tbody>
</table>
<p><strong>AI Model Workloads (Key Multi-Vector Use Cases)</strong></p>
<p>Array of Structs becomes even more critical in modern AI models that intentionally produce large sets of vectors per entity for fine-grained semantic reasoning.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Model</strong></th><th style="text-align:center"><strong>Data Model</strong></th><th style="text-align:center"><strong>Vectors per Entity</strong></th><th style="text-align:center"><strong>Application</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">One document → many token embeddings</td><td style="text-align:center">100–500</td><td style="text-align:center">Legal text, academic papers, fine-grained document retrieval</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">One PDF page → many patch embeddings</td><td style="text-align:center">256–1024</td><td style="text-align:center">Financial reports, contracts, invoices, multimodal document search</td></tr>
</tbody>
</table>
<p>These models <em>require</em> a multi-vector storage pattern. Before Array of Structs, developers had to split vectors across rows and manually stitch results back together. With Milvus, these entities can now be stored and retrieved natively, with MAX_SIM handling document-level scoring automatically.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. ColPali Image-Based Document Search</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> is a powerful model for cross-modal PDF retrieval. Instead of relying on text, it processes each PDF page as an image and slices it into up to 1024 visual patches, generating one embedding per patch. Under a traditional database schema, this would require storing a single page as hundreds or thousands of separate rows, making it impossible for the database to understand that these rows belong to the same page. As a result, entity-level search becomes fragmented and impractical.</p>
<p>Array of Structs solves this cleanly by storing all patch embeddings <em>inside a single field</em>, allowing Milvus to treat the page as one cohesive multi-vector entity.</p>
<p>Traditional PDF search often depends on <strong>OCR</strong>, which converts page images into text. This works for plain text but loses charts, tables, layout, and other visual cues. ColPali avoids this limitation by working directly on page images, preserving all visual and textual information. The trade-off is scale: each page now contains hundreds of vectors, which requires a database that can aggregate many embeddings into one entity—exactly what Array of Structs + MAX_SIM provides.</p>
<p>The most common use case is <strong>Vision RAG</strong>, where each PDF page becomes a multi-vector entity. Typical scenarios include:</p>
<ul>
<li><p><strong>Financial reports:</strong> searching thousands of PDFs for pages containing specific charts or tables.</p></li>
<li><p><strong>Contracts:</strong> retrieving clauses from scanned or photographed legal documents.</p></li>
<li><p><strong>Invoices:</strong> finding invoices by vendor, amount, or layout.</p></li>
<li><p><strong>Presentations:</strong> locating slides that contain a particular figure or diagram.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Data Model:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 1: Prepare the Data</strong>
You can refer to the doc for details on how ColPali converts images or text into multi-vector representations.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 2: Create the Milvus Collection</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 3: Insert Data and Build Index</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Step 4: Cross-Modal Search: Text Query → Image Results</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Sample Output:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Here, the results directly return full PDF pages. We don’t need to worry about the underlying 1024 patch embeddings—Milvus handles all the aggregation automatically.</p>
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
    </button></h2><p>Most vector databases store each fragment as an independent record, which means applications have to reassemble those fragments when they need a full document, product, or page. An array of Structs changes that. By combining scalars, vectors, text, and other fields into a single structured object, it allows one database row to represent one complete entity end-to-end.</p>
<p>The result is simple but powerful: work that used to require complex grouping, deduping, and reranking in the application layer becomes a native database capability. And that’s exactly where the future of vector databases is heading—richer structures, smarter retrieval, and simpler pipelines.</p>
<p>For more information about Array of Structs and MAX_SIM, check the documentation below:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Milvus Documentation</a></li>
</ul>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
