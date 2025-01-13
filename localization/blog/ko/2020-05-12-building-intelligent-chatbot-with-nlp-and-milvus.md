---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: 전체 아키텍처
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: 차세대 QA 봇이 여기 있습니다
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>NLP와 Milvus로 지능형 QA 시스템 구축하기</custom-h1><p>Milvus 프로젝트：github.com/milvus-io/milvus</p>
<p>질문 답변 시스템은 자연어 처리 분야에서 일반적으로 사용됩니다. 자연어 형태로 질문에 답하는 데 사용되며 다양한 용도로 활용됩니다. 일반적인 애플리케이션으로는 지능형 음성 상호작용, 온라인 고객 서비스, 지식 습득, 개인화된 감성 채팅 등이 있습니다. 대부분의 질문 답변 시스템은 생성 및 검색 질문 답변 시스템, 단일 라운드 질문 답변 및 다중 라운드 질문 답변 시스템, 개방형 질문 답변 시스템, 특정 질문 답변 시스템으로 분류할 수 있습니다.</p>
<p>이 문서에서는 주로 지능형 고객 서비스 로봇이라고 하는 특정 분야를 위해 설계된 QA 시스템에 대해 다룹니다. 과거에는 고객 서비스 로봇을 구축하려면 일반적으로 도메인 지식을 일련의 규칙과 지식 그래프로 변환해야 했습니다. 이 구축 과정은 '인간'의 지능에 크게 의존합니다. 일단 장면이 바뀌면 많은 반복 작업이 필요했습니다. 자연어 처리(NLP)에 딥러닝을 적용하면 기계 독해가 문서에서 직접 일치하는 질문에 대한 답을 자동으로 찾을 수 있습니다. 딥러닝 언어 모델은 질문과 문서를 시맨틱 벡터로 변환하여 일치하는 답변을 찾습니다.</p>
<p>이 문서에서는 Google의 오픈 소스 BERT 모델과 오픈 소스 벡터 검색 엔진인 Milvus를 사용하여 의미 이해를 기반으로 Q&amp;A 봇을 빠르게 구축합니다.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">전체 아키텍처<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서는 의미 유사도 매칭을 통한 질의응답 시스템을 구현합니다. 일반적인 구축 과정은 다음과 같습니다:</p>
<ol>
<li>특정 분야의 답변이 포함된 다수의 질문(표준 질문 세트)을 확보합니다.</li>
<li>BERT 모델을 사용하여 이러한 질문을 특징 벡터로 변환하고 Milvus에 저장합니다. 그리고 Milvus는 각 특징 벡터에 벡터 ID를 동시에 할당합니다.</li>
<li>이러한 대표 질문 ID와 그에 해당하는 답변을 PostgreSQL에 저장합니다.</li>
</ol>
<p>사용자가 질문을 하면:</p>
<ol>
<li>BERT 모델은 이를 특징 벡터로 변환합니다.</li>
<li>Milvus는 유사도 검색을 수행하여 질문과 가장 유사한 ID를 검색합니다.</li>
<li>PostgreSQL은 해당 답변을 반환합니다.</li>
</ol>
<p>시스템 아키텍처 다이어그램은 다음과 같습니다(파란색 선은 가져오기 프로세스를, 노란색 선은 쿼리 프로세스를 나타냄):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-시스템 아키텍처-밀버스-버트-포스트그레스큐엘.png</span> </span></p>
<p>다음은 온라인 Q&amp;A 시스템을 구축하는 방법을 단계별로 보여드리겠습니다.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Q&amp;A 시스템 구축 단계<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>시작하기 전에 Milvus와 PostgreSQL을 설치해야 합니다. 구체적인 설치 단계는 Milvus 공식 홈페이지를 참조하세요.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. 데이터 준비</h3><p>이 문서의 실험 데이터 출처: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>이 데이터 세트에는 보험 업계와 관련된 질문과 답변 데이터 쌍이 포함되어 있습니다. 이 글에서는 이 데이터에서 20,000개의 질문과 답변 쌍을 추출합니다. 이 질문과 답변 데이터 세트를 통해 보험 업계용 고객 서비스 로봇을 빠르게 구축할 수 있습니다.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. 특징 벡터 생성</h3><p>이 시스템은 BERT가 사전 학습한 모델을 사용합니다. 서비스를 시작하기 전에 아래 링크에서 다운로드하세요: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>이 모델을 사용하여 질문 데이터베이스를 향후 유사도 검색을 위한 특징 벡터로 변환합니다. BERT 서비스에 대한 자세한 내용은 https://github.com/hanxiao/bert-as-service 을 참조하세요.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Milvus 및 PostgreSQL로 가져오기</h3><p>생성된 특징 벡터를 정규화하여 Milvus로 가져온 다음, Milvus에서 반환한 ID와 그에 해당하는 답변을 PostgreSQL로 가져옵니다. 다음은 PostgreSQL의 테이블 구조를 보여줍니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. 답변 검색</h3><p>사용자가 질문을 입력하면 BERT를 통해 특징 벡터를 생성한 후 Milvus 라이브러리에서 가장 유사한 질문을 찾을 수 있습니다. 이 문서에서는 코사인 거리를 사용하여 두 문장 간의 유사도를 나타냅니다. 모든 벡터는 정규화되어 있기 때문에 두 특징 벡터의 코사인 거리가 1에 가까울수록 유사도가 높아집니다.</p>
<p>실제로는 시스템이 라이브러리에서 완벽하게 일치하는 문제를 찾지 못할 수도 있습니다. 그런 경우 임계값을 0.9로 설정할 수 있습니다. 검색된 최대 유사도 거리가 이 임계값보다 작으면 시스템에서 관련 문제가 포함되지 않았다는 메시지를 표시합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answer.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">시스템 데모<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 시스템의 인터페이스 예시입니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-시스템-응용.png</span> </span></p>
<p>대화 상자에 질문을 입력하면 해당 답변을 받을 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-시스템-응용-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">요약<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글을 읽고 나면 자신만의 Q&amp;A 시스템을 쉽게 구축할 수 있기를 바랍니다.</p>
<p>BERT 모델을 사용하면 더 이상 텍스트 말뭉치를 미리 분류하고 정리할 필요가 없습니다. 동시에 오픈 소스 벡터 검색 엔진 Milvus의 고성능과 높은 확장성 덕분에 최대 수억 개의 텍스트로 구성된 코퍼스를 지원할 수 있는 QA 시스템을 구축할 수 있습니다.</p>
<p>Milvus는 인큐베이션을 위해 Linux AI(LF AI) 재단에 공식적으로 가입했습니다. Milvus 커뮤니티에 가입하여 저희와 함께 AI 기술 적용을 가속화하세요!</p>
<p>=&gt; 온라인 데모 체험하기: https://www.milvus.io/scenarios</p>
