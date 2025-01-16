---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: Milvus 2.2.9：ユーザーエクスペリエンスを最適化した待望のリリース
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 2.2.9は、チームとコミュニティにとって重要なマイルストーンとなる待望のリリースです。このリリースでは、待望のJSONデータ型、ダイナミックスキーマ、パーティションキーのサポートを含む多くのエキサイティングな機能を提供し、最適化されたユーザーエクスペリエンスと合理化された開発ワークフローを保証します。さらに、本リリースには多数の機能拡張とバグ修正が含まれています。Milvus2.2.9について、そしてなぜこのリリースがこれほどエキサイティングなのか、私たちと一緒に考えてみませんか？</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">JSONサポートによるユーザーエクスペリエンスの最適化<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは待望のJSONデータ型のサポートを導入し、ユーザーのコレクション内のベクターのメタデータと共にJSONデータをシームレスに保存できるようになりました。この機能強化により、ユーザーはJSONデータを効率的に一括挿入し、JSONフィールドのコンテンツに基づいて高度なクエリやフィルタリングを実行することができます。さらに、データセットのJSONフィールドに合わせた式や操作の実行、クエリの構築、JSONフィールドの内容や構造に基づいたフィルタの適用が可能になり、関連情報の抽出やデータ操作がより効率的に行えるようになります。</p>
<p>将来的には、MilvusチームはJSONタイプ内のフィールドに対するインデックスを追加し、スカラーとベクトルが混在するクエリのパフォーマンスをさらに最適化する予定です。今後のエキサイティングな展開にご期待ください！</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">動的スキーマのサポートによる柔軟性の追加<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>JSONデータのサポートに伴い、Milvus 2.2.9では、簡素化されたソフトウェア開発キット(SDK)を通じて動的スキーマ機能を提供するようになりました。</p>
<p>Milvus 2.2.9から、Milvus SDKには、ダイナミックフィールドをコレクションの非表示JSONフィールドに自動的に入力するハイレベルAPIが含まれており、ユーザーはビジネスフィールドのみに集中することができます。</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">パーティションキーによるデータ分離と検索効率の向上<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9では、パーティションキー機能を導入し、パーティション機能を強化しました。パーティショニングの主キーとしてユーザー固有のカラムを使用できるため、<code translate="no">loadPartition</code> や<code translate="no">releasePartition</code> などの追加APIが不要になります。この新機能により、パーティション数の制限もなくなり、より効率的なリソース利用が可能になります。</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Alibaba Cloud OSSのサポート<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9ではAlibaba Cloud Object Storage Service (OSS)をサポートしました。Alibaba Cloudユーザーは、<code translate="no">cloudProvider</code> をAlibaba Cloudに簡単に設定し、クラウド上のベクトルデータの効率的な保存と検索のためのシームレスな統合を利用することができます。</p>
<p>Milvus 2.2.9では、前述の機能に加えて、ロールベースアクセスコントロール(RBAC)におけるデータベースのサポート、接続管理の導入、および複数の機能強化とバグ修正が含まれています。詳細につきましては、<a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9リリースノートを</a>ご参照ください。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">今後ともよろしくお願いいたします！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInを通じて</a>お気軽にお問い合わせください。また、私たちの<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加してエンジニアやコミュニティと直接チャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックしたりすることも大歓迎です！</p>
