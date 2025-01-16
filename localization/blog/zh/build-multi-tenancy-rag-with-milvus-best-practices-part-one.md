---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: 利用 Milvus 设计多租户 RAG：可扩展企业知识库的最佳实践
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
<h2 id="Introduction" class="common-anchor-header">简介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>在过去几年中，<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成（RAG）</a>已成为大型企业增强其<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM 驱动的</a>应用程序（尤其是那些拥有不同用户的应用程序）的一种值得信赖的解决方案。随着此类应用的发展，实施多租户框架变得至关重要。<strong>多租户</strong>可为不同用户群提供安全、隔离的数据访问，确保用户信任，满足监管标准，提高操作效率。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>是一个开源<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>，用于处理高维<a href="https://zilliz.com/glossary/vector-embeddings">向量数据</a>。它是 LLMs 不可或缺的基础设施组件，可从外部来源存储和检索 LLMs 的上下文信息。Milvus 针对各种需求提供<a href="https://milvus.io/docs/multi_tenancy.md">灵活的多租户策略</a>，包括<strong>数据库级、Collection 级和分区级多租户</strong>。</p>
<p>在本篇文章中，我们将介绍</p>
<ul>
<li><p>什么是多租户及其重要性</p></li>
<li><p>Milvus 中的多租户策略</p></li>
<li><p>示例：RAG 驱动的企业知识库的多租户策略</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">什么是多租户及其重要性<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>多</strong></a><strong>租户</strong>是指多个客户或团队（称为<strong>&quot;租户</strong>&quot;）共享一个应用程序或系统实例的架构。每个租户的数据和配置在逻辑上是隔离的，以确保隐私和安全，同时所有租户共享相同的底层基础设施。</p>
<p>设想一个 SaaS 平台，为多家公司提供基于知识的解决方案。每家公司都是一个租户。</p>
<ul>
<li><p>租户 A 是一家医疗保健机构，存储面向患者的常见问题和合规文件。</p></li>
<li><p>租户 B 是一家科技公司，管理内部 IT 故障排除工作流。</p></li>
<li><p>租户 C 是一家零售企业，为产品退货提供客户服务常见问题解答。</p></li>
</ul>
<p>每个租户都在完全隔离的环境中运行，确保租户 A 的数据不会泄漏到租户 B 的系统中，反之亦然。此外，资源分配、查询性能和扩展决策都是针对特定租户的，无论某个租户的工作负载是否激增，都能确保高性能。</p>
<p>多租户还适用于为同一组织内不同团队提供服务的系统。想象一下，一家大公司使用由 RAG 驱动的知识库，为人力资源、法律和营销等内部部门提供服务。在这种设置下，每个<strong>部门</strong>都<strong>是一个租户</strong>，拥有独立的数据和资源。</p>
<p>多租户具有显著的优势，包括<strong>成本效益、可扩展性和强大的数据安全性</strong>。通过共享单一基础设施，服务提供商可以降低管理成本，确保更有效地消耗资源。这种方法还可以毫不费力地进行扩展--与单租户模型相比，为每个租户创建独立实例所需的资源要少得多。重要的是，多租户可确保每个租户的数据严格隔离，并通过访问控制和加密保护敏感信息免遭未经授权的访问，从而维护数据的稳健安全性。此外，更新、补丁和新功能可同时部署到所有租户，从而简化了系统维护，减轻了管理员的负担，同时确保安全和合规标准得到始终如一的维护。</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Milvus 的多租户策略<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>要了解 Milvus 如何支持多租户，首先要了解它是如何组织用户数据的。</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Milvus 如何组织用户数据</h3><p>Milvus 的数据结构分为三层，从广义到细分：<a href="https://milvus.io/docs/manage_databases.md"><strong>数据库</strong></a>、<a href="https://milvus.io/docs/manage-collections.md"><strong>Collection</strong></a> 和<a href="https://milvus.io/docs/manage-partitions.md"><strong>Partition/Partition Key</strong></a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>图：Milvus 如何组织用户数据 .png</span> </span></p>
<p><em>图Milvus 如何组织用户数据</em></p>
<ul>
<li><p><strong>数据库</strong>：作为逻辑容器，类似于传统关系系统中的数据库。</p></li>
<li><p><strong>Collections</strong>：与数据库中的表类似，Collections 将数据组织成可管理的组。</p></li>
<li><p><strong>分区/分区键</strong>：在 Collections 中，数据可以通过<strong>分区</strong>进一步分割。使用<strong>分区密钥</strong>，具有相同密钥的数据会被分组在一起。例如，如果使用<strong>用户 ID</strong>作为<strong>分区密钥</strong>，特定用户的所有数据都将存储在同一个逻辑分区中。这样就可以直接检索与单个用户相关的数据。</p></li>
</ul>
<p>从<strong>数据库</strong>到<strong>Collections</strong>再到<strong>Partition Key</strong>，数据组织的粒度逐渐变细。</p>
<p>为确保更强的数据安全性和适当的访问控制，Milvus 还提供强大的<a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>基于角色的访问控制（RBAC）</strong></a>，允许管理员为每个用户定义特定权限。只有经过授权的用户才能访问某些数据。</p>
<p>Milvus 支持实施多租户的<a href="https://milvus.io/docs/multi_tenancy.md">多种策略</a>，可根据应用程序的需求提供灵活性：<strong>数据库级、 Collections 级和分区级多租户</strong>。</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">数据库级多租户</h3><p>使用数据库级多租户方法，每个租户在同一个 Milvus 集群中分配自己的数据库。这种策略可提供强大的数据隔离功能，并确保最佳搜索性能。不过，如果某些租户仍处于不活动状态，则可能导致资源利用效率低下。</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Collections 级多租户</h3><p>在 Collection-level multi-tenancy（集合级多租户）中，我们可以通过两种方式为租户组织数据。</p>
<ul>
<li><p><strong>所有租户共用一个 Collection</strong>：所有租户共享一个 Collection，租户特定字段用于过滤。这种方法虽然实施简单，但随着租户数量的增加，可能会遇到性能瓶颈。</p></li>
<li><p><strong>每个租户一个 Collection</strong>：每个租户可以拥有一个专用的 Collections，从而提高隔离度和性能，但需要更多资源。如果租户数量超过 Milvus 的 Collections 容量，这种设置可能会面临可扩展性限制。</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">分区级多租户</h3><p>分区级多租户主要是在单个 Collections 中组织租户。在这里，我们也有两种组织租户数据的方法。</p>
<ul>
<li><p><strong>每个租户一个分区</strong>：租户共享一个 Collections，但他们的数据存储在不同的分区中。我们可以通过为每个租户分配一个专用分区来隔离数据，从而在隔离和搜索性能之间取得平衡。不过，这种方法受到 Milvus 最大分区限制的制约。</p></li>
<li><p><strong>基于 Partition Key 的多租户</strong>：这是一种可扩展性更强的方案，其中单个 Collections 使用分区 Key 来区分租户。这种方法简化了资源管理，支持更高的可扩展性，但不支持批量数据插入。</p></li>
</ul>
<p>下表总结了关键多租户方法之间的主要区别。</p>
<table>
<thead>
<tr><th><strong>粒度</strong></th><th><strong>数据库级</strong></th><th><strong>Collections 级</strong></th><th><strong>Partition Key 级</strong></th></tr>
</thead>
<tbody>
<tr><td>支持的最大租户数</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>数据组织灵活性</td><td>高：用户可使用自定义 Schema 定义多个 Collection。</td><td>中等：用户只能使用一个具有自定义 Schema 的 Collections。</td><td>低：所有用户共享一个 Collections，需要一致的 Schema。</td></tr>
<tr><td>每个用户的成本</td><td>高</td><td>中</td><td>低</td></tr>
<tr><td>物理资源隔离</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>RBAC</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>搜索性能</td><td>强</td><td>中等</td><td>强</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">示例：RAG 驱动的企业知识库的多租户策略<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>在为 RAG 系统设计多租户策略时，必须根据企业和租户的具体需求调整方法。Milvus 提供多种多租户策略，选择合适的策略取决于租户数量、租户要求以及所需的数据隔离级别。下面以 RAG 驱动的企业知识库为例，介绍如何做出这些决定的实用指南。</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">选择多租户策略前了解租户结构</h3><p>由 RAG 驱动的企业知识库通常为少数租户提供服务。这些租户通常是独立的业务部门，如 IT、销售、法律和营销部门，每个部门都需要不同的知识库服务。例如，人力资源部门管理着入职指南和福利政策等敏感的员工信息，这些信息应该是保密的，只有人力资源部门的人员才能访问。</p>
<p>在这种情况下，每个业务部门都应被视为单独的租户，而<strong>数据库级多租户策略</strong>通常是最合适的。通过为每个租户分配专用数据库，企业可以实现强大的逻辑隔离，简化管理并提高安全性。这种设置为租户提供了极大的灵活性--他们可以在 Collections 中定义自定义数据模型，根据需要创建任意数量的 Collections，并独立管理其 Collections 的访问控制。</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">通过物理资源隔离增强安全性</h3><p>在高度优先考虑数据安全性的情况下，数据库级别的逻辑隔离可能还不够。例如，某些业务部门可能会处理关键或高度敏感的数据，需要更强的保障来防止来自其他租户的干扰。在这种情况下，我们可以在数据库级多租户结构之上实施<a href="https://milvus.io/docs/resource_group.md">物理隔离方法</a>。</p>
<p>Milvus 使我们能够将数据库和 Collections 等逻辑组件映射到物理资源。这种方法可以确保其他租户的活动不会影响关键操作。让我们来探讨一下这种方法在实践中是如何运作的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>图- Milvus 如何管理物理资源.png</span> </span></p>
<p>图Milvus 如何管理物理资源</p>
<p>如上图所示，Milvus 的资源管理分为三层：<strong>查询节点</strong>、<strong>资源组和</strong> <strong>数据库</strong>。</p>
<ul>
<li><p><strong>查询节点</strong>：处理查询任务的组件。它在物理机或容器（如 Kubernetes 中的 pod）上运行。</p></li>
<li><p><strong>资源组</strong>：查询节点的集合，充当逻辑组件（数据库和 Collections）与物理资源之间的桥梁。您可以将一个或多个数据库或集合分配给一个资源组。</p></li>
</ul>
<p>在上图所示的示例中，有三个逻辑<strong>数据库</strong>：X、Y 和 Z。</p>
<ul>
<li><p><strong>数据库 X</strong>：包含<strong>Collections A</strong>。</p></li>
<li><p><strong>数据库 Y</strong>：包含<strong>集合 B</strong>和<strong>C</strong>。</p></li>
<li><p><strong>数据库 Z</strong>：包含<strong>集合 D</strong>和<strong>E</strong>。</p></li>
</ul>
<p>假设<strong>数据库 X</strong>包含一个关键知识库，我们不希望它受到<strong>数据库 Y</strong>或<strong>数据库 Z</strong> 负载的影响：</p>
<ul>
<li><p><strong>数据库 X</strong>被分配到自己的<strong>资源组</strong>，以保证其关键知识库不受其他数据库工作负载的影响。</p></li>
<li><p><strong>Collection E</strong>也被分配到其父数据库<strong>（Z</strong>）内的一个单独<strong>资源组中</strong>。这就在集合级为共享数据库中的特定关键数据提供了隔离。</p></li>
</ul>
<p>同时，<strong>数据库 Y</strong>和<strong>Z</strong>中的其余集合共享资源<strong>组 2</strong> 的物理资源。</p>
<p>通过仔细地将逻辑组件映射到物理资源，企业可以实现灵活、可扩展和安全的多租户架构，以满足其特定的业务需求。</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">设计终端用户级访问</h3><p>既然我们已经了解了为企业 RAG 选择多租户策略的最佳实践，那么让我们来探讨一下如何在此类系统中设计用户级访问。</p>
<p>在这些系统中，终端用户通常通过 LLMs 以只读模式与知识库交互。然而，企业仍然需要跟踪用户生成的此类问答数据，并将其与特定用户联系起来，以实现各种目的，如提高知识库的准确性或提供个性化服务。</p>
<p>以医院的智能咨询服务台为例。患者可能会问这样的问题："今天有专家预约吗？"或 "我即将进行的手术需要做什么特殊准备吗？"虽然这些问题不会直接影响知识库，但对医院来说，跟踪此类互动以改进服务非常重要。这些问答对通常存储在一个单独的数据库中（不一定是向量数据库），专门用于记录交互。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>图- 企业 RAG 知识库的多租户架构 .png</span> </span></p>
<p><em>图企业 RAG 知识库的多租户架构</em></p>
<p>上图显示了企业 RAG 系统的多用户架构。</p>
<ul>
<li><p><strong>系统管理员</strong>负责监督 RAG 系统、管理资源分配、分配数据库、将数据库映射到资源组并确保可扩展性。他们负责处理物理基础设施，如图所示，每个资源组（如资源组 1、2 和 3）都映射到物理服务器（查询节点）。</p></li>
<li><p><strong>租户（数据库所有者和开发人员）</strong>管理知识库，根据用户生成的问答数据对知识库进行迭代，如图所示。不同的数据库（数据库 X、Y、Z）包含不同知识库内容的 Collection（Collection A、B 等）。</p></li>
<li><p><strong>终端用户</strong>通过 LLM 以只读方式与系统交互。当他们查询系统时，他们的问题会被记录在单独的问答记录表（一个单独的数据库）中，不断向系统反馈有价值的数据。</p></li>
</ul>
<p>这种设计可确保从用户交互到系统管理的每个流程层都能无缝运行，从而帮助企业建立一个强大且不断改进的知识库。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在本博客中，我们探讨了<a href="https://milvus.io/docs/multi_tenancy.md"><strong>多租户</strong></a>框架如何在 RAG 驱动的知识库的可扩展性、安全性和性能方面发挥关键作用。通过为不同租户隔离数据和资源，企业可以确保隐私、合规性，并在共享基础设施中优化资源分配。<a href="https://milvus.io/docs/overview.md">Milvus</a> 具有灵活的多租户策略，允许企业根据自身的具体需求选择正确的数据隔离级别--从数据库级别到分区级别。选择正确的多租户方法可确保企业即使在处理不同的数据和工作负载时，也能为租户提供量身定制的服务。</p>
<p>通过遵循这里概述的最佳实践，企业可以有效地设计和管理多租户 RAG 系统，不仅能提供卓越的用户体验，还能随着业务需求的增长而轻松扩展。Milvus 的架构可确保企业保持高水平的隔离性、安全性和性能，使其成为构建企业级 RAG 知识库的重要组成部分。</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">继续关注有关多租户 RAG 的更多见解<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在这篇博客中，我们讨论了 Milvus 的多租户策略是如何设计来管理租户，而不是管理这些租户中的最终用户的。最终用户的交互通常发生在应用层，而向量数据库本身并不知晓这些用户。</p>
<p>你可能想知道<em>如果我想根据每个最终用户的查询历史提供更精确的答案，难道 Milvus 不需要为每个用户维护个性化的问答上下文吗？</em></p>
<p>这是一个很好的问题，答案确实取决于使用案例。例如，在按需咨询服务中，查询是随机的，主要重点是知识库的质量，而不是跟踪用户的历史上下文。</p>
<p>然而，在其他情况下，RAG 系统必须具有上下文感知能力。当需要这样做时，Milvus 需要与应用层协作，以保持对每个用户上下文的个性化记忆。这种设计对于拥有大量终端用户的应用程序尤为重要，我们将在下一篇文章中详细探讨。敬请期待更多见解！</p>
