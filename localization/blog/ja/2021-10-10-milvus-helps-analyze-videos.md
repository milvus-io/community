---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: オブジェクト検出
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Milvusが動画コンテンツのAI分析をどのように支援しているかをご覧ください。
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Milvusベクトルデータベースによるビデオ分析システムの構築</custom-h1><p><em>ZillizのデータエンジニアであるShiyu Chenは、西安大学でコンピュータサイエンスの学位を取得した。Zillizに入社して以来、音声・動画解析、分子式検索など様々な分野でMilvusのソリューションを探求し、コミュニティの応用シナリオを大いに豊かにしてきた。現在、さらに興味深いソリューションを探求中。余暇はスポーツと読書。</em></p>
<p>先週末<em>『フリーガイ』を見て</em>いたとき、警備員のバディ役の俳優をどこかで見たことがあるような気がしたが、彼の出演作を思い出すことができなかった。頭の中は "この人誰？"でいっぱいだった。確かに見たことのある顔なのに、必死に名前を思い出そうとしていた。似たようなケースに、昔よく飲んでいたお酒をビデオで主役が飲んでいるのを見たことがあるが、結局銘柄を思い出せなかったことがある。</p>
<p>答えは舌先にあったのだが、脳が完全に引っかかった感じだった。</p>
<p>映画を見ていると、舌先三寸（TOT）現象にイライラさせられる。動画を検索し、動画の内容を分析できる動画の逆画像検索エンジンがあればいいのだが。以前、<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">Milvusを使って逆画像検索エンジンを</a>作ったことがある。動画コンテンツ解析が画像解析に似ていることから、Milvusをベースに動画コンテンツ解析エンジンを構築することにした。</p>
<h2 id="Object-detection" class="common-anchor-header">オブジェクト検出<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">概要</h3><p>映像解析の前に、まず映像中の物体を検出する必要がある。ビデオ内のオブジェクトを効果的かつ正確に検出することは、このタスクの主な課題である。また、自動操縦、ウェアラブルデバイス、IoTなどのアプリケーションにとっても重要なタスクである。</p>
<p>伝統的な画像処理アルゴリズムからディープニューラルネットワーク（DNN）へと発展し、現在の物体検出の主流モデルには、R-CNN、FRCNN、SSD、YOLOなどがある。本トピックで紹介するmilvusベースのディープラーニング映像解析システムは、インテリジェントかつ迅速に物体を検出することができる。</p>
<h3 id="Implementation" class="common-anchor-header">実装</h3><p>映像中の物体を検出・認識するためには、まず映像からフレームを抽出し、そのフレーム画像から物体検出を用いて物体を検出し、次に検出した物体から特徴ベクトルを抽出し、最後に特徴ベクトルに基づいて物体を解析する。</p>
<ul>
<li>フレーム抽出</li>
</ul>
<p>映像解析はフレーム抽出により画像解析に変換される。現在、フレーム抽出技術は非常に成熟している。FFmpegやOpenCVのようなプログラムは、指定した間隔でフレームを抽出することをサポートしています。この記事では、OpenCVを使用して1秒ごとに動画からフレームを抽出する方法を紹介します。</p>
<ul>
<li>オブジェクト検出</li>
</ul>
<p>オブジェクト検出とは、抽出されたフレームからオブジェクトを見つけ、そのオブジェクトの位置に応じてスクリーンショットを抽出することです。以下の図のように、自転車、犬、車が検出されています。このトピックでは、物体検出によく使われるYOLOv3を使った検出方法を紹介します。</p>
<ul>
<li>特徴抽出</li>
</ul>
<p>特徴抽出とは、機械が認識しにくい非構造化データを特徴ベクトルに変換することです。例えば、画像はディープラーニングモデルを用いて多次元の特徴ベクトルに変換することができる。現在、画像認識のAIモデルとしては、VGG、GNN、ResNetなどが有名です。本トピックでは、ResNet-50を用いて、検出された物体から特徴量を抽出する方法を紹介します。</p>
<ul>
<li>ベクトル解析</li>
</ul>
<p>抽出した特徴ベクトルをライブラリベクトルと比較し、最も類似したベクトルに対応する情報を返します。大規模な特徴ベクトルデータセットでは、その計算が大きな課題となります。ここではmilvusを用いた特徴ベクトルの解析方法を紹介します。</p>
<h2 id="Key-technologies" class="common-anchor-header">主な技術<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV)は、クロスプラットフォームのコンピュータビジョンライブラリであり、画像処理とコンピュータビジョンのための普遍的なアルゴリズムを数多く提供しています。OpenCVはコンピュータビジョン分野で一般的に使用されています。</p>
<p>以下の例では、PythonでOpenCVを使用して、指定した間隔でビデオフレームをキャプチャし、画像として保存する方法を示します。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3（YOLOv3[5]）は、近年提案された1段階の物体検出アルゴリズムである。従来の同じ精度の物体検出アルゴリズムと比較して、YOLOv3は2倍高速である。本トピックで紹介するYOLOv3は、PaddlePaddle[6]の改良版である。複数の最適化手法を用いており、推論速度が向上している。</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet[7]は、そのシンプルさと実用性から、ILSVRC 2015の画像分類部門で優勝した。多くの画像解析手法の基礎として、ResNetは画像検出、セグメンテーション、認識に特化した人気のあるモデルであることが証明されている。</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvusは</a>、機械学習モデルやニューラルネットワークによって生成された埋め込みベクトルを管理するために構築された、クラウドネイティブでオープンソースのベクトルデータベースです。コンピュータビジョン、自然言語処理、計算化学、パーソナライズされたレコメンダーシステムなどのシナリオで広く使用されています。</p>
<p>Milvusがどのように機能するかを以下の手順で説明する。</p>
<ol>
<li>非構造化データはディープラーニングモデルによって特徴ベクトルに変換され、Milvusにインポートされる。</li>
<li>Milvusは特徴ベクトルを保存し、インデックスを作成する。</li>
<li>Milvusは、ユーザーが問い合わせたベクトルと最も類似したベクトルを返す。</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">デプロイメント<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>これでMilvusベースのビデオ解析システムについてある程度ご理解いただけたと思います。システムは主に以下の図のように2つの部分から構成されています。</p>
<ul>
<li><p>赤い矢印はデータのインポート処理を示す。ResNet-50を用いて画像データセットから特徴ベクトルを抽出し、Milvusにインポートする。</p></li>
<li><p>黒い矢印は動画解析のプロセスを示す。まず、動画からフレームを抽出し、画像として保存する。次に、YOLOv3を用いて画像中の物体を検出・抽出する。次に、ResNet-50を使って画像から特徴ベクトルを抽出する。最後に、Milvusがオブジェクトの情報を検索し、対応する特徴ベクトルとともに返す。</p></li>
</ul>
<p>詳細は<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcampを</a>参照：<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">ビデオオブジェクト検出システム</a></p>
<p><strong>データのインポート</strong></p>
<p>データのインポート手順は簡単です。データを2,048次元ベクトルに変換し、Milvusにインポートします。</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>映像解析</strong></p>
<p>上記で紹介したように、ビデオ解析プロセスは、ビデオフレームのキャプチャ、各フレーム内のオブジェクトの検出、オブジェクトからのベクトルの抽出、ユークリッド距離（L2）メトリクスによるベクトルの類似度の計算、Milvusを使用した結果の検索が含まれます。</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>現在、データの80％以上は非構造化データである。AIの急速な発展に伴い、非構造化データを分析するためのディープラーニングモデルの開発が進んでいる。物体検出や画像処理などの技術は、学術界と産業界の両方で大きなブレークスルーを達成している。これらの技術により、より多くのAIプラットフォームが実用的な要件を満たすようになった。</p>
<p>本トピックで取り上げる動画解析システムは、動画コンテンツを迅速に解析できるMilvusで構築されている。</p>
<p>Milvusはオープンソースのベクトルデータベースとして、様々なディープラーニングモデルを用いて抽出された特徴ベクトルをサポートしている。Milvusは、Faiss、NMSLIB、Annoyなどのライブラリと統合され、直感的なAPIセットを提供し、シナリオに応じてインデックスタイプを切り替えることができる。さらに、Milvusはスカラーフィルタリングをサポートし、想起率と検索の柔軟性を高めている。Milvusは、画像処理、コンピュータビジョン、自然言語処理、音声認識、レコメンダーシステム、新薬発見など多くの分野に応用されている。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo."Trademark matching and retrieval in sports video databases.".Proceedings of the international workshop on Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y.Ma."Spatial pyramid mining for logo detection in natural scenes.".IEEE International Conference, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru."ホモグラフィッククラスグラフを用いた自然画像におけるロゴの位置特定と認識".Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7.</p>
<p>[4] R. Boia, C. Florea, L. Florea."Elliptical asift agglomeration in class prototype for logo detection.".BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
