---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: Elasticsearch 已死，詞法搜尋萬歲
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>現在，每個人都知道混合搜尋改善了<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（Retrieval-Augmented Generation）搜尋品質。雖然<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集嵌入式</a>搜尋在捕捉查詢與文件之間的深層語意關係方面已展現出令人印象深刻的能力，但它仍有明顯的限制。這些限制包括缺乏可說明性，以及在長尾查詢和罕見詞彙方面表現不佳。</p>
<p>許多 RAG 應用程式之所以舉步維艱，是因為預先訓練的模型往往缺乏特定領域的知識。在某些情況下，簡單的 BM25 關鍵字比對就能超越這些精密的模型。這就是混合式搜尋能夠彌補差距的地方，它結合了密集向量檢索的語意理解與關鍵字比對的精確度。</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">為什麼混合搜尋在生產中是複雜的<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然<a href="https://zilliz.com/learn/LangChain">LangChain</a>或<a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a>之類的框架可以輕鬆建立概念驗證混合式擷取，但要將大量資料集擴充至生產環境卻是一大挑戰。傳統的架構需要獨立的向量資料庫和搜尋引擎，導致幾個主要的挑戰：</p>
<ul>
<li><p>高昂的基礎架構維護成本與作業複雜性</p></li>
<li><p>跨多個系統的資料備援</p></li>
<li><p>資料一致性管理困難</p></li>
<li><p>跨系統的複雜安全性與存取控制</p></li>
</ul>
<p>市場需要一個統一的解決方案，在降低系統複雜度與成本的同時，支援詞彙與語意搜尋。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Elasticsearch 的痛點<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch 是過去十年來最具影響力的開放原始碼搜尋專案之一。它以 Apache Lucene 為基礎，透過高效能、可擴充性和分散式架構而廣受歡迎。雖然它在版本 8.0 中新增了向量 ANN 搜尋，但生產部署仍面臨幾項重大挑戰：</p>
<p><strong>高更新和索引成本：</strong>Elasticsearch 的架構並未將寫入作業、索引建立和查詢完全解耦。這導致在寫入作業期間，尤其是大量更新時，CPU 和 I/O 的開銷相當大。索引與查詢之間的資源爭用會影響效能，對於高頻率的更新情境造成重大瓶頸。</p>
<p><strong>即時效能差：</strong>身為「近即時」的搜尋引擎，Elasticsearch 在資料可視性方面引入了明顯的延遲。對於 Agent 系統等人工智能應用程式來說，這種延遲尤其成問題，因為在這些應用程式中，高頻率的互動和動態決策需要即時的資料存取。</p>
<p><strong>分片管理困難：</strong>雖然 Elasticsearch 使用分片來進行分散式架構，但分片管理卻是一大挑戰。缺乏動態分片支援造成了兩難的局面：小資料集的分片太多會導致效能不佳，而大型資料集的分片太少則會限制擴充性，並造成資料分佈不均。</p>
<p><strong>非雲端原生架構：</strong>Elasticsearch 是在雲原生架構盛行之前開發的，其設計將儲存與運算緊密結合，限制了其與現代基礎架構 (如公有雲和 Kubernetes) 的整合。資源擴充需要同時增加儲存與運算，降低了彈性。在多重複製情境中，每個分片都必須獨立建立索引，增加計算成本並降低資源效率。</p>
<p><strong>向量搜尋效能不佳：</strong>雖然 Elasticsearch 8.0 引入了向量 ANN 搜尋，但其效能遠遠落後於 Milvus 等專用向量引擎。以 Lucene 核心為基礎，其索引結構對於高維資料而言效率不彰，難以滿足大規模向量搜尋的需求。在涉及標量篩選和多租戶的複雜情況下，效能變得特別不穩定，使其難以支援高負載或多樣化的業務需求。</p>
<p><strong>過度的資源消耗：</strong>Elasticsearch 對記憶體和 CPU 的需求極高，尤其是在處理大型資料時。其 JVM 依賴性需要頻繁調整堆大小和垃圾回收調整，嚴重影響記憶體效率。向量搜尋作業需要密集的 SIMD 最佳化運算，而 JVM 環境對此並不理想。</p>
<p>這些基本限制會隨著組織擴充其人工智慧基礎架構而變得越來越成问题，使得 Elasticsearch 對於需要高效能與高可靠性的現代人工智慧應用程式而言，特別具有挑戰性。</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">引進 Sparse-BM25：重新想像詞法搜尋<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>以 2.4 版推出的混合搜尋功能為基礎，透過 Sparse-BM25 引進原生的詞彙搜尋支援。此創新方法包含下列關鍵元件：</p>
<ul>
<li><p>透過 Tantivy 進行進階標記化與預處理</p></li>
<li><p>分散式詞彙與詞彙頻率管理</p></li>
<li><p>使用語料庫 TF 和查詢 TF-IDF 產生稀疏向量</p></li>
<li><p>使用 WAND 演算法支援反索引（Block-Max WAND 和圖索引支援正在開發中）</p></li>
</ul>
<p>與 Elasticsearch 相比，Milvus 在演算法的靈活性上有顯著的優勢。它以向量距離為基礎的相似性計算，可進行更複雜的匹配，包括根據「端對端查詢詞彙加權」研究實作 TW-BERT（詞彙加權 BERT）。這種方法在域內和域外測試中都表現出優異的性能。</p>
<p>另一個關鍵優勢是成本效益。透過利用倒轉索引和密集嵌入壓縮，Milvus 在召回率降低不到 1% 的情況下，達到了五倍的效能提升。透過尾端剪枝和向量量化，記憶體使用量減少了 50% 以上。</p>
<p>長查詢最佳化是 Milvus 的一大優勢。傳統的 WAND 演算法在處理長時間查詢時相當吃力，而 Milvus 則能夠結合稀疏嵌入與圖表索引，在高維稀疏向量搜尋情況下提供十倍的效能提升。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus：RAG 的終極向量資料庫<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 功能全面，是 RAG 應用程式的首選。主要優勢包括</p>
<ul>
<li><p>具有動態模式功能和強大過濾選項的豐富元資料支援</p></li>
<li><p>企業級多租戶功能，可透過集合、分區和分區鍵靈活隔離</p></li>
<li><p>業界首創的磁碟向量索引支援，提供從記憶體到 S3 的多層儲存功能</p></li>
<li><p>雲端原生擴充能力支援從 10M 到 1B+ 向量的無縫擴充</p></li>
<li><p>全面的搜尋功能，包括群組、範圍和混合搜尋</p></li>
<li><p>與 LangChain、LlamaIndex、Dify 及其他 AI 工具的深度生態系統整合</p></li>
</ul>
<p>系統的多樣化搜尋功能包含群組、範圍和混合搜尋方法。與 LangChain、LlamaIndex 和 Dify 等工具的深度整合，以及對眾多 AI 產品的支援，讓 Milvus 成為現代 AI 基礎架構生態系統的中心。</p>
<h2 id="Looking-Forward" class="common-anchor-header">展望未來<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著人工智慧從 POC 過渡到生產，Milvus 將持續發展。我們專注於讓向量搜尋更容易使用且更具成本效益，同時提升搜尋品質。無論您是新創公司或企業，Milvus 都能降低 AI 應用程式開發的技術障礙。</p>
<p>這種對無障礙與創新的承諾，讓我們又向前邁進了一大步。雖然我們的開放原始碼解決方案仍是全球數以千計應用程式的基礎，但我們意識到許多組織需要一個完全管理的解決方案，以消除營運開銷。</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud：管理型解決方案<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>過去三年來，我們以 Milvus 為基礎，建立了全面管理的向量資料庫服務<a href="https://zilliz.com/cloud">Zilliz Cloud</a>。透過重新實作 Milvus 通訊協定的雲原生，它提供了更高的可用性、成本效益和安全性。</p>
<p>Zilliz Cloud 汲取了我們維護全球最大向量搜尋叢集和支援數以千計 AI 應用程式開發人員的經驗，與自行託管的解決方案相比，可大幅降低營運開銷和成本。</p>
<p>準備好體驗向量搜尋的未來了嗎？立即開始免費試用，最高可獲得 200 美元的點數，無需信用卡。</p>
