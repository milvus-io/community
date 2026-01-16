---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: LLM Context Pruning：開發人員指南：獲得更好的 RAG 和 Agentic AI 結果
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: 瞭解上下文剪枝如何在長上下文 RAG 系統中運作、為何這很重要，以及 Provence 等模型如何實現語意篩選和實際執行。
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>LLM 的上下文視窗最近變得很大。有些模型一次就可以使用一百萬個或更多的代幣，而且每個新版本似乎都在推高這個數字。這實在令人興奮，但如果您真的建立過任何使用長上下文的東西，您就會知道在<em>可能</em>與<em>有用</em>之間還有一段距離。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>僅僅因為一個模型<em>可以</em>在一次提示中讀完一整本書，並不代表你應該給它一次提示。大多數的長輸入都充滿了模型不需要的東西。一旦您開始將數以十萬計的代幣丟進一個提示，您通常會得到較慢的回應、較高的運算費用，有時甚至會得到品質較低的答案，因為模型試圖同時注意所有的事情。</p>
<p>因此，儘管上下文視窗不斷變大，真正的問題是：<strong>我們實際上應該把什麼放進去？</strong>這就是<strong>Context Pruning 的</strong>作用所在。基本上，它就是將擷取或組合的上下文中無法幫助模型回答問題的部分剪除的過程。正確的做法可以讓您的系統保持快速、穩定，而且更具可預測性。</p>
<p>在這篇文章中，我們將討論為何長上下文的表現往往與您預期的不同、剪枝如何幫助控制情況，以及<strong>Provence</strong>等剪枝工具如何融入實際的 RAG 管線，而不會讓您的設定變得更複雜。</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">長上下文系統的四種常見失敗模式<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>更大的上下文視窗不會神奇地讓模型變得更聰明。如果有的話，一旦您開始在提示中塞入大量資訊，您就會開啟一組全新的出錯方式。以下是您在建立長上下文或 RAG 系統時經常會看到的四個問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1.上下文衝突</h3><p>當多個回合累積的資訊出現內部矛盾時，就會發生上下文衝突 (Context Clash)。</p>
<p>例如，使用者可能會在對話初期說「我喜歡蘋果」，但後來又說「我不喜歡水果」。當這兩個語句都留在上下文中時，模型就沒有可靠的方法來解決衝突，導致不一致或猶豫不決的回應。</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2.上下文混淆</h3><p>當上下文包含大量不相關或弱相關的資訊，使得模型難以選擇正確的動作或工具時，就會發生上下文混淆。</p>
<p>這個問題在工具增強系統中尤其明顯。當上下文充斥著不相干的細節時，模型可能會誤解使用者的意圖而選擇錯誤的工具或動作，這並不是因為缺少正確的選項，而是因為信號被掩蓋在雜訊之下。</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3.情境分心</h3><p>當過多的上下文資訊支配了模型的注意力，降低了模型對預先訓練的知識和一般推理的依賴時，就會發生上下文分心。</p>
<p>模型不是依賴廣泛學習的模式，而是過度重視上下文中最近的細節，即使這些細節不完整或不可靠。這可能會導致淺層或脆性推理，過於緊貼上下文，而不是應用更高層次的理解。</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4.上下文中毒</h3><p>當不正確的資訊進入上下文，並在多個回合中重複被引用和強化時，就會發生上下文中毒。</p>
<p>在對話早期引入的單一錯誤陳述可能成為後續推理的基礎。隨著對話的繼續，模型會建立在這個錯誤的假設上，使錯誤更加複雜，並進一步偏離正確的答案。</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">什麼是上下文修剪以及為什麼它很重要<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦您開始處理較長的上下文，您很快就會意識到您需要不止一種技巧來控制事情。在真實的系統中，團隊通常會結合許多策略 - RAG、工具負載、總結、隔離特定訊息、卸載舊歷史等等。它們都有不同的幫助。但<strong>Context Pruning</strong>才是直接決定<em>哪些訊息實際會被送入</em>模型的方法。</p>
<p>簡單來說，情境修剪就是在不相關、低價值或衝突的資訊進入模型的情境視窗之前，自動將其移除的過程。它基本上是一個篩選器，只保留對目前任務最可能重要的文字片段。</p>
<p>其他策略可能會重新組織上下文、壓縮上下文，或將某些部分放在一旁以備日後使用。剪枝是更直接的：<strong>它回答的問題是：「這片資訊應該放入提示中嗎？</strong></p>
<p>這就是剪枝在 RAG 系統中特別重要的原因。矢量搜尋很棒，但並不完美。它經常會傳回一大堆的候選項 - 有些有用、有些關係不太密切、有些完全不靠譜。如果您只是將它們全部倒入提示，您就會遇到我們之前所說的失敗模式。剪枝功能位於檢索與模型之間，扮演著看門人的角色，決定要保留哪些資料塊。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>當剪枝運作良好時，好處就會立即顯現出來：更乾淨的上下文、更一致的答案、更低的符號使用量，以及更少因不相干文字潛入而產生的怪異副作用。即使您不改變任何檢索設定，增加一個可靠的剪枝步驟也可以明顯地改善整體系統效能。</p>
<p>實際上，剪枝是長內容或 RAG pipeline 中效率最高的優化之一，想法簡單，影響卻很大。</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence：實用的上下文剪枝模型<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>在探索情境剪枝的方法時，我發現<strong>Naver Labs Europe</strong> 開發了兩個引人注目的開放原始碼模型：<a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a>及其多語言變體<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence 是一種訓練輕量級上下文剪枝模型的方法，用於檢索增強生成，尤其專注於問題回答。對於使用者的問題和擷取的段落，它會識別並移除不相關的句子，只保留對最終答案有幫助的資訊。</p>
<p>Provence 透過在產生前修剪低價值內容，減少模型輸入的雜訊，縮短提示時間，並降低 LLM 推理的延遲時間。它也是隨插即用的，可與任何 LLM 或檢索系統搭配使用，不需要緊密整合或架構變更。</p>
<p>Provence 為真實世界的 RAG 管線提供了幾項實用功能。</p>
<p><strong>1.文件層級的理解</strong></p>
<p>Provence 將文件視為一個整體進行推理，而不是單獨對句子進行評分。這一點很重要，因為真實世界中的文件經常包含「it」、「this」或「the method above」等參照。單獨來看，這些句子可能模棱兩可，甚至毫無意義。如果從上下文來看，它們的相關性就會變得很清楚。透過對文件進行整體建模，Provence 可以產生更精確、更連貫的剪枝決策。</p>
<p><strong>2.適應性句子選擇</strong></p>
<p>Provence 會自動決定從擷取的文件中保留多少句子。Provence 不會依賴固定的規則，例如「保留前五個句子」，而是會適應查詢和內容。</p>
<p>有些問題只需要一個句子就能回答，而有些問題則需要多個支持語句。Provence 會動態處理這種變化，使用跨領域的相關性臨界值，並在需要時調整 - 在大多數情況下無需手動調整。</p>
<p><strong>3.整合重新排名的高效率</strong></p>
<p>Provence 專為高效率而設計。它是一個精簡、輕量級的模型，因此運行起來比基於 LLM 的剪枝方法更快、更便宜。</p>
<p>更重要的是，Provence 可以將重排和上下文剪枝結合為單一步驟。由於 Reranking 已經是現代 RAG 管道中的標準階段，因此在這個階段整合剪枝，使得上下文剪枝的額外成本接近于零，同時仍然可以改善傳送到語言模型的上下文品質。</p>
<p><strong>4.透過 XProvence 提供多語支援</strong></p>
<p>Provence 也有稱為 XProvence 的變體，它使用相同的架構，但在多語言資料上進行訓練。這使得它能夠評估跨語言的查詢和文件，例如中文、英文和韓文，使其適用於多語言和跨語言 RAG 系統。</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">如何訓練 Provence</h3><p>Provence 使用基於交叉編碼器架構的簡潔而有效的訓練設計。在訓練期間，查詢和每個擷取的段落都會串連成單一輸入，並一起編碼。這可讓模型一次觀察到問題和段落的完整上下文，並直接推理出它們的相關性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這種聯合編碼使 Provence 能夠從細粒度的相關性信號中學習。此模型在<a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a>上微調為輕量級編碼器，並優化為可同時執行兩項任務：</p>
<ol>
<li><p><strong>文件層級的相關性評分 (rerank score)：</strong>該模型會預測整個文件的相關性得分，顯示該文件與查詢的匹配程度。例如，0.8 分代表強相關。</p></li>
<li><p><strong>令牌層級相關性標籤 (二元掩碼)：</strong>與此同時，模型會為每個標記指定一個二進位標記，標示該標記與查詢是相關（<code translate="no">1</code> ）還是不相關（<code translate="no">0</code> ）。</p></li>
</ol>
<p>因此，經過訓練的模型可以評估文件的整體相關性，並辨識哪些部分應該保留或移除。</p>
<p>在推理時，Provence 會在標記層級預測相關性標籤。然後，這些預測會在句子層級彙總：如果一個句子包含的相關標記多於不相關標記，就會被保留；否則，就會被刪除。由於模型是在句子層級的監督下進行訓練的，因此同一句子中的標記預測趨於一致，這使得這種彙總策略在實務中非常可靠。剪枝行為也可以透過調整聚合臨界值來調整，以達到更保守或更進取的剪枝效果。</p>
<p>最重要的是，Provence 重複使用了大多數 RAG 管道已經包含的重排步驟。這表示情境剪枝的加入幾乎不需要額外的開銷，因此 Provence 對於現實世界的 RAG 系統來說特別實用。</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">評估不同模型的上下文剪枝效能<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前為止，我們專注於 Provence 的設計與訓練。下一步是評估它在實務中的表現：它修剪上下文的效果如何、與其他方法的比較如何，以及它在真實世界條件下的表現如何。</p>
<p>為了回答這些問題，我們設計了一組量化實驗，以比較實際評估環境中多種模型的上下文修剪品質。</p>
<p>這些實驗著重於兩個主要目標：</p>
<ul>
<li><p><strong>剪枝的有效性：</strong>我們使用精確度 (Precision)、召回率 (Recall) 和 F1 分數 (F1 score) 等標準指標，測量每個模型在移除不相關資訊的同時，保留相關內容的精確度。</p></li>
<li><p><strong>域外泛化：</strong>我們評估每個模型在不同於其訓練資料的資料分佈上的表現，以評估域外情境的穩健性。</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比較的模型</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>普羅旺斯</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a>(基於 BERT 架構的剪枝模型，專門設計用於語意強調任務)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">資料集</h3><p>我們使用 WikiText-2 作為評估資料集。WikiText-2 源自維基百科的文章，包含多樣化的文件結構，其中相關資訊通常分散在多個句子中，而且語意關係可能是非瑣碎的。</p>
<p>重要的是，WikiText-2 與一般用來訓練上下文剪枝模型的資料有很大的不同，但仍與真實世界中的知識含量高的內容相似。這使得它非常適合於域外評估，而這正是我們實驗的重點。</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">查詢產生與注釋</h3><p>為了建構領域外的剪枝任務，我們使用<strong>GPT-4o-mini</strong> 自動從原始 WikiText-2 語料庫產生問題-答案對。每個評估樣本由三個部分組成：</p>
<ul>
<li><p><strong>查詢：</strong>由文件產生的自然語言問題。</p></li>
<li><p><strong>上下文：</strong>完整、未修改的文件。</p></li>
<li><p><strong>Ground Truth：</strong>句子層級的注解，指出哪些句子包含答案 (要保留)，哪些句子不相關 (要剪枝)。</p></li>
</ul>
<p>此設定自然地定義了上下文剪枝任務：給予一個查詢和完整的文件，模型必須找出實際重要的句子。包含答案的句子會被標示為相關句子，並應該保留，而所有其他句子則會被視為不相關句子，並應該剪除。這種表達方式允許使用精確度 (Precision)、召回率 (Recall) 和 F1 得分來量化衡量剪枝品質。</p>
<p>最重要的是，產生的問題不會出現在任何評估模型的訓練資料中。因此，性能反映的是真正的泛化而不是記憶。我們總共產生了 300 個樣本，涵蓋簡單的事實問題、多跳推理任務以及更複雜的分析提示，以便更好地反映真實世界的使用模式。</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">評估管道</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>超參數最佳化：對於每個模型，我們會在預先定義的超參數空間中執行網格搜尋，並選擇能使 F1 得分最大化的配置。</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">結果與分析</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>結果顯示三種模型之間有明顯的效能差異。</p>
<p><strong>Provence</strong>的整體表現最強，<strong>F1 得數為 66.76%</strong>。它的精確度<strong>(69.53%</strong>) 和回復率<strong>(64.19%</strong>) 非常均衡，顯示出強大的域外泛化能力。最佳配置使用的剪枝臨界值為<strong>0.6</strong>和 α<strong>= 0.051</strong>，這表明模型的相關性分數校準良好，而且剪枝行為直觀，在實踐中很容易調整。</p>
<p><strong>XProvence</strong>的<strong>F1 得分值為 58.97%</strong>，特徵為<strong>高召回率 (75.52%)</strong>和<strong>較低精確度 (48.37%</strong> <strong>)</strong>。這反映出較為保守的剪枝策略，會優先保留可能相關的資訊，而非積極去除雜訊。這種行為在誤判成本高昂的領域中可能是可取的，例如醫療保健或法律應用程式，但它也會增加誤判，從而降低精確度。儘管如此，XProvence 的多語言功能使其成為非英語或跨語言環境的最佳選擇。</p>
<p>相比之下，<strong>OpenSearch Semantic Highlighter</strong>的表現差很多，<strong>F1 得分值為 46.37%</strong>（精確度<strong>62.35%</strong>，召回率<strong>36.98%</strong>）。相對於 Provence 和 XProvence 的差距顯示出得分校準和域外泛化的限制，尤其是在域外條件下。</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">語義強調：尋找文字中真正重要內容的另一種方法<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經討論過上下文剪枝，就值得看看謎題的相關部分：<a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>語義高亮</strong></a>。從技術上來看，這兩種功能所做的基本工作幾乎是一樣的，都是根據文字片段與查詢的相關程度來評分。差別在於如何在管道中使用結果。</p>
<p>大多數人聽到「高亮」就會想到 Elasticsearch 或 Solr 中的經典關鍵字高亮器。這些工具基本上是尋找字面上的關鍵字匹配，然後用<code translate="no">&lt;em&gt;</code> 之類的東西將它們包裝起來。這些工具既便宜又可預測，但它們只在文字使用與查詢<em>完全相同</em>的字詞時才會起作用。如果文件中使用了轉述、同義詞或不同的措辭，傳統的高亮工具就會完全錯過。</p>
<p><strong>語義高亮功能則採用不同的路徑。</strong>它不是檢查字串是否完全匹配，而是使用一個模型來估計查詢與不同文字之間的語義相似性。這讓它即使在措辭完全不同的情況下，也能高亮顯示相關內容。對於 RAG 管道、代理工作流程，或任何意義比字元更重要的 AI 搜尋系統而言，語意高亮可讓您更清楚地瞭解<em>為何要</em>擷取文件。</p>
<p>問題是，大多數現有的語意強調解決方案都不是針對生產型 AI 工作負載所設計的。我們測試了所有可用的解決方案，但沒有一個解決方案能提供真正的 RAG 和代理系統所需的精確度、延遲或多語言可靠性。因此，我們最後選擇訓練並開放我們自己的模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1。</a></p>
<p>從高層次來看，<strong>上下文剪枝和語意強調解決了相同的核心任務</strong>：給予一個查詢和一塊文字，找出哪些部分實際上是重要的。唯一的差別在於接下來會發生什麼。</p>
<ul>
<li><p><strong>上下文剪枝會</strong>在生成之前丟掉不相關的部分。</p></li>
<li><p><strong>語義高亮顯示則</strong>保留完整的文字，但會以視覺化的方式顯示重要的部分。</p></li>
</ul>
<p>由於底層作業非常類似，因此相同的模型通常可以支援這兩種功能。這讓堆疊中的元件更容易重複使用，並讓您的 RAG 系統整體上更簡單、更有效率。</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Milvus 和 Zilliz Cloud 中的語意強調功能</h3><p><a href="https://milvus.io">Milvus</a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>（Milvus的全面管理服務）現在已完全支援語意高亮（Semantic Highlighting）功能，而且它已經證明對任何使用RAG或AI驅動搜尋的人都非常有用。這項功能解決了一個非常簡單但令人頭痛的問題：當向量搜尋傳回大量的<em>句</em>群時，您該如何快速找出<em>這些句群中哪些句子是真正重要的</em>？</p>
<p>如果沒有高亮顯示功能，使用者最後只能閱讀整份文件，才能了解為什麼某些東西會被擷取。有了內建的語意高亮功能，Milvus 和 Zilliz Cloud 會自動標示與您的查詢在語意上相關的特定句子 - 即使措辭不同。無需再尋找關鍵字的匹配，或猜測某個區塊出現的原因。</p>
<p>這讓擷取更加透明。Milvus 不會只傳回「相關文件」，而是會顯示相關性的<em>所在</em>。對於 RAG 管道而言，這尤其有用，因為您可以立即看到模型應該注意的事項，讓除錯和提示建置變得更容易。</p>
<p>我們直接在 Milvus 和 Zilliz Cloud 中建立此支援，因此您不必為了取得可用的歸因，而附加外部模型或執行其他服務。一切都在檢索路徑中執行：向量搜尋 → 相關性評分 → 高亮顯示跨度。它可以開箱即用，並透過我們的<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>模型支援多語<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">言</a>工作負載。</p>
<h2 id="Looking-Ahead" class="common-anchor-header">展望未來<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>上下文工程仍是相當新的領域，還有許多問題有待解決。即使剪枝和語意高亮在<a href="https://milvus.io">Milvus</a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>中運作良好<strong>，</strong>我們仍遠未到故事的結尾。仍有許多領域需要真正的工程工作 - 在不拖慢速度的情況下讓剪枝模型更精確、更善於處理怪異或領域外的查詢，以及將所有部分串連起來，讓檢索 → 重排 → 剪枝 → 加亮感覺就像一個乾淨的管道，而不是一組黏在一起的黑客。</p>
<p>隨著上下文視窗不斷增加，這些決策也會變得更加重要。良好的上下文管理不再是「好的獎賞」；它已經成為讓長上下文和 RAG 系統可靠運作的核心部分。</p>
<p>我們將持續進行實驗、基準測試，並發送對開發人員真正有幫助的產品。我們的目標很簡單：讓系統更容易建立，不會在混亂的資料、不可預測的查詢或大規模的工作負載下發生故障。</p>
<p>如果您想要討論這些問題，或只是需要協助除錯某些東西，您可以跳到我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>，或透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得深入的瞭解、指導和問題解答。</p>
<p>我們很樂意與其他建置者聊天和交流。</p>
