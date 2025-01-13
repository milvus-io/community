---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: Milvus 2.0 - 새로운 기능 살펴보기
author: Yanliang Qiao
date: 2022-01-27T00:00:00.000Z
desc: Milvus 2.0의 최신 기능을 확인하세요.
cover: assets.zilliz.com/New_features_in_Milvus_2_0_93a87a7a8a.png
tag: Engineering
---
<custom-h1>Milvus 2.0: 새로운 기능 살펴보기</custom-h1><p>Milvus 2.0의 첫 번째 릴리스 후보가 공개된 지 반년이 지났습니다. 이제 Milvus 2.0의 정식 출시를 발표하게 되어 자랑스럽게 생각합니다. Milvus가 지원하는 몇 가지 새로운 기능을 단계별로 살펴보시기 바랍니다.</p>
<h2 id="Entity-deletion" class="common-anchor-header">엔티티 삭제<button data-href="#Entity-deletion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0은 엔티티 삭제를 지원하여 사용자가 벡터의 기본 키(ID)를 기반으로 벡터를 삭제할 수 있습니다. 이제 더 이상 만료되거나 유효하지 않은 데이터에 대해 걱정할 필요가 없습니다. 직접 해보겠습니다.</p>
<ol>
<li>Milvus에 접속하여 새 컬렉션을 생성하고 무작위로 생성된 128차원 벡터 300줄을 삽입합니다.</li>
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
<li>삭제를 진행하기 전에 삭제하려는 엔티티가 검색 또는 쿼리를 통해 존재하는지 확인하고, 결과가 신뢰할 수 있는지 확인하기 위해 두 번 수행합니다.</li>
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
<li>cus_id가 76인 엔티티를 삭제한 다음 이 엔티티를 검색 및 쿼리합니다.</li>
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
<p>삭제된 엔티티가 여전히 검색 가능한 이유는 무엇인가요? Milvus의 소스 코드를 확인해보셨다면 Milvus 내 삭제는 비동기적이고 논리적이기 때문에 엔티티가 물리적으로 삭제되지 않는다는 것을 알 수 있습니다. 대신, 검색이나 쿼리 요청이 해당 엔티티를 검색하지 못하도록 '삭제됨' 표시가 첨부됩니다. 또한 Milvus는 기본적으로 제한된 유효성 일관성 수준에서 검색을 수행합니다. 따라서 삭제된 엔티티는 데이터 노드와 쿼리 노드에서 데이터가 동기화되기 전에도 여전히 검색할 수 있습니다. 몇 초 후에 삭제된 엔티티를 검색하거나 쿼리하면 더 이상 결과에서 찾을 수 없습니다.</p>
<pre><code translate="no" class="language-python">expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<h2 id="Consistency-level" class="common-anchor-header">일관성 수준<button data-href="#Consistency-level" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 실험은 일관성 수준이 새로 삭제된 데이터의 즉각적인 가시성에 어떤 영향을 미치는지 보여줍니다. 사용자는 Milvus의 일관성 수준을 유연하게 조정하여 다양한 서비스 시나리오에 맞게 조정할 수 있습니다. Milvus 2.0은 4단계의 일관성 수준을 지원합니다:</p>
<ul>
<li><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> 은 최신 시스템 타임스탬프와 동일하게 설정되며, 쿼리 노드는 서비스 시간이 최신 시스템 타임스탬프로 진행될 때까지 기다린 후 검색 또는 쿼리 요청을 처리합니다.</li>
<li><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> 은 최신 시스템 타임스탬프보다 약간 작게 설정하여 일관성 검사를 건너뜁니다. 쿼리 노드는 기존 데이터 보기에서 즉시 검색합니다.</li>
<li><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> 은 최신 시스템 타임스탬프보다 상대적으로 작게 설정되며, 쿼리 노드는 허용 가능한, 덜 업데이트된 데이터 보기에서 검색합니다.</li>
<li><code translate="no">CONSISTENCY_SESSION</code>: 클라이언트는 마지막 쓰기 작업의 타임스탬프를 <code translate="no">GuaranteeTs</code> 으로 사용하여 각 클라이언트가 최소한 자체적으로 삽입한 데이터를 검색할 수 있도록 합니다.</li>
</ul>
<p>이전 RC 릴리스에서 Milvus는 기본 일관성으로 Strong을 채택했습니다. 그러나 대부분의 사용자가 성능보다 일관성에 대한 요구가 덜하다는 점을 고려하여 Milvus는 기본 일관성을 요구 사항의 균형을 더 많이 맞출 수 있는 Bounded Staleness로 변경했습니다. 향후에는 현재 릴리스에서는 컬렉션 생성 중에만 달성할 수 있는 GuaranteeT의 구성을 더욱 최적화할 예정입니다. 자세한 내용은 <code translate="no">GuaranteeTs</code> 에서 <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md">검색 요청의 타임스탬프 보장을</a> 참조하세요.</p>
<p>일관성을 낮추면 성능이 향상되나요? 해보기 전까지는 답을 찾을 수 없습니다.</p>
<ol start="4">
<li>위의 코드를 수정하여 검색 지연 시간을 기록해 보세요.</li>
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
<li><code translate="no">consistency_level</code> 을 <code translate="no">CONSISTENCY_STRONG</code> 으로 설정한다는 점을 제외하고 동일한 데이터 스케일과 매개변수로 검색합니다.</li>
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
<li><code translate="no">consistency_level</code> 을 <code translate="no">CONSISTENCY_BOUNDED</code> 으로 설정한 컬렉션에서 검색합니다.</li>
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
<li>분명히 <code translate="no">CONSISTENCY_BOUNDED</code> 컬렉션의 평균 검색 지연 시간이 <code translate="no">CONSISTENCY_STRONG</code> 컬렉션의 검색 지연 시간보다 200ms 더 짧습니다.</li>
</ol>
<p>일관성 수준을 강함으로 설정하면 삭제된 엔터티가 즉시 보이지 않나요? 대답은 '예'입니다. 직접 시도해 볼 수 있습니다.</p>
<h2 id="Handoff" class="common-anchor-header">핸드오프<button data-href="#Handoff" class="anchor-icon" translate="no">
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
    </button></h2><p>스트리밍 데이터 집합으로 작업할 때, 많은 사용자들은 데이터를 삽입하기 전에 인덱스를 만들고 컬렉션을 로드하는 데 익숙합니다. 이전 버전의 Milvus에서는 사용자가 인덱스 구축 후 수동으로 컬렉션을 로드하여 원시 데이터를 인덱스로 대체해야 했기 때문에 느리고 번거로웠습니다. 밀버스 2.0은 핸드오프 기능을 통해 인덱싱된 세그먼트를 자동으로 로드하여 특정 임계값에 도달한 스트리밍 데이터를 인덱스로 대체함으로써 검색 성능을 크게 향상시켰습니다.</p>
<ol start="8">
<li>더 많은 엔티티를 삽입하기 전에 인덱스를 구축하고 컬렉션을 로드하세요.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># index</span>
index_params = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">64</span>}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
<span class="hljs-comment"># load</span>
collection.load()
<button class="copy-code-btn"></button></code></pre>
<ol start="9">
<li>50,000행의 엔티티를 200회 삽입합니다(편의를 위해 동일한 배치의 벡터를 사용하지만 결과에는 영향을 미치지 않습니다).</li>
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
<li>삽입 중과 삽입 후에 쿼리 노드에서 로딩 세그먼트 정보를 확인합니다.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># did this in another python console</span>
utility.get_query_segment_info(<span class="hljs-string">&quot;hello_milmil_handoff&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="11">
<li>쿼리 노드에 로드된 모든 봉인된 세그먼트가 색인된 것을 확인할 수 있습니다.</li>
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
<h2 id="Whats-more" class="common-anchor-header">그 외<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 기능 외에도 데이터 압축, 동적 부하 분산 등과 같은 새로운 기능들이 Milvus 2.0에 도입되었습니다. Milvus와 함께 즐거운 탐험을 시작하세요!</p>
<p>조만간 밀버스 2.0의 새로운 기능의 설계를 소개하는 블로그 시리즈를 통해 여러분과 함께 공유할 예정입니다.</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">삭제</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">데이터 압축</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">동적 로드 밸런스</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">비트셋</a></li>
</ul>
<p>우리를 찾아주세요:</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li><a href="https://milvus.io/">Milvus.io</a></li>
<li><a href="https://slack.milvus.io/">슬랙 채널</a></li>
</ul>
