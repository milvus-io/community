---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: 使用語意向量搜尋推薦內容
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: 了解如何使用 Milvus 在應用程式內建立智慧型新聞推薦系統。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>在搜狐新聞應用程式中建立智慧型新聞推薦系統</custom-h1><p><a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71%的美國人</a>從社交平台獲得新聞推薦，個性化內容已迅速成為新媒體的發現方式。無論人們是搜尋特定主題，或是與推薦內容互動，使用者所看到的一切都經過演算法最佳化，以提高點閱率 (CTR)、參與度和相關性。搜狐是一家在納斯達克上市的中國在線媒體、視頻、搜索和遊戲集團。它利用由<a href="https://zilliz.com/">Zilliz</a> 建立的開放源碼向量資料庫<a href="https://milvus.io/">Milvus</a>，在其新聞應用程式內建立語意向量搜尋引擎。本文將解釋該公司如何利用使用者資料，隨時間微調個人化內容推薦，改善使用者體驗與參與。</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">使用語意向量搜尋推薦內容<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>搜狐新聞的用戶資料是根據瀏覽記錄建立的，並在用戶搜尋新聞內容和與新聞內容互動時進行調整。搜狐的推薦系統使用語義向量搜尋來尋找相關的新聞文章。該系統的工作原理是根據瀏覽歷史識別一組每個用戶預計會感興趣的標籤。然後它會快速搜尋相關文章，並按受歡迎程度（以平均 CTR 衡量）將結果排序，再提供給使用者。</p>
<p>單是《紐約時報》每天就發表<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 篇內容</a>，由此可見有效的推薦系統必須能夠處理大量的新內容。大量新聞的擷取需要毫秒級的相似性搜尋，以及每小時將標籤與新內容相匹配。搜狐之所以選擇 Milvus，是因為它能有效且精確地處理大量資料集、減少搜尋過程中的記憶體使用量，並支援高效能部署。</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">瞭解新聞推薦系統的工作流程<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>搜狐基於語義向量搜尋的內容推薦依賴於深度結構化語義模型 (DSSM)，該模型使用兩個神經網路將用戶查詢和新聞文章表示為向量。該模型會計算兩個語意向量的余弦相似度，然後將最相似的一批新聞發送至推薦候選池。接下來，新聞文章會根據其預估的點擊率進行排序，點擊率預估最高的新聞文章會顯示給使用者。</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">使用 BERT-as-service 將新聞文章編碼為語意向量</h3><p>為了將新聞文章編碼為語意向量，系統使用<a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>工具。在使用此模型時，如果任何一篇內容的字數超過 512，在嵌入過程中就會發生資訊遺失。為了幫助克服這個問題，系統會先擷取摘要並將其編碼成 768 維的語意向量。接著從每篇新聞文章中抽取兩個最相關的主題，並根據主題 ID 識別出對應的預先訓練主題向量 (200-dimensions)。接著，將主題向量拼接到從文章摘要中抽取的 768 維語義向量中，形成 968 維語義向量。</p>
<p>新內容不斷透過 Kafta 傳入，並在插入 Milvus 資料庫之前轉換為語意向量。</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">利用 BERT-as-service 從使用者檔案中擷取語意相似的標籤</h3><p>模型的另一個神經網路是使用者語意向量。語義相似的標籤 (例如：冠狀病毒、covid、COVID-19、大流行病、新型病毒株、肺炎) 是根據興趣、搜尋查詢和瀏覽歷史從使用者檔案中擷取的。取得的標籤清單會依據權重排序，前 200 個標籤會被分成不同的語意群組。每個語意群組內標籤的組合會用來產生新的標籤詞組，然後透過 BERT-as-service 將其編碼為語意向量。</p>
<p>對於每個使用者個人資料，標籤詞組都有<a href="https://github.com/baidu/Familia">一組對應的主題</a>，這些<a href="https://github.com/baidu/Familia">主題</a>以權重標示使用者的興趣等級。在所有相關主題中，挑選出前兩個主題，經由機器學習 (ML) 模型編碼，拼接成對應的標籤語意向量，形成 968 維的使用者語意向量。即使系統為不同的使用者產生相同的標籤，但標籤及其對應主題的不同權重，以及每個使用者主題向量之間的明確差異，確保了推薦的唯一性</p>
<p>通過計算從用戶檔案和新聞文章中提取的語義向量的余弦相似度，系統能夠進行個性化的新聞推薦。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>搜狐01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">計算新的語義用戶檔案向量並插入到 Milvus 中</h3><p>每天計算語義用戶檔案向量，並在第二天晚上處理前 24 小時的資料。向量會個別插入 Milvus，並透過查詢流程來為使用者提供相關的新聞結果。新聞內容本身就是熱門話題，因此需要每小時執行一次計算，以產生目前的新聞饋送，其中包含具有高預測點擊率且與使用者相關的內容。新聞內容也會依日期分區排序，舊新聞則會每日清除。</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">將語義向量萃取時間從數天縮短到數小時</h3><p>使用語意向量擷取內容需要每天將數以千萬計的標籤短語轉換為語意向量。這是一個耗時的過程，即使在可加速此類計算的繪圖處理單元 (GPU) 上執行，也需要數天才能完成。為了克服這個技術問題，必須優化先前嵌入的語意向量，以便當相似的標籤短語浮現時，可以直接擷取相對應的語意向量。</p>
<p>現有標籤詞組的語意向量會被儲存，而每天產生的新標籤詞組則會被編碼成 MinHash 向量。<a href="https://milvus.io/docs/v1.1.1/metric.md">Jaccard 距離會</a>用來計算新標籤詞組的 MinHash 向量與儲存的標籤詞組向量之間的相似度。如果 Jaccard 距離超過預先定義的臨界值，則認為這兩組相似。如果相似度達到臨界值，新的詞組就可以利用先前嵌入的語意資訊。測試顯示，0.8 以上的距離應該可以保證在大多數情況下有足夠的準確性。</p>
<p>透過這個過程，上述數千萬向量的每日轉換時間從數天縮短到約兩小時。雖然根據特定專案的需求，其他儲存語意向量的方法可能更為合適，但在 Milvus 資料庫中使用 Jaccard 距離計算兩個標記短語之間的相似度，在各種情況下仍然是有效且精確的方法。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>搜狐02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">克服短文本分類的「壞情況<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>在對新聞文本進行分類時，與長篇新聞相比，短篇新聞的提取特徵較少。正因如此，當長短不一的內容在同一個分類器中運行時，分類演算法就會失敗。Milvus 可協助解決這個問題，它會搜尋多篇語意相似、分數可靠的長篇文字分類資訊，然後運用投票機制來修改短篇文字分類。</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">識別並解決錯誤分類的短文本</h3><p>每篇新聞文章的精確分類對於提供有用的內容推薦至關重要。由於短篇新聞文章的特徵較少，因此對不同長度的新聞應用相同的分類器，會導致短篇文字分類的錯誤率較高。對於這項任務而言，人工標籤的速度太慢且不準確，因此 BERT-as-service 和 Milvus 用來快速找出成批被錯誤分類的短篇文字，並正確地重新分類，然後將成批的資料做為針對這個問題進行訓練的語料庫。</p>
<p>使用 BERT-as-service 將總數五百萬篇分類器分數大於 0.9 的新聞長文編碼為語意向量。將長篇新聞插入 Milvus 之後，再將短篇新聞編碼為語意向量。每個短篇新聞的語意向量用來查詢 Milvus 資料庫，並取得與目標短篇新聞具有最高余弦相似度的前 20 篇長篇新聞。如果前 20 篇語意相似度最高的長新聞中有 18 篇出現在相同的分類中，而且與查詢的短新聞的分類不同，那麼短新聞的分類就會被視為不正確，必須調整以符合這 18 篇長新聞。</p>
<p>此流程可快速識別並修正不準確的短篇新聞分類。隨機抽樣統計顯示，短篇文字分類修正後，文字分類的整體準確率超過 95%。利用高準確度長文字的分類來糾正短文字的分類，可以在短時間內糾正大部分的不良分類案例。這也為訓練短文本分類器提供了良好的語料庫。</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg 「發現短文本分類 」壞案例 「的流程圖」)</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus 可實現即時新聞內容推薦等功能<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 大大提高了搜狐新聞推薦系統的即時性能，同時也增強了識別錯誤分類短文本的效率。如果您有興趣瞭解 Milvus 及其各種應用：</p>
<ul>
<li>閱讀我們的<a href="https://zilliz.com/blog">部落格</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用或貢獻世界上最流行的向量資料庫。</li>
<li>使用我們新的<a href="https://github.com/milvus-io/bootcamp">bootcamp</a> 快速測試和部署 AI 應用程式。</li>
</ul>
