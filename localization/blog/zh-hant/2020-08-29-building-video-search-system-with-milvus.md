---
id: building-video-search-system-with-milvus.md
title: 系統概觀
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: 使用 Milvus 以影像搜尋影片
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>建立視訊搜尋系統的 4 個步驟</custom-h1><p>顧名思義，透過影像搜尋視訊就是從儲存庫中擷取包含與輸入影像相似畫格的視訊。其中一個關鍵步驟是將視訊轉換為嵌入，也就是擷取關鍵畫面並將其特徵轉換為向量。現在，有些好奇的讀者可能會問，以影像搜尋視訊與以影像搜尋影像有何不同？事實上，搜尋視訊中的關鍵畫面等同於以影像搜尋影像。</p>
<p>如果您有興趣，可以參考我們之前的文章<a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG：建立一個以內容為基礎的圖像檢索系統</a>。</p>
<h2 id="System-overview" class="common-anchor-header">系統概觀<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>下圖說明了這種視訊搜尋系統的典型工作流程。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-search-system-workflow.png</span> </span></p>
<p>匯入影片時，我們使用 OpenCV 函式庫將每段影片切割成不同的畫格，再使用影像特徵萃取模型 VGG 擷取關鍵畫格的向量，然後將擷取的向量 (嵌入) 插入 Milvus。我們使用 Minio 來儲存原始影片，並使用 Redis 來儲存影片與向量之間的關聯性。</p>
<p>搜尋影片時，我們使用相同的 VGG 模型將輸入影像轉換為特徵向量，並將其插入 Milvus，以找出相似度最高的向量。接著，系統會根據 Redis 中的關聯值，在介面上從 Minio 擷取對應的影片。</p>
<h2 id="Data-preparation" class="common-anchor-header">資料準備<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>在本文中，我們使用 Tumblr 中約 100,000 個 GIF 檔案作為樣本資料集，以建立搜尋視訊的端對端解決方案。您可以使用自己的視訊資料庫。</p>
<h2 id="Deployment" class="common-anchor-header">部署<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>本文中建立視訊檢索系統的程式碼在 GitHub 上。</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">步驟 1：建立 Docker 映像檔。</h3><p>影片檢索系統需要 Milvus v0.7.1 docker、Redis docker、Minio docker、前端介面 docker 以及後端 API docker。前端介面的 docker 和後端 API 的 docker 需要自己建立，其他三個 docker 可以直接從 Docker Hub 拉取。</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">步驟二：設定環境。<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>這裡我們使用 docker-compose.yml 來管理上述五個容器。有關 docker-compose.yml 的設定，請參閱下表：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>上表中的 IP 位址 192.168.1.38 是特別為了建立本文的影片擷取系統所設定的伺服器位址。您需要將它更新為您的伺服器位址。</p>
<p>您需要手動建立 Milvus、Redis 和 Minio 的儲存目錄，然後在 docker-compose.yml 中加入相對應的路徑。在這個範例中，我們建立了下列目錄：</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>您可以在 docker-compose.yml 中設定 Milvus、Redis 和 Minio，如下所示：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">步驟 3：啟動系統。<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>使用修改過的 docker-compose.yml，啟動視訊擷取系統所使用的五個 docker 容器：</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>然後，您可以執行 docker-compose ps 來檢查五個 docker 容器是否已經正常啟動。下面的截圖顯示了成功啟動後的典型介面。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>現在，您已經成功地建立了一個影片搜尋系統，雖然資料庫裡沒有影片。</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">步驟 4：匯入影片。<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>在系統資源庫的部署目錄中，鋪上 import_data.py，用來匯入影片的腳本。您只需要更新視訊檔案的路徑和匯入時間間隔，就可以執行腳本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-path-video.png</span> </span></p>
<p>data_path：要匯入影片的路徑。</p>
<p>time.sleep(0.5)：系統匯入影片的間隔。我們用來建立影片搜尋系統的伺服器有 96 個 CPU 核心。因此，建議將間隔時間設定為 0.5 秒。如果您的伺服器 CPU 核心數較少，請將時間間隔設定為較大的值。否則，匯入過程會對 CPU 造成負擔，並產生殭屍進程。</p>
<p>執行 import_data.py 匯入影片。</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>影片匯入後，您就可以使用自己的影片搜尋系統了！</p>
<h2 id="Interface-display" class="common-anchor-header">介面顯示<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>開啟瀏覽器，輸入 192.168.1.38:8001 即可看到影片搜尋系統的介面，如下圖所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>切換右上方的齒輪開關，即可檢視資源庫中的所有影片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-view-all-videos-repository.png</span> </span></p>
<p>按一下左上方的上傳框，輸入目標影像。如下圖所示，系統會傳回包含最相似畫格的影片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-recommender-system-cats.png</span> </span></p>
<p>接下來，享受我們的影片搜尋系統的樂趣！</p>
<h2 id="Build-your-own" class="common-anchor-header">建立您自己的系統<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇文章中，我們使用 Milvus 建立了一個以影像搜尋影片的系統。這體現了 Milvus 在非結構化資料處理上的應用。</p>
<p>Milvus 與多種深度學習框架相容，可在幾毫秒內搜尋數以十億計的向量。歡迎帶著 Milvus 進入更多 AI 應用場景：https://github.com/milvus-io/milvus。</p>
<p>不要覺得陌生，請關注我們的<a href="https://twitter.com/milvusio/">Twitter</a>或加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>！👇🏻。</p>
