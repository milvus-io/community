---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: Milvus2.4を発表：マルチベクトル探索、スパースベクトル、CAGRAインデックスなど！
author: Fendy Feng
date: 2024-3-20
desc: Milvus 2.4は、大規模データセットの検索機能を強化する大きな進歩です。
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>この度、大規模データセットの検索機能を強化したMilvus 2.4をリリースいたしました。この最新リリースでは、GPUベースのCAGRAインデックスのサポート、<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">スパース埋込みの</a>ベータサポート、グループ検索、その他様々な検索機能の改善などの新機能が追加されています。これらの開発は、ベクトル・データの処理とクエリのための強力で効率的なツールを開発者に提供することで、コミュニティに対する我々のコミットメントを強化するものです。それでは、Milvus 2.4の主な利点をご紹介しましょう。</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">簡素化されたマルチモーダル検索のためのマルチベクトル検索が可能に<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4では、マルチベクトル検索機能が搭載され、同じMilvusシステム内で異なるベクトルタイプの同時検索と再ランク付けが可能になりました。この機能により、マルチモーダル検索が合理化され、想起率が大幅に向上し、開発者は様々なデータタイプを持つ複雑なAIアプリケーションを容易に管理できるようになります。さらに、この機能はカスタム再ランクモデルの統合と微調整を簡素化し、多次元データからの洞察を利用する正確な<a href="https://zilliz.com/vector-database-use-cases/recommender-system">推奨システムの</a>ような高度な検索機能の作成を支援します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>ミルティベクトル検索機能の仕組み</span> </span></p>
<p>Milvusにおけるマルチベクトルのサポートには2つの要素があります：</p>
<ol>
<li><p>コレクション内の1つのエンティティに対して複数のベクトルを保存/照会する機能。</p></li>
<li><p>Milvusにあらかじめ組み込まれているリランキングアルゴリズムを活用し、リランキングアルゴリズムを構築/最適化する機能。</p></li>
</ol>
<p><a href="https://github.com/milvus-io/milvus/issues/25639">要望の多かった機能</a>であることに加え、GPT-4とクロード3のリリースにより業界がマルチモーダルモデルに移行しつつあるため、この機能を構築しました。再ランク付けは、検索におけるクエリのパフォーマンスをさらに向上させるために一般的に使用されているテクニックです。開発者がMilvusエコシステム内で簡単にリランカーを構築し、最適化できるようにすることを目指しました。</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">グループ化検索のサポートによる計算効率の向上<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>グループ化検索は、Milvus 2.4で追加されたもう一つの<a href="https://github.com/milvus-io/milvus/issues/25343">要望の多かった機能</a>です。BOOL型、INT型、VARCHAR型のフィールド用に設計されたグループ化操作を統合し、大規模なグループ化クエリを実行する際の重要な効率性のギャップを埋めています。</p>
<p>従来、開発者は、大規模なTop-K検索と、グループ固有の結果を抽出するための手作業による後処理に頼っていました。Grouping Searchは、クエリの結果を文書名やビデオ名などの集合的なグループ識別子に効率的にリンクすることで、このプロセスを改良し、大規模なデータセット内のセグメント化されたエンティティの取り扱いを効率化します。</p>
<p>Milvusは、イテレータベースの実装によりGrouping Searchを差別化し、類似のテクノロジーと比較して計算効率を著しく向上させています。この選択により、特に計算リソースの最適化が最優先される本番環境において、優れたパフォーマンスのスケーラビリティが保証されます。データトラバーサルと計算オーバーヘッドを削減することで、Milvusはより効率的なクエリ処理をサポートし、他のベクトルデータベースと比較してレスポンスタイムと運用コストを大幅に削減します。</p>
<p>グループ化検索は、大量の複雑なクエリを管理するMilvusの能力を強化し、堅牢なデータ管理ソリューションのためのハイパフォーマンス・コンピューティングの実践に合致します。</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">スパースベクトル埋め込みのベータサポート<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">スパース埋め込みは</a>、従来の密なベクトルアプローチからのパラダイムシフトであり、単なるキーワード頻度ではなく、意味的類似性のニュアンスに対応します。この違いにより、クエリとドキュメントの意味的内容に密接に沿った、よりニュアンスのある検索機能が可能になります。情報検索や自然言語処理で特に有用なスパースベクトルモデルは、密なモデルと比較して、強力な領域外検索機能と解釈可能性を提供する。</p>
<p>Milvus 2.4では、SPLADEv2のような高度なニューラルモデルやBM25のような統計モデルによって生成されたスパース埋め込みを含むようにハイブリッド検索を拡張しました。Milvusでは、スパースベクトルは密なベクトルと同等に扱われ、スパースベクトルフィールドを持つコレクションの作成、データの挿入、インデックスの構築、類似検索の実行が可能です。特に、Milvusのスパース埋め込みは、<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">内積</a>（IP）距離メトリックをサポートしており、高次元の性質上、他のメトリックが有効でないことを考えると有利です。この機能は、次元が符号なし32ビット整数、値が32ビット浮動小数点であるデータ型もサポートしているため、微妙なテキスト検索から精巧な<a href="https://zilliz.com/learn/information-retrieval-metrics">情報検索</a>システムまで、幅広い応用が可能です。</p>
<p>この新機能により、Milvusはキーワードと埋め込みベースの技術を融合させたハイブリッド検索手法を可能にし、包括的でメンテナンスの少ないソリューションを求めるキーワード中心の検索フレームワークから移行するユーザーにシームレスな移行を提供します。</p>
<p>私たちは、この機能のパフォーマンステストを継続し、コミュニティからのフィードバックを収集するために、この機能を「ベータ」と表示しています。スパースベクトルサポートの一般提供（GA）は、Milvus 3.0のリリース時に予定されています。</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">高度なGPU加速グラフインデキシングのためのCAGRAインデックスサポート<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIAによって開発された<a href="https://arxiv.org/abs/2308.15136">CAGRA</a>(Cuda Anns GRAph-based)は、GPUベースのグラフインデキシング技術であり、特に高スループット環境において、HNSWインデックスのような従来のCPUベースの手法を効率とパフォーマンスで大幅に凌駕します。</p>
<p>CAGRAインデックスの導入により、Milvus 2.4はGPUアクセラレーションによるグラフインデックス作成機能を強化しました。この機能強化は、最小限のレイテンシを必要とする類似検索アプリケーションの構築に最適です。さらに、Milvus 2.4はCAGRAインデックスとブルートフォース検索を統合することで、アプリケーションの最大再現率を実現します。詳細については、<a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">CAGRAの紹介ブログを</a>ご覧ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRAとMilvus HNSWの比較</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">その他の機能強化<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4では、<a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">メタデータフィルタリングにおける</a>部分文字列のマッチングを強化するための正規表現のサポート、スカラーデータタイプのフィルタリングを効率的に行うための新しいスカラー転置インデックス、Milvusコレクションの変更を監視し複製するための変更データキャプチャツールなど、その他の重要な機能強化も含まれています。これらのアップデートにより、Milvusのパフォーマンスと汎用性が強化され、複雑なデータ操作のための包括的なソリューションとなりました。</p>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md">Milvus 2.4のドキュメントを</a>ご覧ください。</p>
<h2 id="Stay-Connected" class="common-anchor-header">つながりを保つ<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4についてもっと知りたいですか？Zillizのエンジニアリング担当副社長であるJames Luanがこの最新リリースの機能について詳しく説明する<a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">ウェビナーにご参加ください</a>。ご質問やご意見がございましたら、当社の<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>参加して、当社のエンジニアやコミュニティメンバーと交流してください。Milvusに関する最新ニュースやアップデートについては、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInでの</a>フォローをお忘れなく。</p>
