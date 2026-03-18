---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: セマンティック検索の生産化：Airtableでベクターインフラを構築し拡張した方法
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Airtableが、セマンティック検索、マルチテナント検索、低レイテンシのAI体験のために、スケーラブルなMilvusベースのベクターインフラストラクチャをどのように構築したかをご紹介します。
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>この投稿は</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Airtable Medium</a></em> <em>チャンネルに</em><em>掲載されたもの</em> <em>で、許可を得てここに再掲載しています。</em></p>
<p>Airtable のセマンティック検索がコンセプトから製品のコア機能へと進化するにつれ、データインフラチームはそのスケーリングという課題に直面しました。<a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">エンベッディングシステムの構築に関する前回の投稿で</a>詳述したように、エンベッディングのライフサイクルを処理するために、私たちはすでに堅牢で、最終的に一貫性のあるアプリケーションレイヤーを設計していました。しかし、私たちのアーキテクチャ図には、ベクターデータベースという重要なピースが欠けていました。</p>
<p>何十億ものエンベッディングをインデックス化し、提供し、大規模なマルチテナンシーをサポートし、分散クラウド環境でパフォーマンスと可用性の目標を維持できるストレージエンジンが必要だったのです。これは、Airtable のインフラスタックの中核となるベクトル検索プラットフォームをどのように構築し、強化し、進化させたかを示す物語です。</p>
<h2 id="Background" class="common-anchor-header">背景<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Airtable の目標は、お客様がパワフルで直感的な方法でデータを活用できるようにすることです。ますます強力で正確なLLMの出現により、データのセマンティックな意味を活用する機能は、当社の製品の中核となっています。</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">セマンティック検索の使用方法<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (AirtableのAIチャット) が大規模なデータセットから実際の質問に答えます。</h3><p>50万行のベース（データベース）に自然言語で質問し、文脈に富んだ正しい答えを得ることを想像してみてください。例えば</p>
<p>"最近のバッテリーの寿命について顧客は何を言っていますか？"</p>
<p>小さなデータセットでは、すべての行を直接LLMに送ることが可能だ。しかし規模が大きくなると、それはすぐに実行不可能になる。その代わりに、以下のことができるシステムが必要である：</p>
<ul>
<li>クエリの意味的意図を理解する</li>
<li>ベクトル類似性検索によって最も関連性の高い行を検索する。</li>
<li>それらの行をコンテキストとしてLLMに提供する。</li>
</ul>
<p>この要件が、その後のほぼすべての設計上の決定を形作った：Omniは、非常に大規模なベースであっても、即座に、そしてインテリジェントに感じられる必要があった。</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">リンクされたレコードの推薦：完全一致を超える意味</h3><p>セマンティック検索はまた、Airtableの中核機能であるリンクレコードを強化します。ユーザーは、テキストの完全一致ではなく、文脈に基づいた関係性の提案を必要としています。例えば、プロジェクトの説明は、その特定のフレーズを使用することなく、"Team Infrastructure "との関係を暗示するかもしれません。</p>
<p>このようなオンデマンドの提案を提供するには、一貫した予測可能なレイテンシで高品質の意味検索が必要です。</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">当社の設計優先事項<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>これらの機能をサポートするために、私たちは4つの目標を中心にシステムを構築しました：</p>
<ul>
<li><strong>低レイテンシーのクエリ（500ms p99）：</strong>予測可能なパフォーマンスはユーザーの信頼に不可欠です<strong>。</strong></li>
<li><strong>高スループットの書き込み：</strong>ベースは常に変化し、エンベッディングは常に同期していなければならない。</li>
<li><strong>水平方向のスケーラビリティ：</strong>システムは何百万もの独立したベースをサポートしなければならない。</li>
<li><strong>セルフホスティング：</strong>すべての顧客データは、Airtableが管理するインフラ内に保持されなければならない。</li>
</ul>
<p>これらの目標が、その後のすべてのアーキテクチャ上の決定を形作った。</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">ベクターデータベースベンダーの評価<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>2024年後半、私たちはいくつかのベクターデータベースの選択肢を評価し、最終的に3つの重要な要件に基づいて<a href="https://milvus.io/">milvusを</a>選択しました。</p>
<ul>
<li>第一に、データのプライバシーを確保し、インフラをきめ細かく制御するために、セルフホストソリューションを優先しました。</li>
<li>次に、書き込みが多く、クエリのパターンがバースト的であるため、予測可能な低レイテンシを維持しつつ、拡張性の高いシステムが必要でした。</li>
<li>最後に、当社のアーキテクチャには、数百万の顧客テナント間で強固な分離が必要でした。</li>
</ul>
<p><strong>Milvusは</strong>、その分散された性質が大規模なマルチテナントをサポートし、インジェスト、インデックス作成、およびクエリ実行を独立して拡張できるため、コストを予測可能に保ちながらパフォーマンスを提供することができます。</p>
<h2 id="Architecture-Design" class="common-anchor-header">アーキテクチャ設計<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>テクノロジーを選択した後、私たちはAirtableのユニークなデータ形状を表現するアーキテクチャを決定する必要がありました。</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">パーティショニングの課題<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは2つの主要なデータ・パーティショニング戦略を評価しました：</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">オプション 1: 共有パーティション</h3><p>複数のベースがパーティションを共有し、クエリはベースIDでフィルタリングすることでスコープされます。これはリソースの使用率を向上させますが、フィルタリングのオーバーヘッドが追加され、ベース削除がより複雑になります。</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">オプション2: パーティションごとに1つのベース</h3><p>各Airtableベースはmilvusの物理パーティションにマッピングされます。これにより、強力な分離が提供され、高速かつシンプルなベース削除が可能になり、クエリ後のフィルタリングによるパフォーマンスへの影響を回避できます。</p>
<h3 id="Final-Strategy" class="common-anchor-header">最終戦略</h3><p>私たちはシンプルさと強力な分離のためにオプション2を選択しました。しかし、初期のテストでは、1つのMilvusコレクションで100kパーティションを作成するとパフォーマンスが著しく低下することがわかりました：</p>
<ul>
<li>パーティション作成のレイテンシは~20ミリ秒から~250ミリ秒に増加しました。</li>
<li>パーティションのロード時間は30秒を超えました。</li>
</ul>
<p>この問題に対処するため、コレクションごとのパーティション数に上限を設けました。Milvusクラスターごとに400コレクションを作成し、それぞれ最大1,000パーティションを持つ。これにより、クラスタあたりのベース総数は400kに制限され、新たなクラスタは追加顧客のオンボードに応じてプロビジョニングされます。</p>
<h2 id="Indexing--Recall" class="common-anchor-header">インデックス作成とリコール<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>インデックスの選択は、我々のシステムにおいて最も重要なトレードオフのひとつであることが判明した。パーティションがロードされると、そのインデックスはメモリかディスクにキャッシュされる。想起率、インデックス・サイズ、性能のバランスをとるため、いくつかのインデックス・タイプをベンチマークしました。</p>
<ul>
<li><strong>IVF-SQ8：</strong>メモリフットプリントは小さいが、想起率は低い。</li>
<li><strong>HNSW：</strong>最高の想起率（99%～100%）を実現するが、メモリを大量に消費する。</li>
<li><strong>DiskANN：</strong>HNSWに似たリコールを提供するが、クエリーレイテンシーが高い。</li>
</ul>
<p>最終的には、その優れたリコールとパフォーマンス特性からHNSWを選択した。</p>
<h2 id="The-Application-layer" class="common-anchor-header">アプリケーション層<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>高レベルでは、Airtableのセマンティック検索パイプラインは2つのコアフローを含む：</p>
<ol>
<li><strong>取り込みフロー：</strong>Airtableの行を埋め込みに変換し、milvusに格納する。</li>
<li><strong>クエリフロー：</strong>ユーザークエリを埋め込み、関連する行IDを取得し、LLMにコンテキストを提供する。</li>
</ol>
<p>この2つのフローは、継続的かつ信頼性の高いスケールで動作する必要があります。以下にそれぞれのフローを説明する。</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">取り込みフロー：MilvusとAirtableを同期させる<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザがOmniを開くと、AirtableはMilvusへの同期を開始する。パーティションを作成し、チャンク単位で行を処理し、埋め込みを生成し、Milvusにアップサートします。それ以降、ベースに加えられた変更を捕捉し、データの一貫性を保つために、それらの行の再エンベッドとアップサートを行います。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">クエリの流れ：データの利用方法<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリ側では、ユーザーのリクエストを埋め込み、Milvusに送信し、最も関連性の高い行IDを取得します。そして、それらの行の最新バージョンを取得し、LLMへのリクエストにコンテキストとして含めます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">運用上の課題と解決方法<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>セマンティック検索アーキテクチャの構築は一つの挑戦である。以下は、その過程で学んだ運用上の重要な教訓です。</p>
<h3 id="Deployment" class="common-anchor-header">デプロイメント</h3><p>Milvusのデプロイは、Kubernetes CRD経由で<a href="https://github.com/zilliztech/milvus-operator">Milvusオペレータを使って</a>行い、宣言的にクラスタを定義・管理できるようにしています。設定の更新、クライアントの改善、Milvusのアップグレードなど、すべての変更は、ユーザーにロールアウトする前に、ユニットテストと本番トラフィックをシミュレートするオンデマンドの負荷テストを通して実行されます。</p>
<p>バージョン2.5では、Milvusクラスタは以下のコアコンポーネントで構成されています：</p>
<ul>
<li>クエリ・ノードはベクトル・インデックスをメモリに保持し、ベクトル検索を実行する。</li>
<li>データノードはインジェストとコンパクションを処理し、新しいデータをストレージに永続化する。</li>
<li>インデックス・ノードはベクトル・インデックスを構築・維持し、データが増大しても高速な検索を維持する。</li>
<li>Coordinatorノードがすべてのクラスタのアクティビティとシャードの割り当てをオーケストレーションします。</li>
<li>プロキシノードがAPIトラフィックをルーティングし、ノード間の負荷分散を行う</li>
<li>Kafkaは、内部メッセージングとデータフローのためのログ/ストリーミングバックボーンを提供します。</li>
<li>Etcdがクラスタのメタデータと調整状態を保存</li>
</ul>
<p>CRD主導の自動化と厳格なテストパイプラインにより、迅速かつ安全にアップデートを展開できる。</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">観測可能性：システムの健全性をエンドツーエンドで把握<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>セマンティック検索が高速で予測可能であり続けるよう、2つのレベルでシステムを監視しています。</p>
<p>インフラストラクチャーレベルでは、Milvusの全コンポーネントのCPU、メモリ使用量、ポッドの健全性を追跡しています。これらのシグナルはクラスタが安全な範囲内で動作しているかどうかを教えてくれ、リソースが飽和したりノードが不健康になったりしてユーザーに影響が及ぶ前に問題を発見するのに役立ちます。</p>
<p>サービスレイヤーでは、各ベースがどれだけインジェストとクエリのワークロードに対応しているかに注目しています。コンパクションやインデックス作成のスループットなどの指標により、データがどれだけ効率的に取り込まれているかを可視化します。クエリの成功率とレイテンシは、データをクエリするユーザーエクスペリエンスを理解し、パーティションの成長は、データがどのように成長しているかを知ることができます。</p>
<h2 id="Node-Rotation" class="common-anchor-header">ノードのローテーション<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>セキュリティとコンプライアンス上の理由から、私たちは定期的にKubernetesノードをローテーションしています。ベクトル検索クラスタでは、これは自明なことではありません：</p>
<ul>
<li>クエリノードがローテーションされると、コーディネータはクエリノード間のインメモリデータのバランスを調整する。</li>
<li>KafkaとEtcdはステートフルな情報を保存するため、クォーラムと継続的な可用性を必要とする。</li>
</ul>
<p>私たちは厳格な中断バジェットと1ノード1時間のローテーションポリシーでこれに対処します。Milvusコーディネータには、次のノードが循環する前にバランスを調整する時間が与えられます。この慎重なオーケストレーションにより、速度を落とすことなく信頼性を維持しています。</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">コールドパーティションのオフロード<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>運用における最大の成果のひとつは、データにホット／コールドの明確なアクセス・パターンがあることを認識したことです。使用状況を分析した結果、Milvusにあるデータのうち、ある週に書き込みや読み出しが行われるのは25%程度であることがわかりました。Milvusはパーティション全体をオフロードし、クエリ・ノードのメモリを解放します。そのデータが後で必要になれば、数秒で再ロードできる。これにより、ホットデータをメモリに残し、残りをオフロードすることで、コストを削減し、長期的により効率的に拡張することができます。</p>
<h2 id="Data-Recovery" class="common-anchor-header">データ復旧<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを広範に展開する前に、どのような障害シナリオからも迅速に復旧できるという確信が必要でした。ほとんどの問題はクラスタ内蔵のフォールトトレランスでカバーできますが、データが破損したり、システムが回復不可能な状態に陥るような稀なケースも想定しました。</p>
<p>そのような状況では、リカバリーの道筋は簡単だ。まず新しいMilvusクラスタを立ち上げ、トラフィックの提供をほぼ即座に再開できるようにします。新しいクラスタが稼動すると、最もよく使用されるベースを積極的に再エンベッドし、残りのベースはアクセスされるたびに遅延処理します。これにより、システムが一貫性のあるセマンティックインデックスを徐々に再構築する間、最もアクセスされるデータのダウンタイムを最小限に抑えることができます。</p>
<h2 id="What’s-Next" class="common-anchor-header">次の課題<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvusとの</a>共同作業により、Airtableにおけるセマンティック検索の強力な基盤が築かれました。このシステムが整ったことで、私たちは今、よりリッチな検索パイプラインと、製品全体にわたるより深いAI統合を模索しています。この先、たくさんのエキサイティングな仕事が待っていますが、まだ始まったばかりです。</p>
<p><em>このプロジェクトに貢献してくれたデータ・インフラストラクチャーと組織全体の過去と現在のすべてのAirtabletsに感謝する：Alex Sorokin、Andrew Wang、Aria Malkani、Cole Dearmon-Moore、Nabeel Farooqui、Will Powelson、Xiaobing Xia。</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Airtableについて<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtableは</a>、カスタムアプリケーションの構築、ワークフローの自動化、共有データのエンタープライズ規模での管理を可能にするデジタルオペレーションプラットフォームのリーディングカンパニーです。Airtableは、複雑で部門横断的なプロセスをサポートするように設計されており、チームが共有された真実の情報源に基づいて計画、調整、実行するための柔軟なシステムを構築できるよう支援します。AirtableがAIを搭載したプラットフォームを拡大するにつれ、Milvusのようなテクノロジーは、より迅速でスマートな製品体験を提供するために必要な検索インフラを強化する上で重要な役割を果たします。</p>
