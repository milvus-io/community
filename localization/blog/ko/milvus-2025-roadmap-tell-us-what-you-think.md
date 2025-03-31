---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 로드맵 - 여러분의 의견을 알려주세요.
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  2025년에는 Milvus 2.6과 Milvus 3.0의 두 가지 주요 버전과 기타 여러 기술적 기능을 출시할 예정입니다. 여러분의 의견을
  환영합니다.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Milvus 사용자 및 기여자 여러분, 안녕하세요!</p>
<p><a href="https://milvus.io/docs/roadmap.md"><strong>Milvus 2025 로드맵을</strong></a> 여러분과 공유하게 되어 기쁩니다. 이 기술 계획은 Milvus를 더욱 강력한 벡터 검색 기능으로 만들기 위해 구축 중인 주요 기능과 개선 사항을 강조합니다.</p>
<p>하지만 이것은 시작에 불과합니다. 여러분의 인사이트가 필요합니다! 여러분의 피드백은 Milvus가 현실의 문제를 해결하도록 발전하는 데 도움이 됩니다. 여러분의 의견을 알려주시고 앞으로의 로드맵을 구체화할 수 있도록 도와주세요.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">현재 환경<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>지난 한 해 동안 많은 분들이 모델 통합, 전체 텍스트 검색, 하이브리드 검색과 같은 Milvus의 인기 기능을 활용하여 인상적인 RAG 및 상담원 애플리케이션을 구축하는 것을 보았습니다. 여러분의 구현은 실제 벡터 검색 요구 사항에 대한 귀중한 인사이트를 제공했습니다.</p>
<p>AI 기술이 발전함에 따라 기본적인 벡터 검색부터 지능형 에이전트, 자율 시스템, 구현된 AI를 아우르는 복잡한 멀티모달 애플리케이션에 이르기까지 사용 사례는 더욱 정교해지고 있습니다. 이러한 기술적 과제는 사용자의 요구를 충족하기 위해 Milvus를 지속적으로 개발하는 과정에서 로드맵에 반영되고 있습니다.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">2025년 두 가지 주요 릴리스: Milvus 2.6 및 Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>2025년에는 두 가지 주요 버전을 출시할 예정입니다: Milvus 2.6(CY25 중반)과 Milvus 3.0(2025년 말)이 그것입니다.</p>
<p><strong>Milvus 2.6은</strong> 사용자들이 요청해 온 핵심 아키텍처 개선 사항에 중점을 두고 있습니다:</p>
<ul>
<li><p>더 적은 종속성으로 더욱 간소화된 배포(배포 골칫거리는 이제 안녕!)</p></li>
<li><p>더 빨라진 데이터 수집 파이프라인</p></li>
<li><p>스토리지 비용 절감(프로덕션 비용에 대한 여러분의 고민을 잘 알고 있습니다)</p></li>
<li><p>대규모 데이터 작업(삭제/수정)의 더 나은 처리(삭제/수정)</p></li>
<li><p>보다 효율적인 스칼라 및 전체 텍스트 검색</p></li>
<li><p>작업 중인 최신 임베딩 모델 지원</p></li>
</ul>
<p><strong>Milvus 3.0은</strong> 보다 큰 아키텍처적 진화를 통해 벡터 데이터 레이크 시스템을 도입했습니다:</p>
<ul>
<li><p>원활한 AI 서비스 통합</p></li>
<li><p>한 차원 높은 검색 기능</p></li>
<li><p>더욱 강력한 데이터 관리</p></li>
<li><p>작업 중인 대규모 오프라인 데이터 세트의 처리 개선</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">계획 중인 기술 기능 - 여러분의 피드백이 필요합니다.<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 Milvus에 추가할 예정인 주요 기술 기능입니다.</p>
<table>
<thead>
<tr><th><strong>주요 기능 영역</strong></th><th><strong>기술적 특징</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>AI 기반 비정형 데이터 처리</strong></td><td>- 데이터 인/아웃: 원시 텍스트 수집을 위한 주요 모델 서비스와의 기본 통합<br>- 원본 데이터 처리: 원시 데이터 처리를 위한 텍스트/URL 참조 지원<br>- 텐서 지원: 벡터 목록 구현(콜버트/CoPali/비디오 시나리오용)<br>- 확장된 데이터 유형: 요구사항에 따라 날짜/시간, 지도, GIS 지원<br>- 반복 검색: 사용자 피드백을 통한 쿼리 벡터 개선</td></tr>
<tr><td><strong>검색 품질 및 성능 개선</strong></td><td>- 고급 일치: 구문 일치 및 다중 일치 기능<br>- 분석기 업그레이드: 확장된 토큰화 도구 지원 및 향상된 통합 가시성으로 분석기 향상<br>- JSON 최적화: 개선된 인덱싱을 통한 더 빠른 필터링<br>- 실행 정렬: 스칼라 필드 기반 결과 순서 지정<br>- 고급 리랭커: 모델 기반 재랭크 및 사용자 정의 채점 기능<br>- 반복 검색: 사용자의 피드백을 통한 쿼리 벡터 개선</td></tr>
<tr><td><strong>데이터 관리 유연성</strong></td><td>- 스키마 변경: 필드 추가/삭제, 바차 길이 수정<br>- 스칼라 집계: 카운트/구분/분/최대 연산<br>- UDF 지원: 사용자 정의 함수 지원<br>- 데이터 버전 관리: 스냅샷 기반 롤백 시스템<br>- 데이터 클러스터링: 구성을 통한 코로케이션<br>- 데이터 샘플링: 샘플링 데이터에 기반한 빠른 결과 도출</td></tr>
<tr><td><strong>아키텍처 개선</strong></td><td>- 스트림 노드: 간소화된 증분 데이터 수집<br>- MixCoord: 통합 코디네이터 아키텍처<br>- 로그 저장소 독립성: 펄서와 같은 외부 종속성 감소<br>- PK 중복 제거: 글로벌 기본 키 중복 제거</td></tr>
<tr><td><strong>비용 효율성 및 아키텍처 개선</strong></td><td>- 계층형 스토리지: 스토리지 비용 절감을 위한 핫/콜드 데이터 분리<br>- 데이터 퇴출 정책: 사용자가 직접 데이터 퇴출 정책을 정의할 수 있습니다.<br>- 대량 업데이트: 필드별 값 수정, ETL 등을 지원합니다.<br>- 대용량 TopK: 대용량 데이터 세트 반환<br>- VTS GA: 다양한 데이터 소스에 연결<br>- 고급 양자화: 양자화 기술을 기반으로 메모리 소비 및 성능 최적화<br>- 리소스 탄력성: 다양한 쓰기 부하, 읽기 부하 및 백그라운드 작업 부하를 수용하도록 리소스를 동적으로 확장합니다.</td></tr>
</tbody>
</table>
<p>이 로드맵을 구현하면서 다음 사항에 대한 의견과 피드백을 보내주시면 감사하겠습니다:</p>
<ol>
<li><p><strong>기능 우선순위:</strong> 로드맵에서 어떤 기능이 여러분의 업무에 가장 큰 영향을 미칠까요?</p></li>
<li><p><strong>구현 아이디어:</strong> 이러한 기능에 대해 어떤 구체적인 접근 방식이 효과적이라고 생각하시나요?</p></li>
<li><p><strong>사용 사례 정렬:</strong> 계획된 기능이 현재 및 미래의 사용 사례와 어떻게 일치하나요?</p></li>
<li><p><strong>성능 고려 사항:</strong> 특정 요구 사항을 위해 집중해야 할 성능 측면이 있나요?</p></li>
</ol>
<p><strong>여러분의 인사이트는 모두를 위해 더 나은 Milvus를 만드는 데 도움이 됩니다.<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvus 토론 포럼이나</a> <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에서</a> 여러분의 의견을 자유롭게 공유해 주세요.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Milvus 기여에 오신 것을 환영합니다<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>오픈 소스 프로젝트인 Milvus는 언제나 여러분의 기여를 환영합니다:</p>
<ul>
<li><p><strong>피드백을 공유하세요:</strong> <a href="https://github.com/milvus-io/milvus/issues">GitHub 이슈 페이지를</a> 통해 문제를 보고하거나 기능을 제안하세요.</p></li>
<li><p><strong>코드 기여:</strong> 풀 리퀘스트 제출( <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">기여자 가이드</a> 참조)</p></li>
<li><p><strong>소문내기:</strong> Milvus 경험을 공유하고 <a href="https://github.com/milvus-io/milvus">GitHub 리포지토리에 별표 표시하기</a></p></li>
</ul>
<p>Milvus의 다음 장을 여러분과 함께 만들어가게 되어 기쁩니다. 여러분의 코드, 아이디어, 피드백이 이 프로젝트를 발전시키는 원동력입니다!</p>
<p>- Milvus 팀</p>
