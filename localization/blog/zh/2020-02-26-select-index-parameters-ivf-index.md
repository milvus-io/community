---
id: select-index-parameters-ivf-index.md
title: 1.index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: 试管婴儿指数的最佳做法
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>如何为 IVF 索引选择索引参数</custom-h1><p>在《<a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Milvus 配置的最佳实践</a>》中，介绍了 Milvus 0.6.0 配置的一些最佳实践。在本文中，我们还将介绍在 Milvus 客户端中设置关键参数的一些最佳实践，这些参数用于包括创建表、创建索引和搜索等操作。这些参数会影响搜索性能。</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1.<code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>创建表格时，index_file_size 参数用于指定用于存储数据的单个文件的大小（单位：MB）。默认值为 1024。导入向量数据时，Milvus 会以增量方式将数据合并到文件中。当文件大小达到 index_file_size 时，此文件不接受新数据，Milvus 会将新数据保存到另一个文件中。这些都是原始数据文件。创建索引时，Milvus 会为每个原始数据文件生成一个索引文件。对于 IVFLAT 索引类型，索引文件的大小大约等于相应原始数据文件的大小。对于 SQ8 索引，索引文件的大小约为相应原始数据文件的 30%。</p>
<p>在搜索过程中，Milvus 会逐个搜索每个索引文件。根据我们的经验，当 index_file_size 从 1024 变为 2048 时，搜索性能会提高 30% 到 50%。但是，如果该值过大，大文件可能无法加载到 GPU 内存（甚至 CPU 内存）。例如，如果 GPU 内存为 2 GB，而 index_file_size 为 3 GB，索引文件就无法加载到 GPU 内存。通常，我们将 index_file_size 设置为 1024 MB 或 2048 MB。</p>
<p>下表显示了使用 sift50m 对 index_file_size 进行的测试。索引类型为 SQ8。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>我们可以看到，在 CPU 模式和 GPU 模式下，当索引文件大小为 2048 MB 而不是 1024 MB 时，搜索性能明显提高。</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2.<code translate="no">nlist</code> <strong>和</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">nlist</code> 参数用于创建索引，而<code translate="no">nprobe</code> 参数用于搜索。IVFLAT 和 SQ8 都使用聚类算法将大量向量分成簇，即桶。<code translate="no">nlist</code> 是聚类过程中桶的数量。</p>
<p>使用索引搜索时，第一步是找到一定数量最接近目标向量的桶，第二步是通过向量距离从桶中找出最相似的 k 个向量。<code translate="no">nprobe</code> 是第一步中的桶数。</p>
<p>一般来说，在聚类过程中，增加<code translate="no">nlist</code> 会导致桶数增加，桶内向量减少。因此，计算负荷会减少，搜索性能也会提高。不过，由于用于相似性比较的向量较少，可能会错过正确的结果。</p>
<p>增加<code translate="no">nprobe</code> 会带来更多的搜索桶。因此，计算负荷会增加，搜索性能会下降，但搜索精度会提高。不同分布的数据集情况可能不同。设置<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 时还应考虑数据集的大小。一般来说，建议<code translate="no">nlist</code> 可以是<code translate="no">4 * sqrt(n)</code> ，其中 n 是向量的总数。至于<code translate="no">nprobe</code> ，您必须在精度和效率之间做出权衡，最好的方法是通过反复试验来确定值。</p>
<p>下表显示了使用 sift50m 对<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 进行的测试。索引类型为 SQ8。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>该表比较了使用<code translate="no">nlist</code>/<code translate="no">nprobe</code> 的不同值时的搜索性能和精度。由于 CPU 和 GPU 测试的结果相似，因此只显示了 GPU 的结果。在该测试中，当<code translate="no">nlist</code>/<code translate="no">nprobe</code> 的值以相同百分比增加时，搜索精度也会增加。当<code translate="no">nlist</code> = 4096 和<code translate="no">nprobe</code> 为 128 时，Milvus 的搜索性能最好。总之，在确定<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 的值时，必须根据不同的数据集和要求，在性能和精确度之间做出权衡。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>:当数据大小大于<code translate="no">index_file_size</code> 时，<code translate="no">index_file_size</code> 的值越大，搜索性能越好。<code translate="no">nlist</code> 和<code translate="no">nprobe</code>：必须在性能和精度之间做出权衡。</p>
