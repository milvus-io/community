---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: Milvus 오퍼레이터로 더욱 쉬워진 Kubernetes에서의 Milvus 배포
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator는 Milvus 벡터 데이터베이스 배포의 전체 라이프사이클을 자동화하는 Kubernetes 네이티브 관리
  도구입니다.
cover: >-
  https://assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>프로덕션 준비가 완료된 Milvus 클러스터를 설정하는 것은 폭탄을 해체하는 것처럼 느껴지지 않아야 합니다. 하지만 벡터 데이터베이스를 위해 Kubernetes 배포를 수동으로 구성해본 사람이라면 수십 개의 YAML 파일, 복잡한 종속성 관리, 새벽 2시에 무언가 고장 났는데 47개의 구성 파일 중 어떤 것이 원인인지 모를 때 느끼는 허탈감을 잘 알고 있을 것입니다.</p>
<p>Milvus를 배포하는 전통적인 접근 방식은 메타데이터 저장소를 위한 etcd, 메시지 큐를 위한 Pulsar, 개체 저장소를 위한 MinIO, 그리고 다양한 Milvus 구성 요소 자체 등 여러 서비스를 오케스트레이션하는 것을 포함합니다. 각 서비스에는 신중한 구성, 적절한 시작 순서, 지속적인 유지 관리가 필요합니다. 이를 여러 환경이나 클러스터에 걸쳐 확장하면 운영 복잡성이 압도적으로 증가합니다.</p>
<p>바로 이 부분에서 <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator가</strong></a> 근본적으로 판도를 바꿉니다. 인프라를 수동으로 관리하는 대신 사용자가 원하는 것을 설명하면 운영자가 그 방법을 처리합니다.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">밀버스 오퍼레이터란 무엇인가요?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Operator는</strong></a> Milvus 벡터 데이터베이스 배포의 전체 라이프사이클을 자동화하는 Kubernetes 네이티브 관리 도구입니다. Kubernetes Operator 패턴을 기반으로 구축된 이 도구는 프로덕션 환경에서 Milvus를 실행하는 데 대한 수년간의 운영 지식을 요약하고 해당 전문 지식을 클러스터와 함께 실행되는 소프트웨어로 코드화합니다.</p>
<p>잠도 자지 않고, 오타도 내지 않으며, 모든 구성 세부 사항을 완벽하게 기억하는 전문 Milvus 관리자가 있다고 생각하면 됩니다. 오퍼레이터는 클러스터의 상태를 지속적으로 모니터링하고, 확장 결정을 자동으로 처리하며, 다운타임 없이 업그레이드를 관리하고, 사람보다 더 빠르게 장애를 복구합니다.</p>
<p>Operator는 기본적으로 네 가지 필수 기능을 제공합니다.</p>
<ul>
<li><p><strong>자동화된 배포</strong>: 단일 매니페스트로 모든 기능을 갖춘 Milvus 클러스터를 설정하세요.</p></li>
<li><p><strong>수명 주기 관리</strong>: 정의된 안전한 순서에 따라 업그레이드, 수평적 확장, 리소스 해체를 자동화합니다.</p></li>
<li><p><strong>기본 제공 모니터링 및 상태 확인</strong>: etcd, Pulsar, MinIO를 비롯한 Milvus 구성 요소 및 관련 종속성의 상태를 지속적으로 모니터링하세요.</p></li>
<li><p><strong>기본으로 제공되는 운영 모범 사례</strong>: 플랫폼에 대한 깊은 지식 없이도 안정성을 보장하는 Kubernetes 네이티브 패턴을 적용하세요.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Kubernetes 오퍼레이터 패턴 이해하기</h3><p>Milvus Operator의 이점을 살펴보기 전에 먼저 그 기반이 되는 <strong>Kubernetes Operator 패턴을</strong> 이해해 보겠습니다 <strong>.</strong></p>
<p>쿠버네티스 오퍼레이터 패턴은 기본 쿠버네티스 기능 이상을 필요로 하는 복잡한 애플리케이션을 관리하는 데 도움이 됩니다. 오퍼레이터는 세 가지 주요 부분으로 구성된다:</p>
<ul>
<li><p><strong>사용자 정의 리소스 정의는</strong> 쿠버네티스 스타일의 구성 파일을 사용하여 애플리케이션을 설명할 수 있게 해준다.</p></li>
<li><p><strong>컨트롤러는</strong> 이러한 구성을 감시하고 클러스터에 필요한 변경을 수행합니다.</p></li>
<li><p><strong>상태 관리는</strong> 클러스터가 사용자가 요청한 것과 일치하는지 확인하고 차이점을 수정합니다.</p></li>
</ul>
<p>즉, 사용자는 익숙한 방식으로 Milvus 배포를 설명할 수 있으며, 운영자는 파드 생성, 네트워킹 설정, 수명 주기 관리 등 모든 세부 작업을 처리합니다....</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">밀버스 오퍼레이터의 작동 방식<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator는 데이터베이스 관리를 훨씬 더 간단하게 만드는 간단한 프로세스를 따릅니다. Milvus Operator의 핵심 운영 모델을 세분화해 보겠습니다:</p>
<ol>
<li><p><strong>사용자 정의 리소스(CR)입니다:</strong> 사용자는 CR(예: 종류: <code translate="no">Milvus</code>)을 사용하여 Milvus 배포를 정의합니다. 이 파일에는 클러스터 모드, 이미지 버전, 리소스 요구 사항 및 종속성 등의 구성이 포함되어 있습니다.</p></li>
<li><p><strong>컨트롤러 로직:</strong> 운영자의 컨트롤러는 신규 또는 업데이트된 CR을 감시합니다. 변경 사항이 감지되면 필요한 구성 요소인 Milvus 서비스 및 etcd, Pulsar, MinIO와 같은 종속 요소의 생성을 오케스트레이션합니다.</p></li>
<li><p><strong>자동화된 수명 주기 관리:</strong> 버전 업데이트나 스토리지 수정과 같은 변경 사항이 발생하면 운영자는 클러스터를 중단하지 않고 롤링 업데이트를 수행하거나 구성 요소를 재구성합니다.</p></li>
<li><p><strong>자가 치유:</strong> 컨트롤러는 각 구성 요소의 상태를 지속적으로 확인합니다. 충돌이 발생하면 자동으로 파드를 교체하거나 서비스 상태를 복원하여 가동 시간을 보장합니다.</p></li>
</ol>
<p>이 접근 방식은 초기 설정이 아닌 지속적인 관리를 제공하기 때문에 기존의 YAML이나 Helm 배포보다 훨씬 더 강력합니다.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">왜 헬름이나 YAML 대신 밀버스 오퍼레이터를 사용해야 하나요?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 배포할 때 수동 YAML 파일, Helm 차트 또는 Milvus Operator 중에서 선택할 수 있습니다. 각각 고유한 장점이 있지만, Operator는 지속적인 운영에 상당한 이점을 제공합니다.</p>
<h3 id="Operation-Automation" class="common-anchor-header">운영 자동화</h3><p>기존 방식은 일상적인 작업에 수작업이 필요합니다. 확장은 여러 구성 파일을 업데이트하고 변경 사항을 조정하는 것을 의미합니다. 업그레이드는 서비스 중단을 피하기 위해 신중한 계획이 필요합니다. 운영자는 이러한 작업을 자동으로 처리합니다. 스케일링이 필요한 시기를 감지하여 안전하게 변경을 수행할 수 있습니다. 업그레이드는 운영자가 필요한 경우 적절한 시퀀싱 및 롤백 기능을 사용하여 실행하는 간단한 구성 업데이트가 됩니다.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">상태 가시성 향상</h3><p>YAML 파일은 사용자가 원하는 것을 쿠버네티스에 알려주지만 시스템의 현재 상태를 보여주지는 않습니다. 헬름은 구성 관리를 지원하지만 애플리케이션의 런타임 상태를 모니터링하지는 않는다. 오퍼레이터는 전체 클러스터를 지속적으로 감시합니다. 리소스 문제나 느린 응답과 같은 문제를 감지하여 심각한 문제가 되기 전에 조치를 취할 수 있습니다. 이러한 사전 예방적 모니터링은 안정성을 크게 향상시킵니다.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">보다 쉬운 장기 관리</h3><p>YAML 파일로 여러 환경을 관리한다는 것은 많은 구성 파일을 동기화한다는 것을 의미합니다. 헬름 템플릿을 사용하더라도 복잡한 작업에는 여전히 상당한 수동 조정이 필요합니다.</p>
<p>오퍼레이터는 Milvus 관리 지식을 코드에 캡슐화합니다. 이는 팀이 모든 구성 요소의 전문가가 되지 않고도 클러스터를 효과적으로 관리할 수 있음을 의미합니다. 운영 인터페이스는 인프라 확장에 따라 일관성을 유지합니다.</p>
<p>Operator를 사용한다는 것은 Milvus 관리에 대한 보다 자동화된 접근 방식을 선택한다는 의미입니다. 내장된 전문 지식을 통해 수작업을 줄이면서 안정성을 향상시키므로, 벡터 데이터베이스가 애플리케이션에 더욱 중요해짐에 따라 매우 유용한 이점이 있습니다.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">Milvus 운영의 아키텍처</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>이 다이어그램은 Kubernetes 클러스터 내에서 Milvus Operator의 배포 구조를 명확하게 보여줍니다:</p>
<ul>
<li><p>왼쪽(파란색 영역): 컨트롤러와 Milvus-CRD를 포함한 Operator의 핵심 구성 요소.</p></li>
<li><p>오른쪽(녹색 영역): 프록시, 코디네이터, 노드 등 Milvus 클러스터의 다양한 구성 요소.</p></li>
<li><p>가운데(화살표 - "생성/관리"): 운영자가 Milvus 클러스터를 관리하는 방법을 보여주는 작업 흐름입니다.</p></li>
<li><p>하단(주황색 영역): etcd 및 MinIO/S3/MQ와 같은 종속 서비스.</p></li>
</ul>
<p>뚜렷한 색상의 블록과 방향 화살표가 있는 이 시각적 구조는 서로 다른 구성 요소 간의 상호 작용과 데이터 흐름을 효과적으로 명확히 보여줍니다.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">밀버스 오퍼레이터 시작하기<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>이 워크스루에서는 오퍼레이터를 사용하여 Milvus를 배포하는 방법을 보여줍니다. 이 가이드에서는 다음 버전을 사용합니다.</p>
<ul>
<li><p><strong>운영 체제</strong>: 오픈 오일러 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>쿠버네티스</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) 전제 조건</h3><p>Kubernetes 클러스터에 하나 이상의 StorageClass가 구성되어 있어야 합니다. 사용 가능한 것을 확인할 수 있습니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>이 예에서는 두 가지 옵션이 있습니다:</p>
<ul>
<li><p><code translate="no">local</code> (기본값) - 로컬 디스크 사용</p></li>
<li><p><code translate="no">nfs-sc</code>- NFS 스토리지 사용(테스트용으로는 괜찮지만 프로덕션에서는 피함)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Milvus 오퍼레이터 설치하기</h3><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">헬름</a> 또는 <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl로</a> 오퍼레이터를 설치할 수 있다. 여기서는 더 간단하기 때문에 kubectl을 사용하겠습니다.</p>
<p>오퍼레이터 배포 매니페스트를 다운로드한다:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>이미지 주소를 바꿉니다(선택 사항):</p>
<p><strong>선택 사항: 다른 이미지 레지스트리 사용</strong> DockerHub에 액세스할 수 없거나 자체 레지스트리를 선호하는 경우<strong>다른 이미지 레지스트리를 사용합니다</strong>:</p>
<p><em>참고: 여기에 제공된 이미지 리포지토리 주소는 테스트용입니다. 필요에 따라 실제 리포지토리 주소로 바꾸세요.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Operator를 설치합니다:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>설치 후 다음과 유사한 출력이 표시됩니다:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Milvus Operator 배포 및 포드 리소스를 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Milvus 클러스터 배포하기</h3><p>Milvus Operator 파드가 실행 중이면 다음 단계에 따라 Milvus 클러스터를 배포할 수 있습니다.</p>
<p>Milvus 클러스터 배포 매니페스트를 다운로드합니다:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>기본 구성은 최소한의 구성입니다:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>실제 배포를 위해서는 사용자 정의해야 합니다:</strong></p>
<ul>
<li><p>사용자 지정 클러스터 이름: <code translate="no">milvus-release-v25</code></p></li>
<li><p>사용자 지정 이미지: (다른 온라인 이미지 또는 로컬 오프라인 이미지 사용) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>사용자 지정 스토리지 클래스 이름: 여러 스토리지 클래스가 있는 환경에서는 MinIO 및 etcd와 같은 영구 구성 요소에 대해 StorageClass를 지정해야 할 수 있습니다. 이 예에서는 <code translate="no">nfs-sc</code> 을 사용했습니다.</p></li>
<li><p>사용자 지정 리소스: Milvus 컴포넌트에 대한 CPU 및 메모리 제한을 설정합니다. 기본적으로 제한이 설정되어 있지 않으므로 쿠버네티스 노드에 과부하가 걸릴 수 있습니다.</p></li>
<li><p>관련 리소스 자동 삭제: 기본적으로 Milvus 클러스터가 삭제되면 관련 리소스는 유지됩니다.</p></li>
</ul>
<p>추가 파라미터 구성은 다음을 참조하세요:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Milvus 사용자 정의 리소스 정의</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">펄서 값</a></p></li>
</ul>
<p>수정된 매니페스트는 다음과 같습니다:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 클러스터를 배포합니다:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Milvus 클러스터 상태 확인</h4><p>Milvus 운영자는 Milvus 구성 요소(예: 프록시, 코디네이터, 노드)를 배포하기 전에 먼저 Milvus의 미들웨어 종속성(예: etcd, Zookeeper, Pulsar, MinIO 등)을 설정합니다.</p>
<p>배포 보기:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>특별 참고 사항:</p>
<p>Milvus 운영자가 0개의 복제본이 있는 <code translate="no">standalone</code> 및 <code translate="no">querynode-1</code> 배포를 생성하는 것을 볼 수 있습니다.</p>
<p>이는 의도적인 것입니다. Milvus 운영자 리포지토리에 문제를 제출했으며, 공식적인 답변은 다음과 같습니다:</p>
<ul>
<li><p>a. 배포는 예상대로 작동합니다. 서비스 중단 없이 클러스터에서 독립 실행형 배포로 원활하게 전환할 수 있도록 독립 실행형 버전이 유지됩니다.</p></li>
<li><p>b. 롤링 업그레이드 시 <code translate="no">querynode-0</code> 과 <code translate="no">querynode-1</code> 을 모두 보유하는 것이 유용합니다. 결국에는 둘 중 하나만 활성화됩니다.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">모든 파드가 올바르게 실행되고 있는지 확인</h4><p>Milvus 클러스터가 준비되면 모든 파드가 예상대로 실행되는지 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">스토리지클래스 확인</h4><p>사용자 정의 스토리지 클래스(<code translate="no">nfs-sc</code>)와 지정된 스토리지 용량이 올바르게 적용되었는지 확인합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Milvus 리소스 제한 확인</h4><p>예를 들어, <code translate="no">mixcoord</code> 구성 요소에 대한 리소스 제한이 올바르게 적용되었는지 확인하려면 다음을 실행합니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">사용자 정의 이미지 확인</h4><p>올바른 사용자 정의 이미지가 사용 중인지 확인합니다:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) 외부에서 클러스터에 액세스하기</h3><p>일반적인 질문은 쿠버네티스 클러스터 외부에서 어떻게 Milvus 서비스에 액세스할 수 있는가 하는 것입니다.</p>
<p>기본적으로 운영자가 배포한 Milvus 서비스는 <code translate="no">ClusterIP</code> 유형으로, 클러스터 내에서만 액세스할 수 있습니다. 외부로 노출하려면 외부 액세스 방법을 정의해야 합니다. 이 가이드에서는 가장 간단한 접근 방식인 NodePort를 사용합니다.</p>
<p>외부 액세스를 위한 서비스 매니페스트를 만들고 편집합니다:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>다음 내용을 포함하세요:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>외부 서비스 매니페스트를 적용합니다:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>외부 서비스의 상태를 확인합니다:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Milvus WebUI에 액세스하기</li>
</ol>
<p>Milvus는 직관적인 인터페이스로 통합 가시성을 향상시키는 기본 제공 GUI인 Milvus WebUI를 제공합니다. 이를 사용하여 Milvus 구성 요소 및 해당 종속성에 대한 메트릭을 모니터링하고, 데이터베이스 및 컬렉션에 대한 자세한 정보를 검토하고, 전체 구성 세부 정보를 검사할 수 있습니다. 자세한 내용은 <a href="https://milvus.io/docs/milvus-webui.md">공식 Milvus WebUI 설명서를</a> 참조하세요.</p>
<p>배포 후 브라우저에서 다음 URL을 엽니다( <code translate="no">&lt;any_k8s_node_IP&gt;</code> 을 Kubernetes 노드의 IP 주소로 바꾸세요):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>그러면 WebUI 인터페이스가 시작됩니다.</p>
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
    </button></h2><p><strong>Milvus Operator는</strong> 단순한 배포 도구가 아니라 벡터 데이터베이스 인프라의 운영 우수성을 위한 전략적 투자입니다. 일상적인 작업을 자동화하고 모범 사례를 쿠버네티스 환경에 포함시킴으로써 팀은 가장 중요한 것, 즉 AI 기반 애플리케이션 구축과 개선에 집중할 수 있습니다.</p>
<p>운영자 기반 관리를 채택하려면 워크플로우와 팀 프로세스를 변경하는 등 약간의 사전 노력이 필요합니다. 하지만 대규모로 운영 중이거나 계획 중인 조직의 경우 안정성 향상, 운영 오버헤드 감소, 더 빠르고 일관된 배포 주기 등 장기적으로 얻을 수 있는 이점이 상당합니다.</p>
<p>AI가 현대 비즈니스 운영의 핵심으로 자리 잡으면서 강력하고 확장 가능한 벡터 데이터베이스 인프라에 대한 필요성은 더욱 커지고 있습니다. Milvus Operator는 워크로드에 따라 확장되고 특정 요구 사항에 맞게 조정되는 성숙한 자동화 우선 접근 방식을 제공함으로써 이러한 발전을 지원합니다.</p>
<p>팀이 운영상의 복잡성에 직면하거나, 성장을 예상하거나, 단순히 수동 인프라 관리를 줄이고자 하는 경우, Milvus Operator를 조기에 도입하면 향후 기술 부채를 방지하고 전반적인 시스템 복원력을 개선하는 데 도움이 될 수 있습니다.</p>
<p>인프라의 미래는 지능적이고 자동화되어 있으며 개발자 친화적입니다. <strong>밀버스 오퍼레이터는 데이터베이스 레이어에 바로 그 미래를 가져다줍니다.</strong></p>
<hr>
