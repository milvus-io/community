---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: 只要情境工程做得好，幻覺就能成為 AI 創造力的火花
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: 探索為什麼人工智慧的幻覺不只是錯誤，而是創意的火花，以及情境工程如何將這些幻覺轉化為可靠、真實的結果。
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>長久以來，包括我在內的許多人都把 LLM 幻覺視為缺陷而已。整個工具鏈都是圍繞著消除幻覺而建立的：檢索系統、警戒線、微調等等。這些保障措施仍然很有價值。但當我越深入研究模型實際上是如何產生反應，以及<a href="https://milvus.io/"><strong>Milvus</strong></a>等系統如何融入更廣泛的人工智能管道，我就越不相信幻覺只是失敗而已。事實上，它們也可能是 AI 創造力的火花。</p>
<p>如果我們看看人類的創造力，就會發現相同的模式。每一項突破都有賴於想像力的躍進。但這些躍進絕非憑空而來。詩人在打破常規之前，首先要掌握節奏和韻律。科學家在嘗試未經考驗的領域之前，會先依賴既有的理論。進步有賴於這些飛躍，只要它們是建基於扎實的知識和理解。</p>
<p>LLM 的運作方式也大致相同。他們所謂的 「幻覺 」或 「飛躍」--類比、聯想和推斷--源自於相同的產生過程，這個過程允許模型建立聯繫、擴展知識，並浮出水面，超越他們所接受的明確訓練。並非每次躍進都能成功，但當它成功時，結果可能會令人信服。</p>
<p>這就是為什麼我將<strong>情境工程</strong>視為關鍵的下一步。與其試圖消除每種幻覺，我們應該專注於<em>引導</em>它們。透過設計正確的情境，我們可以取得平衡 - 讓模型保持足夠的想像力，以探索新領域，同時確保它們保持足夠的穩定性，以獲得信任。</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">什麼是情境工程？<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>那麼<em>情境工程</em>到底是什麼意思呢？這個詞彙可能是新的，但實踐已演變多年。RAG、提示、函式呼叫和 MCP 等技術都是解決相同問題的早期嘗試：為模型提供適當的環境以產生有用的結果。情境工程就是將這些方法統一為一個連貫的框架。</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">上下文工程的三大支柱<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>有效的情境工程建立在三個相互關聯的層面上：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1.指示層 - 定義方向</h3><p>這一層包括提示、少量示例和示範。它是模型的導航系統：不只是含糊不清的「往北走」，而是有航點的明確路線。結構良好的指示會設定邊界、定義目標，並減少模型行為的模糊性。</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2.知識層 - 提供基本真相</h3><p>我們在這裡放置模型有效推理所需的事實、程式碼、文件和狀態。如果沒有這一層，系統就會從不完整的記憶中即興發揮。有了它，模型就可以將其輸出建立在特定領域資料的基礎上。知識越精確、越相關，推理就越可靠。</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3.工具層 - 啟用動作與回饋</h3><p>這一層涵蓋了 API、功能呼叫和外部整合。它使系統能夠從推理走向執行 - 擷取資料、執行計算或觸發工作流程。同樣重要的是，這些工具可提供即時回饋，並將回饋循環到模型的推理中。這些回饋有助於修正、適應和持續改善。實際上，這就是將 LLM 從被動的回應者轉變為系統的主動參與者的原因。</p>
<p>這些層級並非各自為政，而是相互加強。指令設定目的地，知識提供工作資訊，而工具則將決策轉化為行動，並將結果回饋到循環中。這些層級搭配得宜，就能創造出一個環境，讓模型既有創意又可靠。</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">長期挑戰：當多變少<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>許多人工智慧模型現在都宣稱有百萬字元的視窗，足以容納約 75,000 行的程式碼或 750,000 字的文件。但更多的上下文並不會自動產生更好的結果。實際上，非常長的上下文會帶來明顯的失敗模式，降低推理能力與可靠性。</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">上下文中毒 - 當不良資訊擴散時</h3><p>一旦虛假資訊進入工作上下文（無論是目標、摘要或中間狀態），就會破壞整個推理過程。<a href="https://arxiv.org/pdf/2507.06261">DeepMind 的 Gemini 2.5 報告</a>提供了一個明顯的例子。一個玩 Pokémon 遊戲的 LLM 代理誤讀了遊戲狀態，決定它的任務是「抓到抓不到的傳說」。這個錯誤的目標被記錄為事實，導致代理程式產生精心設計但不可能實現的策略。</p>
<p>如下節所示，中毒的上下文將模型困在一個循環中 - 重複錯誤、忽略常識、強化同樣的錯誤，直到整個推理過程崩潰。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 1：摘錄自<a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 技術文件</a></p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">上下文分心 - 迷失在細節中</h3><p>隨著上下文視窗的擴大，模型可能會開始過度重視謄本，而忽略了訓練期間所學到的知識。舉例來說，DeepMind 的 Gemini 2.5 Pro 可支援<a href="https://arxiv.org/pdf/2507.06261">一百萬個</a>代幣的視窗，但<a href="https://arxiv.org/pdf/2507.06261">在約 100,000 個代用代幣左右就開始偏移，重複使用</a>過去的動作，而不是產生新的策略。<a href="https://www.databricks.com/blog/long-context-rag-performance-llms">Databricks 的研究</a>顯示，較小的模型，例如 Llama 3.1-405B，在大約 ~32,000 代幣時就會更快達到這個極限。這是我們熟悉的人類效應：過多的背景閱讀，會讓你迷失方向。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 2：摘錄自<a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 技術文件</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 3：GPT、Claude、Llama、Mistral 和 DBRX 模型在 4 個 RAG 資料集 (Databricks DocsQA、FinanceBench、HotPotQA 和 Natural Questions) 上的長情境效能 [資料來源：</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em><em>。</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">上下文混淆 - 廚房裡的工具太多了</h3><p>增加更多工具並不總是有幫助。<a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboard</a>顯示，當上下文顯示廣泛的工具選單時 - 通常有許多不相干的選項 - 模型的可靠度就會降低，即使不需要工具也會被調用。一個明顯的例子：量化的 Llama 3.1-8B 在有 46 個工具可用的情況下失敗了，但當工具集減少到 19 個時卻成功了。這就是 AI 系統的選擇悖論 - 選擇太多，決策更差。</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">情境衝突 - 當資訊發生衝突時</h3><p>多輪互動增加了一個明顯的失敗模式：早期的誤解會隨著對話的分支而複雜化。在<a href="https://arxiv.org/pdf/2505.06120v1">微軟與 Salesforce 的實驗</a>中，開放式與封閉式 LLM 在多回合互動與單回合互動的情況下表現明顯較差，在六個世代的任務中平均下降 39%。一旦錯誤的假設進入對話狀態，接下來的回合就會繼承並擴大錯誤。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 4：在實驗中，LLM 在多回合會話中迷失。</em></p>
<p>即使在前沿模型中也會出現這種效果。當基準任務分佈在各個回合時，OpenAI 的 o3 模型的效能分數從<strong>98.1</strong>降到<strong>64.1</strong>。最初的誤讀有效地「設定」了世界模型；每個回覆都建立在它的基礎上，除非明確糾正，否則小矛盾會變成硬盲點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 4：LLM 多輪對話實驗中的表現分數</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">馴服長上下文的六種策略<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>應對長上下文挑戰的答案不是放棄這項能力，而是要有紀律地設計它。以下是我們在實踐中見過的六種有效策略：</p>
<h3 id="Context-Isolation" class="common-anchor-header">情境隔離</h3><p>將複雜的工作流程分割成具有隔離情境的專門代理程式。每個代理程式都專注於自己的領域，互不干擾，降低錯誤擴散的風險。這不僅能提高精確度，還能實現平行執行，就像結構良好的工程團隊一樣。</p>
<h3 id="Context-Pruning" class="common-anchor-header">情境修剪</h3><p>定期審核和修剪上下文。移除多餘的細節、陳舊的資訊以及不相關的痕跡。就像重組一樣：清除死的程式碼和依賴關係，只留下最重要的部分。有效的修剪需要明確的標準來判斷哪些是該做的，哪些是不該做的。</p>
<h3 id="Context-Summarization" class="common-anchor-header">上下文總結</h3><p>冗長的歷史不需要全部帶在身上。取而代之的是，將它們濃縮成簡潔的摘要，只捕捉下一步所需的重要內容。好的摘要能保留重要的事實、決策和限制，同時消除重複和不必要的細節。這就像是將 200 頁的規格說明書換成只有一頁的設計摘要，但仍能提供您前進所需的一切。</p>
<h3 id="Context-Offloading" class="common-anchor-header">情境卸載</h3><p>並非每個細節都需要成為即時上下文的一部分。將非關鍵資料儲存在外部系統中，例如知識庫、文件儲存庫或向量資料庫 (如 Milvus)，並只在需要時才取得。這樣可以減輕模型的認知負荷，同時保持背景資訊的可存取性。</p>
<h3 id="Strategic-RAG" class="common-anchor-header">策略性 RAG</h3><p>資訊檢索只有在有選擇性的情況下才會強大。透過嚴格的篩選和品質控制來引進外部知識，確保模型使用相關且精確的輸入。就像任何資料管道一樣：垃圾進、垃圾出，但有了高品質的擷取，背景資訊就會成為資產，而不是負債。</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">最佳化工具載入</h3><p>更多的工具並不等於更好的效能。研究顯示，超過 ~30 個可用工具後，可靠度就會大幅下降。只載入特定任務所需的功能，並關閉其餘功能的存取。精簡的工具箱可提高精確度，並減少可能影響決策的雜訊。</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">情境工程的基礎架構挑戰<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>情境工程的有效性取決於它所運行的基礎架構。現今的企業正面臨資料挑戰的完美風暴：</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">規模爆炸 - 從 Terabytes 到 Petabytes</h3><p>如今，資料增長已重新定義了基線。以往可輕鬆容納於單一資料庫的工作負載，如今已跨越數 PB，需要分散式儲存和運算。過去只需單一行 SQL 更新的模式變更，現在可能需要跨叢集、管道和服務進行全面的協調工作。擴充並不是簡單地增加硬體，而是要在每個假設都經過壓力測試的規模下，進行協調、彈性和彈性工程。</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">消費革命 - 會說 AI 的系統</h3><p>AI 代理不僅會查詢資料，還會以機器速度持續產生、轉換和消耗資料。僅為面向人類的應用程式所設計的基礎架構無法跟上。為了支援代理程式，系統必須提供低延遲的擷取、串流更新，以及不破壞的重寫工作負載。換句話說，基礎架構堆疊必須建置成能「說 AI 話」的原生工作負載，而不是事後才想到的。</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">多模式複雜性 - 多種資料類型，單一系統</h3><p>AI 工作負載融合了文字、影像、音訊、視訊和高維嵌入，每種資料都附有豐富的元資料。管理這種異質性是實際情境工程的關鍵。我們面臨的挑戰不只是儲存多樣化的物件，還要為它們建立索引、有效率地檢索它們，以及跨模式保持語意一致性。真正的 AI 就緒基礎架構必須將多模態視為一流的設計原則，而非附加功能。</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon：專為 AI 打造的資料基礎架構<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>規模、消費和多模態的挑戰不能單靠理論來解決，它們需要專為 AI 打造的基礎架構。這就是為什麼我們在<a href="https://zilliz.com/">Zilliz</a>設計<strong>Milvus</strong>和<strong>Loon</strong>的原因，讓兩者能合作解決問題的兩面：運行時的高效能檢索和上游的大規模資料處理。</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>：最廣泛採用的開源向量資料庫，已針對高效能向量擷取與儲存進行最佳化。</p></li>
<li><p><strong>Loon</strong>：我們即將推出的雲端原生多式樣資料湖服務，專門用於在資料到達資料庫之前處理和組織大規模的多式樣資料。敬請期待。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">快如閃電的矢量搜尋</h3><p><strong>Milvus</strong>專為向量工作負載而打造。作為服務層，它可以在 10 毫秒以下的時間內，對數以億計，甚至數十億計的向量進行檢索，無論這些向量是來自文字、圖像、音訊或視訊。對於人工智慧 (AI) 應用程式而言，擷取速度並不是一個「很好的條件」。它決定了代理是否感覺反應迅速或緩慢，搜尋結果是否感覺相關或脫節。這方面的效能直接體現在終端使用者的體驗上。</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">規模化的多模式資料湖服務</h3><p><strong>Loon</strong>是我們即將推出的多模態資料湖服務，專為大規模離線處理和分析非結構化資料而設計。它與 Milvus 在管道方面相輔相成，可在資料到達資料庫之前進行準備。現實世界中的多模態資料集橫跨文字、影像、音訊和視訊，往往雜亂無章，存在重複、雜訊和格式不一致等問題。Loon 使用 Ray 和 Daft 等分散式框架來處理這些繁重的工作，在直接將資料串流至 Milvus 之前，先將資料壓縮、重複和聚類。結果很簡單：沒有暫存瓶頸、沒有痛苦的格式轉換，只有模型可以立即使用的乾淨、結構化資料。</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">雲端原生彈性</h3><p>這兩個系統都是以雲端原生方式建立，儲存與運算可獨立擴充。這意味著當工作負載從數千兆位元組成長到數百億位元組時，您可以在即時服務與離線訓練之間平衡資源，而無需為其中一方過度配置或削減另一方的資源。</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">面向未來的架構</h3><p>最重要的是，此架構的設計可與您一同成長。情境工程仍在發展中。目前，大多數團隊都專注於語意搜尋與 RAG 管道。但是，下一波的需求將會更多--整合多種資料類型、跨資料類型進行推理，以及強化代理程式驅動的工作流程。</p>
<p>有了 Milvus 和 Loon，這種轉換不需要徹底改變您的基礎。支援今日用例的相同堆疊可以自然地延伸至明日的用例。您無需重新開始就能增加新功能，這意味著風險更低、成本更低，而且隨著人工智慧工作負載變得更複雜，您也能走得更順暢。</p>
<h2 id="Your-Next-Move" class="common-anchor-header">您的下一步<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>情境工程不只是另一門技術學科，而是我們如何發揮人工智慧的創意潛力，同時保持其穩固性與可靠性。如果您已準備好將這些想法付諸實踐，請從最重要的地方開始。</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>使用 Milvus 進行實驗</strong></a>，看看向量資料庫如何在實際部署中固定檢索。</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>關注 Milvus</strong></a>，瞭解 Loon 發佈的最新資訊，以及管理大規模多模組資料的心得。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>加入 Discord 上的 Zilliz 社群</strong></a>，分享策略、比較架構，並協助塑造最佳實務。</p></li>
</ul>
<p>今天掌握情境工程的公司將塑造明天的人工智能版圖。不要讓基礎架構成為限制，建立您的 AI 創造力應有的基礎。</p>
