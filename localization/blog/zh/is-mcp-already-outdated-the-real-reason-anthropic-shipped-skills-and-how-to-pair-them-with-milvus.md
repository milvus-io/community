---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: MCP已经过时了吗？人类运载技能的真正原因--以及如何与 Milvus 配对
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: 了解 Skills 如何发挥作用减少令牌消耗，以及 Skills 和 MCP 如何与 Milvus 合作增强人工智能工作流程。
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>过去几周，X 和 Hacker News 上爆发了一场出人意料的激烈争论：<em>我们真的还需要 MCP 服务器吗？</em>一些开发者声称 MCP 设计过度、过于依赖令牌，而且与 Agents 使用工具的方式根本不符。其他一些人则为 MCP 辩护，认为它是向语言模型展示真实世界功能的可靠方式。根据你阅读的主题，MCP 要么是工具使用的未来，要么就是死路一条。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种沮丧是可以理解的。MCP 为您提供了强大的外部系统访问能力，但同时也迫使模型加载冗长的 Schema、冗长的描述和庞大的工具列表。这增加了实际成本。如果您下载了一份会议记录，然后将其输入到另一个工具中，那么模型可能会多次重新处理相同的文本，从而增加了令牌的使用量，却没有明显的好处。对于大规模操作符的团队来说，这不是不便，而是账单。</p>
<p>但是宣布 MCP 过时还为时过早。Anthropic--发明 MCP 的同一个团队--悄悄推出了新东西：<a href="https://claude.com/blog/skills"><strong>Skills</strong></a>。技能是轻量级的 Markdown/YAML 定义，用于描述工具的使用<em>方式</em>和<em>时间</em>。该模型不会将完整的 Schema 丢入上下文窗口，而是首先读取紧凑的元数据，然后利用这些元数据进行规划。在实践中，Skills 大大减少了令牌开销，并为开发人员提供了对工具协调的更多控制。</p>
<p>那么，这是否意味着 Skills 将取代 MCP 呢？不尽然。技能简化了规划，但 MCP 仍能提供实际功能：读取文件、调用 API、与存储系统交互，或插入外部基础设施（如<a href="https://milvus.io/"><strong>Milvus）</strong></a>，<a href="https://milvus.io/"><strong>Milvus</strong></a> 是一个开源向量数据库，支持大规模快速语义检索，因此当技能需要实际数据访问时，它是一个重要的后端。</p>
<p>本篇文章将介绍技能的优势、MCP 的重要性，以及二者如何融入 Anthropic 不断发展的 Agents 架构。然后，我们将介绍如何构建与 Milvus 无缝集成的自己的技能。</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">什么是 Anthropic Agent Skills？<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>传统人工智能 Agents 的一个长期痛点是，随着对话的增加，指令会被冲淡。</p>
<p>即使有最精心设计的系统提示，模型的行为也会在对话过程中逐渐偏离。几个回合之后，克劳德就会开始忘记或忽略最初的指令。</p>
<p>问题在于系统提示的结构。它是一次性的静态注入，在模型的上下文窗口中与对话历史、文件和其他输入内容一起竞争空间。随着上下文窗口的填满，模型对系统提示的关注会越来越少，从而导致随着时间的推移失去一致性。</p>
<p>技能就是为了解决这个问题而设计的。技能是包含指令、脚本和资源的文件夹。技能不是依赖静态的系统提示，而是将专业知识分解为模块化、可重复使用和持久的指令包，克劳德可以在任务需要时发现并动态加载这些指令包。</p>
<p>当克劳德开始执行一项任务时，它会首先对所有可用技能进行轻量级扫描，只读取它们的 YAML 元数据（只有几十个标记）。这些元数据为 Claude 提供了足够的信息，以确定某个技能是否与当前任务相关。如果相关，克劳德就会扩展到整套指令（通常少于 5ktkens），只有在必要时才会加载额外的资源或脚本。</p>
<p>这种渐进式披露使克劳德只需 30-50 个符号就能初始化一个技能，大大提高了效率并减少了不必要的上下文开销。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">技能与提示、项目、MCP 和子代理的比较<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>当今的模型工具环境可能会让人感觉很拥挤。即使仅在 Claude 的 Agents 生态系统中，也有几个截然不同的组件：技能、提示、项目、子代理和 MCP。</p>
<p>既然我们已经了解了什么是技能以及技能如何通过模块化指令捆绑和动态加载发挥作用，我们就需要了解技能与克劳德生态系统其他部分的关系，尤其是 MCP。以下是总结：</p>
<h3 id="1-Skills" class="common-anchor-header">1.技能</h3><p>技能是包含指令、脚本和资源的文件夹。克劳德使用渐进式披露方法发现并动态加载它们：首先是元数据，然后是完整的指令，最后是任何所需的文件。</p>
<p><strong>最适合</strong></p>
<ul>
<li><p>组织工作流程（品牌指南、合规程序）</p></li>
<li><p>专业领域（Excel 公式、数据分析）</p></li>
<li><p>个人偏好（笔记系统、编码模式）</p></li>
<li><p>需要在不同对话中重复使用的专业任务（基于 OWASP 的代码安全审查）</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2.提示</h3><p>提示是您在对话中向 Claude 发出的自然语言指令。它们是临时的，只存在于当前对话中。</p>
<p><strong>最适合用于</strong></p>
<ul>
<li><p>一次性请求（总结一篇文章、格式化一个列表）</p></li>
<li><p>完善对话（调整语气、添加细节）</p></li>
<li><p>即时语境（分析特定数据、解释内容）</p></li>
<li><p>临时指令</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3.项目</h3><p>项目是独立的工作区，有自己的聊天历史和知识库。每个项目提供一个 200K 的上下文窗口。当项目知识接近上下文限制时，Claude 会无缝过渡到 RAG 模式，使有效容量扩大 10 倍。</p>
<p><strong>最适合</strong></p>
<ul>
<li><p>持久的上下文（例如，与产品发布相关的所有对话）</p></li>
<li><p>工作区组织（不同的计划有不同的上下文）</p></li>
<li><p>团队协作（团队和企业计划）</p></li>
<li><p>自定义指令（针对特定项目的语气或观点）</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4.子代理</h3><p>子代理是专门的人工智能助手，拥有自己的上下文窗口、自定义系统提示和特定的工具权限。它们可以独立工作，并将结果返回给主 Agents。</p>
<p><strong>最适合</strong></p>
<ul>
<li><p>任务专业化（代码审查、测试生成、安全审计）</p></li>
<li><p>上下文管理（保持主对话的集中性）</p></li>
<li><p>并行处理（多个子代理同时处理不同方面的问题）</p></li>
<li><p>工具限制（如只读访问）</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5.MCP（模型上下文协议）</h3><p>模型上下文协议（MCP）是一种开放标准，可将人工智能模型与外部工具和数据源连接起来。</p>
<p><strong>最适合用于</strong></p>
<ul>
<li><p>访问外部数据（Google Drive、Slack、GitHub、数据库）</p></li>
<li><p>使用业务工具（客户关系管理系统、项目管理平台）</p></li>
<li><p>连接开发环境（本地文件、集成开发环境、版本控制）</p></li>
<li><p>与自定义系统（专有工具和数据源）集成</p></li>
</ul>
<p>基于以上所述，我们可以看到，技能和 MCP 应对不同的挑战，并共同发挥作用，相辅相成。</p>
<table>
<thead>
<tr><th><strong>维度</strong></th><th><strong>MCP</strong></th><th><strong>技能</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>核心价值</strong></td><td>连接外部系统（数据库、应用程序接口、SaaS 平台）</td><td>定义行为规范（如何处理和呈现数据）</td></tr>
<tr><td><strong>问题解答</strong></td><td>"克劳德能访问什么？</td><td>"克劳德应该做什么？</td></tr>
<tr><td><strong>实施</strong></td><td>客户端-服务器协议 + JSON Schema</td><td>Markdown 文件 + YAML 元数据</td></tr>
<tr><td><strong>上下文消耗</strong></td><td>数以万计的令牌（多个服务器累积）</td><td>每次操作 30-50 个令牌</td></tr>
<tr><td><strong>使用案例</strong></td><td>查询大型数据库、调用 GitHub API</td><td>定义搜索策略、应用过滤规则、输出格式化</td></tr>
</tbody>
</table>
<p>以代码搜索为例。</p>
<ul>
<li><p><strong>MCP（如 claude-context）：</strong>提供访问 Milvus 向量数据库的能力。</p></li>
<li><p><strong>技能：</strong>定义工作流程，例如优先处理最近修改的代码、按相关性对结果进行排序，以及在 Markdown 表格中展示数据。</p></li>
</ul>
<p>MCP 提供能力，而 Skills 则定义流程。两者相辅相成，相得益彰。</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">如何使用 Claude-Context 和 Milvus 创建自定义技能<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a>是一个 MCP 插件，它为 Claude 代码添加了语义代码搜索功能，将整个代码库转化为 Claude 的上下文。</p>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><p>系统要求</p>
<ul>
<li><p><strong>Node.js</strong>版本 &gt;= 20.0.0 和 &lt; 24.0.0</p></li>
<li><p><strong>OpenAI API 密钥</strong>（用于嵌入模型）</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API 密钥</strong>（管理的 Milvus 服务）</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">第 1 步：配置 MCP 服务 (claude-context)</h3><p>在终端运行以下命令：</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>检查配置：</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP 设置完成。克劳德现在可以访问 Milvus 向量数据库了。</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">第 2 步：创建技能</h3><p>创建技能目录：</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>创建 SKILL.md 文件：</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">第 3 步：重启 Claude 以应用技能</h3><p>运行以下命令重启 Claude：</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>注意：</strong>配置完成后，可以立即使用 Skills 查询 Milvus 代码库。</p>
<p>下面是一个操作示例。</p>
<p>查询：Milvus QueryCoord 如何工作？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>就其核心而言，技能是一种封装和传输专业知识的机制。通过使用技能，人工智能可以继承团队的经验，并遵循行业最佳实践--无论是代码审查核对表还是文档标准。当这些隐性知识通过 Markdown 文件显性化时，人工智能生成的产出质量就会得到显著提高。</p>
<p>展望未来，有效利用技能的能力将成为团队和个人如何利用人工智能发挥优势的关键因素。</p>
<p>当您在组织中探索人工智能的潜力时，Milvus 是管理和搜索大规模向量数据的重要工具。通过将 Milvus 强大的向量数据库与 Skills 等人工智能工具搭配使用，您不仅可以改进工作流程，还可以提高数据驱动型洞察力的深度和速度。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>，与我们的工程师和社区中的其他人工智能工程师聊天。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
