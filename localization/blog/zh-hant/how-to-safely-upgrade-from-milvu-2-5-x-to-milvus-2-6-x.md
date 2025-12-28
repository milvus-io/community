---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: 如何安全地從 Milvus 2.5.x 升級到 Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/Milvus_2_5_x_to_Milvus_2_6_x_cd2a5397fc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: 探索 Milvus 2.6 的新功能，包括架構變更和關鍵功能，並學習如何從 Milvus 2.5 執行滾動升級。
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a>已推出一段時間，事實證明這是專案向前邁進的穩健一步。這個版本帶來了精進的架構、更強的即時效能、更低的資源消耗，以及在生產環境中更精明的擴充行為。其中許多改進直接來自使用者的回饋意見，2.6.x 的早期使用者已報告在繁重或動態工作負載下，搜尋速度明顯加快，系統效能也更可預期。</p>
<p>對於正在執行 Milvus 2.5.x 並評估轉移至 2.6.x 的團隊而言，本指南是您的起點。它分解了架構上的差異，強調 Milvus 2.6 中引入的關鍵功能，並提供了一個實用的逐步升級路徑，旨在將操作中斷降至最低。</p>
<p>如果您的工作負載涉及即時管道、多模態或混合搜尋，或大型向量作業，本部落格將協助您評估 2.6 是否符合您的需求，如果您決定繼續升級，請放心升級，同時維持資料完整性與服務可用性。</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">從 Milvus 2.5 到 Milvus 2.6 的架構變更<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入了解升級工作流程之前，讓我們先了解 Milvus 2.6 的架構如何改變。</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Milvus 2.5 架構</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.5 架構</span> </span></p>
<p>在 Milvus 2.5 中，串流與批次工作流程交織在多個工作節點上：</p>
<ul>
<li><p><strong>QueryNode</strong>處理歷史查詢<em>和</em>增量（串流）<strong>查詢</strong>。</p></li>
<li><p><strong>資料節點 (DataNode</strong>) 則處理歷史資料的擷取時間沖洗<em>和</em>背景壓縮。</p></li>
</ul>
<p>這種批次與即時邏輯的混合，使得批次工作負載難以獨立擴充。這也意味著串流狀態分散在多個元件中，造成同步延遲、故障復原複雜化，並增加作業複雜度。</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Milvus 2.6 架構</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 2.6 架構</span> </span></p>
<p>Milvus 2.6 引入了專用的<strong>StreamingNode</strong>，處理所有即時資料責任：消耗訊息佇列、寫入增量區段、提供增量查詢，以及管理基於 WAL 的復原。在隔離了串流之後，其餘的元件就扮演了更乾淨、更專注的角色：</p>
<ul>
<li><p><strong>QueryNode</strong>現在<em>只</em>處理歷史區段的批次查詢。</p></li>
<li><p><strong>DataNode</strong>現在<em>只</em>處理歷史資料任務，例如壓縮和索引建立。</p></li>
</ul>
<p>StreamingNode 吸收了在 Milvus 2.5 中分拆在 DataNode、QueryNode 甚至 Proxy 之中的所有與串流相關的任務，使其更加清晰，並減少了跨角色的狀態共享。</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x：逐個元件比較</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>變更內容</strong></th></tr>
</thead>
<tbody>
<tr><td>協調器服務</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (或 MixCoord)</td><td style="text-align:center">混合協調</td><td style="text-align:center">元資料管理與任務排程合併為單一的 MixCoord，簡化協調邏輯並減少分散式的複雜性。</td></tr>
<tr><td>存取層</td><td style="text-align:center">代理</td><td style="text-align:center">代理層</td><td style="text-align:center">寫入要求只經由 Streaming Node 進行資料擷取。</td></tr>
<tr><td>工作節點</td><td style="text-align:center">-</td><td style="text-align:center">串流節點</td><td style="text-align:center">專用的串流處理節點，負責所有增量 (成長區段) 邏輯，包括：- 增量資料擷取- 增量資料查詢- 將增量資料持久化到物件儲存區- 基於串流的寫入- 基於 WAL 的故障復原</td></tr>
<tr><td></td><td style="text-align:center">查詢節點</td><td style="text-align:center">查詢節點</td><td style="text-align:center">批次處理節點，僅處理歷史資料的查詢。</td></tr>
<tr><td></td><td style="text-align:center">資料節點</td><td style="text-align:center">資料節點</td><td style="text-align:center">僅負責歷史資料的批次處理節點，包括壓縮和建立索引。</td></tr>
<tr><td></td><td style="text-align:center">索引節點</td><td style="text-align:center">-</td><td style="text-align:center">索引節點合併到資料節點，簡化角色定義和部署拓樸。</td></tr>
</tbody>
</table>
<p>簡而言之，Milvus 2.6 在串流與批次工作負載之間劃清界線，消除了 2.5 所見的跨元件糾纏，創造出更具擴充性、可維護性的架構。</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Milvus 2.6 功能重點<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>在進入升級工作流程之前，先快速瞭解 Milvus 2.6 所帶來的功能。<strong>此版本著重於降低基礎架構成本、改善搜尋效能，以及讓大型動態 AI 工作負載更容易擴充。</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">成本與效率改善</h3><ul>
<li><p><strong>主索引的</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>量化</strong>- 全新的 1 位元<strong>量化</strong>方法，可將向量索引壓縮至原始大小的<strong>1/32</strong>。結合 SQ8 reranking，可將記憶體使用量降低至 ~28%，QPS 提升 4 倍，並維持 ~95% 的召回率，大幅降低硬體成本。</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25 最佳化</strong></a><strong>全文檢索</strong>- 由稀疏術語權重向量提供原生 BM25 計分功能。與 Elasticsearch 相比，關鍵字搜尋的執行<strong>速度快 3-4 倍</strong>(某些資料集最高可達<strong>7 倍</strong>)，同時將索引大小維持在原始文字資料的三分之一左右。</p></li>
<li><p><strong>JSON Path 索引與 JSON Shredding</strong>- 嵌套式 JSON 的結構化篩選現在大幅提速，而且更可預測。預先索引的 JSON 路徑可將篩選延遲時間從<strong>140 毫秒</strong>減至<strong>1.5 毫秒</strong>(P99:<strong>480 毫秒</strong> <strong>→</strong> <strong>10 毫秒</strong>)，使混合向量搜尋 + 元資料篩選的反應速度大幅提升。</p></li>
<li><p><strong>擴充資料類型支援</strong>- 加入 Int8 向量類型、<a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">幾何</a>欄位 (POINT / LINESTRING / POLYGON) 以及結構陣列。這些擴充支援地理空間工作負載、更豐富的元資料建模，以及更簡潔的模式。</p></li>
<li><p><strong>針對部分更新的 Upsert</strong>- 現在您可以使用單一主鍵呼叫插入或更新實體。部分更新只修改所提供的欄位，減少寫入擴大，並簡化經常更新元資料或嵌入的管道。</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">搜尋與擷取增強功能</h3><ul>
<li><p><strong>改進的文字處理與多語言支援：</strong>新的 Lindera 和 ICU tokenizers 改善了日文、韓文和<a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">多語言</a>文字的處理。Jieba 現在支援自訂字典。<code translate="no">run_analyzer</code> 有助於調試標記化行為，而多語言分析器可確保一致的跨語言搜尋。</p></li>
<li><p><strong>高精度文字配對：</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">短語配對</a>強制執行有序短語查詢，並可設定斜率。新的<a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a>索引可加速 VARCHAR 欄位和 JSON 路徑上的子串和<code translate="no">LIKE</code> 查詢，實現快速的部分文字和模糊匹配。</p></li>
<li><p><strong>時間感知（Time-Aware）和元資料感知（Metadata-Aware）重排：</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Decay Rankers</a>(指數式、線性式、高斯式) 使用時間戳記調整分數；<a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Boost Rankers</a>應用元資料驅動的規則來提升或降低結果。兩者都有助於微調檢索行為，而無需變更您的基礎資料。</p></li>
<li><p><strong>簡化模型整合與自動矢量化：</strong>與 OpenAI、Hugging Face 及其他嵌入提供者的內建整合，可讓 Milvus 在插入與查詢作業期間自動向量化文字。一般使用個案不再需要手動嵌入管道。</p></li>
<li><p><strong>標量欄位的線上模式更新：</strong>無需停機或重新載入，即可在現有的資料集中新增標量欄位，隨著元資料需求的增加而簡化模式演進。</p></li>
<li><p><strong>MinHash 的近似重複檢測功能：</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a>+ LSH 可在大型資料集中有效率地偵測近乎重複的資料，而無需昂貴的精確比較。</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">架構與擴充性升級</h3><ul>
<li><p><strong>針對冷熱資料管理的</strong><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>分層儲存</strong></a> <strong>：</strong>透過 SSD 與物件儲存區分冷、熱資料；支援懶惰與部分載入；無需在本端完整載入資料集；降低資源使用率高達 50%，並加快大型資料集的載入時間。</p></li>
<li><p><strong>即時串流服務：</strong>新增與 Kafka/Pulsar 整合的專用串流節點，以進行連續擷取；可立即建立索引並提供查詢功能；針對即時、快速變化的工作負載，提高寫入吞吐量並加速故障復原。</p></li>
<li><p><strong>增強的擴充性與穩定性：</strong>Milvus 現在支援 100,000+ 個集合，適用於大型多租戶環境。基礎架構升級 -<a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a>(零磁碟 WAL)、<a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a>(降低 IOPS/記憶體) 及<a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a>- 可改善群集的穩定性，並可在繁重的工作負載下進行可預測的擴充。</p></li>
</ul>
<p>如需 Milvus 2.6 功能的完整清單，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 發行紀錄</a>。</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">如何從 Milvus 2.5.x 升級到 Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>為了在升級過程中盡可能保持系統的可用性，Milvus 2.5 集群應按照以下順序升級到 Milvus 2.6。</p>
<p><strong>1.先啟動串流節點</strong></p>
<p>提前啟動 Streaming Node。新的<strong>Delegator</strong>(查詢節點中負責處理串流資料的元件) 必須移到 Milvus 2.6 串流節點。</p>
<p><strong>2.升級 MixCoord</strong></p>
<p>將協調器元件升級為<strong>MixCoord</strong>。在這個步驟中，MixCoord 需要偵測 Worker Node 的版本，以便處理分散式系統內的跨版本相容性。</p>
<p><strong>3.升級查詢節點</strong></p>
<p>查詢節點的升級通常需要較長的時間。在這個階段，Milvus 2.5 資料節點和索引節點可以繼續處理 Flush 和索引建立等作業，有助於在查詢節點升級時減少查詢端的壓力。</p>
<p><strong>4.升級資料節點</strong></p>
<p>一旦 Milvus 2.5 DataNodes 離線，Flush 作業變得不可用，而 Growing Segments 中的資料可能會繼續累積，直到所有節點完全升級至 Milvus 2.6。</p>
<p><strong>5.升級代理伺服器</strong></p>
<p>將 Proxy 升級到 Milvus 2.6 後，Proxy 上的寫入作業將一直不可用，直到所有群集元件都升級到 2.6。</p>
<p><strong>6.移除索引節點</strong></p>
<p>當所有其他元件升級後，就可以安全地移除獨立的索引節點。</p>
<p><strong>注意事項：</strong></p>
<ul>
<li><p>從 DataNode 升級完成到 Proxy 升級完成，Flush 作業無法使用。</p></li>
<li><p>從第一個 Proxy 升級到所有 Proxy 節點升級為止，某些寫入作業不可用。</p></li>
<li><p><strong>當直接從 Milvus 2.5.x 升級到 2.6.6，由於 DDL 框架的變化，在升級過程中 DDL（數據定義語言）操作不可用。</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">如何使用 Milvus Operator 升級到 Milvus 2.6<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a>是一個開放原始碼的 Kubernetes 操作者，提供可擴充、高可用性的方式，在目標 Kubernetes 集群上部署、管理和升級整個 Milvus 服務堆疊。由 Operator 管理的 Milvus 服務堆疊包括</p>
<ul>
<li><p>Milvus 核心元件</p></li>
<li><p>所需的依賴項目，例如 etcd、Pulsar 和 MinIO</p></li>
</ul>
<p>Milvus Operator 遵循標準的 Kubernetes Operator 模式。它引入 Milvus 自訂資源 (CR)，描述 Milvus 叢集的理想狀態，例如版本、拓樸和配置。</p>
<p>控制器會持續監控群集，並將實際狀態與 CR 中定義的理想狀態進行協調。當進行變更（例如升級 Milvus 版本）時，操作員會以受控且可重複的方式自動套用這些變更，以實現自動升級和持續的生命週期管理。</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Milvus 自訂資源 (CR) 實例</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">使用 Milvus Operator 從 Milvus 2.5 滾動升級到 2.6</h3><p>Milvus Operator 提供內建支援，在群集模式下<strong>從 Milvus 2.5 滾動升級到 2.6</strong>，調整其行為以考量 2.6 中引入的架構變更。</p>
<p><strong>1.升級情境偵測</strong></p>
<p>在升級過程中，Milvus Operator 會根據叢集規格確定目標 Milvus 版本。其方法如下</p>
<ul>
<li><p>檢查<code translate="no">spec.components.image</code> 中定義的映像標籤，或</p></li>
<li><p>讀取在<code translate="no">spec.components.version</code></p></li>
</ul>
<p>然後，操作員將此所需版本與目前執行的版本（記錄在<code translate="no">status.currentImage</code> 或<code translate="no">status.currentVersion</code> 中）進行比較。如果目前版本為 2.5，而所需版本為 2.6，則操作員將此升級識別為 2.5 → 2.6 升級方案。</p>
<p><strong>2.滾動升級執行順序</strong></p>
<p>當偵測到 2.5 → 2.6 升級，且升級模式設定為滾動升級 (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code> ，這是預設值)，Milvus Operator 會自動按照與 Milvus 2.6 架構一致的預先定義的順序執行升級：</p>
<p>啟動串流節點 → 升級 MixCoord → 升級查詢節點 → 升級資料節點 → 升級代理 → 移除索引節點 3.</p>
<p><strong>3.自動整合協調器</strong></p>
<p>Milvus 2.6 以單一的 MixCoord 取代多個協調器元件。Milvus Operator 會自動處理此架構轉換。</p>
<p>當<code translate="no">spec.components.mixCoord</code> 設定完成後，操作員會調出 MixCoord 並等待它準備就緒。當 MixCoord 完全運作後，操作者會自動關閉傳統的協調器元件-RootCoord、QueryCoord 和 DataCoord-完成遷移，不需要任何手動介入。</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">從 Milvus 2.5 升級到 2.6 的步驟</h3><p>1.升級 Milvus Operator 到最新版本 (在本指南中，我們使用<strong>1.3.3 版本</strong>，這是撰寫本指南時的最新版本。)</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.合併協調器元件</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.確保叢集執行 Milvus 2.5.16 或更新版本</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.升級 Milvus 至 2.6 版</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">如何使用 Helm 升級到 Milvus 2.6<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 Helm 部署 Milvus 時，所有 Kubernetes<code translate="no">Deployment</code> 資源會平行更新，沒有保證的執行順序。因此，Helm 無法嚴格控制各元件的滾動升級順序。因此，對於生產環境，強烈建議使用 Milvus Operator。</p>
<p>Milvus 仍可使用 Helm 從 2.5 升級到 2.6，步驟如下。</p>
<p>系統需求</p>
<ul>
<li><p><strong>Helm 版本：</strong>≥ 3.14.0</p></li>
<li><p><strong>Kubernetes 版本: ≥</strong>1.20.0</p></li>
</ul>
<p>1.將 Milvus Helm 圖表升級至最新版本。在本指南中，我們使用<strong>圖表版本 5.0.7</strong>，這是撰寫本指南時的最新<strong>版本</strong>。</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.如果集群部署了多个协调器组件，首先将 Milvus 升级到 2.5.16 或更高版本，并启用 MixCoord。</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.將 Milvus 升級至版本 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Milvus 2.6 升級與作業常見問題集<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm vs. Milvus Operator - 我應該使用哪一個？</h3><p>對於生產環境，強烈建議使用 Milvus Operator。</p>
<p>詳情請參考官方指南<a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">：https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: 我該如何選擇訊息佇列 (MQ)？</h3><p>建議的 MQ 取決於部署模式和作業需求：</p>
<p><strong>1.獨立模式：</strong>對於成本敏感的部署，建議使用 RocksMQ。</p>
<p><strong>2.叢集模式</strong></p>
<ul>
<li><p><strong>Pulsar</strong>支援 multi-<strong>tenancy</strong>，允許大型集群共享基礎架構，並提供強大的水平擴展性。</p></li>
<li><p><strong>Kafka</strong>有更成熟的生態系統，在大多數主要的雲端平台上都有可管理的 SaaS 產品。</p></li>
</ul>
<p><strong>3.Woodpecker (Milvus 2.6 中引入)：</strong>Woodpecker 不需要外部訊息佇列，可降低成本和作業複雜度。</p>
<ul>
<li><p>目前僅支援嵌入式 Woodpecker 模式，此模式輕巧且易於操作。</p></li>
<li><p>對於 Milvus 2.6 獨立部署，建議使用 Woodpecker。</p></li>
<li><p>對於生產集群部署，一旦即將推出的 Woodpecker 集群模式可用，建議使用該模式。</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">問題 3：在升級過程中，訊息佇列可以切換嗎？</h3><p>目前不支援在升級過程中切換訊息佇列。未來版本將推出管理 API，支援在 Pulsar、Kafka、Woodpecker 和 RocksMQ 之間切換。</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4: Milvus 2.6需要更新速率限制配置嗎？</h3><p>不需要。現有的速率限制配置仍然有效，也適用於新的 Streaming Node。不需要變更。</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5: 協調器合併後，監控角色或配置會改變嗎？</h3><ul>
<li><p>監控角色維持不變 (<code translate="no">RootCoord</code>,<code translate="no">QueryCoord</code>,<code translate="no">DataCoord</code>)。</p></li>
<li><p>現有的組態選項繼續照常運作。</p></li>
<li><p>引入了新的配置選項<code translate="no">mixCoord.enableActiveStandby</code> ，如果沒有明確設定，則會回退到<code translate="no">rootcoord.enableActiveStandby</code> 。</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: StreamingNode 的建議資源設定為何？</h3><ul>
<li><p>對於輕度的即時擷取或偶爾的寫入與查詢工作負載，較小的配置（例如 2 個 CPU 核心和 8 GB 記憶體）已經足夠。</p></li>
<li><p>對於重度即時擷取或連續寫入與查詢工作負載，建議配置與查詢節點相若的資源。</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7: 如何升級使用 Docker Compose 的獨立部署？</h3><p>對於基於 Docker Compose 的獨立部署，只要更新<code translate="no">docker-compose.yaml</code> 中的 Milvus 映像標籤即可。</p>
<p>詳情請參考官方指南<a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">：https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a>。</p>
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
    </button></h2><p>Milvus 2.6 標誌著架構和作業的重大改進。透過引進 StreamingNode 來分離串流與批次處理、將協調器整合至 MixCoord，以及簡化工作人員角色，Milvus 2.6 為大型向量工作負載提供了更穩定、可擴充且更易於操作的基礎。</p>
<p>這些架構上的改變使得升級 (尤其是從 Milvus 2.5 升級) 變得更有秩序性。成功的升級取決於尊重元件的依賴性和臨時可用性限制。對於生產環境，Milvus Operator 是推薦的方法，因為它能自動進行升級排序並降低作業風險，而基於 Helm 的升級則更適合非生產使用個案。</p>
<p>Milvus 2.6 具備增強的搜尋功能、更豐富的資料類型、分層儲存和改良的訊息佇列選項，可支援需要即時擷取、高查詢效能和有效率的大規模作業的現代 AI 應用程式。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">更多關於 Milvus 2.6 的資源<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 發行紀錄</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Milvus 2.6 網路研討會錄音：更快的搜索、更低的成本和更智能的擴展</a></p></li>
<li><p>Milvus 2.6 功能部落格</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入功能：Milvus 2.6 如何簡化矢量化與語意搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus的JSON粉碎：靈活的JSON篩選速度提升88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 中新的結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">停止為冷冰冰的資料付費：Milvus 分層儲存中的隨選冷熱資料載入功能可降低 80% 的成本</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">在 Milvus 中引入 AISAQ：十億級向量搜尋在記憶體上的成本降低了 3,200 倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在 Milvus 中優化 NVIDIA CAGRA：GPU-CPU 混合方法可加快索引速度並降低查詢成本</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">介紹 Milvus Ngram 索引：為代理工作負載提供更快的關鍵字配對和 LIKE 查詢</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6 中的幾何字段與 RTREE 將地理空間篩選與向量搜尋結合在一起</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">現實世界中的矢量搜尋：如何有效篩選而不降低回復率</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks Lie - Vector DBs 值得真正的測試</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar，結果如何？</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器</a></p></li>
</ul></li>
</ul>
