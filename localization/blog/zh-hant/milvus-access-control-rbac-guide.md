---
id: milvus-access-control-rbac-guide.md
title: Milvus 存取控制指南：如何為生產配置 RBAC
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
desc: 在生產中設定 Milvus RBAC 的逐步指南 - 使用者、角色、權限群組、集合層級存取，以及完整的 RAG 系統範例。
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>這裡有一個比較常見的故事：一位 QA 工程師針對他們認為是暫存環境的地方執行清理腳本。但連線串卻指向生產環境。幾秒鐘之後，核心向量集合就消失了 - 特徵資料遺失、<a href="https://zilliz.com/glossary/similarity-search">相似性搜尋</a>返回空結果、服務全面降級。調查發現根本原因如出一轍：每個人都以<code translate="no">root</code> 的身分連線，沒有存取邊界，沒有任何東西可以阻止測試帳戶丟失生產資料。</p>
<p>這並非一次性事件。在<a href="https://milvus.io/">Milvus</a>（以及一般<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a>）上建置資料<a href="https://zilliz.com/learn/what-is-a-vector-database">庫</a>的團隊傾向於專注於<a href="https://zilliz.com/learn/vector-index">索引效能</a>、吞吐量和資料規模，而將存取控制視為稍後再處理的事情。但「稍後」通常是以事故的形式出現。當 Milvus 從原型轉變為生產<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>、推薦引擎和即時<a href="https://zilliz.com/learn/what-is-vector-search">向量搜尋的</a>骨幹時，問題變得無法避免：誰可以存取您的 Milvus 集群，以及他們到底可以做什麼？</p>
<p>Milvus 包括一個內建的 RBAC 系統來回答這個問題。本指南涵蓋了什麼是 RBAC，Milvus 如何實現它，以及如何設計一個訪問控制模型，以確保生產安全 - 完整的代碼示例和完整的 RAG 系統演練。</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">什麼是 RBAC（基於角色的存取控制）？<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>基於角色的存取控制 (RBAC)</strong>是一種安全模型，其權限並非直接指派給個別使用者。取而代之的是，權限被歸類為角色，使用者被指派一個或多個角色。使用者的有效存取權限是其指定角色的所有權限的總和。RBAC 是生產資料庫系統的標準存取控制模型 - PostgreSQL、MySQL、MongoDB 和大多數的雲端服務都使用它。</p>
<p>RBAC 解決了一個基本的擴充問題：當您有數十個使用者和服務時，管理每個使用者的權限將變得難以維護。有了 RBAC，您只需定義一次角色 (例如「X 收集上的唯讀」)，將其指派給十個服務，並在需求變更時在一個地方更新。</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Milvus 如何實施 RBAC？<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC 建立在四個概念上：</p>
<table>
<thead>
<tr><th>概念</th><th>它是什麼</th><th>範例</th></tr>
</thead>
<tbody>
<tr><td><strong>資源</strong></td><td>被存取的東西</td><td><a href="https://milvus.io/docs/architecture_overview.md">Milvus 實例</a>、<a href="https://milvus.io/docs/manage-databases.md">資料庫</a>或特定集合</td></tr>
<tr><td><strong>權限/權限組</strong></td><td>執行的動作</td><td><code translate="no">Search</code>,<code translate="no">Insert</code>,<code translate="no">DropCollection</code>, 或類似<code translate="no">COLL_RO</code> 的群組 (集合唯讀)</td></tr>
<tr><td><strong>角色</strong></td><td>指定資源範圍的一組權限</td><td><code translate="no">role_read_only</code>：可以搜尋和查詢<code translate="no">default</code> 資料庫中的所有收藏集</td></tr>
<tr><td><strong>使用者</strong></td><td>一個 Milvus 帳戶 (人或服務)</td><td><code translate="no">rag_writer</code>：擷取管道使用的服務帳號</td></tr>
</tbody>
</table>
<p>存取權不會直接指派給使用者。使用者會得到角色，角色包含權限，而權限的範圍則是資源。這與大多數生產資料庫系統所使用的<a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBAC 模型</a>相同。如果十個使用者共用相同的角色，您只需更新一次角色，變更就會適用於所有使用者。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Milvus RBAC 模型顯示使用者如何分配給角色，而角色包含適用於資源的權限和權限群。</span> </span></p>
<p>當一個請求進入 Milvus 時，它會經過三個檢查：</p>
<ol>
<li><strong>驗證</strong>- 這是一個具有正確憑證的有效用戶嗎？</li>
<li><strong>角色檢查</strong>- 這個用戶是否至少有一個角色？</li>
<li><strong>權限檢查</strong>- 用戶的任何角色是否允許在請求的資源上進行請求的操作？</li>
</ol>
<p>如果任何檢查失敗，請求將被拒絕。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Milvus 驗證和授權流程：用戶端請求經過驗證、角色檢查和權限檢查 - 在任何失敗的步驟都會被拒絕，只有在全部通過時才會執行。</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">如何在 Milvus 中啟用認證<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在預設情況下，Milvus 是在認證關閉的情況下運行的 - 每個連接都有完整的訪問權限。第一步是開啟它。</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>編輯<code translate="no">milvus.yaml</code> 並將<code translate="no">authorizationEnabled</code> 設為<code translate="no">true</code> ：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helm 圖表</h3><p>編輯<code translate="no">values.yaml</code> 並在<code translate="no">extraConfigFiles</code> 下加入設定：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>對於<a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a> 上的<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a>部署，同樣的設定會進入 Milvus CR 的<code translate="no">spec.config</code> 部分。</p>
<p>一旦啟用驗證且 Milvus 重新啟動，每個連線都必須提供憑證。Milvus 會建立一個密碼為<code translate="no">Milvus</code> 的預設<code translate="no">root</code> 使用者 - 請立即變更。</p>
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
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">如何設定使用者、角色和權限<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>啟用驗證後，以下是典型的設定工作流程。</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">步驟 1：建立使用者</h3><p>不要讓服務或團隊成員使用<code translate="no">root</code> 。為每個使用者或服務建立專用帳戶。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">步驟 2：建立角色</h3><p>Milvus 有內建的<code translate="no">admin</code> 角色，但實際上您需要符合實際存取模式的自訂角色。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">步驟 3：建立權限群組</h3><p>權限群組將多個權限綑綁在一個名稱下，讓管理存取規模變得更容易。Milvus 提供 9 個內建的特權群組：</p>
<table>
<thead>
<tr><th>內建群組</th><th>範圍</th><th>允許的權限</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>收集</td><td>唯讀操作（查詢、搜尋等）</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>集合</td><td>讀寫作業</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>收藏集</td><td>完整的資料庫管理</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>資料庫</td><td>唯讀資料庫操作</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>資料庫</td><td>讀寫資料庫操作</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>資料庫</td><td>完整資料庫管理</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>群集</td><td>唯讀群集操作</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>群集</td><td>讀寫群集操作</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>群集</td><td>完整群集管理</td></tr>
</tbody>
</table>
<p>當內建的權限群組不適合時，您也可以建立自訂的權限群組：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">步驟 4：授予角色權限</h3><p>授予角色個別權限或權限群組，其範圍為特定資源。<code translate="no">collection_name</code> 和<code translate="no">db_name</code> 參數控制權限範圍 - 全部使用<code translate="no">*</code> 。</p>
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
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">步驟 5：為使用者指定角色</h3><p>一個使用者可以擁有多個角色。他們的有效權限是所有指定角色的總和。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">如何審核和撤銷存取權限<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>了解存在哪些存取權限與授予存取權限同樣重要。陳舊的權限（來自前團隊成員、已退役的服務或一次性的除錯會話）會無聲無息地累積並擴大攻擊面。</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">檢查目前的權限</h3><p>檢視使用者的指定角色：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>檢視角色的授予權限：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">取消角色的權限</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
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
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">從使用者解除角色指派</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">刪除使用者或角色</h3><p>在刪除使用者之前，先移除所有角色指派，在撤銷角色之前，先撤銷所有權限：</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">範例：如何為生產型 RAG 系統設計 RBAC<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>有了具體的範例，抽象的概念會更容易理解。考慮一個建立在 Milvus 上的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>系統，它有三個不同的服務：</p>
<table>
<thead>
<tr><th>服務</th><th>責任</th><th>所需存取權限</th></tr>
</thead>
<tbody>
<tr><td><strong>平台管理員</strong></td><td>管理 Milvus 叢集 - 建立集合、監控健康、處理升級</td><td>完整叢集管理員</td></tr>
<tr><td><strong>輸入服務</strong></td><td>從文件產生<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>並將其寫入集合</td><td>集合上的讀取 + 寫入</td></tr>
<tr><td><strong>搜尋服務</strong></td><td>處理終端使用者的<a href="https://zilliz.com/learn/what-is-vector-search">向量搜尋查詢</a></td><td>只讀於集合</td></tr>
</tbody>
</table>
<p>這是使用<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> 的完整設定：</p>
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
<p>每個服務都能獲得所需的存取權限。搜尋服務不能意外刪除資料。擷取服務不能修改群集設定。如果搜尋服務的憑證外洩，攻擊者可以讀取<a href="https://zilliz.com/glossary/vector-embeddings">嵌入向量</a>，但無法寫入、刪除或升級為管理員。</p>
<p>對於管理多個 Milvus 部署存取權限的團隊而言，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(受管理的 Milvus) 提供內建 RBAC，可透過網頁主控台管理使用者、角色和權限 - 不需要腳本。當您希望透過使用者介面管理存取權限，而非維護跨環境的設定腳本時，此功能非常有用。</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">生產級存取控制最佳實務<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>上面的設定步驟是技術性的。以下是讓存取控制長期有效的設計原則。</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">鎖定 Root 帳戶</h3><p>先變更預設<code translate="no">root</code> 密碼。在生產中，root 帳戶只能用於緊急作業，並儲存在機密管理員中 - 而非硬性編碼在應用程式組態中或透過 Slack 共用。</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">完全分離環境</h3><p>開發、暫存和生產使用不同的<a href="https://milvus.io/docs/architecture_overview.md">Milvus 實例</a>。僅透過 RBAC 來區分環境是很脆弱的 - 一個錯誤設定的連線字串就會讓開發服務寫入生產資料。實體分離 (不同的群集、不同的憑證) 可完全消除這類事件。</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">應用最小權限</h3><p>給予每個使用者和服務執行其工作所需的最低存取權限。從狹窄的權限開始，僅在有特定、記錄的需求時才擴大權限。在開發環境中，您可以較為寬鬆，但生產環境的存取權限應該嚴格，並定期審核。</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">清理陳舊的存取權限</h3><p>當有人離開團隊或服務停用時，請立即撤銷他們的角色並刪除他們的帳號。擁有有效權限的未使用帳戶是未經授權存取最常見的媒介 - 他們是沒有人監控的有效憑證。</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">特定集合的權限範圍</h3><p>避免授予<code translate="no">collection_name='*'</code> ，除非該角色確實需要存取每個集合。在多租戶設定或有多個資料管道的系統中，每個角色的權限範圍只限於其操作<a href="https://milvus.io/docs/manage-collections.md">的集合</a>。如果憑證遭到洩露，這會限制爆炸半徑。</p>
<hr>
<p>如果您在生產中部署<a href="https://milvus.io/">Milvus</a>，並正在研究存取控制、安全性或多租戶設計，我們很樂意提供協助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，與其他在規模上運行 Milvus 的工程師討論真正的部署實務。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的免費 Milvus Office Hours 課程</a>，以瞭解您的 RBAC 設計 - 無論是角色結構、集合層級範圍界定，或是多環境安全性。</li>
<li>如果您想跳過基礎架構設定，透過使用者介面管理存取控制，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(管理式 Milvus) 包括內建 RBAC 的網頁主控台，以及<a href="https://zilliz.com/cloud-security">加密</a>、網路隔離和開箱即用的 SOC 2 合規性。</li>
</ul>
<hr>
<p>當團隊開始在 Milvus 中設定存取控制時，會遇到一些問題：</p>
<p><strong>問：我可以限制使用者只能存取特定的收藏集，而不是所有的收藏集嗎？</strong></p>
<p>可以。當您呼叫 <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>，將<code translate="no">collection_name</code> 設定為特定的收藏集，而不是<code translate="no">*</code> 。使用者的角色將只能存取該收藏集。您可以在每個資料集中呼叫一次函式，賦予相同角色在多個資料集中的權限。</p>
<p><strong>問：在 Milvus 中，特權和特權組有什麼區別？</strong></p>
<p>特權是單一的操作，如<code translate="no">Search</code>,<code translate="no">Insert</code>, 或<code translate="no">DropCollection</code> 。<a href="https://milvus.io/docs/privilege_group.md">特權群組</a>在一個名稱下綁定多個特權 - 例如，<code translate="no">COLL_RO</code> 包括所有只讀的集合操作。授予特權群組的功能與單獨授予每個組成特權的功能相同，但更容易管理。</p>
<p><strong>問：啟用驗證會影響 Milvus 的查詢效能嗎？</strong></p>
<p>開銷可以忽略不計。Milvus 在每次請求時都會驗證憑證和檢查角色權限，但這是記憶體內的查詢 - 增加的是微秒，而不是毫秒。這對<a href="https://milvus.io/docs/single-vector-search.md">搜尋或</a> <a href="https://milvus.io/docs/insert-update-delete.md">插入</a>延遲沒有明顯的影響。</p>
<p><strong>問：我可以在多租戶設置中使用 Milvus RBAC 嗎？</strong></p>
<p>可以。為每個租戶建立獨立的角色，將每個角色的權限範圍擴大到該租戶的集合，並將相應的角色分配給每個租戶的服務帳戶。這樣，您就可以在不需要獨立 Milvus 實體的情況下，實現集合層級的隔離。對於更大規模的多租戶，請參閱<a href="https://milvus.io/docs/multi_tenancy.md">Milvus 多租戶指南</a>。</p>
