---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Reddit에서 ANN 검색을 위한 벡터 데이터베이스 선택하기
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: 이 게시물에서는 Reddit 팀이 가장 적합한 벡터 데이터베이스를 선택하기 위해 사용한 과정과 Milvus를 선택한 이유를 설명합니다.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>이 게시물은 Reddit의 스태프 소프트웨어 엔지니어인 크리스 푸니가 작성한 것으로, 원래</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit에</a><em>게시되었으며</em> 허가를 받아 여기에 다시 게시되었습니다.</p>
<p>2024년에 Reddit 팀은 다양한 솔루션을 사용하여 근사 이웃(ANN) 벡터 검색을 수행했습니다. Google의 <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI 벡터 검색과</a> 일부 대규모 데이터 세트에 <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">Apache Solr의 ANN 벡터 검색을</a> 사용하는 실험부터 소규모 데이터 세트(수직으로 확장된 사이드카에서 호스팅)를 위한 Facebook의 <a href="https://github.com/facebookresearch/faiss">FAISS 라이브러리까지</a>. 점점 더 많은 Reddit 팀이 비용 효율적이고, 원하는 검색 기능을 갖추고 있으며, Reddit 크기의 데이터로 확장할 수 있는 광범위하게 지원되는 ANN 벡터 검색 솔루션을 원했습니다. 이러한 요구를 해결하기 위해, 2025년에 저희는 Reddit 팀에 가장 이상적인 벡터 데이터베이스를 찾았습니다.</p>
<p>이 포스팅에서는 현재 Reddit의 필요에 가장 적합한 벡터 데이터베이스를 선정하기 위해 사용한 프로세스에 대해 설명합니다. 모든 상황에 가장 적합한 벡터 데이터베이스나 가장 필수적인 기능적, 비기능적 요구사항에 대해 설명하지는 않습니다. 이 글은 Reddit과 엔지니어링 문화가 벡터 데이터베이스를 선택할 때 중요하게 여기고 우선순위를 두었던 사항을 설명합니다. 이 게시물은 자체 요구 사항 수집 및 평가에 영감을 줄 수 있지만 각 조직마다 고유한 문화, 가치 및 요구 사항이 있습니다.</p>
<h2 id="Evaluation-process" class="common-anchor-header">평가 프로세스<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>전반적인 선정 단계는 다음과 같습니다:</p>
<p>1. 팀으로부터 컨텍스트 수집</p>
<p>2. 솔루션의 정성적 평가</p>
<p>3. 상위 경쟁자를 정량적으로 평가</p>
<p>4. 최종 선정</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. 팀으로부터 컨텍스트 수집</h3><p>ANN 벡터 검색을 수행하는 데 관심이 있는 팀으로부터 세 가지 컨텍스트를 수집했습니다:</p>
<ul>
<li><p>기능적 요구 사항(예: 하이브리드 벡터 및 어휘 검색? 범위 검색 쿼리? 비벡터 속성으로 필터링?)</p></li>
<li><p>비기능적 요구 사항(예: 1B 벡터를 지원할 수 있는가? 100ms 미만의 P99 레이턴시에 도달할 수 있는가?)</p></li>
<li><p>벡터 데이터베이스 팀이 이미 관심을 갖고 있는 분야</p></li>
</ul>
<p>팀과 요구 사항을 인터뷰하는 일은 결코 간단하지 않습니다. 많은 팀이 현재 문제를 해결하고 있는 방식으로 요구 사항을 설명할 것이므로, 이러한 편견을 이해하고 제거하는 것이 과제입니다.</p>
<p>예를 들어, 한 팀은 이미 ANN 벡터 검색에 FAISS를 사용하고 있었고, 새로운 솔루션은 검색 호출당 10,000개의 결과를 효율적으로 반환해야 한다고 말했습니다. 추가 논의 결과, 10K 개의 결과가 나오는 이유는 사후 필터링을 수행해야 하는데, FAISS는 쿼리 시점에 필터링 ANN 결과를 제공하지 않기 때문이었습니다. 실제 문제는 필터링이 필요했기 때문에 효율적인 필터링을 제공하는 솔루션이면 충분했고, 10K 결과를 반환하는 것은 리콜을 개선하는 데 필요한 임시방편에 불과했습니다. 그들은 가장 가까운 이웃을 찾기 전에 전체 컬렉션을 사전 필터링하는 것이 이상적이었습니다.</p>
<p>팀이 이미 사용 중이거나 관심이 있는 벡터 데이터베이스를 요청하는 것도 유용했습니다. 적어도 한 팀 이상이 현재 솔루션에 대해 긍정적인 견해를 가지고 있다면, 벡터 데이터베이스가 회사 전체에서 공유할 수 있는 유용한 솔루션이 될 수 있다는 신호입니다. 솔루션에 대해 부정적인 견해만 가진 팀이 있다면 해당 솔루션을 옵션에 포함시키지 않아야 합니다. 또한 팀이 관심을 보이는 솔루션을 수락하는 것은 팀이 프로세스에 포함되었다고 느끼게 하고 평가할 주요 경쟁자 목록을 작성하는 데 도움이 되는 방법이었습니다. 신규 및 기존 데이터베이스에는 너무 많은 ANN 벡터 검색 솔루션이 있어 모든 솔루션을 철저하게 테스트하기에는 한계가 있습니다.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. 솔루션의 정성적 평가</h3><p>팀이 관심을 갖고 있는 솔루션 목록부터 시작하여, 어떤 ANN 벡터 검색 솔루션이 우리의 요구에 가장 적합한지 정성적으로 평가했습니다:</p>
<ul>
<li><p>각 솔루션을 조사하고 각 요구 사항을 얼마나 잘 충족하는지, 그리고 해당 요구 사항의 중요도에 따라 가중치를 부여하여 점수를 매겼습니다.</p></li>
<li><p>정성적 기준과 토론을 바탕으로 솔루션을 제거했습니다.</p></li>
<li><p>정량적으로 테스트할 상위 N개의 솔루션 선정</p></li>
</ul>
<p>ANN 벡터 검색 솔루션의 시작 목록은 다음과 같습니다:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>오픈 검색</p></li>
<li><p>Pgvector(이미 RDBMS로 Postgres 사용)</p></li>
<li><p>Redis(이미 KV 저장소 및 캐시로 사용 중)</p></li>
<li><p>Cassandra(이미 비 ANN 검색에 사용 중)</p></li>
<li><p>Solr(이미 어휘 검색에 사용 중이며 벡터 검색에 실험적으로 사용됨)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI(이미 ANN 벡터 검색에 사용됨)</p></li>
</ul>
<p>그런 다음 팀에서 언급한 모든 기능적 및 비기능적 요구사항과 엔지니어링 가치와 목표를 나타내는 몇 가지 제약 조건을 추가하여 스프레드시트에 행을 만들고 그 중요도를 1에서 3까지 평가했습니다(아래 요약 표에 표시됨).</p>
<p>비교 대상인 각 솔루션에 대해 각 시스템이 해당 요구 사항을 얼마나 잘 충족하는지 평가(0~3점 척도)했습니다(아래 표 참조). 이러한 방식으로 점수를 매기는 것은 다소 주관적일 수 있으므로 한 시스템을 선택하여 서면 근거와 함께 점수 예시를 제시하고 검토자가 해당 예시를 다시 참조하도록 했습니다. 또한 각 점수 값을 할당할 때 다음과 같은 지침을 제공했습니다. 다음과 같은 경우 이 값을 할당합니다:</p>
<ul>
<li><p>0: 요구 사항 지원/증거 없음</p></li>
<li><p>1: 기본적이거나 부적절한 요구 사항 지원</p></li>
<li><p>2: 요구 사항이 합리적으로 지원됨</p></li>
<li><p>3: 비교 가능한 솔루션을 뛰어넘는 강력한 요구 사항 지원</p></li>
</ul>
<p>그런 다음 솔루션의 요구 사항 점수와 해당 요구 사항의 중요도의 곱을 합산하여 각 솔루션에 대한 전체 점수를 만들었습니다(예: Qdrant는 재순위/점수 결합에서 3점을 받았고 중요도가 2이므로 3 x 2 = 6, 모든 행에 대해 이를 반복하여 합산). 마지막에는 솔루션의 순위를 매기고 논의할 때 가장 중요한 요구 사항의 기준으로 사용할 수 있는 전체 점수를 얻게 됩니다(이 점수는 최종 결정을 내리는 데 사용되는 것이 아니라 논의 도구로 사용됨을 유의하세요).</p>
<p><strong><em>편집자 주:</em></strong> <em>이 리뷰는 Milvus 2.4를 기반으로 작성되었습니다. 이후 Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6이</em></a> <em>출시되었고</em><em> Milvus 3.0이 곧 출시될 예정이므로 일부 수치는 최신 버전이 아닐 수 있습니다. 그럼에도 불구하고 이 비교는 여전히 강력한 인사이트를 제공하며 여전히 매우 유용합니다.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>카테고리</strong></td><td><strong>중요도</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>카산드라</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>검색 유형</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">하이브리드 검색</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>키워드 검색</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>대략적인 NN 검색</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>범위 검색</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>재순위/점수 합산</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>인덱싱 방법</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>여러 인덱싱 방법 지원</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>정량화</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>지역 민감 해싱(LSH)</td><td>1</td><td>0</td><td>0주: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6에서 지원합니다. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>데이터</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>플로트 이외의 벡터 유형</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>벡터의 메타데이터 속성(여러 속성, 큰 레코드 크기 등 지원)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>메타데이터 필터링 옵션(메타데이터에 대한 필터링 가능, 사전/사후 필터링 가능)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>메타데이터 속성 데이터 유형(강력한 스키마, 예: 부울, int, 문자열, json, 배열)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>메타데이터 속성 제한(범위 쿼리, 예: 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>속성별 결과의 다양성(예: 응답의 각 하위 레딧에서 N 개 이하의 결과만 가져옴)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>스케일</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>수억 개의 벡터 인덱스</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>10억 벡터 인덱스</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>2k 이상의 지원 벡터</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>2k보다 큰 벡터 지원</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 지연 시간 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 지연 시간 &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99.9% 가용성 검색</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99.99% 가용성 인덱싱/저장</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>스토리지 운영</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>AWS에서 호스팅 가능</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>다중 지역</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>다운타임 없는 업그레이드</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>멀티 클라우드</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>API/라이브러리</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>라이브러리 이동</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>자바 라이브러리</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>기타 언어(C++, 루비 등)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>런타임 운영</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>프로메테우스 메트릭</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>기본 DB 작업</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>업서트</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>쿠버네티스 오퍼레이터</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>결과 페이지 매김</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>ID로 조회 임베딩하기</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>후보자 ID 및 후보자 점수가 포함된 임베딩 반환</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>사용자 제공 ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>대규모 배치 컨텍스트에서 검색 가능</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>백업/스냅샷: 전체 데이터베이스의 백업을 생성하는 기능을 지원합니다.</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>효율적인 대용량 인덱스 지원(콜드 스토리지와 핫 스토리지 구분)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>지원/커뮤니티</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>공급업체 중립성</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>강력한 API 지원</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>공급업체 지원</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>커뮤니티 속도</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>프로덕션 사용자 기반</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>커뮤니티 느낌</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>깃허브 스타</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>구성</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>비밀 처리</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Source</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>오픈 소스</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>언어</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>릴리스</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>업스트림 테스트</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>문서 가용성</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>비용</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>비용 효율적</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>성능</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>CPU, 메모리 및 디스크의 리소스 사용률 조정 지원</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>멀티노드(포드) 샤딩</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>지연 시간과 처리량 간의 균형을 맞추기 위해 시스템을 조정할 수 있는 능력 보유</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>사용자 정의 파티셔닝(쓰기)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>멀티 테넌트</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>파티셔닝</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>복제</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>중복성</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>자동 페일오버</td><td>3</td><td>2</td><td>0 참고: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6에서 지원합니다. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>로드 밸런싱</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>GPU 지원</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>카산드라</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>전체 솔루션 점수</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>다양한 시스템의 전체 및 요구사항 점수를 논의하고 요구사항의 중요도에 적절한 가중치를 부여했는지, 일부 요구사항이 핵심 제약 조건으로 간주되어야 할 정도로 중요한지 여부를 파악하고자 했습니다. 우리가 파악한 요구 사항 중 하나는 솔루션이 오픈 소스인지 여부였는데, 우리 규모에서 작은 문제가 발생할 경우 우리가 참여하고 기여할 수 있으며 신속하게 해결할 수 있는 솔루션을 원했기 때문입니다. 오픈소스 소프트웨어에 기여하고 사용하는 것은 Reddit의 엔지니어링 문화에서 중요한 부분입니다. 따라서 호스팅 전용 솔루션(Vertex AI, Pinecone)은 고려 대상에서 제외되었습니다.</p>
<p>논의하는 과정에서 몇 가지 다른 주요 요구 사항이 매우 중요하다는 것을 알게 되었습니다:</p>
<ul>
<li><p>규모와 안정성: 1억 개 이상의 벡터 또는 10억 개 이상의 벡터로 솔루션을 실행하는 다른 회사의 사례를 보고 싶었습니다.</p></li>
<li><p>커뮤니티: 빠르게 성숙해가는 이 분야에서 많은 추진력을 가진 건강한 커뮤니티가 있는 솔루션을 원했습니다.</p></li>
<li><p>표현형 메타데이터 유형과 필터링을 통해 더 많은 사용 사례(날짜, 부울 등으로 필터링 등)를 지원합니다.</p></li>
<li><p>다양한 고유 사용 사례의 성능에 더 잘 맞도록 여러 인덱스 유형(HNSW 또는 DiskANN뿐만 아니라)을 지원합니다.</p></li>
</ul>
<p>주요 요구사항에 대한 논의와 연마 결과, 정량적 테스트를 (순서대로) 선택하게 되었습니다:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, 그리고</p></li>
<li><p>Weviate</p></li>
</ol>
<p>안타깝게도 이와 같은 결정에는 시간과 리소스가 필요하며, 어느 조직도 이 두 가지를 무제한으로 확보할 수는 없습니다. 저희는 예산을 고려하여 Qdrant와 Milvus를 테스트하기로 결정하고 Vespa와 Weviate 테스트는 확장 목표로 남겨두기로 했습니다.</p>
<p>Qdrant와 Milvus는 서로 다른 두 아키텍처에 대한 흥미로운 테스트이기도 했습니다:</p>
<ul>
<li><p><strong>Qdrant:</strong> 모든 ANN 벡터 데이터베이스 연산을 수행하는 동종 노드 유형</p></li>
<li><p>밀버스<strong>:</strong> <a href="https://milvus.io/docs/architecture_overview.md">이기종 노드 유형</a> (밀버스; 쿼리용, 인덱싱용, 데이터 수집용, 프록시 등)</p></li>
</ul>
<p>어떤 것이 설정하기 쉬웠나요(문서 테스트)? 어느 것이 실행하기 쉬웠나요(복원력 기능 및 광택 테스트)? 그리고 어떤 것이 우리가 중요하게 생각하는 사용 사례와 규모에 가장 적합한가? 솔루션을 정량적으로 비교하면서 이러한 질문에 대한 답을 찾고자 했습니다.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. 상위 경쟁 솔루션의 정량적 평가</h3><p>각 솔루션의 확장성을 더 잘 이해하고, 그 과정에서 각 솔루션을 대규모로 설정, 구성, 유지 관리 및 실행하는 것이 어떤 것인지 경험하고 싶었습니다. 이를 위해 세 가지 사용 사례에 대한 세 가지 문서 및 쿼리 벡터 데이터 세트를 수집하고, Kubernetes 내에서 유사한 리소스로 각 솔루션을 설정하고, 각 솔루션에 문서를 로드한 다음, 램핑 도착 속도 실행기와 함께 <a href="https://k6.io/">Grafana의 K6를</a> 사용하여 동일한 쿼리 부하를 전송하여 시스템을 워밍업한 다음 목표 처리량(예: 100 QPS)에 도달했습니다.</p>
<p>처리량, 각 솔루션의 한계점, 처리량과 지연 시간 간의 관계, 부하가 걸린 노드 손실에 대한 반응(오류율, 지연 시간 영향 등)을 테스트했습니다. 주요 관심사는 <strong>필터링이 지연 시간에 미치는 영향이었습니다</strong>. 또한 문서에 설명된 기능(예: 업서트, 삭제, ID로 조회, 사용자 관리 등)이 설명대로 작동하는지 확인하고 해당 API의 인체공학적 특성을 체험하기 위해 간단한 예/아니오 테스트를 진행했습니다.</p>
<p><strong>테스트는 Milvus v2.4 및 Qdrant v1.12에서 수행되었습니다.</strong> 시간 제약으로 인해 모든 유형의 인덱스 설정을 철저하게 조정하거나 테스트하지는 않았으며, 각 솔루션에서 유사한 설정이 사용되었고, 높은 ANN 리콜에 편향되어 HNSW 인덱스의 성능에 중점을 두고 테스트가 진행되었습니다. 또한 각 솔루션에 비슷한 CPU 및 메모리 리소스를 할당했습니다.</p>
<p>실험을 통해 두 솔루션 간에 몇 가지 흥미로운 차이점을 발견했습니다. 다음 실험에서 각 솔루션에는 각각 384개의 차원을 가진 약 3억 4천만 개의 Reddit 포스트 벡터가 있었고, HNSW, M=16, efConstruction=100의 경우였습니다.</p>
<p>한 실험에서 동일한 쿼리 처리량(동시에 수집이 없는 100 QPS)의 경우 필터링을 추가하는 것이 Qdrant보다 Milvus의 지연 시간에 더 많은 영향을 미치는 것으로 나타났습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>필터링을 사용한 포스트 쿼리 지연 시간</p>
<p>또 다른 테스트에서는 수집과 쿼리 부하 간에 상호 작용이 Milvus보다 Qdrant에서 훨씬 더 많이 발생하는 것으로 나타났습니다(아래는 일정한 처리량에서 표시). 이는 아키텍처 때문인 것으로 보입니다. Milvus는 수집의 대부분을 쿼리 트래픽을 처리하는 노드와 별도의 노드 유형으로 분리하는 반면, Qdrant는 동일한 노드에서 수집과 쿼리 트래픽을 모두 처리합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>수집 중 100 QPS의 쿼리 지연 시간 게시</p>
<p>속성별 결과의 다양성(예: 응답의 각 하위 레딧에서 N개 이하의 결과 가져오기)을 테스트했을 때, 동일한 처리량에서 Milvus의 지연 시간이 Qdrant보다 더 나쁜 것으로 나타났습니다(100 QPS 기준).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>결과 다양성을 통한 쿼리 후 지연 시간</p>
<p>또한 데이터 복제본이 더 많이 추가될 때(즉, 복제 계수인 RF를 1에서 2로 늘렸을 때) 각 솔루션이 얼마나 효과적으로 확장되는지도 살펴보고 싶었습니다. 처음에 RF=1로 설정했을 때, Qdrant는 Milvus보다 더 많은 처리량에 대해 만족스러운 지연 시간을 제공할 수 있었습니다(테스트가 오류 없이 완료되지 않았기 때문에 더 높은 QPS는 표시되지 않음).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다양한 처리량에 대해 RF=1 지연 시간을 게시하는 Qdrant</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 다양한 처리량에 대해 RF=1 지연 시간을 게시합니다.</p>
<p>그러나 복제 계수를 늘렸을 때 Qdrant의 p99 레이턴시는 개선되었지만 Milvus는 허용 가능한 레이턴시로 Qdrant보다 더 높은 처리량을 유지할 수 있었습니다(높은 레이턴시와 오류로 인해 테스트가 완료되지 않았으므로 Qdrant 400 QPS는 표시되지 않음).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다양한 처리량에 대해 RF=2 지연 시간을 게시하는 Milvus</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>다양한 처리량에 대해 RF=2 지연 시간을 게시하는 Qdrant</p>
<p>시간 제약으로 인해 데이터 세트에서 솔루션 간의 ANN 호출을 비교할 시간이 충분하지 않았지만, 공개적으로 사용 가능한 데이터 세트에서 <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> 에서 제공하는 솔루션에 대한 ANN 호출 측정값을 고려했습니다.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. 최종 선택</h3><p><strong>성능 측면에서</strong>, 별다른 튜닝 없이 HNSW만 사용한 Qdrant는 많은 테스트에서 Milvus보다 원시 지연 시간이 더 나은 것으로 나타났습니다. 그러나 Milvus는 복제가 증가함에 따라 더 잘 확장되는 것처럼 보였고, 다중 노드 유형 아키텍처로 인해 수집과 쿼리 부하 간의 격리가 더 잘 이루어졌습니다.</p>
<p><strong>운영 측면에서는</strong> Milvus 아키텍처의 복잡성(다중 노드 유형, Kafka와 같은 외부 쓰기 전 로그와 etcd와 같은 메타데이터 저장소에 의존)에도 불구하고, 두 솔루션 중 하나가 불량 상태에 진입했을 때 Qdrant보다 Milvus를 디버깅하고 수정하는 데 더 수월했습니다. 또한 Milvus는 컬렉션의 복제 계수를 늘릴 때 자동 리밸런싱 기능을 제공하는 반면, 오픈 소스 Qdrant에서는 복제 계수를 늘리려면 수동으로 샤드를 생성하거나 삭제해야 했습니다(이 기능은 우리가 직접 구축하거나 오픈 소스 이외의 버전을 사용해야 했을 것입니다).</p>
<p>Milvus는 Qdrant보다 더 "Reddit형" 기술이며, 나머지 기술 스택과 더 많은 유사성을 공유합니다. Milvus는 우리가 선호하는 백엔드 프로그래밍 언어인 Golang으로 작성되었기 때문에 Rust로 작성된 Qdrant보다 기여하기가 더 쉽습니다. Milvus는 오픈 소스 제품치고는 프로젝트 속도가 Qdrant에 비해 뛰어났고, 저희의 주요 요구 사항을 더 많이 충족했습니다.</p>
<p>결국 두 솔루션 모두 대부분의 요구 사항을 충족했으며, 일부 경우 Qdrant가 성능 면에서 우위를 보였지만 Milvus를 더 확장할 수 있고 더 편하게 실행할 수 있으며 Qdrant보다 우리 조직에 더 잘 맞는다고 느꼈습니다. Vespa와 Weaviate를 테스트할 시간이 더 있었다면 좋았겠지만, 이 역시 조직 적합성(Vespa는 Java 기반)과 아키텍처(Weaviate는 Qdrant와 같은 단일 노드 유형) 때문에 선택되지 않았을 수도 있습니다.</p>
<h2 id="Key-takeaways" class="common-anchor-header">주요 요점<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>주어진 요구 사항에 도전하고 기존 솔루션에 대한 편견을 없애세요.</p></li>
<li><p>후보 솔루션에 점수를 매기고, 이를 모든 것이 아닌 필수 요구 사항에 대한 논의에 활용하세요.</p></li>
<li><p>솔루션을 정량적으로 평가하되, 그 과정에서 해당 솔루션으로 작업하는 것이 어떤 느낌인지 기록해 두세요.</p></li>
<li><p>단순히 성능이 가장 좋은 솔루션이 아니라 유지보수, 비용, 사용성, 성능의 관점에서 조직에 가장 적합한 솔루션을 선택하세요.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">감사의 말<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>이 평가 작업은 벤 코치, 찰스 은조로게, 아밋 쿠마르, 그리고 제가 수행했습니다. 또한 질적 솔루션 연구를 위해 Annie Yang, Konrad Reiche, Sabrina Kong, Andrew Johnson 등 이 작업에 기여한 다른 분들께도 감사드립니다.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">편집자 주<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 검색 워크로드에 Milvus를 선택해 주었을 뿐만 아니라 시간을 내어 상세하고 공정한 평가를 발표해 주신 Reddit 엔지니어링 팀에 진심으로 감사의 말씀을 전합니다. 실제 엔지니어링 팀이 데이터베이스를 비교하는 방식에 대해 이 정도 수준의 투명성을 보이는 경우는 드물며, 이 글은 성장하는 벡터 데이터베이스 환경을 이해하고자 하는 Milvus 커뮤니티와 그 밖의 모든 사람들에게 도움이 될 것입니다.</p>
<p>크리스도 글에서 언급했듯이 "최고의" 벡터 데이터베이스는 하나밖에 없습니다. 중요한 것은 시스템이 워크로드, 제약 조건 및 운영 철학에 맞는지 여부입니다. Reddit의 비교는 이러한 현실을 잘 반영하고 있습니다. Milvus가 모든 카테고리에서 1위를 차지하지는 못하며, 이는 다양한 데이터 모델과 성능 목표에 따른 장단점을 고려할 때 충분히 예상할 수 있는 일입니다.</p>
<p>한 가지 명확히 할 필요가 있습니다: Reddit의 평가는 당시 안정 버전이었던 <strong>Milvus 2.4를</strong> 사용했습니다. LSH 및 여러 인덱스 최적화와 같은 일부 기능은 아직 존재하지 않았거나 2.4에서는 성숙하지 않았기 때문에 일부 점수는 자연스럽게 이전 기준선을 반영하고 있습니다. 그 이후 Milvus 2.5를 출시한 데 이어 <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6을</strong></a> 출시했는데, 성능, 효율성, 유연성 측면에서 매우 다른 시스템입니다. 커뮤니티의 반응은 매우 뜨거웠고 이미 많은 팀이 업그레이드를 완료했습니다.</p>
<p><strong>Milvus 2.6의 새로운 기능을 간략히 살펴보세요:</strong></p>
<ul>
<li><p>RaBitQ 1비트 양자화를 통해 <strong>메모리 사용량</strong> 최대 <strong>72% 감소</strong> 및 <strong>쿼리 속도 4배 향상</strong> </p></li>
<li><p>지능형 계층형 스토리지로<strong>50% 비용 절감</strong> </p></li>
<li><p>Elasticsearch에 비해<strong>4배 빠른 BM25 전체 텍스트 검색</strong> </p></li>
<li><p>새로운 경로 인덱스로<strong>100배 빨라진 JSON 필터링 속도</strong> </p></li>
<li><p>새로운 제로 디스크 아키텍처로 더 낮은 비용으로 더 신선한 검색 제공</p></li>
<li><p>파이프라인 임베딩을 위한 더 간단한 '데이터 인, 데이터 아웃' 워크플로우</p></li>
<li><p>대규모 멀티테넌트 환경을 처리하기 위한 <strong>10만 개 이상의 컬렉션</strong> 지원</p></li>
</ul>
<p>자세한 내용을 알고 싶으시다면 다음 몇 가지 유용한 후속 정보를 참조하세요:</p>
<ul>
<li><p>블로그 <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 릴리즈 노트 </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: 벡터 데이터베이스를 위한 실제 벤치마킹 - Milvus 블로그</a></p></li>
</ul>
<p>궁금한 점이 있거나 기능에 대해 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요.<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간 진행되는 일대일 세션을 예약하여 인사이트, 안내, 질문에 대한 답변을 얻을 수도 있습니다.</p>
