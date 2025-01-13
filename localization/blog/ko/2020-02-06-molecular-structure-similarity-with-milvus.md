---
id: molecular-structure-similarity-with-milvus.md
title: 소개
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Milvus에서 분자 구조 유사성 분석을 실행하는 방법
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>신약 개발 가속화</custom-h1><h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>의약품 혁신의 원천인 신약 개발은 신약 연구 및 개발의 중요한 부분입니다. 신약 개발은 표적 선택과 확인을 통해 이루어집니다. 단편 또는 선도 화합물이 발견되면 일반적으로 내부 또는 상용 화합물 라이브러리에서 유사한 화합물을 검색하여 구조-활성 관계(SAR), 화합물 가용성을 발견하고 선도 화합물이 후보 화합물에 최적화될 수 있는 가능성을 평가합니다.</p>
<p>수십억 개의 화합물 라이브러리에서 조각 공간에서 사용 가능한 화합물을 발견하기 위해 일반적으로 하위 구조 검색 및 유사성 검색을 위해 화학 지문을 검색합니다. 그러나 기존 솔루션은 수십억 개 규모의 고차원 화학 지문에 대해 시간이 오래 걸리고 오류가 발생하기 쉽습니다. 또한 이 과정에서 일부 잠재적인 화합물이 손실될 수도 있습니다. 이 글에서는 대규모 벡터를 위한 유사성 검색 엔진인 Milvus를 RDKit과 함께 사용하여 고성능 화학 구조 유사성 검색을 위한 시스템을 구축하는 방법에 대해 설명합니다.</p>
<p>기존 방식에 비해 Milvus는 검색 속도가 빠르고 범위가 더 넓습니다. 밀버스는 화학 지문을 처리함으로써 화학 구조 라이브러리에서 하위 구조 검색, 유사성 검색, 정확한 검색을 수행하여 잠재적으로 사용 가능한 의약품을 발견할 수 있습니다.</p>
<h2 id="System-overview" class="common-anchor-header">시스템 개요<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>이 시스템은 RDKit을 사용하여 화학 지문을 생성하고 Milvus를 사용하여 화학 구조 유사성 검색을 수행합니다. 시스템에 대한 자세한 내용은 https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search 을 참조하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. 화학 지문 생성하기<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>화학적 지문은 일반적으로 하위 구조 검색과 유사도 검색에 사용됩니다. 다음 이미지는 비트로 표시된 순차적 목록을 보여줍니다. 각 숫자는 원소, 원자 쌍 또는 작용기를 나타냅니다. 화학 구조는 <code translate="no">C1C(=O)NCO1</code> 입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-식별-패턴-분자.png</span> </span></p>
<p>특정 원자로부터 반경을 정의하고 반경 범위 내에 있는 화학 구조의 수를 계산하여 화학 지문을 생성하는 모건 지문을 생성하기 위해 RDKit을 사용할 수 있습니다. 반경과 비트의 값을 다르게 지정하여 다양한 화학 구조의 화학 지문을 획득할 수 있습니다. 화학 구조는 스마일 형식으로 표시됩니다.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. 화학 구조 검색하기<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 모건 지문을 Milvus로 가져와서 화학 구조 데이터베이스를 구축할 수 있습니다. 다양한 화학 지문을 통해 Milvus는 하위 구조 검색, 유사성 검색, 정확도 검색을 수행할 수 있습니다.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">하위 구조 검색</h3><p>화학 구조에 다른 화학 구조가 포함되어 있는지 확인합니다.</p>
<h3 id="Similarity-search" class="common-anchor-header">유사도 검색</h3><p>유사한 화학 구조를 검색합니다. 기본적으로 타니모토 거리가 메트릭으로 사용됩니다.</p>
<h3 id="Exact-search" class="common-anchor-header">정확히 검색</h3><p>지정된 화학 구조가 존재하는지 여부를 확인합니다. 이러한 종류의 검색은 정확히 일치해야 합니다.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">화학적 지문 계산<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>타니모토 거리는 종종 화학 지문의 지표로 사용됩니다. Milvus에서는 자카드 거리가 타니모토 거리에 해당합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-컴퓨팅-화학-핑거프린트-표-1.png</span> </span></p>
<p>이전 매개변수를 기반으로 화학 지문 계산은 다음과 같이 설명할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p><code translate="no">1- Jaccard = Tanimoto</code> 을 볼 수 있습니다. 여기서는 Milvus의 Jaccard를 사용하여 화학 지문을 계산하는데, 이는 실제로 타니모토 거리와 일치합니다.</p>
<h2 id="System-demo" class="common-anchor-header">시스템 데모<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>시스템의 작동 방식을 더 잘 보여드리기 위해 Milvus를 사용하여 9천만 개 이상의 화학 지문을 검색하는 데모를 만들었습니다. 사용된 데이터는 ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF 에서 가져왔습니다. 초기 인터페이스는 다음과 같습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>시스템에서 지정된 화학 구조를 검색하고 유사한 화학 구조를 반환할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
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
    </button></h2><p>유사도 검색은 이미지와 동영상 등 여러 분야에서 없어서는 안 될 필수 요소입니다. 신약 개발의 경우, 유사도 검색을 화학 구조 데이터베이스에 적용하여 잠재적으로 사용 가능한 화합물을 발견한 다음 실제 합성 및 현장 테스트를 위한 시드로 변환할 수 있습니다. 대규모 피처 벡터를 위한 오픈 소스 유사도 검색 엔진인 Milvus는 최고의 비용 효율성을 위해 이기종 컴퓨팅 아키텍처로 구축되었습니다. 최소한의 컴퓨팅 리소스로 수십억 개 이상의 벡터를 검색하는 데 단 몇 밀리초밖에 걸리지 않습니다. 따라서 Milvus는 생물학, 화학 등의 분야에서 정확하고 빠른 화학 구조 검색을 구현하는 데 도움을 줄 수 있습니다.</p>
<p>http://40.117.75.127:8002/ 에서 데모에 액세스하실 수 있으며, 자세한 내용은 GitHub https://github.com/milvus-io/milvus 를 방문하셔서 확인하세요!</p>
