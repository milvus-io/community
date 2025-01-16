---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: 使用 Milvus 向量資料庫進行可擴展且快速的相似性搜尋
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: 以毫秒為單位儲存、索引、管理及搜尋數以萬億計的文件向量！
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇文章中，我們將介紹一些與向量資料庫和大規模相似性搜尋相關的有趣方面。在現今快速發展的世界中，我們看到了新的技術、新的業務、新的資料來源，因此我們需要不斷使用新的方式來儲存、管理和利用這些資料以獲得洞察力。數十年來，結構化的表格資料一直儲存在關聯式資料庫中，而商業智慧 (Business Intelligence) 的興盛則在於分析這些資料並從中擷取洞察力。然而，考慮到目前的資料狀況，「超過 80-90% 的資料是文字、視訊、音訊、Web 伺服器日誌、社交媒體等非結構化資訊」。機構一直在利用機器學習和深度學習的力量來嘗試從這些資料中擷取洞察力，因為傳統的基於查詢的方法可能並不足夠，甚至無法實現。從這些資料中萃取有價值的洞察力有著尚未開發的巨大潛力，而我們才剛剛起步！</p>
<blockquote>
<p>「由於世界上大多數的資料都是非結構化的，因此分析這些資料並對其採取行動的能力帶來了巨大的商機」。- Mikey Shulman，Kensho ML 主管</p>
</blockquote>
<p>非結構化資料，顧名思義，沒有隱含的結構，就像由行和列組成的表格（因此稱為表格或結構化資料）。與結構化資料不同的是，沒有簡單的方法將非結構化資料的內容儲存在關聯性資料庫中。利用非結構化資料進行洞察有三大挑戰：</p>
<ul>
<li><strong>儲存：</strong>一般的關聯式資料庫適合儲存結構化資料。雖然您可以使用 NoSQL 資料庫來儲存這些資料，但若要處理這些資料以擷取正確的表達方式，從而為大規模的 AI 應用程式提供動力，則會增加額外的開銷。</li>
<li><strong>表達方式：</strong>電腦無法像我們一樣理解文字或影像。它們只能理解數字，因此我們需要將未建構的資料轉換成一些有用的數字表示，通常是向量或嵌入。</li>
<li><strong>查詢：</strong>您無法像結構化資料的 SQL 一樣，直接根據確定的條件語句來查詢非結構化資料。試想一個簡單的例子：您嘗試在一張您最喜歡的鞋子照片中搜尋相似的鞋子！您無法使用原始像素值進行搜尋，也無法表示鞋子的形狀、尺寸、款式、顏色等結構性特徵。現在試想一下，要對數百萬雙鞋子進行搜尋！</li>
</ul>
<p>因此，為了讓電腦能夠理解、處理和表示非結構化資料，我們通常會將它們轉換成密集向量，也就是常說的嵌入。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>圖一</span> </span></p>
<p>目前有多種方法，特別是利用深度學習的方法，包括用於影像等視覺資料的卷繞神經網路 (CNN)，以及用於文字資料的 Transformers，這些方法可用於將此類非結構化資料轉換為嵌入式資料。<a href="https://zilliz.com/">Zilliz</a>有<a href="https://zilliz.com/learn/embedding-generation">一篇很好的文章，涵蓋了不同的嵌入技術</a>！</p>
<p>僅儲存這些嵌入向量是不夠的。我們還需要能夠查詢並找出相似的向量。為什麼這麼問？大多數的實際應用程式都是以向量相似性搜尋為基礎的 AI 解決方案。這包括 Google 的視覺 (影像) 搜尋、Netflix 或 Amazon 的推薦系統、Google 的文字搜尋引擎、多模式搜尋、資料重複刪除等等！</p>
<p>以大規模儲存、管理和查詢向量並不是一件簡單的工作。您需要專門的工具，而向量資料庫是最有效的工具！在本文中，我們將介紹以下幾個方面：</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">向量與向量相似性搜尋</a></li>
<li><a href="#What-is-a-Vector-Database">什麼是向量資料庫？</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - 世界上最先進的向量資料庫</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">使用 Milvus 執行視覺影像搜尋 - 使用案例藍圖</a></li>
</ul>
<p>讓我們開始吧</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">矢量和矢量相似性搜索<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>之前，我們已經確認將圖像和文字等非結構化資料表示為向量的必要性，因為電腦只能理解數字。我們通常會利用人工智能模型，更明確地說是深度學習模型，將非結構化資料轉換為機器可以讀取的數值向量。一般而言，這些向量基本上是浮點數的清單，合起來代表底層項目 (影像、文字等)。</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">瞭解向量</h3><p>考慮到自然語言處理 (NLP) 的領域，我們有許多單字嵌入模型，例如<a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec、GloVe 和 FastText</a>，這些模型可以幫助我們將單字表示成數字向量。隨著時間的<a href="https://arxiv.org/abs/1706.03762">推移</a>，我們看到了<a href="https://arxiv.org/abs/1706.03762">Transformer</a>模型的崛起，例如<a href="https://jalammar.github.io/illustrated-bert/">BERT</a>，它可以用來學習上下文嵌入向量以及整個句子和段落的更好表示。</p>
<p>同樣地，在電腦視覺領域中，我們也有<a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">卷積神經網路 (CNN)</a>等模型，可以協助從影像和視訊等視覺資料中學習表達。隨著 Transformers 的興起，我們也有了<a href="https://arxiv.org/abs/2010.11929">視覺 Transformers</a>，它可以比一般的 CNN 有更好的表現。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>圖二</span> </span></p>
<p>這種向量的優勢在於，我們可以利用它們來解決實際世界的問題，例如視覺搜尋，您通常上傳一張照片，然後獲得包括視覺相似圖片的搜尋結果。Google 將此作為其搜尋引擎中非常受歡迎的功能，如下圖所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>圖三</span> </span></p>
<p>這類應用程式的動力來自於資料向量和向量相似性搜尋。如果您考慮 X-Y 直角坐標空間中的兩個點。兩點之間的距離可以用簡單的歐氏距離（euclidean distance）來計算，如下式所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>圖四</span> </span></p>
<p>現在假設每個資料點都是具有 D 維度的向量，您仍然可以使用歐氏距離或其他距離指標 (例如 hamming 或余弦距離) 來找出兩個資料點彼此之間的距離。這有助於建立一個接近性或相似性的概念，而這個概念可以用來做為一個可量化的指標，使用向量找出給定參考項目的相似項目。</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">瞭解向量類似性搜尋</h3><p>向量類似性搜尋通常稱為最近鄰 (NN) 搜尋，基本上是計算參考項目（我們要尋找類似項目）與現有項目集合（通常在資料庫中）之間的成對類似性（或距離），並傳回前 'k「 個最近鄰，也就是前 」k' 個最相似的項目。計算相似性的關鍵元件是相似性公制，可以是歐氏距離、內積、余弦距離、漢明距離等。距離越小，向量就越相似。</p>
<p>精確近鄰 (NN) 搜尋的挑戰在於可擴展性。您需要每次計算 N 個距離 (假設有 N 個現有項目)，才能得到相似的項目。這可能會變得超慢，尤其是如果您沒有在某處儲存資料並編入索引 (例如向量資料庫！)。為了加快計算速度，我們通常會利用近似近鄰搜尋 (approximate nearest neighbor search)，也就是常說的 ANN 搜尋，最後將向量儲存到索引中。索引有助於以智慧的方式儲存這些向量，以便快速檢索參考查詢項目的「近似」近鄰。典型的 ANN 索引方法包括</p>
<ul>
<li><strong>向量變換：</strong>這包括對向量增加額外的變換，例如降維（例如 PCA \ t-SNE）、旋轉等。</li>
<li><strong>向量編碼：</strong>這包括應用基於資料結構的技術，例如區域敏感切分 (LSH)、量化、樹狀等，有助於更快速地檢索相似項目。</li>
<li><strong>非窮盡搜尋方法：</strong>這主要是用來防止窮盡搜尋，包括鄰近圖表、倒轉索引等方法。</li>
</ul>
<p>要建立任何向量類似性搜尋應用程式，您需要一個資料庫，以協助您進行有效率的儲存、索引和大規模查詢（搜尋）。進入向量資料庫！</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">什麼是向量資料庫？<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們現在瞭解向量如何用來表示非結構化資料，以及向量搜尋如何運作，我們就可以將這兩個概念結合起來，建立向量資料庫。</p>
<p>向量資料庫是可擴充的資料平台，用來儲存、索引和查詢使用深度學習模型從非結構化資料（影像、文字等）產生的嵌入向量。</p>
<p>處理大量向量進行相似性搜尋 (即使有索引) 的成本可能超高。儘管如此，除了指定您所選擇的索引演算法和相似度指標之外，最好、最先進的向量資料庫應該可以讓您在數百萬或數十億個目標向量中進行插入、索引和搜尋。</p>
<p>矢量資料庫主要應滿足以下關鍵需求，以考量在企業中使用的強大資料庫管理系統：</p>
<ol>
<li><strong>可擴充：</strong>向量資料庫應該能夠為數十億個嵌入向量建立索引並執行近似近鄰搜尋。</li>
<li><strong>可靠：</strong>矢量資料庫應該能夠處理內部故障，而不會造成資料丟失，並將操作影響降至最低，即具有容錯性。</li>
<li><strong>快速：</strong>查詢和寫入速度對向量資料庫非常重要。對於 Snapchat 和 Instagram 等平台而言，每秒可上傳數百張或上千張新圖片，因此速度成為極為重要的因素。</li>
</ol>
<p>向量資料庫不只是儲存資料向量。它們還要負責使用有效率的資料結構來索引這些向量，以便快速擷取，並支援 CRUD (建立、讀取、更新及刪除) 作業。向量資料庫最好也能支援屬性篩選，也就是基於元資料欄位（通常是標量欄位）進行篩選。一個簡單的例子是根據特定品牌的影像向量來擷取相似的鞋子。在此，品牌就是篩選所依據的屬性。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>圖五</span> </span></p>
<p>上圖展示了我們即將討論的向量資料庫<a href="https://milvus.io/">Milvus</a> 如何使用屬性篩選。<a href="https://milvus.io/">Milvus</a>將位元掩碼 (bitmask) 的概念引進篩選機制，在滿足特定屬性篩選條件的基礎上，保留位元掩碼為 1 的類似向量。更多相關詳情請參閱<a href="https://zilliz.com/learn/attribute-filtering">這裡</a>。</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - 全球最先進的向量資料庫<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼的向量資料庫管理平台，專為大規模向量資料和簡化機器學習作業 (MLOps) 而打造。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>圖六</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a> 是建立世界上最先進向量資料庫<a href="https://milvus.io/">Milvus</a> 背後的組織，以加速下一代資料結構的發展。Milvus 目前是<a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>的畢業專案，專注於管理海量非結構化資料集的儲存與搜尋。該平台的效率和可靠性簡化了大規模部署 AI 模型和 MLOps 的過程。Milvus 的應用範圍廣泛，涵蓋藥物發現、電腦視覺、推薦系統、聊天機器人等。</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Milvus 的主要功能</h3><p>Milvus 擁有許多實用的特色與功能，例如</p>
<ul>
<li><strong>在萬億向量資料集上的驚人搜尋速度：</strong>在萬億向量資料集上，向量搜尋與擷取的平均延遲時間以毫秒為單位。</li>
<li><strong>簡化非結構化資料管理：</strong>Milvus 擁有專為資料科學工作流程設計的豐富 API。</li>
<li><strong>可靠、永續的向量資料庫：</strong>Milvus 內建的複製與故障移轉/故障回復功能，可確保資料與應用程式永遠維持業務連續性。</li>
<li><strong>高度可擴充與彈性：</strong>元件層級的擴充能力可依需求擴充或縮小。</li>
<li><strong>混合搜尋：</strong>除了向量之外，Milvus 還支援 Boolean、String、整數、浮點數等資料類型。Milvus 將標量篩選與強大的向量相似性搜尋結合在一起 (如前面的鞋子相似性範例所示)。</li>
<li><strong>統一的 Lambda 架構：</strong>Milvus 結合了資料儲存的串流處理與批次處理，以平衡及時性與效率。</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">時間旅行</a>：</strong>Milvus 會為所有資料插入和刪除作業維持時間線。它允許使用者在搜尋中指定時間戳記，以擷取指定時間點的資料檢視。</li>
<li><strong>社群支援及業界認可：</strong>Milvus 擁有超過 1,000 家企業用戶，在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上有 10.5K+ 顆星星，並且是一個活躍的開放原始碼社群，因此當您使用 Milvus 時，您並不孤單。作為<a href="https://lfaidata.foundation/">LF AI &amp; Data 基金會下</a>的畢業專案，Milvus 獲得了機構的支持。</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">向量資料管理與搜尋的現有方法</h3><p>以向量相似性搜尋為動力建立 AI 系統的常見方法，是將近似近鄰搜尋 (Approximate Nearest Neighbor Search, ANNS) 等演算法與開放原始碼程式庫搭配使用，例如</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI 類似性搜尋 (FAISS)：</a></strong>此架構可對密集向量進行有效率的相似性搜尋與聚類。它所包含的演算法可在任何大小的向量集中進行搜尋，甚至可搜尋到可能無法放入 RAM 的向量。它支援倒轉多重索引和乘積量化等索引功能。</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify 的 Annoy (Approximate Nearest Neighbors Oh Yeah)：</a></strong>此架構使用<a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">隨機投影</a>並建立一棵樹，以針對密集向量的規模啟用 ANNS。</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">Google 的 ScaNN (Scalable Nearest Neighbors)：</a></strong>此架構可在規模上執行有效率的向量相似性搜尋。包含實作，其中包括最大內積搜尋 (MIPS) 的搜尋空間剪枝與量化。</li>
</ul>
<p>雖然這些函式庫各有其用處，但由於一些限制，這些演算法與函式庫的組合並不等同於完整的向量資料管理系統，例如 Milvus。現在我們將討論其中一些限制。</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">現有方法的限制</h3><p>上一節所討論的現有向量資料管理方法有以下的限制：</p>
<ol>
<li><strong>彈性：</strong>現有系統通常會將所有資料儲存在主記憶體中，因此無法輕鬆地在多台機器上以分散式模式執行，也不適合處理大量資料集。</li>
<li><strong>動態資料處理：</strong>一旦將資料輸入現有系統，通常會假設資料是靜態的，這使得動態資料的處理變得複雜，也使得近乎即時的搜尋變得不可能。</li>
<li><strong>進階查詢處理：</strong>大多數工具都不支援進階查詢處理 (例如：屬性過濾、混合搜尋和多向量查詢)，而這對於建立支援進階過濾的真實世界相似性搜尋引擎是非常重要的。</li>
<li><strong>異質運算最佳化：</strong>很少有平台能同時在 CPU 和 GPU（FAISS 除外）上為異質系統架構提供最佳化，導致效率上的損失。</li>
</ol>
<p><a href="https://milvus.io/">Milvus 嘗試</a>克服所有這些限制，我們將在下一節詳細討論。</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Milvus 的優勢 - 瞭解 Knowhere</h3><p><a href="https://milvus.io/">Milvus 嘗試</a>以下列方式來處理並成功解決建立在低效向量資料管理和相似性搜尋演算法之上的現有系統的限制：</p>
<ul>
<li>提供多種應用程式介面的支援（包括 Python、Java、Go、C++ 的 SDK 和 RESTful API），增強了靈活性。</li>
<li>它支援多種向量索引類型 (例如：基於量化的索引和基於圖的索引)，以及進階的查詢處理</li>
<li>Milvus 使用日誌結構化的合併樹 (LSM tree) 來處理動態向量資料，保持資料插入和刪除的效率，並能即時進行搜尋。</li>
<li>Milvus 還針對現代 CPU 和 GPU 上的異質運算架構提供最佳化，讓開發人員可針對特定場景、資料集和應用環境調整系統。</li>
</ul>
<p>Knowhere 是 Milvus 的向量執行引擎，它是一個操作介面，用來存取系統上層的服務，以及系統下層的向量相似性搜尋程式庫，例如 Faiss、Hnswlib、Annoy。此外，Knowhere 也負責異質運算。Knowhere 控制在哪個硬體 (例如 CPU 或 GPU) 上執行索引建立和搜尋請求。這就是 Knowhere 名字的由來 - 知道在哪裡執行作業。未來的版本將支援更多的硬體類型，包括 DPU 和 TPU。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>圖七</span> </span></p>
<p>Milvus 中的計算主要涉及向量和標量運算。Knowhere 只處理 Milvus 中向量的運算。上圖說明了 Milvus 中的 Knowhere 架構。最底層是系統硬體。第三方索引庫在硬體之上。然後，Knowhere 透過 CGO 與上面的索引節點和查詢節點互動。Knowhere 不僅進一步擴展了 Faiss 的功能，還優化了性能，並擁有多項優勢，包括支援 BitsetView、支援更多類似性指標、支援 AVX512 指令集、自動 SIMD 指令選擇以及其他性能優化。詳細資訊請見<a href="https://milvus.io/blog/deep-dive-8-knowhere.md">此處</a>。</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 架構</h3><p>下圖展示 Milvus 平台的整體架構。Milvus 將資料流與控制流分開，並分為四層，在可擴充性及災難復原方面獨立運作。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>圖八</span> </span></p>
<ul>
<li><strong>存取層：</strong>存取層由一組無狀態代理伺服器組成，是系統的前端層，也是使用者的端點。</li>
<li><strong>協調器服務：</strong>協調器服務負責叢集拓樸節點管理、負載平衡、時戳生成、資料宣告和資料管理。</li>
<li><strong>工作節點：</strong>工作節點（或稱執行節點）執行由協調器服務發出的指令，以及由代理啟動的資料處理語言 (DML) 指令。Milvus 中的工作節點類似於<a href="https://hadoop.apache.org/">Hadoop</a> 中的資料節點或 HBase 中的區域伺服器。</li>
<li><strong>儲存：</strong>這是 Milvus 的基石，負責資料的持久性。存儲層<strong>由元存儲</strong>、<strong>日誌代理</strong>和<strong>物件存儲</strong>組成。</li>
</ul>
<p>請<a href="https://milvus.io/docs/v2.0.x/four_layers.md">在這裡</a>查看更多關於架構的詳細資訊！</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">使用 Milvus 執行視覺影像搜尋 - 使用案例藍圖<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 等開放原始碼向量資料庫可讓任何企業以最少的步驟建立自己的視覺影像搜尋系統。開發人員可以使用預先訓練好的 AI 模型，將自己的圖像資料集轉換成向量，然後再利用 Milvus 來透過圖像搜尋類似產品。讓我們看看以下如何設計和建立這樣一個系統的藍圖。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>圖九</span> </span></p>
<p>在這個工作流程中，我們可以使用像<a href="https://github.com/towhee-io/towhee">towhee</a>之類的開放原始碼架構，利用像 ResNet-50 之類的預先訓練模型，從圖片中萃取向量，然後輕鬆地在 Milvus 中儲存這些向量並建立索引，同時在 MySQL 資料庫中儲存圖片 ID 到實際圖片的映射。一旦資料被編入索引，我們就可以輕鬆地上傳任何新的圖片，並使用 Milvus 執行規模化的圖片搜尋。下圖顯示了一個可視化圖片搜尋範例。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>圖十</span> </span></p>
<p>感謝 Milvus，您可以查看 GitHub 上已開源的詳細<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">教學</a>。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在這篇文章中涵蓋了相當多的內容。我們從表示未經建構的資料的挑戰開始，利用向量和向量相似性搜尋與 Milvus（一個開放源碼的向量資料庫）進行大規模搜尋。我們討論了 Milvus 結構的細節、驅動它的關鍵元件，以及如何使用 Milvus 解決真實世界問題的藍圖，也就是視覺影像搜尋。請嘗試使用<a href="https://milvus.io/">Milvus</a> 來解決您自己的實際問題！</p>
<p>喜歡這篇文章嗎？歡迎<a href="https://www.linkedin.com/in/dipanzan/">與我聯繫</a>，討論更多內容或提供意見！</p>
<h2 id="About-the-author" class="common-anchor-header">關於作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar 是資料科學領導人、Google 開發人員專家 - 機器學習、作家、顧問和 AI 顧問。連線：http://bit.ly/djs_linkedin</p>
