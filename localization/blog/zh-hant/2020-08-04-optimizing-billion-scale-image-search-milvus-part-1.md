---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: 概述
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: 與 UPYUN 的案例研究。瞭解 Milvus 如何從傳統資料庫解決方案中脫穎而出，並協助建立圖像相似性搜尋系統。
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>優化億萬級圖片搜尋之旅 (1/2)</custom-h1><p>優步圖片管理器服務數千萬用戶，管理數百億張圖片。隨著用戶圖庫的不斷擴大，優步迫切需要一個能夠快速定位圖片的解決方案。換句話說，當使用者輸入一張圖片時，系統應該在圖庫中找到它的原圖和相似圖片。圖像搜尋服務的開發提供了解決此問題的有效方法。</p>
<p>圖像搜尋服務經歷了兩次演進：</p>
<ol>
<li>於 2019 年初開始第一次技術調查，並於 2019 年 3 月和 4 月推出第一代系統；</li>
<li>於 2020 年初開始升級方案的探討，並於 2020 年 4 月開始整體升級為第二代系統。</li>
</ol>
<p>本文將根據本人在此專案中的經驗，介紹兩代圖像搜索系統的技術選擇和基本原理。</p>
<h2 id="Overview" class="common-anchor-header">概述<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">什麼是圖像？</h3><p>在處理影像之前，我們必須先知道什麼是影像。</p>
<p>答案是影像是像素的集合。</p>
<p>舉例來說，這張圖片上紅框內的部分實際上就是一連串的像素。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-what-is-an-image.png</span> </span></p>
<p>假設紅框中的部分是一張影像，那麼影像中每個獨立的小方塊就是一個像素，也就是基本的資訊單位。那麼，影像的大小就是 11 x 11 px。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-what-is-an-image.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">影像的數學表示</h3><p>每個影像都可以用一個矩陣來表示。影像中的每個像素對應矩陣中的一個元素。</p>
<h3 id="Binary-images" class="common-anchor-header">二值影像</h3><p>二值影像的像素不是黑就是白，因此每個像素都可以用 0 或 1 表示。 例如，4 * 4 二值影像的矩陣表示法為：</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB 影像</h3><p>三原色（紅、綠、藍）可以混合產生任何顏色。對於 RGB 影像，每個像素都有三個 RGB 頻道的基本資訊。同樣地，如果每個通道使用 8 位元的數字（分 256 個等級）來表示其灰階，那麼像素的數學表示法就是：</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>以 4 * 4 RGB 影像為例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>影像處理的本質就是處理這些像素矩陣。</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">以影像搜尋的技術問題<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您要尋找原始影像，也就是像素完全相同的影像，那麼您可以直接比較它們的 MD5 值。但是，上傳到網際網路的影像通常都經過壓縮或加上水印。即使是圖像上的微小變化，也會產生不同的 MD5 結果。只要像素不一致，就不可能找到原始影像。</p>
<p>對於逐圖搜尋系統，我們想要搜尋內容相似的影像。那麼，我們需要解決兩個基本問題：</p>
<ul>
<li>將影像表達或抽象成可由電腦處理的資料格式。</li>
<li>資料必須具有可比性，以便進行計算。</li>
</ul>
<p>具體來說，我們需要以下特徵：</p>
<ul>
<li>影像特徵萃取。</li>
<li>特徵計算（相似度計算）。</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">第一代逐圖搜尋系統<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">特徵萃取 - 影像抽象</h3><p>第一代逐圖搜尋系統使用 Perceptual hash 或 pHash 演算法進行特徵萃取。這個演算法的基本原理是什麼？</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-first-generation-image-search.png</span> </span></p>
<p>如上圖所示，pHash 演算法會對影像進行一系列的轉換，以獲得切細值。在轉換過程中，演算法會不斷抽象影像，進而將相似影像的結果推近。</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">特徵計算 - 相似度計算</h3><p>如何計算兩個影像的 pHash 值之間的相似度？答案是使用 Hamming 距離。Hamming 距離越小，表示影像的內容越相似。</p>
<p>什麼是 Hamming 距離？它是不同位元的數量。</p>
<p>舉例來說、</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>上述兩個值中有兩個不同的位元，所以它們之間的漢明距離是 2。</p>
<p>現在我們知道相似性計算的原理了。接下來的問題是，如何從 1 億張圖片中計算 1 億比例資料的 Hamming 距離？簡而言之，如何搜尋相似的圖片？</p>
<p>在計畫的初期，我並沒有找到令人滿意的工具（或運算引擎），可以快速計算出 Hamming 距離。所以我改變了計劃。</p>
<p>我的想法是，如果兩個 pHash 值的 Hamming 距離很小，那麼我就可以切割 pHash 值，對應的小部分很可能是相等的。</p>
<p>舉例來說</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>我們將上述兩個值分成八段，其中六段的值完全相同。可以推斷它們的 Hamming 距離很接近，因此這兩張圖片是相似的。</p>
<p>經過轉換之後，可以發現計算 Hamming 距離的問題變成了匹配等值的問題。如果我將每個 pHash 值分成八段，只要有五段以上的值完全相同，那麼這兩個 pHash 值就是相似的。</p>
<p>因此，解決等值匹配的問題非常簡單。我們可以使用傳統資料庫系統的經典篩選方式。</p>
<p>當然，我使用的是多段匹配，並且在 ElasticSearch 中使用 minimum_should_match 來指定匹配程度 (本文不介紹 ES 的原理，大家可以自行學習)。</p>
<p>為什麼要選擇 ElasticSearch？首先，它提供了上述的搜尋功能。第二，圖像管理員專案本身就是使用 ES 來提供全文檢索功能，使用現有資源非常經濟。</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">第一代系統的總結<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第一代逐圖搜尋系統選擇 pHash + ElasticSearch 的解決方案，具有以下特點：</p>
<ul>
<li>pHash 演算法簡單易用，可抵抗一定程度的壓縮、水印及雜訊。</li>
<li>ElasticSearch 使用專案現有的資源，不會增加額外的搜尋成本。</li>
<li>但這個系統的限制也很明顯：pHash 演算法是整個影像的抽象表示。一旦我們破壞了圖像的完整性，例如在原始圖像上加上黑色邊框，就幾乎無法判斷原始圖像與其他圖像的相似度。</li>
</ul>
<p>為了突破這樣的限制，出現了底層技術完全不同的第二代圖像搜尋系統。</p>
<p>本文作者 rifewang，Milvus 用戶，UPYUN 軟體工程師。如果您喜歡這篇文章，歡迎來打個招呼！https://github.com/rifewang。</p>
