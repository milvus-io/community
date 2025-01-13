---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 最高のMilvus：v2.2からv2.2.6を探る
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus 2.2 から 2.2.6 の新機能
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>最高のMilvus</span> </span></p>
<p>Milvusフォロワーの皆さん、お帰りなさい！この最先端のオープンソース・ベクターデータベースの最新情報を最後にお伝えしてから、しばらく時間が経ってしまいました。しかし、心配はご無用です。昨年8月以降に行われたエキサイティングな開発について、私たちがキャッチアップするためにここにいるからです。</p>
<p>このブログでは、バージョン2.2からバージョン2.2.6までのMilvusの最新リリースをご紹介します。新機能、改善、バグフィックス、最適化など盛りだくさんです。それでは、シートベルトを締めて、さっそくご覧ください！</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2：安定性の向上、検索速度の高速化、柔軟なスケーラビリティを備えたメジャーリリース<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2は、7つの新機能と旧バージョンからの数多くの画期的な改善を導入した重要なリリースです。そのハイライトを詳しく見てみましょう：</p>
<ul>
<li><strong>ファイルからのエンティティの一括挿入</strong>：この機能により、たった数行のコードで、1つまたは複数のファイル内のエンティティを一括してMilvusに直接アップロードすることができ、時間と労力を節約することができます。</li>
<li><strong>クエリ結果のページネーション</strong>：Milvus v2.2では、1回のリモートプロシージャコール(RPC)で大量の検索結果やクエリ結果が返されることを避けるために、検索やクエリでキーワードによるオフセットやフィルタリング結果を設定することができます。</li>
<li><strong>ロールベースアクセスコントロール(RBAC)：</strong>Milvus v2.2ではRBACがサポートされ、ユーザ、ロール、パーミッションを管理することにより、Milvusインスタンスへのアクセスを制御できるようになりました。</li>
<li><strong>クォータとリミット</strong>Milvus v2.2の新機能であるクオータとリミットは、急激なトラフィック急増時のメモリ不足(OOM)エラーやクラッシュからデータベースシステムを保護します。この機能により、取り込み、検索、メモリ使用量を制御することができます。</li>
<li><strong>コレクションレベルでのTTL（Time to Live）</strong>：以前のリリースでは、MilvusはクラスタのTTLを設定することしかできませんでした。しかし、Milvus v2.2ではコレクションレベルでのTTL設定に対応しました。特定のコレクションに対してTTLを設定すると、そのコレクション内のエンティティはTTL終了後に自動的に期限切れになります。この設定により、データ保持をより細かく制御することができます。</li>
<li><strong>ディスクベースの近似最近傍探索（ANNS）インデックス（ベータ）</strong>：Milvus v2.2では、SSDに常駐し、VamanaグラフベースのANNSアルゴリズムであるDiskANNのサポートが導入されました。このサポートにより、大規模データセットの直接検索が可能になり、メモリ使用量を最大10倍まで大幅に削減することができます。</li>
<li><strong>データバックアップ（ベータ版）</strong>：Milvus v2.2では、MilvusデータをコマンドラインまたはAPIサーバーから適切にバックアップおよびリストアするための<a href="https://github.com/zilliztech/milvus-backup">全く新しいツールを</a>提供します。</li>
</ul>
<p>上記の新機能に加え、Milvus v2.2では、5つのバグの修正と、Milvusの安定性、観測可能性、パフォーマンスを向上させるための複数の改善が含まれています。詳細は<a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2リリースノートを</a>ご参照ください。</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2: 問題点を修正したマイナーリリース<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1とv2.2.2は、旧バージョンの重大な問題の修正と新機能の導入に焦点を当てたマイナーリリースです。以下はそのハイライトです：</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Pulsaテナントと認証に対応</li>
<li>etcdコンフィグソースでトランスポートレイヤセキュリティ(TLS)をサポート</li>
<li>検索パフォーマンスを30%以上向上</li>
<li>スケジューラを最適化し、マージタスクの確率を向上。</li>
<li>インデックス化されたスカラ・フィールドでのターム・フィルタリングの失敗や、インデックス作成失敗時のIndexNodeパニックなど、複数のバグを修正。</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">milvus v2.2.2</h3><ul>
<li>プロキシがシャード・リーダのキャッシュを更新しない問題を修正しました。</li>
<li>ロードされた情報が解放されたコレクション/パーティションに対してクリーニングされない問題を修正しました。</li>
<li>ロードカウントが時間通りにクリアされない問題を修正しました。</li>
</ul>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1リリースノート</a>および<a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2リリースノートを</a>ご参照ください。</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3:より安全、安定、利用可能に<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3は、システムのセキュリティ、安定性、可用性の強化に重点を置いたリリースです。さらに、2つの重要な機能が導入されています：</p>
<ul>
<li><p><strong>ローリングアップグレード</strong>：この機能により、Milvusは以前のリリースでは不可能であったアップグレードプロセス中のリクエストに応答することができるようになりました。ローリングアップグレードにより、アップグレード中であってもシステムが利用可能であり、ユーザのリクエストに応答し続けることができます。</p></li>
<li><p><strong>コーディネーターの高可用性(HA)：</strong>この機能により、Milvusのコーディネーターはアクティブ・スタンバイ・モードで動作し、シングルポイント障害のリスクを低減します。予期せぬ災害時でも、復旧時間は最大30秒に短縮されます。</p></li>
</ul>
<p>これらの新機能に加え、Milvus v2.2.3では、バルクインサートのパフォーマンス向上、メモリ使用量の削減、モニタリングメトリクスの最適化、メタストレージのパフォーマンス向上など、数多くの改善とバグ修正が行われています。詳細は<a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3リリースノートを</a>ご参照ください。</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4:高速化、高信頼性、省リソース化<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4はMilvus v2.2のマイナーアップデートです。4つの新機能といくつかの機能強化が導入され、パフォーマンスの高速化、信頼性の向上、リソース消費の削減が実現されています。本リリースのハイライトは以下の通りです：</p>
<ul>
<li><strong>リソースのグループ化</strong>：MilvusはQueryNodeを他のリソースグループにグループ化することをサポートし、異なるグループの物理リソースへのアクセスを完全に分離できるようになりました。</li>
<li><strong>コレクション名の変更</strong>：コレクション名の変更APIにより、ユーザはコレクション名を変更することができるようになり、コレクション管理の柔軟性とユーザビリティが向上しました。</li>
<li><strong>Google Cloud Storageのサポート</strong></li>
<li><strong>検索APIとクエリAPIに新しいオプションが追加さ</strong>れました：この新機能により、ユーザはすべての成長セグメントでの検索をスキップすることができ、データ挿入と同時に検索が実行されるシナリオにおいて、より優れた検索パフォーマンスを提供します。</li>
</ul>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4リリースノートを</a>ご参照ください。</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: 推奨しません。<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5にはいくつかの重大な問題があるため、本リリースの使用は推奨いたしません。  これらの問題によりご迷惑をおかけしたことを深くお詫び申し上げます。Milvus v2.2.6ではこれらの問題に対処しております。</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6：v2.2.5からの重大な問題の解決<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6では、v2.2.5で発見されたダーティbinlogデータのリサイクルの問題やDataCoord GCの失敗などの重大な問題への対処に成功しています。現在v2.2.5をお使いの方は、パフォーマンスと安定性を最適化するためにアップグレードしてください。</p>
<p>修正された重要な問題は以下の通りです：</p>
<ul>
<li>DataCoord GCの失敗</li>
<li>渡されたインデックス・パラメータの上書き</li>
<li>RootCoordメッセージのバックログによるシステム遅延</li>
<li>メトリックRootCoordInsertChannelTimeTickの不正確さ</li>
<li>タイムスタンプ停止の可能性</li>
<li>再起動プロセス中のコーディネータ・ロールの自己破壊の発生</li>
<li>ガベージコレクションの異常終了によるチェックポイントの遅れ</li>
</ul>
<p>詳細は<a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6リリースノートを</a>ご参照ください。</p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>以上、Milvusのv2.2からv2.2.6までの最新リリースでは、多くのエキサイティングなアップデートと改善が行われました。新機能からバグフィックス、最適化まで、Milvusは様々な領域において最先端のソリューションを提供し、アプリケーションを強化するというコミットメントを守り続けています。今後もMilvusコミュニティによるエキサイティングなアップデートやイノベーションにご期待ください。</p>
