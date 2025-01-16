---
id: 2022-01-20-story-of-smartnews.md
title: SmartNews 的故事 - 從 Milvus 使用者到積極的貢獻者
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: 了解 SmartNews 的故事，它既是 Milvus 的用戶也是貢獻者。
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>本文由<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 翻譯。</p>
<p>資訊在我們的生活中無所不在。Meta (前身為 Facebook)、Instagram、Twitter 和其他社交媒體平台讓資訊流更加無所不在。因此，處理這些資訊流的引擎已成為大多數系統架構的必備功能。然而，身為社群媒體平台和相關應用程式的使用者，我敢說您一定曾被重複的文章、新聞、memes 等內容所困擾。接觸重複的內容會妨礙資訊檢索的過程，並導致不良的使用者體驗。</p>
<p>對於處理資訊流的產品而言，開發人員的首要任務是找到一個可無縫整合至系統架構的彈性資料處理器，以刪除重複的相同新聞或廣告。</p>
<p>估值<a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">20 億美元</a>的<a href="https://www.smartnews.com/en/">SmartNews</a> 是美國估值最高的新聞應用程式公司。值得注意的是，它曾是開源向量資料庫 Milvus 的使用者，但後來轉型為 Milvus 計畫的積極貢獻者。</p>
<p>本文將分享 SmartNews 的故事，並說明 SmartNews 決定對 Milvus 計畫做出貢獻的原因。</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">SmartNews 概要<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews 成立於 2012 年，總部設在日本東京。SmartNews 開發的新聞應用程式在日本市場一直<a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">名列前茅</a>。SmartNews 是<a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">增長最快的</a>新聞應用程式，在美國市場也擁有<a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">很高的用戶黏性</a>。根據<a href="https://www.appannie.com/en/">APP Annie</a> 的統計，截至 2021 年 7 月底，SmartNews 的每月平均會話時間在所有新聞應用程式中排名第一，大於 AppleNews 和 Google News 的累積會話時間。</p>
<p>隨著用戶基數與黏性的快速成長，SmartNews 在推薦機制與 AI 演算法上也面臨更多挑戰。這些挑戰包括在大規模機器學習（ML）中利用海量離散特徵、利用向量相似性搜索加速非結構化資料查詢等。</p>
<p>2021 年初，SmartNews 的動態廣告演算法團隊向 AI 架構團隊提出要求，需要優化召回與查詢廣告的功能。經過兩個月的研究，AI 基礎建設工程師 Shu 決定使用 Milvus，這是一個開放源碼的向量資料庫，支援多重索引與相似度指標，並可線上更新資料。Milvus 獲得全球一千多家機構的信賴。</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">以向量相似性搜尋為動力的廣告推薦<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews Ad 系統採用開放原始碼向量資料庫 Milvus，從 10 百萬億規模的資料集中匹配並推薦動態廣告給使用者。藉此，SmartNews 可以在兩個之前無法匹配的資料集 - 使用者資料和廣告資料之間建立映射關係。在 2021 年第二季，Shu 成功在 Kubernetes 上部署 Milvus 1.0。進一步瞭解如何<a href="https://milvus.io/docs">部署 Milvus</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Milvus 1.0 成功部署後，第一個使用 Milvus 的專案是 SmartNews 的廣告團隊發起的廣告召回專案。在最初階段，廣告資料集的規模為百萬級。同時，P99 延遲嚴格控制在 10 毫秒以內。</p>
<p>2021 年 6 月，舒展和演算法團隊的同事將 Milvus 應用到更多的業務場景中，嘗試實時的資料聚合和線上資料/索引更新。</p>
<p>至此，Milvus 這個開源向量資料庫已經在 SmartNews 的各種業務場景中得到了應用，包括廣告推薦。</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>從使用者到積極貢獻者</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>在將 Milvus 整合到 Smartnews 產品架構中時，Shu 和其他開發人員提出了一些功能需求，例如熱重新載入、項目 TTL（time-to-live）、項目更新/更換等。這些也是 Milvus 社群中許多使用者所希望的功能。因此，SmartNews 的 AI 基礎架構團隊負責人 Dennis Zhao 決定開發並將 hot reload 功能貢獻給社群。Dennis 認為：「SmartNews 團隊一直受益於 Milvus 社群，因此，如果我們有東西可以與社群分享，我們非常樂意貢獻。」</p>
<p>Data reload 支援在執行程式碼的同時編輯程式碼。在數據重載的幫助下，開發人員不再需要停在斷點或重新啟動應用程式。相反，他們可以直接編輯程式碼，並即時看到結果。</p>
<p>七月底，SmartNews 的工程師 Yusup 提出了使用<a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">集合別名</a>來實現熱重載的想法。</p>
<p>建立集合別名是指為集合指定別名。一個集合可以有多個別名。但是，一個別名最多對應一個集合。簡單地將集合與儲物櫃相提並論。儲物櫃和集合一樣，都有自己的編號和位置，而且永遠保持不變。但是，您總是可以從儲物櫃中放入或取出不同的東西。同樣地，集合的名稱是固定的，但集合中的資料是動態的。您總是可以在集合中插入或刪除向量，因為 Milvus<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pre-GA 版本</a>支援資料刪除。</p>
<p>就 SmartNews 廣告業務而言，當產生新的動態廣告向量時，會插入或更新將近 1 億個向量。對此，有幾種解決方案：</p>
<ul>
<li>解決方案 1：先刪除舊資料，再插入新資料。</li>
<li>解決方案 2：為新資料建立新的集合。</li>
<li>解決方案 3：使用集合別名。</li>
</ul>
<p>對於解決方案 1，最直接的缺點之一就是非常耗時，尤其是當需要更新的資料集非常龐大時。更新一個 1 億規模的資料集一般需要數小時。</p>
<p>至於解決方案 2，問題在於新的資料集無法立即可供搜尋。也就是說，資料集在載入時是無法搜尋的。此外，Milvus 不允許兩個資料集使用相同的資料集名稱。若要切換到新的集合，使用者總是需要手動修改客戶端程式碼。也就是說，使用者每次需要切換不同的收藏集時，都必須修改參數<code translate="no">collection_name</code> 的值。</p>
<p>解決方案 3 將會是銀彈。您只需要在新的集合中插入新資料，並使用集合別名。如此一來，每次需要切換集合進行搜尋時，您只需要交換集合別名即可。您不需要額外修改程式碼。此解決方案可讓您省去前兩個解決方案所提到的麻煩。</p>
<p>Yusup 從這個要求開始，幫助整個 SmartNews 團隊了解 Milvus 架構。一個半月之後，Milvus 計畫收到了 Yusup 關於 hot reload 的 PR。之後，隨著 Milvus 2.0.0-RC7 的發行，這項功能也正式可用。</p>
<p>目前，人工智能基礎建設團隊正率先部署 Milvus 2.0，並逐步將所有資料從 Milvus 1.0 遷移到 2.0。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection alias</span> </span></p>
<p>對於集合別名的支援可以大大提升用戶體驗，特別是對於那些用戶請求量巨大的大型互聯網公司。來自 Milvus 社群的資料工程師李成龍協助搭建了 Milvus 與 Smartnews 之間的橋梁，他表示：「集合別名功能源自於 Milvus 用戶 SmartNews 的真實商業需求。而 SmartNews 將程式碼貢獻給 Milvus 社群。這種互惠行為是開放原始碼精神的最佳範例：來自社群、為了社群。我們希望看到更多像 SmartNews 這樣的貢獻者，共同打造更繁榮的 Milvus 社群。"</p>
<p>"目前，部分廣告業務採用 Milvus 作為離線向量資料庫。Mivus2.0正式發布在即，我們希望可以利用Milvus建立更可靠的系統，為更多的業務場景提供即時服務。" Dennis說。</p>
<blockquote>
<p>更新：Milvus 2.0 現已全面上市！<a href="/blog/zh-hant/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">瞭解更多</a></p>
</blockquote>
