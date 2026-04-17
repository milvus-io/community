---
id: Milvus-Is-an-Open-Source-Scalable-Vector-Database.md
title: Milvus 是開放源碼的可擴充向量資料庫
author: milvus
date: 2021-01-13T07:46:40.506Z
desc: 使用 Milvus 建立強大的機器學習應用程式並管理大規模向量資料。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database'
---
<custom-h1>Milvus 是開放源碼的可擴充向量資料庫</custom-h1><p>使用容易定義的條件來搜尋資料，例如依據演員、導演、類型或發行日期來查詢電影資料庫是很簡單的。關聯式資料庫可以使用 SQL 等查詢語言進行這些類型的基本搜尋。但當搜尋涉及複雜的物件和更抽象的查詢時，例如使用自然語言搜尋視訊串流資料庫或視訊片段時，簡單的相似度指標 (例如匹配標題或描述中的字詞) 就不再足夠。</p>
<p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">人工智能 (AI)</a>讓電腦理解語言語義的能力大幅提升，也能幫助人們理解大量難以分析的非結構化資料集（例如音訊、視訊、文件和社交媒體資料）。AI 使 Netflix 創建複雜的內容推薦引擎、Google 使用者透過圖像搜尋網路、以及製藥公司發現新藥成為可能。</p>
<h3 id="The-challenge-of-searching-large-unstructured-datasets" class="common-anchor-header">搜尋大型非結構化資料集的挑戰</h3><p>這些技術壯舉是透過使用人工智能演算法將密集的非結構化資料轉換為向量來完成的，向量是一種容易被機器讀取的數值資料格式。接下來，額外的演算法會用來計算指定搜尋的向量之間的相似度。非結構化資料集的規模龐大，對於大多數的機器學習應用程式來說，完整搜尋資料集太過耗時。為了克服這個問題，近似近鄰 (ANN) 演算法被用來將相似向量聚類在一起，然後只搜尋資料集中最有可能包含與目標搜尋向量相似向量的部分。</p>
<p>這可<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">大幅加快</a>相似性<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">搜尋的速度</a>（雖然精確度稍差），也是建立有用的人工智慧工具的關鍵。由於擁有大量的公共資源，建立機器學習應用程式變得前所未有的容易和便宜。然而，人工智能驅動的向量類似性搜尋通常需要交錯使用不同的工具，而這些工具的數量和複雜度則視特定專案需求而定。Milvus 是一個開放原始碼的 AI 搜尋引擎，旨在透過在統一平台下提供強大的功能，簡化建立機器學習應用程式的流程。</p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus 是什麼？</h3><p><a href="https://milvus.io/">Milvus</a>是一個開放源碼的資料管理平台，專為大規模向量資料和簡化機器學習作業 (MLOps) 而打造。Milvus 由 Facebook AI Similarity Search (Faiss)、Non-Metric Space Library (NMSLIB) 和 Annoy 提供技術支援，將各種強大的工具整合在一起，同時擴展其獨立功能。該系統專為儲存、處理及分析大型向量資料集而打造，可用於建立跨越電腦視覺、推薦引擎等的 AI 應用程式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Is_an_Open_Source_Scalable_AI_Search_Engine_1_997255eb27.jpg" alt="Blog_Milvus Is an Open-Source Scalable AI Search Engine_1.jpg" class="doc-image" id="blog_milvus-is-an-open-source-scalable-ai-search-engine_1.jpg" />
   </span> <span class="img-wrapper"> <span>部落格_Milvus 是一個可擴充的開放原始碼 AI 搜尋引擎_1.jpg</span> </span></p>
<h3 id="Milvus-was-made-to-power-vector-similarity-search" class="common-anchor-header">Milvus 專為向量類似性搜尋而設計</h3><p>Milvus 的設計極具彈性，讓開發人員可針對其特定的使用情況優化平台。支援純 CPU/GPU 與異質運算，可加速資料處理，並針對任何情境最佳化資源需求。資料以分散式架構儲存於 Milvus，因此可輕鬆擴充資料量。Milvus 支援多種 AI 模型、程式語言 (如 C++、Java 及 Python) 及處理器類型 (如 x86、ARM、GPU、TPU 及 FPGA)，提供與各種軟硬體的高度相容性。</p>
<p>如需更多關於 Milvus 的資訊，請參閱下列資源：</p>
<ul>
<li>探索 Milvus 的<a href="https://milvus.io/">技術文件</a>，了解更多有關平台的內部運作。</li>
<li>使用 Milvus<a href="https://tutorials.milvus.io/">教學</a>，學習如何啟動 Milvus、建立應用程式等。</li>
<li>為專案做出貢獻，並參與<a href="https://github.com/milvus-io">GitHub</a> 上 Milvus 的開放原始碼社群。</li>
</ul>
