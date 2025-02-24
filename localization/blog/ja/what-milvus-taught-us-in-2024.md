---
id: what-milvus-taught-us-in-2024.md
title: 2024年、Milvusユーザーが教えてくれたこと
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: DiscordでMilvusについてよくある質問をチェック。
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">概要<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>2024年、Milvusがメジャーリリースとオープンソースエコシステムの隆盛で繁栄する中、<a href="https://discord.gg/xwqmFDURcz">Discord</a>上のコミュニティでは、ユーザーインサイトの隠れた宝庫が静かに形成されつつありました。このコミュニティでの議論の集大成は、ユーザーの課題を直接理解するまたとない機会となりました。この未開拓のリソースに興味をそそられた私は、1年間のすべてのディスカッションスレッドの包括的な分析に着手し、milvusユーザーのためのよくある質問リソースをコンパイルするのに役立つパターンを探しました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>分析の結果、ユーザーが一貫してガイダンスを求めていた3つの主要分野が明らかになりました：<strong>パフォーマンスの最適化</strong>、<strong>展開戦略</strong>、<strong>データ管理</strong>です。Milvusを本番環境向けに微調整する方法や、パフォーマンスメトリクスの効果的な追跡方法について、ユーザーは頻繁に議論していました。配備に関しては、コミュニティは適切な配備の選択、最適な検索インデックスの選択、分散セットアップにおける問題の解決に取り組んでいた。データ管理では、サービス間のデータ移行戦略とエンベッディング・モデルの選択が話題の中心となった。</p>
<p>それぞれの領域について詳しく見ていこう。</p>
<h2 id="Deployment" class="common-anchor-header">デプロイメント<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusは様々なユースケースに対応できる柔軟なデプロイメントモードを提供している。しかし、ユーザーの中には、正しい選択を見つけることが難しく、"正しい "選択をしているという安心感を得たいと考える人もいます。</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">どのデプロイメントタイプを選ぶべきか？</h3><p>Milvus<a href="https://milvus.io/docs/milvus_lite.md">Lite</a>、<a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a>、<a href="https://milvus.io/docs/prerequisite-helm.md">Distributedの</a>うち、どのデプロイメントを選択すべきかという質問は非常に多い。その答えは、ベクターデータベースの規模やトラフィック量によって異なります：</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>数百万ベクターまでのプロトタイプをローカルシステムで作成する場合や、ユニットテストやCI/CDのために組み込みベクターデータベースを探している場合は、Milvus Liteを使用することができます。なお、Milvus Liteでは全文検索のような高度な機能はまだ利用できませんが、近日公開予定です。</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvusスタンドアロン</h4><p>あなたのシステムがプロダクショントラフィックにサービスを提供する必要がある場合、または数百万から1億のベクターを保存する必要がある場合は、Milvusのすべてのコンポーネントを単一のDockerイメージにパックしたMilvus Standaloneを使用する必要があります。永続ストレージ(minio)とメタデータストア(etcd)の依存関係を別のイメージとして取り出すだけのバリエーションもあります。</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">分散Milvus</h4><p>数千QPSで数十億のベクターを処理するような、プロダクショントラフィックを提供する大規模なデプロイメントには、Milvus Distributedを使用する必要があります。Milvus 3.0の将来のバージョンでは、ベクターレイクと呼ばれる、より効率的な方法を提供する予定です。</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">フルマネージドサービス</h4><p>DevOpsの心配をせずにアプリケーション開発に集中したい開発者のために、<a href="https://cloud.zilliz.com/signup">Zilliz Cloudは</a>無料ティアを提供するフルマネージドMilvusである。</p>
<p>詳しくは<a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">「Milvusデプロイの概要」を</a>ご覧ください。</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">どのくらいのメモリ、ストレージ、コンピュートが必要ですか？</h3><p>この質問は、既存のMilvusユーザだけでなく、Milvusが自分のアプリケーションに適しているかどうかを検討しているユーザにとっても、よく出てくる質問です。メモリ、ストレージ、計算量の正確な組み合わせは、複雑な要因の相互作用によって決まります。</p>
<p>ベクトル埋め込みは、使用されるモデルによって次元が異なります。また、ベクトル検索インデックスには、完全にメモリに格納されるものもあれば、ディスクにデータを格納するものもある。また、エンベッディングの圧縮（量子化）されたコピーを格納できる検索インデックスも多く、グラフデータ構造用に追加のメモリを必要とします。これらはメモリとストレージに影響を与えるいくつかの要因に過ぎません。</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvusリソースサイジングツール</h4><p>幸いなことに、Milvusを保守しているZillizは、この質問に答える素晴らしい仕事をしてくれる<a href="https://milvus.io/tools/sizing">リソースサイジングツールを</a>構築しました。ベクターの次元数、インデックスの種類、デプロイオプションなどを入力すると、Milvusノードとその依存関係に必要なCPU、メモリ、ストレージを見積もることができます。データおよびサンプルトラフィックによる実際の負荷テストは常に良いアイデアです。</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">どのベクトルインデックスや距離メトリックを選択すべきでしょうか？</h3><p>多くのユーザーは、どのインデックスを選択すべきか、またハイパーパラメータをどのように設定すべきかが不明です。まず、AUTOINDEXを選択することにより、Milvusにインデックスタイプの選択を委ねることができます。しかし、特定のインデックスタイプを選択したい場合、いくつかの経験則が出発点となります。</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">インメモリインデックス</h4><p>インデックスを完全にメモリに収めるためにコストを払いたいですか？インメモリインデックスは一般的に最も高速ですが、高価でもあります。Milvusがサポートするインデックスのリストと、レイテンシ、メモリ、リコールにおけるトレードオフについては<a href="https://milvus.io/docs/index.md?tab=floating">"インメモリインデックス "を</a>参照してください。</p>
<p>インデックスのサイズは単純にベクトルの数×次元数×浮動小数点数ではないことに注意してください。ほとんどのインデックスは、メモリ使用量を減らすためにベクトルを量子化しますが、追加のデータ構造のためのメモリを必要とします。ベクトル以外のデータ（スカラー）とそのインデックスもメモリ空間を占有します。</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">ディスク上のインデックス</h4><p>インデックスがメモリに収まらない場合、milvusが提供する<a href="https://milvus.io/docs/disk_index.md">"オンディスクインデックス "の</a>いずれかを使用することができます。レイテンシとリソースのトレードオフが大きく異なる2つの選択肢が<a href="https://milvus.io/docs/disk_index.md">DiskANNと</a> <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>である。</p>
<p>DiskANNは高度に圧縮されたベクターのコピーをメモリに保存し、非圧縮のベクターとグラフ検索構造をディスクに保存します。ディスクの読み込みを最小限に抑えながらベクトル空間を探索するために、いくつかの巧妙なアイデアを使用しており、SSDの高速ランダムアクセス速度を活用している。レイテンシを最小にするために、SSDは最高のI/Oパフォーマンスを得るためにSATAではなくNVMe経由で接続する必要がある。</p>
<p>技術的に言えば、MMapはインデックス・タイプではなく、イン・メモリ・インデックスによる仮想メモリの使用を指す。仮想メモリを使用すると、必要に応じてディスクとRAMの間でページをスワップすることができるため、一度にデータの一部しか使用しないようなアクセスパターンであれば、はるかに大きなインデックスを効率的に使用することができます。</p>
<p>DiskANNは優れた一貫したレイテンシーを持つ。MMapはインメモリでページにアクセスしているときはさらに優れたレイテンシを持つが、頻繁にページを入れ替えるとレイテンシが急増する。そのため、MMapはメモリ・アクセス・パターンによってレイテンシの変動が大きくなります。</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPUインデックス</h4><p>第3の選択肢は、<a href="https://milvus.io/docs/gpu_index.md">GPUメモリと計算を使用してインデックスを</a>構築することです。MilvusのGPUサポートはNvidia<a href="https://rapids.ai/">RAPIDS</a>チームによって提供されています。GPUベクトル検索は、対応するCPU検索よりもレイテンシが低いかもしれませんが、GPUの並列性を完全に利用するには、通常、数百から数千の検索QPSが必要です。また、GPU は通常 CPU RAM よりも少ないメモリしか持たないため、実行コストが高くなります。</p>
<h4 id="Distance-Metrics" class="common-anchor-header">距離メトリクス</h4><p>答えやすい質問としては、ベクトル間の類似度を測るのにどの距離メトリックを選ぶかということです。エンベッディングモデルがトレーニングされたのと同じ距離メトリックを選択することをお勧めします。モデルのソース（例えばHuggingFaceのモデルページ）は、どの距離メトリックが使用されたかを明確にしてくれます。また、Zillizはそれを調べるのに便利な<a href="https://zilliz.com/ai-models">表を</a>まとめました。</p>
<p>要約すると、インデックスの選択に関する不確実性の多くは、これらの選択があなたのデプロイメントのレイテンシ／リソース使用量／リコールトレードオフにどのように影響するかという不確実性に関連していると思います。私は、上記の経験則を使用して、インメモリ、オンディスク、GPUインデックスのいずれかを決定し、Milvusドキュメントに記載されているトレードオフガイドラインを使用して特定のものを選択することをお勧めします。</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">壊れたMilvus分散配置を直してもらえますか？</h3><p>多くの質問は、Milvus Distributedのデプロイメントを立ち上げ、稼働させるための問題であり、設定、ツール、デバッグログに関するものです。Milvusには<a href="https://milvus.io/discord">Discordが</a>あり、ヘルプを求めることができますし、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">専門家との1対1のオフィスアワーも</a>提供しています。</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">MilvusをWindowsに導入するには？</h3><p>MilvusをWindowsマシンに導入する方法について、何度か質問がありました。<a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)を</a>使用した<a href="https://milvus.io/docs/install_standalone-windows.md">MilvusのDockerでの実行(Windows)</a>をご参照ください。</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">パフォーマンスとプロファイリング<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>デプロイメントタイプを選択し、それを実行させた後、ユーザは最適な決定を行ったと安心したいと思い、デプロイメントのパフォーマンスと状態をプロファイリングしたいと思うでしょう。パフォーマンスをプロファイリングし、状態を観察し、何がなぜ発生したかを把握する方法に関連する多くの質問があります。</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">パフォーマンスを測定するには？</h3><p>ユーザは、ボトルネックを理解して改善できるように、デプロイのパフォーマンスに関連するメトリクスを確認したいと考えています。メトリクスには、平均クエリ待ち時間、待ち時間の分布、クエリ量、メモリ使用量、ディスクストレージなどが含まれます。Milvus 2.5では、<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUIと</a>呼ばれる新しいシステムが導入され（フィードバックを歓迎します！）、ユーザフレンドリーなWebインターフェースからこれらの情報にアクセスできるように<a href="https://milvus.io/docs/monitor_overview.md">なりました</a>。</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Milvusの内部で今何が起こっているのか？</h3><p>関連して、ユーザは自分のデプロイの内部状態を観察したいと考えています。検索インデックスの構築に時間がかかっている理由の把握、クラスタが健全かどうかの判断方法、ノード間でクエリがどのように実行されるかの把握といった問題が挙げられます。これらの疑問の多くは、システムが内部で行っていることを透明化する新しい<a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUIで</a>答えることができる。</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">内部の（複雑な）ある側面がどのように動作しているのか？</h3><p>上級ユーザは、Milvusの内部をある程度理解したいと思うことがよくあります。例えば、セグメントのシーリングやメモリ管理について理解したい場合などです。その根底にある目的は、一般的にパフォーマンスを向上させることであり、時には問題をデバッグすることでもあります。<a href="https://milvus.io/docs/architecture_overview.md">Milvusアーキテクチャの概要 &quot;</a>や<a href="https://milvus.io/docs/clustering-compaction.md">&quot;クラスタリングコンパクション &quot;</a>のページをご覧ください。今後もMilvusの内部に関するドキュメントを改善し、より理解しやすいものにしていきますので、<a href="https://milvus.io/discord">Discordを通じて</a>ご意見やご要望をお待ちしております。</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">どのエンベッディングモデルを選ぶべきか？</h3><p>ミートアップやオフィスアワー、Discordで何度も出てきたパフォーマンスに関連する質問は、エンベッディングモデルの選び方です。これは明確な答えを出すのが難しい質問ですが、<a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2の</a>ようなデフォルトモデルから始めることをお勧めします。</p>
<p>検索インデックスの選択と同様に、計算、保存、想起の間にはトレードオフがあります。より大きな出力次元を持つエンベッディング・モデルは、より多くのストレージを必要とします。固定された次元に対して、より大きな埋め込みモデルは、通常、計算量と時間の増加という犠牲は伴いますが、想起という点で、より小さなものよりも優れています。<a href="https://huggingface.co/spaces/mteb/leaderboard">MTEBの</a>ような埋め込みモデルの性能をランク付けするリーダーボードは、あなたの特定のデータやタスクと一致しないかもしれないベンチマークに基づいています。</p>
<p>ですから、"最高の "埋め込みモデルを考えることは意味がありません。まずは、許容可能なリコールがあり、埋め込み計算のための計算量と時間の予算を満たすものから始めましょう。データ上での微調整や、経験的に計算量と想起量のトレードオフを探るような更なる最適化は、実稼働するシステムができてからにしましょう。</p>
<h2 id="Data-Management" class="common-anchor-header">データ管理<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusデプロイメントにデータをどのように出し入れするかは、Discordのディスカッションのもう一つのメインテーマです。</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">XからMilvusへデータを移行するには？スタンドアロンからDistributedへデータを移行するには？2.4.xから2.5.xへの移行方法は？</h3><p>新規ユーザは、<a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearchの</a>ような従来の検索エンジンや、<a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pineconeや</a> <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrantの</a>ようなベクトルデータベースなど、他のプラットフォームから既存のデータをMilvusに取り込みたいと考えるのが一般的です。また、既存ユーザは、Milvusから別のMilvusへの移行や、<a href="https://docs.zilliz.com/docs/migrate-from-milvus">セルフホスト型Milvusからフルマネージド型Zilliz Cloudへの</a>移行を希望する場合もあります。</p>
<p><a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a>とZilliz Cloudの<a href="https://docs.zilliz.com/docs/migrations">マネージドマイグレーションサービスは</a>このような目的のために設計されています。</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">データのバックアップの保存と読み込み方法を教えてください。Milvusからデータをエクスポートする方法を教えてください。</h3><p>Milvusには専用ツール<a href="https://github.com/zilliztech/milvus-backup">milvus-backupが</a>あり、永続的なストレージにスナップショットを取り、復元することができます。</p>
<h2 id="Next-Steps" class="common-anchor-header">次のステップ<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースを使用する際に直面する一般的な課題への取り組み方について、いくつかのヒントを得ることができたと思います。また、Milvusのドキュメントや機能ロードマップを見直すことで、Milvusで成功するための手助けとなるような取り組みを続けていきたいと思います。私が強調したい重要なポイントは、あなたの選択は、コンピュート、ストレージ、レイテンシ、リコール間のトレードオフ空間の異なるポイントに置かれるということです。<em>これらのパフォーマンス基準のすべてを同時に最大化することはできません。しかし、ベクトル検索と分散データベースシステムがどのように機能するかをより深く理解することで、十分な情報に基づいた決定を下すことができる。</em></p>
<p>2024年からの大量の投稿を読み漁った後、私はこう考えた。ジェネレーティブAIは、大量のテキストを解析し、洞察を抽出するというこのようなタスクを解決することを約束したのではないだろうか？このブログ記事の後編（近日公開）では、<em>ディスカッション・フォーラムからインサイトを抽出するためのマルチ・エージェント・システムの</em>設計と実装について調査します。</p>
<p>また、コミュニティの<a href="https://milvus.io/discord">Discordや</a>次回の<a href="https://lu.ma/unstructured-data-meetup">Unstructured Data</a>ミートアップでお会いできることを楽しみにしています。より実践的なサポートをご希望の方は、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1on1のオフィスアワーを</a>ご予約ください。<em>皆様のフィードバックはmilvusの改善に不可欠です！</em></p>
