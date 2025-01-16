---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: Amazon EKS에 오픈 소스 Milvus 벡터 데이터베이스를 배포하는 방법
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Amazon EKS, S3, MSK, ELB와 같은 관리형 서비스를 사용하여 AWS에 Milvus 벡터 데이터베이스를 배포하는 단계별
  가이드입니다.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>이 게시물은 원래 <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS 웹사이트에</em></a> 게시되었으며 허가를 받아 여기에 번역, 편집 및 재게시되었습니다.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">벡터 임베딩 및 벡터 데이터베이스 개요<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/generative-ai">생성적 AI(GenAI)</a>, 특히 대규모 언어 모델<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a>의 등장으로 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스에</a> 대한 관심이 크게 증가하면서 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a>는 GenAI 생태계 내에서 필수 구성 요소로 자리 잡았습니다. 그 결과, 벡터 데이터베이스는 점점 더 많은 <a href="https://milvus.io/use-cases">사용 사례에서</a> 채택되고 있습니다.</p>
<p><a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC 보고서에</a> 따르면 2025년까지 비즈니스 데이터의 80% 이상이 텍스트, 이미지, 오디오, 비디오와 같은 형식으로 존재하는 비정형 데이터가 될 것으로 예측합니다. 이렇게 방대한 양의 <a href="https://zilliz.com/learn/introduction-to-unstructured-data">비정형 데이터를</a> 대규모로 이해하고, 처리하고, 저장하고, 쿼리하는 것은 상당한 도전 과제입니다. GenAI와 딥 러닝의 일반적인 관행은 비정형 데이터를 벡터 임베딩으로 변환하고, 저장하고, <a href="https://milvus.io/intro">Milvus나</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (완전 관리형 Milvus)와 같은 벡터 데이터베이스에 색인하여 <a href="https://zilliz.com/learn/vector-similarity-search">벡터 유사성</a> 또는 의미적 유사성 검색을 수행하는 것입니다.</p>
<p>그렇다면 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩이란</a> 정확히 무엇일까요? 간단히 말해, 부동소수점 숫자를 고차원 공간에 수치로 표현한 것입니다. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">두 벡터 사이의 거리는</a> 관련성을 나타내며, 가까울수록 서로 관련성이 높으며 그 반대의 경우도 마찬가지입니다. 즉, 유사한 벡터는 유사한 원본 데이터에 해당하며, 이는 기존의 키워드 또는 일치 검색과는 다릅니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>벡터 유사도 검색을 수행하는 방법</span> </span></p>
<p><em>그림 1: 벡터 유사도 검색을 수행하는 방법</em></p>
<p>벡터 임베딩을 저장, 색인, 검색하는 기능은 벡터 데이터베이스의 핵심 기능입니다. 현재 주류 벡터 데이터베이스는 크게 두 가지 범주로 나뉩니다. 첫 번째 범주는 <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> 플러그인이 포함된 Amazon OpenSearch Service와 pgvector 확장이 포함된 <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL용</a> Amazon RDS와 같은 기존 관계형 데이터베이스 제품을 확장한 것입니다. 두 번째 범주는 Milvus, Zilliz Cloud(완전 관리형 Milvus), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a>, <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a> 등 잘 알려진 사례를 포함한 전문 벡터 데이터베이스 제품으로 구성됩니다.</p>
<p>임베딩 기술과 벡터 데이터베이스는 이미지 유사도 검색, 동영상 중복 제거 및 분석, 자연어 처리, 추천 시스템, 타겟 광고, 개인화된 검색, 지능형 고객 서비스, 사기 탐지 등 다양한 <a href="https://zilliz.com/vector-database-use-cases">AI 기반 사용 사례에</a> 광범위하게 적용되고 있습니다.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus는</a> 수많은 벡터 데이터베이스 중에서 가장 인기 있는 오픈 소스 옵션 중 하나입니다. 이 포스팅에서는 Milvus를 소개하고 AWS EKS에 Milvus를 배포하는 방법을 살펴봅니다.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Milvus란?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus는</a> 매우 유연하고 안정적이며 매우 빠른 클라우드 네이티브 오픈 소스 벡터 데이터베이스입니다. 벡터 유사도 검색과 AI 애플리케이션을 지원하며 모든 조직에서 벡터 데이터베이스에 액세스할 수 있도록 노력하고 있습니다. Milvus는 심층 신경망과 기타 머신 러닝(ML) 모델에서 생성된 10억 개 이상의 벡터 임베딩을 저장, 색인, 관리할 수 있습니다.</p>
<p>Milvus는 2019년 10월에 <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">오픈 소스 Apache 라이선스 2.0에</a> 따라 출시되었습니다. 현재 <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation의</a> 대학원 프로젝트입니다. 이 블로그를 작성할 당시 Milvus는 <a href="https://hub.docker.com/r/milvusdb/milvus">5,000만</a> 건 이상의 <a href="https://hub.docker.com/r/milvusdb/milvus">Docker 풀</a> 다운로드를 달성했으며, NVIDIA, AT&amp;T, IBM, eBay, Shopee, Walmart 등 <a href="https://milvus.io/">많은 고객들이</a> 사용하고 있습니다.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvus 주요 기능</h3><p>클라우드 네이티브 벡터 데이터베이스로서 Milvus는 다음과 같은 주요 기능을 자랑합니다:</p>
<ul>
<li><p>수십억 개 규모의 벡터 데이터 세트에 대한 고성능 및 밀리초 검색.</p></li>
<li><p>다국어 지원 및 도구 체인.</p></li>
<li><p>수평적 확장성 및 장애 발생 시에도 높은 안정성.</p></li>
<li><p>스칼라 필터링과 벡터 유사도 검색을 결합하여<a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">하이브리드 검색을</a> 실현합니다.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus 아키텍처</h3><p>Milvus는 데이터 흐름과 제어 흐름을 분리하는 원칙을 따릅니다. 시스템은 다이어그램에 표시된 것처럼 네 가지 수준으로 나뉩니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 아키텍처</span> </span></p>
<p><em>그림 2 Milvus 아키텍처</em></p>
<ul>
<li><p><strong>액세스 레이어:</strong> 액세스 계층은 상태 비저장 프록시 그룹으로 구성되며 시스템의 프론트 레이어이자 사용자에 대한 엔드포인트 역할을 합니다.</p></li>
<li><p><strong>코디네이터 서비스:</strong> 코디네이터 서비스는 작업자 노드에 작업을 할당합니다.</p></li>
<li><p><strong>워커 노드:</strong> 워커 노드는 코디네이터 서비스의 지시를 따르고 사용자가 트리거한 DML/DDL 명령을 실행하는 덤 실행기입니다.</p></li>
<li><p><strong>스토리지:</strong> 스토리지는 데이터 지속성을 담당합니다. 메타 스토리지, 로그 브로커, 오브젝트 스토리지로 구성됩니다.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus 배포 옵션</h3><p>Milvus는 세 가지 실행 모드를 지원합니다: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, 독립형, 분산형</a>.</p>
<ul>
<li><p><strong>Milvus Lite는</strong> 로컬 애플리케이션으로 가져올 수 있는 Python 라이브러리입니다. Milvus의 경량 버전으로, Jupyter 노트북에서 빠르게 프로토타이핑하거나 리소스가 제한된 스마트 기기에서 실행하는 데 이상적입니다.</p></li>
<li><p><strong>Milvus Standalone은</strong>단일 머신 서버 배포입니다. 프로덕션 워크로드가 있지만 Kubernetes를 사용하지 않으려는 경우, 충분한 메모리가 있는 단일 머신에서 Milvus Standalone을 실행하는 것이 좋은 옵션입니다.</p></li>
<li><p><strong>Milvus Distributed는</strong> Kubernetes 클러스터에 배포할 수 있습니다. 더 큰 데이터 세트, 더 높은 가용성 및 확장성을 지원하며 프로덕션 환경에 더 적합합니다.</p></li>
</ul>
<p>Milvus는 처음부터 Kubernetes를 지원하도록 설계되었으며 AWS에 쉽게 배포할 수 있습니다. 관리형 Kubernetes로 Amazon Elastic Kubernetes Service(Amazon EKS)를, 오브젝트 스토리지로 Amazon S3를, 메시지 스토리지로 Amazon Managed Streaming for Apache Kafka(Amazon MSK)를, 로드 밸런서로 Amazon Elastic Load Balancing(Amazon ELB)을 사용하여 안정적이고 탄력적인 Milvus 데이터베이스 클러스터를 구축할 수 있습니다.</p>
<p>다음으로, EKS 및 기타 서비스를 사용하여 Milvus 클러스터를 배포하는 단계별 지침을 제공합니다.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">AWS EKS에 Milvus 배포하기<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">전제 조건</h3><p>AWS CLI를 사용하여 EKS 클러스터를 생성하고 Milvus 데이터베이스를 배포하겠습니다. 다음 전제 조건이 필요합니다:</p>
<ul>
<li><p>적절한 권한으로<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI가</a> 설치 및 구성된 PC/Mac 또는 Amazon EC2 인스턴스. 아마존 리눅스 2 또는 아마존 리눅스 2023을 사용하는 경우 AWS CLI 도구가 기본적으로 설치됩니다.</p></li>
<li><p>Helm, Kubectl, eksctl 등을 포함한<a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">EKS 도구가 설치되어</a> 있어야 합니다.</p></li>
<li><p>Amazon S3 버킷.</p></li>
<li><p>Amazon MSK 인스턴스.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">MSK 생성 시 고려 사항</h3><ul>
<li>Milvus의 최신 안정 버전(v2.3.13)은 Kafka의 <code translate="no">autoCreateTopics</code> 기능에 의존합니다. 따라서 MSK를 생성할 때 사용자 정의 구성을 사용하고 <code translate="no">auto.create.topics.enable</code> 속성을 기본값 <code translate="no">false</code> 에서 <code translate="no">true</code> 로 변경해야 합니다. 또한 MSK의 메시지 처리량을 높이려면 <code translate="no">message.max.bytes</code> 및 <code translate="no">replica.fetch.max.bytes</code> 의 값을 높이는 것이 좋습니다. 자세한 내용은 <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">사용자 지정 MSK 구성을</a> 참조하세요.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus는 MSK의 IAM 역할 기반 인증을 지원하지 않습니다. 따라서 MSK를 생성할 때 보안 구성에서 <code translate="no">SASL/SCRAM authentication</code> 옵션을 활성화하고, AWS Secrets Manager에서 <code translate="no">username</code> 및 <code translate="no">password</code> 을 구성하세요. 자세한 내용은 <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">AWS Secrets Manager를 사용한 로그인 자격 증명 인증을</a> 참조하세요.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>그림 3 보안 설정에서 SASL 스크램 인증 활성화.png</span> </span></p>
<p><em>그림 3: 보안 설정: SASL/SCRAM 인증 활성화하기</em></p>
<ul>
<li>EKS 클러스터의 보안 그룹 또는 IP 주소 범위에서 MSK 보안 그룹에 대한 액세스를 활성화해야 합니다.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">EKS 클러스터 만들기</h3><p>콘솔, CloudFormation, eksctl 등을 통해 EKS 클러스터를 만드는 방법에는 여러 가지가 있습니다. 이 글에서는 eksctl을 사용하여 EKS 클러스터를 생성하는 방법을 보여드리겠습니다.</p>
<p><code translate="no">eksctl</code> 는 Amazon EKS에서 쿠버네티스 클러스터를 생성하고 관리하기 위한 간단한 명령줄 도구입니다. Amazon EKS용 노드로 새 클러스터를 생성하는 가장 빠르고 쉬운 방법을 제공합니다. 자세한 내용은 eksctl의 <a href="https://eksctl.io/">웹사이트를</a> 참조하세요.</p>
<ol>
<li>먼저 다음 코드 스니펫을 사용하여 <code translate="no">eks_cluster.yaml</code> 파일을 만듭니다. <code translate="no">cluster-name</code> 을 클러스터 이름으로 바꾸고, <code translate="no">region-code</code> 을 클러스터를 만들려는 AWS 리전으로 바꾸고, <code translate="no">private-subnet-idx</code> 을 프라이빗 서브넷으로 바꿉니다. 참고: 이 구성 파일은 프라이빗 서브넷을 지정하여 기존 VPC에 EKS 클러스터를 생성합니다. 새 VPC를 만들려면 VPC 및 서브넷 구성을 제거한 다음 <code translate="no">eksctl</code> 에서 자동으로 새 VPC를 만듭니다.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>그런 다음 <code translate="no">eksctl</code> 명령을 실행하여 EKS 클러스터를 만듭니다.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>이 명령은 다음 리소스를 생성합니다:</p>
<ul>
<li><p>지정된 버전의 EKS 클러스터.</p></li>
<li><p>3개의 m6i.2xlarge EC2 인스턴스가 있는 관리형 노드 그룹.</p></li>
<li><p>나중에 <strong>AWS 로드 밸런서 컨트롤러를</strong> 설치할 때 사용할 <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC ID 공급자</a> 및 <code translate="no">aws-load-balancer-controller</code> 라는 서비스 계정.</p></li>
<li><p>네임스페이스 <code translate="no">milvus</code> 및 이 네임스페이스 내의 서비스 계정 <code translate="no">milvus-s3-access-sa</code>. 이 네임스페이스는 나중에 Milvus의 오브젝트 스토리지로 S3를 구성할 때 사용됩니다.</p>
<p>참고: 간단하게 하기 위해 여기서는 <code translate="no">milvus-s3-access-sa</code> 에 전체 S3 액세스 권한이 부여됩니다. 프로덕션 배포에서는 최소 권한 원칙을 따르고 Milvus에 사용되는 특정 S3 버킷에 대한 액세스 권한만 부여하는 것이 좋습니다.</p></li>
<li><p><code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> 는 EKS에 필요한 핵심 애드온입니다. <code translate="no">aws-ebs-csi-driver</code> 는 EKS 클러스터가 Amazon EBS 볼륨의 수명 주기를 관리할 수 있도록 하는 AWS EBS CSI 드라이버입니다.</p></li>
</ul>
<p>이제 클러스터 생성이 완료될 때까지 기다리기만 하면 됩니다.</p>
<p>클러스터 생성이 완료될 때까지 기다립니다. 클러스터 생성 프로세스 중에 <code translate="no">kubeconfig</code> 파일이 자동으로 생성되거나 업데이트됩니다. 다음 명령을 실행하여 수동으로 업데이트할 수도 있습니다. <code translate="no">region-code</code> 을 클러스터가 생성되는 AWS 리전으로 바꾸고 <code translate="no">cluster-name</code> 을 클러스터 이름으로 바꾸세요.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>클러스터가 생성되면 실행하여 노드를 볼 수 있습니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>스토리지 유형이 GP3로 구성된 <code translate="no">ebs-sc</code> StorageClass를 생성하고 이를 기본 StorageClass로 설정합니다. Milvus는 etcd를 메타 스토리지로 사용하며 이 StorageClass가 PVC를 생성하고 관리하는 데 필요합니다.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 원래 <code translate="no">gp2</code> StorageClass를 기본값이 아닌 것으로 설정합니다:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>AWS 로드 밸런서 컨트롤러를 설치합니다. 이 컨트롤러는 나중에 Milvus 서비스 및 Attu 인그레스에 사용할 예정이므로 미리 설치해 두겠습니다.</li>
</ol>
<ul>
<li>먼저 <code translate="no">eks-charts</code> 리포지토리를 추가하고 업데이트합니다.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>다음으로, AWS Load Balancer Controller를 설치합니다. <code translate="no">cluster-name</code> 를 클러스터 이름으로 바꿉니다. <code translate="no">aws-load-balancer-controller</code> 이라는 서비스 계정은 이전 단계에서 EKS 클러스터를 생성할 때 이미 생성되었습니다.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>컨트롤러가 성공적으로 설치되었는지 확인합니다.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>출력은 다음과 같아야 합니다:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Milvus 클러스터 배포</h3><p>Milvus는 Operator 및 Helm과 같은 여러 배포 방법을 지원합니다. 오퍼레이터가 더 간단하지만, 헬름이 더 직접적이고 유연합니다. 이 예제에서는 Helm을 사용하여 Milvus를 배포하겠습니다.</p>
<p>Helm으로 Milvus를 배포할 때 <code translate="no">values.yaml</code> 파일을 통해 구성을 사용자 정의할 수 있습니다. <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml을</a> 클릭하여 모든 옵션을 확인합니다. 기본적으로 Milvus는 클러스터 내 미니오와 펄서를 각각 오브젝트 스토리지와 메시지 스토리지로 생성합니다. 프로덕션에 더 적합하도록 몇 가지 구성을 변경하겠습니다.</p>
<ol>
<li>먼저 Milvus 헬름 리포지토리를 추가하고 업데이트합니다.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>다음 코드 스니펫으로 <code translate="no">milvus_cluster.yaml</code> 파일을 생성합니다. 이 코드 스니펫은 Amazon S3를 오브젝트 스토리지로 구성하고 Amazon MSK를 메시지 큐로 구성하는 등 Milvus의 구성을 사용자 정의합니다. 자세한 설명과 구성 지침은 나중에 제공하겠습니다.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>이 코드는 6개의 섹션으로 구성되어 있습니다. 다음 안내에 따라 해당 구성을 변경하세요.</p>
<p><strong>섹션 1</strong>: S3를 오브젝트 스토리지로 구성하기. 서비스 계정은 Milvus에 S3에 대한 액세스 권한을 부여합니다(이 경우 EKS 클러스터를 만들 때 생성한 <code translate="no">milvus-s3-access-sa</code>). <code translate="no">&lt;region-code&gt;</code> 을 클러스터가 위치한 AWS 리전으로 바꿔야 합니다. <code translate="no">&lt;bucket-name&gt;</code> 을 S3 버킷의 이름으로 바꾸고 <code translate="no">&lt;root-path&gt;</code> 을 S3 버킷의 접두사로 바꿉니다(이 필드는 비워 둘 수 있음).</p>
<p><strong>섹션 2</strong>: MSK를 메시지 저장소로 구성하기. <code translate="no">&lt;broker-list&gt;</code> 를 MSK의 SASL/SCRAM 인증 유형에 해당하는 엔드포인트 주소로 바꿉니다. <code translate="no">&lt;username&gt;</code> 및 <code translate="no">&lt;password&gt;</code> 을 MSK 계정 사용자 아이디 및 비밀번호로 바꿉니다. 아래 이미지와 같이 MSK 클라이언트 정보에서 <code translate="no">&lt;broker-list&gt;</code> 을 얻을 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>그림 4 Milvus의 메시지 저장소로 MSK 구성.png</span> </span></p>
<p><em>그림 4: 밀버스의 메시지 저장소로 MSK 구성하기</em></p>
<p><strong>섹션 3:</strong> Milvus 서비스를 노출하고 클러스터 외부에서 접근을 활성화합니다. Milvus 엔드포인트는 기본적으로 EKS 클러스터 내에서만 접근할 수 있는 ClusterIP 타입의 서비스를 사용했습니다. 필요한 경우, EKS 클러스터 외부에서도 접속할 수 있도록 LoadBalancer 타입으로 변경할 수 있습니다. LoadBalancer 유형 서비스는 Amazon NLB를 로드 밸런서로 사용합니다. 보안 모범 사례에 따르면 <code translate="no">aws-load-balancer-scheme</code> 은 기본적으로 내부 모드로 구성되며, 이는 Milvus에 대한 인트라넷 액세스만 허용됨을 의미합니다. <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">NLB 구성 지침을 보려면</a> 클릭하세요.</p>
<p><strong>섹션 4:</strong> 오픈 소스 Milvus 관리 도구인 <a href="https://github.com/zilliztech/attu">Attu</a> 설치 및 구성하기. 직관적인 GUI를 통해 Milvus와 쉽게 상호 작용할 수 있습니다. Attu를 활성화하고, AWS ALB를 사용하여 인그레스를 구성하고, 인터넷을 통해 Attu에 액세스할 수 있도록 <code translate="no">internet-facing</code> 유형으로 설정합니다. ALB 구성 가이드를 보려면 <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">이 문서를</a> 클릭하세요.</p>
<p><strong>섹션 5:</strong> Milvus 핵심 구성 요소의 HA 배포 활성화. Milvus에는 독립적이고 분리된 여러 구성 요소가 포함되어 있습니다. 예를 들어, 코디네이터 서비스는 루트, 쿼리, 데이터, 인덱스 구성 요소에 대한 조정을 처리하는 제어 계층 역할을 합니다. 액세스 계층의 프록시는 데이터베이스 액세스 엔드포인트 역할을 합니다. 이러한 구성 요소는 기본적으로 하나의 포드 레플리카로만 구성됩니다. 이러한 서비스 구성 요소의 여러 복제본을 배포하는 것은 특히 Milvus 가용성을 개선하기 위해 필요합니다.</p>
<p><strong>참고:</strong> 루트, 쿼리, 데이터, 인덱스 코디네이터 구성 요소의 다중 복제본 배포에는 <code translate="no">activeStandby</code> 옵션이 활성화되어 있어야 합니다.</p>
<p><strong>섹션 6:</strong> 워크로드의 요구 사항을 충족하도록 Milvus 구성 요소에 대한 리소스 할당 조정하기. Milvus 웹사이트는 데이터 볼륨, 벡터 차원, 인덱스 유형 등을 기반으로 구성 제안을 생성하는 <a href="https://milvus.io/tools/sizing/">크기 조정 도구도</a> 제공합니다. 또한 클릭 한 번으로 헬름 구성 파일을 생성할 수도 있습니다. 다음 구성은 1백만 1024개의 차원 벡터와 HNSW 인덱스 유형에 대해 이 도구가 제안하는 구성입니다.</p>
<ol>
<li>헬름을 사용하여 Milvus(네임스페이스 <code translate="no">milvus</code> 에 배포됨)를 생성합니다. 참고: <code translate="no">&lt;demo&gt;</code> 를 사용자 정의 이름으로 바꿀 수 있습니다.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>다음 명령을 실행하여 배포 상태를 확인합니다.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>다음 출력은 Milvus 구성 요소가 모두 사용 가능하며 조정 구성 요소에 여러 개의 복제본이 활성화되어 있음을 보여줍니다.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Milvus 액세스 및 관리</h3><p>지금까지 Milvus 벡터 데이터베이스를 성공적으로 배포했습니다. 이제 엔드포인트를 통해 Milvus에 액세스할 수 있습니다. Milvus는 Kubernetes 서비스를 통해 엔드포인트를 노출합니다. Attu는 Kubernetes 인그레스를 통해 엔드포인트를 노출합니다.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Milvus 엔드포인트에 액세스하기</strong></h4><p>다음 명령을 실행하여 서비스 엔드포인트를 가져옵니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>여러 서비스를 볼 수 있습니다. Milvus는 포트 <code translate="no">19530</code> 와 포트 <code translate="no">9091</code> 의 두 포트를 지원합니다:</p>
<ul>
<li><code translate="no">19530</code> 포트는 gRPC 및 RESTful API용 포트입니다. 다른 Milvus SDK 또는 HTTP 클라이언트로 Milvus 서버에 연결할 때 기본 포트입니다.</li>
<li><code translate="no">9091</code> 포트는 Kubernetes 내에서 메트릭 수집, pprof 프로파일링 및 상태 프로브를 위한 관리 포트입니다.</li>
</ul>
<p><code translate="no">demo-milvus</code> 서비스는 클라이언트에서 연결을 설정하는 데 사용되는 데이터베이스 액세스 엔드포인트를 제공합니다. 이 서비스는 서비스 로드 밸런서로 NLB를 사용합니다. 서비스 엔드포인트는 <code translate="no">EXTERNAL-IP</code> 열에서 얻을 수 있습니다.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Attu를 사용하여 Milvus 관리하기</strong></h4><p>앞서 설명한 대로 Milvus를 관리하기 위해 Attu를 설치했습니다. 다음 명령어를 실행하여 엔드포인트를 가져옵니다:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">demo-milvus-attu</code> 라는 인그레스를 볼 수 있으며, 여기서 <code translate="no">ADDRESS</code> 열은 액세스 URL입니다.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>브라우저에서 인그레스 주소를 열면 다음 페이지가 표시됩니다. <strong>연결을</strong> 클릭하여 로그인합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>그림 5 Attu 계정에 로그인하기.png</span> </span></p>
<p><em>그림 5: Attu 계정에 로그인하기</em></p>
<p>로그인한 후 Attu를 통해 Milvus 데이터베이스를 관리할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>그림 6 Attu 인터페이스.png</span> </span></p>
<p>그림 6: Attu 인터페이스</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스 테스트<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus <a href="https://milvus.io/docs/example_code.md">예제 코드를</a> 사용하여 Milvus 데이터베이스가 제대로 작동하는지 테스트해 보겠습니다. 먼저 다음 명령을 사용하여 <code translate="no">hello_milvus.py</code> 예제 코드를 다운로드합니다:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>예제 코드의 호스트를 Milvus 서비스 엔드포인트로 수정합니다.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>코드를 실행합니다:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>시스템이 다음과 같은 결과를 반환하면 Milvus가 정상적으로 실행되고 있음을 나타냅니다.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>이 게시물에서는 가장 널리 사용되는 오픈 소스 벡터 데이터베이스 중 하나인 <a href="https://milvus.io/intro">Milvus를</a> 소개하고, Amazon EKS, S3, MSK, ELB와 같은 관리형 서비스를 사용하여 AWS에 Milvus를 배포하여 탄력성과 안정성을 향상시키는 방법에 대한 가이드를 제공합니다.</p>
<p>다양한 GenAI 시스템, 특히 검색 증강 세대(RAG)의 핵심 구성 요소인 Milvus는 Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex, LangChain을 비롯한 다양한 주류 GenAI 모델 및 프레임워크를 지원하고 통합합니다. 지금 Milvus와 함께 GenAI 혁신 여정을 시작하세요!</p>
<h2 id="References" class="common-anchor-header">참고 자료<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Amazon EKS 사용자 가이드</a></li>
<li><a href="https://milvus.io/">Milvus 공식 웹사이트</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus 깃허브 리포지토리</a></li>
<li><a href="https://eksctl.io/">eksctl 공식 웹사이트</a></li>
</ul>
