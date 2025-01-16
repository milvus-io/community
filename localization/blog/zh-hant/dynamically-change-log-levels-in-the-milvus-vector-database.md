---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: 動態變更 Milvus Vector 資料庫的日誌層級
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: 了解如何在 Milvus 中調整日誌層級，而無需重新啟動服務。
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者<a href="https://github.com/jiaoew1991">焦恩偉</a>，翻譯<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>。</p>
</blockquote>
<p>為了防止日誌過量輸出影響磁盤和系統性能，Milvus 在運行時默認以<code translate="no">info</code> 層級輸出日誌。然而，有時候<code translate="no">info</code> 層級的日誌並不足以幫助我們有效地找出 Bug 和問題。更糟糕的是，在某些情況下，更改日誌層級和重新啟動服務可能會導致問題無法重現，使故障排除更加困難。因此，迫切需要在 Milvus 向量資料庫中支援動態變更日誌層級。</p>
<p>本文將介紹動態變更日誌層級的機制，並說明如何在 Milvus 向量資料庫中進行動態變更。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#Mechanism">機制</a></li>
<li><a href="#How-to-dynamically-change-log-levels">如何動態改變日誌層級</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">機制<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 向量資料庫採用 Uber 開放的<a href="https://github.com/uber-go/zap">zap</a>日誌記錄器。作為 Go 語言生態系統中最強大的日誌元件之一，zap 整合了<a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a>模組，因此您可以透過 HTTP 介面檢視目前的日誌層級，並動態變更日誌層級。</p>
<p>Milvus 監聽<code translate="no">9091</code> 連接埠所提供的 HTTP 服務。因此，您可以存取<code translate="no">9091</code> 連接埠，以利用效能除錯、度量、健康檢查等功能。同樣地，<code translate="no">9091</code> 連接埠也會被重複使用，以啟用動態日誌層級修改，並且<code translate="no">/log/level</code> 路徑也會被加入連接埠。如需詳細資訊，請參閱<a href="https://github.com/milvus-io/milvus/pull/18430"> 日誌介面 PR</a>。</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">如何動態變更日誌層級<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>本節說明如何動態改變日誌層級，而不需要重新啟動執行中的 Milvus 服務。</p>
<h3 id="Prerequisite" class="common-anchor-header">先決條件</h3><p>確保您可以存取 Milvus 元件的<code translate="no">9091</code> 連接埠。</p>
<h3 id="Change-the-log-level" class="common-anchor-header">變更日誌層級</h3><p>假設 Milvus 代理的 IP 位址是<code translate="no">192.168.48.12</code> 。</p>
<p>您可以先執行<code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> 檢查目前代理的日誌層級。</p>
<p>然後，您可以指定日誌層級進行調整。日誌層級選項包括</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>以下範例程式碼將預設的日誌層級從<code translate="no">info</code> 改為<code translate="no">error</code> 。</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
