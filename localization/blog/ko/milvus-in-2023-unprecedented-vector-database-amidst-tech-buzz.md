---
id: milvus-in-2023-unprecedented-vector-database-amidst-tech-buzz.md
title: '2023년: AI의 해'
author: James Luan
date: 2024-01-05T00:00:00.000Z
desc: '벡터 데이터베이스 업계 전반을 살펴보고, 특히 이 업계에서 뛰어난 제품인 Milvus에 초점을 맞춥니다.'
cover: >-
  assets.zilliz.com/Milvus_in_2023_An_Atypical_Vector_DB_Amidst_Tech_Buzz_1_1151400765.png
tags: 'Milvus, Vector Database, LLM, RAG, Open Source, Artificial Intelligence'
recommend: true
canonicalUrl: >-
  https://thenewstack.io/milvus-in-2023-open-source-vector-database-year-in-review/
---
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/image_7_1c3b05e71c.jpg" alt="This image is generated by AI. " class="doc-image" id="this-image-is-generated-by-ai.-" />
   <span>이 이미지는 AI가 생성한 것입니다. </span> </span>
  
</p>
<custom-h1>2023년의 Milvus: 기술의 화두 속에 등장한 전례 없는 벡터 데이터베이스</custom-h1><p><em>이 게시물은 ChatGPT의 도움을 받아 James Luan이 작성했습니다. James는 주로 프롬프트를 작성하고 AI가 생성한 콘텐츠를 검토하고 다듬었습니다.</em></p>
<h2 id="2023-the-year-of-AI" class="common-anchor-header">2023년: AI의 해<button data-href="#2023-the-year-of-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023년은 인공 지능(AI)의 중요한 전환점이 될 것입니다. <a href="https://zilliz.com/glossary/large-language-models-(llms)">대규모 언어 모델(LLM)</a> 은 뛰어난 자연어 처리 능력으로 널리 인정받으며 각광을 받고 있습니다. 이러한 인기의 급증은 머신러닝 애플리케이션의 가능성을 크게 확장하여 개발자들이 보다 지능적이고 대화형 애플리케이션을 구축할 수 있게 해 주었습니다.</p>
<p>이러한 혁명 속에서 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스는</a> LLM의 장기 메모리 역할을 하는 중요한 구성 요소로 부상했습니다. <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">검색 증강 세대(RAG</a> ) 모델, 지능형 에이전트, 멀티모달 검색 앱의 등장은 멀티모달 데이터 검색 효율성을 높이고, LLM의 환각을 줄이고, 도메인 지식을 보완하는 데 있어 벡터 데이터베이스의 막대한 잠재력을 입증했습니다.</p>
<p>LLM의 진화는 임베딩 기술에서도 상당한 발전을 촉진했습니다. 허깅페이스의 <a href="https://huggingface.co/spaces/mteb/leaderboard">대규모 텍스트 임베딩 벤치마크(MTEB) 리더보드에</a> 따르면 UAE, VoyageAI, CohereV3, Bge와 같은 주요 임베딩 모델이 모두 2023년에 출시되었습니다. 이러한 발전은 Milvus와 같은 다양한 벡터 검색 기술의 벡터 검색 효과를 강화하여 AI 애플리케이션에 보다 정확하고 효율적인 데이터 처리 기능을 제공했습니다.</p>
<p>그러나 벡터 데이터베이스의 인기가 높아지면서 전문화된 솔루션의 필요성에 대한 논쟁이 일어났습니다. 수십 개의 스타트업이 벡터 데이터베이스 분야에 뛰어들었습니다. 많은 전통적인 관계형 데이터베이스와 NoSQL 데이터베이스가 벡터를 중요한 데이터 유형으로 취급하기 시작했고, 많은 업체들이 모든 상황에서 전문화된 벡터 데이터베이스를 대체할 수 있다고 주장하고 있습니다.</p>
<p>2024년에 접어드는 지금이야말로 벡터 데이터베이스 업계 전체를 되돌아보고, 특히 이러한 환경에서 뛰어난 제품인 Milvus에 주목할 만한 시기입니다.</p>
<h2 id="Milvus-in-2023-numbers-dont-lie" class="common-anchor-header">2023년의 Milvus: 숫자는 거짓말을 하지 않습니다.<button data-href="#Milvus-in-2023-numbers-dont-lie" class="anchor-icon" translate="no">
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
    </button></h2><p>2019년에 처음 출시된 <a href="https://zilliz.com/what-is-milvus">Milvus는</a> 벡터 데이터베이스의 개념을 개척했으며 높은 안정성, 확장성, 검색 품질 및 성능에 대한 명성을 꾸준히 유지해 왔습니다. 2023년에 Milvus는 인상적인 성과를 거두었으며, 주로 LLM의 급속한 발전과 AIGC 애플리케이션의 붐에 힘입어 상당한 변화를 겪었습니다. 다음은 2023년 Milvus의 성과를 가장 잘 보여주는 몇 가지 주요 수치입니다.</p>
<h3 id="ZERO-downtime-during-rolling-upgrades" class="common-anchor-header">롤링 업그레이드 중 가동 중단 시간 제로</h3><p>벡터 데이터베이스를 처음 접하는 사람들은 운영 유지보수보다는 기능에 중점을 둡니다. 또한 많은 애플리케이션 개발자는 애플리케이션이 초기 탐색 단계에 있는 경우가 많기 때문에 트랜잭션 데이터베이스보다 벡터 데이터베이스의 안정성에 덜 주의를 기울입니다. 그러나 프로덕션 환경에 AIGC 애플리케이션을 배포하고 최상의 사용자 경험을 제공하려는 경우 안정성은 필수 불가결한 요소입니다.</p>
<p>Milvus는 기능뿐만 아니라 운영 안정성을 우선시하여 차별화합니다. Milvus는 버전 2.2.3부터 롤링 업그레이드를 추가했습니다. 지속적인 개선을 통해 업그레이드 중에도 비즈니스 프로세스를 중단하지 않고 다운타임을 최소화할 수 있는 기능입니다.</p>
<h3 id="3x-performance-improvement-in-production-environments" class="common-anchor-header">프로덕션 환경에서의 3배 성능 향상</h3><p>벡터 검색 성능을 향상시키는 것은 벡터 데이터베이스의 주요 목표가 되어야 합니다. 많은 벡터 검색 솔루션이 빠른 시장 출시를 위해 <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> 알고리즘을 적용하는 것을 기반으로 솔루션을 선택했지만, 안타깝게도 실제 운영 환경에서는 특히 고도로 필터링된 검색(90% 이상)과 빈번한 데이터 삭제 등 상당한 문제에 직면하게 됩니다. Milvus는 처음부터 성능을 고려하여 개발의 모든 단계, 특히 프로덕션 환경에서 성능을 최적화하는 데 탁월하며, 특히 필터링된 검색과 스트리밍 삽입/검색 상황에서 검색 성능을 3배 이상 향상시켰습니다.</p>
<p>벡터 데이터베이스 커뮤니티를 더욱 지원하기 위해 작년에 오픈 소스 벤치마킹 도구인 <a href="https://github.com/zilliztech/VectorDBBench">VectorDBBench를</a> 도입했습니다. 이 도구는 다양한 조건에서 벡터 데이터베이스를 조기에 평가하는 데 필수적입니다. 기존의 평가 방법과 달리, VectorDBBench는 초대형 데이터 세트나 실제 임베딩 모델의 데이터와 매우 유사한 데이터 등 실제 데이터를 사용해 데이터베이스를 평가함으로써 사용자에게 정보에 입각한 의사결정을 위한 보다 통찰력 있는 정보를 제공합니다.</p>
<h3 id="5-recall-improvement-on-the-Beir-dataset" class="common-anchor-header">Beir 데이터 세트의 회상률 5% 향상</h3><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">고밀도 임베딩은</a> 벡터 검색에서는 효과적인 것으로 입증되었지만, 이름, 개체, 약어 및 짧은 쿼리 컨텍스트를 검색할 때는 반드시 따라잡아야 합니다. 이러한 한계에 대응하기 위해 밀도 임베딩과 <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">스파스 임베딩을</a> 통합하여 검색 결과의 품질을 향상시키는 하이브리드 쿼리 접근 방식을 도입했습니다. 이 하이브리드 솔루션과 재랭크 모델의 시너지 효과로 인해 Beir 데이터 세트의 리콜률이 5% 향상되었으며, 테스트 결과 그 효과가 입증되었습니다.</p>
<p>검색 품질 개선을 넘어, Milvus는 WAND와 같은 기존 검색 알고리즘의 성능을 능가하는 희소 임베딩에 맞춤화된 그래프 기반 검색 솔루션도 공개했습니다.</p>
<p>2023년 NeurIPS BigANN 대회에서 질리즈의 유능한 엔지니어인 왕 지하오는 스파스 임베딩 검색 트랙에서 다른 출품작보다 월등한 우위를 보인 검색 알고리즘인 <a href="https://big-ann-benchmarks.com/neurips23.html#winners">Pyanns를</a> 발표했습니다. 이 획기적인 솔루션은 프로덕션 환경을 위한 스파스 임베딩 검색 알고리즘의 선구자입니다.</p>
<h3 id="10x-memory-saving-on-large-datasets" class="common-anchor-header">대용량 데이터 세트에서 10배의 메모리 절약</h3><p><a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">검색 증강 생성</a> (RAG)은 2023년에 벡터 데이터베이스의 가장 인기 있는 사용 사례였습니다. 그러나 RAG 애플리케이션에서 벡터 데이터 볼륨이 증가함에 따라 이러한 애플리케이션에는 스토리지 문제가 발생합니다. 특히 변환된 벡터의 용량이 원본 문서 청크의 용량을 초과하여 메모리 사용 비용이 증가할 때 이러한 문제가 더욱 심각해집니다. 예를 들어, 문서를 청크로 나눈 후 500개 토큰 청크(약 1kb)를 변환한 1536차원 플로트32 벡터(약 3kb)의 크기는 500개 토큰 청크보다 더 큽니다.</p>
<p>Milvus는 디스크 기반 인덱싱을 지원하는 최초의 오픈소스 벡터 데이터베이스로, 5배의 놀라운 메모리 절감 효과를 가져다줍니다. 2023년 말에는 메모리 매핑 파일<a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">(MMap)</a>을 사용해 스칼라 및 벡터 데이터/인덱스를 디스크에 로드할 수 있는 기능을 갖춘 <a href="https://milvus.io/docs/release_notes.md#v234">Milvus 2.3.4를</a> 출시할 예정입니다. 이 발전된 기능은 기존의 인메모리 인덱싱에 비해 메모리 사용량을 10배 이상 줄여줍니다.</p>
<h3 id="20-Milvus-releases" class="common-anchor-header">20개의 Milvus 릴리즈</h3><p>2023년에 Milvus는 중요한 이정표로 표시되는 혁신적인 여정을 거쳤습니다. 한 해 동안 300명이 넘는 커뮤니티 개발자들의 헌신과 사용자 중심 개발 접근 방식에 대한 우리의 약속을 실현한 증거로 20개의 릴리스가 출시되었습니다.</p>
<p>예를 들어, Milvus 2.2.9에서는 <a href="https://zilliz.com/blog/what-is-dynamic-schema">동적 스키마를</a> 도입하여 성능 우선순위에서 사용성 향상으로 중요한 전환을 이루었습니다. 이를 기반으로 <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3에서는</a> 사용자 커뮤니티의 구체적인 요구와 피드백에 따라 업서트, <a href="https://zilliz.com/blog/unlock-advanced-recommendation-engines-with-milvus-new-range-search">범위 검색</a>, 코사인 메트릭 등과 같은 중요한 기능을 도입했습니다. 이러한 반복적인 개발 프로세스는 Milvus를 사용자의 진화하는 요구사항에 지속적으로 맞추기 위한 노력을 강조합니다.</p>
<h3 id="1000000-tenants-in-a-Single-Custer" class="common-anchor-header">단일 커스터로 1,000,000명의 테넌트 지원</h3><p>멀티 테넌시를 구현하는 것은 데이터 격리에 대한 사용자의 높아진 요구 사항을 충족하면서 RAG 시스템, AI 에이전트 및 기타 LLM 애플리케이션을 개발하는 데 매우 중요합니다. B2C 비즈니스의 경우 테넌트 수가 수백만 개로 급증하여 사용자 데이터의 물리적 격리가 비현실적으로 될 수 있습니다(예를 들어, 관계형 데이터베이스에 수백만 개의 테이블을 생성하는 사람은 거의 없을 것입니다). Milvus는 파티션 키 기능을 도입하여 파티션 키를 기반으로 효율적이고 논리적으로 격리하고 데이터를 필터링할 수 있어 대규모로 편리하게 사용할 수 있습니다.</p>
<p>반대로 수만 명의 테넌트를 다루는 데 익숙한 B2B 기업은 물리적 리소스 격리와 관련된 보다 미묘한 전략의 이점을 누릴 수 있습니다. 최신 Milvus 2.3.4는 향상된 메모리 관리, 코루틴 처리, CPU 최적화를 통해 단일 클러스터 내에서 수만 개의 테이블을 더 쉽게 생성할 수 있도록 지원합니다. 또한 향상된 효율성과 제어 기능으로 B2B 비즈니스의 요구 사항을 충족합니다.</p>
<h3 id="10000000-Docker-image-pulls" class="common-anchor-header">10,000,000개의 Docker 이미지 풀 달성</h3><p>2023년에 접어들면서 Milvus는 1 <a href="https://hub.docker.com/r/milvusdb/milvus">,000만 건의 Docker 풀</a> 다운로드라는 인상적인 이정표를 달성했습니다. 이 성과는 개발자 커뮤니티가 Milvus에 점점 더 매료되고 있으며, 벡터 데이터베이스 영역 내에서 그 중요성이 높아지고 있음을 보여줍니다.</p>
<p>세계 최초의 클라우드 네이티브 벡터 데이터베이스인 Milvus는 Kubernetes 및 더 광범위한 컨테이너 에코시스템과의 원활한 통합을 자랑합니다. 미래를 내다보면서 끊임없이 진화하는 벡터 데이터베이스 환경의 다음 초점이 어디로 향할지 고민하지 않을 수 없습니다. 서버리스 서비스의 부상이 아닐까요?</p>
<h3 id="10-billion-entities-in-a-single-collection" class="common-anchor-header">단일 컬렉션에 100억 개의 엔티티</h3><p>확장성이 현재 AI 현상에서 주목을 받고 있지는 않지만, 확장성은 단순한 부수적인 요소가 아닌 중추적인 역할을 하는 것은 분명합니다. Milvus 벡터 데이터베이스는 수십억 개의 벡터 데이터를 수용하도록 원활하게 확장할 수 있습니다. 예를 들어, LLM 고객 중 한 곳을 살펴보십시오. Milvus는 이 고객이 100억 개에 달하는 놀라운 데이터 포인트를 손쉽게 저장, 처리 및 검색할 수 있도록 지원했습니다. 하지만 이렇게 방대한 양의 데이터를 처리할 때 비용과 성능의 균형을 어떻게 맞출 수 있을까요? Mivus는 이러한 문제를 해결하고 사용자 경험을 향상시키는 데 도움이 되는 다양한 기능을 갖추고 있으니 안심하세요.</p>
<h2 id="Beyond-the-numbers-the-new-insights-into-vector-databases" class="common-anchor-header">숫자 그 너머: 벡터 데이터베이스에 대한 새로운 인사이트<button data-href="#Beyond-the-numbers-the-new-insights-into-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>2023년은 수치상의 이정표 외에도 가치 있는 인사이트를 풍부하게 제공했습니다. 단순한 통계를 넘어 벡터 검색 기술의 미묘한 뉘앙스와 진화하는 역학 관계를 파악하기 위해 벡터 데이터베이스 환경의 복잡성을 파헤쳤습니다.</p>
<h3 id="LLM-apps-are-still-in-the-early-stages" class="common-anchor-header">LLM 앱은 아직 초기 단계에 머물러 있습니다.</h3><p>모바일 인터넷 붐 초기에 많은 개발자들이 손전등이나 일기 예보와 같은 간단한 앱을 만들었고, 이는 결국 스마트폰 운영체제에 통합되었습니다. 작년에 깃허브에서 빠르게 10만 스타를 달성한 AutoGPT와 같은 대부분의 AI 네이티브 애플리케이션은 실질적인 가치를 제공하지는 못했지만 의미 있는 실험에 불과했습니다. 벡터 데이터베이스 애플리케이션의 경우, 현재의 사용 사례는 AI 네이티브 전환의 첫 번째 물결에 불과할 수 있으며, 앞으로 더 많은 킬러 사용 사례가 등장할 것으로 기대합니다.</p>
<h3 id="Vector-databases-go-toward-diversification" class="common-anchor-header">벡터 데이터베이스는 다양화를 향해 나아갑니다.</h3><p>데이터베이스가 OLTP, OLAP, NoSQL과 같은 카테고리로 진화한 것과 마찬가지로, 벡터 데이터베이스도 다양화 추세를 뚜렷하게 보이고 있습니다. 기존의 온라인 서비스에 집중하던 것에서 벗어나 오프라인 분석이 상당한 주목을 받고 있습니다. 이러한 변화의 또 다른 주목할 만한 사례는 2023년에 출시된 오픈 소스 시맨틱 캐시인 <a href="https://zilliz.com/blog/building-llm-apps-100x-faster-responses-drastic-cost-reduction-using-gptcache">GPTCache의</a> 도입입니다. 이 캐시는 언어 모델에서 생성된 응답을 저장하고 검색하여 GPT 기반 애플리케이션의 효율성과 속도를 향상시킵니다.</p>
<p>내년에는 벡터 데이터베이스에서 더욱 다양한 애플리케이션과 시스템 설계를 목격할 수 있기를 희망하며 기대합니다.</p>
<h3 id="Vector-operations-are-becoming-more-complicated" class="common-anchor-header">벡터 작업은 점점 더 복잡해지고 있습니다.</h3><p><a href="https://zilliz.com/glossary/anns">근사 이웃(ANN)</a> 검색을 지원하는 것은 벡터 데이터베이스의 핵심적인 기능이지만, 그 자체만으로는 충분하지 않습니다. 단순히 근사 이웃 검색을 유지하는 것만으로도 데이터베이스를 벡터 또는 AI 네이티브 데이터베이스로 분류할 수 있다는 일반적인 믿음은 벡터 연산의 복잡성을 지나치게 단순화합니다. 하이브리드 스칼라 필터링과 벡터 검색의 기본 기능 외에도, AI 네이티브 애플리케이션을 위해 맞춤화된 데이터베이스는 NN 필터링, KNN 조인, 클러스터 쿼리와 같은 보다 정교한 시맨틱 기능을 지원해야 합니다.</p>
<h3 id="Elastic-scalability-is-essential-for-AI-native-applications" class="common-anchor-header">탄력적인 확장성은 AI 네이티브 애플리케이션에 필수적입니다.</h3><p>두 달 만에 월간 활성 사용자 1억 명을 돌파한 ChatGPT에서 볼 수 있듯이 AI 애플리케이션의 기하급수적인 성장은 이전의 어떤 비즈니스 궤적을 뛰어넘는 것입니다. 비즈니스가 성장 궤도에 오르면 데이터 포인트를 100만 개에서 10억 개로 빠르게 확장하는 것이 무엇보다 중요해집니다. AI 애플리케이션 개발자는 LLM 제공업체가 설정한 종량제 서비스 모델을 통해 운영 비용을 크게 절감할 수 있습니다. 마찬가지로, 이 가격 모델에 맞는 데이터를 저장하면 개발자에게 유리하여 핵심 비즈니스에 더 많은 관심을 쏟을 수 있습니다.</p>
<p>언어 모델(LLM) 및 기타 다양한 기술 시스템과 달리 벡터 데이터베이스는 상태 저장 방식으로 작동하므로 그 기능을 위해 지속적인 데이터 저장이 필요합니다. 따라서 벡터 데이터베이스를 선택할 때는 탄력성과 확장성을 우선순위에 두는 것이 중요합니다. 이러한 우선순위는 진화하는 AI 애플리케이션의 역동적인 요구에 부응하고, 변화하는 워크로드에 원활하게 적응해야 할 필요성을 강조합니다.</p>
<h3 id="Leveraging-machine-learning-in-vector-databases-can-yield-extraordinary-results" class="common-anchor-header">벡터 데이터베이스에서 머신 러닝을 활용하면 놀라운 결과를 얻을 수 있습니다.</h3><p>2023년에는 AI4DB(데이터베이스용 AI) 프로젝트에 대한 상당한 투자를 통해 괄목할 만한 성과를 거두었습니다. 이러한 노력의 일환으로 완전 관리형 Milvus 솔루션인 <a href="https://zilliz.com/cloud">Zilliz Cloud에</a> 두 가지 중요한 기능을 도입했습니다: 1) 머신 러닝에 기반한 자동 매개변수 조정 인덱스인 AutoIndex와 2) 데이터 클러스터링에 기반한 데이터 파티셔닝 전략이 바로 그것입니다. 이 두 가지 혁신은 질리즈 클라우드의 검색 성능을 크게 향상시키는 데 결정적인 역할을 했습니다.</p>
<h3 id="Open-source-vs-closed-source" class="common-anchor-header">오픈 소스 대 폐쇄 소스</h3><p>현재 OpenAI의 GPT 시리즈나 Claude와 같은 클로즈 소스 LLM이 선두를 달리고 있으며, 오픈 소스 커뮤니티는 비교 가능한 계산 및 데이터 리소스의 부재로 인해 불리한 입장에 처해 있습니다.</p>
<p>그러나 벡터 데이터베이스 내에서는 결국 오픈소스가 사용자가 선호하는 선택이 될 것입니다. 오픈 소스를 선택하면 보다 다양한 사용 사례, 신속한 반복 작업, 보다 강력한 생태계 구축 등 많은 이점을 누릴 수 있습니다. 또한 데이터베이스 시스템은 매우 복잡하기 때문에 LLM과 관련된 불투명성을 감당할 수 없습니다. 사용자는 데이터베이스를 철저히 이해한 후 가장 합리적인 활용 방법을 선택해야 합니다. 또한 오픈소스에 내재된 투명성은 사용자가 필요에 따라 데이터베이스를 커스터마이징할 수 있는 자유와 통제권을 부여합니다.</p>
<h2 id="Epilogue---And-a-new-beginning" class="common-anchor-header">에필로그 - 그리고 새로운 시작!<button data-href="#Epilogue---And-a-new-beginning" class="anchor-icon" translate="no">
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
    </button></h2><p>혁신적인 변화 속에서 2023년이 빠르게 지나가고 있는 지금, 벡터 데이터베이스의 이야기는 이제 막 시작되었습니다. Milvus 벡터 데이터베이스와 함께한 우리의 여정은 AIGC의 과대광고에 휩쓸려 길을 잃는 것이 아닙니다. 그 대신 세심하게 제품을 개발하고, 우리의 강점에 부합하는 애플리케이션 사용 사례를 파악하고 육성하며, 흔들림 없이 사용자에게 서비스를 제공하는 데 집중하고 있습니다. 오픈 소스에 대한 저희의 노력은 저희와 사용자 사이의 간극을 좁혀 멀리서도 저희의 헌신과 장인정신을 느낄 수 있도록 하는 것을 목표로 합니다.</p>
<p>2023년에도 많은 AI 스타트업이 설립되어 첫 번째 펀딩 라운드를 진행했습니다. 이러한 개발자들의 혁신을 보는 것은 흥미진진한 일이며, 제가 처음에 VectorDB 개발에 뛰어든 이유를 떠올리게 합니다. 2024년은 이러한 모든 혁신적인 애플리케이션이 자금뿐만 아니라 실제 유료 고객을 유치하면서 실질적인 주목을 받는 해가 될 것입니다. 다운타임이 거의 또는 전혀 없이 완벽하게 확장 가능한 솔루션을 구축하는 것이 가장 중요하기 때문에 고객 수익은 이러한 개발자들에게 다양한 요구 사항을 가져올 것입니다.</p>
<p>2024년에 놀라운 일을 만들어 봅시다!</p>
