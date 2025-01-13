---
id: embedded-milvus.md
title: 使用 Embedded Milvus 即时安装和运行带有 Python 的 Milvus
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: Python 用户友好型 Milvus 版本，使安装更加灵活。
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>封面</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/soothing-rain/">Alex Gao</a>和<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 合著。</p>
</blockquote>
<p>Milvus 是一个面向人工智能应用的开源向量数据库。它提供多种安装方法，包括从源代码构建，以及使用 Docker Compose/ Helm/APT/YUM/Ansible 安装 Milvus。用户可以根据自己的操作系统和偏好选择其中一种安装方法。不过，Milvus 社区中有许多使用 Python 工作的数据科学家和人工智能工程师，他们渴望获得比现有安装方法更简单的安装方法。</p>
<p>因此，我们在发布 Milvus 2.1 的同时，还发布了对 Python 用户友好的嵌入式 Milvus 版本，以增强社区中更多 Python 开发人员的能力。本文将介绍什么是 Embeddings Milvus，并提供如何安装和使用它的说明。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">嵌入式 Milvus 概述</a><ul>
<li><a href="#When-to-use-embedded-Milvus">何时使用嵌入式 Milvus？</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Milvus 不同模式的比较</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">如何安装嵌入式 Milvus</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">启动和停止嵌入式 Milvus</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">嵌入式 Milvus 概述<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">嵌入式 Mil</a>vus 能让你用 Python 快速安装和使用 Milvus。它能快速调用 Milvus 实例，并允许你随时启动和停止 Milvus 服务。即使停止嵌入式 Milvus，所有数据和日志也会持续存在。</p>
<p>嵌入式 Milvus 本身没有任何内部依赖关系，也不需要预先安装和运行任何第三方依赖关系，如 etcd、MinIO、Pulsar 等。</p>
<p>你在嵌入式 Milvus 上所做的一切，以及为它编写的每一段代码，都可以安全地迁移到 Milvus 的其他模式--单机版、集群版、云版本等。这体现了 Embedded Milvus 最显著的特点之一--<strong>"一次编写，随处运行"。</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">何时使用嵌入式 Milvus？</h3><p>Embedded Milvus 和<a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a>的构造目的不同。在以下情况下，您可以考虑选择嵌入式 Milvus：</p>
<ul>
<li><p>你想<a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">在</a>不安装 Milvus 的情况下使用 Milvus。</p></li>
<li><p>想使用 Milvus 而不需要在机器中保留一个长期运行的 Milvus 进程。</p></li>
<li><p>想快速使用 Milvus，而无需启动单独的 Milvus 进程和其他必要组件，如 etcd、MinIO、Pulsar 等。</p></li>
</ul>
<p>建议<strong>不要</strong>使用 Embeddings Milvus：</p>
<ul>
<li><p>在生产环境中。<em>(要将 Milvus 用于生产，请考虑使用 Milvus 集群或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（一种完全托管的 Milvus 服务</em>））<em>。</em></p></li>
<li><p>对性能要求较高。<em>(相对而言，嵌入式 Milvus 可能无法提供最佳性能</em>）<em>。</em></p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Milvus 不同模式的比较</h3><p>下表比较了 Milvus 的几种模式：Standalone、集群、嵌入式 Milvus 和完全托管的 Milvus 服务 Zilliz Cloud。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>比较</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">如何安装嵌入式 Milvus？<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在安装嵌入式 Milvus 之前，首先需要确保安装了 Python 3.6 或更高版本。Embedded Milvus 支持以下操作系统：</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>如果满足要求，可以运行<code translate="no">$ python3 -m pip install milvus</code> 安装 Embeddings Milvus。你也可以在命令中添加版本，安装特定版本的嵌入式 Milvus。例如，如果要安装 2.1.0 版本，请运行<code translate="no">$ python3 -m pip install milvus==2.1.0</code> 。以后有新版本的嵌入式 Milvus 发布时，也可以运行<code translate="no">$ python3 -m pip install --upgrade milvus</code> 将嵌入式 Milvus 升级到最新版本。</p>
<p>如果你是 Milvus 的老用户，以前已经安装过 PyMilvus，现在想安装嵌入式 Milvus，可以运行<code translate="no">$ python3 -m pip install --no-deps milvus</code> 。</p>
<p>运行安装命令后，需要在<code translate="no">/var/bin/e-milvus</code> 下为嵌入式 Milvus 创建一个数据文件夹，方法是运行以下命令：</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">启动和停止嵌入式 Milvus<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>安装成功后，即可启动服务。</p>
<p>如果第一次运行嵌入式 Milvus，需要先导入 Milvus 并设置嵌入式 Milvus。</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>如果之前已经成功启动过嵌入式 Milvus，回来重新启动，则可以在导入 Milvus 后直接运行<code translate="no">milvus.start()</code> 。</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>如果成功启动了嵌入式 Milvus 服务，你将看到如下输出。</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>服务启动后，你可以启动另一个终端窗口，运行<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">&quot;Hello Milvus</a>&quot;的示例代码来玩转嵌入式 Milvus！</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>完成嵌入式 Milvus 的使用后，建议优雅地停止它，并运行以下命令或按 Ctrl-D 键清理环境变量。</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
