---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: 使用 LangSmith Agent Builder + Milvus 在 10 分鐘內使用自然語言建立 AI 代理程式
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  了解如何使用 LangSmith Agent Builder 和 Milvus 在幾分鐘內建立支援記憶體的 AI
  代理--無需代碼、自然語言、可直接投入生產。
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>隨著 AI 開發的加速，越來越多的團隊發現建立 AI 助理不一定需要軟體工程背景。最需要助理的人 - 產品團隊、營運、支援、研究人員 - 往往清楚知道代理應該做什麼，卻不知道如何用程式碼實作。傳統的「無代碼」工具嘗試以拖放畫布來彌補這個缺口，然而當您需要真正的代理行為時，這些工具就會崩潰：多步推理、工具使用或持續記憶。</p>
<p>新發佈的<a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a>採用了不同的方法。您不需要設計工作流程，而是以簡單的語言描述代理程式的目標和可用工具，然後運行時會處理決策。沒有流程圖、沒有腳本，只有清楚的意圖。</p>
<p>但僅有意向並不能產生智慧型助理。<strong>記憶體</strong>才是關鍵。這就是被廣泛採用的開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus 所</strong></a>提供的基礎。Milvus 可以將文件和對話記錄儲存為嵌入式資料，讓您的座席能夠回想上下文、擷取相關資訊，並作出準確的大規模回應。</p>
<p>本指南將介紹如何使用<strong>LangSmith Agent Builder + Milvus</strong> 來建立一個生產就緒、具備記憶功能的 AI 助理，而且完全不需要寫任何程式碼。</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">LangSmith Agent Builder 是什麼？<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>正如其名所示，<a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a>是 LangChain 推出的免程式碼工具，可讓您使用純語言建立、部署和管理 AI 代理。您不需要撰寫邏輯或設計可視化流程，只需要說明代理程式應該做什麼、可以使用什麼工具，以及應該如何運作。系統會處理困難的部分 - 產生提示、選擇工具、將元件連接在一起，以及啟用記憶體。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>與傳統的無程式碼或工作流程工具不同，Agent Builder 沒有拖放畫布，也沒有節點庫。您與它互動的方式與 ChatGPT 相同。描述您想要建立的東西，回答幾個說明問題，Agent Builder 就會根據您的意向產生一個功能完整的代理程式。</p>
<p>在幕後，這個代理程式是由四個核心建構區塊所構成。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>提示：</strong>提示是代理程式的大腦，定義它的目標、限制和決策邏輯。LangSmith Agent Builder 使用元提示來自動建構：您描述您想要的東西，它會問清楚問題，然後您的答案會被合成為一個詳細的、可生產的系統提示。您只需表達意圖，而無需手寫邏輯。</li>
<li><strong>工具：</strong>工具可讓代理採取行動 - 發送電子郵件、張貼至 Slack、建立行事曆事件、搜尋資料或呼叫 API。Agent Builder 透過模型上下文通訊協定 (Model Context Protocol, MCP) 整合這些工具，提供安全、可擴充的方式來揭露功能。使用者可以依賴內建的整合，或新增自訂的 MCP 伺服器，包括用於向量搜尋和長期記憶的 Milvus<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP 伺服器</a>。</li>
<li><strong>觸發器：</strong>觸發器定義代理程式何時執行。除了手動執行之外，您還可以將代理附加到排程或外部事件，讓它們自動回應訊息、電子郵件或 webhook 活動。觸發器啟動時，Agent Builder 會啟動一個新的執行線程並執行代理的邏輯，從而實現連續的、事件驅動的行為。</li>
<li><strong>子代理：</strong>子代理將複雜的任務分解成更小、更專業的單元。主代理可以將工作委派給子代理 - 每個子代理都有自己的提示和工具集 - 因此資料擷取、總結或格式化等任務都是由專門的助手來處理。這可避免單一提示過載，並創造更模組化、可擴充的代理體架構。</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">代理如何記住您的偏好？<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Agent Builder 的獨特之處在於它如何處理<em>記憶體</em>。代理程式不會將偏好設定塞入聊天記錄，而是可以在執行時更新自己的行為規則。如果您說：「從現在開始，以一首詩結束每一則 Slack 訊息」，代理程式不會將其視為一次性的要求，而是將其儲存為適用於未來執行的持久性偏好設定。</p>
<p>在引擎蓋下，代理程式會保留一個內部記憶體檔案，基本上就是它不斷演進的系統提示。每次啟動時，它都會讀取這個檔案，以決定如何執行。當您提出修正或限制時，代理程式會加入結構化規則來編輯檔案，例如「總是以一首振奮人心的短詩結束簡報」。這種方法遠比依賴對話記錄來得穩定，因為代理程式會主動重寫操作指令，而不是將您的喜好埋藏在記錄檔中。</p>
<p>這個設計來自 DeepAgents 的 FilesystemMiddleware，但在 Agent Builder 中被完全抽象化。您從來不會直接接觸檔案：您只需以自然語言表達更新，系統就會在幕後處理編輯。如果您需要更多的控制，您可以插入自訂的 MCP 伺服器，或下放到 DeepAgents 層以進行進階的記憶體自訂。</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">實作示範：使用 Agent Builder 在 10 分鐘內建立 Milvus Assistant<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經介紹了 Agent Builder 背後的設計理念，現在讓我們以實作範例來瞭解完整的建置流程。我們的目標是建立一個智慧型的助理，可以回答 Milvus 相關的技術問題、搜尋官方文件，並隨著時間的推移記住使用者的喜好。</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">步驟 1.登入 LangChain 網站</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">步驟 2.設定您的 Anthropic API 金鑰</h3><p><strong>注意：</strong>預設支援 Anthropic。您也可以使用自訂模型，只要其類型包含在 LangChain 正式支援的清單中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.新增 API 金鑰</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2.輸入並儲存 API 金鑰</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">步驟 3.建立新代理</h3><p><strong>注意：</strong>按一下<strong>Learn More</strong>檢視使用說明文件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>設定自訂模型 (選用)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) 輸入參數並儲存</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">步驟 4.描述您的需求以建立代理程式</h3><p><strong>注意：</strong>使用自然語言描述來建立代理。</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>系统会询问后续问题以完善需求</strong></li>
</ol>
<p>問題 1: 選擇您希望代理記住的 Milvus 索引類型</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>問題 2：選擇代理應如何處理技術問題  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>問題 3：指定代理是否應專注於特定 Milvus 版本的指導  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">步驟 5.檢查並確認生成的代理</h3><p><strong>注意：</strong>系統自動生成代理配置。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在創建代理之前，您可以查看其元資料、工具和提示。一旦一切正常，請按一下「<strong>建立」繼</strong>續。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">步驟 6.探索介面和功能區域</h3><p>代理程式建立後，您會在介面左下角看到三個功能區域：</p>
<p><strong>(1) 觸發器</strong></p>
<p>觸發器定義代理程式應在何時執行，可回應外部事件或依據排程執行：</p>
<ul>
<li><strong>Slack：</strong>當訊息傳送到特定頻道時啟動代理程式</li>
<li><strong>Gmail：</strong>收到新電子郵件時觸發代理程式</li>
<li><strong>Cron：</strong>在排定的時間間隔執行代理程式</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 工具箱</strong></p>
<p>這是代理程式可以呼叫的工具集。在顯示的範例中，三個工具是在建立時自動產生的，您可以按一下<strong>新增工具</strong>來增加更多工具。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>如果您的代理需要向量搜尋功能，例如跨大量技術文件的語意搜尋，您可以部署 Milvus 的 MCP 伺服器</strong>，並使用<strong>MCP</strong>按鈕在此新增。請確定 MCP 伺服器是<strong>在可接達的網路端點</strong>執行；否則，Agent Builder 將無法呼叫它。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 子代理</strong></p>
<p>建立獨立的代理模組，專門處理特定的子任務，實現模組化系統設計。</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">步驟 7.測試代理</h3><p>按一下右上角的<strong>Test</strong>，進入測試模式。以下是測試結果的範例。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents：您應該選擇哪一個？<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain 提供多種代理框架，正確的選擇取決於您需要多少控制權。<a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a>是代理建置工具。它用於建立自主、長時間運行的 AI 代理，以處理複雜、多步驟的任務。它以 LangGraph 為基礎，支援進階規劃、檔案式上下文管理和子代理協調，非常適合長期或生產級專案。</p>
<p>那麼，<strong>Agent Builder</strong> 與<strong>Agent Builder</strong> 相比有何優勢？</p>
<p><strong>Agent Builder</strong>著重於簡單和速度。它抽象化了大部分實作細節，讓您可以用自然語言描述您的代理程式、配置工具，並立即執行。記憶體、工具使用和人為迴圈工作流程都會為您處理。這使得 Agent Builder 成為快速原型、內部工具和早期驗證的完美選擇，在這些應用程式中，易用性比細節控制更重要。</p>
<p>相比之下，<strong>DeepAgents 專為</strong>需要完全控制記憶體、執行和基礎架構的場景而設計。您可以自訂中間件、整合任何 Python 工具、修改儲存後端 (包括在<a href="https://milvus.io/blog">Milvus</a> 中持久化記憶體)，並明確管理代理的狀態圖。這樣做的代價是工程上的努力--您要自己寫程式碼、管理依賴關係、處理故障模式，但您會得到一個完全可客製化的代理堆疊。</p>
<p>重要的是，<strong>Agent Builder 和 DeepAgents 並非獨立的生態系統，它們形成了一個單一的連續體</strong>。Agent Builder 建立在 DeepAgents 之上。這表示您可以先在 Agent Builder 中建立快速原型，然後在需要更多的彈性時，再進入 DeepAgents，而無需從頭重寫一切。反之亦然：在 DeepAgents 中建立的模式可以打包為 Agent Builder 模板，以便非技術使用者可以重複使用。</p>
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
    </button></h2><p>由於人工智能的發展，建立人工智能代理不再需要複雜的工作流程或繁重的工程。使用 LangSmith Agent Builder，您可以僅使用自然語言建立有狀態、長時間運行的助理。您只需專注於描述代理程式應該做什麼，系統則會處理規劃、工具執行以及持續的記憶體更新。</p>
<p>搭配<a href="https://milvus.io/blog">Milvus</a>，這些代理程式就能獲得可靠、持續的記憶，以進行語意搜尋、偏好追蹤和跨會話的長期情境。無論您是在驗證一個想法或是部署一個可擴充的系統，LangSmith Agent Builder 與 Milvus 都提供了一個簡單、靈活的基礎，讓您的座席不僅能回應，還能隨時間記憶與改進。</p>
<p>有問題或想要深入了解？加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>，獲得個人化的指導。</p>
