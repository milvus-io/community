---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: |
  우리가 ‘Loon’을 개발한 이유: 끊임없이 변화하는 AI 데이터를 위한 스토리지 엔진.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon은 Milvus 3.0 및 Zilliz Vector Lakebase를 위한 새로운 스토리지 엔진으로, ColumnGroups, 행
  ID 정렬 및 매니페스트를 통해 지속적으로 변화하는 벡터 데이터셋을 관리하도록 설계되었습니다.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>이 블로그 글은 원래 zilliz.com에 게시된 것으로, 허가를 받아 재게시되었습니다.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">주요 내용<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글은 길고 심도 있는 엔지니어링 분석이므로, 세부 내용으로 들어가기 전에 핵심 요점을 먼저 정리해 드립니다.</p>
<ul>
<li>AI 데이터셋은 정적인 테이블이 아닙니다. 팀이 임베딩 모델을 교체하고, 스파스 벡터를 추가하고, 캡션을 수정하고, 레이블을 백필하고, 인덱스를 재구축하고, 오프라인 분석을 실행함에 따라 동일한 행도 계속 변화합니다.</li>
<li>기존의 스토리지 레이아웃은 세 가지 측면에서 한계가 있습니다. 긴 벡터 열로 인해 백필 비용이 높아지고, 단일 파일 형식으로 스캔과 포인트 읽기를 모두 원활하게 처리할 수 없으며, 사설 데이터베이스 스토리지를 사용하면 외부 파이프라인에서 원본 데이터의 추가 사본을 생성해야 합니다.</li>
<li>Loon은 Milvus 및 Zilliz Vector Lakebase를 위한 새로운 스토리지 엔진입니다. 이 엔진은 하이브리드 파일 형식, 행 ID 정렬, 그리고 데이터셋의 버전 관리 상태를 정의하는 매니페스트(Manifest)를 기반으로 구축되었습니다.</li>
<li>목표는 단일 벡터 데이터셋이 데이터를 끊임없이 복사, 재작성 또는 재가져오지 않고도 온라인 검색, 오프라인 분석, 백필, 압축 및 외부 연산을 지원할 수 있도록 하는 것입니다.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>한동안 벡터 데이터베이스에 반대하는 한 가지 주장이 합리적으로 들렸습니다.</p>
<p><em>기존 데이터베이스는 이미 정수, 문자열, JSON, BLOB 및 인덱스를 저장하고 있습니다.</em> <code translate="no">_vector_</code> <em>유형을</em><em>추가하고</em> <em>, 그 옆에 ANN 인덱스를 구축한 뒤, 그걸로 끝내면 되지</em><em>않을까요</em> <em>?</em></p>
<p>초기 시맨틱 검색의 경우, 이 방법만으로도 충분히 잘 작동합니다. 벡터 열 하나와 인덱스 하나만으로도 데모, 소규모 RAG 애플리케이션, 또는 내부 검색 기능을 지원할 수 있습니다. 문제는 데이터셋이 테이블의 특성을 점점 잃고 AI 데이터 시스템의 특성을 더 많이 띠기 시작할 때 나타납니다.</p>
<p>실전용 벡터 데이터셋에는 행, 기본 키, 스칼라 필드, 쿼리 가능한 열이 있습니다. 그런 의미에서 이는 데이터베이스 테이블처럼 보입니다. 하지만 동시에 데이터 레이크와 같은 규모와 워크플로우 구조를 갖추고 있습니다. 수억 건의 레코드를 포함할 수도 있습니다. 이 데이터셋은 Spark, Ray, DuckDB, 훈련 파이프라인, 평가 작업, 데이터 품질 시스템에 의해 반복적으로 읽히고 재작성됩니다.</p>
<p>또한 오브젝트 스토리지에 의존합니다. 소스 오브젝트는 대개 S3, GCS, OSS 또는 다른 오브젝트 스토어에 남아 있는 동영상, 이미지, PDF, 오디오 파일, 웹 문서 등입니다. 데이터베이스는 참조 정보, 메타데이터, 파생 특징, 인덱스를 저장합니다. 그리고 기존 스토리지 모델이 관리하도록 설계되지 않았던 요소들을 일급 객체로 추가합니다. 여기에는 고밀도 임베딩, 스파스 벡터, 캡션, 벡터 인덱스, 텍스트 인덱스, 삭제 로그, 통계, 모델 버전, 파서 버전, 외부 BLOB 참조, 그리고 이 모든 요소 간의 버전 관계가 포함됩니다.</p>
<p><strong>바로 이 지점에서 “벡터 열을 추가하기만 하면 된다”는</strong> 접근<strong>방식이 한계에 부딪히기 시작합니다.</strong> 문제는 데이터베이스가 벡터 바이트를 저장할 수 있는지 여부가 아닙니다. 많은 시스템이 이를 지원합니다. 더 어려운 질문은 <strong>스토리지 모델이 벡터 데이터의 변화 방식, 쿼리 방식, 그리고 AI 데이터 스택 전반에 걸친 공유 방식을 처리할 수 있는지 여부입니다.</strong></p>
<p><strong>이것이 바로 우리가 Milvus와</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(Zilliz Cloud의 차세대 버전)</strong><strong>를 위한 새로운 스토리지 엔진인 Loon을 개발한 이유입니다</strong> <strong>.</strong></p>
<p>Loon은 다음 세 가지 개념을 바탕으로 설계되었습니다:</p>
<ol>
<li>열의 종류에 따라 서로 다른 물리적 형식을 사용합니다.</li>
<li>공유 행 ID 공간을 통해 해당 컬럼들을 정렬한다.</li>
<li>매니페스트(Manifest)를 사용하여 데이터셋의 버전 관리 상태를 정의한다.</li>
</ol>
<p>이러한 요소들이 왜 중요한지 알아보기 위해, 일반적인 멀티모달 워크플로우부터 살펴보겠습니다.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">벡터 데이터셋은 결코 완전히 완성된 적이 없습니다.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>다중 모달 훈련을 위한 비디오 데이터셋을 구축하는 AI 팀을 상상해 보세요.</p>
<p>긴 동영상이 오브젝트 스토리지에 업로드됩니다. 파이프라인은 장면 변경, 샷 경계 또는 시간 창을 기준으로 동영상을 클립으로 분할합니다. 너무 길거나 짧거나, 흐리거나, 중복되거나, 화질이 낮은 클립은 필터링되어 제외됩니다. 남은 클립은 미적 모델에 의해 점수가 매겨지고, 다른 모델에 의해 캡션이 추가되며, 비전-언어 모델에 의해 임베딩된 후, 검색, 중복 제거 및 훈련 데이터 필터링을 위해 벡터 데이터베이스에 저장됩니다.</p>
<p>대략적으로 보면 워크플로우는 간단해 보입니다:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>하지만 데이터셋은 완성된 형태로 제공되지 않습니다.</p>
<ul>
<li>첫 주에는 테이블에 <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code>, <code translate="no">duration</code> 만 포함되어 있을 수 있습니다.</li>
<li>두 번째 주에 팀은 <code translate="no">aesthetic_score</code> 를 추가합니다.</li>
<li>3주차에는 캡션 생성 모델이 실행되어 각 클립에 <code translate="no">caption</code> 가 할당됩니다.</li>
<li>4주 차에 첫 번째 임베딩 모델이 온라인에 공개되고, 각 클립에 768차원 CLIP 임베딩이 할당됩니다.</li>
<li>한 달 후, 팀은 모델을 전환하고 <code translate="no">embedding_v2</code> 를 소급 적용하며, 이제 차원은 1024가 됩니다.</li>
<li>두 달 후, 하이브리드 검색이 필수 요건이 되자 팀은 스파스 벡터 열을 추가합니다.</li>
<li>3개월 후, 캡션은 사람이 검토하게 되며 현장에서 바로 수정되어야 합니다.</li>
</ul>
<p>데이터셋은 결코 완성되지 않았습니다. 동일한 기본 행에 대한 새로운 해석이 계속해서 축적되었기 때문입니다.</p>
<p>이것이 벡터 데이터와 기존 비즈니스 데이터 간의 핵심적인 차이점 중 하나입니다. 동일한 행이 반복적으로 재처리됩니다. 그리고 데이터의 규모가 커짐에 따라 이는 단순한 불편함을 넘어 저장 공간 문제로 이어집니다. 다중 모달 데이터셋은 대개 수백만 건의 레코드가 아니라 수억 건 또는 수십억 건에 달하기 때문입니다. LAION-5B는 데이터셋의 형태를 파악하는 데 유용한 참고 자료입니다. 수십억 개의 이미지-텍스트 쌍으로 구성되어 있으며, 각 쌍에는 메타데이터, 캡션, 임베딩이 포함되어 있습니다. 따라서 어려운 부분은 첫 번째 삽입이 아닙니다. 데이터셋이 진화하기 시작한 후 발생하는 모든 과정이 어려운 부분입니다. <strong>이러한 진화 과정은 세 가지 문제를 드러냅니다.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">첫 번째 문제: 긴 열은 쓰기 증폭 비용을 높입니다<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Parquet와 같은 열 기반 형식은 많은 분석 워크로드에 탁월합니다. 스키마가 비교적 안정적이고, 데이터가 재기록되는 것보다 읽히는 빈도가 더 높으며, 스캔이 열의 일부만 다루고, 압축이 중요한 경우에 잘 작동합니다. 이것이 바로 많은 분석 형식이 최적화된 환경입니다.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">벡터 행은 분석용 행보다 훨씬 더 넓습니다</h3><p>TPC-H <code translate="no">lineitem</code> 는 좋은 기준이 됩니다. 이 데이터셋에는 정수 키, 소수 값, 날짜, 짧은 문자열, 그리고 작은 주석 필드 등 16개의 열이 있습니다. 압축되지 않은 한 행의 크기는 대략 150바이트입니다. 압축 후에는 이보다 훨씬 작아질 수 있습니다. 64MB 행 그룹을 사용하면 스토리지 시스템은 수십만 개의 행을 하나의 그룹에 압축하여 저장할 수 있습니다.</p>
<p><strong>벡터 데이터셋은 이와 다릅니다.</strong></p>
<p>LAION 스타일의 이미지-텍스트 데이터셋은 오늘날 많은 AI 파이프라인이 생성하는 결과물에 훨씬 더 가깝습니다. 각 행에는 여전히 URL, 캡션, 너비, 높이, 품질 점수, 레이블 등 일반적인 메타데이터가 포함되어 있습니다. 하지만 임베딩이 추가되면 행의 물리적 형태가 달라집니다.</p>
<p>768차원 CLIP 벡터는 fp16 기준 약 1.5KB, fp32 기준 약 3KB를 차지합니다. 이 한 열의 크기는 TPC-H <code translate="no">lineitem</code> 행 전체보다 훨씬 클 수 있습니다.</p>
<p>게다가 768차원은 오늘날의 기준에서 볼 때 드문 것도, 큰 것도 아닙니다. 1024차원이나 2048차원 임베딩은 다중 모달 파이프라인에서 흔히 볼 수 있습니다. OpenAI의 <code translate="no">text-embedding-3-large</code> 는 최대 3072차원까지 지원하며, 이는 fp32 기준 벡터당 약 12KB에 해당합니다.</p>
<p>비교해 보면 그 차이가 확연합니다:</p>
<table>
<thead>
<tr><th>데이터셋 형태</th><th>대략적인 행 크기</th><th>행의 주된 구성 요소</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>압축 해제 시 ~150바이트</td><td>스칼라 및 짧은 문자열 필드</td></tr>
<tr><td>768차원 fp16 벡터를 포함한 LAION 스타일 행</td><td>~1.5 KB+</td><td>임베딩</td></tr>
<tr><td>768차원 fp32 벡터를 포함한 LAION 스타일 행</td><td>~3 KB+</td><td>임베딩</td></tr>
<tr><td>3072차원 fp32 벡터가 포함된 행</td><td>벡터만 약 12 KB+</td><td>임베딩</td></tr>
</tbody>
</table>
<p>많은 AI 데이터셋에서 벡터 열은 단순한 필드 중 하나가 아닙니다. 물리적으로 보면 행의 대부분을 차지합니다. 이는 스키마 진화에 드는 비용을 변화시킵니다.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">벡터 열 하나를 추가하는 것만으로도 수백 기가바이트가 소요될 수 있습니다</h3><p>데이터셋에 1억 개의 동영상 클립이 있다고 가정해 봅시다. 새로운 1024차원 fp32 임베딩 열을 추가한다는 것은 대략 400 GB의 원시 벡터 데이터를 기록해야 함을 의미합니다. 여기에는 통계, 인덱스, 메타데이터 업데이트, 오브젝트 스토리지 오버헤드, 유효성 검사 또는 서빙 경로 통합 비용은 포함되지 않습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>팀이 매월 <code translate="no">embedding_v2</code>, <code translate="no">sparse_vector</code>, 재순위(rerank) 특징과 같은 벡터형 열을 한두 개씩 추가한다면, 스키마 진화는 수백 기가바이트 또는 테라바이트 단위로 측정되는 반복적인 데이터 엔지니어링 작업이 됩니다.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">사소한 논리적 업데이트도 대규모 물리적 재작성을 유발할 수 있습니다</h3><p>업데이트도 마찬가지로 중요합니다.</p>
<p>열 기반 시스템에서는 일반적으로 기존 데이터가 제자리에서 업데이트되지 않습니다. 삭제 로그에 변경 사항이 기록되고, 이후 압축 과정을 통해 활성 행이 새로운 파일로 다시 기록됩니다. 이 모델은 행의 크기가 작을 때 관리하기 쉽습니다.</p>
<p>벡터 데이터의 경우, 사소한 논리적 업데이트도 대규모 물리적 재작성을 유발할 수 있습니다.</p>
<p>사람이 수행하는 검토 작업은 캡션에서 불과 수백 바이트만 수정할 수도 있습니다. 하지만 캡션, 밀집 벡터, 희소 벡터 및 기타 파생 특징이 동일한 물리적 파일 수명 주기를 공유한다면, 시스템은 결국 벡터들까지 다시 쓰게 될 수 있습니다. 논리적 변경은 미미하지만, 물리적 I/O는 막대할 수 있습니다.</p>
<p>이것이 바로 벡터 스토리지의 쓰기 증폭 문제입니다. 비용이 많이 드는 이유는 벡터의 크기가 크기 때문만은 아닙니다. 대규모 파생 필드와 소규모 가변 필드가 하나의 단위로 취급되는 스토리지 레이아웃에 의해 종종 묶여버리기 때문입니다.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">AI 데이터셋의 경우, 백필(backfill)은 일상적인 워크로드입니다</h3><p>전통적인 분석용 테이블의 경우 스키마 진화는 가끔씩만 발생합니다. 반면 AI 데이터셋에서는 이는 일상적인 일입니다. 캡션 모델이 업그레이드되고, 임베딩 모델이 교체되며, 스파스 벡터가 나중에 추가되고, 재순위 지정 특징이 나타나며, 사람이 부여한 레이블이 수정되고, 거버넌스 태그가 백필되며, 인덱스가 재구축됩니다.</p>
<p>이러한 작업들은 단순한 추가 작업이 아닙니다. 기존 행을 수정하거나 확장하는 경우가 빈번합니다.</p>
<p>그렇기 때문에 벡터 스토리지의 최적화는 단순히 스캔 처리량에만 국한될 수 없습니다. 백필 및 부분 업데이트의 비용도 절감해야 합니다.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">두 번째 문제: 동일한 데이터가 스캔과 포인트 읽기를 모두 지원해야 함<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터가 기록된 후, 읽기 경로는 두 갈래로 나뉩니다. 동일한 벡터 데이터셋은 일반적으로 <strong>분석적 스캔과 포인트 읽기라는</strong> 두 가지 뚜렷한 액세스 패턴을 가집니다 <strong>.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">분석 워크로드는 광범위하고 압축된 스캔을 필요로 합니다</h3><p>파이프라인은 다음과 같은 필터를 실행할 수 있습니다:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>또는 오프라인 분석, 전체 임베딩 평가, BM25 통계, 비트맵 생성, 데이터 품질 검사, 개수 집계 및 그룹화 작업을 수행할 수도 있습니다.</p>
<p>이 패턴은 많은 행을 읽지만 열은 소수만 읽습니다. 이 패턴은 순차적 I/O, 더 큰 행 그룹, 압축, 열 제거, 일괄 디코딩 및 벡터화된 실행을 선호합니다.</p>
<p>이 경우 큰 행 그룹이 도움이 됩니다. 이를 통해 단일 I/O 요청으로 대량의 유용한 데이터를 가져올 수 있고, 압축 효율을 향상시키며, 실행 엔진에 오버헤드를 상쇄할 수 있을 만큼 충분한 연속 데이터를 제공할 수 있습니다. 여러 열을 함께 읽을 때, 스캔 처리량을 위해 열을 체계적으로 정리해 두면 벡터화 실행 중 캐시 미스를 줄이는 데도 도움이 됩니다.</p>
<p>Parquet는 이러한 측면에서 강점을 보입니다.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">ANN 결과에는 좁은 범위의 행 수준 조회가 필요합니다</h3><p>ANN 검색이 후보 행 ID를 반환한 후, 시스템은 종종 다음과 같은 필드를 가져와야 합니다:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>이 패턴은 읽는 행 수가 적으며(대개 수백 또는 수천 행), 행 ID를 통한 정밀한 액세스가 필요합니다. 특정 행과 열을 찾아 필요한 바이트 범위만 가져오고, 몇 개의 레코드만 검색하기 위해 전체 행 그룹을 불러오는 것을 피하고자 합니다.</p>
<p>포인트 조회(Point lookup)는 스캔에 대해 거의 정반대의 선호도를 보입니다. 더 작은 읽기 세분성을 원합니다. 이상적으로는 스토리지 계층이 행 ID를 통해 관련 세그먼트나 바이트 범위를 찾아내고, 해당 범위만 읽은 뒤 결과에 필요한 데이터만 디코딩할 수 있어야 합니다.</p>
<p>압축 역시 서로 다른 상충 관계를 가집니다. 스캔의 경우, 시스템이 많은 데이터를 읽고 I/O를 절약할 수 있으므로 더 강력한 압축을 적용하는 것이 종종 유리합니다. 반면 포인트 조회에서는, 한 행을 검색하는 데 훨씬 더 큰 압축 블록을 디코딩해야 하는 경우 압축이 오히려 부담이 될 수 있습니다.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">단일 레이아웃으로는 두 경로 모두를 최적화할 수 없습니다.</h3><p>이것이 핵심적인 상충 관계입니다. 스칼라 필터링 및 분석은 넓고, 압축되어 있으며, 스캔에 적합한 레이아웃을 필요로 합니다. 반면 벡터 조회(vector lookup)는 좁고, 정밀하며, 행 주소 지정 가능한 레이아웃을 필요로 합니다.</p>
<p>단일 파일 형식은 어느 정도 양쪽을 모두 지원할 수 있지만, 동시에 양쪽 모두에 대해 최적일 수는 없습니다.</p>
<p>모든 열이 Parquet에 저장되어 있다면 스칼라 스캔은 원활하게 수행됩니다. 하지만 리콜 후 ANN 조회 작업은 더 어려워집니다. 시스템에는 수백 개의 벡터, 캡션 또는 메타데이터 레코드만 필요할 수 있지만, 스토리지 계층에서는 대부분 관련 없는 행으로 구성된 대규모 행 그룹을 읽어야 할 수도 있습니다.</p>
<p>로컬 SSD에서는 캐시와 mmap을 통해 이러한 비용의 일부를 상쇄할 수 있습니다. 하지만 데이터가 오브젝트 스토리지에 저장되면 비용이 더욱 두드러지게 나타납니다. 캐시 미스가 발생할 때마다 원격 범위 읽기가 발생할 수 있습니다. 후보 행들이 여러 행 그룹에 흩어져 있다면, 단일 쿼리만으로도 여러 번의 읽기가 유발될 수 있으며, 각 읽기 작업은 쿼리에 필요한 양보다 더 많은 데이터를 가져오게 됩니다. 레이아웃이 불량한 경우, 1,000개의 후보 행을 가져오는 것만으로도 수십 또는 수백 메가바이트에 달하는 불필요한 I/O가 발생하기 쉬우며, 극단적인 경우에는 그보다 훨씬 더 많은 양이 발생할 수 있습니다.</p>
<p>행 그룹을 더 작게 만들면 포인트 조회에는 도움이 되지만, 스캔 성능에는 악영향을 미칩니다. 너무 많은 작은 조각은 압축 효율을 떨어뜨리고, 메타데이터 오버헤드를 증가시키며, 분석 엔진이 의존하는 긴 순차 읽기를 방해합니다.</p>
<p><strong>따라서 문제는 ‘마법 같은’ 단일 행 그룹 크기를 찾는 데 있는 것이 아닙니다. 문제는 동일한 데이터셋이 마치 두 개의 서로 다른 스토리지 시스템처럼 동작하도록 요구받고 있다는 점입니다.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">하이브리드 검색은 두 가지 경로를 하나의 쿼리로 통합합니다</h3><p>하이브리드 검색은 이러한 충돌을 무시하기 더 어렵게 만듭니다. 단일 쿼리는 먼저 스칼라 필터를 적용할 수 있습니다:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 ANN 검색을 실행합니다.</p>
<p>그 후 행 ID를 기반으로 캡션, 벡터 및 메타데이터를 가져옵니다.</p>
<p>사용자에게는 이것이 하나의 검색 요청으로 보입니다. 하지만 스토리지 계층에서는 분석적 스캔이자 저지연 무작위 조회로 동시에 인식됩니다.</p>
<p>그렇기 때문에 벡터 스토리지에는 단순히 더 나은 Parquet 설정 이상의 것이 필요합니다. 각 열이 실제로 읽히는 방식에 따라 열을 배치할 수 있는 방법이 필요합니다.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">세 번째 문제: 데이터셋이 하나의 엔진 내에 존재하지 않는다<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>처음 두 가지 문제는 데이터베이스 내부에서 발생합니다. 세 번째 문제는 시스템 간의 경계에서 발생합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">AI 데이터 파이프라인은 여러 시스템에 걸쳐 있습니다</h3><p>비디오 워크플로우에서 벡터 데이터베이스 자체 내에서 처리되는 작업은 극히 적습니다.</p>
<p>원본 동영상은 오브젝트 스토리지 내에 저장됩니다. 클립 생성은 Spark나 Ray에서 실행될 수 있습니다. 미적 점수 산정은 GPU 서비스에서 실행될 수 있습니다. 자막 생성은 LLM 추론 파이프라인에서 실행될 수 있습니다. 임베딩은 다른 GPU 작업에 의해 생성될 수 있습니다. 스파스 벡터는 SPLADE 서비스에서 제공될 수 있습니다. 오프라인 평가, 훈련 데이터 필터링, 수동 검토 및 거버넌스 작업은 모두 다른 곳에서 실행될 수 있습니다.</p>
<p>벡터 데이터베이스는 온라인 검색을 지원하지만, 데이터셋은 여러 시스템에 의해 생성, 수정, 평가 및 확장됩니다.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">비공개 스토리지 형식은 ‘진실’의 복사본을 여러 개 생성합니다</h3><p>데이터베이스가 오직 해당 데이터베이스만이 읽고 쓸 수 있는 사설 물리적 형식을 사용하는 경우, 모든 외부 작업에는 내보내기, 변환, 복사 및 가져오기 과정이 필요합니다. 동일한 컬렉션이 데이터베이스, Spark 임시 디렉터리, 평가 결과물, 로컬 백필 디렉터리 등에 동시에 존재할 수 있습니다. 그러면 진정한 질문은 다음과 같습니다:</p>
<ul>
<li>어느 사본이 ‘진실의 원천’인가?</li>
<li>어느 복사본에 지난달의 캡션 모델이 포함되어 있는가?</li>
<li>어떤 행들이 이미 사람의 검토를 통해 수정되었는가?</li>
<li>어떤 스파스 벡터 열이 어떤 모델에 의해 생성되었는가?</li>
<li>백필 후에도 여전히 유효한 벡터 인덱스는 어느 것입니까?</li>
<li>이 행은 어떤 원본 동영상 객체를 가리키나요?</li>
</ul>
<p>규모가 작을 때는 팀이 명명 규칙과 수동 점검만으로도 어떻게든 버틸 수 있습니다. 하지만 수억 개의 행과 테라바이트 단위의 임베딩이 존재하면 이는 일관성 문제로 이어집니다.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">벡터 데이터셋에는 공유되는 버전 관리 상태가 필요합니다</h3><p>레이크하우스(Lakehouse) 시스템은 구조화된 데이터에 대해 이 문제의 한 측면을 해결했습니다. Iceberg, Delta Lake, Hudi는 단순히 파일을 저장하는 데 그치지 않습니다. 이 시스템들의 핵심 기여점은 여러 엔진이 동일한 테이블 상태를 중심으로 협업할 수 있도록 하는 것입니다.</p>
<p>이제 벡터 데이터베이스에도 유사한 기능이 필요하지만, 상태 관리는 훨씬 더 복잡합니다. 여기에는 테이블 파일과 파티션뿐만 아니라 벡터 인덱스, 텍스트 인덱스, 스파스 특징, 삭제 로그, 통계, 행 ID 범위, 외부 BLOB에 대한 참조까지 포함되어야 합니다.</p>
<p>문제는 단순히 “Spark가 Milvus 파일을 읽을 수 있는가?”가 아닙니다.</p>
<p>진정한 질문은, Spark가 스파스 벡터 컬럼을 백필한 후, Milvus가 해당 컬럼이 어느 버전에 속하는지, 어떤 행을 포함하는지, 어떤 모델에서 생성되었는지, 그리고 온라인 쿼리가 언제 이를 안전하게 사용할 수 있는지 어떻게 파악할 수 있는가 하는 것입니다.</p>
<p>그 해답은 스토리지 모델에 있어야 합니다.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">패치만으로는 왜 충분하지 않은가<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>이것들을 세 가지 별개의 엔지니어링 문제로 취급하고 싶은 유혹이 있습니다.</p>
<ul>
<li>쓰기 증폭? 배치 처리를 추가하면 됩니다.</li>
<li>포인트 읽기? 캐시를 추가하면 됩니다.</li>
<li>외부 시스템 문제? 내보내기 및 가져오기 도구를 추가하면 됩니다.</li>
</ul>
<p>이러한 패치들은 도움이 될 수 있지만, 근본적인 문제, 즉 벡터 데이터셋이 물리적으로 이질적이라는 점을 해결하지는 못합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>동영상 예시에서 <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> 및 <code translate="no">aesthetic_score</code> 는 짧은 스칼라 필드입니다. 이들은 필터링 및 분석에 유용합니다.</p>
<ul>
<li><code translate="no">caption</code> 는 텍스트입니다. BM25, 검토, 수정 및 백필에 사용될 수 있습니다.</li>
<li><code translate="no">embedding</code> 는 길고 밀도가 높은 벡터입니다. ANN 리콜에 사용되며, 이후 행 수준 조회 또는 재순위 지정에 활용됩니다.</li>
<li><code translate="no">embedding_v2</code> 는 새로운 모델 출력값으로, 원본 데이터가 삽입된 지 꽤 오랜 시간이 지난 후에 백필되는 경우가 많습니다.</li>
<li><code translate="no">sparse_vector</code> 는 하이브리드 검색을 지원하며 고유한 액세스 패턴을 갖습니다.</li>
<li>원본 동영상은 오브젝트 스토리지에 보관되어야 합니다. 데이터베이스에는 참조 정보, 체크섬, MIME 유형, 파서 버전 및 행 수준 관계가 저장되어야 합니다.</li>
<li>벡터 인덱스, 텍스트 인덱스, 통계 및 삭제 로그는 자체 버전 세미오틱을 가진 파생 객체입니다.</li>
</ul>
<p>이러한 객체들은 논리적 행을 공유하지만, 모두 동일한 물리적 레이아웃이나 수명 주기를 공유해서는 안 됩니다.</p>
<ul>
<li>이들을 하나의 일반 테이블 레이아웃으로 강제로 통합하면 업데이트 비용이 높아집니다.</li>
<li>이들을 하나의 열 기반 파일 형식으로 강제로 통합하면, 포인트 읽기 작업에 많은 비용이 소요됩니다.</li>
<li>이들을 관련 없는 객체 파일로 취급하면 버전 관리가 불안정해집니다.</li>
</ul>
<p>따라서 스토리지 모델은 데이터 세트가 이질적이라는 사실에서 출발해야 합니다.</p>
<p><strong>이를 통해 세 가지 설계 요구 사항이 도출됩니다.</strong></p>
<ul>
<li>첫째, 서로 다른 열 그룹은 서로 다른 물리적 형식으로 저장되어야 합니다.</li>
<li>둘째, 이러한 열 그룹들은 단일 논리적 테이블처럼 작동할 수 있도록 공유된 행 ID 공간을 가져야 합니다.</li>
<li>셋째, 데이터셋에는 현재 뷰에 속하는 파일, 인덱스, 로그, 통계 및 객체 참조를 선언하는 버전 관리된 매니페스트가 필요합니다.</li>
</ul>
<p><strong>이것이 바로 Milvus와 Zilliz Cloud의 기반이 되는 새로운 스토리지 엔진인 Loon의 설계 원리입니다.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: 진화하는 벡터 데이터셋을 위한 Milvus 및 Zilliz Cloud의 스토리지 엔진<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 모든 문제를 해결하기 위해, 우리는 진화하는 벡터 데이터셋을 위해 설계된 Milvus 및 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (Zilliz Cloud의 차세대 버전)용 새로운 스토리지 엔진인 <strong>Loon을</strong> 개발했습니다.</p>
<p>이 이름은 Zilliz의 새 이름을 따는 전통을 따릅니다. 루ーン(loon)은 호수에 서식하는 잠수성 조류로, 이는 시스템의 목표와 잘 부합합니다. 즉, 벡터 데이터베이스는 쿼리를 실행하거나, 열을 백필하거나, 인덱스를 구축할 때마다 방대한 양의 데이터 전체를 이동, 스캔 또는 재작성할 필요가 없어야 합니다. 먼저 열, 인덱스, 통계 정보, 삭제 로그, 객체 참조 등을 포함한 현재 데이터셋 버전을 파악한 다음, 실제로 필요한 부분만 읽어야 합니다.</p>
<p>하이브리드 파일 형식, 행 ID 정렬, 매니페스트는 서로 별개의 세 가지 기능이 아닙니다. 이 세 가지는 ‘벡터 데이터셋은 본질적으로 이질적이다’라는 동일한 설계 전제에서 비롯된 것입니다.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">세 가지 요소, 하나의 스토리지 모델</h3><p>하이브리드 파일 형식은 서로 다른 열마다 액세스 패턴이 다르다는 점을 인정합니다. 스칼라 필드는 스캔 및 필터링에 적합합니다. 벡터 필드는 효율적인 행 수준 조회가 필요합니다. 동영상, PDF, 이미지, 오디오 파일과 같은 원시 객체는 데이터베이스 데이터 파일이 아닌 객체 스토리지에 저장되어야 합니다.</p>
<p>행 ID 정렬은 이러한 열들이 물리적으로는 분리되어 있을 수 있지만, 여전히 동일한 논리적 행을 설명한다는 점을 인정합니다. 캡션, 임베딩, 스파스 벡터, 비디오 URI는 서로 다른 파일과 형식으로 존재할 수 있지만, 여전히 단일 결과로 통합되어야 합니다.</p>
<p>매니페스트(Manifest)는 데이터셋이 한 번 작성된 후 그대로 방치되는 것이 아님을 인정합니다. 데이터셋은 여러 시스템에 의해, 여러 버전을 거쳐, 다양한 작업을 위해 수정될 것입니다. 인덱스, 통계, 삭제 로그, 외부 객체 참조 및 열 그룹은 모두 동일한 버전 관리 뷰에 나타나야 합니다.</p>
<p><strong>이것이 바로 Loon이 단순히 더 빠른 벡터 파일 형식이 아닌 이유입니다.</strong> 더 빠른 형식은 포인트 조회를 돕지만, 스키마 진화나 다중 엔진 간 조율 문제를 해결하지는 못합니다. 행 ID 정렬을 통해 분할된 열을 단일 테이블처럼 처리할 수는 있지만, 어떤 파일이 현재 버전에 속하는지는 명시하지 못합니다. 매니페스트는 데이터셋의 상태를 기술할 수 있지만, 열 그룹과 행 ID 정렬이 없다면 하나의 논리적 컬렉션 내의 서로 다른 물리적 레이아웃을 명확하게 표현할 수 없습니다.</p>
<p>저장소 모델에는 다음 세 가지가 모두 필요합니다. 서로 다른 열 그룹에 대한 서로 다른 형식, 행을 재구성하기 위한 공유 행 ID 공간, 그리고 모든 읽기 및 쓰기 작업자에게 데이터 세트의 현재 상태를 알려주는 버전 관리된 매니페스트입니다.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon이 Milvus 및 Zilliz Vector Lakebase에서 차지하는 위치</h3><p>Milvus에서는 기존의 세그먼트 바이너리 로그(binlog) 저장 계층을 매니페스트, 컬럼 그룹, 파일 형식 및 파일 시스템 추상화를 기반으로 구축된 모델로 대체합니다. <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (Zilliz Cloud의 차세대 버전)에서도 Vector Lakebase 아키텍처에 동일한 방향성이 적용됩니다<strong>.</strong> 즉, 벡터 데이터베이스 서비스 경로는 빠르게 유지하면서, 기반 데이터의 진화, 분석 및 외부 시스템과의 연동을 더 쉽게 만드는 것입니다.</p>
<p>상위 수준의 Milvus 구성 요소들은 여전히 익숙한 역할을 유지합니다. Proxy는 라우팅을 처리하고, QueryCoord와 DataCoord는 스케줄링을 처리하며, IndexNode는 인덱스를 구축합니다. 컬렉션, 삽입, 검색 및 하이브리드 검색을 위한 애플리케이션용 API는 Manifest 파일이나 ColumnGroup을 노출할 필요가 없습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>변화는 내부 구조에 있습니다.</p>
<p>DataNode, QueryNode, segcore, 컴팩션 및 외부 커넥터는 동일한 스토리지 추상화를 통해 작동할 수 있습니다. 이는 데이터셋이 더 이상 데이터베이스에 의해서만 쓰여지고 읽히는 것이 아니기 때문에 중요합니다. 데이터셋은 외부 컴퓨팅 시스템에 의해 확장될 수 있으며, 동시에 온라인 검색에 의해 활용될 수 있습니다.</p>
<p>개략적으로 보면 계층 구조는 다음과 같습니다.</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>매니페스트(Manifest)는 데이터셋의 버전별 상태를 기술합니다. 컬럼 그룹(ColumnGroups)은 논리적 컬렉션을 물리적 컬럼 그룹으로 매핑합니다. 파일 형식 계층을 통해 각 컬럼 그룹은 적절한 형식을 선택할 수 있습니다. 파일 시스템 추상화는 오브젝트 스토리지와 로컬 스토리지 전반에서 작동합니다.</p>
<p>중요한 점은 하이브리드 파일 형식, 행 ID 정렬, 매니페스트가 별개의 기능이 아니라는 것입니다. 이 세 가지가 함께 저장소 모델을 정의합니다.</p>
<p>이러한 모델이 마련된 상태에서, Loon이 서로 다른 ColumnGroups를 어떻게 저장하는지, 이를 다시 행으로 정렬하는 방법, 그리고 매니페스트가 해당 파일들을 버전 관리되는 데이터셋으로 변환하는 방법 등 세 가지 설계 선택 사항을 하나씩 살펴볼 수 있습니다.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">설계 1: 각 ColumnGroup에 적합한 파일 형식 사용<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>컬럼마다 액세스 패턴이 다릅니다. 따라서 동일한 파일 형식으로 강제로 통합해서는 안 됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon은 논리적 컬렉션을 ColumnGroups로 분리합니다.</h3><ul>
<li>스칼라 필드, 필터 필드, 비즈니스 키, 통계 필드는 종종 스캔, 필터링, 집계되거나 쿼리 계획에 사용됩니다. 이러한 필드는 압축, 컬럼 프루닝, 생태계 호환성의 이점을 누릴 수 있습니다. Parquet는 이러한 컬럼에 적합합니다.</li>
<li>밀집 벡터, 희소 벡터 및 재순위(rerank) 특징은 종종 ANN 리콜 후 행 ID를 통해 읽힙니다. 이들은 저지연 임의 접근, 정밀한 바이트 범위 읽기 및 선택적 디코딩이 필요합니다. 세그먼트 기반 레이아웃이 더 적합합니다. Loon은 이러한 용도로 Vortex를 사용합니다.</li>
<li>동영상, PDF, 이미지, 오디오 파일과 같은 원시 객체는 벡터 데이터베이스의 데이터 파일에 임베드되어서는 안 됩니다. 이들은 객체 스토리지에 그대로 남아 있어야 합니다. 데이터베이스는 참조 정보, 체크섬, MIME 유형, 파서 버전 및 행 수준 관계를 기록합니다.</li>
</ul>
<p>동영상 예시의 경우, 물리적 레이아웃은 다음과 같을 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>애플리케이션 입장에서는 여전히 하나의 컬렉션입니다. 스토리지 계층에서는 해당 컬렉션의 서로 다른 부분이 서로 다른 물리적 형식을 사용합니다. 이는 불필요한 재작성 작업을 직접적으로 줄여줍니다. <code translate="no">embedding_v2</code> 를 추가하는 작업은 새로운 벡터 ColumnGroup과 매니페스트 커밋으로 처리될 수 있습니다. 캡션 열, 스칼라 메타데이터 또는 기존 임베딩 열을 다시 작성할 필요가 없습니다.</p>
<p>이 같은 개념은 스파스 벡터, 재순서화(rerank) 특징 또는 기타 파생 필드에도 적용됩니다. 새로운 컬럼이 물리적으로 독립적이며 행 ID에 따라 정렬될 수 있다면, 관련 없는 컬럼들을 동일한 재작성 경로로 끌어들일 필요가 없습니다.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon은 파일 형식의 사용 방식도 조정합니다.</h3><p><strong>Parquet의 경우, 벡터가 많은 데이터에 대해 기본 설정이 항상 이상적인 것은 아닙니다.</strong> 64MB 행 그룹은 포인트 조회(point lookup)에 너무 클 수 있는데, 이는 작은 무작위 읽기 작업이 필요한 데이터보다 훨씬 더 많은 데이터를 불러올 수 있기 때문입니다. Loon은 관련 경로에서 행 그룹을 1MB로 축소하고, 무작위 조회 벡터 데이터에 도움이 되지 않을 경우 벡터 열에 대한 사전 인코딩(dictionary encoding)과 같은 인코딩을 비활성화합니다.</p>
<p><strong>Vortex의 경우, 더 중요한 작업은 레이아웃입니다.</strong> Loon은 스캔 효율과 포인트 조회 간의 균형을 맞추는 레이아웃을 사용합니다. 행 그룹 내에서 관련 열의 세그먼트를 서로 가까이 배치하여 스캔을 지원할 수 있습니다. 연산을 수행할 때, 하위 세그먼트 읽기를 통해 시스템은 전체 세그먼트를 불러오는 대신 관련 바이트만 가져올 수 있습니다.</p>
<p><strong>Loon은 읽기 전용 Lance 통합도 지원하므로</strong>, 호환성이 중요한 경우 기존 Lance 데이터셋을 ColumnGroups로 마운트할 수 있습니다.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">벤치마크 결과</h3><p>40,000개의 행을 포함하는 단일 파일과 스키마 <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code> 를 사용한 한 로컬 테스트에서, Vortex는 1MB 행 그룹을 사용하는 Parquet과 비교하여 다음과 같은 결과를 보여주었습니다:</p>
<table>
<thead>
<tr><th>작업</th><th>Vortex</th><th>Parquet</th><th>차이</th></tr>
</thead>
<tbody>
<tr><td>K=1,000개의 무작위 행 추출</td><td>5.8 ms</td><td>144 ms</td><td>25배 더 빠름</td></tr>
<tr><td>전체 벡터-열 스캔</td><td>21 ms</td><td>142 ms</td><td>6.76배 더 빠름</td></tr>
<tr><td>파일 크기, 원시 데이터 약 21 MB</td><td>6.62 MB</td><td>7.16 MB</td><td>7% 더 작음</td></tr>
</tbody>
</table>
<p><code translate="no">take</code> 의 결과는 읽기 및 디코딩해야 하는 불필요한 데이터의 양을 줄인 데서 비롯됩니다. 스캔 결과는 압축 및 구현 방식의 선택에 기인합니다.</p>
<p>이 수치들은 다음 설정 조건에 따라 해석되어야 합니다: 8 vCPU Ubuntu 22.04 KVM, 로컬 파일 시스템, 파일 1개, 40,000행, 1 MB 행 그룹, 그리고 위의 스키마. 오브젝트 스토리지에서는 네트워크 I/O가 주된 요인이 될 수 있으므로, 읽기 증폭을 줄이는 것이 더욱 중요할 수 있습니다. 실제 결과는 데이터셋의 형태, 오브젝트 스토리지의 동작, 캐시 상태 및 쿼리 패턴에 따라 달라집니다.</p>
<p>더 넓은 관점에서 볼 때, 모든 컬럼이 Vortex를 사용해야 한다는 뜻은 아닙니다.</p>
<p>핵심은 벡터 데이터셋의 경우 ColumnGroup 수준에서 파일 형식을 선택해야 한다는 점입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">설계 2: 행 ID를 통해 물리적 파일 정렬<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>하이브리드 파일 형식은 한 가지 문제를 해결합니다. 즉, 서로 다른 열을 각 열에 가장 적합한 형식으로 저장할 수 있게 된 것입니다.</p>
<p>하지만 이로 인해 두 번째 문제가 발생합니다. 스칼라 필드가 Parquet에, 벡터가 Vortex에, 원시 객체가 오브젝트 스토리지에 저장된다면, 시스템은 어떻게 이들을 하나의 컬렉션으로 처리할 수 있을까요?</p>
<p><strong>Loon은 행 ID 정렬을 통해 이 문제를 해결합니다.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">행 ID는 스토리지 계층의 좌표계입니다</h3><p>각 물리적 ColumnGroupFile은 파일 경로와 해당 파일이 포함하는 행 ID 범위를 기록합니다:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>서로 다른 ColumnGroup이 서로 다른 파일과 형식에 저장되어 있더라도 동일한 행 ID 범위를 포함할 수 있습니다.</p>
<p>행 ID <code translate="no">12345</code> 의 경우, 스칼라 메타데이터는 Parquet ColumnGroup에, 임베딩은 Vortex ColumnGroup에, 원시 비디오는 오브젝트 스토리지 참조로 표현될 수 있습니다. 논리적으로는 여전히 하나의 행입니다. 이를 통해 스토리지 계층에 안정적인 좌표계가 제공됩니다.</p>
<p>행 ID는 비즈니스 기본 키가 아닙니다. 이는 Loon이 컬렉션을 논리적으로 재구성할 수 있는 능력을 잃지 않으면서 물리적으로 분할할 수 있게 해주는 스토리지 계층의 좌표계입니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">새 컬럼을 추가할 때 기존 컬럼을 다시 작성할 필요는 없습니다</h3><p><code translate="no">embedding_v2</code> 를 추가할 때 기존 캡션, 메타데이터 또는 <code translate="no">embedding_v1</code> ColumnGroup을 다시 작성할 필요가 없습니다. Loon은 새로운 벡터 ColumnGroup을 작성하고, 해당 ColumnGroup이 포함하는 행 ID 범위를 기록한 다음, 매니페스트(Manifest)를 통해 해당 변경 사항을 커밋할 수 있습니다.</p>
<p>이는 스파스 벡터, 재순위 지정된 특징 또는 나중에 추가되는 기타 파생 필드에도 동일하게 적용됩니다.</p>
<p>새로운 ColumnGroup이 올바른 행 ID 범위를 포함하는 한, 관련 없는 데이터를 강제로 이동시키지 않고도 동일한 논리적 컬렉션에 합류할 수 있습니다.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">삭제 및 압축을 더 정확하게 수행할 수 있습니다.</h3><p>행 ID 정렬은 삭제 작업에도 도움이 됩니다.</p>
<p>삭제는 먼저 삭제 로그를 통해 표현될 수 있습니다. 행은 논리적 수준에서 보이지 않게 되지만, 물리적 정리는 압축이 이루어질 때까지 지연됩니다. 결국 압축이 실행될 때, 영향을 받는 행에 연결된 모든 ColumnGroup을 항상 다시 쓸 필요는 없습니다. 정리가 필요한 ColumnGroup에만 집중할 수 있습니다.</p>
<p>이는 모든 열이 동일한 비용 프로필을 갖는 것은 아니기 때문에 중요합니다. 짧은 스칼라 ColumnGroup을 다시 쓰는 것은 수백 기가바이트에 달하는 고밀도 벡터를 다시 쓰는 것과는 매우 다릅니다.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">하이브리드 검색은 필요한 열만 가져올 수 있습니다</h3><p>행 ID 정렬은 하이브리드 파일 형식 위에서 하이브리드 검색을 실용적으로 만드는 요소이기도 합니다.</p>
<p>ANN 검색이 후보 행 ID를 반환한 후, 시스템은 최종 결과에 필요한 필드(캡션, 메타데이터, 벡터, 재순위 지정 특징 또는 객체 참조)만 가져올 수 있습니다.</p>
<p>예를 들어, 쿼리에는 다음이 필요할 수 있습니다.</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>이러한 필드들은 서로 다른 ColumnGroup에 존재할 수 있습니다. Loon은 행 ID 범위를 통해 관련 파일을 찾아내고, 필요한 바이트 범위를 읽은 뒤 결과를 조합할 수 있습니다.</p>
<p>행 ID 정렬이 없다면, 하이브리드 형식은 단순히 나란히 놓인 별도의 파일들에 불과할 것입니다. 행 ID 정렬을 통해 이들은 하나의 논리적 컬렉션처럼 작동합니다.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader는 상위 계층에서 분할을 숨깁니다</h3><p>이를 사용할 수 있게 해주는 런타임 구성 요소는 Packed Reader입니다.</p>
<p>상위 계층에서는 통합된 Arrow RecordBatch 스트림만 볼 수 있습니다. 내부적으로는 데이터가 서로 다른 파일 형식의 여러 ColumnGroup에서 제공될 수 있습니다. Packed Reader는 이러한 차이점을 숨기고, 행 ID 범위에 따라 데이터를 정렬하며, 메모리 사용량을 제어하면서 다중 파일 I/O를 스케줄링합니다.</p>
<p>또한 행 ID를 기반으로 한 직접적인 <code translate="no">take</code> 도 지원합니다. 주어진 행 ID 집합을 바탕으로 관련 ColumnGroupFiles를 찾아내고, 범위 읽기를 실행한 후 요청된 필드를 반환합니다.</p>
<p>비디오 워크플로우의 경우, ANN 쿼리에서 스칼라 열 그룹( <code translate="no">caption</code>), 벡터 열 그룹( <code translate="no">embedding</code>), 행 기반 열 그룹( <code translate="no">video_uri</code>)이 필요할 수 있습니다. Packed Reader는 관련 없는 열을 건드리지 않고 스칼라 열 그룹과 벡터 열 그룹을 가져올 수 있습니다.</p>
<p>이것이 바로 “별도의 파일”과 “여러 물리적 레이아웃을 가진 테이블”의 차이점입니다.</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">설계 3: 매니페스트를 신뢰할 수 있는 정보의 원천으로 삼기<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>하이브리드 파일 형식은 데이터가 물리적으로 어떻게 저장되는지를 정의합니다. 행 ID 정렬은 분리된 ColumnGroup들이 어떻게 하나의 논리적 테이블을 형성하는지를 결정합니다. 하지만 시스템은 여전히 더 큰 질문에 답해야 합니다. <strong>어떤 파일, 로그, 통계, 인덱스 및 객체 참조가 데이터셋의 현재 버전에 속하는가? 이것이 바로 매니페스트의 역할입니다.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">오브젝트 스토리지 디렉토리만으로는 부족하다</h3><p>객체 스토리지는 데이터베이스 카탈로그가 아닙니다. 디렉토리에는 오래된 파일, 새로운 파일, 실패한 작업의 출력 결과, 임시 파일, 삭제 로그, 이전 스냅샷에서 여전히 참조되는 파일, 그리고 정리를 기다리는 파일 등이 포함될 수 있습니다. 파일이 존재한다고 해서 그것이 현재 데이터셋 버전에 속한다는 의미는 아닙니다.</p>
<p>Loon 데이터셋은 다음과 같은 디렉터리로 구성될 수 있습니다:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>그러나 디렉터리 구조가 절대적인 기준이 아닙니다. 매니페스트가 바로 그 기준입니다. 사용자는 디렉터리를 나열하고 우연히 존재하는 파일들을 바탕으로 상태를 추론해서는 안 됩니다. 대신 현재 매니페스트를 읽고, 매니페스트가 선언하는 버전별 뷰를 따라야 합니다.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">매니페스트는 데이터셋의 하나의 버전별 보기를 정의합니다</h3><p>매니페스트는 특정 버전의 데이터셋을 정의합니다. 여기에는 다음 사항이 기록됩니다:</p>
<ul>
<li>어떤 ColumnGroups가 존재하는지</li>
<li>각 ColumnGroup이 어떤 행 ID 범위를 포함하는지</li>
<li>각 ColumnGroup이 사용하는 물리적 형식</li>
<li>파일이 저장된 위치</li>
<li>활성 상태인 삭제 로그</li>
<li>사용 가능한 통계는 무엇인가</li>
<li>어떤 인덱스가 존재하는지</li>
<li>참조되는 외부 BLOB</li>
<li>해당 통계나 인덱스가 어떤 열과 행 범위를 포함하는지</li>
</ul>
<p>각 업데이트 시마다 새로운 매니페스트 버전이 작성됩니다. 버전 N을 여는 읽기 사용자는 버전 N 시점의 데이터셋에 대한 안정적인 뷰를 확인합니다. 쓰기 사용자는 여전히 버전 N을 사용 중인 읽기 사용자에게 영향을 주지 않고 버전 N+1을 준비할 수 있습니다.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">매니페스트는 테이블 파일 이상의 정보를 추적합니다</h3><p>Loon에서 매니페스트 본문은 Apache Avro로 인코딩되며 네 가지 주요 섹션으로 구성됩니다.</p>
<ul>
<li>ColumnGroups는 열, 형식, 파일 및 행 ID 범위를 설명합니다.</li>
<li>DeltaLogs는 삭제를 설명합니다. 다양한 삭제 유형은 클라이언트의 기본 키 삭제, 내부 압축의 위치 기반 삭제, 외부 엔진의 등가성 삭제 등 서로 다른 변경 원인을 다룹니다.</li>
<li>Stats에는 블룸 필터, BM25 통계, 최소/최대 값과 같은 계획 메타데이터가 포함됩니다.</li>
<li>Indexes는 인덱스 유형, 매개 변수, 대상 열 및 행 ID 범위를 설명합니다. 여기에는 HNSW 또는 IVF와 같은 벡터 인덱스, 텍스트 인덱스, 역인덱스, 비트맵 인덱스 및 관련 구조가 포함될 수 있습니다.</li>
</ul>
<p>이 부분이 바로 Loon이 기존의 테이블 매니페스트와 다른 점입니다.</p>
<p>벡터 데이터셋은 데이터 파일과 파티션뿐만 아니라 벡터 인덱스, 텍스트 인덱스, 스파스 피처, 삭제 로그, 통계, 외부 객체 참조 및 이를 연결하는 행 ID 범위도 추적해야 합니다.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">매니페스트는 데이터베이스 이외의 주체도 작성할 수 있어야 합니다.</h3><p>가장 중요한 점은 매니페스트에 무엇이 포함되어 있는지가 아닙니다. 누가 이를 작성할 수 있는지가 핵심입니다.</p>
<ul>
<li>만약 데이터베이스만이 매니페스트를 작성할 수 있다면, 이는 내부 메타데이터로 남게 됩니다. 더 깔끔한 메타데이터이긴 하지만, 여전히 하나의 엔진에만 국한된 사적인 정보일 뿐입니다.</li>
<li>외부 엔진이 새로운 ColumnGroup, 통계, 매니페스트 항목을 생성할 수 있다면, 매니페스트는 조정 인터페이스가 됩니다.</li>
<li>예를 들어, Spark 작업은 스파스 벡터 컬럼을 백필할 수 있습니다. 이 작업은 새로운 ColumnGroup을 작성하고, 행 커버리지와 통계를 기록한 뒤, 새로운 매니페스트를 커밋합니다. 온라인 쿼리는 작업이 진행되는 동안에도 이전 버전을 계속 읽을 수 있습니다. 커밋이 성공하면 새로운 버전이 표시됩니다.</li>
</ul>
<p>이는 Iceberg나 Delta Lake와 취지가 유사하지만, 객체 모델은 더 광범위합니다. 벡터 데이터셋은 단순히 테이블 파일과 파티션뿐만 아니라 벡터 인덱스, 텍스트 인덱스, 스파스 특징, 삭제 로그, 통계, BLOB 참조, 행 ID 범위까지 추적해야 합니다.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">낙관적 커밋은 버전 업데이트를 단순하게 유지합니다</h3><p>각 커밋은 새로운 매니페스트 버전을 작성합니다. 작성자는 버전 N을 기반으로 새로운 콘텐츠를 생성한 다음, ` <code translate="no">manifest-{N+1}.avro</code>`을 작성하려고 시도할 수 있습니다. 객체 스토리지의 조건부 쓰기 또는 세대 일치(generation-match) 세미언틱에 따라 해당 버전이 이미 존재하는 경우 커밋이 실패할 수 있습니다. 그러면 작성자는 더 새로운 버전을 대상으로 재시도할 수 있습니다.</p>
<p>이를 통해 Loon은 모든 업데이트를 무겁고 강력한 일관성을 요구하는 조정 경로를 거치도록 강요하지 않으면서도 낙관적 동시성을 확보할 수 있습니다. 매니페스트가 없다면, 다중 형식 및 다중 엔진 스토리지는 결국 명명 규칙과 수동 조정으로 귀결됩니다. 이는 소규모 데이터 세트에서는 작동할 수 있지만, 테라바이트(TB) 규모의 벡터 데이터에는 적용되지 않습니다.</p>
<p>매니페스트는 이종 파일을 여러 시스템이 안전하게 읽고 업데이트할 수 있는 데이터셋으로 변환해 줍니다.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">저장소가 버전 관리 방식으로 전환되면 사용자에게 어떤 변화가 생길까요?<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>애플리케이션 개발자에게 Loon은 새로운 API 부담이 되어서는 안 됩니다.</p>
<p>사용자는 여전히 컬렉션, 삽입, 검색, 하이브리드 검색과 같은 익숙한 Milvus 개념을 그대로 활용해야 합니다. 일반적인 애플리케이션 개발 과정에서 매니페스트 파일, ColumnGroups, 행 ID 범위, 파일 레이아웃 등에 대해 신경 쓸 필요가 없어야 합니다.</p>
<p>변화는 내부적으로 일어납니다. 스토리지는 AI 데이터셋이 실제로 어떻게 진화하는지를 더 잘 인식하게 됩니다.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">새로운 임베딩을 추가한다고 해서 기존 데이터가 이동해서는 안 됩니다.</h3><p>이전에는 기존 컬렉션에 ‘ <code translate="no">embedding_v2</code> ’를 추가하려면 데이터를 내보내고, 새 모델을 훈련하고, 벡터를 생성한 다음, SDK를 통해 컬렉션을 다시 가져오거나 일괄 업데이트해야 하는 경우가 많았습니다. 이러한 과정은 버전 추적, 실패한 작업 재시도, 인덱스 재구축, 서비스 운영에 미치는 영향, 일관성 검사 등 많은 운영 작업을 수반합니다.</p>
<p><strong>Loon을 사용하면 이 과정을 스키마 진화와 새로운 ColumnGroup 커밋으로 처리할 수 있습니다.</strong> 새로운 임베딩 컬럼은 별도의 물리적 ColumnGroup으로 작성되고, 행 ID에 맞춰 정렬되며, 매니페스트를 통해 노출될 수 있습니다. 기존 캡션 컬럼, 스칼라 메타데이터 컬럼, 그리고 원래의 임베딩 컬럼은 이동할 필요가 없습니다.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">백필(backfill)에는 클라이언트 측 업데이트 루프가 필요하지 않아야 합니다</h3><p>많은 AI 데이터 업데이트는 백필(backfill) 형태입니다. 팀은 하이브리드 검색이 중요해지면 스파스 벡터를 추가할 수 있습니다. 새로운 모델이 훈련된 후에는 재순위 지정(rerank) 특징을 추가할 수도 있습니다. 사람이 검토한 후 캡션을 수정할 수도 있습니다. 정책 업데이트 후 거버넌스 태그를 추가할 수도 있습니다.</p>
<p>기존 구조에서는 데이터가 Spark, Ray 또는 다른 외부 엔진에서 생성된 경우라도 이러한 변경 사항이 클라이언트 SDK 업데이트나 데이터베이스 전용 쓰기 경로를 통해 이루어지는 경우가 많습니다.</p>
<p>Loon을 사용하면 외부 컴퓨팅 시스템에서 새로운 ColumnGroup을 생성하고 매니페스트(Manifest)를 통해 커밋할 수 있습니다. 이제 데이터베이스가 모든 재작성의 유일한 진입점이 될 필요가 없습니다.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">오프라인 분석에 별도의 ‘진실’ 데이터 사본이 필요하지 않아야 합니다</h3><p>이전에는 팀들이 오프라인 평가나 분석을 위해 온라인 컬렉션을 Parquet로 내보내는 경우가 많았습니다. 이로 인해 동일한 데이터셋에 대해 온라인 컬렉션과 분석용 사본이라는 두 가지 버전이 생성됩니다. 캡션이 수정되거나, 임베딩이 재생성되거나, 삭제 로그가 적용되거나, 인덱스가 재구축되면 팀은 어느 사본이 최신 버전인지 확인해야 합니다.</p>
<p>매니페스트 기반 스토리지 모델을 사용하면, 분석 엔진은 서빙 시스템과 동일한 버전 관리된 데이터셋 뷰를 읽을 수 있습니다. 분석 엔진은 필요한 열만 추출하고, 관련 행 범위만 스캔하며, 수동으로 내보낸 스냅샷 대신 선언된 데이터셋 버전을 기반으로 작업할 수 있습니다.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">삭제 및 수정 작업은 변경된 부분에만 적용되어야 합니다</h3><p>삭제, 캡션 수정, 레이블 수정, 거버넌스 업데이트는 AI 데이터셋에서 일상적으로 발생하는 작업입니다. 이러한 작업으로 인해 모든 긴 벡터 열이 동일한 재작성 경로를 거치도록 강제해서는 안 됩니다.</p>
<p>Loon을 사용하면 로그 삭제를 먼저 논리적 삭제로 처리할 수 있습니다. 이후 압축 과정을 통해 관련 없는 데이터를 다시 쓰지 않고도 영향을 받은 ColumnGroups만 정리할 수 있습니다. 짧은 텍스트 필드가 변경되더라도, 단순히 동일한 논리적 행을 공유한다는 이유만으로 스토리지 계층이 수백 기가바이트에 달하는 고밀도 벡터를 다시 쓸 필요는 없습니다.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">외부 엔진은 탈출구가 아닌 워크플로우의 일부가 됩니다</h3><p>더 큰 변화는 외부 엔진이 더 이상 벡터 데이터베이스 외부의 시스템으로 취급되지 않는다는 점입니다.</p>
<p>Spark, Ray, 평가 작업, 라벨링 시스템, 거버넌스 파이프라인은 이미 데이터의 상당 부분을 생성하고 수정합니다. 스토리지 계층은 이러한 요소들이 끊임없이 데이터를 내보내고, 복사하고, 다시 가져오는 대신 단일 신뢰 소스를 중심으로 협업할 수 있도록 지원해야 합니다.</p>
<p>이것이 바로 Manifest의 한 버전이 가능하게 하는 것입니다. 이 버전은 온라인 서비스, 오프라인 분석, 백필 작업, 압축 작업에 데이터셋에 대한 공유된 뷰를 제공합니다.</p>
<p>이것들은 내부 스토리지의 세부 사항처럼 들릴 수 있지만, 팀이 AI 데이터셋을 얼마나 빠르게 반복 개선할 수 있는지에 영향을 미칩니다. 모든 모델 변경, 특징 백필, 캡션 수정, 품질 필터, 인덱스 재구축은 모두 동일한 질문에 달려 있습니다.<strong>“시스템이 이동할 필요가 없는 데이터를 이동하지 않고도 데이터셋을 업데이트할 수 있는가?”</strong></p>
<p>이것이 바로 이 스토리지 모델이 제공하는 실질적인 가치입니다.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon은 Milvus 3.0 베타 및 Zilliz Vector Lakebase에서 사용할 수 있습니다<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon은 <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 베타</a> 버전에서 사용할 수 있으며, Zilliz Cloud의 차세대 버전인 <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase의</a> 스토리지 계층에도 포함되어 있습니다. 또한 이번 릴리스는 다음 세 가지 핵심 영역에 중점을 둡니다:</p>
<ul>
<li><strong>매니페스트(Manifest).</strong> 목표는 쓰기, 백필(backfill), 삭제, 통계 및 인덱스 업데이트를 통해 리더가 일관되게 열 수 있는 버전 관리된 데이터셋 뷰를 생성하는 것입니다. 읽기 측의 경우, 쿼리를 통해 특정 Manifest 버전을 열어 데이터셋의 안정적인 뷰를 확인할 수 있습니다. 쓰기 측의 경우, 새로운 데이터 파일, 삭제 로그, 통계 또는 인덱스 파일을 먼저 준비한 후, 버전 관리된 커밋을 통해 이를 공개할 수 있습니다.</li>
<li><strong>ColumnGroup 및 형식 지원.</strong> Parquet은 스칼라 및 생태계 친화적인 컬럼을 지원합니다. Vortex는 벡터 중심 액세스 패턴을 지원합니다. Lance는 기존 Lance 데이터셋과의 호환성을 위해 읽기 전용 모드로 통합될 수 있습니다.</li>
<li><strong>Lake의 인덱스.</strong> 스칼라 통계, 필터링 인덱스 및 텍스트 역인덱스는 행 범위별 매니페스트 기반 계획 수립에 참여할 수 있습니다. Lake 고유의 벡터 인덱스는 더 복잡한 과정을 거칩니다. HNSW와 IVF는 오브젝트 스토리지에서 서로 다른 동작을 보이며, 특히 HNSW는 랜덤 액세스 및 캐시 국소성에 민감합니다. 로컬 SSD용으로 설계된 레이아웃을 단순히 재사용한다고 해서 동일한 결과를 기대할 수는 없습니다.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">아직 해결해야 할 과제가 남아 있습니다</h3><ul>
<li><strong>외부 쓰기 경로는</strong> 중요합니다. Spark와 Ray가 모든 백필을 클라이언트 SDK 루프를 통해 강제로 처리하지 않고도 ColumnGroups 및 매니페스트 커밋을 생성할 수 있어야 하기 때문입니다.</li>
<li><strong>Lakehouse 상호 운용성이</strong> 중요한 이유는 많은 팀이 이미 <strong>Iceberg, Delta Lake, Trino, DuckDB, Athena와</strong> 같은 카탈로그 및 쿼리 엔진을 사용하고 <strong>있기 때문입니다.</strong> 벡터 데이터는 벡터 검색 성능을 저하시키지 않으면서도 해당 생태계에 참여할 수 있어야 합니다.</li>
<li><strong>인덱스 레이아웃이</strong> 중요한 이유는 그래프 인덱스와 역인덱스 구조가 오브젝트 스토리지에서 서로 다른 액세스 패턴을 보이기 때문입니다.</li>
<li><strong>대용량 객체(Large-object)의 의미론이</strong> 중요한 이유는, 원본 동영상, PDF, 이미지 및 오디오 파일에는 파생된 벡터 데이터셋과 일치하는 참조 관리, 버전 관리 및 삭제 동작이 필요하기 때문입니다.</li>
</ul>
<p>정확한 릴리스 방식, 기본 설정 및 마이그레이션 경로는 관련 Milvus 및 <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud 릴리스 노트를</a> 따라야 합니다. 그러나 스토리지 방향은 분명합니다. 벡터 데이터베이스에는 서빙 계층 아래에 버전 관리가 가능하고 레이크(lake)에 최적화된 기반이 필요합니다.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Zilliz Vector Lakebase에서 Loon을 사용해 보세요<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>현재 사용 중인 스택에서 온라인 서빙, 오프라인 분석, 백필(backfill), 외부 데이터 레이크 워크플로우가 서로 다른 시스템으로 분리되어 있다면, Zilliz Vector Lakebase를 살펴볼 가치가 있습니다. <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>에서 직접 체험해 보실 수 있습니다. 업무용 이메일로 신규 가입 시 100달러 상당의 무료 크레딧을 드립니다. 또한 귀하의 사용 사례에 대해 <a href="https://zilliz.com/contact-sales">저희와 상담해</a> 주셔도 좋습니다.</p>
<p>또한 <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 릴리스</a> 를 팔로우하여 오픈소스 엔진에서 Loon이 어떻게 진화하는지 확인해 보실 수 있습니다.</p>
<p><strong>Zilliz Vector Lakebase는 다음 기능을 통합합니다:</strong></p>
<ul>
<li>다양한 실시간 성능 및 비용 절충점을 위한 계층형 서비스</li>
<li>상시 가동 컴퓨팅 없이도 대규모 또는 탐색적 워크로드를 위한 온디맨드 검색</li>
<li>외부 데이터 레이크 검색 기능을 통해 기존 레이크 데이터에 직접 인덱싱 및 검색이 가능합니다</li>
<li>벡터, 텍스트, JSON 및 지리 공간 데이터를 아우르는 전 영역 검색 기능과 하이브리드 검색 결과 추출 및 재순위 지정</li>
<li>벡터 데이터 비중이 높은 데이터에 대해 더 빠르고 비용 효율적인 무작위 읽기를 위해 설계된 개방형 포맷인 Vortex를 기반으로 구축된 통합 레이크 네이티브 스토리지</li>
</ul>
