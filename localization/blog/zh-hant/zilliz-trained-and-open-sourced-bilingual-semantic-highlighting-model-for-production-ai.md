---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: 我們為生產型 RAG 和 AI 搜尋訓練並開放源碼了一個雙語語義強調模型
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: 深入瞭解語義強調，瞭解 Zilliz 的雙語模型是如何建立的，以及它在 RAG 系統的中英文基準中的表現如何。
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>無論您要建立的是產品搜尋、RAG 管道或 AI 代理，使用者最終需要的都是相同的東西：一種快速瞭解結果為何相關的方式。<strong>高亮功能</strong>可標示支持匹配的精確文字，因此使用者不必掃描整個文件。</p>
<p>大多數系統仍然依賴於基於關鍵字的高亮顯示。如果使用者搜尋「iPhone 的效能」，系統就會高亮「iPhone」和「效能」這兩個關鍵字。但當文字使用不同的措辭來表達相同的概念時，這種方式就會失效。類似「A15 Bionic 晶片、基準測試超過 100 萬次、流暢無延遲」的描述很明顯是針對效能的，但由於關鍵字從未出現，因此沒有任何內容會被高亮顯示。</p>
<p><strong>語義高亮顯示</strong>解決了這個問題。它不匹配精確的字串，而是識別出在語義上與查詢一致的文字跨度。對於 RAG 系統、AI 搜尋和代理（相關性取決於意義而非表面形式）來說，這可以更精確、更可靠地解釋為什麼要擷取文件。</p>
<p>然而，現有的語意強調方法並非專為生產型 AI 工作負載所設計。在評估了所有可用的解決方案之後，我們發現沒有一個解決方案能夠提供 RAG 管道、代理系統或大規模網路搜尋所需的精確度、延遲、多語言涵蓋率或穩定性。<strong>因此，我們訓練了自己的雙語語意強調模型，並將其開放源碼。</strong></p>
<ul>
<li><p>我們的語意強調模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>請告訴我們您的想法-加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>、在<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> 上關注我們，或與我們預約<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20 分鐘的 Milvus Office Hours 課程</a>。</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">基於關鍵字的高亮度技術如何運作，以及為何在現代人工智能系統中失敗<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>傳統的搜尋系統透過簡單的關鍵字比對來實現高亮度</strong>。當傳回結果時，引擎會找出符合查詢的精確符號位置，並將它們包裝在標記中（通常是<code translate="no">&lt;em&gt;</code> 標籤），讓前端來呈現高亮效果。當查詢的字詞逐字出現在文字中時，這種方式運作良好。</p>
<p>問題在於這個模型假設相關性與精確的關鍵字重疊有關。一旦這個假設被打破，可靠性就會快速下降。任何以不同措辭表達正確想法的結果，即使擷取步驟是正確的，最終也不會有任何高亮顯示。</p>
<p>這個弱點在現代的 AI 應用程式中變得很明顯。在 RAG 管道和 AI 代理工作流程中，查詢更抽象、文件更長，而且相關資訊可能不會重複使用相同的字詞。基於關鍵字的高亮顯示無法再向開發人員或終端使用者顯示<em>答案的實際</em>位置，這使得整體系統即使在擷取工作達到預期效果時，也會讓人覺得不太精確。</p>
<p>假設使用者詢問<em>"「如何提高 Python 程式碼的執行效率？</em>系統從向量資料庫中擷取一份技術文件。傳統的高亮處理只能標示字面上的匹配，例如<em>「Python」、</em> <em>「程式碼」、</em> <em>「執行」</em>和<em>「效率」。</em></p>
<p>然而，文件中最有用的部分可能是</p>
<ul>
<li><p>使用 NumPy 矢量化操作代替顯式循環</p></li>
<li><p>避免在循環內重覆建立物件</p></li>
</ul>
<p>這些句子直接回答了問題，但它們不包含任何查詢詞彙。因此，傳統的高亮顯示完全失敗。文件可能是相關的，但使用者仍必須逐行掃描才能找到真正的答案。</p>
<p>這個問題在 AI 代理的情況下變得更加明顯。代理程式的搜尋查詢通常不是使用者的原始問題，而是透過推理和任務分解產生的衍生指令。舉例來說，如果使用者詢問<em>「您能分析最近的市場趨勢嗎？」，</em>代理程式可能會產生「擷取 2024 年第四季消費性電子產品的銷售資料、年成長率、主要競爭對手的市場佔有率變化，以及供應鏈成本波動」這樣的查詢。</p>
<p>此查詢跨越多個層面，並編碼了複雜的意圖。然而，傳統基於關鍵字的強調只能機械式地標示字面匹配，例如<em>「2024」、</em> <em>「銷售資料」</em>或<em>「成長率」。</em></p>
<p>與此同時，最有價值的洞察可能是這樣的：</p>
<ul>
<li><p>iPhone 15 系列推動更廣泛的市場復甦</p></li>
<li><p>晶片供應限制將成本推高 15</p></li>
</ul>
<p>這些結論可能與查詢不共用一個關鍵字，儘管它們正是代理商想要擷取的內容。代理需要從大量的檢索內容中快速識別出真正有用的資訊，而以關鍵字為基礎的高亮功能並不能提供真正的幫助。</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">什麼是語義高亮以及當今解決方案的痛點<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>語意高亮度建基於語意搜尋背後的相同理念：基於意義而非確切字詞進行匹配</strong>。在語意搜尋中，嵌入模型會將文字映射到向量中，因此搜尋系統（通常由<a href="https://milvus.io/">Milvus 之類</a>的向量資料庫支援）<a href="https://milvus.io/">可以擷取</a>與查詢傳達相同意思的段落，即使措辭不同也沒關係。語義強調將此原則應用在更細的粒度上。它不是標記字面上的關鍵字，而是高亮顯示文件中與使用者意圖在語意上相關的特定段落。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種方法解決了傳統高亮處理的核心問題，因為傳統高亮處理只有在查詢字詞逐字出現時才會起作用。如果使用者搜尋「iPhone 的效能」，則基於關鍵字的高亮度處理會忽略「A15 Bionic 晶片」、「超過一百萬的基準測試」或「流暢無延遲」等詞句，即使這些詞句清楚地回答了問題。語意高亮功能可以捕捉這些意義驅動的連結，並顯示使用者實際關心的文字部分。</p>
<p>理論上，這是一個直接的語意匹配問題。現代的嵌入模型已經很好地編碼了相似性，因此概念部分已經就位。挑戰來自於現實世界的限制：每次查詢都會出現高亮度，而且通常會跨越許多擷取的文件，這使得延遲、吞吐量和跨領域的穩健性成為不可商榷的要求。大型語言模型執行速度太慢、成本太高，根本無法在這種高頻率路徑中執行。</p>
<p>這就是為什麼實用的語意強調需要一個輕量、專門的模型 - 小到可以與搜尋基礎架構並列，快到可以在幾毫秒內傳回結果。這也是大多數現有解決方案的敗筆所在。重型模型能提供精確度，但無法大規模執行；輕型模型速度快，但精確度較低，或無法處理多語言或特定領域的資料。</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">OpenSearch 語義強調器</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>去年，OpenSearch 發表了一個專門用於語意強調的模型：<a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>。 儘管這是一個有意義的嘗試，但它有兩個重要的限制。</p>
<ul>
<li><p><strong>上下文視窗太小：</strong>該模型基於 BERT 架構，最多可支援 512 個字元 - 大約 300-400 個中文字元或 400-500 個英文字元。在現實世界的情境中，產品說明和技術文件通常長達數千字。超出第一個視窗的內容會被截斷，這就迫使模型只能根據文件的一小部分來識別重點。</p></li>
<li><p><strong>域外概括性差：</strong>模型僅在與訓練集相似的資料分佈上表現良好。當應用於域外資料時，例如使用在新聞文章上訓練的模型來強調電子商務內容或技術文件，其效能就會大幅下降。在我們的實驗中，該模型在域內資料上的 F1 得分值約為 0.72，但在域外資料集上則降至約 0.46。這種程度的不穩定性在生產中是有問題的。此外，該模型不支援中文。</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a>是由<a href="https://zilliz.com/customers/naver">Naver</a>開發的模型，最初是為了<strong>上下文剪枝</strong>而訓練的 - 這項任務與語意強調密切相關。</p>
<p>這兩項任務都是建基於相同的基本概念：使用語意匹配來識別相關內容，並過濾掉不相關的部分。因此，Provence 只需要相對較少的適應，就可以用來進行語意強調。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence 是一個純英文的模型，在這種環境下表現相當不錯。<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>是它的多語言變體，支援十多種語言，包括中文、日文和韓文。乍看之下，這讓 XProvence 似乎成為雙語或多語語義強調情境的最佳候選。</p>
<p>但實際上，Provence 和 XProvence 都有幾個明顯的限制：</p>
<ul>
<li><p><strong>在多語言模型中的英文表現較弱：</strong>XProvence 在英文基準上的表現比不上 Provence。這是多語言模型中常見的取捨方式：各種語言共用容量，通常會導致高資源語言 (例如英文) 的效能較弱。在英文仍是主要或主要工作負載的真實世界系統中，這個限制很重要。</p></li>
<li><p><strong>中文效能有限：</strong> XProvence 支援多種語言。在多語言訓練期間，資料和模型容量會分散到各種語言中，這限制了模型在任何單一語言中的專精程度。因此，它的中文效能只能勉強接受，對於高精確度的高亮度使用個案而言，往往是不足夠的。</p></li>
<li><p><strong>剪枝和高亮目標不匹配：</strong>Provence 已針對上下文剪枝進行最佳化，其優先考量是回憶 - 盡可能保留更多可能有用的內容，以避免遺失關鍵資訊。相比之下，語義高亮處理則強調精確度：只高亮最相關的句子，而不是文件的大部分。當普羅旺斯風格的模型應用於高亮度處理時，這種錯配往往會導致過度廣泛或嘈雜的高亮度處理。</p></li>
<li><p><strong>限制性授權：</strong>Provence 和 XProvence 都以 CC BY-NC 4.0 授權釋出，不允許商業使用。單是這項限制就使它們不適合許多生產部署。</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">開放式普羅旺斯</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a>是一個社群驅動的專案，以開放、透明的方式重新實作 Provence 訓練管道。它不僅提供訓練腳本，還提供資料處理工作流程、評估工具，以及多種規模的預訓模型。</p>
<p>Open Provence 的主要優勢在於其<strong>MIT 許可</strong>。與 Provence 和 XProvence 不同的是，它可以安全地在商業環境中使用，不受法律限制，這讓它對生產導向的團隊很有吸引力。</p>
<p>儘管如此，Open Provence 目前僅支援<strong>英文與日文</strong>，因此不適合我們的雙語使用案例。</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">我們訓練並開放源碼的雙語語意強調模型<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>針對實際工作負載所設計的語意強調模型必須具備幾項基本功能：</p>
<ul>
<li><p>強大的多語言性能</p></li>
<li><p>上下文視窗大到足以支援長文件</p></li>
<li><p>強大的域外泛化能力</p></li>
<li><p>語義高亮顯示任務的高精確度</p></li>
<li><p>對生產友善的許可證 (MIT 或 Apache 2.0)</p></li>
</ul>
<p>在評估現有的解決方案後，我們發現沒有一個可用的模型符合生產使用的需求。因此，我們決定訓練我們自己的語意高亮度模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>為了達成上述所有目標，我們採用了一種直接的方法：使用大型語言模型來產生高品質的標示資料，然後在此基礎上使用開放原始碼工具來訓練一個輕量級的語意高亮度模型。這讓我們可以結合 LLM 的推理強度與生產系統所需的高效率與低延遲。</p>
<p><strong>這個過程中最具挑戰性的部分是資料建構</strong>。在註解過程中，我們會提示 LLM (Qwen3 8B) 不僅輸出高亮區域，還會輸出其背後的整個推理。這個額外的推理信號可以產生更精確、一致的監督，並顯著改善所產生模型的品質。</p>
<p>在高層次上，註釋管道的運作如下：<strong>LLM 推理 → 高亮度標籤 → 篩選 → 最終訓練樣本。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種設計在實務上提供了三個具體的好處：</p>
<ul>
<li><p><strong>更高的標籤品質</strong>：模型會被提示<em>先思考，然後再回答</em>。這個中間推理步驟可作為內建的自我檢查，降低標籤膚淺或不一致的可能性。</p></li>
<li><p><strong>改進的可觀察性和可調試性</strong>：由於每個標籤都附有推理軌跡，因此錯誤變得可見。這可讓您更容易診斷失敗案例，並快速調整管道中的提示、規則或資料篩選器。</p></li>
<li><p><strong>可重複使用的資料</strong>：推理軌跡為未來重新標籤提供了寶貴的上下文。隨著需求的改變，相同的資料可以重新檢視與精進，而無需從頭開始。</p></li>
</ul>
<p>使用這個管道，我們產生了超過一百萬個雙語訓練樣本，大致平均分為英文和中文。</p>
<p>在模型訓練方面，我們從 BGE-M3 Reranker v2 (0.6B 參數、8,192-token 上下文視窗) 開始，採用 Open Provence 訓練框架，並在 8× A100 GPU 上進行三個 epochs 訓練，在大約五小時內完成訓練。</p>
<p>我們將在後續文章中深入探討這些技術選擇，包括為何要仰賴推理軌跡、如何選擇基礎模型，以及如何建構資料集。</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Zilliz 的雙語語意強調模型的基準測試<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>為了評估真實世界的效能，我們在不同的資料集上評估了多種語意強調模型。這些基準涵蓋了英文和中文的域內和域外情境，以反映生產系統中所遇到的各種內容。</p>
<h3 id="Datasets" class="common-anchor-header">資料集</h3><p>我們在評估中使用了下列資料集：</p>
<ul>
<li><p><strong>MultiSpanQA (英文)</strong>- 域內多跨度問題回答資料集</p></li>
<li><p><strong>WikiText-2 (英文)</strong>- 域外維基百科語料庫</p></li>
<li><p><strong>MultiSpanQA-ZH (中文)</strong>-<strong>中文</strong>多跨度問題回答資料集</p></li>
<li><p><strong>WikiText-2-ZH (中文)</strong>- 域外中文維基百科語料庫</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比較的模型</h3><p>包含在比較中的模型有</p>
<ul>
<li><p><strong>開放式 Provence 模型</strong></p></li>
<li><p><strong>Provence / XProvence</strong>(由 Naver 發佈)</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong></p></li>
<li><p><strong>Zilliz 的雙語語義高亮顯示模型</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">結果與分析</h3><p><strong>英文資料集：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>中文資料集：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在所有雙語基準中，我們的模型達到了<strong>最先進的平均 F1 分數</strong>，優於所有先前評估過的模型和方法。在<strong>中文資料集上</strong>的優勢尤其明顯，我們的模型顯著優於 XProvence--唯一支援中文的其他評估模型。</p>
<p>更重要的是，我們的模型在中英文兩種語言上都有均衡的表現，這是現有解決方案難以達到的特性：</p>
<ul>
<li><p><strong>Open Provence</strong>僅支援英文</p></li>
<li><p>與 Provence 相比，<strong>XProvence</strong>犧牲了英文效能</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong>缺乏中文支援，而且顯示出弱概括性</p></li>
</ul>
<p>因此，我們的模型避免了語言涵蓋範圍與效能之間的常見取捨，使其更適合實際世界中的雙語部署。</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">具體實例</h3><p>除了基準分數之外，研究一個具體的範例往往更能揭示問題。以下案例展示了我們的模型在真實語義強調場景中的表現，以及為什麼精確度很重要。</p>
<p><strong>查詢：</strong>誰寫了電影<em>The Killing of a Sacred Deer</em>？</p>
<p><strong>上下文（5 句話）：</strong></p>
<ol>
<li><p><em>殺戮神鹿》</em>是 Yorgos Lanthimos 於 2017 年執導的心理懸疑電影，劇本由 Lanthimos 和 Efthymis Filippou 共同編寫。</p></li>
<li><p>影片由科林-法瑞爾、妮可-基德曼、巴里-基漢、拉菲-卡西迪、桑尼-蘇爾基奇、艾麗西爾維斯通、比爾-坎普等主演。</p></li>
<li><p>故事改編自 Euripides 的古希臘劇作<em>Iphigenia in Aulis</em>。</p></li>
<li><p>電影講述一名心臟外科醫生與一名與他的過去有關的少年建立了秘密友誼。</p></li>
<li><p>他將男孩介紹給自己的家人，之後神秘的疾病開始發生。</p></li>
</ol>
<p><strong>正確的重點：第 1 句</strong>是正確答案，因為它明確指出劇本由 Yorgos Lanthimos 和 Efthymis Filippou 編寫。</p>
<p>此範例包含一個微妙的陷阱。<strong>第 3 句</strong>提到了 Euripides，他是原希臘劇本的作者，而故事正是根據這部劇本改編的。然而，問題問的是誰寫了這部<em>電影</em>，而不是古代的原始材料。因此正確答案是電影的編劇，而不是幾千年前的劇作家。</p>
<p><strong>結果：</strong></p>
<p>下表總結了不同模型在這個範例上的表現。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>模型</strong></th><th style="text-align:center"><strong>識別出的正確答案</strong></th><th style="text-align:center"><strong>結果</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>我們的（雙語 M3）</strong></td><td style="text-align:center">✓</td><td style="text-align:center">選擇句子 1 (正確) 和句子 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">只選了句子 3，錯過了正確答案</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">僅選擇句子 3，錯過正確答案</td></tr>
</tbody>
</table>
<p><strong>句子層級得分比較</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>句子</strong></th><th><strong>我們的 (雙語 M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">句子 1 (電影劇本，<strong>正確</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">句子 3 (原著劇本，分散注意力)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>XProvence 的不足之處</strong></p>
<ul>
<li><p>XProvence 強烈地被關鍵字<em>「Euripides」</em>和<em>「writed</em> <em>」</em>所吸引<em>，</em>給了句子 3 幾乎滿分 (0.947 和 0.802)。</p></li>
<li><p>同時，它基本上忽略了句子 1 中的正確答案，給予極低的分數 (0.133 和 0.081)。</p></li>
<li><p>即使將判斷臨界值從 0.5 降到 0.2，模型仍然無法浮現正確答案。</p></li>
</ul>
<p>換句話說，這個模型主要是由表面層級的關鍵字關聯所驅動，而非問題的實際意圖。</p>
<p><strong>我們的模型有什麼不同的表現</strong></p>
<ul>
<li><p>我們的模型給予句子 1 中的正確答案高分 (0.915)，正確指出<em>電影的編劇</em>。</p></li>
<li><p>它也給予句子 3 中等的分數 (0.719)，因為該句子確實提到編劇相關的概念。</p></li>
<li><p>最重要的是，這兩個句子的區分是清楚且有意義的：<strong>0.915 對比 0.719</strong>，差距接近 0.2。</p></li>
</ul>
<p>這個例子突顯了我們方法的核心優勢：超越關鍵字驅動的關聯，正確詮釋使用者的意圖。即使出現多個「作者」概念，模型也能一致地突出問題實際所指的那個概念。</p>
<p>我們將在後續文章中分享更詳細的評估報告和其他案例研究。</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">試用並告訴我們您的想法<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>我們已經在<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a> 上開放了我們的雙語語義高亮顯示模型，所有模型的權重都是公開的，因此您可以馬上開始實驗。我們很樂意聽取您的意見，請在試用過程中分享任何回饋、問題或改進想法。</p>
<p>與此同時，我們正在開發一個可投入生產的推理服務，並將模型直接整合到<a href="https://milvus.io/">Milvus</a>中，成為原生的 Semantic Highlighting API。這項整合工作已經在進行中，很快就會推出。</p>
<p>Semantic highlighting（語義強調）為更直觀的 RAG 和代理式 AI 體驗打開了大門。當 Milvus 擷取數個長文件時，系統可以立即浮現出最相關的句子，讓答案一目了然。這不僅改善了終端使用者的體驗，也透過準確顯示系統所依賴的上下文部分，協助開發人員除錯檢索管道。</p>
<p>我們相信語意高亮將成為下一代搜尋與 RAG 系統的標準功能。如果您對雙語語意高亮有任何想法、建議或使用案例，請加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，分享您的想法。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得深入的見解、指導和問題解答。</p>
