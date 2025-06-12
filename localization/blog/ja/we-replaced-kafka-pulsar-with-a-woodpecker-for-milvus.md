---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: Milvusのためにカフカ／パルサーをウッドペッカーに置き換えた-その結果はこうだ
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  私たちは、MilvusのKafkaとPulsarを置き換えるために、クラウドネイティブのWALシステムであるWoodpeckerを構築し、運用の複雑さとコストを削減しました。
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR:</strong>Milvus 2.6でKafkaとPulsarを置き換えるために、クラウド・ネイティブのWrite-Ahead Logging (WAL)システムであるWoodpeckerを構築した。その結果は？Milvusベクトル・データベースのシンプルなオペレーション、より良いパフォーマンス、そしてコスト削減です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">出発点メッセージ・キューが合わなくなったとき<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちはKafkaとPulsarを愛し、使用していました。それらが機能しなくなるまで。オープンソースの代表的なベクター・データベースであるMilvusが進化するにつれ、これらの強力なメッセージ・キューが、もはや私たちのスケーラビリティ要件を満たさないことがわかりました。そこで私たちは大胆な行動に出ました。Milvus 2.6のストリーミング・バックボーンを書き直し、独自のWAL、<strong>Woodpeckerを</strong>実装したのです。</p>
<p>一見直感に反しているように見えるかもしれませんが、なぜこのような変更を行ったのか、その経緯を説明します。</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">初日からクラウドネイティブ<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは設立当初からクラウドネイティブのベクターデータベースでした。弾力的なスケーリングと迅速な障害回復のためにKubernetesを活用し、データの永続化のためにAmazon S3やMinIOのようなオブジェクト・ストレージ・ソリューションも活用しています。</p>
<p>このクラウドファーストのアプローチには大きな利点がありますが、課題もあります：</p>
<ul>
<li><p>S3のようなクラウド・オブジェクト・ストレージ・サービスは、事実上無制限のスループットと可用性を提供するが、レイテンシが100msを超えることも多い。</p></li>
<li><p>S3のようなクラウド・オブジェクト・ストレージ・サービスは、事実上無制限のスループットと可用性を提供しますが、100msを超えるレイテンシーを持つことがよくあります。</p></li>
<li><p>クラウドネイティブの特性とリアルタイムのベクトル検索の要求とのバランスをとることは、アーキテクチャ上の大きな課題となる。</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">共有ログアーキテクチャ：我々の基盤<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>多くのベクトル検索システムは、クラウドネイティブ環境でストリーミングシステムを構築すると、さらに大きな課題が発生するため、バッチ処理に限定している。対照的に、milvusはリアルタイムのデータ鮮度を優先し、共有ログアーキテクチャを実装しています。</p>
<p>この共有ログアーキテクチャは、コンセンサスプロトコルとコアデータベース機能を分離する重要な基盤を提供します。このアプローチを採用することで、milvusは複雑なコンセンサスプロトコルを直接管理する必要がなくなり、卓越したベクトル検索機能の提供に集中することができます。</p>
<p>AWS Aurora、Azure Socrates、Neonなどのデータベースも同様の設計を採用しています。<strong>しかし、オープンソースのエコシステムには重大なギャップが残っています。このアプローチの明確な利点にもかかわらず、コミュニティには低レイテンシーでスケーラブル、かつコスト効率の良い分散ライトアヘッドログ（WAL）の実装が欠けているのです。</strong></p>
<p>Bookieのような既存のソリューションは、そのヘビー級のクライアント設計と、GolangやC++用の量産可能なSDKがないため、私たちのニーズには不十分であることがわかりました。この技術的なギャップが、メッセージキューを使った最初のアプローチにつながりました。</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">最初の解決策WALとしてのメッセージ・キュー<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>このギャップを埋めるため、私たちの最初のアプローチは、メッセージ・キュー（Kafka/Pulsar）をWAL（ライト・アヘッド・ログ）として利用しました。アーキテクチャは次のように機能した：</p>
<ul>
<li><p>入ってくるリアルタイムの更新はすべてメッセージ・キューを流れる。</p></li>
<li><p>メッセージ・キューに受け入れられると、ライターは即座に確認を受け取る。</p></li>
<li><p>QueryNodeとDataNodeはこのデータを非同期に処理し、データの鮮度を維持しながら高い書き込みスループットを確保する。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図Milvus 2.0アーキテクチャの概要</p>
<p>このシステムは、Milvusユーザが期待するスループットとデータ鮮度のバランスを維持するために極めて重要な非同期データ処理を可能にしながら、即座の書き込み確認を効果的に提供しました。</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">WALに異なるものが必要だった理由<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6では、外部メッセージキューを廃止し、専用のクラウドネイティブWAL実装であるWoodpeckerを採用することにしました。これは軽い決断ではありませんでした。結局のところ、私たちは何年もKafkaとPulsarをうまく使ってきました。</p>
<p>どちらも強力な機能を備えた優れたシステムです。その代わり、Milvusが進化するにつれて、これらの外部システムがもたらす複雑さとオーバーヘッドの増大が課題でした。我々の要求がより専門的になるにつれ、汎用のメッセージキューが提供するものと我々のベクターデータベースが必要とするものとの間のギャップは広がり続けました。</p>
<p>最終的に3つの要因が、代替システムを構築する決断を後押ししました：</p>
<h3 id="Operational-Complexity" class="common-anchor-header">運用の複雑さ</h3><p>KafkaやPulsarのような外部依存関係は、複数のノードを持つ専用マシンと慎重なリソース管理を要求します。これにはいくつかの課題があります：</p>
<ul>
<li>運用の複雑化</li>
</ul>
<ul>
<li>システム管理者の学習曲線が長くなる</li>
</ul>
<ul>
<li>設定エラーやセキュリティ脆弱性のリスクが高まる</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">アーキテクチャ上の制約</h3><p>Kafkaのようなメッセージ・キューには、サポートされるトピック数に固有の制限がある。私たちは、コンポーネント間でトピックを共有するための回避策としてVShardを開発しましたが、このソリューションはスケーリング・ニーズに効果的に対応する一方で、アーキテクチャに大きな複雑性をもたらしました。</p>
<p>このような外部依存関係により、ログのガベージコレクションなどの重要な機能の実装が難しくなり、他のシステムモジュールとの統合摩擦が増加しました。時間の経過とともに、汎用のメッセージ・キューと、ベクター・データベースに特化した高パフォーマンスの要求との間のアーキテクチャ上のミスマッチが次第に明らかになり、私たちは設計上の選択を見直す必要に迫られました。</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">リソースの非効率性</h3><p>KafkaやPulsarのようなシステムで高可用性を確保するには、通常以下のことが要求されます：</p>
<ul>
<li><p>複数ノードへの分散展開</p></li>
<li><p>小規模なワークロードであっても大幅なリソース割り当て</p></li>
<li><p>MilvusのTimetickのような）エフェメラル・シグナル用のストレージ。</p></li>
</ul>
<p>しかし、これらのシステムには、このような一時的なシグナルの永続化をバイパスする柔軟性がないため、不必要なI/O操作とストレージの使用につながっている。これは、特に小規模でリソースに制約のある環境では、不釣り合いなリソースのオーバーヘッドとコスト増につながります。</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Woodpeckerの導入 - クラウドネイティブの高性能WALエンジン<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6では、Kafka/Pulsarに代わり、専用のクラウドネイティブWALシステムである<strong>Woodpeckerを</strong>採用しました。オブジェクト・ストレージ用に設計されたWoodpeckerは、パフォーマンスとスケーラビリティを向上させながら、運用を簡素化します。</p>
<p>Woodpeckerは、クラウド・ネイティブ・ストレージの可能性を最大化するためにゼロから構築されており、「追記型ライト・アヘッド・ログに必要なコア機能を提供しながら、クラウド環境に最適化された最高スループットのWALソリューションになる」という目標を掲げています。</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">Woodpeckerのゼロディスク・アーキテクチャ</h3><p>Woodpeckerの中核となるイノベーションは、その<strong>ゼロディスク・アーキテクチャ</strong>です：</p>
<ul>
<li><p>全てのログデータはクラウドオブジェクトストレージ（Amazon S3、Google Cloud Storage、Alibaba OSなど）に保存されます。</p></li>
<li><p>メタデータはetcdのような分散キーバリューストアで管理。</p></li>
<li><p>コアオペレーションにおいてローカルディスクに依存しない</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：  Woodpeckerアーキテクチャの概要</p>
<p>このアプローチは、耐久性とクラウド効率を最大化しながら、運用のオーバーヘッドを劇的に削減します。ローカルディスクへの依存を排除することで、Woodpeckerはクラウドネイティブの原則に完全に合致し、システム管理者の運用負担を大幅に軽減します。</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">パフォーマンスベンチマーク期待を上回るパフォーマンス</h3><p>シングルノード、シングルクライアント、シングルログストリームのセットアップでWoodpeckerのパフォーマンスを評価するために包括的なベンチマークを実行しました。その結果は、KafkaやPulsarと比較した際に素晴らしいものでした：</p>
<table>
<thead>
<tr><th><strong>システム</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WPローカル</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>スループット</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>待ち時間</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1.8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>コンテキストとして、テストマシンで異なるストレージバックエンドの理論上のスループット限界を測定した：</p>
<ul>
<li><p><strong>MinIO</strong>：～110MB/秒</p></li>
<li><p><strong>ローカルファイルシステム</strong>：600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (シングルEC2インスタンス)</strong>: 最大1.1 GB/s</p></li>
</ul>
<p>驚くべきことに、Woodpeckerは各バックエンドで最大可能スループットの60～80%を一貫して達成しました。</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">主なパフォーマンスインサイト</h4><ol>
<li><p><strong>ローカルファイルシステムモード</strong>：Woodpeckerは、Kafkaより3.5倍、Pulsarより4.2倍速い450MB/秒を達成し、待ち時間はわずか1.8ミリ秒と超低遅延であるため、高性能なシングルノード展開に最適です。</p></li>
<li><p><strong>クラウド・ストレージ・モード（S3）</strong>：S3に直接書き込む場合、WoodpeckerはKafkaより5.8倍、Pulsarより7倍速い750MB/秒（S3の理論限界の約68%）を達成しました。レイテンシは166ミリ秒と大きいが、このセットアップはバッチ指向のワークロードに卓越したスループットを提供する。</p></li>
<li><p><strong>オブジェクト・ストレージ・モード（MinIO）</strong>：MinIOでも、Woodpeckerは71MB/秒（MinIO容量の約65%）を達成しました。この性能はKafkaやPulsarに匹敵しますが、必要なリソースは大幅に少なくなります。</p></li>
</ol>
<p>Woodpeckerは特に、順序の維持が重要な同時大量書き込みに最適化されています。そして、これらの結果は開発の初期段階を反映したものに過ぎず、I/Oマージ、インテリジェント・バッファリング、プリフェッチにおける現在進行中の最適化により、性能が理論的限界にさらに近づくことが期待されます。</p>
<h3 id="Design-Goals" class="common-anchor-header">設計目標</h3><p>Woodpeckerは、以下の主要な技術要件を通じて、リアルタイム・ベクター検索ワークロードの進化する要求に対応します：</p>
<ul>
<li><p>アベイラビリティゾーンをまたがる耐久性のある永続性を備えた高スループットのデータ取り込み</p></li>
<li><p>リアルタイムのサブスクリプションのための低レイテンシのテールリードと、障害回復のための高スループットのキャッチアップリード</p></li>
<li><p>NFSプロトコルをサポートするクラウドオブジェクトストレージやファイルシステムを含む、プラグイン可能なストレージバックエンド</p></li>
<li><p>柔軟なデプロイメントオプション。軽量なスタンドアロンセットアップとマルチテナント展開のための大規模クラスタの両方をサポート。</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">アーキテクチャコンポーネント</h3><p>標準的なWoodpeckerのデプロイメントには以下のコンポーネントが含まれます。</p>
<ul>
<li><p><strong>クライアント</strong>- 読み書き要求を発行するためのインターフェース層</p></li>
<li><p><strong>LogStore</strong>- 高速書き込みバッファリング、ストレージへの非同期アップロード、ログ圧縮を管理します。</p></li>
<li><p><strong>ストレージバックエンド</strong>- S3、GCS、EFSなどのファイルシステムなど、スケーラブルで低コストのストレージサービスをサポート。</p></li>
<li><p><strong>ETCD</strong>- メタデータを保存し、分散ノード間でログの状態を調整します。</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">お客様のニーズに合わせた柔軟なデプロイメント</h3><p>Woodpeckerは、お客様のニーズに合わせて2つの導入モードを提供しています：</p>
<p><strong>メモリバッファモード - 軽量でメンテナンスフリー</strong></p>
<p>メモリバッファモードは、Woodpeckerが一時的にメモリに書き込みをバッファリングし、定期的にクラウドオブジェクトストレージサービスにフラッシュするシンプルで軽量なデプロイオプションです。メタデータはetcdを使って管理され、一貫性と協調性を確保します。このモードは、特に書き込みレイテンシの低さが重要でない場合、パフォーマンスよりもシンプルさを優先する小規模なデプロイや本番環境でのバッチ負荷の高いワークロードに最適です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図メモリバッファモード</em></p>
<p><strong>QuorumBufferモード - 低レイテンシ、高耐久性の展開に最適化されています。</strong></p>
<p>QuorumBufferモードは、レイテンシに敏感で、リアルタイムの応答性と強力な耐障害性の両方を必要とする高頻度の読み取り/書き込みワークロードのために設計されています。このモードでは、Woodpeckerは3レプリカのクォーラム書き込みによる高速書き込みバッファとして機能し、強力な一貫性と高可用性を保証します。</p>
<p>書き込みは、3つのノードのうち少なくとも2つのノードにレプリケートされると成功とみなされ、通常1桁ミリ秒以内に完了します。このアーキテクチャは、ノード上の状態を最小化し、大規模なローカル・ディスク・ボリュームの必要性を排除し、従来のクォーラムベースのシステムでしばしば必要とされる複雑なアンチエントロピー修復を回避します。</p>
<p>その結果、一貫性、可用性、迅速なリカバリーが不可欠なミッションクリティカルな本番環境に理想的な、合理的で堅牢なWALレイヤーが実現します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図：QuorumBufferモード</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService：リアルタイムデータフローのために構築<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.6では、Woodpeckerに加え、ログ管理、ログの取り込み、ストリーミングデータのサブスクリプションのために設計された専用コンポーネントで<strong>あるStreamingServiceが</strong>導入されました。</p>
<p>新しいアーキテクチャの仕組みを理解するためには、これら2つのコンポーネントの関係を明確にすることが重要です：</p>
<ul>
<li><p><strong>Woodpeckerは</strong>、ライトアヘッド・ログの実際の永続性を処理するストレージレイヤーで、耐久性と信頼性を提供します。</p></li>
<li><p><strong>StreamingServiceは</strong>、ログ操作を管理し、リアルタイムのデータストリーミング機能を提供するサービスレイヤーです。</p></li>
</ul>
<p>これらのレイヤーを組み合わせることで、外部メッセージキューを完全に置き換えることができます。Woodpeckerは耐久性のあるストレージ基盤を提供し、StreamingServiceはアプリケーションが直接やり取りする高レベルの機能を提供します。このように関係性を分離することで、各コンポーネントはそれぞれの役割に最適化され、同時に統合システムとしてシームレスに連携することができます。</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Milvus 2.6へのストリーミングサービスの追加</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図：Milvus 2.6のアーキテクチャに追加されたストリーミングサービス</p>
<p>Streaming Serviceは3つのコアコンポーネントで構成されます：</p>
<p><strong>ストリーミング・コーディネータ</strong></p>
<ul>
<li><p>Milvus ETCDセッションを監視することにより、利用可能なストリーミングノードを発見します。</p></li>
<li><p>WALのステータスを管理し、ManagerServiceを通じてロードバランシングメトリックスを収集します。</p></li>
</ul>
<p><strong>ストリーミングクライアント</strong></p>
<ul>
<li><p>AssignmentServiceに問い合わせ、ストリーミングノード間のWALセグメント配分を決定します。</p></li>
<li><p>適切な Streaming Node 上で HandlerService を介して読み取り/書き込み操作を実行します。</p></li>
</ul>
<p><strong>ストリーミング・ノード</strong></p>
<ul>
<li><p>実際のWALオペレーションを処理し、リアルタイムのデータストリーミングのためのパブリッシュ・サブスクライブ機能を提供する。</p></li>
<li><p>WAL管理およびパフォーマンス・レポート用の<strong>ManagerServiceを</strong>含む。</p></li>
<li><p>WALエントリのための効率的なパブリッシュ・サブスクライブ・メカニズムを実装する<strong>HandlerServiceを備えて</strong>います。</p></li>
</ul>
<p>このレイヤーアーキテクチャにより、Milvusはストリーミング機能（サブスクリプション、リアルタイム処理）と実際のストレージメカニズムとの明確な分離を維持することができます。Woodpeckerはログストレージの "どのように "を処理し、StreamingServiceはログ操作の "何を "と "いつ "を管理します。</p>
<p>その結果、ストリーミングサービスは、ネイティブのサブスクリプションサポートを導入することで、外部メッセージキューの必要性を排除し、milvusのリアルタイム機能を大幅に強化します。また、クエリとデータパスで重複していたキャッシュを統合することでメモリ消費量を削減し、非同期同期遅延を除去することで一貫性の高い読み込みの待ち時間を短縮し、システム全体のスケーラビリティとリカバリ速度の両方を向上させます。</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">結論 - ゼロディスク・アーキテクチャでのストリーミング<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>状態の管理は難しい。ステートフルなシステムは、しばしば弾力性とスケーラビリティを犠牲にする。クラウド・ネイティブの設計では、ステートをコンピュートから切り離し、それぞれが独立してスケールできるようにすることがますます受け入れられている。</p>
<p>車輪を再発明するのではなく、AWS S3、Google Cloud Storage、MinIOのようなサービスを支えるワールドクラスのエンジニアリングチームに、耐久性がありスケーラブルなストレージの複雑さを委ねるのだ。その中でもS3は、事実上無制限の容量、イレブンナイン（99.9999999％）の耐久性、99.99％の可用性、高スループットの読み書きパフォーマンスで際立っている。</p>
<p>しかし、「ゼロディスク」アーキテクチャにもトレードオフがある。オブジェクトストアは依然として高い書き込みレイテンシとスモールファイルの非効率性に悩まされており、この限界は多くのリアルタイムワークロードで解決されていない。</p>
<p>ベクターデータベース、特にミッションクリティカルなRAG、AIエージェント、低レイテンシの検索ワークロードをサポートするデータベースにとって、リアルタイムアクセスと高速書き込みは譲れません。そのため私たちは、Woodpeckerとストリーミングサービスを中心にMilvusを再構築しました。このシフトにより、システム全体が簡素化され（正直なところ、誰もベクター・データベース内に完全なPulsarスタックを維持したいとは思わないでしょう）、より新鮮なデータを確保し、コスト効率を改善し、障害回復をスピードアップします。</p>
<p>私たちは、Woodpeckerが単なるMilvusコンポーネントではなく、他のクラウド・ネイティブ・システムの基盤となるビルディング・ブロックの役割を果たすことができると信じています。クラウドインフラストラクチャが進化するにつれ、S3 Expressのような技術革新により、1桁ミリ秒の書き込みレイテンシでAZを跨いだ耐久性という理想にさらに近づけるかもしれません。</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6を始めよう<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6は現在利用可能です。Woodpeckerに加え、階層型ストレージ、RabbitQ量子化メソッド、強化された全文検索とマルチテナンシーなど、多数の新機能とパフォーマンスの最適化が導入されており、今日のベクトル検索における最も差し迫った課題である、コストを抑えながら効率的にスケーリングするという課題に直接取り組んでいます。</p>
<p>Milvusが提供するすべてのものをご覧になる準備はできましたか？<a href="https://milvus.io/docs/release_notes.md"> リリースノート</a>、<a href="https://milvus.io/docs"> 完全なドキュメントの</a>閲覧、または<a href="https://milvus.io/blog"> 機能ブログを</a>ご覧ください。</p>
<p>Milvus2.6を最大限に活用するためのお手伝いをさせていただきます<a href="https://discord.com/invite/8uyFbECzPX">。</a></p>
