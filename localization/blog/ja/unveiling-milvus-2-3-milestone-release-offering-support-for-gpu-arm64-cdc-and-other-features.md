---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: Milvus2.3を発表：GPU、Arm64、CDC、その他多くの待望の機能をサポートするマイルストーンリリース
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus2.3は、GPU、Arm64、upsert、変更データキャプチャ、ScaNNインデックス、範囲検索のサポートを含む、多くの待望の機能を備えたマイルストーンリリースです。また、クエリー性能の向上、より強固なロードバランシングとスケジューリング、より優れた観測性と操作性が導入されています。
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>エキサイティングなニュースです！Milvus2.3は、GPU、Arm64、upsert、変更データキャプチャ、ScaNNインデックス、MMapテクノロジーのサポートなど、多くの待望の機能を搭載したマイルストーンバージョンです。また、Milvus 2.3では、クエリー性能の向上、より強固なロードバランシングとスケジューリング、より優れた観測性と操作性が導入されています。</p>
<p>私と共にこれらの新機能と機能強化を見て、このリリースからどのような恩恵を受けることができるかを学びましょう。</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">QPSを3～10倍高速化するGPUインデックスのサポート<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPUインデックスはMilvusコミュニティで非常に期待されている機能です。Nvidiaのエンジニアとの素晴らしいコラボレーションにより、Milvus 2.3では、MilvusインデックスエンジンであるKnowhereに追加された堅牢なRAFTアルゴリズムにより、GPUインデックスがサポートされました。GPUのサポートにより、Milvus 2.3は、CPU HNSWインデックスを使用する旧バージョンと比較して、QPSで3倍以上速くなり、重い計算を必要とする特定のデータセットでは、ほぼ10倍速くなりました。</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">ユーザーニーズの高まりに対応するArm64サポート<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>クラウドプロバイダーや開発者の間でArm CPUの人気が高まっています。この需要の高まりに対応するため、MilvusはARM64アーキテクチャ用のDockerイメージを提供するようになりました。この新しいCPUサポートにより、MacOSユーザはMilvusでよりシームレスにアプリケーションを構築することができます。</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">より良いユーザーエクスペリエンスのためのUpsertサポート<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3では、upsert操作をサポートすることで、注目すべき機能強化が行われています。この新機能により、ユーザーはデータの更新や挿入をシームレスに行うことができ、Upsertインターフェイスを通じて1回のリクエストで両方の操作を実行できるようになります。この機能は、データ管理を合理化し、効率性をもたらします。</p>
<p><strong>注意</strong></p>
<ul>
<li>アップサート機能は、自動インクリメントIDには適用されません。</li>
<li>アップサートは、<code translate="no">delete</code> と<code translate="no">insert</code> の組み合わせとして実装されているため、パフォーマンスが多少低下する可能性があります。Milvusを書き込みの多いシナリオで使用する場合は、<code translate="no">insert</code> を使用することをお勧めします。</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">より正確な結果を得るための範囲検索<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3では、クエリー中に入力ベクトルとMilvusに保存されているベクトルとの距離を指定することができます。Milvusは、設定された範囲内で一致するすべての結果を返します。以下は、範囲検索機能を使って検索距離を指定した例です。</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>この例では、ユーザはMilvusが入力ベクトルから10～20単位の距離内のベクトルを返すことを要求しています。</p>
<p><strong>注意</strong>: 異なる距離メトリクスは、距離の計算方法が異なるため、値の範囲やソート戦略が異なります。したがって、範囲検索機能を使用する前に、それぞれの特徴を理解することが不可欠です。</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">ScaNNインデックスによるクエリの高速化<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3では、Googleが開発したオープンソースの<a href="https://zilliz.com/glossary/anns">近似最近傍（ANN）</a>インデックスであるScaNNインデックスをサポートしました。ScaNNインデックスは様々なベンチマークで優れた性能を発揮しており、HNSWを約20%上回り、IVFFlatよりも約7倍高速です。ScaNNインデックスをサポートすることで、Milvusは旧バージョンと比較してはるかに高速なクエリを実現している。</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">成長するインデックスによる安定したクエリ性能の向上<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusにはインデックス付きデータとストリーミングデータの2つのカテゴリーがあります。Milvusはインデックスを使用してインデックス付きデータを高速に検索することができますが、ストリーミングデータは行単位でしか検索できないため、パフォーマンスに影響を与える可能性があります。Milvus2.3では、ストリーミングデータのリアルタイムインデックスを自動的に作成し、クエリのパフォーマンスを向上させるGrowing Indexが導入されました。</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">一括データ検索のためのイテレータ<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3では、16,384以上のエンティティを検索または範囲検索で取得できるイテレータインタフェースが導入されました。この機能は、数万またはそれ以上のベクトルを一括してエクスポートする必要がある場合に便利です。</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">MMapのサポートによる容量の増加<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMapは、ファイルやその他のオブジェクトをメモリにマッピングするために使用されるUNIXのシステムコールです。Milvus2.3はMMapをサポートしており、データをローカルディスクにロードし、それをメモリにマッピングすることで、シングルマシンの容量を増やすことができます。</p>
<p>当社のテスト結果によると、MMap技術を使用することで、Milvusは性能劣化を20％以内に抑えながら、データ容量を2倍に増やすことができます。このアプローチは全体的なコストを大幅に削減するため、性能の妥協を気にしない予算が限られたユーザーにとって特に有益です。</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">システムの可用性を高めるCDCサポート<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>変更データキャプチャ（CDC）は、データベースシステムで一般的に使用されている機能で、データの変更をキャプチャし、指定された宛先に複製します。CDC機能により、Milvus 2.3では、データセンター間でのデータの同期、増分データのバックアップ、シームレスなデータ移行が可能となり、システムの可用性が向上する。</p>
<p>上記の機能に加え、Milvus 2.3では、コレクションに格納されたデータの行数をリアルタイムで正確に計算するカウントインターフェイスの導入、ベクトル距離を測定するCosineメトリックのサポート、JSON配列に対するより多くの操作の追加などが行われている。より多くの機能と詳細情報については、<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3リリースノートを</a>参照してください。</p>
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
    </button></h2><p>Milvus 2.3では、新機能に加え、旧バージョンの改良とバグフィックスが多数含まれています。</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">データフィルタリングのパフォーマンス向上</h3><p>Milvusでは、より正確な結果を得るために、スカラーとベクトルのハイブリッドデータクエリにおいて、ベクトル検索の前にスカラーフィルタリングを行います。しかし、スカラーフィルタリング後にユーザーがあまりにも多くのデータをフィルタリングしてしまった場合、インデックス作成のパフォーマンスが低下する可能性があります。Milvus2.3では、この問題に対処するためにHNSWのフィルタリング戦略を最適化し、クエリ性能を向上させました。</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">マルチコアCPU使用率の向上</h3><p>近似最近傍探索(ANN)は膨大なCPUリソースを必要とする計算集約的なタスクです。以前のリリースでは、Milvusは利用可能なマルチコアCPUリソースの70%程度しか利用できませんでした。しかし、最新のリリースでは、Milvusはこの制限を克服し、利用可能な全てのマルチコアCPUリソースをフルに活用できるようになりました。</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">リファクタリングされたQueryNode</h3><p>QueryNodeはMilvusにおいてベクトル検索を担う重要なコンポーネントです。しかし、旧バージョンでは、QueryNodeは複雑なステート、重複したメッセージキュー、整理されていないコード構造、直感的でないエラーメッセージを持っていました。</p>
<p>Milvus 2.3では、ステートレスなコード構造を導入し、データ削除用のメッセージキューを削除することで、QueryNodeをアップグレードしました。これらのアップデートにより、リソースの浪費が減り、より高速で安定したベクトル検索が可能になりました。</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">NATSに基づくメッセージキューの強化</h3><p>Milvusはログ・ベースのアーキテクチャで構築されており、以前のバージョンでは、PulsarとKafkaをコア・ログ・ブローカーとして使用していました。しかし、この組み合わせは3つの重要な課題に直面していた：</p>
<ul>
<li>マルチ・トピックの状況では不安定だった。</li>
<li>アイドル時にリソースを消費し、メッセージの重複排除に苦労した。</li>
<li>PulsarとKafkaはJavaエコシステムと密接に結びついているため、彼らのコミュニティはGo SDKのメンテナンスやアップデートをほとんど行っていません。</li>
</ul>
<p>これらの問題を解決するために、私たちはMilvusの新しいログ・ブローカーとしてNATSとBookeeperを組み合わせました。</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">ロードバランサの最適化</h3><p>Milvus 2.3では、システムの実負荷に基づき、より柔軟なロードバランシングアルゴリズムを採用しました。この最適化されたアルゴリズムにより、ユーザはノードの障害やアンバランスな負荷を迅速に検出し、それに応じてスケジューリングを調整することができます。我々のテスト結果によると、Milvus 2.3は障害、アンバランスな負荷、異常なノードステータス、およびその他のイベントを数秒以内に検出し、迅速に調整を行うことができます。</p>
<p>Milvus 2.3の詳細については、<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3リリースノートを</a>ご参照ください。</p>
<h2 id="Tool-upgrades" class="common-anchor-header">ツールのアップグレード<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3のリリースに伴い、Milvusの運用・保守に役立つツールであるBirdwatcherとAttuのアップグレードを行いました。</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">バードウォッチャーアップデート</h3><p>Milvusのデバッグツールである<a href="https://github.com/milvus-io/birdwatcher">Birdwatcherを</a>アップグレードし、以下のような多くの機能強化が行われました：</p>
<ul>
<li>他の診断システムとシームレスに統合するためのRESTful API。</li>
<li>Go pprofツールとの統合を容易にするPProfコマンドのサポート。</li>
<li>ストレージ使用状況の分析機能</li>
<li>効率的なログ解析機能</li>
<li>etcd での設定の表示と変更のサポート。</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attuアップデート</h3><p>オール・イン・ワンのベクター・データベース管理ツールである<a href="https://zilliz.com/attu">Attuの</a>インターフェイスを一新しました。新しいインターフェースは、よりわかりやすいデザインで、理解しやすくなっています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>詳しくは<a href="https://milvus.io/docs/release_notes.md">Milvus 2.3リリースノートを</a>ご覧ください。</p>
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
    </button></h2><p>Milvusに関するご質問やご意見がございましたら、<a href="https://twitter.com/milvusio">Twitterや</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedInから</a>お気軽にお問い合わせください。また、私たちの<a href="https://milvus.io/slack/">Slackチャンネルに</a>参加してエンジニアやコミュニティと直接チャットしたり、<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">火曜日のオフィスアワーを</a>チェックしたりすることも大歓迎です！</p>
