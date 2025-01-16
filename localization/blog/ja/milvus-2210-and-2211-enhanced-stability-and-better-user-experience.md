---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: 'Milvus 2.2.10 &amp; 2.2.11: システムの安定性とユーザーエクスペリエンスの向上のためのマイナーアップデート'
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus2.2.10と2.2.11の新機能と改良点の紹介
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusファンの皆様、こんにちは！この度、Milvus 2.2.10と2.2.11をリリースいたしました。この2つのアップデートは、主にバグフィックスと全体的なパフォーマンス向上に焦点を当てたマイナーアップデートです。この2つのアップデートにより、より安定したシステムと、より良いユーザーエクスペリエンスが期待できます。この2つのリリースの新機能を簡単に見てみましょう。</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10では、システムクラッシュの修正、ローディングとインデックス作成の高速化、データノードのメモリ使用量の削減、その他多くの改善が行われました。以下は注目すべき変更点です：</p>
<ul>
<li>古いCGOペイロードライターを純粋なGoで書かれた新しいものに置き換え、データノードのメモリ使用量を削減しました。</li>
<li><code translate="no">milvus-proto</code> のバージョン違いによる混乱を防ぐため、<code translate="no">milvus-proto</code> ファイルに<code translate="no">go-api/v2</code> を追加。</li>
<li>Ginをバージョン1.9.0から1.9.1にアップグレードし、<code translate="no">Context.FileAttachment</code> 関数のバグを修正。</li>
<li>FlushAllおよびDatabase APIにロールベースのアクセス制御（RBAC）を追加しました。</li>
<li>AWS S3 SDKによって引き起こされるランダムクラッシュを修正しました。</li>
<li>読み込み速度とインデックス作成速度を改善しました。</li>
</ul>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10リリースノートを</a>ご参照ください。</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11では、システムの安定性を向上させるために様々な問題を解決しました。また、モニタリング、ロギング、レート制限、クロスクラスタ要求の遮断のパフォーマンスが改善されました。今回のアップデートのハイライトは以下をご覧ください。</p>
<ul>
<li>MilvusのGRPCサーバーにインターセプターを追加し、Cross-Clusterルーティングの問題を防止。</li>
<li>エラーの診断と修正を容易にするため、minioチャンクマネージャーにエラーコードを追加した。</li>
<li>シングルトンコルーチンプールを利用して、コルーチンの浪費を避け、リソースを最大限に利用するようにした。</li>
<li>zstd圧縮を有効にすることで、RocksMqのディスク使用量を10分の1に削減。</li>
<li>ロード中に時々発生するQueryNodeのパニックを修正。</li>
<li>キューの長さを2回誤って計算することによる読み取り要求のスロットリング問題を修正。</li>
<li>MacOS上でGetObjectがNULL値を返す問題を修正しました。</li>
<li>noexcept修飾子の誤った使用によるクラッシュを修正しました。</li>
</ul>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11リリースノートを</a>ご覧ください。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">今後ともよろしくお願いします！<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInを通じて</a>お気軽にご連絡ください。また、私たちの<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加してエンジニアやコミュニティと直接チャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックしたりすることも大歓迎です！</p>
