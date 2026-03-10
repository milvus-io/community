---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Manage Your Milvus Vector Database with One-click Simplicity
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - a GUI tool for Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
    <span>Binlog Cover Image</span>
  </span>
</p>
<p>Draft by <a href="https://github.com/czhen-zilliz">Zhen Chen</a> and transcreation by <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Click <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">here</a> to check the original post.</p> 
<p>In the face of rapidly growing demand for unstructured data processing, Milvus 2.0 stands out. It is an AI-oriented vector database system designed for massive production scenarios. Apart from all these Milvus SDKs and Milvus CLI, a command-line interface for Milvus, is there a tool that allows users to operate Milvus more intuitively? The anwer is YES. Zilliz has announced a graphical user interface - Attu - specifically for Milvus. In this article, we would like to show you step by step how to perform a vector similarity search with Attu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
    <span>Attu island</span>
  </span>
</p>
<p>In comparison with Milvus CLI which brings the uttermost simplicity of usage, Attu features more:</p>
<ul>
<li>Installers for Windows OS, macOS, and Linux OS;</li>
<li>Intuitive GUI for easier usage of Milvus;</li>
<li>Coverage of major functionalities of Milvus;</li>
<li>Plugins for expansion of customized functionalities;</li>
<li>Complete system topology information for easier understanding and administration of Milvus instance.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>You can find the newest release of Attu at <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu offers executable installers for different operating systems. It is an open-source project and welcomes contribution from everyone.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
    <span>Installation</span>
  </span>
</p>
<p>You can also install Attu via Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> is the IP address of the environment where Attu runs, and <code translate="no">milvus server IP</code> is IP address of the environment where Milvus runs.</p>
<p>Having installed Attu successfully, you can input the Milvus IP and Port in the interface to start Attu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
    <span>Connect Milvus with Attu</span>
  </span>
</p>
<h2 id="Feature-overview" class="common-anchor-header">Feature overview<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
    <span>Overview page</span>
  </span>
</p>
<p>Attu interface consists of <strong>Overview</strong> page, <strong>Collection</strong> page, <strong>Vector Search</strong> page, and <strong>System View</strong> page, corresponding to the four icons on the left-side navigation pane respectively.</p>
<p>The <strong>Overview</strong> page shows the loaded collections. While the <strong>Collection</strong> page lists all the collections and indicates if they are loaded or released.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
    <span>Collection page</span>
  </span>
</p>
<p>The <strong>Vector Search</strong> and <strong>System View</strong> pages are plugins of Attu. The concepts and usage of the plugins will be introduced in the final part of the blog.</p>
<p>You can perform vector similarity search in <strong>Vector Search</strong> page.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
    <span>Vector Search page</span>
  </span>
</p>
<p>In <strong>System View</strong> page, you can check the topological structure of Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
    <span>System View page</span>
  </span>
</p>
<p>You can also check the detailed information of each node by clicking the node.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
    <span>Node view</span>
  </span>
</p>
<h2 id="Demonstration" class="common-anchor-header">Demonstration<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s explore Attu with a test dataset.</p>
<p>Check our <a href="https://github.com/zilliztech/attu/tree/main/examples">GitHub repo</a> for the dataset used in the following test.</p>
<p>First, create a collection named test with the following four fields:</p>
<ul>
<li>Field Name: id, primary key field</li>
<li>Field Name: vector, vector field, float vector, Dimension: 128</li>
<li>Field Name: brand, scalar field, Int64</li>
<li>Field Name: color, scalar field, Int64</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
    <span>Create a collection</span>
  </span>
</p>
<p>Load the collection for search after it was successfully created.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
    <span>Load the collection</span>
  </span>
</p>
<p>You can now check the newly created collection in the <strong>Overview</strong> page.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
    <span>Check the collection</span>
  </span>
</p>
<p>Import the test dataset into Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
    <span>Import data</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
    <span>Import data</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
    <span>Import data</span>
  </span>
</p>
<p>Click the collection name in Overview or Collection page to enter query interface to check the imported data.</p>
<p>Add filter, specify the expression <code translate="no">id != 0</code>, click <strong>Apply Filter</strong>, and click <strong>Query</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
    <span>Query data</span>
  </span>
</p>
<p>You will find all fifty entries of entities are imported successfully.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
    <span>Query result</span>
  </span>
</p>
<p>Let’s try vector similarity search.</p>
<p>Copy one vector from the <code translate="no">search_vectors.csv</code> and paste it in <strong>Vector Value</strong> field. Choose the collection and field. Click <strong>Search</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
    <span>Search data</span>
  </span>
</p>
<p>You can then check the search result. Without compiling any scripts, you can search with Milvus easily.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
    <span>Search result</span>
  </span>
</p>
<p>Finally, let’s check the <strong>System View</strong> page.</p>
<p>With Metrics API encapsulated in Milvus Node.js SDK, you can check the system status, node relations, and node status.</p>
<p>As an exclusive feature of Attu, System Overview page includes a complete system topological graph. By clicking on each node, you can check its status (refresh every 10 seconds).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
    <span>Milvus node topological graph</span>
  </span>
</p>
<p>Click on each node to enter the <strong>Node List View</strong>. You can check all child nodes of a coord node. By sorting, you can identify the nodes with high CPU or memory usage quickly, and locate the problem with the system.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
    <span>Milvus node list</span>
  </span>
</p>
<h2 id="Whats-more" class="common-anchor-header">What’s more<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>As mentioned earlier, the <strong>Vector Search</strong> and <strong>System View</strong> pages are plugins of Attu. We encourage users to develop their own plugins in Attu to suit their application scenarios. In the source code, there is folder built specifically for plugin codes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
    <span>Plugins</span>
  </span>
</p>
<p>You can refer to any of the plugin to learn how to build a plugin. By setting the following config file, you can add the plugin to Attu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
    <span>Add plugins to Attu</span>
  </span>
</p>
<p>You can see <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> and <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus Technical Document</a> for detailed instruction.</p>
<p>Attu is an open-source project. All contributions are welcome. You can also <a href="https://github.com/zilliztech/attu/issues">file an issue</a> if you had any problem with Attu.</p>
<p>We sincerely hope that Attu can bring you a better user experience with Milvus. And if you like Attu, or have some feedbacks about the usage, you can complete this <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Attu User Survey</a> to help us optimize Attu for a better user experience.</p>
