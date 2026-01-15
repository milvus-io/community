---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: 對 ChatGPT 和 Claude 記憶系統的反思：實現按需會話檢索所需的條件
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: 探索 ChatGPT 和 Claude 如何以不同的方式設計記憶體、為何按需會話檢索很難實現，以及 Milvus 2.6 如何在生產規模上實現。
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>在高品質的 AI 代理系統中，記憶體設計遠比表面上看起來複雜。其核心是必須回答三個基本問題：對話歷史應該如何儲存？何時應該檢索過去的上下文？以及應該擷取哪些內容？</p>
<p>這些選擇直接決定了代理的回應延遲、資源使用，以及最終的能力上限。</p>
<p>像 ChatGPT 和 Claude 這樣的模型，我們用得越多，就越覺得它們有「記憶感知」。它們會記住偏好、適應長期目標，並在各個階段中保持連續性。從這個意義上來看，它們已經發揮了迷你 AI 代理的功能。然而在表面之下，它們的記憶體系統是建立在非常不同的架構假設上。</p>
<p>最近對<a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>和<a href="https://manthanguptaa.in/posts/claude_memory/">Claude 的記憶體機制</a>進行的逆向工程分析揭示了一個明顯的對比。<strong>ChatGPT</strong>依賴預先計算的上下文注入和分層快取，來提供輕量、可預測的連續性。相比之下，<strong>Claude</strong>則採用 RAG 式的按需檢索與動態記憶體更新，以平衡記憶體深度與效率。</p>
<p>這兩種方法不僅是設計上的偏好，也是基礎架構能力所決定的。<a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a>引入了按需會話記憶體所需的混合密集-稀疏檢索、高效的標量篩選和分層儲存的組合，使得選擇性檢索既快速又經濟，足以部署在現實世界的系統中。</p>
<p>在這篇文章中，我們將介紹 ChatGPT 和 Claude 的記憶體系統實際上是如何運作的、為什麼兩者在架構上有差異，以及 Milvus 等系統的最新進展如何讓按需會話檢索在規模上變得實用。</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">ChatGPT 的記憶體系統<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>ChatGPT 並非在推理時查詢向量資料庫或動態檢索過去的會話，而是透過組合一組固定的上下文元件來建構「記憶體」，並將它們直接注入每個提示。每個元件都是事先準備好的，並在提示中佔有已知的位置。</p>
<p>這種設計在保持個人化和會話連續性的同時，也讓延遲、標記使用和系統行為更具可預測性。換句話說，記憶體不是模型隨機搜尋的東西，而是系統在每次產生回應時打包交給模型的東西。</p>
<p>從高層級來看，一個完整的 ChatGPT 提示包含下列層級，由最全局到最直接排列：</p>
<p>[0] 系統指示</p>
<p>[1] 開發者指示</p>
<p>[2] 會話元資料 (短暫)</p>
<p>[3] 使用者記憶 (長期事實)</p>
<p>[4] 最近對話摘要 (過去的對話、標題 + 片段)</p>
<p>[5] 目前會話訊息 (本次聊天)</p>
<p>[6] 您的最新訊息</p>
<p>在這些元件中，元件 [2] 到 [5] 構成系統的有效記憶體，各司其職。</p>
<h3 id="Session-Metadata" class="common-anchor-header">會話元資料</h3><p>會話元資料代表短暫、非持久性的資訊，會在對話開始時注入一次，並在會話結束時丟棄。它的作用是幫助模型適應目前的使用情境，而不是長期的個人化行為。</p>
<p>這一層擷取使用者的直接環境和最近使用模式的訊號。典型的訊號包括</p>
<ul>
<li><p><strong>裝置資訊</strong>- 例如，使用者使用的是行動裝置還是桌上型電腦</p></li>
<li><p><strong>帳戶屬性</strong>- 例如訂閱等級 (例如 ChatGPT Go)、帳戶年齡以及整體使用頻率</p></li>
<li><p><strong>行為指標</strong>- 包括過去 1 天、7 天和 30 天的活躍日數、平均對話長度和模型使用分佈 (例如，49% 的要求由 GPT-5 處理)</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">使用者記憶體</h3><p>使用者記憶體是一層持久、可編輯的記憶體，可讓您在對話中進行個人化。它儲存了相對穩定的資訊，例如使用者的姓名、角色或職業目標、正在進行的專案、過去的成果和學習偏好，並注入到每個新的會話中，以保持隨著時間的延續性。</p>
<p>這個記憶體可以用兩種方式更新：</p>
<ul>
<li><p><strong>顯式更新</strong>發生在使用者直接管理記憶體的時候，例如「記住這個」或「從記憶體中移除這個」。</p></li>
<li><p>當系統識別出符合 OpenAI 儲存標準的資訊 (例如經確認的姓名或職稱)，並根據使用者的預設同意和記憶體設定自動儲存這些資訊時，就會發生<strong>隱式更新</strong>。</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">最近對話摘要</h3><p>最近對話摘要是一個輕量級的跨會話情境層，可保持連續性，無須重播或擷取完整的聊天記錄。此摘要是預先計算的，並直接注入每段新對話中，而不是像傳統的 RAG 方法一樣依賴動態擷取。</p>
<p>此層僅摘要使用者訊息，不包括助理回覆。它有意限制了大小 - 通常約 15 個條目，而且只保留最近興趣的高層次訊號，而非詳細內容。由於它不依賴嵌入或相似性搜尋，因此延遲時間和代幣消耗量都很低。</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">目前會話訊息</h3><p>目前會話訊息包含正在進行的會話的完整訊息歷史，並提供連貫、逐漸回覆所需的短期上下文。這一層包含使用者輸入和助理回覆，但僅限於會話仍處於活動狀態時。</p>
<p>由於模型是在固定的代幣限制內運作，因此這個歷史記錄無法無限制地成長。當達到限制時，系統會刪除最早的訊息，以騰出空間給更新的訊息。這種截斷只會影響目前的會話：長期的使用者記憶和最近的對話摘要都會保持不變。</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">Claude 的記憶體系統<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude 採取了不同的記憶體管理方式。Claude 並非如 ChatGPT 般，在每個提示中注入一大束固定的記憶體元件，而是將長期使用者記憶體與隨選工具和選擇性檢索結合。歷史上下文只有在模型判斷為相關時才會被擷取，讓系統可以在上下文深度與計算成本之間進行權衡。</p>
<p>Claude 的提示上下文結構如下：</p>
<p>[0] 系統提示 (靜態指令)</p>
<p>[1] 使用者記憶</p>
<p>[2] 對話記錄</p>
<p>[3] 目前訊息</p>
<p>Claude 與 ChatGPT 的主要差異在於<strong>如何擷取對話記錄</strong>，以及<strong>如何更新和維護使用者記憶體</strong>。</p>
<h3 id="User-Memories" class="common-anchor-header">使用者記憶</h3><p>在 Claude 中，用戶記憶體形成了一個長期的上下文層，其目的與 ChatGPT 的用戶記憶體相似，但更強調自動、背景驅動的更新。這些記憶體以結構化的格式儲存 (以 XML 風格的標籤包覆)，並設計成隨著時間逐漸演進，只需使用者最少的介入。</p>
<p>Claude 支援兩種更新路徑：</p>
<ul>
<li><p><strong>隱含更新</strong>- 系統會定期分析會話內容，並在背景中更新記憶體。這些更新不會即時套用，與刪除對話相關的記憶體也會逐漸修剪，作為持續最佳化的一部分。</p></li>
<li><p><strong>明確更新</strong>- 使用者可透過「記住此項」或「刪除此項」等指令直接管理記憶體，這些指令會透過專用的<code translate="no">memory_user_edits</code> 工具執行。</p></li>
</ul>
<p>與 ChatGPT 相比，Claude 讓系統本身承擔了更大的責任來精煉、更新和修剪長期記憶體。這降低了使用者主動整理儲存內容的需求。</p>
<h3 id="Conversation-History" class="common-anchor-header">對話記錄</h3><p>對於對話歷史，Claude 不會依賴固定的摘要來注入每個提示。相反地，只有在模型認為有必要時，它才會使用三種不同的機制檢索過去的情境。這可以避免將不相關的歷史記錄帶到後面，並控制代幣的使用。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>元件</strong></th><th style="text-align:center"><strong>目的</strong></th><th style="text-align:center"><strong>使用方式</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>滾動視窗 (目前對話)</strong></td><td style="text-align:center">儲存目前對話的完整訊息歷史 (不是摘要)，類似 ChatGPT 的會話上下文。</td><td style="text-align:center">自動注入。代幣限制為 ~190K；一旦達到限制，較舊的訊息會被丟棄</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>工具</strong></td><td style="text-align:center">依主題或關鍵字搜尋過去的對話，返回對話連結、標題和使用者/助理訊息摘錄</td><td style="text-align:center">當模型確定需要歷史詳細資訊時觸發。參數包括<code translate="no">query</code> (搜尋詞) 和<code translate="no">max_results</code> (1-10)</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>工具</strong></td><td style="text-align:center">擷取指定時間範圍內的近期對話（例如「過去 3 天」），結果格式與<code translate="no">conversation_search</code></td><td style="text-align:center">最近、時間範圍內的內容相關時觸發。參數包括<code translate="no">n</code> (結果數量)、<code translate="no">sort_order</code> ，以及時間範圍</td></tr>
</tbody>
</table>
<p>在這些元件中，<code translate="no">conversation_search</code> 特別值得注意。即使是對於措辭鬆散或多語言的查詢，它也能浮現出相關的結果，顯示出它是在語意層面上運作，而不是依賴於簡單的關鍵字匹配。這可能涉及到基於嵌入的檢索，或是一種混合方法，首先將查詢翻譯或規範化為標準形式，然後應用關鍵字或混合檢索。</p>
<p>總體而言，Claude 的按需檢索方法有幾個顯著的優點：</p>
<ul>
<li><p><strong>檢索不是自動的</strong>：工具呼叫是由模型本身的判斷所觸發的。例如，當使用者提到<em>「上次我們討論過的專案」</em>時<em>，</em>Claude 可能會決定呼叫<code translate="no">conversation_search</code> 來擷取相關的上下文。</p></li>
<li><p><strong>在需要時提供更豐富的上下文</strong>：擷取的結果可以包含<strong>助理回應摘錄</strong>，而 ChatGPT 的摘要只擷取使用者訊息。這使得 Claude 更適合需要更深入或更精確的對話內容的使用個案。</p></li>
<li><p><strong>更高的預設效率</strong>：由於除非需要，否則不會注入歷史情境，因此系統可避免攜帶大量不相關的歷史情境，減少不必要的代幣消耗。</p></li>
</ul>
<p>權衡取捨同樣明顯。導入隨選檢索會增加系統複雜度：必須建立和維護索引、執行查詢、對結果進行排序，有時還要重新排序。端對端延遲的可預測性也比預先計算、總是注入上下文的方式低。此外，模型必須學習決定何時需要檢索。如果判斷失敗，可能根本不會擷取相關的上下文。</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">Claude 式按需檢索背後的限制條件<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>採用按需檢索模型使得向量資料庫成為架構的關鍵部分。會話檢索對儲存和查詢執行都有異常高的要求，系統必須同時滿足四個限制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1.低延遲容忍度</h3><p>在會話系統中，P99 延遲通常需要維持在 ~20 毫秒以下。超過 20 毫秒的延遲會立即被使用者察覺。這讓低效率的空間所剩無幾：向量搜尋、元資料過濾和結果排序都必須小心優化。任何一點的瓶頸都可能降低整個會話體驗。</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2.混合搜尋需求</h3><p>使用者查詢通常跨越多個層面。像<em>「過去一週有關 RAG 的討論」</em>這樣的請求結合了語義相關性與基於時間的篩選。如果資料庫僅支援向量搜尋，它可能會傳回 1,000 個語意相似的結果，但應用程式層的篩選功能只能將它們減少到一小撮，浪費了大部分的計算。為了實用，資料庫必須原生支援向量與標量的結合查詢。</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3.儲存與運算分離</h3><p>對話記錄顯示出明顯的冷熱存取模式。最近的對話會被頻繁查詢，而較舊的對話則很少被碰觸。如果所有向量都必須保留在記憶體中，則儲存數千萬個對話將會消耗數百 GB 的 RAM，在規模上是不切實際的成本。為了可行，系統必須支援儲存與運算分離，將熱資料保存在記憶體中，冷資料保存在物件儲存中，並依需求載入向量。</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4.多樣化的查詢模式</h3><p>會話檢索並不遵循單一的存取模式。有些查詢是純粹的語意查詢（例如，<em>「我們討論的效能最佳化」）</em>，有些則是純粹的時間查詢（<em>「上星期的所有會話」）</em>，還有許多是結合多重限制條件的查詢（<em>「過去三個月內提到 FastAPI 的 Python 相關討論」）</em>。資料庫查詢規劃器必須針對不同的查詢類型調整執行策略，而不是依賴一刀切的暴力搜尋。</p>
<p>這四項挑戰共同定義了會話式檢索的核心限制。任何尋求實現 Claude 式按需檢索的系統都必須以協調的方式解決所有這些問題。</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">為什麼 Milvus 2.6 在對話式檢索方面運作良好<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a>的設計選擇與按需會話檢索的核心需求緊密結合。以下是關鍵功能的細分，以及它們如何映射到實際的會話檢索需求。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">密集與稀疏向量的混合檢索</h3><p>Milvus 2.6 原生支援在同一個集合中儲存密集向量和稀疏向量，並在查詢時自動融合它們的結果。密集向量（例如由 BGE-M3 等模型產生的 768 維嵌入）可捕捉語義相似性，而稀疏向量（通常由 BM25 產生）則可保留精確的關鍵字訊號。</p>
<p>對於<em>「上周有關 RAG 的討論」這</em>樣的查詢，Milvus 會平行執行語意檢索和關鍵字檢索，然後透過重新排序來合併結果。與單獨使用其中一種方法相比，這種混合策略在真實的會話情境中提供了顯著更高的召回率。</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">儲存-運算分離與查詢最佳化</h3><p>Milvus 2.6 以兩種方式支援分層儲存：</p>
<ul>
<li><p>熱資料在記憶體中，冷資料在物件儲存中</p></li>
<li><p>索引在記憶體中，原始向量資料在物件儲存中</p></li>
</ul>
<p>使用這種設計，只需大約 2 GB 記憶體和 8 GB 物件儲存空間，即可儲存一百萬個會話項目。只要調整得宜，即使啟用儲存與運算分離，P99 延遲仍可維持在 20 毫秒以下。</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">JSON 切碎和快速標量過濾</h3><p>Milvus 2.6 預設啟用 JSON Shredding，將嵌套的 JSON 欄位扁平化為柱狀儲存。根據官方基準，這可將標量篩選效能提升 3-5倍 (實際效能會因查詢模式而異)。</p>
<p>對話式擷取通常需要依使用者 ID、會話 ID 或時間範圍等元資料進行篩選。有了 JSON Shredding，類似<em>「過去一週來自使用者 A 的所有對話」</em>的查詢可以直接在列索引上執行，而不需重複解析完整的 JSON blob。</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">開放原始碼控制與操作彈性</h3><p>身為開放原始碼系統，Milvus 提供了封閉式黑盒解決方案所沒有的架構與作業控制層級。團隊可以調整索引參數、應用資料分層策略，以及自訂分散式部署，以符合其工作負載。</p>
<p>這種靈活性降低了進入門檻：中小型團隊可以建立百萬到千萬級別的會話檢索系統，而無需依賴過大的基礎架構預算。</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">為什麼 ChatGPT 和 Claude 走不同的道路<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>從高層次來看，ChatGPT 和 Claude 記憶系統的差異在於各自如何處理遺忘。ChatGPT 傾向於主動遺忘：一旦記憶體超過固定的限制，舊的上下文就會被丟棄。這樣就以完整性換取了簡單性和可預測的系統行為。Claude 則偏向於延遲遺忘。理論上，對話記錄可以無限制地增長，而召回則交由隨需檢索系統處理。</p>
<p>那麼，為什麼這兩個系統選擇了不同的路徑？有了上述的技術限制，答案就很清楚了：<strong>每種架構只有在底層基礎建設能夠支援的情況下才可行</strong>。</p>
<p>如果 Claude 的方法是在 2020 年嘗試，很可能不切實際。當時，向量資料庫通常會產生數百毫秒的延遲，混合查詢的支援也很差，而且資源使用量會隨著資料的增加而擴大，令人望而卻步。在這種情況下，按需檢索會被視為過度工程。</p>
<p>到了 2025 年，情況已經改變。由<strong>Milvus 2.6</strong>等系統驅動的基礎架構進展，讓儲存與計算分離、查詢最佳化、密集與稀疏混合檢索，以及 JSON Shredding 在生產中變得可行。這些進步降低了延遲、控制了成本，並使選擇性檢索在規模上變得可行。因此，按需工具和基於檢索的記憶體不僅可行，而且越來越有吸引力，尤其是作為代理式系統的基礎。</p>
<p>歸根結柢，架構的選擇是跟隨基礎建設所提供的可能性。</p>
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
    </button></h2><p>在現實世界的系統中，記憶體設計並不是預先計算上下文與依需求檢索之間的二元選擇。最有效的架構通常是混合式的，結合了這兩種方法。</p>
<p>常見的模式是透過滑動上下文視窗注入最近的會話內容，將穩定的使用者偏好儲存為固定記憶體，並透過向量搜尋按需檢索較舊的歷史記錄。隨著產品的成熟，這種平衡可以逐漸轉變 (從主要的預先計算情境轉變為越來越多的擷取驅動)，而不需要破壞性的架構重設。</p>
<p>即使一開始使用預先計算的方法，設計時也必須考慮到移轉的問題。記憶體應該以清楚的識別碼、時間戳記、類別和來源參照來儲存。當檢索變得可行時，就可以為現有的記憶體產生嵌入，並與相同的元資料一併加入向量資料庫，讓檢索邏輯可以逐步導入，並將干擾降到最低。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
