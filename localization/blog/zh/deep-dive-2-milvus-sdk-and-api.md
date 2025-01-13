---
id: deep-dive-2-milvus-sdk-and-api.md
title: Milvus Python SDK 和 API 简介
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: 了解 SDK 如何与 Milvus 交互，以及为什么 ORM 风格的 API 可以帮助您更好地管理 Milvus。
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<p>作者：<a href="https://github.com/XuanYang-cn">杨璇</a></p>
<h2 id="Background" class="common-anchor-header">背景介绍<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>下图描述了 SDK 与 Milvus 之间通过 gRPC 进行的交互。想象一下，Milvus 是一个黑盒子。协议缓冲区（Protocol Buffer）用于定义服务器的接口及其携带的信息结构。因此，黑盒子 Milvus 中的所有操作都是由协议 API 定义的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>交互</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus 协议应用程序接口<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 协议 API 由<code translate="no">milvus.proto</code> 、<code translate="no">common.proto</code> 和<code translate="no">schema.proto</code> 组成，它们是以<code translate="no">.proto</code> 为后缀的协议缓冲区文件。为确保正常操作，SDK 必须通过这些协议缓冲文件与 Milvus 交互。</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> 是 Milvus 协议 API 的重要组成部分，因为它定义了 ，进一步定义了 Milvus 的所有 RPC 接口。<code translate="no">MilvusService</code></p>
<p>以下代码示例显示了<code translate="no">CreatePartitionRequest</code> 接口。它有两个主要字符串类型参数<code translate="no">collection_name</code> 和<code translate="no">partition_name</code> ，根据这两个参数，您可以启动分区创建请求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>创建分区请求</span> </span></p>
<p>请查看<a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub 代码库中</a>第 19 行的协议示例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>示例</span> </span></p>
<p>您可以在此处找到<code translate="no">CreatePartitionRequest</code> 的定义。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>定义</span> </span></p>
<p>欢迎希望使用不同编程语言开发 Milvus 功能或 SDK 的贡献者通过 RPC 找到 Milvus 提供的所有接口。</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> 定义了常见的信息类型，包括 , 和 。<code translate="no">ErrorCode</code> <code translate="no">Status</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> 定义了参数中的 Schema。以下代码示例是 。<code translate="no">CollectionSchema</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>、<code translate="no">common.proto</code> 和<code translate="no">schema.proto</code> 共同构成了 Milvus 的 API，代表了所有可以通过 RPC 调用的操作符。</p>
<p>如果深入研究源代码并仔细观察，你会发现当调用<code translate="no">create_index</code> 等接口时，它们实际上调用了多个 RPC 接口，如<code translate="no">describe_collection</code> 和<code translate="no">describe_index</code> 。Milvus 的许多对外接口都是多个 RPC 接口的组合。</p>
<p>了解了 RPC 的行为之后，您就可以通过组合为 Milvus 开发新的功能。我们非常欢迎您发挥想象力和创造力，为 Milvus 社区做出贡献。</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">对象关系映射（ORM）</h3><p>简而言之，对象关系映射（ORM）是指当您操作本地对象时，这种操作将影响服务器上的相应对象。PyMilvus ORM 风格 API 具有以下特点：</p>
<ol>
<li>它直接操作对象。</li>
<li>它隔离了服务逻辑和数据访问细节。</li>
<li>它隐藏了实现的复杂性，你可以在不同的 Milvus 实例中运行相同的脚本，而无需考虑它们的部署方式或实现。</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORM 式应用程序接口</h3><p>ORM 风格 API 的精髓之一在于对 Milvus 连接的控制。例如，你可以为多个 Milvus 服务器指定别名，并仅通过别名连接或断开它们。你甚至可以删除本地服务器地址，并通过特定连接精确控制某些对象。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>控制连接</span> </span></p>
<p>ORM 风格 API 的另一个特点是，经过抽象后，所有操作都可以直接对对象执行，包括 Collection、分区和索引。</p>
<p>你可以通过获取一个现有的 Collections 对象或创建一个新的 Collections 对象来抽象一个 Collections 对象。你还可以使用连接别名为特定对象分配一个 Milvus 连接，这样就可以在本地对这些对象进行操作符。</p>
<p>要创建分区对象，可以用其父级 Collections 对象来创建，也可以像创建 Collections 对象一样来创建。这些方法也可用于索引对象。</p>
<p>在这些分区或索引对象存在的情况下，你可以通过它们的父集合对象来获取它们。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
