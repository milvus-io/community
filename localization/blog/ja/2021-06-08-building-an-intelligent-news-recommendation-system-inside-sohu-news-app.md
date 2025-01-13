---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: セマンティック・ベクトル検索を使ったコンテンツ推薦
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: Milvusを使ってアプリ内にインテリジェントなニュース推薦システムを構築した方法をご紹介します。
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>捜狐ニュースアプリ内にインテリジェントなニュース推薦システムを構築する</custom-h1><p><a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">アメリカ人の71％が</a>ソーシャル・プラットフォームからニュースを推薦されるようになり、パーソナライズされたコンテンツは急速に新しいメディアを発見する方法となった。人々が特定のトピックを検索するにしても、おすすめコンテンツと交流するにしても、ユーザーが目にするものはすべて、クリックスルー率（CTR）、エンゲージメント、関連性を向上させるアルゴリズムによって最適化されている。捜狐はNASDAQに上場している中国のオンラインメディア、ビデオ、検索、ゲームグループである。同社は、<a href="https://zilliz.com/">Zillizが</a>構築したオープンソースのベクトルデータベース<a href="https://milvus.io/">Milvusを</a>活用し、ニュースアプリ内にセマンティックベクトル検索エンジンを構築した。この記事では、同社がユーザープロファイルを利用して、パーソナライズされたコンテンツ推薦を長期にわたって微調整し、ユーザーエクスペリエンスとエンゲージメントを向上させた方法について説明する。</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">セマンティック・ベクトル検索を使ったコンテンツ推薦<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>捜狐ニュースのユーザープロファイルは、閲覧履歴から作成され、ユーザーがニュースコンテンツを検索し、インタラクションするたびに調整される。捜狐のレコメンダー・システムは、セマンティック・ベクトル検索を使って関連するニュース記事を見つける。このシステムは、閲覧履歴に基づいて各ユーザーの関心が高いと予想されるタグのセットを特定することで機能する。そして、関連記事を素早く検索し、その結果を人気度（平均CTRで測定）でソートしてからユーザーに提供する。</p>
<p>ニューヨーク・タイムズだけでも1日に<a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230ものコンテンツが</a>発行されており、効果的なレコメンデーション・システムが処理できなければならない新しいコンテンツの大きさを垣間見ることができる。大量のニュースを取り込むには、ミリ秒単位の類似検索と、新しいコンテンツへのタグのマッチングが毎時必要となる。SohuがMilvusを選択した理由は、膨大なデータセットを効率的かつ正確に処理し、検索時のメモリ使用量を削減し、ハイパフォーマンスな導入をサポートするからである。</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">ニュース推薦システムのワークフローを理解する<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Sohuのセマンティックベクトル検索ベースのコンテンツ推薦では、2つのニューラルネットワークを使用してユーザーのクエリとニュース記事をベクトルとして表現するDSSM（Deep Structured Semantic Model）に依存している。このモデルは、2つの意味ベクトルの余弦類似度を計算し、最も類似したニュースのバッチが推薦候補プールに送られる。次に、推定CTRに基づいてニュース記事がランク付けされ、予測クリックスルー率が最も高いものがユーザーに表示される。</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">BERT-as-serviceによるニュース記事の意味ベクトルへの符号化</h3><p>ニュース記事を意味ベクトルにエンコードするために、システムは<a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>ツールを使用する。このモデルを使用している間にコンテンツの単語数が512を超えると、埋め込み処理中に情報損失が発生する。これを克服するために、システムはまず要約を抽出し、それを768次元の意味ベクトルに符号化する。次に、各ニュース記事から最も関連性の高い2つのトピックを抽出し、トピックIDに基づいて対応する事前学習済みのトピックベクトル（200次元）を特定する。次に、トピックベクトルは記事の要約から抽出された768次元の意味ベクトルにスプライスされ、968次元の意味ベクトルが形成される。</p>
<p>Kaftaを通じて新しいコンテンツが継続的に入力され、Milvusデータベースに挿入される前に意味ベクトルに変換される。</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">BERT-as-serviceによるユーザープロファイルからの意味的に類似したタグの抽出</h3><p>モデルのもう1つのニューラルネットワークは、ユーザー意味ベクトルである。興味、検索クエリ、および閲覧履歴に基づいて、意味的に類似したタグ（例えば、コロナウイルス、covid、COVID-19、パンデミック、新型株、肺炎）がユーザープロファイルから抽出される。取得されたタグのリストは重みでソートされ、上位200個が異なるセマンティックグループに分けられる。各意味グループ内のタグの順列は、新しいタグフレーズを生成するために使用され、BERT-as-service によって意味ベクトルにエンコードされる。</p>
<p>各ユーザプロファイルについて、タグフレーズのセットは、ユーザの関心レベルを示す重みでマークさ れた<a href="https://github.com/baidu/Familia">トピックのセットに対応している</a>。すべての関連トピックの中から上位 2 つのトピックが選択され、機械学習（ML）モデルによって符号化されて、対応するタグ意味ベクトルにスプライスされ、968 次元のユーザー意味ベクトルが形成される。システムが異なるユーザーに対して同じタグを生成しても、タグとそれに対応するトピックに対する重みが異なるだけでなく、各ユーザーのトピックベクトル間の分散が明示されているため、レコメンデーションは一意であることが保証される。</p>
<p>このシステムは、ユーザープロフィールとニュース記事の両方から抽出された意味ベクトルの余弦類似度を計算することで、パーソナライズされたニュース推薦を行うことができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>捜狐01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">新しいセマンティックユーザープロファイルベクトルの計算とmilvusへの挿入</h3><p>意味的ユーザープロファイルベクトルは毎日計算され、前24時間のデータは翌日の夕方に処理される。ベクトルは個別にMilvusに挿入され、関連するニュースの結果をユーザーに提供するためのクエリープロセスを実行する。ニュースコンテンツは本質的に時事的であるため、予測クリックスルー率が高く、ユーザーに関連するコンテンツを含む現在のニュースフィードを生成するために、毎時計算を実行する必要がある。ニュースコンテンツはまた、日付ごとにパーティションにソートされ、古いニュースは毎日パージされる。</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">意味ベクトルの抽出時間を数日から数時間に短縮</h3><p>意味ベクトルを使ってコンテンツを検索するには、毎日何千万ものタグフレーズを意味ベクトルに変換する必要があります。これは時間のかかるプロセスで、この種の計算を高速化するグラフィック・プロセッシング・ユニット（GPU）で実行しても、完了までに数日を要する。この技術的な問題を克服するためには、類似のタグフレーズが出現したときに、対応する意味ベクトルを直接検索できるように、以前の埋め込みからの意味ベクトルを最適化しなければならない。</p>
<p>既存のタグフレーズ集合の意味ベクトルは保存され、毎日生成される新しいタグフレーズ集合はMinHashベクトルにエンコードされる。新しいタグフレーズのMinHashベクトルと保存されたタグフ レーズベクトル間の類似度を計算するために、<a href="https://milvus.io/docs/v1.1.1/metric.md">Jaccard距離が</a>使用されます。ジャッ カード距離が事前に定義されたしきい値を超えた場合、2つのセットは類似していると見なされます。類似度の閾値が満たされた場合、新しいフレーズは以前の埋め込みからの意味情報を活用することができます。テストによると、0.8以上の距離であれば、ほとんどの状況で十分な精度が保証される。</p>
<p>このプロセスにより、上記の何千万ものベクトルの毎日の変換は、数日から2時間程度に短縮される。特定のプロジェクトの要件によっては、意味ベクトルを保存する他の方法がより適切かもしれないが、milvusデータベースでJaccard距離を使用して2つのタグフレーズ間の類似性を計算することは、様々なシナリオにおいて効率的で正確な方法であることに変わりはない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">短いテキスト分類の「悪いケース」の克服<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>ニューステキストを分類する場合、短いニュース記事は長いニュース記事よりも抽出できる特徴が少ない。このため、様々な長さのコンテンツを同じ分類器にかけると、分類アルゴリズムは失敗します。Milvusは、類似したセマンティクスと信頼できるスコアを持つ複数の長いテキストの分類情報を検索し、投票メカニズムを使って短いテキストの分類を修正することで、この問題の解決を支援します。</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">誤分類された短文の特定と解決</h3><p>各ニュース記事を正確に分類することは、有益なコンテンツ推薦を提供する上で極めて重要である。短いニュース記事は特徴量が少ないため、異なる長さのニュースに対して同じ分類器を適用すると、短いテキスト分類のエラー率が高くなる。このタスクに対して人間のラベリングは時間がかかりすぎ、不正確であるため、BERT-as-serviceとMilvusを使用して、誤分類された短いテキストをバッチで迅速に識別し、正しく再分類し、その後、この問題に対する訓練のためのコーパスとしてデータのバッチを使用する。</p>
<p>BERT-as-service は、分類器のスコアが 0.9 より大きい合計 500 万の長文ニュース記事を意味ベクトルに符号化するために使用される。長文記事を Milvus に挿入した後、短文ニュースを意味ベクトルに符号化する。各短文ニュースの意味ベクトルはMilvusデータベースへの問い合わせに使われ、対象の短文ニュースとのコサイン類似度が最も高い上位20の長文ニュース記事を得る。上位20の意味的に類似したロングニュースのうち18が同じ分類に見え、それがクエリのショートニュースの分類と異なる場合、ショートニュースの分類は不正確とみなされ、18のロングニュース記事と整合するように調整されなければならない。</p>
<p>このプロセスは、不正確な短いテキストの分類を素早く識別し、修正する。ランダムサンプリングの統計によると、短いテキストの分類が修正された後、テキスト分類の全体的な精度は95%を超える。信頼度の高い長文の分類を利用して短文の分類を修正することで、悪い分類ケースの大部分は短時間で修正される。これはまた、短いテキスト分類器を訓練するための良いコーパスを提供します。</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg「短文分類の "悪いケース "発見のフローチャート」)</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvusはリアルタイムのニュースコンテンツレコメンデーションなどを可能にする<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、捜狐のニュース推薦システムのリアルタイム性能を大幅に改善し、誤分類された短文の識別効率も強化しました。Milvusとその様々なアプリケーションについてもっと知りたい方は：</p>
<ul>
<li><a href="https://zilliz.com/blog">ブログを</a>読む。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>オープンソースコミュニティと交流する。</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>世界で最も人気のあるベクトルデータベースを使用したり、貢献する。</li>
<li>新しい<a href="https://github.com/milvus-io/bootcamp">ブートキャンプで</a>AIアプリケーションを素早くテストし、デプロイする。</li>
</ul>
