---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: 物件偵測
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: 瞭解 Milvus 如何強化視訊內容的 AI 分析。
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>使用 Milvus 向量資料庫建立視頻分析系統</custom-h1><p><em>陳詩雨，Zilliz 數據工程師，畢業於西安電科大學計算機專業。自加入 Zilliz 以來，她一直在探索 Milvus 在各個領域的解決方案，例如音視頻分析、分子式檢索等，大大豐富了社區的應用情境。目前，她正在探索更多有趣的解決方案。閒暇時，她喜歡運動和閱讀。</em></p>
<p>上周末在看《<em>Free Guy</em>》時，我總覺得在哪裡見過扮演保安 Buddy 的演員，卻想不起他的任何作品。我的腦子裡塞滿了 「這傢伙是誰？」我很確定我見過那張臉，但卻很努力地想記起他的名字。類似的情況還有，有一次我看到影片中的男主角在喝一種我以前很喜歡的飲料，但最後卻想不起品牌名稱。</p>
<p>答案就在我的舌尖上，但我的大腦卻感覺完全卡住了。</p>
<p>看電影的時候，舌尖 (TOT) 現象讓我抓狂。要是有一個影片的反向圖片搜尋引擎就好了，讓我能夠找到影片並分析影片內容。之前，我<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">使用 Milvus</a> 建立了一個<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">反向圖像搜尋引擎</a>。考慮到影片內容分析與圖像分析有些相似，我決定在 Milvus 的基礎上建立一個影片內容分析引擎。</p>
<h2 id="Object-detection" class="common-anchor-header">物件偵測<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">概述</h3><p>在進行分析之前，必須先偵測視訊中的物件。有效且精確地偵測視訊中的物件是這項任務的主要挑戰。這也是自動駕駛、可穿戴裝置、物聯網等應用的重要任務。</p>
<p>從傳統的影像處理演算法發展到深度神經網路 (DNN)，目前物體偵測的主流模型包括 R-CNN、FRCNN、SSD 和 YOLO。本主題所介紹的以 Milvus 為基礎的深度學習視訊分析系統，可以智慧且快速地偵測物件。</p>
<h3 id="Implementation" class="common-anchor-header">執行</h3><p>為了偵測並辨識視訊中的物件，系統必須先從視訊中擷取畫面，並使用物件偵測功能偵測畫面影像中的物件；其次，從偵測到的物件中擷取特徵向量；最後，根據特徵向量分析物件。</p>
<ul>
<li>畫面擷取</li>
</ul>
<p>視訊分析可透過畫面擷取轉換為影像分析。目前，畫面擷取技術已經非常成熟。FFmpeg 和 OpenCV 等程式支援以指定的間隔抽取畫面。本文將介紹如何使用 OpenCV 從視訊中每秒擷取一張畫面。</p>
<ul>
<li>物件偵測</li>
</ul>
<p>物件偵測是在擷取的畫面中找出物件，並根據物件的位置擷取其截圖。如下圖所示，偵測到一輛自行車、一隻狗和一輛汽車。本主題將介紹如何使用常用於物件偵測的 YOLOv3 來偵測物件。</p>
<ul>
<li>特徵抽取</li>
</ul>
<p>特徵抽取是指將機器難以辨識的非結構化資料轉換為特徵向量。例如，可以使用深度學習模型將圖像轉換為多維特徵向量。目前，最流行的圖像辨識 AI 模型包括 VGG、GNN 和 ResNet。本主題將介紹如何使用 ResNet-50 從偵測到的物件中抽取特徵。</p>
<ul>
<li>向量分析</li>
</ul>
<p>將擷取的特徵向量與資料庫向量進行比較，並傳回最相似向量的對應資訊。對於大規模的特徵向量資料集，計算是一個巨大的挑戰。本主題介紹如何使用 Milvus 分析特徵向量。</p>
<h2 id="Key-technologies" class="common-anchor-header">關鍵技術<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV) 是一個跨平台的電腦視覺函式庫，提供許多影像處理與電腦視覺的通用演算法。OpenCV 常用於電腦視覺領域。</p>
<p>以下範例說明如何使用 OpenCV 搭配 Python，以指定的間隔擷取視訊畫面，並將其儲存為影像。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5])是近年來提出的單階段物件偵測演算法。與傳統的物件偵測演算法相比，在相同的精確度下，YOLOv3 的速度是傳統演算法的兩倍。本主題所提到的 YOLOv3 是 PaddlePaddle [6] 的增強版。它使用多重最佳化方法，推論速度更快。</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] 是 ILSVRC 2015 在圖像分類方面的優勝者，因為它簡單實用。作為許多影像分析方法的基礎，ResNet 被證明是專門用於影像偵測、分割和辨識的流行模型。</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a>是一個雲原生的開放原始碼向量資料庫，用來管理機器學習模型和神經網路所產生的嵌入向量。它廣泛應用於電腦視覺、自然語言處理、計算化學、個人化推薦系統等情境。</p>
<p>以下程序說明 Milvus 如何運作。</p>
<ol>
<li>使用深度學習模型將非結構化資料轉換為特徵向量，並匯入 Milvus。</li>
<li>Milvus 儲存並為特徵向量建立索引。</li>
<li>Milvus 返回與使用者查詢向量最相似的向量。</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">部署<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>現在您對於以 Milvus 為基礎的視訊分析系統有了一些了解。系統主要由兩部分組成，如下圖所示。</p>
<ul>
<li><p>紅色箭頭表示資料匯入過程。使用 ResNet-50 從影像資料集中抽取特徵向量，並將特徵向量匯入 Milvus。</p></li>
<li><p>黑色箭頭表示視訊分析流程。首先，從視訊中擷取畫格，並將畫格儲存為影像。其次，使用 YOLOv3 偵測並擷取影像中的物件。接著，使用 ResNet-50 從影像中抽取特徵向量。最後，Milvus 會搜尋並回傳具有對應特徵向量的物件資訊。</p></li>
</ul>
<p>如需詳細資訊，請參閱<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp：視訊物件偵測系統</a>。</p>
<p><strong>資料匯入</strong></p>
<p>資料匯入過程很簡單。將資料轉換成 2,048 維向量，然後將向量匯入 Milvus。</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>視訊分析</strong></p>
<p>如上文介紹，視訊分析過程包括擷取視訊畫面、偵測每一畫面中的物件、從物件中抽取向量、使用歐氏距離 (L2) 公約計算向量相似度，以及使用 Milvus 搜尋結果。</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>目前，超過 80% 的資料都是非結構化的。隨著人工智能的快速發展，越來越多的深度學習模型被開發出來用於分析非結構化資料。物件偵測和影像處理等技術在學術界和產業界都取得了重大突破。在這些技術的助力下，越來越多的人工智能平台滿足了實際需求。</p>
<p>本主題所討論的視訊分析系統是使用 Milvus 所建立，它可以快速分析視訊內容。</p>
<p>作為一個開源向量資料庫，Milvus 支援使用各種深度學習模型萃取的特徵向量。Milvus 與 Faiss、NMSLIB、Annoy 等函式庫整合，提供一套直覺的 API，支援依應用情境切換索引類型。此外，Milvus 支援標量篩選 (scalar filtering)，可提高召回率與搜尋靈活性。Milvus 已經應用在許多領域，例如影像處理、電腦視覺、自然語言處理、語音辨識、推薦系統和新藥發現。</p>
<h2 id="References" class="common-anchor-header">參考文獻<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo.「運動視訊資料庫中的商標比對與檢索」。Proceedings of the international workshop on Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban、X. Xie、W.-Y.Ma."Spatial pyramid mining for logo detection in natural scenes"。IEEE 國際會議，2008 年。https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia、C. Florea、L. Florea、R. Dogaru。「使用同軸類圖在自然影像中進行標誌定位與辨識」。機器視覺與應用 27 (2)，2016 年。https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia、C. Florea、L. Florea。"Elliptical asift agglomeration in class prototype for logo detection"。BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
