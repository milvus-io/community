---
id: attu-3-0-beta.md
title: |
  Attu 3.0 Beta：多叢集管理、AI 代理程式，以及重新打造的 Milvus 控制台
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 beta 重新打造了 Milvus 管理主控台，具備多叢集管理、持久化狀態、內建 AI 代理程式、專家級診斷、即時指標、API
  除錯、備份與還原，以及簡化的 RBAC 工作流程。
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta 現已推出。</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a>是<a href="https://milvus.io"><strong>Milvus</strong></a> 的開源管理主控台。無論您是在本地端或生產環境中使用 Milvus，您很可能都曾透過 Attu 檢視集合、瀏覽資料、管理資料結構，或是查看叢集內的運作狀況。</p>
<p>Attu 2.x 在基礎的單一叢集管理方面表現良好。但隨著 Milvus 部署規模擴大，其限制也日益顯現。它每次只能連線至一個 Milvus 實例，且容器重新啟動後會遺失連線狀態。 資料瀏覽功能主要以集合為中心。診斷、監控、API 除錯、備份與還原，以及權限管理，往往需要使用獨立工具或手動操作。</p>
<p><strong>Attu 3.0 Beta 徹底重構了 Milvus 的管理體驗。</strong></p>
<p>此版本新增了多叢集管理、持久化本地狀態、內建 AI 代理程式（含 50 多種 Milvus 工具）、專家級診斷能力、重新設計的資料瀏覽器、內建 Prometheus 指標、API 實作環境、基於 GUI 的備份與還原功能，以及簡化的 RBAC 工作流程。</p>
<p>簡而言之，Attu 不再僅是單一 Milvus 實例的輕量級檢視器。它正逐漸成為開發人員及團隊在本地、測試與生產環境中管理 Milvus 的實用運維控制台。</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Attu 3.0 Beta 的更新內容<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是 Attu 2.x 與 Attu 3.0 Beta 之間的高階比較。</p>
<table>
<thead>
<tr><th>功能</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>叢集連線</td><td>僅支援單一執行個體</td><td>一鍵切換多個叢集</td></tr>
<tr><td>狀態持久化</td><td>無狀態；容器重新啟動時會遺失</td><td>本地資料庫；重啟後仍保留</td></tr>
<tr><td>AI 輔助</td><td>無</td><td>內建代理程式，具備 50 多種 Milvus 工具</td></tr>
<tr><td>診斷</td><td>手動調查</td><td>4 項內建專家級診斷技能</td></tr>
<tr><td>基於角色的存取控制 (RBAC) 管理</td><td>獨立頁面、多步驟流程</td><td>情境內、一鍵建立使用者</td></tr>
<tr><td>資料導覽</td><td>平面集合清單</td><td>層級樹狀結構：資料庫 → 集合 → 區隔</td></tr>
<tr><td>監控</td><td>需搭配外部 Grafana 使用</td><td>內建 Prometheus 指標儀表板</td></tr>
<tr><td>API 除錯</td><td>外部工具（例如 curl 或 Postman）</td><td>內建 REST API 測試平台</td></tr>
<tr><td>備份與還原</td><td>僅限 CLI</td><td>支援 S3、MinIO、GCS 和 Azure 的 GUI</td></tr>
<tr><td>大型語言模型 (LLM) 整合</td><td>無</td><td>自帶模型 (BYOL)：OpenAI、Anthropic、DeepSeek、Gemini 等</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">透過單一側邊欄管理多個 Milvus 叢集<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>日常操作中最顯著的變革在於多叢集管理。</strong>Attu 3.0 可連線至您所運行的每個 Milvus 實例，並將其列於單一側邊欄中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 側邊欄顯示多個 Milvus 連線及其狀態指標</p>
<p>在 Attu 2.x 中，從一個 Milvus 叢集切換至另一個，意味著必須先斷開連線、重新連線，並等待。若您為開發、預備、生產環境或不同業務線設有獨立叢集，往往會導致每個叢集都佔用一個瀏覽器分頁。</p>
<p>Attu 3.0 透過持久的左側邊欄取代了這種操作流程。每個 Milvus 連線皆集中列於一處，並附有即時狀態指示器。綠色圓點表示可連線至該叢集；紅色圓點則表示叢集已下線或無法使用。</p>
<p>切換叢集只需一次點擊。Attu 會保留每項連線的上下文，因此您無需在不同環境間切換時每次重新連線。</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">連線設定更為穩健</h3><p>新連線支援 TLS/SSL 加密、憑證驗證以及使用者名稱/密碼驗證。您可以在儲存連線前進行測試，將連線詳細資訊保留在本地端，並在舊環境不再需要時批量清除已斷線的連線。</p>
<p><strong>每個叢集皆擁有專屬的工作區。</strong>概覽、資料瀏覽器、使用者管理、指標及操作功能，皆僅限於當前選取的叢集範圍內。這大幅降低了將測試環境與生產環境混淆，或在錯誤位置執行操作的可能性。</p>
<p>對於管理多個 Milvus 實例的使用者而言，這是 Attu 3.0 中最重要的變更之一。這聽起來很基礎，但它大幅減少了日常 Milvus 工作中頻繁切換分頁與重新連線的麻煩。</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">本地狀態現可保留至重啟後<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x 採用無狀態設計。若容器重新啟動，您儲存的連線資訊將會消失，必須重新建立工作區。</p>
<p><strong>Attu 3.0 新增了本地資料庫，可持久化儲存叢集設定、代理程式對話記錄、自訂技能、LLM 設定以及使用者偏好設定。</strong></p>
<p>若使用 Docker 執行 Attu，請掛載一個卷宗以保留該狀態：</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>掛載卷後，重新啟動容器便不再意味著從頭開始。</p>
<p>這對新的 AI 代理同樣至關重要。對話記錄、自訂技能及 LLM 設定皆可本地端保留，因此 Attu 將成為您可長期持續使用的控制台，而非每次重啟後便會重置的臨時介面。</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">使用內建 AI 代理以自然語言操作 Milvus<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 內建用於管理 Milvus 的 AI 代理程式。這並非文件聊天機器人。<strong>該代理程式連接到 50 多種 Milvus 工具，因此能夠透過 Attu 檢查叢集狀態並執行實際操作。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 AI 代理可透過自然語言請求呼叫 Milvus 工具</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">涵蓋常見 Milvus 工作流程的 50 多種內建工具</h3><p>該代理涵蓋日常操作、診斷、權限設定及叢集管理。您可以提出問題或下達指令，例如：</p>
<table>
<thead>
<tr><th>情境</th><th>範例提示語</th></tr>
</thead>
<tbody>
<tr><td>日常操作</td><td>「列出我所有的集合。」<br>「建立一個包含 id、title 和 embedding 欄位的集合。將 embedding 欄位的維度設為 768。」<br>「將一些測試資料插入 my_collection。」<br>「在 my_collection 中搜尋與『人工智慧』最相似的 10 筆記錄。」</td></tr>
<tr><td>運維與診斷</td><td>「我的叢集運作正常嗎？」<br>「為什麼搜尋速度這麼慢？」<br>「哪些集合體佔用最多記憶體？」<br>「最近有哪個查詢速度很慢嗎？」</td></tr>
<tr><td>權限</td><td>「建立一個名為 analyst 的唯讀使用者。」<br>「授予 admin 角色所有權限。」<br>「檢查使用者 zhangsan 擁有哪些權限。」</td></tr>
<tr><td>叢集管理</td><td>「顯示當前的 Milvus 版本與設定。」<br>「列出資源群組的使用狀況。」<br>「幫我壓縮 my_collection。」</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">破壞性操作需經批准</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：破壞性或敏感操作會在執行前顯示確認對話方塊</p>
<p><strong>此代理程式設計上具有透明度且可控。</strong>非破壞性操作（例如列出集合或讀取指標）會直接返回結果。</p>
<p>破壞性或敏感操作（例如刪除集合、清除資料或變更權限）則會觸發確認對話方塊。該對話方塊會列出確切的參數，並在執行操作前等待批准。</p>
<p>您亦可查看代理程式呼叫了哪些工具、使用了多少令牌，以及是否有任何工具呼叫失敗。這對資料庫管理代理程式至關重要。使用者應能理解代理程式執行了哪些操作，而不僅是看到最終結果。</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">從主控台執行專家診斷技能<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AI 代理程式內建四項診斷技能。</strong>這些是針對 Milvus 常見疑難排解情境的引導式工作流程，而非通用提示。</p>
<table>
<thead>
<tr><th>診斷技能</th><th>檢查項目</th></tr>
</thead>
<tbody>
<tr><td>叢集健康狀態診斷</td><td>版本、節點狀態、各元件健康狀況及關鍵指標。</td></tr>
<tr><td>搜尋效能診斷</td><td>索引完整性、分段碎片、副本平衡以及相關的搜尋效能指標。</td></tr>
<tr><td>資料寫入診斷</td><td>插入速度緩慢、資料檢查失敗、快取清除異常及寫入路徑問題徵兆。</td></tr>
<tr><td>設定稽核</td><td>可能影響系統穩定性、效能或預期行為的高風險或錯誤設定。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 內建診斷技能，並支援自訂技能</p>
<p>您亦可使用自然語言建立自訂技能。一項技能可編碼為啟動前的檢查清單、針對特定資料集的資料品質檢查，或是您的團隊針對已知工作負載執行的診斷流程。</p>
<p>自訂技能本質上是領域知識加上流程。一旦儲存，代理程式即可重複使用該技能，無需每次都依賴一次性提示。</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">自帶大型語言模型 (LLM) 供應商<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 不會捆綁或代理任何 LLM 服務。</strong>您可自行配置供應商，並完全掌控模型路徑。</p>
<p>支援的供應商選項包括 OpenAI、Anthropic、DeepSeek、Google Gemini、OpenRouter，以及自訂的 OpenAI 相容端點。</p>
<table>
<thead>
<tr><th>供應商</th><th>範例模型</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>任何路由模型</td></tr>
<tr><td>自訂端點</td><td>任何與 OpenAI 相容的 API</td></tr>
</tbody>
</table>
<p>您的 API 金鑰會在本地端加密，且不會上傳至 Attu 管理的服务。此設計對於希望獲得 AI 協助，但仍需掌控憑證、資料流及供應商選擇的團隊而言至關重要。</p>
<p>實際上，BYOL 讓代理程式能在不同環境中靈活運用。某個團隊可能使用 OpenAI；另一個團隊可能採用 Anthropic 模型；第三個團隊則可能透過相容於 OpenAI 的端點進行路由。Attu 不會強制指定單一模型供應商。</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">透過資料庫 → 集合 → 分區樹瀏覽 Milvus 資料<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 同時重新設計了資料瀏覽器。Attu 2.x 主要呈現平面的集合清單。一旦叢集擁有多個資料庫、數十個集合以及分區資料，這種設計便難以使用。</p>
<p><strong>新版瀏覽器採用與 Milvus 資料組織方式相符的層級結構：資料庫 → 集合 → 分區。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：重新設計的資料瀏覽器採用分層導覽結構，涵蓋資料庫、集合與區隔</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">資料操作更貼近瀏覽位置</h3><p>資料瀏覽器保留了使用者已習慣的操作功能，並在 UI 中直接新增更多動作：</p>
<ul>
<li>將集合拖放至另一個資料庫。</li>
<li>當嵌入模型已設定時，可直接輸入文字執行向量搜尋。</li>
<li>檢視相似度分數，並透過篩選條件縮小結果範圍。</li>
<li>以 CSV、JSON 和 Parquet 格式匯入及匯出資料。</li>
<li>以視覺化方式檢視及編輯集合結構，包含對動態欄位的支援。</li>
<li>建立、刪除及檢視分區與分區統計資料。</li>
<li>管理整個集合的生命週期：建立、載入、釋出、複製、重新命名、跨資料庫移動以及刪除。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：具備向量搜尋與結果檢視功能的 Attu 3.0 資料瀏覽器</p>
<p>這些操作大多可透過右鍵選單或操作面板執行。針對常見的集合作業，您不再需要在 UI 瀏覽與命令列操作之間來回切換。</p>
<p>Attu 3.0 也是隨著<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a>新功能（例如快照和可為空向量）日趨成熟，其 UI 支援將持續推出的產品線。</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">在單一介面中查看操作、指標、慢查詢、拓撲結構與備份<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 將更多運維資訊整合至控制台。</strong>其「運維與監控」區域包含叢集概覽、即時指標、慢查詢分析、拓撲結構，以及備份與還原功能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 運維與監控頁面</p>
<p>此舉並非旨在取代生產團隊現有的所有可觀測性系統。團隊仍可繼續使用 Prometheus、Grafana、日誌、警示及其現有的監控堆疊。目標是讓常見的 Milvus 問題能在 Attu 內部獲得解答。</p>
<table>
<thead>
<tr><th>區塊</th><th>功能說明</th></tr>
</thead>
<tbody>
<tr><td>視覺化叢集概覽</td><td>一目了然地查看 Milvus 版本、部署模式、節點數量、資料庫數量、收集器數量、負載狀態及配額實體。</td></tr>
<tr><td>即時指標</td><td>檢視 QPS、插入/刪除率、查詢延遲、快取命中率，以及相關由 Prometheus 支援的指標。</td></tr>
<tr><td>慢查詢分析</td><td>可依類型、執行時間、資料集、時間戳記、來源及相關疑難排解背景檢視慢查詢。</td></tr>
<tr><td>拓撲視圖</td><td>了解節點拓撲結構，以及 RootCoord、DataCoord、IndexCoord、QueryCoord 和 Proxy 等元件之間的連線關係。</td></tr>
<tr><td>備份與還原</td><td>針對 S3、MinIO、GCS 或 Azure 建立完整或增量備份，並將備份元資料下載為 ZIP 檔案，或上傳 ZIP 檔案以進行還原。</td></tr>
</tbody>
</table>
<p>備份與還原功能至關重要，因為它們將原本依賴 CLI 的工作流程移至 GUI 介面。這對於本地測試、預備環境驗證，以及希望擁有更清晰復原路徑的團隊而言，都十分實用。</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">使用內建 API Playground 除錯 Milvus REST API<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 新增了 REST API 實作環境，用於 Milvus API 的開發與除錯。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 API 實作環境</p>
<p>此 API 沙盒將 Milvus REST 端點依類別分類。選取資料庫與集合後，Attu 會自動填入執行上下文。接著，您只需點擊一下即可發送請求，並即時檢視回應。</p>
<p>當您希望測試 API 呼叫，卻無需設定 curl 指令或 Postman 集合時，此功能便十分實用。此外，由於您可直接在 UI 環境與請求內容之間切換，這對於了解 Milvus 功能如何對應至 REST API 也極具助益。</p>
<p>對應用程式開發人員而言，API Playground 是一個除錯平台；對 Milvus 新使用者來說，它是一個學習平台；對平台團隊而言，這是將操作轉化為腳本或應用程式程式碼前，快速驗證操作的途徑。</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">在資料庫或集合旁管理 RBAC<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 改變了 UI 中權限工作流程的操作體驗。</strong>它不再將<a href="https://milvus.io/docs/rbac.md">RBAC</a>視為獨立的管理任務，而是將存取控制更貼近使用者日常操作的資料庫與集合標籤頁。</p>
<p>底層模型仍為 Milvus RBAC：使用者、角色、<a href="https://milvus.io/docs/grant_privileges.md">權限</a>、授予與撤銷。Attu 3.0 簡化了圍繞此模型的操作路徑。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖片：Attu 3.0 中的情境化使用者與權限管理</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">常見權限範圍的一鍵建立使用者</h3><p>在 Attu 2.x 中，若要為某個集合開啟唯讀存取權限，通常需經過多個步驟：建立使用者、建立角色、設定權限、將角色指派給使用者，並確認範圍設定正確。</p>
<p><strong>在 Attu 3.0 中，您只需開啟集合，前往「使用者」分頁，點擊「建立使用者」，選擇「唯讀」或「讀寫」，即可讓 Attu 自動完成工作流程。</strong>系統會建立使用者、生成安全密碼、建立對應的範圍角色，並套用授權。</p>
<p>此模式同樣適用於資料庫層級。您亦可一鍵授權現有使用者存取當前集合，或撤銷其存取權限。</p>
<p>此設計使權限管理緊貼受保護的資源。您無需在多個管理頁面間來回切換，也無需記住角色命名規範，僅需簡單操作即可為團隊成員授予範圍權限。</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">此 Beta 版本對 Attu 用戶的意義<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta 是自 Attu 首次發布以來，Milvus 管理主控台最重大的更新。</strong>這不僅是視覺上的改版<strong>，</strong>更擴展了 Attu 的功能範疇。</p>
<p>主要升級在於 Attu 現已更貼合許多 Milvus 用戶的實際工作模式：多叢集環境、持久的本地設定、更頻繁的資料移動、更嚴格的存取控制、更複雜的故障排除，以及在無需切換工具的情況下，更深入理解叢集行為的需求。</p>
<p>主要亮點包括：</p>
<ul>
<li>具備健康狀態指標與一鍵切換功能的多叢集管理。</li>
<li>針對叢集設定、偏好設定、LLM 設定、代理程式歷史紀錄及自訂技能的持久化本地狀態。</li>
<li>內建 AI 代理程式，整合 50 多種 Milvus 工具，並針對具破壞性的操作設置確認閘門。</li>
<li>四項內建專家診斷技能，涵蓋叢集健康狀態、搜尋效能、資料寫入及設定檢視。</li>
<li>重新設計的資料瀏覽器，具備資料庫 → 集合 → 分區的導覽功能，並提供更豐富的集合操作。</li>
<li>內建 Prometheus 指標、慢查詢分析、拓撲圖，以及備份與還原功能。</li>
<li>用於除錯與學習 Milvus API 的 REST API 實作環境。</li>
<li>RBAC 工作流程可直接在資料庫或集合旁執行，而不僅限於獨立的管理流程中。</li>
</ul>
<p>若您僅將 Attu 用於本地 Milvus 開發，3.0 版本將提供功能更強大的控制台。若您管理多個 Milvus 環境，光是多叢集與持久化狀態的改進就值得一試。 若您經常需調試效能或權限問題，Agent、診斷工具、指標以及情境式 RBAC 工作流程應能立即為您節省時間。</p>
<h2 id="Get-Started" class="common-anchor-header">立即開始<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 Docker 試用 Attu 3.0 Beta：</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>接著開啟：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>從側邊欄新增您的 Milvus 連線，並開始探索全新的控制台。</p>
<p>偏好桌面應用程式？請從<a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a> 下載適用於您平台的版本。Attu 3.0 Beta 提供 macOS、Linux 和 Windows 的桌面套件。最新版本還包含一個獨立的 Linux 伺服器套件，讓您無需 Docker 或 Electron 即可運行 Attu。</p>
<p><strong>有任何疑問嗎？</strong>歡迎將您的多叢集設定、自訂代理程式技能或診斷情境帶到<a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a>，或預約<a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus 辦公室時間</strong></a>，與社群一同解決問題。</p>
<p><strong>不想親自管理 Milvus 基礎架構？</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>是 Milvus 創建者推出的全託管平台。它保留了 Milvus API，並為即時向量搜尋、大規模資料探索及 AI 資料運算提供了託管基礎架構。 對於有資料主權需求的團隊，Zilliz Cloud<strong>BYOC</strong>可在您的自有雲端帳戶內運行，讓資料保留在您的 VPC 中，同時由 Zilliz 負責營運管理。</p>
