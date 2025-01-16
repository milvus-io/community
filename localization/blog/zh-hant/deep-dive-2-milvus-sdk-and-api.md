---
id: deep-dive-2-milvus-sdk-and-api.md
title: Milvus Python SDK 和 API 簡介
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: 了解 SDK 如何與 Milvus 互動，以及為什麼 ORM-style API 可以幫助您更好地管理 Milvus。
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<p>作者：<a href="https://github.com/XuanYang-cn">楊璇</a></p>
<h2 id="Background" class="common-anchor-header">背景說明<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>下圖描述 SDK 與 Milvus 透過 gRPC 的互動。想像 Milvus 是一個黑盒子。通訊協定緩衝區 (Protocol Buffer) 用來定義伺服器的介面，以及所攜帶資訊的結構。因此，黑盒子 Milvus 中的所有操作都是由 Protocol API 定義的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>互動</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus 通訊協定 API<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 通訊協定 API 由<code translate="no">milvus.proto</code>,<code translate="no">common.proto</code>, 和<code translate="no">schema.proto</code> 組成，這些都是以<code translate="no">.proto</code> 為後綴的通訊協定緩衝區檔案。為了確保正常運作，SDK 必須使用這些通訊協定緩衝區檔案與 Milvus 互動。</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> 是 Milvus 通訊協定 API 的重要元件，因為它定義了 ，而 進一步定義了 Milvus 的所有 RPC 介面。<code translate="no">MilvusService</code></p>
<p>以下程式碼範例顯示介面<code translate="no">CreatePartitionRequest</code> 。它有兩個主要的字串型參數<code translate="no">collection_name</code> 和<code translate="no">partition_name</code> ，您可以根據這兩個參數啟動分區建立請求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>請參閱<a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub Repository</a>中第 19 行的通訊協定範例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>範例</span> </span></p>
<p>您可以在這裡找到<code translate="no">CreatePartitionRequest</code> 的定義。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>定義</span> </span></p>
<p>歡迎希望以不同程式語言開發 Milvus 功能或 SDK 的貢獻者，透過 RPC 找到 Milvus 提供的所有介面。</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> 定義了常見的資訊類型，包括 , 和 。<code translate="no">ErrorCode</code> <code translate="no">Status</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> 定義了參數中的模式。以下代碼範例是 。<code translate="no">CollectionSchema</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>、<code translate="no">common.proto</code> 和<code translate="no">schema.proto</code> 共同構成了 Milvus 的 API，代表了所有可以透過 RPC 來呼叫的操作。</p>
<p>如果您深入研究源代碼並仔細觀察，您會發現當像<code translate="no">create_index</code> 之類的介面被呼叫時，它們實際上呼叫了多個 RPC 介面，例如<code translate="no">describe_collection</code> 和<code translate="no">describe_index</code> 。Milvus 的許多外向介面都是多個 RPC 介面的組合。</p>
<p>了解了 RPC 的行為之後，您就可以透過組合來為 Milvus 開發新的功能。我們非常歡迎您發揮您的想像力與創造力，為 Milvus 社群貢獻一份心力。</p>
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">物件關聯映射 (ORM)</h3><p>一言以蔽之，物件關聯映射 (ORM) 是指當您對本機物件進行操作時，這些操作會影響伺服器上對應的物件。PyMilvus ORM 風格的 API 有以下特點：</p>
<ol>
<li>它直接對物件進行操作。</li>
<li>它隔離了服務邏輯和資料存取的細節。</li>
<li>它隱藏了實作的複雜性，您可以在不同的 Milvus 實體上執行相同的腳本，而不需考慮它們的部署方式或實作。</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORM 風格的 API</h3><p>ORM-style API 的精髓之一在於控制 Milvus 連線。例如，您可以為多個 Milvus 伺服器指定別名，並僅使用別名來連線或斷線。您甚至可以刪除本機伺服器位址，並透過特定的連線精確地控制某些物件。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>控制連接</span> </span></p>
<p>ORM 式 API 的另一個特點是，經過抽象後，所有的操作都可以直接在物件上執行，包括集合、分區和索引。</p>
<p>您可以透過取得現有的集合物件或建立新的集合物件來抽象集合物件。您也可以使用連線別名 (connection alias) 為特定物件指定 Milvus 連線，以便在本機對這些物件進行操作。</p>
<p>要建立分區物件，您可以使用其父集合物件來建立分區物件，或是像建立集合物件一樣來建立分區物件。這些方法也可以用在索引物件上。</p>
<p>在這些分割或索引物件存在的情況下，您可以透過其父集合物件取得這些物件。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於 Deep Dive 系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我們安排了這個 Milvus Deep Dive 系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
