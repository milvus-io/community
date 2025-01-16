---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 如何貢獻給 Milvus：開發者快速入門
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
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a>是專為管理高維向量資料而設計的開放源碼向量資料<a href="https://zilliz.com/learn/what-is-vector-database">庫</a>。無論您是要建立智慧型搜尋引擎、推薦系統，或是下一世代的 AI 解決方案，例如檢索擴增世代<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>)，Milvus 都是您唾手可得的強大工具。</p>
<p>但真正推動 Milvus 向前邁進的不僅是其先進的技術，還有其背後充滿活力與熱情的<a href="https://zilliz.com/community">開發者社群</a>。作為一個開放源碼專案，Milvus 的茁壯成長和不斷進化都要歸功於像您這樣的開發者的貢獻。來自社群的每一個錯誤修正、功能新增和效能提升，都讓 Milvus 更快速、更可擴充、更可靠。</p>
<p>無論您是熱衷於開放原始碼、渴望學習，或是想要在人工智慧領域發揮持久的影響力，Milvus 都是您貢獻心力的最佳場所。本指南將引導您完成整個流程 - 從設定您的開發環境到提交您的第一個 pull request。我們也會強調您可能面臨的常見挑戰，並提供克服這些挑戰的解決方案。</p>
<p>準備好投入了嗎？讓我們一起把 Milvus 做得更好！</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">設定您的 Milvus 開發環境<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>第一件事：設定您的開發環境。您可以在本機安裝 Milvus 或使用 Docker，這兩種方法都很簡單，但您也需要安裝一些協力廠商的相依性，才能讓一切正常運作。</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">在本機建立 Milvus</h3><p>如果您喜歡從頭開始建置，在本機上建置 Milvus 是一件輕而易舉的事。Milvus 在<code translate="no">install_deps.sh</code> 腳本中捆綁了所有的相依性，讓它變得更容易。以下是快速設定：</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">使用 Docker 建置 Milvus</h3><p>如果您偏好 Docker，有兩種方法：您可以在預先建置的容器中執行指令，或是啟動一個開發容器，進行更多實作。</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>平台注意事項：</strong>如果您使用的是 Linux，您就可以使用了，編譯問題非常罕見。不過，Mac 使用者，尤其是使用 M1 晶片的使用者，可能會在過程中遇到一些問題。不過不用擔心，我們有一份指南可以幫助您解決最常見的問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖：作業系統配置</em></p>
<p>如需完整的設定指南，請參閱官方的<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus 開發指南</a>。</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">常見問題與修正方法</h3><p>有時候，設置您的 Milvus 開發環境並不如計劃的那麼順利。別擔心，以下是您可能會遇到的常見問題，以及如何快速解決。</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">自製遊戲：讀取側頻封包時意外中斷</h4><p>如果您正在使用 Homebrew 並看到類似這樣的錯誤：</p>
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
<p><strong>修復方法：</strong>增加<code translate="no">http.postBuffer</code> 的大小：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>如果您在安裝 Homebrew 之後也遇到<code translate="no">Brew: command not found</code> ，您可能需要設定您的 Git 使用者設定：</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: 錯誤獲取憑證</h4><p>使用 Docker 時，您可能會看到這樣的錯誤：</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修復：</strong>開啟<code translate="no">~/.docker/config.json</code> 並移除<code translate="no">credsStore</code> 欄位。</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python：沒有名為 'imp' 的模組</h4><p>如果 Python 產生這個錯誤，那是因為 Python 3.12 移除了<code translate="no">imp</code> 模組，而一些舊的相依性仍在使用這個模組。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修復：</strong>降級到 Python 3.11：</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">柯南：未識別參數或未找到命令</h4><p><strong>問題：</strong>如果您看到<code translate="no">Unrecognized arguments: --install-folder conan</code> ，您很可能使用的是不相容的 Conan 版本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修復：</strong>降級到 Conan 1.61：</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>問題：</strong>如果您看到<code translate="no">Conan command not found</code> ，這表示您的 Python 環境沒有正確設定。</p>
<p><strong>修正：</strong>將 Python 的 bin 目錄加入您的<code translate="no">PATH</code> ：</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM：使用未宣告的識別碼 'kSecFormatOpenSSL'</h4><p>此錯誤通常表示您的 LLVM 相依性過時。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>修復方法：</strong>重新安裝 LLVM 15 並更新您的環境變數：</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>專業提示</strong></p>
<ul>
<li><p>務必仔細檢查您的工具版本和相依性。</p></li>
<li><p>如果仍然無法運作，<a href="https://github.com/milvus-io/milvus/issues"> Milvus GitHub Issues 頁面</a>是尋找答案或尋求協助的好地方。</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">設定 VS Code 以整合 C++ 與 Go</h3><p>讓 C++ 和 Go 在 VS Code 中一起運作比聽起來容易。透過正確的設定，您可以簡化 Milvus 的開發流程。只需使用以下配置調整您的<code translate="no">user.settings</code> 檔案：</p>
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
<p>以下是此設定的作用：</p>
<ul>
<li><p><strong>環境變數：</strong>為<code translate="no">PKG_CONFIG_PATH</code> 、<code translate="no">LD_LIBRARY_PATH</code> 及<code translate="no">RPATH</code> 設定路徑，這些路徑對於在建立及測試過程中定位函式庫非常重要。</p></li>
<li><p><strong>Go 工具整合：</strong>啟用 Go 的語言伺服器 (<code translate="no">gopls</code>) 並設定工具，例如<code translate="no">gofumpt</code> 用於格式化，<code translate="no">golangci-lint</code> 用於 linting。</p></li>
<li><p><strong>測試設定：</strong>新增<code translate="no">testTags</code> ，並將執行測試的逾時時間增加至 10 分鐘。</p></li>
</ul>
<p>一旦加入，此設定可確保 C++ 與 Go 工作流程之間的無縫整合。它非常適合建立和測試 Milvus，而無需不斷調整環境。</p>
<p><strong>專業提示</strong></p>
<p>設定完成後，執行快速測試建立，確認一切運作正常。如果感覺不對勁，請仔細檢查路徑和 VS Code 的 Go 延伸版本。</p>
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
    </button></h2><p>Milvus 支援<a href="https://milvus.io/docs/install-overview.md">三種部署模式-Lite</a><strong>、Standalone</strong>及<strong>Distributed。</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a>是一個 Python 函式庫，也是 Milvus 的超輕量版本。它非常適合在 Python 或筆記型電腦環境中進行快速原型開發，以及小規模的本地實驗。</p></li>
<li><p><strong>Milvus Standalone</strong>是 Milvus 的單節點部署選項，使用客戶端伺服器模式。它相當於 Milvus 的 MySQL，而 Milvus Lite 則像 SQLite。</p></li>
<li><p><strong>Milvus Distributed</strong>是 Milvus 的分散式模式，非常適合企業用戶建立大型向量資料庫系統或向量資料平台。</p></li>
</ul>
<p>所有這些部署都依賴於三個核心元件：</p>
<ul>
<li><p><strong>Milvus: 驅動</strong>所有作業的向量資料庫引擎。</p></li>
<li><p><strong>Etcd：</strong>管理 Milvus 內部元資料的元資料引擎。</p></li>
<li><p><strong>MinIO：</strong>確保資料持久性的儲存引擎。</p></li>
</ul>
<p>當以<strong>分散式</strong>模式執行時，Milvus 也結合了<strong>Pulsar</strong>，使用 Pub/Sub 機制進行分散式訊息處理，使其可擴充至高吞吐量環境。</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus 單機版</h3><p>單機模式專為單一實體設定量身打造，非常適合測試和小規模應用程式。以下是如何開始使用：</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus 分散式 (之前稱為 Milvus Cluster)</h3><p>對於較大的資料集和較高的流量，分散式模式提供了水平擴展性。它將多個 Milvus 實體結合為單一內聚系統。<strong>Milvus Operator</strong> 可在 Kubernetes 上執行，並為您管理整個 Milvus 堆疊，讓部署變得更輕鬆。</p>
<p>需要逐步指導嗎？查看<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus 安裝指南</a>。</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">執行端對端 (E2E) 測試<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦您的 Milvus 部署開始運行，使用 E2E 測試來測試其功能就變得輕而易舉。這些測試涵蓋您設定的每個部分，以確保一切運作符合預期。以下是如何執行這些測試：</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>如需深入說明和故障排除技巧，請參閱<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus 開發指南</a>。</p>
<p><strong>專業提示</strong></p>
<p>如果您是 Milvus 的新使用者，請先從 Milvus Lite 或 Standalone 模式開始，瞭解其功能，然後再擴充至 Distributed 模式，以應付生產級工作負載。</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">提交您的程式碼<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜您！您已通過所有的單元測試和 E2E 測試 (或在需要時進行除錯並重新編譯)。雖然第一次編譯可能需要一些時間，但以後的編譯會快很多，所以不必擔心。一切都通過後，您就可以提交您的變更，為 Milvus 做出貢獻！</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">將您的 Pull Request (PR) 連接到問題</h3><p>提交給 Milvus 的每個 PR 都需要與相關的問題連結。以下是處理的方法：</p>
<ul>
<li><p><strong>檢查現有的問題：</strong>查看<a href="https://github.com/milvus-io/milvus/issues"> Milvus 問題追蹤器</a>，看看是否已有與您的變更相關的問題。</p></li>
<li><p><strong>建立新問題：</strong>如果沒有相關的問題，請開啟一個新問題，並解釋您要解決的問題或新增的功能。</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">提交您的程式碼</h3><ol>
<li><p><strong>分叉儲存庫：</strong>先將<a href="https://github.com/milvus-io/milvus"> Milvus 倉庫</a>分叉到您的 GitHub 帳戶。</p></li>
<li><p><strong>建立分支：</strong>在本地克隆您的分支，並為您的變更建立一個新的分支。</p></li>
<li><p><strong>使用簽名提交：</strong>確保您的提交包含<code translate="no">Signed-off-by</code> 簽署，以符合開源授權：</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>此步驟證明您的貢獻符合開發者原產地證書 (DCO)。</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>有用資源</strong></h4><p>如需詳細步驟和最佳實踐，請查看<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvus Contribution Guide</a>。</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">貢獻機會<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>恭喜-你已經開始運行 Milvus！您已經探索了它的部署模式、執行了測試，甚至可能還深入研究了程式碼。現在是提升等級的時候了：為<a href="https://github.com/milvus-io/milvus">Milvus</a>做出貢獻，並協助塑造 AI 和<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料的</a>未來。</p>
<p>無論您的技能如何，Milvus 社群都有您的一席之地！無論您是喜歡解決複雜挑戰的開發人員、喜歡撰寫簡潔文件或工程部落格的技術作家，或是希望改善部署的 Kubernetes 愛好者，您都有機會發揮影響力。</p>
<p>看看下面的機會，找到您的完美搭配。每一項貢獻都有助於推動 Milvus 向前邁進，誰知道呢？您的下一個 pull request 也許就會帶動下一波的創新。還在等什麼？讓我們開始吧！🚀</p>
<table>
<thead>
<tr><th>專案</th><th>適用於</th><th>指南</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>,<a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Go 開發人員</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>、<a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP 開發人員</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>,<a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>,<a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>對其他語言有興趣的開發者</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">貢獻 PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Kubernetes 發燒友</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>,<a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>技術作家</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">為 milvus 文件貢獻</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>網頁開發人員</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">最後的話<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 提供各種 SDK-<a href="https://milvus.io/docs/install-pymilvus.md">Python</a>（PyMilvus）、<a href="https://milvus.io/docs/install-java.md">Java</a>、<a href="https://milvus.io/docs/install-go.md">Go</a> 和<a href="https://milvus.io/docs/install-node.md">Node.js，</a>讓您可以輕鬆開始建置。對 Milvus 的貢獻不只是程式碼，而是加入一個充滿活力與創新的社群。</p>
<p>歡迎加入 Milvus 開發者社群，祝您編碼愉快！我們迫不及待想看到您的創作。</p>
<h2 id="Further-Reading" class="common-anchor-header">進一步閱讀<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">加入 Milvus AI 開發人員社群</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">什麼是向量資料庫以及它們如何運作？</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed：哪種模式適合您？ </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">使用 Milvus 建立 AI 應用程式：教學與筆記本</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">為您的 GenAI 應用程式建立最佳效能的 AI 模型 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">什麼是 RAG？</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">生成式人工智能資源中心 | Zilliz</a></p></li>
</ul>
