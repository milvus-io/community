---
id: milvus-access-control-rbac-guide.md
title: |
  Milvus Access Control Guide: How to Configure RBAC for Production
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
desc: >
  Step-by-step guide to setting up Milvus RBAC in production — users, roles,
  privilege groups, collection-level access, and a full RAG system example.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Here’s a story that’s more common than it should be: a QA engineer runs a cleanup script against what they think is the staging environment. Except the connection string points to production. A few seconds later, core vector collections are gone — feature data lost, <a href="https://zilliz.com/glossary/similarity-search">similarity search</a> returning empty results, services degrading across the board. The postmortem finds the same root cause it always does: everyone was connecting as <code translate="no">root</code>, there were no access boundaries, and nothing stopped a test account from dropping production data.</p>
<p>This isn’t a one-off. Teams building on <a href="https://milvus.io/">Milvus</a> — and <a href="https://zilliz.com/learn/what-is-a-vector-database">vector databases</a> in general — tend to focus on <a href="https://zilliz.com/learn/vector-index">index performance</a>, throughput, and data scale, while treating access control as something to deal with later. But “later” usually arrives in the form of an incident. As Milvus moves from prototype to the backbone of production <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG pipelines</a>, recommendation engines, and real-time <a href="https://zilliz.com/learn/what-is-vector-search">vector search</a>, the question becomes unavoidable: who can access your Milvus cluster, and what exactly are they allowed to do?</p>
<p>Milvus includes a built-in RBAC system to answer that question. This guide covers what RBAC is, how Milvus implements it, and how to design an access control model that keeps production safe — complete with code examples and a full RAG system walkthrough.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">What Is RBAC (Role-Based Access Control)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Role-Based Access Control (RBAC)</strong> is a security model where permissions are not assigned directly to individual users. Instead, permissions are grouped into roles, and users are assigned one or more roles. A user’s effective access is the union of all permissions from their assigned roles. RBAC is the standard access control model in production database systems — PostgreSQL, MySQL, MongoDB, and most cloud services use it.</p>
<p>RBAC solves a fundamental scaling problem: when you have dozens of users and services, managing permissions per-user becomes unmaintainable. With RBAC, you define a role once (e.g., “read-only on collection X”), assign it to ten services, and update it in one place when requirements change.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">How Does Milvus Implement RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC is built on four concepts:</p>
<table>
<thead>
<tr><th>Concept</th><th>What It Is</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td><strong>Resource</strong></td><td>The thing being accessed</td><td>A <a href="https://milvus.io/docs/architecture_overview.md">Milvus instance</a>, a <a href="https://milvus.io/docs/manage-databases.md">database</a>, or a specific collection</td></tr>
<tr><td><strong>Privilege / Privilege Group</strong></td><td>The action being performed</td><td><code translate="no">Search</code>, <code translate="no">Insert</code>, <code translate="no">DropCollection</code>, or a group like <code translate="no">COLL_RO</code> (collection read-only)</td></tr>
<tr><td><strong>Role</strong></td><td>A named set of privileges scoped to resources</td><td><code translate="no">role_read_only</code>: can search and query all collections in <code translate="no">default</code> database</td></tr>
<tr><td><strong>User</strong></td><td>A Milvus account (human or service)</td><td><code translate="no">rag_writer</code>: the service account used by the ingestion pipeline</td></tr>
</tbody>
</table>
<p>Access is never assigned directly to users. Users get roles, roles contain privileges, and privileges are scoped to resources. This is the same <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBAC model</a> used in most production database systems. If ten users share the same role, you update the role once and the change applies to all of them.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
    <span>Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources</span>
  </span>
</p>
<p>When a request hits Milvus, it goes through three checks:</p>
<ol>
<li><strong>Authentication</strong> — is this a valid user with correct credentials?</li>
<li><strong>Role check</strong> — does this user have at least one role assigned?</li>
<li><strong>Privilege check</strong> — does any of the user’s roles grant the requested action on the requested resource?</li>
</ol>
<p>If any check fails, the request is rejected.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
    <span>Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass</span>
  </span>
</p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">How to Enable Authentication in Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>By default, Milvus runs with authentication disabled — every connection has full access. The first step is turning it on.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Edit <code translate="no">milvus.yaml</code> and set <code translate="no">authorizationEnabled</code> to <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helm Charts</h3><p>Edit <code translate="no">values.yaml</code> and add the setting under <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>For <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> deployments on <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, the same configuration goes into the Milvus CR’s <code translate="no">spec.config</code> section.</p>
<p>Once authentication is enabled and Milvus restarts, every connection must provide credentials. Milvus creates a default <code translate="no">root</code> user with the password <code translate="no">Milvus</code> — change this immediately.</p>
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
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">How to Configure Users, Roles, and Privileges<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>With authentication enabled, here’s the typical setup workflow.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Step 1: Create Users</h3><p>Don’t let services or team members use <code translate="no">root</code>. Create dedicated accounts for each user or service.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Step 2: Create Roles</h3><p>Milvus has a built-in <code translate="no">admin</code> role, but in practice you’ll want custom roles that match your actual access patterns.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Step 3: Create Privilege Groups</h3><p>A privilege group bundles multiple privileges under one name, making it easier to manage access at scale. Milvus provides 9 built-in privilege groups:</p>
<table>
<thead>
<tr><th>Built-in Group</th><th>Scope</th><th>What It Allows</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Collection</td><td>Read-only operations (Query, Search, etc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Collection</td><td>Read and write operations</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Collection</td><td>Full collection management</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Database</td><td>Read-only database operations</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Database</td><td>Read and write database operations</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Database</td><td>Full database management</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Read-only cluster operations</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Read and write cluster operations</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Full cluster management</td></tr>
</tbody>
</table>
<p>You can also create custom privilege groups when the built-in ones don’t fit:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Step 4: Grant Privileges to a Role</h3><p>Grant individual privileges or privilege groups to a role, scoped to specific resources. The <code translate="no">collection_name</code> and <code translate="no">db_name</code> parameters control the scope — use <code translate="no">*</code> for all.</p>
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
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Step 5: Assign Roles to Users</h3><p>A user can hold multiple roles. Their effective permissions are the union of all assigned roles.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">How to Audit and Revoke Access<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowing what access exists is just as important as granting it. Stale permissions — from former team members, retired services, or one-off debugging sessions — accumulate silently and widen the attack surface.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Check Current Permissions</h3><p>View a user’s assigned roles:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>View a role’s granted privileges:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Revoke Privileges from a Role</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
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
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Unassign a Role from a User</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Delete Users or Roles</h3><p>Remove all role assignments before deleting a user, and revoke all privileges before dropping a role:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Example: How to Design RBAC for a Production RAG System<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Abstract concepts click faster with a concrete example. Consider a <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> system built on Milvus with three distinct services:</p>
<table>
<thead>
<tr><th>Service</th><th>Responsibility</th><th>Required Access</th></tr>
</thead>
<tbody>
<tr><td><strong>Platform admin</strong></td><td>Manages the Milvus cluster — creates collections, monitors health, handles upgrades</td><td>Full cluster admin</td></tr>
<tr><td><strong>Ingestion service</strong></td><td>Generates <a href="https://zilliz.com/glossary/vector-embeddings">vector embeddings</a> from documents and writes them to collections</td><td>Read + write on collections</td></tr>
<tr><td><strong>Search service</strong></td><td>Handles <a href="https://zilliz.com/learn/what-is-vector-search">vector search</a> queries from end users</td><td>Read-only on collections</td></tr>
</tbody>
</table>
<p>Here’s a complete setup using <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
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
<p>Each service gets exactly the access it needs. The search service can’t accidentally delete data. The ingestion service can’t modify cluster settings. And if the search service’s credentials leak, the attacker can read <a href="https://zilliz.com/glossary/vector-embeddings">embedding vectors</a> — but can’t write, delete, or escalate to admin.</p>
<p>For teams managing access across multiple Milvus deployments, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) provides built-in RBAC with a web console for managing users, roles, and permissions — no scripting required. Useful when you’d rather manage access through a UI than maintain setup scripts across environments.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Access Control Best Practices for Production<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>The setup steps above are the mechanics. Here are the design principles that keep access control effective over time.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Lock Down the Root Account</h3><p>Change the default <code translate="no">root</code> password before anything else. In production, the root account should be used only for emergency operations and stored in a secrets manager — not hardcoded in application configs or shared over Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Separate Environments Completely</h3><p>Use different <a href="https://milvus.io/docs/architecture_overview.md">Milvus instances</a> for development, staging, and production. Environment separation by RBAC alone is fragile — one misconfigured connection string and a dev service is writing to production data. Physical separation (different clusters, different credentials) eliminates this class of incident entirely.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Apply Least Privilege</h3><p>Give each user and service the minimum access needed to do its job. Start narrow and widen only when there’s a specific, documented need. In development environments you can be more relaxed, but production access should be strict and reviewed regularly.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Clean Up Stale Access</h3><p>When someone leaves the team or a service gets decommissioned, revoke their roles and delete their accounts immediately. Unused accounts with active permissions are the most common vector for unauthorized access — they’re valid credentials that nobody is monitoring.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Scope Privileges to Specific Collections</h3><p>Avoid granting <code translate="no">collection_name='*'</code> unless the role genuinely needs access to every collection. In multi-tenant setups or systems with multiple data pipelines, scope each role to only the <a href="https://milvus.io/docs/manage-collections.md">collections</a> it operates on. This limits the blast radius if credentials are compromised.</p>
<hr>
<p>If you’re deploying <a href="https://milvus.io/">Milvus</a> in production and working through access control, security, or multi-tenant design, we’d love to help:</p>
<ul>
<li>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> to discuss real deployment practices with other engineers running Milvus at scale.</li>
<li><a href="https://milvus.io/office-hours">Book a free 20-minute Milvus Office Hours session</a> to walk through your RBAC design — whether it’s role structure, collection-level scoping, or multi-environment security.</li>
<li>If you’d rather skip the infrastructure setup and manage access control through a UI, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) includes built-in RBAC with a web console — plus <a href="https://zilliz.com/cloud-security">encryption</a>, network isolation, and SOC 2 compliance out of the box.</li>
</ul>
<hr>
<p>A few questions that come up when teams start configuring access control in Milvus:</p>
<p><strong>Q: Can I restrict a user to only specific collections, not all of them?</strong></p>
<p>Yes. When you call <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>, set <code translate="no">collection_name</code> to the specific collection rather than <code translate="no">*</code>. The user’s role will only have access to that collection. You can grant the same role privileges on multiple collections by calling the function once per collection.</p>
<p><strong>Q: What’s the difference between a privilege and a privilege group in Milvus?</strong></p>
<p>A privilege is a single action like <code translate="no">Search</code>, <code translate="no">Insert</code>, or <code translate="no">DropCollection</code>. A <a href="https://milvus.io/docs/privilege_group.md">privilege group</a> bundles multiple privileges under one name — for example, <code translate="no">COLL_RO</code> includes all read-only collection operations. Granting a privilege group is functionally the same as granting each of its constituent privileges individually, but easier to manage.</p>
<p><strong>Q: Does enabling authentication affect Milvus query performance?</strong></p>
<p>The overhead is negligible. Milvus validates credentials and checks role permissions on each request, but this is an in-memory lookup — it adds microseconds, not milliseconds. There is no measurable impact on <a href="https://milvus.io/docs/single-vector-search.md">search</a> or <a href="https://milvus.io/docs/insert-update-delete.md">insert</a> latency.</p>
<p><strong>Q: Can I use Milvus RBAC in a multi-tenant setup?</strong></p>
<p>Yes. Create separate roles per tenant, scope each role’s privileges to that tenant’s collections, and assign the corresponding role to each tenant’s service account. This gives you collection-level isolation without needing separate Milvus instances. For larger-scale multi-tenancy, see the <a href="https://milvus.io/docs/multi_tenancy.md">Milvus multi-tenancy guide</a>.</p>
