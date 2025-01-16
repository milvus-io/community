---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: キーワード検索
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: TokopediaはMilvusを使って10倍スマートな検索システムを構築し、ユーザーエクスペリエンスを劇的に向上させました。
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>セマンティック検索で検索を10倍賢くした方法</custom-h1><p>トコペディアでは、商品コーパスの価値は、バイヤーが自分に関連する商品を見つけることができて初めて発揮されることを理解しており、検索結果の関連性の向上に努めています。</p>
<p>そのため、検索結果の関連性を高める努力をしています<strong>。</strong>モバイル端末で検索結果ページを表示すると、「...」ボタンが表示され、その商品と類似した商品を検索できるメニューが表示されます。</p>
<h2 id="Keyword-based-search" class="common-anchor-header">キーワード検索<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Searchは、商品の検索とランキングに<strong>Elasticsearchを</strong>使用しています。各検索リクエストに対して、まず Elasticsearch に問い合わせを行い、検索クエリに従って商品をランク付けします。Elasticsearchは、各単語を各文字の<a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a>（またはUTF）コードを表す数字の列として保存します。Elasticsearchは、ユーザーのクエリに含まれる単語がどの文書に含まれているかを素早く見つけるために<a href="https://en.wikipedia.org/wiki/Inverted_index">転置インデックスを</a>構築し、様々なスコアリング・アルゴリズムを用いてその中から最もマッチするものを見つけます。これらのスコアリングアルゴリズムは、単語の意味にはほとんど注意を払わず、むしろそれらが文書内でどれだけ頻繁に出現するか、どれだけ互いに近いか、などに注意を払う。ASCII表現は明らかに、意味を伝えるのに十分な情報を含んでいる（結局のところ、私たち人間はそれを理解することができる）。残念ながら、コンピュータがASCIIエンコードされた単語をその意味によって比較するための優れたアルゴリズムはない。</p>
<h2 id="Vector-representation" class="common-anchor-header">ベクトル表現<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>この解決策のひとつは、単語に含まれる文字だけでなく、その意味についても教えてくれるような、別の表現を考え出すことだろう。例えば、<em>その単語が他のどの単語と一緒によく使われるかを</em>符号化することができる（可能性の高い文脈で表現）。そして、似たような文脈は似たようなものを表すと仮定し、数学的手法を使って比較しようとする。文章全体をその意味によって符号化する方法を見つけることもできるだろう。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>ブログ_セマンティック検索を使って検索を10倍賢くする方法_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">埋め込み類似検索エンジンを選ぶ<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>さて、特徴ベクトルが手に入ったところで、残る問題は、大量のベクトルの中から、目的のベクトルと似ているものをどうやって取り出すかです。埋め込み類似度検索エンジンに関しては、Githubで公開されているFAISS, Vearch, MilvusなどのエンジンでPOCを試みました。</p>
<p>負荷テストの結果、Milvusを優先しました。一方、FAISSは以前他のチームで使ったことがあるので、新しいものを試してみたいと思っています。Milvusに比べ、FAISSは基礎的なライブラリであるため、使い勝手はあまりよくありません。Milvusについて学ぶにつれ、私たちは最終的にMilvusの2つの主な特徴からMilvusを採用することに決めました：</p>
<ul>
<li><p>Milvusは非常に使いやすい。Milvusは非常に使いやすい。Dockerイメージを引っ張ってきて、自分のシナリオに基づいてパラメータを更新するだけでいい。</p></li>
<li><p>より多くのインデックスをサポートし、詳細なサポート・ドキュメントがある。</p></li>
</ul>
<p>一言で言えば、Milvusはユーザーにとって非常に使いやすく、ドキュメントも非常に詳しい。何か問題が発生した場合、通常はドキュメントで解決策を見つけることができる。そうでなければ、いつでもMilvusコミュニティからサポートを受けることができる。</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvusクラスタサービス<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>機能ベクトル検索エンジンとしてmilvusを使用することを決めた後、私たちは<a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">milvusを</a>広告サービスのユースケースの一つに使用することにしました。開発（DEV）環境にスタンドアロンノードを設定し、配信を開始したところ、数日間順調に稼働し、CTR/CVRの指標も改善されました。本番環境でスタンドアロンノードがクラッシュすると、サービス全体が利用できなくなります。したがって、可用性の高い検索サービスを展開する必要があります。</p>
<p>Milvusは、クラスタ・シャーディング・ミドルウェアであるMishardsと、コンフィギュレーション用のMilvus-Helmの両方を提供しています。TokopediaではインフラのセットアップにAnsibleのプレイブックを使っているので、インフラ・オーケストレーション用のプレイブックを作成した。Milvusのドキュメントにある下の図は、Milvusがどのように動作するかを示している：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_3.png</span> </span></p>
<p>Mishardsは、アップストリームからのリクエストを分割したサブモジュールにカスケードし、サブサービスの結果を収集し、アップストリームに返す。Mishardsベースのクラスター・ソリューションの全体的なアーキテクチャを以下に示す。<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>公式ドキュメントではMishardsについてわかりやすく紹介している。興味のある方は<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishardsを</a>参照されたい。</p>
<p>私たちのキーワード検索サービスでは、Milvus ansibleを使って、書き込み可能なノード1つ、読み取り専用ノード2つ、Mishardsミドルウェアインスタンス1つをGCPにデプロイした。今のところ安定しています。類似検索エンジンが依存する100万、10億、あるいは1兆のベクトル・データセットに効率的にクエリをかけることを可能にする巨大な要素は、ビッグデータ検索を劇的に加速させるデータ整理のプロセスである<a href="https://milvus.io/docs/v0.10.5/index.md">インデクシング</a>である。</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">ベクターインデキシングはどのように類似性検索を加速するのか？<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>類似性検索エンジンは、入力とデータベースを比較して、入力に最も似ているオブジェクトを見つけることで動作する。インデクシングはデータを効率的に整理するプロセスであり、大規模なデータセットに対する時間のかかるクエリを劇的に高速化することで、類似性検索を有用なものにする上で大きな役割を果たす。膨大なベクトルデータセットがインデックス化された後、クエリは入力クエリと類似したベクトルを含む可能性が最も高いクラスタ、つまりデータのサブセットにルーティングすることができる。実際には、本当に大きなベクトルデータに対するクエリを高速化するために、ある程度の精度が犠牲になることを意味する。</p>
<p>単語がアルファベット順に並べられた辞書に例えることができる。単語を調べるとき、同じ頭文字の単語だけを含むセクションに素早く移動することができる。</p>
<h2 id="What-next-you-ask" class="common-anchor-header">次はどうする？<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>ブログ_セマンティック検索を使って検索を10倍賢くする方法_5.jpeg</span> </span></p>
<p>上に示したように、すべてに当てはまる解決策はありません。私たちは常に、埋め込みを取得するために使用されるモデルのパフォーマンスを向上させたいと考えています。</p>
<p>また、技術的な観点からは、複数の学習モデルを同時に実行し、様々な実験結果を比較したいと考えています。画像検索やビデオ検索などの実験については、このページをご覧ください。</p>
<p><br/></p>
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
    </button></h2><ul>
<li>Milvus Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Milvus: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus：https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>このブログ記事はhttps://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821 から転載しました。</em></p>
<p>Milvusを使ったものづくりについては、他の<a href="https://zilliz.com/user-stories">ユーザーストーリーも</a>ご覧ください。</p>
