---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: LangChain 1.0 與 Milvus：如何以真正的長期記憶建立生產就緒的代理程式
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: 探索 LangChain 1.0 如何簡化代理程式架構，以及 Milvus 如何為可擴充、可生產的 AI 應用程式增加長期記憶體。
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain 是一個流行的開放源碼框架，用於開發由大型語言模型 (LLM) 驅動的應用程式。它提供了一個模組化的工具包，用來建立推理和使用工具的代理、連結模型與外部資料，以及管理互動流。</p>
<p>隨著<strong>LangChain 1.0</strong> 的推出，該架構朝著更適合生產的架構邁進了一步。新版本以標準的 ReAct 環路 (Reason → Tool Call → Observe → Decide) 取代早期以 Chain 為基礎的設計，並引入中間件 (Middleware) 來管理執行、控制與安全。</p>
<p>然而，光是推理還不夠。代理也需要儲存、召回和重複使用資訊的能力。這正是開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus</strong></a> 可以發揮重要作用的地方。Milvus 提供可擴充的高效能記憶層，讓代理能夠透過語意相似性有效地儲存、搜尋和擷取資訊。</p>
<p>在這篇文章中，我們將探討 LangChain 1.0 如何更新代理體架構，以及整合 Milvus 如何幫助代理體超越推理 - 為實際世界的使用案例實現持久、智慧的記憶體。</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">基於 Chain 的設計為何失敗<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>在早期（0.x 版本），LangChain 的架構以 Chains 為中心。每個 Chain 定義了一個固定的順序，並附有預先建立的範本，讓 LLM 的協調變得簡單又快速。這種設計非常適合快速建立原型。但隨著 LLM 生態系統的演進，以及實際使用案例的複雜性，此架構開始出現裂縫。</p>
<p><strong>1.缺乏彈性</strong></p>
<p>LangChain 的早期版本提供了模組化的管道，例如 SimpleSequentialChain 或 LLMChain，每個管道都遵循固定、線性的流程 - 提示建立 → 模型呼叫 → 輸出處理。這種設計對於簡單且可預測的任務非常有效，而且容易快速建立原型。</p>
<p>然而，當應用程式變得越來越動態時，這些僵化的範本就開始有了限制感。當業務邏輯不再整齊地符合預先定義的順序時，您會有兩個不滿意的選擇：強制您的邏輯符合框架，或是直接呼叫 LLM API 來完全繞過框架。</p>
<p><strong>2.缺乏生產級的控制</strong></p>
<p>在示範中運作良好的東西，在生產中卻經常失敗。Chains 並未包含大型、持久性或敏感應用程式所需的保障措施。常見的問題包括</p>
<ul>
<li><p><strong>上下文溢出：</strong>冗長的對話可能會超出代幣限制，導致當機或無聲截斷。</p></li>
<li><p><strong>敏感資料洩漏：</strong>個人識別資訊 (如電子郵件或 ID) 可能會在不經意的情況下傳送至第三方模型。</p></li>
<li><p><strong>無監督作業：</strong>代理可能會在未經人工核准的情況下刪除資料或傳送電子郵件。</p></li>
</ul>
<p><strong>3.缺乏跨模型相容性</strong></p>
<p>每個 LLM 供應商-OpenAI、Anthropic 和許多中國模型-都有自己的推理和工具呼叫協定。每次轉換提供者，都必須重寫整合層：提示範本、適配器和回應解析器。這種重複性的工作拖慢了開發速度，也讓實驗變得很痛苦。</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0：All-in ReAct 代理程式<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>當 LangChain 團隊分析了數百個生產級的代理實作時，有一個洞察力非常突出：幾乎所有成功的代理都自然而然地向<strong>ReAct (「推理 + 行動」) 模式</strong>靠攏。</p>
<p>無論是在多代理系統中，或是在執行深入推理的單一代理中，都會出現相同的控制循環：在簡短的推理步驟與目標工具呼叫之間交替進行，然後將觀察結果納入後續決策中，直到代理能夠提供最終答案為止。</p>
<p>LangChain 1.0 將 ReAct 環路置於其架構的核心，以這個經過驗證的結構為基礎，使其成為建立可靠、可解釋且可生產的代理程式的預設結構。</p>
<p>為了支援從簡單的代理到複雜的協調，LangChain 1.0 採用了分層設計，結合了易用性與精確的控制：</p>
<ul>
<li><p><strong>標準方案：</strong>從 create_agent() 函式開始 - 一個簡潔、標準化的 ReAct 環路，可處理推理與工具呼叫。</p></li>
<li><p><strong>延伸方案：</strong>新增中間件（Middleware）以獲得細緻的控制。中介軟體可讓您檢查或修改代理程式內部發生的事情 - 例如，新增 PII 檢測、人為核准檢查點、自動重試或監控鉤。</p></li>
<li><p><strong>複雜的情境：</strong>對於有狀態的工作流程或多代理程式協調，可使用 LangGraph，這是一個以圖表為基礎的執行引擎，可精確控制邏輯流程、相依性和執行狀態。</p></li>
</ul>
<p>現在，讓我們來分解讓代理程式開發更簡單、更安全、跨模型更一致的三個關鍵元件。</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1.create_agent()：建立代理的更簡單方法</h3><p>LangChain 1.0 的一個關鍵突破是它如何將建立代理的複雜性降低到單一函數 - create_agent()。您不再需要手動處理狀態管理、錯誤處理或串流輸出。這些生產級的功能現在都由 LangGraph runtime 底下自動管理。</p>
<p>只需三個參數，您就可以啟動一個功能完整的代理：</p>
<ul>
<li><p><strong>model</strong>-<strong>模型</strong>識別符 (字串) 或實體化模型物件。</p></li>
<li><p><strong>tools</strong>- 提供代理能力的功能清單。</p></li>
<li><p><strong>system_prompt</strong>- 定義代理程式角色、語調和行為的指令。</p></li>
</ul>
<p>在引擎蓋下，create_agent() 以標準的代理循環執行 - 呼叫模型、讓它選擇執行工具，並在不再需要工具時完成：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>它也繼承了 LangGraph 內建的狀態持久化、中斷恢復和串流功能。過去需要數百行協調程式碼的任務，現在只需透過單一的、宣告式的 API 即可處理。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2.中間件：生產就緒控制的可組合層</h3><p>中間件是將 LangChain 從原型帶到生產的關鍵橋梁。它在代理的執行迴圈中的策略點揭露鉤子，讓您可以在不重寫核心 ReAct 程序的情況下，新增自訂的邏輯。</p>
<p>代理的主要迴圈遵循三個步驟的決策流程 - 模型 → 工具 → 終止：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 為常見的模式提供了一些<a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">預先建立的中介軟體</a>。以下是四個範例。</p>
<ul>
<li><strong>PII 檢測：任何處理敏感使用者資料的應用程式</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>總結：當接近代幣限制時，自動總結會話歷史。</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>工具重試：自動重試失敗的工具呼叫，並可設定指數遞減。</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>自訂中介軟體</strong></li>
</ul>
<p>除了官方預先建立的中介軟體選項外，您也可以使用基於裝飾器或基於類別的方式建立自訂中介軟體。</p>
<p>例如，下面的片段展示了如何在執行前記錄模型調用：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3.結構化的輸出：標準化的資料處理方式</h3><p>在傳統的代理程式開發中，結構化的輸出一直都很難管理。每個模型提供者都有不同的處理方式 - 例如，OpenAI 提供原生的結構化輸出 API，而其他提供者僅透過工具呼叫間接支援結構化回應。這通常意味著要為每個提供者撰寫客製化的適配器，增加了額外的工作，也讓維護工作變得更加痛苦。</p>
<p>在 LangChain 1.0 中，結構化的輸出是直接透過 create_agent() 中的 response_format 參數來處理的。  您只需要定義一次您的資料模式。LangChain 會根據您所使用的模式自動挑選最佳的執行策略 - 不需要額外的設定或特定廠商的程式碼。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain 支援兩種結構化輸出的策略：</p>
<p><strong>1.提供者策略：</strong>有些模型提供者透過他們的 API 原生支援結構化輸出 (例如 OpenAI 和 Grok)。當有這樣的支援時，LangChain 會直接使用提供者內建的模式執行。由於模型本身可保證輸出格式，因此此方法可提供最高等級的可靠性與一致性。</p>
<p><strong>2.工具呼叫策略：</strong>對於不支援原生結構化輸出的模型，LangChain 使用工具調用來達到相同的結果。</p>
<p>您不需要擔心使用的是哪一種策略 - 框架會偵測模型的能力並自動適應。這個抽象讓您可以在不同的模型提供者之間自由切換，而不需要改變您的商業邏輯。</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Milvus 如何增強代理程式記憶體<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>對於生產級的代理程式，真正的效能瓶頸往往不是推理引擎，而是記憶體系統。在 LangChain 1.0 中，向量資料庫充當代理的外部記憶體，透過語意檢索提供長期記憶。</p>
<p><a href="https://milvus.io/">Milvus</a>是當今最成熟的開放原始碼向量資料庫之一，專為 AI 應用程式中的大規模向量搜尋而設計。它與 LangChain 原生整合，因此您不需要手動處理向量化、索引管理或相似性搜尋。langchain_milvus 套件將 Milvus 包裝成標準的 VectorStore 介面，讓您只需要幾行程式碼就能將它連接到您的代理。</p>
<p>藉由這樣的方式，Milvus 解決了在建立可擴充與可靠的代理記憶體系統時所面臨的三項主要挑戰：</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1.從龐大的知識庫中快速檢索</strong></h4><p>當代理需要處理數以千計的文件、過去的對話或產品手冊時，簡單的關鍵字搜尋是不夠的。Milvus 使用向量相似性搜尋，即使查詢使用不同的措辭，也能在幾毫秒內找到語義相關的資訊。這可讓您的代理根據意義回憶知識，而不僅僅是精確的文字匹配。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2.持久的長期記憶</strong></h4><p>LangChain 的摘要中介軟體 (SummarizationMiddleware) 可以在對話歷史變得太長時進行濃縮，但所有被濃縮掉的細節會怎麼處理呢？Milvus 會保留它們。每個對話、工具呼叫和推理步驟都可以向量化儲存，以供長期參考。當需要時，代理可以透過語意搜尋快速擷取相關記憶，實現跨會話的真正連續性。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3.多模式內容的統一管理</strong></h4><p>現代代理處理的不只是文字，他們還與圖像、音訊和視訊互動。Milvus 支援多向量儲存和動態模式，讓您可以在單一系統中管理多種模式的嵌入內容。這可為多模態代理提供統一的記憶體基礎，讓不同類型的資料進行一致的檢索。</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph：如何為您的代理選擇合適的版本<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>升級到 LangChain 1.0 是建立生產級代理的必要步驟 - 但這並不表示它永遠是每個使用個案的唯一或最佳選擇。選擇正確的框架決定了您能多快地將這些功能結合到一個可運作、可維護的系統中。</p>
<p>事實上，LangChain 1.0 和 LangGraph 1.0 可以視為同一層疊的一部分，是設計來共同運作而非互相取代的：LangChain 可協助您快速建立標準的代理，而 LangGraph 則可讓您針對複雜的工作流程進行精細的控制。換句話說，LangChain 可協助您快速行動，而 LangGraph 則可協助您深入瞭解。</p>
<p>以下是兩者在技術定位上的快速比較：</p>
<table>
<thead>
<tr><th><strong>尺寸</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>抽象層級</strong></td><td>高階抽象，專為標準代理情境設計</td><td>低階協調框架，專為複雜的工作流程設計</td></tr>
<tr><td><strong>核心能力</strong></td><td>標準 ReAct 環路 (Reason → Tool Call → Observation → Response)</td><td>自訂狀態機器和複雜的分支邏輯 (StateGraph + Conditional Routing)</td></tr>
<tr><td><strong>擴充機制</strong></td><td>生產級功能的中介軟體</td><td>節點、邊緣和狀態轉換的手動管理</td></tr>
<tr><td><strong>基本實作</strong></td><td>節點、邊緣和狀態轉換的手動管理</td><td>內建持久性與復原功能的原生運行時</td></tr>
<tr><td><strong>典型使用案例</strong></td><td>80% 的標準代理情境</td><td>多代理協作與長時間運作的工作流程協調</td></tr>
<tr><td><strong>學習曲線</strong></td><td>只需 ~10 行代碼即可建立一個代理程式</td><td>需要瞭解狀態圖和節點協調</td></tr>
</tbody>
</table>
<p>如果您是建立代理的新手或想要快速啟動專案，請從 LangChain 開始。如果您已經知道您的使用個案需要複雜的協調、多代理協作或長時間執行的工作流程，請直接使用 LangGraph。</p>
<p>這兩個框架可以在同一個專案中共存 - 您可以從簡單的 LangChain 開始，當您的系統需要更多的控制與彈性時，再加入 LangGraph。關鍵是為工作流程的每個部分選擇合適的工具。</p>
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
    </button></h2><p>三年前，LangChain 以調用 LLM 的輕量級封裝程式起家。如今，它已發展成一個完整的生產級框架。</p>
<p>在核心層中，中介軟體層提供了安全性、合規性和可觀測性。LangGraph 增加了持久執行、控制流和狀態管理。而在記憶體層，<a href="https://milvus.io/">Milvus</a>填補了一個重要的缺口 - 提供可擴充、可靠的長期記憶體，讓代理可以擷取上下文、推理歷史，並隨時間改進。</p>
<p>LangChain、LangGraph 和 Milvus 共同構成了現代代理時代的實用工具鏈 - 在不犧牲可靠性或效能的前提下，銜接快速原型設計與企業級部署。</p>
<p>準備好讓您的代理程式擁有可靠的長期記憶嗎？探索<a href="https://milvus.io">Milvus</a>，看看它如何為生產中的 LangChain 代理提供智慧型長期記憶。</p>
<p>有任何問題或想要深入了解任何功能？加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得洞察力、指導和問題解答。</p>
