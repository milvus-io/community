---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: VOVAとmilvusによる画像検索ショッピング体験の構築
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  オープンソースのベクターデータベースであるMilvusが、EコマースプラットフォームのVOVAでどのように使用され、画像によるショッピングを実現したかをご覧ください。
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>VOVAとmilvusによる画像検索ショッピング体験の構築</custom-h1><p>ジャンプする</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">VOVAとMilvusによる画像検索ショッピング体験の構築</a><ul>
<li><a href="#how-does-image-search-work">画像検索の仕組み</a>-<a href="#system-process-of-vovas-search-by-image-functionality"><em>VOVAの画像検索機能のシステムプロセス。</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">YOLOモデルによるターゲット検出</a>-<a href="#yolo-network-architecture"><em>YOLOネットワークアーキテクチャ。</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">ResNetによる画像特徴ベクトル抽出</a>-<a href="#resnet-structure"><em>ResNetの構造。</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Milvusによるベクトル類似検索</a>-<a href="#mishards-architecture-in-milvus"><em>Milvusのアーキテクチャ。</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVAの画像ショッピングツール</a>-<a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>VOVAの画像ショッピングツールのスクリーンショット。</em></a></li>
<li><a href="#reference">リファレンス</a></li>
</ul></li>
</ul>
<p>2020年、コロナウィルスの大流行の影響もあり、オンラインショッピングが<a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">44％増と</a>急増。人々は社会的に距離を置き、見知らぬ人との接触を避けようとしたため、多くの消費者にとって非接触型配送は信じられないほど望ましい選択肢となった。この人気はまた、従来のキーワード検索では説明しにくいニッチな商品を含む、より多様な商品をオンラインで購入する人々にもつながっている。</p>
<p>ユーザーがキーワードベースのクエリの限界を克服できるように、企業は、ユーザーが検索に言葉の代わりに画像を使用できる画像検索エンジンを構築することができます。これにより、ユーザーは説明しにくいアイテムを見つけることができるだけでなく、実生活で遭遇するものを買い物することもできる。この機能は、ユニークなユーザー体験の構築に役立ち、顧客に喜ばれる一般的な利便性を提供する。</p>
<p>VOVAは、手頃な価格と、ユーザーにポジティブなショッピング体験を提供することに重点を置く新興Eコマース・プラットフォームで、数百万点の商品を網羅し、20の言語と35の主要通貨をサポートしている。ユーザーのショッピング体験を向上させるため、同社はMilvusを利用してEコマース・プラットフォームに画像検索機能を組み込んだ。この記事では、VOVAがMilvusを使ってどのように画像検索エンジンの構築に成功したかを紹介する。</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">画像検索の仕組み</h3><p>VOVAのshop by imageシステムは、ユーザーがアップロードした商品画像と類似した商品画像を、同社の在庫から検索する。次の図は、システムプロセスの2つの段階、データインポート段階（青）とクエリ段階（オレンジ）を示しています：</p>
<ol>
<li>YOLOモデルを使用して、アップロードされた写真からターゲットを検出します；</li>
<li>ResNetを使用して、検出されたターゲットから特徴ベクトルを抽出する；</li>
<li>Milvusを使ってベクトルの類似性を検索する。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">YOLOモデルによるターゲット検出</h3><p>VOVAのAndroidとiOSのモバイルアプリは現在、画像検索をサポートしている。同社はYOLO（You only look once）と呼ばれる最先端のリアルタイム物体検出システムを使い、ユーザーがアップロードした画像から物体を検出する。YOLOモデルは現在5回目の反復が行われている。</p>
<p>YOLOは1段階のモデルで、1つの畳み込みニューラルネットワーク（CNN）のみを使用して、さまざまなターゲットのカテゴリーと位置を予測する。小型でコンパクトであり、モバイル使用に適している。</p>
<p>YOLOは畳み込み層を使って特徴を抽出し、完全連結層を使って予測値を得る。GooLeNetモデルからヒントを得て、YOLOのCNNは24の畳み込み層と2つの完全連結層を含む。</p>
<p>以下の図が示すように、448 × 448の入力画像は、多数の畳み込み層とプーリング層によって7 × 7 × 1024次元のテンソル（下の3番目から最後の立方体に描かれている）に変換され、2つの完全連結層によって7 × 7 × 30次元のテンソル出力に変換される。</p>
<p>YOLO Pの予測出力は2次元テンソルであり、その形状は[batch,7 ×7 ×30]である。スライシングを用いると、P[:,0:7×7×20]はカテゴリ確率、P[:,7×7×20:7×7×(20+2)]は信頼度、P[:,7×7×(20+2)]:]はバウンディングボックスの予測結果である。</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;YOLO network architecture.&quot;)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">ResNetによる画像特徴ベクトル抽出</h3><p>VOVAでは、豊富な商品画像ライブラリとユーザがアップロードした写真から特徴ベクトルを抽出するために、残差ニューラルネットワーク（ResNet）モデルを採用しました。ResNetは、学習ネットワークの深さが深くなるにつれてネットワークの精度が低下するため、限界があります。下の画像は、VGG19モデル（VGGモデルの変形）を実行するResNetを描いたもので、短絡メカニズムによって残差ユニットを含むように修正されています。VGGは2014年に提案され、わずか14層であるのに対し、ResNetはその1年後に登場し、最大152層を持つことができる。</p>
<p>ResNetの構造は変更や拡張が容易だ。ブロック内のチャンネル数とブロックの積層数を変えることで、ネットワークの幅と深さを簡単に調整でき、異なる表現能力を持つネットワークを得ることができる。これにより、学習の深さが深くなるにつれて精度が低下するという、ネットワークの退化効果を効果的に解決することができる。十分な学習データがあれば、ネットワークを徐々に深化させながら表現力を向上させたモデルを得ることができる。モデルの学習により、各画像の特徴が抽出され、256次元の浮動小数点ベクトルに変換される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Milvusによるベクトル類似検索</h3><p>VOVAの商品画像データベースには3,000万枚の画像があり、急速に増加しています。この膨大なデータセットから最も類似した商品画像を素早く検索するために、Milvusを使用してベクトル類似検索を行っています。Milvusは多くの最適化により、ベクトルデータの管理と機械学習アプリケーションの構築に高速かつ合理的なアプローチを提供します。Milvusは、一般的なインデックスライブラリ（Faiss、Annoyなど）との統合を提供し、複数のインデックスタイプと距離メトリクスをサポートし、複数の言語でのSDKを持ち、ベクトルデータを管理するための豊富なAPIを提供します。</p>
<p>Milvusは1兆ベクトル規模のデータセットに対してミリ秒単位で類似検索を行うことができ、nq=1の場合のクエリ時間は1.5秒以下、平均バッチクエリ時間は0.08秒以下である。VOVAは画像検索エンジンを構築するにあたり、Milvusのシャーディング・ミドルウェア・ソリューションであるMishardsの設計を参考にし（システム設計は下図を参照）、可用性の高いサーバークラスタを実装した。Milvusクラスタの水平スケーラビリティを活用することで、膨大なデータセットに対する高いクエリ性能というプロジェクト要件を満たすことができました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">VOVAのshop by imageツール</h3><p>以下のスクリーンショットは、同社のAndroidアプリにおけるVOVAの画像検索ショッピングツールです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>より多くのユーザーが商品を検索し、写真をアップロードするにつれて、VOVAはシステムを動かすモデルの最適化を続けていく。また、Milvusの新機能を取り入れることで、ユーザーのオンラインショッピング体験をさらに向上させていく。</p>
<h3 id="Reference" class="common-anchor-header">参考資料</h3><p><strong>YOLO：</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet：</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus：</strong></p>
<p>https://milvus.io/docs</p>
