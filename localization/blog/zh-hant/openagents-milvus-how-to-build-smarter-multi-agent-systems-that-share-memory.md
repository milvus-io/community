---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: OpenAgents x Milvus：如何建立共享記憶體的更智慧型多代理系統
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: 探索 OpenAgents 如何實現分散式多機體協作、為何 Milvus 對於增加可擴充的記憶體至關重要，以及如何建立完整的系統。
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>大多數開發人員一開始使用單一代理程式來開發他們的代理系統，後來才發現他們基本上是建立了一個非常昂貴的聊天機器人。對於簡單的任務，ReAct 式的代理系統運作良好，但很快就會遇到極限：它無法並行執行步驟，無法追蹤長的推理鏈，而且一旦加入太多工具，系統就會崩潰。多代理體設定保證可以解決這個問題，但它們也帶來了自己的問題：協調開支、脆弱的交接，以及悄悄侵蝕模型品質的膨脹共享上下文。</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a>是一個開放原始碼架構，用來建立多代理系統，讓 AI 代理在其中合作、分享資源，並在持續的社群中處理長期專案。OpenAgents 不需要單一的中央協調器，而是讓代理以更分散的方式合作：代理可以彼此發現、溝通，並圍繞共同目標進行協調。</p>
<p>搭配<a href="https://milvus.io/">Milvus</a>向量資料庫，此管道可獲得可擴充、高效能的長期記憶體層級。Milvus 透過快速的語意搜尋、靈活的索引選擇 (例如 HNSW 和 IVF) 以及透過分割的乾淨隔離，為代理程式記憶體提供強大的能力，因此代理程式可以儲存、擷取和重複使用知識，而不會淹沒在上下文中或踩到彼此的資料。</p>
<p>在這篇文章中，我們將介紹 OpenAgents 如何實現分散式多代理體協作、為何 Milvus 是可擴充代理體記憶體的重要基礎，以及如何逐步組裝這樣的系統。</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">建立真實世界代理系統的挑戰<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>當今許多主流的代理程式框架-LangChain、AutoGen、CrewAI 等，都是圍繞<strong>著以任務為中心的</strong>模型所建立的。您啟動一組代理程式，給他們一個工作，或許定義一個工作流程，然後讓他們執行。這對於狹窄或短暫的用例非常有效，但在真正的生產環境中，卻暴露出三種結構上的限制：</p>
<ul>
<li><p><strong>知識仍然是孤立的。</strong>代理程式的經驗只限於其本身的部署。工程部門的程式碼檢閱代理程式不會與評估可行性的產品團隊代理程式分享它所學到的知識。每個團隊最終都要從頭開始重建知識，既低效又脆弱。</p></li>
<li><p><strong>合作是僵化的。</strong>即使在多代理體架構中，合作也通常取決於事先定義的工作流程。當合作需要轉變時，這些靜態規則無法適應，使得整個系統的彈性降低。</p></li>
<li><p><strong>缺乏持續狀態。</strong>大多數的代理程式都遵循一個簡單的生命週期：<em>啟動 → 執行 → 關閉。</em>它們會在運行之間忘記一切--上下文、關係、所做的決定和互動歷史。如果沒有持久狀態，代理程式就無法建立長期記憶或演進其行為。</p></li>
</ul>
<p>這些結構性問題來自於將代理視為孤立的任務執行者，而非更廣泛的協作網路中的參與者。</p>
<p>OpenAgents 團隊相信，未來的代理系統需要的不只是更強大的推理能力，他們需要一個機制，讓代理能夠彼此發現、建立關係、分享知識，並且動態地一起工作。最重要的是，這不應該依賴於單一的中央控制器。網際網路之所以能運作，就是因為它是分散式的，沒有單一的節點能主宰一切，而且隨著系統的成長，它也會變得更強大、更可擴充。多代理系統也受惠於相同的設計原則。這就是為什麼 OpenAgents 捨棄了全能的統籌者的概念，取而代之的是分散式、網路驅動的合作。</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">OpenAgents 是什麼？<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents 是建立 AI 代理網路的開放原始碼架構，可實現開放式合作，讓 AI 代理共同合作、分享資源，並處理長期專案。OpenAgents 為代理人網路提供基礎架構，讓代理人在持續成長的社群中，與數百萬個其他代理人開放合作。在技術層級上，系統是圍繞三個核心元件所構成：<strong>Agent Network、Network Mods 和 Transports。</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1.代理網路：合作的共享環境</h3><p>代理程式網路是一個共享環境，多個代理程式可以在這個環境中連線、溝通並共同解決複雜的任務。其核心特徵包括</p>
<ul>
<li><p><strong>持久運作：</strong>一旦建立，網路就會獨立於任何單一任務或工作流程而保持在線。</p></li>
<li><p><strong>動態代理：</strong>代理可隨時使用網路 ID 加入；無需事先註冊。</p></li>
<li><p><strong>多協定支援：</strong>統一的抽象層支援透過 WebSocket、gRPC、HTTP 及 libp2p 進行通訊。</p></li>
<li><p><strong>自主配置：</strong>每個 Network 維護自己的權限、管理和資源。</p></li>
</ul>
<p>只需一行程式碼，您就可以建立一個 Network，任何代理程式都可以透過標準介面立即加入。</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2.網路模組：可插拔的協作擴充</h3><p>Mods 提供與核心系統脫離的模組化協作功能層。您可以根據您的特定需求來混合和搭配 Mods，實現針對每個使用個案量身打造的協作模式。</p>
<table>
<thead>
<tr><th><strong>模組</strong></th><th><strong>用途</strong></th><th><strong>使用個案</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>工作區訊息傳送</strong></td><td>即時訊息通訊</td><td>串流回應、即時回饋</td></tr>
<tr><td><strong>論壇</strong></td><td>非同步討論</td><td>提案審查、多輪商議</td></tr>
<tr><td><strong>維基</strong></td><td>共享知識庫</td><td>知識整合、文件協作</td></tr>
<tr><td><strong>社群</strong></td><td>關係圖</td><td>專家路由、信任網路</td></tr>
</tbody>
</table>
<p>所有 Mods 都在統一的事件系統上運作，方便隨時擴充框架或引進自訂行為。</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3.Transports：與通訊協定無關的通道</h3><p>Transports 是允許異質代理在 OpenAgents 網路中連結及交換訊息的通訊協定。OpenAgents 支援多種傳輸通訊協定，可在同一個網路中同時執行，包括</p>
<ul>
<li><p>適用於廣泛、跨語言整合的<strong>HTTP/REST</strong></p></li>
<li><p>用於低延遲、雙向通訊的<strong>WebSocket</strong></p></li>
<li><p>用於適合大型集群的高效能<strong>RPC 的 gRPC</strong></p></li>
<li><p>用於分散式點對點網路的<strong>libp2p</strong></p></li>
<li><p><strong>A2A</strong> 是專為代理對代理通訊所設計的新興通訊協定。</p></li>
</ul>
<p>所有的傳輸都是透過統一的事件式訊息格式來操作，因此可以在通訊協定之間進行無縫轉換。您不需要擔心對等代理使用的通訊協定，框架會自動處理。以任何語言或框架建立的代理程式都可以加入 OpenAgents 網路，而無需重新編寫現有的程式碼。</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">整合 OpenAgents 與 Milvus 以提供長期的代理程式記憶體<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents 解決了 Agents 如何<strong>溝通、相互發現與協同合作的</strong>挑戰，<strong>但僅</strong>有協同合作是不夠的。代理程式會產生洞察力、決策、會談歷史、工具結果，以及特定領域的知識。如果沒有持久性記憶體層級，所有這些都會在代理程式關閉時消失。</p>
<p>這就是<strong>Milvus</strong>的重要性所在。Milvus 提供高效能向量儲存與語意檢索，可將代理程式互動轉換為持久、可重複使用的記憶體。當整合至 OpenAgents 網路時，它提供了三大優勢：</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1.語意搜尋</strong></h4><p>Milvus 使用 HNSW 和 IVF_FLAT 等索引演算法提供快速的語意搜尋。代理可以根據意義而不是關鍵字來擷取最相關的歷史記錄，使他們能夠</p>
<ul>
<li><p>回憶先前的決策或計劃、</p></li>
<li><p>避免重複工作、</p></li>
<li><p>維持跨會話的長遠情境。</p></li>
</ul>
<p>這是<em>代理記憶體</em>的支柱：快速、相關、上下文檢索。</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2.十億級的水平擴充能力</strong></h4><p>真實的代理程式網路會產生大量資料。Milvus 可在此規模下舒適地運作，提供</p>
<ul>
<li><p>數十億向量的儲存與搜尋、</p></li>
<li><p>&lt; 即使在高吞吐量的 Top-K 檢索下，延遲時間仍小於 30 毫秒、</p></li>
<li><p>完全分散式架構，可隨著需求成長而線性擴充。</p></li>
</ul>
<p>無論您有一打代理或成千上萬的代理並行工作，Milvus 都能保持快速一致的擷取。</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3.多租客隔離</strong></h4><p>Milvus 透過<strong>Partition Key</strong>（一種輕量分區機制，可在單一集合內分割記憶體）提供細粒度的多租戶隔離。這允許</p>
<ul>
<li><p>不同的團隊、專案或代理社群可維護獨立的記憶體空間、</p></li>
<li><p>與維護多個集合相比，可大幅降低開銷、</p></li>
<li><p>需要共用知識時，可選擇跨分區檢索。</p></li>
</ul>
<p>這種隔離性對於大型多重代理體部署非常重要，在這種部署中，資料邊界必須受到尊重，同時又不影響檢索速度。</p>
<p>OpenAgents 透過直接呼叫 Milvus API 的<strong>自訂 Mods</strong>連接到 Milvus。代理程式訊息、工具輸出與互動記錄會自動嵌入向量並儲存在 Milvus 中。開發人員可以自訂</p>
<ul>
<li><p>嵌入模型、</p></li>
<li><p>儲存模式與元資料、</p></li>
<li><p>以及檢索策略 (例如混合搜尋、分割搜尋)。</p></li>
</ul>
<p>這讓每個代理社群都有一個可擴充、持久、且針對語義推理最佳化的記憶層。</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">如何使用 OpenAgent 和 Milvus 建立多代理聊天機器人<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>為了讓事情具體化，讓我們來進行一個示範：建立一個<strong>開發人員支援社群</strong>，讓多個專業代理 - Python 專家、資料庫專家、DevOps 工程師等等 - 合作回答技術問題。每個專家都會提供特定領域的推理，系統會自動將查詢路由至最適合的代理，而非依賴單一工作過度的通用代理。</p>
<p>本範例展示如何將<strong>Milvus</strong>整合到 OpenAgents 部署中，以提供技術問答的長期記憶。代理對話、過去的解決方案、疑難排解記錄和使用者查詢都會轉換成向量嵌入並儲存於 Milvus 中，讓網路有能力</p>
<ul>
<li><p>記住先前的答案、</p></li>
<li><p>重複使用先前的技術說明、</p></li>
<li><p>跨會話維持一致性，並</p></li>
<li><p>隨著更多互動的累積而不斷改進。</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">先決條件</h3><ul>
<li><p>python3.11 以上</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1.定義相依存關係</h3><p>定義專案所需的 Python 套件：</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2.環境變數</h3><p>這裡是您的環境設定範本：</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3.設定 OpenAgents 網路</h3><p>定義您的代理程式網路結構及其通訊設定：</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4.實施多代理協作</h3><p>以下為核心程式碼片段 (非完整實作)。</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5.建立並啟動虛擬環境</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>安裝相依性</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>設定 API 金鑰</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>啟動 OpenAgents 網路</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>啟動多重代理服務</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>啟動 OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>存取工作室</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>檢查代理和網路的狀態：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>OpenAgents 提供了協調層，讓代理相互發現、溝通和協作，而 Milvus 則解決了知識如何儲存、分享和重複使用這個同樣重要的問題。透過提供高效能向量記憶層，Milvus 可讓代理建立持續的上下文、回想過去的互動，並隨時間累積專業知識。兩者的結合，讓 AI 系統超越了孤立模型的限制，邁向真正多機體網路的更深層次協作潛力。</p>
<p>當然，任何多代理體架構都必須有所取捨。並行運行代理程式可能會增加代幣消耗，錯誤可能會在代理程式之間連鎖發生，同時進行決策可能會導致偶爾的衝突。這些都是積極研究和持續改善的領域，但它們不會降低建立能夠協調、記憶和進化的系統的價值。</p>
<p>🚀準備好給您的代理體長期記憶了嗎？</p>
<p>探索<a href="https://milvus.io/">Milvus</a>並嘗試將其與您自己的工作流程整合。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得洞察力、指導和問題解答。</p>
