---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: ベクターデータベースにおけるデータ挿入とデータ永続化
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: Milvusベクトルデータベースのデータ挿入とデータ永続化のメカニズムについて学びます。
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/sunby">Bingyi Sunが</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niが</a>トランスコードしたものです。</p>
</blockquote>
<p>前回のDeep Diveシリーズでは、世界で最も先進的なベクトル・データベースである<a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvusでデータがどのように処理されるかを</a>紹介した。今回は引き続き、データ挿入に関わるコンポーネントを検証し、データモデルを詳細に説明し、Milvusでどのようにデータの永続化が実現されているかを説明する。</p>
<p>ジャンプ</p>
<ul>
<li><a href="#Milvus-architecture-recap">Milvusアーキテクチャのまとめ</a></li>
<li><a href="#The-portal-of-data-insertion-requests">データ挿入リクエストのポータル</a></li>
<li><a href="#Data-coord-and-data-node">データ・コーディネートとデータ・ノード</a></li>
<li><a href="#Root-coord-and-Time-Tick">ルートコーディネータとタイムティック</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">データ構成：コレクション、パーティション、シャード（チャンネル）、セグメント</a></li>
<li><a href="#Data-allocation-when-and-how">データの割り当て：いつ、どのように</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Binlogファイル構造とデータの永続性</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Milvusアーキテクチャのまとめ<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>milvusのアーキテクチャ。</span> </span></p>
<p>SDKはロードバランサーを介してポータルであるプロキシにデータ要求を送信します。その後、プロキシはコーディネータサービスと対話し、DDL（データ定義言語）およびDML（データ操作言語）リクエストをメッセージストレージに書き込みます。</p>
<p>クエリーノード、データノード、インデックスノードを含むワーカーノードは、メッセージストレージからリクエストを消費する。具体的には、クエリーノードはデータクエリーを担当し、データノードはデータ挿入とデータ永続化を担当し、インデックスノードは主にインデックス構築とクエリーアクセラレーションを担当する。</p>
<p>最下層はオブジェクトストレージで、主にMinIO、S3、AzureBlobを活用してログ、デルタビンログ、インデックスファイルを保存する。</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">データ挿入リクエストのポータル<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>MilvusのProxy。</span> </span></p>
<p>Proxyはデータ挿入リクエストのポータルとして機能する。</p>
<ol>
<li>最初に、プロキシはSDKからのデータ挿入要求を受け付け、ハッシュアルゴリズムを用いてそれらの要求をいくつかのバケットに振り分ける。</li>
<li>次にプロキシはデータコーデックにMilvusの最小単位であるセグメントを割り当てるよう要求する。</li>
<li>その後、プロキシは要求されたセグメントの情報をメッセージストアに挿入し、これらの情報が失われないようにする。</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">データコーディネータとデータノード<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>データコーディネートの主な機能はチャネルとセグメントの割り当てを管理することであり、データノードの主な機能は挿入されたデータを消費し、永続化することである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvusにおけるデータコーディネータとデータノード</span> </span></p>
<h3 id="Function" class="common-anchor-header">機能</h3><p>データ・コーディネートは以下のような役割を果たす：</p>
<ul>
<li><p><strong>セグメントスペースの割り当て</strong>プロキシがセグメント内の空きスペースを使用してデータを挿入できるように、データコーディネータはプロキシに成長しているセグメント内のスペースを割り当てる。</p></li>
<li><p>データコーデックによって割り当てられた各セグメント内のスペースは永続的ではないため、データコーデックは各セグメント割り当ての有効期限も<strong>記録して</strong>おく必要がある。</p></li>
<li><p><strong>セグメント・データを自動的にフラッシュする</strong>セグメントがいっぱいになると、データ・コーデックは自動的にデータ・フラッ シュをトリガーする。</p></li>
<li><p><strong>データノードにチャネルを割り当てる</strong>コレクションは複数の<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannelsを</a>持つことができます。データ・コーデックは、どのvchannelsがどのデータ・ノードによって消費されるかを決定します。</p></li>
</ul>
<p>データノードは以下の役割を果たします：</p>
<ul>
<li><p><strong>データの消費</strong>データ・ノードはデータ・コーデックによって割り当てられたチャネルからデータを消費し、データ のシーケンスを作成します。</p></li>
<li><p><strong>データの永続性</strong>挿入されたデータをメモリにキャッシュし、データ量がある閾値に達すると、挿入されたデータをディスクに自動フラッシュする。</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">ワークフロー</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>1つのvchannelは1つのデータ・ノードにのみ割り当てることができる</span>。 </span></p>
<p>上の画像に示すように、コレクションには4つのvchannel（V1、V2、V3、V4）があり、2つのデータノードがあります。データ・コーディネータは1つのデータ・ノードにV1とV2のデータを消費させ、もう1つのデータ・ノードにV3とV4のデータを消費させる可能性が高い。1つのvchannelを複数のデータ・ノードに割り当てることはできないが、これはデータ消費の繰り返しを防ぐためであり、そうしないと同じセグメントに同じバッチが繰り返し挿入されることになる。</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">ルート・コーディネーションとタイムティック<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>ルート・コーデックはTSO（タイムスタンプ・オラクル）を管理し、タイムティック・メッセージをグローバルに発行する。各データ挿入リクエストには、ルート・コーデックによってタイムスタンプが割り当てられる。タイムティックはMilvusの要であり、Milvusの時計のような役割を果たし、Milvusシステムがどの時点にあるかを示します。</p>
<p>Milvusにデータが書き込まれる際、各データ挿入要求にはタイムスタンプが付与されます。データ消費時、各タイムデータノードはタイムスタンプが一定の範囲内にあるデータを消費する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>タイムスタンプに基づくデータ挿入とデータ消費の例</span>。 </span></p>
<p>上の画像はデータ挿入のプロセスです。タイムスタンプの値は1,2,6,5,7,8の数字で表される。データはp1とp2の2つのプロキシによってシステムに書き込まれる。データ消費中、タイム・ティックの現在時刻が5の場合、データ・ノードはデータ1と2のみを読み取ることができる。次に、2回目の読み取り時に、タイムティックの現在時刻が9になると、データノードによってデータ6,7,8を読み取ることができます。</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">データ構成：コレクション、パーティション、シャード（チャンネル）、セグメント<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Milvusにおけるデータ構成。</span> </span></p>
<p>まずこの<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">記事を</a>読んで、Milvusのデータモデルとコレクション、シャード、パーティション、セグメントの概念を理解しよう。</p>
<p>要約すると、Milvusにおける最大のデータ単位はコレクションであり、これはリレーショナルデータベースのテーブルに例えることができます。コレクションは複数のシャード（それぞれがチャネルに対応する）と、各シャード内の複数のパーティションを持つことができる。上の図に示すように、チャンネル（シャード）は縦棒であり、パーティションは横棒である。それぞれの交点にあるのがセグメントという概念で、データ割り当ての最小単位である。Milvusでは、インデックスをセグメント上に構築する。Milvusシステムはクエリ中、異なるクエリノードにおけるクエリ負荷のバランスをとるが、このプロセスはセグメントという単位に基づいて行われる。セグメントには複数の<a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">ビンログが</a>含まれており、セグメントデータが消費されるとビンログファイルが生成されます。</p>
<h3 id="Segment" class="common-anchor-header">セグメント</h3><p>Milvusのセグメントには、gloing、sealed、flushedの3種類があり、それぞれステータスが異なります。</p>
<h4 id="Growing-segment" class="common-anchor-header">成長セグメント</h4><p>グローイングセグメントは、データ挿入のためにプロキシに割り当てられる新しく作成されたセグメントです。セグメントの内部空間は、使用済み、割り当て済み、または空きである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>成長セグメントの3つのステータス</span> </span></p>
<ul>
<li>使用済み：使用済み：成長セグメントの空間のこの部分は、データノードによって消費された。</li>
<li>割り当て済み(Allocated): プロキシによって要求され、データノードによって割り当てられた。割り当てられた領域は、一定時間後に期限切れとなる。</li>
<li>Free: 成長セグメントのこの部分は使用されていない。空き領域の値は、セグメント全体の領域から使用済み領域と割り当て済み領域の値を引いたものに等しい。そのため、セグメントの空き領域は、割り当てられた領域が期限切れになるにつれて増えていく。</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">密閉されたセグメント</h4><p>封印されたセグメントとは、データ挿入のためにプロキシに割り当てられなくなった閉じたセグメントのことである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusにおけるクローズドセグメント</span> </span></p>
<p>以下の場合、成長セグメントは封印されます：</p>
<ul>
<li>成長セグメントの使用領域が全領域の75%に達した場合、セグメントは封印されます。</li>
<li>Milvusユーザが手動でFlush()を呼び出し、コレクション内のすべてのデータを永続化する。</li>
<li>成長セグメントが多すぎると、データノードがメモリを過剰に消費するためです。</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">フラッシュセグメント</h4><p>フラッシュされたセグメントとは、すでにディスクに書き込まれたセグメントのことである。フラッシュとは、データの永続化のためにセグメントデータをオブジェクトストレージに保存することです。セグメントをフラッシュできるのは、密閉されたセグメントで割り当てられた領域がなくなったときだけです。フラッシュされると、封印されたセグメントはフラッシュされたセグメントとなる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusにおけるフラッシュセグメント</span> </span></p>
<h3 id="Channel" class="common-anchor-header">チャンネル</h3><p>チャネルの割り当て</p>
<ul>
<li>データノードの起動またはシャットダウン時</li>
<li>プロキシによってセグメント領域が要求されたとき。</li>
</ul>
<p>チャネル割り当てにはいくつかの戦略があります。Milvusはそのうちの2つをサポートしています：</p>
<ol>
<li>一貫性ハッシュ</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusの一貫性ハッシング</span> </span></p>
<p>Milvusのデフォルト戦略。この戦略では、ハッシュ技術を利用して各チャネルにリング上の位置を割り当て、クロック方向に検索してチャネルに最も近いデータノードを見つける。したがって、上の図では、チャネル1はデータ・ノード2に割り当てられ、チャネル2はデータ・ノード3に割り当てられている。</p>
<p>しかし、この戦略の1つの問題点は、データ・ノード数の増減（新しいデータ・ノードの開始やデータ・ノードの突然のシャットダウンなど）がチャネル割り当てプロセスに影響を与える可能性があることです。この問題を解決するために、データ・コーディネートはetcdを介してデータ・ノードのステータスを監視し、データ・ノードのステータスに変更があった場合にデータ・コーディネートに即座に通知できるようにする。そしてデータ・コーディネートはさらに、どのデータ・ノードにチャンネルを適切に割り当てるかを決定する。</p>
<ol start="2">
<li>ロードバランシング</li>
</ol>
<p>第2の戦略は、同じコレクションのチャンネルを異なるデータノードに割り当て、チャンネルが均等に割り当てられるようにすることです。この戦略の目的はロードバランスを達成することである。</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">データ割り当て：いつ、どのように<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusのデータ割り当てプロセス</span> </span></p>
<p>データ割り当てのプロセスはクライアントから始まる。まず、タイムスタンプ（<code translate="no">t1</code> ）を持つデータ挿入リクエストをプロキシに送信する。次に、プロキシはデータコーディネイトにセグメント割り当て要求を送る。</p>
<p>セグメント割り当て要求を受信すると、データ コーダーはセグメントの状態をチェックし、セグメントを割り当てる。作成されたセグメントの現在のスペースが、新しく挿入されたデータ行に十分であれば、データ コーダーはそれらの作成されたセグメントを割り当てる。しかし、現在のセグメントで使用可能なスペースが十分でない場合は、 データ コーダーは新しいセグメントを割り当てる。データ・コーデックは、リクエストごとに 1 つ以上のセグメントを返すことができる。その間に、データコーデ ィネートは割り当てられたセグメントをメタサーバーに保存し、データを永続化する。</p>
<p>その後、データ コーダーは割り当てられたセグメントの情報(セグメントID、行数、有効期限<code translate="no">t2</code> など)をプロキシに返す。プロキシは、割り当てられたセグメントの情報をメッセー ジストアに送信し、これらの情報が適切に記録されるようにする。<code translate="no">t1</code> の値は、<code translate="no">t2</code> の値よりも小さくなければならないことに注意。<code translate="no">t2</code> のデフォルト値は2,000ミリ秒であり、<code translate="no">data_coord.yaml</code> ファイルのパラメータ<code translate="no">segment.assignmentExpiration</code> を設定することで変更できる。</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Binlogファイル構造とデータの永続性<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>データノードのフラッシュ</span> </span></p>
<p>データ・ノードはメッセージ・ストアをサブスクライブします。これは、データ挿入要求がメッセージ・ストアに保持され、データ・ノードが挿入メッセージを消費できるためです。データノードは最初に挿入要求を挿入バッファに置き、要求が蓄積されると、閾値に達した後にオブジェクトストレージにフラッシュされます。</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Binlogファイル構造</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Binlogファイル構造</span>。 </span></p>
<p>MilvusのBinlogファイル構造はMySQLのそれと似ています。Binlogはデータ復旧とインデックス構築の2つの機能を果たすために使用されます。</p>
<p>ビンログには多くの<a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">イベントが</a>含まれます。各イベントにはイベントヘッダとイベントデータがあります。</p>
<p>イベントヘッダには、ビンログ作成時刻、書き込みノードID、イベント長、NextPosition（次のイベントのオフセット）などのメタデータが書き込まれます。</p>
<p>イベントデータは固定と可変の2つに分けられる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>挿入イベントのファイル構造</span> </span></p>
<p><code translate="no">INSERT_EVENT</code> のイベント・データの固定部分には、<code translate="no">StartTimestamp</code> 、<code translate="no">EndTimestamp</code> 、<code translate="no">reserved</code> が含まれる。</p>
<p>可変部分には、挿入されたデータが格納される。挿入データはパーケット形式に配列され、このファイルに格納される。</p>
<h3 id="Data-persistence" class="common-anchor-header">データの永続化</h3><p>スキーマに複数のカラムがある場合、milvusはカラムにビンログを格納します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>ビンログデータの永続性</span> </span></p>
<p>上の図のように、最初のカラムは主キーbinlogです。2番目のカラムはタイムスタンプカラムです。残りはスキーマで定義されたカラムです。MinIOのbinlogのファイルパスも上の画像に示されています。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープダイブシリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
