---
id: how-to-get-started-with-milvus.md
title: 如何開始使用 Milvus
author: Eric Goebelbecker
date: 2023-05-18T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>如何開始使用 Milvus</span> </span></p>
<p>隨著資訊量與複雜度的增加，我們也需要工具來儲存與搜尋大規模、非結構化的資料集。<a href="https://github.com/milvus-io/milvus">Milvus</a>是一個開放原始碼的向量資料庫，能有效率地處理複雜的非結構化資料，例如影像、音訊和文字。對於需要高速且可擴充存取大量資料集的應用程式來說，它是很受歡迎的選擇。</p>
<p>在本文章中，您將學習如何安裝並執行 Milvus。您將瞭解如何執行這個強大的<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>，讓您的專案充分發揮其潛力。無論您是開發人員、資料科學家，或只是對向量相似性搜尋引擎的威力感到好奇，這篇博文都是您使用<a href="https://milvus.io/">Milvus</a> 的完美起點。</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus 是什麼？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/what-is-milvus">Milvus</a>是一個開放原始碼的向量資料庫，專為處理大規模的非結構化資料而設計。它採用先進的索引系統，並提供各種搜尋演算法，能有效率地處理圖像、音訊和文字等高維資料。</p>
<p>利用 Milvus 的一些優勢包括以下幾點：</p>
<ol>
<li>提高高維資料的搜尋效率</li>
<li>處理大型資料集的可擴展性</li>
<li>廣泛支援各種搜尋演算法與索引技術</li>
<li>廣泛的應用，包括圖像搜尋、自然語言處理、推薦系統、異常偵測、生物資訊學和音頻分析。</li>
</ol>
<h2 id="Prerequisites" class="common-anchor-header">先決條件<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>要學習本教學，您需要在系統中安裝最新版本的 Docker。本教學依賴<a href="https://docs.docker.com/compose/">Docker Compose</a>，它已包含在最新版本的 Docker runtime 中。</p>
<p>要使用 Milvus，您需要下載 Milvus Python 函式庫和命令列介面 (CLI)。請確保您的 Python 版本為 3.9 或更新版本，並注意 CLI 與 Windows、macOS 及 Linux 相容。以下提供的 shell 指令範例適用於 Linux 系統，但也可以用於 macOS 或 Windows Subsystem for Linux。</p>
<p>本教學使用<strong>wget</strong>從 GitHub 下載檔案。對於 macOS，您可以使用<a href="https://brew.sh/">Homebrew</a> 安裝<strong>wget</strong>，或使用瀏覽器下載檔案。對於 Windows，您可以在 Windows Linux 子系統 (WSL) 中找到<strong>wget</strong>。</p>
<h2 id="Running-Milvus-Standalone" class="common-anchor-header">獨立執行 Milvus<button data-href="#Running-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Allocate-Additional-Memory-to-Docker" class="common-anchor-header">為 Docker 分配額外記憶體</h3><p>為了達到最佳效能，Milvus 需要至少 8GB 的可用記憶體。然而，Docker 預設通常只分配 2GB。要解決這個問題，請前往「設定」，然後按一下「資源」，在執行伺服器之前<a href="https://docs.docker.com/config/containers/resource_constraints/#memory">增加 Docker</a>桌面<a href="https://docs.docker.com/config/containers/resource_constraints/#memory">的 Docker 記憶體</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_Docker_desktop_a18626750c.png" alt="The Docker desktop" class="doc-image" id="the-docker-desktop" />
   </span> <span class="img-wrapper"> <span>Docker 桌面</span> </span></p>
<h3 id="Download-Docker-Compose-Configuration" class="common-anchor-header">下載 Docker Compose 組態</h3><p>您需要三個容器來執行 Milvus 獨立伺服器：</p>
<ul>
<li><strong><a href="https://etcd.io/">etcd</a></strong>- 用於元資料儲存與存取的分散式金鑰值儲存空間</li>
<li><strong><a href="https://min.io/">minio</a></strong>- AWS S3 相容的持久性儲存，用於日誌和索引檔案</li>
<li><strong>milvus</strong>- 資料庫伺服器</li>
</ul>
<p>您不需要單獨設定和執行每個容器，而是使用 Docker Compose 來連接和協調它們。</p>
<ol>
<li>建立一個目錄來執行服務。</li>
<li>從 Github 下載範例<a href="https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml">Docker Compose 檔案</a>，並將其儲存為<strong>docker-compose.yml</strong>。您也可以使用<strong>wget</strong> 下載檔案。</li>
</ol>
<pre><code translate="no">$ <span class="hljs-built_in">mkdir</span> milvus_compose
$ <span class="hljs-built_in">cd</span> milvus_compose
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
--2023-04-10 16:44:13-- https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-10 16:44:13-- https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1356 (1.3K) [application/octet-stream]
Saving to: ‘docker-compose.yml’

docker-compose.yml 100%[==========================================================&gt;] 1.32K --.-KB/s <span class="hljs-keyword">in</span> 0s

2023-04-10 16:44:13 (94.2 MB/s) - ‘docker-compose.yml’ saved [1356/1356]
<button class="copy-code-btn"></button></code></pre>
<p>在執行之前，我們先來看看這個組態。</p>
<h2 id="Standalone-Configuration" class="common-anchor-header">單機配置<button data-href="#Standalone-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>這個組成檔案定義了 Milvus 所需的三個服務：<strong>etcd、minio</strong> 和<strong>milvus-standalone</strong>。</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.5&#x27;</span>

services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.0
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    container_name: milvus-minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/minio:/minio_data
    <span class="hljs-built_in">command</span>: minio server /minio_data
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9000/minio/health/live&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3

  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.2.8
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;minio&quot;</span>

networks:
  default:
    name: milvus
<button class="copy-code-btn"></button></code></pre>
<p>此設定為<strong>etcd</strong>指定一個卷冊，以存放持久性資料。它定義了四個環境變數，並透過指令行執行服務，指示它在 2379 埠聆聽請求。</p>
<p>該組態也為<strong>minio</strong>提供一個磁碟區，並使用預設的存取金鑰。不過，您應該建立一個新的<strong>minio</strong>映像，並使用獨特的金鑰供生產使用。此外，組態還包含<strong>minio</strong> 的健康檢查，可在服務失敗時重新啟動服務。請注意，Minio 預設使用連接埠 9000 來處理用戶端要求。</p>
<p>最後是執行 Milvus 的<strong>獨立</strong>服務。它也有一個 volume 加上環境變數，用來指示<strong>etcd</strong>和<strong>minio</strong> 的服務連接埠。最後一節提供服務共用的網路名稱。這可讓監控工具更容易識別。</p>
<h2 id="Running-Milvus" class="common-anchor-header">執行 Milvus<button data-href="#Running-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>使用<strong>docker compose up -d 啟動</strong>服務。</p>
<pre><code translate="no">$ docker compose up -d
[*] Running 4/4
✔ Network milvus               Created          .0s
✔ Container milvus-minio       Started          .2s
✔ Container milvus-etcd        Started          .3s
✔ Container milvus-standalone  Started
<button class="copy-code-btn"></button></code></pre>
<p>Docker<strong>ps</strong>會顯示有三個容器正在執行：</p>
<pre><code translate="no">$ docker ps -a
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                             PORTS                                              NAMES
eb1caca5d6a5   milvusdb/milvus:v2.2.8                     <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   21 seconds ago   Up 19 seconds                      0.0.0.0:9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp   milvus-standalone
ce19d90d89d0   quay.io/coreos/etcd:v3.5.0                 <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   22 seconds ago   Up 20 seconds                      2379-2380/tcp                                      milvus-etcd
e93e33a882d5   minio/minio:RELEASE.2023-03-20T20-16-18Z   <span class="hljs-string">&quot;/usr/bin/docker-ent…&quot;</span>   22 seconds ago   Up 20 seconds (health: starting)   9000/tcp                                           milvus-minio
<button class="copy-code-btn"></button></code></pre>
<p>你可以用<strong>docker logs</strong> 檢查 Milvus 伺服器：</p>
<pre><code translate="no">$ docker logs milvus-standalone
<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span> <span class="hljs-attr">maxprocs</span>: <span class="hljs-title class_">Leaving</span> <span class="hljs-variable constant_">GOMAXPROCS</span>=<span class="hljs-number">4</span>: <span class="hljs-variable constant_">CPU</span> quota <span class="hljs-literal">undefined</span>
    __  _________ _   ____  ______    
   /  |<span class="hljs-regexp">/  /</span>  _/ <span class="hljs-regexp">/| | /</span> <span class="hljs-regexp">/ /</span> <span class="hljs-regexp">/ /</span> __/    
  <span class="hljs-regexp">/ /</span>|_/ <span class="hljs-comment">// // /_| |/ / /_/ /\ \    </span>
 <span class="hljs-regexp">/_/</span>  <span class="hljs-regexp">/_/</span>___/____/___/\____/___/     

<span class="hljs-title class_">Welcome</span> to use <span class="hljs-title class_">Milvus</span>!
<span class="hljs-title class_">Version</span>:   v2<span class="hljs-number">.2</span><span class="hljs-number">.8</span>
<span class="hljs-title class_">Built</span>:     <span class="hljs-title class_">Wed</span> <span class="hljs-title class_">Mar</span> <span class="hljs-number">29</span> <span class="hljs-number">11</span>:<span class="hljs-number">32</span>:<span class="hljs-number">15</span> <span class="hljs-variable constant_">UTC</span> <span class="hljs-number">2023</span>
<span class="hljs-title class_">GitCommit</span>: 47e28fbe
<span class="hljs-title class_">GoVersion</span>: go version go1<span class="hljs-number">.18</span><span class="hljs-number">.3</span> linux/amd64

open pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
lock pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
[<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span><span class="hljs-number">.976</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [<span class="hljs-variable constant_">INFO</span>] [roles/roles.<span class="hljs-property">go</span>:<span class="hljs-number">192</span>] [<span class="hljs-string">&quot;starting running Milvus components&quot;</span>]
(snipped)
<button class="copy-code-btn"></button></code></pre>
<p>您的伺服器已經啟動並運作了。現在，讓我們使用 Python 連接到它。</p>
<h2 id="How-to-Use-Milvus" class="common-anchor-header">如何使用 Milvus<button data-href="#How-to-Use-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Using-Milvus-with-Python" class="common-anchor-header">用 Python 來使用 Milvus</h3><p>讓我們用 Python 範例程式來測試您的資料庫。首先用<strong>pip3</strong> 安裝<strong>PyMilvus</strong>：</p>
<pre><code translate="no">$ pip3 install pymilvus
Defaulting to user installation because normal site-packages is not writeable
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Collecting pymilvus
  Using cached pymilvus-2.2.6-py3-none-any.whl (133 kB)
Collecting grpcio&lt;=1.53.0,&gt;=1.49.1
  Using cached grpcio-1.53.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (4.9 MB)
Requirement already satisfied: mmh3&gt;=2.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (3.0.0)
Requirement already satisfied: ujson&gt;=2.0.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (5.4.0)
Requirement already satisfied: pandas&gt;=1.2.4 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (2.0.0)
Requirement already satisfied: python-dateutil&gt;=2.8.2 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2.8.2)
Requirement already satisfied: pytz&gt;=2020.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: tzdata&gt;=2022.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: numpy&gt;=1.21.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (1.24.2)
Requirement already satisfied: six&gt;=1.5 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from python-dateutil&gt;=2.8.2-&gt;pandas&gt;=1.2.4-&gt;pymilvus) (1.16.0)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Installing collected packages: grpcio, pymilvus
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Successfully installed grpcio pymilvus-2.2.6
<button class="copy-code-btn"></button></code></pre>
<p>然後下載<a href="https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py">hello_milvus 範例</a>程式：</p>
<pre><code translate="no">$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>這個腳本會建立一個資料集、新增一個索引，並執行一些計算。執行它。視您的處理器和可用記憶體而定，需要幾分鐘才能完成。</p>
<pre><code translate="no">$ python3 ./hello_milvus.py 

=== start connecting to Milvus     ===

Does collection hello_milvus exist <span class="hljs-keyword">in</span> Milvus: False

=== Create collection `hello_milvus` ===


=== Start inserting entities       ===

Number of entities <span class="hljs-keyword">in</span> Milvus: 3000

=== Start Creating index IVF_FLAT  ===


=== Start loading                  ===


=== Start searching based on vector similarity ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.08883658051490784, <span class="hljs-built_in">id</span>: 1262), random field: 0.2978858685751561
hit: (distance: 0.09590047597885132, <span class="hljs-built_in">id</span>: 1265), random field: 0.3042039939240304
hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2999), random field: 0.02316334456872482
hit: (distance: 0.05628091096878052, <span class="hljs-built_in">id</span>: 1580), random field: 0.3855988746044062
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
search latency = 0.3663s

=== Start querying with `random &gt; 0.5` ===

query result:
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
search latency = 0.4352s
query pagination(<span class="hljs-built_in">limit</span>=4):
    [{<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387}]
query pagination(offset=1, <span class="hljs-built_in">limit</span>=3):
    [{<span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>}]

=== Start hybrid searching with `random &gt; 0.5` ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.14606499671936035, <span class="hljs-built_in">id</span>: 747), random field: 0.5648774800635661
hit: (distance: 0.1530652642250061, <span class="hljs-built_in">id</span>: 2527), random field: 0.8928974315571507
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
hit: (distance: 0.20354536175727844, <span class="hljs-built_in">id</span>: 2034), random field: 0.5526117606328499
hit: (distance: 0.21908017992973328, <span class="hljs-built_in">id</span>: 958), random field: 0.6647383716417955
search latency = 0.3732s

=== Start deleting with <span class="hljs-built_in">expr</span> `pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` ===

query before delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: 
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.43925103574669633, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1&#x27;</span>}

query after delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: []

=== Drop collection `hello_milvus` ===
<button class="copy-code-btn"></button></code></pre>
<h2 id="Milvus-CLI" class="common-anchor-header">Milvus CLI<button data-href="#Milvus-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>最後，讓我們重新建立<strong>hello_milvus 範例</strong>中的集合，並使用 CLI 來檢查它。</p>
<p>首先編輯<strong>hello_milvus.py</strong>，並註解掉最後兩行：</p>
<pre><code translate="no"><span class="hljs-comment">###############################################################################</span>
<span class="hljs-comment"># 7. drop collection</span>
<span class="hljs-comment"># Finally, drop the hello_milvus collection</span>
<span class="hljs-comment">#print(fmt.format(&quot;Drop collection `hello_milvus`&quot;))</span>
<span class="hljs-comment">#utility.drop_collection(&quot;hello_milvus&quot;)</span>
<button class="copy-code-btn"></button></code></pre>
<p>接下來，安裝<a href="https://github.com/zilliztech/milvus_cli">Milvus 命令列介面 (CLI)</a>，以便與資料庫互動。您可以使用 Python 安裝，也可以<a href="https://github.com/zilliztech/milvus_cli/releases">從發佈頁面下載</a>適合您系統的二進位檔。以下是為 Linux 下載二進位檔的範例：</p>
<pre><code translate="no">$ wget https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
--2023-04-13 09:58:15--  https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-13 09:58:16--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 50254816 (48M) [application/octet-stream]
Saving to: ‘milvus_cli-v0.3.2-Linux’

milvus_cli-v0.3.2-L 100%[===================&gt;]  47.93M  62.7MB/s    <span class="hljs-keyword">in</span> 0.8s    

2023-04-13 09:58:16 (62.7 MB/s) - ‘milvus_cli-v0.3.2-Linux’ saved [50254816/50254816]

$ <span class="hljs-built_in">chmod</span> +x ./milvus_cli-v0.3.2-Linux 
<button class="copy-code-btn"></button></code></pre>
<p>執行修改後的<strong>hello_milvus.py</strong>script，它會在不丟棄資料集的情況下退出。現在，執行 CLI 並連線到您的資料庫。<strong>連線</strong>預設為連線到 localhost 上的 Milvus 實例和預設的連接埠：</p>
<pre><code translate="no">$ ./milvus_cli-v0<span class="hljs-number">.3</span><span class="hljs-number">.2</span>-<span class="hljs-title class_">Linux</span>

  __  __ _ _                    ____ _     ___
 |  \/  (_) |_   ___   _ ___   / ___| |   |_ _|
 | |\/| | | \ \ / <span class="hljs-regexp">/ | | /</span> __| | |   | |    | |
 | |  | | | |\ V /| |_| \__ \ | |___| |___ | |
 |_|  |_|_|_| \_/  \__,_|___/  \____|_____|___|

<span class="hljs-title class_">Milvus</span> cli <span class="hljs-attr">version</span>: <span class="hljs-number">0.3</span><span class="hljs-number">.2</span>
<span class="hljs-title class_">Pymilvus</span> <span class="hljs-attr">version</span>: <span class="hljs-number">2.2</span><span class="hljs-number">.1</span>

<span class="hljs-title class_">Learn</span> <span class="hljs-attr">more</span>: <span class="hljs-attr">https</span>:<span class="hljs-comment">//github.com/zilliztech/milvus_cli.</span>


milvus_cli &gt; connect
<span class="hljs-title class_">Connect</span> <span class="hljs-title class_">Milvus</span> successfully.
+---------+-----------------+
| <span class="hljs-title class_">Address</span> | <span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span>:<span class="hljs-number">19530</span> |
|  <span class="hljs-title class_">User</span>   |                 |
|  <span class="hljs-title class_">Alias</span>  |     <span class="hljs-keyword">default</span>     |
+---------+-----------------+
<button class="copy-code-btn"></button></code></pre>
<p>列出目前的集合，然後用<strong>describe</strong>檢視<strong>hello_milvus</strong>。</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-built_in">list</span> collections
+----+-------------------+
|    | Collection Name   |
+====+===================+
|  <span class="hljs-number">0</span> | hello_milvus      |
+----+-------------------+
milvus_cli &gt; describe collection -c hello_milvus
+---------------+----------------------------------------------------------------------+
| Name          | hello_milvus                                                         |
+---------------+----------------------------------------------------------------------+
| Description   | hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs              |
+---------------+----------------------------------------------------------------------+
| Is Empty      | <span class="hljs-literal">False</span>                                                                |
+---------------+----------------------------------------------------------------------+
| Entities      | <span class="hljs-number">3000</span>                                                                 |
+---------------+----------------------------------------------------------------------+
| Primary Field | pk                                                                   |
+---------------+----------------------------------------------------------------------+
| Schema        | Description: hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs |
|               |                                                                      |
|               | Auto ID: <span class="hljs-literal">False</span>                                                       |
|               |                                                                      |
|               | Fields(* <span class="hljs-keyword">is</span> the primary field):                                      |
|               |  - *pk VARCHAR                                                       |
|               |  - random DOUBLE                                                     |
|               |  - embeddings FLOAT_VECTOR dim: <span class="hljs-number">8</span>                                    |
+---------------+----------------------------------------------------------------------+
| Partitions    | - _default                                                           |
+---------------+----------------------------------------------------------------------+
| Indexes       | - embeddings                                                         |
+---------------+----------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>這個集合有三個欄位。讓我們用查詢來完成，以檢視單一項目內的所有三個欄位。我們將查詢 ID 為 100 的項目。</p>
<p><strong>查詢</strong>指令會提示您幾個選項。若要完成，您需要</p>
<ul>
<li>集合名稱：<strong>hello_milvus</strong></li>
<li>表達<strong>pk == "100"</strong></li>
<li>欄位：<strong>pk、隨機、內嵌</strong></li>
</ul>
<p>接受其他選項的預設值。</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-function">k
Collection <span class="hljs-title">name</span> (<span class="hljs-params">hello_milvus</span>): hello_milvus
The query expression: pk</span> == <span class="hljs-string">&quot;100&quot;</span>
<span class="hljs-function">The names of partitions to <span class="hljs-title">search</span> (<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;_default&#x27;] []: 
Fields to <span class="hljs-title">return</span>(<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;pk&#x27;, &#x27;random&#x27;, &#x27;embeddings&#x27;] []: pk, random, embeddings
timeout []: 
Guarantee timestamp. This instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp <span class="hljs-keyword">is</span> provided, then Milvus will search all operations performed to date. [0]: 
Graceful time. Only used <span class="hljs-keyword">in</span> bounded consistency level. If graceful_time <span class="hljs-keyword">is</span> <span class="hljs-keyword">set</span>, PyMilvus will use current timestamp minus the graceful_time <span class="hljs-keyword">as</span> the guarantee_timestamp. This option <span class="hljs-keyword">is</span> 5s <span class="hljs-keyword">by</span> <span class="hljs-literal">default</span> <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">set</span>. [5]: 
Travel timestamp. Users can specify a timestamp <span class="hljs-keyword">in</span> a search to <span class="hljs-keyword">get</span> results based <span class="hljs-keyword">on</span> a data view at a specified point <span class="hljs-keyword">in</span> time. [0]: 
+----+------+----------+------------------------------------------------------------------------------------------------+
|    |   pk |   random | embeddings                                                                                     |
+</span>====+======+==========+================================================================================================+
|  <span class="hljs-number">0</span> |  <span class="hljs-number">100</span> | <span class="hljs-number">0.576352</span> | [<span class="hljs-number">0.5860017</span>, <span class="hljs-number">0.24227226</span>, <span class="hljs-number">0.8318699</span>, <span class="hljs-number">0.0060517574</span>, <span class="hljs-number">0.27727962</span>, <span class="hljs-number">0.5513293</span>, <span class="hljs-number">0.47201252</span>, <span class="hljs-number">0.6331349</span>] |
+----+------+----------+------------------------------------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>這是欄位及其隨機嵌入。您的值會有所不同。</p>
<h2 id="Wrapping-Up" class="common-anchor-header">總結<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>在本教程中，您使用<a href="https://docs.docker.com/compose/">Docker Compose</a>安裝了 Milvus 及其 Python API 和 CLI。啟動伺服器後，您執行了一個範例程式，將隨機資料播種到伺服器上，然後再使用 CLI 查詢資料庫。</p>
<p>Milvus 是一個功能強大的開放原始碼<a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">向量資料庫</a>引擎，可用於儲存和搜尋大型資料集。現在就試試看，看看它能如何幫助您的多媒體與 AI 專案。  如果您還沒有準備好使用完整版的 Milvus，不妨試試<a href="https://github.com/milvus-io/bootcamp/tree/master/notebooks">Milvus lite</a>。</p>
<p><em>本文作者 Eric Goebelbecker。<a href="http://ericgoebelbecker.com/">Eric</a>在紐約市的金融市場工作了 25 年，開發市場資料和金融資訊交換 (FIX) 通訊協定網路的基礎架構。他喜歡談論是什麼讓團隊變得有效率（或不那麼有效率！）。</em></p>
