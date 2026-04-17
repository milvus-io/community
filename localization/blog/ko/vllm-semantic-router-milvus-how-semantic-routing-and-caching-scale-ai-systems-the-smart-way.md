---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: 'vLLM 시맨틱 라우터 + 밀버스: 시맨틱 라우팅과 캐싱으로 확장 가능한 AI 시스템을 스마트하게 구축하는 방법'
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  대규모 모델 추론을 최적화하고, 컴퓨팅 비용을 절감하며, 확장 가능한 배포 전반에서 AI 성능을 향상시키는 vLLM, Milvus 및 시맨틱
  라우팅의 활용 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>대부분의 AI 앱은 모든 요청에 대해 단일 모델에 의존합니다. 하지만 이러한 접근 방식은 금방 한계에 부딪히게 됩니다. 대규모 모델은 단순한 쿼리에 사용하더라도 강력하지만 비용이 많이 듭니다. 작은 모델은 더 저렴하고 빠르지만 복잡한 추론을 처리할 수 없습니다. 트래픽이 급증하는 경우(예: 하룻밤 사이에 천만 명의 사용자가 사용하는 AI 앱이 갑자기 입소문을 타는 경우), 이러한 단일 모델 설정의 비효율성은 고통스럽게 드러납니다. 지연 시간이 급증하고 GPU 비용이 폭등하며 어제까지 잘 작동하던 모델이 숨을 헐떡이기 시작합니다.</p>
<p>그리고 이 앱을 개발한 엔지니어인 <em>여러분은</em> 이 문제를 빨리 해결해야 합니다.</p>
<p>다양한 크기의 여러 모델을 배포하고 시스템이 각 요청에 가장 적합한 모델을 자동으로 선택한다고 상상해 보세요. 간단한 프롬프트는 더 작은 모델로, 복잡한 쿼리는 더 큰 모델로 라우팅합니다. 이것이 바로 엔드포인트가 아닌 의미에 따라 요청을 라우팅하는 라우팅 메커니즘인 <a href="https://github.com/vllm-project/semantic-router"><strong>vLLM 시맨틱 라우터의</strong></a>기본 개념입니다. 이 라우터는 각 입력의 의미론적 내용, 복잡성, 의도를 분석하여 가장 적합한 언어 모델을 선택함으로써 모든 쿼리가 가장 적합한 모델에 의해 처리되도록 보장합니다.</p>
<p>이를 더욱 효율적으로 수행하기 위해 시맨틱 라우터는 시맨틱 <strong>캐시 계층</strong> 역할을 하는 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io/"><strong>Milvus와</strong></a> 페어링됩니다. 응답을 다시 계산하기 전에 의미적으로 유사한 쿼리가 이미 처리되었는지 확인하고, 유사한 쿼리가 발견되면 즉시 캐시된 결과를 검색합니다. 그 결과 응답 속도는 빨라지고, 비용은 절감되며, 낭비 없이 지능적으로 확장되는 검색 시스템을 구축할 수 있습니다.</p>
<p>이 포스팅에서는 <strong>vLLM 시맨틱 라우터의</strong> 작동 방식, <strong>Milvus가</strong> 캐싱 레이어를 강화하는 방법, 이 아키텍처가 실제 AI 애플리케이션에 어떻게 적용될 수 있는지 자세히 살펴보겠습니다.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">시맨틱 라우터란 무엇인가요?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>시맨틱 라우</strong> 터의 핵심은 요청의 의미, 복잡성, 의도에 따라 <em>어떤 모델이</em> 주어진 요청을 처리할지 결정하는 시스템입니다. 모든 것을 하나의 모델로 라우팅하는 대신 여러 모델에 걸쳐 요청을 지능적으로 분산하여 정확도, 지연 시간, 비용의 균형을 맞춥니다.</p>
<p>구조적으로는 세 가지 주요 계층을 기반으로 구축됩니다: <strong>시맨틱 라우팅</strong>, <strong>모델 혼합(MoM)</strong>, <strong>캐시 레이어입니다</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">시맨틱 라우팅 레이어</h3><p>시맨틱 <strong>라우팅 레이어는</strong> 시스템의 두뇌와 같은 역할을 합니다. 이 계층은 각 입력이 무엇을 요청하는지, 얼마나 복잡한지, 어떤 종류의 추론이 필요한지 등을 분석하여 작업에 가장 적합한 모델을 선택합니다. 예를 들어, 간단한 사실 조회는 가벼운 모델로, 다단계 추론 쿼리는 더 큰 모델로 라우팅할 수 있습니다. 이러한 동적 라우팅은 트래픽과 쿼리의 다양성이 증가하더라도 시스템의 응답성을 유지합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">모델 혼합(MoM) 레이어</h3><p>두 번째 계층인 <strong>모델 혼합(MoM)</strong>은 크기와 기능이 서로 다른 여러 모델을 하나의 통합된 시스템으로 통합합니다. 이는 <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>전문가 혼합</strong></a> <strong>(MoE)</strong> 아키텍처에서 영감을 얻었지만, 하나의 대형 모델 내에서 '전문가'를 선택하는 대신 여러 독립 모델에 걸쳐 작동합니다. 이러한 설계는 지연 시간을 줄이고 비용을 낮추며 단일 모델 제공업체에 종속되는 것을 방지합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">캐시 레이어: Milvus의 차별화 포인트</h3><p>마지막으로 <a href="https://milvus.io/">밀버스 벡터 데이터베이스에</a>의해 <strong>구동되는 캐시 레이어는</strong>시스템의 메모리 역할을 합니다. 새 쿼리를 실행하기 전에 의미적으로 유사한 요청이 이전에 처리된 적이 있는지 확인합니다. 만약 그렇다면 캐시된 결과를 즉시 검색하여 컴퓨팅 시간을 절약하고 처리량을 개선합니다.</p>
<p>기존 캐싱 시스템은 인메모리 키-값 저장소에 의존하여 정확한 문자열이나 템플릿으로 요청을 매칭합니다. 이는 쿼리가 반복적이고 예측 가능한 경우 잘 작동합니다. 하지만 실제 사용자는 같은 내용을 두 번 입력하는 경우는 거의 없습니다. 문구가 조금이라도 바뀌면 캐시는 이를 동일한 의도로 인식하지 못합니다. 시간이 지남에 따라 캐시 적중률이 떨어지고 언어가 자연스럽게 변함에 따라 성능 향상 효과가 사라집니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 문제를 해결하려면 단순히 단어를 일치시키는 것이 아니라 <em>의미를</em> 이해하는 캐싱이 필요합니다. 이것이 바로 <strong>시맨틱 검색이</strong> 필요한 이유입니다. 의미 검색은 문자열을 비교하는 대신 의미적 유사성을 포착하는 고차원 벡터 표현인 임베딩을 비교합니다. 하지만 문제는 규모입니다. 단일 머신에서 수백만 또는 수십억 개의 벡터에 대해 무차별 대입 검색을 실행하는 것은 (시간 복잡도가 O(N-d)인) 계산적으로 엄청나게 비효율적입니다. 메모리 비용이 폭발적으로 증가하고, 수평적 확장성이 무너지며, 갑작스러운 트래픽 급증이나 롱테일 쿼리를 처리하는 데 어려움을 겪게 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>대규모 시맨틱 검색을 위해 특별히 구축된 분산형 벡터 데이터베이스인 <strong>Milvus는</strong> 이 캐시 계층에 필요한 수평적 확장성과 내결함성을 제공합니다. 임베딩을 노드 간에 효율적으로 저장하고 대규모에서도 최소한의 지연 시간으로 근사 <a href="https://zilliz.com/blog/ANN-machine-learning">근사 이웃</a>(ANN) 검색을 수행합니다. 적절한 유사성 임계값과 폴백 전략을 통해 Milvus는 안정적이고 예측 가능한 성능을 보장하여 캐시 계층을 전체 라우팅 시스템을 위한 탄력적인 시맨틱 메모리로 전환합니다.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">개발자가 프로덕션 환경에서 시맨틱 라우터 + Milvus를 사용하는 방법<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>속도, 비용, 재사용성이 모두 중요한 실제 프로덕션 환경에서는 <strong>vLLM 시맨틱 라우터와</strong> <strong>Milvus의</strong> 조합이 빛을 발합니다.</p>
<p>세 가지 일반적인 시나리오가 두드러집니다:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. 고객 서비스 Q&amp;A</h3><p>고객 대면 봇은 비밀번호 재설정, 계정 업데이트, 배송 상태 등 매일 대량의 반복적인 쿼리를 처리합니다. 이 도메인은 비용과 지연 시간에 민감하므로 시맨틱 라우팅에 이상적입니다. 라우터는 일상적인 질문은 더 작고 빠른 모델로 보내고 복잡하거나 모호한 질문은 더 큰 모델로 에스컬레이션하여 더 심층적인 추론을 수행합니다. 한편 Milvus는 이전 Q&amp;A 쌍을 캐시하므로 유사한 쿼리가 나타날 때 시스템이 다시 생성하는 대신 과거 답변을 즉시 재사용할 수 있습니다.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. 코드 지원</h3><p>개발자 도구나 IDE 어시스턴트에서는 구문 도움말, API 조회, 작은 디버깅 힌트 등 많은 쿼리가 중복됩니다. 라우터는 각 프롬프트의 의미 구조를 분석하여 간단한 작업에는 가볍게, 다단계 추론에는 더 많은 기능을 제공하는 등 적절한 모델 크기를 동적으로 선택합니다. Milvus는 유사한 코딩 문제와 그 해결책을 캐싱하여 이전 사용자 상호 작용을 재사용 가능한 지식 베이스로 전환함으로써 응답성을 더욱 향상시킵니다.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. 엔터프라이즈 지식창고</h3><p>정책 조회, 규정 준수 참조, 제품 FAQ 등 엔터프라이즈 쿼리는 시간이 지남에 따라 반복되는 경향이 있습니다. Milvus를 시맨틱 캐시 레이어로 사용하면 자주 묻는 질문과 그에 대한 답변을 효율적으로 저장하고 검색할 수 있습니다. 이를 통해 중복 계산을 최소화하는 동시에 여러 부서와 지역에서 일관된 응답을 유지할 수 있습니다.</p>
<p>내부적으로 <strong>시맨틱 라우터 + Milvus</strong> 파이프라인은 고성능과 짧은 지연 시간을 위해 <strong>Go와</strong> <strong>Rust에서</strong> 구현됩니다. 게이트웨이 계층에 통합되어 적중률, 라우팅 지연 시간, 모델 성능과 같은 주요 지표를 지속적으로 모니터링하여 실시간으로 라우팅 전략을 미세 조정합니다.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">시맨틱 라우터에서 시맨틱 캐싱을 빠르게 테스트하는 방법<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>시맨틱 캐싱을 대규모로 배포하기 전에 제어된 설정에서 어떻게 작동하는지 검증하는 것이 유용합니다. 이 섹션에서는 시맨틱 라우터가 <strong>Milvus를</strong> 시맨틱 캐시로 사용하는 방법을 보여주는 간단한 로컬 테스트를 살펴보겠습니다. 유사한 쿼리가 캐시에 즉시 도달하고 새 쿼리 또는 고유 쿼리가 모델 생성을 트리거하여 캐싱 로직이 어떻게 작동하는지 확인할 수 있습니다.</p>
<h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ul>
<li>컨테이너 환경: Docker + Docker Compose</li>
<li>벡터 데이터베이스: Milvus 서비스</li>
<li>LLM + 임베딩: 로컬로 다운로드한 프로젝트</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1. Milvus 벡터 데이터베이스 배포하기</h3><p>배포 파일을 다운로드합니다.</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 서비스를 시작합니다.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. 프로젝트 복제</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. 로컬 모델 다운로드</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. 구성 수정</h3><p>참고: semantic_cache 타입을 milvus로 수정합니다.</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>밀버스 구성 수정 참고: 방금 배포한 밀버스 밀버스 서비스를 입력합니다.</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. 프로젝트 시작</h3><p>참고: 일부 Docker파일 종속성은 국내 소스로 수정하는 것을 권장합니다.</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. 테스트 요청</h3><p>참고: 총 두 번의 요청(캐시 및 캐시 히트 없음) 첫 번째 요청:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>두 번째 요청:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>이 테스트는 Semantic Router의 시맨틱 캐싱이 실제로 작동하는 것을 보여줍니다. Milvus를 벡터 데이터베이스로 활용함으로써 의미적으로 유사한 쿼리를 효율적으로 매칭하여 사용자가 동일하거나 유사한 질문을 할 때 응답 시간을 개선합니다.</p>
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
    </button></h2><p>AI 워크로드가 증가하고 비용 최적화가 필수적인 상황에서 vLLM 시맨틱 라우터와 <a href="https://milvus.io/">Milvus의</a> 조합은 지능적으로 확장할 수 있는 실용적인 방법을 제공합니다. 이 설정은 각 쿼리를 올바른 모델로 라우팅하고 분산 벡터 데이터베이스로 의미적으로 유사한 결과를 캐싱함으로써 컴퓨팅 오버헤드를 줄이는 동시에 사용 사례 전반에서 응답을 빠르고 일관되게 유지합니다.</p>
<p>요컨대, 무차별적인 확장 없이 더 스마트하게 확장하고 더 많은 두뇌를 활용할 수 있습니다.</p>
<p>이에 대해 더 자세히 알아보고 싶으시면 <a href="https://discord.com/invite/8uyFbECzPX">Milvus 디스코드에서</a> 대화에 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에서</a> 이슈를 개설하세요. 또한 20분 동안 진행되는 Milvus<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> 오피스 아워 세션을</a> 예약하여 Milvus 개발팀으로부터 일대일 안내, 인사이트 및 기술 심층 분석을 받을 수도 있습니다.</p>
