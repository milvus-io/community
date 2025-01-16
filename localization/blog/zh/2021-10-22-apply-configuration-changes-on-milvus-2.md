---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: 技术分享：使用 Docker Compose 在 Milvus 2.0 上应用配置更改
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: 了解如何在 Milvus 2.0 上应用配置更改
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>技术分享：使用Docker Compose在Milvus 2.0上应用配置变更</custom-h1><p><em>贾晶晶，Zilliz 数据工程师，毕业于西安交通大学计算机专业。加入Zilliz后，主要从事数据预处理、AI模型部署、Milvus相关技术研究，以及帮助社区用户实现应用场景。她很有耐心，喜欢与社区伙伴交流，喜欢听音乐和看动漫。</em></p>
<p>作为Milvus的常客，我对新发布的Milvus 2.0 RC非常期待。根据官方网站上的介绍，Milvus 2.0 似乎在很大程度上超越了它的前辈们。我迫不及待地想亲自体验一下。</p>
<p>我确实试了。  然而，当我真正接触到 Milvus 2.0 时，我发现我无法像使用 Milvus 1.1.1 那样轻松地修改 Milvus 2.0 中的配置文件。我无法在使用 Docker Compose 启动的 Milvus 2.0 docker 容器中修改配置文件，甚至强行修改也不会生效。后来，我了解到 Milvus 2.0 RC 在安装后无法检测到配置文件的更改。未来的稳定版将修复这个问题。</p>
<p>在尝试了不同的方法之后，我找到了一种可靠的方法来应用对 Milvus 2.0 单机版和集群版配置文件的更改，具体方法如下。</p>
<p>请注意，必须在使用 Docker Compose 重启 Milvus 之前更改所有配置。</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">修改 Milvus 单机版的配置文件<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，你需要<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下载</a>一份<strong>milvus.yaml</strong>文件到本地设备。</p>
<p>然后，你可以更改文件中的配置。例如，可以将日志格式改为<code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>修改了<strong>Milvus.yaml</strong>文件后，还需要<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">下载</a>并修改用于独立运行的<strong>docker-compose</strong>.<strong>yaml</strong>文件，将本地到 Milvus.yaml 的路径映射到<code translate="no">volumes</code> 部分下配置文件<code translate="no">/milvus/configs/milvus.yaml</code> 对应的 docker 容器路径上。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>最后，使用<code translate="no">docker-compose up -d</code> 启动 Milvus Standalone，检查修改是否成功。例如，运行<code translate="no">docker logs</code> 检查日志格式。</p>
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
    </button></h2><p>首先，<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下载</a>并根据需要修改<strong>milvus.yaml</strong>文件。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>然后，你需要<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">下载</a>并修改集群的<strong>docker-compose.yml</strong>文件，将<strong>milvus.yaml</strong>的本地路径映射到所有组件中配置文件的相应路径上，即根坐标、数据坐标、数据节点、查询坐标、查询节点、索引坐标、索引节点和代理。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>.<span class="img-wrapper">7 </span>.<span class="img-wrapper"> <span>png</span> </span></p>
<p>最后，可以使用<code translate="no">docker-compose up -d</code> 启动 Milvus 集群，检查修改是否成功。</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">更改配置文件中的日志文件路径<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>首先，<a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">下载</a> <strong>Milvus.yaml</strong>文件，并将<code translate="no">rootPath</code> 部分修改为你期望在 Docker 容器中存储日志文件的目录。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>之后，为 Milvus<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">单机版</a>或<a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">集群</a>下载相应的<strong>docker-compose.yml</strong>文件。</p>
<p>对于单机版，你需要将本地的<strong>milvus.yaml</strong>路径映射到配置文件<code translate="no">/milvus/configs/milvus.yaml</code> 对应的 docker 容器路径上，并将本地的日志文件目录映射到你之前创建的 Docker 容器目录上。</p>
<p>对于集群，你需要在每个组件中映射这两个路径。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>最后，使用<code translate="no">docker-compose up -d</code> 启动 Milvus Standalone 或集群，查看日志文件是否修改成功。</p>
