---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Milvusはどのようにノード間のクエリ負荷を分散しているのか？
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0はクエリーノード間の自動ロードバランスをサポートしています。
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog カバー画像</span> </span></p>
<p><a href="https://github.com/xige-16">西葛</a> 記</p>
<p>これまでのブログ記事で、Milvus 2.0のDeletion、Bitset、Compaction機能を順次紹介してきた。今回はその締めくくりとして、Milvusの分散クラスタにおける重要な機能であるロードバランスの設計についてご紹介したいと思います。</p>
<h2 id="Implementation" class="common-anchor-header">実装<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリノードでバッファリングされるセグメントの数やサイズが異なると、クエリノード間の検索パフォーマンスも異なります。最悪のケースは、数台のクエリノードが大量のデータを検索し尽くしているにもかかわらず、新たに作成されたクエリノードにはセグメントが配布されないためアイドル状態のままとなり、CPUリソースが大量に浪費され、検索性能が大幅に低下してしまうことである。</p>
<p>このような状況を避けるために、クエリコーディネータ（query coordinator）は、各クエリノードのRAM使用量に応じて、各クエリノードに均等にセグメントを分配するようにプログラムされている。そのため、CPUリソースはノード間で均等に消費され、検索性能が大幅に向上します。</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">自動ロードバランスのトリガー</h3><p>コンフィギュレーション<code translate="no">queryCoord.balanceIntervalSeconds</code> のデフォルト値に従って、クエリ・コーデックは 60 秒ごとにすべてのクエリ・ノードの RAM 使用率（パーセンテージ）をチェックします。以下の条件のいずれかが満たされると、クエリコーデックはクエリノード全体のクエリ負荷のバランスを取り始めます：</p>
<ol>
<li>クラスタ内のいずれかのクエリ・ノードのRAM使用率が<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> （デフォルト：90）より大きい；</li>
<li>または、2 つのクエリ・ノードの RAM 使用量の差の絶対値が<code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (デフォルト: 30) より大きい。</li>
</ol>
<p>ソースクエリノードからデスティネーションクエリノードへセグメントが転送された後、以下の両方の条件を満たす必要があります：</p>
<ol>
<li>転送先クエリ・ノードのRAM使用率が<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> （デフォルト：90）以下；</li>
<li>負荷分散後のソース・クエリ・ノードと宛先クエリ・ノードのRAM使用量の差の絶対値が、負荷分散前のそれよりも小さい。</li>
</ol>
<p>上記の条件が満たされると、クエリコーデックはノード間のクエリ負荷のバランスをとるために処理を進めます。</p>
<h2 id="Load-balance" class="common-anchor-header">ロードバランス<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>ロードバランスがトリガーされると、クエリコーデックは最初にターゲットセグメントをデスティネーションクエリノードにロードします。両方のクエリノードは、検索結果の完全性を保証するために、この時点でどの検索リクエストでもターゲットセグメントからの検索結果を返します。</p>
<p>宛先クエリノードがターゲットセグメントのロードに成功すると、クエリコーデ ィネートは<code translate="no">sealedSegmentChangeInfo</code> をクエリチャネルにパブリッシュする。以下に示すように、<code translate="no">onlineNodeID</code> と<code translate="no">onlineSegmentIDs</code> は、それぞれセグメントをロードしたクエリノードとロードしたセグメントを示し、<code translate="no">offlineNodeID</code> と<code translate="no">offlineSegmentIDs</code> は、それぞれセグメントを解放する必要があるクエリノードと解放するセグメントを示す。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p><code translate="no">sealedSegmentChangeInfo</code> を受け取ったソースクエリノードは、次にターゲットセグメントを解放する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>ロードバランスワークフロー</span> </span></p>
<p>すべてのプロセスは、ソースクエリノードがターゲットセグメントを解放するときに成功する。つまり、すべてのクエリノードのRAM使用量が<code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> よりも大きくなく、負荷分散後のソースクエリノードとデスティネーションクエリノードのRAM使用量の差の絶対値が負荷分散前よりも小さくなります。</p>
<h2 id="Whats-next" class="common-anchor-header">次は何ですか？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>2.0新機能シリーズのブログでは、新機能の設計を説明することを目的としています。このブログシリーズの続きを読む</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvusが分散クラスタ内のストリーミングデータを削除する方法</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvusでデータをコンパクトにするには？</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvusはどのようにノード間のクエリ負荷をバランスするのか？</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitsetがベクトル類似検索の多様性を可能にする方法</a></li>
</ul>
<p>Milvus 2.0新機能ブログシリーズは今回で最終回となります。本シリーズに続き、Milvus 2.0の基本アーキテクチャを紹介する新シリーズ「Milvus<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>」を企画中です。どうぞご期待ください。</p>
