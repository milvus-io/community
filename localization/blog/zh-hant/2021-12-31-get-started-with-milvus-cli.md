---
id: 2021-12-31-get-started-with-milvus-cli.md
title: 開始使用 Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: 本文介紹 Milvus_CLI，並協助您完成常見的工作。
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>在資訊爆炸的時代，我們無時無刻不在產生語音、影像、視訊和其他非結構化資料。我們該如何有效率地分析這些海量資料？神經網路的出現使得非結構化的資料能夠以向量的形式嵌入，而Milvus向量資料庫就是一個基礎的資料服務軟體，它可以幫助完成向量資料的儲存、搜尋和分析。</p>
<p>但如何才能快速使用Milvus向量資料庫呢？</p>
<p>有些使用者抱怨API難以記憶，希望可以有簡單的指令行來操作Milvus資料庫。</p>
<p>我們很高興地推出Milvus_CLI，一個專門用於Milvus向量資料庫的命令列工具。</p>
<p>Milvus_CLI 是 Milvus 便利的資料庫 CLI，支援資料庫連線、資料匯入、資料匯出，以及使用 shell 中的互動式命令進行向量計算。最新版本的 Milvus_CLI 具備以下功能。</p>
<ul>
<li><p>支援所有平台，包括 Windows、Mac 和 Linux</p></li>
<li><p>支援使用 pip 進行線上與離線安裝</p></li>
<li><p>可攜式，可在任何地方使用</p></li>
<li><p>建構在適用於 Python 的 Milvus SDK 上</p></li>
<li><p>包含說明文件</p></li>
<li><p>支援自動完成</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">安裝<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>您可以線上或離線安裝 Milvus_CLI。</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">線上安裝</h3><p>執行以下指令，使用 pip 線上安裝 Milvus_CLI。需要 Python 3.8 或更高版本。</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">離線安裝 Milvus_CLI</h3><p>若要離線安裝 Milvus_CLI，請先從發行版頁<a href="https://github.com/milvus-io/milvus_cli/releases">面下載</a>最新的 tarball。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>下載完 tar 包後，執行下列指令安裝 Milvus_CLI。</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Milvus_CLI 安裝完成後，執行<code translate="no">milvus_cli</code> 。出現的<code translate="no">milvus_cli &gt;</code> 提示表示命令列已準備就緒。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>如果您使用的是有 M1 晶片的 Mac，或是沒有 Python 環境的 PC，您可以選擇使用可攜式應用程式來取代。要達到此目的，請在與您的作業系統相對應的發行頁面上<a href="https://github.com/milvus-io/milvus_cli/releases">下載</a>檔案，在檔案上執行<code translate="no">chmod +x</code> 使其可執行，然後在檔案上執行<code translate="no">./</code> 以執行它。</p>
<h4 id="Example" class="common-anchor-header"><strong>範例</strong></h4><p>以下範例使<code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> 可執行，並執行它。</p>
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">連接至 Milvus</h3><p>在連線到 Milvus 之前，請確認您的伺服器已安裝 Milvus。更多資訊請參閱<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">安裝 Milvus Standalone</a> <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">或安裝 Milvus Cluster</a>。</p>
<p>如果 Milvus 安裝在您的 localhost 上，並使用預設的連接埠，請執行<code translate="no">connect</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>否則，請以 Milvus 伺服器的 IP 位址執行下列指令。以下範例使用<code translate="no">172.16.20.3</code> 作為 IP 位址，<code translate="no">19530</code> 作為連接埠號。</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">建立集合</h3><p>本節介紹如何建立一個集合。</p>
<p>集合由實體組成，類似於 RDBMS 中的表格。更多資訊請參閱<a href="https://milvus.io/docs/v2.0.x/glossary.md">詞彙</a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">範例</h4><p>以下範例建立一個名為<code translate="no">car</code> 的集合。<code translate="no">car</code> 集合有四個欄位，分別是<code translate="no">id</code>,<code translate="no">vector</code>,<code translate="no">color</code>, 和<code translate="no">brand</code> 。主鍵欄位是<code translate="no">id</code> 。更多資訊請參閱<a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">建立集合</a>。</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">列出集合</h3><p>執行以下指令，列出此 Milvus 實例中的所有集合。</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>執行下列指令以檢查<code translate="no">car</code> 集合的詳細資料。</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">計算兩個向量之間的距離</h3><p>執行下列指令，將資料匯入<code translate="no">car</code> 資料集中。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>執行<code translate="no">query</code> ，並在提示時輸入<code translate="no">car</code> 作為資料集名稱，以及<code translate="no">id&gt;0</code> 作為查詢表達式。如下圖所示，符合條件的實體 ID 會被傳回。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>執行<code translate="no">calc</code> ，並在提示時輸入適當的值，以計算向量陣列之間的距離。</p>
<h3 id="Delete-a-collection" class="common-anchor-header">刪除集合</h3><p>執行下列指令刪除<code translate="no">car</code> 集合。</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">更多內容<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI 並不限於前述的功能。執行<code translate="no">help</code> 檢視 Milvus_CLI 包含的所有指令，以及各自的說明。執行<code translate="no">&lt;command&gt; --help</code> 檢視指定指令的詳細說明。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>另請參閱</strong></p>
<p>Milvus Docs 下的<a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLI 命令參考</a></p>
<p>我們希望 Milvus_CLI 可以幫助您輕鬆使用 Milvus 向量資料庫。我們將不斷優化 Milvus_CLI，並歡迎您的貢獻。</p>
<p>如果您有任何問題，請隨時在 GitHub 上<a href="https://github.com/zilliztech/milvus_cli/issues">提出問題</a>。</p>
