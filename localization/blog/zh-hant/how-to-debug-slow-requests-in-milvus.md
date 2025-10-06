---
id: how-to-debug-slow-requests-in-milvus.md
title: 如何在 Milvus 中調試緩慢的搜尋請求
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: 在這篇文章中，我們將分享如何在 Milvus 中分流緩慢的請求，並分享您可以採取的實用步驟，以保持延遲的可預測性、穩定性和持續低延遲。
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>性能是 Milvus 的核心。在正常情況下，Milvus 的搜尋要求只需幾毫秒即可完成。但是，當您的集群變慢時，搜尋延遲延長到幾秒鐘時，會發生什麼情況？</p>
<p>搜尋速度慢的情況並不常發生，但在規模較大或工作負載較複雜的情況下，搜尋速度慢的問題就會浮現。一旦發生，就很重要：它們會破壞使用者體驗、影響應用程式效能，並經常暴露您設定中隱藏的低效率。</p>
<p>在這篇文章中，我們將介紹如何在 Milvus 中分流緩慢的請求，並分享您可以採取的實用步驟，以保持可預測、穩定和持續的低延遲。</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">識別緩慢的搜尋<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>診斷緩慢的請求始於兩個問題：<strong>它發生的頻率和時間的去向？</strong>Milvus 通過度量和日誌為您提供這兩個答案。</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvus 指標</h3><p>Milvus 輸出詳細的指標，您可以在 Grafana 面板中監控。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>主要面板包括</p>
<ul>
<li><p><strong>服務品質 → 慢速查詢</strong>：標記任何超過 proxy.slowQuerySpanInSeconds (預設：5s) 的要求。這些也會在 Prometheus 中標記。</p></li>
<li><p><strong>服務品質 → 搜尋延遲</strong>：顯示整體延遲分佈。如果這看起來正常，但終端使用者仍看到延遲，則問題很可能出在 Milvus 外部 - 網路或應用程式層。</p></li>
<li><p><strong>查詢節點 → 搜尋階段延遲</strong>：將延遲分成佇列、查詢和減少階段。若要深入歸因，<em>Scalar</em> <em>Filter Latency</em>、<em>Vector Search Latency</em> 和<em>Wait tSafe Latency 等</em>面板可揭示哪個階段佔優。</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvus 日誌</h3><p>Milvus 也會記錄任何持續超過一秒的要求，並標示 [Search slow] 等標記。這些日誌顯示<em>哪些</em>查詢速度較慢，補充度量指標的洞察力。作為經驗法則：</p>
<ul>
<li><p><strong>&lt; 30 毫秒</strong>→ 在大多數情況下都是健康的搜尋延遲</p></li>
<li><p><strong>&gt; 100 毫秒</strong>→ 值得研究</p></li>
<li><p><strong>&gt; 1 秒</strong>→ 絕對緩慢，需要注意</p></li>
</ul>
<p>日誌範例：</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>簡而言之，<strong>度量指標會告訴您時間的去向；日誌則會告訴您哪些查詢被命中。</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">分析根本原因<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">繁重的工作量</h3><p>造成請求緩慢的常見原因是工作量過大。當一個請求有非常大的<strong>NQ</strong>（每個請求的查詢次數）時，它可能會運行一段很長的時間，壟斷查詢節點的資源。其他請求會堆疊在它的後面，導致佇列延遲上升。即使每個請求的 NQ 都很小，非常高的整體吞吐量 (QPS) 仍會造成相同的效果，因為 Milvus 可能會在內部合併並發的搜尋請求。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的信號</strong></p>
<ul>
<li><p>所有查詢都顯示出乎意料的高延遲。</p></li>
<li><p>查詢節點指標報告高<strong>等待中延遲</strong>。</p></li>
<li><p>日誌顯示請求的 NQ 較大、總持續時間較長，但每 NQ 持續時間相對較小，表示一個過大的請求正在支配資源。</p></li>
</ul>
<p><strong>如何解決：</strong></p>
<ul>
<li><p><strong>批次查詢</strong>：保持適度的 NQ 以避免單一要求負荷過重。</p></li>
<li><p><strong>縮小查詢節點的規模</strong>：如果高併發是您工作負載的常規部分，請增加查詢節點以分散負載並維持低延遲。</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">過濾效率低</h3><p>另一個常見的瓶頸來自於低效率的篩選器。如果篩選表達方式不佳或欄位缺乏標量索引，Milvus 可能會退回到<strong>完整掃描</strong>，而不是掃描一個小的、有目標的子集。JSON 過濾器和嚴格的一致性設定會進一步增加開銷。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的訊號：</strong></p>
<ul>
<li><p>查詢節點指標中的<strong>高標</strong>量值<strong>篩選器延遲</strong>。</p></li>
<li><p>只有在套用篩選器時才會出現明顯的延遲尖峰。</p></li>
<li><p>如果啟用了嚴格一致性，則<strong>等待 tSafe</strong>延遲較長。</p></li>
</ul>
<p><strong>如何修正：</strong></p>
<ul>
<li><strong>簡化篩選表達式</strong>：透過最佳化篩選器來降低查詢計畫複雜度。例如，以 IN 表達式取代長 OR 鏈：</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus 還引入了篩選表達式模板化機制，旨在通過減少解析複雜表達式所花的時間來提高效率。詳情請參閱<a href="https://milvus.io/docs/filtering-templating.md">本文件</a>。</p></li>
<li><p><strong>加入適當的索引</strong>：在篩選器使用的欄位上建立標量索引，避免完全掃描。</p></li>
<li><p><strong>有效率地處理 JSON</strong>：Milvus 2.6 為 JSON 欄位引入了路徑索引和平面索引，使 JSON 資料的處理更有效率。JSON 切碎也在進一步改善效能的<a href="https://milvus.io/docs/roadmap.md">路線圖上</a>。如需其他資訊，請參閱<a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">JSON 欄位文件</a>。</p></li>
<li><p><strong>調整一致性層級</strong>：當不需要嚴格保證時，使用<em>Bounded</em>或<em>Eventually</em>一致性讀取，減少<em>tSafe</em>等待時間。</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">向量索引選擇不當</h3><p><a href="https://milvus.io/docs/index-explained.md">向量索引</a>並非萬應靈丹。選擇錯誤的索引會嚴重影響延遲。記憶體索引可提供最快的效能，但會消耗較多記憶體，而磁碟索引則會以速度為代價來節省記憶體。二進位向量也需要專門的索引策略。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的訊號：</strong></p>
<ul>
<li><p>查詢節點指標中的向量搜尋延遲過高。</p></li>
<li><p>使用 DiskANN 或 MMAP 時，磁碟 I/O 飽和。</p></li>
<li><p>由於快取記憶體冷啟動，重新啟動後立即出現較慢的查詢速度。</p></li>
</ul>
<p><strong>如何解決</strong></p>
<ul>
<li><p><strong>使索引與工作負載相匹配（浮動向量）：</strong></p>
<ul>
<li><p><strong>HNSW</strong>- 最適合具有高召回率和低延遲的記憶體用例。</p></li>
<li><p><strong>IVF 系列</strong>- 可靈活權衡召回率與速度。</p></li>
<li><p><strong>DiskANN</strong>- 支援十億規模的資料集，但需要強大的磁碟頻寬。</p></li>
</ul></li>
<li><p><strong>對於二進位向量</strong>使用<a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSH 索引</a>(Milvus 2.6 中引入) 與 MHJACCARD 公制，以有效地近似 Jaccard 相似度。</p></li>
<li><p><strong>啟用</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>：將索引檔案映射到記憶體中，而不是讓它們完全駐留，以在延遲和記憶體使用率之間取得平衡。</p></li>
<li><p><strong>調整索引/搜尋參數</strong>：針對您的工作負載調整設定，以平衡召回與延遲。</p></li>
<li><p><strong>減少冷啟動</strong>：在重新啟動後預熱經常存取的區段，以避免初始查詢速度變慢。</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">執行時間與環境條件</h3><p>並非所有的慢速查詢都是由查詢本身造成的。查詢節點通常會與背景工作 (例如壓縮、資料遷移或索引建立) 共用資源。頻繁的上插會產生許多未索引的小區段，迫使搜尋掃描原始資料。在某些情況下，特定版本的低效率也會造成延遲，直到修補好為止。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>需要注意的訊號：</strong></p>
<ul>
<li><p>背景作業 (壓縮、移轉、索引建立) 期間 CPU 使用量激增。</p></li>
<li><p>影響查詢效能的磁碟 I/O 飽和。</p></li>
<li><p>重新啟動後緩慢的快取預熱。</p></li>
<li><p>大量未編入索引的小區段（來自頻繁的上傳）。</p></li>
<li><p>與特定 Milvus 版本相關的延遲退步。</p></li>
</ul>
<p><strong>如何修正：</strong></p>
<ul>
<li><p>將<strong>背景工作</strong>(例如壓縮)<strong>重新排程</strong>至非繁忙時間。</p></li>
<li><p><strong>釋放未使用的集合</strong>以釋放記憶體。</p></li>
<li><p><strong>考慮</strong>重新啟動後的<strong>預熱時間</strong>；必要時預熱快取記憶體。</p></li>
<li><p><strong>批次上載</strong>以減少建立微小區段，並讓壓縮跟上。</p></li>
<li><p><strong>保持最新</strong>：升級到較新的 Milvus 版本，以獲得錯誤修正和最佳化。</p></li>
<li><p><strong>提供資源</strong>：將額外的 CPU/記憶體專用於對延遲敏感的工作負載。</p></li>
</ul>
<p>透過將每個訊號與正確的動作相匹配，大部分緩慢的查詢都可以快速且可預測地解決。</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">防止緩慢查詢的最佳作法<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>最好的除錯階段是您永遠不需要執行的階段。根據我們的經驗，幾個簡單的習慣對於防止 Milvus 的緩慢查詢有很大的幫助：</p>
<ul>
<li><p><strong>規劃資源分配</strong>，避免 CPU 和磁碟爭用。</p></li>
<li><p>針對故障和延遲高峰<strong>設定主動警示</strong>。</p></li>
<li><p><strong>保持篩選表達式</strong>短小、簡單且有效率。</p></li>
<li><p><strong>批次上載</strong>並將 NQ/QPS 維持在可持續的水平。</p></li>
<li><p><strong>索引篩選器</strong>中使用的<strong>所有欄位</strong>。</p></li>
</ul>
<p>在 Milvus 中，查詢速度慢的情況非常罕見，而且一旦出現，通常都有明確、可診斷的原因。利用度量、日誌和結構化的方法，您可以快速找出並解決問題。我們的支援團隊每天都在使用這本指南，現在您也可以使用了。</p>
<p>我們希望這份指南不僅提供疑難排解的架構，也讓您有信心保持 Milvus 工作負載順暢、有效率地運作。</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡想要深入瞭解？<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>加入<a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a>，提出問題、分享經驗，並從社群中學習。</p></li>
<li><p>註冊我們的<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus 辦公時間</strong></a>，直接與團隊對話，並在您的工作負荷上獲得實際協助。</p></li>
</ul>
