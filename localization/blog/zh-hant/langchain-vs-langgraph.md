---
id: langchain-vs-langgraph.md
title: LangChain vs LangGraph：開發人員的 AI 框架選擇指南
author: Min Yin
date: 2025-09-09T00:00:00.000Z
desc: 比較適用於 LLM 應用程式的 LangChain 與 LangGraph。看看它們在架構、狀態管理和使用案例上有何不同，以及何時使用。
cover: assets.zilliz.com/Chat_GPT_Image_Sep_9_2025_09_42_12_PM_1_49154d15cc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, langchain, langgraph'
meta_keywords: 'Milvus, vector database, langchain, langgraph, langchain vs langgraph'
meta_title: |
  LangChain vs LangGraph: A Developer's Guide to Choosing Your AI Frameworks
origin: 'https://milvus.io/blog/langchain-vs-langgraph.md'
---
<p>在使用大型語言模型 (LLM) 建構時，您所選擇的框架對您的開發經驗有很大的影響。一個好的框架可以簡化工作流程、減少模板，並讓您更容易從原型轉換到生產。而不適合的框架則會反其道而行，增加摩擦和技術負債。</p>
<p>當今最流行的兩個選擇是<a href="https://python.langchain.com/docs/introduction/"><strong>LangChain</strong></a>和<a href="https://langchain-ai.github.io/langgraph/"><strong>LangGraph</strong></a>- 兩者都是開放原始碼，由 LangChain 團隊所創造。LangChain 著重於元件協調與工作流程自動化，因此非常適合檢索增量生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>) 等一般用例。LangGraph 以圖形架構建構在 LangChain 之上，更適合有狀態的應用程式、複雜的決策和多機體協調。</p>
<p>在本指南中，我們會比較這兩個框架的優劣：它們如何運作、它們的優勢，以及它們最適合的專案類型。到最後，您將清楚了解哪一種框架最符合您的需求。</p>
<h2 id="LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="common-anchor-header">LangChain：您的元件庫與 LCEL 協調強器<button data-href="#LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langchain"><strong>LangChain</strong></a>是一個開放源碼的框架，目的是讓建立 LLM 應用程式更容易管理。您可以將它視為模型 (例如 OpenAI 的<a href="https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md">GPT-5</a>或 Anthropic 的<a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude</a>) 與實際應用程式之間的中介軟體。它的主要工作是幫助您<em>串連</em>所有活動的部分：提示、外部 API、<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫和客</a>製化的業務邏輯。</p>
<p>以 RAG 為例。LangChain 提供您現成的抽象，讓您可以連接 LLM 與向量資料庫（例如<a href="https://milvus.io/">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>）、執行語意搜尋，並將結果回饋到您的提示，而不需要從頭開始佈線。除此之外，它還提供提示範本的實用工具、可呼叫工具的代理，以及可維護複雜工作流程的協調層。</p>
<p><strong>是什麼讓 LangChain 脫穎而出呢？</strong></p>
<ul>
<li><p><strong>豐富的元件庫</strong>- 文件載入器、文字分割器、向量儲存連接器、模型介面等。</p></li>
<li><p><strong>LCEL (LangChain Expression Language) 協調</strong>- 以聲明化的方式混合與搭配元件，減少模板。</p></li>
<li><p><strong>易於整合</strong>-<strong>可</strong>與 API、資料庫及第三方工具順暢運作。</p></li>
<li><p><strong>成熟的生態系統</strong>- 強大的文件、範例與活躍的社群。</p></li>
</ul>
<h2 id="LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="common-anchor-header">LangGraph：有狀態代理系統的必備工具<button data-href="#LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langgraph">LangGraph</a>是 LangChain 的專門擴充，專注於有狀態的應用程式。您可以將工作流程定義為結點與邊緣的圖形，而不是以線性腳本的方式來撰寫，這基本上就是一個狀態機。每個節點代表一個動作 (例如呼叫 LLM、查詢資料庫或檢查條件)，而邊定義流程如何依據結果移動。這種結構可以讓您更容易處理循環、分支和重試，而不會讓您的程式碼變成一堆 if/else 語句。</p>
<p>這種方法對於副駕駛員和<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">自主代理</a>等進階用例特別有用。這些系統經常需要追蹤記憶體、處理意想不到的結果，或是動態地做出決策。透過將邏輯明確地建模為圖表，LangGraph 讓這些行為更透明、更易維護。</p>
<p><strong>LangGraph 的核心功能包括</strong></p>
<ul>
<li><p><strong>以圖形為基礎的架構</strong>- 原生支援循環、回溯以及複雜的控制流程。</p></li>
<li><p><strong>狀態管理</strong>- 集中化的狀態可確保跨步驟的情境得以保留。</p></li>
<li><p><strong>多代理支援</strong>- 適用於多代理協作或協調的場景。</p></li>
<li><p><strong>除錯工具</strong>- 透過 LangSmith Studio 來追蹤圖形執行的可視化與除錯。</p></li>
</ul>
<h2 id="LangChain-vs-LangGraph-Technical-Deep-Dive" class="common-anchor-header">LangChain vs LangGraph：技術深究<button data-href="#LangChain-vs-LangGraph-Technical-Deep-Dive" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Architecture" class="common-anchor-header">架構</h3><p>LangChain 使用<strong>LCEL (LangChain Expression Language)</strong>在線性管道中將元件連接在一起。它具有宣告性、可讀性，非常適合 RAG 之類的直接工作流程。</p>
<pre><code translate="no"><span class="hljs-comment"># LangChain LCEL orchestration example</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Please answer the following question: {question}&quot;</span>)
model = ChatOpenAI()

<span class="hljs-comment"># LCEL chain orchestration</span>
chain = prompt | model

<span class="hljs-comment"># Run the chain</span>
result = chain.invoke({<span class="hljs-string">&quot;question&quot;</span>: <span class="hljs-string">&quot;What is artificial intelligence?&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>LangGraph 採用了不同的方法：工作流程以<strong>結點和邊緣的圖表來</strong>表示。每個節點定義一個動作，而圖形引擎則管理狀態、分支和重試。</p>
<pre><code translate="no"><span class="hljs-comment"># LangGraph graph structure definition</span>
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict

<span class="hljs-keyword">class</span> <span class="hljs-title class_">State</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: <span class="hljs-built_in">list</span>
    current_step: <span class="hljs-built_in">str</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_a</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing A&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;A&quot;</span>}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_b</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing B&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;B&quot;</span>}

graph = StateGraph(State)
graph.add_node(<span class="hljs-string">&quot;node_a&quot;</span>, node_a)
graph.add_node(<span class="hljs-string">&quot;node_b&quot;</span>, node_b)
graph.add_edge(<span class="hljs-string">&quot;node_a&quot;</span>, <span class="hljs-string">&quot;node_b&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LCEL 提供您簡潔的線性管道，而 LangGraph 則支援循環、分支和條件流程。這使得<strong>LangGraph</strong>更<strong>適合類似代理的系統</strong>，或是不遵循直線的多步互動。</p>
<h3 id="State-Management" class="common-anchor-header">狀態管理</h3><ul>
<li><p><strong>LangChain</strong>：使用記憶體元件來傳遞上下文。適用於簡單的多輪會話或線性工作流程。</p></li>
<li><p><strong>LangGraph</strong>：使用集中式的狀態系統，支援回滾、回溯及詳細的歷史記錄。對於長時間執行、有狀態的應用程式來說非常重要，因為上下文的連續性非常重要。</p></li>
</ul>
<h3 id="Execution-Models" class="common-anchor-header">執行模型</h3><table>
<thead>
<tr><th><strong>特點</strong></th><th><strong>LangChain</strong></th><th><strong>LangGraph</strong></th></tr>
</thead>
<tbody>
<tr><td>執行模式</td><td>線性協調</td><td>有狀態 (圖形) 執行</td></tr>
<tr><td>循環支援</td><td>有限支援</td><td>原生支援</td></tr>
<tr><td>條件分支</td><td>透過 RunnableMap 實作</td><td>本機支援</td></tr>
<tr><td>異常處理</td><td>透過 RunnableBranch 實作</td><td>內建支援</td></tr>
<tr><td>錯誤處理</td><td>鏈式傳輸</td><td>節點級處理</td></tr>
</tbody>
</table>
<h2 id="Real-World-Use-Cases-When-to-Use-Each" class="common-anchor-header">真實世界的使用案例：何時使用每種架構<button data-href="#Real-World-Use-Cases-When-to-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p>框架不只是架構的問題，它們在不同的情況下會有不同的表現。所以真正的問題是：什麼時候您應該使用 LangChain，什麼時候 LangGraph 更有意義？讓我們來看看一些實際的情況。</p>
<h3 id="When-LangChain-Is-Your-Best-Choice" class="common-anchor-header">何時 LangChain 是您的最佳選擇</h3><h4 id="1-Straightforward-Task-Processing" class="common-anchor-header">1.直接的任務處理</h4><p>當您需要將輸入轉換為輸出，而不需要繁重的狀態追蹤或分支邏輯時，LangChain 是非常合適的選擇。例如，翻譯選取文字的瀏覽器擴充套件：</p>
<pre><code translate="no"><span class="hljs-comment"># Implementing simple text translation using LCEL</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Translate the following text to English: {text}&quot;</span>)
model = ChatOpenAI()
chain = prompt | model

result = chain.invoke({<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Hello, World!&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>在這種情況下，不需要記憶體、重試或多步推理 - 只需要有效率的輸入輸出轉換。LangChain 可以讓程式碼保持乾淨且專注。</p>
<h4 id="2-Foundation-Components" class="common-anchor-header">2.基礎元件</h4><p>LangChain 提供豐富的基礎元件，可作為建構更複雜系統的基石。甚至當團隊使用 LangGraph 建構時，他們也經常依賴 LangChain 的成熟元件。這個框架提供了</p>
<ul>
<li><p><strong>向量儲存連結器</strong>- 統一的資料庫介面，例如 Milvus 和 Zilliz Cloud。</p></li>
<li><p><strong>文件載入器與分割器</strong>- 適用於 PDF、網頁和其他內容。</p></li>
<li><p><strong>模型介面</strong>- 常用 LLM 的標準化包裝程式。</p></li>
</ul>
<p>這使得 LangChain 不僅是一個工作流程工具，也是大型系統的可靠元件庫。</p>
<h3 id="When-LangGraph-Is-the-Clear-Winner" class="common-anchor-header">當 LangGraph 成為贏家時</h3><h4 id="1-Sophisticated-Agent-Development" class="common-anchor-header">1.複雜的代理開發</h4><p>當您要建置需要循環、分支與適應的進階代理系統時，LangGraph 便能發揮其優勢。以下是一個簡化的代理模式：</p>
<pre><code translate="no"><span class="hljs-comment"># Simplified Agent system example</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">agent</span>(<span class="hljs-params">state</span>):
    messages = state[<span class="hljs-string">&quot;messages&quot;</span>]
    <span class="hljs-comment"># Agent thinks and decides next action</span>
    action = decide_action(messages)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;action&quot;</span>: action, <span class="hljs-string">&quot;messages&quot;</span>: messages}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">tool_executor</span>(<span class="hljs-params">state</span>):
    <span class="hljs-comment"># Execute tool calls</span>
    action = state[<span class="hljs-string">&quot;action&quot;</span>]
    result = execute_tool(action)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;result&quot;</span>: result, <span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [result]}

<span class="hljs-comment"># Build Agent graph</span>
graph = StateGraph()
graph.add_node(<span class="hljs-string">&quot;agent&quot;</span>, agent)
graph.add_node(<span class="hljs-string">&quot;tool_executor&quot;</span>, tool_executor)
graph.add_edge(<span class="hljs-string">&quot;agent&quot;</span>, <span class="hljs-string">&quot;tool_executor&quot;</span>)
graph.add_edge(<span class="hljs-string">&quot;tool_executor&quot;</span>, <span class="hljs-string">&quot;agent&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>範例：</strong>GitHub Copilot X 的先進功能完美地展示了 LangGraph 的代理架構。該系統瞭解開發人員的意圖，將複雜的編程任務分解成可管理的步驟，依序執行多個操作，從中間結果學習，並根據沿途的發現調整其方法。</p>
<h4 id="2-Advanced-Multi-Turn-Conversation-Systems" class="common-anchor-header">2.先進的多輪會話系統</h4><p>LangGraph 的狀態管理功能使其非常適合建立複雜的多輪會話系統：</p>
<ul>
<li><p><strong>客戶服務系統</strong>：能夠追蹤會話歷史、瞭解上下文並提供連貫的回應</p></li>
<li><p><strong>教育輔導系統</strong>：根據學生的回答歷史調整教學策略</p></li>
<li><p><strong>面試模擬系統</strong>：根據應徵者的回答調整面試問題</p></li>
</ul>
<p><strong>範例：</strong>Duolingo 的 AI 輔導系統完美地展示了這一點。該系統可持續分析每位學習者的作答模式、識別特定的知識缺口、追蹤多節課程的學習進度，並提供個人化的語言學習體驗，以適應個人的學習風格、步調偏好和困難領域。</p>
<h4 id="3-Multi-Agent-Collaboration-Ecosystems" class="common-anchor-header">3.多代理協作生態系統</h4><p>LangGraph 本機支援多代理協作的生態系統。範例包括</p>
<ul>
<li><p><strong>團隊協作模擬</strong>：多角色協同完成複雜的任務</p></li>
<li><p><strong>辯論系統</strong>：持有不同觀點的多角色進行辯論</p></li>
<li><p><strong>創意合作平台</strong>：來自不同專業領域的智慧型代理共同創作</p></li>
</ul>
<p>這種方法已在藥物發現等研究領域中展現出前景，在這些領域中，代理可為不同的專業領域建模，並將結果結合成新的見解。</p>
<h3 id="Making-the-Right-Choice-A-Decision-Framework" class="common-anchor-header">做出正確的選擇：決策架構</h3><table>
<thead>
<tr><th><strong>專案特性</strong></th><th><strong>推薦架構</strong></th><th><strong>為什麼</strong></th></tr>
</thead>
<tbody>
<tr><td>簡單的一次性任務</td><td>LangChain</td><td>LCEL 協調簡單直覺</td></tr>
<tr><td>文字翻譯/優化</td><td>LangChain</td><td>不需要複雜的狀態管理</td></tr>
<tr><td>代理系統</td><td>LangGraph</td><td>強大的狀態管理與控制流程</td></tr>
<tr><td>多輪會話系統</td><td>LangGraph</td><td>狀態追蹤與情境管理</td></tr>
<tr><td>多代理協作</td><td>LangGraph</td><td>本機支援多節點互動</td></tr>
<tr><td>需要使用工具的系統</td><td>LangGraph</td><td>靈活的工具調用流程控制</td></tr>
</tbody>
</table>
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
    </button></h2><p>在大多數情況下，LangChain 和 LangGraph 是互補的，而不是競爭對手。LangChain 提供您穩固的元件與 LCEL 協調基礎，非常適合快速原型、無狀態任務，或是只需要乾淨的輸入輸出流程的專案。當您的應用程式超越了線性模型，需要狀態、分支或多代理一起工作時，LangGraph 便會介入。</p>
<ul>
<li><p>如果您的重點是文字翻譯、文件處理或資料轉換等簡單直接的任務，每個請求都是獨立存在的，請<strong>選擇 LangChain</strong>。</p></li>
<li><p>如果您正在建立多輪會話、代理系統或協同代理生態系統，而情境與決策非常重要，請<strong>選擇 LangGraph</strong>。</p></li>
<li><p><strong>混合使用兩者</strong>以獲得最佳結果。許多生產系統都是從 LangChain 的元件 (文件載入器、向量儲存連線器、模型介面) 開始，然後再加入 LangGraph 來管理有狀態、圖形驅動的邏輯。</p></li>
</ul>
<p>歸根結柢，與其說是追逐趨勢，不如說是讓框架符合您專案的真正需求。在活躍的社群和強大的文件驅動下，這兩個生態系統都在快速發展。無論您是使用 Milvus 建立您的第一個 RAG 管道，或是協調複雜的多重代理系統，只要瞭解兩者的契合點，您就能更好地設計能擴充的應用程式。</p>
