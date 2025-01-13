---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: ベクターデータベースを最適化し、RAG駆動型生成AIを強化する
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  この記事では、ベクターデータベースとそのベンチマークフレームワーク、さまざまな側面に取り組むためのデータセット、パフォーマンス分析に使用するツールについて詳しく説明します。
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>この投稿は<a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">IntelのMedium Channelに</a>掲載されたもので、許可を得てここに再掲載しています。</em></p>
<p><br></p>
<p>RAG使用時にベクターデータベースを最適化する2つの方法</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>写真：<a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a>on<a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Cathy ZhangとDr. Malini Bhandaruによる寄稿：Lin Yang、Changyan Liu</p>
<p>生成AI（GenAI）モデルは、私たちの日常生活で急激に採用されつつあり、外部ソースから事実をフェッチすることによって応答精度と信頼性を高めるために使用される技術である<a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">検索拡張生成（RAG</a>）によって改善されつつある。RAGは、通常の<a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">大規模言語モデル（LLM）が</a>コンテキストを理解し、ベクトルとして保存された非構造化データの巨大なデータベースを活用することで<a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">幻覚を</a>減らすのを助ける。</p>
<p>RAGは、より多くの文脈情報を取得し、より良い応答を生成するのに役立つが、依拠するベクトル・データベースは、豊富なコンテンツを提供するためにますます大きくなっている。兆パラメータのLLMが目前に迫っているように、数十億のベクトル・データベースもそう遠くはない。最適化エンジニアとして、私たちはベクターデータベースのパフォーマンスを向上させ、データのロードを高速化し、インデックスの作成を高速化することで、新しいデータが追加されても検索速度を確保できないかと考えました。そうすることで、ユーザーの待ち時間を短縮できるだけでなく、RAGベースのAIソリューションをもう少し持続可能なものにすることができます。</p>
<p>この記事では、ベクターデータベースとそのベンチマークフレームワーク、さまざまな側面に取り組むためのデータセット、パフォーマンス分析に使用するツールについて詳しく説明します。また、パフォーマンスと持続可能性に影響を与える最適化の旅でインスピレーションを得るために、人気のある2つのベクトルデータベースソリューションにおける最適化の成果を紹介します。</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">ベクトルデータベースを理解する<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>データが構造化された方法で保存される従来のリレーショナルデータベースや非リレーショナルデータベースとは異なり、ベクトルデータベースには、埋め込み関数または変換関数を使用して構築されたベクトルと呼ばれる個々のデータ項目の数学的表現が含まれます。ベクトルは一般的に特徴や意味的な意味を表し、短くても長くてもよい。ベクトルデータベースは、<a href="https://www.pinecone.io/learn/vector-similarity/">ユークリッド類似度、ドット積類似度、余弦類似度などの</a>距離メトリック（距離が近いほど類似度が高いことを意味する）を用いた類似度検索によってベクトル検索を行う。</p>
<p>検索プロセスを高速化するために、ベクトルデータはインデックス作成メカニズムを使って整理される。これらの構成方法の例としては、フラット構造、<a href="https://arxiv.org/abs/2002.09094">インバーテッド・ファイル（IVF）、</a> <a href="https://arxiv.org/abs/1603.09320">階層的ナビゲーシブル・スモール・ワールド（HNSW）</a>、<a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">ローカリティ・センシティブ・ハッシング（LSH）などが</a>ある。これらの方法はそれぞれ、必要なときに類似したベクトルを取り出す効率性と有効性に貢献している。</p>
<p>GenAIシステムでベクターデータベースをどのように使うかを検証してみよう。図1は、ベクターデータベースへのデータのロードと、GenAIアプリケーションのコンテキストでの使用の両方を示しています。プロンプトを入力すると、データベースでベクトルを生成するのと同じ変換処理が行われます。この変換されたベクトルプロンプトは、ベクトルデータベースから類似のベクトルを検索するために使用されます。これらの検索された項目は、基本的に会話の記憶として機能し、LLMの動作と同様に、プロンプトのコンテキスト履歴を提供する。この機能は、自然言語処理、コンピュータビジョン、レコメンデーションシステムなど、意味理解やデータマッチングを必要とする領域で特に有利である。最初のプロンプトは、その後、検索された要素と「マージ」され、コンテキストが提供され、LLMが元の学習データだけに頼るのではなく、提供されたコンテキストに基づいて応答を策定するのを支援する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図1.RAGアプリケーションのアーキテクチャ。</p>
<p>ベクトルは高速検索のために保存され、インデックスが付けられる。ベクトルデータベースには、ベクトルを格納するために拡張された従来のデータベースと、専用に構築されたベクトルデータベースの2種類がある。ベクトルをサポートする従来のデータベースの例としては、<a href="https://redis.io/">Redis</a>、<a href="https://github.com/pgvector/pgvector">pgvector</a>、<a href="https://www.elastic.co/elasticsearch">Elasticsearch</a>、<a href="https://opensearch.org/">OpenSearchなどが</a>あります。専用のベクターデータベースの例としては、プロプライエタリなソリューションである<a href="https://zilliz.com/">Zillizや</a> <a href="https://www.pinecone.io/">Pinecone</a>、オープンソースプロジェクトである<a href="https://milvus.io/">Milvus</a>、<a href="https://weaviate.io/">Weaviate</a>、<a href="https://qdrant.tech/">Qdrant</a>、<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://www.trychroma.com/">Chromaなどが</a>あります。ベクターデータベースについては、GitHubの<a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChainと </a> <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbookで</a>学ぶことができる。</p>
<p>ここでは、MilvusとRedisというそれぞれのカテゴリーから1つずつ詳しく見ていこう。</p>
<h2 id="Improving-Performance" class="common-anchor-header">パフォーマンスの改善<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>最適化に入る前に、ベクターデータベースがどのように評価されるのか、いくつかの評価フレームワーク、利用可能なパフォーマンス分析ツールについておさらいしましょう。</p>
<h3 id="Performance-Metrics" class="common-anchor-header">パフォーマンス指標</h3><p>ベクターデータベースのパフォーマンス測定に役立つ主なメトリクスを見てみましょう。</p>
<ul>
<li><strong>ロードレイテンシは</strong>、ベクトルデータベースのメモリにデータをロードし、インデックスを構築するのに必要な時間を測定します。インデックスとは、類似性や距離に基づいてベクトルデータを効率的に整理し、検索するために使用されるデータ構造です。<a href="https://milvus.io/docs/index.md#In-memory-Index">インメモリインデックスの</a>種類には、<a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">フラットインデックス</a>、<a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>、<a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ、HNSW</a>、<a href="https://github.com/google-research/google-research/tree/master/scann">スケーラブル最近傍（ScaNN）、</a> <a href="https://milvus.io/docs/disk_index.md">DiskANNなどが</a>あります。</li>
<li><strong>Recallとは</strong>、検索アルゴリズムによって検索された<a href="https://redis.io/docs/data-types/probabilistic/top-k/">上位K個の</a>結果の中で、真の一致、つまり関連する項目が見つかった割合のことである。Recall 値が高いほど、関連アイテムの検索が優れていることを示す。</li>
<li><strong>Queries per second (QPS)</strong>は、ベクトルデータベースが入力されたクエリを処理できる速度である。QPS値が高いほど、クエリ処理能力とシステムスループットが優れていることを意味する。</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">ベンチマークフレームワーク</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図2.ベクトルデータベースベンチマーキングのフレームワーク</p>
<p>ベクトルデータベースのベンチマークには、ベクトルデータベースサーバーとクライアントが必要です。性能テストでは、2つの有名なオープンソースツールを使用した。</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>：</strong>Zillizによって開発され、オープンソース化されたVectorDBBenchは、様々なインデックスタイプを持つ様々なベクトルデータベースのテストを支援し、便利なウェブインターフェースを提供する。</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>：</strong>Qdrantによって開発されオープンソース化されたvector-db-benchmarkは、<a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>インデックスタイプの典型的なベクトルデータベースのテストを支援する。コマンドラインでテストを実行し、<a href="https://docs.docker.com/compose/">Docker Compose</a>__fileを提供してサーバコンポーネントの起動を簡素化します。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図3.ベンチマークテストの実行に使用されるvector-db-benchmarkコマンドの例。</p>
<p>しかし、ベンチマークフレームワークは方程式の一部に過ぎません。大量のデータを扱う能力、さまざまなベクトルサイズ、検索速度など、ベクトル・データベース・ソリューション自体のさまざまな側面を検証するデータが必要です。そこで、利用可能な公開データセットをいくつか見てみましょう。</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">ベクターデータベースを試すための公開データセット</h3><p>大規模なデータセットは、負荷の待ち時間やリソースの割り当てをテストするのに適しています。データセットの中には高次元のデータもあり、類似性の計算速度をテストするのに適しています。</p>
<p>25次元から2048次元までのデータセットがある。オープンな画像コレクションである<a href="https://laion.ai/">LAION</a>データセットは、安定拡散生成モデルのような非常に大規模な視覚・言語ディープニューラルモデルの学習に使用されている。OpenAIのデータセットである5Mベクトル（それぞれ1536次元）は、VectorDBBenchが<a href="https://huggingface.co/datasets/allenai/c4">生データに対して</a>OpenAIを実行することで作成された。各ベクトルの要素がFLOAT型であることを考えると、ベクトルだけを保存するために約29GB（5M * 1536 * 4）のメモリが必要で、さらにインデックスやその他のメタデータを保持するために同程度のメモリが追加され、合計58GBのメモリがテスト用に必要です。vector-db-benchmarkツールを使う場合は、結果を保存するのに十分なディスクストレージを確保する。</p>
<p>ロード・レイテンシーをテストするには、<a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angularが</a>提供する大規模なベクター・コレクションが必要である。インデックス生成と類似度計算のパフォーマンスをテストするためには、高次元のベクトルがより大きなストレスとなる。このため、我々は1536次元ベクトルからなる500Kデータセットを選択した。</p>
<h3 id="Performance-Tools" class="common-anchor-header">パフォーマンス・ツール</h3><p>注目すべきメトリクスを特定するためにシステムにストレスを与える方法について説明したが、より低いレベルで何が起きているかを検証してみよう。これらはデータベースの挙動を知る手がかりとなり、特に問題箇所を特定するのに役立ちます。</p>
<p>Linux の<a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a>ユーティリティはシステム性能情報を提供します。しかし、Linuxの<a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a>ツールはより深い洞察を提供します。詳細については、<a href="https://www.brendangregg.com/perf.html">Linux perf の例</a>や<a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">Intel トップダウン・マイクロアーキテクチャー解析</a>法を読むことをお勧めします。さらにもう1つのツールは<a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profilerで</a>、アプリケーションだけでなく、HPC、クラウド、IoT、メディア、ストレージなど様々なワークロードのシステム性能と構成を最適化する際に役立ちます。</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvusベクター・データベースの最適化<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusベクトルデータベースの性能向上を試みたいくつかの例を見ていきましょう。</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">データノード・バッファ書き込みにおけるメモリ移動オーバーヘッドの削減</h3><p>Milvusの書き込みパスのプロキシは<em>MsgStreamを介して</em>ログブローカにデータを書き込みます。その後、データノードがデータを消費し、セグメントに変換して保存します。セグメントは新しく挿入されたデータをマージします。マージロジックは、古いデータと挿入される新しいデータの両方を保持/移動するために新しいバッファを割り当て、次のデータマージのために新しいバッファを古いデータとして返します。この結果、古いデータは徐々に大きくなり、データ移動が遅くなる。Perf プロファイルでは、このロジックのオーバーヘッドが高いことが示された。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図4.ベクター・データベースにおけるデータのマージと移動は、高いパフォーマンス・オーバーヘッドを発生させる。</p>
<p>私たちは<em>マージ・バッファの</em>ロジックを変更し、挿入する新しいデータを古いデータに直接追加することで、新しいバッファの確保と大きな古いデータの移動を回避しました。Perf プロファイルは、このロジックにオーバーヘッドがないことを確認しています。マイクロコードメトリクスの<em>metric_CPU operating frequency</em>と<em>metric_CPU utilization</em>は、システムが長いメモリ移動を待つ必要がなくなったことと一致する改善を示しています。ロードレイテンシは60％以上改善した。この改善は<a href="https://github.com/milvus-io/milvus/pull/26839">GitHubに</a>掲載されている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図5.コピーを減らすことで、ロード・レイテンシが50パーセント以上改善された。</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">メモリ割り当てのオーバーヘッドを削減した反転インデックス構築</h3><p>Milvusの検索エンジンである<a href="https://milvus.io/docs/knowhere.md">Knowhereは</a>、<a href="https://milvus.io/docs/v1.1.1/index.md">転置ファイル（IVF）インデックスを</a>作成するためのクラスタデータのトレーニングに<a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-meansアルゴリズムを</a>採用しています。データトレーニングの各ラウンドは反復回数を定義します。このカウントが大きいほど、学習結果が良くなります。しかし、これはElkanアルゴリズムがより頻繁に呼び出されることを意味します。</p>
<p>Elkanアルゴリズムは、実行のたびにメモリの確保と解放を行う。具体的には、対角要素を除いた対称行列データの半分のサイズのメモリを確保します。Knowhereでは、Elkanアルゴリズムが使用する対称行列の次元は1024に設定されており、その結果、メモリサイズは約2MBになります。これは、各トレーニングラウンドでElkanが2MBのメモリの確保と解放を繰り返すことを意味します。</p>
<p>Perf プロファイリングデータは、頻繁に大きなメモリ割り当てアクティビティを示していた。実際、<a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">仮想メモリ領域（VMA）の</a>割り当て、物理ページの割り当て、ページマップのセットアップ、カーネル内のメモリcgroup統計の更新がトリガーされました。このような大規模なメモリアロケーション／デアロケーション活動のパターンは、状況によっては、メモリの断片化を悪化させる可能性もある。これは重大な税金である。</p>
<p><em>IndexFlatElkan</em>構造体は、Elkanアルゴリズムをサポートするために特別に設計・構築されています。各データトレーニング処理では、<em>IndexFlatElkan</em>インスタンスが初期化されます。Elkanアルゴリズムにおける頻繁なメモリ割り当てと割り当て解除によるパフォーマンスへの影響を軽減するため、コードロジックをリファクタリングし、Elkanアルゴリズム関数の外側にあるメモリ管理を<em>IndexFlatElkanの</em>構築プロセスに移しました。これにより、メモリ割り当てが初期化フェーズで一度だけ行われ、その後のElkanアルゴリズム関数の呼び出しはすべて現在のデータトレーニングプロセスから行われるようになり、ロードレイテンシが約3%改善されました。<a href="https://github.com/zilliztech/knowhere/pull/280">Knowhereパッチはこちら</a>。</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">ソフトウェア・プリフェッチによるRedisベクトル検索の高速化<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のインメモリ・キーバリュー・データストアとして人気の高いRedisは、最近ベクトル検索のサポートを開始しました。典型的なキー・バリュー・ストアを超えるために、<a href="https://github.com/RediSearch/RediSearch">Redisは</a>拡張モジュールを提供しており、<a href="https://github.com/RediSearch/RediSearch">RediSearch</a>モジュールはRedis内で直接ベクトルの保存と検索を容易にします。</p>
<p>Redisは、ベクトル類似検索のために、ブルートフォースとHNSWという2つのアルゴリズムをサポートしています。HNSWアルゴリズムは、高次元空間の近似最近傍を効率的に見つけるために特別に作られています。<em>candidate_setという</em>優先キューを使って、距離計算のためのすべてのベクトル候補を管理します。</p>
<p>各ベクトル候補は、ベクトルデータに加えて実質的なメタデータを含む。その結果、候補をメモリからロードする際にデータキャッシュのミスが発生し、処理遅延が発生することがある。我々の最適化では、ソフトウェアプリフェッチを導入し、現在の候補を処理中に次の候補をプロアクティブにロードします。この改良により、シングルインスタンスのRedisセットアップにおけるベクトル類似検索のスループットが2～3パーセント向上しました。このパッチは現在アップストリーム化中である。</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">混合アセンブリ・コードのペナルティを防ぐためのGCCデフォルト動作の変更<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>パフォーマンスを最大化するために、頻繁に使用されるコード・セクションはアセンブリで手書きされることが多い。しかし、コードの異なるセグメントが異なる人または異なる時点で書かれた場合、<a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">インテル® Advanced Vector Extensions 512 (インテル® AVX-512)</a>や<a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">ストリーミング SIMD 拡張命令 (SSE)</a> などの互換性のないアセンブリー命令セットが使用されることがあります。適切にコンパイルされないと、混合コードはパフォーマンス・ペナルティになります。<a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">インテル® AVX 命令と SSE 命令の混在については、こちらを参照して</a>ください。</p>
<p>混合モードのアセンブリー・コードを使用していて、<em>VZEROUPPER</em> でコンパイルされておらず、パフォーマンス・ペナルティが発生しているかどうかは簡単に判断できます。これは、<em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;の</em>ようなperfコマンドで確認できます。OSがイベントをサポートしていない場合は、<em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix</em>/を使用してください。</p>
<p>Clangコンパイラーはデフォルトで<em>VZEROUPPERを</em>挿入し、混合モードのペナルティーを回避します。しかし、GCCコンパイラは-O2または-O3コンパイラ・フラグが指定されたときだけ<em>VZEROUPPERを</em>挿入します。我々はGCCチームに連絡し、この問題を説明したところ、現在ではデフォルトで混合モードのアセンブリ・コードを正しく処理するようになった。</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">ベクター・データベースの最適化開始<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースはGenAIにおいて不可欠な役割を果たしており、より高品質な応答を生成するためにますます大きくなっている。最適化に関して、AIアプリケーションは、ベンチマークフレームワークやストレス入力とともに標準的なパフォーマンス分析ツールを使用したときにその秘密が明らかになるという点で、他のソフトウェアアプリケーションと変わりません。</p>
<p>これらのツールを使用して、不要なメモリ割り当て、命令のプリフェッチの失敗、および不正なコンパイラオプションの使用に関連するパフォーマンスの罠を発見しました。この発見に基づいて、Milvus、Knowhere、Redis、およびGCCコンパイラのアップストリーム機能強化を行い、AIのパフォーマンスと持続可能性を少しでも向上させることに貢献した。ベクトル・データベースは、最適化に取り組む価値のある重要なアプリケーション・クラスです。本記事がその一助となれば幸いである。</p>
