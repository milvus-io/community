---
id: introducing-milvus-lite.md
title: 'Milvus Lite를 소개합니다: 몇 초 만에 GenAI 애플리케이션 구축 시작'
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Python 애플리케이션 내에서 로컬로 실행되는 경량 벡터 데이터베이스인 <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite를</a> 소개하게 되어 기쁘게 생각합니다. 인기 있는 오픈 소스 <a href="https://milvus.io/intro">Milvus</a> 벡터 데이터베이스를 기반으로 하는 Milvus Lite는 분산 시스템에서 높은 확장성을 위해 설계된 요소를 제거하면서 벡터 인덱싱과 쿼리 구문 분석을 위한 핵심 구성 요소를 재사용합니다. 이러한 설계 덕분에 작고 효율적인 솔루션은 노트북, Jupyter 노트북, 모바일 또는 엣지 장치와 같이 컴퓨팅 리소스가 제한된 환경에 이상적입니다.</p>
<p>Milvus Lite는 LangChain, LlamaIndex와 같은 다양한 AI 개발 스택과 통합되어 서버 설정 없이도 검색 증강 생성(RAG) 파이프라인에서 벡터 저장소로 사용할 수 있습니다. <code translate="no">pip install pymilvus</code> (버전 2.4.3 이상)을 실행하기만 하면 AI 애플리케이션에 Python 라이브러리로 통합할 수 있습니다.</p>
<p>Milvus Lite는 Milvus API를 공유하므로 클라이언트 측 코드가 소규모 로컬 배포와 수십억 개의 벡터가 있는 Docker 또는 Kubernetes에 배포된 Milvus 서버 모두에서 작동하도록 보장합니다.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Milvus Lite를 구축한 이유<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>챗봇이나 쇼핑 도우미와 같은 애플리케이션을 위해 텍스트, 이미지, 음성, 동영상 등 비정형 데이터에 대한 벡터 유사성 검색이 필요한 AI 애플리케이션이 많습니다. 벡터 데이터베이스는 벡터 임베딩을 저장하고 검색하기 위해 만들어졌으며, 특히 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성(RAG)</a>과 같은 제너레이티브 AI 사용 사례에서 AI 개발 스택의 중요한 부분입니다.</p>
<p>수많은 벡터 검색 솔루션이 존재하지만, 대규모 프로덕션 배포에도 적합한 시작하기 쉬운 옵션이 없었습니다. Milvus를 개발한 저희는 AI 개발자가 애플리케이션을 더 빠르게 구축하는 동시에 Kubernetes, Docker, 관리형 클라우드 서비스 등 다양한 배포 옵션에서 일관된 경험을 보장할 수 있도록 Milvus Lite를 설계했습니다.</p>
<p>Milvus Lite는 Milvus 에코시스템 내의 제품군에 중요한 추가 기능입니다. 개발자에게 개발 여정의 모든 단계를 지원하는 다목적 도구를 제공합니다. 프로토타이핑에서 프로덕션 환경, 엣지 컴퓨팅에서 대규모 배포에 이르기까지 Milvus는 이제 모든 규모와 모든 개발 단계의 사용 사례를 포괄하는 유일한 벡터 데이터베이스가 되었습니다.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Milvus Lite의 작동 방식<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite는 컬렉션 생성, 벡터 삽입, 검색, 삭제 등 Milvus에서 사용할 수 있는 모든 기본 작업을 지원합니다. 곧 하이브리드 검색과 같은 고급 기능도 지원할 예정입니다. Milvus Lite는 효율적인 검색을 위해 데이터를 메모리에 로드하고 SQLite 파일로 유지합니다.</p>
<p>Milvus Lite는 <a href="https://github.com/milvus-io/pymilvus">Milvus의 Python SDK에</a> 포함되어 있으며 간단한 <code translate="no">pip install pymilvus</code> 을 통해 배포할 수 있습니다. 다음 코드 스니펫은 로컬 파일 이름을 지정한 다음 새 컬렉션을 생성하여 Milvus Lite로 벡터 데이터베이스를 설정하는 방법을 보여줍니다. Milvus API에 익숙한 분들을 위해 유일한 차이점은 <code translate="no">uri</code> 이 네트워크 엔드포인트 대신 로컬 파일 이름(예: Milvus 서버의 경우 <code translate="no">&quot;http://localhost:19530&quot;</code> 대신 <code translate="no">&quot;milvus_demo.db&quot;</code> )을 참조한다는 점입니다. 다른 모든 기능은 동일하게 유지됩니다. Milvus Lite는 아래와 같이 동적 또는 명시적으로 정의된 스키마를 사용하여 원시 텍스트 및 기타 레이블을 메타데이터로 저장하는 기능도 지원합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>확장성을 위해 Milvus Lite로 개발된 AI 애플리케이션은 서버 엔드포인트에 <code translate="no">uri</code> 를 지정하기만 하면 Docker 또는 Kubernetes에 배포된 Milvus를 사용하는 것으로 쉽게 전환할 수 있습니다.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">AI 개발 스택과의 통합<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 벡터 검색을 쉽게 시작할 수 있도록 Milvus Lite를 도입하는 것 외에도 <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> 및 <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT를</a> 포함한 많은 AI 개발 스택의 프레임워크 및 제공업체와 통합할 수 있습니다. 이러한 통합은 광범위한 도구와 서비스 덕분에 벡터 검색 기능을 갖춘 AI 애플리케이션 개발을 간소화합니다.</p>
<p>그리고 이것은 시작에 불과합니다. 더 많은 흥미로운 통합 기능이 곧 추가될 예정입니다! 계속 지켜봐 주세요!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">더 많은 리소스 및 예제<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus <a href="https://milvus.io/docs/quickstart.md">빠른 시작 설명서를</a> 통해 Milvus Lite를 사용해 검색 증강 생성<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG)</a> 및 <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">이미지 검색과</a> 같은 AI 애플리케이션을 구축하는 방법에 대한 자세한 가이드와 코드 예제를 살펴보세요.</p>
<p>Milvus Lite는 오픈 소스 프로젝트이며, 여러분의 기여를 환영합니다. 시작하려면 <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">기여 가이드를</a> 확인하세요. <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite GitHub</a> 리포지토리에 이슈를 제출하여 버그를 보고하거나 기능을 요청할 수도 있습니다.</p>
