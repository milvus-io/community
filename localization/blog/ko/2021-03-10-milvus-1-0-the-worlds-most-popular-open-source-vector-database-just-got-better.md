---
id: >-
  milvus-1-0-the-worlds-most-popular-open-source-vector-database-just-got-better.md
title: Milvus 1.0 세계에서 가장 인기 있는 오픈 소스 벡터 데이터베이스가 더욱 개선되었습니다.
author: milvus
date: 2021-03-10T06:58:36.647Z
desc: >-
  안정적인 장기 지원 버전인 Milvus v1.0을 지금 사용할 수 있습니다. Milvus는 이미지/동영상 검색, 챗봇, 그리고 더 많은 AI
  애플리케이션을 지원합니다.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/milvus-1-0-the-worlds-most-popular-open-source-vector-database-just-got-better
---
<custom-h1>Milvus 1.0: 세계에서 가장 인기 있는 오픈 소스 벡터 데이터베이스가 더 좋아졌습니다.</custom-h1><p>질리즈는 Milvus v1.0의 출시를 발표하게 되어 자랑스럽게 생각합니다. 수개월간의 광범위한 테스트 끝에 안정적인 Milvus v0.10.6 버전을 기반으로 하는 Milvus v1.0을 사용할 수 있게 되었습니다.</p>
<p>Milvus v1.0은 다음과 같은 주요 기능을 제공합니다:</p>
<ul>
<li>유클리드 거리, 내적 곱, 해밍 거리, 자카드 계수 등 주요 유사성 메트릭을 지원합니다.</li>
<li>Faiss, Hnswlib, Annoy, NSG 등을 포함한 SOTA ANN 알고리즘과의 통합 및 개선.</li>
<li>미샤드 샤딩 프록시를 통한 스케일아웃 기능.</li>
<li>X86, Nvidia GPU, Xilinx FPGA 등 AI 시나리오에서 일반적으로 사용되는 프로세서를 지원합니다.</li>
</ul>
<p>Milvus v1.0의 추가 기능은 <a href="https://www.milvus.io/docs/v1.0.0/release_notes.md">릴리즈 노트를</a> 참조하세요.</p>
<p>Milvus는 현재 진행 중인 오픈 소스 소프트웨어(OSS) 프로젝트입니다. 첫 번째 주요 릴리스는 사용자에게 다음과 같은 영향을 미칩니다:</p>
<ul>
<li>Milvus v1.0은 장기 지원(3년 이상)을 받게 됩니다.</li>
<li>현재까지 가장 안정적인 Milvus 릴리스는 잘 구조화되어 있으며 기존 AI 에코시스템과 통합할 준비가 되어 있습니다.</li>
</ul>
<h3 id="The-first-version-of-Milvus-with-long-term-support" class="common-anchor-header">장기 지원이 제공되는 Milvus의 첫 번째 버전</h3><p>Zilliz의 후원으로 Milvus 커뮤니티는 2024년 12월 31일까지 Milvus v1.0에 대한 버그 수정 지원을 제공할 예정입니다. 새로운 기능은 v1.0 이후 릴리스에서만 사용할 수 있습니다.</p>
<p>릴리스 주기 등에 대한 자세한 내용은 <a href="https://milvus.io/docs/v1.0.0/milvus_release_guideline.md">Milvus 릴리스 가이드 라인을</a> 참조하세요.</p>
<h3 id="Toolchain-enhancements-and-seamless-AI-ecosystem-integration" class="common-anchor-header">툴체인 개선 및 원활한 AI 에코시스템 통합</h3><p>v1.0부터 Milvus의 툴체인은 주요 개발 초점이 될 것입니다. Milvus 사용자 커뮤니티의 요구를 충족하기 위해 필요한 툴링과 유틸리티를 만들 계획입니다.</p>
<p>안정성을 통해 Milvus와 AI 생태계를 쉽게 통합할 수 있습니다. Milvus 커뮤니티와 다른 AI 중심 OSS 커뮤니티 간의 추가 협력을 모색하고 있습니다. Milvus의 새로운 AI ASIC(애플리케이션별 집적 회로)에 대한 기여를 장려합니다.</p>
<h3 id="The-future-of-Milvus" class="common-anchor-header">Milvus의 미래</h3><p>저희는 다음과 같은 요인 덕분에 Milvus의 미래가 밝다고 믿습니다:</p>
<ul>
<li>Milvus 커뮤니티의 개발자들이 정기적으로 기여합니다.</li>
<li>모든 클라우드 네이티브 환경과의 통합 지원.</li>
</ul>
<p>저희는 기술과 사용자 기반이 성장함에 따라 Milvus 커뮤니티를 안내하고 육성하며 발전시키는 데 도움이 되는 <a href="https://milvus.io/docs/v1.0.0/milvus_community_charters.md">커뮤니티 헌장</a> 초안을 작성했습니다. 이 헌장에는 커뮤니티에 더 많은 참여자를 유치하기 위한 몇 가지 기술적 결정이 포함되어 있습니다.</p>
<ul>
<li>이제 Milvus 엔진 개발에는 Golang이 사용되지만, ANNS 알고리즘 구성 요소는 여전히 C++로 개발될 것입니다.</li>
<li>곧 출시될 Milvus의 배포 버전에서는 기존 클라우드 구성 요소를 최대한 활용할 예정입니다.</li>
</ul>
<p>오픈 소스 소프트웨어 커뮤니티와 협력하여 AI를 위한 차세대 클라우드 데이터 패브릭을 구축하게 되어 매우 기쁘게 생각합니다. 이제 시작하겠습니다!</p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요</h3><ul>
<li><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</li>
</ul>
