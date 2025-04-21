---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: 介紹 Milvus SDK v2：原生 Async 支援、統一 API 與優異效能
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: 體驗為開發人員重新設計的 Milvus SDK v2！享受統一的 API、原生的 async 支援，以及增強的向量搜尋專案效能。
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">總結<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>我們聆聽了您的意見！Milvus SDK v2 是直接根據您的回饋而建立的，完全重新構想了我們的開發人員體驗。Milvus SDK v2 擁有跨 Python、Java、Go 和 Node.js 的統一 API、您一直要求的原生 async 支援、提升效能的 Schema Cache，以及簡化的 MilvusClient 介面，讓<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋開</a>發比以往更快速、更直覺。無論您是要建立<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>應用程式、推薦系統或<a href="https://zilliz.com/learn/what-is-computer-vision">電腦視覺</a>解決方案，這個社群驅動的更新將改變您使用 Milvus 的方式。</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">我們為何要建立它？解決社群痛點<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>多年來，Milvus 已經成為數以千計 AI 應用程式的<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫</a>。然而，隨著社群的成長，我們不斷聽到 SDK v1 的幾個限制：</p>
<p><strong>「處理高併發性太複雜」。</strong>某些語言 SDK 缺乏原生的 async 支援，迫使開發人員必須仰賴線程或回呼，使得程式碼更難管理與除錯，尤其是在批次資料載入與平行查詢等情況下。</p>
<p><strong>「效能會隨著規模擴大而降低」。</strong>如果沒有 Schema Cache，v1 會在作業過程中重複驗證模式，為大量工作負載製造瓶頸。在需要大量向量處理的使用個案中，這個問題導致延遲增加，吞吐量降低。</p>
<p><strong>"語言間不一致的介面造成陡峭的學習曲線。</strong>不同語言的 SDK 以各自的方式實作介面，使跨語言開發變得複雜。</p>
<p><strong>"RESTful API 缺少基本功能。</strong>分區管理和索引建置等關鍵功能無法使用，迫使開發人員在不同的 SDK 之間切換。</p>
<p>這些不只是功能需求，而是開發工作流程中的真正障礙。SDK v2 是我們消除這些障礙的承諾，讓您專注於最重要的事：建立令人驚豔的 AI 應用程式。</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">解決方案：Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 是完全重新設計的結果，著重於開發者的經驗，並提供多種語言：</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1.原生異步支援：從複雜到並發</h3><p>舊有的並發處理方式涉及繁瑣的 Future 物件和回呼模式。SDK v2 引入了真正的 async/await 功能，尤其是在 Python 中使用<code translate="no">AsyncMilvusClient</code> (自 v2.5.3 起)。使用與同步 MilvusClient 相同的參數，您可以輕鬆地並行執行插入、查詢和搜尋等作業。</p>
<p>這種簡化的方式取代了舊有累贅的 Future 和 callback 模式，使程式碼更乾淨、更有效率。複雜的並發邏輯，例如批次向量插入或並行多重查詢，現在可以使用<code translate="no">asyncio.gather</code> 之類的工具毫不費力地實現。</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2.Schema Cache：在重要的地方提升效能</h3><p>SDK v2 引入了 Schema Cache，可在初始取回後在本機儲存資料集模式，從而消除重複的網路請求以及作業過程中的 CPU 開銷。</p>
<p>對於高頻插入和查詢情境，此更新可轉換為</p>
<ul>
<li><p>減少客戶端與伺服器之間的網路流量</p></li>
<li><p>降低作業延遲</p></li>
<li><p>降低伺服器端的 CPU 使用量</p></li>
<li><p>在高併發下有更好的擴充能力</p></li>
</ul>
<p>這對於像即時推薦系統或即時搜尋功能等毫秒都很重要的應用程式來說特別有價值。</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3.統一且精簡的 API 體驗</h3><p>Milvus SDK v2 在所有支援的程式語言中推出統一且更完整的 API 體驗。特別是 RESTful API 已大幅增強，提供與 gRPC 介面幾乎相同的功能。</p>
<p>在早期版本中，RESTful API 落後於 gRPC，限制了開發人員在不轉換介面的情況下所能做的事。現在情況不再是這樣了。現在，開發人員可以使用 RESTful API 執行幾乎所有的核心作業，例如建立集合、管理分割、建立索引和執行查詢，而無需使用 gRPC 或其他方法。</p>
<p>這種統一的方法可確保開發人員在不同環境和使用個案中擁有一致的體驗。它降低了學習曲線，簡化了整合，並改善了整體可用性。</p>
<p>注意：對大多數使用者來說，RESTful API 提供了更快更簡單的方式來開始使用 Milvus。然而，如果您的應用程式需要高效能或進階功能（例如迭代器），gRPC 用戶端仍是獲得最大彈性與控制的最佳選擇。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4.統一所有語言的 SDK 設計</h3><p>透過 Milvus SDK v2，我們已將所有支援的程式語言的 SDK 設計標準化，以提供更一致的開發者體驗。</p>
<p>無論您使用 Python、Java、Go 或 Node.js 建置，每個 SDK 現在都遵循以 MilvusClient 類別為中心的統一結構。此重新設計為我們支援的每種語言帶來一致的方法命名、參數格式和整體使用模式。(請參閱：<a href="https://github.com/milvus-io/milvus/discussions/33979">MilvusClient SDK 程式碼範例更新 - GitHub 討論 #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在，一旦您熟悉 Milvus 的一種語言，您就可以輕鬆地切換到另一種語言，而無需重新學習 SDK 如何運作。這樣的對齊不僅簡化了上線，也讓多語言開發更順暢、更直覺。</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5.更簡單、更智慧的 PyMilvus (Python SDK) 與<code translate="no">MilvusClient</code></h3><p>在之前的版本中，PyMilvus 依賴於 ORM 式的設計，引入了物件導向與程序式的混合方法。開發人員必須定義<code translate="no">FieldSchema</code> 物件，建立<code translate="no">CollectionSchema</code> ，然後實體<code translate="no">Collection</code> class - 所有這些都只是為了建立一個集合。這個過程不僅冗長，而且對新使用者來說，學習曲線也比較陡。</p>
<p>有了新的<code translate="no">MilvusClient</code> 介面，事情就簡單多了。現在您可以使用<code translate="no">create_collection()</code> 方法在單一步驟中建立一個集合。它允許您透過傳遞<code translate="no">dimension</code> 和<code translate="no">metric_type</code> 等參數快速定義模式，如果需要，您也可以使用自訂模式物件。</p>
<p>更棒的是，<code translate="no">create_collection()</code> 支援在同一呼叫中建立索引。如果提供索引參數，Milvus 會自動建立索引，並將資料載入記憶體，而不需要另外呼叫<code translate="no">create_index()</code> 或<code translate="no">load()</code> 。一個方法就能完成所有工作：<em>建立集合 → 建立索引 → 載入集合。</em></p>
<p>這種簡化的方法降低了設定的複雜性，使 Milvus 更容易上手，特別是對於想要快速、有效率地進行原型或生產的開發人員而言。</p>
<p>新的<code translate="no">MilvusClient</code> 模組在可用性、一致性和效能方面都有明顯的優勢。雖然傳統的 ORM 介面目前仍然可用，但我們計劃在未來逐步淘汰它（請<a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">參閱參考資料</a>）。我們強烈建議您升級至新的 SDK，以充分利用這些改進。</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6.更清晰、更全面的說明文件</h3><p>我們重整了產品文件，以提供更完整、更清楚的<a href="https://milvus.io/docs">API Reference</a>。我們的「使用者指南」現在包含了多國語言的範例程式碼，讓您可以快速上手，輕鬆了解 Milvus 的功能。此外，我們的文檔網站上提供的 Ask AI 助手可以介紹新功能、解釋內部機制，甚至幫助生成或修改示例代碼，讓您在閱讀文檔的過程中更加順暢和愉快。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7.Milvus MCP 伺服器：專為未來 AI 整合而設計</h3><p>建立在 Milvus SDK 之上的<a href="https://github.com/zilliztech/mcp-server-milvus">MCP Server</a> 是我們對 AI 生態系統中日益增長的需求的回應：大型語言模型<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>)、<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫</a>和外部工具或資料來源之間的無縫整合。它實現了模型上下文通訊協定 (MCP)，提供統一且智慧的介面來協調 Milvus 運作及其他。</p>
<p>隨著<a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">AI 代理的</a>能力愈來愈強，不僅能產生程式碼，還能自主管理後端服務，因此對於更智慧、API 驅動的基礎架構的需求也愈來愈高。MCP 伺服器的設計就是以這個未來為考量。它能與 Milvus 集群進行智慧型自動互動，簡化部署、維護和資料管理等工作。</p>
<p>更重要的是，它為一種全新的機器對機器協作奠定了基礎。有了 MCP Server，AI 代理可以呼叫 API 來動態建立資料集、執行查詢、建立索引等，一切都不需要人工介入。</p>
<p>簡而言之，MCP Server 不僅將 Milvus 轉型為資料庫，還將其轉型為完全可編程、AI 就緒的後端，為智慧型、自主且可擴充的應用程式鋪路。</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">開始使用 Milvus SDK v2：範例程式碼<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>以下範例展示如何使用新的 PyMilvus (Python SDK v2) 介面來建立集合並執行異步操作。相較於前一版本的 ORM 式方法，這段程式碼更乾淨、更一致，也更容易操作。</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1.建立資料集、定義模式、建立索引，以及使用<code translate="no">MilvusClient</code></h3><p>下面的 Python 程式碼片段演示了如何在一次呼叫中建立一個集合、定義其模式、建立索引和載入資料：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">create_collection</code> 方法的<code translate="no">index_params</code> 參數消除了分別呼叫<code translate="no">create_index</code> 和<code translate="no">load_collection</code>的需要 - 一切都自動發生。</p>
<p>此外，<code translate="no">MilvusClient</code> 支援快速表格建立模式。例如，只需指定所需的參數，即可在一行代碼中建立集合：</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(比較說明：在舊的 ORM 方法中，您必須先建立<code translate="no">Collection(schema)</code> ，然後分別呼叫<code translate="no">collection.create_index()</code> 和<code translate="no">collection.load()</code> ；現在，MilvusClient 簡化了整個過程)。</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2.使用 MilvusClient 執行高併發異步插入<code translate="no">AsyncMilvusClient</code></h3><p>下面的示例展示了如何使用<code translate="no">AsyncMilvusClient</code> ，使用<code translate="no">async/await</code> 执行并发插入操作：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>在此示例中，<code translate="no">AsyncMilvusClient</code> ，通过调度多个插入任务来并发插入数据，<code translate="no">asyncio.gather</code> 。這種方法充分利用了 Milvus 的後端並發處理能力。與 v1 中的同步逐行插入不同，這種原生的異步支援大幅提高了吞吐量。</p>
<p>同樣地，您也可以修改程式碼來執行並發查詢或搜尋 - 例如，以<code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code> 來取代插入呼叫。Milvus SDK v2 的異步介面可確保以非阻塞方式執行每個請求，充分利用客戶端和伺服器資源。</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">輕鬆遷移<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>我們知道您已在 SDK v1 上投入時間，因此我們在設計 SDK v2 時已將您現有的應用程式考慮在內。SDK v2 包含向後相容性，因此現有的 v1/ORM 風格介面仍可繼續使用一段時間。但我們強烈建議儘快升級到 SDK v2，因為對於 v1 的支援將隨 Milvus 3.0 的發行（2025 年底）而終止。</p>
<p>升級至 SDK v2 可開啟更一致、更現代化的開發體驗，包括簡化的語法、更好的 async 支援，以及更佳的效能。這也是所有新功能和社群支援的重點所在。現在升級可確保您已為下一步做好準備，並能使用 Milvus 所提供的最佳功能。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 相較於 v1 有了顯著的改進：效能提升、跨多種程式語言的統一一致介面，以及簡化高併發操作的原生異步支援。Milvus SDK v2 具有更清晰的說明文件和更直觀的程式碼範例，旨在簡化您的開發流程，使建立和部署 AI 應用程式更容易、更快速。</p>
<p>如需更詳細的資訊，請參閱我們最新的官方<a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API Reference 與使用者指南</a>。如果您對於新的 SDK 有任何問題或建議，歡迎在<a href="https://github.com/milvus-io/milvus/discussions">GitHub</a>和<a href="https://discord.com/invite/8uyFbECzPX">Discord</a> 上提供意見。我們期待您的意見，繼續強化 Milvus。</p>
