---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: 選擇嵌入相似性搜尋引擎
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: 萬用APP個案研究
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>以項目為基礎的協同篩選用於音樂推薦系統</custom-h1><p>Wanyin App 是一個以人工智能為基礎的音樂分享社群，旨在鼓勵音樂分享，並讓音樂愛好者更輕鬆地創作音樂。</p>
<p>Wanyin 的音樂庫包含使用者上傳的大量音樂。其主要任務是根據使用者之前的行為來分類出他們感興趣的音樂。我們評估了兩種經典模型：基於使用者的協同篩選 (User-based CF) 和基於項目的協同篩選 (Item-based CF)，作為潛在的推薦系統模型。</p>
<ul>
<li>基於使用者的協同篩選 (User-based CF) 使用相似度統計來取得具有相似偏好或興趣的鄰近使用者。透過擷取的最近鄰居集合，系統可以預測目標使用者的興趣，並產生推薦。</li>
<li>由 Amazon 引進的物品型 CF，或稱物品對物品 (I2I) CF，是推薦器系統的知名協同篩選模型。它計算項目之間的相似性，而不是使用者之間的相似性，其基礎是假設感興趣的項目必須與高分數的項目相似。</li>
</ul>
<p>以使用者為基礎的 CF 在使用者數量超過一定程度時，可能會導致計算時間過長。考慮到我們產品的特性，我們決定使用 I2I CF 來實作音樂推薦系統。由於我們沒有太多歌曲的元資料，因此我們必須處理歌曲本身，從中抽取特徵向量 (embeddings)。我們的方法是將這些歌曲轉換成 mel-frequency cepstrum (MFC)，設計一個卷積式神經網路 (CNN) 來抽取歌曲的特徵嵌入，然後透過嵌入相似性搜尋來進行音樂推薦。</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">選擇嵌入相似性搜尋引擎<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>有了特徵向量之後，剩下的問題就是如何從大量向量中找出與目標向量相似的向量。說到嵌入式搜尋引擎，我們在 Faiss 和 Milvus 之間徘徊。我是在 2019 年 11 月瀏覽 GitHub 的趨勢套件庫時注意到 Milvus 的。我看了一下這個專案，它的抽象 API 非常吸引我。(當時它的版本是 v0.5.x，現在是 v0.10.2）。</p>
<p>相較於 Faiss，我們更喜歡 Milvus。一方面，我們之前用過 Faiss，因此想嘗試新的東西。另一方面，相較於 Milvus，Faiss 更像是一個底層的函式庫，因此使用起來不太方便。隨著我們對 Milvus 的深入瞭解，我們最終決定採用 Milvus，因為它有兩個主要特點：</p>
<ul>
<li>Milvus 非常容易使用。您只需要拉取其 Docker 映像檔，並根據自己的使用情境更新參數即可。</li>
<li>它支援更多索引，並有詳細的支援說明文件。</li>
</ul>
<p>一言以蔽之，Milvus 對使用者非常友善，說明文件也相當詳盡。如果您遇到任何問題，通常可以在說明文件中找到解決方案；否則，您可以隨時向 Milvus 社群尋求支援。</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Milvus 集群服務 ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>在決定使用 Milvus 作為功能向量搜尋引擎後，我們在開發 (DEV) 環境中配置了一個獨立節點。它已經運作了好幾天，因此我們計劃在工廠驗收測試 (FAT) 環境中執行測試。如果獨立節點在生產中當機，整個服務都會變得不可用。因此，我們需要部署高可用性的搜尋服務。</p>
<p>Milvus 提供集群分片中介軟體 Mishards 和用於設定的 Milvus-Helm。部署 Milvus 叢集服務的過程很簡單。我們只需要更新一些參數，然後將它們打包部署到 Kubernetes。下圖來自 Milvus 的說明文件，顯示 Mishards 如何運作：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards 將上游的請求逐級下傳到其子模組，分割上游的請求，然後將子服務的結果收集並傳回給上游。基於 Mishards 的叢集解決方案的整體架構如下所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>官方文件對 Mishards 有清楚的介紹。如果您有興趣，可以參考<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>。</p>
<p>在我們的音樂推薦系統中，我們使用 Milvus-Helm 在 Kubernetes 部署了一個可寫節點、兩個唯讀節點和一個 Mishards 中介軟體實體。當服務在 FAT 環境中穩定地執行了一段時間之後，我們將它部署到生產環境中。到目前為止都很穩定。</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 I2I 音樂推薦 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>如上文所述，我們使用抽取的現有歌曲嵌入值建立了萬音的 I2I 音樂推薦系統。首先，我們將用戶上傳的新歌曲的人聲和 BGM（音軌分離）分開，並提取 BGM 嵌入作為歌曲的特徵表示。這也有助於篩選出原創歌曲的翻唱版本。接下來，我們將這些嵌入資料儲存在 Milvus 中，根據使用者收聽的歌曲搜尋類似歌曲，然後將擷取的歌曲排序並重新排列，以產生音樂推薦。實作流程如下所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 重複歌曲過濾器<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>我們使用 Milvus 的另一個情境是重複歌曲過濾。有些使用者會多次上傳相同的歌曲或片段，這些重複的歌曲可能會出現在他們的推薦清單中。這表示如果不經過預先處理就產生推薦，會影響使用者體驗。因此，我們需要找出重複的歌曲，並透過預先處理來確保它們不會出現在相同的清單上。</p>
<p>我們使用 Milvus 的另一個情境是重複歌曲過濾。有些使用者會多次上傳相同的歌曲或片段，這些重複的歌曲可能會出現在他們的推薦清單中。這表示如果不經過預先處理就產生推薦，會影響使用者的使用經驗。因此，我們需要找出重複的歌曲，並透過預先處理來確保它們不會出現在相同的清單上。</p>
<p>與之前的情況相同，我們透過搜尋相似的特徵向量來實現重複歌曲過濾。首先，我們將人聲和 BGM 分開，並使用 Milvus 擷取一些相似的歌曲。為了精確過濾重複歌曲，我們擷取了目標歌曲與相似歌曲的音頻指紋 (使用 Echoprint、Chromaprint 等技術)，計算目標歌曲的音頻指紋與每一首相似歌曲指紋之間的相似度。如果相似度超過臨界值，我們就會將該歌曲定義為目標歌曲的複製品。音頻指紋比對的過程使重複歌曲的篩選更加精確，但也很費時。因此，當要篩選大量音樂庫中的歌曲時，我們使用 Milvus 來篩選我們的候選重複歌曲作為初步步驟。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filter-songs-music-recommender-duplicates.png</span> </span></p>
<p>為了實現婉音海量音樂庫的 I2I 推薦系統，我們的做法是提取歌曲的 embeddings 作為其特徵，召回與目標歌曲 embeddings 相似的 embeddings，然後將結果排序並重新排列，生成推薦列表提供給用戶。為了達到即時推薦的目的，我們選擇 Milvus 而非 Faiss 作為我們的特徵向量相似性搜尋引擎，因為 Milvus 被證明是更容易使用且更複雜的。同樣地，我們也將 Milvus 應用於重複歌曲過濾，提升使用者體驗與效率。</p>
<p>您可以下載<a href="https://enjoymusic.ai/wanyin">Wanyin App</a>🎶 試用。(註：可能並非所有應用程式商店都有提供。)</p>
<h3 id="📝-Authors" class="common-anchor-header">📝作者：</h3><p>Jason，Stepbeats 演算法工程師 陳世宇，Zilliz 資料工程師</p>
<h3 id="📚-References" class="common-anchor-header">📚 參考資料：</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗不要陌生，請在<a href="https://twitter.com/milvusio/">Twitter</a>上關注我們或在<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> 上加入我們！👇🏻</strong></p>
