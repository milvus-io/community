---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: 背景介紹
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: 如何建立深度學習驅動的推薦系統
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>使用 Milvus 和 PaddlePaddle 建立個人化推薦系統</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">背景介紹<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著網路技術的不斷發展和電子商務規模的不斷擴大，商品的數量和種類迅速增長，用戶需要花費大量的時間去尋找他們想要購買的商品。這就是資訊過載。為了解決這個問題，推薦系統應運而生。</p>
<p>推薦系統是資訊過濾系統的一個子集，可應用於電影、音樂、電子商務、Feed 流推薦等一系列領域。推薦系統通過分析和挖掘用戶行為，發現用戶的個性化需求和興趣，並推薦用戶可能感興趣的資訊或產品。與搜尋引擎不同，推薦系統不需要使用者精確描述自己的需求，而是以使用者的歷史行為為模型，主動提供符合使用者興趣與需求的資訊。</p>
<p>本文利用百度的深度學習平台 PaddlePaddle 建立模型，再結合向量相似性搜尋引擎 Milvus，建立一個個人化的推薦系統，可以快速且精準地提供使用者有興趣的資訊。</p>
<h2 id="Data-Preparation" class="common-anchor-header">資料準備<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>我們以 MovieLens 百萬資料集（ml-1m）[1] 為例。ml-1m 資料集包含 6,000 位使用者對 4,000 部電影的 1,000,000 篇評論，由 GroupLens 研究實驗室收集。原始資料包括電影的特徵資料、使用者特徵，以及使用者對電影的評價，您可以參考 ml-1m-README [2] 。</p>
<p>ml-1m 資料集包含 3 篇 .dat 文章：movies.dat、users.dat 和 ratings.dat。movies.dat 包含電影的特徵，請參閱下面的範例：</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>這表示電影 id 是 1，片名是《玩具總動員》，分為三個類別。這三個類別是動畫、兒童和喜劇。</p>
<p>users.dat 包含使用者的特徵，請參閱下面的範例：</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>這表示使用者 ID 是 1，女性，且年齡小於 18 歲。職業 ID 是 10。</p>
<p>ratings.dat 包含電影評分的特徵，請參閱下面的範例：</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>即使用者 1 評價電影 1193 為 5 分。</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">融合推薦模型<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>在電影個人化推薦系統中，我們使用了 PaddlePaddle 實作的 Fusion Recommendation Model [3]。這個模型是根據其產業實務所建立的。</p>
<p>首先，將使用者特徵和電影特徵作為神經網路的輸入，其中：</p>
<ul>
<li>使用者特徵包含四個屬性資訊：使用者 ID、性別、職業、年齡。</li>
<li>電影特徵包含三項屬性資訊：電影 ID、電影類型 ID 及電影名稱。</li>
</ul>
<p>對於使用者特徵，將使用者 ID 映射成維度大小為 256 的向量表示，進入全連結層，並對其他三個屬性進行類似的處理。然後，將四個屬性的特徵表示進行全連接，並分別加入。</p>
<p>對於電影特徵，電影 ID 的處理方式與使用者 ID 類似。電影類型 ID 直接以向量的形式輸入到全連結層，而電影名稱則使用文字卷積神經網路以固定長度的向量來表示。三種屬性的特徵表示再經由全連結分別加入。</p>
<p>得到使用者與電影的向量表示後，計算兩者的余弦相似度，作為個人化推薦系統的分數。最後，以相似度得分與使用者真實得分之差的平方作為迴歸模型的損失函數。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-user-film-personalized-recommender-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">系統概述<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>結合PaddlePaddle的融合推薦模型，將模型產生的電影特徵向量儲存於Milvus向量相似性搜尋引擎中，以使用者特徵作為目標向量進行搜尋。在 Milvus 中進行相似性搜尋，得到查詢結果，作為推薦給使用者的電影。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>Milvus 提供內乘積 (IP) 方法來計算向量距離。將資料規範化後，內積相似度與融合推薦模型中的余弦相似度結果一致。</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">個人推薦系統的應用<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 Milvus 建立個人化推薦系統有三個步驟，詳細操作方法請參考 Mivus Bootcamp [4]。</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">步驟一：模型訓練</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>執行此指令會在目錄中產生一個 model recommender_system.inference.model，可以將電影資料和使用者資料轉換成特徵向量，並產生應用資料供 Milvus 儲存和擷取。</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">步驟二：資料預處理</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>執行此指令會在目錄下產生測試資料 movies_data.txt，以達到影片資料的預處理。</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">步驟三：使用 Milvus 實作個人化推薦系統</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>運行此命令將實現對指定用戶的個性化推薦。</p>
<p>主要流程為</p>
<ul>
<li>透過 load_inference_model，將電影資料經過模型處理，產生電影特徵向量。</li>
<li>透過 milvus.insert 將電影特徵向量載入 Milvus。</li>
<li>根據參數指定的使用者年齡/性別/職業，轉換成使用者特徵向量，使用 milvus.search_vectors 進行相似度檢索，並傳回該使用者與電影相似度最高的結果。</li>
</ul>
<p>預測使用者感興趣的前五部電影：</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>將使用者資訊和電影資訊輸入融合推薦模型，我們可以得到匹配分數，然後根據使用者對所有電影的分數進行排序，推薦使用者可能感興趣的電影。<strong>本文結合 Milvus 與 PaddlePaddle 建立個人化推薦系統。使用向量搜尋引擎 Milvus 儲存所有電影特徵資料，再針對 Milvus 中的使用者特徵進行類似性檢索。</strong>搜尋結果就是系統推薦給使用者的電影排名。</p>
<p>Milvus [5] 向量相似度搜尋引擎與各種深度學習平台相容，搜尋數十億個向量只需毫秒級的反應。您可以利用 Milvus 輕鬆探索更多人工智能應用的可能性！</p>
<h2 id="Reference" class="common-anchor-header">參考資料<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens 百萬資料集（ml-1m）：http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>PaddlePaddle 的融合推薦模型: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
