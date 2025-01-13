---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: 밀버스 기반의 사진 사기 탐지기 Zhentu
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: 밀버스를 벡터 검색 엔진으로 사용하는 젠투의 탐지 시스템은 어떻게 구축되었나요?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 BestPay의 수석 알고리즘 엔지니어인 Yan Shi와 Minwei Tang이 작성하고 <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang이</a> 번역했습니다.</p>
</blockquote>
<p>최근 몇 년 동안 전 세계적으로 전자상거래와 온라인 거래가 보편화되면서 전자상거래 사기 또한 번성했습니다. 사기범들은 온라인 비즈니스 플랫폼에서 신원 확인을 통과하기 위해 실제 사진 대신 컴퓨터로 생성한 사진을 사용하여 대규모 가짜 계정을 만들고 기업의 특별 혜택(예: 멤버십 선물, 쿠폰, 토큰)을 통해 현금화함으로써 소비자와 기업 모두에게 돌이킬 수 없는 손실을 가져다줍니다.</p>
<p>기존의 위험 관리 방법은 방대한 양의 데이터 앞에서 더 이상 효과적이지 않습니다. 이 문제를 해결하기 위해 <a href="https://www.bestpay.com.cn">베스트페이는</a> 딥러닝(DL)과 디지털 이미지 처리(DIP) 기술을 기반으로 사진 사기 탐지기인 젠투(중국어로 이미지 감지를 의미)를 개발했습니다. 젠투는 이미지 인식과 관련된 다양한 시나리오에 적용할 수 있으며, 그 중 중요한 파생 기능 중 하나는 위조 사업자등록증을 식별하는 것입니다. 사용자가 제출한 비즈니스 라이선스 사진이 플랫폼의 사진 라이브러리에 이미 존재하는 다른 사진과 매우 유사하다면, 사용자가 어딘가에서 사진을 훔쳤거나 부정한 목적으로 라이선스를 위조했을 가능성이 높습니다.</p>
<p>이미지 유사도를 측정하는 기존 알고리즘(예: <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> 및 ORB)은 속도가 느리고 부정확하며 오프라인 작업에만 적용할 수 있습니다. 반면 딥러닝은 대규모 이미지 데이터를 실시간으로 처리할 수 있으며, 유사한 이미지를 매칭하는 궁극적인 방법입니다. 베스트페이의 R&amp;D 팀과 <a href="https://milvus.io/">밀버스 커뮤니티의</a> 공동 노력으로 사진 사기 탐지 시스템이 젠투의 일부로 개발되었습니다. 이 시스템은 딥러닝 모델을 통해 방대한 양의 이미지 데이터를 특징 벡터로 변환하고 이를 벡터 검색 엔진인 <a href="https://milvus.io/">Milvus에</a> 삽입하는 방식으로 작동합니다. Milvus를 통해 이 탐지 시스템은 수조 개의 벡터를 색인화하여 수천만 장의 이미지 중에서 유사한 사진을 효율적으로 검색할 수 있습니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Zhentu 개요</a></li>
<li><a href="#system-structure">시스템 구조</a></li>
<li><a href="#deployment"><strong>배포</strong></a></li>
<li><a href="#real-world-performance"><strong>실제 성능</strong></a></li>
<li><a href="#reference"><strong>참조</strong></a></li>
<li><a href="#about-bestpay"><strong>베스트페이 소개</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">젠투 개요<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>젠투는 머신러닝(ML) 및 신경망 이미지 인식 기술과 긴밀하게 통합된 베스트페이의 자체 설계 멀티미디어 시각적 위험 제어 제품입니다. 내장된 알고리즘을 통해 사용자 인증 시 사기범을 정확하게 식별하고 밀리초 단위로 대응할 수 있습니다. 업계를 선도하는 기술력과 혁신적인 솔루션으로 젠투는 5개의 특허와 2개의 소프트웨어 저작권을 획득했습니다. 현재 여러 은행과 금융 기관에서 잠재적 위험을 사전에 식별하는 데 활용되고 있습니다.</p>
<h2 id="System-structure" class="common-anchor-header">시스템 구조<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>베스트페이는 현재 천만 개가 넘는 사업자등록증 사진을 보유하고 있으며, 비즈니스가 성장함에 따라 실제 규모는 기하급수적으로 증가하고 있습니다. 이러한 대규모 데이터베이스에서 유사한 사진을 빠르게 검색하기 위해 Zhentu는 특징 벡터 유사도 계산 엔진으로 Milvus를 선택했습니다. 사진 사기 탐지 시스템의 일반적인 구조는 아래 다이어그램에 나와 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>이미지</span> </span></p>
<p>절차는 네 단계로 나눌 수 있습니다:</p>
<ol>
<li><p>이미지 전처리. 노이즈 감소, 노이즈 제거, 대비 향상 등의 전처리를 통해 원본 정보의 무결성을 보장하고 이미지 신호에서 쓸모없는 정보를 제거합니다.</p></li>
<li><p>특징 벡터 추출. 특별히 훈련된 딥러닝 모델을 사용해 이미지의 특징 벡터를 추출합니다. 추가 유사성 검색을 위해 이미지를 벡터로 변환하는 것은 일상적인 작업입니다.</p></li>
<li><p>정규화. 추출된 특징 벡터를 정규화하면 후속 처리의 효율성을 높이는 데 도움이 됩니다.</p></li>
<li><p>Milvus를 사용한 벡터 검색. 벡터 유사도 검색을 위해 정규화된 특징 벡터를 Milvus 데이터베이스에 삽입합니다.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>배포</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>다음은 젠투의 사진 사기 탐지 시스템이 어떻게 구축되었는지에 대한 간략한 설명입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 시스템 아키텍처</span> </span></p>
<p>우리는 클라우드 서비스의 고가용성과 실시간 동기화를 보장하기 위해 <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Kubernetes에 Milvus 클러스터를</a> 배포했습니다. 일반적인 단계는 다음과 같습니다:</p>
<ol>
<li><p>사용 가능한 리소스 보기. <code translate="no">kubectl describe nodes</code> 명령을 실행하여 생성된 케이스에 할당할 수 있는 Kubernetes 클러스터의 리소스를 확인합니다.</p></li>
<li><p>리소스를 할당한다. <code translate="no">kubect`` -- apply xxx.yaml</code> 명령을 실행하여 헬름을 사용하여 Milvus 클러스터 구성 요소에 대한 메모리 및 CPU 리소스를 할당한다.</p></li>
<li><p>새 구성을 적용한다. <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code> 명령을 실행한다.</p></li>
<li><p>새 구성을 Milvus 클러스터에 적용한다. 이렇게 배포된 클러스터는 다양한 비즈니스 요구 사항에 따라 시스템 용량을 조정할 수 있을 뿐만 아니라 대규모 벡터 데이터 검색에 대한 고성능 요구 사항도 더 잘 충족합니다.</p></li>
</ol>
<p>다음 두 가지 예와 같이 다양한 비즈니스 시나리오에서 다양한 유형의 데이터에 대한 검색 성능을 최적화하도록 <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">Milvus를 구성할</a> 수 있습니다.</p>
<p><a href="https://milvus.io/docs/v2.0.x/build_index.md">벡터 인덱스를 구축할</a> 때, 시스템의 실제 시나리오에 따라 다음과 같이 인덱스를 매개변수화합니다:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ는</a> 벡터의 곱을 정량화하기 전에 IVF 인덱스 클러스터링을 수행합니다. 이는 고속 디스크 쿼리와 매우 낮은 메모리 소비를 특징으로 하며, 실제 Zhentu 애플리케이션의 요구 사항을 충족합니다.</p>
<p>또한 최적의 검색 매개변수를 다음과 같이 설정했습니다:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>밀버스에 입력하기 전에 벡터가 이미 정규화되어 있으므로 두 벡터 사이의 거리를 계산하기 위해 내적 곱(IP)을 선택합니다. 실험을 통해 유클리드 거리(L2)를 사용할 때보다 IP를 사용할 때 리콜률이 약 15% 높아진다는 사실이 입증되었습니다.</p>
<p>위의 예는 다양한 비즈니스 시나리오와 성능 요구 사항에 따라 Milvus의 매개 변수를 테스트하고 설정할 수 있음을 보여줍니다.</p>
<p>또한 Milvus는 다양한 인덱스 라이브러리를 통합할 뿐만 아니라 다양한 인덱스 유형과 유사도 계산 방법도 지원합니다. Milvus는 또한 여러 언어로 된 공식 SDK와 삽입, 쿼리 등을 위한 풍부한 API를 제공하여 프론트엔드 비즈니스 그룹이 SDK를 사용하여 위험 관리 센터에 호출할 수 있도록 합니다.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>실제 성과</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>지금까지 사진 사기 탐지 시스템은 꾸준히 운영되어 기업이 잠재적인 사기범을 식별하는 데 도움을 주고 있습니다. 2021년에는 한 해 동안 20,000개 이상의 가짜 라이선스를 탐지했습니다. 쿼리 속도 측면에서도 수천만 개의 벡터 중 단일 벡터 쿼리는 1초도 걸리지 않으며, 일괄 쿼리의 평균 시간은 0.08초 미만입니다. Milvus의 고성능 검색은 정확성과 동시성에 대한 기업의 요구를 모두 충족합니다.</p>
<h2 id="Reference" class="common-anchor-header"><strong>참조</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>아글라브 P, 콜쿠레 V S. 방향성 빠르고 회전된 간략 알고리즘을 이용한 고성능 특징 추출 방법의 구현[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>베스트페이 소개</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>차이나 텔레콤 베스트페이는 차이나 텔레콤이 전액 출자한 자회사입니다. 결제 및 금융 사업을 운영합니다. 베스트페이는 빅데이터, 인공지능, 클라우드 컴퓨팅과 같은 첨단 기술을 활용해 비즈니스 혁신을 강화하고 지능형 제품, 위험 관리 솔루션 및 기타 서비스를 제공하기 위해 최선을 다하고 있습니다. 2016년 1월까지 2억 명 이상의 사용자를 유치하며 알리페이와 위챗페이에 이어 중국에서 세 번째로 큰 결제 플랫폼 사업자가 되었습니다.</p>
