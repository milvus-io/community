---
id: attu-3-0-beta.md
title: |
  Attu 3.0 Beta：多集群管理、AI 代理以及全新重构的 Milvus 控制台
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 测试版对 Milvus 管理控制台进行了全面重构，新增了多集群管理、持久化状态、内置 AI 代理、专家级诊断、实时指标、API
  调试、备份与恢复，以及简化的基于角色的访问控制（RBAC）工作流。
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta 现已发布。</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a>是<a href="https://milvus.io"><strong>Milvus</strong></a> 的开源管理控制台。如果您曾在本地或生产环境中使用过 Milvus，那么您很可能已经使用过 Attu 来查看 Collections、浏览数据、管理 Schemas，或者检查集群内部的运行状况。</p>
<p>Attu 2.x 在基础的单集群管理方面表现良好。但随着 Milvus 部署规模的扩大，其局限性逐渐显现。它每次只能连接一个 Milvus 实例，且容器重启后会丢失连接状态。 数据浏览主要以 Collection 为中心。诊断、监控、API 调试、备份与恢复以及权限管理往往需要单独的工具或手动操作。</p>
<p><strong>Attu 3.0 Beta 是对 Milvus 管理体验的全面重构。</strong></p>
<p>此版本新增了多集群管理、持久化本地状态、内置 AI 代理（包含 50 多种 Milvus 工具）、专家级诊断能力、重新设计的数据浏览器、内置 Prometheus 指标、API 沙盒、基于 GUI 的备份与恢复，以及简化的 RBAC 工作流。</p>
<p>简而言之，Attu 不再仅仅是单个 Milvus 实例的轻量级查看器。它正逐渐成为开发者及团队在本地、预发布和生产环境中管理 Milvus 的实用运维控制台。</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Attu 3.0 Beta 的新变化<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是 Attu 2.x 与 Attu 3.0 Beta 版本的高级对比。</p>
<table>
<thead>
<tr><th>功能</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>集群连接</td><td>仅支持单实例</td><td>支持多个集群，一键切换</td></tr>
<tr><td>状态持久化</td><td>无状态；容器重启后丢失</td><td>本地数据库；重启后数据仍保留</td></tr>
<tr><td>AI 辅助</td><td>无</td><td>内置Agent，支持50多种Milvus工具</td></tr>
<tr><td>诊断</td><td>手动排查</td><td>4项内置专家级诊断技能</td></tr>
<tr><td>RBAC 管理</td><td>独立页面，多步骤流程</td><td>上下文相关、一键创建用户</td></tr>
<tr><td>数据导航</td><td>扁平化Collection列表</td><td>分层树：数据库 → Collection → 分区</td></tr>
<tr><td>监控</td><td>需外部 Grafana 支持</td><td>内置 Prometheus 指标仪表盘</td></tr>
<tr><td>API 调试</td><td>外部工具（如 curl 或 Postman）</td><td>内置 REST API 测试平台</td></tr>
<tr><td>备份与恢复</td><td>仅限 CLI</td><td>支持 S3、MinIO、GCS 和 Azure 的图形界面</td></tr>
<tr><td>LLM 集成</td><td>无</td><td>自带模型（BYOL）：OpenAI、Anthropic、DeepSeek、Gemini 等</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">通过一个侧边栏管理多个 Milvus 集群<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>日常使用中最显著的变化是多集群管理功能。</strong>Attu 3.0 可连接您运行的每个 Milvus 实例，并在单一侧边栏中列出它们。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 侧边栏显示多个 Milvus 连接及其健康指标</p>
<p>在 Attu 2.x 中，从一个 Milvus 集群切换到另一个集群意味着需要断开连接、重新连接并等待。如果您为开发、预发布、生产环境或不同业务线分别设置了独立的集群，通常会导致每个集群都需要一个浏览器标签页。</p>
<p>Attu 3.0 通过一个持久的左侧边栏取代了这种操作流程。所有 Milvus 连接均集中列于一处，旁边配有实时健康状态指示器。绿色圆点表示集群可访问；红色圆点表示集群已下线或不可用。</p>
<p>切换集群只需一次点击。Attu 会保留每个连接的上下文信息，因此您在不同环境之间切换时无需每次重新连接。</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">连接配置更稳健</h3><p>新连接支持 TLS/SSL 加密、令牌认证以及用户名/密码认证。您可以在保存连接前进行测试，将连接详情保存在本地，并在旧环境不再需要时批量清除已断开的连接。</p>
<p><strong>每个集群都有独立的工作区。</strong>概览、数据浏览器、用户管理、指标和操作均限定在当前选定的集群范围内。这大大降低了将预发布环境与生产环境混淆，或在错误位置执行操作的风险。</p>
<p>对于管理多个 Milvus 实例的用户而言，这是 Attu 3.0 中最重要的变更之一。虽然听起来很基础，但它大大减少了日常 Milvus 工作中频繁切换标签页和重新连接带来的操作摩擦。</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">本地状态现可在重启后保留<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x 采用无状态设计。如果容器重启，您保存的连接信息将会消失，您必须重新构建工作区。</p>
<p><strong>Attu 3.0 新增了一个本地数据库，用于持久化集群配置、代理对话历史、自定义技能、LLM 配置以及用户偏好设置。</strong></p>
<p>使用 Docker 运行 Attu 时，请挂载一个卷以保留这些状态：</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>挂载卷后，重启容器不再意味着从零开始。</p>
<p>这对新的 AI 代理同样至关重要。对话历史记录、自定义技能和 LLM 配置均可本地持久化，因此 Attu 成为了一个可长期使用的控制台，而非每次重启后都会重置的临时界面。</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">使用内置 AI 代理以自然语言操作 Milvus<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 包含一个用于管理 Milvus 的内置 AI 代理。这并非文档聊天机器人。<strong>该代理连接了 50 多种 Milvus 工具，因此能够检查集群状态并通过 Attu 执行实际操作。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 AI 代理可通过自然语言请求调用 Milvus 工具</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">覆盖常见 Milvus 工作流的 50 多种内置工具</h3><p>该Agent涵盖日常操作、故障诊断、权限管理及集群管理。您可以提出问题或下达指令，例如：</p>
<table>
<thead>
<tr><th>场景</th><th>示例提示</th></tr>
</thead>
<tbody>
<tr><td>日常操作</td><td>“列出我所有的 Collections。”<br>“创建一个包含 id、title 和 embedding 字段的 Collection。embedding 字段使用维度 768。”<br>“向 my_collection 中插入一些测试数据。”<br>“在 my_collection 中搜索与‘人工智能’最相似的 10 条记录。”</td></tr>
<tr><td>运维与诊断</td><td>“我的集群运行状况如何？”<br>“为什么搜索这么慢？”<br>“哪些 Collections 占用的内存最多？”<br>“最近有查询速度慢的情况吗？”</td></tr>
<tr><td>权限</td><td>“创建一个名为 analyst 的只读用户。”<br>“向 admin 角色授予所有权限。”<br>“检查用户 zhangsan 拥有哪些权限。”</td></tr>
<tr><td>集群管理</td><td>“显示当前的 Milvus 版本和配置。”<br>“列出资源组的使用情况。”<br>“帮我压缩 my_collection。”</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">破坏性操作需要批准</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：破坏性或敏感操作在执行前会显示确认对话框</p>
<p><strong>该代理的设计旨在实现透明且可控。</strong>非破坏性操作（如列出 Collections 或读取指标）会直接返回结果。</p>
<p>破坏性或敏感操作（如删除Collection、清除数据或更改权限）会触发确认对话框。该对话框会列出确切的参数，并在操作执行前等待批准。</p>
<p>您还可以查看代理调用了哪些工具、使用了多少令牌，以及是否有工具调用失败。这对数据库管理代理至关重要。用户应能够理解代理执行了哪些操作，而不仅仅是看到最终结果。</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">从控制台运行专家诊断技能<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>AI 代理自带四个内置诊断技能。</strong>这些是针对常见 Milvus 故障排除场景的引导式工作流，而非通用提示。</p>
<table>
<thead>
<tr><th>诊断技能</th><th>检查内容</th></tr>
</thead>
<tbody>
<tr><td>集群健康诊断</td><td>版本、节点状态、各组件健康状况及关键指标。</td></tr>
<tr><td>搜索性能诊断</td><td>索引完整性、分段碎片、副本平衡以及相关的搜索性能信号。</td></tr>
<tr><td>数据写入诊断</td><td>插入速度慢、数据检查丢失、刷新异常以及写入路径症状。</td></tr>
<tr><td>配置审核</td><td>可能影响稳定性、性能或预期行为的风险设置或错误设置。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 包含内置诊断技能并支持自定义技能</p>
<p>您还可以使用自然语言创建自定义技能。一个技能可以编码为启动前的检查清单、针对特定Collection的数据质量检查，或是您的团队针对已知工作负载运行的诊断流程。</p>
<p>自定义技能本质上是领域知识与操作流程的结合。一旦保存，Agents即可重复使用该技能，而无需每次都依赖一次性提示。</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">自带 LLM 提供商<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 不捆绑或代理任何 LLM 服务。</strong>您可自行配置提供商并掌控模型路径。</p>
<p>支持的提供商选项包括 OpenAI、Anthropic、DeepSeek、Google Gemini、OpenRouter 以及自定义的 OpenAI 兼容端点。</p>
<table>
<thead>
<tr><th>提供商</th><th>示例模型</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>ClaudeOpus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>任何路由模型</td></tr>
<tr><td>自定义端点</td><td>任何与 OpenAI 兼容的 API</td></tr>
</tbody>
</table>
<p>您的 API 密钥在本地加密，不会上传至 Attu 管理的服务。对于希望获得 AI 协助，但仍需控制凭证、数据流和提供商选择的团队而言，这种设计至关重要。</p>
<p>实际上，BYOL（自带模型）使 Agents 可在不同环境中使用。一个团队可能使用 OpenAI，另一个可能使用 Anthropic 模型，第三个则可能通过兼容 OpenAI 的端点进行路由。Attu 不强制要求使用单一模型提供商。</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">通过“数据库 → Collection → 分区”树浏览 Milvus 数据<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 还重新设计了数据浏览器。Attu 2.x 主要呈现的是扁平化的 Collection 列表。一旦集群拥有多个数据库、数十个 Collection 以及分区数据，这种方式便难以使用。</p>
<p><strong>新版浏览器采用与 Milvus 数据组织方式相匹配的层级结构：数据库 → Collection → 分区。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：重新设计的数据浏览器采用分层导航结构，用于管理数据库、Collection和分区</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">数据操作更贴近浏览位置</h3><p>数据浏览器保留了用户已习惯的操作，并在 UI 中直接增加了更多功能：</p>
<ul>
<li>将Collection拖放至另一个数据库。</li>
<li>当配置了Embeddings模型时，可通过直接输入文本执行向量搜索。</li>
<li>查看相似度评分，并通过筛选条件缩小结果范围。</li>
<li>以 CSV、JSON 和 Parquet 格式导入及导出数据。</li>
<li>可视化查看和编辑 Collection Schema，包括对 Dynamic Field 的支持。</li>
<li>创建、删除及查看分区及其统计信息。</li>
<li>管理 Collection 的完整生命周期：创建、加载、释放、复制、重命名、跨数据库移动以及删除。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：支持向量搜索和结果查看的 Attu 3.0 数据浏览器</p>
<p>这些操作大多可通过右键菜单或操作面板实现。对于常见的 Collection 操作，您不再需要在 UI 浏览和命令行操作之间来回切换。</p>
<p>Attu 3.0 也是随着<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a>新功能（如快照和可为空向量）日趋成熟，其 UI 支持将持续更新的产品线。</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">一站式查看操作、指标、慢查询、拓扑和备份<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 在控制台中整合了更多操作信息。</strong>运维与监控区域包含集群概览、实时指标、慢查询分析、拓扑结构以及备份与恢复功能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 运维与监控页面</p>
<p>我们的目标并非取代生产团队现有的所有可观测性系统。团队仍可继续使用 Prometheus、Grafana、日志、警报及其现有的监控栈。我们的目标是让用户能够直接在 Attu 内部解答关于 Milvus 的常见问题。</p>
<table>
<thead>
<tr><th>区域</th><th>功能概览</th></tr>
</thead>
<tbody>
<tr><td>可视化集群概览</td><td>一目了然地查看 Milvus 版本、部署模式、节点数量、数据库数量、Collection 数量、负载状态及配额实体。</td></tr>
<tr><td>实时指标</td><td>查看 QPS、插入/删除速率、查询延迟、缓存命中率以及相关基于 Prometheus 的指标。</td></tr>
<tr><td>慢查询分析</td><td>按类型、持续时间、Collection、时间戳、来源及相关故障排除上下文查看慢查询。</td></tr>
<tr><td>拓扑视图</td><td>了解节点拓扑以及 RootCoord、DataCoord、IndexCoord、QueryCoord 和 Proxy 等组件之间的连接。</td></tr>
<tr><td>备份与恢复</td><td>针对 S3、MinIO、GCS 或 Azure 创建完整或增量备份，并将备份元数据下载为 ZIP 文件，或上传 ZIP 文件进行恢复。</td></tr>
</tbody>
</table>
<p>备份和恢复功能尤为重要，因为它们将此前依赖 CLI 操作的工作流转移到了 GUI 中。这对于本地测试、预发布验证以及希望拥有更清晰恢复路径的团队非常有用。</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">使用内置 API Playground 调试 Milvus REST API<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 新增了 REST API 调试环境，用于 Milvus API 的开发和调试。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 API 沙箱</p>
<p>该 API 沙箱按类别整理了 Milvus 的 REST 端点。选择数据库和 Collection 后，Attu 会自动填充运行上下文。随后，您只需单击一下即可发送请求，并实时查看响应。</p>
<p>当您希望测试 API 调用而无需配置 curl 命令或 Postman Collection 时，此功能非常实用。此外，由于您可以在 UI 上下文与请求正文之间直接切换，因此该工具也有助于了解 Milvus 功能与 REST API 之间的映射关系。</p>
<p>对于应用程序开发人员而言，API Playground 是一个调试平台；对于 Milvus 新用户而言，它是一个学习平台；对于平台团队而言，这是在将操作转化为脚本或应用程序代码之前快速验证操作的一种方式。</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">在数据库或 Collection 旁管理 RBAC<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 改变了 UI 中权限工作流的操作体验。</strong>它不再将<a href="https://milvus.io/docs/rbac.md">RBAC</a>视为独立的管理任务，而是将访问控制更紧密地整合到用户日常操作的数据库和 Collection 标签页中。</p>
<p>底层模型仍是 Milvus RBAC：用户、角色、<a href="https://milvus.io/docs/grant_privileges.md">权限</a>、授予和撤销。Attu 3.0 简化了围绕该模型的操作路径。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图片：Attu 3.0 中的上下文用户和权限管理</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">常见权限范围的一键用户创建</h3><p>在 Attu 2.x 中，为 Collection 开放只读访问通常需要多个步骤：创建用户、创建角色、配置权限、将角色分配给用户，并确保作用域正确。</p>
<p><strong>在 Attu 3.0 中，您可以打开一个 Collection，转到“用户”选项卡，点击“创建用户”，选择“只读”或“读写”，然后让 Attu 完成整个工作流。</strong>它会创建用户、生成安全密码、创建匹配的范围角色，并应用授权。</p>
<p>在数据库层级，同样的模式同样适用。您还可以一键授权现有用户访问当前Collection，或撤销其访问权限。</p>
<p>这种设计使权限管理更贴近受保护的资源。您无需在多个管理页面间来回切换，也无需记住角色命名规范，即可为团队成员授予范围限定访问权限。</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">此测试版对 Attu 用户意味着什么<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta 是自 Attu 首次发布以来，Milvus 管理控制台的最大更新。</strong>这不仅仅是一次界面焕新，更拓展了 Attu 的功能边界。</p>
<p>此次升级的核心在于，Attu 现已契合众多 Milvus 用户的实际工作场景：多集群环境、持久的本地设置、更频繁的数据迁移、更复杂的访问控制、更频繁的故障排查，以及在无需在不同工具间切换的情况下深入理解集群行为的需求。</p>
<p>主要亮点包括：</p>
<ul>
<li>支持健康指标和一键切换的多集群管理。</li>
<li>集群配置、偏好设置、LLM 配置、代理历史记录及自定义技能的持久化本地状态。</li>
<li>内置 AI 代理，支持 50 多种 Milvus 工具，并对破坏性操作设置确认门槛。</li>
<li>四项内置专家诊断技能，分别针对集群健康状况、搜索性能、数据写入及配置审查。</li>
<li>重新设计的数据浏览器，支持数据库 → Collection → 分区导航，并提供更丰富的 Collection 操作。</li>
<li>内置 Prometheus 指标、慢查询分析、拓扑图以及备份与恢复功能。</li>
<li>用于调试和学习 Milvus API 的 REST API 沙盒。</li>
<li>RBAC 工作流不仅可在独立的管理流程中运行，还可直接在数据库或 Collection 旁进行。</li>
</ul>
<p>若您仅将 Attu 用于本地 Milvus 开发，3.0 版本将为您提供功能更强大的控制台。若您管理多个 Milvus 环境，仅多集群和持久化状态的改进就值得尝试。 如果您经常调试性能或权限问题，Agents、诊断、指标以及上下文 RBAC 工作流将立即为您节省时间。</p>
<h2 id="Get-Started" class="common-anchor-header">立即开始<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>使用 Docker 试用 Attu 3.0 Beta：</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>然后打开：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>在侧边栏中添加您的 Milvus 连接，并开始探索全新的控制台。</p>
<p>更喜欢桌面应用？请从<a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a> 下载适用于您平台的版本。Attu 3.0 Beta 提供适用于 macOS、Linux 和 Windows 的桌面包。最新版本还包含一个独立的 Linux 服务器包，支持在不使用 Docker 或 Electron 的情况下运行 Attu。</p>
<p><strong>有疑问吗？</strong>欢迎在<a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a> 频道分享您的多集群部署、自定义代理技能或诊断场景，或预约<a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus 办公时间</strong></a>，与社区成员共同解决问题。</p>
<p><strong>不想自己运维 Milvus 基础设施？</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>是 Milvus 创建者推出的全托管平台。它保留了 Milvus API，并增加了用于实时向量搜索、大规模发现和 AI 数据操作的托管基础设施。 对于有数据主权要求的团队，Zilliz Cloud<strong>BYOC</strong>可在您自己的云账户内运行，这样数据将保留在您的 VPC 中，而 Zilliz 负责处理运维工作。</p>
