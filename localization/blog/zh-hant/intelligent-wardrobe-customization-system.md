---
id: intelligent-wardrobe-customization-system.md
title: 建立由 Milvus 向量資料庫支援的智慧型衣櫃客製化系統
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: 使用相似性搜尋技術發掘非結構化資料的潛力，甚至像衣櫃及其組件！
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<p>如果您正在尋找能完美融入臥室或試衣間的衣櫃，我敢打賭大多數人都會想到量身訂做的衣櫃。然而，不是每個人的預算都能負擔那麼多。那麼現成的衣櫃又如何呢？這類衣櫃的問題是，它們很可能無法滿足您的期望，因為它們不夠靈活，無法滿足您獨特的儲存需求。此外，在網路上搜尋時，您很難用關鍵字來概括您要找的衣櫃類型。很有可能，您在搜尋方塊中輸入的關鍵字（例如：有首飾托盤的衣櫃）與搜尋引擎中的定義（例如：有<a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">內嵌拉出托盤</a>的衣櫃）大不相同。</p>
<p>但是多虧了新興科技，我們有了解決方案！家具零售集團 IKEA 提供了一款廣受歡迎的設計工具<a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX wardrobe</a>，讓使用者可以從許多現成的衣櫃中選擇，並客製化衣櫃的顏色、尺寸和內部設計。無論您需要的是懸掛空間、多層置物架或內部抽屜，這個智慧型衣櫃客製化系統總能滿足您的需求。</p>
<p>要使用這個智慧型衣櫃設計系統找到或打造您理想中的衣櫃，您需要</p>
<ol>
<li>指定基本要求 - 衣櫃的形狀 (一般、L 型或 U 型)、長度和深度。</li>
<li>指定您的儲存需求和衣櫃內部組織（例如：需要懸掛空間、抽拉式褲架等）。</li>
<li>增加或移除衣櫃的抽屜或層板等部分。</li>
</ol>
<p>然後您的設計就完成了。簡單輕鬆！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>PAX 系統</span> </span></p>
<p>使這樣的衣櫃設計系統得以實現的一個非常關鍵的組成部分是<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>。因此，本文旨在介紹用於建立以向量相似性搜尋為動力的智慧型衣櫃訂製系統的工作流程和相似性搜尋解決方案。</p>
<p>跳至</p>
<ul>
<li><a href="#System-overview">系統概述</a></li>
<li><a href="#Data-flow">資料流程</a></li>
<li><a href="#System-demo">系統示範</a></li>
</ul>
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
    </button></h2><p>為了提供這樣一個智慧型衣櫃客製化工具，我們需要先定義業務邏輯，並瞭解物品屬性和使用者旅程。衣櫃及其組件，例如抽屜、托盤、架子，都是非結構化的資料。因此，第二步是利用人工智能演算法和規則、先驗知識、物品描述等，將這些非結構化資料轉換為電腦可以理解的資料類型 - 向量！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>客製化工具概觀</span> </span></p>
<p>有了產生的向量，我們需要強大的向量資料庫和搜尋引擎來處理它們。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>工具架構</span> </span></p>
<p>客製化工具利用一些最流行的搜尋引擎和資料庫：Elasticsearch、<a href="https://milvus.io/">Milvus</a> 和 PostgreSQL。</p>
<h3 id="Why-Milvus" class="common-anchor-header">為什麼是 Milvus？</h3><p>衣櫃元件包含高度複雜的資訊，例如顏色、形狀和內部組織等。然而，將衣櫃資料保存在關係資料庫的傳統方式遠遠不夠。目前流行的方式是使用嵌入技術將衣櫃轉換成向量。因此，我們需要尋找一種專門用於向量儲存和相似性搜尋的新型資料庫。在探究了幾種流行的解決方案後，<a href="https://github.com/milvus-io/milvus">Milvus</a>向量資料庫以其優異的效能、穩定性、相容性和易用性而被選中。下圖是幾種流行的向量搜尋解決方案的比較。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>解決方案比較</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">系統工作流程</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>系統工作流程</span> </span></p>
<p>使用 Elasticsearch 依據衣櫃尺寸、顏色等進行粗略篩選。然後，篩選結果會經過 Milvus 向量資料庫進行相似性搜尋，並根據結果與查詢向量的距離/相似性進行排序。最後，根據業務洞察力來整合結果並進一步精煉。</p>
<h2 id="Data-flow" class="common-anchor-header">資料流程<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>衣櫃客製化系統與傳統的搜尋引擎和推薦系統非常相似。它包含三個部分：</p>
<ul>
<li>離線資料準備，包括資料定義與產生。</li>
<li>線上服務，包括召回和排序。</li>
<li>基於商業邏輯的資料後製處理。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>資料流程</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">離線資料流程</h3><ol>
<li>使用業務洞察力定義資料。</li>
<li>使用先驗知識定義如何結合不同元件並將其組成衣櫃。</li>
<li>辨識衣櫃的特徵標籤，並將特徵編碼為<code translate="no">.json</code> 檔案中的 Elasticsearch 資料。</li>
<li>將非結構化資料編碼成向量，準備召回資料。</li>
<li>使用向量資料庫 Milvus 對上一步獲得的召回結果進行排序。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>離線資料流程</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">線上資料流程</h3><ol>
<li>接收使用者的查詢請求，並收集使用者資料。</li>
<li>透過識別使用者對衣櫃的需求來瞭解使用者的查詢。</li>
<li>使用 Elasticsearch 進行粗搜尋。</li>
<li>根據 Milvus 中向量相似度的計算，對粗略搜尋得到的結果進行評分和排序。</li>
<li>在後端平台上對結果進行後期處理和整理，生成最終結果。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>線上資料流程</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">資料後處理</h3><p>每家公司的業務邏輯各不相同。您可以運用公司的業務邏輯，為結果加上最後的修飾。</p>
<h2 id="System-demo" class="common-anchor-header">系統示範<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>現在讓我們看看我們建立的系統實際上是如何運作的。</p>
<p>使用者介面 (UI) 顯示衣櫃元件不同組合的可能性。</p>
<p>每個組件都以其特徵 (尺寸、顏色等) 標示，並儲存於 Elasticsearch (ES)。在 ES 中儲存標籤時，有四個主要資料欄位需要填寫：ID、標籤、儲存路徑和其他支援欄位。ES 和標籤資料用於粒度召回和屬性篩選。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>然後使用不同的 AI 演算法，將衣箱編碼成向量集。向量集儲存在 Milvus 中，用於相似性搜尋和排序。此步驟會返回更精緻、更準確的結果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch、Milvus 和其他系統元件共同構成客製化設計平台的整體。在回憶過程中，Elasticsearch 與 Milvus 的特定領域語言 (DSL) 如下。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">尋找更多資源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>瞭解 Milvus 向量資料庫如何為更多 AI 應用程式提供動力：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">短影片平台 Likee 如何利用 Milvus 移除重複影片</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - 基於 Milvus 的照片詐騙偵測器</a></li>
</ul>
