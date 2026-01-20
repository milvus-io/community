---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: 我們如何為 RAG 上下文剪枝和代號儲存建立語意強調模型
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: 瞭解 Zilliz 如何使用僅編碼器架構、LLM 推理和大規模雙語訓練資料，為 RAG 雜訊過濾、上下文剪枝和符號儲存建立語意強調模型。
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">問題RAG 噪音與代幣浪費<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>矢量搜尋是</strong>RAG 系統 (企業助理、AI 代理、客戶支援機器人等) 的穩固基礎。它能可靠地找到重要的文件。但單靠檢索並不能解決上下文問題。即使是經過良好調校的索引，也只能傳回大致相關的文件塊，而在這些文件塊中，只有一小部分的句子能真正回答查詢。</p>
<p>在生產系統中，這個差距會立即顯示出來。單一查詢可能會帶來數十個文件，每個文件都有數千個文字。只有極少數的句子包含實際的訊號；其餘的都是上下文，這些上下文會增加標記的使用量、減慢推理速度，並經常分散 LLM 的注意力。在代理工作流程中，這個問題變得更加明顯，因為查詢本身就是多步推理的輸出，而且只符合擷取文字的一小部分。</p>
<p>這顯然需要一個模型，能夠<em><strong>識別並強調</strong></em> <em>有用的句子，而忽略其餘的</em>句子，也就是句子層級的相關性篩選，或許多團隊所說的<a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>上下文剪枝</strong></a>。目標很簡單：保留重要的部分，並在雜訊進入 LLM 之前將其剔除。</p>
<p>傳統的基於關鍵字的高亮度處理無法解決這個問題。舉例來說，如果使用者詢問「如何改善 Python 程式碼的執行效率？」，關鍵字高亮器會挑出「Python」和「效率」，但卻會錯過真正回答問題的句子 -「使用 NumPy 向量操作取代循環」，因為它與查詢的關鍵字並不相同。我們需要的是語意理解，而不是字串匹配。</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">用於 RAG 雜訊過濾與上下文剪枝的語意強調模型<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>為了讓 RAG 建置者能輕鬆處理這個問題，我們訓練了一個<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>Semantic Highlighting 模型</strong></a>並將其開放源碼，這個<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>模型</strong></a>可以識別並高亮顯示擷取的文件中與查詢在語意上更一致的句子。這個模型目前在英文和中文上都能提供最先進的效能，而且可以直接插入現有的 RAG 管道中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>模型詳細資料</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>原始碼授權類型</strong>MIT (商業友好)</p></li>
<li><p><strong>架構：</strong>基於 BGE-M3 Reranker v2 的 0.6B 純編碼器模型</p></li>
<li><p><strong>上下文視窗：</strong>8192 個字元</p></li>
<li><p><strong>支援的語言：</strong>英文和中文</p></li>
</ul>
<p>語義高亮（Semantic Highlighting）可提供僅選擇長檢索文件中有用部分所需的相關性信號。在實際應用中，此模型能夠</p>
<ul>
<li><p><strong>改善了可解釋性</strong>，顯示出文件中哪些部分實際上是重要的</p></li>
<li><p>只將高亮顯示的句子傳送至 LLM，<strong>令牌成本降低 70-80</strong></p></li>
<li><p><strong>更高的答案品質</strong>，因為模型看到的不相關上下文較少</p></li>
<li><p><strong>更容易除錯</strong>，因為工程師可以直接檢查句子層級的匹配結果</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">評估結果：達到 SOTA 效能</h3><p>我們在多個跨中英文的資料集上，在域內和域外的條件下，評估了我們的語意強調（Semantic Highlighting）模型。</p>
<p>基準套件包括</p>
<ul>
<li><p><strong>英文多跨度 QA：</strong>multispanqa</p></li>
<li><p><strong>英文域外維基百科：</strong>wikitext2</p></li>
<li><p><strong>中文多跨度 QA：</strong>multispanqa_zh</p></li>
<li><p><strong>中文域外維基百科：</strong>wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>評估的模型包括</p>
<ul>
<li><p>開放普羅旺斯系列</p></li>
<li><p>Naver的普羅旺斯/XProvence系列</p></li>
<li><p>OpenSearch 的語意詞彙查詢器</p></li>
<li><p>我們訓練的雙語模型：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>在所有四個資料集中，我們的模型都獲得了最高排名。更重要的是，它是<em>唯一一個</em>在英文和中文上都持續表現良好的模型。競爭對手的模型要麼只專注於英文，要麼在中文文本上表現明顯下降。</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">我們如何建立這個語意強調模型<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>為這項任務訓練一個模型並不是困難的部分；訓練一個能夠處理早期問題，並提供接近 SOTA 效能的<em>好</em>模型，才是真正的工作所在。我們的方法著重於兩點：</p>
<ul>
<li><p><strong>模型架構：</strong>使用僅編碼器的設計來進行快速推理。</p></li>
<li><p><strong>訓練資料：</strong>使用具備推理能力的 LLM 來產生高品質的相關性標記，並利用局部推理框架來擴大資料產生的規模。</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">模型架構</h3><p>我們建立的模型是一個輕量<strong>級</strong>的<strong>純編碼器</strong>網路，將上下文剪枝視為<strong>標記層級的相關性評分任務</strong>。這個設計的靈感來自 Naver 在 2025 年 ICLR 上推出的上下文剪枝方法<a href="https://arxiv.org/html/2501.16214v1">Provence</a>，該方法將剪枝從「選擇正確的大塊」轉變為「為每個標記評分」。這一框架與語義高亮自然地結合，在語義高亮中，細粒度信號是不可或缺的。</p>
<p>純編碼器模型並不是最新的架構，但在此仍然非常實用：它們速度快、易於擴展，而且可以並行產生所有標記位置的相關性評分。對於生產型 RAG 系統來說，速度上的優勢遠比使用較大的解碼器模型來得重要。</p>
<p>當我們計算出標記層級的相關性分數後，我們會將它們彙總成<strong>句子層級的</strong>分數。此步驟將嘈雜的標記訊號轉換成穩定、可解釋的相關度量。高於可設定臨界值的句子會被高亮顯示；其他的都會被濾除。這樣就產生了一個簡單可靠的機制，可以選擇對查詢真正重要的句子。</p>
<h3 id="Inference-Process" class="common-anchor-header">推理過程</h3><p>在執行時，我們的語意高亮度模型遵循一個簡單的管道：</p>
<ol>
<li><p><strong>輸入 -</strong>此流程從使用者查詢開始。擷取的文件會被視為相關性評估的候選上下文。</p></li>
<li><p><strong>模型處理 -</strong>將查詢和上下文串連成單一序列：[BOS] + 查詢 + 上下文</p></li>
<li><p>標記<strong>評分（Token Scoring）-</strong>上下文中的每個標記都會被分配一個 0 到 1 之間的相關性分數，以反映其與查詢的相關程度。</p></li>
<li><p><strong>句子彙整 -</strong>在句子層級彙整記號分數，通常是以平均方式彙整，以產生每個句子的相關性分數。</p></li>
<li><p><strong>閾值篩選 -</strong>分數高於可設定閾值的句子會高亮顯示並被保留，而低分數的句子則會在傳送到下游 LLM 之前被篩選出來。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">基本模型：BGE-M3 Reranker v2</h3><p>我們選擇 BGE-M3 Reranker v2 作為基礎模型有幾個原因：</p>
<ol>
<li><p>它採用適用於標記和句子評分的編碼器架構</p></li>
<li><p>支援多國語言，並針對英文和中文進行最佳化</p></li>
<li><p>提供適合較長 RAG 文件的 8192 個標記上下文視窗</p></li>
<li><p>可維持 0.6B 參數-足夠強而不重的計算量</p></li>
<li><p>確保基本模型有足夠的世界知識</p></li>
<li><p>針對重新排序進行訓練，這與相關性判斷任務密切吻合</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">訓練資料：LLM 註解與推理<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦我們敲定了模型架構，下一個挑戰就是建立一個可以實際訓練可靠模型的資料集。我們先看看 Open Provence 如何處理這個問題。他們的方法使用公共 QA 資料集和小型 LLM 來標示哪些句子是相關的。它的擴充性很好，而且很容易自動化，因此對我們來說是一個很好的基準。</p>
<p>但我們很快就遇到他們所描述的相同問題：如果您要求 LLM 直接輸出句子層級的標籤，結果並不總是穩定的。有些標籤是正確的，有些則有問題，而且事後很難清理。完全手動註釋也不是一種選擇，我們需要的資料遠遠超過手動標籤的數量。</p>
<p>為了在不犧牲可擴展性的前提下提高穩定性，我們做了一個改變：LLM 必須為它輸出的每個標記提供一個簡短的推理片段。每個訓練範例都包括查詢、文件、句子跨度，以及簡短解釋為何某個句子相關或不相關。這個小小的調整使得註解更為一致，也讓我們在驗證或除錯資料集時有具體的參考。</p>
<p>包含推理結果的價值令人驚訝：</p>
<ul>
<li><p><strong>更高的注釋品質：</strong>寫出理由可作為自我檢查，減少隨機或不一致的標籤。</p></li>
<li><p><strong>更好的可觀察性：</strong>我們可以看到<em>為什麼要</em>選擇某個句子，而不是把標籤當成黑箱。</p></li>
<li><p><strong>更容易除錯：</strong>當某些地方看起來不對勁時，推理可以讓我們很容易發現問題是出在提示、領域還是註解邏輯上。</p></li>
<li><p><strong>可重複使用的資料：</strong>即使我們將來改用不同的標籤模型，推理軌跡對於重新標籤或稽核仍然有用。</p></li>
</ul>
<p>註解工作流程如下</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">用於注釋的 Qwen3 8B</h3><p>在註解方面，我們選擇 Qwen3 8B，因為它原生支援透過輸出的 「思考模式」，讓我們更容易擷取一致的推理軌跡。較小的模型無法提供我們穩定的標籤，而較大的模型對於此類管道來說，速度較慢，而且不必要地昂貴。Qwen3 8B 在品質、速度和成本之間取得了適當的平衡。</p>
<p>我們使用<strong>本地 vLLM 服務</strong>而非雲端 API 來執行所有註解。這為我們提供了高吞吐量、可預測的效能，以及更低的成本 - 實質上是以 GPU 時間換取 API 代幣費用，在產生數百萬個樣本時，這是更划算的交易。</p>
<h3 id="Dataset-Scale" class="common-anchor-header">資料集規模</h3><p>我們總共建立了<strong>超過 5 百萬個雙語訓練樣本</strong>，大致平均分為英文和中文。</p>
<ul>
<li><p><strong>英文來源：</strong>MS MARCO、Natural Questions、GooAQ</p></li>
<li><p><strong>中文來源：</strong>DuReader, 中文維基百科, mmarco_chinese</p></li>
</ul>
<p>部分資料集來自重新註釋 Open Provence 等專案所使用的現有資料。其餘的資料則來自原始語料，方法是先建立查詢-上下文對，然後用我們基於推理的管道標籤它們。</p>
<p>所有註釋的訓練資料也可在 HuggingFace 上取得，供社群發展和訓練參考：<a href="https://huggingface.co/zilliz/datasets">Zilliz 資料集</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">訓練方法</h3><p>一旦模型架構和資料集準備就緒，我們就在<strong>8× A100 GPU</strong>上訓練模型，共進行了三個 epoch，從頭到尾大概花了<strong>9 個小時</strong>。</p>
<p><strong>注意：</strong>訓練只針對負責語義高亮工作的<strong>剪枝頭 (Pruning Head)</strong>。我們沒有訓練<strong>Rerank Head</strong>，因為只專注於剪枝目標對句子層級的相關性評分有更好的結果。</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">實際案例研究<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>基準只能說明部分情況，因此這裡有一個真實的例子，顯示模型在常見的邊緣情況下的表現：當檢索的文字同時包含正確答案和非常誘人的分心物時。</p>
<p><strong>查詢：</strong> <em>誰寫了《殺死一隻神鹿》？</em></p>
<p><strong>上下文 (5 句)：</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>正確答案：第 1 句 (明確指出「編劇：Lanthimos 和 Efthymis Filippou」)</p>
<p>此範例有一個陷阱：第 3 句提到「Euripides」寫了原著劇本。但問題問的是 「誰寫了電影 The Killing of a Sacred Deer」，答案應該是電影的編劇，而不是幾千年前的希臘劇作家。</p>
<h3 id="Model-results" class="common-anchor-header">模型結果</h3><table>
<thead>
<tr><th>模型</th><th>找到正確答案？</th><th>預測</th></tr>
</thead>
<tbody>
<tr><td>我們的模型</td><td>✓</td><td>選取的句子 1 (正確) 和 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>只選擇了句子 3，錯過了正確答案</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>只選擇了句子 3，錯過了正確答案</td></tr>
</tbody>
</table>
<p><strong>關鍵句得分比較：</strong></p>
<table>
<thead>
<tr><th>句子</th><th>我們的模型</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>句子 1 (電影劇本，正確答案)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>句子 3 (原著劇本，分散注意力)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>XProvence 模型：</p>
<ul>
<li><p>強烈被 "Euripides 「和 」play "所吸引，給予句子 3 接近完美的評分 (0.947 和 0.802)</p></li>
<li><p>完全忽略實際答案 (句子 1)，給予極低的評分 (0.133 和 0.081)</p></li>
<li><p>即使將門檻從 0.5 降到 0.2，仍找不到正確答案</p></li>
</ul>
<p>我們的模型：</p>
<ul>
<li><p>正確給予句子 1 最高分 (0.915)</p></li>
<li><p>由於句子 3 與背景相關，因此仍然給予句子 3 一些相關度 (0.719)</p></li>
<li><p>以 ~0.2 的差值將兩個句子清楚地分開</p></li>
</ul>
<p>這個範例顯示了模型的核心優勢：了解<strong>查詢意圖</strong>，而不只是匹配表面層級的關鍵字。在此上下文中，「<em>The Killing of a Sacred Deer</em>是誰寫的」指的是電影，而不是古希臘戲劇。我們的模型能夠捕捉到這一點，而其他模型則會被強烈的詞彙提示所干擾。</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">試試看，告訴我們您的想法<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>模型已在 MIT 授權下完全開放原始碼，並可供生產使用。您可以將它插入您的 RAG 管道、針對您自己的領域微調它，或是在它的基礎上建立新的工具。我們也歡迎社群的貢獻與回饋。</p>
<ul>
<li><p><strong>從 HuggingFace 下載</strong>：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>所有註解的訓練資料</strong> <a href="https://huggingface.co/zilliz/datasets">：https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">在 Milvus 和 Zilliz Cloud 中提供語意強調功能</h3><p>語意高亮功能也直接內建於<a href="https://milvus.io/">Milvus</a>與<a href="https://zilliz.com/cloud">Zilliz Cloud</a>(完全管理的 Milvus)，可讓使用者清楚瞭解擷取每份文件的<em>原因</em>。您不需要掃描整個文件塊，而是立即看到與您的查詢相關的特定句子 - 即使措辭並不完全相符。這讓擷取更容易理解，調試也更快速。對於 RAG 管道來說，它也釐清了下游 LLM 應該著重在哪些方面，這有助於快速設計和品質檢查。</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>免費試用全面管理的 Zilliz Cloud 中的 Semantic Highlighting 功能</strong></a></p>
<p>我們很樂意聽取您的使用心得，包括錯誤報告、改善構想，或是您在將其整合至工作流程時所發現的任何問題。</p>
<p>如果您想詳細討論任何問題，歡迎加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord 頻道</a>或預約 20 分鐘的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours 課程</a>。我們很樂意與其他建置者聊天並交換筆記。</p>
<h2 id="Acknowledgements" class="common-anchor-header">鳴謝<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>這項工作建基於許多偉大的想法和開放原始碼的貢獻，我們想要強調讓這個模型成為可能的專案。</p>
<ul>
<li><p><strong>Provence</strong>使用輕量級的編碼器模型，為上下文剪枝引入了簡潔實用的框架。</p></li>
<li><p><strong>Open Provence</strong>提供了一個穩固且精心設計的程式碼基礎 - 訓練管道、資料處理和模型頭 - 並提供許可證。它為我們提供了一個強大的實驗起點。</p></li>
</ul>
<p>在這個基礎上，我們加入了一些自己的貢獻：</p>
<ul>
<li><p>使用<strong>LLM 推理</strong>來產生更高品質的相關性標記</p></li>
<li><p>根據實際的 RAG 工作負載建立<strong>近 500 萬個</strong>雙語訓練樣本</p></li>
<li><p>選擇更適合長上下文相關性評分的基礎模型<strong>（BGE-M3 Reranker v2）</strong></p></li>
<li><p>僅訓練<strong>剪枝頭 (Pruning Head)</strong>，使模型專門用於語義強調</p></li>
</ul>
<p>我們非常感謝 Provence 和 Open Provence 團隊公開發表他們的工作。他們的貢獻大大加快了我們的開發速度，也讓這個專案成為可能。</p>
