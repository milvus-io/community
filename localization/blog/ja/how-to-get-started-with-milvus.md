---
id: how-to-get-started-with-milvus.md
title: Milvusの始め方
author: Eric Goebelbecker
date: 2023-05-18T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusの始め方</span> </span></p>
<p>情報の量と複雑さが増すにつれ、大規模な非構造化データセットを保存し検索するツールの必要性も増しています。<a href="https://github.com/milvus-io/milvus">Milvusは</a>、画像、音声、テキストなどの複雑な非構造化データを効率的に処理するオープンソースのベクトルデータベースです。膨大なデータコレクションへの高速かつスケーラブルなアクセスを必要とするアプリケーションに人気のある選択肢です。</p>
<p>この投稿では、Milvusのインストールと実行方法を学びます。この堅牢な<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースの</a>実行方法を理解することで、あなたのプロジェクトで<a href="https://zilliz.com/learn/what-is-vector-database">Milvusの</a>可能性を最大限に活用できるようになります。あなたが開発者であれ、データサイエンティストであれ、あるいは単にベクトル類似検索エンジンのパワーに興味があるだけであれ、このブログポストは<a href="https://milvus.io/">Milvusとの</a>旅の完璧な出発点です。</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvusとは？<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/what-is-milvus">Milvusは</a>、大規模な非構造化データを扱うために設計されたオープンソースのベクトルデータベースです。高度なインデックスシステムを搭載し、画像、音声、テキストなどの高次元データを効率的に扱うための様々な検索アルゴリズムを提供しています。</p>
<p>Milvusを活用することで期待できるメリットには、以下のようなものがあります：</p>
<ol>
<li>高次元データの検索効率の向上</li>
<li>大規模データセットに対応するスケーラビリティ</li>
<li>様々な検索アルゴリズムやインデックス作成技術を幅広くサポート</li>
<li>画像検索、自然言語処理、レコメンダーシステム、異常検知、バイオインフォマティクス、音声分析など幅広いアプリケーション</li>
</ol>
<h2 id="Prerequisites" class="common-anchor-header">前提条件<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルに従うには、最新バージョンのDockerがインストールされたシステムが必要です。このチュートリアルは<a href="https://docs.docker.com/compose/">Docker Composeに</a>依存しており、これはDockerランタイムの最新バージョンに既に含まれています。</p>
<p>Milvusを使用するには、Milvus Pythonライブラリとコマンドラインインターフェイス（CLI）の両方をダウンロードする必要があります。Pythonのバージョンは3.9以降であることを確認し、CLIはWindows、macOS、Linuxと互換性があることに注意してください。以下に示すサンプル・シェル・コマンドはLinuxシステム用ですが、macOSやWindows Subsystem for Linuxでも使用できます。</p>
<p>このチュートリアルでは、<strong>wgetを使って</strong>GitHubからファイルをダウンロードします。macOSの場合は、<a href="https://brew.sh/">Homebrewで</a> <strong>wgetを</strong>インストールするか、ブラウザでファイルをダウンロードしてください。Windowsの場合は、Windows Subsystem for Linux（WSL）に<strong>wgetが</strong>あります。</p>
<h2 id="Running-Milvus-Standalone" class="common-anchor-header">Milvusスタンドアロンの実行<button data-href="#Running-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Allocate-Additional-Memory-to-Docker" class="common-anchor-header">Dockerへの追加メモリの割り当て</h3><p>Milvusのパフォーマンスを最適化するには、最低8GBのメモリが必要です。しかし、Dockerは通常デフォルトで2GBしか割り当てません。これを解決するには、サーバを実行する前に、[設定]から[リソース]をクリックし、Dockerデスクトップの<a href="https://docs.docker.com/config/containers/resource_constraints/#memory">Dockerメモリを増やして</a>ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_Docker_desktop_a18626750c.png" alt="The Docker desktop" class="doc-image" id="the-docker-desktop" />
   </span> <span class="img-wrapper"> <span>Dockerデスクトップ</span> </span></p>
<h3 id="Download-Docker-Compose-Configuration" class="common-anchor-header">Docker Compose構成のダウンロード</h3><p>Milvusスタンドアロンサーバーを実行するには、3つのコンテナが必要です：</p>
<ul>
<li><strong><a href="https://etcd.io/">etcd</a></strong>- メタデータの保存とアクセス用の分散キーバリューストア。</li>
<li><strong><a href="https://min.io/">minio</a></strong>- ログとインデックスファイル用のAWS S3互換の永続ストレージ</li>
<li><strong>milvus</strong>- データベースサーバー</li>
</ul>
<p>各コンテナを個別に設定して実行するのではなく、Docker Composeを使って接続し、オーケストレーションする。</p>
<ol>
<li>サービスを実行するディレクトリを作成します。</li>
<li>サンプルの<a href="https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml">Docker Composeファイルを</a>Githubからダウンロードし、<strong>docker-compose.ymlとして</strong>保存する。ファイルは<strong>wgetでも</strong>ダウンロードできる。</li>
</ol>
<pre><code translate="no">$ <span class="hljs-built_in">mkdir</span> milvus_compose
$ <span class="hljs-built_in">cd</span> milvus_compose
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
--2023-04-10 16:44:13-- https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-10 16:44:13-- https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230410T204413Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=208728772&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1356 (1.3K) [application/octet-stream]
Saving to: ‘docker-compose.yml’

docker-compose.yml 100%[==========================================================&gt;] 1.32K --.-KB/s <span class="hljs-keyword">in</span> 0s

2023-04-10 16:44:13 (94.2 MB/s) - ‘docker-compose.yml’ saved [1356/1356]
<button class="copy-code-btn"></button></code></pre>
<p>実行する前に、この構成を見てみよう。</p>
<h2 id="Standalone-Configuration" class="common-anchor-header">スタンドアロン構成<button data-href="#Standalone-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>このcomposeファイルには、milvusに必要な3つのサービス、<strong>etcd、minio</strong>、<strong>milvus-standaloneが</strong>定義されている。</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.5&#x27;</span>

services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.0
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    container_name: milvus-minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/minio:/minio_data
    <span class="hljs-built_in">command</span>: minio server /minio_data
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9000/minio/health/live&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3

  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.2.8
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;minio&quot;</span>

networks:
  default:
    name: milvus
<button class="copy-code-btn"></button></code></pre>
<p>このコンフィギュレーションは<strong>etcdに</strong>永続データ用のボリュームを割り当てる。つの環境変数を定義し、ポート2379でリクエストをリッスンするよう指示するコマンドラインでサービスを実行する。</p>
<p>この設定はまた、<strong>minioに</strong>ボリュームを提供し、デフォルトのアクセスキーを使用する。しかし、本番環境での使用には、ユニークなキーを持つ新しい<strong>minio</strong>イメージを作成する必要がある。また、この設定には、<strong>minioの</strong>ヘルスチェックが含まれており、失敗した 場合にサービスを再起動する。Minioは、デフォルトでクライアントリクエストにポート9000を使うことに注意。</p>
<p>最後に、Milvusを実行する<strong>スタンドアロン・</strong>サービスがある。このサービスにもボリュームがあり、<strong>etcdと</strong> <strong>minioの</strong>サービス・ポートを指示する環境変数がある。最後のセクションでは、サービスが共有するネットワーク名を指定する。これにより、監視ツールでの識別が容易になる。</p>
<h2 id="Running-Milvus" class="common-anchor-header">Milvusの実行<button data-href="#Running-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>docker compose up -dで</strong>サービスを開始する。</p>
<pre><code translate="no">$ docker compose up -d
[*] Running 4/4
✔ Network milvus               Created          .0s
✔ Container milvus-minio       Started          .2s
✔ Container milvus-etcd        Started          .3s
✔ Container milvus-standalone  Started
<button class="copy-code-btn"></button></code></pre>
<p>Docker<strong>psを</strong>見ると、3つのコンテナが起動していることがわかる：</p>
<pre><code translate="no">$ docker ps -a
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                             PORTS                                              NAMES
eb1caca5d6a5   milvusdb/milvus:v2.2.8                     <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   21 seconds ago   Up 19 seconds                      0.0.0.0:9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp   milvus-standalone
ce19d90d89d0   quay.io/coreos/etcd:v3.5.0                 <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   22 seconds ago   Up 20 seconds                      2379-2380/tcp                                      milvus-etcd
e93e33a882d5   minio/minio:RELEASE.2023-03-20T20-16-18Z   <span class="hljs-string">&quot;/usr/bin/docker-ent…&quot;</span>   22 seconds ago   Up 20 seconds (health: starting)   9000/tcp                                           milvus-minio
<button class="copy-code-btn"></button></code></pre>
<p>また、<strong>docker logsで</strong>Milvusサーバを確認できる：</p>
<pre><code translate="no">$ docker logs milvus-standalone
<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span> <span class="hljs-attr">maxprocs</span>: <span class="hljs-title class_">Leaving</span> <span class="hljs-variable constant_">GOMAXPROCS</span>=<span class="hljs-number">4</span>: <span class="hljs-variable constant_">CPU</span> quota <span class="hljs-literal">undefined</span>
    __  _________ _   ____  ______    
   /  |<span class="hljs-regexp">/  /</span>  _/ <span class="hljs-regexp">/| | /</span> <span class="hljs-regexp">/ /</span> <span class="hljs-regexp">/ /</span> __/    
  <span class="hljs-regexp">/ /</span>|_/ <span class="hljs-comment">// // /_| |/ / /_/ /\ \    </span>
 <span class="hljs-regexp">/_/</span>  <span class="hljs-regexp">/_/</span>___/____/___/\____/___/     

<span class="hljs-title class_">Welcome</span> to use <span class="hljs-title class_">Milvus</span>!
<span class="hljs-title class_">Version</span>:   v2<span class="hljs-number">.2</span><span class="hljs-number">.8</span>
<span class="hljs-title class_">Built</span>:     <span class="hljs-title class_">Wed</span> <span class="hljs-title class_">Mar</span> <span class="hljs-number">29</span> <span class="hljs-number">11</span>:<span class="hljs-number">32</span>:<span class="hljs-number">15</span> <span class="hljs-variable constant_">UTC</span> <span class="hljs-number">2023</span>
<span class="hljs-title class_">GitCommit</span>: 47e28fbe
<span class="hljs-title class_">GoVersion</span>: go version go1<span class="hljs-number">.18</span><span class="hljs-number">.3</span> linux/amd64

open pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
lock pid <span class="hljs-attr">file</span>: <span class="hljs-regexp">/run/mi</span>lvus/standalone.<span class="hljs-property">pid</span>
[<span class="hljs-number">2023</span>/<span class="hljs-number">04</span>/<span class="hljs-number">13</span> <span class="hljs-number">13</span>:<span class="hljs-number">40</span>:<span class="hljs-number">04</span><span class="hljs-number">.976</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [<span class="hljs-variable constant_">INFO</span>] [roles/roles.<span class="hljs-property">go</span>:<span class="hljs-number">192</span>] [<span class="hljs-string">&quot;starting running Milvus components&quot;</span>]
(snipped)
<button class="copy-code-btn"></button></code></pre>
<p>サーバは稼働している。では、Pythonを使って接続してみよう。</p>
<h2 id="How-to-Use-Milvus" class="common-anchor-header">Milvusの使い方<button data-href="#How-to-Use-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Using-Milvus-with-Python" class="common-anchor-header">PythonでMilvusを使う</h3><p>Pythonのサンプルプログラムでデータベースをテストしてみましょう。まず、<strong>PyMilvusを</strong> <strong>pip</strong>3でインストールします：</p>
<pre><code translate="no">$ pip3 install pymilvus
Defaulting to user installation because normal site-packages is not writeable
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Collecting pymilvus
  Using cached pymilvus-2.2.6-py3-none-any.whl (133 kB)
Collecting grpcio&lt;=1.53.0,&gt;=1.49.1
  Using cached grpcio-1.53.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (4.9 MB)
Requirement already satisfied: mmh3&gt;=2.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (3.0.0)
Requirement already satisfied: ujson&gt;=2.0.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (5.4.0)
Requirement already satisfied: pandas&gt;=1.2.4 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (2.0.0)
Requirement already satisfied: python-dateutil&gt;=2.8.2 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2.8.2)
Requirement already satisfied: pytz&gt;=2020.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: tzdata&gt;=2022.1 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (2023.3)
Requirement already satisfied: numpy&gt;=1.21.0 <span class="hljs-keyword">in</span> /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas&gt;=1.2.4-&gt;pymilvus) (1.24.2)
Requirement already satisfied: six&gt;=1.5 <span class="hljs-keyword">in</span> /usr/lib/python3.11/site-packages (from python-dateutil&gt;=2.8.2-&gt;pandas&gt;=1.2.4-&gt;pymilvus) (1.16.0)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Installing collected packages: grpcio, pymilvus
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Successfully installed grpcio pymilvus-2.2.6
<button class="copy-code-btn"></button></code></pre>
<p>次に<a href="https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py">hello_milvus</a>サンプルプログラムをダウンロードする：</p>
<pre><code translate="no">$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>このスクリプトはコレクションを作成し、インデックスを追加し、いくつかの計算を実行します。実行します。このスクリプトはコレクションを作成し、インデックスを追加し、いくつかの計算を実行します。お使いのプロセッサと利用可能なメモリにもよりますが、完了するまでに数分かかります。</p>
<pre><code translate="no">$ python3 ./hello_milvus.py 

=== start connecting to Milvus     ===

Does collection hello_milvus exist <span class="hljs-keyword">in</span> Milvus: False

=== Create collection `hello_milvus` ===


=== Start inserting entities       ===

Number of entities <span class="hljs-keyword">in</span> Milvus: 3000

=== Start Creating index IVF_FLAT  ===


=== Start loading                  ===


=== Start searching based on vector similarity ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.08883658051490784, <span class="hljs-built_in">id</span>: 1262), random field: 0.2978858685751561
hit: (distance: 0.09590047597885132, <span class="hljs-built_in">id</span>: 1265), random field: 0.3042039939240304
hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2999), random field: 0.02316334456872482
hit: (distance: 0.05628091096878052, <span class="hljs-built_in">id</span>: 1580), random field: 0.3855988746044062
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
search latency = 0.3663s

=== Start querying with `random &gt; 0.5` ===

query result:
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
search latency = 0.4352s
query pagination(<span class="hljs-built_in">limit</span>=4):
    [{<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464}, {<span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>, <span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387}]
query pagination(offset=1, <span class="hljs-built_in">limit</span>=3):
    [{<span class="hljs-string">&#x27;random&#x27;</span>: 0.5763523024650556, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;100&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.9425935891639464, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1000&#x27;</span>}, {<span class="hljs-string">&#x27;random&#x27;</span>: 0.7893211256191387, <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1001&#x27;</span>}]

=== Start hybrid searching with `random &gt; 0.5` ===

hit: (distance: 0.0, <span class="hljs-built_in">id</span>: 2998), random field: 0.9728033590489911
hit: (distance: 0.14606499671936035, <span class="hljs-built_in">id</span>: 747), random field: 0.5648774800635661
hit: (distance: 0.1530652642250061, <span class="hljs-built_in">id</span>: 2527), random field: 0.8928974315571507
hit: (distance: 0.08096685260534286, <span class="hljs-built_in">id</span>: 2377), random field: 0.8745922204004368
hit: (distance: 0.20354536175727844, <span class="hljs-built_in">id</span>: 2034), random field: 0.5526117606328499
hit: (distance: 0.21908017992973328, <span class="hljs-built_in">id</span>: 958), random field: 0.6647383716417955
search latency = 0.3732s

=== Start deleting with <span class="hljs-built_in">expr</span> `pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` ===

query before delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: 
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.6378742006852851, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;0&#x27;</span>}
-{<span class="hljs-string">&#x27;random&#x27;</span>: 0.43925103574669633, <span class="hljs-string">&#x27;embeddings&#x27;</span>: [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], <span class="hljs-string">&#x27;pk&#x27;</span>: <span class="hljs-string">&#x27;1&#x27;</span>}

query after delete by <span class="hljs-built_in">expr</span>=`pk <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;0&quot;</span> , <span class="hljs-string">&quot;1&quot;</span>]` -&gt; result: []

=== Drop collection `hello_milvus` ===
<button class="copy-code-btn"></button></code></pre>
<h2 id="Milvus-CLI" class="common-anchor-header">milvus CLI<button data-href="#Milvus-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>最後に、<strong>hello_milvusの</strong>例でコレクションを再作成し、CLIを使って調べてみましょう。</p>
<p>まず<strong>hello_milvus.pyを</strong>編集して最後の2行をコメントアウトします：</p>
<pre><code translate="no"><span class="hljs-comment">###############################################################################</span>
<span class="hljs-comment"># 7. drop collection</span>
<span class="hljs-comment"># Finally, drop the hello_milvus collection</span>
<span class="hljs-comment">#print(fmt.format(&quot;Drop collection `hello_milvus`&quot;))</span>
<span class="hljs-comment">#utility.drop_collection(&quot;hello_milvus&quot;)</span>
<button class="copy-code-btn"></button></code></pre>
<p>次に、<a href="https://github.com/zilliztech/milvus_cli">Milvusコマンドラインインタフェース(CLI)</a>をインストールします。Pythonでインストールすることもできますし、<a href="https://github.com/zilliztech/milvus_cli/releases">リリース</a>ページからバイナリをダウンロードすることもできます。以下はLinux用のバイナリをダウンロードした例である：</p>
<pre><code translate="no">$ wget https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
--2023-04-13 09:58:15--  https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream [following]
--2023-04-13 09:58:16--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20230413T135816Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;key_id=0&amp;repo_id=436910525&amp;response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&amp;response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 50254816 (48M) [application/octet-stream]
Saving to: ‘milvus_cli-v0.3.2-Linux’

milvus_cli-v0.3.2-L 100%[===================&gt;]  47.93M  62.7MB/s    <span class="hljs-keyword">in</span> 0.8s    

2023-04-13 09:58:16 (62.7 MB/s) - ‘milvus_cli-v0.3.2-Linux’ saved [50254816/50254816]

$ <span class="hljs-built_in">chmod</span> +x ./milvus_cli-v0.3.2-Linux 
<button class="copy-code-btn"></button></code></pre>
<p>変更した<strong>hello_milvus.py</strong>スクリプトを実行すると、コレクションを削除せずに終了します。CLIを実行し、データベースに接続します。<strong>接続の</strong>デフォルトはlocalhostとデフォルトポートのMilvusインスタンスに接続することです：</p>
<pre><code translate="no">$ ./milvus_cli-v0<span class="hljs-number">.3</span><span class="hljs-number">.2</span>-<span class="hljs-title class_">Linux</span>

  __  __ _ _                    ____ _     ___
 |  \/  (_) |_   ___   _ ___   / ___| |   |_ _|
 | |\/| | | \ \ / <span class="hljs-regexp">/ | | /</span> __| | |   | |    | |
 | |  | | | |\ V /| |_| \__ \ | |___| |___ | |
 |_|  |_|_|_| \_/  \__,_|___/  \____|_____|___|

<span class="hljs-title class_">Milvus</span> cli <span class="hljs-attr">version</span>: <span class="hljs-number">0.3</span><span class="hljs-number">.2</span>
<span class="hljs-title class_">Pymilvus</span> <span class="hljs-attr">version</span>: <span class="hljs-number">2.2</span><span class="hljs-number">.1</span>

<span class="hljs-title class_">Learn</span> <span class="hljs-attr">more</span>: <span class="hljs-attr">https</span>:<span class="hljs-comment">//github.com/zilliztech/milvus_cli.</span>


milvus_cli &gt; connect
<span class="hljs-title class_">Connect</span> <span class="hljs-title class_">Milvus</span> successfully.
+---------+-----------------+
| <span class="hljs-title class_">Address</span> | <span class="hljs-number">127.0</span><span class="hljs-number">.0</span><span class="hljs-number">.1</span>:<span class="hljs-number">19530</span> |
|  <span class="hljs-title class_">User</span>   |                 |
|  <span class="hljs-title class_">Alias</span>  |     <span class="hljs-keyword">default</span>     |
+---------+-----------------+
<button class="copy-code-btn"></button></code></pre>
<p>現在のコレクションをリストアップし、<strong>describeを</strong>使用して<strong>hello_milvusを</strong>表示します。</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-built_in">list</span> collections
+----+-------------------+
|    | Collection Name   |
+====+===================+
|  <span class="hljs-number">0</span> | hello_milvus      |
+----+-------------------+
milvus_cli &gt; describe collection -c hello_milvus
+---------------+----------------------------------------------------------------------+
| Name          | hello_milvus                                                         |
+---------------+----------------------------------------------------------------------+
| Description   | hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs              |
+---------------+----------------------------------------------------------------------+
| Is Empty      | <span class="hljs-literal">False</span>                                                                |
+---------------+----------------------------------------------------------------------+
| Entities      | <span class="hljs-number">3000</span>                                                                 |
+---------------+----------------------------------------------------------------------+
| Primary Field | pk                                                                   |
+---------------+----------------------------------------------------------------------+
| Schema        | Description: hello_milvus <span class="hljs-keyword">is</span> the simplest demo to introduce the APIs |
|               |                                                                      |
|               | Auto ID: <span class="hljs-literal">False</span>                                                       |
|               |                                                                      |
|               | Fields(* <span class="hljs-keyword">is</span> the primary field):                                      |
|               |  - *pk VARCHAR                                                       |
|               |  - random DOUBLE                                                     |
|               |  - embeddings FLOAT_VECTOR dim: <span class="hljs-number">8</span>                                    |
+---------------+----------------------------------------------------------------------+
| Partitions    | - _default                                                           |
+---------------+----------------------------------------------------------------------+
| Indexes       | - embeddings                                                         |
+---------------+----------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>コレクションには3つのフィールドがあります。このコレクションには3つのフィールドがあります。IDが100のエントリを問い合わせます。</p>
<p><strong>query</strong>コマンドはいくつかのオプションを要求します。これを完了するには</p>
<ul>
<li>コレクション名：<strong>hello_milvus</strong></li>
<li>式<strong>pk == "100"</strong></li>
<li>フィールド:<strong>pk, random, embeddings</strong></li>
</ul>
<p>他のオプションはデフォルトを受け入れる。</p>
<pre><code translate="no">milvus_cli &gt; <span class="hljs-function">k
Collection <span class="hljs-title">name</span> (<span class="hljs-params">hello_milvus</span>): hello_milvus
The query expression: pk</span> == <span class="hljs-string">&quot;100&quot;</span>
<span class="hljs-function">The names of partitions to <span class="hljs-title">search</span> (<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;_default&#x27;] []: 
Fields to <span class="hljs-title">return</span>(<span class="hljs-params">split <span class="hljs-keyword">by</span> <span class="hljs-string">&quot;,&quot;</span> <span class="hljs-keyword">if</span> multiple</span>) [&#x27;pk&#x27;, &#x27;random&#x27;, &#x27;embeddings&#x27;] []: pk, random, embeddings
timeout []: 
Guarantee timestamp. This instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp <span class="hljs-keyword">is</span> provided, then Milvus will search all operations performed to date. [0]: 
Graceful time. Only used <span class="hljs-keyword">in</span> bounded consistency level. If graceful_time <span class="hljs-keyword">is</span> <span class="hljs-keyword">set</span>, PyMilvus will use current timestamp minus the graceful_time <span class="hljs-keyword">as</span> the guarantee_timestamp. This option <span class="hljs-keyword">is</span> 5s <span class="hljs-keyword">by</span> <span class="hljs-literal">default</span> <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">set</span>. [5]: 
Travel timestamp. Users can specify a timestamp <span class="hljs-keyword">in</span> a search to <span class="hljs-keyword">get</span> results based <span class="hljs-keyword">on</span> a data view at a specified point <span class="hljs-keyword">in</span> time. [0]: 
+----+------+----------+------------------------------------------------------------------------------------------------+
|    |   pk |   random | embeddings                                                                                     |
+</span>====+======+==========+================================================================================================+
|  <span class="hljs-number">0</span> |  <span class="hljs-number">100</span> | <span class="hljs-number">0.576352</span> | [<span class="hljs-number">0.5860017</span>, <span class="hljs-number">0.24227226</span>, <span class="hljs-number">0.8318699</span>, <span class="hljs-number">0.0060517574</span>, <span class="hljs-number">0.27727962</span>, <span class="hljs-number">0.5513293</span>, <span class="hljs-number">0.47201252</span>, <span class="hljs-number">0.6331349</span>] |
+----+------+----------+------------------------------------------------------------------------------------------------+
<button class="copy-code-btn"></button></code></pre>
<p>フィールドとランダム埋め込みがある。あなたの値は異なるでしょう。</p>
<h2 id="Wrapping-Up" class="common-anchor-header">まとめ<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルでは、Python APIとCLIと共に<a href="https://docs.docker.com/compose/">Docker Composeで</a>milvusをインストールしました。サーバを起動した後、ランダムなデータをシードするサンプルプログラムを実行し、CLIを使ってデータベースに問い合わせました。</p>
<p>Milvusは、大規模なデータセットの保存と検索のための強力なオープンソースの<a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">ベクトルデータベースエンジン</a>です。今すぐ試して、マルチメディアやAIプロジェクトでどのように役立つかを見てみよう。  Milvusのフルバージョンに取り組む準備ができていない場合は、<a href="https://github.com/milvus-io/bootcamp/tree/master/notebooks">Milvus liteを試してみて</a>ください。</p>
<p><em>この投稿はEric Goebelbeckerによって書かれました。<a href="http://ericgoebelbecker.com/">エリックは</a>ニューヨークの金融市場で25年間働き、市場データと金融情報交換（FIX）プロトコル・ネットワークのインフラを開発してきた。彼は、チームを効果的にする（あるいはそうでない！）要因について話すのが大好きだ。</em></p>
