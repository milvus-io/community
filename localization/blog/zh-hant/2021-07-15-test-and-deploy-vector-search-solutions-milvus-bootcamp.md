---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: 使用 Milvus 2.0 Bootcamp 快速測試和部署矢量搜尋解決方案
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: 使用開放原始碼向量資料庫 Milvus 建立、測試及自訂向量相似性搜尋解決方案。
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>使用 Milvus 2.0 Bootcamp 快速測試和部署矢量搜尋解決方案</custom-h1><p>隨著 Milvus 2.0 的釋出，團隊對 Milvus<a href="https://github.com/milvus-io/bootcamp">Bootcamp</a> 進行了改良。全新改良的 Bootcamp 為各種使用案例和部署提供更新的指南和更容易遵循的程式碼範例。此外，新版本還針對<a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0 進行了更新，Milvus 2.0</a> 是世界上最先進的向量資料庫的重構版本。</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">根據 1M 和 100M 資料集基準測試您的系統</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">基準目錄</a>包含 1 百萬與 1 億向量基準測試，可顯示您的系統對不同大小資料集的反應。</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">探索並建立流行的向量相似性搜尋解決方案</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">解決方案目錄</a>包含最受歡迎的向量類似性搜尋使用案例。每個使用個案都包含一個筆記型電腦解決方案和一個 docker 可部署解決方案。使用個案包括</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">影像相似性搜尋</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">視訊類似性搜尋</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">音訊類似性搜尋</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">推薦系統</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">分子搜尋</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">問題回答系統</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">在任何系統上快速部署完整建置的應用程式</h3><p>快速部署解決方案為 docker 化解決方案，可讓使用者在任何系統上部署完整建置的應用程式。這些解決方案是簡短示範的理想選擇，但相較於筆記型電腦，需要額外的工作來自訂和理解。</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">使用特定情境筆記型電腦輕鬆部署預先設定的應用程式</h3><p>筆記本包含部署 Milvus 的簡單範例，以解決特定使用個案中的問題。每個範例都能夠從頭到尾執行，不需要管理檔案或配置。每個筆記本也很容易遵循和修改，使它們成為其他專案的理想基礎檔案。</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">圖像相似性搜尋筆記本範例</h3><p>圖像相似性搜尋是許多不同技術背後的核心理念之一，包括自動車識別物件。本範例說明如何使用 Milvus 輕鬆建立電腦視覺程式。</p>
<p>本筆記本圍繞三件事</p>
<ul>
<li>Milvus 伺服器</li>
<li>Redis 伺服器 (用於元資料儲存)</li>
<li>預先訓練的 Resnet-18 模型。</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">步驟 1：下載所需套件</h4><p>首先下載本專案所需的所有套件。本筆記本包含一個表格，列出要使用的套件。</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">步驟 2：啟動伺服器</h4><p>套件安裝完成後，啟動伺服器並確保兩者都能正常執行。請務必按照正確的指示啟動<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a>和<a href="https://hub.docker.com/_/redis">Redis</a>伺服器。</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">步驟 3：下載專案資料</h4><p>本筆記本預設會拉取 VOCImage 資料的片段作為範例，但只要遵循筆記本頂端的檔案結構，任何有圖片的目錄都應該可以使用。</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">步驟 4：連線到伺服器</h4><p>在本範例中，伺服器在 localhost 的預設連接埠上執行。</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">步驟 5：建立集合</h4><p>啟動伺服器後，在 Milvus 中建立一個集合來儲存所有向量。在本範例中，維度大小設定為 512，即 resnet-18 輸出的大小，相似度指標設定為歐氏距離 (L2)。Milvus 支援各種不同的<a href="https://milvus.io/docs/v2.0.x/metric.md">相似度指標</a>。</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">步驟 6：建立資料彙集索引</h4><p>收集完成後，為其建立索引。本例中使用 IVF_SQ8 索引。這個索引需要 'nlist' 參數，這個參數會告訴 Milvus 在每個資料檔（段）內要建立多少個群集。不同的<a href="https://milvus.io/docs/v2.0.x/index.md">索引</a>需要不同的參數。</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">步驟 7：設定模型和資料載入程式</h4><p>建立 IVF_SQ8 索引後，設定神經網路和資料載入器。本範例中使用的預訓 pytorch resnet-18 不含最後一層，因為最後一層會壓縮向量進行分類，可能會遺失有價值的資訊。</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>資料集和資料載入器需要修改，以便能夠預先處理和批次處理影像，同時提供影像的檔案路徑。這可以使用稍微修改過的 torchvision 資料載入程式來完成。對於預處理，由於 resnet-18 模型是在特定大小和值範圍上訓練的，因此需要對影像進行裁剪和規範化。</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">步驟 8：將向量插入到資料集中</h4><p>集合設定完成後，就可以處理影像並將其載入已建立的集合。首先，圖片會被資料載入器拉出，並透過 resnet-18 模型執行。然後將產生的向量嵌入插入 Milvus，Milvus 會為每個向量回傳唯一的 ID。向量 ID 和影像檔案路徑會以鍵值對的方式插入 Redis 伺服器。</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">步驟 9：進行向量相似性搜尋</h4><p>一旦所有資料都插入 Milvus 和 Redis，就可以執行實際的向量相似性搜尋。在這個範例中，我們從 Redis 伺服器中隨機抽出三張圖片進行向量相似性搜尋。</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>這些影像首先經過步驟 7 中找到的相同預處理，然後推過 resnet-18 模型。</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>然後使用所得的向量嵌入來執行搜尋。首先，設定搜尋參數，包括要搜尋的集合名稱、nprobe (要搜尋的群集數量) 和 top_k (返回向量的數量)。在這個範例中，搜尋應該很快。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">步驟 10：影像搜尋結果</h4><p>查詢所回傳的向量 ID 用來尋找對應的圖像。然後使用 Matplotlib 來顯示圖像搜尋結果。<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.</span> </span> <span class="img-wrapper"> <span>png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">學習如何在不同環境下部署 Milvus</h3><p>新 Bootcamp 的<a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">部署部分</a>包含了在不同環境和設置下使用 Milvus 的所有資訊。它包括部署 Mishards、使用 Kubernetes 與 Milvus、負載平衡等。每個環境都有詳細的步驟說明，解釋如何讓 Milvus 在其中運作。</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">不要成為陌生人</h3><ul>
<li>閱讀我們的<a href="https://zilliz.com/blog">部落格</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus">Github</a> 上使用或貢獻世界上最流行的向量資料庫 Milvus。</li>
</ul>
