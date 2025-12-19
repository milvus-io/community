---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: コールドデータへの支払いをやめる：milvus階層型ストレージのオンデマンド・ホット/コールド・データ・ローディングによる80%のコスト削減
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  MilvusのTiered
  Storageが、ホットデータとコールドデータのオンデマンド・ローディングを可能にし、最大80%のコスト削減とロード時間の短縮をスケーラブルに実現する方法をご覧ください。
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>システムがほとんど触れていないデータのために、いまだに割高なインフラ料金を支払っているチームはどれくらいあるだろうか？正直に言うと、ほとんどのチームがそうだ。</strong></p>
<p>ベクター検索をプロダクションで運用しているのであれば、おそらくこのような状況を目の当たりにしているはずだ。大量のメモリとSSDをプロビジョニングすることで、データセットのほんの一部しかアクティブになっていないにもかかわらず、すべてが「クエリ・レディ」の状態に保たれているのだ。そして、それはあなただけではない。同じようなケースはたくさん見てきました：</p>
<ul>
<li><p><strong>マルチテナントのSaaSプラットフォーム：</strong>マルチテナントのSaaSプラットフォーム：何百ものテナントが契約しているが、ある日アクティブなのは10～15%に過ぎない。残りのテナントは、リソースを占有したまま放置されている。</p></li>
<li><p><strong>Eコマース・レコメンデーション・システム：</strong>100万ものSKUがあるにもかかわらず、上位8％の商品がレコメンデーションと検索トラフィックのほとんどを生み出している。</p></li>
<li><p><strong>AI検索：</strong>ユーザーのクエリの90％が過去1週間の商品をヒットしているにもかかわらず、膨大な埋め込みアーカイブがある。</p></li>
</ul>
<p><strong>頻繁にクエリされるデータは全体の10％以下だが、ストレージとメモリの80％を消費している</strong>。この不均衡が存在することは誰もが知っていますが、最近まで、それを修正するクリーンなアーキテクチャの方法はありませんでした。</p>
<p><strong>それが</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6で</a><strong>変わります</strong><strong>。</strong></p>
<p>このリリース以前は、Milvusは（多くのベクターデータベースと同様に）<strong>フルロードモデルに</strong>依存していた。検索可能なデータが必要な場合、ローカルノードにロードする必要があった。検索可能なデータが必要な場合は、ローカルノードにロードされなければならなかった。そのデータが1分間に1000回ヒットするか、四半期に1回ヒットするかは問題ではなく、<strong>すべてホットな状態を維持しなければならなかった。</strong>この設計上の選択により、予測可能なパフォーマンスを確保することができましたが、クラスタのサイズを大きくし、コールドデータにはふさわしくないリソースにお金を払うことになりました。</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">階層型</a> <strong>ストレージが私たちの答えです。</strong></p>
<p>Milvus 2.6では、<strong>真のオンデマンドローディングを</strong>備えた新しい階層型ストレージアーキテクチャを導入し、システムがホットデータとコールドデータを自動的に区別できるようにしました：</p>
<ul>
<li><p>ホットセグメントはコンピュート近くにキャッシュされます。</p></li>
<li><p>コールドセグメントはリモートのオブジェクトストレージに安価に保存</p></li>
<li><p><strong>クエリが実際にデータを必要とするときだけ、</strong>ローカルノードにデータを取り込む。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これにより、コスト構造が "どれだけのデータを持っているか "から "<strong>どれだけのデータを実際に使用しているか "</strong>にシフトする。そして、初期の本番環境では、この単純なシフトにより、<strong>ストレージとメモリーのコストを最大80％削減することが</strong>できる。</p>
<p>この記事の続きでは、Tiered Storageがどのように機能するかを説明し、実際のパフォーマンス結果を共有し、この変更が最大の効果をもたらす場所を示す。</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">フルローディングがスケールダウンする理由<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>ソリューションに入る前に、なぜMilvus 2.5とそれ以前のリリースで使われていた<strong>フルロードモードが</strong>、ワークロードの規模が拡大するにつれて制限要因になったのかを詳しく見ておく価値がある。</p>
<p>Milvus 2.5およびそれ以前では、ユーザーが<code translate="no">Collection.load()</code> リクエストを発行すると、各QueryNodeはメタデータ、フィールドデータ、インデックスを含むコレクション全体をローカルにキャッシュしていた。これらのコンポーネントは、オブジェクトストレージからダウンロードされ、完全にメモリに格納されるか、ローカルディスクにメモリマップ（mmap）されます。このデータが<em>すべて</em>ローカルで利用できるようになって初めて、コレクションはロードされ、クエリを処理する準備ができたとマークされます。</p>
<p>言い換えると、コレクションは、ホットまたはコールドの完全なデータセットがノード上に存在するまで、クエリ可能ではありません。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>注意:</strong>未加工のベクトルデータを含むインデックスタイプの場合、Milvusはベクトルフィールドを個別にロードするのではなく、インデックスファイルのみをロードします。それでも、実際にどの程度のデータにアクセスするかに関わらず、クエリに対応するためにはインデックスを完全にロードする必要があります。</p>
<p>これがなぜ問題になるかを知るために、具体的な例を考えてみましょう：</p>
<p>具体的な例を考えてみましょう：</p>
<ul>
<li><p><strong>1億ベクトル</strong></p></li>
<li><p><strong>768次元</strong>（BERTエンベッディング）</p></li>
<li><p><strong>float32</strong>精度（各次元4バイト）</p></li>
<li><p><strong>HNSWインデックス</strong></p></li>
</ul>
<p>このセットアップでは、HNSWインデックスだけで、埋め込まれた生ベクトルを含めて、約430GBのメモリを消費する。ユーザーID、タイムスタンプ、カテゴリーラベルのような一般的なスカラーフィールドを追加すると、ローカルリソースの総使用量は500GBを簡単に超えます。</p>
<p>これは、データの80%がめったにクエリされないか、まったくクエリされない場合でも、システムはコレクションをオンラインに保つためだけに、500GB以上のローカルメモリまたはディスクをプロビジョニングし、保持しなければならないことを意味します。</p>
<p>ワークロードによっては、この動作は許容範囲内です：</p>
<ul>
<li><p>ほぼすべてのデータが頻繁にアクセスされる場合、すべてを完全にロードすることで、可能な限り低いクエリ・レイテンシが得られますが、コストは最も高くなります。</p></li>
<li><p>データをホットサブセットとウォームサブセットに分割できる場合、ウォームデータをディスクにメモリマッピングすることで、メモリへの負荷を部分的に軽減することができます。</p></li>
</ul>
<p>しかし、データの80%以上がロングテールに位置するようなワークロードでは、<strong>パフォーマンスと</strong> <strong>コストの</strong>両面で、フルローディングの欠点がすぐに表面化します。</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">パフォーマンスのボトルネック</h3><p>実際には、フルローディングはクエリのパフォーマンス以上に影響し、日常的な運用ワークフローを遅くすることが多い：</p>
<ul>
<li><p><strong>ローリングアップグレードの長期化：</strong>大規模クラスタでは、ローリングアップグレードに数時間から丸一日かかることもある。</p></li>
<li><p><strong>障害後の回復が遅い：</strong>QueryNodeが再起動すると、すべてのデータが再ロードされるまでトラフィックに対応できないため、復旧時間が大幅に長くなり、ノード障害の影響が増幅されます。</p></li>
<li><p><strong>反復と実験の速度低下：</strong>フルロードは開発ワークフローを遅らせ、AIチームは新しいデータセットやインデックス構成をテストする際、データがロードされるまで何時間も待たなければならない。</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">コストの非効率性</h3><p>フルローディングはインフラコストも押し上げる。例えば、メモリが最適化された主流のクラウドインスタンスでは、1TBのデータをローカルに保存する場合、およそ<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**</mn></mrow></semantics></math></span></span>70<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">,</mo><mn>000peryear</mn><mo separator="true">∗∗、</mo></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">basedonconservativepricing</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">（</mo><mi>AWSr</mi><mi>6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70,000/年**、</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">basedonconservativepricing（AWS</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">000peryear</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> ∗</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">basedonconservativepricing（AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 /GB/月; GCP n4-highmem：~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68</mi><mn>/GB/月</mn><mo separator="true">;</mo><mi>AzureE</mi><mi>-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68/GB/月;Azure E-series：</annotation></semantics></math></span></span>~<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> 5</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">68</span><span class="mord">/GB/月</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">シリーズ</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67/GB/月）。</span></span></span></p>
<p>次に、より現実的なアクセスパターンを考えてみよう。そのデータの80%はコールドデータであり、代わりにオブジェクトストレージに保存することができる（おおよそ$0.023 / GB /月）：</p>
<ul>
<li><p>ホットデータ200GB × $5.68</p></li>
<li><p>コールドデータ800GB × $0.023</p></li>
</ul>
<p>年間コスト：（200×5.68+800×0.023）×12≒14<strong>,000</strong>ドル</p>
<p>これは、実際に重要な部分のパフォーマンスを犠牲にすることなく、総ストレージコストを<strong>80%削減</strong>することになる。</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">階層型ストレージとその仕組みとは？<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>このトレードオフをなくすために、Milvus 2.6では、ローカルストレージをデータセット全体のコンテナとしてではなく、キャッシュとして扱うことで、性能とコストのバランスをとる<strong>Tiered Storageを</strong>導入した。</p>
<p>このモデルでは、QueryNodeは起動時に軽量のメタデータのみをロードします。フィールドデータとインデックスは、クエリが必要とするときにリモート・オブジェクト・ストレージからオンデマンドでフェッチされ、頻繁にアクセスされる場合はローカルにキャッシュされる。また、頻繁にアクセスされる場合はローカルにキャッシュされます。</p>
<p>その結果、ホットデータはコンピュート・レイヤーの近くに留まり、低レイテンシーのクエリーを実現し、コールドデータは必要な時までオブジェクト・ストレージに留まります。これにより、ロード時間が短縮され、リソース効率が向上し、QueryNodeはローカルメモリやディスク容量よりもはるかに大きなデータセットをクエリできるようになります。</p>
<p>実際には、Tiered Storageは以下のように機能する：</p>
<ul>
<li><p><strong>ホットデータをローカルに保つ：</strong>頻繁にアクセスされるデータのおよそ20%をローカルノードに常駐させ、最も重要な80%のクエリで低レイテンシを実現します。</p></li>
<li><p><strong>コールドデータをオンデマンドでロードする：</strong>残りの80%のアクセス頻度の低いデータは、必要なときのみフェッチされ、ローカルメモリとディスクリソースの大半を解放します。</p></li>
<li><p><strong>LRUベースで動的に適応：</strong>Milvusは、LRU（Least Recently Used：最近使用されたデータ消去）戦略を使用して、どのデータをホットまたはコールドとみなすかを継続的に調整します。非アクティブなデータは自動的に退去され、新しくアクセスされたデータのためのスペースを確保します。</p></li>
</ul>
<p>この設計により、Milvusはもはやローカルメモリとディスクの固定容量に制約されることはない。代わりに、ローカルリソースは動的に管理されるキャッシュとして機能し、非アクティブなデータからスペースが継続的に回収され、アクティブなワークロードに再割り当てされる。</p>
<p>この動作は、3つのコア技術メカニズムによって実現されている：</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1.遅延ロード</h3><p>Milvusは初期化時に最小限のセグメントレベルのメタデータのみをロードし、起動後すぐにコレクションをクエリ可能にします。フィールドデータとインデックスファイルはリモートストレージに残り、クエリ実行中にオンデマンドでフェッチされるため、ローカルメモリとディスクの使用量を低く抑えることができます。</p>
<p><strong>Milvus 2.5でのコレクションローディングの仕組み</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus 2.6以降での遅延ロードの仕組み</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>初期化時にロードされるメタデータは4つの主要なカテゴリーに分類されます：</p>
<ul>
<li><p><strong>セグメント統計</strong>(行数、セグメントサイズ、スキーマメタデータなどの基本情報)</p></li>
<li><p><strong>タイムスタンプ</strong>(タイムトラベルクエリをサポートするために使用される)</p></li>
<li><p><strong>レコードの挿入と削除</strong>(クエリ実行中にデータの一貫性を維持するために必要)</p></li>
<li><p><strong>ブルームフィルタ</strong>(無関係なセグメントを素早く除外するための、高速なプレフィルタリングに使用される)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2.部分ロード</h3><p>レイジーローディングがデータをロードする<em>タイミングを</em>制御するのに対し、パーシャルローディングはロードするデータの<em>量を</em>制御する。クエリまたは検索が開始されると、QueryNode は部分ロードを実行し、必要なデータチャンクまたはインデックスファイルのみをオブジェクトストレージからフェッチします。</p>
<p><strong>ベクトル・インデックス：テナントを意識したロード</strong></p>
<p>Milvus 2.6+で導入された最もインパクトのある機能の1つは、マルチテナントのワークロードのために特別に設計された、テナントを意識したベクトルインデックスのロードです。</p>
<p>クエリが単一のテナントのデータにアクセスする場合、Milvusはそのテナントに属するベクトルインデックスの部分のみをロードし、他のすべてのテナントのインデックスデータをスキップします。これにより、ローカルリソースをアクティブなテナントに集中させることができます。</p>
<p>この設計にはいくつかの利点があります：</p>
<ul>
<li><p>非アクティブテナントのベクトルインデックスは、ローカルメモリやディスクを消費しません。</p></li>
<li><p>アクティブなテナントのインデックスデータは、低レイテンシアクセスのためにキャッシュされたままである。</p></li>
<li><p>テナントレベルのLRU退去ポリシーにより、テナント間での公平なキャッシュ使用が保証されます。</p></li>
</ul>
<p><strong>スカラーフィールド：カラムレベルのパーシャルローディング</strong></p>
<p>パーシャルローディングは<strong>スカラーフィールドにも</strong>適用され、milvusはクエリによって明示的に参照されたカラムのみをロードすることができます。</p>
<p><code translate="no">id</code>,<code translate="no">vector</code>,<code translate="no">title</code>,<code translate="no">description</code>,<code translate="no">category</code>,<code translate="no">price</code>,<code translate="no">stock</code>,<code translate="no">tags</code> のような<strong>50のスキーマフィールドを</strong>持つコレクションで、<code translate="no">id</code>,<code translate="no">title</code>,<code translate="no">price</code> の3つのフィールドのみを返す必要があるとします。</p>
<ul>
<li><p><strong>Milvus 2.5では</strong>、50のスカラーフィールドはクエリー要件に関係なくロードされます。</p></li>
<li><p><strong>Milvus 2.6+では</strong>、要求された3つのフィールドのみがロードされます。残りの47フィールドはロードされずに残り、後でアクセスされた場合のみ遅延フェッチされます。</p></li>
</ul>
<p>リソースの節約は非常に大きい。各スカラー・フィールドが20GBを占有する場合：</p>
<ul>
<li><p>すべてのフィールドをロードするには<strong>1,000GBが</strong>必要（50×20GB）。</p></li>
<li><p>必要な3つのフィールドだけをロードする場合は<strong>60GB</strong></p></li>
</ul>
<p>これは、クエリの正しさや結果に影響を与えることなく、スカラーデータのロードを<strong>94%削減</strong>したことになります。</p>
<p><strong>注：</strong>スカラー・フィールドとベクトル・インデックスのテナント対応パーシャル・ローディングは、今後のリリースで正式に導入される予定です。これが利用可能になれば、大規模なマルチテナント展開におけるロードレイテンシをさらに削減し、コールドクエリのパフォーマンスを向上させることができます。</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3.LRUベースのキャッシュ消去</h3><p>レイジーローディングとパーシャルローディングは、ローカルメモリとディスクに持ち込まれるデータ量を大幅に削減します。しかし、長時間稼動するシステムでは、新しいデータがアクセスされるにつれてキャッシュは増大します。ローカル容量に達すると、LRUベースのキャッシュ消去が有効になる。</p>
<p>LRU（Least Recently Used）消去は、最近アクセスされていないデータが最初に消去されるという単純なルールに従っている。これにより、頻繁に使用されるデータをキャッシュに常駐させながら、新しくアクセスされるデータのためにローカル領域を解放する。</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">性能評価：ティアード・ストレージとフルローディングの比較<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Tiered Storageの</strong>実環境への影響を評価するため、実運用ワークロードを忠実に反映したテス ト環境を構築した。ロード時間、リソース使用量、クエリ性能、有効容量、コスト効率の5つの側面から、Tiered Storageを使用した場合と使用しない場合のMilvusを比較した。</p>
<h3 id="Experimental-setup" class="common-anchor-header">実験セットアップ</h3><p><strong>データセット</strong></p>
<ul>
<li><p>768次元の1億ベクトル（BERTエンベッディング）</p></li>
<li><p>ベクトルインデックスサイズ：約430GB</p></li>
<li><p>ID、タイムスタンプ、カテゴリを含む10個のスカラーフィールド</p></li>
</ul>
<p><strong>ハードウェア構成</strong></p>
<ul>
<li><p>4 vCPU、32 GBメモリ、1 TB NVMe SSDを搭載したQueryNode 1台</p></li>
<li><p>10 Gbpsネットワーク</p></li>
<li><p>リモートストレージバックエンドとしてMinIOオブジェクトストレージクラスター</p></li>
</ul>
<p><strong>アクセスパターン</strong></p>
<p>クエリは現実的なホット-コールドアクセス分布に従う：</p>
<ul>
<li><p>クエリの80%は直近30日間のデータを対象（全データの20%程度）</p></li>
<li><p>15%は30～90日前のデータ（全データの約30%）。</p></li>
<li><p>5%は90日以上前のデータを対象（全データの50%以上）</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">主な結果</h3><p><strong>1.33倍速いロード時間</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>ステージ</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (階層型ストレージ)</strong></th><th style="text-align:center"><strong>スピードアップ</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">データダウンロード</td><td style="text-align:center">22分</td><td style="text-align:center">28秒</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">インデックスロード</td><td style="text-align:center">3分</td><td style="text-align:center">17秒</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>合計</strong></td><td style="text-align:center"><strong>25分</strong></td><td style="text-align:center"><strong>45秒</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>Milvus 2.5では、コレクションのロードに<strong>25分かかって</strong>いた。Milvus 2.6+のTiered Storageでは、同じワークロードがわずか<strong>45</strong>秒で完了し、ロード効率が一段と向上しました。</p>
<p><strong>2.ローカルリソース使用量の80%削減</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>ステージ</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (ティアード・ストレージ)</strong></th><th style="text-align:center"><strong>削減量</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">負荷後</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">1時間後</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">24時間後</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">定常状態</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>Milvus 2.5では、ワークロードやランタイムに関係なく、ローカルリソースの使用量は<strong>430GBで</strong>一定です。一方、Milvus 2.6+では、ロード直後はわずか<strong>12 GBから</strong>始まります。</p>
<p>クエリが実行されるにつれ、頻繁にアクセスされるデータはローカルにキャッシュされ、リソース使用量は徐々に増加する。約24時間後、システムは<strong>85-95GBで</strong>安定し、ホットデータの作業セットを反映する。長期的には、クエリの可用性を犠牲にすることなく、ローカルメモリとディスクの使用量を<strong>約80%削減</strong>することができます。</p>
<p><strong>3.ホットデータのパフォーマンスへの影響はほぼゼロ</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>クエリータイプ</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99レイテンシ</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99レイテンシ</strong></th><th style="text-align:center"><strong>変更</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ホットデータクエリ</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">ウォームデータクエリー</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">コールドデータクエリ（最初のアクセス）</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">コールドデータ・クエリー（キャッシュ）</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>全クエリの約80%を占めるホットデータでは、P99のレイテンシはわずか6.7%しか増加せず、本番環境での影響はほとんど感じられません。</p>
<p>コールドデータクエリでは、オブジェクトストレージからのオンデマンドロードにより、最初のアクセス時の待ち時間が長くなります。しかし、一旦キャッシュされると、レイテンシは20%増加するだけである。コールドデータのアクセス頻度が低いことを考慮すると、このトレードオフは、ほとんどの実世界のワークロードで一般的に許容可能です。</p>
<p><strong>4.4.3倍の実効容量</strong></p>
<p>Milvus 2.5 は、同じハードウェア予算（各 64 GB のメモリを搭載した 8 台のサーバ（合計 512 GB））のもとで、最大 512 GB のデータ（約 1 億 3,600 万のベクターに相当）をロードすることができます。</p>
<p>Milvus 2.6+でTiered Storageを有効にした場合、同じハードウェアで2.2 TBのデータ、すなわち約5億9,000万のベクターをサポートすることができます。これは実効容量が4.3倍増加したことを意味し、ローカルメモリを拡張することなく、大幅に大きなデータセットに対応することができる。</p>
<p><strong>5.80.1%のコスト削減</strong></p>
<p>AWS環境における2TBのベクトルデータセットを例に、データの20%がホットデータ（400GB）であると仮定した場合のコスト比較は以下のようになる：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>項目</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (階層型ストレージ)</strong></th><th style="text-align:center"><strong>節約額</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">月額コスト</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">年間コスト</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">節約率</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">ベンチマーク概要</h3><p>すべてのテストにおいて、Tiered Storageは一貫した測定可能な改善を実現しました：</p>
<ul>
<li><p><strong>ロード時間が33倍高速化：</strong>コレクションのロード時間が<strong>25分から45秒に</strong>短縮。</p></li>
<li><p><strong>ローカルリソースの使用量を80%削減：</strong>定常状態では、メモリとローカルディスクの使用量が<strong>約80%</strong>減少。</p></li>
<li><p><strong>ホットデータのパフォーマンスへの影響はほぼゼロ：</strong>ホットデータに対するP99レイテンシーの増加は<strong>10%未満で</strong>、低レイテンシーのクエリーパフォーマンスを維持します。</p></li>
<li><p><strong>コールドデータの待ち時間を制御：</strong>コールドデータの初回アクセス時のレイテンシは大きくなりますが、アクセス頻度が低いため許容範囲です。</p></li>
<li><p><strong>4.3倍の実効容量：</strong>メモリを追加することなく、同じハードウェアで<strong>4～5倍のデータを</strong>処理できる。</p></li>
<li><p><strong>80%以上のコスト削減：</strong>年間インフラコストを<strong>80％以上</strong>削減。</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">milvusで階層型ストレージを使用する場合<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>ベンチマークの結果と実際の生産事例に基づいて、Tiered Storageの使用事例を3つのカテゴリーに分類し、ワークロードに適しているかどうかを判断できるようにしています。</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">最適な使用例</h3><p><strong>1.マルチテナント型ベクトル検索プラットフォーム</strong></p>
<ul>
<li><p><strong>特徴</strong>ベクトル検索が中核ワークロードである。</p></li>
<li><p><strong>アクセスパターン：</strong>ベクトル検索クエリの80%以上を生成するテナントは20%未満。</p></li>
<li><p><strong>期待される効果</strong>70-80％のコスト削減、3-5倍の容量拡張。</p></li>
</ul>
<p><strong>2.Eコマース・レコメンデーション・システム（ベクトル検索ワークロード）</strong></p>
<ul>
<li><p><strong>特徴</strong>トップ商品とロングテール商品の間に強い人気の偏りがある。</p></li>
<li><p><strong>アクセスパターン：</strong>上位10％の商品がベクトル検索トラフィックの～80％を占める。</p></li>
<li><p><strong>期待されるメリット</strong>ピーク時の追加キャパシティの必要なし、60-70%のコスト削減。</p></li>
</ul>
<p><strong>3.ホット・コールドが明確な大規模データセット（ベクトル優位）</strong></p>
<ul>
<li><p><strong>特徴</strong>TBスケール以上のデータセットで、アクセスが最近のデータに偏っている。</p></li>
<li><p><strong>アクセスパターン：</strong>古典的な80/20分布：20%のデータが80%のクエリに対応している。</p></li>
<li><p><strong>期待されるメリット</strong>75～85％のコスト削減</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">最適なユースケース</h3><p><strong>1.コスト重視のワークロード</strong></p>
<ul>
<li><p><strong>特徴</strong>予算が厳しく、性能のトレードオフをある程度許容できる。</p></li>
<li><p><strong>アクセスパターン：</strong>ベクタークエリーが比較的集中している。</p></li>
<li><p><strong>期待される効果</strong>50～70％のコスト削減。コールドデータでは、最初のアクセスで500ミリ秒程度の待ち時間が発生する可能性があり、SLA要件と照らし合わせて評価する必要がある。</p></li>
</ul>
<p><strong>2.履歴データの保持とアーカイブ検索</strong></p>
<ul>
<li><p><strong>特徴</strong>クエリー頻度が非常に低い、大量の履歴ベクトル。</p></li>
<li><p><strong>アクセスパターン：</strong>クエリの約90％が最近のデータを対象としている。</p></li>
<li><p><strong>期待されるメリット</strong>完全な履歴データセットの保持、予測可能でコントロール可能なインフラコストの維持</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">適合しないユースケース</h3><p><strong>1.一様にホットなデータ・ワークロード</strong></p>
<ul>
<li><p><strong>特徴：</strong>すべてのデータが同じような頻度でアクセスされ、ホットとコールドの明確な区別がない。</p></li>
<li><p><strong>適合しない理由</strong>キャッシュの利点は限定的。意味のある利得を得ずにシステムを複雑化させる。</p></li>
</ul>
<p><strong>2.超低レイテンシワークロード</strong></p>
<ul>
<li><p><strong>特徴：</strong>金融取引やリアルタイム入札など、レイテンシに非常に敏感なシステム</p></li>
<li><p><strong>不向きな理由</strong>わずかなレイテンシ変動も許容できない。フルローディングの方が予測可能なパフォーマンスが得られる。</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">クイック・スタートMilvus 2.6+で階層型ストレージを試す<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6のTiered Storageは、ベクターデータの格納方法と実際のアクセス方法のミスマッチに対処します。ほとんどのプロダクションシステムでは、頻繁にクエリされるデータはごく一部であるにもかかわらず、従来のローディングモデルはすべてのデータを等しくホットなデータとして扱っている。Milvusは、オンデマンドローディングに移行し、ローカルメモリとディスクをキャッシュとして管理することで、リソースの消費をワーストケースの仮定ではなく、実際のクエリの挙動に合わせます。</p>
<p>このアプローチにより、ホットクエリの性能をほぼ維持したまま、ローカルリソースを比例的に増加させることなく、システムをより大きなデータセットに拡張することができます。コールドデータは必要なときにアクセス可能であり続け、予測可能で制限されたレイテンシを実現し、トレードオフを明確かつ制御可能にしている。ベクトル検索が、コスト重視、マルチテナント、長時間稼働の本番環境に深く入り込むにつれて、Tiered Storageは、スケールに応じて効率的に運用するための実用的な基盤を提供します。</p>
<p>Tiered Storageの詳細については、以下のドキュメントをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage｜Milvusドキュメント</a></li>
</ul>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6におけるジオメトリフィールドとRTREEによる地理空間フィルタリングとベクトル検索の統合</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">MilvusにおけるAISAQの導入: 10億スケールのベクトル検索がメモリ上で3,200倍安くなった</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">MilvusにおけるNVIDIA CAGRAの最適化：GPUとCPUのハイブリッドアプローチによるインデックス作成の高速化とクエリの低コスト化</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusにおけるMinHash LSH：LLMトレーニングデータの重複と戦うための秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusのためにKafka/PulsarをWoodpeckerに置き換えた</a></p></li>
</ul>
