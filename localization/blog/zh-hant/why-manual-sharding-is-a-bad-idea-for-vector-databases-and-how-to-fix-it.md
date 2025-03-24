---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: 為什麼手動分片對於向量資料庫來說是個壞主意，以及如何修正它
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: 瞭解為何手動向量資料庫分片會產生瓶頸，以及 Milvus 的自動擴充如何消除工程開銷，實現無縫成長。
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_300b84a4d9.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"一家企業級 AI SaaS 創業公司的 CTO Alex 回憶說：<em>「我們最初在 pgvector 上建立語意搜尋，而不是 Milvus，因為我們所有的關聯性資料都已經在 PostgreSQL 上</em>。<em>Alex 回憶說：「但當我們的產品與市場契合時，我們的成長在工程方面遇到了嚴重的障礙。我們很快就發現 pgvector 並不是為了擴充性而設計的。簡單的任務，例如在多個分塊中推出模式更新，變成了乏味、容易出錯的流程，耗費了數天的工程努力。當我們的向量嵌入量達到 1 億個時，查詢延遲時間飆升至一秒以上，遠遠超出我們客戶所能忍受的範圍。轉移到 Milvus 之後，手動分片的感覺就像踏入石器時代。把分片伺服器當成易碎的藝術品來玩弄，一點都不好玩。任何公司都不應該忍受這種情況。</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">AI 公司面臨的共同挑戰<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>Alex 的經驗並不是 pgvector 使用者獨有的。無論您使用的是 pgvector、Qdrant、Weaviate 或其他依賴手動分片的向量資料庫，擴充的挑戰都是一樣的。一開始是可以管理的解決方案，但隨著資料量的增加，很快就變成了技術債務。</p>
<p>對現今的新創公司而言，<strong>擴充性並非可有可无，而是關鍵任務</strong>。這對於由大型語言模型 (Large Language Models, LLM) 和向量資料庫所驅動的人工智慧產品而言尤其如此，從早期採用到指數級成長的躍進可能在一夜之間發生。實現產品與市場的契合通常會引發使用者激增、資料流入量過大以及查詢需求暴增。但如果資料庫基礎架構跟不上，緩慢的查詢和低效率的作業就會阻礙動力，妨礙業務成功。</p>
<p>短期的技術決策可能會導致長期的瓶頸，迫使工程團隊不斷處理緊急的效能問題、資料庫崩潰和系統故障，而無法專注於創新。最糟糕的情況是什麼？昂貴且耗時的資料庫重新架構，而這正是公司應該擴充規模的時候。</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Sharding 不正是擴充性的自然解決方案嗎？<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>擴充性可以用多種方式來解決。最直接的方法是<strong>擴充</strong>，包括透過增加 CPU、記憶體或儲存來增強單一機器的資源，以容納不斷成長的資料量。這種方法雖然簡單，但有明顯的限制。舉例來說，在 Kubernetes 環境中，大型 Pod 的效率很低，而且依賴單一節點也會增加故障風險，可能導致嚴重的停機時間。</p>
<p>當 Scaling Up 不再可行時，企業自然會轉向<strong>Scaling Out</strong>，將資料分散到多台伺服器上。乍看之下，<strong>分片</strong>似乎是一個簡單的解決方案 - 將資料庫分割成較小的、獨立的資料庫，以增加容量並啟用多個可寫入的主要節點。</p>
<p>然而，雖然概念上簡單直接，但實際上分片很快就變成複雜的挑戰。大多數應用程式最初都是設計為使用單一、統一的資料庫。當向量資料庫被分割成多個分片時，應用程式中與資料互動的每個部分都必須修改或完全重寫，這將帶來顯著的開發開銷。設計有效的分片策略變得非常重要，實施路由邏輯以確保資料被導向到正確的分片也是如此。跨多個分片管理原子事務通常需要重組應用程式，以避免跨分片作業。此外，還必須從容處理故障情況，以防止某些分片無法使用時發生中斷。</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">為什麼手動分片會成為負擔？<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>「我們最初估計，為 pgvector 資料庫實施手動分片需要花費兩位工程師約六個月的時間，」</em>Alex 回憶道<em>，</em> <em>&quot;我們沒想到的是，這些工程</em> <strong><em>師總是</em></strong> <em>需要的</em>。<em>每次模式變更、資料重新平衡作業或擴充決策都需要他們的專業知識。為了維持資料庫的運行，我們基本上承諾要成立一個永久性的「分片團隊」。</em></p>
<p>分片向量資料庫在現實世界中面臨的挑戰包括</p>
<ol>
<li><p><strong>資料分佈失衡（熱點）</strong>：在多租戶使用案例中，每個租戶的資料分佈範圍可能從數百到數十億向量不等。這種不平衡會產生熱點，某些分片會超載，而其他分片則閒置。</p></li>
<li><p><strong>令人頭痛的重新分片問題</strong>：選擇適當數量的分片幾乎是不可能的。太少會導致頻繁而昂貴的重新分片作業。太多則會產生不必要的元資料開銷，增加複雜性並降低效能。</p></li>
<li><p><strong>模式變更的複雜性</strong>：許多向量資料庫透過管理多個底層資料庫來實施分片。這使得在分片間同步模式變更變得麻煩且容易出錯，拖慢開發週期。</p></li>
<li><p><strong>資源浪費</strong>：在儲存與運算耦合的資料庫中，您必須仔細地在每個節點上分配資源，同時預測未來的成長。通常，當資源使用率達到 60-70%，您就需要開始規劃重新分片。</p></li>
</ol>
<p>簡而言之，<strong>手動管理分片對您的業務不利</strong>。與其將您的工程團隊鎖定在持續的分片管理上，不如考慮投資設計可自動擴充的向量資料庫，而無需承擔作業負擔。</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Milvus 如何解決可擴充性問題<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>許多開發人員 - 從初創公司到企業 - 都已意識到手動資料庫分片所帶來的巨大開銷。Milvus 採用了根本不同的方法，能夠無縫擴充從數百萬到數十億的向量，而無需複雜性。</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">自動化擴充，免除技術債務</h3><p>Milvus 利用 Kubernetes 和分散式儲存運算架構，支援無縫擴充。此設計可</p>
<ul>
<li><p>快速擴充以因應不斷變化的需求</p></li>
<li><p>自動平衡所有可用節點的負載</p></li>
<li><p>獨立的資源分配，讓您可以分別調整運算、記憶體和儲存設備</p></li>
<li><p>即使在快速成長期間，也能維持穩定的高效能</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">分佈式架構從底層開始設計</h3><p>Milvus 透過兩項關鍵創新，實現其擴充能力：</p>
<p><strong>以區段為基礎的架構：</strong>Milvus 的核心是將資料組織為「區段」 - 資料管理的最小單位：</p>
<ul>
<li><p>成長中的區段駐留在 StreamNodes 上，為即時查詢優化資料的新鮮度。</p></li>
<li><p>封閉區段由 QueryNodes 管理，利用強大的索引加速搜尋</p></li>
<li><p>這些區段均勻地分佈在節點上，以優化並行處理</p></li>
</ul>
<p><strong>雙層路由</strong>：不同於傳統資料庫的每個分塊都存在於單一電腦上，Milvus 將一個分塊中的資料動態地分佈在多個節點上：</p>
<ul>
<li><p>每個分片可儲存超過 10 億個資料點</p></li>
<li><p>每個分片內的區段會自動在各台機器上達到平衡</p></li>
<li><p>擴充集合就像增加分片數量一樣簡單</p></li>
<li><p>即將推出的 Milvus 3.0 將會引入動態分片功能，甚至連這個最基本的手動步驟都可以省去。</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">大規模的查詢處理</h3><p>執行查詢時，Milvus 遵循高效率的流程：</p>
<ol>
<li><p>代理為要求的集合識別相關的分片</p></li>
<li><p>代理從 StreamNodes 和 QueryNodes 收集資料</p></li>
<li><p>StreamNodes 處理即時資料，QueryNodes 同時處理歷史資料</p></li>
<li><p>彙總結果並傳送給使用者</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">與眾不同的工程體驗<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>"當可擴充性建構在資料庫本身時，所有這些令人頭痛的問題就......消失了，」</em>Alex 在回想他的團隊轉換到 Milvus 的過程時說。<em>"我的工程師們重新開始建立客戶喜愛的功能，而不是照看資料庫碎片。</em></p>
<p>如果您正在努力解決手動分片的工程負擔、擴展時的效能瓶頸，或是資料庫遷移的艱鉅前景，是時候重新思考您的方法了。請造訪我們的<a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">說明文件頁面</a>，瞭解更多關於 Milvus 架構的資訊，或造訪<a href="https://zilliz.com/cloud">zilliz.com/cloud</a> 網站，親身體驗全面管理的 Milvus 不費吹灰之力的可擴展性。</p>
<p>有了正確的向量資料庫基礎，您的創新將不受限制。</p>
