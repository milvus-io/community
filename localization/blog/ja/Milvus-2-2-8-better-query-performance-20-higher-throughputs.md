---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: Milvus 2.2.8：クエリのパフォーマンスが向上、スループットが20%向上
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Milvus 2.2.8をリリースいたしました。本リリースでは、旧バージョンからの数多くの改善とバグフィックスが含まれており、クエリパフォーマンスの向上、リソースの節約、スループットの向上が実現されています。それでは、今回のリリースの新機能を一緒に見ていきましょう。</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">コレクションロード時のピークメモリ消費量の削減<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリを実行するために、Milvusはデータとインデックスをメモリにロードする必要があります。しかし、ロード処理中に複数のメモリコピーが発生することで、ピーク時のメモリ使用量が実際の実行時に比べて最大3～4倍まで増加する可能性があります。Milvusの最新バージョン2.2.8では、この問題に効果的に対処し、メモリ使用量を最適化している。</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">プラグインをサポートするQueryNodeによるクエリシナリオの拡張<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>最新のMilvus 2.2.8では、QueryNodeがプラグインに対応しました。<code translate="no">queryNode.soPath</code> 、プラグインファイルのパスを簡単に指定することができます。Milvusは実行時にプラグインをロードし、利用可能なクエリシナリオを拡張することができます。プラグインの開発に関するガイダンスが必要な場合は、<a href="https://pkg.go.dev/plugin">Goプラグインのドキュメントを</a>参照してください。</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">コンパクションアルゴリズムの強化によるクエリ性能の最適化<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>コンパクション アルゴリズムは、セグメントの収束速度を決定し、クエリのパフォーマンスに直接影響します。最近のコンパクション・アルゴリズムの改良により、収束効率が劇的に向上し、クエリが高速化しました。</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">コレクションシャードの削減によるリソースの節約とクエリ性能の向上<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは超並列処理(MPP)システムであるため、コレクションシャードの数がMilvusの書き込みやクエリの効率に影響を与えます。旧バージョンでは、コレクションにはデフォルトで2つのシャードがあり、書き込み性能は優れていましたが、クエリ性能とリソースコストは低下していました。新しいMilvus 2.2.8のアップデートでは、デフォルトのコレクションシャードは1つに削減され、ユーザーはより多くのリソースを節約し、より良いクエリを実行できるようになりました。コミュニティのほとんどのユーザはデータボリュームが1,000万以下であり、1つのシャードで十分な書き込みパフォーマンスを得ることができます。</p>
<p><strong>注</strong>：このアップグレードは、このリリース以前に作成されたコレクションには影響しません。</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">改良されたクエリ・グルーピング・アルゴリズムによる20%のスループット向上<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは効率的なクエリ・グルーピング・アルゴリズムを採用しており、キュー内の複数のクエリ・リクエストを1つにまとめて高速に実行することで、スループットを大幅に向上させています。最新リリースでは、このアルゴリズムをさらに強化し、Milvusのスループットを少なくとも20%向上させています。</p>
<p>また、Milvus 2.2.8では、これらの改良に加え、様々なバグが修正されています。詳細は<a href="https://milvus.io/docs/release_notes.md">Milvusリリースノートを</a>ご覧ください。</p>
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInを通じて</a>お気軽にご連絡ください。また、私たちの<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加して、私たちのエンジニアやコミュニティ全体と直接チャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックしたりすることも大歓迎です！</p>
