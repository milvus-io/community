---
id: Vector-Similarity-Search-Hides-in-Plain-View.md
title: ベクトル類似性検索についてもっと知りたい方は、以下のリソースをご覧ください：
author: milvus
date: 2021-01-05T03:40:20.821Z
desc: ベクトル類似性検索とは何か、そのさまざまな応用例、そして人工知能をこれまで以上に身近なものにしている公開リソースをご紹介します。
cover: assets.zilliz.com/plainview_703d8497ca.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View'
---
<custom-h1>ベクトル類似度検索は平凡な風景の中に隠れている</custom-h1><p><a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#a291">人工知能（AI）は</a>、最も曖昧な物事の進め方さえも変える可能性を秘めている。例えば、毎年（COVIDが開催される前はともかく）香港マラソンには7万3,000人以上が参加する。レース参加者全員の完走タイムを適切に感知・記録するため、主催者は7万3000個のRFIDチップ・タイマーをランナー1人ひとりに配布する。チップ計時は複雑な作業で、明らかな欠点がある。材料（チップと電子読み取り装置）は計時会社から購入するかレンタルしなければならず、レース当日にはランナーがチップを受け取るための受付エリアを用意しなければならない。さらに、センサーがスタート地点とゴール地点にしか設置されていない場合、不誠実なランナーがコースをカットする可能性もある。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_1_e55c133e05.jpeg" alt="blog-1.jpeg" class="doc-image" id="blog-1.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ-1.JPEG</span> </span></p>
<p>ここで、ゴール地点で撮影された映像から、1枚の写真を使ってランナー個人を自動的に特定できる<a href="https://cloud.google.com/video-intelligence">動画AI</a>アプリケーションを想像してみよう。参加者一人ひとりに計時チップを取り付けるのではなく、ランナーはフィニッシュラインを通過した後、アプリを通じて自分の写真をアップロードするだけでいい。瞬時に、パーソナライズされたハイライトリール、レース統計、その他の関連情報が提供される。レース中のさまざまな地点に設置されたカメラは、参加者の追加映像を撮影し、各ランナーがコース全体を通過したことを確認することができる。どちらのソリューションが導入しやすく、費用対効果が高そうですか？</p>
<p>香港マラソンでは（まだ）機械学習を活用して計時チップを置き換えることはしていないが、この例はAIが身の回りのあらゆるものを劇的に変化させる可能性を示している。レースの計時では、数万個のチップを機械学習アルゴリズムと組み合わせた数台のカメラに減らすことができる。しかし、ビデオAIは、ベクトル類似性検索の数ある応用例のひとつに過ぎない。ベクトル類似性検索は、人工知能を使って1兆個規模の膨大な非構造化データセットを分析するプロセスである。この記事では、ベクトル検索技術とは何か、どのように使用できるのか、またオープンソースのソフトウェアやリソースによってこれまで以上にアクセスしやすくなっていることなど、ベクトル検索技術の概要を説明する。</p>
<p><strong>戻る</strong></p>
<ul>
<li><p><a href="#what-is-vector-similarity-search">ベクトル類似検索とは？</a></p></li>
<li><p><a href="#what-are-some-applications-of-vector-similarity-search">ベクトル類似検索の応用例とは？</a></p></li>
<li><p><a href="#open-source-vector-similarity-search-software-and-resources">オープンソースのベクトル類似性検索ソフトウェアとリソース。</a></p></li>
</ul>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">ベクトル類似性検索とは？</h3><p>ビデオデータは驚くほど詳細で、ますます一般的になってきているため、論理的には、ビデオAIを構築するための教師なし学習シグナルとして最適であるように思われる。現実にはそうではない。特に大量の動画データの処理と分析は、<a href="https://arxiv.org/pdf/1905.11954.pdf">人工知能にとって</a>依然として<a href="https://arxiv.org/pdf/1905.11954.pdf">難題で</a>ある。この分野における最近の進歩は、非構造化データ分析における進歩の多くと同様、ベクトル類似性検索に負うところが大きい。</p>
<p>動画の問題は、他の非構造化データと同様、あらかじめ定義されたモデルや組織構造に従っていないため、大規模な処理や分析が難しいことだ。非構造化データには、画像、音声、ソーシャルメディアでの行動、文書などが含まれ、総計で全データの80～90％以上を占めると推定されている。企業は、膨大で謎めいた非構造化データセットに埋もれているビジネスクリティカルな洞察にますます気づき、この未知の可能性を利用できるAIアプリケーションへの需要を高めている。</p>
<p>CNN、RNN、BERTなどの<a href="https://en.wikipedia.org/wiki/Neural_network">ニューラルネットワークを</a>使用すると、非構造化データを機械可読の数値データ形式である特徴ベクトル（別名エンベッディング）に変換することができる。その後、コサイン類似度やユークリッド距離のような尺度を使用して、ベクトル間の類似性を計算するアルゴリズムが使用される。ベクトル埋め込みと類似性検索により、以前は判別不可能だったデータセットを使って機械学習アプリケーションを分析・構築することが可能になる。</p>
<p>ベクトルの類似性は確立されたアルゴリズムを用いて計算されるが、構造化されていないデータセットは一般的に巨大である。つまり、効率的で正確な検索には、膨大なストレージと計算能力が必要になる。<a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a">類似性検索を高速化</a>し、必要なリソースを削減するために、近似最近傍（ANN）検索アルゴリズムが使用される。類似ベクトルをクラスタリングすることで、ANNアルゴリズムは、データセット全体を検索するのではなく、類似ベクトルを含む可能性が最も高いベクトルのクラスタにクエリを送信することを可能にする。このアプローチはより高速ですが、ある程度の精度が犠牲になります。ANNアルゴリズムを活用することで、ベクトル検索は何十億ものディープラーニング・モデルの洞察をミリ秒単位で調べ上げることができる。</p>
<h3 id="What-are-some-applications-of-vector-similarity-search" class="common-anchor-header">ベクトル類似検索の用途は？</h3><p>ベクトル類似性検索は、人工知能、ディープラーニング、伝統的なベクトル計算の様々なシナリオにまたがるアプリケーションを持っています。以下は、様々なベクトル類似検索のアプリケーションのハイレベルな概要である：</p>
<p><strong>電子商取引：</strong>電子商取引：ベクトル類似性検索は、買い物客がスマートフォンで撮影した画像やオンラインで見つけた画像を使って商品を検索できる逆画像検索エンジンなど、電子商取引に幅広く応用できる。さらに、ユーザーの行動、興味、購入履歴などに基づいたパーソナライズされたレコメンデーションは、ベクトル検索に依存する特別なレコメンデーションシステムによって提供される。</p>
<p><strong>物理セキュリティとサイバーセキュリティ：</strong>ビデオAIは、セキュリティ分野におけるベクトル類似検索の数あるアプリケーションの一つに過ぎない。他のシナリオとしては、顔認識、行動トレース、ID認証、インテリジェントアクセス制御などがある。さらに、ベクトル類似性検索は、ますます一般化し巧妙化するサイバー攻撃を阻止する上で重要な役割を果たしている。例えば、<a href="https://medium.com/gsi-technology/application-of-ai-to-cybersecurity-part-3-19659bdb3422">コード類似性検索は</a>、既知の脆弱性やマルウェアのデータベースとソフトウェアの一部を比較することによって、セキュリティリスクを特定するために使用することができます。</p>
<p><strong>レコメンデーション・エンジン：</strong>レコメンデーション・エンジンとは、機械学習とデータ分析を用いて、ユーザーに製品やサービス、コンテンツ、情報を提案するシステムである。ユーザーの行動、類似ユーザーの行動、その他のデータをディープラーニングの手法で処理し、レコメンデーションを生成する。十分なデータがあれば、エンティティ間の関係を理解し、それらを自律的に表現する方法を発明するようにアルゴリズムを訓練することができる。レコメンデーション・システムは適用範囲が広く、Netflixのコンテンツ・レコメンデーション、Amazonのショッピング・レコメンデーション、Facebookのニュース・フィードなど、人々がすでに毎日接しているものだ。</p>
<p><strong>チャットボット：</strong>伝統的に、チャットボットは大規模な学習データセットを必要とする通常の知識グラフを使用して構築されます。しかし、ディープラーニングモデルを使用して構築されたチャットボットは、データを前処理する必要がなく、代わりに、頻繁に使用される質問と回答の間のマップが作成されます。事前に訓練された自然言語処理（NLP）モデルを使用して、質問から特徴ベクトルを抽出し、<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0">ベクトルデータ管理</a>プラットフォームを使用して保存してクエリすることができます。</p>
<p><strong>画像や動画の検索：</strong>ディープラーニング・ネットワークは、1970年代後半から視覚的なパターンを認識するために使用されており、現代の技術動向により、画像や動画検索は以前よりも強力でアクセスしやすくなっている。</p>
<p><strong>化学的類似性検索：</strong>化学的類似性は、化合物の特性を予測し、特定の属性を持つ化学物質を見つけるための鍵であり、新薬の開発に欠かせない。特徴ベクトルで表されるフィンガープリントを分子ごとに作成し、ベクトル間の距離から類似性を測定する。TikTokの中国の親会社であるByteDanceが<a href="https://techcrunch.com/2020/12/23/bytedance-ai-drug/">この分野の人材を採用</a>し始めているように、新薬の発見にAIを活用することはハイテク業界で勢いを増している。</p>
<h3 id="Open-source-vector-similarity-search-software-and-resources" class="common-anchor-header">オープンソースのベクトル類似検索ソフトウェアとリソース。</h3><p>ムーアの法則、クラウドコンピューティング、リソースコストの低下は、人工知能をこれまで以上に身近なものにしたマクロトレンドだ。オープンソースソフトウェアやその他の一般に利用可能なリソースのおかげで、AI/MLアプリケーションの構築は大手テック企業だけのものではありません。以下では、オープンソースのベクトルデータ管理プラットフォームであるMilvusの概要を紹介するとともに、AIを誰もが利用できるようにするための一般公開されているデータセットを紹介する。</p>
<h4 id="Milvus-an-open-source-vector-data-management-platform" class="common-anchor-header">オープンソースのベクターデータ管理プラットフォームMilvus</h4><p><a href="https://milvus.io/">Milvusは</a>、大規模ベクトルデータ専用に構築されたオープンソースのベクトルデータ管理プラットフォームです。Facebook AI Similarity Search (Faiss)、Non-Metric Space Library (NMSLIB)、Annoyを搭載したMilvusは、様々な強力なツールを単一のプラットフォームの下にまとめ、それぞれのスタンドアロン機能を拡張します。このシステムは、大規模なベクトルデータセットの保存、処理、分析のために構築され、上記のすべてのAIアプリケーション（およびそれ以上）を構築するために使用することができます。</p>
<p>Milvusの詳細については、<a href="https://milvus.io/">ウェブサイトを</a>ご覧ください。チュートリアル、Milvusのセットアップ手順、ベンチマークテスト、さまざまなアプリケーションの構築に関する情報は、<a href="https://github.com/milvus-io/bootcamp">Milvusブートキャンプで</a>入手できる。プロジェクトへの貢献に興味のある開発者は、<a href="https://github.com/milvus-io">GitHub</a>上のMilvusのオープンソースコミュニティに参加することができる。</p>
<h4 id="Public-datasets-for-artificial-intelligence-and-machine-learning" class="common-anchor-header">人工知能と機械学習のための公開データセット</h4><p>グーグルやフェイスブックのようなテクノロジー・ジャイアントが、小企業に対してデータ面で優位に立っていることは周知の事実であり、一部の識者は、一定の規模を超える企業に対して、匿名化されたデータの一部を小規模なライバル企業と共有することを強制する「<a href="https://www.technologyreview.com/2019/06/06/135067/making-big-tech-companies-share-data-could-do-more-good-than-breaking-them-up/">漸進的データ共有義務</a>」を提唱しているほどだ。幸いなことに、AL/MLプロジェクトに利用できるデータセットは何千と公開されている：</p>
<ul>
<li><p><strong>The People's Speech Dataset：</strong> <a href="https://mlcommons.org/en/peoples-speech/">ML Commonsが</a>提供<a href="https://mlcommons.org/en/peoples-speech/">する</a>この<a href="https://mlcommons.org/en/peoples-speech/">データセットは</a>、世界最大の音声データセットであり、59の異なる言語で87,000時間以上の音声が書き起こされている。</p></li>
<li><p><strong>UCアーバイン機械学習リポジトリ：</strong>カリフォルニア大学アーバイン校は、機械学習コミュニティを支援するために、<a href="https://archive.ics.uci.edu/ml/index.php">何百もの公開データセットを</a>管理している。</p></li>
<li><p><strong>Data.gov：</strong>アメリカ政府は、教育、気候、COVID-19などにまたがる<a href="https://www.data.gov/">数十万のオープンデータセットを</a>提供している。</p></li>
<li><p><strong>Eurostat：</strong>欧州連合（EU）の統計局で、経済・金融から人口・社会情勢まで、様々な業界にわたる<a href="https://ec.europa.eu/eurostat/data/database">オープンデータセットを</a>提供している。</p></li>
<li><p><strong>Harvard Dataverse：</strong> <a href="https://dataverse.harvard.edu/">Harvard Dataverse Repositoryは</a>、分野を超えて研究者に公開されている無料のデータリポジトリである。多くのデータセットが公開されているが、利用条件が制限されているものもある。</p></li>
</ul>
<p>このリストは決して網羅的なものではないが、驚くほど多様なオープンデータセットを発見するための良い出発点である。公開データセットの詳細と、次のMLやデータサイエンス・プロジェクトに適したデータの選択については、この<a href="https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052">Mediumの投稿を</a>ご覧ください。</p>
<h2 id="To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="common-anchor-header">ベクトル類似性検索についてもっと知りたい方は、以下のリソースをご覧ください：<button data-href="#To-learn-more-about-vector-similarity-search-check-out-the-following-resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">Milvusのおかげで、誰でも10億枚以上の画像の検索エンジンを構築することができる。</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvusは大規模な（兆を考える）ベクトル類似検索のために構築された</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">ベクターインデキシングによるビッグデータでの類似検索の高速化</a></li>
<li><a href="https://zilliz.com/learn/index-overview-part-2">ベクトルインデックスでビッグデータの類似検索を高速化する（後編）</a></li>
</ul>
