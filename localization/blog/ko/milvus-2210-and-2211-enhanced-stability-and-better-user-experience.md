---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: 'Milvus 2.2.10 및 2.2.11: 시스템 안정성 및 사용자 경험 향상을 위한 마이너 업데이트'
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Milvus 2.2.10 및 2.2.11의 새로운 기능 및 개선 사항을 소개합니다.
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 팬 여러분, 안녕하세요! 버그 수정과 전반적인 성능 개선에 중점을 둔 Milvus 2.2.10과 2.2.11의 마이너 업데이트를 출시하게 되어 매우 기쁩니다. 두 가지 업데이트를 통해 더욱 안정적인 시스템과 더 나은 사용자 경험을 기대하실 수 있습니다. 이 두 릴리스의 새로운 기능을 간단히 살펴보겠습니다.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10은 가끔 발생하는 시스템 충돌을 수정하고, 로딩 및 인덱싱 속도를 높이며, 데이터 노드의 메모리 사용량을 줄이는 등 여러 가지 개선 사항을 적용했습니다. 다음은 몇 가지 주목할 만한 변경 사항입니다:</p>
<ul>
<li>기존 CGO 페이로드 작성기를 순수 Go로 작성된 새로운 작성기로 교체하여 데이터 노드의 메모리 사용량을 줄였습니다.</li>
<li>다른 <code translate="no">milvus-proto</code> 버전과의 혼동을 방지하기 위해 <code translate="no">milvus-proto</code> 파일에 <code translate="no">go-api/v2</code> 을 추가했습니다.</li>
<li><code translate="no">Context.FileAttachment</code> 함수의 버그를 수정하기 위해 Gin을 버전 1.9.0에서 1.9.1로 업그레이드했습니다.</li>
<li>FlushAll 및 데이터베이스 API에 역할 기반 액세스 제어(RBAC)를 추가했습니다.</li>
<li>AWS S3 SDK로 인한 무작위 충돌을 수정했습니다.</li>
<li>로딩 및 인덱싱 속도가 개선되었습니다.</li>
</ul>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10 릴리즈 노트를</a> 참조하세요.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11은 다양한 문제를 해결하여 시스템의 안정성을 개선했습니다. 또한 모니터링, 로깅, 속도 제한, 클러스터 간 요청 차단 등의 성능이 개선되었습니다. 이번 업데이트의 주요 내용은 아래를 참조하세요.</p>
<ul>
<li>클러스터 간 라우팅 문제를 방지하기 위해 Milvus GRPC 서버에 인터셉터를 추가했습니다.</li>
<li>미니오 청크 매니저에 오류 코드를 추가하여 오류를 더 쉽게 진단하고 수정할 수 있도록 했습니다.</li>
<li>싱글톤 코루틴 풀을 활용하여 코루틴 낭비를 방지하고 리소스 사용을 극대화했습니다.</li>
<li>zstd 압축을 활성화하여 RocksMq의 디스크 사용량을 원래의 10분의 1 수준으로 줄였습니다.</li>
<li>로딩 중 간헐적으로 발생하는 QueryNode 패닉을 수정했습니다.</li>
<li>큐 길이를 두 번 잘못 계산하여 발생하는 읽기 요청 스로틀링 문제를 수정했습니다.</li>
<li>MacOS에서 GetObject가 null 값을 반환하는 문제를 수정했습니다.</li>
<li>noexcept 수정자를 잘못 사용하여 발생하는 충돌을 수정했습니다.</li>
</ul>
<p>자세한 내용은 <a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11 릴리스 노트를</a> 참조하세요.</p>
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
    </button></h2><p>Milvus에 대한 질문이나 피드백이 있으시면 언제든지 <a href="https://twitter.com/milvusio">트위터나</a> <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn을</a> 통해 문의해 주세요. 또한 <a href="https://milvus.io/slack/">Slack 채널에</a> 가입하여 엔지니어 및 커뮤니티와 직접 채팅하거나 <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">화요일 업무 시간을</a> 확인하실 수도 있습니다!</p>
