---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: 클라우드안 하이퍼스토어 및 S3 스토리지용 엔비디아 RDMA로 8배의 밀버스 성능 활용하기
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian과 NVIDIA는 S3 호환 스토리지용 RDMA를 도입하여 짧은 지연 시간으로 AI 워크로드를 가속화하고 Milvus에서
  8배의 성능 향상을 지원합니다.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>이 게시물은 원래 <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian에</a> 게시되었으며 허가를 받아 여기에 다시 게시되었습니다.</em></p>
<p>Cloudian은 13년 이상의 S3 API 구현 경험을 바탕으로 NVIDIA와 협력하여 HyperStore® 솔루션에 S3 호환 스토리지에 대한 RDMA 지원을 추가했습니다. 병렬 처리 아키텍처를 갖춘 S3-API 기반 플랫폼인 Cloudian은 이 기술 개발에 기여하고 이를 활용하는 데 독보적으로 적합합니다. 이번 협력은 오브젝트 스토리지 프로토콜에 대한 Cloudian의 심도 있는 전문성과 컴퓨팅 및 네트워크 가속에 대한 NVIDIA의 리더십을 활용하여 고성능 컴퓨팅과 엔터프라이즈급 스토리지를 원활하게 통합하는 솔루션을 개발하는 데 활용됩니다.</p>
<p>엔비디아는 S3 호환 스토리지용 RDMA(원격 직접 메모리 액세스) 기술을 곧 일반에 공개할 예정이며, 이는 AI 인프라 진화에 있어 중요한 이정표가 될 것입니다. 이 획기적인 기술은 최신 AI 워크로드의 방대한 데이터 요구 사항을 처리하는 방식을 혁신하여 전례 없는 성능 향상을 제공하는 동시에 S3 호환 오브젝트 스토리지를 클라우드 컴퓨팅의 기반으로 만든 확장성과 단순성을 유지합니다.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">S3 호환 스토리지용 RDMA란 무엇인가요?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>이번 출시는 스토리지 시스템이 AI 가속기와 통신하는 방식에 있어 근본적인 발전을 의미합니다. 이 기술은 기존의 CPU 매개 데이터 경로를 완전히 우회하여 S3 API 호환 오브젝트 스토리지와 GPU 메모리 간에 직접 데이터를 전송할 수 있게 해줍니다. 모든 데이터 전송을 CPU와 시스템 메모리를 통해 라우팅하여 병목 현상과 지연 시간을 유발하는 기존 스토리지 아키텍처와 달리, S3 호환 스토리지용 RDMA는 스토리지에서 GPU로 직접 연결되는 고속도로를 구축합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 기술의 핵심은 직접 경로를 통해 중간 단계를 없애 지연 시간을 줄이고, CPU 처리 요구량을 대폭 줄이며, 전력 소비를 크게 줄이는 것입니다. 그 결과, 까다로운 AI 애플리케이션을 위해 최신 GPU가 요구하는 속도로 데이터를 전송할 수 있는 스토리지 시스템이 탄생했습니다.</p>
<p>이 기술은 고성능 데이터 경로를 추가하면서 유비쿼터스 S3 API와의 호환성을 유지합니다. 명령은 여전히 표준 S3-API 기반 스토리지 프로토콜을 통해 실행되지만 실제 데이터 전송은 RDMA를 통해 GPU 메모리로 직접 이루어지므로 CPU를 완전히 우회하고 TCP 프로토콜 처리의 오버헤드를 제거합니다.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">획기적인 성능 결과<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>S3 호환 스토리지용 RDMA가 제공하는 성능 향상은 그야말로 혁신적입니다. 실제 테스트를 통해 이 기술이 AI 워크로드를 제약하는 스토리지 I/O 병목 현상을 제거할 수 있음을 입증했습니다.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">획기적인 속도 향상:</h3><ul>
<li><p><strong>노드당 35GB/s의 처리량</strong> (읽기) 측정, 클러스터 전반에서 선형 확장성 제공</p></li>
<li><p>Cloudian의 병렬 처리 아키텍처를 통해<strong>TB/s까지 확장 가능</strong> </p></li>
<li><p>기존 TCP 기반 오브젝트 스토리지 대비<strong>3~5배의 처리량 향상</strong> </p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">리소스 효율성 향상:</h3><ul>
<li><p>GPU로 직접 데이터 경로를 설정하여<strong>CPU 사용률 90% 감소</strong> </p></li>
<li><p>병목현상 제거로<strong>GPU 활용률 향상</strong> </p></li>
<li><p>처리 오버헤드 감소를 통한 전력 소비의 획기적인 감소</p></li>
<li><p>AI 스토리지 비용 절감</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">밀버스 바이 질리즈 벡터 DB에서 8배 성능 향상</h3><p>이러한 성능 향상은 특히 벡터 데이터베이스 작업에서 두드러지게 나타나며, <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> 및 <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S GPU를</a> 사용하는 Cloudian과 Zilliz 간의 협업은 CPU 기반 시스템 및 TCP 기반 데이터 전송과 비교했을 때 <strong>Milvus 작업에서 8배의 성능 향상을</strong> 보여주었습니다. 이는 스토리지가 제약이 되는 스토리지에서 AI 애플리케이션이 잠재력을 최대한 발휘할 수 있도록 지원하는 스토리지로 근본적인 전환을 의미합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">AI 워크로드를 위한 S3 API 기반 오브젝트 스토리지가 필요한 이유<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA 기술과 오브젝트 스토리지 아키텍처의 융합은 AI 인프라를 위한 이상적인 기반을 구축하여 기존 스토리지 접근 방식에 제약을 주었던 여러 문제를 해결합니다.</p>
<p><strong>AI의 데이터 폭증을 위한 엑사바이트급 확장성:</strong> 특히 합성 데이터와 멀티 모달 데이터가 포함된 AI 워크로드로 인해 스토리지 요구 사항이 100페타바이트 이상으로 증가하고 있습니다. 오브젝트 스토리지의 플랫 주소 공간은 페타바이트에서 엑사바이트까지 원활하게 확장할 수 있어 파일 기반 시스템을 제약하는 계층적 제한 없이 AI 학습 데이터 세트의 기하급수적인 증가를 수용할 수 있습니다.</p>
<p><strong>완벽한 AI 워크플로우를 위한 통합 플랫폼:</strong> 최신 AI 작업은 데이터 수집, 정리, 학습, 체크포인트, 추론에 걸쳐 이루어지며 각각 고유한 성능 및 용량 요구 사항이 있습니다. S3 호환 오브젝트 스토리지는 일관된 API 액세스를 통해 이 전체 스펙트럼을 지원하므로 여러 스토리지 계층을 관리하는 데 따르는 복잡성과 비용을 없앨 수 있습니다. 학습 데이터, 모델, 체크포인트 파일, 추론 데이터 세트는 모두 하나의 고성능 데이터 레이크에 저장할 수 있습니다.</p>
<p><strong>AI 운영을 위한 풍부한 메타데이터:</strong> 검색 및 열거와 같은 중요한 AI 작업은 기본적으로 메타데이터를 기반으로 합니다. 오브젝트 스토리지의 풍부한 맞춤형 메타데이터 기능은 복잡한 AI 모델 학습 및 추론 워크플로우에서 데이터를 구성하고 검색하는 데 필수적인 효율적인 데이터 태깅, 검색 및 관리를 지원합니다.</p>
<p><strong>경제성 및 운영상의 이점:</strong> S3 호환 오브젝트 스토리지는 업계 표준 하드웨어와 용량 및 성능의 독립적인 확장을 활용해 파일 스토리지 대안에 비해 총소유비용을 최대 80%까지 절감할 수 있습니다. 이러한 경제적 효율성은 AI 데이터 세트가 엔터프라이즈 규모에 도달함에 따라 더욱 중요해집니다.</p>
<p><strong>엔터프라이즈 보안 및 거버넌스:</strong> 커널 수준의 수정이 필요한 GPUDirect 구현과 달리, S3 호환 스토리지용 RDMA는 공급업체별 커널 변경이 필요하지 않으므로 시스템 보안과 규정 준수를 유지할 수 있습니다. 이 접근 방식은 데이터 보안과 규정 준수가 가장 중요한 의료 및 금융과 같은 분야에서 특히 유용합니다.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">앞으로 나아갈 길<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIA의 S3 호환 스토리지용 RDMA 일반 공개 발표는 단순한 기술적 이정표가 아니라 AI 인프라 아키텍처의 성숙을 의미합니다. 오브젝트 스토리지의 무한한 확장성과 GPU 직접 액세스의 획기적인 성능을 결합함으로써 조직은 마침내 야망에 따라 확장 가능한 AI 인프라를 구축할 수 있게 되었습니다.</p>
<p>AI 워크로드의 복잡성과 규모가 계속 증가함에 따라, S3 호환 스토리지용 RDMA는 조직이 데이터 주권과 운영 간소화를 유지하면서 AI 투자를 극대화할 수 있는 스토리지 기반을 제공합니다. 이 기술은 스토리지를 병목 현상에서 조력자로 전환하여 AI 애플리케이션이 엔터프라이즈 규모에서 잠재력을 최대한 발휘할 수 있도록 지원합니다.</p>
<p>AI 인프라 로드맵을 계획 중인 조직에게 S3 호환 스토리지용 RDMA의 일반 제공은 스토리지 성능이 최신 AI 워크로드의 요구 사항을 진정으로 충족하는 새로운 시대가 시작되었음을 의미합니다.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">업계 전망<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>AI가 의료 서비스 제공에서 점점 더 중심이 되어감에 따라, 우리는 인프라의 성능과 효율성을 높이기 위해 지속적으로 노력하고 있습니다. 대규모 데이터세트를 빠르게 처리하는 것이 환자 치료에 직접적인 영향을 미칠 수 있는 의료 영상 분석 및 진단 AI 애플리케이션에 있어, 엔비디아와 클라우디안의 새로운 S3 호환 스토리지용 RDMA는 S3-API 기반 스토리지 장치와 SSD 기반 NAS 스토리지 간의 데이터 이동 비용을 절감하는 데 매우 중요한 역할을 할 것입니다.  - <em>스왑닐 레인 박사, DNB, PDCC(신장병학), Mres(한의학), 온코패스 펠로우십, FRCPath 병리학 교수, PI, AI/컴퓨팅 병리학 및 이미징 랩 OIC- 디지털 및 컴퓨터 종양학과, 타타 메모리얼 센터 교수(F)</em></p>
<p>"엔비디아의 S3 호환용 RDMA 발표는 클라우디안 기반 AI 인프라 전략의 가치를 확인시켜 줍니다. 이를 통해 조직은 마이그레이션을 간소화하고 애플리케이션 개발 비용을 낮추는 S3 API 호환성을 유지하면서 대규모로 고성능 AI를 실행할 수 있습니다." - <em>Sunil Gupta, 공동 설립자, 전무 이사 겸 최고경영자(CEO), Yotta Data Services</em></p>
<p>"소버린 AI를 제공하기 위해 온프레미스 기능을 확장하는 과정에서 NVIDIA의 S3 호환 스토리지 기술용 RDMA와 Cloudian의 고성능 오브젝트 스토리지는 데이터 보존을 손상시키지 않고 커널 레벨을 수정할 필요 없이 우리에게 필요한 성능을 제공합니다. 중요한 AI 데이터를 완벽하게 제어하면서 엑사바이트로 확장할 수 있는 Cloudian HyperStore 플랫폼을 사용할 수 있습니다." - <em>로건 리, 카카오 부사장 겸 클라우드 부문 책임자</em></p>
<p>"곧 출시될 NVIDIA의 S3 호환 스토리지용 RDMA GA 릴리스에 대한 발표에 기대가 큽니다. 클라우디안과의 테스트를 통해 벡터 데이터베이스 작업에서 최대 8배의 성능 향상을 확인했으며, 이를 통해 밀버스 바이 질리즈 사용자들은 데이터 주권을 완벽하게 유지하면서 까다로운 AI 워크로드를 위한 클라우드급 성능을 달성할 수 있을 것입니다." - <em>Charles Xie, Zilliz의 설립자 겸 CEO</em></p>
