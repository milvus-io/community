---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: Milvus 2.3.4：検索の高速化、データサポートの拡大、モニタリングの改善など
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Milvus 2.3.4の新機能と改善点の紹介
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 2.3.4の最新リリースを発表できることを嬉しく思います。このアップデートでは、パフォーマンスを最適化し、効率を高め、シームレスなユーザーエクスペリエンスを提供するために細心の注意を払って作られた一連の機能と機能強化が導入されています。本ブログでは、Milvus 2.3.4のハイライトをご紹介いたします。</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">アクセスログによるモニタリングの向上<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusはアクセスログをサポートするようになり、外部インターフェースとのインタラクションに関する貴重な洞察を提供します。これらのログは、メソッド名、ユーザリクエスト、レスポンスタイム、エラーコード、およびその他のインタラクション情報を記録し、開発者やシステム管理者がパフォーマンス分析、セキュリティ監査、および効率的なトラブルシューティングを実施できるようにします。</p>
<p><strong><em>注：</em></strong> <em>現在のところ、アクセスログはgRPCインタラクションのみをサポートしています。将来のバージョンでは、この機能を拡張し、RESTful リクエストログを含める予定です。</em></p>
<p>詳細については、<a href="https://milvus.io/docs/configure_access_logs.md">アクセスログの設定を</a>参照してください。</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Parquet ファイルインポートによるデータ処理効率の向上<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3.4では、大規模なデータセットの保存と処理の効率を高めるために設計された、広く受け入れられているカラム型ストレージフォーマットであるParquetファイルのインポートに対応しました。この機能追加により、ユーザはデータ処理における柔軟性と効率性を向上させることができます。手間のかかるデータ形式の変換が不要になるため、Parquet形式で大規模なデータセットを管理しているユーザーは、データのインポート処理が合理化され、最初のデータ準備からその後のベクトル検索までの時間が大幅に短縮されます。</p>
<p>さらに、当社のデータ形式変換ツールであるBulkWriterは、デフォルトの出力データ形式としてParquetを採用し、開発者がより直感的に操作できるようになりました。</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Binlog インデックスによる成長セグメントの高速検索<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、成長するセグメントにおけるBinlogインデックスを活用し、成長するセグメントにおける検索を最大10倍高速化しました。この機能強化により、検索効率が大幅に向上し、IVFやFast Scanのような高度なインデックスもサポートされ、全体的なユーザーエクスペリエンスが向上します。</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">最大10,000のコレクション/パーティションをサポート<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>リレーショナルデータベースのテーブルとパーティションのように、コレクションとパーティションはMilvusにおけるベクトルデータの保存と管理の中核となる単位です。Milvus2.3.4では、ユーザーの進化するデータ整理のニーズに応え、従来の4,096個から大幅に増加し、クラスタ内で最大10,000個のコレクション/パーティションをサポートするようになりました。この機能拡張は、ナレッジベース管理やマルチテナント環境などの多様なユースケースにメリットをもたらします。コレクション/パーティションのサポート拡大は、タイムティックメカニズム、ゴルーチン管理、メモリ使用の改良に起因しています。</p>
<p><strong><em>注：</em></strong> <em>コレクション/パーティション数の推奨上限は10,000です。この上限を超えると、障害回復やリソース使用に影響を与える可能性があります。</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">その他の機能強化<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4では、上記の機能に加えて、様々な改善やバグフィックスが行われています。これらには、データ検索時および可変長データ処理時のメモリ使用量の削減、エラーメッセージの改善、ロード速度の高速化、クエリシャードバランスの改善などが含まれます。これらの機能強化は、よりスムーズで効率的な全体的なユーザー・エクスペリエンスに貢献します。</p>
<p>Milvus 2.3.4で導入されたすべての変更点の包括的な概要については、<a href="https://milvus.io/docs/release_notes.md#v234">リリースノートを</a>ご参照ください。</p>
<h2 id="Stay-connected" class="common-anchor-header">引き続きお付き合いください！<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>ご参加いただき、エンジニアやコミュニティと直接やりとりしていただくか、<a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn（</a>毎週火曜日PST12-12:30）にご参加ください。また、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInで</a>Milvusに関する最新ニュースやアップデートをフォローすることもできます。</p>
