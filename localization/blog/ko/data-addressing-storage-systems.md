---
id: data-addressing-storage-systems.md
title: '스토리지 시스템의 데이터 주소 지정에 대한 심층 분석: HashMap에서 HDFS, Kafka, Milvus, Iceberg까지'
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  해시맵에서 HDFS, 카프카, 밀버스, 아이스버그에 이르기까지 데이터 주소 지정이 어떻게 작동하는지, 그리고 컴퓨팅 위치가 모든 규모에서
  검색을 능가하는 이유를 추적해 보세요.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>백엔드 시스템이나 분산 스토리지에서 작업하는 경우, 네트워크가 포화 상태도 아니고 시스템 과부하도 없는데도 간단한 조회로 수천 개의 디스크 I/O 또는 개체 스토리지 API 호출이 트리거되고 쿼리에 여전히 몇 초가 걸리는 경우를 경험한 적이 있을 것입니다.</p>
<p>병목 현상의 원인은 대역폭이나 컴퓨팅이 아닌 경우가 거의 없습니다. 그것은 바로 <em>주소 지정</em>, 즉 시스템이 데이터를 읽기 전에 데이터의 위치를 파악하는 작업입니다. <strong>데이터 주소</strong> 지정은 논리적 식별자(키, 파일 경로, 오프셋, 쿼리 술어)를 스토리지에 있는 데이터의 물리적 위치로 변환하는 프로세스입니다. 규모에 따라 실제 데이터 전송이 아닌 이 프로세스가 지연 시간을 결정합니다.</p>
<p>스토리지 성능은 간단한 모델로 줄일 수 있습니다:</p>
<blockquote>
<p><strong>총 주소 지정 비용 = 메타데이터 액세스 + 데이터 액세스</strong></p>
</blockquote>
<p>해시 테이블부터 레이크하우스 메타데이터 레이어에 이르기까지 거의 모든 스토리지 최적화는 이 방정식을 목표로 합니다. 기술은 다양하지만 목표는 항상 동일합니다. 지연 시간이 긴 작업을 최대한 줄이면서 데이터를 찾는 것입니다.</p>
<p>이 글에서는 HashMap과 같은 인메모리 데이터 구조부터 HDFS와 Apache Kafka 같은 분산 시스템, 그리고 마지막으로 객체 스토리지에서 작동하는 <a href="https://milvus.io/">Milvus</a> ( <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스</a>)와 Apache Iceberg 같은 최신 엔진에 이르기까지 규모가 커지는 시스템 전반에 걸쳐 이러한 아이디어를 추적합니다. 각기 다른 차이점에도 불구하고 모두 동일한 방정식을 최적화합니다.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">세 가지 핵심 주소 지정 기법<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>스토리지 시스템과 분산 엔진 전반에서 대부분의 주소 지정 최적화는 세 가지 기술로 분류됩니다:</p>
<ul>
<li><strong>계산</strong> - 데이터의 위치를 찾기 위해 구조를 스캔하거나 탐색하는 대신 공식에서 직접 데이터의 위치를 도출합니다.</li>
<li><strong>캐싱</strong> - 자주 액세스하는 메타데이터나 인덱스를 메모리에 보관하여 디스크나 원격 저장소에서 지연 시간이 긴 읽기가 반복되지 않도록 합니다.</li>
<li><strong>가지치기</strong> - 범위 정보 또는 파티션 경계를 사용하여 결과를 포함할 수 없는 파일, 샤드 또는 노드를 제외합니다.</li>
</ul>
<p>이 글에서 <em>액세스는</em> 디스크 읽기, 네트워크 호출 또는 개체 스토리지 API 요청 등 실제 시스템 수준의 비용이 발생하는 모든 작업을 의미합니다. 나노초 수준의 CPU 계산은 포함되지 않습니다. 중요한 것은 I/O 작업의 수를 줄이거나 값비싼 랜덤 I/O를 저렴한 순차 읽기로 전환하는 것입니다.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">주소 지정의 작동 원리: 두 합의 문제<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>주소 지정을 구체적으로 이해하려면 고전적인 알고리즘 문제를 생각해 보세요. 정수의 배열 <code translate="no">nums</code> 과 목표 값 <code translate="no">target</code> 이 주어지면 <code translate="no">target</code> 으로 합산되는 두 숫자의 인덱스를 반환합니다.</p>
<p>예를 들어 <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → 결과 <code translate="no">[0, 1]</code>.</p>
<p>이 문제는 데이터 검색과 데이터의 위치를 계산하는 것의 차이점을 명확하게 보여줍니다.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">해결 방법 1: 무차별 대입 검색</h3><p>무차별 대입 방식은 모든 쌍을 확인합니다. 각 요소에 대해 배열의 나머지 부분을 스캔하여 일치하는 항목을 찾습니다. 간단하지만 O(n²)의 시간이 소요됩니다.</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>답이 어디에 있을지에 대한 개념이 없습니다. 각 조회는 처음부터 시작하여 배열을 무작위로 탐색합니다. 병목 현상은 산술이 아니라 반복되는 스캔입니다.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">해결 방법 2: 연산을 통한 직접 주소 지정</h3><p>최적화된 솔루션은 스캐닝을 해시맵으로 대체합니다. 일치하는 값을 검색하는 대신 필요한 값을 계산하여 직접 조회합니다. 시간 복잡성이 O(n)으로 떨어집니다.</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>배열을 스캔하여 일치하는 값을 찾는 대신 필요한 값을 계산하고 그 위치로 바로 이동합니다. 위치를 도출할 수 있게 되면 탐색이 사라집니다.</p>
<p>이는 스캔을 계산으로, 간접 검색 경로를 직접 주소 지정으로 대체하는 것으로, 앞으로 살펴볼 모든 고성능 스토리지 시스템의 근간이 되는 동일한 개념입니다.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">해시맵: 계산된 주소가 스캔을 대체하는 방법<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>해시맵은 키-값 쌍을 저장하고 항목을 검색하는 것이 아니라 키에서 주소를 계산하여 값을 찾습니다. 키가 주어지면 해시 함수를 적용하고 배열 인덱스를 계산한 다음 해당 위치로 바로 이동합니다. 스캔할 필요가 없습니다.</p>
<p>이것은 이 글의 모든 시스템을 구동하는 가장 단순한 형태의 원리로, 계산을 통해 위치를 도출하여 스캔을 피하는 것입니다. 분산 메타데이터 조회부터 <a href="https://zilliz.com/learn/vector-index">벡터 인덱스에</a> 이르기까지 모든 것을 뒷받침하는 동일한 아이디어가 모든 규모에서 나타납니다.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">핵심 데이터 구조</h3><p>해시맵의 핵심은 배열이라는 단일 구조를 중심으로 구축됩니다. 해시 함수는 키를 배열 인덱스에 매핑합니다. 키 공간이 배열보다 훨씬 크기 때문에 충돌이 불가피하며, 서로 다른 키가 동일한 인덱스에 해시될 수 있습니다. 이러한 충돌은 링크된 목록 또는 레드-블랙 트리를 사용하여 각 슬롯 내에서 로컬로 처리됩니다.</p>
<p>배열은 인덱스별로 상시 액세스를 제공합니다. 이 속성, 즉 직접적이고 예측 가능한 주소 지정은 해시맵 성능의 근간이며 대규모 스토리지 시스템에서 효율적인 데이터 액세스의 근간이 되는 동일한 원리입니다.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">해시맵은 데이터를 어떻게 찾나요?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>단계별 해시맵 주소 지정: 키 해시, 배열 인덱스 계산, 버킷으로 바로 이동, 로컬로 해결 - 순회 없이 O(1) 조회를 달성합니다.</span> </span></p>
<p><code translate="no">put(&quot;apple&quot;, 100)</code> 을 예로 들어보겠습니다. 전체 조회는 전체 테이블 스캔 없이 4단계로 이루어집니다:</p>
<ol>
<li><strong>키를 해시합니다:</strong> 해시 함수에 키 전달 → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>배열 인덱스에 매핑합니다:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → 예., <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>버킷으로 이동합니다:</strong> <code translate="no">table[10]</code> 에 직접 액세스 - 순회가 아닌 단일 메모리 액세스</li>
<li><strong>로컬에서 해결합니다:</strong> 충돌이 없으면 즉시 읽거나 씁니다. 충돌이 있는 경우, 해당 버킷 내의 작은 링크된 목록이나 빨간색-검은색 트리를 확인합니다.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">해시맵 조회가 O(1)인 이유는 무엇인가요?</h3><p>배열 액세스가 O(1)인 이유는 간단한 주소 지정 공식 때문입니다:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>인덱스가 주어지면 메모리 주소는 한 번 곱하고 한 번 더하는 방식으로 계산됩니다. 비용은 배열 크기에 관계없이 고정되어 있으며, 한 번의 계산, 한 번의 메모리 읽기로 계산됩니다. 반면에 링크된 리스트는 별도의 메모리 위치를 통해 포인터를 따라 노드 하나하나를 탐색해야 합니다: 최악의 경우 O(n)입니다.</p>
<p>해시맵은 키를 배열 인덱스로 해시하여 순회해야 할 것을 계산된 주소로 변환합니다. 데이터를 검색하는 대신 데이터가 있는 위치를 정확히 계산하고 그곳으로 이동합니다.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">분산 시스템에서 주소 지정은 어떻게 달라지나요?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>해시맵은 데이터가 메모리에 있고 액세스 비용이 크지 않은 단일 시스템 내에서 주소 지정을 해결합니다. 규모가 커지면 제약 조건이 크게 달라집니다:</p>
<table>
<thead>
<tr><th>스케일 팩터</th><th>영향력</th></tr>
</thead>
<tbody>
<tr><td>데이터 크기</td><td>클러스터 전체에서 메가바이트 → 테라바이트 또는 페타바이트</td></tr>
<tr><td>저장 매체</td><td>메모리 → 디스크 → 네트워크 → 오브젝트 스토리지</td></tr>
<tr><td>액세스 지연 시간</td><td>메모리: 메모리: ~100ns / 디스크: 10~20ms / 동일 DC 네트워크: ~0.5ms / 지역 간: ~150ms</td></tr>
</tbody>
</table>
<p>주소 지정 문제는 변하지 않으며 단지 비용이 더 많이 들 뿐입니다. 모든 조회에는 네트워크 홉과 디스크 I/O가 포함될 수 있으므로 액세스 횟수를 줄이는 것이 메모리보다 훨씬 더 중요합니다.</p>
<p>실제 시스템에서 이 문제를 어떻게 처리하는지 알아보기 위해 두 가지 대표적인 예를 살펴보겠습니다. HDFS는 대용량 블록 기반 파일에 계산 기반 주소 지정을 적용합니다. Kafka는 추가 전용 메시지 스트림에 이를 적용합니다. 두 가지 모두 데이터를 검색하는 대신 데이터가 어디에 있는지 계산한다는 동일한 원리를 따릅니다.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: 인메모리 메타데이터로 대용량 파일 처리하기<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS는 여러 컴퓨터 클러스터에 걸쳐 매우 큰 파일을 위해 설계된 <a href="https://milvus.io/docs/architecture_overview.md">분산형 스토리지</a> 시스템입니다. 파일 경로와 바이트 오프셋이 주어지면 올바른 데이터 블록과 이를 저장하는 데이터 노드를 찾아야 합니다.</p>
<p>HDFS는 모든 파일 시스템 메타데이터를 메모리에 보관하는 신중한 설계 선택으로 이 문제를 해결합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>물리적 스토리지에 매핑된 300MB 파일을 복제를 통해 DataNode에 분산된 3개의 블록으로 논리적으로 보여주는 HDFS 데이터 구성</span> </span>.</p>
<p>중앙에는 네임노드가 있습니다. 디렉토리 구조, 파일 간 매핑, 블록-데이터노드 간 매핑 등 전체 파일 시스템 트리를 메모리에 로드합니다. 메타데이터는 읽는 동안 디스크에 닿지 않기 때문에, HDFS는 인메모리 조회를 통해서만 모든 주소 지정 문제를 해결합니다.</p>
<p>개념적으로 이것은 클러스터 규모의 해시맵으로, 인메모리 데이터 구조를 사용해 느린 검색을 빠른 계산된 조회로 전환합니다. HDFS는 수천 대의 컴퓨터에 분산된 데이터 세트에 동일한 원리를 적용한다는 점에서 차이가 있습니다.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">HDFS는 데이터를 어떻게 찾나요?</h3><p>기본 블록 크기가 128MB인 <code translate="no">/user/data/bigfile.txt</code> 의 200MB 오프셋에서 데이터를 읽는다고 가정해 보겠습니다:</p>
<ol>
<li>클라이언트가 단일 RPC를 NameNode로 전송합니다.</li>
<li>NameNode는 파일 경로를 확인하고 오프셋 200MB가 두 번째 블록(128-256MB 범위)에 속하는 것을 계산합니다(전적으로 메모리에서).</li>
<li>NameNode는 해당 블록을 저장하는 데이터 노드(예: DN2 및 DN3)를 반환합니다.</li>
<li>클라이언트는 가장 가까운 데이터노드(DN2)에서 직접 읽습니다.</li>
</ol>
<p>총 비용: RPC 1개, 인메모리 조회 몇 번, 데이터 읽기 한 번. 이 과정에서 메타데이터는 절대로 디스크에 저장되지 않으며, 각 조회는 상시적으로 이루어집니다. HDFS는 대규모 클러스터에서 데이터가 확장되는 경우에도 비용이 많이 드는 메타데이터 스캔을 피할 수 있습니다.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: 스파스 인덱싱으로 무작위 I/O를 방지하는 방법<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka는 처리량이 많은 메시지 스트림을 위해 설계되었습니다. 메시지 오프셋이 주어지면, 읽기를 무작위 I/O로 전환하지 않고 디스크에서 정확한 바이트 위치를 찾아야 합니다.</p>
<p>Kafka는 순차적 스토리지와 희소 인메모리 인덱스를 결합합니다. 데이터를 검색하는 대신 대략적인 위치를 계산하고 작은 범위의 스캔을 수행합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>토픽과 파티션이 .log, .index, .timeindex 세그먼트 파일을 포함하는 파티션 디렉터리로 물리적 스토리지에 매핑된 논리적 보기를 보여주는 Kafka 데이터 구성</span> </span>.</p>
<p>메시지는 토픽 → 파티션 → 세그먼트로 구성됩니다. 각 파티션은 세그먼트로 분할된 추가 전용 로그이며, 각 세그먼트는 다음과 같이 구성됩니다:</p>
<ul>
<li>메시지를 디스크에 순차적으로 저장하는 <code translate="no">.log</code> 파일</li>
<li>로그의 스파스 인덱스 역할을 하는 <code translate="no">.index</code> 파일</li>
</ul>
<p><code translate="no">.index</code> 파일은 메모리 매핑(mmap)되어 있으므로 디스크 I/O 없이 메모리에서 직접 인덱스 조회가 제공됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>4KB의 데이터당 하나의 인덱스 항목을 보여주는 Kafka 스파스 인덱스 설계, 메모리 비교: 800MB의 고밀도 인덱스와 메모리에 2MB만 상주하는 스파스 인덱스 비교</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">카프카는 데이터를 어떻게 찾나요?</h3><p>소비자가 오프셋 500,000에서 메시지를 읽는다고 가정해 보겠습니다. Kafka는 이 문제를 세 단계로 해결합니다:</p>
<p><strong>1. 세그먼트 찾기</strong> (트리맵 조회)</p>
<ul>
<li>세그먼트 기본 오프셋: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>대상 파일: <code translate="no">00000000000000367834.log</code></li>
<li>시간 복잡도: O(log S), 여기서 S는 세그먼트 수(일반적으로 100 미만)입니다.</li>
</ul>
<p><strong>2. 스파스 인덱스</strong> (.index)<strong>에서 위치를 조회합니다</strong>.</p>
<ul>
<li>상대적 오프셋: <code translate="no">500000 − 367834 = 132166</code></li>
<li><code translate="no">.index</code> 에서 이진 검색: 가장 큰 항목 ≤ 132166 찾기 → <code translate="no">[132100 → position 20500000]</code></li>
<li>시간 복잡도: O(log N), 여기서 N은 인덱스 항목 수입니다.</li>
</ul>
<p><strong>3. 로그</strong> (.log)<strong>에서 순차적 읽기</strong> </p>
<ul>
<li>위치 20,500,000부터 읽기 시작</li>
<li>오프셋 500,000에 도달할 때까지 계속합니다.</li>
<li>최대 하나의 인덱스 간격(~4KB)이 스캔됩니다.</li>
</ul>
<p>합계: 인메모리 세그먼트 조회 1회, 인덱스 조회 1회, 짧은 순차 읽기 1회. 임의 디스크 액세스 없음.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS와 아파치 카프카 비교<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>차원</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>설계 목표</td><td>대용량 파일의 효율적인 저장 및 읽기</td><td>메시지 스트림의 높은 처리량 순차 읽기/쓰기</td></tr>
<tr><td>주소 지정 모델</td><td>인메모리 해시맵을 통한 경로 → 블록 → 데이터노드</td><td>스파스 인덱스 + 순차 스캔을 통한 오프셋 → 세그먼트 → 위치</td></tr>
<tr><td>메타데이터 저장</td><td>NameNode 메모리에 중앙 집중식</td><td>로컬 파일, mmap을 통해 메모리 매핑</td></tr>
<tr><td>조회당 액세스 비용</td><td>1 RPC + N 블록 읽기</td><td>인덱스 조회 1회 + 데이터 읽기 1회</td></tr>
<tr><td>키 최적화</td><td>모든 메타데이터가 메모리에 있음 - 조회 경로에 디스크 없음</td><td>스파스 인덱싱 + 순차적 레이아웃으로 무작위 I/O 방지</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">객체 스토리지가 주소 지정 문제를 바꾸는 이유<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>해시맵에서 HDFS, 카프카에 이르기까지, 우리는 메모리와 기존 분산 스토리지에서 어드레싱을 보아왔습니다. 워크로드가 발전함에 따라 요구사항도 계속 증가하고 있습니다:</p>
<ul>
<li><strong>더 풍부한 쿼리.</strong> 최신 시스템은 단순한 키와 오프셋뿐만 아니라 다중 필드 필터, <a href="https://zilliz.com/glossary/similarity-search">유사성 검색</a>, 복잡한 술어까지 처리합니다.</li>
<li><strong>기본으로 사용되는 객체 스토리지.</strong> 점점 더 많은 데이터가 S3 호환 저장소에 보관되고 있습니다. 파일은 버킷에 분산되어 있으며, 각 액세스는 수십 밀리초 정도의 고정 지연 시간(몇 킬로바이트의 경우에도)을 갖는 API 호출로 이루어집니다.</li>
</ul>
<p>이 시점에서는 대역폭이 아닌 지연 시간이 병목 현상입니다. 단일 S3 GET 요청은 반환되는 데이터의 양에 관계없이 50밀리초 정도 소요됩니다. 쿼리가 이러한 요청을 수천 번 트리거하면 총 지연 시간이 급증합니다. API 팬아웃을 최소화하는 것이 설계의 핵심 제약 조건이 됩니다.</p>
<p><a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스인</a> <a href="https://milvus.io/">Milvus와</a> 레이크하우스 테이블 형식인 Apache Iceberg라는 두 가지 최신 시스템을 살펴보고 이러한 문제를 어떻게 해결하는지 알아보겠습니다. 두 시스템은 차이점에도 불구하고 지연 시간이 긴 액세스를 최소화하고, 팬아웃을 조기에 줄이며, 탐색보다 계산을 선호한다는 동일한 핵심 아이디어를 적용합니다.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: 필드 레벨 스토리지가 너무 많은 파일을 생성할 때<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩에</a> 대한 <a href="https://zilliz.com/glossary/similarity-search">유사성 검색을</a> 위해 설계된 널리 사용되는 벡터 데이터베이스입니다. 초기 저장소 설계는 객체 저장소를 기반으로 구축하는 일반적인 첫 번째 접근 방식인 각 필드를 개별적으로 저장하는 방식을 반영합니다.</p>
<p>V1에서는 <a href="https://milvus.io/docs/manage-collections.md">컬렉션의</a> 각 필드가 <a href="https://milvus.io/docs/glossary.md">세그먼트에</a> 걸쳐 별도의 빈로그 파일에 저장됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V1 스토리지 레이아웃은 컬렉션이 세그먼트로 분할되어 있고, 각 세그먼트는 id, 벡터, 스칼라 데이터와 같은 필드를 별도의 binlog 파일에 저장하며, 파일 통계를 위한 별도의 stats_log 파일을 저장하는 것을 보여줍니다</span> </span>.</p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Milvus V1은 데이터를 어떻게 찾나요?</h3><p>간단한 쿼리를 예로 들어보겠습니다: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>메타데이터 조회</strong> - 세그먼트 목록에 대해 etcd/MySQL 쿼리 →. <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>세그먼트 전체에서 ID 필드 읽기</strong> - 각 세그먼트에 대해 ID 빈로그 파일을 읽습니다.</li>
<li><strong>대상 행</strong> 찾기 - 로드된 ID 데이터를 스캔하여 찾기 <code translate="no">id = 123</code></li>
<li><strong>벡터 필드 읽기</strong> - 일치하는 세그먼트의 해당 벡터 빈로그 파일을 읽습니다.</li>
</ol>
<p>총 파일 액세스 횟수: <strong>N × (F₁ + F₂ + ...)</strong> 여기서 N = 세그먼트 수, F = 필드당 binlog 파일 수입니다.</p>
<p>수학은 금방 지저분해집니다. 100개의 필드, 1,000개의 세그먼트, 필드당 5개의 binlog 파일이 있는 컬렉션의 경우:</p>
<blockquote>
<p><strong>1,000 × 100 × 5 = 500,000개의 파일</strong></p>
</blockquote>
<p>쿼리가 3개의 필드만 건드린다고 해도 15,000개의 개체 스토리지 API 호출에 해당합니다. S3 요청당 <strong>50밀리초의</strong> 직렬화된 지연 시간은 <strong>750초에</strong> 달하며, 단일 쿼리의 경우 12분이 넘습니다.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: 세그먼트 수준 쪽모이 세공으로 API 호출을 10배까지 줄인 방법<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus V2는 V1의 확장성 한계를 해결하기 위해 필드 단위가 아닌 <a href="https://milvus.io/docs/glossary.md">세그먼트</a> 단위로 데이터를 구성하는 근본적인 변화를 시도했습니다. V2는 수많은 작은 빈로그 파일 대신 데이터를 세그먼트 기반의 Parquet 파일로 통합합니다.</p>
<p>파일 수는 <code translate="no">N × fields × binlogs</code> 에서 약 <code translate="no">N</code> (세그먼트당 하나의 파일 그룹)으로 줄어듭니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>아이디, 벡터, 타임스탬프에 대한 열 청크가 포함된 행 그룹과 스키마 및 열 통계가 포함된 바닥글이 있는 Parquet 파일로 저장된 세그먼트를 보여주는 Milvus V2 스토리지 레이아웃</span> </span></p>
<p>하지만 V2는 모든 필드를 단일 파일에 저장하지 않습니다. 필드를 크기별로 그룹화합니다:</p>
<ul>
<li><strong>작은 <a href="https://milvus.io/docs/scalar_index.md">스칼라 필드</a></strong> (예: id, 타임스탬프)는 함께 저장됩니다.</li>
<li><strong>큰 필드</strong> (예: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">고밀도 벡터</a>)는 전용 파일로 분리됩니다.</li>
</ul>
<p>모든 파일은 동일한 세그먼트에 속하며, 행은 파일 전체에 걸쳐 인덱스별로 정렬됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>열 청크와 압축된 데이터 페이지가 있는 행 그룹과 파일 메타데이터, 행 그룹 메타데이터, 최소/최대 값과 같은 열 통계가 포함된 바닥글을 보여주는 마루 파일 구조입니다</span> </span>.</p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Milvus V2는 데이터를 어떻게 찾나요?</h3><p>동일한 쿼리의 경우 - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>메타데이터 조회</strong> - 세그먼트 목록 가져오기 → → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>마루</strong> 바닥글<strong>읽기</strong> - 행 그룹 통계 추출. 행 그룹별 ID 열의 최소/최대값을 확인합니다. <code translate="no">id = 123</code> 은 행 그룹 0(최소=1, 최대=1000)에 해당합니다.</li>
<li><strong>필요한 것만 읽기</strong> - Parquet의 열 가지치기는 작은 필드 파일에서는 ID 열만, 큰 필드 파일에서는 <a href="https://milvus.io/docs/index-vector-fields.md">벡터</a> 열만 읽습니다. 일치하는 행 그룹만 액세스됩니다.</li>
</ol>
<p>큰 필드를 분할하면 두 가지 주요 이점이 있습니다:</p>
<ul>
<li><strong>더 효율적인 읽기.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩은</a> 스토리지 크기를 지배합니다. 작은 필드와 혼합하면 행 그룹에 들어갈 수 있는 행 수가 제한되어 파일 액세스가 증가합니다. 작은 필드 행 그룹을 분리하면 큰 필드는 크기에 최적화된 레이아웃을 사용하면서 훨씬 더 많은 행을 저장할 수 있습니다.</li>
<li><strong>유연한 <a href="https://milvus.io/docs/schema.md">스키마</a> 진화.</strong> 열을 추가하면 새 파일이 만들어집니다. 열을 제거하면 읽기 시 건너뛸 수 있습니다. 기록 데이터를 다시 쓸 필요가 없습니다.</li>
</ul>
<p>그 결과, 파일 수는 10배 이상, API 호출은 10배 이상 감소하고 쿼리 대기 시간은 몇 분에서 몇 초로 단축됩니다.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1과 V2 비교<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>측면</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>파일 정리</td><td>필드별로 분할</td><td>세그먼트별로 통합</td></tr>
<tr><td>컬렉션당 파일 수</td><td>N × 필드 × 빈로그</td><td>~N × 컬럼 그룹</td></tr>
<tr><td>저장 형식</td><td>사용자 지정 빈로그</td><td>쪽모이 세공(랜스 및 보텍스도 지원)</td></tr>
<tr><td>열 가지치기</td><td>자연(필드 수준 파일)</td><td>쪽모이 세공 기둥 가지치기</td></tr>
<tr><td>통계</td><td>별도의 stats_log 파일</td><td>Parquet 바닥글에 포함</td></tr>
<tr><td>쿼리당 S3 API 호출 수</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>쿼리 지연 시간</td><td>분</td><td>초</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">아파치 빙산: 메타데이터 기반 파일 프루닝<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg는 레이크하우스 시스템에서 방대한 데이터 세트에 대한 분석 테이블을 관리합니다. 테이블이 수천 개의 데이터 파일에 걸쳐 있는 경우, 모든 파일을 검사하지 않고 관련 파일로만 쿼리 범위를 좁히는 것이 문제입니다.</p>
<p>Iceberg의 해답은 계층화된 메타데이터를 사용해 데이터 I/O가 발생하기 <em>전에</em> 어떤 파일을 읽을지 결정하는 것입니다. 이는 벡터 데이터베이스에서 <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">메타데이터 필터링의</a> 원리와 동일합니다. 미리 계산된 통계를 사용해 관련 없는 데이터를 건너뛰는 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>metadata.json, 매니페스트 목록, 매니페스트 파일이 있는 메타데이터 디렉터리와 날짜별로 파티션된 Parquet 파일이 있는 데이터 디렉터리를 함께 보여주는 Iceberg 데이터 조직</span> </span></p>
<p>Iceberg는 계층화된 메타데이터 구조를 사용합니다. 각 계층은 다음 계층을 참조하기 전에 관련 없는 데이터를 걸러내는데, 이는 <a href="https://milvus.io/docs/architecture_overview.md">분산 데이터베이스가</a> 효율적인 액세스를 위해 메타데이터와 데이터를 분리하는 것과 비슷한 원리로 작동합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Iceberg의 4계층 구조: metadata.json은 파일 수준 통계가 포함된 매니페스트 파일을 참조하는 매니페스트 목록을 가리키며, 이 목록은 실제 Parquet 데이터 파일을 가리킵니다.</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Iceberg는 데이터를 어떻게 찾나요?</h3><p>고려하세요: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>메타데이터.json 읽기</strong> (1 I/O) - 현재 스냅샷과 해당 매니페스트 목록을 로드합니다.</li>
<li><strong>매니페스트 목록 읽기</strong> (1 I/O) - <a href="https://milvus.io/docs/use-partition-key.md">파티션 수준</a> 필터를 적용하여 전체 파티션 건너뛰기(예: 2023년 데이터 모두 제거)</li>
<li>적하목록<strong>파일 읽기</strong> (2 I/O) - 파일 수준 통계(최소/최대 날짜, 최소/최대 금액)를 사용하여 쿼리와 일치하지 않는 파일을 제거합니다.</li>
<li><strong>데이터 파일 읽기</strong> (3 I/O) - 3개의 파일만 남아서 실제로 읽습니다.</li>
</ol>
<p>Iceberg는 1,000개의 데이터 파일을 모두 스캔하는 대신, <strong>7번의 I/O 작업으로</strong> 조회를 완료하여 94% 이상의 불필요한 읽기를 방지합니다.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">다양한 시스템에서 데이터를 처리하는 방법<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>시스템</th><th>데이터 조직</th><th>핵심 주소 지정 메커니즘</th><th>액세스 비용</th></tr>
</thead>
<tbody>
<tr><td>해시맵</td><td>키 → 배열 슬롯</td><td>해시 함수 → 직접 인덱스</td><td>O(1) 메모리 액세스</td></tr>
<tr><td>HDFS</td><td>경로 → 블록 → 데이터노드</td><td>인메모리 해시맵 + 블록 계산</td><td>1 RPC + N 블록 읽기</td></tr>
<tr><td>Kafka</td><td>토픽 → 파티션 → 세그먼트</td><td>트리맵 + 스파스 인덱스 + 순차 스캔</td><td>인덱스 조회 1회 + 데이터 읽기 1회</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">수집</a> → 세그먼트 → 쪽모이 세공 컬럼</td><td>메타데이터 조회 + 컬럼 가지치기</td><td>N 읽기(N = 세그먼트)</td></tr>
<tr><td>빙산</td><td>테이블 → 스냅샷 → 매니페스트 → 데이터 파일</td><td>계층화된 메타데이터 + 통계적 가지치기</td><td>메타데이터 읽기 3회 + 데이터 읽기 M회</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">효율적인 데이터 주소 지정의 세 가지 원칙<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. 계산이 항상 검색보다 우선</h3><p>지금까지 살펴본 모든 시스템에서 가장 효과적인 최적화는 데이터를 검색하는 대신 데이터가 있는 위치를 계산한다는 동일한 규칙을 따릅니다.</p>
<ul>
<li>해시맵은 검색 대신 <code translate="no">hash(key)</code> 에서 배열 인덱스를 계산합니다.</li>
<li>HDFS는 파일 시스템 메타데이터를 탐색하는 대신 파일 오프셋에서 대상 블록을 계산합니다.</li>
<li>Kafka는 로그를 스캔하는 대신 관련 세그먼트와 인덱스 위치를 계산합니다.</li>
<li>Iceberg는 술어와 파일 수준 통계를 사용해 읽을 가치가 있는 파일을 계산합니다.</li>
</ul>
<p>계산은 고정 비용이 드는 산술 연산입니다. 검색은 비교, 포인터 추적 또는 I/O와 같은 탐색이며 데이터 크기에 따라 비용이 증가합니다. 시스템이 직접 위치를 도출할 수 있으면 검색이 불필요해집니다.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. 지연 시간이 긴 액세스 최소화</h3><p>다시 핵심 공식으로 돌아가 보겠습니다: <strong>총 주소 지정 비용 = 메타데이터 액세스 + 데이터 액세스.</strong> 모든 최적화는 궁극적으로 이러한 지연 시간이 긴 작업을 줄이는 것을 목표로 합니다.</p>
<table>
<thead>
<tr><th>패턴</th><th>예시</th></tr>
</thead>
<tbody>
<tr><td>파일 수를 줄여 API 팬아웃 제한</td><td>Milvus V2 세그먼트 통합</td></tr>
<tr><td>통계를 사용하여 데이터를 조기에 배제</td><td>빙산 매니페스트 가지치기</td></tr>
<tr><td>메모리에 메타데이터 캐시</td><td>HDFS 네임노드, Kafka mmap 인덱스</td></tr>
<tr><td>소규모 순차 스캔을 더 적은 수의 랜덤 읽기로 교환</td><td>카프카 스파스 인덱스</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. 통계를 통한 조기 의사 결정</h3><p>쓰기 시 최소/최대 값, 파티션 경계, 행 수와 같은 간단한 정보를 기록하면 시스템이 읽기 시점에 어떤 파일을 읽을 가치가 있고 어떤 파일을 완전히 건너뛸 수 있는지 결정할 수 있습니다.</p>
<p>이는 작은 투자로 큰 성과를 거둘 수 있습니다. 통계는 파일 액세스를 맹목적인 읽기에서 신중한 선택으로 바꿔줍니다. Iceberg의 매니페스트 수준 정리든 Milvus V2의 Parquet 바닥글 통계든, 쓰기 시 몇 바이트의 메타데이터로 읽기 시 수천 개의 I/O 작업을 없앨 수 있다는 원리는 동일합니다.</p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>투섬에서 해시맵으로, HDFS와 카프카에서 밀버스와 아파치 아이스버그에 이르기까지 한 가지 패턴이 계속 반복되고 있습니다. 바로 시스템이 데이터를 얼마나 효율적으로 찾는지에 따라 성능이 달라진다는 점입니다.</p>
<p>데이터가 증가하고 스토리지가 메모리에서 디스크로, 오브젝트 스토리지로 이동함에 따라 메커니즘은 변하지만 핵심 아이디어는 변하지 않습니다. 최고의 시스템은 검색 대신 위치를 계산하고, 메타데이터를 가깝게 유지하며, 통계를 사용해 중요하지 않은 데이터는 건드리지 않습니다. 지금까지 살펴본 모든 성능 향상 사례는 지연 시간이 긴 액세스를 줄이고 가능한 한 빨리 검색 공간을 좁히는 데서 비롯되었습니다.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-search">벡터 검색</a> 파이프라인을 설계하든, <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터에</a> 대한 시스템을 구축하든, 레이크하우스 쿼리 엔진을 최적화하든, 동일한 방정식이 적용됩니다. 시스템에서 데이터를 처리하는 방식을 이해하는 것이 데이터 처리 속도를 높이기 위한 첫 번째 단계입니다.</p>
<hr>
<p>Milvus를 사용 중이며 스토리지 또는 쿼리 성능을 최적화하고 싶으시다면 저희가 도와드리겠습니다:</p>
<ul>
<li><a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 참여하여 질문하고, 아키텍처를 공유하고, 비슷한 문제를 해결하고 있는 다른 엔지니어들로부터 배워보세요.</li>
<li>스토리지 레이아웃, 쿼리 튜닝, 프로덕션으로의 확장 등 사용 사례를 살펴볼 수 있는<a href="https://milvus.io/office-hours">20분짜리 무료 Milvus 오피스 아워 세션을 예약하세요</a>.</li>
<li>인프라 설정을 건너뛰고 싶으시다면 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)에서 무료 티어를 통해 시작할 수 있습니다.</li>
</ul>
<hr>
<p>엔지니어가 데이터 주소 지정 및 스토리지 설계에 대해 생각할 때 떠오르는 몇 가지 질문입니다:</p>
<p><strong>Q: Milvus가 필드 수준에서 세그먼트 수준 스토리지로 전환한 이유는 무엇인가요?</strong></p>
<p>Milvus V1에서는 각 필드가 세그먼트에 걸쳐 별도의 빈로그 파일에 저장되었습니다. 100개의 필드와 1,000개의 세그먼트가 있는 컬렉션의 경우, 이로 인해 수십만 개의 작은 파일이 생성되었으며, 각각 고유한 S3 API 호출이 필요했습니다. V2는 데이터를 세그먼트 기반 Parquet 파일로 통합하여 파일 수를 10배 이상 줄이고 쿼리 대기 시간을 몇 분에서 몇 초로 단축합니다. 핵심 인사이트: 오브젝트 스토리지에서는 총 데이터 볼륨보다 API 호출 횟수가 더 중요합니다.</p>
<p><strong>Q: Milvus는 어떻게 벡터 검색과 스칼라 필터링을 모두 효율적으로 처리하나요?</strong></p>
<p>Milvus V2는 <a href="https://milvus.io/docs/scalar_index.md">스칼라 필드와</a> <a href="https://milvus.io/docs/index-vector-fields.md">벡터 필드를</a> 동일한 세그먼트 내의 별도의 파일 그룹에 저장합니다. 스칼라 쿼리는 Parquet 열 가지치기와 행 그룹 통계를 사용해 관련 없는 데이터를 건너뜁니다. <a href="https://zilliz.com/learn/what-is-vector-search">벡터 검색은</a> 전용 <a href="https://zilliz.com/learn/vector-index">벡터 인덱스를</a> 사용합니다. 둘 다 동일한 세그먼트 구조를 공유하므로 스칼라 필터와 벡터 유사성을 결합한 <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">하이브리드 쿼리는</a> 중복 없이 동일한 데이터에 대해 작동할 수 있습니다.</p>
<p><strong>질문: "검색보다 계산" 원칙이 벡터 데이터베이스에도 적용되나요?</strong></p>
<p>예. HNSW 및 IVF와 같은 <a href="https://zilliz.com/learn/vector-index">벡터 인덱스는</a> 동일한 원리를 기반으로 구축되었습니다. 쿼리 벡터를 저장된 모든 벡터와 비교하는 대신(무차별 대입 검색), 그래프 구조나 클러스터 중심을 사용해 대략적인 이웃을 계산하고 벡터 공간의 관련 영역으로 바로 이동합니다. 거리 계산이 훨씬 적은 대신 정확도가 약간 떨어지는 단점이 있지만, 이는 고차원 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩</a> 데이터에 적용되는 '검색을 통한 계산' 패턴과 동일합니다.</p>
<p><strong>Q: 팀이 오브젝트 스토리지에서 저지르는 가장 큰 성능 실수는 무엇인가요?</strong></p>
<p>작은 파일을 너무 많이 생성하는 것입니다. 각 S3 GET 요청에는 반환되는 데이터의 양에 관계없이 고정된 지연 시간 상한(~50ms)이 있습니다. 10,000개의 작은 파일을 읽는 시스템에서는 총 데이터 양이 많지 않더라도 500초의 지연 시간이 발생합니다. 작은 파일을 큰 파일로 병합하고, 선택적 읽기를 위해 Parquet과 같은 열 형식을 사용하고, 파일을 완전히 건너뛸 수 있는 메타데이터를 유지하면 해결됩니다.</p>
