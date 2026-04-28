---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: 어떤 모델을 사용해야 하나요?'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  검색, 디버깅 및 긴 컨텍스트 테스트에서 DeepSeek V4, GPT-5.5 및 Qwen3.6을 비교한 다음, DeepSeek V4로
  Milvus RAG 파이프라인을 구축하세요.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>새로운 모델 릴리즈는 프로덕션 팀이 평가할 수 있는 속도보다 더 빠르게 진행되고 있습니다. DeepSeek V4, GPT-5.5, Qwen3.6-35B-A3B는 모두 서류상으로는 강력해 보이지만 AI 애플리케이션 개발자에게 더 어려운 질문은 검색이 많은 시스템, 코딩 작업, 긴 컨텍스트 분석 및 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 파이프라인에</a> 어떤 모델을 사용해야 하는가 하는 실용적인 문제입니다.</p>
<p><strong>이 문서에서는</strong> 실시간 정보 검색, 동시성 버그 디버깅, 긴 컨텍스트 마커 검색의<strong>세 가지 모델을 실제 테스트에서 비교합니다</strong>. 그런 다음, 모델 매개변수만으로는 검색되지 않고 검색 가능한 지식 기반에서 컨텍스트를 가져올 수 있도록 DeepSeek V4를 <a href="https://zilliz.com/learn/what-is-vector-database">Milvus 벡터 데이터베이스에</a> 연결하는 방법을 보여 줍니다.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">DeepSeek V4, GPT-5.5, Qwen3.6-35B-A3B란 무엇인가요?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 및 Qwen3.6-35B-A3B는 모델 스택의 서로 다른 부분을 대상으로 하는 서로 다른 AI 모델입니다.</strong> DeepSeek V4는 오픈 웨이트의 긴 컨텍스트 추론에 중점을 둡니다. GPT-5.5는 프론티어 호스팅 성능, 코딩, 온라인 리서치 및 툴을 많이 사용하는 작업에 중점을 둡니다. Qwen3.6-35B-A3B는 훨씬 더 작은 활성 매개변수 풋프린트를 가진 오픈 웨이트 멀티모달 배포에 중점을 둡니다.</p>
<p><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">프로덕션 벡터 검색</a> 시스템은 모델에만 의존하는 경우가 거의 없기 때문에 비교가 중요합니다. 모델 기능, 컨텍스트 길이, 배포 제어, 검색 품질, 서비스 비용 등이 모두 최종 사용자 경험에 영향을 미칩니다.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: 긴 컨텍스트 비용 제어를 위한 개방형 가중치 MoE 모델</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4는</strong></a> <strong>2026년 4월 24일에 출시된 오픈-웨이트 MoE 모델 제품군입니다.</strong> 공식 릴리스에는 두 가지 변형이 있습니다: DeepSeek V4-Pro와 DeepSeek V4-Flash입니다. V4-Pro는 토큰당 49억 개가 활성화된 총 1.6T 개의 매개변수를 가지고 있으며, V4-Flash는 토큰당 13억 개가 활성화된 총 284억 개의 매개변수를 가지고 있습니다. 둘 다 1백만 개의 토큰 컨텍스트 창을 지원합니다.</p>
<p><a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Pro 모델 카드에는</a> 이 모델이 MIT 라이선스를 받았으며 Hugging Face와 ModelScope를 통해 사용 가능하다는 사실도 명시되어 있습니다. 긴 컨텍스트 문서 워크플로우를 구축하는 팀의 경우, 완전히 폐쇄적인 프론티어 API에 비해 비용 관리와 배포 유연성이 가장 큰 매력입니다.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: 코딩, 연구 및 도구 사용을 위한 호스팅형 프론티어 모델</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5는</strong></a> <strong>OpenAI가 2026년 4월 23일에 출시한 폐쇄형 프론티어 모델입니다.</strong> OpenAI는 코딩, 온라인 리서치, 데이터 분석, 문서 작업, 스프레드시트 작업, 소프트웨어 운영 및 도구 기반 작업에 적합하다고 홍보합니다. 공식 모델 문서( <code translate="no">gpt-5.5</code> )에는 1백만 토큰 API 컨텍스트 창이 나열되어 있지만, Codex와 ChatGPT 제품 제한은 다를 수 있습니다.</p>
<p>OpenAI는 강력한 코딩 벤치마크 결과를 보고합니다: 터미널 벤치 2.0에서 82.7%, Expert-SWE에서 73.1%, SWE-Bench Pro에서 58.6%. 단점은 가격입니다. 공식 API 가격에는 제품별 또는 장기적인 맥락의 가격 세부 정보 이전에 GPT-5.5가 1백만 입력 토큰당 5달러, 1백만 출력 토큰당 30달러로 표시되어 있습니다.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: 로컬 및 멀티모달 워크로드를 위한 더 작은 액티브 파라미터 모델</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B는</strong></a> <strong>알리바바의 Qwen 팀이 개발한 오픈 웨이트 MoE 모델입니다.</strong> 이 모델 카드에는 총 35B개의 파라미터, 3B개의 활성화된 파라미터, 비전 인코더, Apache-2.0 라이선스가 나열되어 있습니다. 기본 262,144개의 토큰 컨텍스트 창을 지원하며, YaRN 확장을 통해 약 1,010,000개의 토큰으로 확장할 수 있습니다.</p>
<p>따라서 로컬 배포, 프라이빗 서비스, 이미지-텍스트 입력, 중국어 워크로드가 관리형 프론티어 모델의 편의성보다 더 중요할 때 Qwen3.6-35B-A3B가 매력적입니다.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 대 GPT-5.5 대 Qwen3.6: 모델 사양 비교</h3><table>
<thead>
<tr><th>모델</th><th>배포 모델</th><th>공개 매개변수 정보</th><th>컨텍스트 창</th><th>가장 적합</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>오픈-웨이트 MoE; API 사용 가능</td><td>총 1.6T / 49B 활성</td><td>1백만 토큰</td><td>장기적인 컨텍스트, 비용에 민감한 엔지니어링 배포</td></tr>
<tr><td>GPT-5.5</td><td>호스팅된 폐쇄형 모델</td><td>미공개</td><td>API의 1백만 토큰</td><td>코딩, 라이브 리서치, 도구 사용 및 최고의 전반적인 기능</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>개방형 멀티모달 MoE</td><td>총 35B / 3B 활성</td><td>262K 네이티브, ~1M(YaRN 포함)</td><td>로컬/프라이빗 배포, 멀티모달 입력, 중국어 시나리오 지원</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">딥서치 V4, GPT-5.5, Qwen3.6 테스트 방법<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>이 테스트는 전체 벤치마크 제품군을 대체하지 않습니다. 이 테스트는 모델이 현재 정보를 검색하고, 미묘한 코드 버그를 추론하고, 매우 긴 문서 내에서 사실을 찾을 수 있는지 등 일반적인 개발자의 질문을 반영하는 실용적인 점검입니다.</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">어떤 모델이 실시간 정보 검색을 가장 잘 처리할까요?</h3><p>가능한 경우 웹 검색을 사용하여 각 모델에 시간에 민감한 세 가지 질문을 던졌습니다. 질문은 간단했습니다. 답변만 반환하고 소스 URL을 포함하라는 것이었습니다.</p>
<table>
<thead>
<tr><th>질문</th><th>테스트 시 예상 답변</th><th>출처</th></tr>
</thead>
<tbody>
<tr><td>OpenAI API를 통해 <code translate="no">gpt-image-2</code> 으로 1024×1024 중간 품질 이미지를 생성하는 데 드는 비용은 얼마인가요?</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">OpenAI 이미지 생성 가격</a></td></tr>
<tr><td>이번 주 빌보드 핫 100의 1위 곡은 무엇이며, 아티스트는 누구인가요?</td><td><code translate="no">Choosin' Texas</code> by 엘라 랭글리</td><td><a href="https://www.billboard.com/charts/hot-100/">빌보드 핫 100 차트</a></td></tr>
<tr><td>현재 2026년 F1 드라이버 순위는 누가 선두를 달리고 있나요?</td><td>키미 안토넬리</td><td><a href="https://www.formula1.com/en/results/2026/drivers">포뮬러 1 드라이버 순위</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>참고: 시간에 민감한 질문입니다. 예상 답변은 테스트를 실행한 시점의 결과를 반영합니다.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>OpenAI의 이미지 가격 책정 페이지에서는 '표준'이 아닌 '중간'이라는 레이블을 사용합니다. <br>

  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg" alt="blog cover narrow 1152x720" class="doc-image" id="blog-cover-narrow-1152x720" />
   </span> <span class="img-wrapper"> <span>블로그 커버 좁은 1152x720</span>$0 </span>.053 1024×1024 결과에 대해 "표준"이라는 레이블을 사용하므로 여기에서 질문은 현재 API 문구와 일치하도록 정규화됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">실시간 검색 결과: GPT-5.5가 가장 명확한 이점을 가짐</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro는 첫 번째 질문에 잘못 답변했습니다. 이 설정에서는 실시간 웹 검색을 통해 두 번째와 세 번째 질문에 대한 답을 찾을 수 없었습니다.</p>
<p>두 번째 답변은 올바른 빌보드 URL을 포함했지만 현재 1위 곡을 검색하지 못했습니다. 세 번째 답변은 잘못된 소스를 사용했기 때문에 오답으로 간주했습니다.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5는 이 테스트를 훨씬 더 잘 처리했습니다. 답은 짧고 정확했으며 출처가 정확하고 빨랐습니다. 작업이 현재 정보에 의존하고 모델에 실시간 검색 기능이 있는 경우, 이 설정에서는 GPT-5.5가 확실한 이점을 가졌습니다.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B는 DeepSeek V4-Pro와 유사한 결과를 생성했습니다. 이 설정에서는 라이브 웹 액세스 기능이 없었기 때문에 실시간 검색 작업을 완료할 수 없었습니다.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">동시성 버그 디버깅에 더 나은 모델은 무엇인가요?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>두 번째 테스트에서는 세 가지 계층의 동시성 문제가 있는 Python 은행 이체 예제를 사용했습니다. 이 작업은 명백한 경쟁 조건을 찾는 것뿐만 아니라 총 잔액이 깨지는 이유를 설명하고 수정된 코드를 제공하는 것이었습니다.</p>
<table>
<thead>
<tr><th>레이어</th><th>Problem</th><th>무엇이 잘못되었는지</th></tr>
</thead>
<tbody>
<tr><td>기본</td><td>경쟁 조건</td><td><code translate="no">if self.balance &gt;= amount</code> 와 <code translate="no">self.balance -= amount</code> 는 원자적이지 않습니다. 두 개의 스레드가 동시에 잔액 검사를 통과한 다음 둘 다 돈을 뺄 수 있습니다.</td></tr>
<tr><td>Medium</td><td>교착 상태 위험</td><td>순진한 계정별 잠금은 송금 A→B가 A를 먼저 잠그는 반면 송금 B→A가 B를 먼저 잠그면 교착 상태에 빠질 수 있습니다. 이는 전형적인 ABBA 교착 상태입니다.</td></tr>
<tr><td>고급</td><td>잘못된 잠금 범위</td><td><code translate="no">self.balance</code> 만 보호하면 <code translate="no">target.balance</code> 은 보호되지 않습니다. 올바른 수정 방법은 일반적으로 계정 ID를 기준으로 두 계정을 안정된 순서로 잠그거나 동시성이 낮은 전역 잠금을 사용해야 합니다.</td></tr>
</tbody>
</table>
<p>프롬프트와 코드는 아래와 같습니다:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">코드 디버깅 결과: 가장 완벽한 답을 제공한 GPT-5.5</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro는 간결한 분석을 제공하고 ABBA 교착 상태를 피하는 표준 방법인 정렬 잠금 솔루션으로 바로 이동했습니다. 이 답변은 올바른 수정 방법을 보여주었지만, 순진한 잠금 기반 수정이 왜 새로운 실패 모드를 유발할 수 있는지 설명하는 데 많은 시간을 할애하지 않았습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5는 이 테스트에서 가장 우수한 성적을 거두었습니다. 핵심 문제를 발견하고, 교착 상태 위험을 예상하고, 원래 코드가 실패할 수 있는 이유를 설명하고, 완전히 수정된 구현을 제공했습니다.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B는 버그를 정확하게 식별했으며 예제 실행 순서가 명확했습니다. 취약한 부분은 모든 계정이 동일한 잠금을 공유하도록 하는 글로벌 클래스 수준 잠금을 선택한 수정 사항이었습니다. 이는 소규모 시뮬레이션에서는 효과가 있지만, 실제 은행 시스템에서는 관련 없는 계좌 이체가 여전히 동일한 잠금에서 대기해야 하므로 좋지 않은 절충안입니다.</p>
<p><strong>요컨대</strong>, GPT-5.5는 현재 버그를 해결했을 뿐만 아니라 개발자가 다음에 도입할 수 있는 버그에 대해서도 경고했습니다. DeepSeek V4-Pro는 가장 깔끔한 비-GPT 수정을 제공했습니다. Qwen3.6은 문제를 발견하고 작동 코드를 생성했지만 확장성 손상에 대해서는 언급하지 않았습니다.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">긴 컨텍스트 검색을 가장 잘 처리하는 모델은 무엇인가요?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>긴 컨텍스트 테스트를 위해 약 85만 개의 한자로 이루어진 ' <em>붉은 방의 꿈</em>' 전문을 사용했습니다. 50만 자 위치에 숨겨진 마커를 삽입했습니다:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>그런 다음 각 모델에 파일을 업로드하고 마커의 내용과 위치를 모두 찾도록 요청했습니다.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">긴 컨텍스트 검색 결과: 마커를 가장 정확하게 찾은 GPT-5.5</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro는 숨겨진 마커를 찾았지만 정확한 문자 위치를 찾지 못했습니다. 또한 잘못된 주변 컨텍스트를 제공했습니다. 이 테스트에서는 의미론적으로는 마커를 찾는 것처럼 보였지만 문서를 추론하는 동안 정확한 위치를 추적하지 못했습니다.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5는 마커 콘텐츠, 위치, 주변 문맥을 정확하게 찾아냈습니다. 위치를 500,002로 보고하고 0 인덱스와 1 인덱스 카운트를 구분하기도 했습니다. 주변 문맥도 마커를 삽입할 때 사용된 텍스트와 일치했습니다.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B는 마커 콘텐츠와 주변 문맥을 올바르게 찾았지만 위치 추정이 잘못되었습니다.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">이 테스트는 모델 선택에 대해 무엇을 말하나요?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>이 세 가지 테스트는 실제적인 선택 패턴을 가리킵니다: <strong>GPT-5.5는 기능, DeepSeek V4-Pro는 긴 컨텍스트에서 비용 대비 성능, Qwen3.6-35B-A3B는 로컬 제어를 위한 선택입니다.</strong></p>
<table>
<thead>
<tr><th>모델</th><th>가장 적합한 모델</th><th>테스트 결과</th><th>주요 주의 사항</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>최고의 전반적인 기능</td><td>실시간 검색, 동시성 디버깅, 긴 컨텍스트 마커 테스트에서 우승했습니다.</td><td>더 높은 비용, 정확도와 도구 사용이 프리미엄을 정당화할 때 가장 강력함</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>긴 컨텍스트, 저렴한 비용으로 배포</td><td>동시성 버그에 대한 가장 강력한 비-GPT 수정 및 마커 콘텐츠 발견</td><td>라이브 웹 작업을 위한 외부 검색 도구 필요; 이 테스트에서는 정확한 문자 위치 추적이 약했습니다.</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>로컬 배포, 오픈 가중치, 멀티모달 입력, 중국어 워크로드</td><td>버그 식별 및 긴 문맥 이해에서 우수한 성능을 보임.</td><td>수정 품질은 확장성이 떨어짐; 이 설정에서는 라이브 웹 액세스를 사용할 수 없음</td></tr>
</tbody>
</table>
<p>가장 강력한 결과가 필요한 경우 GPT-5.5를 사용하며 비용은 부차적인 문제입니다. 긴 컨텍스트, 낮은 서비스 비용, API 친화적인 배포가 필요한 경우 DeepSeek V4-Pro를 사용하세요. 오픈 가중치, 프라이빗 배포, 멀티모달 지원 또는 서빙 스택 제어가 가장 중요한 경우에는 Qwen3.6-35B-A3B를 사용하세요.</p>
<p>하지만 검색이 많은 애플리케이션의 경우, 모델 선택은 절반의 이야기일 뿐입니다. 강력한 긴 컨텍스트 모델이라도 전용 <a href="https://zilliz.com/learn/generative-ai">시맨틱 검색 시스템에</a> 의해 컨텍스트가 검색, 필터링, 근거화될 때 더 나은 성능을 발휘합니다.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">긴 컨텍스트 모델에서 RAG가 여전히 중요한 이유<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>컨텍스트 창이 길다고 해서 검색의 필요성이 없어지는 것은 아닙니다. 검색 전략이 바뀔 뿐입니다.</p>
<p>RAG 애플리케이션에서 모델은 모든 요청에 대해 모든 문서를 스캔해서는 안 됩니다. <a href="https://zilliz.com/learn/introduction-to-unstructured-data">벡터 데이터베이스 아키텍처는</a> 임베딩을 저장하고, 의미적으로 관련된 청크를 검색하고, 메타데이터 필터를 적용하고, 모델에 압축된 컨텍스트 집합을 반환합니다. 이를 통해 모델에 더 나은 입력을 제공하는 동시에 비용과 지연 시간을 줄일 수 있습니다.</p>
<p>Milvus는 <a href="https://milvus.io/docs/schema.md">수집 스키마</a>, 벡터 인덱싱, 스칼라 메타데이터, 검색 작업을 하나의 시스템에서 처리하기 때문에 이 역할에 적합합니다. <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite로</a> 로컬에서 시작하고, 독립형 <a href="https://milvus.io/docs/quickstart.md">Milvus 빠른 시작으로</a> 이동하고, <a href="https://milvus.io/docs/install_standalone-docker.md">Docker 설치</a> 또는 <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose 배포로</a> 배포하고, 워크로드가 증가하면 <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetes 배포로</a> 더 확장할 수 있습니다.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Milvus 및 DeepSeek V4로 RAG 파이프라인을 구축하는 방법<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 워크스루에서는 생성에는 DeepSeek V4-Pro를, 검색에는 Milvus를 사용하여 소규모 RAG 파이프라인을 구축합니다. 임베딩을 생성하고, 컬렉션에 저장하고, 관련 컨텍스트를 검색하고, 해당 컨텍스트를 모델에 전달하는 등 다른 LLM에도 동일한 구조가 적용됩니다.</p>
<p>더 자세한 내용은 공식 <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG 튜토리얼을</a> 참조하세요. 이 예에서는 검색 흐름을 쉽게 검사할 수 있도록 파이프라인을 작게 유지합니다.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">환경 준비<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">종속 요소 설치</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Google Colab을 사용하는 경우 종속 요소를 설치한 후 런타임을 다시 시작해야 할 수 있습니다. <strong>런타임</strong> 메뉴를 클릭한 다음 <strong>세션 재시작을</strong> 선택합니다.</p>
<p>DeepSeek V4-Pro는 OpenAI 스타일 API를 지원합니다. 공식 DeepSeek 웹사이트에 로그인하고 <code translate="no">DEEPSEEK_API_KEY</code> 을 환경 변수로 설정합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Milvus 문서 데이터 세트 준비하기</h3><p><a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.x 문서 아카이브의</a> FAQ 페이지를 비공개 지식 소스로 사용합니다. 이것은 소규모 RAG 데모를 위한 간단한 시작용 데이터 세트입니다.</p>
<p>먼저 ZIP 파일을 다운로드하고 <code translate="no">milvus_docs</code> 폴더에 문서를 압축 해제합니다.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus_docs/en/faq</code> 폴더에서 모든 마크다운 파일을 로드합니다. 각 문서에 대해 파일 내용을 <code translate="no">#</code> 으로 분할하여 주요 마크다운 섹션을 대략적으로 구분합니다.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">DeepSeek V4와 임베딩 모델 설정하기</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>다음으로 임베딩 모델을 선택합니다. 이 예제에서는 PyMilvus 모델 모듈의 <code translate="no">DefaultEmbeddingFunction</code> 을 사용합니다. <a href="https://milvus.io/docs/embeddings.md">임베딩 함수에</a> 대한 자세한 내용은 Milvus 문서를 참조하세요.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>테스트 벡터를 생성한 다음 벡터 차원과 처음 몇 개의 요소를 인쇄합니다. 반환된 차원은 Milvus 컬렉션을 만들 때 사용됩니다.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Milvus에 데이터 로드<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Milvus 컬렉션 만들기</h3><p>Milvus 컬렉션은 벡터 필드, 스칼라 필드 및 선택적 동적 메타데이터를 저장합니다. 아래의 빠른 설정은 상위 수준 <code translate="no">MilvusClient</code> API를 사용하며, 프로덕션 스키마의 경우 <a href="https://milvus.io/docs/manage-collections.md">컬렉션 관리</a> 및 <a href="https://milvus.io/docs/create-collection.md">컬렉션 만들기에</a> 대한 문서를 검토하세요.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">MilvusClient</code> 에 대한 몇 가지 참고 사항</p>
<ul>
<li><code translate="no">uri</code> 을 <code translate="no">./milvus.db</code> 과 같은 로컬 파일로 설정하는 것이 가장 쉬운 옵션으로, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite를</a> 자동으로 사용하고 모든 데이터를 해당 파일에 저장하기 때문입니다.</li>
<li>대규모 데이터 세트가 있는 경우 <a href="https://milvus.io/docs/quickstart.md">Docker 또는 Kubernetes에서</a> 더 높은 성능의 Milvus 서버를 설정할 수 있습니다. 이 설정에서는 <code translate="no">http://localhost:19530</code> 와 같은 서버 URI를 <code translate="no">uri</code> 로 사용합니다.</li>
<li>Milvus의 완전 관리형 클라우드 서비스인 <a href="https://docs.zilliz.com/">질리즈 클라우드를</a> 사용하려면 <code translate="no">uri</code> 및 <code translate="no">token</code> 을 질리즈 클라우드의 <a href="https://docs.zilliz.com/docs/connect-to-cluster">공개 엔드포인트 및 API 키로</a> 설정하세요.</li>
</ul>
<p>컬렉션이 이미 존재하는지 확인합니다. 존재한다면 삭제합니다.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>지정된 파라미터로 새 컬렉션을 생성합니다. 필드 정보를 지정하지 않으면 밀버스는 기본값인 <code translate="no">id</code> 필드를 기본 키로, 벡터 데이터를 저장할 벡터 필드를 자동으로 생성합니다. 예약 JSON 필드는 스키마에 정의되지 않은 스칼라 데이터를 저장합니다.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">IP</code> 메트릭은 내부 제품 유사성을 의미합니다. Milvus는 벡터 유형과 워크로드에 따라 다른 메트릭 유형과 인덱스 선택도 지원합니다. <a href="https://milvus.io/docs/id/metric.md">메트릭 유형</a> 및 <a href="https://milvus.io/docs/index_selection.md">인덱스 선택에</a> 대한 가이드를 참조하세요. <code translate="no">Strong</code> 설정은 사용 가능한 <a href="https://milvus.io/docs/consistency.md">일관성 수준</a> 중 하나입니다.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">임베드된 문서 삽입</h3><p>텍스트 데이터를 반복하여 임베딩을 생성하고 데이터를 Milvus에 삽입합니다. 여기에서는 <code translate="no">text</code> 이라는 새 필드를 추가합니다. 이 필드는 컬렉션 스키마에 명시적으로 정의되어 있지 않으므로 예약된 동적 JSON 필드에 자동으로 추가됩니다. 프로덕션 메타데이터의 경우 <a href="https://milvus.io/docs/enable-dynamic-field.md">동적 필드 지원</a> 및 <a href="https://milvus.io/docs/json-field-overview.md">JSON 필드 개요를</a> 검토하세요.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>대규모 데이터 세트의 경우, 명시적인 스키마 설계, <a href="https://milvus.io/docs/index-vector-fields.md">벡터 필드 인덱스</a>, 스칼라 인덱스, <a href="https://milvus.io/docs/insert-update-delete.md">삽입, 업서트, 삭제와</a> 같은 데이터 수명 주기 작업으로 동일한 패턴을 확장할 수 있습니다.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">RAG 검색 흐름 구축<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">밀버스에서 관련 컨텍스트 검색하기</h3><p>Milvus에 대한 일반적인 질문을 정의해 보겠습니다.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>컬렉션에서 해당 질문에 대해 검색하고 의미적으로 일치하는 상위 3개의 항목을 검색합니다. 이것은 기본적인 <a href="https://milvus.io/docs/single-vector-search.md">단일 벡터 검색입니다</a>. 프로덕션 환경에서는 <a href="https://milvus.io/docs/filtered-search.md">필터 검색</a>, <a href="https://milvus.io/docs/full-text-search.md">전체 텍스트 검색</a>, <a href="https://milvus.io/docs/multi-vector-search.md">다중 벡터 하이브리드 검색</a> 및 <a href="https://milvus.io/docs/reranking.md">재랭크 전략과</a> 결합하여 관련성을 향상시킬 수 있습니다.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>이제 쿼리에 대한 검색 결과를 살펴보겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">DeepSeek V4로 RAG 답변 생성하기</h3><p>검색된 문서를 문자열 형식으로 변환합니다.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>LLM에 대한 시스템 및 사용자 프롬프트를 정의합니다. 이 프롬프트는 Milvus에서 검색된 문서에서 조합됩니다.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>프롬프트에 기반한 응답을 생성하려면 DeepSeek V4-Pro에서 제공하는 모델을 사용합니다.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>이 시점에서 파이프라인은 문서 임베드, Milvus에 벡터 저장, 관련 컨텍스트 검색, DeepSeek V4-Pro를 통한 답변 생성이라는 핵심 RAG 루프를 완료했습니다.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">프로덕션 전에 개선해야 할 점은 무엇인가요?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>데모에서는 간단한 섹션 분할과 상위-k 검색을 사용합니다. 이 정도면 메커니즘을 보여주기에 충분하지만, 프로덕션 RAG에는 일반적으로 더 많은 검색 제어가 필요합니다.</p>
<table>
<thead>
<tr><th>프로덕션 요구 사항</th><th>고려해야 할 Milvus 기능</th><th>도움이 되는 이유</th></tr>
</thead>
<tbody>
<tr><td>시맨틱 및 키워드 신호 혼합</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Milvus를 사용한 하이브리드 검색</a></td><td>고밀도 벡터 검색과 희소 또는 전체 텍스트 신호의 결합</td></tr>
<tr><td>여러 리트리버의 결과 병합</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvus 하이브리드 검색 리트리버</a></td><td>LangChain 워크플로우에서 가중치 또는 RRF 스타일 순위를 사용할 수 있습니다.</td></tr>
<tr><td>테넌트, 타임스탬프 또는 문서 유형별로 결과 제한</td><td>메타데이터 및 스칼라 필터</td><td>올바른 데이터 슬라이스로 검색 범위 유지</td></tr>
<tr><td>자체 관리형 Milvus에서 관리형 서비스로 전환</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Milvus에서 Zilliz로 마이그레이션</a></td><td>Milvus 호환성을 유지하면서 인프라 작업 감소</td></tr>
<tr><td>호스팅된 애플리케이션을 안전하게 연결</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">질리즈 클라우드 API 키</a></td><td>애플리케이션 클라이언트를 위한 토큰 기반 접근 제어 제공</td></tr>
</tbody>
</table>
<p>가장 중요한 프로덕션 습관은 검색을 생성과 별도로 평가하는 것입니다. 검색된 컨텍스트가 약한 경우, LLM을 교체하면 문제가 해결되는 대신 문제가 숨겨지는 경우가 많습니다.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Milvus 및 DeepSeek RAG 시작하기<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>튜토리얼을 재현하려면 공식 <a href="https://milvus.io/docs">Milvus 문서와</a> <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus로 RAG 구축하기 가이드부터</a> 시작하세요. 관리형 설정의 경우, Milvus를 로컬에서 실행하는 대신 클러스터 엔드포인트와 API 키로 <a href="https://docs.zilliz.com/docs/connect-to-cluster">Zilliz Cloud에 연결하세요</a>.</p>
<p>청킹, 인덱싱, 필터 또는 하이브리드 검색을 조정하는 데 도움이 필요하면 <a href="https://slack.milvus.io/">Milvus Slack 커뮤니티에</a> 가입하거나 무료 <a href="https://milvus.io/office-hours">Milvus 오피스 아워 세션을</a> 예약하세요. 인프라 설정을 건너뛰고 싶으시다면, <a href="https://cloud.zilliz.com/login">Zilliz Cloud 로그인을</a> 사용하거나 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud 계정을</a> 생성하여 관리형 Milvus를 실행하세요.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">개발자들이 딥서치 V4, Milvus, RAG에 대해 자주 묻는 질문<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4는 RAG에 적합한가요?</h3><p>긴 컨텍스트 처리와 프리미엄 폐쇄형 모델보다 낮은 서빙 비용이 필요한 경우, DeepSeek V4-Pro가 RAG에 적합합니다. 관련 청크를 선택하고, 메타데이터 필터를 적용하고, 프롬프트에 초점을 맞추려면 여전히 Milvus와 같은 검색 레이어가 필요합니다.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">RAG 파이프라인에 GPT-5.5 또는 DeepSeek V4를 사용해야 하나요?</h3><p>답변 품질, 도구 사용, 실시간 리서치가 비용보다 더 중요한 경우에는 GPT-5.5를 사용하세요. 긴 컨텍스트 처리와 비용 관리가 더 중요한 경우, 특히 검색 레이어가 이미 고품질의 근거 컨텍스트를 제공하는 경우 DeepSeek V4-Pro를 사용하세요.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">개인 RAG를 위해 로컬에서 Qwen3.6-35B-A3B를 실행할 수 있나요?</h3><p>예, Qwen3.6-35B-A3B는 오픈 웨이트이며 보다 제어 가능한 배포를 위해 설계되었습니다. 프라이버시, 로컬 서비스, 멀티모달 입력 또는 중국어 성능이 중요하지만 하드웨어의 지연 시간, 메모리 및 검색 품질을 검증해야 하는 경우에 적합한 후보입니다.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">긴 컨텍스트 모델은 벡터 데이터베이스를 불필요하게 만들까요?</h3><p>아니요. 긴 컨텍스트 모델은 더 많은 텍스트를 읽을 수 있지만 여전히 검색의 이점을 누릴 수 있습니다. 벡터 데이터베이스는 입력을 관련성 있는 청크로 좁히고, 메타데이터 필터링을 지원하며, 토큰 비용을 절감하고, 문서가 변경될 때 애플리케이션을 더 쉽게 업데이트할 수 있게 해줍니다.</p>
