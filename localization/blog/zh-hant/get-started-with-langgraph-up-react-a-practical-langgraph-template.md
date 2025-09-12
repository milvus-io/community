---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 開始使用 langgraph-up-react：實用的 LangGraph 模板
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: 介紹 langgraph-up-react，一個可立即使用的 LangGraph + ReAct 模版，用於 ReAct 代理。
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>AI 代理正在成為應用 AI 的核心模式。越來越多的專案正在超越單一提示，並將模型連線到決策迴圈中。這是令人興奮的，但這也意味著管理狀態、協調工具、處理分支以及加入人為交接--這些都不是一眼就能看出來的。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a>是這一層的最佳選擇。它是一個 AI 框架，提供迴圈、條件、持續性、人為迴圈控制以及串流等足夠的結構，可以將構想變成真正的多重代理應用程式。然而，LangGraph 有著陡峭的學習曲線。它的文件移動很快，抽象的東西需要時間來習慣，而且從一個簡單的示範跳到一個感覺像產品的東西可能會令人沮喪。</p>
<p>最近，我開始使用<a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react - 一個</strong></a>可立即使用的 LangGraph + ReAct 模板，用於 ReAct 代理。它簡化了設定，提供合理的預設值，並讓您專注於行為而非模板。在這篇文章中，我將介紹如何使用這個範本開始使用 LangGraph。</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">瞭解 ReAct 代理<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入瞭解模板本身之前，我們應該先瞭解一下我們要建立的代理類型。目前最常見的模式之一是<strong>ReAct (Reason + Act)</strong>架構，最早是在 Google 2022 年的論文<em>「</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct：Synergizing Reasoning and Acting in Language Model</em></a><em>s</em><a href="https://arxiv.org/abs/2210.03629"><em>"中首次提出。</em></a></p>
<p>這個想法很直接：ReAct 並非將推理與行動分開處理，而是將兩者結合為一個回饋迴圈，看起來很像人類解決問題的過程。代理對問題進行<strong>推理</strong>，透過呼叫工具或 API 來<strong>採取行動</strong>，<strong>然後觀察</strong>結果，再決定下一步該怎麼做。這個簡單的循環 - 推理 → 行動 → 觀察 - 讓代理可以動態地適應，而不是遵循固定的腳本。</p>
<p>以下是各個環節的組合方式：</p>
<ul>
<li><p><strong>原因</strong>：模型將問題分解成步驟、規劃策略，甚至可以在中途糾正錯誤。</p></li>
<li><p><strong>行動</strong>：根據其推理，代理程式會呼叫工具 - 不論是搜尋引擎、計算機或您自訂的 API。</p></li>
<li><p><strong>觀察</strong>：代理程式會觀察工具的輸出、篩選結果，並將結果回饋到下一輪推理中。</p></li>
</ul>
<p>這個循環很快就成為現代 AI 代理的骨幹。您會在 ChatGPT 外掛程式、RAG 管道、智慧型助理，甚至是機器人中看到它的蹤跡。在我們的案例中，它是<code translate="no">langgraph-up-react</code> 模板的基礎。</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">瞭解 LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經瞭解了 ReAct 模式，下一個問題就是：在實際上要如何實作這樣的東西？開箱即用的語言模型大多無法很好地處理多步推理。每次呼叫都是無狀態的：模型產生一個答案，一旦完成就忘記一切。這使得我們很難將中間的結果繼承下去，或是根據先前的結果調整之後的步驟。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a>填補了這個缺口。它不再將每個提示視為一次性的，而是讓您有辦法將複雜的任務分成幾個步驟，記住每個步驟所發生的事情，並根據目前的狀態決定下一步要做什麼。換句話說，它將代理程式的推理過程轉換成結構化、可重複的方式，而不是一連串的臨時提示。</p>
<p>您可以將它想像成<strong>AI 推理的流程圖</strong>：</p>
<ul>
<li><p><strong>分析</strong>使用者查詢</p></li>
<li><p>為工作<strong>選擇</strong>正確的工具</p></li>
<li><p>透過呼叫工具來<strong>執行</strong>任務</p></li>
<li><p><strong>處理</strong>結果</p></li>
<li><p><strong>檢查</strong>任務是否完成；若未完成，則返回並繼續推理</p></li>
<li><p><strong>輸出</strong>最終答案</p></li>
</ul>
<p>在這個過程中，LangGraph 會處理<strong>記憶體儲存</strong>，因此先前步驟的結果不會遺失，而且它會與<strong>外部工具庫</strong>（API、資料庫、搜尋、計算器、檔案系統等）整合。</p>
<p>這就是它被稱為<em>LangGraph</em> 的原因：<strong>Lang (Language) + Graph - 一個</strong>組織<strong>語言</strong>模型如何隨著時間思考與行動的框架。</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">瞭解 LangGraph 向上反應<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph 功能強大，但也有開銷。設定狀態管理、設計節點和邊緣、處理錯誤，以及在模型和工具中佈線，這些都需要時間。調試多步驟的流程也會很痛苦 - 當某些東西發生故障時，問題可能出在任何節點或轉換。隨著專案的成長，即使是微小的變更也會波及整個程式碼庫，讓一切變得緩慢。</p>
<p>這就是成熟的範本可以發揮巨大作用的地方。與其從零開始，範本給您一個經過驗證的結構、預先建立的工具，以及可以運作的腳本。您可以跳過模板，直接專注於代理程式邏輯。</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a>就是這樣一個範本。它的設計是用來幫助您快速建立一個 LangGraph ReAct 代理，並具備以下功能：</p>
<ul>
<li><p><strong>內建工具生態系統</strong>：開箱即用的適配器與公用程式</p></li>
<li><p>⚡<strong>快速啟動</strong>：簡單組態，數分鐘內即可啟用代理程式</p></li>
<li><p>🧪<strong>包含測試</strong>：單元測試和整合測試，讓您在擴充時更有信心</p></li>
<li><p><strong>生產就緒的設定</strong>：可節省部署時間的架構模式和腳本</p></li>
</ul>
<p>簡而言之，它會處理所有的模板，讓您可以專注於建立能實際解決您業務問題的代理程式。</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">開始使用 langgraph-up-react 模版<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>執行範本非常簡單直接。以下是逐步的設定過程：</p>
<ol>
<li>安裝環境依賴</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>克隆專案</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>安裝相依性</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>設定環境</li>
</ol>
<p>複製範例配置並加入您的金鑰：</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>編輯 .env 並至少設定一個模型提供者加上您的 Tavily API 金鑰：</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>啟動專案</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>您的開發伺服器現在已經啟動，並準備好進行測試。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">使用 langgraph-up-react 可以建立什麼？<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦模板開始運行，您實際上可以做什麼？以下是兩個具體的範例，說明如何將它應用在實際的專案中。</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">企業知識庫 Q&amp;A (Agentic RAG)</h3><p>常見的使用案例是公司知識的內部問答助手。想想產品手冊、技術文件、常見問題 - 有用但分散的資訊。使用<code translate="no">langgraph-up-react</code> ，您可以創建一個代理，在<a href="https://milvus.io/"><strong>Milvus</strong></a>向量資料庫中索引這些文件，檢索最相關的段落，並根據上下文生成準確的答案。</p>
<p>在部署方面，Milvus 提供彈性的選項：<strong>Lite</strong>適用於快速原型設計，<strong>Standalone</strong>適用於中型生產工作負載，<strong>Distributed</strong>適用於企業規模系統。您也需要調整索引參數 (例如 HNSW) 以平衡速度與精確度，並設定延遲與召回監控，以確保系統在負載下仍能保持可靠。</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">多代理協作</h3><p>另一個強大的使用案例是多代理體協作。您可以定義幾個共同工作的專門代理，而不是一個代理嘗試做所有的事情。舉例來說，在軟體開發工作流程中，產品經理代理分解需求，建築師代理草擬設計，開發人員代理編寫程式碼，測試代理驗證結果。</p>
<p>這種協調方式突顯了 LangGraph 的優勢：狀態管理、分支以及代理之間的協調。我們會在稍後的文章中詳細介紹這個設定，但重點是<code translate="no">langgraph-up-react</code> 讓我們不用花費數週的時間在腳手架上，就能實用地嘗試這些模式。</p>
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
    </button></h2><p>建立可靠的代理不只是巧妙的提示--而是結構化推理、管理狀態，並將所有東西連結成一個您可以實際維護的系統。LangGraph 為您提供了這樣的框架，而<code translate="no">langgraph-up-react</code> 則透過處理模板降低了障礙，讓您可以專注於代理的行為。</p>
<p>有了這個範本，您就可以啟動知識庫問答系統或多代理工作流程等專案，而不會在設定上迷失方向。這是一個起點，可以節省時間、避免常見的陷阱，並讓 LangGraph 的實驗變得更順利。</p>
<p>在下一篇文章中，我將深入介紹實作教學，逐步說明如何使用 LangGraph、<code translate="no">langgraph-up-react</code> 和 Milvus 向量資料庫，擴充範本並針對實際使用個案建立工作代理。敬請期待。</p>
