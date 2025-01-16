---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: 使い方
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: 世界最先端のベクターデータベースMilvus 2.0の削除機能を支える基本設計。
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Milvusが分散クラスタでストリーミングデータを削除する方法</custom-h1><p>Milvus2.0は、バッチとストリームの統合処理とクラウドネイティブアーキテクチャを特徴としており、DELETE機能の開発において、前作よりも大きな挑戦となりました。その先進的なストレージと計算の分離設計と柔軟な公開/サブスクリプションメカニズムのおかげで、我々はそれを実現できたことを誇りに思います。Milvus2.0では、指定されたコレクション内のエンティティを主キーで削除することで、削除されたエンティティが検索やクエリの結果に表示されなくなります。</p>
<p>MilvusのDELETE操作は論理的な削除であり、物理的なデータのクリーンアップはData Compactionで行われることに注意してください。論理削除はI/O速度に制約される検索性能を大幅に向上させるだけでなく、データ復元を容易にします。論理削除されたデータも、タイムトラベル機能を利用することで復元することができます。</p>
<h2 id="Usage" class="common-anchor-header">使い方<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、Milvus 2.0のDELETE関数を試してみましょう。(以下の例ではMilvus 2.0.0上のPyMilvus 2.0.0を使用しています）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Milvusインスタンスにおいて、データノードは主にストリーミングデータ（ログブローカ内のログ）を履歴データ（ログスナップショット）としてパッキングし、オブジェクトストレージに自動的にフラッシュする役割を担っています。クエリノードは完全なデータ、すなわちストリーミングデータと履歴データの両方に対して検索要求を実行する。</p>
<p>クラスタ内の並列ノードのデータ書き込み能力を最大限に活用するため、Milvusはプライマリキーハッシングに基づくシャーディング戦略を採用し、書き込み処理を異なるワーカーノードに均等に分散する。つまり、プロキシはエンティティのデータ操作言語（DML）メッセージ（すなわちリクエスト）を同じデータノードとクエリノードにルーティングします。これらのメッセージはDML-Channelを通して公開され、データノードとクエリノードによって別々に消費され、検索とクエリのサービスを一緒に提供します。</p>
<h3 id="Data-node" class="common-anchor-header">データノード</h3><p>データINSERTメッセージを受信したデータノードは、メモリ内のストリーミングデータを受信するために作成された新しいセグメントである成長セグメントにデータを挿入します。データ行数か成長セグメントの持続時間のいずれかが閾値に達すると、データノードはそれを封印して、データの受信を防ぐ。その後、データノードは、履歴データを含む封印されたセグメントをオブジェクトストレージにフラッシュする。一方、データノードは新しいデータの主キーに基づいてブルームフィルタを生成し、封印されたセグメントと一緒にオブジェクトストレージに流し、セグメントの統計情報を含む統計バイナリログ（binlog）の一部としてブルームフィルタを保存する。</p>
<blockquote>
<p>ブルームフィルタは、長いバイナリベクトルと一連のランダムマッピング関数からなる確率的データ構造である。ある要素が集合のメンバーであるかどうかをテストするために使用できるが、偽の正一致を返す可能性がある。           -- ウィキペディア</p>
</blockquote>
<p>データ DELETE メッセージが来ると、データノードは対応するシャード内のすべてのブルームフィルタをバッファリングし、メッセージで指定されたプライマリキーと照合して、削除するエンティティを含む可能性のあるすべてのセグメント（成長しているものと封印されたものの両方から）を検索する。対応するセグメントを特定すると、data node はそれらをメモリにバッファリングして、削除操作を記録する Delta binlog を生成し、それらの binlog をセグメントと一緒にオブジェクトストレージにフラッシュします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>データノード</span> </span></p>
<p>1つのシャードには1つのDML-Channelしか割り当てられないため、クラスタに追加されたクエリノードはDML-Channelにサブスクライブできません。すべてのクエリノードが DELETE メッセージを受信できるように、データノードは DML-Channel からの DELETE メッセージをフィルタリングし、すべてのクエリノードに削除操作を通知するために Delta-Channel に転送します。</p>
<h3 id="Query-node" class="common-anchor-header">クエリノード</h3><p>オブジェクトストレージからコレクションをロードする場合、クエリノードはまず各シャードのチェックポイントを取得します。チェックポイントに基づき、クエリノードはすべてのシールされたセグメントをデルタビンログとブルームフィルタとともにロードします。すべてのデータがロードされると、クエリノードはDML-Channel、Delta-Channel、およびQuery-Channelをサブスクライブします。</p>
<p>コレクションがメモリにロードされた後、さらにデータINSERTメッセージが来た場合、クエリノードはまず、メッセージに従って成長しているセグメントをピンポイントで特定し、クエリのみを目的として、メモリ内の対応するブルームフィルタを更新する。これらのクエリ専用のブルームフィルタは、クエリ終了後にオブジェクトストレージにフラッシュされることはありません。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>クエリ・ノード</span> </span></p>
<p>上述したように、DML-Channel から DELETE メッセージを受信できるのは一定数のクエリ・ノードのみであり、そのクエリ・ノードのみが DELETE リクエストを成長するセグメントで実行できることを意味します。DML-Channel を購読しているクエリノードは、まず成長セグメントの DELETE メッセージをフィルタリングし、提供された主キーと成長セグメントのクエリ専用のブルームフィルタをマッチングさせてエンティティを特定し、対応するセグメントに削除操作を記録する。</p>
<p>DML-Channel をサブスクライブできないクエリノードは、Delta-Channel をサブスクライブし、データノードから転送された DELETE メッセージを受信することしかできないため、密封されたセグメントに対する検索リクエストやクエリリクエストを処理することしかできない。Delta-Channel から密閉されたセグメント内のすべての DELETE メッセージを収集した後、クエリノードは提供された主キーを密閉されたセグメントのブルームフィルターとマッチさせることでエンティティの位置を特定し、対応するセグメントに削除操作を記録する。</p>
<p>最終的に、検索またはクエリにおいて、クエリノードは削除レコードに基づいてビットセットを生成し、削除されたエンティティを省略し、セグメントのステータスに関係なく、すべてのセグメントから残りのエンティティを検索する。最後に、一貫性レベルは削除されたデータの可視性に影響します。強い一貫性レベル (前のコードサンプルで示したとおり) では、削除されたエンティティは削除後すぐに見えなくなります。Bounded Consistency Levelが採用されている場合、削除されたエンティティが見えなくなるまで数秒の待ち時間が発生します。</p>
<h2 id="Whats-next" class="common-anchor-header">次は何でしょうか？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvusが分散クラスタでストリーミングデータを削除する方法</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvusでデータをコンパクトにするには？</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvusはどのようにノード間のクエリ負荷をバランスさせるのか？</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitsetがベクトル類似検索の多様性を可能にする方法</a></li>
</ul>
