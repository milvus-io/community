---
id: deep-dive-5-real-time-query.md
title: Milvusベクターデータベースのリアルタイムクエリへの利用
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Milvusのリアルタイムクエリの基本的なメカニズムについて学びます。
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/xige-16">Xi Geによって</a>書かれ、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niによって</a>翻訳されました。</p>
</blockquote>
<p>前回の記事では、Milvusにおける<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ挿入とデータ永続化について</a>お話しました。今回は、Milvusの<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">様々なコンポーネントが</a>どのように相互作用し、リアルタイムのデータクエリを完了するのかについて説明します。</p>
<p><em>始める前に役立つリソースを以下に示します。本記事のトピックをよりよく理解するために、まずこれらを読むことをお勧めします。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャのディープダイブ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvusデータモデル</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Milvusの各コンポーネントの役割と機能</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Milvusにおけるデータ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Milvusにおけるデータ挿入とデータ永続化</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">クエリノードへのデータロード<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリを実行する前に、まずクエリノードにデータをロードする必要があります。</p>
<p>クエリノードにロードされるデータには、<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">ログブローカからの</a>ストリーミングデータと<a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">オブジェクトストレージ</a>（以下、永続ストレージとも呼ぶ）からの履歴データの2種類があります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>フローチャート</span> </span></p>
<p>データコーディネータは、Milvusに継続的に投入されるストリーミングデータの処理を担当します。Milvusユーザがコレクションをロードするために<code translate="no">collection.load()</code> を呼び出すと、query coordはどのセグメントがストレージに永続化されているか、また対応するチェックポイントを知るためにdata coordに問い合わせます。チェックポイントは、チェックポイントの前に永続化されたセグメントは消費され、チェックポイントの後に永続化されたセグメントは消費されないことを示すマークである。</p>
<p>次に、クエリコーデ ィネータは、データコーデネータからの情報に基づいて、セグメントごと、またはチャンネルごと の割り当て戦略を出力する。セグメントアロケータは、永続ストレージ内のセグメント（バッチデータ）を異なるクエリノードに割り当てる役割を担っている。例えば、上の画像では、セグメントアロケータはセグメント 1 と 3 (S1, S3) をクエリノード 1 に、セグメント 2 と 4 (S2, S4) をクエリノード 2 に割り当てている。チャネルアロケータは、ログブローカ内の複数のデータ操作<a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">チャネル</a>（DMChannels）を監視するために、異なるクエリノードを割り当てます。例えば上の画像では、チャネルアロケータはクエリノード1をチャネル1（Ch1）の監視に割り当て、クエリノード2をチャネル2（Ch2）の監視に割り当てています。</p>
<p>この割り当て戦略により、各クエリノードはセグメントデータをロードし、それに応じてチャネルを監視する。画像のクエリノード1では、過去のデータ（バッチデータ）が、永続ストレージから割り当てられたS1とS3を介してロードされる。一方、クエリノード1は、ログブローカのチャネル1にサブスクライブすることで、増分データ（ストリーミングデータ）をロードする。</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">クエリノードにおけるデータ管理<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>クエリノードは履歴データと増分データの両方を管理する必要がある。履歴データは<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">密封された</a>セグメントに保存され、増分データは<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">成長する</a>セグメントに保存される。</p>
<h3 id="Historical-data-management" class="common-anchor-header">履歴データの管理</h3><p>履歴データ管理には、主にロードバランスとクエリノードのフェイルオーバーという2つの考慮事項があります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>ロードバランス</span> </span></p>
<p>例えば、図に示すように、クエリーノード4は他のクエリーノードよりも多くの封印セグメントを割り当てられています。このため、クエリ・ノード4がボトルネックとなり、クエリ・プロセス全体が遅くなる可能性が非常に高い。この問題を解決するために、システムはクエリーノード4のいくつかのセグメントを他のクエリーノードに割り当てる必要があります。これをロードバランスと呼ぶ。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>クエリーノードのフェイルオーバー</span> </span></p>
<p>もう1つ考えられる状況を上の図に示します。ノードの一つであるクエリーノード4が突然ダウンした。この場合、クエリー結果の正確性を確保するために、負荷（クエリーノード4に割り当てられたセグメント）を他の稼働中のクエリーノードに転送する必要があります。</p>
<h3 id="Incremental-data-management" class="common-anchor-header">インクリメンタルデータ管理</h3><p>クエリーノードはインクリメンタルデータを受信するためにDMChannelsを監視する。このプロセスにフローグラフが導入される。まず、すべてのデータ挿入メッセージをフィルタリングする。これは、指定されたパーティションのデータのみがロードされることを保証するためである。Milvusの各コレクションには対応するチャネルがあり、そのチャネルはコレクション内のすべてのパーティションで共有される。したがって、Milvusユーザーが特定のパーティションのデータのみをロードする必要がある場合、挿入されたデータをフィルタリングするためのフローグラフが必要となる。そうでなければ、コレクション内のすべてのパーティションのデータがクエリノードにロードされる。</p>
<p>フィルタリングされた後、増分データは成長するセグメントに挿入され、さらにサーバタイムノードに渡される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>フローチャート</span> </span></p>
<p>データ挿入中、各挿入メッセージにはタイムスタンプが割り当てられる。上図のDMChannelでは、データは左から右の順に挿入される。最初の挿入メッセージのタイムスタンプは「1」、2番目は「2」、3番目は「6」です。赤で示された4番目のメッセージは挿入メッセージではなく、タイムティック・メッセージです。これは、挿入されたデータのタイムスタンプがこのタイムティックより小さいものが、すでにログブローカにあることを示すものです。言い換えれば、このタイムティックメッセージの後に挿入されたデータは、すべてこのタイムティックより大きなタイムスタンプを持つはずです。例えば、上の図では、クエリノードが現在のタイムティックが5であると認識すると、タイムスタンプの値が5より小さい挿入メッセージはすべてクエリノードにロードされることを意味します。</p>
<p>サーバー時間ノードは、挿入ノードからタイムティックを受信するたびに、更新された<code translate="no">tsafe</code> 。<code translate="no">tsafe</code> は安全時間を意味し、この時点より前に挿入されたすべてのデータを照会できる。例えば、<code translate="no">tsafe</code> = 9の場合、9より小さいタイムスタンプで挿入されたデータは全てクエリ可能である。</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Milvusのリアルタイムクエリー<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusのリアルタイムクエリはクエリメッセージによって実現されます。クエリメッセージはプロキシによってログブローカに挿入される。クエリノードはログブローカのクエリチャネルを見てクエリメッセージを取得します。</p>
<h3 id="Query-message" class="common-anchor-header">クエリメッセージ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>クエリメッセージ</span> </span></p>
<p>クエリメッセージには、クエリに関する以下の重要な情報が含まれます：</p>
<ul>
<li><code translate="no">msgID</code>:メッセージID、システムによって割り当てられたクエリーメッセージのID。</li>
<li><code translate="no">collectionID</code>:クエリするコレクションのID（ユーザーによって指定された場合）。</li>
<li><code translate="no">execPlan</code>:実行計画は主にクエリの属性フィルタリングに使用されます。</li>
<li><code translate="no">service_ts</code>:サービス・タイムスタンプは、上記の<code translate="no">tsafe</code> 。サービスタイムスタンプは、どの時点でサービスが開始されたかを示す。<code translate="no">service_ts</code> より前に挿入されたデータはすべてクエリーに利用できる。</li>
<li><code translate="no">travel_ts</code>:トラベルタイムスタンプは過去の時間範囲を指定する。そして、クエリは<code translate="no">travel_ts</code> で指定された期間に存在するデータに対して行われる。</li>
<li><code translate="no">guarantee_ts</code>:保証タイムスタンプは、クエリを実行する必要がある期間を指定します。クエリは<code translate="no">service_ts</code> &gt;<code translate="no">guarantee_ts</code> の時のみ実行されます。</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">リアルタイムクエリ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>問い合わせプロセス</span> </span></p>
<p>Milvusは、クエリメッセージを受信すると、まず、現在のサービス時間（<code translate="no">service_ts</code> ）が、クエリメッセージに含まれるギャランティタイムスタンプ（<code translate="no">guarantee_ts</code> ）よりも大きいかどうかを判定する。Yesの場合、クエリが実行される。クエリは、履歴データと増分データの両方に対して並行して実行される。ストリーミング・データとバッチ・データの間にはデータの重複があり得るため、冗長なクエリ結果をフィルタリングするために「ローカル・リデュース」と呼ばれるアクションが必要である。</p>
<p>しかし、新しく挿入されたクエリーメッセージにおいて、現在のサービス時間が保証タイムスタンプよりも小さい場合、そのクエリーメッセージは未解決メッセージとなり、サービス時間が保証タイムスタンプよりも大きくなるまで処理されるのを待つ。</p>
<p>クエリ結果は最終的に結果チャネルにプッシュされる。プロキシはそのチャネルからクエリ結果を取得する。同様に、プロキシは、複数のクエリノードから結果を受信し、クエリ結果が繰 り返される可能性があるため、「グローバルリダクション」も実行する。</p>
<p>SDKに結果を返す前に、プロキシがすべてのクエリ結果を受け取ったことを確認するために、結果メッセージは、検索されたシールされたセグメント、検索されたDMChannels、およびグローバルシールされたセグメント(すべてのクエリノード上のすべてのセグメント)を含む情報の記録も保持する。システムは、以下の両方の条件が満たされた場合にのみ、プロキシがすべてのクエリ結果を受信したと結論づけることができる：</p>
<ul>
<li>すべての結果メッセージに記録されている、検索されたすべてのシ ールされたセグメントの合計が、グローバルシールされたセグメン トよりも大きい、</li>
<li>コレクション内のすべてのDMChannelsに問い合わせが行われた。</li>
</ul>
<p>最終的に、proxyは「global reduce」後の最終結果をmilvus SDKに返します。</p>
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
