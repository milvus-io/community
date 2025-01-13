---
id: in-memory-replicas.md
title: 인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 증대
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: 인메모리 복제본을 사용하여 읽기 처리량과 하드웨어 리소스 활용도를 향상하세요.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_image</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/congqixia">콩치 샤와</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 공동 집필했습니다.</p>
</blockquote>
<p>공식 출시와 함께 Milvus 2.1은 편의성과 더 나은 사용자 경험을 제공하기 위해 많은 새로운 기능을 제공합니다. 인메모리 복제본이라는 개념은 분산 데이터베이스의 세계에서 새로운 것은 아니지만, 시스템 성능을 높이고 시스템 가용성을 손쉽게 향상시키는 데 도움이 되는 중요한 기능입니다. 따라서 이 게시물에서는 인메모리 복제본이 무엇이며 왜 중요한지 설명한 다음, AI용 벡터 데이터베이스인 Milvus에서 이 새로운 기능을 활성화하는 방법을 소개합니다.</p>
<p><strong>건너뛰기:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">인메모리 복제본과 관련된 개념</a></p></li>
<li><p><a href="#What-is-in-memory-replica">인메모리 복제란 무엇인가요?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">인메모리 복제본이 중요한 이유는 무엇인가요?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Milvus 벡터 데이터베이스에서 인메모리 복제본 활성화하기</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">인메모리 복제본과 관련된 개념<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>인메모리 복제본이 무엇이며 왜 중요한지 알기 전에 먼저 복제본 그룹, 샤드 복제본, 스트리밍 복제본, 히스토리 복제본, 샤드 리더 등 몇 가지 관련 개념을 이해해야 합니다. 아래 이미지는 이러한 개념을 설명하는 그림입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>레플리카_개념</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">레플리카 그룹</h3><p>복제본 그룹은 기록 데이터 및 복제본 처리를 담당하는 여러 <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">쿼리 노드로</a> 구성됩니다.</p>
<h3 id="Shard-replica" class="common-anchor-header">샤드 복제본</h3><p>샤드 복제본은 스트리밍 복제본과 기록 복제본으로 구성되며, 둘 다 동일한 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">샤드</a> (즉, DML 채널)에 속합니다. 여러 개의 샤드 복제본이 하나의 복제본 그룹을 구성합니다. 그리고 복제본 그룹의 정확한 샤드 복제본 수는 지정된 컬렉션의 샤드 수에 따라 결정됩니다.</p>
<h3 id="Streaming-replica" class="common-anchor-header">스트리밍 복제본</h3><p>스트리밍 복제본에는 동일한 DML 채널에서 <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">성장하는</a> 모든 <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">세그먼트가</a> 포함됩니다. 기술적으로 스트리밍 복제본은 하나의 복제본에서 하나의 쿼리 노드만 제공해야 합니다.</p>
<h3 id="Historical-replica" class="common-anchor-header">기록 복제본</h3><p>기록 복제본에는 동일한 DML 채널의 모든 봉인된 세그먼트가 포함됩니다. 하나의 기록 복제본의 봉인된 세그먼트는 동일한 복제본 그룹 내의 여러 쿼리 노드에 분산될 수 있습니다.</p>
<h3 id="Shard-leader" class="common-anchor-header">샤드 리더</h3><p>샤드 리더는 샤드 복제본에서 스트리밍 복제본을 제공하는 쿼리 노드입니다.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">인메모리 복제본이란 무엇인가요?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>인메모리 복제본을 활성화하면 여러 쿼리 노드에서 컬렉션의 데이터를 로드할 수 있으므로 추가 CPU 및 메모리 리소스를 활용할 수 있습니다. 이 기능은 데이터 세트가 비교적 작지만 읽기 처리량을 늘리고 하드웨어 리소스의 활용도를 높이고자 하는 경우에 매우 유용합니다.</p>
<p>현재 Milvus 벡터 데이터베이스는 각 세그먼트에 대해 하나의 복제본을 메모리에 보관합니다. 그러나 인메모리 복제본을 사용하면 서로 다른 쿼리 노드에 세그먼트의 복제본을 여러 개 가질 수 있습니다. 즉, 한 쿼리 노드가 세그먼트에 대한 검색을 수행하는 경우, 이 쿼리 노드가 정확히 동일한 세그먼트의 복제본을 가지고 있기 때문에 들어오는 새 검색 요청을 다른 유휴 쿼리 노드에 할당할 수 있습니다.</p>
<p>또한 인메모리 복제본이 여러 개 있으면 쿼리 노드가 충돌하는 상황에 더 잘 대처할 수 있습니다. 이전에는 다른 쿼리 노드에서 검색을 계속하기 위해 세그먼트가 다시 로드될 때까지 기다려야 했습니다. 하지만 인메모리 복제를 사용하면 데이터를 다시 로드할 필요 없이 검색 요청을 즉시 새 쿼리 노드로 재전송할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>복제</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">인메모리 복제본이 중요한 이유는 무엇인가요?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>인메모리 복제본을 활성화하면 얻을 수 있는 가장 중요한 이점 중 하나는 전체 QPS(초당 쿼리 수)와 처리량이 증가한다는 것입니다. 또한, 여러 세그먼트 복제본을 유지 관리할 수 있으며 장애 조치 시에도 시스템의 복원력이 향상됩니다.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스에서 인메모리 복제본 활성화<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스에서 인메모리 복제본의 새로운 기능을 활성화하는 것은 매우 쉽습니다. 컬렉션을 로드할 때 원하는 복제본 수를 지정하기만 하면 됩니다(예: <code translate="no">collection.load()</code> 호출 ).</p>
<p>다음 예제 튜토리얼에서는 이미 "book"이라는 이름의 <a href="https://milvus.io/docs/v2.1.x/create_collection.md">컬렉션을 만들고</a> 여기에 <a href="https://milvus.io/docs/v2.1.x/insert_data.md">데이터를 삽입했다고</a> 가정합니다. 그런 다음 다음 명령을 실행하여 책 컬렉션을 <a href="https://milvus.io/docs/v2.1.x/load_collection.md">로드할</a> 때 두 개의 복제본을 만들 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>위 예제 코드의 복제본 수는 애플리케이션 시나리오에 가장 적합하도록 유연하게 수정할 수 있습니다. 그러면 추가 명령을 실행하지 않고도 여러 복제본에 대해 벡터 유사도 <a href="https://milvus.io/docs/v2.1.x/search.md">검색</a> 또는 <a href="https://milvus.io/docs/v2.1.x/query.md">쿼리를</a> 직접 수행할 수 있습니다. 그러나 허용되는 최대 복제본 수는 쿼리 노드를 실행하는 데 사용할 수 있는 총 메모리 양에 의해 제한된다는 점에 유의해야 합니다. 지정한 복제본 수가 사용 가능한 메모리 제한을 초과하면 데이터 로드 중에 오류가 반환됩니다.</p>
<p><code translate="no">collection.get_replicas()</code> 을 실행하여 생성한 인메모리 복제본의 정보를 확인할 수도 있습니다. 복제본 그룹과 해당 쿼리 노드 및 샤드에 대한 정보가 반환됩니다. 다음은 출력 예시입니다.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">다음 단계<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1의 공식 출시와 함께 새로운 기능을 소개하는 블로그 시리즈를 준비했습니다. 이 블로그 시리즈에서 자세히 읽어보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">문자열 데이터를 사용해 유사도 검색 애플리케이션을 강화하는 방법</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">임베디드 Milvus를 사용하여 Python으로 Milvus 즉시 설치 및 실행하기</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 늘리기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기(2부)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a></li>
</ul>
