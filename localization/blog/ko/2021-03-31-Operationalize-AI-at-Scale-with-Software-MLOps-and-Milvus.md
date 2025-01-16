---
id: Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus.md
title: 'Software 2.0, MLOps 및 Milvus를 통한 대규모 AI 운영'
author: milvus
date: 2021-03-31T09:51:38.653Z
desc: >-
  소프트웨어 2.0으로 전환하면서 MLOps가 DevOps를 대체하고 있습니다. 모델 연산이란 무엇이며 오픈 소스 벡터 데이터베이스
  Milvus가 이를 어떻게 지원하는지 알아보세요.
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus
---
<custom-h1>Software 2.0, MLOps, Milvus로 대규모 AI 운영하기</custom-h1><p>머신러닝(ML) 애플리케이션 구축은 복잡하고 반복적인 과정입니다. 더 많은 기업이 비정형 데이터의 미개발 잠재력을 깨닫게 되면서 <a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">AI 기반 데이터 처리 및 분석에</a> 대한 수요는 계속 증가할 것입니다. 효과적인 머신 러닝 운영, 즉 MLOps가 없다면 대부분의 ML 애플리케이션 투자는 시들해질 것입니다. 연구에 따르면 기업이 도입을 계획한 AI 중 실제로 배포에 이르는 비율은 <a href="https://www.forbes.com/sites/cognitiveworld/2020/03/31/modelops-is-the-key-to-enterprise-ai/?sh=44c0f5066f5a">5%에 불과</a> 합니다. 많은 조직에서 시장 상황의 변화와 이에 대한 적응 실패로 인해 모델에 대한 투자가 실현되지 않은 채로 남아 있거나 아예 배포되지 않는 '모델 부채'가 발생하고 있습니다.</p>
<p>이 문서에서는 AI 모델 수명 주기 관리에 대한 체계적인 접근 방식인 MLOps와 오픈 소스 벡터 데이터 관리 플랫폼인 <a href="https://milvus.io/">Milvus를</a> 사용하여 대규모로 AI를 운영하는 방법에 대해 설명합니다.</p>
<p><br/></p>
<h3 id="What-is-MLOps" class="common-anchor-header">MLOps란 무엇인가요?</h3><p>모델 운영(ModelOps) 또는 AI 모델 운영화라고도 하는 머신 러닝 운영(MLOps)은 대규모로 AI 애플리케이션을 구축, 유지 관리 및 배포하는 데 필요합니다. 기업이 개발한 AI 모델을 수백 가지의 다양한 시나리오에 적용하고자 할 때, 사용 중인 모델과 개발 중인 모델을 조직 전체에서 운영화하는 것은 매우 중요합니다. MLOps에는 수명 주기 전반에 걸쳐 머신 러닝 모델을 모니터링하고 기본 데이터부터 특정 모델에 의존하는 생산 시스템의 효율성에 이르기까지 모든 것을 관리하는 것이 포함됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_362a07d156.jpg" alt="01.jpg" class="doc-image" id="01.jpg" />
   </span> <span class="img-wrapper"> <span>01.jpg</span> </span></p>
<p>Gartner는 모델옵스를 운영되는 광범위한 인공 지능 및 의사 결정 모델의 거버넌스 및 수명 주기 관리로 <a href="https://www.gartner.com/en/information-technology/glossary/modelops">정의합니다</a>. MLOps의 핵심 기능은 다음과 같이 세분화할 수 있습니다:</p>
<ul>
<li><p><strong>지속적 통합/지속적 배포(CI/CD):</strong> 개발자 운영(DevOps)에서 차용한 일련의 모범 사례인 CI/CD는 코드 변경 사항을 더 자주, 더 안정적으로 제공하기 위한 방법입니다. <a href="https://www.gartner.com/en/information-technology/glossary/continuous-integration-ci">지속적 통합은</a> 엄격한 버전 관리로 모니터링하면서 코드 변경 사항을 소량으로 구현하는 것을 촉진합니다. <a href="https://www.gartner.com/smarterwithgartner/5-steps-to-master-continuous-delivery/">지속적 배포는</a> 다양한 환경(예: 테스트 및 개발 환경)에 애플리케이션을 배포하는 작업을 자동화합니다.</p></li>
<li><p><strong>모델 개발 환경(MDE):</strong> 모델을 구축, 검토, 문서화 및 검사하기 위한 복잡한 프로세스인 MDE는 모델이 반복적으로 생성되고, 개발되는 대로 문서화되며, 신뢰할 수 있고, 재현 가능하도록 보장하는 데 도움이 됩니다. 효과적인 MDE는 통제된 방식으로 모델을 탐색, 연구 및 실험할 수 있도록 보장합니다.</p></li>
<li><p><strong>챔피언-도전자 테스트:</strong> 마케터가 사용하는 A/B 테스트 방법론과 유사하게 <a href="https://medium.com/decision-automation/what-is-champion-challenger-and-how-does-it-enable-choosing-the-right-decision-f57b8b653149">챔피언-챌린저 테스트는</a> 단일 접근 방식을 결정하는 의사 결정 과정을 돕기 위해 다양한 솔루션을 실험하는 것을 포함합니다. 이 기법에는 실시간으로 성과를 모니터링하고 측정하여 어떤 편차가 가장 효과적인지 파악하는 것이 포함됩니다.</p></li>
<li><p><strong>모델 버전 관리:</strong> 다른 복잡한 시스템과 마찬가지로 머신러닝 모델도 여러 사람이 여러 단계에 걸쳐 개발하기 때문에 데이터 및 ML 모델의 버전과 관련된 데이터 관리 문제가 발생합니다. 모델 버전 관리는 데이터, 모델, 코드가 서로 다른 속도로 발전할 수 있는 반복적인 ML 개발 프로세스를 관리하고 통제하는 데 도움이 됩니다.</p></li>
<li><p><strong>모델 저장 및 롤백:</strong> 모델이 배포되면 해당 이미지 파일을 저장해야 합니다. 롤백 및 복구 기능을 통해 MLOps 팀은 필요한 경우 이전 모델 버전으로 되돌릴 수 있습니다.</p></li>
</ul>
<p>프로덕션 애플리케이션에서 하나의 모델만 사용하면 여러 가지 어려운 문제가 발생합니다. MLOps는 머신 러닝 모델의 수명 주기 동안 발생하는 기술적 또는 비즈니스 문제를 극복하기 위해 도구, 기술 및 모범 사례에 의존하는 구조화되고 반복 가능한 방법입니다. 성공적인 MLOps는 AI 모델을 구축, 배포, 모니터링, 재교육, 운영 시스템에서의 사용을 위해 노력하는 팀 전반의 효율성을 유지합니다.</p>
<p><br/></p>
<h3 id="Why-is-MLOps-necessary" class="common-anchor-header">MLOps가 필요한 이유는 무엇인가요?</h3><p>위의 ML 모델 수명 주기에 설명된 대로 머신러닝 모델 구축은 새로운 데이터를 통합하고, 모델을 재교육하고, 시간이 지남에 따라 일반적인 모델 붕괴에 대처하는 반복적인 프로세스입니다. 이러한 문제는 모두 기존의 개발자 운영 또는 DevOps가 해결하거나 해결책을 제공하지 못하는 문제입니다. AI 모델에 대한 투자를 관리하고 생산적인 모델 수명 주기를 보장하기 위한 방법으로 MLOps가 필요해졌습니다. 머신 러닝 모델은 다양한 생산 시스템에서 활용되기 때문에, 다양한 환경과 다양한 시나리오에서 요구 사항을 충족하기 위해 MLOps는 필수적인 요소가 되었습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_403e7f2fe2.jpg" alt="02.jpg" class="doc-image" id="02.jpg" />
   </span> <span class="img-wrapper"> <span>02.jpg</span> </span></p>
<p><br/></p>
<p>위의 간단한 그림은 애플리케이션에 공급되는 클라우드 환경에 배포되는 머신 러닝 모델을 보여줍니다. 이 기본 시나리오에서는 여러 가지 문제가 발생할 수 있는데, MLOps는 이를 극복하는 데 도움이 됩니다. 프로덕션 애플리케이션은 특정 클라우드 환경에 의존하기 때문에 ML 모델을 개발한 데이터 과학자가 액세스할 수 없는 지연 시간 요구 사항이 있습니다. 모델 수명 주기를 운영하면 모델에 대한 깊은 지식을 갖춘 데이터 과학자나 엔지니어가 특정 프로덕션 환경에서 발생하는 문제를 식별하고 문제를 해결할 수 있습니다.</p>
<p>머신 러닝 모델은 사용되는 프로덕션 애플리케이션과 다른 환경에서 학습될 뿐만 아니라, 프로덕션 애플리케이션에서 사용되는 데이터와 다른 과거 데이터 세트에 의존하는 경우가 많습니다. MLOps를 사용하면 모델을 개발하는 사람부터 애플리케이션 수준에서 작업하는 사람까지 전체 데이터 과학 팀이 정보와 지원을 공유하고 요청할 수 있는 수단을 갖게 됩니다. 데이터와 시장의 변화 속도로 인해 특정 머신 러닝 모델에 의존하게 될 모든 주요 이해관계자와 기여자 간의 마찰을 최대한 줄이는 것이 필수적입니다.</p>
<h3 id="Supporting-the-transition-to-Software-20" class="common-anchor-header">소프트웨어 2.0으로의 전환 지원</h3><p>소프트웨어<a href="https://karpathy.medium.com/software-2-0-a64152b37c35">2.0은</a> 소프트웨어 애플리케이션을 구동하는 AI 모델을 작성하는 데 있어 인공지능이 점점 더 중심적인 역할을 하게 되면서 소프트웨어 개발의 패러다임이 바뀌게 될 것이라는 개념입니다. 소프트웨어 1.0에서는 프로그래머가 특정 프로그래밍 언어(예: Python, C++)를 사용하여 명시적인 명령어를 작성하는 방식으로 개발이 이루어졌습니다. 소프트웨어 2.0은 훨씬 더 추상적입니다. 사람이 입력 데이터를 제공하고 매개변수를 설정하지만, 신경망은 결과에 영향을 미치는 수백만 개의 가중치(때로는 수십억 또는 수조 개)를 포함하는 일반적인 네트워크와 같이 매우 복잡하기 때문에 사람이 이해하기 어렵습니다.</p>
<p>데브옵스는 프로그래머가 언어를 사용해 지시하는 특정 지침에 의존하는 소프트웨어 1.0을 기반으로 구축되었지만, 다양한 애플리케이션을 구동하는 머신 러닝 모델의 수명 주기는 고려하지 않았습니다. MLOps는 개발 중인 소프트웨어와 함께 소프트웨어 개발 관리 프로세스도 변화해야 할 필요성을 해결합니다. 소프트웨어 2.0이 컴퓨터 기반 문제 해결의 새로운 표준이 되면서 모델 수명 주기를 관리할 수 있는 올바른 도구와 프로세스를 갖추는 것이 신기술에 대한 투자의 성패를 좌우할 것입니다. Milvus는 소프트웨어 2.0으로의 전환을 지원하고 MLOps로 모델 수명 주기를 관리하기 위해 구축된 오픈 소스 벡터 유사성 검색 엔진입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/03_c63c501995.jpg" alt="03.jpg" class="doc-image" id="03.jpg" />
   </span> <span class="img-wrapper"> <span>03.jpg</span> </span></p>
<p><br/></p>
<h3 id="Operationalizing-AI-at-scale-with-Milvus" class="common-anchor-header">Milvus로 대규모 AI 운영하기</h3><p>Milvus는 조 단위의 방대한 벡터 데이터 세트를 저장, 쿼리, 업데이트 및 유지 관리하기 위해 특별히 제작된 벡터 데이터 관리 플랫폼입니다. 이 플랫폼은 벡터 유사도 검색을 지원하며 Faiss, NMSLIB, Annoy 등 널리 채택된 인덱스 라이브러리와 통합할 수 있습니다. 비정형 데이터를 벡터로 변환하는 AI 모델을 Milvus와 결합하면 신약 개발, 생체 인식 분석, 추천 시스템 등을 아우르는 애플리케이션을 만들 수 있습니다.</p>
<p><a href="https://blog.milvus.io/vector-similarity-search-hides-in-plain-view-654f8152f8ab">벡터 유사도 검색은</a> 비정형 데이터 데이터 처리 및 분석을 위한 솔루션으로, 벡터 데이터는 핵심 데이터 유형으로 빠르게 부상하고 있습니다. Milvus와 같은 종합적인 데이터 관리 시스템은 다음과 같은 다양한 방식으로 AI 운영을 용이하게 합니다:</p>
<ul>
<li><p>개발의 더 많은 측면을 한 곳에서 수행할 수 있는 모델 학습 환경을 제공하여 팀 간 협업, 모델 거버넌스 등을 용이하게 합니다.</p></li>
<li><p>Python, Java, Go와 같이 널리 사용되는 프레임워크를 지원하는 포괄적인 API 세트를 제공하여 공통의 ML 모델 세트를 쉽게 통합할 수 있습니다.</p></li>
<li><p>브라우저에서 실행되는 Jupyter 노트북 환경인 Google Colaboratory와의 호환성을 통해 소스 코드에서 Milvus를 컴파일하고 기본 Python 작업을 실행하는 프로세스를 간소화할 수 있습니다.</p></li>
<li><p>자동화된 머신 러닝(AutoML) 기능을 사용하면 실제 문제에 머신 러닝을 적용하는 것과 관련된 작업을 자동화할 수 있습니다. AutoML은 효율성 향상으로 이어질 뿐만 아니라 비전문가도 머신 러닝 모델과 기술을 활용할 수 있게 해줍니다.</p></li>
</ul>
<p>현재 구축 중인 머신 러닝 애플리케이션이나 향후 애플리케이션에 대한 계획에 관계없이 Milvus는 Software 2.0과 MLOps를 염두에 두고 개발된 유연한 데이터 관리 플랫폼입니다. Milvus에 대해 자세히 알아보거나 기여하려면 <a href="https://github.com/milvus-io">Github에서</a> 프로젝트를 찾아보세요. 커뮤니티에 참여하거나 질문을 하려면 <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 채널에 가입하세요. 더 많은 콘텐츠가 궁금하신가요? 다음 리소스를 확인해 보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database.md">확장 가능한 오픈소스 벡터 데이터베이스 Milvus</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">대규모(조 단위) 벡터 유사도 검색을 위해 구축된 Milvus</a></li>
<li><a href="https://milvus.io/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md">간편한 머신러닝 애플리케이션 구축을 위해 Google 콜라보랩에서 Milvus 설정하기</a></li>
</ul>
