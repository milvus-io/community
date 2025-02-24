---
id: what-milvus-taught-us-in-2024.md
title: 2024년 밀버스 사용자들이 우리에게 가르쳐준 것들
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: 디스코드에서 밀버스에 관해 자주 묻는 질문을 확인하세요.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">개요<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>2024년에 Milvus가 주요 릴리스와 번성하는 오픈소스 생태계로 번창하는 동안, <a href="https://discord.gg/xwqmFDURcz">Discord</a> 커뮤니티에는 숨겨진 사용자 인사이트의 보고가 조용히 형성되고 있었습니다. 이 커뮤니티 토론의 모음은 사용자들의 어려움을 직접 이해할 수 있는 특별한 기회를 제공했습니다. 이 미개척 자원에 흥미를 느낀 저는 한 해 동안의 모든 토론 스레드를 종합적으로 분석하여 Milvus 사용자가 자주 묻는 질문 리소스를 작성하는 데 도움이 될 수 있는 패턴을 찾기 시작했습니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>분석 결과 사용자들이 지속적으로 도움을 구하는 세 가지 주요 영역이 발견되었습니다: <strong>성능 최적화</strong>, <strong>배포 전략</strong>, <strong>데이터 관리였습니다</strong>. 사용자들은 프로덕션 환경에 맞게 Milvus를 미세 조정하고 성능 지표를 효과적으로 추적하는 방법에 대해 자주 논의했습니다. 배포와 관련하여 커뮤니티는 적절한 배포를 선택하고, 최적의 검색 인덱스를 선택하고, 분산 설정에서 문제를 해결하는 데 어려움을 겪었습니다. 데이터 관리와 관련해서는 서비스 간 데이터 마이그레이션 전략과 임베딩 모델 선택에 대한 논의가 주를 이루었습니다.</p>
<p>이러한 각 영역을 좀 더 자세히 살펴보겠습니다.</p>
<h2 id="Deployment" class="common-anchor-header">배포<button data-href="#Deployment" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus는 다양한 사용 사례에 맞는 유연한 배포 모드를 제공합니다. 그러나 일부 사용자는 올바른 선택지를 찾기가 어렵고 "올바르게" 배포하고 있다는 확신을 갖고 싶어합니다.</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">어떤 배포 유형을 선택해야 하나요?</h3><p>가장 자주 묻는 질문은 Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">독립형</a>, <a href="https://milvus.io/docs/prerequisite-helm.md">분산형</a> 중 어떤 배포를 선택해야 하는지에 대한 것입니다. 답은 주로 벡터 데이터베이스의 크기와 처리할 트래픽의 양에 따라 달라집니다:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>로컬 시스템에서 최대 수백만 개의 벡터로 프로토타이핑하거나 단위 테스트 및 CI/CD를 위한 임베디드 벡터 DB를 찾고 있는 경우 Milvus Lite를 사용할 수 있습니다. 전체 텍스트 검색과 같은 일부 고급 기능은 아직 Milvus Lite에서 사용할 수 없지만 곧 제공될 예정입니다.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus 스탠드얼론</h4><p>시스템이 프로덕션 트래픽을 처리해야 하거나 수백만에서 수억 개의 벡터를 저장해야 하는 경우, Milvus의 모든 구성 요소를 단일 Docker 이미지로 묶은 Milvus Standalone을 사용해야 합니다. 영구 저장소(minio) 및 메타데이터 저장소(etcd) 종속성을 별도의 이미지로 분리하는 변형이 있습니다.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus 분산</h4><p>수천 QPS로 수십억 개의 벡터를 서비스하는 것과 같이 프로덕션 트래픽을 제공하는 대규모 배포의 경우 Milvus Distributed를 사용해야 합니다. 일부 사용자는 데이터 중복 제거 또는 레코드 연결과 같이 대규모 오프라인 일괄 처리를 수행하고자 할 수 있으며, 향후 Milvus 3.0 버전에서는 벡터 레이크라고 하는 보다 효율적인 방법을 제공할 예정입니다.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">완전 관리형 서비스</h4><p>DevOps에 대한 걱정 없이 애플리케이션 개발에만 집중하고 싶은 개발자를 위해 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud는</a> 무료 티어를 제공하는 완전 관리형 Milvus를 제공합니다.</p>
<p>자세한 내용은 <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Milvus 배포 개요"를</a> 참조하세요.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">얼마나 많은 메모리, 스토리지 및 컴퓨팅이 필요하나요?</h3><p>이 질문은 기존 Milvus 사용자뿐만 아니라 Milvus가 자신의 애플리케이션에 적합한지 고려 중인 사용자들에게도 많이 제기되는 질문입니다. 배포에 필요한 메모리, 스토리지, 컴퓨팅의 정확한 조합은 여러 요소의 복잡한 상호 작용에 따라 달라집니다.</p>
<p>벡터 임베딩은 사용되는 모델에 따라 차원이 다릅니다. 그리고 일부 벡터 검색 인덱스는 전적으로 메모리에 저장되는 반면, 다른 인덱스는 데이터를 디스크에 저장합니다. 또한 많은 검색 인덱스는 임베딩의 압축(양자화된) 사본을 저장할 수 있으며 그래프 데이터 구조를 위한 추가 메모리가 필요합니다. 이는 메모리와 저장 공간에 영향을 미치는 몇 가지 요인에 불과합니다.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvus 리소스 크기 조정 도구</h4><p>다행히도 Zilliz(Milvus 유지 관리 팀)는 이 질문에 대한 훌륭한 답변을 제공하는 <a href="https://milvus.io/tools/sizing">리소스 크기 조정 도구를</a> 만들었습니다. 벡터 차원, 인덱스 유형, 배포 옵션 등을 입력하면 도구가 다양한 유형의 Milvus 노드와 그 종속성에서 필요한 CPU, 메모리, 스토리지를 추정합니다. 마일리지는 다를 수 있으므로 데이터와 샘플 트래픽으로 실제 부하 테스트를 하는 것이 좋습니다.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">어떤 벡터 인덱스 또는 거리 메트릭을 선택해야 하나요?</h3><p>많은 사용자가 어떤 인덱스를 선택해야 하는지, 하이퍼파라미터를 어떻게 설정해야 하는지 잘 모릅니다. 먼저, 자동 인덱스를 선택하면 언제든지 인덱스 유형 선택을 Milvus로 연기할 수 있습니다. 그러나 특정 인덱스 유형을 선택하려는 경우 몇 가지 경험 법칙이 시작점을 제공합니다.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">인메모리 인덱스</h4><p>인덱스를 메모리에 완전히 맞추기 위해 비용을 지불하고 싶으신가요? 인메모리 인덱스는 일반적으로 가장 빠르지만 비용도 많이 듭니다. Milvus에서 지원하는 인덱스 목록과 지연 시간, 메모리, 리콜 측면에서 어떤 장단점이 있는지 알아보려면 <a href="https://milvus.io/docs/index.md?tab=floating">"인메모리 인덱스"</a> 를 참조하세요.</p>
<p>인덱스 크기는 단순히 벡터의 수에 차원과 부동소수점 크기를 곱한 값이 아니라는 점에 유의하세요. 대부분의 인덱스는 메모리 사용량을 줄이기 위해 벡터를 양자화하지만, 추가 데이터 구조를 위한 메모리가 필요합니다. 벡터가 아닌 다른 데이터(스칼라)와 그 인덱스도 메모리 공간을 차지합니다.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">온디스크 인덱스</h4><p>인덱스가 메모리에 맞지 않는 경우 Milvus에서 제공하는 <a href="https://milvus.io/docs/disk_index.md">'온디스크 인덱스</a> ' 중 하나를 사용할 수 있습니다. 지연 시간/리소스 트레이드오프가 매우 다른 두 가지 옵션은 <a href="https://milvus.io/docs/disk_index.md">DiskANN과</a> <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap입니다</a>.</p>
<p>DiskANN은 고도로 압축된 벡터 사본을 메모리에 저장하고, 압축되지 않은 벡터와 그래프 검색 구조는 디스크에 저장합니다. 디스크 읽기를 최소화하면서 벡터 공간을 검색하고 SSD의 빠른 랜덤 액세스 속도를 활용하기 위해 몇 가지 영리한 아이디어를 사용합니다. 지연 시간을 최소화하려면 SSD를 SATA가 아닌 NVMe를 통해 연결해야 최상의 I/O 성능을 얻을 수 있습니다.</p>
<p>엄밀히 말하면 MMap은 인덱스 유형이 아니라 인메모리 인덱스가 있는 가상 메모리를 사용하는 것을 말합니다. 가상 메모리를 사용하면 필요에 따라 디스크와 RAM 간에 페이지를 교체할 수 있으므로, 액세스 패턴이 한 번에 데이터의 일부만 사용하는 경우 훨씬 더 큰 인덱스를 효율적으로 사용할 수 있습니다.</p>
<p>DiskANN은 지연 시간이 우수하고 일관적입니다. MMap은 인메모리 페이지에 액세스할 때 지연 시간이 더 우수하지만, 페이지가 자주 교체되면 지연 시간이 급증할 수 있습니다. 따라서 MMap은 메모리 액세스 패턴에 따라 지연 시간의 변동성이 더 클 수 있습니다.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPU 인덱스</h4><p>세 번째 옵션은 <a href="https://milvus.io/docs/gpu_index.md">GPU 메모리와 계산을 사용하여 인덱스를</a> 구성하는 것입니다. Milvus의 GPU 지원은 Nvidia <a href="https://rapids.ai/">RAPIDS</a> 팀에서 제공합니다. GPU 벡터 검색은 해당 CPU 검색보다 지연 시간이 짧을 수 있지만, 일반적으로 GPU의 병렬성을 완전히 활용하려면 수백 또는 수천 개의 검색 QPS가 필요합니다. 또한 GPU는 일반적으로 CPU RAM보다 메모리가 적고 실행 비용이 더 많이 듭니다.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">거리 메트릭</h4><p>대답하기 쉬운 질문은 벡터 간의 유사성을 측정하기 위해 어떤 거리 메트릭을 선택해야 하는가입니다. 임베딩 모델이 학습된 것과 동일한 거리 메트릭을 선택하는 것이 좋습니다(일반적으로 COSINE(또는 입력이 정규화된 경우 IP)). 모델의 소스(예: HuggingFace의 모델 페이지)에서 어떤 거리 측정 기준을 사용했는지 확인할 수 있습니다. Zilliz는 또한 이를 조회할 수 있는 편리한 <a href="https://zilliz.com/ai-models">표를</a> 작성했습니다.</p>
<p>요약하자면, 인덱스 선택과 관련된 많은 불확실성은 이러한 선택이 배포의 지연 시간/리소스 사용량/리콜 트레이드오프에 어떤 영향을 미치는지에 대한 불확실성에서 비롯된다고 생각합니다. 위의 경험 법칙을 사용해 인메모리, 온디스크 또는 GPU 인덱스 중 하나를 결정한 다음 Milvus 문서에 제시된 절충 지침을 사용해 특정 인덱스를 선택하는 것이 좋습니다.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">고장난 Milvus 분산 배포를 수정할 수 있나요?</h3><p>구성, 도구, 디버깅 로그와 관련된 질문과 함께 Milvus Distributed 배포를 시작하고 실행하는 문제와 관련된 질문이 많습니다. 각 질문이 서로 다르기 때문에 한 가지 해결책을 제시하기는 어렵지만, 다행히도 Milvus에는 <a href="https://milvus.io/discord">활발한 Discord가</a> 있어 도움을 요청할 수 있고 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">전문가와의 1:1 상담 시간도</a> 제공합니다.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Windows에 Milvus를 배포하려면 어떻게 해야 하나요?</h3><p>여러 번 제기된 질문 중 하나는 Windows 머신에 Milvus를 배포하는 방법에 관한 것이었습니다. 여러분의 피드백을 바탕으로 이에 대한 문서를 다시 작성했습니다. <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Linux용 Windows 하위 시스템 2(WSL2)를</a> 사용하는 방법은 <a href="https://milvus.io/docs/install_standalone-windows.md">Docker에서 Milvus 실행하기(Windows)를</a> 참조하세요.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">성능 및 프로파일링<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>배포 유형을 선택하고 실행한 사용자는 최적의 결정을 내렸다는 확신을 갖고 싶어하며 배포의 성능과 상태를 프로파일링하고 싶어합니다. 성능을 프로파일링하고, 상태를 관찰하고, 무엇을 왜 왜 하는지에 대한 인사이트를 얻는 방법과 관련된 질문이 많습니다.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">성능은 어떻게 측정하나요?</h3><p>사용자는 배포의 성능과 관련된 메트릭을 확인하여 병목 현상을 이해하고 해결하고자 합니다. 언급되는 메트릭에는 평균 쿼리 지연 시간, 지연 시간 분포, 쿼리 볼륨, 메모리 사용량, 디스크 스토리지 등이 포함됩니다. <a href="https://milvus.io/docs/monitor_overview.md">기존 모니터링 시스템에서는</a> 이러한 지표를 얻는 것이 어려웠지만, Milvus 2.5에서는 사용자 친화적인 웹 인터페이스에서 이 모든 정보에 액세스할 수 있는 <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI라는</a> 새로운 시스템을 도입했습니다(피드백 환영!).</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">현재 Milvus 내부에서 무슨 일이 일어나고 있을까요(즉, 상태 관찰)?</h3><p>이와 관련하여 사용자는 배포의 내부 상태를 관찰하기를 원합니다. 검색 인덱스 구축에 시간이 오래 걸리는 이유, 클러스터가 정상인지 확인하는 방법, 쿼리가 노드 간에 어떻게 실행되는지 이해하는 것 등이 제기되는 문제입니다. 이러한 질문의 대부분은 시스템이 내부적으로 수행하는 작업에 대한 투명성을 제공하는 새로운 <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI를</a> 통해 답을 얻을 수 있습니다.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">내부의 일부 (복잡한) 측면은 어떻게 작동하나요?</h3><p>고급 사용자는 세그먼트 봉인이나 메모리 관리와 같이 Milvus 내부에 대해 어느 정도 이해하고 싶어하는 경우가 많습니다. 기본 목표는 일반적으로 성능을 개선하고 때로는 문제를 디버깅하는 것입니다. 특히 '개념' 및 '관리 가이드' 섹션의 문서, 예를 들어 <a href="https://milvus.io/docs/architecture_overview.md">'Milvus 아키텍처 개요'</a> 및 <a href="https://milvus.io/docs/clustering-compaction.md">'클러스터링 압축'</a> 페이지를 참조하면 도움이 됩니다. Milvus 내부에 대한 설명서를 지속적으로 개선하고 이해하기 쉽게 만들 것이며, <a href="https://milvus.io/discord">Discord를</a> 통해 피드백이나 요청을 보내주시면 언제든지 환영합니다.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">어떤 임베딩 모델을 선택해야 하나요?</h3><p>밋업, 업무 시간, Discord에서 성능과 관련된 질문은 임베딩 모델을 선택하는 방법에 관한 것입니다. 이 질문은 명확한 답변을 드리기 어려운 질문이지만, <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">모든 MiniLM-L6-v2와</a> 같은 기본 모델부터 시작하는 것을 권장합니다.</p>
<p>검색 인덱스의 선택과 마찬가지로 컴퓨팅, 저장, 리콜 사이에도 장단점이 있습니다. 출력 차원이 큰 임베딩 모델은 다른 모든 것이 동일할 경우 더 많은 저장 공간이 필요하지만, 관련 항목의 회상률이 높아질 수 있습니다. 고정된 차원에 대해 더 큰 임베딩 모델은 일반적으로 더 작은 임베딩 모델보다 리콜 측면에서 더 나은 성능을 보이지만, 컴퓨팅과 시간이 더 많이 소요됩니다. <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB와</a> 같이 임베딩 모델 성능의 순위를 매기는 리더보드는 특정 데이터 및 작업과 맞지 않을 수 있는 벤치마크를 기반으로 합니다.</p>
<p>따라서 '최고의' 임베딩 모델을 생각하는 것은 의미가 없습니다. 임베딩을 계산하기 위한 컴퓨팅 및 시간 예산을 충족하고 리콜이 허용 가능한 모델부터 시작하세요. 데이터를 미세 조정하거나 컴퓨팅/리콜의 절충점을 경험적으로 탐색하는 등의 추가 최적화는 운영 시스템을 구축한 이후로 미룰 수 있습니다.</p>
<h2 id="Data-Management" class="common-anchor-header">데이터 관리<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 배포에서 데이터를 이동하는 방법은 Discord 토론의 또 다른 주요 주제이며, 이 작업이 애플리케이션을 프로덕션에 적용하는 데 얼마나 중요한지를 고려할 때 당연한 일입니다.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">X에서 Milvus로 데이터를 마이그레이션하려면 어떻게 해야 하나요? 독립형에서 분산형으로 데이터를 마이그레이션하려면 어떻게 해야 하나요? 2.4.x에서 2.5.x로 마이그레이션하려면 어떻게 해야 하나요?</h3><p>신규 사용자는 일반적으로 <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch와</a> 같은 기존 검색 엔진과 <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> 또는 <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant와</a> 같은 기타 벡터 데이터베이스를 포함한 다른 플랫폼에서 기존 데이터를 Milvus로 가져오려고 합니다. 기존 사용자도 Milvus 배포에서 다른 배포로 데이터를 마이그레이션하거나 <a href="https://docs.zilliz.com/docs/migrate-from-milvus">자체 호스팅 Milvus에서 완전 관리형 질리즈 클라우드로</a> 데이터를 마이그레이션하고자 할 수 있습니다.</p>
<p><a href="https://github.com/zilliztech/vts">VTS(벡터 전송 서비스)</a> 와 Zilliz Cloud의 관리형 <a href="https://docs.zilliz.com/docs/migrations">마이그레이션</a> 서비스는 이러한 목적을 위해 설계되었습니다.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">데이터 백업은 어떻게 저장하고 로드하나요? Milvus에서 데이터를 내보내려면 어떻게 하나요?</h3><p>Milvus에는 영구 스토리지에 스냅샷을 생성하고 복원할 수 있는 전용 도구인 <a href="https://github.com/zilliztech/milvus-backup">milvus-backup이</a> 있습니다.</p>
<h2 id="Next-Steps" class="common-anchor-header">다음 단계<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>벡터 데이터베이스로 구축할 때 직면하는 일반적인 문제를 해결하는 방법에 대한 몇 가지 팁을 얻으셨기를 바랍니다. 이를 통해 문서와 기능 로드맵을 다시 한 번 살펴보고 커뮤니티가 Milvus로 최고의 성공을 거두는 데 도움이 될 수 있는 작업을 계속할 수 있었습니다. 제가 강조하고 싶은 핵심 사항은 여러분의 선택에 따라 컴퓨팅, 저장 공간, 지연 시간, 리콜 사이의 절충점이 달라진다는 점입니다. <em>이러한 모든 성능 기준을 동시에 최대화할 수는 없으며 '최적의' 배포는 존재하지 않습니다. 하지만 벡터 검색과 분산 데이터베이스 시스템이 어떻게 작동하는지에 대해 자세히 이해하면 정보에 입각한 결정을 내릴 수 있습니다.</em></p>
<p>2024년의 수많은 게시물을 샅샅이 훑어보고 나니 '왜 사람이 이 일을 해야 할까'라는 생각이 들었습니다. 대량의 텍스트를 분석하고 인사이트를 추출하는 이러한 작업을 제너레이티브 AI가 해결해 줄 수 있지 않을까요? <em>토론 포럼에서 인사이트를 추출하기 위한 다중 에이전트 시스템의</em> 설계와 구현에 대해 살펴보는 이 블로그 게시물의 두 번째 파트(곧 게시 예정)에 참여해 주세요 <em>.</em></p>
<p>다시 한 번 감사드리며, 커뮤니티 <a href="https://milvus.io/discord">Discord와</a> 다음 <a href="https://lu.ma/unstructured-data-meetup">비정형 데이터</a> 밋업에서 뵙기를 기대합니다. 보다 실질적인 도움이 필요하시면 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1:1 오피스 아워를</a> 예약해 주세요. <em>여러분의 피드백은 Milvus를 개선하는 데 필수적입니다!</em></p>
