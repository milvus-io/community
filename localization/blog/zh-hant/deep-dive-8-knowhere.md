---
id: deep-dive-8-knowhere.md
title: Milvus 向量資料庫的相似性搜尋功能為何？
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 不，不是費斯。
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者：<a href="https://github.com/cydrain">蔡玉東</a>，翻譯：<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>。</p>
</blockquote>
<p>作為核心向量執行引擎，Knowhere之於Milvus就如同引擎之於跑車。本文將介紹Knowhere是什麼，與Faiss有什麼不同，以及Knowhere的程式碼是如何結構化的。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Knowhere 的概念</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Milvus架構中的Knowhere</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere 與 Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">瞭解 Knowhere 程式碼</a></li>
<li><a href="#Adding-indexes-to-Knowhere">為Knowhere添加索引</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Knowhere的概念<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>狹義來說，Knowhere 是一個操作介面，用來存取系統上層的服務，以及系統下層的向量相似性搜尋函式庫，例如<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">Hnswlib</a>、<a href="https://github.com/spotify/annoy">Annoy</a>。此外，Knowhere 還負責異質運算。更明顯的是，Knowhere 可以控制使用何種硬體（例如 CPU 或 GPU）來執行索引建立與搜尋的請求。這就是 Knowhere 名字的由來 - 知道在哪裡執行作業。在未來的版本中，還將支援包括 DPU 和 TPU 在內的更多類型的硬體。</p>
<p>在更廣泛的意義上，Knowhere 也整合了其他第三方索引函式庫，例如 Faiss。因此，整體而言，Knowhere 被公認為 Milvus 向量資料庫的核心向量計算引擎。</p>
<p>從 Knowhere 的概念可以看出，它只處理資料運算任務，而像分片、負載平衡、災難恢復等任務都不在 Knowhere 的工作範圍內。</p>
<p>從 Milvus 2.0.1 開始，<a href="https://github.com/milvus-io/knowhere">Knowhere</a>（廣義上的<a href="https://github.com/milvus-io/knowhere">Knowhere</a>）將獨立於 Milvus 專案之外。</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Milvus架構中的Knowhere<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>Knowhere 架構</span> </span></p>
<p>Milvus 中的計算主要涉及向量和標量操作。Knowhere 只處理 Milvus 中向量的操作。上圖說明了 Milvus 中的 Knowhere 架構。</p>
<p>最底層是系統硬體。第三方索引庫在硬體之上。然後，Knowhere 透過 CGO 與上面的索引節點和查詢節點互動。</p>
<p>本文討論的是廣義上的 Knowhere，也就是架構圖中藍色框內標示的部分。</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere 與 Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere 不僅進一步擴展了 Faiss 的功能，還優化了性能。具體來說，Knowhere 有以下優點。</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1.支援 BitsetView</h3><p>最初，在 Milvus 中引入 bitset 是為了實現 「軟刪除 」的目的。軟刪除的向量仍然存在於資料庫中，但在向量相似性搜尋或查詢時不會被計算。bitset 中的每個 bit 對應一個索引向量。如果一個向量在 bitset 中被標記為 "1"，就表示這個向量是軟刪除的，在向量搜尋時不會涉及。</p>
<p>bitset 參數會加入 Knowhere 中所有外露的 Faiss 索引查詢 API，包括 CPU 和 GPU 索引。</p>
<p>進一步瞭解<a href="https://milvus.io/blog/2022-2-14-bitset.md">bitset 如何實現向量搜尋的多功能性</a>。</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2.支持更多的相似度指標來索引二進位向量</h3><p>除了<a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a>，Knowhere 還支援<a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>。Jaccard 和 Tanimoto 可以用來測量兩個樣本集之間的相似度，而 Superstructure 和 Substructure 可以用來測量化學結構的相似度。</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3.支援 AVX512 指令集</h3><p>Faiss 本身支援多種指令集，包括<a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>、<a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>、<a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>。Knowhere 進一步擴充支援的指令集，加入<a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a> 指令集，相較於 AVX2 指令集，可以<a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">提升 20% 到 30% 的索引建立與查詢效能</a>。</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4.自動選擇 SIMD 指令</h3><p>Knowhere 的設計是為了能在各種不同 SIMD 指令 (例如 SIMD SSE、AVX、AVX2 和 AVX512) 的 CPU 處理器 (包括企業內部平台和雲端平台) 上運作良好。因此，我們面臨的挑戰是：給予單一軟體二進位檔 (即 Milvus)，如何讓它在任何 CPU 處理器上自動調用適當的 SIMD 指令？Faiss 不支援自動選擇 SIMD 指令，使用者需要在編譯時手動指定 SIMD 標誌 (例如 "-msse4")。然而，Knowhere 是透過重構 Faiss 的程式碼來建立的。依賴 SIMD 加速的常見函數 (例如相似性運算) 會被析出。然後，每個函式都會有四個版本 (即 SSE、AVX、AVX2、AVX512) 來實作，並各自放入獨立的原始碼檔案。然後，這些原始碼檔案再以相對應的 SIMD 標誌單獨編譯。因此，在運行時，Knowhere 可以根據目前的 CPU 標誌自動選擇最適合的 SIMD 指令，然後再使用掛鉤（hooking）連結正確的函式指針。</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5.其他效能最佳化</h3><p>閱讀<a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a>了解更多關於 Knowhere 的效能優化。</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">瞭解 Knowhere 程式碼<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>如第一節所述，Knowhere 只處理向量搜尋操作。因此，Knowhere 只處理實體的向量場（目前，一個集合中的實體只支援一個向量場）。索引建立和向量相似性搜索也是針對段中的向量場。要更好地了解數據模型，請閱讀<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">這裡的</a>博客。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>實體欄位</span> </span></p>
<h3 id="Index" class="common-anchor-header">索引</h3><p>索引是一種獨立於原始向量資料的資料結構。索引需要四個步驟：建立索引、訓練資料、插入資料和建立索引。</p>
<p>對於某些人工智能應用程式而言，資料集訓練是一個獨立於向量搜尋的過程。在這類型的應用程式中，資料集的資料會先經過訓練，然後再插入像 Milvus 之類的向量資料庫中進行相似性搜尋。sift1M 和 sift1B 等開放資料集提供了訓練和測試的資料。然而，在 Knowhere 中，用於訓練和搜尋的資料是混合在一起的。也就是說，Knowhere 會先訓練一個區段中的所有資料，然後再插入所有訓練過的資料，並為它們建立索引。</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere 的代碼結構</h3><p>DataObj 是 Knowhere 中所有數據結構的基類。<code translate="no">Size()</code> 是 DataObj 中唯一的虛方法。Index類別繼承自DataObj，並有一個名為 &quot;size_&quot;的欄位。Index 類也有兩個虛擬方法 -<code translate="no">Serialize()</code> 和<code translate="no">Load()</code> 。從 Index 派生的 VecIndex 類是所有向量索引的虛擬基類。VecIndex 提供的方法包括<code translate="no">Train()</code>,<code translate="no">Query()</code>,<code translate="no">GetStatistics()</code>, 和<code translate="no">ClearStatistics()</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>基類</span> </span></p>
<p>其他索引類型列於上圖右方。</p>
<ul>
<li>Faiss 索引有兩個子類別：FaissBaseIndex 用於浮點向量上的所有索引，而 FaissBaseBinaryIndex 用於二進位向量上的所有索引。</li>
<li>GPUIndex 是所有 Faiss GPU 索引的基類。</li>
<li>OffsetBaseIndex 是所有自行開發索引的基類。索引檔案中只會儲存向量 ID。因此，128 維向量的索引檔案大小可以減少 2 個數量級。我們建議在使用這類型的索引進行向量相似性搜尋時，也要考慮到原始向量。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>技術上來說，<a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a>並非索引，而是用於暴力搜尋。向量插入向量資料庫時，不需要進行資料訓練和索引建立。搜尋將直接在插入的向量資料上進行。</p>
<p>然而，為了程式碼的一致性，IDMAP 也繼承自 VecIndex 類的所有虛擬介面。IDMAP 的用法與其他索引相同。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>IVF (倒置檔案) 索引是最常使用的索引。IVF 類源自 VecIndex 和 FaissBaseIndex，並進一步延伸至 IVFSQ 和 IVFPQ。GPUIVF 衍生自 GPUIndex 和 IVF。然後 GPUIVF 進一步延伸至 GPUIVFSQ 和 GPUIVFPQ。</p>
<p>IVFSQHybrid 是一個用於自行開發混合索引的類別，在 GPU 上以粗量化的方式執行。而桶中的搜尋則在 CPU 上執行。此類索引可利用 GPU 的運算能力，減少 CPU 與 GPU 之間的記憶體複製次數。IVFSQHybrid 的召回率與 GPUIVFSQ 相同，但效能較佳。</p>
<p>二進位索引的基類結構相對較簡單。BinaryIDMAP 和 BinaryIVF 是從 FaissBaseBinaryIndex 和 VecIndex 衍生出來的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>第三方索引</span> </span></p>
<p>目前，除了 Faiss 之外，只支援兩種第三方索引：樹狀索引 Annoy 和圖狀索引 HNSW。這兩種常用的第三方索引都是從 VecIndex 衍生出來的。</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">向Knowhere添加索引<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你想添加新的索引到Knowhere，你可以先參考現有的索引：</p>
<ul>
<li>要添加基於量化的索引，請參考 IVF_FLAT。</li>
<li>要添加基于图形的索引，请参考 HNSW。</li>
<li>若要新增樹狀索引，請參考 Annoy。</li>
</ul>
<p>參考現有索引後，您可以按照以下步驟在 Knowhere 中新增索引。</p>
<ol>
<li>在<code translate="no">IndexEnum</code> 中添加新索引的名稱。資料類型為字串。</li>
<li>在文件<code translate="no">ConfAdapter.cpp</code> 中為新索引添加數據驗證檢查。驗證檢查主要是驗證數據訓練和查詢的參數。</li>
<li>為新索引建立新檔案。新索引的基類應包括<code translate="no">VecIndex</code> ，以及<code translate="no">VecIndex</code> 必要的虛擬介面。</li>
<li>在<code translate="no">VecIndexFactory::CreateVecIndex()</code> 中加入新索引的索引建立邏輯。</li>
<li>在<code translate="no">unittest</code> 目錄下新增單元測試。</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於 Deep Dive 系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我們安排了這個 Milvus Deep Dive 系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
