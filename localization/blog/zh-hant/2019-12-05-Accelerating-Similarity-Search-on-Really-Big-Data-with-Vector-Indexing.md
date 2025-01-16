---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: 利用向量索引加速大型資料的相似性搜尋
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: 如果沒有向量索引，許多現代人工智能應用程式的速度會慢得無法想像。瞭解如何為您的下一個機器學習應用程式選擇正確的索引。
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>利用向量索引加速大型資料的相似性搜尋</custom-h1><p>從電腦視覺到新藥發現，向量相似性搜尋引擎為許多流行的人工智慧 (AI) 應用程式提供了強大的動力。要有效率地查詢相似性搜尋引擎所依賴的百萬、十億、甚至萬億向量資料集，其中一個重要的組成部分就是索引，這是一個組織資料的過程，可大幅加快大資料搜尋的速度。本文將介紹索引在提高向量相似性搜尋效率中所扮演的角色、不同的向量倒轉檔案 (IVF) 索引類型，以及在不同情況下使用哪種索引的建議。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">使用向量索引加速大型資料的相似性搜尋</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">向量索引如何加速相似性搜索和機器學習？</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">有哪些不同類型的 IVF 索引，以及它們最適合哪些情境？</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">平面：適合搜尋相對較小（百萬量級）的資料集，需要 100% 的召回率。</a><ul>
<li><a href="#flat-performance-test-results">FLAT 效能測試結果：</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Milvus 中 FLAT 索引的查詢時間測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways">主要啟示：</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT：以準確性為代價來提升速度 (反之亦然)。</a><ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLAT 效能測試結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Milvus 中 IVF_FLAT 索引的查詢時間測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">關鍵要點：</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Milvus 中 IVF_FLAT 索引的召回率測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">主要啟示：</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8：比 IVF_FLAT 更快，對資源的需求更少，但準確度也較低。</a><ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8 效能測試結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Milvus 中 IVF_SQ8 索引的查詢時間測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">主要啟示：</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>在 Milvus 中 IVF_SQ8 索引的召回率測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">主要啟示：</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: 新的混合 GPU/CPU 方法，速度比 IVF_SQ8 更快。</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8H 效能測試結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>在 Milvus 中 IVF_SQ8H 索引的查詢時間測試結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">主要心得：</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">進一步了解 Milvus 這個大規模向量資料管理平台。</a></li>
<li><a href="#methodology">方法論</a><ul>
<li><a href="#performance-testing-environment">效能測試環境</a></li>
<li><a href="#relevant-technical-concepts">相關技術概念</a></li>
<li><a href="#resources">資源</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">向量索引如何加速相似性搜尋與機器學習？</h3><p>相似性搜尋引擎的工作方式是將輸入內容與資料庫進行比較，找出與輸入內容最相似的物件。索引是有效組織資料的過程，它透過大幅加速大型資料集上耗時的查詢，在使相似性搜尋有用方面扮演重要角色。在對大量向量資料集建立索引之後，可以將查詢路由到最有可能包含與輸入查詢相似的向量的叢集或資料子集。實際上，這意味著要犧牲某種程度的精確度，以加快真正大型向量資料的查詢速度。</p>
<p>我們可以拿字典來做類比，字典中的單字是依字母順序排序的。在查詢單字時，可以快速導覽到只包含具有相同首字的單字的區段 - 大幅加快搜尋輸入單字定義的速度。</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">IVF 索引有哪些不同類型，它們最適用於哪些情況？</h3><p>有許多專為高維向量相似性搜尋設計的索引，每種索引都會在效能、準確性和儲存需求上有所取捨。本文將介紹幾種常見的 IVF 索引類型、其優點與缺點，以及每種索引類型的效能測試結果。效能測試在開放原始碼向量資料管理平台<a href="https://milvus.io/">Milvus</a> 中量化每種索引類型的查詢時間和召回率。有關測試環境的其他資訊，請參閱本文底部的方法論部分。</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">扁平：適合需要 100% 回復率時，搜尋相對較小（百萬量級）的資料集。</h3><p>對於需要完美精確度且依賴相對較小（百萬量級）資料集的向量相似性搜尋應用，FLAT 索引是很好的選擇。FLAT 不會壓縮向量，而且是唯一能保證精確搜尋結果的索引。FLAT 的結果也可以用來比較其他召回率低於 100% 的索引所產生的結果。</p>
<p>FLAT 之所以精確，是因為它採用了窮盡方式進行搜尋，也就是說，對於每次查詢，目標輸入都會與資料集中的每個向量進行比較。這使得 FLAT 成為我們清單上最慢的索引，而且不適合查詢大量向量資料。在 Milvus 中，FLAT 索引沒有任何參數，使用它不需要資料訓練或額外的儲存空間。</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">FLAT 性能測試結果：</h4><p>在 Milvus 中使用由 200 萬個 128 維向量組成的資料集進行 FLAT 查詢時間效能測試。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大型資料的相似性搜尋_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>隨著 nq（查詢的目標向量數量）的增加，查詢時間也會增加。</li>
<li>使用 Milvus 中的 FLAT 索引，我們可以看到一旦 nq 超過 200，查詢時間就會急劇增加。</li>
<li>一般而言，在 GPU 上執行 Milvus 時，FLAT 索引比在 CPU 上執行更快且更一致。然而，當 nq 低於 20 時，CPU 上的 FLAT 查詢速度較快。</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT：以準確性為代價來提升速度 (反之亦然)。</h3><p>加速相似性搜尋過程並犧牲準確性的常用方法是進行近似近鄰 (ANN) 搜尋。ANN 演算法透過將類似向量聚類在一起來降低儲存需求和計算負載，進而加快向量搜尋的速度。IVF_FLAT 是最基本的倒置檔案索引類型，並依賴一種 ANN 搜尋方式。</p>
<p>IVF_FLAT 將向量資料分為多個叢集單位 (nlist)，然後比較目標輸入向量與每個叢集中心的距離。根據系統設定查詢的叢集數量 (nprobe)，類似性搜尋結果只會根據目標輸入與最類似叢集中的向量之間的比較來傳回 - 大幅縮短查詢時間。</p>
<p>透過調整 nprobe，可以在特定的情況下找到精確度與速度之間的理想平衡。我們的 IVF_FLAT 效能測試結果顯示，當目標輸入向量的數量 (nq) 和要搜尋的叢集數量 (nprobe) 增加時，查詢時間也會大幅增加。IVF_FLAT 沒有壓縮向量資料，但是索引檔案包含元資料，與原始的非索引向量資料集相比，會稍微增加儲存需求。</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">IVF_FLAT 效能測試結果：</h4><p>IVF_FLAT 的查詢時間效能測試是在 Milvus 中使用公開的 1B SIFT 資料集進行的，該資料集包含 10 億個 128 維向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>博客_利用矢量索引加速真正大數據上的相似性搜索_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>在 CPU 上執行時，Milvus 中 IVF_FLAT 索引的查詢時間會隨著 nprobe 和 nq 的增加而增加。這表示查詢包含的輸入向量越多，或查詢搜尋的叢集越多，查詢時間就越長。</li>
<li>在 GPU 上，索引對 nq 和 nprobe 的變化所顯示的時間變異較小。這是因為索引資料較大，從 CPU 記憶體複製資料到 GPU 記憶體佔了總查詢時間的大部分。</li>
<li>在所有情況下，除了 nq = 1,000 和 nprobe = 32 時，IVF_FLAT 索引在 CPU 上執行時的效率都較高。</li>
</ul>
<p>IVF_FLAT 的召回性能測試是在 Milvus 中進行，同時使用包含 100 萬個 128 維向量的公開 1M SIFT 資料集和包含 100 多萬個 200 維向量的 glove-200-angular 資料集來建立索引 (nlist = 16,384)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大數據上的相似性搜尋_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>IVF_FLAT 索引可以優化精確度，當 nprobe = 256 時，在 1M SIFT 資料集上達到超過 0.99 的召回率。</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8：與 IVF_FLAT 相比，速度更快、資源消耗更少，但準確度也較低。</h3><p>IVF_FLAT 不會執行任何壓縮，因此它產生的索引檔案大小與原始的非索引向量資料大致相同。例如，如果原始的 1B SIFT 資料集是 476 GB，其 IVF_FLAT 索引檔案會稍微大一些 (~470 GB)。將所有索引檔案載入記憶體將會消耗 470 GB 的儲存空間。</p>
<p>當磁碟、CPU 或 GPU 記憶體資源有限時，IVF_SQ8 是比 IVF_FLAT 更好的選擇。此索引類型可透過執行標量量化，將每個 FLOAT (4 位元組) 轉換為 UINT8 (1 位元組)。這樣可以減少 70-75% 的磁碟、CPU 和 GPU 記憶體消耗。對於 1B SIFT 資料集，IVF_SQ8 索引檔案只需要 140 GB 的儲存空間。</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8 效能測試結果：</h4><p>IVF_SQ8 的查詢時間測試在 Milvus 中進行，使用包含 10 億個 128 維向量的公開 1B SIFT 資料集來建立索引。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大數據上的相似性搜尋_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>透過減少索引檔案大小，IVF_SQ8 的效能比 IVF_FLAT 有明顯的提升。IVF_SQ8 遵循與 IVF_FLAT 相似的效能曲線，查詢時間隨著 nq 和 nprobe 的增加而增加。</li>
<li>與 IVF_FLAT 相似，IVF_SQ8 在 CPU 上運行以及 nq 和 nprobe 較小的時候性能更快。</li>
</ul>
<p>IVF_SQ8 的召回性能測試在 Milvus 中進行，使用包含 100 萬個 128 維向量的公開 1M SIFT 資料集，以及包含 100 多萬個 200 維向量的 glove-200-angular 資料集來建立索引 (nlist = 16,384)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大數據上的相似性搜尋_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>儘管壓縮了原始資料，IVF_SQ8 的查詢精確度並沒有顯著下降。在各種 nprobe 設定中，IVF_SQ8 的召回率最多比 IVF_FLAT 低 1%。</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H：新的混合 GPU/CPU 方法，速度比 IVF_SQ8 更快。</h3><p>IVF_SQ8H 是一種新的索引類型，與 IVF_SQ8 相比可提高查詢效能。當在 CPU 上執行的 IVF_SQ8 索引被查詢時，總查詢時間的大部分用於尋找最接近目標輸入向量的 nprobe 叢集。為了縮短查詢時間，IVF_SQ8 會將比索引檔案更小的粗量化器運算資料複製到 GPU 記憶體 - 大幅加速粗量化器運算。然後 gpu_search_threshold 決定由哪個裝置執行查詢。當 nq &gt;= gpu_search_threshold 時，GPU 執行查詢；否則，CPU 執行查詢。</p>
<p>IVF_SQ8H 是一種混合索引類型，需要 CPU 和 GPU 共同運作。它只能與啟用 GPU 的 Milvus 搭配使用。</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8H 效能測試結果：</h4><p>IVF_SQ8H 的查詢時間效能測試在 Milvus 中進行，使用包含 10 億個 128 維向量的公開 1B SIFT 資料集來建立索引。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大數據上的相似性搜尋_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主要啟示：</h4><ul>
<li>當 nq 小於或等於 1,000 時，IVF_SQ8H 的查詢時間幾乎是 IVFSQ8 的兩倍。</li>
<li>當 nq = 2000 時，IVFSQ8H 和 IVF_SQ8 的查詢時間相同。但是，如果 gpu_search_threshold 參數低於 2000，IVF_SQ8H 的表現會比 IVF_SQ8 優異。</li>
<li>IVF_SQ8H 的查詢召回率與 IVF_SQ8 相同，這意味著在不損失搜尋準確度的情況下，可縮短查詢時間。</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">進一步了解 Milvus，一個大規模的向量資料管理平台。</h3><p>Milvus 是一個向量資料管理平台，可為跨越人工智慧、深度學習、傳統向量計算等領域的相似性搜尋應用提供動力。有關 Milvus 的其他資訊，請參閱下列資源：</p>
<ul>
<li>Milvus 在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上以開源授權提供。</li>
<li>Milvus 支援其他索引類型，包括圖形和樹狀索引。如需支援索引類型的完整清單，請參閱 Milvus 中<a href="https://milvus.io/docs/v0.11.0/index.md">向量索引的說明文件</a>。</li>
<li>若要進一步瞭解推出 Milvus 的公司，請造訪<a href="https://zilliz.com/">Zilliz.com</a>。</li>
<li>與 Milvus 社群聊天，或在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上尋求問題協助。</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">方法論</h3><h4 id="Performance-testing-environment" class="common-anchor-header">效能測試環境</h4><p>本文提及的性能測試所使用的伺服器組態如下：</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz，24 核心</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB 記憶體</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">相關技術概念</h4><p>雖然不是理解本文的必要條件，但以下幾個技術概念有助於詮釋我們的索引效能測試結果：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>部落格_使用向量索引加速真正大型資料的相似性搜尋_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">資源</h4><p>本文使用了下列資料來源：</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Encyclopedia of database systems</a>"，Ling Liu 和 M. Tamer Özsu。</li>
</ul>
