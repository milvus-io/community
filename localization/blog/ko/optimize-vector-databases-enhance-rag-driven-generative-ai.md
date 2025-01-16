---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: '벡터 데이터베이스 최적화, RAG 기반 제너레이티브 AI 강화'
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  이 글에서는 벡터 데이터베이스와 벤치마킹 프레임워크, 다양한 측면을 다루는 데이터 세트, 성능 분석에 사용되는 도구 등 벡터 데이터베이스
  최적화를 시작하는 데 필요한 모든 것에 대해 자세히 알아보세요.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>이 게시물은 원래 <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">인텔의 미디엄 채널에</a> 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p><br></p>
<p>RAG를 사용할 때 벡터 데이터베이스를 최적화하는 두 가지 방법</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash의</a> <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> 사진 제공</p>
<p>캐시 장과 말리니 반다루 박사 기여자: 린 양과 창얀 리우</p>
<p>일상 생활에서 기하급수적으로 채택되고 있는 생성 AI(GenAI) 모델은 외부 소스에서 사실을 가져와 응답 정확도와 신뢰성을 높이는 데 사용되는 기술인 <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">검색 증강 생성(RAG)</a>을 통해 개선되고 있습니다. RAG는 데이터 간의 맥락과 관계를 파악하는 데 도움이 되는 수학적 표현인 벡터로 저장된 방대한 비정형 데이터 데이터베이스를 활용하여 일반 <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">대규모 언어 모델(LLM)이</a> 문맥을 이해하고 <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">착각을</a> 줄이도록 도와줍니다.</p>
<p>RAG는 더 많은 문맥 정보를 검색하여 더 나은 응답을 생성하는 데 도움이 되지만, 이들이 사용하는 벡터 데이터베이스는 풍부한 콘텐츠를 제공하기 위해 점점 더 커지고 있습니다. 수조 개의 파라미터를 가진 LLM이 곧 등장하듯이, 수십억 개의 벡터로 구성된 벡터 데이터베이스도 머지않아 등장할 것입니다. 최적화 엔지니어로서 저희는 벡터 데이터베이스의 성능을 높이고, 데이터를 더 빠르게 로드하고, 새로운 데이터가 추가되더라도 검색 속도를 보장하기 위해 인덱스를 더 빠르게 생성할 수 있는지 궁금했습니다. 그렇게 하면 사용자 대기 시간을 줄일 수 있을 뿐만 아니라 RAG 기반 AI 솔루션의 지속 가능성도 조금 더 높일 수 있을 것입니다.</p>
<p>이 글에서는 벡터 데이터베이스와 벤치마킹 프레임워크, 다양한 측면을 다루는 데이터 세트, 성능 분석에 사용되는 도구 등 벡터 데이터베이스 최적화를 시작하는 데 필요한 모든 것에 대해 자세히 알아볼 수 있습니다. 또한 널리 사용되는 두 가지 벡터 데이터베이스 솔루션에 대한 최적화 성과를 공유하여 성능과 지속 가능성에 미치는 영향에 대한 최적화 여정에 영감을 불어넣을 것입니다.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">벡터 데이터베이스 이해하기<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터가 구조화된 방식으로 저장되는 기존의 관계형 또는 비관계형 데이터베이스와 달리, 벡터 데이터베이스는 임베딩 또는 변환 함수를 사용해 구성된 벡터라고 하는 개별 데이터 항목의 수학적 표현을 포함합니다. 벡터는 일반적으로 특징이나 의미적 의미를 나타내며 짧거나 길 수 있습니다. 벡터 데이터베이스는 <a href="https://www.pinecone.io/learn/vector-similarity/">유클리드, 도트 곱 또는 코사인 유사도와</a> 같은 거리 메트릭(가까울수록 결과가 더 유사하다는 의미)을 사용하여 유사도 검색을 통해 벡터를 검색합니다.</p>
<p>검색 프로세스를 가속화하기 위해 벡터 데이터는 인덱싱 메커니즘을 사용해 정리됩니다. 이러한 구성 방법의 예로는 플랫 구조, <a href="https://arxiv.org/abs/2002.09094">반전 파일(IVF),</a> <a href="https://arxiv.org/abs/1603.09320">계층적 탐색 가능한 작은 세계(HNSW)</a>, <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">지역 민감 해싱(LSH)</a> 등이 있습니다. 이러한 각 방법은 필요할 때 유사한 벡터를 검색하는 효율성과 효과에 기여합니다.</p>
<p>GenAI 시스템에서 벡터 데이터베이스를 어떻게 사용하는지 살펴보겠습니다. 그림 1은 벡터 데이터베이스에 데이터를 로드하는 과정과 GenAI 애플리케이션의 맥락에서 데이터를 사용하는 과정을 모두 보여줍니다. 프롬프트를 입력하면 데이터베이스에서 벡터를 생성하는 데 사용되는 것과 동일한 변환 프로세스를 거칩니다. 이렇게 변환된 벡터 프롬프트는 벡터 데이터베이스에서 유사한 벡터를 검색하는 데 사용됩니다. 이렇게 검색된 항목은 기본적으로 대화 메모리 역할을 하며, LLM이 작동하는 방식과 유사하게 프롬프트에 문맥 기록을 제공합니다. 이 기능은 자연어 처리, 컴퓨터 비전, 추천 시스템 및 의미 이해와 데이터 매칭이 필요한 기타 영역에서 특히 유용합니다. 초기 프롬프트는 이후 검색된 요소와 '병합'되어 컨텍스트를 제공하고, LLM이 원래의 학습 데이터에만 의존하지 않고 제공된 컨텍스트를 기반으로 응답을 공식화할 수 있도록 지원합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 1. RAG 애플리케이션 아키텍처.</p>
<p>벡터는 빠른 검색을 위해 저장되고 색인화됩니다. 벡터 데이터베이스는 벡터를 저장하도록 확장된 기존 데이터베이스와 특별히 제작된 벡터 데이터베이스의 두 가지 유형으로 나뉩니다. 벡터를 지원하는 기존 데이터베이스의 몇 가지 예로는 <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a>, <a href="https://opensearch.org/">OpenSearch가</a> 있습니다. 특수 목적으로 구축된 벡터 데이터베이스의 예로는 독점 솔루션인 <a href="https://zilliz.com/">Zilliz와</a> <a href="https://www.pinecone.io/">Pinecone</a>, 오픈 소스 프로젝트인 <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://www.trychroma.com/">Chroma</a> 등이 있습니다. 벡터 데이터베이스에 대한 자세한 내용은 GitHub에서 <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain과 </a> <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI 쿡북을</a> 통해 확인할 수 있습니다.</p>
<p>여기서는 각 카테고리에서 Milvus와 Redis를 하나씩 자세히 살펴보겠습니다.</p>
<h2 id="Improving-Performance" class="common-anchor-header">성능 향상<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>최적화에 대해 자세히 알아보기 전에 벡터 데이터베이스를 평가하는 방법, 몇 가지 평가 프레임워크, 사용 가능한 성능 분석 도구를 검토해 보겠습니다.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">성능 메트릭</h3><p>벡터 데이터베이스 성능을 측정하는 데 도움이 될 수 있는 주요 메트릭을 살펴보겠습니다.</p>
<ul>
<li><strong>로드 지연 시간은</strong> 벡터 데이터베이스의 메모리에 데이터를 로드하고 인덱스를 구축하는 데 필요한 시간을 측정합니다. 인덱스는 유사성 또는 거리에 따라 벡터 데이터를 효율적으로 구성하고 검색하는 데 사용되는 데이터 구조입니다. <a href="https://milvus.io/docs/index.md#In-memory-Index">인메모리 인덱</a> 스의 유형에는 <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">플랫 인덱스</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">확장 가능한 최인접 이웃(ScaNN)</a>, <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> 등이 있습니다.</li>
<li><strong>리콜은</strong> 검색 알고리즘에 의해 검색된 <a href="https://redis.io/docs/data-types/probabilistic/top-k/">상위 K</a> 결과에서 발견된 실제 일치 항목, 즉 관련 항목의 비율을 말합니다. 리콜 값이 높을수록 관련 항목이 더 잘 검색된다는 뜻입니다.</li>
<li><strong>초당 쿼리 수(QPS)</strong> 는 벡터 데이터베이스가 들어오는 쿼리를 처리할 수 있는 속도입니다. QPS 값이 높을수록 쿼리 처리 능력과 시스템 처리량이 더 우수하다는 것을 의미합니다.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">벤치마킹 프레임워크</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 2. 벡터 데이터베이스 벤치마킹 프레임워크.</p>
<p>벡터 데이터베이스를 벤치마킹하려면 벡터 데이터베이스 서버와 클라이언트가 필요합니다. 성능 테스트에서는 널리 사용되는 두 가지 오픈 소스 도구를 사용했습니다.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Zilliz에서 개발하여 오픈 소스로 제공한 VectorDBBench는 다양한 인덱스 유형을 가진 다양한 벡터 데이터베이스를 테스트하는 데 도움이 되며 편리한 웹 인터페이스를 제공합니다.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>벡터-DB-벤치마크</strong></a><strong>:</strong> Qdrant에서 개발 및 오픈 소스한 vector-db-benchmark는 <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a> 인덱스 유형에 대한 몇 가지 일반적인 벡터 데이터베이스를 테스트하는 데 도움이 됩니다. 이 도구는 명령줄을 통해 테스트를 실행하고 서버 구성 요소 시작을 간소화하기 위해 <a href="https://docs.docker.com/compose/">Docker Compose</a> __파일을 제공합니다.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 3. 벤치마크 테스트를 실행하는 데 사용되는 vector-db-benchmark 명령 예제.</p>
<p>하지만 벤치마크 프레임워크는 방정식의 일부일 뿐입니다. 대용량 데이터 처리 능력, 다양한 벡터 크기, 검색 속도 등 벡터 데이터베이스 솔루션 자체의 다양한 측면을 테스트할 수 있는 데이터가 필요하며, 이를 위해 사용 가능한 몇 가지 공개 데이터 세트를 살펴보겠습니다.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">벡터 데이터베이스를 연습하기 위한 오픈 데이터 세트</h3><p>대규모 데이터 세트는 로드 지연 시간 및 리소스 할당을 테스트하기에 좋은 후보입니다. 일부 데이터 세트는 차원이 높은 데이터를 포함하고 있어 컴퓨팅 유사성 속도를 테스트하기에 좋습니다.</p>
<p>데이터 세트는 25차원에서 2048차원까지 다양합니다. 개방형 이미지 컬렉션인 <a href="https://laion.ai/">LAION</a> 데이터 세트는 안정적인 확산 생성 모델과 같은 초대형 시각 및 언어 심층 신경 모델을 훈련하는 데 사용되었습니다. 각 차원이 1536인 5백만 개의 벡터로 구성된 OpenAI의 데이터 세트는 VectorDBBench가 <a href="https://huggingface.co/datasets/allenai/c4">원시 데이터에서</a> OpenAI를 실행하여 생성했습니다. 각 벡터 요소의 유형이 FLOAT라고 가정할 때, 벡터만 저장하려면 약 29GB(5M * 1536 * 4)의 메모리가 필요하며, 인덱스 및 기타 메타데이터를 저장하기 위해 비슷한 양의 추가 메모리를 더해 총 58GB의 테스트용 메모리가 필요합니다. 벡터-db-벤치마크 도구를 사용할 때는 결과를 저장할 수 있는 충분한 디스크 저장 공간을 확보하세요.</p>
<p>로드 지연 시간을 테스트하기 위해서는 대량의 벡터 컬렉션이 필요했는데, <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular가</a> 이를 제공합니다. 인덱스 생성 및 유사도 계산의 성능을 테스트하려면 고차원 벡터가 더 많은 스트레스를 제공합니다. 이를 위해 1536개의 차원 벡터로 구성된 500만 개의 데이터 세트를 선택했습니다.</p>
<h3 id="Performance-Tools" class="common-anchor-header">성능 도구</h3><p>관심 있는 메트릭을 식별하기 위해 시스템에 스트레스를 주는 방법을 살펴보았지만, 컴퓨팅 유닛, 메모리 소비, 잠금 대기 등 더 낮은 수준에서 어떤 일이 일어나고 있는지 살펴봅시다. 이러한 지표는 데이터베이스 동작에 대한 단서를 제공하며, 특히 문제 영역을 식별하는 데 유용합니다.</p>
<p>Linux <a href="https://www.redhat.com/sysadmin/interpret-top-output">최상위</a> 유틸리티는 시스템 성능 정보를 제공합니다. 그러나 Linux의 <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> 도구는 더 심층적인 인사이트를 제공합니다. 자세한 내용은 <a href="https://www.brendangregg.com/perf.html">Linux perf 예제와</a> <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">인텔 하향식 마이크로아키텍처 분석 방법을</a> 읽어보시기 바랍니다. 또 다른 도구로는 <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">인텔® vTune™ 프로파일러가</a> 있는데, 이는 애플리케이션뿐 아니라 HPC, 클라우드, IoT, 미디어, 스토리지 등 다양한 워크로드에 대한 시스템 성능 및 구성을 최적화할 때 유용합니다.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvus 벡터 데이터베이스 최적화<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스의 성능을 개선하기 위해 시도한 몇 가지 사례를 살펴보겠습니다.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">데이터노드 버퍼 쓰기에서 메모리 이동 오버헤드 줄이기</h3><p>Milvus의 쓰기 경로 프록시는 <em>MsgStream을</em> 통해 로그 브로커에 데이터를 씁니다. 그러면 데이터 노드가 데이터를 소비하여 세그먼트로 변환하고 저장합니다. 세그먼트는 새로 삽입된 데이터를 병합합니다. 병합 로직은 이전 데이터와 새로 삽입될 데이터를 모두 보관/이동하기 위해 새 버퍼를 할당하고 다음 데이터 병합을 위해 새 버퍼를 이전 데이터로 반환합니다. 그 결과 이전 데이터의 용량이 계속 커지게 되어 데이터 이동 속도가 느려집니다. 성능 프로필은 이 로직에 대해 높은 오버헤드를 보여주었습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 4. 벡터 데이터베이스에서 데이터를 병합하고 이동하면 고성능 오버헤드가 발생합니다.</p>
<p>병합 <em>버퍼</em> 로직을 변경하여 새 버퍼를 할당하고 대용량 이전 데이터를 이동하지 않고 이전 데이터에 삽입할 새 데이터를 직접 추가하도록 했습니다. 성능 프로필은 이 로직에 오버헤드가 없음을 확인합니다. 마이크로코드 메트릭인 <em>metric_CPU 작동 빈도</em> 및 <em>metric_CPU 사용률은</em> 시스템이 더 이상 긴 메모리 이동을 기다릴 필요가 없는 개선 사항을 나타냅니다. 로드 지연 시간이 60% 이상 개선되었습니다. 이 개선 사항은 <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub에</a> 캡처되어 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림 5. 복사를 줄임으로써 로드 지연 시간이 50% 이상 개선되었습니다.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">메모리 할당 오버헤드를 줄인 역 인덱스 구축</h3><p>Milvus 검색 엔진인 <a href="https://milvus.io/docs/knowhere.md">Knowhere는</a> <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-평균 알고리즘을</a> 사용해 클러스터 데이터를 훈련하여 <a href="https://milvus.io/docs/v1.1.1/index.md">역파일(IVF) 인덱스를</a> 생성합니다. 데이터 훈련의 각 라운드는 반복 횟수를 정의합니다. 횟수가 클수록 더 나은 훈련 결과를 얻을 수 있습니다. 그러나 이는 Elkan 알고리즘이 더 자주 호출된다는 것을 의미하기도 합니다.</p>
<p>Elkan 알고리즘은 실행될 때마다 메모리 할당 및 할당을 처리합니다. 구체적으로, 대각선 요소를 제외한 대칭 행렬 데이터 크기의 절반을 저장하기 위해 메모리를 할당합니다. Knowhere에서 Elkan 알고리즘이 사용하는 대칭 행렬 차원은 1024로 설정되어 있으므로 메모리 크기는 약 2MB입니다. 즉, 각 훈련 라운드마다 Elkan은 2MB 메모리를 반복적으로 할당하고 할당 해제합니다.</p>
<p>성능 프로파일링 데이터에 따르면 대용량 메모리 할당 활동이 빈번하게 발생했습니다. 실제로 <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">가상 메모리 영역(VMA)</a>할당, 물리적 페이지 할당, 페이지 맵 설정, 커널의 메모리 cgroup 통계 업데이트가 트리거되었습니다. 이러한 대규모 메모리 할당/할당 해제 활동 패턴은 경우에 따라 메모리 조각화를 악화시킬 수도 있습니다. 이는 상당한 부담입니다.</p>
<p><em>인덱스플랫엘칸</em> 구조는 엘칸 알고리즘을 지원하도록 특별히 설계 및 구축되었습니다. 각 데이터 훈련 프로세스에는 <em>IndexFlatElkan</em> 인스턴스가 초기화됩니다. Elkan 알고리즘의 빈번한 메모리 할당 및 할당 해제로 인한 성능 영향을 완화하기 위해 코드 로직을 리팩토링하여 Elkan 알고리즘 함수 외부의 메모리 관리를 <em>IndexFlatElkan의</em> 구축 프로세스로 이동시켰습니다. 이렇게 하면 메모리 할당이 초기화 단계에서 한 번만 발생하고 이후의 모든 Elkan 알고리즘 함수 호출은 현재 데이터 학습 프로세스에서 처리할 수 있으며 로드 지연 시간을 약 3% 개선하는 데 도움이 됩니다. <a href="https://github.com/zilliztech/knowhere/pull/280">Knowhere 패치는 여기에서</a> 확인하세요.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">소프트웨어 프리페치를 통한 Redis 벡터 검색 가속화<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>기존의 인기 있는 인메모리 키-값 데이터 저장소인 Redis는 최근 벡터 검색을 지원하기 시작했습니다. 일반적인 키-값 저장소를 뛰어넘기 위해 확장성 모듈을 제공하는데, <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> 모듈은 <a href="https://github.com/RediSearch/RediSearch">Redis</a> 내에서 직접 벡터를 저장하고 검색할 수 있게 해줍니다.</p>
<p>벡터 유사도 검색을 위해 Redis는 무차별 대입과 HNSW라는 두 가지 알고리즘을 지원합니다. HNSW 알고리즘은 고차원 공간에서 대략적인 가장 가까운 이웃을 효율적으로 찾기 위해 특별히 고안된 알고리즘입니다. <em>후보자 집합이라는</em> 우선순위 큐를 사용하여 거리 계산을 위한 모든 벡터 후보를 관리합니다.</p>
<p>각 벡터 후보에는 벡터 데이터 외에도 상당한 양의 메타데이터가 포함됩니다. 따라서 메모리에서 후보를 로드할 때 데이터 캐시 누락이 발생하여 처리 지연이 발생할 수 있습니다. 이번 최적화를 통해 소프트웨어 프리페칭을 도입하여 현재 후보를 처리하는 동안 다음 후보를 미리 로드합니다. 이 개선으로 인해 단일 인스턴스 Redis 설정에서 벡터 유사도 검색의 처리량이 2~3% 향상되었습니다. 패치는 현재 업스트림 중입니다.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">혼합 어셈블리 코드 페널티 방지를 위한 GCC 기본 동작 변경<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>성능을 극대화하기 위해 자주 사용하는 코드 섹션은 어셈블리에서 수기로 작성되는 경우가 많습니다. 그러나 서로 다른 사람이 서로 다른 시점에 서로 다른 코드 세그먼트를 작성하는 경우, 사용되는 명령어는 <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">인텔® AVX-512(Intel® Advanced Vector Extensions 512)</a> 및 <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">스트리밍 SIMD 확장(SSE)</a>과 같은 호환되지 않는 어셈블리 명령어 세트에서 비롯될 수 있습니다. 적절하게 컴파일하지 않으면 혼합 코드로 인해 성능 저하가 발생합니다. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">여기에서 인텔 AVX와 SSE 지침을 혼합하는 방법에 대해 자세히 알아보세요</a>.</p>
<p>혼합 모드 어셈블리 코드를 사용 중이고 <em>VZEROUPPER로</em> 코드를 컴파일하지 않아 성능 페널티가 발생하는지 쉽게 확인할 수 있습니다. <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;와</em> 같은 perf 명령을 통해 확인할 수 있습니다. OS에서 해당 이벤트를 지원하지 않는 경우 <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/를</em> 사용합니다.</p>
<p>Clang 컴파일러는 기본적으로 <em>VZEROUPPER를</em> 삽입하여 혼합 모드 페널티를 피합니다. 그러나 GCC 컴파일러는 -O2 또는 -O3 컴파일러 플래그가 지정된 경우에만 <em>VZEROUPPER를</em> 삽입했습니다. 저희는 GCC 팀에 연락하여 이 문제를 설명했고, 이제 기본적으로 혼합 모드 어셈블리 코드를 올바르게 처리합니다.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">벡터 데이터베이스 최적화 시작하기<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스는 GenAI에서 필수적인 역할을 하고 있으며, 더 높은 품질의 응답을 생성하기 위해 점점 더 커지고 있습니다. 최적화와 관련하여 AI 애플리케이션은 벤치마크 프레임워크 및 스트레스 입력과 함께 표준 성능 분석 도구를 사용할 때 그 비밀이 드러난다는 점에서 다른 소프트웨어 애플리케이션과 다르지 않습니다.</p>
<p>이러한 도구를 사용하여 불필요한 메모리 할당, 명령어 프리페치 실패, 잘못된 컴파일러 옵션 사용과 관련된 성능 함정을 발견했습니다. 그 결과를 바탕으로 Milvus, Knowhere, Redis, GCC 컴파일러를 업스트림하여 AI의 성능과 지속 가능성을 조금 더 향상시킬 수 있도록 개선했습니다. 벡터 데이터베이스는 최적화를 위해 노력할 가치가 있는 중요한 애플리케이션 클래스입니다. 이 글이 시작하시는 데 도움이 되셨기를 바랍니다.</p>
