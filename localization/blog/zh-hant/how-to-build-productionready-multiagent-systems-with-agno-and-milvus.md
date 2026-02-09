---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: 如何使用 Agno 和 Milvus 建立生產就緒的多動態系統
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: 學習如何使用 Agno、AgentOS 和 Milvus 為實際工作負載建立、部署和擴充生產就緒的多重代理系統。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>如果您一直在建立人工智慧代理程式，您很可能會碰壁：您的示範運作得很好，但要將它導入生產卻是另一回事。</p>
<p>在之前的文章中，我們已經介紹過代理程式的記憶體管理和重排。現在，讓我們來解決更大的挑戰，建立能真正在生產中運作的代理程式。</p>
<p>現實的情況是：生產環境非常混亂。單一代理很少能勝任，這就是為什麼多代理系統無處不在的原因。但目前可用的框架往往分為兩大陣營：輕量級的框架雖然演示效果很好，但在實際負載下就會崩潰；強大的框架則需要花很長的時間來學習和建構。</p>
<p>我最近一直在嘗試<a href="https://github.com/agno-agi/agno">Agno</a>，它似乎找到了一個合理的中間落腳點--既注重生產準備，又不會過於複雜。這個專案在幾個月內就獲得超過 37,000 個 GitHub stars，顯示其他開發人員也覺得它很有用。</p>
<p>在這篇文章中，我將分享我在使用 Agno 與<a href="https://milvus.io/">Milvus</a>作為記憶體層來建置多機體系統時所學到的知識。我們將探討 Agno 與 LangGraph 等替代方案的比較，並介紹您可以自行嘗試的完整實作。</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Agno 是什麼？<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a>是專為生產使用而建立的多代理框架。它有兩個不同的層次：</p>
<ul>
<li><p><strong>Agno 框架層</strong>：您定義代理程式邏輯的地方</p></li>
<li><p><strong>AgentOS 運行層</strong>：將這個邏輯轉換成您可以實際部署的 HTTP 服務。</p></li>
</ul>
<p>可以這樣想：框架層定義您的代理應該做<em>什麼</em>，而 AgentOS 則處理<em>如何</em>執行和服務這些工作。</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">框架層</h3><p>這就是您要直接處理的工作。它引入了三個核心概念：</p>
<ul>
<li><p><strong>代理</strong>：處理特定類型的任務</p></li>
<li><p><strong>團隊</strong>：協調多個代理解決複雜的問題</p></li>
<li><p><strong>工作流程</strong>：定義執行順序和結構</p></li>
</ul>
<p>有一點我很欣賞：您不需要學習新的 DSL 或繪製流程圖。代理行為是使用標準 Python 函式呼叫來定義的。該架構處理 LLM 調用、工具執行和記憶體管理。</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">AgentOS 運行時層</h3><p>AgentOS 旨在透過同步執行來處理大量的請求量，其無狀態架構讓擴充變得簡單直接。</p>
<p>主要功能包括</p>
<ul>
<li><p>內建 FastAPI 整合功能，可將代理體顯示為 HTTP 端點</p></li>
<li><p>會話管理與串流回應</p></li>
<li><p>監控端點</p></li>
<li><p>支援橫向擴充</p></li>
</ul>
<p>實際上，AgentOS 會處理大部分的基礎架構工作，讓您可以專注於代理程式邏輯本身。</p>
<p>Agno 架構的高階視圖如下。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs. LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>為了瞭解 Agno 的優勢，讓我們將它與 LangGraph 作一比較 - LangGraph 是使用最廣泛的多代理程式框架之一。</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a>使用基於圖的狀態機。您可以將整個代理工作流程建模為圖形：步驟是節點，執行路徑是邊緣。當您的流程是固定且嚴格有序時，這個方法會很有效。但對於開放式或對話式的情境來說，可能會覺得有限制。隨著互動變得越來越動態，維護一個乾淨的圖形就變得越來越困難。</p>
<p><strong>Agno</strong>採取了不同的方法。它不是一個純粹的協調層，而是一個端到端的系統。定義您的代理行為，AgentOS 就會自動將其顯示為生產就緒的 HTTP 服務，並內建監控、可擴充性和多輪對話支援。不需要單獨的 API 閘道，不需要自訂會話管理，也不需要額外的作業工具。</p>
<p>以下是快速比較：</p>
<table>
<thead>
<tr><th>尺寸</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>協調模型</td><td>使用節點和邊緣明確定義圖形</td><td>以 Python 定義的宣告式工作流程</td></tr>
<tr><td>狀態管理</td><td>由開發人員定義和管理的自訂狀態類別</td><td>內建記憶體系統</td></tr>
<tr><td>除錯與可觀察性</td><td>LangSmith (付費)</td><td>AgentOS UI (開放原始碼)</td></tr>
<tr><td>執行時模型</td><td>整合至現有的執行時</td><td>基於 FastAPI 的獨立服務</td></tr>
<tr><td>部署複雜性</td><td>需要透過 LangServe 進行額外設定</td><td>開箱即用</td></tr>
</tbody>
</table>
<p>LangGraph 提供您更多的彈性與精細的控制。Agno 優化了更快的生產時間。正確的選擇取決於您的專案階段、現有的基礎架構，以及您需要的客製化程度。如果您不確定，使用兩者執行小型概念驗證可能是最可靠的決定方式。</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">為代理程式記憶體層選擇 Milvus<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦您選擇了框架，下一個決定就是如何儲存記憶體和知識。我們使用 Milvus 來處理這個問題。<a href="https://milvus.io/">Milvus</a>是專為 AI 工作負載打造的最流行開源向量資料庫，在<a href="https://github.com/milvus-io/milvus">GitHub 上</a>擁有超過<a href="https://github.com/milvus-io/milvus">42,000+ 顆</a>星星。</p>
<p><strong>Agno 原生支援 Milvus。</strong> <code translate="no">agno.vectordb.milvus</code> 模組包裝了生產功能，例如連線管理、自動重試、批次寫入和嵌入產生。您不需要自行建立連線池或處理網路故障，幾行 Python 就能提供您一個工作向量記憶體層。</p>
<p><strong>Milvus 可根據您的需求進行擴充。</strong>它支援三種<a href="https://milvus.io/docs/install-overview.md">部署模式：</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>：輕量、以檔案為基礎 - 非常適合本地開發與測試</p></li>
<li><p><strong>獨立</strong>：單一伺服器部署，適用於生產工作負載</p></li>
<li><p><strong>分散式</strong>：適用於大規模方案的完整集群</p></li>
</ul>
<p>您可以從 Milvus Lite 開始，在本地驗證您的代理程式記憶體，然後隨著流量成長移至獨立或分散式，而無需變更您的應用程式碼。當您在早期階段快速迭代，但需要明確的擴充路徑時，這種靈活性尤其有用。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">逐步進行：使用 Milvus 建立生產就緒的 Agno 代理程式<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們從頭開始建立一個可投入生產的代理程式。</p>
<p>我們將從一個簡單的單一代理範例開始，以展示完整的工作流程。然後，我們會將它擴展成一個多代理系統。AgentOS 會自動將一切打包為可呼叫的 HTTP 服務。</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1.使用 Docker 部署 Milvus Standalone</h3><p><strong>(1) 下載部署檔案</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 啟動 Milvus 服務</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2.核心執行</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) 執行代理程式</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3.連接至 AgentOS 主控台</h3><p>https://os.agno.com/</p>
<p><strong>(1) 建立帳號並登入</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) 將您的代理程式連接到 AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 設定暴露的連接埠和 Agent 名稱</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) 在 Milvus 中新增文件並建立索引</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) 測試代理端到端</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在這個設定中，Milvus 處理高效能的語意檢索。當知識庫助理收到技術問題時，它會呼叫<code translate="no">search_knowledge</code> 工具來嵌入查詢，從 Milvus 擷取最相關的文件塊，並使用這些結果作為回應的基礎。</p>
<p>Milvus 提供三種部署選項，讓您可以選擇適合您作業需求的架構，同時在所有部署模式中保持應用程式層級 API 的一致性。</p>
<p>上面的示範展示了核心的擷取與產生流程。然而，若要將此設計轉移到生產環境中，有幾個架構層面需要更詳細的討論。</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">擷取結果如何在代理之間分享<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno 的團隊模式有一個<code translate="no">share_member_interactions=True</code> 選項，允許後來的代理繼承先前代理的完整互動歷史。實際上，這表示當第一個代理從 Milvus 擷取資訊時，後續代理可以重複使用這些結果，而不需要再次執行相同的搜尋。</p>
<ul>
<li><p><strong>好處</strong>擷取成本可在整個團隊中攤薄。一個向量搜尋可支援多個代理，減少多餘的查詢。</p></li>
<li><p><strong>缺點：</strong>擷取品質會被放大。如果初始搜尋返回不完整或不準確的結果，這個錯誤就會傳播給依賴它的每個代理程式。</p></li>
</ul>
<p>這就是為什麼在多重代理系統中，檢索的準確性更加重要。糟糕的檢索不僅會降低一個代理程式的回應，還會影響整個團隊。</p>
<p>以下是一個團隊設定的範例：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">為什麼 Agno 和 Milvus 是分層的<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>在此架構中，<strong>Agno</strong>位於對話與協調層。它負責管理對話流程、協調代理、維護會話狀態，並將會話歷史記錄在關係資料庫中。系統的實際領域知識（例如產品文件和技術報告）則分開處理，並以向量嵌入的方式儲存在<strong>Milvus</strong> 中。這種明確的區分使會話邏輯和知識儲存完全解耦。</p>
<p>為什麼這在操作上很重要？</p>
<ul>
<li><p><strong>獨立擴充</strong>：隨著 Agno 需求的成長，增加更多的 Agno 實體。當查詢量增加時，透過增加查詢節點來擴充 Milvus。每層都是獨立擴充。</p></li>
<li><p><strong>不同的硬體需求</strong>：Agno 需要 CPU 和記憶體（LLM 推論、工作流程執行）。Milvus 則針對高吞吐量向量擷取 (磁碟 I/O，有時使用 GPU 加速) 進行最佳化。將它們分開可避免資源爭用。</p></li>
<li><p><strong>成本最佳化</strong>：您可以為每一層獨立調整和分配資源。</p></li>
</ul>
<p>這種分層方式可讓您擁有更有效率、更有彈性、更適合生產的架構。</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">使用 Agno 與 Milvus 時需要監控的事項<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno 有內建的評估功能，但加入 Milvus 會擴大您需要監控的項目。根據我們的經驗，請專注於三個領域：</p>
<ul>
<li><p><strong>檢索品質</strong>：Milvus 所傳回的文件是否真的與查詢相關，或只是在向量層面上表面相似？</p></li>
<li><p><strong>答案忠實性</strong>：最終的回應是以擷取的內容為基礎，還是 LLM 產生了無依據的主張？</p></li>
<li><p><strong>端對端延遲細分</strong>：不要只追蹤總回應時間。按階段進行細分 - 嵌入式產生、向量搜尋、上下文組合、LLM 推論 - 因此您可以找出發生緩慢的地方。</p></li>
</ul>
<p><strong>一個實例：</strong>當您的 Milvus 收集從 100 萬個向量增加到 1,000 萬個向量時，您可能會發現檢索延遲逐漸增加。這通常是調整索引參數 (如<code translate="no">nlist</code> 和<code translate="no">nprobe</code>) 或考慮從單機轉換為分散式部署的訊號。</p>
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
    </button></h2><p>建立生產就緒的代理系統需要的不只是將 LLM 呼叫和擷取示範連結起來。您需要清楚的架構邊界、獨立擴充的基礎架構，以及及早發現問題的可觀察性。</p>
<p>在這篇文章中，我介紹了 Agno 與 Milvus 的合作方式：Agno 用於多代理體協調，Milvus 用於可擴充的記憶體與語意檢索。將這些層級分開，您就可以從原型轉移至生產階段，而無須重寫核心邏輯，並可視需要擴充每個元件。</p>
<p>如果您正在嘗試類似設定，我很想聽聽您的想法。</p>
<p><strong>對 Milvus 有問題嗎？</strong>加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>。</p>
