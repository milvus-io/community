---
id: deep-dive-8-knowhere.md
title: What Powers Similarity Search in Milvus Vector Database?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'And no, it''s not Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
    <span>cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/cydrain">Yudong Cai</a> and translated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>As the core vector execution engine, Knowhere to Milvus is what an engine is to a sports car. This post introduces what Knowhere is, how it is different from Faiss, and how the code of Knowhere is structured.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">The concept of Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere in the Milvus architecture</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere Vs Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Understanding the Knowhere code</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Adding indexes to Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">The concept of Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Narrowly speaking, Knowhere is an operation interface for accessing services in the upper layers of the system and vector similarity search libraries like <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> in the lower layers of the system. In addition, Knowhere is also in charge of heterogeneous computing. More specifically, Knowhere controls on which hardware (eg. CPU or GPU) to execute index building and search requests. This is how Knowhere gets its name - knowing where to execute the operations. More types of hardware including DPU and TPU will be supported in future releases.</p>
<p>In a broader sense, Knowhere also incorporates other third-party index libraries like Faiss. Therefore, as a whole, Knowhere is recognized as the core vector computation engine in the Milvus vector database.</p>
<p>From the concept of Knowhere, we can see that it only processes data computing tasks, while those tasks like sharding, load balance, disaster recovery are beyond the work scope of Knowhere.</p>
<p>Starting from Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (in the broader sense) becomes independent from the Milvus project.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere in the Milvus architecture<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
    <span>knowhere architecture</span>
  </span>
</p>
<p>Computation in Milvus mainly involves vector and scalar operations. Knowhere only handles the operations on vectors in Milvus. The figure above illustrates the Knowhere architecture in Milvus.</p>
<p>The bottom-most layer is the system hardware. The third-party index libraries are on top of the hardware. Then Knowhere interacts with the index node and query node on the top via CGO.</p>
<p>This article talks about Knowhere in its broader sense, as marked within the blue frame in the architecture illustration.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere Vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere not only further extends the functions of Faiss but also optimizes the performance. More specifically, Knowhere has the following advantages.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Support for BitsetView</h3><p>Initially, bitset was introduced in Milvus for the purpose of &quot;soft deletion&quot;. A soft-deleted vector still exists in the database but will not be computed during a vector similarity search or query. Each bit in the bitset corresponds to an indexed vector. If a vector is marked as “1” in the bitset, it means this vector is soft-deleted and will not be involved during a vector search.</p>
<p>The bitset parameters are added to all the exposed Faiss index query APIs in Knowhere, including CPU and GPU indexes.</p>
<p>Learn more about <a href="https://milvus.io/blog/2022-2-14-bitset.md">how bitset enables the versatility of vector search</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Support for more similarity metrics for indexing binary vectors</h3><p>Apart from <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>, Knowhere also supports <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>. Jaccard and Tanimoto can be used to measure the similarity between two sample sets while Superstructure and Substructure can be used to measure the similarity of chemical structures.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Support for AVX512 instruction set</h3><p>Faiss itself supports multiple instruction sets including <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere further extends the supported instruction sets by adding <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, which can <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">improve the performance of index building and query by 20% to 30%</a> compared to AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Automatic SIMD-instruction selection</h3><p>Knowhere is designed to work well on a wide spectrum of CPU processors (both on-premises and cloud platforms) with different SIMD instructions (e.g., SIMD SSE, AVX, AVX2, and AVX512). Thus the challenge is, given a single piece of software binary (i.e., Milvus), how to make it automatically invoke the suitable SIMD instructions on any CPU processor? Faiss does not support automatic SIMD-instruction selection and users need to manually specify the SIMD flag (e.g., “-msse4”) during compilation. However, Knowhere is built by refactoring the codebase of Faiss. Common functions (e.g., similarity computing) that rely on SIMD accelerations are factored out. Then for each function, four versions (i.e., SSE, AVX, AVX2, AVX512) are implemented and each put into a separate source file. Then the source files are further compiled individually with the corresponding SIMD flag. Therefore, at runtime, Knowhere can automatically choose the best suited SIMD instructions based on the current CPU flags and then link the right function pointers using hooking.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Other performance optimization</h3><p>Read <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a> for more about Knowhere’s performance optimization.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Understanding the Knowhere code<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>As mentioned in the first section, Knowhere only handles vector search operations. Therefore, Knowhere only processes the vector field of an entity (currently, only one vector field for entities in a collection is supported). Index building and vector similarity search are also targeted at the vector field in a segment. To have a better understanding of the data model, read the blog <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">here</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
    <span>entity fields</span>
  </span>
</p>
<h3 id="Index" class="common-anchor-header">Index</h3><p>Index is a type of independent data structure from the original vector data. Indexing requires four steps: create an index, train data, insert data and build an index.</p>
<p>For some of the AI applications, dataset training is an individual process from vector search. In this type of application, data from datasets are first trained and then inserted into a vector database like Milvus for similarity search. Open datasets like sift1M and sift1B provides data for training and testing. However, in Knowhere, data for training and searching are mixed together. That is to say, Knowhere trains all the data in a segment and then inserts all the trained data and builds an index for them.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere code structure</h3><p>DataObj is the base class of all data structure in Knowhere. <code translate="no">Size()</code> is the only virtual method in DataObj. The Index class inherits from DataObj with a field named &quot;size_&quot;. The Index class also has two virtual methods - <code translate="no">Serialize()</code> and <code translate="no">Load()</code>. The VecIndex class derived from Index is the virtual base class for all vector indexes. VecIndex provides methods including <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code>, and <code translate="no">ClearStatistics()</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
    <span>base clase</span>
  </span>
</p>
<p>Other index types are listed on the right in the figure above.</p>
<ul>
<li>The Faiss index has two sub classes: FaissBaseIndex for all indexes on float point vectors, and FaissBaseBinaryIndex for all indexes on binary vectors.</li>
<li>GPUIndex is the base class for all Faiss GPU indexes.</li>
<li>OffsetBaseIndex is the base class for all self-developed indexes. Only vector ID is stored in the index file. As a result, an index file size for 128-dimensional vectors can be reduced by 2 orders of magnitude. We recommend taking the original vectors into consideration as well when using this type of index for vector similarity search.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
    <span>IDMAP</span>
  </span>
</p>
<p>Technically speaking, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> is not an index, but rather used for brute-force search. When vectors are inserted to the vector database, no data training and index building is required. Searches will be conducted directly on the inserted vector data.</p>
<p>However, for the sake of code consistency, IDMAP also inherits from the VecIndex class with all its virtual interfaces. The usage of IDMAP is the same as other indexes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
    <span>IVF</span>
  </span>
</p>
<p>The IVF (inverted file) indexes are the most frequently used. The IVF class is derived from VecIndex and FaissBaseIndex, and further extends to IVFSQ and IVFPQ. GPUIVF is derived from GPUIndex and IVF. Then GPUIVF further extends to GPUIVFSQ and GPUIVFPQ.</p>
<p>IVFSQHybrid is a class for self-developed hybrid index that is executed by coarse quantize on GPU. And search in the bucket is executed on CPU. This type of index can reduce the occurrence of memory copy between CPU and GPU by leveraging the computing power of GPU. IVFSQHybrid has the same recall rate as GPUIVFSQ but comes with a better performance.</p>
<p>The base class structure for binary indexes are relatively simpler. BinaryIDMAP and BinaryIVF are derived from FaissBaseBinaryIndex and VecIndex.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
    <span>third-party index</span>
  </span>
</p>
<p>Currently, only two types of third-party indexes are supported apart from Faiss: tree-based index Annoy, and graph-based index HNSW. These two common and frequently used third-party indexes are both derived from VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Adding indexes to Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to add new indexes to Knowhere, you can refer to existing indexes first:</p>
<ul>
<li>To add quantization-based index, refer to IVF_FLAT.</li>
<li>To add graph-based index, refer to HNSW.</li>
<li>To add tree-based index, refer to Annoy.</li>
</ul>
<p>After referring to the existing index, you can follow the steps below to add a new index to Knowhere.</p>
<ol>
<li>Add the name of the new index in <code translate="no">IndexEnum</code>. The data type is string.</li>
<li>Add data validation check on the new index in the file <code translate="no">ConfAdapter.cpp</code>. The validation check is mainly to validate the parameters for data training and query.</li>
<li>Create a new file for the new index. The base class of the new index should include <code translate="no">VecIndex</code>, and the necessary virtual interface of <code translate="no">VecIndex</code>.</li>
<li>Add the index building logic for new index in <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Add unit test under the <code translate="no">unittest</code> directory.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
