---
id: embedded-milvus.md
title: 使用嵌入式 Milvus 以 Python 即時安裝和執行 Milvus
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: 對 Python 使用者友善的 Milvus 版本，讓安裝更有彈性。
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
<p>Milvus 是一個適用於 AI 應用的開源向量資料庫。它提供了多種安裝方式，包括從原始碼建立，以及使用 Docker Compose/Helm/APT/YUM/Ansible 安裝 Milvus。使用者可根據自己的作業系統和喜好，選擇其中一種安裝方法。然而，Milvus 社群中有許多使用 Python 的資料科學家和 AI 工程師，他們渴望使用比目前可用的安裝方法更簡單的方法。</p>
<p>因此，我們隨 Milvus 2.1 發布了嵌入式 Milvus，一個 Python 使用者友善版本，以增強社群中更多 Python 開發人員的能力。本文將介紹什麼是嵌入式 Milvus，並提供如何安裝與使用的說明。</p>
<p><strong>跳到</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">嵌入式 Milvus 概覽</a><ul>
<li><a href="#When-to-use-embedded-Milvus">何時使用嵌入式 Milvus？</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">不同模式的 Milvus 比較</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">如何安裝嵌入式 Milvus</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">啟動和停止嵌入式 Milvus</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">嵌入式 Milvus 概覽<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">嵌入式</a>Milvus 可以讓你快速地安裝 Milvus 並使用 Python。它可以快速啟動 Milvus 實例，並允許您隨時啟動和停止 Milvus 服務。即使您停止嵌入式 Milvus，所有的資料和日誌都會持續存在。</p>
<p>嵌入式 Milvus 本身沒有任何內部相依性，也不需要預先安裝和執行任何第三方相依性，例如 etcd、MinIO、Pulsar 等。</p>
<p>您使用嵌入式 Milvus 所做的一切，以及為其編寫的每一段程式碼，都可以安全地移植到其他 Milvus 模式 - 單機版、群集版、雲端版等。這反映了嵌入式 Milvus 最顯著的特點之一 -<strong>「一次編寫，隨處運行」。</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">何時使用嵌入式 Milvus？</h3><p>嵌入式 Milvus 和<a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a>是為了不同的目的而構建的。在下列情況下，您可以考慮選擇嵌入式 Milvus：</p>
<ul>
<li><p>你想<a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">在</a>不安裝 Milvus 的情況下使用 Milvus。</p></li>
<li><p>你想使用 Milvus 而不需要在你的機器中保留一個長時間運行的 Milvus 進程。</p></li>
<li><p>你想快速使用 Milvus，而不需要啟動獨立的 Milvus 進程和其他必要的元件，例如 etcd、MinIO、Pulsar 等。</p></li>
</ul>
<p>建議您<strong>不要</strong>使用嵌入式 Milvus：</p>
<ul>
<li><p>在生產環境中。<em>(若要在生產環境中使用 Milvus，請考慮使用 Milvus 集群或<a href="https://zilliz.com/cloud">Zilliz 雲端</a>，這是一個完全管理的 Milvus 服務</em>)<em>。</em></p></li>
<li><p>如果您對效能有很高的要求。<em>(相對來說，嵌入式 Milvus 可能無法提供最佳效能</em>)<em>。</em></p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Milvus 不同模式的比較</h3><p>下表比較了 Milvus 的幾種模式：獨立、群集、嵌入式 Milvus，以及完全管理的 Milvus 服務 Zilliz Cloud。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>比較</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">如何安裝嵌入式 Milvus？<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在安裝嵌入式 Milvus 之前，您需要先確認已經安裝 Python 3.6 或更新版本。嵌入式 Milvus 支援下列作業系統：</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>如果符合要求，您可以執行<code translate="no">$ python3 -m pip install milvus</code> 來安裝嵌入式 Milvus。您也可以在指令中加入版本，以安裝特定版本的嵌入式 Milvus。例如，如果您想安裝 2.1.0 版本，請執行<code translate="no">$ python3 -m pip install milvus==2.1.0</code> 。之後，當新版本的嵌入式 Milvus 發佈時，您也可以執行<code translate="no">$ python3 -m pip install --upgrade milvus</code> 將嵌入式 Milvus 升級到最新版本。</p>
<p>如果你是 Milvus 的老用戶，之前已經安裝了 PyMilvus，現在想安裝嵌入式 Milvus，你可以執行<code translate="no">$ python3 -m pip install --no-deps milvus</code> 。</p>
<p>執行安裝指令後，您需要在<code translate="no">/var/bin/e-milvus</code> 下為 embedded Milvus 建立資料夾，執行下列指令：</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">啟動和停止嵌入式 Milvus<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>安裝成功後，您可以啟動服務。</p>
<p>如果您是第一次執行嵌入式 Milvus，您需要先匯入 Milvus 並設定嵌入式 Milvus。</p>
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
<p>如果您之前已經成功啟動了嵌入式 Milvus，並且回來重新啟動它，您可以在匯入 Milvus 後直接執行<code translate="no">milvus.start()</code> 。</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>如果您已成功啟動嵌入式 Milvus 服務，您會看到以下輸出。</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>服務啟動後，您可以啟動另一個終端視窗，執行 &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; 的範例程式碼來玩一下嵌入式<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Milvus</a>！</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>當您使用完嵌入式 Milvus 後，我們建議您執行下列指令或按下 Ctrl-D 來停止它，並清理環境變數。</p>
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
    </button></h2><p>隨著 Milvus 2.1 正式發行，我們準備了一系列介紹新功能的部落格。閱讀此系列部落格的更多內容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字串資料來強化您的相似性搜尋應用程式</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即時以 Python 安裝及執行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">使用內建記憶體複本提高向量資料庫的讀取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">瞭解 Milvus 向量資料庫的一致性等級</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">瞭解 Milvus Vector 資料庫的一致性層級（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 資料庫如何確保資料安全？</a></li>
</ul>
