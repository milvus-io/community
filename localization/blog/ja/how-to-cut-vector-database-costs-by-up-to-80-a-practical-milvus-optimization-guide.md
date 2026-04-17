---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: ベクターデータベースのコストを最大80%削減する方法：実践的milvus最適化ガイド
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvusは無料ですが、インフラは無料ではありません。より優れたインデックス、MMap、階層化ストレージにより、ベクターデータベースのメモリコストを60～80%削減する方法をご紹介します。
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>RAGのプロトタイプはうまくいきました。その後、本番稼動し、トラフィックが増加し、ベクターデータベースの請求が月500ドルから5000ドルになりました。聞き覚えがあるだろうか？</p>
<p>これは今、AIアプリケーションで最も一般的なスケーリングの問題の一つです。本当の価値を生み出すものを作ったのに、インフラコストはユーザーベースの成長よりも速く成長している。そして、請求書を見てみると、ベクター・データベースが最大のサプライズであることが多い。我々が見てきたデプロイメントでは、ベクター・データベースはアプリケーションの総コストのおよそ40～50％を占めることがあり、LLM APIコールに次いで大きい。</p>
<p>このガイドでは、ベクター・データベースが実際にどこに使われているのか、そしてそれを削減するためにできる具体的なことを説明する。オープンソースのベクターデータベースとして最もポピュラーな<a href="https://milvus.io/">Milvusを</a>主な例として挙げますが、この原則はほとんどのベクターデータベースに当てはまります。</p>
<p><em>はっきり言っておくと、</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>自体はフリーでオープンソースである。コストは、クラウドインスタンス、メモリ、ストレージ、ネットワークなど、Milvusを稼働させるためのインフラから発生する。良いニュースは、そのインフラコストのほとんどが削減可能だということだ。</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">VectorDBを使用する際、実際にお金はどこに行くのか？<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>具体的な例から見てみよう。例えば、1億個のベクトルを768次元でfloat32として保存しているとします。AWSの1ヶ月のコストは大体こんな感じだ：</p>
<table>
<thead>
<tr><th><strong>コストコンポーネント</strong></th><th><strong>シェア</strong></th><th><strong>~月間コスト</strong></th><th><strong>備考</strong></th></tr>
</thead>
<tbody>
<tr><td>コンピュート（CPU + メモリ）</td><td>85-90%</td><td>$2,800</td><td>大部分はメモリ</td></tr>
<tr><td>ネットワーク</td><td>5-10%</td><td>$250</td><td>クロスAZトラフィック、大きな結果ペイロード</td></tr>
<tr><td>ストレージ</td><td>2-5%</td><td>$100</td><td>安い - オブジェクトストレージ（S3/MinIO）は~$0.03/GB</td></tr>
</tbody>
</table>
<p>重要なのは、85-90%はメモリで賄うということだ。ネットワークとストレージは端的に言えば重要だが、実質的なコスト削減を望むなら、メモリがテコになる。このガイドでは、すべてメモリに焦点を当てている。</p>
<p><strong>ネットワークとストレージに関する簡単なメモ：</strong>必要なフィールド（ID、スコア、キーメタデータ）のみを返し、クロスリージョンクエリを避けることで、ネットワークコストを削減することができる。ベクターはS3のような安価なオブジェクトストレージに置かれるため、100Mのベクターでもストレージは通常月50ドル以下です。これらのどちらも、メモリの最適化のように針を動かすことはありません。</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">ベクトル検索にメモリが高価な理由<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のデータベースから来た場合、ベクトル検索に必要なメモリは驚くべきものだ。リレーショナル・データベースは、ディスク・ベースのBツリー・インデックスとOSのページ・キャッシュを活用することができる。また、HNSWやIVFのようなインデックスは、ミリ秒レベルのレイテンシーを実現するために、メモリにロードされ続ける必要があります。</p>
<p>必要なメモリを見積もるための簡単な公式を以下に示す：</p>
<p><strong>必要メモリ＝（ベクトル×次元×4バイト）×インデックス倍率</strong></p>
<p>100M×768×float32でHNSWを使用した例（倍率～1.8倍）：</p>
<ul>
<li>生データ：100M × 768 × 4バイト ≒ 307 GB</li>
<li>HNSWインデックス使用時307 GB × 1.8 ≒ 553 GB</li>
<li>OSのオーバーヘッド、キャッシュ、ヘッドルームを含む：合計 ~768 GB</li>
<li>AWSの場合：3×r6i.8xlarge（各256GB）≒2,800ドル/月</li>
</ul>
<p><strong>これがベースラインだ。では、これを下げる方法を見てみよう。</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1.適切なインデックスを選んでメモリ使用量を4倍減らす<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>これは、最もインパクトのある変更だ。同じ100Mベクトルデータセットでも、インデックスの選択次第でメモリ使用量は4～6倍も変わる。</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: ほとんど圧縮しないため、メモリ使用量は生データサイズに近く、<strong>約300GBに</strong>とどまる。</li>
<li><strong>HNSW</strong>: 余分なグラフ構造を保存するため、メモリ使用量は通常、生データサイズの<strong>1.5倍から2.0倍</strong>、<strong>約450GBから600GBに</strong>なります。</li>
<li><strong>IVF_SQ8</strong>：float32の値をuint8に圧縮し、<strong>約4倍に圧縮する</strong>。</li>
<li><strong>IVF_PQ / DiskANN</strong>: より強力な圧縮またはディスクベースのインデックスを使用。</li>
</ul>
<p>多くのチームは、クエリー速度が最も速いという理由でHNSWから始めるが、結局は必要以上に3～5倍のコストを支払うことになる。</p>
<p>主なインデックスタイプの比較は以下の通りです：</p>
<table>
<thead>
<tr><th><strong>インデックス</strong></th><th><strong>メモリ乗数</strong></th><th><strong>クエリー速度</strong></th><th><strong>リコール</strong></th><th><strong>最適</strong></th></tr>
</thead>
<tbody>
<tr><td>フラット</td><td>~1.0x</td><td>遅い</td><td>100%</td><td>小規模データセット(&lt;1M)、テスト用</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>中</td><td>95-99%</td><td>一般的な使用</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>中</td><td>93-97%</td><td>コスト重視の生産（推奨）</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>速い</td><td>70-80%</td><td>非常に大きなデータセット、粗い検索</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>非常に高速</td><td>98-99%</td><td>レイテンシがコストより重要な場合のみ</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>中</td><td>95-98%</td><td>NVMe SSDによる超大規模化</td></tr>
</tbody>
</table>
<p><strong>結論</strong>HNSWまたはIVF_FLATからIVF_SQ8に切り替えると、通常、メモリコストを約70%削減する一方で、リコールはわずか2～3%しか低下しません（例えば、97%から94～95%）。ほとんどのRAGワークロードでは、このトレードオフは絶対に価値がある。粗い検索を行っていたり、精度のハードルが低い場合は、IVF_PQやIVF_RABITQを使用することで、さらに節約効果が高まります。</p>
<p><strong>私のお勧めは</strong>HNSWを実運用しており、コストが気になる場合は、まずテストコレクションでIVF_SQ8をお試しください。実際のクエリーでリコールを測定してください。ほとんどのチームは、精度の低下が非常に小さいことに驚きます。</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2.すべてをメモリにロードするのをやめ、60%～80%のコスト削減を実現<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>より効率的なインデックスを選んでも、メモリに必要以上のデータが残っている可能性があります。Milvusはこれを解決するために2つの方法を提供している：<strong>MMap（2.3から利用可能）と階層化ストレージ（2.6から利用可能）です。どちらもメモリ使用量を60-80%削減できます。</strong></p>
<p>どちらもコアとなる考え方は同じで、すべてのデータが常にメモリ上にある必要はないということだ。違いは、メモリ上にないデータをどのように扱うかです。</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap（メモリー・マップド・ファイル）</h3><p>MMapは、データファイルをローカルディスクからプロセスアドレス空間にマッピングします。完全なデータセットはノードのローカルディスクに残り、OSはアクセスされたときだけオンデマンドでページをメモリにロードします。MMapを使用する前は、すべてのデータはオブジェクトストレージ（S3/MinIO）からQueryNodeのローカルディスクにダウンロードされます。</p>
<ul>
<li>メモリ使用量はフルロードモードの～10～30%に低下する。</li>
<li>レイテンシは安定して予測可能（データはローカルディスクにあり、ネットワークフェッチはない）</li>
<li>トレードオフ：ローカルディスクはフルデータセットを保持するのに十分な大きさが必要</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">階層型ストレージ</h3><p>階層型ストレージはさらに一歩進んでいる。ローカルディスクにすべてをダウンロードする代わりに、ローカルディスクをホットデータのキャッシュとして使用し、オブジェクトストレージをプライマリーレイヤーとして維持する。データは必要なときだけオブジェクト・ストレージからフェッチされる。</p>
<ul>
<li>メモリ使用量はフルロードモードの10%未満に低下。</li>
<li>ローカルディスクの使用量も減少 - ホットデータのみがキャッシュされる（通常は全体の10～30％）。</li>
<li>トレードオフ：キャッシュ・ミスにより50～200msのレイテンシが発生（オブジェクト・ストレージからのフェッチ）</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">データフローとリソース使用量</h3><table>
<thead>
<tr><th><strong>モード</strong></th><th><strong>データフロー</strong></th><th><strong>メモリ使用量</strong></th><th><strong>ローカルディスク使用量</strong></th><th><strong>待ち時間</strong></th></tr>
</thead>
<tbody>
<tr><td>従来の全負荷</td><td>オブジェクト・ストレージ → メモリ (100%)</td><td>非常に高い（100）</td><td>低い（一時的のみ）</td><td>非常に低く安定</td></tr>
<tr><td>MMap</td><td>オブジェクトストレージ → ローカルディスク (100%) → メモリ (オンデマンド)</td><td>低い (10-30%)</td><td>高い（100）</td><td>低く安定</td></tr>
<tr><td>階層型ストレージ</td><td>オブジェクト・ストレージ ↔ ローカル・キャッシュ（ホット・データ） → メモリ（オン・デマンド）</td><td>非常に低い (&lt;10%)</td><td>低い（ホットデータのみ）</td><td>キャッシュ・ヒットは低く、キャッシュ・ミスは高い</td></tr>
</tbody>
</table>
<p><strong>ハードウェアの推奨：</strong>どちらの方式もローカルディスクI/Oに大きく依存するため、<strong>NVMe SSDを</strong>強く推奨し、理想的には<strong>IOPSが10,000を</strong>超える。</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMapとティアード・ストレージの比較：どちらを使うべきか？</h3><table>
<thead>
<tr><th><strong>状況</strong></th><th><strong>使用方法</strong></th><th><strong>理由</strong></th></tr>
</thead>
<tbody>
<tr><td>レイテンシ重視（P99 &lt; 20ms）</td><td>MMap</td><td>データはすでにローカルディスク上にある - ネットワークフェッチなし、安定したレイテンシ</td></tr>
<tr><td>均一なアクセス（ホット/コールドの明確な分岐がない）</td><td>MMap</td><td>階層型ストレージを有効にするにはホット/コールドスキューが必要。</td></tr>
<tr><td>コスト優先（時折レイテンシが急増しても問題なし）</td><td>階層型ストレージ</td><td>メモリとローカルディスクの両方を節約（ディスクを70-90%削減）</td></tr>
<tr><td>ホット/コールドパターンが明確（80/20ルール）</td><td>階層型ストレージ</td><td>ホット・データはキャッシュされたまま、コールド・データはオブジェクト・ストレージに安価に保管</td></tr>
<tr><td>非常に大規模（&gt;500Mベクトル）</td><td>階層型ストレージ</td><td>この規模では、1つのノードのローカルディスクではデータセット全体を保持できないことが多い。</td></tr>
</tbody>
</table>
<p><strong>注：</strong>MMapにはMilvus 2.3+が必要です。階層型ストレージにはMilvus 2.6+が必要です。どちらもNVMe SSD（10,000以上のIOPSを推奨）で最適に動作します。</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">MMapの設定方法</h3><p><strong>オプション1: YAML設定 (新規導入時に推奨)</strong></p>
<p>Milvus設定ファイルmilvus.yamlを編集し、queryNodeセクションの下に以下の設定を追加します：</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>オプション 2: Python SDK 設定 (既存のコレクション用)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">階層型ストレージの設定方法 (Milvus 2.6+)</h3><p>Milvus設定ファイル milvus.yaml を編集し、queryNodeセクションに以下の設定を追加します：</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">低次元の埋め込みを使用する<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>これは見落としがちですが、次元は直接的にコストに影響します。メモリ、ストレージ、計算はすべて次元数に応じて直線的に増加します。同じデータに対して、1536次元のモデルは384次元のモデルよりもおよそ4倍のインフラコストがかかります。</p>
<p>コサイン類似度はO(D)であるため、クエリーあたり768次元のベクトルは384次元のベクトルの約2倍の計算を必要とします。高QPSワークロードでは、この差はそのまま必要なノード数の減少につながります。</p>
<p>以下は、一般的な埋め込みモデルの比較です（384-dimを1.0倍のベースラインとして使用）：</p>
<table>
<thead>
<tr><th><strong>モデル</strong></th><th><strong>次元数</strong></th><th><strong>相対コスト</strong></th><th><strong>リコール</strong></th><th><strong>最適</strong></th></tr>
</thead>
<tbody>
<tr><td>テキスト埋め込み-3-ラージ</td><td>3072</td><td>8.0x</td><td>98%+</td><td>精度が譲れない場合（研究、ヘルスケア）</td></tr>
<tr><td>テキスト埋め込み-3-小</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>一般的なRAGワークロード</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>コストと性能のバランスが良い</td></tr>
<tr><td>オールミニLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>コスト重視のワークロード</td></tr>
</tbody>
</table>
<p><strong>実践的なアドバイス</strong>最大のモデルが必要だと決めつけないでください。実際のクエリを代表するサンプル（通常は1Mベクトルで十分）でテストし、精度の基準を満たす最小次元のモデルを見つけましょう。多くのチームは、768次元でも1536次元と同じように機能することを発見しています。</p>
<p><strong>すでに高次元のモデルにコミットしていますか？</strong>事後的に次元を減らすことができます。PCA（主成分分析）は冗長な特徴を取り除くことができ、<a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">マトリョーシカ埋め込みは</a>品質をほとんど保持したまま最初のN次元に切り捨てることができます。どちらも、データセット全体を再埋め込みする前に試してみる価値がある。</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">コンパクションとTTLでデータのライフサイクルを管理する<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>これはあまり派手ではないが、特に長時間稼働するプロダクション・システムにとっては重要である。Milvusは追記型ストレージモデルを採用しており、データを削除すると、削除済みとマークされますが、すぐには削除されません。削除されたデータは削除されたものとしてマークされますが、すぐに削除されるわけではありません。時間が経つにつれて、この死んだデータは蓄積され、ストレージスペースを浪費し、クエリが必要以上に行をスキャンする原因となります。</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">コンパクション：削除されたデータからストレージを取り戻す</h3><p>コンパクションはMilvusのバックグラウンド処理で、データ整理を行います。小さなセグメントを結合し、削除されたデータを物理的に削除し、圧縮されたファイルを書き換えます。以下のような場合にお勧めします：</p>
<ul>
<li>頻繁に書き込みや削除を行う場合（製品カタログ、コンテンツ更新、リアルタイムログなど）</li>
<li>セグメント数が増え続けている（クエリーごとのオーバーヘッドが増える）</li>
<li>ストレージの使用量が実際の有効データよりはるかに速く増加している。</li>
</ul>
<p><strong>注意：</strong>コンパクションはI/O負荷が高い。トラフィックの少ない時間帯（夜間など）にスケジュールを組むか、本番クエリと競合しないようにトリガーを慎重にチューニングしてください。</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(Time to Live)：古いベクトルデータを自動的に失効させる</h3><p>自然に期限切れになるデータについては、手動で削除するよりもTTLの方がすっきりする。データの有効期限を設定し、有効期限が切れるとmilvusが自動的に削除マークを付けます。実際のクリーンアップはコンパクションが行います。</p>
<p>これは次のような場合に便利です：</p>
<ul>
<li>ログとセッションデータ - 過去7日または30日分のみを保存する。</li>
<li>時間に敏感なRAG - 最近の知識を優先し、古いドキュメントは期限切れにする。</li>
<li>リアルタイムのレコメンデーション - 最近のユーザー行動からのみ取得する。</li>
</ul>
<p>コンパクションとTTLを併用することで、システムに無駄が蓄積されるのを防ぐことができる。これは最大のコスト削減策ではないが、チームを油断させるようなゆっくりとしたストレージの増加を防ぐことができる。</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">もう一つの選択肢Zilliz Cloud（フルマネージドMilvus）<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>完全な情報開示：<a href="https://zilliz.com/">Zilliz Cloudは</a>Milvusを開発したチームによって構築されている。</p>
<p>Milvusがフリーでオープンソースであるにもかかわらず、マネージド・サービスの方がセルフ・ホスティングよりもコストが安いのだ。理由は簡単で、ソフトウェアは無料だが、それを実行するためのクラウドインフラは無料ではなく、それを運用・保守するエンジニアが必要だからだ。マネージドサービスを利用することで、より少ないマシンと少ないエンジニア工数で同じ作業を行うことができれば、サービス自体の料金を支払った後でも、総請求額は少なくなります。</p>
<p><a href="https://zilliz.com/">Zilliz Cloudは</a>、Milvus上に構築され、MilvusとAPI互換性のあるフルマネージドサービスです。コストに関係するのは次の2点です：</p>
<ul>
<li><strong>ノードあたりのパフォーマンスの向上。</strong>Zilliz Cloudは最適化された検索エンジンCardinal上で動作します。<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">VectorDBBenchの結果に</a>よると、オープンソースのMilvusよりも3～5倍高いスループットを実現し、10倍高速です。実際には、同じワークロードに対しておよそ3分の1から5分の1のコンピュートノードが必要ということになります。</li>
<li><strong>組み込みの最適化</strong>本ガイドで取り上げた機能（MMap、階層型ストレージ、インデックスの量子化）はビルトインされており、自動的に調整される。自動スケーリングは実際の負荷に基づいて容量を調整するため、必要のないヘッドルームのために料金を支払う必要はない。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>APIとデータフォーマットに互換性があるため、<a href="https://zilliz.com/zilliz-migration-service">移行は</a>簡単だ。Zillizは移行支援ツールも提供している。詳細な比較は<a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloudとmilvusの比較</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">まとめ：ベクターデータベースのコストを削減するステップバイステッププラン<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>インデックス・タイプを確認する。</strong></p>
<p>コスト重視のワークロードでHNSWを実行しているなら、IVF_SQ8に切り替えましょう。それだけで、最小限のリコール・ロスで、メモリー・コストを～70％削減できる。</p>
<p>さらに上を目指すなら、優先順位は以下の通りだ：</p>
<ul>
<li><strong>インデックスを切り替える</strong>- ほとんどのワークロードでHNSW → IVF_SQ8。アーキテクチャを変更することなく、最大の効果が得られる。</li>
<li><strong>MMapまたは階層型ストレージを有効にする</strong>。これは再設計ではなく、構成の変更である。</li>
<li><strong>エンベッディングの寸法を評価する</strong>- より小さなモデルが精度のニーズを満たすかどうかをテストする。これには再エンベッディングが必要ですが、節約効果は大きくなります。</li>
<li><strong>コンパクションとTTLの設定</strong>- 特に書き込みや削除を頻繁に行う場合、サイレントデータの肥大化を防ぎます。</li>
</ul>
<p>これらの戦略を組み合わせることで、ベクターデータベースのコストを60～80％削減することができる。すべてのチームが4つすべてを必要とするわけではありません。インデックスの変更から始め、その影響を測定し、リストの下の方へと作業を進めてください。</p>
<p>運用作業を減らしてコスト効率を高めたいチームには、Milvusのマネージド・サービスである<a href="https://zilliz.com/">Zilliz Cloudも</a>選択肢の一つだ。</p>
<p><a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">MilvusコミュニティのSlackは</a>、これらの最適化に取り組んでいて、ノートを比較したい場合、質問するのに良い場所です。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーに</a>参加すれば、あなたの特定のセットアップについてエンジニアリングチームと素早くチャットすることができます。</p>
