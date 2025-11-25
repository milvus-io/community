---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: MCP 已經過時了嗎？Anthropic運送技能的真正原因-以及如何搭配Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_162fd27dc1.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: 瞭解 Skills 如何減少代用幣消耗，以及 Skills 和 MCP 如何與 Milvus 合作強化 AI 工作流程。
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>在過去幾個星期，X 和 Hacker News 上爆發了一場令人驚訝的激烈爭論：<em>我們真的還需要 MCP 伺服器嗎？</em>有些開發人員聲稱 MCP 過度工程化、渴求代幣，而且與代理應該如何使用工具根本不符。其他人則為 MCP 辯護，認為 MCP 是讓語言模型曝露真實世界功能的可靠方法。視您閱讀的主題而定，MCP 不是工具使用的未來，就是死路一條。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種挫折感是可以理解的。MCP 可以讓您強大地存取外部系統，但也會強迫模型載入冗長的模式、煩瑣的描述，以及龐大的工具清單。這會增加實際成本。如果您下載會議謄本，之後再將其輸入到其他工具中，模型可能會多次重新處理相同的文字，這樣會增加代幣的使用量，卻沒有明顯的好處。對於規模運作的團隊而言，這並非不便，而是帳單。</p>
<p>但宣稱 MCP 已經過時還言之尚早。Anthropic (發明 MCP 的同一個團隊) 悄悄地推出了新的東西：<a href="https://claude.com/blog/skills"><strong>Skills</strong></a>。Skills 是輕量級的 Markdown/YAML 定義，說明工具應該<em>如何</em>以及<em>何時</em>使用。該模型不會將完整的模式傾倒到上下文視窗中，而是會先讀取精簡的元資料，然後再利用這些元資料進行規劃。在實踐中，Skills 大幅降低了符記開銷，並讓開發人員對工具協調有更多控制。</p>
<p>那麼，這是否意味著 Skills 將取代 MCP？不完全是。Skills 可簡化規劃，但 MCP 仍會提供實際功能：讀取檔案、呼叫 API、與儲存系統互動，或插入<a href="https://milvus.io/"><strong>Milvus</strong></a> 等外部基礎架構，<a href="https://milvus.io/"><strong>Milvus</strong></a> 是一個開放原始碼向量資料庫，可支援大規模的快速語意檢索，因此當您的 Skills 需要真正的資料存取時，它是一個重要的後端。</p>
<p>這篇文章將分別說明 Skills 的優點、MCP 仍然重要的地方，以及兩者如何融入 Anthropic 不斷演進的代理體架構。接下來，我們將介紹如何建立您自己的 Skills，並與 Milvus 整合。</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Anthropic Agent Skills 是什麼？<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>傳統 AI 代理程式長久以來的痛點是，指令會隨著對話的增加而消失。</p>
<p>即使有最精心製作的系統提示，模型的行為也會在對話過程中逐漸偏移。在幾個回合之後，Claude 開始忘記或不專注於原本的指示。</p>
<p>問題在於系統提示的結構。它是一次性的靜態注入，在模型的上下文視窗中與對話記錄、文件和任何其他輸入一起競爭空間。當上下文視窗填滿時，模型對系統提示的注意力就會變得越來越少，導致隨著時間的推移而失去一致性。</p>
<p>技能就是為了解決這個問題而設計的。技能是包含指令、腳本和資源的資料夾。與其依賴於靜態的系統提示，技能將專門知識分解成模組化、可重複使用且持久的指令包，Claude 可以在任務需要時發現並動態載入這些指令包。</p>
<p>當 Claude 開始執行任務時，它會首先讀取所有可用 Skills 的 YAML 元資料 (只有幾十個符記)，對所有可用的 Skills 執行輕量級掃描。這些元資料提供了足夠的資訊，讓 Claude 判斷某個 Skill 是否與目前的任務相關。如果是的話，Claude 會擴展到完整的指令集 (通常少於 5k tokens)，只有在必要時才會載入其他資源或腳本。</p>
<p>這種循序漸進的揭露方式讓 Claude 只需 30-50 個指令碼即可初始化一個 Skill，大幅提升效率並減少不必要的上下文開銷。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Skills 與 Prompts、Projects、MCP 及 Subagents 的比較<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>現今的模型工具環境可能會讓人覺得很擁擠。即使僅在 Claude 的代理生態系統中，就有數個截然不同的元件：Skills、prompts、Projects、subagents 和 MCP。</p>
<p>既然我們瞭解了什麼是 Skills，以及它們如何透過模組化指令束和動態載入來運作，我們就需要知道 Skills 與 Claude 生態系統的其他部分，尤其是 MCP，有什麼關係。以下是摘要：</p>
<h3 id="1-Skills" class="common-anchor-header">1.技能</h3><p>Skills 是包含指令、腳本和資源的資料夾。Claude 使用漸進式揭露方式動態發現並載入它們：首先是元資料，然後是完整的指令，最後是任何所需的檔案。</p>
<p><strong>最適合</strong></p>
<ul>
<li><p>組織工作流程 (品牌準則、合規程序)</p></li>
<li><p>專業領域 (Excel 公式、資料分析)</p></li>
<li><p>個人偏好 (筆記系統、編碼模式)</p></li>
<li><p>需要在不同對話中重複使用的專業任務 (基於 OWASP 的程式碼安全檢閱)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2.提示</h3><p>提示是您在會話中給予 Claude 的自然語言指示。它們是臨時的，只存在於目前的會話中。</p>
<p><strong>最適用於</strong></p>
<ul>
<li><p>一次性要求（總結一篇文章、格式化一份清單）</p></li>
<li><p>會話改進（調整語氣、增加細節）</p></li>
<li><p>即時情境 (分析特定資料、詮釋內容)</p></li>
<li><p>臨時指示</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3.專案</h3><p>專案是獨立的工作區，有自己的聊天記錄和知識庫。每個專案提供 200K 的上下文視窗。當您的專案知識接近上下文限制時，Claude 會無縫轉換為 RAG 模式，讓有效容量擴充 10 倍。</p>
<p><strong>最適合</strong></p>
<ul>
<li><p>持久性上下文 (例如：與產品發表相關的所有對話)</p></li>
<li><p>工作區組織 (不同的計畫有不同的情境)</p></li>
<li><p>團隊協作（在團隊和企業計畫中）</p></li>
<li><p>自訂指示 (專案特定的語氣或角度)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4.子代理</h3><p>副代理是專門的 AI 助手，擁有自己的情境視窗、自訂系統提示和特定工具權限。他們可以獨立工作，並將結果回傳給主代理。</p>
<p><strong>最適合</strong></p>
<ul>
<li><p>任務專業化 (程式碼檢閱、測試產生、安全稽核)</p></li>
<li><p>情境管理 (保持主會談專注)</p></li>
<li><p>平行處理 (多個子代理同時處理不同方面)</p></li>
<li><p>工具限制 (例如：唯讀存取)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5.MCP（模型上下文通訊協定）</h3><p>Model Context Protocol (MCP) 是一個開放標準，可將 AI 模型連接到外部工具和資料來源。</p>
<p><strong>最適用於</strong></p>
<ul>
<li><p>存取外部資料 (Google Drive、Slack、GitHub、資料庫)</p></li>
<li><p>使用業務工具 (CRM 系統、專案管理平台)</p></li>
<li><p>連接開發環境（本機檔案、IDE、版本控制）</p></li>
<li><p>整合自訂系統（專屬工具和資料來源）</p></li>
</ul>
<p>基於以上所述，我們可以看到 Skills 與 MCP 可解決不同的挑戰，並共同發揮相輔相成的作用。</p>
<table>
<thead>
<tr><th><strong>維度</strong></th><th><strong>MCP</strong></th><th><strong>技能</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>核心價值</strong></td><td>連接外部系統（資料庫、API、SaaS 平台）</td><td>定義行為規格（如何處理及呈現資料）</td></tr>
<tr><td><strong>回答問題</strong></td><td>"Claude 可以存取什麼？</td><td>"Claude 應該做什麼？</td></tr>
<tr><td><strong>實作</strong></td><td>用戶端伺服器通訊協定 + JSON 模式</td><td>Markdown 檔案 + YAML 元資料</td></tr>
<tr><td><strong>內容消耗</strong></td><td>數以萬計的代幣 (多台伺服器累積)</td><td>每次操作 30-50 個令牌</td></tr>
<tr><td><strong>使用案例</strong></td><td>查詢大型資料庫、呼叫 GitHub API</td><td>定義搜尋策略、套用過濾規則、輸出格式化</td></tr>
</tbody>
</table>
<p>讓我們以程式碼搜尋為例。</p>
<ul>
<li><p><strong>MCP (例如 claude-context)：</strong>提供存取 Milvus 向量資料庫的能力。</p></li>
<li><p><strong>技能：</strong>定義工作流程，例如優先處理最近修改的程式碼、依相關性排序結果，以及以 Markdown 表格呈現資料。</p></li>
</ul>
<p>MCP 提供能力，而 Skills 定義流程。兩者相輔相成。</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">如何使用 Claude-Context 和 Milvus 建立自訂技能<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a>是一個 MCP 外掛，可為 Claude Code 增加語意程式碼搜尋功能，將整個程式碼庫轉換成 Claude 的上下文。</p>
<h3 id="Prerequisite" class="common-anchor-header">先決條件</h3><p>系統需求：</p>
<ul>
<li><p><strong>Node.js</strong>：版本 &gt;= 20.0.0 且 &lt; 24.0.0</p></li>
<li><p><strong>OpenAI API 金鑰</strong>(用於嵌入模型)</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API 金鑰</strong>(管理的 Milvus 服務)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">步驟 1：配置 MCP 服務 (claude-context)</h3><p>在終端執行下列指令：</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>檢查設定：</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP 設定完成。Claude 現在可以存取 Milvus 向量資料庫。</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">步驟 2：建立技能</h3><p>建立 Skills 目錄：</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>建立 SKILL.md 檔案：</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">步驟 3：重新啟動 Claude 以套用技能</h3><p>執行下列指令重新啟動 Claude：</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>注意：</strong>配置完成後，您可以立即使用 Skills 來查詢 Milvus 程式碼庫。</p>
<p>以下是如何運作的範例。</p>
<p>查詢：Milvus QueryCoord 如何運作？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>在其核心，Skills 是一種封裝與傳輸專門知識的機制。透過使用 Skills，AI 可以繼承團隊的經驗，並遵循業界的最佳實務 - 不論是程式碼檢閱的核對清單或文件標準。當這些隱性知識透過 Markdown 檔案變得明確時，AI 所產生的輸出品質就會有顯著的改善。</p>
<p>展望未來，有效運用 Skills 的能力將成為團隊與個人如何運用 AI 發揮優勢的關鍵差異。</p>
<p>當您在組織中探索 AI 的潛力時，Milvus 是管理和搜尋大型向量資料的重要工具。將 Milvus 強大的向量資料庫與 Skills 等人工智慧工具搭配使用，不僅能改善您的工作流程，還能提升資料驅動洞察力的深度與速度。</p>
<p>對任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>，與我們的工程師和社群中的其他 AI 工程師交談。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得深入的見解、指導和問題解答。</p>
