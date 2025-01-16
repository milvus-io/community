---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: milvus2.3.2および2.3.3を公開：配列データ型、複合削除、TiKVとの統合などをサポート
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  本日、Milvus
  2.3.2および2.3.3のリリースを発表いたします！これらのアップデートは、多くのエキサイティングな機能、最適化、改善をもたらし、システムパフォーマンス、柔軟性、全体的なユーザーエクスペリエンスを向上させます。
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>進化し続けるベクター検索技術の中で、Milvusは常に最前線に立ち、限界を押し広げ、新たな基準を打ち立て続けています。本日、Milvus 2.3.2および2.3.3のリリースを発表できることを嬉しく思います！これらのアップデートは、多くのエキサイティングな機能、最適化、改善をもたらし、システムパフォーマンス、柔軟性、そして全体的なユーザーエクスペリエンスを向上させます。</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">配列データ型のサポート - 検索結果をより正確で適切なものに<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>Arrayデータ型のサポートは、Milvusにとって極めて重要な機能強化であり、特にIntersectionやUnionのようなクエリフィルタリングシナリオにおいて重要です。この追加により、検索結果がより正確であるだけでなく、より適切なものになります。例えば、Eコマース分野では、文字列配列として保存された商品タグにより、消費者は高度な検索を実行し、無関係な結果を除外することができます。</p>
<p>MilvusでArray型を活用するための詳細なガイドについては、包括的な<a href="https://milvus.io/docs/array_data_type.md">ドキュメントを</a>ご覧ください。</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">複雑な削除式のサポート - データ管理の向上<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>以前のバージョンでは、Milvusは主キーの削除式をサポートし、安定した合理的なアーキテクチャを提供していました。Milvus 2.3.2または2.3.3では、複雑な削除式を使用することができるようになり、古いデータのローリングクリーンアップやGDPRコンプライアンスに基づいたユーザIDに基づくデータ削除など、高度なデータ管理タスクが容易になりました。</p>
<p>注：複雑な式を使用する前に、コレクションをロードしていることを確認してください。さらに、削除プロセスはアトミック性を保証しないことに注意することが重要です。</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">TiKVの統合 - 安定性を備えたスケーラブルなメタデータストレージ<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>これまでMilvusは、メタデータストレージをEtcdに依存していたため、メタデータストレージの容量制限とスケーラビリティの問題に直面していました。これらの問題に対処するため、Milvusはメタデータストレージの新たな選択肢として、オープンソースのキーバリューストアであるTiKVを追加しました。TiKVは拡張性、安定性、効率性が強化されており、Milvusの進化する要件に理想的なソリューションとなっている。Milvus 2.3.2からは、設定を変更することでメタデータストレージをTiKVにシームレスに移行することができます。</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">FP16ベクトル型のサポート - 機械学習の効率化を実現<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2以降のバージョンでは、インターフェイスレベルでFP16ベクトル型をサポートするようになりました。FP16（16ビット浮動小数点）は、ディープラーニングや機械学習で広く使用されているデータフォーマットで、数値の効率的な表現と計算を提供します。FP16の完全サポートは現在進行中ですが、インデクシング・レイヤーのさまざまなインデックスでは、構築時にFP16をFP32に変換する必要があります。</p>
<p>Milvusの後のバージョンでは、FP16、BF16、int8データ型を完全にサポートする予定です。ご期待ください。</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">ローリングアップグレード体験の大幅な改善 - ユーザのシームレスな移行<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>ローリングアップグレードは分散システムにとって重要な機能であり、ビジネスサービスを中断させたり、ダウンタイムを発生させることなくシステムのアップグレードを可能にします。Milvusの最新リリースでは、Milvusのローリングアップグレード機能を強化し、バージョン2.2.15から2.3.3およびそれ以降のバージョンへのアップグレードにおいて、より合理的かつ効率的な移行を実現しました。また、コミュニティは広範なテストと最適化に投資し、アップグレード中のクエリへの影響を5分未満に減らし、ユーザーに手間のかからない体験を提供します。</p>
<h2 id="Performance-optimization" class="common-anchor-header">パフォーマンスの最適化<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>新機能の導入に加え、最新の2つのリリースではMilvusのパフォーマンスを大幅に最適化しました。</p>
<ul>
<li><p>データコピー操作を最小化し、データロードを最適化</p></li>
<li><p>varchar一括読み込みによる大容量インサートの簡素化</p></li>
<li><p>データパディング時の不要なオフセットチェックを削除し、リコールフェーズのパフォーマンスを向上。</p></li>
<li><p>大容量のデータ挿入を伴うシナリオにおけるCPU消費量の問題に対処</p></li>
</ul>
<p>これらの最適化により、Milvusはより高速で効率的なサービスを提供できるようになりました。Milvusがどのようにパフォーマンスを向上させたかについては、モニタリングダッシュボードをご覧ください。</p>
<h2 id="Incompatible-changes" class="common-anchor-header">互換性のない変更<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>TimeTravel関連のコードを永久に削除しました。</p></li>
<li><p>メタデータストアとしてのMySQLのサポートを廃止しました。</p></li>
</ul>
<p><a href="https://milvus.io/docs/release_notes.md">Milvusの</a>新機能と機能強化の詳細については、<a href="https://milvus.io/docs/release_notes.md">Milvusリリースノートを</a>ご参照ください。</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>最新のMilvus 2.3.2および2.3.3リリースでは、堅牢で機能豊富、高性能なデータベースソリューションの提供をお約束いたします。Milvusを進化させ、最新のデータマネジメントの要求に応えるべく、これらの新機能を探索し、最適化を活用し、このエキサイティングな旅にご参加ください。今すぐ最新バージョンをダウンロードし、Milvusによるデータストレージの未来をご体験ください！</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">連絡を取り合いましょう<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>ご参加いただき、エンジニアやコミュニティと直接やりとりしていただくか、<a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn（</a>毎週火曜日PST12-12:30）にご参加ください。また、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInで</a>Milvusに関する最新ニュースやアップデートをフォローすることも大歓迎です。</p>
