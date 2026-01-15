---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: 'ChatGPT와 클로드의 메모리 시스템에 대한 고찰: 온디맨드 대화 검색을 구현하기 위해 필요한 사항'
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  ChatGPT와 Claude가 메모리를 어떻게 다르게 설계하는지, 온디맨드 대화 검색이 어려운 이유와 Milvus 2.6이 프로덕션 규모에서
  어떻게 이를 지원하는지 살펴보세요.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>고품질 AI 에이전트 시스템에서 메모리 설계는 생각보다 훨씬 더 복잡합니다. 그 핵심은 세 가지 근본적인 질문에 답해야 합니다: 대화 기록을 어떻게 저장해야 하는가? 과거 컨텍스트는 언제 검색해야 하는가? 그리고 정확히 무엇을 검색해야 할까요?</p>
<p>이러한 선택은 상담원의 응답 대기 시간, 리소스 사용량, 그리고 궁극적으로 상담원의 역량 한도에 직접적인 영향을 미칩니다.</p>
<p>ChatGPT 및 Claude와 같은 모델은 사용하면 할수록 점점 더 '메모리 인식'이 향상됩니다. 선호도를 기억하고, 장기적인 목표에 적응하며, 세션 전반에서 연속성을 유지합니다. 그런 의미에서 이들은 이미 미니 AI 에이전트 역할을 하고 있습니다. 하지만 표면적으로 드러나지 않는 메모리 시스템은 매우 다른 아키텍처 가정을 기반으로 구축되어 있습니다.</p>
<p>최근 <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT와</a> <a href="https://manthanguptaa.in/posts/claude_memory/">Claude의 메모리 메커니즘을</a> 리버스 엔지니어링으로 분석해 보면 뚜렷한 차이를 발견할 수 있습니다. <strong>ChatGPT는</strong> 사전 계산된 컨텍스트 주입과 계층화된 캐싱에 의존하여 가볍고 예측 가능한 연속성을 제공합니다. 반면 <strong>Claude는</strong> 메모리 깊이와 효율성의 균형을 맞추기 위해 동적 메모리 업데이트와 함께 RAG 스타일의 온디맨드 검색을 채택합니다.</p>
<p>이 두 가지 접근 방식은 단순한 설계 환경 설정이 아니라 인프라 기능에 따라 결정됩니다. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6은</strong></a> 온디맨드 대화형 메모리에 필요한 하이브리드 고밀도-희소 검색, 효율적인 스칼라 필터링, 계층형 스토리지의 조합을 도입하여 실제 시스템에 배포할 수 있을 만큼 빠르고 경제적인 선택적 검색을 구현합니다.</p>
<p>이 포스팅에서는 ChatGPT와 Claude의 메모리 시스템이 실제로 어떻게 작동하는지, 왜 아키텍처적으로 다른지, 그리고 Milvus와 같은 최근의 시스템 발전이 어떻게 온디맨드 대화형 검색을 대규모로 실용적으로 만드는지 살펴보고자 합니다.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">ChatGPT의 메모리 시스템<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>ChatGPT는 벡터 데이터베이스를 쿼리하거나 추론 시점에 과거 대화를 동적으로 검색하는 대신 고정된 컨텍스트 구성 요소 세트를 조립하여 모든 프롬프트에 직접 주입함으로써 '메모리'를 구축합니다. 각 구성 요소는 미리 준비되어 프롬프트에서 알려진 위치를 차지합니다.</p>
<p>이러한 설계는 개인화 및 대화의 연속성을 그대로 유지하면서 지연 시간, 토큰 사용 및 시스템 동작을 보다 예측 가능하게 만듭니다. 즉, 메모리는 모델이 즉석에서 검색하는 것이 아니라 시스템이 응답을 생성할 때마다 패키징하여 모델에 전달하는 것입니다.</p>
<p>높은 수준에서 전체 ChatGPT 프롬프트는 가장 글로벌한 것부터 가장 즉각적인 것 순으로 다음과 같은 계층으로 구성됩니다:</p>
<p>[0] 시스템 지침</p>
<p>[1] 개발자 지침</p>
<p>[2] 세션 메타데이터(임시)</p>
<p>[3] 사용자 메모리(장기적인 사실)</p>
<p>[4] 최근 대화 요약(지난 대화, 제목 + 스니펫)</p>
<p>[5] 현재 세션 메시지 (이 대화)</p>
<p>[6] 최근 메시지</p>
<p>이 중 [2] ~ [5] 구성요소는 시스템의 유효 메모리를 형성하며, 각각 고유한 역할을 수행합니다.</p>
<h3 id="Session-Metadata" class="common-anchor-header">세션 메타데이터</h3><p>세션 메타데이터는 대화가 시작될 때 한 번만 삽입되고 세션이 종료되면 삭제되는 수명이 짧고 영구적이지 않은 정보를 나타냅니다. 이 계층의 역할은 장기적으로 행동을 개인화하기보다는 모델이 현재 사용 컨텍스트에 적응하도록 돕는 것입니다.</p>
<p>이 계층은 사용자의 즉각적인 환경과 최근 사용 패턴에 대한 신호를 캡처합니다. 일반적인 신호는 다음과 같습니다:</p>
<ul>
<li><p><strong>디바이스 정보</strong> - 예를 들어 사용자가 모바일을 사용하는지 데스크톱을 사용하는지 여부</p></li>
<li><p><strong>계정 속성</strong> - 구독 티어(예: ChatGPT Go), 계정 연령, 전반적인 사용 빈도 등</p></li>
<li><p><strong>행동 지표</strong> - 지난 1일, 7일, 30일 동안의 활동 일수, 평균 대화 길이, 모델 사용 분포(예: GPT-5가 처리한 요청의 49%) 등</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">사용자 메모리</h3><p>사용자 메모리는 대화 전반에 걸쳐 개인화를 가능하게 하는 영구적이고 편집 가능한 메모리 계층입니다. 사용자 메모리는 사용자의 이름, 역할 또는 경력 목표, 진행 중인 프로젝트, 과거 결과, 학습 선호도 등 비교적 안정적인 정보를 저장하며, 시간이 지나도 연속성을 유지하기 위해 각각의 새 대화에 주입됩니다.</p>
<p>이 메모리는 두 가지 방법으로 업데이트할 수 있습니다:</p>
<ul>
<li><p><strong>명시적 업데이트는</strong> 사용자가 "이것을 기억해 두세요" 또는 "이것을 메모리에서 제거하세요"와 같은 명령어를 사용하여 메모리를 직접 관리할 때 발생합니다.</p></li>
<li><p><strong>암시적 업데이트는</strong> 시스템이 확인된 이름이나 직책과 같이 OpenAI의 저장 기준을 충족하는 정보를 식별하여 사용자의 기본 동의 및 메모리 설정에 따라 자동으로 저장할 때 발생합니다.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">최근 대화 요약</h3><p>최근 대화 요약은 전체 채팅 기록을 재생하거나 검색하지 않고도 연속성을 유지하는 가벼운 크로스 세션 컨텍스트 레이어입니다. 기존의 RAG 기반 접근 방식에서처럼 동적 검색에 의존하는 대신, 이 요약은 미리 계산되어 모든 새 대화에 직접 삽입됩니다.</p>
<p>이 계층은 어시스턴트 답글을 제외한 사용자 메시지만 요약합니다. 이 계층은 의도적으로 크기가 제한되어 있으며(일반적으로 15개 내외), 자세한 내용보다는 최근 관심사에 대한 개략적인 신호만 유지합니다. 임베딩이나 유사성 검색에 의존하지 않기 때문에 지연 시간과 토큰 소비를 모두 낮게 유지합니다.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">현재 세션 메시지</h3><p>현재 세션 메시지에는 진행 중인 대화의 전체 메시지 내역이 포함되어 있으며 일관성 있는 차례별 응답에 필요한 단기적인 컨텍스트를 제공합니다. 이 계층에는 사용자 입력과 어시스턴트 응답이 모두 포함되지만 세션이 활성 상태로 유지되는 동안에만 포함됩니다.</p>
<p>이 모델은 고정된 토큰 한도 내에서 작동하기 때문에 이 기록은 무한정 늘어날 수 없습니다. 한도에 도달하면 시스템은 가장 최근의 메시지를 삭제하여 새로운 메시지를 위한 공간을 확보합니다. 이러한 삭제는 현재 세션에만 영향을 미치며, 장기 사용자 메모리와 최근 대화 요약은 그대로 유지됩니다.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">클로드의 메모리 시스템<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude는 메모리 관리에 대해 다른 접근 방식을 취합니다. ChatGPT처럼 모든 프롬프트에 고정된 대규모 메모리 구성 요소를 주입하는 대신, 클로드는 영구 사용자 메모리와 온디맨드 도구 및 선택적 검색을 결합합니다. 과거 컨텍스트는 모델이 관련성이 있다고 판단할 때만 가져오기 때문에 시스템은 컨텍스트 깊이와 계산 비용의 균형을 맞출 수 있습니다.</p>
<p>Claude의 프롬프트 컨텍스트는 다음과 같이 구조화되어 있습니다:</p>
<p>[0] 시스템 프롬프트(정적 지침)</p>
<p>[1] 사용자 기억</p>
<p>[2] 대화 기록</p>
<p>[3] 현재 메시지</p>
<p>Claude와 ChatGPT의 주요 차이점은 <strong>대화 기록을 검색하는 방식과</strong> <strong>사용자 메모리를 업데이트 및 유지하는 방식에</strong> 있습니다.</p>
<h3 id="User-Memories" class="common-anchor-header">사용자 메모리</h3><p>클로드에서 사용자 메모리는 ChatGPT의 사용자 메모리와 목적이 비슷하지만, 자동 백그라운드 기반 업데이트에 더 중점을 둔 장기적인 컨텍스트 계층을 형성합니다. 이러한 메모리는 구조화된 형식(XML 스타일 태그로 래핑)으로 저장되며 최소한의 사용자 개입으로 시간이 지남에 따라 점진적으로 진화하도록 설계되었습니다.</p>
<p>Claude는 두 가지 업데이트 경로를 지원합니다:</p>
<ul>
<li><p>암시적<strong>업데이트</strong> - 시스템이 주기적으로 대화 내용을 분석하여 백그라운드에서 메모리를 업데이트합니다. 이러한 업데이트는 실시간으로 적용되지 않으며, 삭제된 대화와 관련된 메모리는 지속적인 최적화의 일환으로 점진적으로 정리됩니다.</p></li>
<li><p><strong>명시적 업데이트</strong> - 사용자는 전용 <code translate="no">memory_user_edits</code> 도구를 통해 실행되는 "이걸 기억해" 또는 "이걸 삭제해" 등의 명령을 통해 메모리를 직접 관리할 수 있습니다.</p></li>
</ul>
<p>ChatGPT와 비교했을 때, Claude는 시스템 자체에 장기 메모리를 개선, 업데이트, 정리할 수 있는 더 큰 책임을 부여합니다. 따라서 사용자가 저장된 내용을 적극적으로 큐레이션할 필요가 줄어듭니다.</p>
<h3 id="Conversation-History" class="common-anchor-header">대화 기록</h3><p>대화 기록의 경우, Claude는 모든 프롬프트에 주입되는 고정된 요약에 의존하지 않습니다. 대신, 세 가지 다른 메커니즘을 사용하여 모델이 필요하다고 판단할 때만 과거 컨텍스트를 검색합니다. 이렇게 하면 관련 없는 기록이 전달되는 것을 방지하고 토큰 사용을 통제할 수 있습니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>컴포넌트</strong></th><th style="text-align:center"><strong>목적</strong></th><th style="text-align:center"><strong>사용 방법</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>롤링 윈도우(현재 대화)</strong></td><td style="text-align:center">ChatGPT의 세션 컨텍스트와 유사하게 현재 대화의 전체 메시지 내역(요약이 아님)을 저장합니다.</td><td style="text-align:center">자동으로 삽입됩니다. 토큰 한도는 ~190K이며, 한도에 도달하면 오래된 메시지는 삭제됩니다.</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>도구</strong></td><td style="text-align:center">주제 또는 키워드로 과거 대화를 검색하여 대화 링크, 제목, 사용자/어시스턴트 메시지 발췌문을 반환합니다.</td><td style="text-align:center">모델이 과거 세부 정보가 필요하다고 판단할 때 트리거됩니다. 매개변수에는 <code translate="no">query</code> (검색어) 및 <code translate="no">max_results</code> (1~10)이 포함됩니다.</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>도구</strong></td><td style="text-align:center">지정된 시간 범위(예: "지난 3일") 내의 최근 대화를 검색하며, 결과는 다음과 같은 형식으로 표시됩니다. <code translate="no">conversation_search</code></td><td style="text-align:center">최근의 시간 범위 컨텍스트가 관련성이 있을 때 트리거됩니다. 매개 변수에는 <code translate="no">n</code> (결과 수), <code translate="no">sort_order</code> 및 시간 범위가 포함됩니다.</td></tr>
</tbody>
</table>
<p>이러한 구성 요소 중 특히 주목할 만한 것은 <code translate="no">conversation_search</code> 입니다. 느슨하게 표현되거나 다국어 쿼리에 대해서도 관련성 있는 결과를 표시할 수 있으며, 이는 단순한 키워드 매칭에 의존하지 않고 의미론적 수준에서 작동한다는 것을 나타냅니다. 여기에는 임베딩 기반 검색 또는 쿼리를 먼저 표준 형식으로 번역하거나 정규화한 다음 키워드 또는 하이브리드 검색을 적용하는 하이브리드 접근 방식이 포함될 가능성이 높습니다.</p>
<p>전반적으로 Claude의 온디맨드 검색 방식에는 몇 가지 주목할 만한 강점이 있습니다:</p>
<ul>
<li><p><strong>검색은 자동으로 이루어지지</strong> 않습니다: 도구 호출은 모델의 자체 판단에 의해 트리거됩니다. 예를 들어 사용자가 <em>"지난번에 논의했던 프로젝트"</em> 를 언급하면 Claude는 <code translate="no">conversation_search</code> 을 호출하여 관련 컨텍스트를 검색할 수 있습니다.</p></li>
<li><p><strong>필요할 때 더 풍부한 컨텍스트 제공</strong> 검색된 결과에는 <strong>어시스턴트 응답 발췌문이</strong> 포함될 수 있지만 ChatGPT의 요약은 사용자 메시지만 캡처합니다. 따라서 더 깊고 정확한 대화 컨텍스트가 필요한 사용 사례에 Claude가 더 적합합니다.</p></li>
<li><p><strong>기본적으로 더 나은 효율성</strong>: 기록 컨텍스트는 필요하지 않는 한 주입되지 않으므로, 시스템은 관련 없는 대량의 기록을 전달하지 않으므로 불필요한 토큰 소비를 줄입니다.</p></li>
</ul>
<p>장단점도 똑같이 명확합니다. 온디맨드 검색을 도입하면 인덱스를 구축 및 유지하고, 쿼리를 실행하고, 결과를 순위를 매기고, 때로는 순위를 다시 지정해야 하는 등 시스템 복잡성이 증가합니다. 엔드투엔드 지연 시간도 사전 계산되고 항상 삽입된 컨텍스트에 비해 예측 가능성이 떨어집니다. 또한 모델은 검색이 필요한 시점을 결정하는 방법을 학습해야 합니다. 이러한 판단이 실패하면 관련 컨텍스트를 전혀 가져오지 못할 수도 있습니다.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">클로드식 온디맨드 검색의 제약 조건<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>온디맨드 검색 모델을 채택하면 벡터 데이터베이스가 아키텍처의 중요한 부분이 됩니다. 대화 검색은 스토리지와 쿼리 실행에 대한 요구가 매우 높으며, 시스템은 동시에 네 가지 제약 조건을 충족해야 합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. 낮은 지연 시간 허용 오차</h3><p>대화형 시스템에서 P99 지연 시간은 일반적으로 ~20ms 미만으로 유지되어야 합니다. 그 이상의 지연은 사용자에게 즉시 눈에 띄게 됩니다. 따라서 비효율성이 발생할 여지가 거의 없으며, 벡터 검색, 메타데이터 필터링, 결과 랭킹을 모두 신중하게 최적화해야 합니다. 어느 한 지점에서 병목 현상이 발생하면 전체 대화 환경이 저하될 수 있습니다.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. 하이브리드 검색 요구 사항</h3><p>사용자 쿼리는 종종 여러 차원에 걸쳐 있습니다. <em>"지난 주에 있었던 RAG에 대한 토론"</em> 과 같은 요청은 의미론적 관련성과 시간 기반 필터링을 결합합니다. 데이터베이스가 벡터 검색만 지원하는 경우, 의미적으로 유사한 1,000개의 결과를 반환할 수 있지만 애플리케이션 계층 필터링을 통해 이를 소수로 줄이면 대부분의 계산이 낭비됩니다. 실용적이려면 데이터베이스가 기본적으로 벡터와 스칼라 쿼리를 결합하여 지원해야 합니다.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. 저장-계산 분리</h3><p>대화 기록은 명확한 핫-콜드 액세스 패턴을 보입니다. 최근 대화는 자주 쿼리되는 반면, 오래된 대화는 거의 건드리지 않습니다. 모든 벡터를 메모리에 보관해야 한다면 수천만 건의 대화를 저장하는 데 수백 기가바이트의 RAM이 소모될 것이며, 이는 규모 면에서 비현실적인 비용입니다. 시스템이 실행 가능하려면 핫 데이터는 메모리에, 콜드 데이터는 오브젝트 스토리지에 보관하고 벡터는 필요에 따라 로드하는 스토리지-컴퓨팅 분리를 지원해야 합니다.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. 다양한 쿼리 패턴</h3><p>대화 검색은 단일 액세스 패턴을 따르지 않습니다. 어떤 쿼리는 순전히 시맨틱(예: <em>"우리가 논의한 성능 최적화")</em>이고, 어떤 쿼리는 순전히 시간적(<em>"지난 주에 있었던 모든 대화")</em>이며, 많은 쿼리는 여러 제약 조건을 결합합니다(<em>"지난 3개월 동안 FastAPI를 언급한 Python 관련 토론")</em>. 데이터베이스 쿼리 플래너는 일률적인 무차별 대입 검색에 의존하지 않고 다양한 쿼리 유형에 맞게 실행 전략을 조정해야 합니다.</p>
<p>이 네 가지 과제는 함께 대화형 검색의 핵심적인 제약 조건을 정의합니다. 클로드 스타일의 온디맨드 검색을 구현하려는 모든 시스템은 이 모든 문제를 조화롭게 해결해야 합니다.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Milvus 2.6이 대화형 검색에 적합한 이유<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6의</a> 디자인 선택은 온디맨드 대화형 검색의 핵심 요구사항과 밀접하게 맞닿아 있습니다. 다음은 주요 기능에 대한 분석과 실제 대화형 검색 요구사항에 어떻게 매핑되는지 설명합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">고밀도 및 희소 벡터를 사용한 하이브리드 검색</h3><p>Milvus 2.6은 기본적으로 동일한 컬렉션 내에 고밀도 및 희소 벡터를 저장하고 쿼리 시점에 결과를 자동으로 융합하는 기능을 지원합니다. 밀도 벡터(예: BGE-M3와 같은 모델에서 생성된 768차원 임베딩)는 의미적 유사성을 포착하는 반면, 스파스 벡터(일반적으로 BM25에서 생성)는 정확한 키워드 신호를 보존합니다.</p>
<p><em>"지난 주에 있었던 RAG에 대한 토론"</em> 과 같은 쿼리의 경우, Milvus는 시맨틱 검색과 키워드 검색을 동시에 실행한 다음 재랭킹을 통해 결과를 병합합니다. 이 하이브리드 전략은 두 가지 접근 방식 중 하나만 사용하는 것과 비교했을 때 실제 대화 시나리오에서 훨씬 더 높은 회상률을 제공합니다.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">스토리지-컴퓨팅 분리 및 쿼리 최적화</h3><p>Milvus 2.6은 두 가지 방식으로 계층형 스토리지를 지원합니다:</p>
<ul>
<li><p>메모리의 핫 데이터, 오브젝트 스토리지의 콜드 데이터</p></li>
<li><p>메모리의 인덱스, 오브젝트 스토리지의 원시 벡터 데이터</p></li>
</ul>
<p>이 설계를 사용하면 약 2GB의 메모리와 8GB의 오브젝트 스토리지로 100만 개의 대화 항목을 저장할 수 있습니다. 적절한 튜닝을 통해 스토리지-컴퓨팅 분리를 활성화한 상태에서도 P99 지연 시간을 20ms 미만으로 유지할 수 있습니다.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">JSON 파쇄 및 빠른 스칼라 필터링</h3><p>Milvus 2.6은 기본적으로 JSON 파쇄를 활성화하여 중첩된 JSON 필드를 컬럼형 스토리지로 평탄화합니다. 이를 통해 공식 벤치마크에 따르면 스칼라 필터링 성능이 3~5배 향상됩니다(실제 성능 향상은 쿼리 패턴에 따라 다름).</p>
<p>대화형 검색에서는 사용자 ID, 세션 ID 또는 시간 범위와 같은 메타데이터를 기준으로 필터링해야 하는 경우가 많습니다. JSON 파쇄를 사용하면 <em>"지난 주 사용자 A의 모든 대화"</em> 와 같은 쿼리를 전체 JSON 블롭을 반복적으로 파싱하지 않고도 열 인덱스에서 바로 실행할 수 있습니다.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">오픈 소스 제어 및 운영 유연성</h3><p>오픈 소스 시스템인 Milvus는 폐쇄적인 블랙박스 솔루션이 제공하지 못하는 수준의 아키텍처 및 운영 제어 기능을 제공합니다. 팀은 인덱스 매개변수를 조정하고, 데이터 계층화 전략을 적용하고, 워크로드에 맞게 분산 배포를 사용자 정의할 수 있습니다.</p>
<p>이러한 유연성 덕분에 진입 장벽이 낮아져 중소규모 팀도 대규모 인프라 예산에 의존하지 않고도 수백만에서 수천만 건 규모의 대화 검색 시스템을 구축할 수 있습니다.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">ChatGPT와 Claude가 서로 다른 길을 택한 이유<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>크게 보면 ChatGPT와 Claude의 메모리 시스템의 차이는 망각을 처리하는 방식에 있습니다. ChatGPT는 사전 예방적 망각을 선호합니다. 메모리가 정해진 한도를 초과하면 이전 컨텍스트가 삭제됩니다. 이는 단순성과 예측 가능한 시스템 동작을 위해 완전성을 희생합니다. Claude는 지연된 망각을 선호합니다. 이론적으로 대화 기록은 무제한으로 늘어날 수 있으며, 리콜은 온디맨드 검색 시스템에 위임할 수 있습니다.</p>
<p>그렇다면 두 시스템이 서로 다른 경로를 선택한 이유는 무엇일까요? 위에서 설명한 기술적 제약을 고려하면 그 답은 명확해집니다. <strong>각 아키텍처는 기본 인프라가 이를 지원할 수 있는 경우에만 실행 가능합니다</strong>.</p>
<p>2020년에 클로드의 접근 방식을 시도했다면 비현실적이었을 가능성이 높습니다. 당시에는 벡터 데이터베이스에 수백 밀리초의 지연 시간이 발생하는 경우가 많았고, 하이브리드 쿼리가 제대로 지원되지 않았으며, 데이터가 증가함에 따라 리소스 사용량이 엄청나게 증가했습니다. 이러한 조건에서 온디맨드 검색은 과도한 엔지니어링으로 치부되었을 것입니다.</p>
<p>하지만 2025년에는 상황이 바뀌었습니다. <strong>Milvus 2.6과</strong>같은 시스템이 주도하는 인프라의 발전으로 스토리지-컴퓨팅 분리, 쿼리 최적화, 고밀도-저밀도 하이브리드 검색, JSON 파쇄가 프로덕션 환경에서 실현 가능해졌습니다. 이러한 발전은 지연 시간을 줄이고, 비용을 제어하며, 선택적 검색을 대규모로 실용화할 수 있게 해줍니다. 그 결과, 온디맨드 도구와 검색 기반 메모리는 실현 가능할 뿐만 아니라 특히 에이전트 스타일 시스템의 기반으로서 점점 더 매력적으로 변하고 있습니다.</p>
<p>궁극적으로 아키텍처 선택은 인프라가 무엇을 가능하게 하는지에 따라 결정됩니다.</p>
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
    </button></h2><p>실제 시스템에서 메모리 설계는 사전 계산된 컨텍스트와 온디맨드 검색 사이에서 이분법적인 선택이 아닙니다. 가장 효과적인 아키텍처는 일반적으로 두 가지 접근 방식을 결합한 하이브리드 아키텍처입니다.</p>
<p>일반적인 패턴은 슬라이딩 컨텍스트 창을 통해 최근 대화 내용을 삽입하고, 안정적인 사용자 기본 설정을 고정 메모리로 저장하며, 벡터 검색을 통해 필요에 따라 이전 기록을 검색하는 것입니다. 제품이 성숙해짐에 따라 이러한 균형은 아키텍처를 재설정할 필요 없이 주로 사전 계산된 컨텍스트에서 점점 더 검색 중심으로 점진적으로 전환될 수 있습니다.</p>
<p>사전 계산된 접근 방식으로 시작할 때에도 마이그레이션을 염두에 두고 설계하는 것이 중요합니다. 메모리는 명확한 식별자, 타임스탬프, 카테고리, 소스 참조와 함께 저장되어야 합니다. 검색이 가능해지면 기존 메모리에 대한 임베딩을 생성하고 동일한 메타데이터와 함께 벡터 데이터베이스에 추가할 수 있으므로 검색 로직을 점진적으로 도입할 수 있으며 중단을 최소화할 수 있습니다.</p>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요? <a href="https://discord.com/invite/8uyFbECzPX">Discord 채널에</a> 참여하거나 <a href="https://github.com/milvus-io/milvus">GitHub에서</a> 이슈를 제출하세요. 또한 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
