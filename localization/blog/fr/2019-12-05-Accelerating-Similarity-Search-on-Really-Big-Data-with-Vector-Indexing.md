---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: Accelerating Similarity Search on Really Big Data with Vector Indexing
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Without vector indexing, many modern applications of AI would be impossibly
  slow. Learn how to select the right index for your next machine learning
  application.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Accelerating Similarity Search on Really Big Data with Vector Indexing</custom-h1><p>From computer vision to new drug discovery, vector similarity search engines power many popular artificial intelligence (AI) applications. A huge component of what makes it possible to efficiently query the million-, billion-, or even trillion-vector datasets that similarity search engines rely on is indexing, a process of organizing data that drastically accelerates big data search. This article covers the role indexing plays in making vector similarity search efficient, different vector inverted file (IVF) index types, and advice on which index to use in different scenarios.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Accelerating Similarity Search on Really Big Data with Vector Indexing</a>
<ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">How does vector indexing accelerate similarity search and machine learning?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">What are different types of IVF indexes and which scenarios are they best suited for?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Good for searching relatively small (million-scale) datasets when 100% recall is required.</a>
<ul>
<li><a href="#flat-performance-test-results">FLAT performance test results:</a>
<ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Query time test results for the FLAT index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Key takeaways:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Improves speed at the expense of accuracy (and vice versa).</a>
<ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLAT performance test results:</a>
<ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Query time test results for IVF_FLAT index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Key takeaways:</a>
<ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Recall rate test results for the IVF_FLAT index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Key takeaways:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: Faster and less resource hungry than IVF_FLAT, but also less accurate.</a>
<ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8 performance test results:</a>
<ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Query time test results for IVF_SQ8 index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Key takeaways:</a>
<ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Recall rate test results for IVF_SQ8 index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Key takeaways:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: New hybrid GPU/CPU approach that is even faster than IVF_SQ8.</a>
<ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8H performance test results:</a>
<ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Query time test results for IVF_SQ8H index in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Key takeaways:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Learn more about Milvus, a massive-scale vector data management platform.</a></li>
<li><a href="#methodology">Methodology</a>
<ul>
<li><a href="#performance-testing-environment">Performance testing environment</a></li>
<li><a href="#relevant-technical-concepts">Relevant technical concepts</a></li>
<li><a href="#resources">Resources</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">How does vector indexing accelerate similarity search and machine learning?</h3><p>Similarity search engines work by comparing an input to a database to find objects that are most similar to the input. Indexing is the process of efficiently organizing data, and it plays a major role in making similarity search useful by dramatically accelerating time-consuming queries on large datasets. After a massive vector dataset is indexed, queries can be routed to clusters, or subsets of data, that are most likely to contain vectors similar to an input query. In practice, this means a certain degree of accuracy is sacrificed to speed up queries on really big vector data.</p>
<p>An analogy can be drawn to a dictionary, where words are sorted alphabetically. When looking up a word, it is possible to quickly navigate to a section that only contains words with the same initial — drastically accelerating the search for the input word’s definition.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">What are different types of IVF indexes and which scenarios are they best suited for?</h3><p>There are numerous indexes designed for high-dimensional vector similarity search, and each one comes with tradeoffs in performance, accuracy, and storage requirements. This article covers several common IVF index types, their strengths and weaknesses, as well as performance test results for each index type. Performance testing quantifies query time and recall rates for each index type in <a href="https://milvus.io/">Milvus</a>, an open-source vector data management platform. For additional information on the testing environment, see the methodology section at the bottom of this article.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Good for searching relatively small (million-scale) datasets when 100% recall is required.</h3><p>For vector similarity search applications that require perfect accuracy and depend on relatively small (million-scale) datasets, the FLAT index is a good choice. FLAT does not compress vectors, and is the only index that can guarantee exact search results. Results from FLAT can also be used as a point of comparison for results produced by other indexes that have less than 100% recall.</p>
<p>FLAT is accurate because it takes an exhaustive approach to search, which means for each query the target input is compared to every vector in a dataset. This makes FLAT the slowest index on our list, and poorly suited for querying massive vector data. There are no parameters for the FLAT index in Milvus, and using it does not require data training or additional storage.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">FLAT performance test results:</h4><p>FLAT query time performance testing was conducted in Milvus using a dataset comprised of 2 million 128-dimensional vectors.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>As nq (the number of target vectors for a query) increases, query time increases.</li>
<li>Using the FLAT index in Milvus, we can see that query time rises sharply once nq exceeds 200.</li>
<li>In general, the FLAT index is faster and more consistent when running Milvus on GPU vs. CPU. However, FLAT queries on CPU are faster when nq is below 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Improves speed at the expense of accuracy (and vice versa).</h3><p>A common way to accelerate the similarity search process at the expense of accuracy is to conduct an approximate nearest neighbor (ANN) search. ANN algorithms decrease storage requirements and computation load by clustering similar vectors together, resulting in faster vector search. IVF_FLAT is the most basic inverted file index type and relies on a form of ANN search.</p>
<p>IVF_FLAT divides vector data into a number of cluster units (nlist), and then compares distances between the target input vector and the center of each cluster. Depending on the number of clusters the system is set to query (nprobe), similarity search results are returned based on comparisons between the target input and the vectors in the most similar cluster(s) only — drastically reducing query time.</p>
<p>By adjusting nprobe, an ideal balance between accuracy and speed can be found for a given scenario. Results from our IVF_FLAT performance test demonstrate that query time increases sharply as both the number of target input vectors (nq), and the number of clusters to search (nprobe), increase. IVF_FLAT does not compress vector data however, index files include metadata that marginally increases storage requirements compared to the raw non-indexed vector dataset.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">IVF_FLAT performance test results:</h4><p>IVF_FLAT query time performance testing was conducted in Milvus using the public 1B SIFT dataset, which contains 1 billion 128-dimensional vectors.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>When running on CPU, query time for the IVF_FLAT index in Milvus increases with both nprobe and nq. This means the more input vectors a query contains, or the more clusters a query searches, the longer query time will be.</li>
<li>On GPU, the index shows less time variance against changes in nq and nprobe. This is because the index data is large, and copying data from CPU memory to GPU memory accounts for the majority of total query time.</li>
<li>In all scenarios, except when nq = 1,000 and nprobe = 32, the IVF_FLAT index is more efficient when running on CPU.</li>
</ul>
<p>IVF_FLAT recall performance testing was conducted in Milvus using both the public 1M SIFT dataset, which contains 1 million 128-dimensional vectors, and the glove-200-angular dataset, which contains 1+ million 200-dimensional vectors, for index building (nlist = 16,384).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>The IVF_FLAT index can be optimized for accuracy, achieving a recall rate above 0.99 on the 1M SIFT dataset when nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: Faster and less resource hungry than IVF_FLAT, but also less accurate.</h3><p>IVF_FLAT does not perform any compression, so the index files it produces are roughly the same size as the original, raw non-indexed vector data. For example, if the original 1B SIFT dataset is 476 GB, its IVF_FLAT index files will be slightly larger (~470 GB). Loading all the index files into memory will consume 470 GB of storage.</p>
<p>When disk, CPU, or GPU memory resources are limited, IVF_SQ8 is a better option than IVF_FLAT. This index type can convert each FLOAT (4 bytes) to UINT8 (1 byte) by performing scalar quantization. This reduces disk, CPU, and GPU memory consumption by 70–75%. For the 1B SIFT dataset, the IVF_SQ8 index files require just 140 GB of storage.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8 performance test results:</h4><p>IVF_SQ8 query time testing was conducted in Milvus using the public 1B SIFT dataset, which contains 1 billion 128-dimensional vectors, for index building.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>By reducing index file size, IVF_SQ8 offers marked performance improvements over IVF_FLAT. IVF_SQ8 follows a similar performance curve to IVF_FLAT, with query time increasing with nq and nprobe.</li>
<li>Similar to IVF_FLAT, IVF_SQ8 sees faster performance when running on CPU and when nq and nprobe are smaller.</li>
</ul>
<p>IVF_SQ8 recall performance testing was conducted in Milvus using both the public 1M SIFT dataset, which contains 1 million 128-dimensional vectors, and the glove-200-angular dataset, which contains 1+ million 200-dimensional vectors, for index building (nlist = 16,384).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>Despite compressing the original data, IVF_SQ8 does not see a significant decrease in query accuracy. Across various nprobe settings, IVF_SQ8 has at most a 1% lower recall rate than IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: New hybrid GPU/CPU approach that is even faster than IVF_SQ8.</h3><p>IVF_SQ8H is a new index type that improves query performance compared to IVF_SQ8. When an IVF_SQ8 index running on CPU is queried, most of the total query time is spent finding nprobe clusters that are nearest to the target input vector. To reduce query time, IVF_SQ8 copies the data for coarse quantizer operations, which is smaller than the index files, to GPU memory — greatly accelerating coarse quantizer operations. Then gpu_search_threshold determines which device runs the query. When nq &gt;= gpu_search_threshold, GPU runs the query; otherwise, CPU runs the query.</p>
<p>IVF_SQ8H is a hybrid index type that requires the CPU and GPU to work together. It can only be used with GPU-enabled Milvus.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8H performance test results:</h4><p>IVF_SQ8H query time performance testing was conducted in Milvus using the public 1B SIFT dataset, which contains 1 billion 128-dimensional vectors, for index building.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png</span>
  </span>
</p>
<h4 id="Key-takeaways" class="common-anchor-header">Key takeaways:</h4><ul>
<li>When nq is less than or equal to 1,000, IVF_SQ8H sees query times nearly twice as fast as IVFSQ8.</li>
<li>When nq = 2000, query times for IVFSQ8H and IVF_SQ8 are the same. However, if the gpu_search_threshold parameter is lower than 2000, IVF_SQ8H will outperform IVF_SQ8.</li>
<li>IVF_SQ8H’s query recall rate is identical to IVF_SQ8’s, meaning less query time is achieved with no loss in search accuracy.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Learn more about Milvus, a massive-scale vector data management platform.</h3><p>Milvus is a vector data management platform that can power similarity search applications in fields spanning artificial intelligence, deep learning, traditional vector calculations, and more. For additional information about Milvus, check out the following resources:</p>
<ul>
<li>Milvus is available under an open-source license on <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>Additional index types, including graph- and tree-based indexes, are supported in Milvus. For a comprehensive list of supported index types, see <a href="https://milvus.io/docs/v0.11.0/index.md">documentation for vector indexes</a> in Milvus.</li>
<li>To learn more about the company that launched Milvus, visit <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Chat with the Milvus community or get help with a problem on <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Methodology</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Performance testing environment</h4><p>The server configuration used across performance tests referenced in this article is as follows:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 cores</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB memory</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Relevant technical concepts</h4><p>Although not required for understanding this article, here are a few technical concepts that are helpful for interpreting the results from our index performance tests:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
    <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png</span>
  </span>
</p>
<h4 id="Resources" class="common-anchor-header">Resources</h4><p>The following sources were used for this article:</p>
<ul>
<li>“<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Encyclopedia of database systems</a>,” Ling Liu and M. Tamer Özsu.</li>
</ul>
