---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Flask 대신 FastAPI를 선택해야 하는 이유는 무엇인가요?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: 애플리케이션 시나리오에 따라 적절한 프레임워크를 선택하세요.
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>오픈 소스 벡터 데이터베이스인 Milvus를 빠르게 시작할 수 있도록, 또 다른 제휴 오픈 소스 프로젝트인 <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp를</a> GitHub에 공개했습니다. Milvus 부트캠프는 벤치마크 테스트를 위한 스크립트와 데이터를 제공할 뿐만 아니라 역 이미지 검색 시스템, 동영상 분석 시스템, QA 챗봇 또는 추천 시스템과 같은 일부 MVP(최소기능제품)를 구축하는 데 Milvus를 사용하는 프로젝트도 포함되어 있습니다. 비정형 데이터로 가득한 세상에서 벡터 유사도 검색을 적용하는 방법을 배우고 Milvus 부트캠프에서 실습 경험을 쌓을 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>저희는 밀버스 부트캠프의 프로젝트를 위한 프론트엔드 및 백엔드 서비스를 모두 제공하고 있습니다. 그러나 최근 채택된 웹 프레임워크를 Flask에서 FastAPI로 변경하기로 결정했습니다.</p>
<p>이 글에서는 Milvus Bootcamp에 채택된 웹 프레임워크를 변경하게 된 동기를 설명하고 Flask 대신 FastAPI를 선택한 이유를 설명하고자 합니다.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">파이썬용 웹 프레임워크<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>웹 프레임워크는 패키지 또는 모듈의 집합을 의미합니다. 웹 애플리케이션이나 서비스를 작성하고 프로토콜, 소켓 또는 프로세스/스레드 관리와 같은 낮은 수준의 세부 사항을 처리하는 수고를 덜어주는 웹 개발용 소프트웨어 아키텍처 집합입니다. 웹 프레임워크를 사용하면 데이터 캐싱, 데이터베이스 액세스 및 데이터 보안 확인을 처리할 때 별도의 주의가 필요 없이 코드를 프레임워크에 '플러그인'하기만 하면 되므로 웹 애플리케이션 개발의 작업량을 크게 줄일 수 있습니다. Python용 웹 프레임워크가 무엇인지에 대한 자세한 내용은 <a href="https://wiki.python.org/moin/WebFrameworks">웹 프레임워크를</a> 참조하세요.</p>
<p>다양한 유형의 Python 웹 프레임워크가 있습니다. 주요 프레임워크에는 Django, Flask, Tornado, FastAPI 등이 있습니다.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask는</a> 파이썬용으로 설계된 경량 마이크로프레임워크로, 간단하고 사용하기 쉬운 코어를 통해 자신만의 웹 애플리케이션을 개발할 수 있습니다. 또한 플라스크 코어는 확장도 가능합니다. 따라서 Flask는 웹 애플리케이션 개발 중 개인화된 요구 사항을 충족하기 위해 다양한 기능의 온디맨드 확장을 지원합니다. 즉, Flask의 다양한 플러그인 라이브러리를 통해 강력한 웹사이트를 개발할 수 있습니다.</p>
<p>플라스크의 특징은 다음과 같습니다:</p>
<ol>
<li>Flask는 공유 기능을 제공하기 위해 타사 라이브러리의 다른 특정 도구나 구성 요소에 의존하지 않는 마이크로프레임워크입니다. Flask에는 데이터베이스 추상화 계층이 없으며 양식 유효성 검사가 필요하지 않습니다. 그러나 Flask는 확장성이 매우 뛰어나며 Flask 자체의 구현과 유사한 방식으로 애플리케이션 기능을 추가할 수 있도록 지원합니다. 관련 확장 기능으로는 객체 관계형 매퍼, 양식 유효성 검사, 업로드 처리, 개방형 인증 기술, 웹 프레임워크용으로 설계된 몇 가지 일반적인 도구 등이 있습니다.</li>
<li>Flask는 <a href="https://wsgi.readthedocs.io/">WSGI</a> (웹 서버 게이트웨이 인터페이스)를 기반으로 하는 웹 애플리케이션 프레임워크입니다. WSGI는 웹 서버와 Python 언어용으로 정의된 웹 애플리케이션 또는 프레임워크를 연결하는 간단한 인터페이스입니다.</li>
<li>Flask에는 두 가지 핵심 함수 라이브러리인 <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug와</a> <a href="https://www.palletsprojects.com/p/jinja">Jinja2가</a> 포함되어 있습니다. Werkzeug는 요청, 응답 객체 및 실용적인 함수를 구현하는 WSGI 툴킷으로, 그 위에 웹 프레임워크를 구축할 수 있습니다. Jinja2는 모든 기능을 갖춘 인기 있는 Python용 템플릿 엔진입니다. 유니코드를 완벽하게 지원하며, 선택 사항이지만 널리 채택된 통합 샌드박스 실행 환경을 제공합니다.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI는</a> Go 및 NodeJS와 동일한 수준의 고성능을 제공하는 최신 Python 웹 애플리케이션 프레임워크입니다. FastAPI의 핵심은 <a href="https://www.starlette.io/">Starlette과</a> <a href="https://pydantic-docs.helpmanual.io/">Pydantic을</a> 기반으로 합니다. Starlette는 고성능 <a href="https://docs.python.org/3/library/asyncio.html">비동기</a> 서비스를 구축하기 위한 경량 <a href="https://asgi.readthedocs.io/">ASGI</a>(비동기 서버 게이트웨이 인터페이스) 프레임워크 툴킷입니다. Pydantic은 파이썬 타입 힌트를 기반으로 데이터 유효성 검사, 직렬화, 문서화를 정의하는 라이브러리입니다.</p>
<p>FastAPI는 다음과 같은 특징이 있습니다:</p>
<ol>
<li>FastAPI는 네트워크 프로토콜 서비스와 Python 애플리케이션을 연결하는 비동기 게이트웨이 프로토콜 인터페이스인 ASGI를 기반으로 하는 웹 애플리케이션 프레임워크입니다. FastAPI는 HTTP, HTTP2, WebSocket 등 다양한 일반 프로토콜 유형을 처리할 수 있습니다.</li>
<li>FastAPI는 인터페이스 데이터 유형을 확인하는 기능을 제공하는 Pydantic을 기반으로 합니다. 인터페이스 매개변수를 추가로 확인하거나 매개변수가 비어 있는지 또는 데이터 유형이 올바른지 확인하기 위해 추가 코드를 작성할 필요가 없습니다. FastAPI를 사용하면 코드의 인적 오류를 효과적으로 방지하고 개발 효율성을 향상시킬 수 있습니다.</li>
<li>FastAPI는 <a href="https://swagger.io/specification/">OpenAPI</a> (이전의 Swagger)와 <a href="https://www.redoc.com/">Redoc의</a> 두 가지 형식의 문서를 지원합니다. 따라서 사용자는 추가 인터페이스 문서를 작성하는 데 추가 시간을 들일 필요가 없습니다. FastAPI에서 제공하는 OpenAPI 문서는 아래 스크린샷에 나와 있습니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">플라스크 대 FastAPI</h3><p>아래 표는 여러 측면에서 Flask와 FastAPI의 차이점을 보여줍니다.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>플라스크</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>인터페이스 게이트웨이</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>비동기 프레임워크</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>성능</strong></td><td>더 빠름</td><td>느림</td></tr>
<tr><td><strong>대화형 문서</strong></td><td>OpenAPI, Redoc</td><td>없음</td></tr>
<tr><td><strong>데이터 검증</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>개발 비용</strong></td><td>더 낮음</td><td>더 높음</td></tr>
<tr><td><strong>사용 편의성</strong></td><td>낮음</td><td>높음</td></tr>
<tr><td><strong>유연성</strong></td><td>덜 유연함</td><td>더 유연함</td></tr>
<tr><td><strong>커뮤니티</strong></td><td>더 작음</td><td>더 활동적</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">왜 FastAPI인가?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Bootcamp의 프로젝트에 어떤 Python 웹 애플리케이션 프레임워크를 선택할지 결정하기 전에 저희는 장고, 플라스크, FastAPI, 토네이도 등 몇 가지 주요 프레임워크에 대해 조사했습니다. 밀버스 부트캠프의 프로젝트는 여러분을 위한 레퍼런스 역할을 하기 때문에 최대한 가볍고 손쉬운 외부 프레임워크를 채택하는 것을 우선순위로 삼았습니다. 이 원칙에 따라 선택의 폭을 Flask와 FastAPI로 좁혔습니다.</p>
<p>두 웹 프레임워크의 비교는 이전 섹션에서 확인할 수 있습니다. 다음은 밀버스 부트캠프의 프로젝트에 Flask 대신 FastAPI를 선택한 동기에 대한 자세한 설명입니다. 몇 가지 이유가 있습니다:</p>
<h3 id="1-Performance" class="common-anchor-header">1. 성능</h3><p>밀버스 부트캠프의 대부분의 프로젝트는 실시간 데이터 처리에 대한 요구가 높은 역 이미지 검색 시스템, QA 챗봇, 텍스트 검색 엔진을 중심으로 구축되었습니다. 따라서 뛰어난 성능을 갖춘 프레임워크가 필요하며, 바로 이것이 FastAPI의 핵심입니다. 따라서 시스템 성능의 관점에서 FastAPI를 선택하기로 결정했습니다.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. 효율성</h3><p>플라스크를 사용할 때는 시스템에서 입력 데이터가 비어 있는지 여부를 판단할 수 있도록 각 인터페이스에서 데이터 타입 검증을 위한 코드를 작성해야 합니다. 그러나 FastAPI는 자동 데이터 유형 검증을 지원함으로써 시스템 개발 중 코딩 시 인적 오류를 방지하고 개발 효율성을 크게 높일 수 있습니다. 부트캠프는 일종의 교육 리소스로 자리매김하고 있습니다. 즉, 우리가 사용하는 코드와 구성 요소는 직관적이고 효율성이 높아야 합니다. 이러한 점에서 시스템 효율성을 개선하고 사용자 경험을 향상시키기 위해 FastAPI를 선택했습니다.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. 비동기 프레임워크</h3><p>FastAPI는 본질적으로 비동기 프레임워크입니다. 원래는 역 이미지 검색, 동영상 분석, QA 챗봇, 분자 유사도 검색의 네 가지 <a href="https://zilliz.com/milvus-demos?isZilliz=true">데모를</a> 공개했습니다. 이 데모에서는 데이터 세트를 업로드하면 즉시 &quot;요청이 수신되었습니다&quot;라는 메시지가 표시됩니다. 그리고 데이터가 데모 시스템에 업로드되면 &quot;데이터 업로드 성공&quot;이라는 메시지가 다시 표시됩니다. 이는 비동기 프로세스이므로 이 기능을 지원하는 프레임워크가 필요합니다. FastAPI는 그 자체로 비동기 프레임워크입니다. 모든 Milvus 리소스를 조정하기 위해 Milvus Bootcamp와 Milvus 데모 모두에 단일 개발 도구 및 소프트웨어 세트를 채택하기로 결정했습니다. 그 결과 프레임워크를 Flask에서 FastAPI로 변경했습니다.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. 자동 대화형 문서</h3><p>기존 방식에서는 서버 측 코드 작성을 마치면 인터페이스를 만들기 위해 별도의 문서를 작성한 다음, API 테스트 및 디버깅을 위해 <a href="https://www.postman.com/">Postman과</a> 같은 도구를 사용해야 합니다. 그렇다면 인터페이스를 만들기 위한 추가 코드를 작성하지 않고 Milvus Bootcamp에서 프로젝트의 웹 서버 측 개발 부분만 빠르게 시작하고 싶다면 어떻게 해야 할까요? FastAPI가 해결책입니다. FastAPI는 OpenAPI 문서를 제공함으로써 API를 테스트하거나 디버깅하고 프론트엔드 팀과 협업하여 사용자 인터페이스를 개발하는 수고를 덜어줍니다. FastAPI를 사용하면 별도의 코딩 작업 없이도 자동화된 직관적인 인터페이스를 통해 구축된 애플리케이션을 빠르게 사용해 볼 수 있습니다.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. 사용자 친화성</h3><p>FastAPI는 사용과 개발이 더 쉽기 때문에 프로젝트 자체의 구체적인 구현에 더 많은 관심을 기울일 수 있습니다. 웹 프레임워크 개발에 너무 많은 시간을 할애하지 않고 Milvus Bootcamp에서 프로젝트를 이해하는 데 더 집중할 수 있습니다.</p>
<h2 id="Recap" class="common-anchor-header">요약<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>플라스크와 FlastAPI는 각각의 장단점이 있습니다. 새롭게 떠오르는 웹 애플리케이션 프레임워크인 FlastAPI는 그 핵심이 성숙한 툴킷과 라이브러리인 Starlette 및 Pydantic을 기반으로 구축되었습니다. FastAPI는 고성능을 갖춘 비동기 프레임워크입니다. 이 프레임워크의 손재주, 확장성, 자동 데이터 유형 검증 지원 등 여러 가지 강력한 기능 덕분에 Milvus Bootcamp 프로젝트의 프레임워크로 FastAPI를 채택하게 되었습니다.</p>
<p>프로덕션 환경에서 벡터 유사도 검색 시스템을 구축하려면 애플리케이션 시나리오에 따라 적절한 프레임워크를 선택해야 한다는 점에 유의하시기 바랍니다.</p>
<h2 id="About-the-author" class="common-anchor-header">저자 소개<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>질리즈 데이터 엔지니어인 리윤메이는 화중과학기술대학교에서 컴퓨터 공학을 전공하고 졸업했습니다. Zilliz에 입사한 이후 오픈 소스 프로젝트 Milvus의 솔루션을 탐색하고 사용자가 실제 시나리오에서 Milvus를 적용할 수 있도록 지원하는 일을 하고 있습니다. 그녀의 주요 관심 분야는 자연어 처리와 추천 시스템이며, 앞으로 이 두 분야에 더욱 집중하고 싶습니다. 혼자 시간을 보내는 것과 독서를 좋아합니다.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">더 많은 리소스를 찾고 계신가요?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Milvus로 AI 시스템 구축을 시작하고 튜토리얼을 통해 더 많은 실무 경험을 쌓으세요!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">밀버스란 무엇인가요? 그녀는 누구인가요? 지능적인 동영상 분석을 돕는 Milvus</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">ONNX와 Milvus를 사용해 이미지 검색을 위한 AI 모델 결합하기</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Milvus 기반 DNA 서열 분류</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Milvus 기반 오디오 검색</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">비디오 검색 시스템을 구축하는 4단계</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">NLP와 Milvus로 지능형 QA 시스템 구축하기</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">신약 개발 가속화</a></li>
</ul></li>
<li><p>오픈 소스 커뮤니티에 참여하세요:</p>
<ul>
<li><a href="https://bit.ly/307b7jC">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://bit.ly/3qiyTEk">포럼을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://bit.ly/3ob7kd8">트위터에서</a> 소통하세요.</li>
</ul></li>
</ul>
