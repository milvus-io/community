---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: '딥서처를 소개합니다: 로컬 오픈 소스 심층 연구'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  OpenAI의 딥 리서치와 달리, 이 예제는 Milvus 및 LangChain과 같은 오픈 소스 모델과 도구만 사용하여 로컬에서
  실행되었습니다.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="deep researcher.gif" class="doc-image" id="deep-researcher.gif" />
   </span> <span class="img-wrapper"> <span>심층 연구자.gif</span> </span></p>
<p>이전 게시물 <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"오픈소스로 딥 리서치를 구축했습니다. 여러분도 할 수 있습니다!"</em></a>에서는 리서치 에이전트의 기본 원리 몇 가지를 설명하고 주어진 주제나 질문에 대한 자세한 보고서를 생성하는 간단한 프로토타입을 만들었습니다. 이 글과 해당 노트북에서는 <em>도구 사용</em>, <em>쿼리 분해</em>, <em>추론</em>, <em>성찰의</em> 기본 개념을 설명했습니다. 이전 포스팅의 예시는 OpenAI의 딥 리서치와는 달리 <a href="https://milvus.io/docs">Milvus와</a> LangChain 같은 오픈 소스 모델과 도구만을 사용해 로컬에서 실행되었습니다. (계속하기 전에 <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">위의 글을</a> 읽어보시기 바랍니다.)</p>
<p>그 후 몇 주 동안 OpenAI의 딥 리서치를 이해하고 재현하는 데 대한 관심이 폭발적으로 증가했습니다. 예를 들어 <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">퍼플렉시티 딥 리서치와</a> <a href="https://huggingface.co/blog/open-deep-research">허깅 페이스의 오픈 딥리서치를</a> 살펴보시기 바랍니다. 이러한 도구는 웹이나 내부 문서를 서핑하여 주제나 질문을 반복적으로 조사하고 상세하고 정보에 입각한 체계적인 보고서를 출력한다는 목표는 공유하지만 아키텍처와 방법론은 서로 다릅니다. 중요한 것은 기본 에이전트가 각 중간 단계에서 어떤 조치를 취해야 하는지에 대한 추론을 자동화한다는 점입니다.</p>
<p>이번 포스팅에서는 이전 포스팅을 기반으로 Zilliz의 <a href="https://github.com/zilliztech/deep-searcher">딥서처</a> 오픈소스 프로젝트를 소개합니다. 이 에이전트는 <em>쿼리 라우팅, 조건부 실행 흐름</em>, <em>도구로서의 웹 크롤링이라는</em> 추가 개념을 보여줍니다. Jupyter 노트북이 아닌 Python 라이브러리와 명령줄 도구로 제공되며 이전 게시물보다 더 완전한 기능을 갖추고 있습니다. 예를 들어, 여러 소스 문서를 입력할 수 있고 구성 파일을 통해 임베딩 모델과 벡터 데이터베이스를 설정할 수 있습니다. 아직은 비교적 단순하지만, DeepSearcher는 에이전트 RAG의 훌륭한 쇼케이스이며 최첨단 AI 애플리케이션을 향한 한 걸음 더 나아간 것입니다.</p>
<p>또한 더 빠르고 효율적인 추론 서비스의 필요성에 대해서도 살펴봅니다. 추론 모델은 "추론 확장", 즉 추가 계산을 사용하여 결과를 개선하며, 단일 보고서에 수백 또는 수천 개의 LLM 호출이 필요할 수 있다는 사실과 결합하여 추론 대역폭이 주요 병목 현상이 됩니다. 저희는 <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">삼바노바의 맞춤형 하드웨어에서</a> 초당 출력 토큰 수가 가장 가까운 경쟁사보다 두 배 빠른 <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">DeepSeek-R1 추론 모델을</a> 사용합니다(아래 그림 참조).</p>
<p>삼바노바 클라우드는 Llama 3.x, Qwen2.5, QwQ 등 다른 오픈 소스 모델에 대한 추론 서비스도 제공합니다. 추론 서비스는 재구성 가능한 데이터 흐름 장치(RDU)라는 SambaNova의 맞춤형 칩에서 실행되며, 이는 생성형 AI 모델에서 효율적인 추론을 위해 특별히 설계되어 비용을 낮추고 추론 속도를 높입니다. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">웹사이트에서 자세히 알아보세요.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output speed- deepseek r1.png" class="doc-image" id="output-speed--deepseek-r1.png" />
   </span> <span class="img-wrapper"> <span>출력 속도 - deepseek r1.png</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">딥서치 아키텍처<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">딥서치어의</a> 아키텍처는 이전 게시물과 마찬가지로 문제를 <em>정의/세분화</em>, <em>조사</em>, <em>분석</em>, <em>종합의</em> 네 단계로 나누고 있지만, 이번에는 일부 중복되는 부분이 있습니다. 각 단계를 살펴보면서 <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher의</a>개선 사항을 강조합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="deepsearcher architecture.png" class="doc-image" id="deepsearcher-architecture.png" />
   </span> <span class="img-wrapper"> <span>딥서치어 아키텍처.png</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">질문 정의 및 구체화</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>딥서처의 설계에서는 질문을 조사하는 것과 구체화하는 것의 경계가 모호합니다. 초기 사용자 쿼리는 이전 게시물과 마찬가지로 하위 쿼리로 분해됩니다. "심슨 가족은 시간이 지남에 따라 어떻게 변했나요?"라는 쿼리에서 생성된 초기 하위 쿼리는 위를 참조하세요. 그러나 다음 연구 단계에서는 필요에 따라 질문을 계속 구체화할 것입니다.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">조사 및 분석</h3><p>쿼리를 하위 쿼리로 세분화했으면 에이전트의 연구 부분이 시작됩니다. 크게 <em>라우팅</em>, <em>검색</em>, <em>반영, 조건부 반복의</em> 네 단계로 구성되어 있습니다.</p>
<h4 id="Routing" class="common-anchor-header">라우팅</h4><p>데이터베이스에는 서로 다른 소스의 여러 테이블 또는 컬렉션이 포함되어 있습니다. 시맨틱 검색을 현재 쿼리와 관련된 소스로만 제한할 수 있다면 더 효율적일 것입니다. 쿼리 라우터는 어떤 컬렉션 정보에서 검색할지 결정하도록 LLM에 메시지를 표시합니다.</p>
<p>다음은 쿼리 라우팅 프롬프트를 구성하는 방법입니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>LLM이 구조화된 출력을 JSON으로 반환하도록 하여 출력을 다음에 수행할 작업에 대한 결정으로 쉽게 변환할 수 있도록 합니다.</p>
<h4 id="Search" class="common-anchor-header">검색</h4><p>이전 단계를 통해 다양한 데이터베이스 컬렉션을 선택했다면, 검색 단계에서는 <a href="https://milvus.io/docs">Milvus로</a> 유사도 검색을 수행합니다. 이전 게시물과 마찬가지로 소스 데이터는 미리 지정되어 청크화되고 임베드되어 벡터 데이터베이스에 저장되어 있습니다. 딥서처의 경우 로컬 및 온라인 데이터 소스를 모두 수동으로 지정해야 합니다. 온라인 검색은 추후 작업을 위해 남겨두겠습니다.</p>
<h4 id="Reflection" class="common-anchor-header">반영</h4><p>이전 게시물과 달리, DeepSearcher는 지금까지 질문한 질문과 검색된 관련 청크에 정보 격차가 있는지 여부를 '반영'하는 프롬프트에 이전 출력을 문맥으로 입력하는 진정한 형태의 에이전트 반영을 보여줍니다. 이는 분석 단계로 볼 수 있습니다.</p>
<p>프롬프트를 만드는 방법은 다음과 같습니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>다시 한 번 LLM이 구조화된 출력을 반환하도록 하여 이번에는 Python으로 해석 가능한 데이터로 만듭니다.</p>
<p>다음은 위의 초기 하위 쿼리에 대한 답변 후 리플렉션을 통해 '발견'된 새로운 하위 쿼리의 예입니다:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">조건부 반복</h4><p>이전 게시물과 달리, 조건부 반복은 조건부 실행 흐름을 보여줍니다. 에이전트는 지금까지의 질문과 답변이 완전한지 반영한 후, 추가로 질문할 내용이 있으면 위의 단계를 반복합니다. 중요한 점은 실행 흐름(동안 루프)이 하드 코딩된 것이 아니라 LLM 출력의 함수라는 점입니다. 이 경우 <em>리서치를 반복하거나</em> <em>보고서를 생성하는</em> 두 가지 선택 사항만 있습니다. 보다 복잡한 에이전트에서는 <em>하이퍼링크 따라가기</em>, <em>청크 검색, 메모리 저장, 반영</em> 등과 같은 여러 가지가 있을 수 있습니다. 이러한 방식으로 에이전트는 루프를 종료하고 보고서를 생성하기로 결정할 때까지 적절하다고 판단되는 대로 질문을 계속 구체화합니다. 심슨 가족의 예에서 DeepSearcher는 추가 하위 쿼리로 빈틈을 메우는 작업을 두 번 더 수행합니다.</p>
<h3 id="Synthesize" class="common-anchor-header">합성</h3><p>마지막으로, 완전히 분해된 질문과 검색된 청크가 단일 프롬프트가 포함된 보고서로 합성됩니다. 다음은 프롬프트를 생성하는 코드입니다:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>이 접근 방식은 각 질문을 개별적으로 분석하고 단순히 결과물을 연결한 프로토타입에 비해 모든 섹션이 서로 일치하는, 즉 반복되거나 모순되는 정보가 없는 보고서를 생성할 수 있다는 장점이 있습니다. 보다 복잡한 시스템은 조건부 실행 흐름을 사용하여 보고서 구조화, 요약, 재작성, 반영 및 피벗 등 두 가지 측면을 결합하여 향후 작업을 위해 남겨둘 수 있습니다.</p>
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
    </button></h2><p>다음은 "심슨 가족은 시간이 지남에 따라 어떻게 변했나요?"라는 쿼리로 생성된 보고서의 샘플로, DeepSeek-R1이 심슨 가족에 대한 Wikipedia 페이지를 소스 자료로 전달했습니다:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">여기에서 보고서 전문을</a> 확인할 수 있으며, 비교를 위해 <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o mini로 DeepSearcher가 생성한 보고서도</a> 확인할 수 있습니다.</p>
<h2 id="Discussion" class="common-anchor-header">토론<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>연구 수행 및 보고서 작성을 위한 에이전트인 <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher를</a> 소개했습니다. 이 시스템은 이전 글의 아이디어를 기반으로 조건부 실행 흐름, 쿼리 라우팅 및 개선된 인터페이스와 같은 기능을 추가하여 구축되었습니다. 소규모 4비트 정량화된 추론 모델을 사용한 로컬 추론에서 대규모 DeepSeek-R1 모델을 위한 온라인 추론 서비스로 전환하여 출력 보고서를 질적으로 개선했습니다. DeepSearcher는 OpenAI, Gemini, DeepSeek, Grok 3(곧 출시 예정!)와 같은 대부분의 추론 서비스와 함께 작동합니다.</p>
<p>특히 리서치 에이전트에서 사용되는 추론 모델은 추론이 많은데, 운 좋게도 맞춤형 하드웨어에서 실행되는 삼바노바의 가장 빠른 DeepSeek-R1 제품을 사용할 수 있었습니다. 데모 쿼리의 경우, 약 2만 5천 개의 토큰을 입력하고 2만 2천 개의 토큰을 출력하며 0.30달러의 비용으로 삼바노바의 DeepSeek-R1 추론 서비스를 65회 호출했습니다. 모델에 6,710억 개의 매개변수가 포함되어 있고 크기가 3/4 테라바이트에 달한다는 점을 감안할 때 추론 속도에 깊은 인상을 받았습니다. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">자세한 내용은 여기에서 확인하세요!</a></p>
<p>향후 포스팅에서 이 작업을 계속 반복하여 추가적인 에이전트 개념과 연구 에이전트의 설계 공간을 검토할 예정입니다. 그 동안 모두가 <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher를</a> 사용해 보시고 <a href="https://github.com/zilliztech/deep-searcher">GitHub에 별</a>표를 달아 주시고 피드백을 공유해 주시기 바랍니다!</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>질리즈의 딥서처</strong></a></p></li>
<li><p>배경 읽기: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"저는 오픈 소스로 딥 리서치를 구축했습니다. 여러분도 할 수 있습니다!"</em></strong></a></p></li>
<li><p><em>"</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>삼바노바, 최고 효율을 자랑하는 가장 빠른 DeepSeek-R1 671B 출시</strong></a><em>"</em></p></li>
<li><p>딥서처: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">심슨 가족에 대한 DeepSeek-R1 보고서</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">심슨 가족에 대한 GPT-4o 미니 보고서</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus 오픈 소스 벡터 데이터베이스</a></p></li>
</ul>
