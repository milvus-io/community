---
id: deep-dive-3-data-processing.md
title: ベクターデータベースでデータはどのように処理されるのか？
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: Milvusは本番AIアプリケーションに不可欠なデータ管理インフラを提供する。本記事では、データ処理の内部事情を公開する。
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/czs007">Zhenshan Caoが</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niが</a>トランスコードしたものです。</p>
</blockquote>
<p>このブログシリーズの前の2つの投稿では、世界で最も先進的なベクトル・データベースであるMilvusの<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">システム・アーキテクチャと</a>、その<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDKとAPIについて</a>すでに説明した。</p>
<p>本記事では、Milvusのシステムに深く入り込み、データ処理コンポーネント間の相互作用を検証することで、Milvusでデータがどのように処理されるかを理解していただくことを主な目的としています。</p>
<p><em>始める前に役立つリソースを以下に示します。本記事のトピックをより深く理解するために、まずこれらをお読みになることをお勧めします。</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの深掘り</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Milvusデータモデル</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Milvusの各コンポーネントの役割と機能</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Milvusにおけるデータ処理</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">MsgStreamインターフェース<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">MsgStreamインターフェイスは</a>milvusのデータ処理において非常に重要である。<code translate="no">Start()</code> が呼び出されると、バックグラウンドのコルーチンがデータを<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">ログブローカに</a>書き込んだり、ログブローカからデータを読み込んだりします。<code translate="no">Close()</code> が呼び出されると、コルーチンは停止します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>MsgStream インターフェース</span> </span></p>
<p>MsgStreamはプロデューサとしてもコンシューマとしても機能する。<code translate="no">AsProducer(channels []string)</code> インターフェースはMsgStreamをプロデューサーとして定義し、<code translate="no">AsConsumer(channels []string, subNamestring)</code>はコンシューマーとして定義している。パラメータ<code translate="no">channels</code> は両インターフェースで共有され、どの（物理）チャネルにデータを書き込むか、またはどのチャネルからデータを読み取るかを定義するために使用される。</p>
<blockquote>
<p>コレクション内のシャードの数は、コレクションの作成時に指定できる。各シャードは<a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">仮想チャネル（vchannel</a>）に対応する。したがって、コレクションは複数のvchannelを持つことができます。Milvusはログブローカ内の各vchannelに<a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">物理チャネル(pchannel)</a>を割り当てます。</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>各仮想チャネル/シャードは物理チャネルに対応します</span>。 </span></p>
<p><code translate="no">Produce()</code> MsgStream インターフェースは、ログブローカの pchannel にデータを書き込む役割を果たします。データは2つの方法で書き込むことができる：</p>
<ul>
<li>単一書き込み： エンティティは主キーのハッシュ値によって異なるシャード（vchannel）に書き込まれる。その後、これらのエンティティはログブローカの対応するpchannelsに流れ込む。</li>
<li>ブロードキャスト書き込み: エンティティは、パラメータ<code translate="no">channels</code> で指定されたすべての pchannels に書き込まれる。</li>
</ul>
<p><code translate="no">Consume()</code> はブロッキングAPIの一種である。指定されたpchannelに利用可能なデータがない場合、MsgStreamインターフェースで が呼び出されると、コルーチンはブロックされる。一方、 はノンブロッキングAPIであり、指定されたpchannelに既存のデータがある場合にのみ、コルーチンはデータを読み込んで処理する。そうでなければ、コルーチンは他のタスクを処理することができ、利用可能なデータがないときにブロックされることはない。<code translate="no">Consume()</code> <code translate="no">Chan()</code> </p>
<p><code translate="no">Seek()</code> は障害回復のためのメソッドです。新しいノードが起動すると、 を呼び出すことで、データ消費記録を取得し、中断したところからデータ消費を再開することができます。<code translate="no">Seek()</code></p>
<h2 id="Write-data" class="common-anchor-header">データの書き込み<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>異なるVチャネル（シャード）に書き込まれるデータには、挿入メッセージと削除メッセージがある。これらのvchannelsはDmChannels（データ操作チャネル）とも呼ばれます。</p>
<p>異なるコレクションはログブローカ内で同じ pchannels を共有することができます。1つのコレクションは複数のシャードを持つことができ、したがって複数の対応するvchannelsを持つことができます。同じコレクション内のエンティティは、結果的にログブローカ内の複数の対応するpchannelsに流れます。その結果、pchannelsを共有する利点は、ログブローカの高い同時実行性によって可能になるスループットの増大です。</p>
<p>コレクションが作成されるとき、シャードの数が指定されるだけでなく、ログブローカ内のvchannelsとpchannels間のマッピングも決定されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusにおける書き込みパス</span> </span></p>
<p>上の図に示すように、書き込み経路では、プロキシがMsgStreamの<code translate="no">AsProducer()</code> インタフェースを介してログブローカにデータを書き込む。その後、データノードがデータを消費し、消費されたデータを変換してオブジェクトストレージに格納します。ストレージ・パスは、データ・コーディネータがetcdに記録するメタ情報の一種である。</p>
<h3 id="Flowgraph" class="common-anchor-header">フローグラフ</h3><p>異なるコレクションがログブローカ内で同じpchannelを共有する可能性があるため、データを消費する際、データノードやクエリノードはpchannel内のデータがどのコレクションに属するかを判断する必要がある。この問題を解決するために、Milvusではflowgraphを導入しました。これは主にコレクションIDによって共有pchannel内のデータをフィルタリングする役割を担っている。つまり、各flowgraphは、コレクション内の対応するシャード（vchannel）のデータストリームを処理する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>書き込みパスのフローグラフ</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStreamの生成</h3><p>データを書き込む際、以下の2つのシナリオでMsgStreamオブジェクトが生成される：</p>
<ul>
<li>プロキシがデータ挿入要求を受信すると、まずルート・コーディネータ（root coordinator）を介してvchannelsとpchannelsの間のマッピングを取得しようとする。次に、プロキシはMsgStreamオブジェクトを作成する。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>シナリオ1</span> </span></p>
<ul>
<li>データノードが起動し、etcd内のチャネルのメタ情報を読み込むと、MsgStreamオブジェクトが生成される。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>シナリオ2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">データの読み込み<button data-href="#Read-data" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvusにおける読み込みパス</span> </span></p>
<p>データ読み込みの一般的なワークフローを上の図に示す。クエリ要求はDqRequestChannelを介してクエリノードにブロードキャストされる。クエリノードはクエリタスクを並列実行する。クエリーノードからのクエリー結果はgRPCを経由し、プロキシが結果を集約してクライアントに返す。</p>
<p>データ読み取りプロセスを詳しく見ると、プロキシがDqRequestChannelにクエリ要求を書き込んでいることがわかる。そして、クエリノードはDqRequestChannelをサブスクライブすることでメッセージを消費する。DqRequestChannelの各メッセージはブロードキャストされ、サブスクライブしたすべてのクエリノードがメッセージを受信できる。</p>
<p>クエリノードはクエリ要求を受信すると、密封されたセグメントに格納されたバッチデータと、Milvusに動的に挿入され、成長するセグメントに格納されたストリーミングデータの両方に対してローカルクエリを実行する。その後、クエリノードは<a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">密閉セグメントと成長セグメントの</a>両方でクエリ結果を集約する必要がある。これらの集約結果はgRPCを介してプロキシに渡される。</p>
<p>プロキシは複数のクエリノードからすべての結果を収集し、それらを集約して最終的な結果を得る。そして、プロキシは最終的なクエリ結果をクライアントに返す。各クエリリクエストとそれに対応するクエリ結果は同じ一意なrequestIDでラベル付けされているので、プロキシはどのクエリリリクエストにどのクエリ結果が対応するかを把握することができる。</p>
<h3 id="Flowgraph" class="common-anchor-header">フローグラフ</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>読み取りパスのフローグラフ</span> </span></p>
<p>書き込みパスと同様に、フローグラフは読み取りパスにも導入される。Milvusは、インクリメンタルデータとヒストリカルデータの処理を統合するユニファイドラムダアーキテクチャを実装している。そのため、クエリノードはリアルタイムのストリーミングデータも取得する必要がある。同様に、読み取りパスのフローグラフは、異なるコレクションからのデータをフィルタリングし、区別する。</p>
<h3 id="MsgStream-creation" class="common-anchor-header">MsgStreamの作成</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>読み取りパスでのMsgStreamオブジェクトの作成</span> </span></p>
<p>データを読み込む際、以下のシナリオでMsgStreamオブジェクトを作成します：</p>
<ul>
<li>Milvusでは、データはロードされないと読み込むことができません。プロキシはデータロード要求を受け取ると、その要求をクエリコーディネータに送信し、クエリコーディネータは異なるクエリノードへのシャードの割り当て方法を決定します。割り当て情報（vchannelの名前、vchannelと対応するpchannel間のマッピング）は、メソッドコールまたはRPC（リモートプロシージャコール）を介してクエリノードに送信される。その後、クエリ・ノードは対応するMsgStreamオブジェクトを作成してデータを消費します。</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">DDL 操作<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>DDL はデータ定義言語の略です。メタデータに対する DDL 操作は、書き込み要求と読み取り要求に分類できます。ただし、メタデータ処理中、この2種類の要求は同等に扱われます。</p>
<p>メタデータの読み取り要求には以下が含まれます：</p>
<ul>
<li>クエリ・コレクション・スキーマ</li>
<li>クエリ・インデキシング情報。</li>
</ul>
<p>書き込みリクエストには以下が含まれます：</p>
<ul>
<li>コレクションの作成</li>
<li>コレクションの削除</li>
<li>インデックスの作成</li>
<li>インデックスの削除 など</li>
</ul>
<p>DDL リクエストはクライアントからプロキシに送られ、プロキシは受け取った順番に これらのリクエストをルートコーデックに渡し、ルートコーデックは各 DDL リクエストにタイムスタンプを割り当て、リクエストの動的チェックを行います。プロキシは各リクエストを一度に一つのDDLリクエストを意味するシリ アルな方法で操作する。プロキシは、前のリクエストの処理を完了し、ルートコー ドから結果を受け取るまで、次のリクエストを処理しない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>DDL操作</span>。 </span></p>
<p>上の図に示すように、ルート・コー ディネート・タスク・キューには<code translate="no">K</code> DDL要求がある。タスク・キュー内の DDL 要求は、ルート・コー ディネートが受信した順に並べられる。つまり、<code translate="no">ddl1</code> がルート・コー ディネートに最初に送られたもので、<code translate="no">ddlK</code> がこのバッチの最後のものである。ルートコーデ ィックは時間順に一つずつリクエストを処理する。</p>
<p>分散システムでは、プロキシとルートコーデック間の通信はgRPCによって 有効にされる。ルートコーデ ィションは、すべてのDDLリクエストが時間順に処理されることを保証するた めに、実行されたタスクの最大タイムスタンプ値の記録を保持する。</p>
<p>2つの独立したプロキシ、プロキシ1とプロキシ2があるとする。両者は同じルートコー ドにDDLリクエストを送る。しかし、一つの問題は、先に送られたリクエストが、後で別のプロキシが 受け取ったリクエストよりも先にルートコーダに送られるとは限らない ことである。例えば、上の画像では、<code translate="no">DDL_K-1</code> がプロキシ1からルートコー ディネートに送られたとき、プロキシ2からの<code translate="no">DDL_K</code> はすでにルートコー ディネートによって受け入れられ、実行されている。ルートコー ドによって記録されるように、この時点で実行されたタスクの最大タ イムスタンプ値は、<code translate="no">K</code> である。したがって、時間順 序を中断しないために、リクエスト<code translate="no">DDL_K-1</code> はルートコー ドのタスクキューによって拒否される。しかし、プロキシ2がこの時点でルートコー ドにリクエスト<code translate="no">DDL_K+5</code> を送ると、リクエストはタスクキューに受 け入れられ、そのタイムスタンプ値に従って後で実行される。</p>
<h2 id="Indexing" class="common-anchor-header">インデックスの構築<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">インデックスの構築</h3><p>クライアントからインデックス構築リクエストを受け取ると、プロキシはまずリクエストの 静的チェックを行い、それをルートコーデックに送る。それからルートコーディネータはこれらのインデックス構築要求をメタストレージ(etcd)に永続化し、インデックスコーディネータ(index coordinator)に要求を送る。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>インデックスの構築</span>。 </span></p>
<p>上図のように、インデックス・コーディネータはルート・コーディネータからインデックス構築要求を受け取ると、まずメタ・ストレージのetcdにタスクを永続化する。インデックス構築タスクの初期ステータスは<code translate="no">Unissued</code> である。インデックス・コーダは、各インデックス・ノードのタスク負荷の記録を保持し、負荷の少ないインデックス・ノードに受信タスクを送ります。タスクが完了すると、インデックスノードはそのタスクのステータス、<code translate="no">Finished</code> または<code translate="no">Failed</code> をmilvusのetcdであるメタストレージに書き込みます。その後、インデックス・ノードはetcdを検索することで、インデックス構築タスクが成功したか失敗したかを理解します。タスクがシステムリソースの制限やインデックスノードの脱落により失敗した場合、インデックスコーデックはプロセス全体を再トリガーし、同じタスクを別のインデックスノードに割り当てます。</p>
<h3 id="Dropping-an-index" class="common-anchor-header">インデックスの削除</h3><p>さらに、インデックス・コーディネータはインデックスの削除依頼も担当します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>インデックスの削除</span>。 </span></p>
<p>ルート・コーダはクライアントからインデックスの削除要求を受け取ると、まずそのインデックスを &quot;dropped &quot;としてマークし、その結果をインデックス・コーダに通知しながらクライアントに返します。次に、インデックス・コーダはすべてのインデックス作成タスクを<code translate="no">IndexID</code> でフィルタリングし、条件に一致するタスクをドロップする。</p>
<p>インデックス・コーディネーターのバックグラウンド・コルーチンは、オブジェクト・ストレージ（MinIOとS3）から、"droped "とマークされたすべてのインデックス作成タスクを徐々に削除する。このプロセスには、recycleIndexFilesインターフェースが関係します。対応するインデックスファイルがすべて削除されると、削除されたインデックス作成タスクのメタ情報がメタストレージ（etcd）から削除されます。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープ・ダイブ・シリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
