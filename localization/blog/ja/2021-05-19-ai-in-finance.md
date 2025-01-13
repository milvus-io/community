---
id: ai-in-.md
title: オープンソースのベクトルデータベースMilvusで金融のAIを加速する
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: Milvusは、チャットボットやレコメンダーシステムなど、金融業界向けのAIアプリケーションの構築に利用できる。
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>オープンソースのベクトルデータベースMilvusで金融のAIを加速する</custom-h1><p>銀行やその他の金融機関は、ビッグデータ処理や分析のためのオープンソースソフトウェアを早くから採用してきた。2010年、モルガン・スタンレーは小規模な実験の一環として、オープンソースのApache Hadoopフレームワークを<a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">使い始めた</a>。同社は、科学者が活用したいと考える大量のデータに対して、従来のデータベースをうまく拡張することに苦労していたため、代替ソリューションを模索することにした。Hadoopは今やモルガン・スタンレーの定番であり、CRMデータの管理からポートフォリオ分析まで、あらゆる業務に役立っている。MySQL、MongoDB、PostgreSQLといったオープンソースのリレーショナル・データベース・ソフトウェアも、金融業界におけるビッグデータの活用に欠かせないツールとなっている。</p>
<p>金融サービス業界に競争力を与えているのはテクノロジーであり、人工知能（AI）は、銀行、資産運用、保険の各分野において、ビッグデータから価値ある洞察を引き出し、リアルタイムで活動を分析するための標準的なアプローチとして急速に普及している。AIアルゴリズムを使って、画像、音声、動画などの非構造化データを機械可読の数値データ形式であるベクトルに変換することで、100万、10億、あるいは1兆という膨大なベクトルデータセットに対して類似検索を実行することが可能になる。ベクトルデータは高次元空間に格納され、類似ベクトルは類似性検索によって発見されるが、これにはベクトルデータベースと呼ばれる専用のインフラが必要である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvusは</a>ベクターデータを管理するために特別に構築されたオープンソースのベクターデータベースであり、エンジニアやデータサイエンティストは基盤となるデータインフラではなく、AIアプリケーションの構築や分析に集中することができる。このプラットフォームは、AIアプリケーション開発ワークフローを中心に構築され、機械学習オペレーション（MLOps）を合理化するために最適化されている。Milvusとその基盤技術の詳細については、当社の<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">ブログを</a>ご覧ください。</p>
<p>金融サービス業界におけるAIの一般的なアプリケーションには、アルゴリズム取引、ポートフォリオ構成と最適化、モデル検証、バックテスト、ロボアドバイス、バーチャルカスタマーアシスタント、マーケットインパクト分析、規制遵守、ストレステストなどがある。この記事では、ベクトルデータが銀行や金融企業にとって最も価値ある資産の一つとして活用されている3つの具体的な分野を取り上げる：</p>
<ol>
<li>銀行チャットボットによる顧客体験の向上</li>
<li>レコメンダー・システムによる金融サービスの販売促進など</li>
<li>セマンティック・テキスト・マイニングによる決算報告書やその他の非構造化金融データの分析</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">バンキング・チャットボットによる顧客体験の向上</h3><p>バンキングチャットボットは、消費者の投資、銀行商品、保険契約の選択を支援することで、顧客体験を向上させることができます。デジタルサービスは、コロナウイルスの流行によって加速した傾向もあり、急速に普及しています。チャットボットは、自然言語処理（NLP）を使用して、ユーザーが送信した質問を意味ベクトルに変換し、一致する回答を検索することで機能します。最新の銀行チャットボットは、ユーザーにパーソナライズされた自然な体験を提供し、会話調で話します。Milvusは、リアルタイムのベクトル類似検索を使用してチャットボットを作成するのに適したデータファブリックを提供します。</p>
<p>詳しくは、<a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">Milvusを使ったチャットボット</a>構築のデモをご覧ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">レコメンダーシステムで金融サービスの販売などを強化</h4><p>プライベートバンキング分野では、レコメンダーシステムを利用して、顧客プロファイルに基づいたパーソナライズされたレコメンデーションにより、金融商品の売上を伸ばしています。レコメンダー・システムは、金融リサーチ、ビジネス・ニュース、銘柄選択、取引支援システムなどにも活用できる。深層学習モデルのおかげで、すべてのユーザーとアイテムは埋め込みベクトルとして記述される。ベクトル・データベースは、ユーザーとアイテムの間の類似性を計算できる埋め込み空間を提供します。</p>
<p>Milvusを使ったグラフベースのレコメンデーションシステムに関する<a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">デモで</a>詳細をご覧ください。</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">セマンティックテキストマイニングによる決算報告書やその他の非構造化財務データの分析：</h4><p>テキストマイニング技術は金融業界に大きな影響を与えました。金融データが指数関数的に増大する中、テキストマイニングは金融の領域で重要な研究分野として浮上しています。</p>
<p>ディープラーニングモデルは現在、多くの意味的側面を捉えることができる単語ベクトルによって金融レポートを表現するために適用されている。Milvusのようなベクトルデータベースは、何百万ものレポートから膨大な意味的単語ベクトルを保存し、それに対してミリ秒単位で類似性検索を行うことができます。</p>
<p><a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">deepsetのHaystackとMilvusの使用</a>方法については、こちらをご覧ください。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">他人にならない</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つけ、貢献する。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>つながりましょう。</li>
</ul>
