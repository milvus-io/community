---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: 'Milvus RBAC 설명: 역할 기반 액세스 제어로 벡터 데이터베이스 보안 유지'
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  RBAC가 중요한 이유, Milvus의 RBAC 작동 방식, 액세스 제어 구성 방법, 최소 권한 액세스, 명확한 역할 분리 및 안전한
  프로덕션 운영을 가능하게 하는 방법에 대해 알아보세요.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>데이터베이스 시스템을 구축할 때 엔지니어들은 인덱스 유형, 리콜, 지연 시간, 처리량, 확장 등 성능에 대부분의 시간을 할애합니다. 하지만 시스템이 한 개발자의 노트북을 넘어서는 순간, <strong>Milvus 클러스터 내에서 누가 무엇을 할 수</strong> 있는가라는 또 다른 중요한 질문이 생깁니다. 다시 말해, 액세스 제어입니다.</p>
<p>업계 전반에 걸쳐 많은 운영 사고는 단순한 권한 실수에서 비롯됩니다. 스크립트가 잘못된 환경에서 실행됩니다. 서비스 계정에 의도한 것보다 더 광범위한 액세스 권한이 있습니다. 공유된 관리자 자격 증명이 CI에 포함됩니다. 이러한 문제는 대개 매우 실용적인 질문으로 드러납니다:</p>
<ul>
<li><p>개발자가 프로덕션 컬렉션을 삭제할 수 있는가?</p></li>
<li><p>테스트 계정에서 프로덕션 벡터 데이터를 읽을 수 있는 이유는 무엇인가요?</p></li>
<li><p>여러 서비스가 동일한 관리자 역할로 로그인하는 이유는 무엇인가요?</p></li>
<li><p>분석 작업에 쓰기 권한이 없는 읽기 전용 액세스 권한을 가질 수 있나요?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus는</a> <a href="https://milvus.io/docs/rbac.md">역할 기반 액세스 제어(RBAC)</a>로 이러한 문제를 해결합니다. 모든 사용자에게 슈퍼 관리자 권한을 부여하거나 애플리케이션 코드에서 제한을 적용하는 대신, RBAC를 사용하면 데이터베이스 계층에서 정확한 권한을 정의할 수 있습니다. 각 사용자 또는 서비스에는 필요한 기능만 제공됩니다.</p>
<p>이 게시물에서는 Milvus에서 RBAC의 작동 방식, 구성 방법, 프로덕션 환경에서 안전하게 적용하는 방법에 대해 설명합니다.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Milvus를 사용할 때 액세스 제어가 중요한 이유<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>팀의 규모가 작고 AI 애플리케이션이 제한된 수의 사용자에게만 서비스를 제공하는 경우 인프라는 일반적으로 단순합니다. 소수의 엔지니어가 시스템을 관리하고 Milvus는 개발 또는 테스트에만 사용하며 운영 워크플로우가 간단합니다. 이 초기 단계에서는 위험 표면이 작고 실수를 쉽게 되돌릴 수 있기 때문에 액세스 제어가 시급하게 느껴지는 경우가 드뭅니다.</p>
<p>Milvus가 프로덕션으로 전환되고 사용자, 서비스 및 운영자의 수가 증가함에 따라 사용 모델이 빠르게 변경됩니다. 일반적인 시나리오는 다음과 같습니다:</p>
<ul>
<li><p>동일한 Milvus 인스턴스를 공유하는 여러 비즈니스 시스템</p></li>
<li><p>여러 팀이 동일한 벡터 컬렉션에 액세스하는 경우</p></li>
<li><p>테스트, 스테이징, 프로덕션 데이터가 단일 클러스터에 공존하는 경우</p></li>
<li><p>읽기 전용 쿼리부터 쓰기 및 운영 제어에 이르기까지 서로 다른 수준의 액세스가 필요한 다양한 역할</p></li>
</ul>
<p>액세스 경계를 명확하게 정의하지 않으면 이러한 설정은 예측 가능한 위험을 초래합니다:</p>
<ul>
<li><p>테스트 워크플로우가 실수로 프로덕션 컬렉션을 삭제할 수 있습니다.</p></li>
<li><p>개발자가 라이브 서비스에서 사용하는 인덱스를 의도치 않게 수정할 수 있습니다.</p></li>
<li><p><code translate="no">root</code> 계정의 광범위한 사용으로 인해 작업 추적이나 감사가 불가능해집니다.</p></li>
<li><p>손상된 애플리케이션이 모든 벡터 데이터에 제한 없이 액세스할 수 있습니다.</p></li>
</ul>
<p>사용량이 증가함에 따라 비공식적인 관행이나 공유 관리자 계정에 의존하는 것은 더 이상 지속 가능하지 않습니다. 일관되고 시행 가능한 액세스 모델이 필수적인데, 이것이 바로 Milvus RBAC가 제공하는 기능입니다.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Milvus의 RBAC란?<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC(역할 기반 액세스 제어)</a> 는 개별 사용자가 아닌 <strong>역할을</strong> 기반으로 액세스를 제어하는 권한 모델입니다. Milvus에서 RBAC를 사용하면 사용자 또는 서비스가 수행할 수 있는 작업과 특정 리소스에 대한 작업을 정확하게 정의할 수 있습니다. 단일 개발자에서 전체 프로덕션 환경으로 시스템이 성장함에 따라 보안을 관리할 수 있는 구조적이고 확장 가능한 방법을 제공합니다.</p>
<p>Milvus RBAC는 다음과 같은 핵심 구성 요소를 중심으로 구축됩니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>사용자 역할 권한</span> </span></p>
<ul>
<li><p><strong>리소스</strong>: 액세스되는 엔터티. Milvus에서 리소스에는 <strong>인스턴스</strong>, <strong>데이터베이스</strong> 및 <strong>컬렉션이</strong> 포함됩니다.</p></li>
<li><p><strong>권한</strong>: 리소스에 대해 허용된 특정 작업(예: 컬렉션 만들기, 데이터 삽입 또는 엔티티 삭제)입니다.</p></li>
<li><p><strong>권한 그룹</strong>: "읽기 전용" 또는 "쓰기"와 같이 미리 정의된 관련 권한 집합입니다.</p></li>
<li><p><strong>역할</strong>: 역할: 권한과 해당 권한이 적용되는 리소스의 조합입니다. 역할에 따라 수행할 수 <em>있는</em> 작업과 <em>위치가</em> 결정됩니다.</p></li>
<li><p><strong>사용자</strong>: Milvus의 ID입니다. 각 사용자에게는 고유 ID가 있으며 하나 이상의 역할이 할당됩니다.</p></li>
</ul>
<p>이러한 구성 요소는 명확한 계층 구조를 형성합니다:</p>
<ol>
<li><p><strong>사용자에게는 역할이 할당됩니다.</strong></p></li>
<li><p><strong>역할은 권한을 정의합니다.</strong></p></li>
<li><p><strong>권한은 특정 리소스에 적용됩니다.</strong></p></li>
</ol>
<p>Milvus의 핵심 설계 원칙은 <strong>사용자에게 직접 권한이 할당되지</strong> 않는다는 것입니다. 모든 액세스는 역할을 통해 이루어집니다. 이러한 간접 방식은 관리를 간소화하고, 구성 오류를 줄이며, 권한 변경을 예측 가능하게 만듭니다.</p>
<p>이 모델은 실제 배포에서 깔끔하게 확장됩니다. 여러 사용자가 하나의 역할을 공유하는 경우 역할의 권한을 업데이트하면 각 사용자를 개별적으로 수정할 필요 없이 모든 사용자의 권한이 즉시 업데이트됩니다. 이는 최신 인프라가 액세스를 관리하는 방식과 일치하는 단일 제어 지점입니다.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Milvus에서 RBAC의 작동 방식<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>클라이언트가 Milvus에 요청을 보내면 시스템은 일련의 인증 단계를 통해 이를 평가합니다. 각 단계를 통과해야만 작업을 진행할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus에서 RBAC 작동 방식</span> </span></p>
<ol>
<li><p><strong>요청을 인증합니다:</strong> Milvus는 먼저 사용자 신원을 확인합니다. 인증에 실패하면 인증 오류와 함께 요청이 거부됩니다.</p></li>
<li><p><strong>역할 할당 확인:</strong> 인증 후 Milvus는 사용자에게 하나 이상의 역할이 할당되어 있는지 확인합니다. 역할이 없는 경우 권한 거부 오류와 함께 요청이 거부됩니다.</p></li>
<li><p><strong>필요한 권한을 확인합니다:</strong> 그런 다음 Milvus는 사용자의 역할이 대상 리소스에 대해 필요한 권한을 부여하는지 여부를 평가합니다. 권한 확인에 실패하면 권한 거부 오류와 함께 요청이 거부됩니다.</p></li>
<li><p><strong>작업을 실행합니다:</strong> 모든 검사가 통과되면 Milvus는 요청된 작업을 실행하고 결과를 반환합니다.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Milvus에서 RBAC을 통해 접근 제어를 구성하는 방법<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. 전제 조건</h3><p>RBAC 규칙을 평가하고 적용하려면 먼저 Milvus에 대한 모든 요청을 특정 사용자 ID와 연결할 수 있도록 사용자 인증을 사용하도록 설정해야 합니다.</p>
<p>다음은 두 가지 표준 배포 방법입니다.</p>
<ul>
<li><strong>Docker Compose로 배포</strong></li>
</ul>
<p>Milvus를 Docker Compose를 사용하여 배포하는 경우 <code translate="no">milvus.yaml</code> 구성 파일을 편집하고 <code translate="no">common.security.authorizationEnabled</code> 을 <code translate="no">true</code> 으로 설정하여 인증을 활성화한다:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>헬름 차트로 배포하기</strong></li>
</ul>
<p>헬름 차트로 배포하는 경우, <code translate="no">values.yaml</code> 파일을 편집하고 <code translate="no">extraConfigFiles.user.yaml</code> 아래에 다음 구성을 추가합니다:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. 초기화</h3><p>기본적으로 Milvus는 시스템이 시작될 때 기본 제공 <code translate="no">root</code> 사용자를 생성합니다. 이 사용자의 기본 비밀번호는 <code translate="no">Milvus</code> 이다.</p>
<p>초기 보안 단계로 <code translate="no">root</code> 사용자를 사용하여 Milvus에 연결하고 기본 비밀번호를 즉시 변경하세요. 무단 액세스를 방지하기 위해 복잡한 비밀번호를 사용할 것을 강력히 권장합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. 핵심 작업</h3><p><strong>사용자 생성</strong></p>
<p>매일 사용하는 경우 <code translate="no">root</code> 계정을 사용하는 대신 전용 사용자를 생성하는 것이 좋습니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>역할 생성</strong></p>
<p>Milvus는 전체 관리 권한이 있는 기본 제공 <code translate="no">admin</code> 역할을 제공합니다. 그러나 대부분의 프로덕션 시나리오에서는 세분화된 액세스 제어를 위해 사용자 지정 역할을 만드는 것이 좋습니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>권한 그룹 만들기</strong></p>
<p>권한 그룹은 여러 권한의 집합입니다. 권한 관리를 간소화하기 위해 관련 권한을 그룹화하여 함께 부여할 수 있습니다.</p>
<p>Milvus에는 다음과 같은 기본 제공 권한 그룹이 포함되어 있습니다:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>이러한 기본 제공 권한 그룹을 사용하면 권한 설계의 복잡성을 크게 줄이고 역할 간 일관성을 향상시킬 수 있습니다.</p>
<p>기본 제공 권한 그룹을 직접 사용하거나 필요에 따라 사용자 지정 권한 그룹을 만들 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>역할에 권한 또는 권한 그룹 부여하기</strong></p>
<p>역할을 만든 후에는 해당 역할에 권한 또는 권한 그룹을 부여할 수 있습니다. 이러한 권한의 대상 리소스는 인스턴스, 데이터베이스 또는 개별 컬렉션 등 다양한 수준에서 지정할 수 있습니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>사용자에게 역할 부여</strong></p>
<p>사용자에게 역할이 할당되면 사용자는 리소스에 액세스하고 해당 역할에 정의된 작업을 수행할 수 있습니다. 필요한 액세스 범위에 따라 단일 사용자에게 하나 또는 여러 개의 역할을 부여할 수 있습니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. 액세스 권한 검사 및 취소</h3><p><strong>사용자에게 할당된 역할 검사</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>역할에 할당된 권한 검사하기</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>역할에서 권한 해지하기</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>사용자로부터 역할 해지하기</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>사용자 및 역할 삭제</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">예시 Milvus 기반 RAG 시스템을 위한 액세스 제어 설계<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus를 기반으로 구축된 검색 증강 세대(RAG) 시스템을 생각해 보세요.</p>
<p>이 시스템에서는 여러 구성 요소와 사용자가 명확하게 분리된 책임을 가지고 있으며, 각각 다른 수준의 액세스가 필요합니다.</p>
<table>
<thead>
<tr><th>액터</th><th>책임</th><th>필수 액세스 권한</th></tr>
</thead>
<tbody>
<tr><td>플랫폼 관리자</td><td>시스템 운영 및 구성</td><td>인스턴스 수준 관리</td></tr>
<tr><td>벡터 수집 서비스</td><td>벡터 데이터 수집 및 업데이트</td><td>읽기 및 쓰기 액세스</td></tr>
<tr><td>검색 서비스</td><td>벡터 검색 및 검색</td><td>읽기 전용 액세스</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">빠른 팁: 프로덕션 환경에서 안전하게 액세스 제어를 운영하는 방법<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>장기간 운영되는 프로덕션 시스템에서 액세스 제어를 효과적이고 관리하기 쉽게 유지하려면 다음 실용적인 지침을 따르세요.</p>
<p><strong>1. 기본</strong> <code translate="no">root</code> <strong>비밀번호를 변경하고</strong> <code translate="no">root</code> <strong>계정의</strong> <strong>사용을 제한합니다</strong>.</p>
<p>초기화 후 즉시 기본 <code translate="no">root</code> 비밀번호를 업데이트하고 관리 작업에만 사용하도록 제한하세요. 일상적인 작업에는 루트 계정을 사용하거나 공유하지 마세요. 대신 일상적인 액세스를 위한 전용 사용자와 역할을 만들어 위험을 줄이고 책임을 강화하세요.</p>
<p><strong>2. 여러 환경에서 Milvus 인스턴스를 물리적으로 격리하세요.</strong></p>
<p>개발, 스테이징 및 프로덕션을 위해 별도의 Milvus 인스턴스를 배포하세요. 물리적 격리는 논리적 액세스 제어만 사용하는 것보다 더 강력한 안전 경계를 제공하며 환경 간 실수의 위험을 크게 줄여줍니다.</p>
<p><strong>3. 최소 권한 원칙 준수</strong></p>
<p>각 역할에 필요한 권한만 부여하세요:</p>
<ul>
<li><p><strong>개발 환경:</strong> 반복 작업 및 테스트를 지원하기 위해 권한을 더 허용할 수 있습니다.</p></li>
<li><p><strong>프로덕션 환경:</strong> 권한은 꼭 필요한 권한으로 엄격하게 제한해야 합니다.</p></li>
<li><p><strong>정기 감사:</strong> 기존 권한을 주기적으로 검토하여 여전히 필요한지 확인합니다.</p></li>
</ul>
<p><strong>4. 더 이상 필요하지 않은 권한은 적극적으로 취소하세요.</strong></p>
<p>액세스 제어는 한 번 설정하면 끝나는 것이 아니라 지속적인 유지 관리가 필요합니다. 사용자, 서비스 또는 책임이 변경되면 즉시 역할과 권한을 취소하세요. 이렇게 하면 사용하지 않는 권한이 시간이 지나면서 누적되어 숨겨진 보안 위험이 되는 것을 방지할 수 있습니다.</p>
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
    </button></h2><p>Milvus에서 액세스 제어를 구성하는 것은 본질적으로 복잡하지는 않지만 프로덕션 환경에서 시스템을 안전하고 안정적으로 운영하기 위해서는 필수적입니다. 잘 설계된 RBAC 모델을 사용하면 다음과 같이 할 수 있습니다:</p>
<ul>
<li><p>우발적이거나 파괴적인 작업을 방지하여<strong>위험 감소</strong> </p></li>
<li><p>벡터 데이터에 대한 최소 권한 액세스를 시행하여<strong>보안 강화</strong> </p></li>
<li><p>명확한 책임 분리를 통한<strong>운영 표준화</strong> </p></li>
<li><p><strong>안심하고 확장하여</strong> 멀티테넌트 및 대규모 배포를 위한 기반 마련</p></li>
</ul>
<p>액세스 제어는 선택적 기능이나 일회성 작업이 아닙니다. Milvus를 장기간 안전하게 운영하기 위한 기초적인 부분입니다.</p>
<p>Milvus 배포를 위한 <a href="https://milvus.io/docs/rbac.md">RBAC로</a> 견고한 보안 기준선을 구축하세요.</p>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수도 있습니다.</p>
