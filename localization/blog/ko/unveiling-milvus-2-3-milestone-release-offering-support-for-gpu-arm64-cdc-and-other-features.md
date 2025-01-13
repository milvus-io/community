---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: 'Milvus 2.3 공개: GPU, Arm64, CDC 및 기타 많은 기대를 모았던 기능을 지원하는 획기적인 릴리스 공개'
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3은 GPU, Arm64, 업서트, 변경 데이터 캡처, ScaNN 인덱스, 범위 검색 지원 등 많은 기대를 모았던 다양한
  기능이 포함된 획기적인 릴리스입니다. 또한 쿼리 성능 향상, 더욱 강력한 로드 밸런싱 및 스케줄링, 더 나은 가시성 및 조작성 등이
  도입되었습니다.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>기쁜 소식입니다! 8개월간의 공동의 노력 끝에 GPU, Arm64, 업서트, 변경 데이터 캡처, ScaNN 인덱스, MMap 기술 지원 등 많은 기대를 모았던 수많은 기능을 제공하는 획기적인 버전인 Milvus 2.3의 출시를 발표하게 되어 기쁘게 생각합니다. 또한 Milvus 2.3은 향상된 쿼리 성능, 더욱 강력한 로드 밸런싱 및 스케줄링, 더 나은 가시성 및 운영성을 도입했습니다.</p>
<p>이 새로운 기능과 개선 사항을 살펴보고 이번 릴리스의 이점을 어떻게 활용할 수 있는지 알아보세요.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">3~10배 빠른 QPS로 이어지는 GPU 인덱스 지원<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU 인덱스는 Milvus 커뮤니티에서 많은 기대를 모았던 기능입니다. Nvidia 엔지니어와의 긴밀한 협업 덕분에 Milvus 2.3은 Milvus 인덱스 엔진인 Knowhere에 강력한 RAFT 알고리즘이 추가된 GPU 인덱싱을 지원하게 되었습니다. GPU를 지원하는 Milvus 2.3은 CPU HNSW 인덱스를 사용하는 이전 버전에 비해 QPS가 3배 이상 빨라졌으며, 연산량이 많은 특정 데이터 세트의 경우 거의 10배 더 빨라졌습니다.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">증가하는 사용자 수요를 수용하기 위한 Arm64 지원<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>클라우드 제공업체와 개발자들 사이에서 Arm CPU의 인기가 점점 높아지고 있습니다. 이러한 수요 증가에 부응하기 위해 Milvus는 이제 ARM64 아키텍처용 Docker 이미지를 제공합니다. 이 새로운 CPU 지원을 통해 MacOS 사용자는 Milvus로 애플리케이션을 더욱 원활하게 빌드할 수 있습니다.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">더 나은 사용자 경험을 위한 업서트 지원<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3은 업서트 작업을 지원하여 주목할 만한 개선 사항을 도입했습니다. 이 새로운 기능을 통해 사용자는 데이터를 원활하게 업데이트하거나 삽입할 수 있으며, 업서트 인터페이스를 통해 한 번의 요청으로 두 가지 작업을 모두 수행할 수 있습니다. 이 기능은 데이터 관리를 간소화하고 효율성을 높여줍니다.</p>
<p><strong>참고</strong>:</p>
<ul>
<li>자동 증가 ID에는 업서트 기능이 적용되지 않습니다.</li>
<li>업서트는 <code translate="no">delete</code> 와 <code translate="no">insert</code> 의 조합으로 구현되므로 약간의 성능 저하가 발생할 수 있습니다. 쓰기 작업이 많은 시나리오에서 Milvus를 사용하는 경우 <code translate="no">insert</code> 을 사용하는 것이 좋습니다.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">보다 정확한 결과를 위한 범위 검색<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3에서는 사용자가 쿼리 중에 입력 벡터와 Milvus에 저장된 벡터 사이의 거리를 지정할 수 있습니다. 그러면 Milvus는 설정된 범위 내에서 일치하는 모든 결과를 반환합니다. 아래는 범위 검색 기능을 사용하여 검색 거리를 지정하는 예제입니다.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>이 예에서 사용자는 Milvus가 입력 벡터로부터 10~20단위 거리 내의 벡터를 반환하도록 요구합니다.</p>
<p><strong>참고</strong>: 거리 메트릭마다 거리를 계산하는 방식이 다르기 때문에 값 범위와 정렬 전략이 다릅니다. 따라서 범위 검색 기능을 사용하기 전에 그 특성을 이해하는 것이 중요합니다.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">빠른 쿼리 속도를 위한 ScaNN 인덱스<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3은 이제 Google에서 개발한 오픈 소스 <a href="https://zilliz.com/glossary/anns">근사 근접 이웃(ANN)</a> 인덱스인 ScaNN 인덱스를 지원합니다. ScaNN 인덱스는 다양한 벤치마크에서 HNSW보다 약 20% 정도 성능이 우수하고 IVFFlat보다 약 7배 빠른 것으로 입증되었습니다. ScaNN 인덱스 지원으로 Milvus는 이전 버전에 비해 훨씬 빠른 쿼리 속도를 달성했습니다.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">안정적이고 더 나은 쿼리 성능을 위한 인덱스 증가<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에는 인덱싱된 데이터와 스트리밍 데이터의 두 가지 범주의 데이터가 포함됩니다. Milvus는 인덱스를 사용해 인덱싱된 데이터를 빠르게 검색할 수 있지만 스트리밍 데이터는 행 단위로만 검색할 수 있어 성능에 영향을 줄 수 있습니다. Milvus 2.3에서는 스트리밍 데이터에 대한 실시간 인덱스를 자동으로 생성하여 쿼리 성능을 개선하는 Growing Index를 도입했습니다.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">일괄 데이터 검색을 위한 이터레이터<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스 2.3에서는 사용자가 검색 또는 범위 검색에서 16,384개 이상의 엔티티를 검색할 수 있는 이터레이터 인터페이스를 도입했습니다. 이 기능은 사용자가 수만 개 이상의 벡터를 일괄적으로 내보내야 할 때 유용합니다.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">용량 증대를 위한 MMap 지원<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap은 파일 및 기타 개체를 메모리에 매핑하는 데 사용되는 UNIX 시스템 호출입니다. Milvus 2.3은 사용자가 로컬 디스크에 데이터를 로드하고 메모리에 매핑하여 단일 머신 용량을 늘릴 수 있는 MMap을 지원합니다.</p>
<p>테스트 결과에 따르면 MMap 기술을 사용하면 데이터 용량을 두 배로 늘리면서도 성능 저하를 20% 이내로 제한할 수 있는 것으로 나타났습니다. 이 접근 방식은 전체 비용을 크게 줄여주므로 예산이 부족하여 성능 저하를 감수할 수 없는 사용자에게 특히 유용합니다.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">시스템 가용성 향상을 위한 CDC 지원<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>변경 데이터 캡처(CDC)는 데이터베이스 시스템에서 일반적으로 사용되는 기능으로, 데이터 변경 사항을 캡처하여 지정된 대상에 복제하는 기능입니다. Milvus 2.3은 CDC 기능을 통해 사용자가 데이터 센터 간에 데이터를 동기화하고, 증분 데이터를 백업하고, 데이터를 원활하게 마이그레이션하여 시스템 가용성을 높일 수 있도록 지원합니다.</p>
<p>위의 기능 외에도 Milvus 2.3에는 컬렉션에 저장된 데이터의 행 수를 실시간으로 정확하게 계산하는 카운트 인터페이스가 도입되었으며, 벡터 거리를 측정하는 코사인 메트릭을 지원하고 JSON 배열에서 더 많은 작업을 수행할 수 있습니다. 더 많은 기능과 자세한 정보는 <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 릴리스 노트를</a> 참조하세요.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">향상된 기능 및 버그 수정<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3에는 새로운 기능 외에도 이전 버전에 대한 많은 개선 사항과 버그 수정이 포함되어 있습니다.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">데이터 필터링 성능 향상</h3><p>Milvus는 하이브리드 스칼라 및 벡터 데이터 쿼리에서 벡터 검색 전에 스칼라 필터링을 수행하여 보다 정확한 결과를 얻을 수 있습니다. 그러나 사용자가 스칼라 필터링 후 너무 많은 데이터를 걸러낸 경우 인덱싱 성능이 저하될 수 있습니다. Milvus 2.3에서는 이 문제를 해결하기 위해 HNSW의 필터링 전략을 최적화하여 쿼리 성능을 개선했습니다.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">멀티코어 CPU 사용량 증가</h3><p>근사 근사값 검색(ANN)은 대규모 CPU 리소스를 필요로 하는 계산 집약적인 작업입니다. 이전 릴리스에서 Milvus는 사용 가능한 멀티코어 CPU 리소스의 약 70%만 활용할 수 있었습니다. 그러나 최신 릴리스에서는 이러한 한계를 극복하고 사용 가능한 모든 멀티코어 CPU 리소스를 완전히 활용할 수 있어 쿼리 성능이 향상되고 리소스 낭비가 감소했습니다.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">리팩터링된 쿼리노드</h3><p>QueryNode는 Milvus에서 벡터 검색을 담당하는 중요한 구성 요소입니다. 하지만 이전 버전에서 QueryNode는 복잡한 상태, 중복된 메시지 대기열, 정리되지 않은 코드 구조, 직관적이지 않은 오류 메시지를 가지고 있었습니다.</p>
<p>Milvus 2.3에서는 상태 비저장 코드 구조를 도입하고 데이터 삭제를 위한 메시지 큐를 제거하여 QueryNode를 업그레이드했습니다. 이러한 업데이트를 통해 리소스 낭비를 줄이고 더 빠르고 안정적인 벡터 검색이 가능해졌습니다.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">NATS 기반의 향상된 메시지 큐</h3><p>Milvus는 로그 기반 아키텍처를 기반으로 구축되었으며, 이전 버전에서는 핵심 로그 브로커로 Pulsar와 Kafka를 사용했습니다. 하지만 이 조합은 세 가지 주요 과제에 직면했습니다:</p>
<ul>
<li>다중 토픽 상황에서 불안정했습니다.</li>
<li>유휴 상태일 때 리소스를 소모하고 메시지 중복 제거에 어려움을 겪었습니다.</li>
<li>Pulsar와 Kafka는 Java 에코시스템과 밀접하게 연결되어 있기 때문에 커뮤니티에서 Go SDK를 유지 관리 및 업데이트하는 경우가 거의 없습니다.</li>
</ul>
<p>이러한 문제를 해결하기 위해 Milvus의 새로운 로그 브로커로 NATS와 Bookeeper를 결합하여 사용자의 요구에 더 잘 맞도록 했습니다.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">최적화된 로드 밸런서</h3><p>Milvus 2.3은 시스템의 실제 부하를 기반으로 보다 유연한 로드 밸런싱 알고리즘을 채택했습니다. 이 최적화된 알고리즘을 통해 사용자는 노드 장애와 불균형 부하를 신속하게 감지하고 그에 따라 스케줄을 조정할 수 있습니다. 테스트 결과에 따르면 Milvus 2.3은 장애, 불균형 부하, 비정상적인 노드 상태 및 기타 이벤트를 수초 내에 감지하고 즉시 조정할 수 있습니다.</p>
<p>Milvus 2.3에 대한 자세한 내용은 Milvus <a href="https://milvus.io/docs/release_notes.md">2.3 릴리스 노트를</a> 참조하세요.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">도구 업그레이드<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3과 함께 Milvus 운영 및 유지 관리에 유용한 두 가지 도구인 Birdwatcher와 Attu도 업그레이드되었습니다.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">버드워처 업데이트</h3><p>Milvus의 디버그 도구인 <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher를</a> 업그레이드하여 다음과 같은 다양한 기능 및 개선 사항을 도입했습니다:</p>
<ul>
<li>다른 진단 시스템과의 원활한 통합을 위한 RESTful API.</li>
<li>Go pprof 도구와의 통합을 용이하게 하는 PProf 명령 지원.</li>
<li>스토리지 사용량 분석 기능.</li>
<li>효율적인 로그 분석 기능.</li>
<li>etcd에서 구성 보기 및 수정 지원.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attu 업데이트</h3><p>올인원 벡터 데이터베이스 관리 도구인 <a href="https://zilliz.com/attu">Attu의</a> 새로운 인터페이스가 출시되었습니다. 새로운 인터페이스는 더 직관적인 디자인으로 더 쉽게 이해할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 릴리스 노트를</a> 참조하세요.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">계속 연락주세요!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 언제든지 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의해 주세요. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 근무 시간을</a> 확인해 보세요!</p>
