---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: '쿠버네티스에 밀버스 배포하기: Kubernetes 사용자를 위한 단계별 가이드'
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: 이 가이드는 Milvus 오퍼레이터를 사용하여 Kubernetes에서 Milvus를 설정하는 방법을 단계별로 명확하게 안내합니다.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus는</strong></a> 벡터 표현을 통해 방대한 양의 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터를</a> 저장, 색인 및 검색하도록 설계된 오픈 소스 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스로</a>, 유사성 검색, <a href="https://zilliz.com/glossary/semantic-search">시맨틱 검색</a>, 검색 증강 생성<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>, 추천 엔진 및 기타 머신 러닝 작업과 같은 AI 기반 애플리케이션에 적합합니다.</p>
<p>하지만 Milvus를 더욱 강력하게 만드는 것은 Kubernetes와의 원활한 통합입니다. Kubernetes 애호가라면 이 플랫폼이 확장 가능한 분산 시스템을 오케스트레이션하는 데 완벽하다는 것을 알고 계실 것입니다. Milvus는 Kubernetes의 기능을 최대한 활용하여 분산된 Milvus 클러스터를 쉽게 배포, 확장 및 관리할 수 있습니다. 이 가이드는 Milvus 운영자를 사용하여 Kubernetes에서 Milvus를 설정하기 위한 명확한 단계별 안내를 제공합니다.</p>
<h2 id="Prerequisites" class="common-anchor-header">전제 조건<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>시작하기 전에 다음 전제 조건이 갖추어져 있는지 확인하세요:</p>
<ul>
<li><p>Kubernetes 클러스터가 실행 중입니다. 로컬에서 테스트하는 경우, <code translate="no">minikube</code>.</p></li>
<li><p><code translate="no">kubectl</code> Kubernetes 클러스터와 상호 작용하도록 설치 및 구성.</p></li>
<li><p>파드, 서비스, 배포와 같은 기본 Kubernetes 개념에 익숙해야 합니다.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">1단계: 미니큐브 설치(로컬 테스트용)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>로컬 Kubernetes 환경을 설정해야 하는 경우, <code translate="no">minikube</code> 도구가 적합합니다. 공식 설치 지침은 <a href="https://minikube.sigs.k8s.io/docs/start/">미니큐브 시작하기 페이지에</a> 나와 있습니다.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. 미니큐브 설치</h3><p><a href="https://github.com/kubernetes/minikube/releases"> 미니큐브 릴리즈 페이지를</a> 방문하여 운영 체제에 적합한 버전을 다운로드하세요. macOS/Linux의 경우 다음 명령을 사용할 수 있습니다:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. 미니큐브 시작하기</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. 클러스터와 상호 작용하기</h3><p>이제 미니큐브 내부의 kubectl로 클러스터와 상호 작용할 수 있습니다. kubectl을 설치하지 않은 경우, 미니큐브는 기본적으로 적절한 버전을 다운로드합니다.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>또는 더 쉽게 사용할 수 있도록 <code translate="no">kubectl</code> 이라는 이름의 미니큐브 바이너리에 대한 심볼릭 링크를 생성할 수 있습니다.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">2단계: 스토리지클래스 구성<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>쿠버네티스에서 <strong>스토리지클래스는</strong> 워크로드에 사용할 수 있는 스토리지 유형을 정의하여 다양한 스토리지 구성을 유연하게 관리할 수 있도록 해준다. 계속 진행하기 전에, 클러스터에서 기본 스토리지클래스를 사용할 수 있는지 확인해야 한다. 필요한 경우 이를 확인하고 구성하는 방법은 다음과 같습니다.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. 설치된 StorageClass 확인</h3><p>쿠버네티스 클러스터에서 사용 가능한 스토리지클래스를 확인하려면 다음 명령을 실행한다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>그러면 클러스터에 설치된 스토리지 클래스 목록이 표시됩니다. 기본 StorageClass가 이미 구성된 경우, <code translate="no">(default)</code> 로 표시됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. 기본 스토리지 클래스 구성(필요한 경우) 2.</h3><p>기본 StorageClass가 설정되어 있지 않은 경우 YAML 파일에 정의하여 만들 수 있습니다. 다음 예제를 사용하여 기본 StorageClass를 생성합니다:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>이 YAML 구성은 로컬 개발 환경에서 일반적으로 사용되는 <code translate="no">minikube-hostpath</code> 프로비저너를 사용하는 <code translate="no">default-storageclass</code> 이라는 <code translate="no">StorageClass</code> 을 정의합니다.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. StorageClass 적용</h3><p><code translate="no">default-storageclass.yaml</code> 파일이 생성되면 다음 명령을 사용하여 클러스터에 적용합니다:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>이렇게 하면 클러스터에 대한 기본 StorageClass가 설정되어 향후 스토리지 요구 사항을 적절히 관리할 수 있습니다.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">3단계: Milvus 오퍼레이터를 사용하여 Milvus 설치하기<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator는 배포, 확장 및 업데이트를 관리하여 Kubernetes에 Milvus를 배포하는 작업을 간소화합니다. Milvus Operator를 설치하기 전에, Milvus Operator가 사용하는 웹훅 서버에 대한 인증서를 제공하는 <strong>cert-manager를</strong> 설치해야 합니다.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. 인증서 관리자 설치</h3><p>밀버스 오퍼레이터는 안전한 통신을 위해 인증서를 관리하기 위해 <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager가</a> 필요합니다. <strong>cert-manager 버전 1.1.3</strong> 이상을 설치해야 합니다. 설치하려면 다음 명령을 실행합니다:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>설치 후 다음을 실행하여 cert-manager 파드가 실행 중인지 확인합니다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. 밀버스 오퍼레이터 설치</h3><p>인증 매니저가 실행 중이면 Milvus 오퍼레이터를 설치할 수 있습니다. 다음 명령을 실행하여 <code translate="no">kubectl</code> 을 사용하여 배포합니다:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>다음 명령을 사용하여 Milvus Operator 파드가 실행 중인지 확인할 수 있습니다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Milvus 클러스터 배포</h3><p>Milvus Operator 파드가 실행 중이면, 운영자와 함께 Milvus 클러스터를 배포할 수 있습니다. 다음 명령은 기본 구성을 사용하여 별도의 파드에 구성 요소 및 종속 요소와 함께 Milvus 클러스터를 배포합니다:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 설정을 사용자 정의하려면 YAML 파일을 자체 구성 YAML 파일로 대체해야 합니다. 파일을 수동으로 편집하거나 생성하는 것 외에도 Milvus 크기 조정 도구를 사용하여 구성을 조정한 다음 해당 YAML 파일을 다운로드할 수 있습니다.</p>
<p>또는 보다 간소화된 접근 방식을 위해 <a href="https://milvus.io/tools/sizing"><strong>밀버스 사이징 도구를</strong></a> 사용할 수도 있습니다. 이 도구를 사용하면 리소스 할당 및 스토리지 옵션과 같은 다양한 설정을 조정한 다음 원하는 구성으로 해당 YAML 파일을 다운로드할 수 있습니다. 이렇게 하면 Milvus 배포가 특정 사용 사례에 맞게 최적화됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>그림: Milvus 사이징 도구</p>
<p>배포를 완료하는 데 시간이 다소 걸릴 수 있습니다. 명령을 통해 Milvus 클러스터의 상태를 확인할 수 있습니다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 클러스터가 준비되면 Milvus 클러스터의 모든 파드가 실행 중이거나 완료되어야 합니다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">4단계: Milvus 클러스터에 액세스하기<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 클러스터가 배포되면, 로컬 포트를 Milvus 서비스 포트로 포워딩하여 클러스터에 액세스해야 합니다. 다음 단계에 따라 서비스 포트를 검색하고 포트 포워딩을 설정하세요.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. 서비스 포트 가져오기</strong></h4><p>먼저 다음 명령을 사용하여 서비스 포트를 식별합니다. <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> 를 일반적으로 <code translate="no">my-release-milvus-proxy-</code> 로 시작하는 Milvus 프록시 파드의 이름으로 바꿉니다:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 명령은 Milvus 서비스가 사용 중인 포트 번호를 반환합니다.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. 포트 포워딩</strong></h4><p>Milvus 클러스터에 로컬로 액세스하려면 다음 명령을 사용하여 로컬 포트를 서비스 포트로 전달합니다. <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> 을 사용하려는 로컬 포트로 바꾸고 <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> 을 이전 단계에서 검색한 서비스 포트로 바꿉니다:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>이 명령을 사용하면 포트 포워딩이 호스트 컴퓨터의 모든 IP 주소에서 수신 대기할 수 있습니다. <code translate="no">localhost</code> 에서만 수신 대기할 서비스가 필요한 경우 <code translate="no">--address 0.0.0.0</code> 옵션을 생략할 수 있습니다.</p>
<p>포트 포워딩이 설정되면 추가 작업 또는 통합을 위해 지정된 로컬 포트를 통해 Milvus 클러스터에 액세스할 수 있습니다.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">5단계: Python SDK를 사용하여 Milvus에 연결하기<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 클러스터가 실행 중이면 이제 Milvus SDK를 사용하여 클러스터와 상호 작용할 수 있습니다. 이 예에서는 Milvus의 <strong>Python SDK인</strong> <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus를</a> 사용하여 클러스터에 연결하고 기본 작업을 수행하겠습니다.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. PyMilvus 설치</h3><p>Python을 통해 Milvus와 상호 작용하려면 <code translate="no">pymilvus</code> 패키지를 설치해야 합니다:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Milvus에 연결</h3><p>다음은 Milvus 클러스터에 연결하고 컬렉션 생성과 같은 기본 작업을 수행하는 방법을 보여주는 샘플 Python 스크립트입니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">설명:</h4><ul>
<li><p>Milvus에 연결: 이 스크립트는 4단계에서 설정한 로컬 포트를 사용하여 <code translate="no">localhost</code> 에서 실행 중인 Milvus 서버에 연결합니다.</p></li>
<li><p>컬렉션 만들기: <code translate="no">example_collection</code> 이라는 이름의 컬렉션이 이미 존재하는지 확인하고 존재하는 경우 삭제한 다음 768차원의 벡터로 새 컬렉션을 만듭니다.</p></li>
</ul>
<p>이 스크립트는 Milvus 클러스터에 대한 연결을 설정하고 컬렉션을 생성하여 벡터 삽입 및 유사도 검색 수행과 같은 보다 복잡한 작업을 위한 시작점 역할을 합니다.</p>
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
    </button></h2><p>Kubernetes의 분산 설정에서 Milvus를 배포하면 대규모 벡터 데이터를 관리할 수 있는 강력한 기능을 통해 원활한 확장성과 고성능 AI 기반 애플리케이션을 구현할 수 있습니다. 이 가이드를 따라 Milvus Operator를 사용하여 Milvus를 설정하는 방법을 배웠으므로 프로세스를 간소화하고 효율적으로 만들 수 있습니다.</p>
<p>Milvus를 계속 살펴보면서 증가하는 수요를 충족하기 위해 클러스터를 확장하거나 Amazon EKS, Google Cloud 또는 Microsoft Azure와 같은 클라우드 플랫폼에 배포하는 것을 고려해 보세요. 향상된 관리 및 모니터링을 위해 <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a>, <a href="https://github.com/zilliztech/attu"><strong>Attu와</strong></a> 같은 도구는 배포의 상태와 성능을 유지 관리하는 데 유용한 지원을 제공합니다.</p>
<p>이제 Kubernetes에서 Milvus의 잠재력을 최대한 활용하여 행복한 배포를 할 준비가 되었습니다! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">추가 리소스<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Milvus 문서</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite 대 독립형 대 분산형: 어떤 모드가 적합할까요? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">벡터 검색의 슈퍼차지: NVIDIA RAPIDS cuVS가 탑재된 GPU의 Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG란 무엇인가요? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">제너레이티브 AI 리소스 허브 | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">GenAI 앱을 위한 최고 성능의 AI 모델 | Zilliz</a></p></li>
</ul>
