---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: '如何在 Milvus 的 1GB 記憶體下執行 2,500 萬個影像向量'
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  一位社群使用者如何使用 FLAT、FP16 和 mmap，在 Milvus &lt;1GB 記憶體上執行 25M 向量的圖像搜尋 - 而非 Sizing
  Tool 估計的 139GB。
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>最近，一位 Milvus 用戶向我們提出了一個非常實際的圖像搜索問題。</p>
<p>"我們需要對 2,500 萬張編碼為 1280 維向量的圖像進行圖像對圖像搜索。一台機器就可以完成這項工作。它有 64GB 記憶體，最多只能有 32GB 存入向量資料庫。但是<a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a>說我們需要 139GB。我們熟了嗎？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sizing Tool 估計結果：25M × 1280 維向量，原始資料大小 119.2 GB，載入記憶體 139.4 GB</p>
<p>不完全是。</p>
<p>起初，顯而易見的答案似乎是更先進的索引。如果資料集很大，記憶體又很緊張，更聰明的 ANN 索引應該會有幫助。在這種情況下，卻沒有。最後成功的索引是 Milvus 最簡單的選項：<a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>。</p>
<p>結果比預期的要好：穩態記憶體維持在 1GB 以下，容器的駐留記憶體約為 600MB，熱查詢延遲維持在 100 毫秒以下。啟動時的短暫峰值約為 12.5GB，系統暖機時的第一次查詢花了約 30 秒。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>重要的部分並不在於 FLAT 神奇地讓 2,500 萬次暴力比較變得便宜。事實並非如此。重要的是，這個工作負載幾乎從未搜尋過所有 2,500 萬個向量。標量篩選器會先縮窄每個查詢的範圍，而 FLAT 只會比較這個小得多的候選集內的向量。</p>
<p>這篇文章會詳細說明失敗的原因、FLAT 成功的原因，以及何時值得在您自己的工作負載中嘗試相同的模式。</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">為何 AISAQ 和 IVF_FLAT 在此失敗<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>在 FLAT 之前，使用者嘗試了兩種對受限機器而言看起來更自然的索引。</p>
<p><strong>第一次嘗試：</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>。</strong>AISAQ 是一個面向磁碟的索引，旨在降低記憶體使用量。這個工作負載的問題在於建立和載入路徑。在較早前有 5 千 5 百萬向量的測試中，一次收集載入將 249GB 的暫存資料寫入磁碟，花費了太長的時間，因此並不實際。</p>
<p><strong>第二次嘗試：IVF_FLAT.</strong>IVF_FLAT 看起來也很合理，因為它是一個標準的 ANN 索引。索引建立成功，但收集負載在 14% 時停滯不前，再也無法恢復。</p>
<p>在這兩個死胡同之後，使用者嘗試了無聊的選項：FLAT。它加載得很乾淨。對於這個特定的查詢模式，它也提供了最佳的執行時間表現。</p>
<table>
<thead>
<tr><th><strong>索引</strong></th><th><strong>為什麼它看起來很有希望</strong></th><th><strong>在此工作負載中發生了什麼</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>理論上使用低記憶體的磁碟導向索引</td><td>建立/載入路徑產生大量暫存檔案。在 55M-vector 測試中，一個集合載入寫入了 249GB 的暫存資料，而且速度很慢。</td></tr>
<tr><td>IVF_FLAT</td><td>標準 ANN 索引，搜尋成本比完整掃描低</td><td>索引建立，但收集載入停滯在 14%，無法恢復。</td></tr>
<tr><td>FLAT</td><td>沒有額外的 ANN 結構，也沒有建立索引的複雜性</td><td>穩定狀態記憶體保持在 1GB 以下。容器駐留記憶體約為 600MB。啟動時的峰值接近 12.5GB。第一次查詢花了約 30 秒，之後溫暖查詢維持在 100 毫秒以下。</td></tr>
</tbody>
</table>
<p>這個教訓很簡單：理論上有效率的索引可能仍然不適合特定的機器、資料形狀和查詢模式。</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">FLAT 為什麼有效<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT 是 Milvus 支援的最簡單索引。沒有圖表。沒有樹。沒有聚類。它直接比較查詢向量與候選向量。</p>
<p>對於 2,500 萬向量來說，這聽起來像是錯誤的工具。如果每個查詢都要搜尋整個向量集，那也是錯誤的工具。</p>
<p>但是這個工作負載在向量搜尋前面有一個強大的過濾器。每個查詢都會先使用<code translate="no">dataid</code> 和<code translate="no">classid</code> 等標量字段縮窄搜尋空間。Milvus 才執行向量相似性搜尋。這將問題從「搜尋 2,500 萬個向量」改變為「過濾後搜尋幾百到幾萬個向量」。</p>
<p>有三個部分讓設定得以運作：FP16 向量儲存、原始向量資料的 mmap，以及 FLAT 通路前的標量篩選。</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">優化 1：FP16 將向量資料減少一半<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>向量有 1280 個維度。儲存為 FP32 時，每個向量需要 5120 位元組：</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>在 2,500 萬個向量中，大約有 119.2GB 的原始向量資料。FP16 將每個維度從 4 位元組減少到 2 位元組：</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>因此原始向量資料降至約 59.6GB。</p>
<p>這仍然無法完全滿足可用的 RAM，但卻將 Milvus 和作業系統需要處理的向量資料數量減少了一半。在許多影像擷取工作負載中，FP16 對召回率的影響較小，但這並不是免費的規則。在將 FP16 設定為預設值之前，請使用您自己的 embeddings、度量標準和品質條，測試召回率。</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">最佳化 2：mmap 讓原始向量遠離程序堆<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>即使在 FP16 之後，約 60GB 的向量對於記憶體預算來說還是太多了。這就是<a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a>變得有用的地方。</p>
<p>有了 mmap，Milvus 可以透過記憶體映射檔案存取向量資料，而不是將整個原始向量欄位載入進程記憶體。作業系統會在查詢觸及資料時將資料分頁，並可將熱頁保留在其頁快取記憶體中。</p>
<p>在這位使用者的 Milvus 2.6.14 環境中，群集層級的 mmap 配置已經涵蓋原始向量資料，因此使用者不需要手動設定 mmap。</p>
<p>有一個細節在除錯時造成混淆：Attu 顯示的是模式層級的 mmap 設定，而非叢集層級的預設值。因此，即使群集層級的設定有效地啟用了資料路徑的 mmap，<a href="https://zilliz.com/attu"><strong>Attu</strong></a>仍可能將 mmap 顯示為停用。</p>
<p>mmap 可節省 RAM，但會更大量地使用磁碟和作業系統的頁面快取。您仍然需要 SSD 容量來儲存向量檔案，而且在從磁碟讀取相關頁面時，第一次查詢可能會較慢。</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">最佳化 3：標量篩選才是真正的效能倍增器<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 和 mmap 解釋了記憶體數量。標量篩選解釋了延遲數。</p>
<p>此工作負載中的每個查詢都包含這樣的篩選表達式：</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>該篩選程式在向量比較步驟之前執行。FLAT 並非針對 2,500 萬個向量進行比較，而是針對經過篩選的候選集進行比較，候選集的向量數量從幾百個到幾萬個不等。</p>
<p>這就是溫度查詢保持在 100 毫秒以下的原因。在現代 CPU 上，數以萬計的向量比較是實際可行的。每次查詢進行 2,500 萬次比較則完全不同。</p>
<p>這也解釋了為什麼 IVF_FLAT 和 HNSW 在這裡沒有用。一旦標量篩選已經將候選集合縮小到足夠大的程度，額外的 ANN 結構就會變成無足輕重。它會增加記憶體、建立時間和載入複雜度，但可能不會改善太多的延遲。</p>
<p>有一點需要注意。此工作負載中的篩選器很簡單。如果您的篩選器使用大型<code translate="no">IN</code> 清單、<code translate="no">LIKE</code> 模式、範圍謂語或巢狀 JSON 條件，請在相關欄位上加入標量索引，並直接測量篩選器階段。</p>
<table>
<thead>
<tr><th>優化</th><th>它的作用</th><th>為何在此重要</th><th>權衡</th></tr>
</thead>
<tbody>
<tr><td>FP16 向量儲存</td><td>每個向量維度以 2 位元組儲存，而非 4 位元組</td><td>原始向量資料從約 119.2GB 減少到約 59.6GB</td><td>Recall 影響取決於您的嵌入和度量。測試一下。</td></tr>
<tr><td>在原始向量上使用 mmap</td><td>從磁碟映射向量檔案，而不是將完整的原始向量欄位載入進程記憶體</td><td>保持低處理器記憶體，同時讓作業系統在需要時頁進資料</td><td>需要 SSD 容量，可能會讓冷查詢變慢。</td></tr>
<tr><td>先進行標量值篩選</td><td>先透過標量欄位篩選，再進行向量比較</td><td>將每項查詢從 25M 的候選項目減少到數百或數萬個</td><td>複雜的過濾器可能需要標量索引。</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">此模式的適用範圍<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>圖片搜尋案例之所以成功，是因為實際搜尋空間遠小於總集合。同樣的形狀也出現在許多生產工作負載中。</p>
<ol>
<li><strong>多租戶 RAG：</strong>先依<code translate="no">tenant_id</code> 、<code translate="no">workspace_id</code> 或<code translate="no">project_id</code> 篩選。每個租戶可能只有數千或數萬個區塊。</li>
<li><strong>電子商務產品搜尋：</strong>在向量搜尋之前，依類別、品牌、賣家、地區或可用性進行篩選。</li>
<li><strong>日誌與文件檢索：</strong>在進行語意搜尋前，依時間範圍、來源、服務或文件類型進行篩選。</li>
<li><strong>帶標籤的圖片或媒體搜尋：</strong>在比較嵌入之前，先依據資料集、類別、客戶或資產群組進行篩選。</li>
</ol>
<p>這些都是 FLAT + FP16 + mmap 的良好候選項目，因為完整的集合可能很大，而每個查詢仍會觸及一小部分子集。</p>
<p>當每個查詢都要搜尋整個集合時，這個模式就不適用了。如果每個查詢真的需要掃描所有 2,500 萬個向量，FLAT 將不會帶給您相同的延遲。在這種情況下，請使用 ANN 索引，例如 HNSW、IVF 或磁碟導向索引，並針對記憶體、磁碟和建立時間的權衡進行規劃。</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">如何閱讀規模工具估算<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Sizing Tool 是一個起點，不是您硬體的最終判斷。</p>
<p>在此案例中，139.4GB 載入記憶體估算值是 2500 萬個 1280 維 FP32 向量的保守基線。實際的工作量改變了幾個假設：</p>
<ol>
<li>FP16 將原始向量大小大約減少一半。</li>
<li>mmap 避免將完整的原始向量欄位載入處理記憶體。</li>
<li>FLAT 避免了額外的 ANN 索引結構。</li>
<li>標量篩選器讓每次查詢搜尋的候選集更小。</li>
</ol>
<p>這就是為什麼實際工作負載測試很重要。在僅基於大小估計而拒絕硬體設定之前，請使用您的實際向量精確度、索引類型、mmap 設定、標量篩選器、冷查詢行為及熱查詢行為進行測試。</p>
<h2 id="Get-Started" class="common-anchor-header">開始<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您想要嘗試相同的配方，請從查詢模式開始，而不是索引名稱。</p>
<ol>
<li>檢查每個查詢是否都有選擇性的標量篩選器。</li>
<li>估算篩選後還剩下多少向量。</li>
<li>如果召回測試看起來不錯，請將向量儲存為 FP16。</li>
<li>當過濾後的候選集小到足以進行暴力比較時，使用 FLAT。</li>
<li>驗證原始向量資料的 mmap 行為。檢查模式層級設定和群集層級設定。</li>
<li>測量啟動記憶體、首次查詢延遲、熱查詢延遲和磁碟 I/O。</li>
<li>如果篩選評估成為瓶頸，則增加標量索引。</li>
</ol>
<p>若要進行本機測試，請從<a href="https://milvus.io/docs/quickstart.md"><strong>Milvus quickstart</strong></a>或 Milvus<a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>套件庫開始。使用 Attu 檢查集合，但請記住 Attu 可能不會顯示群集層級的 mmap 預設值。</p>
<p>如果您不想自己執行基礎架構，<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>是受管理的 Milvus 服務。您可獲得相同的 Milvus 核心，並可管理作業、擴充，以及用於測試的免費層級。使用工作電子郵件<a href="https://cloud.zilliz.com/signup"><strong>註冊</strong></a>可獲得 100 美元的免費點數，如果您已有帳號，也可以<a href="https://cloud.zilliz.com/login"><strong>登入</strong></a>。</p>
