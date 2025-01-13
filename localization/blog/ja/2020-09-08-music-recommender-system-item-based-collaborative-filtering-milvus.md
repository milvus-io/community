---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: 埋め込み類似度検索エンジンの選択
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: WANYIN APPのケーススタディ
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>音楽推薦システムのための項目ベースの協調フィルタリング</custom-h1><p>WanyinアプリはAIベースの音楽共有コミュニティであり、音楽の共有を促進し、音楽愛好家の作曲を容易にすることを意図している。</p>
<p>Wanyinのライブラリには、ユーザーによってアップロードされた大量の音楽が含まれている。主なタスクは、ユーザーの過去の行動に基づいて興味のある音楽を選別することである。我々は2つの古典的なモデルを評価した：ユーザーベース協調フィルタリング（User-based CF）とアイテムベース協調フィルタリング（Item-based CF）。</p>
<ul>
<li>ユーザベース協調フィルタリングは、類似度統計量を用いて、類似した嗜好や興味を持つ近隣ユーザを検索する。取得された近傍ユーザーの集合により、システムはターゲットユーザーの興味を予測し、レコメンデーションを生成することができる。</li>
<li>Amazonによって導入されたアイテムベースCF（I2I）は、推薦システムのための協調フィルタリングモデルとしてよく知られている。これは、興味のあるアイテムはスコアの高いアイテムと類似していなければならないという仮定に基づき、ユーザーの代わりにアイテム間の類似度を計算する。</li>
</ul>
<p>ユーザベースのCFは、ユーザ数が一定以上になると、計算時間が法外に長くなる可能性がある。このような製品の特性を考慮し、I2I CFを採用することにしました。楽曲に関するメタデータをあまり持っていないため、楽曲そのものを扱い、楽曲から特徴ベクトル（エンベッディング）を抽出する必要があります。我々のアプローチは、これらの楽曲をMFC（mel-frequency cepstrum）に変換し、楽曲の特徴埋め込みを抽出するために畳み込みニューラルネットワーク（CNN）を設計し、埋め込み類似性検索によって音楽推薦を行うことである。</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">埋め込み類似度検索エンジンの選択<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>特徴ベクトルが得られたところで、残された課題は、大量のベクトルの中から、目的のベクトルと類似したベクトルをどのように検索するかである。埋め込み類似度検索エンジンは、FaissとMilvusで迷いました。Milvusに気づいたのは、2019年11月にGitHubのトレンドリポジトリを見ていたときです。プロジェクトを見てみると、その抽象的なAPIに魅力を感じました。(当時はv0.5.x、現在はv0.10.2）。</p>
<p>我々はMilvusをFaissよりも気に入っている。一方では、Faissを使ったことがあるので、新しいものを試したいと思っています。一方、Milvusと比べると、Faissはより基礎的なライブラリであるため、使い勝手があまりよくない。Milvusについて学ぶにつれ、最終的にMilvusを採用することに決めたのは、その2つの大きな特徴による：</p>
<ul>
<li>Milvusは非常に使いやすい。Milvusは非常に使いやすい。Dockerイメージを引っ張ってきて、自分のシナリオに基づいてパラメータを更新するだけでいい。</li>
<li>より多くのインデックスをサポートし、詳細なサポート・ドキュメントがある。</li>
</ul>
<p>一言で言えば、Milvusはユーザーにとって非常に使いやすく、ドキュメントも非常に詳しい。何か問題が発生した場合、大抵はドキュメンテーションで解決策を見つけることができますが、そうでなければ、いつでもMilvusコミュニティからサポートを受けることができます。</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Milvus クラスタサービス ☸️ ⏩.<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>機能ベクトル検索エンジンとしてMilvusを使用することを決定した後、開発（DEV）環境にスタンドアロンノードを設定しました。このノードは数日間順調に稼動していたので、工場受入テスト（FAT）環境でテストを実行することを計画しました。本番環境でスタンドアロン・ノードがクラッシュすると、サービス全体が利用できなくなる。したがって、可用性の高い検索サービスを展開する必要がある。</p>
<p>Milvusはクラスタ・シャーディング・ミドルウェアであるMishardsと、コンフィギュレーション用のMilvus-Helmの両方を提供している。Milvusクラスタサービスをデプロイするプロセスは簡単だ。いくつかのパラメータを更新し、Kubernetesにデプロイするためにパックするだけだ。Milvusのドキュメントにある以下の図は、Mishardsがどのように動作するかを示している：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png。</span> </span></p>
<p>Mishardsは、上流からのリクエストを分割したサブモジュールにカスケードダウンし、サブサービスの結果を収集して上流に返す。Mishardsベースのクラスタソリューションの全体的なアーキテクチャを以下に示します：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>公式ドキュメントではMishardsについてわかりやすく紹介しています。興味のある方は<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishardsを</a>参照してください。</p>
<p>私たちの音楽レコメンダー・システムでは、Kubernetesに書き込み可能なノード1台、読み取り専用ノード2台、Milvus-Helmを使ってMishardsミドルウェアインスタンス1台をデプロイした。しばらくFAT環境でサービスが安定稼働した後、本番環境にデプロイした。今のところ安定している。</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 I2I音楽レコメンデーション🎶。<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>前述したように、抽出した既存楽曲のエンベッディングを用いて、WanyinのI2I音楽推薦システムを構築しました。まず、ユーザがアップロードした新曲のボーカルとBGMを分離（トラック分離）し、BGMの埋め込みデータを曲の特徴表現として抽出しました。これは、オリジナル曲のカバーバージョンの選別にも役立つ。次に、これらの埋め込みデータをMilvusに格納し、ユーザが聴いた曲を元に類似曲を検索し、検索された曲を並べ替え、おすすめ音楽を生成する。その実装プロセスを以下に示す：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">重複曲フィルター<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusを使用するもう一つのシナリオは、重複曲フィルタリングである。一部のユーザーは同じ曲やクリップを何度もアップロードしており、これらの重複した曲が推薦リストに表示される可能性がある。つまり、前処理なしで推薦を生成することは、ユーザーエクスペリエンスに影響を与えることになる。そのため、前処理によって重複する曲を見つけ出し、同じリストに表示されないようにする必要がある。</p>
<p>Milvusを使用するもう一つのシナリオは、重複曲のフィルタリングである。同じ曲やクリップを何度もアップロードするユーザーがおり、重複した曲が推薦リストに表示される可能性がある。つまり、前処理なしで推薦を生成することは、ユーザーエクスペリエンスに影響を与えることになる。そのため、前処理によって重複する曲を見つけ出し、同じリストに表示されないようにする必要がある。</p>
<p>前述のシナリオと同様に、類似した特徴ベクトルを検索することによって、重複曲フィルタリングを実装した。まず、ボーカルとBGMを分離し、Milvusを用いて類似曲を検索した。重複曲のフィルタリングを正確に行うため、対象曲と類似曲の音声指紋を抽出し（Echoprint、Chromaprint等の技術を使用）、対象曲の音声指紋と類似曲の各指紋の類似度を算出した。類似度が閾値を超えた場合、その曲をターゲット曲の複製と定義する。オーディオフィンガープリントマッチングのプロセスは重複曲のフィルタリングをより正確にしますが、時間もかかります。そのため、膨大な音楽ライブラリの楽曲をフィルタリングする場合、その前段階としてMilvusを使って重複候補曲をフィルタリングする。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filter-songs-music-recommender-duplicates.png</span> </span></p>
<p>Wanyinの膨大な音楽ライブラリにI2I推薦システムを実装するために、私たちのアプローチは、曲の埋め込みを特徴として抽出し、ターゲット曲の埋め込みと類似した埋め込みを呼び出し、その結果をソートして並べ替え、ユーザーへの推薦リストを生成することである。リアルタイム・レコメンデーションを実現するため、特徴ベクトル類似検索エンジンとして、FaissよりもMilvusを選択した。また、重複曲フィルタにもMilvusを採用し、ユーザーエクスペリエンスと効率を向上させています。</p>
<p><a href="https://enjoymusic.ai/wanyin">和音アプリ</a>🎶をダウンロードしてお試しください。(注：すべてのアプリストアで利用できるとは限りません。)</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 著者</h3><p>Jason, Algorithm Engineer at Stepbeats Shiyu Chen, Data Engineer at Zilliz</p>
<h3 id="📚-References" class="common-anchor-header">📚 参考文献：</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 見知らぬ人にならないように、<a href="https://twitter.com/milvusio/">Twitterで</a>フォローするか、<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slackで</a>参加しよう！👇🏻</strong></p>
