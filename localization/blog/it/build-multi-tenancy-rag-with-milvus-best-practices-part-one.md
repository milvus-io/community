---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Designing Multi-Tenancy RAG with Milvus: Best Practices for Scalable
  Enterprise Knowledge Bases
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Over the past couple of years, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> has emerged as a trusted solution for large organizations to enhance their <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM</a>-powered applications, especially those with diverse users. As such applications grow, implementing a multi-tenancy framework becomes essential. <strong>Multi-tenancy</strong> provides secure, isolated access to data for different user groups, ensuring user trust, meeting regulatory standards, and improving operational efficiency.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> is an open-source <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> built to handle high-dimensional <a href="https://zilliz.com/glossary/vector-embeddings">vector data</a>. It is an indispensable infrastructure component of RAG, storing and retrieving contextual information for LLMs from external sources. Milvus offers <a href="https://milvus.io/docs/multi_tenancy.md">flexible multi-tenancy strategies</a> for various needs, including <strong>database-level, collection-level, and partition-level multi-tenancy</strong>.</p>
<p>In this post, we’ll cover:</p>
<ul>
<li><p>What is Multi-Tenancy and Why It Matters</p></li>
<li><p>Multi-Tenancy Strategies in Milvus</p></li>
<li><p>Example: Multi-Tenancy Strategy for a RAG-Powered Enterprise Knowledge Base</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">What is Multi-Tenancy and Why It Matters<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>Multi-tenancy</strong></a> is an architecture where multiple customers or teams, known as &quot;<strong>tenants,</strong>&quot; share a single instance of an application or system. Each tenant’s data and configurations are logically isolated, ensuring privacy and security, while all tenants share the same underlying infrastructure.</p>
<p>Imagine a SaaS platform that provides knowledge-based solutions to multiple companies. Each company is a tenant.</p>
<ul>
<li><p>Tenant A is a healthcare organization storing patient-facing FAQs and compliance documents.</p></li>
<li><p>Tenant B is a tech company managing internal IT troubleshooting workflows.</p></li>
<li><p>Tenant C is a retail business with customer service FAQs for product returns.</p></li>
</ul>
<p>Each tenant operates in a completely isolated environment, ensuring that no data from Tenant A leaks into Tenant B’s system or vice versa. Furthermore, resource allocation, query performance, and scaling decisions are tenant-specific, ensuring high performance regardless of workload spikes in one tenant.</p>
<p>Multi-tenancy also works for systems serving different teams within the same organization. Imagine a large company using a RAG-powered knowledge base to serve its internal departments, such as HR, Legal, and Marketing. Each <strong>department is a tenant</strong> with isolated data and resources in this setup.</p>
<p>Multi-tenancy offers significant benefits, including <strong>cost efficiency, scalability, and robust data security</strong>. By sharing a single infrastructure, service providers can reduce overhead costs and ensure more effective resource consumption. This approach also scales effortlessly—onboarding new tenants requires far fewer resources than creating separate instances for each one, as with single-tenancy models. Importantly, multi-tenancy maintains robust data security by ensuring strict data isolation for each tenant, with access controls and encryption protecting sensitive information from unauthorized access. Additionally, updates, patches, and new features can be deployed across all tenants simultaneously, simplifying system maintenance and reducing the burden on administrators while ensuring that security and compliance standards are consistently upheld.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Multi-Tenancy Strategies in Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>To understand how Milvus supports multi-tenancy, it’s important to first look at how it organizes user data.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">How Milvus Organizes User Data</h3><p>Milvus structures data across three layers, moving from broad to granular: <a href="https://milvus.io/docs/manage_databases.md"><strong>Database</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Collection</strong></a>, and <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partition/Partition Key</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
    <span>Figure- How Milvus organizes user data .png</span>
  </span>
</p>
<p><em>Figure: How Milvus organizes user data</em></p>
<ul>
<li><p><strong>Database</strong>: This acts as a logical container, similar to a database in traditional relational systems.</p></li>
<li><p><strong>Collection</strong>: Comparable to a table within a database, a collection organizes data into manageable groups.</p></li>
<li><p><strong>Partition/Partition Key</strong>: Within a collection, data can be further segmented by <strong>Partitions</strong>. Using a <strong>Partition Key</strong>, data with the same key is grouped together. For example, if you use a <strong>user ID</strong> as the <strong>Partition Key</strong>, all data for a specific user will be stored in the same logical segment. This makes it straightforward to retrieve data tied to individual users.</p></li>
</ul>
<p>As you move from <strong>Database</strong> to <strong>Collection</strong> to <strong>Partition Key</strong>, the granularity of data organization becomes progressively finer.</p>
<p>To ensure stronger data security and proper access control, Milvus also provides robust <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>Role-Based Access Control (RBAC)</strong></a>, allowing administrators to define specific permissions for each user. Only authorized users can access certain data.</p>
<p>Milvus supports <a href="https://milvus.io/docs/multi_tenancy.md">multiple strategies</a> for implementing multi-tenancy, offering flexibility based on the needs of your application: <strong>database-level, collection-level, and partition-level multi-tenancy</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Database-Level Multi-Tenancy</h3><p>With the database-level multi-tenancy approach, each tenant is assigned their own database within the same Milvus cluster. This strategy provides strong data isolation and ensures optimal search performance. However, it can lead to inefficient resource utilization if certain tenants remain inactive.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Collection-Level Multi-Tenancy</h3><p>Here, in collection-level multi-tenancy, we can organize data for tenants in two ways.</p>
<ul>
<li><p><strong>One Collection for All Tenants</strong>: All tenants share a single collection, with tenant-specific fields used for filtering. While simple to implement, this approach can encounter performance bottlenecks as the number of tenants increases.</p></li>
<li><p><strong>One Collection per Tenant</strong>: Each tenant can have a dedicated collection, improving isolation and performance but requiring more resources. This setup may face scalability limitations if the number of tenants exceeds Milvus’s collection capacity.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Partition-Level Multi-Tenancy</h3><p>Partition-Level Multi-Tenancy focuses on organizing tenants within a single collection. Here, we also have two ways to organize tenant data.</p>
<ul>
<li><p><strong>One Partition per Tenant</strong>: Tenants share a collection, but their data is stored in separate partitions. We can isolate data by assigning each tenant a dedicated partition, balancing isolation and search performance. However, this approach is constrained by Milvus’s maximum partition limit.</p></li>
<li><p><strong>Partition-Key-Based Multi-Tenancy</strong>: This is a more scalable option in which a single collection uses partition keys to distinguish tenants. This method simplifies resource management and supports higher scalability but does not support bulk data inserts.</p></li>
</ul>
<p>The table below summarizes the key differences between key multi-tenancy approaches.</p>
<table>
<thead>
<tr><th><strong>Granularity</strong></th><th><strong>Database-level</strong></th><th><strong>Collection-level</strong></th><th><strong>Partition Key-level</strong></th></tr>
</thead>
<tbody>
<tr><td>Max Tenants Supported</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Data Organization Flexibility</td><td>High: Users can define multiple collections with custom schemas.</td><td>Medium: Users are limited to one collection with a custom schema.</td><td>Low: All users share a collection, requiring a consistent schema.</td></tr>
<tr><td>Cost per User</td><td>High</td><td>Medium</td><td>Low</td></tr>
<tr><td>Physical Resource Isolation</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>RBAC</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Search Performance</td><td>Strong</td><td>Medium</td><td>Strong</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Example: Multi-Tenancy Strategy for a RAG-Powered Enterprise Knowledge Base<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>When designing the multi-tenancy strategy for a RAG system, it’s essential to align your approach with the specific needs of your business and your tenants. Milvus offers various multi-tenancy strategies, and choosing the right one depends on the number of tenants, their requirements, and the level of data isolation needed. Here’s a practical guide for making these decisions, taking a  RAG-powered enterprise knowledge base as an example.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Understanding Tenant Structure Before Choosing a Multi-Tenancy Strategy</h3><p>A RAG-powered enterprise knowledge base often serves a small number of tenants. These tenants are usually independent business units like IT, Sales, Legal, and Marketing, each requiring distinct knowledge base services. For example, the HR Department manages sensitive employee information like onboarding guides and benefits policies, which should be confidential and accessible only to HR personnel.</p>
<p>In this case, each business unit should be treated as a separate tenant and a <strong>Database-level multi-tenancy strategy</strong> is often the most suitable. By assigning dedicated databases to each tenant, organizations can achieve strong logical isolation, simplifying management and enhancing security. This setup provides tenants with significant flexibility—they can define custom data models within collections, create as many collections as needed, and independently manage access control for their collections.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Enhancing Security with Physical Resource Isolation</h3><p>In situations where data security is highly prioritized, logical isolation at the database level may not be enough. For example, some business units might handle critical or highly sensitive data, requiring stronger guarantees against interference from other tenants. In such cases, we can implement a <a href="https://milvus.io/docs/resource_group.md">physical isolation approach</a> on top of a database-level multi-tenancy structure.</p>
<p>Milvus enables us to map logical components, such as databases and collections, to physical resources. This method ensures that the activities of other tenants do not impact critical operations. Let’s explore how this approach works in practice.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
    <span>Figure- How Milvus manages physical resources.png</span>
  </span>
</p>
<p>Figure: How Milvus manages physical resources</p>
<p>As shown in the diagram above, there are three layers of resource management in Milvus: <strong>Query Node</strong>, <strong>Resource Group</strong>, and <strong>Database</strong>.</p>
<ul>
<li><p><strong>Query Node</strong>: The component that processes query tasks. It runs on a physical machine or container (e.g., a pod in Kubernetes).</p></li>
<li><p><strong>Resource Group</strong>: A collection of Query Nodes that acts as a bridge between logical components (databases and collections) and physical resources. You can allocate one or more databases or collections to a single Resource Group.</p></li>
</ul>
<p>In the example shown in the diagram above, there are three logical <strong>Databases</strong>: X, Y, and Z.</p>
<ul>
<li><p><strong>Database X</strong>: Contains <strong>Collection A</strong>.</p></li>
<li><p><strong>Database Y</strong>: Contains <strong>Collections B</strong> and <strong>C</strong>.</p></li>
<li><p><strong>Database Z</strong>: Contains <strong>Collections D</strong> and <strong>E</strong>.</p></li>
</ul>
<p>Let’s say <strong>Database X</strong> holds a critical knowledge base that we don’t want to be affected by the load from <strong>Database Y</strong> or <strong>Database Z</strong>. To ensure data isolation:</p>
<ul>
<li><p><strong>Database X</strong> is assigned its own <strong>Resource Group</strong> to guarantee that its critical knowledge base is unaffected by workloads from other databases.</p></li>
<li><p><strong>Collection E</strong> is also allocated to a separate <strong>Resource Group</strong> within its parent database (<strong>Z</strong>). This provides isolation at the collection level for specific critical data within a shared database.</p></li>
</ul>
<p>Meanwhile, the remaining collections in <strong>Databases Y</strong> and <strong>Z</strong> share the physical resources of <strong>Resource Group 2</strong>.</p>
<p>By carefully mapping logical components to physical resources, organizations can achieve a flexible, scalable, and secure multi-tenancy architecture tailored to their specific business needs.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Designing End User-Level Access</h3><p>Now that we’ve learned the best practices for choosing a multi-tenancy strategy for an enterprise RAG, let’s explore how to design user-level access in such systems.</p>
<p>In these systems, end users usually interact with the knowledge base in a read-only mode through LLMs. However, organizations still need to track such Q&amp;A data generated by users and link it to specific users for various purposes, such as improving the knowledge base’s accuracy or offering personalized services.</p>
<p>Take a hospital’s smart consultation service desk as an example. Patients might ask questions like, “Are there any available appointments with the specialist today?” or “Is there any specific preparation needed for my upcoming surgery?” While these questions don’t directly impact the knowledge base, it’s important for the hospital to track such interactions to improve services. These Q&amp;A pairs are usually stored in a separate database (it doesn’t necessarily have to be a vector database) dedicated to logging interactions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
    <span>Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png</span>
  </span>
</p>
<p><em>Figure: The multi-tenancy architecture for an enterprise RAG knowledge base</em></p>
<p>The diagram above shows the multi-tenancy architecture of an enterprise RAG system.</p>
<ul>
<li><p><strong>System Administrators</strong> oversee the RAG system, manage resource allocation, assign databases, map them to resource groups, and ensure scalability. They handle the physical infrastructure, as shown in the diagram, where each resource group (e.g., Resource Group 1, 2, and 3) is mapped to physical servers (query nodes).</p></li>
<li><p><strong>Tenants (Database owners and developers)</strong> manage the knowledge base, iterating on it based on the user-generated Q&amp;A data, as shown in the diagram. Different databases (Database X, Y, Z) contain collections with different knowledge base content (Collection A, B, etc.).</p></li>
<li><p><strong>End Users</strong> interact with the system in a read-only manner through the LLM. As they query the system, their questions are logged in the separate Q&amp;A record table (a separate database), continuously feeding valuable data back into the system.</p></li>
</ul>
<p>This design ensures that each process layer—from user interaction to system administration—works seamlessly, helping the organization build a robust and continuously improving knowledge base.</p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In this blog, we’ve explored how <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> frameworks play a critical role in the scalability, security, and performance of RAG-powered knowledge bases. By isolating data and resources for different tenants, businesses can ensure privacy, regulatory compliance, and optimized resource allocation across a shared infrastructure. <a href="https://milvus.io/docs/overview.md">Milvus</a>, with its flexible multi-tenancy strategies, allows businesses to choose the right level of data isolation—from database level to partition level—depending on their specific needs. Choosing the right multi-tenancy approach ensures companies can provide tailored services to tenants, even when dealing with diverse data and workloads.</p>
<p>By following the best practices outlined here, organizations can effectively design and manage multi-tenancy RAG systems that not only deliver superior user experiences but also scale effortlessly as business needs grow. Milvus’ architecture ensures that enterprises can maintain high levels of isolation, security, and performance, making it a crucial component in building enterprise-grade, RAG-powered knowledge bases.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Stay Tuned for More Insights into Multi-Tenancy RAG<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In this blog, we’ve discussed how Milvus’ multi-tenancy strategies are designed to manage tenants, but not end users within those tenants. End-user interactions usually happen at the application layer, while the vector database itself remains unaware of those users.</p>
<p>You might be wondering: <em>If I want to provide more precise answers based on each end user’s query history, doesn’t Milvus need to maintain a personalized Q&amp;A context for each user?</em></p>
<p>That’s a great question, and the answer really depends on the use case. For example, in an on-demand consultation service, queries are random, and the main focus is on the quality of the knowledge base rather than on keeping track of a user’s historical context.</p>
<p>However, in other cases, RAG systems must be context-aware. When this is required, Milvus needs to collaborate with the application layer to maintain a personalized memory of each user’s context. This design is especially important for applications with massive end users, which we’ll explore in greater detail in my next post. Stay tuned for more insights!</p>
