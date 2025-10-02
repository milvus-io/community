---
id: how-to-debug-slow-requests-in-milvus.md
title: Milvusで検索要求の遅さをデバッグする方法
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: この投稿では、Milvusで遅いリクエストをトリアージする方法と、レイテンシを予測可能で安定し、一貫して低く保つためにできる実践的なステップを紹介します。
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Milvusの心臓部はパフォーマンスです。通常であれば、Milvus内の検索リクエストはわずか数ミリ秒で完了します。しかし、クラスタが遅くなった場合、つまり検索レイテンシが秒単位になった場合はどうなるでしょうか？</p>
<p>検索が遅くなることは頻繁に起こることではありませんが、規模が大きくなったり、複雑な作業負荷がかかったりすると、検索が遅くなることがあります。ユーザー・エクスペリエンスを阻害し、アプリケーションのパフォーマンスを歪め、セットアップの隠れた非効率性を露呈することもしばしばです。</p>
<p>この投稿では、Milvusで遅いリクエストをトリアージする方法を説明し、レイテンシを予測可能で、安定し、一貫して低く保つためにできる実践的なステップを共有します。</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">遅い検索の特定<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>遅いリクエストを診断するには、2つの質問から始めます。Milvusは、メトリクスとログを通して両方の答えを提供します。</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvusメトリクス</h3><p>Milvusは、Grafanaダッシュボードで監視できる詳細なメトリクスをエクスポートします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>主なパネルは以下の通りです：</p>
<ul>
<li><p><strong>サービス品質 → 低速クエリ</strong>：proxy.slowQuerySpanInSeconds（デフォルト：5秒）を超えるリクエストにフラグを立てます。これらはPrometheusでもマークされる。</p></li>
<li><p><strong>サービス品質 → 検索待ち時間</strong>：全体的な待ち時間の分布を表示します。これが正常に見えてもエンドユーザが遅延を感じる場合、問題はMilvus外のネットワークまたはアプリケーション層にある可能性が高い。</p></li>
<li><p><strong>クエリノード → フェーズ別検索レイテンシ</strong>：待ち時間をキュー、クエリ、リデュースの各段階に分けます。より詳細な原因については、<em>Scalar</em> <em>Filter Latency</em>、<em>Vector Search Latency</em>、<em>Wait Safe Latencyなどの</em>パネルで、どの段階が支配的であるかを明らかにします。</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvusのログ</h3><p>Milvusはまた、1秒以上続くリクエストを[Search slow]のようなマーカーでタグ付けしてログに記録します。これらのログは、<em>どの</em>クエリが<em>遅いかを</em>示し、メトリクスからの洞察を補完します。目安として</p>
<ul>
<li><p><strong>&lt; 30 ms</strong>→ ほとんどのシナリオで健全な検索レイテンシ</p></li>
<li><p><strong>&gt; 100ミリ秒以上</strong>→ 調査する価値がある</p></li>
<li><p><strong>&gt; 1 s</strong>→ 間違いなく遅いので注意が必要</p></li>
</ul>
<p>ログの例：</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>要するに、<strong>メトリクスは時間がどこに流れているかを示し、ログはどのクエリがヒットしたかを示す。</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">根本原因の分析<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">重いワークロード</h3><p>遅いリクエストの一般的な原因は、過剰なワークロードです。リクエストの<strong>NQ</strong>（リクエストあたりのクエリー数）が非常に大きい場合、そのリクエストは長期間実行され、クエリーノードのリソースを独占することがあります。他のリクエストはその後ろに積み重なり、結果としてキューの待ち時間が増加します。各リクエストのNQが小さくても、全体のスループット（QPS）が非常に高ければ、milvusが内部で同時並行する検索リクエストをマージする可能性があるため、やはり同じ効果を引き起こす可能性があります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>注意すべきシグナル</strong></p>
<ul>
<li><p>すべてのクエリが予想外に高い待ち時間を示す。</p></li>
<li><p>クエリ・ノード・メトリクスが<strong>キュー内待ち時間の</strong>上昇を報告する。</p></li>
<li><p>ログに、NQが大きく、総所要時間が長いリクエストが表示されるが、DurationPerNQは比較的小さい。</p></li>
</ul>
<p><strong>修正方法</strong></p>
<ul>
<li><p><strong>バッチクエリにする</strong>：NQを控えめにして、1つのリクエストに負荷がかかりすぎないようにします。</p></li>
<li><p><strong>クエリーノードをスケールアウトする</strong>：高い同時実行が常態化している場合は、クエリーノードを追加して負荷を分散し、低レイテンシーを維持します。</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">非効率なフィルタリング</h3><p>もう一つの一般的なボトルネックは、非効率的なフィルターに起因します。フィルター式の構造が悪かったり、フィールドにスカラーインデックスがなかったりすると、milvusは小さなサブセットをスキャンするのではなく、<strong>フルスキャンに戻って</strong>しまうことがあります。JSONフィルターや厳格な一貫性設定は、オーバーヘッドをさらに増加させる可能性があります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>注意すべきシグナル</strong></p>
<ul>
<li><p>クエリノードメトリクスの<strong>スカラーフィルターのレイテンシーが</strong>高い。</p></li>
<li><p>フィルタが適用されたときのみ、顕著なレイテンシの急増。</p></li>
<li><p>厳密な一貫性が有効になっている場合、<strong>tSafe待ち時間が</strong>長い。</p></li>
</ul>
<p><strong>修正方法：</strong></p>
<ul>
<li><strong>フィルタ式を単純化します</strong>：フィルタを最適化することで、クエリ・プランの複雑さを軽減します。例えば、長いORチェーンをIN式に置き換えます：</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvusはまた、複雑な式の解析に費やす時間を削減することで効率を改善するように設計されたフィルタ式のテンプレート化機構を導入しています。詳細は<a href="https://milvus.io/docs/filtering-templating.md">このドキュメントを</a>参照してください。</p>
<ul>
<li><p><strong>適切なインデックスを追加</strong>する：フィルターで使用されるフィールドにスカラーインデックスを作成することで、フルスキャンを回避します。</p></li>
<li><p><strong>JSONを効率的に扱う</strong>：Milvus 2.6では、JSONフィールドにパスインデックスとフラットインデックスを導入し、JSONデータの効率的な取り扱いを可能にしました。また、JSONのシュレッダーも<a href="https://milvus.io/docs/roadmap.md">ロードマップに</a>あり、パフォーマンスをさらに向上させます。詳細については<a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">JSONフィールドのドキュメントを</a>参照してください。</p></li>
<li><p><strong>一貫性レベルを調整する</strong>：厳密な保証が不要な場合は、<code translate="no">_Bounded</code>_ または<code translate="no">_Eventually</code>_ 一貫性読み取りを使用し、<code translate="no">tSafe</code> 待ち時間を短縮します。</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">ベクターインデックスの不適切な選択</h3><p><a href="https://milvus.io/docs/index-explained.md">ベクター・インデックスは</a>万能ではありません。間違ったインデックスを選択すると、レイテンシに大きな影響を与えます。インメモリインデックスは最速のパフォーマンスを提供しますが、より多くのメモリを消費します。一方、オンディスクインデックスは速度の代償としてメモリを節約します。バイナリーベクターもまた、特殊なインデックス戦略を必要とする。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>注意すべきシグナル</strong></p>
<ul>
<li><p>クエリ・ノード・メトリクスにおける高いベクトル検索待ち時間。</p></li>
<li><p>DiskANNまたはMMAP使用時のディスクI/O飽和。</p></li>
<li><p>キャッシュのコールド・スタートによる再起動直後のクエリの低下。</p></li>
</ul>
<p><strong>修正方法</strong></p>
<ul>
<li><p><strong>インデックスをワークロードに合わせる（フロート・ベクトル）：</strong></p>
<ul>
<li><p><strong>HNSW</strong>- 回収率が高く、レイテンシが低いインメモリ使用ケースに最適。</p></li>
<li><p><strong>IVFファミリー</strong>- 回想とスピードの間で柔軟なトレードオフが可能。</p></li>
<li><p><strong>DiskANN</strong>- 億単位のデータセットをサポートするが、強力なディスク帯域幅が必要。</p></li>
</ul></li>
<li><p><strong>バイナリベクトル</strong> <a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSHインデックス</a>（Milvus 2.6で導入）とMHJACCARDメトリックを使用し、効率的にJaccard類似度を近似する。</p></li>
<li><p><a href="https://milvus.io/docs/mmap.md"><strong>MMAPを</strong></a><strong>有効にする</strong>：レイテンシとメモリ使用量のバランスを取るために、インデックスファイルを完全に常駐させるのではなく、メモリにマップする。</p></li>
<li><p><strong>インデックス/検索パラメータを調整する</strong>：作業負荷に応じて、リコールとレイテンシのバランスをとるように設定を調整します。</p></li>
<li><p><strong>コールドスタートの軽減</strong>：再起動後に頻繁にアクセスするセグメントをウォームアップし、最初のクエリの遅れを回避する。</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">ランタイムと環境条件</h3><p>すべての遅いクエリがクエリ自体に起因するわけではありません。クエリ・ノードは多くの場合、コンパクション、データ移行、インデックス構築などのバックグラウンド・ジョブとリソースを共有しています。アップサートが頻繁に行われると、インデックスのない小さなセグメントが多数生成され、検索は生のデータをスキャンすることを余儀なくされます。場合によっては、バージョン特有の非効率性により、パッチが適用されるまで待ち時間が発生することもある。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>注意すべきシグナル</strong></p>
<ul>
<li><p>バックグラウンドジョブ（コンパクション、マイグレーション、インデックス構築）中のCPU使用率の急上昇。</p></li>
<li><p>ディスクI/Oの飽和がクエリーパフォーマンスに影響する。</p></li>
<li><p>再起動後のキャッシュのウォームアップが非常に遅い。</p></li>
<li><p>インデックスのない小さなセグメントが大量にある（頻繁なアップサートによる）。</p></li>
<li><p>特定のmilvusバージョンに関連したレイテンシの後退。</p></li>
</ul>
<p><strong>対処法</strong></p>
<ul>
<li><p><strong>バックグラウンドタスク</strong>（コンパクションなど）の<strong>スケジュールを</strong>オフピーク時に変更する。</p></li>
<li><p><strong>未使用のコレクションを解放して</strong>メモリを解放する。</p></li>
<li><p>再起動後の<strong>ウォームアップ時間を考慮し</strong>、必要であればキャッシュを事前にウォームアップする。</p></li>
<li><p>小さなセグメントの作成を減らし、コンパクションを維持させるために、<strong>アップサートをバッチ化</strong>する。</p></li>
<li><p><strong>最新の状態に保つ</strong>：Milvusの新しいバージョンにアップグレードし、バグフィックスと最適化を行う。</p></li>
<li><p><strong>リソースの提供</strong>：レイテンシに敏感なワークロードにCPU/メモリを割り当てます。</p></li>
</ul>
<p>各シグナルを適切なアクションにマッチさせることで、ほとんどの遅いクエリは迅速かつ予測可能に解決することができます。</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">遅い検索を防ぐベストプラクティス<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>最良のデバッグセッションは、実行する必要のないセッションです。Milvusの経験では、いくつかの簡単な習慣が遅いクエリを防ぐのに大いに役立ちます：</p>
<ul>
<li><p>CPUとディスクの競合を避けるために<strong>リソースの割り当てを計画</strong>する。</p></li>
<li><p>障害とレイテンシ急増の両方に対して<strong>プロアクティブアラートを設定する</strong>。</p></li>
<li><p><strong>フィルタ式を</strong>短く、シンプルに、効率的に保つ。</p></li>
<li><p><strong>アップサートをバッチ化</strong>し、NQ/QPSを持続可能なレベルに保つ。</p></li>
<li><p>フィルターで使用される<strong>全てのフィールドにインデックスを付ける</strong>。</p></li>
</ul>
<p>Milvusで遅いクエリが発生することは稀であり、発生した場合、通常は診断可能な明確な原因があります。メトリクス、ログ、そして構造化されたアプローチにより、問題を素早く特定し、解決することができます。これは弊社のサポートチームが毎日使用しているものと同じものです。</p>
<p>このガイドが、トラブルシューティングのフレームワークを提供するだけでなく、Milvusワークロードを円滑かつ効率的に稼動させ続ける自信を提供することを願っています。</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 もっと深く知りたいですか?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>MilvusのDiscordに</strong></a>参加して、質問をしたり、経験を共有したり、コミュニティから学んだりしましょう。</p></li>
<li><p><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvusオフィスアワーに</strong></a>登録し、チームと直接話し、ワークロードに関する実践的な支援を受けましょう。</p></li>
</ul>
