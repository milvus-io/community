---
id: AI-applications-with-Milvus.md
title: 如何使用 Milvus 製作 4 款受歡迎的 AI 應用程式
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus 可加速機器學習應用程式開發與機器學習作業 (MLOps)。有了 Milvus，您可以快速開發最小可行產品
  (MVP)，同時將成本控制在較低的極限。
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>如何使用 Milvus 製作 4 款受歡迎的 AI 應用程式</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>部落格封面.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼的向量資料庫。它支援大量向量資料集的新增、刪除、更新和近乎即時的搜尋，這些資料集是利用 AI 模型從非結構化資料中抽取特徵向量所建立的。Milvus 擁有一套完整直觀的 API，並支援多個廣泛採用的索引函式庫 (例如 Faiss、NMSLIB 和 Annoy)，可加速機器學習應用程式開發和機器學習作業 (MLOps)。透過 Milvus，您可以快速開發最小可行產品 (MVP)，同時將成本控制在較低的極限。</p>
<p>「使用 Milvus 開發 AI 應用程式有哪些資源？」這是 Milvus 社群常被問到的問題。Milvus 背後的<a href="https://zilliz.com/">公司</a>Zilliz 開發了許多 Demo，利用 Milvus 進行快如閃電的相似性搜尋，為智慧型應用程式提供動力。Milvus 解決方案的原始碼可在<a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a> 找到。以下互動情境展示了自然語言處理 (NLP)、反向圖像搜尋、音訊搜尋和電腦視覺。</p>
<p>請隨意試用這些解決方案，以獲得特定情境的實作經驗！透過下列方式分享您自己的應用方案</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">自然語言處理 (聊天機器人)</a></li>
<li><a href="#reverse-image-search-systems">反向圖片搜尋</a></li>
<li><a href="#audio-search-systems">音訊搜尋</a></li>
<li><a href="#video-object-detection-computer-vision">視訊物件偵測（電腦視覺）</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">自然語言處理（聊天機器人）</h3><p>Milvus 可用於建立聊天機器人，利用自然語言處理來模擬真人操作員、回答問題、將使用者導向至相關資訊，並降低人力成本。為了展示此應用情境，Zilliz 結合 Milvus 與為 NLP 預先訓練而開發的機器學習 (ML) 模型<a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>，建立了一個能理解語意語言的 AI 驅動聊天機器人。</p>
<p>👉原始碼：zilliz-bootcamp/intelligent_question_answering_v2</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li><p>上傳包含問題與答案對的資料集。將問題和答案格式化為兩個獨立的欄位。您也可以下載<a href="https://zilliz.com/solutions/qa">範例資料集</a>。</p></li>
<li><p>輸入問題後，會從上傳的資料集中擷取相似問題的清單。</p></li>
<li><p>選擇與您的問題最相似的問題，揭示答案。</p></li>
</ol>
<p>影片：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[示範] 由 Milvus 提供的 QA 系統</a></p>
<h4 id="How-it-works" class="common-anchor-header">如何運作</h4><p>使用 Google 的 BERT 模型將問題轉換為特徵向量，然後再使用 Milvus 來管理和查詢資料集。</p>
<p><strong>資料處理：</strong></p>
<ol>
<li>使用 BERT 將上傳的問題-答案對轉換成 768 維特徵向量。之後將向量匯入 Milvus 並指定個別 ID。</li>
<li>問題和相對應的答案向量 ID 會儲存在 PostgreSQL 中。</li>
</ol>
<p><strong>搜尋類似問題：</strong></p>
<ol>
<li>BERT 用於從使用者輸入的問題中抽取特徵向量。</li>
<li>Milvus 會擷取與輸入問題最相似的問題向量 ID。</li>
<li>系統會在 PostgreSQL 中查找相應的答案。</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">反向圖像搜尋系統</h3><p>反向圖像搜尋正透過個人化商品推薦和類似商品查詢工具，改變電子商務，從而提升銷售額。在此應用情境中，Zilliz 結合 Milvus 與可萃取圖像特徵的 ML 模型<a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>，建立了一套反向圖像搜尋系統。</p>
<p>👉原始碼：zilliz-bootcamp/image_search</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上傳僅由 .jpg 影像組成的壓縮影像資料集（不接受其他影像檔案類型）。另外，您也可以下載<a href="https://zilliz.com/solutions/image-search">樣本資料集</a>。</li>
<li>上傳一張影像，作為搜尋類似影像的輸入。</li>
</ol>
<p>👉視訊：<a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[示範] 由 Milvus 提供的圖片搜尋功能</a></p>
<h4 id="How-it-works" class="common-anchor-header">如何運作</h4><p>使用 VGG 模型將影像轉換成 512 維的特徵向量，然後再使用 Milvus 來管理和查詢資料集。</p>
<p><strong>資料處理：</strong></p>
<ol>
<li>使用 VGG 模型將上傳的影像資料集轉換為特徵向量。之後將向量匯入 Milvus，並指定個別 ID。</li>
<li>影像特徵向量和對應的影像檔案路徑會儲存在 CacheDB 中。</li>
</ol>
<p><strong>搜尋類似影像：</strong></p>
<ol>
<li>VGG 用於將用戶上傳的圖像轉換為特徵向量。</li>
<li>從 Milvus 擷取與輸入影像最相似的影像向量 ID。</li>
<li>系統會在 CacheDB 中查找相應的圖像檔案路徑。</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">音訊搜尋系統</h3><p>語音、音樂、音效和其他類型的音訊搜尋使快速查詢大量音訊資料和浮現相似聲音成為可能。其應用包括識別相似的音效、盡量減少 IP 侵犯等。為了展示此應用情境，Zilliz 結合 Milvus 與<a href="https://arxiv.org/abs/1912.10211">PANNs（一種</a>專為音訊模式識別而建立的大規模預訓音訊神經網路），建立了一套高效率的音訊相似性搜尋系統。</p>
<p>👉原始碼：zilliz-bootcamp/audio_search<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上傳僅包含 .wav 檔案的壓縮音訊資料集（不接受其他音訊檔案類型）。或者，您也可以下載<a href="https://zilliz.com/solutions/audio-search">樣本資料集</a>。</li>
<li>上傳 .wav 檔案，作為搜尋類似音訊的輸入。</li>
</ol>
<p>👉視訊：<a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[示範] 由 Milvus 提供的音訊搜尋功能</a></p>
<h4 id="How-it-works" class="common-anchor-header">如何運作</h4><p>使用 PANNs 將音訊轉換為特徵向量，PANNs 是專為音訊模式識別而建立的大型預訓音訊神經網路。然後再使用 Milvus 來管理和查詢資料集。</p>
<p><strong>資料處理：</strong></p>
<ol>
<li>PANNs 將上傳資料集的音訊轉換為特徵向量。之後將向量匯入 Milvus 並分配個別 ID。</li>
<li>音訊特徵向量 ID 及其對應的 .wav 檔案路徑會儲存在 PostgreSQL 中。</li>
</ol>
<p><strong>搜尋相似的音訊：</strong></p>
<ol>
<li>PANNs 用於將用戶上傳的音訊檔案轉換為特徵向量。</li>
<li>透過計算內積 (IP) 距離，從 Milvus 擷取與上傳檔案最相似的音訊向量 ID。</li>
<li>系統會在 MySQL 中尋找對應的音訊檔案路徑。</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">視訊物件偵測 (電腦視覺)</h3><p>視訊物件偵測可應用於電腦視覺、影像檢索、自動駕駛等。為了展示此應用情境，Zilliz 結合 Milvus 與<a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>、<a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> 和<a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a> 等技術和演算法，建立了一套視訊物件偵測系統。</p>
<p>👉原始碼：<a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上傳僅由 .jpg 檔案組成的壓縮影像資料集（不接受其他影像檔案類型）。確保每個影像檔案都以其描述的物件命名。您也可以下載<a href="https://zilliz.com/solutions/video-obj-analysis">樣本資料集</a>。</li>
<li>上傳要用於分析的視訊。</li>
<li>按一下播放按鈕，即可檢視上傳的視訊，並即時顯示物件偵測結果。</li>
</ol>
<p>👉視訊：<a href="https://www.youtube.com/watch?v=m9rosLClByc">[示範] 由 Milvus 提供的視訊物件偵測系統</a></p>
<h4 id="How-it-works" class="common-anchor-header">如何運作</h4><p>使用 ResNet50 將物件影像轉換成 2048 維特徵向量。然後使用 Milvus 來管理和查詢資料集。</p>
<p><strong>資料處理：</strong></p>
<ol>
<li>ResNet50 將物件影像轉換成 2048 維特徵向量。然後將向量匯入 Milvus 並分配個別 ID。</li>
<li>音訊特徵向量 ID 及其對應的影像檔案路徑會儲存在 MySQL 中。</li>
</ol>
<p><strong>偵測視訊中的物件：</strong></p>
<ol>
<li>OpenCV 用於修剪視訊。</li>
<li>YOLOv3 用於偵測視訊中的物件。</li>
<li>ResNet50 將偵測到的物件影像轉換成 2048 維特徵向量。</li>
</ol>
<p>Milvus 在上傳的資料集中搜尋最相似的物件影像。從 MySQL 擷取對應的物件名稱和影像檔案路徑。</p>
