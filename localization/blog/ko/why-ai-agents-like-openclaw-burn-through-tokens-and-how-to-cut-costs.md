---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: OpenClaw와 같은 AI 에이전트가 토큰을 소진하는 이유와 비용 절감 방법
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  OpenClaw 및 기타 AI 에이전트의 토큰 청구서가 급증하는 이유와 BM25 + 벡터 검색(index1, QMD, Milvus) 및
  마크다운 우선 메모리(memsearch)로 이를 해결하는 방법.
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (이전의 Clawdbot 및 Moltbot)를 사용해 본 적이 있다면 이 AI 에이전트가 얼마나 뛰어난지 이미 알고 계실 것입니다. 빠르고, 로컬에 있으며, 유연하고, Slack, Discord, 코드베이스, 그 외 거의 모든 곳에서 놀라울 정도로 복잡한 워크플로우를 처리할 수 있습니다. 하지만 본격적으로 사용하기 시작하면 한 가지 패턴이 빠르게 나타납니다. 바로 <strong>토큰 사용량이 증가하기 시작한다는</strong> 것입니다 <strong>.</strong></p>
<p>이는 특별히 OpenClaw의 잘못이 아니라 오늘날 대부분의 AI 에이전트가 작동하는 방식입니다. 파일 조회, 작업 계획, 메모 작성, 도구 실행, 후속 질문 등 거의 모든 작업에 대해 LLM 호출을 트리거합니다. 그리고 토큰은 이러한 호출의 보편적인 통화이므로 모든 작업에는 비용이 발생합니다.</p>
<p>그 비용이 어디에서 발생하는지 이해하려면 두 가지 주요 원인에 대해 자세히 살펴볼 필요가 있습니다:</p>
<ul>
<li><strong>검색입니다:</strong> 잘못 구성된 검색은 모델에 실제로 필요하지 않은 전체 파일, 로그, 메시지, 코드 영역 등 광범위한 컨텍스트 페이로드를 가져옵니다.</li>
<li><strong>메모리:</strong> 중요하지 않은 정보를 저장하면 에이전트가 향후 통화 시 해당 정보를 다시 읽고 재처리해야 하므로 시간이 지남에 따라 토큰 사용량이 증가합니다.</li>
</ul>
<p>두 가지 문제 모두 기능 향상 없이 운영 비용을 소리 없이 증가시킵니다.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">OpenClaw와 같은 AI 에이전트가 실제로 검색을 수행하는 방식과 이로 인해 토큰이 소모되는 이유<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>에이전트가 코드베이스나 문서 라이브러리에서 정보가 필요할 때, 일반적으로 프로젝트 전체에서 <strong>Ctrl+F를</strong> 누르는 것과 동일한 작업을 수행합니다. 일치하는 모든 줄이 순위가 지정되지 않고 필터링되지 않으며 우선 순위가 지정되지 않은 상태로 반환됩니다. Claude Code는 ripgrep에 구축된 전용 Grep 도구를 통해 이를 구현합니다. OpenClaw에는 코드베이스 검색 도구가 내장되어 있지 않지만 실행 도구를 통해 기본 모델에서 모든 명령을 실행할 수 있으며, 로드된 스킬은 에이전트가 rg와 같은 도구를 사용하도록 안내할 수 있습니다. 두 경우 모두 코드베이스 검색은 순위가 지정되지 않고 필터링되지 않은 키워드 일치를 반환합니다.</p>
<p>이러한 무차별 방식은 소규모 프로젝트에서는 잘 작동합니다. 하지만 리포지토리가 커지면 비용도 증가합니다. 관련 없는 일치 항목이 LLM의 컨텍스트 창에 쌓여 모델이 실제로 필요하지도 않은 수천 개의 토큰을 읽고 처리해야 합니다. 범위가 지정되지 않은 검색 한 번으로 전체 파일, 거대한 댓글 블록 또는 키워드는 공유하지만 근본적인 의도가 아닌 로그를 끌어올 수 있습니다. 긴 디버깅 또는 리서치 세션에서 이러한 패턴을 반복하면 부풀림이 빠르게 증가합니다.</p>
<p>OpenClaw와 Claude Code는 모두 이러한 증가를 관리하려고 노력합니다. OpenClaw는 크기가 큰 도구 출력을 정리하고 긴 대화 기록을 압축하는 반면, Claude Code는 파일 읽기 출력을 제한하고 컨텍스트 압축을 지원합니다. 이러한 완화 기능은 효과가 있지만, 이미 부풀려진 쿼리가 실행된 후에만 작동합니다. 순위가 매겨지지 않은 검색 결과는 여전히 토큰을 소비하며, 사용자는 여전히 토큰을 지불해야 합니다. 컨텍스트 관리는 낭비를 발생시킨 원래의 호출이 아닌 향후 호출에 도움이 됩니다.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">AI 에이전트 메모리의 작동 방식과 토큰 비용이 발생하는 이유<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>검색만이 토큰 오버헤드의 유일한 원인은 아닙니다. 에이전트가 메모리에서 불러오는 모든 컨텍스트도 LLM의 컨텍스트 창에 로드해야 하며, 여기에도 토큰이 필요합니다.</p>
<p>오늘날 대부분의 에이전트가 사용하는 LLM API는 스테이트리스입니다: Anthropic의 메시지 API는 모든 요청에 대해 전체 대화 기록을 필요로 하며, OpenAI의 채팅 완료 API도 같은 방식으로 작동합니다. 서버 측에서 대화 상태를 관리하는 OpenAI의 최신 상태 저장 응답 API도 여전히 모든 통화에서 전체 컨텍스트 창에 대한 비용을 청구합니다. 컨텍스트에 로드된 메모리는 그 방식에 관계없이 토큰 비용이 발생합니다.</p>
<p>이 문제를 해결하기 위해 상담원 프레임워크는 디스크의 파일에 메모를 쓰고 상담원이 필요할 때 관련 메모를 컨텍스트 창에 다시 로드합니다. 예를 들어, OpenClaw는 선별된 메모를 MEMORY.md에 저장하고 타임스탬프가 찍힌 마크다운 파일에 일일 로그를 추가한 다음 하이브리드 BM25 및 벡터 검색으로 색인을 생성하여 에이전트가 필요에 따라 관련 컨텍스트를 불러올 수 있도록 합니다.</p>
<p>OpenClaw의 메모리 설계는 잘 작동하지만 게이트웨이 프로세스, 메시징 플랫폼 연결 및 나머지 스택 등 전체 OpenClaw 에코시스템이 필요합니다. CLI에 연결된 클로드 코드의 메모리도 마찬가지입니다. 이러한 플랫폼 외부에서 사용자 지정 에이전트를 구축하는 경우에는 독립형 솔루션이 필요합니다. 다음 섹션에서는 두 가지 문제에 모두 사용할 수 있는 도구를 다룹니다.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">OpenClaw의 토큰 소모를 막는 방법<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw가 소비하는 토큰 수를 줄이려면 두 가지 방법을 사용할 수 있습니다.</p>
<ul>
<li>첫 번째는 <strong>검색 성능 향상으로</strong>, grep 스타일의 키워드 덤프를 순위가 매겨진 관련성 중심 검색 도구로 대체하여 모델이 실제로 중요한 정보만 볼 수 있도록 하는 것입니다.</li>
<li>두 번째는 <strong>메모리 개선으로</strong>, 불투명하고 프레임워크에 종속적인 저장소에서 사용자가 이해하고, 검사하고, 제어할 수 있는 저장소로 전환하는 것입니다.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">grep을 더 나은 검색으로 대체하기: index1, QMD, Milvus</h3><p>많은 AI 코딩 에이전트가 grep 또는 ripgrep로 코드베이스를 검색합니다. Claude Code에는 ripgrep에 기반한 전용 Grep 도구가 있습니다. OpenClaw에는 코드베이스 검색 도구가 내장되어 있지 않지만 실행 도구를 사용하면 기본 모델에서 모든 명령을 실행할 수 있으며, 에이전트의 검색 방법을 안내하기 위해 ripgrep 또는 QMD와 같은 기술을 로드할 수 있습니다. 검색에 초점을 맞춘 스킬이 없으면 에이전트는 기본 모델이 선택한 접근 방식에 의존하게 됩니다. 핵심 문제는 모든 에이전트에서 동일합니다. 순위 검색이 없으면 키워드 일치 항목이 필터링되지 않은 채 컨텍스트 창에 입력됩니다.</p>
<p>이는 프로젝트의 규모가 충분히 작아서 모든 일치 항목이 컨텍스트 창에 편안하게 들어갈 수 있을 때 작동합니다. 문제는 코드베이스나 문서 라이브러리가 키워드가 수십 또는 수백 개의 히트를 반환하고 에이전트가 이를 모두 프롬프트에 로드해야 할 정도로 커질 때 시작됩니다. 이 정도 규모에서는 단순히 일치 항목별로 필터링된 결과가 아니라 관련성별로 순위가 매겨진 결과가 필요합니다.</p>
<p>표준 해결 방법은 두 가지 상호 보완적인 순위 지정 방법을 결합한 하이브리드 검색입니다:</p>
<ul>
<li>BM25는 특정 문서에서 용어가 얼마나 자주, 얼마나 고유하게 나타나는지에 따라 각 결과에 점수를 매깁니다. '인증'이 15번 언급된 집중 파일은 한 번 언급된 광범위한 파일보다 더 높은 순위를 차지합니다.</li>
<li>벡터 검색은 텍스트를 의미의 숫자 표현으로 변환하기 때문에 '인증'은 키워드를 공유하지 않더라도 '로그인 흐름' 또는 '세션 관리'와 일치할 수 있습니다.</li>
</ul>
<p>두 가지 방법만으로는 충분하지 않습니다: BM25는 의역된 용어를 놓치고, 벡터 검색은 오류 코드와 같은 정확한 용어를 놓칩니다. 두 가지 방법을 결합하고 융합 알고리즘을 통해 순위가 매겨진 목록을 병합하면 두 가지 공백을 모두 메울 수 있습니다.</p>
<p>아래 도구는 이 패턴을 다양한 규모로 구현합니다. Grep은 모든 사람이 시작하는 기준선입니다. index1, QMD, Milvus는 각각 용량을 늘리면서 하이브리드 검색을 추가합니다.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: 단일 머신에서 빠른 하이브리드 검색</h4><p><a href="https://github.com/gladego/index1">index1은</a> 하이브리드 검색을 단일 SQLite 데이터베이스 파일로 패키징하는 CLI 도구입니다. FTS5는 BM25를 처리하고, sqlite-vec은 벡터 유사성을 처리하며, RRF는 순위가 매겨진 목록을 융합합니다. 임베딩은 Ollama에 의해 로컬에서 생성되므로 컴퓨터에서 아무것도 남지 않습니다.</p>
<p>index1은 줄 수가 아닌 구조별로 코드를 청크합니다: 마크다운 파일은 제목별로, 파이썬 파일은 AST별로, 자바스크립트와 타입스크립트는 정규식 패턴별로 분할합니다. 즉, 검색 결과는 블록 중간에 끊어지는 임의의 줄 범위가 아니라 전체 함수 또는 전체 문서 섹션과 같은 일관된 단위를 반환합니다. 하이브리드 쿼리의 경우 응답 시간은 40~180밀리초입니다. 올라마가 없으면 모든 일치 항목을 컨텍스트 창에 덤프하지 않고 여전히 결과의 순위를 매기는 BM25 전용으로 되돌아갑니다.</p>
<p>index1에는 교훈, 버그 근본 원인, 아키텍처 결정을 저장하기 위한 에피소드 메모리 모듈도 포함되어 있습니다. 이러한 메모리는 독립형 파일이 아니라 코드 인덱스와 동일한 SQLite 데이터베이스 내에 있습니다.</p>
<p>참고: index1은 초기 단계 프로젝트입니다(2026년 2월 현재 별 0개, 커밋 4개). 커밋하기 전에 자신의 코드베이스와 비교하여 평가하세요.</p>
<ul>
<li><strong>최상의 대상</strong>: 1인 개발자 또는 한 대의 컴퓨터에 맞는 코드베이스가 있는 소규모 팀으로, grep보다 빠른 개선을 원하는 경우.</li>
<li>다음과 같은<strong>경우</strong>: 동일한 인덱스에 대한 여러 사용자의 액세스가 필요하거나 데이터가 단일 SQLite 파일에서 처리할 수 있는 양을 초과하는 경우.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: 로컬 LLM 재랭크를 통한 정확도 향상</h4><p>Shopify 설립자 Tobi Lütke가 구축한<a href="https://github.com/tobi/qmd">QMD</a> (쿼리 마크업 문서)는 세 번째 단계를 추가합니다: LLM 재랭크. BM25와 벡터 검색이 각각 후보를 반환한 후 로컬 언어 모델이 상위 결과를 다시 읽고 쿼리와의 실제 관련성에 따라 순위를 다시 매깁니다. 이렇게 하면 키워드와 의미론적 일치 모두 그럴듯하지만 잘못된 결과를 반환하는 경우를 포착할 수 있습니다.</p>
<p>QMD는 임베딩 모델(embeddinggemma-300M), 크로스 인코더 리랭커(Qwen3-Reranker-0.6B), 쿼리 확장 모델(qmd-query-expansion-1.7B) 등 총 2GB에 달하는 세 가지 GGUF 모델을 사용하여 컴퓨터에서 전적으로 실행됩니다. 세 가지 모두 첫 실행 시 자동으로 다운로드됩니다. 클라우드 API 호출이나 API 키가 필요하지 않습니다.</p>
<p>단점은 콜드 스타트 시간입니다. 디스크에서 세 가지 모델을 로드하는 데 약 15~16초가 걸립니다. QMD는 요청 사이에 모델을 메모리에 유지하여 반복되는 쿼리에 대한 콜드 스타트 페널티를 없애는 영구 서버 모드(qmd mcp)를 지원합니다.</p>
<ul>
<li><strong>최상의 경우:</strong> 데이터가 컴퓨터에서 빠져나갈 수 없고, 응답 시간보다 검색 정확도가 더 중요한 개인정보 보호 환경.</li>
<li>적합한<strong>경우:</strong> 1초 미만의 응답, 팀 공유 액세스가 필요하거나 데이터 세트가 단일 컴퓨터 용량을 초과하는 경우.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: 팀 및 엔터프라이즈 규모의 하이브리드 검색</h4><p>위의 단일 머신 도구는 개별 개발자에게는 잘 작동하지만 여러 사람이나 상담원이 동일한 지식창고에 액세스해야 할 때는 한계에 부딪힙니다. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus는</a> 그 다음 단계인 분산형, 다중 사용자, 수십억 개의 벡터를 처리할 수 있는 오픈 소스 벡터 데이터베이스를 위해 구축되었습니다.</p>
<p>이 사용 사례의 핵심 기능은 Milvus 2.5부터 제공되며 2.6에서는 훨씬 빨라진 내장형 Sparse-BM25입니다. 사용자가 원시 텍스트를 제공하면 Milvus는 tantivy에 구축된 분석기를 사용해 내부적으로 토큰화한 다음, 그 결과를 미리 계산되어 색인 시점에 저장되는 스파스 벡터로 변환합니다.</p>
<p>BM25 표현이 이미 저장되어 있기 때문에 검색 시 점수를 즉시 다시 계산할 필요가 없습니다. 이러한 희소 벡터는 동일한 컬렉션에서 밀도가 높은 벡터(시맨틱 임베딩)와 함께 존재합니다. 쿼리 시에는 Milvus가 기본으로 제공하는 RRFRanker와 같은 랭커를 사용해 두 신호를 융합합니다. index1 및 QMD와 동일한 하이브리드 검색 패턴이지만 수평적으로 확장되는 인프라에서 실행됩니다.</p>
<p>또한 Milvus는 멀티테넌트 격리(팀당 별도의 데이터베이스 또는 컬렉션), 자동 장애 조치를 통한 데이터 복제, 비용 효율적인 스토리지를 위한 핫/콜드 데이터 계층화 등 단일 머신 도구로는 불가능한 기능도 제공합니다. 상담원의 경우 여러 개발자 또는 여러 상담원 인스턴스가 서로의 데이터를 밟지 않고도 동일한 지식창고를 동시에 쿼리할 수 있다는 뜻입니다.</p>
<ul>
<li><strong>최적의 대상</strong>: 지식창고를 공유하는 여러 개발자 또는 상담원, 규모가 크거나 빠르게 증가하는 문서 세트, 복제, 장애 조치 및 액세스 제어가 필요한 프로덕션 환경.</li>
</ul>
<p>요약하자면</p>
<table>
<thead>
<tr><th>도구</th><th>단계</th><th>배포</th><th>마이그레이션 신호</th></tr>
</thead>
<tbody>
<tr><td>클로드 네이티브 그렙</td><td>프로토타이핑</td><td>기본 제공, 설정 필요 없음</td><td>청구서 증가 또는 쿼리 속도 저하</td></tr>
<tr><td>index1</td><td>단일 머신(속도)</td><td>로컬 SQLite + Ollama</td><td>다중 사용자 액세스가 필요하거나 데이터가 한 머신을 초과하는 경우</td></tr>
<tr><td>QMD</td><td>단일 머신(정확도)</td><td>3개의 로컬 GGUF 모델</td><td>팀 공유 인덱스 필요</td></tr>
<tr><td>Milvus</td><td>팀 또는 프로덕션</td><td>분산 클러스터</td><td>대규모 문서 세트 또는 멀티테넌트 요구 사항</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">memsearch로 영구적이고 편집 가능한 메모리를 제공하여 AI 에이전트 토큰 비용 절감</h3><p>검색 최적화는 쿼리당 토큰 낭비를 줄여주지만 에이전트가 세션 사이에 보관하는 내용에는 도움이 되지 않습니다.</p>
<p>에이전트가 메모리에서 불러오는 모든 컨텍스트는 프롬프트에 로드되어야 하며, 여기에도 토큰이 필요합니다. 문제는 메모리를 저장할지 여부가 아니라 저장 방법입니다. 저장 방식에 따라 상담원이 기억하는 내용을 확인하고, 잘못된 경우 수정하며, 도구를 전환할 때 가져갈 수 있는지 여부가 결정됩니다.</p>
<p>대부분의 프레임워크는 이 세 가지 모두에서 실패합니다. Mem0과 Zep은 모든 것을 벡터 데이터베이스에 저장하여 검색에는 효과적이지만 메모리를 사용합니다:</p>
<ul>
<li><strong>불투명합니다.</strong> API를 쿼리하지 않고는 에이전트가 기억하는 내용을 확인할 수 없습니다.</li>
<li><strong>편집이 어렵습니다.</strong> 메모리를 수정하거나 제거하려면 파일을 여는 것이 아니라 API를 호출해야 합니다.</li>
<li><strong>잠김.</strong> 프레임워크를 전환한다는 것은 데이터를 내보내고, 변환하고, 다시 가져오는 것을 의미합니다.</li>
</ul>
<p>OpenClaw는 다른 접근 방식을 취합니다. 모든 메모리는 디스크의 일반 마크다운 파일에 저장됩니다. 에이전트는 매일 로그를 자동으로 작성하고, 사람은 모든 메모리 파일을 직접 열고 편집할 수 있습니다. 따라서 메모리는 읽기, 편집, 휴대성이라는 세 가지 문제를 모두 해결합니다.</p>
<p>단점은 배포 오버헤드입니다. OpenClaw의 메모리를 실행한다는 것은 게이트웨이 프로세스, 메시징 플랫폼 연결, 나머지 스택 등 전체 OpenClaw 에코시스템을 실행한다는 것을 의미합니다. 이미 OpenClaw를 사용하고 있는 팀이라면 괜찮습니다. 다른 모든 사람들에게는 장벽이 너무 높습니다. 이 격차를 줄이기 위해 <strong>memsearch가</strong> 개발되었습니다. memsearch는 OpenClaw의 마크다운 우선 메모리 패턴을 모든 에이전트와 함께 작동하는 독립형 라이브러리로 추출합니다.</p>
<p>Zilliz(Milvus의 개발팀)가 구축한<strong><a href="https://github.com/zilliztech/memsearch">memsearch는</a></strong> 마크다운 파일을 단일 소스로 취급합니다. MEMORY.md에는 수기로 작성한 장기적인 사실과 결정 사항이 보관됩니다. 일일 로그(2026-02-26.md)는 세션 요약에서 자동으로 생성됩니다. Milvus에 저장된 벡터 인덱스는 언제든지 마크다운에서 재구축할 수 있는 파생 레이어입니다.</p>
<p>실제로는 텍스트 편집기에서 메모리 파일을 열고 에이전트가 알고 있는 내용을 정확히 읽고 변경할 수 있다는 뜻입니다. 파일을 저장하면 memsearch의 파일 감시기가 변경 사항을 감지하고 자동으로 다시 색인화합니다. Git으로 메모리를 관리하거나 풀 리퀘스트를 통해 AI가 생성한 메모리를 검토하거나 폴더를 복사하여 새 머신으로 옮길 수 있습니다. Milvus 인덱스가 손실되면 파일에서 다시 빌드하면 됩니다. 파일은 절대 위험에 노출되지 않습니다.</p>
<p>내부적으로 memsearch는 위에서 설명한 것과 동일한 하이브리드 검색 패턴, 즉 제목 구조와 단락 경계로 분할된 청크, BM25 + 벡터 검색, 로그가 커질 때 이전 메모리를 요약하는 LLM 기반 압축 명령어를 사용합니다.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>최상의 대상: 에이전트가 기억하는 내용을 완벽하게 파악하고 싶거나, 메모리에 대한 버전 관리가 필요하거나, 단일 에이전트 프레임워크에 종속되지 않는 메모리 시스템을 원하는 팀.</p>
<p>요약하면 다음과 같습니다:</p>
<table>
<thead>
<tr><th>기능</th><th>Mem0 / Zep</th><th>멤서치</th></tr>
</thead>
<tbody>
<tr><td>데이터 소스</td><td>벡터 데이터베이스(유일한 데이터 소스)</td><td>마크다운 파일(기본) + Milvus(색인)</td></tr>
<tr><td>투명성</td><td>블랙박스, 검사하려면 API 필요</td><td>.md 파일을 열어 읽기</td></tr>
<tr><td>편집 가능성</td><td>API 호출을 통해 수정</td><td>모든 텍스트 편집기에서 직접 편집, 자동 색인화</td></tr>
<tr><td>버전 관리</td><td>별도의 감사 로깅 필요</td><td>Git은 기본적으로 작동</td></tr>
<tr><td>마이그레이션 비용</td><td>내보내기 → 형식 변환 → 다시 가져오기</td><td>마크다운 폴더 복사</td></tr>
<tr><td>인간-AI 협업</td><td>AI가 작성하고, 사람이 관찰</td><td>사람이 편집, 보완, 검토 가능</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">규모에 맞는 설정<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>시나리오</th><th>검색</th><th>메모리</th><th>다음 단계로 넘어갈 시기</th></tr>
</thead>
<tbody>
<tr><td>초기 프로토타입</td><td>Grep(기본 제공)</td><td>-</td><td>청구서 증가 또는 쿼리 속도 저하</td></tr>
<tr><td>단일 개발자, 검색만 가능</td><td><a href="https://github.com/gladego/index1">index1</a> (속도) 또는 <a href="https://github.com/tobi/qmd">QMD</a> (정확도)</td><td>-</td><td>다중 사용자 액세스가 필요하거나 데이터가 한 시스템을 초과하는 경우</td></tr>
<tr><td>단일 개발자, 둘 다</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>다중 사용자 액세스가 필요하거나 데이터가 한 머신을 초과하는 경우</td></tr>
<tr><td>팀 또는 프로덕션, 둘 다</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>빠른 통합, 메모리 전용</td><td>-</td><td>Mem0 또는 Zep</td><td>메모리를 검사, 편집 또는 마이그레이션해야 하는 경우</td></tr>
</tbody>
</table>
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
    </button></h2><p>상시 가동되는 AI 에이전트에서 발생하는 토큰 비용은 피할 수 없습니다. 이 가이드에서는 더 나은 툴을 사용하면 낭비를 줄일 수 있는 두 가지 영역, 즉 검색과 메모리를 다루었습니다.</p>
<p>Grep은 소규모로 작동하지만 코드베이스가 커지면 순위가 매겨지지 않은 키워드 일치가 모델에 필요하지 않은 콘텐츠로 컨텍스트 창에 넘쳐납니다. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> 및 <a href="https://github.com/tobi/qmd"></a> QMD는 BM25 키워드 점수를 벡터 검색과 결합하고 가장 관련성이 높은 결과만 반환함으로써 단일 머신에서 이 문제를 해결합니다. 팀, 다중 에이전트 설정 또는 프로덕션 워크로드의 경우, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus는</a> 수평적으로 확장되는 인프라에서 동일한 하이브리드 검색 패턴을 제공합니다.</p>
<p>메모리의 경우, 대부분의 프레임워크는 모든 것을 벡터 데이터베이스에 저장합니다. 불투명하고 손으로 편집하기 어렵고 생성한 프레임워크에 고정되어 있습니다. <a href="https://github.com/zilliztech/memsearch">memsearch는</a> 다른 접근 방식을 취합니다. 메모리는 Git으로 읽고, 편집하고, 버전을 제어할 수 있는 일반 마크다운 파일에 저장됩니다. Milvus는 이러한 파일에서 언제든지 재구축할 수 있는 파생 인덱스 역할을 합니다. 에이전트가 알고 있는 내용을 계속 제어할 수 있습니다.</p>
<p><a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch"></a> memsearch와 <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus는</a> 모두 오픈 소스입니다. 저희는 memsearch를 활발히 개발 중이며 프로덕션 환경에서 이를 실행하는 모든 분들의 피드백을 기다리고 있습니다. 이슈를 열거나 PR을 제출하거나 무엇이 작동하고 무엇이 작동하지 않는지 알려주세요.</p>
<p>이 가이드에 언급된 프로젝트</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Milvus가 지원하는 AI 에이전트를 위한 마크다운 우선 메모리.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: 확장 가능한 하이브리드 검색을 위한 오픈 소스 벡터 데이터베이스.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: AI 코딩 에이전트를 위한 BM25 + 벡터 하이브리드 검색.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: LLM 리랭킹을 통한 로컬 하이브리드 검색.</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw의 메모리 시스템을 추출하여 오픈소스화 (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">클로드 코드를 위한 퍼시스턴트 메모리: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw란 무엇인가요? 오픈 소스 AI 에이전트에 대한 전체 가이드</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 튜토리얼: 로컬 AI 어시스턴트를 위해 Slack에 연결하기</a></li>
</ul>
