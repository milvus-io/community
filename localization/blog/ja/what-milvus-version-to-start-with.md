---
id: what-milvus-version-to-start-with.md
title: Milvusのバージョンは？
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: Milvusの各バージョンの特徴や機能を包括的に紹介し、ベクトル検索プロジェクトに必要な情報を提供します。
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Milvusバージョン紹介</custom-h1><p>ベクトル検索技術を活用したプロジェクトを成功させるためには、Milvusの適切なバージョンを選択することが何よりも重要です。Milvusのバージョンは様々な要件に合わせて調整されているため、正しいバージョンを選択することの重要性を理解することは、望ましい結果を得るために非常に重要です。</p>
<p>Milvusの適切なバージョンは、開発者の迅速な学習とプロトタイプ作成、リソース利用の最適化、開発作業の効率化、既存のインフラやツールとの互換性の確保に役立ちます。最終的には、開発者の生産性を維持し、効率性、信頼性、ユーザー満足度を向上させることになります。</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">利用可能なMilvusのバージョン<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは開発者向けに3つのバージョンが提供されており、いずれもオープンソースである。その3つのバージョンとは、Milvus Lite、Milvus Standalone、Milvus Clusterであり、それぞれ機能や短期的・長期的なMilvusの利用方法が異なる。では、これらを個別に探ってみよう。</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>その名の通り、Milvus LiteはGoogle ColabやJupyter Notebookとシームレスに統合できる軽量版である。追加の依存関係を持たない単一のバイナリとしてパッケージ化されているため、マシンへのインストールや実行、Pythonアプリケーションへの組み込みが容易です。さらに、Milvus LiteにはCLIベースのMilvusスタンドアロンサーバーが含まれており、あなたのマシン上でMilvusを直接実行するための柔軟性を提供します。Pythonコードに組み込むか、スタンドアロンサーバーとして利用するかは、お客様の好みと特定のアプリケーション要件次第です。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特徴と機能</h3><p>Milvus Liteには、Milvusのコアとなるベクトル検索機能が全て含まれています。</p>
<ul>
<li><p><strong>検索機能</strong>メタデータフィルタリングを含むトップk検索、範囲検索、ハイブリッド検索をサポートし、多様な検索要件に対応します。</p></li>
<li><p><strong>インデックスタイプと類似度メトリック</strong>11種類のインデックスタイプと5種類の類似度メトリクスをサポートし、特定のユースケースに対応する柔軟性とカスタマイズオプションを提供します。</p></li>
<li><p><strong>データ処理</strong>：バッチ処理（Apache Parquet、Arrays、JSON）およびストリーム処理が可能で、Airbyte、Apache Kafka、Apache Sparkのコネクターを通じてシームレスに統合できます。</p></li>
<li><p><strong>CRUDオペレーション</strong>：完全なCRUDサポート（create、read、update/upsert、delete）を提供し、包括的なデータ管理機能をユーザーに提供します。</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">用途と制限</h3><p>Milvus Liteは、迅速なプロトタイピングやローカル開発に理想的であり、小規模なデータセットの迅速なセットアップや実験が可能です。しかし、より大規模なデータセットや、より厳しいインフラ要件が要求される本番環境に移行する際には、その限界が明らかになります。そのため、Milvus Liteは初期の調査やテストには最適なツールですが、大量のアプリケーションや本番環境でのアプリケーションの展開には適していないかもしれません。</p>
<h3 id="Available-Resources" class="common-anchor-header">利用可能なリソース</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">ドキュメント</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Githubリポジトリ</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Google Colabサンプル</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">ビデオ</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvusスタンドアロン<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusには2つの運用モードがあります：スタンドアロンとクラスタです。どちらのモードもコアとなるベクターデータベースの機能は同じで、データサイズのサポートとスケーラビリティ要件が異なります。この違いにより、お客様のデータセットサイズ、トラフィック量、その他本番稼動に必要なインフラ要件に最適なモードを選択することができます。</p>
<p>Milvusスタンドアロンとは、Milvusベクトルデータベースシステムがクラスタリングや分散セットアップを行うことなく、単一のインスタンスとして独立して動作するモードです。Milvusはこのモードでは単一のサーバーまたはマシン上で動作し、インデックス作成やベクトル検索などの機能を提供します。データやトラフィックの規模が比較的小さく、クラスタ構成による分散機能を必要としない場合に適しています。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特徴と機能</h3><ul>
<li><p><strong>高性能</strong>：膨大なデータセット（数十億以上）のベクトル検索を卓越したスピードと効率で実行します。</p></li>
<li><p><strong>検索機能</strong>：メタデータのフィルタリングを含むトップk検索、範囲検索、ハイブリッド検索をサポートし、多様な検索要件に対応します。</p></li>
<li><p><strong>インデックスタイプと類似度メトリクス</strong>：11種類のインデックスタイプと5種類の類似度メトリクスをサポートし、特定のユースケースに対応する柔軟性とカスタマイズオプションを提供します。</p></li>
<li><p><strong>データ処理</strong>：バッチ処理（Apache Parquet、Arrays、Json）とストリーム処理の両方が可能で、Airbyte、Apache Kafka、Apache Sparkのコネクターを通じてシームレスに統合できます。</p></li>
<li><p><strong>データのレプリケーションとフェイルオーバー</strong>：組み込みのレプリケーションとフェイルオーバー/フェイルバック機能により、中断や障害時でもデータの整合性とアプリケーションの可用性を確保します。</p></li>
<li><p><strong>スケーラビリティ</strong>：コンポーネントレベルのスケーリングにより動的なスケーラビリティを実現し、需要に応じたシームレスなスケールアップとスケールダウンを可能にします。Milvusはコンポーネントレベルでオートスケールが可能で、リソース割り当てを最適化し、効率を高めます。</p></li>
<li><p><strong>マルチテナンシー</strong>：クラスタ内で最大10,000のコレクション/パーティションを管理できるマルチテナンシーをサポートし、異なるユーザやアプリケーションに対して効率的なリソース利用と分離を提供します。</p></li>
<li><p><strong>CRUDオペレーション</strong>：完全なCRUDサポート（作成、読み取り、更新/アップサート、削除）を提供し、ユーザーに包括的なデータ管理機能を提供します。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">必須コンポーネント</h3><ul>
<li><p>milvus：中核となる機能コンポーネント。</p></li>
<li><p>etcdMilvusの内部コンポーネント（プロキシ、インデックスノードなど）からのメタデータへのアクセスと保存を担当するメタデータエンジン。</p></li>
<li><p>MinIO：Milvus内のデータ永続化を担うストレージエンジン。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図1: Milvusスタンドアロンアーキテクチャ</p>
<h3 id="Available-Resources" class="common-anchor-header">利用可能なリソース</h3><ul>
<li><p>ドキュメント</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Docker Composeを使用したMilvusの環境チェックリスト</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">DockerによるMilvusスタンドアロンのインストール</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Githubリポジトリ</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvusクラスタ<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusクラスタとは、Milvusベクトルデータベースシステムが複数のノードやサーバに分散して動作するモードです。このモードでは、Milvusインスタンスはクラスタ化され、スタンドアロンのセットアップと比較して、より大容量のデータと高いトラフィック負荷を処理できる統合システムを形成します。Milvus Clusterはスケーラビリティ、フォールトトレランス、ロードバランシング機能を備えており、ビッグデータの処理や多数の同時クエリを効率的に処理する必要があるシナリオに適しています。</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">特徴と機能</h3><ul>
<li><p>高性能ベクトル検索、複数のインデックスタイプと類似度メトリックのサポート、バッチおよびストリーム処理フレームワークとのシームレスな統合など、Milvus Standaloneで利用可能なすべての機能を継承。</p></li>
<li><p>複数のノードにまたがる分散コンピューティングとロードバランシングを活用することで、比類のない可用性、パフォーマンス、コストの最適化を実現。</p></li>
<li><p>クラスタ全体のリソースを効率的に活用し、ワークロードの需要に基づいてリソースの割り当てを最適化することで、総コストを抑えながらセキュアでエンタープライズグレードのワークロードを展開および拡張できます。</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">必須コンポーネント</h3><p>Milvus Clusterには、8つのマイクロサービスコンポーネントと3つのサードパーティ依存コンポーネントが含まれています。すべてのマイクロサービスは互いに独立してKubernetes上にデプロイできます。</p>
<h4 id="Microservice-components" class="common-anchor-header">マイクロサービスコンポーネント</h4><ul>
<li><p>ルートコーディネーション</p></li>
<li><p>プロキシ</p></li>
<li><p>クエリコーデック</p></li>
<li><p>クエリノード</p></li>
<li><p>インデックス・ノード</p></li>
<li><p>インデックス・ノード</p></li>
<li><p>データ・ノード</p></li>
<li><p>データノード</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">サードパーティ依存</h4><ul>
<li><p>etcd：クラスタ内のさまざまなコンポーネントのメタデータを格納します。</p></li>
<li><p>MinIO：インデックスやバイナリ・ログ・ファイルなど、クラスタ内の大容量ファイルのデータ永続化を担当。</p></li>
<li><p>Pulsar：パルサー：最近の変異操作のログを管理し、ストリーミング・ログを出力し、ログ・パブリッシュ・サブスクライブ・サービスを提供する。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図2: Milvusクラスタアーキテクチャ</p>
<h4 id="Available-Resources" class="common-anchor-header">利用可能なリソース</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">ドキュメント</a>｜始め方</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus OperatorでMilvusクラスタをインストールする</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">HelmによるMilvusクラスタのインストール</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Milvusクラスタのスケール方法</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Githubリポジトリ</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Milvusバージョンの決定<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>プロジェクトに使用するMilvusのバージョンを決定する際には、データセットのサイズ、トラフィック量、スケーラビリティ要件、本番環境の制約などの要素を考慮する必要があります。Milvus Liteはラップトップでのプロトタイピングに最適です。Milvus Standaloneは、データセットに対してベクトル検索を行うための高いパフォーマンスと柔軟性を提供し、小規模なデプロイメント、CI/CD、Kubernetesをサポートしていないオフラインのデプロイメントに適しています...そして最後に、Milvus Clusterは、エンタープライズグレードのワークロードに対して比類のない可用性、スケーラビリティ、コストの最適化を提供し、大規模で可用性の高い本番環境に適した選択肢となります。</p>
<p>もう1つ、手間のかからないバージョンがあり、それは<a href="https://cloud.zilliz.com/signup">Zilliz Cloudと</a>呼ばれるMilvusのマネージド・バージョンだ。</p>
<p>最終的には、Milvusのバージョンは、特定のユースケース、インフラ要件、および長期的な目標によって異なります。これらの要素を慎重に評価し、各バージョンの特徴と能力を理解することで、プロジェクトのニーズと目的に沿った情報に基づいた決定を下すことができます。MilvusスタンドアロンまたはMilvusクラスタのいずれを選択しても、ベクトルデータベースのパワーを活用してAIアプリケーションのパフォーマンスと効率を向上させることができます。</p>
