---
id: getting-started-with-milvus-cluster-and-k8s.md
title: Milvus 클러스터 및 K8 시작하기
author: Stephen Batifol
date: 2024-04-03T00:00:00.000Z
desc: '이 튜토리얼을 통해 헬름으로 Milvus를 설정하고, 컬렉션을 만들고, 데이터 수집 및 유사성 검색을 수행하는 기본 사항을 배우게 됩니다.'
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Kubernetes
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-milvus-and-k8s.md'
---
<h2 id="Introduction" class="common-anchor-header">소개<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 대규모 임베딩 벡터를 저장, 색인, 관리하는 것을 목표로 하는 분산형 벡터 데이터베이스입니다. 수조 개의 벡터를 효율적으로 색인하고 검색할 수 있는 Milvus는 AI 및 머신 러닝 워크로드를 위한 최고의 선택입니다.</p>
<p>반면에 Kubernetes(K8s)는 컨테이너화된 애플리케이션을 관리하고 확장하는 데 탁월합니다. 자동 확장, 자가 복구, 로드 밸런싱과 같은 기능을 제공하며, 이는 프로덕션 환경에서 고가용성과 성능을 유지하는 데 매우 중요합니다.</p>
<h2 id="Why-Use-Them-Together" class="common-anchor-header">왜 함께 사용해야 할까요?<button data-href="#Why-Use-Them-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>K8은 워크로드에 따라 Milvus 클러스터를 자동으로 확장할 수 있습니다. 데이터가 증가하거나 쿼리 수가 증가하면 K8은 더 많은 Milvus 인스턴스를 스핀업하여 부하를 처리함으로써 애플리케이션의 응답성을 유지할 수 있습니다.</p>
<p>K8의 뛰어난 기능 중 하나는 수평적 확장이 가능하기 때문에 Milvus 클러스터를 손쉽게 확장할 수 있다는 점입니다. 데이터 세트가 증가함에 따라 K8s는 이러한 증가를 손쉽게 수용하여 간단하고 효율적인 솔루션이 됩니다.</p>
<p>또한, 쿼리 처리 기능도 K8s를 통해 수평적으로 확장할 수 있습니다. 쿼리 부하가 증가하면 K8은 더 많은 Milvus 인스턴스를 배포하여 늘어난 유사도 검색 쿼리를 처리할 수 있으므로 부하가 많은 상황에서도 지연 시간이 짧은 응답을 보장합니다.</p>
<h2 id="Prerequisites--Setting-Up-K8s" class="common-anchor-header">전제 조건 및 K8 설정하기<button data-href="#Prerequisites--Setting-Up-K8s" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><ul>
<li><p><strong>도커</strong> - 시스템에 도커가 설치되어 있는지 확인합니다.</p></li>
<li><p><strong>Kubernetes</strong> - Kubernetes 클러스터를 준비합니다. 로컬 개발의 경우 <code translate="no">minikube</code>, 프로덕션 환경의 경우 클라우드 제공업체의 Kubernetes 서비스를 사용할 수 있습니다.</p></li>
<li><p><strong>Helm</strong> - Kubernetes 애플리케이션을 관리하는 데 도움이 되는 Kubernetes용 패키지 매니저인 Helm을 설치하며, 그 방법은 <a href="https://milvus.io/docs/install_cluster-helm.md">https://milvus.io/docs/install_cluster-helm.md</a> 에서 설명서를 확인할 수 있습니다.</p></li>
<li><p><strong>Kubectl</strong> - 애플리케이션을 배포하고, 클러스터 리소스를 검사 및 관리하고, 로그를 보기 위해 Kubernetes 클러스터와 상호 작용하기 위한 명령줄 도구인 <code translate="no">kubectl</code> 를 설치합니다.</p></li>
</ul>
<h3 id="Setting-Up-K8s" class="common-anchor-header">K8 설정</h3><p>K8s 클러스터를 실행하는 데 필요한 모든 것을 설치한 후 <code translate="no">minikube</code> 를 사용하여 클러스터를 시작하세요:</p>
<pre><code translate="no">minikube start
<button class="copy-code-btn"></button></code></pre>
<p>를 사용하여 K8s 클러스터의 상태를 확인합니다:</p>
<pre><code translate="no">kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-Milvus-on-K8s" class="common-anchor-header">K8s에 Milvus 배포하기</h3><p>이 배포에서는 전체 분산 기능을 활용하기 위해 클러스터 모드에서 Milvus를 선택합니다. 설치 프로세스를 간소화하기 위해 Helm을 사용할 것입니다.</p>
<p><strong>1. 헬름 설치 명령어</strong></p>
<pre><code translate="no">helm install my-milvus milvus/milvus --<span class="hljs-built_in">set</span> pulsar.enabled=<span class="hljs-literal">false</span> --<span class="hljs-built_in">set</span> kafka.enabled=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>이 명령은 Kafka를 활성화하고 Pulsar를 비활성화한 상태에서 K8s 클러스터에 Milvus를 설치합니다. Kafka는 Milvus 내에서 메시징 시스템 역할을 하며 서로 다른 구성 요소 간의 데이터 스트리밍을 처리합니다. Pulsar를 비활성화하고 Kafka를 활성화하면 특정 메시징 기본 설정 및 요구 사항에 맞게 배포가 조정됩니다.</p>
<p><strong>2. 포트 포워딩</strong></p>
<p>로컬 컴퓨터에서 Milvus에 액세스하려면 포트 포워딩을 생성하세요: <code translate="no">kubectl port-forward svc/my-milvus 27017:19530</code>.</p>
<p>이 명령은 Milvus 서비스 <code translate="no">svc/my-milvus</code> 의 포트 <code translate="no">19530</code> 를 로컬 컴퓨터의 동일한 포트에 매핑하여 로컬 도구를 사용하여 Milvus에 연결할 수 있도록 합니다. 로컬 포트를 지정하지 않은 채로 두면( <code translate="no">:19530</code>), K8에서 사용 가능한 포트를 할당하여 동적으로 만듭니다. 이 방법을 선택하는 경우 할당된 로컬 포트를 기억해 두세요.</p>
<p><strong>3. 배포 확인:</strong></p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods 

NAME                                    READY   STATUS    RESTARTS   AGE
my-milvus-datacoord<span class="hljs-number">-595b</span>996bd4-zprpd    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-datanode-d9d555785<span class="hljs-number">-47</span>nkt      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-0</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">84</span>m
my-milvus-etcd<span class="hljs-number">-1</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-2</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexcoord<span class="hljs-number">-65b</span>c68968c<span class="hljs-number">-6</span>jg6q   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexnode<span class="hljs-number">-54586f</span>55d-z9vx4     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-minio<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-3</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-proxy<span class="hljs-number">-76b</span>b7d497f-sqwvd        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querycoord<span class="hljs-number">-6f</span>4c7b7598-b6twj   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querynode<span class="hljs-number">-677b</span>df485b-ktc6m    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-rootcoord<span class="hljs-number">-7498f</span>ddfd8-v5zw8    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
<button class="copy-code-btn"></button></code></pre>
<p>위의 출력과 유사한 파드 목록이 표시되어야 하며 모두 실행 중 상태여야 합니다. 이는 Milvus 클러스터가 작동 중임을 나타냅니다. 특히 <code translate="no">READY</code> 열 아래에서 1/1을 찾아보세요. 이는 각 파드가 완전히 준비되어 실행 중임을 의미합니다. 실행 중 상태가 아닌 파드가 있는 경우, 성공적인 배포를 위해 추가 조사가 필요할 수 있습니다.</p>
<p>Milvus 클러스터가 배포되고 모든 구성 요소가 실행 중임을 확인했으면 이제 데이터 수집 및 색인 작업을 진행할 준비가 되었습니다. 여기에는 Milvus 인스턴스에 연결하고, 컬렉션을 만들고, 검색 및 검색을 위한 벡터를 삽입하는 작업이 포함됩니다.</p>
<h2 id="Data-Ingestion-and-Indexing" class="common-anchor-header">데이터 수집 및 인덱싱<button data-href="#Data-Ingestion-and-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 클러스터에서 데이터 수집 및 색인 작업을 시작하려면 pymilvus SDK를 사용하겠습니다. 두 가지 설치 옵션이 있습니다:</p>
<ul>
<li><p>기본 SDK: <code translate="no">pip install pymilvus</code></p></li>
<li><p>서식 있는 텍스트 임베딩 및 고급 모델용: <code translate="no">pip install pymilvus[model]</code></p></li>
</ul>
<p>클러스터에 데이터를 삽입할 때는 <code translate="no">pymilvus</code> 를 사용하여 SDK만 설치하거나 <code translate="no">pip install pymilvus</code> 또는 리치 텍스트 임베딩을 추출하려는 경우 <code translate="no">PyMilvus Models</code> 를 설치하여 <code translate="no">pip install pymilvus[model]</code> 를 사용할 수 있습니다.</p>
<h3 id="Connecting-and-Creating-a-Collection" class="common-anchor-header">컬렉션 연결 및 생성하기:</h3><p>먼저, 앞서 전달한 포트를 사용하여 Milvus 인스턴스에 연결합니다. URI가 K8에서 할당된 로컬 포트와 일치하는지 확인합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
        uri=<span class="hljs-string">&quot;http://127.0.0.1:52070&quot;</span>,
    )

client.<span class="hljs-title function_">create_collection</span>(collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>, dimension=<span class="hljs-number">5</span>)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">dimension=5</code> 매개변수는 이 컬렉션의 벡터 크기를 정의하며, 벡터 검색 기능에 필수적입니다.</p>
<h3 id="Insert-Data" class="common-anchor-header">데이터 삽입</h3><p>다음은 각 벡터가 항목을 나타내고 색상 필드가 설명 속성을 추가하는 초기 데이터 집합을 삽입하는 방법입니다:</p>
<pre><code translate="no">data=[
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3580376395471989</span>, -<span class="hljs-number">0.6023495712049978</span>, <span class="hljs-number">0.18414012509913835</span>, -<span class="hljs-number">0.26286205330961354</span>, <span class="hljs-number">0.9029438446296592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_8682&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.19886812562848388</span>, <span class="hljs-number">0.06023560599112088</span>, <span class="hljs-number">0.6976963061752597</span>, <span class="hljs-number">0.2614474506242501</span>, <span class="hljs-number">0.838729485096104</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_7025&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.43742130801983836</span>, -<span class="hljs-number">0.5597502546264526</span>, <span class="hljs-number">0.6457887650909682</span>, <span class="hljs-number">0.7894058910881185</span>, <span class="hljs-number">0.20785793220625592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;orange_6781&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3172005263489739</span>, <span class="hljs-number">0.9719044792798428</span>, -<span class="hljs-number">0.36981146090600725</span>, -<span class="hljs-number">0.4860894583077995</span>, <span class="hljs-number">0.95791889146345</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_9298&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.4452349528804562</span>, -<span class="hljs-number">0.8757026943054742</span>, <span class="hljs-number">0.8220779437047674</span>, <span class="hljs-number">0.46406290649483184</span>, <span class="hljs-number">0.30337481143159106</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_4794&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">5</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.985825131989184</span>, -<span class="hljs-number">0.8144651566660419</span>, <span class="hljs-number">0.6299267002202009</span>, <span class="hljs-number">0.1206906911183383</span>, -<span class="hljs-number">0.1446277761879955</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;yellow_4222&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">6</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.8371977790571115</span>, -<span class="hljs-number">0.015764369584852833</span>, -<span class="hljs-number">0.31062937026679327</span>, -<span class="hljs-number">0.562666951622192</span>, -<span class="hljs-number">0.8984947637863987</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_9392&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">7</span>, <span class="hljs-string">&quot;vector&quot;</span>: [-<span class="hljs-number">0.33445148015177995</span>, -<span class="hljs-number">0.2567135004164067</span>, <span class="hljs-number">0.8987539745369246</span>, <span class="hljs-number">0.9402995886420709</span>, <span class="hljs-number">0.5378064918413052</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;grey_8510&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">8</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.39524717779832685</span>, <span class="hljs-number">0.4000257286739164</span>, -<span class="hljs-number">0.5890507376891594</span>, -<span class="hljs-number">0.8650502298996872</span>, -<span class="hljs-number">0.6140360785406336</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;white_9381&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">9</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.5718280481994695</span>, <span class="hljs-number">0.24070317428066512</span>, -<span class="hljs-number">0.3737913482606834</span>, -<span class="hljs-number">0.06726932177492717</span>, -<span class="hljs-number">0.6980531615588608</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;purple_4976&quot;</span>}
]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>제공된 코드는 빠른 설정 방식으로 컬렉션을 만들었다고 가정합니다. 위 코드에서 볼 수 있듯이,</p>
<p>삽입할 데이터는 사전 목록으로 구성되며, 각 사전은 엔티티라고 하는 데이터 레코드를 나타냅니다.</p>
<p>각 사전에는 색상이라는 스키마에 정의되지 않은 필드가 포함되어 있습니다.</p>
<p>각 사전에는 사전 정의된 필드와 동적 필드에 해당하는 키가 모두 포함되어 있습니다.</p>
<h3 id="Insert-Even-More-Data" class="common-anchor-header">더 많은 데이터 삽입</h3><pre><code translate="no">colors = [<span class="hljs-string">&quot;green&quot;</span>, <span class="hljs-string">&quot;blue&quot;</span>, <span class="hljs-string">&quot;yellow&quot;</span>, <span class="hljs-string">&quot;red&quot;</span>, <span class="hljs-string">&quot;black&quot;</span>, <span class="hljs-string">&quot;white&quot;</span>, <span class="hljs-string">&quot;purple&quot;</span>, <span class="hljs-string">&quot;pink&quot;</span>, <span class="hljs-string">&quot;orange&quot;</span>, <span class="hljs-string">&quot;brown&quot;</span>, <span class="hljs-string">&quot;grey&quot;</span>]
data = [ {
    <span class="hljs-string">&quot;id&quot;</span>: i, 
    <span class="hljs-string">&quot;vector&quot;</span>: [ random.uniform(-<span class="hljs-number">1</span>, <span class="hljs-number">1</span>) <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>) ], 
    <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{random.choice(colors)}</span>_<span class="hljs-subst">{<span class="hljs-built_in">str</span>(random.randint(<span class="hljs-number">1000</span>, <span class="hljs-number">9999</span>))}</span>&quot;</span> 
} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1000</span>) ]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data[<span class="hljs-number">10</span>:]
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Similarity-Search" class="common-anchor-header">유사성 검색<button data-href="#Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>컬렉션을 채운 후 유사도 검색을 수행하여 쿼리 벡터에 가까운 벡터를 찾을 수 있습니다. 쿼리 벡터 변수의 값은 부동 소수점의 하위 목록이 포함된 목록입니다. 하위 목록은 5차원의 벡터 임베딩을 나타냅니다.</p>
<pre><code translate="no">query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

res = client.search(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,     <span class="hljs-comment"># target collection</span>
    data=query_vectors,                <span class="hljs-comment"># query vectors</span>
    <span class="hljs-built_in">limit</span>=3,                           <span class="hljs-comment"># number of returned entities</span>
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>이 쿼리는 쿼리 벡터와 가장 유사한 상위 3개의 벡터를 검색하여 Milvus의 강력한 검색 기능을 보여줍니다.</p>
<h2 id="Uninstall-Milvus-from-K8s" class="common-anchor-header">K8s에서 Milvus 제거하기<button data-href="#Uninstall-Milvus-from-K8s" class="anchor-icon" translate="no">
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
    </button></h2><p>이 튜토리얼을 완료했으면 다음을 사용하여 K8s 클러스터에서 Milvus를 제거하세요:<code translate="no">helm uninstall my-milvus</code>.</p>
<p>이 명령은 <code translate="no">my-milvus</code> 릴리스에 배포된 모든 Milvus 구성 요소를 제거하여 클러스터 리소스를 확보합니다.</p>
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
    </button></h2><ul>
<li><p>Kubernetes 클러스터에 Milvus를 배포하면 AI 및 머신 러닝 워크로드를 처리하는 데 있어 벡터 데이터베이스의 확장성과 유연성을 확인할 수 있습니다. 이 튜토리얼을 통해 헬름으로 Milvus를 설정하고, 컬렉션을 생성하고, 데이터 수집 및 유사도 검색을 수행하는 기본 사항을 배웠습니다.</p></li>
<li><p>헬름을 사용하여 Kubernetes 클러스터에 Milvus를 설치하는 것은 간단합니다. 더 큰 데이터 세트나 더 집약적인 워크로드를 위해 Milvus 클러스터를 확장하는 방법에 대해 자세히 알아보려면, 저희 문서( <a href="https://milvus.io/docs/scaleout.md">https://milvus.io/docs/scaleout.md)</a>에서 자세한 지침을 확인하세요 <a href="https://milvus.io/docs/scaleout.md">.</a></p></li>
</ul>
<p><a href="https://github.com/stephen37/K8s-tutorial-milvus">Github에서</a> 코드를 확인하고, <a href="https://github.com/milvus-io/milvus">Milvus를</a> 살펴보고, 다양한 구성과 사용 사례를 실험해보고, <a href="https://discord.gg/FG6hMJStWu">Discord에</a> 참여하여 커뮤니티와 경험을 공유해 보세요.</p>
