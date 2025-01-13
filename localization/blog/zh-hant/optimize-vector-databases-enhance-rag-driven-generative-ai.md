---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: 優化向量資料庫，強化 RAG 驅動的生成式 AI
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: 在本文中，您將進一步瞭解向量資料庫及其基準架構、處理不同方面的資料集，以及用於效能分析的工具 - 開始最佳化向量資料庫所需的一切。
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>本篇文章最初發表於<a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">Intel 的 Medium 頻道</a>，經授權後在此轉載。</em></p>
<p><br></p>
<p>使用 RAG 時優化向量資料庫的兩種方法</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>照片來源：<a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a>on<a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>作者：Cathy Zhang 和 Malini Bhandaru 博士 撰稿人：Cathy Zhang 和 Malini Bhandaru 博士楊林和劉昌燕</p>
<p>生成式人工智能（GenAI）模型在我們的日常生活中得到了指數級的應用，它正在通過<a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">檢索增強生成（RAG）</a>得到改進，<a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">RAG</a> 是一種通過從外部來源獲取事實而用來增強回應準確性和可靠性的技術。RAG 可協助一般<a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">大型語言模型 (LLM) 瞭解</a>上下文，並利用以向量形式儲存的非結構化資料巨型資料庫來減少<a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">幻覺</a>- 向量是一種數學表達方式，可協助捕捉上下文和資料之間的關係。</p>
<p>RAG 有助於擷取更多的情境資訊，進而產生更好的回應，但其所依賴的向量資料庫卻越來越大，以提供豐富的內容可供利用。正如萬億個參數的 LLM 即將出現，數十億個向量的向量資料庫也不遠了。身為最佳化工程師，我們很想知道是否能讓向量資料庫的效能更高、載入資料的速度更快、建立索引的速度更快，以確保即使在新增資料時也能加快擷取速度。這樣做不僅可以減少使用者的等待時間，也可以讓基於 RAG 的 AI 解決方案更具持續性。</p>
<p>在這篇文章中，您將進一步瞭解向量資料庫及其基準架構、處理不同方面的資料集，以及用於效能分析的工具 - 開始最佳化向量資料庫所需的一切。我們也會分享我們在兩個熱門向量資料庫解決方案上的優化成果，以啟發您在效能與永續影響的優化之旅。</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">瞭解向量資料庫<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>傳統的關聯式或非關聯式資料庫是以結構化的方式儲存資料，向量資料庫則不同，它包含使用嵌入或轉換函數建構的個別資料項的數學表示，稱為向量。向量通常代表特徵或語意，可長可短。向量資料庫透過使用距離公制 (距離越近表示結果越相似) 的相似性搜尋來進行向量檢索，例如<a href="https://www.pinecone.io/learn/vector-similarity/">歐氏、點積或余弦相似性</a>。</p>
<p>為了加速檢索過程，向量資料會使用索引機制來組織。這些組織方法的範例包括平面結構、<a href="https://arxiv.org/abs/2002.09094">倒轉檔案 (IVF)、</a> <a href="https://arxiv.org/abs/1603.09320">層次導航小世界 (HNSW)</a>和<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">區域敏感散列 (LSH)</a> 等等。每種方法都有助於在需要時提高擷取相似向量的效率和效能。</p>
<p>讓我們來看看 GenAI 系統中如何使用向量資料庫。圖 1 說明如何將資料載入向量資料庫，以及如何在 GenAI 應用程式中使用資料庫。當您輸入您的提示時，它會經過一個與資料庫中向量產生過程相同的轉換過程。轉換後的向量提示會用來從向量資料庫中擷取相似的向量。這些擷取的項目基本上就像是會話記憶體，為提示提供上下文歷史，就像 LLM 運作的方式一樣。這項功能在自然語言處理、電腦視覺、推薦系統以及其他需要語意理解和資料比對的領域中特別有優勢。您的初始提示隨後會與擷取的元素「合併」，以提供上下文，並協助 LLM 根據所提供的上下文制定回應，而非僅依賴其原始訓練資料。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 1.RAG 應用程式架構。</p>
<p>向量的儲存與索引是為了快速檢索。向量資料庫主要分為兩種，一種是已擴充為儲存向量的傳統資料庫，另一種是專門為向量資料庫而設計的資料庫。提供向量支援的傳統資料庫有<a href="https://redis.io/">Redis</a>、<a href="https://github.com/pgvector/pgvector">pgvector</a>、<a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> 和<a href="https://opensearch.org/">OpenSearch</a>。專用向量資料庫的範例包括專屬解決方案<a href="https://zilliz.com/">Zilliz</a>和<a href="https://www.pinecone.io/">Pinecone</a>，以及開放原始碼專案<a href="https://milvus.io/">Milvus</a>、<a href="https://weaviate.io/">Weaviate</a>、<a href="https://qdrant.tech/">Qdrant</a>、<a href="https://github.com/facebookresearch/faiss">Faiss</a> 和<a href="https://www.trychroma.com/">Chroma</a>。您可以在 GitHub 上透過<a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>和<a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook 瞭解</a>更多關於向量資料庫的資訊。</p>
<p>我們將從 Milvus 和 Redis 這兩個類別中，各選出一個進行深入探討。</p>
<h2 id="Improving-Performance" class="common-anchor-header">提升效能<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解最佳化之前，讓我們先檢視向量資料庫的評估方式、一些評估框架，以及可用的效能分析工具。</p>
<h3 id="Performance-Metrics" class="common-anchor-header">效能指標</h3><p>讓我們來看看可以幫助您衡量向量資料庫效能的關鍵指標。</p>
<ul>
<li><strong>載入延遲</strong>測量將資料載入向量資料庫記憶體和建立索引所需的時間。索引是一種資料結構，用來根據相似性或距離有效地組織和擷取向量資料。<a href="https://milvus.io/docs/index.md#In-memory-Index">記憶體索引</a>的類型包括<a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">平面索引</a>、<a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>、<a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ、HNSW、</a> <a href="https://github.com/google-research/google-research/tree/master/scann">可擴展最近鄰 (ScaNN)</a>和<a href="https://milvus.io/docs/disk_index.md">DiskANN</a>。</li>
<li><strong>召回率 (Recall</strong>) 是指在搜尋演算法擷取的<a href="https://redis.io/docs/data-types/probabilistic/top-k/">前 K 項結果</a>中找到的真正匹配項目或相關項目所佔的比例。召回值越高，表示擷取到的相關項目越多。</li>
<li><strong>每秒查詢次數 (QPS)</strong>是向量資料庫能夠處理傳入查詢的速度。QPS 值越高，表示查詢處理能力和系統吞吐量越好。</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">基準架構</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 2.向量資料庫基準架構。</p>
<p>向量資料庫的基準測試需要向量資料庫伺服器和用戶端。在效能測試中，我們使用了兩種流行的開放原始碼工具。</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>：</strong>VectorDBBench 由 Zilliz 開發並開放源碼，可協助測試不同索引類型的向量資料庫，並提供方便的網頁介面。</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>：</strong>vector-db-benchmark 由 Qdrant 開發並開放源碼，有助於測試<a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>索引類型的幾個典型向量資料庫。它透過命令列執行測試，並提供<a href="https://docs.docker.com/compose/">Docker Compose</a>__file 以簡化啟動伺服器元件的程序。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 3.用於執行基準測試的 vector-db-benchmark 指令範例。</p>
<p>但基準框架只是等式的一部分。我們需要能鍛鍊向量資料庫解決方案本身不同面向的資料，例如處理大量資料的能力、各種向量大小，以及擷取速度。有了這些資料，讓我們來看看一些可用的公開資料集。</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">練習向量資料庫的開放資料集</h3><p>大型資料集是測試負載延遲和資源分配的好對象。有些資料集擁有高維數據，適合測試計算相似性的速度。</p>
<p>資料集的維度從 25 到 2048 不等。<a href="https://laion.ai/">LAION</a>資料集是一個開放的圖像集合，已被用來訓練非常大的視覺和語言深度神經模型，例如穩定的擴散生成模型。OpenAI 的資料集包含 5M 個向量，每個向量的維度為 1536，由 VectorDBBench 在<a href="https://huggingface.co/datasets/allenai/c4">原始資料</a>上執行 OpenAI 所建立。由於每個向量元素的類型都是 FLOAT，因此單單儲存向量就需要約 29 GB (5M * 1536 * 4) 的記憶體，再加上儲存索引和其他元資料所需的額外記憶體，總共需要 58 GB 的記憶體進行測試。使用 vector-db-benchmark 工具時，請確保有足夠的磁碟儲存空間來儲存結果。</p>
<p>為了測試負載延遲，我們需要大量的向量集合，而<a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a>可以提供。為了測試索引產生和相似性計算的效能，高維向量提供了更多壓力。為此，我們選擇了包含 1536 維向量的 500K 資料集。</p>
<h3 id="Performance-Tools" class="common-anchor-header">效能工具</h3><p>我們已經介紹了對系統施壓以辨識相關指標的方法，但讓我們檢視一下較低層次的情況：運算單元、記憶體消耗、鎖等待等的忙碌程度如何？這些提供了資料庫行為的線索，對於找出問題區域特別有用。</p>
<p>Linux<a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a>工具提供系統效能資訊。然而，Linux 中的<a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a>工具可以提供更深入的洞察力。若要瞭解更多資訊，我們也建議您閱讀<a href="https://www.brendangregg.com/perf.html">Linux perf 實例</a>和<a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">Intel 自上而下的微架構分析方法</a>。然而，另一個工具是<a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>，它不只是在最佳化應用程式時，也在最佳化系統效能與配置時非常有用，適用於跨越 HPC、雲端、物聯網、媒體、儲存等各種工作負載。</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvus 向量資料庫最佳化<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>我們試著改善 Milvus 向量資料庫的效能，以下是一些實例。</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">減少資料節點緩衝區寫入時的記憶體移動開銷</h3><p>Milvus 的寫入路徑代理透過<em>MsgStream</em> 將資料寫入日誌代理。然後，資料節點會消耗這些資料，將資料轉換並儲存成區段。分段會合併新插入的資料。合併邏輯會分配一個新的緩衝區，以同時儲存/移動舊資料和要插入的新資料，然後將新的緩衝區作為舊資料回傳給下一次資料合併。這會導致舊資料逐漸變大，進而導致資料移動速度變慢。Perf 檔案顯示此邏輯的開銷很高。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 4.在向量資料庫中合併和移動資料會產生高效能開銷。</p>
<p>我們改變了<em>合併緩衝區</em>的邏輯，直接將要插入的新資料追加到舊資料中，避免分配新緩衝區和移動大量舊資料。Perf 檔案證實這個邏輯沒有開銷。微碼指標<em>metric_CPU 作業頻率</em>和<em>metric_CPU 使用率</em>顯示，系統不再需要等待長時間的記憶體移動，這與改善情況相符。負載延遲改善了 60% 以上。<a href="https://github.com/milvus-io/milvus/pull/26839">GitHub 擷取</a>了這項改善。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>圖 5.在減少複製的情況下，我們看到負載延遲的效能改善超過 50%。</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">減少記憶體分配開銷的反向索引建置</h3><p>Milvus 搜尋引擎<a href="https://milvus.io/docs/knowhere.md">Knowhere</a> 採用<a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-means 演算法</a>來訓練群集資料，以建立<a href="https://milvus.io/docs/v1.1.1/index.md">倒置檔案 (IVF) 索引</a>。每輪資料訓練都定義了一個迭代次數。計數越大，訓練結果越好。不過，這也意味著 Elkan 演算法會被更頻繁地呼叫。</p>
<p>Elkan 演算法每次執行時，都會處理記憶體的分配和取消分配。具體來說，它會分配記憶體儲存對稱矩陣資料大小的一半，但不包括對角元素。在 Knowhere 中，Elkan 演算法使用的對稱矩陣維度設定為 1024，因此記憶體大小約為 2 MB。這意味著在每一輪訓練中，Elkan 會重複分配和取消分配 2 MB 記憶體。</p>
<p>Perf 剖析資料顯示頻繁的大記憶體分配活動。事實上，它觸發了<a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">虛擬記憶體區域 (VMA)</a>分配、實體頁面分配、頁面映射設定，以及更新內核中的記憶體 cgroup 統計資料。在某些情況下，這種大量記憶體分配/解除分配活動的模式也會加劇記憶體碎片。這是一項重大的稅收。</p>
<p><em>IndexFlatElkan</em>結構是為了支援 Elkan 演算法而特別設計與建構的。每個資料訓練過程都會初始化一個<em>IndexFlatElkan</em>實例。為了減輕 Elkan 演算法中頻繁的記憶體分配與取消分配所造成的效能影響，我們重整了程式碼邏輯，將記憶體管理移至 Elkan 演算法函式之外，並將其移至<em>IndexFlatElkan</em> 的建構過程中。这使得内存分配仅在初始化阶段发生一次，同时为当前数据训练过程中的所有后续 Elkan 算法函数调用提供服务，并有助于将加载延迟提高约 3%。<a href="https://github.com/zilliztech/knowhere/pull/280">請在此處</a>尋找<a href="https://github.com/zilliztech/knowhere/pull/280">Knowhere 修補程式</a>。</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">透過軟體預取加速 Redis 向量搜尋<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis 是一種流行的傳統記憶體內鍵值資料儲存，最近開始支援向量搜尋。為了超越典型的鍵值儲存，它提供了可擴充的模組；<a href="https://github.com/RediSearch/RediSearch">RediSearch</a>模組方便直接在 Redis 中儲存和搜尋向量。</p>
<p>對於向量相似性搜尋，Redis 支援兩種演算法，分別是暴力搜尋 (brute force) 和 HNSW。HNSW 演算法是特別為了在高維空間中有效率地找出近似近鄰而設計的。它使用一個名為<em>candidate_set</em>的優先順序佇列來管理所有向量候選人，以進行距離計算。</p>
<p>每個向量候選除了向量資料外，還包含大量的元資料。因此，當從記憶體載入候選向量時，可能會導致資料快取遺漏，造成處理延遲。我們的優化引入了軟體預取功能，在處理當前候選向量的同時，主動載入下一個候選向量。這項強化功能讓單例 Redis 設定中向量相似性搜尋的吞吐量提升了 2% 到 3%。該修補程式正在上傳中。</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">GCC 預設行為變更以防止混合組合程式碼罰則<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>為了驅動效能最大化，常用的程式碼區段通常會以組合方式手寫。然而，當不同的程式碼區段是由不同的人或在不同的時間寫成，所使用的指令可能來自不相容的組合指令集，例如<a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a>和<a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>。如果編譯不當，混合程式碼會導致效能下降。<a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">在此瞭解有關混合 Intel AVX 與 SSE 指令的更多資訊</a>。</p>
<p>您可以輕鬆判斷您是否使用混合模式的組合程式碼，且未使用<em>VZEROUPPER</em> 編譯程式碼，因而導致效能受損。可以透過 perf 指令來觀察，例如<em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;。</em>如果您的作業系統不支援此事件，請使用<em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>。</p>
<p>Clang 編譯器預設會插入<em>VZEROUPPER</em>，避免任何混合模式的懲罰。但是 GCC 編譯器只有在指定 -O2 或 -O3 編譯器旗標時才會插入<em>VZEROUPPER</em>。我們聯絡了 GCC 團隊並解釋了這個問題，現在他們預設會正確處理混合模式的匯編程式碼。</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">開始優化您的向量資料庫<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>向量資料庫在 GenAI 中扮演著不可或缺的角色，而且為了產生更高品質的回應，向量資料庫越來越大。在最佳化方面，AI 應用程式與其他軟體應用程式並無不同，只要使用標準效能分析工具以及基準架構和壓力輸入，就能揭露其秘密。</p>
<p>利用這些工具，我們發現了一些效能陷阱，包括不必要的記憶體分配、未預取指令，以及使用不正確的編譯器選項。基於我們的發現，我們對 Milvus、Knowhere、Redis 和 GCC 編譯器進行了上游增強，以幫助人工智慧更高效能和可持續發展。向量資料庫是值得您努力優化的重要應用程式類別。我們希望這篇文章能幫助您入門。</p>
