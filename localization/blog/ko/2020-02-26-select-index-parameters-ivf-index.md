---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Best practices for IVF index
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>How to Select Index Parameters for IVF Index</custom-h1><p>In <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Best Practices for Milvus Configuration</a>, some best practices for Milvus 0.6.0 configuration were introduced. In this article, we will also introduce some best practices for setting key parameters in Milvus clients for operations including creating a table, creating indexes, and searching. These parameters can affect search performance.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>When creating a table, the index_file_size parameter is used to specify the size, in MB, of a single file for data storage. The default is 1024. When vector data is being imported, Milvus incrementally combines data into files. When the file size reaches index_file_size, this file does not accept new data and Milvus saves new data to another file. These are all raw data files. When an index is created, Milvus generates an index file for each raw data file. For the IVFLAT index type, the index file size approximately equals to the size of the corresponding raw data file. For the SQ8 index, the size of an index file is approximately 30 percent of the corresponding raw data file.</p>
<p>During a search, Milvus searches each index file one by one. Per our experience, when index_file_size changes from 1024 to 2048, the search performance improves by 30 percent to 50 percent. However, if the value is too large, large files may fail to be loaded to GPU memory (or even CPU memory). For example, if GPU memory is 2 GB and index_file_size is 3 GB, the index file cannot be loaded to GPU memory. Usually, we set index_file_size to 1024 MB or 2048 MB.</p>
<p>The following table shows a test using sift50m for index_file_size. The index type is SQ8.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
    <span>1-sift50m-test-results-milvus.png</span>
  </span>
</p>
<p>We can see that in CPU mode and GPU mode, when index_file_size is 2048 MB instead of 1024 MB, the search performance significantly improves.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>and</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>The <code translate="no">nlist</code> parameter is used for index creating and the <code translate="no">nprobe</code> parameter is used for searching. IVFLAT and SQ8 both use clustering algorithms to split a large number of vectors into clusters, or buckets. <code translate="no">nlist</code> is the number of buckets during clustering.</p>
<p>When searching using indexes, the first step is to find a certain number of buckets closest to the target vector and the second step is to find the most similar k vectors from the buckets by vector distance. <code translate="no">nprobe</code> is the number of buckets in step one.</p>
<p>Generally, increasing <code translate="no">nlist</code> leads to more buckets and fewer vectors in a bucket during clustering. As a result, the computation load decreases and search performance improves. However, with fewer vectors for similarity comparison, the correct result might be missed.</p>
<p>Increasing <code translate="no">nprobe</code> leads to more buckets to search. As a result, the computation load increases and search performance deteriorates, but search precision improves. The situation may differ per datasets with different distributions. You should also consider the size of the dataset when setting <code translate="no">nlist</code> and <code translate="no">nprobe</code>. Generally, it is recommended that <code translate="no">nlist</code> can be <code translate="no">4 * sqrt(n)</code>, where n is the total number of vectors. As for <code translate="no">nprobe</code>, you must make a trade-off between precision and efficiency and the best way is to determine the value through trial and error.</p>
<p>The following table shows a test using sift50m for <code translate="no">nlist</code> and <code translate="no">nprobe</code>. The index type is SQ8.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
    <span>sq8-index-test-sift50m.png</span>
  </span>
</p>
<p>The table compares search performance and precision using different values of <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Only GPU results are displayed because CPU and GPU tests have similar results. In this test, as the values of <code translate="no">nlist</code>/<code translate="no">nprobe</code> increase by the same percentage, search precision also increase. When <code translate="no">nlist</code> = 4096 and <code translate="no">nprobe</code> is 128, Milvus has the best search performance. In conclusion, when determining the values for <code translate="no">nlist</code> and <code translate="no">nprobe</code>, you must make a trade-off between performance and precision with consideration to different datasets and requirements.</p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: When the data size is greater than <code translate="no">index_file_size</code>, the greater the value of <code translate="no">index_file_size</code>, the better the search performance.
<code translate="no">nlist</code> and <code translate="no">nprobe</code>：You must make a trade-off between performance and precision.</p>
