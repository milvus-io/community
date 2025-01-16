---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: XiaomiのモバイルブラウザにMilvusのAIを搭載したニュース推薦機能を組み込む
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  シャオミがどのようにAIとMilvusを活用してインテリジェントなニュース推薦システムを構築し、モバイルウェブブラウザのユーザーに最も関連性の高いコンテンツを見つけることができるかをご覧ください。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Milvusと作る：シャオミのモバイルブラウザにAIを搭載したニュース推薦機能を組み込む</custom-h1><p>ソーシャルメディアのフィードからSpotifyのプレイリスト推薦まで、<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">人工知能は</a>すでに私たちが毎日見たり接したりするコンテンツで大きな役割を果たしている。多国籍電子機器メーカーのシャオミは、自社のモバイル・ウェブ・ブラウザを差別化するために、AIを搭載したニュース推薦エンジンを構築した。<a href="https://milvus.io/">Milvusは</a>、類似検索と人工知能のために特別に構築されたオープンソースのベクトル・データベースで、アプリケーションのコア・データ管理プラットフォームとして使用された。この記事では、シャオミがどのようにしてAIを搭載したニュースレコメンデーションエンジンを構築したのか、またMilvusやその他のAIアルゴリズムがどのように使用されたのかを説明する。</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">AIを使ってパーソナライズされたコンテンツを提案し、ニュースのノイズをカットする</h3><p>ニューヨーク・タイムズだけでも毎日<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230</a>以上のコンテンツが掲載されており、膨大な量の記事が作成されているため、個人がすべてのニュースを包括的に把握することは不可能だ。大量のコンテンツをふるいにかけ、最も関連性の高い、あるいは興味深い記事を推薦するために、私たちはますますAIに頼るようになっている。レコメンデーションは完璧には程遠いものの、機械学習は、複雑化し相互接続が進むこの世界から絶え間なく溢れ出る新しい情報の流れを断ち切るために、ますます必要になってきている。</p>
<p>シャオミは、スマートフォン、モバイルアプリ、ノートパソコン、家電製品、その他多くの製品を製造し、投資している。同社が四半期ごとに販売する4000万台以上のスマートフォンの多くにプリインストールされているモバイルブラウザを差別化するために、シャオミはニュース推薦システムを組み込んだ。ユーザーがシャオミのモバイル・ブラウザを起動すると、人工知能がユーザーの検索履歴や興味などに基づいて類似のコンテンツを推薦する。Milvusは、関連記事の検索を高速化するために使用されるオープンソースのベクトル類似検索データベースである。</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">AIによるコンテンツ推薦の仕組み</h3><p>ニュース推薦（または他のタイプのコンテンツ推薦システム）の核心は、類似情報を見つけるために入力データを巨大なデータベースと比較することである。コンテンツ推薦を成功させるためには、関連性と適時性のバランスをとり、膨大な量の新しいデータを効率的に取り込む必要がある。</p>
<p>膨大なデータセットに対応するため、推薦システムは通常2つの段階に分けられる：</p>
<ol>
<li><strong>検索</strong>：検索：検索では、ユーザーの興味や行動に基づいて、幅広いライブラリからコンテンツが絞り込まれる。シャオミのモバイルブラウザでは、数百万のニュース記事を含む膨大なデータセットから数千のコンテンツが選択される。</li>
<li><strong>並べ替え</strong>：次に、検索中に選択されたコンテンツは、ユーザーにプッシュされる前に、特定の指標に従ってソートされる。ユーザーが推薦されたコンテンツにアクセスすると、システムはリアルタイムで適応し、より関連性の高い提案を提供する。</li>
</ol>
<p>ニュースコンテンツの推奨は、ユーザーの行動と最近公開されたコンテンツに基づいてリアルタイムで行われる必要がある。さらに、提案されるコンテンツは、可能な限りユーザーの関心や検索意図に合致していなければならない。</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = インテリジェントなコンテンツ提案</h3><p>Milvusはオープンソースのベクトル類似検索データベースであり、ディープラーニングモデルと統合することで、自然言語処理、本人確認、その他多くのアプリケーションを強化することができる。Milvusは、検索をより効率的にするために大規模なベクトルデータセットにインデックスを付け、機械学習アプリケーションの開発プロセスを簡素化するために様々な一般的なAIフレームワークをサポートしています。これらの特徴により、このプラットフォームは多くの機械学習アプリケーションの重要な要素であるベクトルデータの保存とクエリに理想的なものとなっている。</p>
<p>Milvusは高速で信頼性が高く、設定やメンテナンスが最小限で済むため、Xiaomiはインテリジェントなニュース推薦システムのベクトルデータ管理にMilvusを選択した。しかし、展開可能なアプリケーションを構築するためには、MilvusをAIアルゴリズムと組み合わせる必要がある。シャオミは、推薦エンジンの言語表現モデルとしてBERT（Bidirectional Encoder Representation Transformersの略）を選択した。BERTは一般的なNLU（自然言語理解）モデルとして使用でき、さまざまなNLP（自然言語処理）タスクを推進できる。その主な特徴は以下のとおりです：</p>
<ul>
<li>BERT の変換器は、アルゴリズムの主要なフレームワークとして使用され、文の中と文の間の明示的および暗黙的な関係を捕捉することができます。</li>
<li>マルチタスク学習目標、マスク言語モデリング（MLM）、次文予測（NSP）。</li>
<li>BERTは、データ量が多いほど性能が向上し、変換行列として機能することで、Word2Vecなどの他の自然言語処理技術を強化することができる。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>BERTのネットワーク・アーキテクチャは、従来のRNNやCNNニューラルネットワークを放棄した多層変換構造を使用している。アテンション機構により、任意の位置にある2つの単語間の距離を1つに変換することで動作し、NLPに以前から存在する依存性の問題を解決する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERTは、単純なモデルと複雑なモデルを提供する。対応するハイパーパラメータは以下の通りである：BERT BASE: L = 12, H = 768, A = 12, パラメータ総数110M; BERT LARGE: L = 24, H = 1024, A = 16, パラメータ総数340M。</p>
<p>上記のハイパーパラメータにおいて、Lはネットワークの層数（すなわちTransformerブロックの数）を表し、AはMulti-Head Attentionにおける自己注意の数を表し、フィルタサイズは4Hである。</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Xiaomiのコンテンツ推薦システム</h3><p>Xiaomiのブラウザベースのニュース推薦システムは、ベクトル化、IDマッピング、近似最近傍（ANN）サービスの3つの主要なコンポーネントに依存している。</p>
<p>ベクトル化とは、記事のタイトルを一般的な文ベクトルに変換する処理である。Xiaomiの推薦システムでは、BERTに基づくSimBertモデルが使用されている。SimBertは隠れサイズが768の12層モデルである。Simbertは、連続学習に学習モデル中国語L-12_H-768_A-12を使用しています（学習タスクは「メトリック学習+UniLM」であり、Adamオプティマイザを使用してサインルTITAN RTX上で117万ステップを学習しています（学習率2e-6、バッチサイズ128）。簡単に言えば、これは最適化された BERT モデルである。</p>
<p>ANNアルゴリズムは、ベクトル化された記事タイトルをMilvusに保存されているニュースライブラリ全体と比較し、類似したコンテンツをユーザーに返す。IDマッピングは、対応する記事のページビューやクリック数などの関連情報を取得するために使用される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Milvusに保存されているシャオミのニュースレコメンデーションエンジンのデータは常に更新されており、追加記事やアクティビティ情報も含まれている。システムが新しいデータを取り込むと、古いデータは消去されなければならない。このシステムでは、最初のT-1日間は完全なデータ更新が行われ、その後のT日間は増分更新が行われる。</p>
<p>決められた間隔で古いデータが削除され、T-1日分の処理済みデータがコレクションに挿入される。ここでは、新しく生成されたデータがリアルタイムで組み込まれる。新しいデータが挿入されると、Milvusで類似性検索が行われる。取得された記事は再びクリック率などでソートされ、上位のコンテンツがユーザーに表示される。このように、データが頻繁に更新され、結果をリアルタイムに配信する必要があるシナリオにおいて、Milvusが新しいデータを迅速に取り込み、検索することで、シャオミのモバイルブラウザにおけるニュースコンテンツ・レコメンデーションを飛躍的に高速化することが可能となる。</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvusはベクトル類似検索を向上させる</h3><p>データをベクトル化し、ベクトル間の類似度を計算することは、最も一般的に使用されている検索技術である。ANNベースのベクトル類似検索エンジンの台頭により、ベクトル類似度計算の効率は大幅に向上した。Milvusは、類似ソリューションと比較して、最適化されたデータストレージ、豊富なSDK、検索レイヤーの構築負荷を大幅に軽減する分散版を提供しています。さらに、Milvusの活発なオープンソースコミュニティは、質問や問題が発生した際のトラブルシューティングを支援する強力なリソースです。</p>
<p>ベクトル類似検索とMilvusについてより詳しく知りたい方は、以下のリソースをご覧ください：</p>
<ul>
<li>Githubで<a href="https://github.com/milvus-io/milvus">Milvusを</a>チェックする。</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">ベクター類似性検索は平易に隠れる</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">ベクトルインデックスによるビッグデータの類似検索の高速化</a></li>
</ul>
<p>Milvusを使ったものづくりについては、他の<a href="https://zilliz.com/user-stories">ユーザーストーリーを</a>ご覧ください。</p>
