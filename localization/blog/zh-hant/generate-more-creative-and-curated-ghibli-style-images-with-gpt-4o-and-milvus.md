---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: 使用 GPT-4o 和 Milvus 產生更具創意和策展的吉卜力風格圖片
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: 使用 Milvus 將您的私人資料與 GPT-4o 連線，以獲得更多經整理的影像輸出
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">GPT-4o 讓每個人一夜之間成為藝術家<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>信不信由你，你剛剛看到的圖片是由 AI 產生的，特別是由新發表的 GPT-4o 產生的！</em></p>
<p>當 OpenAI 在 3 月 26 日推出 GPT-4o 的原生圖片生成功能時，沒有人能預料到接下來的創意海嘯。一夜之間，AI 生成的吉卜力風格肖像在互聯網上爆紅--名人、政客、寵物，甚至用戶自己，只需幾個簡單的提示，就能變成迷人的吉卜力工作室人物。需求是如此龐大，以至於 Sam Altman 本人不得不「懇請」使用者放慢速度，並在推特上寫道：OpenAI 的「GPU 都快融化了」。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-4o 產生的圖像範例 (credit X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">為何 GPT-4o 能改變一切<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>對於創意產業而言，這代表著範式的轉變。過去需要整個設計團隊花一整天的時間才能完成的任務，現在只要幾分鐘就能完成。GPT-4o 與以往圖片產生器的不同之處在於<strong>其卓越的視覺一致性和直覺式介面</strong>。它支援多輪會話，可讓您透過新增元素、調整比例、變更樣式，甚至將 2D 轉換成 3D 來精細化圖片，基本上就是將專業設計師放在您的口袋裡。</p>
<p>GPT-4o 優異效能背後的秘密是什麼？它的自回歸架構。擴散模型（如穩定擴散）會先將影像降解為雜訊，然後再進行重建，而 GPT-4o 則不同，它會依序產生影像，每次產生一個標記，並在整個過程中維持情境感知。這個基本的架構差異解釋了為什麼 GPT-4o 能以更直接、更自然的提示產生更一致的結果。</p>
<p>對開發人員而言，有趣的地方就在這裡：<strong>越來越多的跡象顯示了一個重要的趨勢-AI 模型本身正在成為產品。簡單來說，大多數只是將大型 AI 模型包覆在公共領域資料上的產品，都有可能落後於人。</strong></p>
<p>這些進步的真正力量來自於結合通用大型模型與<strong>私人、特定領域資料</strong>。這種結合很可能是大多數公司在大型語言模型時代的最佳生存策略。隨著基礎模型的不斷發展，持久的競爭優勢將屬於那些能夠有效地將其專有資料集與這些強大的 AI 系統相結合的公司。</p>
<p>讓我們來探討如何使用開放原始碼的高效能向量資料庫 Milvus，將您的私有資料與 GPT-4o 連結起來。</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">使用 Milvus 將您的私人資料與 GPT-4o 連線，以獲得更多經整理的影像輸出<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫是連接私人資料與 AI 模型的關鍵技術。矢量資料庫可將您的內容 (無論是圖像、文字或音訊) 轉換為數學表達 (矢量)，以捕捉其意義與特徵。這樣就可以根據相似性進行語意搜尋，而不僅僅是關鍵字。</p>
<p>Milvus 作為一個領先的開放原始碼向量資料庫，特別適合與 GPT-4o 之類的生成式 AI 工具連接。以下是我如何使用它來解決一個個人挑戰。</p>
<h3 id="Background" class="common-anchor-header">背景資料</h3><p>有一天，我想到一個絕妙的點子 - 將我的狗 Cola 所有的惡作劇都改成漫畫。但是有一個問題：我該如何從數以萬計的工作、旅遊和美食冒險照片中，篩選出 Cola 的頑皮時刻？</p>
<p>答案是什麼？將我所有的照片匯入 Milvus 並進行圖片搜尋。</p>
<p>讓我們一步一步來實作。</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">依賴與環境</h4><p>首先，您需要使用正確的套件準備好您的環境：</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">準備資料</h4><p>我將使用我的照片圖庫作為本指南的資料集，圖庫中約有 30,000 張照片。如果您手邊沒有任何資料集，請從 Milvus 下載範例資料集並解壓縮：</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">定義特徵萃取器</h4><p>我們將使用<code translate="no">timm</code> 函式庫中的 ResNet-50 模式，從圖片中萃取嵌入向量。這個模式已經在數百萬張圖片上訓練過，可以擷取代表視覺內容的有意義特徵。</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">建立 Milvus 套件</h4><p>接下來，我們將建立一個 Milvus 集合來儲存我們的圖像嵌入。把它當成一個專門為向量相似性搜尋而設計的資料庫：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>MilvusClient 參數注意事項：</strong></p>
<ul>
<li><p><strong>本機設定：</strong>使用本機檔案 (例如<code translate="no">./milvus.db</code>) 是最簡單的入門方式-Milvus Lite 會處理您所有的資料。</p></li>
<li><p><strong>擴充：</strong>對於大型資料集，使用 Docker 或 Kubernetes 設定強大的 Milvus 伺服器，並使用其 URI (例如：<code translate="no">http://localhost:19530</code>)。</p></li>
<li><p><strong>雲端選項：</strong>如果您使用 Zilliz Cloud (Milvus 的完全管理服務)，請調整您的 URI 和 token，以符合公開端點和 API 金鑰。</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">將圖片嵌入到 Milvus 中</h4><p>現在是分析每張圖片並儲存其向量表示的過程。這個步驟可能需要一些時間，視您的資料集大小而定，但這是一次性的過程：</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">進行影像搜尋</h4><p>資料庫建立完成後，我們現在可以搜尋類似的圖片。這就是神奇的地方，我們可以使用向量相似性找到視覺上相似的照片：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>返回的圖片如下所示：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">結合向量搜尋與 GPT-4o：利用 Milvus 傳回的圖片產生 Ghibli 風格的圖片</h3><p>現在到了令人興奮的部分：使用我們的圖片搜尋結果作為 GPT-4o 的輸入，以產生創意內容。在我的個案中，我想要以我拍攝的照片為基礎，創作以我的狗 Cola 為主角的漫畫。</p>
<p>工作流程簡單但功能強大：</p>
<ol>
<li><p>使用向量搜尋從我的收藏中找到 Cola 的相關圖片</p></li>
<li><p>將這些圖片賦予 GPT-4o 創意提示</p></li>
<li><p>根據視覺靈感產生獨特的漫畫</p></li>
</ol>
<p>以下是這個組合可以產生的一些範例：</p>
<p><strong>我使用的提示</strong></p>
<ul>
<li><p><em>「創作一幅四格、全彩、搞笑的漫畫，內容是一隻邊境牧羊犬被抓到在啃老鼠--主人發現時的尷尬時刻。」<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"繪製這隻狗穿著可愛的衣服的漫畫。」<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>「以這隻狗為模特，創作一則它上霍格華茲魔法學校的漫畫。」<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">我的圖像製作經驗中的幾個快速提示：</h3><ol>
<li><p><strong>保持簡單</strong>：與那些挑剔的擴散模型不同，GPT-4o 最適合直接的提示。我發現自己越寫越短，結果也越來越好。</p></li>
<li><p><strong>英文效果最好</strong>：我嘗試用中文來提示一些漫畫，但效果不佳。結果我用英文寫提示，然後在需要時翻譯完成的漫畫。</p></li>
<li><p><strong>不適合視訊世代</strong>：先別對 Sora 抱太大希望-AI 所產生的影片在流暢的動作和連貫的故事情節方面還有一段路要走。</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">下一步是什麼？我的觀點，歡迎討論<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>以 AI 產生的影像為首，快速檢視 OpenAI 過去六個月的主要發佈，可以發現一個明顯的模式：無論是應用程式市集的 GPT、報告產生的 DeepResearch、會話影像創作的 GPT-4o 或影片魔術的 Sora，大型 AI 模型正從幕後走到聚光燈下。曾經是實驗性的技術，現在正逐漸成熟為真正可用的產品。</p>
<p>隨著 GPT-4o 及類似模型被廣泛接受，大多數以 Stable Diffusion 為基礎的工作流程與智慧型代理程式將走向淘汰。然而，私人資料和人類洞察力不可取代的價值依然強大。舉例來說，雖然人工智能不會完全取代創意代理公司，但整合 Milvus 向量資料庫與 GPT 模型，可讓代理公司從過去的成功經驗中獲得靈感，快速產生新鮮的創意想法。電子商務平台可以根據購物趨勢設計個性化服裝，而學術機構則可以即時創造研究論文的視覺效果。</p>
<p>由 AI 模型驅動的產品時代已經來臨，而開發資料金礦的競賽才剛剛開始。對開發人員和企業來說，這個訊息很清楚：將您獨特的資料與這些強大的模型結合，否則就有可能落後於人。</p>
