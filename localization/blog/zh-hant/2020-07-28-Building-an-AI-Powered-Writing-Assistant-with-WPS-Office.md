---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: 為 WPS Office 打造人工智能寫作助理
author: milvus
date: 2020-07-28T03:35:40.105Z
desc: 了解金山如何利用開源相似性搜尋引擎 Milvus，為 WPS Office 的 AI 寫作助理建立推薦引擎。
cover: assets.zilliz.com/wps_thumbnail_6cb7876963.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
<custom-h1>為WPS Office打造人工智能寫作助手</custom-h1><p>WPS Office 是金山軟件開發的生產力工具，全球用戶超過 1.5 億。該公司的人工智能（AI）部門採用語意識別和文本聚類等語義匹配算法，從零開始打造了一款智能寫作助手。該工具同時以 Web 應用程式和<a href="https://walkthechat.com/wechat-mini-programs-simple-introduction/">微信小程式的</a>形式存在，只需輸入標題並選擇多達五個關鍵字，即可幫助用戶快速創建提綱、個別段落和整個文件。</p>
<p>寫作助手的推薦引擎使用 Milvus（一個開放源代碼的相似性搜尋引擎）為其核心向量處理模組提供動力。以下我們將探討 WPS Offices 智慧型寫作助理的建置過程，包括如何從非結構化資料中萃取特徵，以及 Milvus 在儲存資料和強化工具推薦引擎中所扮演的角色。</p>
<p>跳至：</p>
<ul>
<li><a href="#building-an-ai-powered-writing-assistant-for-wps-office">為 WPS Office 打造人工智能驅動的寫作助理</a><ul>
<li><a href="#making-sense-of-unstructured-textual-data">理順非結構化文字資料</a></li>
<li><a href="#using-the-tfidf-model-to-maximize-feature-extraction">使用 TFIDF 模型最大化特徵萃取</a></li>
<li><a href="#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model">使用雙向 LSTM-CNNs-CRF 深度學習模型萃取特徵</a></li>
<li><a href="#creating-sentence-embeddings-using-infersent">使用 Infersent 建立句子內嵌</a></li>
<li><a href="#storing-and-querying-vectors-with-milvus">使用 Milvus 儲存和查詢向量</a></li>
<li><a href="#ai-isnt-replacing-writers-its-helping-them-write">AI 不是取代作家，而是幫助他們寫作</a></li>
</ul></li>
</ul>
<h3 id="Making-sense-of-unstructured-textual-data" class="common-anchor-header">理解非結構化的文字資料</h3><p>與任何值得解決的現代問題一樣，建立 WPS 寫作助理也是從混亂的資料開始。數以千萬計的密集文字文件，準確一點來說，必須從中萃取有意義的特徵。為了瞭解這個問題的複雜性，請考慮來自不同新聞媒體的兩位記者如何報導相同的主題。</p>
<p>雖然兩位記者都會遵守規範句子結構的規則、原則和程序，但他們會選擇不同的字，創造長短不一的句子，並使用自己的文章結構來描述類似（或可能不同）的故事。與具有固定維數的結構化資料集不同，由於支配文字的語法非常容易變通，因此文字本質上缺乏結構。為了尋找意義，必須從非結構化的文件語料庫中萃取機器可讀的特徵。但首先，資料必須經過清理。</p>
<p>清理文字資料的方法有很多，本文將不會深入介紹。儘管如此，這是處理資料前的重要步驟，可包括移除標籤、移除重音字元、擴大縮寫、移除特殊字元、移除停止字等。有關預先處理和清理文字資料方法的詳細說明，請參閱<a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">此處</a>。</p>
<h3 id="Using-the-TFIDF-model-to-maximize-feature-extraction" class="common-anchor-header">使用 TFIDF 模型最大化特徵萃取</h3><p>為了開始理解非結構化的文字資料，我們將詞彙頻率-反向文件頻率 (TFIDF) 模型應用於 WPS 寫作助理所擷取的語料庫。此模型結合詞彙頻率和反向文件頻率這兩種指標，為文件中的每個詞彙賦予 TFIDF 值。詞彙頻率 (TF) 代表詞彙在文件中的原始數量除以文件中的詞彙總數，而反向文件頻率 (IDF) 是指語料庫中的文件數量除以詞彙出現的文件數量。</p>
<p>TF 和 IDF 的乘積提供了一個詞彙在文件中出現頻率乘以該詞彙在語料庫中獨特程度的量度。歸根結柢，TFIDF 值是衡量一個詞彙在一個文件集合中與文件的相關程度。詞彙會依 TFIDF 值排序，在使用深度學習從詞料庫萃取特徵時，可以降低低值詞彙 (即常見詞) 的權重。</p>
<h3 id="Extracting-features-with-the-bi-directional-LSTM-CNNs-CRF-deep-learning-model" class="common-anchor-header">使用雙向 LSTM-CNNs-CRF 深度學習模型擷取特徵</h3><p>使用雙向長短期記憶體 (BLSTM)、卷繞神經網路 (CNN) 和條件隨機場 (CRF) 的組合，可以從語料擷取單字和字元層級的表徵。用於建立 WPS Office 書寫助手的<a href="https://arxiv.org/pdf/1603.01354.pdf">BLSTM-CNNs-CRF 模型</a>的工作原理如下：</p>
<ol>
<li><strong>CNN：</strong>字元內嵌被用作 CNN 的輸入，然後擷取語義相關的字詞結構 (即前綴或後綴)，並將其編碼為字元層級的表示向量。</li>
<li><strong>BLSTM：</strong>字元層級向量與單字嵌入向量串接，然後輸入 BLSTM 網路。每個序列會向前和向後呈現兩個獨立的隱藏狀態，以擷取過去和未來的資訊。</li>
<li><strong>CRF：</strong>BLSTM 的輸出向量會送入 CRF 層，以共同解碼最佳標籤序列。</li>
</ol>
<p>神經網路現在能夠從非結構化文字中抽取命名實體並將其分類。此過程稱為<a href="https://en.wikipedia.org/wiki/Named-entity_recognition">命名實體識別 (NER)</a>，涉及到人名、機構、地理位置等類別的定位與分類。這些實體在分類和記憶資料時扮演重要的角色。從這裡可以從語料庫中萃取出關鍵句子、段落和摘要。</p>
<h3 id="Creating-sentence-embeddings-using-Infersent" class="common-anchor-header">使用 Infersent 建立句子內嵌</h3><p><a href="https://github.com/facebookresearch/InferSent">Infersent</a> 是 Facebook 設計的監督句子嵌入方法，可將完整句子嵌入向量空間，用來建立向量，並輸入 Milvus 資料庫。Infersent 是使用斯坦福自然語言推理 (SNLI) 語料庫進行訓練，其中包含 570k 對由人類撰寫和標示的句子。有關 Infersent 如何運作的其他資訊，請參閱<a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">此處</a>。</p>
<h3 id="Storing-and-querying-vectors-with-Milvus" class="common-anchor-header">使用 Milvus 儲存和查詢向量</h3><p><a href="https://www.milvus.io/">Milvus</a>是一個開放原始碼的相似性搜尋引擎，支援以兆位元組的規模新增、刪除、更新嵌入向量，以及近乎即時的搜尋。為了改善查詢效能，Milvus 允許為每個向量欄位指定索引類型。WPS Office 智慧型助理使用 IVF_FLAT 索引，這是最基本的反向檔案 (IVF) 索引類型，其中「flat」表示向量的儲存不經壓縮或量化。聚類是以 IndexFlat2 為基礎，使用精確搜尋 L2 距離。</p>
<p>雖然 IVF_FLAT 的查詢召回率為 100%，但由於沒有壓縮，因此查詢速度相對較慢。Milvus 的<a href="https://milvus.io/docs/manage-partitions.md">分割功能</a>用來根據預先定義的規則，將資料分割成多個部分的實體儲存空間，使查詢速度更快、更精準。當向量加入 Milvus 時，標籤會指定資料應該加入哪個分割區。向量資料的查詢使用標籤來指定查詢應該在哪個分割區執行。資料可在每個分割區內再細分為不同的區段，以進一步提升速度。</p>
<p>智慧寫作助理也使用 Kubernetes 集群，讓應用程式容器可以在多台機器和環境中執行，並使用 MySQL 進行元資料管理。</p>
<h3 id="AI-isn’t-replacing-writers-it’s-helping-them-write" class="common-anchor-header">AI 不是取代寫手，而是幫助他們寫作</h3><p>金山WPS Office的寫作助手依賴Milvus來管理和查詢超過200萬個文件的資料庫。該系統高度靈活，能夠在萬億規模的資料集上執行近乎實時的搜索。查詢平均只需 0.2 秒即可完成，這意味著只需使用標題或幾個關鍵字，幾乎就能立即生成整份文件。雖然人工智能無法取代專業作家，但現今的技術已經能夠以新奇有趣的方式強化寫作流程。未來仍是未知之數，但至少作家們可以期待更有效率，而且對某些人來說不那麼困難的 「提筆寫作 」方式。</p>
<p>本文使用了下列資料來源：</p>
<ul>
<li>"<a href="https://arxiv.org/pdf/1603.01354.pdf">End-to-end Sequence Labeling via Bi-directional LSTM-CNNs-CRF</a>," Xuezhe Ma and Eduard Hovy.</li>
<li><a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">「文本資料的傳統方法</a>」，Dipanjan (DJ) Sarkar。</li>
<li>「<a href="https://ieeexplore.ieee.org/document/8780663">基於 TF-IDF 關聯語意的文字特徵萃取</a>」，劉清、王晶、張德海、楊雲、王乃堯。</li>
<li><a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">「使用 Facebook 的 Infersent 理解句子嵌入」</a>，Rehan Ahmad。</li>
<li><a href="https://arxiv.org/pdf/1705.02364.pdf">"從自然語言推理資料監督學習通用句子表達</a>」，Alexis Conneau、Douwe Kiela、Holger Schwenk、LoÏc Barrault、Antoine Bordes.V1</li>
</ul>
<p>閱讀其他<a href="https://zilliz.com/user-stories">使用者故事</a>，了解更多關於使用 Milvus 製造物品的資訊。</p>
