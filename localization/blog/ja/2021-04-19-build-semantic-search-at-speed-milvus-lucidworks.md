---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: セマンティック検索をスピード構築
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: セマンティック機械学習の手法を使用して、組織全体でより関連性の高い検索結果を実現する方法について詳しく説明します。
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>セマンティック検索をスピード構築</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">セマンティック検索は</a>、顧客や従業員が適切な商品や情報を見つけるのに役立つ優れたツールです。また、インデックスされにくい情報であっても、より良い検索結果を得ることができます。とはいえ、セマンティックの手法が迅速に導入されなければ、何の役にも立ちません。顧客や従業員は、システムが時間をかけてクエリに応答している間、ただ座っているわけではありません。</p>
<p>セマンティック検索を高速化するには？遅いセマンティック検索ではだめなのだ。</p>
<p>幸いなことに、Lucidworksはこのような問題を解決するのが大好きだ。私たちは最近、中規模のクラスタをテストした。詳細はこちらをご覧いただきたいが、100万件以上のドキュメントに対して1500RPS（リクエスト・パー・セカンド）を達成し、平均レスポンスタイムは約40ミリ秒であった。これはかなりのスピードだ。</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">セマンティック検索の実装</h3><p>光速の機械学習マジックを実現するため、ルシッドワークスはセマンティックベクター検索アプローチを使ってセマンティック検索を実装した。2つの重要な部分がある。</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">パート1：機械学習モデル</h4><p>まず、テキストを数値ベクトルにエンコードする方法が必要です。テキストは商品の説明、ユーザーの検索クエリ、質問、あるいは質問に対する答えなどである。セマンティック検索モデルは、他のテキストと意味的に似ているテキストが、数値的に「近い」ベクトルにエンコードされるように、テキストをエンコードするように学習される。このエンコーディングステップは、毎秒1,000以上の可能性のある顧客検索やユーザークエリをサポートするために高速である必要があります。</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">パート2：ベクトル検索エンジン</h4><p>次に、顧客検索やユーザークエリに最適なものを素早く見つける方法が必要です。モデルはテキストを数値ベクトルにエンコードします。そこから、カタログや質問と回答のリストにあるすべての数値ベクトルと比較し、ベストマッチ、つまりクエリのベクトルに「最も近い」ベクトルを見つける必要があります。そのためには、すべての情報を効率的かつ高速に処理できるベクトルエンジンが必要です。エンジンには何百万ものベクトルが含まれている可能性がありますが、本当に必要なのはクエリにベストマッチする20個ほどのベクトルだけです。そしてもちろん、そのようなクエリーを毎秒1000ほど処理する必要があります。</p>
<p>このような課題に取り組むため、私たちは<a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Fusion 5.3リリースに</a>ベクター検索エンジン<a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvusを</a>追加しました。Milvusはオープンソースのソフトウェアで、高速です。MilvusはFAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>)を使用しており、これはフェイスブックが自社の機械学習イニシアチブに実運用で使用しているのと同じ技術です。必要であれば、<a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>上でさらに高速に実行できる。Fusion 5.3（またはそれ以降）に機械学習コンポーネントがインストールされている場合、Milvusはそのコンポーネントの一部として自動的にインストールされるため、これらの機能を簡単にオンにすることができます。</p>
<p>コレクション作成時に指定されたコレクション内のベクトルのサイズは、そのベクトルを生成するモデルによって異なります。たとえば、あるコレクションは、商品カタログのすべての商品説明を（モデルを介して）エンコードして作成されたベクトルを格納することができます。Milvusのようなベクトル検索エンジンがなければ、ベクトル空間全体で類似検索を行うことは不可能である。そのため、類似検索はベクトル空間からあらかじめ選択された候補（例えば500）に限定されることになり、パフォーマンスが低下し、結果の品質も低下する。Milvusは、複数のベクトルコレクションにまたがる数千億のベクトルを保存することができ、検索が高速で結果が適切であることを保証します。</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">セマンティック検索の使用</h3><p>Milvusがなぜ重要なのかが少し分かったところで、セマンティック検索のワークフローに戻ろう。セマンティック検索には3つの段階がある。最初の段階では、機械学習モデルがロードされ、トレーニングされる。その後、データはMilvusとSolrにインデックスされる。最後の段階はクエリーの段階であり、実際の検索が行われる。以下、最後の2つのステージに焦点を当てる。</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Milvusへのインデックス作成</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>ルシッドワークス-1.png</span> </span></p>
<p>上の図に示すように、クエリーステージはインデックス作成ステージと同様に始まります。それぞれのクエリに対して</p>
<ol>
<li>クエリは<a href="https://lucidworks.com/products/smart-answers/">Smart Answersの</a>インデックスパイプラインに送られる。</li>
<li>その後、クエリはMLモデルに送られます。</li>
<li>MLモデルは（クエリから暗号化された）数値ベクトルを返します。ここでもモデルの種類によってベクトルのサイズが決まります。</li>
<li>このベクトルはMilvusに送られ、Milvusは指定されたMilvusコレクションの中で、提供されたベクトルに最もマッチするベクトルを決定します。</li>
<li>Milvusはステップ4で決定されたベクトルに対応する一意のIDと距離のリストを返す。</li>
<li>これらのIDと距離を含むクエリがSolrに送られる。</li>
<li>SolrはそれらのIDに関連するドキュメントの順序付きリストを返す。</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">スケールテスト</h3><p>我々のセマンティック検索フローが、我々が顧客に要求する効率で実行されていることを証明するため、Google Cloud Platform上で、MLモデルのレプリカ8個、クエリーサービスのレプリカ8個、Milvusのインスタンス1個を持つFusionクラスタを使って、Gatlingスクリプトを使ったスケールテストを実行した。テストはMilvusのFLATインデックスとHNSWインデックスを用いて実行された。FLATインデックスは100%の再現率を持つが、データセットが小さい場合を除き、効率は低い。HNSW (Hierarchical Small World Graph)インデックスは依然として高品質な結果を示し、より大きなデータセットではパフォーマンスが向上している。</p>
<p>それでは、私たちが最近実行した例の数字をいくつか見てみよう：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>ルシッドワークス-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>ルシードワークス-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>ルシッドワークス-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">はじめに</h3><p><a href="https://lucidworks.com/products/smart-answers/">Smart Answersの</a>パイプラインは使いやすく設計されています。Lucidworksには、<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">導入が簡単</a>で一般的に良好な結果をもたらす<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">事前トレーニング済みモデルが</a>あります。このような取り組みを検索ツールに導入することで、より効果的で楽しい検索結果を実現する方法については、今すぐお問い合わせください。</p>
<blockquote>
<p>このブログは https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin から転載しました。</p>
</blockquote>
