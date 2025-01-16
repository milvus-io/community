---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: Milvus Lite 简介：Milvus 的轻量级版本
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: 体验 Milvus Lite 的速度和效率，它是著名的 Milvus 向量数据库的轻量级变体，可进行快如闪电的相似性搜索。
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>重要说明</em></strong></p>
<p><em>我们于 2024 年 6 月升级了 Milvus Lite，使人工智能开发人员能够更快地构建应用程序，同时确保在各种部署选项（包括 Kurbernetes 上的 Milvus、Docker 和托管云服务）中获得一致的体验。Milvus Lite 还集成了各种人工智能框架和技术，通过向量搜索功能简化了人工智能应用的开发。欲了解更多信息，请参阅以下参考资料：</em></p>
<ul>
<li><p><em>Milvus Lite 发布博客：h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Milvus Lite 文档：<a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Milvus Lite GitHub 存储库：<a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a>是一个开源向量数据库，专门用于索引、存储和查询由深度神经网络和其他机器学习（ML）模型生成的数十亿规模的 embedding 向量。它已成为许多必须在大规模数据集上执行相似性搜索的公司、研究人员和开发人员的首选。</p>
<p>不过，有些用户可能会觉得完整版 Milvus 太重或太复杂。为了解决这个问题，Milvus 社区最活跃的贡献者之一<a href="https://github.com/matrixji">Bin Ji</a> 创建了 Milvus<a href="https://github.com/milvus-io/milvus-lite">Lite</a>，一个轻量级的 Milvus 版本。</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Milvus Lite 是什么？<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>是 Milvus 的简化替代品，它具有如此多的优点和好处。</p>
<ul>
<li>你可以将它集成到你的 Python 应用程序中，而不会增加额外的重量。</li>
<li>由于 Milvus Standalone 能够与嵌入式 Etcdings 和本地存储协同工作，因此它自成一体，不需要任何其他依赖项。</li>
<li>你可以将它作为 Python 库导入，也可以将它作为基于命令行界面（CLI）的独立服务器使用。</li>
<li>它能与 Google Colab 和 Jupyter Notebook 顺利配合。</li>
<li>你可以安全地将工作和编写的代码迁移到其他 Milvus 实例（单机版、集群版和完全托管版），而不会有任何丢失数据的风险。</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">什么时候应该使用 Milvus Lite？<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>具体来说，Milvus Lite 在以下情况下最有帮助：</p>
<ul>
<li>当你喜欢在没有<a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>、<a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> 或<a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a> 等容器技术和工具的情况下使用 Milvus 时。</li>
<li>使用 Milvus 时不需要虚拟机或容器。</li>
<li>希望在 Python 应用程序中加入 Milvus 功能时。</li>
<li>想在 Colab 或 Notebook 中启动 Milvus 实例进行快速实验时。</li>
</ul>
<p><strong>注意</strong>：如果你需要高性能、高可用性或高可扩展性，我们不建议在任何生产环境中使用 Milvus Lite。相反，请考虑在生产环境中使用<a href="https://github.com/milvus-io/milvus">Milvus 集群</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud 上完全托管的 Milvus</a>。</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">如何开始使用 Milvus Lite？<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，让我们来看看如何安装、配置和使用 Milvus Lite。</p>
<h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><p>要使用 Milvus Lite，请确保已完成以下要求：</p>
<ul>
<li>安装 Python 3.7 或更高版本。</li>
<li>使用下列经过验证的操作系统之一：<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>备注</strong>：</p>
<ol>
<li>Milvus Lite 使用<code translate="no">manylinux2014</code> 作为基础镜像，使其与大多数 Linux 发行版兼容，适合 Linux 用户使用。</li>
<li>在 Windows 上运行 Milvus Lite 也是可能的，不过这还有待全面验证。</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">安装 Milvus Lite</h3><p>Milvus Lite 在 PyPI 上提供，因此你可以通过<code translate="no">pip</code> 安装。</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>你也可以按如下方法用 PyMilvus 安装它：</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">使用并启动 Milvus Lite</h3><p>从我们项目库的示例文件夹下载示例<a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">笔记本</a>。你有两个使用 Milvus Lite 的选择：要么将它作为 Python 库导入，要么使用 CLI 将它作为独立服务器在你的机器上运行。</p>
<ul>
<li>要将 Milvus Lite 作为 Python 模块启动，请执行以下命令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要暂停或停止 Milvus Lite，使用<code translate="no">with</code> 语句。</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要将 Milvus Lite 作为基于 CLI 的独立服务器启动，请运行以下命令：</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>启动 Milvus Lite 后，你可以使用 PyMilvus 或其他你喜欢的工具连接到独立服务器。</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">以调试模式启动 Milvus Lite</h3><ul>
<li>要以 Python 模块的调试模式运行 Milvus Lite，请执行以下命令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要在调试模式下运行独立服务器，请执行以下命令：</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">保存数据和日志</h3><ul>
<li>要为 Milvus Lite 创建一个包含所有相关数据和日志的本地目录，请执行以下命令：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要在本地硬盘上保存独立服务器生成的所有数据和日志，请执行以下命令：</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">配置 Milvus Lite</h3><p>配置 Milvus Lite 与使用 Python API 或 CLI 设置 Milvus 实例类似。</p>
<ul>
<li>要使用 Python API 配置 Milvus Lite，请使用<code translate="no">MilvusServer</code> 实例的<code translate="no">config.set</code> API 进行基本和额外设置：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>要使用 CLI 配置 Milvus Lite，运行以下命令进行基本设置：</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>或运行以下命令进行额外配置。</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>所有可配置项目都在 Milvus 软件包随附的<code translate="no">config.yaml</code> 模板中。</p>
<p>有关如何安装和配置 Milvus Lite 的更多技术细节，请参阅我们的<a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">文档</a>。</p>
<h2 id="Summary" class="common-anchor-header">概述<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite 是那些希望以简洁格式获得 Milvus 功能的用户的最佳选择。无论您是研究人员、开发人员还是数据科学家，都值得一试。</p>
<p>Milvus Lite 也是开源社区的一道亮丽风景线，展示了贡献者们的非凡工作。在季斌的努力下，Milvus 现在可以供更多用户使用了。我们迫不及待地想看到季斌和 Milvus 社区其他成员在未来带来的创新想法。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">让我们保持联系！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您在安装或使用 Milvus Lite 时遇到问题，可以<a href="https://github.com/milvus-io/milvus-lite/issues/new">在这里提交问题</a>，或通过<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 联系我们。我们也欢迎你加入我们的<a href="https://milvus.io/slack/">Slack 频道</a>，与我们的工程师和整个社区聊天，或者查看<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">我们的周二办公时间</a>！</p>
