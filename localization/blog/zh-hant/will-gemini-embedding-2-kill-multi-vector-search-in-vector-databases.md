---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: Gemini Embedding 2 會扼殺向量資料庫中的多向量搜尋嗎？
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: Google 的 Gemini Embedding 2 將文字、圖片、視訊和音訊映射成一個向量。這會讓多向量搜尋過時嗎？不會，原因如下。
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google 發表了<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a>- 第一個多模態嵌入模型，可將文字、影像、視訊、音訊和文件映射到單一向量空間。</p>
<p>您只需呼叫一次 API，就能嵌入一段影片、一張產品照片和一段文字，而且它們都會出現在相同的語意鄰域中。</p>
<p>在使用這樣的模型之前，您必須將每種模式透過其各自的專家模型執行，然後將每個輸出儲存於單獨的向量列中。像<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a>之類的向量資料庫中的多向量列，正是為了這種情況而建立的。</p>
<p>隨著 Gemini Embedding 2 同時映射多種模式，一個問題出現了：Gemini Embedding 2 可以取代多少多向量列，它的不足又在哪裡？這篇文章將介紹每種方法的適用範圍，以及它們如何相互配合。</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">與 CLIP/CLAP 相比，Gemini Embedding 2 有何不同？<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>嵌入模型可將非結構化資料轉換成密集向量，讓語意相似的項目在向量空間中聚集在一起。Gemini Embedding 2 的與眾不同之處在於，它能跨模態原生執行此功能，無需獨立模型和拼接管道。</p>
<p>到目前為止，多模式嵌入意味著使用對比學習訓練的雙編碼器模型：<a href="https://openai.com/index/clip/">CLIP</a>用於圖像-文字，<a href="https://arxiv.org/abs/2211.06687">CLAP</a>用於音訊-文字，每個模型正好處理兩種模式。如果您需要全部三種模式，則需要運行多個模型，並自行協調它們的嵌入空間。</p>
<p>舉例來說，要為有封面圖片的 Podcast 編制索引，就必須針對圖片運行 CLIP、針對音訊運行 CLAP，以及針對文字謄本運行文字編碼器 - 三種模型、三個向量空間，以及自訂的融合邏輯，以便在查詢時使它們的分數具有可比性。</p>
<p>相比之下，根據<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Google 的官方公告</a>，以下是 Gemini Embedding 2 所支援的功能：</p>
<ul>
<li>每次請求最多 8,192 個<strong>文字</strong>標記</li>
<li>每個請求最多可包含 6<strong>張圖片</strong>(PNG、JPEG)</li>
<li><strong>視訊</strong>最長 120 秒 (MP4, MOV)</li>
<li><strong>音訊長</strong>達 80 秒，無需 ASR 轉錄即可原生嵌入</li>
<li><strong>文件</strong>PDF 輸入，最多 6 頁</li>
</ul>
<p>在單一嵌入呼叫中<strong>混合輸入</strong>影像 + 文字</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 vs. CLIP/CLAP 多模式嵌入的單一模式 vs. 多模式嵌入</h3><table>
<thead>
<tr><th></th><th><strong>雙編碼器 (CLIP, CLAP)</strong></th><th><strong>Gemini Embedding 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>每個模型的模態</strong></td><td>2 (例如：影像 + 文字)</td><td>5 (文字、影像、視訊、音訊、PDF)</td></tr>
<tr><td><strong>新增模組</strong></td><td>您帶入另一個模型並手動對齊空間</td><td>已包含 - 只需呼叫一次 API</td></tr>
<tr><td><strong>跨模式輸入</strong></td><td>獨立編碼器、獨立呼叫</td><td>交錯輸入 (例如，圖片 + 文字在一個請求中)</td></tr>
<tr><td><strong>架構</strong></td><td>獨立的視覺與文字編碼器透過對比損失進行對齊</td><td>從 Gemini 繼承多模態理解的單一模型</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Gemini Embedding 2 的優勢：管道簡化<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>以一個常見的情境為例：在短片庫上建立語意搜尋引擎。每個片段都有視覺框架、說話音訊和字幕文字 - 全都描述相同的內容。</p>
<p><strong>在使用 Gemini Embedding 2 之前</strong>，您需要三個獨立的嵌入模型 (影像、音訊、文字)、三個向量列，以及一個進行多向召回、結果融合和重複資料刪除的檢索管道。要建立和維護這麼多的動態零件。</p>
<p><strong>現在</strong>，您可以將視訊的畫格、音訊和字幕納入單一的 API 呼叫中，並獲得一個統一的向量來捕捉完整的語意畫面。</p>
<p>當然，我們很容易得出多向量列已經死了的結論。但這個結論混淆了「多模態統一表現」與「多維向量檢索」。它們解決的是不同的問題，而了解兩者的差異對於選擇正確的方法非常重要。</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Milvus 中的多向量檢索是什麼？<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在<a href="http://milvus.io">Milvus</a> 中，多向量檢索是指同時透過多個向量領域來檢索同一個項目，然後將這些結果與重新排序結合。</p>
<p>核心思想：一個單一的物件往往帶有不止一種意義。產品有標題<em>和</em>描述。社交媒體文章有標題<em>和</em>圖片。每個角度都有不同的意義，因此每個角度都有自己的向量場。</p>
<p>Milvus 會獨立搜尋每個向量場，然後再使用重排器合併候選集。在 API 中，每個請求會映射到不同的欄位和搜尋組態，而 hybrid_search() 會返回合併後的結果。</p>
<p>有兩種常見的模式取決於此：</p>
<ul>
<li><strong>Sparse+Dense 向量搜尋。</strong>您有一個產品目錄，使用者在目錄中輸入查詢，例如 "red Nike Air Max size 10"。密集向量捕捉語意意圖 (「跑鞋、紅色、Nike」)，但錯過了確切的尺寸。透過<a href="https://milvus.io/docs/full-text-search.md">BM25</a>或<a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a>等模型的稀疏向量則可以鎖定關鍵字匹配。您需要兩者並行運行，然後再重新排序 - 因為對於混合自然語言與特定識別符 (如 SKU、檔案名稱或錯誤代碼) 的查詢，兩者都無法單獨返回良好的結果。</li>
<li><strong>多模式向量搜尋。</strong> 使用者上傳了一張衣服的照片，並輸入「類似這樣的衣服，但是是藍色的」。您可以同時搜尋影像嵌入列的視覺相似性，以及文字嵌入列的顏色限制。每一列都有自己的索引和模式 - 影像用<a href="https://openai.com/index/clip/">CLIP</a>，描述用文字編碼器 - 結果會合併。</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a>以平行<a href="https://milvus.io/docs/multi-vector-search.md">ANN 搜尋</a>方式執行這兩種模式，並透過 RRFRanker 進行原生重排。模式定義、多重索引配置和內建的 BM25 都在一個系統中處理。</p>
<p>舉例來說，考慮一個產品目錄，其中每一個項目都包含文字說明和圖片。您可以針對這些資料並行執行三種搜尋：</p>
<ul>
<li><strong>語意文字搜尋。</strong>使用<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>、<a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> 或<a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>embeddings API 等模型產生的密集向量查詢文字說明。</li>
<li><strong>全文檢索。</strong>使用<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>或<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a>或<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a> 等稀疏嵌入模型，以稀疏向量查詢文字說明。</li>
<li><strong>跨模式圖片搜尋。</strong>使用文字查詢，搭配<a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a> 等模型的密集向量，查詢產品圖片。</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">有了 Gemini Embedding 2，多向量搜尋還重要嗎？<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 可在一次呼叫中處理更多的模式，大大簡化了管道。但統一的多模態嵌入與多向量檢索並不是一回事。換句話說，是的，多向量檢索仍會很重要。</p>
<p>Gemini Embedding 2 將文字、影像、視訊、音訊和文件映射到一個共用的向量空間。Google<a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">將其定位</a>為多模式語意搜尋、文件擷取和推薦 - 所有模式都描述相同內容的情況，而高度的跨模式重疊使得單一向量變得可行。</p>
<p><a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a>多向量搜尋能解決不同的問題。這是一種透過<strong>多向量欄位</strong>來搜尋同一物件的方式，例如標題加上描述，或文字加上圖片，然後在檢索時結合這些訊號。換句話說，它是關於保留和查詢同一項目的<strong>多個語意觀點</strong>，而不只是將所有東西壓縮為一個表示。</p>
<p>但現實世界的資料很少適合單一的嵌入。生物辨識系統、代理工具檢索和混合意圖電子商務都仰賴於生活在完全不同語意空間中的向量。這正是統一嵌入無法發揮作用的地方。</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">為什麼只有一種嵌入方式是不夠的：多向量擷取實務</h3><p>Gemini Embedding 2 可以處理所有模式都描述相同事物的情況。多向量檢索可處理其他一切情況 - 而「其他一切情況」涵蓋了大多數的生產檢索系統。</p>
<p><strong>生物識別。</strong>單一使用者擁有臉部、聲紋、指紋和虹膜向量。這些向量描述的是完全獨立的生物特徵，沒有任何語意重疊。您不能將它們合併為一個向量 - 每個向量都需要自己的欄位、索引和相似度指標。</p>
<p><strong>代理工具。</strong>OpenClaw 之類的編碼輔助工具會儲存密集的語意向量，用於對話歷史 (「上周的部署問題」) 以及稀疏的 BM25 向量，用於檔案名稱、CLI 指令和組態參數的精確匹配。不同的檢索目標、不同的向量類型、獨立的搜尋路徑，然後再重新排序。</p>
<p><strong>具有混合意圖的電子商務。</strong>一個產品的宣傳影片和詳細圖片作為統一的 Gemini 嵌入效果很好。但當使用者想要「長得像這樣的連衣裙」<em>和</em>「相同布料、M 尺寸」時，您就需要視覺相似性列和結構化屬性列，並搭配獨立索引和混合檢索層。</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">何時使用 Gemini Embedding 2 vs. 多向量列<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
<tr><th><strong>使用情境</strong></th><th><strong>使用什麼</strong></th><th><strong>為什麼</strong></th></tr>
</thead>
<tbody>
<tr><td>所有模式都描述相同的內容 (視訊畫格 + 音訊 + 字幕)</td><td>Gemini Embedding 2 統一向量</td><td>高語義重疊意味著一個向量就能捕捉全貌 - 不需要融合</td></tr>
<tr><td>您需要關鍵字精確度以及語意召回率 (BM25 + 密集)</td><td>使用 hybrid_search() 的多向量列</td><td>稀疏向量和密集向量可達到不同的檢索目標，而這些目標無法整合為一個內嵌。</td></tr>
<tr><td>跨模式搜尋是主要的使用個案 (文字查詢 → 影像結果)</td><td>雙子座嵌入 2 統一向量</td><td>單一共享空間使跨模態相似性成為本機</td></tr>
<tr><td>向量生活在根本不同的語義空間（生物識別、結構屬性）</td><td>具有每個欄位索引的多向量欄位</td><td>每個向量欄位都有獨立的相似度指標和索引類型</td></tr>
<tr><td>您需要管道簡化<em>和</em>細粒度檢索</td><td>兩者兼具 - 統一的 Gemini 向量 + 同一集合中的額外稀疏或屬性欄位</td><td>Gemini 處理多模式列；Milvus 處理其周圍的混合檢索層</td></tr>
</tbody>
</table>
<p>這兩種方法並不互相排斥。您可以使用 Gemini Embedding 2 來處理統一的多模態列，同時仍可在同一<a href="https://milvus.io/">Milvus</a>資料集中的單獨列中儲存其他稀疏或特定屬性向量。</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">快速入門：設定 Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是一個工作示範。您需要一個執行中的<a href="https://milvus.io/docs/install-overview.md">Milvus 或 Zilliz Cloud 實例</a>和 GOOGLE_API_KEY。</p>
<h3 id="Setup" class="common-anchor-header">設定</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">完整範例</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>對於圖像和音訊嵌入，使用 embed_image() 和 embed_audio()的方式相同 - 向量落在相同的集合和相同的向量空間，實現真正的跨模組搜尋。</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 即將在 Milvus/Zilliz Cloud 中推出<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>將透過其<a href="https://milvus.io/docs/embeddings.md">Embedding Function 功能</a>與 Gemini Embedding 2 進行深度整合。一旦啟用，您就不需要手動呼叫嵌入式 API。Milvus 將自動喚起模型 (支援 OpenAI、AWS Bedrock、Google Vertex AI 等)，以向量化插入時的原始資料和搜尋時的查詢。</p>
<p>這表示您可以在適合的地方從 Gemini 取得統一的多模式嵌入，並在需要精細控制的地方取得 Milvus 的完整多向量工具包 - 稀疏密集混合搜尋、多索引模式、重排。</p>
<p>想要試試看？請從<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門</a>開始，並執行上面的示範，或查看<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">混合搜尋指南</a>，瞭解使用 BGE-M3 的完整多向量設定。請將您的問題帶到<a href="https://milvus.io/discord">Discord</a>或<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus Office Hours</a>。</p>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入功能：Milvus 2.6 如何簡化矢量化與語意搜尋 - Milvus 部落格</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜尋</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Milvus 嵌入功能說明文件</a></li>
</ul>
