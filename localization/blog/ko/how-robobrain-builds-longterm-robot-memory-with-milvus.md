---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: RoboBrain이 밀버스로 장기적인 로봇 메모리를 구축하는 방법
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  로봇 모듈은 단독으로 작동할 수 있지만 연쇄적으로 연결되면 실패합니다. 센키 AI의 CEO가 RoboBrain이 작업 상태, 피드백,
  Milvus 메모리를 사용하는 방법을 설명합니다.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>이 글은 로봇을 위한 작업 실행 인프라를 구축하는 구현형 AI 회사인 Senqi AI의 CEO인 송 지(Song Zhi)가 기고했습니다. RoboBrain은 센치 AI의 핵심 제품 중 하나입니다.</em></p>
<p>대부분의 로봇 기능은 자체적으로 잘 작동합니다. 내비게이션 모델은 경로를 계획할 수 있습니다. 인식 모델은 물체를 식별할 수 있습니다. 음성 모듈은 지시를 받아들일 수 있습니다. 이러한 기능이 하나의 연속적인 작업으로 실행되어야 할 때 생산 실패가 나타납니다.</p>
<p>로봇의 경우 "가서 저 구역을 확인하고 특이한 것이 있으면 촬영해서 알려줘"와 같은 간단한 명령도 작업을 시작하기 전에 계획하고, 실행하는 동안 적응하고, 완료되면 유용한 결과를 만들어야 합니다. 내비게이션이 장애물 앞에서 멈추거나, 흐릿한 사진을 최종 사진으로 받아들이거나, 시스템이 5분 전에 처리한 예외 사항을 잊어버리는 등 각 핸드오프가 중단될 수 있습니다.</p>
<p>이것이 바로 실제 세계에서 작동하는 <a href="https://zilliz.com/glossary/ai-agents">AI 에이전트의</a> 핵심 과제입니다. 디지털 에이전트와 달리 로봇은 막힌 경로, 변화하는 조명, 배터리 한계, 센서 노이즈, 작업자 규칙 등 지속적인 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터에</a> 대해 실행합니다.</p>
<p>RoboBrain은 로봇 작업 실행을 위한 센키 AI의 구현형 지능 운영 체제입니다. 작업 계층에 위치하여 인식, 계획, 실행 제어 및 데이터 피드백을 연결하여 자연어 명령이 구조화되고 복구 가능한 로봇 워크플로우가 될 수 있도록 합니다.</p>
<table>
<thead>
<tr><th>중단점</th><th>프로덕션에서 실패하는 것</th><th>RoboBrain이 이를 해결하는 방법</th></tr>
</thead>
<tbody>
<tr><td>작업 계획</td><td>모호한 명령은 구체적인 실행 필드 없이 다운스트림 모듈을 남깁니다.</td><td>작업 객체화는 의도를 공유 상태로 전환합니다.</td></tr>
<tr><td>컨텍스트 라우팅</td><td>올바른 정보가 존재하지만 잘못된 의사 결정 단계에 도달합니다.</td><td>계층화된 메모리는 실시간, 단기, 장기 컨텍스트를 개별적으로 라우팅합니다.</td></tr>
<tr><td>데이터 피드백</td><td>단일 패스가 다음 실행을 개선하지 않고 완료되거나 실패합니다.</td><td>피드백 쓰기는 작업 상태와 장기 메모리를 업데이트합니다.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">로봇 작업 실행의 세 가지 중단점<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>소프트웨어 작업은 종종 입력, 프로세스, 결과로 구분될 수 있습니다. 로봇 작업은 막힌 경로, 변화하는 조명, 배터리 한계, 센서 노이즈, 작업자 규칙 등 움직이는 물리적 상태에 대해 실행됩니다.</p>
<p>그렇기 때문에 작업 루프에는 고립된 모델 이상의 것이 필요합니다. 계획, 실행, 피드백 전반에 걸쳐 컨텍스트를 보존할 수 있는 방법이 필요합니다.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. 작업 계획: 모호한 지시는 모호한 실행을 낳습니다.</h3><p>"가서 살펴봐"와 같은 문구에는 많은 결정 사항이 숨겨져 있습니다. 어느 영역? 로봇이 무엇을 촬영해야 할까요? 무엇이 비정상적인 것으로 간주되는가? 촬영이 실패하면 어떻게 해야 할까요? 작업자에게 어떤 결과를 반환해야 할까요?</p>
<p>작업 레이어가 이러한 세부 사항을 대상 영역, 검사 대상, 완료 조건, 실패 정책 및 반환 형식과 같은 구체적인 필드로 해결할 수 없으면 작업은 처음부터 방향 없이 실행되며 컨텍스트를 다운스트림에서 복구하지 못합니다.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. 컨텍스트 라우팅: 올바른 데이터가 잘못된 단계에 도달</h3><p>로봇 스택에 이미 올바른 정보가 포함되어 있을 수 있지만 작업 실행은 올바른 단계에서 정보를 검색하는 데 달려 있습니다.</p>
<p>시작 단계에는 지도, 영역 정의, 작동 규칙이 필요합니다. 실행 중간에는 실시간 센서 상태가 필요합니다. 예외 처리에는 이전 배포에서 유사한 사례가 필요합니다. 이러한 소스가 혼재되어 있으면 시스템은 잘못된 컨텍스트에서 올바른 종류의 결정을 내립니다.</p>
<p>라우팅이 실패하면 시작은 영역 규칙 대신 오래된 경험을 가져오고, 예외 처리는 필요한 사례에 도달할 수 없으며, 실행 중 실행은 실시간 판독값 대신 어제 맵을 가져옵니다. 누군가에게 사전을 주는 것은 에세이를 쓰는 데 도움이 되지 않습니다. 데이터는 올바른 단계에서 올바른 형태로 올바른 의사 결정 지점에 도달해야 합니다.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. 데이터 피드백: 싱글 패스 실행은 개선되지 않습니다</h3><p>피드백이 없으면 로봇은 다음 작업을 개선하지 않고 실행을 완료할 수 있습니다. 완료된 작업은 여전히 품질 점검이 필요합니다. 이미지가 충분히 선명한가, 아니면 로봇이 다시 촬영해야 하는가? 경로가 여전히 깨끗한가, 아니면 우회해야 하는가? 배터리가 임계값을 초과했는가, 아니면 작업을 종료해야 하는가?</p>
<p>단일 패스 시스템에는 이러한 호출에 대한 메커니즘이 없습니다. 실행, 중지, 다음 번에 동일한 실패를 반복합니다.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">로봇 작업 루프를 닫는 RoboBrain의 방법<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain은 환경 이해, 작업 계획, 실행 제어, 데이터 피드백을 하나의 운영 루프에 연결합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>구현된 기능에 도달하기 전에 사용자 의도가 작업 개체, Milvus가 제공하는 단계 인식 메모리 및 정책 엔진을 통해 어떻게 흐르는지 보여주는 RoboBrain 핵심 미들웨어 아키텍처</span> </span></p>
<p>이 기고 글에서 설명한 아키텍처에서는 이 루프가 세 가지 메커니즘을 통해 구현됩니다:</p>
<ol>
<li><strong>작업 객체화는</strong> 진입점을 구조화합니다.</li>
<li><strong>계층화된 메모리는</strong> 올바른 정보를 올바른 단계로 라우팅합니다.</li>
<li><strong>피드백 루프는</strong> 결과를 다시 기록하고 다음 동작을 결정합니다.</li>
</ol>
<p>이 메커니즘은 하나의 세트로만 작동합니다. 다른 단계 없이 하나를 고치면 다음 단계에서 체인이 끊어집니다.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. 작업 객관화: 의도를 공유 상태로 전환하기</h3><p>실행이 시작되기 전에 RoboBrain은 각 명령어를 작업 유형, 대상 영역, 검사 대상, 제약 조건, 예상 출력, 현재 단계, 실패 정책 등 작업 개체로 변환합니다.</p>
<p>요점은 단순히 언어를 파싱하는 것이 아닙니다. 요점은 모든 다운스트림 모듈에 작업에 대한 동일한 상태 저장 보기를 제공하는 것입니다. 이러한 변환이 없으면 작업에 방향성이 없습니다.</p>
<p>순찰 예제에서 작업 개체는 검사 유형, 지정된 구역, 이상 항목을 검사 대상으로, 배터리 &gt;= 20%를 제약 조건으로, 명확한 이상 사진과 작업자 경고를 예상 출력으로, 기지로 복귀를 실패 정책으로 채웁니다.</p>
<p>실행이 변경되면 스테이지 필드가 업데이트됩니다. 장애물이 있으면 작업이 탐색에서 우회 또는 도움 요청으로 이동합니다. 이미지가 흐릿하면 검사에서 재촬영으로 이동합니다. 배터리 부족은 종료 및 기본 복귀로 이동합니다.</p>
<p>다운스트림 모듈은 더 이상 고립된 명령을 수신하지 않습니다. 현재 작업 단계, 제약 조건 및 단계가 변경된 이유를 수신합니다.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. 계층형 메모리: 올바른 단계로 컨텍스트 라우팅</h3><p>RoboBrain은 작업 관련 정보를 세 가지 계층으로 분할하여 올바른 데이터가 올바른 단계에 도달하도록 합니다.</p>
<p><strong>실시간 상태에는</strong> 포즈, 배터리, 센서 판독값, 환경 관찰 정보가 포함됩니다. 모든 제어 단계에서 의사 결정을 지원합니다.</p>
<p><strong>단기 컨텍스트는</strong> 로봇이 2분 전에 피한 장애물, 다시 촬영한 사진, 첫 번째 시도에서 열지 못한 문 등 현재 작업 내의 이벤트를 기록합니다. 이는 시스템이 방금 일어난 일을 놓치지 않도록 도와줍니다.</p>
<p><strong>장기 시맨틱 메모리는</strong> 장면 지식, 과거 경험, 예외 사례, 작업 후 쓰기백을 저장합니다. 특정 주차 구역은 반사되는 표면 때문에 야간에 카메라 각도를 조정해야 할 수 있습니다. 특정 이상 징후 유형은 오탐 이력이 있을 수 있으며 자동 경보 대신 사람이 검토해야 합니다.</p>
<p>올바른 메모리를 검색한다는 것은 ID나 키워드가 아닌 의미에 따라 일치하는 것을 의미하기 때문에 이 장기 계층은 <a href="https://milvus.io/">Milvus 벡터 데이터베이스를</a> 통한 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 유사성 검색으로</a> 실행됩니다. 장면 설명과 처리 레코드는 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩으로</a> 저장되고 가장 가까운 의미적 일치를 찾기 위해 <a href="https://zilliz.com/glossary/anns">근사 근사 이웃 검색으로</a> 검색됩니다.</p>
<p>시작은 장기기억에서 영역 규칙과 과거 순찰 요약을 가져옵니다. 실행 중간에는 실시간 상태와 단기 컨텍스트에 의존합니다. 예외 처리는 <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색을</a> 사용하여 장기 메모리에서 유사한 사례를 찾습니다.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. 피드백 루프: 시스템으로 결과 다시 쓰기</h3><p>RoboBrain은 각 단계가 끝난 후 탐색, 인식 및 작업 결과를 작업 개체에 다시 기록하여 스테이지 필드를 업데이트합니다. 시스템은 이러한 관찰 결과를 읽고 경로에 도달할 수 없는 경우 우회, 이미지가 흐릿한 경우 재촬영, 문이 열리지 않는 경우 재시도, 배터리가 부족한 경우 종료 등 다음 동작을 결정합니다.</p>
<p>실행, 관찰, 조정, 재실행의 사이클이 반복됩니다. 체인은 예상치 못한 상황이 처음 나타났을 때 끊어지지 않고 환경 변화에 계속 적응합니다.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Milvus가 RoboBrain의 장기적인 로봇 메모리를 지원하는 방법<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>일부 로봇 메모리는 작업 ID, 타임스탬프 또는 세션 메타데이터로 쿼리할 수 있습니다. 하지만 장기간의 운영 경험은 일반적으로 불가능합니다.</p>
<p>유용한 기록은 작업 ID, 위치 이름 또는 문구가 다르더라도 현재 장면과 의미적으로 유사한 경우인 경우가 많습니다. 이는 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스의</a> 문제이며, Milvus는 장기 기억 계층에 적합합니다.</p>
<p>이 계층에는 다음과 같은 정보가 저장됩니다:</p>
<ul>
<li>영역 규칙 설명 및 지점 위치 의미</li>
<li>이상 징후 유형 정의 및 예제 요약</li>
<li>과거 처리 기록 및 작업 후 검토 결론</li>
<li>작업 완료 시 작성된 순찰 요약</li>
<li>사람 인수인계 후 경험 쓰기백</li>
<li>유사한 시나리오의 실패 원인 및 수정 전략</li>
</ul>
<p>이 중 어느 것도 구조화된 필드에 자연스럽게 키가 지정되는 것은 없습니다. 모든 것을 의미별로 기억해야 합니다.</p>
<p>구체적인 예로 로봇이 야간에 주차장 입구를 순찰한다고 가정해 보겠습니다. 오버헤드 라이트의 눈부심으로 인해 이상 징후 감지가 불안정합니다. 반사가 계속 이상 징후로 플래그가 지정됩니다.</p>
<p>시스템은 강한 야간 눈부심, 유사한 영역에서 카메라 각도 보정, 이전에 감지한 것을 오탐으로 표시한 사람이 검토한 결론에서 효과가 있었던 재촬영 전략을 기억해내야 합니다. 정확히 일치하는 쿼리는 알려진 작업 ID 또는 시간 창을 찾을 수 있습니다. 해당 관계에 이미 레이블이 지정되어 있지 않으면 '이번과 같은 행동을 한 이전 눈부심 사례'를 안정적으로 표시할 수 없습니다.</p>
<p>의미론적 유사성이 작동하는 검색 패턴입니다. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">유사성 메트릭은</a> 관련성별로 저장된 메모리의 순위를 매기는 반면, <a href="https://milvus.io/docs/filtered-search.md">메타데이터 필터링은</a> 영역, 작업 유형 또는 시간대별로 검색 공간을 좁힐 수 있습니다. 실제로는 의미에 대해서는 시맨틱 매칭을, 운영상의 제약에 대해서는 구조화된 필터를 사용하는 <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">하이브리드 검색이</a> 되는 경우가 많습니다.</p>
<p>구현 시, 필터 계층은 종종 시맨틱 메모리가 작동하는 곳입니다. <a href="https://milvus.io/docs/boolean.md">Milvus 필터 표현식은</a> 스칼라 제약 조건을 정의하는 반면, <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">Milvus 스칼라 쿼리는</a> 시스템에서 유사성이 아닌 메타데이터에 의한 레코드가 필요할 때 정확한 조회를 지원합니다.</p>
<p>이 검색 패턴은 텍스트 생성보다는 실제 세계의 의사 결정에 적합한 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성과</a> 유사합니다. 로봇은 질문에 답하기 위해 문서를 검색하는 것이 아니라, 다음 안전한 조치를 선택하기 위해 이전 경험을 검색합니다.</p>
<p>모든 것이 Milvus에 입력되는 것은 아닙니다. 작업 ID, 타임스탬프, 세션 메타데이터는 관계형 데이터베이스에 저장됩니다. 원시 런타임 로그는 로깅 시스템에 저장됩니다. 각 스토리지 시스템은 구축된 쿼리 패턴을 처리합니다.</p>
<table>
<thead>
<tr><th>데이터 유형</th><th>저장 위치</th><th>쿼리 방법</th></tr>
</thead>
<tbody>
<tr><td>작업 ID, 타임스탬프, 세션 메타데이터</td><td>관계형 데이터베이스</td><td>정확한 조회, 조인</td></tr>
<tr><td>원시 런타임 로그 및 이벤트 스트림</td><td>로깅 시스템</td><td>전체 텍스트 검색, 시간 범위 필터</td></tr>
<tr><td>씬 규칙, 사례 처리, 경험 쓰기백</td><td>Milvus</td><td>의미별 벡터 유사성 검색</td></tr>
</tbody>
</table>
<p>작업이 실행되고 장면이 축적됨에 따라 장기 메모리 계층은 모델 미세 조정을 위한 샘플 큐레이션, 광범위한 데이터 분석, 배포 간 지식 전달 등 다운스트림 프로세스에 정보를 제공합니다. 이 메모리는 데이터 자산으로 통합되어 향후 모든 배포에 더 높은 출발점을 제공합니다.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">이 아키텍처가 배포에 미치는 변화<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>작업 객체화, 계층화된 메모리, 피드백 루프는 RoboBrain의 작업 루프를 배포 패턴으로 전환하여 각 작업이 상태를 보존하고 각 예외가 이전 경험을 검색할 수 있으며 각 실행이 다음 작업을 개선할 수 있도록 합니다.</p>
<p>새 건물을 순찰하는 로봇이 이미 다른 곳에서 유사한 조명, 장애물, 이상 유형 또는 운영자 규칙을 처리한 적이 있다면 처음부터 다시 시작해서는 안 됩니다. 이를 통해 여러 장면에서 로봇 작업 실행을 더 반복할 수 있고 장기적인 배포 비용을 더 쉽게 제어할 수 있습니다.</p>
<p>로봇 팀에게 더 중요한 교훈은 메모리가 단순한 스토리지 계층이 아니라는 점입니다. 메모리는 실행 제어의 일부입니다. 시스템은 현재 수행 중인 작업, 방금 변경된 사항, 이전에 발생한 유사한 사례, 다음 실행을 위해 다시 기록해야 할 내용을 알아야 합니다.</p>
<h2 id="Further-Reading" class="common-anchor-header">추가 자료<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>로봇 메모리, 작업 실행 또는 구현된 AI의 시맨틱 검색과 관련된 유사한 문제를 해결하고 있다면 다음 단계에 유용한 리소스를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs">Milvus 설명서를</a> 읽거나 <a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작을</a> 사용해 벡터 검색이 실제로 어떻게 작동하는지 알아보세요.</li>
<li>프로덕션 메모리 계층을 계획하고 있다면 <a href="https://milvus.io/docs/architecture_overview.md">Milvus 아키텍처 개요를</a> 검토하세요.</li>
<li>프로덕션 시스템에서의 시맨틱 검색에 대한 더 많은 예시는 <a href="https://zilliz.com/vector-database-use-cases">벡터 데이터베이스 사용 사례에서</a> 찾아보세요.</li>
<li><a href="https://milvus.io/community">Milvus 커뮤니티에</a> 가입하여 질문하고 구축 중인 것을 공유하세요.</li>
<li>자체 인프라를 운영하는 대신 Milvus를 관리하고 싶으시다면 <a href="https://zilliz.com/cloud">Zilliz Cloud에</a> 대해 자세히 알아보세요.</li>
</ul>
