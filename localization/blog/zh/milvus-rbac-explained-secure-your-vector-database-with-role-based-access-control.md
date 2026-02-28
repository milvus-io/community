---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >
  Milvus RBAC Explained: Secure Your Vector Database with Role-Based Access
  Control 
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
  Learn why RBAC matters, how RBAC in Milvus works, how to configure access
  control, and how it enables least-privilege access, clear role separation, and
  safe production operations.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>When building a database system, engineers spend most of their time on performance: index types, recall, latency, throughput, and scaling. But once a system moves beyond a single developer’s laptop, another question becomes just as critical: <strong>who can do what inside your Milvus cluster</strong>? In other words—access control.</p>
<p>Across the industry, many operational incidents stem from simple permission mistakes. A script runs against the wrong environment. A service account has broader access than intended. A shared admin credential ends up in CI. These issues usually surface as very practical questions:</p>
<ul>
<li><p>Are developers allowed to delete production collections?</p></li>
<li><p>Why can a test account read production vector data?</p></li>
<li><p>Why are multiple services logging in with the same admin role?</p></li>
<li><p>Can analytics jobs have read-only access with zero write privileges?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> addresses these challenges with <a href="https://milvus.io/docs/rbac.md">role-based access control (RBAC)</a>. Instead of giving every user superadmin rights or trying to enforce restrictions in application code, RBAC lets you define precise permissions at the database layer. Each user or service gets exactly the capabilities it needs—nothing more.</p>
<p>This post explains how RBAC works in Milvus, how to configure it, and how to apply it safely in production environments.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Why Access Control Matters When Using Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>When teams are small, and their AI applications serve only a limited number of users, infrastructure is usually simple. A few engineers manage the system; Milvus is used only for development or testing; and operational workflows are straightforward. In this early stage, access control rarely feels urgent—because the risk surface is small and any mistakes can be easily reversed.</p>
<p>As Milvus moves into production and the number of users, services, and operators grows, the usage model changes quickly. Common scenarios include:</p>
<ul>
<li><p>Multiple business systems sharing the same Milvus instance</p></li>
<li><p>Multiple teams accessing the same vector collections</p></li>
<li><p>Test, staging, and production data coexisting in a single cluster</p></li>
<li><p>Different roles needing different levels of access, from read-only queries to writes and operational control</p></li>
</ul>
<p>Without well-defined access boundaries, these setups create predictable risks:</p>
<ul>
<li><p>Test workflows might accidentally delete production collections</p></li>
<li><p>Developers might unintentionally modify indexes used by live services</p></li>
<li><p>Widespread use of the <code translate="no">root</code> account makes actions impossible to trace or audit</p></li>
<li><p>A compromised application might gain unrestricted access to all vector data</p></li>
</ul>
<p>As usage grows, relying on informal conventions or shared admin accounts is no longer sustainable. A consistent, enforceable access model becomes essential—and this is exactly what Milvus RBAC provides.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">What is RBAC in Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> is a permission model that controls access based on <strong>roles</strong> rather than individual users. In Milvus, RBAC lets you define exactly which operations a user or service is allowed to perform—and on which specific resources. It provides a structured, scalable way to manage security as your system grows from a single developer to a complete production environment.</p>
<p>Milvus RBAC is built around the following core components:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
    <span>Users Roles Privileges</span>
  </span>
</p>
<ul>
<li><p><strong>Resource</strong>: The entity being accessed. In Milvus, resources include the <strong>instance</strong>, <strong>database</strong>, and <strong>collection</strong>.</p></li>
<li><p><strong>Privilege</strong>: A specific allowed operation on a resource—for example, creating a collection, inserting data, or deleting entities.</p></li>
<li><p><strong>Privilege Group</strong>: A predefined set of related privileges, such as “read-only” or “write.”</p></li>
<li><p><strong>Role</strong>: A combination of privileges and the resources they apply to. A role determines <em>what</em> operations can be performed and <em>where</em>.</p></li>
<li><p><strong>User</strong>: An identity in Milvus. Each user has a unique ID and is assigned one or more roles.</p></li>
</ul>
<p>These components form a clear hierarchy:</p>
<ol>
<li><p><strong>Users are assigned roles</strong></p></li>
<li><p><strong>Roles define privileges</strong></p></li>
<li><p><strong>Privileges apply to specific resources</strong></p></li>
</ol>
<p>A key design principle in Milvus is that <strong>permissions are never assigned directly to users</strong>. All access goes through roles. This indirection simplifies administration, reduces configuration errors, and makes permission changes predictable.</p>
<p>This model scales cleanly in real deployments. When multiple users share a role, updating the role’s privileges instantly updates permissions for all of them—without modifying each user individually. It’s a single point of control aligned with how modern infrastructure manages access.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">How RBAC Works in Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>When a client sends a request to Milvus, the system evaluates it through a series of authorization steps. Each step must pass before the operation is allowed to proceed:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
    <span>How RBAC Works in Milvus</span>
  </span>
</p>
<ol>
<li><p><strong>Authenticate the request:</strong> Milvus first verifies the user identity. If authentication fails, the request is rejected with an authentication error.</p></li>
<li><p><strong>Check role assignment:</strong> After authentication, Milvus checks whether the user has at least one role assigned. If no role is found, the request is rejected with a permission denied error.</p></li>
<li><p><strong>Verify required privileges:</strong> Milvus then evaluates whether the user’s role grants the required privilege on the target resource. If the privilege check fails, the request is rejected with a permission denied error.</p></li>
<li><p><strong>Execute the operation:</strong> If all checks pass, Milvus executes the requested operation and returns the result.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">How to Configure Access Control via RBAC in Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Prerequisites</h3><p>Before RBAC rules can be evaluated and enforced, user authentication must be enabled so that every request to Milvus can be associated with a specific user identity.</p>
<p>Here are two standard deployment methods.</p>
<ul>
<li><strong>Deploying with Docker Compose</strong></li>
</ul>
<p>If Milvus is deployed using Docker Compose, edit the <code translate="no">milvus.yaml</code> configuration file and enable authorization by setting <code translate="no">common.security.authorizationEnabled</code> to <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Deploying with Helm Charts</strong></li>
</ul>
<p>If Milvus is deployed using Helm Charts, edit the <code translate="no">values.yaml</code> file and add the following configuration under <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Initialization</h3><p>By default, Milvus creates a built-in <code translate="no">root</code> user when the system starts. The default password for this user is <code translate="no">Milvus</code>.</p>
<p>As an initial security step, use the <code translate="no">root</code> user to connect to Milvus and change the default password immediately. It is strongly recommended to use a complex password to prevent unauthorized access.</p>
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
<h3 id="3-Core-Operations" class="common-anchor-header">3. Core Operations</h3><p><strong>Create Users</strong></p>
<p>For daily usage, it is recommended to create dedicated users instead of using the <code translate="no">root</code> account.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Create Roles</strong></p>
<p>Milvus provides a built-in <code translate="no">admin</code> role with full administrative privileges. For most production scenarios, however, it is recommended to create custom roles to achieve finer-grained access control.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Create Privilege Groups</strong></p>
<p>A privilege group is a collection of multiple privileges. To simplify permission management, related privileges can be grouped and granted together.</p>
<p>Milvus includes the following built-in privilege groups:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>Using these built-in privilege groups can significantly reduce the complexity of permission design and improve consistency across roles.</p>
<p>You can either use the built-in privilege groups directly or create custom privilege groups as needed.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Grant Privileges or Privilege Groups to Roles</strong></p>
<p>After a role is created, privileges or privilege groups can be granted to the role. The target resources for these privileges can be specified at different levels, including the instance, database, or individual Collections.</p>
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
<p><strong>Grant Roles to Users</strong></p>
<p>Once roles are assigned to a user, the user can access resources and perform the operations defined by those roles. A single user can be granted one or multiple roles, depending on the required access scope.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Inspect and Revoke Access</h3><p><strong>Inspect Roles Assigned to a User</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inspect Privileges Assigned to a Role</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Revoke Privileges from a Role</strong></p>
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
<p><strong>Revoke Roles from a User</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Delete Users and Roles</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Example: Access Control Design for a Milvus-Powered RAG System<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Consider a Retrieval-Augmented Generation (RAG) system built on top of Milvus.</p>
<p>In this system, different components and users have clearly separated responsibilities, and each requires a different level of access.</p>
<table>
<thead>
<tr><th>Actor</th><th>Responsibility</th><th>Required Access</th></tr>
</thead>
<tbody>
<tr><td>Platform Administrator</td><td>System operations and configuration</td><td>Instance-level administration</td></tr>
<tr><td>Vector Ingestion Service</td><td>Vector data ingestion and updates</td><td>Read and write access</td></tr>
<tr><td>Search Service</td><td>Vector search and retrieval</td><td>Read-only access</td></tr>
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
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Quick Tips: How to Operate Access Control Safely in Production<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>To ensure access control remains effective and manageable in long-running production systems, follow these practical guidelines.</p>
<p><strong>1. Change the default</strong> <code translate="no">root</code> <strong>password and limit the use of</strong> <code translate="no">root</code> <strong>account</strong></p>
<p>Update the default <code translate="no">root</code> password immediately after initialization and restrict its use to administrative tasks only. Avoid using or sharing the root account for routine operations. Instead, create dedicated users and roles for day-to-day access to reduce risk and improve accountability.</p>
<p><strong>2. Physically isolate Milvus instances across environments</strong></p>
<p>Deploy separate Milvus instances for development, staging, and production. Physical isolation provides a stronger safety boundary than logical access control alone and significantly reduces the risk of cross-environment mistakes.</p>
<p><strong>3. Follow the principle of least privilege</strong></p>
<p>Grant only the permissions required for each role:</p>
<ul>
<li><p><strong>Development environments:</strong> permissions can be more permissive to support iteration and testing</p></li>
<li><p><strong>Production environments:</strong> permissions should be strictly limited to what is necessary</p></li>
<li><p><strong>Regular audits:</strong> periodically review existing permissions to ensure they are still required</p></li>
</ul>
<p><strong>4. Actively revoke permissions when they are no longer needed</strong></p>
<p>Access control is not a one-time setup—it requires ongoing maintenance. Revoke roles and privileges promptly when users, services, or responsibilities change. This prevents unused permissions from accumulating over time and becoming hidden security risks.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Configuring access control in Milvus is not inherently complex, but it is essential for operating the system safely and reliably in production. With a well-designed RBAC model, you can:</p>
<ul>
<li><p><strong>Reduce risk</strong> by preventing accidental or destructive operations</p></li>
<li><p><strong>Improve security</strong> by enforcing least-privilege access to vector data</p></li>
<li><p><strong>Standardize operations</strong> through a clear separation of responsibilities</p></li>
<li><p><strong>Scale with confidence</strong>, laying the foundation for multi-tenant and large-scale deployments</p></li>
</ul>
<p>Access control is not an optional feature or a one-time task. It is a foundational part of operating Milvus safely over the long term.</p>
<p>👉 Start building a solid security baseline with <a href="https://milvus.io/docs/rbac.md">RBAC</a> for your Milvus deployment.</p>
<p>Have questions or want a deep dive on any feature of the latest Milvus? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
