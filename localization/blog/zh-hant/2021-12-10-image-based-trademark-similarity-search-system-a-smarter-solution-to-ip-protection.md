---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: Milvus 在智慧財產權保護：使用 Milvus 建立商標相似性檢索系統
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: 學習如何在智慧財產權保護產業中應用向量相似性檢索。
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>近年來，隨著人們對智慧財產權侵權的意識不斷提高，智慧財產權保護的議題也逐漸受到關注。最值得注意的是，跨國科技巨擘<a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">蘋果</a>公司（Apple Inc.除了這些最臭名昭著的案件之外，Apple Inc. 也曾在 2009 年以商標侵權為由，對澳洲連鎖超市<a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">Woolworths Limited 的商標申請提出爭議</a>。  Apple.Inc. 辯稱，該澳洲品牌的標誌（一個造型化的「w」），與他們自己的蘋果標誌相似。因此，Apple Inc.對 Woolworths 申請銷售的一系列產品（包括電子設備）的標誌提出異議。故事的結局是 Woolworths 修改標誌，Apple 撤回反對。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Woolworths 的標誌.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>蘋果公司的標誌.png</span> </span></p>
<p>隨著品牌文化意識的不斷提高，企業對任何會損害其智慧財產權（IP）的威脅都會密切關注。知識產權侵權包括</p>
<ul>
<li>侵犯版權</li>
<li>專利侵權</li>
<li>商標侵權</li>
<li>設計侵權</li>
<li>搶注</li>
</ul>
<p>前述蘋果公司與Woolworths之間的爭議主要在於商標侵權，也就是兩家公司的商標圖樣相似。為了避免成為另一個Woolworths，無論是在商標申請前或審查過程中，徹底的商標近似查詢都是申請人的關鍵步驟。最常見的方法是在<a href="https://tmsearch.uspto.gov/search/search-information">美國專利商標局 (USPTO) 的資料庫中</a>搜尋，該資料<a href="https://tmsearch.uspto.gov/search/search-information">庫</a>包含所有有效和非有效的商標註冊和申請。儘管這個搜尋過程的 UI 並非那麼迷人，但由於它是依賴文字和商標設計碼（這是設計特徵的手工註解標籤）來搜尋圖片，因此它以文字為基礎的性質也有很大的缺點。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>因此，本文打算展示如何利用開放源碼向量資料庫<a href="https://milvus.io">Milvus</a> 建立有效率的圖像商標相似性搜尋系統。</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">商標向量類似性搜尋系統<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>要建立商標向量相似性搜尋系統，您需要經過以下步驟：</p>
<ol>
<li>準備一個大量的商標資料集。很可能，系統可以使用這樣<a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">的</a>資料集，）。</li>
<li>使用資料集和資料驅動模型或人工智能演算法訓練影像特徵萃取模型。</li>
<li>使用步驟 2 中經過訓練的模型或演算法，將 Logo 轉換為向量。</li>
<li>在開源向量資料庫 Milvus 中儲存向量並進行向量相似性搜尋。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>在以下的章節中，讓我們仔細看看建立商標向量相似性搜尋系統的兩個主要步驟：使用 AI 模型進行影像特徵抽取，以及使用 Milvus 進行向量相似性搜尋。在我們的案例中，我們使用卷積神經網路 (CNN) VGG16 來擷取影像特徵，並將其轉換成嵌入向量。</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">使用 VGG16 擷取影像特徵</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a>是專為大規模影像辨識所設計的 CNN。該模型在影像識別方面既快速又精確，可應用於各種大小的影像。以下是兩張 VGG16 架構的圖解。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>VGG16 模型，顧名思義，是一個有 16 層的 CNN。包括 VGG16 和 VGG19 在內的所有 VGG 模型都包含 5 個 VGG 區塊，每個 VGG 區塊中都有一個或多個卷繞層。而在每個區塊的最後，會連接一個最大池化層，以縮小輸入影像的大小。每個卷繞層內的核心數量相等，但每個 VGG 區塊內的核心數量加倍。因此，模型中的核心數量會從第一區塊的 64 個增加到第四和第五區塊的 512 個。所有卷繞核（<em>convolutional</em>kernels）<em>的大小都</em>是<em>33，而匯集核（pooling kernels）的大小都是 22</em>。這有助於保留輸入影像的更多資訊。</p>
<p>因此，在這種情況下，VGG16 是一種適合用於海量資料集圖像識別的模型。您可以使用 Python、Tensorflow 和 Keras 在 VGG16 的基礎上訓練圖像特徵萃取模型。</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">使用 Milvus 進行向量相似性搜尋</h3><p>使用 VGG16 模型萃取影像特徵並將標誌影像轉換成嵌入向量後，您需要從大量資料集中搜尋相似向量。</p>
<p>Milvus 是一個雲端原生資料庫，具有高擴充性和彈性的特點。同時，作為一個資料庫，它可以確保資料的一致性。對於像這樣的商標相似性搜尋系統，最新的商標註冊等新資料會即時上傳至系統。而這些新上傳的資料需要立即可供搜尋。因此，本文採用開放源碼的向量資料庫 Milvus 來進行向量相似性檢索。</p>
<p>在插入標誌向量時，您可以根據<a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">商品與服務國際（尼斯）分類</a>（一個用於註冊商標的商品與服務分類系統），在 Milvus 中為不同類型的標誌向量建立集合。例如，您可以在 Milvus 中將一組服裝品牌標誌向量插入到一個名為「服裝」的集合中，並將另一組科技品牌標誌向量插入到另一個名為「科技」的集合中。通過這樣做，您可以大大提高向量相似性搜索的效率和速度。</p>
<p>Milvus 不僅支援向量相似性搜尋的多重索引，還提供豐富的 API 和工具，方便 DevOps 使用。下圖為<a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus 架構</a>示意圖。您可以閱讀 Milvus 的<a href="https://milvus.io/docs/v2.0.x/overview.md">簡介</a>，瞭解更多有關 Milvus 的資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">尋找更多資源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>使用 Milvus 為其他應用情境建立更多向量相似性搜尋系統：</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">基於 Milvus 的 DNA 序列分類</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">基於 Milvus 的音頻檢索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">建立視訊搜尋系統的 4 個步驟</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">利用NLP和Milvus建立智能QA系統</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">加速新藥發現</a></li>
</ul></li>
<li><p>參與我們的開放源碼社群：</p>
<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://bit.ly/3qiyTEk">論壇</a>與社群互動。</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上與我們聯繫。</li>
</ul></li>
</ul>
