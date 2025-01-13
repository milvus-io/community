---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: MilvusとNVIDIA Merlinを用いた推薦ワークフローにおける効率的なベクトル類似度検索
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: レコメンダーシステム構築におけるNVIDIA MerlinとMilvusの統合の紹介と、様々なシナリオにおける性能のベンチマーク。
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>この投稿は、<a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">NVIDIA MerlinのMediumチャンネルに</a>掲載されたものを、許可を得て編集し、ここに再掲載したものです。この投稿は、NVIDIAの<a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkayaと</a> <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a>、Zillizの<a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayerと</a> <a href="https://github.com/liliu-z">Liuの</a>共同執筆によるものです。</em></p>
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>最新のレコメンダーシステム（Recsys）は、検索、フィルタリング、ランキング、関連アイテムのスコアリングのために、データの取り込み、データの前処理、モデルのトレーニング、ハイパーパラメータのチューニングなどの複数の段階を含むトレーニング／推論パイプラインで構成されている。レコメンダーシステムパイプラインの重要なコンポーネントは、特に大規模なアイテムカタログが存在する場合、ユーザーに最も関連するものの検索または発見である。このステップでは、一般的に、ユーザーと製品/サービス間の相互作用について学習するディープラーニングモデルから作成された、製品およびユーザー属性の低次元ベクトル表現（すなわちエンベッディング）のインデックス付きデータベースに対する<a href="https://zilliz.com/glossary/anns">近似最近傍（ANN）</a>検索が行われます。</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlinは</a>、あらゆる規模で推奨を行うエンドツーエンドのモデルをトレーニングするために開発されたオープンソースのフレームワークで、効率的な<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベースの</a>インデックスと検索フレームワークと統合されています。そのようなフレームワークの1つとして最近注目を集めているのが、<a href="https://zilliz.com/">Zillizによって</a>作成されたオープンソースのベクトルデータベースである<a href="https://zilliz.com/what-is-milvus">Milvus</a>です。高速なインデックスとクエリ機能を提供する。Milvusは最近、AIワークフローを維持するためにNVIDIA GPUを使用する<a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">GPUアクセラレーションサポートを</a>追加した。GPUアクセラレーションのサポートは素晴らしいニュースです。なぜなら、加速されたベクトル検索ライブラリーは、高速な同時クエリーを可能にし、開発者が多くの同時リクエストを期待している今日のレコメンダー・システムにおけるレイテンシー要件にプラスの影響を与えるからです。Milvusは、5M以上のdocker pull、GitHub上の〜23kスター（2023年9月現在）、5,000以上のエンタープライズ顧客、多くのアプリケーションのコアコンポーネント（使用<a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">例を</a>参照）を持っています。</p>
<p>このブログでは、MilvusがMerlin Recsysフレームワークとトレーニングおよび推論時にどのように連携するかを示します。Milvusがアイテム検索段階で、非常に効率的なトップkベクトル埋め込み検索によりMerlinをどのように補完し、推論時にNVIDIA Triton Inference Server (TIS)とどのように使用できるかを示します（図1参照）。<strong>我々のベンチマークの結果は、Merlin Modelsによって生成されたベクトル埋め込みとNVIDIA RAFTを使用したGPUアクセラレーションによるMilvusで、37倍から91倍という驚くべきスピードアップを示しています。</strong>MerlinとMilvusの統合を示すために使用したコードと詳細なベンチマーク結果、およびベンチマーク研究を促進した<a href="https://github.com/zilliztech/VectorDBBench">ライブラリは</a>、こちらから入手できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図1.Milvusフレームワークが検索ステージに貢献する多段階推薦システム。元の多段階図の出典：この<a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">ブログ記事</a>。</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">レコメンダーが直面する課題<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>レコメンダーのマルチステージの性質と、それらが統合された様々なコンポーネントやライブラリの利用可能性を考えると、重要な課題はエンドツーエンドのパイプラインで全てのコンポーネントをシームレスに統合することである。私たちのノートブックの例では、統合がより少ない労力でできることを示すことを目指しています。</p>
<p>レコメンダーワークフローのもう一つの課題は、特定のパイプライン部分を高速化することである。GPUは大規模なニューラルネットワークのトレーニングに大きな役割を果たすことは知られているが、ベクターデータベースやANN検索に追加されたのはごく最近のことだ。電子商取引の商品在庫やストリーミング・メディア・データベースのサイズが大きくなり、これらのサービスを利用するユーザー数が増加するにつれて、CPUはRecsysワークフローで何百万人ものユーザーに対応するために必要なパフォーマンスを提供しなければなりません。この課題に対処するために、他のパイプライン部分でGPUアクセラレーションが必要になりました。このブログのソリューションでは、GPUを使用した場合にANN検索が効率的であることを示すことで、この課題に対処しています。</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">ソリューションのための技術スタック<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、私たちの作業を行うために必要な基礎知識をいくつか確認することから始めましょう。</p>
<ul>
<li><p>NVIDIA<a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: NVIDIA GPU上でレコメンダーを高速化する高レベルAPIを持つオープンソースライブラリ。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>：入力された表形式データの前処理と特徴エンジニアリング。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: ディープラーニングモデルを学習し、今回はユーザーとの対話データからユーザーとアイテムの埋め込みベクトルを学習します。</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: TensorFlowベースのレコメンデーションモデルと他の要素（例えば、特徴ストア、MilvusによるANN検索）を組み合わせ、TISで提供する。</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: ユーザの特徴ベクトルが渡され、商品の推薦が生成される推論ステージ用。</p></li>
<li><p>コンテナ化：上記のすべては、NVIDIAが<a href="https://catalog.ngc.nvidia.com/">NGCカタログで</a>提供しているコンテナを介して利用できる。我々は、<a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">ここで</a>入手可能なMerlin TensorFlow 23.06コンテナを使用した。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>：GPUアクセラレーションによるベクトルインデキシングとクエリ。</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>：上記と同じだが、CPUで実行するためのもの。</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: Milvusサーバーへの接続、ベクトルデータベースインデックスの作成、Pythonインターフェースによるクエリの実行。</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>：エンドツーエンドのRecSysパイプラインの一部として、ユーザーとアイテムの属性を（オープンソースの）フィーチャストアに保存し、取得する。</p></li>
</ul>
<p>また、いくつかの基礎となるライブラリやフレームワークも使用されています。例えば、Merlinは、<a href="https://github.com/rapidsai/cudf">RAPIDS cuDFで</a>利用可能なcuDFやDaskなどのNVIDIAライブラリに依存しています。同様に、Milvusは、GPUアクセラレーション上のプリミティブのために<a href="https://github.com/rapidsai/raft">NVIDIA RAFTに</a>依存し、検索のために<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSWや</a> <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISSの</a>ような修正されたライブラリに依存しています。</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">ベクトルデータベースとMilvusの理解<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">近似最近傍（ANN</a>）は、リレーショナルデータベースでは扱えない機能である。リレーショナルデータベースは、あらかじめ定義された構造と直接比較可能な値を持つ表形式のデータを扱うように設計されている。リレーショナルデータベースのインデックスは、データを比較し、それぞれの値が他の値より小さいか大きいかを知ることを利用した構造を作成するために、これに依存しています。埋め込みベクトルは、ベクトル内の各値が何を表しているかを知る必要があるため、この方法で直接比較することはできません。一方のベクトルが他方のベクトルより必ずしも小さいかどうかは言えないのだ。唯一できることは、2つのベクトル間の距離を計算することだ。2つのベクトル間の距離が小さければ、それらが表す特徴は似ていると推測でき、大きければ、それらが表すデータはより異なっていると推測できる。しかし、このような効率的なインデックスにはコストがかかります。2つのベクトル間の距離を計算するには計算コストがかかり、ベクトルインデックスは容易に適応できず、時には変更できないこともあります。この2つの制限のために、これらのインデックスを統合することはリレーショナルデータベースではより複雑であり、そのために<a href="https://zilliz.com/blog/what-is-a-real-vector-database">専用のベクトルデータベースが</a>必要とされているのです。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvusは</a>、リレーショナルデータベースがベクターで直面する問題を解決するために作られ、これらの埋め込みベクターとそのインデックスを大規模に扱うために一から設計されました。クラウドネイティブのバッジを満たすために、Milvusはコンピューティングとストレージ、そしてクエリ、データ管理、インデックス作成といった異なるコンピューティングタスクを分離している。ユーザーは、データ挿入が多い場合でも、検索が多い場合でも、他のユースケースに対応できるように各データベース部分を拡張することができる。挿入リクエストが大量に発生した場合、ユーザーはインデックスノードを一時的に水平方向と垂直方向に拡張して、取り込みを処理することができる。同様に、データのインジェストはないが検索が多い場合、ユーザーはインデックスノードを減らし、代わりにクエリノードをスケールアップしてスループットを向上させることができます。このシステム設計（図2参照）では、並列コンピューティングの考え方で考える必要があり、その結果、さらなる最適化のための多くの扉を開いた、コンピューティングに最適化されたシステムが出来上がりました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図2.Milvusのシステムデザイン</em></p>
<p>Milvusはまた、ユーザがシステムをできるだけカスタマイズできるように、多くの最先端のインデックスライブラリを使用している。CRUD操作、ストリーム・データ、フィルタリングを処理する機能を追加することで、これらを改良している。後ほど、これらのインデックスがどのように異なるのか、それぞれの長所と短所について説明します。</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">ソリューション例：MilvusとMerlinの統合<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>ここで紹介するソリューション例は、アイテム検索段階（ANN検索により最も関連性の高いk個のアイテムが検索される段階）におけるMilvusとMerlinの統合を示している。後述する<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSysチャレンジの</a>実際のデータセットを使用する。我々は、ユーザーとアイテムのベクトル埋め込みを学習する2タワー深層学習モデルを訓練する。このセクションはまた、収集するメトリクスや使用するパラメータの範囲など、我々のベンチマーク作業の青写真を提供する。</p>
<p>我々のアプローチには以下が含まれる：</p>
<ul>
<li><p>データの取り込みと前処理</p></li>
<li><p>ツータワー・ディープラーニング・モデルのトレーニング</p></li>
<li><p>Milvusインデックス構築</p></li>
<li><p>Milvus類似性検索</p></li>
</ul>
<p>各ステップについて簡単に説明し、詳細については我々の<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">ノートブックを</a>参照されたい。</p>
<h3 id="Dataset" class="common-anchor-header">データセット</h3><p>YOOCHOOSE GmbHは、この統合とベンチマーク研究で使用するデータセットを<a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 2015チャレンジの</a>ために提供しており、Kaggleで入手可能である。これは、セッションID、タイムスタンプ、クリック/購入に関連するアイテムID、アイテムカテゴリなどの属性を持つ、ヨーロッパのオンライン小売業者からのユーザーのクリック/購入イベントを含み、yoochoose-clicks.datファイルで利用可能です。セッションは独立しており、リピーターユーザーを示唆するものはないので、各セッションを別個のユーザーのものとして扱う。データセットには9,249,729のユニークなセッション（ユーザー）と52,739のユニークなアイテムがある。</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">データの取り込みと前処理</h3><p>データの前処理に使用するツールは<a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabularで</a>、MerlinのGPUアクセラレートされた、非常にスケーラブルな特徴エンジニアリングと前処理コンポーネントである。NVTabularを使用して、データをGPUメモリに読み込み、必要に応じて特徴を並べ替え、パーケットファイルにエクスポートし、トレーニング用にトレーニングと検証の分割を作成します。この結果、7,305,761のユニークユーザーと49,008のユニークアイテムが訓練対象となりました。また、各列とその値を整数値に分類する。これでデータセットは2タワーモデルでトレーニングする準備が整いました。</p>
<h3 id="Model-training" class="common-anchor-header">モデルのトレーニング</h3><p><a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a>ディープラーニングモデルを使用して、ユーザーとアイテムの埋め込みデータを生成します。モデルをトレーニングした後、学習したユーザーとアイテムの埋め込みを抽出することができます。</p>
<p>次の2つのステップはオプションである。推薦のために検索されたアイテムをランク付けするために学習された<a href="https://arxiv.org/abs/1906.00091">DLRM</a>モデルと、ユーザーとアイテムの特徴を保存し検索するために使用される特徴ストア（この場合は<a href="https://github.com/feast-dev/feast">Feast</a>）である。マルチステージワークフローの完成度を高めるために、これらを含める。</p>
<p>最後に、ユーザとアイテムのエンベッディングをparquetファイルにエクスポートし、後でMilvusベクトルインデックスを作成するために再ロードできるようにする。</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Milvusインデックスの構築とクエリ</h3><p>Milvusは推論マシン上で起動される "サーバ "を介して、ベクトルインデックスの作成と類似度検索を容易にします。ノートブック#2では、MilvusサーバーとPymilvusをpip-installし、デフォルトのリスニングポートでサーバーを起動する。次に、単純なインデックス(IVF_FLAT)を構築し、<code translate="no">setup_milvus</code> と<code translate="no">query_milvus</code> の関数を用いてクエリを実行する。</p>
<h2 id="Benchmarking" class="common-anchor-header">ベンチマーク<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのような高速で効率的なベクトルインデックス/検索ライブラリを使用するケースを実証するために、2つのベンチマークを設計しました。</p>
<ol>
<li><p>Milvusを使って、我々が生成した2組の埋込みデータを使ってベクトルインデックスを構築する：1)7.3Mユニークユーザのユーザ埋め込み（85%学習セット（インデックス作成用）と15%テストセット（クエリ用）に分割）、2)4.9万商品のアイテム埋め込み（学習とテストは半々に分割）。このベンチマークは各ベクトルデータセットに対して独立して行われ、結果は別々に報告される。</p></li>
<li><p>Milvusを使用して49Kのアイテム埋め込みデータセットのベクトルインデックスを構築し、このインデックスに対して7.3Mのユニークユーザーをクエリして類似性検索を行う。</p></li>
</ol>
<p>これらのベンチマークでは、GPUとCPU上で実行されるIVFPQとHNSWインデックス作成アルゴリズムを、様々なパラメータの組み合わせと共に使用した。詳細は<a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">こちら</a>。</p>
<p>検索品質とスループットのトレードオフは、特に本番環境では重要な性能検討事項です。Milvusでは、インデックス作成パラメータを完全に制御することができ、与えられたユースケースに対してこのトレードオフを検討し、グランドトゥルースでより良い検索結果を得ることができます。これは、スループット率や1秒あたりのクエリー数（QPS）の減少という形で、計算コストの増加を意味するかもしれない。我々はANN検索の品質をリコール指標で測定し、トレードオフを示すQPS-リコール曲線を提供する。そして、ビジネスケースの計算リソースやレイテンシ/スループット要件を考慮して、許容可能な検索品質レベルを決定することができる。</p>
<p>また、我々のベンチマークで使用されているクエリーバッチサイズ（nq）にも注目してほしい。これは、複数の同時リクエストが推論に送信されるワークフロー（例えば、電子メールの受信者リストにリクエストされ送信されるオフライン推薦や、到着した同時リクエストをプールして一度に処理することで作成されるオンライン推薦）で有用である。ユースケースによっては、TISはこれらのリクエストをバッチ処理することもできます。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p>Milvusによって実装されたHNSW（CPUのみ）とIVF_PQ（CPUとGPU）インデックスタイプを使用して、CPUとGPUの両方で3つのベンチマークセットの結果を報告する。</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">アイテム対アイテムのベクトル類似探索</h4><p>この最小のデータセットでは、与えられたパラメータの組み合わせに対する各実行は、アイテムベクトルの50％をクエリベクトルとして取り、残りのものから上位100個の類似ベクトルをクエリする。HNSWとIVF_PQは、それぞれ0.958-1.0と0.665-0.997の範囲で、テストしたパラメータ設定で高いリコールが得られた。この結果は、HNSWがリコールに関してより優れた性能を発揮することを示唆しているが、小さなnlist設定のIVF_PQは、非常に同等のリコールを生成する。また、想起値はインデックス作成とクエリーパラメータによって大きく変化する可能性があることに注意すべきである。我々が報告する値は、一般的なパラメータ範囲での予備実験と、選択されたサブセットへの更なるズーミングの後に得られたものである。</p>
<p>与えられたパラメーターの組み合わせに対して、HNSWを使用した場合、CPUで全てのクエリーを実行する合計時間は5.22秒から5.33秒の間（mが大きくなるにつれて速くなり、efでは比較的変わらない）、IVF_PQを使用した場合は13.67秒から14.67秒の間（nlistとnprobeが大きくなるにつれて遅くなる）である。図3に見られるように、GPUアクセラレーションには顕著な効果があります。</p>
<p>図3は、IVF_PQを使用し、この小さなデータセットをCPUとGPUで実行した場合のリコール・スループットのトレードオフを示しています。GPUでは、テストしたすべてのパラメータの組み合わせにおいて、4倍から15倍のスピードアップが得られることがわかります（nprobeが大きくなるほど、スピードアップは大きくなります）。これは、各パラメータの組み合わせについて、GPUによるQPSとCPUによる実行のQPSの比を取ることによって計算されます。全体として、このセットはCPUまたはGPUにとってほとんど課題がなく、後述するように、より大きなデータセットでさらなる高速化が期待できます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図3.NVIDIA A100 GPU上で動作するMilvus IVF_PQアルゴリズムによるGPU高速化（アイテム-アイテム類似検索）</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">ユーザ対ユーザのベクトル類似性検索</h4><p>より大きな2つ目のデータセット（7.3Mユーザ）を用いて、85%（～6.2M）のベクトルを "train"（インデックス化されるベクトル集合）として確保し、残りの15%（～1.1M）を "test "またはクエリベクトル集合として確保した。この場合、HNSWとIVF_PQは、それぞれ0.884-1.0と0.922-0.999のリコール値で、非常に優れた性能を発揮する。しかし、これらは計算負荷が高く、特にIVF_PQはCPUでの計算負荷が高い。これらのクエリ時間は1.1Mベクトルに対する累積クエリ時間であり、インデックスに対する単一のクエリは非常に高速であると言えます。</p>
<p>しかし、推論サーバーが数百万アイテムのインベントリに対してクエリーを実行するために何千もの同時リクエストを想定している場合、CPUベースのクエリーは実行不可能かもしれません。</p>
<p>図4に示すように、A100 GPUは、IVF_PQのすべてのパラメータの組み合わせにおいて、スループット（QPS）において37倍から91倍（平均76.1倍）という驚異的なスピードアップを実現しました。これは小規模なデータセットで観測された結果と一致しており、数百万の埋め込みベクトルを持つMilvusを使用してGPUの性能が合理的にスケールすることを示唆しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図4.NVIDIA A100 GPU上で実行されるMilvus IVF_PQアルゴリズムによるGPUスピードアップ（ユーザとユーザの類似検索）</em></p>
<p>次の詳細な図5は、IVF_PQを使用してCPUとGPUでテストしたすべてのパラメータの組み合わせの再現率とQPSのトレードオフを示しています。このグラフの各ポイントセット（上は GPU、下は CPU）は、ベクトルインデックス/クエリパラメータを変更したときに、スループットの低下を犠牲にして、より高いリコールを達成するために直面するトレードオフを表しています。GPUの場合、より高いリコールレベルを達成しようとすると、QPSがかなり低下することに注意してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図5.IVF_PQを用いてCPUとGPUでテストしたすべてのパラメータの組み合わせにおけるリコールとスループットのトレードオフ（ユーザー対ユーザー）</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">ユーザー対アイテム ベクトル類似探索</h4><p>最後に、ユーザーベクトルがアイテムベクトルに対してクエリされる、もう1つの現実的なユースケースを考えます（上記のノートブック01で示したとおり）。この場合、49Kのアイテムベクトルがインデックス化され、7.3Mのユーザベクトルがそれぞれ上位100の最も類似したアイテムに対してクエリされます。</p>
<p>HNSWでもIVF_PQでも、CPUでは49Kアイテムのインデックスに対して7.3Mを1000バッチでクエリするのは時間がかかるようです。GPUの方がこのケースをうまく処理できるようです（図6参照）。CPU上でnlist = 100のときのIVF_PQによる最高精度レベルは、平均で約86分で計算されるが、nprobe値が大きくなるにつれて大きく変化する（nprobe = 5のときは51分、nprobe = 20のときは128分）。NVIDIA A100 GPUは、性能を4倍から17倍と大幅に高速化します（nprobeが大きくなるほど高速化）。IVF_PQ アルゴリズムは、その量子化技術によってメモリフットプリントを削減し、GPU アクセラレーションと組み合わせて計算実行可能な ANN 探索ソリューションを提供することも覚えておいてください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図6.NVIDIA A100 GPU上で動作するMilvus IVF_PQアルゴリズムによるGPU高速化（ユーザー項目の類似性検索）</em></p>
<p>図5と同様に、IVF_PQでテストしたすべてのパラメータの組み合わせについて、リコール-スループットのトレードオフを図7に示します。ここでも、スループットを向上させるために、ANN 検索の精度を若干あきらめる必要があることがわかりますが、特に GPU で実行した場合、その差はかなり小さくなっています。このことは、GPUを使用することで、高い想起を達成しながら、比較的一貫して高いレベルの計算性能が期待できることを示唆しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図7.IVF_PQを用いてCPUとGPUでテストしたすべてのパラメータの組み合わせにおけるリコールとスループットのトレードオフ（ユーザー対アイテム）</em></p>
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
    </button></h2><p>ここまで来たのであれば、私たちは喜んで結論を述べたいと思います。現代のRecsysの複雑さとマルチステージの性質は、すべてのステップでパフォーマンスと効率を必要とすることを忘れないでください。このブログが、RecSysパイプラインで2つの重要な機能の使用を検討する説得力のある理由を与えてくれることを願っています：</p>
<ul>
<li><p>NVIDIA MerlinのMerlin Systemsライブラリにより、効率的なGPU加速ベクトル検索エンジンである<a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvusを</a>簡単にプラグインすることができます。</p></li>
<li><p>GPUを使用して、ベクトルデータベースインデキシングの計算を加速し、<a href="https://github.com/rapidsai/raft">RAPIDS RAFTの</a>ような技術でANN検索を行います。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これらの知見から、今回発表されたMerlinとmilvusの統合は、学習と推論のための他の選択肢よりもはるかに複雑でなく、高い性能を持つことが示唆される。また、両フレームワークは活発に開発されており、多くの新機能（例えば、Milvusによる新しいGPU加速ベクトルデータベースインデックス）がリリース毎に追加されている。ベクトル類似性検索は、コンピュータビジョン、大規模言語モデリング、推薦システムなど、様々なワークフローにおいて極めて重要な要素であるという事実が、この努力をより価値のあるものにしている。</p>
<p>最後に、本作品とブログ記事の作成にご尽力いただいたMilvus、Merlin、RAFTチームの皆様に感謝申し上げます。MerlinとMilvusをRecsysやその他のワークフローに導入する機会がありましたら、ぜひご連絡ください。</p>
