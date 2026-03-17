---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: '월 $20에 OpenClaw, Exa, Milvus로 재고 모니터링 에이전트를 구축했습니다.'
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  오픈클로, 엑사, 밀버스를 사용해 AI 주식 모니터링 에이전트를 구축하는 단계별 가이드입니다. 월 20달러로 모닝 브리핑, 거래 메모리,
  알림을 이용할 수 있습니다.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>저는 부업으로 미국 주식을 거래하는데, 취미로 돈을 잃는다고 정중하게 표현하는 것이 맞습니다. 동료들은 제 전략이 "흥분하면 비싸게 사고, 두려우면 싸게 팔고, 매주 반복하는 것"이라고 농담을 하곤 합니다.</p>
<p>반복되는 부분이 저를 힘들게 합니다. 매번 시장을 바라볼 때마다 계획에 없던 거래를 하게 되니까요. 유가가 급등하면 패닉 매도합니다. 기술주 한 종목이 4% 급등하면 그 종목을 쫓아갑니다. 일주일 후, 제 거래 내역을 살펴보니 <em>지난 분기에도 똑같은 일을 하지 않았나요?</em></p>
<p>그래서 저 대신 시장을 감시하고 같은 실수를 하지 않도록 막아주는 에이전트를 OpenClaw로 만들었습니다. 이 에이전트는 제 돈을 거래하거나 건드리지 않습니다. 보안 위험이 너무 크기 때문이죠. 대신 시장 관찰에 소요되는 시간을 절약하고 같은 실수를 반복하지 않도록 도와줍니다.</p>
<p>이 에이전트는 세 부분으로 구성되어 있으며 월 20달러 정도입니다:</p>
<ul>
<li><strong>이 모든 것을 자동 조종으로 실행하기 위한</strong><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>.</strong> OpenClaw는 30분 주기로 에이전트를 실행하고 실제로 중요한 일이 있을 때만 핑을 보내주므로 화면에 계속 붙어 있던 FOMO를 완화해 줍니다. 이전에는 가격을 더 많이 볼수록 충동적으로 반응했습니다.</li>
<li><strong>정확한 실시간 검색을 위한</strong><strong><a href="https://exa.ai/">Exa</a></strong> <strong>.</strong> Exa는 일정에 따라 엄선된 정보 소스를 검색하고 요약해 주기 때문에 매일 아침 깔끔한 브리핑을 받을 수 있습니다. 이전에는 신뢰할 수 있는 뉴스를 찾기 위해 하루에 한 시간씩 SEO 스팸과 추측성 뉴스를 샅샅이 뒤지는데, 금융 사이트는 스크레이퍼와 싸우기 위해 매일 업데이트되기 때문에 이 작업을 자동화할 수 없었습니다.</li>
<li><strong>개인 거래 내역과 선호도를 위한</strong><strong><a href="https://milvus.io/">M****ilvus</a></strong> <strong>.</strong> Milvus는 제 거래 내역을 저장하고, 제가 결정을 내리기 전에 에이전트가 이를 검색하여 후회했던 일을 반복하려는 경우 이를 알려줍니다. 이전에는 과거 거래를 검토하는 것이 번거로워서 하지 않았기 때문에 다른 시세에서 같은 실수가 계속 발생했습니다. <a href="https://zilliz.com/cloud">질리즈 클라우드는</a> 밀버스의 완전 관리형 버전입니다. 번거로움 없는 환경을 원한다면 Zilliz Cloud가 훌륭한 옵션입니다<a href="https://cloud.zilliz.com/signup?utm_page=zilliz-cloud-free-tier&amp;utm_button=banner_left&amp;_gl=1*373c3v*_gcl_au*MjEwODY2Nzk5NS4xNzY5Njg1NzY4*_ga*MTU0OTAxMzY5Ni4xNzY5Njg1NzY4*_ga_Q1F8R2NWDP*czE3NzM0MDYzOTEkbzUwJGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..*_ga_KKMVYG8YF2*czE3NzM0MDYzOTEkbzc0JGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..">(무료 티어 사용 가능</a>).</li>
</ul>
<p>단계별로 설정하는 방법은 다음과 같습니다.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">1단계: Exa로 실시간 시장 정보 얻기<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>전에는 금융 앱을 검색하고, 스크레이퍼를 작성하고, 전문 데이터 단말기를 살펴본 적이 있습니다. 제 경험은 어땠나요?  앱은 노이즈에 신호를 묻어버렸고, 스크레이퍼는 계속 고장 났으며, 전문 API는 엄청나게 비쌌습니다.  Exa는 위의 문제를 해결하는 AI 에이전트를 위해 구축된 검색 API입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa는</a></strong> AI 에이전트를 위해 구조화된 AI 지원 데이터를 반환하는 웹 검색 API입니다. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus의 완전 관리형 서비스)로 구동됩니다. 퍼플렉시티가 사람이 사용하는 검색 엔진이라면, 엑사는 AI가 사용하는 검색 엔진입니다. 에이전트가 쿼리를 보내면 Exa는 기사 텍스트, 핵심 문장, 요약을 JSON이라는 구조화된 출력으로 반환하여 에이전트가 스크래핑 없이도 직접 파싱하고 작업할 수 있습니다.</p>
<p>Exa는 또한 내부적으로 시맨틱 검색을 사용하므로 에이전트가 자연어로 쿼리할 수 있습니다. "2026년 4분기 실적 호조에도 불구하고 NVIDIA 주가가 하락한 이유"와 같은 쿼리는 SEO 클릭베이트 페이지가 아니라 로이터와 블룸버그의 애널리스트 분석 결과를 반환합니다.</p>
<p>Exa는 무료 티어(한 달에 1,000건의 검색)를 제공하며, 이는 시작하기에 충분한 수준입니다. 따라 하려면 SDK를 설치하고 자체 API 키를 교체하세요:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>핵심 호출은 다음과 같습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>텍스트는 전체 기사를 가져오고, 하이라이트는 핵심 문장을 추출하며, 요약은 사용자가 입력한 질문에 따라 집중적인 요약을 생성하는 등 대부분의 무거운 작업을 콘텐츠 매개변수가 처리합니다. 한 번의 API 호출로 20분에 걸친 탭 이동을 대체할 수 있습니다.</p>
<p>이 기본 패턴은 많은 것을 포괄하지만, 저는 정기적으로 마주치는 다양한 상황을 처리하기 위해 네 가지 변형을 만들었습니다:</p>
<ul>
<li><strong>출처 신뢰도를 기준으로 필터링하기.</strong> 수익 분석의 경우, 12시간 후에 리포트를 다시 작성하는 콘텐츠 팜이 아니라 로이터, 블룸버그 또는 월스트리트 저널만 원합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>비슷한 분석 찾기.</strong> 하나의 좋은 기사를 읽었을 때 수동으로 검색하지 않고도 같은 주제에 대한 더 많은 관점을 원합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>복잡한 질문에 대한 심층 검색.</strong> 중동 긴장이 반도체 공급망에 미치는 영향과 같이 단일 기사로는 답을 얻을 수 없는 질문도 있습니다. 심층 검색은 여러 소스를 종합하여 구조화된 요약을 반환합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>실시간 뉴스 모니터링.</strong> 장 중에는 현재 시간으로만 필터링된 뉴스 속보가 필요합니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>저는 이러한 패턴을 사용하여 연준 정책, 기술 기업 실적, 유가, 거시 지표를 다루는 템플릿을 12개 정도 만들었습니다. 매일 아침 자동으로 실행되고 결과를 제 휴대폰으로 푸시합니다. 예전에는 한 시간이 걸리던 검색이 이제는 커피를 마시며 5분이면 요약을 읽을 수 있습니다.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">2단계: 밀버스에 거래 내역을 저장하여 더 현명한 의사 결정하기<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa는 제 정보 문제를 해결해 주었습니다. 하지만 저는 여전히 하락장에서 패닉 매도를 했다가 며칠 만에 회복하고, 이미 고가인 주식에 모멘텀을 쫓는 등 같은 거래를 반복하고 있었습니다. 감정에 따라 행동하고, 후회하고, 비슷한 상황이 닥쳤을 때쯤이면 교훈을 잊어버리곤 했죠.</p>
<p>저는 과거의 거래, 추론, 실수를 저장할 수 있는 개인 지식 기반이 필요했습니다. 제가 수동으로 검토해야 하는 것이 아니라(그렇게 하려고 시도했지만 실패했습니다), 비슷한 상황이 발생할 때마다 에이전트가 스스로 검색할 수 있는 것이었습니다. 실수를 반복할 것 같으면 버튼을 누르기 전에 상담원에게 미리 알려주었으면 좋겠어요. '현재 상황'과 '과거 경험'을 일치시키는 것은 벡터 데이터베이스가 해결하는 유사성 검색 문제이므로 저는 데이터를 저장할 데이터베이스를 선택했습니다.</p>
<p>저는 로컬에서 실행되는 Milvus의 경량 버전인 Milvus <a href="https://github.com/milvus-io/milvus-lite">Lite를</a> 사용했습니다. 서버 세팅이 필요 없고 프로토타이핑과 실험에 적합합니다. 저는 데이터를 세 개의 컬렉션으로 나누었습니다. 임베딩 차원은 1536으로 OpenAI의 텍스트 임베딩 3-소형 모델과 일치하여 바로 사용할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>세 가지 컬렉션은 각각 다른 검색 전략을 가진 세 가지 유형의 개인 데이터에 매핑됩니다:</p>
<table>
<thead>
<tr><th><strong>유형</strong></th><th><strong>저장하는 내용</strong></th><th><strong>상담원이 사용하는 방법</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>기본 설정</strong></td><td>편견, 위험 감수성, 투자 철학("저는 기술 주식을 너무 오래 보유하는 경향이 있습니다")</td><td>실행할 때마다 상담원의 컨텍스트에 로드됨</td></tr>
<tr><td><strong>의사 결정 및 패턴</strong></td><td>특정 과거 거래, 교훈, 시장 관찰 정보</td><td>관련 상황이 발생했을 때만 유사성 검색을 통해 검색됨</td></tr>
<tr><td><strong>외부 지식</strong></td><td>연구 보고서, SEC 제출 자료, 공개 데이터</td><td>Milvus에 저장되지 않음 - Exa를 통해 검색 가능</td></tr>
</tbody>
</table>
<p>이 세 가지 컬렉션을 하나의 컬렉션으로 통합하면 관련 없는 거래 내역으로 모든 프롬프트가 부풀어 오르거나 현재 쿼리와 충분히 일치하지 않을 때 핵심 편향이 사라질 수 있기 때문에 세 가지 컬렉션을 구축했습니다.</p>
<p>일단 컬렉션이 만들어지면 자동으로 채울 수 있는 방법이 필요했습니다. 상담원과 대화할 때마다 정보를 복사하여 붙여넣고 싶지 않았기 때문에 각 채팅 세션이 끝날 때마다 실행되는 메모리 추출기를 만들었습니다.</p>
<p>이 추출기는 추출과 중복 제거라는 두 가지 작업을 수행합니다. 추출기는 대화에서 의사 결정, 선호도, 패턴, 교훈 등 구조화된 인사이트를 추출하도록 LLM에 요청하고 각 인사이트를 적절한 컬렉션으로 라우팅합니다. 무엇이든 저장하기 전에 이미 있는 것과 유사성을 확인합니다. 새로운 인사이트가 기존 항목과 92% 이상 유사하면 건너뛰게 됩니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>새로운 시장 상황에 직면하여 거래하고 싶은 충동이 생기면 에이전트는 리콜 기능을 실행합니다. 제가 무슨 일이 일어나고 있는지 설명하면 세 가지 컬렉션 모두에서 관련 기록을 검색합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>예를 들어 3월 초 중동 긴장으로 기술주가 3~4% 하락했을 때 에이전트는 지정학적 하락기에 패닉 매도하지 말라는 2024년 10월의 교훈, 지정학적 리스크에 비중을 두는 경향이 있다는 선호도 메모, 제가 기록한 패턴(지정학으로 인한 기술주 매도는 일반적으로 1~3주 안에 회복) 등 세 가지를 가져왔습니다.</p>
<p>제 동료의 의견: 트레이닝 데이터가 손실 기록이라면 AI는 정확히 무엇을 학습하고 있는 것일까요? 에이전트가 제 트레이딩을 따라하는 것이 아니라 기억해 두었다가 다음 트레이딩에서 저에게 조언을 해준다는 것이 요점입니다.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">3단계: 에이전트에게 OpenClaw 스킬로 분석 교육하기<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>이 시점에서 에이전트는 신뢰할 수 있는 정보<a href="https://exa.ai/">(Exa</a>)와 개인 기억<a href="https://github.com/milvus-io/milvus-lite">(Milvus)</a>을 가지고 있습니다. 하지만 이 두 가지를 모두 LLM에게 넘겨주고 "이걸 분석해줘"라고 하면 일반적인 모든 것을 헤지하는 응답이 돌아옵니다. 가능한 모든 각도를 언급하고 "투자자는 위험을 고려해야 합니다."라고 결론을 내립니다. 차라리 아무 말도 하지 않는 것이 나을 수도 있습니다.</p>
<p>해결 방법은 자신만의 분석 프레임워크를 작성하여 상담원에게 명시적인 지침으로 제공하는 것입니다. 어떤 지표를 중요하게 생각하는지, 어떤 상황을 위험하다고 생각하는지, 언제 보수적이어야 하고 공격적이어야 하는지 알려줘야 합니다. 이러한 규칙은 투자자마다 다르므로 직접 정의해야 합니다.</p>
<p>OpenClaw는 스킬/ 디렉토리에 있는 마크다운 파일인 스킬을 통해 이를 수행합니다. 에이전트가 관련 상황에 직면하면 그에 맞는 스킬을 로드하고 자유자재로 움직이지 않고 프레임워크를 따릅니다.</p>
<p>다음은 실적 발표 후 주식을 평가하기 위해 작성한 것입니다:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>마지막 줄이 가장 중요합니다. "항상 과거의 실수를 드러내라. 저는 두려움이 데이터보다 우선하는 경향이 있습니다. 밀버스 기록에 따르면 하락 후 매도한 것을 후회한 적이 있다면 명확하게 말하세요." 이렇게 하면 상담원에게 제가 어디에서 잘못했는지 정확히 알려주므로 언제 뒤로 물러나야 하는지 알 수 있습니다. 직접 작성한다면 이 부분은 자신의 편견에 따라 사용자 지정할 수 있습니다.</p>
<p>저는 감정 분석, 매크로 지표, 섹터 회전 신호에 대해서도 비슷한 스킬을 작성했습니다. 또한 제가 존경하는 투자자들이 같은 상황을 어떻게 평가할지 시뮬레이션하는 스킬, 즉 버핏의 가치 프레임워크, 브릿지워터의 거시적 접근 방식을 시뮬레이션하는 스킬도 만들었습니다. 이는 의사 결정자가 아니라 추가적인 관점입니다.</p>
<p>경고: LLM이 RSI나 MACD와 같은 기술적 지표를 계산하게 두지 마세요. 그들은 자신 있게 숫자를 계산합니다. 직접 계산하거나 전용 API를 호출하여 그 결과를 스킬에 입력으로 제공하세요.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">4단계: OpenClaw 하트비트로 에이전트 시작하기<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 모든 작업은 여전히 수동으로 트리거해야 합니다. 업데이트를 원할 때마다 터미널을 열어야 한다면, 회의 중에 중개 앱을 다시 스크롤하는 것과 마찬가지입니다.</p>
<p>OpenClaw의 하트비트 메커니즘은 이 문제를 해결합니다. 게이트웨이가 30분마다(설정 가능) 상담원에게 핑을 보내고, 상담원은 HEARTBEAT.md 파일을 확인하여 그 순간에 수행할 작업을 결정합니다. 이 파일은 시간 기반 규칙이 있는 마크다운 파일입니다:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">결과: 화면 사용 시간 감소, 충동적인 거래 감소<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>시스템이 실제로 매일 생성하는 내용은 다음과 같습니다:</p>
<ul>
<li><strong>아침 요약(오전 7시).</strong> 에이전트가 밤새 Exa를 실행하고 Milvus에서 내 포지션과 관련 기록을 가져와 500단어 미만의 개인화된 요약을 휴대폰으로 푸시합니다. 밤새 무슨 일이 있었는지, 제 보유 포지션과 어떤 관련이 있는지, 1~3개의 실행 항목이 포함되어 있습니다. 양치질을 하면서 읽었습니다.</li>
<li><strong>일중 알림(오전 9시 30분~오후 4시(동부표준시)).</strong> 30분마다 상담원이 제 관심 종목 목록을 확인합니다. 주식이 3% 이상 움직이면 매수 이유, 손절가 위치, 이전에 비슷한 상황에 처한 적이 있는지 등 맥락이 담긴 알림을 받습니다.</li>
<li><strong>주간 검토(주말).</strong> 에이전트는 시장 움직임, 아침 예상과 비교한 결과, 기억해야 할 패턴 등 한 주간의 모든 것을 정리해 줍니다. 저는 토요일에 30분 동안 이 자료를 읽습니다. 나머지 주중에는 일부러 화면을 멀리합니다.</li>
</ul>
<p>마지막 점이 가장 큰 변화입니다. 에이전트 덕분에 시간을 절약할 수 있을 뿐만 아니라 시장을 주시하지 않아도 되니까요. 가격을 보고 있지 않으면 당황해서 판매할 수 없으니까요.</p>
<p>이 시스템을 사용하기 전에는 정보 수집, 시장 모니터링, 거래 검토에 일주일에 10~15시간을 회의, 출퇴근 시간, 늦은 밤 스크롤링 등으로 흩어져 보냈습니다. 이제는 매일 아침 브리핑에 5분, 주말 검토에 30분씩 더해 2시간 정도면 충분합니다.</p>
<p>정보의 질도 더 좋아졌습니다. 트위터에서 화제가 된 내용 대신 로이터와 블룸버그의 요약본을 읽고 있습니다. 그리고 제가 행동하고 싶은 유혹을 느낄 때마다 에이전트가 과거의 실수를 알려주니 충동적인 거래가 크게 줄었습니다. 아직 제가 더 나은 투자자가 되었다는 것을 증명할 수는 없지만 덜 무모한 투자자가 된 것은 분명합니다.</p>
<p>총 비용: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">OpenClaw</annotation><mrow><mn>월</mn><mi>10달러</mi></mrow><annotation encoding="application/x-tex">, OpenClaw</annotation></semantics></math></span></span>월 10달러, <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">월</span><span class="mord mathnormal" style="margin-right:0.02691em;">10달러</span><span class="mpunct">,</span></span></span></span>Exa 월 10달러, Milvus Lite를 계속 실행하기 위한 약간의 전기료.</p>
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
    </button></h2><p>저는 정보가 좋지 않아서 충동적인 거래를 계속했고, 내 기록을 거의 검토하지 않았으며, 하루 종일 시장을 쳐다보는 것이 상황을 악화시켰습니다. 그래서 저는 다음 세 가지를 수행하여 이러한 문제를 해결하는 AI 에이전트를 만들었습니다:</p>
<ul>
<li><strong><a href="https://exa.ai/">Exa로</a></strong><strong>신뢰할 수 있는 시장 뉴스를 수집하여</strong> 한 시간 동안 SEO 스팸과 유료 사이트를 스크롤하는 일을 대신합니다.</li>
<li><a href="http://milvus.io">Milvus를</a> 통해<strong>과거 거래를 기억하고</strong> 이미 후회했던 실수를 반복하려고 할 때 경고해 줍니다.</li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw와</a> 함께<strong>자동 조종으로 실행되며</strong> 실제로 중요한 일이 있을 때만 저에게 핑을 보냅니다.</li>
</ul>
<p>총 비용: 월 $20. 에이전트는 제 돈을 거래하거나 건드리지 않습니다.</p>
<p>가장 큰 변화는 데이터나 알림이 아니었습니다. 제가 시장을 보지 않게 된 것입니다. 지난 수요일에는 완전히 잊어버렸는데, 수년간 트레이딩을 하면서 이런 일은 처음이었습니다. 여전히 가끔 손실을 보지만 그 빈도가 훨씬 줄어들었고 주말을 다시 즐기게 되었습니다. 동료들은 아직 농담을 업데이트하지 않았지만 시간을 두고 지켜봐 주세요.</p>
<p>에이전트도 구축하는 데 주말 이틀밖에 걸리지 않았습니다. 1년 전 같았으면 스케줄러, 알림 파이프라인, 메모리 관리를 처음부터 다시 작성해야 했을 것입니다. OpenClaw를 사용하면 대부분의 시간을 인프라를 작성하는 것이 아니라 저만의 거래 규칙을 명확히 하는 데 할애할 수 있습니다.</p>
<p>그리고 한 가지 사용 사례에 맞게 구축한 후에는 아키텍처를 이식할 수 있습니다.  Exa 검색 템플릿과 OpenClaw 스킬을 교체하면 연구 논문을 모니터링하고, 경쟁사를 추적하고, 규제 변화를 주시하고, 공급망 중단을 추적하는 에이전트가 생깁니다.</p>
<p>사용해 보세요:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작</a></strong> - 5분 이내에 로컬에서 벡터 데이터베이스를 실행할 수 있습니다.</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>문서</strong> - 스킬 및 하트비트로 첫 번째 에이전트 설정하기</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 시작 시 매월 1,000건의 무료 검색 제공</li>
</ul>
<p>질문이 있거나, 디버깅에 도움이 필요하거나, 구축한 것을 자랑하고 싶으신가요? 커뮤니티와 팀 모두로부터 도움을 받을 수 있는 가장 빠른 방법인 <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a> 채널에 가입하세요. 설정에 대해 일대일로 이야기하고 싶다면 20분 동안 진행되는 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus 오피스 아워를</a> 예약하세요 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">.</a></p>
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">오픈클로(이전의 클로봇 및 몰트봇) 설명: 자율 AI 에이전트에 대한 완벽한 가이드</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack으로 OpenClaw(이전의 Clawdbot/Moltbot)를 설정하는 단계별 가이드</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">OpenClaw와 같은 AI 에이전트가 토큰을 소모하는 이유와 비용을 절감하는 방법</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw의 메모리 시스템을 추출하여 오픈 소스화(memsearch)한 방법</a></li>
</ul>
