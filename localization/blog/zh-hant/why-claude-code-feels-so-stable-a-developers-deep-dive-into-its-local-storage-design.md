---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: Claude 程式碼為何如此穩定？開發人員深入探討其本地儲存設計
author: Bill chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: 深入了解 Claude Code 的儲存：JSONL 會話記錄、專案隔離、分層配置以及檔案快照，讓 AI 輔助編碼變得穩定且可回復。
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Claude Code 最近無處不在。開發人員使用程式碼來加快功能開發速度、自動化工作流程，以及在實際專案中運作的代理原型。更令人驚訝的是，許多非程式設計師也加入其中 - 建立工具、佈線工作，幾乎不需要任何設定就能獲得有用的結果。AI 編碼工具能如此快速地普及到如此多不同的技術層級，實屬罕見。</p>
<p>然而，真正突出的是它的<em>穩定性</em>。Claude Code 會記住各個階段所發生的事情，當機時也不會遺失進度，而且它的行為更像是本機開發工具，而非聊天介面。這種可靠性來自於它處理本機儲存的方式。</p>
<p>Claude Code 不會將您的編碼階段視為臨時聊天，而是讀寫真實檔案、將專案狀態儲存在磁碟上，並記錄代理工作的每一步驟。每個專案都能保持乾淨隔離，避免許多代理程式工具會遇到的交叉污染問題。</p>
<p>在這篇文章中，我們將進一步了解這種穩定性背後的儲存架構，以及為什麼它在 Claude Code 的日常開發中扮演如此重要的角色。</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">每個本地 AI 編碼助理所面臨的挑戰<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>在解釋 Claude Code 如何處理儲存之前，我們先來看看本地 AI 編碼工具容易遇到的常見問題。當助理直接在您的檔案系統上工作並隨時間保持狀態時，這些問題自然會出現。</p>
<p><strong>1.專案資料在不同工作區間混亂。</strong></p>
<p>大多數開發人員每天都會在多個 repos 之間切換。如果助理將狀態從一個專案轉移到另一個專案，就會變得更難理解其行為，也更容易做出錯誤的假設。每個專案都需要有自己乾淨、隔離的狀態與歷史空間。</p>
<p><strong>2.當機會導致資料遺失。</strong></p>
<p>在編碼過程中，助理會產生源源不絕的有用資料 - 檔案編輯、工具呼叫、中間步驟。如果這些資料沒有馬上儲存，當機或強制重新啟動都可能將它抹去。可靠的系統會將重要的狀態在建立後立即寫入磁碟，這樣工作就不會意外遺失。</p>
<p><strong>3.代理實際上做了什麼並不總是很清楚。</strong></p>
<p>一個典型的會話包含許多小動作。如果沒有清晰、有序的動作記錄，就很難追溯助手如何達到特定輸出或找出出錯的步驟。完整的歷史記錄可以讓除錯和檢閱更容易管理。</p>
<p><strong>4.撤銷錯誤需要花費太多精力。</strong></p>
<p>有時候，輔助程式所做的變更不太有效。如果您沒有內建的方式來回復這些變更，您最終只能手動尋找整個 repo 中的編輯。系統應該自動追蹤變更的內容，這樣您就可以乾淨地撤銷變更，而不需要額外的工作。</p>
<p><strong>5.不同的專案需要不同的設定。</strong></p>
<p>本地環境各不相同。有些專案需要特定的權限、工具或目錄規則；有些則有自訂的腳本或工作流程。助理需要尊重這些差異，並允許每個專案的設定，同時仍保持其核心行為一致。</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Claude Code 背後的儲存設計原則<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的儲存設計圍繞四個簡單直接的想法。它們看似簡單，但卻能解決 AI 助手直接在您的機器上跨專案工作時所遇到的實際問題。</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1.每個專案都有自己的儲存空間。</h3><p>Claude Code 將所有會話資料與其所屬的專案目錄相連。這表示會話、編輯和日誌都會保留在其來自的專案中，不會洩漏到其他專案中。將儲存空間分開可讓助手的行為更容易理解，也讓檢查或刪除特定 repo 的資料變得簡單。</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2.資料會立即儲存到磁碟。</h3><p>Claude Code 不會將互動資料保存在記憶體中，而是在資料建立後立即寫入磁碟。每個事件 - 訊息、工具呼叫或狀態更新 - 都會被附加為新的項目。如果程式當機或意外關閉，幾乎所有資料都還在。這種方法既能保持會話的持久性，又不會增加太多複雜性。</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3.每個動作在歷史中都有明確的位置。</h3><p>Claude Code 將每個訊息和工具動作與之前的動作連結起來，形成一個完整的序列。這種有序的歷史可以回顧會話是如何展開的，並追蹤導致特定結果的步驟。對開發人員來說，有了這種追蹤，調試和理解代理程式的行為就容易多了。</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4.程式碼編輯很容易回退。</h3><p>在助理更新檔案之前，Claude Code 會儲存先前狀態的快照。如果變更結果是錯誤的，您可以還原先前的版本，而不需要翻開 repo 或猜測到底是什麼改變了。這個簡單的安全網讓人工智能驅動的編輯風險大大降低。</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Claude 程式碼本地儲存配置<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 將所有本機資料儲存在單一位置：您的主目錄。這可讓系統保持可預測性，並在需要時更容易檢查、除錯或清理。儲存配置是圍繞兩個主要元件建立的：一個小的全局配置檔，以及一個較大的資料目錄，所有專案層級的狀態都存放在這個目錄中。</p>
<p><strong>兩個核心元件：</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>儲存全局設定和捷徑，包括專案映射、MCP 伺服器設定和最近使用的提示。</p></li>
<li><p><code translate="no">~/.claude/</code>主資料目錄，Claude Code 在此儲存會話、專案會話、權限、外掛程式、技能、歷史和相關的執行時資料。</p></li>
</ul>
<p>接下來，讓我們仔細看看這兩個核心元件。</p>
<p><strong>(1) 全局配置</strong>：<code translate="no">~/.claude.json</code></p>
<p>此檔案的作用是索引而非資料儲存。它會記錄您曾經處理的專案、每個專案附有哪些工具，以及您最近使用過哪些提示。會話資料本身不會儲存在這裡。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 主要資料目錄</strong>：<code translate="no">~/.claude/</code></p>
<p><code translate="no">~/.claude/</code> 目錄是 Claude Code 大部分本機狀態所在的地方。它的結構反映了幾個核心設計理念：專案隔離、立即持久化，以及從錯誤中安全復原。</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>這個佈局是刻意簡單的：所有 Claude Code 產生的資料都存放在同一個目錄下，並依專案和 session 來組織。沒有隱藏的狀態散佈在您的系統中，必要時也很容易檢查或清理。</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Claude Code 如何管理組態<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 的組態系統是圍繞一個簡單的想法而設計的：在不同的機器上保持預設行為一致，但仍然讓個別的環境和專案自訂他們所需要的。為了實現這一目標，Claude Code 使用了三層組態模型。當同樣的設定出現在多個地方時，較具體的層次總是最重要的。</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">三層組態</h3><p>Claude Code 以下列順序載入設定，從最低優先順序到最高優先順序：</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>您可以將這想成從全局預設值開始，然後應用機器特定的調整，最後應用專案特定的規則。</p>
<p>接下來，我們將詳細介紹每個配置層級。</p>
<p><strong>(1) 全局配置</strong>：<code translate="no">~/.claude/settings.json</code></p>
<p>全局配置定義 Claude Code 在所有專案中的預設行為。您可在此設定基線權限、啟用外掛程式，以及設定清理行為。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 局部設定</strong>：<code translate="no">~/.claude/settings.local.json</code></p>
<p>本機組態特定於單一電腦。它並不打算共用或檢查到版本控制。這使得它成為 API 金鑰、本機工具或特定環境權限的好地方。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) 專案層級組態</strong>：<code translate="no">project/.claude/settings.json</code></p>
<p>專案層級組態只適用於單一專案，具有最高的優先順序。這是定義在該資源庫工作時應該永遠適用的規則的地方。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>定義了配置層後，下一個問題是<strong>Claude Code 如何在執行時實際解析配置和權限。</strong></p>
<p><strong>Claude Code</strong>在三個層次中應用組態：它從全局預設開始，然後應用特定機器的覆寫，最後應用特定專案的規則。當同樣的設定出現在多個地方時，最特定的設定會優先。</p>
<p>權限遵循固定的評估順序：</p>
<ol>
<li><p><strong>deny</strong>- 永遠攔截</p></li>
<li><p><strong>詢問</strong>- 需要確認</p></li>
<li><p><strong>允許</strong>- 自動執行</p></li>
<li><p><strong>預設</strong>- 僅在沒有符合規則時應用</p></li>
</ol>
<p>這樣既能保持系統預設的安全性，又能給予專案和個別機器所需的靈活性。</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">會話儲存：Claude Code 如何儲存核心互動資料<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>在<strong>Claude Code</strong> 中，會話是資料的核心單位。會話捕捉使用者與 AI 之間的整個互動，包括對話本身、工具呼叫、檔案變更及相關情境。如何儲存會話會直接影響系統的可靠性、可除錯性和整體安全性。</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">每個專案的會話資料都要分開保存</h3><p>一旦定義了會話，下一個問題就是<strong>Claude Code</strong>如何儲存它們，以保持資料的組織性和隔離。</p>
<p><strong>Claude Code</strong>按專案隔離會話資料。每個專案的 session 都儲存在由專案檔案路徑衍生出來的目錄下。</p>
<p>儲存路徑遵循此模式：</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>要建立有效的目錄名稱，特殊字符如<code translate="no">/</code> 、空格和<code translate="no">~</code> 會被<code translate="no">-</code> 取代。</p>
<p>舉例來說：</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>此方法可確保來自不同專案的階段作業資料絕不會混雜，並可依每個專案進行管理或移除。</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">為何使用 JSONL 格式儲存會話</h3><p><strong>Claude Code</strong>使用 JSONL（JSON 行）而非標準 JSON 儲存會話資料。</p>
<p>在傳統的 JSON 檔案中，所有訊息都被綑綁在一個大型結構內，這表示每當檔案有變更時，就必須讀取並重寫整個檔案。相反，JSONL 將每條訊息儲存為檔案中獨立的一行。一行等於一則訊息，沒有外層包裝。</p>
<table>
<thead>
<tr><th>外觀</th><th>標準 JSON</th><th>JSONL (JSON 行)</th></tr>
</thead>
<tbody>
<tr><td>資料的儲存方式</td><td>一個大型結構</td><td>每行一則訊息</td></tr>
<tr><td>何時儲存資料</td><td>通常在最後</td><td>立即，每條訊息</td></tr>
<tr><td>當機影響</td><td>整個檔案可能毀損</td><td>僅影響最後一行</td></tr>
<tr><td>寫入新資料</td><td>重寫整個檔案</td><td>追加一行</td></tr>
<tr><td>記憶體使用量</td><td>載入所有內容</td><td>逐行讀取</td></tr>
</tbody>
</table>
<p>JSONL 在幾個關鍵方面運作得更好：</p>
<ul>
<li><p><strong>立即儲存：</strong>每條訊息一產生就會寫入磁碟，而不是等待會話結束。</p></li>
<li><p><strong>抗當機：</strong>如果程式當機，只有最後一則未完成的訊息可能會遺失。之前寫入的所有內容都會保持完整。</p></li>
<li><p><strong>快速追加：</strong>新的訊息會新增到檔案的末端，而不需要讀取或重寫現有的資料。</p></li>
<li><p><strong>記憶體使用量低：</strong>會話檔案可一次讀取一行，因此不需要將整個檔案載入記憶體。</p></li>
</ul>
<p>簡化的 JSONL 會話檔案看起來像這樣：</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">會話訊息類型</h3><p>會話檔案記錄了與 Claude Code 互動期間發生的所有事情。為了清楚地完成這項工作，它針對不同種類的事件使用不同的訊息類型。</p>
<ul>
<li><p><strong>使用者訊息</strong>代表進入系統的新輸入。這不僅包括使用者所輸入的內容，也包括工具所傳回的結果，例如 shell 指令的輸出。從 AI 的觀點來看，這兩者都是它需要回應的輸入。</p></li>
<li><p><strong>助理訊息會</strong>捕捉 Claude 所做的回應。這些訊息包括 AI 的推理、它所產生的文字，以及它決定使用的任何工具。它們也會記錄使用細節，例如代幣數量，以提供互動的完整畫面。</p></li>
<li><p><strong>檔案歷史快照</strong>是 Claude 修改任何檔案前所建立的安全檢查點。Claude Code 藉由先儲存原始檔案狀態，可以在發生問題時撤銷變更。</p></li>
<li><p><strong>摘要</strong>提供會話的簡明概述，並與最終結果連結。它們讓您更容易瞭解會話的內容，而不需要重播每個步驟。</p></li>
</ul>
<p>這些訊息類型不僅會記錄對話，還會記錄會話期間發生的所有動作和效果。</p>
<p>為了讓這一點更具體，讓我們來看看使用者訊息和助理訊息的具體範例。</p>
<p><strong>(1) 使用者訊息範例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 助理訊息範例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">會話訊息如何連結</h3><p>Claude Code 不會將會話訊息儲存為獨立的項目。相反，它將訊息連結在一起，形成一連串清晰的事件。每條訊息都包含一個獨特的識別碼 (<code translate="no">uuid</code>) 以及之前訊息的參照 (<code translate="no">parentUuid</code>)。這樣不僅可以看到發生了什麼，也可以看到發生的原因。</p>
<p>會話由使用者訊息開始，而使用者訊息則是會話鏈的起點。Claude 的每個回覆都會指向引起回覆的訊息。工具呼叫及其輸出也是以同樣的方式加入，每一步驟都與之前的步驟連結。當會話結束時，摘要會附加到最終訊息。</p>
<p>由於每個步驟都連結在一起，Claude Code 可以重播完整的動作順序，瞭解結果是如何產生的，讓除錯和分析變得更容易。</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">利用檔案快照讓程式碼變更容易復原<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>AI 產生的編輯不一定總是正確的，有時甚至會走向完全錯誤的方向。為了讓這些變更可以安全地進行實驗，Claude Code 使用一個簡單的快照系統，讓您可以撤銷編輯，而不需要翻查差異或手動清理檔案。</p>
<p>這個想法很簡單：<strong>在 Claude Code 修改檔案之前，它會儲存原始內容的複本。</strong>如果編輯結果是錯誤的，系統可以立即還原先前的版本。</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">什麼是<em>檔案歷史快照</em>？</h3><p><em>檔案歷史快照</em>是在檔案修改前建立的檢查點。它會記錄<strong>Claude</strong>即將編輯的每個檔案的原始內容。這些快照可作為撤消和回滾作業的資料來源。</p>
<p>當使用者傳送可能會變更檔案的訊息時，<strong>Claude Code</strong>會為該訊息建立一個空快照。在編輯之前，系統會將每個目標檔案的原始內容備份到快照中，然後將編輯內容直接套用到磁碟上。如果使用者觸發<em>撤消</em>，<strong>Claude Code</strong>會還原已儲存的內容，並覆寫修改過的檔案。</p>
<p>實際上，可撤銷編輯的生命週期如下：</p>
<ol>
<li><p><strong>使用者傳送訊息Claude</strong>Code 建立一個新的、空的<code translate="no">file-history-snapshot</code> 記錄。</p></li>
<li><p><strong>Claude 準備修改檔案</strong>系統識別哪些檔案會被編輯，並將其原始內容備份到<code translate="no">trackedFileBackups</code> 。</p></li>
<li><p><strong>Claude 執行編輯執行編輯</strong>和寫入操作，並將修改後的內容寫入磁碟。</p></li>
<li><p><strong>使用者觸發撤消</strong>使用者按下<strong>Esc + Esc</strong>，示意要還原變更。</p></li>
<li><p><strong>還原原始內容Claude</strong>Code 從<code translate="no">trackedFileBackups</code> 讀取儲存的內容，並覆寫目前的檔案，完成撤消。</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">為什麼撤消有效？快照儲存舊版本</h3><p>Claude Code 中的撤消之所以有效，是因為系統會在任何編輯發生之前儲存<em>原始</em>檔案內容。</p>
<p>Claude Code 並非在事後才嘗試逆轉變更，而是採取更簡單的方法：它複製檔案在修改<em>前</em>的內容，並將該複本儲存在<code translate="no">trackedFileBackups</code> 中。當使用者觸發撤消時，系統會還原這個儲存的版本，並覆寫已編輯的檔案。</p>
<p>下圖逐步顯示此流程：</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header"><em>檔案歷史快照的</em>內部外觀</h3><p>快照本身儲存為結構化記錄。它擷取使用者訊息的元資料、快照的時間，以及最重要的檔案與原始內容的對應圖。</p>
<p>以下範例顯示 Claude 編輯任何檔案前建立的單一<code translate="no">file-history-snapshot</code> 記錄。<code translate="no">trackedFileBackups</code> 中的每個項目會儲存檔案<em>編輯前</em>的內容，這些內容稍後可用於在撤銷過程中還原檔案。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">快照的儲存位置及保存時間</h3><ul>
<li><p><strong>快照元資料的儲存位置</strong>：快照記錄會綁定到特定的階段，並儲存在<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code> 下的 JSONL 檔案。</p></li>
<li><p><strong>備份原始檔案內容的位置</strong>：每個檔案編輯前的內容會以內容切細值單獨儲存於<code translate="no">~/.claude/file-history/{content-hash}/</code> 。</p></li>
<li><p><strong>預設快照保留多久</strong>：快照資料保留 30 天，與全域<code translate="no">cleanupPeriodDays</code> 設定一致。</p></li>
<li><p><strong>如何變更保留期限</strong>：保留天數可透過<code translate="no">~/.claude/settings.json</code> 中的<code translate="no">cleanupPeriodDays</code> 欄位調整。</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">相關指令</h3><table>
<thead>
<tr><th>指令/動作</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>撤消最近一輪的檔案編輯 (最常用)</td></tr>
<tr><td>/rewind</td><td>回復到先前指定的檢查點（快照）</td></tr>
<tr><td>/diff</td><td>檢視目前檔案與快照備份之間的差異</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">其他重要目錄<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - 外掛程式管理</strong></p>
<p><code translate="no">plugins/</code> 目錄儲存給予 Claude Code 額外能力的附加元件。</p>
<p>此目錄會儲存已安裝的<em>外掛</em>程式、外掛程式的來源，以及這些外掛程式提供的額外技能。它也保存下載的外掛程式的本機複本，因此不需要再次取得。</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - 儲存和應用技能的地方</strong></p>
<p>在 Claude Code 中，技能是一種小型、可重複使用的能力，可協助 Claude 執行特定任務，例如處理 PDF、編輯文件或遵循編碼工作流程。</p>
<p>並非所有技能在任何地方都可用。有些是全球適用的，有些則僅限於單一專案或由外掛程式提供。Claude Code 將技能儲存在不同的位置，以控制每個技能的使用位置。</p>
<p>下面的層級結構顯示技能如何按範圍分層，從全球可用的技能到專案特定的技能以及外掛程式提供的技能。</p>
<table>
<thead>
<tr><th>層級</th><th>儲存位置</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>使用者</td><td>~/.claude/skills/</td><td>全球可用，所有專案都可存取</td></tr>
<tr><td>專案</td><td>project/.claude/skills/</td><td>僅當前專案可用，專案特有的自訂功能</td></tr>
<tr><td>外掛程式</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>與外掛一起安裝，取決於外掛啟用狀態</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - 任務清單儲存</strong></p>
<p><code translate="no">todos/</code> 目錄儲存 Claude 為追蹤會談中的工作而建立的任務清單，例如待完成的步驟、進行中的項目和已完成的任務。</p>
<p>任務清單以 JSON 檔案形式儲存於<code translate="no">~/.claude/todos/{session-id}-*.json</code> 。每個檔案名稱都包含會話 ID，可將任務清單連結到特定的會談。</p>
<p>這些檔案的內容來自<code translate="no">TodoWrite</code> 工具，包括基本的任務資訊，例如任務描述、目前狀態、優先順序和相關的元資料。</p>
<p><strong>(4) local/ - 本機執行時間與工具</strong></p>
<p><code translate="no">local/</code> 目錄存放 Claude Code 在您的機器上執行所需的核心檔案。</p>
<p>這包括<code translate="no">claude</code> 指令行可執行檔，以及包含其執行時依賴項的<code translate="no">node_modules/</code> 目錄。透過保持這些元件在本地，Claude Code 可以獨立執行，而不需依賴外部服務或系統安裝。</p>
<p><strong>（5）其他支援目錄</strong></p>
<ul>
<li><p><strong>shell-snapshots/：</strong>儲存 shell 會話狀態快照 (例如目前目錄與環境變數)，可讓 shell 操作回溯。</p></li>
<li><p><strong>plans/：</strong>儲存由計劃模式產生的執行計劃 (例如，多步驟程式工作的分步細目)。</p></li>
<li><p><strong>statsig/：</strong>快取功能旗標設定 (例如是否啟用新功能)，以減少重複請求。</p></li>
<li><p><strong>telemetry/：</strong>儲存匿名的遙測資料 (例如功能使用頻率)，用於產品最佳化。</p></li>
<li><p><strong>debug/：</strong>儲存除錯紀錄 (包括錯誤堆疊和執行追蹤)，以協助排除故障。</p></li>
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
    </button></h2><p>在深入瞭解 Claude Code 如何在本機儲存和管理所有內容之後，我們可以清楚地看到：這個工具之所以感覺穩定，是因為它的基礎非常穩固。沒有什麼花俏的東西 - 只有深思熟慮的工程。每個專案都有自己的空間，每個動作都會寫下來，檔案編輯也會在任何變更之前備份。這樣的設計可以讓你專注於自己的工作。</p>
<p>我最喜歡的是這裡沒有任何神秘的東西。Claude Code 之所以運作良好，是因為基本工作都做得很好。如果你曾經嘗試建立一個會接觸到真實檔案的代理程式，你就會知道事情有多容易崩潰 - 狀態會混亂、當機會抹殺進度、撤消會變成猜測。Claude Code 擁有簡單、一致且難以破解的儲存模型，可避免上述情況發生。</p>
<p>對於建置本機或 on-prem AI 代理的團隊而言，尤其是在安全的環境中，這種方法顯示了強大的儲存與持久性如何讓 AI 工具在日常開發中變得可靠且實用。</p>
<p>如果您正在設計本地或 on-prem AI 代理，並想要更詳細地討論儲存架構、會話設計或安全回滾，歡迎加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>預約 20 分鐘的一對一個案，以獲得個人化的指導。</p>
