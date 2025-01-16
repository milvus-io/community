---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: Milvus 推出 MMap，重新定義資料管理並提升儲存能力
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: Milvus MMap 功能可讓使用者在有限的記憶體內處理更多資料，在效能、成本和系統限制之間取得微妙的平衡。
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>是開放原始碼<a href="https://zilliz.com/blog/what-is-a-real-vector-database">向量資料庫中</a>速度最快的解決方案，可滿足具有密集效能需求的使用者。然而，使用者需求的多樣性反映了他們所使用的資料。有些用戶會優先使用經濟實惠的解決方案和大容量儲存空間，而非純粹的速度。Milvus 瞭解到這些需求，因此推出 MMap 功能，重新定義我們處理大量資料的方式，並承諾在不犧牲功能的前提下提高成本效益。</p>
<h2 id="What-is-MMap" class="common-anchor-header">什麼是 MMap？<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap 是記憶體映射檔案的縮寫，它在作業系統中的檔案和記憶體之間架起了一座橋樑。這項技術允許 Milvus 將大型檔案直接映射到系統的記憶體空間，將檔案轉換為連續的記憶體區塊。這種整合不需要明確的讀取或寫入作業，從根本上改變了 Milvus 管理資料的方式。對於大型檔案或使用者需要隨機存取檔案的情況，它可確保無縫存取和有效率的儲存。</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">誰能從 MMap 獲益？<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>由於向量資料的儲存需求，向量資料庫需要大量的記憶體容量。有了 MMap 功能，在有限的記憶體內處理更多資料就成為現實。然而，這種能力的提升需要付出性能代價。系統會智慧地管理記憶體，根據負載和使用情況驅逐一些資料。這種驅逐功能可讓 Milvus 在相同的記憶體容量內處理更多資料。</p>
<p>在測試過程中，我們觀察到在記憶體充足的情況下，所有資料都會在預熱後儲存在記憶體中，以維持系統效能。然而，隨著資料量的增加，效能會逐漸下降。<strong>因此，我們建議對效能波動不太敏感的使用者使用 MMap 功能。</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">在 Milvus 中啟用 MMap：簡單配置<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中啟用 MMap 非常簡單直接。您只需修改<code translate="no">milvus.yaml</code> 檔案：在<code translate="no">queryNode</code> 設定下新增<code translate="no">mmapDirPath</code> 項，並設定有效路徑作為其值。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">取得平衡：效能、儲存與系統限制<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>資料存取模式會顯著影響效能。Milvus 的 MMap 功能可根據位置優化資料存取。MMap 讓 Milvus 能夠將標量資料直接寫入磁碟，以連續存取資料區段。變長資料（例如字串）會進行扁平化處理，並使用記憶體中的偏移量陣列進行索引。此方法可確保資料存取的區域性，並消除分開儲存每個可變長度資料的開銷。向量索引的優化非常仔細。MMap 有選擇性地用於向量資料，同時保留記憶體中的相鄰列表，在不影響效能的情況下節省大量記憶體。</p>
<p>此外，MMap 藉由最小化記憶體使用量來最大化資料處理。不同於之前 Milvus 版本中 QueryNode 會複製整個資料集的做法，MMap 在開發過程中採用了簡化的、無複製的串流處理方式。這種優化大大降低了記憶體開銷。</p>
<p><strong>我們的內部測試結果顯示，啟用 MMap 後，Milvus 可以有效率地處理雙倍的資料量。</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">未來之路：持續創新和以用戶為中心的改進<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然 MMap 功能仍處於測試階段，但 Milvus 團隊致力於持續改進。未來的更新將改善系統的記憶體使用量，讓 Milvus 在單一節點上支援更廣泛的資料量。使用者可預期對 MMap 功能進行更仔細的控制，使集合的動態變更和進階欄位載入模式成為可能。這些強化功能提供了前所未有的彈性，讓使用者可根據特定需求量身打造資料處理策略。</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">結論：利用 Milvus MMap 重新定義卓越的資料處理功能<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 的 MMap 功能標誌著資料處理技術的重大飛躍。通過在性能、成本和系統限制之間取得微妙的平衡，Milvus 使用戶能夠高效、低成本地處理大量數據。隨著 Milvus 的持續演進，它仍然站在創新解決方案的最前線，重新定義資料管理可實現的邊界。</p>
<p>Milvus 將繼續邁向無與倫比的卓越資料處理，敬請期待更多突破性的發展。</p>
