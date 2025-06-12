---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 'Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색'
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Milvus 2.6이 출시되었음을 알려드리게 되어 기쁩니다. 이번 릴리스에는 오늘날 벡터 검색의 가장 시급한 과제인 효율적인 확장과 비용
  관리를 직접적으로 해결하는 수십 가지 기능이 도입되었습니다.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>AI 기반 검색이 실험적인 프로젝트에서 미션 크리티컬 인프라로 발전함에 따라, <a href="https://milvus.io/blog/what-is-a-vector-database.md">벡터 데이터베이스에</a> 대한 요구가 더욱 강화되었습니다. 조직은 수십억 개의 벡터를 처리하는 동시에 인프라 비용을 관리하고, 실시간 데이터 수집을 지원하고, 기본적인 <a href="https://zilliz.com/learn/vector-similarity-search">유사성 검색을</a> 넘어선 정교한 검색 기능을 제공해야 합니다. 이러한 진화하는 과제를 해결하기 위해, 저희는 Milvus를 개발하고 개선하기 위해 열심히 노력해 왔습니다. 커뮤니티의 반응은 매우 고무적이었으며, 소중한 피드백을 통해 앞으로의 방향을 설정하는 데 큰 도움이 되었습니다.</p>
<p>수개월간의 집중적인 개발 끝에 <strong>Milvus 2.6을</strong> 출시하게 되어 기쁘게 생각합니다. 이번 버전은 오늘날 벡터 검색에서 가장 시급한 과제인 <strong><em>효율적인 확장과 비용 관리를</em></strong> 직접적으로 해결합니다 <strong><em>.</em></strong></p>
<p>Milvus 2.6은 <strong>비용 절감, 고급 검색 기능, 대규모 확장을 위한 아키텍처 개선이라는</strong> 세 가지 중요한 영역에 걸쳐 획기적인 혁신을 제공합니다. 그 결과는 그 자체로 증명됩니다:</p>
<ul>
<li><p>RaBitQ 1비트 양자화를 통한<strong>72% 메모리 절감</strong>, 4배 빠른 쿼리 처리 속도 제공</p></li>
<li><p>지능형 계층형 스토리지를 통한<strong>50% 비용 절감</strong> </p></li>
<li><p>향상된 BM25 구현으로 Elasticsearch보다<strong>4배 빠른 전체 텍스트 검색</strong> 가능</p></li>
<li><p>새로 도입된 경로 인덱스로<strong>100배 빨라진</strong> JSON 필터링<strong>속도</strong> </p></li>
<li><p>새로운 제로 디스크 아키텍처를 통해<strong>경제적으로 검색 최신성 달성</strong> </p></li>
<li><p>새로운 '데이터 인 앤 데이터 아웃' 환경으로<strong>간소화된 임베딩 워크플로</strong> </p></li>
<li><p>미래 보장형 멀티테넌시를 위해<strong>단일 클러스터에서 최대 100,000개의 컬렉션을</strong> 지원합니다.</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">비용 절감을 위한 혁신: 벡터 검색을 경제적으로 만들기<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>메모리 소비는 수십억 개의 레코드로 벡터 검색을 확장할 때 가장 큰 문제 중 하나입니다. Milvus 2.6은 인프라 비용을 크게 절감하는 동시에 성능을 향상시키는 몇 가지 주요 최적화를 도입했습니다.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1비트 양자화: 4배의 성능으로 72% 메모리 절감</h3><p>기존의 양자화 방식에서는 메모리 절약을 위해 검색 품질을 희생해야 했습니다. Milvus 2.6은 지능적인 정제 메커니즘과 결합된 <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1비트 양자화를</a> 통해 이러한 문제를 해결합니다.</p>
<p>새로운 IVF_RABITQ 인덱스는 1비트 양자화를 통해 메인 인덱스를 원래 크기의 1/32로 압축합니다. 이 접근 방식은 옵션으로 제공되는 SQ8 개선과 함께 사용하면 원래 메모리 공간의 1/4만 사용하여 높은 검색 품질(95% 리콜)을 유지합니다.</p>
<p>예비 벤치마크 결과도 유망한 것으로 나타났습니다:</p>
<table>
<thead>
<tr><th><strong>성능 메트릭</strong></th><th><strong>기존 IVF_FLAT</strong></th><th><strong>RaBitQ(1비트) 전용</strong></th><th><strong>RaBitQ(1비트) + SQ8 개선</strong></th></tr>
</thead>
<tbody>
<tr><td>메모리 풋프린트</td><td>100%(기준)</td><td>3%(97% 감소)</td><td>28%(72% 감소)</td></tr>
<tr><td>리콜</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>검색 처리량(QPS)</td><td>236</td><td>648(2.7배 빨라짐)</td><td>946(4배 빨라짐)</td></tr>
</tbody>
</table>
<p><em>표: 768차원의 1M 벡터를 사용한 VectorDBBench 평가, AWS m6id.2xlarge에서 테스트됨.</em></p>
<p>여기서 진정한 혁신은 72%의 메모리 감소뿐만 아니라 이를 달성하는 동시에 4배의 처리량 향상을 제공한다는 점입니다. 즉, 기존 인프라에서 75% 더 적은 수의 서버로 동일한 워크로드를 처리하거나 4배 더 많은 트래픽을 처리하면서도 리콜을 희생하지 않고도 동일한 서비스를 제공할 수 있습니다.</p>
<p><a href="https://zilliz.com/cloud"> 질리즈 클라우드에서</a> 완전 관리형 Milvus를 사용하는 기업 사용자를 위해 특정 워크로드 특성과 정밀도 요구 사항에 따라 RaBitQ 매개변수를 동적으로 조정하는 자동화된 전략을 개발하고 있습니다. 모든 질리즈 클라우드 CU 유형에서 더 높은 비용 효율성을 누릴 수 있습니다.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">핫-콜드 계층형 스토리지: 지능형 데이터 배치를 통한 50% 비용 절감</h3><p>실제 벡터 검색 워크로드에는 액세스 패턴이 매우 다양한 데이터가 포함되어 있습니다. 자주 액세스하는 데이터는 즉각적인 가용성이 필요한 반면, 보관 데이터는 스토리지 비용을 대폭 절감하는 대신 약간 더 높은 지연 시간을 용인할 수 있습니다.</p>
<p>Milvus 2.6은 액세스 패턴에 따라 데이터를 자동으로 분류하고 적절한 스토리지 계층에 배치하는 계층형 스토리지 아키텍처를 도입했습니다:</p>
<ul>
<li><p><strong>지능형 데이터 분류</strong>: Milvus는 액세스 패턴에 따라 핫(자주 액세스하는) 데이터 세그먼트와 콜드(거의 액세스하지 않는) 데이터 세그먼트를 자동으로 식별합니다.</p></li>
<li><p><strong>최적화된 스토리지 배치</strong>: 핫 데이터는 고성능 메모리/SSD에 유지하고 콜드 데이터는 보다 경제적인 오브젝트 스토리지로 이동합니다.</p></li>
<li><p><strong>동적 데이터 이동</strong>: 사용 패턴이 변경되면 계층 간에 데이터가 자동으로 마이그레이션됩니다.</p></li>
<li><p><strong>투명한 검색</strong>: 쿼리가 콜드 데이터에 닿으면 필요에 따라 자동으로 로드됩니다.</p></li>
</ul>
<p>그 결과, 활성 데이터에 대한 쿼리 성능을 유지하면서 스토리지 비용을 최대 50%까지 절감할 수 있습니다.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">추가적인 비용 최적화</h3><p>Milvus 2.6은 또한 HNSW 인덱스에 대한 Int8 벡터 지원, 최적화된 구조를 위한 Storage v2 포맷으로 IOPS와 메모리 요구 사항을 줄이고, APT/YUM 패키지 관리자를 통해 직접 쉽게 설치할 수 있는 기능을 도입했습니다.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">고급 검색 기능: 기본 벡터 유사도 그 이상<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>최신 AI 애플리케이션에는 벡터 검색만으로는 충분하지 않습니다. 사용자들은 벡터 임베딩의 시맨틱 이해와 함께 기존 정보 검색의 정밀도를 요구합니다. Milvus 2.6은 이러한 격차를 해소하는 고급 검색 기능 세트를 도입했습니다.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">터보차지된 BM25: Elasticsearch보다 400% 더 빠른 전체 텍스트 검색</h3><p><a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">전체 텍스트 검색은</a> 벡터 데이터베이스에서 하이브리드 검색 시스템을 구축하는 데 필수적인 요소가 되었습니다. Milvus 2.6에서는 버전 2.5부터 도입된 BM25 구현을 기반으로 전체 텍스트 검색의 성능이 크게 개선되었습니다. 예를 들어, 이번 릴리스에서는 <code translate="no">drop_ratio_search</code> 및 <code translate="no">dim_max_score_ratio</code> 과 같은 새로운 매개변수를 도입하여 정밀도와 속도 조정을 개선하고 더욱 세분화된 검색 제어 기능을 제공합니다.</p>
<p>업계 표준 BEIR 데이터 세트에 대한 벤치마크 결과, Milvus 2.6은 동일한 리콜률로 Elasticsearch보다 3~4배 높은 처리량을 달성하는 것으로 나타났습니다. 특정 워크로드의 경우, 그 개선 효과는 7배 더 높은 QPS에 이릅니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSON 경로 인덱스: 100배 빨라진 필터링</h3><p>Milvus는 오랫동안 JSON 데이터 유형을 지원해왔지만, 인덱스 지원이 부족하여 JSON 필드에 대한 필터링 속도가 느렸습니다. Milvus 2.6은 JSON 경로 인덱스 지원을 추가하여 성능을 크게 향상시켰습니다.</p>
<p>각 레코드에 다음과 같이 중첩된 메타데이터가 포함된 사용자 프로필 데이터베이스를 예로 들어보겠습니다:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>샌프란시스코로만 범위가 한정된 "AI에 관심 있는 사용자"라는 의미론적 검색의 경우, Milvus는 모든 레코드에 대해 전체 JSON 객체를 구문 분석하고 평가해야 했기 때문에 쿼리가 매우 비싸고 느렸습니다.</p>
<p>이제 Milvus를 사용하면 JSON 필드 내의 특정 경로에 인덱스를 생성하여 검색 속도를 높일 수 있습니다:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>1억 개 이상의 레코드를 대상으로 한 성능 테스트에서 JSON 경로 인덱스는 필터 지연 시간을 <strong>140ms</strong> (P99: 480ms)에서 단 <strong>1.5ms</strong> (P99: 10ms)로 99% 단축하여 이러한 검색을 실제 운영 환경에서 실용적으로 사용할 수 있게 해줍니다.</p>
<p>이 기능은 특히 다음과 같은 경우에 유용합니다:</p>
<ul>
<li><p>복잡한 사용자 속성 필터링이 있는 추천 시스템</p></li>
<li><p>메타데이터를 기준으로 문서를 필터링하는 RAG 애플리케이션</p></li>
<li><p>데이터 세분화가 중요한 멀티테넌트 시스템</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">향상된 텍스트 처리 및 시간 인식 검색</h3><p>Milvus 2.6은 일본어와 한국어를 위한 Lindera 토큰화, 포괄적인 다국어 지원을 위한 ICU 토큰화, 사용자 정의 사전 통합이 포함된 향상된 Jieba 등 정교한 언어 처리 기능을 갖춘 완전히 새로워진 텍스트 분석 파이프라인을 도입했습니다.</p>
<p>구문<strong>일치 인텔리전스는</strong> 어순의 의미적 뉘앙스를 포착하여 '기계 학습 기술'과 '학습 기계 기술'을 구분합니다:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>시간 인식 감쇠 기능은</strong> 문서 연한에 따라 관련성 점수를 조정하고, 감쇠율과 함수 유형(지수, 가우스, 선형)을 구성해 자동으로 새로운 콘텐츠의 우선순위를 정합니다.</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">간소화된 검색: 데이터 인, 데이터 아웃 경험</h3><p>원시 데이터와 벡터 임베딩 사이의 단절은 벡터 데이터베이스를 사용하는 개발자의 또 다른 고충입니다. 데이터가 인덱싱 및 벡터 검색을 위해 Milvus에 도달하기 전에 원시 텍스트, 이미지 또는 오디오를 벡터 표현으로 변환하는 외부 모델을 사용하여 전처리를 거치는 경우가 많습니다. 검색 후에는 결과 ID를 원본 콘텐츠에 다시 매핑하는 등의 추가적인 다운스트림 처리도 필요합니다.</p>
<p>Milvus 2.6은 타사 임베딩 모델을 검색 파이프라인에 직접 통합하는 새로운 <strong>함수</strong> 인터페이스를 통해 이러한 임베딩 워크플로우를 간소화합니다. 이제 임베딩을 미리 계산하는 대신 다음과 같이 할 수 있습니다:</p>
<ol>
<li><p><strong>원시 데이터를 직접 삽입합니다</strong>: 텍스트, 이미지 또는 기타 콘텐츠를 Milvus에 제출합니다.</p></li>
<li><p><strong>임베딩 공급자를 구성합니다</strong>: OpenAI, AWS Bedrock, 구글 버텍스 AI, 허깅 페이스 등의 임베딩 API 서비스에 연결할 수 있습니다.</p></li>
<li><p><strong>자연어를 사용하여 쿼리하기</strong>: 원시 텍스트 쿼리를 직접 사용하여 검색</p></li>
</ol>
<p>이렇게 하면 Milvus가 모든 백그라운드 벡터 변환을 간소화하는 '데이터 인, 데이터 아웃' 환경이 만들어집니다.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">아키텍처의 진화: 수백억 개의 벡터로 확장하기<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 수백억 개의 벡터로 비용 효율적으로 확장할 수 있는 근본적인 아키텍처 혁신을 도입했습니다.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">새로운 우드펙커 WAL로 카프카 및 펄서 대체</h3><p>이전의 Milvus 배포는 WAL(Write-Ahead Log) 시스템으로 Kafka 또는 Pulsar와 같은 외부 메시지 큐에 의존했습니다. 이러한 시스템은 처음에는 잘 작동했지만 상당한 운영 복잡성과 리소스 오버헤드를 초래했습니다.</p>
<p>Milvus 2.6은 혁신적인 제로 디스크 설계를 통해 이러한 외부 종속성을 제거한 특수 목적의 클라우드 네이티브 WAL 시스템인 <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker를</strong></a> 도입했습니다:</p>
<ul>
<li><p><strong>모든 것이 오브젝트 스토리지에</strong> 저장됩니다: 모든 로그 데이터는 S3, Google Cloud Storage 또는 MinIO와 같은 객체 스토리지에 보존됩니다.</p></li>
<li><p><strong>분산 메타데이터</strong>: 메타데이터는 여전히 etcd 키-값 저장소에 의해 관리됩니다.</p></li>
<li><p><strong>로컬 디스크 종속성 없음</strong>: 분산된 로컬 영구 상태와 관련된 복잡한 아키텍처와 운영 오버헤드를 제거하기 위한 선택입니다.</p></li>
</ul>
<p>포괄적인 벤치마크를 실행하여 Woodpecker의 성능을 비교했습니다:</p>
<table>
<thead>
<tr><th><strong>시스템</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP 로컬</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>처리량</td><td>129.96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>지연 시간</td><td>58ms</td><td>35ms</td><td>184ms</td><td>1.8ms</td><td>166ms</td></tr>
</tbody>
</table>
<p>각 스토리지 백엔드에 대한 이론적 최대 처리량의 60~80%를 지속적으로 달성하며, 로컬 파일 시스템 모드는 Kafka보다 3.5배 빠른 450MB/s, S3 모드는 5.8배 높은 750MB/s의 처리량을 달성하는 등 Woodpecker는 지속적으로 이론적 최대 처리량을 달성합니다.</p>
<p>Woodpecker에 대한 자세한 내용은 이 블로그에서 확인하세요: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">밀버스를 위해 카프카/펄서를 우드펙커로 대체했습니다</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">경제적으로 달성한 검색 최신성</h3><p>미션 크리티컬 검색은 일반적으로 새로 수집된 데이터를 즉시 검색할 수 있어야 합니다. Milvus 2.6은 메시지 큐 의존성을 대체하여 새로운 업데이트 처리를 근본적으로 개선하고 더 낮은 리소스 오버헤드로 검색 최신성을 제공합니다. 새로운 아키텍처에는 쿼리 노드 및 데이터 노드와 같은 다른 Milvus 구성 요소와 긴밀하게 협력하여 작동하는 전용 구성 요소인 <strong>스트리밍 노드가</strong> 새롭게 추가되었습니다. 스트리밍 노드는 경량 클라우드 네이티브 WAL(Write-Ahead Log) 시스템인 Woodpecker를 기반으로 구축되었습니다.</p>
<p>이 새로운 구성 요소는 다음을 가능하게 합니다:</p>
<ul>
<li><p><strong>뛰어난 호환성</strong>: 새로운 Woodpecker WAL과 함께 작동하며 Kafka, Pulsar 및 기타 스트리밍 플랫폼과도 역호환됩니다.</p></li>
<li><p><strong>증분 인덱싱</strong>: 배치 지연 없이 새로운 데이터를 즉시 검색할 수 있습니다.</p></li>
<li><p><strong>지속적인 쿼리 제공</strong>: 높은 처리량 수집과 짧은 지연 시간의 쿼리 동시 제공</p></li>
</ul>
<p>스트리밍 노드는 일괄 처리에서 스트리밍을 분리함으로써 Milvus가 대용량 데이터 수집 중에도 안정적인 성능과 검색 최신성을 유지할 수 있도록 도와줍니다. 수평적 확장성을 염두에 두고 설계되어 데이터 처리량에 따라 노드 용량을 동적으로 확장할 수 있습니다.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">향상된 멀티테넌시 기능: 클러스터당 10만 개의 컬렉션으로 확장</h3><p>엔터프라이즈 배포에는 테넌트 수준의 격리가 필요한 경우가 많습니다. Milvus 2.6은 클러스터당 최대 <strong>100,000개의 컬렉션을</strong> 허용하여 멀티 테넌시 지원을 대폭 강화했습니다. 이는 많은 테넌트를 지원하는 모놀리식 대규모 클러스터를 운영하는 조직에 매우 중요한 개선 사항입니다.</p>
<p>이러한 개선은 메타데이터 관리, 리소스 할당, 쿼리 계획에 대한 수많은 엔지니어링 최적화를 통해 가능해졌습니다. 이제 Milvus 사용자는 수만 개의 컬렉션이 있어도 안정적인 성능을 누릴 수 있습니다.</p>
<h3 id="Other-Improvements" class="common-anchor-header">기타 개선 사항</h3><p>Milvus 2.6은 여러 지역에 걸쳐 데이터 복제를 간소화하는 CDC + BulkInsert와 대규모 배포에서 클러스터 조정을 개선하는 Coord Merge 등 더 많은 아키텍처 개선 사항을 제공합니다.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Milvus 2.6 시작하기<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6은 수십 가지의 새로운 기능과 성능 최적화가 포함된 대규모 엔지니어링 노력의 결과물로, Zilliz 엔지니어와 뛰어난 커뮤니티 기여자들이 공동으로 개발했습니다. 여기에서는 주요 기능에 대해 설명했지만, 그 외에도 더 많은 기능이 있습니다. 이번 릴리스의 모든 기능을 살펴보려면 종합적인 <a href="https://milvus.io/docs/release_notes.md">릴리스 노트를</a> 살펴보는 것이 좋습니다!</p>
<p>전체 문서, 마이그레이션 가이드 및 튜토리얼은<a href="https://milvus.io/"> Milvus 웹사이트에서</a> 확인할 수 있습니다. 질문과 커뮤니티 지원이 필요하면<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요.</p>
