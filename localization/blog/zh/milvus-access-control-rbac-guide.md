---
id: milvus-access-control-rbac-guide.md
title: Milvus 访问控制指南：如何为生产配置 RBAC
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
desc: 在生产中设置 Milvus RBAC 的分步指南--用户、角色、特权组、 Collections 级访问，以及完整的 RAG 系统示例。
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>这里有一个比较常见的故事：一名质量保证工程师在他们认为是暂存环境的地方运行一个清理脚本。但连接字符串指向的是生产环境。几秒钟后，核心向量 Collections 就不见了--特征数据丢失，<a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>返回空结果，服务全面下降。事后调查发现，根本原因始终如一：每个人都是以<code translate="no">root</code> 的身份连接的，没有访问边界，没有什么能阻止测试账户丢弃生产数据。</p>
<p>这不是一次性事件。在<a href="https://milvus.io/">Milvus</a>和一般<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>上构建<a href="https://zilliz.com/learn/what-is-a-vector-database">数据库</a>的团队往往会把重点放在<a href="https://zilliz.com/learn/vector-index">索引性能</a>、吞吐量和数据规模上，而把访问控制当作以后再处理的事情。但 "以后 "通常是以事件的形式出现。随着 Milvus 从原型转变为生产<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>、推荐引擎和实时<a href="https://zilliz.com/learn/what-is-vector-search">向量搜索</a>的骨干，问题变得不可避免：谁可以访问你的 Milvus 集群，以及他们到底可以做什么？</p>
<p>Milvus 内置的 RBAC 系统可以回答这个问题。本指南涵盖什么是 RBAC、Milvus 如何实现 RBAC，以及如何设计一个能确保生产安全的访问控制模型，并附有代码示例和完整的 RAG 系统演练。</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">什么是 RBAC（基于角色的访问控制）？<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>基于角色的访问控制（RBAC）</strong>是一种安全模型，它不将权限直接分配给单个用户。相反，权限被分组为角色，用户被分配一个或多个角色。用户的有效访问权限是其所分配角色的所有权限的总和。RBAC 是生产数据库系统中的标准访问控制模型--PostgreSQL、MySQL、MongoDB 和大多数云服务都使用这种模型。</p>
<p>RBAC 解决了一个基本的扩展问题：当你有几十个用户和服务时，按用户管理权限就变得难以维护。有了 RBAC，你只需定义一次角色（例如，"Collection X 上的只读"），将其分配给十个服务，并在需求发生变化时在一个地方进行更新。</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Milvus 如何实现 RBAC？<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC 基于四个概念：</p>
<table>
<thead>
<tr><th>概念</th><th>是什么</th><th>示例</th></tr>
</thead>
<tbody>
<tr><td><strong>资源</strong></td><td>被访问的事物</td><td><a href="https://milvus.io/docs/architecture_overview.md">Milvus 实例</a>、<a href="https://milvus.io/docs/manage-databases.md">数据库</a>或特定 Collections</td></tr>
<tr><td><strong>权限/权限组</strong></td><td>执行的操作</td><td><code translate="no">Search</code>,<code translate="no">Insert</code>,<code translate="no">DropCollection</code>, 或类似<code translate="no">COLL_RO</code> 的组 （Collection 只读）</td></tr>
<tr><td><strong>角色</strong></td><td>指定的资源权限集</td><td><code translate="no">role_read_only</code>角色：可以搜索和查询<code translate="no">default</code> 数据库中的所有 Collections</td></tr>
<tr><td><strong>用户</strong></td><td>Milvus 账户（人类或服务账户）</td><td><code translate="no">rag_writer</code>服务账户：摄取管道使用的服务账户</td></tr>
</tbody>
</table>
<p>访问权限从不直接分配给用户。用户获得角色，角色包含权限，权限的作用域是资源。这与大多数生产数据库系统中使用的<a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBAC 模型</a>相同。如果有十个用户共享同一个角色，你只需更新一次角色，所有用户都会受到影响。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Milvus RBAC 模型显示了如何将用户分配给角色，而角色包含适用于资源的权限和权限组。</span> </span></p>
<p>当请求进入 Milvus 时，要经过三道检查：</p>
<ol>
<li><strong>身份验证</strong>--这是一个拥有正确凭证的有效用户吗？</li>
<li><strong>角色检查</strong>--该用户是否至少有一个角色？</li>
<li><strong>权限检查</strong>--该用户的任何角色是否允许在请求的资源上执行请求的操作？</li>
</ol>
<p>如果任何检查失败，请求将被拒绝。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Milvus 身份验证和授权流程：客户端请求通过身份验证、角色检查和权限检查--任何一步失败都会被拒绝，只有全部通过才会被执行</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">如何在 Milvus 中启用身份验证<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>默认情况下，Milvus 运行时禁用身份验证--每个连接都有完全访问权。第一步是打开身份验证。</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>编辑<code translate="no">milvus.yaml</code> 并将<code translate="no">authorizationEnabled</code> 设置为<code translate="no">true</code> ：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helm 图表</h3><p>编辑<code translate="no">values.yaml</code> 并将设置添加到<code translate="no">extraConfigFiles</code> 下：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>对于<a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a> 上的<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a>部署，同样的配置会进入 Milvus CR 的<code translate="no">spec.config</code> 部分。</p>
<p>启用身份验证并重新启动 Milvus 后，每个连接都必须提供凭据。Milvus 会创建一个密码为<code translate="no">Milvus</code> 的默认<code translate="no">root</code> 用户--请立即更改。</p>
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
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">如何配置用户、角色和权限<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>启用身份验证后，以下是典型的设置工作流程。</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">第 1 步：创建用户</h3><p>不要让服务或团队成员使用<code translate="no">root</code> 。为每个用户或服务创建专用账户。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">第 2 步：创建角色</h3><p>Milvus 有一个内置的<code translate="no">admin</code> 角色，但在实践中，你会希望自定义的角色与你的实际访问模式相匹配。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">第 3 步：创建权限组</h3><p>权限组将多个权限捆绑在一个名称下，从而更容易管理大规模访问。Milvus 提供 9 个内置权限组：</p>
<table>
<thead>
<tr><th>内置组</th><th>范围</th><th>允许的权限</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Collections</td><td>只读操作（查询、搜索等）</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Collections</td><td>读写操作符</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Collections</td><td>全面管理 Collections</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>数据库</td><td>只读数据库操作符</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>数据库</td><td>读写数据库操作符</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>数据库</td><td>完整数据库管理</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>群集</td><td>只读群集操作符</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>群集</td><td>读写群集操作符</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>群集</td><td>完整群集管理</td></tr>
</tbody>
</table>
<p>如果内置特权组不合适，也可以创建自定义特权组：</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">步骤 4：为角色授予权限</h3><p>向角色授予针对特定资源的个人权限或权限组。<code translate="no">collection_name</code> 和<code translate="no">db_name</code> 参数控制范围--全部使用<code translate="no">*</code> 。</p>
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
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">步骤 5：为用户分配角色</h3><p>一个用户可以拥有多个角色。他们的有效权限是所有已分配角色的总和。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">如何审核和撤销访问权限<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>了解存在哪些访问权限与授予访问权限同样重要。来自前团队成员、退役服务或一次性调试会话的陈旧权限会无声无息地积累起来，扩大攻击面。</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">检查当前权限</h3><p>查看用户分配的角色：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>查看角色的授权权限：</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">撤销角色的权限</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
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
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">取消用户的角色分配</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">删除用户或角色</h3><p>删除用户前删除所有角色分配，撤销角色前撤销所有权限：</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">示例如何为生产型 RAG 系统设计 RBAC<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>有了具体的例子，抽象的概念会更容易理解。考虑一个基于 Milvus 的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>系统，该系统有三个不同的服务：</p>
<table>
<thead>
<tr><th>服务</th><th>责任</th><th>所需访问权限</th></tr>
</thead>
<tbody>
<tr><td><strong>平台管理员</strong></td><td>管理 Milvus 群集--创建 Collection、监控健康状况、处理升级事宜</td><td>完整集群管理员</td></tr>
<tr><td><strong>输入服务</strong></td><td>从文档生成<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>并写入 Collections</td><td>读取 + 写入 Collections</td></tr>
<tr><td><strong>搜索服务</strong></td><td>处理终端用户的<a href="https://zilliz.com/learn/what-is-vector-search">向量搜索</a>查询</td><td>对 Collections 只读</td></tr>
</tbody>
</table>
<p>这是一个使用<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> 的完整设置：</p>
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
<p>每个服务都能获得所需的访问权限。搜索服务不会意外删除数据。摄取服务不能修改集群设置。如果搜索服务的凭据泄露，攻击者可以读取<a href="https://zilliz.com/glossary/vector-embeddings">嵌入向量</a>，但不能写入、删除或升级为管理员。</p>
<p>对于管理多个 Milvus 部署访问权限的团队来说，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus）提供了内置 RBAC，可通过 Web 控制台管理用户、角色和权限，无需编写脚本。当你希望通过用户界面管理访问权限，而不是跨环境维护设置脚本时，该功能就非常有用。</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">生产中的访问控制最佳实践<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>上述设置步骤是基本原理。以下是设计原则，可使访问控制长期有效。</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">锁定根账户</h3><p>先更改<code translate="no">root</code> 的默认密码。在生产环境中，root 账户应仅用于紧急操作，并存储在机密管理器中，而不是硬编码在应用程序配置中或通过 Slack 共享。</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">完全分离环境</h3><p>为开发、暂存和生产使用不同的<a href="https://milvus.io/docs/architecture_overview.md">Milvus 实例</a>。仅通过 RBAC 进行环境分离是很脆弱的，一个配置错误的连接字符串就会导致开发服务写入生产数据。物理分离（不同的集群、不同的凭证）可完全消除此类事件。</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">应用最小权限</h3><p>为每个用户和服务提供完成其工作所需的最低权限。开始时缩小权限，只有在有特定的、记录在案的需求时才扩大权限。在开发环境中，可以放宽一些，但对生产环境的访问权限应严格控制并定期审查。</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">清理陈旧的访问权限</h3><p>当有人离开团队或服务退役时，应立即撤销其角色并删除其账户。拥有有效权限的未使用账户是未经授权访问的最常见向量--它们是无人监控的有效凭证。</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">特定 Collection 的权限范围</h3><p>避免授予<code translate="no">collection_name='*'</code> ，除非角色确实需要访问每个 Collection。在多租户设置或具有多个数据管道的系统中，将每个角色的权限范围限定为只能在其操作符上操作的<a href="https://milvus.io/docs/manage-collections.md">Collection</a>。这样可以在凭证泄露时限制爆炸半径。</p>
<hr>
<p>如果您正在生产中部署<a href="https://milvus.io/">Milvus</a>，并正在研究访问控制、安全性或多租户设计，我们很乐意为您提供帮助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，与其他大规模运行 Milvus 的工程师讨论实际部署实践。</li>
<li><a href="https://milvus.io/office-hours">预订 20 分钟的 Milvus Office Hours 免费课程</a>，了解您的 RBAC 设计--无论是角色结构、Collection 层级范围，还是多环境安全性。</li>
<li>如果您想跳过基础架构设置，通过用户界面管理访问控制，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（Milvus 托管）包括内置的 RBAC 和 Web 控制台，以及<a href="https://zilliz.com/cloud-security">加密</a>、网络隔离和开箱即用的 SOC 2 合规性。</li>
</ul>
<hr>
<p>当团队开始在 Milvus 中配置访问控制时，会遇到一些问题：</p>
<p><strong>问：我能否限制用户只能访问特定的 Collections，而不是所有的 Collections？</strong></p>
<p>可以。当您调用 <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>时，将<code translate="no">collection_name</code> 设置为特定 Collections，而不是<code translate="no">*</code> 。用户的角色将只能访问该 Collections。您可以在每个 Collection 上调用一次函数，在多个 Collection 上授予同一角色权限。</p>
<p><strong>问：在 Milvus 中，权限和权限组有什么区别？</strong></p>
<p>特权是一个单独的操作符，如<code translate="no">Search</code> 、<code translate="no">Insert</code> 或<code translate="no">DropCollection</code> 。<a href="https://milvus.io/docs/privilege_group.md">特权组将</a>多个特权捆绑在一个名称下--例如，<code translate="no">COLL_RO</code> 包括所有只读的 Collections 操作。授予特权组的功能与单独授予每个组成特权的功能相同，但更易于管理。</p>
<p><strong>问：启用身份验证会影响 Milvus 查询性能吗？</strong></p>
<p>开销可以忽略不计。Milvus 在每次请求时都会验证凭证并检查角色权限，但这是在内存中查找，增加的是微秒而不是毫秒。对<a href="https://milvus.io/docs/single-vector-search.md">搜索</a>或<a href="https://milvus.io/docs/insert-update-delete.md">插入</a>延迟没有明显影响。</p>
<p><strong>问：我可以在多租户设置中使用 Milvus RBAC 吗？</strong></p>
<p>可以。为每个租户创建单独的角色，将每个角色的权限范围扩大到该租户的 Collections，并为每个租户的服务账户分配相应的角色。这样，您就可以在不需要单独的 Milvus 实例的情况下，实现 Collections 级别的隔离。有关更大规模的多租户，请参阅<a href="https://milvus.io/docs/multi_tenancy.md">Milvus 多租户指南</a>。</p>
