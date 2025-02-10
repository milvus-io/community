---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: 오픈소스로 심층 연구를 구축했으니 여러분도 할 수 있습니다!
author: Stefan Webb
date: 2025-02-6
desc: '밀버스, 딥시크 R1, 랭체인과 같은 오픈 소스 도구를 사용하여 딥 리서치 스타일의 에이전트를 만드는 방법을 알아보세요.'
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>사실 최소한의 범위에서 추론, 계획, 도구 사용 등을 할 수 있는 에이전트로서 위키백과를 사용하여 연구를 수행할 수 있습니다. 그래도 몇 시간 작업하기에는 나쁘지 않습니다...</p>
<p>바위 밑이나 동굴, 외딴 산속 수도원에 살지 않는 한, 2025년 2월 2일에 출시되는 OpenAI의 <em>딥 리서치에</em> 대해 들어보셨을 것입니다. 이 신제품은 대량의 다양한 정보를 종합해야 하는 질문에 답하는 방식에 혁신을 가져올 것입니다.</p>
<p>사용자가 쿼리를 입력하고 딥 리서치 옵션을 선택하면 플랫폼이 자율적으로 웹을 검색하고, 발견한 내용에 대해 추론을 수행하며, 여러 소스를 종합하여 일관성 있고 완전히 인용된 보고서를 작성합니다. 표준 챗봇에 비해 결과물을 생성하는 데 몇 배 더 오래 걸리지만, 그 결과물은 더 상세하고, 더 많은 정보를 제공하며, 더 미묘한 차이가 있습니다.</p>
<h2 id="How-does-it-work" class="common-anchor-header">어떻게 작동하나요?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>그렇다면 이 기술은 어떻게 작동하며, 딥 리서치가 이전 시도(예: Google의 <em>딥 리서치</em> - 상표권 분쟁 알림)에 비해 눈에 띄게 개선된 이유는 무엇일까요? 후자는 다음 포스팅에서 다루도록 하겠습니다. 전자의 경우, 딥 리서치의 근간에는 의심할 여지없이 많은 '비밀 소스'가 숨겨져 있습니다. OpenAI의 출시 포스팅에서 몇 가지 세부 정보를 얻을 수 있는데, 이를 요약해 보겠습니다.</p>
<p><strong>딥 리서치는 추론 작업에 특화된 기초 모델의 최근 발전을 활용합니다:</strong></p>
<ul>
<li><p>"...곧 출시될 OpenAI o3 추론 모델에 대한 미세 조정..."</p></li>
<li><p>"...추론을 활용하여 방대한 양의 텍스트를 검색, 해석 및 분석합니다..."</p></li>
</ul>
<p><strong>딥 리서치는 계획, 반영, 메모리를 갖춘 정교한 에이전트 워크플로우를 활용합니다:</strong></p>
<ul>
<li><p>"...다단계 궤적을 계획하고 실행하는 법을 배웠습니다..."</p></li>
<li><p>"...실시간 정보에 대한 역추적 및 반응..."</p></li>
<li><p>"...마주치는 정보에 반응하여 필요에 따라 피벗..."</p></li>
</ul>
<p><strong>딥 리서치는 여러 유형의 미세 조정을 사용하여 독점 데이터에 대해 학습되며, 이는 성능의 핵심 요소일 가능성이 높습니다:</strong></p>
<ul>
<li><p>"...다양한 도메인에 걸친 하드 브라우징 및 추론 작업에 대해 엔드투엔드 강화 학습을 사용하여 훈련되었습니다..."</p></li>
<li><p>"...웹 브라우징 및 데이터 분석에 최적화..."</p></li>
</ul>
<p>에이전트 워크플로우의 정확한 설계는 비밀이지만, 에이전트를 구성하는 방법에 대한 잘 정립된 아이디어를 바탕으로 직접 구축할 수 있습니다.</p>
<p><strong>시작하기 전에 한</strong> 가지<strong>주의할</strong> 점이 있습니다: 특히 한 단계 개선된 것처럼 보이는 신제품이 출시되면 제너레이티브 AI 열풍에 휩쓸리기 쉽습니다. 그러나 OpenAI도 인정하듯이 딥 리서치에는 제너레이티브 AI 기술에 공통적인 한계가 있습니다. 결과물에 허위 사실('착각'), 잘못된 서식 및 인용이 포함될 수 있고 무작위 시드에 따라 품질이 크게 달라질 수 있다는 점에서 비판적으로 생각해야 한다는 점을 기억해야 합니다.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">직접 만들 수 있나요?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>물론이죠! 오픈소스 도구를 사용하여 로컬에서 실행되는 자체 '심층 연구'를 구축해 보세요. 생성 AI에 대한 기본적인 지식과 상식, 몇 시간의 여유 시간, GPU, 그리고 오픈 소스인 <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>, <a href="https://python.langchain.com/docs/introduction/">LangChain만</a> 있으면 됩니다.</p>
<p>물론 OpenAI의 성능을 그대로 재현할 수는 없지만, 저희의 프로토타입은 추론 모델의 발전과 에이전트 워크플로우의 발전을 결합하여 그 기술의 근간이 되는 몇 가지 핵심 아이디어를 최소한으로 보여줄 것입니다. 중요한 것은 OpenAI와는 달리 오픈 소스 도구만 사용할 것이며, 시스템을 로컬에 배포할 수 있다는 점입니다. 오픈 소스는 확실히 뛰어난 유연성을 제공합니다!</p>
<p>프로젝트의 범위를 줄이기 위해 몇 가지 단순화 가정을 해보겠습니다:</p>
<ul>
<li><p>로컬에서 실행할 수 있는 4비트로 <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">정량화된</a> 오픈소스 추론 모드를 사용할 것입니다.</p></li>
<li><p>추론 모델에 대한 추가적인 미세 조정은 직접 수행하지 않습니다.</p></li>
<li><p>에이전트가 사용할 수 있는 유일한 도구는 Wikipedia 페이지를 다운로드하여 읽고 별도의 RAG 쿼리를 수행하는 기능뿐입니다(전체 웹에 액세스할 수 없음).</p></li>
<li><p>에이전트는 이미지, PDF 등이 아닌 텍스트 데이터만 처리합니다.</p></li>
<li><p>에이전트는 백트래킹이나 피벗을 고려하지 않습니다.</p></li>
<li><p>에이전트는 (아직은) 출력을 기반으로 실행 흐름을 제어합니다.</p></li>
<li><p>위키피디아에는 진실, 모든 진실, 그리고 진실만이 담겨 있습니다.</p></li>
</ul>
<p>벡터 데이터베이스에는 <a href="https://milvus.io/docs">Milvus를</a>, 추론 모델로는 <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1을</a>, RAG 구현에는 <a href="https://python.langchain.com/docs/introduction/">LangChain을</a> 사용할 것입니다. 시작해보겠습니다!</p>
<custom-h1>온라인 리서치를 위한 최소한의 에이전트</custom-h1><p>인간이 연구를 수행하는 방식에 대한 정신 모델을 사용하여 에이전트 워크플로우를 설계할 것입니다:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">질문 정의/정의</h3><p>리서치는 질문을 정의하는 것으로 시작됩니다. 질문을 사용자의 질문으로 간주하되, 추론 모델을 사용하여 질문이 구체적이고 명확하며 집중력 있는 방식으로 표현되도록 합니다. 즉, 첫 번째 단계는 프롬프트를 다시 작성하고 하위 쿼리 또는 하위 질문을 추출하는 것입니다. 추론에 특화된 기본 모델과 JSON 구조화된 출력을 위한 간단한 방법을 효과적으로 활용합니다.</p>
<p>다음은 "시간이 지남에 따라 캐스트가 어떻게 변했나요?"라는 질문을 DeepSeek가 추론하는 추론 추적의 예입니다:</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">검색</h3><p>다음으로, Wikipedia 문서에 대한 "문헌 검토"를 수행합니다. 지금은 하나의 기사를 읽고 향후 반복을 위한 탐색 링크를 남겨둡니다. 프로토타이핑 과정에서 각 링크에 추론 모델을 호출해야 하는 경우 링크 탐색이 매우 비싸질 수 있다는 사실을 발견했습니다. 저희는 메모를 하듯 기사를 파싱하고 그 데이터를 벡터 데이터베이스인 Milvus에 저장합니다.</p>
<p>다음은 LangChain 통합을 사용해 Milvus에 Wikipedia 페이지를 저장하는 방법을 보여주는 코드 스니펫입니다:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">분석</h3><p>에이전트가 질문으로 돌아가서 문서의 관련 정보를 기반으로 질문에 답변합니다. 향후 작업을 위해 다단계 분석/반영 워크플로우와 출처의 신뢰성 및 편향성에 대한 비판적 사고를 남길 것입니다.</p>
<p>다음은 LangChain으로 RAG를 구성하고 하위 질문에 개별적으로 답변하는 코드 스니펫입니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">합성</h3><p>에이전트가 조사를 수행한 후, 조사 결과에 대한 구조화된 개요, 즉 골격을 만들어 보고서에 요약합니다. 그런 다음 각 섹션을 완성하여 섹션 제목과 해당 콘텐츠로 채웁니다. 향후 반복 작업을 위해 반영, 재정렬 및 재작성을 통해 보다 정교한 워크플로우를 남깁니다. 에이전트의 이 부분에는 계획, 도구 사용 및 메모리가 포함됩니다.</p>
<p>전체 코드와 <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">저장된 보고서 파일의</a> 예시 출력은 <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">첨부된 노트북을</a> 참조하세요.</p>
<h2 id="Results" class="common-anchor-header">결과<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>테스트 쿼리는 <em>"심슨 가족은 시간이 지남에 따라 어떻게 변했나요?"</em> 이며 데이터 소스는 "심슨 가족"에 대한 Wikipedia 문서입니다. 다음은 <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">생성된 보고서의</a> 한 섹션입니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">요약: 구축한 내용 및 다음 단계<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>단 몇 시간 만에 Wikipedia에서 정보를 추론하고, 계획하고, 검색하여 구조화된 연구 보고서를 생성할 수 있는 기본적인 에이전트 워크플로우를 설계했습니다. 이 프로토타입은 OpenAI의 딥 리서치와는 거리가 멀지만, 자율 리서치 에이전트를 구축하는 데 있어 Milvus, DeepSeek, LangChain과 같은 오픈 소스 도구의 힘을 보여줍니다.</p>
<p>물론 개선의 여지는 많습니다. 앞으로 더 개선될 수 있습니다:</p>
<ul>
<li><p>Wikipedia를 넘어 여러 소스를 동적으로 검색하도록 확장</p></li>
<li><p>역추적 및 반영을 도입하여 응답을 구체화하기 위해</p></li>
<li><p>에이전트의 자체 추론에 기반한 실행 흐름 최적화</p></li>
</ul>
<p>오픈 소스는 폐쇄형 소스에는 없는 유연성과 제어 기능을 제공합니다. 학술 연구, 콘텐츠 합성, AI 기반 지원 등 어떤 분야에서든 자체 연구 에이전트를 구축하면 흥미로운 가능성이 열립니다. 다음 포스팅에서는 실시간 웹 검색, 다단계 추론, 조건부 실행 흐름을 추가하는 방법을 살펴볼 예정이니 기대해 주세요!</p>
<h2 id="Resources" class="common-anchor-header">리소스<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>노트북: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>오픈소스 심층 연구를 위한 기준선</em></a><em>"</em></p></li>
<li><p>보고서 <em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>콘텐츠, 유머, 캐릭터 개발, 애니메이션, 사회에서의 역할 등 시간의 흐름에 따른 쇼로서의 심슨 가족의 진화</em></a><em>."</em></p></li>
<li><p><a href="https://milvus.io/docs">밀버스 벡터 데이터베이스 문서</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">증류 및 정량화된 DeepSeek R1 모델 페이지</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">딥 리서치 FAQ | OpenAI 도움말 센터</a></p></li>
</ul>
