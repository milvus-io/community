---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: '기술 공유: Docker Compose를 사용하여 Milvus 2.0에 구성 변경 사항 적용하기'
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Milvus 2.0에서 구성 변경 사항 적용 방법 알아보기
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>기술 공유: Docker Compose를 사용하여 Milvus 2.0에 구성 변경 사항 적용하기</custom-h1><p><em>징징 지아 질리즈 데이터 엔지니어는 서안교통대학교에서 컴퓨터 공학을 전공하고 졸업했습니다. Zilliz에 입사한 후 주로 데이터 전처리, AI 모델 배포, Milvus 관련 기술 연구, 커뮤니티 사용자의 애플리케이션 시나리오 구현 지원 업무를 담당하고 있습니다. 인내심이 강하고 커뮤니티 파트너들과 소통하는 것을 좋아하며 음악 감상과 애니메이션 시청을 즐깁니다.</em></p>
<p>밀버스를 자주 사용하는 사람으로서 새로 출시된 밀버스 2.0 RC에 대해 매우 기대가 컸습니다. 공식 웹사이트의 소개에 따르면 Milvus 2.0은 이전 버전보다 큰 폭으로 성능이 향상되었다고 합니다. 그래서 직접 사용해보고 싶었습니다.</p>
<p>그리고 실제로 사용해 보았습니다.  하지만 실제로 Milvus 2.0을 사용해보니 Milvus 1.1.1에서처럼 Milvus 2.0의 구성 파일을 쉽게 수정할 수 없다는 것을 깨달았습니다. 도커 컴포즈로 시작한 Milvus 2.0의 도커 컨테이너 내부의 설정 파일을 변경할 수 없었고, 심지어 강제 변경도 적용되지 않았습니다. 나중에 Milvus 2.0 RC가 설치 후 구성 파일 변경을 감지하지 못한다는 사실을 알게 되었습니다. 향후 안정 버전에서는 이 문제가 해결될 예정입니다.</p>
<p>여러 가지 방법을 시도한 끝에 Milvus 2.0 스탠드얼론 및 클러스터의 구성 파일에 변경 사항을 적용하는 안정적인 방법을 찾았으며, 그 방법은 다음과 같습니다.</p>
<p>모든 구성 변경은 Docker Compose를 사용하여 Milvus를 다시 시작하기 전에 수행해야 한다는 점에 유의하세요.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Milvus 스탠드얼론에서 구성 파일 수정하기<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 <strong>milvus.yaml</strong> 파일의 사본을 로컬 장치에 <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">다운로드해야</a> 합니다.</p>
<p>그런 다음 파일에서 구성을 변경할 수 있습니다. 예를 들어 로그 형식을 <code translate="no">.json</code> 로 변경할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>milvus <strong>.yaml</strong> 파일을 수정한 후에는 독립 실행형용 <strong>docker-compose.yaml</strong> 파일도 <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">다운로드하여</a> 수정해야 합니다( <code translate="no">volumes</code> 섹션의 구성 파일 <code translate="no">/milvus/configs/milvus.yaml</code> 에 해당하는 docker 컨테이너 경로에 milvus.yaml의 로컬 경로를 매핑하여 수정하세요).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>마지막으로 <code translate="no">docker-compose up -d</code> 을 사용하여 Milvus 스탠드얼론을 시작하고 수정이 성공했는지 확인합니다. 예를 들어 <code translate="no">docker logs</code> 을 실행하여 로그 형식을 확인합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Milvus 클러스터에서 구성 파일 수정하기<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 <strong>milvus.yaml</strong> 파일을 <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">다운로드하여</a> 필요에 맞게 수정합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>그런 다음 모든 구성 요소의 구성 파일(예: 루트 좌표, 데이터 좌표, 데이터 노드, 쿼리 좌표, 쿼리 노드, 인덱스 좌표, 인덱스 노드 및 프록시)의 해당 경로에 <strong>milvus.yaml의</strong> 로컬 경로를 매핑하여 클러스터 <strong>docker-compose.yml</strong> 파일을 <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">다운로드</a> 및 수정해야 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1. </span> <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>마지막으로 <code translate="no">docker-compose up -d</code> 을 사용하여 Milvus 클러스터를 시작하고 수정이 성공했는지 확인할 수 있습니다.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">구성 파일에서 로그 파일 경로 변경<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>먼저 <strong>milvus.yaml</strong> 파일을 <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">다운로드하고</a>, <code translate="no">rootPath</code> 섹션을 Docker 컨테이너에서 로그 파일을 저장할 디렉토리로 변경합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>그런 다음 Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">독립형</a> 또는 <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">클러스터에</a> 해당하는 <strong>docker-compose.yml</strong> 파일을 다운로드합니다.</p>
<p>스탠드얼론의 경우, <strong>milvus.yaml의</strong> 로컬 경로를 해당 도커 컨테이너 경로의 구성 파일 <code translate="no">/milvus/configs/milvus.yaml</code> 에 매핑하고 로컬 로그 파일 디렉터리를 이전에 생성한 도커 컨테이너 디렉터리에 매핑해야 합니다.</p>
<p>클러스터의 경우 모든 구성 요소에서 두 경로를 모두 매핑해야 합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>마지막으로 <code translate="no">docker-compose up -d</code> 을 사용하여 Milvus 스탠드얼론 또는 클러스터를 시작하고 로그 파일을 확인하여 수정이 성공했는지 확인합니다.</p>
