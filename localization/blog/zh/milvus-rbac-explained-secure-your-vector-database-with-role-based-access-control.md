---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: Milvus RBAC 解读：用基于角色的访问控制保护你的向量数据库
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
desc: 了解 RBAC 为何重要、Milvus 中的 RBAC 如何工作、如何配置访问控制，以及它如何实现最少权限访问、明确的角色分离和安全的生产操作。
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>在构建数据库系统时，工程师会将大部分时间花在性能上：索引类型、召回、延迟、吞吐量和扩展。但是，一旦系统超越了单个开发人员的笔记本电脑，另一个问题就变得同样重要：<strong>谁能在你的 Milvus 集群中做什么</strong>？换句话说，就是访问控制。</p>
<p>在整个行业中，许多操作符事件都源于简单的权限错误。脚本在错误的环境中运行。服务账户的访问权限超出预期。共享的管理员凭据最终出现在 CI 中。这些问题通常表现为非常实际的问题：</p>
<ul>
<li><p>是否允许开发人员删除生产 Collection？</p></li>
<li><p>为什么测试账户可以读取生产向量数据？</p></li>
<li><p>为什么多个服务使用相同的管理员角色登录？</p></li>
<li><p>分析工作是否可以只读访问，而写入权限为零？</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a>通过<a href="https://milvus.io/docs/rbac.md">基于角色的访问控制（RBAC）</a>解决了这些难题。RBAC 可让你在数据库层定义精确的权限，而不是赋予每个用户超级管理员权限或试图在应用程序代码中实施限制。每个用户或服务都能获得所需的功能，仅此而已。</p>
<p>这篇文章解释了 RBAC 在 Milvus 中的工作原理、如何配置它，以及如何在生产环境中安全地应用它。</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">为什么使用 Milvus 时访问控制很重要？<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>当团队规模较小，其人工智能应用程序只服务于数量有限的用户时，基础设施通常比较简单。少数工程师负责管理系统；Milvus 仅用于开发或测试；操作工作流程简单明了。在这一早期阶段，访问控制很少让人感到紧迫--因为风险面很小，而且任何错误都很容易逆转。</p>
<p>随着 Milvus 进入生产阶段，用户、服务和操作符的数量不断增加，使用模型也迅速发生变化。常见的情况包括</p>
<ul>
<li><p>多个业务系统共享同一个 Milvus 实例</p></li>
<li><p>多个团队访问同一个向量 Collections</p></li>
<li><p>测试、暂存和生产数据共存于一个集群中</p></li>
<li><p>从只读查询到写入和操作符控制，不同角色需要不同级别的访问权限</p></li>
</ul>
<p>如果没有定义明确的访问边界，这些设置就会产生可预见的风险：</p>
<ul>
<li><p>测试工作流可能会意外删除生产收集</p></li>
<li><p>开发人员可能会无意中修改实时服务使用的索引</p></li>
<li><p><code translate="no">root</code> 账户的广泛使用导致无法跟踪或审计操作</p></li>
<li><p>受到攻击的应用程序可能会不受限制地访问所有向量数据</p></li>
</ul>
<p>随着使用量的增加，依靠非正式约定或共享管理员账户已难以为继。一个一致的、可执行的访问模型变得至关重要，而这正是 Milvus RBAC 所提供的。</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Milvus 中的 RBAC 是什么？<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC（基于角色的访问控制）</a>是一种基于<strong>角色</strong>而不是单个用户来控制访问的权限模型。在 Milvus 中，RBAC 可让您准确定义允许用户或服务执行哪些操作，以及对哪些特定资源执行操作。它提供了一种结构化、可扩展的安全管理方式，当你的系统从单个开发人员发展到一个完整的生产环境时，它也能发挥作用。</p>
<p>Milvus RBAC 围绕以下核心组件构建：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>用户 角色 权限</span> </span></p>
<ul>
<li><p><strong>资源</strong>：被访问的实体。在 Milvus 中，资源包括<strong>实例</strong>、<strong>数据库</strong>和<strong>Collections</strong>。</p></li>
<li><p><strong>权限</strong>：资源上允许的特定操作符--例如，创建 Collections、插入数据或删除实体。</p></li>
<li><p><strong>权限组</strong>：一组预定义的相关权限，如 "只读 "或 "写入"。</p></li>
<li><p><strong>角色</strong>：权限及其适用资源的组合。角色决定了可以执行<em>哪些</em>操作以及<em>在哪里</em>执行。</p></li>
<li><p><strong>用户</strong>：Milvus 中的一个身份。每个用户都有一个唯一的 ID，并被分配一个或多个角色。</p></li>
</ul>
<p>这些组件形成一个清晰的层次结构：</p>
<ol>
<li><p><strong>用户被分配角色</strong></p></li>
<li><p><strong>角色定义权限</strong></p></li>
<li><p><strong>权限适用于特定资源</strong></p></li>
</ol>
<p>Milvus 的一个关键设计原则是，<strong>绝不将权限直接分配给用户</strong>。所有访问都通过角色进行。这种间接方式简化了管理，减少了配置错误，并使权限变更具有可预测性。</p>
<p>在实际部署中，该模型的扩展性很好。当多个用户共享一个角色时，更新该角色的权限会立即更新所有用户的权限，而无需对每个用户进行单独修改。这是一种单点控制，符合现代基础设施管理访问的方式。</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">RBAC 在 Milvus 中的工作原理<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>当客户端向 Milvus 发送请求时，系统会通过一系列授权步骤进行评估。每个步骤都必须通过，才允许继续操作：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Milvus 中的 RBAC 工作原理</span> </span></p>
<ol>
<li><p><strong>验证请求：</strong>Milvus 首先验证用户身份。如果身份验证失败，请求会以身份验证错误的方式被拒绝。</p></li>
<li><p><strong>检查角色分配：</strong>身份验证后，Milvus 会检查用户是否至少分配了一个角色。如果未找到任何角色，请求将被拒绝，并显示 "拒绝权限 "错误。</p></li>
<li><p><strong>验证所需权限：</strong>然后，Milvus 会评估用户的角色是否赋予目标资源所需的权限。如果权限检查失败，请求将被拒绝，并显示 "拒绝权限 "错误。</p></li>
<li><p><strong>执行操作符：</strong>如果所有检查都通过，Milvus 将执行请求的操作并返回结果。</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">如何在 Milvus 中通过 RBAC 配置访问控制<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1.前提条件</h3><p>在评估和执行 RBAC 规则之前，必须启用用户身份验证，以便 Milvus 的每个请求都能与特定的用户身份相关联。</p>
<p>以下是两种标准部署方法。</p>
<ul>
<li><strong>使用 Docker Compose 部署</strong></li>
</ul>
<p>如果使用 Docker Compose 部署 Milvus，请编辑<code translate="no">milvus.yaml</code> 配置文件，并通过将<code translate="no">common.security.authorizationEnabled</code> 设置为<code translate="no">true</code> 来启用授权：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>使用 Helm Charts 部署</strong></li>
</ul>
<p>如果使用 Helm Charts 部署 Milvus，请编辑<code translate="no">values.yaml</code> 文件并在<code translate="no">extraConfigFiles.user.yaml</code> 下添加以下配置： 1：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2.初始化</h3><p>默认情况下，Milvus 会在系统启动时创建一个内置的<code translate="no">root</code> 用户。该用户的默认密码为<code translate="no">Milvus</code> 。</p>
<p>作为初始安全步骤，使用<code translate="no">root</code> 用户连接 Milvus，并立即更改默认密码。强烈建议使用复杂密码，以防止未经授权的访问。</p>
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
<h3 id="3-Core-Operations" class="common-anchor-header">3.核心操作符</h3><p><strong>创建用户</strong></p>
<p>在日常使用中，建议创建专用用户，而不是使用<code translate="no">root</code> 账户。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>创建角色</strong></p>
<p>Milvus 提供了具有完全管理权限的内置<code translate="no">admin</code> 角色。不过，对于大多数生产场景，建议创建自定义角色，以实现更精细的访问控制。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>创建权限组</strong></p>
<p>权限组是多个权限的 Collections。为简化权限管理，可将相关权限分组并一起授予。</p>
<p>Milvus 包含以下内置权限组：</p>
<ul>
<li><p><code translate="no">COLL_RO</code>,<code translate="no">COLL_RW</code> 、<code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>,<code translate="no">DB_RW</code> 、<code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>,<code translate="no">Cluster_RW</code> 、<code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>使用这些内置权限组可以大大降低权限设计的复杂性，并提高不同角色之间的一致性。</p>
<p>你既可以直接使用内置权限组，也可以根据需要创建自定义权限组。</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>为角色授予权限或权限组</strong></p>
<p>创建角色后，可向角色授予权限或权限组。这些特权的目标资源可以在不同级别指定，包括实例、数据库或单个 Collections。</p>
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
<p><strong>向用户授予角色</strong></p>
<p>一旦为用户分配了角色，用户就可以访问资源并执行这些角色所定义的操作符。根据所需的访问范围，一个用户可以被授予一个或多个角色。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4.检查和撤销访问</h3><p><strong>检查分配给用户的角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>检查分配给角色的权限</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>从角色撤销权限</strong></p>
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
<p><strong>撤销用户的角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>删除用户和角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">示例：Milvus 驱动的 RAG 系统的访问控制设计<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>考虑建立在 Milvus 基础上的检索-增强生成（RAG）系统。</p>
<p>在这个系统中，不同的组件和用户有明确的职责分工，每个组件和用户都需要不同级别的访问权限。</p>
<table>
<thead>
<tr><th>行为者</th><th>责任</th><th>所需访问权限</th></tr>
</thead>
<tbody>
<tr><td>平台管理员</td><td>系统操作和配置</td><td>实例级管理</td></tr>
<tr><td>向量摄取服务</td><td>向量数据摄取和更新</td><td>读写访问</td></tr>
<tr><td>搜索服务</td><td>向量搜索和检索</td><td>只读访问</td></tr>
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
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">快速提示：如何在生产中安全操作访问控制<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>为确保门禁控制在长期运行的生产系统中始终有效且易于管理，请遵循以下实用指南。</p>
<p><strong>1.更改</strong> <code translate="no">root</code> <strong>的默认</strong> <strong>密码并限制使用</strong> <code translate="no">root</code> <strong>账户</strong></p>
<p>初始化后立即更新默认的<code translate="no">root</code> 密码，并限制其仅用于管理任务。避免在日常操作中使用或共享 root 帐户。相反，应为日常访问创建专用用户和角色，以降低风险并加强问责制。</p>
<p><strong>2.跨环境物理隔离 Milvus 实例</strong></p>
<p>为开发、暂存和生产部署独立的 Milvus 实例。与单纯的逻辑访问控制相比，物理隔离提供了更强的安全边界，大大降低了跨环境错误的风险。</p>
<p><strong>3.遵循最小权限原则</strong></p>
<p>只授予每个角色所需的权限：</p>
<ul>
<li><p><strong>开发环境：</strong>权限可以更宽松，以支持迭代和测试</p></li>
<li><p><strong>生产环境：</strong>权限应严格限制在必要的范围内</p></li>
<li><p><strong>定期审核：</strong>定期审核现有权限，确保其仍为必要权限</p></li>
</ul>
<p><strong>4.当不再需要权限时，主动撤销权限</strong></p>
<p>访问控制不是一次性设置，需要持续维护。当用户、服务或职责发生变化时，及时撤销角色和权限。这可以防止未使用的权限随着时间的推移不断累积，成为隐藏的安全风险。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中配置访问控制本身并不复杂，但对于在生产中安全可靠地操作该系统至关重要。通过精心设计的 RBAC 模型，你可以</p>
<ul>
<li><p>防止意外或破坏性操作，<strong>降低风险</strong></p></li>
<li><p>通过执行最少权限访问向量数据来<strong>提高安全性</strong></p></li>
<li><p>通过明确的职责分工<strong>实现操作符标准化</strong></p></li>
<li><p><strong>放心扩展</strong>，为多租户和大规模部署奠定基础</p></li>
</ul>
<p>访问控制不是可有可无的功能，也不是一次性任务。它是长期安全操作 Milvus 的基础部分。</p>
<p>👉开始使用<a href="https://milvus.io/docs/rbac.md">RBAC</a>为您的 Milvus 部署建立坚实的安全基线。</p>
<p>对最新 Milvus 的任何功能有问题或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
