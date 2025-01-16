---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: 技術分享：使用 Docker Compose 在 Milvus 2.0 上套用組態變更
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: 學習如何在 Milvus 2.0 上應用組態變更
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>技術分享：使用 Docker Compose 在 Milvus 2.0 上應用配置變更</custom-h1><p><em>贾晶晶，Zilliz 数据工程师，毕业于西安交通大学计算机专业。加入Zilliz后，主要从事数据预处理、AI模型部署、Milvus相关技术研究，以及帮助社区用户实现应用场景。她非常有耐心，喜歡和社區夥伴溝通，喜歡聽音樂和看動漫。</em></p>
<p>身為 Milvus 的常客，我對於新發布的 Milvus 2.0 RC 感到非常興奮。根據官網上的介紹，Milvus 2.0 似乎在很大程度上超越了前代產品。我非常渴望親自試用一下。</p>
<p>我真的試了。  然而，當我真正拿到Milvus 2.0時，我發現我無法像使用Milvus 1.1.1那樣輕易修改Milvus 2.0的配置文件。我無法在Docker Compose啟動的Milvus 2.0的docker容器裡修改設定檔，甚至強制修改也無法生效。後來我知道 Milvus 2.0 RC 在安裝後，無法偵測到設定檔的變更。而未來的穩定版會修正這個問題。</p>
<p>在嘗試了不同的方法之後，我找到了一個可靠的方法來套用 Milvus 2.0 standalone &amp; cluster 的設定檔變更，方法如下。</p>
<p>請注意，所有設定變更必須在使用 Docker Compose 重新啟動 Milvus 之前完成。</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">修改 Milvus 單機的設定檔<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，您需要<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下載</a>一份<strong>milvus.yaml</strong>檔案到您的本機裝置。</p>
<p>然後，您可以變更檔案中的設定。例如，您可以將日誌格式變更為<code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>修改了<strong>milvus.yaml</strong>檔案之後，您也需要<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">下載並</a>修改單機版的<strong>docker-compose.yaml</strong>檔案，將本機的 milvus.yaml 路徑映射到對應的 docker 容器路徑，然後將配置檔案<code translate="no">/milvus/configs/milvus.yaml</code> 放到<code translate="no">volumes</code> 部分。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>最後，使用<code translate="no">docker-compose up -d</code> 啟動 Milvus standalone 並檢查修改是否成功。例如，執行<code translate="no">docker logs</code> 檢查日誌格式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">修改 Milvus 集群的配置文件<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下載</a>並根據您的需求修改<strong>milvus.yaml</strong>檔案。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>然後，您需要<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">下載並</a>修改叢集的<strong>docker-compose.yml</strong>檔案，將本機的<strong>milvus.yaml</strong>路徑對應到所有元件中的設定檔路徑，也就是 root coord、data coord、data node、query coord、query node、index coord、index node 和 proxy。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>.<span class="img-wrapper">7 </span>.<span class="img-wrapper"> <span>png</span> </span></p>
<p>最後，您可以使用<code translate="no">docker-compose up -d</code> 啟動 Milvus 叢集，並檢查修改是否成功。</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">更改配置文件中的日誌文件路徑<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下載</a> <strong>milvus.yaml</strong>檔案，並修改<code translate="no">rootPath</code> 部分為您期望在 Docker 容器中儲存日誌檔案的目錄。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>之後，下載相對應的<strong>docker-compose.yml</strong>檔案給 Milvus<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a>或<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>。</p>
<p>對於單機版，您需要將本機的<strong>milvus.yaml</strong>路徑映射到相對應的docker容器路徑上的配置檔<code translate="no">/milvus/configs/milvus.yaml</code> ，並將本機的日誌檔目錄映射到之前建立的Docker容器目錄上。</p>
<p>對於集群，您需要在每個元件中對應這兩個路徑。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>最後，使用<code translate="no">docker-compose up -d</code> 啟動 Milvus 單機或集群，並檢查日誌檔案，看看修改是否成功。</p>
