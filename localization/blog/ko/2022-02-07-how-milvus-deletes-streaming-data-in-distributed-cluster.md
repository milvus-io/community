---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: 사용 방법
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: 세계에서 가장 진보된 벡터 데이터베이스인 Milvus 2.0의 삭제 기능의 기본 설계입니다.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Milvus가 분산 클러스터에서 스트리밍 데이터를 삭제하는 방법</custom-h1><p>통합 배치 및 스트림 처리와 클라우드 네이티브 아키텍처를 특징으로 하는 Milvus 2.0은 삭제 기능을 개발하는 과정에서 이전 버전보다 더 큰 도전에 직면하게 됩니다. 하지만 고급 스토리지-컴퓨팅 분리 설계와 유연한 게시/구독 메커니즘 덕분에 이를 달성할 수 있었음을 발표하게 되어 자랑스럽게 생각합니다. Milvus 2.0에서는 기본 키로 특정 컬렉션의 엔터티를 삭제할 수 있으며, 삭제된 엔터티는 더 이상 검색 또는 쿼리 결과에 나열되지 않습니다.</p>
<p>Milvus의 삭제 작업은 논리적 삭제를 의미하며, 물리적 데이터 정리는 데이터 압축 중에 수행된다는 점에 유의하세요. 논리적 삭제는 I/O 속도에 제약을 받는 검색 성능을 크게 향상시킬 뿐만 아니라 데이터 복구도 용이하게 해줍니다. 논리적으로 삭제된 데이터는 시간 이동 기능을 사용해 복구할 수 있습니다.</p>
<h2 id="Usage" class="common-anchor-header">사용 방법<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 Milvus 2.0에서 DELETE 함수를 사용해 보겠습니다. (다음 예제는 Milvus 2.0.0에서 PyMilvus 2.0.0을 사용합니다).</p>
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
<h2 id="Implementation" class="common-anchor-header">구현<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 인스턴스에서 데이터 노드는 주로 스트리밍 데이터(로그 브로커의 로그)를 기록 데이터(로그 스냅샷)로 패킹하고 자동으로 객체 스토리지로 플러시하는 역할을 담당합니다. 쿼리 노드는 전체 데이터, 즉 스트리밍 데이터와 기록 데이터 모두에 대한 검색 요청을 실행합니다.</p>
<p>클러스터 내 병렬 노드의 데이터 쓰기 용량을 최대한 활용하기 위해 Milvus는 기본 키 해싱을 기반으로 하는 샤딩 전략을 채택하여 쓰기 작업을 여러 작업자 노드에 균등하게 분산시킵니다. 즉, 프록시는 엔티티의 DML(데이터 조작 언어) 메시지(즉, 요청)를 동일한 데이터 노드와 쿼리 노드로 라우팅합니다. 이러한 메시지는 DML 채널을 통해 게시되고 데이터 노드와 쿼리 노드에서 별도로 소비되어 검색 및 쿼리 서비스를 함께 제공합니다.</p>
<h3 id="Data-node" class="common-anchor-header">데이터 노드</h3><p>데이터 노드는 데이터 INSERT 메시지를 수신하면 메모리에서 스트리밍 데이터를 수신하기 위해 생성된 새로운 세그먼트인 증가하는 세그먼트에 데이터를 삽입합니다. 데이터 행 수 또는 증가하는 세그먼트의 지속 시간이 임계값에 도달하면 데이터 노드는 세그먼트를 봉인하여 더 이상 데이터가 들어오는 것을 방지합니다. 그런 다음 데이터 노드는 기록 데이터가 포함된 봉인된 세그먼트를 오브젝트 스토리지로 플러시합니다. 한편, 데이터 노드는 새로운 데이터의 기본 키를 기반으로 블룸 필터를 생성하여 봉인된 세그먼트와 함께 오브젝트 스토리지에 플러시하고, 블룸 필터를 세그먼트의 통계 정보가 포함된 통계 바이너리 로그(binlog)의 일부로 저장합니다.</p>
<blockquote>
<p>블룸 필터는 긴 이진 벡터와 일련의 무작위 매핑 함수로 구성된 확률적 데이터 구조입니다. 어떤 요소가 집합의 멤버인지 여부를 테스트하는 데 사용할 수 있지만 오탐을 반환할 수 있습니다.           -- 위키백과</p>
</blockquote>
<p>데이터 삭제 메시지가 들어오면 데이터 노드는 해당 샤드의 모든 블룸 필터를 버퍼링하고 메시지에 제공된 기본 키와 일치시켜 삭제할 엔티티를 포함할 가능성이 있는 모든 세그먼트(성장 중인 세그먼트와 봉인된 세그먼트 모두에서)를 검색합니다. 해당 세그먼트를 정확히 찾아낸 데이터 노드는 메모리에 버퍼링하여 삭제 작업을 기록하는 델타 빈로그를 생성한 다음 해당 빈로그를 세그먼트와 함께 오브젝트 스토리지로 다시 플러시합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>데이터 노드</span> </span></p>
<p>하나의 샤드에는 하나의 DML 채널만 할당되므로 클러스터에 추가된 추가 쿼리 노드는 DML 채널에 가입할 수 없습니다. 모든 쿼리 노드가 DELETE 메시지를 수신할 수 있도록 하기 위해, 데이터 노드는 DML-Channel에서 DELETE 메시지를 필터링하고 이를 Delta-Channel로 전달하여 모든 쿼리 노드에 삭제 작업을 알립니다.</p>
<h3 id="Query-node" class="common-anchor-header">쿼리 노드</h3><p>오브젝트 스토리지에서 컬렉션을 로드할 때 쿼리 노드는 먼저 각 샤드의 체크포인트를 가져와 마지막 플러시 작업 이후의 DML 작업을 표시합니다. 이 체크포인트를 기반으로 쿼리 노드는 모든 봉인된 세그먼트와 해당 델타 빈로그 및 블룸 필터를 함께 로드합니다. 모든 데이터가 로드되면 쿼리 노드는 DML 채널, 델타 채널, 쿼리 채널에 가입합니다.</p>
<p>컬렉션이 메모리에 로드된 후 더 많은 데이터 INSERT 메시지가 오면 쿼리 노드는 먼저 메시지에 따라 증가하는 세그먼트를 찾아내고 쿼리 전용으로 메모리에 있는 해당 블룸 필터를 업데이트합니다. 이러한 쿼리 전용 블룸 필터는 쿼리가 완료된 후에도 오브젝트 스토리지로 플러시되지 않습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>쿼리 노드</span> </span></p>
<p>위에서 언급했듯이, 특정 수의 쿼리 노드만 DML-Channel로부터 DELETE 메시지를 수신할 수 있으며, 이는 증가하는 세그먼트에서 해당 노드만 DELETE 요청을 실행할 수 있음을 의미합니다. DML-Channel에 가입한 쿼리 노드의 경우, 먼저 성장하는 세그먼트에서 DELETE 메시지를 필터링하고, 제공된 기본 키를 성장하는 세그먼트의 쿼리 전용 블룸 필터와 일치시켜 엔터티를 찾은 다음, 해당 세그먼트에서 삭제 작업을 기록합니다.</p>
<p>DML 채널에 가입할 수 없는 쿼리 노드는 델타 채널에만 가입할 수 있기 때문에 봉인된 세그먼트에 대한 검색 또는 쿼리 요청만 처리하고 데이터 노드가 전달한 DELETE 메시지를 수신할 수 있습니다. 델타 채널에서 봉인된 세그먼트의 모든 DELETE 메시지를 수집한 쿼리 노드는 제공된 기본 키를 봉인된 세그먼트의 블룸 필터와 일치시켜 엔티티를 찾은 다음 해당 세그먼트에서 삭제 작업을 기록합니다.</p>
<p>결국 검색 또는 쿼리에서 쿼리 노드는 삭제 레코드를 기반으로 비트셋을 생성하여 삭제된 엔티티를 생략하고 세그먼트 상태에 관계없이 모든 세그먼트의 나머지 엔티티 중에서 검색합니다. 마지막으로 일관성 수준은 삭제된 데이터의 가시성에 영향을 미칩니다. 이전 코드 샘플에 표시된 것처럼 강력한 일관성 수준에서는 삭제된 엔티티가 삭제 후 즉시 보이지 않습니다. 경계 일관성 수준을 적용하면 삭제된 엔터티가 보이지 않게 되기까지 몇 초의 지연 시간이 발생합니다.</p>
<h2 id="Whats-next" class="common-anchor-header">다음 단계는 무엇인가요?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>2.0의 새로운 기능 시리즈 블로그에서는 새로운 기능의 설계에 대해 설명할 예정입니다. 이 블로그 시리즈에서 자세히 읽어보세요!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Milvus가 분산 클러스터에서 스트리밍 데이터를 삭제하는 방법</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Milvus에서 데이터를 압축하는 방법은 무엇인가요?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Milvus는 노드 간 쿼리 부하를 어떻게 분산하나요?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">비트셋으로 벡터 유사도 검색의 다양성을 구현하는 방법</a></li>
</ul>
