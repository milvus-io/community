---
id: 2021-12-31-get-started-with-milvus-cli.md
title: 开始使用 Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: 本文介绍 Milvus_CLI，帮助你完成常见任务。
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>在信息爆炸的时代，我们无时无刻不在产生语音、图像、视频和其他非结构化数据。我们该如何高效地分析这些海量数据呢？神经网络的出现使得非结构化数据可以以向量的形式嵌入，而 Milvus 数据库作为一款基础数据服务软件，可以帮助完成向量数据的存储、搜索和分析。</p>
<p>但如何才能快速使用Milvus向量数据库呢？</p>
<p>一些用户抱怨API很难记忆，希望能有简单的命令行来操作Milvus数据库。</p>
<p>我们非常高兴地向大家介绍Milvus_CLI，一个专门用于Milvus向量数据库的命令行工具。</p>
<p>Milvus_CLI 是 Milvus 方便的数据库 CLI，支持使用 shell 中的交互式命令进行数据库连接、数据导入、数据导出和向量计算。最新版本的 Milvus_CLI 具有以下功能。</p>
<ul>
<li><p>支持所有平台，包括 Windows、Mac 和 Linux</p></li>
<li><p>支持使用 pip 进行在线和离线安装</p></li>
<li><p>可移植，可在任何地方使用</p></li>
<li><p>基于针对 Python 的 Milvus SDK 构建</p></li>
<li><p>包含帮助文档</p></li>
<li><p>支持自动完成</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">安装<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>你可以在线或离线安装 Milvus_CLI。</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">在线安装 Milvus_CLI</h3><p>运行以下命令，使用 pip 在线安装 Milvus_CLI。需要 Python 3.8 或更高版本。</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">离线安装 Milvus_CLI</h3><p>要离线安装 Milvus_CLI，请先从发布页面<a href="https://github.com/milvus-io/milvus_cli/releases">下载</a>最新的压缩包。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>下载完 tar 包后，运行以下命令安装 Milvus_CLI。</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Milvus_CLI 安装完成后，运行<code translate="no">milvus_cli</code> 。出现<code translate="no">milvus_cli &gt;</code> 提示表示命令行已准备就绪。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>如果使用的是带有 M1 芯片的 Mac 或没有 Python 环境的 PC，可以选择使用便携式应用程序。要做到这一点，请在与您的操作系统相对应的发布页面上<a href="https://github.com/milvus-io/milvus_cli/releases">下载</a>一个文件，在该文件上运行<code translate="no">chmod +x</code> 使其可执行，然后在该文件上运行<code translate="no">./</code> 以运行它。</p>
<h4 id="Example" class="common-anchor-header"><strong>示例</strong></h4><p>下面的示例使<code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> 可执行并运行它。</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">使用方法<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">连接 Milvus</h3><p>在连接 Milvus 之前，确保服务器上安装了 Milvus。更多信息，请参阅<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">安装 Milvus Standalone</a>或<a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">安装 Milvus Cluster</a>。</p>
<p>如果 Milvus 安装在默认端口的本地主机上，请运行<code translate="no">connect</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>否则，请使用 Milvus 服务器的 IP 地址运行以下命令。以下示例使用<code translate="no">172.16.20.3</code> 作为 IP 地址，使用<code translate="no">19530</code> 作为端口号。</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">创建 Collections</h3><p>本节介绍如何创建 Collections。</p>
<p>Collections 由实体组成，类似于 RDBMS 中的表。更多信息请参见<a href="https://milvus.io/docs/v2.0.x/glossary.md">术语表</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">示例</h4><p>下面的示例创建了一个名为<code translate="no">car</code> 的 Collection。<code translate="no">car</code> 集合有四个字段，分别是<code translate="no">id</code>,<code translate="no">vector</code>,<code translate="no">color</code> 和<code translate="no">brand</code> 。主键字段是<code translate="no">id</code> 。更多信息，请参阅<a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">创建 Collection</a>。</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">列出集合</h3><p>运行以下命令，列出此 Milvus 实例中的所有 Collections。</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>运行以下命令检查<code translate="no">car</code> Collection 的详细信息。</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">计算两个向量之间的距离</h3><p>运行以下命令将数据导入<code translate="no">car</code> Collections。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>运行<code translate="no">query</code> ，并在提示时输入<code translate="no">car</code> 作为 Collections 名称，输入<code translate="no">id&gt;0</code> 作为查询表达式。如下图所示，符合条件的实体 ID 将被返回。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>运行<code translate="no">calc</code> 并在提示时输入适当的值，以计算向量数组之间的距离。</p>
<h3 id="Delete-a-collection" class="common-anchor-header">删除 Collections</h3><p>运行以下命令删除<code translate="no">car</code> Collections。</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">更多信息<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI 不限于上述功能。运行<code translate="no">help</code> 查看 Milvus_CLI 包含的所有命令及相关说明。运行<code translate="no">&lt;command&gt; --help</code> 查看指定命令的详细信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>另请参阅：</strong></p>
<p>Milvus Docs 下的<a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLI 命令参考</a></p>
<p>我们希望 Milvus_CLI 能够帮助您轻松使用 Milvus 向量数据库。我们将继续优化 Milvus_CLI，并欢迎您的贡献。</p>
<p>如果您有任何问题，请随时在 GitHub 上<a href="https://github.com/zilliztech/milvus_cli/issues">提交问题</a>。</p>
