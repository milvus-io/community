---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: 一键式轻松管理 Milvus 向量数据库
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - Milvus 2.0 的图形用户界面工具。
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog 封面图片</span> </span></p>
<p><a href="https://github.com/czhen-zilliz">陈震</a>撰稿，<a href="https://github.com/LocoRichard">王立晨</a>誊写。</p>
<p style="font-size: 12px;color: #4c5a67">点击<a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">此处</a>查看原文。</p> 
<p>面对快速增长的非结构化数据处理需求，Milvus 2.0脱颖而出。它是一款面向人工智能的向量数据库系统，专为海量生产场景而设计。除了这些 Milvus SDK 和 Milvus CLI（Milvus 的命令行界面）之外，有没有一种工具能让用户更直观地操作 Milvus 呢？答案是肯定的。Zilliz 发布了一款专门针对 Milvus 的图形用户界面--Attu。在本文中，我们将逐步向您展示如何使用 Attu 进行向量相似性搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Attu 岛</span> </span></p>
<p>与 Milvus CLI 的简单易用相比，Attu 的功能更多：</p>
<ul>
<li>适用于 Windows 操作系统、macOS 和 Linux 操作系统的安装程序；</li>
<li>直观的图形用户界面，更易于使用 Milvus；</li>
<li>涵盖 Milvus 的主要功能；</li>
<li>可扩展自定义功能的插件；</li>
<li>完整的系统拓扑信息，便于理解和管理 Milvus 实例。</li>
</ul>
<h2 id="Installation" class="common-anchor-header">安装<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>你可以在<a href="https://github.com/zilliztech/attu/releases">GitHub</a> 上找到 Attu 的最新版本。Attu 提供适用于不同操作系统的可执行安装程序。它是一个开源项目，欢迎大家为其贡献力量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>安装</span> </span></p>
<p>您也可以通过 Docker 安装 Attu。</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> 是 Attu 运行环境的 IP 地址， 是 Milvus 运行环境的 IP 地址。<code translate="no">milvus server IP</code> </p>
<p>成功安装 Attu 后，在界面中输入 Milvus IP 和端口，即可启动 Attu。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>用 Attu 连接 Milvus</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">功能概览<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>概述页面</span> </span></p>
<p>Attu 界面由<strong>概述</strong>页、<strong>Collection</strong>页、<strong>向量搜索</strong>页和<strong>系统视图</strong>页组成，分别对应左侧导航面板上的四个图标。</p>
<p><strong>概览</strong>页面显示已加载的 Collections。而<strong>Collection</strong>页面则列出所有 Collection，并显示它们是否已加载或释放。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Collections 页面</span> </span></p>
<p><strong>向量搜索</strong>和<strong>系统视图</strong>页面是 Attu 的插件。本博客的最后一部分将介绍插件的概念和用法。</p>
<p>你可以在向量<strong>搜索</strong>页面进行向量相似性搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>向量搜索页面</span> </span></p>
<p>在<strong>系统视图</strong>页面，你可以查看 Milvus 的拓扑结构。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>系统视图页面</span> </span></p>
<p>你还可以通过点击节点来查看每个节点的详细信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>节点视图</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">演示<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们用一个测试数据集来探索 Attu。</p>
<p>请查看我们的<a href="https://github.com/zilliztech/attu/tree/main/examples">GitHub 仓库</a>，获取以下测试中使用的数据集。</p>
<p>首先，创建一个名为 test 的 Collection，其中包含以下四个字段：</p>
<ul>
<li>字段名称：id，主键字段</li>
<li>字段名称：向量，向量字段，浮点型向量，维度：128</li>
<li>字段名称：品牌，标量字段，Int64</li>
<li>字段名称：颜色，标量字段，Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>创建 Collections</span> </span></p>
<p>创建成功后加载 Collections 以进行搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>加载 Collections</span> </span></p>
<p>现在您可以在 "<strong>概览</strong>"页面检查新创建的 Collections。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>检查 Collections</span> </span></p>
<p>将测试数据集导入 Milvus。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>导入数据</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>导入数据</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>导入数据</span> </span></p>
<p>在 "概览 "或 "集合 "页面点击集合名称，进入查询界面，检查导入的数据。</p>
<p>添加过滤器，指定表达式<code translate="no">id != 0</code> ，单击<strong>应用过滤器</strong>，然后单击<strong>查询</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>查询数据</span> </span></p>
<p>您会发现所有 50 个实体条目都已成功导入。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>查询结果</span> </span></p>
<p>让我们试试向量相似性搜索。</p>
<p>从<code translate="no">search_vectors.csv</code> 中复制一个向量并将其粘贴到<strong>向量值字</strong>段中。选择 Collections 和字段。点击<strong>搜索</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>搜索数据</span> </span></p>
<p>然后可以查看搜索结果。无需编译任何脚本，就能轻松使用 Milvus 进行搜索。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>搜索结果</span> </span></p>
<p>最后，让我们查看<strong>系统视图</strong>页面。</p>
<p>通过封装在 Milvus Node.js SDK 中的 Metrics API，您可以查看系统状态、节点关系和节点状态。</p>
<p>作为 Attu 的独家功能，系统概览页面包含完整的系统拓扑图。点击每个节点，即可查看其状态（每 10 秒刷新一次）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Milvus 节点拓扑图</span> </span></p>
<p>点击每个节点可进入<strong>节点列表视图</strong>。您可以查看协调节点的所有子节点。通过排序，您可以快速识别 CPU 或内存使用率高的节点，并找到系统问题所在。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Milvus 节点列表</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">更多信息<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<strong>向量搜索</strong>和<strong>系统视图</strong>页面是 Attu 的插件。我们鼓励用户根据自己的应用场景在 Attu 中开发自己的插件。在源代码中，有一个专门为插件代码而建的文件夹。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>插件</span> </span></p>
<p>您可以参考任何一个插件，了解如何构建插件。通过设置以下配置文件，即可将插件添加到 Attu。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>向 Attu 添加插件</span> </span></p>
<p>详细说明可参阅<a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a>和<a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus 技术文档</a>。</p>
<p>Attu 是一个开源项目。欢迎所有贡献。如果您在使用 Attu 时遇到任何问题，也可以<a href="https://github.com/zilliztech/attu/issues">提交问题</a>。</p>
<p>我们衷心希望 Attu 能为您带来更好的 Milvus 用户体验。如果您喜欢 Attu，或对使用有任何反馈意见，请填写 Attu<a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">用户调查表</a>，帮助我们优化 Attu，以获得更好的用户体验。</p>
