---
id: milvus-access-control-rbac-guide.md
title: 'Milvus 액세스 제어 가이드: 프로덕션용 RBAC 구성 방법'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  사용자, 역할, 권한 그룹, 컬렉션 수준 액세스 및 전체 RAG 시스템 예시 등 프로덕션에서 Milvus RBAC를 설정하는 단계별
  가이드입니다.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>QA 엔지니어가 스테이징 환경이라고 생각하는 것에 대해 정리 스크립트를 실행하는 경우입니다. 연결 문자열이 프로덕션을 가리키는 것만 빼고요. 몇 초 후, 핵심 벡터 컬렉션이 사라지고, 기능 데이터가 손실되고, <a href="https://zilliz.com/glossary/similarity-search">유사성 검색이</a> 빈 결과를 반환하고, 서비스가 전반적으로 저하되는 등의 문제가 발생합니다. 사후 조사 결과 항상 그랬던 것처럼 모든 사람이 <code translate="no">root</code> 으로 연결했고, 액세스 경계가 없었으며, 테스트 계정이 프로덕션 데이터를 삭제하는 것을 막지 못했다는 동일한 근본 원인을 발견했습니다.</p>
<p>이것은 일회성이 아닙니다. <a href="https://milvus.io/">Milvus와</a> 일반적으로 <a href="https://zilliz.com/learn/what-is-a-vector-database">벡터 데이터베이스를</a> 기반으로 구축하는 팀은 <a href="https://zilliz.com/learn/vector-index">인덱스 성능</a>, 처리량, 데이터 규모에 초점을 맞추고 액세스 제어는 나중에 처리할 일로 치부하는 경향이 있습니다. 하지만 '나중에'라는 말은 보통 인시던트의 형태로 다가옵니다. Milvus가 프로토타입에서 프로덕션 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 파이프라인</a>, 추천 엔진, 실시간 <a href="https://zilliz.com/learn/what-is-vector-search">벡터 검색의</a> 백본으로 이동함에 따라, 누가 Milvus 클러스터에 액세스할 수 있으며 정확히 무엇을 할 수 있는지에 대한 질문은 피할 수 없게 됩니다.</p>
<p>Milvus에는 이 질문에 답할 수 있는 RBAC 시스템이 내장되어 있습니다. 이 가이드에서는 RBAC의 정의, Milvus가 이를 구현하는 방법, 프로덕션을 안전하게 유지하는 액세스 제어 모델을 설계하는 방법을 코드 예제 및 전체 RAG 시스템 워크스루와 함께 다룹니다.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">역할 기반 액세스 제어(RBAC)란 무엇인가요?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>역할 기반 액세스 제어(RBAC)</strong> 는 개별 사용자에게 직접 권한을 할당하지 않는 보안 모델입니다. 대신, 권한이 역할로 그룹화되고 사용자에게 하나 이상의 역할이 할당됩니다. 사용자의 유효 액세스 권한은 할당된 역할의 모든 권한을 합한 것입니다. RBAC는 운영 데이터베이스 시스템의 표준 액세스 제어 모델로서 PostgreSQL, MySQL, MongoDB 및 대부분의 클라우드 서비스에서 사용합니다.</p>
<p>RBAC는 근본적인 확장 문제를 해결합니다. 수십 명의 사용자와 서비스가 있는 경우 사용자별 권한을 관리하는 것은 유지 관리가 불가능해집니다. RBAC를 사용하면 역할을 한 번 정의하고(예: "X 컬렉션에 대한 읽기 전용"), 10개의 서비스에 할당하고, 요구 사항이 변경되면 한 곳에서 업데이트할 수 있습니다.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Milvus는 RBAC를 어떻게 구현하나요?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC는 네 가지 개념을 기반으로 구축됩니다:</p>
<table>
<thead>
<tr><th>개념</th><th>정의</th><th>예제</th></tr>
</thead>
<tbody>
<tr><td><strong>리소스</strong></td><td>액세스 대상</td><td><a href="https://milvus.io/docs/architecture_overview.md">Milvus 인스턴스</a>, <a href="https://milvus.io/docs/manage-databases.md">데이터베이스</a> 또는 특정 컬렉션</td></tr>
<tr><td><strong>권한/권한 그룹</strong></td><td>수행 중인 작업</td><td><code translate="no">Search</code>, <code translate="no">Insert</code>, <code translate="no">DropCollection</code>, 또는 <code translate="no">COLL_RO</code> 와 같은 그룹(컬렉션 읽기 전용)</td></tr>
<tr><td><strong>역할</strong></td><td>리소스로 범위가 지정된 명명된 권한 집합입니다.</td><td><code translate="no">role_read_only</code> <code translate="no">default</code> 데이터베이스의 모든 컬렉션을 검색하고 쿼리할 수 있습니다.</td></tr>
<tr><td><strong>사용자</strong></td><td>Milvus 계정(사람 또는 서비스)</td><td><code translate="no">rag_writer</code>수집 파이프라인에서 사용하는 서비스 계정</td></tr>
</tbody>
</table>
<p>액세스 권한은 사용자에게 직접 할당되지 않습니다. 사용자에게 역할이 부여되고, 역할에는 권한이 포함되며, 권한은 리소스로 범위가 지정됩니다. 이것은 대부분의 프로덕션 데이터베이스 시스템에서 사용되는 것과 동일한 <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBAC 모델입니다</a>. 10명의 사용자가 동일한 역할을 공유하는 경우 역할을 한 번만 업데이트하면 변경 사항이 모든 사용자에게 적용됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>사용자가 역할에 할당되는 방식과 역할에 리소스에 적용되는 권한 및 권한 그룹을 포함하는 Milvus RBAC 모델</span> </span></p>
<p>요청이 Milvus에 도달하면 세 가지 검사를 거칩니다:</p>
<ol>
<li><strong>인증</strong> - 이 사용자가 올바른 자격 증명을 가진 유효한 사용자인가?</li>
<li><strong>역할 확인</strong> - 이 사용자에게 하나 이상의 역할이 할당되어 있는가?</li>
<li><strong>권한 확인</strong> - 사용자의 역할 중 요청된 리소스에 대해 요청된 작업을 허용하는 역할이 있나요?</li>
</ol>
<p>확인에 실패하면 요청이 거부됩니다.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Milvus 인증 및 권한 부여 흐름: 클라이언트 요청은 인증, 역할 확인 및 권한 확인 단계를 거치게 되며, 실패한 단계에서는 거부되고 모두 통과한 경우에만 실행됩니다.</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Milvus에서 인증을 활성화하는 방법<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>기본적으로 Milvus는 인증이 비활성화된 상태로 실행되며 모든 연결에 전체 액세스 권한이 있습니다. 첫 번째 단계는 인증을 켜는 것입니다.</p>
<h3 id="Docker-Compose" class="common-anchor-header">도커 컴포즈</h3><p><code translate="no">milvus.yaml</code> 을 편집하고 <code translate="no">authorizationEnabled</code> 을 <code translate="no">true</code> 로 설정합니다:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">헬름 차트</h3><p><code translate="no">values.yaml</code> 을 편집하고 <code translate="no">extraConfigFiles</code> 아래에 설정을 추가합니다:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes에</a> <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator를</a> 배포하는 경우, 동일한 구성이 Milvus CR의 <code translate="no">spec.config</code> 섹션에 적용됩니다.</p>
<p>인증이 활성화되고 Milvus가 다시 시작되면 모든 연결은 자격 증명을 제공해야 합니다. Milvus는 기본 <code translate="no">root</code> 사용자와 <code translate="no">Milvus</code> 비밀번호를 생성하므로 즉시 변경하세요.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">사용자, 역할 및 권한을 구성하는 방법<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>인증이 활성화된 상태에서 일반적인 설정 워크플로우는 다음과 같습니다.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">1단계: 사용자 만들기</h3><p>서비스 또는 팀원이 <code translate="no">root</code> 을 사용하지 못하게 하세요. 각 사용자 또는 서비스에 대한 전용 계정을 만듭니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">2단계: 역할 만들기</h3><p>Milvus에는 <code translate="no">admin</code> 역할이 기본 제공되지만, 실제로는 실제 액세스 패턴에 맞는 사용자 지정 역할이 필요할 것입니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">3단계: 권한 그룹 만들기</h3><p>권한 그룹은 여러 권한을 하나의 이름으로 묶어 대규모 액세스를 더 쉽게 관리할 수 있도록 해줍니다. Milvus는 9개의 기본 제공 권한 그룹을 제공합니다:</p>
<table>
<thead>
<tr><th>기본 제공 그룹</th><th>범위</th><th>허용하는 권한</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>수집</td><td>읽기 전용 작업(쿼리, 검색 등)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>컬렉션</td><td>읽기 및 쓰기 작업</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>컬렉션</td><td>전체 컬렉션 관리</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>데이터베이스</td><td>읽기 전용 데이터베이스 작업</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>데이터베이스</td><td>데이터베이스 읽기 및 쓰기 작업</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>데이터베이스</td><td>전체 데이터베이스 관리</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>클러스터</td><td>읽기 전용 클러스터 작업</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>클러스터</td><td>클러스터 읽기 및 쓰기 작업</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>클러스터</td><td>전체 클러스터 관리</td></tr>
</tbody>
</table>
<p>기본 제공 권한 그룹이 적합하지 않은 경우 사용자 지정 권한 그룹을 만들 수도 있습니다:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">4단계: 역할에 권한 부여하기</h3><p>특정 리소스로 범위가 지정된 역할에 개별 권한 또는 권한 그룹을 부여합니다. <code translate="no">collection_name</code> 및 <code translate="no">db_name</code> 매개 변수로 범위를 제어하며, 모두 <code translate="no">*</code> 을 사용합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">5단계: 사용자에게 역할 할당</h3><p>사용자는 여러 역할을 보유할 수 있습니다. 사용자의 유효 권한은 할당된 모든 역할의 합입니다.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">액세스 권한 감사 및 취소 방법<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>어떤 액세스 권한이 있는지 파악하는 것은 권한을 부여하는 것만큼이나 중요합니다. 이전 팀원, 퇴사한 서비스 또는 일회성 디버깅 세션에서 얻은 오래된 권한은 소리 없이 누적되어 공격 표면을 넓힙니다.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">현재 권한 확인</h3><p>사용자에게 할당된 역할을 확인하세요:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>역할에 부여된 권한을 확인하세요:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">역할에서 권한 취소</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">사용자로부터 역할 할당 해제</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">사용자 또는 역할 삭제</h3><p>사용자를 삭제하기 전에 모든 역할 할당을 제거하고, 역할을 삭제하기 전에 모든 권한을 해지하세요:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">예시 프로덕션 RAG 시스템을 위한 RBAC 설계 방법<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>구체적인 예시를 통해 추상적인 개념을 더 빨리 이해할 수 있습니다. Milvus를 기반으로 구축된 세 가지 서비스가 있는 <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> 시스템을 생각해 보세요:</p>
<table>
<thead>
<tr><th>서비스</th><th>책임</th><th>필수 액세스</th></tr>
</thead>
<tbody>
<tr><td><strong>플랫폼 관리자</strong></td><td>Milvus 클러스터를 관리합니다 - 컬렉션 생성, 상태 모니터링, 업그레이드 처리</td><td>전체 클러스터 관리자</td></tr>
<tr><td><strong>수집 서비스</strong></td><td>문서에서 <a href="https://zilliz.com/glossary/vector-embeddings">벡터 임베딩을</a> 생성하고 컬렉션에 기록합니다.</td><td>컬렉션에 읽기 + 쓰기</td></tr>
<tr><td><strong>검색 서비스</strong></td><td>최종 사용자의 <a href="https://zilliz.com/learn/what-is-vector-search">벡터 검색</a> 쿼리 처리</td><td>컬렉션에서 읽기 전용</td></tr>
</tbody>
</table>
<p>다음은 <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus를</a> 사용한 전체 설정입니다:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>각 서비스는 필요한 액세스 권한을 정확히 얻습니다. 검색 서비스는 실수로 데이터를 삭제할 수 없습니다. 수집 서비스는 클러스터 설정을 수정할 수 없습니다. 그리고 검색 서비스의 자격 증명이 유출되면 공격자는 <a href="https://zilliz.com/glossary/vector-embeddings">임베딩 벡터를</a> 읽을 수는 있지만 쓰기, 삭제 또는 관리자에게 에스컬레이션할 수 없습니다.</p>
<p>여러 Milvus 배포에서 액세스를 관리하는 팀의 경우, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)는 사용자, 역할, 권한을 관리할 수 있는 웹 콘솔이 포함된 기본 제공 RBAC를 제공하며 스크립팅이 필요하지 않습니다. 여러 환경에서 설정 스크립트를 유지 관리하기보다 UI를 통해 액세스를 관리하려는 경우에 유용합니다.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">프로덕션을 위한 액세스 제어 모범 사례<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>위의 설정 단계는 기본적인 메커니즘입니다. 다음은 시간이 지나도 액세스 제어를 효과적으로 유지하는 설계 원칙입니다.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">루트 계정 잠금</h3><p>무엇보다 먼저 기본 <code translate="no">root</code> 비밀번호를 변경하세요. 프로덕션 환경에서는 루트 계정을 긴급 작업에만 사용하고 애플리케이션 구성에 하드코딩하거나 Slack을 통해 공유하지 말고 비밀 관리자에 저장해야 합니다.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">환경을 완전히 분리</h3><p>개발, 스테이징 및 프로덕션에 서로 다른 <a href="https://milvus.io/docs/architecture_overview.md">Milvus 인스턴스를</a> 사용하세요. 연결 문자열 하나만 잘못 구성해도 개발 서비스가 프로덕션 데이터에 쓰게 되는 등 RBAC만으로는 환경 분리가 취약합니다. 물리적 분리(다른 클러스터, 다른 자격 증명)는 이러한 종류의 사고를 완전히 제거합니다.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">최소 권한 적용</h3><p>각 사용자와 서비스에 작업을 수행하는 데 필요한 최소한의 액세스 권한을 부여하세요. 좁게 시작하여 문서화된 특정 요구가 있을 때만 넓히세요. 개발 환경에서는 좀 더 느슨하게 적용할 수 있지만 프로덕션 액세스 권한은 엄격하게 관리하고 정기적으로 검토해야 합니다.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">오래된 액세스 정리</h3><p>누군가가 팀을 떠나거나 서비스가 중단되면 즉시 역할을 취소하고 계정을 삭제하세요. 활성 권한이 있는 사용하지 않는 계정은 아무도 모니터링하지 않는 유효한 자격 증명으로, 무단 액세스의 가장 흔한 경로입니다.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">특정 컬렉션에 대한 권한 범위 지정</h3><p>해당 역할이 진정으로 모든 컬렉션에 대한 액세스 권한이 필요한 경우가 아니라면 <code translate="no">collection_name='*'</code> 권한을 부여하지 마세요. 멀티테넌트 설정이나 여러 데이터 파이프라인이 있는 시스템에서는 각 역할의 범위를 해당 역할이 작업하는 <a href="https://milvus.io/docs/manage-collections.md">컬렉션으로만</a> 한정하세요. 이렇게 하면 자격 증명이 손상된 경우 폭발 반경이 제한됩니다.</p>
<hr>
<p>프로덕션에 <a href="https://milvus.io/">Milvus를</a> 배포하고 액세스 제어, 보안 또는 멀티테넌트 설계를 통해 작업하고 계신다면 저희가 도와드리겠습니다:</p>
<ul>
<li>Milvus <a href="https://slack.milvus.io/">Slack 커뮤니티에</a> 참여하여 Milvus를 대규모로 실행하는 다른 엔지니어들과 실제 배포 사례에 대해 논의하세요.</li>
<li>역할 구조, 컬렉션 수준 범위 지정 또는 다중 환경 보안 등 RBAC 설계를 살펴볼 수 있는<a href="https://milvus.io/office-hours">20분짜리 무료 Milvus 오피스 아워 세션을 예약하세요</a>.</li>
<li>인프라 설정을 건너뛰고 UI를 통해 액세스 제어를 관리하고 싶다면 웹 콘솔이 포함된 기본 제공 RBAC와 함께 <a href="https://zilliz.com/cloud-security">암호화</a>, 네트워크 격리, SOC 2 규정 준수가 기본적으로 제공되는 <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (관리형 Milvus)를 선택하세요.</li>
</ul>
<hr>
<p>팀이 Milvus에서 액세스 제어를 구성하기 시작할 때 자주 발생하는 몇 가지 질문입니다:</p>
<p><strong>질문: 사용자를 모든 컬렉션이 아닌 특정 컬렉션으로만 제한할 수 있나요?</strong></p>
<p>예. 전화할 때 <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a><code translate="no">*</code>대신 <code translate="no">collection_name</code> 를 특정 컬렉션으로 설정하면 해당 사용자의 역할은 해당 컬렉션에만 액세스할 수 있습니다. 컬렉션당 한 번씩 함수를 호출하여 여러 컬렉션에 대해 동일한 역할 권한을 부여할 수 있습니다.</p>
<p><strong>질문: Milvus에서 권한과 권한 그룹의 차이점은 무엇인가요?</strong></p>
<p>권한은 <code translate="no">Search</code>, <code translate="no">Insert</code>, <code translate="no">DropCollection</code> 과 같은 단일 작업입니다. <a href="https://milvus.io/docs/privilege_group.md">권한 그룹은</a> 여러 권한을 하나의 이름으로 묶은 것입니다(예: <code translate="no">COLL_RO</code> 에는 모든 읽기 전용 컬렉션 작업이 포함됩니다). 권한 그룹을 부여하는 것은 기능적으로 각 구성 권한을 개별적으로 부여하는 것과 동일하지만 관리하기가 더 쉽습니다.</p>
<p><strong>질문: 인증을 활성화하면 Milvus 쿼리 성능에 영향을 주나요?</strong></p>
<p>오버헤드는 무시할 수 있는 수준입니다. Milvus는 각 요청에 대해 자격 증명을 검증하고 역할 권한을 확인하지만, 이는 인메모리 조회이므로 밀리초가 아닌 마이크로초가 추가됩니다. <a href="https://milvus.io/docs/single-vector-search.md">검색</a> 또는 <a href="https://milvus.io/docs/insert-update-delete.md">삽입</a> 대기 시간에는 측정 가능한 영향이 없습니다.</p>
<p><strong>질문: 멀티테넌트 설정에서 Milvus RBAC를 사용할 수 있나요?</strong></p>
<p>예. 테넌트별로 별도의 역할을 만들고, 각 역할의 권한을 해당 테넌트의 컬렉션에 한정하고, 각 테넌트의 서비스 계정에 해당 역할을 할당하세요. 이렇게 하면 별도의 Milvus 인스턴스 없이도 컬렉션 수준의 격리가 가능합니다. 대규모 멀티테넌시에 대해서는 <a href="https://milvus.io/docs/multi_tenancy.md">Milvus 멀티테넌시 가이드를</a> 참조하세요.</p>
