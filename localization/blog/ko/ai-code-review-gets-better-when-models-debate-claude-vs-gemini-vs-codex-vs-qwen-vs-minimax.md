---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: '모델이 토론할 때 AI 코드 리뷰가 더 좋아집니다: 클로드 대 제미니 대 코덱스 대 큐웬 대 미니맥스'
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  실제 버그 탐지를 위해 Claude, Gemini, Codex, Qwen 및 MiniMax를 테스트했습니다. 가장 우수한 모델은 53%를
  기록했습니다. 적대적인 논쟁을 거친 후 탐지율은 80%로 뛰어올랐습니다.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>최근에 풀 리퀘스트를 검토하기 위해 AI 모델을 사용했는데 결과가 모순적이었습니다: Claude는 데이터 경쟁이 있다고 플래그 지정한 반면, Gemini는 코드가 깨끗하다고 말했습니다. 그래서 다른 AI 모델은 어떻게 작동할지 궁금해져서 구조화된 코드 리뷰 벤치마크를 통해 Claude, Gemini, Codex, Qwen, MiniMax의 최신 플래그십 모델을 실행해 보았습니다. 결과는? 가장 성능이 좋은 모델은 알려진 버그의 53%만 포착했습니다.</p>
<p>하지만 호기심은 여기서 끝나지 않았습니다. 이러한 AI 모델이 함께 작동한다면 어떨까요? 두 모델이 서로 논쟁을 벌이게 하는 실험을 해본 결과, 다섯 차례의 적대적인 논쟁 끝에 버그 탐지율이 80%로 뛰어올랐습니다. 가장 어려운 버그, 즉 시스템 수준의 이해가 필요한 버그는 토론 모드에서 100% 탐지율을 기록했습니다.</p>
<p>이 게시물에서는 실험 설계, 모델별 결과, 그리고 디베이트 메커니즘을 통해 실제로 코드 리뷰에 AI를 사용하는 방법에 대해 살펴봅니다.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">코드 검토를 위한 Claude, Gemini, Codex, Qwen 및 MiniMax 벤치마킹하기<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>코드 리뷰에 모델을 사용해 본 적이 있다면 정확도뿐만 아니라 코드를 읽는 방식에서도 차이가 있다는 것을 알 수 있을 것입니다. 예를 들어</p>
<p>Claude는 보통 콜 체인을 위에서 아래로 이동하며 '지루한' 경로(오류 처리, 재시도, 정리)에 시간을 소비합니다. 진짜 버그가 숨어 있는 곳이 바로 그 지루한 경로인 경우가 많기 때문에 저는 그 철저함을 싫어하지 않습니다.</p>
<p>Gemini는 강력한 판단("이건 나쁘다" / "괜찮아 보인다")으로 시작한 다음 디자인/구조적 관점에서 이를 정당화하기 위해 거꾸로 작업하는 경향이 있습니다. 때로는 이것이 유용할 때도 있습니다. 때로는 대충 훑어본 다음 테이크에 투입한 것처럼 읽힐 때도 있습니다.</p>
<p>코덱스는 더 조용합니다. 하지만 무언가를 지적할 때는 해설보다는 "이 대사는 X 때문에 틀렸다"는 식으로 구체적이고 실행 가능한 경우가 많습니다.</p>
<p>하지만 이것은 측정값이 아니라 인상입니다. 실제 수치를 얻기 위해 벤치마크를 설정했습니다.</p>
<h3 id="Setup" class="common-anchor-header">설정</h3><p><strong>5개의 주력 모델을 테스트했습니다:</strong></p>
<ul>
<li><p>클로드 오퍼스 4.6</p></li>
<li><p>제미니 3 프로</p></li>
<li><p>GPT-5.2-코덱스</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>툴링(Magpie)</strong></p>
<p>저는 제가 만든 오픈소스 벤치마킹 도구인 <a href="https://github.com/liliu-z/magpie">Magpie를</a> 사용했습니다. 이 도구의 역할은 일반적으로 수동으로 수행하는 '코드 검토 준비'를 수행하여 주변 컨텍스트(콜 체인, 관련 모듈 및 관련 인접 코드)를 가져와서 PR을 검토하기 <em>전에</em> 모델에 공급하는 것입니다.</p>
<p><strong>테스트 사례(알려진 버그가 있는 Milvus PR)</strong></p>
<p>데이터 세트는 <a href="https://github.com/milvus-io/milvus">Milvus</a> ( <a href="https://zilliz.com/">Zilliz에서</a> 생성 및 유지 관리하는 오픈 소스 벡터 데이터베이스)의 15개 풀 리퀘스트로 구성되어 있습니다. 이러한 PR은 각각 병합되었지만 나중에 프로덕션에서 버그가 발견된 후 되돌리거나 핫픽스가 필요하기 때문에 벤치마크로 유용합니다. 따라서 모든 사례에는 점수를 매길 수 있는 알려진 버그가 있습니다.</p>
<p><strong>버그 난이도</strong></p>
<p>하지만 모든 버그를 똑같이 찾기 어려운 것은 아니기 때문에 버그를 세 가지 난이도로 분류했습니다:</p>
<ul>
<li><p><strong>L1:</strong> 차이점만 보면 알 수 있습니다(사용 후, 사용 중).</p></li>
<li><p><strong>L2(10건):</strong> 인터페이스 의미 변경이나 동시성 경쟁과 같은 것을 발견하려면 주변 코드를 이해해야 합니다. 일상적인 코드 리뷰에서 가장 흔하게 발생하는 버그입니다.</p></li>
<li><p><strong>L3(5건):</strong> 모듈 간 상태 불일치 또는 업그레이드 호환성 문제와 같은 문제를 포착하기 위해 시스템 수준의 이해가 필요합니다. 이 테스트는 모델이 코드베이스에 대해 얼마나 깊이 추론할 수 있는지에 대한 가장 어려운 테스트입니다.</p></li>
</ul>
<p><em>참고: 모든 모델이 모든 L1 버그를 포착했기 때문에 점수에서 제외했습니다.</em></p>
<p><strong>두 가지 평가 모드</strong></p>
<p>각 모델은 두 가지 모드로 실행되었습니다:</p>
<ul>
<li><p><strong>Raw:</strong> 모델은 PR(차이점 + PR 콘텐츠에 있는 모든 것)만 봅니다.</p></li>
<li><p><strong>R1:</strong> Magpie는 모델이 검토하기 <em>전에</em> 주변 컨텍스트(관련 파일/콜 사이트/관련 코드)를 가져옵니다. 이는 모델에 필요한 것을 추측하도록 요청하는 대신 컨텍스트를 미리 준비하는 워크플로우를 시뮬레이션합니다.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">결과(L2 + L3만 해당)</h3><table>
<thead>
<tr><th>모드</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Raw</td><td>53% (1위)</td><td>13% (마지막)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1(매그파이의 컨텍스트 포함)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>네 가지 요점:</p>
<p><strong>1. Claude는 로우 리뷰에서 압도적인 점수를 받았습니다.</strong> 컨텍스트 지원 없이도 전체 탐지율 53%, L3 버그에서 5/5 만점을 기록했습니다. 단일 모델을 사용하고 컨텍스트 준비에 시간을 소비하고 싶지 않다면 Claude가 최선의 선택입니다.</p>
<p><strong>2. Gemini는 컨텍스트 제공이 필요합니다.</strong> 원시 점수는 13%로 그룹에서 가장 낮았지만 Magpie가 주변 코드를 제공하면서 점수가 33%로 상승했습니다. Gemini는 자체적으로 컨텍스트를 잘 수집하지는 못하지만, 이러한 작업을 미리 수행하면 상당한 성능을 발휘합니다.</p>
<p><strong>3. Qwen은 컨텍스트 지원 성능이 가장 뛰어났습니다.</strong> R1 모드에서 40%, L2 버그에서 5/10을 기록하여 해당 난이도에서 가장 높은 점수를 받았습니다. 컨텍스트를 준비해야 하는 일상적인 일일 리뷰의 경우 Qwen이 실용적인 선택입니다.</p>
<p><strong>4. 컨텍스트가 많다고 해서 항상 도움이 되는 것은 아닙니다.</strong> 제미니(13%→33%)와 미니맥스(27%→33%)는 상승했지만, 클로드(53%→47%)는 오히려 하락했습니다. Claude는 이미 자체적으로 컨텍스트를 정리하는 능력이 뛰어나기 때문에 추가 정보로 인해 명확성보다는 노이즈가 발생했을 가능성이 높습니다. 교훈: 더 많은 컨텍스트가 보편적으로 더 좋다고 가정하기보다는 워크플로우를 모델에 맞춰야 합니다.</p>
<p>이러한 결과는 제 일상적인 경험과 일치합니다. 1위를 차지한 Claude는 놀랍지 않습니다. 예상보다 낮은 점수를 받은 것은 지금 생각해보면 당연한 결과입니다. 저는 일반적으로 디자인을 반복하거나 함께 문제를 추적하는 멀티턴 대화에서 Gemini를 사용하며, 이러한 대화형 환경에서 잘 작동합니다. 이 벤치마크는 고정된 단일 패스 파이프라인으로, Gemini가 가장 취약한 형식입니다. 뒷부분의 토론 섹션에서는 Gemini에 다라운드 적대적 형식을 부여하면 성능이 눈에 띄게 향상된다는 것을 보여줄 것입니다.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">AI 모델이 서로 토론하게 하기<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>각 모델마다 개별 벤치마크에서 서로 다른 강점과 맹점을 보였습니다. 그래서 저는 모델들이 코드가 아닌 서로의 작업을 검토하면 어떻게 될지 테스트해보고 싶었습니다.</p>
<p>그래서 동일한 벤치마크 위에 토론 레이어를 추가했습니다. 5명의 모델이 모두 5라운드에 참여합니다:</p>
<ul>
<li><p>1라운드에서는 각 모델이 동일한 PR을 독립적으로 검토합니다.</p></li>
<li><p>그 후 모든 참가자에게 5개의 리뷰를 모두 방송합니다.</p></li>
<li><p>2라운드에서는 각 모델이 다른 4개의 리뷰를 바탕으로 자신의 순위를 업데이트합니다.</p></li>
<li><p>5라운드까지 반복합니다.</p></li>
</ul>
<p>마지막에는 각 모델이 단순히 코드에 반응하는 것이 아니라 이미 여러 차례 비판과 수정을 거친 주장에 반응하게 됩니다.</p>
<p>이것이 '큰 소리로 동의하는 LLM'으로 바뀌는 것을 막기 위해 저는 <strong>모든 주장은 구체적인 코드를 증거로 제시해야</strong> 하고, 모델은 단순히 "좋은 지적"이라고만 말할 수 없으며 왜 생각을 바꿨는지 설명해야 한다는 한 가지 엄격한 규칙을 적용했습니다.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">결과 최고의 솔로 대 토론 모드</h3><table>
<thead>
<tr><th>모드</th><th>L2 (10건)</th><th>L3 (5건)</th><th>총 감지 횟수</th></tr>
</thead>
<tbody>
<tr><td>최고 개인 (원시 클로드)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>토론(5가지 모델 모두)</td><td>7/10 (두 배)</td><td>5/5 (모두 잡힘)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">눈에 띄는 점</h3><p><strong>1. L2 탐지가 두 배로 증가했습니다.</strong> 일상적인 중간 난이도 버그가 3/10에서 7/10으로 급증했습니다. 이러한 버그는 실제 코드베이스에서 가장 빈번하게 나타나는 버그이며, 개별 모델이 일관성 없이 놓치는 범주입니다. 토론 메커니즘의 가장 큰 공헌은 바로 이러한 일상적인 격차를 줄이는 것입니다.</p>
<p><strong>2. L3 버그: 제로 미스.</strong> 단일 모델 실행에서는 클로드만이 5개의 L3 시스템 수준 버그를 모두 찾아냈습니다. 토론 모드에서는 그룹이 그 결과를 일치시켰기 때문에 더 이상 완전한 L3 커버리지를 얻기 위해 올바른 모델에 베팅할 필요가 없습니다.</p>
<p><strong>3. 토론은 한계를 높이는 것이 아니라 사각지대를 메웁니다.</strong> 시스템 수준의 버그는 가장 강력한 개인에게 어려운 부분이 아니었습니다. 클로드는 이미 그런 문제를 가지고 있었습니다. 디베이트 메커니즘의 핵심적인 기여는 일상적인 L2 버그에 대한 클로드의 약점을 보완하는 것으로, 개인 클로드는 10개 중 3개만 발견했지만 디베이트 그룹은 7개를 발견했습니다. 여기서 53%에서 80%로의 도약이 이루어졌습니다.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">실제 디베이트의 모습</h3><p>위의 수치는 디베이트가 효과가 있다는 것을 보여 주지만, 구체적인 사례를 통해 그 <em>이유를</em> 알 수 있습니다. 다음은 검색 중 기본 키의 지연 로딩을 도입한 <strong>PR #44474를</strong> 5가지 모델이 어떻게 처리했는지에 대한 요약된 설명입니다.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> 지연 로딩 최적화를 통해 기본 키를 모두 미리 로드하는 대신 필요에 따라 가져오는 방식으로 검색을 변경했습니다.</p>
<p><strong>1라운드</strong></p>
<p>Gemini는 공격적으로 시작했습니다:</p>
<p>"이 PR은 잘못된 관행, 정의되지 않은 잠재적 동작, '최적화'로 위장한 성능 퇴행으로 이루어진 지뢰밭입니다."</p>
<p>Claude와 Qwen은 정의되지 않은 동작과 성능에 초점을 맞추며 같은 우려에 집중했습니다:</p>
<p>"C++ 메모리 모델은 적절한 동기화 없이 동일한 벡터의 서로 다른 인덱스에 동시 쓰기를 할 때 안전을 보장하지 못합니다."</p>
<p>세 사람 모두 실제 문제를 발견했지만, 그 중 누구도 더 심각한 버그를 발견하지 못했습니다. 그러다 거의 말을 하지 않던 Codex가 다른 사람들이 놓친 문제, 즉 <code translate="no">primary_keys_</code> 벡터의 크기가 조정되지만 실제로는 축소 단계를 통과하는 위치만 채워진다는 사실을 발견했습니다. 다른 모든 위치는 0 값으로 남습니다.</p>
<p><strong>2라운드</strong></p>
<p>Claude는 코덱스의 발견을 포착하고 다운스트림 결과를 추적했습니다:</p>
<p>" <code translate="no">SortEqualScoresByPks</code> 가 <code translate="no">ReduceResultData</code> 보다 먼저 실행된다는 사실을 발견했습니다. 따라서 <code translate="no">SortEqualScoresByPks</code> 이 실행될 때 아직 0개의 PK가 느리게 가져온 것입니다. 전체 <code translate="no">primary_keys_</code> 벡터는 기본으로 구성된 PkType 값으로 가득 차 있습니다."</p>
<p>쉽게 말해, 정렬 함수는 키가 로드되기 전에 실행되므로 0을 정렬하고 있는 것입니다. Claude는 이 실수를 공개적으로 인정했습니다:</p>
<p>"codex-cli에서 정말 치명적인 정확성 버그를 발견했습니다. 첫 번째 라운드에서 이 버그를 놓쳤습니다."</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">어떤 모델 조합으로 가장 많은 버그를 찾을 수 있을까요?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>53%에서 80%로 급증한 것은 5개의 모델이 서로의 사각지대를 커버했기 때문입니다. 하지만 모든 사람이 모든 코드 리뷰에 대해 5개의 모델을 설정하고 5번의 토론을 거쳐 실행할 여유가 있는 것은 아닙니다.</p>
<p><strong>그래서 저는 더 간단한 버전을 테스트했습니다. 두 개의 모델만 실행할 수 있다면 어떤 모델이 다중 모델 상한선에 가장 근접할 수 있을까요?</strong></p>
<p>저는 <strong>컨텍스트 지원(R1)</strong> 실행을 사용하여 각 모델이 15개의 알려진 버그 중 몇 개를 발견했는지 세어보았습니다:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15(47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>따라서 중요한 것은 각 모델이 얼마나 많은 버그를 발견했는지가 아니라 <em>어떤</em> 버그를 놓쳤는지가 중요합니다. Claude가 놓친 8개의 버그 중 Gemini는 동시성 경쟁 조건, 클라우드 스토리지 API 호환성 문제, 권한 검사 누락 등 3개의 버그를 발견했습니다. 다른 방향으로 살펴보면, Gemini는 대부분의 데이터 구조와 심층 로직 버그를 놓쳤고 Claude는 거의 모든 버그를 찾아냈습니다. 약점이 거의 겹치지 않기 때문에 강력한 쌍을 이룰 수 있었습니다.</p>
<table>
<thead>
<tr><th>두 모델 페어링</th><th>결합 범위</th></tr>
</thead>
<tbody>
<tr><td>클로드 + 제미니</td><td>10/15</td></tr>
<tr><td>클로드 + 큐원</td><td>9/15</td></tr>
<tr><td>클로드 + 코덱스</td><td>8/15</td></tr>
<tr><td>클로드 + 미니맥스</td><td>8/15</td></tr>
</tbody>
</table>
<p>다섯 모델이 모두 15개 중 11개를 커버했으며, 모든 모델이 놓친 4개의 버그가 남았습니다.</p>
<p><strong>Claude + Gemini는</strong> 두 모델 쌍으로 이미 5개 모델 상한의 91%에 도달했습니다. 이 벤치마크에서는 가장 효율적인 조합입니다.</p>
<p>그렇긴 하지만 클로드 + 제미니가 모든 유형의 버그에 가장 적합한 조합은 아닙니다. 결과를 버그 범주별로 세분화하면 좀 더 미묘한 그림이 나타납니다:</p>
<table>
<thead>
<tr><th>버그 유형</th><th>총</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>유효성 검사 간격</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>데이터 구조 수명 주기</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>동시성 레이스</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>호환성</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>심층 논리</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>합계</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>버그 유형별 분석은 단일 페어링이 보편적으로 가장 좋은 방법이 없는 이유를 보여줍니다.</p>
<ul>
<li><p>데이터 구조 수명 주기 버그의 경우, Claude와 MiniMax가 3/4로 동률을 기록했습니다.</p></li>
<li><p>유효성 검사 격차의 경우, Claude와 Qwen이 3/4로 동률을 기록했습니다.</p></li>
<li><p>동시성 및 호환성 문제에서는 Claude가 두 가지 모두에서 0점을 받았으며, Gemini가 이러한 격차를 메우는 것으로 나타났습니다.</p></li>
<li><p>모든 것을 커버하는 모델은 없지만, 가장 넓은 범위를 커버하고 제너럴리스트에 가장 근접한 모델은 Claude입니다.</p></li>
</ul>
<p>모든 모델에서 네 가지 버그를 놓쳤습니다. 하나는 ANTLR 문법 규칙 우선순위와 관련된 것이었습니다. 하나는 함수 간 읽기/쓰기 잠금 의미 불일치였습니다. 다른 하나는 압축 유형 간의 비즈니스 로직 차이점을 이해해야 했습니다. 또 하나는 한 변수는 메가바이트를 사용하고 다른 변수는 바이트를 사용하는 자동 비교 오류였습니다.</p>
<p>이 네 가지의 공통점은 코드가 구문적으로 정확하다는 것입니다. 버그는 개발자의 머릿속에 있는 가정에 있는 것이지, 차이점이나 주변 코드에 있는 것이 아닙니다. 오늘날 AI 코드 리뷰의 한계는 바로 이 지점에 있습니다.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">버그를 발견한 후 어떤 모델이 가장 잘 고칠 수 있을까요?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>코드 리뷰에서는 버그를 찾는 것이 절반의 일입니다. 나머지 절반은 버그를 수정하는 것입니다. 그래서 토론 라운드가 끝난 후 각 모델의 수정 제안이 실제로 얼마나 유용한지 측정하기 위해 동료 평가를 추가했습니다.</p>
<p>이를 측정하기 위해 토론이 끝난 후 동료 평가 라운드를 추가했습니다. 각 모델은 새로운 세션을 열고 익명의 심사위원으로 활동하며 다른 모델의 리뷰에 점수를 매겼습니다. 5명의 모델은 무작위로 리뷰어 A/B/C/D/E에 매핑되었기 때문에 어떤 모델이 어떤 리뷰를 작성했는지 심사위원이 알 수 없었습니다. 각 심사위원은 정확성, 실행 가능성, 깊이, 명확성의 네 가지 차원에 1~10점까지 점수를 매겼습니다.</p>
<table>
<thead>
<tr><th>모델</th><th>정확성</th><th>실행 가능성</th><th>깊이</th><th>명확성</th><th>전체</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8.6 (공동 1위)</td></tr>
<tr><td>클로드</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8.6 (공동 1위)</td></tr>
<tr><td>코덱스</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>쌍둥이자리</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>퀀과 클로드가 근소한 차이로 공동 1위를 차지했습니다. 두 사람 모두 네 가지 항목 모두에서 일관되게 높은 점수를 받은 반면, 코덱스, 제미니, 미니맥스는 그보다 1점 이상 낮은 점수를 받았습니다. 특히, 페어링 분석에서 클로드의 버그 찾기 파트너로 유용함을 입증한 Gemini는 리뷰 품질 부문에서 최하위권에 머물렀습니다. 문제를 잘 발견하는 것과 문제를 해결하는 방법을 잘 설명하는 것은 분명히 다른 기술입니다.</p>
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
    </button></h2><p><strong>Claude는</strong> 가장 어려운 리뷰에 대해 신뢰할 수 있는 서비스입니다. 전체 콜 체인을 통해 작동하고, 깊은 논리 경로를 따르며, 숟가락으로 떠먹여 줄 필요 없이 자체적인 컨텍스트를 가져옵니다. L3 시스템 수준의 버그에 대해서는 다른 어떤 것도 근접하지 못했습니다. 가끔 수학을 과신하기도 하지만, 다른 모델이 틀렸다고 증명하면 그 수학을 인정하고 추론이 무너진 부분을 살펴봅니다. 핵심 코드와 놓쳐서는 안 되는 버그에 사용하세요.</p>
<p><strong>Gemini는</strong> 인기가 많습니다. 코드 스타일과 엔지니어링 표준에 대한 강력한 의견을 가지고 있으며, 문제를 구조적으로 빠르게 파악할 수 있습니다. 단점은 종종 표면에만 머무르고 깊이 파고들지 않는다는 점이며, 이 때문에 동료 평가에서 낮은 점수를 받았습니다. Gemini의 진정한 장점은 도전자로서 다른 모델들이 자신의 작업을 다시 한 번 확인하도록 만드는 것입니다. Claude가 때때로 건너뛰는 구조적 관점을 위해 Claude와 짝을 이룹니다.</p>
<p><strong>코덱스는</strong> 거의 말을 하지 않습니다. 하지만 말을 할 때는 중요합니다. 실제 버그에 대한 적중률이 높고, 다른 사람들이 지나쳐 버린 한 가지를 잡아내는 재주가 있습니다. PR #44474의 예에서 전체 체인을 촉발한 0값 기본 키 문제를 발견한 모델은 Codex였습니다. 기본 모델이 놓친 부분을 잡아내는 보조 검토자라고 생각하면 됩니다.</p>
<p><strong>Qwen은</strong> 다섯 모델 중 가장 다재다능한 모델입니다. 리뷰 품질은 클로드와 비슷했고, 특히 다양한 관점을 종합하여 실제로 실행할 수 있는 수정 제안을 도출하는 데 능숙했습니다. 또한 문맥 지원 모드에서 L2 감지율이 가장 높았기 때문에 일상적인 PR 리뷰를 위한 기본값으로 사용할 수 있습니다. 한 가지 약점은 여러 라운드에 걸친 긴 토론에서 때때로 이전 문맥을 놓치고 이후 라운드에서 일관성 없는 답변을 내놓는다는 점입니다.</p>
<p><strong>미니맥스는</strong> 자체적으로 버그를 찾는 데 가장 취약했습니다. 독립적인 검토자로 사용하기보다는 여러 모델 그룹을 작성하는 데 사용하는 것이 가장 좋습니다.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">이 실험의 한계<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>이 실험에 대해 몇 가지 주의할 점이 있습니다:</p>
<p><strong>샘플 크기가 작습니다.</strong> 동일한 Go/C++ 프로젝트(Milvus)의 PR은 15개에 불과합니다. 이 결과는 모든 언어나 코드베이스에 일반화할 수 없습니다. 확정적인 것이 아니라 방향성을 제시하는 것으로 취급하세요.</p>
<p><strong>모델은 본질적으로 무작위적입니다.</strong> 동일한 프롬프트를 두 번 실행하면 다른 결과가 나올 수 있습니다. 이 게시물의 수치는 단일 스냅샷이며 안정적인 예상 값이 아닙니다. 개별 모델의 순위는 가볍게 여겨야 하지만, 광범위한 추세(토론이 개인보다 우수하고, 다른 모델이 다른 버그 유형에 더 뛰어남)는 일관성이 있습니다.</p>
<p><strong>발언 순서는 고정되었습니다.</strong> 토론은 모든 라운드에서 동일한 순서를 사용했으며, 이는 나중에 발언하는 모델의 반응에 영향을 미쳤을 수 있습니다. 향후 실험에서는 이를 통제하기 위해 라운드별 순서를 무작위로 변경할 수 있습니다.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">직접 해보기<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>이 실험의 모든 도구와 데이터는 오픈 소스입니다:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: 코드 컨텍스트(콜 체인, 관련 PR, 영향을 받는 모듈)를 수집하고 코드 검토를 위한 다중 모델 적대적 토론을 조율하는 오픈 소스 도구입니다.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: 전체 평가 파이프라인, 구성 및 스크립트.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>테스트 사례</strong></a>: 알려진 버그에 주석이 달린 15개의 PR 모두.</p></li>
</ul>
<p>이 실험의 버그는 모두 AI 애플리케이션용으로 구축된 오픈 소스 벡터 데이터베이스인 <a href="https://github.com/milvus-io/milvus">Milvus의</a> 실제 풀 리퀘스트에서 나온 것입니다. <a href="https://discord.com/invite/8uyFbECzPX">Discord와</a> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack에는</a> 꽤 활발한 커뮤니티가 있으며, 더 많은 분들이 코드를 살펴봐 주셨으면 좋겠습니다. 그리고 여러분의 코드베이스에서 이 벤치마크를 실행해 보신다면 그 결과를 공유해 주세요! 다른 언어와 프로젝트에서도 이러한 추세가 유지되는지 정말 궁금합니다.</p>
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5와 MiniMax M2.5, Gemini 3 딥씽크: 귀사의 AI 에이전트 스택에 적합한 모델은 무엇인가요?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">경량 memsearch 플러그인을 사용하여 클로드 코드에 영구 메모리 추가하기</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw의 메모리 시스템을 추출하여 오픈 소스화(memsearch) 하기</a></p></li>
</ul>
