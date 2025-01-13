---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: 키워드 기반 검색
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: 토코피디아는 Milvus를 사용하여 10배 더 스마트한 검색 시스템을 구축하여 사용자 경험을 획기적으로 개선했습니다.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>시맨틱 검색을 사용해 검색을 10배 더 스마트하게 만든 방법</custom-h1><p>Tokopedia는 구매자가 자신과 관련된 제품을 찾을 수 있을 때에만 제품 말뭉치의 가치가 발휘된다는 사실을 잘 알고 있기 때문에 검색 결과의 연관성을 개선하기 위해 노력하고 있습니다.</p>
<p>이러한 노력을 더욱 강화하기 위해 토코피디아에 <strong>유사도 검색을</strong> 도입합니다. 모바일 디바이스에서 검색 결과 페이지로 이동하면 '...' 버튼을 클릭하면 해당 상품과 유사한 상품을 검색할 수 있는 메뉴가 표시됩니다.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">키워드 기반 검색<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia 검색은 제품 검색 및 순위를 매기는 데 <strong>Elasticsearch를</strong> 사용합니다. 각 검색 요청에 대해 먼저 검색 쿼리에 따라 제품의 순위를 매기는 Elasticsearch를 쿼리합니다. ElasticSearch는 각 단어를 각 문자에 대해 <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (또는 UTF) 코드를 나타내는 숫자 시퀀스로 저장합니다. 사용자 쿼리의 단어가 포함된 문서를 빠르게 찾기 위해 <a href="https://en.wikipedia.org/wiki/Inverted_index">역 인덱스를</a> 구축한 다음 다양한 채점 알고리즘을 사용해 그 중에서 가장 잘 일치하는 문서를 찾습니다. 이러한 채점 알고리즘은 단어의 의미보다는 문서에서 단어가 얼마나 자주 나타나는지, 서로 얼마나 가까운지 등에 더 많은 관심을 기울입니다. ASCII 표현에는 분명히 의미를 전달하기에 충분한 정보가 포함되어 있습니다(결국 인간은 이해할 수 있습니다). 안타깝게도 컴퓨터가 ASCII로 인코딩된 단어를 그 의미에 따라 비교할 수 있는 좋은 알고리즘은 없습니다.</p>
<h2 id="Vector-representation" class="common-anchor-header">벡터 표현<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>이에 대한 한 가지 해결책은 단어에 포함된 문자뿐만 아니라 그 의미에 대해서도 알려주는 대체 표현을 생각해내는 것입니다. 예를 들어, 해당 <em>단어가 어떤 다른 단어와 함께 자주 사용되는지</em> 인코딩할 수 있습니다(가능한 문맥으로 표현). 그런 다음 비슷한 문맥은 비슷한 것을 나타낸다고 가정하고 수학적 방법을 사용하여 비교를 시도할 수 있습니다. 심지어 문장 전체를 의미로 인코딩하는 방법도 찾을 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>블로그_시맨틱 검색을 사용해 검색을 10배 더 스마트하게 만든 방법_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">임베딩 유사도 검색 엔진 선택<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 특징 벡터가 생겼으니 남은 문제는 대량의 벡터 중에서 대상 벡터와 유사한 벡터를 검색하는 방법입니다. 임베딩 검색 엔진의 경우, 깃허브에서 제공되는 여러 엔진 중 FAISS, Vearch, Milvus 등 몇 가지 엔진에 대해 POC를 시도했습니다.</p>
<p>부하 테스트 결과를 바탕으로 다른 엔진보다 Milvus를 선호했습니다. 한편으로는 다른 팀에서 FAISS를 사용해 본 적이 있기 때문에 새로운 것을 시도해보고 싶었습니다. Milvus에 비해 FAISS는 기본 라이브러리에 가깝기 때문에 사용하기 편리하지 않습니다. Milvus에 대해 자세히 알아본 결과, 두 가지 주요 기능 때문에 결국 Milvus를 채택하기로 결정했습니다:</p>
<ul>
<li><p>Milvus는 사용하기 매우 쉽습니다. Docker 이미지를 가져와서 자체 시나리오에 따라 파라미터를 업데이트하기만 하면 됩니다.</p></li>
<li><p>더 많은 인덱스를 지원하며 자세한 지원 문서가 있습니다.</p></li>
</ul>
<p>간단히 말해, Milvus는 사용자에게 매우 친숙하며 문서도 매우 상세합니다. 문제가 발생하면 대개 문서에서 해결책을 찾을 수 있으며, 그렇지 않은 경우 언제든지 Milvus 커뮤니티에서 지원을 받을 수 있습니다.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvus 클러스터 서비스<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>피처 벡터 검색 엔진으로 Milvus를 사용하기로 결정한 후, <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">낮은 게재율</a> 키워드와 높은 게재율 키워드를 일치시키고자 하는 광고 서비스 사용 사례 중 하나에 Milvus를 사용하기로 결정했습니다. 개발(DEV) 환경에서 독립형 노드를 구성하고 서비스를 시작했는데, 며칠 동안 잘 실행되어 CTR/CVR 지표가 개선되었습니다. 프로덕션 환경에서 독립형 노드가 다운되면 전체 서비스를 사용할 수 없게 됩니다. 따라서 고가용성 검색 서비스를 배포해야 했습니다.</p>
<p>Milvus는 클러스터 샤딩 미들웨어인 Mishards와 구성을 위한 Milvus-Helm을 모두 제공합니다. 토코피디아에서는 인프라 설정에 Ansible 플레이북을 사용하므로 인프라 오케스트레이션을 위한 플레이북을 만들었습니다. Milvus의 문서에 있는 아래 다이어그램은 Mishards의 작동 방식을 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>블로그_시맨틱 검색을 사용하여 검색을 10배 더 스마트하게 만든 방법_3.png</span> </span></p>
<p>Mishards는 업스트림에서 하위 모듈로 요청을 캐스케이드하여 업스트림 요청을 분할한 다음, 하위 서비스의 결과를 수집하여 업스트림으로 반환합니다. Mishards 기반 클러스터 솔루션의 전체 아키텍처는 다음과 같습니다: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>블로그_검색을 10배 더 스마트하게 만드는 시맨틱 검색의 활용_4.jpeg</span> </span></p>
<p>공식 문서에서 Mishards에 대한 명확한 소개를 제공합니다. 관심이 있으시다면 <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards를</a> 참조하세요.</p>
<p>저희는 키워드 대 키워드 서비스에서 Milvus ansible을 사용하여 쓰기 가능한 노드 1개, 읽기 전용 노드 2개, Mishards 미들웨어 인스턴스 1개를 GCP에 배포했습니다. 지금까지는 안정적으로 작동하고 있습니다. 유사도 검색 엔진이 의존하는 백만, 억, 조 단위의 벡터 데이터 세트를 효율적으로 쿼리할 수 있게 해주는 가장 큰 요소는 빅데이터 검색을 획기적으로 가속화하는 데이터 정리 프로세스인 <a href="https://milvus.io/docs/v0.10.5/index.md">인덱싱입니다</a>.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">벡터 인덱싱은 어떻게 유사도 검색을 가속화하나요?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>유사도 검색 엔진은 입력을 데이터베이스와 비교하여 입력과 가장 유사한 객체를 찾는 방식으로 작동합니다. 인덱싱은 데이터를 효율적으로 정리하는 과정으로, 대규모 데이터 세트에서 시간이 오래 걸리는 쿼리를 획기적으로 가속화하여 유사도 검색을 유용하게 만드는 데 중요한 역할을 합니다. 대규모 벡터 데이터 세트가 색인된 후에는 쿼리가 입력 쿼리와 유사한 벡터를 포함할 가능성이 가장 높은 클러스터 또는 데이터의 하위 집합으로 라우팅될 수 있습니다. 실제로 이것은 매우 큰 벡터 데이터에 대한 쿼리 속도를 높이기 위해 어느 정도의 정확도를 희생해야 한다는 것을 의미합니다.</p>
<p>단어가 알파벳순으로 정렬되어 있는 사전을 비유할 수 있습니다. 단어를 검색할 때 이니셜이 같은 단어만 포함된 섹션으로 빠르게 이동할 수 있으므로 입력 단어의 정의를 찾는 속도가 크게 빨라집니다.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">다음은 무엇일까요?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>블로그_시맨틱 검색을 사용해 검색을 10배 더 스마트하게 만든 방법_5.jpeg</span> </span></p>
<p>위와 같이 모든 것을 만족시키는 솔루션은 없으며, 항상 임베딩에 사용되는 모델의 성능을 개선하고자 합니다.</p>
<p>또한 기술적인 관점에서 여러 학습 모델을 동시에 실행하고 다양한 실험의 결과를 비교하고자 합니다. 이미지 검색, 동영상 검색과 같은 실험에 대한 자세한 내용은 이 공간을 참조하세요.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">참고자료:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>미샤즈 문서: https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>미샤즈: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>밀버스-헬름: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>이 블로그 글은 다음에서 다시 게시되었습니다: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>다른 <a href="https://zilliz.com/user-stories">사용자 사례를</a> 읽고 Milvus로 무언가를 만드는 방법에 대해 자세히 알아보세요.</p>
