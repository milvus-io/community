---
id: ai-in-.md
title: 利用開放原始碼向量資料庫 Milvus 加速金融領域的人工智能發展
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: Milvus 可用於建立金融業的 AI 應用程式，包括聊天機器人、推薦系統等。
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>利用開放原始碼向量資料庫 Milvus 加速金融業的人工智慧發展</custom-h1><p>長久以來，銀行和其他金融機構都是大資料處理和分析的開放原始碼軟體的早期採用者。2010 年，Morgan Stanley<a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">開始使用</a>開放原始碼 Apache Hadoop 架構，作為小型實驗的一部分。該公司在成功擴展傳統資料庫以滿足其科學家想要利用的大量資料方面舉步維艱，因此該公司決定探索其他解決方案。Hadoop 現在已經成為 Morgan Stanley 的主要工具，協助管理 CRM 資料到投資組合分析等一切工作。其他開放源碼關聯式資料庫軟體，例如 MySQL、MongoDB 和 PostgreSQL，都是金融業理順大型資料不可或缺的工具。</p>
<p>技術是金融服務業的競爭優勢所在，而人工智能 (AI) 正迅速成為從大數據中擷取有價值的洞察力，並即時分析銀行、資產管理和保險業活動的標準方法。透過使用人工智能演算法將圖像、音訊或視訊等非結構化資料轉換為向量 (一種機器可讀取的數值資料格式)，就可以在數百萬、數十億甚至數兆個向量資料集上執行相似性搜尋。向量資料儲存在高維空間中，使用相似性搜尋找到相似向量，這需要稱為向量資料庫的專用基礎架構。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是專為管理向量資料而建立的開放原始碼向量資料庫，這表示工程師和資料科學家可以專注於建立 AI 應用程式或進行分析 - 而不是底層資料基礎架構。該平台圍繞 AI 應用程式開發工作流程而建立，並針對簡化機器學習作業 (MLOps) 進行最佳化。有關 Milvus 及其底層技術的更多資訊，請瀏覽我們的<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">部落</a>格。</p>
<p>人工智能在金融服務產業的常見應用包括演算法交易、投資組合組成與最佳化、模型驗證、回溯測試、機器人諮詢 (Robo-advising)、虛擬客戶助理、市場影響分析、法規遵循以及壓力測試。本文涵蓋三個特定領域，在這些領域中，向量資料被利用為銀行和金融公司最有價值的資產之一：</p>
<ol>
<li>利用銀行聊天機器人提升客戶體驗</li>
<li>利用推薦系統提升金融服務銷售額等</li>
<li>利用語意文字挖掘分析收益報告和其他非結構化財務資料</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">利用銀行聊天機器人提升客戶體驗</h3><p>銀行聊天機器人可以幫助消費者選擇投資、銀行產品和保單，從而改善客戶體驗。數位服務迅速普及，部分原因是冠狀病毒大流行加速了趨勢。聊天機器人的工作方式是使用自然語言處理 (NLP) 將使用者提交的問題轉換為語意向量，以搜尋符合的答案。現代的銀行聊天機器人為使用者提供個人化的自然體驗，並以對話的口吻說話。Milvus 提供的資料結構非常適合使用即時向量相似性搜尋來建立聊天機器人。</p>
<p>請參閱我們的示範，瞭解更多有關<a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">使用 Milvus</a> 建立<a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">聊天機器人</a>的資訊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">利用推薦系統提升金融服務銷售額等：</h4><p>私人銀行業使用推薦系統，透過基於客戶資料的個人化推薦，提高金融產品的銷售額。推薦系統也可利用於金融研究、商業新聞、股票選擇和交易支援系統。感謝深度學習模型，每個使用者和項目都被描述為一個嵌入向量。向量資料庫提供一個嵌入空間，可計算使用者與項目之間的相似性。</p>
<p>從我們的<a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">示範中</a>瞭解更多有關 Milvus 基於圖表的推薦系統的資訊。</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">使用語意文字挖掘分析收益報告和其他非結構化財務資料：</h4><p>文字挖掘技術對金融業產生了重大影響。隨著金融資料呈指數級成長，文字挖掘已成為金融領域的重要研究領域。</p>
<p>目前，深度學習模型被應用於透過能夠捕捉眾多語意方面的單詞向量來表示財務報告。像 Milvus 這樣的向量資料庫，能夠儲存數百萬份報告中的大量語意單字向量，然後在幾毫秒內對其進行相似性搜尋。</p>
<p>進一步瞭解如何將<a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">deepset 的 Haystack 與 Milvus 搭配使用</a>。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">不要成為陌生人</h3><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找 Milvus 或為 Milvus 做出貢獻。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
