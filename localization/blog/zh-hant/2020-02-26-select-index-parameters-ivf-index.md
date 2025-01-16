---
id: select-index-parameters-ivf-index.md
title: 1.index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: 試管嬰兒指數的最佳做法
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>如何為 IVF 索引選擇索引參數</custom-h1><p>在<a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Milvus 配置的最佳實踐</a>中，介紹了一些 Milvus 0.6.0 配置的最佳實踐。在這篇文章中，我們也將介紹一些在 Milvus 客戶端設置關鍵參數的最佳實踐，這些操作包括創建表、創建索引和搜索。這些參數會影響搜尋效能。</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1.<code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>創建表時，index_file_size 參數用來指定用來儲存資料的單一檔案的大小，單位是 MB。預設值為 1024。在匯入向量資料時，Milvus 會以增量方式將資料合併到檔案中。當檔案大小達到 index_file_size 時，這個檔案不接受新的資料，Milvus 會將新的資料儲存到另一個檔案。這些都是原始資料檔案。建立索引時，Milvus 會為每個原始資料檔案產生一個索引檔案。對於 IVFLAT 索引類型，索引檔案大小大約等於相對應的原始資料檔案大小。對於 SQ8 索引，索引檔案大小約為對應原始資料檔案的 30%。</p>
<p>在搜尋過程中，Milvus 會逐一搜尋每個索引檔案。根據我們的經驗，當 index_file_size 從 1024 變更為 2048 時，搜尋效能會提升 30% 到 50%。然而，如果值太大，大檔案可能無法載入 GPU 記憶體 (甚至 CPU 記憶體)。例如，如果 GPU 記憶體是 2 GB，而 index_file_size 是 3 GB，索引檔案就無法載入 GPU 記憶體。通常，我們會將 index_file_size 設定為 1024 MB 或 2048 MB。</p>
<p>下表顯示使用 sift50m 對 index_file_size 進行的測試。索引類型為 SQ8。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>我們可以看到，在 CPU 模式和 GPU 模式下，當 index_file_size 為 2048 MB 而非 1024 MB 時，搜尋效能顯著提升。</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2.<code translate="no">nlist</code> <strong>和</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">nlist</code> 參數用於建立索引，而<code translate="no">nprobe</code> 參數用於搜尋。IVFLAT 和 SQ8 都使用聚類演算法將大量向量分割成群組，或稱為 bucket。<code translate="no">nlist</code> 是聚類時的 bucket 數量。</p>
<p>使用索引搜尋時，第一步是找出一定數量最接近目標向量的 buckets，第二步則是依向量距離從這些 buckets 中找出最相似的 k 個向量。<code translate="no">nprobe</code> 是第一步中的 buckets 數量。</p>
<p>一般而言，在聚類過程中，增加<code translate="no">nlist</code> 會導致更多的桶和桶中更少的向量。因此，計算負載會減少，搜尋效能也會提高。然而，由於比較相似性的向量較少，可能會遺漏正確的結果。</p>
<p>增加<code translate="no">nprobe</code> 會導致需要搜尋更多的資料桶。因此，計算負載會增加，搜尋效能會降低，但搜尋精確度會提高。不同的資料集分佈情況可能不同。設定<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 時，您也應該考慮資料集的大小。一般而言，建議<code translate="no">nlist</code> 可以是<code translate="no">4 * sqrt(n)</code> ，其中 n 是向量的總數。至於<code translate="no">nprobe</code> ，您必須在精確度和效率之間作出取捨，最好的方法是透過試誤來決定數值。</p>
<p>下表顯示使用 sift50m 對<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 進行的測試。索引類型為 SQ8。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>該表格比較使用<code translate="no">nlist</code>/<code translate="no">nprobe</code> 的不同值的搜尋效能和精確度。只顯示 GPU 的結果，因為 CPU 和 GPU 的測試結果相似。在此測試中，當<code translate="no">nlist</code>/<code translate="no">nprobe</code> 的值增加相同的百分比時，搜尋精確度也會增加。當<code translate="no">nlist</code> = 4096 且<code translate="no">nprobe</code> 為 128 時，Milvus 的搜尋效能最佳。總括而言，在決定<code translate="no">nlist</code> 和<code translate="no">nprobe</code> 的值時，您必須考慮不同的資料集和需求，在效能和精確度之間作出權衡。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>:當資料大小大於<code translate="no">index_file_size</code> 時，<code translate="no">index_file_size</code> 的值越大，搜尋效能越好。<code translate="no">nlist</code> 和<code translate="no">nprobe</code>：您必須在效能和精確度之間作出取捨。</p>
