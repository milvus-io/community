---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: Milvus、データ管理の再定義とストレージ能力の向上を実現するMMapを発表
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  MilvusのMMap機能は、限られたメモリ内でより多くのデータを扱えるようにするもので、パフォーマンス、コスト、システム制限の間で微妙なバランスを取ることができる。
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvusは</a>オープンソースの<a href="https://zilliz.com/blog/what-is-a-real-vector-database">ベクターデータベースで</a>最も高速なソリューションであり、集中的なパフォーマンスを必要とするユーザーに対応しています。しかし、ユーザーのニーズの多様性は、彼らが扱うデータを反映している。中には、圧倒的なスピードよりも、予算に見合ったソリューションや広大なストレージを優先するユーザーもいます。Milvusはこのような多様な要求を理解し、MMap機能を導入することで、大容量データの扱い方を再定義し、機能を犠牲にすることなくコスト効率を約束します。</p>
<h2 id="What-is-MMap" class="common-anchor-header">MMapとは？<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMapとは、memory-mapped filesの略で、オペレーティングシステム内のファイルとメモリ間のギャップを埋めるものです。この技術により、Milvusは大容量ファイルをシステムのメモリ空間に直接マッピングし、ファイルを連続したメモリブロックに変換することができます。この統合により、明示的な読み書きの操作が不要になり、Milvusのデータ管理方法が根本的に変わります。これにより、大容量ファイルやユーザがランダムにファイルにアクセスする必要がある場合でも、シームレスなアクセスと効率的なストレージを実現します。</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">MMapの利点は？<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースは、ベクターデータのストレージ要件のため、かなりのメモリ容量を必要とします。MMap機能により、限られたメモリ内でより多くのデータを処理することが可能になります。しかし、この能力の向上はパフォーマンス・コストを伴います。システムはインテリジェントにメモリを管理し、負荷と使用量に基づいていくつかのデータを退避させます。この退避により、Milvusは同じメモリ容量内でより多くのデータを処理できる。</p>
<p>我々のテストでは、十分なメモリを搭載している場合、ウォームアップ期間後にすべてのデータがメモリに常駐し、システムのパフォーマンスが維持されることが確認された。しかし、データ量が増加するにつれて、性能は徐々に低下します。<strong>したがって、性能の変動にあまり敏感でないユーザーにはMMap機能を推奨する。</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">MilvusでMMapを有効にする：簡単な設定<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusでMMapを有効にするのは非常に簡単です。<code translate="no">milvus.yaml</code> ファイルを修正するだけです。<code translate="no">queryNode</code> コンフィギュレーションの下に<code translate="no">mmapDirPath</code> アイテムを追加し、その値として有効なパスを設定します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">バランスをとる：パフォーマンス、ストレージ、システム制限<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>データアクセスパターンはパフォーマンスに大きく影響します。MilvusのMMap機能は局所性に基づいてデータアクセスを最適化します。MMapは、シーケンシャルにアクセスされるデータセグメントに対して、milvusがスカラーデータをディスクに直接書き込むことを可能にします。文字列のような可変長データは平坦化され、メモリ内のオフセット配列を使ってインデックスが付けられます。このアプローチにより、データアクセスの局所性が確保され、各可変長データを個別に格納するオーバーヘッドが排除される。ベクトル・インデックスの最適化には細心の注意が払われている。MMapは、隣接リストをメモリ内に保持しながら、ベクトル・データに対して選択的に採用され、パフォーマンスを損なうことなく大幅なメモリ節約を実現している。</p>
<p>さらに、MMapはメモリ使用量を最小化することでデータ処理を最大化する。QueryNodeがデータセット全体をコピーしていた以前のMilvusバージョンとは異なり、MMapは開発中に合理化されたコピーフリーのストリーミングプロセスを採用しています。この最適化により、メモリのオーバーヘッドが大幅に削減されます。</p>
<p><strong>社内テストの結果、MMapを有効にするとMilvusは2倍のデータ量を効率的に処理できることがわかりました。</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">今後の展望：継続的なイノベーションとユーザー中心の機能強化<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap機能はベータ段階ですが、Milvusチームは継続的な改善に取り組んでいます。今後のアップデートにより、システムのメモリ使用量が改善され、Milvusは単一ノードでより広範なデータボリュームをサポートできるようになります。ユーザーはMMap機能をより細かく制御できるようになり、コレクションの動的な変更や高度なフィールドロードモードが可能になります。これらの機能強化により、これまでにない柔軟性が提供され、ユーザーは特定の要件に合わせてデータ処理戦略を調整することができます。</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">結論：Milvus MMapで卓越したデータ処理を再定義する<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.3のMMap機能は、データ処理技術の大きな飛躍を意味します。Milvusは、性能、コスト、システム限界の微妙なバランスを取ることにより、膨大な量のデータを効率的かつコスト効率よく処理することを可能にします。Milvusは進化を続けながら、革新的なソリューションの最前線に立ち続け、データ管理において達成可能なことの限界を再定義していきます。</p>
<p>Milvusが比類のない優れたデータ処理への旅を続ける中、さらなる画期的な開発にご期待ください。</p>
