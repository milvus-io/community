---
id: AI-applications-with-Milvus.md
title: Milvusで4つの人気AIアプリケーションを作る方法
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvusは、機械学習アプリケーション開発と機械学習オペレーション（MLOps）を加速します。Milvusを使用すると、コストを抑えながら最小実行可能製品（MVP）を迅速に開発できます。
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Milvusを使った4つの人気AIアプリケーションの作り方</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>ブログカバー.png</span> </span></p>
<p><a href="https://milvus.io/">Milvusは</a>オープンソースのベクトルデータベースである。AIモデルを使って非構造化データから特徴ベクトルを抽出して作成された膨大なベクトルデータセットの追加、削除、更新、およびほぼリアルタイムの検索をサポートする。Milvusは、直感的なAPIの包括的なセットと、広く採用されている複数のインデックスライブラリ（Faiss、NMSLIB、Annoyなど）のサポートにより、機械学習アプリケーションの開発と機械学習オペレーション（MLOps）を加速します。Milvusを使用することで、コストを低く抑えながら、MVP（minimum viable product）を迅速に開発することができます。</p>
<p>「Milvusを使ってAIアプリケーションを開発するために、どのようなリソースが利用可能か」というのは、Milvusコミュニティでよく聞かれる質問です。Milvusの<a href="https://zilliz.com/">開発元</a>であるZilliz社は、Milvusを活用し、インテリジェント・アプリケーションの原動力となる高速類似検索を行うデモを多数開発した。Milvusソリューションのソースコードは<a href="https://github.com/zilliz-bootcamp">zilliz-bootcampで</a>ご覧いただけます。以下のインタラクティブなシナリオでは、自然言語処理（NLP）、逆画像検索、音声検索、コンピュータビジョンを実演しています。</p>
<p>特定のシナリオを実際に体験するために、ソリューションを自由に試してみてください！あなた自身のアプリケーション・シナリオを</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">スラック</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>ジャンプする</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">自然言語処理（チャットボット）</a></li>
<li><a href="#reverse-image-search-systems">逆画像検索</a></li>
<li><a href="#audio-search-systems">音声検索</a></li>
<li><a href="#video-object-detection-computer-vision">ビデオオブジェクト検出（コンピュータビジョン）</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">自然言語処理（チャットボット）</h3><p>Milvusは、自然言語処理を使用してライブオペレーターをシミュレートし、質問に答え、ユーザーを関連情報に導き、人件費を削減するチャットボットを構築するために使用できます。この応用シナリオを実証するため、ZillizはMilvusと、自然言語処理の事前学習用に開発された機械学習（ML）モデルである<a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERTを組み合わせて</a>、意味言語を理解するAI搭載チャットボットを構築した。</p>
<p>ソースコード：zilliz-bootcamp/intelligent<a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">_</a>question_answering_v2</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">使用方法</h4><ol>
<li><p>質問と回答のペアを含むデータセットをアップロードする。質問と答えを2列に分けてフォーマットする。また、<a href="https://zilliz.com/solutions/qa">サンプルデータセットを</a>ダウンロードすることもできます。</p></li>
<li><p>質問を入力すると、アップロードされたデータセットから類似した質問のリストが検索されます。</p></li>
<li><p>あなたの質問に最も似ている質問を選択することで、答えを明らかにすることができます。</p></li>
</ol>
<p>👉動画：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">【デモ】QAシステム Powered by milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">仕組み</h4><p>質問はGoogleのBERTモデルを使用して特徴ベクトルに変換され、Milvusはデータセットの管理とクエリに使用されます。</p>
<p><strong>データ処理：</strong></p>
<ol>
<li>BERTを使用して、アップロードされた質問と回答のペアを768次元の特徴ベクトルに変換します。その後、ベクトルは Milvus にインポートされ、個々の ID が割り当てられる。</li>
<li>質問および対応する回答のベクトル ID は、PostgreSQL に保存されます。</li>
</ol>
<p><strong>類似問題の検索</strong></p>
<ol>
<li>BERTは、ユーザの入力質問から特徴ベクトルを抽出するために使用されます。</li>
<li>Milvusは、入力質問に最も類似している質問のベクトルIDを検索します。</li>
<li>システムは、PostgreSQLで対応する回答を検索します。</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">逆画像検索システム</h3><p>逆画像検索は、パーソナライズされた商品推奨や類似商品検索ツールによってeコマースに変革をもたらし、売上を向上させることができる。この応用シナリオにおいて、ZillizはMilvusと画像の特徴を抽出できるMLモデルである<a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGGを</a>組み合わせることで、逆画像検索システムを構築した。</p>
<p>👉ソースコード：zilliz-<a href="https://github.com/zilliz-bootcamp/image_search">bootcamp</a>/image_search</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">使用方法</h4><ol>
<li>.jpg画像のみで構成されたzip圧縮された画像データセットをアップロードしてください。または、<a href="https://zilliz.com/solutions/image-search">サンプルデータセットを</a>ダウンロードすることもできます。</li>
<li>類似画像を見つけるための検索入力として使用する画像をアップロードする。</li>
</ol>
<p>ビデオ<a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[デモ】画像検索 Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">仕組み</h4><p>画像はVGGモデルを使って512次元の特徴ベクトルに変換され、Milvusを使ってデータセットの管理とクエリが行われます。</p>
<p><strong>データ処理：</strong></p>
<ol>
<li>アップロードされた画像データセットを特徴ベクトルに変換するためにVGGモデルが使用されます。そのベクトルはMilvusにインポートされ、個々のIDが割り当てられる。</li>
<li>画像特徴ベクトルと対応する画像ファイルパスはCacheDBに格納される。</li>
</ol>
<p><strong>類似画像の検索</strong></p>
<ol>
<li>ユーザがアップロードした画像を特徴ベクトルに変換するためにVGGが使用されます。</li>
<li>入力画像に最も類似した画像のベクトルIDがmilvusから取得されます。</li>
<li>システムはCacheDBで対応する画像ファイルのパスを検索します。</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">音声検索システム</h3><p>音声、音楽、効果音、その他の種類の音声検索により、大量の音声データを素早く照会し、類似した音声を浮かび上がらせることができます。用途としては、類似した効果音の特定、IP侵害の最小化などが挙げられます。この応用シナリオを実証するために、ZillizはMilvusと<a href="https://arxiv.org/abs/1912.10211">PANNs（</a>オーディオパターン認識のために構築された大規模な事前学習済みオーディオニューラルネットワーク）を組み合わせることで、非常に効率的なオーディオ類似検索システムを構築した。</p>
<p>👉ソースコード：zilliz-<a href="https://github.com/zilliz-bootcamp/audio_search">bootcamp</a>/audio_search<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">使用方法</h4><ol>
<li>.wavファイルのみで構成されたzip圧縮されたオーディオデータセットをアップロードしてください（他のオーディオファイル形式は受け付けられません）。または、<a href="https://zilliz.com/solutions/audio-search">サンプルデータセットを</a>ダウンロードすることもできます。</li>
<li>.wavファイルをアップロードし、類似音声を検索するための検索入力として使用します。</li>
</ol>
<p>ビデオ<a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[デモ] 音声検索 Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">仕組み</h4><p>音声は、音声パターン認識用に構築された大規模な事前学習済みオーディオ・ニューラル・ネットワークであるPANNを使って特徴ベクトルに変換されます。その後、Milvusを使ってデータセットの管理とクエリを行う。</p>
<p><strong>データ処理：</strong></p>
<ol>
<li>PANNsはアップロードされたデータセットの音声を特徴ベクトルに変換する。ベクトルはMilvusにインポートされ、個々のIDが割り当てられる。</li>
<li>音声特徴ベクトルIDとそれに対応する.wavファイルのパスはPostgreSQLに格納される。</li>
</ol>
<p><strong>類似オーディオの検索</strong></p>
<ol>
<li>PANNsは、ユーザーがアップロードしたオーディオファイルを特徴ベクトルに変換するために使用されます。</li>
<li>アップロードされたファイルに最も類似したオーディオのベクトルIDは、内積（IP）距離を計算することでMilvusから検索されます。</li>
<li>システムはMySQLで対応するオーディオファイルのパスを検索する。</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">ビデオオブジェクト検出（コンピュータビジョン）</h3><p>ビデオオブジェクト検出は、コンピュータビジョン、画像検索、自律走行などに応用されている。この応用シナリオを実証するために、Milvusと<a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>、<a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a>、<a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50などの</a>技術やアルゴリズムを組み合わせて、ビデオオブジェクト検出システムを構築した。</p>
<p>👉ソースコード<a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">使用方法</h4><ol>
<li>.jpgファイルのみで構成されたzip圧縮された画像データセットをアップロードしてください（その他の画像ファイル形式は受け付けません）。各画像ファイルには、必ずその画像に描かれているオブジェクトの名前を付けてください。または、<a href="https://zilliz.com/solutions/video-obj-analysis">サンプルデータセットを</a>ダウンロードすることもできます。</li>
<li>分析に使用するビデオをアップロードします。</li>
<li>再生ボタンをクリックすると、アップロードされたビデオにオブジェクト検出結果がリアルタイムで表示されます。</li>
</ol>
<p>👉動画<a href="https://www.youtube.com/watch?v=m9rosLClByc">[デモ] Milvusによる映像オブジェクト検出システム</a></p>
<h4 id="How-it-works" class="common-anchor-header">仕組み</h4><p>物体画像はResNet50を用いて2048次元の特徴ベクトルに変換されます。その後、Milvusを用いてデータセットの管理とクエリを行う。</p>
<p><strong>データ処理</strong></p>
<ol>
<li>ResNet50は物体画像を2048次元の特徴ベクトルに変換する。このベクトルはMilvusにインポートされ、個々のIDが割り当てられる。</li>
<li>音声特徴ベクトルのIDと対応する画像ファイルのパスはMySQLに格納される。</li>
</ol>
<p><strong>ビデオ内のオブジェクトの検出：</strong></p>
<ol>
<li>ビデオのトリミングにはOpenCVを使用。</li>
<li>YOLOv3を用いて映像内の物体を検出する。</li>
<li>ResNet50は検出された物体画像を2048次元の特徴ベクトルに変換する。</li>
</ol>
<p>Milvusはアップロードされたデータセットから最も類似したオブジェクト画像を検索する。対応するオブジェクト名と画像ファイルのパスはMySQLから取得される。</p>
