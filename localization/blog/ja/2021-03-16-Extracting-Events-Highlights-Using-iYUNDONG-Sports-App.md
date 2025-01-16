---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: iYUNDONGスポーツアプリを使用してイベントのハイライトを抽出する
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: Milvusで作る スポーツ向け知的画像検索システム App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>iYUNDONGスポーツアプリを使ってイベントのハイライトを抽出する</custom-h1><p>iYUNDONGは、より多くのスポーツ愛好家やマラソンなどのイベント参加者を巻き込むことを目指すインターネット企業である。スポーツイベント中に撮影されたメディアを分析し、ハイライトを自動的に生成する<a href="https://en.wikipedia.org/wiki/Artificial_intelligence">人工知能（AI）</a>ツールを構築している。例えば、スポーツイベントに参加したiYUNDONG sports Appのユーザーは、自撮り写真をアップロードすることで、そのイベントの膨大なメディアデータセットから自分の写真やビデオクリップを瞬時に取り出すことができる。</p>
<p>iYUNDONGアプリの重要な機能の1つは、"Find me in motion "と呼ばれるものです。  カメラマンは通常、マラソンレースなどのスポーツイベント中に大量の写真やビデオを撮影し、iYUNDONGメディアデータベースにリアルタイムで写真やビデオをアップロードする。自分のハイライトを見たいマラソンランナーは、自撮り写真をアップロードするだけで、自分自身を含む写真を取り出すことができる。iYUNDONGアプリ内の画像検索システムがすべての画像マッチングを行うため、ランナーは多くの時間を節約できる。<a href="https://milvus.io/">Milvusは</a>検索プロセスを大幅に高速化し、精度の高い結果を返すことができるため、iYUNDONGはこのシステムに<a href="https://milvus.io/">Milvusを</a>採用しています。</p>
<p><br/></p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">iYUNDONG Sports Appを使ったイベントのハイライトの抽出</a><ul>
<li><a href="#difficulties-and-solutions">困難と解決策</a></li>
<li><a href="#what-is-milvus">Milvusとは</a>-<a href="#an-overview-of-milvus"><em>Milvusの概要です。</em></a></li>
<li><a href="#why-milvus">なぜMilvusなのか？</a></li>
<li><a href="#system-and-workflow">システムとワークフロー</a></li>
<li><a href="#iyundong-app-interface">iYUNDONGアプリのインターフェイス</a>-<a href="#iyundong-app-interface-1"><em>iYUNDONGアプリのインターフェイス。</em></a></li>
<li><a href="#conclusion">まとめ</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">困難と解決策</h3><p>iYUNDONGは画像検索システムを構築するにあたり、以下のような課題に直面し、その解決策を見出すことに成功しました。</p>
<ul>
<li>イベント写真をすぐに検索できるようにすること</li>
</ul>
<p>iYUNDONGはInstantUploadという機能を開発し、イベント写真をアップロード後すぐに検索できるようにしました。</p>
<ul>
<li>膨大なデータセットの保管</li>
</ul>
<p>iYUNDONGのバックエンドには写真や動画などの膨大なデータがミリ秒単位でアップロードされます。そこでiYUNDONGは<a href="https://aws.amazon.com/">AWS</a>、<a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a>、<a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a>などのクラウドストレージシステムに移行し、膨大な量の非構造化データを安全、高速、かつ信頼性の高い方法で処理することにしました。</p>
<ul>
<li>インスタント・リーディング</li>
</ul>
<p>即時読み込みを実現するために、iYUNDONGは独自のシャーディングミドルウェアを開発し、水平スケーラビリティを容易に実現し、ディスク読み込みによるシステムへの影響を軽減しました。また、キャッシュ層として<a href="https://redis.io/">Redisを</a>使用することで、同時並行性が高い状況でも安定したパフォーマンスを実現します。</p>
<ul>
<li>顔の特徴の即時抽出</li>
</ul>
<p>ユーザがアップロードした写真から顔の特徴を正確かつ効率的に抽出するために、iYUNDONGは画像を128次元の特徴ベクトルに変換する独自の画像変換アルゴリズムを開発しました。もう一つの問題は、多くのユーザーや写真家が同時に画像や動画をアップロードすることでした。そのため、システムエンジニアはシステムを展開する際に動的なスケーラビリティを考慮する必要がありました。具体的には、iYUNDONGはクラウド上のエラスティック・コンピュート・サービス（ECS）をフルに活用し、動的なスケーリングを実現しました。</p>
<ul>
<li>迅速かつ大規模なベクトル検索</li>
</ul>
<p>iYUNDONGは、AIモデルによって抽出された大量の特徴ベクトルを保存するためのベクトルデータベースを必要としていました。iYUNDONGは、独自のビジネスアプリケーションのシナリオに従って、ベクトルデータベースに次のような機能を求めました：</p>
<ol>
<li>超大容量のデータセットに対して、高速なベクトル検索を実現すること。</li>
<li>低コストで大量保存を実現する。</li>
</ol>
<p>当初、年間平均100万枚の画像を処理していたため、iYUNDONGは検索用の全データをRAMに保存していました。しかし、過去2年間で、同社のビジネスは急成長を遂げ、非構造化データが指数関数的に増加した。iYUNDONGのデータベース内の画像数は2019年に6,000万枚を超え、保存が必要な特徴ベクトルは10億を超えたことになる。膨大な量のデータは必然的にiYUNDONGのシステムを重くし、リソースを消費させた。そのため、高いパフォーマンスを確保するためにハードウェア設備に継続的に投資する必要があった。具体的には、iYUNDONGはより多くの検索サーバ、より大きなRAM、より性能の良いCPUを配置し、より高い効率性と水平方向のスケーラビリティを実現した。しかし、このソリューションの欠点は、運用コストが法外に高くなってしまうことでした。そのため、iYUNDONGはこの問題に対するより良い解決策を模索し始め、Faissのようなベクトルインデックスライブラリを活用することでコストを削減し、より良いビジネスの舵取りをしようと考えました。最終的にiYUNDONGはオープンソースのベクトルデータベースMilvusを選択しました。</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvusとは？</h3><p>Milvusはオープンソースのベクトルデータベースで、使いやすく、柔軟性が高く、信頼性が高く、高速です。Milvusは、写真認識、音声認識、ビデオ処理、自然言語処理などの様々なディープラーニングモデルと組み合わせることで、様々なAIアルゴリズムを用いてベクトル化された非構造化データを処理・分析することができる。以下は、Milvusがすべての非構造化データを処理するワークフローである：</p>
<p>非構造化データは、ディープラーニングモデルやその他のAIアルゴリズムによって埋め込みベクトルに変換される。</p>
<p>その後、埋め込みベクトルはMilvusに挿入され、保存される。Milvusはまた、それらのベクトルのインデックスを構築する。</p>
<p>Milvusは類似検索を行い、様々なビジネスニーズに基づいた正確な検索結果を返します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONGブログ1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">なぜMilvusなのか？</h3><p>2019年末より、iYUNDONGはMilvusを使った画像検索システムのテストを重ねてきました。テストの結果、Milvusは複数のインデックスをサポートし、RAM使用量を効率的に削減できるため、ベクトル類似検索のタイムラインを大幅に圧縮することができ、他の主流のベクトルデータベースを上回ることが判明した。</p>
<p>さらに、Milvusの新バージョンは定期的にリリースされている。テスト期間中、Milvusはv0.6.0からv0.10.1まで複数回のバージョンアップを経ている。</p>
<p>さらに、活発なオープンソースコミュニティとすぐに使える強力な機能により、MilvusはiYUNDONGが少ない開発予算で運用することを可能にしています。</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">システムとワークフロー</h3><p>iYUNDONGのシステムは、まずカメラマンによってアップロードされたイベント写真から顔を検出し、顔の特徴を抽出します。そして、その顔の特徴を128次元のベクトルに変換し、Milvusのライブラリに格納します。Milvusはそのベクトルに対してインデックスを作成し、瞬時に精度の高い結果を返すことができます。</p>
<p>その他、写真のIDや写真の中の顔の位置を示す座標などの追加情報は、サードパーティーのデータベースに保存される。</p>
<p>iYUNDONGは<a href="https://about.meituan.com/en">Milvusの</a>ベクトルIDと、それに対応する別のデータベースに保存された付加情報を関連付けるために、<a href="https://about.meituan.com/en">Meituan</a>基礎研究開発プラットフォームが開発した分散ID生成サービスである<a href="https://github.com/Meituan-Dianping/Leaf">Leafアルゴリズムを</a>採用しました。特徴ベクトルと付加情報を組み合わせることで、iYUNDONGシステムはユーザ検索時に類似した結果を返すことができる。</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">iYUNDONGアプリのインターフェース</h3><p>トップページには最新のスポーツイベントが表示される。その中の一つをタップすると、詳細が表示されます。</p>
<p>フォトギャラリーページの上部にあるボタンをタップすると、ユーザーは自分の写真をアップロードして、ハイライト画像を取得することができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-インターフェース.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">まとめ</h3><p>この記事では、iYUNDONGアプリが、解像度、サイズ、鮮明度、角度など、類似検索を複雑にする様々な方法でユーザがアップロードした写真に基づいて、正確な検索結果を返すことができるインテリジェントな画像検索システムを構築する方法を紹介した。Milvusの助けを借りて、iYUNDONG Appは6000万枚以上の画像データベースに対してミリ秒レベルのクエリを実行することに成功している。そして、写真検索の精度は常に92％を超えています。Milvusのおかげで、iYUNDONGは限られたリソースで短時間に強力なエンタープライズグレードの画像検索システムを簡単に構築できるようになりました。</p>
<p>Milvusを使ったものづくりについては、他の<a href="https://zilliz.com/user-stories">ユーザーストーリーを</a>お読みください。</p>
