---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: 'Milvus 2.2.12: より簡単なアクセス、より速いベクトル検索速度、より良いユーザーエクスペリエンス'
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 2.2.12をリリースいたしました。今回のアップデートでは、RESTful API のサポート、<code translate="no">json_contains</code> 機能、ANN 検索時のベクトル検索など、ユーザーからのフィードバックに対応した複数の新機能が追加されました。また、ユーザーエクスペリエンスの合理化、ベクトル検索速度の向上、多くの問題の解決も行いました。それでは、Milvus 2.2.12に期待されるものを掘り下げてみましょう。</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">RESTful APIのサポート<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12ではRESTful APIに対応し、クライアントをインストールすることなくMilvusにアクセスできるようになった。また、Milvus SDKとRESTful APIが同じポート番号を共有しているため、Milvusの導入がより便利になりました。</p>
<p><strong>注</strong>：高度な運用やレイテンシを重視するビジネスでは、SDKを使用してMilvusを導入することをお勧めします。</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">ANN検索時のベクトル検索<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>以前のバージョンでは、Milvusはパフォーマンスとメモリ使用量を優先するため、近似最近傍(ANN)検索中のベクトル検索を許可していませんでした。その結果、生ベクトルの検索はANN検索の実行と、IDに基づく生ベクトルのクエリの2つのステップに分ける必要がありました。このアプローチは開発コストを増加させ、ユーザがMilvusを導入することを困難にしていました。</p>
<p>Milvus2.2.12では、ベクトルフィールドを出力フィールドとして設定し、HNSW、DiskANN、またはIVF-FLATでインデックスされたコレクションでクエリを実行することで、ANN検索中に生のベクトルを取得することができます。さらに、ベクトル検索速度の大幅な高速化が期待できます。</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">JSON配列に対する操作のサポート<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.8でJSONのサポートが追加されました。それ以来、ユーザからは、包含、除外、交差、和集合、差分などのJSON配列の追加操作をサポートしてほしいという多くの要望が寄せられていました。Milvus 2.2.12では、<code translate="no">json_contains</code> 関数のサポートを優先し、インクルード操作を可能にしました。今後のバージョンアップでは、他の演算子のサポートも追加していく予定です。</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">機能強化とバグ修正<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12では、新機能の導入に加え、オーバーヘッドを削減したベクトル検索性能の向上により、広範なtopk検索を容易に扱えるようになりました。さらに、パーティションキー有効時およびマルチパーティション時の書き込み性能を向上させ、大規模マシンのCPU使用率を最適化しています。 このアップデートでは、過剰なディスク使用、コンパクションのスタック、頻繁でないデータ削除、一括挿入の失敗といった様々な問題に対処しています。詳細については、<a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12リリースノートを</a>ご参照ください。</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">今後ともよろしくお願いいたします！<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInを通じて</a>お気軽にご連絡ください。また、<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加してエンジニアやコミュニティと直接チャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックしたりすることも大歓迎です！</p>
