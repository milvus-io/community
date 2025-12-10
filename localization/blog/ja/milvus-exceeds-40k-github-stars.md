---
id: milvus-exceeds-40k-github-stars.md
title: 7年、2度の大規模再構築、40K以上のGitHubスター：オープンソースのベクターデータベースをリードするmilvusの台頭
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: オープンソースのベクターデータベースで世界をリードするMilvusの7年の旅を祝う
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>2025年6月、Milvusは35,000のGitHubスターを達成しました。それからわずか数ヶ月で、<a href="https://github.com/milvus-io/milvus">40,000</a>スターを超えました。これは、勢いだけでなく、ベクトル検索とマルチモーダル検索の未来を押し進め続けるグローバル・コミュニティの<a href="https://github.com/milvus-io/milvus">証でも</a>あります。</p>
<p>深く感謝している。スターを付けてくださった方々、フォークしてくださった方々、issueを提出してくださった方々、APIについて議論してくださった方々、ベンチマークを共有してくださった方々、milvusを使って素晴らしいものを作ってくださった方々、<strong>ありがとうござい</strong>ます。すべての星は、ボタンを押したこと以上のことを表しています。それは、Milvusを選んで自分の仕事を動かしている人、私たちが構築しているものを信じている人、オープンでアクセス可能な高性能AIインフラストラクチャという私たちのビジョンに共感している人を反映しています。</p>
<p>私たちは、皆様が求めている機能、AIが今求めているアーキテクチャ、そしてマルチモーダルかつセマンティックな理解があらゆるアプリケーションのデフォルトとなる世界を見据えています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">旅：ゼロから4万以上の星へ<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>2017年にmilvusの構築を始めたとき、<em>ベクトル・データベースという</em>言葉すら存在しなかった。AIアプリケーションには、行や列のためではなく、高次元の非構造化マルチモーダルデータのために構築された、新しい種類のデータインフラがまもなく必要になると確信していたエンジニアの小さなチームにすぎなかった。従来のデータベースはそのような世界のために構築されたものではなく、ストレージと検索のあり方を誰かが再構築しなければならないと考えていました。</p>
<p>初期の頃は、華やかさとは程遠いものでした。エンタープライズ・グレードのインフラを構築するのは時間がかかる頑固な作業で、コード・パスのプロファイリング、コンポーネントの書き換え、夜中の2時に設計の選択に疑問を投げかけることに何週間も費やした。このミッションは、最初のブレークスルーも、避けられない挫折も、私たちを支えてくれた。</p>
<p>そしてその過程で、いくつかの転機がすべてを変えた：</p>
<ul>
<li><p><strong>2019年：</strong>Milvus 0.10をオープンソース化。それは、ハックやTODO、まだ誇りに思えない部分など、私たちの荒削りな部分をすべてさらけ出すことを意味した。しかし、コミュニティはそれを受け入れてくれた。開発者たちは、私たちが見つけられなかった問題を提出し、私たちが想像していなかった機能を提案し、最終的にMilvusをより強くする仮定に挑戦してくれた。</p></li>
<li><p><strong>2020-2021:</strong>私たちは<a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundationに</a>参加し、Milvus 1.0を出荷し、LF AI &amp; Dataを卒業し、<a href="https://big-ann-benchmarks.com/neurips21.html">BigANNの</a>10億スケールのベクトル検索チャレンジで優勝しました。</p></li>
<li><p><strong>2022年：</strong>エンタープライズユーザーは、Kubernetesネイティブのスケーリング、弾力性、ストレージとコンピューティングの真の分離を必要としていた。私たちは、古いシステムにパッチを当てるか、すべてを再構築するかという難しい決断に迫られました。私たちはより困難な道を選びました。<strong>Milvus 2.0は、</strong>完全に分離されたクラウドネイティブアーキテクチャを導入し、MilvusをミッションクリティカルなAIワークロードのためのプロダクショングレードのプラットフォームに変えました。</p></li>
<li><p><strong>2024-2025:</strong>Milvusの開発チームである<a href="https://zilliz.com/">Zillizが</a> <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">Forresterのリーダー企業に</a>選出され、30,000スターを突破。マルチモーダル検索、RAGシステム、エージェント型ワークフロー、そして教育、金融、クリエイティブ制作、科学研究などの業界を横断する10億規模の検索を支える存在となった。</p></li>
</ul>
<p>このマイルストーンは、誇大広告ではなく、開発者がMilvusを実際のプロダクションワークロードに選択し、あらゆるステップで改善を推し進めた結果、獲得されたものです。</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025:2つのメジャーリリース、大幅なパフォーマンス向上<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025年は、Milvusが新たなステージに踏み出した年である。ベクトル検索はセマンティックな理解に優れていますが、実運用における現実は単純です。<strong>開発者は依然として</strong>、製品ID、シリアル番号、正確なフレーズ、法律用語などの<strong>正確なキーワードマッチングを必要としています</strong>。ネイティブのフルテキスト検索がなければ、チームはElasticsearch/OpenSearchクラスタを維持するか、独自のカスタムソリューションを組み合わせることを余儀なくされていました。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.</strong></a>5は<strong>それを変えました</strong>。Milvus 2.5は、全文検索とベクトル検索を1つのエンジンに統合した、<strong>真にネイティブなハイブリッド検索を</strong>導入した。開発者は初めて、余分なシステムや同期パイプラインを操作することなく、語彙クエリ、セマンティッククエリ、メタデータフィルタを一緒に実行できるようになりました。また、メタデータフィルタリング、式解析、実行効率もアップグレードされ、ハイブリッドクエリが自然で、実運用負荷の下でも高速に実行できるようになりました。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6では</strong></a> <strong>、この勢いをさらに推し進め</strong>、大規模な運用を行うユーザーからよく聞かれる2つの課題、すなわち<strong><em>コストと</em> <em>パフォーマンスを</em></strong>ターゲットにしました。このリリースでは、より予測可能なクエリパス、より高速なインデックス作成、劇的に低いメモリ使用量、より効率的なストレージなど、アーキテクチャの大幅な改善が行われました。多くのチームが、アプリケーションコードを1行も変更することなく、すぐに効果が得られたと報告しています。</p>
<p>Milvus 2.6のハイライトは以下の通りです：</p>
<ul>
<li><p>コストとパフォーマンスのバランスをよりインテリジェントにする<a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>階層型ストレージにより</strong></a>、ストレージコストを最大50%削減。</p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1ビット量子化により</a><strong>メモリを大幅に節約</strong>- メモリ使用量を最大72%削減しながら、より高速なクエリを実現。</p></li>
<li><p>BM25の実装を大幅に高速化し、<a href="https://milvus.io/docs/full-text-search.md"><strong>フルテキストエンジンを再設計</strong></a>。</p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON構造メタデータ</a>用の<strong>新しいPath Indexにより</strong>、複雑なドキュメントのフィルタリングを最大100倍高速化。</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>：</a>3200倍のストレージ削減と強力なリコールを実現する10億スケールの圧縮。</p></li>
<li><p><strong>R-Treeによる</strong><strong>セマンティック＋</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>地理空間検索</strong></a> <strong>：</strong> <em>物事がどこにあるかと</em>、<em>それが何を意味するのかを</em>組み合わせることで、より関連性の高い結果を得ることができます。</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>：</strong>GPUで構築しCPUでクエリを実行するハイブリッドCAGRAモードで導入コストを削減</p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>データイン、データアウト</strong></a><strong>」ワークフローにより</strong>、特にマルチモーダルパイプラインのエンベデッドインジェストと検索を簡素化。</p></li>
<li><p>単一クラスターで<strong>最大100Kコレクションをサポート</strong>- スケールでの真のマルチテナントへの大きな一歩。</p></li>
</ul>
<p>Milvus 2.6の詳細については、<a href="https://milvus.io/docs/release_notes.md">リリースノートを</a>ご覧ください。</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Milvusを超えて：AI開発者のためのオープンソースツール<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>2025年、私たちはMilvusを改善するだけでなく、AI開発者のエコシステム全体を強化するツールを構築しました。私たちの目標は、流行を追いかけることではなく、私たちが常に存在することを望んでいた、オープンでパワフルで透明性の高いツールを開発者に提供することでした。</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher：クラウドロックインのない研究</h3><p>OpenAIのDeep Researcherは、深い推論エージェントができることを証明しました。しかし、それは閉鎖的で、高価で、クラウドAPIの後ろにロックされています。<strong>DeepSearcherは私たちの答えです。</strong>これは、コントロールやプライバシーを犠牲にすることなく、構造化された調査を望む人のために設計された、ローカルでオープンソースのディープリサーチエンジンです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcherは完全にあなたのマシン上で動作し、ソースを横断して情報を収集し、洞察を統合し、引用、推論ステップ、トレーサビリティを提供します。ブラックボックスなし。ベンダーに縛られることもない。開発者や研究者が信頼できる、透明で再現可能な分析だけです。</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">クロード・コンテキストあなたのコードを理解するコーディングアシスタント</h3><p>ほとんどのAIコーディングツールは、いまだに空想的なgrepパイプラインのように振る舞い、速く、浅く、トークンを燃やし、実際のプロジェクト構造に気づかない。<a href="https://github.com/zilliztech/claude-context"><strong>Claude Contextは</strong></a>それを変える。MCPプラグインとして構築されたClaude Contextは、コードアシスタントに欠けていたもの、つまりコードベースの真の意味的理解を提供します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Contextは、エージェントが適切なモジュールを見つけ、ファイル間の関係をたどり、アーキテクチャレベルの意図を理解し、推測ではなく関連性のある質問に答えることができるように、プロジェクト全体でベクトル駆動型のセマンティックインデックスを構築します。トークンの無駄を省き、精度を高め、そして最も重要なことは、コーディングアシスタントが、あなたのソフトウェアを理解しているふりをするのではなく、本当に理解しているかのように振る舞うことです。</p>
<p>どちらのツールも完全にオープンソースである。AIのインフラはすべての人のものであるべきであり、AIの未来がプロプライエタリな壁の向こうに閉じ込められてはならないからです。</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">10,000以上のチームから信頼される本番環境<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>現在、10,000を超える企業チームがMilvusを実運用しており、その中には急成長中の新興企業から、フォーチュン500に名を連ねる世界有数のテクノロジー企業も含まれています。NVIDIA、Salesforce、eBay、Airbnb、IBM、AT&amp;T、LINE、Shopee、Roblox、Bosch、そしてマイクロソフト社内のチームが、毎日毎分稼働するAIシステムのためにMilvusを利用しています。彼らのワークロードは、検索、レコメンデーション、エージェント・パイプライン、マルチモーダル検索など、ベクター・インフラを限界まで押し上げるアプリケーションに及んでいる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>しかし、最も重要なことは、<em>誰が</em>Milvusを使用しているかということではなく、<em>Milvusを使用して何を構築しているかという</em>ことです。業界を問わず、Milvusはビジネスの運営、革新、競争の方法を形作るシステムの背後にある：</p>
<ul>
<li><p>何十億ものエンベッディングに瞬時にアクセスすることで、カスタマーサポート、営業ワークフロー、社内の意思決定を改善する<strong>AIコパイロットやエンタープライズアシスタント</strong>。</p></li>
<li><p><strong>電子商取引、メディア、広告におけるセマンティック検索とビジュアル検索</strong>。</p></li>
<li><p><strong>法律、金融、科学分野のインテリジェンス・プラットフォームでは</strong>、精度、監査可能性、コンプライアンスが実際の業務利益につながります。</p></li>
<li><p>フィンテックとバンキングにおける<strong>不正検出とリスクエンジンは</strong>、高速なセマンティックマッチングに依存して、リアルタイムで損失を防ぎます。</p></li>
<li><p><strong>大規模なRAGとエージェントシステムは</strong>、チームに深い文脈とドメインを認識したAI動作を提供します。</p></li>
<li><p>テキスト、コード、画像、メタデータを1つの一貫したセマンティックファブリックに統合する<strong>エンタープライズナレッジレイヤー</strong>。</p></li>
</ul>
<p>これらはラボのベンチマークではなく、世界で最も要求の厳しい実稼働環境です。Milvusは日常的に次のような成果を上げています：</p>
<ul>
<li><p>何十億ものベクトルに対して50ms以下の検索時間</p></li>
<li><p>数十億のドキュメントとイベントを単一のシステムで管理</p></li>
<li><p>代替ソリューションよりも5～10倍高速なワークフロー</p></li>
<li><p>数十万のコレクションをサポートするマルチテナントアーキテクチャ</p></li>
</ul>
<p>Milvusが選ばれる理由は簡単で、<strong>スピード、信頼性、コスト効率、そして数ヶ月ごとにアーキテクチャを解体することなく数十億の規模に拡張できる能力です</strong>。私たちがMilvusを10年先のAIに向けて強化し続けているのは、こうしたチームからの信頼があるからです。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">運用なしでMilvusが必要な場合：Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは無償で、パワフルで、実戦テスト済みです。しかし、それは分散システムでもあり、分散システムをうまく運用することは真のエンジニアリング作業でもあります。インデックスのチューニング、メモリ管理、クラスタの安定性、スケーリング、可観測性...これらのタスクには時間と専門知識が必要だが、多くのチームにはその余裕がない。開発者はMilvusのパワーを求めていました。ただ、大規模な管理で必然的に発生する運用の負担は避けられなかったのです。</p>
<p>MilvusがAIアプリケーションのコア・インフラになるには、運用を容易にする必要がありました。オープンソースプロジェクトを支える同じチームによって作成・保守されるフルマネージドMilvusサービス、<a href="https://zilliz.com/cloud"><strong>Zilliz Cloudを</strong></a>構築したのはそのためです。</p>
<p>Zilliz Cloudは、開発者がすでに知っていて信頼しているMilvusを提供しますが、クラスタのプロビジョニング、パフォーマンス問題の解決、アップグレードの計画、ストレージやコンピューティングのチューニングの心配は不要です。また、自己管理環境では実行不可能な最適化も含まれているため、さらに高速で信頼性が高くなっています。商用グレードの自己最適化ベクターエンジンである<a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinalは</a>、<strong>オープンソースのMilvusの</strong>10倍のパフォーマンスを実現します。</p>
<p><strong>Zilliz Cloudの特徴</strong></p>
<ul>
<li><strong>自己最適化パフォーマンス：</strong>AutoIndexはHNSW、IVF、DiskANNを自動的にチューニングし、手動設定なしで96%以上の再現率を実現します。</li>
</ul>
<ul>
<li><p><strong>柔軟性とコスト効率：</strong>従量課金、サーバーレス自動スケーリング、インテリジェントなリソース管理により、自己管理型の導入と比較してコストを 50% 以上削減できます。</p></li>
<li><p><strong>エンタープライズグレードの信頼性：</strong>99.95%のアップタイムSLA、マルチAZ冗長性、SOC 2 Type II、ISO 27001、GDPRコンプライアンス。RBAC、BYOC、監査ログ、暗号化をフルサポート。</p></li>
<li><p><strong>クラウドにとらわれない展開：</strong>AWS、Azure、GCP、Alibaba Cloud、またはTencent Cloud上で実行できるため、ベンダーロックインがなく、あらゆる場所で一貫したパフォーマンスを実現できます。</p></li>
<li><p><strong>自然言語クエリ：</strong>組み込みのMCPサーバーサポートにより、手動でAPIコールを作成する代わりに、会話形式でデータを照会できます。</p></li>
<li><p><strong>簡単な移行</strong>：Milvus、Pinecone、Qdrant、Weaviate、Elasticsearch、またはPostgreSQLから、組み込みの移行ツールを使って移行できます。</p></li>
<li><p><strong>オープンソースのMilvusと100%互換。</strong>プロプライエタリなフォークなし。ロックインもありません。Milvusをより簡単に。</p></li>
</ul>
<p><strong>Milvusは今後もオープンソースで無料でご利用いただけます。</strong>しかし、それを企業規模で確実に運用するには、かなりの専門知識とリソースが必要です。<strong>Zilliz Cloudは、そのギャップに対する私たちの答え</strong>です。29のリージョンと5つの主要クラウドに展開されたZilliz Cloudは、エンタープライズグレードのパフォーマンス、セキュリティ、コスト効率を提供し、お客様が既にご存知のMilvusと完全に連携した状態を保ちます。</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>無料トライアルを開始</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">次の展開Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースを導入したチームとして、私たちはエンタープライズデータがどのように変化しているかを最前列で見てきました。かつてはテラバイト単位の構造化されたテーブルにきちんと収まっていたものが、今やペタバイト、そしてやがて兆単位のマルチモーダル・オブジェクトへと急速に変化している。テキスト、画像、音声、ビデオ、時系列ストリーム、マルチセンサーログ...これらは今や、最新のAIシステムが依拠するデータセットを定義している。</p>
<p>ベクトル・データベースは、非構造化データやマルチモーダルデータ用に構築されていますが、最も経済的でアーキテクチャ的に健全な選択とは限りません。大規模モデルのためのトレーニング・コーパス、自律走行知覚ログ、ロボット工学データセットは通常、ミリ秒レベルのレイテンシーや高い同時実行性を必要としません。このような大量のデータをリアルタイム・ベクター・データベースで実行することは、そのレベルのパフォーマンスを必要としないパイプラインにとっては、高価で運用が重く、複雑になりすぎる。</p>
<p>この現実が、私たちを次の大きな取り組みへと導いた：<strong>Milvusレイクは、</strong>AIスケールデータのために設計された、セマンティック主導、インデックスファーストのマルチモーダルレイクハウスです。Milvus Lakeは、ベクトル、メタデータ、ラベル、LLMで生成された記述、構造化フィールドなど、あらゆるモダリティのセマンティックシグナルを統合し、実際のビジネスエンティティを中心とした<strong>セマンティックワイドテーブルに</strong>整理します。以前はオブジェクトストレージ、レイクハウス、モデルパイプラインに未加工の散在したファイルとして存在していたデータが、統一されたクエリ可能なセマンティックレイヤーとなる。大規模なマルチモーダルコーパスは、企業全体で一貫した意味を持つ、管理可能で検索可能な再利用可能な資産に変わります。</p>
<p>Milvus Lakeは、クリーンな<strong>マニフェスト＋データ＋インデックスの</strong>アーキテクチャで構築されており、インデックス作成は後付けではなく、基礎的なものとして扱われます。これにより、予測可能なレイテンシー、劇的に低いストレージコスト、そしてはるかに高い運用安定性を提供する、兆規模のコールドデータに最適化された「最初に検索し、後で処理する」ワークフローが実現します。ホットパスにはKVMe/SSD、ディープアーカイブにはオブジェクトストレージを使用し、効率的な圧縮と遅延負荷の少ないインデックスと組み合わせることで、セマンティックな忠実性を維持しつつ、インフラストラクチャーのオーバーヘッドをしっかりと制御します。</p>
<p>Milvus Lakeはまた、Paimon、Iceberg、Hudi、Spark、Ray、その他のビッグデータエンジンやフォーマットと統合し、最新のデータエコシステムにシームレスに接続します。チームは、既存のワークフローを再プラットフォーム化することなく、バッチ処理、ほぼリアルタイムのパイプライン、セマンティック検索、フィーチャーエンジニアリング、トレーニングデータの準備のすべてを一箇所で実行することができます。Milvus Lakeは、基礎モデルコーパスの構築、自律走行シミュレーションライブラリの管理、ロボットエージェントのトレーニング、大規模な検索システムなど、AI時代の拡張性とコスト効率に優れたセマンティックレイクハウスを提供します。</p>
<p><strong>Milvus Lakeは現在開発中です。</strong>早期アクセスにご興味のある方、詳細をお知りになりたい方は、こちらまでご連絡ください。<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>お問い合わせはこちらから</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">コミュニティによるコミュニティのための構築<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを特別なものにしているのは、テクノロジーだけではありません。ハイパフォーマンス・コンピューティング、分散システム、AIインフラストラクチャのスペシャリストが世界中から集まっています。ARM、NVIDIA、AMD、Intel、Meta、IBM、Salesforce、Alibaba、Microsoft、その他多くのエンジニアや研究者が専門知識を提供し、Milvusを今日の形に作り上げてきました。</p>
<p>すべてのプルリクエスト、すべてのバグレポート、フォーラムで回答されたすべての質問、作成されたすべてのチュートリアル、これらの貢献がMilvusをより良いものにしています。</p>
<p>このマイルストーンは皆様のものです：</p>
<ul>
<li><p><strong>貢献者の皆さん</strong>：あなたのコード、アイデア、時間に感謝します。皆様のおかげでMilvusは日々向上しています。</p></li>
<li><p><strong>ユーザーの皆様へ</strong>：Milvusを信頼していただき、良い経験も困難な経験も共有していただきありがとうございます。皆様のフィードバックが私たちのロードマップの原動力となっています。</p></li>
<li><p><strong>コミュニティサポーターの皆様</strong>：質問に対する回答、チュートリアルの執筆、コンテンツの作成、そして新規ユーザーの立ち上げを支援していただきありがとうございます。私たちのコミュニティを歓迎し、包括的にしてくれています。</p></li>
<li><p><strong>パートナーおよびインテグレーターの皆様</strong>：MilvusをAI開発のエコシステムにおいて一流の市民にしてくださりありがとうございます。</p></li>
<li><p><strong>Zillizチームへ</strong>：オープンソースプロジェクトとユーザーの成功への揺るぎないコミットメントに感謝します。</p></li>
</ul>
<p>Milvusが成長したのは、何千人もの人々が、オープンに、寛大に、そして基礎となるAIインフラは誰もがアクセスできるものであるべきだという信念を持って、一緒に何かを作ろうと決めたからです。</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">私たちと一緒に旅に出よう<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>あなたが最初のベクター検索アプリケーションを構築している場合でも、数十億のベクターに拡張している場合でも、Milvusコミュニティの一員としてご参加いただけることを嬉しく思います。</p>
<p><strong>始めましょう</strong>：</p>
<ul>
<li><p><strong>GitHubでスターをつける</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️<strong>Zilliz Cloudを無料で試す</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬<a href="https://discord.com/invite/8uyFbECzPX"><strong>Discordに</strong></a>参加して世界中の開発者とつながりましょう。</p></li>
<li><p>📚<strong>ドキュメントをご覧ください</strong>：<a href="https://milvus.io/docs">Milvusドキュメント</a></p></li>
<li><p>💬<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20分間の1対1のセッションを</strong></a> <strong>予約して</strong>、洞察、ガイダンス、質問への回答を得ましょう。</p></li>
</ul>
<p>前途は多難です。AIが産業を再構築し、新たな可能性を解き放つ中、ベクターデータベースはこの変革の中核に位置することになるでしょう。私たちは共に、最新のAIアプリケーションが依存するセマンティック基盤を構築しています。</p>
<p>次の4万個の星に、そしてAIインフラの未来を<strong>共に</strong>築くために。🎉</p>
