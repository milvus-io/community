---
id: attu-3-0-beta.md
title: |
  Attu 3.0 베타: 멀티 클러스터 관리, AI 에이전트, 그리고 새롭게 재구축된 Milvus 콘솔
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 베타 버전은 다중 클러스터 관리, 지속적 상태 유지, 내장 AI 에이전트, 전문 진단 기능, 실시간 메트릭, API 디버깅,
  백업 및 복원, 간소화된 RBAC 워크플로를 지원하도록 Milvus 관리 콘솔을 새롭게 구축했습니다.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 베타 버전이 출시되었습니다.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu는</strong></a> <a href="https://milvus.io"><strong>Milvus용</strong></a> 오픈소스 관리 콘솔입니다. 로컬이나 프로덕션 환경에서 Milvus를 사용해 보셨다면, 컬렉션을 확인하거나 데이터를 탐색하고, 스키마를 관리하거나, 클러스터 내부에서 무슨 일이 일어나고 있는지 확인하기 위해 Attu를 사용해 보셨을 것입니다.</p>
<p>Attu 2.x는 기본적인 단일 클러스터 관리에는 잘 작동했습니다. 하지만 Milvus 배포 규모가 커짐에 따라 그 한계가 더욱 뚜렷해졌습니다. 한 번에 하나의 Milvus 인스턴스에만 연결할 수 있었고, 컨테이너가 재시작되면 연결 상태가 끊어졌습니다. 데이터 탐색은 대부분 컬렉션 중심이었습니다. 진단, 모니터링, API 디버깅, 백업 및 복원, 권한 관리에는 종종 별도의 도구나 수동 단계가 필요했습니다.</p>
<p><strong>Attu 3.0 베타는 Milvus 관리 환경을 완전히 재구축한 버전입니다.</strong></p>
<p>이번 릴리스에는 다중 클러스터 관리, 영구적인 로컬 상태, 50개 이상의 Milvus 도구를 갖춘 내장 AI 에이전트, 전문적인 진단 기능, 새롭게 디자인된 데이터 브라우저, 내장된 Prometheus 메트릭, API 플레이그라운드, GUI 기반 백업 및 복원, 간소화된 RBAC 워크플로가 추가되었습니다.</p>
<p>간단히 말해, Attu는 더 이상 단일 Milvus 인스턴스를 위한 경량 뷰어에 그치지 않습니다. 로컬, 스테이징, 프로덕션 환경에 걸쳐 Milvus를 관리하는 개발자와 팀을 위한 실용적인 운영 콘솔로 거듭나고 있습니다.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Attu 3.0 베타의 변경 사항<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 Attu 2.x와 Attu 3.0 베타 버전의 주요 비교 사항입니다.</p>
<table>
<thead>
<tr><th>기능</th><th>Attu 2.x</th><th>Attu 3.0 베타</th></tr>
</thead>
<tbody>
<tr><td>클러스터 연결</td><td>단일 인스턴스만 지원</td><td>원클릭 전환이 가능한 다중 클러스터</td></tr>
<tr><td>상태 지속성</td><td>상태 비저장형; 컨테이너 재시작 시 손실됨</td><td>로컬 데이터베이스; 재시작 후에도 유지됨</td></tr>
<tr><td>AI 지원</td><td>없음</td><td>50개 이상의 Milvus 도구를 갖춘 내장 에이전트</td></tr>
<tr><td>진단</td><td>수동 조사</td><td>4가지 내장된 전문가 수준의 진단 기능</td></tr>
<tr><td>RBAC 관리</td><td>별도의 페이지, 다단계 흐름</td><td>컨텍스트 내 원클릭 사용자 생성</td></tr>
<tr><td>데이터 탐색</td><td>평면 컬렉션 목록</td><td>계층적 트리: 데이터베이스 → 컬렉션 → 파티션</td></tr>
<tr><td>모니터링</td><td>외부 Grafana 필요</td><td>내장된 Prometheus 메트릭 대시보드</td></tr>
<tr><td>API 디버깅</td><td>curl 또는 Postman과 같은 외부 도구</td><td>내장 REST API 플레이그라운드</td></tr>
<tr><td>백업 및 복원</td><td>CLI 전용</td><td>S3, MinIO, GCS 및 Azure를 지원하는 GUI</td></tr>
<tr><td>LLM 통합</td><td>없음</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini 등</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">단일 사이드바에서 여러 Milvus 클러스터 관리<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>가장 큰 일상적인 변화는 다중 클러스터 관리 기능입니다.</strong> Attu 3.0은 사용자가 실행 중인 모든 Milvus 인스턴스에 연결하여 단일 사이드바에 나열할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: 상태 지표와 함께 여러 Milvus 연결을 보여주는 Attu 3.0 사이드바</p>
<p>Attu 2.x에서는 한 Milvus 클러스터에서 다른 클러스터로 전환하려면 연결을 끊고 다시 연결한 후 기다려야 했습니다. 개발, 스테이징, 프로덕션 또는 서로 다른 사업 부문을 위해 별도의 클러스터를 운영 중이었다면, 클러스터마다 브라우저 탭을 하나씩 열어두는 경우가 많았습니다.</p>
<p>Attu 3.0은 이러한 작업 흐름을 상시 표시되는 왼쪽 사이드바로 대체합니다. 모든 Milvus 연결이 한곳에 나열되며, 각 연결 옆에는 실시간 상태 표시기가 표시됩니다. 녹색 점은 클러스터에 연결 가능함을, 빨간색 점은 클러스터가 다운되었거나 사용할 수 없음을 의미합니다.</p>
<p>클러스터 전환은 클릭 한 번이면 됩니다. Attu는 각 연결의 컨텍스트를 유지하므로, 환경 간을 이동할 때마다 매번 다시 연결할 필요가 없습니다.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">더 안정적인 연결 설정</h3><p>새로운 연결은 TLS/SSL 암호화, 토큰 인증, 사용자 이름/비밀번호 인증을 지원합니다. 연결을 저장하기 전에 테스트할 수 있으며, 연결 세부 정보를 로컬에 저장하고, 더 이상 필요하지 않은 구 환경의 연결을 일괄 삭제할 수 있습니다.</p>
<p><strong>각 클러스터에는 고유한 작업 공간이 할당됩니다.</strong> 개요, 데이터 브라우저, 사용자 관리, 메트릭 및 운영 기능은 모두 현재 선택된 클러스터에 한정됩니다. 덕분에 스테이징 환경과 프로덕션 환경을 혼동하거나 잘못된 위치에서 작업을 실행할 가능성이 크게 줄어듭니다.</p>
<p>두 개 이상의 Milvus 인스턴스를 관리하는 사용자에게 이는 Attu 3.0의 가장 중요한 변경 사항 중 하나입니다. 기본적인 기능처럼 보일 수 있지만, 일상적인 Milvus 작업에서 탭 전환과 재연결에 따른 번거로움을 크게 줄여줍니다.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">재시작 후에도 로컬 상태 유지<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x는 상태 비저장형이었습니다. 컨테이너가 재시작되면 저장된 연결 정보가 사라져 작업 공간을 다시 구축해야 했습니다.</p>
<p><strong>Attu 3.0에는 클러스터 구성, 에이전트 대화 내역, 사용자 정의 스킬, LLM 구성 및 사용자 기본 설정을 영구적으로 저장하는 로컬 데이터베이스가 추가되었습니다.</strong></p>
<p>Docker로 Attu를 실행할 때, 해당 상태를 유지하려면 볼륨을 마운트하세요:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>볼륨이 마운트되어 있으면 컨테이너를 재시작하더라도 처음부터 다시 시작할 필요가 없습니다.</p>
<p>이는 새로운 AI 에이전트에도 중요한 기능입니다. 대화 내역, 사용자 정의 스킬, LLM 구성을 로컬에 영구적으로 저장할 수 있으므로, Attu는 재시작할 때마다 초기화되는 일시적인 UI가 아닌, 지속적으로 사용할 수 있는 콘솔이 됩니다.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">내장 AI 에이전트를 사용하여 자연어로 Milvus 운영<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0에는 Milvus 관리를 위한 내장 AI 에이전트가 포함되어 있습니다. 이는 단순한 문서 챗봇이 아닙니다. <strong>이 에이전트는 50개 이상의 Milvus 도구와 연결되어 있어, 클러스터 상태를 확인하고 Attu를 통해 실제 작업을 실행할 수 있습니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: Attu 3.0 AI 에이전트는 자연어 요청을 통해 Milvus 도구를 호출할 수 있습니다</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">일반적인 Milvus 워크플로우 전반에 걸친 50개 이상의 내장 도구</h3><p>이 에이전트는 일상적인 운영, 진단, 권한 관리 및 클러스터 관리를 포괄합니다. 다음과 같은 질문을 하거나 지시를 내릴 수 있습니다:</p>
<table>
<thead>
<tr><th>시나리오</th><th>예시 프롬프트</th></tr>
</thead>
<tbody>
<tr><td>일상적인 운영</td><td>“내 모든 컬렉션을 나열해 주세요.”<br>“id, title, embedding 필드가 포함된 컬렉션을 생성해 주세요. embedding 필드에는 차원 768을 사용해 주세요.”<br>“my_collection에 테스트 데이터를 몇 개 삽입해 주세요.”<br>“my_collection에서 '인공 지능'과 가장 유사한 10개의 레코드를 검색해 주세요.”</td></tr>
<tr><td>운영 및 진단</td><td>“내 클러스터 상태는 정상인가요?”<br>“검색이 왜 이렇게 느린가요?”<br>“메모리를 가장 많이 사용하는 컬렉션은 어디인가요?”<br>“최근에 느린 쿼리가 있었나요?”</td></tr>
<tr><td>권한</td><td>“analyst라는 읽기 전용 사용자를 생성하세요.”<br>“admin 역할에 모든 권한을 부여하세요.”<br>“zhangsan 사용자가 어떤 권한을 가지고 있는지 확인해 주세요.”</td></tr>
<tr><td>클러스터 관리</td><td>“현재 Milvus 버전과 구성을 표시하세요.”<br>“리소스 그룹 사용 현황을 나열해 주세요.”<br>“my_collection을 압축해 주세요.”</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">파괴적 작업은 승인이 필요합니다</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: 파괴적이거나 민감한 작업은 실행 전에 확인 대화 상자가 표시됩니다</p>
<p><strong>에이전트는 투명하고 제어 가능하도록 설계되었습니다.</strong> 컬렉션 나열이나 메트릭 읽기와 같은 비파괴적 작업은 결과를 직접 반환합니다.</p>
<p>컬렉션 삭제, 데이터 지우기, 권한 변경과 같은 파괴적이거나 민감한 작업은 확인 대화 상자를 표시합니다. 이 대화 상자에는 정확한 매개 변수가 나열되며, 작업이 실행되기 전에 승인을 기다립니다.</p>
<p>또한 에이전트가 어떤 도구를 호출했는지, 토큰을 몇 개 사용했는지, 도구 호출에 실패한 경우가 있는지 확인할 수 있습니다. 이는 데이터베이스 관리 에이전트에게 중요한 사항입니다. 사용자는 단순히 최종 결과만 보는 것이 아니라 에이전트가 수행한 작업을 이해할 수 있어야 합니다.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">콘솔에서 전문가 진단 기능 실행<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AI 에이전트에는 4가지 내장 진단 스킬이 포함되어 있습니다.</strong> 이는 일반적인 프롬프트가 아닌, Milvus의 일반적인 문제 해결 시나리오를 위한 안내형 워크플로우입니다.</p>
<table>
<thead>
<tr><th>진단 스킬</th><th>점검 항목</th></tr>
</thead>
<tbody>
<tr><td>클러스터 상태 진단</td><td>버전, 노드 상태, 구성 요소별 상태 및 주요 지표.</td></tr>
<tr><td>검색 성능 진단</td><td>인덱스 상태, 세그먼트 조각화, 복제본 균형 및 관련 검색 성능 신호.</td></tr>
<tr><td>데이터 쓰기 진단</td><td>느린 삽입, 데이터 손실 검사, 플러시 이상 및 쓰기 경로 증상.</td></tr>
<tr><td>구성 감사</td><td>안정성, 성능 또는 예상 동작에 영향을 줄 수 있는 위험하거나 잘못된 설정.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: Attu 3.0에는 내장된 진단 스킬이 포함되어 있으며 사용자 정의 스킬을 지원합니다</p>
<p>자연어로 사용자 지정 스킬을 생성할 수도 있습니다. 스킬에는 출시 전 체크리스트, 특정 컬렉션에 대한 데이터 품질 검사, 또는 팀이 알려진 워크로드에 대해 실행하는 진단 흐름 등을 포함할 수 있습니다.</p>
<p>사용자 지정 스킬은 본질적으로 도메인 지식과 절차의 결합입니다. 일단 저장되면 에이전트는 매번 일회성 프롬프트에 의존하지 않고 이를 재사용할 수 있습니다.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">자사 LLM 제공업체 활용<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu는 LLM 서비스를 번들링하거나 프록시하지 않습니다.</strong> 사용자는 자체 제공업체를 구성하고 모델 경로를 직접 제어할 수 있습니다.</p>
<p>지원되는 제공업체 옵션에는 OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter 및 OpenAI 호환 사용자 지정 엔드포인트가 포함됩니다.</p>
<table>
<thead>
<tr><th>프로바이더</th><th>예시 모델</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>딥시크-V4</td></tr>
<tr><td>Google Gemini</td><td>제미니 3.5</td></tr>
<tr><td>OpenRouter</td><td>모든 라우팅된 모델</td></tr>
<tr><td>사용자 지정 엔드포인트</td><td>OpenAI 호환 API</td></tr>
</tbody>
</table>
<p>사용자의 API 키는 로컬에서 암호화되며 Attu가 관리하는 서비스로 업로드되지 않습니다. 이러한 설계는 AI 지원을 원하지만 여전히 자격 증명, 데이터 흐름 및 제공업체 선택을 제어해야 하는 팀에게 중요합니다.</p>
<p>실제로 BYOL(Bring Your Own Model)을 통해 에이전트를 다양한 환경에서 사용할 수 있습니다. 한 팀은 OpenAI를 사용할 수 있고, 다른 팀은 Anthropic 모델을 사용할 수 있으며, 또 다른 팀은 OpenAI 호환 엔드포인트를 통해 라우팅할 수 있습니다. Attu는 특정 모델 제공업체를 강제하지 않습니다.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">데이터베이스 → 컬렉션 → 파티션 트리를 통해 Milvus 데이터 탐색<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0은 데이터 브라우저도 재설계했습니다. Attu 2.x는 주로 평면적인 컬렉션 목록을 제공했습니다. 클러스터에 여러 데이터베이스, 수십 개의 컬렉션, 그리고 파티션화된 데이터가 존재하게 되면 이러한 방식은 사용하기 어려워집니다.</p>
<p><strong>새로운 브라우저는 Milvus가 데이터를 구성하는 방식인 데이터베이스 → 컬렉션 → 파티션에 맞춰 계층 구조를 사용합니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: 재설계된 데이터 브라우저는 데이터베이스, 컬렉션, 파티션을 위한 계층적 탐색을 사용합니다</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">데이터 작업이 탐색 위치와 더 가까워졌습니다</h3><p>데이터 브라우저는 사용자가 이미 기대하는 기능을 유지하면서 UI에 직접 더 많은 작업을 추가했습니다:</p>
<ul>
<li>컬렉션을 다른 데이터베이스로 드래그 앤 드롭합니다.</li>
<li>임베딩 모델이 구성된 경우, 텍스트를 직접 입력하여 벡터 검색을 실행합니다.</li>
<li>유사도 점수를 확인하고 패싯을 사용하여 결과를 좁힐 수 있습니다.</li>
<li>CSV, JSON 및 Parquet 형식으로 데이터를 가져오고 내보낼 수 있습니다.</li>
<li>동적 필드 지원을 포함하여 컬렉션 스키마를 시각적으로 확인하고 편집할 수 있습니다.</li>
<li>파티션 및 파티션 통계를 생성, 삭제 및 확인합니다.</li>
<li>컬렉션의 전체 수명 주기(생성, 로드, 릴리스, 복사, 이름 변경, 데이터베이스 간 이동 및 삭제)를 관리할 수 있습니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: 벡터 검색 및 결과 확인 기능을 갖춘 Attu 3.0 데이터 브라우저</p>
<p>이러한 작업의 대부분은 마우스 오른쪽 버튼 메뉴나 작업 패널을 통해 사용할 수 있습니다. 일반적인 컬렉션 작업의 경우, 더 이상 UI 탐색과 명령줄 작업 사이를 오갈 필요가 없습니다.</p>
<p>또한 Attu 3.0은 스냅샷 및 nullable 벡터와 같은 새로운 <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a> 기능에 대한 UI 지원이 해당 기능이 성숙해짐에 따라 계속해서 추가될 제품 라인입니다.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">작업, 메트릭, 느린 쿼리, 토폴로지 및 백업을 한 곳에서 확인<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0은 콘솔에 더 많은 운영 정보를 제공합니다.</strong> '운영 및 모니터링(Ops and Monitoring)' 영역에는 클러스터 개요, 실시간 메트릭, 느린 쿼리 분석, 토폴로지, 백업 및 복원 기능이 포함됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: Attu 3.0 운영 및 모니터링 페이지</p>
<p>목표는 운영 팀이 이미 사용하고 있는 모든 가시성 시스템을 대체하는 것이 아닙니다. 팀은 여전히 Prometheus, Grafana, 로그, 알림 및 기존 모니터링 스택을 사용할 수 있습니다. 목표는 Attu 내부에서 Milvus와 관련된 일반적인 질문에 답할 수 있도록 하는 것입니다.</p>
<table>
<thead>
<tr><th>영역</th><th>가능한 작업</th></tr>
</thead>
<tbody>
<tr><td>시각적 클러스터 개요</td><td>Milvus 버전, 배포 모드, 노드 수, 데이터베이스 수, 컬렉션 수, 로드 상태 및 할당량 엔티티를 한눈에 확인합니다.</td></tr>
<tr><td>실시간 메트릭</td><td>QPS, 삽입/삭제 비율, 쿼리 지연 시간, 캐시 적중률 및 관련 Prometheus 기반 메트릭을 확인합니다.</td></tr>
<tr><td>느린 쿼리 분석</td><td>유형, 소요 시간, 컬렉션, 타임스탬프, 소스 및 관련 문제 해결 컨텍스트별로 느린 쿼리를 확인합니다.</td></tr>
<tr><td>토폴로지 보기</td><td>노드 토폴로지와 RootCoord, DataCoord, IndexCoord, QueryCoord, Proxy와 같은 구성 요소 간의 연결 관계를 파악할 수 있습니다.</td></tr>
<tr><td>백업 및 복원</td><td>S3, MinIO, GCS 또는 Azure에 대한 전체 또는 증분 백업을 생성하고, 백업 메타데이터를 ZIP 파일로 다운로드하거나 복원할 파일을 업로드할 수 있습니다.</td></tr>
</tbody>
</table>
<p>백업 및 복원은 이전에 CLI 사용에 의존하던 워크플로를 GUI로 이동시키기 때문에 특히 중요합니다. 이는 로컬 테스트, 스테이징 검증 및 보다 가시적인 복구 경로를 원하는 팀에 유용합니다.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">내장된 API 플레이그라운드를 사용하여 Milvus REST API 디버깅<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0에는 Milvus API 개발 및 디버깅을 위한 REST API 플레이그라운드가 추가되었습니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: Attu 3.0 API 플레이그라운드</p>
<p>플레이그라운드는 Milvus REST 엔드포인트를 카테고리별로 분류합니다. 데이터베이스와 컬렉션을 선택하면 Attu가 실행 컨텍스트를 자동으로 채워줍니다. 이후 한 번의 클릭으로 요청을 전송하고 응답을 실시간으로 확인할 수 있습니다.</p>
<p>이는 curl 명령어나 Postman 컬렉션을 설정하지 않고 API 호출을 테스트하고자 할 때 유용합니다. 또한 UI 컨텍스트와 요청 본문을 직접 오갈 수 있으므로, Milvus 기능이 REST API에 어떻게 매핑되는지 학습하는 데에도 유용합니다.</p>
<p>애플리케이션 개발자에게 API Playground는 디버깅 도구입니다. Milvus를 처음 사용하는 사용자에게는 학습 도구입니다. 플랫폼 팀에게는 작업을 스크립트나 애플리케이션 코드로 전환하기 전에 신속하게 검증할 수 있는 방법입니다.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">데이터베이스 또는 컬렉션 옆에서 RBAC 관리<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0은 UI에서 권한 워크플로우의 사용 경험을 변화시킵니다.</strong> <a href="https://milvus.io/docs/rbac.md">RBAC을</a> 별도의 관리 작업으로 취급하는 대신, 사용자가 이미 작업하고 있는 데이터베이스 및 컬렉션 탭과 더 가깝게 접근 제어를 통합합니다.</p>
<p>기본 모델은 여전히 Milvus RBAC(사용자, 역할, <a href="https://milvus.io/docs/grant_privileges.md">권한</a>, 부여 및 취소)입니다. Attu 3.0은 이 모델을 중심으로 한 운영 경로를 간소화합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이미지: Attu 3.0의 컨텍스트 기반 사용자 및 권한 관리</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">일반적인 범위에 대한 원클릭 사용자 생성</h3><p>Attu 2.x에서는 컬렉션에 대한 읽기 전용 액세스 권한을 부여하는 데 일반적으로 여러 단계가 필요했습니다. 사용자 생성, 역할 생성, 권한 구성, 사용자에게 역할 할당, 그리고 범위가 올바른지 확인하는 과정이었습니다.</p>
<p><strong>Attu 3.0에서는 컬렉션을 열고, '사용자(Users)' 탭으로 이동한 후 '사용자 생성(Create User)'을 클릭하고 '읽기 전용(ReadOnly)' 또는 '읽기/쓰기(ReadWrite)'를 선택하기만 하면 Attu가 나머지 워크플로를 완료합니다.</strong> Attu는 사용자를 생성하고, 안전한 비밀번호를 생성하며, 해당 범위에 맞는 역할을 생성하고, 권한 부여를 적용합니다.</p>
<p>데이터베이스 수준에서도 동일한 방식이 적용됩니다. 또한 한 번의 클릭으로 기존 사용자에게 현재 컬렉션에 대한 권한을 부여하거나 접근 권한을 취소할 수 있습니다.</p>
<p>이를 통해 권한 관리가 보호 대상 리소스와 밀접하게 연계됩니다. 팀원에게 범위 지정된 액세스 권한을 부여하기 위해 여러 관리 페이지를 오가거나 역할 명명 규칙을 기억할 필요가 없습니다.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">이번 베타 버전이 Attu 사용자에게 의미하는 바<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 베타는 Attu가 처음 출시된 이후 Milvus 관리 콘솔에 적용된 가장 큰 업데이트입니다.</strong> 이는 단순한 시각적 개선에 그치지 않습니다. Attu가 처리할 수 있는 범위를 변화시킵니다.</p>
<p>주요 개선점은 이제 Attu가 다수의 Milvus 사용자가 실제로 작업하는 방식에 부합한다는 점입니다. 즉, 다중 클러스터, 영구적인 로컬 설정, 더 많은 데이터 이동, 더 강화된 접근 제어, 더 많은 문제 해결, 그리고 도구 간 전환 없이 클러스터 동작을 이해해야 할 필요성이 증가한 환경을 지원합니다.</p>
<p>주요 기능은 다음과 같습니다:</p>
<ul>
<li>상태 지표 및 원클릭 전환 기능을 갖춘 다중 클러스터 관리.</li>
<li>클러스터 구성, 기본 설정, LLM 구성, 에이전트 기록 및 사용자 정의 스킬을 위한 영구적인 로컬 상태.</li>
<li>50개 이상의 Milvus 도구와 파괴적 작업에 대한 확인 게이트를 갖춘 내장 AI 에이전트.</li>
<li>클러스터 상태, 검색 성능, 데이터 쓰기, 구성 검토를 위한 4가지 내장 전문가 진단 기능.</li>
<li>데이터베이스 → 컬렉션 → 파티션 탐색 및 향상된 컬렉션 운영 기능을 갖춘 새롭게 설계된 데이터 브라우저.</li>
<li>내장된 Prometheus 메트릭, 느린 쿼리 분석, 토폴로지, 백업 및 복원 기능.</li>
<li>디버깅 및 Milvus API 학습을 위한 REST API 플레이그라운드.</li>
<li>별도의 관리자 흐름뿐만 아니라 데이터베이스나 컬렉션 내에서 직접 실행되는 RBAC 워크플로우.</li>
</ul>
<p>Attu를 로컬 Milvus 개발용으로만 사용하는 경우, 3.0 버전은 더 강력한 콘솔을 제공합니다. 여러 Milvus 환경을 관리하는 경우, 멀티 클러스터 및 지속적 상태 변경 기능만으로도 시도해 볼 가치가 충분합니다. 성능이나 권한 문제를 자주 디버깅하는 경우, 에이전트, 진단, 메트릭 및 인컨텍스트 RBAC 워크플로가 즉시 시간을 절약해 줄 것입니다.</p>
<h2 id="Get-Started" class="common-anchor-header">시작하기<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Docker로 Attu 3.0 베타를 사용해 보세요:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>다음으로 다음을 실행하세요:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>사이드바에서 Milvus 연결을 추가하고 새로운 콘솔을 탐색해 보세요.</p>
<p>데스크톱 앱을 선호하시나요? <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases에서</strong></a> 사용 중인 플랫폼용 빌드를 다운로드하세요. Attu 3.0 베타는 macOS, Linux 및 Windows용 데스크톱 패키지를 제공합니다. 최근 릴리스에는 Docker나 Electron 없이 Attu를 실행할 수 있는 독립형 Linux 서버 패키지도 포함되어 있습니다.</p>
<p><strong>질문이 있으신가요?</strong> 멀티 클러스터 설정, 사용자 정의 에이전트 스킬 또는 진단 시나리오에 대해 <a href="https://discord.gg/milvus"><strong>Milvus Discord에</strong></a> 문의하거나, <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours를</strong></a> 예약하여 커뮤니티와 함께 해결해 보세요.</p>
<p><strong>Milvus 인프라를 직접 운영하기 부담스러우신가요?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud는</strong></a> Milvus 개발진이 제공하는 완전 관리형 플랫폼입니다. Milvus API를 유지하면서 실시간 벡터 검색, 대규모 데이터 탐색 및 AI 데이터 운영을 위한 관리형 인프라를 추가합니다. 데이터 주권 요구 사항이 있는 팀을 위해, Zilliz Cloud <strong>BYOC는</strong> 귀사의 클라우드 계정 내에서 실행되므로 Zilliz가 운영을 처리하는 동안 데이터는 귀사의 VPC 내에 안전하게 보관됩니다.</p>
