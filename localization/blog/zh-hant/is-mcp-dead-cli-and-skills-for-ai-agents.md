---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: MCP 死了嗎？我們從 MCP、CLI 和 Agent 技能中學到的建置方法
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: MCP 吃上下文、在生產中會出現問題，而且無法重用您代理的 LLM。我們使用這三種方式來建置 - 以下是每種方式的適用時間。
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>當 Perplexity 的 CTO Denis Yarats 在 ASK 2026 上表示公司內部正將 MCP 置於次要地位時，掀起了慣常的循環。YC 執行長 Garry Tan 針鋒相對 - MCP 吃掉太多上下文視窗、認證功能被破壞，他在 30 分鐘內就建立了 CLI 替換。Hacker News 強烈反對 MCP。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一年前，這種程度的公開懷疑是不尋常的。Model Context Protocol (MCP) 被定位為<a href="https://zilliz.com/glossary/ai-agents">AI 代理</a>工具整合的最終標準。伺服器數量每週翻倍。從那時起，模式就跟著我們熟悉的弧線：快速炒作、廣泛採用，然後生產幻滅。</p>
<p>業界反應迅速。Bytedance 的 Lark/Feishu 開放了他們的官方 CLI - 200 多項指令，涵蓋 11 個商業領域，內建 19 種 Agent Skills。Google 推出了用於 Google Workspace 的 gws。CLI + Skills 模式正迅速成為企業級 Agent 工具的預設模式，而非小眾化的替代方案。</p>
<p>在 Zilliz，我們發佈了<a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>，讓您可以直接從終端操作和管理<a href="https://milvus.io/intro">Milvus</a>與<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(完全管理的 Milvus)，而無需離開您的編碼環境。除此之外，我們建立了<a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a>和<a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>，讓 Claude Code 和 Codex 等 AI 編碼代理可以透過自然語言管理您的<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>。</p>
<p>一年前，我們也為 Milvus 和 Zilliz Cloud 建立了 MCP 伺服器。這次經驗讓我們確切了解到 MCP 的缺點，以及它仍然適用的地方。有三個架構上的限制將我們推向 CLI 與 Skills：上下文視窗的臃腫、被動的工具設計，以及無法重用代理程式本身的 LLM。</p>
<p>在這篇文章中，我們將逐一闡述這些問題，說明我們正在建置的替代方案，並為在 MCP、CLI 和 Agent Skills 之間做出選擇，提供一個實用的架構。</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP 在啟動時佔用了 72% 的上下文視窗<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>標準的 MCP 設定會在代理採取任何動作之前，消耗約 72% 的可用上下文視窗。在 200K 令牌模型上連接三個伺服器 - GitHub、Playwright 和 IDE 整合，光是工具定義就佔用了大約 143K 令牌。代理還什麼都沒做。它已經滿了四分之三。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>成本不只是代幣。上下文中的無關內容越多，模型對真正重要內容的專注就越弱。在上下文中放置一百個工具模式，意味著代理程式在做每個決策時，都要瀏覽所有的工具模式。研究人員已經記錄了他們所謂的上下文<em>腐蝕</em>- 上下文過載導致推理品質下降。在測量測試中，隨著工具數量的增加，工具選擇的準確率從 43% 下降到 14% 以下。自相矛盾的是，工具越多，工具的使用就越差。</p>
<p>根本原因在於架構。MCP 會在會話開始時完整載入所有工具說明，不論目前的會話是否會使用這些工具。這是通訊協定層級的設計選擇，而不是錯誤 - 但成本會隨著您新增的每項工具而增加。</p>
<p>代理技能則採用不同的方法：<strong>逐步揭露</strong>。在會話開始時，代理程式只會讀取每個技能的元資料 - 名稱、單行描述、觸發條件。總共只有幾十個 token。完整的技能內容只有在代理決定相關時才會載入。可以這樣想：MCP 把所有工具都排在門口，讓您選擇；Skills 則是先給您索引，再按需求提供完整內容。</p>
<p>CLI 工具也有類似的優勢。代理程式會執行 git --help 或 docker --help 來按需求發現功能，而不需要預先載入每個參數定義。Context 成本是隨用隨付，而非預付。</p>
<p>在小規模時，差異可以忽略不計。在生產規模上，這就是能運作的代理程式與淹沒在自己的工具定義中的代理程式之間的差異。</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">MCP 的被動架構限制了代理工作流程<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP 是一種工具呼叫通訊協定：如何發現工具、呼叫工具並接收結果。簡潔的設計適用於簡單的使用個案。但這種乾淨也是一種限制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">無層級的扁平工具空間</h3><p>MCP 工具是一個扁平的函式簽章。沒有子指令、沒有意識到會話生命週期、沒有意識到代理在多步工作流程中的位置。它等待被呼叫。這就是它所做的一切。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>git commit、git push 和 git log 是完全不同的執行路徑，共用一個介面。代理程式執行 --help 時，會逐步探索可用的表面，並只擴展它所需要的 - 而不會將所有的參數文件前置到上下文中。</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">技能可編碼工作流程邏輯 - MCP 則無法編碼</h3><p>Agent Skill 是一個 Markdown 檔案，包含一個標準作業程序：首先要做什麼、接下來要做什麼、如何處理失敗，以及何時要向使用者展示某些東西。代理收到的不只是一個工具，而是整個工作流程。技能會主動塑造代理在對話中的行為 - 什麼會觸發他們、他們預先準備什麼，以及他們如何從錯誤中恢復。MCP 工具只能等待。</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP 無法存取座席的 LLM</h3><p>這是實際阻止我們的限制。</p>
<p>當我們建立<a href="https://github.com/zilliztech/claude-context">claude-context</a>（一個 MCP 外掛，可為 Claude Code 和其他 AI 編碼代理程式增加<a href="https://zilliz.com/glossary/semantic-search">語意搜尋功能</a>，讓他們從整個程式碼庫中獲得深層情境）時，我們希望能從 Milvus 擷取相關的歷史對話片段，並將它們浮現為情境。<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋檢索</a>成功了。問題是如何處理這些結果。</p>
<p>擷取前 10 個結果，可能有 3 個是有用的。其他 7 個則是雜訊。將所有 10 個結果交給外部代理程式，雜訊就會干擾答案。在測試中，我們發現回應會被不相干的歷史記錄所干擾。我們需要在傳送結果之前進行篩選。</p>
<p>我們嘗試了幾種方法。使用小型模型在 MCP 伺服器內加入重新排序步驟：不夠精確，而且相關性臨界值需要依使用個案調整。使用大型模型進行重排：技術上是可行的，但 MCP 伺服器是以獨立的進程執行，無法存取外部代理的 LLM。我們必須設定獨立的 LLM 用戶端、管理獨立的 API 金鑰，並處理獨立的呼叫路徑。</p>
<p>我們想要的很簡單：讓外部代理的 LLM 直接參與篩選決策。擷取前 10 名，讓代理程式自己判斷哪些值得保留，並只傳回相關結果。不需要第二個模型。不需要額外的 API 金鑰。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP 做不到這一點。伺服器和代理之間的流程邊界也是智慧邊界。伺服器無法使用代理程式的 LLM；代理程式也無法管理伺服器內部發生的事情。對於簡單的 CRUD 工具來說沒問題。當工具需要做出判斷時，隔離就變成了真正的限制。</p>
<p>Agent Skill 可以直接解決這個問題。檢索技能可以呼叫向量搜尋前 10 名，讓代理程式自己的 LLM 評估相關性，並只傳回通過的結果。不需要額外的模型。代理程式會自己進行篩選。</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">我們以 CLI 和 Skills 取而代之<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>我們將 CLI + Skills 視為代理與工具互動的方向 - 不只是記憶擷取，而是整個堆疊。這個信念驅使我們正在建立的一切。</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch：以技能為基礎的 AI 代理記憶層</h3><p>我們建立了<a href="https://github.com/zilliztech/memsearch">memsearch</a>，這是 Claude Code 和其他 AI 代理的開放原始碼記憶層。該技能在一個具有三個階段的子代理程式中執行：Milvus 會處理初始向量搜尋，以進行廣泛的發現；代理程式本身的 LLM 會評估相關性，並針對有潛力的命中項目擴充上下文；最後的深入搜尋會在需要時才存取原始會話。每個階段都會捨棄雜訊 - 中間的檢索垃圾永遠不會到達主要的上下文視窗。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>關鍵要點：代理的智慧是工具執行的一部分。已經在迴圈中的 LLM 會進行篩選 - 不需要第二個模型、不需要額外的 API 金鑰、不需要脆弱的臨界值調整。這是一個特定的使用個案 - 編碼代理的會話內容擷取 - 但這個架構適用於工具需要判斷而不只是執行的任何情境。</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI、技能和向量資料庫操作的外掛程式</h3><p>Milvus 是全球最廣泛採用的開放原始碼向量資料庫，<a href="https://github.com/milvus-io/milvus">在 GitHub 上</a>有<a href="https://github.com/milvus-io/milvus">43K+ 顆星</a>。<a href="https://zilliz.com/cloud">Zilliz Cloud</a>是 Milvus 的全面管理服務，具有進階的企業功能，速度比 Milvus 快很多。</p>
<p>上述相同的分層架構驅動我們的開發人員工具：</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>是基礎架構層。叢集管理、<a href="https://milvus.io/docs/manage-collections.md">採集作業</a>、向量搜尋、<a href="https://milvus.io/docs/rbac.md">RBAC</a>、備份、帳單 - 您在 Zilliz Cloud 主控台所做的一切，都可以從終端機取得。人類和代理使用相同的指令。Zilliz CLI 也是 Milvus Skills 和 Zilliz Skills 的基礎。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a>是開放原始碼 Milvus 的知識層。它教導 AI 編碼代理 (Claude Code、Cursor、Codex、GitHub Copilot) 透過<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>Python 程式碼來操作任何 Milvus 部署 -<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>、Standalone 或 Distributed - 連線、<a href="https://milvus.io/docs/schema-hands-on.md">模式設計</a>、CRUD、<a href="https://zilliz.com/learn/hybrid-search-with-milvus">混合搜尋</a>、<a href="https://milvus.io/docs/full-text-search.md">全文搜尋</a>、<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>。</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a>對於 Zilliz Cloud 也是一樣，教代理透過 Zilliz CLI 管理雲端基礎架構。</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Plugin</a>是 Claude Code 的開發者體驗層 - 透過 /zilliz:quickstart 和 /zilliz:status 等斜線指令，將 CLI + Skill 包裝成引導式體驗。</li>
</ul>
<p>CLI 處理執行，Skills 編碼知識與工作流程邏輯，Plugin 提供使用者使用者介面。環路中沒有 MCP 伺服器。</p>
<p>如需詳細資訊，請參閱這些資源：</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">介紹 Zilliz CLI 和 Zilliz Cloud 的 Agent Skills</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud 剛登陸 Claude 程式碼</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI 提示 - Zilliz Cloud 開發人員中心</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI 參考 - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill - Zilliz Cloud 開發者集線器</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">適用於 AI 代理的 Milvus - Milvus 文件</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">MCP 是否真的會消亡？<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>許多開發人員和公司，包括我們 Zilliz 在內，都轉向 CLI 和 Skills。但 MCP 真的會消亡嗎？</p>
<p>簡短的答案是：不 - 但它的範圍正在縮小到它真正適合的地方。</p>
<p>MCP 已捐贈給 Linux 基金會。活躍伺服器超過 10,000 台。SDK 的每月下載量為 9700 萬次。如此規模的生態系統不會因為一則會議評論而消失。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hacker News 的一個主題 -<em>"什麼時候 MCP 對 CLI 才有意義？</em>- 引來的回應大多傾向 CLI：「CLI 工具就像精密儀器」、「CLI 也比 MCP 感覺更敏捷」。有些開發人員則持有較為平衡的看法：技能是詳盡的秘訣，可以幫助您更好地解決問題；MCP 則是幫助您解決問題的工具。兩者都有它的用武之地。</p>
<p>這是公平的 - 但這提出了一個實際的問題。如果秘訣本身就可以指導代理使用哪些工具以及如何使用，那麼是否仍需要一個獨立的工具分配協定？</p>
<p>這取決於使用情況。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>在 stdio 上的 MCP</strong>- 大多數開發人員在本機執行的版本 - 是問題累積的地方：不穩定的進程間通訊、雜亂的環境隔離、高代號開銷。在這種情況下，幾乎每個使用個案都有更好的替代方案。</p>
<p><strong>HTTP 上的 MCP</strong>則是另一回事。企業內部工具平台需要集中的權限管理、統一的 OAuth、標準化的遙測和日誌。零散的 CLI 工具確實很難提供這些功能。在這種情況下，MCP 的集中式架構具有真正的價值。</p>
<p>Perplexity 實際上丟棄的主要是 stdio 用例。Denis Yarats 指定了「內部」，卻沒有要求整個產業採用這個選擇。這個細微的差異在傳播過程中被遺忘了 - 「Perplexity 放棄 MCP」 的傳播速度比 「Perplexity 在內部工具整合上將 MCP 置於優先順序，而非 stdio 」快得多。</p>
<p>MCP 的出現是因為它解決了一個真正的問題：在它之前，每個 AI 應用程式都寫自己的工具呼叫邏輯，沒有共用的標準。MCP 在適當的時候提供了統一的介面，並迅速建立了生態系統。生產經驗讓限制浮現。這是基礎建設工具的正常軌跡，而非死刑。</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">何時使用 MCP、CLI 或技能<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>透過 stdio 的 MCP (本地)</th><th>透過 HTTP 的 MCP (企業)</th></tr>
</thead>
<tbody>
<tr><td><strong>驗證</strong></td><td>無</td><td>集中式 OAuth</td></tr>
<tr><td><strong>連線穩定性</strong></td><td>流程隔離問題</td><td>穩定的 HTTPS</td></tr>
<tr><td><strong>記錄</strong></td><td>無標準機制</td><td>集中式遙測</td></tr>
<tr><td><strong>存取控制</strong></td><td>無</td><td>基於角色的權限</td></tr>
<tr><td><strong>我們的看法</strong></td><td>以 CLI + Skills 取代</td><td>保留給企業工具</td></tr>
</tbody>
</table>
<p>對於選擇<a href="https://zilliz.com/glossary/ai-agents">代理式 AI</a>工具堆疊的團隊而言，以下是各層的配合方式：</p>
<table>
<thead>
<tr><th>層級</th><th>功能</th><th>最適合</th><th>範例</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>作業任務、資訊管理</td><td>代理和人類都會執行的指令</td><td>git、docker、zilliz-cli</td></tr>
<tr><td><strong>技能</strong></td><td>代理工作流程邏輯、編碼知識</td><td>需要 LLM 判斷、多步驟 SOP 的任務</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>REST API</strong></td><td>外部整合</td><td>連接第三方服務</td><td>GitHub API、Slack API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>企業工具平台</td><td>集中式認證、稽核記錄</td><td>內部工具閘道</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">開始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在這篇文章中討論的所有內容現在都已可用：</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>- 以技能為基礎的 AI 代理記憶層。將其丟入 Claude Code 或任何支援 Skills 的代理程式。</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a>- 從您的終端管理 Milvus 和 Zilliz Cloud。安裝並探索您的代理可以使用的子指令。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a>和<a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a>- 讓您的 AI 編碼代理擁有原生的 Milvus 和 Zilliz Cloud 知識。</li>
</ul>
<p>對向量搜尋、代理體架構或使用 CLI 與 Skills 建構有任何疑問？加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>，或<a href="https://milvus.io/office-hours">預約免費的 Office Hours 會話</a>，討論您的使用個案。</p>
<p>準備好進行建置了嗎？<a href="https://cloud.zilliz.com/signup">註冊 Zilliz Cloud</a>- 使用工作電子郵件的新帳戶可獲得 100 美元的免費點數。已經有帳號？<a href="https://cloud.zilliz.com/login">請在此登入</a>。</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常見問題<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">AI 代理的 MCP 有什麼問題？</h3><p>MCP 在生產上有三大架構限制。首先，它會在會話開始時將所有工具模式載入上下文視窗 - 在一個 200K 令牌模型上連接三個 MCP 伺服器，就可以在代理做任何事情之前消耗超過 70% 的可用上下文。第二，MCP 工具是被動的：它們等待被呼叫，無法編碼多步驟工作流程、錯誤處理邏輯或標準作業程序。第三，MCP 伺服器以獨立進程的方式執行，無法存取代理程式的 LLM，因此任何需要判斷的工具 (例如過濾搜尋結果的相關性) 都需要設定獨立的模型，並擁有自己的 API 金鑰。這些問題在透過 stdio 進行 MCP 時最為嚴重；透過 HTTP 進行 MCP 則可緩和其中一些問題。</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">MCP 與 Agent Skills 有何不同？</h3><p>MCP 是一種工具呼叫通訊協定，定義了代理如何發現和呼叫外部工具。Agent Skill 是一個 Markdown 檔案，包含完整的標準作業程序 - 觸發器、逐步指示、錯誤處理和升級規則。關鍵的架構差異：技能在代理程式的流程中執行，因此它們可以利用代理程式本身的 LLM 來進行判斷呼叫，例如相關性過濾或結果重排。MCP 工具在獨立的流程中執行，無法存取代理程式的智慧。Skills 也使用漸進式揭露 (progressive disclosure)，即在啟動時只載入輕量級的 metadata，而完整的內容則會依需求載入，因此與 MCP 的預先模式載入相比，可以將上下文視窗的使用量降至最低。</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">何時仍應使用 MCP 而非 CLI 或 Skills？</h3><p>對於需要集中式 OAuth、基於角色的存取控制、標準化遙測，以及橫跨許多內部工具的稽核記錄的企業工具平台而言，透過 HTTP 使用 MCP 仍然是合理的。零散的 CLI 工具難以一致地提供這些企業需求。對於本機開發工作流程 (即代理與您機器上的工具互動)，CLI + Skills 通常會提供比 MCP over stdio 更佳的效能、更低的上下文開銷，以及更彈性的工作流程邏輯。</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">CLI 工具與 Agent Skills 如何共同運作？</h3><p>CLI 提供執行層 (實際指令)，而 Skills 則提供知識層 (何時執行哪些指令、以何種順序執行，以及如何處理故障)。例如，Zilliz CLI 可處理基礎架構作業，如叢集管理、集合 CRUD 和向量搜尋。Milvus Skill 會教導代理正確的 pymilvus 模式，以進行模式設計、混合搜尋和 RAG 管道。CLI 執行工作；Skill 則了解工作流程。這種分層模式 - CLI 負責執行、Skills 負責知識、外掛程式負責使用者經驗 - 就是我們在 Zilliz 所使用的所有開發人員工具的結構。</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI：我應該在什麼時候使用每種工具？</h3><p>像 git、docker 或 zilliz-cli 之類的 CLI 工具最適合用於作業任務 - 它們會揭露階層式的子指令，並依需求載入。像 milvus-skill 之類的技能最適合代理工作流程邏輯 - 它們載有作業程序、錯誤復原，並能存取代理的 LLM。透過 HTTP 的 MCP 仍然適合需要集中式 OAuth、權限和稽核記錄的企業工具平台。透過 stdio 的 MCP - 本機版本 - 在大多數生產設定中正被 CLI + Skills 所取代。</p>
