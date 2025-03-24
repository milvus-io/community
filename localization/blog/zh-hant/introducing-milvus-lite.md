---
id: introducing-milvus-lite.md
title: 介紹 Milvus Lite：在幾秒鐘內開始建立 GenAI 應用程式
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們很高興推出<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>，這是一個輕量級的向量資料庫，可在您的 Python 應用程式中本機執行。Milvus Lite 以廣受歡迎的開放原始碼<a href="https://milvus.io/intro">Milvus</a>向量資料庫為基礎，重複使用向量索引和查詢解析的核心元件，同時移除專為分散式系統的高擴充性所設計的元件。這樣的設計讓精簡高效的解決方案成為運算資源有限的環境的理想選擇，例如筆記型電腦、Jupyter Notebook、行動裝置或邊緣裝置。</p>
<p>Milvus Lite 可與 LangChain 和 LlamaIndex 等多種 AI 開發堆疊整合，使其能在無需伺服器設定的情況下，在 Retrieval Augmented Generation (RAG) pipelines 中作為向量儲存使用。只需執行<code translate="no">pip install pymilvus</code> (2.4.3 或以上版本)，即可將其作為 Python 函式庫納入您的 AI 應用程式。</p>
<p>Milvus Lite 共用 Milvus API，可確保您的用戶端程式碼能同時適用於小規模的本機部署，以及部署在 Docker 或 Kubernetes 上、擁有數以億計向量的 Milvus 伺服器。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">為何我們要建立 Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>許多 AI 應用程式都需要向量類似性搜尋非結構化資料，包括文字、影像、聲音和視訊，例如聊天機器人和購物助理等應用程式。向量資料庫是為了儲存和搜尋向量嵌入而設計，是人工智能開發堆疊的重要部分，尤其是對於像<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">擷取擴增生成 (Retrieval Augmented Generation, RAG)</a> 之類的生成式人工智能用例。</p>
<p>儘管市面上有許多向量搜尋解決方案，但仍缺乏一個容易上手、且適用於大規模生產部署的選項。身為 Milvus 的創造者，我們設計了 Milvus Lite 以協助 AI 開發人員更快速地建立應用程式，同時確保各種部署選項的一致體驗，包括 Milvus on Kubernetes、Docker 和管理式雲端服務。</p>
<p>Milvus Lite 是 Milvus 生態系統產品套件的重要補充。它為開發人員提供多功能工具，支援開發過程中的每個階段。從原型設計到生產環境，從邊緣運算到大規模部署，Milvus 現在是唯一能涵蓋任何規模用例和所有開發階段的向量資料庫。</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Milvus Lite 如何運作<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 支援 Milvus 中的所有基本操作，例如建立集合以及插入、搜尋和刪除向量。它即將支援混合搜尋等進階功能。Milvus Lite 可將資料載入記憶體，以進行有效率的搜尋，並將其持久化為 SQLite 檔案。</p>
<p>Milvus Lite 已包含在<a href="https://github.com/milvus-io/pymilvus">Milvus 的 Python SDK</a>中，可透過簡單的<code translate="no">pip install pymilvus</code> 部署。以下的程式碼片段示範如何使用 Milvus Lite 設定向量資料庫，方法是指定本機檔案名稱，然後創建新的集合。對於熟悉 Milvus API 的人來說，唯一的差別是<code translate="no">uri</code> 指的是本機檔案名稱，而不是網路端點，例如，Milvus 伺服器的<code translate="no">&quot;milvus_demo.db&quot;</code> 而不是<code translate="no">&quot;http://localhost:19530&quot;</code> 。其他一切都保持不變。Milvus Lite 也支援使用動態或明確定義的模式，將原始文字和其他標籤儲存為元資料，如下圖所示。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>為了擴充性，使用 Milvus Lite 開發的 AI 應用程式可以輕鬆過渡到使用部署在 Docker 或 Kubernetes 上的 Milvus，只要指定<code translate="no">uri</code> 與伺服器端點即可。</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">與 AI 開發堆疊整合<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>除了推出 Milvus Lite 讓向量搜尋更容易上手之外，Milvus 也整合了許多 AI 開發堆疊的框架和供應商，包括<a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>、<a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>、<a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>、<a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>、<a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>、<a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>、<a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>、<a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>、<a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>、<a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>、<a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>、<a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a>和<a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>。由於他們廣泛的工具和服務，這些整合簡化了具有向量搜尋功能的 AI 應用程式開發。</p>
<p>而這只是個開始，更多令人興奮的整合即將推出！敬請期待！</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">更多資源與範例<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>探索<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門文件</a>，取得使用 Milvus Lite 建立 AI 應用程式<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(</a>如檢索-增強世代<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) 和<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">圖像搜尋</a>) 的詳細指南和程式碼範例。</p>
<p>Milvus Lite 是一個開放原始碼專案，我們歡迎您的貢獻。請查看我們的<a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">貢獻指南</a>開始使用。您也可以在<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite GitHub</a>套件庫中提交問題，以報告錯誤或要求功能。</p>
