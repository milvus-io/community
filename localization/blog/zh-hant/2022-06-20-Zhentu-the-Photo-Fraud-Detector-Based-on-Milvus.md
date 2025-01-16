---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - 基於 Milvus 的照片詐騙檢測器
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: Zhentu 的偵測系統是如何以 Milvus 作為向量搜尋引擎？
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者為BestPay資深演算法工程師石焱、唐敏薇，翻譯：<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>。</p>
</blockquote>
<p>近年來，隨著電子商務和在線交易在全球範圍內的普及，電子商務詐騙也隨之蓬勃發展。騙徒利用電腦生成的照片代替真實照片通過網上商業平台的身份驗證，製造大量虛假賬戶，套取商家的優惠資訊（如會員禮品、優惠券、代幣等），給消費者和商家都帶來了無法挽回的損失。</p>
<p>面對大量的數據，傳統的風險控制方法已不再有效。為了解決這一問題，<a href="https://www.bestpay.com.cn">BestPay</a>基於深度學習（DL）和數位影像處理（DIP）技術，創建了一款照片詐騙檢測器，即 Zhentu（中文意思是檢測圖像）。Zhentu 適用於各種涉及圖像識別的場景，其中一個重要的分支是偽造營業執照的識別。如果用戶提交的營業執照照片與平台照片庫中已有的另一張照片非常相似，則該用戶很可能在某處盜用了該照片，或者偽造了營業執照以達到欺詐目的。</p>
<p>傳統測量影像相似度的演算法，例如<a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a>和 ORB，速度慢且不準確，只適用於離線任務。深度學習則能即時處理大規模的影像資料，是比對相似影像的終極方法。在 BestPay 研發團隊與<a href="https://milvus.io/">Milvus 社群</a>的共同努力下，Zhentu 開發了一套照片詐騙偵測系統。它的功能是透過深度學習模型將大量圖像資料轉換為特徵向量，並將其插入向量搜尋引擎<a href="https://milvus.io/">Milvus</a>。透過 Milvus，偵測系統能夠索引數以萬億計的向量，並在數千萬張圖片中有效檢索相似的照片。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Zhentu 概觀</a></li>
<li><a href="#system-structure">系統結構</a></li>
<li><a href="#deployment"><strong>部署</strong></a></li>
<li><a href="#real-world-performance"><strong>實際效能</strong></a></li>
<li><a href="#reference"><strong>參考資料</strong></a></li>
<li><a href="#about-bestpay"><strong>關於 BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">臻圖概述<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu是BestPay自主設計的多媒體視覺風險控制產品，深度整合了機器學習（ML）和神經網絡圖像識別技術。其內建的演算法可在使用者驗證時精準識別詐欺者，並在毫秒級反應。憑藉領先業界的技術和創新的解決方案，臻圖已獲得五項專利和兩項軟體著作權。目前已被多家銀行和金融機構採用，幫助提前識別潛在風險。</p>
<h2 id="System-structure" class="common-anchor-header">系統架構<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay目前擁有超過1000萬張營業執照照片，隨著業務的成長，實際數量仍在成倍成長。為了從如此龐大的資料庫中快速檢索出類似照片，臻圖選擇了Milvus作為特徵向量相似度計算引擎。照片詐騙檢測系統的大體結構如下圖所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>程序可分為四個步驟：</p>
<ol>
<li><p>影像預處理。預處理包括降噪、去噪、對比度增強等，既保證原始資訊的完整性，又能去除影像訊號中的無用資訊。</p></li>
<li><p>特徵向量萃取。使用經過特殊訓練的深度學習模型來萃取影像的特徵向量。將影像轉換成向量，以便進一步進行相似性搜尋，這是一項例行性的作業。</p></li>
<li><p>歸一化。將擷取的特徵向量歸一化，有助於提高後續處理的效率。</p></li>
<li><p>使用 Milvus 進行向量搜尋。將正規化的特徵向量插入 Milvus 資料庫，進行向量相似性搜尋。</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>部署</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>以下簡述 Zhentu 照片詐騙偵測系統的部署方式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 系統架構</span> </span></p>
<p>我們將<a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Milvus 叢集</a>部署<a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">在 Kubernetes 上</a>，以確保雲端服務的高可用性與即時同步。一般步驟如下：</p>
<ol>
<li><p>檢視可用資源。執行指令<code translate="no">kubectl describe nodes</code> ，查看 Kubernetes 叢集可分配給已建立案例的資源。</p></li>
<li><p>分配資源。執行指令<code translate="no">kubect`` -- apply xxx.yaml</code> ，使用 Helm 為 Milvus 叢集元件分配記憶體和 CPU 資源。</p></li>
<li><p>套用新組態。執行指令<code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code> 。</p></li>
<li><p>將新組態套用至 Milvus 叢集。這樣部署的叢集不僅可以根據不同的業務需求調整系統容量，還能更好地滿足海量向量資料檢索的高性能要求。</p></li>
</ol>
<p>您可以對<a href="https://milvus.io/docs/v2.0.x/configure-docker.md">Milvus 進行配置</a>，針對不同業務場景下的不同類型資料優化搜索性能，如以下兩個示例所示。</p>
<p>在<a href="https://milvus.io/docs/v2.0.x/build_index.md">建立向量索引</a>時，我們根據系統的實際使用情境進行如下的參數設定：</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a>在量化向量的乘積之前，先執行 IVF 索引聚類。其特點是磁碟查詢速度快、記憶體消耗極低，符合 Zhentu 的實際應用需求。</p>
<p>此外，我們設定最佳搜尋參數如下：</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>由於向量在輸入 Milvus 前已經標準化，因此選擇內乘積 (IP) 來計算兩個向量之間的距離。實驗證明，使用 IP 比使用歐氏距離 (L2) 的召回率提高約 15%。</p>
<p>以上的例子說明，我們可以根據不同的業務情境和效能需求，測試和設定 Milvus 的參數。</p>
<p>此外，Milvus 不僅整合了不同的索引函式庫，也支援不同的索引類型和相似度計算方法。Milvus還提供了多國語言的官方SDK和豐富的API進行插入、查詢等操作，使我們的前端業務群組可以使用SDK對風控中心進行調用。</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>實際效能</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前為止，照片詐欺檢測系統一直在穩定運行，幫助企業識別潛在的詐欺者。2021 年，全年檢出假證超過 2 萬張。在查詢速度方面，在數千萬向量中單一向量查詢的時間小於 1 秒，批量查詢的平均時間小於 0.08 秒。Milvus 的高效能搜尋能同時滿足企業對準確性和並發性的需求。</p>
<h2 id="Reference" class="common-anchor-header"><strong>參考資料</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. 使用定向快速和旋轉簡算法實現高性能特徵提取方法[J].Int.J. Res.Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>關於BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>中國電信BestPay有限公司是中國電信的全資子公司。它經營支付和金融業務。BestPay致力於利用大數據、人工智能、雲計算等前沿技術賦能業務創新，提供智慧產品、風險控制解決方案等服務。截至 2016 年 1 月，這款名為 BestPay 的應用程式已吸引超過 2 億用戶，成為緊隨支付寶和微信支付的中國第三大支付平台運營商。</p>
