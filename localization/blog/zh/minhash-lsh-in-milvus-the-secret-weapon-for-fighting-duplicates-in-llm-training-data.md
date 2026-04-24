---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH in Milvus 2.6 offers an efficient solution for deduplicating
  massive LLM training datasets, with 2x faster processing and 3- 5x cost
  savings compared to traditional methods.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Large Language Models (LLMs) have transformed the AI landscape with their ability to write code, create content, and solve complex problems. However, these powerful models require enormous amounts of high-quality data to fuel their training.</p>
<p>The challenge is that raw training data often contains significant redundancy. It’s like teaching a child by repeating the same lessons over and over while skipping other important topics. A large AI company approached us with precisely this problem - they were building an ambitious new language model but struggled with deduplicating tens of billions of documents. Traditional matching methods couldn’t scale to this volume, and specialized deduplication tools required massive computational resources, making them economically unviable.</p>
<p>To solve this problem, we introduced MinHash LSH (Locality Sensitive Hashing) indexing in Milvus 2.6. This article will explore how MinHash LSH efficiently solves the data deduplication problem for LLM training.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Data Deduplication: Why It Matters for LLM Training<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>High-quality, diverse data is essential for training powerful LLMs. When duplicate content appears in training data, it creates several significant problems:</p>
<ul>
<li><p><strong>Wasted Resources:</strong> Redundant data increases training time, costs, and energy consumption.</p></li>
<li><p><strong>Reduced Performance:</strong> Models can overfit to repeated content, limiting their ability to generalize to new information.</p></li>
<li><p><strong>Memorization Effect:</strong> Duplicated content increases the chance of models memorizing and reproducing specific text verbatim. It could also potentially lead to privacy leaks or copyright issues.</p></li>
<li><p><strong>Misleading Evaluations:</strong> Duplicates between training and test sets can accidentally inflate performance metrics.</p></li>
</ul>
<p>There are three main approaches to finding and removing duplicates:</p>
<ul>
<li><p><strong>Exact Matching:</strong> Identifies identical duplicates through hashing.</p></li>
<li><p><strong>Approximate Matching:</strong> Finds near-duplicates using algorithms like MinHash LSH and Jaccard similarity.</p></li>
<li><p><strong>Semantic Matching:</strong> Identifies content with similar meaning using vector embeddings.</p></li>
</ul>
<p>With pre-training corpora reaching terabytes or even petabytes, traditional exact matching methods like pairwise comparisons are computationally infeasible. Semantic deduplication adds significant overhead by using embedding models to generate vectors. We need more innovative approximate methods—like <strong>MinHash LSH</strong>—that balance recall and precision while keeping costs manageable, making large-scale deduplication practical.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: Efficiently Detecting Near-Duplicates in Massive Datasets<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>To find near-duplicates in an ocean of training data, we need an approximate matching algorithm that’s both efficient and accurate. MinHash LSH (Locality Sensitive Hashing) is a great tool for this goal. Let’s break down this seemingly complex term step by step.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Step 1: Representing Documents with MinHash</h3><p>First, we need a way to measure document similarity. The standard approach uses Jaccard similarity:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo><mfrac><mrow><mi mathvariant="normal">∣</mi><mi>A</mi><mo>∩</mo><mi>B</mi><mi mathvariant="normal">∣</mi></mrow><mrow><mi mathvariant="normal">∣</mi><mi>A</mi><mo>∪</mo><mi>B</mi><mi mathvariant="normal">∣</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.09618em;">J</span><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">∣</span><span class="mord mathnormal">A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord">∣</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">∣</span><span class="mord mathnormal">A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.05017em;">B</span><span class="mord">∣</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>
<p>This formula measures the overlap between document A and document B - specifically, the ratio of shared elements to total unique elements. A higher value means the documents are more similar.</p>
<p>However, computing this directly for billions of document pairs is resource-intensive and would take years. MinHash creates compact “fingerprints” (signatures) that preserve similarity relationships while making comparisons much faster.</p>
<ol>
<li><strong>Shingling:</strong> Break each document into overlapping sequences of words or characters (k-shingles). For example, the sentence “I love vector search” with k=3 (by word) yields: {“I love vector”, “love vector search”}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> Apply multiple hash functions to each set of shingles and record the minimum hash value from each function. This results in a signature vector for each document.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>When calculating similarity, the probability that hash values align at the same positions in the MinHash signatures of two documents (which corresponds to the Jaccard distance of these signatures) provides a close approximation of the Jaccard similarity of their original shingle sets. This allows us to effectively estimate document similarity without directly comparing the larger original texts; instead, we can analyze their compact MinHash signatures.</p>
<p>The MinHash principle involves using the word with the smallest hash value to represent the entire document, enhancing accuracy by incorporating additional hash functions. Minor word changes are likely to be overlooked as they typically do not affect the minimum hash value. In contrast, more substantial changes tend to alter the hash value and are more easily detected. This method can be seen as a min-pooling of hash values across various words. In addition to MinHash, alternatives like SimHash are available for generating document signatures, but those will not be discussed here.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Step 2: Identifying Similar Documents via LSH</h3><p>Even with compact MinHash signatures, comparing every pair across millions or billions of documents remains computationally expensive. That’s where <strong>Locality Sensitive Hashing (LSH)</strong> comes in.</p>
<p>The key idea of LSH is to use hash functions that <strong>intentionally cause collisions</strong>—similar items are more likely to hash into the same bucket, while dissimilar ones are not. This is the opposite of traditional hashing, which aims to avoid collisions.</p>
<p>For MinHash, a popular LSH strategy is the <strong>banding technique</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Split each MinHash signature (a vector of length <em>N</em>) into <em>b</em> bands, each with <em>r</em> dims (<em>N = b × r</em>).</p></li>
<li><p><strong>Hashing Bands:</strong> Hash each band (a sub-vector of <em>r</em> values) into a bucket using a standard hash function.</p></li>
<li><p><strong>Candidate Pairs:</strong> If two documents share a bucket in <strong>any</strong> band, they are flagged as potential matches.</p></li>
</ol>
<p>By adjusting the number of bands (b) and the number of dimensions per band ®, you can control the trade-off between recall, precision, and search efficiency.</p>
<p>The key idea is: highly similar documents will have many matching hash values in their MinHash signatures. When these signatures are split into bands, even one band with all matching values is enough to place two documents in the same bucket. The more similar the documents are, the higher the probability that this happens in at least one band, allowing LSH to efficiently surface candidate pairs without exhaustively comparing all signatures.</p>
<p>In short, <strong>MinHash + LSH</strong> enables scalable approximate deduplication: MinHash compresses documents into compact signatures, and LSH efficiently narrows the search space by grouping likely matches. It’s like spotting twins in a crowd: first, take a quick feature snapshot of everyone (MinHash), group lookalikes (LSH), then inspect the smaller groups closely for actual duplicates.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Integrating MinHash LSH in Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>A real-world need drove the integration of MinHash LSH into Milvus 2.6. As mentioned earlier, a Milvus user—one of the leading LLM companies—approached us with a challenge: efficiently deduplicating massive volumes of text data for LLM pre-training.</p>
<p>Traditional deduplication pipelines typically rely on external tools decoupled from storage and retrieval systems, requiring costly data transfers between components. This fragmented workflow increases operational overhead and prevents full utilization of distributed computing resources.</p>
<p>Recognizing Milvus’s strengths in handling high-throughput vector data, a natural idea emerged: <strong><em>What if MinHash LSH were built into Milvus natively, making approximate deduplication a first-class database feature?</em></strong></p>
<p>This approach enables a complete workflow from deduplication to semantic retrieval within Milvus, simplifying MLOps while leveraging its scalability and unified API. Together with our partner, we optimized MinHash LSH for Milvus’s cloud-native architecture, resulting in a fast and scalable solution for large-scale deduplication.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Core capabilities in Milvus 2.6 include:</h3><ul>
<li><p><strong>Native MinHash LSH Indexing:</strong> Implements the standard banding technique for LSH and supports optional Jaccard re-ranking to improve recall. Provides both in-memory and mmap-based implementations for flexibility across different workloads.</p></li>
<li><p><strong>Seamless API Integration:</strong> Users can define MinHash vector fields, build <code translate="no">MINHASH_LSH</code> indexes, insert signature data, and perform approximate similarity searches using Milvus’s standard SDK and declarative APIs.</p></li>
<li><p><strong>Distributed and Scalable:</strong> Built on Milvus’s cloud-native architecture, the feature supports horizontal scaling for large datasets and high-throughput processing.</p></li>
</ul>
<p>This integration delivered impressive results. By running MinHash LSH on fully-managed Milvus (<a href="https://zilliz.com/cloud">Zilliz Cloud</a>), we helped this user deduplicate <strong>10 billion documents</strong> efficiently. Compared to their previous MapReduce-based approach, the new solution <strong>more than doubled processing speed</strong> and achieved <strong>3-5x cost savings</strong>, thanks to Milvus’s optimized indexing and query execution.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Hands-On: Deduplicating LLM Datasets Using Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s roll up our sleeves and use MinHash LSH in Milvus 2.6 to perform approximate deduplication at scale.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Prerequisite: Generating MinHash Signatures</h3><p>Milvus handles the indexing and search of <strong>pre-generated</strong> MinHash signatures. You’ll need to generate these during preprocessing using tools like <code translate="no">datasketch</code> in Python or a custom implementation. The typical steps are:</p>
<ol>
<li><p>Read raw documents</p></li>
<li><p>Shingle (tokenize or chunk) each document</p></li>
<li><p>Apply multiple hash functions to generate a MinHash signature (e.g., an uint64 array of size 128 )</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Step 1: Create a Schema in Milvus</h3><p>We need to create a Milvus collection to store the MinHash signatures and their corresponding document IDs.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Step 2: Create the MINHASH_LSH Index and Collection</strong></h3><p>This is the core step. We need to specify JACCARD as the metric type and configure LSH-related parameters.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>A Note on Parameter Tuning: The effectiveness of MinHash LSH heavily depends on parameter choices. For instance, the number of hash functions used during MinHash signature generation (i.e., <code translate="no">MINHASH_DIM</code>) affects the signature’s precision and size. In the LSH phase, the number of bands (<code translate="no">num_bands</code>) and rows per band together determine the sensitivity range of the similarity threshold and the balance between recall and precision. Users need to experiment and fine-tune based on their dataset characteristics and deduplication requirements. This is often an iterative process.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Step 3: Insert MinHash Signatures</strong></h3><p>Let’s say you have a batch of documents and their corresponding MinHash signatures.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Step 5: Search for Near-Duplicates</h3><p>Use a document’s MinHash signature to search for similar documents in the collection.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Step 6: Post-Processing and Clustering</h3><p>The returned results are <strong>candidate near-duplicates</strong>. To form complete deduplication groups, you can apply clustering techniques like <strong>Union-Find</strong> on the candidate pairs. Each resulting group represents a set of duplicates; keep one representative document and archive or remove the rest.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Conclusion</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH in Milvus 2.6 is a leap forward in AI data processing. What started as a solution for LLM data deduplication now opens doors to broader use cases—web content cleanup, catalog management, plagiarism detection, and more.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Getting Started with Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 is available now. In addition to MinHash LSH, it introduces dozens of new features and performance optimizations such as tiered storage, RabbitQ quantization method, and enhanced full-text search and multitenancy, directly addressing the most pressing challenges in vector search today: scaling efficiently while keeping costs under control.</p>
<p>Ready to explore everything Milvus offers? Dive into our<a href="https://milvus.io/docs/release_notes.md"> release notes</a>, browse the<a href="https://milvus.io/docs"> complete documentation</a>, or check out our<a href="https://milvus.io/blog"> feature blogs</a>.</p>
<p>If you have any questions or have a similar use case, feel free to reach out to us through our <a href="https://discord.com/invite/8uyFbECzPX">Discord community</a> or file an issue on<a href="https://github.com/milvus-io/milvus"> GitHub</a> — we’re here to help you make the most of Milvus 2.6.</p>
