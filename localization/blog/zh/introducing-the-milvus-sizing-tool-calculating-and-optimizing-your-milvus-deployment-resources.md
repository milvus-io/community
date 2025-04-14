---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: 介绍 Milvus 规模工具：计算和优化您的 Milvus 部署资源
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: 使用我们的用户友好型选型工具，最大限度地提高 Milvus 性能！了解如何配置您的部署，以优化资源使用并节约成本。
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>为你的 Milvus 部署选择最佳配置，对性能优化、资源有效利用和成本管理至关重要。无论您是在构建原型还是在规划生产部署，正确确定 Milvus 实例的大小都意味着一个平稳运行的向量数据库与一个在性能上挣扎或产生不必要成本的数据库之间的区别。</p>
<p>为了简化这一过程，我们改进了<a href="https://milvus.io/tools/sizing">Milvus 大小工具</a>，这是一个用户友好型计算器，可根据您的具体要求生成推荐的资源估算。在本指南中，我们将指导您使用该工具，并深入分析影响 Milvus 性能的因素。</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">如何使用 Milvus 规模工具<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>使用该工具非常简单。只需按照以下步骤操作即可。</p>
<ol>
<li><p>访问<a href="https://milvus.io/tools/sizing/"> Milvus 规模工具</a>页面。</p></li>
<li><p>输入关键参数：</p>
<ul>
<li><p>向量数量和每个向量的尺寸</p></li>
<li><p>索引类型</p></li>
<li><p>标量字段数据大小</p></li>
<li><p>分段大小</p></li>
<li><p>首选部署模式</p></li>
</ul></li>
<li><p>查看生成的资源建议</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>Milvus 大小工具</span> </span></p>
<p>让我们探讨一下这些参数对 Milvus 部署的影响。</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">索引选择：平衡存储、成本、准确性和速度<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供多种索引算法，包括<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>、FLAT、IVF_FLAT、IVF_SQ8、<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>、<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> 等，每种算法在内存使用、磁盘空间要求、查询速度和搜索准确性方面都有不同的权衡。</p>
<p>下面是你需要了解的最常用的选项：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>索引</span> </span></p>
<p>HNSW（分层导航小世界）</p>
<ul>
<li><p><strong>架构</strong>：在分层结构中将跳转列表与可导航小世界（NSW）图相结合</p></li>
<li><p><strong>性能</strong>查询速度极快，召回率极高</p></li>
<li><p><strong>资源使用</strong>：每个向量需要的内存最多（成本最高）</p></li>
<li><p><strong>最适合</strong>对速度和准确性要求较高，而对内存限制要求较低的应用</p></li>
<li><p><strong>技术说明</strong>：搜索从节点最少的最顶层开始，向下遍历密度越来越高的层</p></li>
</ul>
<p>平面</p>
<ul>
<li><p><strong>架构</strong>：没有近似值的简单穷举搜索</p></li>
<li><p><strong>性能</strong>：100% 的召回率，但查询速度极慢（<code translate="no">O(n)</code> ，数据大小为<code translate="no">n</code>)</p></li>
<li><p><strong>资源使用</strong>：索引大小等于原始向量数据大小</p></li>
<li><p><strong>最适合</strong>小数据集或需要完美召回率的应用</p></li>
<li><p><strong>技术说明</strong>： 在查询向量和数据库中的每个向量之间执行完整的距离计算</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>架构</strong>将向量空间划分为簇，以提高搜索效率</p></li>
<li><p><strong>性能</strong>：中高召回率，中等查询速度（比 HNSW 慢，但比 FLAT 快）</p></li>
<li><p><strong>资源使用</strong>：所需内存比 FLAT 少，但比 HNSW 多</p></li>
<li><p><strong>最适合</strong>在平衡应用中，可以用一些召回率来换取更好的性能</p></li>
<li><p><strong>技术说明</strong>：在搜索过程中，只检查<code translate="no">nlist</code> 集群，从而大大减少了计算量</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>架构</strong>将标量量化应用于 IVF_FLAT，压缩向量数据</p></li>
<li><p><strong>性能</strong>中等召回率，中等查询速度</p></li>
<li><p><strong>资源消耗</strong>：与 IVF_FLAT 相比，磁盘、计算和内存消耗减少 70-75</p></li>
<li><p><strong>最适合</strong>资源有限的环境，准确性可能会略有下降</p></li>
<li><p><strong>技术说明</strong>：将 32 位浮点数值压缩为 8 位整数数值</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">高级索引选项：ScaNN、DiskANN、CAGRA 等</h3><p>对于有特殊要求的开发人员，Milvus 还提供以下服务</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>：CPU 速度比 HNSW 快 20%，检索率相似</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>：磁盘/内存混合索引，是需要支持大量向量、高召回率并能接受稍长延迟（~100ms）的理想选择。它只在内存中保留部分索引，而将其余部分保留在磁盘上，从而在内存使用和性能之间取得平衡。</p></li>
<li><p><strong>基于 GPU 的索引</strong>：</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>：这是速度最快的 GPU 索引，但它需要配备 GDDR 内存的推理卡，而不是配备 HBM 内存的推理卡</p></li>
<li><p>gpu_brute_force：在 GPU 上实现穷举搜索</p></li>
<li><p>GPU_IVF_FLAT：GPU加速版本的IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ：使用<a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">乘积量化</a>的 GPU 加速版 IVF</p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>：</p>
<ul>
<li><p><strong>HNSW_SQ</strong>：非常高速的查询，内存资源有限；在召回率方面略有妥协。</p></li>
<li><p><strong>HNSW_PQ</strong>：中速查询；内存资源非常有限；可接受在召回率方面略有妥协</p></li>
<li><p><strong>HNSW_PRQ</strong>：中速查询；内存资源非常有限；在调用率方面略有妥协</p></li>
<li><p><strong>AUTOINDEX</strong>：在开源 Milvus 中默认使用 HNSW（或在托管 Milvus 的<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 中使用性能更高的专有索引）。</p></li>
</ul></li>
<li><p><strong>二进制、稀疏和其他专用索引</strong>：适用于特定数据类型和用例。有关详细信息，请参阅<a href="https://milvus.io/docs/index.md">此索引文档页面</a>。</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">分段大小和部署配置<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>段是 Milvus 内部数据组织的基本构件。它们作为数据块，可在部署中实现分布式搜索和负载平衡。Milvus 大小工具提供三种段大小选项（512 MB、1024 MB、2048 MB），默认为 1024 MB。</p>
<p>了解分段对于性能优化至关重要。一般来说</p>
<ul>
<li><p>512 MB 网段：最适合内存为 4-8 GB 的查询节点</p></li>
<li><p>1 GB 内存段：最适合 8-16 GB 内存的查询节点</p></li>
<li><p>2 GB 段：建议使用 &gt;16 GB 内存的查询节点</p></li>
</ul>
<p>开发人员的见解：更少、更大的分段通常可提供更快的搜索性能。对于大规模部署，2 GB 网段通常能在内存效率和查询速度之间实现最佳平衡。</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">消息队列系统选择<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Pulsar 和 Kafka 之间选择消息系统：</p>
<ul>
<li><p><strong>Pulsar</strong>：推荐用于新项目，因为每个主题的开销更低，可扩展性更好</p></li>
<li><p><strong>卡夫卡</strong>：如果您的组织中已经有 Kafka 专业知识或基础设施，则可能更可取</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Zilliz Cloud 中的企业优化<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>对于性能要求严格的生产部署，Zilliz Cloud（Milvus 在云上的全面管理和企业版本）在索引和量化方面提供了额外的优化：</p>
<ul>
<li><p><strong>防止内存不足（OOM）：</strong>先进的内存管理，防止内存不足崩溃</p></li>
<li><p><strong>压缩优化</strong>：提高搜索性能和资源利用率</p></li>
<li><p><strong>分层存储</strong>：利用适当的计算单元有效管理冷热数据</p>
<ul>
<li><p>用于频繁访问数据的标准计算单元 (CU)</p></li>
<li><p>分层存储单元（CU），用于经济高效地存储很少访问的数据</p></li>
</ul></li>
</ul>
<p>有关详细的企业规模选项，请访问<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> Zilliz Cloud 服务计划文档</a>。</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">面向开发人员的高级配置提示<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>多种索引类型</strong>：大小调整工具侧重于单一索引。对于需要对各种 Collections 采用不同索引算法的复杂应用，请使用自定义配置创建单独的 Collections。</p></li>
<li><p><strong>内存分配</strong>：在规划部署时，请考虑向量数据和索引的内存需求。HNSW 通常需要原始向量数据 2-3 倍的内存。</p></li>
<li><p><strong>性能测试</strong>：在最终确定配置之前，请在具有代表性的数据集上对特定查询模式进行基准测试。</p></li>
<li><p><strong>规模考虑因素</strong>：考虑到未来的增长。开始时使用稍多的资源比以后重新配置要容易得多。</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Milvus 规模工具</a>为资源规划提供了一个很好的起点，但请记住，每个应用程序都有独特的要求。为了获得最佳性能，您需要根据具体的工作负载特征、查询模式和扩展需求对配置进行微调。</p>
<p>我们将根据用户反馈不断改进我们的工具和文档。如果您在确定 Milvus 部署规模方面有任何疑问或需要进一步帮助，请联系我们在<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a>或<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a> 上的社区。</p>
<h2 id="References" class="common-anchor-header">参考资料<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">为您的项目选择合适的向量索引</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">内存索引 | Milvus 文档</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">揭开 Milvus CAGRA 的神秘面纱：利用 GPU 索引提升向量搜索能力</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Zilliz Cloud 定价计算器</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">如何开始使用 Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud 资源规划 | 云 | Zilliz Cloud 开发人员中心</a></p></li>
</ul>
