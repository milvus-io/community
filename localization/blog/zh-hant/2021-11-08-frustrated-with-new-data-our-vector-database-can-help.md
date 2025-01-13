---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: 簡介
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: 面向 AI 的通用向量資料庫系統的設計與實踐
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>對新資料感到沮喪？我們的向量資料庫可以幫到您</custom-h1><p>在大數據時代，哪些資料庫技術和應用將成為焦點？下一個改變遊戲規則的是什麼？</p>
<p>非結構化資料約佔所有儲存資料的 80-90%，我們該如何處理這些不斷成長的資料湖？我們可能會想到使用傳統的分析方法，但這些方法即使有任何資訊，也無法找出有用的資訊。為了回答這個問題，Zilliz 研發團隊的 「三劍客 」郭仁通博士、栾小凡先生和易小蒙博士共同撰寫了一篇文章，討論建立通用向量資料庫系統的設計和面臨的挑戰。</p>
<p>這篇文章被收錄在中國最大的軟件開發者社區 CSDN 所出版的期刊《程序員》上。本期《程序员》还收录了2020年图灵奖获得者Jeffrey Ullman、2018年图灵奖获得者Yann LeCun、MongoDB首席技术官Mark Porter、OceanBase创始人杨振坤、PingCAP创始人黄东旭等人的文章。</p>
<p>以下與您分享全文：</p>
<custom-h1>面向 AI 的通用向量資料庫系統的設計與實踐</custom-h1><h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>現今的資料應用程式可以輕鬆處理結構化資料，結構化資料約佔現今資料的 20%。在其工具箱中，有關聯式資料庫、NoSQL 資料庫等系統；相對而言，佔所有資料約 80% 的非結構化資料卻沒有任何可靠的系統。為了解決這個問題，本文將探討傳統資料分析在非結構化資料上的痛點，並進一步討論我們建立自己的通用向量資料庫系統的架構與面臨的挑戰。</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">AI 時代的資料革命<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 5G 和 IoT 技術的快速發展，各行各業都在尋求更多的資料收集管道，並進一步將現實世界投射到數位空間。雖然這帶來了一些巨大的挑戰，但同時也為不斷成長的產業帶來了巨大的利益。這些艱鉅的挑戰之一，就是如何深入洞察這些新湧入的資料。</p>
<p>根據 IDC 的統計，僅 2020 年全球就會產生超過 40,000 exabytes 的新資料。其中，只有 20% 是結構化資料 - 高度有序且容易透過數值計算和關聯代數進行組織和分析的資料。相比之下，非結構化資料（佔剩餘的 80%）的資料類型變化極為豐富，因此很難透過傳統的資料分析方法來發掘其深層語意。</p>
<p>幸運的是，我們正經歷著非結構化資料與人工智能的同步快速演進，人工智能讓我們可以透過各種類型的神經網路更好地理解資料，如圖 1 所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>嵌入技術在 Word2vec 首次亮相後迅速普及，「嵌入一切」的理念深入機器學習的各個領域。這導致兩大資料層的出現：原始資料層和向量資料層。原始資料層由非結構化資料和特定類型的結構化資料組成；向量層則是源自原始資料層經過機器學習模型的易於分析的嵌入集合。</p>
<p>與原始資料相比，向量化資料具有以下優點：</p>
<ul>
<li>嵌入向量是一種抽象的資料類型，這意味著我們可以建立一個統一的代數系統，專門用於降低非結構化資料的複雜性。</li>
<li>嵌入向量是透過密集浮點向量來表達，讓應用程式能夠利用 SIMD 的優勢。由於 GPU 和幾乎所有現代 CPU 都支援 SIMD，因此跨向量的計算可以相對較低的成本達到高效能。</li>
<li>透過機器學習模型編碼的向量資料所佔用的儲存空間比原始非結構化資料更少，因此可以達到更高的吞吐量。</li>
<li>算術運算也可以跨嵌入向量執行。圖 2 顯示了一個跨模態語意近似匹配的範例 - 圖中顯示的圖片是文字嵌入與圖像嵌入匹配的結果。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>如圖 3 所示，結合圖片與文字的語意可以透過對應的嵌入向量進行簡單的向量加減來完成。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>除了上述功能之外，這些運算符號還支援實際情境中更複雜的查詢語句。內容推薦就是一個著名的例子。一般而言，系統會同時嵌入內容和使用者的觀看偏好。接下來，系統會透過語意相似性分析，將內嵌使用者的喜好與最相似的內嵌內容進行比對，產生與使用者喜好相似的新內容。這個向量資料層不只限於推薦系統，使用案例包括電子商務、惡意軟體分析、資料分析、生物辨識驗證、化學公式分析、金融、保險等。</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">非結構化資料需要完整的基本軟體堆疊<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>系統軟體是所有資料導向應用程式的基礎，但過去數十年來所建立的資料系統軟體，例如資料庫、資料分析引擎等，都是用來處理結構化資料的。現代資料應用程式幾乎完全依賴非結構化資料，無法從傳統資料庫管理系統中獲益。</p>
<p>為了解決這個問題，我們開發了一個面向人工智能的通用向量資料庫系統<em>Milvus</em>(參考編號 1~2)，並將其開放源碼。與傳統資料庫系統相比，Milvus 是在不同的資料層上運作。傳統的資料庫，例如關係資料庫、KV 資料庫、文字資料庫、圖片/影片資料庫...等，都是工作在原始資料層，而 Milvus 則是工作在向量資料層。</p>
<p>在接下來的章節中，我們將討論 Milvus 的新功能、架構設計，以及我們在建立 Milvus 時所面臨的技術挑戰。</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">向量資料庫的主要屬性<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫可以儲存、擷取、分析向量，就像其他資料庫一樣，也提供 CRUD 操作的標準介面。除了這些「標準」功能之外，以下列出的屬性也是向量資料庫的重要特質：</p>
<ul>
<li><strong>支援高效率向量運算符號</strong></li>
</ul>
<p>分析引擎對向量運算符號的支援著重於兩個層次。首先，向量資料庫應該支援不同類型的運算符號，例如上面提到的語意相似性比對和語意運算。除此之外，它還應該支援用於基礎相似性計算的各種相似性度量。這種相似性通常量化為向量之間的空間距離，常見的指標有歐氏距離、余弦距離和內積距離。</p>
<ul>
<li><strong>向量索引的支援</strong></li>
</ul>
<p>與傳統資料庫中基於 B 樹或 LSM 樹的索引相比，高維向量索引通常會消耗更多的計算資源。我們建議使用聚類和圖索引演算法，並優先使用矩陣和向量運算，因此可充分利用之前提到的硬體向量運算加速能力。</p>
<ul>
<li><strong>不同部署環境下一致的使用者體驗</strong></li>
</ul>
<p>向量資料庫通常會在不同的環境中開發及部署。在初始階段，資料科學家和演算法工程師大多在筆記型電腦和工作站上工作，因為他們更注重驗證效率和迭代速度。當驗證完成後，他們可能會在私有集群或雲端上部署完整規模的資料庫。因此，合格的向量資料庫系統應該能在不同的部署環境中提供一致的效能與使用者體驗。</p>
<ul>
<li><strong>支援混合搜尋</strong></li>
</ul>
<p>隨著向量資料庫變得無所不在，新的應用程式也不斷出現。在所有這些需求中，最常被提及的是向量與其他類型資料的混合搜尋。其中的幾個例子包括標量篩選後的近似近鄰搜尋 (ANNS)、全文檢索和向量搜尋的多通道召回，以及時空資料和向量資料的混合搜尋。這樣的挑戰要求彈性擴充與查詢最佳化，以有效融合向量搜尋引擎與 KV、文字和其他搜尋引擎。</p>
<ul>
<li><strong>雲端原生架構</strong></li>
</ul>
<p>向量資料的數量隨著資料收集的指數級成長而如雨後春筍。萬億級的高維向量資料相對於數千 TB 的儲存空間，遠遠超過單一節點的限制。因此，橫向擴充能力是向量資料庫的關鍵能力，並應滿足使用者對彈性與部署敏捷性的需求。此外，它還應該降低系統運維的複雜度，同時在雲端基礎架構的協助下提高可觀察性。其中一些需求是以多租戶隔離、資料快照與備份、資料加密、資料可視化等傳統資料庫常見的形式出現。</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">矢量資料庫系統架構<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 遵循「日誌即資料」、「統一批次與串流處理」、「無狀態」和「微服務」的設計原則。圖 4 描述 Milvus 2.0 的整體架構。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>日誌即資料</strong>：Milvus 2.0 不維護任何實體資料表。相反，它透過日誌持久化和日誌快照來確保資料的可靠性。日誌經紀人（系統的骨幹）儲存日誌，並透過日誌發佈-訂閱（pub-sub）機制解耦元件與服務。如圖 5 所示，日誌中介由「日誌序列」和「日誌訂閱者」組成。日誌序列記錄所有改變集合狀態的作業（相當於關係資料庫中的表）；日誌訂閱者訂閱日誌序列，以更新其本機資料，並以唯讀副本的形式提供服務。pub-sub 機制也為系統在變更資料擷取 (CDC) 和全球分散部署方面的擴充能力預留了空間。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>統一的批次與串流處理</strong>：日誌串流可讓 Milvus 即時更新資料，從而確保即時傳送性。此外，透過將資料批次轉換為日誌快照，並在快照上建立索引，Milvus 可以達到更高的查詢效率。在查詢過程中，Milvus 會合併增量資料和歷史資料的查詢結果，以保證返回資料的完整性。與傳統的 Lambda 架構相比，這樣的設計能更好地平衡即時性能和效率，減輕線上和離線系統的維護負擔。</p>
<p><strong>無狀態</strong>：雲端基礎架構與開放原始碼儲存元件，讓 Milvus 無須在自己的元件中持久化資料。Milvus 2.0 以三種儲存方式來持久化資料：元資料儲存、日誌儲存和物件儲存。元資料儲存不僅儲存元資料，也處理服務發現和節點管理。日誌儲存可執行增量資料持久化及資料發佈-訂閱。物件儲存則儲存日誌快照、索引和一些中間計算結果。</p>
<p><strong>微服務</strong>：Milvus 遵循資料平面與控制平面分離、讀/寫分離及線上/離線任務分離的原則。它由四層服務組成：存取層、協調器層、工作人員層和儲存層。這些層級在擴充和災難復原時是相互獨立的。作為面向前端的層和使用者端點，存取層會處理用戶端連線、驗證用戶端請求並合併查詢結果。作為系統的 「大腦」，協調層負責群集拓樸管理、負載平衡、資料宣告和資料管理等任務。Worker 層包含系統的「四肢」，負責執行資料更新、查詢和索引建立作業。最後，儲存層負責資料的持久性與複製。總體而言，這種以微服務為基礎的設計確保了系統複雜性的可控性，每個元件都負責其相對應的功能。Milvus 透過明確的介面釐清服務的邊界，並根據更細的粒度將服務解耦，進一步優化彈性擴充能力和資源分配。</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">向量資料庫面臨的技術挑戰<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>早期向量資料庫的研究主要集中在設計高效率的索引結構與查詢方法上 - 因此產生了各式各樣的向量搜尋演算法函式庫 (參考編號 3~5)。過去幾年來，越來越多的學術與工程團隊從系統設計的角度重新檢視向量搜尋的問題，並提出一些有系統的解決方案。綜合既有研究與使用者需求，我們將向量資料庫的主要技術挑戰歸類如下：</p>
<ul>
<li><strong>相對於負載的性價比最佳化</strong></li>
</ul>
<p>相較於傳統資料類型，向量資料的分析因其高維度而需要更多的儲存與計算資源。此外，使用者對於向量搜尋解決方案的負載特性與性價比最佳化也有不同的偏好。舉例來說，處理超大資料集（數百或數千億向量）的使用者會偏好資料儲存成本較低且搜尋延遲不一的解決方案，而其他使用者則可能會要求較高的搜尋效能以及不變的平均延遲。為了滿足如此多樣化的偏好，向量資料庫的核心索引元件必須能夠支援不同類型儲存與運算硬體的索引結構與搜尋演算法。</p>
<p>例如，在降低儲存成本時，應將向量資料和相對應的索引資料儲存在較便宜的儲存媒體（如 NVM 和 SSD）中。然而，大多數現有的向量搜尋演算法都是直接從記憶體讀取資料。為了避免使用磁碟機所帶來的效能損失，向量資料庫除了能夠調整向量資料與索引結構的儲存解決方案之外，還應該能夠利用資料存取的區域性結合搜尋演算法(Reference No.6~8)。為了提升效能，當代的研究主要集中在硬體加速技術上，包括 GPU、NPU、FPGA 等(參考資料 9)。然而，加速專用的硬體與晶片在架構設計上各有不同，在不同硬體加速器間最有效率執行的問題尚未解決。</p>
<ul>
<li><strong>自動化系統設定與調整</strong></li>
</ul>
<p>大多數現有的向量搜尋演算法研究都在尋求儲存成本、運算效能與搜尋準確度之間的彈性平衡。一般而言，演算法參數與資料特性都會影響演算法的實際效能。由於使用者的需求在成本和效能上有所不同，因此選擇適合其需求和資料特徵的向量查詢方法是一大挑戰。</p>
<p>然而，由於向量資料的高維度，手動分析資料分佈對搜尋演算法影響的方法並不有效。為了解決這個問題，學術界和產業界都在尋找基於機器學習的演算法推薦解決方案（參考編號 10）。</p>
<p>設計一種 ML 驅動的智慧型向量搜尋演算法也是一個研究熱點。一般而言，現有的向量搜尋演算法是針對不同維度與分佈模式的向量資料而普遍開發的。因此，這些演算法並不支援依據資料特徵的特定索引結構，因此優化的空間不大。未來的研究也應該探索有效的機器學習技術，針對不同的資料特徵量身打造索引結構（參考編號 11-12）。</p>
<ul>
<li><strong>支援進階查詢語意</strong></li>
</ul>
<p>現代應用常依賴跨向量的進階查詢 - 傳統的最近鄰搜索語意已不再適用於向量資料搜索。此外，跨向量資料庫或向量與非向量資料的結合搜尋需求也逐漸浮現（參考資料第 13 號）。</p>
<p>具體而言，向量類似性的距離指標變化成長快速。傳統的相似性分數，例如歐氏距離、內積距離和余弦距離，無法滿足所有的應用需求。隨著人工智慧技術的普及，許多產業都在開發自己特定領域的向量相似度指標，例如 Tanimoto distance、Mahalanobis distance、Superstructure 和 Substructure。將這些評估指標整合到現有的搜尋演算法中，以及設計利用上述指標的新演算法，都是具有挑戰性的研究問題。</p>
<p>隨著使用者服務複雜度的增加，應用程式將需要在向量資料和非向量資料之間進行搜尋。舉例來說，內容推薦器會分析使用者的偏好、社會關係，並將其與當前的熱門話題配對，以將適當的內容推薦給使用者。此類搜尋通常涉及多種資料類型或跨多個資料處理系統的查詢。如何有效且彈性地支援此類混合搜尋是另一項系統設計挑戰。</p>
<h2 id="Authors" class="common-anchor-header">作者<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>郭仁通博士（華中科技大學計算機軟件與理論博士），Zilliz 合伙人兼研發總監。他是中國計算機聯盟分布式計算與處理技術委員會（CCF TCDCP）委員。他的研究重點是資料庫、分散式系統、快取系統和異質運算。他的研究成果已在多個頂級會議和期刊上發表，包括 Usenix ATC、ICS、DATE、TPDS 等。身為 Milvus 的架構設計師，郭博士正在尋找解決方案，以開發高擴展性和低成本的人工智能資料分析系統。</p>
<p>栾小凡，Zilliz 合伙人兼工程总监，LF AI &amp; Data Foundation 技术顾问委员会成员。曾先後在甲骨文美國總部、軟體定義存儲初創公司 Hedvig 工作。他加入阿里巴巴雲資料庫團隊，負責 NoSQL 資料庫 HBase 和 Lindorm 的開發。Luan 在康奈爾大學獲得電子計算機工程碩士學位。</p>
<p>易小蒙博士（華中科技大學計算機結構博士），Zilliz 資深研究員兼研究團隊負責人。他的研究集中在高維數據管理、大規模資訊檢索和分佈式系統的資源分配。易博士的研究成果曾發表在IEEE Network Magazine、IEEE/ACM TON、ACM SIGMOD、IEEE ICDCS和ACM TOMPECS等頂尖期刊和國際會議上。</p>
<p>Filip Haltmayer，Zilliz 資料工程師，畢業於加州大學聖克魯茲分校，取得電腦科學學士學位。加入 Zilliz 之後，Filip 的大部分時間都花在雲端部署、客戶互動、技術講座和 AI 應用程式開發上。</p>
<h2 id="References" class="common-anchor-header">參考資料<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Milvus 計畫：https://github.com/milvus-io/milvus</li>
<li>Milvus: A Purpose-Built Vector Data Management System, SIGMOD'21</li>
<li>Faiss 專案: https://github.com/facebookresearch/faiss</li>
<li>Annoy 專案: https://github.com/spotify/annoy</li>
<li>SPTAG 專案: https://github.com/microsoft/SPTAG</li>
<li>GRIP：向量搜尋引擎的多儲存容量最佳化高效能近鄰搜尋，CIKM'19</li>
<li>DiskANN：在單一節點上進行快速精確的十億點最近鄰搜索，NIPS'19</li>
<li>HM-ANN：異質記憶體上的高效十億點最近鄰搜索，NIPS'20</li>
<li>SONG：GPU 上的近似最近鄰搜索，ICDE'20</li>
<li>ottertune自動資料庫管理系統調整服務示範，VLDB'18</li>
<li>學習索引結構的案例，SIGMOD'18</li>
<li>透過學習適應性提早終止改善近似近鄰搜尋，SIGMOD'20</li>
<li>AnalyticDB-V：面向結構化和非結構化資料查詢融合的混合分析引擎，VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">參與我們的開放源碼社群：<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>在<a href="https://bit.ly/3khejQB">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://bit.ly/307HVsY">論壇</a>與社群互動。</li>
<li>在<a href="https://bit.ly/3wn5aek">Twitter</a> 上與我們聯繫。</li>
</ul>
