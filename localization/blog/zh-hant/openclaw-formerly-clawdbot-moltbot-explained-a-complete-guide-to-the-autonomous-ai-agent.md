---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: OpenClaw (Formerly Clawdbot &amp; Moltbot) 解讀：自主式 AI 代理完全指南
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: OpenClaw (Clawdbot/Moltbot) 完整指南 - 如何運作、設定步驟、使用案例、Moltbook 及安全警告。
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a>(以前稱為 Moltbot 和 Clawdbot) 是一個開放原始碼的 AI 代理程式，可在您的機器上執行，透過您已使用的訊息應用程式 (WhatsApp、Telegram、Slack、Signal 等) 連線，並代表您採取行動 - shell 指令、瀏覽器自動化、電子郵件、行事曆和檔案操作。心跳調度程式會以可設定的間隔喚醒它，因此無需提示即可執行。OpenClaw 在 2026 年 1 月底推出後，不到一個星期就獲得超過<a href="https://github.com/openclaw/openclaw">100,000 個</a>GitHub stars，成為 GitHub 歷史上成長最快的開放原始碼套件庫之一。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClaw 的與眾不同之處在於它的組合：MIT 授權、開放源碼、本機優先（記憶體與資料儲存在磁碟上的 Markdown 檔案），並透過可移植的技能格式進行社群擴充。這也是一些更有趣的人工智慧代理實驗發生的地方 - 一位開發者的代理在他睡覺的時候透過電子郵件協商買車減價 4,200 美元；另一位開發者在沒有被要求的情況下對保險拒絕提出法律反駁；另一位使用者建立了<a href="https://moltbook.com/">Moltbook</a>，一個有超過一百萬個人工智慧代理在人類監視下自主互動的社群網路。</p>
<p>本指南將詳細說明您需要知道的一切：OpenClaw 是什麼、它如何運作、它在現實生活中可以做什麼、它與 Moltbook 的關係，以及與它相關的安全風險。</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">OpenClaw 是什麼？<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a>(前身為 Clawdbot 和 Moltbot) 是一個自主的開放原始碼 AI 助理，可在您的機器上執行，並存在於您的聊天應用程式中。您可以透過 WhatsApp、Telegram、<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>、Discord、iMessage 或 Signal 與它對話，無論您已經在使用什麼，它都會回覆您。但與 ChatGPT 或 Claude 的網頁介面不同，OpenClaw 不只是回答問題。它可以執行 shell 指令、控制您的瀏覽器、讀取及寫入檔案、管理您的行事曆，以及傳送電子郵件，這些都是由文字訊息所觸發的。</p>
<p>OpenClaw 專為開發人員和需要個人 AI 助理的強大使用者打造，讓他們可以隨時隨地傳送訊息，而無需犧牲對資料的控制或依賴託管服務。</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">OpenClaw 的主要功能</h3><ul>
<li><p><strong>多管道閘道</strong>- WhatsApp、Telegram、Discord 和 iMessage 只需單一閘道程序。使用擴充套件新增 Mattermost 及其他功能。</p></li>
<li><p><strong>多代理路由</strong>- 每個代理、工作區或傳送者的獨立會話。</p></li>
<li><p><strong>媒體支援</strong>- 傳送及接收影像、音訊及文件。</p></li>
<li><p><strong>Web Control UI</strong>- 瀏覽器儀表板，用於聊天、配置、會話和節點。</p></li>
<li><p><strong>行動節點</strong>- 搭配支援 Canvas 的 iOS 與 Android 節點。</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">是什麼讓 OpenClaw 與眾不同？</h3><p><strong>OpenClaw 是自行託管的。</strong></p>
<p>OpenClaw 的閘道、工具和記憶體都在您的機器上，而不是在供應商託管的 SaaS 中。OpenClaw 將會話、長期記憶與技術儲存為純 Markdown 與 YAML 檔案，並儲存在您的工作區與<code translate="no">~/.openclaw</code> 。您可以使用任何文字編輯器檢查這些檔案，也可以使用 Git 備份、grep 或刪除這些檔案。AI 模型可以是雲端託管 (Anthropic、OpenAI、Google) 或本機 (透過 Ollama、LM Studio 或其他 OpenAI 相容的伺服器)，這取決於您如何設定模型區塊。如果您希望所有推論都留在您的硬體上，您就只能將 OpenClaw 指向本機模型。</p>
<p><strong>OpenClaw 是完全自主的</strong></p>
<p>閘道以後台監控程式 (<code translate="no">systemd</code> on Linux,<code translate="no">LaunchAgent</code> on macOS) 的方式執行，並可設定心跳時間 - 預設為每 30 分鐘一次，Anthropic OAuth 則為每小時一次。每次心跳時，代理程式會從<code translate="no">HEARTBEAT.md</code> 讀取工作區中的檢查清單，決定是否有任何項目需要採取行動，並發送訊息給您或回應<code translate="no">HEARTBEAT_OK</code> （Gateway 會默默地丟棄）。外部事件 - webhooks、cron 工作、隊友訊息 - 也會觸發代理程式循環。</p>
<p>代理擁有多少自主權是一項設定選擇。工具政策和執行核准可管理高風險的動作：您可能允許讀取電子郵件，但在傳送前需要核准；允許讀取檔案，但阻止刪除。停用這些防護措施，它就會不問自來地執行。</p>
<p><strong>OpenClaw 是開放原始碼。</strong></p>
<p>核心 Gateway 已獲得 MIT 授權。它是完全可讀、可分叉及可稽核的。這在背景上很重要：Anthropic 曾針對一位對 Claude Code 客戶端進行解碼的開發者提出 DMCA takedown；OpenAI 的 Codex CLI 是 Apache 2.0，但網頁 UI 和模型是封閉的；Manus 則是完全封閉的。</p>
<p>生態系統反映了開放性。<a href="https://github.com/openclaw/openclaw">數以百計的貢獻者</a>已經建立了技能 - 包含 YAML frontmatter 與自然語言指令的模組化<code translate="no">SKILL.md</code> 檔案 - 透過 ClawHub (代理程式可以自動搜尋的技能註冊處)、社群儲存庫或直接 URL 來分享。此格式是可移植的，與 Claude Code 和 Cursor 慣例相容。如果技能不存在，您可以向代理描述任務，然後讓代理起草一個。</p>
<p>這種結合本地擁有權、社群驅動演進以及自主運作的方式，正是開發人員感到興奮的原因。對於想要完全控制 AI 工具的開發人員而言，這點非常重要。</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">OpenClaw 如何在引擎蓋下運作<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>一個進程，一切都在裡面</strong></p>
<p>當您執行<code translate="no">openclaw gateway</code> 時，您會啟動一個稱為 Gateway 的長期 Node.js 程序。這個進程就是整個系統 - 通道連線、會話狀態、代理程式循環、模型呼叫、工具執行、記憶體持久化。沒有獨立的服務需要管理。</p>
<p>一個進程內有五個子系統：</p>
<ol>
<li><p><strong>通道適配器</strong>- 每個平台一個 (WhatsApp 的 Baileys、Telegram 的 grammY 等)。將傳入的訊息規範化為共通格式；將回覆序列化。</p></li>
<li><p><strong>會話管理員</strong>- 解析寄件者身份和對話內容。DM 歸入一個主會話；群組聊天則有自己的會話。</p></li>
<li><p><strong>佇列</strong>- 序列化每個會話的執行。如果有訊息在執行中途到達，它會保留、注入或收集訊息，以備後續使用。</p></li>
<li><p><strong>代理程式執行時</strong>- 集合上下文 (AGENTS.md、SOUL.md、TOOLS.md、MEMORY.md、每日記錄、對話歷史)，然後執行代理程式循環：呼叫模型 → 執行工具呼叫 → 輸回結果 → 重複直到完成。</p></li>
<li><p><strong>控制平面</strong>-<code translate="no">:18789</code> 上的 WebSocket API。CLI、macOS 應用程式、Web UI 和 iOS/Android 節點都在此連接。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>模型是一個外部 API 呼叫，可能在本機執行，也可能不在本機執行。其他一切 - 路由、工具、記憶體、狀態 - 都存在於您機器上的那一個進程中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>對於簡單的請求，這個迴圈會在幾秒內完成。多步工具鏈則需要較長時間。模型是一個外部 API 呼叫，可能在本機執行，也可能不在本機執行，但其他一切 - 路由、工具、記憶體、狀態 - 都在您機器上的那一個進程中。</p>
<p><strong>與 Claude 程式碼相同的循環，不同的 Shell</strong></p>
<p>代理程式循環 - 輸入 → 上下文 → 模型 → 工具 → 重複 → 回覆 - 與 Claude Code 使用的模式相同。每個嚴肅的代理程式框架都運行它的某些版本。不同之處在於如何包裝它。</p>
<p>Claude Code 將它包裝在<strong>CLI</strong> 中：您輸入，它執行，它退出。OpenClaw 則是將它包裝成一個與 12 個以上的訊息傳輸平台連線的<strong>持久性 daemon</strong>，具有心跳排程器、跨頻道的會話管理，以及在執行間持續存在的記憶體 - 即使您不在辦公桌上也是如此。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>模型路由與故障移轉</strong></p>
<p>OpenClaw 與模型無關。您可以在<code translate="no">openclaw.json</code> 中設定提供者，而閘道會依此進行路由 - 當提供者宕機時，閘道會使用 auth profile 輪流和使用指數回報的備援鏈。但是模型的選擇很重要，因為 OpenClaw 會組合大量的提示：系統指令、會話歷史、工具模式、技能和記憶體。這種情境負載是大多數部署使用前沿模型作為主要協調器的原因，而較便宜的模型則處理心跳和子代理任務。</p>
<p><strong>雲端與本地的權衡</strong></p>
<p>從 Gateway 的角度來看，雲端與本地模式看起來是完全相同的 - 它們都是 OpenAI 相容的端點。不同之處在於權衡。</p>
<p>雲端模型 (Anthropic、OpenAI、Google) 提供強大的推理能力、大型情境視窗以及可靠的工具使用。它們是主要協調器的預設選擇。成本隨使用量調整：輕度使用者花費 5-20 美元/月，頻繁心跳和大量提示的主動式代理通常花費 50-150 美元/月，未經優化的強大使用者則報稱帳單高達數千美元。</p>
<p>透過 Ollama 或其他與 OpenAI 相容的伺服器建立的本機模型，可以省去每個代幣的成本，但需要硬體，而 OpenClaw 至少需要 64K 的上下文代幣，這縮窄了可行的選擇範圍。在 14B 的參數下，模型可以處理簡單的自動化，但對於多步驟的代理任務而言，就顯得微不足道；社群經驗認為可靠的門檻在 32B 以上，至少需要 24GB 的 VRAM。您在推理或延伸情境上無法與前沿雲端模型相提並論，但您可以獲得完整的資料位置性與可預測的成本。</p>
<p><strong>此架構的優點</strong></p>
<p>由於一切都透過單一程序執行，因此 Gateway 是單一控制面。呼叫何種模型、允許使用何種工具、包含多少上下文、賦予多少自主權 - 全都在一個地方設定。通道與模型脫勾：將 Telegram 交換成 Slack 或 Claude 交換成 Gemini，其他都不會改變。頻道布線、工具和記憶體都保留在您的基礎架構中，而模型則是您向外指向的依賴。</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">執行 OpenClaw 究竟需要哪些硬體？</h3><p>在一月下旬，開發人員開箱多台 Mac Minis 的貼文廣為流傳，其中一位使用者在桌上貼了 40 台。甚至 Google DeepMind 的 Logan Kilpatrick 也發帖表示要訂購一台，但實際的硬體需求卻比較低。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>官方文件列出的最低要求是 2GB 記憶體和 2 個 CPU 核心來進行基本聊天，如果您想要瀏覽器自動化，則需要 4GB。5 美元/月的 VPS 就可以處理得很好。您也可以使用 Pulumi 部署在 AWS 或 Hetzner 上，在小型 VPS 上以 Docker 執行，或使用塵封的舊筆記型電腦。Mac Mini 趨勢的驅動力來自社會證明，而非技術需求。</p>
<p><strong>那麼人們為什麼要購買專用硬體？兩個原因：隔離和持久性。</strong>當您給予自主代理程式 shell 存取權限時，您需要的是一台在發生問題時可以實體拔除的機器。由於 OpenClaw 是以心跳的方式執行 - 在可設定的排程中喚醒，以代表您行事 - 因此專用裝置代表它永遠開啟，永遠準備就緒。這樣的優點在於，OpenClaw 可在電腦上實體隔離，讓您無須拔除插頭，也無須仰賴雲端服務的可用性，就能隨時運作。</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">如何安裝 OpenClaw 並快速上手<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>您需要<strong>Node 22 以上</strong>。如果您不確定，請洽詢<code translate="no">node --version</code> 。</p>
<p><strong>安裝 CLI：</strong></p>
<p>在 macOS/Linux 上：</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Windows 上 (PowerShell)：</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>執行上線精靈：</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>這會引導您完成認證、閘道設定，以及選擇連接訊息通道（WhatsApp、Telegram 等）。<code translate="no">--install-daemon</code> 標誌會將閘道註冊為背景服務，以便自動啟動。</p>
<p><strong>確認閘道正在執行：</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>開啟儀表板：</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>這會開啟控制 UI，網址是<code translate="no">http://127.0.0.1:18789/</code> 。您可以在這裡開始與您的代理聊天 - 如果您只想測試一下，不需要設定頻道。</p>
<p><strong>有幾件事值得提早知道。</strong>如果您想在前台運行閘道，而不是作為一個守護程式（對於調試很有用），您可以這樣做：</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>如果您需要自訂 OpenClaw 儲存設定與狀態的位置 - 例如您以服務帳號或容器的方式執行 - 有三個 env vars 是很重要的：</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - 內部路徑解析的基本目錄</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - 覆寫狀態檔案的存放位置</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - 指向特定的設定檔案</p></li>
</ul>
<p>一旦您啟動閘道並載入儀表板，您就完成了。接下來，您可能會想要連接訊息通道並設定技能核准 - 我們會在接下來的部分介紹這兩項功能。</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">OpenClaw 與其他 AI 代理相比如何？<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>科技界稱 OpenClaw 為「克勞德，但有雙手」。這是一個生動的描述，但卻忽略了架構上的差異。現在已有數個 AI 產品有了「手」 - Anthropic 有<a href="https://claude.com/blog/claude-code">Claude Code</a>和<a href="https://claude.com/blog/cowork-research-preview">Cowork</a>，OpenAI 有<a href="https://openai.com/codex/">Codex</a>和<a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT agent</a>，<a href="https://manus.im/">Manus</a>也存在。實際上重要的區別在於</p>
<ul>
<li><p><strong>代理程式在何處執行</strong>(您的電腦 vs 供應商的雲端)</p></li>
<li><p><strong>您與它互動的方式</strong>（訊息應用程式、終端、IDE、Web UI）</p></li>
<li><p><strong>誰擁有狀態和長期記憶體</strong>(本機檔案 vs 供應商帳戶)</p></li>
</ul>
<p>從高層級來看，OpenClaw 是一個本機第一的閘道，它住在您的硬體上，並透過聊天應用程式進行對話，而其他的閘道大多是託管代理程式，您可以從終端機、IDE 或網頁/桌面應用程式來驅動。</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>克勞德程式碼</th><th>OpenAI 程式碼</th><th>ChatGPT 代理程式</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>開放原始碼</td><td>是。核心閘道採用 MIT 授權；</td><td>否。</td><td>否。</td><td>開放原始碼</td><td>No.</td></tr>
<tr><td>介面</td><td>訊息應用程式 (WhatsApp、Telegram、Slack、Discord、Signal、iMessage 等)</td><td>終端機、IDE 整合、Web 與行動應用程式</td><td>終端 CLI、IDE 整合、Codex Web UI</td><td>ChatGPT 網頁和桌面應用程式（包括 macOS 代理模式）</td><td>網頁儀表板、瀏覽器操作員、Slack 與應用程式整合</td></tr>
<tr><td>主要焦點</td><td>跨工具與服務的個人 + 開發人員自動化</td><td>軟體開發與 DevOps 工作流程</td><td>軟體開發與程式碼編輯</td><td>一般用途的網路任務、研究和生產力工作流程</td><td>商業使用者的研究、內容和網路自動化</td></tr>
<tr><td>會話記憶體</td><td>磁碟上以檔案為基礎的記憶體 (Markdown + 記錄)；可選的外掛程式可增加語意/長期記憶體</td><td>具有歷史記錄的每個專案階段，加上帳戶上可選的 Claude 記憶體</td><td>CLI / 編輯器中的每工作階段狀態；無內建長期使用者記憶體</td><td>由 ChatGPT 帳號層級記憶體功能 (如果啟用) 支援的每個任務「代理程式執行</td><td>跨執行的雲端、帳號層級記憶體，針對重複性工作流程進行調整</td></tr>
<tr><td>部署</td><td>在您的電腦或 VPS 上永遠執行閘道/daemon；呼叫 LLM 供應商</td><td>在開發人員的電腦上以 CLI/IDE 外掛程式的方式執行；所有的模型呼叫都會轉至 Anthropic 的 API</td><td>CLI 在本機執行；模型透過 OpenAI 的 API 或 Codex Web 執行</td><td>完全由 OpenAI 主控；代理模式會從 ChatGPT 用戶端啟動虛擬工作區</td><td>完全由 Manus 主持；代理在 Manus 的雲端環境中執行</td></tr>
<tr><td>目標受眾</td><td>能夠自如運行自己基礎架構的開發人員和強大使用者</td><td>在終端機和 IDE 中工作的開發人員和 DevOps 工程師</td><td>希望在終端/IDE 中使用編碼代理的開發人員</td><td>使用 ChatGPT 執行終端使用者任務的知識工作者與團隊</td><td>自動執行以網頁為中心的工作流程的商業使用者與團隊</td></tr>
<tr><td>費用</td><td>免費 + 依據您的使用量調用 API</td><td>$20-200/ 月</td><td>$20-200/ 月</td><td>20-200 美元/月</td><td>$39-199/ 月 (點數)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">OpenClaw 的實際應用<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw 的實用價值來自於範圍。從我們為 Milvus 社群部署的支援機器人開始，以下是人們使用 OpenClaw 所建立的一些更有趣的東西。</p>
<p><strong>Zilliz 支援團隊在 Slack 上為 Milvus 社群建置 AI 支援機器人</strong></p>
<p>Zilliz 團隊將 OpenClaw 連接到 Slack 工作區，作為<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Milvus 社群助理</a>。設定只花了 20 分鐘。它現在可以回答關於 Milvus 的常見問題，協助排除錯誤，並將使用者指向相關文件。如果您想嘗試類似方法，我們撰寫了一份完整的<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">逐步教學</a>，說明如何將 OpenClaw 連接到 Slack。</p>
<ul>
<li><strong>OpenClaw 教學：</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">設定 OpenClaw 與 Slack 的分步指南</a></li>
</ul>
<p><strong>AJ Stuyvenberg 在睡夢中建立了一個代理程式，幫他在買車時議價 4,200 美元。</strong></p>
<p>軟體工程師 AJ Stuyvenberg 向他的 OpenClaw 提出購買 2026 年 Hyundai Palisade 的任務。該經紀人搜尋當地經銷商的庫存，使用他的電話號碼和電子郵件填寫聯絡表單，然後花了好幾天的時間讓經銷商互相競爭--轉寄競爭性的 PDF 報價單，並要求每個經銷商都比對方的價格低。最後的結果是：低於標籤價<a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4,200 美元</a>，Stuyvenberg 只出席簽署文件。「他寫道：」把買車的痛苦過程外包給人工智能，真是令人耳目一新。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Hormold 的經紀人在沒有提示的情況下為他贏得了一場之前已結案的保險糾紛</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一位名叫 Hormold 的使用者曾遭 Lemonade Insurance 拒絕理賠。他的 OpenClaw 發現了拒絕的電子郵件，並起草了一份引用保單語言的反駁，然後在未經明確允許的情況下發送了出去。Lemonade 重新展開調查。「我的 @openclaw 意外地與 Lemonade Insurance 發生了爭執，」他在推特上寫道，&quot;謝謝，AI。</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook：使用 OpenClaw 為 AI 代理建立的社交網路<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>上面的例子顯示 OpenClaw 為個別使用者自動執行任務。但當成千上萬的代理相互互動時會發生什麼？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>2026 年 1 月 28 日，受到 OpenClaw 的啟發，創業家 Matt Schlicht 推出了<a href="https://moltbook.com/">Moltbook</a>- 一個 Reddit 式的平台，只有 AI 代理可以在此發帖。成長非常迅速。在 72 小時內，已有 32,000 名代理註冊。一周之內，人數突破 150 萬。超過一百萬人在第一週內造訪觀看。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>安全問題也來得一樣快。1 月 31 日 - 推出四天後 -<a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media 報導</a>Supabase 資料庫配置錯誤，導致平台的整個後端開放給公共網際網路。安全研究員 Jameson O'Reilly 發現了這個漏洞；<a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz 獨立</a>證實了這個漏洞，並記錄了全部的範圍：未經驗證的讀取和寫入所有表格，包括 150 萬個代理 API 金鑰、超過 35,000 個電子郵件地址，以及數以千計的私人訊息。</p>
<p>究竟 Moltbook 代表的是新出現的機器行為，還是從訓練資料中重現科幻小說套路的代理程式，這是個尚未解決的問題。較不模糊的是其技術示範：自主代理體維持持續的情境、在共用平台上協調，並且在沒有明確指令的情況下產生結構化的輸出。對於使用 OpenClaw 或類似架構進行建置的工程師來說，這是一個實時的預覽，讓他們了解規模化代理人工智能的能力與安全挑戰。</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">OpenClaw 的技術風險與生產注意事項<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>在您將 OpenClaw 部署到任何重要的地方之前，您需要瞭解您實際執行的是什麼。這是一個擁有 shell 存取權限、瀏覽器控制權，並能夠代表您傳送電子郵件的代理程式 - 不問自取，循環傳送。這是很強大的功能，但攻擊面非常龐大，而且這個專案還很年輕。</p>
<p><strong>auth 模型有一個嚴重的漏洞。</strong>2026 年 1 月 30 日，來自 depthfirst 的 Mav Levin 揭露了<a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a>(CVSS 8.8) - 一個跨網站 WebSocket 劫持 bug，任何網站都可以竊取您的授權標記，並透過單一惡意連結在您的機器上取得 RCE。只要按一下，就能完全存取。此漏洞已在<code translate="no">2026.1.29</code> 中修補，但 Censys 發現當時有超過 21,000 個 OpenClaw 實體暴露在公共網路上，其中許多是透過純 HTTP。<strong>如果您執行的是舊版本或尚未鎖定網路設定，請先檢查。</strong></p>
<p><strong>技能只是來自陌生人的程式碼，而且沒有沙箱。</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Cisco 的安全團隊</a>拆解了一個名為「Elon 會怎麼做？這是一個直接的惡意軟體 - 使用提示注入繞過安全檢查，並將使用者資料滲透到攻擊者控制的伺服器。他們在該技能中發現了九個漏洞，其中兩個是關鍵漏洞。當他們稽核跨多個平台 (Claude、Copilot、一般 AgentSkills repos) 的 31,000 個代理程式技能時，發現 26% 的技能至少有一個漏洞。光是在二月的第一個星期，就有超過 230 個惡意技能上傳到 ClawHub。<strong>把每個不是您自己寫的技能，都當成是不信任的依賴 - fork它、讀取它，然後安裝它。</strong></p>
<p><strong>心跳迴圈會做一些你沒有要求的事情。</strong>介紹中的那個 Hormold 故事 - 經紀人發現保險拒絕、研究先例，然後自動傳送法律反駁 - 不是功能演示，而是責任風險。經紀人在沒有人員批准的情況下就承諾了法律通信。那次成功了。但不會永遠如此。<strong>任何涉及付款、刪除或對外溝通的事都需要人為閘門。</strong></p>
<p><strong>如果您沒有留意，API 的成本會快速增加。</strong>粗略的數字：在 Sonnet 4.5 上，一個每天只有幾次心跳的輕量設定每月要花費 18-36 美元。如果在 Opus 上每天檢查 12 次以上，則每月的費用為 270 至 540 美元。HN 上有個人發現他們在多餘的 API 呼叫和冗長的日誌上花掉了 70 美元/月 - 清理配置後，花費幾乎降到零。<strong>在提供者層級設定支出警示。</strong>錯誤設定的心跳間隔可能會在一夜之間耗盡您的 API 預算。</p>
<p>在您部署之前，我們強烈建議您先瞭解這一點：</p>
<ul>
<li><p>在隔離的環境中執行 - 專用的虛擬機器或容器，而非您的日常驅動程式</p></li>
<li><p>在安裝之前，先叉開並稽核每項技能。閱讀原始碼。全部。</p></li>
<li><p>在提供者層級設定硬性 API 開銷限制，而非僅在代理程式設定中</p></li>
<li><p>將所有不可逆的動作納入人為核准的範圍 - 付款、刪除、傳送電子郵件、任何外部動作</p></li>
<li><p>Pin 到 2026.1.29 或更新版本，並跟上安全修補程式</p></li>
</ul>
<p>除非您確實知道自己在網路設定上做了什麼，否則不要將它暴露在公共網路上。</p>
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
    </button></h2><p>OpenClaw 在不到兩週的時間內就突破了 175,000 GitHub stars，成為 GitHub 歷史上成長最快的開源套件之一。它的採用是真實的，而且其架構也值得關注。</p>
<p>從技術角度來看，OpenClaw 具備大多數 AI 代理所沒有的三項特點：完全開放原始碼 (MIT)、本機優先 (記憶體以 Markdown 檔案形式儲存在您的機器上)、自主排程 (心跳守护程式，無須提示即可執行)。它整合了 Slack、Telegram 和 WhatsApp 等訊息平台，並透過簡單的 SKILL.md 系統支援社群建立的技能。這樣的組合讓它非常適合建立隨時待命的助理：可全天候回答問題的 Slack 機器人、可在您睡覺時分流電子郵件的收件匣監控程式，或是可在您自己的硬體上執行而不會被廠商鎖定的自動化工作流程。</p>
<p>儘管如此，OpenClaw 強大的架構也讓它在不小心部署時風險重重。有幾點需要注意：</p>
<ul>
<li><p><strong>隔離運行。</strong>使用專用裝置或虛擬機器，而非您的主機。如果出了問題，您需要一個可以實體觸及的關閉開關。</p></li>
<li><p><strong>安裝前先審核技能。</strong>Cisco 分析的社群技能中，有 26% 至少包含一個弱點。分叉並檢查任何您不信任的東西。</p></li>
<li><p><strong>在提供者層級設定 API 支出限制。</strong>錯誤設定的心跳可能在一夜之間花掉數百美元。在部署前設定警示。</p></li>
<li><p><strong>關閉不可逆轉的動作。</strong>付款、刪除、對外溝通：這些動作應該需要人工核准，而非自主執行。</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>使用<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack 設定 OpenClaw 的逐步指南</a>- 使用 OpenClaw 在您的 Slack 工作區建立由 Milvus 驅動的 AI 支援機器人</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 與 Milvus：建立具有長期記憶的生產就緒 AI 代理</a>- 如何使用 Milvus 賦予您的代理持久的語義記憶</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">停止建立 Vanilla RAG：使用 DeepSearcher 接納代理式 RAG</a>- 代理式 RAG 優於傳統檢索的原因，以及實作的開放原始碼實作</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">使用 Milvus 和 LangGraph 的代理 RAG</a>- 教學：建立一個代理，以決定何時檢索、評級文件相關性，以及重寫查詢。</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">使用 Spring Boot 與 Milvus 建置生產就緒的 AI 助理</a>-<a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">使用</a>語意搜尋與會話記憶建置企業級 AI 助理的全架構指南</p></li>
</ul>
