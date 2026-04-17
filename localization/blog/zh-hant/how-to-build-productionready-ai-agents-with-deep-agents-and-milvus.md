---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: 如何使用 Deep Agents 和 Milvus 建立生產就緒的 AI 代理
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: 學習如何使用 Deep Agents 和 Milvus 建立可擴充的 AI 代理，以執行長時間執行的任務、降低代幣成本和持久記憶體。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>越來越多的團隊正在建立 AI 代理，而他們指派給代理的任務也變得越來越複雜。許多真實世界的工作流程都涉及長時間執行的工作，包含多個步驟和許多工具呼叫。隨著這些任務的增加，有兩個問題很快就會出現：較高的代幣成本以及模型上下文視窗的限制。Agents 也經常需要記住跨會話的資訊，例如過去的研究成果、使用者偏好或較早前的對話。</p>
<p>像 LangChain 發表的<a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a> 之類的框架，有助於組織這些工作流程。它提供了一種結構化的方式來執行代理程式，並支援任務規劃、檔案存取和子代理程式授權。這可讓您更容易建立代理程式，更可靠地處理長時間、多步驟的任務。</p>
<p>但僅有工作流程是不夠的。代理程式也需要<strong>長期記憶體</strong>，這樣才能從先前的工作階段中擷取有用的資訊。這就是開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus</strong></a> 的<a href="https://milvus.io/"><strong>用武之地</strong></a>。透過儲存會話、文件和工具結果的嵌入，Milvus 可讓代理程式搜尋並回憶過去的知識。</p>
<p>在這篇文章中，我們將解釋 Deep Agents 如何運作，並展示如何結合 Milvus 來建立具有結構化工作流程和長期記憶的 AI 代理。</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">什麼是 Deep Agents？<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong>是由 LangChain 團隊建立的開源代理框架。它旨在幫助代理更可靠地處理長時間運行的多步驟任務。它著重於三個主要功能：</p>
<p><strong>1.任務規劃</strong></p>
<p>Deep Agents 包含<code translate="no">write_todos</code> 和<code translate="no">read_todos</code> 等內建工具。代理將複雜的任務分解成明確的待辦事項清單，然後逐項逐步完成，並標記已完成的任務。</p>
<p><strong>2.檔案系統存取</strong></p>
<p>它提供了<code translate="no">ls</code> 、<code translate="no">read_file</code> 和<code translate="no">write_file</code> 等工具，因此代理可以檢視、讀取和寫入檔案。如果工具產生大量輸出，結果會自動儲存到檔案中，而不是停留在模型的上下文視窗中。這有助於防止上下文視窗被填滿。</p>
<p><strong>3.子代理程式委託</strong></p>
<p>使用<code translate="no">task</code> 工具，主代理可以將子任務交給專門的子代理。每個子代理程式都有自己的上下文視窗和工具，這有助於讓工作井井有條。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>嚴格來說，使用<code translate="no">create_deep_agent</code> 建立的代理是一個已編譯的<strong>LangGraph StateGraph</strong>。(LangGraph是LangChain團隊開發的工作流程函式庫，StateGraph是其核心狀態結構)。正因如此，Deep Agents 可以直接使用 LangGraph 的功能，例如流式輸出、檢查點（checkpointing）和人在迴圈（human-in-the-loop）的互動。</p>
<p><strong>那麼，是什麼讓 Deep Agents 在實務中派上用場呢？</strong></p>
<p>長時間執行的代理任務通常會面臨諸如上下文限制、高代幣成本以及不可靠的執行等問題。Deep Agents 可讓代理工作流程更有條理、更易於管理，從而協助解決這些問題。透過減少不必要的上下文增長，它可以降低代幣使用量，並使長時間執行的任務更具成本效益。</p>
<p>它也讓複雜的多步驟任務更容易組織。子任務可以獨立執行，不會互相干擾，提高了可靠性。與此同時，該系統具有彈性，允許開發人員在其代理從簡單實驗發展為生產應用程式時對其進行定制和擴展。</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">深度代理的客製化<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>一般的框架無法涵蓋所有的產業或業務需求。Deep Agents 的設計非常靈活，因此開發人員可以根據自己的用例進行調整。</p>
<p>透過客製化，您可以</p>
<ul>
<li><p>連接您自己的內部工具和 API</p></li>
<li><p>定義特定領域的工作流程</p></li>
<li><p>確保代理遵循業務規則</p></li>
<li><p>支援跨會話的記憶與知識分享</p></li>
</ul>
<p>以下是您可以自訂 Deep Agents 的主要方式：</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">系統提示自訂</h3><p>您可以在中介軟體提供的預設指示之上，新增自己的系統提示。這對於定義域規則和工作流程非常有用。</p>
<p>一個好的自訂提示可能包括</p>
<ul>
<li><strong>領域工作流程規則</strong></li>
</ul>
<p>範例：「對於資料分析任務，在建立模型之前總是先執行探索性分析」。</p>
<ul>
<li><strong>具體範例</strong></li>
</ul>
<p>範例：「將類似的文獻搜尋請求合併為一個待辦事項」。</p>
<ul>
<li><strong>停止規則</strong></li>
</ul>
<p>範例：「如果使用的工具呼叫超過 100 次，則停止」。</p>
<ul>
<li><strong>工具協調指引</strong></li>
</ul>
<p>範例：「使用<code translate="no">grep</code> 查找代码位置，然后使用<code translate="no">read_file</code> 查看详细信息」。</p>
<p>避免重複中間件已經處理的指示，並避免新增與預設行為衝突的規則。</p>
<h3 id="Tools" class="common-anchor-header">工具</h3><p>您可以在內建的工具集中加入自己的工具。工具被定義為一般的 Python 函數，其說明書會說明它們的作用。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents 也透過<code translate="no">langchain-mcp-adapters</code> 支援遵循 Model Context Protocol (MCP) 標準的工具。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">中介軟體</h3><p>您可以寫自訂的中介軟體來</p>
<ul>
<li><p>新增或修改工具</p></li>
<li><p>調整提示</p></li>
<li><p>掛鉤到代理執行的不同階段</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents 也包含內建的中介軟體，用於規劃、子代理管理和執行控制。</p>
<table>
<thead>
<tr><th>中介軟體</th><th>功能</th></tr>
</thead>
<tbody>
<tr><td>TodoList 中介軟體</td><td>提供 write_todos 和 read_todos 工具來管理任務清單</td></tr>
<tr><td>檔案系統中介軟體</td><td>提供檔案操作工具，並自動儲存大型工具的輸出結果</td></tr>
<tr><td>子代理中間件</td><td>提供委派工作給子代理的任務工具</td></tr>
<tr><td>總結中介軟體</td><td>當上下文超過 170k tokens 時會自動總結</td></tr>
<tr><td>人類提示快取中介軟體</td><td>啟用 Anthropic 模型的提示快取功能</td></tr>
<tr><td>PatchToolCalls 中介軟體</td><td>修正中斷導致的不完整工具呼叫</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>設定需要人為核准的工具</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">子代理程式</h3><p>主代理可以使用<code translate="no">task</code> 工具將子任務委託給子代理。每個子代理程式都在自己的上下文視窗中執行，並擁有自己的工具和系統提示。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>對於進階使用個案，您甚至可以傳入預先建立的 LangGraph 工作流程作為子代理。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (人工審核控制）</h3><p>您可以使用<code translate="no">interrupt_on</code> 參數指定某些需要人工核准的工具。當代理程式呼叫這些工具時，執行會暫停，直到有人審查並核准為止。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">後端自訂 (儲存)</h3><p>您可以選擇不同的儲存後端來控制檔案的處理方式。目前的選項包括</p>
<ul>
<li><p><strong>StateBackend</strong>(暫存)</p></li>
<li><p><strong>檔案系統後端</strong>(本機磁碟儲存)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>透過變更後端，您可以調整檔案儲存行為，而無需變更整體系統設計。</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">為什麼要使用 Milvus 的 Deep Agents 作為 AI 代理？<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>在實際應用中，Agent 經常需要跨會話持續使用的記憶體。例如，它們可能需要記住使用者偏好、隨時間累積領域知識、記錄回饋以調整行為，或追蹤長期研究任務。</p>
<p>在預設情況下，Deep Agents 使用<code translate="no">StateBackend</code> ，它只會儲存單次會話期間的資料。當會話結束時，所有資料都會被清除。這意味著它無法支援長期、跨會話記憶。</p>
<p>為了實現持久記憶，我們將<a href="https://milvus.io/"><strong>Milvus</strong></a>與<code translate="no">StoreBackend</code> 一起用作向量資料庫。工作原理如下：重要的會話內容和工具結果會被轉換為 embeddings（代表意義的數字向量），並儲存在 Milvus 中。當一個新任務開始時，代理會執行語意搜尋，以擷取相關的過去記憶。這可讓代理「記得」過去會話的相關資訊。</p>
<p>Milvus 非常適合這個使用個案，因為它有運算與儲存分離的架構。它支援</p>
<ul>
<li><p>橫向擴充至數百億向量</p></li>
<li><p>高並發性查詢</p></li>
<li><p>即時資料更新</p></li>
<li><p>大型系統的生產就緒部署</p></li>
</ul>
<p>技術上，Deep Agents 使用<code translate="no">CompositeBackend</code> 將不同路徑路由至不同的儲存後端：</p>
<table>
<thead>
<tr><th>路徑</th><th>後端</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>/workspace/, /temp/</td><td>狀態後端</td><td>臨時資料，會話結束後清除</td></tr>
<tr><td>/memories/、/knowledge/</td><td>StoreBackend + Milvus</td><td>持久性資料，可跨會話搜尋</td></tr>
</tbody>
</table>
<p>有了這個設定，開發人員只需要將長期資料儲存在<code translate="no">/memories/</code> 之類的路徑下。系統會自動處理跨會話記憶體。詳細的設定步驟在下面的章節提供。</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">實際操作：使用 Milvus 和深度代理建立具有長期記憶的 AI 代理<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>本範例展示如何使用 Milvus 賦予基於 DeepAgents 的代理長期記憶體。</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">步驟 1：安裝相關依據</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">步驟 2：設定記憶體後端</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">步驟 3：建立代理程式</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>關鍵點</strong></p>
<ul>
<li><strong>持久化路徑</strong></li>
</ul>
<p>任何儲存在<code translate="no">/memories/</code> 下的檔案都會永久儲存，並可跨越不同的階段存取。</p>
<ul>
<li><strong>生產設定</strong></li>
</ul>
<p>本範例使用<code translate="no">InMemoryStore()</code> 進行測試。在生產中，請以 Milvus 適配器取代，以啟用可擴充的語意搜尋。</p>
<ul>
<li><strong>自動記憶</strong></li>
</ul>
<p>代理程式會自動將研究成果和重要輸出儲存到<code translate="no">/memories/</code> 資料夾。在之後的任務中，它可以搜尋並擷取相關的過去資訊。</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">內建工具總覽<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents 包含多種透過中介軟體提供的內建工具。它們主要分為三組：</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">任務管理 (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>建立結構化的待辦事項清單。每項任務都可以包含說明、優先順序和相依性。</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>顯示目前的待辦事項清單，包括已完成和待處理的任務。</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">檔案系統工具 (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>列出目錄中的檔案。必須使用絕對路徑 (以<code translate="no">/</code>) 開始。</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>讀取檔案內容。對於大型檔案，支援<code translate="no">offset</code> 和<code translate="no">limit</code> 。</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>建立或覆寫檔案。</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>取代檔案內的特定文字。</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>使用模式搜尋檔案，例如<code translate="no">**/*.py</code> 搜尋所有 Python 檔案。</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>搜尋檔案內的文字。</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>在沙箱環境中執行 shell 指令。需要後端支援<code translate="no">SandboxBackendProtocol</code> 。</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">子代理委託 (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>將子任務傳送給特定的子代理。您提供子代理名稱和任務描述。</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">如何處理工具輸出</h3><p>如果工具產生較大的結果，Deep Agents 會自動將其儲存到檔案中。</p>
<p>例如，如果<code translate="no">internet_search</code> 返回 100KB 的內容，系統會將其儲存為<code translate="no">/tool_results/internet_search_1.txt</code> 之類的檔案。代理在其上下文中只保留文件路徑。這樣可減少使用 Token，並保持上下文視窗較小。</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder：何時應該使用兩者？<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>既然這篇文章的重點在於 DeepAgents，了解它與</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder 的</em></a><em>比較也是很有幫助的，</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em> 是 LangChain 生態系統中另一個建立代理的選項。</em></p>
<p>LangChain 提供了幾種方式來建立 AI 代理，而最佳選擇通常取決於您想要對系統有多大的控制權。</p>
<p><strong>DeepAgents</strong>專為建立自主代理程式而設計，可處理長時間執行的多步驟任務。它讓開發人員可以完全控制代理如何規劃任務、使用工具以及管理記憶體。由於它是建立在 LangGraph 上，因此您可以自訂元件、整合 Python 工具，以及修改儲存後端。這使得 DeepAgents 非常適合複雜的工作流程和生產系統，在這些系統中，可靠性和靈活性非常重要。</p>
<p>相比之下，<strong>Agent Builder 著重</strong>於易用性。它隱藏了大部分的技術細節，因此您可以描述一個代理程式、新增工具並快速執行。記憶體、工具使用和人為核准步驟都會自動處理。這使得 Agent Builder 適用於快速原型、內部工具或早期實驗。</p>
<p><strong>Agent Builder 和 DeepAgents 不是獨立的系統，它們是同一堆疊的一部分。</strong>Agent Builder 建立在 DeepAgents 之上。許多團隊一開始使用 Agent Builder 來測試想法，然後在需要更多控制時，再轉換到 DeepAgents。使用 DeepAgents 創建的工作流程也可以轉換成 Agent Builder 範本，以便其他人可以輕鬆重複使用。</p>
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
    </button></h2><p>Deep Agents 透過使用三個主要構想：任務規劃、檔案儲存和子代理授權，讓複雜的代理工作流程更容易管理。這些機制將雜亂、多步驟的流程轉變為結構化的工作流程。當與 Milvus 結合進行向量搜尋時，代理程式也可以跨會話保持長期記憶。</p>
<p>對開發人員而言，這意味著更低的 Token 成本和更可靠的系統，可以從簡單的示範擴充到生產環境。</p>
<p>如果您正在建立需要結構化工作流程和真正長期記憶體的 AI 代理，我們很樂意與您聯繫。</p>
<p>對於 Deep Agents 或使用 Milvus 作為長期記憶體後端有任何疑問？請加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>，或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>，討論您的使用個案。</p>
