---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Milvus_CLIを使い始める
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: この記事ではMilvus_CLIを紹介し、一般的なタスクの実行を支援します。
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>情報爆発の時代、私たちは音声、画像、動画、その他の非構造化データを常に生み出している。この膨大なデータをいかに効率的に分析するか。ニューラルネットワークの登場により、非構造化データをベクトルとして埋め込むことが可能になり、Milvusデータベースは、ベクトルデータの保存、検索、分析を完結させる基本的なデータサービスソフトウェアである。</p>
<p>しかし、Milvusのベクトル・データベースを素早く使うにはどうすればよいのだろうか。</p>
<p>APIは覚えるのが大変で、Milvusデータベースを操作する簡単なコマンドラインがあればいいのにと不満を持つユーザーもいます。</p>
<p>Milvus_CLIはMilvusベクトルデータベース専用のコマンドラインツールです。</p>
<p>Milvus_CLIはMilvusの便利なデータベースCLIであり、シェルの対話型コマンドを使用してデータベース接続、データインポート、データエクスポート、ベクトル計算を行うことができます。最新版のMilvus_CLIには以下の特徴があります。</p>
<ul>
<li><p>Windows、Mac、Linuxを含む全てのプラットフォームに対応</p></li>
<li><p>pipによるオンライン・オフラインインストールに対応</p></li>
<li><p>ポータブルでどこでも使用可能</p></li>
<li><p>Python用Milvus SDKをベースに開発されています。</p></li>
<li><p>ヘルプドキュメント付き</p></li>
<li><p>オートコンプリート対応</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">インストール方法<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLIはオンラインでもオフラインでもインストールできます。</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Milvus_CLIのオンラインインストール</h3><p>以下のコマンドを実行し、pipでMilvus_CLIをオンラインインストールします。Python 3.8以降が必要です。</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Milvus_CLIのオフラインインストール</h3><p>Milvus_CLIをオフラインでインストールするには、まずリリースページから最新のtarballを<a href="https://github.com/milvus-io/milvus_cli/releases">ダウンロードして</a>ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>tarballのダウンロードが完了したら、以下のコマンドを実行してMilvus_CLIをインストールします。</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Milvus_CLIがインストールされたら、<code translate="no">milvus_cli</code> を実行してください。表示される<code translate="no">milvus_cli &gt;</code> プロンプトはコマンドラインの準備ができたことを示しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>M1チップを搭載したMacやPython環境のないPCを使用している場合は、ポータブルアプリケーションを使用することができます。そのためには、お使いのOSに対応するリリースページにあるファイルを<a href="https://github.com/milvus-io/milvus_cli/releases">ダウンロード</a>し、そのファイル上で<code translate="no">chmod +x</code> を実行して実行可能な状態にし、そのファイル上で<code translate="no">./</code> を実行して実行します。</p>
<h4 id="Example" class="common-anchor-header"><strong>実行例</strong></h4><p>次の例では、<code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> を実行可能にして実行します。</p>
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Milvusへの接続</h3><p>Milvusに接続する前に、Milvusがサーバにインストールされていることを確認してください。詳細は<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus Standaloneのインストール</a>または<a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Milvus Clusterのインストールを</a>参照してください。</p>
<p>Milvusがlocalhostにデフォルトポートでインストールされている場合、<code translate="no">connect</code> を実行してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>そうでない場合は、MilvusサーバのIPアドレスを指定して以下のコマンドを実行してください。以下の例では、IPアドレスに<code translate="no">172.16.20.3</code> 、ポート番号に<code translate="no">19530</code> を使用しています。</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">コレクションの作成</h3><p>このセクションでは、コレクションの作成方法を紹介します。</p>
<p>コレクションはエンティティで構成され、RDBMS のテーブルに似ています。詳細は<a href="https://milvus.io/docs/v2.0.x/glossary.md">用語集を</a>参照。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">例</h4><p>以下の例では、<code translate="no">car</code> という名前のコレクションを作成します。<code translate="no">car</code> コレクションには、<code translate="no">id</code> 、<code translate="no">vector</code> 、<code translate="no">color</code> 、<code translate="no">brand</code> の4つのフィールドがあります。主キーフィールドは<code translate="no">id</code> である。詳細は<a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">create collection</a>を参照。</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">コレクションのリスト</h3><p>以下のコマンドを実行し、Milvusインスタンスのすべてのコレクションをリストアップします。</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>次のコマンドを実行して、<code translate="no">car</code> コレクションの詳細を確認します。</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">2つのベクトル間の距離を計算する</h3><p>以下のコマンドを実行して、<code translate="no">car</code> コレクションにデータをインポートします。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p><code translate="no">query</code> を実行し、プロンプトが表示されたら、<code translate="no">car</code> をコレクション名として、<code translate="no">id&gt;0</code> をクエリ式として入力する。以下の図に示すように、条件を満たすエンティティの ID が返される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p><code translate="no">calc</code> を実行し、プロンプトが表示されたら適切な値を入力して、ベクトル配列間の距離を計算する。</p>
<h3 id="Delete-a-collection" class="common-anchor-header">コレクションの削除</h3><p>以下のコマンドを実行して、<code translate="no">car</code> コレクションを削除する。</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">その他<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLIは上記の機能に限定されません。Milvus_CLIに含まれる全てのコマンドとそれぞれの説明を表示するには、<code translate="no">help</code> 。指定したコマンドの詳細を表示するには<code translate="no">&lt;command&gt; --help</code> を実行してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>こちらも参照してください：</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus</a>Docsの<a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLIコマンドリファレンスも</a>ご参照ください。</p>
<p>Milvus_CLIがMilvusベクターデータベースを簡単に利用するための一助となれば幸いです。私たちはMilvus_CLIを最適化し続けます。</p>
<p>ご質問がございましたら、GitHubに<a href="https://github.com/zilliztech/milvus_cli/issues">issueをご投稿</a>ください。</p>
