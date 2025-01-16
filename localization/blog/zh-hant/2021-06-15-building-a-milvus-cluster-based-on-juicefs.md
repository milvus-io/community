---
id: building-a-milvus-cluster-based-on-juicefs.md
title: 什麼是 JuiceFS？
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: 學習如何以 JuiceFS 為基礎建立 Milvus 叢集，JuiceFS 是專為雲原生環境設計的共享檔案系統。
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>以 JuiceFS 為基礎建立 Milvus 叢集</custom-h1><p>開放原始碼社群之間的合作是一件神奇的事。熱情、聰明、有創造力的志願者不僅讓開源解決方案不斷創新，他們也致力於將不同的工具以有趣且有用的方式結合在一起。<a href="https://milvus.io/">Milvus</a> 是全球最受歡迎的向量資料庫，而<a href="https://github.com/juicedata/juicefs">JuiceFS</a> 則是專為雲端原生環境所設計的共享檔案系統，兩者在各自的開源社群中以這種精神結合在一起。本文將解釋什麼是 JuiceFS、如何根據 JuiceFS 共用檔案儲存建立 Milvus 叢集，以及使用者使用此解決方案時可預期的效能。</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>什麼是 JuiceFS？</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS 是一個高效能、開放源碼的分散式 POSIX 檔案系統，可建立在 Redis 和 S3 之上。它專為雲原生環境設計，支援管理、分析、歸檔和備份任何類型的資料。JuiceFS 常用於解決大數據挑戰、建置人工智慧 (AI) 應用程式和日誌收集。該系統也支援跨多個用戶端的資料分享，並可在 Milvus 中直接用作共享儲存。</p>
<p>在資料及其對應的元資料分別持久化到物件儲存和<a href="https://redis.io/">Redis</a>之後，JuiceFS 就成為無狀態的中介軟體。透過標準的檔案系統介面，不同的應用程式可以無縫地相互停靠，從而實現資料共享。JuiceFS 依賴 Redis 這個開放原始碼的記憶體資料儲存器來儲存元資料。之所以使用 Redis，是因為它能保證原子性，並提供高效能的元資料作業。所有資料都透過 JuiceFS 用戶端儲存在物件儲存中。架構圖如下：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>根據 JuiceFS 建立 Milvus 叢集</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 JuiceFS 建立的 Milvus 叢集 (請參閱下面的架構圖) 是透過使用叢集分片中介軟體 Mishards 來分割上游請求，然後將請求逐級下傳到其子模組。插入資料時，Mishards 會將上游請求分配給 Milvus 寫入節點，而 Milvus 寫入節點會將新插入的資料儲存在 JuiceFS 中。讀取資料時，Mishards 會透過 Milvus 讀取節點將 JuiceFS 中的資料載入記憶體進行處理，然後從上游的子服務收集並傳回結果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>步驟 1：啟動 MySQL 服務</strong></h3><p>在群集中的<strong>任何</strong>節點啟動 MySQL 服務。如需詳細資訊，請參閱<a href="https://milvus.io/docs/v1.1.0/data_manage.md">使用 MySQL 管理元資料</a>。</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>步驟 2：建立 JuiceFS 檔案系統</strong></h3><p>為了示範目的，使用預先編譯的二進位 JuiceFS 程式。為您的系統下載正確的<a href="https://github.com/juicedata/juicefs/releases">安裝套件</a>，並依照 JuiceFS<a href="https://github.com/juicedata/juicefs-quickstart">快速入門指南</a>取得<a href="https://github.com/juicedata/juicefs/releases">詳細安裝</a>指示。若要建立 JuiceFS 檔案系統，請先設定 Redis 資料庫作為元資料儲存。建議在公共雲端部署時，將 Redis 服務託管在與應用程式相同的雲端。此外，為 JuiceFS 設定物件儲存。本範例使用 Azure Blob Storage，但 JuiceFS 幾乎支援所有物件服務。請選擇最適合您方案需求的物件儲存服務。</p>
<p>設定 Redis 服務和物件儲存後，格式化新的檔案系統，並將 JuiceFS 掛載到本機目錄：</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>如果 Redis 伺服器不是在本機執行，請將 localhost 取代為下列位址：<code translate="no">redis://&lt;user:password&gt;@host:6379/1</code> 。</p>
</blockquote>
<p>安裝成功後，JuiceFS 會返回共用儲存頁面<strong>/root/jfs</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>安裝成功.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>步驟 3：啟動 Milvus</strong></h3><p>群集中的所有節點都應安裝 Milvus，且每個 Milvus 節點都應設定有讀取或寫入權限。只有一個 Milvus 節點可以設定為寫入節點，其餘的必須是讀取節點。首先，在 Milvus 系統組態檔案<strong>server_config.yaml</strong> 中設定<code translate="no">cluster</code> 及<code translate="no">general</code> 兩節的參數：</p>
<p><strong>章節</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>參數</strong></th><th style="text-align:left"><strong>說明</strong></th><th style="text-align:left"><strong>設定</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">是否啟用群集模式</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvus 部署角色</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>部分</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>安裝期間，設定的 JuiceFS 共用儲存路徑為<strong>/root/jfs/milvus/db</strong>。</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>安裝完成後，啟動 Milvus 並確認它已正常啟動。 最後，在群集中的<strong>任何</strong>節點上啟動 Mishards 服務。下圖顯示 Mishards 成功啟動。如需詳細資訊，請參閱 GitHub<a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">教學</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>效能基準</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>共用儲存解決方案通常由網路連接儲存 (NAS) 系統實作。常用的 NAS 系統類型包括網路檔案系統 (NFS) 和伺服器訊息區塊 (SMB)。公共雲端平台通常提供與這些通訊協定相容的管理儲存服務，例如 Amazon Elastic File System (EFS)。</p>
<p>與傳統 NAS 系統不同，JuiceFS 是以使用者空間檔案系統 (FUSE) 為基礎實作，所有資料讀寫都直接在應用程式端進行，進一步減少存取延遲。JuiceFS 還有其他 NAS 系統所沒有的獨特功能，例如資料壓縮和快取。</p>
<p>基準測試顯示 JuiceFS 較 EFS 具有重大優勢。在元資料基準 (圖 1) 中，JuiceFS 的每秒 I/O 作業次數 (IOPS) 比 EFS 高出 10 倍。此外，I/O 吞吐量基準（圖 2）顯示 JuiceFS 在單一工作和多工作情境中的表現都優於 EFS。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>效能基準-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>效能基準-2.png</span> </span></p>
<p>此外，基準測試顯示，基於 JuiceFS 的 Milvus 群集的首次查詢擷取時間（或將新插入的資料從磁碟載入記憶體的時間）平均僅為 0.032 秒，顯示資料幾乎是瞬間從磁碟載入記憶體。在此測試中，首次查詢擷取時間是使用 100 萬行 128 維向量資料，以 100k 為一批，每隔 1 到 8 秒插入一次來測量。</p>
<p>JuiceFS 是一個穩定可靠的共享檔案儲存系統，建置在 JuiceFS 上的 Milvus 叢集同時提供高效能與彈性的儲存容量。</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>進一步瞭解 Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一個強大的工具，能夠為大量的人工智慧和向量相似性搜尋應用提供動力。若要進一步瞭解該專案，請查看下列資源：</p>
<ul>
<li>閱讀我們的<a href="https://zilliz.com/blog">部落格</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用全球最受歡迎的向量資料庫，或為其做出貢獻。</li>
<li>使用我們新的<a href="https://github.com/milvus-io/bootcamp">bootcamp</a> 快速測試和部署 AI 應用程式。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>writer bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>writer bio-jingjing jia.png</span> </span></p>
