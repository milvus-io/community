---
id: graph-based-recommendation-system-with-milvus.md
title: 推薦系統如何運作？
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: 推薦系統可以創造收入、降低成本並提供競爭優勢。了解如何使用開放原始碼工具免費建立一個系統。
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>使用 Milvus、PinSage、DGL 和 MovieLens 資料集建立圖形推薦系統</custom-h1><p>推薦系統由演算法提供動力，這些演算法的<a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">起點很低</a>，只能幫助人類篩選不需要的電子郵件。1990 年，發明者 Doug Terry 使用協同過濾演算法，從垃圾郵件中篩選出理想的電子郵件。使用者只要「喜歡」或「討厭」某封電子郵件，並與其他對類似郵件內容做相同動作的人合作，就能快速訓練電腦決定哪些郵件要推送到使用者的收件匣，哪些則要篩選到垃圾信件匣。</p>
<p>一般而言，推薦系統是向使用者提供相關建議的演算法。建議可以是要看的電影、要閱讀的書籍、要購買的產品，或其他任何取決於情境或產業的建議。這些演算法就在我們身邊，影響著我們所消費的內容，以及我們從 Youtube、Amazon、Netflix 等主要科技公司所購買的產品。</p>
<p>設計良好的推薦系統可以成為重要的營收來源、降低成本以及競爭優勢。由於開放原始碼技術和不斷下降的計算成本，客製化的推薦系統從未如此容易獲得。本文將介紹如何使用開源向量資料庫 Milvus、圖形卷繞神經網路 (GCN) PinSage、深度圖形函式庫 (DGL)、用於圖形深度學習的可擴充 python 套件，以及 MovieLens 資料集來建立圖形推薦系統。</p>
<p><strong>跳至</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">推薦系統如何運作？</a></li>
<li><a href="#tools-for-building-a-recommender-system">建立推薦系統的工具</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">使用 Milvus 建立圖形推薦系統</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">推薦系統如何運作？<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>建立推薦系統有兩種常見的方法：協作過濾（collaborative filtering）和基於內容的過濾（content-based filtering）。大多數開發人員會使用其中一種或兩種方法，儘管推薦系統的複雜性和建構各不相同，但它們通常包含三個核心要素：</p>
<ol>
<li><strong>使用者模型：</strong>推薦系統需要對使用者的特徵、偏好和需求進行建模。許多推薦系統的建議都是基於使用者隱含或明確的項目層級輸入。</li>
<li><strong>物件模型：</strong>推薦系統也會對物品進行建模，以便根據使用者的肖像進行物品推薦。</li>
<li><strong>推薦演算法：</strong>任何推薦系統的核心元件都是推薦的演算法。常用的演算法包括協同過濾、隱含語意建模、圖形建模、結合推薦等等。</li>
</ol>
<p>從高層次來看，依賴於協同過濾的推薦系統從使用者過去的行為（包括相似使用者的行為輸入）建立模型，以預測使用者可能感興趣的內容。基於內容篩選的系統使用基於項目特性的離散、預定義標籤來推薦類似項目。</p>
<p>協同過濾的一個範例是 Spotify 上的個人化廣播電台，它是根據使用者的收聽記錄、興趣、音樂庫等資料建立的。這個電台會播放使用者尚未儲存或表示有興趣的音樂，但其他有類似品味的使用者通常會有興趣的音樂。基於內容的篩選範例是基於特定歌曲或藝人的電台，利用輸入的屬性來推薦類似音樂。</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">建立推薦系統的工具<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>在這個範例中，從零開始建立圖形化推薦系統有賴於下列工具：</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage：圖形卷積網路</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a>是一種隨機漫步圖形卷積網路，能夠為包含數十億個物件的網路規模圖形中的節點學習嵌入。該網路由線上釘板公司<a href="https://www.pinterest.com/">Pinterest 所開發</a>，目的是為其使用者提供主題視覺推薦。</p>
<p>Pinterest 用戶可以將他們感興趣的內容「釘」到「板」上，「板」是釘選內容的集合。該公司擁有超過<a href="https://business.pinterest.com/audience/">4.78</a> <a href="https://newsroom.pinterest.com/en/company">億名</a>月活躍使用者 (MAU)，儲存的物件超過<a href="https://newsroom.pinterest.com/en/company">2400 億件</a>，因此擁有大量的使用者資料，必須建立新的技術才能跟上。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage 使用 pins-boards bipartite 圖形從 pins 中產生高品質的 embeddings，用來向使用者推薦視覺上相似的內容。傳統的 GCN 演算法會對特徵矩陣和整個圖表執行卷曲，PinSage 則不同，它會對附近的節點/Pins 進行採樣，並透過動態建構計算圖表來執行更有效率的局部卷曲。</p>
<p>對於節點的整個鄰近區域執行卷繞會產生大量的計算圖。為了降低資源需求，傳統的 GCN 演算法會透過彙集鄰近 k 跳的資訊來更新節點的表示。PinSage 模擬隨機走動，將經常造訪的內容設定為關鍵鄰域，然後根據它來建構卷積。</p>
<p>由於 k 跳鄰近區域經常會有重疊，因此節點上的局部卷積會導致重複計算。為了避免這個問題，在每個聚合步驟中，PinSage 會映射所有節點而不重複計算，然後將這些節點連結到對應的上層節點，最後擷取上層節點的嵌入。</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Deep Graph Library：用於圖表深度學習的可擴展性 python 套件</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a>是一個 Python 套件，專門用於在現有深度學習框架 (例如 PyTorch、MXNet、Gluon 等) 之上建立基於圖表的神經網路模型。DGL 包含友善的使用者後端介面，可輕鬆植入基於張量且支援自動產生的框架。上述的 PinSage 演算法已針對 DGL 與 PyTorch 進行最佳化。</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: 專為人工智慧與相似性搜尋打造的開放原始碼向量資料庫</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>Milvus 如何運作.png</span> </span></p>
<p>Milvus 是一個開放原始碼向量資料庫，用於向量相似性搜尋和人工智慧 (AI) 應用程式。從高層次來看，使用 Milvus 進行相似性搜尋的工作原理如下：</p>
<ol>
<li>使用深度學習模型將非結構化資料轉換為特徵向量，再匯入 Milvus。</li>
<li>Milvus 會儲存特徵向量並建立索引。</li>
<li>根據要求，Milvus 會搜尋並回傳與輸入向量最相似的向量。</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">使用 Milvus 建立圖形推薦系統<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3 建立圖形推薦系統.png</span> </span></p>
<p>使用 Milvus 建立圖形化推薦系統包含以下步驟：</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">步驟 1：資料預處理</h3><p>資料預處理包括將原始資料轉換成更容易理解的格式。本範例使用開放資料集 MovieLens[5] (m1-1m)，其中包含 6,000 位使用者對 4,000 部電影的 1,000,000 個評價。此資料由 GroupLens 收集，包含電影描述、電影評分和使用者特徵。</p>
<p>請注意，本範例中使用的 MovieLens 資料集只需要最低限度的資料清理或組織。但是，如果您使用的是不同的資料集，您的里程可能會有所不同。</p>
<p>要開始建立推薦系統，請使用 MovieLens 資料集中的歷史使用者電影資料，建立使用者電影雙方圖，以利分類。</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">步驟 2：使用 PinSage 訓練模型</h3><p>使用 PinSage 模型產生的針腳嵌入向量是所獲取電影資訊的特徵向量。基於雙方圖 g 和自訂的電影特徵向量維度 (預設為 256-d)，建立 PinSage 模型。然後使用 PyTorch 訓練模型，取得 4,000 部電影的 h_item embeddings。</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">步驟 3：載入資料</h3><p>將 PinSage 模型產生的電影內嵌 h_item 載入 Milvus，Milvus 會傳回相對應的 ID。將 ID 和對應的電影資訊匯入 MySQL。</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">步驟四：進行向量相似性搜尋</h3><p>根據影片 ID 在 Milvus 中取得相對應的 embeddings，再使用 Milvus 以這些 embeddings 執行相似性搜尋。接著，在 MySQL 資料庫中找出對應的電影資訊。</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">步驟 5：獲得推薦</h3><p>系統現在會推薦與使用者搜尋查詢最相似的電影。這就是建立推薦系統的一般工作流程。若要快速測試和部署推薦系統及其他 AI 應用程式，請嘗試 Milvus<a href="https://github.com/milvus-io/bootcamp">bootcamp</a>。</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus 不僅能支援推薦系統<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一個功能強大的工具，能夠支援大量的人工智慧與向量相似性搜尋應用程式。若要進一步瞭解此專案，請參閱下列資源：</p>
<ul>
<li>閱讀我們的<a href="https://zilliz.com/blog">部落格</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用世界上最流行的向量資料庫或為其做出貢獻。</li>
</ul>
