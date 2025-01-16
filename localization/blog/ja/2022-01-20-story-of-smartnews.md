---
id: 2022-01-20-story-of-smartnews.md
title: SmartNewsの物語 - Milvusユーザーから積極的な貢献者へ
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: Milvusのユーザーであり、貢献者でもあるSmartNewsのストーリーをご覧ください。
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>この記事の翻訳：<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">アンジェラ・ニー</a></p>
<p>情報は私たちの生活のいたるところにある。メタ（旧名フェイスブック）、インスタグラム、ツイッター、その他のソーシャルメディア・プラットフォームは、情報ストリームをよりユビキタスなものにしている。そのため、このような情報ストリームを扱うエンジンは、ほとんどのシステム・アーキテクチャにおいて必須となっている。しかし、ソーシャルメディア・プラットフォームや関連アプリのユーザーであれば、記事やニュース、ミームなどの重複に悩まされたことがあるに違いない。重複コンテンツに触れることは、情報検索のプロセスを妨げ、悪いユーザーエクスペリエンスにつながる。</p>
<p>情報ストリームを扱う製品にとって、同一のニュースや広告を重複排除するために、システムアーキテクチャにシームレスに統合できる柔軟なデータプロセッサを見つけることは、開発者にとって最優先事項である。</p>
<p>評価額<a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">20億</a>ドルの<a href="https://www.smartnews.com/en/">SmartNewsは</a>、米国で最も評価の高いニュースアプリ企業である。同社は、オープンソースのベクトル・データベースであるMilvusのユーザーであったが、その後Milvusプロジェクトに積極的に貢献するようになった。</p>
<p>この記事では、SmartNewsのストーリーを紹介し、同社がなぜMilvusプロジェクトに貢献することにしたのかについて述べる。</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">SmartNewsの概要<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNewsは2012年に設立され、東京に本社を置いている。SmartNewsが開発するニュースアプリは、日本市場で常に<a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">トップクラスの評価を得て</a>いる。SmartNewsは<a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">最も急成長している</a>ニュースアプリであり、米国市場でも<a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">高いユーザー粘度を誇って</a>いる。<a href="https://www.appannie.com/en/">APP Annieの</a>統計によると、SmartNewsの月間平均セッション時間は、2021年7月末までにすべてのニュースアプリの中で1位となり、AppleNewsやGoogle Newsの累積セッション時間を上回りました。</p>
<p>SmartNewsは、ユーザーベースと粘度の急速な増加に伴い、レコメンデーションメカニズムとAIアルゴリズムの面でより多くの課題に直面しなければならない。そのような課題には、大規模な機械学習（ML）における膨大な離散的特徴の活用、ベクトル類似性検索による非構造化データクエリの高速化などが含まれます。</p>
<p>2021年の初め、SmartNewsのダイナミック広告アルゴリズムチームは、AIインフラチームに、広告のリコールとクエリの機能を最適化する必要があるとのリクエストを送った。AIインフラエンジニアのシュウは、2カ月にわたる調査の結果、複数のインデックスと類似性メトリクス、オンラインデータ更新をサポートするオープンソースのベクトルデータベース、Milvusの使用を決定した。Milvusは世界中の1000以上の組織から信頼されている。</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">ベクトル類似検索による広告推薦<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>オープンソースのベクトルデータベースMilvusは、SmartNewsの広告システムに採用され、10ミリオンスケールのデータセットからダイナミックな広告をマッチングし、ユーザーに推薦します。そうすることで、SmartNewsは、ユーザーデータと広告データという、これまでマッチングできなかった2つのデータセットの間にマッピング関係を作り出すことができる。2021年第2四半期、シュウはKubernetes上にMilvus 1.0をデプロイすることに成功した。<a href="https://milvus.io/docs">Milvusのデプロイ</a>方法についてはこちらをご覧ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Milvus 1.0のデプロイが成功した後、Milvusを使用する最初のプロジェクトは、SmartNewsの広告チームが開始した広告リコールプロジェクトだった。初期段階では、広告データセットは100万規模であった。一方、P99のレイテンシーは10ミリ秒未満に厳密に制御されていた。</p>
<p>2021年6月、シュウとアルゴリズムチームの同僚たちは、Milvusをより多くのビジネスシナリオに適用し、リアルタイムでのデータ集約とオンラインデータ/インデックス更新を試みた。</p>
<p>現在までに、オープンソースのベクトルデータベースであるMilvusは、広告推薦を含むSmartNewsの様々なビジネスシナリオで使用されている。</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>ユーザーから積極的な貢献者へ</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusをSmartnewsの製品アーキテクチャに統合していく中で、シュウをはじめとする開発者から、ホットリロード、アイテムのTTL（time-to-live）、アイテムの更新／置換などの機能の要望が出てきました。これらは、milvusコミュニティの多くのユーザーが望んでいた機能でもある。そこで、SmartNewsのAIインフラストラクチャチームの責任者であるデニス・ザオは、ホットリロード機能を開発し、コミュニティに貢献することを決めた。デニスは、"SmartNewsチームはMilvusコミュニティから恩恵を受けており、コミュニティと共有できるものがあれば喜んで貢献したい "と考えていた。</p>
<p>データリロードは、コード実行中のコード編集をサポートします。データリロードの助けを借りて、開発者はブレークポイントで停止したり、アプリケーションを再起動したりする必要がなくなりました。代わりに、コードを直接編集し、その結果をリアルタイムで見ることができる。</p>
<p>7月下旬、SmartNewsのエンジニアであるYusup氏は、ホット・リロードを実現するために<a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">コレクション・エイリアスを</a>使用するアイデアを提案した。</p>
<p>コレクションエイリアスの作成とは、コレクションにエイリアス名を指定することである。コレクションは複数のエイリアスを持つことができる。しかし、エイリアスは最大1つのコレクションに対応する。コレクションとロッカーを比較してみましょう。ロッカーは、コレクションのように、それ自身の番号と位置を持ち、それは常に変更されません。しかし、ロッカーから常に異なるものを入れたり引き出したりすることができる。同様に、コレクションの名前は固定ですが、コレクション内のデータは動的です。Milvusの<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">GA以前のバージョンでは</a>、データ削除がサポートされているため、コレクション内のベクターの挿入や削除はいつでも可能です。</p>
<p>SmartNews広告ビジネスの場合、新しいダイナミック広告ベクターが生成されると、1億近いベクターが挿入または更新されます。これにはいくつかの解決策がある：</p>
<ul>
<li>解決策1：まず古いデータを削除し、新しいデータを挿入する。</li>
<li>解決策2：新しいデータ用に新しいコレクションを作成する。</li>
<li>解決策3：コレクションエイリアスを使用する。</li>
</ul>
<p>解決策1について、最も端的な欠点は、特に更新するデータセットが膨大な場合、非常に時間がかかることである。億単位のデータセットを更新するには、一般的に数時間かかる。</p>
<p>解決策2に関しては、新しいコレクションがすぐに検索できないことが問題である。つまり、ロード中はコレクションを検索できない。さらに、Milvusは2つのコレクションが同じコレクション名を使うことを許さない。新しいコレクションに切り替えるには、常にユーザーがクライアント側のコードを手動で修正する必要があります。つまり、コレクションを切り替える必要があるたびに、<code translate="no">collection_name</code> パラメータの値を修正しなければなりません。</p>
<p>解決策3は特効薬です。新しいコレクションに新しいデータを挿入し、コレクションエイリアスを使用するだけです。そうすることで、検索を行うためにコレクションを切り替える必要があるたびに、コレクションエイリアスを入れ替えるだけでよい。コードを修正するための余分な労力は必要ありません。この解決策を使えば、前の2つの解決策で述べたような手間が省けます。</p>
<p>Yusupは、この要望からスタートし、SmartNewsチーム全体がMilvusのアーキテクチャを理解する手助けをした。1ヶ月半後、MilvusプロジェクトはYusupからホットリロードに関するPRを受け取った。そしてその後、この機能はMilvus 2.0.0-RC7のリリースとともに正式に利用できるようになった。</p>
<p>現在、AIインフラチームが中心となり、Milvus 2.0の導入と、Milvus 1.0から2.0への全データの移行を順次進めている。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection エイリアス</span> </span></p>
<p>コレクションエイリアスのサポートは、特に大量のユーザーリクエストを抱える大規模なインターネット企業にとって、ユーザーエクスペリエンスを大幅に向上させることができる。MilvusとSmartnewsの架け橋となったMilvusコミュニティのデータエンジニアであるChenglong Liは、「コレクションエイリアス機能は、MilvusユーザーであるSmartNewsの実際のビジネスリクエストから生まれました。そしてSmartNewsは、Milvusコミュニティにコードを提供してくれました。この互恵的な行為は、コミュニティからコミュニティのためにというオープンソース精神の素晴らしい例です。我々は、SmartNewsのような貢献者が増え、共同でより繁栄したMilvusコミュニティを構築することを望んでいる。"</p>
<p>"現在、広告ビジネスの一部がオフラインベクターデータベースとしてMilvusを採用している。Milvus 2.0の正式リリースが近づいており、Milvusを使ってより信頼性の高いシステムを構築し、より多くのビジネスシーンにリアルタイムサービスを提供できることを期待しています」とデニスは語った。</p>
<blockquote>
<p>更新: Milvus 2.0は現在一般公開されています！<a href="/blog/ja/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">詳細はこちら</a></p>
</blockquote>
