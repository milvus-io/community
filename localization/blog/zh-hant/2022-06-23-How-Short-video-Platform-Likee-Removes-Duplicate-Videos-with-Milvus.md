---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: 短影片平台 Likee 如何利用 Milvus 移除重複影片
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: 了解 Likee 如何使用 Milvus 在幾毫秒內識別重複視訊。
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文由 BIGO 工程師郭昕陽和韓寶宇撰寫，<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a> 翻譯。</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a>(BIGO) 是新加坡成長最快的科技公司之一。在人工智能技術的支持下，BIGO 以視頻為基礎的產品和服務在全球範圍內廣受歡迎，在 150 多個國家擁有超過 4 億用戶。其中包括<a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a>（即時串流）和<a href="https://likee.video/">Likee</a>（短視頻）。</p>
<p>Likee 是一個全球性的短片創作平台，使用者可以在此分享他們的美好時刻、表達自我，並與世界連繫。為了增加使用者體驗，並推薦更高品質的內容給使用者，Likee 需要從使用者每天產生的大量影片中剔除重複影片，這並不是一件簡單的工作。</p>
<p>這篇部落格將介紹 BIGO 如何使用開放原始碼向量資料庫<a href="https://milvus.io">Milvus</a> 來有效去除重複影片。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#Overview">概觀</a></li>
<li><a href="#Video-deduplication-workflow">重複影片刪除工作流程</a></li>
<li><a href="#System-architecture">系統架構</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">使用 Milvus 強化相似性搜尋</a></li>
</ul>
<custom-h1>概觀</custom-h1><p>Milvus 是一個開放原始碼向量資料庫，具有超快速向量搜尋功能。在 Milvus 的支援下，Likee 可以在 200 毫秒內完成搜尋，並確保高召回率。同時，透過<a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">水平擴充 Milvus</a>，Likee 成功提高向量查詢的吞吐量，進一步提升效率。</p>
<custom-h1>重複影片刪除工作流程</custom-h1><p>Likee 如何識別重複視訊？每次將查詢的視訊輸入 Likee 系統時，都會將視訊切割成 15-20 幀，並將每一幀轉換成一個特徵向量。之後，Likee 會在包含 7 億個向量的資料庫中進行搜尋，找出前 K 個最相似的向量。前 K 個向量各對應資料庫中的一段影片。Likee 會進一步進行精細搜尋，以獲得最終結果，並決定要移除的視訊。</p>
<custom-h1>系統架構</custom-h1><p>讓我們仔細看看 Likee 的視訊重複刪除系統如何使用 Milvus 運作。如下圖所示，上傳至 Likee 的新影片會即時寫入資料儲存系統 Kafka，並由 Kafka 消費者消費。這些影片的特徵向量會透過深度學習模型來萃取，非結構化資料（影片）會轉換成特徵向量。這些特徵向量將由系統打包，並傳送給相似度稽核人員。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Likee 視訊重複刪除系統架構圖</span> </span></p>
<p>擷取的特徵向量將由 Milvus 編入索引並儲存在 Ceph 中，然後再<a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">由 Milvus 查詢節點載入</a>以進行進一步搜尋。這些特徵向量所對應的影片 ID 也會依據實際需求，同時儲存在 TiDB 或 Pika 中。</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">使用 Milvus 向量資料庫強化相似性搜尋</h3><p>在搜尋相似向量時，數以十億計的現有資料，加上每天產生的大量新資料，對向量搜尋引擎的功能提出了極大的挑戰。經過深入分析，Likee 最終選擇了具有高性能、高召回率的分佈式向量搜索引擎 Milvus 來進行向量相似性搜索。</p>
<p>如下圖所示，相似度搜尋的流程如下：</p>
<ol>
<li><p>首先，Milvus 會執行批次搜尋，以召回從新視訊中萃取的多個特徵向量中，每個特徵向量的前 100 個相似向量。每個相似向量都與其對應的視訊 ID 綁定。</p></li>
<li><p>其次，透過比較視訊 ID，Milvus 會移除重複的視訊，並從 TiDB 或 Pika 擷取剩餘視訊的特徵向量。</p></li>
<li><p>最後，Milvus 會計算每組擷取的特徵向量與查詢視訊的特徵向量之間的相似度並進行評分。得分最高的視訊 ID 會作為結果傳回。如此一來，視訊相似性搜尋就完成了。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>相似性搜尋的程序</span> </span></p>
<p>作為一個高性能的向量搜尋引擎，Milvus 在 Likee 的視頻去重複系統中表現出色，大大推動了 BIGO 短視頻業務的發展。在視頻業務方面，Milvus 還可以應用在很多其他場合，例如非法內容封堵或個性化視頻建議等。BIGO和Milvus都期待未來在更多領域的合作。</p>
