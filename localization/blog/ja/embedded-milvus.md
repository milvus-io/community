---
id: embedded-milvus.md
title: Embedded Milvusを使用したPythonによるMilvusのインストールと実行
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: インストールをより柔軟にするPythonユーザーフレンドリーなMilvusバージョン。
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>カバー</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/soothing-rain/">アレックス・ガオと</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">アンジェラ・ニーの</a>共著です。</p>
</blockquote>
<p>MilvusはAIアプリケーションのためのオープンソースのベクトル・データベースである。ソースコードからのビルドや、Docker Compose/Helm/APT/YUM/Ansibleを使ったMilvusのインストールなど、様々なインストール方法が提供されている。ユーザーは、オペレーティング・システムや好みに応じて、いずれかのインストール方法を選択することができる。しかし、MilvusコミュニティにはPythonを使用するデータサイエンティストやAIエンジニアが多く、現在利用可能な方法よりもはるかにシンプルなインストール方法を切望しています。</p>
<p>そこで私たちは、Milvus 2.1と共にPythonユーザフレンドリ版であるembedded Milvusをリリースし、より多くのPython開発者を支援することにしました。この記事では、埋め込みMilvusとは何かを紹介し、インストール方法と使用方法を説明します。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">組み込みMilvusの概要</a><ul>
<li><a href="#When-to-use-embedded-Milvus">組み込みMilvusはいつ使うのか？</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Milvusの各モードの比較</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">組み込みMilvusのインストール方法</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">組み込みMilvusの起動と停止</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">組み込みMilvusの概要<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Embedded Milvusを</a>使用すると、PythonでMilvusを素早くインストールして使用することができます。Milvusインスタンスを素早く立ち上げることができ、いつでもMilvusサービスを開始・停止することができます。すべてのデータとログは、組み込みMilvusを停止しても保持されます。</p>
<p>組み込みMilvus自体には内部依存関係はなく、etcd、MinIO、Pulsarなどのサードパーティ依存関係を事前にインストールして実行する必要はありません。</p>
<p>組み込みMilvusで行うこと、そしてそのために書くコードの全ては、スタンドアロン、クラスタ、クラウド版など、他のMilvusモードに安全に移行することができます。これはembedded Milvusの最も特徴的な特徴の一つである<strong>"Write once, run anywhere "</strong>を反映しています<strong>。</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">組み込みMilvusはいつ使うのか？</h3><p>組み込みMilvusと<a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvusは</a>異なる目的で構築されています。以下のような場合、組み込みMilvusを選択することを検討してください：</p>
<ul>
<li><p>Milvusをインストールせずに利用したい<a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">場合</a>。</p></li>
<li><p>長時間稼働するMilvusプロセスをマシン内に保持せずにMilvusを使用したい場合。</p></li>
<li><p>Milvusプロセスやetcd、MinIO、Pulsarなどの必要なコンポーネントを個別に起動せずにMilvusを使いたい。</p></li>
</ul>
<p>組み込みMilvusは使用<strong>しない</strong>ことを推奨します：</p>
<ul>
<li><p>本番環境での使用。<em>(本番環境でMilvusを使用するには、MilvusクラスタまたはフルマネージドMilvusサービスである<a href="https://zilliz.com/cloud">Zillizクラウドを</a>ご検討ください</em>)。</p></li>
<li><p>パフォーマンスに対する要求が高い場合。<em>(比較的、組み込みMilvusは最高のパフォーマンスを提供しないかもしれません</em>)。</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Milvusの各モードの比較</h3><p>以下の表は、Milvusのいくつかのモードを比較したものです。スタンドアロン、クラスタ、組み込みMilvus、そしてフルマネージドMilvusサービスであるZillizクラウドです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>比較</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">組み込みMilvusのインストール方法は？<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>組み込みMilvusをインストールする前に、まずPython 3.6以降がインストールされていることを確認する必要があります。Embedded Milvusは以下のオペレーティングシステムをサポートしています：</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>要件が満たされていれば、<code translate="no">$ python3 -m pip install milvus</code> を実行して組み込みMilvusをインストールすることができます。また、コマンドにバージョンを追加することで、特定のバージョンの組み込みMilvusをインストールすることができます。例えば、2.1.0をインストールしたい場合は、<code translate="no">$ python3 -m pip install milvus==2.1.0</code> を実行します。また、Milvusの新バージョンがリリースされた場合は、<code translate="no">$ python3 -m pip install --upgrade milvus</code> を実行することで、Milvusを最新バージョンにアップグレードすることができます。</p>
<p>Milvusの古いユーザで、既にPyMilvusをインストールしており、組み込みMilvusをインストールしたい場合は、<code translate="no">$ python3 -m pip install --no-deps milvus</code> を実行してください。</p>
<p>インストールコマンドを実行した後、以下のコマンドを実行して<code translate="no">/var/bin/e-milvus</code> の下に埋め込みMilvus用のデータフォルダを作成する必要がある：</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">組み込みMilvusの起動と停止<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>インストールが成功したら、サービスを開始することができます。</p>
<p>初めてembedded Milvusを実行する場合は、まずMilvusのインポートとembedded Milvusのセットアップを行う必要があります。</p>
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
<p>以前、組み込みMilvusの起動に成功し、再度起動する場合は、Milvusのインポート後、<code translate="no">milvus.start()</code> 。</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Milvusのサービスが正常に開始された場合、以下のような出力が表示されます。</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>サービス開始後、別のターミナルウィンドウを立ち上げ、<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">&quot;Hello Milvus</a>&quot;のサンプルコードを実行することで、組み込みMilvusで遊ぶことができます！</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Milvusを使い終わったら、以下のコマンドを実行するか、Ctrl-Dを押して、Milvusを停止し、環境変数をクリーンアップすることをお勧めします。</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">今後の予定<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介する一連のブログを用意しました。詳しくはこちらのブログシリーズをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクターデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
