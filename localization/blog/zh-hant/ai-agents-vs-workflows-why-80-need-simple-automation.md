---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: AI 代理或工作流程？為什麼 80% 的自動化任務應該跳過代理程式？
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: Refly 和 Milvus 的整合提供了一種實用的自動化方法--重視可靠性和易用性而非不必要的複雜性。
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>AI 代理現在無處不在 - 從編碼副駕駛員到客戶服務機器人 - 他們在複雜的推理上表現出令人瞠目結舌的優點。和許多人一樣，我喜歡它們。但在建立代理程式和自動化工作流程之後，我了解到一個簡單的事實：<strong>代理程式並不是解決所有問題的最佳方案。</strong></p>
<p>舉例來說，當我使用 CrewAI 建立多代理系統來解碼 ML 時，事情很快就變得亂七八糟。研究代理 70% 的時間都會忽略網路爬蟲。摘要代理丟掉了引文。每當任務不清楚時，協調就會崩潰。</p>
<p>這不僅發生在實驗中。我們許多人已經在用來集思廣益的 ChatGPT、用來編碼的 Claude，以及用來處理資料的半打 API 之間跳來跳去，靜靜地想：<em>一定有更好的方法讓這些東西一起運作。</em></p>
<p>有時候，答案就是代理程式。更多的時候，它是一個<strong>精心設計的 AI 工作流程</strong>，將您現有的工具縫合成強大的東西，而不會有不可預測的複雜性。</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">使用 Refly 和 Milvus 建立更聰明的 AI 工作流程<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>我知道你們有些人已經在搖頭了："工作流程？那些都是死板的。對於真正的 AI 自動化而言，它們還不夠聰明"。有道理，大部分的工作流程都是僵化的，因為它們是以舊式的流水線為藍本：步驟 A → 步驟 B → 步驟 C，不允許有任何偏差。</p>
<p>但真正的問題不在於工作流程的<em>概念</em>，而在於<em>執行</em>。我們不必滿足於脆弱的線性管道。我們可以設計更聰明的工作流程，以適應情境、靈活運用創意，並仍然提供可預測的結果。</p>
<p>在本指南中，我們將使用 Refly 和 Milvus 建立一個完整的內容創作系統，說明為什麼 AI 工作流程可以超越複雜的多代理體架構，尤其是當您關心速度、可靠性和可維護性的時候。</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">我們使用的工具</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>：一個圍繞「自由畫布」概念打造的開放原始碼 AI 原生內容創作平台。</p>
<ul>
<li><p><strong>核心功能：</strong>智慧型畫布、知識管理、多線程對話及專業創作工具。</p></li>
<li><p><strong>為什麼有用？</strong>拖放式工作流程建置可讓您將各種工具串連成連貫的自動化順序，而不會侷限於僵化的單一執行路徑。</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: 處理資料層的開放原始碼向量資料庫。</p>
<ul>
<li><p><strong>為何重要？</strong>內容創作主要是尋找並重組現有資訊。傳統資料庫能很好地處理結構化資料，但大部分創意工作都涉及非結構化格式 - 文件、圖片、影片。</p></li>
<li><p><strong>新增功能</strong>Milvus 利用整合式嵌入模型，將非結構性資料編碼為向量，實現語意搜尋，讓您的工作流程能以毫秒級的延遲擷取相關內容。透過 MCP 等通訊協定，Milvus 可與您的 AI 架構無縫整合，讓您能以自然語言查詢資料，而無需糾纏於資料庫語法。</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">設定您的環境</h3><p>讓我帶您在本機設定此工作流程。</p>
<p><strong>快速設定清單：</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (或類似的 Linux)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>任何支援函式呼叫的 LLM 的 API 金鑰。在本指南中，我會使用<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>的 LLM。</p></li>
</ul>
<p><strong>系統需求</strong></p>
<ul>
<li><p>CPU：最少 8 核心 (建議 16 核心)</p></li>
<li><p>記憶體：至少 16GB（建議 32GB）。</p></li>
<li><p>儲存空間：最低 100GB SSD (建議 500GB)</p></li>
<li><p>網路：需要穩定的網際網路連線</p></li>
</ul>
<p><strong>軟體相依性</strong></p>
<ul>
<li><p>作業系統：Linux (建議使用 Ubuntu 20.04+)</p></li>
<li><p>容器化：Docker + Docker Compose</p></li>
<li><p>Python版本 3.11 或更高</p></li>
<li><p>語言模型：任何支援函式呼叫的模型 (線上服務或 Ollama 離線部署皆可)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">步驟 1：部署 Milvus 向量資料庫</h3><p><strong>1.1 下載 Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 啟動 Milvus 服務</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">步驟 2：部署 Refly 平台</h3><p><strong>2.1 克隆資源庫</strong></p>
<p>除非您有特殊需求，否則所有環境變數都可以使用預設值：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 驗證服務狀態</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">步驟 3：設定 MCP 服務</h3><p><strong>3.1 下載 Milvus MCP 伺服器</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 啟動 MCP 服務</strong></p>
<p>本範例使用 SSE 模式。用您可用的 Milvus 服務端點取代 URI：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 確認 MCP 服務正在運行</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">步驟 4：組態與設定</h3><p>現在您的基礎架構已開始執行，讓我們來設定一切，使其能無縫運作。</p>
<p><strong>4.1 存取 Refly 平台</strong></p>
<p>導覽到您的本地 Refly 實例：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 建立您的帳戶</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 配置您的語言模型</strong></p>
<p>在本指南中，我們將使用<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>。首先，註冊並取得您的 API 金鑰。</p>
<p><strong>4.4 加入您的模型提供者</strong></p>
<p>輸入您在上一步取得的 API 金鑰：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 配置 LLM 模型</strong></p>
<p>請務必選擇支援函式呼叫功能的模型，因為這對於我們將要建立的工作流程整合是不可或缺的：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 整合 Milvus-MCP 服務</strong></p>
<p>請注意 Web 版本不支援 stdio 類型的連線，所以我們會使用之前設定的 HTTP 端點：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Excellent！一切設定完成後，讓我們透過一些實例來看看這個系統的運作。</p>
<p><strong>4.7 實例：使用 MCP-Milvus-Server 進行有效率的向量擷取</strong></p>
<p>這個範例展示<strong>MCP-Milvus-Server</strong>如何在您的 AI 模型和 Milvus 向量資料庫實體之間扮演中間人的角色。它就像一個翻譯器-接受來自您的 AI 模型的自然語言請求，將它們轉換成正確的資料庫查詢，並傳回結果-因此您的模型可以在不知道任何資料庫語法的情況下使用向量資料。</p>
<p><strong>4.7.1 建立新的畫布</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 開始對話</strong></p>
<p>開啟對話介面，選擇您的模型，輸入您的問題，然後傳送。</p>
<p><strong>4.7.3 檢視結果</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這裡發生的事情相當引人注目：我們剛展示了使用<a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a>作為整合層的<a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">Milvus</a>向量資料庫的自然語言控制。沒有複雜的查詢語法-只要用簡單的英文告訴系統您的需求，它就會為您處理資料庫的操作。</p>
<p><strong>4.8 示例 2：使用工作流建立 Refly 部署指南</strong></p>
<p>第二個範例展示了工作流程協調的真正威力。我們將透過結合多種 AI 工具與資料來源，建立一個完整的部署指南。</p>
<p><strong>4.8.1 收集您的原始資料</strong></p>
<p>Refly 的強大之處在於它能彈性處理不同的輸入格式。您可以匯入多種格式的資源，不論是文件、影像或結構化資料。</p>
<p><strong>4.8.2 建立任務和連結資源卡</strong></p>
<p>現在我們將透過定義任務，並將其連結至原始素材，來建立我們的工作流程。</p>
<p><strong>4.8.3 設定三個處理任務</strong></p>
<p>這是工作流程方法真正發揮作用的地方。我們不會試圖在一個複雜的流程中處理所有事情，而是將工作分成三個重點任務，整合上傳的素材並有系統地精煉。</p>
<ul>
<li><p><strong>內容整合任務</strong>：合併和組織原始素材</p></li>
<li><p><strong>內容</strong>改進<strong>任務</strong>：改善清晰度和流程</p></li>
<li><p><strong>編輯最終草案</strong>：建立可供出版的輸出</p></li>
</ul>
<p>結果不言而喻。原本需要花費數小時在多種工具之間進行手動協調的工作，現在都能自動處理，而且每個步驟都能在前一個步驟的基礎上順理成章地進行。</p>
<p><strong>多模式工作流程功能：</strong></p>
<ul>
<li><p><strong>影像產生與處理</strong>：與高品質模型整合，包括 flux-schnell、flux-pro 及 SDXL。</p></li>
<li><p><strong>視訊產生與理解</strong>：支援各種風格化視訊模型，包括 Seedance、Kling 和 Veo</p></li>
<li><p><strong>音訊產生工具</strong>：透過 Lyria-2 等模型產生音樂，以及透過 Chatterbox 等模型進行語音合成</p></li>
<li><p><strong>整合處理</strong>：所有多模式輸出都可在系統內參考、分析和再處理</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Refly</strong>和<strong>Milvus</strong>的整合提供了一種實用的自動化方法，它重視可靠性和易用性，而非不必要的複雜性。透過結合工作流程協調與多模式處理，團隊可以更快速地從概念轉移至出版，同時保留對每個階段的完全控制。</p>
<p>這並不是要否定 AI 代理。它們對於處理真正複雜、不可預測的問題非常有價值。但對於許多自動化需求而言，尤其是在內容創作與資料處理方面，精心設計的工作流程能以更少的開銷提供更好的結果。</p>
<p>隨著 AI 技術的演進，最有效的系統可能會融合這兩種策略：</p>
<ul>
<li><p><strong>工作流程</strong>是可預測性、可維護性和可重複性的關鍵。</p></li>
<li><p>而<strong>代理則</strong>需要真正的推理能力、適應能力和開放式的問題解決能力。</p></li>
</ul>
<p>我們的目標不是建立最炫目的 AI，而是建立最<em>有用的</em>AI。通常，最有用的解決方案也是最直接的。</p>
