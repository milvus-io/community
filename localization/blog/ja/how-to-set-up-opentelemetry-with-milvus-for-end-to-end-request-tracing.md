---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: MilvusでOpenTelemetryをセットアップしてエンドツーエンドのリクエストトレースを行う方法
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  MilvusベクトルデータベースのパフォーマンスをOpenTelemetryトレースで監視する。Dockerセットアップ、Pythonクライアント、Jaeger可視化、デバッグのヒントを含む完全なチュートリアル。
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクトル・データベースを使って</a>AIを活用したアプリケーションを構築する場合、アプリケーションの規模が大きくなるにつれて、システムのパフォーマンスを理解することが重要になります。1つの検索リクエストが複数の内部処理（ベクトルインデックス作成、類似度計算、データ検索）を異なるコンポーネント間でトリガーする可能性があります。適切な観測可能性がなければ、速度低下や障害を診断することは、干し草の山から針を見つけるようなものになってしまいます。</p>
<p><strong>分散トレーシングは</strong>、システム内を流れるリクエストを追跡することで、この問題を解決し、フードの下で起こっていることの全体像を示します。</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a>は、<a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a>が支援するオープンソースの観測可能性フレームワークで、アプリケーションからトレース、メトリクス、ログを収集するのに役立ちます。ベンダーに依存せず、広く採用されており、一般的なモニタリング・ツールとシームレスに動作します。</p>
<p>このガイドでは、AIアプリケーション用に構築された高性能ベクトルデータベースである<a href="https://milvus.io/"><strong>Milvusに</strong></a>エンドツーエンドのトレースを追加する方法を紹介します。クライアントリクエストから内部データベース操作まで、すべてを追跡し、パフォーマンスの最適化とデバッグをより簡単にする方法を学びます。</p>
<p>また、<a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaegerを</strong></a>利用してトレースデータを可視化し、ベクターデータベースの操作に関する強力な洞察を提供します。</p>
<h2 id="What-Well-Build" class="common-anchor-header">何を作るか<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルが終わるころには、以下のような完全なトレースパイプラインが完成していることでしょう：</p>
<ol>
<li><p>OpenTelemetryトレースを有効にした<strong>Milvusベクターデータベース</strong></p></li>
<li><p>トレースの可視化と解析のための<strong>Jaeger</strong></p></li>
<li><p>Milvusの全操作を自動的にトレースする<strong>Pythonクライアント</strong></p></li>
<li><p>クライアントリクエストからデータベース操作までの<strong>エンドツーエンドの可視化</strong></p></li>
</ol>
<p>推定セットアップ時間：15-20分</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">クイックスタート (5分)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>まずは動作を確認したいですか？一番早い方法はこちらです：</p>
<ol>
<li>デモリポジトリをクローンします：</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>サービスを開始します：</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>30秒待ってから、Jaeger UIを確認する：<code translate="no">http://localhost:16686</code></p></li>
<li><p>Pythonのサンプルを実行する：</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Jaegerをリフレッシュして、<code translate="no">standalone</code> (Milvus)と<code translate="no">milvus-client</code> の両方のサービスのトレースを探してください。</li>
</ol>
<p>トレースが表示されていれば、すべてうまくいっている！では、どのように組み立てられているかを理解しましょう。</p>
<h2 id="Environment-Setup" class="common-anchor-header">環境セットアップ<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>必要なものは以下の通りです：</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong>(ベクターデータベース)</p></li>
<li><p><strong>Jaeger 1.46.0</strong>(トレース可視化)</p></li>
<li><p><strong>Python 3.7+</strong>(クライアント開発)</p></li>
<li><p><strong>DockerとDocker Compose</strong>（コンテナ・オーケストレーション）</p></li>
</ul>
<p>これらのバージョンは一緒にテストされていますが、新しいバージョンでも問題なく動作するはずです。</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">MilvusとJaegerのセットアップ<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Docker Composeを使用して、適切なネットワークと設定で両方のサービスを実行します。</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Docker Composeの設定</h3><p><code translate="no">docker-compose.yaml</code> ファイルを作成します：</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>注:</strong>設定ファイルの例<code translate="no">embedEtcd.yaml</code> と<code translate="no">milvus.yaml</code> は<a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a> にあります<a href="https://github.com/topikachu/milvus-py-otel">。</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Milvusトレーシング設定</h3><p><code translate="no">configs/milvus.yaml</code> ：</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>設定の説明</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> すべてのリクエストをトレースする (開発には便利ですが、運用では0.1以下を使用してください)</p></li>
<li><p><code translate="no">secure: false</code> TLSを無効にする（本番では有効にする）</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> 内部通信にDockerサービス名を使用</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">サービスの起動</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">MilvusからJaegerへのトレース配信の検証</h3><p>サービスを起動したら、Milvusスタンドアロンからトレースデータが出力され、Jaegerが受信しているか確認します。</p>
<ul>
<li><p>ブラウザを開き、Jaeger UIにアクセスします：<code translate="no">http://localhost:16686/search</code></p></li>
<li><p><strong>検索</strong>パネル (左上) で、<strong>サービス</strong>ドロップダウンを選択し、<code translate="no">standalone</code> を選択します。サービスリストに<code translate="no">standalone</code> が表示されていれば、Milvus のビルトイン OpenTelemetry コンフィギュレーションが機能しており、Jaeger に正常にトレースデータがプッシュされていることを意味します。</p></li>
<li><p><strong>トレースの検索]</strong>をクリックすると、Milvus内部のコンポーネント(モジュール間のgRPCインタラクションなど)によって生成されたトレースチェーンを検索できます。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">トレースデータが表示されない場合</h3><ul>
<li><p><code translate="no">milvus.yaml</code> の<code translate="no">trace</code> ブロックが正しく設定され、Jaeger が問題なく実行されていることを再確認してください。</p></li>
<li><p>Milvusコンテナのログを調べて、トレース初期化に関するエラーがないか確認してください。</p></li>
<li><p>数秒待ってから Jaeger UI をリフレッシュしてください。トレースレポートが少し遅れるかもしれません。</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Pythonクライアントのセットアップと依存関係<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>それでは、Milvusの全操作を自動的にトレースするためのPythonクライアントをセットアップしてみましょう。</p>
<p>まず、<code translate="no">requirements.txt</code> ファイルを作成します：</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>次に依存関係をインストールします：</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>これにより、MilvusバックエンドへのgRPCコールをトレースするためのPython環境が整います。</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">PythonでOpenTelemetryを初期化する<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>それでは、Pythonアプリケーション内でトレースを設定してみましょう。このスニペットはOTELをgRPCインスツルメンテーションでセットアップし、トレーサーを準備します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>ここでは、<code translate="no">GrpcInstrumentorClient()</code> が基礎となる gRPC スタックにフックするので、インスツルメンテーションのためにクライアントコードを手動で修正する必要はありません。<code translate="no">OTLPSpanExporter()</code> はローカルの Jaeger インスタンスにトレースデータを送るように設定されています。</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">トレースを含むMilvus Pythonの完全な例<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>では、現実的なMilvus操作によるトレースを示す包括的な例を作ってみましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">トレース出力の表示<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Pythonクライアントがトレースデータを送信したら、Jaegerに戻ります： <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p><code translate="no">milvus-client</code> サービスを選択し、PythonクライアントのMilvus操作に対応するトレーススパンを表示します。これにより、システムの境界を越えたパフォーマンスやトレース相互作用の分析がより簡単になります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">他の言語での例<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Python以外の言語でもMilvusトレースを実装することができます：</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>：OpenTelemetry Java エージェントをゼロコードでインスツルメンテーションするために使用する<a href="https://github.com/topikachu/milvus-go-otel"><strong>：</strong></a>ネイティブ統合のためにOpenTelemetry Go SDKを活用する 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>：JavaScriptSDKでgRPCコールを自動インストルメントする</p>
<p>それぞれの例は、似たようなパターンに従っていますが、言語固有の OpenTelemetry ライブラリを使用しています。</p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>あなたは、Milvus操作のエンドツーエンドのトレースを実装することに成功しました！以下はその成果です：</p>
<ul>
<li><p><strong>インフラストラクチャ</strong>：MilvusとJaegerを適切なネットワークでセットアップする。</p></li>
<li><p><strong>サーバサイドのトレース</strong>：トレースを自動的にエクスポートするようにMilvusを設定しました。</p></li>
<li><p><strong>クライアントサイドトレース</strong>：OpenTelemetryでPythonクライアントを計測</p></li>
<li><p>✅<strong>可視化</strong>：Jaeger を使ってシステムパフォーマンスを分析</p></li>
<li><p>✅<strong>生産準備</strong>：設定のベストプラクティスを学んだ</p></li>
</ul>
<p>Milvus SDKのソースコードに変更を加えることなく、全ての作業が完了しました。いくつかのコンフィギュレーションを設定するだけで、トレーシングパイプラインはシンプルで効果的、そして本番環境にも対応できるようになります。</p>
<p>ログとメトリクスを統合することで、AIネイティブベクターデータベースの展開のための完全なモニタリングソリューションを構築することができます。</p>
<h2 id="Learn-More" class="common-anchor-header">さらに詳しく<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Milvus ドキュメント: https:<a href="https://milvus.io/docs">//milvus.io/docs</a></p></li>
<li><p>OpenTelemetry for Python:<a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Jaeger ドキュメント:<a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Milvus OpenTelemetry Integration Demo (Python): https:<a href="https://github.com/topikachu/milvus-py-otel">//github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
