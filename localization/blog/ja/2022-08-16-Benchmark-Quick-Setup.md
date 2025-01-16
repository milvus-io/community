---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: milvus2.1ベンチマーククイック・ガイド
author: Yanliang Qiao
date: 2022-08-16T00:00:00.000Z
desc: Milvus 2.1ベンチマークを自分で実行するためのステップバイステップガイドに従ってください。
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>カバー</span> </span></p>
<p>最近、<a href="https://milvus.io/docs/v2.1.x/benchmark.md">Milvus 2.1のベンチマーク</a>レポートを更新した。100万ベクトルからなるデータセットを用いたテストにより、small-<a href="https://milvus.io/docs/v2.1.x/benchmark.md#Terminology">nq</a>クエリをマージすることでQPSが劇的に向上することが証明されました。</p>
<p>このテストを簡単に再現するための簡単なスクリプトを紹介します。</p>
<h2 id="Procedures" class="common-anchor-header">手順<button data-href="#Procedures" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p>Milvusスタンドアロンまたはクラスタをデプロイする。この場合、MilvusサーバのIPアドレスは10.100.31.105である。</p></li>
<li><p>クライアントをデプロイする。今回はUbuntu 18.04とPython 3.8.13を使用します。以下のコードを実行して、PyMilvus 2.1.1をインストールします。</p></li>
</ol>
<pre><code translate="no">pip install pymilvus==2.1.1
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>以下のファイルをダウンロードして、クライアントと同じ作業ディレクトリにコピーします。この場合、作業ディレクトリは<code translate="no">/go_ben</code>.</p>
<ul>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py"><code translate="no">collection_prepare.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py"><code translate="no">go_benchmark.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark"><code translate="no">benchmark</code></a>(Ubuntuの場合)または <a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac"><code translate="no">benchmark-mac</code></a>(macOSの場合)</p></li>
</ul>
<p><strong>です：</strong></p>
<ul>
<li><p><code translate="no">benchmark</code> および は、Go SDK 2.1.1を使用して開発およびコンパイルされた実行可能ファイルです。これらは同時検索を行うためにのみ使用されます。<code translate="no">benchmark-mac</code> </p></li>
<li><p>Ubuntuユーザーの方は、<code translate="no">benchmark</code> をダウンロードしてください。macOSユーザーの方は、<code translate="no">benchmark-mac</code> をダウンロードしてください。</p></li>
<li><p><code translate="no">benchmark</code> または<code translate="no">benchmark-mac</code> にアクセスするには、実行可能パーミッションが必要です。</p></li>
<li><p>Macユーザーは、システム環境設定の「セキュリティとプライバシー」を設定して、<code translate="no">benchmark-mac</code> ファイルを信頼する必要があります。</p></li>
<li><p>同時検索に関する設定は、<code translate="no">go_benchmark.py</code> のソースコードで確認および変更できます。</p></li>
</ul></li>
</ol>
<ol start="4">
<li>コレクションを作成し、ベクトルデータを挿入する。</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-comment"># python collection_prepare.py 10.100.31.105 </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li><code translate="no">/tmp/collection_prepare.log</code> を開いて実行結果をチェックする。</li>
</ol>
<pre><code translate="no">...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li><code translate="no">benchmark</code> （macOS では<code translate="no">benchmark-mac</code> ） を呼 び 出 して、同時検索を実行する。</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-meta"># python go_benchmark.py 10.100.31.105 ./benchmark</span>
[<span class="hljs-meta">write_json_file</span>] <span class="hljs-function">Remove <span class="hljs-title">file</span>(<span class="hljs-params">search_vector_file.json</span>).
[write_json_file] Write json <span class="hljs-keyword">file</span>:search_vector_file.json done.
Params of go_benchmark: [&#x27;./benchmark&#x27;, &#x27;locust&#x27;, &#x27;-u&#x27;, &#x27;10.100.31.105:19530&#x27;, &#x27;-q&#x27;, &#x27;search_vector_file.json&#x27;, &#x27;-s&#x27;, &#x27;</span>{\n  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;random_1m&quot;</span>,\n  <span class="hljs-string">&quot;partition_names&quot;</span>: [],\n  <span class="hljs-string">&quot;fieldName&quot;</span>: <span class="hljs-string">&quot;embedding&quot;</span>,\n  <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,\n  <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>,\n  <span class="hljs-string">&quot;params&quot;</span>: {\n    <span class="hljs-string">&quot;sp_value&quot;</span>: <span class="hljs-number">64</span>,\n    <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>\n  },\n  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">1</span>,\n  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-literal">null</span>,\n  <span class="hljs-string">&quot;output_fields&quot;</span>: [],\n  <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">600</span>\n}<span class="hljs-string">&#x27;, &#x27;</span>-p<span class="hljs-string">&#x27;, &#x27;</span><span class="hljs-number">10&#x27;</span>, <span class="hljs-string">&#x27;-f&#x27;</span>, <span class="hljs-string">&#x27;json&#x27;</span>, <span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;60&#x27;</span>, <span class="hljs-string">&#x27;-i&#x27;</span>, <span class="hljs-string">&#x27;20&#x27;</span>, <span class="hljs-string">&#x27;-l&#x27;</span>, <span class="hljs-string">&#x27;go_log_file.log&#x27;</span>]
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - go search     <span class="hljs-number">9665</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.679</span>     <span class="hljs-number">6.499</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">12.810</span>  |    <span class="hljs-number">483.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - go search    <span class="hljs-number">19448</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.443</span>     <span class="hljs-number">6.549</span>    <span class="hljs-number">78.121</span>    <span class="hljs-number">13.401</span>  |    <span class="hljs-number">489.22</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29170</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.568</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">76.887</span>    <span class="hljs-number">12.828</span>  |    <span class="hljs-number">486.15</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][   DEBUG] - go search run finished, parallel: <span class="hljs-number">10</span>(benchmark_run.go:<span class="hljs-number">95</span>:benchmark)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29180</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.560</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">13.014</span>  |    <span class="hljs-number">486.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">160</span>:samplingLoop)
Result of go_benchmark: {<span class="hljs-string">&#x27;response&#x27;</span>: True, <span class="hljs-string">&#x27;err_code&#x27;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&#x27;err_message&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>} 
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>カレントディレクトリの下にある<code translate="no">go_log_file.log</code> ファイルを開いて、詳細な検索ログを確認する。検索ログに記載されている検索情報は以下の通りです。<ul>
<li><p>reqs: 同時検索が発生した時点から現在までの検索リクエスト数（現在のタイムスパン）</p></li>
<li><p>fails: 現在のタイムスパンにおける reqs に占める失敗したリクエストの数</p></li>
<li><p>Avg: 現在のタイムスパンにおける平均リクエスト応答時間（単位：ミリ秒）</p></li>
<li><p>Min: 現在のタイムスパンにおける最小リクエスト・レスポンス・タイム (単位: ミリ秒)</p></li>
<li><p>Max: 現在のタイムスパンにおけるリクエスト・レスポンス・タイムの最大値 (単位: ミリ秒)</p></li>
<li><p>Median: 現在のタイムスパンにおけるリクエスト応答時間の中央値 (単位: ミリ秒)</p></li>
<li><p>req/s：1秒あたりのリクエスト数、つまりQPS</p></li>
<li><p>failures/s: 現在のタイムスパンにおける1秒あたりの平均失敗リクエスト数</p></li>
</ul></li>
</ol>
<h2 id="Downloading-Scripts-and-Executable-Files" class="common-anchor-header">スクリプトと実行ファイルのダウンロード<button data-href="#Downloading-Scripts-and-Executable-Files" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py">collection_prepare.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py">go_benchmark.py</a></p></li>
<li><p>Ubuntu 用<a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark">benchmark</a></p></li>
<li><p>macOS用<a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac">benchmark-mac</a></p></li>
</ul>
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介する一連のブログを用意しました。このブログシリーズの続きを読む</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Embedded Milvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus Vectorデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
