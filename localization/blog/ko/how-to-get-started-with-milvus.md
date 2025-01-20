---
id: how-to-get-started-with-milvus.md
title: Milvus를 시작하는 방법
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus를 시작하는 방법</span> </span></p>
<p><strong><em>마지막 업데이트 2025년 1월</em></strong></p>
<p>대규모 언어 모델<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a>의 발전과 데이터의 양이 증가함에 따라 데이터베이스와 같이 방대한 양의 정보를 저장할 수 있는 유연하고 확장 가능한 인프라가 필요합니다. 그러나 <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">기존 데이터베이스는</a> 표 형식의 정형 데이터를 저장하도록 설계된 반면, 정교한 LLM과 정보 검색 알고리즘을 활용하는 데 일반적으로 유용한 정보는 텍스트, 이미지, 동영상 또는 오디오와 같은 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형</a> 데이터입니다.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스는</a> 비정형 데이터를 위해 특별히 설계된 데이터베이스 시스템입니다. 벡터 데이터베이스를 사용하면 방대한 양의 비정형 데이터를 저장할 수 있을 뿐만 아니라 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 검색도</a> 수행할 수 있습니다. 벡터 데이터베이스는 빠르고 효율적인 벡터 검색 및 정보 검색 프로세스를 수행하기 위해 IVFFlat(역파일 인덱스) 또는<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW(</a>계층적 탐색 가능한 작은 세계<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">)</a>와 같은 고급 인덱싱 방법을 사용합니다.</p>
<p><strong>Milvus는</strong> 벡터 데이터베이스가 제공할 수 있는 모든 유용한 기능을 활용하는 데 사용할 수 있는 오픈 소스 벡터 데이터베이스입니다. 이 글에서 다룰 내용은 다음과 같습니다:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Milvus 개요</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Milvus 배포 옵션</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Milvus Lite 시작하기</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Milvus 스탠드얼론 시작하기</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">완전 관리형 Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus란 무엇인가요?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus는</strong> </a>방대한 양의 비정형 데이터를 저장하고 빠르고 효율적인 벡터 검색을 수행할 수 있는 오픈 소스 벡터 데이터베이스입니다. Milvus는 추천 시스템, 개인화된 챗봇, 이상 징후 감지, 이미지 검색, 자연어 처리, 검색 증강 생성<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>과 같이 널리 사용되는 많은 GenAI 애플리케이션에 매우 유용합니다.</p>
<p>Milvus를 벡터 데이터베이스로 사용하면 얻을 수 있는 몇 가지 이점이 있습니다:</p>
<ul>
<li><p>Milvus는 사용 사례와 구축하려는 애플리케이션의 규모에 따라 선택할 수 있는 다양한 배포 옵션을 제공합니다.</p></li>
<li><p>Milvus는 다양한 데이터 및 성능 요구 사항을 충족하는 다양한 인덱싱 방법을 지원하며, 여기에는 FLAT, IVFFlat, HNSW, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN과</a> 같은 인메모리 옵션, 메모리 효율성을 위한 양자화된 변형, 대규모 데이터 세트를 위한 온디스크 <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, 가속화된 메모리 효율적인 검색을 위한 GPU_CAGRA, GPU_IVF_FLAT, GPU_IVF_PQ와 같은 GPU 최적화 인덱스가 포함됩니다.</p></li>
<li><p>또한 Milvus는 벡터 검색 작업 중에 밀집 임베딩, 스파스 임베딩, 메타데이터 필터링을 조합하여 사용할 수 있는 하이브리드 검색을 제공하여 보다 정확한 검색 결과를 얻을 수 있습니다. 또한, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5는</a> 이제 하이브리드 <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">전체 텍스트 검색</a> 과 벡터 검색을 지원하여 검색의 정확도를 더욱 높여줍니다.</p></li>
<li><p>밀버스는 <a href="https://zilliz.com/cloud">질리즈 클라우드를</a> 통해 클라우드에서 완벽하게 사용할 수 있으며, 논리적 클러스터, 스트리밍 및 히스토리 데이터 분리, 계층형 스토리지, 자동 확장, 멀티 테넌시 핫-콜드 분리 등 4가지 고급 기능을 통해 운영 비용과 벡터 검색 속도를 최적화할 수 있습니다.</p></li>
</ul>
<p>Milvus를 벡터 데이터베이스로 사용할 때는 각기 다른 강점과 장점을 가진 세 가지 배포 옵션을 선택할 수 있습니다. 다음 섹션에서 각각에 대해 설명하겠습니다.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 배포 옵션<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 사용을 시작할 수 있는 배포 옵션은 Milvus <strong>Lite, Milvus Standalone, Milvus Distributed, Zilliz Cloud(관리형 Milvus</strong> )의 네 가지 옵션 중에서 선택할 수 있습니다 <strong>.</strong> 각 배포 옵션은 데이터의 크기, 애플리케이션의 목적, 애플리케이션의 규모 등 사용 사례의 다양한 시나리오에 적합하도록 설계되었습니다.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p>Milvus<a href="https://milvus.io/docs/quickstart.md"><strong>Lite는</strong></a> Milvus의 경량 버전으로, 가장 쉽게 시작할 수 있는 방법입니다. 다음 섹션에서는 Milvus Lite를 실제로 실행하는 방법을 살펴볼 것이며, 시작하기 위해 필요한 것은 pip로 Pymilvus 라이브러리를 설치하기만 하면 됩니다. 그 후에는 Milvus의 대부분의 핵심 기능을 벡터 데이터베이스로서 수행할 수 있습니다.</p>
<p>Milvus Lite는 빠른 프로토타이핑이나 학습 목적에 적합하며 복잡한 설정 없이 Jupyter 노트북에서 실행할 수 있습니다. 벡터 스토리지 측면에서 Milvus Lite는 대략 최대 백만 개의 벡터 임베딩을 저장하는 데 적합합니다. 가벼운 기능과 저장 용량으로 인해 Milvus Lite는 개인 문서 검색 엔진, 온디바이스 개체 감지 등과 같은 엣지 디바이스 작업에 완벽한 배포 옵션입니다.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus 독립형</h3><p>Milvus Standalone은 Docker 이미지에 포함된 단일 머신 서버 배포입니다. 따라서 시작하려면 Docker에 Milvus를 설치한 다음 Docker 컨테이너를 시작하기만 하면 됩니다. 다음 섹션에서 Milvus Standalone의 자세한 구현 방법도 살펴보겠습니다.</p>
<p>Milvus Standalone은 최대 1,000만 개의 벡터 임베딩을 저장할 수 있으므로 중소규모 애플리케이션을 구축하고 제작하는 데 이상적입니다. 또한 Milvus Standalone은 기본 백업 모드를 통해 고가용성을 제공하므로 프로덕션 지원 애플리케이션에 사용하기에 매우 안정적입니다.</p>
<p>또한 Milvus Standalone과 Milvus Lite는 동일한 클라이언트 측 API를 공유하므로, 예를 들어 빠른 프로토타이핑을 수행하고 Milvus Lite로 Milvus 기능을 학습한 후 Milvus Standalone을 사용할 수 있습니다.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus 배포</h3><p>Milvus Distributed는 클라우드 기반 아키텍처를 활용하는 배포 옵션으로, 데이터 수집과 검색이 개별적으로 처리되어 확장성과 효율성이 뛰어난 애플리케이션을 제공합니다.</p>
<p>Milvus Distributed를 실행하려면 일반적으로 여러 머신과 환경에서 컨테이너를 실행할 수 있도록 Kubernetes 클러스터를 사용해야 합니다. Kubernetes 클러스터를 적용하면 수요와 워크로드에 따라 할당된 리소스를 사용자 정의할 때 Milvus Distributed의 확장성과 유연성을 보장할 수 있습니다. 또한 한 부분에 장애가 발생해도 다른 부분이 이를 대신하여 전체 시스템을 중단 없이 유지할 수 있습니다.</p>
<p>Milvus Distributed는 최대 수백억 개의 벡터 임베딩을 처리할 수 있으며 데이터가 너무 커서 단일 서버 머신에 저장할 수 없는 사용 사례를 위해 특별히 설계되었습니다. 따라서 이 배포 옵션은 대규모 사용자층을 대상으로 서비스를 제공하는 기업 고객에게 적합합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 다양한 Milvus 배포 옵션의 벡터 임베딩 스토리지 기능.</em></p>
<p>이 문서에서는 복잡한 설정 없이도 두 가지 방법 모두 빠르게 시작할 수 있으므로 Milvus Lite와 Milvus Standalone을 모두 시작하는 방법을 보여드리겠습니다. 그러나 Milvus Distributed는 설정이 더 복잡합니다. Milvus Distributed를 설정한 후에는 컬렉션 생성, 데이터 수집, 벡터 검색 등을 수행하는 코드와 논리적 프로세스는 동일한 클라이언트 측 API를 공유하기 때문에 Milvus Lite 및 Milvus Standalone과 유사합니다.</p>
<p>위에서 언급한 세 가지 배포 옵션 외에도 번거로움 없는 경험을 위해 <a href="https://zilliz.com/cloud">Zilliz Cloud에서</a> 관리형 Milvus를 사용해 볼 수도 있습니다. 이 글의 뒷부분에서 Zilliz Cloud에 대해서도 설명하겠습니다.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Milvus Lite 시작하기<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>밀버스 라이트는 파이썬을 사용하여 파이밀버스라는 라이브러리를 가져와서 바로 구현할 수 있습니다. Pymilvus를 설치하기 전에 사용 중인 환경이 다음 요구 사항을 충족하는지 확인하세요:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04(x86_64 및 arm64)</p></li>
<li><p>MacOS &gt;= 11.0(Apple Silicon M1/M2 및 x86_64)</p></li>
<li><p>Python 3.7 이상</p></li>
</ul>
<p>이러한 요구 사항이 충족되면 다음 명령을 사용하여 데모에 필요한 Milvus Lite와 필요한 종속 요소를 설치할 수 있습니다:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: 이 명령은 Milvus의 Python SDK인 <code translate="no">pymilvus</code> 라이브러리를 설치하거나 업그레이드합니다. Milvus Lite는 PyMilvus와 함께 번들로 제공되므로 이 코드 한 줄이면 Milvus Lite를 설치하는 데 필요한 모든 것이 완료됩니다.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: 이 명령은 Hugging Face Transformers와 같은 머신 러닝 모델, Jina AI 임베딩 모델, 리랭킹 모델 등 Milvus에 사전 통합된 고급 기능과 추가 도구를 추가합니다.</p></li>
</ul>
<p>Milvus Lite를 사용하는 단계는 다음과 같습니다:</p>
<ol>
<li><p>임베딩 모델을 사용하여 텍스트 데이터를 임베딩 표현으로 변환합니다.</p></li>
<li><p>Milvus 데이터베이스에 스키마를 생성하여 텍스트 데이터와 그 임베딩 표현을 저장합니다.</p></li>
<li><p>데이터를 스키마에 저장하고 색인합니다.</p></li>
<li><p>저장된 데이터에 대해 간단한 벡터 검색을 수행합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 벡터 검색 작업의 워크플로.</em></p>
<p>텍스트 데이터를 벡터 임베딩으로 변환하기 위해 'all-MiniLM-L6-v2'라는 SentenceTransformers의 임베딩 <a href="https://zilliz.com/ai-models">모델을</a> 사용합니다. 이 임베딩 모델은 텍스트를 384차원 벡터 임베딩으로 변환합니다. 모델을 로드하고 텍스트 데이터를 변환한 다음 모든 것을 함께 묶어 보겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>다음으로, 위의 모든 데이터를 Milvus에 저장하기 위한 스키마를 만들어 보겠습니다. 위에서 볼 수 있듯이 데이터는 세 개의 필드로 구성되어 있습니다: ID, 벡터, 텍스트입니다. 따라서 이 세 가지 필드로 스키마를 만들겠습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, db, connections

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Lite를 사용하면 위에서 정의한 스키마를 기반으로 특정 데이터베이스에 컬렉션을 쉽게 생성할 수 있을 뿐만 아니라 몇 줄의 코드만으로 데이터를 컬렉션에 삽입하고 색인할 수 있습니다.</p>
<pre><code translate="no">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>위의 코드에서는 Milvus 데이터베이스 내에 &quot;demo_collection&quot;이라는 컬렉션을 &quot;milvus_demo&quot;라는 이름으로 생성합니다. 다음으로, 모든 데이터를 방금 생성한 "demo_collection"에 색인합니다.</p>
<p>이제 데이터베이스 내에 데이터가 있으므로 주어진 쿼리에 대해 벡터 검색을 수행할 수 있습니다. &quot;<em>앨런 튜링은 누구인가?</em>&quot;라는 쿼리가 있다고 가정해 보겠습니다. 다음 단계를 구현하면 쿼리에 대한 가장 적절한 답변을 얻을 수 있습니다:</p>
<ol>
<li><p>데이터베이스의 데이터를 임베딩으로 변환하는 데 사용한 것과 동일한 임베딩 모델을 사용하여 쿼리를 벡터 임베딩으로 변환합니다.</p></li>
<li><p>코사인 유사도 또는 유클리드 거리와 같은 메트릭을 사용하여 쿼리 임베딩과 데이터베이스의 각 항목 임베딩 간의 유사도를 계산합니다.</p></li>
<li><p>쿼리에 대한 적절한 답변으로 가장 유사한 항목을 가져옵니다.</p></li>
</ol>
<p>아래는 위의 단계를 Milvus로 구현한 것입니다:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>여기까지입니다! 데이터베이스 관리, 컬렉션 삽입 및 삭제, 올바른 색인 방법 선택, 메타데이터 필터링 및 하이브리드 검색을 통한 고급 벡터 검색 수행 등 Milvus가 제공하는 다른 기능에 대해서도 Milvus <a href="https://milvus.io/docs/">문서에서</a> 자세히 알아볼 수 있습니다.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Milvus Standalone 시작하기<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone은 모든 것이 Docker 컨테이너에 패키징되는 배포 옵션입니다. 따라서 Milvus Standalone을 시작하려면 Docker에 Milvus를 설치한 다음 Docker 컨테이너를 시작해야 합니다.</p>
<p>Milvus Standalone을 설치하기 전에 하드웨어와 소프트웨어가 <a href="https://milvus.io/docs/prerequisite-docker.md">이 페이지에</a> 설명된 요구 사항을 모두 충족하는지 확인하세요. 또한 Docker를 설치했는지 확인하세요. Docker를 설치하려면 <a href="https://docs.docker.com/get-started/get-docker/">이 페이지를</a> 참조하세요.</p>
<p>시스템이 요구 사항을 충족하고 도커를 설치했다면 다음 명령을 사용하여 도커에서 Milvus 설치를 진행할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>위 코드에서는 Docker 컨테이너도 시작하며, 컨테이너가 시작되면 아래와 유사한 출력이 표시됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: Docker 컨테이너가 성공적으로 시작된 후의 메시지.</em></p>
<p>위의 설치 스크립트 "standalone_embed.sh"를 실행하면 포트 19530에서 "milvus"라는 이름의 Docker 컨테이너가 시작됩니다. 따라서 연결을 생성할 때 이 포트를 가리키면 새 데이터베이스를 생성할 수 있을 뿐만 아니라 Milvus 데이터베이스와 관련된 모든 항목에 액세스할 수 있습니다.</p>
<p>위의 Milvus Lite에서 했던 것과 유사하게 "milvus_demo"라는 데이터베이스를 만들고 싶다고 가정해 보겠습니다. 다음과 같이 할 수 있습니다:</p>
<pre><code translate="no">conn = connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19530</span>)
database = db.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;&lt;http://localhost:19530&gt;&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
    db_name=<span class="hljs-string">&quot;milvus_demo&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>다음으로, Milvus <a href="https://milvus.io/docs/milvus-webui.md">웹 UI에</a> 액세스하여 새로 생성된 "milvus_demo"라는 데이터베이스가 Milvus 인스턴스에 실제로 존재하는지 확인할 수 있습니다. 이름에서 알 수 있듯이 Milvus Web UI는 구성 요소의 통계 및 메트릭을 관찰하고 데이터베이스, 컬렉션 및 구성의 목록과 세부 정보를 확인할 수 있도록 Milvus에서 제공하는 그래픽 사용자 인터페이스입니다. 위의 Docker 컨테이너를 시작하면 http://127.0.0.1:9091/webui/ 에서 Milvus 웹 UI에 액세스할 수 있습니다.</p>
<p>위 링크에 접속하면 다음과 같은 랜딩 페이지가 표시됩니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>"Collections" 탭 아래에서 "milvus_demo" 데이터베이스가 성공적으로 생성된 것을 확인할 수 있습니다. 보시다시피 이 웹 UI를 통해 컬렉션 목록, 구성, 수행한 쿼리 등과 같은 다른 사항도 확인할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이제 위의 Milvus Lite 섹션에서 보았던 것처럼 모든 작업을 정확하게 수행할 수 있습니다. "milvus_demo" 데이터베이스 내에 "demo_collection"이라는 컬렉션을 생성해 보겠습니다. 이 컬렉션은 앞서 Milvus Lite 섹션에서와 동일하게 세 개의 필드로 구성되어 있습니다. 그런 다음 데이터를 컬렉션에 삽입합니다.</p>
<pre><code translate="no">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>벡터 검색 작업을 수행하는 코드도 아래 코드에서 볼 수 있듯이 Milvus Lite와 동일합니다:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Docker를 사용하는 것 외에도 <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (Linux용) 및 <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (Windows용)과 함께 Milvus Standalone을 사용할 수도 있습니다.</p>
<p>Milvus 인스턴스를 더 이상 사용하지 않을 때는 다음 명령어로 Milvus Standalone을 중지할 수 있습니다:</p>
<pre><code translate="no">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">완전 관리형 Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 시작하는 또 다른 방법은 번거롭지 않고 10배 빠른 경험을 얻을 수 있는 <a href="https://zilliz.com/cloud">Zilliz Cloud의</a> 기본 클라우드 기반 인프라를 이용하는 것입니다.</p>
<p>질리즈 클라우드는 AI 애플리케이션을 지원하는 전용 환경과 리소스를 갖춘 전용 클러스터를 제공합니다. 밀버스에 구축된 클라우드 기반 데이터베이스이기 때문에 로컬 인프라를 설정하고 관리할 필요가 없습니다. 또한 질리즈 클라우드는 벡터 저장과 연산 간의 분리, S3와 같은 대중적인 오브젝트 스토리지 시스템에 대한 데이터 백업, 벡터 검색 및 검색 작업 속도를 높이기 위한 데이터 캐싱과 같은 고급 기능을 제공합니다.</p>
<p>하지만 클라우드 기반 서비스를 고려할 때 한 가지 고려해야 할 사항은 운영 비용입니다. 대부분의 경우, 클러스터가 데이터 수집이나 벡터 검색 활동이 없는 유휴 상태일 때에도 여전히 비용을 지불해야 합니다. 애플리케이션의 운영 비용과 성능을 더욱 최적화하고 싶다면 Zilliz Cloud 서버리스는 훌륭한 옵션이 될 것입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 질리즈 클라우드 서버리스 사용의 주요 이점.</em></p>
<p>질리즈 클라우드 서버리스는 AWS, Azure, GCP 등 주요 클라우드 서비스에서 이용할 수 있습니다. 종량제 요금제와 같은 기능을 제공하므로 클러스터를 사용할 때만 비용을 지불하면 됩니다.</p>
<p>또한 논리적 클러스터, 자동 확장, 계층형 스토리지, 스트리밍 및 기록 데이터 분리, 핫-콜드 데이터 분리와 같은 고급 기술을 구현합니다. 이러한 기능을 통해 질리즈 클라우드 서버리스는 인메모리 밀버스 대비 최대 50배의 비용 절감과 약 10배 빠른 벡터 검색 작업을 달성할 수 있습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림: 계층형 스토리지와 핫-콜드 데이터 분리 그림.</em></p>
<p>질리즈 클라우드 서버리스를 시작하고 싶으시다면 <a href="https://zilliz.com/serverless">이 페이지에서</a> 자세한 내용을 확인해보세요.</p>
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
    </button></h2><p>Milvus는 최신 AI 애플리케이션에서 비정형 데이터를 관리하고 빠르고 효율적인 벡터 검색 작업을 수행해야 하는 과제를 해결하도록 설계된 다재다능하고 강력한 벡터 데이터베이스로서 두각을 나타내고 있습니다. 빠른 프로토타이핑을 위한 Milvus Lite, 중소규모 애플리케이션을 위한 Milvus Standalone, 엔터프라이즈급 확장성을 위한 Milvus Distributed와 같은 배포 옵션을 통해 프로젝트의 규모와 복잡성에 맞는 유연성을 제공합니다.</p>
<p>또한 질리즈 클라우드 서버리스는 Milvus의 기능을 클라우드로 확장하고 로컬 인프라가 필요 없는 비용 효율적인 종량제 모델을 제공합니다. 계층형 스토리지 및 자동 확장과 같은 고급 기능을 갖춘 Zilliz Cloud Serverless는 비용을 최적화하면서 벡터 검색 작업을 더 빠르게 처리할 수 있도록 지원합니다.</p>
