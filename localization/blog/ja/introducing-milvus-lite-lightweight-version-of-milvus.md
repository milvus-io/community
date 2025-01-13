---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: Milvus Liteのご紹介：Milvusの軽量版
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: Milvus Liteのスピードと効率性を体験してください。Milvus Liteは、高速類似検索で有名なMilvusベクトルデータベースの軽量版です。
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>重要なお知らせ</em></strong></p>
<p><em>当社は2024年6月にMilvus Liteをアップグレードし、AI開発者がMilvus on Kurbernetes、Docker、マネージドクラウドサービスを含む様々なデプロイメントオプションで一貫したエクスペリエンスを確保しながら、より迅速にアプリケーションを構築できるようになりました。また、Milvus Liteは様々なAIフレームワークやテクノロジーと統合し、ベクトル検索機能を備えたAIアプリケーションの開発を効率化します。詳細については、以下の文献を参照されたい：</em></p>
<ul>
<li><p><em>Milvus Lite発表ブログ：h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Milvus Lite ドキュメント: https:<a href="https://milvus.io/docs/quickstart.md">//milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Milvus Lite GitHubリポジトリ: https:<a href="https://github.com/milvus-io/milvus-lite">//github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvusは</a>、ディープニューラルネットワークやその他の機械学習(ML)モデルによって生成された埋め込みベクトルを何十億もの規模でインデックス化、保存、照会することを目的として構築されたオープンソースのベクトルデータベースです。大規模なデータセットに対して類似検索を行う必要がある多くの企業、研究者、開発者にとって人気のある選択肢となっている。</p>
<p>しかし、milvusのフルバージョンは重すぎたり複雑すぎたりすると感じるユーザーもいるだろう。この問題に対処するため、Milvusコミュニティで最も活発な貢献者の一人である<a href="https://github.com/matrixji">Bin Jiは</a>、<a href="https://github.com/milvus-io/milvus-lite">Milvusの</a>軽量版である<a href="https://github.com/milvus-io/milvus-lite">Milvus Liteを</a>構築しました。</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Milvus Liteとは？<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>前述したように、<a href="https://github.com/milvus-io/milvus-lite">Milvus Liteは</a>Milvusの簡易版であり、多くの利点とメリットを提供します。</p>
<ul>
<li>MilvusはPythonアプリケーションに統合することができます。</li>
<li>スタンドアロンのMilvusが組み込みのEtcdやローカルストレージで動作することができるため、Milvusは自己完結しており、他の依存関係を必要としません。</li>
<li>Pythonライブラリとしてインポートし、コマンドラインインターフェース(CLI)ベースのスタンドアロンサーバーとして使用することができます。</li>
<li>Google ColabやJupyter Notebookともスムーズに連携できる。</li>
<li>他のMilvusインスタンス（スタンドアロン版、クラスタ化版、フルマネージド版）に安全に移行することができます。</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">どのような場合にMilvus Liteを使うべきか？<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>具体的には、Milvus Liteは以下のような状況で最も役立ちます：</p>
<ul>
<li><a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>、<a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a>、<a href="https://milvus.io/docs/install_standalone-docker.md">Docker Composeの</a>ようなコンテナ技術やツールを使わずにMilvusを使用したい場合。</li>
<li>Milvusの利用に仮想マシンやコンテナを必要としない場合。</li>
<li>PythonアプリケーションにMilvusの機能を組み込みたい場合。</li>
<li>ColabやNotebookでMilvusインスタンスをスピンアップして素早く実験したい場合。</li>
</ul>
<p><strong>注意</strong>: Milvus Liteを本番環境で使用することや、高いパフォーマンス、高い可用性、高いスケーラビリティを必要とする場合には、Milvus Liteを使用することはお勧めしません。本番環境では、<a href="https://github.com/milvus-io/milvus">Milvusクラスタ</a>または<a href="https://zilliz.com/cloud">フルマネージドMilvus on Zilliz Cloudの</a>ご利用をご検討ください。</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Milvus Liteを始めるには？<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>それでは、Milvus Liteのインストール、設定、利用方法について説明します。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>Milvus Liteを利用するためには、以下の要件を満たしている必要があります：</p>
<ul>
<li>Python 3.7またはそれ以降のバージョンがインストールされていること。</li>
<li>以下のオペレーティングシステムを使用していること：<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>注意</strong>事項</p>
<ol>
<li>Milvus Lite はベースイメージとして<code translate="no">manylinux2014</code> を使用しているため、Linux ユーザーのほとんどの Linux ディストリビューションと互換性があります。</li>
<li>Windows上でMilvus Liteを動作させることも可能ですが、まだ完全には検証されていません。</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Milvus Liteのインストール</h3><p>Milvus LiteはPyPIで公開されているので、<code translate="no">pip</code> 。</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>また、以下のようにPyMilvusを使ってインストールすることもできます：</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Milvus Liteの使用と起動</h3><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">サンプルノートブックを</a>プロジェクトリポジトリのexampleフォルダからダウンロードしてください。Milvus Liteを使用するには、Pythonライブラリとしてインポートするか、CLIを使用してスタンドアロンサーバとして実行するかの2つの方法があります。</p>
<ul>
<li>PythonモジュールとしてMilvus Liteを起動するには、以下のコマンドを実行します：</li>
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
<li>Milvus Liteを一時停止または停止するには、<code translate="no">with</code> 。</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus LiteをCLIベースのスタンドアロンサーバとして起動するには、以下のコマンドを実行します：</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Liteを起動した後、PyMilvusや他のツールを使ってスタンドアロンサーバに接続することができます。</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">デバッグモードでのMilvus Liteの起動</h3><ul>
<li>PythonモジュールとしてMilvus Liteをデバッグモードで起動するには、以下のコマンドを実行します：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>スタンドアロンサーバをデバッグモードで起動するには、以下のコマンドを実行します：</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">データとログの永続化</h3><ul>
<li>Milvus Lite用のローカルディレクトリを作成し、関連するすべてのデータとログを保存するには、以下のコマンドを実行します：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>スタンドアロンサーバーで生成されたすべてのデータとログをローカルドライブに保存するには、次のコマンドを実行します：</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Milvus Liteの設定</h3><p>Milvus Liteの設定は、Python APIやCLIを使用したMilvusインスタンスの設定と同様です。</p>
<ul>
<li>PythonのAPIを使用してMilvus Liteを設定するには、基本設定と追加設定の両方で<code translate="no">MilvusServer</code> インスタンスの<code translate="no">config.set</code> APIを使用します：</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>CLIを使用してMilvus Liteを設定する場合、基本設定は以下のコマンドを実行します：</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>CLIを使用してMilvus Liteを設定する場合は、以下のコマンドを実行して基本設定を行います。</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>設定可能な項目は全てMilvusパッケージに同梱されている<code translate="no">config.yaml</code> テンプレートに含まれています。</p>
<p>Milvus Liteのインストールおよび設定方法に関する技術的な詳細については、<a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">ドキュメントを</a>参照してください。</p>
<h2 id="Summary" class="common-anchor-header">概要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Liteは、Milvusの機能をコンパクトにまとめたものである。研究者であれ、開発者であれ、データサイエンティストであれ、この選択肢を検討する価値はある。</p>
<p>Milvus Liteはまた、オープンソースコミュニティへの美しい追加でもあり、貢献者の並外れた仕事を紹介している。Bin Ji氏の努力のおかげで、Milvusはより多くのユーザーが利用できるようになった。私たちは、Bin Ji氏とMilvusコミュニティの他のメンバーが、今後どのような革新的なアイデアを生み出してくれるのか、今から待ち遠しい。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">今後ともよろしくお願いします！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Liteのインストールや使用で問題が発生した場合は、<a href="https://github.com/milvus-io/milvus-lite/issues/new">こちらから問題を提起して</a>いただくか、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInを通じて</a>ご連絡ください。また、<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加してエンジニアやコミュニティ全体とチャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックすることもできます！</p>
