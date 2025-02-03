---
id: multimodal-semantic-search-with-images-and-text.md
title: 圖像與文字的多模態語意搜尋
author: Stefan Webb
date: 2025-02-3
desc: 瞭解如何使用多模態 AI 建立語意搜尋應用程式，除了基本的關鍵字比對之外，還能瞭解文字與影像之間的關係。
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>身為人類，我們透過感官來詮釋世界。我們聽到聲音、看見影像、視訊和文字，而且往往是層層相疊。我們透過這些多重模式以及它們之間的關係來理解世界。人工智慧若要真正媲美或超越人類的能力，就必須發展出這種同時透過多種鏡頭來理解世界的能力。</p>
<p>在這篇文章以及隨附的影片（即將推出）和筆記型電腦中，我們將展示最近在能夠同時處理文字和影像的模型上所取得的突破。我們將透過建立一個語意搜尋應用程式來證明這一點，這個應用程式不只是簡單的關鍵字匹配，它還能理解使用者所要求的內容與他們正在搜尋的視覺內容之間的關係。</p>
<p>讓這個專案特別令人興奮的是，它完全是使用開源工具建立的：Milvus向量資料庫、HuggingFace的機器學習程式庫，以及亞馬遜客戶評論資料集。想想看，就在十年前，建立這樣的東西需要大量的專屬資源。如今，這些功能強大的元件都可以免費取得，任何有好奇心的人都可以用創新的方式將它們結合起來。</p>
<custom-h1>概述</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們的多模式搜尋應用程式屬於<em>retrieve-and-rerank</em>類型<em>。</em>如果您熟悉<em>retrieval-augmented-generation</em>(RAG)，它與RAG非常相似，只是最終輸出是一個由大型語言視覺模型 (LLVM) 重新排序的圖像清單。使用者的搜尋查詢包含文字和影像，而目標是一組索引在向量資料庫中的影像。此架構有三個步驟 -<em>索引</em>、<em>檢索</em>和<em>重新排序</em>(類似於 「產生」)，我們依次加以總結。</p>
<h2 id="Indexing" class="common-anchor-header">建立索引<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的搜尋應用程式必須有要搜尋的東西。在我們的案例中，我們使用「Amazon Reviews 2023」資料集的一個小子集，這個資料集包含所有類型產品的 Amazon 客戶評論的文字和圖片。您可以想像我們正在建置的這種語意搜尋，對於電子商務網站來說是非常有用的補充。我們使用 900 張圖片，捨棄文字，不過請注意，只要有正確的資料庫和推論部署，這個筆記型電腦就可以擴充到生產規模。</p>
<p>我們管道中的第一個「魔法」是嵌入模型的選擇。我們使用最近開發的多模態模型<a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>，它可以將文字和圖像共同或分別嵌入到同一個空間中的單一模型中，在這個模型中，相近的點在語義上是相似的。最近也開發了其他這類模型，例如<a href="https://github.com/google-deepmind/magiclens">MagicLens</a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上圖說明：[獅子側身的圖像] 加上文字「這隻獅子的正面圖」的嵌入，與不含文字的[獅子正面的圖像]的嵌入很接近。相同的模型用於文字加圖像的輸入和只有圖像的輸入（以及只有文字的輸入）。<em>如此一來，模型就能了解使用者在查詢文字與查詢圖片之間關係時的意圖。</em></p>
<p>我們嵌入了 900 張沒有對應文字的產品圖片，並使用<a href="https://milvus.io/docs">Milvus</a> 將嵌入資料儲存在向量資料庫中。</p>
<h2 id="Retrieval" class="common-anchor-header">擷取<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>現在資料庫已經建立，我們可以提供使用者查詢。想像一下，有一位使用者帶著這樣的查詢過來：「有這個的手機保護套 」加上 [一張豹子的圖像]。也就是說，他們正在搜尋有豹紋圖案的手機保護套。</p>
<p>請注意，使用者查詢的文字說的是 "this「，而不是 」a Leopard's skin"。我們的嵌入模型必須能將「this」與它所指的東西聯繫起來，考慮到之前迭代的模型無法處理這種開放式的指令，這是一個令人印象深刻的壯舉。<a href="https://arxiv.org/abs/2403.19651">MagicLens 論文</a>提供了更多的範例。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們將查詢的文字和圖片共同嵌入，並對向量資料庫進行相似性搜尋，返回前 9 個命中的結果。結果與查詢的豹子圖片一起顯示在上圖中。看起來，最頂尖的點擊結果並不是與查詢最相關的。第七個結果似乎是最相關的 - 它是一個有豹皮圖案的手機保護套。</p>
<h2 id="Generation" class="common-anchor-header">世代<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的搜尋似乎失敗了，因為第一個結果不是最相關的。不過，我們可以使用重新排序步驟來解決這個問題。您可能對檢索項目的重新排序很熟悉，因為這是許多 RAG 管道中的重要步驟。我們使用<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a>作為重排模型。</p>
<p>我們首先要求 LLVM 產生查詢圖片的標題。LLVM 會輸出</p>
<p><em>「這張圖片顯示了一隻豹子的臉部特寫，焦點集中在它的斑點皮毛和綠色眼睛上」。</em></p>
<p>接著我們送入這個標題、一張有九個結果和查詢圖片的圖片，並建構一個文字提示，要求模型對結果重新排序，以清單的形式給出答案，並提供選擇最匹配結果的理由。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>輸出結果如上圖所示 - 現在最相關的項目是最匹配的項目 - 而給予的理由是</p>
<p><em>「最適合的項目是以豹子為主題的項目，它符合使用者對類似主題的手機保護套的查詢指示」。</em></p>
<p>我們的 LLVM re-reranker 能夠在圖片和文字之間進行理解，並改善搜尋結果的相關性。<em>一個有趣的假象是，重新排序器只提供了八個結果，而且還掉了一個，這就突顯出對於守則和結構化輸出的需求。</em></p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇文章以及隨附的影片（即將推出）和<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">筆記</a>型電腦中，我們建構了一個跨文字和圖像的多模態語意搜尋應用程式。嵌入模型能夠將文字和圖像共同或單獨嵌入同一空間，而基礎模型則能夠輸入文字和圖像，同時產生文字回應。<em>重要的是，嵌入模型能夠將用戶開放式指令的意圖與查詢圖像聯繫起來，並以此方式指定用戶希望結果如何與輸入圖像聯繫起來。</em></p>
<p>這只是不久將來的趨勢。我們將會看到多模態搜尋、多模態理解與推理等多種不同模態的應用：圖像、視訊、音訊、分子、社群網路、表格資料、時間序列，潛力無窮。</p>
<p>而這些系統的核心是一個向量資料庫，容納了系統的外部「記憶」。Milvus 是這方面的絕佳選擇。它開放原始碼、功能齊全 (請參閱<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">這篇文章關於 Milvus 2.5 的全文檢索</a>)，並能以網路規模的流量和低於 100 毫秒的延遲，有效地擴充至數十億向量。如需瞭解更多資訊，請參閱<a href="https://milvus.io/docs">Milvus 文件</a>、加入我們的<a href="https://milvus.io/discord">Discord</a>社群，並希望能在下一次的<a href="https://lu.ma/unstructured-data-meetup">非結構化資料聚會</a>中與您見面。在那之前</p>
<h2 id="Resources" class="common-anchor-header">資源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>筆記本：<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"使用 Amazon Reviews 與 LLVM Reranking 進行多模式搜尋</a></p></li>
<li><p>Youtube AWS 開發人員視訊 (即將推出)</p></li>
<li><p><a href="https://milvus.io/docs">Milvus 文件</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">非結構化資料聚會</a></p></li>
<li><p>嵌入模型：<a href="https://huggingface.co/BAAI/bge-visualized">可視化 BGE 模型卡</a></p></li>
<li><p>另一種嵌入模型：<a href="https://github.com/google-deepmind/magiclens">MagicLens 模型 repo</a></p></li>
<li><p>LLVM：<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision 模型卡</a></p></li>
<li><p>論文：<a href="https://arxiv.org/abs/2403.19651">「MagicLens：使用開放式指令的自我監督圖片檢索</a>」</p></li>
<li><p>資料集：<a href="https://amazon-reviews-2023.github.io/">亞馬遜評論 2023</a></p></li>
</ul>
