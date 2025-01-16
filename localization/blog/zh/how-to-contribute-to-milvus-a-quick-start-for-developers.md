---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 如何为 Milvus 做贡献：开发人员快速入门指南
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a>是一个开源<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>，旨在管理高维向量数据。无论您是要构建智能搜索引擎、推荐系统，还是下一代人工智能解决方案<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（</a>如检索增强生成<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">（RAG</a>）），Milvus 都是您唾手可得的强大工具。</p>
<p>但是，真正推动 Milvus 向前发展的不仅仅是其先进的技术，还有其背后充满活力和激情的<a href="https://zilliz.com/community">开发者社区</a>。作为一个开源项目，Milvus 的蓬勃发展得益于像您这样的开发人员的贡献。来自社区的每一次错误修复、功能添加和性能提升，都让 Milvus 变得更快、更可扩展、更可靠。</p>
<p>无论您是热衷于开源、渴望学习，还是希望在人工智能领域产生持久影响，Milvus 都是您贡献力量的理想场所。本指南将指导您完成从设置开发环境到提交第一个拉取请求的整个过程。我们还将强调您可能面临的常见挑战，并提供克服这些挑战的解决方案。</p>
<p>准备好了吗？让我们一起把 Milvus 做得更好！</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">设置你的 Milvus 开发环境<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>第一件事：设置开发环境。你可以在本地计算机上安装 Milvus，也可以使用 Docker--这两种方法都很简单，但你还需要安装一些第三方依赖项来运行一切。</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">在本地构建 Milvus</h3><p>如果你喜欢从头开始构建，那么在本地机器上构建 Milvus 将轻而易举。Milvus 在<code translate="no">install_deps.sh</code> 脚本中捆绑了所有依赖项，从而使构建变得简单。下面是快速设置：</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">使用 Docker 构建 Milvus</h3><p>如果你喜欢使用 Docker，有两种方法：你可以在预构建的容器中运行命令，也可以启动一个开发容器来进行更多实践。</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>平台说明：</strong>如果你使用的是 Linux，那么你就可以使用了--编译问题非常罕见。不过，Mac 用户，尤其是使用 M1 芯片的 Mac 用户，可能会在编译过程中遇到一些问题。不过不用担心，我们有一份指南可以帮助你解决最常见的问题。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图操作系统配置</em></p>
<p>有关完整的设置指南，请查阅官方的《<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus 开发指南》</a>。</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">常见问题及解决方法</h3><p>有时，Milvus 开发环境的设置并不像计划的那样顺利。别担心，以下是常见问题的简要介绍，以及如何快速解决这些问题。</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">自制软件：读取边带数据包时意外断开连接</h4><p>如果您正在使用 Homebrew 并看到类似这样的错误：</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>修复方法：</strong>增加<code translate="no">http.postBuffer</code> 的大小：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>如果你在安装 Homebrew 后也遇到<code translate="no">Brew: command not found</code> ，你可能需要设置 Git 用户配置：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker：获取凭证出错</h4><p>在使用 Docker 时，你可能会看到这样的错误：</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修复：</strong>打开<code translate="no">~/.docker/config.json</code> 并删除<code translate="no">credsStore</code> 字段。</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python：没有名为 "imp "的模块</h4><p>如果 Python 抛出此错误，这是因为 Python 3.12 删除了<code translate="no">imp</code> 模块，而一些旧的依赖项仍在使用该模块。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修复：</strong>降级到 Python 3.11：</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">柯南：未识别参数或未找到命令</h4><p><strong>问题：</strong>如果您看到<code translate="no">Unrecognized arguments: --install-folder conan</code> ，您可能使用了不兼容的 Conan 版本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修复：</strong>降级到 Conan 1.61：</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>问题：</strong>如果您看到<code translate="no">Conan command not found</code> ，这意味着您的 Python 环境没有正确设置。</p>
<p><strong>修复：</strong>将 Python 的 bin 目录添加到<code translate="no">PATH</code> ：</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM：使用未声明的标识符 "kSecFormatOpenSSL</h4><p>该错误通常意味着您的 LLVM 依赖项过时。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修复方法</strong>重新安装 LLVM 15 并更新环境变量：</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>专业提示</strong></p>
<ul>
<li><p>始终仔细检查工具版本和依赖关系。</p></li>
<li><p>如果仍有问题，<a href="https://github.com/milvus-io/milvus/issues"> Milvus GitHub Issues 页面</a>是寻找答案或寻求帮助的好地方。</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">配置 VS 代码以集成 C++ 和 Go</h3><p>让 C++ 和 Go 在 VS Code 中协同工作比听起来容易得多。通过正确的设置，你可以简化 Milvus 的开发流程。只需用下面的配置调整<code translate="no">user.settings</code> 文件即可：</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>以下是该配置的作用：</p>
<ul>
<li><p><strong>环境变量：</strong>为<code translate="no">PKG_CONFIG_PATH</code> 、<code translate="no">LD_LIBRARY_PATH</code> 和<code translate="no">RPATH</code> 设置路径，它们对于在构建和测试过程中定位库至关重要。</p></li>
<li><p><strong>Go 工具集成：</strong>启用 Go 语言服务器 (<code translate="no">gopls</code>) 并配置用于格式化的工具<code translate="no">gofumpt</code> 和用于内衬的工具<code translate="no">golangci-lint</code> 。</p></li>
<li><p><strong>测试设置：</strong>添加<code translate="no">testTags</code> ，并将运行测试的超时时间延长至 10 分钟。</p></li>
</ul>
<p>添加后，该设置可确保 C++ 和 Go 工作流之间的无缝集成。它是构建和测试 Milvus 的完美工具，无需不断调整环境。</p>
<p><strong>专业提示</strong></p>
<p>设置完成后，运行快速测试构建以确认一切正常。如果感觉不对劲，请仔细检查路径和 VS Code 的 Go 扩展版本。</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">部署 Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 支持<a href="https://milvus.io/docs/install-overview.md">三种部署模式：</a>Milvus<a href="https://milvus.io/docs/install-overview.md">Lite</a><strong>、</strong>Milvus<strong>Standalone</strong>和 Milvus<strong>Distributed。</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a>是一个 Python 库，也是 Milvus 的超轻量级版本。它非常适合在 Python 或笔记本环境中进行快速原型开发以及小规模本地实验。</p></li>
<li><p><strong>Milvus Standalone</strong>是 Milvus 的单节点部署选项，采用客户端-服务器模型。它相当于 Milvus 的 MySQL，而 Milvus Lite 则像 SQLite。</p></li>
<li><p><strong>Milvus Distributed</strong>是 Milvus 的分布式模式，非常适合企业用户构建大型向量数据库系统或向量数据平台。</p></li>
</ul>
<p>所有这些部署都依赖于三个核心组件：</p>
<ul>
<li><p><strong>Milvus：</strong>驱动所有操作的向量数据库引擎。</p></li>
<li><p><strong>Etcd：</strong>管理 Milvus 内部元数据的元数据引擎。</p></li>
<li><p><strong>MinIO：</strong>确保数据持久性的存储引擎。</p></li>
</ul>
<p>在<strong>分布式</strong>模式下运行时，Milvus 还结合了<strong>Pulsar</strong>，使用 Pub/Sub 机制进行分布式消息处理，使其可扩展到高吞吐量环境。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus 单机版</h3><p>单机模式专为单实例设置而设计，非常适合测试和小规模应用。下面介绍如何开始使用：</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed（以前称为 Milvus 集群）</h3><p>对于较大的数据集和较高的流量，分布式模式提供了横向可扩展性。它将多个 Milvus 实例组合成一个具有凝聚力的系统。<strong>Milvus Operator</strong> 可在 Kubernetes 上<strong>操作</strong>，并为您管理整个 Milvus 堆栈，使部署变得更容易。</p>
<p>需要逐步指导吗？查看<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus 安装指南</a>。</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">运行端到端（E2E）测试<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 部署启动并运行后，使用 E2E 测试可轻松测试其功能。这些测试涵盖设置的每个部分，以确保一切按预期运行。下面介绍如何运行这些测试：</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>有关深入说明和故障排除技巧，请参阅《<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus 开发指南</a>》。</p>
<p><strong>专业提示</strong></p>
<p>如果你是 Milvus 的新用户，请从 Milvus Lite 或 Standalone 模式开始，先了解其功能，然后再升级到 Distributed 模式，以应对生产级工作负载。</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">提交代码<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜你！您已通过所有单元测试和 E2E 测试（或根据需要进行调试和重新编译）。虽然第一次编译可能需要一些时间，但以后的编译会更快，所以不必担心。一切通过后，你就可以提交修改，为 Milvus 做贡献了！</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">将您的拉取请求（PR）链接到问题</h3><p>提交给 Milvus 的每个 PR 都需要与相关问题绑定。下面是如何处理的方法：</p>
<ul>
<li><p><strong>检查现有问题：</strong>查看<a href="https://github.com/milvus-io/milvus/issues"> Milvus 问题跟踪器</a>，看看是否已有与您的更改相关的问题。</p></li>
<li><p><strong>创建新问题：</strong>如果不存在相关问题，则打开一个新问题，并解释您要解决的问题或添加的功能。</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">提交代码</h3><ol>
<li><p><strong>分叉仓库：</strong>首先将<a href="https://github.com/milvus-io/milvus"> Milvus 代码库</a>分叉到你的 GitHub 账户。</p></li>
<li><p><strong>创建分支：</strong>在本地克隆你的分叉，并为你的修改创建一个新的分支。</p></li>
<li><p><strong>使用签名提交：</strong>确保您的提交包含<code translate="no">Signed-off-by</code> 签名，以遵守开源许可协议：</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>此步骤证明您的贡献符合开发者原产地证书 (DCO)。</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>有用资源</strong></h4><p>有关详细步骤和最佳实践，请查阅<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvus 贡献指南</a>。</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">贡献机会<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜--你已经启动并运行 Milvus！您已经探索了它的部署模式，运行了您的测试，也许还深入研究了代码。现在是提升水平的时候了：为<a href="https://github.com/milvus-io/milvus">Milvus</a>做出贡献，帮助塑造人工智能和<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>的未来。</p>
<p>无论您的技能如何，Milvus 社区都有您的一席之地！无论您是喜欢解决复杂挑战的开发人员，还是喜欢撰写简洁文档或工程博客的技术作家，抑或是希望改善部署的 Kubernetes 爱好者，您都可以在这里大显身手。</p>
<p>看看下面的机会，找到您的完美匹配。每一份贡献都有助于推动 Milvus 的发展，谁知道呢？您的下一个拉取请求可能会推动下一波创新。还等什么？让我们开始吧！🚀</p>
<table>
<thead>
<tr><th>项目</th><th>适用于</th><th>指南</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>,<a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Go 开发人员</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>、<a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP 开发人员</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>,<a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>,<a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>对其他语言感兴趣的开发者</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">为 PyMilvus 做贡献</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Kubernetes 爱好者</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>,<a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>技术作者</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">为 Milvus 文档投稿</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>网络开发人员</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">最后的话<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供各种<a href="https://milvus.io/docs/install-pymilvus.md">SDK</a>--Python (PyMilvus)、<a href="https://milvus.io/docs/install-java.md">Java</a>、<a href="https://milvus.io/docs/install-go.md">Go</a> 和<a href="https://milvus.io/docs/install-node.md">Node.js，</a>使开始构建变得简单。为 Milvus 做贡献不仅仅是编写代码，而是加入一个充满活力和创新的社区。</p>
<p>欢迎加入 Milvus 开发者社区，祝您编码愉快！我们迫不及待地想知道您将创造出什么。</p>
<h2 id="Further-Reading" class="common-anchor-header">更多阅读<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://zilliz.com/community">加入 Milvus 人工智能开发者社区</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">什么是向量数据库及其工作原理？</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed：哪种模式适合您？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">使用 Milvus 构建人工智能应用程序：教程与笔记本电脑</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">为您的 GenAI 应用程序提供性能最佳的人工智能模型 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什么是 RAG？</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能资源中心 | Zilliz</a></p></li>
</ul>
