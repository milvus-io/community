---
id: harness-engineering-ai-agents.md
title: Harness Engineering：AI 代理實際需要的執行層
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: Harness Engineering 圍繞自主 AI 代理建立執行環境。瞭解它是什麼、OpenAI 如何使用它，以及為何需要混合搜尋。
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto 建立了 HashiCorp 並共同創造了 Terraform。在 2026 年 2 月，他發表了一篇<a href="https://mitchellh.com/writing/my-ai-adoption-journey">部落</a>格<a href="https://mitchellh.com/writing/my-ai-adoption-journey">文章</a>，描述他在與 AI 代理合作時養成的習慣：每次代理犯錯時，他都會在代理的環境中設計一個永久性的修正。他稱之為 「工程線束」。在幾個星期之內，<a href="https://openai.com/index/harness-engineering/">OpenAI</a>和<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a>都發表了工程文章來擴展這個想法。<em>線束工程</em>」一詞就此出現。</p>
<p>這個詞之所以能引起共鳴，是因為它點出了每個建立<a href="https://zilliz.com/glossary/ai-agents">AI 代理的</a>工程師都會遇到的問題。<a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">迅速工程（Prompt engineering）</a>能讓您得到更好的單次轉換輸出。情境工程則是管理模型所看到的內容。但兩者都無法解決代理程式自主運行數小時，在沒有監督的情況下做出數百個決策時會發生的問題。這就是 Harness Engineering 所要填補的缺口 - 而且它幾乎總是依賴混合搜尋 (混合全文和語意搜尋) 才能運作。</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">什麼是 Harness Engineering？<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Harness Engineering 是圍繞自主式 AI 代理設計執行環境的學科。它定義了代理程式可以呼叫哪些工具、從何處獲得資訊、如何驗證自己的決策，以及何時應該停止。</p>
<p>若要瞭解其重要性，請考慮 AI 代理程式開發的三個層次：</p>
<table>
<thead>
<tr><th>層級</th><th>優化的內容</th><th>範圍</th><th>範例</th></tr>
</thead>
<tbody>
<tr><td><strong>提示工程</strong></td><td>您對模型所說的話</td><td>單一交換</td><td>寥寥數語的範例、連續思考的提示</td></tr>
<tr><td><strong>情境工程</strong></td><td>模型可以看到的內容</td><td><a href="https://zilliz.com/glossary/context-window">情境視窗</a></td><td>文件檢索、歷史壓縮</td></tr>
<tr><td><strong>控制工程</strong></td><td>代理運作的世界</td><td>多小時自主執行</td><td>工具、驗證邏輯、架構限制</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong>優化單次交換的品質 - 措辭、結構、範例。一次對話，一次輸出。</p>
<p><strong>Context Engineering（上下文工程）</strong>管理模型一次可以看到的資訊數量 - 檢索哪些文件、如何壓縮歷史記錄、哪些內容適合放在上下文視窗中，哪些內容會被刪除。</p>
<p><strong>Harness Engineering</strong>建立代理操作的世界。工具、知識來源、驗證邏輯、架構限制 - 一切都決定了代理程式是否能在沒有人為監督的情況下，可靠地執行數百個決策。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>AI 代理程式開發的三個層次：提示工程（Prompt Engineering）會優化您所說的話，情境工程（Context Engineering）會管理模型所看到的東西，而控制工程（Harness Engineering）則會設計執行環境</span> </span>。</p>
<p>前兩個層次會影響單次轉彎的品質。前兩個層次會影響單一回合的品質，而第三個層次則會影響代理程式是否能在沒有您監視的情況下運作數小時。</p>
<p>這些都不是相互競爭的方法。它們是一種進步。隨著代理程式能力的成長，同一個團隊通常會在單一專案中完成所有三個層次。</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">OpenAI 如何使用 Harness Engineering 建立百萬行的程式碼庫，以及他們汲取的教訓<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI 進行了一項內部實驗，將 Harness Engineering 具體化。他們在工程博文<a href="https://openai.com/index/harness-engineering/">「Harness Engineering：在代理先行的世界中利用 Codex」。</a>2025 年 8 月底，一個三人團隊從一個空的儲存庫開始。在五個月的時間裡，他們自己沒有寫任何程式碼 - 每一行都是由 OpenAI 的 AI 授能編碼代理 Codex 所產生。結果是：100 萬行生產代碼和 1,500 個合併拉取請求。</p>
<p>有趣的部分不在於產出。而是他們遇到的四個問題，以及他們建立的線束層解決方案。</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">問題 1：沒有共同理解的程式碼庫</h3><p>代理應該使用哪個抽象層？命名慣例是什麼？上週的架構討論在哪裡？在沒有答案的情況下，代理程式反覆猜測 - 而且猜錯。</p>
<p>第一個直覺是一個包含所有慣例、規則和歷史決定的單一<code translate="no">AGENTS.md</code> 檔案。它失敗的原因有四。情境是稀缺的，而臃腫的指令檔會排擠實際的任務。當所有東西都被標示為重要時，就沒有東西是重要的了。文件會腐爛 - 第 2 週的規則到了第 8 週就會變得錯誤。扁平化的文件無法進行機械驗證。</p>
<p>解決方法：將<code translate="no">AGENTS.md</code> 縮小到 100 行。不是規則 - 是地圖。它指向一個結構化的<code translate="no">docs/</code> 目錄，包含設計決策、執行計畫、產品規格和參考文件。Linters 和 CI 會驗證交叉連結是否保持完整。代理程式可以精確地導航到它所需要的東西。</p>
<p>其基本原則是：如果某樣東西在執行時不在上下文中，對代理來說它就不存在。</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">問題 2：人工 QA 無法跟上代理程式輸出的速度</h3><p>團隊將 Chrome DevTools Protocol 插入 Codex。代理可以截取 UI 路徑、觀察運行時事件、使用 LogQL 查詢日誌，以及使用 PromQL 查詢度量。他們設定了一個具體的臨界值：服務必須在 800 毫秒內啟動，任務才算完成。Codex 任務一次執行超過六小時 - 通常是在工程師睡覺的時候。</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">問題 3：沒有限制的架構漂移</h3><p>在沒有防護措施的情況下，代理程式會複製它在 repo 中找到的任何模式，包括不良模式。</p>
<p>解決方法：嚴格的分層架構與單一強制依存方向 - 類型 → 配置 → Repo → 服務 → 運行時 → UI。客製化處理器以機械方式強制執行這些規則，其錯誤訊息包含內嵌的修正指令。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>具有單向依賴驗證的嚴格分層架構：類型在最底層，使用者介面在最上層，客製化處理器以內嵌修正建議來強制執行規則。</span> </span></p>
<p>在人類團隊中，當公司的規模擴大到數百個工程師時，通常會出現這種限制。對於編碼代理來說，這是從第一天開始的先決條件。代理程式在沒有約束的情況下移動得越快，架構偏移就越嚴重。</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">問題 4：無聲的技術債務</h3><p>解決方案：將專案的核心原則編碼到儲存庫中，然後在排程中執行背景 Codex 任務，掃描偏差並提交重構 PR。大部分都在一分鐘內自動合併 - 小額持續付款，而非定期清算。</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">為什麼 AI 代理無法為自己的工作評分？<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI 的實驗證明 Harness Engineering 是有效的。但獨立的研究揭露了其中的失敗模式：代理系統性地不擅長評估自己的輸出。</p>
<p>這個問題以兩種形式出現。</p>
<p><strong>情境焦慮。</strong>隨著情境視窗的填滿，代理人開始過早結束任務 - 不是因為工作已經完成，而是因為他們感覺到視窗的限制快到了。Cognition 是人工智能編碼代理 Devin 背後的團隊，他們在為 Claude Sonnet 4.5 重建 Devin<a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">時記錄了這種行為</a>：模型開始意識到自己的上下文視窗，並在實際空間耗盡之前就開始走捷徑。</p>
<p>他們的解決方案是純粹的線束工程。他們啟用了 1M 代幣上下文測試版，但將實際使用量限制在 20 萬代幣 - 誘騙模型相信它有足夠的空間。焦慮消失了。不需要變更模型，只需要更聰明的環境。</p>
<p>最常見的一般緩解方法是壓縮：總結歷史，讓相同的代理程式繼續使用壓縮的上下文。這可以保持連續性，但不會消除基本行為。另一種方法是重新設定上下文：清除視窗、啟動新的實例，並透過結構化的藝術品交接狀態。這完全消除了焦慮的觸發點，但需要完整的交接文件 - 工件中的缺口意味著新代理程式在理解上的缺口。</p>
<p><strong>自我評估偏差。</strong>當代理員評估自己的成果時，他們會打高分。即使是在有客觀合格/不合格標準的任務上，代理程式也會發現問題，說服自己相信問題並不嚴重，並批准應該失敗的工作。</p>
<p>解決方案借用了 GAN（生成式輔助網路）：將生成器與評估器完全分離。在 GAN 中，兩個神經網路互相競爭 - 一個產生，一個判斷 - 敵對的緊張關係會迫使品質提升。同樣的動力也適用於<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">多重代理系統</a>。</p>
<p>Anthropic 使用三個代理系統 (規劃者、產生者、評估者) 來測試這一點，並與單獨代理進行對戰，以完成建立 2D 復古遊戲引擎的任務。他們在<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a>（Anthropic，2026）中描述了完整的實驗。規劃者（Planner）將簡短的提示擴展為完整的產品規格，刻意不指定實作細節 - 早期的過度規格會連帶造成下游錯誤。生成器在 sprint 中實現功能，但在編寫程式碼之前，會與評估者簽署 sprint 契約：共同定義「完成」。評估者使用 Playwright（微軟的開放源碼瀏覽器自動化框架），像真實使用者一樣點擊應用程式，測試 UI、API 和資料庫行為。如果有任何失敗，衝刺就會失敗。</p>
<p>單獨代理產生的遊戲在技術上可以啟動，但實體與運行時間的連接在程式碼層級上被破壞 - 只能透過閱讀原始碼來發現。三個代理程式製作了一個可玩的遊戲，並有 AI 輔助的關卡生成、縮圖動畫和音效。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>單獨代理與三代理線束的比較：單獨代理以九美元的價格運行了 20 分鐘，但核心功能遭到破壞，而完整的線束以二百美元的價格運行了六小時，產生了具有 AI 輔助功能的完整遊戲。</span> </span></p>
<p>三代理架構的成本大約高出 20 倍。輸出從不可用到可用。這就是 Harness Engineering 所做的核心交易：以結構開銷換取可靠性。</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">每個代理系統內的檢索問題<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>這兩種模式 - 結構化的<code translate="no">docs/</code> 系統和產生器/評估器的衝刺週期 - 都有一個無聲的依賴關係：代理必須在需要時，從一個活的、不斷演進的知識庫中找到正確的資訊。</p>
<p>這比看起來更難。舉個具體的例子：產生器正在執行衝刺 3，實作使用者驗證。在寫程式碼之前，它需要兩種資訊。</p>
<p>首先是<a href="https://zilliz.com/glossary/semantic-search">語意搜尋查詢</a>：<em>這個產品圍繞使用者會話的設計原則是什麼？</em>相關的文件可能會使用「會話管理」或「存取控制」，而不是「使用者驗證」。如果不瞭解語意，檢索就會遺漏。</p>
<p>第二，完全匹配查詢：<em>哪些文件引用了<code translate="no">validateToken</code> 函式？</em>函式名稱是一個沒有語義的任意字串。<a href="https://zilliz.com/glossary/vector-embeddings">基於嵌入的檢索</a>無法可靠地找到它。只有關鍵字匹配才有效。</p>
<p>這兩個查詢是同時發生的。這兩個查詢是同時發生的，無法分開依序進行。</p>
<p>純<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋在</a>精確匹配上失敗。傳統的<a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a>在語意查詢上失敗，無法預測文件會使用哪個詞彙。在 Milvus 2.5 之前，唯一的選擇是兩個並行的檢索系統 - 向量索引和<a href="https://milvus.io/docs/full-text-search.md">全文索引</a>- 在查詢時透過自訂的結果融合邏輯同時執行。對於持續更新的 Live<code translate="no">docs/</code> 儲存庫，兩個索引必須保持同步：每次文件變更都會觸發兩個地方的重新索引，持續存在不一致的風險。</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Milvus 2.6 如何使用單一混合管道解決代理檢索問題<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是專為 AI 工作負載設計的開放原始碼<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>。Milvus 2.6 的 Sparse-BM25 將雙管道擷取問題彙整為單一系統。</p>
<p>在擷取時，Milvus 會同時產生兩個表示：一個用於語義檢索<a href="https://milvus.io/docs/sparse_vector.md">的</a> <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集嵌入</a>，以及一個用於 BM25 評分<a href="https://milvus.io/docs/sparse_vector.md">的 TF 編碼稀疏向量</a>。全局<a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF 統計資料</a>會隨著文件的新增或移除而自動更新，無須手動重新索引。在查詢時，自然語言輸入會在內部產生這兩種查詢向量類型。<a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF)</a>會合併排序結果，呼叫者會收到單一的統一結果集。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>使用前後：兩個獨立系統使用手動同步、分散的結果以及自訂的融合邏輯，與 Milvus 2.6 單一管道使用密集嵌入、Sparse BM25、RRF 融合以及自動 IDF 維護產生統一結果的結果比較。</span> </span></p>
<p>一個介面。只需維護一個索引。</p>
<p>在<a href="https://zilliz.com/glossary/beir">BEIR 基準</a>(涵蓋 18 個異質檢索資料集的標準評估套件) 上，Milvus 在相同召回率的情況下，比 Elasticsearch 的吞吐量高出 3-4 倍，在特定工作負載上更可提升高達 7 倍的 QPS。在 sprint 情境中，單一查詢即可找到會話設計原則 (語意路徑) 以及提及<code translate="no">validateToken</code> 的每篇文件 (精確路徑)。<code translate="no">docs/</code> 儲存庫持續更新；BM25 IDF 維護意味著新撰寫的文件可參與下一次查詢的評分，而無需進行任何批次重建。</p>
<p>這正是針對這類問題所建立的檢索層。當代理驅動需要搜尋一個活生生的知識庫 - 程式碼文件、設計決策、衝刺歷史 - 單管道混合搜尋並不是一個很好的必要條件。單管道混合式搜尋並不是一個美中不足的功能，它能讓系統的其他部分正常運作。</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">最好的線束元件是設計來刪除的<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>線束中的每個元件都編碼了一個關於模型限制的假設。當模型在長時間的任務中失去連貫性時，Sprint 分解是必要的。當模型在接近視窗極限時感到焦慮時，情境重設是必要的。當自我評估偏差無法控制時，評估者代理就變得必要了。</p>
<p>這些假設過期了。當模型發展出真正的長情境耐力時，認知的情境-視窗技巧可能會變得沒有必要。隨著模型持續改進，其他元件也會變成不必要的開銷，拖慢代理程式的速度，卻沒有增加可靠性。</p>
<p>Harness Engineering 並不是一個固定的架構。它是一個隨著每個新模型發行而重新調整的系統。任何重大升級後的第一個問題不是「我可以增加什麼？而是「我可以移除什麼？</p>
<p>同樣的邏輯也適用於檢索。隨著模型能更可靠地處理較長的上下文，分塊策略和擷取時間也會隨之改變。今天需要仔細分塊的資訊，明天可能就能以整頁的形式被擷取。檢索基礎架構會隨著模型而調整。</p>
<p>精心打造的系統中的每個元件都在等待著被更聰明的模型所取代。這不是問題。這是我們的目標。</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">開始使用 Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您正在建置需要混合檢索的代理基礎架構 - 在同一管道中進行語意與關鍵字搜尋 - 請從這裡開始：</p>
<ul>
<li>閱讀<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 發行紀錄</strong></a>，瞭解 Sparse-BM25、自動 IDF 維護和效能基準的完整細節。</li>
<li>加入<a href="https://milvus.io/community"><strong>Milvus 社群</strong></a>，提出問題並分享您的建置成果。</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>預約免費的 Milvus Office Hours 課程</strong></a>，與向量資料庫專家討論您的使用個案。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>(完全管理 Milvus) 提供免費的層級，只要使用工作電子郵件註冊，就能獲得 100 美元的免費點數。</li>
<li>在 GitHub 上加入我們的星級：<a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a>- 43k+ stars 且仍在成長中。</li>
</ul>
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">什麼是線束工程 (harness engineering)，與提示工程 (prompt engineering) 有何不同？</h3><p>提示工程優化您在單次交換中對模型所說的內容 - 措辭、結構、範例。線束工程（Harness Engineering）圍繞自主式 AI 代理建立執行環境：它可以呼叫的工具、它可以存取的知識、檢查其工作的驗證邏輯，以及防止架構偏移的限制。提示工程塑造了一個會話的轉彎。Harness Engineering 會影響一個代理是否可以在沒有人為監督的情況下，在數百個決策中穩定地運作數小時。</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">為什麼 AI 代理同時需要向量搜尋和 BM25？</h3><p>代理必須同時回答兩個根本不同的檢索查詢。語意查詢 -<em>我們圍繞使用者會話的設計原則是什麼？</em>- 語義查詢 - 我們圍繞使用者會話的設計原則是什麼？完全匹配查詢 -<em>哪些文件參考了<code translate="no">validateToken</code> 函式？</em>- 需要 BM25 關鍵字評分，因為函式名稱是沒有語意的任意字串。只處理一種模式的檢索系統會系統性地遺漏其他類型的查詢。</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Milvus Sparse-BM25 如何用於代理知識檢索？</h3><p>在擷取時，Milvus 會同時為每個文件產生密集嵌入和 TF 編碼的稀疏向量。全局 IDF 統計資料會隨著知識庫的變化而即時更新 - 不需要手動重新索引。在查詢時，這兩種向量類型都會在內部產生，互惠排序融合（Reciprocal Rank Fusion）會合併排序結果，代理程式會收到單一的統一結果集。整個管道透過單一介面和單一索引執行，這對於持續更新的知識庫（例如程式碼文件儲存庫）來說非常重要。</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">我應該在何時將評估器代理加入代理程式束？</h3><p>當您的產生器輸出品質無法單靠自動化測試來驗證，或自我評估偏差導致遺漏缺陷時，請加入獨立的評估器。關鍵原則：評估器在架構上必須與產生器分離 - 共用上下文會重新產生您試圖消除的偏差。評估者應該可以使用執行時工具（瀏覽器自動化、API 呼叫、資料庫查詢）來測試行為，而不只是檢閱程式碼。Anthropic 的<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">研究</a>發現，這種由 GAN 啟發的分離方式，讓輸出品質從「技術上已啟動但已損壞」轉變為「功能完整，且獨奏者從未嘗試的功能」。</p>
