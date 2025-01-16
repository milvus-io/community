---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: システム概要
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  オープンソースのベクターデータベースであるMilvusが、パーソナライズされたスタイル推奨と画像検索システムを提供するファッションアプリのためにMozatによってどのように使用されているかをご覧ください。
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Milvusでワードローブと衣装計画アプリを作る</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディア-1.png</span> </span></p>
<p>2003年に設立された<a href="http://www.mozat.com/home">Mozatは</a>、シンガポールに本社を置き、中国とサウジアラビアにオフィスを構える新興企業だ。同社はソーシャルメディア、コミュニケーション、ライフスタイル・アプリケーションの構築を専門としている。<a href="https://stylepedia.com/">Stylepediaは</a>Mozatによって作られたワードローブアプリで、ユーザーが新しいスタイルを発見し、ファッションに情熱を注ぐ他の人々とつながるのを助ける。主な機能には、デジタルクローゼットをキュレーションする機能、パーソナライズされたおすすめスタイル、ソーシャルメディア機能、オンラインや実生活で見たものと似たアイテムを見つけるための画像検索ツールなどがある。</p>
<p><a href="https://milvus.io">Milvusは</a>、Stylepediaの画像検索システムに使用されている。このアプリは、ユーザー画像、商品画像、ファッション写真の3種類の画像を扱います。各画像には1つ以上のアイテムが含まれるため、各クエリがさらに複雑になります。画像検索システムを有用なものにするためには、正確で、高速で、安定したものでなければなりません。</p>
<h2 id="System-overview" class="common-anchor-header">システム概要<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディアシステムプロセス.png</span> </span></p>
<p>画像検索システムは、オフラインとオンラインのコンポーネントに分かれています。</p>
<p>オフラインでは、画像はベクトル化され、ベクトルデータベース（Milvus）に挿入されます。データワークフローでは、関連する商品画像やファッション写真が、オブジェクト検出と特徴抽出モデルを使用して512次元の特徴ベクトルに変換されます。その後、ベクトルデータはインデックス化され、ベクトルデータベースに追加される。</p>
<p>オンラインでは、画像データベースが照会され、類似画像がユーザーに返される。オフラインの場合と同様に、クエリ画像はオブジェクト検出と特徴抽出モデルによって処理され、特徴ベクトルが得られる。特徴ベクトルを使って、MilvusはTopK類似ベクトルを検索し、対応する画像IDを取得する。最後に、後処理（フィルタリング、ソートなど）の後、クエリ画像に類似した画像のコレクションが返される。</p>
<h2 id="Implementation" class="common-anchor-header">実装<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>実装は4つのモジュールに分かれている：</p>
<ol>
<li>衣服の検出</li>
<li>特徴抽出</li>
<li>ベクトル類似度検索</li>
<li>後処理</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">衣服検出</h3><p>衣服検出モジュールでは、1段階のアンカーベースのターゲット検出フレームワークである<a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5が</a>、小型でリアルタイム推論が可能なオブジェクト検出モデルとして使用されている。YOLOv5には4つのモデルサイズ（YOLOv5s/m/l/x）があり、それぞれのサイズには長所と短所がある。大きいモデルは性能が良い（精度が高い）が、より多くの計算能力を必要とし、動作が遅くなる。今回の対象物は比較的大きなもので、検出が容易なため、最小モデルのYOLOv5sで十分です。</p>
<p>各画像内の衣服アイテムは認識され、切り出され、その後の処理で使用される特徴抽出モデル入力となる。同時に、物体検出モデルは、事前に定義されたクラス（トップス、アウターウェア、ズボン、スカート、ドレス、ロンパース）に従って衣服の分類も予測する。</p>
<h3 id="Feature-extraction" class="common-anchor-header">特徴抽出</h3><p>類似検索の鍵は特徴抽出モデルである。切り取られた衣服画像は、機械可読な数値データ形式で属性を表す512次元浮動小数点ベクトルに埋め込まれる。<a href="https://arxiv.org/abs/1905.11946">EfficientNetを</a>基幹モデルとして、<a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">ディープメトリック学習（DML）</a>手法を採用する。</p>
<p>メトリック学習は、CNNベースの非線形特徴抽出モジュール（またはエンコーダ）を訓練して、同じクラスのサンプルに対応する特徴ベクトル間の距離を短くし、異なるクラスのサンプルに対応する特徴ベクトル間の距離を長くすることを目的とする。このシナリオでは、同じクラスのサンプルは同じ服を指します。</p>
<p>EfficientNetは、ネットワークの幅、深さ、解像度を均一にスケーリングする際に、速度と精度の両方を考慮します。EfficientNet-B4は特徴抽出ネットワークとして使用され、究極の完全接続層の出力はベクトル類似性検索を行うために必要な画像特徴である。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">ベクトル類似検索</h3><p>Milvusはオープンソースのベクトルデータベースで、作成、読み込み、更新、削除（CRUD）操作と、1兆バイトのデータセットに対するほぼリアルタイムの検索をサポートしています。Stylepedia では、高い伸縮性、安定性、信頼性、そして高速性を持つ Milvus を大規模なベクトル類似性検索に使用しています。Milvusは、広く使用されているベクトルインデックスライブラリ（Faiss、NMSLIB、Annoyなど）の機能を拡張し、シンプルで直感的なAPIセットを提供することで、ユーザーは与えられたシナリオに理想的なインデックスタイプを選択することができます。</p>
<p>シナリオの要件とデータ規模を考慮し、Stylepediaの開発者はMilvusのCPUのみのディストリビューションとHNSWインデックスを組み合わせました。インデックス化された2つのコレクションは、1つは商品、もう1つはファッション写真で、異なるアプリケーション機能を提供するために構築されています。各コレクションはさらに、検索範囲を狭めるために、検出と分類の結果に基づいて6つのパーティションに分割される。Milvusは数千万のベクトルに対して数ミリ秒で検索を実行し、開発コストを抑えながら最適なパフォーマンスを提供し、リソースの消費を最小限に抑えます。</p>
<h3 id="Post-processing" class="common-anchor-header">後処理</h3><p>画像検索結果とクエリ画像の類似性を向上させるために、カラーフィルタリングとキーラベル（袖丈、着丈、襟型など）フィルタリングを使用して、不適格な画像をフィルタリングします。さらに、画質評価アルゴリズムを使用して、より高品質な画像がユーザーに最初に提示されるようにします。</p>
<h2 id="Application" class="common-anchor-header">アプリケーション<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">ユーザーのアップロードと画像検索</h3><p>ユーザーは自分の洋服を撮影し、Stylepedia デジタルクローゼットにアップロードすることで、アップロードした画像に最も近い商品画像を検索することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディア検索結果.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">着こなし提案</h3><p>Stylepedia データベース上で類似検索を行うことで、特定のファッションアイテムを含むファッション写真を見つけることができます。これらは、誰かが購入を考えている新しい洋服であったり、自分のコレクションにあるものであったりします。そして、そのアイテムがよく組み合わされるアイテムのクラスタリングを通して、着こなしの提案が生成される。例えば、黒のバイカージャケットは、黒のスキニージーンズなど、様々なアイテムと合わせることができる。ユーザーは、選択された公式の中で、このマッチングが起こる関連するファッション写真を閲覧することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディア-ジャケット-アウトフィット.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディア・ジャケット・スナップショット.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">ファッション写真のレコメンデーション</h3><p>ユーザーの閲覧履歴、「好きなもの」、デジタル・クローゼットの内容に基づいて、類似度を計算し、興味のありそうなファッション写真をカスタマイズしてレコメンドします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>スタイルペディア-ユーザー-ワードローブ.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>ディープラーニングとコンピュータービジョンの手法を組み合わせることで、Mozatは、Stylepediaアプリの様々な機能をパワーアップさせるためにMilvusを使用して、高速で安定した正確な画像類似検索システムを構築することができました。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">見知らぬ人にならない<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つける、またはMilvusに貢献する。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>私たちとつながりましょう。</li>
</ul>
