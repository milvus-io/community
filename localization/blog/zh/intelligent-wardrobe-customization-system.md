---
id: intelligent-wardrobe-customization-system.md
title: 建立由 Milvus 向量数据库支持的智能衣柜定制系统
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: 利用相似性搜索技术挖掘非结构化数据的潜力，甚至包括衣柜及其组件！
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<p>如果您正在寻找一款能完美装入卧室或试衣间的衣柜，我敢打赌，大多数人都会想到量身定制的衣柜。然而，并不是每个人的预算都能达到那么多。那么，现成的衣柜又如何呢？这类衣柜的问题在于，它们很可能达不到你的期望，因为它们不够灵活，无法满足你独特的存储需求。此外，在网上搜索时，用关键字来概括您要寻找的特定类型的衣柜相当困难。很有可能，你在搜索框中输入的关键字（例如：带珠宝托盘的衣柜）与搜索引擎中的定义（例如：带<a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">嵌入式抽拉托盘</a>的衣柜）大相径庭。</p>
<p>不过，有了新兴技术，问题就迎刃而解了！家具零售集团宜家（IKEA）提供了一种流行的设计工具<a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX 衣柜</a>，用户可以从许多现成的衣柜中进行选择，并定制衣柜的颜色、尺寸和内部设计。无论您需要的是悬挂空间、多个搁板还是内部抽屉，这个智能衣柜定制系统总能满足您的需求。</p>
<p>要使用这款智能衣柜设计系统找到或打造理想的衣柜，您需要</p>
<ol>
<li>指定基本要求--衣柜的形状（普通型、L 型或 U 型）、长度和深度。</li>
<li>指定您的存储需求和衣柜内部结构（例如，需要悬挂空间、拉出式裤架等）。</li>
<li>添加或删除衣柜的抽屉或搁板等部件。</li>
</ol>
<p>然后，您的设计就完成了。简单方便！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>大同系统</span> </span></p>
<p>使这样的衣柜设计系统成为可能的一个非常关键的组件是<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>。因此，本文旨在介绍用于构建由向量相似性搜索驱动的智能衣柜定制系统的工作流程和相似性搜索解决方案。</p>
<p>跳转到</p>
<ul>
<li><a href="#System-overview">系统概述</a></li>
<li><a href="#Data-flow">数据流</a></li>
<li><a href="#System-demo">系统演示</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">系统概述<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>为了提供这样一个智能衣柜定制工具，我们首先需要定义业务逻辑，了解物品属性和用户旅程。衣柜及其组件（如抽屉、托盘、衣架）都是非结构化数据。因此，第二步就是利用人工智能算法和规则、先验知识、物品描述等，将这些非结构化数据转换成计算机可以理解的数据类型--向量！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>定制工具概述</span> </span></p>
<p>有了生成的向量，我们需要强大的向量数据库和搜索引擎来处理它们。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>工具架构</span> </span></p>
<p>定制工具利用了一些最流行的搜索引擎和数据库：Elasticsearch、<a href="https://milvus.io/">Milvus</a> 和 PostgreSQL。</p>
<h3 id="Why-Milvus" class="common-anchor-header">为什么选择 Milvus？</h3><p>衣柜组件包含非常复杂的信息，如颜色、形状和内部结构等。然而，将衣柜数据保存在关系数据库中的传统方法远远不够。一种流行的方式是使用 Embeddings 技术将衣柜转换成向量。因此，我们需要寻找一种专门用于向量存储和相似性搜索的新型数据库。在探究了几种流行的解决方案后，<a href="https://github.com/milvus-io/milvus">Milvus</a>向量数据库以其卓越的性能、稳定性、兼容性和易用性被选中。下图是几种流行的向量搜索解决方案的比较。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>解决方案比较</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">系统工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>系统工作流程</span> </span></p>
<p>使用 Elasticsearch 按衣柜尺寸、颜色等进行粗略过滤。然后，过滤后的结果通过 Milvus 向量数据库进行相似性搜索，并根据结果与查询向量的距离/相似性进行排序。最后，根据业务洞察力对结果进行合并和进一步完善。</p>
<h2 id="Data-flow" class="common-anchor-header">数据流<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>衣柜定制系统与传统的搜索引擎和推荐系统非常相似。它包括三个部分</p>
<ul>
<li>离线数据准备，包括数据定义和生成。</li>
<li>在线服务，包括召回和排序。</li>
<li>基于业务逻辑的数据后处理。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>数据流</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">离线数据流</h3><ol>
<li>利用业务洞察力定义数据。</li>
<li>利用先验知识定义如何将不同组件组合成衣柜。</li>
<li>识别衣柜的特征标签，并将特征编码为<code translate="no">.json</code> 文件中的 Elasticsearch 数据。</li>
<li>通过将非结构化数据编码成向量来准备召回数据。</li>
<li>使用向量数据库 Milvus 对上一步获得的召回结果进行排序。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>离线数据流</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">在线数据流</h3><ol>
<li>接收用户的查询请求并收集用户资料。</li>
<li>通过确定用户对衣柜的要求来理解用户的查询。</li>
<li>使用 Elasticsearch 进行粗搜索。</li>
<li>根据 Milvus 中向量相似度的计算方法，对粗搜索得到的结果进行评分和排序。</li>
<li>在后端平台上对结果进行后处理和整理，生成最终结果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>在线数据流</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">数据后处理</h3><p>每个公司的业务逻辑各不相同。您可以应用贵公司的业务逻辑对结果进行最后润色。</p>
<h2 id="System-demo" class="common-anchor-header">系统演示<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>现在让我们来看看我们建立的系统是如何实际运行的。</p>
<p>用户界面（UI）显示衣柜组件不同组合的可能性。</p>
<p>每个组件都按其特征（尺寸、颜色等）贴上标签，并存储在 Elasticsearch（ES）中。在 ES 中存储标签时，需要填写四个主要数据字段：ID、标签、存储路径和其他支持字段。ES 和标签数据用于细粒度召回和属性过滤。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>ES</span> </span></p>
<p>然后使用不同的人工智能算法将衣柜编码成向量集。向量集存储在 Milvus 中，用于相似性搜索和排序。这一步骤可返回更精细、更准确的结果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch、Milvus 和其他系统组件共同构成了定制设计平台的整体。在回忆过程中，Elasticsearch 和 Milvus 中的特定领域语言（DSL）如下。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>DSL</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">寻找更多资源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>了解 Milvus 向量数据库如何为更多人工智能应用提供动力：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">短视频平台 Likee 如何利用 Milvus 删除重复视频</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - 基于 Milvus 的照片欺诈检测器</a></li>
</ul>
