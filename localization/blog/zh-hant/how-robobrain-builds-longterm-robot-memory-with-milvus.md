---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: RoboBrain 如何利用 Milvus 建立機器人的長期記憶
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: 機器人模組可以單獨工作，但連鎖起來就會失效。Senqi AI 執行長解釋 RoboBrain 如何使用任務狀態、回饋和 Milvus 記憶體。
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>本篇文章的作者是森奇人工智能的 CEO 宋智，森奇人工智能是一家為機器人建立任務執行基礎架構的人工智能公司。RoboBrain 是 Senqi AI 的核心產品之一。</em></p>
<p>大多數的機器人功能都能獨立運作。導航模型可以規劃路線。感知模型可以識別物件。語音模組可以接受指令。當這些功能必須作為一項連續任務執行時，生產失敗就會出現。</p>
<p>對於機器人來說，像「去檢查那個區域，拍下任何不尋常的東西，然後通知我」這樣的簡單指令，需要在任務開始之前進行規劃、在運行過程中進行適應，並在任務完成時產生有用的結果。每次交接都有可能發生故障：導航在障礙物後凍結，模糊的照片被接受為最終結果，或者系統忘記了五分鐘前處理過的異常。</p>
<p>這就是在實體世界中運作的<a href="https://zilliz.com/glossary/ai-agents">AI 代理所面</a>臨的核心挑戰。與數位代理不同的是，機器人的執行對象為連續的<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>：受阻的路徑、變化的光線、電池限制、感測器雜訊以及操作員規則。</p>
<p>RoboBrain 是 Senqi AI 用於機器人任務執行的具體智能操作系統。它位於任務層，連接感知、規劃、執行控制和資料回饋，讓自然語言指令成為結構化、可回收的機器人工作流程。</p>
<table>
<thead>
<tr><th>突破點</th><th>生產中的失敗</th><th>RoboBrain 如何解決</th></tr>
</thead>
<tbody>
<tr><td>任務規劃</td><td>含糊的指令讓下游模組沒有具體的執行領域。</td><td>任務物件化將意圖轉換成共享狀態。</td></tr>
<tr><td>情境路由</td><td>正確的資訊存在，但到達錯誤的決策階段。</td><td>分層記憶體可分別路由即時、短期和長期的情境。</td></tr>
<tr><td>資料回饋</td><td>單次執行完成或失敗，都無法改善下一次執行。</td><td>反饋回寫會更新任務狀態和長期記憶體。</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">機器人任務執行中的三個分界點<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>軟體任務通常可以輸入、過程和結果進行界分。機器人任務的執行對象為移動中的實體狀態：受阻的路徑、變化中的光線、電池限制、感測器雜訊以及操作員規則。</p>
<p>這就是為什麼任務循環需要的不只是孤立的模型。它需要一種跨越規劃、執行和回饋來保存情境的方法。</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1.任務規劃：含糊的指示會產生含糊的執行</h3><p>像「去看看」這樣的短語隱藏了許多決定。哪個區域？機器人應該拍攝什麼？什麼才算不尋常？如果拍攝失敗該怎麼辦？它應該將什麼結果回傳給操作員？</p>
<p>如果任務層無法將這些細節解析為具體的欄位 - 目標區域、檢查對象、完成條件、失敗政策和回傳格式，則任務從一開始就會在沒有方向的情況下執行，並且永遠無法在下游恢復上下文。</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2.上下文路由：正確的資料到達錯誤的階段</h3><p>機器人堆疊可能已經包含正確的資訊，但任務執行取決於在正確的階段擷取這些資訊。</p>
<p>啟動階段需要地圖、區域定義和操作規則。執行中期需要即時的感測器狀態。異常處理需要先前部署的類似案例。當這些來源混亂時，系統就會在錯誤的情境下做出正確的決策。</p>
<p>當路由失敗時，啟動會使用陳舊的經驗而非區域規則，異常處理無法取得所需的案例，而執行中則會取得昨天的地圖而非即時讀數。給人一本字典並不能幫助他們寫一篇文章。資料必須在正確的階段，以正確的形式送達正確的決策點。</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3.資料回饋：單次執行無法改善</h3><p>如果沒有回寫，機器人可以完成一次執行，但不會改善下一次執行。已完成的動作仍需要品質檢查：影像是否夠清晰，還是機器人應該重新拍攝？路徑是否仍然清晰，還是應該繞道？電池電量是否超過臨界值，還是應該終止任務？</p>
<p>單程系統沒有這些呼叫機制。它會執行、停止，並在下次重複相同的失敗。</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">RoboBrain 如何關閉機器人任務循環<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain 將環境瞭解、任務規劃、執行控制和資料回饋連結成一個作業循環。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>RoboBrain 核心中介軟體架構顯示使用者意圖如何流經任務物件、Milvus 所提供的階段感知記憶體，以及策略引擎，最後才達到具體化能力。</span> </span></p>
<p>在這篇文章所描述的架構中，這個迴圈是透過三種機制來實現的：</p>
<ol>
<li><strong>任務物件化構</strong>成入口點。</li>
<li><strong>分層記憶體</strong>可將正確的資訊傳送至正確的階段。</li>
<li><strong>回饋迴圈會</strong>寫回結果，並決定下一步的行動。</li>
</ol>
<p>它們只能作為一個集合運作。如果只修復其中一個，而沒有修復其他的，則鏈條仍會在下一個點斷裂。</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1.任務物件化：將意圖轉化成共享狀態</h3><p>在執行開始之前，RoboBrain 會將每個指令轉換成任務物件：任務類型、目標區域、檢查物件、限制條件、預期輸出、目前階段和失敗政策。</p>
<p>重點不只是解析語言。重點在於提供每個下游模組相同的任務狀態檢視。沒有這個轉換，任務就沒有方向。</p>
<p>在巡邏的範例中，任務物件填入檢查類型、指定區域、異常項目作為檢查物件、電量 &gt;= 20% 作為限制條件、清晰的異常照片加上操作員警示作為預期輸出，以及返回基地作為失敗政策。</p>
<p>階段欄位會隨著執行變更而更新。障礙會將任務從導航移到繞道或請求協助。影像模糊會將任務從檢查移至重新拍攝。電池電力不足會將任務移至終止或返回基地。</p>
<p>下游模組不再接收孤立的指令。它們會收到目前的任務階段、其限制條件，以及階段改變的原因。</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2.分層記憶體：將上下文路由到正確的階段</h3><p>RoboBrain 將任務相關資訊分成三層，以便將正確的資料傳送到正確的階段。</p>
<p><strong>即時狀態</strong>儲存姿勢、電池、感測器讀數和環境觀察。它支援每個控制步驟的決策。</p>
<p><strong>短期情境</strong>記錄目前任務中的事件：機器人兩分鐘前避開的障礙、重新拍攝的照片，或是第一次打不開的門。它讓系統不會忘記剛剛發生了什麼。</p>
<p><strong>長期語義記憶體</strong>儲存了場景知識、歷史經驗、例外案例以及任務後的回覆。特定的停車區可能會因為表面反光而需要在夜間調整攝影機角度。某種異常類型可能有誤報的歷史，因此應該啟動人工檢視，而不是自動警示。</p>
<p>此長期層級透過<a href="https://milvus.io/">Milvus 向量資料庫</a>執行<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜尋</a>，因為擷取正確的記憶體意味著依意義比對，而非依 ID 或關鍵字比對。場景描述與處理記錄會以<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入的</a>方式儲存，並使用<a href="https://zilliz.com/glossary/anns">近似近鄰搜尋來</a>擷取，以找出最接近的語意匹配。</p>
<p>啟動時從長期記憶中提取區域規則和過去的巡邏摘要。執行中段則依賴即時狀態和短期情境。異常處理使用<a href="https://zilliz.com/glossary/semantic-search">語意搜尋在</a>長期記憶中尋找類似案例。</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3.回饋循環：將結果寫回系統</h3><p>RoboBrain 會在每個步驟之後將導航、感知和行動結果寫回任務物件，更新階段欄位。系統會讀取這些觀察結果，並決定下一步的動作：如果路徑無法到達，就繞道；如果影像模糊，就重新拍攝；如果門打不開，就重試；如果電池電力不足，就終止。</p>
<p>執行變成一個循環：執行、觀察、調整、再執行。這條鏈會不斷適應環境變化，而不會在第一次出現意料之外的情況時就斷掉。</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Milvus 如何為 RoboBrain 的長期機器人記憶體提供動力<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>有些機器人記憶體可以透過任務 ID、時間戳記或會話元資料來查詢。長期作業經驗通常不能。</p>
<p>有用的記錄通常是與目前場景在語意上相似的情況，即使任務 ID、位置名稱或措辭不同。這使得它成為<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>的問題，而 Milvus 則適合長期記憶層。</p>
<p>這個層級儲存的資訊包括</p>
<ul>
<li>區域規則描述和點位置語意</li>
<li>異常類型定義和範例摘要</li>
<li>歷史處理記錄和任務後檢查結論</li>
<li>任務完成時撰寫的巡邏摘要</li>
<li>人為接管後的經驗回寫</li>
<li>類似情境的故障原因與修正策略</li>
</ul>
<p>這些都不是結構化欄位所能自然鍵入的。所有這些都需要透過意義來回想。</p>
<p>一個具體的例子：機器人在夜間巡邏停車場入口。頭頂燈光刺眼，使得異常偵測不穩定。反光不斷被標記為異常。</p>
<p>系統需要回想在強烈夜間眩光下有效的重拍策略、類似區域的攝影機角度修正，以及將早期偵測標記為誤判的人工檢閱結論。完全匹配的查詢可以找到已知的任務 ID 或時間視窗。除非已標記該關聯關係，否則它無法可靠地顯示「先前的眩光個案與此個案的行為相似」。</p>
<p>語意相似性是有效的檢索模式。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">相似度指標會</a>依據相關性對儲存的記憶進行排序，<a href="https://milvus.io/docs/filtered-search.md">而元資料篩選則</a>可以依據區域、任務類型或時間視窗來縮窄搜尋空間。在實務上，這通常會變成<a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">混合式搜尋</a>：意義的語義比對，操作限制的結構化篩選。</p>
<p>對於實作而言，篩選層通常是將語義記憶變成操作的地方。<a href="https://milvus.io/docs/boolean.md">Milvus 過濾器表達式</a>定義標量約束，而<a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">Milvus 標量查詢</a>在系統需要元資料而非類似性的記錄時，支援精確查詢。</p>
<p>這種擷取模式類似於<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">擷取增強產生，</a>適用於實體世界的決策，而非文字產生。機器人不是透過檢索文件來回答問題，而是透過檢索先前的經驗來選擇下一個安全的動作。</p>
<p>Milvus 並非什麼東西都能讀取。任務 ID、時間戳記和會話元資料都儲存在關聯性資料庫中。原始的執行時間記錄則存放在記錄系統中。每個儲存系統都會處理它所建立的查詢模式。</p>
<table>
<thead>
<tr><th>資料類型</th><th>存放位置</th><th>查詢方式</th></tr>
</thead>
<tbody>
<tr><td>任務 ID、時間戳記、會話元資料</td><td>關聯式資料庫</td><td>精確查詢、連結</td></tr>
<tr><td>原始運行日誌和事件串流</td><td>日誌系統</td><td>全文檢索、時間範圍篩選器</td></tr>
<tr><td>場景規則、處理案例、經驗回寫</td><td>Milvus</td><td>依意義的向量相似性搜尋</td></tr>
</tbody>
</table>
<p>隨著任務的執行與場景的累積，長期記憶層會餵養下游流程：用於模型微調的樣本整理、更廣泛的資料分析，以及跨部署的知識轉移。記憶體複合成為資料資產，讓未來的每次部署都有更高的起點。</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">此架構在部署中的改變<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>任務客體化、分層記憶體與回饋迴圈將 RoboBrain 的任務迴圈轉變為部署模式：每項任務都會保留狀態，每次異常都能擷取先前的經驗，每次執行都能改善下一次。</p>
<p>巡邏一棟新大樓的機器人，如果已經在其他地方處理過類似照明、障礙、異常類型或操作員規則，就不應該再從頭開始。這樣才能讓機器人在不同場景下的任務執行更具重複性，也讓長期部署成本更容易控制。</p>
<p>對於機器人團隊而言，更深層的教訓是記憶體不只是儲存層。它是執行控制的一部分。系統需要知道它正在做什麼、剛改變了什麼、之前發生過哪些類似的情況，以及下次執行時應寫回哪些內容。</p>
<h2 id="Further-Reading" class="common-anchor-header">進一步閱讀<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您正在研究機器人記憶、任務執行或具體人工智慧的語意檢索等類似問題，這些資源都是有用的下一步：</p>
<ul>
<li>閱讀<a href="https://milvus.io/docs">Milvus 文件</a>或嘗試<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門</a>，看看向量搜尋在實務中是如何運作的。</li>
<li>如果您正在規劃生產記憶體層級，請檢閱<a href="https://milvus.io/docs/architecture_overview.md">Milvus 架構概觀</a>。</li>
<li>瀏覽<a href="https://zilliz.com/vector-database-use-cases">向量資料庫使用案例</a>，瞭解更多生產系統中的語意搜尋範例。</li>
<li>加入<a href="https://milvus.io/community">Milvus 社群</a>，提出問題並分享您正在建立的東西。</li>
<li>如果您想要管理 Milvus，而不是運行您自己的基礎架構，請瞭解更多關於<a href="https://zilliz.com/cloud">Zilliz Cloud</a> 的資訊。</li>
</ul>
