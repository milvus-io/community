---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: 쿼리 성능 향상, 처리량 20% 증가'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Milvus 2.2.8의 최신 버전을 발표하게 되어 기쁘게 생각합니다. 이번 릴리스에는 이전 버전의 수많은 개선 사항과 버그 수정이 포함되어 있어 쿼리 성능이 향상되고 리소스가 절약되며 처리량이 증가합니다. 이번 릴리스의 새로운 기능을 함께 살펴보겠습니다.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">컬렉션 로딩 중 피크 메모리 사용량 감소<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>쿼리를 수행하려면 Milvus는 데이터와 인덱스를 메모리에 로드해야 합니다. 그러나 로드 프로세스 중에 여러 메모리 복사본으로 인해 최대 메모리 사용량이 실제 런타임보다 최대 3~4배까지 증가할 수 있습니다. 최신 버전의 Milvus 2.2.8은 이 문제를 효과적으로 해결하고 메모리 사용량을 최적화합니다.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">쿼리 노드 지원 플러그인을 통한 쿼리 시나리오 확장<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 최신 Milvus 2.2.8에서 QueryNode가 플러그인을 지원합니다. <code translate="no">queryNode.soPath</code> 설정으로 플러그인 파일의 경로를 쉽게 지정할 수 있습니다. 그러면 Milvus가 런타임에 플러그인을 로드하고 사용 가능한 쿼리 시나리오를 확장할 수 있습니다. 플러그인 개발에 대한 지침이 필요한 경우 <a href="https://pkg.go.dev/plugin">Go 플러그인 설명서를</a> 참조하세요.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">향상된 압축 알고리즘으로 쿼리 성능 최적화<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>압축 알고리즘은 세그먼트가 수렴되는 속도를 결정하며 쿼리 성능에 직접적인 영향을 미칩니다. 최근 압축 알고리즘이 개선되면서 수렴 효율이 크게 향상되어 쿼리 속도가 빨라졌습니다.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">수집 샤드 감소로 리소스 절약 및 쿼리 성능 향상<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 대규모 병렬 처리(MPP) 시스템으로, 수집 샤드의 수가 Milvus의 쓰기 및 쿼리 효율성에 영향을 미칩니다. 이전 버전에서는 컬렉션에 기본적으로 2개의 샤드가 있었기 때문에 쓰기 성능은 뛰어났지만 쿼리 성능과 리소스 비용이 저하되었습니다. 새로운 Milvus 2.2.8 업데이트에서는 기본 컬렉션 샤드가 1개로 줄어들어 사용자가 더 많은 리소스를 절약하고 더 나은 쿼리를 수행할 수 있게 되었습니다. 커뮤니티의 대부분의 사용자는 데이터 볼륨이 1,000만 개 미만이며, 하나의 샤드만으로도 우수한 쓰기 성능을 얻을 수 있습니다.</p>
<p><strong>참고</strong>: 이 업그레이드는 이 릴리즈 이전에 생성된 컬렉션에는 영향을 미치지 않습니다.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">쿼리 그룹화 알고리즘 개선으로 처리량 20% 증가<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 큐에 있는 여러 쿼리 요청을 하나로 결합하여 더 빠르게 실행하는 효율적인 쿼리 그룹화 알고리즘을 통해 처리량을 크게 향상시켰습니다. 최신 릴리스에서는 이 알고리즘을 추가로 개선하여 Milvus의 처리량을 최소 20% 이상 향상시켰습니다.</p>
<p>앞서 언급한 개선 사항 외에도 Milvus 2.2.8은 다양한 버그도 수정했습니다. 자세한 내용은 <a href="https://milvus.io/docs/release_notes.md">Milvus 릴리스 노트를</a> 참조하세요.</p>
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 언제든지 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의해 주세요. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 전체 커뮤니티와 직접 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 근무 시간을</a> 확인하실 수도 있습니다!</p>
