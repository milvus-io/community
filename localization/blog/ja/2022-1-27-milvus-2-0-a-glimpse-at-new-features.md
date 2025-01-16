---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: Milvus 2.0 - 新機能の紹介
author: Yanliang Qiao
date: 2022-01-27T00:00:00.000Z
desc: Milvus 2.0の最新機能をチェック。
cover: assets.zilliz.com/New_features_in_Milvus_2_0_93a87a7a8a.png
tag: Engineering
---
<custom-h1>Milvus 2.0：新機能を垣間見る</custom-h1><p>Milvus 2.0の最初のリリース候補から半年が経ちました。この度、Milvus 2.0の一般提供を開始する運びとなりました。Milvusの新機能を順を追ってご紹介いたします。</p>
<h2 id="Entity-deletion" class="common-anchor-header">エンティティ削除<button data-href="#Entity-deletion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.0はエンティティ削除に対応しており、ベクターの主キー(ID)に基づいてベクターを削除することができます。これにより、期限切れや無効なデータを心配する必要がなくなります。試してみましょう。</p>
<ol>
<li>Milvusに接続し、新しいコレクションを作成し、ランダムに生成された128次元ベクトルを300行挿入します。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># connect to milvus</span>
host = <span class="hljs-string">&#x27;x.x.x.x&#x27;</span>
connections.add_connection(default={<span class="hljs-string">&quot;host&quot;</span>: host, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-number">19530</span>})
connections.connect(alias=<span class="hljs-string">&#x27;default&#x27;</span>)
<span class="hljs-comment"># create a collection with customized primary field: id_field</span>
dim = <span class="hljs-number">128</span>
id_field = FieldSchema(name=<span class="hljs-string">&quot;cus_id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
age_field = FieldSchema(name=<span class="hljs-string">&quot;age&quot;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&quot;age&quot;</span>)
embedding_field = FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
schema = CollectionSchema(fields=[id_field, age_field, embedding_field],
                          auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;hello MilMil&quot;</span>)
collection_name = <span class="hljs-string">&quot;hello_milmil&quot;</span>
collection = Collection(name=collection_name, schema=schema)
<span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">300</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
ins_res = collection.insert(entities)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">insert entities primary keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299]
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>削除に進む前に、検索またはクエリで削除したいエンティティが存在することを確認し、結果が信頼できることを確認するために2回実行する。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># search</span>
nq = <span class="hljs-number">10</span>
search_vec = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nq)]
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
limit = <span class="hljs-number">3</span>
<span class="hljs-comment"># search 2 times to verify the vector persists</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>):
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
    expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
    <span class="hljs-comment"># query to verify the ids exist</span>
    query_res = collection.query(expr)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;query results: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>cus_id が 76 のエンティティを削除してから、このエンティティの検索とクエリを実行します。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;trying to delete one vector: id=<span class="hljs-subst">{ids[<span class="hljs-number">0</span>]}</span>&quot;</span>)
collection.delete(expr=<span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[ids[<span class="hljs-number">0</span>]]}</span>&quot;</span>)
results = collection.search(search_vec, embedding_field.name, search_params, limit)
ids = results[<span class="hljs-number">0</span>].ids
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">trying to <span class="hljs-keyword">delete</span> one <span class="hljs-attr">vector</span>: id=<span class="hljs-number">76</span>
after <span class="hljs-attr">deleted</span>: search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<p>削除したエンティティがまだ検索可能なのはなぜですか?Milvusのソースコードを確認すると、Milvus内での削除は非同期かつ論理的であることがわかります。つまり、エンティティは物理的には削除されません。その代わりに "deleted "マークが付けられ、検索やクエリ要求がそれらを取得することはありません。さらに、milvusはデフォルトでBounded Staleness一貫性レベルで検索を行います。したがって、削除されたエンティティはデータノードとクエリノードでデータが同期される前であればまだ検索可能です。削除されたエンティティを数秒後に検索またはクエリしてみると、そのエンティティが結果に含まれていないことに気づくでしょう。</p>
<pre><code translate="no" class="language-python">expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<h2 id="Consistency-level" class="common-anchor-header">一貫性レベル<button data-href="#Consistency-level" class="anchor-icon" translate="no">
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
    </button></h2><p>上記の実験は、整合性レベルが新しく削除されたデータの即時可視性にどのような影響を与えるかを示しています。 Milvusの整合性レベルは、様々なサービスシナリオに適応させるために、ユーザが柔軟に調整することができます。Milvus2.0では、4つの一貫性レベルをサポートしている：</p>
<ul>
<li><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> は最新のシステムタイムスタンプと同一に設定され、クエリノードはサービスタイムが最新のシステムタイムスタンプに進むまで待機し、検索またはクエリ要求を処理する。</li>
<li><code translate="no">CONSISTENCY_EVENTUALLY</code>:<code translate="no">GuaranteeTs</code> は最新のシステム・タイムスタンプより著しく小さく設定され、整合性チェックをスキップする。クエリ・ノードは既存のデータ・ビューを即座に検索する。</li>
<li><code translate="no">CONSISTENCY_BOUNDED</code>:<code translate="no">GuaranteeTs</code> が最新のシステム・タイムスタンプより相対的に小さく設定され、クエリ・ノードは許容範囲内で更新の少ないデータ・ビューを検索する。</li>
<li><code translate="no">CONSISTENCY_SESSION</code>:クライアントは最後の書き込み操作のタイムスタンプを<code translate="no">GuaranteeTs</code> 、各クライアントが少なくとも自分自身で挿入されたデータを検索できるようにする。</li>
</ul>
<p>以前のRCリリースでは、Milvusはデフォルトの一貫性としてStrongを採用していた。しかし、Milvusは、多くのユーザが性能よりも一貫性をあまり要求していないという事実を考慮し、デフォルトの一貫性をBounded Stalenessに変更した。将来的には、GuaranteeTsの設定をさらに最適化する予定である。<code translate="no">GuaranteeTs</code> の詳細については、<a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md">検索リクエストのGuarantee Timestampを</a>参照してください。</p>
<p>一貫性が低ければパフォーマンスが向上するのでしょうか？答えは試してみないとわかりません。</p>
<ol start="4">
<li>検索待ち時間を記録するために、上記のコードを修正してください。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>):
    start = time.time()
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    end = time.time()
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search latency: <span class="hljs-subst">{<span class="hljs-built_in">round</span>(end-start, <span class="hljs-number">4</span>)}</span>&quot;</span>)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li><code translate="no">consistency_level</code> を<code translate="no">CONSISTENCY_STRONG</code> に設定する以外は、同じデータ・スケールとパラメータで検索します。</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_strong&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_STRONG</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.3293
search latency: 0.1949
search latency: 0.1998
search latency: 0.2016
search latency: 0.198
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li><code translate="no">consistency_level</code> を<code translate="no">CONSISTENCY_BOUNDED</code> に設定したコレクションで検索します。</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_bounded&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_BOUNDED</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.0144
search latency: 0.0104
search latency: 0.0107
search latency: 0.0104
search latency: 0.0102
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>明らかに、<code translate="no">CONSISTENCY_BOUNDED</code> コレクションの平均検索待ち時間は、<code translate="no">CONSISTENCY_STRONG</code> コレクションの平均検索待ち時間より200ms短い。</li>
</ol>
<p>一貫性レベルがStrongに設定されている場合、削除されたエンティティはすぐに見えなくなりますか?答えはYesである。まだ自分で試すことができます。</p>
<h2 id="Handoff" class="common-anchor-header">ハンドオフ<button data-href="#Handoff" class="anchor-icon" translate="no">
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
    </button></h2><p>ストリーミングデータセットを扱う場合、多くのユーザはデータを挿入する前にインデックスを作成し、コレクションをロードすることに慣れています。Milvusの以前のリリースでは、生データをインデックスに置き換えるために、インデックス構築後に手作業でコレクションをロードする必要がありました。ハンドオフ機能により、Milvus 2.0は、インデックスがある閾値に達したストリーミングデータを置き換えるために、自動的にインデックスされたセグメントをロードし、検索パフォーマンスを大幅に向上させます。</p>
<ol start="8">
<li>インデックスを構築し、さらにエンティティを挿入する前にコレクションをロードする。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># index</span>
index_params = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">64</span>}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
<span class="hljs-comment"># load</span>
collection.load()
<button class="copy-code-btn"></button></code></pre>
<ol start="9">
<li>50,000行のエンティティを200回挿入する（便宜上、同じバッチのベクトルを使用するが、これは結果に影響しない）。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">50000</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">200</span>):
    ins_res = collection.insert(entities)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="10">
<li>挿入中と挿入後に、クエリノードのロードセグメント情報を確認します。</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># did this in another python console</span>
utility.get_query_segment_info(<span class="hljs-string">&quot;hello_milmil_handoff&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="11">
<li>クエリノードにロードされたすべてのシーリングセグメントがインデックス化されていることがわかります。</li>
</ol>
<pre><code translate="no">[<span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551298</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">394463520</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">747090</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
, <span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551297</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">397536480</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">752910</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
...
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-more" class="common-anchor-header">さらに<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>上記の機能に加えて、Milvus 2.0ではデータ圧縮、動的負荷分散などの新機能が導入されています。Milvusを使った探索の旅をお楽しみください！</p>
<p>近い将来、Milvus 2.0の新機能の設計を紹介する一連のブログをご紹介する予定です。</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">削除</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">データ圧縮</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">動的ロードバランス</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">ビットセット</a></li>
</ul>
<p>私たちは</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li><a href="https://milvus.io/">Milvus.io</a></li>
<li><a href="https://slack.milvus.io/">スラックチャンネル</a></li>
</ul>
