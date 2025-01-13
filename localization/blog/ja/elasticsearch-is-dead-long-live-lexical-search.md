---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: Elasticsearchは死んだ、レキシカル検索万歳
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>今や誰もが、ハイブリッド検索が<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（Retrieval-Augmented Generation）検索の品質を向上させたことを知っている。<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密な埋め込み</a>検索は、クエリと文書間の深い意味的関係を捕らえる上で素晴らしい能力を示しているが、まだ顕著な限界がある。これには、説明可能性の欠如や、ロングテールのクエリや希少な用語に対する最適なパフォーマンスなどがある。</p>
<p>多くのRAGアプリケーションは、事前に訓練されたモデルにはドメイン固有の知識が欠けていることが多いため、苦戦している。シナリオによっては、単純なBM25キーワードマッチがこれらの洗練されたモデルを凌駕することもある。そこでハイブリッド検索がそのギャップを埋め、密なベクトル検索の意味理解とキーワードマッチングの精度を組み合わせます。</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">ハイブリッド検索が本番で複雑な理由<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/LangChain">LangChainや</a> <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndexの</a>ようなフレームワークでは、概念実証のハイブリッド検索を簡単に構築することができますが、膨大なデータセットでの実運用へのスケーリングは困難です。従来のアーキテクチャでは、ベクターデータベースと検索エンジンを別々に構築する必要があり、いくつかの重要な課題がありました：</p>
<ul>
<li><p>高いインフラ維持コストと運用の複雑さ</p></li>
<li><p>複数のシステムにまたがるデータの冗長性</p></li>
<li><p>困難なデータの一貫性管理</p></li>
<li><p>システム間の複雑なセキュリティとアクセス制御</p></li>
</ul>
<p>システムの複雑さとコストを削減しながら、字句検索と意味検索をサポートする統一されたソリューションが求められている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Elasticsearchの問題点<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearchは、過去10年間で最も影響力のあるオープンソースの検索プロジェクトの1つです。Apache Luceneをベースに構築され、その高いパフォーマンス、スケーラビリティ、分散アーキテクチャによって人気を博した。バージョン8.0でベクトルANN検索が追加されましたが、実運用ではいくつかの重大な課題に直面しています：</p>
<p><strong>高い更新コストとインデックス作成コスト</strong>Elasticsearch のアーキテクチャは、書き込み操作、インデックス構築、クエリを完全に分離していません。そのため、書き込み操作、特に一括更新において、CPUとI/Oのオーバーヘッドが大きくなります。インデックスの作成とクエリの間のリソースの競合はパフォーマンスに影響し、高頻度の更新シナリオでは大きなボトルネックとなります。</p>
<p><strong>劣悪なリアルタイム・パフォーマンス：</strong>ほぼリアルタイム」の検索エンジンであるElasticsearchは、データの可視性に顕著なレイテンシーをもたらします。このレイテンシは、高頻度のインタラクションや動的な意思決定が必要なAgentシステムなどのAIアプリケーションで特に問題となります。</p>
<p><strong>困難なシャード管理：</strong>Elasticsearch は分散アーキテクチャのためにシャーディングを使用していますが、シャード管理には大きな課題があります。動的なシャーディングのサポートがないため、小さなデータセットではシャードの数が多すぎるとパフォーマンスが低下し、大きなデータセットではシャードの数が少なすぎるとスケーラビリティが制限され、データの分散が不均一になるというジレンマが生じます。</p>
<p><strong>非クラウドネイティブ・アーキテクチャー：</strong>クラウドネイティブアーキテクチャが普及する前に開発されたElasticsearchの設計は、ストレージとコンピートを密に結合しており、パブリッククラウドやKubernetesのような最新のインフラとの統合を制限しています。リソースの拡張には、ストレージとコンピュート両方を同時に増やす必要があり、柔軟性が低下します。マルチレプリカ・シナリオでは、各シャードが独立してインデックスを構築する必要があり、計算コストが増加し、リソース効率が低下する。</p>
<p><strong>ベクトル検索のパフォーマンスの低下</strong>Elasticsearch 8.0ではベクトルANN検索が導入されましたが、そのパフォーマンスはMilvusのような専用ベクトルエンジンに大きく遅れをとっています。Luceneカーネルをベースとしたインデックス構造は高次元のデータに対して非効率的であり、大規模なベクトル検索要件に苦戦しています。スカラーフィルタリングやマルチテナンシーを含む複雑なシナリオでは特にパフォーマンスが不安定になり、高負荷や多様なビジネスニーズをサポートすることが困難になる。</p>
<p><strong>過剰なリソース消費：</strong>Elasticsearchは、特に大規模なデータを処理する際に、メモリとCPUに非常に大きな負荷をかけます。JVMに依存しているため、頻繁なヒープサイズの調整やガベージコレクションのチューニングが必要となり、メモリ効率に深刻な影響を与えます。ベクトル検索操作にはSIMDに最適化された集中的な計算が必要ですが、JVM環境は理想的とは言い難いものです。</p>
<p>これらの基本的な制限は、組織がAIインフラストラクチャを拡張するにつれてますます問題となり、Elasticsearchを高いパフォーマンスと信頼性を必要とする最新のAIアプリケーションにとって特に困難なものにしています。</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Sparse-BM25の導入：レキシカルサーチの再構築<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5では</a>、バージョン2.4で導入されたハイブリッド検索機能をベースに、Sparse-BM25によるネイティブなレキシカル検索のサポートが導入されました。この革新的なアプローチには、以下の主要コンポーネントが含まれます：</p>
<ul>
<li><p>Tantivyによる高度なトークン化と前処理</p></li>
<li><p>分散語彙および用語頻度管理</p></li>
<li><p>コーパスTFとクエリTF-IDFによるスパースベクトル生成</p></li>
<li><p>WANDアルゴリズムによる転置インデックスのサポート（Block-Max WANDとグラフインデックスのサポートを開発中）</p></li>
</ul>
<p>Elasticsearchと比較して、Milvusはアルゴリズムの柔軟性において大きなアドバンテージがある。ベクトル距離ベースの類似度計算により、"End-to-End Query Term Weighting "研究に基づくTW-BERT（Term Weighting BERT）の実装を含む、より洗練されたマッチングが可能です。このアプローチは、ドメイン内テストとドメイン外テストの両方で優れた性能を実証している。</p>
<p>もう一つの重要な利点は、コスト効率である。Milvusは転置インデックスと高密度埋め込み圧縮の両方を活用することで、1%未満の想起低下で5倍の性能向上を達成している。テールタームの刈り込みとベクトルの量子化により、メモリ使用量は50%以上削減された。</p>
<p>長いクエリの最適化は、特に強みとして際立っている。従来のWANDアルゴリズムが長いクエリで苦戦するところ、Milvusはスパース埋め込みとグラフインデックスを組み合わせることで優れており、高次元のスパースベクトル検索シナリオで10倍の性能向上を実現している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: RAGのための究極のベクトルデータベース<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、その包括的な機能セットにより、RAGアプリケーションのための最高の選択肢です。主な利点は以下の通りです：</p>
<ul>
<li><p>動的スキーマ機能と強力なフィルタリングオプションによる豊富なメタデータのサポート</p></li>
<li><p>コレクション、パーティション、パーティションキーによる柔軟な分離が可能なエンタープライズグレードのマルチテナンシー</p></li>
<li><p>メモリからS3までの多階層ストレージによる業界初のディスクベクトルインデックスのサポート</p></li>
<li><p>10Mから1B以上のベクターへのシームレスなスケーリングをサポートするクラウドネイティブなスケーラビリティ</p></li>
<li><p>グループ化、範囲指定、ハイブリッド検索を含む包括的な検索機能</p></li>
<li><p>LangChain、LlamaIndex、Dify、その他のAIツールとの深いエコシステム統合</p></li>
</ul>
<p>このシステムの多様な検索機能は、グループ化、範囲指定、ハイブリッド検索の手法を網羅しています。LangChain、LlamaIndex、Difyのようなツールとの深い統合、および多数のAI製品のサポートにより、Milvusは最新のAIインフラストラクチャのエコシステムの中心に位置しています。</p>
<h2 id="Looking-Forward" class="common-anchor-header">今後の展望<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>AIがPOCから本番へと移行する中、Milvusは進化を続けています。私たちは、検索品質を向上させながら、ベクトル検索をよりアクセスしやすく、費用対効果の高いものにすることに注力しています。新興企業であれ、大企業であれ、MilvusはAIアプリケーション開発の技術的障壁を軽減します。</p>
<p>このアクセシビリティとイノベーションへのコミットメントにより、私たちはまた新たな大きな一歩を踏み出しました。当社のオープンソース・ソリューションは、世界中の何千ものアプリケーションの基盤として機能し続けていますが、多くの組織が、運用のオーバーヘッドを排除するフルマネージド・ソリューションを必要としていることを認識しています。</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zillizクラウド：マネージド・ソリューション<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは、Milvusをベースとしたフルマネージドベクターデータベースサービスである<a href="https://zilliz.com/cloud">Zilliz Cloudを</a>過去3年にわたり構築してきました。Milvusプロトコルをクラウドネイティブに再実装することで、ユーザビリティ、コスト効率、セキュリティの向上を実現しています。</p>
<p>世界最大のベクトル検索クラスタを維持し、何千ものAIアプリケーション開発者をサポートしてきた経験から、Zilliz Cloudはセルフホストソリューションと比較して運用のオーバーヘッドとコストを大幅に削減します。</p>
<p>ベクトル検索の未来を体験してみませんか？今すぐ無料トライアルを開始し、最大200ドルのクレジットをご利用ください。</p>
