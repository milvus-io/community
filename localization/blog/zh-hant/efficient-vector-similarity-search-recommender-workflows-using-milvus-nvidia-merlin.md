---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: 在推薦工作流程中使用 Milvus 與 NVIDIA Merlin 進行高效向量相似性搜尋
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: 介紹如何整合 NVIDIA Merlin 與 Milvus，以建立推薦系統，並測試其在各種情境下的效能。
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>本篇文章首次發表於<a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">NVIDIA Merlin 的 Medium 頻道</a>，並經許可編輯轉貼於此。本文由 NVIDIA 的<a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a>和<a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a>，以及 Zilliz 的<a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a>和<a href="https://github.com/liliu-z">Li Liu</a>共同撰寫。</em></p>
<h2 id="Introduction" class="common-anchor-header">引言<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>現代的推薦系統（Recsys）由訓練/推理管道組成，涉及資料擷取、資料預處理、模型訓練、超參數調整等多個階段，以進行相關項目的檢索、過濾、排序和評分。推薦系統管道的一個重要組成部分是擷取或發現與使用者最相關的項目，尤其是在有大量項目目錄的情況下。這個步驟通常是在索引資料庫中進行<a href="https://zilliz.com/glossary/anns">近似最近鄰 (ANN)</a>搜尋，資料庫中的產品與使用者屬性的低維向量表達 (即嵌入)，是由深度學習模型所建立，這些模型會針對使用者與產品/服務之間的互動進行訓練。</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a> 是一個開放源碼框架，專為訓練端對端模型以進行任何規模的推薦而開發，整合了高效率的<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>索引與搜尋框架。<a href="https://zilliz.com/what-is-milvus">Milvus</a> 是由<a href="https://zilliz.com/">Zilliz</a> 所建立的開放原始碼向量資料庫，也是近期備受關注的架構之一。它提供快速的索引和查詢功能。Milvus 最近新增了<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPU 加速支援</a>，可使用 NVIDIA GPU 來維持 AI 工作流程。GPU 加速支援是個好消息，因為加速向量搜尋程式庫讓快速並發查詢成為可能，對現今推薦人系統的延遲需求產生正面影響，開發人員期望在推薦人系統中能有許多並發請求。Milvus 已經有超過 5M 的 docker pulls，在 GitHub 上有 ~23k stars (截至 2023 年 9 月)，超過 5,000 家企業客戶，並且是許多應用程式的核心元件 (請參閱使用<a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">案例</a>)。</p>
<p>這篇部落格展示 Milvus 如何在訓練和推論時與 Merlin Recsys 框架合作。我們展示 Milvus 如何在項目檢索階段以高效率的 top-k 向量嵌入搜尋補足 Merlin，以及如何在推論時與 NVIDIA Triton Inference Server (TIS) 搭配使用 (請參閱圖 1)。<strong>我們的基準結果顯示，使用 NVIDIA RAFT 與 Merlin Models 所產生的向量內嵌的 GPU 加速 Milvus，速度提升了 37 倍到 91 倍，令人印象深刻。</strong>我們用來展示 Merlin-Milvus 整合的程式碼、詳細的基準結果，以及協助我們進行基準研究的<a href="https://github.com/zilliztech/VectorDBBench">函式庫</a>，都可以在這裡取得。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 1.多階段推薦系統，Milvus 框架在檢索階段有所貢獻。原始多階段圖的來源：這篇部落格<a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">文章</a>。</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">推薦者面臨的挑戰<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>鑑於推薦器的多階段性質，以及他們所整合的各種元件與函式庫的可用性，一個重大的挑戰就是在端對端管道中無縫整合所有元件。我們的目標是在我們的範例筆記本中展示整合可以事半功倍。</p>
<p>推薦工作流程的另一個挑戰是加速某些管道部分。儘管 GPU 在訓練大型神經網路方面發揮了巨大的作用，但它只是最近才加入向量資料庫和 ANN 搜尋。隨著電子商務產品庫或串流媒體資料庫的規模越來越大，使用這些服務的使用者也越來越多，CPU 必須提供所需的效能，才能在高效能的 Recsys 工作流程中為數百萬的使用者提供服務。為了因應這項挑戰，其他管線部分的 GPU 加速已變得非常必要。本部落格中的解決方案透過顯示使用 GPU 時 ANN 搜尋的效率，來解決這個挑戰。</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">解決方案的技術堆疊<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，讓我們先回顧進行工作所需的一些基本要素。</p>
<ul>
<li><p>NVIDIA<a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>：一個開放源碼函式庫，提供高階 API，可加速 NVIDIA GPU 上的推薦程式。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>：用於預先處理輸入的表格資料和特徵工程。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>：用於訓練深度學習模型，並從使用者互動資料中學習使用者與項目嵌入向量。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin 系統</a>：用於將基於 TensorFlow 的推薦模型與其他元素 (例如，特徵儲存、使用 Milvus 的 ANN 搜尋) 相結合，並與 TIS 一起提供服務。</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton 推論伺服器</a>：用於推論階段，在此階段會傳送使用者特徵向量，並產生產品推薦。</p></li>
<li><p>容器化：上述所有功能都可透過<a href="https://catalog.ngc.nvidia.com/">NVIDIA</a> 在<a href="https://catalog.ngc.nvidia.com/">NGC 目錄</a>中提供的容器來實現。我們使用<a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">這裡</a>提供的 Merlin TensorFlow 23.06 容器。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>：用於進行 GPU 加速的向量索引與查詢。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>：與上述相同，但用於在 CPU 上進行。</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>：用於連接 Milvus 伺服器、建立向量資料庫索引，以及透過 Python 介面執行查詢。</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>：用於在（開放源碼）特徵儲存庫中儲存和檢索使用者和項目的屬性，作為我們端對端 RecSys 管道的一部分。</p></li>
</ul>
<p>幾個底層函式庫和框架也在引擎蓋下使用。例如，Merlin 依賴其他 NVIDIA 函式庫，例如 cuDF 與 Dask，兩者皆可在<a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a> 下取得。同樣地，Milvus 也依賴<a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a>來取得 GPU 加速上的原始資料，並依賴<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>和<a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>等修改過的函式庫來進行搜尋。</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">瞭解向量資料庫與 Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">近似最近鄰 (ANN)</a>是關係型資料庫無法處理的功能。關聯式資料庫的設計是為了處理具有預定義結構和直接可比較值的表格資料。關聯式資料庫索引依靠這一點來比較資料，並利用知道每個值是否小於或大於其他值的優勢來建立結構。嵌入向量無法以這種方式直接相互比較，因為我們需要知道向量中的每個值代表什麼。他們不能說一個向量是否一定小於另一個向量。我們唯一能做的就是計算兩個向量之間的距離。如果兩個向量之間的距離很小，我們就可以假設它們所代表的特徵很相似；如果距離很大，我們就可以假設它們所代表的資料差異較大。然而，這些有效率的索引是有代價的；計算兩個向量之間的距離的計算成本很高，而且向量索引不容易適應，有時甚至無法修改。由於這兩個限制，在關係資料庫中整合這些索引會比較複雜，這就是為什麼需要<a href="https://zilliz.com/blog/what-is-a-real-vector-database">專門設計向量資料庫</a>的原因。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>就是為了解決關係型資料庫在向量上所遇到的問題而創造出來的，並且從一開始就被設計成可以大規模處理這些嵌入向量及其索引。為了履行雲端原生的徽章，Milvus 將運算和儲存以及不同的運算任務 - 查詢、資料理順和索引 - 分開。使用者可以擴充每個資料庫部分，以處理其他使用個案，不論是資料插入重或搜尋重。如果有大量插入請求湧入，使用者可以暫時橫向和縱向擴充索引節點，以處理資料的擷取。同樣地，如果沒有資料擷取，但有許多搜尋，使用者可以減少索引節點，改為擴大查詢節點，以獲得更高的吞吐量。這個系統設計 (見圖 2) 需要我們以平行運算的思維來思考，因此產生了一個運算最佳化的系統，並開啟了許多進一步最佳化的門戶。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 2.Milvus 系統設計</em></p>
<p>Milvus 也使用許多最先進的索引函式庫，讓使用者可以盡可能為自己的系統進行客製化。它透過增加處理 CRUD 操作、串流資料和過濾的能力來改善它們。稍後，我們會討論這些索引有何不同，以及各自的優缺點。</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">解決方案範例：整合 Milvus 與 Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>我們在此提出的範例解決方案，展示了 Milvus 與 Merlin 在項目檢索階段 (透過 ANN 搜尋找出 k 個最相關的項目) 的整合。我們使用<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 挑戰賽</a>的真實資料集，說明如下。我們訓練一個 Two-Tower 深度學習模型，學習使用者與物品的向量嵌入。本節也提供我們基準測試工作的藍圖，包括我們收集的指標和使用的參數範圍。</p>
<p>我們的方法包括</p>
<ul>
<li><p>資料擷取與預處理</p></li>
<li><p>雙塔深度學習模型訓練</p></li>
<li><p>建立 Milvus 索引</p></li>
<li><p>Milvus 相似性搜尋</p></li>
</ul>
<p>我們將簡單介紹每個步驟，詳情請參閱我們的<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">筆記本</a>。</p>
<h3 id="Dataset" class="common-anchor-header">資料集</h3><p>YOOCHOOSE GmbH 為<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 2015 挑戰賽</a>提供我們在此整合與基準研究中使用的資料集，並可在 Kaggle 上取得。該資料集包含來自歐洲線上零售商的使用者點選/購買事件，其屬性包括會話 ID、時間戳記、與點選/購買相關的商品 ID，以及商品類別，可在檔案 yoochoose-clicks.dat 中取得。會話是獨立的，而且沒有返回使用者的提示，因此我們將每個會話視為屬於一個不同的使用者。資料集有 9,249,729 個獨特會話（使用者）和 52,739 個獨特項目。</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">資料擷取與預處理</h3><p>我們用來進行資料預處理的工具是<a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>，這是 Merlin 的 GPU 加速、高度可擴充的特徵工程與預處理元件。我們使用 NVTabular 將資料讀入 GPU 記憶體，必要時重新排列特徵，匯出至 parquet 檔案，並建立訓練-驗證分割進行訓練。這會產生 7,305,761 個獨特使用者和 49,008 個獨特項目來進行訓練。我們也將每一列及其值歸類為整數值。現在資料集已準備好使用 Two-Tower 模型進行訓練。</p>
<h3 id="Model-training" class="common-anchor-header">模型訓練</h3><p>我們使用<a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a>深度學習模型來訓練和產生使用者與項目嵌入，之後用於向量索引和查詢。在訓練模型之後，我們就可以擷取學習到的使用者與項目嵌入。</p>
<p>以下兩個步驟是可選的：訓練<a href="https://arxiv.org/abs/1906.00091">DLRM</a>模型來對擷取的項目進行排序以進行推薦，以及使用特徵儲存（在本例中為<a href="https://github.com/feast-dev/feast">Feast</a>）來儲存和擷取使用者和項目的特徵。我們加入這些步驟是為了讓多階段工作流程更完整。</p>
<p>最後，我們匯出使用者和項目嵌入到 parquet 檔案，之後可以重新載入以建立 Milvus 向量索引。</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">建立和查詢 Milvus 索引</h3><p>Milvus 透過在推論機上啟動的「伺服器」來促進向量索引和相似性搜尋。在筆記本 #2 中，我們透過 pip 安裝 Milvus 伺服器和 Pymilvus 來設定，然後以預設的聆聽連接埠啟動伺服器。接下來，我們將示範建立一個簡單的索引 (IVF_FLAT)，並分別使用<code translate="no">setup_milvus</code> 和<code translate="no">query_milvus</code> 兩個函式進行查詢。</p>
<h2 id="Benchmarking" class="common-anchor-header">基準測試<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>我們設計了兩個基準來證明使用 Milvus 這種快速且有效率的向量索引／搜尋函式庫的實例。</p>
<ol>
<li><p>使用 Milvus 與我們產生的兩組嵌入資料建立向量索引：1) 7.3M 獨特使用者的使用者嵌入資料，分為 85% 的訓練集 (用於索引) 和 15% 的測試集 (用於查詢)；以及 2) 49K 產品的項目嵌入資料 (訓練與測試各佔一半)。此基準是針對每個向量資料集獨立完成，結果會分別報告。</p></li>
<li><p>使用 Milvus 為 49K 項目嵌入資料集建立向量索引，並針對此索引查詢 7.3M 唯一使用者進行相似性搜尋。</p></li>
</ol>
<p>在這些基準中，我們使用了在 GPU 和 CPU 上執行的 IVFPQ 和 HNSW 索引演算法，以及各種參數組合。詳細資訊請見<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">此處</a>。</p>
<p>搜尋品質-吞吐量的取捨是一個重要的效能考量，尤其是在生產環境中。Milvus 允許對索引參數進行完全控制，針對特定用例探討此折衷，以獲得更佳的搜尋結果與地面真實。這可能意味著以降低吞吐率或每秒查詢次數 (QPS) 的形式增加計算成本。我們使用召回指標來測量 ANN 搜尋的品質，並提供 QPS- 召回曲線來證明這個取捨。這樣，我們就可以根據業務案例的計算資源或延遲/吞吐量要求，決定可接受的搜尋品質水準。</p>
<p>此外，請注意我們基準中使用的查詢批次大小 (nq)。這對於同時有多個請求傳送到推論的工作流程非常有用（例如，請求離線推薦並傳送至電子郵件收件者清單，或透過匯集同時到達的請求並一次全部處理來建立線上推薦）。根據使用情況，TIS 也可以協助分批處理這些請求。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p>我們現在報告在 CPU 和 GPU 上使用 Milvus 實作的 HNSW (僅 CPU) 和 IVF_PQ (CPU 和 GPU) 索引類型進行三組基準測試的結果。</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">項目與項目向量相似性搜尋</h4><p>使用這個最小的資料集，針對給定的參數組合，每次執行都會抽取 50% 的項目向量作為查詢向量，並從其餘的向量中查詢前 100 個相似向量。在測試的參數設定下，HNSW 和 IVF_PQ 產生了高召回率，分別在 0.958-1.0 和 0.665-0.997 的範圍內。此結果顯示 HNSW 在召回率方面表現較佳，但 IVF_PQ 在小 nlist 設定下產生的召回率非常接近。我們還應該注意的是，召回值可能會因為索引和查詢參數的不同而有很大的差異。我們報告的數值是在初步實驗一般參數範圍，並進一步縮小到精選的子集之後得到的。</p>
<p>對於特定的參數組合，在 CPU 上使用 HNSW 執行所有查詢的總時間介於 5.22 和 5.33 秒之間（m 越大速度越快，ef 則相對不變），使用 IVF_PQ 則介於 13.67 和 14.67 秒之間（nlist 和 nprobe 越大速度越慢）。GPU 加速確實有明顯的效果，如圖 3 所示。</p>
<p>圖 3 顯示使用 IVF_PQ 在 CPU 和 GPU 上完成的所有運行的召回-吞吐量權衡。我們發現在所有測試的參數組合中，GPU 的速度提升了 4 到 15 倍 (nprobe 越大，速度提升越大)。這是以每個參數組合中 GPU 的 QPS 較 CPU 的 QPS 計算出來的。總體來說，這個資料集對 CPU 或 GPU 來說都沒有太大的挑戰，並顯示出在更大的資料集上進一步加速的前景，如下所述。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 3.在 NVIDIA A100 GPU 上執行 Milvus IVF_PQ 演算法的 GPU 速度提升 (項目-項目類似性搜尋)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">使用者與使用者向量相似性搜尋</h4><p>對於大得多的第二個資料集（7.3M 個使用者），我們預留 85% (~6.2M) 的向量作為「訓練」（要編入索引的向量集），其餘 15% (~1.1M) 則為「測試」或查詢向量集。在這種情況下，HNSW 和 IVF_PQ 的表現非常好，召回值分別為 0.884-1.0 和 0.922-0.999。然而，這兩種方法的計算需求較高，尤其是在 CPU 上使用 IVF_PQ。在 CPU 上使用 HNSW 執行所有查詢的總時間從 279.89 到 295.56 秒不等，使用 IVF_PQ 則從 3082.67 到 10932.33 秒不等。請注意，這些查詢時間是 1.1M 向量查詢的累積時間，因此可以說針對索引的單次查詢仍然非常快速。</p>
<p>然而，如果推論伺服器預期會有成千上萬的並發請求，針對數百萬項目的庫存執行查詢，則基於 CPU 的查詢方式可能並不可行。</p>
<p>圖 4 顯示，A100 GPU 在 IVF_PQ 的所有參數組合中，在吞吐量 (QPS) 方面提供了 37 倍到 91 倍 (平均 76.1 倍) 的極速。這與我們在小型資料集上觀察到的結果一致，顯示使用 Milvus 與數百萬個嵌入向量時，GPU 的效能擴充相當不錯。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 4.在 NVIDIA A100 GPU 上執行 Milvus IVF_PQ 演算法的 GPU 速度提升 (使用者與使用者之間的相似性搜尋)</em></p>
<p>以下詳細的圖表 5 顯示在 CPU 和 GPU 上使用 IVF_PQ 測試的所有參數組合的召回率-QPS 權衡。圖表上的每個點集（上端為 GPU，下端為 CPU）描述了在改變向量索引/查詢參數時所面對的取捨，即以較低的吞吐量為代價，達到較高的召回率。請注意，在 GPU 的情況下，當嘗試達到更高的召回率時，QPS 的損失相當大。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 5.使用 IVF_PQ 在 CPU 和 GPU 上測試的所有參數組合的召回率-吞吐量權衡 (使用者 vs. 使用者)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">使用者與項目向量相似性搜尋</h4><p>最後，我們考慮另一個實際的使用個案，即使用者向量對項目向量進行查詢 (如上文筆記本 01 所示)。在這種情況下，49K 個項目向量被編入索引，而 7.3M 個使用者向量會各自查詢前 100 個最相似的項目。</p>
<p>這就是事情變得有趣的地方，因為針對 49K 個項目的索引，以 1000 個批次查詢 7.3M 個項目，在 CPU 上對 HNSW 和 IVF_PQ 來說似乎都很耗時。GPU 似乎能更好地處理這種情況 (請參閱圖 6)。當 nlist = 100 時，IVF_PQ 在 CPU 上的最高精確度平均計算時間約為 86 分鐘，但隨著 nprobe 值的增加，精確度會有顯著的差異 (nprobe = 5 時為 51 分鐘，nprobe = 20 時為 128 分鐘)。NVIDIA A100 GPU 可將效能大幅提升 4 至 17 倍 (nprobe 越大，速度越快)。請記住，IVF_PQ 演算法透過其量化技術，也能減少記憶體佔用量，並結合 GPU 加速，提供計算上可行的 ANN 搜尋解決方案。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 6.在 NVIDIA A100 GPU 上執行 Milvus IVF_PQ 演算法的 GPU 加速 (使用者項目相似性搜尋)</em></p>
<p>與圖 5 相似，圖 7 顯示了使用 IVF_PQ 測試的所有參數組合的召回-吞吐量權衡。在這裡，我們仍然可以看到，為了增加吞吐量，我們可能需要稍微放棄一些 ANN 搜尋的精確度，不過差異就沒那麼明顯了，尤其是在 GPU 運行的情況下。這顯示使用 GPU 可以期望相對穩定的高運算效能，同時仍能達到高召回率。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 7.使用 IVF_PQ 在 CPU 和 GPU 上測試的所有參數組合的召回率-吞吐量權衡 (使用者 vs. 項目)</em></p>
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
    </button></h2><p>如果您能閱讀到這裡，我們很樂意與您分享一些結語。我們想提醒您，現代 Recsys 的複雜性和多階段性要求每個步驟都必須具備效能和效率。希望這篇部落格能給您令人信服的理由，讓您考慮在 RecSys 管線中使用兩項關鍵功能：</p>
<ul>
<li><p>NVIDIA Merlin 的 Merlin 系統函式庫可讓您輕鬆插入<a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>，這是一個高效率的 GPU 加速向量搜尋引擎。</p></li>
<li><p>使用 GPU 加速向量資料庫索引的運算，並利用<a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a> 等技術進行 ANN 搜尋。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>這些研究結果顯示，所提出的 Merlin-Milvus 整合方案具有極高的效能，而且複雜度遠低於其他訓練與推論方案。此外，這兩個框架都在積極開發，而且每個版本都會加入許多新功能（例如 Milvus 的新 GPU 加速向量資料庫索引）。向量類似性搜尋是各種工作流程中的重要組成部分，例如電腦視覺、大型語言建模和推薦系統等，這也讓我們的努力更有價值。</p>
<p>最後，我們要感謝所有來自 Zilliz/Milvus 和 Merlin 以及 RAFT 團隊的人，是他們的努力造就了這項工作和這篇部落格文章。如果您有機會在您的 recsys 或其他工作流程中實作 Merlin 和 Milvus，我們期待您的回音。</p>
