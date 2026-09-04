---
id: what-is-vector-database-and-how-it-works.md
title: ベクターデータベースとは正確には何か、そしてどのように機能するのか
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: ベクターデータベースは、機械学習モデルによって生成されたベクトル埋め込みを保存・インデックス化・検索し、高速な情報検索と類似性検索を可能にします。
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>ベクターデータベースは、ベクター埋め込みをインデックス化して保存し、高速な検索と類似性検索を実現します。CRUD操作、メタデータフィルタリング、水平スケーリングなどの機能を備え、AIアプリケーション向けに特別に設計されています。</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">はじめに：AI時代におけるベクターデータベースの台頭<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>ImageNetの初期には、データセットに手動でラベルを付けるために25,000人の人間のキュレーターが必要でした。この驚異的な数は、AIにおける根本的な課題を浮き彫りにしています。つまり、非構造化データを手動で分類することには限界があるということです。毎日何十億もの画像、動画、ドキュメント、音声ファイルが生成される中で、コンピューターがコンテンツを理解し、対話する方法にはパラダイムシフトが必要でした。</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">従来のリレーショナルデータベース</a>システムは、事前定義された形式の構造化データを管理し、正確な検索操作を実行することに優れています。対照的に、ベクターデータベースは、ベクター埋め込みとして知られる高次元の数値表現を通じて、画像、音声、動画、テキストコンテンツなどの<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データ</a>タイプの保存と取得に特化しています。ベクターデータベースは、効率的なデータ検索と管理を提供することで<a href="https://zilliz.com/glossary/large-language-models-(llms)">大規模言語モデル</a>をサポートします。最新のベクターデータベースは、ハードウェアを意識した最適化（AVX512、SIMD、GPU、NVMe SSD）、高度に最適化された検索アルゴリズム（HNSW、IVF、DiskANN）、およびカラム指向のストレージ設計により、従来のシステムよりも2〜10倍優れたパフォーマンスを発揮します。そのクラウドネイティブで分離されたアーキテクチャにより、検索、データ挿入、インデックス作成の各コンポーネントを独立してスケーリングでき、Salesforce、PayPal、eBay、NVIDIAなどの企業のエンタープライズAIアプリケーション向けに、パフォーマンスを維持しながら数十億のベクターを効率的に処理できます。</p>
<p>これは、専門家が「セマンティックギャップ」と呼ぶものを表しています。従来のデータベースは完全一致と事前定義された関係に基づいて動作しますが、人間のコンテンツ理解はニュアンスがあり、文脈に依存し、多次元的です。AIアプリケーションが次のものを要求するにつれて、このギャップはますます問題になります：</p>
<ul>
<li><p>完全一致ではなく概念的な類似性を見つけること</p></li>
<li><p>異なるコンテンツ間の文脈上の関係を理解すること</p></li>
<li><p>キーワードを超えた情報の意味的本質を捉えること</p></li>
<li><p>統一されたフレームワーク内でマルチモーダルデータを処理すること</p></li>
</ul>
<p>ベクターデータベースは、このギャップを埋める重要なテクノロジーとして登場し、現代のAIインフラストラクチャの不可欠なコンポーネントになりました。これらは、クラスタリングや分類などのタスクを容易にすることで、機械学習モデルのパフォーマンスを向上させます。</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">ベクター埋め込みを理解する：基礎<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">ベクター埋め込み</a>は、セマンティックギャップを越える重要な架け橋として機能します。これらの高次元の数値表現は、コンピューターが効率的に処理できる形式で非構造化データの意味的本質を捉えます。最新の埋め込みモデルは、テキスト、画像、音声を問わず、生のコンテンツを、表面レベルの違いに関係なく、類似した概念がベクター空間内で互いに近くに集まる密なベクターに変換します。</p>
<p>たとえば、適切に構築された埋め込みは、「automobile」、「car」、「vehicle」などの概念を、語彙形式が異なっていても、ベクター空間内の近接した位置に配置します。この特性により、<a href="https://zilliz.com/glossary/semantic-search">セマンティック検索</a>、<a href="https://zilliz.com/vector-database-use-cases/recommender-system">レコメンデーションシステム</a>、およびAIアプリケーションが、単純なパターンマッチングを超えてコンテンツを理解できるようになります。</p>
<p>埋め込みの力は、モダリティを超えて広がります。高度なベクターデータベースは、テキスト、画像、音声など、さまざまな非構造化データタイプを統合システムでサポートし、これまで効率的にモデル化することが不可能だったクロスモーダル検索と関係を可能にします。これらのベクターデータベース機能は、チャットボットや画像認識システムなどのAI駆動テクノロジーにとって重要であり、セマンティック検索やレコメンデーションシステムなどの高度なアプリケーションをサポートします。</p>
<p>ただし、埋め込みを大規模に保存、インデックス化、取得することは、従来のデータベースでは対応できない独自の計算上の課題を引き起こします。</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">ベクターデータベース：中核となる概念<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースは、非構造化データの保存とクエリの方法におけるパラダイムシフトを表しています。事前定義された形式の構造化データの管理に優れた従来のリレーショナルデータベースシステムとは異なり、ベクターデータベースは、数値ベクター表現を通じて非構造化データの処理に特化しています。</p>
<p>中核となるベクターデータベースは、非構造化データの大規模なデータセット全体で効率的な類似性検索を可能にするという根本的な問題を解決するように設計されています。これらは、次の3つの主要なコンポーネントを通じてこれを実現します：</p>
<p><strong>ベクター埋め込み</strong>：非構造化データ（テキスト、画像、音声など）の意味を捉える高次元の数値表現</p>
<p><strong>特殊なインデックス作成</strong>：高速な近似検索を可能にする高次元ベクター空間に最適化されたアルゴリズム。ベクターデータベースは、ベクターをインデックス化して類似性検索の速度と効率を向上させ、さまざまなMLアルゴリズムを利用してベクター埋め込みにインデックスを作成します。</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>距離メトリクス</strong></a>：ベクター間の類似性を定量化する数学的関数</p>
<p>ベクターデータベースの主要な操作は、<a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k近傍法</a>（KNN）クエリです。これは、特定のクエリベクターに最も類似したk個のベクターを見つけます。大規模なアプリケーションの場合、これらのデータベースは通常、<a href="https://zilliz.com/glossary/anns">近似最近傍</a>（ANN）アルゴリズムを実装し、検索速度の大幅な向上と引き換えに少量の精度を犠牲にします。</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">ベクター類似性の数学的基礎</h3><p>ベクターデータベースを理解するには、ベクター類似性の背後にある数学的原則を把握する必要があります。基本的な概念は次のとおりです：</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">ベクター空間と埋め込み</h3><p><a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">ベクター埋め込み</a>は、非構造化データを数値形式で表す浮動小数点数の固定長配列です（次元は100〜32,768にも及びます！）。これらの埋め込みは、類似したアイテムを高次元のベクター空間内で互いに近くに配置します。</p>
<p>たとえば、「king」と「queen」という単語は、適切にトレーニングされた単語埋め込み空間において、どちらも「automobile」よりも互いに近いベクター表現を持ちます。</p>
<h3 id="Distance-Metrics" class="common-anchor-header">距離メトリクス</h3><p>距離メトリクスの選択は、類似性の計算方法に根本的な影響を与えます。一般的な距離メトリクスは次のとおりです：</p>
<ol>
<li><p><strong>ユークリッド距離</strong>：ユークリッド空間内の2点間の直線距離。</p></li>
<li><p><strong>コサイン類似度</strong>：2つのベクター間の角度のコサインを測定し、大きさではなく方向に焦点を当てます。</p></li>
<li><p><strong>ドット積</strong>：正規化されたベクターの場合、2つのベクターがどの程度整列しているかを表します。</p></li>
<li><p><strong>マンハッタン距離（L1ノルム）</strong>：座標間の絶対差の合計。</p></li>
</ol>
<p>ユースケースが異なれば、必要な距離メトリクスも異なる場合があります。たとえば、コサイン類似度はテキスト埋め込みに適していることが多く、ユークリッド距離は特定のタイプの<a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">画像埋め込み</a>に適している場合があります。</p>
<p>ベクター空間内のベクター間の<a href="https://zilliz.com/glossary/semantic-similarity">セマンティック類似性</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    span
