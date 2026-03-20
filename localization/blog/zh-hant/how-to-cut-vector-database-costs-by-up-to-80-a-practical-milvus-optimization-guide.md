---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: 如何將向量資料庫成本降低高達 80%：實用的 Milvus 優化指南
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: Milvus 是免費的，但基礎架構卻不是。了解如何利用更好的索引、MMap 和分層儲存，將向量資料庫記憶體成本降低 60-80%。
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>您的 RAG 原型運作得很好。然後投入生產，流量增加，現在您的向量資料庫帳單從每月 500 美元增加到 5,000 美元。聽起來很熟悉吧？</p>
<p>這是目前 AI 應用程式中最常見的擴充問題之一。您所建立的東西能創造真正的價值，但基礎架構成本的成長速度卻比您的使用者人數成長速度還快。當您查看帳單時，向量資料庫往往是最大的驚喜 - 在我們所見過的部署中，它可能佔應用程式總成本的 40-50%，僅次於 LLM API 呼叫。</p>
<p>在這份指南中，我將闡述資金的實際去向，以及您可以降低成本的具體方法 - 在許多情況下可降低 60-80%。我將以最流行的開源向量資料庫<a href="https://milvus.io/">Milvus</a> 為主要範例，因為這是我最熟悉的資料庫，但這些原則也適用於大多數的向量資料庫。</p>
<p><em>要澄清的是：</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>本身是免費且開放原始碼的 - 您從未為軟體付過錢。成本完全來自於您運行它的基礎架構：雲端實例、記憶體、儲存和網路。好消息是，大部分的基礎架構成本都可以降低。</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">使用 VectorDB 時，錢到底去哪了？<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們從一個具體的例子開始。假設您有 1 億個向量，768 個維度，以 float32 儲存，這是相當典型的 RAG 設定。以下是每月在 AWS 上的大致成本：</p>
<table>
<thead>
<tr><th><strong>成本組成</strong></th><th><strong>分享</strong></th><th><strong>~每月成本</strong></th><th><strong>備註</strong></th></tr>
</thead>
<tbody>
<tr><td>運算 (CPU + 記憶體)</td><td>85-90%</td><td>$2,800</td><td>主要由記憶體驅動</td></tr>
<tr><td>網路</td><td>5-10%</td><td>$250</td><td>跨 AZ 流量、大型結果有效負載</td></tr>
<tr><td>儲存</td><td>2-5%</td><td>$100</td><td>便宜 - 物件儲存 (S3/MinIO) ~$0.03/GB</td></tr>
</tbody>
</table>
<p>我們得到的啟示很簡單：記憶體是您 85-90% 的資金來源。網路和儲存在邊際上很重要，但如果您想要大幅降低成本，記憶體就是槓桿。本指南中的所有內容都著重於此。</p>
<p><strong>有關網路和儲存設備的快速說明：</strong>您可以只傳回需要的欄位 (ID、分數、關鍵元資料) 並避免跨區域查詢，以降低網路成本。在儲存方面，Milvus 已經將儲存與運算分開 - 您的向量存放在 S3 之類的廉價物件儲存中，因此即使有 100M 的向量，儲存成本通常也低於 50 美元/月。這兩種方式都無法像記憶體最佳化一樣達到預期效果。</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">為什麼向量搜尋的記憶體如此昂貴？<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您來自傳統資料庫，向量搜尋對記憶體的需求可能會令人驚訝。關聯式資料庫可以利用磁碟的 B-tree 索引和作業系統的頁面快取。向量搜尋則不同，它涉及大量浮點運算，而 HNSW 或 IVF 等索引需要持續載入記憶體，以提供毫秒級的延遲。</p>
<p>以下是估算記憶體需求的快速公式：</p>
<p><strong>所需記憶體 = (向量 × 尺寸 × 4 位元組) × 索引乘數</strong></p>
<p>以我們使用 HNSW 的 100M × 768 × float32 為例 (乘數 ~1.8 倍)：</p>
<ul>
<li>原始資料：100M × 768 × 4 位元組 ≈ 307 GB</li>
<li>使用 HNSW 索引：307 GB × 1.8 ≈ 553 GB</li>
<li>加上作業系統開銷、快取和餘量：總計 ~768 GB</li>
<li>在 AWS 上：3× r6i.8xlarge (每個 256 GB) ≈ $2,800/month</li>
</ul>
<p><strong>這是基線。現在讓我們看看如何降低價格。</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1.選擇正確的索引以減少 4 倍的記憶體使用量<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>這是您可以做出的影響最大的單一變更。對於相同的 100M 向量資料集，記憶體使用量可能相差 4-6 倍，這取決於您所選擇的索引。</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>：幾乎沒有壓縮，因此記憶體使用量接近原始資料大小，約<strong>300 GB</strong>。</li>
<li><strong>HNSW</strong>：儲存一個額外的圖形結構，因此記憶體使用量通常是原始資料大小的<strong>1.5 到 2.0 倍</strong>，或約<strong>450 到 600 GB</strong>。</li>
<li><strong>IVF_SQ8</strong>：將 float32 值壓縮為 uint8，<strong>壓縮率</strong>約為<strong>4 倍</strong>，因此記憶體使用量可降至約<strong>75 到 100 GB。</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>：使用更強的壓縮或基於磁碟的索引，因此記憶體使用量可進一步降至約<strong>30 到 60 GB。</strong></li>
</ul>
<p>許多團隊一開始使用 HNSW，因為它有最好的查詢速度，但結果卻要多付 3-5 倍的費用。</p>
<p>以下是主要索引類型的比較：</p>
<table>
<thead>
<tr><th><strong>索引</strong></th><th><strong>記憶體倍數</strong></th><th><strong>查詢速度</strong></th><th><strong>回復率</strong></th><th><strong>最適合</strong></th></tr>
</thead>
<tbody>
<tr><td>扁平</td><td>~1.0x</td><td>慢速</td><td>100%</td><td>小型資料集（&lt;1M），測試</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>中</td><td>95-99%</td><td>一般用途</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>中型</td><td>93-97%</td><td>成本敏感型生產（推薦）</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>快速</td><td>70-80%</td><td>超大資料集、粗略檢索</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>非常快</td><td>98-99%</td><td>僅當延遲比成本更重要時</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>中等</td><td>95-98%</td><td>使用 NVMe SSD 的超大規模</td></tr>
</tbody>
</table>
<p><strong>底線：</strong>從 HNSW 或 IVF_FLAT 轉換為 IVF_SQ8，召回率通常只下降 2-3%（例如，從 97% 降為 94-95%），而記憶體成本則降低約 70%。對於大多數 RAG 工作負載而言，這樣的折衷是絕對值得的。如果您正在進行粗略檢索，或是您的準確度標準較低，IVF_PQ 或 IVF_RABITQ 可以進一步提高節省成本。</p>
<p><strong>我的建議：</strong>如果您要在生產中運行 HNSW，而成本又是一個考慮因素，請先在測試資料集中嘗試使用 IVF_SQ8。測量實際查詢的召回率。大多數團隊都會驚訝於精確度的下降幅度有多小。</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2.停止將所有資料載入記憶體，以降低 60%-80% 的成本<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>即使選擇了更有效率的索引，您記憶體中的資料仍可能多於所需。Milvus 提供了兩種方法來解決這個問題：<strong>MMap (自 2.3 起可用) 和分層儲存 (自 2.6 起可用)。兩者都可以減少 60-80% 的記憶體使用量。</strong></p>
<p>兩者背後的核心理念是相同的：並非所有資料都需要一直存在記憶體中。差別在於它們如何處理不在記憶體中的資料。</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (記憶體映射檔案)</h3><p>MMap 將您的資料檔案從本機磁碟映射到進程位址空間。完整的資料集會保留在節點的本機磁碟上，而作業系統只會在有需要時才將頁面載入記憶體。在使用 MMap 之前，所有資料都會從物件儲存空間 (S3/MinIO) 下載到 QueryNode 的本機磁碟。</p>
<ul>
<li>記憶體使用量下降至全載模式的 ~10-30</li>
<li>延遲保持穩定且可預測 (資料在本機磁碟上，無需透過網路取得)</li>
<li>折衷：本機磁碟必須大到足以容納完整資料集</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">分層儲存</h3><p>分層儲存更進一步。它不會將所有資料下載到本機磁碟，而是使用本機磁碟作為熱資料的快取記憶體，並保留物件儲存作為主要層。只有在需要時，才會從物件儲存取得資料。</p>
<ul>
<li>記憶體使用量降至滿載模式的 &lt;10%。</li>
<li>本機磁碟使用量也會下降 - 只有熱資料會被快取 (通常是總使用量的 10-30%)</li>
<li>取捨：快取錯誤會增加 50-200ms 的延遲 (從物件儲存取得資料)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">資料流與資源使用</h3><table>
<thead>
<tr><th><strong>模式</strong></th><th><strong>資料流程</strong></th><th><strong>記憶體使用量</strong></th><th><strong>本機磁碟使用量</strong></th><th><strong>延遲</strong></th></tr>
</thead>
<tbody>
<tr><td>傳統滿載</td><td>物件儲存 → 記憶體 (100%)</td><td>非常高 (100%)</td><td>低 (僅臨時)</td><td>非常低且穩定</td></tr>
<tr><td>MMap</td><td>物件儲存 → 本機磁碟 (100%) → 記憶體 (依需求)</td><td>低 (10-30%)</td><td>高 (100%)</td><td>低且穩定</td></tr>
<tr><td>分層儲存</td><td>物件儲存 ↔ 本機快取 (熱資料) → 記憶體 (依需求)</td><td>非常低 (&lt;10%)</td><td>低 (僅熱資料)</td><td>快取記憶體命中率低，快取記憶體未命中率高</td></tr>
</tbody>
</table>
<p><strong>硬體建議：</strong>這兩種方法都嚴重依賴本機磁碟 I/O，因此強烈建議使用<strong>NVMe SSD</strong>，<strong>IOPS</strong> 最好在<strong>10,000 以上</strong>。</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap 與分層儲存：您應該使用哪一種？</h3><table>
<thead>
<tr><th><strong>您的情況</strong></th><th><strong>使用此方法</strong></th><th><strong>為什麼</strong></th></tr>
</thead>
<tbody>
<tr><td>延遲敏感 (P99 &lt; 20ms)</td><td>MMap</td><td>資料已儲存在本機磁碟上 - 無須透過網路取得，延遲穩定</td></tr>
<tr><td>統一存取 (沒有明顯的冷熱區分)</td><td>MMap</td><td>分層儲存需要冷/熱偏移才有效；沒有冷/熱偏移，快取命中率會很低</td></tr>
<tr><td>成本是優先考量 (偶爾的延遲尖峰也沒問題)</td><td>分層儲存</td><td>可節省記憶體和本機磁碟 (磁碟數量減少 70-90%)</td></tr>
<tr><td>清除熱/冷模式 (80/20 法則)</td><td>分層儲存</td><td>熱資料保留在快取記憶體，冷資料保留在物件儲存中，費用低廉</td></tr>
<tr><td>非常大的規模 (&gt;500M 向量)</td><td>分層儲存</td><td>在這種規模下，一個節點的本機磁碟通常無法容納完整的資料集</td></tr>
</tbody>
</table>
<p><strong>注意：</strong>MMap 需要 Milvus 2.3 以上。分層儲存需要 Milvus 2.6 以上。兩者皆使用 NVMe SSD (建議使用 10,000+ IOPS) 效果最佳。</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">如何配置 MMap</h3><p><strong>選項 1：YAML 配置 (建議用於新部署)</strong></p>
<p>編輯 Milvus 配置文件 milvus.yaml，並在 queryNode 部分下新增下列設定：</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>選項 2：Python SDK 設定 (適用於現有的集合)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">如何配置分層儲存 (Milvus 2.6+)</h3><p>編輯 Milvus 配置檔案 milvus.yaml，並在 queryNode 部分加入下列設定：</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">使用低維嵌入<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>這一點很容易被忽略，但維度會直接調整您的成本。記憶體、儲存和計算都會隨著維數線性增加。對於相同的資料，1536 維的模型比 384 維的模型多花 4 倍的基礎架構成本。</p>
<p>查詢成本也以相同的方式縮放 - 余弦相似度為 O(D)，因此 768 維向量每次查詢所需的計算成本約為 384 維向量的兩倍。在高 QPS 的工作負載中，這個差異會直接轉換成所需的節點數。</p>
<p>以下是常見嵌入模型的比較 (以 384 dim 為 1.0x 基準)：</p>
<table>
<thead>
<tr><th><strong>模型</strong></th><th><strong>尺寸</strong></th><th><strong>相對成本</strong></th><th><strong>回復率</strong></th><th><strong>最佳</strong></th></tr>
</thead>
<tbody>
<tr><td>文字嵌入-3-大</td><td>3072</td><td>8.0x</td><td>98%+</td><td>精確度要求極高時 (研究、醫療保健)</td></tr>
<tr><td>文字嵌入-3-小</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>一般 RAG 工作量</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>良好的性價比平衡</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>成本敏感型工作負載</td></tr>
</tbody>
</table>
<p><strong>實用建議：</strong>不要假設您需要最大的模型。在實際查詢的代表性樣本上進行測試 (1M 向量通常就足夠了)，找出符合您精確度標準的最低維度模型。許多團隊發現 768 維度與 1536 維度對於他們的使用個案同樣有效。</p>
<p><strong>已經決定使用高維模型？</strong>您可以在事後降低維度。PCA (主成分分析) 可以剔除多餘的特徵，而<a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka 內嵌</a>可以讓您截斷到前 N 個維度，同時保留大部分的品質。在重新嵌入整個資料集之前，這兩種方法都值得嘗試。</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">使用壓縮和 TTL 管理資料生命週期<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>這一點雖然不太光彩，但仍然很重要，尤其是對於長時間運作的生產系統。Milvus 使用 append-only 儲存模型：當您刪除資料時，資料會被標記為已刪除，但不會立即移除。隨著時間的推移，這些死資料會累積起來，浪費儲存空間，並導致查詢需要掃描更多的行。</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">壓縮：從刪除的資料中回收儲存空間</h3><p>Compaction 是 Milvus 用來清理的背景程序。它合併小區段、實際移除已刪除的資料，並重新寫入壓縮的檔案。如果您有以下情況，您會需要它</p>
<ul>
<li>您有頻繁的寫入和刪除 (產品目錄、內容更新、即時日誌)</li>
<li>您的區段數量不斷增加 (這會增加每次查詢的開銷)</li>
<li>儲存使用量的成長速度遠超過實際有效資料的成長速度</li>
</ul>
<p><strong>注意：</strong>壓縮是 I/O 密集型的。安排在低流量時段 (例如每晚) 或仔細調整觸發器，以免與生產查詢競爭。</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(Time to Live)：自動過期舊向量資料</h3><p>對於自然過期的資料，TTL 比手動刪除更乾淨。設定資料的有效期限，Milvus 就會在資料過期時自動標記刪除。Compaction 會處理實際的清理工作。</p>
<p>這對以下情況很有用</p>
<ul>
<li>日誌和會話資料 - 只保留最近 7 天或 30 天的資料</li>
<li>時間敏感的 RAG - 偏好最近的知識，讓舊文件過期</li>
<li>即時建議 - 僅擷取最近的使用者行為</li>
</ul>
<p>壓縮與 TTL 可讓您的系統不會默默地累積浪費。這並不是最大的成本槓桿，但它可以防止緩慢的儲存爬升，讓團隊措手不及。</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">多一個選擇：Zilliz Cloud (全面管理的 Milvus)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>完全揭露：<a href="https://zilliz.com/">Zilliz Cloud</a>是由 Milvus 背後的同一團隊所建立，因此請謹慎看待。</p>
<p>儘管如此，這裡有一個違反直覺的部分：儘管 Milvus 是免費且開放原始碼的，但管理服務的成本實際上可能比自行託管還要低。原因很簡單 - 軟體是免費的，但執行軟體的雲端基礎架構卻不是免費的，您需要工程師來操作和維護。如果管理式服務能夠以更少的機器和更少的工程師工時完成相同的工作，那麼即使支付了服務本身的費用，您的總帳單也會下降。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a>是建立在 Milvus 上的全面管理服務，並與 Milvus 的 API 相容。與成本相關的有兩點</p>
<ul>
<li><strong>每個節點的效能更佳。</strong>Zilliz Cloud 在 Cardinal 上執行，Cardinal 是我們最佳化的搜尋引擎。根據<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">VectorDBBench 的結果</a>，它的吞吐量比開源 Milvus 高 3-5 倍，速度也快 10 倍。實際上，這表示您需要大約三分之一到五分之一的運算節點來處理相同的工作負載。</li>
<li><strong>內建最佳化功能。</strong>本指南中涵蓋的功能 - MMap、分層儲存和索引量化 - 都是內建並自動調整的。自動調整功能會根據實際負載調整容量，因此您不需要為不需要的空間付費。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>由於 API 和資料格式相容，因此<a href="https://zilliz.com/zilliz-migration-service">遷移</a>非常簡單直接。Zilliz 也提供遷移工具來協助。如需詳細比較，請參閱：<a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">摘要：減少向量資料庫成本的逐步計畫<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>如果您只做一件事，請這樣做：檢查您的索引類型。</strong></p>
<p>如果您正在對成本敏感的工作負載上執行 HNSW，請改用 IVF_SQ8。光是這一點，就可以將記憶體成本降低 ~70%，而召回損失卻微乎其微。</p>
<p>如果您想要更進一步，以下是優先順序：</p>
<ul>
<li>對大多數工作負載而言，<strong>轉換您的索引</strong>- HNSW → IVF_SQ8。零架構改變的最大效益。</li>
<li><strong>啟用 MMap 或分層儲存</strong>- 停止將所有內容保留在記憶體中。這是配置變更，而不是重新設計。</li>
<li><strong>評估您的嵌入尺寸</strong>- 測試較小的模型是否符合您的精確度需求。這需要重新嵌入，但可以節省複合成本。</li>
<li><strong>設定壓縮和 TTL</strong>- 防止無聲的資料膨脹，尤其是在您經常寫入/刪除的情況下。</li>
</ul>
<p>結合這些策略，可以讓您的向量資料庫費用減少 60-80%。並非每個團隊都需要全部四項 - 從索引變更開始，衡量影響，然後逐項往下看。</p>
<p>對於希望減少作業工作並提高成本效益的團隊來說，<a href="https://zilliz.com/">Zilliz Cloud</a>(受管理的 Milvus) 是另一個選擇。</p>
<p>如果您正在進行任何這些最佳化工作，並想要比較筆記，<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus 社群 Slack</a>是一個提出問題的好地方。您也可以加入<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>，與工程團隊快速討論您的特定設定。</p>
