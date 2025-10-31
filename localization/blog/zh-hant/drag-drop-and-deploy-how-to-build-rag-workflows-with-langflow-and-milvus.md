---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: 拖、放、部署：如何使用 Langflow 和 Milvus 建立 RAG 工作流程
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: 學習如何使用 Langflow 和 Milvus 建立可視化的 RAG 工作流程。在幾分鐘內拖放並部署上下文感知的 AI 應用程式 - 無需編碼。
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>建立一個 AI 工作流程通常會覺得比想像中困難。在撰寫膠水程式碼、調試 API 呼叫和管理資料管道之間，這個過程可能要花上好幾個小時才能看到結果。<a href="https://www.langflow.org/"><strong>Langflow</strong></a>和<a href="https://milvus.io/"><strong>Milvus</strong></a>大幅簡化了這一過程 - 讓您可以輕鬆編碼，在幾分鐘而非幾天內設計、測試和部署檢索增量生成 (RAG) 工作流程。</p>
<p><strong>Langflow</strong>提供簡潔的拖放式介面，感覺更像是在白板上勾勒想法，而不是編寫程式。您可以直觀地將語言模型、資料來源和外部工具連接起來，以定義您的工作流程邏輯 - 所有這一切都不需要碰觸任何一行模板程式碼。</p>
<p><strong>Milvus</strong> 是開放原始碼的向量資料庫，可讓 LLM 具備長期記憶與上下文理解能力。Milvus 可以有效地儲存和擷取企業或特定領域資料中的嵌入，讓 LLMs 可以產生有根據、準確且能感知上下文的答案。</p>
<p>在本指南中，我們將介紹如何結合 Langflow 與 Milvus 來建立進階的 RAG 工作流程 - 所有這一切只需要幾個拖曳、下拉與點選動作。</p>
<h2 id="What-is-Langflow" class="common-anchor-header">什麼是 Langflow？<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>在進行 RAG 示範之前，讓我們先瞭解 Langflow 是什麼，以及它能做什麼。</p>
<p>Langflow 是一個開放原始碼、以 Python 為基礎的框架，可讓您更輕鬆地建立和實驗 AI 應用程式。它支援代理和模型上下文協定 (MCP) 等關鍵 AI 功能，為開發人員和非開發人員創造智慧系統提供了靈活的基礎。</p>
<p>Langflow 的核心是提供可視化編輯器。您可以拖放和連接不同的資源，以設計結合模型、工具和資料來源的完整應用程式。當您匯出工作流程時，Langflow 會自動在您的本機產生一個名為<code translate="no">FLOW_NAME.json</code> 的檔案。這個檔案記錄了所有的節點、邊緣和描述流程的元資料，讓您可以輕鬆地在不同的團隊之間進行版本控制、分享和複製專案。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在幕後，基於 Python 的執行引擎會執行流程。它會協調 LLM、工具、檢索模組和路由邏輯 - 管理資料流、狀態和錯誤處理，以確保從開始到結束的順暢執行。</p>
<p>Langflow 也包含一個豐富的元件庫，其中有適用於熱門 LLM 和向量資料庫 (包括<a href="https://milvus.io/">Milvus)</a> 的預先建立的適配器。您可以針對特殊的使用個案，建立自訂的 Python 元件，進一步擴充。對於測試和最佳化，Langflow 提供逐步執行、快速測試的 Playground，以及與 LangSmith 和 Langfuse 的整合，以監控、除錯和重播端對端的工作流程。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">實作示範：如何使用 Langflow 和 Milvus 建立 RAG 工作流程<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Langflow 架構的基礎上，Milvus 可作為向量資料庫，用來管理嵌入和擷取私有企業資料或特定領域的知識。</p>
<p>在這個示範中，我們將使用 Langflow 的向量儲存 RAG 模版來展示如何整合 Milvus 並從本機資料建立向量索引，以實現高效率的情境增強問題解答。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件： 1.Python 3.11</h3><p>1.Python 3.11 (或 Conda)</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4.OpenAI金鑰</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">步驟 1.部署 Milvus 向量資料庫</h3><p>下載部署檔案。</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>啟動 Milvus 服務。</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">步驟 2.建立 Python 虛擬環境</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">步驟 3.安裝最新套件</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">步驟 4.啟動 Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>訪問 Langflow。</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">步驟 5.設定 RAG 模板</h3><p>在 Langflow 中選擇向量儲存 RAG 模板。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>選擇 Milvus 作為預設向量資料庫。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在左側面板中搜尋「Milvus」，並將其加入您的流程。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>設定 Milvus 連線細節。暫時保留其他選項為預設值。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>將您的 OpenAI API 金鑰加入相關節點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">步驟 6.準備測試資料</h3><p>注意：使用 Milvus 2.6 的官方常見問題作為測試資料。</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">步驟 7.第一階段測試</h3><p>上傳您的資料集，並將其擷取至 Milvus。 注意：然後 Langflow 會將您的文字轉換成向量表示法。您必須上傳至少兩個資料集，否則嵌入程序會失敗。這是 Langflow 目前節點實作中的已知錯誤。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>檢查您節點的狀態。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">步驟 8.第二階段測試</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">步驟 9.執行完整的 RAG 工作流程</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>建立 AI 工作流程並不一定要很複雜。Langflow + Milvus 讓它變得快速、可視化且代碼輕鬆，這是一種簡單的方法，可在不花費大量工程精力的情況下增強 RAG。</p>
<p>Langflow 的拖放介面使其成為教學、研討會或現場示範的合適選擇，在這些場合中，您需要以清楚且互動的方式展示 AI 系統如何運作。對於尋求整合直覺式工作流程設計與企業級向量檢索的團隊而言，結合 Langflow 的簡易性與 Milvus 的高效能搜尋，可同時提供彈性與功能。</p>
<p>現在就開始使用<a href="https://milvus.io/">Milvus</a>建立更聰明的 RAG 工作流程。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得洞察力、指導和問題解答。</p>
