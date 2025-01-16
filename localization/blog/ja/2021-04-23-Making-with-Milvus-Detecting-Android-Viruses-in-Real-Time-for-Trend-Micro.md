---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: Milvusと作る トレンドマイクロのためにリアルタイムでAndroidウイルスを検出する
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: Milvusがどのように重要なデータへの脅威を軽減し、リアルタイムのウイルス検出でサイバーセキュリティを強化しているかをご覧ください。
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Milvusとの協業：トレンドマイクロのAndroidウイルスをリアルタイムで検出</custom-h1><p>サイバーセキュリティは、個人と企業の両方にとって依然として根強い脅威であり、2020年には<a href="https://www.getapp.com/resources/annual-data-security-report/">86%の企業で</a>データプライバシーに関する懸念が高まり、<a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">消費者の</a>わずか<a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23%が</a>自分の個人データが非常に安全であると考えています。マルウェアが着実に遍在し、巧妙化する中、脅威検知へのプロアクティブなアプローチが不可欠となっています。<a href="https://www.trendmicro.com/en_us/business.html">トレンドマイクロは</a>、ハイブリッドクラウドセキュリティ、ネットワーク防御、中小企業向けセキュリティ、エンドポイントセキュリティのグローバルリーダーです。同社は、Android端末をウイルスから保護するために、Google PlayストアのAPK（Android Application Package）と既知のマルウェアのデータベースを比較するモバイルアプリ「Trend Micro Mobile Security」を構築した。このウイルス検出システムは次のように動作する：</p>
<ul>
<li>Google Playストアの外部APK（Androidアプリケーション・パッケージ）がクロールされる。</li>
<li>既知のマルウェアはベクターに変換され、<a href="https://www.milvus.io/docs/v1.0.0/overview.md">milvusに</a>保存される。</li>
<li>新しいAPKもベクターに変換され、類似性検索を使用してマルウェアデータベースと比較されます。</li>
<li>APKベクターがマルウェアベクターのいずれかと類似している場合、このアプリはウイルスとその脅威レベルに関する詳細情報をユーザーに提供する。</li>
</ul>
<p>このシステムを機能させるためには、膨大なベクターデータセットに対して非常に効率的な類似性検索をリアルタイムで実行する必要がある。当初、トレンドマイクロは<a href="https://www.mysql.com/">MySQLを</a>使用していた。しかし、同社のビジネスが拡大するにつれ、データベースに保存される悪質なコードを含むAPKの数も増えていった。同社のアルゴリズムチームは、MySQLをすぐに使いこなせなくなったため、別のベクトル類似性検索ソリューションを探し始めた。</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">ベクトル類似検索ソリューションの比較</h3><p>ベクトル類似性検索ソリューションは数多くあり、その多くはオープンソースである。プロジェクトによって状況は異なりますが、ほとんどのユーザは、大規模な設定を必要とする単純なライブラリよりも、非構造化データ処理や分析のために構築されたベクトルデータベースを活用する方が有益です。以下では、一般的なベクトル類似検索ソリューションを比較し、トレンドマイクロがmilvusを選択した理由を説明します。</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faissは</a>Facebook AI Researchによって開発されたライブラリで、高密度ベクトルの効率的な類似性検索とクラスタリングを可能にします。Faissのアルゴリズムは、あらゆるサイズのベクトルをセットで検索する。FaissはC++で書かれ、Python/numpy用のラッパーがあり、IndexFlatL2、IndexFlatIP、HNSW、IVFを含む多くのインデックスをサポートしている。</p>
<p>Faissは非常に便利なツールですが、限界があります。基本的なアルゴリズム・ライブラリとしてのみ機能し、ベクトル・データセットを管理するためのデータベースではない。さらに、ほとんどのクラウドベースのサービスの主要機能である、分散バージョン、モニタリングサービス、SDK、高可用性も提供していない。</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Faissと他のANN検索ライブラリをベースにしたプラグイン</h4><p>Faiss、NMSLIB、その他のANN検索ライブラリの上に構築されたプラグインがいくつかあり、それらは、それらを動かす基礎となるツールの基本的な機能を強化するように設計されている。Elasticsearch (ES) は Lucene ライブラリをベースとした検索エンジンで、そのようなプラグインが多数存在する。以下はESプラグインのアーキテクチャ図です：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>分散システムのサポートが組み込まれていることは、ESソリューションの大きな利点です。コードを記述する必要がないため、開発者の時間と企業のコストを削減できる。ESプラグインは技術的に高度で、普及している。ElasticsearchはQueryDSL（ドメイン固有言語）を提供しており、これはJSONに基づいてクエリを定義し、簡単に把握することができます。ESサービスのフルセットにより、ベクトル/テキスト検索とスカラーデータのフィルタリングを同時に行うことが可能。</p>
<p>Amazon、Alibaba、Neteaseは、現在ベクトル類似検索のためにElasticsearchプラグインに依存しているいくつかの大手ハイテク企業である。このソリューションの主な欠点は、メモリ消費量の多さとパフォーマンスチューニングのサポートがないことだ。対照的に、<a href="http://jd.com/">JD.comは</a> <a href="https://github.com/vearch/vearch">Vearchと</a>呼ばれるFaissをベースにした独自の分散ソリューションを開発した。しかし、Vearchはまだインキュベーション段階のプロジェクトであり、オープンソースのコミュニティは比較的活発ではない。</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvusは</a> <a href="https://zilliz.com">Zillizによって</a>作られたオープンソースのベクターデータベースである。非常に柔軟で、信頼性が高く、高速である。Faiss、NMSLIB、Annoyなど、広く採用されている複数のインデックスライブラリをカプセル化することで、Milvusは直感的なAPIの包括的なセットを提供し、開発者はシナリオに応じて理想的なインデックスタイプを選択することができる。また、分散ソリューションやモニタリングサービスも提供している。Milvusは非常に活発なオープンソースコミュニティを持ち、<a href="https://github.com/milvus-io/milvus">Githubでは</a>5.5K以上のスターを獲得している。</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvusは競合に勝る</h4><p>我々は、上記の様々なベクトル類似性検索ソリューションの様々なテスト結果をまとめた。以下の比較表でわかるように、Milvusは10億個の128次元ベクトルからなるデータセットでテストされたにもかかわらず、競合他社よりも大幅に高速であった。</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>エンジン</strong></th><th style="text-align:left"><strong>パフォーマンス (ms)</strong></th><th style="text-align:left"><strong>データセットサイズ (百万)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">良くない</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>ベクトル類似検索ソリューションの比較。</em></h6><p>各ソリューションの長所と短所を比較検討した結果、トレンドマイクロはベクトル検索モデルにMilvusを採用した。億単位の膨大なデータセットに対して卓越したパフォーマンスを発揮するMilvusを、リアルタイムのベクトル類似検索を必要とするモバイルセキュリティサービスに採用した理由は明らかだ。</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">リアルタイムウイルス検出のためのシステム設計</h3><p>トレンドマイクロのMySQLデータベースには1,000万以上の悪意のあるAPKが保存されており、毎日10万件の新しいAPKが追加されている。このシステムは、APKファイルのさまざまなコンポーネントのTash値を抽出して計算し、Sha256アルゴリズムを使ってバイナリファイルに変換し、APKを他と区別する256ビットのSha256値を生成することで動作します。Sha256値はAPKファイルによって異なるため、1つのAPKは1つのTash値と1つのユニークなSha256値を持つことができます。</p>
<p>Sha256値はAPKを区別するためだけに使用され、Thash値はベクトルの類似性検索に使用されます。類似した APK は同じ Thash 値を持つが、異なる Sha256 値を持つ可能性がある。</p>
<p>トレンドマイクロは、不正なコードを含むAPKを検出するために、類似したThash値と対応するSha256値を検索する独自のシステムを開発しました。トレンドマイクロはMilvusを採用し、Tash値から変換された膨大なベクトルデータセットに対して瞬時にベクトルの類似性検索を実施しました。類似検索が実行された後、対応するSha256値がMySQLで照会されます。Redisキャッシュレイヤーもアーキテクチャに追加され、Thash値をSha256値にマッピングすることで、クエリ時間を大幅に短縮している。</p>
<p>以下は、トレンドマイクロのモバイルセキュリティシステムのアーキテクチャ図です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>適切な距離メトリックを選択することで、ベクトルの分類とクラスタリングのパフォーマンスが向上します。次の表に、バイナリベクトルで動作する<a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">距離メトリックと</a>対応するインデックスを示します。</p>
<table>
<thead>
<tr><th><strong>距離メトリクス</strong></th><th><strong>インデックスの種類</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard<br/> - Tanimoto<br/> - Hamming</td><td>- flat<br/> - ivf_flat</td></tr>
<tr><td>- 超構造<br/> - 部分構造</td><td>フラット</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>バイナリベクトル用の距離メトリックとインデックス。</em></h6><p><br/></p>
<p>トレンドマイクロは、Thash値をバイナリベクトルに変換し、Milvusに保存します。このシナリオでは、トレンドマイクロはハミング距離を使用してベクトルを比較しています。</p>
<p>Milvusは間もなく文字列ベクトルIDをサポートし、整数IDを文字列形式で対応する名前にマッピングする必要がなくなります。これにより、Redisのキャッシュレイヤーが不要になり、システムアーキテクチャが嵩張らなくなる。</p>
<p>トレンドマイクロはクラウドベースのソリューションを採用し、多くのタスクを<a href="https://kubernetes.io/">Kubernetes</a>上にデプロイしている。高可用性を実現するために、トレンドマイクロはPythonで開発されたMilvusクラスタのシャーディングミドルウェアである<a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishardsを</a>使用しています。</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png「MilvusのMishardsアーキテクチャ」)</p>
<p><br/></p>
<p>トレンドマイクロでは、<a href="https://aws.amazon.com/">AWSが</a>提供する<a href="https://aws.amazon.com/efs/">EFS</a>（Elastic File System）にすべてのベクトルを格納することで、ストレージと距離計算を分離している。このやり方は業界ではポピュラーなトレンドだ。Kubernetesを使用して複数の読み取りノードを起動し、これらの読み取りノードでLoadBalancerサービスを開発して高可用性を確保しています。</p>
<p>データの一貫性を維持するため、Mishardsは1つの書き込みノードだけをサポートしている。しかし、複数の書き込みノードをサポートするmilvusの分散バージョンは、今後数ヶ月で利用可能になる予定です。</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">監視およびアラート機能</h3><p>Milvusは<a href="https://prometheus.io/">Prometheus</a>上に構築された監視システムと互換性があり、時系列分析のためのオープンソースプラットフォームである<a href="https://grafana.com/">Grafanaを</a>使用して、様々なパフォーマンスメトリクスを可視化します。</p>
<p>Prometheusは以下のメトリクスを監視・保存します：</p>
<ul>
<li>挿入速度、クエリー速度、Milvus稼働時間などのMilvusパフォーマンスメトリクス。</li>
<li>CPU/GPU使用率、ネットワーク・トラフィック、ディスク・アクセス速度などのシステム・パフォーマンス・メトリクス。</li>
<li>データサイズ、総ファイル数などのハードウェアストレージメトリクス。</li>
</ul>
<p>モニタリングとアラートシステムは以下のように動作します：</p>
<ul>
<li>Milvusクライアントは、カスタマイズされたメトリクスデータをPushgatewayにプッシュします。</li>
<li>Pushgatewayは、短命で刹那的なメトリクス・データがPrometheusに安全に送信されるようにします。</li>
<li>PrometheusはPushgatewayからデータをプルし続けます。</li>
<li>アラートマネージャーは、異なるメトリクスに対してアラートのしきい値を設定し、電子メールまたはメッセージを通じてアラームを発生させます。</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">システムパフォーマンス</h3><p>Milvus上に構築されたThashSearchサービスが開始されてから数ヶ月が経過した。以下のグラフは、エンド・ツー・エンドのクエリーレイテンシーが95ミリ秒以下であることを示しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>挿入も速い。300万個の192次元ベクトルを挿入するのに約10秒かかる。Milvusの支援により、システム性能はトレンドマイクロが設定した性能基準を満たすことができた。</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">他人事ではない</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つける、またはMilvusに貢献する。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>つながりましょう。</li>
</ul>
