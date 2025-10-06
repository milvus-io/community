---
id: how-to-debug-slow-requests-in-milvus.md
title: Milvus에서 느린 검색 요청을 디버깅하는 방법
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  이 게시물에서는 Milvus에서 느린 요청을 분류하는 방법과 지연 시간을 예측 가능하고 안정적이며 일관되게 낮게 유지하기 위해 취할 수 있는
  실용적인 단계를 공유합니다.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Milvus의 핵심은 성능입니다. 정상적인 조건에서 Milvus 내의 검색 요청은 단 몇 밀리초 만에 완료됩니다. 하지만 클러스터의 속도가 느려져 검색 대기 시간이 몇 초로 늘어나면 어떻게 될까요?</p>
<p>느린 검색은 자주 발생하지는 않지만 대규모 또는 복잡한 워크로드에서 나타날 수 있습니다. 사용자 경험을 방해하고 애플리케이션 성능을 왜곡하며 설정에 숨겨진 비효율성을 드러내는 경우가 많기 때문입니다.</p>
<p>이 글에서는 Milvus에서 느린 요청을 분류하는 방법을 살펴보고 지연 시간을 예측 가능하고 안정적이며 일관되게 낮게 유지하기 위해 취할 수 있는 실용적인 단계를 공유하고자 합니다.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">느린 검색 식별하기<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>느린 요청을 진단하는 것은 <strong>얼마나 자주 발생하는가, 그리고 시간이 어디로 가고 있는가라는</strong> 두 가지 질문에서 시작됩니다. Milvus는 메트릭과 로그를 통해 이 두 가지 질문에 대한 답을 제공합니다.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvus 메트릭</h3><p>Milvus는 Grafana 대시보드에서 모니터링할 수 있는 상세한 메트릭을 내보냅니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>주요 패널은 다음과 같습니다:</p>
<ul>
<li><p><strong>서비스 품질 → 느린 쿼리</strong>: proxy.slowQuerySpanInSeconds(기본값: 5초)를 초과하는 모든 요청에 플래그를 지정합니다. Prometheus에도 표시됩니다.</p></li>
<li><p><strong>서비스 품질 → 검색 지연 시간</strong>: 전체 지연 시간 분포를 표시합니다. 정상으로 보이지만 최종 사용자가 여전히 지연을 경험하는 경우 네트워크 또는 애플리케이션 레이어와 같은 Milvus 외부에 문제가 있을 수 있습니다.</p></li>
<li><p><strong>쿼리 노드 → 단계별 검색 대기 시간</strong>: 대기 시간, 쿼리, 단축 단계로 지연 시간을 세분화합니다. 보다 심층적인 어트리뷰션을 위해 <em>Scalar</em> <em>필터 지연 시간</em>, <em>벡터 검색 지연 시간</em>, <em>Wait tSafe 지연 시간과</em> 같은 패널을 통해 어떤 단계가 지배적인지 확인할 수 있습니다.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvus 로그</h3><p>Milvus는 또한 1초 이상 지속되는 모든 요청을 [느린 검색]과 같은 마커로 태그하여 로그를 기록합니다. 이러한 로그는 <em>어떤</em> 쿼리가 느린지 보여주며, 메트릭의 <em>위치</em> 인사이트를 보완합니다. 경험상</p>
<ul>
<li><p>&lt;<strong> 30ms 미만</strong> → 대부분의 시나리오에서 정상적인 검색 지연 시간</p></li>
<li><p>&gt;<strong> 100ms 초과</strong> → 조사할 가치가 있음</p></li>
<li><p>&gt;<strong> 1초 초과</strong> → 확실히 느리며 주의가 필요함</p></li>
</ul>
<p>로그 예시:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>간단히 말해, <strong>메트릭은 시간이 어디로 가고 있는지 알려주며, 로그는 어떤 쿼리가 히트되었는지를 알려줍니다.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">근본 원인 분석<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">과중한 워크로드</h3><p>느린 요청의 일반적인 원인은 과도한 워크로드입니다. 요청의 <strong>NQ</strong> (요청당 쿼리 수)가 매우 큰 경우, 장시간 실행되어 쿼리 노드 리소스를 독점할 수 있습니다. 다른 요청이 그 뒤에 쌓여 대기열 대기 시간이 증가합니다. 각 요청의 NQ가 작더라도 Milvus가 내부적으로 동시 검색 요청을 병합할 수 있으므로 전체 처리량(QPS)이 매우 높으면 여전히 동일한 효과가 발생할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>주의해야 할 신호:</strong></p>
<ul>
<li><p>모든 쿼리가 예기치 않게 높은 지연 시간을 보입니다.</p></li>
<li><p>쿼리 노드 메트릭이 높은 <strong>대기열 내 지연 시간을</strong> 보고합니다.</p></li>
<li><p>로그에는 NQ가 크고 총 지속 시간이 긴 요청이 표시되지만 NQ당 지속 시간은 상대적으로 짧아 하나의 대형 요청이 리소스를 지배하고 있음을 나타냅니다.</p></li>
</ul>
<p><strong>해결 방법</strong></p>
<ul>
<li><p><strong>쿼리를 일괄 처리하세요</strong>: 단일 요청에 과부하가 걸리지 않도록 NQ를 적당히 유지하세요.</p></li>
<li><p><strong>쿼리 노드를 스케일아웃합니다</strong>: 워크로드에 높은 동시성이 정기적으로 발생하는 경우 쿼리 노드를 추가하여 부하를 분산하고 지연 시간을 낮게 유지하세요.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">비효율적인 필터링</h3><p>또 다른 일반적인 병목 현상은 비효율적인 필터에서 비롯됩니다. 필터 표현식이 제대로 수행되지 않거나 필드에 스칼라 인덱스가 부족한 경우, Milvus는 작은 대상 하위 집합을 스캔하는 대신 <strong>전체 스캔으로</strong> 돌아갈 수 있습니다. JSON 필터와 엄격한 일관성 설정은 오버헤드를 더욱 증가시킬 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>주의해야 할 신호:</strong></p>
<ul>
<li><p>쿼리 노드 메트릭의 높은 <strong>스칼라 필터 지연 시간</strong>.</p></li>
<li><p>필터가 적용될 때만 지연 시간이 눈에 띄게 급증합니다.</p></li>
<li><p>엄격한 일관성을 사용하도록 설정한 경우 <strong>지연 시간이</strong> 길어집니다.</p></li>
</ul>
<p><strong>해결 방법</strong></p>
<ul>
<li><strong>필터 표현식을 단순화합니다</strong>: 필터를 최적화하여 쿼리 계획의 복잡성을 줄입니다. 예를 들어, 긴 OR 체인을 IN 표현식으로 대체하세요:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus는 또한 복잡한 표현식을 구문 분석하는 데 소요되는 시간을 줄여 효율성을 개선하기 위해 설계된 필터 표현식 템플릿 메커니즘을 도입했습니다. 자세한 내용은 <a href="https://milvus.io/docs/filtering-templating.md">이 문서를</a> 참조하세요.</p></li>
<li><p><strong>적절한 인덱스를 추가하세요</strong>: 필터에 사용되는 필드에 스칼라 인덱스를 생성하여 전체 스캔을 피하세요.</p></li>
<li><p><strong>JSON을 효율적으로 처리하세요</strong>: Milvus 2.6에서는 JSON 필드에 대한 경로 및 플랫 인덱스를 도입하여 JSON 데이터를 효율적으로 처리할 수 있게 되었습니다. 또한 성능을 더욱 개선하기 위해 JSON 파쇄 기능도 <a href="https://milvus.io/docs/roadmap.md">로드맵에</a> 포함되어 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">JSON 필드 문서를</a> 참조하세요.</p></li>
<li><p><strong>일관성 수준 조정</strong>: 엄격한 보장이 필요하지 않은 경우 <em>바운드</em> 또는 <em>최종적으로</em> 일관된 읽기를 사용하여 <em>tSafe</em> 대기 시간을 줄이세요.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">부적절한 벡터 인덱스 선택</h3><p><a href="https://milvus.io/docs/index-explained.md">벡터 인덱스는</a> 만능이 아닙니다. 잘못된 인덱스를 선택하면 지연 시간에 큰 영향을 미칠 수 있습니다. 인메모리 인덱스는 가장 빠른 성능을 제공하지만 더 많은 메모리를 소비하는 반면, 온디스크 인덱스는 속도를 희생하면서 메모리를 절약합니다. 바이너리 벡터는 또한 특화된 인덱싱 전략이 필요합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>주의해야 할 신호:</strong></p>
<ul>
<li><p>쿼리 노드 메트릭의 높은 벡터 검색 지연 시간.</p></li>
<li><p>DiskANN 또는 MMAP 사용 시 디스크 I/O 포화 상태.</p></li>
<li><p>캐시 콜드 스타트로 인해 재시작 직후 쿼리 속도가 느려짐.</p></li>
</ul>
<p><strong>해결 방법:</strong></p>
<ul>
<li><p><strong>인덱스와 워크로드를 일치시킵니다(플로트 벡터):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - 높은 리콜과 짧은 지연 시간을 가진 인메모리 사용 사례에 가장 적합합니다.</p></li>
<li><p><strong>IVF 제품군</strong> - 리콜과 속도 간의 유연한 절충안.</p></li>
<li><p><strong>DiskANN</strong> - 수십억 규모의 데이터 세트를 지원하지만 강력한 디스크 대역폭이 필요합니다.</p></li>
</ul></li>
<li><p><strong>바이너리 벡터의 경우:</strong> MHJACCARD 메트릭과 함께 <a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSH 인덱스</a> (Milvus 2.6에 도입됨)를 사용하여 Jaccard 유사성을 효율적으로 근사화합니다.</p></li>
<li><p><a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a><strong>활성화</strong>: 인덱스 파일을 완전히 상주하는 대신 메모리에 매핑하여 지연 시간과 메모리 사용량 사이의 균형을 맞출 수 있습니다.</p></li>
<li><p><strong>색인/검색 매개변수 조정</strong>: 설정을 조정하여 워크로드의 리콜과 지연 시간의 균형을 맞출 수 있습니다.</p></li>
<li><p><strong>콜드 스타트 완화</strong>: 재시작 후 자주 액세스하는 세그먼트를 워밍업하여 초기 쿼리 속도가 느려지는 것을 방지하세요.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">런타임 및 환경 조건</h3><p>모든 느린 쿼리가 쿼리 자체 때문에 발생하는 것은 아닙니다. 쿼리 노드는 압축, 데이터 마이그레이션 또는 인덱스 구축과 같은 백그라운드 작업과 리소스를 공유하는 경우가 많습니다. 잦은 업서트로 인해 인덱싱되지 않은 작은 세그먼트가 많이 생성되어 검색이 원시 데이터를 스캔해야 할 수 있습니다. 경우에 따라 버전별 비효율성으로 인해 패치가 적용될 때까지 지연 시간이 발생할 수도 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>주의해야 할 신호:</strong></p>
<ul>
<li><p>백그라운드 작업(압축, 마이그레이션, 인덱스 빌드) 중 CPU 사용량이 급증합니다.</p></li>
<li><p>쿼리 성능에 영향을 미치는 디스크 I/O 포화 상태.</p></li>
<li><p>재시작 후 캐시 워밍업 속도가 매우 느림.</p></li>
<li><p>인덱싱되지 않은 많은 수의 작은 세그먼트(잦은 업서트로 인한).</p></li>
<li><p>특정 Milvus 버전과 관련된 지연 시간 회귀.</p></li>
</ul>
<p><strong>해결 방법:</strong></p>
<ul>
<li><p><strong>백그라운드 작업</strong> (예: 압축)을 사용량이 적은 시간으로<strong>일정을</strong> 변경합니다.</p></li>
<li><p><strong>사용하지 않는 컬렉션을 해제하여</strong> 메모리를 확보하세요.</p></li>
<li><p>재시작 후<strong>워밍업 시간을 고려하고</strong>, 필요한 경우 캐시를 미리 예열하세요.</p></li>
<li><p><strong>일괄 업서트를</strong> 통해 작은 세그먼트의 생성을 줄이고 압축이 계속 유지되도록 합니다.</p></li>
<li><p><strong>최신 버전 유지</strong>: 버그 수정 및 최적화를 위해 최신 Milvus 버전으로 업그레이드하세요.</p></li>
<li><p><strong>리소스 프로비저닝</strong>: 지연 시간에 민감한 워크로드에 추가 CPU/메모리를 할당하세요.</p></li>
</ul>
<p>각 신호를 적절한 조치와 일치시키면 대부분의 느린 쿼리를 빠르고 예측 가능하게 해결할 수 있습니다.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">느린 검색을 방지하는 모범 사례<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>가장 좋은 디버깅 세션은 실행할 필요가 없는 세션입니다. 저희의 경험에 따르면 몇 가지 간단한 습관만으로도 Milvus에서 느린 쿼리를 방지하는 데 큰 도움이 됩니다:</p>
<ul>
<li><p>CPU 및 디스크 경합을 피하기 위해<strong>리소스 할당을 계획하세요</strong>.</p></li>
<li><p>장애와 지연 시간 급증에 대한<strong>사전 알림을 설정합니다</strong>.</p></li>
<li><p><strong>필터 표현식을</strong> 짧고 간단하며 효율적으로<strong>유지하세요</strong>.</p></li>
<li><p><strong>업서트를 일괄 처리하고</strong> NQ/QPS를 지속 가능한 수준으로 유지하세요.</p></li>
<li><p>필터에 사용되는<strong>모든 필드를 색인화하세요</strong>.</p></li>
</ul>
<p>Milvus에서 느린 쿼리는 드물게 발생하며, 발생하더라도 대개 명확하고 진단 가능한 원인이 있습니다. 메트릭, 로그 및 구조화된 접근 방식을 사용하면 문제를 신속하게 식별하고 해결할 수 있습니다. 이 가이드는 지원팀이 매일 사용하는 플레이북과 동일하며, 이제 여러분도 사용할 수 있습니다.</p>
<p>이 가이드가 문제 해결 프레임워크뿐만 아니라 Milvus 워크로드를 원활하고 효율적으로 실행할 수 있는 자신감을 제공해 드릴 수 있기를 바랍니다.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 더 자세히 알아보고 싶으신가요?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord에</strong></a> 가입하여 질문하고, 경험을 공유하고, 커뮤니티에서 배우세요.</p></li>
<li><p><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus 오피스 아워에</strong></a> 등록하여 팀과 직접 상담하고 워크로드에 대한 실질적인 지원을 받으세요.</p></li>
</ul>
