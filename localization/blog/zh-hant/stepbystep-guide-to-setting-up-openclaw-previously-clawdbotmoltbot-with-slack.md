---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: 使用 Slack 設定 OpenClaw（前身為 Clawdbot/Moltbot）的逐步指南
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: 使用 Slack 設定 OpenClaw 的分步指南。在您的 Mac 或 Linux 機器上執行自行託管的 AI 助理 - 不需要雲端。
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>如果您本週上過科技 Twitter、Hacker News 或 Discord，您就一定看過了。龍蝦表情符號 🦞、任務完成的截圖，以及一個大膽的宣稱：一個不只是<em>會說話的</em>AI，<em>它</em>真的<em>會</em> <em>說話</em>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>週末的情況更加怪異。企業家 Matt Schlicht 推出了<a href="https://moltbook.com">Moltbook - 一個</a>Reddit 式的社群網路，在這裡只有 AI 代理可以發表文章，人類只能觀看。短短幾天內，就有超過 150 萬名代理註冊。他們組成社群、辯論哲學、抱怨人類操作員，甚至成立了自己的宗教「Crustafarianism」。是的，真的。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>歡迎來到 OpenClaw 熱潮。</p>
<p>這股熱潮是如此真實，以至於 Cloudflare 的股票跳漲了 14%，原因很簡單，開發人員使用其基礎架構來執行應用程式。據報導，Mac Mini 的銷售量激增，因為人們為他們的新 AI 員工購買專用硬體。而 GitHub repo 呢？短短幾週內就超過<a href="https://github.com/openclaw/openclaw">15 萬顆星星</a>。</p>
<p>因此，我們自然要告訴您如何建立自己的 OpenClaw 實例，並將它連接到 Slack，這樣您就可以從您最喜愛的訊息應用程式管理您的 AI 助理。</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">OpenClaw 是什麼？<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a>(以前稱為 Clawdbot/Moltbot)是一個開放原始碼的自主式 AI 代理程式，可在使用者電腦上執行本機作業，並透過 WhatsApp、Telegram 和 Discord 等訊息應用程式執行實際世界的工作。它透過與 Claude 或 ChatGPT 等 LLM 連線，自動執行數位工作流程，例如管理電子郵件、瀏覽網頁或安排會議。</p>
<p>簡而言之，這就像是擁有一個全天候的數位助理，能夠思考、回應並真正完成工作。</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">將 OpenClaw 設定為以 Slack 為基礎的 AI 助理<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>想像一下，在您的 Slack 工作區中有一個機器人，可以立即回答有關您產品的問題、協助調試使用者的問題，或指導團隊成員找到正確的文件，而無需任何人停下手邊的工作。對我們來說，這可能意味著為 Milvus 社群提供更快速的支援：一個回答常見問題 (「如何建立資料集？」)、協助排除錯誤或按需求總結發行稿注意事項的機器人。對於您的團隊而言，它可能是新工程師上線、處理內部常見問題，或是自動化重複的 DevOps 任務。使用案例非常廣泛。</p>
<p>在本教程中，我們將介紹基本知識：在您的機器上安裝 OpenClaw 並將其連接到 Slack。完成後，您就可以擁有一個可運作的 AI 助理，隨時為您的需求進行客製化。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><ul>
<li><p>Mac 或 Linux 電腦</p></li>
<li><p><a href="https://console.anthropic.com/">Anthropic API 金鑰</a>(或 Claude Code CLI 存取權限)</p></li>
<li><p>可安裝應用程式的 Slack 工作區</p></li>
</ul>
<p>就是這樣。讓我們開始吧</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">步驟 1：安裝 OpenClaw</h3><p>執行安裝程式：</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>出現提示時，選擇<strong>「是</strong>」<strong>繼</strong>續。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然後選擇<strong>QuickStart</strong>模式。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">步驟 2：選擇您的 LLM</h3><p>安裝程式會要求您選擇一個模型提供者。我們使用 Anthropic 與 Claude Code CLI 進行驗證。</p>
<ol>
<li>選擇<strong>Anthropic</strong>作為提供者  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>按提示在瀏覽器中完成驗證。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>選擇<strong>anthropic/claude-opus-4-5-20251101</strong>作為預設模型  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">步驟 3：設定 Slack</h3><p>當被要求選擇頻道時，請選擇<strong>Slack。</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>繼續為您的機器人命名。我們稱自己的機器人為 "Clawdbot_Milvus"。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在您需要建立 Slack 應用程式，並取得兩個代號。方法如下：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 建立 Slack 應用程式</strong></p>
<p>前往<a href="https://api.slack.com/apps?new_app=1">Slack API 網站</a>，從頭建立一個新的應用程式。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為它命名，並選擇要使用的工作區。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 設定 Bot 權限</strong></p>
<p>在側邊欄中，按一下<strong>OAuth &amp; Permissions</strong>。向下捲動至<strong>Bot Token Scopes</strong>，並新增您的<strong>Bot</strong>所需的權限。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 啟用套接字模式</strong></p>
<p>按一下側邊欄中的<strong>Socket Mode</strong>並將其切換開啟。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這將產生一個<strong>App-level Token</strong>(以<code translate="no">xapp-</code> 開頭 )。將其複製到安全的地方。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 啟用事件訂閱</strong></p>
<p>前往<strong>Event Subscriptions</strong>並將其切換開啟。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然後選擇您的機器人應該訂閱哪些事件。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 安裝應用程式</strong></p>
<p>按一下側邊欄的<strong>Install App</strong>，<strong>然後請求安裝</strong>(如果您是工作區管理員，也可以直接安裝)。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一旦通過，您會看到您的<strong>Bot 使用者 OAuth Token</strong>(以<code translate="no">xoxb-</code> 開頭 )。同時複製此項。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">步驟 4：配置 OpenClaw</h3><p>回到 OpenClaw CLI：</p>
<ol>
<li><p>輸入您的<strong>Bot 使用者 OAuth Token</strong>(<code translate="no">xoxb-...</code>)</p></li>
<li><p>輸入您的<strong>App-level Token</strong>(<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>選擇機器人可以存取的 Slack 頻道  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>暫時跳過技能設定-您可以稍後再加入  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>選擇<strong>重新啟動</strong>，套用您的變更</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">步驟 5：試用</h3><p>前往 Slack 並傳送訊息給您的機器人。如果一切設定正確，OpenClaw 就會回應，並準備好在您的機器上執行任務。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">提示</h3><ol>
<li>執行<code translate="no">clawdbot dashboard</code> 以透過網頁介面管理設定  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>如果出錯，請檢查日誌以瞭解錯誤的詳細資訊  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">注意事項<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw 功能強大，這正是您應該小心的原因。"實際執行」是指它可以在您的電腦上執行真正的指令。這就是重點所在，但它也有風險。</p>
<p><strong>好消息是：</strong></p>
<ul>
<li><p>它是開放原始碼，因此程式碼是可稽核的。</p></li>
<li><p>它在本機執行，所以您的資料不在別人的伺服器上</p></li>
<li><p>您可以控制它的權限</p></li>
</ul>
<p><strong>不太好的消息：</strong></p>
<ul>
<li><p>提示注入是一個真正的風險 - 惡意訊息可能會誘使機器人執行非預期的指令</p></li>
<li><p>詐騙者已經製造了虛假的 OpenClaw repos 和 tokens，所以請小心下載。</p></li>
</ul>
<p><strong>我們的建議</strong></p>
<ul>
<li><p>不要在您的主機上執行此程式。使用虛擬機器、備用筆記型電腦或專用伺服器。</p></li>
<li><p>不要賦予超過您所需的權限。</p></li>
<li><p>先不要在生產中使用。它是新產品。把它當作實驗來看待。</p></li>
<li><p>堅持使用官方來源：<a href="https://x.com/openclaw">@openclaw</a>on X 和<a href="https://github.com/openclaw">OpenClaw</a>。</p></li>
</ul>
<p>一旦賦予 LLM 執行指令的能力，就沒有 100% 安全的東西了。這不是 OpenClaw 的問題，這是人工智慧的本質。只要聰明一點就好了。</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步是什麼？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜您！您現在擁有了一個在您自己的基礎架構上執行、可透過 Slack 存取的本地 AI 助理。您的資料仍屬於您，而您也有了一個不知疲倦的幫手，可以自動處理重複性的工作。</p>
<p>從這裡，您可以</p>
<ul>
<li><p>安裝更多<a href="https://docs.molt.bot/skills">技能</a>以擴充 OpenClaw 的功能</p></li>
<li><p>設定排程任務，讓它主動工作</p></li>
<li><p>連接 Telegram 或 Discord 等其他訊息平台</p></li>
<li><p>探索<a href="https://milvus.io/">Milvus</a>生態系統的 AI 搜尋功能</p></li>
</ul>
<p><strong>有問題或想分享您的建置？</strong></p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社群</a>，與其他開發人員聯繫</p></li>
<li><p>預約<a href="https://milvus.io/office-hours">Milvus 辦公時間</a>，與團隊進行即時問答</p></li>
</ul>
<p>開心駭客🦞</p>
