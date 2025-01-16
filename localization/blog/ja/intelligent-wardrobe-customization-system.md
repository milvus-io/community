---
id: intelligent-wardrobe-customization-system.md
title: Milvus Vector Databaseを活用したインテリジェントなワードローブカスタマイズシステムの構築
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: 類似検索技術を使って、タンスやその部品のような非構造化データの可能性を解き放つ！
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<p>寝室やフィッティングルームにぴったり合うワードローブを探しているなら、ほとんどの人がオーダーメイドのものを思い浮かべるに違いない。しかし、誰もがそこまで予算を伸ばせるわけではありません。では、既製品はどうだろう？このタイプのワードローブの問題点は、あなた独自の収納ニーズに応えるだけの柔軟性がないため、あなたの期待を下回る可能性が非常に高いということです。さらに、ネットで検索する場合、キーワードで探しているワードローブのタイプを要約するのはかなり困難です。検索ボックスに入力したキーワード（例：ジュエリートレー付きワードローブ）と、検索エンジンで定義されたキーワード（例：<a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">インサート付き引き出し式トレー</a>付きワードローブ）は、まったく異なる可能性が高いのです。</p>
<p>しかし、新たなテクノロジーのおかげで、解決策がある！家具小売コングロマリットであるIKEAは、人気のデザインツール<a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAXワードローブを</a>提供しており、ユーザーは既製品のワードローブの中から好きなものを選び、色やサイズ、インテリアデザインをカスタマイズすることができる。吊り下げスペースが必要でも、複数の棚が必要でも、内部の引き出しが必要でも、このインテリジェントなワードローブ・カスタマイズ・システムはいつでもあなたのニーズに応えることができる。</p>
<p>このスマートなワードローブデザインシステムを使って、理想的なワードローブを見つけたり、作ったりするには、以下のことが必要です：</p>
<ol>
<li>ワードローブの形状（ノーマル、L字型、U字型）、長さ、奥行きなどの基本的な条件を指定します。</li>
<li>収納の必要性とワードローブ内部の構成（例：吊り下げスペース、引き出し式パンツラックなどが必要）を指定します。</li>
<li>引き出しや棚など、ワードローブのパーツを追加または削除します。</li>
</ol>
<p>これでデザインは完成です。シンプルで簡単です！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>パックス・システム</span> </span></p>
<p>このようなワードローブデザインシステムを可能にする非常に重要なコンポーネントは、<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベース</a>です。そこでこの記事では、ベクトル類似検索を利用したインテリジェントなワードローブカスタマイズシステムを構築するために使用されるワークフローと類似検索ソリューションを紹介する。</p>
<p>ジャンプ</p>
<ul>
<li><a href="#System-overview">システム概要</a></li>
<li><a href="#Data-flow">データフロー</a></li>
<li><a href="#System-demo">システムデモ</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">システム概要<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>このようなスマートなワードローブ・カスタマイズ・ツールを提供するためには、まずビジネス・ロジックを定義し、アイテムの属性とユーザー・ジャーニーを理解する必要があります。ワードローブは、引き出し、トレイ、ラックなどのコンポーネントとともに、すべて非構造化データです。そのため、第二段階として、AIアルゴリズムやルール、事前知識、アイテムの説明などを活用し、非構造化データをコンピューターが理解できるデータ、つまりベクトルに変換します！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>カスタマイズツールの概要</span> </span></p>
<p>生成されたベクトルを処理するには、強力なベクトル・データベースと検索エンジンが必要です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>ツール・アーキテクチャ</span> </span></p>
<p>カスタマイズ・ツールは、最も人気のある検索エンジンとデータベースを活用しています：Elasticsearch、<a href="https://milvus.io/">Milvus</a>、PostgreSQLです。</p>
<h3 id="Why-Milvus" class="common-anchor-header">なぜMilvusなのか？</h3><p>ワードローブコンポーネントには、色、形、内部の構成など、非常に複雑な情報が含まれています。しかし、ワードローブデータをリレーショナルデータベースに保存する従来の方法では、十分とは言い難い。一般的な方法は、埋め込み技術を使用してワードローブをベクトルに変換することです。従って、ベクトル保存と類似性検索のために特別に設計された新しいタイプのデータベースを探す必要がある。いくつかの一般的な解決策を探った結果、優れたパフォーマンス、安定性、互換性、使いやすさを持つ<a href="https://github.com/milvus-io/milvus">Milvus</a>ベクトルデータベースが選ばれた。以下のチャートは、いくつかの一般的なベクトル検索ソリューションの比較です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>ソリューション比較</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">システムワークフロー</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>システムワークフロー</span> </span></p>
<p>Elasticsearchはワードローブサイズ、色などによる粗いフィルタリングに使用されます。次に、フィルタリングされた結果は類似性検索のためにベクトルデータベースのMilvusを通過し、クエリベクトルとの距離/類似性に基づいて結果がランク付けされます。最後に、結果は統合され、ビジネスの洞察に基づいてさらに改良される。</p>
<h2 id="Data-flow" class="common-anchor-header">データの流れ<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>ワードローブ・カスタマイゼーション・システムは、従来の検索エンジンやレコメンダー・システムと非常によく似ている。それには3つの部分がある：</p>
<ul>
<li>データの定義と生成を含むオフラインのデータ準備。</li>
<li>リコールとランキングを含むオンライン・サービス</li>
<li>ビジネス・ロジックに基づくデータの後処理。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>データの流れ</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">オフラインデータフロー</h3><ol>
<li>ビジネス・インサイトを使用してデータを定義します。</li>
<li>事前知識を使用して、さまざまなコンポーネントを組み合わせてワードローブにする方法を定義します。</li>
<li>ワードローブの特徴ラベルを認識し、その特徴を Elasticsearch のデータ<code translate="no">.json</code> ファイルにエンコードする。</li>
<li>非構造化データをベクトルにエンコードしてリコールデータを準備する。</li>
<li>Milvusベクトルデータベースを使用して、前のステップで得られたリコール結果をランク付けする。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>オフラインデータフロー</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">オンラインデータフロー</h3><ol>
<li>ユーザーからのクエリーリクエストを受け取り、ユーザープロファイルを収集する。</li>
<li>ワードローブに対する要求を特定することで、ユーザーのクエリを理解する。</li>
<li>Elasticsearch を使って粗い検索を行う。</li>
<li>Milvusのベクトル類似度の計算に基づいて、粗い検索から得られた結果をスコアリングし、ランク付けする。</li>
<li>最終結果を生成するために、バックエンドプラットフォーム上で結果を後処理し、整理する。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>オンラインデータフロー</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">データの後処理</h3><p>ビジネスロジックは各社様々です。貴社のビジネスロジックを適用することで、結果に最終的なタッチを加えることができます。</p>
<h2 id="System-demo" class="common-anchor-header">システムデモ<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>それでは、構築したシステムが実際にどのように機能するか見てみましょう。</p>
<p>ユーザーインターフェース（UI）は、ワードローブコンポーネントのさまざまな組み合わせの可能性を表示します。</p>
<p>各コンポーネントはその特徴（サイズ、色など）によってラベル付けされ、Elasticsearch（ES）に保存されます。ESにラベルを保存する際、記入すべき主なデータフィールドは4つある：ID、タグ、保存パス、その他のサポート・フィールドです。ESとラベル付けされたデータは、きめ細かい想起と属性フィルタリングに使用される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>ES</span> </span></p>
<p>次に、ワードローブをベクトル・セットにエンコードするために、さまざまなAIアルゴリズムが使用される。ベクトルセットは類似性検索とランキングのためにmilvusに保存される。このステップにより、より洗練された正確な結果が得られる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch、Milvus、その他のシステムコンポーネントは全体としてカスタマイズデザインプラットフォームを形成している。思い起こせば、Elasticsearch と Milvus のドメイン固有言語（DSL）は以下の通りである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>DSL</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">より多くのリソースをお探しですか？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusベクトルデータベースがどのようにしてより多くのAIアプリケーションをパワーアップできるかをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">短編動画プラットフォームLikeeがMilvusを使って重複動画を削除する方法</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Milvusをベースにした写真詐欺検出ツール</a></li>
</ul>
