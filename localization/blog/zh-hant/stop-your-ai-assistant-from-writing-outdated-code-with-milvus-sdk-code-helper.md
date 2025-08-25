---
id: >-
  stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
title: 使用 Milvus SDK 程式碼助手，阻止您的 AI 助手撰寫過時的程式碼
author: 'Cheney Zhang, Stacy Li'
date: 2025-08-22T00:00:00.000Z
desc: 設定 Milvus SDK Code Helper 的逐步教學，以阻止 AI 助手產生過時的程式碼，並確保最佳實務。
cover: >-
  assets.zilliz.com/stop_your_ai_assistant_from_writing_outdated_code_with_milvus_sdk_code_helper_min_64fa8d3396.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus SDK Code Helper, AI coding assistant, MCP server, vibe coding, pymilvus'
meta_title: |
  Milvus SDK Code Helper Tutorial: Fix AI Outdated Code
origin: >-
  https://milvus.io/blog/stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
---
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding 正在改變我們編寫軟體的方式。Cursor 和 Windsurf 等工具讓開發工作變得毫不費力且直覺--要求一個函數，就能得到一個片段；需要快速的 API 呼叫，在您輸入完之前就已經產生。這樣的承諾是流暢、無縫的開發，您的 AI 助理可以預測您的需求，並提供您想要的東西。</p>
<p>但是，這個美麗的流程卻有一個重要的缺點：AI 助手經常產生過時的程式碼，而這些程式碼會在生產過程中斷開。</p>
<p>考慮這個例子：我要求 Cursor 產生 Milvus 連線程式碼，它產生了這個：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>這曾經運作得很好，但目前的 pymilvus SDK 建議所有連線和操作都使用<code translate="no">MilvusClient</code> 。舊方法已不再被視為最佳實務，然而 AI 助手仍繼續建議使用舊方法，因為他們的訓練資料通常已過時數月或數年。</p>
<p>儘管 Vibe Coding 工具取得了這麼多進展，開發人員仍要花費大量時間來銜接已產生的程式碼與生產就緒的解決方案之間的「最後一哩路」。氛圍是有了，但準確性卻沒有。</p>
<h3 id="What-is-the-Milvus-SDK-Code-Helper" class="common-anchor-header">Milvus SDK Code Helper 是什麼？</h3><p><strong>Milvus SDK Code Helper</strong>是以開發人員為中心的解決方案，可解決 Vibe Coding 的<em>「最後一哩」</em>問題 - 縮短 AI 輔助編碼與可投入生產的 Milvus 應用程式之間的差距。</p>
<p>它的核心是<strong>模型上下文協定 (Model Context Protocol, MCP) 伺服器</strong>，可將您的 AI 驅動 IDE 直接連接到最新的 Milvus 官方文件。結合 Retrieval-Augmented Generation (RAG)，可確保您的助理所產生的程式碼永遠是精確、最新且符合 Milvus 最佳實務的。</p>
<p>取代過時的片段或臆測，您可以在您的開發工作流程中直接獲得上下文感知、符合標準的程式碼建議。</p>
<p><strong>主要優點：</strong></p>
<ul>
<li><p><strong>一次設定，永遠提升效率</strong>：只需設定一次，即可享受持續更新的程式碼生成</p></li>
<li><p><strong>總是最新的</strong>：存取最新的官方 Milvus SDK 文件</p></li>
<li><p><strong>提高程式碼品質</strong>：生成遵循當前最佳實踐的代碼</p></li>
<li><p>🌊<strong>恢復流程</strong>：保持您的 Vibe Coding 體驗順暢無阻</p></li>
</ul>
<p><strong>三個工具合一</strong></p>
<ol>
<li><p><code translate="no">pymilvus-code-generator</code> → 快速為 Milvus 常見任務撰寫 Python 程式碼 (例如：建立集合、插入資料、執行向量搜尋)</p></li>
<li><p><code translate="no">orm-client-code-converter</code> → 以最新的 語法取代過時的 ORM 模式，將傳統的 Python 程式碼現代化。<code translate="no">MilvusClient</code> </p></li>
<li><p><code translate="no">language-translator</code> → 在不同語言之間無縫轉換 Milvus SDK 程式碼（例如，Python ↔ TypeScript）。</p></li>
</ol>
<p>查看以下資源以瞭解更多詳情：</p>
<ul>
<li><p>部落格：<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">為什麼您的 Vibe 程式碼會產生過時的程式碼，以及如何使用 Milvus MCP 修復它 </a></p></li>
<li><p>文件：<a href="https://milvus.io/docs/milvus-sdk-helper-mcp.md#Quickstart">Milvus SDK 程式碼助手指南 | Milvus 文件</a></p></li>
</ul>
<h3 id="Before-You-Begin" class="common-anchor-header">開始之前</h3><p>在進入設定過程之前，讓我們先檢視 Code Helper 在實作上的顯著差異。下面的比較顯示了相同的建立 Milvus 集合的請求如何產生完全不同的結果：</p>
<table>
<thead>
<tr><th><strong>啟用 MCP Code Helper：</strong></th><th><strong>MCP Code Helper Disabled：</strong></th></tr>
</thead>
<tbody>
<tr><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_enabled_fcb94737fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_disabled_769db4faee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td></tr>
</tbody>
</table>
<p>這完美地說明了核心問題：如果沒有 Code Helper，即使是最先進的 AI 助手，也會使用不再推薦的過時 ORM SDK 模式產生程式碼。Code Helper 可確保您每次都能獲得最新、最有效率且官方認可的實作。</p>
<p><strong>實作上的差異：</strong></p>
<ul>
<li><p><strong>現代方法</strong>：使用當前最佳實作的乾淨、可維護代碼</p></li>
<li><p><strong>已廢棄的方式</strong>：可運作但遵循過時模式的程式碼</p></li>
<li><p><strong>對生產的影響</strong>：目前的程式碼更有效率、更容易維護，而且面向未來</p></li>
</ul>
<p>本指南將引導您在多種 AI IDE 和開發環境中設定 Milvus SDK Code Helper。設定過程簡單直接，每個 IDE 通常只需花費幾分鐘。</p>
<h2 id="Setting-Up-the-Milvus-SDK-Code-Helper" class="common-anchor-header">設定 Milvus SDK Code Helper<button data-href="#Setting-Up-the-Milvus-SDK-Code-Helper" class="anchor-icon" translate="no">
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
    </button></h2><p>以下各節提供各支援 IDE 和開發環境的詳細設定指示。請選擇與您偏好的開發設定相對應的部分。</p>
<h3 id="Cursor-IDE-Setup" class="common-anchor-header">Cursor IDE 設定</h3><p>Cursor 透過其內建的組態系統提供與 MCP 伺服器的無縫整合。</p>
<p><strong>步驟 1：存取 MCP 設定</strong></p>
<p>導航至設定 → Cursor 設定 → 工具與整合 → 新增全局 MCP 伺服器</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cursor_mcp_configuration_interface_9ff0b7dcb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
<em>光標 MCP 配置介面</em></p>
<p><strong>步驟 2：配置 MCP 伺服器</strong></p>
<p>您有兩個配置選項：</p>
<p><strong>選項 A：全局配置（推薦）</strong></p>
<p>將下列配置新增至您的 Cursor<code translate="no">~/.cursor/mcp.json</code> 檔案：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>選項 B：專案特定組態</strong></p>
<p>在您的專案資料夾中建立<code translate="no">.cursor/mcp.json</code> 檔案，配置與上述相同。</p>
<p>如需其他配置選項和疑難排解，請參閱<a href="https://docs.cursor.com/context/model-context-protocol"> Cursor MCP 文件</a>。</p>
<h3 id="Claude-Desktop-Setup" class="common-anchor-header">Claude 桌面設置</h3><p>Claude Desktop 透過其組態系統提供直接的 MCP 整合。</p>
<p><strong>步驟 1：找到組態檔案</strong></p>
<p>在 Claude Desktop 配置文件中添加以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 2：重新啟動 Claude Desktop</strong></p>
<p>儲存設定後，重新啟動 Claude Desktop 以啟用新的 MCP 伺服器。</p>
<h3 id="Claude-Code-Setup" class="common-anchor-header">Claude Code 設定</h3><p>Claude Code 提供 MCP 伺服器的指令列設定，非常適合喜歡以終端機為基礎設定的開發人員。</p>
<p><strong>步驟 1：透過命令列新增 MCP 伺服器</strong></p>
<p>在您的終端機執行以下指令：</p>
<pre><code translate="no">claude mcp add-json sdk-code-helper --json &#x27;{
  &quot;url&quot;: &quot;https://sdk.milvus.io/mcp/&quot;,
  &quot;headers&quot;: {
    &quot;Accept&quot;: &quot;text/event-stream&quot;
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 2：驗證安裝</strong></p>
<p>執行該命令後，MCP 伺服器將自動設定，並可立即使用。</p>
<h3 id="Windsurf-IDE-Setup" class="common-anchor-header">Windsurf IDE 設定</h3><p>Windsurf 透過其基於 JSON 的設定系統支援 MCP 設定。</p>
<p><strong>步驟 1: 存取 MCP 設定</strong></p>
<p>將下列設定新增至 Windsurf MCP 設定檔：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 2：套用設定</strong></p>
<p>儲存設定檔並重新啟動 Windsurf 以啟動 MCP 伺服器。</p>
<h3 id="VS-Code-Setup" class="common-anchor-header">VS Code 設定</h3><p>VS Code 整合需要 MCP 相容的擴充套件才能正常運作。</p>
<p><strong>步驟 1: 安裝 MCP 擴充套件</strong></p>
<p>確保您已在 VS Code 中安裝 MCP 相容的擴充套件。</p>
<p><strong>步驟 2：配置 MCP 伺服器</strong></p>
<p>在您的 VS Code MCP 設定中加入以下配置：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Cherry-Studio-Setup" class="common-anchor-header">Cherry Studio 設定</h3><p>Cherry Studio 為 MCP 伺服器設定提供友善的圖形化介面，讓喜愛視覺化設定流程的開發人員也能使用。</p>
<p><strong>步驟 1：存取 MCP 伺服器設定</strong></p>
<p>透過 Cherry Studio 介面導覽到設定 → MCP 伺服器 → 新增伺服器。</p>
<p><strong>步驟 2：配置伺服器詳細信息</strong></p>
<p>在伺服器配置表單中填寫以下資訊：</p>
<ul>
<li><p><strong>名稱</strong>：<code translate="no">sdk code helper</code></p></li>
<li><p><strong>類型</strong>：<code translate="no">Streamable HTTP</code></p></li>
<li><p><strong>URL</strong>：<code translate="no">https://sdk.milvus.io/mcp/</code></p></li>
<li><p><strong>標頭</strong>：<code translate="no">&quot;Accept&quot;: &quot;text/event-stream&quot;</code></p></li>
</ul>
<p><strong>步驟 3：儲存並啟動</strong></p>
<p>點擊 「保存 」激活服務器配置。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cherry_studio_mcp_configuration_interface_b7dce8b26d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cherry Studio MCP 設定介面</em></p>
<h3 id="Cline-Setup" class="common-anchor-header">Cline 設定</h3><p>Cline 使用基於 JSON 的配置系統，可透過其介面存取。</p>
<p><strong>步驟 1：存取 MCP 設定</strong></p>
<ol>
<li><p>打開 Cline 並點擊頂部導航欄中的 MCP 伺服器圖標</p></li>
<li><p>選擇已安裝索引標籤</p></li>
<li><p>按一下進階 MCP 設定</p></li>
</ol>
<p><strong>步驟 2：編輯組態檔案</strong>在<code translate="no">cline_mcp_settings.json</code> 檔案中，新增下列組態：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 3：儲存並重新啟動</strong></p>
<p>儲存組態檔案，並重新啟動 Cline 以套用變更。</p>
<h3 id="Augment-Setup" class="common-anchor-header">Augment 設定</h3><p>Augment 可透過其進階設定面板存取 MCP 設定。</p>
<p><strong>步驟 1：存取設定</strong></p>
<ol>
<li><p>按 Cmd/Ctrl + Shift + P 或瀏覽 Augment 面板中的漢堡功能表</p></li>
<li><p>選擇「編輯設定</p></li>
<li><p>在「進階」下，按一下 settings.json 中的「編輯」。</p></li>
</ol>
<p><strong>步驟 2：新增伺服器組態</strong></p>
<p>將伺服器組態新增至<code translate="no">augment.advanced</code> 物件中的<code translate="no">mcpServers</code> 陣列：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Gemini-CLI-Setup" class="common-anchor-header">Gemini CLI 設定</h3><p>Gemini CLI 需要透過 JSON 設定檔進行手動設定。</p>
<p><strong>步驟 1：建立或編輯設定檔案</strong></p>
<p>在您的系統上建立或編輯<code translate="no">~/.gemini/settings.json</code> 檔案。</p>
<p><strong>步驟 2：新增設定</strong></p>
<p>將以下設定插入設定檔：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 3：套用變更</strong></p>
<p>儲存檔案並重啟 Gemini CLI 以套用組態變更。</p>
<h3 id="Roo-Code-Setup" class="common-anchor-header">Roo Code 設定</h3><p>Roo Code 利用集中式 JSON 配置文件管理 MCP 伺服器。</p>
<p><strong>步驟 1：存取全局設定</strong></p>
<ol>
<li><p>開啟 Roo Code</p></li>
<li><p>導覽到設定 → MCP 伺服器 → 編輯全局組態</p></li>
</ol>
<p><strong>步驟 2：編輯組態檔案</strong></p>
<p>在<code translate="no">mcp_settings.json</code> 檔案中，新增下列組態：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 3：啟動伺服器</strong></p>
<p>儲存檔案以自動啟動 MCP 伺服器。</p>
<h3 id="Verification-and-Testing" class="common-anchor-header">驗證與測試</h3><p>完成所選 IDE 的設定後，您可以透過以下方式驗證 Milvus SDK Code Helper 是否正常運作：</p>
<ol>
<li><p><strong>測試程式碼產生</strong>：請您的 AI 助手產生 Milvus 相關程式碼，並觀察它是否使用目前的最佳實務。</p></li>
<li><p><strong>檢查文件存取</strong>：請求關於特定 Milvus 功能的資訊，以確保助手提供最新的回應</p></li>
<li><p><strong>比較結果</strong>：在有和沒有人工智能助手的情況下生成相同的代碼請求，以查看代碼質量和最新性的差異。</p></li>
</ol>
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
    </button></h2><p>透過設定 Milvus SDK 代碼輔助程式，您已經朝向未來的開發邁出了重要的一步 - AI 協助程式不僅能產生快速的代碼，還能產生<strong>精確且最新的代碼</strong>。我們不再依賴過時的靜態訓練資料，而是朝向動態、即時的知識系統邁進，這些知識系統會隨著其支援的技術而演進。</p>
<p>隨著人工智能編碼輔助工具變得越來越複雜，擁有最新知識的工具與沒有最新知識的工具之間的差距只會越來越大。Milvus SDK Code Helper 只是一個開始，我們期待看到其他主要技術和框架也有類似的專門知識伺服器。未來屬於能夠利用 AI 的速度，同時確保準確性和即時性的開發人員。現在您已具備這兩項能力。</p>
