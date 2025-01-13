---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: 밀밀 밀버스에 대한 질문에 답변하는 밀버스 기반 FAQ 챗봇
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: 오픈 소스 벡터 검색 도구를 사용하여 질문 답변 서비스를 구축합니다.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Milvus에 대한 질문에 답변하는 Milvus 기반 FAQ 챗봇</custom-h1><p>오픈소스 커뮤니티는 최근 Milvus 사용자에 의해, 그리고 Milvus 사용자를 위해 구축된 Milvus FAQ 챗봇인 MilMil을 만들었습니다. MilMil은 세계에서 가장 진보된 오픈 소스 벡터 데이터베이스인 Milvus에 대한 일반적인 질문에 답변하기 위해 <a href="https://milvus.io/">Milvus.io에서</a> 연중무휴 24시간 이용 가능합니다.</p>
<p>이 질문 답변 시스템은 Milvus 사용자가 직면하는 일반적인 문제를 보다 신속하게 해결하는 데 도움이 될 뿐만 아니라 사용자 제출을 기반으로 새로운 문제도 식별합니다. MilMil의 데이터베이스에는 2019년 프로젝트가 오픈 소스 라이선스로 처음 공개된 이후 사용자가 제기한 질문이 포함되어 있습니다. 질문은 Milvus 1.x 및 이전 버전과 Milvus 2.0의 두 가지 컬렉션에 저장됩니다.</p>
<p>MilMil은 현재 영어로만 제공됩니다.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">MilMil은 어떻게 작동하나요?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil은 <em>문장 변환기/파라프레이즈-mpnet-base-v2</em> 모델을 사용하여 FAQ 데이터베이스의 벡터 표현을 얻은 다음, Milvus를 사용하여 의미적으로 유사한 질문을 반환하는 벡터 유사성 검색에 사용합니다.</p>
<p>먼저 자연어 처리(NLP) 모델인 BERT를 사용하여 FAQ 데이터를 시맨틱 벡터로 변환합니다. 그런 다음 임베딩을 Milvus에 삽입하고 각 임베딩에 고유 ID를 할당합니다. 마지막으로, 질문과 답변이 벡터 ID와 함께 관계형 데이터베이스인 PostgreSQL에 삽입됩니다.</p>
<p>사용자가 질문을 제출하면 시스템은 BERT를 사용하여 이를 특징 벡터로 변환합니다. 그런 다음 Milvus에서 쿼리 벡터와 가장 유사한 5개의 벡터를 검색하고 해당 벡터의 ID를 검색합니다. 마지막으로 검색된 벡터 ID에 해당하는 질문과 답변이 사용자에게 반환됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>시스템 프로세스.png</span> </span></p>
<p>Milvus 부트캠프의 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">질문 답변 시스템</a> 프로젝트를 참조하여 AI 챗봇을 구축하는 데 사용되는 코드를 살펴보세요.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">MilMil에게 Milvus에 대해 질문하기<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil과 채팅하려면 <a href="https://milvus.io/">Milvus.io의</a> 페이지로 이동하여 오른쪽 하단에 있는 새 아이콘을 클릭합니다. 텍스트 입력 상자에 질문을 입력하고 보내기를 누르세요. MilMil에서 몇 밀리초 안에 답변을 보내드립니다! 또한 왼쪽 상단 모서리에 있는 드롭다운 목록을 사용하여 Milvus의 다른 버전에 대한 기술 문서 사이를 전환할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>밀버스-챗봇 아이콘.png</span> </span></p>
<p>질문을 제출하면 챗봇이 해당 질문과 의미적으로 유사한 질문 세 개를 즉시 반환합니다. "답변 보기"를 클릭하여 질문에 대한 잠재적인 답변을 찾아보거나 "더보기"를 클릭하여 검색과 관련된 더 많은 질문을 볼 수 있습니다. 적절한 답변을 찾을 수 없는 경우 "여기에 피드백 입력"을 클릭하여 이메일 주소와 함께 질문을 남기세요. Milvus 커뮤니티의 도움이 곧 도착할 것입니다!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>MilMil을 사용해 보시고 의견을 알려주세요. 모든 질문, 의견 또는 모든 형태의 피드백을 환영합니다.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
